const express = require("express");

const {
  startCall,
  getCall,
  handleInput,
  endCall,
} = require("../controllers/callController");

const {
  validateRequired,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Start call
router.post(
  "/start",
  validateRequired(["callerNumber"]),
  startCall
);

// Get call
router.get("/:callId", getCall);

// Process DTMF / speech input
router.post(
  "/:callId/input",
  validateRequired(["input"]),
  handleInput
);

// End call
router.post(
  "/:callId/end",
  endCall
);

module.exports = router;