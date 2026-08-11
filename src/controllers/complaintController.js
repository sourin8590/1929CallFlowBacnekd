const { randomUUID } = require("crypto");

const Complaint = require("../models/Complaint");
const CallSession = require("../models/CallSession");
const Customer = require("../models/Customer");

// Create a complaint
const createComplaint = async (req, res) => {
  try {
    const {
      callId,
      callerNumber,
      category,
      description,
    } = req.body;

    if (!callerNumber || !category) {
      return res.status(400).json({
        success: false,
        message: "Caller number and category are required",
      });
    }

    // Find customer
    const customer = await Customer.findOne({
      phoneNumber: callerNumber,
      active: true,
    });

    // Find call if callId is provided
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

    const complaint = await Complaint.create({
      complaintId,

      call: call ? call._id : undefined,

      customer: customer ? customer._id : undefined,

      callerNumber,

      category,

      description,

      status: "OPEN",
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create complaint",
    });
  }
};


// Get all complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("customer")
      .populate("call")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get complaints",
    });
  }
};


// Get complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate("customer")
      .populate("call");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get complaint",
    });
  }
};


// Get complaints by caller phone number
const getComplaintsByPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const complaints = await Complaint.find({
      callerNumber: phoneNumber,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error("Get customer complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get customer complaints",
    });
  }
};


// Update complaint status
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (status) {
      complaint.status = status;
    }

    if (description) {
      complaint.description = description;
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update complaint",
    });
  }
};


// Delete complaint
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete complaint",
    });
  }
};


module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  getComplaintsByPhone,
  updateComplaint,
  deleteComplaint,
};