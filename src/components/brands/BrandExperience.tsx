import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Camera, ScanLine, Box, Pause, Play, RotateCcw, Maximize2, Minimize2, Moon, Sun, Users, Link2, ShoppingBag, RefreshCw, ChevronRight, VolumeX } from 'lucide-react';
import { createAtelier, type StudioState } from './atelierScene';
import Heatmap from './Heatmap';
import './brands.css';

const stages = [
  { label: 'Capture', icon: Camera, start: 0, end: 6, title: 'Every object starts with a story.', detail: 'Photograph the piece. Bring its character into your world.' },
  { label: 'Reconstruct', icon: ScanLine, start: 6, end: 13, title: 'A new dimension takes shape.', detail: 'Watch the surface become points, then a dimensional mesh.' },
  { label: 'Refine', icon: Box, start: 13, end: 20, title: 'Every detail. Beautifully preserved.', detail: 'Rich leather grain. Fine stitching. The glint of brushed brass.' },
  { label: 'Place & price', icon: ShoppingBag, start: 20, end: 28, title: 'From your camera to your collection.', detail: 'Replace a display piece, set a price, and reveal the new edit.' },
];

function ProductDemo() {
  const host = useRef<HTMLDivElement>(null); const cinema = useRef<HTMLDivElement>(null);
  const state = useRef<StudioState>({ time: 0, playing: true, visible: false, night: false, rotation: 0, quality: 'auto', reducedMotion: false });
  const [time, setTime] = useState(0); const [playing, setPlaying] = useState(true); const [night, setNight] = useState(false);
  const [quality, setQuality] = useState(false); const [ready, setReady] = useState(false); const [photo, setPhoto] = useState('');
  const [failed, setFailed] = useState(false); const [fullscreen, setFullscreen] = useState(false); const [fullscreenError, setFullscreenError] = useState('');
  const [activated, setActivated] = useState(false);
  const stage = time < 6 ? 0 : time < 13 ? 1 : time < 20 ? 2 : 3;
  const selectStage = (index: number) => { const motion = !state.current.reducedMotion; const t = motion ? stages[index].start + .1 : stages[index].end - .1; state.current.time = t; setTime(t); state.current.playing = motion; setPlaying(motion); };
  const replay = () => { state.current.time = 0; state.current.rotation = 0; state.current.playing = true; setTime(0); setPlaying(true); };
  const toggle = () => { if (state.current.time >= 28) { replay(); return; } state.current.playing = !state.current.playing; setPlaying(state.current.playing); };
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {state.current.reducedMotion = media.matches; if (media.matches) {state.current.playing = false; setPlaying(false);}};
    apply(); media.addEventListener('change', apply);
    const observer = new IntersectionObserver(([entry]) => { state.current.visible = entry.isIntersecting; if (entry.isIntersecting) setActivated(true); }, { threshold: .15 });
    if (cinema.current) observer.observe(cinema.current);
    const fullChange = () => setFullscreen(document.fullscreenElement === cinema.current); document.addEventListener('fullscreenchange', fullChange);
    return () => { media.removeEventListener('change', apply); observer.disconnect(); document.removeEventListener('fullscreenchange', fullChange); };
  }, []);
  useEffect(() => {
    if (!activated || !host.current) return;
    // Mount the renderer only when the experience enters the viewport.
    const cleanup = createAtelier(host.current, state.current, image => { setPhoto(image); setReady(true); }, () => setFailed(true));
    return cleanup;
  }, [activated]);
  useEffect(() => {
    if (!ready && !failed) return;
    let frame: number, last = performance.now(), lastUI = 0;
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, .12); last = now;
      if (state.current.playing && state.current.visible && !document.hidden) {
        state.current.time = Math.min(28, state.current.time + delta);
        if (now - lastUI > 70) { setTime(state.current.time); lastUI = now; }
        if (state.current.time >= 28) { state.current.playing = false; setPlaying(false); setTime(28); }
      }
      frame = requestAnimationFrame(tick);
    }; frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [ready, failed]);
  const expand = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await cinema.current?.requestFullscreen(); }
    catch { setFullscreenError('Fullscreen is unavailable in this browser. The preview remains interactive below.'); }
  };
  const drag = useRef<number | null>(null);
  return <section className="product-story" aria-labelledby="product-story-title">
    <div className="story-heading"><div><span className="eyebrow">01 / The living catalogue</span><h2 id="product-story-title">A photograph.<br /><em>A whole new possibility.</em></h2></div><p>Your next collection is closer than you think.<br />Discover how a physical piece could become<br className="desktop-break" /> part of your digital flagship.</p></div>
    <div className={`cinema ${night ? 'is-night' : ''} stage-${stage}`} ref={cinema}>
      <div className="studio-canvas" ref={host} onPointerDown={e => {drag.current=e.clientX; e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e => {if(drag.current!==null){state.current.rotation+=(e.clientX-drag.current)*.009;drag.current=e.clientX;}}} onPointerUp={() => {drag.current=null;}} onPointerCancel={() => {drag.current=null;}} />
      {(!ready || failed) && <div className="studio-fallback"><img src="/brands/atelier-poster-4k.jpg" alt="The original Atelier 01 leather bag on its illuminated travertine display shelf" /><span>{failed ? 'Explore the concept storyboard using the steps below.' : 'Preparing the atelier…'}</span></div>}
      <div className="cinema-shade" />
      <div className="cinema-top"><span className="cinema-brand">VPO <i>Atelier</i></span><div><span className="demo-label">Concept film</span><button onClick={() => {state.current.night=!night;setNight(!night);}} aria-label={night?'Switch to day ambience':'Switch to evening ambience'} title="Change the atmosphere">{night?<Moon size={15}/>:<Sun size={15}/>}</button><button aria-pressed={quality} onClick={() => {state.current.quality=quality?'auto':'4k';setQuality(!quality);}} title="High-resolution rendering; performance depends on your device">{quality?'4K':'HD'}</button><button onClick={expand} aria-label={fullscreen?'Exit fullscreen':'Enter fullscreen'}>{fullscreen?<Minimize2 size={15}/>:<Maximize2 size={15}/>}</button></div></div>
      <div className={`capture-frame ${stage===0?'visible':''}`} aria-hidden="true"><span/><span/><span/><span/><div><Camera size={13}/> ATELIER / 001</div></div>
      {stage===1 && <div className="scan-readout"><span><i className="status-dot"/> Reconstructing surface</span><b>{Math.min(100,Math.round((time-6)/7*100))}<small>%</small></b><div className="scan-progress"><i style={{width:`${(time-6)/7*100}%`}}/></div><p>Point cloud → mesh → material</p></div>}
      {stage===2 && <div className="material-readout"><span className="eyebrow">Material study / 001</span><div><span className="material-swatch"/><span>Cognac calfskin<small>Grain · stitching · brass</small></span></div><span className="model-inspect">Drag the scene to inspect ↔</span></div>}
      <div className={`capture-phone ${stage===0?'visible':''}`}><div className="phone-camera"/><div className="phone-screen">{photo&&<img src={photo} alt="Photo preview of the Atelier bag"/>}<span className="phone-focus"/><span className="phone-caption">PHOTO</span><div className="phone-shutter"><Camera size={15}/></div></div><div className="phone-upload">{time>3?<><Check size={12}/> Photo added to studio</>:<><Camera size={12}/> Capture your next piece</>}</div></div>
      <div className={`publish-panel ${stage===3?'visible':''}`} aria-hidden={stage!==3}>
        <div className="publish-header"><Box size={14}/><span>Collection studio</span><span className="publish-dots">···</span></div>
        <span className="eyebrow">Your new piece</span><h4>The Atelier 01</h4><p>Cognac / Brass hardware</p><div className="publish-field"><span>Product name</span><b>The Atelier 01</b></div><div className={`publish-field price-field ${time>22?'is-typed':''}`}><span>Retail price / USD</span><b>{time>23?'$399':time>22.5?'$39':time>22?'$3':'$—'}<i/></b></div><div className="publish-destination"><span>Placement</span><b>Flagship / Shelf 01</b></div><div className={`publish-action ${time>25?'published':''}`}>{time>25?<><Check size={14}/> Live on your shelf</>:<><ArrowRight size={14}/> Replacing display piece</>}</div><span className="publish-preview">Simulated publishing preview</span>
      </div>
      {stage===3&&time>25&&<div className="shelf-tag"><span>THE ATELIER 01</span><b>$399</b><i>Explore the piece ↗</i></div>}
      <div className="cinema-caption" aria-live="polite" aria-atomic="true"><span>0{stage+1} / {stages[stage].label}</span><h3>{stages[stage].title}</h3><p>{stages[stage].detail}</p></div>
      <div className="cinema-controls"><button onClick={toggle} aria-label={playing?'Pause film':'Play film'}>{playing?<Pause size={16}/>:<Play size={16}/>}</button><button onClick={replay} aria-label="Replay film"><RotateCcw size={15}/></button><span className="film-time">0:{String(Math.floor(time)).padStart(2,'0')}</span><input type="range" min="0" max="28" step=".1" value={time} aria-label="Film timeline" style={{'--progress':`${time/28*100}%`} as React.CSSProperties} onChange={e => {const t=Number(e.target.value);state.current.time=t;setTime(t);state.current.playing=false;setPlaying(false);}}/><span className="film-time">0:28</span><VolumeX size={14} className="silent-film"/><span className="silent-label">Silent film</span></div>
      {fullscreenError&&<p className="fullscreen-note" role="status">{fullscreenError}</p>}
    </div>
    <div className="story-steps" aria-label="Explore the product workflow">{stages.map((item,i) => <button key={item.label} onClick={() => selectStage(i)} aria-pressed={stage===i}><span className="step-line"><i style={{width: time>=item.end?'100%':time<item.start?'0%':`${(time-item.start)/(item.end-item.start)*100}%`}}/></span><span className="step-heading"><item.icon size={15}/><span>0{i+1}</span>{item.label}<ChevronRight size={14}/></span><small>{['Photograph your product','Watch its geometry emerge','Discover every texture','Set $399. Make it yours.'][i]}</small></button>)}</div>
    <div className="story-fineprint"><span>Original 3D concept · The Atelier 01</span><span>Illustrative workflow. Capture and reconstruction requirements vary by product.</span></div>
  </section>;
}

