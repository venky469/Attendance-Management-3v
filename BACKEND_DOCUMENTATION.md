# Backend Documentation - Employee Management System
## MERN Stack Implementation Guide

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Face Recognition System](#face-recognition-system)
8. [Real-time Features](#real-time-features)
9. [Cron Jobs & Automation](#cron-jobs--automation)
10. [Performance Optimization](#performance-optimization)
11. [Deployment](#deployment)
12. [Security Best Practices](#security-best-practices)
13. [Recent Updates & New Features (2025)](#recent-updates--new-features-2025)
14. [Troubleshooting](#troubleshooting)

---

## 1. Architecture Overview

### System Architecture

\`\`\`
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React Client  │◄────►│  Express API    │◄────►│   MongoDB       │
│   (Next.js)     │      │  (Node.js)      │      │   (Database)    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                         │                         │
        │                         │                         │
        ▼                         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Face-API.js    │      │   JWT Auth      │      │  Mongoose ODM   │
│  MediaPipe      │      │   Middleware    │      │  (Schema)       │
└─────────────────┘      └─────────────────┘      └─────────────────┘
\`\`\`

### Design Patterns Used

1. **MVC Pattern**: Model-View-Controller separation
2. **Repository Pattern**: Data access layer abstraction
3. **Singleton Pattern**: Database connection pooling
4. **Factory Pattern**: User role-based object creation
5. **Observer Pattern**: Real-time event handling (WebSocket)

### Key Features

- Multi-tenant institution management
- Role-based access control (RBAC)
- Facial recognition attendance
- Location-based verification
- Real-time notifications
- Automated reporting
- Leave management system

---

## 2. Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x+ | Runtime environment |
| Express.js | 4.x | Web framework |
| MongoDB | 6.x+ | Database |
| Mongoose | 8.x | ODM for MongoDB |
| JWT | 9.x | Authentication tokens |
| bcrypt | 5.x | Password hashing |

### Additional Libraries

\`\`\`json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "node-cron": "^3.0.2",
    "winston": "^3.11.0",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "ws": "^8.16.0",
    "pdfkit": "^0.13.0",
    "exceljs": "^4.4.0",
    "nodemailer": "^6.9.8",
    "node-cache": "^1.0.2"
  }
}
\`\`\`

---

## 3. Project Structure

\`\`\`
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── cloudinary.js        # Cloudinary config
│   │   └── constants.js         # App constants
│   │
│   ├── models/
│   │   ├── Staff.js             # Staff schema
│   │   ├── Student.js           # Student schema
│   │   ├── Attendance.js        # Attendance schema
│   │   ├── Institution.js       # Institution schema
│   │   ├── LeaveRequest.js      # Leave request schema
│   │   ├── ShiftSettings.js     # Shift settings schema
│   │   ├── FaceTemplate.js      # Face template cache
│   │   ├── Counter.js           # Auto-increment counter
│   │   └── LoginHistory.js      # Login history for live monitoring
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── staffController.js   # Staff CRUD operations
│   │   ├── studentController.js # Student CRUD operations
│   │   ├── attendanceController.js # Attendance operations
│   │   ├── leaveController.js   # Leave management
│   │   ├── institutionController.js # Institution management
│   │   └── adminController.js   # Admin-specific operations (data deletion, monitoring)
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── roleCheck.js         # Role-based access
│   │   ├── errorHandler.js      # Error handling
│   │   ├── validateRequest.js   # Input validation
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── cache.js             # API response caching
│   │
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── staff.js             # Staff routes
│   │   ├── students.js          # Student routes
│   │   ├── attendance.js        # Attendance routes
│   │   ├── leaves.js            # Leave routes
│   │   ├── institutions.js      # Institution routes
│   │   ├── admin.js             # Admin routes (monitoring, data deletion)
│   │   └── loginHistory.js      # Login history routes (heartbeat)
│   │
│   ├── services/
│   │   ├── faceRecognitionService.js # Face matching logic
│   │   ├── locationService.js   # GPS verification
│   │   ├── notificationService.js # Push notifications
│   │   ├── emailService.js      # Email notifications
│   │   └── reportService.js     # Report generation
│   │   └── websocketService.js  # WebSocket implementation
│   │
│   ├── utils/
│   │   ├── logger.js            # Winston logger
│   │   ├── validators.js        # Input validators
│   │   ├── helpers.js           # Helper functions
│   │   └── cache.js             # In-memory cache
│   │
│   ├── cron/
│   │   ├── autoMarkAbsent.js    # Auto-mark absent job
│   │   └── quarterlyReport.js   # Quarterly report job
│   │
│   └── app.js                   # Express app setup
│
├── .env                         # Environment variables
├── .env.example                 # Env template
├── package.json                 # Dependencies
└── server.js                    # Entry point
\`\`\`

---

## 4. Database Schema

### MongoDB Collections

#### 4.1 Staff Collection

\`\`\`javascript
// models/Staff.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  employeeCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include in queries by default
  },
  phone: {
    type: String,
    trim: true
  },
  photoUrl: {
    type: String
  },
  department: {
    type: String,
    enum: ['Engineering', 'HR', 'Finance', 'Operations', 'Academics'],
    required: true
  },
  role: {
    type: String,
    enum: ['SuperAdmin', 'Admin', 'Manager', 'Staff', 'Teacher'],
    default: 'Staff'
  },
  shift: {
    type: String,
    enum: ['Morning', 'Evening', 'Night']
  },
  profession: {
    type: String,
    enum: [
      'Professor', 'Associate Professor', 'Assistant Professor',
      'Lecturer', 'Lab Assistant', 'Administrative Officer',
      'Accountant', 'Librarian', 'Security Guard',
      'Maintenance Staff', 'Counselor', 'Sports Instructor', 'Other'
    ],
    required: true
  },
  qualification: String,
  experience: String,
  specialization: String,
  parentName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  institutionName: {
    type: String,
    index: true
  },
  branchClass: {
    type: String, // e.g., "ECE-A", "CSE-B"
    index: true
  },
  // Face Recognition Data
  faceDescriptor: {
    type: [Number], // 128-dimensional face embedding
    select: false // Heavy data, only load when needed
  },
  // Location Verification
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  locationVerificationEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
staffSchema.index({ institutionName: 1, department: 1 });
staffSchema.index({ role: 1, shift: 1 });
staffSchema.index({ branchClass: 1 });

// Virtual for attendance records
staffSchema.virtual('attendanceRecords', {
  ref: 'Attendance',
  localField: '_id',
  foreignField: 'personId'
});

// Pre-save hook to hash password
staffSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
staffSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Staff', staffSchema);
\`\`\`

#### 4.2 Student Collection

\`\`\`javascript
// models/Student.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  phone: String,
  photoUrl: String,
  department: {
    type: String,
    enum: ['Engineering', 'HR', 'Finance', 'Operations', 'Academics']
  },
  role: {
    type: String,
    default: 'Student'
  },
  shift: {
    type: String,
    enum: ['Morning', 'Evening', 'Night']
  },
  classLevel: {
    type: String,
    enum: [
      'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
      'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9',
      'Class 10', 'Class 11', 'Class 12', 'UG', 'PG'
    ],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    enum: ['ECE', 'CSE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AERO', 'CHEM', 'BIOTECH', 'TEXTILE']
  },
  semester: String,
  cgpa: String,
  branchClass: {
    type: String, // e.g., "ECE-A"
    index: true
  },
  parentName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  institutionName: {
    type: String,
    index: true
  },
  faceDescriptor: {
    type: [Number],
    select: false
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  locationVerificationEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
studentSchema.index({ institutionName: 1, classLevel: 1 });
studentSchema.index({ branchClass: 1, academicYear: 1 });

// Password hashing
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
\`\`\`

#### 4.3 Attendance Collection

\`\`\`javascript
// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  personType: {
    type: String,
    enum: ['staff', 'student'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'present'
  },
  department: String,
  role: String,
  shift: String,
  // Face Recognition Data
  matchConfidence: {
    type: Number, // 0-1 scale
    min: 0,
    max: 1
  },
  // Location Data
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  // Additional Metadata
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  }
}, {
  timestamps: true
});

// Compound indexes for performance
attendanceSchema.index({ personId: 1, date: 1 });
attendanceSchema.index({ date: 1, status: 1 });
attendanceSchema.index({ personType: 1, date: 1, status: 1 });

// Prevent duplicate attendance on same day
attendanceSchema.index(
  { personId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
\`\`\`

#### 4.4 Institution Collection

\`\`\`javascript
// models/Institution.js
const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['School', 'College', 'University'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      default: 100 // meters
    }
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: String,
  adminEmail: String,
  // Features Configuration
  features: {
    faceRecognition: {
      type: Boolean,
      default: true
    },
    locationVerification: {
      type: Boolean,
      default: true
    },
    leaveManagement: {
      type: Boolean,
      default: true
    },
    quarterlyReports: {
      type: Boolean,
      default: true
    }
  },
  // Shift Timings
  shifts: [{
    name: {
      type: String,
      enum: ['Morning', 'Evening', 'Night']
    },
    startTime: String, // HH:MM format
    endTime: String,
    gracePeriod: {
      type: Number,
      default: 10 // minutes
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Institution', institutionSchema);
\`\`\`

#### 4.5 Leave Request Collection

\`\`\`javascript
// models/LeaveRequest.js
const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  personType: {
    type: String,
    enum: ['staff', 'student'],
    required: true
  },
  personName: String,
  personEmail: String,
  leaveType: {
    type: String,
    enum: ['sick', 'casual', 'annual', 'maternity', 'emergency', 'other'],
    required: true
  },
  startDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  reviewedDate: Date,
  reviewComments: String,
  approverEmail: String,
  approverName: String,
  attachments: [{
    url: String,
    fileName: String
  }],
  department: String,
  role: String,
  shift: String
}, {
  timestamps: true
});

// Indexes
leaveRequestSchema.index({ personId: 1, status: 1 });
leaveRequestSchema.index({ status: 1, appliedDate: -1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
\`\`\`

#### 4.6 Face Template Cache Collection

\`\`\`javascript
// models/FaceTemplate.js
const mongoose = require('mongoose');

const faceTemplateSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true
  },
  personType: {
    type: String,
    enum: ['staff', 'student'],
    required: true
  },
  faceDescriptor: {
    type: [Number],
    required: true
  },
  photoUrl: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Cache metadata
  cacheHits: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// TTL index - auto-delete after 24 hours
faceTemplateSchema.index(
  { lastUpdated: 1 },
  { expireAfterSeconds: 86400 } // 24 hours
);

module.exports = mongoose.model('FaceTemplate', faceTemplateSchema);
\`\`\`

#### 4.7 Login History Collection

\`\`\`javascript
// models/LoginHistory.js
const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  name: String,
  role: String,
  institutionId: String,
  isOnline: {
    type: Boolean,
    default: false
  },
  lastActiveTime: {
    type: Date,
    default: Date.now,
    index: true
  },
  loginTime: Date,
  logoutTime: Date,
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Compound index for efficient queries
loginHistorySchema.index({ userId: 1, email: 1 }, { unique: true });
loginHistorySchema.index({ isOnline: 1, lastActiveTime: -1 });

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
\`\`\`

---

## 5. API Endpoints

### 5.1 Authentication Routes

\`\`\`javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validateRequest');
const { protect } = require('../middleware/auth');
const LoginHistory = require('../models/LoginHistory');
const logger = require('../utils/logger');

/**
 * @route   POST /api/auth/login
 * @desc    Login user (staff/student)
 * @access  Public
 */
router.post('/login', 
  validateRequest(['email', 'password']),
  authController.login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', 
  protect,
  async (req, res) => {
    try {
      const userId = req.user._id.toString();
      const userEmail = req.user.email;
      const userType = req.userType;

      // Update LoginHistory to mark as offline
      await LoginHistory.findOneAndUpdate(
        { userId: userId, email: userEmail },
        { $set: { isOnline: false, logoutTime: new Date() } },
        { upsert: true }
      );
      
      logger.info(`User logged out: ${userEmail} (${userType})`);
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({ success: false, message: 'Server error during logout' });
    }
  }
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password',
  protect,
  validateRequest(['oldPassword', 'newPassword']),
  authController.changePassword
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password',
  validateRequest(['email']),
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password/:token',
  validateRequest(['password']),
  authController.resetPassword
);

module.exports = router;
\`\`\`

### 5.2 Staff Routes

\`\`\`javascript
// routes/staff.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect, restrictTo } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

// Protect all routes
router.use(protect);

/**
 * @route   GET /api/staff
 * @desc    Get all staff members
 * @access  Admin, Manager
 */
router.get('/',
  restrictTo('SuperAdmin', 'Admin', 'Manager'),
  cacheMiddleware(300), // Cache for 5 minutes
  staffController.getAllStaff
);

/**
 * @route   POST /api/staff
 * @desc    Create new staff member
 * @access  Admin
 */
router.post('/',
  restrictTo('SuperAdmin', 'Admin'),
  upload.single('photo'),
  async (req, res, next) => {
    // Invalidate cache after creation
    await invalidateCache('/api/staff');
    next();
  },
  staffController.createStaff
);

/**
 * @route   GET /api/staff/:id
 * @desc    Get staff by ID
 * @access  Admin, Manager, Self
 */
router.get('/:id',
  cacheMiddleware(300), // Cache for 5 minutes
  staffController.getStaffById
);

/**
 * @route   PUT /api/staff/:id
 * @desc    Update staff member
 * @access  Admin, Self
 */
router.put('/:id',
  upload.single('photo'),
  async (req, res, next) => {
    // Invalidate cache after update
    await invalidateCache('/api/staff');
    await invalidateCache(`/api/staff/${req.params.id}`);
    next();
  },
  staffController.updateStaff
);

/**
 * @route   DELETE /api/staff/:id
 * @desc    Delete staff member
 * @access  Admin
 */
router.delete('/:id',
  restrictTo('SuperAdmin', 'Admin'),
  async (req, res, next) => {
    // Invalidate cache after deletion
    await invalidateCache('/api/staff');
    await invalidateCache(`/api/staff/${req.params.id}`);
    next();
  },
  staffController.deleteStaff
);

/**
 * @route   POST /api/staff/:id/face-descriptor
 * @desc    Upload face descriptor for staff
 * @access  Admin, Self
 */
router.post('/:id/face-descriptor',
  async (req, res, next) => {
    // Invalidate cache as face descriptor is sensitive
    await invalidateCache('/api/staff');
    await invalidateCache(`/api/staff/${req.params.id}`);
    next();
  },
  staffController.uploadFaceDescriptor
);

module.exports = router;
\`\`\`

### 5.3 Attendance Routes

\`\`\`javascript
// routes/attendance.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

router.use(protect);

/**
 * @route   POST /api/attendance/mark
 * @desc    Mark attendance (face recognition + location)
 * @access  All authenticated users
 */
router.post('/mark',
  async (req, res, next) => {
    // Invalidate attendance-related caches after marking
    await invalidateCache('/api/attendance');
    await invalidateCache('/api/students'); // May affect student stats
    await invalidateCache('/api/staff'); // May affect staff stats
    next();
  },
  attendanceController.markAttendance
);

/**
 * @route   GET /api/attendance
 * @desc    Get attendance records (filtered)
 * @access  Admin, Manager, Self
 */
router.get('/',
  cacheMiddleware(60), // Cache short-term for frequent access
  attendanceController.getAttendance
);

/**
 * @route   GET /api/attendance/summary
 * @desc    Get attendance summary/dashboard
 * @access  Admin, Manager
 */
router.get('/summary',
  cacheMiddleware(300),
  attendanceController.getSummary
);

/**
 * @route   GET /api/attendance/export
 * @desc    Export attendance to CSV/Excel
 * @access  Admin, Manager
 */
router.get('/export',
  attendanceController.exportAttendance
);

/**
 * @route   GET /api/attendance/person/:personId
 * @desc    Get attendance for specific person
 * @access  Admin, Manager, Self
 */
router.get('/person/:personId',
  cacheMiddleware(300),
  attendanceController.getPersonAttendance
);

module.exports = router;
\`\`\`

### 5.4 Student Routes

\`\`\`javascript
// routes/students.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, restrictTo } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

router.use(protect);

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Admin, Manager
 */
router.get('/',
  restrictTo('SuperAdmin', 'Admin', 'Manager'),
  cacheMiddleware(300),
  studentController.getAllStudents
);

/**
 * @route   POST /api/students
 * @desc    Create a new student
 * @access  Admin
 */
router.post('/',
  restrictTo('SuperAdmin', 'Admin'),
  upload.single('photo'),
  async (req, res, next) => {
    await invalidateCache('/api/students'); // Invalidate student list cache
    next();
  },
  studentController.createStudent
);

/**
 * @route   GET /api/students/:id
 * @desc    Get student by ID
 * @access  Admin, Manager, Self
 */
router.get('/:id',
  cacheMiddleware(300),
  studentController.getStudentById
);

/**
 * @route   PUT /api/students/:id
 * @desc    Update student by ID
 * @access  Admin, Self
 */
router.put('/:id',
  upload.single('photo'),
  async (req, res, next) => {
    await invalidateCache('/api/students'); // Invalidate student list cache
    await invalidateCache(`/api/students/${req.params.id}`); // Invalidate specific student cache
    next();
  },
  studentController.updateStudent
);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student by ID
 * @access  Admin
 */
router.delete('/:id',
  restrictTo('SuperAdmin', 'Admin'),
  async (req, res, next) => {
    await invalidateCache('/api/students');
    await invalidateCache(`/api/students/${req.params.id}`);
    next();
  },
  studentController.deleteStudent
);

/**
 * @route   POST /api/students/:id/face-descriptor
 * @desc    Upload face descriptor for student
 * @access  Admin, Self
 */
router.post('/:id/face-descriptor',
  async (req, res, next) => {
    await invalidateCache('/api/students');
    await invalidateCache(`/api/students/${req.params.id}`);
    next();
  },
  studentController.uploadFaceDescriptor
);

module.exports = router;
\`\`\`

### 5.5 Leave Routes

\`\`\`javascript
// routes/leaves.js
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { protect, restrictTo } = require('../middleware/auth');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

router.use(protect);

/**
 * @route   POST /api/leaves
 * @desc    Apply for leave
 * @access  Authenticated user
 */
router.post('/',
  async (req, res, next) => {
    await invalidateCache('/api/leaves');
    next();
  },
  leaveController.applyLeave
);

/**
 * @route   GET /api/leaves
 * @desc    Get leave requests (filtered by status and user)
 * @access  Authenticated user, Admin, Manager
 */
router.get('/',
  cacheMiddleware(300),
  leaveController.getLeaveRequests
);

/**
 * @route   GET /api/leaves/:id
 * @desc    Get a specific leave request
 * @access  Authenticated user, Admin, Manager
 */
router.get('/:id',
  cacheMiddleware(300),
  leaveController.getLeaveRequestById
);

/**
 * @route   PUT /api/leaves/:id/approve
 * @desc    Approve a leave request
 * @access  Admin, Manager
 */
router.put('/:id/approve',
  restrictTo('SuperAdmin', 'Admin', 'Manager'),
  async (req, res, next) => {
    await invalidateCache('/api/leaves');
    await invalidateCache(`/api/leaves/${req.params.id}`);
    next();
  },
  leaveController.approveLeave
);

/**
 * @route   PUT /api/leaves/:id/reject
 * @desc    Reject a leave request
 * @access  Admin, Manager
 */
router.put('/:id/reject',
  restrictTo('SuperAdmin', 'Admin', 'Manager'),
  async (req, res, next) => {
    await invalidateCache('/api/leaves');
    await invalidateCache(`/api/leaves/${req.params.id}`);
    next();
  },
  leaveController.rejectLeave
);

/**
 * @route   PUT /api/leaves/:id/cancel
 * @desc    Cancel a leave request
 * @access  Authenticated user
 */
router.put('/:id/cancel',
  async (req, res, next) => {
    await invalidateCache('/api/leaves');
    await invalidateCache(`/api/leaves/${req.params.id}`);
    next();
  },
  leaveController.cancelLeave
);

module.exports = router;
\`\`\`

### 5.6 Institution Routes

\`\`\`javascript
// routes/institutions.js
const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institutionController');
const { protect, restrictTo } = require('../middleware/auth');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

router.use(protect);

/**
 * @route   GET /api/institutions
 * @desc    Get all institutions
 * @access  Admin, Manager, SuperAdmin
 */
router.get('/',
  restrictTo('SuperAdmin', 'Admin', 'Manager'),
  cacheMiddleware(600), // Cache for 10 minutes
  institutionController.getAllInstitutions
);

/**
 * @route   POST /api/institutions
 * @desc    Create a new institution
 * @access  SuperAdmin
 */
router.post('/',
  restrictTo('SuperAdmin'),
  async (req, res, next) => {
    await invalidateCache('/api/institutions');
    next();
  },
  institutionController.createInstitution
);

/**
 * @route   GET /api/institutions/:id
 * @desc    Get institution by ID
 * @access  SuperAdmin, Admin, Manager
 */
router.get('/:id',
  cacheMiddleware(600),
  institutionController.getInstitutionById
);

/**
 * @route   PUT /api/institutions/:id
 * @desc    Update institution by ID
 * @access  SuperAdmin
 */
router.put('/:id',
  restrictTo('SuperAdmin'),
  async (req, res, next) => {
    await invalidateCache('/api/institutions');
    await invalidateCache(`/api/institutions/${req.params.id}`);
    next();
  },
  institutionController.updateInstitution
);

/**
 * @route   DELETE /api/institutions/:id
 * @desc    Delete institution by ID
 * @access  SuperAdmin
 */
router.delete('/:id',
  restrictTo('SuperAdmin'),
  async (req, res, next) => {
    await invalidateCache('/api/institutions');
    await invalidateCache(`/api/institutions/${req.params.id}`);
    next();
  },
  institutionController.deleteInstitution
);

module.exports = router;
\`\`\`

### 5.7 Admin Routes

\`\`\`javascript
// routes/admin.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const LoginHistory = require('../models/LoginHistory');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const { invalidateCache } = require('../middleware/cache');

/**
 * @route   GET /api/admin/online-users
 * @desc    Get all currently online users
 * @access  SuperAdmin
 */
router.get('/online-users', 
  protect, 
  restrictTo('SuperAdmin'),
  async (req, res) => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      // Find users active in last 5 minutes
      const onlineUsers = await LoginHistory.find({
        isOnline: true,
        lastActiveTime: { $gte: fiveMinutesAgo }
      });
      
      // Aggregate statistics
      const stats = {
        total: onlineUsers.length,
        byRole: {},
        byInstitution: {},
        users: onlineUsers.map(user => ({
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId,
          lastActiveTime: user.lastActiveTime,
          isOnline: true
        }))
      };
      
      // Count by role and institution
      onlineUsers.forEach(user => {
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
        if (user.institutionId) {
          stats.byInstitution[user.institutionId] = 
            (stats.byInstitution[user.institutionId] || 0) + 1;
        }
      });
      
      res.json(stats);
      
    } catch (error) {
      logger.error('Online users error:', error);
      res.status(500).json({ error: 'Failed to fetch online users' });
    }
  }
);

/**
 * @route   POST /api/admin/delete-data
 * @desc    Permanently delete database collections with email backups
 * @access  SuperAdmin
 */
router.post('/delete-data',
  protect,
  restrictTo('SuperAdmin'),
  async (req, res) => {
    try {
      const { collections, sendEmailBackup } = req.body;
      const deletedCounts = {};
      const backupFiles = {};
      
      // Step 1: Fetch all data before deletion
      const dataToBackup = {};
      
      if (collections.includes('notifications')) {
        dataToBackup.notifications = await Notification.find({});
      }
      if (collections.includes('attendance')) {
        dataToBackup.attendance = await Attendance.find({});
      }
      if (collections.includes('staff')) {
        dataToBackup.staff = await Staff.find({});
      }
      if (collections.includes('students')) {
        dataToBackup.students = await Student.find({});
      }
      
      // Step 2: Generate PDF report
      const pdfBuffer = await generateDeletionPDF(dataToBackup, collections);
      
      // Step 3: Generate XLSX files for each collection
      for (const [collection, data] of Object.entries(dataToBackup)) {
        backupFiles[collection] = await generateExcelBackup(collection, data);
      }
      
      // Step 4: Send email to all admins
      let emailsSent = 0;
      if (sendEmailBackup) {
        const admins = await Staff.find({ 
          role: { $in: ['SuperAdmin', 'Admin', 'Manager'] } 
        });
        
        const adminEmails = admins.map(admin => admin.email);
        
        if (adminEmails.length > 0) {
          try {
            await sendDeletionEmail(
              adminEmails,
              {
                collections,
                counts: Object.fromEntries(
                  Object.entries(dataToBackup).map(([key, val]) => [key, val.length])
                ),
                deletedBy: req.user.name,
                timestamp: new Date().toISOString()
              },
              pdfBuffer,
              backupFiles
            );
            emailsSent = adminEmails.length;
            logger.info(`Deletion backup emails sent to ${emailsSent} admins.`);
          } catch (emailError) {
            logger.error('Email sending failed during data deletion:', emailError);
            // Proceed with deletion but inform the user about email failure
            return res.status(500).json({
              success: false,
              deleted: {},
              emailsSent: 0,
              warning: `Data deletion initiated, but email backup failed to send. Error: ${emailError.message}`
            });
          }
        } else {
          logger.warn('No admin users found to send deletion backup emails.');
        }
      }
      
      // Step 5: Delete data from database
      for (const collection of collections) {
        let deleteResult;
        
        switch (collection) {
          case 'notifications':
            deleteResult = await Notification.deleteMany({});
            deletedCounts.notifications = deleteResult.deletedCount;
            break;
          case 'attendance':
            deleteResult = await Attendance.deleteMany({});
            deletedCounts.attendance = deleteResult.deletedCount;
            break;
          case 'staff':
            deleteResult = await Staff.deleteMany({});
            deletedCounts.staff = deleteResult.deletedCount;
            break;
          case 'students':
            deleteResult = await Student.deleteMany({});
            deletedCounts.students = deleteResult.deletedCount;
            break;
          default:
            logger.warn(`Collection '${collection}' not supported for deletion.`);
        }
      }
      
      // Invalidate relevant caches
      if (collections.includes('staff')) invalidateCache('/api/staff');
      if (collections.includes('students')) invalidateCache('/api/students');
      if (collections.includes('attendance')) invalidateCache('/api/attendance');
      
      res.json({
        success: true,
        deleted: deletedCounts,
        emailsSent,
        message: 'Data deleted successfully.' + (sendEmailBackup && emailsSent > 0 ? ' Backup emails sent to admins.' : '')
      });
      
    } catch (error) {
      logger.error('Data deletion error:', error);
      res.status(500).json({ error: 'Failed to delete data' });
    }
  }
);

/**
 * Generate PDF report for deletion
 */
async function generateDeletionPDF(data, collections) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    
    doc.fontSize(20).text('Database Deletion Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`);
    doc.text(`Collections Deleted: ${collections.join(', ')}`);
    doc.moveDown();
    
    for (const [collection, items] of Object.entries(data)) {
      if (items && items.length > 0) {
        doc.fontSize(16).text(`${collection.charAt(0).toUpperCase() + collection.slice(1)} (${items.length} records)`);
        doc.moveDown();
        
        // Display first 5 records in JSON format
        items.slice(0, 5).forEach((item, index) => {
          // Convert Mongoose documents to plain objects if necessary
          const itemObject = item.toObject ? item.toObject() : item;
          doc.fontSize(10).text(`Record ${index + 1}:`);
          doc.text(JSON.stringify(itemObject, null, 2));
          doc.moveDown();
        });
        
        if (items.length > 5) {
          doc.fontSize(10).text(`... and ${items.length - 5} more records.`);
          doc.moveDown();
        }
      }
    }
    
    doc.end();
  });
}

/**
 * Generate Excel backup for collection
 */
async function generateExcelBackup(collectionName, data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(collectionName);
  
  if (data.length > 0) {
    // Add headers from the first object's keys
    const firstItem = data[0].toObject ? data[0].toObject() : data[0];
    const headers = Object.keys(firstItem);
    worksheet.addRow(headers);
    
    // Add data rows
    data.forEach(item => {
      const obj = item.toObject ? item.toObject() : item;
      // Ensure the order of values matches headers
      const rowValues = headers.map(header => obj[header]);
      worksheet.addRow(rowValues);
    });
  } else {
    worksheet.addRow(['No data available']);
  }
  
  return await workbook.xlsx.writeBuffer();
}

/**
 * Send deletion notification email
 */
async function sendDeletionEmail(recipients, summary, pdfBuffer, xlsxBuffers) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const attachments = [
    {
      filename: 'deletion-report.pdf',
      content: pdfBuffer,
      contentType: 'application/pdf'
    },
    ...Object.entries(xlsxBuffers).map(([collection, buffer]) => ({
      filename: `${collection}-backup.xlsx`,
      content: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }))
  ];
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: '⚠️ Database Deletion Notification - Backup Attached',
    html: `
      <h1>Database Collections Deleted</h1>
      <p>The following data has been permanently deleted:</p>
      <ul>
        ${summary.collections.map(col => 
          `<li><strong>${col.charAt(0).toUpperCase() + col.slice(1)}</strong>: ${summary.counts[col] || 0} records</li>`
        ).join('')}
      </ul>
      <p><strong>Deleted by:</strong> ${summary.deletedBy}</p>
      <p><strong>Timestamp:</strong> ${summary.timestamp}</p>
      <p>Backup files are attached to this email.</p>
    `,
    attachments
  });
}

module.exports = router;
\`\`\`

### 5.8 Login History Routes

\`\`\`javascript
// routes/loginHistory.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const LoginHistory = require('../models/LoginHistory');
const logger = require('../utils/logger');

/**
 * @route   POST /api/login-history/status
 * @desc    Update user status (heartbeat)
 * @access  Private (for authenticated users)
 */
router.post('/status',
  protect,
  async (req, res) => {
    try {
      const { userId, email, isOnline, lastActiveTime } = req.body;
      
      if (!userId || !email) {
        return res.status(400).json({ 
          error: 'User ID and email are required' 
        });
      }
      
      // Ensure lastActiveTime is a valid Date
      const activeTime = new Date(lastActiveTime);
      if (isNaN(activeTime.getTime())) {
        return res.status(400).json({ error: 'Invalid lastActiveTime format' });
      }
      
      // Update or create login history record
      await LoginHistory.findOneAndUpdate(
        { userId: userId, email: email },
        {
          $set: {
            isOnline,
            lastActiveTime: activeTime,
            updatedAt: new Date()
          }
        },
        { upsert: true, new: true } // new: true returns the updated document
      );
      
      // Log the status update for debugging
      logger.debug(`User status updated: userId=${userId}, isOnline=${isOnline}, lastActiveTime=${activeTime.toISOString()}`);
      
      res.json({ success: true, message: 'Status updated' });
      
    } catch (error) {
      logger.error('Status update error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }
);

module.exports = router;
\`\`\`

---

## 6. Authentication & Authorization

### 6.1 JWT Authentication

\`\`\`javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const LoginHistory = require('../models/LoginHistory'); // Import LoginHistory model
const logger = require('../utils/logger');

/**
 * Protect routes - verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and retrieve user details
    let user;
    let userType;
    
    if (decoded.type === 'staff') {
      user = await Staff.findById(decoded.id).select('-password');
      userType = 'staff';
    } else if (decoded.type === 'student') {
      user = await Student.findById(decoded.id).select('-password');
      userType = 'student';
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid user type in token'
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists or token is invalid'
      });
    }
    
    // Grant access
    req.user = user;
    req.userType = userType; // Add userType to request object
    
    // Update LoginHistory for heartbeat tracking
    try {
      await LoginHistory.findOneAndUpdate(
        { userId: user._id.toString(), email: user.email },
        {
          $set: {
            isOnline: true,
            lastActiveTime: new Date(),
            name: user.name, // Update name/role if they change
            role: user.role,
            institutionId: user.institutionName,
            loginTime: user.loginTime || new Date(), // Record initial login time if not set
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
          }
        },
        { upsert: true } // Create record if it doesn't exist
      );
      logger.debug(`Login history updated for ${user.email}`);
    } catch (loginHistoryError) {
      logger.error(`Error updating login history for ${user.email}:`, loginHistoryError);
      // Continue processing the request even if login history update fails
    }
    
    next();
    
  } catch (error) {
    logger.error('Authentication error:', error.message);
    // Handle specific JWT errors for better feedback
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Restrict to specific roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

/**
 * Generate JWT token
 */
exports.generateToken = (id, type) => {
  return jwt.sign(
    { id, type },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
\`\`\`

### 6.2 Login Controller

\`\`\`javascript
// controllers/authController.js
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const LoginHistory = require('../models/LoginHistory'); // Import LoginHistory
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const emailService = require('../services/emailService'); // Assuming emailService exists

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check in both Staff and Student collections
    let user = await Staff.findOne({ email }).select('+password');
    let userType = 'staff';
    
    if (!user) {
      user = await Student.findOne({ email }).select('+password');
      userType = 'student';
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      });
    }
    
    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      });
    }
    
    // Generate token
    const token = generateToken(user._id, userType);
    
    // Record login history
    const loginTime = new Date();
    await LoginHistory.findOneAndUpdate(
      { userId: user._id.toString(), email: user.email },
      {
        $set: {
          isOnline: true,
          lastActiveTime: loginTime,
          loginTime: loginTime, // Record the actual login time
          name: user.name,
          role: user.role,
          institutionId: user.institutionName,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        }
      },
      { upsert: true }
    );
    
    // Remove password from output
    user.password = undefined;
    
    // Log successful login
    logger.info(`User logged in: ${email} (${userType}) from IP: ${req.ip}`);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: userType,
        institutionName: user.institutionName,
        department: user.department,
        shift: user.shift
      }
    });
    
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;
    const userType = req.userType;
    
    // Get user with password
    const Model = userType === 'staff' ? Staff : Student;
    const user = await Model.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // Verify old password
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    logger.info(`Password changed for user: ${user.email}`);
    
    // Invalidate session tokens and update LoginHistory status
    await LoginHistory.findOneAndUpdate(
      { userId: user._id.toString(), email: user.email },
      { $set: { isOnline: false, logoutTime: new Date() } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please log in again.'
    });
    
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password.'
    });
  }
};

/**
 * Forgot password - send reset token
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user in both collections
    let user = await Staff.findOne({ email });
    let userType = 'staff';
    
    if (!user) {
      user = await Student.findOne({ email });
      userType = 'student';
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with that email not found.'
      });
    }
    
    // Generate reset token
    const resetToken = user.getResetPasswordToken(); // Assuming getResetPasswordToken method exists
    await user.save({ validateBeforeSave: false }); // Save without validation to include token
    
    // Construct reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/password-reset/${resetToken}`;
    
    // Send email
    await emailService.sendPasswordResetEmail(user.email, resetUrl);
    
    logger.info(`Password reset email sent to ${email}`);
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully.'
    });
    
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending password reset email.'
    });
  }
};

