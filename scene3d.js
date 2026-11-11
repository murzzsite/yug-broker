import * as THREE from 'three';

const canvas = document.getElementById('gl');
const stage = document.getElementById('stage');
const fail = () => document.documentElement.classList.add('no-gl');

try {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xa9cfd8, 1.15));
  const sun = new THREE.DirectionalLight(0xfff4e8, 1.5);
  sun.position.set(5, 9, 4); scene.add(sun);

  const C = { ink: 0x0d2530, deep: 0x1c6b7a, sea: 0xcfe5ea, sea2: 0xa9cfd8, paper: 0xfbfcfb, signal: 0xd94a1c, plate: 0xe6edeb };
  const M = c => new THREE.MeshLambertMaterial({ color: c });

  // ground: sea disc + plot
  const g = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 0.12, 72), M(0xbfdce3)); g.position.y = -0.1; scene.add(g);
  const plot = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.16, 3.4), M(C.plate)); plot.position.y = 0.0; scene.add(plot);
  // trees
  const tree = (x, z, s) => {
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.25, 6), M(0x6b5a48)); trunk.position.y = 0.2; t.add(trunk);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 7), M(0x4f8f7a)); cone.position.y = 0.65; t.add(cone);
    t.position.set(x, 0.08, z); t.scale.setScalar(s); scene.add(t);
  };
  [[-1.9, 1.3, 1], [-2.0, 0.6, .8], [1.9, 1.2, 1.1], [-1.5, -1.2, .9], [2.0, -0.2, .8]].forEach(a => tree(...a));

  // facade texture: one window cell, repeated
  const cell = document.createElement('canvas'); cell.width = 128; cell.height = 128;
  const cx = cell.getContext('2d');
  cx.fillStyle = '#f3f6f5'; cx.fillRect(0, 0, 128, 128);
  cx.fillStyle = '#7fb4c1'; cx.fillRect(18, 22, 92, 84);
  cx.fillStyle = '#a7d0da'; cx.fillRect(18, 22, 92, 30);
  cx.fillStyle = '#f3f6f5'; cx.fillRect(62, 22, 4, 84);
  const baseTex = new THREE.CanvasTexture(cell);
  baseTex.colorSpace = THREE.SRGBColorSpace; baseTex.wrapS = THREE.RepeatWrapping; baseTex.anisotropy = 4;
  const facade = rep => { const t = baseTex.clone(); t.needsUpdate = true; t.repeat.set(rep, 1); return t; };

  const FL = 7, FH = 0.6, SL = 0.09;
  const dims = [[2.7, 2.0], [2.7, 2.0], [2.4, 1.8], [2.4, 1.8], [2.4, 1.8], [2.0, 1.5], [2.0, 1.5]];
  const floors = [];
  let yb = 0.08;
  for (let i = 0; i < FL; i++) {
    const [w, d] = dims[i];
    const grp = new THREE.Group();
    const slabM = M(C.paper); slabM.transparent = true;
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.14, SL, d + 0.14), slabM); slab.position.y = SL / 2; grp.add(slab);
    const sx = new THREE.MeshLambertMaterial({ map: facade(Math.round(d / 0.45)), transparent: true });
    const sz = new THREE.MeshLambertMaterial({ map: facade(Math.round(w / 0.45)), transparent: true });
    const top = M(0xe9efed); top.transparent = true;
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, FH - SL, d), [sx, sx, top, top, sz, sz]);
    body.position.y = SL + (FH - SL) / 2; grp.add(body);
    grp.position.y = yb; grp.userData = { base: yb, slabM, mats: [sx, sz, top], i }; grp.visible = false;
    scene.add(grp); floors.push(grp); yb += FH;
  }
  const H = yb;
  // roof pennant
  const flag = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6), M(C.ink)); pole.position.y = 0.45; flag.add(pole);
  const cloth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.02), M(C.signal)); cloth.position.set(0.25, 0.76, 0); flag.add(cloth);
  flag.position.set(0, H, 0); flag.scale.setScalar(0.001); scene.add(flag);

  // crane
  const crane = new THREE.Group(); crane.position.set(2.15, 0.08, -1.0); scene.add(crane);
  const MH = 4.9;
  const mast = new THREE.Mesh(new THREE.BoxGeometry(0.14, MH, 0.14), M(C.signal)); mast.position.y = MH / 2; crane.add(mast);
  for (let k = 0; k < 9; k++) { const br = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.2), M(C.ink)); br.position.y = 0.3 + k * 0.6; crane.add(br); }
  const jib = new THREE.Group(); jib.position.y = MH; crane.add(jib);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.1, 0.12), M(C.signal)); arm.position.x = -1.1; jib.add(arm);
  const cw = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.3), M(C.ink)); cw.position.x = 0.95; jib.add(cw);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.24), M(C.ink)); cab.position.set(0, 0.17, 0); jib.add(cab);
  const hook = new THREE.Group(); jib.add(hook);
  const rope = new THREE.Mesh(new THREE.BoxGeometry(0.018, 1, 0.018), M(C.ink)); rope.position.y = -0.5; hook.add(rope);
  const load = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.32), M(C.deep)); load.position.y = -1.05; hook.add(load);

  // sizing
  const size = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  size(); new ResizeObserver(size).observe(stage);

  let visible = true;
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { rootMargin: '100px' }).observe(stage);
  const mouse = { x: 0, y: 0, cx: 0, cy: 0 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth - .5; mouse.y = e.clientY / innerHeight - .5; });

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  let s = 0, t0 = performance.now();
  const tint = new THREE.Color(), base = new THREE.Color(C.paper), sig = new THREE.Color(C.signal);

  const frame = now => {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const reduce = window.YUG && window.YUG.reduce;
    const target = window.YUG ? window.YUG.p : 0;
    s += (target - s) * (reduce ? 1 : 0.07);
    const u = s * FL, tt = (now - t0) / 1000;
    let topY = 0.08;
    floors.forEach((f, i) => {
      const t = clamp(u - i), e = ease(t);
      f.visible = t > 0.001;
      f.position.y = f.userData.base + (1 - e) * 1.6;
      f.userData.mats.forEach(m => { m.opacity = e; });
      f.userData.slabM.opacity = e;
      const active = i === Math.min(FL - 1, Math.floor(u)) && u < FL;
      tint.copy(base).lerp(sig, active ? 0.9 : 0);
      f.userData.slabM.color.lerp(tint, 0.2);
      if (t > 0.5) topY = f.userData.base + FH;
    });
    const done = clamp((s - 0.96) / 0.04);
    flag.scale.setScalar(Math.max(0.001, ease(done))); flag.rotation.y = Math.sin(tt * 1.4) * 0.25;
    // crane
    const goal = Math.max(topY + 0.8, 1.4);
    jib.rotation.y = reduce ? 0.6 : Math.sin(tt * 0.35) * 0.9 + 0.6;
    const len = Math.max(0.3, MH - goal - 0.5) + Math.sin(tt * 0.9) * 0.1;
    hook.scale.y = len; hook.position.x = -1.9;
    load.position.y = -len - 0.05; load.scale.y = 1; rope.position.y = -0.5; rope.scale.y = 1;
    hook.scale.y = 1; rope.scale.y = len; rope.position.y = -len / 2;
    load.visible = u < FL - 0.2;
    // camera orbit
    mouse.cx += (mouse.x - mouse.cx) * 0.05; mouse.cy += (mouse.y - mouse.cy) * 0.05;
    const portrait = camera.aspect < 0.9;
    const R = portrait ? 15 : 11.6;
    const th = 0.55 + s * 2.4 + mouse.cx * 0.35;
    const hgt = 3.4 + s * 1.0 - mouse.cy * 1.2;
    camera.position.set(Math.sin(th) * R, hgt, Math.cos(th) * R);
    camera.lookAt(0, 2.45, 0);
    renderer.render(scene, camera);
  };
  requestAnimationFrame(frame);
  canvas.addEventListener('webglcontextlost', fail);
} catch (e) {
  console.error(e); fail();
}
