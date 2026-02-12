// script.js
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth anchor scroll
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobile();
    });
  });

  // Theme toggle (dark/light)
  const themeBtn = $("#themeBtn");
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // Mobile menu
  const burger = $("#burger");
  const mobile = $("#mobile");

  function openMobile(){
    if (!mobile || !burger) return;
    mobile.style.display = "block";
    mobile.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
  }
  function closeMobile(){
    if (!mobile || !burger) return;
    mobile.style.display = "none";
    mobile.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger) {
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      open ? closeMobile() : openMobile();
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add("is-visible");
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => io.observe(el));

  // Filters
  const filters = $$(".filter");
  const cards = $$(".card");

  const setActive = (btn) => {
    filters.forEach(b => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
  };

  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      setActive(btn);
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const tags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
        const ok = (f === "all") || tags.includes(f);
        card.style.display = ok ? "" : "none";
      });
    });
  });

  // Modal viewer for works
  const modal = $("#modal");
  const modalMedia = $("#modalMedia");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");
  const modalClose = $("#modalClose");

  function openModal({ title, desc, src }) {
    if (!modal || !modalMedia || !modalTitle || !modalDesc) return;

    modalTitle.textContent = title || "";
    modalDesc.textContent = desc || "";
    modalMedia.innerHTML = "";

    const s = (src || "").toLowerCase();
    const isVideo = s.endsWith(".mp4") || s.includes(".mp4?");

    if (src) {
      if (isVideo) {
        const v = document.createElement("video");
        v.src = src;
        v.controls = true;
        v.autoplay = true;
        v.muted = true;
        v.playsInline = true;
        v.style.width = "100%";
        v.style.height = "100%";
        v.style.objectFit = "cover";
        modalMedia.appendChild(v);
      } else {
        const img = document.createElement("img");
        img.src = src;
        img.alt = title || "work";
        modalMedia.appendChild(img);
      }
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (modalMedia) modalMedia.innerHTML = "";
    document.body.style.overflow = "";
  }

  $$(".card").forEach(card => {
    card.addEventListener("click", () => {
      openModal({
        title: card.dataset.title,
        desc: card.dataset.desc,
        src: card.dataset.src
      });
    });
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target?.dataset?.close) closeModal();
    });
  }
  if (modalClose) modalClose.addEventListener("click", closeModal);

  // Escape closes modal & mobile
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobile();
      closeModal();
    }
  });

  // Minimal parallax on stickers
  const stickers = document.querySelectorAll(".sticker");
  let mx = 0, my = 0;

  window.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mx = (e.clientX - cx) / cx;
    my = (e.clientY - cy) / cy;
  });

  function parallaxTick(){
    stickers.forEach((el, i) => {
      const k = 6 + i * 3;
      el.style.transform = `translate3d(${mx * k}px, ${my * k}px, 0)`;
    });
    requestAnimationFrame(parallaxTick);
  }
  parallaxTick();

  // Copy email
  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email || "";
      if (!email) return;
      try{
        await navigator.clipboard.writeText(email);
        const old = copyBtn.textContent;
        copyBtn.textContent = "Скопировано ✔️";
        setTimeout(() => (copyBtn.textContent = old), 1100);
      }catch{
        const ta = document.createElement("textarea");
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
    });
  }

  // Demo submit
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const old = btn.textContent;
      btn.textContent = "Отправлено ✔️";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = old;
        btn.disabled = false;
        form.reset();
      }, 1200);
    });
  }
})();