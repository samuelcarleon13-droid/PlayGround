import * as THREE from '../vendor/three.module.js';

/* ------------------------------------------------------------------ *
 *  ACERO ROJO — escenarios
 *  7 sectores con paletas, props y clima distintos.
 * ------------------------------------------------------------------ */

export const LEVELS = [
  {
    n: 1, name: 'BASE AURORA', biome: 'DESIERTO', subtitle: 'ELIMINA A TODOS LOS HOSTILES',
    target: 8, maxAlive: 3, seed: 1201, size: 74,
    mix: { soldier: 6, scout: 2 },
    theme: {
      skyTop: 0x2f587c, skyBottom: 0xf0a463, fog: 0xd9a97a, fogNear: 42, fogFar: 175,
      ground: 0xc7a675, groundKind: 'sand', sun: 0xffd7a3, sunIntensity: 2.9, sunPos: [-40, 58, 26],
      hemiSky: 0xa9c8e4, hemiGround: 0x9c7448, hemiIntensity: 1.15, exposure: 1.05,
      crate: 0x8f7853, accent: 0xb3542d, wall: 0x9b8262, silhouette: 'mountains', particles: 'dust'
    }
  },
  {
    n: 2, name: 'VALLE OSCURO', biome: 'BOSQUE', subtitle: 'LIMPIA EL VALLE Y AVANZA',
    target: 10, maxAlive: 4, seed: 2213, size: 78,
    mix: { soldier: 5, scout: 3, sniper: 1 },
    theme: {
      skyTop: 0x6f93a8, skyBottom: 0xdde2cc, fog: 0xa6b6a4, fogNear: 30, fogFar: 130,
      ground: 0x52663c, groundKind: 'grass', sun: 0xffe7bd, sunIntensity: 2.1, sunPos: [34, 52, -30],
      hemiSky: 0xc9dbd2, hemiGround: 0x3e4a2c, hemiIntensity: 1.25, exposure: 1.0,
      crate: 0x6b5a3c, accent: 0x8d9c4a, wall: 0x5b6048, silhouette: 'forest', particles: 'pollen'
    }
  },
  {
    n: 3, name: 'PUERTO NEGRO', biome: 'NOCHE', subtitle: 'RECUPERA EL MUELLE BAJO LA NIEBLA',
    target: 12, maxAlive: 5, seed: 3347, size: 80,
    mix: { soldier: 4, scout: 3, sniper: 3, heavy: 1 },
    theme: {
      skyTop: 0x040a16, skyBottom: 0x123043, fog: 0x09151f, fogNear: 22, fogFar: 105,
      ground: 0x2a3138, groundKind: 'asphalt', sun: 0x93b8dd, sunIntensity: 0.6, sunPos: [-30, 48, -34],
      hemiSky: 0x2a4a6a, hemiGround: 0x0a0f14, hemiIntensity: 0.75, exposure: 1.18,
      crate: 0x38505a, accent: 0xc4552c, wall: 0x2b3941, silhouette: 'city', particles: null, night: true
    }
  },
  {
    n: 4, name: 'PUESTO GLACIAR', biome: 'NIEVE', subtitle: 'ROMPE LA LÍNEA DEL GLACIAR',
    target: 14, maxAlive: 5, seed: 4481, size: 82,
    mix: { soldier: 4, heavy: 3, sniper: 2, scout: 2 },
    theme: {
      skyTop: 0x8fa9bd, skyBottom: 0xeef4f6, fog: 0xd3e0e7, fogNear: 30, fogFar: 140,
      ground: 0xdde8ee, groundKind: 'snow', sun: 0xffffff, sunIntensity: 2.2, sunPos: [26, 54, 34],
      hemiSky: 0xd7e8f4, hemiGround: 0x8fa3af, hemiIntensity: 1.4, exposure: 0.98,
      crate: 0x6a7d86, accent: 0x9c3f2c, wall: 0x93a6b0, silhouette: 'mountains', particles: 'snow'
    }
  },
  {
    n: 5, name: 'DISTRITO 7', biome: 'CIUDAD', subtitle: 'ASALTA EL DISTRITO INDUSTRIAL',
    target: 16, maxAlive: 6, seed: 5591, size: 84,
    mix: { soldier: 4, scout: 3, heavy: 2, sniper: 2 },
    theme: {
      skyTop: 0x6e4a63, skyBottom: 0xf0b073, fog: 0xc79a7c, fogNear: 32, fogFar: 140,
      ground: 0x3b3d40, groundKind: 'asphalt', sun: 0xffc98f, sunIntensity: 2.2, sunPos: [-48, 40, -18],
      hemiSky: 0xd6b299, hemiGround: 0x2a2b2d, hemiIntensity: 1.0, exposure: 1.02,
      crate: 0x5e666b, accent: 0xd0662a, wall: 0x555a5f, silhouette: 'city', particles: 'dust'
    }
  },
  {
    n: 6, name: 'TEMPLO DE CENIZA', biome: 'RUINAS', subtitle: 'NADIE SALE DEL TEMPLO',
    target: 18, maxAlive: 7, seed: 6719, size: 86,
    mix: { heavy: 4, elite: 3, sniper: 3, scout: 3 },
    theme: {
      skyTop: 0x4b1828, skyBottom: 0xe08a4a, fog: 0x9c5b46, fogNear: 30, fogFar: 130,
      ground: 0xa87a56, groundKind: 'sand', sun: 0xffb078, sunIntensity: 2.4, sunPos: [44, 36, -22],
      hemiSky: 0xd39a7d, hemiGround: 0x4a2d26, hemiIntensity: 1.1, exposure: 1.06,
      crate: 0x7b5b45, accent: 0xc1934a, wall: 0x8a6750, silhouette: 'ruins', particles: 'embers'
    }
  },
  {
    n: 7, name: 'EL NÚCLEO', biome: 'FINAL', subtitle: 'DESTRUYE EL COMANDANTE Y CIERRA LA OPERACIÓN',
    target: 20, maxAlive: 8, seed: 7919, size: 88, boss: true,
    mix: { elite: 6, heavy: 3, scout: 3, sniper: 2 },
    theme: {
      skyTop: 0x08050b, skyBottom: 0x3c1110, fog: 0x1b0a0c, fogNear: 24, fogFar: 120,
      ground: 0x1f1a1d, groundKind: 'basalt', sun: 0xff7b3c, sunIntensity: 1.5, sunPos: [30, 46, 20],
      hemiSky: 0x6a2a25, hemiGround: 0x0d0a0c, hemiIntensity: 0.85, exposure: 1.1,
      crate: 0x3d3336, accent: 0xff5a1f, wall: 0x352a2c, silhouette: 'core', particles: 'embers', night: true
    }
  }
];

