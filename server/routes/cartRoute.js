const express = require("express");
const {
    addToCart,
    updateCartItem,
    removeCartItem,
} = require("../controller/cartController");
const auth = require("../middleware/auth");
const router = express.Router();

// All routes are protected
router.use(auth);

router.route("/add").post(addToCart);
router.route("/:productId").put(updateCartItem);
router.route("/:productId").delete(removeCartItem);

module.exports = router;