import * as THREE from '../vendor/three.module.js';

export const ENEMY_TYPES = {
  soldier: {
    label: 'SOLDADO', hp: 70, speed: 2.9, damage: 8, accuracy: 0.7, fireInterval: 1.7,
    range: 44, preferred: 15, scale: 1, score: 100,
    uniform: 0x6b684c, vest: 0x33362c, helmet: 0x4f4c39, visor: 0x9fffc8, visorGlow: 0.35
  },
  scout: {
    label: 'EXPLORADOR', hp: 48, speed: 4.5, damage: 6, accuracy: 0.5, fireInterval: 1.15,
    range: 32, preferred: 8, scale: 0.92, score: 130,
    uniform: 0x3d4b43, vest: 0x232b27, helmet: 0x2f3a34, visor: 0xffb347, visorGlow: 0.55
  },
  heavy: {
    label: 'PESADO', hp: 195, speed: 1.9, damage: 13, accuracy: 0.68, fireInterval: 2.15,
    range: 38, preferred: 13, scale: 1.17, score: 260,
    uniform: 0x545746, vest: 0x2a2c24, helmet: 0x3f4235, visor: 0xff7a4a, visorGlow: 0.5
  },
  sniper: {
    label: 'FRANCOTIRADOR', hp: 58, speed: 2.3, damage: 25, accuracy: 0.82, fireInterval: 3.1,
    range: 72, preferred: 30, scale: 1.01, score: 210,
    uniform: 0x555b4e, vest: 0x30352c, helmet: 0x3b4036, visor: 0x8fd8ff, visorGlow: 0.6
  },
  elite: {
    label: 'ÉLITE', hp: 150, speed: 3.3, damage: 11, accuracy: 0.86, fireInterval: 1.05,
    range: 48, preferred: 11, scale: 1.08, score: 320,
    uniform: 0x38312f, vest: 0x1f1a1a, helmet: 0x2a2322, visor: 0xff3b2f, visorGlow: 1.1
  },
  boss: {
    label: 'COMANDANTE', hp: 950, speed: 2.25, damage: 19, accuracy: 0.8, fireInterval: 1.0,
    range: 55, preferred: 13, scale: 1.5, score: 1600,
    uniform: 0x2b1c1d, vest: 0x191011, helmet: 0x241616, visor: 0xff2a14, visorGlow: 1.6
  }
};

function makeMat(color, rough = 0.82, metal = 0.08, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
}

export class Enemy {
  constructor(scene, type, pos, level, rng) {
    this.scene = scene;
    this.type = type;
    this.def = ENEMY_TYPES[type] || ENEMY_TYPES.soldier;
    this.level = level;
    this.rng = rng;
    this.scale = this.def.scale;
    this.radius = 0.46 * this.scale;
    this.height = 1.82 * this.scale;

    const lvlScale = 1 + (level - 1) * 0.16;
    this.maxHp = Math.round(this.def.hp * lvlScale * (type === 'boss' ? 1 : 1));
    this.hp = this.maxHp;
    this.damageScale = 1 + (level - 1) * 0.09;
    this.speed = this.def.speed * (1 + (level - 1) * 0.015);
    this.dead = false;
    this.deathT = 0;
    this.gone = false;
    this.fireTimer = 1.1 + rng() * 1.6;
    this.losTimer = rng() * 0.2;
    this.hasLos = false;
    this.strafeDir = rng() > 0.5 ? 1 : -1;
    this.strafeTimer = 1.5 + rng() * 2;
    this.phase = rng() * 6.28;
    this.flashTimer = 0;
    this.blocked = 0;
    this.moving = 0;
    this.muzzleTimer = 0;
    this.hitMeshes = [];
    this.flashMats = [];
    this.lights = [];

    this.group = new THREE.Group();
    this.group.position.copy(pos);
    this.group.rotation.y = rng() * Math.PI * 2;
    this.build();
    this.group.scale.setScalar(this.scale);
    scene.add(this.group);
  }

