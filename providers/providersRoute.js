const express = require("express");
const passport = require("passport");

const router = express.Router();

// Discord
router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/callback",
  passport.authenticate("discord", { session: false }),
  function (req, res) {
    res.cookie("jwt", req.user.refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: process.env.ENV == "production",
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res
      .status(201)
      .json({ status: "success", data: req.user, token: req.user.accessToken });
  }
);

// GitHub
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  function (req, res) {
    res.cookie("jwt", req.user.refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: process.env.ENV == "production",
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res
      .status(201)
      .json({ status: "success", data: req.user, token: req.user.accessToken });
  }
);

// Google
router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  function (req, res) {
    res.cookie("jwt", req.user.refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: process.env.ENV == "production",
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res
      .status(201)
      .json({ status: "success", data: req.user, token: req.user.accessToken });
  }
);

module.exports = router;
