import { useEffect, useMemo, useState } from 'react'
import './App.css'

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const CPU_NAME = 'CPU Minimax'
const MODE_HVH = 'HUMAN_VS_HUMAN'
const MODE_HVC = 'HUMAN_VS_CPU'

function getWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }

  return null
}

function getAvailableMoves(board) {
  return board
    .map((cell, index) => (cell ? null : index))
    .filter((value) => value !== null)
}

function minimax(board, currentPlayer, aiSymbol, humanSymbol, depth = 0) {
  const winner = getWinner(board)

  if (winner === aiSymbol) return { score: 10 - depth }
  if (winner === humanSymbol) return { score: depth - 10 }

  const available = getAvailableMoves(board)
  if (available.length === 0) return { score: 0 }

  const isMaximizing = currentPlayer === aiSymbol
  let best = {
    move: available[0],
    score: isMaximizing ? -Infinity : Infinity,
  }

  for (const move of available) {
    const next = [...board]
    next[move] = currentPlayer

    const result = minimax(
      next,
      currentPlayer === 'X' ? 'O' : 'X',
      aiSymbol,
      humanSymbol,
      depth + 1,
    )

    if (isMaximizing) {
      if (result.score > best.score) best = { move, score: result.score }
    } else if (result.score < best.score) {
      best = { move, score: result.score }
    }
  }

  return best
}

function opposite(symbol) {
  return symbol === 'X' ? 'O' : 'X'
}

