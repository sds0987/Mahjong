import type { Bonus, Honor, Suit, Tile } from './types'

export const suits: Suit[] = ['characters', 'bamboo', 'dots']
export const honors: Honor[] = ['east', 'south', 'west', 'north', 'red', 'green', 'white']
export const bonuses: Bonus[] = ['plum', 'orchid', 'chrysanthemum', 'bamboo-flower', 'spring', 'summer', 'autumn', 'winter']

export function tileKey(tile: Tile) {
  if (tile.kind === 'suit') return `${tile.suit}-${tile.rank}`
  return tile.kind === 'honor' ? `honor-${tile.honor}` : `bonus-${tile.bonus}`
}

export function tileLabel(tile: Tile) {
  if (tile.kind === 'suit') return `${tile.rank} ${tile.suit}`
  return (tile.honor ?? tile.bonus ?? '').replace('-', ' ')
}

export function buildWall(): Tile[] {
  const wall: Tile[] = []
  for (const suit of suits) for (let rank = 1; rank <= 9; rank++) for (let copy = 0; copy < 4; copy++)
    wall.push({ id: `${suit}-${rank}-${copy}`, kind: 'suit', suit, rank })
  for (const honor of honors) for (let copy = 0; copy < 4; copy++)
    wall.push({ id: `honor-${honor}-${copy}`, kind: 'honor', honor })
  for (const bonus of bonuses) wall.push({ id: `bonus-${bonus}`, kind: 'bonus', bonus })
  return wall
}

const suitOrder: Record<Suit, number> = { characters: 0, bamboo: 1, dots: 2 }
export function compareTiles(a: Tile, b: Tile) {
  if (a.kind !== b.kind) return ({ suit: 0, honor: 1, bonus: 2 }[a.kind] - { suit: 0, honor: 1, bonus: 2 }[b.kind])
  if (a.kind === 'suit' && b.kind === 'suit') return suitOrder[a.suit!] - suitOrder[b.suit!] || a.rank! - b.rank!
  return tileKey(a).localeCompare(tileKey(b))
}

export const sortTiles = (tiles: Tile[]) => [...tiles].sort(compareTiles)
export const sameTile = (a: Tile, b: Tile) => tileKey(a) === tileKey(b)
