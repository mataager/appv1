/* 
======================================================================
 DROPDOP IMPLEMENTATION EXAMPLES
======================================================================

1. Standard Default Dropdown (White)
<div class="dropdop" data-optnum="3" data-selected="Featured" data-type="standard" data-showcount="true"
    data-options="New Arrivals,Best Sellers,Sale,Limited Items,Clearance">
</div>

2. OUTLINE STYLE (Best Seller Badge) with Count
<div class="dropdop" data-optnum="3" data-selected="Best Seller" data-type="standard" data-style="outline"
    data-showcount="true" data-options="Best Sellers,Top Rated,New Arrivals,Sale,Limited Items">
</div>

3. Small Outline Dropdown without Count
<div class="dropdop" data-optnum="3" data-selected="Limited Items" data-type="standard" data-showcount="true"
    data-size="sm" data-style="outline" data-options="Limited Items,Clearance,Last Chance,Exclusive">
</div>

4. Outline Color Dropdown
<div class="dropdop" data-optnum="2" data-selected="Red" data-type="color" data-style="outline"
    data-showcount="true" data-options="Red,Blue,Green,Black,White">
</div>

5. Standard Search Dropdown
<div class="dropdop" data-optnum="3" data-selected="Search Items" data-type="search" data-showcount="true"
    data-options="T-Shirts,Hoodies,Jackets,Pants,Shorts,Accessories">
</div>

6. Outline Style Search Dropdown (Dark Badge look)
<div class="dropdop" data-optnum="3" data-selected="Search Category" data-type="search" data-style="outline"
    data-showcount="true" data-options="Men,Women,Kids,Accessories,Shoes">
</div>

7. Color Search Dropdown
<div class="dropdop" data-optnum="3" data-selected="Select Color" data-type="color-search" data-style="outline"
    data-showcount="true" data-options="Red,Blue,Green,Black,White,Yellow,Purple,Pink">
</div>

8. Order Status Dropdown WITH Custom Color Dots
<div class="dropdop" data-optnum="3" data-selected="Order Status" data-type="status" data-style="outline"
    data-showcount="true"
    data-options="Pending:#FFA500,Accepted:#007AFF,Shipped:#34C759,Canceled:#FF3B30,Returned:#8E8E93">
</div>

9. Material Dropdown WITH Images and Search
<div class="dropdop" data-optnum="3" data-selected="Select Material" data-type="material-search" data-style="outline"
    data-showcount="true"
    data-options="Wood:https://tse4.mm.bing.net/th/id/OIP.uv7qSos89CNQVrcq0BJNGwHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3,Leather:https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=50&h=50&fit=crop,Denim:https://images.unsplash.com/photo-1542272604-787c3835535d?w=50&h=50&fit=crop">
</div>

======================================================================
*/

