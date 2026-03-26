import React, { createContext, memo, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const STORAGE_KEYS = {
  session: "anicart_user_session",
  cart: "anicart_cart_databank",
  wishlist: "anicart_wishlist",
  orders: "anicart_orders",
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const AuthContext = createContext(null);
export const ToastContext = createContext({
  info: () => {},
  success: () => {},
  error: () => {},
});

const PageWrapper = memo(({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
));

const ToastViewport = memo(({ toasts }) => {
  if (!toasts.length) return null;

  return (
    <div className="core-toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`core-toast core-toast-${toast.type}`}>
          <div className="core-toast-title">{toast.type.toUpperCase()}</div>
          <div>{toast.message}</div>
        </div>
      ))}
    </div>
  );
});

const GlobalProvider = memo(({ children }) => {
  const [user, setUser] = useState(() => readJSON(STORAGE_KEYS.session, null));
  const [cart, setCart] = useState(() => readJSON(STORAGE_KEYS.cart, []));
  const [wishlist, setWishlist] = useState(() => readJSON(STORAGE_KEYS.wishlist, []));
  const [orderHistory, setOrderHistory] = useState(() => readJSON(STORAGE_KEYS.orders, []));
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2800);
  }, []);

  const login = useCallback((nextUser) => {
    const hydratedUser = {
      id: nextUser.id || `USR-${Math.floor(Math.random() * 90000) + 10000}`,
      username: nextUser.username,
      email: nextUser.email,
      clearance: nextUser.clearance || "Level 1",
      loginTime: new Date().toISOString(),
    };
    setUser(hydratedUser);
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(hydratedUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.session);
  }, []);

  const processCheckout = useCallback(
    ({ method = "Neon Ledger", address = "Unknown Sector" } = {}) => {
      if (!user) throw new Error("Authentication required.");
      if (!cart.length) throw new Error("Cart Databank is empty.");

      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const newOrder = {
        orderId: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: [...cart],
        total: subtotal,
        status: "Processing",
        paymentMethod: method,
        shippingAddress: address,
      };

      setOrderHistory((prev) => {
        const nextOrders = [newOrder, ...prev];
        localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(nextOrders));
        return nextOrders;
      });
      setCart([]);
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
      return newOrder;
    },
    [cart, user]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
  }, []);

  const setCartSynced = useCallback((updater) => {
    setCart((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(next));
      return next;
    });
  }, []);

  const setWishlistSynced = useCallback((updater) => {
    setWishlist((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(next));
      return next;
    });
  }, []);

  const toastApi = useMemo(
    () => ({
      info: (message) => pushToast("info", message),
      success: (message) => pushToast("success", message),
      error: (message) => pushToast("error", message),
    }),
    [pushToast]
  );

  const authValue = useMemo(
    () => ({
      user,
      login,
      logout,
      cart,
      setCart: setCartSynced,
      wishlist,
      setWishlist: setWishlistSynced,
      orderHistory,
      processCheckout,
      clearCart,
      systemConfig: {
        version: "6.0.0",
        platform: "AniCart",
      },
    }),
    [
      user,
      login,
      logout,
      cart,
      setCartSynced,
      wishlist,
      setWishlistSynced,
      orderHistory,
      processCheckout,
      clearCart,
    ]
  );

  return (
    <ToastContext.Provider value={toastApi}>
      <AuthContext.Provider value={authValue}>
        {children}
        <ToastViewport toasts={toasts} />
      </AuthContext.Provider>
    </ToastContext.Provider>
  );
});

const ProtectedRoute = memo(({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
});

const CheckoutPage = memo(() => {
  const navigate = useNavigate();
  const { cart, processCheckout } = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const [address, setAddress] = useState("");

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);

  const submit = useCallback(() => {
    try {
      const order = processCheckout({ address, method: "Neon Ledger" });
      toast.success(`Order ${order.orderId} confirmed.`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Checkout failed.");
    }
  }, [address, navigate, processCheckout, toast]);

  return (
    <main className="core-page">
      <section className="core-panel core-panel-medium">
        <h1>Secure Checkout</h1>
        <p className="core-copy">Review your Databank requisitions and finalize shipment.</p>

        {!cart.length ? (
          <div className="core-empty">
            <p>Cart Databank is empty.</p>
            <button className="core-btn core-btn-secondary" onClick={() => navigate("/shop")}>
              Return to Databank
            </button>
          </div>
        ) : (
          <>
            <div className="core-list">
              {cart.map((item) => (
                <div key={item.id} className="core-list-row">
                  <span>{item.qty}x {item.name}</span>
                  <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <label className="core-label">
              Delivery Coordinates
              <input
                className="core-input"
                placeholder="Enter sector / station"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </label>

            <div className="core-total-row">
              <strong>Total Uplink</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <button className="core-btn core-btn-primary" onClick={submit} disabled={!address.trim()}>
              Initiate Link
            </button>
          </>
        )}
      </section>
    </main>
  );
});

const DashboardPage = memo(() => {
  const navigate = useNavigate();
  const { user, logout, orderHistory } = useContext(AuthContext);

  return (
    <main className="core-page">
      <section className="core-panel core-panel-wide">
        <div className="core-header-row">
          <div>
            <h1>Operator Dashboard</h1>
            <p className="core-copy">Agent: {user?.username} | Clearance: {user?.clearance}</p>
          </div>
          <div className="core-actions-row">
            <button className="core-btn core-btn-secondary" onClick={() => navigate("/shop")}>
              Open Databank
            </button>
            <button
              className="core-btn core-btn-secondary"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Terminate Link
            </button>
          </div>
        </div>

        <h3>Recent Orders</h3>
        {!orderHistory.length ? (
          <p className="core-copy">No requisitions processed yet.</p>
        ) : (
          <div className="core-list">
            {orderHistory.map((order) => (
              <div key={order.orderId} className="core-list-row">
                <span>{order.orderId}</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
});

const NotFoundPage = memo(() => {
  const navigate = useNavigate();

  return (
    <main className="core-page">
      <section className="core-panel core-panel-medium core-center">
        <h1>404</h1>
        <p className="core-copy">Signal lost. This route is outside AniCart's sector map.</p>
        <button className="core-btn core-btn-primary" onClick={() => navigate("/shop")}>
          Return to Databank
        </button>
      </section>
    </main>
  );
});

const AnimatedRoutes = memo(() => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PageWrapper><CheckoutPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><DashboardPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
});

const App = () => {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <div className="core-app">
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </GlobalProvider>
  );
};

export default App;
