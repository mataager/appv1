/* ============================================================
   ALERT / NOTIFICATION SYSTEM
   - Reusable for ANY type via showAlert()
   - Uses a pill that slides out from under the nav button
   - Supports loading → success/error chaining
   ============================================================ */

const alertConfiguration = {
  cart: { heading: "Added to Cart", icon: "bi-bag-check-fill", state: "cart" },
  auth: { heading: "Security", icon: "bi-shield-lock-fill", state: "auth" },
  success: {
    heading: "Success",
    icon: "bi-check-circle-fill",
    state: "success",
  },
  logout: { heading: "Session", icon: "bi-door-open-fill", state: "logout" },
  favorite: { heading: "Wishlist", icon: "bi-heart-fill", state: "favorite" },
  shipping: { heading: "Delivery", icon: "bi-truck", state: "shipping" },
  reminder: {
    heading: "Restock Alert",
    icon: "bi-bell-fill",
    state: "reminder",
  },
  error: { heading: "Error", icon: "bi-x-circle-fill", state: "error" },
  info: { heading: "Info", icon: "bi-info-circle-fill", state: "info" },
  warning: {
    heading: "Warning",
    icon: "bi-exclamation-triangle-fill",
    state: "warning",
  },
  loading: { heading: "Loading", icon: null, state: "loading" },
};

let systemNotificationsList = [];
let _navAlertTimer = null; // auto-dismiss timer
let _navAlertHideTimer = null; // post-animation removal timer

/* ------------------------------------------------------------
   Themed pill controller
   ------------------------------------------------------------ */
function _getNavAlertEls() {
  const pill = document.getElementById("nav-alert-pill");
  if (!pill) return null;
  return {
    pill,
    iconSlot: pill.querySelector(".nav-alert-icon-slot"),
    title: pill.querySelector(".nav-alert-title"),
    message: pill.querySelector(".nav-alert-message"),
    dismiss: pill.querySelector(".nav-alert-dismiss"),
  };
}

/**
 * showNavAlert — the low-level primitive.
 * Accepts either an options object OR (type, title, message).
 */
function showNavAlert(typeOrOptions, titleOrMessage, maybeMessage) {
  let opts;

  if (typeof typeOrOptions === "object" && typeOrOptions !== null) {
    opts = { ...typeOrOptions };
  } else {
    opts = { type: typeOrOptions };
    if (maybeMessage !== undefined) {
      opts.title = titleOrMessage;
      opts.message = maybeMessage;
    } else {
      opts.message = titleOrMessage;
    }
  }

  const type = opts.type || "info";
  const cfg = alertConfiguration[type] || alertConfiguration.info;
  const title = opts.title ?? cfg.heading;
  const message = opts.message ?? "";
  const duration = opts.duration !== undefined ? opts.duration : 4000;
  const state = opts.state || cfg.state || "info";

  const els = _getNavAlertEls();
  if (!els) return null;

  // Cancel any pending timers from a previous alert
  if (_navAlertTimer) {
    clearTimeout(_navAlertTimer);
    _navAlertTimer = null;
  }
  if (_navAlertHideTimer) {
    clearTimeout(_navAlertHideTimer);
    _navAlertHideTimer = null;
  }

  // ----- Icon -----
  els.iconSlot.dataset.state = state;
  els.iconSlot.innerHTML = "";

  if (state === "loading" || opts.loading === true) {
    const sp = document.createElement("span");
    sp.className = "nav-alert-spinner";
    els.iconSlot.appendChild(sp);
  } else {
    const i = document.createElement("i");
    i.className = "bi " + (opts.icon || cfg.icon || "bi-bell-fill");
    els.iconSlot.appendChild(i);
  }

  // ----- Text -----
  els.title.textContent = title;
  els.message.textContent = message;

  // Long message → marquee
  els.message.classList.remove("is-marquee");
  els.message.style.removeProperty("--marquee-shift");
  requestAnimationFrame(() => {
    const overflow = els.message.scrollWidth - els.message.clientWidth;
    if (overflow > 4) {
      els.message.style.setProperty("--marquee-shift", `-${overflow + 16}px`);
      els.message.classList.add("is-marquee");
    }
  });

  // ----- Show -----
  // Force reflow so the transition always runs
  void els.pill.offsetWidth;
  els.pill.classList.add("is-visible");

  // ----- Auto-dismiss (skipped for loading & explicit duration:0) -----
  if (duration > 0) {
    _navAlertTimer = setTimeout(() => hideNavAlert(), duration);
  }

  return {
    update: (next) => {
      // Used to turn a loading pill into success/error without re-sliding.
      const merged = typeof next === "object" && next ? next : {};
      return showNavAlert({
        type: merged.type || type,
        title: merged.title ?? title,
        message: merged.message ?? message,
        state: merged.state,
        icon: merged.icon,
        loading: merged.loading,
        duration: merged.duration !== undefined ? merged.duration : duration,
      });
    },
    dismiss: hideNavAlert,
  };
}

