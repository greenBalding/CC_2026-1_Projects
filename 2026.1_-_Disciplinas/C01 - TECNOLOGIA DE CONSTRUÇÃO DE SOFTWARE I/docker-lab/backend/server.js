const http = require('http')
const { Pool } = require('pg')

const HOST = '0.0.0.0'
const PORT = Number(process.env.PORT || 3000)

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'app-database',
})

async function ensureSchema() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        id BIGSERIAL PRIMARY KEY,
        player_x TEXT NOT NULL,
        player_o TEXT NOT NULL,
        winner TEXT CHECK (winner IN ('X', 'O', 'DRAW')),
        moves JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
  } finally {
    client.release()
  }
}

async function waitForDatabase(maxAttempts = 20) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const client = await pool.connect()
      client.release()
      console.log('✓ Conectado ao PostgreSQL')
      return true
    } catch (err) {
      const delay = Math.min(500 * attempt, 3000)
      console.log(`⏳ Tentativa ${attempt}/${maxAttempts} em ${delay}ms... (${err.message})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw new Error('Falha ao conectar ao PostgreSQL após 20 tentativas')
}

async function readGames(limit = 10) {
  const result = await pool.query(
    `SELECT id, player_x as "playerX", player_o as "playerO", winner, moves, created_at as "createdAt" FROM games ORDER BY created_at DESC LIMIT $1`,
    [limit]
  )
  return result.rows
}

async function saveGame(game) {
  const { playerX, playerO, winner, moves } = game
  const result = await pool.query(
    `INSERT INTO games (player_x, player_o, winner, moves) VALUES ($1, $2, $3, $4) RETURNING id, player_x as "playerX", player_o as "playerO", winner, moves, created_at as "createdAt"`,
    [playerX, playerO, winner, JSON.stringify(moves || [])]
  )
  return result.rows[0]
}

function computeRanking(games) {
  const stats = new Map()

  const ensurePlayer = (name) => {
    const key = String(name || '').trim() || 'Jogador'
    if (!stats.has(key)) {
      stats.set(key, { name: key, wins: 0, draws: 0, games: 0 })
    }
    return stats.get(key)
  }

  for (const game of games) {
    const playerX = ensurePlayer(game.playerX)
    const playerO = ensurePlayer(game.playerO)

    playerX.games += 1
    playerO.games += 1

    if (game.winner === 'DRAW') {
      playerX.draws += 1
      playerO.draws += 1
      continue
    }

    if (game.winner === 'X') {
      playerX.wins += 1
    } else if (game.winner === 'O') {
      playerO.wins += 1
    }
  }

  return [...stats.values()].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    if (b.draws !== a.draws) return b.draws - a.draws
    if (b.games !== a.games) return b.games - a.games
    return a.name.localeCompare(b.name)
  })
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(payload))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 1e6) reject(new Error('Body too large'))
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function parseJson(value) {
  try {
    return { ok: true, value: JSON.parse(value) }
  } catch {
    return { ok: false }
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)

    if (req.method === 'OPTIONS') {
      sendJson(res, 204, {})
      return
    }

    if (req.method === 'GET' && url.pathname === '/ranking') {
      const games = await readGames(1000)
      sendJson(res, 200, computeRanking(games))
      return
    }

    if (req.method === 'GET' && url.pathname === '/games') {
      const limit = Number.parseInt(url.searchParams.get('limit') || '10', 10)
      const games = await readGames(Number.isNaN(limit) ? 10 : limit)
      sendJson(res, 200, games)
      return
    }

    if (req.method === 'POST' && url.pathname === '/games') {
      const raw = await readBody(req)
      const parsed = parseJson(raw)

      if (!parsed.ok || !parsed.value || typeof parsed.value !== 'object') {
        sendJson(res, 400, { ok: false, message: 'JSON invalido' })
        return
      }

      const { playerX, playerO, winner, moves } = parsed.value
      const game = {
        playerX: String(playerX || 'Jogador X').trim() || 'Jogador X',
        playerO: String(playerO || 'Jogador O').trim() || 'Jogador O',
        winner: winner === 'X' || winner === 'O' || winner === 'DRAW' ? winner : 'DRAW',
        moves: Array.isArray(moves) ? moves : [],
      }

      const saved = await saveGame(game)
      sendJson(res, 201, { ok: true, game: saved })
      return
    }

    sendJson(res, 404, { ok: false, message: 'Rota nao encontrada' })
  } catch (error) {
    console.error('Erro:', error)
    sendJson(res, 500, { ok: false, message: 'Erro interno', detail: error.message })
  }
})

;(async () => {
  try {
    await waitForDatabase()
    await ensureSchema()
    server.listen(PORT, HOST, () => {
      console.log(`Backend rodando em http://${HOST}:${PORT}`)
    })
  } catch (error) {
    console.error('Erro fatal:', error.message)
    process.exit(1)
  }
})()