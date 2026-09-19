// // sounds types
// <button onclick="ShopEaseSounds.play('cart-add')">🛒 Add to Cart</button>
//             <button onclick="ShopEaseSounds.play('cart-remove')">↩ Remove from Cart</button>
//             <button onclick="ShopEaseSounds.play('checkout')">🛍 Checkout</button>
//             <button onclick="ShopEaseSounds.play('payment-success')">💳 Payment Success</button>
//             <button onclick="ShopEaseSounds.play('payment-failed')">💳 Payment Failed</button>
//             <button onclick="ShopEaseSounds.play('wishlist-add')">❤️ Add Wishlist</button>
//             <button onclick="ShopEaseSounds.play('wishlist-remove')">♡ Remove Wishlist</button>
//             <button onclick="ShopEaseSounds.play('new-order')">🔔 New Order</button>
//             <button onclick="ShopEaseSounds.play('order-confirmed')">✅ Order Confirmed</button>
//             <button onclick="ShopEaseSounds.play('order-cancelled')">🚫 Order Cancelled</button>
//             <button onclick="ShopEaseSounds.play('order-shipped')">📦 Order Shipped</button>
//             <button onclick="ShopEaseSounds.play('delivery')">🚚 Delivered</button>
//             <button onclick="ShopEaseSounds.play('notification')">🔔 Notification</button>
//             <button onclick="ShopEaseSounds.play('message')">💬 Message</button>
//             <button onclick="ShopEaseSounds.play('email')">✉️ Email</button>
//             <button onclick="ShopEaseSounds.play('alert')">⚠️ Alert</button>
//             <button onclick="ShopEaseSounds.play('success')">✅ Success</button>
//             <button onclick="ShopEaseSounds.play('error')">❌ Error</button>
//             <button onclick="ShopEaseSounds.play('warning')">⚠️ Warning</button>
//             <button onclick="ShopEaseSounds.play('click')">🖱 Click</button>
//             <button onclick="ShopEaseSounds.play('pop')">💥 Pop</button>
//             <button onclick="ShopEaseSounds.play('toggle-on')">🔘 Toggle On</button>
//             <button onclick="ShopEaseSounds.play('toggle-off')">⚪ Toggle Off</button>
//             <button onclick="ShopEaseSounds.play('delete')">🗑 Delete</button>
//             <button onclick="ShopEaseSounds.play('login-success')">🔓 Login Success</button>
//             <button onclick="ShopEaseSounds.play('login-error')">🔒 Login Error</button>
//             <button onclick="ShopEaseSounds.play('logout')">🚪 Logout</button>
//             <button onclick="ShopEaseSounds.play('success-long')">✨ Big Success</button>
//  <button onclick="ShopEaseSounds.play('error-long')">🚨 Big Error</button>