/**
 * Reset password with token
 */
exports.resetPassword = async (req, res) => {
  try {
    // Note: req.params.token is available from the route definition
    const { password } = req.body;
    const { token } = req.params;
    
    // Find user by reset token
    // Ensure findByToken method correctly matches and expires token
    let user = await Staff.findByToken(token);
    let userType = 'staff';
    
    if (!user) {
      user = await Student.findByToken(token);
      userType = 'student';
    }
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }
    
    // Reset password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    logger.info(`Password reset for user: ${user.email}`);
    
    // Log out user and invalidate existing sessions
    await LoginHistory.findOneAndUpdate(
      { userId: user._id.toString(), email: user.email },
      { $set: { isOnline: false, logoutTime: new Date() } }
    );
    
    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.'
    });
    
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password.'
    });
  }
};

// Helper methods that might be needed in models (e.g., Staff.js, Student.js)
// These should be added to the respective Mongoose schemas:
/*
// In Staff.js and Student.js schemas:

// Method to generate password reset token
schema.methods.getResetPasswordToken = function() {
  const crypto = require('crypto');
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set expiry
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  
  return resetToken; // Return the plain token for email
};

// Static method to find user by reset token
schema.statics.findByToken = async function(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return await this.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
};
*/
\`\`\`

---

## 7. Face Recognition System

### 7.1 Face Recognition Service

\`\`\`javascript
// services/faceRecognitionService.js
const FaceTemplate = require('../models/FaceTemplate');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const logger = require('../utils/logger');

/**
 * Calculate Euclidean distance between two face descriptors
 */
function euclideanDistance(desc1, desc2) {
  if (!desc1 || !desc2 || desc1.length !== desc2.length) {
    logger.warn('Invalid descriptors provided for distance calculation.');
    return Infinity;
  }
  
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  
  return Math.sqrt(sum);
}

/**
 * Match face descriptor against database
 */
exports.matchFace = async (faceDescriptor, institutionName = null) => {
  try {
    const MATCH_THRESHOLD = 0.6; // Lower = stricter match. Adjust as needed.
    
    // Build query filter
    const filter = {};
    if (institutionName) {
      filter.institutionName = institutionName;
    }
    
    // Try cache first
    let cachedTemplates = await FaceTemplate.find(filter);
    
    let candidates = [];
    
    if (cachedTemplates.length > 0) {
      // Use cached templates
      candidates = cachedTemplates.map(template => ({
        personId: template.personId,
        personType: template.personType,
        faceDescriptor: template.faceDescriptor,
        photoUrl: template.photoUrl, // Include for potential debugging
        name: template.name // Assuming name might be stored or accessible
      }));
      
      logger.info(`Using ${candidates.length} cached face templates for matching.`);
    } else {
      // Load from database
      const [staffMembers, students] = await Promise.all([
        Staff.find(filter).select('_id name faceDescriptor photoUrl institutionName'),
        Student.find(filter).select('_id name faceDescriptor photoUrl institutionName')
      ]);
      
      // Combine results and structure for caching/matching
      const allMembers = [
        ...staffMembers.map(s => ({
          personId: s._id,
          personType: 'staff',
          faceDescriptor: s.faceDescriptor,
          name: s.name,
          institutionName: s.institutionName
        })),
        ...students.map(s => ({
          personId: s._id,
          personType: 'student',
          faceDescriptor: s.faceDescriptor,
          name: s.name,
          institutionName: s.institutionName
        }))
      ].filter(c => c.faceDescriptor && c.faceDescriptor.length > 0 && c.institutionName === institutionName); // Ensure institution match
      
      candidates = allMembers;
      
      // Cache the templates if successful
      if (candidates.length > 0) {
        await FaceTemplate.insertMany(
          candidates.map(c => ({
            personId: c.personId,
            personType: c.personType,
            faceDescriptor: c.faceDescriptor,
            photoUrl: c.photoUrl, // Store photoUrl in cache if available
            name: c.name // Store name in cache for easier debugging
          })),
          { ordered: false } // Continue even if some inserts fail (e.g., duplicates)
        ).catch((err) => logger.warn('Partial failure inserting face templates into cache:', err.writeErrors));
        logger.info(`Loaded and cached ${candidates.length} face templates from database.`);
      } else {
        logger.warn('No face templates found in the database for the specified institution.');
      }
    }
    
    if (candidates.length === 0) {
      logger.warn('No candidates available for face matching.');
      return {
        success: false,
        message: 'No face data available for matching.'
      };
    }
    
    // Find best match
    let bestMatch = null;
    let bestDistance = Infinity;
    
    for (const candidate of candidates) {
      const distance = euclideanDistance(faceDescriptor, candidate.faceDescriptor);
      
      if (distance < bestDistance && distance < MATCH_THRESHOLD) {
        bestDistance = distance;
        bestMatch = candidate;
      }
    }
    
    if (bestMatch) {
      // Calculate confidence (0-1 scale)
      const confidence = Math.max(0, 1 - (bestDistance / MATCH_THRESHOLD));
      
      logger.info(`Face matched: ${bestMatch.personType} ${bestMatch.name} (${bestMatch.personId}) with confidence ${confidence.toFixed(2)} (Distance: ${bestDistance.toFixed(4)})`);
      
      return {
        success: true,
        personId: bestMatch.personId,
        personType: bestMatch.personType,
        confidence,
        distance: bestDistance
      };
    }
    
    logger.warn('No face match found within the threshold.');
    return {
      success: false,
      message: 'No matching face found.'
    };
    
  } catch (error) {
    logger.error('Face matching error:', error);
    throw error; // Re-throw to be handled by the controller
  }
};

/**
 * Store face descriptor
 */
exports.storeFaceDescriptor = async (personId, personType, faceDescriptor, photoUrl) => {
  try {
    const Model = personType === 'staff' ? Staff : Student;
    
    // Update the primary model
    await Model.findByIdAndUpdate(personId, {
      faceDescriptor,
      photoUrl
    });
    
    // Update cache or insert into FaceTemplate
    await FaceTemplate.findOneAndUpdate(
      { personId },
      {
        personId,
        personType,
        faceDescriptor,
        photoUrl,
        lastUpdated: new Date()
      },
      { upsert: true } // Create if not exists, update if it does
    );
    
    logger.info(`Face descriptor stored for ${personType}: ${personId}`);
    return { success: true };
    
  } catch (error) {
    logger.error(`Store face descriptor error for ${personType} ${personId}:`, error);
    throw error;
  }
};

/**
 * Clear face template cache
 */
exports.clearCache = async () => {
  try {
    await FaceTemplate.deleteMany({});
    logger.info('Face template cache cleared.');
    return { success: true };
  } catch (error) {
    logger.error('Error clearing face template cache:', error);
    throw error;
  }
};
\`\`\`

---

## 8. Real-time Features

### 8.1 WebSocket Implementation

\`\`\`javascript
// services/websocketService.js
const WebSocket = require('ws');
const logger = require('../utils/logger');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Map<userId, WebSocket>
  }
  
  /**
   * Initialize WebSocket server
   */
  initialize(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws', // Define the WebSocket endpoint path
      // You might want to add validation for origin/headers here for security
      verifyClient: (info, callback) => {
        // Example: Basic origin check
        const origin = info.origin;
        const allowedOrigins = [
          process.env.FRONTEND_URL, 
          // Add other allowed origins if necessary
        ];
        if (allowedOrigins.includes(origin)) {
          callback(true); // Accept connection
        } else {
          logger.warn(`WebSocket connection rejected from origin: ${origin}`);
          callback(false, 403, 'Forbidden'); // Reject connection
        }
      }
    });
    
    this.wss.on('connection', (ws, req) => {
      const clientIp = req.socket.remoteAddress;
      logger.info(`New WebSocket connection from ${clientIp}`);
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data, clientIp);
        } catch (error) {
          logger.error(`WebSocket message parse error from ${clientIp}:`, error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON format' }));
        }
      });
      
      ws.on('close', (code, reason) => {
        // Remove from clients map if registered
        for (const [userId, client] of this.clients.entries()) {
          if (client === ws) {
            this.clients.delete(userId);
            logger.info(`WebSocket client unregistered: ${userId}`);
            break;
          }
        }
        logger.info(`WebSocket connection closed from ${clientIp} (Code: ${code}, Reason: ${reason})`);
      });
      
      ws.on('error', (error) => {
        logger.error(`WebSocket error from ${clientIp}:`, error);
      });
    });
    
    logger.info('WebSocket server initialized on path /ws');
  }
  
  /**
   * Handle incoming messages
   */
  handleMessage(ws, data, clientIp) {
    logger.debug(`Received WebSocket message from ${clientIp}:`, data);
    
    switch (data.type) {
      case 'register':
        // Expecting { type: 'register', userId: '...', token: '...' }
        // Token validation can be added here for authentication
        if (data.userId) {
          this.clients.set(data.userId, ws);
          logger.info(`Client registered: ${data.userId} from ${clientIp}`);
          ws.send(JSON.stringify({ type: 'registered', userId: data.userId }));
        } else {
          logger.warn(`Registration failed: missing userId from ${clientIp}`);
          ws.send(JSON.stringify({ type: 'error', message: 'Registration failed: userId missing' }));
        }
        break;
        
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
        
      default:
        logger.warn(`Unknown message type '${data.type}' from ${clientIp}`);
        ws.send(JSON.stringify({ type: 'error', message: `Unknown message type: ${data.type}` }));
    }
  }
  
  /**
   * Broadcast to all connected clients
   */
  broadcast(event, data) {
    if (!this.wss || this.wss.clients.size === 0) {
      logger.warn('No WebSocket clients connected for broadcast.');
      return;
    }
    
    const message = JSON.stringify({ event, data });
    let sentCount = 0;
    
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        sentCount++;
      }
    });
    
    logger.info(`Broadcasted event "${event}" to ${sentCount}/${this.wss.clients.size} clients.`);
  }
  
  /**
   * Send a message to a specific user
   */
  sendToUser(userId, event, data) {
    const client = this.clients.get(userId);
    
    if (client && client.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event, data });
      client.send(message);
      logger.debug(`Sent event "${event}" to user ${userId}.`);
    } else {
      logger.warn(`Could not send event "${event}" to user ${userId}: Client not found or not open.`);
    }
  }
  
  /**
   * Notify when attendance is marked
   */
  notifyAttendanceMarked(attendance) {
    // Broadcast to all, or specific admin roles if needed
    this.broadcast('attendance:marked', {
      personId: attendance.personId,
      personType: attendance.personType,
      status: attendance.status,
      timestamp: attendance.timestamp,
      date: attendance.date,
      matchConfidence: attendance.matchConfidence
    });
  }
  
  /**
   * Notify when a leave request is submitted or updated
   */
  notifyLeaveRequest(leaveRequest) {
    // This could be broadcast to all, or specifically to admins/managers
    this.broadcast('leave:updated', {
      id: leaveRequest._id,
      personId: leaveRequest.personId,
      personName: leaveRequest.personName,
      personType: leaveRequest.personType,
      leaveType: leaveRequest.leaveType,
      startDate: leaveRequest.startDate,
      endDate: leaveRequest.endDate,
      status: leaveRequest.status,
      appliedDate: leaveRequest.appliedDate
    });
  }
  
  /**
   * Notify about new notifications (e.g., system alerts)
   */
  notifyNewNotification(notification) {
    this.broadcast('notification:new', notification);
  }
  
  /**
   * Notify about user login/logout events
   */
  notifyUserStatusChange(userHistoryRecord) {
    this.broadcast('user:status_change', {
      userId: userHistoryRecord.userId,
      email: userHistoryRecord.email,
      name: userHistoryRecord.name,
      role: userHistoryRecord.role,
      institutionId: userHistoryRecord.institutionId,
      isOnline: userHistoryRecord.isOnline,
      lastActiveTime: userHistoryRecord.lastActiveTime
    });
  }
}

module.exports = new WebSocketService();
\`\`\`

---

## 9. Cron Jobs & Automation

### 9.1 Auto-Mark Absent Job

\`\`\`javascript
// cron/autoMarkAbsent.js
const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const logger = require('../utils/logger');
const websocketService = require('../services/websocketService'); // Import for notifications

/**
 * Run daily at a specific time to mark absent users
 */
function startAutoMarkAbsentJob() {
  // Schedule to run daily at 11:59 PM
  // Format: 'minute hour day_of_month month day_of_week'
  cron.schedule('59 23 * * *', async () => {
    try {
      logger.info('Starting auto-mark absent job...');
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Fetch all active staff and students to ensure we consider everyone
      const [allStaff, allStudents] = await Promise.all([
        Staff.find({ isActive: true }, '_id').lean(), // Use lean for performance
        Student.find({ isActive: true }, '_id').lean()
      ]);
      
      // Combine all person IDs
      const allPersonIds = [
        ...allStaff.map(s => s._id.toString()),
        ...allStudents.map(s => s._id.toString())
      ];
      
      // Get attendance records already marked for today
      const attendanceToday = await Attendance.find({ date: today }).distinct('personId').lean();
      const markedPersonIds = attendanceToday.map(id => id.toString());
      
      // Identify persons who have not marked attendance
      const absentPersonIds = allPersonIds.filter(
        id => !markedPersonIds.includes(id)
      );
      
      if (absentPersonIds.length === 0) {
        logger.info('No absent persons to mark for today.');
        return;
      }
      
      // Prepare records for insertion
      const absentRecordsToInsert = [];
      
      // Fetch details needed for the Attendance record (e.g., personType, institutionName)
      const staffDetails = await Staff.find({ _id: { $in: absentPersonIds } }).lean();
      const studentDetails = await Student.find({ _id: { $in: absentPersonIds } }).lean();
      
      const personMap = new Map();
      staffDetails.forEach(s => personMap.set(s._id.toString(), { type: 'staff', ...s }));
      studentDetails.forEach(s => personMap.set(s._id.toString(), { type: 'student', ...s }));
      
      for (const personId of absentPersonIds) {
        const personData = personMap.get(personId);
        if (!personData) {
          logger.warn(`Could not find data for absent person ID: ${personId}. Skipping.`);
          continue;
        }
        
        absentRecordsToInsert.push({
          personId: personId,
          personType: personData.type,
          date: today,
          status: 'absent',
          timestamp: new Date(),
          department: personData.department, // Add relevant details
          role: personData.role,
          shift: personData.shift,
          // location: could be null or a default if location is mandatory for absence
          // institutionName: personData.institutionName // Could add this as well
        });
      }
      
      if (absentRecordsToInsert.length > 0) {
        // Insert absent records
        await Attendance.insertMany(absentRecordsToInsert);
        logger.info(`Marked ${absentRecordsToInsert.length} persons as absent for ${today}.`);
        
        // Notify relevant parties via WebSocket
        absentRecordsToInsert.forEach(record => {
          // Notify admins/supervisors if needed
          // For now, broadcasting generally
          websocketService.notifyAttendanceMarked({
            personId: record.personId,
            personType: record.personType,
            status: record.status,
            date: record.date,
            timestamp: record.timestamp
          });
        });
      }
      
    } catch (error) {
      logger.error('Auto-mark absent job failed:', error);
    }
  }, {
    scheduled: true, // Ensure the job is scheduled immediately on startup
    timezone: "UTC" // Or your server's timezone, e.g., "America/New_York"
  });
  
  logger.info('Auto-mark absent job scheduled to run daily at 23:59 UTC.');
}

module.exports = { startAutoMarkAbsentJob };
\`\`\`

### 9.2 Quarterly Report Job

\`\`\`javascript
// cron/quarterlyReport.js
const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');
const logger = require('../utils/logger');
const emailService = require('../services/emailService'); // Assumes emailService is set up
const { generateCsvFromStats } = require('../utils/helpers'); // Assuming a helper function

/**
 * Run on the first day of each quarter to generate and email reports.
 */
function startQuarterlyReportJob() {
  // Schedule to run at 6 AM on the 1st of January, April, July, October
  // Format: 'minute hour day_of_month month day_of_week'
  cron.schedule('0 6 1 1,4,7,10 *', async () => {
    try {
      logger.info('Starting quarterly attendance report generation...');
      
      // Calculate the start and end dates for the *previous* quarter
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11
      const currentYear = now.getFullYear();
      
      let quarterStartDate = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1); // Start of current quarter
      let quarterEndDate = new Date(quarterStartDate.getFullYear(), quarterStartDate.getMonth() + 1, 0); // End of current quarter (last day)
      
      // Adjust to previous quarter
      quarterStartDate.setMonth(quarterStartDate.getMonth() - 3);
      quarterEndDate.setMonth(quarterEndDate.getMonth() - 3);
      
      // Format dates for query
      const startDateStr = quarterStartDate.toISOString().split('T')[0];
      const endDateStr = quarterEndDate.toISOString().split('T')[0];
      
      logger.info(`Generating report for period: ${startDateStr} to ${endDateStr}`);
      
      // Aggregate attendance data for the specified period
      const attendanceStats = await Attendance.aggregate([
        {
          $match: {
            date: { $gte: startDateStr, $lte: endDateStr }
          }
        },
        {
          $group: {
            _id: {
              personId: '$personId',
              status: '$status'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.personId',
            present: {
              $sum: {
                $cond: [{ $eq: ['$_id.status', 'present'] }, '$count', 0]
              }
            },
            absent: {
              $sum: {
                $cond: [{ $eq: ['$_id.status', 'absent'] }, '$count', 0]
              }
            },
            late: {
              $sum: {
                $cond: [{ $eq: ['$_id.status', 'late'] }, '$count', 0]
              }
            }
          }
        }
      ]).exec(); // Use .exec() for aggregation
      
      // Fetch admin/manager emails to send the report
      const admins = await Staff.find(
        { role: { $in: ['SuperAdmin', 'Admin', 'Manager'] } }, 
        'email name'
      ).lean();
      
      const recipientEmails = admins.map(admin => admin.email);
      const recipientNames = admins.map(admin => admin.name);
      
      if (recipientEmails.length === 0) {
        logger.warn('No admin users found to send quarterly report.');
        return;
      }
      
      // Convert stats to a more usable format and add person details
      const detailedStats = await Promise.all(
        attendanceStats.map(async (stat) => {
          const person = await Staff.findById(stat._id).lean() || await Student.findById(stat._id).lean();
          const totalDays = stat.present + stat.absent + stat.late;
          const attendancePercentage = totalDays > 0 ? ((stat.present / totalDays) * 100).toFixed(2) : 'N/A';
          
          return {
            PersonID: stat._id.toString(),
            Name: person ? person.name : 'Unknown',
            Type: person ? (person.employeeCode ? 'Staff' : 'Student') : 'Unknown',
            Present: stat.present,
            Absent: stat.absent,
            Late: stat.late,
            TotalDays: totalDays,
            AttendancePercent: attendancePercentage
          };
        })
      );
      
      // Generate CSV file content
      const csvContent = generateCsvFromStats(detailedStats); // Assuming generateCsvFromStats is defined elsewhere
      
      // Send email with CSV attachment
      await emailService.sendQuarterlyReport(
        recipientEmails,
        recipientNames,
        csvContent,
        startDateStr,
        endDateStr
      );
      
      logger.info(`Quarterly attendance report for ${startDateStr} to ${endDateStr} sent to ${recipientEmails.length} recipients.`);
      
    } catch (error) {
      logger.error('Quarterly report job failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "UTC" // Or your server's timezone
  });
  
  logger.info('Quarterly report job scheduled to run on Jan 1, Apr 1, Jul 1, Oct 1 at 06:00 UTC.');
}

// Example of generateCsvFromStats helper (place in utils/helpers.js)
/*
exports.generateCsvFromStats = (stats) => {
  if (!stats || stats.length === 0) return 'No data available';
  
  const { Parser } = require('json2csv'); // Install json2csv
  const fields = Object.keys(stats[0]);
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(stats);
  return csv;
};
*/

module.exports = { startQuarterlyReportJob };
\`\`\`

---

## 10. Performance Optimization

### 10.1 Database Indexing

\`\`\`javascript
// Best practices for indexes - applied in models/ files

// Attendance - Most queried collection for daily/hourly checks
// models/Attendance.js
// attendanceSchema.index({ personId: 1, date: 1 }); // Covered by unique index
// attendanceSchema.index({ date: 1, status: 1 });
// attendanceSchema.index({ personType: 1, date: 1, status: 1 }); // Combined for filtering

// Staff - Search and filter operations
// models/Staff.js
// staffSchema.index({ institutionName: 1, department: 1 });
// staffSchema.index({ email: 1 }, { unique: true });
// staffSchema.index({ employeeCode: 1 }, { unique: true });
// staffSchema.index({ institutionName: 1 }); // For institution-specific queries

// Students
// models/Student.js
// studentSchema.index({ institutionName: 1, classLevel: 1 });
// studentSchema.index({ rollNumber: 1 }, { unique: true });
// studentSchema.index({ branchClass: 1 });
// studentSchema.index({ institutionName: 1 });

// Face templates - Cache lookup for matching
// models/FaceTemplate.js
// faceTemplateSchema.index({ personId: 1 }, { unique: true }); // Already unique
// faceTemplateSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 86400 }); // TTL index

// Login History - For live monitoring and heartbeat checks
// models/LoginHistory.js
// loginHistorySchema.index({ userId: 1, email: 1 }, { unique: true }); // Covered by unique index
// loginHistorySchema.index({ isOnline: 1, lastActiveTime: -1 }); // Crucial for finding online users

// Institution - For fetching institution details
// models/Institution.js
// institutionSchema.index({ name: 1 }, { unique: true });

// Leave Requests - For status checks and user-specific queries
// models/LeaveRequest.js
// leaveRequestSchema.index({ personId: 1, status: 1 });
// leaveRequestSchema.index({ status: 1, appliedDate: -1 });
\`\`\`

### 10.2 Connection Pooling

\`\`\`javascript
// config/database.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 100,      // Maximum 100 connections in the pool
      minPoolSize: 10,       // Keep at least 10 connections alive
      maxIdleTimeMS: 60000,  // Close idle connections after 60 seconds
      socketTimeoutMS: 45000, // Timeout for socket operations
      serverSelectionTimeoutMS: 10000, // Timeout for selecting a server
      family: 4,             // Use IPv4 addresses
      retryWrites: true,      // Enable retry writes
      retryReads: true,      // Enable retry reads
      w: 'majority'          // Write concern: write must be acknowledged by the majority of replica set members
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`Connection Pool configured: Max=${options.maxPoolSize}, Min=${options.minPoolSize}, MaxIdleTime=${options.maxIdleTimeMS / 1000}s`);
    
    // Monitor connection pool status
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection pool established.');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
      // Mongoose automatically tries to reconnect
    });
    
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1); // Exit process if initial connection fails
  }
};

module.exports = connectDB;
\`\`\`

### 10.3 Caching Strategy

\`\`\`javascript
// middleware/cache.js
const NodeCache = require('node-cache');
const logger = require('../utils/logger');

// Server-side caching with configurable TTL
const cache = new NodeCache({
  stdTTL: 300,           // Default TTL: 5 minutes (300 seconds)
  checkperiod: 60,       // Check for expired keys every 60 seconds
  useClones: false       // Improves performance by avoiding deep cloning
});

/**
 * Cache middleware for GET requests. Caches responses based on the request URL.
 * @param {number} duration - Cache duration in seconds (defaults to 300s).
 */
exports.cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Construct a unique cache key based on the URL
    const key = `${req.originalUrl || req.url}`;
    
    // Check if the response is already in cache
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
      logger.debug(`Cache HIT for key: ${key}`);
      // Return the cached response
      return res.json(cachedResponse);
    }
    
    logger.debug(`Cache MISS for key: ${key}`);
    
    // Override the res.json method to automatically cache the response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Store the response in cache with the specified duration
      cache.set(key, body, duration);
      logger.debug(`Response cached for key: ${key} with TTL ${duration}s`);
      // Call the original json method to send the response
      return originalJson(body);
    };
    
    // Proceed to the next middleware/route handler
    next();
  };
};

/**
 * Invalidate cache entries that match a given pattern.
 * Useful after data modification operations (POST, PUT, DELETE).
 * @param {string} pattern - A string to match within cache keys.
 */
exports.invalidateCache = (pattern) => {
  try {
    const keys = cache.keys();
    const matchedKeys = keys.filter(key => key.includes(pattern));
    
    if (matchedKeys.length > 0) {
      matchedKeys.forEach(key => cache.del(key));
      logger.info(`Invalidated ${matchedKeys.length} cache keys matching pattern "${pattern}".`);
    } else {
      logger.debug(`No cache keys found matching pattern "${pattern}".`);
    }
  } catch (error) {
    logger.error(`Error invalidating cache for pattern "${pattern}":`, error);
  }
};

/**
 * Clear all entries from the cache.
 */
exports.clearCache = () => {
  try {
    cache.flushAll();
    logger.info('All cache entries flushed.');
  } catch (error) {
    logger.error('Error clearing all cache:', error);
  }
};

// Export the cache instance for potential direct use if needed
module.exports.cache = cache;
\`\`\`

---

## 11. Deployment

### 11.1 Environment Variables

\`\`\`bash
# .env.example

# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_management?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_me
JWT_EXPIRE=7d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (e.g., SendGrid, Gmail via Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_app_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password # Use App Password for Gmail

# Frontend URL (for CORS and email links)
FRONTEND_URL=https://your-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# WebSocket Configuration
WS_PORT=8080 # If running WebSocket on a separate port, otherwise server uses PORT

# Cache Configuration
CACHE_TTL_DEFAULT=300 # Default cache TTL in seconds (5 minutes)

# Cron Job Timezone (Optional, defaults to UTC if not set)
# CRON_TIMEZONE=America/New_York

# Other services
FACE_API_URL=http://localhost:8000 # Example for external face API
\`\`\`

### 11.2 Production Setup

\`\`\`javascript
// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const websocketService = require('./services/websocketService');
const { startAutoMarkAbsentJob } = require('./cron/autoMarkAbsent');
const { startQuarterlyReportJob } = require('./cron/quarterlyReport');

// Initialize express application
const app = express();

// Connect to MongoDB database
connectDB();

// Security middleware
app.use(helmet({
  // Configure CSP for better security
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", process.env.FRONTEND_URL], // Allow frontend scripts
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"], // Allow data URIs and external images
      connectSrc: ["'self'", process.env.FRONTEND_URL, '/ws'], // Allow WebSocket connections
      fontSrc: ["'self'", "data:"],
    },
  },
  hsts: { // HTTP Strict Transport Security
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// Enable CORS for requests from the frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
  credentials: true // Allow cookies and sessions to be sent
}));

// Enable Gzip compression for responses
app.use(compression());

// Body parsers for handling request payloads
app.use(express.json({ limit: '10mb' })); // Increased limit for potential large payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  // Use 'combined' format for production logs, stream to Winston
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }));
} else {
  // Use 'dev' format for development logs
  app.use(morgan('dev'));
}

// Apply rate limiting to all requests
app.use(rateLimiter);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/institutions', require('./routes/institutions'));
app.use('/api/admin', require('./routes/admin')); // Admin routes for monitoring and data deletion
app.use('/api/login-history', require('./routes/loginHistory')); // Route for user status updates

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

// Start the HTTP server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Initialize WebSocket server and attach it to the HTTP server
// This allows WebSocket to use the same port as the HTTP server
websocketService.initialize(server);

// Start scheduled cron jobs
startAutoMarkAbsentJob();
startQuarterlyReportJob();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`UNHANDLED REJECTION! Shutting down server...`, err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! Shutting down server...`, err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown for SIGTERM signal
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed. Process terminated.');
    process.exit(0);
  });
});

