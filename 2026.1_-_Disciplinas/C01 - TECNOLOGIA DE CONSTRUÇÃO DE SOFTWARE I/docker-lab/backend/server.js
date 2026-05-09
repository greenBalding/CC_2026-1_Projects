const http = require('http')
const fs = require('fs')
const path = require('path')

const HOST = '0.0.0.0'
const PORT = Number(process.env.PORT || 3000)
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'games.json')

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2))
  }
}

function readGames() {
  ensureStorage()

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveGames(games) {
  ensureStorage()
  fs.writeFileSync(DATA_FILE, JSON.stringify(games, null, 2))
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
      if (body.length > 1e6) {
        reject(new Error('Body too large'))
      }
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

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)

    if (req.method === 'OPTIONS') {
      sendJson(res, 204, {})
      return
    }

    if (req.method === 'GET' && url.pathname === '/ranking') {
      const games = readGames()
      sendJson(res, 200, computeRanking(games))
      return
    }

    if (req.method === 'GET' && url.pathname === '/games') {
      const limit = Number.parseInt(url.searchParams.get('limit') || '10', 10)
      const games = readGames()
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, Number.isNaN(limit) ? 10 : limit)

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
      const games = readGames()
      const game = {
        id: Date.now(),
        playerX: String(playerX || 'Jogador X').trim() || 'Jogador X',
        playerO: String(playerO || 'Jogador O').trim() || 'Jogador O',
        winner: winner === 'X' || winner === 'O' || winner === 'DRAW' ? winner : 'DRAW',
        moves: Array.isArray(moves) ? moves : [],
        createdAt: new Date().toISOString(),
      }

      games.push(game)
      saveGames(games)

      sendJson(res, 201, { ok: true, game })
      return
    }

    sendJson(res, 404, { ok: false, message: 'Rota nao encontrada' })
  } catch (error) {
    sendJson(res, 500, { ok: false, message: 'Erro interno', detail: error.message })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`Backend rodando em http://${HOST}:${PORT}`)
})