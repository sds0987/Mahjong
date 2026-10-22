import type { ClaimOption } from './types'

const priority = { win: 4, kong: 3, pong: 2, chow: 1, pass: 0 }
export function resolveClaim(claims: ClaimOption[], discarder: number): ClaimOption | null {
  const eligible = claims.filter((c) => c.type !== 'pass')
  return eligible.sort((a, b) => priority[b.type] - priority[a.type] || ((a.playerIndex - discarder + 4) % 4) - ((b.playerIndex - discarder + 4) % 4))[0] ?? null
}
