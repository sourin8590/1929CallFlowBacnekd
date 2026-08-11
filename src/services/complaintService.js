const { randomUUID } = require("crypto");

const Complaint = require("../models/Complaint");
const CallSession = require("../models/CallSession");

const customerService = require("./customerService");

// Create complaint
const createComplaint = async (complaintData) => {
  const {
    callId,
    callerNumber,
    category,
    description,
  } = complaintData;

  // Find customer
  const customer =
    await customerService.findCustomerByPhone(
      callerNumber
    );

  // Find call
  let call = null;

  if (callId) {
    call = await CallSession.findOne({
      callId,
    });
  }

  // Generate complaint ID
  const complaintId = `CMP-${randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;

  // Create complaint
  const complaint = await Complaint.create({
    complaintId,

    call: call
      ? call._id
      : undefined,

    customer: customer
      ? customer._id
      : undefined,

    callerNumber,

    category,

    description,

    status: "OPEN",
  });

  return complaint;
};

// Get all complaints
const getAllComplaints = async () => {
  const complaints = await Complaint.find()
    .populate("customer")
    .populate("call")
    .sort({
      createdAt: -1,
    });

  return complaints;
};

// Get complaint by ID
const getComplaintById = async (id) => {
  const complaint = await Complaint.findById(id)
    .populate("customer")
    .populate("call");

  return complaint;
};

// Get complaints by phone number
const getComplaintsByPhone = async (phoneNumber) => {
  const complaints = await Complaint.find({
    callerNumber: phoneNumber,
  }).sort({
    createdAt: -1,
  });

  return complaints;
};

// Update complaint
const updateComplaint = async (id, data) => {
  const complaint = await Complaint.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  return complaint;
};

// Delete complaint
const deleteComplaint = async (id) => {
  const complaint = await Complaint.findByIdAndDelete(
    id
  );

  return complaint;
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsByPhone,
  updateComplaint,
  deleteComplaint,
};