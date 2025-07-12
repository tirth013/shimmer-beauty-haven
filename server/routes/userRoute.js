const express = require("express");
const {
  registerUser,
  verifyEmail,
  login,
  logout,
  uploadAvatar,
  updateUserDetails,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
  refreshToken,
  getUserDetails,
} = require("../controller/userController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").post(auth, logout);
router.route("/upload-avatar").put(auth, upload.single("avatar"), uploadAvatar);
router.route("/update-user").put(auth, updateUserDetails);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-forgot-password-otp").post(verifyForgotPasswordOtp);
router.route("/reset-password").post(resetPassword);
router.route("/refresh-token").post(refreshToken);
router.route("/details").get(auth, getUserDetails);

module.exports = router;
