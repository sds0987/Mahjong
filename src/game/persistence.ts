import { SAVE_KEY, SCHEMA_VERSION } from './constants'
import type { GameState } from './types'

export function serializeGame(state: GameState) { return JSON.stringify(state) }
export function deserializeGame(value: string | null): GameState | null {
  if (!value) return null
  try { const data = JSON.parse(value) as GameState; return data.schemaVersion === SCHEMA_VERSION && Array.isArray(data.players) && data.players.length === 4 ? data : null } catch { return null }
}
export function saveGame(state: GameState, storage: Pick<Storage, 'setItem'> = localStorage) { storage.setItem(SAVE_KEY, serializeGame(state)) }
export function loadGame(storage: Pick<Storage, 'getItem'> = localStorage) { return deserializeGame(storage.getItem(SAVE_KEY)) }
export function clearGame(storage: Pick<Storage, 'removeItem'> = localStorage) { storage.removeItem(SAVE_KEY) }
export function hasSavedGame(storage: Pick<Storage, 'getItem'> = localStorage) { return Boolean(loadGame(storage)) }
