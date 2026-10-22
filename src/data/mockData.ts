import type { MahjongTileData, MatchSummary, Player, ScoreItem } from '../types'

const tile = (id: string, suit: MahjongTileData['suit'], value: MahjongTileData['value'], label: string, drawn = false): MahjongTileData => ({ id, suit, value, label, drawn })

export const currentPlayer: Player = {
  id: 'p1', name: 'Ananya Rao', initials: 'AR', city: 'Bengaluru', score: 32000, rating: 1248,
  online: true, ready: true, dealer: true, connected: true, accent: '#F2A900',
}

export const players: Player[] = [
  currentPlayer,
  { id: 'p2', name: 'Kabir Mehta', initials: 'KM', city: 'Mumbai', score: 28500, rating: 1194, online: true, ready: true, connected: true, accent: '#21A875' },
  { id: 'p3', name: 'Meera Sen', initials: 'MS', city: 'Kolkata', score: 24700, rating: 1276, online: true, ready: false, connected: true, accent: '#C85C3B' },
  { id: 'p4', name: 'Dev Menon', initials: 'DM', city: 'Kochi', score: 30100, rating: 1162, online: false, ready: false, connected: true, accent: '#6D7DD6' },
]

export const friends = [
  { ...players[1], activity: 'In the lobby' },
  { ...players[2], activity: 'Playing East 2' },
  { id: 'p5', name: 'Rohan Iyer', initials: 'RI', city: 'Chennai', score: 26000, rating: 1108, online: true, ready: false, connected: true, accent: '#C85C3B', activity: 'Learning' },
]

export const recentMatches: MatchSummary[] = [
  { id: 'm1', result: 'Won', score: 42, room: 'Sunday Chai Table', playedAt: 'Today, 6:40 PM' },
  { id: 'm2', result: 'Placed 2nd', score: 18, room: 'Bengaluru Friends', playedAt: 'Yesterday' },
  { id: 'm3', result: 'Placed 3rd', score: -6, room: 'Practice Table', playedAt: '18 Oct' },
]

export const playerHand: MahjongTileData[] = [
  tile('c1','character',1,'One Character'), tile('c2','character',2,'Two Character'), tile('c3','character',3,'Three Character'),
  tile('b2','bamboo',2,'Two Bamboo'), tile('b3','bamboo',3,'Three Bamboo'), tile('b4','bamboo',4,'Four Bamboo'),
  tile('o5a','circle',5,'Five Circle'), tile('o5b','circle',5,'Five Circle'), tile('o5c','circle',5,'Five Circle'),
  tile('w1','wind','東','East Wind'), tile('w2','wind','東','East Wind'), tile('w3','wind','東','East Wind'),
  tile('d1','dragon','中','Red Dragon'), tile('d2','dragon','中','Red Dragon'), tile('d3','dragon','中','Red Dragon'),
  tile('o8','circle',8,'Eight Circle'), tile('drawn','flower','梅','Plum Flower', true),
]

export const discards: Record<string, MahjongTileData[]> = {
  north: [tile('n1','circle',2,'Two Circle'), tile('n2','bamboo',8,'Eight Bamboo'), tile('n3','wind','西','West Wind')],
  east: [tile('e1','character',7,'Seven Character'), tile('e2','dragon','發','Green Dragon'), tile('e3','circle',4,'Four Circle')],
  south: [tile('s1','bamboo',1,'One Bamboo'), tile('s2','wind','北','North Wind')],
  west: [tile('w4','circle',9,'Nine Circle'), tile('w5','character',4,'Four Character'), tile('w6','dragon','白','White Dragon')],
}

export const scoreItems: ScoreItem[] = [
  { label: 'Base win', tai: 1 }, { label: 'Self-draw', tai: 1 }, { label: 'Seat flower', tai: 1 },
  { label: 'All pongs', tai: 4 }, { label: 'Dealer bonus', tai: 1 },
]

export const chatMessages = [
  { id: 1, name: 'Kabir', text: 'Ready for another round?', time: '7:12' },
  { id: 2, name: 'Meera', text: 'Give me one minute ☕', time: '7:13' },
  { id: 3, name: 'Ananya', text: 'No rush — table is open.', time: '7:13' },
]

export const gameLog = [
  'Ananya drew a tile', 'Kabir discarded Seven Character', 'Meera called Pong', 'East round began',
]
