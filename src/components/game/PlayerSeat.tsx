import { Crown, WifiOff } from 'lucide-react'
import type { Player } from '../../types'
import { PlayerAvatar } from './PlayerAvatar'
import { ScoreBadge } from './ScoreBadge'
import { TurnTimer } from './TurnTimer'

export function PlayerSeat({ player, current = false, compact = false }: { player: Player; current?: boolean; compact?: boolean }) {
  return <div className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 shadow-xl backdrop-blur-md transition-colors ${current ? 'border-marigold bg-marigold text-midnight' : 'border-ivory/15 bg-midnight/90 text-ivory'}`} aria-label={`${player.name}${current ? ', current turn' : ''}`}>
    <PlayerAvatar player={player} size={compact ? 'sm' : 'md'} />
    <div className="min-w-0"><div className="flex items-center gap-1.5"><span className="truncate text-xs font-extrabold">{player.name}</span>{player.dealer && <Crown size={12} aria-label="Dealer" />}{!player.connected && <WifiOff size={12} aria-label="Disconnected" />}</div><div className="mt-1 flex items-center gap-1.5"><ScoreBadge score={player.score} dark={current} />{!compact && <TurnTimer active={current} />}</div></div>
  </div>
}
