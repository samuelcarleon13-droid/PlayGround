import * as THREE from '../vendor/three.module.js';

/* Armas: 4 plataformas, cada una con 7 niveles de dominio (ver main.js) */
export const WEAPONS = [
  {
    id: 'pistol', slot: 1, name: 'M9 VETERANO', short: 'M9', kind: 'PISTOLA',
    desc: 'Fiable y precisa. Munición abundante.',
    damage: 34, rpm: 330, auto: false, mag: 12, reserve: 120, spread: 0.013,
    pellets: 1, range: 85, reloadTime: 1.15, headshot: 2.2,
    recoilPitch: 0.016, recoilKick: 0.075, shake: 0.35, zoomFov: 58,
    stats: { daño: 2, cadencia: 3, alcance: 3, control: 5 }
  },
  {
    id: 'rifle', slot: 2, name: 'AK-12 FUSIL', short: 'AK-12', kind: 'FUSIL DE ASALTO',
    desc: 'Automático, versátil, domina el medio alcance.',
    damage: 23, rpm: 660, auto: true, mag: 30, reserve: 210, spread: 0.021,
    pellets: 1, range: 110, reloadTime: 2.05, headshot: 2.0,
    recoilPitch: 0.008, recoilKick: 0.045, shake: 0.22, zoomFov: 52,
    stats: { daño: 3, cadencia: 5, alcance: 4, control: 3 }
  },
  {
    id: 'shotgun', slot: 3, name: 'M870 ESCOPETA', short: 'M870', kind: 'ESCOPETA',
    desc: 'Devastadora de cerca. Nueve postas por disparo.',
    damage: 13, rpm: 82, auto: false, mag: 7, reserve: 49, spread: 0.085,
    pellets: 9, range: 32, reloadTime: 2.6, headshot: 1.7,
    recoilPitch: 0.042, recoilKick: 0.16, shake: 0.85, zoomFov: 60,
    stats: { daño: 5, cadencia: 2, alcance: 2, control: 2 }
  },
  {
    id: 'sniper', slot: 4, name: 'M24 HALCÓN', short: 'M24', kind: 'FRANCOTIRADOR',
    desc: 'Un disparo, una baja. Mira 8× con clic derecho.',
    damage: 165, rpm: 48, auto: false, mag: 5, reserve: 30, spread: 0.0015,
    pellets: 1, range: 220, reloadTime: 2.85, headshot: 2.5,
    recoilPitch: 0.06, recoilKick: 0.2, shake: 1.1, zoomFov: 22, scope: true,
    stats: { daño: 5, cadencia: 1, alcance: 5, control: 4 }
  }
];

/* ---------- utilidades de modelado ---------- */

const cache = new Map();
function std(color, rough = 0.65, metal = 0.35, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
}

function box(parent, mat, w, h, d, x, y, z, rotX = 0, rotY = 0, rotZ = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.set(rotX, rotY, rotZ);
  m.castShadow = false;
  parent.add(m);
  return m;
}

function cyl(parent, mat, rTop, rBot, h, x, y, z, rotX = Math.PI / 2, segments = 12) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segments), mat);
  m.position.set(x, y, z);
  m.rotation.x = rotX;
  m.castShadow = false;
  parent.add(m);
  return m;
}

function flashTexture() {
  if (cache.has('flash')) return cache.get('flash');
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,235,1)');
  grad.addColorStop(0.18, 'rgba(255,224,150,0.95)');
  grad.addColorStop(0.45, 'rgba(255,140,40,0.55)');
  grad.addColorStop(1, 'rgba(255,90,10,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  cache.set('flash', t);
  return t;
}

/* ---------- modelos ---------- */

