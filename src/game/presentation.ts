import type { MahjongTileData } from '../types'
import type { Tile } from './types'
import { tileLabel } from './tiles'

const honorGlyph = { east: '東', south: '南', west: '西', north: '北', red: '中', green: '發', white: '白' }
const bonusGlyph = { plum: '梅', orchid: '蘭', chrysanthemum: '菊', 'bamboo-flower': '竹', spring: '春', summer: '夏', autumn: '秋', winter: '冬' }
export function presentTile(tile: Tile, drawn = false, faceDown = false): MahjongTileData {
  if (tile.kind === 'suit') return { id: tile.id, suit: tile.suit === 'characters' ? 'character' : tile.suit === 'dots' ? 'circle' : 'bamboo', value: tile.suit === 'characters' ? `${tile.rank}萬` : tile.rank!, label: tileLabel(tile), drawn, faceDown }
  if (tile.kind === 'honor') return { id: tile.id, suit: ['red', 'green', 'white'].includes(tile.honor!) ? 'dragon' : 'wind', value: honorGlyph[tile.honor!], label: tileLabel(tile), drawn, faceDown }
  return { id: tile.id, suit: ['spring', 'summer', 'autumn', 'winter'].includes(tile.bonus!) ? 'season' : 'flower', value: bonusGlyph[tile.bonus!], label: tileLabel(tile), drawn, faceDown }
}
