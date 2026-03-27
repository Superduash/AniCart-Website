# AniCart — Single Master Frontend Prompt
### Paste this entire prompt into Gemini 2.5 Pro or VS Code Copilot (GPT-4.1) as ONE message.
### The AI will output every file in sequence. Do not interrupt it mid-generation.

---

````
You are a senior React engineer. You will completely rewrite the frontend of AniCart — a sci-fi glassmorphism anime wallpaper eCommerce platform — into production-level quality.

This is a Create React App project (React 19, Context API, NO React Router — custom NavigationContext handles all page switching via state). It already has a working glassmorphism UI that looks great. Your job is to make it 10x better without breaking any of the existing visual design or page structure.

Read all constraints below carefully before writing a single line of code.

══════════════════════════════════════════════════════════════
SECTION 0 — ABSOLUTE RULES (violating any = task failed)
══════════════════════════════════════════════════════════════

1. Output COMPLETE code for every file. Zero placeholders. Zero "// ... same as before". Zero "add your styles here".
2. Do NOT use React Router. Navigation is done by changing `currentPage` state in App.js.
3. Do NOT install new npm packages. Only use: react, react-dom, framer-motion, axios (already installed).
4. Preserve the existing sci-fi glassmorphism design language (dark bg, neon cyan, pink, purple, glass cards, scanlines, starfield, nebula blobs, cursor glow). Enhance it, never replace it.
5. All 4 Contexts (AuthContext, CartContext, ToastContext, NavigationContext) must stay exported from App.js.
6. Every button, link, and action must be fully wired. Zero dead interactions.
7. No TypeScript. Pure JavaScript + JSX only.
8. Output files in this order, one after another, no stopping:
   1. src/data/wallpapers.js
   2. src/utils/storage.js
   3. src/utils/formatters.js
   4. src/hooks/useAuth.js
   5. src/hooks/useCart.js
   6. src/hooks/useToast.js
   7. src/components/Loader.jsx
   8. src/components/SkeletonCard.jsx
   9. src/components/ScrollToTop.jsx
   10. src/components/NotFound.jsx
   11. src/components/Footer.jsx
   12. src/components/ProductCard.jsx
   13. src/components/CartSidebar.jsx
   14. src/components/Navbar.jsx
   15. src/App.css
   16. src/App.js
   17. src/pages/LandingPage.jsx
   18. src/pages/LoginPage.jsx
   19. src/pages/SignupPage.jsx
   20. src/pages/Dashboard.jsx

══════════════════════════════════════════════════════════════
SECTION 1 — DESIGN SYSTEM (apply to every file)
══════════════════════════════════════════════════════════════

CSS Variables (defined in :root in App.css, referenced as var() everywhere):
  --bg-deep: #020617
  --bg-card: rgba(15, 23, 42, 0.6)
  --glass: rgba(15, 23, 42, 0.6)
  --glass-heavy: rgba(10, 18, 40, 0.92)
  --neon: #00f3ff
  --neon-dim: rgba(0, 243, 255, 0.12)
  --neon-glow: 0 0 20px rgba(0,243,255,0.3), 0 0 60px rgba(0,243,255,0.08)
  --pink: #ff2d78
  --pink-dim: rgba(255, 45, 120, 0.12)
  --pink-glow: 0 0 20px rgba(255,45,120,0.3), 0 0 60px rgba(255,45,120,0.08)
  --purple: #7c3aed
  --text: #f8fafc
  --muted: #94a3b8
  --radius-card: 16px
  --radius-btn: 12px
  --radius-input: 12px
  --transition: all 0.25s ease

Inline styles (for component-scoped styles) must match these tokens exactly.

══════════════════════════════════════════════════════════════
SECTION 2 — FILE-BY-FILE SPECIFICATIONS
══════════════════════════════════════════════════════════════

────────────────────────────────────────
FILE 1: src/data/wallpapers.js
────────────────────────────────────────
Export default an array called WALLPAPERS.

Include these 12 entries (use the EXACT field names below):
  id (string: "wp_01" etc)
  title (string — character + art subtitle)
  anime (string — series name)
  price (number)
  rating (number, 1 decimal)
  reviews (number)
  resolution ("4K Ultra HD" or "2K HD")
  tags (string array, 2 items)
  badge ("HOT" | "NEW" | "PREMIUM" | "BESTSELLER" | "CLASSIC")
  badgeType ("neon" | "pink")
  imageUrl (string)

The 12 entries (map PRODUCTS_DATA from App.js + add 4 new ones):
  wp_01: Itadori Yuji — Cursed Pulse / Jujutsu Kaisen / $4.99 / HOT neon / 4.9 / 234 / 4K / Action,Dark Fantasy / https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop
  wp_02: Mikasa Ackerman — Titan's Edge / Attack on Titan / $3.99 / NEW pink / 4.8 / 189 / 4K / Action,Post-Apocalyptic / https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop
  wp_03: Nezuko — Bamboo Blossom / Demon Slayer / $5.99 / BESTSELLER neon / 5.0 / 412 / 4K / Fantasy,Adventure / https://images.unsplash.com/photo-1492576540313-31ad3a64ba5e?w=400&h=300&fit=crop
  wp_04: Naruto — Nine-Tails Awakening / Naruto Shippuden / $3.49 / CLASSIC neon / 4.7 / 567 / 2K / Action,Ninja / https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop
  wp_05: Gojo Satoru — Infinity Veil / Jujutsu Kaisen / $6.99 / PREMIUM pink / 4.9 / 321 / 4K / Action,Supernatural / https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop
  wp_06: Levi Ackerman — Thunder Spear / Attack on Titan / $4.49 / NEW neon / 4.8 / 276 / 4K / Action,Drama / https://images.unsplash.com/photo-1547636780-9b865e394b50?w=400&h=300&fit=crop
  wp_07: Luffy — Gear Fifth / One Piece / $5.49 / HOT pink / 4.9 / 398 / 4K / Adventure,Comedy / https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop
  wp_08: Zoro — Asura Phantom / One Piece / $4.99 / CLASSIC neon / 4.7 / 245 / 2K / Action,Adventure / https://images.unsplash.com/photo-1580130732478-4e339fb33746?w=400&h=300&fit=crop
  wp_09: Killua — Godspeed Surge / Hunter x Hunter / $4.79 / NEW neon / 4.8 / 198 / 4K / Action,Thriller / https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=300&fit=crop
  wp_10: Rem — Frozen Reverie / Re:Zero / $5.29 / PREMIUM pink / 4.9 / 303 / 4K / Fantasy,Romance / https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=300&fit=crop
  wp_11: Saitama — One Punch Calm / One Punch Man / $3.99 / CLASSIC neon / 4.7 / 441 / 2K / Action,Comedy / https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=300&fit=crop
  wp_12: Tanjiro — Hinokami Bloom / Demon Slayer / $6.49 / HOT pink / 5.0 / 389 / 4K / Action,Fantasy / https://images.unsplash.com/photo-1540206395-68808572332f?w=400&h=300&fit=crop

