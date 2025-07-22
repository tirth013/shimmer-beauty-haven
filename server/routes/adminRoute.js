const express = require("express");
const { getOverviewStats, getOrdersByStatus, getDeliveryAreas } = require("../controller/adminController");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// Admin-only routes
router.route("/overview").get(auth, adminOnly, getOverviewStats);
router.route("/orders/:status").get(auth, adminOnly, getOrdersByStatus);
router.route("/delivery-areas").get(auth, adminOnly, getDeliveryAreas);

module.exports = router;