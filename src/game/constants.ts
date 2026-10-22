import type { GameSettings } from './types'

export const RULES_VERSION = 'Taiwanese Practice v1' as const
export const SCHEMA_VERSION = 1 as const
export const DEAD_WALL_SIZE = 16
export const DEFAULT_MATCH_HANDS = 4
export const TAI_VALUE = 1000
export const SAVE_KEY = 'mahjong-club:practice:v1'
export const TUTORIAL_KEY = 'mahjong-club:tutorial-seen:v1'
export const DEFAULT_SETTINGS: GameSettings = {
  displayName: 'Ananya', difficulty: 'medium', assistance: true, speed: 'normal',
  theme: 'Kolkata Royal', matchHands: DEFAULT_MATCH_HANDS, doubleClickDiscard: true,
}
