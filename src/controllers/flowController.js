const IVRFlow = require("../models/IVRFlow");

// Create a new IVR flow
const createFlow = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      language,
      startNode,
      active,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Flow name is required",
      });
    }

    const flow = await IVRFlow.create({
      name,
      phoneNumber: phoneNumber || "1929",
      language: language || "en-IN",
      startNode,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      message: "IVR flow created successfully",
      data: flow,
    });
  } catch (error) {
    console.error("Create flow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create IVR flow",
    });
  }
};

// Get all IVR flows
const getFlows = async (req, res) => {
  try {
    const flows = await IVRFlow.find()
      .populate("startNode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flows.length,
      data: flows,
    });
  } catch (error) {
    console.error("Get flows error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get IVR flows",
    });
  }
};

// Get one IVR flow
const getFlowById = async (req, res) => {
  try {
    const { id } = req.params;

    const flow = await IVRFlow.findById(id).populate("startNode");

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "IVR flow not found",
      });
    }

    res.status(200).json({
      success: true,
      data: flow,
    });
  } catch (error) {
    console.error("Get flow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get IVR flow",
    });
  }
};

// Get active flow for 1929
const getActiveFlow = async (req, res) => {
  try {
    const { phoneNumber = "1929" } = req.query;

    const flow = await IVRFlow.findOne({
      phoneNumber,
      active: true,
    })
      .sort({ createdAt: -1 })
      .populate("startNode");

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "No active IVR flow found",
      });
    }

    res.status(200).json({
      success: true,
      data: flow,
    });
  } catch (error) {
    console.error("Get active flow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get active IVR flow",
    });
  }
};

// Update IVR flow
const updateFlow = async (req, res) => {
  try {
    const { id } = req.params;

    const flow = await IVRFlow.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "IVR flow not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "IVR flow updated successfully",
      data: flow,
    });
  } catch (error) {
    console.error("Update flow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update IVR flow",
    });
  }
};

// Activate / deactivate flow
const toggleFlow = async (req, res) => {
  try {
    const { id } = req.params;

    const flow = await IVRFlow.findById(id);

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "IVR flow not found",
      });
    }

    flow.active = !flow.active;

    await flow.save();

    res.status(200).json({
      success: true,
      message: `IVR flow ${
        flow.active ? "activated" : "deactivated"
      } successfully`,
      data: flow,
    });
  } catch (error) {
    console.error("Toggle flow error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update flow status",
    });
  }
};

module.exports = {
  createFlow,
  getFlows,
  getFlowById,
  getActiveFlow,
  updateFlow,
  toggleFlow,
};