# 1929 IVR Backend

Backend application for a **1929 IVR Call Flow System** built using **Node.js, Express.js, MongoDB, and Mongoose**.

The system handles incoming 1929 calls, identifies whether the caller is a registered or non-registered customer, manages the IVR flow, processes customer input, and creates complaints when required.

---

## 1. Project Overview

The 1929 IVR system provides different services based on the customer's registration status.

### Non-Registered Customer

The customer gets the following options:

1. Remaining Credit
2. Theft or Loss
3. Connect with Support Agent

### Registered Customer

The customer gets:

1. Remaining Credit
2. Current Offer
3. Renewal Date
4. Next Active Options
5. Internet APN Configuration
6. Theft or Loss
7. Connect with Support Agent

---

## 2. Technology Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JavaScript
* REST API
* dotenv
* CORS

---

## 3. System Architecture

```text
Customer
   |
   | Calls 1929
   v
Telephony / IVR System
   |
   v
Express API
   |
   v
Routes
   |
   v
Validation Middleware
   |
   v
Controllers
   |
   v
Services
   |
   v
Mongoose Models
   |
   v
MongoDB
```

---

## 4. Folder Structure

```text
ivr-1929-backend/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── Customer.js
│   │   ├── IVRFlow.js
│   │   ├── IVRNode.js
│   │   ├── CallSession.js
│   │   ├── CallInput.js
│   │   └── Complaint.js
│   │
│   ├── controllers/
│   │   ├── customerController.js
│   │   ├── flowController.js
│   │   ├── nodeController.js
│   │   ├── callController.js
│   │   └── complaintController.js
│   │
│   ├── services/
│   │   ├── customerService.js
│   │   ├── ivrService.js
│   │   ├── callService.js
│   │   └── complaintService.js
│   │
│   ├── routes/
│   │   ├── customerRoutes.js
│   │   ├── flowRoutes.js
│   │   ├── nodeRoutes.js
│   │   ├── callRoutes.js
│   │   └── complaintRoutes.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── utils/
│   │   └── generateId.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 5. Database Collections

The application uses six main MongoDB collections.

### Customer

Stores registered customers.

```text
Customer
├── name
├── phoneNumber
├── customerType
└── active
```

### IVRFlow

Stores the main IVR configuration.

```text
IVRFlow
├── name
├── phoneNumber
├── language
├── startNode
└── active
```

### IVRNode

Stores individual IVR menus and actions.

```text
IVRNode
├── flowId
├── name
├── type
├── prompt
├── customerType
└── options
```

### CallSession

Stores information about each call.

```text
CallSession
├── callId
├── callerNumber
├── customer
├── customerType
├── flow
├── currentNode
├── status
├── startedAt
└── endedAt
```

### CallInput

Stores DTMF or speech input from the caller.

```text
CallInput
├── call
├── node
├── input
├── inputType
└── timestamp
```

### Complaint

Stores complaints such as theft and loss.

```text
Complaint
├── complaintId
├── call
├── customer
├── callerNumber
├── category
├── description
└── status
```

---

# 6. IVR Call Flow

```text
                    CALL 1929
                        |
                        v
               Get Caller Number
                        |
                        v
              Search Customer DB
                        |
                 Customer Found?
                  /           \
                YES            NO
                 |              |
                 v              v
            REGISTERED     NON_REGISTERED
                 |              |
                 v              v
        Registered Menu    Non-Registered Menu
                 |              |
                 |              |
       ┌─────────┼──────┐       |
       |         |      |       |
       v         v      v       v
    Credit     Offer   ...   Credit
       |
       v
  Process Input
       |
       v
    Next Node
       |
       ├── API
       ├── Complaint
       ├── Support Queue
       ├── Transfer
       └── End
```

---

# 7. Registered Customer Flow

```text
Registered Customer
        |
        v
     Main Menu
        |
        ├── 1 → Remaining Credit
        |
        ├── 2 → Current Offer
        |
        ├── 3 → Renewal Date
        |
        ├── 4 → Next Active Options
        |
        ├── 5 → Internet APN Configuration
        |
        ├── 6 → Theft or Loss
        |
        └── 7 → Support Agent
```

---

# 8. Non-Registered Customer Flow

```text
Non-Registered Customer
        |
        v
     Main Menu
        |
        ├── 1 → Remaining Credit
        |
        ├── 2 → Theft or Loss
        |
        └── 3 → Support Agent
```

---

# 9. API Routes

## Health Check

```http
GET /api/health
```

---

## Customer APIs

```http
POST   /api/customers
GET    /api/customers
GET    /api/customers/:phoneNumber
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Create Customer

```http
POST /api/customers
```

Request:

```json
{
  "name": "John Doe",
  "phoneNumber": "9876543210"
}
```

---

# 10. IVR Flow APIs

```http
POST  /api/flows
GET   /api/flows
GET   /api/flows/active
GET   /api/flows/:id
PUT   /api/flows/:id
PATCH /api/flows/:id/toggle
```

### Create Flow

```http
POST /api/flows
```

```json
{
  "name": "1929 Main IVR",
  "phoneNumber": "1929",
  "language": "en-IN",
  "active": true
}
```

---

# 11. IVR Node APIs

```http
POST   /api/nodes
GET    /api/nodes
GET    /api/nodes/flow/:flowId
GET    /api/nodes/:id
PUT    /api/nodes/:id
DELETE /api/nodes/:id
```

### Example Registered Menu

