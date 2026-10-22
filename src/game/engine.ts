import { chooseBotClaim } from './bots'
import { resolveClaim } from './claimResolver'
import { DEAD_WALL_SIZE, DEFAULT_SETTINGS, RULES_VERSION, SCHEMA_VERSION, TAI_VALUE } from './constants'
import { concealedKongs, isWinningHand } from './handAnalyzer'
import { legalClaims } from './legalActions'
import { scoreHand } from './scoring'
import { secureSeed, shuffle } from './shuffle'
import { buildWall, sameTile, sortTiles, tileKey, tileLabel } from './tiles'
import type { ClaimOption, GameSettings, GameState, Meld, PlayerState, Tile } from './types'

const seats = ['east', 'south', 'west', 'north'] as const
const botNames = ['Kabir', 'Meera', 'Dev']
const clone = <T,>(value: T): T => structuredClone(value)

function record(state: GameState, type: string, message: string, playerIndex?: number, tile?: Tile): GameState {
  const next = clone(state)
  next.history.push({ id: next.history.length, type, message, playerIndex, tile })
  return next
}

export function createGame(settings: Partial<GameSettings> = {}, seed = secureSeed()): GameState {
  const chosen = { ...DEFAULT_SETTINGS, ...settings }
  const dealerIndex = seed % 4
  const players: PlayerState[] = [chosen.displayName, ...botNames].map((name, index) => ({
    id: index ? `bot-${index}` : 'human', name, isHuman: index === 0, seat: seats[index], score: 30000,
    hand: [], melds: [], flowers: [], discards: [],
  }))
  return startHand({ schemaVersion: SCHEMA_VERSION, rulesVersion: RULES_VERSION, id: `practice-${seed.toString(36)}`, seed, settings: chosen, players, dealerIndex, currentPlayerIndex: dealerIndex, handNumber: 1, completedHands: 0, roundWind: 'east', phase: 'setup', wall: [], replacementWall: [], latestDiscard: null, claimOptions: [], history: [], winnerCounts: [0, 0, 0, 0], completedHandResults: [], startedAt: new Date().toISOString() })
}

export function startHand(input: GameState): GameState {
  let state = clone(input)
  state.players = state.players.map((p, index) => ({ ...p, seat: seats[(index - state.dealerIndex + 4) % 4], hand: [], melds: [], flowers: [], discards: [] }))
  const shuffled = shuffle(buildWall(), state.seed + state.handNumber * 7919)
  state.replacementWall = shuffled.slice(-DEAD_WALL_SIZE)
  state.wall = shuffled.slice(0, -DEAD_WALL_SIZE)
  const drawPlayable = (player: PlayerState) => {
    while (true) {
      let tile = state.wall.shift()
      if (!tile) return
      if (tile.kind !== 'bonus') { player.hand.push(tile); return }
      player.flowers.push(tile)
      tile = state.replacementWall.shift()
      while (tile?.kind === 'bonus') { player.flowers.push(tile); tile = state.replacementWall.shift() }
      if (tile) { player.hand.push(tile); return }
    }
  }
  for (let round = 0; round < 16; round++) for (const player of state.players) drawPlayable(player)
  state.players.forEach((p) => { p.hand = sortTiles(p.hand) })
  state.currentPlayerIndex = state.dealerIndex; state.phase = 'awaiting-draw'; state.latestDiscard = null; state.claimOptions = []; delete state.result
  state = record(state, 'hand-start', `Hand ${state.handNumber} begins. ${state.players[state.dealerIndex].name} is dealer.`)
  return drawTile(state)
}

