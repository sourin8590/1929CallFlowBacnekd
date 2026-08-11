const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    digit: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    nextNode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IVRNode",
    },
  },
  {
    _id: false,
  }
);

const ivrNodeSchema = new mongoose.Schema(
  {
    flowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IVRFlow",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "WELCOME",
        "CUSTOMER_CHECK",
        "MENU",
        "INPUT",
        "API",
        "QUEUE",
        "TRANSFER",
        "END",
      ],
      required: true,
    },

    prompt: {
      type: String,
    },

    customerType: {
      type: String,
      enum: ["REGISTERED", "NON_REGISTERED", "BOTH"],
      default: "BOTH",
    },

    options: {
      type: [optionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("IVRNode", ivrNodeSchema);