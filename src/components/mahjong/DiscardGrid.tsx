import type { MahjongTileData } from '../../types'
import { MahjongTile } from './MahjongTile'

export function DiscardGrid({ tiles, label, highContrast = false }: { tiles: MahjongTileData[]; label: string; highContrast?: boolean }) {
  return <div className="grid grid-cols-6 gap-0.5" aria-label={`${label} discards`}>{tiles.map((tile) => <MahjongTile key={tile.id} tile={tile} size="sm" highContrast={highContrast} />)}</div>
}
