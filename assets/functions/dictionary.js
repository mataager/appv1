/* =========================================================================
   Matager i18n — shared translation + RTL/LTR engine
   File: assets/functions/dictionary.js
   -------------------------------------------------------------------------
   Public API (window.MatagerI18n):
     .dictionary          -> the full dictionary object
     .currentLanguage()   -> 'en' | 'ar'
     .applyLanguage(lang) -> applies instantly (no veil)
     .setLanguage(lang)   -> applies with the veil covering the swap
     .toggleLanguage()    -> cycles to the next language in LANGUAGES
     .t(key, [lang])      -> translate a single key
     .init()              -> re-bind buttons (call after injecting markup)
     .veil.show() / .veil.hide()  -> manual veil control

   Event fired on document:
     'matager:languagechange'  (detail: { lang, dir, dictionary })

   Optional companions (auto-detected, no config needed):
     • MatagerReveal  — re-splits word/char reveals after a swap
     • Any element    — targeted via [data-i18n], [data-i18n-placeholder],
                        [data-i18n-title], [data-i18n-aria-label]
   ========================================================================= */

(function (global) {
  "use strict";

  /* ---------------------------------------------------------------------
     1) CONFIG
     --------------------------------------------------------------------- */
  const STORAGE_KEY = "matager-lang"; // must match the inline <head> script
  const DEFAULT_LANG = "en";
  const LANGUAGES = ["en", "ar"]; // add new languages here
  const RTL_LANGUAGES = ["ar"]; // languages that render right-to-left
  const TRANSITION_MS = 500; // kept for backward compat; veil owns its own timing

  /* Veil timing — tune to taste */
  const VEIL_IN_MS = 260; // fade-to-cover
  const VEIL_HOLD_MS = 90; // extra beat once fully covered
  const VEIL_OUT_MS = 400; // settle-out
  const VEIL_Z = 99999;

  /* ---------------------------------------------------------------------
     2) DICTIONARY
     --------------------------------------------------------------------- */
  const dictionary = {
    /* ============================================================
       ENGLISH
       ============================================================ */
    en: {
      /* Meta */
      title: "Matager — Commerce, without the noise.",

      /* Nav */
      logo: "Matager",
      navPlatform: "Platform",
      navHow: "How it works",
      navFeatures: "Features",
      navPricing: "Pricing",
      signIn: "Sign in",
      getStarted: "Get started",
      langSwitch: "Switch language",
      menuOpen: "Menu",

      /* Hero */
      badge:
        '<span class="badge-highlight">New</span> Matager OS 2.0 is now live',
      heroTitle: "Commerce,<br>without the noise.",
      heroSub:
        "Build your storefront, manage the operation, and give customers a cleaner way to discover and buy — all through one connected workspace.",
      buildStore: "Build my store",
      explorePlatform: "Explore platform",

      /* Screen switcher */
      screenDashboard: "Dashboard",
      screenStorefront: "Storefront",
      screenPos: "Point of Sale",

      /* Mockup URLs */
      mockUrlDashboard: "matager.com/dashboard",
      mockUrlStorefront: "peacock-store.matager.com",
      mockUrlPos: "matager.com/pos/register-01",

      /* Dashboard mock */
      mockOverview: "Overview",
      mockOrders: "Orders",
      mockProducts: "Products",
      mockCustomers: "Customers",
      mockAnalytics: "Analytics",
      mockRevenueToday: "Revenue · today",
      mockLiveCounter: "Live · 128",
      mockWeeklyPerformance: "Weekly performance",
      mockTrendUp: "↑ 24.2%",
      mockStatOrders: "Orders",
      mockStatConversion: "Conversion",
      mockStatAvgOrder: "Avg. order",

      /* Storefront mock */
      mockPeacockStore: "Peacock Store",
      mockStoreMeta: "1,284 products · 4.9 ★ · 254 followers",
      mockCartMode: "Cart mode",
      mockTabFeatured: "Featured",
      mockTabBestSellers: "Best sellers",
      mockTabLimited: "Limited edition",
      mockTabCollections: "Collections",
      mockStoreHeading: "Featured.",
      mockStoreSub:
        "Carefully selected pieces designed to elevate your daily environment.",
      mockProductTee: "Performance tee",
      mockProductAirMax: "Air Max 270",
      mockProductUltraboost: "Ultraboost 22",
      mockProductSocks: "Crew socks",
      mockPriceTee: "EGP 890",
      mockPriceAirMax: "EGP 4,200",
      mockPriceUltraboost: "EGP 2,200",
      mockPriceSocks: "EGP 120",

      /* POS mock */
      mockPosSearch: "Scan barcode or search product…",
      mockPosProductAirMax: "Nike Air Max",
      mockPosProductUltra: "Ultraboost",
      mockPosProductTee: "Adidas Tee",
      mockPosProductAF1: "Air Force 1",
      mockPosProductSocks: "Crew socks",
      mockPosProductRunner: "Runner",
      mockPosCurrentOrder: "Current order",
      mockPosItemCount: "2 items",
      mockPosItemName1: "Nike Air Max 270",
      mockPosItemVariant1: "Size 42 · Black",
      mockPosItemName2: "Performance Crew Socks",
      mockPosItemVariant2: "Size L · Grey",
      mockPosSubtotal: "Subtotal",
      mockPosDiscount: "Discount (32%)",
      mockPosVat: "VAT (14%)",
      mockPosTotal: "Total due",
      mockPosCompletePayment: "Complete payment",

      /* Trust bar */
      trustLabel: "Trusted by 8,500+ brands and stores worldwide",

      /* Stats */
      statActiveMerchants: "Active merchants",
      statProcessedYearly: "Processed yearly",
      statCountries: "Countries supported",
      statUptime: "Uptime SLA",

      /* How it works */
      howEyebrow: "How it works",
      howTitle: "Launch in three steps.",
      howSub:
        "From idea to first order in under an hour. No code, no setup fees, no surprises.",
      how1Title: "Create your store",
      how1Desc:
        "Pick a template, connect your domain, and go live in minutes. Your catalog, theme, and checkout ship together.",
      how2Title: "Sell everywhere",
      how2Desc:
        "Sync inventory across your storefront, POS registers, marketplaces, and social channels from one dashboard.",
      how3Title: "Scale with confidence",
      how3Desc:
        "Real-time analytics, automated taxes, and enterprise-grade security handle growth so you can focus on the product.",

      /* Showcase */
      platformEyebrow: "The platform",
      platformTitle: "One workspace. Every surface.",
      showcase1Eyebrow: "Omnichannel inventory",
      showcase1Title: "Every product. Every channel. Synced.",
      showcase1Desc:
        "Update a price or stock level once and it propagates instantly across your storefront, POS, and marketplaces.",
      showcase1Bullet1: "Real-time stock across all sales channels",
      showcase1Bullet2: "Barcode and SKU-level tracking",
      showcase1Bullet3: "Automated low-stock alerts",
      showcase2Eyebrow: "Analytics",
      showcase2Title: "Know what's working in real time.",
      showcase2Desc:
        "Track conversion, cohorts, and product performance on a dashboard that updates every few seconds — not every few hours.",
      showcase2Bullet1: "Live visitor and revenue feed",
      showcase2Bullet2: "Funnel and abandonment analysis",
      showcase2Bullet3: "Custom reports and exports",
      mockInventoryLive: "Inventory · Live",
      mockInventorySynced: "Synced",
      mockStockAirMax: "84 in stock",
      mockStockUltra: "42 in stock",
      mockStockSocks: "120 in stock",
      mockRevenueTodayShort: "Revenue · Today",

      /* Testimonials */
      testiEyebrow: "Loved by merchants",
      testiTitle: "Stores that chose quiet over chaos.",
      testi1Quote:
        "We replaced three tools with Matager and cut our ops time in half. The POS and storefront actually feel like one product.",
      testi1Name: "Mohamed A.",
      testi1Role: "Founder · Peacock Store",
      testi2Quote:
        "The analytics alone paid for the year. We spot winning products in hours instead of waiting for weekly exports.",
      testi2Name: "Sara K.",
      testi2Role: "Head of Ecommerce · Bloom & Co",
      testi3Quote:
        "Checkout conversion jumped 18% the week we migrated. The default templates just work — no theme hacking required.",
      testi3Name: "Youssef H.",
      testi3Role: "Founder · Oasis Athletics",

      /* Pricing */
      pricingEyebrow: "Pricing",
      pricingTitle: "Simple plans. Serious scale.",
      pricingSub:
        "Start free, upgrade when you outgrow it. No hidden fees, no per-transaction surprises.",

      priceStarterName: "Starter",
      priceStarterTag: "$0",
      priceStarterPeriod: "/ month",
      priceStarterDesc: "For solo founders launching their first storefront.",
      priceStarterF1: "Up to 100 products",
      priceStarterF2: "Matager subdomain",
      priceStarterF3: "2% transaction fee",
      priceStarterF4: "Community support",
      priceStarterCta: "Start free",

      priceGrowthBadge: "Popular",
      priceGrowthName: "Growth",
      priceGrowthTag: "$49",
      priceGrowthPeriod: "/ month",
      priceGrowthDesc:
        "For growing stores that need POS, analytics, and integrations.",
      priceGrowthF1: "Unlimited products",
      priceGrowthF2: "Custom domain & SSL",
      priceGrowthF3: "Point of Sale + 2 registers",
      priceGrowthF4: "Advanced analytics",
      priceGrowthF5: "0.5% transaction fee",
      priceGrowthCta: "Start 14-day trial",

      priceScaleName: "Scale",
      priceScaleTag: "$199",
      priceScalePeriod: "/ month",
      priceScaleDesc:
        "For high-volume merchants and multi-location operations.",
      priceScaleF1: "Everything in Growth",
      priceScaleF2: "Unlimited POS registers",
      priceScaleF3: "Multi-warehouse inventory",
      priceScaleF4: "API & webhooks access",
      priceScaleF5: "Priority 24/7 support",
      priceScaleCta: "Talk to sales",

      /* FAQ */
      faqEyebrow: "Questions",
      faqTitle: "Answers, before you ask.",
      faq1Q: "Can I migrate my existing store to Matager?",
      faq1A:
        "Yes. We provide one-click importers for Shopify, WooCommerce, and CSV catalogs, plus a dedicated migration specialist on Growth and Scale plans to move products, customers, and order history without downtime.",
      faq2Q: "Does Matager include a point-of-sale system?",
      faq2A:
        "Every Growth plan includes a full POS with register management, receipt printing, barcode scanning, and offline mode. Scale unlocks unlimited registers and multi-warehouse inventory routing.",
      faq3Q: "What payment methods can my customers use?",
      faq3A:
        "Matager supports cards, wallets, bank transfers, cash on delivery, and 40+ regional methods. You can enable or disable methods per region and set different rules for your storefront and your POS.",
      faq4Q: "Is there a transaction fee?",
      faq4A:
        "Starter has a 2% fee, Growth is 0.5%, and Scale is 0% on top of your payment processor's own fees. No hidden charges, and no fee on POS cash transactions.",
      faq5Q: "Can I use my own domain and branding?",
      faq5A:
        "Yes. Custom domains, SSL, favicon, email templates, and checkout branding are all included from the Growth plan onward. You can also customize the storefront theme with Liquid-like templating or use our drag-and-drop builder.",

      /* Final CTA */
      finalEyebrow: "Ready when you are",
      finalTitle: "Build the store you actually want.",
      finalSub:
        "Start free. Launch in an afternoon. Scale whenever you're ready — no lock-in, no platform tax.",
      finalSecondaryCta: "View pricing",

      /* Footer */
      footerTag:
        "Commerce, without the noise. One connected workspace for your storefront, operations, and customers.",
      footerColProduct: "Product",
      footerColCompany: "Company",
      footerColResources: "Resources",
      footerColLegal: "Legal",
      footerStorefront: "Storefront",
      footerPos: "Point of Sale",
      footerAnalytics: "Analytics",
      footerPayments: "Payments",
      footerInventory: "Inventory",
      footerAbout: "About",
      footerCareers: "Careers",
      footerPress: "Press",
      footerContact: "Contact",
      footerDocs: "Docs",
      footerHelpCenter: "Help center",
      footerCommunity: "Community",
      footerStatus: "Status",
      footerPrivacy: "Privacy",
      footerTerms: "Terms",
      footerCookies: "Cookies",
      footerSecurity: "Security",
      footerRights: "© 2026 Matager. All rights reserved.",
      footerLocations: "Cairo · Dubai · London",
      showcase3Eyebrow: "Integrations",
      showcase3Title: "Your whole stack. One panel.",
      showcase3Desc:
        "Drop in tracking pixels, connect shipping carriers, and switch on payment methods in a few clicks — no developers, no plugins, no waiting on deploys.",
      showcase3Bullet1:
        "Tracking pixels — Meta, TikTok, Google, Snap installed in one click",
      showcase3Bullet2:
        "Shipping carriers with live rates, flat-rate, and free-shipping rules",
      showcase3Bullet3:
        "Payment methods — cards, wallets, COD, and 40+ regional options",
      mockIntegrationsTitle: "Integrations",
      mockIntegrationsLive: "All connected",
      mockIntPixels: "Tracking pixels",
      mockIntShipping: "Shipping methods",
      mockIntPayments: "Payment methods",

      mockStuckCarts: "Stuck carts",
      mockStuckCartsMeta: "12 recoverable",
      mockPendingOrders: "Pending orders",
      mockPendingOrdersMeta: "5 overdue",
      mockRefundOrders: "Refund orders",
      mockRefundOrdersMeta: "2 pending",
      mockOutOfShipping: "Out of shipping",
      mockOutOfShippingMeta: "1 delayed",

      /* ── Customer storefront ───────────────────────────── */
      genderFilter: "Choose a Gender",
      genderMens: "Mens",
      genderWoman: "Woman",
      genderKids: "Kids",
      storeName: "Peacock Store",
      badgeVerified: "Verified",
      badgeProSeller: "Pro Seller",
      storeTagline: "Premium products curated for the modern lifestyle",
      storeProducts: "1,284 products",
      storeFollowers: "284 Followers",
      storeRating: "4.9 ★ (2.3k)",
      cartModeOn: "Cart Mode On",
      itemsFitYou: "8 items fit you",
      nextStore: "Next Store",
      itemsThatFitMe: "🎯 Items That Fit Me",
      editMyFit: "Edit my fit",
      catAll: "All",
      catTshirts: "T-shirts",
      catHoodies: "Hoodies",
      catPants: "Pants",
      catShoes: "Shoes",
      catAccessories: "Accessories",
      catFeatured: "Featured",
      catBestSeller: "Best Seller",
      catLimited: "Limited Items",
      catSale: "Sale Items",
      catCollections: "Collections",
      headingFeatured: "Featured.",
      headingBestSellers: "Best Sellers.",
      headingOnSale: "On Sale.",
      headingLimitedPicks: "Limited Picks.",
      headingCollections: "Collections.",
      descFeatured:
        "Carefully selected pieces designed to elevate your daily environment.",
      descBestSellers: "The items our community loves most.",
      descOnSale: "Limited-time pricing on high-end essentials.",
      descLimited: "Exclusive drops, limited quantities.",
      descCollections: "Curated collections available now.",

      stickyEyebrow: "Quick access",
      stickyLive: "Live",
      tileCart: "Cart",
      tileOrders: "Orders",
      tileSearch: "Search",
      tileAlerts: "Alerts",
      tileProfile: "Profile",
      tileHome: "Home",
      metricFitYou: "Fit you",
      metricInCart: "In cart",
      metricOrders: "Orders",
    },

    /* ============================================================
       ARABIC
       ============================================================ */
    ar: {
      /* Meta */
      title: "متاجر — تجارة، بلا ضوضاء.",

      /* Nav */
      logo: "متاجر",
      navPlatform: "المنصة",
      navHow: "كيف يعمل",
      navFeatures: "المزايا",
      navPricing: "الأسعار",
      signIn: "تسجيل الدخول",
      getStarted: "ابدأ الآن",
      langSwitch: "تغيير اللغة",
      menuOpen: "القائمة",

      /* Hero */
      badge: '<span class="badge-highlight">جديد</span> متاجر OS 2.0 متاح الآن',
      heroTitle: "تجارة،<br>بلا ضوضاء.",
      heroSub:
        "أنشئ واجهة متجرك، وأدر عملياتك، وامنح عملاءك طريقة أنظف للاكتشاف والشراء — كل ذلك من خلال مساحة عمل واحدة متصلة.",
      buildStore: "أنشئ متجري",
      explorePlatform: "استكشف المنصة",

      /* Screen switcher */
      screenDashboard: "لوحة التحكم",
      screenStorefront: "المتجر",
      screenPos: "نقاط البيع",

      /* Mockup URLs */
      mockUrlDashboard: "matager.com/dashboard",
      mockUrlStorefront: "peacock-store.matager.com",
      mockUrlPos: "matager.com/pos/register-01",

      /* Dashboard mock */
      mockOverview: "نظرة عامة",
      mockOrders: "الطلبات",
      mockProducts: "المنتجات",
      mockCustomers: "العملاء",
      mockAnalytics: "التحليلات",
      mockRevenueToday: "الإيرادات · اليوم",
      mockLiveCounter: "مباشر · 128",
      mockWeeklyPerformance: "الأداء الأسبوعي",
      mockTrendUp: "↑ 24.2٪",
      mockStatOrders: "الطلبات",
      mockStatConversion: "التحويل",
      mockStatAvgOrder: "متوسط الطلب",

      /* Storefront mock */
      mockPeacockStore: "متجر الطاووس",
      mockStoreMeta: "1,284 منتجًا · 4.9 ★ · 254 متابعًا",
      mockCartMode: "وضع السلة",
      mockTabFeatured: "المميزة",
      mockTabBestSellers: "الأكثر مبيعًا",
      mockTabLimited: "إصدار محدود",
      mockTabCollections: "المجموعات",
      mockStoreHeading: "المميزة.",
      mockStoreSub: "قطع مختارة بعناية مصممة للارتقاء ببيئتك اليومية.",
      mockProductTee: "تيشيرت الأداء",
      mockProductAirMax: "إير ماكس 270",
      mockProductUltraboost: "ألترا بوست 22",
      mockProductSocks: "جوارب رياضية",
      mockPriceTee: "890 ج.م",
      mockPriceAirMax: "4,200 ج.م",
      mockPriceUltraboost: "2,200 ج.م",
      mockPriceSocks: "120 ج.م",

      /* POS mock */
      mockPosSearch: "امسح الباركود أو ابحث عن منتج…",
      mockPosProductAirMax: "نايك إير ماكس",
      mockPosProductUltra: "ألترا بوست",
      mockPosProductTee: "تيشيرت أديداس",
      mockPosProductAF1: "إير فورس 1",
      mockPosProductSocks: "جوارب رياضية",
      mockPosProductRunner: "حذاء الجري",
      mockPosCurrentOrder: "الطلب الحالي",
      mockPosItemCount: "منتجان",
      mockPosItemName1: "نايك إير ماكس 270",
      mockPosItemVariant1: "مقاس 42 · أسود",
      mockPosItemName2: "جوارب الأداء الرياضية",
      mockPosItemVariant2: "مقاس L · رمادي",
      mockPosSubtotal: "المجموع الفرعي",
      mockPosDiscount: "الخصم (32٪)",
      mockPosVat: "ضريبة القيمة المضافة (14٪)",
      mockPosTotal: "الإجمالي المستحق",
      mockPosCompletePayment: "إتمام الدفع",

      /* Trust bar */
      trustLabel: "موثوق من أكثر من 8,500 علامة تجارية ومتجر حول العالم",

      /* Stats */
      statActiveMerchants: "تاجر نشط",
      statProcessedYearly: "معالجة سنويًا",
      statCountries: "دولة مدعومة",
      statUptime: "اتفاقية مستوى الخدمة",

      /* How it works */
      howEyebrow: "كيف يعمل",
      howTitle: "انطلق في ثلاث خطوات.",
      howSub:
        "من الفكرة إلى أول طلب في أقل من ساعة. بدون برمجة، بدون رسوم إعداد، بدون مفاجآت.",
      how1Title: "أنشئ متجرك",
      how1Desc:
        "اختر قالبًا، اربط نطاقك، وانطلق خلال دقائق. الكتالوج والتصميم وصفحة الدفع جاهزة معًا.",
      how2Title: "بِع في كل مكان",
      how2Desc:
        "زامن المخزون عبر متجرك ونقاط البيع والأسواق والقنوات الاجتماعية من لوحة تحكم واحدة.",
      how3Title: "انمُ بثقة",
      how3Desc:
        "تحليلات فورية، ضرائب آلية، وأمان بمستوى المؤسسات يدير النمو لتركّز أنت على المنتج.",

      /* Showcase */
      platformEyebrow: "المنصة",
      platformTitle: "مساحة عمل واحدة. كل الأسطح.",
      showcase1Eyebrow: "مخزون متعدد القنوات",
      showcase1Title: "كل منتج. كل قناة. متزامنة.",
      showcase1Desc:
        "حدّث السعر أو مستوى المخزون مرة واحدة، فينتقل فورًا عبر متجرك ونقاط البيع والأسواق.",
      showcase1Bullet1: "مخزون فوري عبر جميع قنوات البيع",
      showcase1Bullet2: "تتبع بالباركود ورمز المنتج",
      showcase1Bullet3: "تنبيهات آلية عند انخفاض المخزون",
      showcase2Eyebrow: "التحليلات",
      showcase2Title: "اعرف ما ينجح في الوقت الفعلي.",
      showcase2Desc:
        "تتبّع التحويل والمجموعات وأداء المنتجات على لوحة تحدّث نفسها كل بضع ثوانٍ — لا كل بضع ساعات.",
      showcase2Bullet1: "بث مباشر للزوار والإيرادات",
      showcase2Bullet2: "تحليل مسار الشراء والتخلي عن السلة",
      showcase2Bullet3: "تقارير وتصدير مخصص",
      mockInventoryLive: "المخزون · مباشر",
      mockInventorySynced: "متزامن",
      mockStockAirMax: "84 في المخزون",
      mockStockUltra: "42 في المخزون",
      mockStockSocks: "120 في المخزون",
      mockRevenueTodayShort: "الإيرادات · اليوم",

      /* Testimonials */
      testiEyebrow: "محبوب من التجار",
      testiTitle: "متاجر اختارت الهدوء على الفوضى.",
      testi1Quote:
        "استبدلنا ثلاث أدوات بمنصة متاجر وقلّصنا وقت العمليات إلى النصف. نقاط البيع والمتجر يبدوان كمنتج واحد فعلاً.",
      testi1Name: "محمد ع.",
      testi1Role: "المؤسس · متجر الطاووس",
      testi2Quote:
        "التحليلات وحدها غطّت تكلفة السنة. نكتشف المنتجات الرابحة في ساعات بدلاً من انتظار التقارير الأسبوعية.",
      testi2Name: "سارة ك.",
      testi2Role: "رئيسة التجارة الإلكترونية · بلوم آند كو",
      testi3Quote:
        "ارتفع معدل التحويل 18٪ في أسبوع الانتقال. القوالب الافتراضية تعمل ببساطة — دون أي تعديل على القالب.",
      testi3Name: "يوسف ح.",
      testi3Role: "المؤسس · واحة أثلتيك",

      /* Pricing */
      pricingEyebrow: "الأسعار",
      pricingTitle: "خطط بسيطة. توسّع جدي.",
      pricingSub:
        "ابدأ مجانًا، وارتقِ حين تكبر. بدون رسوم خفية، وبدون مفاجآت لكل معاملة.",

      priceStarterName: "البداية",
      priceStarterTag: "$0",
      priceStarterPeriod: "/ شهريًا",
      priceStarterDesc: "للمؤسسين الأفراد الذين يطلقون متجرهم الأول.",
      priceStarterF1: "حتى 100 منتج",
      priceStarterF2: "نطاق فرعي من متاجر",
      priceStarterF3: "عمولة 2٪ لكل معاملة",
      priceStarterF4: "دعم عبر المجتمع",
      priceStarterCta: "ابدأ مجانًا",

      priceGrowthBadge: "الأكثر شيوعًا",
      priceGrowthName: "النمو",
      priceGrowthTag: "$49",
      priceGrowthPeriod: "/ شهريًا",
      priceGrowthDesc: "للمتاجر النامية التي تحتاج نقاط بيع وتحليلات وتكاملات.",
      priceGrowthF1: "منتجات غير محدودة",
      priceGrowthF2: "نطاق مخصص وشهادة SSL",
      priceGrowthF3: "نقاط بيع + ماكينة كاشير",
      priceGrowthF4: "تحليلات متقدمة",
      priceGrowthF5: "عمولة 0.5٪ لكل معاملة",
      priceGrowthCta: "ابدأ تجربة 14 يومًا",

      priceScaleName: "التوسّع",
      priceScaleTag: "$199",
      priceScalePeriod: "/ شهريًا",
      priceScaleDesc: "للتجار ذوي الحجم الكبير والعمليات متعددة الفروع.",
      priceScaleF1: "كل ما في خطة النمو",
      priceScaleF2: "ماكينات كاشير غير محدودة",
      priceScaleF3: "مخزون متعدد المستودعات",
      priceScaleF4: "وصول إلى API و Webhooks",
      priceScaleF5: "دعم ذو أولوية على مدار الساعة",
      priceScaleCta: "تحدث مع المبيعات",

      /* FAQ */
      faqEyebrow: "الأسئلة",
      faqTitle: "إجابات قبل أن تسأل.",
      faq1Q: "هل يمكنني نقل متجري الحالي إلى متاجر؟",
      faq1A:
        "نعم. نوفّر أدوات استيراد بنقرة واحدة من Shopify وWooCommerce وملفات CSV، مع مختص هجرة مخصص في خطتي النمو والتوسّع لنقل المنتجات والعملاء وسجل الطلبات دون أي توقف.",
      faq2Q: "هل تتضمن متاجر نظام نقاط بيع؟",
      faq2A:
        "تتضمن كل خطة نمو نظام نقاط بيع كاملًا مع إدارة الماكينات وطباعة الإيصالات ومسح الباركود ووضع عدم الاتصال. وتفتح خطة التوسّع ماكينات غير محدودة وتوزيع المخزون عبر عدة مستودعات.",
      faq3Q: "ما طرق الدفع المتاحة لعملائي؟",
      faq3A:
        "تدعم متاجر البطاقات والمحافظ والتحويلات البنكية والدفع عند الاستلام وأكثر من 40 طريقة إقليمية. يمكنك تفعيلها أو تعطيلها لكل منطقة، وتحديد قواعد مختلفة لمتجرك ونقاط البيع.",
      faq4Q: "هل توجد عمولة على المعاملات؟",
      faq4A:
        "خطة البداية بعمولة 2٪، والنمو 0.5٪، والتوسّع 0٪ فوق رسوم مزوّد الدفع نفسه. لا رسوم خفية، ولا عمولة على مدفوعات النقد في نقاط البيع.",
      faq5Q: "هل يمكنني استخدام نطاقي وعلامتي التجارية؟",
      faq5A:
        "نعم. النطاقات المخصصة وشهادة SSL والأيقونة وقوالب البريد وهوية صفحة الدفع كلها متاحة من خطة النمو فصاعدًا. كما يمكنك تخصيص قالب المتجر بنظام قوالب شبيه بـ Liquid أو استخدام أداة السحب والإفلات.",

      /* Final CTA */
      finalEyebrow: "جاهز حين تكون جاهزًا",
      finalTitle: "ابنِ المتجر الذي تريده فعلًا.",
      finalSub:
        "ابدأ مجانًا. أطلقه في ظهيرة واحدة. توسّع متى شئت — بدون قيود، وبدون رسوم إضافية.",
      finalSecondaryCta: "عرض الأسعار",

      /* Footer */
      footerTag: "تجارة، بلا ضوضاء. مساحة عمل واحدة لمتجرك وعملياتك وعملائك.",
      footerColProduct: "المنتج",
      footerColCompany: "الشركة",
      footerColResources: "المصادر",
      footerColLegal: "قانوني",
      footerStorefront: "المتجر",
      footerPos: "نقاط البيع",
      footerAnalytics: "التحليلات",
      footerPayments: "المدفوعات",
      footerInventory: "المخزون",
      footerAbout: "من نحن",
      footerCareers: "الوظائف",
      footerPress: "الصحافة",
      footerContact: "اتصل بنا",
      footerDocs: "التوثيق",
      footerHelpCenter: "مركز المساعدة",
      footerCommunity: "المجتمع",
      footerStatus: "الحالة",
      footerPrivacy: "الخصوصية",
      footerTerms: "الشروط",
      footerCookies: "ملفات تعريف الارتباط",
      footerSecurity: "الأمان",
      footerRights: "© 2026 متاجر. جميع الحقوق محفوظة.",
      footerLocations: "القاهرة · دبي · لندن",

      /* ── Customer storefront ───────────────────────────── */ genderFilter:
        "اختر النوع",
      genderMens: "رجال",
      genderWoman: "نساء",
      genderKids: "أطفال",
      storeName: "متجر الطاووس",
      badgeVerified: "موثّق",
      badgeProSeller: "بائع محترف",
      storeTagline: "منتجات مميزة مختارة بعناية لأسلوب الحياة العصري",
      storeProducts: "1,284 منتجًا",
      storeFollowers: "284 متابعًا",
      storeRating: "4.9 ★ (2.3k)",
      cartModeOn: "وضع السلة مُفعّل",
      itemsFitYou: "8 قطع تناسبك",
      nextStore: "المتجر التالي",
      itemsThatFitMe: "🎯 قطع تناسبني",
      editMyFit: "تعديل مقاسي",
      catAll: "الكل",
      catTshirts: "تيشيرتات",
      catHoodies: "هوديات",
      catPants: "بناطيل",
      catShoes: "أحذية",
      catAccessories: "إكسسوارات",
      catFeatured: "المميزة",
      catBestSeller: "الأكثر مبيعًا",
      catLimited: "إصدار محدود",
      catSale: "عروض",
      catCollections: "المجموعات",
      headingFeatured: "المميزة.",
      headingBestSellers: "الأكثر مبيعًا.",
      headingOnSale: "عروض.",
      headingLimitedPicks: "مختارات محدودة.",
      headingCollections: "المجموعات.",
      descFeatured: "قطع مختارة بعناية مصممة للارتقاء ببيئتك اليومية.",
      descBestSellers: "المنتجات التي يحبها مجتمعنا أكثر من غيرها.",
      descOnSale: "أسعار مخفّضة لفترة محدودة على أساسيات راقية.",
      descLimited: "إصدارات حصرية بكميات محدودة.",
      descCollections: "مجموعات منسّقة متوفرة الآن.",

      stickyEyebrow: "وصول سريع",
      stickyLive: "مباشر",
      tileCart: "السلة",
      tileOrders: "الطلبات",
      tileSearch: "البحث",
      tileAlerts: "التنبيهات",
      tileProfile: "الملف الشخصي",
      tileHome: "الرئيسية",
      metricFitYou: "يناسبك",
      metricInCart: "في سلتك",
      metricOrders: "الطلبات",
    },
  };

  /* ---------------------------------------------------------------------
     3) HELPERS
     --------------------------------------------------------------------- */
  function normalize(lang) {
    return LANGUAGES.indexOf(lang) !== -1 ? lang : DEFAULT_LANG;
  }
  function isRTL(lang) {
    return RTL_LANGUAGES.indexOf(lang) !== -1;
  }
  function dirFor(lang) {
    return isRTL(lang) ? "rtl" : "ltr";
  }
  function readStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }
  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  /* ---------------------------------------------------------------------
     4) VEIL — soft dark-tint overlay during language swaps
     ---------------------------------------------------------------------
     Performance notes:
       • No backdrop-filter during the animation. Blurring the whole page
         every frame is what makes swaps feel laggy. A solid tint fades in
         on the GPU layer in <1ms.
       • The veil is created once at boot, given its own compositor layer
         with translate3d + will-change, then only opacity + transform
         are animated.
       • Timing is deliberately asymmetric — quick in, longer out — which
         reads as "the page recedes, then settles" rather than "flash".
     --------------------------------------------------------------------- */
  const VEIL_CLASS = "i18n-veil";

  const VEIL_CSS = `
    .${VEIL_CLASS} {
      position: fixed;
      inset: 0;
      z-index: ${VEIL_Z};
      pointer-events: none;
      opacity: 0;
      transform: translate3d(0, 0, 0) scale(1.02);
      background:
        radial-gradient(120% 90% at 50% 40%,
          rgba(6, 7, 12, 0.55) 0%,
          rgba(6, 7, 12, 0.78) 55%,
          rgba(6, 7, 12, 0.92) 100%);
      transition:
        opacity ${VEIL_IN_MS}ms cubic-bezier(0.4, 0, 0.2, 1),
        transform ${VEIL_IN_MS}ms cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      contain: strict;
    }
    .${VEIL_CLASS}.is-on {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
      transition:
        opacity ${VEIL_IN_MS}ms cubic-bezier(0.4, 0, 0.2, 1),
        transform ${VEIL_IN_MS}ms cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    }
    .${VEIL_CLASS}.is-out {
      opacity: 0;
      transform: translate3d(0, 0, 0) scale(1.015);
      transition:
        opacity ${VEIL_OUT_MS}ms cubic-bezier(0.16, 1, 0.3, 1),
        transform ${VEIL_OUT_MS}ms cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .${VEIL_CLASS},
      .${VEIL_CLASS}.is-on,
      .${VEIL_CLASS}.is-out { transition-duration: 80ms; }
    }
  `;

  let veilEl = null;

  function ensureVeil() {
    if (veilEl && document.body.contains(veilEl)) return veilEl;

    if (!document.getElementById("i18n-veil-style")) {
      const s = document.createElement("style");
      s.id = "i18n-veil-style";
      s.textContent = VEIL_CSS;
      (document.head || document.documentElement).appendChild(s);
    }

    veilEl = document.createElement("div");
    veilEl.className = VEIL_CLASS;
    veilEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(veilEl);

    // Pre-compose the layer so the very first fade has zero jank.
    void veilEl.offsetHeight;
    veilEl.style.transform = "translate3d(0, 0, 0) scale(1.02)";

    return veilEl;
  }

  function veilOn() {
    const el = ensureVeil();
    el.classList.remove("is-out");
    // Force the browser to register the current state before flipping,
    // so the transition actually runs from 0 → 1.
    void el.offsetHeight;
    el.classList.add("is-on");
  }

  function veilOff() {
    if (!veilEl) return;
    veilEl.classList.remove("is-on");
    veilEl.classList.add("is-out");
  }

  function veilReset() {
    if (!veilEl) return;
    veilEl.classList.remove("is-on", "is-out");
  }

  /* ---------------------------------------------------------------------
     5) CORE
     --------------------------------------------------------------------- */
  function currentLanguage() {
    return normalize(
      readStoredLang() || document.documentElement.lang || DEFAULT_LANG,
    );
  }

  function t(key, lang) {
    const dict =
      dictionary[normalize(lang || currentLanguage())] ||
      dictionary[DEFAULT_LANG];
    const fallback = dictionary[DEFAULT_LANG];
    if (dict[key] !== undefined) return dict[key];
    if (fallback[key] !== undefined) return fallback[key];
    return key;
  }

  function applyLanguage(lang) {
    const code = normalize(lang);
    const dict = dictionary[code] || dictionary[DEFAULT_LANG];
    const fallback = dictionary[DEFAULT_LANG];

    document.documentElement.lang = code;
    document.documentElement.dir = dirFor(code);

    document.querySelectorAll(".lang-text").forEach(function (el) {
      el.textContent = code.toUpperCase();
    });

    if (dict.title) document.title = dict.title;

    const pick = function (key) {
      return dict[key] !== undefined ? dict[key] : fallback[key];
    };

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const value = pick(el.getAttribute("data-i18n"));
      if (value !== undefined) el.innerHTML = value;
    });

    const ATTR_MAP = {
      "data-i18n-placeholder": "placeholder",
      "data-i18n-title": "title",
      "data-i18n-aria-label": "aria-label",
    };
    Object.keys(ATTR_MAP).forEach(function (dataAttr) {
      const targetAttr = ATTR_MAP[dataAttr];
      document.querySelectorAll("[" + dataAttr + "]").forEach(function (el) {
        const value = pick(el.getAttribute(dataAttr));
        if (value !== undefined) el.setAttribute(targetAttr, value);
      });
    });

    storeLang(code);

    document.dispatchEvent(
      new CustomEvent("matager:languagechange", {
        detail: {
          lang: code,
          dir: document.documentElement.dir,
          dictionary: dict,
        },
      }),
    );

    return code;
  }

  /** Applies a language with the veil covering the swap. */
  function setLanguage(lang) {
    const next = normalize(lang);
    if (next === currentLanguage()) {
      applyLanguage(next);
      return next;
    }

    // 1) Fade the veil in (GPU-only: opacity + transform)
    veilOn();

    // 2) Wait until the veil has fully painted before touching the DOM
    setTimeout(function () {
      applyLanguage(next);

      // 3) Two rAFs guarantee the swap's layout + paint land while the
      //    veil is still fully opaque — the user never sees the seam.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTimeout(function () {
            veilOff();
            // 4) Reset after the fade-out finishes so the next swap
            //    starts clean (no class accumulation).
            setTimeout(veilReset, VEIL_OUT_MS + 40);
          }, VEIL_HOLD_MS);
        });
      });
    }, VEIL_IN_MS + 20);

    return next;
  }

  function toggleLanguage() {
    const index = LANGUAGES.indexOf(currentLanguage());
    const next = LANGUAGES[(index + 1) % LANGUAGES.length];
    return setLanguage(next);
  }

  /* ---------------------------------------------------------------------
     6) BINDING + AUTO-INIT
     --------------------------------------------------------------------- */
  function bindToggles() {
    document
      .querySelectorAll(".lang-fab, [data-lang-toggle]")
      .forEach(function (btn) {
        if (btn.dataset.i18nBound === "true") return;
        btn.dataset.i18nBound = "true";

        btn.addEventListener("click", function (event) {
          event.preventDefault();
          toggleLanguage();
        });
      });
  }

  function init() {
    bindToggles();
    applyLanguage(currentLanguage());
  }

  function boot() {
    init();
    ensureVeil(); // present in DOM but hidden until the first swap
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* ---------------------------------------------------------------------
     7) REVEAL RE-SPLIT — opt-in integration with MatagerReveal
     ---------------------------------------------------------------------
     When the language swaps, [data-i18n] nodes with word/char reveals get
     their innerHTML replaced — which wipes the split <span> wrappers. This
     listener re-splits them so the animation replays in the new language.

     Only elements currently on screen are re-split immediately; off-screen
     ones are marked stale and re-split lazily the first time they enter
     the viewport (handled by MatagerReveal.observe when it next sees them).

     Runs only if MatagerReveal is loaded on the page.
     --------------------------------------------------------------------- */
  function shouldResplitReveals() {
    return typeof global.MatagerReveal !== "undefined";
  }

  function resplitReveals() {
    if (!shouldResplitReveals()) return;

    const vh = window.innerHeight || document.documentElement.clientHeight;

    document
      .querySelectorAll('[data-reveal="words"], [data-reveal="chars"]')
      .forEach(function (el) {
        // Detach from any running animation state first
        el.__mr_init = false;
        el.classList.remove("mr-in");

        const r = el.getBoundingClientRect();
        const onScreen = r.bottom > 0 && r.top < vh;

        // Off-screen: leave it stale. MatagerReveal will re-split it when
        // it comes back into view (it re-checks __mr_init on scan).
        if (!onScreen) return;

        // On-screen: rebuild the split and replay the reveal
        global.MatagerReveal.observe(el);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            global.MatagerReveal.reveal(el);
          });
        });
      });
  }

  // Re-split AFTER the dictionary swap and AFTER the veil is fully up,
  // so any layout cost is hidden behind the veil.
  document.addEventListener("matager:languagechange", function () {
    // Let the paint of the new strings land first, then re-split.
    requestAnimationFrame(function () {
      requestAnimationFrame(resplitReveals);
    });
  });

  /* ---------------------------------------------------------------------
     8) PUBLIC API
     --------------------------------------------------------------------- */
  global.MatagerI18n = {
    dictionary: dictionary,
    languages: LANGUAGES,
    rtlLanguages: RTL_LANGUAGES,
    storageKey: STORAGE_KEY,
    defaultLanguage: DEFAULT_LANG,

    currentLanguage: currentLanguage,
    applyLanguage: applyLanguage,
    setLanguage: setLanguage,
    toggleLanguage: toggleLanguage,

    t: t,
    translate: t,
    init: init,

    /* Veil controls for pages that want to time the fade themselves */
    veil: {
      show: veilOn,
      hide: veilOff,
    },

    /* Exposed so pages can force a re-split if they inject markup later */
    resplitReveals: resplitReveals,
  };
})(window);
