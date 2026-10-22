import type { Meld } from '../../types'
import { MahjongTile } from './MahjongTile'

export function MeldGroup({ meld, highContrast = false }: { meld: Meld; highContrast?: boolean }) {
  return <div className="rounded-lg border border-ivory/10 bg-midnight/20 p-1" aria-label={`${meld.type} meld`}><div className="flex gap-0.5">{meld.tiles.map((tile) => <MahjongTile key={tile.id} tile={tile} size="sm" highContrast={highContrast} />)}</div><span className="mt-1 block text-center text-[8px] font-extrabold uppercase tracking-wider text-ivory/45">{meld.type}</span></div>
}
