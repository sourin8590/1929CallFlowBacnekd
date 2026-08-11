const IVRNode = require("../models/IVRNode");
const IVRFlow = require("../models/IVRFlow");

// Create a new IVR node
const createNode = async (req, res) => {
  try {
    const {
      flowId,
      name,
      type,
      prompt,
      customerType,
      options,
    } = req.body;

    if (!flowId || !name || !type) {
      return res.status(400).json({
        success: false,
        message: "flowId, name and type are required",
      });
    }

    // Check whether flow exists
    const flow = await IVRFlow.findById(flowId);

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "IVR flow not found",
      });
    }

    const node = await IVRNode.create({
      flowId,
      name,
      type,
      prompt,
      customerType: customerType || "BOTH",
      options: options || [],
    });

    res.status(201).json({
      success: true,
      message: "IVR node created successfully",
      data: node,
    });
  } catch (error) {
    console.error("Create node error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create IVR node",
    });
  }
};


// Get all nodes
const getNodes = async (req, res) => {
  try {
    const nodes = await IVRNode.find()
      .populate("flowId")
      .populate("options.nextNode")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: nodes.length,
      data: nodes,
    });
  } catch (error) {
    console.error("Get nodes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get IVR nodes",
    });
  }
};


// Get nodes belonging to a specific flow
const getNodesByFlow = async (req, res) => {
  try {
    const { flowId } = req.params;

    const nodes = await IVRNode.find({
      flowId,
    })
      .populate("options.nextNode")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: nodes.length,
      data: nodes,
    });
  } catch (error) {
    console.error("Get flow nodes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get flow nodes",
    });
  }
};


// Get a single node
const getNodeById = async (req, res) => {
  try {
    const { id } = req.params;

    const node = await IVRNode.findById(id)
      .populate("flowId")
      .populate("options.nextNode");

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "IVR node not found",
      });
    }

    res.status(200).json({
      success: true,
      data: node,
    });
  } catch (error) {
    console.error("Get node error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get IVR node",
    });
  }
};


// Update an IVR node
const updateNode = async (req, res) => {
  try {
    const { id } = req.params;

    const node = await IVRNode.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("options.nextNode");

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "IVR node not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "IVR node updated successfully",
      data: node,
    });
  } catch (error) {
    console.error("Update node error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update IVR node",
    });
  }
};


// Delete an IVR node
const deleteNode = async (req, res) => {
  try {
    const { id } = req.params;

    const node = await IVRNode.findByIdAndDelete(id);

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "IVR node not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "IVR node deleted successfully",
    });
  } catch (error) {
    console.error("Delete node error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete IVR node",
    });
  }
};


module.exports = {
  createNode,
  getNodes,
  getNodesByFlow,
  getNodeById,
  updateNode,
  deleteNode,
};