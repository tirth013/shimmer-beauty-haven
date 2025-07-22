const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/orderModel");
const UserModel = require("../models/userModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const AddressModel = require("../models/addressModel");

/**
 * Get Admin Overview Stats
 * @route GET /api/admin/overview
 */
const getOverviewStats = asyncHandler(async (req, res) => {
  // Total Sales
  const totalSalesResult = await OrderModel.aggregate([
    { $match: { paymentStatus: "completed" } },
    { $group: { _id: null, totalSales: { $sum: "$totalAmt" } } },
  ]);
  const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

  // Order Counts
  const pendingOrders = await OrderModel.countDocuments({ paymentStatus: "pending" });
  const acceptedOrders = await OrderModel.countDocuments({ paymentStatus: "accepted" });
  const rejectedOrders = await OrderModel.countDocuments({ paymentStatus: "rejected" });
  const completedOrders = await OrderModel.countDocuments({ paymentStatus: "completed" });

  // Total Customers
  const totalCustomers = await UserModel.countDocuments({ role: "USER" });

  // Collection Counts
  const totalCategories = await CategoryModel.countDocuments({ parentCategory: null });
  const totalSubcategories = await CategoryModel.countDocuments({ parentCategory: { $ne: null } });
  const totalBrands = await ProductModel.distinct("brand").then(brands => brands.length);

  res.json({
    success: true,
    data: {
      totalSales,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      completedOrders,
      totalCustomers,
      totalCategories,
      totalSubcategories,
      totalBrands,
      deliveryAreas: 0,
    },
  });
});

/**
 * Get Orders by Status
 * @route GET /api/admin/orders/:status
 */
const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status' });
  }
  const orders = await OrderModel.find({ status }).populate('userId', 'name email').populate('productId');
  res.json({ success: true, data: orders });
});

/**
 * Get Delivery Areas
 * @route GET /api/admin/delivery-areas
 */
const getDeliveryAreas = asyncHandler(async (req, res) => {
  // Group by city, state, pincode for unique delivery areas
  const areas = await AddressModel.aggregate([
    {
      $group: {
        _id: { city: "$city", state: "$state", pincode: "$pincode" },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        city: "$_id.city",
        state: "$_id.state",
        pincode: "$_id.pincode",
        count: 1
      }
    }
  ]);
  res.json({ success: true, data: areas });
});

/**
 * Get Admin Dashboard Stats
 * @route GET /api/admin/dashboard-stats
 */
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const brands = await ProductModel.distinct("brand");
  const totalBrands = brands.length;
  const totalSales = await OrderModel.countDocuments({ status: "completed" });
  const totalCustomers = await UserModel.countDocuments({ role: "user" });
  res.json({
    success: true,
    data: {
      totalBrands,
      totalSales,
      totalCustomers,
    },
  });
});

module.exports = {
  getOverviewStats,
  getOrdersByStatus,
  getDeliveryAreas,
  getAdminDashboardStats,
};