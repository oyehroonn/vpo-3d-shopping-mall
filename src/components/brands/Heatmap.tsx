import { useState } from 'react';
import { ArrowUpRight, MousePointer2, Footprints } from 'lucide-react';

const zones = [
  { name: 'Leather goods', x: 7.4, z: 2.2, visitors: 248, dwell: '4m 32s', interactions: 186, note: 'Your most explored collection. Give this display more room in the next edit.' },
  { name: 'The new edit', x: 4.8, z: 4.4, visitors: 192, dwell: '3m 18s', interactions: 124, note: 'The central edit brings people together. A natural place for your next launch.' },
  { name: 'Ready-to-wear', x: 1.9, z: 4.7, visitors: 126, dwell: '2m 06s', interactions: 72, note: 'Visitors browse here, then move to leather goods. Pair the two collections.' },
];
const project = (x: number, z: number, y = 0) => [385 + (x - z) * 36, 90 + (x + z) * 17 - y * 35];
const coords = (p: number[][]) => p.map(v => v.join(',')).join(' ');
function Block({ x, z, w, d, h, color = '#b3a58c' }: { x: number; z: number; w: number; d: number; h: number; color?: string }) {
  const a = project(x, z, h), b = project(x + w, z, h), c = project(x + w, z + d, h), e = project(x, z + d, h);
  return <g><polygon points={coords([b, c, project(x + w, z + d), project(x + w, z)])} fill="#5d5346" /><polygon points={coords([c, e, project(x, z + d), project(x + w, z + d)])} fill="#877862" /><polygon points={coords([a, b, c, e])} fill={color} stroke="#e3d0ad" strokeWidth=".4" /></g>;
}
export default function Heatmap() {
  const [mode, setMode] = useState<'visitors' | 'interactions'>('visitors');
  const [selected, setSelected] = useState(0);
  const zone = zones[selected];
  return <article className="brand-heatmap feature-card">
    <div className="feature-topline"><span className="eyebrow">04 / Spatial intelligence</span><span className="tier-chip">Platinum</span></div>
    <div className="feature-copy"><h3>See what holds<br /><em>their attention.</em></h3><p>Every pause tells a story. Understand how customers move, what they explore, and where your next collection belongs.</p></div>
    <div className="heat-dashboard">
      <div className="heat-toolbar"><span><i className="status-dot" /> Flagship / Floor 01</span><div className="segmented" aria-label="Heatmap metric"><button aria-pressed={mode === 'visitors'} onClick={() => setMode('visitors')}><Footprints size={12} /> Visitors</button><button aria-pressed={mode === 'interactions'} onClick={() => setMode('interactions')}><MousePointer2 size={12} /> Interactions</button></div></div>
      <div className="heat-layout">
        <div className="heat-map"><svg viewBox="0 0 800 440" role="img" aria-label={`${mode === 'visitors' ? 'Visitor dwell' : 'Product interaction'} heatmap of a three-dimensional boutique floor. Select a numbered collection to inspect its sample metrics.`}>
          <defs><radialGradient id="heat-hot"><stop offset="0" stopColor="#fff1a0" stopOpacity=".98" /><stop offset=".22" stopColor="#ffbf59" stopOpacity=".9" /><stop offset=".48" stopColor="#df693e" stopOpacity=".7" /><stop offset="1" stopColor="#c04b3b" stopOpacity="0" /></radialGradient><radialGradient id="heat-cool"><stop offset="0" stopColor="#d5e0a1" stopOpacity=".8" /><stop offset=".5" stopColor="#849d71" stopOpacity=".45" /><stop offset="1" stopColor="#657b60" stopOpacity="0" /></radialGradient><filter id="floor-shadow"><feGaussianBlur stdDeviation="14" /></filter></defs>
          <ellipse cx="388" cy="315" rx="280" ry="75" fill="#000" opacity=".4" filter="url(#floor-shadow)" />
          <polygon points={coords([project(0,0),project(10,0),project(10,8),project(0,8)])} fill="#4d473c" stroke="#897d66" strokeWidth="1" />
          {Array.from({length: 11}, (_, i) => <path key={`x${i}`} d={`M${project(i,0)}L${project(i,8)}`} stroke="#b2a384" strokeOpacity=".1" />)}
          {Array.from({length: 9}, (_, i) => <path key={`z${i}`} d={`M${project(0,i)}L${project(10,i)}`} stroke="#b2a384" strokeOpacity=".1" />)}
          <Block x={0} z={0} w={10} d={.16} h={2.6} color="#74634e" /><Block x={0} z={0} w={.16} d={8} h={2.6} color="#a48c68" />
          {[1,3.5,6,8].map(x => <g key={x}><Block x={x} z={.25} w={1.55} d={.55} h={1.1} color="#d3c2a4" /><Block x={x+.4} z={.42} w={.55} d={.25} h={1.65} color={x===6?'#b27643':'#37372e'} /></g>)}
          {[1.7,4.8].map(z => <g key={z}><Block x={.3} z={z} w={.6} d={1.8} h={1.4} /><Block x={.4} z={z+.3} w={.25} d={.4} h={1.9} color="#514137" /></g>)}
          {zones.map((v,i) => { const [cx,cy] = project(v.x, v.z); const active = mode === 'visitors' || i !== 2; return <ellipse key={v.name} cx={cx} cy={cy} rx={mode === 'interactions' ? 66 - i*10 : 86-i*8} ry={mode === 'interactions' ? 34-i*5 : 43-i*4} fill={`url(#heat-${active ? 'hot':'cool'})`} opacity={selected === i ? 1 : .75} className="heat-glow" />; })}
          <path d={`M${project(8,7.5)}Q${project(7,5)} ${project(4.8,4.4)}T${project(7.4,2.2)}`} fill="none" stroke="#f3dcaa" strokeWidth="1.5" strokeDasharray="3 7" opacity=".55" />
          <Block x={4} z={3.5} w={1.4} d={1.3} h={.85} color="#d3c7b3" /><Block x={4.4} z={3.85} w={.55} d={.38} h={1.25} color="#895a37" />
          <Block x={7.1} z={4.5} w={1.3} d={.75} h={.7} color="#c0b09a" /><Block x={2.1} z={6} w={1.6} d={.65} h={.5} color="#c0b09a" />
          {[[7.5,6.4],[5.8,4.4],[7.3,2.9],[2.8,4.4],[4,6.1],[8.5,3.5]].map(([x,z],i) => {const [cx,cy] = project(x,z); return <g key={i}><ellipse cx={cx} cy={cy+4} rx="5" ry="2.5" fill="#e6d8b8" opacity=".2" /><circle cx={cx} cy={cy} r="2.5" fill="#f8eac7" /></g>;})}
          {zones.map((v,i) => {const [x,y] = project(v.x,v.z); return <g key={v.name} role="button" aria-label={`Inspect ${v.name}`} aria-pressed={selected===i} tabIndex={0} onClick={() => setSelected(i)} onKeyDown={e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(i);}}} className="heat-hotspot"><circle cx={x} cy={y-35} r="16" fill={selected===i?'#e9d9b7':'#171712'} stroke="#d6c3a2" /><text x={x} y={y-30} textAnchor="middle" fill={selected===i?'#242118':'#e9d9b7'} fontSize="12" fontFamily="monospace">0{i+1}</text><path d={`M${x},${y-19}V${y-5}`} stroke="#dbcaa4" opacity=".6" /></g>;})}
          <text x="445" y="413" fontFamily="monospace" fontSize="9" letterSpacing="3" fill="#a89c82">ENTRANCE ↗</text>
        </svg><div className="heat-legend"><span>Low activity</span><i /><span>High activity</span></div></div>
        <aside className="heat-detail" aria-live="polite"><span className="eyebrow">Collection 0{selected+1}</span><h4>{zone.name}</h4><strong>{mode === 'visitors' ? zone.visitors : zone.interactions}<ArrowUpRight size={20} /></strong><span className="metric-label">{mode === 'visitors' ? 'unique visitors' : 'product interactions'}</span><div className="heat-dwell"><span>Average dwell</span><b>{zone.dwell}</b></div><p>{zone.note}</p><span className="sample-caption">Illustrative data · last 7 days</span></aside>
      </div>
    </div>
    <div className="feature-foot"><span>Turn movement into better merchandising.</span><span>Explore the numbered zones ↗</span></div>
  </article>;
}
