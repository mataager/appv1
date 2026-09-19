/* =========================================================================
   Matager Nav — floating page-switcher
   File: assets/functions/nav.js
   -------------------------------------------------------------------------
   Drop-in:
     <script src="./assets/functions/nav.js"></script>

   Auto-injects:
     • A floating pill button (bottom-right; bottom-left in RTL)
     • A modal listing every available page
     • Click-outside + Esc to close, focus management for a11y
     • Matches the current language (EN / AR) via MatagerI18n, if present
     • Marks the page you're currently on

   Public API (window.MatagerNav):
     .open()    -> open the modal
     .close()   -> close the modal
     .toggle()  -> toggle open/closed
     .pages     -> array of { key, href, icon, label, labelAr }
     .add(pg)   -> push a page and refresh
     .refresh() -> re-render the modal (after mutating .pages)
   ========================================================================= */

(function (global) {
  "use strict";

  /* ---------------------------------------------------------------------
     1) CONFIG
     --------------------------------------------------------------------- */
  const ID_BTN = "matager-nav-btn";
  const ID_MODAL = "matager-nav-modal";
  const ID_STYLE = "matager-nav-style";
  const Z_BTN = 9500;
  const Z_MODAL = 9600;

  /* Every page you can jump to. href is relative to the current page. */
  const PAGES = [
    {
      key: "landing",
      href: "landing-view.html",
      icon: "bi-globe2",
      label: "Landing page",
      labelAr: "الصفحة الرئيسية",
    },
    {
      key: "signing",
      href: "signing.html",
      icon: "bi-shield-lock",
      label: "Sign in / up",
      labelAr: "تسجيل الدخول",
    },
    {
      key: "client",
      href: "clientDashboard-view.html",
      icon: "bi-grid-1x2-fill",
      label: "Client dashboard",
      labelAr: "لوحة العميل",
    },
    {
      key: "admin",
      href: "adminDashboard-view.html",
      icon: "bi-shield-check",
      label: "Admin dashboard",
      labelAr: "لوحة المدير",
    },
    {
      key: "cashier",
      href: "cashier-view.html",
      icon: "bi-receipt",
      label: "Cashier / POS",
      labelAr: "الكاشير",
    },
    {
      key: "fastCart",
      href: "customerFastCart-view.html",
      icon: "bi-basket",
      label: "Customer cart",
      labelAr: "سلة العميل",
    },
  ];

  const STR = {
    en: {
      trigger: "Views",
      title: "Jump to a view",
      subtitle: "Switch between the pages in this prototype",
      current: "You're here",
      openInTab: "Open in new tab",
      close: "Close",
    },
    ar: {
      trigger: "الواجهات",
      title: "انتقل إلى الواجهات",
      subtitle: "تنقّل بين صفحات هذا النموذج",
      current: "أنت هنا",
      openInTab: "افتح في تبويب جديد",
      close: "إغلاق",
    },
  };

  /* ---------------------------------------------------------------------
     2) HELPERS
     --------------------------------------------------------------------- */
  const $ = (sel) => document.querySelector(sel);

  function lang() {
    if (
      global.MatagerI18n &&
      typeof global.MatagerI18n.currentLanguage === "function"
    ) {
      return global.MatagerI18n.currentLanguage();
    }
    return (document.documentElement.lang || "en").indexOf("ar") === 0
      ? "ar"
      : "en";
  }

  function t(key) {
    const dict = STR[lang()] || STR.en;
    return dict[key] !== undefined ? dict[key] : STR.en[key];
  }

  function currentFile() {
    const path = (location.pathname || "").split("/").pop() || "";
    return path || "index.html";
  }

  function samePage(href) {
    // Normalize: strip query/hash and compare basenames
    const a = href.split("#")[0].split("?")[0].split("/").pop();
    const b = currentFile();
    return a && b && a === b;
  }

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  /* ---------------------------------------------------------------------
     3) STYLES
     --------------------------------------------------------------------- */
  const CSS = `
  /* ---- Floating trigger ---- */
  #${ID_BTN} {
    position: fixed;
    bottom: 20px;
    inset-inline-end: 20px;
    z-index: ${Z_BTN};
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px 10px 14px;
    background: rgba(14, 15, 22, 0.85);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid rgba(255, 255, 255, 0.10);
    border-radius: 999px;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: pointer;
    box-shadow:
      0 20px 50px -12px rgba(0, 0, 0, 0.75),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    transition:
      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      background 0.25s ease,
      border-color 0.25s ease;
    -webkit-tap-highlight-color: transparent;
  }
  #${ID_BTN}:hover {
    background: rgba(20, 22, 32, 0.95);
    border-color: rgba(59, 130, 246, 0.45);
    transform: translateY(-2px);
  }
  #${ID_BTN}:active { transform: translateY(0) scale(0.98); }
  #${ID_BTN}:focus-visible {
    outline: 2px solid var(--brand-blue, #3B82F6);
    outline-offset: 3px;
  }
  #${ID_BTN} .mn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px; height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3B82F6, #38BDF8);
    color: #0a0a0a;
    font-size: 13px;
  }

  /* ---- Backdrop + modal shell ---- */
  #${ID_MODAL} {
    position: fixed;
    inset: 0;
    z-index: ${Z_MODAL};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(4, 5, 10, 0.62);
    backdrop-filter: blur(12px) saturate(120%);
    -webkit-backdrop-filter: blur(12px) saturate(120%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
  #${ID_MODAL}.is-open {
    opacity: 1;
    pointer-events: auto;
  }
  #${ID_MODAL} .mn-panel {
    position: relative;
    width: 100%;
    max-width: 520px;
    max-height: calc(100vh - 48px);
    overflow: hidden auto;
    background: linear-gradient(180deg, #0d0f18 0%, #080a12 100%);
    border: 1px solid rgba(255, 255, 255, 0.10);
    border-radius: 24px;
    box-shadow:
      0 40px 120px -30px rgba(0, 0, 0, 0.9),
      0 0 100px -30px rgba(59, 130, 246, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    color: #fff;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    transform: translateY(12px) scale(0.98);
    opacity: 0;
    transition:
      transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.3s ease;
  }
  #${ID_MODAL}.is-open .mn-panel {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  /* Decorative glow */
  #${ID_MODAL} .mn-panel::before {
    content: '';
    position: absolute;
    top: -1px; left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.7), transparent);
    pointer-events: none;
  }

  /* ---- Header ---- */
  #${ID_MODAL} .mn-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 22px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  #${ID_MODAL} .mn-title {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
  }
  #${ID_MODAL} .mn-sub {
    font-size: 12.5px;
    color: #8a8a8a;
    margin: 0;
    line-height: 1.5;
  }
  #${ID_MODAL} .mn-close {
    flex-shrink: 0;
    width: 34px; height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    color: #cfcfcf;
    cursor: pointer;
    font-size: 15px;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  }
  #${ID_MODAL} .mn-close:hover {
    background: rgba(255, 255, 255, 0.10);
    color: #fff;
    transform: rotate(90deg);
  }

  /* ---- Page grid ---- */
  #${ID_MODAL} .mn-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 16px 16px 20px;
  }
  #${ID_MODAL} .mn-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 14px;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 14px;
    color: #fff;
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: -0.01em;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  #${ID_MODAL} .mn-item:hover {
    background: rgba(59, 130, 246, 0.10);
    border-color: rgba(59, 130, 246, 0.40);
    transform: translateY(-2px);
  }
  #${ID_MODAL} .mn-item:focus-visible {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
  #${ID_MODAL} .mn-item.is-current {
    background: rgba(59, 130, 246, 0.14);
    border-color: rgba(59, 130, 246, 0.55);
    box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.15);
    cursor: default;
  }
  #${ID_MODAL} .mn-item.is-current:hover { transform: none; }

  #${ID_MODAL} .mn-item-icon {
    flex-shrink: 0;
    width: 36px; height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(56, 189, 248, 0.14));
    border: 1px solid rgba(59, 130, 246, 0.28);
    color: #7dd3fc;
    font-size: 16px;
  }
  #${ID_MODAL} .mn-item.is-current .mn-item-icon {
    background: linear-gradient(135deg, #3B82F6, #38BDF8);
    border-color: transparent;
    color: #0a0a0a;
  }
  #${ID_MODAL} .mn-item-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #${ID_MODAL} .mn-item-badge {
    position: absolute;
    top: 8px;
    inset-inline-end: 10px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 7px;
    border-radius: 999px;
    background: rgba(59, 130, 246, 0.22);
    border: 1px solid rgba(59, 130, 246, 0.45);
    color: #93c5fd;
  }
  #${ID_MODAL} .mn-item-arrow {
    flex-shrink: 0;
    font-size: 14px;
    color: #5c5c5c;
    transition: transform 0.25s ease, color 0.2s ease;
  }
  #${ID_MODAL} .mn-item:hover .mn-item-arrow {
    color: #7dd3fc;
    transform: translateX(3px);
  }
  html[dir="rtl"] #${ID_MODAL} .mn-item:hover .mn-item-arrow {
    transform: translateX(-3px) scaleX(-1);
  }
  html[dir="rtl"] #${ID_MODAL} .mn-item-arrow {
    transform: scaleX(-1);
  }

  /* ---- Footnote ---- */
  #${ID_MODAL} .mn-foot {
    padding: 0 22px 20px;
    font-size: 11px;
    color: #5c5c5c;
    text-align: center;
    letter-spacing: 0.02em;
  }

  /* ---- Mobile ---- */
  @media (max-width: 520px) {
    #${ID_MODAL} .mn-grid { grid-template-columns: 1fr; }
    #${ID_BTN} .mn-label { display: none; }
    #${ID_BTN} { padding: 10px; }
    #${ID_BTN} .mn-icon { width: 28px; height: 28px; font-size: 14px; }
  }

  @media (prefers-reduced-motion: reduce) {
    #${ID_BTN}, #${ID_MODAL}, #${ID_MODAL} .mn-panel, #${ID_MODAL} .mn-item {
      transition-duration: 0.001ms !important;
    }
  }
  `;

  /* ---------------------------------------------------------------------
     4) DOM BUILDING
     --------------------------------------------------------------------- */
  let btnEl = null;
  let modalEl = null;
  let panelEl = null;
  let lastFocused = null;

  function injectStyle() {
    if (document.getElementById(ID_STYLE)) return;
    const s = document.createElement("style");
    s.id = ID_STYLE;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function buildTrigger() {
    if (document.getElementById(ID_BTN)) return;
    btnEl = document.createElement("button");
    btnEl.id = ID_BTN;
    btnEl.type = "button";
    btnEl.setAttribute("aria-haspopup", "dialog");
    btnEl.setAttribute("aria-controls", ID_MODAL);
    btnEl.setAttribute("aria-label", t("title"));
    btnEl.innerHTML = `
      <span class="mn-icon"><i class="bi bi-grid-3x3-gap-fill"></i></span>
      <span class="mn-label">${escapeHtml(t("trigger"))}</span>
    `;
    btnEl.addEventListener("click", open);
    document.body.appendChild(btnEl);
  }

  function buildModal() {
    if (document.getElementById(ID_MODAL)) return;
    modalEl = document.createElement("div");
    modalEl.id = ID_MODAL;
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-labelledby", ID_MODAL + "-title");
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `<div class="mn-panel" role="document"></div>`;
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) close();
    });
    document.body.appendChild(modalEl);
    panelEl = modalEl.querySelector(".mn-panel");
  }

  function render() {
    if (!panelEl) return;
    const L = lang();
    const here = currentFile();

    const items = PAGES.map(function (p) {
      const label = L === "ar" ? p.labelAr || p.label : p.label || p.labelAr;
      const isCurrent = samePage(p.href);
      return `
        <a class="mn-item ${isCurrent ? "is-current" : ""}"
           href="${isCurrent ? "javascript:void(0)" : escapeHtml(p.href)}"
           ${isCurrent ? 'aria-current="page" tabindex="-1"' : ""}
           data-key="${escapeHtml(p.key)}">
          <span class="mn-item-icon"><i class="bi ${escapeHtml(p.icon || "bi-circle")}"></i></span>
          <span class="mn-item-label">${escapeHtml(label)}</span>
          ${
            isCurrent
              ? `<span class="mn-item-badge">${escapeHtml(t("current"))}</span>`
              : `<i class="bi bi-arrow-right-short mn-item-arrow" aria-hidden="true"></i>`
          }
        </a>
      `;
    }).join("");

    panelEl.innerHTML = `
      <div class="mn-head">
        <div>
          <h2 class="mn-title" id="${ID_MODAL}-title">${escapeHtml(t("title"))}</h2>
          <p class="mn-sub">${escapeHtml(t("subtitle"))}</p>
        </div>
        <button class="mn-close" type="button" aria-label="${escapeHtml(t("close"))}">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="mn-grid">${items}</div>
      <div class="mn-foot">${escapeHtml(here)}</div>
    `;

    const closeBtn = panelEl.querySelector(".mn-close");
    if (closeBtn) closeBtn.addEventListener("click", close);
  }

  /* ---------------------------------------------------------------------
     5) OPEN / CLOSE
     --------------------------------------------------------------------- */
  function onKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    // Focus trap
    const focusables = panelEl.querySelectorAll(
      'a[href]:not([tabindex="-1"]), button:not([disabled])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open() {
    if (!modalEl) buildModal();
    if (!modalEl) return;
    lastFocused = document.activeElement;
    render();
    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", onKeydown);
    // Lock scroll
    document.documentElement.style.overflow = "hidden";
    // Focus first interactive element
    requestAnimationFrame(function () {
      const focusables = panelEl.querySelectorAll(
        'a[href]:not([tabindex="-1"]), button:not([disabled])',
      );
      (focusables[0] || panelEl).focus?.();
    });
  }

  function close() {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onKeydown);
    document.documentElement.style.overflow = "";
    if (lastFocused && lastFocused.focus) {
      try {
        lastFocused.focus({ preventScroll: true });
      } catch (e) {
        /* noop */
      }
    }
  }

  function toggle() {
    if (modalEl && modalEl.classList.contains("is-open")) close();
    else open();
  }

  /* ---------------------------------------------------------------------
     6) LANGUAGE SYNC
     --------------------------------------------------------------------- */
  document.addEventListener("matager:languagechange", function () {
    // Update trigger label + aria and re-render modal contents
    if (btnEl) {
      const labelEl = btnEl.querySelector(".mn-label");
      if (labelEl) labelEl.textContent = t("trigger");
      btnEl.setAttribute("aria-label", t("title"));
    }
    if (modalEl && modalEl.classList.contains("is-open")) render();
  });

  /* ---------------------------------------------------------------------
     7) BOOT
     --------------------------------------------------------------------- */
  function boot() {
    injectStyle();
    buildTrigger();
    buildModal();
    render(); // pre-render so first open is instant
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* ---------------------------------------------------------------------
     8) PUBLIC API
     --------------------------------------------------------------------- */
  global.MatagerNav = {
    get pages() {
      return PAGES;
    },
    open: open,
    close: close,
    toggle: toggle,
    refresh: render,
    add: function (page) {
      if (!page || !page.href || !page.key) return;
      PAGES.push(page);
      render();
    },
  };
})(window);
