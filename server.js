const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "16kb" }));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myfullstackapp";
const JWT_SECRET = process.env.JWT_SECRET || "secretkey123";
const PORT = process.env.PORT || 5000;

const FALLBACK_PRODUCTS = [
  { id: "prd_1", name: "Aurora Smart Lamp", category: "Home", price: 129.99, rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
  { id: "prd_2", name: "Noise-Cancel Headphones", category: "Audio", price: 249.0, rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
  { id: "prd_3", name: "Smart Watch Pro", category: "Wearables", price: 319.5, rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
  { id: "prd_4", name: "Compact Drone X", category: "Gadgets", price: 599.0, rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
  { id: "prd_5", name: "Laptop Stand Elite", category: "Workspace", price: 79.99, rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
  { id: "prd_6", name: "Wireless Keyboard", category: "Workspace", price: 109.99, rating: 4.4, imageUrl: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
  { id: "prd_7", name: "Ultra HD Monitor", category: "Display", price: 429.0, rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1527443224154-c4f061f70f8e?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
  { id: "prd_8", name: "Pocket Camera", category: "Photography", price: 679.0, rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
  { id: "prd_9", name: "Travel Backpack", category: "Lifestyle", price: 149.0, rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=640&q=80", width: 640, height: 640 },
];

const memoryUsers = [];
let dbConnected = false;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    dbConnected = true;
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    dbConnected = false;
    console.error("Failed to connect to MongoDB", err.message);
  });

mongoose.connection.on("connected", () => {
  dbConnected = true;
});
mongoose.connection.on("disconnected", () => {
  dbConnected = false;
});

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    stats: {
      ordersCount: { type: Number, default: 0 },
      lifetimeValue: { type: Number, default: 0 },
      activityScore: { type: Number, default: 50 },
      referrals: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });

const serializeUser = (user) => ({
  id: String(user._id || user.id),
  username: user.username,
  email: user.email,
  firstName: user.firstName || "",
  lastName: user.lastName || "",
  stats: user.stats || {
    ordersCount: 0,
    lifetimeValue: 0,
    activityScore: 50,
    referrals: 0,
  },
});

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (dbConnected) {
      const user = await User.findById(decoded.id).select("username email firstName lastName stats").lean();
      if (!user) {
        return res.status(401).json({ error: "Invalid session" });
      }
      req.user = serializeUser(user);
      return next();
    }

    const user = memoryUsers.find((item) => item.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }
    req.user = serializeUser(user);
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", dbConnected, uptime: process.uptime() });
});

app.get("/api/products", (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 12, 40));
  res.set("Cache-Control", "public, max-age=60");
  res.json({
    products: FALLBACK_PRODUCTS.slice(0, limit),
    count: Math.min(limit, FALLBACK_PRODUCTS.length),
  });
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, username, password, firstName = "", lastName = "" } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = String(username).trim();

    if (dbConnected) {
      const [existingEmail, existingUsername] = await Promise.all([
        User.findOne({ email: normalizedEmail }).lean(),
        User.findOne({ username: normalizedUsername }).lean(),
      ]);

      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const created = await User.create({
        email: normalizedEmail,
        username: normalizedUsername,
        password: hashedPassword,
        firstName,
        lastName,
        stats: {
          ordersCount: 0,
          lifetimeValue: 0,
          activityScore: 61,
          referrals: 0,
        },
      });

      const safeUser = serializeUser(created);
      return res.status(201).json({ token: signToken(created._id), user: safeUser });
    }

    const existingEmail = memoryUsers.find((u) => u.email === normalizedEmail);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const existingUsername = memoryUsers.find((u) => u.username === normalizedUsername);
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      firstName,
      lastName,
      stats: {
        ordersCount: 0,
        lifetimeValue: 0,
        activityScore: 61,
        referrals: 0,
      },
    };

    memoryUsers.push(user);

    return res.status(201).json({ token: signToken(user.id), user: serializeUser(user) });
  } catch (_error) {
    return res.status(500).json({ error: "Server error during signup" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (dbConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      return res.json({ token: signToken(user._id), user: serializeUser(user) });
    }

    const user = memoryUsers.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    return res.json({ token: signToken(user.id), user: serializeUser(user) });
  } catch (_error) {
    return res.status(500).json({ error: "Server error during login" });
  }
});

app.get("/api/profile", auth, async (req, res) => {
  res.set("Cache-Control", "private, max-age=20");
  res.json({ user: req.user });
});

app.get("/api/stats", auth, async (req, res) => {
  res.set("Cache-Control", "private, max-age=20");
  res.json({
    stats: {
      ordersCount: req.user.stats?.ordersCount ?? 0,
      lifetimeValue: req.user.stats?.lifetimeValue ?? 0,
      activityScore: req.user.stats?.activityScore ?? 0,
      referrals: req.user.stats?.referrals ?? 0,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