```json
{
  "flowId": "FLOW_ID",
  "name": "Registered Customer Menu",
  "type": "MENU",
  "customerType": "REGISTERED",
  "prompt": "Please select an option",
  "options": [
    {
      "digit": "1",
      "label": "Remaining Credit"
    },
    {
      "digit": "2",
      "label": "Current Offer"
    },
    {
      "digit": "3",
      "label": "Renewal Date"
    },
    {
      "digit": "4",
      "label": "Next Active Options"
    },
    {
      "digit": "5",
      "label": "Internet APN Configuration"
    },
    {
      "digit": "6",
      "label": "Theft or Loss"
    },
    {
      "digit": "7",
      "label": "Connect with Support Agent"
    }
  ]
}
```

---

# 12. Call APIs

```http
POST /api/calls/start
GET  /api/calls/:callId
POST /api/calls/:callId/input
POST /api/calls/:callId/end
```

### Start Call

```http
POST /api/calls/start
```

```json
{
  "callerNumber": "9876543210",
  "phoneNumber": "1929"
}
```

The backend checks the caller's number.

```text
Customer found
      |
      v
REGISTERED
      |
      v
Registered Menu
```

If the customer is not found:

```text
Customer not found
      |
      v
NON_REGISTERED
      |
      v
Non-Registered Menu
```

---

# 13. Process IVR Input

```http
POST /api/calls/:callId/input
```

Request:

```json
{
  "input": "1",
  "inputType": "DTMF"
}
```

The backend:

1. Finds the call.
2. Finds the current IVR node.
3. Stores the customer input.
4. Finds the selected option.
5. Finds the next node.
6. Updates the call session.
7. Returns the next IVR node.

---

# 14. Complaint APIs

```http
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/phone/:phoneNumber
GET    /api/complaints/:id
PUT    /api/complaints/:id
DELETE /api/complaints/:id
```

### Create Complaint

```http
POST /api/complaints
```

```json
{
  "callId": "CALL_ID",
  "callerNumber": "9876543210",
  "category": "THEFT",
  "description": "Customer reported theft"
}
```

The system generates a complaint ID automatically:

```text
CMP-A81F29CD
```

---

# 15. Complaint Categories

Currently supported:

```text
THEFT
LOSS
GENERAL
OTHER
```

Complaint status:

```text
OPEN
IN_PROGRESS
RESOLVED
CLOSED
```

---

# 16. Middleware

### Validation Middleware

Validates required request fields before the controller is executed.

```text
Request
   |
   v
Validation Middleware
   |
   ├── Invalid → 400 Response
   |
   └── Valid
         |
         v
     Controller
```

### Error Middleware

Handles unexpected application errors.

```text
Controller / Service
        |
      Error
        |
        v
Error Middleware
        |
        v
Standard Error Response
```

---

# 17. Services

The business logic is separated from controllers.

```text
customerService.js
        |
        └── Customer operations

ivrService.js
        |
        └── IVR flow and node operations

callService.js
        |
        └── Call lifecycle and input processing

complaintService.js
        |
        └── Complaint operations
```

---

# 18. Request Flow

A normal API request follows:

```text
Client / IVR
     |
     v
Route
     |
     v
Validation Middleware
     |
     v
Controller
     |
     v
Service
     |
     v
Model
     |
     v
MongoDB
```

---

# 19. Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ivr1929
```

For MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

Do not commit `.env` to Git.

---

# 20. Installation

Clone or download the project and install dependencies:

```bash
npm install
```

Required packages:

```text
express
mongoose
dotenv
cors
```

Development package:

```text
nodemon
```

Install:

```bash
npm install express mongoose dotenv cors
npm install --save-dev nodemon
```

---

# 21. Package Scripts

`package.json`:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

---

# 22. Server

The application starts from:

```text
src/server.js
```

The server:

1. Loads environment variables.
2. Connects to MongoDB.
3. Loads the Express application.
4. Starts the HTTP server.

```text
server.js
    |
    ├── dotenv
    |
    ├── connectDB()
    |
    └── app.listen()
```

---

# 23. Application Entry

`src/app.js` configures:

```text
CORS
JSON Parser
URL Parser
Health Check
Customer Routes
Flow Routes
Node Routes
Call Routes
Complaint Routes
Error Middleware
```

---

# 24. Future Integrations

The current backend provides the IVR flow and database layer.

The following external services can be integrated later:

```text
Remaining Credit
       ↓
Credit / Balance API

Current Offer
       ↓
Offer API

Renewal Date
       ↓
Subscription API

Next Active Options
       ↓
Subscription API

Internet APN
       ↓
Configuration API

Theft / Loss
       ↓
Complaint / Blocking API

Support Agent
       ↓
Contact Center / Queue System
```

---

# 25. Future Improvements

Possible additions:

* Authentication and authorization
* Admin dashboard
* Agent management
* Queue management
* Call recording
* Call history
* Call event logging
* API integrations
* SMS notifications
* Multi-language IVR
* Speech recognition
* Text-to-speech
* Rate limiting
* Request logging
* API documentation with Swagger
* Automated tests
* Docker deployment

---

## Summary

The 1929 IVR backend is designed around a simple flow:

```text
Caller
  ↓
1929
  ↓
Identify Customer
  ↓
Registered / Non-Registered
  ↓
Load Appropriate IVR Menu
  ↓
Process Customer Input
  ↓
Move Through IVR Nodes
  ↓
API / Complaint / Support Agent
  ↓
Complete Call
```

The architecture separates **routes, controllers, services, models, and middleware**, making the backend easy to maintain and extend.
