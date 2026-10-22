/* oxlint-disable react/only-export-components */
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface ToastItem { id: number; message: string; tone: 'success' | 'info' }
const ToastContext = createContext<{ showToast: (message: string, tone?: ToastItem['tone']) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const showToast = useCallback((message: string, tone: ToastItem['tone'] = 'success') => {
    const id = Date.now()
    setItems((current) => [...current, { id, message, tone }])
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 3200)
  }, [])
  return <ToastContext.Provider value={{ showToast }}>{children}<div className="fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2" aria-live="polite"><AnimatePresence>{items.map((item) => <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-3 rounded-xl border border-ivory/15 bg-midnight px-4 py-3 text-sm font-semibold text-ivory shadow-2xl">{item.tone === 'success' ? <CheckCircle2 size={18} className="text-emerald" /> : <Info size={18} className="text-marigold" />}<span className="flex-1">{item.message}</span><button onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label="Dismiss notification"><X size={16} /></button></motion.div>)}</AnimatePresence></div></ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