/* ------------------------------------------------------------------ */

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hex(c) { return '#' + new THREE.Color(c).getHexString(); }

function shade(color, amount) {
  const c = new THREE.Color(color);
  c.offsetHSL(0, 0, amount);
  return c;
}

function makeGroundTexture(base, kind, rng) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const color = new THREE.Color(base);
  ctx.fillStyle = hex(base);
  ctx.fillRect(0, 0, size, size);

  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  const variance = kind === 'snow' ? 10 : kind === 'grass' ? 26 : 20;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng() - 0.5) * variance * 2;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  const dark = shade(color, -0.11), light = shade(color, 0.09);
  if (kind === 'grass') {
    for (let i = 0; i < 2600; i++) {
      ctx.strokeStyle = `rgba(${Math.round(dark.r * 255)},${Math.round(dark.g * 255)},${Math.round(dark.b * 255)},${0.1 + rng() * 0.25})`;
      ctx.lineWidth = 1;
      const x = rng() * size, y = rng() * size;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (rng() - 0.5) * 5, y - 3 - rng() * 7); ctx.stroke();
    }
  } else if (kind === 'sand') {
    for (let i = 0; i < 60; i++) {
      ctx.strokeStyle = `rgba(${Math.round(dark.r * 255)},${Math.round(dark.g * 255)},${Math.round(dark.b * 255)},${0.08 + rng() * 0.1})`;
      ctx.lineWidth = 1 + rng() * 2;
      const y = rng() * size;
      ctx.beginPath();
      ctx.moveTo(rng() * size, y);
      ctx.bezierCurveTo(size * 0.3, y + 20, size * 0.6, y - 16, size, y + 6);
      ctx.stroke();
    }
  } else if (kind === 'asphalt' || kind === 'basalt') {
    for (let i = 0; i < 220; i++) {
      ctx.fillStyle = `rgba(${Math.round(dark.r * 255)},${Math.round(dark.g * 255)},${Math.round(dark.b * 255)},${0.15 + rng() * 0.2})`;
      const x = rng() * size, y = rng() * size, w = 1 + rng() * 3;
      ctx.fillRect(x, y, w, w);
    }
    for (let i = 0; i < 14; i++) {
      ctx.strokeStyle = `rgba(${Math.round(light.r * 255)},${Math.round(light.g * 255)},${Math.round(light.b * 255)},.08)`;
      ctx.lineWidth = 1;
      let x = rng() * size, y = rng() * size;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let s = 0; s < 5; s++) { x += (rng() - 0.5) * 40; y += rng() * 26; ctx.lineTo(x, y); }
      ctx.stroke();
    }
  } else if (kind === 'snow') {
    for (let i = 0; i < 100; i++) {
      ctx.strokeStyle = `rgba(255,255,255,${0.1 + rng() * 0.18})`;
      ctx.lineWidth = 1 + rng() * 2;
      const y = rng() * size;
      ctx.beginPath(); ctx.arc(rng() * size, y, 6 + rng() * 22, 0, Math.PI); ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeGlowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.4)'));
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeStars(rng, count = 700) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 150 + rng() * 40;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(rng() * 0.92);
    pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    pos[i * 3 + 1] = Math.abs(Math.cos(phi)) * r + 12;
    pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xd8e6ff, size: 1.05, sizeAttenuation: false, transparent: true, opacity: 0.9, fog: false });
  return new THREE.Points(geo, mat);
}