function SocialDemo() {
  const [joined,setJoined]=useState(false); const [copied,setCopied]=useState(false);
  const [message,setMessage]=useState(''); const [sent,setSent]=useState(''); const [invite,setInvite]=useState('');
  const join=()=>{setJoined(v=>!v);setSent('');};
  const copy=async()=>{const url=`${window.location.origin}/vpo-business?preview=salon`;try{await navigator.clipboard.writeText(url);setCopied(true);}catch{setInvite(url);}};
  return <article className="social-feature feature-card" id="social-preview">
    <div className="feature-topline"><span className="eyebrow">02 / Shared presence</span><span className="tier-chip">Gold + Platinum</span></div>
    <div className="feature-copy"><h3>Make an entrance.<br/><em>Together.</em></h3><p>Bring friends into the same world. Turn a private appointment, a new collection, or a quiet discovery into a shared moment.</p></div>
    <div className="salon-scene"><img src="/brands/private-salon.jpg" alt="Three guests exploring an intimate luxury leather-goods boutique" loading="lazy"/><div className="salon-shade"/><div className="salon-header"><span><i className="status-dot"/> The private salon</span><span><Users size={12}/>{joined?'4':'3'} in room · Demo</span></div><div className="guest guest-one"><i/>Amélie <span>Host</span></div><div className="guest guest-two"><i/>Sofia</div><div className="guest guest-three"><i/>James</div><div className="salon-chat"><span>SOFIA</span><p>{sent||'The cognac one. What do you think?'}</p></div><div className="salon-bottom"><div className="guest-avatars"><span>A</span><span>S</span><span>J</span>{joined&&<span className="you-avatar">Y</span>}<small>{joined?'You’re in. Look around.':'A moment, shared.'}</small></div><button onClick={join}>{joined?'Leave preview':'Join the preview'}<ArrowRight size={14}/></button></div></div>
    {joined&&<div className="salon-joined"><form onSubmit={e=>{e.preventDefault();if(message.trim()){setSent(message.trim());setMessage('');}}}><label className="sr-only" htmlFor="salon-message">Message in the preview room</label><input id="salon-message" value={message} maxLength={100} onChange={e=>setMessage(e.target.value)} placeholder="Share a thought in the demo…"/><button type="submit" disabled={!message.trim()} aria-label="Send demo message"><ArrowRight size={16}/></button></form><span>Local preview · no message is sent to other people.</span></div>}
    <div className="feature-foot"><span>{joined?'Private room preview · Platinum':'Community lobbies + private appointments'}</span><button onClick={copy}><Link2 size={12}/>{copied?'Preview link copied':'Share preview'}</button></div>{invite&&<p className="copy-fallback" role="status">Copy this preview link: <a href={invite} target="_top">{invite}</a></p>}
  </article>;
}

