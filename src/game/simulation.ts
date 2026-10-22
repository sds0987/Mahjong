import { botView, chooseBotDiscard } from './bots'
import { createGame } from './engine'
import { isWinningHand } from './handAnalyzer'
import { sortTiles } from './tiles'
import type { GameState } from './types'

export function simulateMatch(seed: number, hands = 1): GameState {
  // Lean stress harness: every bot legally passes on claims. Mutating this isolated
  // state keeps a thousand seeded games fast while exercising wall, flowers,
  // draws, legal bot discards and win validation.
  const state = createGame({ matchHands: hands, difficulty: 'easy' }, seed); let guard = 0
  while (state.wall.length && guard++ < 200) {
    const player = state.players[state.currentPlayerIndex]
    if (!player.hand.length) throw new Error(`Empty hand at seed ${seed}`)
    if (isWinningHand(player.hand, player.melds)) {
      if (!isWinningHand(player.hand, player.melds)) throw new Error(`Invalid win at seed ${seed}`)
      state.phase = 'match-complete'; state.result = { winnerIndex: state.currentPlayerIndex, selfDraw: true, items: [], totalTai: 0, reason: 'Validated simulated win' }; break
    }
    const discard = chooseBotDiscard(botView(state, state.currentPlayerIndex))
    const at = player.hand.findIndex((tile) => tile.id === discard.id)
    if (at < 0) throw new Error(`Illegal discard at seed ${seed}`)
    player.discards.push(...player.hand.splice(at, 1))
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % 4
    const next = state.players[state.currentPlayerIndex]
    let drawn = state.wall.shift()
    while (drawn?.kind === 'bonus') { next.flowers.push(drawn); drawn = state.replacementWall.shift() }
    if (drawn) next.hand = sortTiles([...next.hand, drawn])
  }
  if (guard >= 200) throw new Error(`Simulation ${seed} did not terminate`)
  if (state.phase !== 'match-complete') { state.phase = 'match-complete'; state.result = { winnerIndex: null, selfDraw: false, items: [], totalTai: 0, reason: 'Live wall exhausted' } }
  return state
}

export function runSimulations(count = 1000) { for (let seed = 1; seed <= count; seed++) simulateMatch(seed); return count }
