import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Original VPO model. All surfaces, seams and hardware are geometry, not stock imagery.
const smooth = (v: number) => { const t = THREE.MathUtils.clamp(v, 0, 1); return t * t * (3 - 2 * t); };
const gold = () => new THREE.MeshStandardMaterial({ color: '#c8ab73', metalness: .92, roughness: .32, envMapIntensity: .8 });
const material = (color: string, roughness = .6) => new THREE.MeshStandardMaterial({ color, roughness });
function box(parent: THREE.Object3D, size: number[], at: number[], mat: THREE.Material, radius = .03) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(size[0], size[1], size[2], 3, Math.min(radius, Math.min(...size) / 2)), mat);
  mesh.position.set(at[0], at[1], at[2]); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function tube(parent: THREE.Object3D, points: number[][], radius: number, mat: THREE.Material, segments = 80) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8, false), mat);
  mesh.castShadow = true; parent.add(mesh); return mesh;
}
function grainTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 4096;
  const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#888'; ctx.fillRect(0, 0, 4096, 4096);
  let seed = 47; const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 170000; i++) {
    const v = 78 + Math.floor(rand() * 100); ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.beginPath(); ctx.ellipse(rand() * 4096, rand() * 4096, 1.5 + rand() * 4, 1 + rand() * 2, rand() * Math.PI, 0, Math.PI * 2); ctx.fill();
  }
  const t = new THREE.CanvasTexture(canvas); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
}
function stoneTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#bbae97'; ctx.fillRect(0, 0, 1024, 1024);
  let seed = 19; const rand = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 17000; i++) {
    ctx.fillStyle = `rgba(${rand() > .5 ? '235,221,196' : '70,59,43'},${rand() * .09})`;
    ctx.fillRect(rand() * 1024, rand() * 1024, rand() * 95 + 3, rand() * 2 + .4);
  }
  const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
}

