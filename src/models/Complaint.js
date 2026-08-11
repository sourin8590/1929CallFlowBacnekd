const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    call: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CallSession",
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    callerNumber: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "THEFT",
        "LOSS",
        "GENERAL",
        "OTHER",
      ],
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED",
      ],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);