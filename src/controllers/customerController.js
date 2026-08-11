const Customer = require("../models/Customer");

// Create a registered customer
const createCustomer = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required",
      });
    }

    const existingCustomer = await Customer.findOne({ phoneNumber });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists",
      });
    }

    const customer = await Customer.create({
      name,
      phoneNumber,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
};

// Get customer by phone number
const getCustomerByPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const customer = await Customer.findOne({
      phoneNumber,
      active: true,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        customerType: "NON_REGISTERED",
      });
    }

    res.status(200).json({
      success: true,
      customerType: "REGISTERED",
      data: customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get customer",
    });
  }
};

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get customers",
    });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Update customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
};

// Delete/deactivate customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deactivated successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate customer",
    });
  }
};

module.exports = {
  createCustomer,
  getCustomerByPhone,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};