// 1. Define the CSS as a string (The CSS Pusher)
const dropDopCSS = `
    /* --- DropDop Base Styles --- */
    .dropdop {
        position: relative;
        display: inline-block;
        width: fit-content; 
        max-width: 100%;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        z-index: 1000; 
        transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        interpolate-size: allow-keywords;
    }

    .dropdop.active {
        z-index: 99999; 
    }

    /* The Button (btndop) */
    .btndop {
        background-color: #ffffff;
        color: #000000;
        border: none;
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%; 
        transition: background-color 0.2s, padding 0.2s, width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .btndop:hover {
        background-color: #e0e0e0;
    }

    /* Button inner layout */
    .btndop-left {
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .btndop-right {
        display: flex;
        align-items: center;
        gap: 8px; 
        flex-shrink: 0;
        margin-left: 12px; 
    }

    /* Caret Icon - Defaults to pointing DOWN */
    .btndop .caret {
        width: 16px;
        height: 16px;
        transition: transform 0.3s ease;
    }

    .dropdop.active .btndop .caret {
        transform: rotate(180deg);
    }

    /* The Menu (menudop) */
    .menudop {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        min-width: 100%;
        width: max-content;
        max-width: 300px; 
        background-color: #1c1c1e;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 99999; 
        overflow: hidden;
    }

    .dropdop.active .menudop {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    /* Options List */
    .opt-list {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #555 transparent;
    }

    .opt-list::-webkit-scrollbar { width: 4px; }
    .opt-list::-webkit-scrollbar-track { background: transparent; }
    .opt-list::-webkit-scrollbar-thumb { background: #555; border-radius: 2px; }
    .opt-list::-webkit-scrollbar-thumb:hover { background: #777; }

    /* Individual Option (optdop) */
    .optdop {
        padding: 10px 16px;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background-color 0.2s;
        white-space: nowrap; 
    }

    .optdop:hover {
        background-color: #2c2c2e;
    }

    /* Color & Material Swatch styling */
    .optdop .color-swatch, .btndop .color-swatch {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 10px;
        border: 1px solid rgba(255,255,255,0.2);
        flex-shrink: 0;
        background-size: cover;
        background-position: center;
        display: inline-block; 
        vertical-align: middle;
    }

    /* Adjust swatch inside button slightly */
    .btndop .color-swatch {
        width: 14px;
        height: 14px;
        margin-right: 8px;
        border: 1px solid rgba(0,0,0,0.1); 
    }

    .dropdop.style-outline .btndop .color-swatch {
        border: 1px solid rgba(255,255,255,0.4); 
    }

    /* Search Bar (searchdop) */
    .search-wrap {
        padding: 10px;
        border-bottom: 1px solid #333333;
        background-color: #1c1c1e;
    }

    .searchdop {
        width: 100%;
        background-color: #2c2c2e;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        color: #ffffff;
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
    }
    
    .searchdop::placeholder {
        color: #8e8e93;
    }

    /* --- Size Variants --- */
    .dropdop.size-sm .btndop { padding: 6px 12px; font-size: 12px; border-radius: 16px; }
    .dropdop.size-sm .btndop .caret { width: 14px; height: 14px; }
    .dropdop.size-sm .btndop .color-swatch { width: 12px; height: 12px; margin-right: 6px; }
    .dropdop.size-sm .optdop { padding: 8px 12px; font-size: 12px; }
    .dropdop.size-sm .optdop .color-swatch { width: 12px; height: 12px; }
    .dropdop.size-sm .searchdop { padding: 6px 10px; font-size: 12px; }

    .dropdop.size-lg .btndop { padding: 14px 20px; font-size: 16px; border-radius: 24px; }
    .dropdop.size-lg .btndop .caret { width: 20px; height: 20px; }
    .dropdop.size-lg .btndop .color-swatch { width: 18px; height: 18px; margin-right: 10px; }
    .dropdop.size-lg .optdop { padding: 14px 20px; font-size: 16px; }
    .dropdop.size-lg .optdop .color-swatch { width: 20px; height: 20px; }
    .dropdop.size-lg .searchdop { padding: 10px 14px; font-size: 14px; }

    /* --- Option Count Hint --- */
    .opt-count {
        color: #888888;
        font-weight: 400;
        font-size: 0.85em;
    }

    /* --- Outline Style (Best Seller Badge) --- */
    .dropdop.style-outline .btndop {
        background-color: #1c1c1e; 
        color: #ffffff; 
        border: 1px solid #333333; 
    }

    .dropdop.style-outline .btndop:hover {
        background-color: #2c2c2e;
    }

    .dropdop.style-outline .btndop .caret {
        color: #8e8e93; 
    }
`;

// 2. The CSS Pusher Function
function pushDropDopStyles() {
  if (!document.getElementById("dropdop-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "dropdop-styles";
    styleElement.innerHTML = dropDopCSS;
    document.head.appendChild(styleElement);
    console.log("DropDop CSS Pushed Successfully");
  }
}

// 3. Initialize Everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  pushDropDopStyles();

  const dropdopElements = document.querySelectorAll(".dropdop");
  dropdopElements.forEach((element) => {
    new DropDop(element);
  });
});

// 4. DropDop Class Logic
class DropDop {
  constructor(container) {
    this.container = container;

    // Parse HTML parameters
    this.optnum = parseInt(this.container.dataset.optnum) || 3;
    this.selected = this.container.dataset.selected || "Select...";
    this.type = this.container.dataset.type || "standard";
    this.options = this.container.dataset.options
      ? this.container.dataset.options.split(",")
      : [];

    // Styling and Layout Parameters
    this.size = this.container.dataset.size || "md";
    this.showCount = this.container.dataset.showcount === "true";
    this.style = this.container.dataset.style || "default";

    this.render();
    this.bindEvents();
  }

  // Helper to generate the correct swatch HTML for the button based on the selected value
  getSwatchHTML(value) {
    if (
      !value ||
      value === "Select..." ||
      value === "Order Status" ||
      value === "Select Color" ||
      value === "Select Material"
    ) {
      return "";
    }

    // Find the original option string to extract color/url data
    const rawOpt = this.options.find((o) => {
      const trimmed = o.trim();
      if (this.type.includes("material") || this.type === "status") {
        return trimmed.startsWith(value + ":");
      }
      return trimmed === value;
    });

    if (!rawOpt) return "";

    const trimmedRaw = rawOpt.trim();

    if (this.type.includes("color")) {
      return `<div class="color-swatch" style="background-color: ${value.toLowerCase()};"></div>`;
    } else if (this.type.includes("material")) {
      // FIX: Use indexOf to safely split on the first colon only (URLs contain colons)
      const colonIndex = trimmedRaw.indexOf(":");
      const name = trimmedRaw.substring(0, colonIndex).trim();
      const url = trimmedRaw.substring(colonIndex + 1).trim();

      const safeUrl = url
        ? url
        : "https://via.placeholder.com/16/333333/ffffff?text=M";
      return `<div class="color-swatch" style="background-image: url('${safeUrl}');"></div>`;
    } else if (this.type === "status") {
      const [name, hex] = trimmedRaw.split(":");
      const safeColor = hex || "#888888";
      return `<div class="color-swatch" style="background-color: ${safeColor};"></div>`;
    }
    return "";
  }