function InventoryDemo() {
  const [stock,setStock]=useState(24); const [synced,setSynced]=useState(24); const [syncing,setSyncing]=useState(false); const [sales,setSales]=useState(0); const timer=useRef<ReturnType<typeof setTimeout>>();
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const sell=()=>{if(syncing||stock===0)return;setStock(n=>n-1);setSyncing(true);setSales(n=>n+1);timer.current=setTimeout(()=>{setSynced(stock-1);setSyncing(false);},1100);};
  const reset=()=>{clearTimeout(timer.current);setStock(24);setSynced(24);setSyncing(false);setSales(0);};
  return <article className="inventory-feature feature-card">
    <div className="feature-topline"><span className="eyebrow">03 / Connected commerce</span><span className="tier-chip">Platinum</span></div>
    <div className="feature-copy"><h3>One collection.<br/><em>Always in sync.</em></h3><p>A sale in one place. The right stock everywhere. Connect your existing commerce platform to a world that stays current.</p></div>
    <div className={`inventory-dashboard ${syncing?'is-syncing':''}`}><div className="inventory-title"><span>Inventory overview</span><span className="inventory-status"><i className="status-dot"/>{syncing?'Updating…':'All channels in sync'}</span></div><div className="inventory-product"><div className="mini-bag"><ShoppingBag size={28} strokeWidth={1}/></div><div><b>The Atelier 01</b><span>Cognac · AT-001-CG</span></div><strong>$399<small>USD</small></strong></div><div className="sync-channels"><div className="source-channel"><div className="channel-icon">S</div><span>Commerce platform</span><b>Shopify</b><strong>{stock}<small>available</small></strong></div><div className="sync-bridge"><span/><RefreshCw size={20}/><span/><small>{syncing?'Syncing':'Connected'}</small></div><div className="target-channel"><div className="channel-icon vpo-channel">V</div><span>Spatial storefront</span><b>VPO Flagship</b><strong>{synced}<small>available</small></strong></div></div><div className="inventory-event" aria-live="polite"><span>{syncing?<RefreshCw size={13}/>:<Check size={13}/>}</span><div><b>{syncing?`Order #${1048+sales} · 1 piece sold`:sales?`Order #${1048+sales} · inventory updated`:'Your collection is up to date'}</b><small>{syncing?'Updating availability in your flagship…':sales?`${synced} pieces available across connected channels`:'Simulate an order to see both channels respond.'}</small></div><span className="event-now">{sales?'Just now':'Demo'}</span></div><div className="inventory-actions"><button onClick={sell} disabled={syncing||stock===0}>{syncing?'Syncing inventory…':stock===0?'Sold out in preview':'Simulate a sale'}<ArrowRight size={14}/></button><button onClick={reset} aria-label="Reset inventory demo"><RotateCcw size={14}/></button></div></div>
    <div className="feature-foot"><span>Keep your catalogue connected.</span><span>Simulated data · no store connected</span></div>
  </article>;
}