function makeSky(theme) {
  const geo = new THREE.SphereGeometry(240, 32, 18);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      top: { value: new THREE.Color(theme.skyTop) },
      bottom: { value: new THREE.Color(theme.skyBottom) },
      offset: { value: 0.14 },
      exponent: { value: 0.9 }
    },
    vertexShader: `varying vec3 vWorld; void main(){ vWorld = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 top; uniform vec3 bottom; uniform float offset; uniform float exponent;
      varying vec3 vWorld;
      void main(){
        float h = normalize(vWorld + vec3(0.0, offset, 0.0)).y;
        float t = pow(max(h, 0.0), exponent);
        gl_FragColor = vec4(mix(bottom, top, t), 1.0);
      }`
  });
  return new THREE.Mesh(geo, mat);
}

function makeSun(theme, rng) {
  const group = new THREE.Group();
  const tex = makeGlowTexture('rgba(255,246,220,1)', 'rgba(255,180,90,0)');
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  sprite.scale.setScalar(theme.night ? 34 : 70);
  const dir = new THREE.Vector3(...theme.sunPos).normalize().multiplyScalar(190);
  sprite.position.copy(dir);
  group.add(sprite);
  if (theme.night) {
    const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(200,220,255,1)', 'rgba(80,110,160,0)'), transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    moon.scale.setScalar(20);
    moon.position.set(-100, 120, -120);
    group.add(moon);
    group.add(makeStars(rng));
  }
  return group;
}

/* ------------------------------ props ----------------------------- */

function setShadows(obj) {
  obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
}

function addCollider(colliders, obj, occluders, opts = {}) {
  obj.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(obj);
  const c = {
    minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z,
    minY: box.min.y, maxY: box.max.y, mesh: obj, explosive: !!opts.explosive
  };
  colliders.push(c);
  if (opts.occlude !== false) occluders.push(obj);
  return c;
}

function addEdges(mesh, color = 0x1b1a17, opacity = 0.55) {
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 30),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  edges.position.copy(mesh.position); edges.rotation.copy(mesh.rotation); edges.scale.copy(mesh.scale);
  return edges;
}

function propCrate(group, colliders, occluders, x, z, rot, theme, rng, scale = 1) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: theme.crate, roughness: 0.86, metalness: 0.04 });
  const top = new THREE.MeshStandardMaterial({ color: shade(theme.crate, 0.05), roughness: 0.9 });
  const s = 1.55 * scale;
  const base = new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.92, s), mat);
  base.position.y = s * 0.46;
  g.add(base);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(s * 1.02, s * 0.08, s * 1.02), top);
  lid.position.y = s * 0.94;
  g.add(lid);
  const bandMat = new THREE.MeshStandardMaterial({ color: theme.accent, roughness: 0.7, metalness: 0.2 });
  for (const yy of [0.28, 0.68]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(s * 1.01, s * 0.055, s * 1.01), bandMat);
    band.position.y = s * yy;
    g.add(band);
  }
  if (rng() > 0.55) {
    const s2 = s * 0.72;
    const c2 = new THREE.Mesh(new THREE.BoxGeometry(s2, s2, s2), top);
    c2.position.set((rng() - 0.5) * 0.2, s * 1.02 + s2 * 0.5, (rng() - 0.5) * 0.2);
    c2.rotation.y = (rng() - 0.5) * 0.5;
    g.add(c2);
  }
  g.position.set(x, 0, z); g.rotation.y = rot;
  setShadows(g);
  group.add(g);
  addCollider(colliders, base, occluders);
  return g;
}

