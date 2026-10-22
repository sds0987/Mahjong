import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { AppProvider } from './context/AppContext'
import { GamePage } from './pages/GamePage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LobbyPage } from './pages/LobbyPage'
import { ProfilePage } from './pages/ProfilePage'
import { RoomPage } from './pages/RoomPage'
import { SettingsPage } from './pages/SettingsPage'
import { PracticePage } from './pages/PracticePage'
import { ReplayPage } from './pages/ReplayPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LanProvider } from './network/LanContext'
import { LanHomePage } from './pages/LanHomePage'
import { LanRoomPage } from './pages/LanRoomPage'
import { LanGamePage } from './pages/LanGamePage'
import { ProfileProvider } from './profile/ProfileContext'
import { MatchResultsPage } from './pages/MatchResultsPage'
import { useApp } from './context/AppContext'

export default function App() {
  return (
    <AppProvider><ProfileProvider><LanProvider>
      <ToastProvider><ErrorBoundary>
        <ThemeFrame />
      </ErrorBoundary></ToastProvider>
    </LanProvider></ProfileProvider></AppProvider>
  )
}

function ThemeFrame() {
  const { presentationTheme } = useApp()
  const { pathname } = useLocation()
  const isGameplayRoute = pathname === '/practice' || pathname.startsWith('/practice/') || pathname.startsWith('/game/') || pathname.startsWith('/lan/game/')
  return <div className={presentationTheme && !isGameplayRoute ? 'mj-theme' : undefined} data-presentation-theme={presentationTheme && !isGameplayRoute ? 'club' : 'classic'}>
    <ScrollToTop />
    <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/room/:roomCode" element={<RoomPage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/history" element={<ProfilePage initialTab="history" />} />
          <Route path="/profile/achievements" element={<ProfilePage initialTab="achievements" />} />
          <Route path="/match/:matchId/results" element={<MatchResultsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/practice/resume" element={<PracticePage />} />
          <Route path="/replay/:gameId" element={<ReplayPage />} />
          <Route path="/lan" element={<LanHomePage />} />
          <Route path="/join/:roomCode" element={<LanHomePage />} />
          <Route path="/lan/room/:roomCode" element={<LanRoomPage />} />
          <Route path="/lan/game/:roomCode" element={<LanGamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
}
