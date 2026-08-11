const express = require("express");

const {
  createNode,
  getNodes,
  getNodesByFlow,
  getNodeById,
  updateNode,
  deleteNode,
} = require("../controllers/nodeController");

const {
  validateRequired,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Create IVR node
router.post(
  "/",
  validateRequired([
    "flowId",
    "name",
    "type",
  ]),
  createNode
);

// Get all nodes
router.get("/", getNodes);

// Get nodes for a flow
router.get(
  "/flow/:flowId",
  getNodesByFlow
);

// Get node by ID
router.get("/:id", getNodeById);

// Update node
router.put(
  "/:id",
  validateRequired([
    "name",
    "type",
  ]),
  updateNode
);

// Delete node
router.delete("/:id", deleteNode);

module.exports = router;