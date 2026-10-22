import type { MahjongTileData, TileSize } from '../../types'
import { MahjongTile } from './MahjongTile'

export function MahjongHand({ tiles, size = 'md', selectedId, onSelect, highContrast = false, label = 'Mahjong hand' }: { tiles: MahjongTileData[]; size?: TileSize; selectedId?: string | null; onSelect?: (tile: MahjongTileData) => void; highContrast?: boolean; label?: string }) {
  return <div className="flex max-w-full flex-wrap items-end justify-center gap-1 overflow-visible px-1 pb-3 pt-3 2xl:flex-nowrap" role="group" aria-label={label}>{tiles.map((tile) => <MahjongTile key={tile.id} tile={tile} size={size} selected={selectedId === tile.id} highContrast={highContrast} onClick={onSelect ? () => onSelect(tile) : undefined} />)}</div>
}
