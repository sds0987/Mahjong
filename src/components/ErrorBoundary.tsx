import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './Button'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Mahjong table error', error, info) }
  render() {
    if (!this.state.failed) return this.props.children
    return <main className="grid min-h-screen place-items-center bg-midnight p-6 text-center text-ivory"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-marigold">Table interrupted</p><h1 className="mt-3 text-3xl font-extrabold">Your saved game is safe.</h1><p className="mt-3 text-ivory/65">Reload the table to continue from the latest turn.</p><Button className="mt-7" onClick={() => location.reload()}>Reload table</Button></div></main>
  }
}