function propContainer(group, colliders, occluders, x, z, rot, theme, rng) {
  const g = new THREE.Group();
  const w = 4.6 + rng() * 2, h = 2.5, d = 2.35;
  const mat = new THREE.MeshStandardMaterial({ color: theme.crate, roughness: 0.7, metalness: 0.35 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  body.position.y = h / 2;
  g.add(body);
  const trim = new THREE.MeshStandardMaterial({ color: theme.accent, roughness: 0.65, metalness: 0.3 });
  for (let i = -1; i <= 1; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.12, h * 1.02, d * 1.03), trim);
    rib.position.set(i * w * 0.36, h / 2, 0);
    g.add(rib);
  }
  const doorMat = new THREE.MeshStandardMaterial({ color: shade(theme.crate, -0.08), roughness: 0.8 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(w * 0.46, h * 0.78, 0.1), doorMat);
  door.position.set(w * 0.2, h * 0.5, d / 2 + 0.02);
  g.add(door);
  if (rng() > 0.5) {
    const h2 = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    h2.position.set(0, h * 1.5, 0);
    g.add(h2);
  }
  g.position.set(x, 0, z); g.rotation.y = rot;
  setShadows(g);
  group.add(g);
  addCollider(colliders, body, occluders);
  return g;
}

function propBarrier(group, colliders, occluders, x, z, rot, theme, rng) {
  const g = new THREE.Group();
  const w = 2.8 + rng() * 1.6, h = 1.15, d = 0.42;
  const mat = new THREE.MeshStandardMaterial({ color: shade(theme.wall, 0.02), roughness: 0.95 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  body.position.y = h / 2;
  g.add(body);
  const capMat = new THREE.MeshStandardMaterial({ color: theme.accent, roughness: 0.8 });
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(w * 0.32, h * 0.22, d * 1.05), capMat);
  stripe.position.set(-w * 0.24, h * 0.6, 0);
  g.add(stripe);
  const feet = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, 0.12, d * 1.9), mat);
  feet.position.y = 0.06;
  g.add(feet);
  g.position.set(x, 0, z); g.rotation.y = rot;
  setShadows(g);
  group.add(g);
  addCollider(colliders, body, occluders);
  return g;
}

function propRocks(group, colliders, occluders, x, z, rot, theme, rng) {
  const g = new THREE.Group();
  const count = 1 + Math.floor(rng() * 3);
  const mat = new THREE.MeshStandardMaterial({ color: shade(theme.wall, -0.05), roughness: 1, flatShading: true });
  let main = null;
  for (let i = 0; i < count; i++) {
    const r = (1.0 + rng() * 1.7) * (i === 0 ? 1 : 0.6);
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), mat);
    rock.position.set((rng() - 0.5) * 2.4, r * 0.55, (rng() - 0.5) * 2.4);
    rock.rotation.set(rng() * 3, rng() * 3, rng() * 3);
    rock.scale.y = 0.6 + rng() * 0.55;
    g.add(rock);
    if (i === 0) main = rock;
  }
  g.position.set(x, 0, z); g.rotation.y = rot;
  setShadows(g);
  group.add(g);
  if (main) addCollider(colliders, main, occluders);
  return g;
}

function propTree(group, colliders, occluders, x, z, rot, theme, rng) {
  const g = new THREE.Group();
  const h = 5 + rng() * 3.5;
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3626, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: rng() > 0.5 ? 0x2f4a2a : 0x3a5730, roughness: 1, flatShading: true });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, h * 0.62, 6), trunkMat);
  trunk.position.y = h * 0.31;
  g.add(trunk);
  for (let i = 0; i < 3; i++) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.1 - i * 0.5, 2.6, 7), leafMat);
    cone.position.y = h * 0.5 + i * 1.25;
    cone.rotation.y = rng() * 3;
    g.add(cone);
  }
  g.position.set(x, 0, z); g.rotation.y = rot;
  setShadows(g);
  group.add(g);
  addCollider(colliders, trunk, occluders);
  return g;
}

