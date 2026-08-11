const express = require("express");
const cors = require("cors");

// Routes
const customerRoutes = require("./routes/customerRoutes");
const flowRoutes = require("./routes/flowRoutes");
const nodeRoutes = require("./routes/nodeRoutes");
const callRoutes = require("./routes/callRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

// Error middleware
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();


// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "1929 IVR Backend is running",
    timestamp: new Date(),
  });
});


// =====================================================
// API ROUTES
// =====================================================

// Customer APIs
app.use(
  "/api/customers",
  customerRoutes
);

// IVR Flow APIs
app.use(
  "/api/flows",
  flowRoutes
);

// IVR Node APIs
app.use(
  "/api/nodes",
  nodeRoutes
);

// Call APIs
app.use(
  "/api/calls",
  callRoutes
);

// Complaint APIs
app.use(
  "/api/complaints",
  complaintRoutes
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(errorMiddleware);


module.exports = app;