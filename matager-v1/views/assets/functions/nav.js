/* ============================================================
   nav.js – Consolidated Floating Navigation
   ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // DATA & CONFIGURATION
  // ============================================================

  // Shipping addresses for cart delivery
  const shippingAddresses = [
    {
      id: "addr-1",
      shortName: "10th of Ramadan, Sharqia",
      costText: "Standard • EGP 50",
      costVal: 50,
      fullName: "10th of Ramadan City, Al-Sharqia",
    },
    {
      id: "addr-2",
      shortName: "El-Nasr St, Nasr City",
      costText: "Standard • EGP 35",
      costVal: 35,
      fullName: "Block 10, El-Nasr St, Nasr City, Cairo",
    },
    {
      id: "addr-3",
      shortName: "Smouha, Alexandria",
      costText: "Express • EGP 60",
      costVal: 60,
      fullName: "Victor Hamden St, Smouha, Alexandria",
    },
  ];

  const pickupBranches = [
    {
      id: "branch-1",
      city: "Cairo",
      costText: "Free • EGP 0",
      costVal: 0,
      fullName: "Main Branch, Cairo Heliopolis",
      mapsUrl: "https://maps.google.com",
    },
    {
      id: "branch-2",
      city: "Alexandria",
      costText: "Free • EGP 0",
      costVal: 0,
      fullName: "Alexandria Branch, Smouha",
      mapsUrl: "https://maps.google.com/?q=Smouha+Alexandria",
    },
    {
      id: "branch-3",
      city: "Mansoura",
      costText: "Free • EGP 0",
      costVal: 0,
      fullName: "Mansoura Branch, El-Gayeish St",
      mapsUrl: "https://maps.google.com/?q=Mansoura",
    },
  ];

  // Category store data for search
  const storeData = {
    Men: {
      Tops: ["T-Shirts", "Hoodies", "Shirts", "Jackets"],
      Bottoms: ["Jeans", "Cargo Pants", "Shorts", "Joggers"],
      Footwear: ["Sneakers", "Boots", "Running Shoes"],
    },
    Women: {
      Tops: ["Blouses", "Crop Tops", "Hoodies", "Knits"],
      Bottoms: ["Jeans", "Skirts", "Leggings", "Dresses"],
      Footwear: ["Heels", "Sneakers", "Sandals"],
    },
    Kids: {
      Tops: ["Graphic Tees", "Sweaters"],
      Bottoms: ["Shorts", "Tracksuits"],
      Footwear: ["Velcro Sneakers", "Slippers"],
    },
  };

  const mockItemCounts = {
    "T-Shirts": 23,
    Hoodies: 14,
    Shirts: 19,
    Jackets: 8,
    Jeans: 31,
    "Cargo Pants": 12,
    Shorts: 25,
    Joggers: 16,
    Sneakers: 42,
    Boots: 7,
    "Running Shoes": 18,
    Blouses: 22,
    "Crop Tops": 27,
    Knits: 0,
    Skirts: 15,
    Leggings: 34,
    Dresses: 29,
    Heels: 13,
    Sandals: 21,
    "Graphic Tees": 40,
    Sweaters: 9,
    Tracksuits: 5,
    "Velcro Sneakers": 14,
    Slippers: 12,
  };

  // Promo codes
  const availablePromos = {
    SAVE10: { discount: "10% off" },
    FREESHIP: { discount: "Free shipping" },
    WELCOME20: { discount: "20% off" },
    SUMMER25: { discount: "25% off" },
    FLASH15: { discount: "15% off" },
  };

  // Notification alert configurations
  const alertConfiguration = {
    cart: {
      heading: "Added to Cart",
      icon: "bi-bag-check-fill",
      color: "bg-emerald-500/20 text-emerald-400",
    },
    auth: {
      heading: "Security",
      icon: "bi-shield-lock-fill",
      color: "bg-blue-500/20 text-blue-400",
    },
    success: {
      heading: "Success",
      icon: "bi-check-circle-fill",
      color: "bg-emerald-500/20 text-emerald-400",
    },
    logout: {
      heading: "Session",
      icon: "bi-door-open-fill",
      color: "bg-orange-500/20 text-orange-400",
    },
    favorite: {
      heading: "Wishlist",
      icon: "bi-heart-fill",
      color: "bg-pink-500/20 text-pink-400",
    },
    shipping: {
      heading: "Delivery",
      icon: "bi-truck",
      color: "bg-indigo-500/20 text-indigo-400",
    },
    reminder: {
      heading: "Restock Alert",
      icon: "bi-bell-fill",
      color: "bg-amber-500/20 text-amber-400",
    },
  };

  // State variables
  let systemNotificationsList = [];
  let activePromoCode = null;
  let currentDeliveryType = "home";
  let activeAddressId = "addr-1";
  let activeBranchId = "branch-1";
  const baseCartTotal = 1290;
  let currentSearchMode = "products";
  let categorySelection = { gender: null, category: null, sub: null };
  let paymentFee = 0;

  // ============================================================
  // UTILITY / HELPERS
  // ============================================================

  function getElement(id) {
    return document.getElementById(id);
  }

  function isViewVisible(viewId) {
    const el = getElement(viewId);
    return (
      el && !el.classList.contains("hidden") && el.style.display !== "none"
    );
  }

  // ============================================================
  // NOTIFICATION SYSTEM
  // ============================================================

  function renderNotificationViewTray() {
    const listContainer = getElement("notification-scroll-container");
    if (!listContainer) return;
    if (systemNotificationsList.length === 0) {
      listContainer.innerHTML = `
        <div class="py-8 text-center text-xs text-black/30 dark:text-white/30 flex flex-col items-center gap-2">
          <i class="bi bi-bell-slash text-lg"></i>
          <span>No notifications available</span>
        </div>`;
      updateCountBadgePill();
      return;
    }
    listContainer.innerHTML = systemNotificationsList
      .map((item) => {
        const uiType = alertConfiguration[item.type] || alertConfiguration.auth;
        const unreadDot = item.isRead
          ? ""
          : '<span class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>';
        return `
        <div id="noti-card-${item.id}" onclick="event.stopPropagation(); toggleNotificationCardExpansion(${item.id})"
             class="group transition-all duration-300 ease-in-out cursor-pointer p-3 rounded-xl mb-2 card">
          <div class="flex items-start justify-between gap-3">
            <div class="flex gap-3 items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${uiType.color}">
                <i class="bi ${uiType.icon}"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-[11px] font-bold leading-tight txt2">${uiType.heading}</p>
                  ${unreadDot}
                </div>
                <p class="text-[9px] mt-0.5 txt2">${item.time}</p>
              </div>
            </div>
            <i id="chevron-icon-${item.id}" class="bi bi-chevron-down text-[10px] text-black/30 dark:text-white/30 group-hover:text-black/60 dark:group-hover:text-white/60 transition-transform duration-300"></i>
          </div>
          <div id="noti-details-${item.id}" class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
            <div class="pt-2 mt-2 border-t border-gray-200 dark:border-white/5">
              <p class="text-[11px] text-black/70 dark:text-white/70 leading-relaxed font-normal">${item.text}</p>
            </div>
          </div>
        </div>`;
      })
      .join("");
    updateCountBadgePill();
  }

  function toggleNotificationCardExpansion(notificationId) {
    const details = getElement(`noti-details-${notificationId}`);
    const chevron = getElement(`chevron-icon-${notificationId}`);
    const record = systemNotificationsList.find((n) => n.id === notificationId);
    if (!details) return;
    if (details.style.maxHeight && details.style.maxHeight !== "0px") {
      details.style.maxHeight = "0px";
      if (chevron) chevron.style.transform = "rotate(0deg)";
    } else {
      details.style.maxHeight = details.scrollHeight + "px";
      if (chevron) chevron.style.transform = "rotate(180deg)";
      if (record && !record.isRead) {
        record.isRead = true;
        setTimeout(() => {
          renderNotificationViewTray();
          const freshDetails = getElement(`noti-details-${notificationId}`);
          const freshChevron = getElement(`chevron-icon-${notificationId}`);
          if (freshDetails) {
            freshDetails.style.transition = "none";
            freshDetails.style.maxHeight = freshDetails.scrollHeight + "px";
            if (freshChevron) freshChevron.style.transform = "rotate(180deg)";
            setTimeout(() => (freshDetails.style.transition = ""), 50);
          }
        }, 450);
      }
    }
  }

  function updateCountBadgePill() {
    const unread = systemNotificationsList.filter((n) => !n.isRead).length;
    const badge = getElement("notification-badge-counter");
    if (badge) {
      badge.textContent = `${unread} Unread`;
      if (unread === 0) {
        badge.className =
          "text-[10px] font-bold text-black/30 dark:text-white/30 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 transition-all";
      } else {
        badge.className =
          "text-[10px] font-bold text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg bg-blue-500/10 transition-all";
      }
    }
  }

  function markAllNotificationsAsRead() {
    systemNotificationsList.forEach((n) => (n.isRead = true));
    renderNotificationViewTray();
  }

  function clearAllNotifications() {
    systemNotificationsList = [];
    renderNotificationViewTray();
  }

  function showAlert(type, message) {
    const newNotif = {
      id: Date.now(),
      type: type,
      time: "Just Now",
      text: message,
      isRead: false,
    };
    systemNotificationsList.unshift(newNotif);
    renderNotificationViewTray();

    const target = getElement("dynamic-alert-target-zone");
    if (!target) return;
    const config = alertConfiguration[type] || alertConfiguration.auth;
    const id = `alert-node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const html = `
      <div id="${id}" class="glass backdrop-blur-xl w-full w-[90%] max-w-[30rem] rounded-[30px] pointer-events-auto border border-white/10 shadow-2xl overflow-hidden transition-all alertbg duration-500 ease-in-out opacity-0 -translate-y-4 scale-95 transform">
        <div class="px-5 py-3.5 flex items-center gap-4 bg-black/20 backdrop-blur-xl">
          <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.color}">
            <i class="bi ${config.icon} text-sm"></i>
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5 leading-none">${config.heading}</p>
            <div class="relative overflow-hidden h-4 flex items-center text-box-wrapper">
              <p class="alert-msg-text text-[11px] text-white/70 whitespace-nowrap absolute left-0 leading-tight will-change-transform">${message}</p>
            </div>
          </div>
        </div>
      </div>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const alertEl = doc.getElementById(id);
    const existing = target.querySelector('[id^="alert-node-"]');
    if (existing) existing.remove();
    target.appendChild(alertEl);
    requestAnimationFrame(() => {
      setTimeout(() => {
        alertEl.classList.remove("opacity-0", "-translate-y-4", "scale-95");
        alertEl.classList.add("opacity-100", "translate-y-0", "scale-100");
      }, 20);
    });
    setTimeout(() => {
      const msg = alertEl.querySelector(".alert-msg-text");
      if (msg) {
        const cw = msg.parentElement.clientWidth;
        const tw = msg.scrollWidth;
        const overflow = tw - cw;
        if (overflow > 0 && cw > 0) {
          msg.style.transition = "transform 3.5s linear";
          msg.style.transform = `translateX(-${overflow + 20}px)`;
        }
      }
    }, 600);
    setTimeout(() => {
      if (document.getElementById(id)) {
        alertEl.classList.remove("opacity-100", "translate-y-0", "scale-100");
        alertEl.classList.add("opacity-0", "-translate-y-2", "scale-95");
        setTimeout(() => alertEl.remove(), 500);
      }
    }, 4500);
  }

  // ============================================================
  // CART FUNCTIONS
  // ============================================================

  function synchronizeCartItemCount() {
    const rows = document.querySelectorAll(".cart-item-row");
    let total = 0;
    rows.forEach((row) => {
      total += parseInt(row.getAttribute("data-quantity")) || 0;
    });
    const badge = getElement("cart-badge-counter");
    if (badge) {
      badge.textContent = `${total} Item${total !== 1 ? "s" : ""}`;
    }
  }

  function removeCartItemRow(btn) {
    const row = btn.closest(".cart-item-row");
    if (row) {
      row.remove();
      synchronizeCartItemCount();
    }
  }

  // Delivery & Checkout
  function toggleDelivery(type) {
    currentDeliveryType = type;
    const container = getElement("delivery-info-container");
    const homeLabel = getElement("label-home");
    const storeLabel = getElement("label-store");
    const radioHome = getElement("radio-home");
    const radioStore = getElement("radio-store");

    if (type === "home") {
      radioHome.checked = true;
      homeLabel.className =
        "relative p-3 rounded-xl border border-blue-500 bg-blue-500/5 cursor-pointer delivery-option transition-all";
      storeLabel.className =
        "relative p-3 rounded-xl border border-black/10 dark:border-white/10 cursor-pointer delivery-option transition-all card";
      renderHomeDeliveryUI(container);
    } else {
      radioStore.checked = true;
      storeLabel.className =
        "relative p-3 rounded-xl border border-blue-500 bg-blue-500/5 cursor-pointer delivery-option transition-all";
      homeLabel.className =
        "relative p-3 rounded-xl border border-black/10 dark:border-white/10 cursor-pointer delivery-option transition-all card";
      renderStorePickupUI(container);
    }
    updateTotalPrice();
  }

  function renderHomeDeliveryUI(container) {
    const active = shippingAddresses.find((a) => a.id === activeAddressId);
    let others = shippingAddresses
      .filter((a) => a.id !== activeAddressId)
      .map(
        (a) =>
          `<button onclick="selectHomeAddress('${a.id}')" class="w-full text-left text-[11px] font-medium txt1 hover:text-blue-600 hover:text-blue-400 transition-colors py-0.5 block">${a.shortName}</button>`,
      )
      .join("");
    container.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase">Shipping to</span>
          <span class="text-[10px] text-blue-600 dark:text-blue-400 font-bold">${active.costText}</span>
        </div>
        <div class="flex justify-between items-end">
          <div>
            <p class="text-[11px] font-bold text-black dark:text-white leading-tight">${active.fullName}</p>
            <button onclick="toggleSubList('shipping-list')" class="text-[10px] text-blue-600 dark:text-blue-400 font-medium hover:underline mt-0.5 block text-left">Change address</button>
          </div>
        </div>
      </div>
      <div id="shipping-list" class="hidden mt-3 pt-3 border-t border-black/10 dark:border-white/10 max-h-24 overflow-y-auto custom-scrollbar">
        <div class="flex justify-between items-center mb-2">
          <p class="text-[9px] text-black/40 dark:text-white/40 uppercase tracking-wider">Other Saved Addresses:</p>
          <a href="/addresses/new" class="text-[9px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
            <i class="bi bi-plus"></i> Add New
          </a>
        </div>
        <div class="space-y-1.5">${others}</div>
      </div>`;
  }

  function renderStorePickupUI(container) {
    const active = pickupBranches.find((b) => b.id === activeBranchId);
    let others = pickupBranches
      .filter((b) => b.id !== activeBranchId)
      .map(
        (b) =>
          `<button onclick="selectStoreBranch('${b.id}')" class="w-full text-left text-[11px] font-medium text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-0.5 block">${b.city}</button>`,
      )
      .join("");
    container.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase">Pickup Location</span>
          <span class="text-[10px] text-green-600 dark:text-green-400 font-bold">${active.costText}</span>
        </div>
        <div class="flex justify-between items-end">
          <div>
            <p class="text-[11px] font-bold text-black dark:text-white leading-tight">${active.fullName}</p>
            <button onclick="toggleSubList('pickup-list')" class="text-[10px] text-blue-600 dark:text-blue-400 font-medium hover:underline mt-0.5 block text-left">Change location</button>
          </div>
          <a href="${active.mapsUrl}" target="_blank" class="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Open in Maps</a>
        </div>
      </div>
      <div id="pickup-list" class="hidden mt-3 pt-3 border-t border-black/10 dark:border-white/10 max-h-24 overflow-y-auto custom-scrollbar">
        <p class="text-[9px] text-black/40 dark:text-white/40 uppercase mb-2">Other Available Branches:</p>
        <div class="space-y-1.5">${others}</div>
      </div>`;
  }

  function toggleSubList(id) {
    const el = getElement(id);
    if (el) el.classList.toggle("hidden");
  }

  function selectHomeAddress(id) {
    activeAddressId = id;
    renderHomeDeliveryUI(getElement("delivery-info-container"));
    updateTotalPrice();
  }

  function selectStoreBranch(id) {
    activeBranchId = id;
    renderStorePickupUI(getElement("delivery-info-container"));
    updateTotalPrice();
  }

  function updateTotalPrice() {
    let fee = 0;
    if (currentDeliveryType === "home") {
      const addr = shippingAddresses.find((a) => a.id === activeAddressId);
      fee = addr ? addr.costVal : 0;
    } else {
      const branch = pickupBranches.find((b) => b.id === activeBranchId);
      fee = branch ? branch.costVal : 0;
    }
    const total = baseCartTotal + fee + paymentFee;
    const el = getElement("checkout-total-price");
    if (el) el.textContent = `EGP ${total.toLocaleString()}`;
  }

  function updatePaymentFee(fee) {
    paymentFee = fee;
    updateTotalPrice();
  }

  function showCheckoutStep(step) {
    const s1 = getElement("cart-step-1");
    const s2 = getElement("cart-step-2");
    if (step === 2) {
      s1.classList.add("hidden");
      s2.classList.remove("hidden");
    } else {
      s2.classList.add("hidden");
      s1.classList.remove("hidden");
    }
  }

  function submitOrder() {
    const btn = document.getElementById("confirm-order-btn");
    btn.innerHTML = `<span class="inline-block animate-spin mr-2">◌</span> Processing...`;
    btn.disabled = true;
    setTimeout(() => {
      alert("Order Successfully Placed! Thank you for shopping.");
      closeAllViews();
      setTimeout(() => {
        showCheckoutStep(1);
        btn.innerHTML = `Confirm Order • EGP 1,340`;
        btn.disabled = false;
      }, 500);
    }, 2000);
  }

  // Promo functions
  function applyPromoCodeFilter() {
    const input = getElement("promoCodeInput");
    const code = input.value.trim().toUpperCase();
    if (!code) {
      showPromoStatus("Please enter a code", "error");
      input.focus();
      input.classList.add("border-red-500/50");
      setTimeout(() => input.classList.remove("border-red-500/50"), 400);
      return;
    }
    if (activePromoCode === code) {
      showPromoStatus("Already applied", "error");
      return;
    }
    const promo = availablePromos[code];
    if (promo) {
      applyPromoCode(code);
      input.value = "";
      showPromoStatus("Applied ✓", "success");
    } else {
      showPromoStatus("Invalid code", "error");
      input.classList.add("border-red-500/50");
      setTimeout(() => input.classList.remove("border-red-500/50"), 400);
      input.focus();
      input.select();
    }
  }

  function applyPromoCode(code) {
    const promo = availablePromos[code];
    if (!promo) return;
    activePromoCode = code;
    const display = getElement("appliedPromoDisplay");
    const codeDisplay = getElement("appliedPromoCode");
    const discountDisplay = getElement("appliedPromoDiscount");
    if (display && codeDisplay && discountDisplay) {
      codeDisplay.textContent = code;
      discountDisplay.textContent = promo.discount;
      display.classList.remove("hidden");
    }
    showPromoStatus("Applied ✓", "success");
    showAlert("success", `🎉 Promo code "${code}" applied! ${promo.discount}`);
  }

  function removePromoCode() {
    activePromoCode = null;
    const display = getElement("appliedPromoDisplay");
    if (display) display.classList.add("hidden");
    showPromoStatus("Apply a code", "");
    showAlert("info", "Promo code removed");
  }

  function showPromoStatus(message, type) {
    const status = getElement("promoStatus");
    if (!status) return;
    status.textContent = message;
    status.className = "text-[10px] font-bold";
    if (type === "success") status.className += " text-emerald-400";
    else if (type === "error") status.className += " text-red-400";
    else status.className += " text-black/40 dark:text-white/40";
  }

  // ============================================================
  // PRODUCT DETAILS (Quick Look)
  // ============================================================

  function switchPDTab(tabId) {
    document.querySelectorAll(".pd-pane").forEach((pane) => {
      pane.classList.add("hidden");
      pane.classList.remove("flex");
    });
    const target = getElement(`pane-${tabId}`);
    if (target) {
      target.classList.remove("hidden");
      target.classList.add("flex");
    }
    document.querySelectorAll('[id^="tab-"]').forEach((btn) => {
      btn.classList.remove(
        "border-blue-500",
        "text-blue-500",
        "dark:text-blue-400",
      );
      btn.classList.add(
        "border-transparent",
        "text-zinc-500",
        "dark:text-zinc-500",
      );
    });
    const active = getElement(`tab-${tabId}`);
    if (active) {
      active.classList.remove(
        "border-transparent",
        "text-zinc-500",
        "dark:text-zinc-500",
      );
      active.classList.add(
        "border-blue-500",
        "text-blue-500",
        "dark:text-blue-400",
      );
    }
  }

  function toggleReviewForm() {
    const panel = getElement("review-form-panel");
    const btn = getElement("btn-write-review");
    if (!panel || !btn) return;
    if (panel.classList.contains("opacity-0")) {
      panel.classList.remove("max-h-0", "opacity-0", "scale-95");
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("opacity-100", "scale-100", "p-0");
      btn.innerText = "Close";
    } else {
      panel.style.maxHeight = "0px";
      panel.classList.remove("opacity-100", "scale-100");
      panel.classList.add("opacity-0", "scale-95");
      btn.innerText = "Write a review";
    }
  }

  function toggleReviewExpand(card) {
    const textEl = card.querySelector(".review-text");
    const isCollapsed =
      card.style.maxHeight === "" || card.style.maxHeight === "55px";
    document.querySelectorAll(".review-card").forEach((c) => {
      c.style.maxHeight = "55px";
      const t = c.querySelector(".review-text");
      if (t) t.classList.add("line-clamp-2");
    });
    if (isCollapsed) {
      textEl.classList.remove("line-clamp-2");
      card.style.maxHeight = card.scrollHeight + 20 + "px";
    }
  }

  function submitUserReview() {
    const name = getElement("form-review-name")?.textContent || "Anonymous";
    const rating = getElement("form-review-rating")?.value || 5;
    const stars = "★".repeat(rating).padEnd(5, "☆");
    const text =
      getElement("form-review-text")?.value || "No descriptive text provided.";
    const container = getElement("reviews-feed-container");
    if (!container) return;
    const html = `
      <div onclick="toggleReviewExpand(this)"
           class="review-card cursor-pointer snap-start w-full bg-white/70 dark:bg-white/5 backdrop-blur-sm p-3.5 rounded-xl border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/15 transition-all duration-300 ease-out overflow-hidden max-h-[52px] shadow-sm hover:shadow-md">
        <div class="flex justify-between items-start mb-0.5 pointer-events-none">
          <span class="flex items-center gap-1.5">
            <span class="text-sm font-bold text-black dark:text-white">${name}</span>
            <span class="text-[8px] bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60 px-2 py-0.5 rounded-full font-bold tracking-wider">✓</span>
          </span>
          <span class="text-xs text-black/60 dark:text-white/60 font-semibold">${stars}</span>
        </div>
        <p class="review-text text-[10px] opacity-70 text-black dark:text-zinc-300 leading-relaxed transition-all pointer-events-none line-clamp-2">"${text}"</p>
      </div>`;
    container.insertAdjacentHTML("afterbegin", html);
    toggleReviewForm();
    const nameInput = getElement("form-review-name");
    const textInput = getElement("form-review-text");
    if (nameInput) nameInput.value = "";
    if (textInput) textInput.value = "";
  }

  // ============================================================
  // SEARCH VIEW
  // ============================================================

  function switchSearchMode(mode) {
    currentSearchMode = mode;
    const productMode = getElement("product-search-mode");
    const categoryMode = getElement("category-search-mode");
    const productsBtn = getElement("mode-products");
    const categoriesBtn = getElement("mode-categories");
    if (!productMode || !categoryMode || !productsBtn || !categoriesBtn) return;
    if (mode === "products") {
      productMode.style.display = "block";
      categoryMode.style.display = "none";
      productsBtn.classList.add("active");
      categoriesBtn.classList.remove("active");
    } else {
      productMode.style.display = "none";
      categoryMode.style.display = "block";
      categoriesBtn.classList.add("active");
      productsBtn.classList.remove("active");
    }
  }

  function handleSearch(query) {
    // If orders view is active, do nothing (or we could implement order filtering)
    if (isViewVisible("orders-view")) {
      // Could filter orders here, but we have no data; just return.
      return;
    }
    // Otherwise, handle product search
    const suggestions = getElement("search-suggestions");
    const results = getElement("search-results");
    const resultsGrid = getElement("results-grid");
    const input = query.trim();
    if (!suggestions || !results || !resultsGrid) return;
    if (input.length > 0) {
      suggestions.classList.add("is-hidden");
      results.classList.remove("hidden");
      requestAnimationFrame(() => {
        results.classList.add("opacity-100", "translate-y-0");
        results.classList.remove("opacity-0", "-translate-y-6");
      });
      resultsGrid.innerHTML = `
        <div class="bg-white dark:bg-white/5 rounded-[2rem] p-3 border border-gray-200 dark:border-white/5 shadow-sm animate-pulse">
          <div class="aspect-square bg-gray-200 dark:bg-white/10 rounded-2xl mb-3"></div>
          <div class="h-2.5 w-2/3 bg-gray-300 dark:bg-white/10 rounded-full mb-2"></div>
          <div class="h-2 w-1/3 bg-blue-300 dark:bg-blue-500/20 rounded-full"></div>
        </div>
        <div class="bg-white dark:bg-white/5 rounded-[2rem] p-3 border border-gray-200 dark:border-white/5 shadow-sm animate-pulse">
          <div class="aspect-square bg-gray-200 dark:bg-white/10 rounded-2xl mb-3"></div>
          <div class="h-2.5 w-2/3 bg-gray-300 dark:bg-white/10 rounded-full mb-2"></div>
          <div class="h-2 w-1/3 bg-blue-300 dark:bg-blue-500/20 rounded-full"></div>
        </div>
      `;
    } else {
      suggestions.classList.remove("is-hidden");
      results.classList.add("opacity-0", "-translate-y-6");
      results.classList.remove("opacity-100", "translate-y-0");
      setTimeout(() => {
        if (getElement("search-input")?.value.length === 0) {
          results.classList.add("hidden");
        }
      }, 500);
    }
  }

  // Category search logic (initialized on DOMContentLoaded)
  function initCategorySearch() {
    const colGender = getElement("col-gender");
    const colCategory = getElement("col-category");
    const colSub = getElement("col-sub");
    const pathDisplay = getElement("path-display");
    const exploreBtn = getElement("explore-btn");
    const searchInput = getElement("directory-search");
    if (!colGender || !colCategory || !colSub) return;

    function createItemButton(label, isActive = false) {
      const btn = document.createElement("button");
      btn.className = `w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all truncate flex justify-between items-center ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`;
      btn.innerHTML = `<span>${label}</span>`;
      return btn;
    }

    function renderGenders(filterTerm = "") {
      colGender.innerHTML = "";
      Object.keys(storeData).forEach((gender) => {
        if (filterTerm && !gender.toLowerCase().includes(filterTerm)) return;
        const btn = createItemButton(
          gender,
          categorySelection.gender === gender,
        );
        btn.addEventListener("click", () => selectGender(gender));
        colGender.appendChild(btn);
      });
    }

    function renderCategories() {
      if (!categorySelection.gender) {
        colCategory.classList.add("hidden");
        return;
      }
      colCategory.classList.remove("hidden");
      colCategory.innerHTML = "";
      Object.keys(storeData[categorySelection.gender]).forEach((cat) => {
        const btn = createItemButton(cat, categorySelection.category === cat);
        btn.addEventListener("click", () => selectCategory(cat));
        colCategory.appendChild(btn);
      });
    }

    function renderSubs() {
      if (!categorySelection.category) {
        colSub.classList.add("hidden");
        return;
      }
      colSub.classList.remove("hidden");
      colSub.innerHTML = "";
      storeData[categorySelection.gender][categorySelection.category].forEach(
        (sub) => {
          const btn = createItemButton(sub, categorySelection.sub === sub);
          btn.addEventListener("click", () => selectSub(sub));
          colSub.appendChild(btn);
        },
      );
    }

    function selectGender(gender) {
      categorySelection.gender = gender;
      categorySelection.category = null;
      categorySelection.sub = null;
      renderGenders();
      renderCategories();
      renderSubs();
      updateUI();
    }

    function selectCategory(cat) {
      categorySelection.category = cat;
      categorySelection.sub = null;
      renderCategories();
      renderSubs();
      updateUI();
    }

    function selectSub(sub) {
      categorySelection.sub = sub;
      renderSubs();
      updateUI();
    }

    function updateUI() {
      const counter = getElement("items-counter");
      if (!counter) return;
      if (
        categorySelection.gender &&
        categorySelection.category &&
        categorySelection.sub
      ) {
        if (pathDisplay) {
          pathDisplay.innerHTML = `<span class="text-black dark:text-white">${categorySelection.gender}</span> / <span class="text-black dark:text-white">${categorySelection.category}</span> / <span class="text-black dark:text-white">${categorySelection.sub}</span>`;
        }
        const count = mockItemCounts[categorySelection.sub] || 0;
        counter.textContent = `${count} items found`;
        counter.classList.remove("opacity-0");
        counter.classList.add(
          "opacity-100",
          "text-green-600",
          "dark:text-green-400",
          "border-green-500/20",
          "bg-green-500/5",
        );
        if (exploreBtn) {
          exploreBtn.removeAttribute("aria-disabled");
          exploreBtn.href = `/catalog?gender=${categorySelection.gender.toLowerCase()}&category=${categorySelection.category.toLowerCase()}&sub=${categorySelection.sub.toLowerCase()}`;
          exploreBtn.className =
            "px-4 py-2 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2 hover:scale-105";
        }
      } else {
        let pathArr = [];
        if (categorySelection.gender) pathArr.push(categorySelection.gender);
        if (categorySelection.category)
          pathArr.push(categorySelection.category);
        if (pathDisplay)
          pathDisplay.textContent = pathArr.length
            ? pathArr.join(" / ") + " / ..."
            : "Select Options...";
        counter.classList.remove(
          "opacity-100",
          "text-green-600",
          "dark:text-green-400",
          "border-green-500/20",
          "bg-green-500/5",
        );
        counter.classList.add("opacity-0");
        counter.textContent = "0 items found";
        if (exploreBtn) {
          exploreBtn.setAttribute("aria-disabled", "true");
          exploreBtn.href = "#";
          exploreBtn.className =
            "px-4 py-2 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2 hover:scale-105";
        }
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) {
          renderGenders();
          renderCategories();
          renderSubs();
          return;
        }
        let matchedGender = null,
          matchedCat = null,
          matchedSub = null;
        for (const gender in storeData) {
          for (const cat in storeData[gender]) {
            const subMatch = storeData[gender][cat].find((s) =>
              s.toLowerCase().includes(term),
            );
            if (subMatch) {
              matchedGender = gender;
              matchedCat = cat;
              matchedSub = subMatch;
              break;
            }
          }
          if (matchedGender) break;
        }
        if (matchedGender) {
          categorySelection.gender = matchedGender;
          categorySelection.category = matchedCat;
          categorySelection.sub = matchedSub;
          renderGenders();
          renderCategories();
          renderSubs();
          updateUI();
        }
      });
    }

    renderGenders();
  }

  // ============================================================
  // ORDERS VIEW
  // ============================================================

  function toggleOrderCardExpansion(orderId) {
    const details = getElement(`order-details-${orderId}`);
    const chevron = getElement(`order-chevron-${orderId}`);
    if (!details) return;
    if (details.style.maxHeight && details.style.maxHeight !== "0px") {
      details.style.maxHeight = "0px";
      if (chevron) chevron.style.transform = "rotate(0deg)";
    } else {
      details.style.maxHeight = details.scrollHeight + "px";
      if (chevron) chevron.style.transform = "rotate(180deg)";
    }
  }

  // ============================================================
  // PROFILE VIEW
  // ============================================================

  function switchTab(tabName) {
    document
      .querySelectorAll(".profile-content")
      .forEach((el) => el.classList.add("hidden"));
    document.querySelectorAll(".profile-tab-btn").forEach((btn) => {
      btn.classList.remove(
        "border-b-2",
        "border-blue-500",
        "text-blue-600",
        "dark:text-blue-400",
      );
      btn.classList.add("opacity-40");
    });
    const content = getElement(`content-${tabName}`);
    if (content) content.classList.remove("hidden");
    const btn = getElement(`tab-${tabName}`);
    if (btn) {
      btn.classList.add(
        "border-b-2",
        "border-blue-500",
        "text-blue-600",
        "dark:text-blue-400",
      );
      btn.classList.remove("opacity-40");
    }
  }

  // ============================================================
  // EXPLORE VIEW
  // ============================================================

  function setExploreGrid(cols) {
    const grid = getElement("explore-grid");
    if (!grid) return;
    grid.classList.remove(
      "grid-cols-1",
      "grid-cols-2",
      "lg:grid-cols-3",
      "md:grid-cols-3",
    );
    if (cols === 1) {
      grid.classList.add("grid-cols-1");
    } else {
      grid.classList.add("grid-cols-2", "lg:grid-cols-3");
    }
    grid.style.transform = "scale(0.99)";
    setTimeout(() => (grid.style.transform = "scale(1)"), 100);
  }

  function animateExploreGrid() {
    const grid = getElement("explore-grid");
    if (!grid) return;
    Array.from(grid.children).forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(15px)";
      card.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(
        () => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        },
        150 + index * 60,
      );
    });
  }

  // ============================================================
  // NAVIGATION PANEL – OPEN/CLOSE VIEWS
  // ============================================================

  function hideTogglingBtn() {
    const btn = getElement("menu-toggle-btn");
    if (btn) {
      btn.classList.add("hidden");
      setTimeout(() => (btn.style.pointerEvents = "none"), 300);
    }
  }

  function showTogglingBtn() {
    const btn = getElement("menu-toggle-btn");
    if (btn) {
      btn.classList.remove("hidden");
      btn.style.pointerEvents = "auto";
    }
  }

  function openNavView(viewId, targetWidth = "34rem") {
    const nav = getElement("main-nav");
    const targetView = getElement(viewId);
    const overlay = getElement("nav-overlay");
    const closeBtn = getElement("close-quicklook");
    if (!nav || !targetView || !overlay) return;

    hideTogglingBtn();

    // Hide all other views
    [
      "product-details",
      "search-view",
      "cart-view",
      "notfications-view",
      "orders-view",
      "profile-view",
      "home-view",
      "catalog-view",
      "explore-view",
    ].forEach((id) => {
      const v = getElement(id);
      if (id !== viewId && v) {
        v.classList.add("hidden", "opacity-0");
        v.classList.remove("is-open");
      }
    });

    overlay.classList.add("active", "opacity-100", "pointer-events-auto");
    nav.classList.remove("hidden");
    targetView.classList.remove("hidden");

    setTimeout(() => {
      nav.classList.remove("px-4", "py-4");
      nav.classList.add("px-4", "py-4");
      nav.style.maxHeight = "calc(80vh - 4rem)";
      nav.style.overflowY = "auto";
      nav.style.webkitOverflowScrolling = "touch";
      const isMobile = window.innerWidth < 768;
      nav.style.maxWidth = isMobile ? "calc(80vw - 2rem)" : targetWidth;
      targetView.classList.add("is-open");
      targetView.classList.remove("opacity-0");
      if (closeBtn) closeBtn.classList.remove("hidden");
    }, 10);
  }

  function openQuickLook(productId) {
    const nav = getElement("main-nav");
    const details = getElement("product-details");
    const overlay = getElement("nav-overlay");
    const closeBtn = getElement("close-quicklook");
    if (!nav || !details || !overlay) return;

    closeMenu();
    hideTogglingBtn();

    overlay.classList.add("active", "opacity-100", "pointer-events-auto");
    details.classList.remove("hidden");
    const isMobile = window.innerWidth < 768;

    setTimeout(() => {
      nav.classList.remove("px-4", "py-4");
      nav.classList.add("px-4", "py-4");
      nav.style.maxHeight = "calc(100vh - 4rem)";
      nav.style.overflowY = "auto";
      nav.style.webkitOverflowScrolling = "touch";
      nav.style.maxWidth = isMobile ? "calc(100vw - 2rem)" : "30rem";
      details.classList.add("is-open");
      details.classList.remove("opacity-0", "scale-95");
      if (closeBtn) closeBtn.classList.remove("hidden");
    }, 10);

    // Inject product images (static for demo)
    const images = [
      "https://assets.adidas.com/images/w_1880,f_auto,q_auto/a4ff4a779ee34deca8cc9a6f1f411440_9366/KC6611_HM1.jpg",
      "https://assets.adidas.com/images/w_1880,f_auto,q_auto/1f0135cfef624e779735b6390f38c98b_9366/KC6611_HM5.jpg",
    ];
    const container = getElement("ql-image-container");
    if (container) {
      container.innerHTML = images
        .map((src) => `<img src="${src}" class="ql-slide snap-center">`)
        .join("");
    }
    const title = getElement("ql-title");
    if (title) title.innerText = "Adidas classic t-shirt";
    const price = getElement("ql-price");
    if (price) price.innerText = "EGP 1,290";
  }

  function closeAllViews() {
    const nav = getElement("main-nav");
    const views = [
      "product-details",
      "search-view",
      "notfications-view",
      "orders-view",
      "cart-view",
      "profile-view",
      "home-view",
      "catalog-view",
      "explore-view",
    ];
    const overlay = getElement("nav-overlay");
    const closeBtn = getElement("close-quicklook");
    if (!nav || !overlay) return;

    showTogglingBtn();

    // Restore body scroll
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    if (scrollY && scrollY !== "0px" && scrollY !== "") {
      window.scrollTo(0, parseInt(scrollY) * -1);
    }

    views.forEach((id) => {
      const v = getElement(id);
      if (v) {
        v.classList.remove("is-open");
        v.classList.add("opacity-0", "scale-95");
      }
    });

    nav.classList.add("px-6", "py-4");
    nav.classList.remove("px-4");
    nav.style.maxWidth = "";

    overlay.classList.remove("active", "opacity-100", "pointer-events-auto");

    setTimeout(() => {
      views.forEach((id) => {
        const v = getElement(id);
        if (v && !v.classList.contains("is-open")) {
          v.classList.add("hidden");
        }
      });
    }, 500);

    if (closeBtn) closeBtn.classList.add("hidden");
  }

  // View openers
  function openSearch(e) {
    if (e) e.preventDefault();
    openNavView("search-view", "30rem");
  }
  function openCart(e) {
    if (e) e.preventDefault();
    openNavView("cart-view", "30rem");
  }
  function opennotfications(e) {
    if (e) e.preventDefault();
    openNavView("notfications-view", "30rem");
  }
  function openorders(e) {
    if (e) e.preventDefault();
    openNavView("orders-view", "30rem");
  }
  function openProfile(e) {
    if (e) e.preventDefault();
    openNavView("profile-view", "30rem");
  }
  function openHome(e) {
    if (e) e.preventDefault();
    openNavView("home-view", "30rem");
  }
  function openCatalog(e) {
    if (e) e.preventDefault();
    openNavView("catalog-view", "30rem");
  }
  function openExplore() {
    openNavView("explore-view", "45rem");
    if (typeof animateExploreGrid === "function") animateExploreGrid();
  }

  // Stubs for missing onclick handlers
  function askOwnerOnWhatsApp() {
    showAlert("info", "Chat with store on WhatsApp");
  }
  function handleProductQuickBuy() {
    showAlert("success", "Quick Buy – proceed to checkout");
  }
  function handleProductAddToBag() {
    showAlert("cart", "Added to bag");
  }
  function handleCancelOrder(orderId) {
    showAlert("info", `Order ${orderId} cancellation requested`);
  }
  function updateImageProgress(el) {
    /* scroll progress for images – stub */
  }
  function signIn() {
    showAlert("auth", "Sign in flow triggered");
  }
  function signOut() {
    showAlert("logout", "Signed out");
  }

  function closeMenu() {
    // Stub: originally used for radial menu
  }

  // ============================================================
  // FLOATING NAV TOGGLE (radial menu)
  // ============================================================

  (function initFloatingNav() {
    const floatingNav = document.querySelector(".floating-nav");
    const navToggle = getElement("navToggle");
    const navPanel = getElement("floatingNavPanel");
    const navBackdrop = getElement("navBackdrop");
    if (!floatingNav || !navToggle || !navPanel) return;

    let isOpen = false;

    function openNavigation() {
      if (isOpen) return;
      isOpen = true;
      floatingNav.classList.add("is-open");
      if (navBackdrop) navBackdrop.classList.add("is-visible");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close navigation");
      navPanel.setAttribute("aria-hidden", "false");
    }

    function closeNavigation() {
      if (!isOpen) return;
      isOpen = false;
      floatingNav.classList.remove("is-open");
      if (navBackdrop) navBackdrop.classList.remove("is-visible");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
      navPanel.setAttribute("aria-hidden", "true");
    }

    function toggleNavigation() {
      if (isOpen) closeNavigation();
      else openNavigation();
    }

    navToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleNavigation();
    });

    if (navBackdrop) {
      navBackdrop.addEventListener("click", closeNavigation);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) {
        closeNavigation();
        navToggle.focus();
      }
    });

    floatingNav.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    navPanel
      .querySelectorAll(".nav-bubble-enhanced")
      .forEach(function (bubble) {
        bubble.addEventListener("click", function () {
          requestAnimationFrame(function () {
            closeNavigation();
          });
        });
      });

    // Expose to global
    window.openFloatingNavigation = openNavigation;
    window.closeFloatingNavigation = closeNavigation;
    window.toggleFloatingNavigation = toggleNavigation;
  })();

  // ============================================================
  // INITIALIZATION ON DOM READY
  // ============================================================

  document.addEventListener("DOMContentLoaded", function () {
    // Init cart count
    synchronizeCartItemCount();

    // Init notification tray
    renderNotificationViewTray();

    // Init category search
    initCategorySearch();

    // Init promo code enter key
    const promoInput = getElement("promoCodeInput");
    if (promoInput) {
      promoInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          applyPromoCodeFilter();
        }
      });
    }

    // Init review form panel closed
    const panel = getElement("review-form-panel");
    if (panel) {
      panel.classList.remove("open");
      panel.style.maxHeight = "0";
      panel.style.opacity = "1";
      panel.style.transform = "scale(0.95)";
      const btn = getElement("btn-write-review");
      if (btn) btn.innerHTML = "Write a review";
    }

    // Default delivery (home) – ensure UI
    toggleDelivery("home");

    // Expose functions to global for inline onclick handlers
    // (already exposed via function declarations, but ensure they are global)
    window.switchPDTab = switchPDTab;
    window.toggleReviewForm = toggleReviewForm;
    window.toggleReviewExpand = toggleReviewExpand;
    window.submitUserReview = submitUserReview;
    window.switchSearchMode = switchSearchMode;
    window.handleSearch = handleSearch;
    window.toggleDelivery = toggleDelivery;
    window.selectHomeAddress = selectHomeAddress;
    window.selectStoreBranch = selectStoreBranch;
    window.toggleSubList = toggleSubList;
    window.updatePaymentFee = updatePaymentFee;
    window.showCheckoutStep = showCheckoutStep;
    window.submitOrder = submitOrder;
    window.removeCartItemRow = removeCartItemRow;
    window.applyPromoCodeFilter = applyPromoCodeFilter;
    window.applyPromoCode = applyPromoCode;
    window.removePromoCode = removePromoCode;
    window.toggleOrderCardExpansion = toggleOrderCardExpansion;
    window.setExploreGrid = setExploreGrid;
    window.openSearch = openSearch;
    window.openCart = openCart;
    window.opennotfications = opennotfications;
    window.openorders = openorders;
    window.openProfile = openProfile;
    window.openHome = openHome;
    window.openCatalog = openCatalog;
    window.openExplore = openExplore;
    window.openQuickLook = openQuickLook;
    window.closeAllViews = closeAllViews;
    window.showAlert = showAlert;
    window.markAllNotificationsAsRead = markAllNotificationsAsRead;
    window.clearAllNotifications = clearAllNotifications;
    window.askOwnerOnWhatsApp = askOwnerOnWhatsApp;
    window.handleProductQuickBuy = handleProductQuickBuy;
    window.handleProductAddToBag = handleProductAddToBag;
    window.handleCancelOrder = handleCancelOrder;
    window.updateImageProgress = updateImageProgress;
    window.signIn = signIn;
    window.signOut = signOut;
    window.closeMenu = closeMenu;
    window.animateExploreGrid = animateExploreGrid;
  });
})();
