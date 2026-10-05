import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Box, Camera, Check, ChevronDown, MousePointer2, RotateCcw, ScanLine } from 'lucide-react';
import { createSequencePlayer } from './sequencePlayer';
import './scroll-study.css';

gsap.registerPlugin(ScrollTrigger);
const FRAME_COUNT = 673;
const FRAME_RATE = 24;
const chapterPreviews = [1, 11, 17, 23.5, 27.5];
const chapters = [
  { label: 'Capture', start: 0, end: 6, title: <>One photograph.<br /><em>Infinite possibility.</em></>, copy: 'Take a photo of your product. Bring the pieces you already love into a world that is unmistakably yours.', note: 'Your physical collection. A new beginning.', icon: Camera },
  { label: 'Reconstruct', start: 6, end: 13, title: <>A new dimension.<br /><em>Built from detail.</em></>, copy: 'Our AI spatial models reconstruct and process a high-quality 3D mesh of your object, bringing its shape into your virtual store.', note: 'From a photograph to a dimensional mesh.', icon: ScanLine },
  { label: 'Refine', start: 13, end: 20, title: <>Every texture.<br /><em>Every little detail.</em></>, copy: 'The grain of the leather. The line of each stitch. The light on brushed brass. Your piece takes on its full character.', note: 'Geometry becomes something you can almost feel.', icon: Box },
  { label: 'Price & replace', start: 20, end: 24.3, title: <>Set your price.<br /><em>Make your move.</em></>, copy: 'All you have to do is set your price and select Replace. Your new piece is ready to take its place in the collection.', note: 'One simple action. A fresh point of view.', icon: MousePointer2 },
  { label: 'Reveal', start: 24.3, end: 28, title: <>A new piece.<br /><em>A living collection.</em></>, copy: 'The product on your shelf is replaced. Its name and price are in place. Your flagship is ready for its next discovery.', note: 'The Atelier 01 · Cognac · $399', icon: Check },
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

export default function BrandScrollStudy() {
  const root = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const titlePanels = useRef<(HTMLElement | null)[]>([]);
  const progressBar = useRef<HTMLSpanElement>(null);
  const seekChapter = useRef<(time: number) => void>(() => {});
  const retry = useRef(() => {});
  const [time, setTime] = useState(0), [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false), [failed, setFailed] = useState(false), [waiting, setWaiting] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [embedded] = useState(() => { try { return !!window.parent.document.getElementById('bp-scroll-test') && window.parent !== window; } catch { return false; } });

  useEffect(() => {
    if (!root.current || !stage.current || !canvas.current) return;
    const scrollRoot = embedded ? window.parent.document.getElementById('business-page')! : null;
    const triggerElement = embedded ? window.parent.document.getElementById('bp-scroll-test')! : root.current;
    const parentWindow = embedded ? window.parent : window;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, lastUI = 0, currentTime = 0, waitingTimer: ReturnType<typeof setTimeout> | undefined;
    let timeline: gsap.core.Timeline | undefined;
    const playhead = { frame: 0 };
    const drawLabels = (t: number) => {
      const index = chapters.findIndex((chapter, i) => t < chapter.end || i === chapters.length - 1);
      titlePanels.current.forEach((panel, i) => {
        if (!panel) return;
        const chapter = chapters[i];
        const enter = i === 0 ? 1 : ease((t - chapter.start + .38) / .75);
        const leave = i === chapters.length - 1 ? 1 : 1 - ease((t - chapter.end + .38) / .75);
        const opacity = enter * leave;
        panel.style.opacity = String(opacity); panel.style.transform = `translate3d(0,${(1 - enter) * 22 - (1 - leave) * 18}px,0)`;
        panel.setAttribute('aria-hidden', String(i !== index));
      });
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${t / 28})`;
      stage.current?.style.setProperty('--capture-opacity', String(1 - ease((t - 5.5) / .65)));
      stage.current?.style.setProperty('--scan-opacity', String(ease((t - 6) / .4) * (1 - ease((t - 12.7) / .6))));
      stage.current?.style.setProperty('--publish-opacity', String(ease((t - 19.8) / .6)));
      stage.current?.style.setProperty('--shelf-opacity', String(ease((t - 26.2) / .5)));
      const now = performance.now();
      if (now - lastUI > 40 || t === 0 || t === 28) { setTime(t); setActive(index); lastUI = now; }
    };
    const player = createSequencePlayer(canvas.current, {
      mobile: window.matchMedia('(max-width: 700px)').matches,
      count: FRAME_COUNT,
      onPaint: (frame, isWaiting) => {
        if (disposed) return;
        setLoaded(true);
        clearTimeout(waitingTimer);
        if (isWaiting) waitingTimer = setTimeout(() => { if (!disposed) setWaiting(true); }, 220);
        else setWaiting(false);
        // Side copy and UI always follow the frame actually on screen.
        drawLabels(isWaiting ? frame / FRAME_RATE : currentTime);
      },
      onFailure: () => { if (!disposed) setFailed(true); },
    });
    retry.current = () => { setFailed(false); player.retry(); };
    const paint = () => { currentTime = playhead.frame / FRAME_RATE; player.seek(playhead.frame); };
    const setup = () => {
      timeline?.scrollTrigger?.kill(); timeline?.kill(); timeline = undefined;
      const prefersStill = motion.matches; setReduced(prefersStill);
      root.current?.classList.toggle('prefers-still', prefersStill);
      triggerElement.classList.toggle('prefers-still', prefersStill);
      if (prefersStill) {
        seekChapter.current = (t) => { currentTime = t; playhead.frame = t * FRAME_RATE; paint(); };
        paint(); return;
      }
      timeline = gsap.timeline({
        scrollTrigger: {
          id: 'vpo-atelier-scroll-study', trigger: triggerElement, scroller: scrollRoot || undefined,
          start: embedded ? 'top top+=56' : 'top top',
          end: () => `+=${Math.max(1, triggerElement.offsetHeight - stage.current!.offsetHeight)}`,
          scrub: window.matchMedia('(max-width: 700px)').matches ? .5 : .8,
          invalidateOnRefresh: true,
        },
      });
      // The last six percent is a deliberate hold on the finished shelf.
      timeline.to(playhead, { frame: FRAME_COUNT - 1, duration: .94, ease: 'none', onUpdate: paint });
      timeline.to({}, { duration: .06 });
      seekChapter.current = (t) => {
        const trigger = timeline?.scrollTrigger; if (!trigger) return;
        const position = trigger.start + (trigger.end - trigger.start) * (t / 28 * .94);
        (scrollRoot || window).scrollTo({ top: position, behavior: 'smooth' });
      };
      timeline.scrollTrigger?.refresh(); paint();
    };
    const refresh = () => { timeline?.scrollTrigger?.refresh(); player.resize(); };
    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(stage.current);
    if (embedded) { const previous = window.parent.document.getElementById('bp-features'); if (previous) resizeObserver.observe(previous); }
    motion.addEventListener('change', setup); parentWindow.addEventListener('resize', refresh);
    setup(); drawLabels(0);
    window.parent.postMessage({type:'vpo:scroll-study-ready'}, window.location.origin);
    return () => {
      disposed = true; clearTimeout(waitingTimer); timeline?.scrollTrigger?.kill(); timeline?.kill();
      player.destroy(); resizeObserver.disconnect(); motion.removeEventListener('change', setup); parentWindow.removeEventListener('resize', refresh);
      triggerElement.classList.remove('prefers-still'); seekChapter.current = () => {};
    };
  }, [embedded]);

  const price = time < 21.6 ? '—' : time < 21.95 ? '3' : time < 22.3 ? '39' : '399';
  const replacing = time >= 24.3, published = time >= 26.5;
  return <><section className={`brand-scroll-study ${embedded ? 'is-embedded' : ''}`} ref={root} aria-label="Experimental scroll-driven Atelier film">
    <div className="scroll-study-stage" ref={stage}>
      <div className="scroll-study-top"><span>VPO <i>Atelier</i></span><span>Scroll study <b>01</b><small>Concept preview</small></span></div>
      <div className="scroll-study-visual">
        <img className={`scroll-study-poster ${loaded ? 'is-loaded' : ''}`} src="/brands/scroll-sequence/desktop/frame-0000.webp" alt="The Atelier 01 bag on an illuminated luxury-store shelf" />
        <canvas ref={canvas} aria-label="Scroll-controlled frames showing product capture, mesh reconstruction, materials, $399 pricing, and shelf replacement" />
        <div className="scroll-study-vignette" />
        <div className="scroll-study-phone" aria-hidden="true"><span className="scroll-phone-lens"/><img src="/brands/scroll-sequence/mobile/frame-0000.webp" alt=""/><div className="scroll-phone-focus"/><span className="scroll-phone-shutter"><Camera size={15}/></span><small>{time < 3 ? 'Take a photograph' : 'Photo added to studio ✓'}</small></div>
        <div className="scroll-study-scan" aria-hidden="true"><span><i/> Spatial reconstruction</span><strong>{Math.round(clamp((time - 6) / 7) * 100)}<small>%</small></strong><p>Point cloud → 3D mesh</p></div>
        <div className="scroll-study-publish" aria-hidden={time < 19.8}>
          <div className="scroll-publish-title"><Box size={13}/><span>Collection studio</span><small>01</small></div>
          <span className="scroll-field-label">Your new piece</span><h4>The Atelier 01</h4><p>Cognac · Brass hardware</p>
          <div className={`scroll-price-input ${time >= 21.3 && time < 23 ? 'is-focused' : ''}`}><span>Retail price / USD</span><b>${price}<i/></b></div>
          <div className="scroll-publish-destination"><span>Replace on</span><b>Flagship / Shelf 01</b></div>
          <div className={`scroll-replace-button ${time >= 24.15 && time < 24.6 ? 'is-clicked' : ''} ${published ? 'is-published' : ''}`}>{published ? <><Check size={13}/>Live on your shelf</> : replacing ? <><Box size={13}/>Replacing piece…</> : <><ArrowRight size={13}/>Replace product</>}</div>
          <MousePointer2 className={`scroll-demo-cursor ${time >= 22.8 && time < 25 ? 'is-visible' : ''} ${time >= 24.15 ? 'is-clicked' : ''}`} size={22} fill="#eee4cb"/>
          <span className="scroll-publish-preview">Illustrative workflow</span>
        </div>
        <div className="scroll-study-shelf" aria-hidden={time < 26.2}><span>THE ATELIER 01</span><strong>$399</strong><small>New to your collection</small></div>
      </div>
      <aside className="scroll-study-copy">
        <span className="scroll-study-eyebrow">The living catalogue</span>
        <div className="scroll-copy-panels">{chapters.map((chapter, i) => <article key={chapter.label} ref={el => { titlePanels.current[i] = el; }} aria-hidden={i !== active} style={{opacity:i === 0 ? 1 : 0}}><span className="scroll-chapter-number">0{i + 1} / {chapter.label}</span><h2>{chapter.title}</h2><p>{chapter.copy}</p><span className="scroll-chapter-note"><chapter.icon size={13}/>{chapter.note}</span></article>)}</div>
        <div className="scroll-study-direction"><span className="scroll-mouse"><i/></span><span>{reduced ? 'Choose a chapter below' : 'Scroll to bring it to life'}<small>{reduced ? 'Reduced motion is enabled' : 'Move at your own pace. Scroll back to revisit.'}</small></span></div>
      </aside>
      <footer className="scroll-study-bottom"><nav aria-label="Scroll film chapters">{chapters.map((chapter,i)=><button key={chapter.label} aria-label={`Go to ${chapter.label} chapter`} aria-current={active === i ? 'step' : undefined} onClick={()=>seekChapter.current(chapterPreviews[i])}><span>0{i+1}</span><span>{chapter.label}</span></button>)}</nav><div className="scroll-study-position"><span>{Math.round(time / 28 * 100)}%</span><button aria-label="Restart scroll study" onClick={()=>seekChapter.current(0)}><RotateCcw size={13}/></button></div><div className="scroll-study-progress"><span ref={progressBar}/></div></footer>
      <div className="scroll-study-status" role="status">{failed ? <button onClick={()=>retry.current()}>Some frames could not load. Retry ↻</button> : !loaded ? 'Preparing the scroll experience…' : waiting ? 'Bringing the next moment into focus…' : ''}</div>
      <a className="scroll-study-exit" href="#" onClick={event=>{event.preventDefault();if(embedded){const section=window.parent.document.getElementById('bp-scroll-test')!;window.parent.document.getElementById('business-page')!.scrollTo({top:section.offsetTop+section.offsetHeight,behavior:reduced?'auto':'smooth'});}else window.scrollTo({top:document.documentElement.scrollHeight,behavior:reduced?'auto':'smooth'});}}>{time>=27?'Explore at your own pace':'Skip scroll study'}<ChevronDown size={11}/></a>
    </div>
  </section>{!embedded&&<div className="scroll-study-end"><span>The Atelier / Scroll study 01</span><h3>A photograph.<br/><em>A world of possibility.</em></h3><a href="/vpo-business?preview=experience">Back to VPO for Brands <ArrowRight size={15}/></a></div>}</>;
}
