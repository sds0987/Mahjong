import { memo, useEffect, useMemo, useRef } from 'react'
import type { PublicDiscard } from '../../game/discards'
import { presentTile } from '../../game/presentation'
import { MahjongTile } from '../mahjong/MahjongTile'

const seatLetter={east:'E',south:'S',west:'W',north:'N'} as const

const RiverTile=memo(function RiverTile({discard,latest,highContrast}:{discard:PublicDiscard;latest:boolean;highContrast:boolean}){
  const claimedText=discard.claimed?`, claimed${discard.claimedBy?` by ${discard.claimedBy}`:''}`:''
  const label=`${presentTile(discard.tile).label} — discarded by ${discard.playerName}, ${discard.seatWind} seat, turn ${discard.turnNumber}${claimedText}.`
  return <div className={`discard-river__item seat-${discard.seatWind}${discard.claimed?' is-claimed':''}`} data-latest={latest||undefined} data-tile-id={discard.id} tabIndex={0} aria-label={label} title={label}>
    <span className="discard-owner" aria-hidden="true">{seatLetter[discard.seatWind]}</span>
    {latest&&<span className="discard-latest-label" aria-hidden="true">Latest</span>}
    {discard.claimed&&<span className="discard-claimed" aria-hidden="true">Claimed</span>}
    <MahjongTile tile={presentTile(discard.tile)} variant="discard" highContrast={highContrast} latest={latest}/>
  </div>
})

export function SharedDiscardRiver({discards,status,meta,highContrast=false}:{discards:PublicDiscard[];status:string;meta:string;highContrast?:boolean}){
  const latest=useMemo(()=>[...discards].reverse().find(discard=>!discard.claimed),[discards])
  const latestId=latest?.id
  const viewport=useRef<HTMLDivElement>(null)
  useEffect(()=>{if(!latestId)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;viewport.current?.querySelector(`[data-tile-id="${latestId}"]`)?.scrollIntoView({block:'nearest',inline:'nearest',behavior:reduce?'auto':'smooth'})},[latestId])
  return <section className={`discard-river ${discards.length<=15?'discard-river--sparse':discards.length<=30?'discard-river--medium':'discard-river--dense'}`} aria-label="Discarded tiles">
    <header className="discard-river__header"><div><h2>Discard River</h2><span>{discards.length} {discards.length===1?'tile':'tiles'}</span></div><div className="discard-river__legend" aria-label="Seat marker legend"><span className="seat-east">E East</span><span className="seat-south">S South</span><span className="seat-west">W West</span><span className="seat-north">N North</span></div></header>
    <div className="discard-river__status"><b>{status}</b><span>{meta}</span></div>
    <div ref={viewport} className="discard-river__viewport" tabIndex={0}><div className="discard-river__grid">{discards.map(discard=><RiverTile key={discard.id} discard={discard} latest={discard.id===latest?.id} highContrast={highContrast}/>)}</div>{!discards.length&&<p className="discard-river__empty">The river is clear. The first discard will appear here.</p>}</div>
    <div className="sr-only" aria-live="polite">{latest?`${latest.playerName} discarded ${presentTile(latest.tile).label}.`:''}</div>
  </section>
}
