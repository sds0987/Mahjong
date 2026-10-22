/* oxlint-disable react/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'
import { currentPlayer, players } from '../data/mockData'
import type { Player, Room, RoomSettings } from '../types'

type ThemeName = 'Kolkata Royal' | 'Jaipur Courtyard' | 'Mumbai Monsoon' | 'Kerala House' | 'Chennai Club'

interface AppContextValue {
  player: Player
  room: Room
  updateRoomSettings: (settings: RoomSettings) => void
  toggleReady: () => void
  fillSeats: () => void
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  sound: boolean
  setSound: (value: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (value: boolean) => void
  highContrast: boolean
  setHighContrast: (value: boolean) => void
  presentationTheme: boolean
  setPresentationTheme: (value: boolean) => void
}

const initialSettings: RoomSettings = {
  roomName: 'Sunday Chai Table', privateRoom: true, turnTimer: 45,
  startingPoints: 30000, maximumTai: 16, allowSpectators: true,
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(initialSettings)
  const [roomPlayers, setRoomPlayers] = useState<Array<Player | null>>([currentPlayer, players[1], players[2], null])
  const [theme, setTheme] = useState<ThemeName>('Kolkata Royal')
  const [sound, setSound] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [presentationTheme, setPresentationThemeState] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('mahjong-presentation-theme') === 'true')
  const setPresentationTheme = (value: boolean) => { setPresentationThemeState(value); window.localStorage.setItem('mahjong-presentation-theme', String(value)) }

  const room: Room = { code: 'IND-482', hostId: currentPlayer.id, rules: 'Taiwanese 16-Tile', settings, players: roomPlayers }
  const value = {
    player: currentPlayer, room, updateRoomSettings: setSettings,
    toggleReady: () => setRoomPlayers((items) => items.map((p) => p?.id === currentPlayer.id ? { ...p, ready: !p.ready } : p)),
    fillSeats: () => setRoomPlayers(players.map((p) => ({ ...p, ready: true }))),
    theme, setTheme, sound, setSound, reducedMotion, setReducedMotion, highContrast, setHighContrast, presentationTheme, setPresentationTheme,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
