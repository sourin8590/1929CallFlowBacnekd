const { randomUUID } = require("crypto");

const CallSession = require("../models/CallSession");
const CallInput = require("../models/CallInput");

const customerService = require("./customerService");
const ivrService = require("./ivrService");

// Start a new call
const startCall = async (callerNumber, phoneNumber = "1929") => {
  // Find customer
  const customer = await customerService.findCustomerByPhone(
    callerNumber
  );

  // Determine customer type
  const customerType = customer
    ? "REGISTERED"
    : "NON_REGISTERED";

  // Get active IVR flow
  const flow = await ivrService.getActiveFlow(phoneNumber);

  if (!flow) {
    throw new Error("Active IVR flow not found");
  }

  // Get correct menu based on customer type
  const menu = await ivrService.getCustomerMenu(
    flow._id,
    customerType
  );

  if (!menu) {
    throw new Error(
      `Menu not found for ${customerType} customer`
    );
  }

  // Create call session
  const call = await CallSession.create({
    callId: randomUUID(),

    callerNumber,

    customer: customer
      ? customer._id
      : undefined,

    customerType,

    flow: flow._id,

    currentNode: menu._id,

    status: "IVR",

    startedAt: new Date(),
  });

  return {
    call,
    customer,
    customerType,
    currentNode: menu,
  };
};

// Get call by call ID
const getCallById = async (callId) => {
  const call = await CallSession.findOne({
    callId,
  })
    .populate("customer")
    .populate("flow")
    .populate("currentNode");

  return call;
};

// Process DTMF / speech input
const processInput = async (
  callId,
  input,
  inputType = "DTMF"
) => {
  // Find call
  const call = await CallSession.findOne({
    callId,
  });

  if (!call) {
    throw new Error("Call not found");
  }

  // Check if call already ended
  if (
    call.status === "COMPLETED" ||
    call.status === "ABANDONED"
  ) {
    throw new Error("Call has already ended");
  }

  // Get current node
  const currentNode = await ivrService.getNodeById(
    call.currentNode
  );

  if (!currentNode) {
    throw new Error("Current IVR node not found");
  }

  // Save customer input
  await CallInput.create({
    call: call._id,
    node: currentNode._id,
    input,
    inputType,
  });

  // Find next node
  const result = await ivrService.getNextNode(
    currentNode._id,
    input
  );

  // Invalid option
  if (!result.selectedOption) {
    return {
      call,
      currentNode,
      nextNode: null,
      valid: false,
      message: "Invalid IVR option",
    };
  }

  // Next node not configured
  if (!result.nextNode) {
    throw new Error("Next node is not configured");
  }

  const nextNode = result.nextNode;

  // Update current node
  call.currentNode = nextNode._id;

  // Update call status
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

  return {
    call,
    currentNode,
    nextNode,
    selectedOption: result.selectedOption,
    valid: true,
  };
};

// End call
const endCall = async (callId) => {
  const call = await CallSession.findOne({
    callId,
  });

  if (!call) {
    throw new Error("Call not found");
  }

  call.status = "COMPLETED";
  call.endedAt = new Date();

  await call.save();

  return call;
};

module.exports = {
  startCall,
  getCallById,
  processInput,
  endCall,
};