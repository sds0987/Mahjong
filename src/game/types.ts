export type Suit = 'characters' | 'bamboo' | 'dots'
export type Honor = 'east' | 'south' | 'west' | 'north' | 'red' | 'green' | 'white'
export type Bonus = 'plum' | 'orchid' | 'chrysanthemum' | 'bamboo-flower' | 'spring' | 'summer' | 'autumn' | 'winter'

export interface Tile {
  id: string
  kind: 'suit' | 'honor' | 'bonus'
  suit?: Suit
  rank?: number
  honor?: Honor
  bonus?: Bonus
}

export type MeldType = 'chow' | 'pong' | 'kong'
export interface Meld { type: MeldType; tiles: Tile[]; concealed?: boolean; fromPlayer?: number }
export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameSpeed = 'slow' | 'normal' | 'fast'
export type GamePhase = 'setup' | 'awaiting-draw' | 'awaiting-discard' | 'awaiting-claim' | 'hand-complete' | 'match-complete'
export type ClaimType = 'win' | 'kong' | 'pong' | 'chow' | 'pass'

export interface GameSettings {
  displayName: string
  difficulty: Difficulty
  assistance: boolean
  speed: GameSpeed
  theme: string
  matchHands: number
  doubleClickDiscard: boolean
}

export interface PlayerState {
  id: string
  name: string
  isHuman: boolean
  seat: Honor
  score: number
  hand: Tile[]
  melds: Meld[]
  flowers: Tile[]
  discards: Tile[]
}

export interface ClaimOption { type: ClaimType; playerIndex: number; tiles?: Tile[] }
export interface ScoreItem { id: string; label: string; tai: number; explanation: string }
export interface HandResult { winnerIndex: number | null; selfDraw: boolean; items: ScoreItem[]; totalTai: number; reason: string }
export interface GameEvent { id: number; type: string; message: string; playerIndex?: number; tile?: Tile; snapshot?: string }
export interface CompletedHandRecord { handNumber:number; winnerIndex:number|null; selfDraw:boolean; dealInPlayerIndex:number|null; totalTai:number; reason:string }

export interface GameState {
  schemaVersion: 1
  rulesVersion: 'Taiwanese Practice v1'
  id: string
  seed: number
  settings: GameSettings
  players: PlayerState[]
  dealerIndex: number
  currentPlayerIndex: number
  handNumber: number
  completedHands: number
  roundWind: Honor
  phase: GamePhase
  wall: Tile[]
  replacementWall: Tile[]
  latestDiscard: { tile: Tile; playerIndex: number } | null
  claimOptions: ClaimOption[]
  lastDrawnTileId?: string
  result?: HandResult
  history: GameEvent[]
  winnerCounts: number[]
  completedHandResults: CompletedHandRecord[]
  startedAt: string
}

export interface WinContext {
  selfDraw?: boolean
  dealer?: boolean
  concealed?: boolean
  replacementTile?: boolean
  lastLiveTile?: boolean
  seatWind?: Honor
  roundWind?: Honor
}
