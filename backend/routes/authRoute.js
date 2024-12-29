const express = require("express");
const { register, login, refreshToken, logout } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Access to protected route granted!" });
});

module.exports = router;