Add a comment at the top of the file:
  // ✦ Add new wallpapers here. Each entry will auto-appear in the store.

────────────────────────────────────────
FILE 2: src/utils/storage.js
────────────────────────────────────────
Export these named functions (all silently catch errors):
  saveToStorage(key, value)  → JSON.stringify and localStorage.setItem
  loadFromStorage(key, fallback = null) → JSON.parse and localStorage.getItem, return fallback on error/null
  removeFromStorage(key) → localStorage.removeItem

Keys used by the app: 'anicart_user', 'anicart_cart', 'anicart_token'

────────────────────────────────────────
FILE 3: src/utils/formatters.js
────────────────────────────────────────
Export these named functions:
  formatPrice(num) → returns "$4.99" (always 2 decimal places)
  formatRating(num) → returns "4.9 ★"
  formatCount(num) → returns "1,234" (toLocaleString)
  truncate(str, n = 40) → returns str if short, else str.slice(0,n) + "…"
  getInitials(name) → returns first letter of first word + first letter of second word, uppercase, max 2 chars

────────────────────────────────────────
FILE 4: src/hooks/useAuth.js
────────────────────────────────────────
Import useContext and AuthContext from '../App'.
Export default function useAuth() that returns useContext(AuthContext).
If context is null, throw new Error('useAuth must be used inside AuthContext.Provider').

────────────────────────────────────────
FILE 5: src/hooks/useCart.js
────────────────────────────────────────
Same pattern — CartContext from '../App'. Throw if null.

────────────────────────────────────────
FILE 6: src/hooks/useToast.js
────────────────────────────────────────
Same pattern — ToastContext from '../App'. Throw if null.

────────────────────────────────────────
FILE 7: src/components/Loader.jsx
────────────────────────────────────────
Props: fullscreen (bool, default false)

If fullscreen: render a fixed overlay (position fixed, inset 0, z-index 9999, background #020617, display flex, flex-direction column, align/justify center).

Content:
  - A spinning ring: 56px × 56px div, border: 3px solid rgba(0,243,255,0.15), border-top: 3px solid #00f3ff, border-radius 50%, animation: spin 1s linear infinite.
  - Below: "AniCart" text — color #00f3ff, font-size 1.3rem, font-weight 700, letter-spacing 0.25em, margin-top 20px.
  - Below: "Initializing…" — color #94a3b8, font-size 0.78rem, margin-top 6px.

If not fullscreen: render just the spinning ring (40px), centered in its container.

Define @keyframes spin inside a <style> tag at the top of the component, OR use a style object with animation.
Use only inline styles. Export default.

────────────────────────────────────────
FILE 8: src/components/SkeletonCard.jsx
────────────────────────────────────────
A loading placeholder matching ProductCard dimensions (~340px tall, 100% width).

Structure (all inline styles):
  - Outer card: border-radius 16px, overflow hidden, background rgba(15,23,42,0.6), border: 1px solid rgba(255,255,255,0.06).
  - Image skeleton: 55% height, width 100%, shimmer animation.
  - Body: padding 14px, display flex flex-direction column gap 10px.
  - Three skeleton bars: widths 70%, 50%, 90%, heights 12px, 10px, 10px, border-radius 6px, shimmer animation.
  - Button skeleton: height 36px, width 100%, border-radius 12px, shimmer animation, margin-top 8px.

Shimmer: background linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(0,243,255,0.07) 50%, rgba(255,255,255,0.03) 75%), background-size 200% 100%, animation shimmerMove 1.6s infinite linear.

Inject @keyframes shimmerMove into a <style> tag once. Export default.

────────────────────────────────────────
FILE 9: src/components/ScrollToTop.jsx
────────────────────────────────────────
Fixed position: bottom 28px, right 28px. Z-index 400.
Only visible when window.scrollY > 300 (use useState + useEffect with scroll listener).
Appearance/disappearance: opacity + transform transition (0.3s ease).
  Visible: opacity 1, transform translateY(0).
  Hidden: opacity 0, transform translateY(12px), pointer-events none.

Button: 44px × 44px, border-radius 50%, background rgba(15,23,42,0.8), border: 1px solid rgba(0,243,255,0.35), color #00f3ff, font-size 1.1rem, cursor pointer.
Hover: box-shadow 0 0 16px rgba(0,243,255,0.35), background rgba(0,243,255,0.1).
Content: "↑" character.
onClick: window.scrollTo({ top: 0, behavior: 'smooth' }).

Export default.

────────────────────────────────────────
FILE 10: src/components/NotFound.jsx
────────────────────────────────────────
Import useContext and NavigationContext from '../App'.

Full viewport centered layout (min-height 100vh, display flex, align/justify center, flex-direction column, gap 16px, text-align center, padding 40px).

Content:
  - "404" — font-size 7rem, font-weight 900, color #00f3ff, text-shadow 0 0 40px rgba(0,243,255,0.6), line-height 1.
  - "Lost in the Anime Verse" — font-size 1.5rem, color #f8fafc, font-weight 600.
  - "This page doesn't exist or has shifted dimensions." — font-size 0.9rem, color #94a3b8.
  - Button "Return to Base": inline-flex, padding 12px 28px, border-radius 12px, border: 1px solid #00f3ff, background transparent, color #00f3ff, font-size 0.9rem, font-weight 600, cursor pointer, transition all 0.25s.
    Hover: background rgba(0,243,255,0.12), box-shadow 0 0 20px rgba(0,243,255,0.25).
    onClick: calls navigate('landing') from NavigationContext.

