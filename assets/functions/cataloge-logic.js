/* ============================================================
   CATALOG LOGIC  ·  Matager
   Handles: dynamic row layout by product count,
            category filter switching, empty-state injection.
   Load AFTER the DOM (defer or bottom-of-body script tag).
   ============================================================ */

(function () {
  "use strict";

  /* --------------------------------------------------------
       CONFIG
       -------------------------------------------------------- */
  const ROW_CONFIG = {
    1: { w: 224, h: 280, containerH: 310 },
    2: { w: 200, h: 250, containerH: 540 },
    3: { w: 176, h: 220, containerH: 700 },
  };

  const THRESHOLDS = {
    ONE_ROW_MAX: 50, // 0  – 50   → 1 row
    TWO_ROW_MAX: 150, // 51 – 150  → 2 rows,  151+ → 3 rows
  };

  /* --------------------------------------------------------
       STATE
       -------------------------------------------------------- */
  let currentRows = 2;
  let currentCategory = "featured";
  let categoryTransitionTimer = null;

  /* --------------------------------------------------------
       HELPERS
       -------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function countProducts(gridEl) {
    if (!gridEl) return 0;
    return gridEl.querySelectorAll(".product-card").length;
  }

  function getCategoryName(categoryId) {
    const btn = $(`.category-btn[data-category="${categoryId}"]`);
    return btn ? btn.textContent.trim() : categoryId;
  }

  /* --------------------------------------------------------
       GRID SIZING
       -------------------------------------------------------- */
  function applyRowConfig(gridEl, rows) {
    if (!gridEl) return;
    const cfg = ROW_CONFIG[rows];
    if (!cfg) return;

    gridEl.style.height = cfg.containerH + "px";
    gridEl.querySelectorAll(".product-card").forEach((card) => {
      card.style.width = cfg.w + "px";
      card.style.height = cfg.h + "px";
    });
    gridEl.dataset.rows = rows;

    const stage = gridEl.closest(".product-grid-stage");
    if (stage && gridEl.classList.contains("visible-grid")) {
      stage.style.height = cfg.containerH + "px";
    }
  }

  function updateAllGrids(rows) {
    currentRows = rows;
    $$(".scroll-grid-x").forEach((g) => applyRowConfig(g, rows));

    const active = $(".scroll-grid-x.visible-grid");
    const stage = active && active.closest(".product-grid-stage");
    if (stage) stage.style.height = ROW_CONFIG[rows].containerH + "px";
  }

  /**
   * Decide target rows from a product count.
   *   0   – 50   → 1 row
   *   51  – 150  → 2 rows
   *   151+       → 3 rows
   */
  function rowsForCount(count) {
    if (count <= THRESHOLDS.ONE_ROW_MAX) return 1;
    if (count <= THRESHOLDS.TWO_ROW_MAX) return 2;
    return 3;
  }

  function reflectActiveToggle(rows) {
    $$(".grid-toggle-btn").forEach((btn) => {
      btn.classList.toggle("active", parseInt(btn.dataset.rows, 10) === rows);
    });
  }

  function updateGridLayoutByCount(count) {
    const targetRows = rowsForCount(count);
    reflectActiveToggle(targetRows);
    updateAllGrids(targetRows);
  }

  function setExploreGrid(rows) {
    const r = Math.min(3, Math.max(1, rows));
    if (r === currentRows) return;
    reflectActiveToggle(r);
    updateAllGrids(r);
  }

  /* --------------------------------------------------------
       EMPTY STATE
       -------------------------------------------------------- */
  function injectEmptyState(gridEl, categoryId) {
    if (!gridEl) return;

    // Remove existing empty state if present
    const existing = gridEl.querySelector(".catalog-empty-state");
    if (existing) existing.remove();

    const categoryName = getCategoryName(categoryId);
    const message = `No ${categoryName} exist right now`;

    const empty = document.createElement("div");
    empty.className = "catalog-empty-state";
    empty.setAttribute("role", "status");
    empty.setAttribute("aria-live", "polite");
    empty.innerHTML = `
            <div class="catalog-empty-inner">
                <div class="catalog-empty-icon">
                    <i class="bi bi-inbox"></i>
                </div>
                <p class="catalog-empty-title">${message}</p>
                <p class="catalog-empty-hint">Check back soon — new drops land often.</p>
            </div>
        `;
    gridEl.appendChild(empty);
  }

  /* --------------------------------------------------------
       FILTER / CATEGORY SWITCHING
       -------------------------------------------------------- */
  function filterProducts(targetId, btn) {
    if (!targetId) return;
    if (categoryTransitionTimer) {
      clearTimeout(categoryTransitionTimer);
      categoryTransitionTimer = null;
    }

    // Update active button state
    $$(".category-btn").forEach((b) => b.classList.remove("active"));
    if (btn) {
      btn.classList.add("active");
    } else {
      const targetBtn = $(`.category-btn[data-category="${targetId}"]`);
      if (targetBtn) targetBtn.classList.add("active");
    }

    if (currentCategory === targetId) return;
    currentCategory = targetId;

    /* — Text transition — */
    $$(".text-content-wrapper").forEach((w) => {
      if (w.classList.contains("active-text")) {
        w.classList.remove("active-text", "hidden-text");
        w.classList.add("exit-text");
        setTimeout(() => {
          if (!w.classList.contains("active-text")) {
            w.classList.remove("exit-text");
            w.classList.add("hidden-text");
          }
        }, 500);
      }
    });

    const tText = document.getElementById(`text-${targetId}`);
    if (tText) {
      tText.classList.remove("hidden-text", "exit-text");
      void tText.offsetWidth; // Force reflow
      tText.classList.add("active-text");
    }

    /* — Grid transition — */
    const currentGrid = $(".scroll-grid-x.visible-grid");
    const targetGrid = document.getElementById(`grid-${targetId}`);
    if (!targetGrid || currentGrid === targetGrid) return;

    if (currentGrid) {
      currentGrid.classList.remove("visible-grid");
      currentGrid.classList.add("grid-exit");
    }

    $$(".scroll-grid-x").forEach((g) => {
      if (g !== currentGrid && g !== targetGrid) {
        g.classList.remove("visible-grid", "grid-exit");
        g.classList.add("hidden-grid");
      }
    });

    targetGrid.classList.remove("hidden-grid", "grid-exit", "visible-grid");
    void targetGrid.offsetWidth; // Force reflow

    /* — Empty state / sizing based on count — */
    const itemCount = countProducts(targetGrid);
    if (itemCount === 0) {
      injectEmptyState(targetGrid, targetId);
    } else {
      const existing = targetGrid.querySelector(".catalog-empty-state");
      if (existing) existing.remove();
    }

    updateGridLayoutByCount(itemCount);

    targetGrid.classList.add("visible-grid");

    if (currentGrid) {
      categoryTransitionTimer = setTimeout(() => {
        currentGrid.classList.remove("grid-exit");
        currentGrid.classList.add("hidden-grid");
        categoryTransitionTimer = null;
      }, 520);
    }
  }

  /* --------------------------------------------------------
       INITIAL SETUP & EVENT LISTENERS
       -------------------------------------------------------- */
  function initialise() {
    // Attach event listeners to category buttons
    $$(".category-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const category = this.getAttribute("data-category");
        if (category) {
          filterProducts(category, this);
        }
      });
    });

    const initialGrid = $(".scroll-grid-x.visible-grid");
    const initialCount = initialGrid ? countProducts(initialGrid) : 24;

    if (initialGrid && initialCount === 0) {
      injectEmptyState(initialGrid, currentCategory);
    }
    updateGridLayoutByCount(initialCount);
  }

  /* --------------------------------------------------------
       EXPOSE GLOBAL API (used by inline onclick handlers)
       -------------------------------------------------------- */
  window.filterProducts = filterProducts;
  window.setExploreGrid = setExploreGrid;
  window.updateGridLayoutByCount = updateGridLayoutByCount;

  /* --------------------------------------------------------
       BOOTSTRAP
       -------------------------------------------------------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise);
  } else {
    initialise();
  }
})();
