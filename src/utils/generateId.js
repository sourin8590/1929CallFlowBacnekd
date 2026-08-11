const crypto = require("crypto");

// Generate unique call ID
const generateCallId = () => {
  return `CALL-${crypto.randomUUID()}`;
};

// Generate unique complaint ID
const generateComplaintId = () => {
  return `CMP-${crypto.randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;
};

module.exports = {
  generateCallId,
  generateComplaintId,
};