// Export app for testing purposes
module.exports = app;
\`\`\`

---

## 12. Security Best Practices

### 12.1 Input Validation

\`\`\`javascript
// middleware/validateRequest.js
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Define common validators
const validators = {
  email: body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  password: body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  oldPassword: body('oldPassword').isLength({ min: 6 }).withMessage('Current password must be at least 6 characters long'),
  newPassword: body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  name: body('name').trim().notEmpty().isLength({ max: 100 }).withMessage('Name is required and cannot exceed 100 characters'),
  phone: body('phone').optional().isMobilePhone().withMessage('Must be a valid phone number'),
  employeeCode: body('employeeCode').trim().notEmpty().withMessage('Employee code is required'),
  rollNumber: body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  department: body('department').trim().notEmpty().withMessage('Department is required'),
  role: body('role').trim().notEmpty().withMessage('Role is required'),
  classLevel: body('classLevel').trim().notEmpty().withMessage('Class level is required'),
  academicYear: body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
  institutionName: body('institutionName').trim().notEmpty().withMessage('Institution name is required'),
  leaveType: body('leaveType').trim().notEmpty().withMessage('Leave type is required'),
  startDate: body('startDate').isISO8601().withMessage('Start date must be a valid ISO date format (YYYY-MM-DD)'),
  endDate: body('endDate').isISO8601().withMessage('End date must be a valid ISO date format (YYYY-MM-DD)'),
  reason: body('reason').trim().notEmpty().isLength({ min: 10 }).withMessage('Reason is required and should be at least 10 characters'),
  shift: body('shift').trim().isIn(['Morning', 'Evening', 'Night']).withMessage('Invalid shift value'),
  // Add more specific validators as needed
};

/**
 * Middleware factory to validate specific request fields.
 * @param {string[]} fields - An array of field names to validate.
 * @returns {function[]} Express middleware array.
 */
exports.validateRequest = (fields) => {
  const fieldValidators = fields.map(field => {
    if (validators[field]) {
      return validators[field];
    } else {
      logger.warn(`No validator defined for field: ${field}`);
      // Fallback for fields without specific validators
      return body(field).exists().withMessage(`${field} is required`);
    }
  });

  return [
    ...fieldValidators,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Log validation errors for debugging
        logger.warn('Validation failed:', errors.array());
        // Return a 400 Bad Request response with validation errors
        return res.status(400).json({
          success: false,
          errors: errors.array().map(err => ({ msg: err.msg, param: err.param }))
        });
      }
      // If validation passes, proceed to the next middleware/handler
      next();
    }
  ];
};
\`\`\`

### 12.2 Rate Limiting

\`\`\`javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General rate limiter for most API endpoints
exports.rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP ${options.keyGenerator(req, res)}`);
    res.status(options.statusCode).send(options.message);
  }
});