export default function BrandExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const resize = useCallback(()=>{if(root.current && window.parent!==window)window.parent.postMessage({type:'vpo:brand-experience-height',height:Math.ceil(root.current.getBoundingClientRect().height)},window.location.origin);},[]);
  useEffect(()=>{
    document.title='VPO for Brands — The Experience';
    const observer=new ResizeObserver(resize);if(root.current)observer.observe(root.current);resize();
    const enable=()=>setStarted(true);const visibility=(event:MessageEvent)=>{if(event.origin===window.location.origin&&event.source===window.parent&&event.data?.type==='vpo:brand-experience-visible')enable();};
    window.addEventListener('message',visibility);
    if(window.parent===window)enable();
    // Parent may already have opened before this lazy frame finished loading.
    window.parent.postMessage({type:'vpo:brand-experience-ready'},window.location.origin);
    return()=>{observer.disconnect();window.removeEventListener('message',visibility);};
  },[resize]);
  return <div className="brand-experience" ref={root}>
    <header className="experience-heading"><div><span className="eyebrow">The VPO experience / Made tangible</span><h1>Beyond the <em>ordinary.</em></h1></div><div className="experience-intro"><p>A new canvas for your brand.<br/>See what spatial commerce can feel like.</p><a href="#atelier-film">Explore the possibilities<ArrowDown size={13}/></a></div></header>
    <div id="atelier-film">{started?<ProductDemo/>:<div className="experience-poster"><img src="/brands/private-salon.jpg" alt="The VPO atelier preview"/><button onClick={()=>setStarted(true)}>Enter the atelier <Play size={16}/></button></div>}</div>
    <div className="experience-divider"><span>More than a beautiful space.</span><span>A better way to do business.</span></div>
    <div className="feature-grid"><SocialDemo/><InventoryDemo/></div>
    <Heatmap/>
    <footer className="experience-outro"><span className="eyebrow">Your world. Your signature.</span><p>Give your collection<br/><em>a place to belong.</em></p><button onClick={()=>{if(window.parent!==window)window.parent.postMessage({type:'vpo:brand-experience-tiers'},window.location.origin);else window.location.href='/vpo-business?preview=tiers';}}>Find your partnership <ArrowRight size={15}/></button><span>Interactive concept previews · Original VPO environment and product</span></footer>
  </div>;
}
