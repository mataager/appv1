/* =========================================================================
   PEACOCK STORE — STICKY CTA
   Single-call initializer. Injects CSS + DOM and wires up every controller.
   Usage:  initStickyCTA();   // auto-runs on DOM ready if not called manually
   ========================================================================= */
(function () {
  "use strict";

  const STYLE_ID = "peacock-sticky-styles";
  const ROOT_ID = "peacock-sticky-root";

  /* ═══════════════════════════════════════════════════════════════════
     1. CSS
     ═══════════════════════════════════════════════════════════════════ */
  const CSS = `
.sticky-cta{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9990;display:flex;flex-direction:column;width:min(560px,calc(100vw - 32px));height:min(82vh,720px);background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.025)),rgba(8,8,10,.62);backdrop-filter:blur(16px) saturate(130%);-webkit-backdrop-filter:blur(16px) saturate(130%);border:1px solid rgba(255,255,255,.09);box-shadow:0 24px 60px -18px rgba(0,0,0,.75),0 4px 16px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.11);overflow:hidden;clip-path:inset(calc(100% - 60px) 0 0 0 round 12px);transform:translate3d(-50%,calc(100% + 40px),0);opacity:0;pointer-events:none;contain:layout paint style;will-change:clip-path,transform,opacity;transition:clip-path .36s cubic-bezier(.16,1,.3,1),transform .36s cubic-bezier(.16,1,.3,1),opacity .18s ease}
.sticky-cta.is-visible{transform:translate3d(-50%,0,0);opacity:1;pointer-events:auto}
.sticky-cta.is-expanded{clip-path:inset(0 0 0 0 round 28px)}
.sticky-cta-panel{position:relative;flex:1 1 auto;min-height:0;overflow:hidden;opacity:0;transform:translate3d(0,8px,0);pointer-events:none;transition:opacity .24s ease,transform .3s cubic-bezier(.16,1,.3,1);backface-visibility:hidden}
.sticky-cta.is-expanded .sticky-cta-panel{opacity:1;transform:translate3d(0,0,0);pointer-events:auto;transition-delay:.04s,.04s}
.sticky-cta-panel-inner{position:absolute;inset:0;transform:translateZ(0)}
.sticky-view{position:absolute;inset:0;padding:16px 16px 14px;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;scrollbar-width:none;-ms-overflow-style:none;contain:layout paint style;opacity:0;transform:translate3d(16px,0,0);pointer-events:none;transition:opacity .26s cubic-bezier(.16,1,.3,1),transform .34s cubic-bezier(.16,1,.3,1);backface-visibility:hidden}
.sticky-view::-webkit-scrollbar{width:0;height:0;display:none}
.sticky-view.is-active{opacity:1;transform:translate3d(0,0,0);pointer-events:auto;will-change:opacity,transform}
.sticky-view.is-exiting-left{opacity:0;transform:translate3d(-16px,0,0);will-change:opacity,transform}
.sticky-view.is-exiting-right{opacity:0;transform:translate3d(16px,0,0);will-change:opacity,transform}
.hub-inner{display:flex;flex-direction:column;gap:10px}
.view-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;min-height:30px}
.view-head--tight{margin-bottom:4px}
.view-head-main{min-width:0}
.view-eyebrow{display:block;font-size:8.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#60a5fa;margin-bottom:1px;line-height:1}
.view-title{font-size:13.5px;font-weight:700;letter-spacing:-.01em;color:#fff;margin:0;line-height:1.15}
.view-head-side{flex-shrink:0}
.mini-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);font-size:8.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.75);white-space:nowrap;transition:background .25s,color .25s,border-color .25s}
.mini-pill.is-accent{background:rgba(59,130,246,.16);border-color:rgba(59,130,246,.3);color:#93c5fd}
.mv-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.18);animation:pulseDot 2s ease-in-out infinite}
@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.45}}
.mini-label{display:block;font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);line-height:1}
.hub-ad{position:relative;display:flex;align-items:center;gap:8px;height:32px;padding:0 11px;border-radius:11px;overflow:hidden;background:linear-gradient(100deg,rgba(59,130,246,.16),rgba(168,85,247,.14) 50%,rgba(236,72,153,.12));border:1px solid rgba(255,255,255,.09)}
.hub-ad-icon{flex:0 0 auto;font-size:11px;color:#93c5fd;opacity:.9}
.hub-ad-viewport{position:relative;flex:1 1 auto;height:100%;overflow:hidden}
.hub-ad-msg{position:absolute;inset:0;display:flex;align-items:center;font-size:10px;font-weight:600;color:rgba(255,255,255,.88);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;animation:adCycle 15s cubic-bezier(.16,1,.3,1) infinite}
.hub-ad-msg:nth-child(1){animation-delay:0s}
.hub-ad-msg:nth-child(2){animation-delay:5s}
.hub-ad-msg:nth-child(3){animation-delay:10s}
@keyframes adCycle{0%{opacity:0;transform:translateY(8px)}4%{opacity:1;transform:translateY(0)}29%{opacity:1;transform:translateY(0)}33%{opacity:0;transform:translateY(-8px)}100%{opacity:0;transform:translateY(-8px)}}
.cta-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
.cta-tile{position:relative;display:flex;align-items:center;gap:6px;padding:7px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);color:#cfcfcf;font-family:inherit;font-size:9.5px;font-weight:600;letter-spacing:.01em;cursor:pointer;overflow:hidden;text-align:left;transition:background .2s,border-color .2s,color .2s,transform .16s}
.cta-tile:hover{background:rgba(59,130,246,.09);border-color:rgba(59,130,246,.28);color:#fff}
.cta-tile:active{transform:scale(.96)}
.cta-tile-ico{width:20px;height:20px;border-radius:6px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .22s,transform .28s cubic-bezier(.16,1,.3,1)}
.cta-tile-ico i{font-size:11px;color:#60a5fa}
.cta-tile:hover .cta-tile-ico{background:rgba(59,130,246,.18);transform:scale(1.06)}
.cta-tile-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cta-tile-badge{flex-shrink:0;min-width:15px;height:15px;padding:0 4px;border-radius:999px;background:rgba(239,68,68,.9);color:#fff;font-size:8px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;line-height:1}
.cta-tile-badge.is-hidden{display:none}
.cta-metrics{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:11px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}
.cta-metric{flex:1 1 0;display:flex;align-items:center;gap:6px;min-width:0}
.cta-metric .mini-label{flex-shrink:0}
.cta-metric-value{margin-left:auto;font-size:13px;font-weight:700;color:#fff;letter-spacing:-.02em;line-height:1}
.cta-metrics-sep{width:1px;height:16px;background:rgba(255,255,255,.08);flex-shrink:0}
.promo-shower{padding-top:2px}
.promo-shower-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.promo-shower-title{display:inline-flex;align-items:center;gap:5px;font-size:8.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45)}
.promo-shower-title i{color:#a78bfa;font-size:11px}
.promo-shower-hint{font-size:8.5px;font-weight:600;color:rgba(255,255,255,.3)}
.promo-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.promo-chips::-webkit-scrollbar{display:none}
.promo-chip{flex:0 0 auto;display:inline-flex;flex-direction:column;align-items:flex-start;gap:1px;padding:5px 10px;border-radius:10px;border:1px dashed rgba(167,139,250,.35);background:rgba(167,139,250,.08);color:#e9d5ff;cursor:pointer;font-family:inherit;transition:background .2s,border-color .2s,transform .16s}
.promo-chip:hover{background:rgba(167,139,250,.16);border-color:rgba(167,139,250,.6)}
.promo-chip:active{transform:scale(.96)}
.promo-chip-code{font-size:9.5px;font-weight:800;letter-spacing:.05em;line-height:1.1}
.promo-chip-desc{font-size:7.5px;font-weight:600;opacity:.65;letter-spacing:.03em;line-height:1.1}
.sticky-cta-bar{position:relative;z-index:1;flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:8px;height:60px;box-sizing:border-box;background:linear-gradient(180deg,rgba(8,8,10,.35),rgba(8,8,10,.65));box-shadow:0 -1px 0 rgba(255,255,255,.06) inset}
.sticky-cta-primary{flex:1 1 auto;justify-content:center;padding:12px 22px;background:#fff!important;color:#000!important;border:1px solid rgba(0,0,0,.1)!important;display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.06em;border-radius:999px;text-decoration:none;transition:background .2s}
.sticky-cta-primary:hover{background:#f3f4f6!important}
.sticky-cta-primary i{font-size:16px}
.sticky-cta-back,.sticky-cta-toggle{flex:0 0 44px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s,border-color .2s,transform .34s cubic-bezier(.16,1,.3,1),opacity .25s,width .3s cubic-bezier(.16,1,.3,1),flex-basis .3s cubic-bezier(.16,1,.3,1)}
.sticky-cta-back{font-size:14px}
.sticky-cta-back:hover{background:rgba(255,255,255,.12)}
.sticky-cta-back:active{transform:scale(.94)}
.sticky-cta[data-current="hub"] .sticky-cta-back,.sticky-cta:not([data-current]) .sticky-cta-back{opacity:0;pointer-events:none;width:0;flex-basis:0;margin-right:-8px;border-width:0}
.sticky-cta-toggle i{font-size:20px;transition:transform .38s cubic-bezier(.16,1,.3,1)}
.sticky-cta-toggle:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16)}
.sticky-cta.is-expanded .sticky-cta-toggle{background:rgba(239,68,68,.9);border-color:rgba(239,68,68,.9);color:#fff}
body.sticky-cta-open{overflow:hidden}
.sticky-cta-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:9989;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s cubic-bezier(.16,1,.3,1),visibility .3s}
.sticky-cta-overlay.is-visible{opacity:1;visibility:visible;pointer-events:auto}
.cta-alert-zone{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:9995;width:min(440px,calc(100vw - 32px));display:flex;flex-direction:column;align-items:stretch;gap:8px;pointer-events:none;transition:bottom .38s cubic-bezier(.16,1,.3,1),width .38s cubic-bezier(.16,1,.3,1)}
.cta-toast{position:relative;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03)),rgba(12,12,15,.92);backdrop-filter:blur(24px) saturate(140%);-webkit-backdrop-filter:blur(24px) saturate(140%);border:1px solid rgba(255,255,255,.1);box-shadow:0 18px 44px -16px rgba(0,0,0,.8),0 2px 10px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.08);overflow:hidden;pointer-events:auto;opacity:0;transform:translateY(14px) scale(.96);transition:opacity .28s cubic-bezier(.16,1,.3,1),transform .34s cubic-bezier(.16,1,.3,1)}
.cta-toast.is-in{opacity:1;transform:translateY(0) scale(1)}
.cta-toast.is-out{opacity:0;transform:translateY(-8px) scale(.96)}
.cta-toast.is-actionable{cursor:pointer}
.cta-toast.is-actionable:hover{border-color:rgba(255,255,255,.18)}
.cta-toast-ico{flex:0 0 30px;width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:var(--tone,#94a3b8);background:color-mix(in srgb,var(--tone,#94a3b8) 16%,transparent);border:1px solid color-mix(in srgb,var(--tone,#94a3b8) 30%,transparent)}
.cta-toast-ico i{font-size:13px}
.cta-toast-body{flex:1 1 auto;min-width:0}
.cta-toast-head{display:flex;align-items:center;gap:6px;margin-bottom:1px}
.cta-toast-label{font-size:8.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--tone,#94a3b8)}
.cta-toast-time{margin-left:auto;font-size:8px;font-weight:600;color:rgba(255,255,255,.3)}
.cta-toast-msg{margin:0;font-size:11px;line-height:1.35;color:rgba(255,255,255,.82);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.cta-toast-go{flex:0 0 auto;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);color:rgba(255,255,255,.5);font-size:10px;transition:background .2s,color .2s}
.cta-toast-progress{position:absolute;left:0;bottom:0;height:2px;width:100%;background:var(--tone,#94a3b8);opacity:.55;transform-origin:left center;animation:toastProgress 5.2s linear forwards}
@keyframes toastProgress{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.filter{position:relative}
.filter-trigger{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);color:#e5e7eb;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .2s,border-color .2s;white-space:nowrap}
.filter-trigger:hover{background:rgba(255,255,255,.09)}
.filter-trigger>i{font-size:10px;opacity:.5;transition:transform .28s}
.filter-trigger[aria-expanded="true"]>i{transform:rotate(180deg)}
.filter-label{opacity:.45;font-weight:600;font-size:8.5px;text-transform:uppercase;letter-spacing:.08em;margin-right:4px}
.filter-selected{color:#60a5fa}
.filter-dropdown{position:absolute;top:calc(100% + 6px);left:0;min-width:190px;max-width:260px;background:rgba(14,14,17,.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:8px;box-shadow:0 18px 44px -12px rgba(0,0,0,.85);opacity:0;visibility:hidden;transform:translateY(-6px) scale(.97);transition:.2s cubic-bezier(.16,1,.3,1);z-index:60}
.filter-dropdown.open{opacity:1;visibility:visible;transform:none}
.filter-dropdown-header{font-size:8.5px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.35);padding:4px 8px 8px;font-weight:700}
.filter-options{display:flex;flex-direction:column;gap:2px;max-height:210px;overflow-y:auto;scrollbar-width:none}
.filter-options::-webkit-scrollbar{display:none}
.filter-option{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:9px;border:none;background:transparent;color:rgba(255,255,255,.75);font-size:11px;font-weight:600;cursor:pointer;text-align:left;font-family:inherit;width:100%;transition:background .16s,color .16s}
.filter-option:hover{background:rgba(255,255,255,.07);color:#fff}
.filter-option.is-selected{background:rgba(59,130,246,.14);color:#93c5fd}
.option-left{display:inline-flex;align-items:center;gap:8px}
.color-swatch{width:14px;height:14px;border-radius:50%;background:var(--swatch);box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);flex-shrink:0}
.option-check{opacity:0;font-size:12px}
.filter-option.is-selected .option-check{opacity:1}
.size-options{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.size-options .filter-option{justify-content:center;padding:8px 4px}
.status-dot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:6px;background:#64748b}
.status-dot.pending{background:#f59e0b}
.status-dot.processing{background:#3b82f6}
.status-dot.shipped{background:#8b5cf6}
.status-dot.delivered{background:#10b981}
.pd-layout{display:flex;flex-direction:column;gap:14px}
.pd-gallery-frame{position:relative;width:100%;aspect-ratio:16/11;border-radius:14px;overflow:hidden;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
.pd-gallery-track{display:flex;height:100%;width:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.pd-gallery-track::-webkit-scrollbar{display:none}
.ql-slide{width:100%;height:100%;object-fit:cover;flex-shrink:0;scroll-snap-align:center}
.pd-gallery-badge{position:absolute;bottom:8px;right:8px;padding:3px 8px;border-radius:999px;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);color:rgba(255,255,255,.85);font-size:9px;font-weight:600}
.pd-progress{height:2px;width:100%;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:6px}
.pd-progress-fill{height:100%;background:rgba(255,255,255,.5);transition:width .25s ease-out}
.pd-info{display:flex;flex-direction:column;gap:12px}
.pd-title{font-size:17px;font-weight:300;letter-spacing:-.01em;color:#fff;margin:0;line-height:1.2}
.pd-brand{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#60a5fa;margin-bottom:-6px}
.pd-tabs{display:flex;gap:14px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid rgba(255,255,255,.08)}
.pd-tabs::-webkit-scrollbar{display:none}
.tab-btn{padding:0 0 7px;border:none;background:transparent;border-bottom:2px solid transparent;font-family:inherit;font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.4);cursor:pointer;white-space:nowrap;transition:color .22s,border-color .22s}
.tab-btn:hover{color:rgba(255,255,255,.75)}
.tab-btn.is-active{color:#60a5fa;border-bottom-color:#3b82f6}
.pd-panes{position:relative}
.pd-pane{display:none;flex-direction:column;gap:10px}
.pd-pane.is-active{display:flex}
.pd-price-row{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.pd-price{font-size:18px;font-weight:500;color:#fff;letter-spacing:-.02em}
.pd-old-price{font-size:11px;color:rgba(255,255,255,.35);text-decoration:line-through}
.pd-discount{margin-left:auto;font-size:10px;font-weight:800;color:#ef4444;background:rgba(239,68,68,.12);padding:2px 8px;border-radius:999px}
.pd-badges{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:10px;color:rgba(255,255,255,.7)}
.pd-badges i{color:#10b981;margin-right:3px}
.pd-badges-sep{width:1px;height:11px;background:rgba(255,255,255,.12)}
.pd-options{display:flex;flex-wrap:wrap;gap:6px}
.pd-whatsapp{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);cursor:pointer;font-family:inherit;text-align:left;transition:background .2s,border-color .2s}
.pd-whatsapp:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}
.pd-whatsapp-ico{font-size:17px;color:#25D366;flex-shrink:0}
.pd-whatsapp-body{display:flex;flex-direction:column;flex:1 1 auto;min-width:0}
.pd-whatsapp-body strong{font-size:11px;font-weight:700;color:#fff}
.pd-whatsapp-body small{font-size:9.5px;color:rgba(255,255,255,.45)}
.pd-whatsapp-arrow{font-size:11px;color:rgba(255,255,255,.3);transition:color .2s}
.pd-whatsapp:hover .pd-whatsapp-arrow{color:#fff}
.pd-actions{display:flex;align-items:center;gap:6px}
.pd-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 12px;border-radius:11px;border:1px solid transparent;font-family:inherit;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;transition:background .2s,border-color .2s,transform .14s,color .2s;white-space:nowrap}
.pd-btn:active{transform:scale(.96)}
.pd-btn i{font-size:12px}
.pd-btn--primary{flex:1 1 0;min-width:0;background:#fff;color:#000;border-color:rgba(0,0,0,.1)}
.pd-btn--primary:hover{background:#e5e7eb}
.pd-btn--icon{flex:0 0 auto;padding:9px 11px;background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.09);color:rgba(255,255,255,.6)}
.pd-btn--icon:hover{color:#f87171}
.pd-btn--ghost{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.09);color:rgba(255,255,255,.8)}
.pd-btn--ghost:hover{background:rgba(255,255,255,.09);color:#fff}
.pd-btn--muted{background:rgba(255,255,255,.05);color:rgba(255,255,255,.6);border-color:rgba(255,255,255,.08)}
.pd-btn--danger{background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.25);color:#f87171}
.pd-btn--danger:hover{background:rgba(239,68,68,.2)}
.pd-btn--block{width:100%}
.pd-section-label{font-size:8px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin:0}
.pd-text{font-size:10.5px;line-height:1.6;color:rgba(255,255,255,.75);margin:0;font-weight:300}
.pd-text--muted{opacity:.7}
.pd-strong{color:#fff;font-weight:600}
.pd-note{padding:10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}
.pd-delivery{display:flex;flex-direction:column;gap:6px}
.pd-delivery-item{display:flex;align-items:flex-start;gap:10px;padding:10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}
.pd-delivery-item i{font-size:13px;color:rgba(255,255,255,.55);margin-top:1px}
.pd-delivery-item p{margin:0;font-size:10.5px;font-weight:600;color:#fff}
.pd-delivery-item small{font-size:9px;color:rgba(255,255,255,.5)}
.pd-rating-summary{display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:12px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
.pd-rating-score{display:flex;align-items:center;gap:10px}
.pd-rating-score>span{font-size:22px;font-weight:500;color:#fff;letter-spacing:-.02em}
.pd-stars{display:flex;gap:1px;color:#facc15;font-size:10px}
.pd-stars--sm{font-size:10px;margin-top:6px}
.pd-rating-count{font-size:9px;color:rgba(255,255,255,.45)}
.pd-rating-bars{flex:1 1 200px;display:grid;grid-template-columns:repeat(2,1fr);gap:2px 14px}
.pd-rating-bar{display:flex;align-items:center;gap:7px}
.pd-rating-bar-label{width:26px;font-size:9px;color:rgba(255,255,255,.5)}
.pd-rating-bar-track{flex:1;height:5px;border-radius:999px;background:rgba(255,255,255,.09);overflow:hidden}
.pd-rating-bar-fill{height:100%;background:#facc15;border-radius:999px}
.pd-rating-bar-value{width:30px;text-align:right;font-size:9px;color:rgba(255,255,255,.5)}
.pd-review-toolbar{display:flex;justify-content:flex-end}
.pd-review-form{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .38s cubic-bezier(.16,1,.3,1),opacity .24s ease}
.pd-review-form>*{overflow:hidden;min-height:0}
.pd-review-form.is-open{grid-template-rows:1fr;opacity:1}
.pd-review-form-inner{display:flex;flex-direction:column;gap:10px;padding:12px;margin-top:8px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.pd-reviewer{display:flex;align-items:center;gap:10px}
.pd-reviewer-avatar{width:28px;height:28px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0}
.pd-reviewer-name{display:block;font-size:11.5px;font-weight:700;color:#fff}
.pd-reviewer-verified{font-size:9px;color:rgba(255,255,255,.4)}
.pd-star-input{display:flex;align-items:center;gap:4px;cursor:pointer}
.pd-star-input .bi-star-fill{font-size:18px;color:rgba(255,255,255,.18);transition:color .16s,transform .16s}
.pd-star-input .bi-star-fill.is-on{color:#facc15}
.pd-star-input .bi-star-fill:hover{transform:scale(1.12)}
.pd-star-input>span{font-size:10px;color:rgba(255,255,255,.45);margin-left:6px}
.pd-textarea-wrap{position:relative}
.pd-textarea-wrap textarea{width:100%;min-height:68px;resize:none;padding:10px 12px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:11px;outline:none;transition:border-color .2s}
.pd-textarea-wrap textarea:focus{border-color:rgba(59,130,246,.5)}
.pd-charcount{position:absolute;right:10px;bottom:8px;font-size:9px;color:rgba(255,255,255,.3)}
.pd-review-form-actions{display:flex;justify-content:flex-end;gap:6px}
.pd-reviews-feed{display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;scrollbar-width:none;padding-right:2px}
.pd-reviews-feed::-webkit-scrollbar{display:none}
.pd-review-card{padding:12px;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);transition:border-color .2s,background .2s}
.pd-review-card:hover{border-color:rgba(255,255,255,.14)}
.pd-review-head{display:flex;gap:10px;align-items:flex-start}
.pd-review-avatar{width:30px;height:30px;border-radius:50%;background:rgba(99,102,241,.25);color:#a5b4fc;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0}
.pd-review-meta{flex:1 1 auto;min-width:0}
.pd-review-name-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.pd-review-name{font-size:11.5px;font-weight:700;color:#fff}
.pd-review-verified{display:inline-flex;align-items:center;gap:3px;font-size:7.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#34d399;background:rgba(16,185,129,.12);padding:2px 6px;border-radius:999px}
.pd-review-date{margin-left:auto;font-size:9px;color:rgba(255,255,255,.35)}
.pd-review-variants{display:flex;gap:5px;font-size:9.5px;color:rgba(255,255,255,.45);margin-top:2px}
.pd-review-text-wrap{overflow:hidden;transition:max-height .32s cubic-bezier(.16,1,.3,1)}
.pd-review-text-wrap.is-clamped{max-height:42px}
.pd-review-text{margin:0;font-size:11px;line-height:1.55;color:rgba(255,255,255,.7)}
.pd-review-more{margin-top:5px;border:none;background:none;padding:0;font-family:inherit;font-size:10px;font-weight:700;color:#60a5fa;cursor:pointer}
.pd-review-more:hover{text-decoration:underline}
.pd-review-foot{display:flex;gap:16px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.06)}
.pd-review-foot button{display:inline-flex;align-items:center;gap:4px;border:none;background:none;padding:0;font-family:inherit;font-size:10px;color:rgba(255,255,255,.4);cursor:pointer;transition:color .2s}
.pd-review-foot button:hover{color:rgba(255,255,255,.8)}
.search-modes{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin-bottom:10px}
.search-modes::-webkit-scrollbar{display:none}
.search-mode-btn{flex-shrink:0;padding:7px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(255,255,255,.55);font-family:inherit;font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.search-mode-btn:hover{background:rgba(255,255,255,.08);color:#fff}
.search-mode-btn.is-active{background:#fff;color:#000;border-color:rgba(0,0,0,.1)}
.search-input-wrap{position:relative;margin-bottom:10px}
.search-input{width:100%;padding:11px 40px 11px 14px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:12px;outline:none;transition:border-color .2s,background .2s}
.search-input::placeholder{color:rgba(255,255,255,.3)}
.search-input:focus{border-color:rgba(59,130,246,.5);background:rgba(255,255,255,.07)}
.search-input-ico{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.3);font-size:13px}
.search-suggestions{animation:fadeUp .26s ease-out}
@keyframes fadeUp{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
.search-block{margin-bottom:14px}
.search-block-head{display:flex;align-items:center;justify-content:space-between;padding:0 4px 8px;font-size:8.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35)}
.search-count{color:#60a5fa;letter-spacing:.02em}
.search-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
.search-tile{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:#fff;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;text-align:left;transition:background .2s,border-color .2s,transform .14s}
.search-tile:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14)}
.search-tile:active{transform:scale(.98)}
.search-tile i{font-size:10px;opacity:.35}
.search-tile-count{font-size:9px;font-weight:700;color:rgba(255,255,255,.35)}
.search-rows{display:flex;flex-direction:column;gap:4px;max-height:330px;overflow-y:auto;scrollbar-width:none}
.search-rows::-webkit-scrollbar{display:none}
.search-row{display:flex;align-items:center;gap:10px;padding:8px;border-radius:12px;cursor:pointer;transition:background .2s}
.search-row:hover{background:rgba(255,255,255,.06)}
.search-row-thumb{width:44px;height:44px;border-radius:10px;overflow:hidden;background:rgba(255,255,255,.05);flex-shrink:0}
.search-row-thumb img{width:100%;height:100%;object-fit:cover}
.search-row-icon{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.5);flex-shrink:0}
.search-row-body{flex:1 1 auto;min-width:0}
.search-row-title{margin:0;font-size:11.5px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.search-row-meta{display:flex;align-items:center;gap:6px;font-size:9.5px;color:rgba(255,255,255,.45);margin-top:1px}
.search-dot{width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.25)}
.search-row-price{margin:2px 0 0;font-size:10.5px;font-weight:800;color:#60a5fa}
.search-row-chev{font-size:11px;color:rgba(255,255,255,.2);flex-shrink:0}
.search-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 16px;text-align:center}
.search-empty-ico{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.2);font-size:20px;margin-bottom:12px}
.search-empty p{margin:0;font-size:12px;font-weight:700;color:rgba(255,255,255,.45)}
.search-empty small{font-size:10px;color:rgba(255,255,255,.25);margin-top:4px}
.notif-list{display:flex;flex-direction:column;gap:6px;max-height:340px;overflow-y:auto;scrollbar-width:none;padding-right:2px}
.notif-list::-webkit-scrollbar{display:none}
.notif-empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:40px 16px;font-size:11px;color:rgba(255,255,255,.3)}
.notif-empty i{font-size:20px}
.notif-card{display:flex;align-items:center;gap:10px;width:100%;padding:10px;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);font-family:inherit;text-align:left;cursor:pointer;transition:background .2s,border-color .2s,transform .14s}
.notif-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}
.notif-card:active{transform:scale(.99)}
.notif-card.is-unread{border-color:color-mix(in srgb,var(--tone,#3b82f6) 35%,transparent);background:color-mix(in srgb,var(--tone,#3b82f6) 7%,transparent)}
.notif-ico{flex:0 0 30px;width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:var(--tone,#94a3b8);background:color-mix(in srgb,var(--tone,#94a3b8) 15%,transparent);border:1px solid color-mix(in srgb,var(--tone,#94a3b8) 28%,transparent);font-size:12px}
.notif-body{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1px}
.notif-top{display:flex;align-items:center;gap:6px}
.notif-label{font-size:8.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--tone,#94a3b8)}
.notif-dot{width:5px;height:5px;border-radius:50%;background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.18)}
.notif-time{margin-left:auto;font-size:8.5px;color:rgba(255,255,255,.3)}
.notif-msg{font-size:11px;line-height:1.4;color:rgba(255,255,255,.72);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.notif-chev{font-size:11px;color:rgba(255,255,255,.2);flex-shrink:0}
.notif-footer{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.07)}
.notif-footer-btn{border:none;background:none;padding:4px 8px;border-radius:8px;font-family:inherit;font-size:10px;font-weight:700;color:#60a5fa;cursor:pointer;transition:background .2s,color .2s}
.notif-footer-btn:hover{background:rgba(59,130,246,.1)}
.notif-footer-btn--danger{color:rgba(248,113,113,.75)}
.notif-footer-btn--danger:hover{background:rgba(239,68,68,.1);color:#f87171}
.orders-filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.orders-list{display:flex;flex-direction:column;gap:8px;max-height:380px;overflow-y:auto;scrollbar-width:none;padding-right:2px}
.orders-list::-webkit-scrollbar{display:none}
.order-card{border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);overflow:hidden;transition:border-color .24s,background .24s,box-shadow .24s}
.order-card:hover{border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.055)}
.order-card.is-open{border-color:rgba(59,130,246,.32);background:rgba(59,130,246,.05);box-shadow:0 0 0 1px rgba(59,130,246,.1) inset}
.order-card-head{position:relative;display:block;width:100%;padding:12px;border:none;background:none;font-family:inherit;text-align:left;cursor:pointer}
.order-card-head-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.order-status{font-size:8.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:6px}
.order-status.is-pending{color:#fbbf24;background:rgba(245,158,11,.12)}
.order-status.is-shipped{color:#a78bfa;background:rgba(139,92,246,.14)}
.order-status.is-delivered{color:#34d399;background:rgba(16,185,129,.14)}
.order-id{font-size:9px;color:rgba(255,255,255,.35);font-weight:600}
.order-card-title{margin:0;font-size:12px;font-weight:700;color:#fff;padding-right:22px;transition:color .2s}
.order-card-head-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:5px}
.order-date{font-size:9.5px;color:rgba(255,255,255,.4)}
.order-total{font-size:11.5px;font-weight:800;color:#fff}
.order-chevron{position:absolute;top:14px;right:12px;font-size:11px;color:rgba(255,255,255,.3);transition:transform .34s cubic-bezier(.16,1,.3,1),color .25s}
.order-card.is-open .order-chevron{transform:rotate(180deg);color:#60a5fa}
.order-details{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .4s cubic-bezier(.16,1,.3,1),opacity .26s ease}
.order-details>.order-details-inner{overflow:hidden;min-height:0}
.order-card.is-open .order-details{grid-template-rows:1fr;opacity:1}
.order-details-inner{display:flex;flex-direction:column;gap:8px;padding:0 12px 12px}
.order-panel{padding:10px;border-radius:11px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}
.order-panel--mini{padding:8px 10px}
.order-panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:8.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.4)}
.order-stage-pill{font-size:8px;font-weight:800;letter-spacing:.06em;color:#fbbf24;background:rgba(245,158,11,.12);padding:2px 7px;border-radius:999px}
.order-panel-label{margin:0 0 2px;font-size:8.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.38)}
.order-panel-value{margin:0;font-size:10.5px;font-weight:600;color:rgba(255,255,255,.85)}
.order-timeline{position:relative;display:flex;justify-content:space-between;padding-top:2px}
.order-timeline::before{content:'';position:absolute;top:6px;left:8%;right:8%;height:2px;background:rgba(255,255,255,.08);border-radius:999px}
.order-timeline-step{position:relative;z-index:1;flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:6px}
.order-timeline-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.1);border:2px solid rgba(8,8,10,.9);transition:background .28s,box-shadow .28s,transform .28s}
.order-timeline-step.is-done .order-timeline-dot{background:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.15)}
.order-timeline-step.is-current .order-timeline-dot{background:#f59e0b;box-shadow:0 0 0 4px rgba(245,158,11,.2);animation:pulseDot 2s ease-in-out infinite;transform:scale(1.1)}
.order-timeline-label{font-size:8.5px;font-weight:600;color:rgba(255,255,255,.3);text-align:center}
.order-timeline-step.is-done .order-timeline-label{color:rgba(255,255,255,.6)}
.order-timeline-step.is-current .order-timeline-label{color:#fbbf24;font-weight:800}
.order-items{display:flex;flex-direction:column;gap:6px}
.order-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;border-radius:9px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05)}
.order-item-body{min-width:0}
.order-item-name{margin:0;font-size:10.5px;font-weight:700;color:#fff}
.order-item-meta{margin:1px 0 0;font-size:9px;color:rgba(255,255,255,.45)}
.order-item-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.order-item-qty{font-size:9.5px;color:rgba(255,255,255,.45)}
.order-item-price{font-size:10.5px;font-weight:700;color:#fff}
.order-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
.order-actions{display:flex;gap:6px}
.order-actions .pd-btn{flex:1 1 0}
.cart-step{display:flex;flex-direction:column;gap:14px}
.cart-step.is-hidden{display:none}
.cart-items{display:flex;flex-direction:row;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
.cart-items::-webkit-scrollbar{display:none}
.cart-item-row{flex:0 0 auto;min-width:250px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);transition:background .2s}
.cart-item-row:hover{background:rgba(255,255,255,.06)}
.cart-item-main{display:flex;align-items:center;gap:10px;min-width:0}
.cart-item-thumb{width:50px;height:50px;border-radius:10px;overflow:hidden;background:rgba(255,255,255,.05);flex-shrink:0}
.cart-item-thumb img{width:100%;height:100%;object-fit:cover}
.cart-item-meta{min-width:0}
.cart-item-title{margin:0;font-size:11px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cart-item-variants{display:flex;align-items:center;gap:5px;margin-top:3px}
.cart-chip{font-size:8px;font-weight:800;text-transform:uppercase;color:rgba(255,255,255,.5);background:rgba(255,255,255,.07);padding:1px 5px;border-radius:4px}
.cart-dot{width:5px;height:5px;border-radius:50%;background:#3b82f6}
.cart-variant{font-size:9px;font-weight:700;color:rgba(255,255,255,.45)}
.cart-qty{font-size:9px;color:rgba(255,255,255,.35);margin-left:3px}
.cart-item-price{margin:3px 0 0;font-size:10px;font-weight:800;color:#60a5fa}
.cart-remove{flex-shrink:0;border:none;background:none;padding:4px 8px;border-radius:8px;font-family:inherit;font-size:9.5px;font-weight:700;color:rgba(248,113,113,.6);cursor:pointer;transition:background .2s,color .2s}
.cart-remove:hover{background:rgba(239,68,68,.08);color:#f87171}
.cart-section{padding-top:12px;border-top:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;gap:9px}
.cart-section-label{font-size:8.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.42)}
.cart-section-label em{font-style:normal;text-transform:none;letter-spacing:0;opacity:.5}
.cart-section-toggle{display:flex;align-items:center;justify-content:space-between;border:none;background:none;padding:0;font-family:inherit;cursor:pointer;width:100%}
.cart-section-status{font-size:10px;font-weight:800;color:#60a5fa;transition:color .2s}
.cart-section-status.is-success{color:#34d399}
.cart-section-status.is-error{color:#f87171}
.ship-toggle{display:flex;gap:5px;padding:3px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
.ship-toggle-btn{flex:1 1 0;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 8px;border-radius:9px;border:none;background:transparent;color:rgba(255,255,255,.5);font-family:inherit;font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:background .22s,color .22s}
.ship-toggle-btn:hover{color:#fff}
.ship-toggle-btn.is-active{background:#fff;color:#000}
.ship-toggle-btn.is-disabled{opacity:.35;cursor:not-allowed;pointer-events:none}
.ship-panel{display:flex;flex-direction:column;gap:8px}
.ship-panel.is-hidden{display:none}
.address-list{display:flex;flex-direction:column;gap:6px}
.address-card{display:flex;align-items:flex-start;gap:10px;padding:10px;border-radius:12px;border:1.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);cursor:pointer;transition:border-color .22s,background .22s,box-shadow .22s}
.address-card:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.15)}
.address-card.is-selected{border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.08);box-shadow:0 0 0 1px rgba(59,130,246,.15) inset}
.address-icon{flex:0 0 30px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(255,255,255,.6);transition:background .2s,color .2s}
.address-card.is-selected .address-icon{background:rgba(59,130,246,.15);color:#60a5fa}
.address-body{flex:1 1 auto;min-width:0}
.address-head{display:flex;align-items:center;gap:6px;margin-bottom:2px}
.address-label{font-size:11px;font-weight:700;color:#fff}
.address-tag{font-size:7.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#34d399;background:rgba(16,185,129,.12);padding:2px 6px;border-radius:999px}
.address-tag--blue{color:#60a5fa;background:rgba(59,130,246,.12)}
.address-line{margin:0;font-size:10px;line-height:1.45;color:rgba(255,255,255,.55)}
.address-phone{margin:2px 0 0;font-size:9px;color:rgba(255,255,255,.38)}
.address-check{opacity:0;transform:scale(.5);transition:opacity .24s cubic-bezier(.16,1,.3,1),transform .24s cubic-bezier(.16,1,.3,1);color:#34d399;font-size:13px;flex-shrink:0}
.address-card.is-selected .address-check{opacity:1;transform:scale(1)}
.cart-dashed-btn{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:10px;border-radius:11px;border:1px dashed rgba(255,255,255,.16);background:transparent;color:rgba(255,255,255,.5);font-family:inherit;font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:background .2s,border-color .2s,color .2s}
.cart-dashed-btn:hover{color:#fff;border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.04)}
.cart-form-box{display:flex;flex-direction:column;gap:7px;padding:10px;margin-top:8px;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07)}
.cart-input{width:100%;padding:9px 11px;border-radius:9px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);color:#fff;font-family:inherit;font-size:11px;outline:none;transition:border-color .2s}
.cart-input::placeholder{color:rgba(255,255,255,.3)}
.cart-input:focus{border-color:rgba(59,130,246,.5)}
.cart-form-actions{display:flex;gap:6px;padding-top:2px}
.cart-form-actions .pd-btn{flex:1 1 0}
.cart-alert{display:flex;flex-direction:column;gap:3px;padding:12px;border-radius:12px;text-align:center;align-items:center}
.cart-alert--error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2)}
.cart-alert--error i{font-size:18px;color:#f87171;margin-bottom:4px}
.cart-alert--error p{margin:0;font-size:10.5px;color:rgba(248,113,113,.85)}
.cart-alert--info{flex-direction:row;text-align:left;align-items:flex-start;gap:8px;margin-top:8px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15)}
.cart-alert--info i{font-size:12px;color:#60a5fa;margin-top:1px}
.cart-alert--info p{margin:0;font-size:9.5px;line-height:1.5;color:rgba(147,197,253,.8)}
.promo-input-wrapper{display:flex;gap:6px;padding:4px 8px;background:rgba(255,255,255,.04);border-radius:11px;border:1px solid rgba(255,255,255,.08);transition:border-color .2s}
.promo-input-wrapper:focus-within{border-color:rgba(59,130,246,.4)}
.promo-input{flex:1 1 auto;min-width:0;background:transparent;border:none;outline:none;color:#fff;font-family:inherit;font-size:11px;font-weight:500;padding:8px 4px}
.promo-input::placeholder{color:rgba(255,255,255,.25)}
.promo-apply-btn{flex-shrink:0;padding:6px 16px;border-radius:8px;border:none;background:#fff;color:#000;font-family:inherit;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;transition:background .2s,transform .14s}
.promo-apply-btn:hover{background:#e5e7eb}
.promo-apply-btn:active{transform:scale(.96)}
.promo-suggestions{padding:8px 2px 2px}
.promo-suggestions-label{font-size:8px;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,.3);font-weight:800;margin-bottom:6px}
.promo-tags{display:flex;flex-wrap:wrap;gap:5px}
.promo-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);color:rgba(255,255,255,.7);font-size:9px;font-weight:700;cursor:pointer;transition:background .2s,border-color .2s,color .2s}
.promo-tag:hover{background:rgba(59,130,246,.14);border-color:rgba(59,130,246,.3);color:#fff}
.promo-tag-code{letter-spacing:.04em}
.promo-tag-discount{font-size:7.5px;opacity:.6}
.cart-totals{gap:7px}
.cart-total-row{display:flex;align-items:center;justify-content:space-between;font-size:10.5px;color:rgba(255,255,255,.5)}
.cart-total-row span:last-child{color:#fff;font-weight:600}
.cart-total-row--grand{padding-top:8px;margin-top:2px;border-top:1px solid rgba(255,255,255,.08);font-size:13px;font-weight:800;color:#fff}
.cart-total-row--grand span:last-child{font-size:14px;font-weight:800}
.cart-discount{color:#34d399!important}
.cart-primary-btn{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;padding:13px;border-radius:13px;border:1px solid rgba(0,0,0,.1);background:#fff;color:#000;font-family:inherit;font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:background .2s,transform .14s}
.cart-primary-btn:hover{background:#e5e7eb}
.cart-primary-btn:active{transform:scale(.98)}
.cart-primary-btn:disabled{opacity:.6;cursor:wait}
.cart-back-btn{display:inline-flex;align-items:center;gap:5px;border:none;background:none;padding:0;font-family:inherit;font-size:10.5px;font-weight:700;color:#60a5fa;cursor:pointer;align-self:flex-start}
.cart-back-btn:hover{text-decoration:underline}
.cart-summary-card{padding:12px;border-radius:13px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:8px}
.cart-summary-head{display:flex;align-items:center;justify-content:space-between;font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.4)}
.cart-textarea{width:100%;min-height:68px;resize:none;padding:10px 12px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:11px;outline:none;transition:border-color .2s}
.cart-textarea::placeholder{color:rgba(255,255,255,.3)}
.cart-textarea:focus{border-color:rgba(59,130,246,.5)}
.payment-list{display:flex;flex-direction:column;gap:6px}
.payment-option{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;border:1.5px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);cursor:pointer;transition:border-color .22s,background .22s,box-shadow .22s}
.payment-option:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.15)}
.payment-option.is-selected{border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.08);box-shadow:0 0 0 1px rgba(59,130,246,.15) inset}
.payment-icon{flex:0 0 30px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;font-size:13px;color:rgba(255,255,255,.6);transition:background .2s,color .2s}
.payment-option.is-selected .payment-icon{background:rgba(59,130,246,.15);color:#60a5fa}
.payment-body{flex:1 1 auto;min-width:0}
.payment-title{margin:0;font-size:11px;font-weight:700;color:#fff}
.payment-sub{margin:2px 0 0;font-size:9px;color:rgba(255,255,255,.4)}
.payment-check{opacity:0;transform:scale(.5);transition:opacity .24s cubic-bezier(.16,1,.3,1),transform .24s cubic-bezier(.16,1,.3,1);color:#34d399;font-size:13px;flex-shrink:0}
.payment-option.is-selected .payment-check{opacity:1;transform:scale(1)}
.cart-spinner{display:inline-block;width:12px;height:12px;border:2px solid rgba(0,0,0,.2);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;margin-right:6px}
@keyframes spin{to{transform:rotate(360deg)}}
.profile-stack{display:flex;flex-direction:column;gap:10px}
.profile-card{display:flex;flex-direction:column;gap:10px;padding:12px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07)}
.profile-row{display:flex;align-items:center;gap:12px}
.profile-row--between{justify-content:space-between}
.profile-avatar{width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.45);flex-shrink:0}
.profile-avatar svg{width:22px;height:22px}
.profile-id{display:flex;flex-direction:column;gap:1px;min-width:0}
.profile-name{font-size:12px;font-weight:700;color:#fff}
.profile-mail{font-size:10px;color:rgba(255,255,255,.45)}
.profile-actions{display:flex;gap:6px}
.profile-actions .pd-btn{flex:1 1 0}
.profile-edit{flex-shrink:0;padding:5px 12px;border-radius:9px;border:none;background:rgba(59,130,246,.12);color:#60a5fa;font-family:inherit;font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:background .2s}
.profile-edit:hover{background:rgba(59,130,246,.2)}
.profile-link{border:none;background:none;padding:0;font-family:inherit;font-size:10px;font-weight:700;color:#60a5fa;cursor:pointer;align-self:center}
.profile-link:hover{text-decoration:underline}
.auth-wrap{display:flex;flex-direction:column;gap:14px;padding-top:4px}
.auth-brand{display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px 0 2px}
.auth-brand-ico{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;box-shadow:0 12px 32px -12px rgba(59,130,246,.6)}
.auth-brand-title{font-size:16px;font-weight:700;color:#fff;letter-spacing:-.01em;margin:0}
.auth-brand-sub{font-size:10.5px;color:rgba(255,255,255,.45);margin:0}
.auth-form{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08)}
.auth-field{display:flex;flex-direction:column;gap:4px}
.auth-label{font-size:8.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45)}
.auth-input-wrap{position:relative}
.auth-input{width:100%;padding:11px 12px 11px 38px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:12px;outline:none;transition:border-color .2s,background .2s}
.auth-input::placeholder{color:rgba(255,255,255,.3)}
.auth-input:focus{border-color:rgba(59,130,246,.5);background:rgba(255,255,255,.07)}
.auth-input-ico{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.35);font-size:13px;pointer-events:none}
.auth-input-toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:none;color:rgba(255,255,255,.4);cursor:pointer;padding:4px;border-radius:6px;transition:color .2s,background .2s}
.auth-input-toggle:hover{color:#fff;background:rgba(255,255,255,.06)}
.auth-row{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10px;color:rgba(255,255,255,.55)}
.auth-check{display:inline-flex;align-items:center;gap:6px;cursor:pointer;user-select:none}
.auth-check input{display:none}
.auth-check-box{width:14px;height:14px;border-radius:4px;border:1.5px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s}
.auth-check input:checked+.auth-check-box{background:#3b82f6;border-color:#3b82f6}
.auth-check-box i{font-size:9px;color:#fff;opacity:0}
.auth-check input:checked+.auth-check-box i{opacity:1}
.auth-link{border:none;background:none;padding:0;font-family:inherit;font-size:10px;font-weight:700;color:#60a5fa;cursor:pointer}
.auth-link:hover{text-decoration:underline}
.auth-submit{margin-top:2px}
.auth-divider{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.3);font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08)}
.auth-socials{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.auth-social{display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;border-radius:11px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.035);color:#fff;font-family:inherit;font-size:10.5px;font-weight:700;cursor:pointer;transition:background .2s,border-color .2s}
.auth-social:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.18)}
.auth-social i{font-size:14px}
.auth-foot{text-align:center;font-size:10.5px;color:rgba(255,255,255,.5)}
.auth-foot b{color:#60a5fa;cursor:pointer;font-weight:800}
.auth-foot b:hover{text-decoration:underline}
.auth-error{font-size:10px;color:#f87171;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.22);padding:8px 10px;border-radius:9px;display:none}
.auth-error.is-visible{display:block}
.auth-success{font-size:10px;color:#34d399;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.22);padding:8px 10px;border-radius:9px;display:none}
.auth-success.is-visible{display:block}
.smooth-dropdown{display:grid;grid-template-rows:0fr;opacity:0;pointer-events:none;transition:grid-template-rows .36s cubic-bezier(.16,1,.3,1),opacity .22s ease}
.smooth-dropdown>*{overflow:hidden;min-height:0}
.smooth-dropdown.is-open{grid-template-rows:1fr;opacity:1;pointer-events:auto}
.gallery-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.gallery-card{display:flex;flex-direction:column;border-radius:12px;overflow:hidden;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);cursor:pointer;font-family:inherit;text-align:left;padding:0;transition:background .2s,border-color .2s,transform .14s}
.gallery-card:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}
.gallery-card:active{transform:scale(.98)}
.gallery-thumb{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:rgba(255,255,255,.04)}
.gallery-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.gallery-fav{position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:11px;transition:color .2s,background .2s,transform .14s}
.gallery-fav:hover{color:#f472b6;background:rgba(0,0,0,.7)}
.gallery-fav.is-on{color:#ec4899;background:rgba(236,72,153,.2);border-color:rgba(236,72,153,.4)}
.gallery-fav:active{transform:scale(.9)}
.gallery-meta{padding:8px 10px 10px;display:flex;flex-direction:column;gap:2px}
.gallery-brand{font-size:8px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#60a5fa}
.gallery-title{margin:0;font-size:11px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gallery-price{font-size:11px;font-weight:800;color:#fff;margin-top:2px}
@media (max-width:480px){.sticky-cta{bottom:calc(14px + env(safe-area-inset-bottom,0px));backdrop-filter:blur(12px) saturate(120%);-webkit-backdrop-filter:blur(12px) saturate(120%)}.sticky-view{padding:14px 13px 12px}.cta-tile{padding:6px 7px;font-size:9px}.cta-tile-ico{width:18px;height:18px}.cta-tile-ico i{font-size:10px}.view-title{font-size:12.5px}.cta-alert-zone{width:calc(100vw - 26px)}.order-grid{grid-template-columns:1fr}.gallery-grid{grid-template-columns:repeat(2,1fr);gap:6px}}
@media (max-width:380px){.sticky-cta{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}.cta-tile-label{display:none}.cta-tile{justify-content:center}}
@media (prefers-reduced-motion:reduce){.sticky-cta,.sticky-cta-panel,.sticky-view,.sticky-cta-toggle,.sticky-cta-back,.cta-tile,.cta-tile-ico,.sticky-cta-overlay,.cta-alert-zone,.cta-toast,.address-card,.payment-option,.smooth-dropdown,.order-details,.order-chevron,.pd-review-form,.pd-review-text-wrap,.hub-ad-msg,.mv-dot{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.sticky-cta{background:rgba(8,8,10,.96)}.cta-toast{background:rgba(12,12,15,.98)}.filter-dropdown{background:rgba(14,14,17,1)}.sticky-cta-overlay{background:rgba(0,0,0,.75)}.gallery-fav{background:rgba(0,0,0,.8)}}
@supports not (background:color-mix(in srgb,red 50%,blue)){.cta-toast-ico,.notif-ico{background:rgba(148,163,184,.16);border-color:rgba(148,163,184,.3)}.notif-card.is-unread{background:rgba(59,130,246,.07);border-color:rgba(59,130,246,.35)}}
`;

  /* ═══════════════════════════════════════════════════════════════════
     2. ROOT HTML
     ═══════════════════════════════════════════════════════════════════ */
  const ROOT_HTML = `
<div id="sticky-cta-overlay" class="sticky-cta-overlay" aria-hidden="true"></div>
<div id="cta-alert-zone" class="cta-alert-zone" aria-live="polite" aria-atomic="false"></div>
<div class="sticky-cta" id="stickyCta" data-current="hub" aria-hidden="true">
  <div class="sticky-cta-panel" id="stickyCtaPanel">
    <div class="sticky-cta-panel-inner" id="stickyCtaViews"></div>
  </div>
  <div class="sticky-cta-bar">
    <button class="sticky-cta-back" type="button" id="stickyBackBtn" aria-label="Back">
      <i class="bi bi-chevron-left"></i>
    </button>
    <a href="#" class="sticky-cta-primary" id="stickyPrimaryCta">
      <span>Sign in</span>
      <i class="bi bi-arrow-right-short"></i>
    </a>
    <button class="sticky-cta-toggle" type="button" id="stickyToggleBtn" aria-expanded="false" aria-label="Expand quick access">
      <i class="bi bi-grid-3x3-gap-fill" id="stickyToggleIcon"></i>
    </button>
  </div>
</div>`;

  /* ═══════════════════════════════════════════════════════════════════
     3. DATA
     ═══════════════════════════════════════════════════════════════════ */
  const PRODUCTS = {
    PROD_001: {
      id: "PROD_001",
      sku: "KC6611",
      title: "Adidas classic t-shirt",
      brand: "Adidas",
      category: "Tops",
      price: 1290,
      oldPrice: 1690,
      discount: 24,
      rating: 4.8,
      reviewCount: 2300,
      stock: "in",
      images: [
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/a4ff4a779ee34deca8cc9a6f1f411440_9366/KC6611_HM1.jpg",
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/1f0135cfef624e779735b6390f38c98b_9366/KC6611_HM5.jpg",
      ],
      colors: [
        { value: "Black", hex: "#111111" },
        { value: "White", hex: "#ffffff" },
        { value: "Red", hex: "#ef4444" },
        { value: "Blue", hex: "#3b82f6" },
        { value: "Navy", hex: "#172554" },
        { value: "Gray", hex: "#9ca3af" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      specs:
        'Premium athletic slim-fit. <span class="pd-strong">100% sustainably sourced</span> organic cotton.',
      model: '<span class="pd-strong">• Model:</span> 180cm, size M',
      description:
        "A versatile everyday tee built for movement. Soft breathable cotton with reinforced stitching and a clean silhouette.",
      delivery: [
        {
          title: "Free Express",
          detail: 'Arrives <span class="pd-strong">Jul 15-18</span>',
          icon: "bi-box",
        },
        { title: "2-4 Days", detail: "Tracking provided", icon: "bi-clock" },
      ],
      reviews: [
        {
          author: "Ahmed M.",
          initials: "AM",
          verified: true,
          date: "12 May 2026",
          rating: 5,
          size: "L",
          color: "Black",
          text: "Excellent fabric quality. Fits true to size. The material feels premium and the stitching is top-notch. Highly recommend this for anyone looking for a classic casual tee.",
          helpful: 12,
          replies: 0,
        },
        {
          author: "Sara K.",
          initials: "SK",
          verified: true,
          date: "10 May 2026",
          rating: 4,
          size: "M",
          color: "White",
          text: "Great design, but color slightly different from the picture. It\u2019s more of a cream white than pure white. Still looks good though.",
          helpful: 8,
          replies: 0,
        },
        {
          author: "Khaled M.",
          initials: "KM",
          verified: true,
          date: "5 May 2026",
          rating: 5,
          size: "XL",
          color: "Navy",
          text: "Absolutely love this t-shirt! I\u2019ve been wearing Adidas for years, and this classic tee is one of the best. The fit is perfect, not too tight and not too loose. It washes well without shrinking or losing its shape.",
          helpful: 24,
          replies: 3,
        },
      ],
    },
    PROD_002: {
      id: "PROD_002",
      sku: "NIK-AM90",
      title: "Nike Air Max Sneaker",
      brand: "Nike",
      category: "Footwear",
      price: 4200,
      oldPrice: 5200,
      discount: 19,
      rating: 4.7,
      reviewCount: 1840,
      stock: "in",
      images: [
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/a4ff4a779ee34deca8cc9a6f1f411440_9366/KC6611_HM1.jpg",
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/1f0135cfef624e779735b6390f38c98b_9366/KC6611_HM5.jpg",
      ],
      colors: [
        { value: "Stealth Black", hex: "#1f1f1f" },
        { value: "White", hex: "#ffffff" },
        { value: "Wolf Grey", hex: "#9ca3af" },
        { value: "University Red", hex: "#dc2626" },
      ],
      sizes: ["39", "40", "41", "42", "43", "44", "45"],
      specs:
        'Air-cushioned midsole. <span class="pd-strong">Full-grain leather</span> upper with breathable mesh panels.',
      model: '<span class="pd-strong">• Fit:</span> True to size',
      description:
        "Iconic Air Max silhouette with visible cushioning and street-ready attitude. Built for all-day comfort and everyday rotation.",
      delivery: [
        {
          title: "Free Express",
          detail: 'Arrives <span class="pd-strong">Jul 16-19</span>',
          icon: "bi-box",
        },
        { title: "3-5 Days", detail: "Tracking provided", icon: "bi-clock" },
      ],
      reviews: [
        {
          author: "Omar F.",
          initials: "OF",
          verified: true,
          date: "8 May 2026",
          rating: 5,
          size: "43",
          color: "Stealth Black",
          text: "Super comfortable. The cushioning is excellent and the fit is perfect. Been wearing them daily for a month with no issues.",
          helpful: 17,
          replies: 1,
        },
        {
          author: "Layla H.",
          initials: "LH",
          verified: true,
          date: "2 May 2026",
          rating: 4,
          size: "40",
          color: "White",
          text: "Really nice sneakers, but they run slightly narrow. Consider sizing up if you have wide feet.",
          helpful: 9,
          replies: 0,
        },
      ],
    },
    PROD_003: {
      id: "PROD_003",
      sku: "PUM-TEE",
      title: "Puma Essential T-Shirt",
      brand: "Puma",
      category: "Tops",
      price: 890,
      oldPrice: 1100,
      discount: 19,
      rating: 4.6,
      reviewCount: 940,
      stock: "in",
      images: [
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/a4ff4a779ee34deca8cc9a6f1f411440_9366/KC6611_HM1.jpg",
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/1f0135cfef624e779735b6390f38c98b_9366/KC6611_HM5.jpg",
      ],
      colors: [
        { value: "Black", hex: "#111111" },
        { value: "White", hex: "#ffffff" },
        { value: "Peacoat", hex: "#1e293b" },
      ],
      sizes: ["S", "M", "L", "XL"],
      specs:
        'Lightweight jersey cotton with <span class="pd-strong">dryCELL</span> moisture management.',
      model: '<span class="pd-strong">• Model:</span> 178cm, size M',
      description:
        "A lightweight training tee that wicks sweat and keeps you cool through every session.",
      delivery: [
        {
          title: "Standard",
          detail: 'Arrives <span class="pd-strong">Jul 18-21</span>',
          icon: "bi-box",
        },
        { title: "3-4 Days", detail: "Tracking provided", icon: "bi-clock" },
      ],
      reviews: [
        {
          author: "Yousef A.",
          initials: "YA",
          verified: true,
          date: "20 Apr 2026",
          rating: 5,
          size: "L",
          color: "Black",
          text: "Great training shirt. Light and breathable. Washed it several times and it still looks new.",
          helpful: 6,
          replies: 0,
        },
      ],
    },
    PROD_004: {
      id: "PROD_004",
      sku: "ADI-HOOD",
      title: "Adidas Essentials Hoodie",
      brand: "Adidas",
      category: "Outerwear",
      price: 2100,
      oldPrice: 2600,
      discount: 19,
      rating: 4.9,
      reviewCount: 3120,
      stock: "low",
      images: [
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/a4ff4a779ee34deca8cc9a6f1f411440_9366/KC6611_HM1.jpg",
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/1f0135cfef624e779735b6390f38c98b_9366/KC6611_HM5.jpg",
      ],
      colors: [
        { value: "Black", hex: "#111111" },
        { value: "Medium Grey", hex: "#9ca3af" },
        { value: "Navy", hex: "#172554" },
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      specs:
        'Brushed-back fleece. <span class="pd-strong">70% cotton / 30% recycled polyester</span>.',
      model: '<span class="pd-strong">• Model:</span> 182cm, size L',
      description:
        "The hoodie you reach for every day. Soft, warm, and built with a relaxed fit that layers cleanly.",
      delivery: [
        {
          title: "Free Express",
          detail: 'Arrives <span class="pd-strong">Jul 15-17</span>',
          icon: "bi-box",
        },
        { title: "2-3 Days", detail: "Tracking provided", icon: "bi-clock" },
      ],
      reviews: [
        {
          author: "Mariam S.",
          initials: "MS",
          verified: true,
          date: "1 May 2026",
          rating: 5,
          size: "M",
          color: "Medium Grey",
          text: "So cozy. The fleece is thick without being heavy. Perfect for cooler evenings.",
          helpful: 14,
          replies: 0,
        },
        {
          author: "Hassan R.",
          initials: "HR",
          verified: true,
          date: "22 Apr 2026",
          rating: 5,
          size: "XL",
          color: "Black",
          text: "Great quality hoodie. Ordered a second one in navy.",
          helpful: 5,
          replies: 0,
        },
      ],
    },
    PROD_005: {
      id: "PROD_005",
      sku: "NIK-SHRT",
      title: "Nike Running Shorts",
      brand: "Nike",
      category: "Bottoms",
      price: 650,
      oldPrice: 850,
      discount: 24,
      rating: 4.5,
      reviewCount: 780,
      stock: "in",
      images: [
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/a4ff4a779ee34deca8cc9a6f1f411440_9366/KC6611_HM1.jpg",
        "https://assets.adidas.com/images/w_1880,f_auto,q_auto/1f0135cfef624e779735b6390f38c98b_9366/KC6611_HM5.jpg",
      ],
      colors: [
        { value: "Black", hex: "#111111" },
        { value: "Volt", hex: "#d9f99d" },
      ],
      sizes: ["S", "M", "L", "XL"],
      specs:
        'Dri-FIT fabric with <span class="pd-strong">built-in liner</span> and zip pocket.',
      model: '<span class="pd-strong">• Model:</span> 180cm, size M',
      description:
        "Lightweight running shorts with a breathable liner and secure zip pocket for your essentials.",
      delivery: [
        {
          title: "Standard",
          detail: 'Arrives <span class="pd-strong">Jul 17-20</span>',
          icon: "bi-box",
        },
      ],
      reviews: [
        {
          author: "Rana T.",
          initials: "RT",
          verified: true,
          date: "28 Apr 2026",
          rating: 5,
          size: "M",
          color: "Black",
          text: "Perfect length and super light. The zip pocket is a lifesaver.",
          helpful: 4,
          replies: 0,
        },
      ],
    },
  };

  const SHIPPING_ADDRESSES = [
    {
      id: "addr-1",
      label: "Home",
      tag: "Default",
      icon: "bi-house-door",
      line: "12 Nile Street, Apt 4B, Zamalek, Cairo",
      phone: "+20 100 123 4567",
      cost: 50,
    },
    {
      id: "addr-2",
      label: "Work",
      tag: null,
      icon: "bi-briefcase",
      line: "45 Smart Village, Building B7, 6th of October, Giza",
      phone: "+20 100 123 4567",
      cost: 50,
    },
  ];
  const PICKUP_BRANCH = {
    line: "123 Nile Street, Downtown, Cairo",
    hours: "Open daily · 10:00 AM — 10:00 PM",
    phone: "+20 100 987 6543",
    cost: 0,
  };

  const ORDERS = [
    {
      id: "ORD-8822",
      status: "Pending",
      statusClass: "is-pending",
      title: "Nike Air Max Sneaker + 1 item",
      date: "July 04, 2026",
      total: "EGP 5,200",
      stage: 0,
      stageLabel: "Awaiting confirmation",
      courier: "Aramex (Express)",
      destination: "Giza, Al Haram St.",
      payment: "Cash on Delivery",
      items: [
        {
          name: "Nike Air Max Sneaker",
          meta: "Size: 43 · Stealth Black",
          qty: 1,
          price: "EGP 4,200",
        },
        {
          name: "Adidas Classic T-Shirt",
          meta: "Size: M · Blue",
          qty: 1,
          price: "EGP 1,000",
        },
      ],
    },
    {
      id: "ORD-8823",
      status: "Shipped",
      statusClass: "is-shipped",
      title: "Adidas classic t-shirt",
      date: "July 02, 2026",
      total: "EGP 1,290",
      stage: 2,
      stageLabel: "In transit",
      courier: "Bosta",
      destination: "Cairo, Zamalek",
      payment: "Credit Card",
      items: [
        {
          name: "Adidas Classic T-Shirt",
          meta: "Size: M · Blue",
          qty: 1,
          price: "EGP 1,290",
        },
      ],
    },
  ];
  const ORDER_STAGES = ["Placed", "Processed", "Shipped", "Delivered"];

  const SEARCH_DATA = {
    products: Object.values(PRODUCTS).map((p) => ({
      id: p.id,
      name: p.title,
      brand: p.brand,
      price: "EGP " + p.price.toLocaleString(),
      category: p.category,
      image: p.images[0],
    })),
    categories: [
      { id: 1, name: "Tops", count: 45, icon: "bi-bag" },
      { id: 2, name: "Bottoms", count: 32, icon: "bi-bag" },
      { id: 3, name: "Footwear", count: 28, icon: "bi-bag" },
      { id: 4, name: "Outerwear", count: 19, icon: "bi-bag" },
      { id: 5, name: "Accessories", count: 14, icon: "bi-bag" },
    ],
    stores: [
      {
        id: 1,
        name: "Adidas Official Store",
        location: "Cairo, Egypt",
        rating: 4.9,
        verified: true,
      },
      {
        id: 2,
        name: "Nike Egypt",
        location: "Alexandria, Egypt",
        rating: 4.7,
        verified: true,
      },
      {
        id: 3,
        name: "Puma Sports",
        location: "Giza, Egypt",
        rating: 4.5,
        verified: false,
      },
    ],
    orders: ORDERS.map((o) => ({
      id: o.id,
      status: o.status,
      date: o.date,
      total: o.total,
    })),
  };
  const POPULAR = {
    brands: ["Adidas", "Nike", "Puma", "Under Armour"],
    categories: ["Sneakers", "Streetwear", "T-Shirts", "Hoodies"],
  };

  const ALERT_TYPES = {
    cart: {
      icon: "bi-bag-check-fill",
      tone: "#10b981",
      label: "Cart",
      view: "cart",
    },
    order: {
      icon: "bi-box-seam-fill",
      tone: "#f59e0b",
      label: "Orders",
      view: "orders",
    },
    auth: {
      icon: "bi-shield-lock-fill",
      tone: "#3b82f6",
      label: "Account",
      view: "profile",
    },
    success: {
      icon: "bi-check-circle-fill",
      tone: "#10b981",
      label: "Success",
      view: null,
    },
    logout: {
      icon: "bi-door-open-fill",
      tone: "#f97316",
      label: "Session",
      view: "profile",
    },
    favorite: {
      icon: "bi-heart-fill",
      tone: "#ec4899",
      label: "Wishlist",
      view: "favorites",
    },
    shipping: {
      icon: "bi-truck",
      tone: "#6366f1",
      label: "Delivery",
      view: "cart",
    },
    reminder: {
      icon: "bi-bell-fill",
      tone: "#f59e0b",
      label: "Restock",
      view: "notfications",
    },
    search: {
      icon: "bi-search",
      tone: "#3b82f6",
      label: "Search",
      view: "search",
    },
    product: {
      icon: "bi-bag",
      tone: "#8b5cf6",
      label: "Product",
      view: "quick-look",
    },
    info: {
      icon: "bi-info-circle-fill",
      tone: "#94a3b8",
      label: "Notice",
      view: null,
    },
    error: {
      icon: "bi-exclamation-triangle-fill",
      tone: "#ef4444",
      label: "Error",
      view: null,
    },
  };

  /* ── i18n dictionary (lightweight, only the visible chrome) ── */
  const I18N = {
    en: {
      quickAccess: "Quick access",
      storeName: "Peacock Store",
      live: "Live",
      fitYou: "Fit you",
      inCart: "In cart",
      ordersCount: "Orders",
      promoTitle: "Promo codes",
      promoTap: "Tap to apply",
      cart: "Cart",
      orders: "Orders",
      search: "Search",
      alerts: "Alerts",
      favorites: "Favorites",
      gallery: "Gallery",
      profile: "Profile",
    },
    ar: {
      quickAccess: "وصول سريع",
      storeName: "متجر بيكوك",
      live: "مباشر",
      fitYou: "يناسبك",
      inCart: "في السلة",
      ordersCount: "الطلبات",
      promoTitle: "أكواد الخصم",
      promoTap: "اضغط للتطبيق",
      cart: "السلة",
      orders: "الطلبات",
      search: "بحث",
      alerts: "التنبيهات",
      favorites: "المفضلة",
      gallery: "المعرض",
      profile: "الحساب",
    },
  };

  /* ═══════════════════════════════════════════════════════════════════
     4. TEMPLATES
     ═══════════════════════════════════════════════════════════════════ */
  const T = {};

  T.hub = () => `
<div class="sticky-view is-active" data-view="hub">
  <div class="hub-inner">
    <div class="hub-ad" aria-live="polite">
      <span class="hub-ad-icon"><i class="bi bi-megaphone-fill"></i></span>
      <div class="hub-ad-viewport">
        <span class="hub-ad-msg">🔥 Summer Sale — up to 40% off selected items</span>
        <span class="hub-ad-msg">🚚 Free shipping on orders over EGP 1,500</span>
        <span class="hub-ad-msg">⚡ Flash deal: extra 10% with code SAVE10</span>
      </div>
    </div>

    <header class="view-head view-head--tight">
      <div class="view-head-main">
        <span class="view-eyebrow" data-i18n="quickAccess">Quick access</span>
        <h4 class="view-title" data-i18n="storeName">Peacock Store</h4>
      </div>
      <span class="mini-pill"><span class="mv-dot"></span><span data-i18n="live">Live</span></span>
    </header>

    <div class="cta-tiles">
      <button type="button" class="cta-tile" data-target="cart">
        <span class="cta-tile-ico"><i class="bi bi-bag"></i></span>
        <span class="cta-tile-label" data-i18n="cart">Cart</span>
        <span class="cta-tile-badge" data-badge="cart">2</span>
      </button>
      <button type="button" class="cta-tile" data-target="orders">
        <span class="cta-tile-ico"><i class="bi bi-box-seam"></i></span>
        <span class="cta-tile-label" data-i18n="orders">Orders</span>
        <span class="cta-tile-badge" data-badge="orders">2</span>
      </button>
      <button type="button" class="cta-tile" data-target="search">
        <span class="cta-tile-ico"><i class="bi bi-search"></i></span>
        <span class="cta-tile-label" data-i18n="search">Search</span>
      </button>
      <button type="button" class="cta-tile" data-target="notfications">
        <span class="cta-tile-ico"><i class="bi bi-bell"></i></span>
        <span class="cta-tile-label" data-i18n="alerts">Alerts</span>
        <span class="cta-tile-badge is-hidden" data-badge="notfications">0</span>
      </button>
      <button type="button" class="cta-tile" data-target="favorites">
        <span class="cta-tile-ico"><i class="bi bi-heart"></i></span>
        <span class="cta-tile-label" data-i18n="favorites">Favorites</span>
        <span class="cta-tile-badge" data-badge="favorites">0</span>
      </button>
      <button type="button" class="cta-tile" data-target="gallery">
        <span class="cta-tile-ico"><i class="bi bi-grid-3x3-gap"></i></span>
        <span class="cta-tile-label" data-i18n="gallery">Gallery</span>
      </button>
      <button type="button" class="cta-tile" data-target="profile">
        <span class="cta-tile-ico"><i class="bi bi-person"></i></span>
        <span class="cta-tile-label" data-i18n="profile">Profile</span>
      </button>
      <button type="button" class="cta-tile" data-lang-toggle aria-label="Change language">
        <span class="cta-tile-ico"><i class="bi bi-translate"></i></span>
        <span class="cta-tile-label" id="langLabel">EN</span>
      </button>
    </div>

    <div class="cta-metrics">
      <div class="cta-metric"><span class="mini-label" data-i18n="fitYou">Fit you</span><span class="cta-metric-value">8</span></div>
      <div class="cta-metrics-sep"></div>
      <div class="cta-metric"><span class="mini-label" data-i18n="inCart">In cart</span><span class="cta-metric-value">2</span></div>
      <div class="cta-metrics-sep"></div>
      <div class="cta-metric"><span class="mini-label" data-i18n="ordersCount">Orders</span><span class="cta-metric-value">2</span></div>
    </div>

    
  </div>
</div>`;

  T.quickLookShell = () => `
<div class="sticky-view" data-view="quick-look">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Product</span>
      <h4 class="view-title">Quick look</h4>
    </div>
    <span class="mini-pill" id="qlStockPill"><span class="mv-dot"></span>In stock</span>
  </header>
  <div id="quickLookMount"></div>
</div>`;

  T.quickLookBody = (p) => {
    const stockText = p.stock === "low" ? "Low stock" : "In stock";
    const stockClass = p.stock === "low" ? "is-low" : "";
    return `
<div class="pd-layout">
  <div class="pd-gallery">
    <div class="pd-gallery-frame">
      <div id="ql-image-container" class="pd-gallery-track">
        ${p.images.map((u) => `<img src="${u}" class="ql-slide" loading="lazy" alt="${p.title}">`).join("")}
      </div>
      <div class="pd-gallery-badge"><span id="image-counter">1/${p.images.length}</span></div>
    </div>
    <div class="pd-progress"><div id="image-progress-bar" class="pd-progress-fill" style="width:0%"></div></div>
  </div>

  <div class="pd-info">
    <span class="pd-brand">${p.brand} · ${p.category}</span>
    <h3 class="pd-title" id="ql-title">${p.title}</h3>

    <div class="pd-tabs">
      <button id="tab-overview" onclick="switchPDTab('overview')" class="tab-btn is-active">Buy &amp; Overview</button>
      <button id="tab-details"  onclick="switchPDTab('details')"  class="tab-btn">Specs</button>
      <button id="tab-shipping" onclick="switchPDTab('shipping')" class="tab-btn">Delivery</button>
      <button id="tab-reviews"  onclick="switchPDTab('reviews')"  class="tab-btn">Reviews</button>
    </div>

    <div class="pd-panes">
      <div id="pane-overview" class="pd-pane is-active">
        <div class="pd-price-row">
          <span class="pd-price">EGP ${p.price.toLocaleString()}</span>
          ${p.oldPrice ? `<span class="pd-old-price">EGP ${p.oldPrice.toLocaleString()}</span>` : ""}
          ${p.discount ? `<span class="pd-discount">-${p.discount}%</span>` : ""}
        </div>
        <div class="pd-badges">
          <span><i class="bi bi-check-circle-fill"></i> Free Delivery</span>
          <span class="pd-badges-sep"></span>
          <span class="${stockClass}"><i class="bi bi-check-circle-fill"></i> ${stockText}</span>
        </div>
        <div class="pd-options">
          <div class="filter" data-filter="color">
            <button type="button" class="filter-trigger" aria-expanded="false" aria-haspopup="listbox">
              <span class="filter-value">
                <span class="filter-label">Color</span>
                <span class="filter-selected" id="selectedColorText">Choose</span>
              </span>
              <i class="bi bi-chevron-down"></i>
            </button>
            <div class="filter-dropdown">
              <div class="filter-dropdown-header"><span id="colorCount">${p.colors.length} colors</span></div>
              <div class="filter-options" id="color-options">
                ${p.colors
                  .map(
                    (c) => `
                  <button type="button" class="filter-option color-option" data-value="${c.value}" data-color="${c.hex}">
                    <span class="option-left">
                      <span class="color-swatch" style="--swatch:${c.hex}"></span>
                      <span>${c.value}</span>
                    </span>
                    <i class="bi bi-check2 option-check"></i>
                  </button>`,
                  )
                  .join("")}
              </div>
            </div>
          </div>

          <div class="filter" data-filter="size">
            <button type="button" class="filter-trigger" aria-expanded="false" aria-haspopup="listbox">
              <span class="filter-value">
                <span class="filter-label">Size</span>
                <span class="filter-selected" id="selectedSizeText">Choose</span>
              </span>
              <i class="bi bi-chevron-down"></i>
            </button>
            <div class="filter-dropdown">
              <div class="filter-dropdown-header"><span>${p.sizes.length} sizes</span></div>
              <div class="filter-options size-options" id="size-options">
                ${p.sizes
                  .map(
                    (s) => `
                  <button type="button" class="filter-option size-option" data-value="${s}">
                    <span>${s}</span><i class="bi bi-check2 option-check"></i>
                  </button>`,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        <button type="button" class="pd-whatsapp" onclick="askOwnerOnWhatsApp('${p.id}')">
          <span class="pd-whatsapp-ico"><i class="bi bi-whatsapp"></i></span>
          <span class="pd-whatsapp-body">
            <strong>Ask about this item</strong>
            <small>Chat with the store on WhatsApp</small>
          </span>
          <i class="bi bi-arrow-up-right pd-whatsapp-arrow"></i>
        </button>

        <div class="pd-actions">
          <button type="button" class="pd-btn pd-btn--primary" onclick="handleProductQuickBuy('${p.id}')">
            <i class="bi bi-lightning-fill"></i><span>Quick Buy</span>
          </button>
          <button type="button" class="pd-btn pd-btn--icon" aria-label="Add to favorites"
                  onclick="event.stopPropagation(); toggleFavorite('${p.id}', true)">
            <i class="bi bi-heart"></i>
          </button>
          <button type="button" class="pd-btn pd-btn--primary" onclick="handleProductAddToBag('${p.id}')">
            <i class="bi bi-bag-plus"></i><span>Add to Bag</span>
          </button>
        </div>
      </div>

      <div id="pane-details" class="pd-pane">
        <h4 class="pd-section-label">Materials</h4>
        <p class="pd-text">${p.specs}</p>
        <div class="pd-note"><p class="pd-text pd-text--muted">${p.model}</p></div>
        <h4 class="pd-section-label" style="margin-top:6px">About</h4>
        <p class="pd-text pd-text--muted">${p.description}</p>
      </div>

      <div id="pane-shipping" class="pd-pane">
        <h4 class="pd-section-label">Delivery</h4>
        <div class="pd-delivery">
          ${p.delivery
            .map(
              (d) => `
            <div class="pd-delivery-item">
              <i class="bi ${d.icon}"></i>
              <div><p>${d.title}</p><small>${d.detail}</small></div>
            </div>`,
            )
            .join("")}
        </div>
      </div>

      <div id="pane-reviews" class="pd-pane">
        <div class="pd-rating-summary">
          <div class="pd-rating-score">
            <span>${p.rating}</span>
            <div>
              <div class="pd-stars">${'<i class="bi bi-star-fill"></i>'.repeat(5)}</div>
              <span class="pd-rating-count">Based on ${p.reviewCount.toLocaleString()} reviews</span>
            </div>
          </div>
          <div class="pd-rating-bars">
            ${[
              { s: 5, w: 80 },
              { s: 4, w: 10 },
              { s: 3, w: 5 },
              { s: 2, w: 3 },
            ]
              .map(
                (b) => `
              <div class="pd-rating-bar">
                <span class="pd-rating-bar-label">${b.s} ★</span>
                <div class="pd-rating-bar-track"><div class="pd-rating-bar-fill" style="width:${b.w}%"></div></div>
                <span class="pd-rating-bar-value">${b.w}%</span>
              </div>`,
              )
              .join("")}
          </div>
        </div>

        <div class="pd-review-toolbar">
          <button onclick="toggleReviewForm()" class="pd-btn pd-btn--ghost">
            <i class="bi bi-pencil-square"></i> Write a review
          </button>
        </div>

        <div id="review-form-panel" class="pd-review-form">
          <div class="pd-review-form-inner">
            <p class="pd-section-label">Share your experience</p>
            <div class="pd-reviewer">
              <div class="pd-reviewer-avatar">JD</div>
              <div>
                <span class="pd-reviewer-name">John Doe</span>
                <span class="pd-reviewer-verified">Verified account</span>
              </div>
            </div>
            <div class="pd-star-input" id="star-rating-input">
              <i class="bi bi-star-fill" data-value="1"></i>
              <i class="bi bi-star-fill" data-value="2"></i>
              <i class="bi bi-star-fill" data-value="3"></i>
              <i class="bi bi-star-fill" data-value="4"></i>
              <i class="bi bi-star-fill" data-value="5"></i>
              <span id="rating-text">Select rating</span>
            </div>
            <div class="pd-textarea-wrap">
              <textarea id="form-review-text" rows="2" placeholder="Write your experience..." maxlength="200"></textarea>
              <span class="pd-charcount"><span id="char-count">0</span>/200</span>
            </div>
            <div class="pd-review-form-actions">
              <button onclick="toggleReviewForm()" class="pd-btn pd-btn--muted">Cancel</button>
              <button onclick="submitUserReview()" class="pd-btn pd-btn--primary"><i class="bi bi-send"></i> Post</button>
            </div>
          </div>
        </div>

        <div id="reviews-feed-container" class="pd-reviews-feed">
          ${p.reviews
            .map((r) => {
              const isLong = r.text.length > 90;
              const stars = Array.from(
                { length: 5 },
                (_, i) =>
                  `<i class="bi bi-star-fill"${i + 1 > r.rating ? ' style="opacity:.25"' : ""}></i>`,
              ).join("");
              return `
          <div class="pd-review-card">
            <div class="pd-review-head">
              <div class="pd-review-avatar">${r.initials}</div>
              <div class="pd-review-meta">
                <div class="pd-review-name-row">
                  <span class="pd-review-name">${r.author}</span>
                  ${r.verified ? '<span class="pd-review-verified"><i class="bi bi-check-circle-fill"></i> Verified</span>' : ""}
                  <span class="pd-review-date">${r.date}</span>
                </div>
                <div class="pd-review-variants">
                  ${r.size ? `<span>Size: ${r.size}</span>` : ""}
                  ${r.color ? `<span>·</span><span>Color: ${r.color}</span>` : ""}
                </div>
              </div>
            </div>
            <div class="pd-stars pd-stars--sm">${stars}</div>
            <div class="pd-review-text-wrap${isLong ? " is-clamped" : ""}">
              <p class="pd-review-text">${r.text}</p>
            </div>
            ${isLong ? `<button class="pd-review-more" onclick="toggleReviewExpand(this)">Read more</button>` : ""}
            <div class="pd-review-foot">
              <button><i class="bi bi-hand-thumbs-up"></i> Helpful (${r.helpful || 0})</button>
              <button><i class="bi bi-chat"></i> Reply${r.replies ? " (" + r.replies + ")" : ""}</button>
            </div>
          </div>`;
            })
            .join("")}
        </div>
      </div>
    </div>
  </div>
</div>`;
  };

  /* ── GALLERY (whole store) ── */
  T.gallery = () => `
<div class="sticky-view" data-view="gallery">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Browse</span>
      <h4 class="view-title">Store Gallery</h4>
    </div>
    <span class="mini-pill" id="galleryCountPill">${Object.keys(PRODUCTS).length} items</span>
  </header>
  <div class="gallery-grid" id="galleryGrid">
    ${Object.values(PRODUCTS)
      .map(
        (p) => `
      <button type="button" class="gallery-card" data-product="${p.id}">
        <div class="gallery-thumb">
          <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
          <span class="gallery-fav" data-fav-toggle="${p.id}" aria-label="Toggle favorite">
            <i class="bi bi-heart"></i>
          </span>
        </div>
        <div class="gallery-meta">
          <span class="gallery-brand">${p.brand}</span>
          <p class="gallery-title">${p.title}</p>
          <span class="gallery-price">EGP ${p.price.toLocaleString()}</span>
        </div>
      </button>`,
      )
      .join("")}
  </div>
</div>`;

  /* ── FAVORITES ── */
  T.favorites = () => `
<div class="sticky-view" data-view="favorites">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Wishlist</span>
      <h4 class="view-title">Your Favorites</h4>
    </div>
    <span class="mini-pill" id="favCountPill">0 items</span>
  </header>
  <div class="gallery-grid" id="favoritesGrid"></div>
</div>`;

  /* ── SEARCH ── */
  T.search = () => `
<div class="sticky-view" data-view="search">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Discover</span>
      <h4 class="view-title">Search</h4>
    </div>
  </header>
  <div class="search-modes">
    <button id="mode-products"   onclick="switchSearchMode('products')"   class="search-mode-btn is-active">Products</button>
    <button id="mode-categories" onclick="switchSearchMode('categories')" class="search-mode-btn">Categories</button>
    <button id="mode-stores"     onclick="switchSearchMode('stores')"     class="search-mode-btn">Stores</button>
    <button id="mode-orders"     onclick="switchSearchMode('orders')"     class="search-mode-btn">Orders</button>
  </div>
  <div class="search-input-wrap">
    <input type="text" id="search-input" placeholder="Search products..." class="search-input" autocomplete="off">
    <i class="bi bi-search search-input-ico"></i>
  </div>
  <div id="search-suggestions-area" class="search-suggestions"></div>
</div>`;

  T.notfications = () => `
<div class="sticky-view" data-view="notfications">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Inbox</span>
      <h4 class="view-title">Notifications</h4>
    </div>
    <div class="view-head-side">
      <span id="notification-badge-counter" class="mini-pill">0 Unread</span>
    </div>
  </header>
  <div class="notif-list" id="notification-scroll-container"></div>
  <div class="notif-footer">
    <button onclick="clearAllNotifications()" class="notif-footer-btn notif-footer-btn--danger">Clear all</button>
    <button onclick="markAllNotificationsAsRead()" class="notif-footer-btn">Mark all as read</button>
  </div>
</div>`;

  T.orders = () => `
<div class="sticky-view" data-view="orders">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">History</span>
      <h4 class="view-title">Your Orders</h4>
    </div>
    <div class="view-head-side">
      <span class="mini-pill" id="ordersCountPill">${ORDERS.length} orders</span>
    </div>
  </header>
  <div class="orders-filters">
    <div class="filter" data-filter="order-status">
      <button type="button" class="filter-trigger" aria-expanded="false">
        <span class="filter-value"><span class="filter-selected">All statuses</span></span>
        <i class="bi bi-chevron-down"></i>
      </button>
      <div class="filter-dropdown">
        <div class="filter-options">
          <button type="button" class="filter-option is-selected" data-value="all">All statuses</button>
          <button type="button" class="filter-option" data-value="pending"><span class="status-dot pending"></span>Pending</button>
          <button type="button" class="filter-option" data-value="processing"><span class="status-dot processing"></span>Processing</button>
          <button type="button" class="filter-option" data-value="shipped"><span class="status-dot shipped"></span>Shipped</button>
          <button type="button" class="filter-option" data-value="delivered"><span class="status-dot delivered"></span>Delivered</button>
        </div>
      </div>
    </div>
    <div class="filter" data-filter="payment">
      <button type="button" class="filter-trigger" aria-expanded="false">
        <span class="filter-value"><span class="filter-selected">All payments</span></span>
        <i class="bi bi-chevron-down"></i>
      </button>
      <div class="filter-dropdown">
        <div class="filter-options">
          <button type="button" class="filter-option is-selected" data-value="all">All payments</button>
          <button type="button" class="filter-option" data-value="cash">Cash</button>
          <button type="button" class="filter-option" data-value="card">Card</button>
          <button type="button" class="filter-option" data-value="wallet">E-Wallet</button>
        </div>
      </div>
    </div>
  </div>
  <div class="orders-list" id="ordersList"></div>
</div>`;

  T.cart = () => `
<div class="sticky-view" data-view="cart">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Checkout</span>
      <h4 class="view-title" id="cart-head-title">Your Cart</h4>
    </div>
    <div class="view-head-side">
      <span id="cart-badge-counter" class="mini-pill">2 Items</span>
    </div>
  </header>

  <div id="cart-step-1" class="cart-step">
    <div id="cart-items" class="cart-items">
      <div class="cart-item-row" data-item-price="1290" data-quantity="1">
        <div class="cart-item-main">
          <div class="cart-item-thumb"><img src="${PRODUCTS.PROD_001.images[0]}" alt=""></div>
          <div class="cart-item-meta">
            <p class="cart-item-title">Adidas classic t-shirt</p>
            <div class="cart-item-variants">
              <span class="cart-chip">M</span>
              <span class="cart-dot"></span>
              <span class="cart-variant">Blue</span>
              <span class="cart-qty">Qty: 1</span>
            </div>
            <p class="cart-item-price">EGP 1,290</p>
          </div>
        </div>
        <button onclick="removeCartItemRow(this)" class="cart-remove">Remove</button>
      </div>
      <div class="cart-item-row" data-item-price="1290" data-quantity="1">
        <div class="cart-item-main">
          <div class="cart-item-thumb"><img src="${PRODUCTS.PROD_001.images[0]}" alt=""></div>
          <div class="cart-item-meta">
            <p class="cart-item-title">Adidas classic t-shirt</p>
            <div class="cart-item-variants">
              <span class="cart-chip">M</span>
              <span class="cart-dot"></span>
              <span class="cart-variant">Blue</span>
              <span class="cart-qty">Qty: 1</span>
            </div>
            <p class="cart-item-price">EGP 1,290</p>
          </div>
        </div>
        <button onclick="removeCartItemRow(this)" class="cart-remove">Remove</button>
      </div>
    </div>

    <div class="cart-section">
      <span class="cart-section-label">Shipping method</span>
      <div class="ship-toggle">
        <button type="button" id="tab-shipping-home"   onclick="selectShippingMethod('home')"   class="ship-toggle-btn is-active"><i class="bi bi-house-door"></i> Home Delivery</button>
        <button type="button" id="tab-shipping-pickup" onclick="selectShippingMethod('pickup')" class="ship-toggle-btn"><i class="bi bi-shop"></i> Store Pickup</button>
      </div>

      <div id="shipping-home-panel" class="ship-panel">
        <div id="address-list" class="address-list">
          <div class="address-card is-selected" data-address-id="addr-1" data-shipping-cost="50" onclick="selectAddress(this)">
            <div class="address-icon"><i class="bi bi-house-door"></i></div>
            <div class="address-body">
              <div class="address-head"><span class="address-label">Home</span><span class="address-tag">Default</span></div>
              <p class="address-line">12 Nile Street, Apt 4B, Zamalek, Cairo</p>
              <p class="address-phone">+20 100 123 4567</p>
            </div>
            <i class="bi bi-check-circle-fill address-check"></i>
          </div>
          <div class="address-card" data-address-id="addr-2" data-shipping-cost="50" onclick="selectAddress(this)">
            <div class="address-icon"><i class="bi bi-briefcase"></i></div>
            <div class="address-body">
              <div class="address-head"><span class="address-label">Work</span></div>
              <p class="address-line">45 Smart Village, Building B7, 6th of October, Giza</p>
              <p class="address-phone">+20 100 123 4567</p>
            </div>
            <i class="bi bi-check-circle-fill address-check"></i>
          </div>
        </div>

        <button type="button" onclick="toggleNewAddressForm()" class="cart-dashed-btn">
          <i class="bi bi-plus-lg"></i> Add new address
        </button>

        <div id="new-address-form" class="smooth-dropdown">
          <div class="cart-form-box">
            <input type="text" id="new-addr-label"  placeholder="Label (e.g. Home, Work)" class="cart-input">
            <input type="text" id="new-addr-street" placeholder="Street, building, apt" class="cart-input">
            <input type="text" id="new-addr-city"   placeholder="City" class="cart-input">
            <input type="tel"  id="new-addr-phone"  placeholder="Phone number" class="cart-input">
            <div class="cart-form-actions">
              <button type="button" onclick="toggleNewAddressForm()" class="pd-btn pd-btn--muted">Cancel</button>
              <button type="button" onclick="saveNewAddress()" class="pd-btn pd-btn--primary">Save address</button>
            </div>
          </div>
        </div>
      </div>

      <div id="shipping-pickup-panel" class="ship-panel is-hidden">
        <div id="pickup-disabled-message" class="cart-alert cart-alert--error is-hidden">
          <i class="bi bi-x-octagon"></i>
          <p><strong>Store pickup is currently unavailable</strong></p>
          <p>This store does not offer in-store pickup at the moment.</p>
        </div>
        <div id="pickup-enabled-content">
          <div class="address-card is-selected" data-shipping-cost="0">
            <div class="address-icon"><i class="bi bi-shop"></i></div>
            <div class="address-body">
              <div class="address-head">
                <span class="address-label">Peacock Store — Pickup Point</span>
                <span class="address-tag address-tag--blue">Free</span>
              </div>
              <p class="address-line">${PICKUP_BRANCH.line}</p>
              <p class="address-phone">${PICKUP_BRANCH.hours}</p>
              <p class="address-phone">${PICKUP_BRANCH.phone}</p>
            </div>
            <i class="bi bi-check-circle-fill address-check"></i>
          </div>
          <div class="cart-alert cart-alert--info">
            <i class="bi bi-info-circle"></i>
            <p>You'll receive a notification when your order is ready for pickup. Please bring a valid ID.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-section">
      <button type="button" onclick="togglePromoArea()" class="cart-section-toggle">
        <span class="cart-section-label">Promo code</span>
        <span class="cart-section-status" id="promo-status-text">Add</span>
      </button>
      <div id="promoArea" class="smooth-dropdown">
        <div class="promo-input-wrapper">
          <input type="text" id="promo-input" class="promo-input" placeholder="Enter code">
          <button type="button" class="promo-apply-btn" onclick="applyPromoCode()">Apply</button>
        </div>
        <div class="promo-suggestions">
          <div class="promo-suggestions-label">Suggested</div>
          <div class="promo-tags">
            <span class="promo-tag" onclick="setPromoCode('SAVE10')">
              <span class="promo-tag-code">SAVE10</span><span class="promo-tag-discount">10% off</span>
            </span>
            <span class="promo-tag" onclick="setPromoCode('FREESHIP')">
              <span class="promo-tag-code">FREESHIP</span><span class="promo-tag-discount">Free shipping</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-section cart-totals">
      <div class="cart-total-row"><span>Subtotal</span><span id="cart-subtotal">EGP 2,580</span></div>
      <div class="cart-total-row"><span>Shipping</span><span id="cart-shipping">EGP 50</span></div>
      <div class="cart-total-row" id="cart-promo-row" style="display:none">
        <span>Promo discount</span><span id="cart-promo" class="cart-discount">-EGP 0</span>
      </div>
      <div class="cart-total-row cart-total-row--grand">
        <span>Total</span><span id="checkout-total-price">EGP 2,630</span>
      </div>
    </div>

    <button onclick="goToCheckoutStep2()" class="cart-primary-btn">Continue to checkout <i class="bi bi-arrow-right"></i></button>
  </div>

  <div id="cart-step-2" class="cart-step is-hidden">
    <button onclick="goToCheckoutStep1()" class="cart-back-btn"><i class="bi bi-arrow-left"></i> Back to cart</button>
    <div class="cart-summary-card">
      <div class="cart-summary-head">
        <span>Order summary</span><span id="summary-item-count">2 items</span>
      </div>
      <div class="cart-total-row cart-total-row--grand">
        <span>Total</span><span id="summary-total">EGP 2,630</span>
      </div>
    </div>
    <div class="cart-section">
      <span class="cart-section-label">Order notes <em>(optional)</em></span>
      <textarea id="order-notes" rows="2" class="cart-textarea" placeholder="Add delivery instructions, gift note, etc..."></textarea>
    </div>
    <div class="cart-section">
      <span class="cart-section-label">Payment method</span>
      <div class="payment-list">
        <div class="payment-option is-selected" data-payment="card" onclick="selectPayment(this)">
          <div class="payment-icon"><i class="bi bi-credit-card"></i></div>
          <div class="payment-body">
            <p class="payment-title">Credit / Debit Card</p>
            <p class="payment-sub">Visa, Mastercard, Meeza</p>
          </div>
          <i class="bi bi-check-circle-fill payment-check"></i>
        </div>
        <div class="payment-option" data-payment="cod" onclick="selectPayment(this)">
          <div class="payment-icon"><i class="bi bi-cash-coin"></i></div>
          <div class="payment-body">
            <p class="payment-title">Cash on Delivery</p>
            <p class="payment-sub">Pay when your order arrives</p>
          </div>
          <i class="bi bi-check-circle-fill payment-check"></i>
        </div>
        <div class="payment-option" data-payment="wallet" onclick="selectPayment(this)">
          <div class="payment-icon"><i class="bi bi-wallet2"></i></div>
          <div class="payment-body">
            <p class="payment-title">Digital Wallet</p>
            <p class="payment-sub">Vodafone Cash, InstaPay</p>
          </div>
          <i class="bi bi-check-circle-fill payment-check"></i>
        </div>
      </div>
    </div>
    <div class="cart-section cart-totals">
      <div class="cart-total-row"><span>Subtotal</span><span id="final-subtotal">EGP 2,580</span></div>
      <div class="cart-total-row"><span>Shipping</span><span id="final-shipping">EGP 50</span></div>
      <div class="cart-total-row" id="final-promo-row" style="display:none">
        <span>Promo discount</span><span id="final-promo" class="cart-discount">-EGP 0</span>
      </div>
      <div class="cart-total-row cart-total-row--grand">
        <span>Total</span><span id="final-total">EGP 2,630</span>
      </div>
    </div>
    <button id="pay-submit-btn" onclick="submitOrder(this)" class="cart-primary-btn">
      <i class="bi bi-lock-fill"></i> Pay &amp; Submit • EGP 2,630
    </button>
  </div>
</div>`;

  T.profile = () => `
<div class="sticky-view" data-view="profile">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Account</span>
      <h4 class="view-title">Your Profile</h4>
    </div>
  </header>
  <div class="profile-stack">
    <div class="profile-card">
      <div class="profile-row">
        <div class="profile-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div class="profile-id">
          <span class="profile-name">Guest User</span>
          <span class="profile-mail">Sign in for full access</span>
        </div>
      </div>
      <div class="profile-actions">
        <button onclick="openSignIn()" class="pd-btn pd-btn--primary">Sign in</button>
        <button onclick="openSignUp()" class="pd-btn pd-btn--ghost">Create account</button>
      </div>
    </div>
    <div class="profile-card">
      <div class="profile-row profile-row--between">
        <div>
          <span class="profile-name">account username</span>
          <span class="profile-mail">omardognewg@gmail.com</span>
        </div>
        <button class="profile-edit">Edit</button>
      </div>
      <button onclick="showAlert('auth','Change password flow opened.')" class="pd-btn pd-btn--ghost pd-btn--block">Change password</button>
      <button onclick="showAlert('auth','Reset link sent to your email.')" class="profile-link">Forgot password? <u>Reset via email</u></button>
    </div>
    <button onclick="signOut()" class="pd-btn pd-btn--danger pd-btn--block">Sign out</button>
  </div>
</div>`;

  T.signin = () => `
<div class="sticky-view" data-view="signin">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Welcome back</span>
      <h4 class="view-title">Sign in</h4>
    </div>
  </header>
  <div class="auth-wrap">
    <div class="auth-brand">
      <div class="auth-brand-ico"><i class="bi bi-person-fill"></i></div>
      <h5 class="auth-brand-title">Welcome to Peacock</h5>
      <p class="auth-brand-sub">Sign in to track orders, save items and check out faster.</p>
    </div>
    <form class="auth-form" id="signinForm" onsubmit="return handleSignIn(event)">
      <div class="auth-error" id="signinError"></div>
      <div class="auth-field">
        <label class="auth-label" for="signinEmail">Email</label>
        <div class="auth-input-wrap">
          <i class="bi bi-envelope auth-input-ico"></i>
          <input type="email" id="signinEmail" class="auth-input" placeholder="you@example.com" autocomplete="email" required>
        </div>
      </div>
      <div class="auth-field">
        <label class="auth-label" for="signinPassword">Password</label>
        <div class="auth-input-wrap">
          <i class="bi bi-lock auth-input-ico"></i>
          <input type="password" id="signinPassword" class="auth-input" placeholder="Enter your password" autocomplete="current-password" required>
          <button type="button" class="auth-input-toggle" onclick="togglePassword('signinPassword', this)" aria-label="Show password">
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </div>
      <div class="auth-row">
        <label class="auth-check">
          <input type="checkbox" id="signinRemember">
          <span class="auth-check-box"><i class="bi bi-check-lg"></i></span>
          <span>Remember me</span>
        </label>
        <button type="button" class="auth-link" onclick="showAlert('auth','Reset link sent to your email.')">Forgot password?</button>
      </div>
      <button type="submit" class="pd-btn pd-btn--primary pd-btn--block auth-submit">
        <i class="bi bi-box-arrow-in-right"></i> Sign in
      </button>
    </form>
    <div class="auth-divider">or</div>
    <div class="auth-socials">
      <button type="button" class="auth-social" onclick="showAlert('info','Google sign in (demo).')">
        <i class="bi bi-google"></i> Google
      </button>
      <button type="button" class="auth-social" onclick="showAlert('info','Apple sign in (demo).')">
        <i class="bi bi-apple"></i> Apple
      </button>
    </div>
    <p class="auth-foot">New here? <b onclick="openSignUp()">Create an account</b></p>
  </div>
</div>`;

  T.signup = () => `
<div class="sticky-view" data-view="signup">
  <header class="view-head">
    <div class="view-head-main">
      <span class="view-eyebrow">Get started</span>
      <h4 class="view-title">Create account</h4>
    </div>
  </header>
  <div class="auth-wrap">
    <div class="auth-brand">
      <div class="auth-brand-ico"><i class="bi bi-stars"></i></div>
      <h5 class="auth-brand-title">Join Peacock Store</h5>
      <p class="auth-brand-sub">Save favorites, get restock alerts and exclusive promo codes.</p>
    </div>
    <form class="auth-form" id="signupForm" onsubmit="return handleSignUp(event)">
      <div class="auth-error" id="signupError"></div>
      <div class="auth-field">
        <label class="auth-label" for="signupName">Full name</label>
        <div class="auth-input-wrap">
          <i class="bi bi-person auth-input-ico"></i>
          <input type="text" id="signupName" class="auth-input" placeholder="Your full name" autocomplete="name" required>
        </div>
      </div>
      <div class="auth-field">
        <label class="auth-label" for="signupEmail">Email</label>
        <div class="auth-input-wrap">
          <i class="bi bi-envelope auth-input-ico"></i>
          <input type="email" id="signupEmail" class="auth-input" placeholder="you@example.com" autocomplete="email" required>
        </div>
      </div>
      <div class="auth-field">
        <label class="auth-label" for="signupPassword">Password</label>
        <div class="auth-input-wrap">
          <i class="bi bi-lock auth-input-ico"></i>
          <input type="password" id="signupPassword" class="auth-input" placeholder="Create a strong password" autocomplete="new-password" minlength="6" required>
          <button type="button" class="auth-input-toggle" onclick="togglePassword('signupPassword', this)" aria-label="Show password">
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </div>
      <div class="auth-field">
        <label class="auth-label" for="signupConfirm">Confirm password</label>
        <div class="auth-input-wrap">
          <i class="bi bi-shield-lock auth-input-ico"></i>
          <input type="password" id="signupConfirm" class="auth-input" placeholder="Re-enter your password" autocomplete="new-password" minlength="6" required>
        </div>
      </div>
      <label class="auth-check" style="font-size:10px;color:rgba(255,255,255,.55)">
        <input type="checkbox" id="signupTerms" required>
        <span class="auth-check-box"><i class="bi bi-check-lg"></i></span>
        <span>I agree to the <u>Terms</u> &amp; <u>Privacy Policy</u></span>
      </label>
      <button type="submit" class="pd-btn pd-btn--primary pd-btn--block auth-submit">
        <i class="bi bi-person-plus"></i> Create account
      </button>
    </form>
    <p class="auth-foot">Already have an account? <b onclick="openSignIn()">Sign in</b></p>
  </div>
</div>`;

  /* ═══════════════════════════════════════════════════════════════════
     5. INIT FUNCTION
     ═══════════════════════════════════════════════════════════════════ */
  function initStickyCTA(userConfig) {
    const config = Object.assign(
      {
        autoShowOnScroll: true,
        showWelcomeAlert: true,
        defaultLang: "en",
      },
      userConfig || {},
    );

    if (document.getElementById(ROOT_ID)) return window.__stickyCtaApi;

    /* ── 5.1 Inject styles ── */
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    /* ── 5.2 Inject DOM ── */
    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML = ROOT_HTML;
    document.body.appendChild(root);

    /* ── 5.3 Render all views ── */
    const mount = document.getElementById("stickyCtaViews");
    mount.innerHTML =
      T.hub() +
      T.quickLookShell() +
      T.gallery() +
      T.favorites() +
      T.search() +
      T.notfications() +
      T.orders() +
      T.cart() +
      T.profile() +
      T.signin() +
      T.signup();

    /* ── 5.4 Shared state ── */
    const state = {
      favorites: new Set(["PROD_001", "PROD_004"]),
      lang: config.defaultLang,
      notifications: [],
      notificationSeq: 1,
    };
    window.__stickyState = state;

    /* ── 5.5 Sound stub ── */
    window.ShopEaseSounds = window.ShopEaseSounds || { play() {} };

    /* ── 5.6 Sticky controller ── */
    (function stickyController() {
      const sticky = document.getElementById("stickyCta");
      const overlay = document.getElementById("sticky-cta-overlay");
      const panel = document.getElementById("stickyCtaPanel");
      const toggle = document.getElementById("stickyToggleBtn");
      const icon = document.getElementById("stickyToggleIcon");
      const backBtn = document.getElementById("stickyBackBtn");
      const alertZone = document.getElementById("cta-alert-zone");
      const primaryCta = document.getElementById("stickyPrimaryCta");

      if (!sticky || !toggle || !panel) return;

      const views = Array.from(panel.querySelectorAll(".sticky-view"));

      let isExpanded = false;
      let isVisible = false;
      let current = "hub";
      let resizeTimer = null;

      /* Collapsed pill height in px (matches CSS clip-path offset) */
      const COLLAPSED_H = 60;

      /* Visible expanded card height — mirrors the CSS height on .sticky-cta */
      function expandedHeight() {
        return Math.min(window.innerHeight * 0.82, 720);
      }

      /* Bottom offset base — mirrors the CSS bottom value */
      function baseBottom() {
        return window.matchMedia("(max-width:480px)").matches ? 14 : 20;
      }

      /* ──────────────────────────────────────────────────────────────
   Alerts always sit just ABOVE the bottom bar (Sign in + Close).
   Same position whether the CTA is expanded or collapsed.
   ────────────────────────────────────────────────────────────── */
      function positionAlertZone() {
        if (!alertZone) return;

        const base = baseBottom(); // 20px desktop / 14px mobile
        const BAR_H = 60; // .sticky-cta-bar height
        const GAP = 10;
        const vh = window.innerHeight;

        // Always pinned above the Sign-in / Close bar. When the CTA is hidden
        // we fall back to the same resting position (just above the collapsed pill).
        const bottomPx = isVisible ? base + BAR_H + GAP : base + GAP;

        // Never let toasts drift above the top ~120px of the viewport
        const clampedBottom = Math.min(bottomPx, vh - 120);

        alertZone.style.bottom =
          "calc(" + clampedBottom + "px + env(safe-area-inset-bottom, 0px))";
        alertZone.style.width = "min(560px, calc(100vw - 32px))";
      }

      function setExpanded(v, nameHint) {
        const name = nameHint || current;
        if (v === isExpanded && name === current) return;
        isExpanded = v;
        sticky.classList.toggle("is-expanded", isExpanded);
        toggle.setAttribute("aria-expanded", String(isExpanded));
        if (icon)
          icon.className = isExpanded
            ? "bi bi-x-lg"
            : "bi bi-grid-3x3-gap-fill";
        document.body.classList.toggle("sticky-cta-open", isExpanded);

        if (overlay) {
          overlay.classList.toggle("is-visible", isExpanded);
          overlay.setAttribute("aria-hidden", String(!isExpanded));
        }
        requestAnimationFrame(positionAlertZone);
      }

      function showDock() {
        if (isVisible) return;
        isVisible = true;
        sticky.classList.add("is-visible");
        sticky.setAttribute("aria-hidden", "false");
        requestAnimationFrame(positionAlertZone);
      }

      function hideDock() {
        if (!isVisible) return;
        isVisible = false;
        sticky.classList.remove("is-visible");
        sticky.setAttribute("aria-hidden", "true");
        if (isExpanded) setExpanded(false);
        requestAnimationFrame(positionAlertZone);
      }

      function goTo(name, direction) {
        direction = direction || "right";
        if (name === current) {
          setExpanded(true);
          return;
        }
        const from = views.find((v) => v.dataset.view === current);
        const to = views.find((v) => v.dataset.view === name);
        if (!to) return;

        sticky.dataset.current = name;

        if (from) {
          from.classList.remove("is-active");
          from.classList.add(
            direction === "right" ? "is-exiting-left" : "is-exiting-right",
          );
          setTimeout(
            () => from.classList.remove("is-exiting-left", "is-exiting-right"),
            300,
          );
        }
        to.classList.remove("is-exiting-left", "is-exiting-right");
        void to.offsetWidth;
        to.classList.add("is-active");

        current = name;
        setExpanded(true, name);
        requestAnimationFrame(positionAlertZone);
      }

      /* ── Alerts / notifications ── */
      function pushNotification(type, message) {
        const cfg = ALERT_TYPES[type] || ALERT_TYPES.info;
        const entry = {
          id: state.notificationSeq++,
          type,
          icon: cfg.icon,
          tone: cfg.tone,
          label: cfg.label,
          view: cfg.view,
          message,
          time: "Just now",
          read: false,
        };
        state.notifications.unshift(entry);
        renderNotificationList();
        updateAlertBadge();
        return entry;
      }

      function renderToast(entry) {
        if (!alertZone) return;
        const existing = alertZone.querySelectorAll(".cta-toast");
        if (existing.length >= 3) existing[0].remove();

        const toast = document.createElement("div");
        toast.className = "cta-toast";
        toast.style.setProperty("--tone", entry.tone);
        toast.innerHTML =
          '<span class="cta-toast-ico"><i class="bi ' +
          entry.icon +
          '"></i></span>' +
          '<div class="cta-toast-body">' +
          '<div class="cta-toast-head">' +
          '<span class="cta-toast-label">' +
          entry.label +
          "</span>" +
          '<span class="cta-toast-time">now</span>' +
          "</div>" +
          '<p class="cta-toast-msg">' +
          entry.message +
          "</p>" +
          "</div>" +
          (entry.view
            ? '<span class="cta-toast-go"><i class="bi bi-arrow-right"></i></span>'
            : "") +
          '<span class="cta-toast-progress"></span>';

        if (entry.view) {
          toast.classList.add("is-actionable");
          toast.addEventListener("click", () => {
            window.openStickyView(entry.view);
            dismissToast(toast);
          });
        }
        alertZone.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("is-in"));
        setTimeout(() => dismissToast(toast), entry.view ? 5200 : 4000);
      }

      function dismissToast(toast) {
        if (!toast || !toast.parentNode) return;
        toast.classList.remove("is-in");
        toast.classList.add("is-out");
        setTimeout(() => toast.remove(), 300);
      }

      function updateAlertBadge() {
        const unread = state.notifications.filter((n) => !n.read).length;
        const badge = document.querySelector('[data-badge="notfications"]');
        if (badge) {
          badge.textContent = unread;
          badge.classList.toggle("is-hidden", unread === 0);
        }
        const pill = document.getElementById("notification-badge-counter");
        if (pill) {
          pill.textContent = unread + " Unread";
          pill.classList.toggle("is-accent", unread > 0);
        }
      }

      function renderNotificationList() {
        const list = document.getElementById("notification-scroll-container");
        if (!list) return;
        if (!state.notifications.length) {
          list.innerHTML =
            '<div class="notif-empty"><i class="bi bi-bell-slash"></i><span>No notifications yet</span></div>';
          return;
        }
        list.innerHTML = state.notifications
          .map(
            (n) =>
              '<button type="button" class="notif-card' +
              (n.read ? "" : " is-unread") +
              '" ' +
              'style="--tone:' +
              n.tone +
              '" ' +
              'onclick="handleNotificationClick(' +
              n.id +
              ')">' +
              '<span class="notif-ico"><i class="bi ' +
              n.icon +
              '"></i></span>' +
              '<span class="notif-body">' +
              '<span class="notif-top">' +
              '<span class="notif-label">' +
              n.label +
              "</span>" +
              (n.read ? "" : '<span class="notif-dot"></span>') +
              '<span class="notif-time">' +
              n.time +
              "</span>" +
              "</span>" +
              '<span class="notif-msg">' +
              n.message +
              "</span>" +
              "</span>" +
              (n.view ? '<i class="bi bi-chevron-right notif-chev"></i>' : "") +
              "</button>",
          )
          .join("");
      }

      /* ── Public API ── */
      window.showAlert = function (type, message) {
        const entry = pushNotification(type, message);
        renderToast(entry);
        return entry;
      };

      window.handleNotificationClick = function (id) {
        const entry = state.notifications.find((n) => n.id === id);
        if (!entry) return;
        entry.read = true;
        renderNotificationList();
        updateAlertBadge();
        if (entry.view) window.openStickyView(entry.view);
      };

      window.markAllNotificationsAsRead = function () {
        state.notifications.forEach((n) => (n.read = true));
        renderNotificationList();
        updateAlertBadge();
      };

      window.clearAllNotifications = function () {
        state.notifications = [];
        renderNotificationList();
        updateAlertBadge();
      };

      /* ── Wire tiles ── */
      panel.querySelectorAll(".cta-tile").forEach((tile) => {
        tile.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (tile.hasAttribute("data-lang-toggle")) {
            window.toggleLanguage();
            return;
          }
          const target = tile.dataset.target;
          if (!target) return;
          goTo(target, "right");
        });
      });

      backBtn &&
        backBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (current !== "hub") goTo("hub", "left");
          else setExpanded(false);
        });

      primaryCta &&
        primaryCta.addEventListener("click", (e) => {
          e.preventDefault();
          window.openStickyView("signin");
        });

      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isExpanded) {
          setExpanded(false);
          setTimeout(() => {
            if (current !== "hub") goTo("hub", "left");
          }, 240);
        } else {
          showDock();
          setExpanded(true);
        }
      });

      overlay &&
        overlay.addEventListener("click", () => {
          setExpanded(false);
          setTimeout(() => {
            if (current !== "hub") goTo("hub", "left");
          }, 240);
        });

      document.addEventListener("click", (e) => {
        if (!isExpanded) return;
        if (sticky.contains(e.target)) return;
        if (alertZone && alertZone.contains(e.target)) return;
        setExpanded(false);
        setTimeout(() => {
          if (current !== "hub") goTo("hub", "left");
        }, 240);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (current !== "hub") goTo("hub", "left");
        else if (isExpanded) setExpanded(false);
        else hideDock();
      });

      /* ── Scroll reveal ── */
      const TOP_ZONE = 24;
      const THRESHOLD = 2;
      let lastY = window.scrollY;
      let ticking = false;

      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = Math.max(0, window.scrollY);
          const diff = y - lastY;
          if (y <= TOP_ZONE) hideDock();
          else if (diff > THRESHOLD) showDock();
          else if (diff < -THRESHOLD && !isExpanded) hideDock();
          lastY = y;
          ticking = false;
        });
      }
      if (config.autoShowOnScroll) {
        window.addEventListener("scroll", onScroll, { passive: true });
      }

      window.addEventListener("resize", () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          positionAlertZone();
          resizeTimer = null;
        }, 120);
      });

      /* ── Public view API ── */
      window.openStickyView = function (name) {
        showDock();
        goTo(name, "right");
      };
      window.closeStickyCta = () => setExpanded(false);
      window.hideStickyCta = hideDock;
      window.showStickyCta = showDock;
      window.closeAllViews = () => goTo("hub", "left");

      window.openCart = (e) => {
        e && e.preventDefault();
        window.openStickyView("cart");
      };
      window.openOrders = (e) => {
        e && e.preventDefault();
        window.openStickyView("orders");
      };
      window.openSearch = (e) => {
        e && e.preventDefault();
        window.openStickyView("search");
      };
      window.openNotifications = (e) => {
        e && e.preventDefault();
        window.openStickyView("notfications");
      };
      window.openProfile = (e) => {
        e && e.preventDefault();
        window.openStickyView("profile");
      };
      window.openGallery = (e) => {
        e && e.preventDefault();
        window.openStickyView("gallery");
      };
      window.openFavorites = (e) => {
        e && e.preventDefault();
        window.openStickyView("favorites");
      };

      window.applyHubPromo = function (code) {
        window.openStickyView("cart");
        setTimeout(() => {
          const area = document.getElementById("promoArea");
          if (area && !area.classList.contains("is-open"))
            area.classList.add("is-open");
          const status = document.getElementById("promo-status-text");
          if (status) status.textContent = "Close";
          const input = document.getElementById("promo-input");
          if (input) input.value = code;
          if (typeof window.applyPromoCode === "function")
            window.applyPromoCode();
        }, 300);
      };

      /* ── Boot ── */
      renderNotificationList();
      updateAlertBadge();
      positionAlertZone();

      if (config.showWelcomeAlert) {
        setTimeout(
          () =>
            window.showAlert(
              "reminder",
              "🔥 Summer Sale is live — up to 40% off.",
            ),
          1400,
        );
      }

      window.__stickyCtrl = { setExpanded, getCurrent: () => current };
    })();

    /* ══════════════════════════════════════════════════════════════════
       5.7 Quick Look
       ══════════════════════════════════════════════════════════════════ */
    let CURRENT_PRODUCT = null;
    let CURRENT_REVIEW_RATING = 0;

    function bindQuickLook(product) {
      const container = document.getElementById("ql-image-container");
      const counter = document.getElementById("image-counter");
      const progress = document.getElementById("image-progress-bar");
      if (!container || !counter || !progress) return;

      const total = container.children.length;
      counter.textContent = "1/" + total;
      progress.style.width = "0%";

      container.addEventListener(
        "scroll",
        function () {
          const maxScroll = this.scrollWidth - this.clientWidth;
          const percent =
            maxScroll > 0 ? (this.scrollLeft / maxScroll) * 100 : 0;
          progress.style.width = percent + "%";
          const idx =
            total > 1
              ? Math.round((this.scrollLeft / maxScroll) * (total - 1)) + 1
              : 1;
          counter.textContent = Math.min(idx, total) + "/" + total;
        },
        { passive: true },
      );

      const starWrap = document.getElementById("star-rating-input");
      if (starWrap) {
        const stars = Array.from(starWrap.querySelectorAll(".bi-star-fill"));
        const label = document.getElementById("rating-text");
        const paint = (n) =>
          stars.forEach((s, i) => s.classList.toggle("is-on", i < n));
        const labelFor = (n) =>
          ["Select rating", "Terrible", "Bad", "Average", "Good", "Excellent"][
            n
          ] || "Select rating";

        stars.forEach((s, i) => {
          const val = i + 1;
          s.addEventListener("mouseenter", () => paint(val));
          s.addEventListener("mouseleave", () => paint(CURRENT_REVIEW_RATING));
          s.addEventListener("click", () => {
            CURRENT_REVIEW_RATING = val;
            paint(val);
            if (label) label.textContent = labelFor(val);
          });
        });
        paint(0);
        if (label) label.textContent = labelFor(0);
      }

      const ta = document.getElementById("form-review-text");
      const cc = document.getElementById("char-count");
      if (ta && cc) {
        ta.value = "";
        cc.textContent = "0";
        ta.addEventListener("input", () => {
          cc.textContent = ta.value.length;
        });
      }

      const form = document.getElementById("review-form-panel");
      if (form) form.classList.remove("is-open");
    }

    window.openQuickLook = function (productId) {
      const product = PRODUCTS[productId] || PRODUCTS.PROD_001;
      CURRENT_PRODUCT = product;
      CURRENT_REVIEW_RATING = 0;

      const mountQL = document.getElementById("quickLookMount");
      if (!mountQL) return;
      mountQL.innerHTML = T.quickLookBody(product);

      const stockPill = document.getElementById("qlStockPill");
      if (stockPill) {
        stockPill.innerHTML =
          '<span class="mv-dot"></span>' +
          (product.stock === "low" ? "Low stock" : "In stock");
      }

      bindQuickLook(product);
      window.switchPDTab("overview");
      window.openStickyView("quick-look");
      window.showAlert("product", "👟 Quick look · " + product.title);
    };

    window.switchPDTab = function (tabId) {
      document
        .querySelectorAll(".pd-pane")
        .forEach((p) => p.classList.remove("is-active"));
      const target = document.getElementById("pane-" + tabId);
      if (target) target.classList.add("is-active");
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("is-active"));
      const active = document.getElementById("tab-" + tabId);
      if (active) active.classList.add("is-active");
    };

    window.toggleReviewForm = function () {
      const panel = document.getElementById("review-form-panel");
      if (panel) panel.classList.toggle("is-open");
    };

    window.submitUserReview = function () {
      const ta = document.getElementById("form-review-text");
      const text = ta ? ta.value.trim() : "";
      if (!text) {
        window.showAlert("error", "Please write your review before posting.");
        return;
      }
      if (!CURRENT_REVIEW_RATING) {
        window.showAlert("error", "Please select a star rating.");
        return;
      }
      if (!CURRENT_PRODUCT) return;

      CURRENT_PRODUCT.reviews.unshift({
        author: "John Doe",
        initials: "JD",
        verified: true,
        date: "Just now",
        rating: CURRENT_REVIEW_RATING,
        size: "M",
        color: "Blue",
        text,
        helpful: 0,
        replies: 0,
      });

      const mountQL = document.getElementById("quickLookMount");
      if (mountQL) {
        mountQL.innerHTML = T.quickLookBody(CURRENT_PRODUCT);
        bindQuickLook(CURRENT_PRODUCT);
        window.switchPDTab("reviews");
      }
      window.showAlert("success", "✅ Your review has been posted.");
    };

    window.toggleReviewExpand = function (btn) {
      const card = btn.closest(".pd-review-card");
      if (!card) return;
      const wrap = card.querySelector(".pd-review-text-wrap");
      const isClamped = wrap.classList.contains("is-clamped");
      document
        .querySelectorAll(".pd-review-text-wrap.is-clamped")
        .forEach((w) => {
          if (w !== wrap) {
            w.classList.add("is-clamped");
            const b = w.parentElement.querySelector(".pd-review-more");
            if (b) b.textContent = "Read more";
          }
        });
      wrap.classList.toggle("is-clamped", !isClamped);
      btn.textContent = isClamped ? "Show less" : "Read more";
    };

    window.askOwnerOnWhatsApp = function (productId) {
      const p = PRODUCTS[productId];
      window.showAlert(
        "shipping",
        '💬 Opening WhatsApp chat about "' + (p ? p.title : "this item") + '"…',
      );
    };
    window.handleProductQuickBuy = function (productId) {
      const p = PRODUCTS[productId];
      window.showAlert("product", "⚡ Quick Buy · " + (p ? p.title : "item"));
    };
    window.handleProductAddToBag = function (productId) {
      const p = PRODUCTS[productId];
      ShopEaseSounds.play("cart-add");
      window.showAlert(
        "cart",
        "🛒 " + (p ? p.title : "Item") + " added to your bag.",
      );
    };

    /* ══════════════════════════════════════════════════════════════════
       5.8 Gallery + Favorites
       ══════════════════════════════════════════════════════════════════ */
    window.toggleFavorite = function (productId, silent) {
      const isFav = state.favorites.has(productId);
      if (isFav) state.favorites.delete(productId);
      else state.favorites.add(productId);

      // Update any visible heart toggles
      document
        .querySelectorAll('[data-fav-toggle="' + productId + '"]')
        .forEach((el) => {
          el.classList.toggle("is-on", !isFav);
        });
      updateFavBadge();
      renderFavorites();

      if (!silent) {
        const p = PRODUCTS[productId];
        window.showAlert(
          "favorite",
          (isFav ? "Removed from" : "Added to") +
            " favorites · " +
            (p ? p.title : ""),
        );
      }
    };

    function updateFavBadge() {
      const badge = document.querySelector('[data-badge="favorites"]');
      if (badge) {
        const count = state.favorites.size;
        badge.textContent = count;
        badge.classList.toggle("is-hidden", count === 0);
      }
      const pill = document.getElementById("favCountPill");
      if (pill) pill.textContent = state.favorites.size + " items";
    }

    function renderFavorites() {
      const grid = document.getElementById("favoritesGrid");
      if (!grid) return;
      const items = Array.from(state.favorites)
        .map((id) => PRODUCTS[id])
        .filter(Boolean);
      if (!items.length) {
        grid.innerHTML =
          '<div class="search-empty" style="grid-column:1/-1"><div class="search-empty-ico"><i class="bi bi-heart"></i></div><p>No favorites yet</p><small>Tap the heart on any product</small></div>';
        return;
      }
      grid.innerHTML = items
        .map(
          (p) => `
        <button type="button" class="gallery-card" data-product="${p.id}">
          <div class="gallery-thumb">
            <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
            <span class="gallery-fav is-on" data-fav-toggle="${p.id}" aria-label="Remove favorite">
              <i class="bi bi-heart-fill"></i>
            </span>
          </div>
          <div class="gallery-meta">
            <span class="gallery-brand">${p.brand}</span>
            <p class="gallery-title">${p.title}</p>
            <span class="gallery-price">EGP ${p.price.toLocaleString()}</span>
          </div>
        </button>`,
        )
        .join("");
    }

    /* Delegate card + heart taps inside gallery + favorites */
    mount.addEventListener("click", (e) => {
      const favBtn = e.target.closest("[data-fav-toggle]");
      if (favBtn) {
        e.stopPropagation();
        e.preventDefault();
        window.toggleFavorite(favBtn.dataset.favToggle);
        return;
      }
      const card = e.target.closest(".gallery-card[data-product]");
      if (card) {
        e.preventDefault();
        window.openQuickLook(card.dataset.product);
      }
    });

    /* Paint initial state */
    updateFavBadge();
    renderFavorites();
    document.querySelectorAll("[data-fav-toggle]").forEach((el) => {
      el.classList.toggle("is-on", state.favorites.has(el.dataset.favToggle));
    });

    /* ══════════════════════════════════════════════════════════════════
       5.9 Filter dropdowns
       ══════════════════════════════════════════════════════════════════ */
    document.addEventListener("click", function (e) {
      const filter = e.target.closest(".filter");
      if (!filter) {
        document
          .querySelectorAll(".filter-dropdown.open")
          .forEach((d) => d.classList.remove("open"));
        document
          .querySelectorAll(".filter-trigger")
          .forEach((t) => t.setAttribute("aria-expanded", "false"));
        return;
      }
      const dropdown = filter.querySelector(".filter-dropdown");
      const trigger = filter.querySelector(".filter-trigger");
      if (!dropdown || !trigger) return;

      e.stopPropagation();
      const willOpen = !dropdown.classList.contains("open");
      document.querySelectorAll(".filter-dropdown.open").forEach((d) => {
        if (d !== dropdown) d.classList.remove("open");
      });
      document.querySelectorAll(".filter-trigger").forEach((t) => {
        if (t !== trigger) t.setAttribute("aria-expanded", "false");
      });
      dropdown.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", function (e) {
      const option = e.target.closest(".filter-option");
      if (!option) return;
      const parentFilter = option.closest(".filter");
      if (!parentFilter) return;
      const trigger = parentFilter.querySelector(".filter-trigger");
      const selectedSpan = trigger && trigger.querySelector(".filter-selected");
      const value = option.dataset.value || option.textContent.trim();
      if (selectedSpan) selectedSpan.textContent = value;
      parentFilter
        .querySelectorAll(".filter-option")
        .forEach((o) => o.classList.remove("is-selected"));
      option.classList.add("is-selected");
      const dropdown = parentFilter.querySelector(".filter-dropdown");
      if (dropdown) dropdown.classList.remove("open");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });

    /* ══════════════════════════════════════════════════════════════════
       5.10 Search
       ══════════════════════════════════════════════════════════════════ */
    (function searchModule() {
      class SearchEngine {
        constructor(opts) {
          this.input = document.querySelector(opts.inputSelector);
          this.container = document.querySelector(opts.containerSelector);
          this.delay = opts.debounceDelay || 180;
          this.mode = opts.initialMode || "products";
          this.query = "";
          this.results = [];
          this.isFocused = false;
          this.timer = null;
          this.bindEvents();
          this.renderPopular();
        }
        bindEvents() {
          if (!this.input) return;
          this.input.addEventListener("focus", () => {
            this.isFocused = true;
            this.renderSuggestions();
          });
          this.input.addEventListener("blur", () =>
            setTimeout(() => {
              this.isFocused = false;
              if (!this.query) this.renderPopular();
            }, 180),
          );
          this.input.addEventListener("input", (e) => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.query = e.target.value.trim();
              this.renderSuggestions();
            }, this.delay);
          });
          this.input.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              this.input.blur();
              this.query = "";
              this.input.value = "";
              this.renderPopular();
            }
          });
        }
        setMode(mode) {
          this.mode = mode;
          this.query = "";
          if (this.input) {
            this.input.value = "";
            this.input.placeholder =
              {
                products: "Search products...",
                categories: "Search categories...",
                stores: "Search stores...",
                orders: "Search orders...",
              }[mode] || "Search...";
          }
          this.renderPopular();
        }
        search(q, mode) {
          mode = mode || this.mode;
          const data = SEARCH_DATA[mode] || [];
          const needle = q.toLowerCase().trim();
          if (!needle) return [];
          return data.filter((item) =>
            Object.values(item)
              .filter((v) => typeof v === "string" || typeof v === "number")
              .map(String)
              .map((s) => s.toLowerCase())
              .join(" ")
              .includes(needle),
          );
        }
        renderSuggestions() {
          const q = this.query;
          if (!q) return this.renderPopular();
          const results = this.search(q);
          this.results = results;
          if (!results.length) return this.renderEmpty(q);

          const labels = {
            products: "Products",
            categories: "Categories",
            stores: "Stores",
            orders: "Orders",
          };
          let rowsHTML = "";
          if (this.mode === "products") {
            rowsHTML = results
              .map(
                (p) =>
                  '<div class="search-row" onclick="openQuickLook(\'' +
                  p.id +
                  "')\">" +
                  '<div class="search-row-thumb"><img src="' +
                  p.image +
                  '" alt=""></div>' +
                  '<div class="search-row-body">' +
                  '<p class="search-row-title">' +
                  p.name +
                  "</p>" +
                  '<div class="search-row-meta"><span>' +
                  p.brand +
                  '</span><span class="search-dot"></span><span>' +
                  p.category +
                  "</span></div>" +
                  '<p class="search-row-price">' +
                  p.price +
                  "</p>" +
                  "</div></div>",
              )
              .join("");
          } else if (this.mode === "categories") {
            rowsHTML = results
              .map(
                (c) =>
                  "<div class=\"search-row\" onclick=\"showAlert('search','Category: " +
                  c.name +
                  "')\">" +
                  '<div class="search-row-icon"><i class="bi ' +
                  c.icon +
                  '"></i></div>' +
                  '<div class="search-row-body">' +
                  '<p class="search-row-title">' +
                  c.name +
                  "</p>" +
                  '<div class="search-row-meta"><span>' +
                  c.count +
                  " items</span></div>" +
                  '</div><i class="bi bi-chevron-right search-row-chev"></i></div>',
              )
              .join("");
          } else if (this.mode === "stores") {
            rowsHTML = results
              .map(
                (s) =>
                  "<div class=\"search-row\" onclick=\"showAlert('search','Store: " +
                  s.name +
                  "')\">" +
                  '<div class="search-row-icon"><i class="bi bi-shop"></i></div>' +
                  '<div class="search-row-body">' +
                  '<p class="search-row-title">' +
                  s.name +
                  "</p>" +
                  '<div class="search-row-meta"><span>' +
                  s.location +
                  '</span><span class="search-dot"></span><span>★ ' +
                  s.rating +
                  "</span></div>" +
                  '</div><i class="bi bi-chevron-right search-row-chev"></i></div>',
              )
              .join("");
          } else {
            rowsHTML = results
              .map(
                (o) =>
                  '<div class="search-row" onclick="window.openStickyView(\'orders\')">' +
                  '<div class="search-row-body">' +
                  '<div class="search-row-meta"><span>' +
                  o.status +
                  '</span><span class="search-dot"></span><span>#' +
                  o.id +
                  "</span></div>" +
                  '<p class="search-row-title">' +
                  o.total +
                  "</p>" +
                  '<div class="search-row-meta"><span>' +
                  o.date +
                  "</span></div>" +
                  '</div><i class="bi bi-chevron-right search-row-chev"></i></div>',
              )
              .join("");
          }

          this.container.innerHTML =
            '<div class="search-block">' +
            '<div class="search-block-head">' +
            "<span>" +
            (labels[this.mode] || "Results") +
            "</span>" +
            '<span class="search-count">' +
            results.length +
            " found</span>" +
            "</div>" +
            '<div class="search-rows">' +
            rowsHTML +
            "</div></div>";
        }
        renderPopular() {
          const mode = this.mode;
          let html = "";
          if (mode === "products") {
            html =
              '<div class="search-block">' +
              '<div class="search-block-head"><span>Popular brands</span></div>' +
              '<div class="search-grid">' +
              POPULAR.brands
                .map(
                  (b) =>
                    '<button class="search-tile" onclick="searchEngine.setQuery(\'' +
                    b +
                    "')\">" +
                    "<span>" +
                    b +
                    '</span><i class="bi bi-arrow-right"></i></button>',
                )
                .join("") +
              "</div></div>" +
              '<div class="search-block">' +
              '<div class="search-block-head"><span>Popular categories</span></div>' +
              '<div class="search-grid">' +
              POPULAR.categories
                .map(
                  (c) =>
                    '<button class="search-tile" onclick="searchEngine.setQuery(\'' +
                    c +
                    "')\">" +
                    "<span>" +
                    c +
                    '</span><i class="bi bi-arrow-right"></i></button>',
                )
                .join("") +
              "</div></div>";
          } else if (mode === "categories") {
            html =
              '<div class="search-block">' +
              '<div class="search-block-head"><span>All categories</span></div>' +
              '<div class="search-grid">' +
              SEARCH_DATA.categories
                .map(
                  (c) =>
                    '<button class="search-tile" onclick="searchEngine.setQuery(\'' +
                    c.name +
                    "')\">" +
                    "<span>" +
                    c.name +
                    '</span><span class="search-tile-count">' +
                    c.count +
                    "</span></button>",
                )
                .join("") +
              "</div></div>";
          } else if (mode === "stores") {
            html =
              '<div class="search-block">' +
              '<div class="search-block-head"><span>Stores</span></div>' +
              '<div class="search-rows">' +
              SEARCH_DATA.stores
                .map(
                  (s) =>
                    "<div class=\"search-row\" onclick=\"showAlert('search','Store: " +
                    s.name +
                    "')\">" +
                    '<div class="search-row-icon"><i class="bi bi-shop"></i></div>' +
                    '<div class="search-row-body">' +
                    '<p class="search-row-title">' +
                    s.name +
                    "</p>" +
                    '<div class="search-row-meta"><span>' +
                    s.location +
                    '</span><span class="search-dot"></span><span>★ ' +
                    s.rating +
                    "</span></div>" +
                    '</div><i class="bi bi-chevron-right search-row-chev"></i></div>',
                )
                .join("") +
              "</div></div>";
          } else {
            html =
              '<div class="search-block">' +
              '<div class="search-block-head"><span>Recent orders</span></div>' +
              '<div class="search-rows">' +
              SEARCH_DATA.orders
                .map(
                  (o) =>
                    '<div class="search-row" onclick="window.openStickyView(\'orders\')">' +
                    '<div class="search-row-body">' +
                    '<div class="search-row-meta"><span>' +
                    o.status +
                    '</span><span class="search-dot"></span><span>#' +
                    o.id +
                    "</span></div>" +
                    '<p class="search-row-title">' +
                    o.total +
                    "</p>" +
                    '<div class="search-row-meta"><span>' +
                    o.date +
                    "</span></div>" +
                    '</div><i class="bi bi-chevron-right search-row-chev"></i></div>',
                )
                .join("") +
              "</div></div>";
          }
          this.container.innerHTML = html;
        }
        renderEmpty(q) {
          const label = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
          this.container.innerHTML =
            '<div class="search-empty">' +
            '<div class="search-empty-ico"><i class="bi bi-search"></i></div>' +
            "<p>No " +
            label.toLowerCase() +
            " found</p>" +
            '<small>Try adjusting your search for "' +
            q +
            '"</small></div>';
        }
        setQuery(q) {
          if (!this.input) return;
          this.input.value = q;
          this.query = q;
          this.renderSuggestions();
          this.input.focus();
        }
      }

      const searchEngine = new SearchEngine({
        inputSelector: "#search-input",
        containerSelector: "#search-suggestions-area",
        debounceDelay: 180,
        initialMode: "products",
      });
      window.searchEngine = searchEngine;

      window.switchSearchMode = function (mode) {
        document
          .querySelectorAll(".search-mode-btn")
          .forEach((b) => b.classList.remove("is-active"));
        const active = document.getElementById("mode-" + mode);
        if (active) active.classList.add("is-active");
        searchEngine.setMode(mode);
      };
    })();

    /* ══════════════════════════════════════════════════════════════════
       5.11 Cart
       ══════════════════════════════════════════════════════════════════ */
    (function cartModule() {
      const STORE_HAS_PICKUP = true;
      let cartSubtotal = 2580;
      let cartShipping = 50;
      let cartDiscount = 0;
      let currentShippingMethod = "home";
      let nextAddressId = 3;
      let selectedPaymentMethod = "card";

      window.selectShippingMethod = function (method) {
        if (method === "pickup" && !STORE_HAS_PICKUP) {
          window.showAlert(
            "shipping",
            "⚠️ Store pickup is not available for this store.",
          );
          return;
        }
        currentShippingMethod = method;
        document
          .getElementById("tab-shipping-home")
          .classList.toggle("is-active", method === "home");
        document
          .getElementById("tab-shipping-pickup")
          .classList.toggle("is-active", method === "pickup");
        document
          .getElementById("shipping-home-panel")
          .classList.toggle("is-hidden", method !== "home");
        document
          .getElementById("shipping-pickup-panel")
          .classList.toggle("is-hidden", method !== "pickup");
        cartShipping = method === "home" ? 50 : 0;
        window.updateCartTotal();
      };

      window.selectAddress = function (el) {
        document
          .querySelectorAll("#address-list .address-card")
          .forEach((c) => c.classList.remove("is-selected"));
        el.classList.add("is-selected");
        cartShipping = parseFloat(el.dataset.shippingCost) || 50;
        window.updateCartTotal();
      };

      window.toggleNewAddressForm = function () {
        document.getElementById("new-address-form").classList.toggle("is-open");
      };

      window.saveNewAddress = function () {
        const label =
          document.getElementById("new-addr-label").value.trim() || "Address";
        const street = document.getElementById("new-addr-street").value.trim();
        const city = document.getElementById("new-addr-city").value.trim();
        const phone = document.getElementById("new-addr-phone").value.trim();
        if (!street || !city) {
          window.showAlert("error", "Please fill in street and city.");
          return;
        }

        const id = nextAddressId++;
        const card = document.createElement("div");
        card.className = "address-card";
        card.dataset.addressId = id;
        card.dataset.shippingCost = "50";
        card.onclick = () => window.selectAddress(card);
        card.innerHTML =
          '<div class="address-icon"><i class="bi bi-geo-alt"></i></div>' +
          '<div class="address-body">' +
          '<div class="address-head">' +
          '<span class="address-label">' +
          label +
          "</span>" +
          '<span class="address-tag address-tag--blue">New</span>' +
          "</div>" +
          '<p class="address-line">' +
          street +
          ", " +
          city +
          "</p>" +
          (phone ? '<p class="address-phone">' + phone + "</p>" : "") +
          "</div>" +
          '<i class="bi bi-check-circle-fill address-check"></i>';

        document.getElementById("address-list").appendChild(card);
        [
          "new-addr-label",
          "new-addr-street",
          "new-addr-city",
          "new-addr-phone",
        ].forEach((id) => {
          document.getElementById(id).value = "";
        });
        window.toggleNewAddressForm();
        window.selectAddress(card);
        window.showAlert("success", "✅ New address saved and selected.");
      };

      window.synchronizeCartItemCount = function () {
        let total = 0;
        document.querySelectorAll(".cart-item-row").forEach((r) => {
          total += parseInt(r.getAttribute("data-quantity"), 10) || 0;
        });
        const badge = document.getElementById("cart-badge-counter");
        if (badge)
          badge.textContent = total + " Item" + (total === 1 ? "" : "s");
        const summary = document.getElementById("summary-item-count");
        if (summary)
          summary.textContent = total + " item" + (total === 1 ? "" : "s");
        const hubBadge = document.querySelector('[data-badge="cart"]');
        if (hubBadge) hubBadge.textContent = total;
      };

      window.removeCartItemRow = function (btn) {
        const row = btn.closest(".cart-item-row");
        if (row) row.remove();
        window.recalculateSubtotal();
        window.showAlert("cart", "Item removed from your cart.");
      };

      window.recalculateSubtotal = function () {
        let total = 0;
        document.querySelectorAll(".cart-item-row").forEach((r) => {
          const price = parseFloat(r.getAttribute("data-item-price")) || 0;
          const qty = parseInt(r.getAttribute("data-quantity"), 10) || 1;
          total += price * qty;
        });
        cartSubtotal = total;
        window.updateCartTotal();
        window.synchronizeCartItemCount();
      };

      window.togglePromoArea = function () {
        const area = document.getElementById("promoArea");
        area.classList.toggle("is-open");
        const status = document.getElementById("promo-status-text");
        status.textContent = area.classList.contains("is-open")
          ? "Close"
          : cartDiscount > 0
            ? "Applied"
            : "Add";
      };

      window.setPromoCode = function (code) {
        document.getElementById("promo-input").value = code;
        window.applyPromoCode();
      };

      window.applyPromoCode = function () {
        const code = document
          .getElementById("promo-input")
          .value.trim()
          .toUpperCase();
        const status = document.getElementById("promo-status-text");
        const promoRow = document.getElementById("cart-promo-row");
        const valid = {
          SAVE10: () => cartSubtotal * 0.1,
          FREESHIP: () => cartShipping,
          WELCOME15: () => cartSubtotal * 0.15,
        };
        if (valid[code]) {
          cartDiscount = valid[code]();
          status.textContent = "Applied";
          status.className = "cart-section-status is-success";
          promoRow.style.display = "flex";
          window.showAlert("success", '🎉 Promo code "' + code + '" applied.');
        } else {
          cartDiscount = 0;
          status.textContent = "Invalid";
          status.className = "cart-section-status is-error";
          promoRow.style.display = "none";
          window.showAlert("error", "That promo code is not valid.");
        }
        window.updateCartTotal();
      };

      window.updateCartTotal = function () {
        const total = Math.max(0, cartSubtotal + cartShipping - cartDiscount);
        const fmt = (n) => "EGP " + Math.round(n).toLocaleString();
        const set = (id, v) => {
          const el = document.getElementById(id);
          if (el) el.textContent = v;
        };
        set("cart-subtotal", fmt(cartSubtotal));
        set("cart-shipping", fmt(cartShipping));
        set("cart-promo", "-" + fmt(cartDiscount));
        set("checkout-total-price", fmt(total));
        set("final-subtotal", fmt(cartSubtotal));
        set("final-shipping", fmt(cartShipping));
        set("final-promo", "-" + fmt(cartDiscount));
        set("final-total", fmt(total));
        set("summary-total", fmt(total));

        const fPromoRow = document.getElementById("final-promo-row");
        if (fPromoRow)
          fPromoRow.style.display = cartDiscount > 0 ? "flex" : "none";

        const payBtn = document.getElementById("pay-submit-btn");
        if (payBtn)
          payBtn.innerHTML =
            '<i class="bi bi-lock-fill"></i> Pay & Submit • ' + fmt(total);
      };

      window.goToCheckoutStep2 = function () {
        if (
          currentShippingMethod === "home" &&
          !document.querySelector("#address-list .address-card.is-selected")
        ) {
          window.showAlert("shipping", "⚠️ Please select a delivery address.");
          return;
        }
        document.getElementById("cart-step-1").classList.add("is-hidden");
        document.getElementById("cart-step-2").classList.remove("is-hidden");
        document.getElementById("cart-head-title").textContent = "Payment";
        window.updateCartTotal();
      };

      window.goToCheckoutStep1 = function () {
        document.getElementById("cart-step-2").classList.add("is-hidden");
        document.getElementById("cart-step-1").classList.remove("is-hidden");
        document.getElementById("cart-head-title").textContent = "Your Cart";
      };

      window.selectPayment = function (el) {
        document
          .querySelectorAll(".payment-option")
          .forEach((p) => p.classList.remove("is-selected"));
        el.classList.add("is-selected");
        selectedPaymentMethod = el.dataset.payment;
      };

      window.submitOrder = function (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="cart-spinner"></span> Processing...';
        btn.disabled = true;
        setTimeout(() => {
          const methodLabel = {
            card: "Card",
            cod: "Cash on Delivery",
            wallet: "Digital Wallet",
          }[selectedPaymentMethod];
          const shipLabel =
            currentShippingMethod === "pickup"
              ? "Store Pickup"
              : "Home Delivery";
          window.showAlert(
            "order",
            "✅ Order placed via " + methodLabel + " · " + shipLabel,
          );
          window.goToCheckoutStep1();
          btn.innerHTML = original;
          btn.disabled = false;
          window.updateCartTotal();
        }, 1700);
      };

      /* Boot */
      const pickupDisabled = document.getElementById("pickup-disabled-message");
      const pickupContent = document.getElementById("pickup-enabled-content");
      const pickupTab = document.getElementById("tab-shipping-pickup");
      if (STORE_HAS_PICKUP) {
        pickupDisabled.classList.add("is-hidden");
        pickupContent.classList.remove("is-hidden");
      } else {
        pickupDisabled.classList.remove("is-hidden");
        pickupContent.classList.add("is-hidden");
        pickupTab.classList.add("is-disabled");
      }
      window.synchronizeCartItemCount();
      window.updateCartTotal();
    })();

    /* ══════════════════════════════════════════════════════════════════
       5.12 Orders
       ══════════════════════════════════════════════════════════════════ */
    (function ordersModule() {
      function buildTimeline(stage) {
        let html = '<div class="order-timeline">';
        ORDER_STAGES.forEach((label, i) => {
          const st =
            i < stage ? "is-done" : i === stage ? "is-current" : "is-todo";
          html +=
            '<div class="order-timeline-step ' +
            st +
            '">' +
            '<span class="order-timeline-dot"></span>' +
            '<span class="order-timeline-label">' +
            label +
            "</span>" +
            "</div>";
        });
        return html + "</div>";
      }

      function buildOrderCard(order) {
        const itemsHTML = order.items
          .map(
            (it) =>
              '<div class="order-item">' +
              '<div class="order-item-body">' +
              '<p class="order-item-name">' +
              it.name +
              "</p>" +
              '<p class="order-item-meta">' +
              it.meta +
              "</p>" +
              "</div>" +
              '<div class="order-item-right">' +
              '<span class="order-item-qty">×' +
              it.qty +
              "</span>" +
              '<span class="order-item-price">' +
              it.price +
              "</span>" +
              "</div></div>",
          )
          .join("");

        return (
          '<article class="order-card" data-order-id="' +
          order.id +
          '">' +
          '<button type="button" class="order-card-head" onclick="toggleOrderCard(this)" aria-expanded="false">' +
          '<div class="order-card-head-top">' +
          '<span class="order-status ' +
          order.statusClass +
          '">' +
          order.status +
          "</span>" +
          '<span class="order-id">#' +
          order.id +
          "</span>" +
          "</div>" +
          '<p class="order-card-title">' +
          order.title +
          "</p>" +
          '<div class="order-card-head-bottom">' +
          '<span class="order-date">' +
          order.date +
          "</span>" +
          '<span class="order-total">' +
          order.total +
          "</span>" +
          "</div>" +
          '<i class="bi bi-chevron-down order-chevron"></i>' +
          "</button>" +
          '<div class="order-details"><div class="order-details-inner">' +
          '<div class="order-panel">' +
          '<div class="order-panel-head">' +
          "<span>Live tracking</span>" +
          '<span class="order-stage-pill">' +
          order.stageLabel +
          "</span>" +
          "</div>" +
          buildTimeline(order.stage) +
          "</div>" +
          '<div class="order-panel">' +
          '<p class="order-panel-label">Items</p>' +
          '<div class="order-items">' +
          itemsHTML +
          "</div>" +
          "</div>" +
          '<div class="order-grid">' +
          '<div class="order-panel order-panel--mini"><p class="order-panel-label">Shipping to</p><p class="order-panel-value">' +
          order.destination +
          "</p></div>" +
          '<div class="order-panel order-panel--mini"><p class="order-panel-label">Courier</p><p class="order-panel-value">' +
          order.courier +
          "</p></div>" +
          '<div class="order-panel order-panel--mini"><p class="order-panel-label">Payment</p><p class="order-panel-value">' +
          order.payment +
          "</p></div>" +
          '<div class="order-panel order-panel--mini"><p class="order-panel-label">Total paid</p><p class="order-panel-value">' +
          order.total +
          "</p></div>" +
          "</div>" +
          '<div class="order-actions">' +
          '<button class="pd-btn pd-btn--ghost" onclick="event.stopPropagation(); showAlert(\'shipping\',\'Tracking details copied.\')"><i class="bi bi-geo-alt"></i> Track order</button>' +
          '<button class="pd-btn pd-btn--danger" onclick="event.stopPropagation(); cancelOrder(\'' +
          order.id +
          "')\">Cancel order</button>" +
          "</div></div></div></article>"
        );
      }

      const list = document.getElementById("ordersList");
      if (list) list.innerHTML = ORDERS.map(buildOrderCard).join("");

      window.toggleOrderCard = function (btn) {
        const card = btn.closest(".order-card");
        if (!card) return;
        const isOpen = card.classList.contains("is-open");
        document.querySelectorAll(".order-card.is-open").forEach((c) => {
          if (c !== card) {
            c.classList.remove("is-open");
            const h = c.querySelector(".order-card-head");
            if (h) h.setAttribute("aria-expanded", "false");
          }
        });
        card.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      };

      window.cancelOrder = function (id) {
        window.showAlert("order", "Order #" + id + " cancellation requested.");
      };
    })();

    /* ══════════════════════════════════════════════════════════════════
       5.13 Auth
       ══════════════════════════════════════════════════════════════════ */
    window.openSignIn = function () {
      window.openStickyView("signin");
    };
    window.openSignUp = function () {
      window.openStickyView("signup");
    };

    window.togglePassword = function (inputId, btn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      const ic = btn.querySelector("i");
      if (ic) ic.className = isPass ? "bi bi-eye-slash" : "bi bi-eye";
    };

    window.handleSignIn = function (e) {
      e.preventDefault();
      const email = document.getElementById("signinEmail").value.trim();
      const password = document.getElementById("signinPassword").value;
      const err = document.getElementById("signinError");
      const fail = (msg) => {
        err.textContent = msg;
        err.classList.add("is-visible");
        return false;
      };
      err.classList.remove("is-visible");
      if (!email || !password) return fail("Please fill in all fields.");
      if (!/^\S+@\S+\.\S+$/.test(email))
        return fail("Please enter a valid email address.");
      if (password.length < 6)
        return fail("Password must be at least 6 characters.");
      window.showAlert("success", "✅ Welcome back! Signing you in…");
      setTimeout(() => window.openStickyView("profile"), 800);
      return false;
    };

    window.handleSignUp = function (e) {
      e.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;
      const confirm = document.getElementById("signupConfirm").value;
      const terms = document.getElementById("signupTerms").checked;
      const err = document.getElementById("signupError");
      const fail = (msg) => {
        err.textContent = msg;
        err.classList.add("is-visible");
        return false;
      };
      err.classList.remove("is-visible");
      if (!name || !email || !password || !confirm)
        return fail("Please fill in all fields.");
      if (!/^\S+@\S+\.\S+$/.test(email))
        return fail("Please enter a valid email address.");
      if (password.length < 6)
        return fail("Password must be at least 6 characters.");
      if (password !== confirm) return fail("Passwords do not match.");
      if (!terms) return fail("Please accept the Terms & Privacy Policy.");
      window.showAlert("success", "🎉 Account created. Welcome to Peacock!");
      setTimeout(() => window.openStickyView("profile"), 800);
      return false;
    };

    window.signIn = () => window.openSignIn();
    window.signOut = () => {
      if (confirm("Sign out from your account?")) {
        window.showAlert("logout", "👋 Signed out successfully.");
        setTimeout(() => window.openStickyView("hub"), 700);
      }
    };
    window.FollowStore = () =>
      window.showAlert("favorite", "⭐ Following Peacock Store");
    window.copyStoreLink = () => {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText("https://matager.store/matager-store")
          .then(() => window.showAlert("success", "✅ Store link copied."))
          .catch(() =>
            window.showAlert(
              "info",
              "📋 Copy: https://matager.store/matager-store",
            ),
          );
      } else {
        window.showAlert(
          "info",
          "📋 Copy: https://matager.store/matager-store",
        );
      }
    };
    window.togglePresentationMode = () =>
      window.showAlert("info", "🎬 Presentation mode toggled (demo).");

    /* ══════════════════════════════════════════════════════════════════
       5.14 Language toggle (lightweight, only chrome strings)
       ══════════════════════════════════════════════════════════════════ */
    function applyLanguage(lang) {
      state.lang = lang;
      const dict = I18N[lang] || I18N.en;
      mount.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (dict[key] != null) el.textContent = dict[key];
      });
      const langLabel = document.getElementById("langLabel");
      if (langLabel) langLabel.textContent = lang === "ar" ? "AR" : "EN";
      document.documentElement.setAttribute(
        "lang",
        lang === "ar" ? "ar" : "en",
      );
    }
    window.applyLanguage = applyLanguage;
    window.toggleLanguage = function () {
      const next = state.lang === "ar" ? "en" : "ar";
      applyLanguage(next);
      window.showAlert(
        "info",
        next === "ar"
          ? "🌐 تم التبديل إلى العربية"
          : "🌐 Language switched to English",
      );
    };

    /* Boot language */
    applyLanguage(config.defaultLang);

    /* ══════════════════════════════════════════════════════════════════
       5.15 Pre-warm quick-look
       ══════════════════════════════════════════════════════════════════ */
    const qlMount = document.getElementById("quickLookMount");
    if (qlMount) {
      qlMount.innerHTML = T.quickLookBody(PRODUCTS.PROD_001);
      bindQuickLook(PRODUCTS.PROD_001);
      window.switchPDTab("overview");
    }

    /* ══════════════════════════════════════════════════════════════════
       5.16 Public API
       ══════════════════════════════════════════════════════════════════ */
    const api = {
      open: (name) => window.openStickyView(name),
      close: () => window.closeStickyCta(),
      show: () => window.showStickyCta(),
      hide: () => window.hideStickyCta(),
      alert: (type, msg) => window.showAlert(type, msg),
      setLanguage: applyLanguage,
      toggleLanguage: window.toggleLanguage,
      getState: () => state,
      destroy() {
        const r = document.getElementById(ROOT_ID);
        if (r) r.remove();
        const s = document.getElementById(STYLE_ID);
        if (s) s.remove();
        delete window.__stickyCtaApi;
      },
    };
    window.__stickyCtaApi = api;

    return api;
  }

  /* Expose initializer */
  window.initStickyCTA = initStickyCTA;

  /* Auto-init on DOM ready (safe if called twice) */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initStickyCTA(), {
      once: true,
    });
  } else {
    initStickyCTA();
  }
})();
