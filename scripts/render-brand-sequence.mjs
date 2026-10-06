/** Offline authoring only. Start Vite, then run with --playwright-module if needed. */
import { parseArgs } from 'node:util';
import { mkdir, writeFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const { values } = parseArgs({ options: {
  url: { type:'string', default:'http://127.0.0.1:8083' },
  'playwright-module': { type:'string' },
  'from-frame': { type:'string', default:'0' }, 'to-frame': { type:'string', default:'672' },
} });
const firstFrame = Number(values['from-frame']), lastFrame = Number(values['to-frame']);
if (![firstFrame,lastFrame].every(n=>Number.isInteger(n)&&n>=0&&n<=672)||lastFrame<firstFrame) throw new Error('Frame range must be integers between 0 and 672');
const variants = [
  {name:'4k',width:3840,height:2160,quality:.88},
  {name:'desktop',width:1920,height:1080,quality:.86},
  {name:'mobile',width:1280,height:720,quality:.84},
];
const { chromium } = await import(values['playwright-module'] ? pathToFileURL(values['playwright-module']).href : 'playwright');
const root = fileURLToPath(new URL('../public/brands/scroll-sequence/', import.meta.url));
for (const {name} of variants) await mkdir(path.join(root,name), {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
try {
  const page = await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await page.goto(values.url, {waitUntil:'domcontentloaded'});
  await page.evaluate(async (variants) => {
    document.body.innerHTML = ''; document.body.style.margin = '0';
    const host = document.createElement('div'); host.style.cssText = 'position:fixed;inset:0;width:1920px;height:1080px'; document.body.append(host);
    const { createAtelier } = await import('/src/components/brands/atelierScene.ts');
    const state = {time:0,playing:false,visible:true,night:false,rotation:0,quality:'4k',reducedMotion:false};
    await new Promise((resolve,reject) => {
      window.__cleanupExport = createAtelier(host,state,resolve,()=>reject(new Error('WebGL export failed')),{sequence:true,onExportController:c=>window.__atelierExport=c});
    });
    const source=window.__atelierExport.canvas;
    if(source.width!==3840||source.height!==2160)throw new Error(`Expected native 4K render, received ${source.width}×${source.height}`);
    window.__exportVariants=variants.map(variant=>{
      const canvas=document.createElement('canvas');canvas.width=variant.width;canvas.height=variant.height;
      const context=canvas.getContext('2d');context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
      return {...variant,canvas,context};
    });
  }, variants);
  const fps=24, duration=28, count=duration*fps+1;
  for (let i=firstFrame;i<=lastFrame;i++) {
    const images=await page.evaluate(({i,fps})=>{
      const {canvas,renderAt}=window.__atelierExport;renderAt(i/fps);
      return window.__exportVariants.map(variant=>{
        variant.context.drawImage(canvas,0,0,variant.width,variant.height);
        return variant.canvas.toDataURL('image/webp',variant.quality).split(',')[1];
      });
    },{i,fps});
    const file=`frame-${String(i).padStart(4,'0')}.webp`;
    await Promise.all(variants.map(({name},j)=>writeFile(path.join(root,name,file),Buffer.from(images[j],'base64'))));
    if(i%24===0||i===lastFrame) console.log(`Rendered ${i+1}/${count} native 4K frames + derivatives`);
  }
  const sizes={};
  for(const variant of variants){
    const files=(await readdir(path.join(root,variant.name))).filter(file=>/^frame-\d{4}\.webp$/.test(file));
    const bytes=(await Promise.all(files.map(file=>stat(path.join(root,variant.name,file))))).reduce((sum,file)=>sum+file.size,0);
    sizes[variant.name]={...variant,frames:files.length,bytes};
  }
  await writeFile(path.join(root,'manifest.json'),JSON.stringify({version:2,fps,duration,count,variants:sizes,replaceAt:24.3,source:'Original VPO Atelier 01 scene rendered natively in 4K with original 4K material maps',pattern:'{size}/frame-{index:04}.webp'},null,2)+'\n');
  await page.evaluate(()=>window.__cleanupExport());
} finally { await browser.close(); }
