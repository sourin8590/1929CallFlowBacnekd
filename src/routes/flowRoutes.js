const express = require("express");

const {
  createFlow,
  getFlows,
  getFlowById,
  getActiveFlow,
  updateFlow,
  toggleFlow,
} = require("../controllers/flowController");

const {
  validateRequired,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Create IVR flow
router.post(
  "/",
  validateRequired(["name"]),
  createFlow
);

// Get all flows
router.get("/", getFlows);

// Get active flow
router.get("/active", getActiveFlow);

// Get flow by ID
router.get("/:id", getFlowById);

// Update flow
router.put(
  "/:id",
  validateRequired(["name"]),
  updateFlow
);

// Activate / deactivate flow
router.patch("/:id/toggle", toggleFlow);

module.exports = router;