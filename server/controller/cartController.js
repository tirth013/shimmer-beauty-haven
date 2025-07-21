const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const CartProductModel = require("../models/cartProductModel");

/**
 * Adds an item to the user's shopping cart.
 * @route POST /api/cart/add
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Product ID and quantity are required.",
      });
  }

  const product = await ProductModel.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found." });
  }

  let user = await UserModel.findById(userId).populate("shopping_cart");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const existingCartItem = await CartProductModel.findOne({
    userId,
    productId,
  });

  if (existingCartItem) {
    existingCartItem.quantity += quantity;
    await existingCartItem.save();
  } else {
    const newCartItem = new CartProductModel({
      userId,
      productId,
      quantity,
    });
    await newCartItem.save();
    user.shopping_cart.push(newCartItem);
    await user.save();
  }

  res.json({ success: true, message: "Item added to cart." });
});

/**
 * Updates the quantity of an item in the cart.
 * @route PUT /api/cart/:productId
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  if (!quantity || quantity < 1) {
    return res
      .status(400)
      .json({ success: false, message: "Quantity must be at least 1." });
  }

  const cartItem = await CartProductModel.findOneAndUpdate(
    { userId, productId },
    { quantity },
    { new: true }
  );

  if (!cartItem) {
    return res
      .status(404)
      .json({ success: false, message: "Item not found in cart." });
  }

  res.json({ success: true, message: "Cart item updated." });
});

/**
 * Removes an item from the cart.
 * @route DELETE /api/cart/:productId
 */
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const cartItem = await CartProductModel.findOneAndDelete({
    userId,
    productId,
  });

  if (!cartItem) {
    return res
      .status(404)
      .json({ success: false, message: "Item not found in cart." });
  }

  await UserModel.findByIdAndUpdate(userId, {
    $pull: { shopping_cart: cartItem._id },
  });

  res.json({ success: true, message: "Item removed from cart." });
});

module.exports = {
  addToCart,
  updateCartItem,
  removeCartItem,
};