export function drawTile(input: GameState, replacement = false): GameState {
  if (input.phase !== 'awaiting-draw') return input
  let state = clone(input); let player = state.players[state.currentPlayerIndex]
  let tile = (replacement ? state.replacementWall : state.wall).shift()
  if (!tile) return finishHand(state, null, false, 'The live wall is exhausted.')
  while (tile?.kind === 'bonus') {
    player.flowers.push(tile); state = record(state, 'flower', `${player.name} reveals ${tileLabel(tile)}.`, state.currentPlayerIndex, tile); player = state.players[state.currentPlayerIndex]
    tile = state.replacementWall.shift()
  }
  if (!tile) return finishHand(state, null, false, 'The replacement wall is exhausted.')
  player.hand = sortTiles(player.hand); player.hand.push(tile); state.lastDrawnTileId = tile.id; state.phase = 'awaiting-discard'; state.latestDiscard = null; state.claimOptions = []
  return record(state, 'draw', `${player.name} draws a tile.`, state.currentPlayerIndex)
}

export function discardTile(input: GameState, playerIndex: number, tileId: string): GameState {
  if (input.phase !== 'awaiting-discard' || input.currentPlayerIndex !== playerIndex) return input
  let state = clone(input); const player = state.players[playerIndex]; const index = player.hand.findIndex((t) => t.id === tileId)
  if (index < 0) return input
  const [tile] = player.hand.splice(index, 1); player.discards.push(tile); delete state.lastDrawnTileId
  state.latestDiscard = { tile, playerIndex }; state.phase = 'awaiting-claim'
  state = record(state, 'discard', `${player.name} discards ${tileLabel(tile)}.`, playerIndex, tile)
  state.claimOptions = legalClaims(state)
  return state
}

function takeMatching(player: PlayerState, tile: Tile, amount: number): Tile[] {
  const taken: Tile[] = []
  for (let i = player.hand.length - 1; i >= 0 && taken.length < amount; i--) if (sameTile(player.hand[i], tile)) taken.push(...player.hand.splice(i, 1))
  return taken
}

export function applyClaim(input: GameState, claim: ClaimOption | null): GameState {
  if (input.phase !== 'awaiting-claim' || !input.latestDiscard) return input
  const latest = input.latestDiscard
  let state = clone(input); const discarded = latest.tile; const discarder = latest.playerIndex
  if (!claim || claim.type === 'pass') {
    state.currentPlayerIndex = (discarder + 1) % 4; state.phase = 'awaiting-draw'; state.claimOptions = []; state.latestDiscard = null
    return drawTile(record(state, 'pass', 'No player calls the discard.'))
  }
  if (!state.claimOptions.some((o) => o.playerIndex === claim.playerIndex && o.type === claim.type)) return input
  if (claim.type === 'win') return declareWin(state, claim.playerIndex, false)
  const player = state.players[claim.playerIndex]; const meldTiles = [discarded]
  if (claim.type === 'chow') {
    const chosen = claim.tiles ?? state.claimOptions.find((o) => o.playerIndex === claim.playerIndex && o.type === 'chow')?.tiles ?? []
    for (const selected of chosen) { const at = player.hand.findIndex((t) => t.id === selected.id); if (at >= 0) meldTiles.push(...player.hand.splice(at, 1)) }
  } else meldTiles.push(...takeMatching(player, discarded, claim.type === 'kong' ? 3 : 2))
  const type = claim.type as Meld['type']; player.melds.push({ type, tiles: sortTiles(meldTiles), fromPlayer: discarder })
  state.players[discarder].discards.pop(); state.currentPlayerIndex = claim.playerIndex; state.latestDiscard = null; state.claimOptions = []
  state.phase = type === 'kong' ? 'awaiting-draw' : 'awaiting-discard'
  state = record(state, type, `${player.name} calls ${type}.`, claim.playerIndex, discarded)
  return type === 'kong' ? drawTile(state, true) : state
}

export function resolveBotClaims(state: GameState): GameState {
  if (state.phase !== 'awaiting-claim' || !state.latestDiscard) return state
  const latest = state.latestDiscard
  const decisions = state.claimOptions.filter((o) => !state.players[o.playerIndex].isHuman).filter((o) => chooseBotClaim([o], state.seed + state.history.length + o.playerIndex))
  return applyClaim(state, resolveClaim(decisions, latest.playerIndex))
}

