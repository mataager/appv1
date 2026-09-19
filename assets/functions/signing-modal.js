/* =========================================================================
   Matager Signing Modal — store-owner onboarding for the landing page
   File: assets/functions/signing-modal.js
   -------------------------------------------------------------------------
   Drop-in:
     <script src="./assets/functions/signing-modal.js"></script>

   v3 changes:
     • In-modal note about avoiding lost customers (sticky inside signup flow)
     • Smooth height morphing between steps (freeze → swap → measure → animate)
     • All CSS values now flow from identity.css tokens
     • Close button repositioned to the panel's true top-right corner
     • Auto-opens when the user clicks any link to signing.html?mode=…

   Wiring the payload (define on the page before loading this file):

     window.MatagerSigningConfig = {
       onSubmit: async (data, mode) => {
         if (mode === "signup") {
           // data = { channels, email, firstName, lastName, password,
           //          focus, inventory, planPrice, planId, storeName,
           //          storeLogo (File|string), storeLogoFile (File),
           //          brandColor, createdAt }
         } else {
           // data = { email, password }
    //      }
    //    },
    // //    onForgotPassword: async (email) => { /* send reset email */
//  };

//    Public API (window.MatagerSigning):
//      .openSignup()   .openSignin()   .close()
//      .goToStep(n)    .getData()      .reset()
//    ========================================================================= */

