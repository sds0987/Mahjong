import { findWaitingTiles } from './handAnalyzer'
import { seededRandom } from './shuffle'
import { tileKey } from './tiles'
import type { ClaimOption, Difficulty, GameState, Tile } from './types'

export interface BotView { hand: Tile[]; meldCount: number; visibleTiles: Tile[]; difficulty: Difficulty; seed: number }
function tileUtility(tile: Tile, hand: Tile[], visible: Tile[]) {
  const same = hand.filter((t) => tileKey(t) === tileKey(tile)).length
  let score = same * 5
  if (tile.kind === 'suit') score += hand.filter((t) => t.kind === 'suit' && t.suit === tile.suit && Math.abs(t.rank! - tile.rank!) <= 2).length * 2
  if (tile.kind === 'honor' && same === 1) score -= 2
  score -= visible.filter((t) => tileKey(t) === tileKey(tile)).length
  return score
}

export function chooseBotDiscard(view: BotView): Tile {
  const random = seededRandom(view.seed)
  if (view.difficulty === 'easy') return view.hand[Math.floor(random() * view.hand.length)]
  const scored = view.hand.map((tile) => {
    let score = tileUtility(tile, view.hand, view.visibleTiles)
    if (view.difficulty === 'hard') {
      const after = view.hand.filter((t) => t.id !== tile.id)
      score -= findWaitingTiles(after).length * 4
    }
    return { tile, score, noise: random() }
  })
  return scored.sort((a, b) => a.score - b.score || a.noise - b.noise)[0].tile
}

export function chooseBotClaim(options: ClaimOption[], seed: number): ClaimOption | null {
  const wins = options.filter((o) => o.type === 'win'); if (wins.length) return wins[0]
  const calls = options.filter((o) => o.type === 'kong' || o.type === 'pong' || o.type === 'chow')
  if (!calls.length) return null
  return seededRandom(seed)() > .22 ? calls[0] : null
}

export function botView(state: GameState, playerIndex: number): BotView {
  return { hand: [...state.players[playerIndex].hand], meldCount: state.players[playerIndex].melds.length, difficulty: state.settings.difficulty, seed: state.seed + state.history.length * 31 + playerIndex, visibleTiles: state.players.flatMap((p) => [...p.discards, ...p.melds.flatMap((m) => m.tiles), ...p.flowers]) }
}