function hideNavAlert() {
  const els = _getNavAlertEls();
  if (!els) return;
  if (_navAlertTimer) {
    clearTimeout(_navAlertTimer);
    _navAlertTimer = null;
  }

  els.pill.classList.remove("is-visible");

  // Wait for the slide-out transition, then clean up the text
  _navAlertHideTimer = setTimeout(() => {
    els.title.textContent = "";
    els.message.textContent = "";
    els.message.classList.remove("is-marquee");
    els.iconSlot.innerHTML = "";
    els.iconSlot.dataset.state = "idle";
  }, 600);
}

/**
 * showAlert — the PUBLIC, fully-reusable entry point.
 *
 * Usage:
 *   showAlert('cart', 'Item added to bag');
 *   showAlert('success', 'Payment Complete', 'Order #8822 confirmed');
 *   showAlert({ type: 'error', title: 'Oops', message: 'Card declined', duration: 5000 });
 *   const a = showAlert({ type: 'loading', title: 'Processing', duration: 0 });
 *   setTimeout(() => a.update({ type: 'success', title: 'Done', message: 'Saved!' }), 1500);
 */
function showAlert(typeOrOptions, titleOrMessage, maybeMessage) {
  let opts;

  if (typeof typeOrOptions === "object" && typeOrOptions !== null) {
    opts = { ...typeOrOptions };
  } else {
    opts = { type: typeOrOptions };
    if (maybeMessage !== undefined) {
      opts.title = titleOrMessage;
      opts.message = maybeMessage;
    } else {
      opts.message = titleOrMessage;
    }
  }

  // 1) Push to the notification tray (keeps existing behaviour)
  if (opts.saveToTray !== false) {
    systemNotificationsList.unshift({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: opts.type || "info",
      time: "Just Now",
      text: [opts.title, opts.message].filter(Boolean).join(" — "),
      isRead: false,
    });
    if (typeof renderNotificationViewTray === "function") {
      renderNotificationViewTray();
    }
  }

  // 2) Show the pill
  return showNavAlert(opts);
}

/* ------------------------------------------------------------
   Dismiss button wiring
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const els = _getNavAlertEls();
  if (els?.dismiss) {
    els.dismiss.addEventListener("click", (e) => {
      e.stopPropagation();
      hideNavAlert();
    });
  }
  if (typeof renderNotificationViewTray === "function") {
    renderNotificationViewTray();
  }
});

/* ============================================================
   TEST HELPERS  —  remove before production
   ============================================================ */

// Fake async action
function _fakeAsync(ms = 1600, fail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (fail ? reject(new Error("network")) : resolve("ok")), ms);
  });
}

// Loading → Success
function testLoadingSuccess() {
  const handle = showAlert({
    type: "loading",
    title: "Processing",
    message: "Please wait…",
    duration: 0,
  });

  _fakeAsync(1600, false)
    .then(() =>
      handle.update({
        type: "success",
        title: "Done",
        message: "Saved successfully!",
      }),
    )
    .catch(() =>
      handle.update({
        type: "error",
        title: "Failed",
        message: "Something went wrong.",
      }),
    );
}

// Loading → Error
function testLoadingError() {
  const handle = showAlert({
    type: "loading",
    title: "Uploading",
    message: "Sending your data…",
    duration: 0,
  });

  _fakeAsync(1600, true)
    .then(() =>
      handle.update({ type: "success", title: "Done", message: "Uploaded!" }),
    )
    .catch(() =>
      handle.update({
        type: "error",
        title: "Upload Failed",
        message: "Check your connection and retry.",
      }),
    );
}

// Persistent pill — only dismissed manually
function testPersistentDismiss() {
  showAlert({
    type: "warning",
    title: "Action Required",
    message: "Click the ✕ on the pill to dismiss.",
    duration: 0, // stays until dismissed
  });
}

// Cycle through every configured type
function testCycleTypes() {
  const types = [
    "cart",
    "auth",
    "success",
    "logout",
    "favorite",
    "shipping",
    "reminder",
    "error",
    "info",
    "warning",
  ];
  let i = 0;
  const tick = () => {
    if (i >= types.length) return;
    const t = types[i++];
    const cfg = alertConfiguration[t] || {};
    showAlert({
      type: t,
      title: cfg.heading || t,
      message: `Demo message for "${t}" type.`,
      duration: 1800,
    });
    setTimeout(tick, 1900);
  };
  tick();
}
