export type TileSuit = 'bamboo' | 'character' | 'circle' | 'wind' | 'dragon' | 'flower' | 'season'
export type TileSize = 'sm' | 'md' | 'lg'

export interface MahjongTileData {
  id: string
  suit: TileSuit
  value: number | string
  label: string
  faceDown?: boolean
  disabled?: boolean
  drawn?: boolean
}

export interface Meld {
  id: string
  type: 'chow' | 'pong' | 'kong'
  tiles: MahjongTileData[]
}

export interface Player {
  id: string
  name: string
  initials: string
  city: string
  score: number
  rating: number
  online: boolean
  ready: boolean
  dealer?: boolean
  connected?: boolean
  accent: string
}

export interface RoomSettings {
  roomName: string
  privateRoom: boolean
  turnTimer: number
  startingPoints: number
  maximumTai: number
  allowSpectators: boolean
}

export interface Room {
  code: string
  hostId: string
  rules: string
  settings: RoomSettings
  players: Array<Player | null>
}

export interface MatchSummary {
  id: string
  result: 'Won' | 'Placed 2nd' | 'Placed 3rd' | 'Placed 4th'
  score: number
  room: string
  playedAt: string
}

export interface ScoreItem {
  label: string
  tai: number
}

export type GameAction = 'Chow' | 'Pong' | 'Kong' | 'Win' | 'Pass'
