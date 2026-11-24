(() => {
  const pages = [...document.querySelectorAll(".page")];
  const navItems = [...document.querySelectorAll(".nav-item")];
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const progress = document.getElementById("progress");
  const count = document.getElementById("page-count");
  const kicker = document.getElementById("page-kicker");
  let current = 0;
  const slugs = ["home","about","skills","projects","experience","education","contact"];

  function showPage(index, updateHash = true) {
    current = Math.max(0, Math.min(pages.length - 1, index));
    pages.forEach((page, i) => page.classList.toggle("active", i === current));
    navItems.forEach((item, i) => {
      item.classList.toggle("active", i === current);
      item.setAttribute("aria-current", i === current ? "page" : "false");
    });
    prev.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    count.innerHTML = `${String(current + 1).padStart(2,"0")} <i>/</i> ${String(pages.length).padStart(2,"0")}`;
    progress.style.width = `${((current + 1) / pages.length) * 100}%`;
    kicker.textContent = `${String(current + 1).padStart(2,"0")} / ${pages[current].dataset.title.toUpperCase()}`;
    if (updateHash) history.replaceState(null, "", `#${slugs[current]}`);
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  navItems.forEach(item => item.addEventListener("click", () => showPage(Number(item.dataset.page))));
  document.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => showPage(Number(btn.dataset.go))));
  prev.addEventListener("click", () => showPage(current - 1));
  next.addEventListener("click", () => showPage(current + 1));
  document.addEventListener("keydown", e => {
    if (["ArrowRight","ArrowLeft"].includes(e.key) && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
      showPage(current + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  const initial = slugs.indexOf(location.hash.slice(1));
  showPage(initial >= 0 ? initial : 0, false);

  // Lightweight animated neural network background; respects reduced-motion preferences.
  const canvas = document.getElementById("network");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, nodes = [], raf;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    nodes = Array.from({length: Math.min(52, Math.floor(innerWidth / 24))}, () => ({
      x: Math.random()*innerWidth, y: Math.random()*innerHeight,
      vx: (Math.random()-.5)*.22, vy: (Math.random()-.5)*.22
    }));
  }
  function draw() {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    nodes.forEach((p,i) => {
      if (!reduced) { p.x += p.vx; p.y += p.vy; }
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
      for (let j=i+1;j<nodes.length;j++) {
        const q=nodes[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.hypot(dx,dy);
        if (d<145) {
          ctx.strokeStyle=`rgba(78,151,224,${(1-d/145)*.16})`;
          ctx.lineWidth=.7; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
        }
      }
      ctx.fillStyle="rgba(103,183,255,.48)";
      ctx.beginPath(); ctx.arc(p.x,p.y,1.25,0,Math.PI*2); ctx.fill();
    });
    if (!reduced) raf=requestAnimationFrame(draw);
  }
  resize(); draw();
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); draw(); });
})();