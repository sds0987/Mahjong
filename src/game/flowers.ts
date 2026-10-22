import type { Tile } from './types'

export function replaceFlowers(hand: Tile[], replacementWall: Tile[]) {
  const playable: Tile[] = []; const flowers: Tile[] = []; const wall = [...replacementWall]
  const queue = [...hand]
  while (queue.length) {
    const tile = queue.shift()!
    if (tile.kind !== 'bonus') playable.push(tile)
    else { flowers.push(tile); const replacement = wall.shift(); if (replacement) queue.push(replacement) }
  }
  return { hand: playable, flowers, replacementWall: wall }
}
