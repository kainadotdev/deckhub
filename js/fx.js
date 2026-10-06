/* Efeitos de experiência (desktop): revelar ao rolar, inclinação dos cards, 3D no hero e dragão em "faixas" de scroll.
   Tudo é decoração: respeita prefers-reduced-motion e nunca esconde conteúdo essencial. */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches, wide = matchMedia("(min-width:1024px)").matches, fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("seen"); io.unobserve(e.target); } }), { threshold: .12 });
  const reveal = () => $$(".rv:not(.seen)").forEach(el => io.observe(el));
  new MutationObserver(reveal).observe(document.body, { childList: true, subtree: true }); document.addEventListener("DOMContentLoaded", reveal);
  /* inclinação do card sob o cursor (só mouse) */
  if (fine && !reduced) document.addEventListener("pointermove", e => {
    const im = e.target.closest && e.target.closest(".pc .im"); if (!im) return; const b = im.getBoundingClientRect();
    im.style.setProperty("--ry", ((e.clientX - b.left) / b.width - .5) * 22 + "deg"); im.style.setProperty("--rx", (.5 - (e.clientY - b.top) / b.height) * 16 + "deg");
  });
  document.addEventListener("pointerout", e => { const im = e.target.closest && e.target.closest(".pc .im"); if (im && !im.contains(e.relatedTarget)) { im.style.removeProperty("--rx"); im.style.removeProperty("--ry"); } });
  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.page !== "home" || !window.DH) return;
    $("#cl1").innerHTML = DH.CL.topo; $("#cl2").innerHTML = DH.CL.esq; $("#ghost").innerHTML = DH.CL.sim;
    const stage = $("#hstage");
    /* 3D no hero: só desktop, sem economia de dados; o PNG estático aparece primeiro e é substituído quando o 3D estiver pronto */
    const saver = navigator.connection && navigator.connection.saveData;
    if (wide && !saver) (window.requestIdleCallback || setTimeout)(() => {
      const host = document.createElement("div"); host.className = "v3d"; stage.appendChild(host);
      DH.viewer(host, DH.bySlug(stage.dataset.slug), { controls: false, zoom: false });
      new MutationObserver(() => host.classList.contains("ready") && stage.classList.add("ok")).observe(host, { attributes: true });
    });
    /* dragão: usa images/dragao/voo.webp (recorte transparente) se existir; senão, o selo do mascote do projeto (images/logo.png) */
    const probe = new Image(); let src = "images/dragao/voo.webp", sel = false;
    probe.onerror = () => { src = "images/logo.png"; sel = true; go(); }; probe.onload = go; probe.src = src;
    function go() {
      if (!wide || reduced) return;
      $$(".dragon").forEach(d => { d.innerHTML = `<img class="${sel ? "sel" : ""}" src="${src}" alt="" width="150" height="150">`; });
      const h = $('.dragon[data-lane="hero"]'), W = innerWidth;
      h.style.left = "0"; h.style.bottom = "6%";
      h.animate([{ transform: `translate(-20vw,40px) rotate(-18deg) scale(.7)`, opacity: 0 }, { opacity: 1, offset: .15 }, { transform: `translate(${W * .55}px,-30vh) rotate(8deg) scale(1.15)`, offset: .6 }, { transform: `translate(${W * 1.1}px,-62vh) rotate(24deg) scale(.8)`, opacity: 0 }], { duration: 3600, delay: 900, easing: "cubic-bezier(.4,.1,.3,1)", fill: "both" });
      const lane = $('.dragon[data-lane="help"]'), box = lane.parentElement; lane.style.right = "6%"; lane.style.top = "-70px";
      const onScroll = () => { const b = box.getBoundingClientRect(), t = Math.max(0, Math.min(1, 1 - (b.top - innerHeight * .25) / (innerHeight * .6)));
        lane.style.opacity = t; lane.style.transform = `translate(${(1 - t) * 160}px,${(1 - t) * 40}px) rotate(${-14 + t * 14}deg)`; };
      addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }
  });
})();
