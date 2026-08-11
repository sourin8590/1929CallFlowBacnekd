const { randomUUID } = require("crypto");

const Customer = require("../models/Customer");
const IVRFlow = require("../models/IVRFlow");
const IVRNode = require("../models/IVRNode");
const CallSession = require("../models/CallSession");
const CallInput = require("../models/CallInput");

// Start a new call
const startCall = async (req, res) => {
  try {
    const {
      callerNumber,
      phoneNumber = "1929",
    } = req.body;

    if (!callerNumber) {
      return res.status(400).json({
        success: false,
        message: "Caller number is required",
      });
    }

    // Find customer using caller's phone number
    const customer = await Customer.findOne({
      phoneNumber: callerNumber,
      active: true,
    });

    const customerType = customer
      ? "REGISTERED"
      : "NON_REGISTERED";

    // Find active IVR flow
    const flow = await IVRFlow.findOne({
      phoneNumber,
      active: true,
    }).sort({ createdAt: -1 });

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "Active IVR flow not found",
      });
    }

    // Get starting node
    let startNode = null;

    if (flow.startNode) {
      startNode = await IVRNode.findById(flow.startNode);
    }

    if (!startNode) {
      return res.status(400).json({
        success: false,
        message: "Start node is not configured",
      });
    }

    // Create call session
    const call = await CallSession.create({
      callId: randomUUID(),
      callerNumber,
      customer: customer ? customer._id : undefined,
      customerType,
      flow: flow._id,
      currentNode: startNode._id,
      status: "IVR",
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Call started successfully",
      data: {
        callId: call.callId,
        customerType,
        customer,
        currentNode: startNode,
      },
    });
  } catch (error) {
    console.error("Start call error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to start call",
    });
  }
};


// Get current call information
const getCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await CallSession.findOne({
      callId,
    })
      .populate("customer")
      .populate("flow")
      .populate("currentNode");

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    res.status(200).json({
      success: true,
      data: call,
    });
  } catch (error) {
    console.error("Get call error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get call",
    });
  }
};


// Process customer input
const handleInput = async (req, res) => {
  try {
    const { callId } = req.params;
    const {
      input,
      inputType = "DTMF",
    } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "Input is required",
      });
    }

    // Find call
    const call = await CallSession.findOne({
      callId,
    });

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    // Check call status
    if (
      call.status === "COMPLETED" ||
      call.status === "ABANDONED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Call has already ended",
      });
    }

    // Get current IVR node
    const currentNode = await IVRNode.findById(
      call.currentNode
    );

    if (!currentNode) {
      return res.status(404).json({
        success: false,
        message: "Current IVR node not found",
      });
    }

    // Store caller input
    await CallInput.create({
      call: call._id,
      node: currentNode._id,
      input,
      inputType,
    });

    // Find selected option
    const selectedOption = currentNode.options.find(
      (option) => option.digit === input
    );

    if (!selectedOption) {
      return res.status(400).json({
        success: false,
        message: "Invalid option",
        currentNode,
      });
    }

    // Make sure selected option has next node
    if (!selectedOption.nextNode) {
      return res.status(400).json({
        success: false,
        message: "Next node is not configured",
      });
    }

    // Get next node
    const nextNode = await IVRNode.findById(
      selectedOption.nextNode
    );

    if (!nextNode) {
      return res.status(404).json({
        success: false,
        message: "Next IVR node not found",
      });
    }

    // Update current node
    call.currentNode = nextNode._id;

    // Update call status based on node type
    if (nextNode.type === "QUEUE") {
      call.status = "QUEUED";
    }

    if (nextNode.type === "TRANSFER") {
      call.status = "CONNECTED";
    }

    if (nextNode.type === "END") {
      call.status = "COMPLETED";
      call.endedAt = new Date();
    }

    await call.save();

    res.status(200).json({
      success: true,
      message: "Input processed successfully",
      data: {
        callId: call.callId,
        customerType: call.customerType,
        selectedOption: {
          digit: selectedOption.digit,
          label: selectedOption.label,
        },
        currentNode: nextNode,
        callStatus: call.status,
      },
    });
  } catch (error) {
    console.error("Handle input error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process input",
    });
  }
};


// End the call
const endCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await CallSession.findOne({
      callId,
    });

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    call.status = "COMPLETED";
    call.endedAt = new Date();

    await call.save();

    res.status(200).json({
      success: true,
      message: "Call ended successfully",
      data: call,
    });
  } catch (error) {
    console.error("End call error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to end call",
    });
  }
};


module.exports = {
  startCall,
  getCall,
  handleInput,
  endCall,
};