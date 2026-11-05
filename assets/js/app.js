/* ============================================================
   Mohabatullah Sahel — Personal Portfolio 2026
   Interactions (vanilla JS, no dependencies)
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Theme ---------- */
  const themeToggle = $("#themeToggle");
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("mohabul-theme", theme); } catch (e) {}
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- Header scrolled ---------- */
  const header = $("#siteHeader");
  const scrollTop = $("#scrollTop");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
    if (scrollTop) scrollTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Custom cursor ---------- */
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  if (dot && ring && !isCoarse && !prefersReduced) {
    document.body.classList.add("has-cursor");
    let mx = -100, my = -100, rx = -100, ry = -100, raf = null;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (!raf) {
        raf = requestAnimationFrame(function loop() {
          rx += (mx - rx) * 0.16;
          ry += (my - ry) * 0.16;
          ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
          raf = requestAnimationFrame(loop);
        });
      }
    });
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .project-card, .chip, .cloud-node, input, textarea, .fact, .service-card, .edu-card, .lang-card")) {
        ring.classList.add("is-hover");
      } else {
        ring.classList.remove("is-hover");
      }
    });
  }

  /* ---------- Mobile nav ---------- */
  const burger = $("#navBurger");
  const mobileMenu = $("#mobileMenu");
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
    if (burger) { burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  }
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      document.body.style.overflow = open ? "hidden" : "";
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", mobileMenu).forEach((a) => a.addEventListener("click", closeMenu));
    mobileMenu.addEventListener("click", (e) => { if (e.target === mobileMenu) closeMenu(); });
  }

  /* ---------- Smooth anchor scroll ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = $(id);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 74, behavior: prefersReduced ? "auto" : "smooth" });
        }
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Nav active state ---------- */
  const sections = $$("section[id]");
  const navLinks = $$(".nav-link");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          navLinks.forEach((l) => {
            l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Typed roles ---------- */
  const typedEl = $("#typedRole");
  if (typedEl) {
    const roles = ["Web Developer", "Software Engineer", "Full-Stack Developer", "UI/UX Designer", "Backend Developer", "Frontend Developer"];
    let i = 0, charIdx = 0, deleting = false;
    const speed = 70, delSpeed = 38, pause = 1800;
    function type() {
      const cur = roles[i];
      if (!deleting) {
        typedEl.textContent = cur.slice(0, ++charIdx);
        if (charIdx === cur.length) { deleting = true; setTimeout(type, pause); return; }
        setTimeout(type, speed);
      } else {
        typedEl.textContent = cur.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; i = (i + 1) % roles.length; }
        setTimeout(type, delSpeed);
      }
    }
    if (prefersReduced) { typedEl.textContent = roles[0]; } else { type(); }
  }

  /* ---------- Counters ---------- */
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !prefersReduced) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target, target = +el.getAttribute("data-count"), dur = 1500;
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.getAttribute("data-count")));
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isCoarse && !prefersReduced) {
    $$("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Particles ---------- */
  const particlesBox = $("#particles");
  if (particlesBox && !prefersReduced) {
    const count = Math.min(26, Math.floor(window.innerWidth / 60));
    for (let n = 0; n < count; n++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = 2 + Math.random() * 3;
      p.style.width = size + "px"; p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.bottom = "-10px";
      p.style.animationDuration = (12 + Math.random() * 14) + "s";
      p.style.animationDelay = (Math.random() * 16) + "s";
      particlesBox.appendChild(p);
    }
  }

  /* ---------- Project modal ---------- */
  const modal = $("#projectModal");
  const modalBox = $("#projectModalBox");
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
  function openModal(data) {
    if (!modal || !modalBox) return;
    modalBox.innerHTML =
      '<div class="modal-thumb"><img src="' + data.img + '" alt="' + data.title + '">' +
      '<button class="modal-close" data-self-close aria-label="Close">&times;</button></div>' +
      '<div class="modal-body"><span class="project-cat">' + data.cat + "</span><h2>" + data.title + "</h2>" +
      "<p>" + data.desc + "</p>" +
      '<div class="modal-meta">' +
      (data.role ? '<div><h4>My Role</h4><p>' + data.role + "</p></div>" : "") +
      (data.url ? '<div><h4>Live</h4><a href="' + data.url + '" target="_blank" rel="noreferrer">' + data.url + "</a></div>" : "") +
      "</div>" +
      '<h4 style="margin-bottom:8px">Technology</h4><div class="project-tags">' +
      data.tags.map((t) => "<span>" + t + "</span>").join("") +
      '</div><div class="modal-links">' +
      (data.url ? '<a class="btn btn-primary" target="_blank" rel="noreferrer" href="' + data.url + '"><span class="btn-inner">Visit Live Site</span></a>' : "") +
      "</div></div>";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    $$("[data-self-close]", modalBox).forEach((b) => b.addEventListener("click", closeModal));
  }
  $$(".project-card").forEach((card) => {
    card.addEventListener("click", () => openModal({
      img: card.getAttribute("data-img"),
      title: card.getAttribute("data-title"),
      cat: card.getAttribute("data-cat"),
      desc: card.getAttribute("data-desc"),
      role: card.getAttribute("data-role"),
      url: card.getAttribute("data-url"),
      tags: (card.getAttribute("data-tags") || "").split("|")
    }));
  });

  /* ---------- Project filters ---------- */
  $$(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      $$(".filter-btn").forEach((b) => b.classList.toggle("active", b === button));
      $$(".project-card").forEach((card) => {
        const category = (card.dataset.cat || "").toLowerCase();
        const group = card.dataset.filterGroup || (category.includes("management") || category.includes("government") ? "management" : category.includes("corporate") ? "other" : "web");
        card.hidden = filter !== "all" && group !== filter;
      });
    });
  });
  if (modal) {
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(data.get("subject") || "Portfolio enquiry");
      const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
      window.location.href = `mailto:mohabatullahsahel.afg@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------- Scroll top ---------- */
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }
})();


