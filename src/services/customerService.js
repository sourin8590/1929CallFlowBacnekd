const Customer = require("../models/Customer");

// Create customer
const createCustomer = async (customerData) => {
  const { name, phoneNumber } = customerData;

  const existingCustomer = await Customer.findOne({
    phoneNumber,
  });

  if (existingCustomer) {
    throw new Error("Customer already exists");
  }

  const customer = await Customer.create({
    name,
    phoneNumber,
  });

  return customer;
};


// Find customer by phone number
const findCustomerByPhone = async (phoneNumber) => {
  const customer = await Customer.findOne({
    phoneNumber,
    active: true,
  });

  return customer;
};


// Get all customers
const getAllCustomers = async () => {
  return await Customer.find().sort({
    createdAt: -1,
  });
};


// Get customer by ID
const getCustomerById = async (id) => {
  return await Customer.findById(id);
};


// Update customer
const updateCustomer = async (id, data) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  return customer;
};


// Deactivate customer
const deactivateCustomer = async (id) => {
  const customer = await Customer.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );

  return customer;
};


module.exports = {
  createCustomer,
  findCustomerByPhone,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deactivateCustomer,
};