(function (global) {
  "use strict";

  /* ---------------------------------------------------------------------
     1) CONFIG
     --------------------------------------------------------------------- */
  const HINT_KEY = "matager-owner-hint-dismissed";
  const DRAFT_KEY = "matager-signup-draft";
  const STORES_URL = "https://mataager.github.io/App/Store/";

  const ID_HINT = "matager-owner-hint";
  const ID_MODAL = "matager-signing-modal";
  const ID_STYLE = "matager-signing-style";

  /* Panel height animation duration — match the CSS height transition */
  const PANEL_HEIGHT_MS = 460;

  /* ---------------------------------------------------------------------
     2) TRANSLATIONS
     --------------------------------------------------------------------- */
  const STR = {
    en: {
      /* Hint banner */
      hintTitle: "This builds a store — not a shopping cart.",
      hintBody:
        "Matager is for business owners. Signing up creates your storefront, POS, and dashboard.",
      hintCta: "Just want to buy?",
      hintLink: "Browse stores",
      hintDismiss: "Got it",

      /* Modal note (inside the signup flow) */
      modalNote:
        "Heads up — this creates a storefront for you, not a shopping account.",

      /* Modal shell */
      close: "Close",
      back: "Back",
      continue: "Continue",
      processing: "Setting things up…",

      /* Signup steps */
      step1Title: "Sales channels",
      step1Sub: "What is your current strategy?",
      step2Title: "Create account",
      step2Sub: "Enter your email to get started.",
      step3Title: "Complete signup",
      step3Sub: "Set your name and password.",
      step4Title: "What's your focus?",
      step4Sub: "Choose the categories you plan to sell.",
      step5Title: "Inventory size",
      step5Sub: "Choose the plan that fits your needs.",
      step6Title: "Store name",
      step6Sub: "What should we call your store?",
      step7Title: "Store identity",
      step7Sub: "Upload your logo and pick your brand color.",

      /* Options */
      optChannels1: "Hybrid Unified Store",
      optChannels1s: "POS synced with your website.",
      optChannels2: "Online Store",
      optChannels2s: "Sell through a custom website.",
      optChannels3: "POS Setup",
      optChannels3s: "POS cashier system only.",

      optFocus1: "Apparel & Accessories",
      optFocus1s: "Clothing, shoes, watches, and jewelry.",
      optFocus2: "Home & Garden",
      optFocus2s: "Décor, kitchenware, and furniture.",
      optFocus3: "Beauty & Wellness",
      optFocus3s: "Organic skincare and personal care.",
      optFocus4: "Electronics & Gadgets",
      optFocus4s: "High-tech devices and gear.",

      plan1: "1 – 5 item",
      plan1s: "Perfect for a boutique setup or single product launch.",
      plan2: "5 – 20 item",
      plan2s: "Ideal for small collections and growing brands.",
      plan3: "20 – 100 item",
      plan3s: "A comprehensive catalog for established shops.",
      plan4: "100 – 300 item",
      plan4s: "High-volume inventory with multiple categories.",
      plan5: "300 – 750 item",
      plan5s: "Large scale enterprise-level product management.",

      /* Fields */
      email: "Email address",
      firstName: "First name",
      lastName: "Last name",
      password: "Create a password",
      storeName: "Store name",
      storeLogo: "Store logo",
      brandColor: "Brand accent color",

      /* Sign in */
      signinTitle: "Welcome back",
      signinSub: "Sign in to your store dashboard.",
      signinCta: "Sign in",
      forgot: "Forgot password?",
      resetTitle: "Reset password",
      resetSub: "Enter your email and we'll send a reset link.",
      resetCta: "Send reset link",
      resetSent: "Reset link sent",
      resetSentTo: "Check your inbox at",
      openMail: "Open Gmail",

      /* Footer */
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      doSignin: "Sign in",
      doSignup: "Sign up",
    },

    ar: {
      hintTitle: "هذا يُنشئ متجرًا — لا سلة تسوّق.",
      hintBody:
        "متاجر موجّه لأصحاب الأعمال. التسجيل يُنشئ متجرك ونقاط البيع ولوحة التحكم.",
      hintCta: "تريد الشراء فقط؟",
      hintLink: "تصفّح المتاجر",
      hintDismiss: "فهمت",

      modalNote: "تنبيه — هذا يُنشئ متجرًا لك، لا حساب تسوّق.",

      close: "إغلاق",
      back: "رجوع",
      continue: "متابعة",
      processing: "جارٍ الإعداد…",

      step1Title: "قنوات البيع",
      step1Sub: "ما استراتيجيتك الحالية؟",
      step2Title: "إنشاء حساب",
      step2Sub: "أدخل بريدك الإلكتروني للبدء.",
      step3Title: "إكمال التسجيل",
      step3Sub: "أدخل اسمك وكلمة المرور.",
      step4Title: "ما مجالك؟",
      step4Sub: "اختر الفئات التي تخطّط لبيعها.",
      step5Title: "حجم المخزون",
      step5Sub: "اختر الخطة المناسبة لك.",
      step6Title: "اسم المتجر",
      step6Sub: "بماذا نسمّي متجرك؟",
      step7Title: "هوية المتجر",
      step7Sub: "ارفع شعارك واختر لون علامتك.",

      optChannels1: "متجر موحّد هجين",
      optChannels1s: "نقاط البيع متزامنة مع موقعك.",
      optChannels2: "متجر إلكتروني",
      optChannels2s: "البيع عبر موقع مخصص.",
      optChannels3: "إعداد نقاط بيع",
      optChannels3s: "نظام كاشير فقط.",

      optFocus1: "ملابس وإكسسوارات",
      optFocus1s: "ملابس وأحذية وساعات ومجوهرات.",
      optFocus2: "منزل وحديقة",
      optFocus2s: "ديكور وأدوات مطبخ وأثاث.",
      optFocus3: "جمال وعناية",
      optFocus3s: "عناية بالبشرة ومنتجات شخصية.",
      optFocus4: "إلكترونيات وأجهزة",
      optFocus4s: "أجهزة وتقنيات حديثة.",

      plan1: "1 – 5 منتج",
      plan1s: "مثالي لمتجر بوتيك أو إطلاق منتج واحد.",
      plan2: "5 – 20 منتج",
      plan2s: "مناسب للمجموعات الصغيرة والعلامات النامية.",
      plan3: "20 – 100 منتج",
      plan3s: "كتالوج شامل للمتاجر الراسخة.",
      plan4: "100 – 300 منتج",
      plan4s: "مخزون كبير بتصنيفات متعددة.",
      plan5: "300 – 750 منتج",
      plan5s: "إدارة منتجات على مستوى المؤسسات.",

      email: "البريد الإلكتروني",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      password: "أنشئ كلمة مرور",
      storeName: "اسم المتجر",
      storeLogo: "شعار المتجر",
      brandColor: "لون العلامة التجارية",

      signinTitle: "مرحبًا بعودتك",
      signinSub: "سجّل الدخول إلى لوحة تحكم متجرك.",
      signinCta: "تسجيل الدخول",
      forgot: "نسيت كلمة المرور؟",
      resetTitle: "استعادة كلمة المرور",
      resetSub: "أدخل بريدك وسنرسل لك رابط الاستعادة.",
      resetCta: "أرسل رابط الاستعادة",
      resetSent: "تم إرسال الرابط",
      resetSentTo: "تحقق من بريدك على",
      openMail: "افتح Gmail",

      haveAccount: "لديك حساب بالفعل؟",
      noAccount: "ليس لديك حساب؟",
      doSignin: "تسجيل الدخول",
      doSignup: "إنشاء حساب",
    },
  };

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
    const l = lang();
    return STR[l] && STR[l][key] !== undefined
      ? STR[l][key]
      : STR.en[key] || key;
  }

  /* ---------------------------------------------------------------------
     3) STYLE — everything routed through identity.css tokens
     --------------------------------------------------------------------- */
  const CSS = `
  /* ===== HINT BANNER ===== */
  #${ID_HINT} {
    position: fixed;
    top: 72px;
    left: 50%;
    transform: translate(-50%, -12px);
    z-index: 9400;
    width: calc(100% - 32px);
    max-width: 720px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    background: linear-gradient(180deg, rgba(15,17,26,0.96), rgba(10,12,20,0.96));
    border: 1px solid var(--brand-tint-28);
    border-radius: var(--r-lg);
    box-shadow:
      0 24px 60px -20px rgba(0,0,0,0.9),
      0 0 40px -12px var(--brand-tint-35),
      inset 0 1px 0 rgba(255,255,255,0.06);
    color: var(--paper);
    font-family: var(--font-latin);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity var(--dur-slow) var(--ease-out-quint),
      transform var(--dur-slow) var(--ease-out-quint);
  }
  #${ID_HINT}.is-visible {
    opacity: 1;
    transform: translate(-50%, 0);
    pointer-events: auto;
  }
  #${ID_HINT}.is-hidden {
    opacity: 0;
    transform: translate(-50%, -20px);
    pointer-events: none;
  }
  #${ID_HINT} .mh-icon {
    flex-shrink: 0;
    width: 38px; height: 38px;
    border-radius: 12px;
    background: var(--brand-gradient-135);
    color: var(--void);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  #${ID_HINT} .mh-body { flex: 1; min-width: 0; }
  #${ID_HINT} .mh-title {
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0 0 2px;
  }
  #${ID_HINT} .mh-text {
    font-size: 12.5px;
    color: var(--ash);
    line-height: 1.5;
    margin: 0;
  }
  #${ID_HINT} .mh-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  #${ID_HINT} .mh-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    background: var(--brand-tint-12);
    border: 1px solid var(--brand-tint-35);
    border-radius: var(--r-pill);
    color: #93c5fd;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: background var(--dur-fast) ease, border-color var(--dur-fast) ease, color var(--dur-fast) ease;
    white-space: nowrap;
  }
  #${ID_HINT} .mh-link:hover {
    background: var(--brand-tint-28);
    border-color: var(--brand-tint-45);
    color: var(--paper);
  }
  #${ID_HINT} .mh-dismiss {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: var(--surface-2);
    border: 1px solid var(--border-1);
    color: var(--ash);
    font-size: 13px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-fast) ease;
  }
  #${ID_HINT} .mh-dismiss:hover {
    background: var(--surface-3);
    color: var(--paper);
    transform: rotate(90deg);
  }
  @media (max-width: 640px) {
    #${ID_HINT} { flex-direction: column; align-items: flex-start; gap: 10px; }
    #${ID_HINT} .mh-actions { align-self: stretch; justify-content: space-between; }
    #${ID_HINT} .mh-link { flex: 1; justify-content: center; }
  }

  /* ===== MODAL SHELL ===== */
  #${ID_MODAL} {
    position: fixed;
    inset: 0;
    z-index: 9700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(4,5,10,0.72);
    backdrop-filter: blur(16px) saturate(130%);
    -webkit-backdrop-filter: blur(16px) saturate(130%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s var(--ease-out-quint);
  }
  #${ID_MODAL}.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  #${ID_MODAL} .msm-panel {
    position: relative;
    width: 100%;
    max-width: 480px;
    max-height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: linear-gradient(180deg, #0d0f18 0%, var(--ink) 100%);
    border: 1px solid var(--border-2);
    border-radius: 26px;
    box-shadow:
      0 50px 140px -40px rgba(0,0,0,0.95),
      0 0 120px -40px var(--brand-tint-45),
      inset 0 1px 0 rgba(255,255,255,0.06);
    color: var(--paper);
    font-family: var(--font-latin);
    transform: translateY(16px) scale(0.98);
    opacity: 0;
    /* Height is only set as an inline style during step transitions.
       The transition on height below makes those transitions smooth. */
    transition:
      transform var(--dur-slow) var(--ease-out-quint),
      opacity 0.35s ease,
      height ${PANEL_HEIGHT_MS}ms var(--ease-out-quint);
  }
  #${ID_MODAL}.is-open .msm-panel {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  #${ID_MODAL} .msm-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--brand-blue), transparent);
    pointer-events: none;
  }

  /* Progress rail */
  #${ID_MODAL} .msm-progress {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 18px 56px 4px 22px;
  }
  #${ID_MODAL} .msm-progress .msm-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--border-3);
    transition: background var(--dur-base) ease, box-shadow var(--dur-base) ease, transform var(--dur-base) ease;
  }
  #${ID_MODAL} .msm-progress .msm-dot.is-active {
    background: var(--paper);
    box-shadow: 0 0 12px var(--paper);
    transform: scale(1.3);
  }
  #${ID_MODAL} .msm-progress .msm-dot.is-past {
    background: rgba(255,255,255,0.6);
  }
  #${ID_MODAL} .msm-progress .msm-line {
    flex: 1;
    height: 1px;
    background: var(--border-3);
    transition: background var(--dur-base) ease;
  }
  #${ID_MODAL} .msm-progress .msm-line.is-past {
    background: var(--brand-tint-45);
  }

  /* Header */
  #${ID_MODAL} .msm-head {
    padding: 18px 22px 4px;
  }
  #${ID_MODAL} .msm-title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 6px;
    background: var(--grad-text-light);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  #${ID_MODAL} .msm-sub {
    font-size: 13px;
    color: var(--ash);
    margin: 0;
    line-height: 1.5;
  }
  #${ID_MODAL} .msm-close {
    position: absolute;
    top: 14px; inset-inline-end: 14px;
    width: 34px; height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-2);
    border: 1px solid var(--border-1);
    border-radius: 50%;
    color: var(--ash);
    font-size: 15px;
    cursor: pointer;
    z-index: 3;
    transition: background var(--dur-fast) ease, color var(--dur-fast) ease, transform var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-close:hover {
    background: var(--surface-3);
    color: var(--paper);
    transform: rotate(90deg);
  }

  /* In-modal note — sticky reminder of who this flow is for */
  #${ID_MODAL} .msm-note {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 14px 22px 4px;
    padding: 10px 12px;
    background: var(--brand-tint-08);
    border: 1px solid var(--brand-tint-28);
    border-radius: var(--r-md);
    font-size: 12px;
    line-height: 1.4;
    color: rgba(255,255,255,0.78);
    transition: opacity var(--dur-base) ease;
  }
  #${ID_MODAL} .msm-note .msm-note-ico {
    color: var(--brand-sky);
    font-size: 15px;
    flex-shrink: 0;
    line-height: 1;
  }
  #${ID_MODAL} .msm-note .msm-note-text {
    flex: 1;
    min-width: 0;
  }
  #${ID_MODAL} .msm-note .msm-note-link {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 11px;
    background: var(--brand-tint-16);
    border: 1px solid var(--brand-tint-35);
    border-radius: var(--r-pill);
    color: #93c5fd;
    font-size: 11px;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: -0.01em;
    white-space: nowrap;
    transition: background var(--dur-fast) ease, border-color var(--dur-fast) ease, color var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-note .msm-note-link:hover {
    background: var(--brand-tint-28);
    border-color: var(--brand-tint-45);
    color: var(--paper);
  }
  @media (max-width: 480px) {
    #${ID_MODAL} .msm-note {
      flex-wrap: wrap;
    }
    #${ID_MODAL} .msm-note .msm-note-link {
      margin-inline-start: 25px;
    }
  }

  /* Body */
  #${ID_MODAL} .msm-body {
    padding: 14px 22px 8px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
    scrollbar-width: thin;
    scrollbar-color: var(--surface-3) transparent;
  }
  #${ID_MODAL} .msm-body::-webkit-scrollbar { width: 6px; }
  #${ID_MODAL} .msm-body::-webkit-scrollbar-thumb {
    background: var(--surface-3);
    border-radius: 3px;
  }

  /* Option cards */
  #${ID_MODAL} .msm-opt {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    margin-bottom: 10px;
    background: var(--surface-1);
    border: 1px solid var(--border-1);
    border-radius: 14px;
    cursor: pointer;
    transition:
      background var(--dur-fast) ease,
      border-color var(--dur-fast) ease,
      transform var(--dur-base) var(--ease-out-quint);
  }
  #${ID_MODAL} .msm-opt:hover {
    background: var(--surface-2);
    border-color: var(--border-2);
    transform: translateY(-1px);
  }
  #${ID_MODAL} .msm-opt.is-selected {
    background: var(--brand-tint-10);
    border-color: var(--brand-tint-45);
    box-shadow: inset 0 0 0 1px var(--brand-tint-16);
  }
  #${ID_MODAL} .msm-opt-body { min-width: 0; }
  #${ID_MODAL} .msm-opt-title {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  #${ID_MODAL} .msm-opt-title .msm-price {
    font-size: 10.5px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: var(--r-pill);
    background: var(--brand-tint-16);
    border: 1px solid var(--brand-tint-28);
    color: #93c5fd;
  }
  #${ID_MODAL} .msm-opt-sub {
    font-size: 12px;
    color: var(--ash);
    margin: 0;
    line-height: 1.4;
  }
  #${ID_MODAL} .msm-opt-check {
    flex-shrink: 0;
    width: 22px; height: 22px;
    border-radius: var(--r-sm);
    border: 1.5px solid var(--border-3);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    transition: background var(--dur-fast) ease, border-color var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-opt.is-selected .msm-opt-check {
    background: var(--brand-blue);
    border-color: var(--brand-blue);
    color: var(--paper);
  }
  #${ID_MODAL} .msm-opt-check i {
    font-size: 13px;
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
  #${ID_MODAL} .msm-opt.is-selected .msm-opt-check i {
    opacity: 1;
    transform: scale(1);
  }

  /* Fields */
  #${ID_MODAL} .msm-field { margin-bottom: 14px; }
  #${ID_MODAL} .msm-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--dim);
    margin: 0 0 8px 4px;
  }
  #${ID_MODAL} .msm-input {
    width: 100%;
    padding: 14px 16px;
    background: var(--surface-1);
    border: 1px solid var(--border-2);
    border-radius: 12px;
    color: var(--paper);
    font-family: inherit;
    font-size: 14.5px;
    outline: none;
    transition: border-color var(--dur-fast) ease, background var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-input::placeholder { color: rgba(255,255,255,0.28); }
  #${ID_MODAL} .msm-input:focus {
    border-color: var(--brand-tint-45);
    background: var(--brand-tint-05);
  }
  #${ID_MODAL} .msm-input.is-error {
    border-color: var(--alert);
    background: rgba(248,113,113,0.04);
  }
  #${ID_MODAL} .msm-row { display: flex; gap: 10px; }
  #${ID_MODAL} .msm-row .msm-field { flex: 1; }
  #${ID_MODAL} .msm-pass-wrap { position: relative; }
  #${ID_MODAL} .msm-pass-toggle {
    position: absolute;
    top: 50%;
    inset-inline-end: 12px;
    transform: translateY(-50%);
    background: transparent;
    border: 0;
    color: var(--dim);
    font-size: 15px;
    cursor: pointer;
    padding: 4px;
    transition: color var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-pass-toggle:hover { color: var(--paper); }

  /* Logo + brand color */
  #${ID_MODAL} .msm-logo-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  #${ID_MODAL} .msm-logo-drop {
    position: relative;
    width: 96px; height: 96px;
    border-radius: 50%;
    border: 2px dashed var(--border-3);
    background: var(--surface-1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    transition: border-color var(--dur-fast) ease, background var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-logo-drop:hover {
    border-color: var(--brand-tint-45);
    background: var(--brand-tint-05);
  }
  #${ID_MODAL} .msm-logo-drop img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${ID_MODAL} .msm-logo-drop > i {
    font-size: 26px;
    color: var(--dim);
  }
  #${ID_MODAL} .msm-logo-badge {
    position: absolute;
    bottom: 0; right: 0;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--paper);
    color: var(--void);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    border: 3px solid var(--ink);
  }
  #${ID_MODAL} .msm-logo-cap {
    font-size: 11px;
    color: var(--dim);
    margin-top: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  #${ID_MODAL} .msm-colors {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    background: var(--surface-1);
    border: 1px solid var(--border-1);
    border-radius: 14px;
    flex-wrap: wrap;
  }
  #${ID_MODAL} .msm-swatches { display: flex; gap: 10px; }
  #${ID_MODAL} .msm-swatch {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform var(--dur-fast) ease, border-color var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-swatch:hover { transform: scale(1.12); }
  #${ID_MODAL} .msm-swatch.is-selected {
    border-color: var(--paper);
    transform: scale(1.12);
  }
  #${ID_MODAL} .msm-hex {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-inline-start: 12px;
    border-inline-start: 1px solid var(--border-2);
  }
  #${ID_MODAL} .msm-hex-dot {
    width: 14px; height: 14px;
    border-radius: 50%;
    background: var(--brand-blue);
  }
  #${ID_MODAL} .msm-hex-input {
    width: 82px;
    background: transparent;
    border: 0;
    color: var(--paper);
    font-family: ui-monospace, monospace;
    font-size: 12px;
    outline: none;
  }

  /* Success card */
  #${ID_MODAL} .msm-success {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.24);
    border-radius: 14px;
    margin-top: 14px;
  }
  #${ID_MODAL} .msm-success i {
    color: var(--live);
    font-size: 18px;
    margin-top: 2px;
    flex-shrink: 0;
  }
  #${ID_MODAL} .msm-success-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--live);
    margin: 0 0 4px;
  }
  #${ID_MODAL} .msm-success-text {
    font-size: 12.5px;
    color: rgba(255,255,255,0.7);
    line-height: 1.55;
    margin: 0 0 10px;
  }
  #${ID_MODAL} .msm-success-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    color: var(--live);
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-success-link:hover { color: #86efac; }

  /* Footer */
  #${ID_MODAL} .msm-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 22px 20px;
    border-top: 1px solid var(--border-1);
    margin-top: 8px;
  }
  #${ID_MODAL} .msm-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: transparent;
    border: 0;
    color: rgba(255,255,255,0.4);
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 10px;
    transition: color var(--dur-fast) ease, background var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-back:hover {
    color: var(--paper);
    background: var(--surface-1);
  }
  #${ID_MODAL} .msm-next {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-inline-start: auto;
    padding: 13px 22px;
    background: var(--paper);
    color: #000;
    border: 0;
    border-radius: var(--r-pill);
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background var(--dur-fast) ease, transform var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-next:hover {
    background: #E5E5E5;
    transform: scale(0.98);
  }
  #${ID_MODAL} .msm-next:disabled {
    opacity: 0.5;
    cursor: wait;
  }

  /* Foot switch */
  #${ID_MODAL} .msm-switch {
    text-align: center;
    padding: 0 22px 18px;
    font-size: 13px;
    color: rgba(255,255,255,0.4);
  }
  #${ID_MODAL} .msm-switch button {
    background: transparent;
    border: 0;
    color: var(--paper);
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    padding: 0 4px;
    transition: color var(--dur-fast) ease;
  }
  #${ID_MODAL} .msm-switch button:hover { color: #93c5fd; }

  /* Mobile */
  @media (max-width: 480px) {
    #${ID_MODAL} { padding: 12px; }
    #${ID_MODAL} .msm-panel { border-radius: 22px; }
    #${ID_MODAL} .msm-title { font-size: 18px; }
    #${ID_MODAL} .msm-next { padding: 12px 18px; font-size: 13.5px; }
  }

  @media (prefers-reduced-motion: reduce) {
    #${ID_HINT}, #${ID_HINT} *,
    #${ID_MODAL}, #${ID_MODAL} * {
      transition-duration: 0.001ms !important;
      animation-duration: 0.001ms !important;
    }
  }
  `;

  /* ---------------------------------------------------------------------
     4) STEP DEFINITIONS
     --------------------------------------------------------------------- */
  function buildSteps() {
    return [
      /* 1 · channels */
      {
        key: "channels",
        render: () => ({
          title: t("step1Title"),
          sub: t("step1Sub"),
          html: options(
            [
              { t: t("optChannels1"), s: t("optChannels1s") },
              { t: t("optChannels2"), s: t("optChannels2s") },
              { t: t("optChannels3"), s: t("optChannels3s") },
            ],
            state.data.channels,
          ),
        }),
      },
      /* 2 · email */
      {
        fields: ["email"],
        render: () => ({
          title: t("step2Title"),
          sub: t("step2Sub"),
          html: field({
            id: "email",
            type: "email",
            value: state.data.email || "",
            placeholder: "name@gmail.com",
            label: t("email"),
          }),
        }),
      },
      /* 3 · name + password */
      {
        fields: ["firstName", "lastName", "password"],
        render: () => ({
          title: t("step3Title"),
          sub: t("step3Sub"),
          html: `
            <div class="msm-row">
              <div class="msm-field">
                <label class="msm-label">${t("firstName")}</label>
                <input type="text" id="firstName" class="msm-input" value="${escapeAttr(state.data.firstName || "")}" placeholder="${t("firstName")}">
              </div>
              <div class="msm-field">
                <label class="msm-label">${t("lastName")}</label>
                <input type="text" id="lastName" class="msm-input" value="${escapeAttr(state.data.lastName || "")}" placeholder="${t("lastName")}">
              </div>
            </div>
            <div class="msm-field">
              <label class="msm-label">${t("password")}</label>
              <div class="msm-pass-wrap">
                <input type="password" id="password" class="msm-input" value="${escapeAttr(state.data.password || "")}" placeholder="••••••••">
                <button type="button" class="msm-pass-toggle" aria-label="Toggle password"><i class="bi bi-eye"></i></button>
              </div>
            </div>
          `,
        }),
      },
      /* 4 · focus */
      {
        key: "focus",
        render: () => ({
          title: t("step4Title"),
          sub: t("step4Sub"),
          html: options(
            [
              { t: t("optFocus1"), s: t("optFocus1s") },
              { t: t("optFocus2"), s: t("optFocus2s") },
              { t: t("optFocus3"), s: t("optFocus3s") },
              { t: t("optFocus4"), s: t("optFocus4s") },
            ],
            state.data.focus,
          ),
        }),
      },
      /* 5 · inventory */
      {
        key: "inventory",
        render: () => ({
          title: t("step5Title"),
          sub: t("step5Sub"),
          html: options(
            [
              { t: t("plan1"), s: t("plan1s"), p: "50 EGP/mo", id: "plan1" },
              { t: t("plan2"), s: t("plan2s"), p: "150 EGP/mo", id: "plan2" },
              { t: t("plan3"), s: t("plan3s"), p: "250 EGP/mo", id: "plan3" },
              { t: t("plan4"), s: t("plan4s"), p: "650 EGP/mo", id: "plan4" },
              { t: t("plan5"), s: t("plan5s"), p: "1200 EGP/mo", id: "plan5" },
            ],
            state.data.inventory,
          ),
        }),
      },
      /* 6 · store name */
      {
        fields: ["storeName"],
        render: () => ({
          title: t("step6Title"),
          sub: t("step6Sub"),
          html: field({
            id: "storeName",
            value: state.data.storeName || "",
            placeholder: "My Awesome Store",
            label: t("storeName"),
          }),
        }),
      },
      /* 7 · logo + color */
      {
        render: () => ({
          title: t("step7Title"),
          sub: t("step7Sub"),
          html: `
            <div class="msm-logo-row">
              <div class="msm-logo-drop" id="msmLogoDrop">
                ${
                  state.data.storeLogo
                    ? `<img src="${escapeAttr(typeof state.data.storeLogo === "string" ? state.data.storeLogo : "")}">`
                    : `<i class="bi bi-cloud-arrow-up"></i>`
                }
                <span class="msm-logo-badge"><i class="bi bi-camera-fill"></i></span>
                <input type="file" id="msmLogoInput" accept="image/*" style="display:none">
              </div>
              <p class="msm-logo-cap">${t("storeLogo")}</p>
            </div>
            <div class="msm-field">
              <label class="msm-label">${t("brandColor")}</label>
              <div class="msm-colors">
                <div class="msm-swatches">
                  ${["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"]
                    .map(
                      (c) => `
                    <button type="button" class="msm-swatch ${state.data.brandColor === c ? "is-selected" : ""}"
                            data-color="${c}" style="background:${c}" aria-label="${c}"></button>
                  `,
                    )
                    .join("")}
                </div>
                <div class="msm-hex">
                  <span class="msm-hex-dot" id="msmHexDot" style="background:${state.data.brandColor || "#3b82f6"}"></span>
                  <input type="text" id="msmHexInput" class="msm-hex-input" value="${escapeAttr(state.data.brandColor || "#3b82f6")}" maxlength="7">
                </div>
              </div>
            </div>
          `,
        }),
      },
    ];
  }

  /* ---------------------------------------------------------------------
     5) RENDER HELPERS
     --------------------------------------------------------------------- */
  function escapeAttr(s) {
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

  function field({ id, value, placeholder, label, type = "text" }) {
    return `
      <div class="msm-field">
        <label class="msm-label" for="${id}">${label}</label>
        <input type="${type}" id="${id}" class="msm-input" value="${escapeAttr(value)}" placeholder="${placeholder}">
      </div>
    `;
  }

  function options(opts, current) {
    return opts
      .map((o) => {
        const sel = current === o.t;
        return `
        <div class="msm-opt ${sel ? "is-selected" : ""}"
             data-value="${escapeAttr(o.t)}"
             data-price="${escapeAttr(o.p || "")}"
             data-planid="${escapeAttr(o.id || "")}">
          <div class="msm-opt-body">
            <p class="msm-opt-title">
              ${o.t}
              ${o.p ? `<span class="msm-price">${o.p}</span>` : ""}
            </p>
            ${o.s ? `<p class="msm-opt-sub">${o.s}</p>` : ""}
          </div>
          <span class="msm-opt-check"><i class="bi bi-check-lg"></i></span>
        </div>
      `;
      })
      .join("");
  }

  /* ---------------------------------------------------------------------
     6) STATE + DOM
     --------------------------------------------------------------------- */
  let steps = [];
  const state = { mode: "signup", step: 0, data: {}, submitting: false };
  let modalEl, panelEl, hintEl;
  let lastFocused = null;

  function injectStyle() {
    if (document.getElementById(ID_STYLE)) return;
    const s = document.createElement("style");
    s.id = ID_STYLE;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---- Hint banner (outside the modal) ---- */
  function buildHint() {
    if (document.getElementById(ID_HINT)) return;
    if (localStorage.getItem(HINT_KEY) === "1") return;

    hintEl = document.createElement("div");
    hintEl.id = ID_HINT;
    hintEl.setAttribute("role", "status");
    hintEl.innerHTML = `
      <div class="mh-icon"><i class="bi bi-shop-window"></i></div>
      <div class="mh-body">
        <p class="mh-title">${t("hintTitle")}</p>
        <p class="mh-text">${t("hintBody")}</p>
      </div>
      <div class="mh-actions">
        <a class="mh-link" href="${STORES_URL}" target="_blank" rel="noopener">
          <i class="bi bi-bag"></i>
          <span>${t("hintLink")}</span>
        </a>
        <button class="mh-dismiss" type="button" aria-label="${t("hintDismiss")}">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    `;
    document.body.appendChild(hintEl);

    hintEl.querySelector(".mh-dismiss").addEventListener("click", () => {
      hintEl.classList.remove("is-visible");
      hintEl.classList.add("is-hidden");
      localStorage.setItem(HINT_KEY, "1");
    });

    setTimeout(() => hintEl.classList.add("is-visible"), 900);
  }

  /* ---- Modal shell ---- */
  function buildModal() {
    if (document.getElementById(ID_MODAL)) return;
    modalEl = document.createElement("div");
    modalEl.id = ID_MODAL;
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `<div class="msm-panel" role="document"></div>`;
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) close();
    });
    document.body.appendChild(modalEl);
    panelEl = modalEl.querySelector(".msm-panel");
  }

  /* ---------------------------------------------------------------------
     7) RENDER + HEIGHT ANIMATION
     --------------------------------------------------------------------- */
  function renderView() {
    if (!panelEl) return;
    if (state.mode === "signin") return renderSignin();
    if (state.mode === "reset") return renderReset();
    return renderSignup();
  }

  /**
   * Freezes the panel's current height, swaps content, measures the new
   * natural height, then animates between them. Intermediate layout passes
   * never paint, so there is no visible jump.
   */
  function withHeightTransition(fn) {
    if (!panelEl) {
      fn();
      return;
    }

    // 1. Freeze current height
    const startH = panelEl.offsetHeight;
    if (startH > 0) {
      panelEl.style.height = startH + "px";
      panelEl.style.overflow = "hidden";
    }
    void panelEl.offsetHeight; // flush so browser knows we're fixed

    // 2. Swap content
    fn();

    // 3. Temporarily unfreeze to measure natural height
    panelEl.style.height = "";
    const maxH = window.innerHeight - 48;
    const endH = Math.min(panelEl.offsetHeight, maxH);

    // 4. Re-freeze at startH (no paint yet)
    panelEl.style.height = startH + "px";
    void panelEl.offsetHeight;

    // 5. Animate to endH
    panelEl.style.height = endH + "px";

    // 6. Release after transition so future content changes are free
    clearTimeout(panelEl.__hTimer);
    panelEl.__hTimer = setTimeout(() => {
      panelEl.style.height = "";
      panelEl.style.overflow = "";
    }, PANEL_HEIGHT_MS + 60);
  }

  function render() {
    if (!panelEl) return;
    // No animation before the modal is visible (nothing to animate from)
    if (!modalEl.classList.contains("is-open")) {
      renderView();
      return;
    }
    withHeightTransition(renderView);
  }

  function progressHtml() {
    if (state.mode !== "signup") return "";
    const total = steps.length;
    const items = [];
    for (let i = 0; i < total; i++) {
      const cls =
        i === state.step ? "is-active" : i < state.step ? "is-past" : "";
      items.push(`<span class="msm-dot ${cls}"></span>`);
      if (i < total - 1) {
        items.push(
          `<span class="msm-line ${i < state.step ? "is-past" : ""}"></span>`,
        );
      }
    }
    return `<div class="msm-progress">${items.join("")}</div>`;
  }

  /* In-modal note about avoiding lost customers — sticky inside the signup flow */
  function noteHtml() {
    if (state.mode !== "signup") return "";
    return `
      <div class="msm-note" role="note">
        <i class="bi bi-info-circle msm-note-ico" aria-hidden="true"></i>
        <span class="msm-note-text">${t("modalNote")}</span>
        <a class="msm-note-link" href="${STORES_URL}" target="_blank" rel="noopener">
          <span>${t("hintLink")}</span>
          <i class="bi bi-arrow-${lang() === "ar" ? "left" : "right"}-short"></i>
        </a>
      </div>
    `;
  }

  function renderSignup() {
    const step = steps[state.step];
    const built = step.render();

    panelEl.innerHTML = `
      <button class="msm-close" type="button" aria-label="${t("close")}"><i class="bi bi-x-lg"></i></button>
      ${progressHtml()}
      <div class="msm-head">
        <h2 class="msm-title">${built.title}</h2>
        <p class="msm-sub">${built.sub}</p>
      </div>
      ${noteHtml()}
      <div class="msm-body">${built.html}</div>
      <div class="msm-foot">
        <button class="msm-back" type="button" style="${state.step === 0 ? "visibility:hidden" : ""}">
          <i class="bi bi-arrow-${lang() === "ar" ? "right" : "left"}-short"></i>
          <span>${t("back")}</span>
        </button>
        <button class="msm-next" type="button">
          <span>${state.step === steps.length - 1 ? "Pay 1650 EGP" : t("continue")}</span>
          <i class="bi bi-arrow-${lang() === "ar" ? "left" : "right"}-short"></i>
        </button>
      </div>
      <div class="msm-switch">
        ${t("haveAccount")} <button type="button" data-switch="signin">${t("doSignin")}</button>
      </div>
    `;
    bindSignupEvents();
  }

  function renderSignin() {
    panelEl.innerHTML = `
      <button class="msm-close" type="button" aria-label="${t("close")}"><i class="bi bi-x-lg"></i></button>
      <div class="msm-head">
        <h2 class="msm-title">${t("signinTitle")}</h2>
        <p class="msm-sub">${t("signinSub")}</p>
      </div>
      <div class="msm-body">
        ${field({ id: "signinEmail", label: t("email"), placeholder: "name@gmail.com", type: "email" })}
        <div class="msm-field">
          <label class="msm-label">${t("password")}</label>
          <div class="msm-pass-wrap">
            <input type="password" id="signinPassword" class="msm-input" placeholder="••••••••">
            <button type="button" class="msm-pass-toggle" aria-label="Toggle password"><i class="bi bi-eye"></i></button>
          </div>
        </div>
        <div style="text-align:end;margin-top:-4px">
          <button type="button" id="msmForgot" style="background:transparent;border:0;color:rgba(255,255,255,0.4);font-size:12.5px;cursor:pointer;font-family:inherit;padding:4px 0">
            ${t("forgot")}
          </button>
        </div>
      </div>
      <div class="msm-foot">
        <button class="msm-back" type="button" style="visibility:hidden">
          <span>${t("back")}</span>
        </button>
        <button class="msm-next" type="button" id="msmSigninSubmit">
          <span>${t("signinCta")}</span>
          <i class="bi bi-box-arrow-in-right"></i>
        </button>
      </div>
      <div class="msm-switch">
        ${t("noAccount")} <button type="button" data-switch="signup">${t("doSignup")}</button>
      </div>
    `;
    bindSigninEvents();
  }

  function renderReset() {
    panelEl.innerHTML = `
      <button class="msm-close" type="button" aria-label="${t("close")}"><i class="bi bi-x-lg"></i></button>
      <div class="msm-head">
        <h2 class="msm-title">${t("resetTitle")}</h2>
        <p class="msm-sub">${t("resetSub")}</p>
      </div>
      <div class="msm-body">
        ${field({ id: "resetEmail", label: t("email"), placeholder: "name@gmail.com", type: "email" })}
        <div id="msmResetStatus"></div>
      </div>
      <div class="msm-foot">
        <button class="msm-back" type="button" id="msmResetBack">
          <i class="bi bi-arrow-${lang() === "ar" ? "right" : "left"}-short"></i>
          <span>${t("back")}</span>
        </button>
        <button class="msm-next" type="button" id="msmResetSubmit">
          <span>${t("resetCta")}</span>
          <i class="bi bi-envelope"></i>
        </button>
      </div>
    `;
    bindResetEvents();
  }

  /* ---------------------------------------------------------------------
     8) EVENT BINDING
     --------------------------------------------------------------------- */
  function closeBtn() {
    const b = panelEl.querySelector(".msm-close");
    if (b) b.addEventListener("click", close);
  }
  function switchBtn() {
    panelEl.querySelectorAll("[data-switch]").forEach((b) => {
      b.addEventListener("click", () => {
        state.mode = b.getAttribute("data-switch");
        state.step = 0;
        render();
      });
    });
  }

  function bindSignupEvents() {
    closeBtn();
    switchBtn();

    panelEl.querySelectorAll(".msm-opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        const step = steps[state.step];
        if (!step.key) return;
        panelEl
          .querySelectorAll(".msm-opt")
          .forEach((o) => o.classList.remove("is-selected"));
        opt.classList.add("is-selected");
        state.data[step.key] = opt.dataset.value;
        if (step.key === "inventory") {
          state.data.planPrice = opt.dataset.price;
          state.data.planId = opt.dataset.planid;
        }
      });
    });

    const passToggle = panelEl.querySelector(".msm-pass-toggle");
    const passInput = panelEl.querySelector("#password");
    if (passToggle && passInput) {
      passToggle.addEventListener("click", () => {
        const isPass = passInput.type === "password";
        passInput.type = isPass ? "text" : "password";
        passToggle.querySelector("i").className = isPass
          ? "bi bi-eye-slash"
          : "bi bi-eye";
      });
    }

    const logoDrop = panelEl.querySelector("#msmLogoDrop");
    const logoInput = panelEl.querySelector("#msmLogoInput");
    if (logoDrop && logoInput) {
      logoDrop.addEventListener("click", () => logoInput.click());
      logoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        state.data.storeLogoFile = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
          state.data.storeLogo = ev.target.result;
          const img = logoDrop.querySelector("img");
          if (img) img.src = ev.target.result;
          else
            logoDrop.insertAdjacentHTML(
              "afterbegin",
              `<img src="${ev.target.result}">`,
            );
        };
        reader.readAsDataURL(file);
      });
    }

    panelEl.querySelectorAll(".msm-swatch").forEach((sw) => {
      sw.addEventListener("click", () => {
        const c = sw.dataset.color;
        state.data.brandColor = c;
        panelEl
          .querySelectorAll(".msm-swatch")
          .forEach((x) => x.classList.remove("is-selected"));
        sw.classList.add("is-selected");
        const dot = panelEl.querySelector("#msmHexDot");
        const hex = panelEl.querySelector("#msmHexInput");
        if (dot) dot.style.background = c;
        if (hex) hex.value = c.toUpperCase();
      });
    });
    const hexInput = panelEl.querySelector("#msmHexInput");
    if (hexInput) {
      hexInput.addEventListener("input", () => {
        const v = hexInput.value.trim();
        if (/^#([0-9A-F]{3}){1,2}$/i.test(v)) {
          state.data.brandColor = v;
          const dot = panelEl.querySelector("#msmHexDot");
          if (dot) dot.style.background = v;
          panelEl
            .querySelectorAll(".msm-swatch")
            .forEach((x) => x.classList.remove("is-selected"));
        }
      });
    }

    panelEl.querySelector(".msm-back").addEventListener("click", () => {
      if (state.step > 0) {
        state.step--;
        render();
      }
    });

    panelEl.querySelector(".msm-next").addEventListener("click", () => {
      if (state.submitting) return;
      if (!captureAndValidate()) return;
      if (state.step < steps.length - 1) {
        state.step++;
        render();
      } else {
        submit("signup");
      }
    });
  }

  function bindSigninEvents() {
    closeBtn();
    switchBtn();

    const passToggle = panelEl.querySelector(".msm-pass-toggle");
    const passInput = panelEl.querySelector("#signinPassword");
    if (passToggle && passInput) {
      passToggle.addEventListener("click", () => {
        const isPass = passInput.type === "password";
        passInput.type = isPass ? "text" : "password";
        passToggle.querySelector("i").className = isPass
          ? "bi bi-eye-slash"
          : "bi bi-eye";
      });
    }

    panelEl.querySelector("#msmForgot").addEventListener("click", () => {
      state.mode = "reset";
      render();
    });

    panelEl.querySelector("#msmSigninSubmit").addEventListener("click", () => {
      const emailEl = panelEl.querySelector("#signinEmail");
      const passEl = panelEl.querySelector("#signinPassword");
      let ok = true;
      if (!emailEl.value.trim()) {
        emailEl.classList.add("is-error");
        ok = false;
      } else emailEl.classList.remove("is-error");
      if (!passEl.value.trim()) {
        passEl.classList.add("is-error");
        ok = false;
      } else passEl.classList.remove("is-error");
      if (!ok) return;
      state.data.email = emailEl.value.trim();
      state.data.password = passEl.value;
      submit("signin");
    });
  }

  function bindResetEvents() {
    closeBtn();
    panelEl.querySelector("#msmResetBack").addEventListener("click", () => {
      state.mode = "signin";
      render();
    });
    panelEl.querySelector("#msmResetSubmit").addEventListener("click", () => {
      const emailEl = panelEl.querySelector("#resetEmail");
      const email = emailEl.value.trim();
      if (!email || !email.includes("@")) {
        emailEl.classList.add("is-error");
        return;
      }
      emailEl.classList.remove("is-error");

      const status = panelEl.querySelector("#msmResetStatus");
      const btn = panelEl.querySelector("#msmResetSubmit");
      btn.disabled = true;
      btn.querySelector("span").textContent = t("processing");

      const cb = (global.MatagerSigningConfig || {}).onForgotPassword;
      const promise = cb ? cb(email) : Promise.resolve();

      promise
        .then(() => {
          status.innerHTML = `
          <div class="msm-success">
            <i class="bi bi-check-circle-fill"></i>
            <div>
              <p class="msm-success-title">${t("resetSent")}</p>
              <p class="msm-success-text">${t("resetSentTo")} <strong style="color:#fff">${email}</strong></p>
              <a class="msm-success-link" href="https://mail.google.com/mail/u/0/#search/from%3AMatager+reset" target="_blank" rel="noopener">
                <span>${t("openMail")}</span>
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
          </div>
        `;
          btn.disabled = false;
          btn.querySelector("span").textContent = t("resetCta");
          // Grow panel smoothly to fit the success card
          if (modalEl && modalEl.classList.contains("is-open")) {
            withHeightTransition(() => {}); // re-measure
          }
        })
        .catch(() => {
          btn.disabled = false;
          btn.querySelector("span").textContent = t("resetCta");
        });
    });
  }

  /* ---------------------------------------------------------------------
     9) CAPTURE + VALIDATE
     --------------------------------------------------------------------- */
  function captureAndValidate() {
    const step = steps[state.step];
    let ok = true;

    if (step.fields) {
      step.fields.forEach((id) => {
        const el = panelEl.querySelector("#" + id);
        if (el) state.data[id] = el.value.trim();
      });
    }

    if (step.fields) {
      step.fields.forEach((id) => {
        const el = panelEl.querySelector("#" + id);
        if (!el) return;
        if (!el.value.trim()) {
          el.classList.add("is-error");
          el.addEventListener("input", () => el.classList.remove("is-error"), {
            once: true,
          });
          ok = false;
        } else {
          el.classList.remove("is-error");
        }
      });
    }

    if (step.key && !state.data[step.key]) {
      const body = panelEl.querySelector(".msm-body");
      if (body) {
        body.animate(
          [
            { transform: "translateX(0)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(0)" },
          ],
          { duration: 300, easing: "ease-out" },
        );
      }
      ok = false;
    }

    return ok;
  }

  /* ---------------------------------------------------------------------
     10) SUBMIT
     --------------------------------------------------------------------- */
  function submit(mode) {
    const cb = (global.MatagerSigningConfig || {}).onSubmit;
    state.data.createdAt = new Date().toISOString();

    const nextBtn = panelEl.querySelector(".msm-next");
    if (nextBtn) {
      state.submitting = true;
      nextBtn.disabled = true;
      const span = nextBtn.querySelector("span");
      if (span) span.textContent = t("processing");
    }

    const payload = Object.assign({}, state.data);
    const promise = cb ? cb(payload, mode) : Promise.resolve();

    promise
      .then(() => {
        state.submitting = false;
        if (cb && cb.onSuccess) cb.onSuccess();
        close();
      })
      .catch((err) => {
        state.submitting = false;
        if (nextBtn) {
          nextBtn.disabled = false;
          const span = nextBtn.querySelector("span");
          if (span) {
            span.textContent =
              mode === "signup"
                ? state.step === steps.length - 1
                  ? "Pay 1650 EGP"
                  : t("continue")
                : t("signinCta");
          }
        }
        console.error("[MatagerSigning] submit error:", err);
        alert((err && err.message) || "Something went wrong.");
      });
  }

  /* ---------------------------------------------------------------------
     11) OPEN / CLOSE
     --------------------------------------------------------------------- */
  function onKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = panelEl.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled])",
    );
    if (!focusables.length) return;
    const first = focusables[0],
      last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openSignup() {
    state.mode = "signup";
    state.step = 0;
    state.data = loadDraft() || {};
    open_();
  }
  function openSignin() {
    state.mode = "signin";
    state.step = 0;
    state.data = {};
    open_();
  }

  function open_() {
    buildModal();
    lastFocused = document.activeElement;

    // Render content BEFORE opening so there is no height flash
    render();
    // Set natural height so the panel doesn't jump when the open transition runs
    panelEl.style.height = "";
    panelEl.style.overflow = "";

    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", onKeydown);
    document.documentElement.style.overflow = "hidden";

    requestAnimationFrame(() => {
      const target = panelEl.querySelector("input, button:not(.msm-close)");
      target && target.focus && target.focus();
    });
  }

  function close() {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onKeydown);
    document.documentElement.style.overflow = "";
    // Clear any frozen height from a mid-transition close
    panelEl.style.height = "";
    panelEl.style.overflow = "";
    if (lastFocused && lastFocused.focus) {
      try {
        lastFocused.focus({ preventScroll: true });
      } catch (e) {
        /* noop */
      }
    }
  }

  /* ---------------------------------------------------------------------
     12) DRAFT PERSISTENCE
     --------------------------------------------------------------------- */
  function saveDraft() {
    try {
      const safe = Object.assign({}, state.data);
      delete safe.password;
      delete safe.storeLogoFile;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(safe));
    } catch (e) {
      /* noop */
    }
  }
  function loadDraft() {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    } catch (e) {
      return null;
    }
  }
  document.addEventListener("input", () => {
    if (state.mode === "signup" && state.submitting !== true) saveDraft();
  });

  /* ---------------------------------------------------------------------
     13) HIJACK LINKS TO signing.html
     --------------------------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.indexOf("signing.html") === -1) return;
    e.preventDefault();
    if (href.indexOf("mode=signin") !== -1) openSignin();
    else openSignup();
  });

  /* ---------------------------------------------------------------------
     14) LANGUAGE + RE-RENDER
     --------------------------------------------------------------------- */
  document.addEventListener("matager:languagechange", () => {
    if (modalEl && modalEl.classList.contains("is-open")) render();
    if (hintEl && document.body.contains(hintEl)) {
      hintEl.remove();
      hintEl = null;
      buildHint();
    }
  });

  /* ---------------------------------------------------------------------
     15) BOOT
     --------------------------------------------------------------------- */
  function boot() {
    injectStyle();
    steps = buildSteps();
    buildHint();
    buildModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* ---------------------------------------------------------------------
     16) PUBLIC API
     --------------------------------------------------------------------- */
  global.MatagerSigning = {
    openSignup,
    openSignin,
    close,
    goToStep(n) {
      if (state.mode === "signup" && n >= 0 && n < steps.length) {
        state.step = n;
        render();
      }
    },
    getData() {
      return Object.assign({}, state.data);
    },
    reset() {
      state.data = {};
      state.step = 0;
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch (e) {
        /* noop */
      }
    },
  };
})(window);
