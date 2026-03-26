import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import {
  AuthInput,
  fadeUp,
  GlassPanel,
  PageShell,
  UnifiedFooter,
  UnifiedNavbar,
} from "../components/SciFiShell";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Use at least 6 characters.";
    }

    return nextErrors;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const username = form.email.split("@")[0] || "agent";
    login({ username, email: form.email, clearance: "Level 1" });
    navigate("/dashboard");
  };

  return (
    <PageShell>
      <UnifiedNavbar user={user} navigate={navigate} onLogout={logout} />

      <main className="sf-main">
        <div className="sf-auth-layout">
          <GlassPanel className="sf-auth-side">
            <motion.h2 variants={fadeUp} initial="hidden" animate="visible" custom={0.06}>
              Initiate Link to Databank
            </motion.h2>
            <motion.p className="sf-copy" variants={fadeUp} initial="hidden" animate="visible" custom={0.12}>
              Access saved requisitions, realtime delivery telemetry, and your synchronized hardware wishlist.
            </motion.p>
            <motion.ul className="sf-copy" variants={fadeUp} initial="hidden" animate="visible" custom={0.18}>
              <li>Unified secure session</li>
              <li>Glassmorphism operator dashboard</li>
              <li>Zero reload navigation flow</li>
            </motion.ul>
            <button className="sf-btn sf-btn-ghost" onClick={() => navigate("/shop")}>
              Back to Databank
            </button>
          </GlassPanel>

          <GlassPanel className="sf-auth-card">
            <h1>Login Node</h1>
            <p className="sf-copy">Authenticate and continue the mission.</p>

            <form onSubmit={onSubmit} noValidate>
              <AuthInput
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="agent@sector.ai"
                autoComplete="email"
                error={errors.email}
              />
              <AuthInput
                label="Passkey"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Enter passkey"
                autoComplete="current-password"
                error={errors.password}
              />

              {errors.general && <p className="sf-error">{errors.general}</p>}

              <div className="sf-hero-actions" style={{ marginTop: 4 }}>
                <button type="submit" className="sf-btn sf-btn-primary">
                  Initiate Link
                </button>
                <button type="button" className="sf-btn sf-btn-ghost" onClick={() => navigate("/signup")}>
                  Create Operator ID
                </button>
              </div>
            </form>
          </GlassPanel>
        </div>
      </main>

      <UnifiedFooter />
    </PageShell>
  );
};

export default LoginPage;
