import type { Player } from '../../types'

export function PlayerAvatar({ player, size = 'md' }: { player: Player; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-8 w-8 text-[10px]', md: 'h-11 w-11 text-xs', lg: 'h-16 w-16 text-base' }
  return <span className={`relative grid shrink-0 place-items-center rounded-full border-2 border-white/20 font-extrabold text-midnight ${sizes[size]}`} style={{ backgroundColor: player.accent }} aria-label={`${player.name}${player.online ? ', online' : ', offline'}`}>{player.initials}{player.online && <i className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-midnight bg-emerald" aria-hidden="true" />}</span>
}