export function declareConcealedKong(input: GameState, playerIndex: number, key?: string): GameState {
  if (input.phase !== 'awaiting-discard' || input.currentPlayerIndex !== playerIndex) return input
  const keys = concealedKongs(input.players[playerIndex].hand); const chosen = key ?? keys[0]
  if (!chosen || !keys.includes(chosen)) return input
  let state = clone(input); const player = state.players[playerIndex]; const tiles = player.hand.filter((t) => tileKey(t) === chosen)
  player.hand = player.hand.filter((t) => tileKey(t) !== chosen); player.melds.push({ type: 'kong', tiles, concealed: true }); state.phase = 'awaiting-draw'
  return drawTile(record(state, 'kong', `${player.name} declares a concealed kong.`, playerIndex), true)
}

export function declareAddedKong(input: GameState, playerIndex: number, key: string): GameState {
  if (input.phase !== 'awaiting-discard' || input.currentPlayerIndex !== playerIndex) return input
  const state = clone(input); const player = state.players[playerIndex]
  const meld = player.melds.find((m) => m.type === 'pong' && tileKey(m.tiles[0]) === key)
  const tileIndex = player.hand.findIndex((t) => tileKey(t) === key)
  if (!meld || tileIndex < 0) return input
  meld.type = 'kong'; meld.tiles.push(...player.hand.splice(tileIndex, 1)); state.phase = 'awaiting-draw'
  return drawTile(record(state, 'kong', `${player.name} adds to a pong to make a kong.`, playerIndex), true)
}

export function declareWin(input: GameState, playerIndex: number, selfDraw: boolean): GameState {
  const state = clone(input); const player = state.players[playerIndex]
  const winningHand = selfDraw ? player.hand : [...player.hand, state.latestDiscard!.tile]
  if (!isWinningHand(winningHand, player.melds)) return input
  const items = scoreHand(winningHand, player.melds, player.flowers, { selfDraw, dealer: playerIndex === state.dealerIndex, concealed: player.melds.every((m) => m.concealed), seatWind: player.seat, roundWind: state.roundWind, lastLiveTile: state.wall.length === 0 })
  const tai = items.reduce((sum, score) => sum + score.tai, 0); const points = tai * TAI_VALUE
  if (selfDraw) state.players.forEach((opponent, i) => { if (i !== playerIndex) { opponent.score -= points; player.score += points } })
  else { const payer = state.latestDiscard!.playerIndex; state.players[payer].score -= points * 3; player.score += points * 3 }
  state.winnerCounts[playerIndex]++; return finishHand(state, playerIndex, selfDraw, `${player.name} wins with ${tai} tai.`, items)
}

export function finishHand(input: GameState, winnerIndex: number | null, selfDraw: boolean, reason: string, items = [] as ReturnType<typeof scoreHand>): GameState {
  let state = clone(input); state.completedHands++; state.result = { winnerIndex, selfDraw, items, totalTai: items.reduce((sum, score) => sum + score.tai, 0), reason }
  state.completedHandResults ??= []
  state.completedHandResults.push({handNumber:state.handNumber,winnerIndex,selfDraw,dealInPlayerIndex:winnerIndex!==null&&!selfDraw&&state.latestDiscard?state.latestDiscard.playerIndex:null,totalTai:state.result.totalTai,reason})
  state.phase = state.completedHands >= state.settings.matchHands ? 'match-complete' : 'hand-complete'; state.claimOptions = []
  return record(state, winnerIndex === null ? 'draw-game' : 'win', reason, winnerIndex ?? undefined)
}

export function startNextHand(input: GameState): GameState {
  if (input.phase !== 'hand-complete') return input
  const state = clone(input); if (state.result?.winnerIndex !== state.dealerIndex) state.dealerIndex = (state.dealerIndex + 1) % 4
  state.handNumber++; return startHand(state)
}

export function humanClaimOptions(state: GameState) { return state.claimOptions.filter((o) => state.players[o.playerIndex].isHuman) }
export function canPlayerWin(state: GameState, playerIndex: number) { const player = state.players[playerIndex]; return state.currentPlayerIndex === playerIndex && state.phase === 'awaiting-discard' && isWinningHand(player.hand, player.melds) }
export function canHumanWin(state: GameState) { return canPlayerWin(state, 0) }