// Strict rate limiter specifically for login attempts
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow only 5 login attempts per IP within the window
  skipSuccessfulRequests: true, // Do not limit successful login attempts
  message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  handler: (req, res, next, options) => {
    logger.warn(`Login rate limit exceeded for IP ${options.keyGenerator(req, res)}`);
    res.status(options.statusCode).send(options.message);
  }
});

// Rate limiter for critical operations (e.g., password reset requests)
exports.criticalOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Allow only 3 requests per IP
  message: 'Too many requests for this operation. Please try again later.',
  handler: (req, res, next, options) => {
    logger.warn(`Critical operation limit exceeded for IP ${options.keyGenerator(req, res)}`);
    res.status(options.statusCode).send(options.message);
  }
});
\`\`\`

### 12.3 Secure Headers

\`\`\`javascript
// Use helmet for security headers (configured in server.js)
// app.use(helmet({ ... }));

// Key Security Headers provided by Helmet:
// - X-Content-Type-Options: Prevent MIME-sniffing attacks.
// - X-DNS-Prefetch-Control: Disable DNS prefetching.
// - Expect-CT: Enforce Certificate Transparency.
// - Feature-Policy: Control browser feature access.
// - Frameguard: Prevent clickjacking attacks (using X-Frame-Options).
// - Strict-Transport-Security (HSTS): Enforce HTTPS.
// - X-Download-Options: Prevent MIME-sniffing attacks for downloads.
// - X-Permitted-Cross-Domain-Policies: Control Adobe Flash Player cross-domain policies.
// - Referrer-Policy: Control the Referer header.
// - X-XSS-Protection: Enable the cross-site scripting (XSS) filter.
\`\`\`

### 12.4 Cross-Origin Resource Sharing (CORS)

\`\`\`javascript
// Configured in server.js
app.use(cors({
  origin: process.env.FRONTEND_URL, // Specify allowed frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Explicitly list allowed methods
  credentials: true, // IMPORTANT: Allows cookies/tokens to be sent
  optionsSuccessStatus: 204 // For preflight requests
}));
\`\`\`

### 12.5 Data Encryption & Hashing

- **Passwords**: Hashed using bcrypt (as shown in `Staff.js` and `Student.js` schemas).
- **JWT**: Tokens are signed with a secret key (`process.env.JWT_SECRET`). This secret must be kept highly confidential.
- **Reset Tokens**: Password reset tokens are hashed before storing them in the database to prevent exposure if the database is compromised.

### 12.6 Secure API Design

- **HTTPS**: Always use HTTPS in production environments.
- **Authentication**: Protect all sensitive endpoints using JWT (`protect` middleware).
- **Authorization**: Use role-based access control (`restrictTo` middleware) to limit access to specific functionalities.
- **Error Handling**: Implement a global error handler to avoid leaking sensitive information in error messages.
- **Dependency Management**: Regularly update dependencies to patch security vulnerabilities (`npm audit`).

---

## 13. Recent Updates & New Features (2025)

### 13.1 Live User Monitoring System

This feature provides real-time insights into active users, their roles, and institutions, enhancing administrative oversight and security.

#### Key Components:
- **Heartbeat Tracking**: Users' sessions periodically send a "heartbeat" signal to update their `lastActiveTime`.
- **Real-time Status**: Administrators can view a list of currently online users.
- **Statistics**: Aggregated data on online users by role and institution.

#### API Endpoints

**Get Online Users** (SuperAdmin Only)

\`\`\`http
GET /api/admin/online-users
Authorization: Bearer <token>

Response Example:
{
  "total": 45,
  "byRole": {
    "SuperAdmin": 2,
    "Admin": 5,
    "Manager": 8,
    "Teacher": 15,
    "Staff": 10,
    "Student": 5
  },
  "byInstitution": {
    "inst-001": 25,
    "inst-002": 20
  },
  "users": [
    {
      "userId": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Teacher",
      "institutionId": "inst-001",
      "lastActiveTime": "2025-01-20T10:30:00Z",
      "isOnline": true
    },
    // ... more users
  ]
}
\`\`\`

**Update User Status (Heartbeat)**

This endpoint is called periodically by the client-side application to signal user activity.

\`\`\`http
POST /api/login-history/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-123",
  "email": "john@example.com",
  "isOnline": true,
  "lastActiveTime": "2025-01-20T10:30:00Z" // Client-provided timestamp
}

Response:
{
  "success": true,
  "message": "Status updated"
}
\`\`\`

#### Implementation Details

**Database Schema (`models/LoginHistory.js`)**:
Stores records of user logins, including status (`isOnline`), last active time, IP address, and user agent. Key indexes are set for efficient querying of online users.

**Routes (`routes/loginHistory.js` & `routes/admin.js`)**:
- `/api/login-history/status`: Handles heartbeat updates from authenticated users.
- `/api/admin/online-users`: Provides aggregated data and a list of currently online users for SuperAdmins.

**Middleware (`middleware/auth.js`)**:
The `protect` middleware is enhanced to automatically update the `LoginHistory` record upon successful authentication, marking the user as online and updating their last active time.

\`\`\`javascript
// routes/admin.js (Excerpt for /api/admin/online-users)
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const LoginHistory = require('../models/LoginHistory');
const logger = require('../utils/logger');

/**
 * @route   GET /api/admin/online-users
 * @desc    Get all currently online users
 * @access  SuperAdmin
 */
router.get('/online-users', 
  protect, 
  restrictTo('SuperAdmin'),
  async (req, res) => {
    try {
      // Define the time window for considering a user "online" (e.g., last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      // Find users who are marked as online and have recent activity
      const onlineUsers = await LoginHistory.find({
        isOnline: true,
        lastActiveTime: { $gte: fiveMinutesAgo }
      }).lean(); // Use .lean() for performance
      
      // Aggregate statistics
      const stats = {
        total: onlineUsers.length,
        byRole: {},
        byInstitution: {},
        users: onlineUsers.map(user => ({
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId,
          lastActiveTime: user.lastActiveTime,
          isOnline: true // Explicitly set as true for clarity
        }))
      };
      
      // Populate statistics by role and institution
      onlineUsers.forEach(user => {
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
        if (user.institutionId) {
          stats.byInstitution[user.institutionId] = 
            (stats.byInstitution[user.institutionId] || 0) + 1;
        }
      });
      
      res.json(stats);
      
    } catch (error) {
      logger.error('Error fetching online users:', error);
      res.status(500).json({ error: 'Failed to fetch online users' });
    }
  }
);

module.exports = router;
\`\`\`

\`\`\`javascript
// routes/loginHistory.js (Excerpt for /api/login-history/status)
router.post('/status',
  protect, // Ensures user is authenticated
  async (req, res) => {
    try {
      const { userId, email, isOnline, lastActiveTime } = req.body;
      
      // Basic validation for required fields
      if (!userId || !email) {
        return res.status(400).json({ 
          error: 'User ID and email are required' 
        });
      }
      
      // Validate and parse the timestamp
      const activeTime = new Date(lastActiveTime);
      if (isNaN(activeTime.getTime())) {
        return res.status(400).json({ error: 'Invalid lastActiveTime format' });
      }
      
      // Update or create the LoginHistory record using findOneAndUpdate
      await LoginHistory.findOneAndUpdate(
        { userId: userId, email: email }, // Find the record by userId and email
        {
          $set: {
            isOnline, // Update the online status
            lastActiveTime: activeTime, // Update the last active time
            updatedAt: new Date() // Update the record's modification timestamp
          }
        },
        { upsert: true, new: true } // Create the document if it doesn't exist, and return the updated document
      );
      
      res.json({ success: true, message: 'Status updated' });
      
    } catch (error) {
      logger.error('Error updating user status:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }
);
\`\`\`

### 13.2 Data Deletion System with Email Backups

This feature allows SuperAdmins to securely delete large datasets (e.g., for GDPR compliance or cleanup) while ensuring data is backed up and administrators are notified.

#### Key Features:
- **Selective Deletion**: Specify which collections to delete.
- **Automated Backups**: Generates PDF reports and XLSX files for each deleted collection.
- **Email Notifications**: Sends backups to specified administrators.
- **Audit Trail**: Logs deletion actions.

#### API Endpoint

**Delete Database Collections** (SuperAdmin Only)

\`\`\`http
POST /api/admin/delete-data
Authorization: Bearer <token>
Content-Type: application/json

{
  "collections": ["notifications", "attendance", "staff", "students"], // Array of collection names to delete
  "sendEmailBackup": true // Boolean to trigger email notifications
}

Response Example:
{
  "success": true,
  "deleted": {
    "notifications": 150,
    "attendance": 2500,
    "staff": 45,
    "students": 320
  },
  "emailsSent": 5, // Number of admins the email was sent to
  "message": "Data deleted successfully. Backup emails sent to admins."
}
\`\`\`

#### Implementation Details

**Routes (`routes/admin.js`)**:
A new POST endpoint `/api/admin/delete-data` is implemented, accessible only by SuperAdmins. It orchestrates fetching data, generating backups, sending emails, and then performing the deletions.

**Helper Functions**:
- `generateDeletionPDF`: Creates a PDF summary of the deleted data.
- `generateExcelBackup`: Creates an XLSX file for each collection's data.
- `sendDeletionEmail`: Uses Nodemailer to send the generated backups via email.

\`\`\`javascript
// routes/admin.js (Excerpt for /api/admin/delete-data)
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const Staff = require('../models/Staff');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification'); // Assuming Notification model exists
const logger = require('../utils/logger');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const { invalidateCache } = require('../middleware/cache');

// Helper function to generate PDF report
async function generateDeletionPDF(data, collections) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    
    doc.fontSize(20).text('Database Deletion Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`);
    doc.text(`Collections Deleted: ${collections.join(', ')}`);
    doc.moveDown();
    
    for (const [collection, items] of Object.entries(data)) {
      if (items && items.length > 0) {
        doc.fontSize(16).text(`${collection.charAt(0).toUpperCase() + collection.slice(1)} (${items.length} records)`);
        doc.moveDown();
        
        // Display first 5 records in JSON format for context
        items.slice(0, 5).forEach((item, index) => {
          const itemObject = item.toObject ? item.toObject() : item; // Convert Mongoose doc to object
          doc.fontSize(10).text(`Record ${index + 1}:`);
          doc.text(JSON.stringify(itemObject, null, 2)); // Pretty print JSON
          doc.moveDown();
        });
        
        if (items.length > 5) {
          doc.fontSize(10).text(`... and ${items.length - 5} more records.`);
          doc.moveDown();
        }
      }
    }
    
    doc.end();
  });
}

