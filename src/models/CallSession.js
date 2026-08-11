const mongoose = require("mongoose");

const callSessionSchema = new mongoose.Schema(
  {
    callId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    callerNumber: {
      type: String,
      required: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    customerType: {
      type: String,
      enum: ["REGISTERED", "NON_REGISTERED"],
      required: true,
    },

    flow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IVRFlow",
    },

    currentNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IVRNode",
    },

    status: {
      type: String,
      enum: [
        "RINGING",
        "IVR",
        "QUEUED",
        "CONNECTED",
        "COMPLETED",
        "ABANDONED",
      ],
      default: "RINGING",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CallSession", callSessionSchema);