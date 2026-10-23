import {
  ArrowDown, BookOpen, Bot, Calculator, Check, ChevronRight, CloudRain, Crown,
  Heart, History, Landmark, Link2, LockKeyhole, Palmtree, Play, RefreshCw, ShieldCheck,
  Sparkles, UsersRound, Waves, Wifi,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { MahjongTile } from '../components/mahjong/MahjongTile'
import { useProfile } from '../profile/ProfileContext'
import { practiceRank } from '../profile/config'
import type { MahjongTileData } from '../types'

const rooms = [
  { name: 'Kolkata Royal', mood: 'Club-room calm', icon: Landmark, className: 'kolkata', image: '/images/kolkata-royal-club.jpg' },
  { name: 'Jaipur Courtyard', mood: 'Warm sandstone light', icon: Crown, className: 'jaipur', image: '/images/jaipur-courtyard.jpg' },
  { name: 'Mumbai Monsoon', mood: 'Rain-lit city evenings', icon: CloudRain, className: 'mumbai', image: '/images/mumbai-club-waterfront.jpg' },
  { name: 'Kerala House', mood: 'Teak and garden green', icon: Palmtree, className: 'kerala', image: '/images/kerala-house-club.jpg' },
  { name: 'Chennai Club', mood: 'Coastal warmth', icon: Waves, className: 'chennai', image: '/images/chennai-coastal-club.jpg' },
]

const roomTiles: MahjongTileData[] = [
  { id: 'room-east', suit: 'wind', value: '東', label: 'East wind' },
  { id: 'room-south', suit: 'wind', value: '南', label: 'South wind' },
  { id: 'room-west', suit: 'wind', value: '西', label: 'West wind' },
  { id: 'room-north', suit: 'wind', value: '北', label: 'North wind' },
]

const scoreTiles: MahjongTileData[] = [
  { id: 'score-1m', suit: 'character', value: 1, label: '1 character' },
  { id: 'score-2m', suit: 'character', value: 2, label: '2 characters' },
  { id: 'score-3m', suit: 'character', value: 3, label: '3 characters' },
  { id: 'score-1d', suit: 'circle', value: 1, label: '1 dot' },
  { id: 'score-2d', suit: 'circle', value: 2, label: '2 dots' },
  { id: 'score-3d', suit: 'circle', value: 3, label: '3 dots' },
  { id: 'score-east-1', suit: 'wind', value: '東', label: 'East wind' },
  { id: 'score-east-2', suit: 'wind', value: '東', label: 'East wind' },
  { id: 'score-east-3', suit: 'wind', value: '東', label: 'East wind' },
]

const playWays = [
  { icon: Bot, title: 'Practice with patient bots', copy: 'Learn the rhythm privately, with guidance exactly when it helps.', action: 'Start practice', route: '/practice' },
  { icon: UsersRound, title: 'Invite your own table', copy: 'Create a private room and bring three friends together with one code.', action: 'Create a room', route: '/lobby' },
  { icon: Wifi, title: 'Play on the same Wi-Fi', copy: 'Turn four nearby phones into one connected local Mahjong table.', action: 'Open LAN play', route: '/lan' },
]

export function PresentationHomePage() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const [activeRoom, setActiveRoom] = useState('Mumbai Monsoon')
  const selectedRoom = rooms.find((room) => room.name === activeRoom) ?? rooms[2]
  const go = (route: string) => navigate(route)

  return (
    <div className="mj-pres-home">
      <Header onPlay={() => go('/practice')} />
      <main>
        <section className="mj-pres-hero" aria-labelledby="presentation-hero-title">
          <div className="mj-pres-hero__media" role="img" aria-label="Four friends playing Mahjong together in a contemporary Mumbai club" />
          <div className="mj-pres-hero__veil" />
          <div className="mj-pres-hero__content">
            <div className="mj-pres-hero__copy">
              <p className="mj-pres-kicker"><span /> A new way to come together</p>
              <h1 id="presentation-hero-title">Mahjong.<br /><em>Made social</em><br />for India.</h1>
              <p className="mj-pres-hero__lede">Learn the Taiwanese 16-tile game, invite your people, and settle into a table that is always ready.</p>
              <div className="mj-pres-actions">
                <Button onClick={() => go('/practice')} withArrow>Play a practice game</Button>
                <Button variant="secondary" onClick={() => document.querySelector('#product-story')?.scrollIntoView({ behavior: 'smooth' })}>Explore the club <ArrowDown size={17} /></Button>
              </div>
              <div className="mj-pres-trust" aria-label="Platform benefits">
                <span><Check size={15} /> No download</span><span><ShieldCheck size={15} /> Social play only</span><span><Sparkles size={15} /> Beginner friendly</span>
              </div>
            </div>
            <aside className="mj-pres-hero__club-card">
              <span className="mj-pres-live"><i /> Club tables open</span>
              <strong>Pick up where you left off.</strong><p>Level {profile.level} · {practiceRank(profile.practiceRating)}</p>
              <button onClick={() => go('/profile')}>Practice rating <b>{profile.practiceRating}</b><ChevronRight size={15} /></button>
            </aside>
          </div>
          <div className="mj-pres-hero__foot"><span>The Mahjong Club</span><span>Discover the experience <ArrowDown size={14} /></span></div>
        </section>

        <section id="product-story" className="mj-pres-practice" data-next="Private tables">
          <div className="mj-pres-shell mj-pres-practice__intro">
            <p className="mj-pres-kicker"><span /> Practice, thoughtfully designed</p>
            <h2>Learn the table.<br /><em>Not the interface.</em></h2>
            <p>Every turn is clear, every action is close at hand, and the game quietly teaches you as you play.</p>
          </div>
          <div className="mj-pres-shell mj-pres-practice__canvas">
            <div className="mj-pres-practice__image">
              <img src="/images/presentation-practice-tablet.webp" alt="The Mahjong Club practice table on a tablet" loading="eager" decoding="async" />
              <button className="mj-pres-play-control" onClick={() => go('/practice')} aria-label="Start a practice game"><Play fill="currentColor" size={21} /></button>
            </div>
            <article className="mj-pres-float-card mj-pres-float-card--turn"><span>YOUR TURN</span><strong>Choose a tile</strong><small>Clear guidance, no guesswork</small></article>
            <article className="mj-pres-float-card mj-pres-float-card--resume"><RefreshCw size={18} /><span><strong>Seat protected</strong><small>Reconnect and continue</small></span></article>
            <div className="mj-pres-practice__details">
              <span><b>16-tile rules</b>Authentic Taiwanese play</span><span><b>Guided decisions</b>Help appears in context</span><span><b>Always available</b>Practice whenever you like</span>
            </div>
          </div>
          <div className="mj-pres-shell mj-pres-inline-action"><p>Ready to learn by playing?</p><Button onClick={() => go('/practice')} withArrow>Enter the practice table</Button></div>
        </section>

        <section className="mj-pres-social" id="community" data-next="Automatic scoring">
          <div className="mj-pres-shell mj-pres-social__layout">
            <div className="mj-pres-social__copy">
              <p className="mj-pres-kicker"><span /> Private multiplayer</p><h2>Across cities.<br /><em>Around one table.</em></h2>
              <p>Create a private place for family and friends to reconnect over a hand of Mahjong—from the next room, another city, or anywhere across India.</p>
              <div className="mj-pres-invite-card" aria-label="Illustration of a private Mahjong room">
                <div className="mj-pres-invite-card__header"><span><LockKeyhole size={15} /> Your private table</span><small>Invite only</small></div>
                <div className="mj-pres-invite-card__code"><div><small>Room code</small><strong>MAHJ-28</strong></div><span><Link2 size={16} /> One link for everyone</span></div>
                <div className="mj-pres-invite-card__seats">
                  <span><i>YO</i><b>You</b><small>Mumbai</small></span>
                  <span><i>AM</i><b>Amma</b><small>Chennai</small></span>
                  <span><i>ME</i><b>Meera</b><small>Jaipur</small></span>
                  <span><i>KA</i><b>Kabir</b><small>Kolkata</small></span>
                </div>
                <p><Heart size={14} fill="currentColor" /> Four seats connected · Example room</p>
              </div>
              <div className="mj-pres-social__reassurance"><span><ShieldCheck size={15} /> Private by default</span><span><RefreshCw size={15} /> Rejoin your seat</span><span><Calculator size={15} /> Scoring handled</span></div>
              <div className="mj-pres-actions"><Button onClick={() => go('/lobby')} withArrow>Create a private room</Button><Button variant="secondary" onClick={() => go('/lan')}><Wifi size={17} /> Play on local Wi-Fi</Button></div>
            </div>
            <div className="mj-pres-social__visual">
              <img src="/images/presentation-club-hero.webp" alt="Friends connected around a private Mahjong table" loading="lazy" decoding="async" />
              <div className="mj-pres-social__visual-title"><span>FRIENDS &amp; FAMILY TABLE</span><strong>Friday evening · 4 seats</strong></div>
              <div className="mj-pres-seat mj-pres-seat--one"><i /> You</div><div className="mj-pres-seat mj-pres-seat--two"><i /> Meera</div><div className="mj-pres-seat mj-pres-seat--three"><i /> Kabir</div><div className="mj-pres-seat mj-pres-seat--four"><i /> Dev</div>
              <div className="mj-pres-social__cities"><span>Mumbai</span><i /><span>Jaipur</span><i /><span>Kolkata</span><i /><span>Chennai</span></div>
            </div>
          </div>
        </section>

        <section className="mj-pres-score" data-next="Table rooms">
          <div className="mj-pres-shell mj-pres-score__layout">
            <div className="mj-pres-score__demo" aria-label="Example Mahjong score breakdown">
              <div className="mj-pres-score__top"><span>HAND COMPLETE</span><b>8 <small>tai</small></b></div>
              <div className="mj-pres-score__hand" aria-label="Example completed Mahjong hand">{scoreTiles.map((tile) => <MahjongTile key={tile.id} tile={tile} variant="standard" size="md" />)}</div>
              <dl><div><dt>All sequences</dt><dd>2 tai</dd></div><div><dt>Seat wind · East</dt><dd>1 tai</dd></div><div><dt>Self drawn</dt><dd>1 tai</dd></div><div><dt>Clean hand</dt><dd>4 tai</dd></div></dl>
              <div className="mj-pres-score__total"><span>Round result</span><strong>+8,000</strong></div>
            </div>
            <div className="mj-pres-score__copy">
              <p className="mj-pres-kicker"><span /> Automatic scoring</p><h2>See exactly<br /><em>how you won.</em></h2>
              <p>The club calculates tai automatically and explains each scoring element. The result stays transparent, so new players learn and experienced players stay in control.</p>
              <ul><li><Calculator size={19} /><span><b>Instant tai calculation</b>No mental arithmetic between hands.</span></li><li><History size={19} /><span><b>Match history and replays</b>Return to the decisions that shaped the game.</span></li></ul>
              <Button variant="secondary" onClick={() => go('/learn')} withArrow>Explore scoring rules</Button>
            </div>
          </div>
        </section>

        <section id="tables" className="mj-pres-rooms" data-next="Ways to play">
          <div className="mj-pres-shell">
            <div className="mj-pres-rooms__heading">
              <div><p className="mj-pres-kicker"><span /> Table rooms</p><h2>One club.<br /><em>Five atmospheres.</em></h2></div>
              <p>Each room changes the light, materials, and mood—not the tiles or the rules. Pick the setting that feels right for your table.</p>
            </div>
            <div className={`mj-pres-room-showcase is-${selectedRoom.className}`}>
              <div className="mj-pres-room-showcase__art">
                <img key={selectedRoom.image} src={selectedRoom.image} alt={`${selectedRoom.name} club atmosphere`} loading="lazy" decoding="async" />
                <div className="mj-pres-room-showcase__shade" />
                <div className="mj-pres-room-showcase__table"><div className="mj-pres-room-table__inlay" /><div className="mj-pres-room-table__tiles">{roomTiles.map((tile) => <MahjongTile key={tile.id} tile={tile} variant="standard" size="md" />)}</div></div>
                <span className="mj-pres-room-showcase__live"><i /> Table preview</span>
              </div>
              <div className="mj-pres-room-showcase__copy"><span>Selected room</span><h3>{activeRoom}</h3><p>{selectedRoom.mood}</p><Button onClick={() => go('/lobby')} withArrow>Choose this table</Button></div>
            </div>
            <div className="mj-pres-room-tabs" role="list" aria-label="Table room themes">
              {rooms.map((room) => <button key={room.name} className={activeRoom === room.name ? 'is-active' : ''} onClick={() => setActiveRoom(room.name)} aria-pressed={activeRoom === room.name}><span className={`mj-pres-room-tabs__icon ${room.className}`}><room.icon size={20} /></span><span><b>{room.name}</b><small>{room.mood}</small></span></button>)}
            </div>
          </div>
        </section>

        <section className="mj-pres-paths" data-next="Learn Mahjong">
          <div className="mj-pres-shell"><div className="mj-pres-paths__intro"><p className="mj-pres-kicker"><span /> Start your way</p><h2>There is always<br /><em>a seat for you.</em></h2></div>
            <div className="mj-pres-paths__grid">{playWays.map((item) => <article key={item.title}><item.icon size={25} /><h3>{item.title}</h3><p>{item.copy}</p><button onClick={() => go(item.route)}>{item.action}<ChevronRight size={16} /></button></article>)}</div>
          </div>
        </section>

        <section className="mj-pres-learn" data-next="Take your seat">
          <div className="mj-pres-shell mj-pres-learn__panel">
            <div className="mj-pres-learn__media"><img src="/images/presentation-learn-together.webp" alt="A mentor introducing two learners to Mahjong" loading="lazy" decoding="async" /></div>
            <div className="mj-pres-learn__copy"><p className="mj-pres-kicker"><span /> New to Mahjong?</p><h2>Five calm minutes.<br /><em>Then your first hand.</em></h2><p>Meet the tiles, understand the shape of a turn, and learn what makes a winning hand—without reading a rulebook first.</p>
              <ul><li><BookOpen size={18} /><span><b>Learn by doing</b>Short explanations beside the real table.</span></li><li><Sparkles size={18} /><span><b>Build confidence</b>Practice decisions without pressure.</span></li></ul><Button variant="secondary" onClick={() => go('/learn')} withArrow>Learn in five minutes</Button>
            </div>
          </div>
        </section>

        <section className="mj-pres-final"><div className="mj-pres-final__glow" /><div className="mj-pres-final__content"><p className="mj-pres-kicker"><span /> The table is ready</p><h2>Come for the strategy.<br /><em>Stay for the people.</em></h2><p>Begin with a guided hand today. Bring your people tomorrow.</p><div className="mj-pres-actions mj-pres-actions--center"><Button onClick={() => go('/practice')} withArrow>Play a practice game</Button><Button variant="secondary" onClick={() => go('/lobby')}>Create a room</Button></div></div></section>
      </main>
      <Footer />
    </div>
  )
}
