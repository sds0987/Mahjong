import type { GameEvent, GameState } from './types'

export interface ReplayFile { gameId: string; rulesVersion: string; events: GameEvent[]; states: GameState[] }
export function createReplay(states: GameState[]): ReplayFile { const last = states.at(-1)!; return { gameId: last.id, rulesVersion: last.rulesVersion, events: last.history, states: structuredClone(states) } }
export function replayAt(replay: ReplayFile, index: number) { return structuredClone(replay.states[Math.max(0, Math.min(index, replay.states.length - 1))]) }