// Helper function to generate Excel backup
async function generateExcelBackup(collectionName, data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(collectionName);
  
  if (data.length > 0) {
    const firstItem = data[0].toObject ? data[0].toObject() : data[0];
    const headers = Object.keys(firstItem);
    worksheet.addRow(headers); // Add headers
    
    data.forEach(item => {
      const obj = item.toObject ? item.toObject() : item;
      const rowValues = headers.map(header => obj[header]); // Ensure order matches headers
      worksheet.addRow(rowValues);
    });
  } else {
    worksheet.addRow(['No data available for this collection.']);
  }
  
  return await workbook.xlsx.writeBuffer(); // Returns a Promise resolving to the buffer
}

// Helper function to send deletion email
async function sendDeletionEmail(recipients, summary, pdfBuffer, xlsxBuffers) {
  // Configure Nodemailer transporter using environment variables
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // Prepare attachments
  const attachments = [
    { filename: 'deletion-report.pdf', content: pdfBuffer, contentType: 'application/pdf' },
    ...Object.entries(xlsxBuffers).map(([collection, buffer]) => ({
      filename: `${collection}-backup.xlsx`,
      content: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }))
  ];
  
  // Send email
  await transporter.sendMail({
    from: `"${process.env.EMAIL_USER_NAME || 'Admin'}" <${process.env.EMAIL_USER}>`, // Customizable sender name
    to: recipients,
    subject: '⚠️ Database Deletion Notification - Backup Attached',
    html: `
      <h1>Database Collections Deleted</h1>
      <p>The following data has been permanently deleted:</p>
      <ul>
        ${summary.collections.map(col => 
          `<li><strong>${col.charAt(0).toUpperCase() + col.slice(1)}</strong>: ${summary.counts[col] || 0} records</li>`
        ).join('')}
      </ul>
      <p><strong>Deleted by:</strong> ${summary.deletedBy}</p>
      <p><strong>Timestamp:</strong> ${summary.timestamp}</p>
      <p>Backup files are attached to this email.</p>
      <p><em>Note: Please review backups carefully as deleted data cannot be recovered.</em></p>
    `,
    attachments
  });
}

