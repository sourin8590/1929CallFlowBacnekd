const express = require("express");

const {
  createCustomer,
  getCustomerByPhone,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const {
  validateRequired,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Create registered customer
router.post(
  "/",
  validateRequired(["name", "phoneNumber"]),
  createCustomer
);

// Get all customers
router.get("/", getCustomers);

// Get customer by phone number
router.get("/:phoneNumber", getCustomerByPhone);

// Update customer
router.put(
  "/:id",
  validateRequired(["name", "phoneNumber"]),
  updateCustomer
);

// Deactivate customer
router.delete("/:id", deleteCustomer);

module.exports = router;