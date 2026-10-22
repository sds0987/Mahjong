import type { GameEvent, GameState, Honor, PlayerState, Tile } from './types'

export interface PublicDiscard {
  id: string
  tile: Tile
  playerId: string
  playerName: string
  seatWind: SeatWind
  turnNumber: number
  discardedAt: number
  claimed: boolean
  claimedBy?: string
}

export type SeatWind=Extract<Honor,'east'|'south'|'west'|'north'>

type DiscardPlayer = Pick<PlayerState, 'id' | 'name' | 'seat'>

export function buildPublicDiscards(history: GameEvent[], players: DiscardPlayer[], result?: GameState['result'], latestDiscard?: GameState['latestDiscard']): PublicDiscard[] {
  const claimByTile = new Map<string, number>()
  for (const event of history) if (event.tile && ['chow', 'pong', 'kong'].includes(event.type) && event.playerIndex !== undefined) claimByTile.set(event.tile.id, event.playerIndex)
  if (result?.winnerIndex !== null && result?.winnerIndex !== undefined && !result.selfDraw && latestDiscard) claimByTile.set(latestDiscard.tile.id, result.winnerIndex)
  let turnNumber = 0
  return history.flatMap((event) => {
    if (event.type !== 'discard' || !event.tile || event.playerIndex === undefined) return []
    const player = players[event.playerIndex]
    if (!player) return []
    turnNumber += 1
    const claimedByIndex = claimByTile.get(event.tile.id)
    return [{ id: event.tile.id, tile: event.tile, playerId: player.id, playerName: player.name, seatWind: player.seat as SeatWind, turnNumber, discardedAt: event.id, claimed: claimedByIndex !== undefined, claimedBy: claimedByIndex === undefined ? undefined : players[claimedByIndex]?.name }]
  })
}