function propPillar(group, colliders, occluders, x, z, rot, theme, rng) {
  const g = new THREE.Group();
  const h = 4.5 + rng() * 3;
  const mat = new THREE.MeshStandardMaterial({ color: theme.wall, roughness: 0.95 });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.74, h, 10), mat);
  shaft.position.y = h / 2;
  g.add(shaft);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.4, 1.9), mat);
  cap.position.y = h + 0.18;
  g.add(cap);
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 1.8), mat);
  base.position.y = 0.17;
  g.add(base);
  if (rng() > 0.5) {
    const broken = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 1.4), mat);
    broken.position.set(2.1, 0.75, (rng() - 0.5) * 2);
    broken.rotation.set(0.2, rng(), 0.35);
    g.add(broken);
  }
  g.position.set(x, 0, z); g.rotation.y = rot;
  setShadows(g);
  group.add(g);
  addCollider(colliders, shaft, occluders);
  return g;
}

function propBarrel(group, colliders, occluders, x, z, theme, rng) {
  const g = new THREE.Group();
  const explosive = rng() > 0.55;
  const color = explosive ? 0xb3371f : 0x4c6a4a;
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.35 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.12, 12), mat);
  body.position.y = 0.56;
  g.add(body);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c, roughness: 0.6, metalness: 0.5 });
  for (const y of [0.22, 0.9]) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.445, 0.445, 0.08, 12), ringMat);
    ring.position.y = y;
    g.add(ring);
  }
  if (explosive) {
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.02), new THREE.MeshStandardMaterial({ color: 0xffc14a, emissive: 0x442200, roughness: 0.5 }));
    mark.position.set(0, 0.66, 0.425);
    g.add(mark);
  }
  g.position.set(x, 0, z);
  setShadows(g);
  group.add(g);
  addCollider(colliders, body, occluders, { explosive });
  return g;
}

function propBuilding(group, colliders, occluders, x, z, rot, theme, rng) {
  const g = new THREE.Group();
  const w = 6 + rng() * 5, d = 6 + rng() * 4, h = 8 + rng() * 12;
  const mat = new THREE.MeshStandardMaterial({ color: shade(theme.wall, -0.03), roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  body.position.y = h / 2;
  g.add(body);
  const winMat = new THREE.MeshStandardMaterial({ color: 0x0d1417, emissive: theme.accent, emissiveIntensity: 0.5, roughness: 0.4 });
  const cols = Math.max(2, Math.floor(w / 2));
  const rows = Math.min(4, Math.floor(h / 3));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rng() > 0.55) continue;
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.06), winMat);
      win.position.set(-w / 2 + 1 + c * (w - 2) / (cols - 1 || 1), 2.2 + r * 2.4, d / 2 + 0.02);
      g.add(win);
    }
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, 1.2, d * 0.5), mat);
  roof.position.set(w * 0.12, h + 0.6, 0);
  g.add(roof);
  g.position.set(x, 0, z); g.rotation.y = rot;
  setShadows(g);
  group.add(g);
  addCollider(colliders, body, occluders);
  return g;
}

/* --------------------------- silhouettes -------------------------- */

