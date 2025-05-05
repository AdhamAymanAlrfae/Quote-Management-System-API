const rateLimit = require("express-rate-limit");

// 🌍 1️⃣ Global Limit: Applied to all API routes
const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, // Allow 200 requests per 10 min for general users
  message: { error: "Too many requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔐 2️⃣ Strict Limit for Login & Register (Prevent Brute Force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 login attempts per 15 minutes
  message: { error: "Too many login attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 👥 3️⃣ Limit for Unauthenticated Users (Prevent Abuse)
const guestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Max 100 requests per guest user
  message: { error: "Too many requests. Log in for higher limits." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔓 4️⃣ Higher Limit for Authenticated Users (More Freedom)
const userLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500, // Max 500 requests per 10 min for logged-in users
  message: { error: "Too many requests. Slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🛠️ 5️⃣ Admin Limit (Prevent Abuse)
const adminLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit admin actions
  message: { error: "Too many admin actions. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalLimiter, authLimiter };
