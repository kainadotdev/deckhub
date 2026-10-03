/* Visualizador 3D (Three.js local em /js/vendor/three.min.js, carregado sob demanda).
   Carta: 2.5 x 3.5 x 0.003. Booster: plano subdividido, estufado no centro e achatado/ranhurado nas pontas. */
(function () {
  let T3;
  const loadThree = () => T3 || (T3 = new Promise((ok, no) => {
    if (window.THREE) return ok();
    const s = document.createElement("script"); s.src = "js/vendor/three.min.js"; s.onload = ok; s.onerror = no; document.head.appendChild(s);
  }));
  const tex = url => new Promise(ok => {
    if (!url) return ok(null);
    new THREE.TextureLoader().load(url, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; ok(t); }, undefined, () => ok(null));
  });
  const cv = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d")); return c; };
  const ct = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };

  async function build(host, p) {
    const booster = !!p.isBooster, canvas = host.querySelector("canvas");
    const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.useLegacyLights = true;
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, .1, 100), grp = new THREE.Group();
    sc.add(grp, new THREE.AmbientLight(0xffffff, .75));
    const d1 = new THREE.DirectionalLight(0xffffff, 1); d1.position.set(3, 4, 6);
    const d2 = new THREE.DirectionalLight(0xbfd8ff, .5); d2.position.set(-5, -2, 3); sc.add(d1, d2);
    const front = await tex(p.image), H = booster ? 4.2 : 3.5, W = booster ? 2.4 : 2.5;
    if (!front) throw new Error("sem imagem");
    if (booster) {
      const geo = new THREE.PlaneGeometry(W, H, 32, 64), ps = geo.attributes.position;
      for (let i = 0; i < ps.count; i++) {
        const x = ps.getX(i), y = ps.getY(i), ny = Math.abs(y / (H / 2));
        let z = Math.max(0, Math.pow(Math.cos(ny * Math.PI / 2), .8) * .2 * (1 - Math.pow(x / (W / 2), 2)));
        z += Math.max(0, (ny - .93) / .07) * .018 * Math.sin(x * 50); ps.setZ(i, z);
      }
      geo.computeVertexNormals();
      const foil = ct(cv(256, 512, g => {
        const q = g.createLinearGradient(0, 0, 256, 512); q.addColorStop(0, "#e6e9ee"); q.addColorStop(.5, "#a4acb8"); q.addColorStop(1, "#e0e3e8");
        g.fillStyle = q; g.fillRect(0, 0, 256, 512); g.fillStyle = "rgba(0,0,0,.18)";
        for (let x = 4; x < 256; x += 8) { g.fillRect(x, 0, 3, 28); g.fillRect(x, 484, 3, 28); }
      }));
      const a = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: front, metalness: .3, roughness: .3, clearcoat: .5, clearcoatRoughness: .3, transparent: true, alphaTest: .5 }));
      const b = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: foil, metalness: .6, roughness: .28, clearcoat: .4 }));
      b.rotation.y = Math.PI; grp.add(a, b);
    } else {
      const am = new THREE.CanvasTexture(cv(330, 460, g => { g.fillStyle = "#000"; g.fillRect(0, 0, 330, 460); g.fillStyle = "#fff"; rr(g, 0, 0, 330, 460, 20); g.fill(); }));
      const icon = await new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = "images/logo-icon.png"; });
      const back = ct(cv(330, 460, g => {
        g.fillStyle = "#063B7A"; g.fillRect(0, 0, 330, 460); g.strokeStyle = "#FFD21C"; g.lineWidth = 6; g.strokeRect(16, 16, 298, 428);
        if (icon) g.drawImage(icon, 105, 170, 120, 120);
      }));
      const mk = m => new THREE.MeshPhysicalMaterial({ map: m, alphaMap: am, transparent: true, alphaTest: .5, roughness: .35, metalness: .1, clearcoat: .4 });
      const ed = new THREE.MeshStandardMaterial({ color: 0xdddddd });
      grp.add(new THREE.Mesh(new THREE.BoxGeometry(W, H, .003), [ed, ed, ed, ed, mk(front), mk(back)]));
    }
    let rx = .1, ry = -.5, vy = 0, z = 1, dr = false, lx = 0, ly = 0, bz = 8, raf = 0;
    const rd = () => { grp.rotation.set(rx, ry, 0); cam.position.z = bz / z; r.render(sc, cam); };
    const fit = () => {
      const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
      r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      bz = Math.max(H * 1.3, W * 1.5 / cam.aspect) / 2 / Math.tan(17.5 * Math.PI / 180); rd();
    };
    new ResizeObserver(fit).observe(host); fit();
    const loop = () => { if (dr) return; ry += vy; vy *= .93; rd(); raf = Math.abs(vy) > .0005 ? requestAnimationFrame(loop) : 0; };
    host.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; dr = true; vy = 0; lx = e.clientX; ly = e.clientY; host.setPointerCapture(e.pointerId); });
    host.addEventListener("pointermove", e => { if (!dr) return; vy = (e.clientX - lx) * .01; ry += vy; rx = Math.max(-1, Math.min(1, rx + (e.clientY - ly) * .008)); lx = e.clientX; ly = e.clientY; rd(); });
    const up = () => { if (!dr) return; dr = false; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); };
    host.addEventListener("pointerup", up); host.addEventListener("pointercancel", up);
    host.addEventListener("wheel", e => { e.preventDefault(); z = Math.max(.7, Math.min(1.8, z - e.deltaY * .001)); rd(); }, { passive: false });
    host.querySelectorAll("[data-z]").forEach(b => b.onclick = () => { z = Math.max(.7, Math.min(1.8, z + b.dataset.z * .2)); rd(); });
  }

  DH.viewer = function (host, p) {
    host.innerHTML = `<canvas></canvas><div class="vz"><button data-z="1" aria-label="Aproximar">${DH.ICON.plus}</button><button data-z="-1" aria-label="Afastar">${DH.ICON.minus}</button></div><p class="vh">Arraste para girar</p>`;
    loadThree().then(() => build(host, p)).catch(() => { host.innerHTML = `<div class="fb"><img src="${p.image}" alt="${p.name}"></div>`; });
  };
})();