export function buildHandbag(grain: THREE.Texture, color = '#754021', details?: { normal: THREE.Texture; roughness: THREE.Texture }) {
  const bag = new THREE.Group();
  const leather = new THREE.MeshPhysicalMaterial({ color, roughness: details ? .84 : .52, bumpMap: grain, bumpScale: .007, normalMap: details?.normal, normalScale: new THREE.Vector2(.65, .65), roughnessMap: details?.roughness, clearcoat: .18, clearcoatRoughness: .48, envMapIntensity: .7 });
  const edge = material('#3c2319', .48); const brass = gold(); const thread = material('#c9a170');
  // Slightly bowed, tapering front and back panels with a soft rounded rectangular cross-section.
  const geometry = new THREE.BufferGeometry(); const positions: number[] = []; const uvs: number[] = []; const indices: number[] = [];
  const rings = 36; const slices = 128;
  for (let j = 0; j <= rings; j++) {
    const v = j / rings; const y = v * 1.14 + .07;
    const width = .87 - v * .115; const depth = .31 - v * .065;
    for (let i = 0; i <= slices; i++) {
      const a = i / slices * Math.PI * 2; const c = Math.cos(a); const s = Math.sin(a);
      const baseRound = .965 + .035 * Math.sin(v * Math.PI);
      positions.push(Math.sign(c) * Math.pow(Math.abs(c), .36) * width * baseRound,
        y + .018 * Math.sin(a * 2) * Math.sin(v * Math.PI),
        Math.sign(s) * Math.pow(Math.abs(s), .36) * depth + Math.sin(v * Math.PI) * .017 * Math.sin(a));
      uvs.push(i / slices * 2, v);
      if (j < rings && i < slices) { const k = j * (slices + 1) + i; indices.push(k, k + slices + 1, k + 1, k + 1, k + slices + 1, k + slices + 2); }
    }
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
  const body = new THREE.Mesh(geometry, leather); body.castShadow = true; bag.add(body);
  box(bag, [1.68, .08, .57], [0, .09, 0], leather, .035);
  box(bag, [1.49, .055, .455], [0, 1.2, 0], edge);
  // Overlapping flap, leather belts, bevelled lock and rivets.
  const flapShape = new THREE.Shape(); flapShape.moveTo(-.747, 1.22); flapShape.lineTo(.747, 1.22); flapShape.lineTo(.71, .9);
  flapShape.quadraticCurveTo(.68, .82, .59, .8); flapShape.quadraticCurveTo(0, .70, -.59, .8); flapShape.quadraticCurveTo(-.68, .82, -.71, .9); flapShape.closePath();
  const flap = new THREE.Mesh(new THREE.ExtrudeGeometry(flapShape, { depth: .029, bevelEnabled: true, bevelThickness: .015, bevelSize: .018, bevelSegments: 3, curveSegments: 24 }), leather);
  flap.position.z = .261; flap.castShadow = true; bag.add(flap);
  tube(bag, [[-.733, 1.18, .3], [-.703, .92, .3], [-.59, .818, .3], [0, .739, .308], [.59, .818, .3], [.703, .92, .3], [.733, 1.18, .3]], .007, edge);
  for (const x of [-.49, .49]) {
    box(bag, [.085, .31, .045], [x, 1.06, .31], leather, .012);
    box(bag, [.12, .06, .055], [x, .89, .345], brass, .008);
  }
  box(bag, [1.42, .085, .04], [0, .935, .32], leather, .018);
  box(bag, [.25, .115, .055], [0, .924, .36], brass, .018);
  box(bag, [.075, .042, .075], [0, .925, .40], brass, .013);
  // Two rolled handles with stitched inset tracks and solid mounting rings.
  for (const z of [-.205, .22]) {
    const path = [[-.49, 1.15, z], [-.48, 1.49, z], [-.30, 1.79, z], [0, 1.865, z], [.30, 1.79, z], [.48, 1.49, z], [.49, 1.15, z]];
    tube(bag, path, .043, leather, 100);
    tube(bag, path.map(p => [p[0], p[1], p[2] + .038]), .0045, thread, 100);
    for (const x of [-.49, .49]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.058, .012, 10, 28), brass); ring.position.set(x, 1.205, z + .009); bag.add(ring);
      box(bag, [.09, .22, .055], [x, 1.135, z], leather, .014);
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(.015, 12, 8), brass); rivet.position.set(x, 1.079, z + .035); bag.add(rivet);
    }
  }
  // Raised saddle stitching, individually separated along the front perimeter.
  const stitchPoints: number[] = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 40; i++) {
      const y = .16 + i * .025; const x = side * (.82 - (y - .07) / 1.14 * .115);
      stitchPoints.push(x, y, .317 - y * .057, x + side * .006, y + .014, .317 - y * .057);
    }
  }
  for (let i = 0; i < 62; i++) { const x = -.77 + i * .025; stitchPoints.push(x, .14, .304, x + .014, .144, .304); }
  const stitches = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(stitchPoints, 3)), new THREE.LineBasicMaterial({ color: '#c8a276' })); bag.add(stitches);
  // Gusset piping, hanging clochette, and brass feet finish the silhouette.
  for (const x of [-1, 1]) {
    tube(bag, [[x * .73, 1.18, -.225], [x * .8, .74, -.29], [x * .857, .12, -.28], [x * .867, .085, 0], [x * .857, .12, .28], [x * .8, .74, .29], [x * .73, 1.18, .225]], .009, edge);
    for (const z of [-.21, .21]) box(bag, [.075, .055, .075], [x * .69, .035, z], brass, .02);
  }
  tube(bag, [[.46, 1.23, .29], [.59, 1.16, .35], [.63, .9, .355], [.62, .70, .36]], .015, leather);
  const tag = box(bag, [.11, .19, .042], [.62, .65, .365], leather, .025); tag.rotation.z = -.1;
  const label = document.createElement('canvas'); label.width = 512; label.height = 128;
  const ctx = label.getContext('2d')!; ctx.fillStyle = '#cfac73'; ctx.textAlign = 'center'; ctx.font = '36px Georgia'; ctx.fillText('A T E L I E R', 256, 58); ctx.font = '18px sans-serif'; ctx.fillText('V P O   E D I T I O N   0 1', 256, 94);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(.38, .095), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(label), transparent: true })); logo.position.set(0, 1.075, .307); bag.add(logo);
  return bag;
}

