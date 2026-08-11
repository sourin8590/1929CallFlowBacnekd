const mongoose = require("mongoose");

const ivrFlowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      default: "1929",
    },

    language: {
      type: String,
      default: "en-IN",
    },

    startNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IVRNode",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("IVRFlow", ivrFlowSchema);