Export default.

────────────────────────────────────────
FILE 11: src/components/Footer.jsx
────────────────────────────────────────
Import useContext and NavigationContext from '../App'.

Full-width footer. Inline styles only.
  Outer: background rgba(10,18,40,0.7), border-top: 1px solid rgba(0,243,255,0.08), padding 40px 60px, backdrop-filter blur(12px).
  Inner: max-width 1200px, margin 0 auto, display flex, justify-content space-between, align-items center, flex-wrap wrap, gap 24px.

  Left column:
    - "✦ AniCart" — font-size 1.2rem, font-weight 700, background: linear-gradient(135deg,#00f3ff,#7c3aed), -webkit-background-clip: text, -webkit-text-fill-color: transparent.
    - "Premium Anime Wallpapers" — font-size 0.78rem, color #94a3b8, margin-top 4px.

  Center column: flex row, gap 24px.
    Links: "Store", "Login", "About" (About does nothing but shows toast "Coming soon").
    Each link: font-size 0.85rem, color #94a3b8, cursor pointer, no text-decoration.
    Hover: color #f8fafc.
    "Store" → navigate('dashboard')
    "Login" → navigate('login')

  Right column:
    "© 2025 AniCart. All rights reserved." — font-size 0.75rem, color #94a3b8.

Responsive: at max-width 640px, inner becomes flex-direction column, text-align center, align-items center.

Use NavigationContext for navigation. Use useToast hook for the "About" toast.
Export default.

────────────────────────────────────────
FILE 12: src/components/ProductCard.jsx
────────────────────────────────────────
Import useCart from '../hooks/useCart'.
Import useToast from '../hooks/useToast'.
Import { formatPrice, formatRating, formatCount, truncate } from '../utils/formatters'.

Props: product (object matching WALLPAPERS shape)

Card container (all inline styles):
  - position relative, border-radius 16px, overflow hidden
  - background rgba(15,23,42,0.6), border: 1px solid rgba(255,255,255,0.06)
  - cursor pointer, transition: transform 0.3s ease, box-shadow 0.3s ease
  - On hover (use onMouseEnter/onMouseLeave state): transform translateY(-6px), box-shadow 0 8px 32px rgba(0,243,255,0.15)

Image section (top 55% of card):
  - position relative, height 200px, overflow hidden
  - <img> width 100%, height 100%, object-fit cover, loading="lazy"
  - img transition: transform 0.4s ease. On card hover: img transform scale(1.05)

Badge (absolute, top 10px, left 10px):
  - padding 3px 10px, border-radius 20px, font-size 0.62rem, font-weight 700, letter-spacing 0.08em, text-transform uppercase
  - badgeType 'neon': background rgba(0,243,255,0.12), color #00f3ff, border: 1px solid rgba(0,243,255,0.3)
  - badgeType 'pink': background rgba(255,45,120,0.12), color #ff2d78, border: 1px solid rgba(255,45,120,0.3)

Resolution tag (absolute, top 10px, right 10px):
  - padding 3px 8px, border-radius 10px, font-size 0.6rem, color #94a3b8
  - background rgba(10,18,40,0.75), border: 1px solid rgba(255,255,255,0.08)

Body (padding 14px, display flex, flex-direction column, gap 8px):
  - Title: font-size 0.88rem, font-weight 600, color #f8fafc, white-space nowrap, overflow hidden, text-overflow ellipsis
  - Anime series: font-size 0.74rem, color #94a3b8, truncated
  - Tags row: display flex, gap 6px, flex-wrap wrap
    Each tag: padding 2px 8px, border-radius 20px, font-size 0.62rem, color #00f3ff, border: 1px solid rgba(0,243,255,0.2), background rgba(0,243,255,0.05)
  - Rating row: display flex, align-items center, gap 6px, font-size 0.78rem, color #94a3b8
    Star: color #f59e0b
  - Price + button row: display flex, justify-content space-between, align-items center, margin-top auto
    Price: font-size 1.05rem, font-weight 700, color #f8fafc
    "Add to Cart" button: padding 8px 16px, border-radius 10px, border: 1px solid #00f3ff, background transparent, color #00f3ff, font-size 0.78rem, font-weight 600, cursor pointer, transition all 0.2s, white-space nowrap
    Button hover: background rgba(0,243,255,0.12), box-shadow 0 0 14px rgba(0,243,255,0.25)
    Button active: transform scale(0.96)

On "Add to Cart" click:
  - Call addToCart(product) from useCart
  - Call addToast(\`✦ \${product.title} added to cart!\`, 'success') from useToast
  - Briefly animate the button (use a flash state: set isAdding true for 600ms, show "✓ Added" with green tint during that time)

Export default.

────────────────────────────────────────
FILE 13: src/components/CartSidebar.jsx
────────────────────────────────────────
Import useCart from '../hooks/useCart'.
Import useToast from '../hooks/useToast'.
Import { formatPrice } from '../utils/formatters'.

Props: isOpen (bool), onClose (function)

Outer wrapper: fixed, top 0, right 0, height 100vh, width 400px (100vw on mobile), z-index 1000.
  transform: translateX(100%) when closed, translateX(0) when open.
  transition: transform 0.35s cubic-bezier(0.4,0,0.2,1).
  background: rgba(10,18,40,0.96), backdrop-filter blur(24px).
  border-left: 1px solid rgba(0,243,255,0.12).
  display flex, flex-direction column.

Backdrop: when isOpen, render a fixed inset-0 div, z-index 999, background rgba(0,0,0,0.5), onClick onClose. Backdrop has opacity transition.

Header (flex row, padding 20px 24px, border-bottom: 1px solid rgba(255,255,255,0.06)):
  - Left: "Cart" font-size 1rem, font-weight 700, color #f8fafc. Beside it: count pill (background rgba(0,243,255,0.12), color #00f3ff, border-radius 20px, padding 2px 10px, font-size 0.72rem, font-weight 700). Show getCartCount() in pill.
  - Right: "×" button — 32px × 32px, border-radius 8px, border: 1px solid rgba(255,255,255,0.08), background transparent, color #94a3b8, font-size 1.1rem, cursor pointer. Hover: color #f8fafc.

Content area (flex 1, overflow-y auto, padding 16px 24px):
  If cart is empty:
    Center vertically and horizontally. 
    - 🛒 emoji at 2.5rem.
    - "Your cart is empty" color #f8fafc, font-size 0.95rem, font-weight 600, margin-top 12px.
    - "Browse our anime wallpapers" color #94a3b8, font-size 0.8rem.
    - "Browse Store" button: margin-top 16px, padding 10px 24px, border-radius 12px, border: 1px solid #00f3ff, background transparent, color #00f3ff, font-size 0.85rem, cursor pointer. onClick: onClose().

  If cart has items: render each item as a row (display flex, gap 12px, padding 12px 0, border-bottom: 1px solid rgba(255,255,255,0.04)):
    - Image: 60px × 60px, border-radius 10px, object-fit cover, flex-shrink 0.
    - Info column (flex 1, min-width 0):
      - Title: font-size 0.82rem, font-weight 600, color #f8fafc, white-space nowrap, overflow hidden, text-overflow ellipsis.
      - Anime: font-size 0.72rem, color #94a3b8.
      - Quantity controls row: display flex, align-items center, gap 8px, margin-top 8px.
        "−" and "+" buttons: 26px × 26px, border-radius 6px, border: 1px solid rgba(0,243,255,0.2), background rgba(0,243,255,0.05), color #00f3ff, font-size 0.9rem, cursor pointer.
          "−" onClick: updateCartQty(item.id, item.qty - 1)
          "+" onClick: updateCartQty(item.id, item.qty + 1)
        Qty number: font-size 0.85rem, color #f8fafc, min-width 20px, text-align center.
    - Right column: display flex, flex-direction column, align-items flex-end, gap 8px.
      - Price: font-size 0.88rem, font-weight 700, color #00f3ff.
      - Remove "✕": font-size 0.72rem, color #94a3b8, cursor pointer, background none, border none, hover color #ff2d78.
        onClick: removeFromCart(item.id)

Footer (padding 20px 24px, border-top: 1px solid rgba(255,255,255,0.06), display flex, flex-direction column, gap 12px):
  - Subtotal row: justify-content space-between.
    "Subtotal" — color #94a3b8, font-size 0.88rem.
    Total value — color #f8fafc, font-weight 700, font-size 1rem. Computed: formatPrice(getCartTotal()).
  - "Checkout" button: width 100%, padding 14px, border-radius 12px, border none, background: linear-gradient(135deg,#00f3ff,#7c3aed), color #020617 (dark text for contrast), font-weight 700, font-size 0.9rem, cursor pointer, transition all 0.25s.
    Hover: filter brightness(1.1), transform translateY(-1px), box-shadow 0 8px 24px rgba(0,243,255,0.25).
    onClick: addToast('🎉 Order placed! (Demo mode — backend coming soon)', 'success'), then clearCart().
  - "Clear Cart" text-button: text-align center, font-size 0.78rem, color #94a3b8, cursor pointer, background none, border none. Hover: color #ff2d78.
    onClick: clearCart(), addToast('Cart cleared', 'info').

Cart item fields expected: id, title, anime (or series), imageUrl (or img), price, qty.
Note: products may have field 'img' (old) or 'imageUrl' (new). Always show whichever is defined: item.imageUrl || item.img.

Export default.

────────────────────────────────────────
FILE 14: src/components/Navbar.jsx
────────────────────────────────────────
Import useAuth from '../hooks/useAuth'.
Import useCart from '../hooks/useCart'.
Import useContext and NavigationContext from '../App'.
Import CartSidebar from './CartSidebar'.
Import { getInitials } from '../utils/formatters'.

Local state: isCartOpen (bool), isMobileMenuOpen (bool).

Outer: fixed top 0, left 0, width 100%, height 64px, z-index 500.
  background: rgba(2,6,23,0.88), backdrop-filter blur(20px).
  border-bottom: 1px solid rgba(0,243,255,0.07).

Inner: max-width 1280px, margin 0 auto, height 100%, padding 0 32px, display flex, justify-content space-between, align-items center.

Left — Logo:
  "✦ AniCart" — background: linear-gradient(135deg,#00f3ff,#7c3aed), -webkit-background-clip text, -webkit-text-fill-color transparent, font-size 1.2rem, font-weight 800, cursor pointer.
  onClick: navigate('landing').

Center (desktop only — display none on mobile ≤768px) — Nav links:
  If NOT authenticated: "Store" → navigate('dashboard'), "Login" → navigate('login'), "Sign Up" → navigate('signup').
  If authenticated: "Store" → navigate('dashboard'), "Dashboard" (same), no Login/Signup.
  Link styles: font-size 0.85rem, color #94a3b8, cursor pointer, background none, border none, padding 6px 12px, border-radius 8px, transition all 0.2s.
  Hover: color #f8fafc, background rgba(255,255,255,0.04).

Right — Actions:
  Cart icon button:
    Position relative. Content: 🛒 or an SVG cart icon, font-size 1.2rem.
    Style: 40px × 40px, border-radius 10px, border: 1px solid rgba(0,243,255,0.15), background transparent, color #94a3b8, cursor pointer, transition all 0.2s.
    Hover: color #00f3ff, border-color rgba(0,243,255,0.4), background rgba(0,243,255,0.06).
    Count badge: if getCartCount() > 0, show absolute top -6px, right -6px badge — 18px × 18px, border-radius 50%, background #ff2d78, color white, font-size 0.6rem, font-weight 700, display flex, align-items center, justify-content center.
    Badge animation: when count changes, apply a brief scale(1.3) → scale(1) CSS animation (0.3s).
    onClick: setIsCartOpen(true).

  If authenticated:
    Avatar circle (36px × 36px, border-radius 50%, background rgba(0,243,255,0.1), border: 1.5px solid rgba(0,243,255,0.3), color #00f3ff, font-size 0.75rem, font-weight 700, display flex, align-items center, justify-content center, cursor pointer, margin-left 10px).
    Content: getInitials(user.username || user.email).
    onClick: navigate('dashboard') — goes to profile tab (pass 'profile' as tab hint via localStorage or a custom event — simplest: just navigate to dashboard).

    Logout button (only on desktop): small text button "Logout" — font-size 0.78rem, color #94a3b8, background none, border none, cursor pointer, margin-left 8px.
    Hover: color #ff2d78.
    onClick: logout(), addToast('Logged out. See you next time! 👋', 'info').

  Hamburger (mobile only ≤768px, display none on desktop):
    Three lines icon or "☰". 40px × 40px, background transparent, border: 1px solid rgba(255,255,255,0.08), border-radius 8px, color #94a3b8, cursor pointer.
    onClick: toggle isMobileMenuOpen.

Mobile menu (when isMobileMenuOpen):
  Fixed top 64px, left 0, width 100%, background rgba(2,6,23,0.97), border-bottom: 1px solid rgba(0,243,255,0.1), padding 20px, z-index 499, display flex, flex-direction column, gap 8px.
  Same nav links as desktop center, but larger padding (12px 16px).
  When any link clicked: close mobile menu + navigate.

CartSidebar rendered here:
  <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

Export default.

────────────────────────────────────────
FILE 15: src/App.css
────────────────────────────────────────
Write the COMPLETE CSS file. Every rule must be fully written out — no comments like "same as before".

Include these sections in order:

/* ── 1. CSS VARIABLES ── */
:root {
  --bg-deep: #020617;
  --bg-card: rgba(15, 23, 42, 0.6);
  --glass: rgba(15, 23, 42, 0.6);
  --glass-heavy: rgba(10, 18, 40, 0.92);
  --neon: #00f3ff;
  --neon-dim: rgba(0, 243, 255, 0.12);
  --neon-glow: 0 0 20px rgba(0,243,255,0.3), 0 0 60px rgba(0,243,255,0.08);
  --pink: #ff2d78;
  --pink-dim: rgba(255, 45, 120, 0.12);
  --pink-glow: 0 0 20px rgba(255,45,120,0.3), 0 0 60px rgba(255,45,120,0.08);
  --purple: #7c3aed;
  --text: #f8fafc;
  --muted: #94a3b8;
  --radius-card: 16px;
  --radius-btn: 12px;
  --radius-input: 12px;
  --transition: all 0.25s ease;
  --font: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

/* ── 2. GLOBAL RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; -webkit-font-smoothing: antialiased; }
body { font-family: var(--font); background: var(--bg-deep); color: var(--text); min-height: 100vh; overflow-x: hidden; }
img { max-width: 100%; display: block; }
button { cursor: pointer; font-family: inherit; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; }

/* ── 3. SCROLLBAR ── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: #080f1e; }
::-webkit-scrollbar-thumb { background: rgba(0,243,255,0.25); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,243,255,0.5); }

/* ── 4. GLASSMORPHISM UTILITIES ── */
.glass { background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.06); }
.glass-card { background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-card); padding: 24px; }
.glass-heavy { background: var(--glass-heavy); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.06); }

/* ── 5. BUTTON SYSTEM ── */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: none; border-radius: var(--radius-btn); font-size: 0.9rem; font-weight: 600; padding: 10px 22px; transition: var(--transition); cursor: pointer; font-family: var(--font); }
.btn:active { transform: scale(0.97); }
.btn-neon { background: transparent; border: 1px solid var(--neon); color: var(--neon); }
.btn-neon:hover { background: var(--neon-dim); box-shadow: var(--neon-glow); transform: translateY(-1px); }
.btn-pink { background: transparent; border: 1px solid var(--pink); color: var(--pink); }
.btn-pink:hover { background: var(--pink-dim); box-shadow: var(--pink-glow); transform: translateY(-1px); }
.btn-ghost { background: transparent; border: none; color: var(--muted); }
.btn-ghost:hover { color: var(--text); }
.btn-gradient { background: linear-gradient(135deg, var(--neon), var(--purple)); color: #020617; border: none; font-weight: 700; }
.btn-gradient:hover { filter: brightness(1.1); transform: translateY(-1px) scale(1.01); box-shadow: 0 8px 24px rgba(0,243,255,0.25); }
.btn-solid-pink { background: var(--pink); color: white; border: none; }
.btn-solid-pink:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* ── 6. INPUT SYSTEM ── */
.glass-input { background: rgba(15,23,42,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-input); color: var(--text); padding: 12px 16px; font-size: 0.9rem; width: 100%; transition: var(--transition); outline: none; font-family: var(--font); }
.glass-input:focus { border-color: var(--neon); box-shadow: 0 0 0 2px rgba(0,243,255,0.1); }
.glass-input::placeholder { color: var(--muted); }
.input-group { display: flex; flex-direction: column; gap: 6px; }
.input-label { font-size: 0.8rem; color: var(--muted); font-weight: 500; }

/* ── 7. GRID & LAYOUT ── */
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; } }
@media (max-width: 768px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; } .container { padding: 0 16px; } }
@media (max-width: 480px) { .product-grid { grid-template-columns: 1fr 1fr; gap: 10px; } }

/* ── 8. TOAST SYSTEM ── */
.toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9998; display: flex; flex-direction: column; gap: 10px; max-width: 340px; }
.toast { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-radius: 12px; background: rgba(15,23,42,0.92); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem; color: var(--text); animation: toastSlideIn 0.35s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
.toast.success { border-left: 3px solid var(--neon); }
.toast.error { border-left: 3px solid var(--pink); }
.toast.warning { border-left: 3px solid #f59e0b; }
.toast.info { border-left: 3px solid var(--purple); }
.toast-icon { font-size: 1rem; flex-shrink: 0; }
.toast.success .toast-icon { color: var(--neon); }
.toast.error .toast-icon { color: var(--pink); }
.toast.warning .toast-icon { color: #f59e0b; }
.toast.info .toast-icon { color: var(--purple); }
.toast-msg { flex: 1; line-height: 1.4; }
.toast-close { background: none; border: none; color: var(--muted); font-size: 0.8rem; cursor: pointer; padding: 2px 4px; border-radius: 4px; flex-shrink: 0; }
.toast-close:hover { color: var(--text); }
@keyframes toastSlideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

/* ── 9. BACKGROUND EFFECTS ── */
.scanline { position: fixed; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); pointer-events: none; z-index: 1; }
.cursor-glow { position: fixed; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(0,243,255,0.06) 0%, transparent 70%); transform: translate(-50%, -50%); pointer-events: none; z-index: 0; transition: left 0.08s, top 0.08s; }
.starfield { position: fixed; inset: 0; background-image: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 40% 85%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 90% 50%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,0.5) 0%, transparent 100%); pointer-events: none; z-index: 0; }
.nebula { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.nebula-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.07; animation: nebulaFloat 20s ease-in-out infinite; }
.nebula-blob:nth-child(1) { width: 600px; height: 600px; background: radial-gradient(circle, #7c3aed, transparent); top: -200px; left: -100px; animation-delay: 0s; }
.nebula-blob:nth-child(2) { width: 500px; height: 500px; background: radial-gradient(circle, #00f3ff, transparent); top: 40%; right: -150px; animation-delay: -7s; }
.nebula-blob:nth-child(3) { width: 400px; height: 400px; background: radial-gradient(circle, #ff2d78, transparent); bottom: -100px; left: 30%; animation-delay: -14s; }
@keyframes nebulaFloat { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.05); } 66% { transform: translate(-20px,15px) scale(0.95); } }

/* ── 10. BADGE SYSTEM ── */
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.badge-neon { background: var(--neon-dim); color: var(--neon); border: 1px solid rgba(0,243,255,0.3); }
.badge-pink { background: var(--pink-dim); color: var(--pink); border: 1px solid rgba(255,45,120,0.3); }

/* ── 11. TEXT UTILITIES ── */
.text-neon { color: var(--neon); }
.text-pink { color: var(--pink); }
.text-muted { color: var(--muted); }
.gradient-text { background: linear-gradient(135deg, var(--neon), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.text-center { text-align: center; }

/* ── 12. PAGE TRANSITIONS ── */
@keyframes pageEnter { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.page-enter { animation: pageEnter 0.45s ease; }

/* ── 13. SKELETON SHIMMER ── */
@keyframes shimmerMove { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(0,243,255,0.06) 50%, rgba(255,255,255,0.03) 75%); background-size: 200% 100%; animation: shimmerMove 1.6s infinite linear; border-radius: 8px; }

/* ── 14. SECTION HELPERS ── */
.section { padding: 80px 0; }
.section-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; }
.section-subtitle { color: var(--muted); font-size: 0.95rem; margin-bottom: 40px; }

/* ── 15. NAVBAR PADDING OFFSET ── */
.page-content { padding-top: 64px; }

/* ── 16. RESPONSIVE VISIBILITY ── */
.desktop-only { display: flex; }
.mobile-only { display: none; }
@media (max-width: 768px) { .desktop-only { display: none !important; } .mobile-only { display: flex !important; } }

/* ── 17. GLOW PULSE ── */
@keyframes glowPulse { 0%, 100% { box-shadow: 0 0 12px rgba(0,243,255,0.2); } 50% { box-shadow: 0 0 28px rgba(0,243,255,0.5); } }
.glow-pulse { animation: glowPulse 2.5s ease infinite; }

/* ── 18. CART BADGE BOUNCE ── */
@keyframes badgeBounce { 0% { transform: scale(1); } 40% { transform: scale(1.4); } 100% { transform: scale(1); } }
.badge-bounce { animation: badgeBounce 0.35s ease; }

/* ── 19. FILTER BAR ── */
.filter-bar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.filter-pill { padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: var(--muted); font-size: 0.8rem; cursor: pointer; transition: var(--transition); white-space: nowrap; }
.filter-pill:hover, .filter-pill.active { border-color: var(--neon); color: var(--neon); background: var(--neon-dim); }
.filter-pill.pink-active { border-color: var(--pink); color: var(--pink); background: var(--pink-dim); }

/* ── 20. EMPTY STATE ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 32px; text-align: center; gap: 12px; }
.empty-state-icon { font-size: 3rem; opacity: 0.6; }
.empty-state-title { font-size: 1rem; font-weight: 600; color: var(--text); }
.empty-state-subtitle { font-size: 0.85rem; color: var(--muted); }

────────────────────────────────────────
FILE 16: src/App.js
────────────────────────────────────────
Write the COMPLETE App.js. Preserve the existing architecture exactly — only upgrade it.

IMPORTS:
  React, { useState, useEffect, createContext, useContext, useCallback, useMemo, lazy, Suspense } from 'react'
  './App.css'
  WALLPAPERS from './data/wallpapers'
  { loadFromStorage, saveToStorage, removeFromStorage } from './utils/storage'
  Loader from './components/Loader'
  ScrollToTop from './components/ScrollToTop'
  NotFound from './components/NotFound'
  LandingPage from './pages/LandingPage'  (lazy load this)
  LoginPage from './pages/LoginPage'       (lazy load this)
  SignupPage from './pages/SignupPage'     (lazy load this)
  Dashboard from './pages/Dashboard'      (lazy load this)

Use React.lazy for all 4 page imports.

EXPORTS (keep at module level, before App function):
  export const AuthContext = createContext(null)
  export const CartContext = createContext(null)
  export const ToastContext = createContext(null)
  export const NavigationContext = createContext(null)
  export const ProductsContext = createContext(null)

PAGES constant:
  { LANDING:'landing', LOGIN:'login', SIGNUP:'signup', DASHBOARD:'dashboard', NOTFOUND:'notfound' }

ToastContainer component (same as existing — keep it):
  Render toast divs with icons. Add a close button per toast.

BackgroundEffects component (same as existing — keep it):
  Mouse tracking cursor glow + scanline + starfield + nebula blobs.

App function:
  State:
    currentPage → 'landing'
    user → null
    cart → []
    toasts → []
    isAppLoading → true

  On mount (useEffect []):
    Load user and cart from storage using loadFromStorage.
    After setting state: setTimeout(() => setIsAppLoading(false), 1000).

  Cart helpers (all useCallback, all update cart state + persist via saveToStorage('anicart_cart', newCart)):
    addToCart(product): if item with same id exists, increment qty by 1; else push { ...product, qty: 1 }.
    removeFromCart(productId): filter out item where id === productId.
    updateCartQty(productId, qty): if qty <= 0, remove; else update qty.
    clearCart(): set cart to []. Also removeFromStorage('anicart_cart').

  Cart memos:
    getCartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart])
    getCartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])

  Auth helpers (all useCallback):
    login(userData): enriched = { ...userData, joinedAt: new Date().toISOString() }. setUser(enriched). saveToStorage('anicart_user', enriched).
    logout(): setUser(null). setCart([]). removeFromStorage('anicart_user'). removeFromStorage('anicart_cart'). removeFromStorage('anicart_token'). navigate('landing').
    updateProfile(fields): setUser(prev => { const updated = { ...prev, ...fields }; saveToStorage('anicart_user', updated); return updated; }).

  Toast helpers (same as existing):
    addToast(message, type='info'): generate id, push to toasts, auto-remove after 4000ms.
    removeToast(id): filter from toasts.

  Navigation:
    navigate(page) → setCurrentPage(page) + window.scrollTo({top:0, behavior:'smooth'}).
    NavigationContext value includes: { currentPage, navigate, goToLanding: ()=>navigate('landing'), goToLogin: ()=>navigate('login'), goToSignup: ()=>navigate('signup'), goToDashboard: ()=>navigate('dashboard'), goToNotFound: ()=>navigate('notfound') }

  renderPage():
    switch(currentPage):
      'landing' → <LandingPage />
      'login' → <LoginPage />
      'signup' → <SignupPage />
      'dashboard' → user ? <Dashboard /> : (navigate('login'), null)
      'notfound' → <NotFound />
      default → <NotFound />

  Return:
    If isAppLoading: return <Loader fullscreen />

    Otherwise:
    <ProductsContext.Provider value={{ products: WALLPAPERS }}>
      <AuthContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated: !!user }}>
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQty, clearCart, getCartTotal, getCartCount }}>
          <ToastContext.Provider value={{ addToast, removeToast }}>
            <NavigationContext.Provider value={...}>
              <div style={{ position:'relative', minHeight:'100vh' }}>
                <BackgroundEffects />
                <Suspense fallback={<Loader fullscreen />}>
                  <div className="page-enter" key={currentPage}>
                    {renderPage()}
                  </div>
                </Suspense>
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <ScrollToTop />
              </div>
            </NavigationContext.Provider>
          </ToastContext.Provider>
        </CartContext.Provider>
      </AuthContext.Provider>
    </ProductsContext.Provider>

────────────────────────────────────────
FILE 17: src/pages/LandingPage.jsx
────────────────────────────────────────
Import useContext and NavigationContext, ProductsContext from '../App'.
Import Navbar from '../components/Navbar'.
Import Footer from '../components/Footer'.
Import ProductCard from '../components/ProductCard'.
Import WALLPAPERS from '../data/wallpapers' (as fallback if context unavailable).
Import { formatPrice } from '../utils/formatters'.

Keep the ENTIRE existing visual design of LandingPage.
Only make these targeted improvements:

1. Render <Navbar /> as the very first element.
2. Add className="page-content" to the main content wrapper (for 64px padding-top offset).
3. Hero section CTA buttons:
   - "Explore Store" → calls navigate('dashboard').
   - "Login" / "Sign Up" nav links → call goToLogin() and goToSignup().
   - Any "Get Started" button → navigate('dashboard').
4. Featured wallpapers section (if it exists): use WALLPAPERS.slice(0,3) from ProductsContext. Render <ProductCard product={wp} /> for each. If the section doesn't exist, add it: a section titled "Featured Wallpapers" with 3 ProductCards in a row.
5. Add a stats banner section (if not already present):
   3 stats in a glass card row: "12+ Wallpapers" / "4K Ultra HD Quality" / "Instant Download".
   Style as 3 glass pill cards with neon text for the number.
6. Render <Footer /> as the last element.
7. Wrap entire return in <div className="page-enter">.
8. Every nav link / button must call NavigationContext functions — zero dead buttons.

────────────────────────────────────────
FILE 18: src/pages/LoginPage.jsx
────────────────────────────────────────
Import useContext, AuthContext, ToastContext, NavigationContext from '../App'.
Import Navbar from '../components/Navbar'.
Import { saveToStorage } from '../utils/storage'.

Keep the ENTIRE existing visual design of LoginPage.
Only make these targeted fixes:

1. Render <Navbar /> as first element.
2. Add className="page-content" to outer wrapper.
3. Form state: email (string), password (string), isLoading (bool).
4. Validation on submit:
   - If !email || !password → addToast('Please fill in all fields', 'warning'). Return.
   - If email doesn't include '@' → addToast('Enter a valid email', 'warning'). Return.
5. Mock login on submit (no backend yet):
   - setIsLoading(true).
   - await new Promise(r => setTimeout(r, 900)) — simulate network.
   - Create mock user: { id: 'demo_' + Date.now(), username: email.split('@')[0], email, firstName: '', lastName: '', stats: { ordersCount: 3, lifetimeValue: 24.97, activityScore: 72, referrals: 1 } }.
   - Call login(mockUser) from AuthContext.
   - saveToStorage('anicart_token', 'demo_token_' + Date.now()).
   - addToast('Welcome back! 🎌', 'success').
   - navigate('dashboard').
   - setIsLoading(false).
6. Submit button: show "Signing in…" when isLoading, disabled when isLoading. Add a loading spinner inside the button while loading.
7. "Don't have an account? Sign Up" → calls goToSignup(). Must work.
8. "Back" or logo click → calls goToLanding().
9. Wrap return in <div className="page-enter">.

────────────────────────────────────────
FILE 19: src/pages/SignupPage.jsx
────────────────────────────────────────
Import same as LoginPage.

Keep the ENTIRE existing visual design of SignupPage.
Only make these targeted fixes:

1. Render <Navbar /> as first element.
2. Add className="page-content".
3. Form state: email, username, password, confirmPassword (if field exists), isLoading.
4. Validation on submit:
   - All required fields must be non-empty → addToast('Please fill in all fields', 'warning').
   - Email must include '@'.
   - Password length >= 6 → addToast('Password must be at least 6 characters', 'warning').
   - If confirmPassword field exists and doesn't match password → addToast('Passwords do not match', 'error').
   - Username length >= 3.
5. Mock signup on submit:
   - setIsLoading(true).
   - await new Promise(r => setTimeout(r, 1100)).
   - Create user: { id: 'user_' + Date.now(), username, email, firstName: '', lastName: '', stats: { ordersCount: 0, lifetimeValue: 0, activityScore: 50, referrals: 0 } }.
   - Call login(newUser).
   - saveToStorage('anicart_token', 'demo_token_' + Date.now()).
   - addToast('Account created! Welcome to AniCart 🎉', 'success').
   - navigate('dashboard').
   - setIsLoading(false).
6. Submit button: "Creating Account…" while loading, disabled.
7. "Already have an account? Login" → goToLogin(). Must work.
8. Wrap in <div className="page-enter">.

────────────────────────────────────────
FILE 20: src/pages/Dashboard.jsx
────────────────────────────────────────
Import useContext from react.
Import AuthContext, CartContext, ToastContext, NavigationContext, ProductsContext from '../App'.
Import useCart from '../hooks/useCart'.
Import useToast from '../hooks/useToast'.
Import Navbar from '../components/Navbar'.
Import Footer from '../components/Footer'.
Import ProductCard from '../components/ProductCard'.
Import SkeletonCard from '../components/SkeletonCard'.
Import { formatPrice, formatRating, formatCount, truncate } from '../utils/formatters'.

Keep the ENTIRE existing visual design. Make these targeted improvements:

PAGE GUARD: At the top of the component, get user from AuthContext. If !user, call navigate('login') and return null.

TABS: The dashboard has tabs. Ensure these tab names exist and all work:
  "Store", "My Orders", "Profile"
  Active tab state: activeTab (string), default 'store'.
  Tab switching: clicking each tab sets activeTab.

STORE TAB content:
  a) Search + Filter bar above the product grid:
     - Search input (glass-input class): state searchQuery. Filters wallpapers by title or anime (case-insensitive). Placeholder: "Search wallpapers…".
     - Tag filter pills: collect all unique tags from WALLPAPERS. Render a pill for each. "All" pill resets selectedTag to null. Active pill has 'active' class. State: selectedTag (string|null).
     - Sort dropdown (glass-input): options "Newest", "Price: Low to High", "Price: High to Low", "Top Rated". State: sortBy.
  b) Filter + sort the product list:
     filtered = WALLPAPERS filtered by searchQuery AND selectedTag.
     sorted = filtered sorted by sortBy.
  c) Loading skeletons: isLoadingProducts state (default true), set to false after 800ms in useEffect [].
     While loading: render 8 <SkeletonCard /> in .product-grid.
     After loading: render <ProductCard product={wp} key={wp.id} /> for each item in sorted array.
  d) Empty state (if sorted.length === 0 and !isLoadingProducts): show .empty-state with 🔍 icon, "No wallpapers found", "Try a different filter", and a "Clear Filters" button that resets searchQuery and selectedTag.

MY ORDERS TAB content:
  Show a glass card with a demo orders list. Hardcode 2-3 sample orders like:
    Order #ANI-001 — Nezuko Bamboo Blossom, Gojo Infinity Veil — $12.98 — Completed
    Order #ANI-002 — Luffy Gear Fifth — $5.49 — Processing
  Each order: glass card, order number in neon, items in muted, price in white, status badge.
  "No orders yet" empty state if orders array is empty (keep the demo orders for now).

PROFILE TAB content:
  Keep the existing profile design. Wire these actions:
  a) Display: user.username, user.email, user.firstName, user.lastName.
  b) Edit form: firstName, lastName fields (prefilled from user). "Save Profile" button calls updateProfile({ firstName, lastName }) from AuthContext, then addToast('Profile updated! ✦', 'success').
  c) Stats cards: ordersCount, lifetimeValue (formatted as price), activityScore, referrals — all from user.stats.
  d) "Logout" button: calls logout() from AuthContext. Must work and redirect to landing.

NAVBAR: Render <Navbar /> as first element.
FOOTER: Render <Footer /> after the main content.
Wrap entire return in <div className="page-enter">.

══════════════════════════════════════════════════════════════
SECTION 3 — FINAL CHECKLIST (verify every item before finishing)
══════════════════════════════════════════════════════════════

Before outputting any file, confirm:
□ WALLPAPERS has 12 entries with all required fields
□ All 5 contexts exported from App.js
□ All pages use <Navbar /> and <Footer />
□ No page has a dead button (every onClick leads somewhere or does something)
□ Cart sidebar slides in/out when cart icon clicked
□ Add to Cart shows a toast
□ Checkout button clears cart and shows success toast
□ Login creates a mock user and navigates to dashboard
□ Signup creates a mock user and navigates to dashboard
□ Logout clears storage, resets state, navigates to landing
□ Profile save calls updateProfile and shows toast
□ Dashboard guard: unauthenticated users redirected to login
□ Product search and tag filters work in Dashboard Store tab
□ Sort dropdown works
□ Skeleton cards show for 800ms on Dashboard load
□ Empty state shown when no search results
□ Scroll to top button appears after 300px scroll
□ Page entrance animation applied to all 4 pages
□ Footer rendered on Landing and Dashboard
□ Mobile hamburger menu works in Navbar
□ Cart count badge in Navbar updates live
□ No raw localStorage calls — all through storage.js utils
□ No inline PRODUCTS_DATA — only WALLPAPERS from data/wallpapers.js
□ React.lazy used for all 4 page imports
□ Suspense wraps the page render with Loader fallback

Now output all 20 files in order. Complete code. No placeholders.
````
