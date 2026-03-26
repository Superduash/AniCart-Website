import React from "react";
import { motion } from "framer-motion";
import "../pages/SciFiDesign.css";

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: "easeOut" },
  }),
};

export const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

export const SpaceBackdrop = () => (
  <div className="sf-backdrop" aria-hidden="true">
    <div className="sf-orb sf-orb-cyan" />
    <div className="sf-orb sf-orb-blue" />
    <div className="sf-grid" />
  </div>
);

export const UnifiedNavbar = ({ user, navigate, onLogout }) => (
  <header className="sf-nav-wrap">
    <nav className="sf-nav sf-glass-panel">
      <button className="sf-brand" onClick={() => navigate("/shop")}>
        <span className="sf-brand-mark">DB</span>
        <span>Databank</span>
      </button>
      <div className="sf-nav-actions">
        {user ? (
          <>
            <span className="sf-nav-user">Agent: {user.username}</span>
            <button className="sf-btn sf-btn-ghost" onClick={onLogout}>
              Terminate Link
            </button>
          </>
        ) : (
          <>
            <button className="sf-btn sf-btn-ghost" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="sf-btn sf-btn-primary" onClick={() => navigate("/signup")}>
              Initiate Link
            </button>
          </>
        )}
      </div>
    </nav>
  </header>
);

export const UnifiedFooter = () => (
  <footer className="sf-footer">
    <div className="sf-footer-inner sf-glass-panel">
      <p>Databank Commerce Grid - Sector Prime</p>
      <p>Neon-secured transactions and orbital-grade delivery logistics.</p>
    </div>
  </footer>
);

export const GlassPanel = ({ className = "", children, ...props }) => (
  <div className={`sf-glass-panel ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const AuthInput = ({ label, error, ...props }) => (
  <label className="sf-field">
    <span>{label}</span>
    <input className={`sf-input ${error ? "sf-input-error" : ""}`} {...props} />
    {error && <small className="sf-error">{error}</small>}
  </label>
);

export const PageShell = ({ children }) => (
  <motion.div {...pageTransition} className="sf-page">
    <SpaceBackdrop />
    {children}
  </motion.div>
);