(function (global) {
  "use strict";

  let audioContext = null;
  let masterVolume = 0.7;
  let muted = false;

  function getAudioContext() {
    if (!audioContext) {
      const AudioContext = global.AudioContext || global.webkitAudioContext;

      if (!AudioContext) {
        console.warn("Web Audio API is not supported.");
        return null;
      }

      audioContext = new AudioContext();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  }

  function tone(frequency, duration, type = "sine", volume = 0.3, delay = 0) {
    const ctx = getAudioContext();
    if (!ctx || muted) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    const startTime = ctx.currentTime + delay;
    const endTime = startTime + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, volume * masterVolume),
      startTime + 0.01,
    );
    gain.gain.exponentialRampToValueAtTime(0.001, endTime);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(endTime + 0.03);
  }

  function noise(duration = 0.12, volume = 0.2) {
    const ctx = getAudioContext();
    if (!ctx || muted) return;

    const buffer = ctx.createBuffer(
      1,
      ctx.sampleRate * duration,
      ctx.sampleRate,
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = "highpass";
    filter.frequency.value = 700;

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, volume * masterVolume),
      ctx.currentTime + 0.01,
    );
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
  }

  const sounds = {
    "cart-add": () => {
      tone(520, 0.09, "sine", 0.25);
      tone(780, 0.12, "sine", 0.22, 0.08);
    },

    "cart-remove": () => {
      tone(500, 0.1, "triangle", 0.22);
      tone(300, 0.16, "triangle", 0.2, 0.09);
    },

    checkout: () => {
      tone(440, 0.1, "sine", 0.2);
      tone(660, 0.1, "sine", 0.2, 0.1);
      tone(880, 0.18, "sine", 0.25, 0.2);
    },

    "payment-success": () => {
      tone(523, 0.12, "sine", 0.25);
      tone(659, 0.12, "sine", 0.25, 0.12);
      tone(784, 0.22, "sine", 0.3, 0.24);
    },

    "payment-failed": () => {
      tone(300, 0.18, "sawtooth", 0.22);
      tone(220, 0.25, "sawtooth", 0.25, 0.18);
    },

    "wishlist-add": () => {
      tone(660, 0.1, "sine", 0.2);
      tone(990, 0.16, "sine", 0.25, 0.1);
    },

    "wishlist-remove": () => {
      tone(660, 0.1, "triangle", 0.2);
      tone(440, 0.16, "triangle", 0.2, 0.1);
    },

    "new-order": () => {
      tone(600, 0.1, "sine", 0.25);
      tone(800, 0.1, "sine", 0.25, 0.12);
      tone(1000, 0.2, "sine", 0.3, 0.24);
    },

    "order-confirmed": () => {
      tone(500, 0.1, "sine", 0.2);
      tone(700, 0.1, "sine", 0.2, 0.1);
      tone(900, 0.2, "sine", 0.25, 0.2);
    },

    "order-cancelled": () => {
      tone(400, 0.15, "square", 0.2);
      tone(250, 0.25, "square", 0.2, 0.15);
    },

    "order-shipped": () => {
      tone(440, 0.1, "triangle", 0.2);
      tone(660, 0.1, "triangle", 0.2, 0.1);
      tone(880, 0.15, "triangle", 0.25, 0.2);
    },

    delivery: () => {
      tone(700, 0.08, "sine", 0.2);
      tone(900, 0.08, "sine", 0.2, 0.1);
      tone(1100, 0.16, "sine", 0.25, 0.2);
    },

    notification: () => {
      tone(880, 0.1, "sine", 0.25);
      tone(1100, 0.16, "sine", 0.22, 0.1);
    },

    message: () => {
      tone(600, 0.1, "sine", 0.2);
      tone(850, 0.14, "sine", 0.2, 0.1);
    },

    email: () => {
      tone(500, 0.1, "triangle", 0.2);
      tone(750, 0.15, "triangle", 0.2, 0.1);
    },

    alert: () => {
      tone(950, 0.12, "square", 0.25);
      tone(950, 0.12, "square", 0.25, 0.2);
    },

    success: () => {
      tone(523, 0.1, "sine", 0.25);
      tone(659, 0.1, "sine", 0.25, 0.1);
      tone(784, 0.2, "sine", 0.3, 0.2);
    },

    error: () => {
      tone(220, 0.18, "sawtooth", 0.25);
      tone(160, 0.25, "sawtooth", 0.25, 0.18);
    },

    warning: () => {
      tone(500, 0.14, "square", 0.2);
      tone(500, 0.14, "square", 0.2, 0.22);
    },

    click: () => {
      tone(900, 0.045, "square", 0.15);
    },

    pop: () => {
      tone(500, 0.07, "sine", 0.2);
      tone(900, 0.1, "sine", 0.15, 0.04);
    },

    "toggle-on": () => {
      tone(500, 0.08, "sine", 0.2);
      tone(800, 0.12, "sine", 0.2, 0.08);
    },

    "toggle-off": () => {
      tone(800, 0.08, "triangle", 0.2);
      tone(500, 0.12, "triangle", 0.2, 0.08);
    },

    delete: () => {
      noise(0.12, 0.18);
      tone(180, 0.18, "square", 0.15, 0.08);
    },

    "login-success": () => {
      tone(500, 0.1, "sine", 0.2);
      tone(700, 0.1, "sine", 0.2, 0.1);
      tone(1000, 0.2, "sine", 0.25, 0.2);
    },

    "login-error": () => {
      tone(280, 0.15, "sawtooth", 0.22);
      tone(180, 0.2, "sawtooth", 0.22, 0.15);
    },

    logout: () => {
      tone(700, 0.1, "triangle", 0.2);
      tone(450, 0.18, "triangle", 0.2, 0.1);
    },

    "success-long": () => {
      tone(523, 0.12, "sine", 0.25);
      tone(659, 0.12, "sine", 0.25, 0.12);
      tone(784, 0.12, "sine", 0.25, 0.24);
      tone(1046, 0.3, "sine", 0.3, 0.36);
    },

    "error-long": () => {
      tone(300, 0.18, "sawtooth", 0.25);
      tone(240, 0.18, "sawtooth", 0.25, 0.2);
      tone(180, 0.3, "sawtooth", 0.25, 0.4);
    },
  };

  const ShopEaseSounds = {
    play(name) {
      if (!sounds[name]) {
        console.warn(`Unknown sound: ${name}`);
        return;
      }

      sounds[name]();
    },

    setVolume(value) {
      masterVolume = Math.max(0, Math.min(1, Number(value) || 0));
    },

    getVolume() {
      return masterVolume;
    },

    setMuted(value) {
      muted = Boolean(value);
    },

    isMuted() {
      return muted;
    },

    toggleMute() {
      muted = !muted;
      return muted;
    },

    list() {
      return Object.keys(sounds);
    },
  };

  global.ShopEaseSounds = ShopEaseSounds;
})(window);
