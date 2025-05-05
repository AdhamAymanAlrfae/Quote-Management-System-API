const express = require("express");
const passport = require("passport");

const router = express.Router();

// *** Discord ***
router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/callback",
  passport.authenticate("discord", { session: false }),
  function (req, res) {
    const isProduction = process.env.ENV === "production";

    res.cookie("accessToken", req.user.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const frontendCallbackUrl =
      process.env.ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000/";
    res.redirect(frontendCallbackUrl);
  }
);

// *** GitHub ***
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  function (req, res) {
    const isProduction = process.env.ENV === "production";
    res.cookie("accessToken", req.user.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const frontendCallbackUrl =
      process.env.ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000/";
    res.redirect(frontendCallbackUrl);
  }
);

// *** Google ***
router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  function (req, res) {
    const isProduction = process.env.ENV === "production";
    res.cookie("accessToken", req.user.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const frontendCallbackUrl =
      process.env.ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000/";
    res.redirect(frontendCallbackUrl);
  }
);

module.exports = router;
