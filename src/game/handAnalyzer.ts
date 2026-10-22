import { buildWall, sameTile, tileKey } from './tiles'
import type { Meld, Tile } from './types'

function countsFor(tiles: Tile[]) {
  const map = new Map<string, number>()
  for (const tile of tiles.filter((t) => t.kind !== 'bonus')) map.set(tileKey(tile), (map.get(tileKey(tile)) ?? 0) + 1)
  return map
}

function canFormSets(counts: Map<string, number>, setsNeeded: number, memo = new Map<string, boolean>()): boolean {
  if (!setsNeeded) return [...counts.values()].every((n) => n === 0)
  const first = [...counts.entries()].find(([, n]) => n > 0)
  if (!first) return false
  const key = `${setsNeeded}|${[...counts.entries()].filter(([, n]) => n).map(([k, n]) => `${k}:${n}`).join(',')}`
  if (memo.has(key)) return memo.get(key)!
  const [name, count] = first
  if (count >= 3) {
    counts.set(name, count - 3)
    if (canFormSets(counts, setsNeeded - 1, memo)) { counts.set(name, count); memo.set(key, true); return true }
    counts.set(name, count)
  }
  const match = /^(characters|bamboo|dots)-(\d)$/.exec(name)
  if (match) {
    const rank = Number(match[2]); const next = `${match[1]}-${rank + 1}`; const next2 = `${match[1]}-${rank + 2}`
    if (rank <= 7 && (counts.get(next) ?? 0) > 0 && (counts.get(next2) ?? 0) > 0) {
      counts.set(name, count - 1); counts.set(next, counts.get(next)! - 1); counts.set(next2, counts.get(next2)! - 1)
      if (canFormSets(counts, setsNeeded - 1, memo)) { counts.set(name, count); counts.set(next, counts.get(next)! + 1); counts.set(next2, counts.get(next2)! + 1); memo.set(key, true); return true }
      counts.set(name, count); counts.set(next, counts.get(next)! + 1); counts.set(next2, counts.get(next2)! + 1)
    }
  }
  memo.set(key, false); return false
}

export function isWinningHand(tiles: Tile[], melds: Meld[] = []): boolean {
  const playable = tiles.filter((t) => t.kind !== 'bonus')
  const setsNeeded = 5 - melds.length
  if (playable.length !== setsNeeded * 3 + 2) return false
  const counts = countsFor(playable)
  for (const [key, count] of counts) if (count >= 2) {
    counts.set(key, count - 2)
    if (canFormSets(counts, setsNeeded)) { counts.set(key, count); return true }
    counts.set(key, count)
  }
  return false
}

export function findWaitingTiles(tiles: Tile[], melds: Meld[] = []): string[] {
  const uniques = new Map<string, Tile>()
  for (const tile of buildWall().filter((t) => t.kind !== 'bonus')) uniques.set(tileKey(tile), tile)
  return [...uniques].filter(([key, tile]) => tiles.filter((t) => tileKey(t) === key).length < 4 && isWinningHand([...tiles, tile], melds)).map(([key]) => key)
}

export const canPong = (hand: Tile[], tile: Tile) => hand.filter((t) => sameTile(t, tile)).length >= 2
export const canExposedKong = (hand: Tile[], tile: Tile) => hand.filter((t) => sameTile(t, tile)).length >= 3

export function chowOptions(hand: Tile[], tile: Tile): Tile[][] {
  if (tile.kind !== 'suit') return []
  const result: Tile[][] = []
  for (const ranks of [[tile.rank! - 2, tile.rank! - 1], [tile.rank! - 1, tile.rank! + 1], [tile.rank! + 1, tile.rank! + 2]]) {
    if (ranks.some((r) => r < 1 || r > 9)) continue
    const selected: Tile[] = []
    for (const rank of ranks) { const found = hand.find((t) => t.kind === 'suit' && t.suit === tile.suit && t.rank === rank && !selected.includes(t)); if (found) selected.push(found) }
    if (selected.length === 2) result.push(selected)
  }
  return result
}

export function concealedKongs(hand: Tile[]) {
  const counts = countsFor(hand); return [...counts].filter(([, n]) => n === 4).map(([key]) => key)
}

export function addedKongs(hand: Tile[], melds: Meld[]) {
  return melds.filter((m) => m.type === 'pong').filter((m) => hand.some((t) => tileKey(t) === tileKey(m.tiles[0]))).map((m) => tileKey(m.tiles[0]))
}
