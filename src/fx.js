import * as THREE from '../vendor/three.module.js';

/* Partículas, trazadoras, explosiones y casquillos. */
export class FX {
  constructor(scene) {
    this.scene = scene;
    this.tracers = [];
    this.blasts = [];
    this.casings = [];
    this.lights = [];
    this._v = new THREE.Vector3();

    /* pooled sparks */
    this.cap = 700;
    const pos = new Float32Array(this.cap * 3);
    const col = new Float32Array(this.cap * 3);
    pos.fill(-9999);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.pGeo = geo;
    this.pVel = new Float32Array(this.cap * 3);
    this.pLife = new Float32Array(this.cap);
    this.pMax = new Float32Array(this.cap);
    this.pGrav = new Float32Array(this.cap);
    this.pHead = 0;
    const pMat = new THREE.PointsMaterial({
      size: 0.11, vertexColors: true, transparent: true, opacity: 0.95,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    this.points = new THREE.Points(geo, pMat);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  spark(point, color = 0xffd08a, count = 8, speed = 5, gravity = 12) {
    const p = this.pGeo.attributes.position.array;
    const c = this.pGeo.attributes.color.array;
    const col = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const idx = this.pHead++ % this.cap;
      const o = idx * 3;
      p[o] = point.x; p[o + 1] = point.y; p[o + 2] = point.z;
      const a = Math.random() * Math.PI * 2;
      const up = Math.random();
      const sp = speed * (0.35 + Math.random() * 0.9);
      this.pVel[o] = Math.cos(a) * sp * (0.4 + Math.random() * 0.6);
      this.pVel[o + 1] = up * sp * 1.1 + 0.6;
      this.pVel[o + 2] = Math.sin(a) * sp * (0.4 + Math.random() * 0.6);
      this.pLife[idx] = this.pMax[idx] = 0.24 + Math.random() * 0.5;
      this.pGrav[idx] = gravity;
      c[o] = col.r; c[o + 1] = col.g; c[o + 2] = col.b;
    }
    this.pGeo.attributes.position.needsUpdate = true;
    this.pGeo.attributes.color.needsUpdate = true;
  }

  tracer(from, to, color = 0xffd9a0, life = 0.075) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ line, life, max: life });
    if (this.tracers.length > 60) {
      const old = this.tracers.shift();
      this.scene.remove(old.line); old.line.geometry.dispose(); old.line.material.dispose();
    }
  }

  impact(point, normal, color = 0xf0c98a, count = 5) {
    this.spark(point, color, count, 4.2, 14);
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.16, 8), new THREE.MeshBasicMaterial({
      color: 0x2a2a28, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide
    }));
    d.position.copy(point).addScaledVector(normal, 0.01);
    d.lookAt(this._v.copy(point).add(normal));
    this.scene.add(d);
    this.blasts.push({ mesh: d, life: 3.5, max: 3.5, type: 'decal' });
  }

  blood(point, color = 0x8e1d18, count = 10) {
    this.spark(point, color, count, 3.4, 16);
  }

  explosion(pos) {
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(1, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0xffb257, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    flash.position.copy(pos);
    this.scene.add(flash);
    this.blasts.push({ mesh: flash, life: 0.45, max: 0.45, type: 'flash', grow: 7 });

    const shock = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 0.85, 32),
      new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    shock.position.copy(pos); shock.position.y += 0.3;
    shock.rotation.x = -Math.PI / 2;
    this.scene.add(shock);
    this.blasts.push({ mesh: shock, life: 0.55, max: 0.55, type: 'shock', grow: 12 });

    const light = new THREE.PointLight(0xff8a3a, 70, 22, 2);
    light.position.copy(pos); light.position.y += 1;
    this.scene.add(light);
    this.lights.push({ light, life: 0.4, max: 0.4, peak: 70 });

    this.spark(pos.clone().setY(pos.y + 0.5), 0xffa24a, 46, 11, 9);
    this.spark(pos.clone().setY(pos.y + 0.5), 0xffe2a0, 18, 7, 6);
  }

  casing(pos, dir) {
    if (this.casings.length > 90) {
      const c = this.casings.shift();
      this.scene.remove(c.mesh); c.mesh.geometry.dispose(); c.mesh.material.dispose();
    }
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.07),
      new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.3, metalness: 0.9 }));
    mesh.position.copy(pos);
    this.scene.add(mesh);
    this.casings.push({
      mesh, life: 1.6, max: 1.6,
      vel: new THREE.Vector3(
        dir.x * 1.2 + (Math.random() - 0.5) * 2.4,
        1.6 + Math.random() * 1.8,
        dir.z * 1.2 + (Math.random() - 0.5) * 2.4
      ),
      spin: new THREE.Vector3(Math.random() * 14, Math.random() * 14, Math.random() * 14)
    });
  }

  clear() {
    for (const t of this.tracers) { this.scene.remove(t.line); t.line.geometry.dispose(); t.line.material.dispose(); }
    for (const b of this.blasts) { this.scene.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose(); }
    for (const c of this.casings) { this.scene.remove(c.mesh); c.mesh.geometry.dispose(); c.mesh.material.dispose(); }
    for (const l of this.lights) { this.scene.remove(l.light); }
    this.tracers.length = 0; this.blasts.length = 0; this.casings.length = 0; this.lights.length = 0;
    this.pLife.fill(0);
    const p = this.pGeo.attributes.position.array;
    for (let i = 0; i < this.cap; i++) p[i * 3 + 1] = -9999;
    this.pGeo.attributes.position.needsUpdate = true;
  }

  update(dt) {
    /* tracers */
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      t.line.material.opacity = Math.max(0, (t.life / t.max) * 0.9);
      if (t.life <= 0) {
        this.scene.remove(t.line); t.line.geometry.dispose(); t.line.material.dispose();
        this.tracers.splice(i, 1);
      }
    }

    /* particles */
    const p = this.pGeo.attributes.position.array;
    let dirty = false;
    for (let i = 0; i < this.cap; i++) {
      if (this.pLife[i] <= 0) continue;
      this.pLife[i] -= dt;
      const o = i * 3;
      this.pVel[o + 1] -= this.pGrav[i] * dt;
      p[o] += this.pVel[o] * dt;
      p[o + 1] += this.pVel[o + 1] * dt;
      p[o + 2] += this.pVel[o + 2] * dt;
      if (p[o + 1] < 0.02) { p[o + 1] = 0.02; this.pVel[o + 1] *= -0.25; this.pVel[o] *= 0.6; this.pVel[o + 2] *= 0.6; }
      if (this.pLife[i] <= 0) p[o + 1] = -9999;
      dirty = true;
    }
    if (dirty) this.pGeo.attributes.position.needsUpdate = true;

    /* blasts */
    for (let i = this.blasts.length - 1; i >= 0; i--) {
      const b = this.blasts[i];
      b.life -= dt;
      const k = Math.max(0, b.life / b.max);
      if (b.type === 'flash') {
        b.mesh.scale.setScalar(1 + (1 - k) * b.grow);
        b.mesh.material.opacity = k * 0.9;
      } else if (b.type === 'shock') {
        b.mesh.scale.setScalar(1 + (1 - k) * b.grow);
        b.mesh.material.opacity = k * 0.7;
      } else {
        b.mesh.material.opacity = Math.min(0.55, k * 0.9);
      }
      if (b.life <= 0) {
        this.scene.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose();
        this.blasts.splice(i, 1);
      }
    }

    /* lights */
    for (let i = this.lights.length - 1; i >= 0; i--) {
      const l = this.lights[i];
      l.life -= dt;
      l.light.intensity = Math.max(0, l.peak * (l.life / l.max));
      if (l.life <= 0) { this.scene.remove(l.light); this.lights.splice(i, 1); }
    }

    /* casings */
    for (let i = this.casings.length - 1; i >= 0; i--) {
      const c = this.casings[i];
      c.life -= dt;
      c.vel.y -= 18 * dt;
      c.mesh.position.addScaledVector(c.vel, dt);
      c.mesh.rotation.x += c.spin.x * dt;
      c.mesh.rotation.y += c.spin.y * dt;
      if (c.mesh.position.y < 0.02) { c.mesh.position.y = 0.02; c.vel.y *= -0.35; c.vel.x *= 0.6; c.vel.z *= 0.6; }
      if (c.life <= 0) {
        this.scene.remove(c.mesh); c.mesh.geometry.dispose(); c.mesh.material.dispose();
        this.casings.splice(i, 1);
      }
    }
  }
}