export function buildWeaponModel(id) {
  const root = new THREE.Group();
  const muzzle = new THREE.Object3D();
  const mats = [];

  const M = (color, rough, metal, extra) => { const m = std(color, rough, metal, extra); mats.push(m); return m; };

  const gunmetal = M(0x2b3033, 0.5, 0.75);
  const dark = M(0x171b1d, 0.55, 0.5);
  const polymer = M(0x232628, 0.8, 0.1);
  const tan = M(0x8a7a5e, 0.75, 0.1);
  const olive = M(0x4c5238, 0.8, 0.1);
  const wood = M(0x6f4526, 0.8, 0.05);
  const steel = M(0x5b6265, 0.35, 0.9);
  const glove = M(0x2f2d29, 0.95, 0);
  const accentMat = M(0xff7a2a, 0.5, 0.2, { emissive: 0x7a2400, emissiveIntensity: 0.7 });

  let muzzleZ = -0.5;
  let holdPos = new THREE.Vector3(0.31, -0.29, -0.55);

  if (id === 'pistol') {
    box(root, gunmetal, 0.072, 0.082, 0.33, 0, 0.03, -0.12);
    box(root, dark, 0.066, 0.046, 0.28, 0, -0.032, -0.1);
    box(root, tan, 0.062, 0.19, 0.095, 0, -0.135, 0.035, -0.22);
    box(root, dark, 0.03, 0.05, 0.06, 0, -0.075, -0.19);
    box(root, accentMat, 0.012, 0.03, 0.022, 0, 0.083, -0.255);
    box(root, dark, 0.055, 0.02, 0.06, 0, 0.082, 0.015);
    cyl(root, steel, 0.021, 0.021, 0.055, 0, 0.03, -0.31, Math.PI / 2, 10);
    // hands
    box(root, glove, 0.082, 0.13, 0.15, 0.0, -0.15, 0.055, -0.2);
    box(root, glove, 0.07, 0.11, 0.14, -0.035, -0.16, -0.015, -0.3);
    box(root, glove, 0.055, 0.075, 0.16, -0.012, -0.075, -0.11, 0.15);
    muzzleZ = -0.345;
    holdPos.set(0.3, -0.28, -0.5);
  } else if (id === 'rifle') {
    box(root, olive, 0.088, 0.11, 0.38, 0, 0.0, -0.14);
    box(root, dark, 0.075, 0.08, 0.34, 0, 0.005, -0.45);
    box(root, olive, 0.08, 0.075, 0.2, 0, 0.015, -0.38);
    box(root, olive, 0.09, 0.075, 0.26, 0, -0.01, 0.17);
    box(root, dark, 0.06, 0.1, 0.2, 0, -0.02, 0.33, -0.08);
    box(root, tan, 0.065, 0.18, 0.1, 0, -0.14, 0.02, -0.28);
    box(root, tan, 0.07, 0.19, 0.11, 0, -0.15, -0.14, 0.32);
    box(root, dark, 0.02, 0.085, 0.3, 0, 0.08, -0.24);
    box(root, dark, 0.035, 0.05, 0.04, 0, 0.075, 0.0);
    cyl(root, steel, 0.019, 0.019, 0.45, 0, 0.005, -0.66, Math.PI / 2, 10);
    box(root, dark, 0.05, 0.05, 0.03, 0, 0.005, -0.88);
    box(root, accentMat, 0.012, 0.012, 0.12, 0, 0.088, -0.55);
    box(root, glove, 0.085, 0.13, 0.16, 0.0, -0.16, 0.045, -0.25);
    box(root, glove, 0.08, 0.11, 0.2, -0.02, -0.05, -0.42, 0.05);
    muzzleZ = -0.9;
    holdPos.set(0.32, -0.29, -0.6);
  } else if (id === 'shotgun') {
    box(root, dark, 0.09, 0.105, 0.36, 0, 0.0, -0.12);
    cyl(root, gunmetal, 0.032, 0.032, 0.72, 0, 0.035, -0.55, Math.PI / 2, 12);
    box(root, dark, 0.055, 0.05, 0.4, 0, -0.035, -0.4);
    box(root, wood, 0.08, 0.08, 0.22, 0, -0.045, -0.35);
    box(root, wood, 0.075, 0.1, 0.24, 0, -0.045, 0.18, -0.12);
    box(root, wood, 0.078, 0.14, 0.3, 0, -0.09, 0.4, -0.16);
    box(root, dark, 0.072, 0.16, 0.1, 0, -0.13, 0.06, -0.25);
    box(root, accentMat, 0.012, 0.014, 0.03, 0, 0.06, -0.87);
    box(root, glove, 0.085, 0.13, 0.17, 0, -0.17, 0.07, -0.25);
    box(root, glove, 0.085, 0.1, 0.2, -0.015, -0.12, -0.34, 0.12);
    muzzleZ = -0.93;
    holdPos.set(0.33, -0.3, -0.6);
  } else {
    box(root, olive, 0.09, 0.11, 0.42, 0, 0, -0.14);
    box(root, dark, 0.085, 0.075, 0.3, 0, -0.005, 0.15);
    box(root, olive, 0.075, 0.13, 0.3, 0, -0.03, 0.36, -0.1);
    box(root, tan, 0.068, 0.17, 0.1, 0, -0.14, 0.02, -0.26);
    box(root, dark, 0.06, 0.16, 0.1, 0, -0.14, -0.14, 0.2);
    cyl(root, steel, 0.018, 0.018, 0.85, 0, 0.01, -0.7, Math.PI / 2, 10);
    box(root, dark, 0.05, 0.045, 0.04, 0, 0.01, -1.12);
    // scope
    cyl(root, dark, 0.045, 0.045, 0.3, 0, 0.115, -0.12, Math.PI / 2, 14);
    cyl(root, steel, 0.055, 0.055, 0.06, 0, 0.115, -0.28, Math.PI / 2, 14);
    cyl(root, steel, 0.05, 0.05, 0.05, 0, 0.115, 0.035, Math.PI / 2, 14);
    box(root, dark, 0.02, 0.06, 0.12, 0, 0.065, -0.1);
    box(root, accentMat, 0.012, 0.012, 0.1, 0, 0.16, -0.12);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), new THREE.MeshStandardMaterial({ color: 0x1b4a66, emissive: 0x1d6f9c, emissiveIntensity: 1.4, roughness: 0.2, metalness: 0.8 }));
    lens.position.set(0, 0.115, -0.283);
    root.add(lens);
    mats.push(lens.material);
    box(root, glove, 0.085, 0.13, 0.16, 0, -0.17, 0.06, -0.25);
    box(root, glove, 0.08, 0.1, 0.19, -0.02, -0.06, -0.35, 0.06);
    muzzleZ = -1.14;
    holdPos.set(0.3, -0.3, -0.62);
  }

  root.position.copy(holdPos);
  root.rotation.y = 0.035;

  muzzle.position.set(0, 0.01, muzzleZ);
  root.add(muzzle);

  const flashMat = new THREE.SpriteMaterial({ map: flashTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, opacity: 0 });
  const flash = new THREE.Sprite(flashMat);
  flash.position.copy(muzzle.position);
  flash.scale.setScalar(id === 'shotgun' ? 0.5 : id === 'pistol' ? 0.28 : 0.38);
  flash.visible = false;
  root.add(flash);

  const light = new THREE.PointLight(0xffb060, 0, 7, 2);
  light.position.copy(muzzle.position);
  root.add(light);

  return {
    group: root, muzzle, flash, light, mats, muzzleZ,
    basePos: holdPos.clone(),
    id
  };
}
