import { isWinningHand } from './handAnalyzer'
import { tileKey } from './tiles'
import type { Meld, ScoreItem, Tile, WinContext } from './types'

const item = (id: string, label: string, tai: number, explanation: string): ScoreItem => ({ id, label, tai, explanation })

export function scoreHand(hand: Tile[], melds: Meld[], flowers: Tile[], context: WinContext = {}): ScoreItem[] {
  if (!isWinningHand(hand, melds)) return []
  const all = [...hand, ...melds.flatMap((m) => m.tiles)]
  const result: ScoreItem[] = [item('win', 'Winning hand', 1, 'Five sets and one pair.')]
  if (context.selfDraw) result.push(item('self-draw', 'Self draw', 1, 'Won with a tile drawn from the wall.'))
  if (context.dealer) result.push(item('dealer', 'Dealer', 1, 'The dealer completed the hand.'))
  if (!flowers.length) result.push(item('no-flowers', 'No flowers', 1, 'Completed the hand without bonus tiles.'))
  if (flowers.length === 8) result.push(item('all-flowers', 'All flowers', 8, 'Collected every flower and season.'))
  else {
    const groups = [flowers.filter((t) => ['plum', 'orchid', 'chrysanthemum', 'bamboo-flower'].includes(t.bonus!)), flowers.filter((t) => ['spring', 'summer', 'autumn', 'winter'].includes(t.bonus!))]
    if (groups.some((g) => g.length === 4)) result.push(item('flower-set', 'Complete flower set', 2, 'Collected all four tiles in a flower group.'))
    const seatNumber = ({ east: 0, south: 1, west: 2, north: 3 } as Record<string, number>)[context.seatWind ?? 'east']
    if (flowers.some((t) => [t.bonus, t.bonus].some(() => ['plum', 'orchid', 'chrysanthemum', 'bamboo-flower'][seatNumber] === t.bonus || ['spring', 'summer', 'autumn', 'winter'][seatNumber] === t.bonus))) result.push(item('seat-flower', 'Seat flower', 1, 'A flower matching the player seat.'))
  }
  const suited = all.filter((t) => t.kind === 'suit'); const honor = all.some((t) => t.kind === 'honor')
  const uniqueSuits = new Set(suited.map((t) => t.suit))
  if (uniqueSuits.size === 1 && !honor) result.push(item('full-flush', 'Full flush', 8, 'Only one numbered suit, with no honors.'))
  else if (uniqueSuits.size === 1 && honor) result.push(item('half-flush', 'Half flush', 4, 'One numbered suit plus honors.'))
  if (!suited.length) result.push(item('all-honors', 'All honors', 12, 'Every tile is a wind or dragon.'))
  const allSets = [...melds, ...inferSets(hand)]
  if (allSets.length === 5 && allSets.every((m) => m.type !== 'chow')) result.push(item('all-pongs', 'All pongs', 4, 'Every set is a pong or kong.'))
  if (context.concealed && melds.every((m) => m.concealed)) result.push(item('concealed', 'Concealed hand', 2, 'No exposed calls were made.'))
  if (context.replacementTile) result.push(item('replacement', 'Kong replacement win', 1, 'Won using a replacement tile after a kong.'))
  if (context.lastLiveTile) result.push(item('last-tile', 'Last live tile', 1, 'Won on the final live-wall tile.'))
  return result
}

function inferSets(hand: Tile[]): Meld[] {
  const counts = new Map<string, Tile[]>()
  for (const tile of hand) counts.set(tileKey(tile), [...(counts.get(tileKey(tile)) ?? []), tile])
  return [...counts.values()].filter((tiles) => tiles.length >= 3).map((tiles) => ({ type: 'pong' as const, tiles: tiles.slice(0, 3) }))
}