function makeSilhouettes(type, theme, group, rng) {
  const add = (geo, mat, x, y, z, ry = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.rotation.y = ry;
    group.add(m);
    return m;
  };
  if (type === 'mountains') {
    const mat = new THREE.MeshBasicMaterial({ color: shade(theme.fog, -0.18), fog: false });
    const mat2 = new THREE.MeshBasicMaterial({ color: shade(theme.fog, -0.08), fog: false });
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + rng() * 0.15;
      const r = 115 + rng() * 40;
      const h = 22 + rng() * 42;
      add(new THREE.ConeGeometry(14 + rng() * 18, h, 4), i % 3 ? mat : mat2, Math.cos(a) * r, h / 2 - 4, Math.sin(a) * r, rng() * 3);
    }
  } else if (type === 'forest') {
    const mat = new THREE.MeshBasicMaterial({ color: shade(theme.fog, -0.16), fog: false });
    for (let i = 0; i < 90; i++) {
      const a = rng() * Math.PI * 2;
      const r = 52 + rng() * 65;
      const h = 8 + rng() * 12;
      add(new THREE.ConeGeometry(2.6 + rng() * 2, h, 5), mat, Math.cos(a) * r, h / 2, Math.sin(a) * r);
    }
  } else if (type === 'city') {
    const north = new THREE.MeshBasicMaterial({ color: 0x2a3a44, fog: false });
    const south = new THREE.MeshBasicMaterial({ color: 0x1b2933, fog: false });
    const glow = new THREE.MeshBasicMaterial({ color: 0xffb36a, fog: false });
    for (let i = 0; i < 44; i++) {
      const a = rng() * Math.PI * 2;
      const r = 72 + rng() * 80;
      const w = 6 + rng() * 12, h = 14 + rng() * 46, d = 6 + rng() * 12;
      add(new THREE.BoxGeometry(w, h, d), i % 2 ? north : south, Math.cos(a) * r, h / 2, Math.sin(a) * r, rng() * 3);
      for (let k = 0; k < 4; k++) {
        if (rng() > 0.6) continue;
        add(new THREE.BoxGeometry(0.5, 0.4, 0.05), glow, Math.cos(a) * r + (rng() - 0.5) * w, 4 + rng() * (h - 6), Math.sin(a) * r + d / 2, a);
      }
    }
  } else if (type === 'ruins') {
    const mat = new THREE.MeshBasicMaterial({ color: 0x71402f, fog: false });
    for (let i = 0; i < 26; i++) {
      const a = rng() * Math.PI * 2;
      const r = 60 + rng() * 55;
      const h = 12 + rng() * 30;
      add(new THREE.BoxGeometry(4 + rng() * 6, h, 4 + rng() * 6), mat, Math.cos(a) * r, h / 2, Math.sin(a) * r, rng() * 3);
    }
  } else if (type === 'core') {
    const mat = new THREE.MeshBasicMaterial({ color: 0x2a1418, fog: false });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff4a12, fog: false });
    for (let i = 0; i < 30; i++) {
      const a = rng() * Math.PI * 2;
      const r = 65 + rng() * 65;
      const h = 20 + rng() * 56;
      add(new THREE.BoxGeometry(4 + rng() * 9, h, 4 + rng() * 9), mat, Math.cos(a) * r, h / 2, Math.sin(a) * r, rng() * 3);
      add(new THREE.BoxGeometry(0.4, h * 0.7, 0.4), glowMat, Math.cos(a) * r, h * 0.5, Math.sin(a) * r);
    }
  }
}

/* ---------------------------- particles --------------------------- */

