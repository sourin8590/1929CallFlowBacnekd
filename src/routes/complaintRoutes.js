const express = require("express");

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  getComplaintsByPhone,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");

const {
  validateRequired,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Create complaint
router.post(
  "/",
  validateRequired([
    "callerNumber",
    "category",
  ]),
  createComplaint
);

// Get all complaints
router.get("/", getComplaints);

// Get complaints by phone
router.get(
  "/phone/:phoneNumber",
  getComplaintsByPhone
);

// Get complaint by ID
router.get("/:id", getComplaintById);

// Update complaint
router.put(
  "/:id",
  validateRequired(["status"]),
  updateComplaint
);

// Delete complaint
router.delete("/:id", deleteComplaint);

module.exports = router;