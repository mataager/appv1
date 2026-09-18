/* =========================================================================
   Matager Reveal — High-end scroll reveal engine (v1.0)
   File: assets/functions/reveal.js
   -------------------------------------------------------------------------
   Drop-in usage:
     <script src="./assets/functions/reveal.js"></script>   (in <head>)

     <div data-reveal="up">Fades up</div>
     <h1 data-reveal="words">Split into words</h1>
     <div data-reveal-stagger="120">
       <div data-reveal="up">A</div>
       <div data-reveal="up">B</div>
     </div>

   API:
     MatagerReveal.refresh()   -> re-scan the DOM
     MatagerReveal.observe(el) -> observe one element
     MatagerReveal.reveal(el)  -> force reveal now
     MatagerReveal.reset(el)   -> reset to hidden
     MatagerReveal.types       -> supported types

   Events:
     'matager:reveal' -> { detail: { el } }
   ========================================================================= */

(function (global) {
  "use strict";

  const ATTR = "data-reveal";
  const STAGGER = "data-reveal-stagger";
  const IN_CLASS = "mr-in";
  const STYLE_ID = "matager-reveal-style";

  const DEFAULTS = {
    type: "up",
    duration: 900,
    delay: 0,
    distance: 40,
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px",
    once: true,
    stagger: 80,
    maxStagger: 900,
    wordStagger: 40,
    wordStaggerMax: 1200,
  };

  const VALID_TYPES = [
    "up",
    "down",
    "left",
    "right",
    "fade",
    "scale",
    "zoom",
    "blur",
    "blur-scale",
    "rotate",
    "flip-x",
    "flip-y",
    "mask-up",
    "mask-down",
    "mask-left",
    "mask-right",
    "words",
    "chars",
  ];
  const TEXT_TYPES = ["words", "chars"];

  /* ======================================================================
     INJECTED CSS
     ====================================================================== */
  const CSS = `
  [data-reveal] {
    --mr-duration: 900ms;
    --mr-delay: 0ms;
    --mr-ease: cubic-bezier(0.16, 1, 0.3, 1);
    --mr-dist: 40px;
    --mr-persp: 2000px;

    --mr-tx: 0px;  --mr-ty: 0px;
    --mr-sx: 1;
    --mr-rot: 0deg; --mr-rx: 0deg; --mr-ry: 0deg;
    --mr-blur: 0px;
    --mr-op: 1;
    --mr-clip: inset(0 0 0 0);

    opacity: var(--mr-op);
    transform:
      perspective(var(--mr-persp))
      translate3d(var(--mr-tx), var(--mr-ty), 0)
      scale(var(--mr-sx))
      rotate(var(--mr-rot))
      rotateX(var(--mr-rx))
      rotateY(var(--mr-ry));
    filter: blur(var(--mr-blur));
    clip-path: var(--mr-clip);
    backface-visibility: hidden;
    transition:
      opacity   var(--mr-duration) var(--mr-ease) var(--mr-delay),
      transform var(--mr-duration) var(--mr-ease) var(--mr-delay),
      filter    var(--mr-duration) var(--mr-ease) var(--mr-delay),
      clip-path var(--mr-duration) var(--mr-ease) var(--mr-delay);
  }

  /* --- from-states --- */
  [data-reveal="up"]         { --mr-ty: var(--mr-dist);            --mr-op: 0; }
  [data-reveal="down"]       { --mr-ty: calc(-1 * var(--mr-dist)); --mr-op: 0; }
  [data-reveal="left"]       { --mr-tx: calc(-1 * var(--mr-dist)); --mr-op: 0; }
  [data-reveal="right"]      { --mr-tx: var(--mr-dist);            --mr-op: 0; }
  [data-reveal="fade"]       { --mr-op: 0; }
  [data-reveal="scale"]      { --mr-sx: 0.92; --mr-op: 0; }
  [data-reveal="zoom"]       { --mr-sx: 1.08; --mr-op: 0; }
  [data-reveal="blur"]       { --mr-blur: 14px; --mr-op: 0; }
  [data-reveal="blur-scale"] { --mr-blur: 14px; --mr-sx: 0.96; --mr-op: 0; }
  [data-reveal="rotate"]     { --mr-ty: var(--mr-dist); --mr-rot: -5deg; --mr-op: 0;
                               transform-origin: left bottom; }
  [data-reveal="flip-x"]     { --mr-rx: -75deg; --mr-op: 0;
                               transform-origin: center top;   --mr-persp: 1200px; }
  [data-reveal="flip-y"]     { --mr-ry: -75deg; --mr-op: 0;
                               transform-origin: left center;  --mr-persp: 1200px; }

  [data-reveal="mask-up"]    { --mr-clip: inset(100% 0 0 0); }
  [data-reveal="mask-down"]  { --mr-clip: inset(0 0 100% 0); }
  [data-reveal="mask-left"]  { --mr-clip: inset(0 0 0 100%); }
  [data-reveal="mask-right"] { --mr-clip: inset(0 100% 0 0); }

  /* --- text-split parents are always visible themselves --- */
  [data-reveal="words"],
  [data-reveal="chars"] {
    --mr-op: 1;
    --mr-tx: 0px; --mr-ty: 0px;
    --mr-sx: 1;
    --mr-rot: 0deg; --mr-rx: 0deg; --mr-ry: 0deg;
    --mr-blur: 0px;
    --mr-clip: inset(0 0 0 0);
    transform: none;
    filter: none;
    clip-path: none;
  }

  /* --- revealed state --- */
  [data-reveal].mr-in {
    --mr-tx: 0px; --mr-ty: 0px;
    --mr-sx: 1;
    --mr-rot: 0deg; --mr-rx: 0deg; --mr-ry: 0deg;
    --mr-blur: 0px;
    --mr-op: 1;
    --mr-clip: inset(0 0 0 0);
  }

  /* --- word/char wrappers --- */
  [data-reveal="words"] .mr-word,
  [data-reveal="chars"] .mr-char {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
    padding-bottom: 0.14em;
    margin-bottom: -0.14em;
  }

  [data-reveal="words"] .mr-wi,
  [data-reveal="chars"] .mr-ci {
    display: inline-block;
    transform: translate3d(0, 115%, 0) rotate(3deg);
    opacity: 0;
    transition:
      transform var(--mr-duration) var(--mr-ease),
      opacity   var(--mr-duration) var(--mr-ease);
    transition-delay: var(--mr-delay, 0ms);
  }

  [data-reveal="words"].mr-in .mr-wi,
  [data-reveal="chars"].mr-in .mr-ci {
    transform: translate3d(0, 0, 0) rotate(0deg);
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-reveal],
    [data-reveal="words"] .mr-wi,
    [data-reveal="chars"] .mr-ci {
      transition-duration: 0.001ms !important;
      transition-delay: 0ms !important;
    }
  }
  `;

  /* Inject CSS as early as possible — this prevents any flash of content. */
  (function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  })();

  /* ======================================================================
     OBSERVERS  (one IO per threshold|rootMargin combo — fastest possible)
     ====================================================================== */
  const observerCache = new Map();

  function getObserver(threshold, rootMargin) {
    const key = threshold + "|" + rootMargin;
    let io = observerCache.get(key);
    if (io) return io;

    io = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const el = entry.target;

          if (entry.isIntersecting) {
            if (!el.classList.contains(IN_CLASS)) {
              el.classList.add(IN_CLASS);
              document.dispatchEvent(
                new CustomEvent("matager:reveal", { detail: { el } }),
              );
            }
            if (el.__mr_once !== false) io.unobserve(el);
          } else if (el.__mr_once === false) {
            el.classList.remove(IN_CLASS);
          }
        }
      },
      { threshold, rootMargin },
    );

    observerCache.set(key, io);
    return io;
  }

  /* ======================================================================
     CONFIG
     ====================================================================== */
  function readConfig(el) {
    const num = (name, fallback) => {
      const v = el.getAttribute(name);
      if (v == null || v === "") return fallback;
      const n = parseFloat(v);
      return isNaN(n) ? fallback : n;
    };
    return {
      type: el.getAttribute(ATTR) || DEFAULTS.type,
      duration: num("data-reveal-duration", DEFAULTS.duration),
      delay: num("data-reveal-delay", DEFAULTS.delay),
      distance: num("data-reveal-distance", DEFAULTS.distance),
      ease: el.getAttribute("data-reveal-ease") || DEFAULTS.ease,
      threshold: num("data-reveal-threshold", DEFAULTS.threshold),
      rootMargin:
        el.getAttribute("data-reveal-root-margin") || DEFAULTS.rootMargin,
      once: el.getAttribute("data-reveal-once") !== "false",
    };
  }

  function applyConfig(el, cfg) {
    const st = el.style;
    st.setProperty("--mr-duration", cfg.duration + "ms");
    st.setProperty("--mr-delay", cfg.delay + "ms");
    st.setProperty("--mr-distance", cfg.distance + "px");
    st.setProperty("--mr-ease", cfg.ease);
    el.__mr_once = cfg.once;
  }

  /* ======================================================================
     TEXT SPLIT (preserves <br>, <span>, <em>, etc.)
     ====================================================================== */
  function splitText(el, mode) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.nodeValue && node.nodeValue.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach((textNode) => {
      const text = textNode.nodeValue;
      const frag = document.createDocumentFragment();

      if (mode === "chars") {
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (/\s/.test(ch)) {
            frag.appendChild(document.createTextNode(ch));
          } else {
            const c = document.createElement("span");
            c.className = "mr-char";
            const ci = document.createElement("span");
            ci.className = "mr-ci";
            ci.textContent = ch;
            c.appendChild(ci);
            frag.appendChild(c);
          }
        }
      } else {
        const parts = text.split(/(\s+)/);
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const w = document.createElement("span");
            w.className = "mr-word";
            const wi = document.createElement("span");
            wi.className = "mr-wi";
            wi.textContent = part;
            w.appendChild(wi);
            frag.appendChild(w);
          }
        }
      }

      textNode.parentNode.replaceChild(frag, textNode);
    });

    /* per-unit stagger */
    const unitClass = mode === "chars" ? ".mr-ci" : ".mr-wi";
    const units = el.querySelectorAll(unitClass);
    const step = parseFloat(el.getAttribute(STAGGER)) || DEFAULTS.wordStagger;
    const cap =
      parseFloat(el.getAttribute("data-reveal-stagger-max")) ||
      DEFAULTS.wordStaggerMax;
    for (let i = 0; i < units.length; i++) {
      units[i].style.setProperty("--mr-delay", Math.min(i * step, cap) + "ms");
    }
  }

  /* ======================================================================
     STAGGER CONTAINER — auto-assigns data-reveal + delay to children
     ====================================================================== */
  function initStaggerContainer(container) {
    const step =
      parseFloat(container.getAttribute(STAGGER)) || DEFAULTS.stagger;
    const max =
      parseFloat(container.getAttribute("data-reveal-stagger-max")) ||
      DEFAULTS.maxStagger;
    const type =
      container.getAttribute("data-reveal-stagger-type") || DEFAULTS.type;
    const kids = container.children;

    for (let i = 0; i < kids.length; i++) {
      const c = kids[i];
      if (!c.hasAttribute(ATTR)) c.setAttribute(ATTR, type);
      if (!c.hasAttribute("data-reveal-delay")) {
        c.setAttribute("data-reveal-delay", String(Math.min(i * step, max)));
      }
    }
  }

  /* ======================================================================
     INIT / SCAN
     ====================================================================== */
  function initElement(el) {
    if (el.__mr_init) return;
    el.__mr_init = true;

    const cfg = readConfig(el);
    applyConfig(el, cfg);

    if (TEXT_TYPES.indexOf(cfg.type) !== -1) splitText(el, cfg.type);

    getObserver(cfg.threshold, cfg.rootMargin).observe(el);
  }

  function scan(root) {
    root = root || document;
    root.querySelectorAll("[" + STAGGER + "]").forEach(initStaggerContainer);
    root.querySelectorAll("[" + ATTR + "]").forEach(initElement);

    if (root !== document && root.matches && root.matches("[" + ATTR + "]")) {
      initElement(root);
    }
  }

  /* ======================================================================
     MUTATION OBSERVER — auto-handles dynamically injected content
     ====================================================================== */
  const pending = new Set();
  let scheduled = false;

  function scheduleScan(node) {
    pending.add(node);
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      const roots = Array.from(pending);
      pending.clear();
      roots.forEach(scan);
    });
  }

  function startMutationObserver() {
    if (!global.MutationObserver || !document.body) return;
    new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        const added = mutations[i].addedNodes;
        for (let j = 0; j < added.length; j++) {
          const node = added[j];
          if (node.nodeType === 1) scheduleScan(node);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function boot() {
    scan(document);
    startMutationObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* ======================================================================
     PUBLIC API
     ====================================================================== */
  global.MatagerReveal = {
    types: VALID_TYPES.slice(),
    defaults: DEFAULTS,
    refresh: () => scan(document),
    observe: initElement,
    reveal: (el) => {
      el.classList.add(IN_CLASS);
      document.dispatchEvent(
        new CustomEvent("matager:reveal", { detail: { el } }),
      );
    },
    reset: (el) => el.classList.remove(IN_CLASS),
  };
})(window);
