const mongoose = require("mongoose");

const callInputSchema = new mongoose.Schema(
  {
    call: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CallSession",
      required: true,
      index: true,
    },

    node: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IVRNode",
    },

    input: {
      type: String,
      required: true,
    },

    inputType: {
      type: String,
      enum: ["DTMF", "SPEECH"],
      default: "DTMF",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CallInput", callInputSchema);