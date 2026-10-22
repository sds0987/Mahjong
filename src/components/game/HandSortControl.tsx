import { ArrowDownAZ, ChevronDown, RotateCcw } from 'lucide-react'
import type { HandSortMode, HandSortPreferences } from '../../game/handSort'

export function HandSortControl({preferences,onChange,onSort}:{preferences:HandSortPreferences;onChange:(next:HandSortPreferences)=>void;onSort:()=>void}){
  return <div className="hand-sort-control">
    <button type="button" className="hand-sort-button" onClick={onSort} aria-label="Sort hand by the selected order" title="Sort hand"><ArrowDownAZ/><span>Sort Hand</span></button>
    <details className="hand-sort-menu"><summary aria-label="Open hand sorting preferences" title="Sorting preferences"><ChevronDown/></summary><div className="hand-sort-popover">
      <button type="button" onClick={onSort}><ArrowDownAZ/>Sort now</button>
      <label><span>Auto-sort after drawing</span><input type="checkbox" checked={preferences.autoSortAfterDraw} onChange={event=>onChange({...preferences,autoSortAfterDraw:event.target.checked})}/></label>
      <label><span>Sort order</span><select value={preferences.mode} onChange={event=>onChange({...preferences,mode:event.target.value as HandSortMode})}><option value="suit-rank">Suit and rank</option><option value="honors-first">Honors first</option><option value="manual">Manual order</option></select></label>
      <button type="button" onClick={()=>onChange({mode:'suit-rank',autoSortAfterDraw:false})}><RotateCcw/>Reset to default</button>
    </div></details>
  </div>
}