  build() {
    const d = this.def;
    const g = this.group;
    const uniform = makeMat(d.uniform, 0.9, 0.03);
    const vest = makeMat(d.vest, 0.85, 0.08);
    const helmetMat = makeMat(d.helmet, 0.65, 0.25);
    const dark = makeMat(0x1a1c1b, 0.7, 0.2);
    const skin = makeMat(0x9c7659, 0.9, 0);
    const boot = makeMat(0x1f1e1c, 0.85, 0.1);
    const visorMat = new THREE.MeshStandardMaterial({ color: d.visor, emissive: d.visor, emissiveIntensity: d.visorGlow, roughness: 0.35, metalness: 0.4 });
    this.flashMats.push(uniform, vest, helmetMat);
    this.mats = [uniform, vest, helmetMat, dark, skin, boot, visorMat];

    const shadowOn = (m) => { m.castShadow = true; m.receiveShadow = false; return m; };

    // legs
    const legGeo = new THREE.BoxGeometry(0.19, 0.8, 0.21);
    this.legL = new THREE.Group(); this.legL.position.set(-0.15, 0.92, 0);
    const legLMesh = new THREE.Mesh(legGeo, uniform); legLMesh.position.y = -0.4;
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.3), boot); bootL.position.set(0, -0.78, -0.05);
    legLMesh.userData = { enemy: this, part: 'body' };
    bootL.userData = { enemy: this, part: 'body' };
    this.legL.add(shadowOn(legLMesh), shadowOn(bootL));
    this.hitMeshes.push(legLMesh);

    this.legR = new THREE.Group(); this.legR.position.set(0.15, 0.92, 0);
    const legRMesh = new THREE.Mesh(legGeo, uniform); legRMesh.position.y = -0.4;
    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.3), boot); bootR.position.set(0, -0.78, -0.05);
    legRMesh.userData = { enemy: this, part: 'body' };
    bootR.userData = { enemy: this, part: 'body' };
    this.legR.add(shadowOn(legRMesh), shadowOn(bootR));
    this.hitMeshes.push(legRMesh);

    // torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.64, 0.32), uniform);
    torso.position.y = 1.28;
    torso.userData = { enemy: this, part: 'body' };
    shadowOn(torso);
    g.add(torso);
    this.hitMeshes.push(torso);

    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.46, 0.38), vest);
    plate.position.set(0, 1.3, 0);
    plate.userData = { enemy: this, part: 'body' };
    shadowOn(plate);
    g.add(plate);
    this.hitMeshes.push(plate);

    // belt / pouches
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.11, 0.34), dark);
    belt.position.y = 0.96;
    g.add(belt);
    for (let i = -1; i <= 1; i++) {
      const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.1), vest);
      pouch.position.set(i * 0.16, 0.94, 0.2);
      g.add(pouch);
    }

    // shoulders
    const shoulderGeo = new THREE.BoxGeometry(0.2, 0.18, 0.26);
    const padL = new THREE.Mesh(shoulderGeo, vest); padL.position.set(-0.34, 1.53, 0);
    const padR = new THREE.Mesh(shoulderGeo, vest); padR.position.set(0.34, 1.53, 0);
    shadowOn(padL); shadowOn(padR);
    g.add(padL, padR);

    // arms (pivot at shoulder, rotate forward)
    const armGeo = new THREE.BoxGeometry(0.15, 0.52, 0.16);
    this.armL = new THREE.Group(); this.armL.position.set(-0.36, 1.48, 0);
    const armLMesh = new THREE.Mesh(armGeo, uniform); armLMesh.position.y = -0.24;
    armLMesh.userData = { enemy: this, part: 'body' };
    this.armL.add(shadowOn(armLMesh));
    this.armL.rotation.x = -0.95;
    this.armL.rotation.z = 0.16;
    g.add(this.armL);
    this.hitMeshes.push(armLMesh);

    this.armR = new THREE.Group(); this.armR.position.set(0.36, 1.48, 0);
    const armRMesh = new THREE.Mesh(armGeo, uniform); armRMesh.position.y = -0.24;
    armRMesh.userData = { enemy: this, part: 'body' };
    this.armR.add(shadowOn(armRMesh));
    this.armR.rotation.x = -1.05;
    this.armR.rotation.z = -0.12;
    g.add(this.armR);
    this.hitMeshes.push(armRMesh);

    // head + helmet
    this.head = new THREE.Group();
    this.head.position.y = 1.7;
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.1, 8), skin);
    neck.position.y = -0.07;
    this.head.add(neck);
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.26), skin);
    headMesh.userData = { enemy: this, part: 'head' };
    this.head.add(shadowOn(headMesh));
    this.hitMeshes.push(headMesh);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62), helmetMat);
    helmet.position.y = 0.07;
    helmet.userData = { enemy: this, part: 'head' };
    this.head.add(shadowOn(helmet));
    this.hitMeshes.push(helmet);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.055, 0.04), visorMat);
    visor.position.set(0, 0.005, 0.145);
    this.head.add(visor);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.12), vest);
    back.position.set(0, 1.28, 0.24);
    shadowOn(back);
    g.add(back);

    // rifle
    const gun = new THREE.Group();
    gun.position.set(0.16, 1.3, -0.24);
    gun.rotation.y = 0.06;
    const bodyGun = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.5), dark);
    gun.add(bodyGun);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.36, 8), dark);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.01, -0.38);
    gun.add(barrel);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.19, 0.09), vest);
    mag.position.set(0, -0.13, 0.03);
    mag.rotation.x = 0.28;
    gun.add(mag);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.22), vest);
    stock.position.set(0, -0.02, 0.3);
    gun.add(stock);
    const muzzleTip = new THREE.Object3D();
    muzzleTip.position.set(0, 0.02, -0.58);
    gun.add(muzzleTip);
    this.muzzle = muzzleTip;
    gun.traverse(o => { if (o.isMesh) o.castShadow = true; });
    this.gun = gun;
    g.add(gun);

    const flashMat = new THREE.SpriteMaterial({ color: 0xffc477, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    this.flash = new THREE.Sprite(flashMat);
    this.flash.scale.setScalar(0.5);
    this.flash.position.copy(muzzleTip.position);
    this.flash.visible = false;
    gun.add(this.flash);

    if (this.type === 'boss') {
      const aura = new THREE.PointLight(0xff3a18, 6, 7, 2);
      aura.position.set(0, 1.3, 0);
      g.add(aura);
      this.lights.push(aura);
      const spikeMat = makeMat(0x8f2114, 0.5, 0.4, { emissive: 0x5a0d05, emissiveIntensity: 1 });
      for (const sx of [-1, 1]) {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.28, 6), spikeMat);
        horn.position.set(sx * 0.2, 0.15, 0.02);
        horn.rotation.z = sx * 0.7;
        this.head.add(horn);
      }
    } else if (this.type === 'heavy') {
      const plate2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.4), helmetMat);
      plate2.position.set(0, 1.52, 0);
      g.add(plate2);
    }
  }

  get chest() {
    return new THREE.Vector3(this.group.position.x, this.group.position.y + 1.3 * this.scale, this.group.position.z);
  }

  muzzleWorld(out) {
    return this.muzzle.getWorldPosition(out);
  }

  hurt(amount, part) {
    if (this.dead) return { killed: false, damage: 0 };
    const headMul = part === 'head' ? 2.1 : 1;
    const dmg = amount * headMul;
    this.hp -= dmg;
    this.flashTimer = 0.09;
    for (const m of this.flashMats) {
      m.emissive.setHex(0xff3b1f);
      m.emissiveIntensity = 1.4;
    }
    if (this.hp <= 0) {
      this.die();
      return { killed: true, damage: dmg, headshot: part === 'head', overkill: -this.hp };
    }
    return { killed: false, damage: dmg, headshot: part === 'head' };
  }

  die() {
    this.dead = true;
    this.deathT = 0;
    this.flash.visible = false;
    for (const m of this.flashMats) { m.emissiveIntensity = 0; }
    for (const m of this.hitMeshes) m.userData.part = null;
    this.fallSign = this.rng() > 0.5 ? 1 : -1;
  }

  update(dt, ctx) {
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        for (const m of this.flashMats) { m.emissiveIntensity = 0; m.emissive.setHex(0x000000); }
      }
    }

    if (this.muzzleTimer > 0) {
      this.muzzleTimer -= dt;
      if (this.muzzleTimer <= 0) this.flash.visible = false;
    }

    if (this.dead) {
      this.deathT += dt;
      const t = Math.min(1, this.deathT / 0.55);
      this.group.rotation.x = -1.5 * t * this.fallSign;
      this.group.rotation.z = 0.25 * t * this.fallSign;
      if (this.deathT > 3.2) {
        this.group.position.y -= dt * 0.55;
        if (this.deathT > 5.2) this.gone = true;
      }
      return;
    }

    const px = ctx.playerPos.x, pz = ctx.playerPos.z;
    const dx = px - this.group.position.x;
    const dz = pz - this.group.position.z;
    const dist = Math.hypot(dx, dz) || 0.001;
    const nx = dx / dist, nz = dz / dist;

    // face the player, with smoothing
    const targetRot = Math.atan2(-nx, -nz);
    let diff = targetRot - this.group.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.group.rotation.y += diff * Math.min(1, dt * 7);

    // line of sight (throttled)
    this.losTimer -= dt;
    if (this.losTimer <= 0) {
      this.losTimer = 0.16 + this.rng() * 0.1;
      const from = new THREE.Vector3(this.group.position.x, this.group.position.y + 1.45 * this.scale, this.group.position.z);
      this.hasLos = dist < 80 ? ctx.checkLOS(from, ctx.playerEye) : false;
    }

    // movement intent
    const def = this.def;
    let mx = 0, mz = 0;
    if (!this.hasLos) {
      mx = nx; mz = nz;
    } else if (dist > def.preferred * 1.25) {
      mx = nx; mz = nz;
    } else if (dist < def.preferred * 0.62) {
      mx = -nx; mz = -nz;
    } else {
      mx = -nz * this.strafeDir;
      mz = nx * this.strafeDir;
    }

    this.strafeTimer -= dt;
    if (this.strafeTimer <= 0) {
      this.strafeDir *= -1;
      this.strafeTimer = 1.2 + this.rng() * 2.4;
    }

    if (this.blocked > 0.35 && this.hasLos) {
      // slide along the obstacle instead of pushing into it
      mx += -nz * this.strafeDir * 1.2;
      mz += nx * this.strafeDir * 1.2;
    }

    const len = Math.hypot(mx, mz);
    if (len > 0.001) {
      mx /= len; mz /= len;
      const spd = this.speed * (this.hasLos ? 1 : 0.82);
      const beforeX = this.group.position.x, beforeZ = this.group.position.z;
      const res = ctx.moveEnemy(beforeX + mx * spd * dt, beforeZ + mz * spd * dt, this, this.radius);
      this.group.position.x = res.x;
      this.group.position.z = res.z;
      const moved = Math.hypot(res.x - beforeX, res.z - beforeZ);
      this.moving = moved / Math.max(0.0001, spd * dt);
      if (this.moving < 0.45) this.blocked += dt; else this.blocked = Math.max(0, this.blocked - dt);
    } else {
      this.moving *= Math.max(0, 1 - dt * 6);
    }

    // stay inside bounds
    const b = ctx.bounds;
    this.group.position.x = Math.max(-b, Math.min(b, this.group.position.x));
    this.group.position.z = Math.max(-b, Math.min(b, this.group.position.z));

    // walk animation
    this.phase += dt * (2.6 + this.moving * 5.5);
    const swing = Math.sin(this.phase) * 0.62 * Math.min(1, this.moving + 0.15);
    this.legL.rotation.x = swing;
    this.legR.rotation.x = -swing;
    this.armL.rotation.x = -0.95 + swing * 0.12;
    this.armR.rotation.x = -1.05 - swing * 0.06;
    this.group.position.y = Math.abs(Math.sin(this.phase)) * 0.035 * this.moving;

    // shooting
    this.fireTimer -= dt;
    if (this.hasLos && dist < def.range && this.fireTimer <= 0) {
      this.fireTimer = def.fireInterval * (0.78 + this.rng() * 0.5);
      this.shoot(ctx, dist);
    }
  }

  shoot(ctx, dist) {
    const from = this.muzzleWorld(new THREE.Vector3());
    const aim = ctx.playerEye.clone();
    // hit chance decays with distance; moving targets are harder
    let chance = this.def.accuracy * (1 - dist / (this.def.range * 2.1));
    if (ctx.playerMoving) chance *= 0.82;
    chance = Math.max(0.1, Math.min(0.9, chance));
    const willHit = Math.random() < chance;

    const fallback = aim.clone().add(new THREE.Vector3(
      (this.rng() - 0.5) * 2.6, (this.rng() - 0.5) * 1.4, (this.rng() - 0.5) * 2.6
    ));
    const to = willHit ? aim : fallback;
    ctx.fx.tracer(from, to, this.type === 'sniper' || this.type === 'boss' ? 0xff5533 : 0xffc07a, 0.09);
    ctx.fx.impact(to, new THREE.Vector3(0, 1, 0), 0x4a4a42, 3);

    this.flash.visible = true;
    this.flash.material.opacity = 0.95;
    this.flash.scale.setScalar(0.35 + this.rng() * 0.3);
    this.muzzleTimer = 0.055;
    ctx.sfx.enemyShoot(this.type);
    if (willHit) ctx.damagePlayer(this.def.damage * this.damageScale, this);
  }

  dispose() {
    this.group.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) m.dispose();
      }
    });
    this.scene.remove(this.group);
  }
}
