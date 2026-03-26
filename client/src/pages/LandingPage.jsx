import React, { useContext, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import {
  fadeUp,
  GlassPanel,
  PageShell,
  stagger,
  UnifiedFooter,
  UnifiedNavbar,
} from "../components/SciFiShell";

const CATEGORIES = ["All", "Cybernetics", "Neural Tech", "Aero-Drones"];

const PRODUCTS = [
  {
    id: 1,
    name: "Quantum Visor",
    price: 299.99,
    category: "Cybernetics",
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Neural Link Core",
    price: 899,
    category: "Neural Tech",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Scout Drone NX",
    price: 450.5,
    category: "Aero-Drones",
    img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Cortex Storage Cell",
    price: 379,
    category: "Neural Tech",
    img: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Aegis Arm Interface",
    price: 1099,
    category: "Cybernetics",
    img: "https://images.unsplash.com/photo-1581091215367-59ab6dcef7f1?auto=format&fit=crop&w=900&q=80",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, cart, setCart, wishlist, setWishlist, logout } = useContext(AuthContext);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const inCategory = activeCategory === "All" || product.category === activeCategory;
      const inQuery = product.name.toLowerCase().includes(query.toLowerCase());
      return inCategory && inQuery;
    });
  }, [activeCategory, query]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isActive = prev.some((item) => item.id === product.id);
      return isActive ? prev.filter((item) => item.id !== product.id) : [...prev, product];
    });
  };

  return (
    <PageShell>
      <UnifiedNavbar user={user} navigate={navigate} onLogout={logout} />

      <main className="sf-main">
        <motion.section className="sf-hero sf-glass-panel" variants={stagger} initial="hidden" animate="visible">
          <motion.p className="sf-copy" variants={fadeUp} custom={0.05}>
            Sector commerce uplink online
          </motion.p>
          <motion.h1 className="sf-title" variants={fadeUp} custom={0.1}>
            Databank Market for <span className="sf-title-accent">Future Hardware</span>
          </motion.h1>
          <motion.p className="sf-copy" variants={fadeUp} custom={0.15}>
            Curated sci-fi products, glassmorphism interface, and smooth procurement flow across every device.
          </motion.p>
          <motion.div className="sf-hero-actions" variants={fadeUp} custom={0.2}>
            <button className="sf-btn sf-btn-primary" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>
              Initiate Link
            </button>
            <button className="sf-btn sf-btn-ghost" onClick={() => navigate(user ? "/dashboard" : "/login")}>
              {user ? "Open Profile" : "Access Node"}
            </button>
          </motion.div>
        </motion.section>

        <section id="catalog">
          <div className="sf-catalog-head">
            <h2>Databank Catalog</h2>
            <input
              className="sf-search"
              placeholder="Search databank..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="sf-cats">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`sf-cat ${activeCategory === category ? "sf-cat-active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="sf-grid-products">
            {filtered.map((product, index) => {
              const wishlisted = wishlist.some((item) => item.id === product.id);
              return (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={0.02 * index}
                >
                  <GlassPanel className="sf-product">
                    <img src={product.img} alt={product.name} loading="lazy" />
                    <p className="sf-muted">{product.category}</p>
                    <h4>{product.name}</h4>
                    <div className="sf-row">
                      <strong>${product.price.toFixed(2)}</strong>
                      <button className="sf-btn sf-btn-ghost" onClick={() => toggleWishlist(product)}>
                        {wishlisted ? "Wishlisted" : "Wishlist"}
                      </button>
                    </div>
                    <button className="sf-btn sf-btn-primary" onClick={() => addToCart(product)}>
                      Add to Databank
                    </button>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        </section>

        <GlassPanel className="sf-hero" style={{ marginTop: 20 }}>
          <div className="sf-row">
            <div>
              <h3 style={{ marginBottom: 6 }}>Databank Status</h3>
              <p className="sf-copy" style={{ margin: 0 }}>
                {cartCount} item(s) linked
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong style={{ fontSize: "1.1rem" }}>${cartTotal.toFixed(2)}</strong>
              <div>
                <button className="sf-btn sf-btn-primary" onClick={() => navigate("/checkout")}>
                  Secure Checkout
                </button>
              </div>
            </div>
          </div>
        </GlassPanel>
      </main>

      <UnifiedFooter />
    </PageShell>
  );
};

export default LandingPage;
