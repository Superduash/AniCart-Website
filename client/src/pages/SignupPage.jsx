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

const SignupPage = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.username.trim()) {
      nextErrors.username = "Username is required.";
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      nextErrors.username = "Use 3-20 letters, numbers, or underscores.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email.";
    }

    if (!form.password) {
      nextErrors.password = "Passkey is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your passkey.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passkeys do not match.";
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

    login({ username: form.username, email: form.email, clearance: "Level 1" });
    navigate("/dashboard");
  };

  return (
    <PageShell>
      <UnifiedNavbar user={user} navigate={navigate} onLogout={logout} />

      <main className="sf-main">
        <div className="sf-auth-layout">
          <GlassPanel className="sf-auth-side">
            <motion.h2 variants={fadeUp} initial="hidden" animate="visible" custom={0.06}>
              Build Your Databank Identity
            </motion.h2>
            <motion.p className="sf-copy" variants={fadeUp} initial="hidden" animate="visible" custom={0.12}>
              Register once, then continue with seamless cross-page transitions and synchronized hardware intelligence.
            </motion.p>
            <motion.ul className="sf-copy" variants={fadeUp} initial="hidden" animate="visible" custom={0.18}>
              <li>Neon-authenticated account node</li>
              <li>Live wishlist and order memory</li>
              <li>Unified panel design across every page</li>
            </motion.ul>
            <button className="sf-btn sf-btn-ghost" onClick={() => navigate("/login")}>
              Existing Operator Login
            </button>
          </GlassPanel>

          <GlassPanel className="sf-auth-card">
            <h1>Register Node</h1>
            <p className="sf-copy">Create credentials and initiate your first link.</p>

            <form onSubmit={onSubmit} noValidate>
              <AuthInput
                label="Username"
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="cyber_agent"
                autoComplete="username"
                error={errors.username}
              />
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
                placeholder="Create passkey"
                autoComplete="new-password"
                error={errors.password}
              />
              <AuthInput
                label="Confirm Passkey"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Re-enter passkey"
                autoComplete="new-password"
                error={errors.confirmPassword}
              />

              {errors.general && <p className="sf-error">{errors.general}</p>}

              <div className="sf-hero-actions" style={{ marginTop: 4 }}>
                <button type="submit" className="sf-btn sf-btn-primary">
                  Initiate Link
                </button>
                <button type="button" className="sf-btn sf-btn-ghost" onClick={() => navigate("/login")}>
                  Already Registered
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

export default SignupPage;