function makeWeather(type, theme, group, rng) {
  if (!type) return null;
  const count = type === 'snow' ? 900 : type === 'embers' ? 320 : 420;
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count);
  const span = 120;
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rng() - 0.5) * span;
    pos[i * 3 + 1] = rng() * 26;
    pos[i * 3 + 2] = (rng() - 0.5) * span;
    vel[i] = 0.6 + rng() * 0.9;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const color = type === 'snow' ? 0xffffff : type === 'embers' ? 0xff7a33 : 0xd7c2a0;
  const size = type === 'snow' ? 0.16 : type === 'embers' ? 0.14 : 0.1;
  const mat = new THREE.PointsMaterial({
    color, size, transparent: true, opacity: type === 'snow' ? 0.85 : 0.55,
    depthWrite: false, blending: type === 'embers' ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  group.add(points);
  return {
    points, vel,
    update(dt, time) {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        if (type === 'embers') {
          arr[i * 3 + 1] += vel[i] * dt * 1.6;
          arr[i * 3] += Math.sin(time * 0.7 + i) * dt * 0.5;
          if (arr[i * 3 + 1] > 26) arr[i * 3 + 1] = 0;
        } else {
          arr[i * 3 + 1] -= vel[i] * dt * (type === 'snow' ? 1.5 : 0.5);
          arr[i * 3] += Math.sin(time * 0.5 + i * 0.7) * dt * 0.5;
          if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 26;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  };
}

/* ----------------------------- builder ---------------------------- */

export function buildWorld(scene, level) {
  const theme = level.theme;
  const rng = mulberry32(level.seed);
  const group = new THREE.Group();
  const colliders = [];
  const occluders = [];
  const size = level.size;
  const half = size / 2;

  /* sky, sun, lights */
  group.add(makeSky(theme));
  group.add(makeSun(theme, rng));

  const hemi = new THREE.HemisphereLight(theme.hemiSky, theme.hemiGround, theme.hemiIntensity);
  group.add(hemi);

  const ambient = new THREE.AmbientLight(theme.fog, theme.night ? 0.35 : 0.28);
  group.add(ambient);

  const sun = new THREE.DirectionalLight(theme.sun, theme.sunIntensity);
  sun.position.set(...theme.sunPos).setLength(72);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -58;
  sun.shadow.camera.right = 58;
  sun.shadow.camera.top = 58;
  sun.shadow.camera.bottom = -58;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 180;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.035;
  sun.target.position.set(0, 0, 0);
  group.add(sun, sun.target);

  const fill = new THREE.DirectionalLight(theme.hemiSky, theme.night ? 0.35 : 0.5);
  fill.position.set(-theme.sunPos[0], 26, -theme.sunPos[2]);
  group.add(fill);

  /* ground */
  const groundTex = makeGroundTexture(theme.ground, theme.groundKind, mulberry32(level.seed + 9));
  groundTex.repeat.set(26, 26);
  const groundMat = new THREE.MeshStandardMaterial({ map: groundTex, color: 0xffffff, roughness: 0.97, metalness: 0.02 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);
  occluders.push(ground);

  /* arena walls */
  const wallMat = new THREE.MeshStandardMaterial({ color: theme.wall, roughness: 0.92, metalness: 0.05 });
  const wallTopMat = new THREE.MeshStandardMaterial({ color: shade(theme.wall, -0.12), roughness: 0.9 });
  const wallH = 3.6;
  const wallSpecs = [
    [0, -half, size + 2, 1.2], [0, half, size + 2, 1.2],
    [-half, 0, 1.2, size + 2], [half, 0, 1.2, size + 2]
  ];
  for (const [x, z, w, d] of wallSpecs) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d), wallMat);
    wall.position.set(x, wallH / 2, z);
    wall.castShadow = wall.receiveShadow = true;
    group.add(wall);
    occluders.push(wall);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.15, 0.22, d + 0.15), wallTopMat);
    trim.position.set(x, wallH + 0.1, z);
    group.add(trim);
    colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, mesh: wall });
  }

  /* corner towers / posts */
  const postMat = new THREE.MeshStandardMaterial({ color: shade(theme.wall, -0.16), roughness: 0.9 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.4, 1.8), postMat);
    post.position.set(sx * (half - 0.6), 2.7, sz * (half - 0.6));
    post.castShadow = true;
    group.add(post);
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, emissive: theme.accent, emissiveIntensity: 2, roughness: 0.4 });
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.4), lampMat);
    lamp.position.set(sx * (half - 0.6), 5.5, sz * (half - 0.6));
    group.add(lamp);
  }

  /* center helipad marking */
  const padTex = makeGlowTexture('rgba(255,255,255,0.55)', 'rgba(255,255,255,0)');
  const pad = new THREE.Mesh(new THREE.CircleGeometry(4.4, 40), new THREE.MeshBasicMaterial({ map: padTex, transparent: true, opacity: 0.4, depthWrite: false }));
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = 0.02;
  group.add(pad);
  const ring = new THREE.Mesh(new THREE.RingGeometry(4.35, 4.5, 48), new THREE.MeshBasicMaterial({ color: theme.accent, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.025;
  group.add(ring);

  /* scattered obstacles */
  const footprints = [];
  const placeProp = (type, x, z, rot, extra) => {
    switch (type) {
      case 'crate': propCrate(group, colliders, occluders, x, z, rot, theme, rng, 0.85 + rng() * 0.45); break;
      case 'container': propContainer(group, colliders, occluders, x, z, rot, theme, rng); break;
      case 'barrier': propBarrier(group, colliders, occluders, x, z, rot, theme, rng); break;
      case 'rocks': propRocks(group, colliders, occluders, x, z, rot, theme, rng); break;
      case 'tree': propTree(group, colliders, occluders, x, z, rot, theme, rng); break;
      case 'pillar': propPillar(group, colliders, occluders, x, z, rot, theme, rng); break;
      case 'barrel': propBarrel(group, colliders, occluders, x, z, theme, rng); break;
      case 'building': propBuilding(group, colliders, occluders, x, z, rot, theme, rng); break;
    }
  };

  const biomePools = {
    DESIERTO: ['crate', 'crate', 'barrier', 'rocks', 'container', 'barrel'],
    BOSQUE: ['tree', 'tree', 'crate', 'rocks', 'barrier', 'container', 'tree'],
    NOCHE: ['container', 'container', 'crate', 'barrier', 'barrel', 'building'],
    NIEVE: ['rocks', 'rocks', 'crate', 'container', 'barrier', 'pillar'],
    CIUDAD: ['building', 'barrier', 'crate', 'container', 'barrel', 'building'],
    RUINAS: ['pillar', 'pillar', 'rocks', 'barrier', 'crate', 'container'],
    FINAL: ['container', 'barrel', 'barrel', 'crate', 'pillar', 'barrier']
  };

  const pool = biomePools[level.biome] || biomePools.DESIERTO;
  const propCount = 26 + level.n * 2;
  let attempts = 0;
  while (footprints.length < propCount && attempts++ < 600) {
    const angle = rng() * Math.PI * 2;
    const radius = 7 + rng() * (half - 13);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (Math.hypot(x, z) < 6.5) continue;
    let ok = true;
    for (const f of footprints) {
      if (Math.hypot(f.x - x, f.z - z) < f.r + 3.2) { ok = false; break; }
    }
    if (!ok) continue;
    if (x > half - 5 || x < -half + 5 || z > half - 5 || z < -half + 5) continue;
    const type = pool[Math.floor(rng() * pool.length)];
    placeProp(type, x, z, rng() * Math.PI * 2);
    const big = type === 'building' || type === 'container' ? 3.4 : type === 'tree' || type === 'pillar' ? 2 : 1.9;
    footprints.push({ x, z, r: big });
  }

  /* extra barrels around center for chain fun */
  for (let i = 0; i < 4; i++) {
    const a = rng() * Math.PI * 2;
    const r = 12 + rng() * (half - 18);
    placeProp('barrel', Math.cos(a) * r, Math.sin(a) * r, 0);
  }

  /* night / core lamps */
  if (theme.night) {
    const lampPositions = [[-half + 8, -half + 8], [half - 8, -half + 8], [-half + 8, half - 8], [half - 8, half - 8]];
    for (const [x, z] of lampPositions) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 6, 6), new THREE.MeshStandardMaterial({ color: 0x1c2226, roughness: 0.6, metalness: 0.5 }));
      pole.position.set(x, 3, z);
      group.add(pole);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffe6b0, emissive: 0xffb04a, emissiveIntensity: 3 }));
      head.position.set(x, 6.1, z);
      group.add(head);
      const light = new THREE.PointLight(0xffb35e, theme.night ? 26 : 16, 26, 2);
      light.position.set(x, 6, z);
      group.add(light);
    }
  }

  /* core lava strips */
  if (level.biome === 'FINAL') {
    const lavaMat = new THREE.MeshBasicMaterial({ color: 0xff4d0f, transparent: true, opacity: 0.8 });
    for (let i = 0; i < 5; i++) {
      const w = 2 + rng() * 3, l = 10 + rng() * 20;
      const strip = new THREE.Mesh(new THREE.PlaneGeometry(w, l), lavaMat);
      strip.rotation.x = -Math.PI / 2;
      strip.rotation.z = rng() * Math.PI;
      strip.position.set((rng() - 0.5) * size * 0.7, 0.03, (rng() - 0.5) * size * 0.7);
      group.add(strip);
    }
    const glow = new THREE.PointLight(0xff5a1a, 40, 60, 2);
    glow.position.set(0, 3, 0);
    group.add(glow);
  }

  /* distant scenery */
  makeSilhouettes(theme.silhouette, theme, group, rng);

  /* weather */
  const weather = makeWeather(theme.particles, theme, group, rng);

  /* spawn points around the perimeter */
  const spawnPoints = [];
  const spawnCount = 18;
  for (let i = 0; i < spawnCount; i++) {
    const a = (i / spawnCount) * Math.PI * 2 + 0.19;
    const r = half - 6.5 - rng() * 3;
    let x = Math.cos(a) * r, z = Math.sin(a) * r;
    let clear = true;
    for (const c of colliders) {
      if (x > c.minX - 1.2 && x < c.maxX + 1.2 && z > c.minZ - 1.2 && z < c.maxZ + 1.2) { clear = false; break; }
    }
    if (!clear) continue;
    spawnPoints.push(new THREE.Vector3(x, 0, z));
  }
  while (spawnPoints.length < 8) {
    const a = rng() * Math.PI * 2;
    spawnPoints.push(new THREE.Vector3(Math.cos(a) * (half - 8), 0, Math.sin(a) * (half - 8)));
  }

  /* ground markings */
  const markMat = new THREE.MeshBasicMaterial({ color: theme.accent, transparent: true, opacity: 0.22, depthWrite: false });
  for (let i = 0; i < 4; i++) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.3, size * 0.5), markMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(-half + 9 + i * (size - 18) / 3, 0.015, 0);
    group.add(line);
  }

  scene.add(group);

  return {
    group, colliders, occluders, spawnPoints, bounds: half - 1.7, half, size,
    theme,
    update(dt, time) { if (weather) weather.update(dt, time); },
    dispose() {
      scene.remove(group);
      group.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          for (const m of mats) {
            if (m.map) m.map.dispose();
            m.dispose();
          }
        }
      });
      groundTex.dispose();
    }
  };
}
