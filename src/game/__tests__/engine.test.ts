import { describe, expect, it } from 'vitest'
import { resolveClaim } from '../claimResolver'
import { createGame, discardTile } from '../engine'
import { chowOptions, isWinningHand } from '../handAnalyzer'
import { deserializeGame, serializeGame } from '../persistence'
import { createReplay, replayAt } from '../replay'
import { shuffle } from '../shuffle'
import { runSimulations } from '../simulation'
import { buildWall, tileKey } from '../tiles'
import type { Tile } from '../types'

const pick = (key: string, copy = 0) => buildWall().find((t) => tileKey(t) === key && t.id.endsWith(`-${copy}`))!

describe('wall and shuffle', () => {
  it('builds the complete 144 physical tile wall', () => {
    const wall = buildWall(); expect(wall).toHaveLength(144); expect(new Set(wall.map((t) => t.id)).size).toBe(144)
    expect(wall.filter((t) => t.kind === 'bonus')).toHaveLength(8)
  })
  it('is deterministic for a seed without mutating the wall', () => {
    const wall = buildWall(); expect(shuffle(wall, 42).map((t) => t.id)).toEqual(shuffle(wall, 42).map((t) => t.id)); expect(wall[0].id).toBe('characters-1-0')
  })
})

describe('Taiwanese hand rules', () => {
  it('recognizes five sets and a pair', () => {
    const tiles: Tile[] = []
    for (const rank of [1, 2, 3, 4, 5, 6, 7, 8, 9]) tiles.push(pick(`characters-${rank}`))
    for (let copy = 0; copy < 3; copy++) tiles.push(pick('honor-east', copy), pick('honor-red', copy))
    tiles.push(pick('dots-5', 0), pick('dots-5', 1))
    expect(tiles).toHaveLength(17); expect(isWinningHand(tiles)).toBe(true)
  })
  it('rejects an incomplete hand and only chows from suited tiles', () => {
    const hand = [pick('bamboo-2'), pick('bamboo-3')]
    expect(chowOptions(hand, pick('bamboo-1'))).toHaveLength(1)
    expect(chowOptions(hand, pick('honor-east'))).toHaveLength(0)
    expect(isWinningHand(hand)).toBe(false)
  })
  it('resolves win before kong/pong/chow', () => {
    expect(resolveClaim([{ type: 'chow', playerIndex: 1 }, { type: 'pong', playerIndex: 2 }, { type: 'win', playerIndex: 3 }], 0)?.type).toBe('win')
  })
})

describe('state, persistence, and replay', () => {
  it('deals 16 tiles and a dealer draw while replacing flowers', () => {
    const game = createGame({}, 12); expect(game.players.map((p) => p.hand.length).sort()).toEqual([16, 16, 16, 17]); expect(game.players.flatMap((p) => p.flowers).every((t) => t.kind === 'bonus')).toBe(true)
  })
  it('round-trips a saved game and replay snapshot', () => {
    const game = createGame({}, 21); const player = game.players[game.currentPlayerIndex]
    const next = discardTile(game, game.currentPlayerIndex, player.hand[0].id)
    expect(deserializeGame(serializeGame(next))).toEqual(next)
    const replay = createReplay([game, next]); expect(replayAt(replay, 1)).toEqual(next)
  })
})

describe('bot safety', () => {
  it('finishes 1000 deterministic hands without illegal state or freeze', () => {
    expect(runSimulations(1000)).toBe(1000)
  }, 30000)
})
