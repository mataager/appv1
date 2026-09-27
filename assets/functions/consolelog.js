(function () {
  function showMatagerInfo(options = {}) {
    const {
      tagline = "eCommerce without noise",
      about = "A clean, minimal ecommerce platform for sellers who want less clutter — and more sales.",
      cta = "Need to own a store?",
      storeUrl = "https://matager.com/start",
      links = {
        Docs: "https://matager.com/docs",
        API: "https://api.matager.com",
        Help: "https://matager.com/help",
        GitHub: "https://github.com/matager",
        Status: "https://status.matager.com",
        Careers: "https://matager.com/careers",
        "Twitter/X": "https://x.com/matager",
      },
    } = options;

    const W = 70;

    const pad = (s = "") => {
      s = String(s);
      if (s.length >= W) return s.slice(0, W);
      const total = W - s.length;
      const left = Math.floor(total / 2);
      const right = total - left;
      return " ".repeat(left) + s + " ".repeat(right);
    };

    const row = (s = "") => "║" + pad(s) + "║";
    const blank = row();
    const top = "╔" + "═".repeat(W) + "╗";
    const mid = "╠" + "═".repeat(W) + "╣";
    const bottom = "╚" + "═".repeat(W) + "╝";

    const logo = [
      "███╗   ███╗  █████╗  ████████╗  █████╗   ██████╗  ███████╗ ██████╗ ",
      "████╗ ████║ ██╔══██╗ ╚══██╔══╝ ██╔══██╗ ██╔════╝  ██╔════╝ ██╔══██╗",
      "██╔████╔██║ ███████║    ██║    ███████║ ██║  ███╗ █████╗   ██████╔╝",
      "██║╚██╔╝██║ ██╔══██║    ██║    ██╔══██║ ██║   ██║ ██╔══╝   ██╔══██╗",
      "██║ ╚═╝ ██║ ██║  ██║    ██║    ██║  ██║ ╚██████╔╝ ███████╗ ██║  ██║",
      "╚═╝     ╚═╝ ╚═╝  ╚═╝    ╚═╝    ╚═╝  ╚═╝  ╚═════╝  ╚══════╝ ╚═╝  ╚═╝",
    ];

    const wrap = (text, width) => {
      const words = String(text).split(/\s+/);
      const out = [];
      let cur = "";
      for (const w of words) {
        if ((cur ? cur + " " + w : w).length > width) {
          if (cur) out.push(cur);
          cur = w;
        } else {
          cur = cur ? cur + " " + w : w;
        }
      }
      if (cur) out.push(cur);
      return out;
    };

    const aboutBlock = wrap(about, W - 8).map((l, i) =>
      row((i === 0 ? "▸  " : "   ") + l),
    );

    // Build the links block — two columns
    const linkEntries = Object.entries(links);
    const linkLines = [];
    for (let i = 0; i < linkEntries.length; i += 2) {
      const [n1, u1] = linkEntries[i];
      const [n2, u2] = linkEntries[i + 1] || ["", ""];
      const left = `${n1 ? `[${n1}] ${u1}` : ""}`;
      const right = `${n2 ? `[${n2}] ${u2}` : ""}`;
      linkLines.push(row(`  ${left}${n2 ? "   " + right : ""}`));
    }

    const art = [
      top,
      blank,
      ...logo.map(row),
      blank,
      row(`✦   ${tagline}   ✦`),
      mid,
      blank,
      ...aboutBlock,
      blank,
      row(`▸  ${cta}`),
      row(`   ➜  ${storeUrl}`),
      mid,
      blank,
      row("  ⚡  Developer & Hacker Links"),
      blank,
      ...linkLines,
      blank,
      row("  ┌─ Try the console:  showMatagerInfo({ storeUrl: '...' }) ─┐"),
      row("  └─ Hack away. Build something great.  ───────────────────┘"),
      blank,
      bottom,
    ].join("\n");

    console.log(
      `%c${art}`,
      "color:#ffffff;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:12px;line-height:1.15;",
    );

    // Bonus: expose the links as clickable console shortcuts
    if (console.table) {
      console.log(
        "%cQuick links",
        "color:#10b981;font-weight:700;font-size:13px;",
      );
      console.table(links);
    }
  }

  window.showMatagerInfo = showMatagerInfo;

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    showMatagerInfo();
  } else {
    window.addEventListener("DOMContentLoaded", () => showMatagerInfo());
  }
})();
