import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useCart, useToast, useNavigation } from '../App';

// ═══ NAVBAR ═══
function Navbar({ cartOpen, setCartOpen }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { navigate, PAGES } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className="navbar" style={{
      boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      borderBottomColor: scrolled ? 'rgba(0,243,255,0.15)' : 'rgba(0,243,255,0.08)',
    }}>
      {/* Logo */}
      <div className="nav-logo" onClick={() => navigate(PAGES.LANDING)}>
        ANI<span>CART</span>
      </div>

      {/* Desktop links */}
      <ul className="nav-links" style={{ display: window.innerWidth < 600 && mobileOpen ? 'none' : 'flex' }}>
        <li><a onClick={() => navigate(PAGES.LANDING)}>Home</a></li>
        <li><a onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>Store</a></li>
        <li><a onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</a></li>

        {user ? (
          <>
            <li>
              <button className="nav-btn-outline" onClick={() => navigate(PAGES.DASHBOARD)}>
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setCartOpen(!cartOpen)}
                style={{
                  position: 'relative', background: 'none', border: '1px solid var(--glass-border)',
                  borderRadius: 8, padding: '8px 16px', color: 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600, fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase',
                }}
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                    background: 'var(--pink)', borderRadius: '50%', fontSize: '0.7rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron, monospace', fontWeight: 700, color: 'white',
                  }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 8, color: 'var(--text-secondary)',
                  fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                  letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 8px',
                }}
                onClick={logout}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--neon), var(--purple-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Orbitron, monospace', fontWeight: 800, fontSize: '0.8rem',
                  color: 'var(--bg-void)',
                }}>
                  {user.avatar}
                </div>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><button className="nav-btn-outline" onClick={() => navigate(PAGES.LOGIN)}>Login</button></li>
            <li><button className="nav-btn-solid" onClick={() => navigate(PAGES.SIGNUP)}>Sign Up</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

