import { canExposedKong, canPong, chowOptions, concealedKongs, isWinningHand } from './handAnalyzer'
import type { ClaimOption, GameState } from './types'

export function legalSelfActions(state: GameState, playerIndex: number): string[] {
  if (state.currentPlayerIndex !== playerIndex || state.phase !== 'awaiting-discard') return []
  const player = state.players[playerIndex]
  const actions = ['discard']
  if (isWinningHand(player.hand, player.melds)) actions.push('win')
  if (concealedKongs(player.hand).length) actions.push('kong')
  return actions
}

export function legalClaims(state: GameState): ClaimOption[] {
  const latest = state.latestDiscard
  if (!latest) return []
  const result: ClaimOption[] = []
  state.players.forEach((player, playerIndex) => {
    if (playerIndex === latest.playerIndex) return
    if (isWinningHand([...player.hand, latest.tile], player.melds)) result.push({ type: 'win', playerIndex })
    // The fifth set can only be completed as part of a winning declaration;
    // another ordinary call would leave only the pair and no legal discard.
    if (player.melds.length >= 4) return
    if (player.hand.length > 3 && canExposedKong(player.hand, latest.tile)) result.push({ type: 'kong', playerIndex })
    else if (player.hand.length > 2 && canPong(player.hand, latest.tile)) result.push({ type: 'pong', playerIndex })
    if (player.hand.length > 2 && playerIndex === (latest.playerIndex + 1) % 4) for (const tiles of chowOptions(player.hand, latest.tile)) result.push({ type: 'chow', playerIndex, tiles })
  })
  return result
}
