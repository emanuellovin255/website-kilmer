document.documentElement.classList.add("js");

// Nav: scrolled state + mobile menu
const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");

const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  })
);

// Reveal on scroll + animate delivery bars
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll(".bars li").forEach((li, i) => {
        const max = +li.parentElement.dataset.max;
        setTimeout(() => {
          li.querySelector("i").style.setProperty("--w", (li.dataset.max / max) * 100 + "%");
        }, i * 90);
      });
      io.unobserve(e.target);
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  io.observe(el);
});

// Price tabs
const tabs = document.querySelectorAll("#priceTabs .tab");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll(".panel").forEach((p) => {
      const on = p.dataset.panel === tab.dataset.tab;
      p.classList.toggle("active", on);
      p.hidden = !on;
    });
  })
);
document.getElementById("priceTabs").addEventListener("keydown", (e) => {
  if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  const list = [...tabs];
  const i = list.indexOf(document.activeElement);
  if (i < 0) return;
  const next = list[(i + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length];
  next.focus();
  next.click();
});

// Admodum bar example (10.000 CLP per implant)
const implants = document.getElementById("implants");
const total = document.getElementById("calcTotal");
const renderImplants = (n) => {
  implants.innerHTML = Array.from({ length: n }, (_, i) => `<span style="animation-delay:${i * 60}ms"></span>`).join("");
  total.textContent = "$ " + (n * 10000).toLocaleString("es-CL");
};
document.querySelectorAll(".calc-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".calc-btn").forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-pressed", b === btn);
    });
    renderImplants(+btn.dataset.n);
  })
);
renderImplants(6);

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
const lbCap = lb.querySelector(".lb-cap");
let lastFocus = null;
document.querySelectorAll(".shot").forEach((fig) =>
  fig.querySelector(".shot-btn").addEventListener("click", () => {
    lastFocus = document.activeElement;
    lbImg.src = fig.dataset.full;
    lbImg.alt = fig.querySelector("img").alt;
    lbCap.textContent = fig.querySelector("figcaption").innerText.replace("\n", " — ");
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("open"));
    lb.querySelector(".lb-close").focus();
  })
);
const closeLb = () => {
  if (lb.hidden) return;
  lb.classList.remove("open");
  lb.hidden = true;
  if (lastFocus) lastFocus.focus();
};
lb.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

document.getElementById("year").textContent = new Date().getFullYear();
