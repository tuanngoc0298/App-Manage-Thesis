// routes/auth.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
router.post("/login", authController.loginUser);

router.post("/register", authController.registerUser);

// router.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error(err);
//       res.json({ success: false });
//     } else {
//       res.json({ success: true });
//     }
//   });
// });

module.exports = router;