  render() {
    this.container.classList.add(`size-${this.size}`, `style-${this.style}`);

    let itemHeight = 40;
    if (this.size === "sm") itemHeight = 32;
    if (this.size === "lg") itemHeight = 48;

    const maxHeight = this.optnum * itemHeight;

    // Check if type contains 'search'
    const searchHTML = this.type.includes("search")
      ? `<div class="search-wrap"><input type="text" class="searchdop" placeholder="Search..."></div>`
      : "";

    const optionsHTML = this.options
      .map((opt) => {
        const trimmedOpt = opt.trim();

        if (this.type.includes("color")) {
          return `<li class="optdop" data-value="${trimmedOpt}">
                            <div class="color-swatch" style="background-color: ${trimmedOpt.toLowerCase()};"></div>
                            <span>${trimmedOpt}</span>
                        </li>`;
        } else if (this.type.includes("material")) {
          // FIX: Use indexOf to safely split on the first colon only (URLs contain colons)
          const colonIndex = trimmedOpt.indexOf(":");
          let matName = trimmedOpt;
          let imgUrl = "";

          if (colonIndex !== -1) {
            matName = trimmedOpt.substring(0, colonIndex).trim();
            imgUrl = trimmedOpt.substring(colonIndex + 1).trim();
          }

          const safeUrl = imgUrl
            ? imgUrl
            : "https://via.placeholder.com/16/333333/ffffff?text=M";

          return `<li class="optdop" data-value="${matName}">
                            <div class="color-swatch" style="background-image: url('${safeUrl}');"></div>
                            <span>${matName}</span>
                        </li>`;
        } else if (this.type === "status") {
          const [statusName, colorHex] = trimmedOpt.split(":");
          const safeColor = colorHex || "#888888";
          return `<li class="optdop" data-value="${statusName}">
                            <div class="color-swatch" style="background-color: ${safeColor};"></div>
                            <span>${statusName}</span>
                        </li>`;
        }
        return `<li class="optdop" data-value="${trimmedOpt}"><span>${trimmedOpt}</span></li>`;
      })
      .join("");

    let countHTML = "";
    if (this.showCount && this.options.length > 1) {
      const remaining = this.options.length - 1;
      countHTML = `<span class="opt-count">+${remaining}</span>`;
    }

    // Generate the initial swatch if applicable
    const initialSwatchHTML = this.getSwatchHTML(this.selected);

    this.container.innerHTML = `
            <button class="btndop">
                <div class="btndop-left">
                    ${initialSwatchHTML}
                    <span class="btndop-text">${this.selected}</span>
                </div>
                <div class="btndop-right">
                    ${countHTML}
                    <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </button>
            <div class="menudop">
                ${searchHTML}
                <ul class="opt-list" style="max-height: ${maxHeight}px;">
                    ${optionsHTML}
                </ul>
            </div>
        `;
  }

  bindEvents() {
    const btn = this.container.querySelector(".btndop");
    const options = this.container.querySelectorAll(".optdop");
    const searchInput = this.container.querySelector(".searchdop");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      document.querySelectorAll(".dropdop").forEach((dop) => {
        if (dop !== this.container) dop.classList.remove("active");
      });

      this.container.classList.toggle("active");

      if (searchInput && this.container.classList.contains("active")) {
        setTimeout(() => searchInput.focus(), 100);
      }
    });

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        const value = opt.getAttribute("data-value");

        // Find the swatch element inside the clicked option
        const listSwatch = opt.querySelector(".color-swatch");
        let swatchHTML = "";

        if (listSwatch) {
          // Clone the swatch exactly as it is (preserves background-color or background-image)
          swatchHTML = listSwatch.outerHTML;
        }

        // Update the button's inner layout
        const btnLeft = this.container.querySelector(".btndop-left");

        // Preserve the current width before changing content to help with smooth transition
        const currentWidth = this.container.offsetWidth;
        this.container.style.width = `${currentWidth}px`;

        btnLeft.innerHTML = `${swatchHTML}<span class="btndop-text">${value}</span>`;

        // Let the browser calculate the new natural width, then animate to it
        requestAnimationFrame(() => {
          this.container.style.width = ""; // Reset to fit-content
        });

        this.container.classList.remove("active");
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        options.forEach((opt) => {
          const textValue = opt.getAttribute("data-value").toLowerCase();
          opt.style.display = textValue.includes(term) ? "flex" : "none";
        });
      });
    }
  }
}

document.addEventListener("click", () => {
  document.querySelectorAll(".dropdop").forEach((dop) => {
    dop.classList.remove("active");
  });
});