// ═══ CART SIDEBAR ═══
function CartSidebar({ open, onClose }) {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
  const { navigate, PAGES } = useNavigation();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleCheckout = () => {
    if (!user) { navigate(PAGES.LOGIN); addToast('Please log in to checkout.', 'warning'); return; }
    if (cart.length === 0) { addToast('Your cart is empty!', 'warning'); return; }
    addToast(`Order placed! Total: $${cartTotal.toFixed(2)} 🎉 (Demo Mode)`, 'success');
    clearCart();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200,
          opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none', transition: 'opacity 0.3s',
        }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, zIndex: 201,
        background: 'rgba(5,13,31,0.98)', backdropFilter: 'blur(20px)',
        borderLeft: '1px solid var(--glass-border)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: 700,
              color: 'var(--neon)' }}>Shopping Cart</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.8rem',
              letterSpacing: '2px', color: 'var(--text-muted)', marginTop: 2 }}>
              DATABANK ACQUISITION
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--glass-border)', borderRadius: 8,
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s',
          }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem',
                color: 'var(--text-muted)', marginBottom: 8 }}>Cart is empty</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Add some wallpapers from the store!
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{
                display: 'flex', gap: 12, padding: '12px', borderRadius: 12,
                background: 'rgba(15,23,42,0.5)', border: '1px solid var(--glass-border)',
                marginBottom: 10,
              }}>
                <img src={item.img} alt={item.name} style={{
                  width: 64, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                    fontSize: '0.9rem', color: 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {item.series}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{
                        width: 24, height: 24, borderRadius: 6, background: 'var(--glass-light)',
                        border: '1px solid var(--glass-border)', color: 'var(--text-primary)',
                        cursor: 'pointer', fontSize: '0.9rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>−</button>
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.85rem',
                        color: 'var(--neon)', minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{
                        width: 24, height: 24, borderRadius: 6, background: 'var(--glass-light)',
                        border: '1px solid var(--glass-border)', color: 'var(--text-primary)',
                        cursor: 'pointer', fontSize: '0.9rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>+</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem',
                        color: 'var(--neon)', fontWeight: 700 }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} style={{
                        background: 'none', border: 'none', color: 'var(--pink)',
                        cursor: 'pointer', fontSize: '0.85rem', padding: '2px 4px',
                      }}>✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16,
              alignItems: 'center' }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
                color: 'var(--text-secondary)', letterSpacing: '1px', fontSize: '0.9rem' }}>TOTAL</span>
              <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.3rem',
                fontWeight: 800, color: 'var(--neon)', textShadow: 'var(--neon-text-glow)' }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <button className="btn-primary btn-full" onClick={handleCheckout}>
              ◈ Proceed to Checkout
            </button>
            <button onClick={clearCart} style={{
              width: '100%', marginTop: 8, background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif',
              fontSize: '0.85rem', padding: '8px', transition: 'all 0.2s',
            }}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ═══ PRODUCT CARD ═══
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { navigate, PAGES } = useNavigation();
  const { addToast } = useToast();

  const handleAdd = () => {
    if (!user) {
      addToast('Please log in to add items to cart!', 'warning');
      navigate(PAGES.LOGIN);
      return;
    }
    addToCart(product);
  };

  return (
    <div className="glass-card product-card">
      <div className="product-img-wrap">
        <img src={product.img} alt={product.name} loading="lazy" />
        {product.badge && (
          <div className={`product-badge ${product.badgeType === 'pink' ? 'pink' : ''}`}>
            {product.badge}
          </div>
        )}
        <div className="product-overlay">
          <button className="product-quick-add" onClick={handleAdd}>
            + ADD TO CART
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-series">{product.series} · {product.resolution}</div>
        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>
          <div className="product-rating">
            ★ {product.rating}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ FEATURES DATA ═══
const FEATURES = [
  {
    icon: '⚡', color: 'neon',
    title: 'Ultra HD Wallpapers',
    desc: 'Download stunning 4K and 8K anime wallpapers crafted by top artists from around the world.',
  },
  {
    icon: '🔐', color: 'pink',
    title: 'Secure Authentication',
    desc: 'Military-grade encryption protects your account and payment data. Your privacy is paramount.',
  },
  {
    icon: '🛒', color: 'purple',
    title: 'Smart Cart System',
    desc: 'Add, remove, and manage your picks instantly. Lightning-fast checkout with one tap.',
  },
  {
    icon: '🌌', color: 'neon',
    title: 'New Drops Weekly',
    desc: 'Fresh anime artwork added every week. Be the first to grab exclusive limited edition packs.',
  },
  {
    icon: '📱', color: 'pink',
    title: 'Cross-Device Access',
    desc: 'Your collection syncs seamlessly across desktop, tablet, and mobile. Always with you.',
  },
  {
    icon: '♾️', color: 'purple',
    title: 'Lifetime License',
    desc: 'Pay once, use forever. Every wallpaper comes with a personal use license.',
  },
];

// ═══ COUNTER ANIMATION ═══
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ═══ MAIN LANDING PAGE ═══
export default function LandingPage() {
  const { navigate, PAGES } = useNavigation();
  const { products } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Jujutsu Kaisen', 'Attack on Titan', 'Demon Slayer', 'One Piece', 'Naruto'];

  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter((p) => p.series === activeFilter);

  return (
    <div className="landing-page">
      <Navbar cartOpen={cartOpen} setCartOpen={setCartOpen} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ─── HERO ─── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            ◈ The Ultimate Anime Store is Live
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line1">Enter the</span>
            <span className="hero-title-line2">Anime Universe</span>
          </h1>

          <p className="hero-desc">
            Premium anime wallpapers, merchandise, and digital art — curated for true fans.
            Your gateway to the most immersive anime shopping experience on the planet.
          </p>

          <div className="hero-cta">
            <button
              className="btn-primary btn-lg"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              ◈ Explore Store
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={() => navigate(PAGES.SIGNUP)}
            >
              Create Account →
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number"><AnimatedCounter target={50} suffix="K+" /></span>
              <span className="stat-label">Wallpapers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number"><AnimatedCounter target={200} suffix="K+" /></span>
              <span className="stat-label">Happy Fans</span>
            </div>
            <div className="stat-item">
              <span className="stat-number"><AnimatedCounter target={500} suffix="+" /></span>
              <span className="stat-label">Anime Series</span>
            </div>
            <div className="stat-item">
              <span className="stat-number"><AnimatedCounter target={4} suffix="K" /></span>
              <span className="stat-label">Resolution</span>
            </div>
          </div>
        </div>

        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '20%', right: '8%', width: 200, height: 200,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,243,255,0.06) 0%, transparent 70%)',
          animation: 'drift 12s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: 150, height: 150,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,120,0.06) 0%, transparent 70%)',
          animation: 'drift 8s ease-in-out infinite 4s', pointerEvents: 'none' }} />
      </section>

      {/* ─── FEATURES ─── */}
      <section className="section" id="features">
        <div className="section-header">
          <div className="section-tag">◈ Why AniCart</div>
          <h2 className="section-title">Built for <span>True Fans</span></h2>
          <p className="section-desc">
            Every feature engineered to give you the best anime shopping experience in the universe.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card feature-card">
              <div className={`feature-icon-wrap ${f.color}`}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <div className="products-section" id="products">
        <div className="products-inner">
          <div className="section-header">
            <div className="section-tag">◈ Digital Collection</div>
            <h2 className="section-title">Featured <span>Wallpapers</span></h2>
            <p className="section-desc">
              Hand-picked 4K artwork from the most iconic anime series. Hover to quick-add.
            </p>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 50,
                  border: '1px solid',
                  borderColor: activeFilter === f ? 'var(--neon)' : 'var(--glass-border)',
                  background: activeFilter === f ? 'var(--neon-dim)' : 'transparent',
                  color: activeFilter === f ? 'var(--neon)' : 'var(--text-muted)',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textTransform: 'uppercase',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)',
              fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', letterSpacing: '2px' }}>
              NO WALLPAPERS FOUND FOR THIS FILTER
            </div>
          )}
        </div>
      </div>

      {/* ─── MARQUEE TICKER ─── */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)', padding: '14px 0',
        background: 'rgba(0,243,255,0.02)' }}>
        <div style={{
          display: 'flex', gap: 60, animation: 'marquee 20s linear infinite',
          whiteSpace: 'nowrap', width: 'max-content',
        }}>
          {Array(3).fill(
            ['◈ JUJUTSU KAISEN', '✦ DEMON SLAYER', '◈ ATTACK ON TITAN', '✦ ONE PIECE',
             '◈ NARUTO', '✦ MY HERO ACADEMIA', '◈ BLEACH', '✦ CHAINSAW MAN', '◈ SPY × FAMILY']
          ).flat().map((t, i) => (
            <span key={i} style={{
              fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '3px', color: i % 2 === 0 ? 'var(--neon)' : 'var(--text-muted)',
              opacity: 0.7,
            }}>{t}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }`}</style>
      </div>

      {/* ─── CTA BANNER ─── */}
      <div className="cta-section">
        <div className="glass-card cta-card">
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, var(--neon), var(--pink), transparent)',
          }} />
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.8rem', letterSpacing: '4px',
            textTransform: 'uppercase', color: 'var(--neon)', marginBottom: 16 }}>
            ◈ Limited Time Access
          </div>
          <h2 className="cta-title">
            Join 200,000+ Anime Fans<br />in the Databank
          </h2>
          <p className="cta-desc">
            Sign up today and get your first wallpaper pack absolutely free. 
            No credit card required. Cancel anytime.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary btn-lg" onClick={() => navigate(PAGES.SIGNUP)}>
              ✦ Start Free Today
            </button>
            <button className="btn-secondary btn-lg" onClick={() => navigate(PAGES.LOGIN)}>
              Sign In →
            </button>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)' }} />
        <div className="footer-logo">ANI<span>CART</span></div>
        <div className="footer-tagline">
          "Enter the Databank. Initiate Link. Explore the Anime Universe." 🌌
        </div>
        <ul className="footer-links">
          {['Home', 'Store', 'Features', 'About', 'Contact', 'Privacy', 'Terms'].map((link) => (
            <li key={link}>
              <a
                onClick={() => {
                  if (link === 'Home') navigate(PAGES.LANDING);
                  else if (link === 'Store')
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  else if (link === 'Features')
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ cursor: 'pointer' }}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="footer-copy">
          © 2024 AniCart by Ashwin · Built with React + Node.js · All rights reserved
        </div>
      </footer>
    </div>
  );
}