function App() {
  const [mode, setMode] = useState(MODE_HVC)
  const [playerOneName, setPlayerOneName] = useState('Jogador 1')
  const [playerTwoName, setPlayerTwoName] = useState('Jogador 2')
  const [playerOneStarts, setPlayerOneStarts] = useState(true)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState('X')
  const [moves, setMoves] = useState([])
  const [history, setHistory] = useState([])
  const [ranking, setRanking] = useState([])
  const [saving, setSaving] = useState(false)

  const isVsCpu = mode === MODE_HVC
  const safePlayerOneName = useMemo(() => playerOneName.trim() || 'Jogador 1', [playerOneName])
  const safePlayerTwoName = useMemo(() => playerTwoName.trim() || 'Jogador 2', [playerTwoName])

  const playerOneSymbol = playerOneStarts ? 'X' : 'O'
  const playerTwoSymbol = opposite(playerOneSymbol)
  const playerTwoEffectiveName = isVsCpu ? CPU_NAME : safePlayerTwoName
  const playerX = playerOneSymbol === 'X' ? safePlayerOneName : playerTwoEffectiveName
  const playerO = playerOneSymbol === 'O' ? safePlayerOneName : playerTwoEffectiveName

  const getPlayerNameBySymbol = (symbol) => (symbol === 'X' ? playerX : playerO)

  const winner = useMemo(() => getWinner(board), [board])
  const isDraw = useMemo(() => !winner && board.every(Boolean), [winner, board])
  const gameOver = winner || isDraw

  const fetchData = async () => {
    try {
      const [rankingRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/ranking`),
        fetch(`${API_BASE}/games?limit=10`),
      ])

      const [rankingJson, historyJson] = await Promise.all([
        rankingRes.json(),
        historyRes.json(),
      ])

      setRanking(Array.isArray(rankingJson) ? rankingJson : [])
      setHistory(Array.isArray(historyJson) ? historyJson : [])
    } catch {
      setRanking([])
      setHistory([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const saveMatch = async (result) => {
    setSaving(true)
    try {
      await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerX,
          playerO,
          winner: result,
          moves,
        }),
      })
      await fetchData()
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!gameOver) return
    saveMatch(winner || 'DRAW')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver])

  useEffect(() => {
    if (!isVsCpu || gameOver || turn !== playerTwoSymbol) return

    const timeoutId = setTimeout(() => {
      const result = minimax(board, playerTwoSymbol, playerTwoSymbol, playerOneSymbol)
      if (result.move === undefined || result.move === null) return

      const next = [...board]
      next[result.move] = playerTwoSymbol

      setBoard(next)
      setMoves((prev) => [...prev, result.move])
      setTurn(playerOneSymbol)
    }, 280)

    return () => clearTimeout(timeoutId)
  }, [board, gameOver, isVsCpu, playerOneSymbol, playerTwoSymbol, turn])

  const play = (index) => {
    if (board[index] || gameOver) return
    if (isVsCpu && turn !== playerOneSymbol) return

    const next = [...board]
    next[index] = turn

    setBoard(next)
    setMoves((prev) => [...prev, index])
    setTurn(opposite(turn))
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setPlayerOneStarts((prev) => !prev)
    setTurn('X')
    setMoves([])
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setBoard(Array(9).fill(null))
    setTurn('X')
    setMoves([])
  }

  const status = winner
    ? `Vencedor: ${getPlayerNameBySymbol(winner)} (${winner})`
    : isDraw
      ? 'Empate!'
      : `Vez de ${getPlayerNameBySymbol(turn)} (${turn})`

  return (
    <main className="layout">
      <section className="game-panel">
        <h1>Jogo da Velha</h1>
        <p className="subtitle">React + NestJS + PostgreSQL</p>

        <div className="mode-row">
          <label>
            Modo de jogo
            <select value={mode} onChange={(e) => handleModeChange(e.target.value)}>
              <option value={MODE_HVC}>Humano vs Minimax</option>
              <option value={MODE_HVH}>2 Humanos</option>
            </select>
          </label>
        </div>

        <div className="players">
          <label>
            Jogador 1
            <input value={playerOneName} onChange={(e) => setPlayerOneName(e.target.value)} maxLength={24} />
          </label>
          <label>
            {isVsCpu ? 'Adversário' : 'Jogador 2'}
            <input
              value={isVsCpu ? CPU_NAME : playerTwoName}
              onChange={(e) => setPlayerTwoName(e.target.value)}
              readOnly={isVsCpu}
              maxLength={24}
            />
          </label>
        </div>

        <small className="hint">
          {isVsCpu ? (
            <>
              Você joga com <strong>{playerOneSymbol}</strong>. Ao clicar em “Nova partida”, quem começa alterna automaticamente.
            </>
          ) : (
            <>
              <strong>{safePlayerOneName}</strong> joga com <strong>{playerOneSymbol}</strong> e{' '}
              <strong>{playerTwoEffectiveName}</strong> com <strong>{playerTwoSymbol}</strong>.
            </>
          )}
        </small>

        <div className="status">{status}</div>

        <div className="board">
          {board.map((cell, idx) => (
            <button key={idx} onClick={() => play(idx)} className="cell">
              {cell}
            </button>
          ))}
        </div>

        <button className="reset" onClick={reset}>
          Nova partida
        </button>

        {saving && <small className="saving">Salvando partida...</small>}
      </section>

      <aside className="side-panel">
        <section className="card">
          <h2>Ranking</h2>
          <ul>
            {ranking.length === 0 && <li>Nenhuma partida ainda.</li>}
            {ranking.map((row) => (
              <li key={row.name}>
                <strong>{row.name}</strong>
                <span>{row.wins} vitórias</span>
                <span>{row.draws} empates</span>
                <span>{row.games} jogos</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Histórico</h2>
          <ul>
            {history.length === 0 && <li>Nenhuma partida registrada.</li>}
            {history.map((g) => (
              <li key={g.id}>
                <div>
                  <strong>{g.playerX}</strong> vs <strong>{g.playerO}</strong>
                </div>
                <div>
                  Resultado:{' '}
                  {g.winner === 'DRAW'
                    ? 'Empate'
                    : `${g.winner === 'X' ? g.playerX : g.playerO} venceu`}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </main>
  )
}

export default App
