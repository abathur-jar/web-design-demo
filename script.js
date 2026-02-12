(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth anchor scroll (with sticky header offset)
  const header = $(".header");
  const headerH = () => (header ? header.getBoundingClientRect().height : 0);

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();

      const y = el.getBoundingClientRect().top + window.scrollY - headerH() - 10;
      window.scrollTo({ top: y, behavior: "smooth" });

      closeDrawer();
    });
  });

  // Mobile drawer
  const menuBtn = $("#menuBtn");
  const drawer = $("#drawer");

  function openDrawer(){
    if (!drawer || !menuBtn) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer(){
    if (!drawer || !menuBtn) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  // Filters
  const filters = $$(".filter");
  const cards = $$(".card");

  function setActive(btn){
    filters.forEach(b => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      setActive(btn);
      const f = btn.dataset.filter || "all";

      cards.forEach(card => {
        const tags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
        const ok = (f === "all") || tags.includes(f);
        card.hidden = !ok;
      });
    });
  });

  // Modal
  const modal = $("#modal");
  const modalMedia = $("#modalMedia");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");

  let lastFocus = null;

  function lockScroll(lock){
    document.body.style.overflow = lock ? "hidden" : "";
  }

  function openModal(card){
    if (!modal || !modalMedia || !modalTitle || !modalDesc) return;

    lastFocus = document.activeElement;

    const title = card.dataset.title || "";
    const desc = card.dataset.desc || "";
    const src = card.dataset.video || "";

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalMedia.innerHTML = "";

    const v = document.createElement("video");
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.muted = true;
    v.playsInline = true;
    v.preload = "metadata";
    modalMedia.appendChild(v);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll(true);

    // focus close
    const closeBtn = modal.querySelector("[data-close]");
    closeBtn && closeBtn.focus();
  }

  function closeModal(){
    if (!modal || !modalMedia) return;
    if (!modal.classList.contains("is-open")) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalMedia.innerHTML = "";
    lockScroll(false);

    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  // Open modal on card click
  $$(".card__btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      if (card) openModal(card);
    });
  });

  // Close modal on backdrop/close click
  if (modal) {
    modal.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.dataset && target.dataset.close) closeModal();
    });
  }

  // ESC closes everything
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closeModal();
    }
  });

  // Copy email
  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email || "";
      if (!email) return;
      try{
        await navigator.clipboard.writeText(email);
        const old = copyBtn.textContent;
        copyBtn.textContent = "Copied ✓";
        setTimeout(() => (copyBtn.textContent = old), 1200);
      }catch{
        // fallback
        const ta = document.createElement("textarea");
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
    });
  }

  // Hover video preview (desktop only)
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canHover) {
    cards.forEach(card => {
      const media = $(".card__media", card);
      const img = $("img", media);
      const src = card.dataset.video;

      let previewVideo = null;

      const startPreview = async () => {
        if (!media || !src) return;
        if (previewVideo) return;

        previewVideo = document.createElement("video");
        previewVideo.src = src;
        previewVideo.muted = true;
        previewVideo.loop = true;
        previewVideo.playsInline = true;
        previewVideo.preload = "metadata";
        previewVideo.setAttribute("aria-hidden", "true");

        // поверх картинки
        previewVideo.style.position = "absolute";
        previewVideo.style.inset = "0";
        previewVideo.style.width = "100%";
        previewVideo.style.height = "100%";
        previewVideo.style.objectFit = "cover";

        media.style.position = "relative";
        media.appendChild(previewVideo);

        try { await previewVideo.play(); } catch { /* autoplay policy */ }
        if (img) img.style.opacity = "0";
      };

      const stopPreview = () => {
        if (!previewVideo) return;
        previewVideo.pause();
        previewVideo.remove();
        previewVideo = null;
        if (img) img.style.opacity = "";
      };

      card.addEventListener("pointerenter", startPreview);
      card.addEventListener("pointerleave", stopPreview);
    });
  }
})();
