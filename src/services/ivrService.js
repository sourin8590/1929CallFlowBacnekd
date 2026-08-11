const IVRFlow = require("../models/IVRFlow");
const IVRNode = require("../models/IVRNode");


// Get active IVR flow
const getActiveFlow = async (phoneNumber = "1929") => {
  const flow = await IVRFlow.findOne({
    phoneNumber,
    active: true,
  })
    .sort({ createdAt: -1 })
    .populate("startNode");

  return flow;
};


// Get node by ID
const getNodeById = async (nodeId) => {
  return await IVRNode.findById(nodeId)
    .populate("options.nextNode");
};


// Find next node based on customer input
const getNextNode = async (nodeId, input) => {
  const currentNode = await IVRNode.findById(nodeId);

  if (!currentNode) {
    throw new Error("Current IVR node not found");
  }

  const selectedOption = currentNode.options.find(
    (option) => option.digit === input
  );

  if (!selectedOption) {
    return {
      currentNode,
      selectedOption: null,
      nextNode: null,
    };
  }

  let nextNode = null;

  if (selectedOption.nextNode) {
    nextNode = await IVRNode.findById(
      selectedOption.nextNode
    );
  }

  return {
    currentNode,
    selectedOption,
    nextNode,
  };
};


// Get menu for customer type
const getCustomerMenu = async (
  flowId,
  customerType
) => {
  const node = await IVRNode.findOne({
    flowId,
    type: "MENU",
    customerType: {
      $in: [customerType, "BOTH"],
    },
  });

  return node;
};


module.exports = {
  getActiveFlow,
  getNodeById,
  getNextNode,
  getCustomerMenu,
};