import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Play, RotateCcw, Users, Link2, ShoppingBag, RefreshCw } from 'lucide-react';
import { resolveBrandDemoMode } from './demoMode';
import Heatmap from './Heatmap';
import './brands.css';

// Kept as a lazy module so the disabled film and its materials do not load.
const AtelierFilm = lazy(() => import('./AtelierFilm'));

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
  const showFilm = resolveBrandDemoMode() === 'film';
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
    {showFilm && <header className="experience-heading"><div><span className="eyebrow">The VPO experience / Made tangible</span><h1>Beyond the <em>ordinary.</em></h1></div><div className="experience-intro"><p>A new canvas for your brand.<br/>See what spatial commerce can feel like.</p><a href="#atelier-film">Explore the possibilities<ArrowDown size={13}/></a></div></header>}
    {showFilm && <div id="atelier-film">{started?<Suspense fallback={<div className="experience-poster"><img src="/brands/atelier-poster-4k.jpg" alt="The Atelier 01 on its illuminated shelf"/></div>}><AtelierFilm/></Suspense>:<div className="experience-poster"><img src="/brands/private-salon.jpg" alt="The VPO atelier preview"/><button onClick={()=>setStarted(true)}>Enter the atelier <Play size={16}/></button></div>}</div>}
    <div className="experience-divider"><span>More than a beautiful space.</span><span>A better way to do business.</span></div>
    <div className="feature-grid"><SocialDemo/><InventoryDemo/></div>
    <Heatmap/>
    <footer className="experience-outro"><span className="eyebrow">Your world. Your signature.</span><p>Give your collection<br/><em>a place to belong.</em></p><button onClick={()=>{if(window.parent!==window)window.parent.postMessage({type:'vpo:brand-experience-tiers'},window.location.origin);else window.location.href='/vpo-business?preview=tiers';}}>Find your partnership <ArrowRight size={15}/></button><span>Interactive concept previews · Original VPO environment and product</span></footer>
  </div>;
}