export type StudioState = { time: number; playing: boolean; visible: boolean; night: boolean; rotation: number; quality: 'auto' | '4k'; reducedMotion: boolean };
export type AtelierExportController = { canvas: HTMLCanvasElement; renderAt: (time: number) => void };
type AtelierOptions = { sequence?: boolean; onExportController?: (controller: AtelierExportController) => void };
export function createAtelier(host: HTMLElement, state: StudioState, onReady: (photo: string) => void, onError: () => void, options: AtelierOptions = {}) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }); } catch { onError(); return () => {}; }
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true; renderer.setClearColor('#211910'); host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Animated 3D atelier: cognac leather handbag with saddle stitching and brass hardware on a travertine shelf');
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog('#211910', 12, 27);
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 60);
  const pmrem = new THREE.PMREMGenerator(renderer); const room = new RoomEnvironment(); const env = pmrem.fromScene(room, .04); scene.environment = env.texture; room.dispose(); pmrem.dispose();
  const grain = grainTexture(); const stone = stoneTexture();
  let assetsRemaining = 2;
  const assetFinished = () => { assetsRemaining--; };
  const textureLoader = new THREE.TextureLoader();
  const details = { normal: textureLoader.load('/brands/leather-normal-4k.webp', assetFinished, undefined, assetFinished), roughness: textureLoader.load('/brands/leather-roughness-4k.webp', assetFinished, undefined, assetFinished) };
  for (const texture of Object.values(details)) { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); }
  const travertine = new THREE.MeshStandardMaterial({ map: stone, roughness: .69, bumpMap: stone, bumpScale: .025 });
  const walnut = material('#352a20', .61); const bronze = gold(); const dark = material('#15130f', .77);
  const lightMat = new THREE.MeshBasicMaterial({ color: '#ffdf9f' });
  const scanStone = new THREE.Color('#252a26');
  const naturalStone = new THREE.Color('#ffffff');
  const alcoveLights: THREE.PointLight[] = [];
  box(scene, [22, .18, 18], [0, -.13, 0], travertine);
  box(scene, [16, 7, .2], [0, 3, -2.08], walnut);
  // Architectural framing and luminous, inset stone bays.
  for (const x of [-4.2, 0, 4.2]) {
    box(scene, [3.84, 4.7, .16], [x, 2.46, -1.87], travertine);
    for (const side of [-1, 1]) {
      box(scene, [.12, 4.8, .54], [x + side * 1.98, 2.48, -1.67], bronze);
      box(scene, [.025, 4.52, .03], [x + side * 1.86, 2.5, -1.52], lightMat, .008);
    }
    box(scene, [3.86, .07, .8], [x, 1.14, -1.28], bronze);
    box(scene, [3.76, .085, .72], [x, 1.2, -1.28], travertine);
    box(scene, [3.7, .024, .026], [x, 1.094, -.9], lightMat, .008);
    box(scene, [3.86, .055, .7], [x, 3.55, -1.37], bronze);
    box(scene, [3.64, .023, .02], [x, 3.507, -1.02], lightMat, .005);
    const alcoveLight = new THREE.PointLight('#ffd6a0', 6, 5, 2); alcoveLight.position.set(x, 3.3, -1); scene.add(alcoveLight); alcoveLights.push(alcoveLight);
  }
  for (let i = 0; i < 53; i++) box(scene, [.055, 5.6, .08], [-6.7 + i * .25, 2.8, -1.92], walnut, .009);
  // The foreground shelf is the replacement destination, with an existing black piece.
  box(scene, [3.8, .16, 1.5], [0, 1.14, .30], travertine, .04);
  box(scene, [3.81, .033, 1.5], [0, 1.04, .3], bronze, .01);
  box(scene, [2.8, 1.02, 1], [0, .50, .2], walnut);
  for (let i = 0; i < 30; i++) box(scene, [.036, 1, .05], [-1.37 + i * .095, .5, .71], bronze, .006);
  const bag = buildHandbag(grain, '#754021', details); scene.add(bag);
  const oldBag = buildHandbag(grain, '#191a17', details); oldBag.position.set(0, 1.225, .25); oldBag.rotation.y = -.10; scene.add(oldBag);
  for (const [x, y, z, scale, color] of [[-3.65, 1.25, -1.22, .76, '#30322b'], [3.65, 1.25, -1.22, .7, '#613021'], [-.75, 3.58, -1.25, .57, '#211f1b'], [4.25, 3.58, -1.25, .58, '#8a6043']] as const) {
    const b = buildHandbag(grain, color, details); b.position.set(x, y, z); b.scale.setScalar(scale); b.rotation.y = -.18; scene.add(b);
  }
  // Cloth-like display pads and an understated sculptural vessel.
  box(scene, [2, .03, .72], [0, 1.233, .25], dark, .014);
  const vase = new THREE.Mesh(new THREE.LatheGeometry(Array.from({ length: 32 }, (_, i) => { const t = i / 31; return new THREE.Vector2(.12 + Math.sin(t * Math.PI) * .16, t * .65); }), 48), travertine);
  vase.position.set(1.28, 1.24, .1); vase.castShadow = true; scene.add(vase);
  const ambient = new THREE.HemisphereLight('#e9e3d5', '#3e2a17', .9); scene.add(ambient);
  const key = new THREE.DirectionalLight('#fff2d9', 2.2); key.position.set(-3, 6, 5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -6; key.shadow.normalBias = .025; scene.add(key);
  const fill = new THREE.DirectionalLight('#d6dfef', .65); fill.position.set(5, 4, 2); scene.add(fill);
  const wire = new THREE.Group(); const revealPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 5);
  bag.updateMatrixWorld(true);
  bag.traverse(obj => {
    if (!(obj instanceof THREE.Mesh) || !obj.geometry) return;
    const lines = new THREE.LineSegments(new THREE.WireframeGeometry(obj.geometry), new THREE.LineBasicMaterial({ color: '#d6f3e7', transparent: true, opacity: .48, clippingPlanes: [revealPlane] }));
    lines.applyMatrix4(obj.matrixWorld); wire.add(lines);
  }); scene.add(wire);
  const particlesGeo = new THREE.BufferGeometry(); const particleData: number[] = [];
  const bodyPositions = (bag.children[0] as THREE.Mesh).geometry.getAttribute('position');
  for (let i = 0; i < bodyPositions.count; i += 3) particleData.push(bodyPositions.getX(i), bodyPositions.getY(i), bodyPositions.getZ(i));
  particlesGeo.setAttribute('position', new THREE.Float32BufferAttribute(particleData, 3));
  const dots = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ color: '#cbffe1', size: .016, transparent: true, opacity: .8, clippingPlanes: [revealPlane] })); scene.add(dots);
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ color: '#bde5ce', transparent: true, opacity: .14, side: THREE.DoubleSide, depthWrite: false })); scan.rotation.x = -Math.PI / 2; scene.add(scan);
  const scanEdge = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.2, 0, -.6), new THREE.Vector3(1.2, 0, -.6), new THREE.Vector3(1.2, 0, .6), new THREE.Vector3(-1.2, 0, .6)]), new THREE.LineBasicMaterial({ color: '#c3f9e0', transparent: true, opacity: .8 })); scene.add(scanEdge);
  let width = 0, height = 0, lastQuality = '', disposed = false, frame = 0, lastFrame = 0, captured = false;
  let renderKey = '', settlingFrames = 40;
  const resize = () => {
    width = host.clientWidth; height = host.clientHeight; if (!width || !height) return;
    const ratio = state.quality === '4k' ? Math.min(3840, renderer.capabilities.maxTextureSize) / Math.max(width, height) : Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(ratio); renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); lastQuality = state.quality;
  };
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  const cameraTarget = new THREE.Vector3(); const look = new THREE.Vector3();
  const render = (now: number, exporting = false) => {
    if (disposed) return;
    if (!exporting) frame = requestAnimationFrame(render);
    if (!exporting && (!state.visible || document.hidden) && captured) return;
    if (!exporting && now - lastFrame < (state.reducedMotion ? 100 : 1000 / 40)) return; lastFrame = now;
    if (lastQuality !== state.quality) resize();
    const nextKey = `${state.time}/${state.night}/${state.rotation}/${state.quality}/${width}/${height}`;
    if (nextKey !== renderKey) { renderKey = nextKey; settlingFrames = 40; }
    else if (!exporting && captured && settlingFrames-- <= 0) return;
    const t = state.time; const stage = t < 6 ? 0 : t < 13 ? 1 : t < 20 ? 2 : 3;
    // The separate scroll study holds the existing piece until the simulated Replace click.
    const placement = options.sequence ? smooth((t - 24.3) / 2.2) : smooth((t - 21) / 4);
    const raised = options.sequence ? smooth((t - 5.3) / 1.2) * (1 - placement) : stage === 0 ? 0 : 1 - placement;
    const rotation = stage === 1 ? (t - 6) * .22 : stage === 2 ? (t - 13) * .82 + 1.54 : 7.28 * (1 - placement);
    bag.position.set(stage === 0 ? 0 : -.2 * raised, 1.25 + raised * .5, .25 + raised * .3);
    bag.rotation.y = stage === 0 ? -.22 + state.rotation : rotation - .22 + state.rotation;
    bag.visible = stage !== 1; bag.scale.setScalar(1);
    oldBag.visible = stage === 3 && placement < .85; oldBag.scale.setScalar(1 - placement); oldBag.position.x = placement * -1.4;
    if (stage === 2) {
      const materialReveal = smooth((t - 13) / 3); bag.scale.setScalar(.97 + materialReveal * .03);
      bag.traverse(obj => { if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) { obj.material.clippingPlanes = materialReveal < 1 ? [revealPlane] : []; } });
      revealPlane.constant = 1.7 + materialReveal * 2.1;
    } else { bag.traverse(obj => { if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) obj.material.clippingPlanes = []; }); }
    wire.position.copy(bag.position); wire.rotation.copy(bag.rotation); wire.visible = stage === 1 || (stage === 2 && t < 16);
    dots.position.copy(bag.position); dots.rotation.copy(bag.rotation); dots.visible = stage === 1;
    scan.visible = scanEdge.visible = stage === 1; scan.position.set(bag.position.x, 1.7 + ((t - 6) / 7) * 1.95, bag.position.z); scanEdge.position.copy(scan.position);
    if (stage === 1) revealPlane.constant = scan.position.y;
    const distance = stage === 3 ? 1 + placement * .22 : 1;
    const mobile = width < 600; cameraTarget.set((stage === 1 ? 3.1 : 2.7) * distance, 2.65 + raised * .42, (mobile ? 9.7 : 6.4) * distance);
    if (options.sequence) cameraTarget.x = (2.7 + .4 * smooth((t - 6) / .8) * (1 - smooth((t - 13) / .8))) * distance;
    camera.position.lerp(cameraTarget, exporting ? 1 : captured ? .06 : 1); look.set(mobile && stage === 3 ? .55 : -.10, 2.03 + raised * .30, 0); camera.lookAt(look);
    const scanning = stage === 1;
    travertine.color.lerp(scanning ? scanStone : naturalStone, .10);
    alcoveLights.forEach(light => { light.intensity = THREE.MathUtils.lerp(light.intensity, scanning ? .6 : 6, .1); });
    ambient.intensity = THREE.MathUtils.lerp(ambient.intensity, state.night || scanning ? .25 : .9, .05); key.intensity = THREE.MathUtils.lerp(key.intensity, state.night || scanning ? .4 : 2.2, .05);
    renderer.toneMappingExposure = THREE.MathUtils.lerp(renderer.toneMappingExposure, state.night ? .75 : 1.06, .05);
    if (exporting) {
      const scanBlend = smooth((t - 6) / .65) * (1 - smooth((t - 13) / .8));
      travertine.color.copy(naturalStone).lerp(scanStone, scanBlend);
      alcoveLights.forEach(light => { light.intensity = THREE.MathUtils.lerp(6, .6, scanBlend); });
      ambient.intensity = THREE.MathUtils.lerp(.9, .25, scanBlend);
      key.intensity = THREE.MathUtils.lerp(2.2, .4, scanBlend);
      renderer.toneMappingExposure = 1.06;
    }
    renderer.render(scene, camera);
    if (!captured && assetsRemaining === 0) {
      // A missing optional material map must not prevent the original model from loading.
      scene.traverse(obj => { if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
        if (obj.material.normalMap && !obj.material.normalMap.image) { obj.material.normalMap = null; obj.material.needsUpdate = true; }
        if (obj.material.roughnessMap && !obj.material.roughnessMap.image) { obj.material.roughnessMap = null; obj.material.needsUpdate = true; }
      } });
      renderer.render(scene, camera);
      captured = true; onReady(renderer.domElement.toDataURL('image/jpeg', .88));
    }
  }; frame = requestAnimationFrame(render);
  options.onExportController?.({ canvas: renderer.domElement, renderAt: (time) => { state.time = time; render(performance.now(), true); } });
  const contextLost = (e: Event) => { e.preventDefault(); onError(); }; renderer.domElement.addEventListener('webglcontextlost', contextLost);
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect(); renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    const mats = new Set<THREE.Material>(); const geometries = new Set<THREE.BufferGeometry>(); const textures = new Set<THREE.Texture>([grain, stone]);
    scene.traverse(obj => { if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) { geometries.add(obj.geometry); for (const m of Array.isArray(obj.material) ? obj.material : [obj.material]) { mats.add(m); for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value); } } });
    geometries.forEach(g => g.dispose()); mats.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); env.dispose(); renderer.dispose(); renderer.domElement.remove();
  };
}