// API Endpoint for Data Deletion
router.post('/delete-data',
  protect,
  restrictTo('SuperAdmin'), // Only SuperAdmins can perform this action
  async (req, res) => {
    try {
      const { collections, sendEmailBackup } = req.body;
      const deletedCounts = {};
      const backupFiles = {}; // Stores { collectionName: buffer }
      const dataToBackup = {}; // Stores { collectionName: [records] }
      
      // Step 1: Fetch all data *before* deletion
      for (const collection of collections) {
        let modelData = [];
        switch (collection) {
          case 'notifications': modelData = await Notification.find({}); break;
          case 'attendance': modelData = await Attendance.find({}); break;
          case 'staff': modelData = await Staff.find({}); break;
          case 'students': modelData = await Student.find({}); break;
          default: logger.warn(`Collection '${collection}' not supported for backup during deletion.`);
        }
        if (modelData.length > 0) {
          dataToBackup[collection] = modelData;
        }
      }
      
      // Step 2: Generate PDF summary report
      const pdfBuffer = await generateDeletionPDF(dataToBackup, collections);
      
      // Step 3: Generate Excel backups for each collection
      for (const [collection, data] of Object.entries(dataToBackup)) {
        backupFiles[collection] = await generateExcelBackup(collection, data);
      }
      
      // Step 4: Send email backups if requested and admins exist
      let emailsSentCount = 0;
      if (sendEmailBackup) {
        const admins = await Staff.find({ 
          role: { $in: ['SuperAdmin', 'Admin', 'Manager'] } 
        }).lean();
        
        const adminEmails = admins.map(admin => admin.email);
        
        if (adminEmails.length > 0) {
          try {
            await sendDeletionEmail(
              adminEmails,
              { // Summary data for email body
                collections,
                counts: Object.fromEntries(Object.entries(dataToBackup).map(([key, val]) => [key, val.length])),
                deletedBy: req.user.name, // Name of the user performing the deletion
                timestamp: new Date().toISOString()
              },
              pdfBuffer,
              backupFiles
            );
            emailsSentCount = adminEmails.length;
            logger.info(`Deletion backup emails sent successfully to ${emailsSentCount} admins.`);
          } catch (emailError) {
            logger.error('Failed to send deletion backup emails:', emailError);
            // Critical: If emails fail, we should NOT proceed with deletion without user confirmation
            // or at least a strong warning. For now, we'll return an error.
            return res.status(500).json({
              success: false,
              deleted: {}, // No data deleted yet
              emailsSent: 0,
              warning: `Email backup failed: ${emailError.message}. Data deletion aborted.`
            });
          }
        } else {
          logger.warn('No admin users found to send deletion backup emails. Proceeding without email notification.');
        }
      }
      
      // Step 5: Perform the actual data deletion from the database
      for (const collection of collections) {
        let deleteResult;
        switch (collection) {
          case 'notifications': deleteResult = await Notification.deleteMany({}); break;
          case 'attendance': deleteResult = await Attendance.deleteMany({}); break;
          case 'staff': deleteResult = await Staff.deleteMany({}); break;
          case 'students': deleteResult = await Student.deleteMany({}); break;
          // No default case needed if collections are validated upfront or handled by frontend
        }
        if (deleteResult) {
          deletedCounts[collection] = deleteResult.deletedCount;
        }
      }
      
      // Step 6: Invalidate relevant caches after deletion
      if (collections.includes('staff')) invalidateCache('/api/staff');
      if (collections.includes('students')) invalidateCache('/api/students');
      if (collections.includes('attendance')) invalidateCache('/api/attendance');
      
      logger.info(`Successfully deleted ${Object.keys(deletedCounts).length} collections. Count:`, deletedCounts);
      
      res.json({
        success: true,
        deleted: deletedCounts,
        emailsSent: emailsSentCount,
        message: `Data deleted successfully.` + (sendEmailBackup && emailsSentCount > 0 ? ' Backup emails sent to admins.' : '')
      });
      
    } catch (error) {
      logger.error('Error during data deletion process:', error);
      res.status(500).json({ error: 'Failed to delete data. Please check server logs.' });
    }
  }
);
\`\`\`

### 13.3 Enhanced Performance Optimizations

#### MongoDB Connection Pooling (100+ Concurrent Users)

**Configuration**: The `config/database.js` file has been updated to increase `maxPoolSize` and configure other pooling options for better handling of high concurrency.

**Requirements**:
- **MongoDB Atlas Tier**: Recommended M10 or higher for robust performance.
- **Network Bandwidth**: Minimum 10 Mbps recommended for smooth operations.
- **Monitoring**: Utilize `db.serverStatus().connections` in the mongo shell to monitor active connections.

#### API Response Caching

**Implementation**: Introduced `middleware/cache.js` with a `NodeCache` implementation for server-side caching of GET request responses.

**Benefits**:
- **Reduced Database Load**: Significantly decreases the number of direct database queries.
- **Faster Responses**: Cached responses are served much quicker (<100ms).
- **Scalability**: Helps the API handle a higher volume of concurrent users (100+).
- **Automatic Invalidation**: Cache entries can be invalidated after data modifications.

\`\`\`javascript
// middleware/cache.js (Excerpt)
const NodeCache = require('node-cache');
const logger = require('../utils/logger');

// Cache instance with configurable TTL and check period
const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL_DEFAULT) || 300, // Default TTL: 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false // Performance optimization
});

// Cache middleware for GET requests
exports.cacheMiddleware = (duration = cache.options.stdTTL) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next(); // Skip caching for non-GET requests
    }
    
    const key = `${req.originalUrl || req.url}`; // Cache key based on URL
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      logger.debug(`Cache HIT for key: ${key}`);
      return res.json(cachedResponse); // Serve cached data
    }
    
    logger.debug(`Cache MISS for key: ${key}`);
    
    // Override res.json to cache the response before sending
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      cache.set(key, body, duration); // Cache the response
      logger.debug(`Response cached for key: ${key} with TTL ${duration}s`);
      return originalJson(body); // Send the response
    };
    
    next(); // Continue to the route handler
  };
};

// Invalidate cache entries matching a pattern
exports.invalidateCache = (pattern) => {
  try {
    const keys = cache.keys();
    const matchedKeys = keys.filter(key => key.includes(pattern));
    
    if (matchedKeys.length > 0) {
      matchedKeys.forEach(key => cache.del(key));
      logger.info(`Invalidated ${matchedKeys.length} cache keys matching pattern "${pattern}".`);
    }
  } catch (error) {
    logger.error(`Error invalidating cache for pattern "${pattern}":`, error);
  }
};

// Clear all cache entries
exports.clearCache = () => {
  try {
    cache.flushAll();
    logger.info('All cache entries flushed.');
  } catch (error) {
    logger.error('Error clearing all cache:', error);
  }
};

module.exports.cache = cache; // Export cache instance if needed elsewhere
\`\`\`

**Usage Example in Routes**:
\`\`\`javascript
// In routes/staff.js
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');

router.get('/', 
  protect, 
  restrictTo('SuperAdmin', 'Admin', 'Manager'),
  cacheMiddleware(300), // Cache list of staff for 5 minutes
  staffController.getAllStaff
);

router.post('/', 
  protect, 
  restrictTo('SuperAdmin', 'Admin'),
  async (req, res, next) => {
    // Invalidate cache after creating a staff member
    await invalidateCache('/api/staff'); 
    next();
  },
  staffController.createStaff
);
\`\`\`

---

## 14. Troubleshooting

### 14.1 Connection Pool Issues

**Problem:** `MongoServerError: connection pool full`

**Cause:** The application is trying to open more database connections than allowed by `maxPoolSize`. This can happen under heavy load or if connections are not being released properly.

**Solution:**
1.  **Increase `maxPoolSize`**: In `config/database.js`, ensure `maxPoolSize` is set appropriately (e.g., `100` or higher).
2.  **Monitor Connections**: Use `db.serverStatus().connections` in the MongoDB shell to check the current number of connections.
3.  **Proper Connection Handling**: Mongoose generally handles connection release automatically. Ensure no long-running operations are blocking connection release.
4.  **Check `minPoolSize` and `maxIdleTimeMS`**: Tune these settings for optimal connection management.

\`\`\`javascript
// config/database.js - Example settings
const options = {
  maxPoolSize: 150, // Increased from 100
  minPoolSize: 15,  // Slightly increased
  maxIdleTimeMS: 60000, // Default 60s is usually fine
  // ... other options
};
\`\`\`

### 14.2 Heartbeat Not Working / Users Not Showing Online

**Problem:** Users are not appearing in the "online users" list, or their status isn't updating correctly.

**Checklist:**
1.  **Heartbeat Endpoint Functionality**: Verify that `POST /api/login-history/status` endpoint is reachable and correctly updating `LoginHistory` records. Check its logs.
2.  **Client-Side Implementation**: Ensure the frontend application is sending heartbeat requests periodically (e.g., every 60 seconds) and includes a valid JWT.
3.  **JWT Validity**: Confirm that the JWT token is not expired and is correctly passed in the `Authorization` header. The `protect` middleware should update `LoginHistory` upon successful token verification.
4.  **`LoginHistory` Updates in `protect` Middleware**: Review `middleware/auth.js` to ensure the `LoginHistory.findOneAndUpdate` call is correctly updating `isOnline` and `lastActiveTime`.
5.  **`online-users` Endpoint Logic**: Check `routes/admin.js` (`/api/admin/online-users`) for the correct `lastActiveTime` threshold (e.g., 5 minutes).
6.  **MongoDB Indexes**: Verify that indexes on `LoginHistory` (`userId`, `email`, `isOnline`, `lastActiveTime`) are present and functional.

**Debug Steps**:
- Add detailed logging within the `protect` middleware and the `/api/login-history/status` route handler to track when updates occur and what data is being processed.
- Manually send requests to `/api/login-history/status` using tools like Postman to isolate the issue.

\`\`\`javascript
// Example logging in middleware/auth.js
// ... inside protect middleware after token verification ...
try {
  // ... existing LoginHistory update logic ...
  logger.debug(`Login history updated for ${user.email}: isOnline=${isOnline}, lastActiveTime=${activeTime.toISOString()}`);
} catch (loginHistoryError) {
  logger.error(`Error updating login history for ${user.email}:`, loginHistoryError);
}
\`\`\`

### 14.3 Data Deletion Email Fails

**Problem:** Backup emails containing deleted data are not being sent.

**Checklist:**
1.  **SMTP Credentials**: Ensure `EMAIL_SERVICE`, `EMAIL_USER`, and `EMAIL_PASSWORD` are correctly configured in the `.env` file. For Gmail, use an "App Password".
2.  **Email Service Limits**: Be aware of sending limits (e.g., Gmail has ~500 emails/day). Large attachments can also cause issues.
3.  **Admin Users**: Verify that there are active admin/manager users with valid email addresses defined in the system.
4.  **Attachment Size**: Most email providers have attachment size limits (e.g., 25MB). Large datasets might exceed this. Consider compressing files or handling very large data differently.
5.  **Nodemailer Transporter Configuration**: Check for typos or incorrect service configurations.
6.  **Error Handling in `sendDeletionEmail`**: Ensure errors during email sending are caught and logged, and that the deletion process doesn't halt if email fails (unless that's the desired strict behavior).

**Solution**:
- Implement robust error handling around the `sendDeletionEmail` call. If it fails, log the error and potentially return a warning message to the user instead of a hard failure.

\`\`\`javascript
// routes/admin.js - inside /delete-data endpoint
// ...
if (sendEmailBackup) {
  try {
    await sendDeletionEmail(...);
    emailsSentCount = adminEmails.length;
    logger.info(`Deletion backup emails sent to ${emailsSentCount} admins.`);
  } catch (emailError) {
    logger.error('Email sending failed during data deletion:', emailError);
    // Crucial: Decide if deletion should proceed without email.
    // Here, we abort deletion if email fails, to prevent data loss without notification.
    return res.status(500).json({
      success: false,
      deleted: {}, // No data deleted yet
      emailsSent: 0,
      warning: `Email backup failed: ${emailError.message}. Data deletion aborted.`
    });
  }
}
// ... rest of deletion logic ...
\`\`\`

### 14.4 Performance Degradation Under Load

**Problem:** API response times become slow, especially when the number of concurrent users exceeds 100.

**Solutions & Mitigation Strategies:**
1.  **Enable Caching**: Ensure `cacheMiddleware` is applied to all relevant GET endpoints. Configure appropriate TTLs.
2.  **Database Indexing**: Regularly review and add indexes for frequently queried fields, especially in `Attendance`, `Staff`, `Student`, and `LoginHistory`.
3.  **Connection Pooling**: Verify that `maxPoolSize` in `config/database.js` is sufficiently high for peak load.
4.  **Query Optimization**: Analyze slow database queries using `db.collection.explain('executionStats')` and refactor them if necessary. Avoid N+1 query problems.
5.  **Asynchronous Operations**: Ensure all I/O operations (database, network) are handled asynchronously using `async/await`.
6.  **CDN for Static Assets**: If the backend serves static files, offload this to a Content Delivery Network.
7.  **Upgrade Infrastructure**: Consider upgrading MongoDB Atlas tier (e.g., M10+) or scaling server resources.
8.  **Logging Performance Metrics**: Implement logging for slow operations to identify bottlenecks.

\`\`\`javascript
// Example of adding slow operation logging in a controller method
// controllers/staffController.js
exports.getAllStaff = async (req, res) => {
  const startTime = Date.now();
  try {
    // ... fetch staff data ...
    const staff = await Staff.find(...).lean(); // Add .lean() for performance
    
    const duration = Date.now() - startTime;
    if (duration > 1000) { // Log if operation takes longer than 1 second
      logger.warn(`getAllStaff took ${duration}ms`);
    }
    
    res.json(staff);
  } catch (error) {
    // ... error handling ...
  }
};
\`\`\`

### 14.5 Stale Data Due to Caching Issues

**Problem:** Users see outdated information because the cache is not being invalidated correctly after data changes.

**Solution:**
- **Smart Cache Invalidation**: After any operation that modifies data (POST, PUT, DELETE), invalidate the relevant cache keys.
  - **Specific Invalidation**: Invalidate cache entries that directly relate to the modified resource (e.g., invalidate `/api/staff/:id` after updating a staff member).
  - **Pattern-Based Invalidation**: Use `invalidateCache` with a pattern to clear multiple related entries (e.g., invalidate all staff-related caches after adding/deleting staff).
  - **Global Cache Clear**: Use `clearCache()` sparingly, perhaps during critical maintenance or after major deployments.

\`\`\`javascript
// Example: Invalidate cache after creating a new staff member in routes/staff.js
router.post('/',
  protect,
  restrictTo('SuperAdmin', 'Admin'),
  async (req, res, next) => {
    await invalidateCache('/api/staff'); // Invalidate the general list endpoint cache
    // Optional: Invalidate specific staff endpoint if relevant (though not created yet)
    next();
  },
  staffController.createStaff
);

// Example: Invalidate cache after updating a staff member
router.put('/:id',
  protect,
  async (req, res, next) => {
    await invalidateCache('/api/staff'); // Invalidate general list
    await invalidateCache(`/api/staff/${req.params.id}`); // Invalidate specific staff member's details
    next();
  },
  staffController.updateStaff
);
\`\`\`

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Recent Changes**: Added live user monitoring, data deletion system with email backups, enhanced performance optimizations (caching, connection pooling), and a troubleshooting guide.
