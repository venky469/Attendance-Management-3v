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
    "morgan": "^1.10.0"
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
│   │   └── Counter.js           # Auto-increment counter
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── staffController.js   # Staff CRUD operations
│   │   ├── studentController.js # Student CRUD operations
│   │   ├── attendanceController.js # Attendance operations
│   │   ├── leaveController.js   # Leave management
│   │   └── institutionController.js # Institution management
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── roleCheck.js         # Role-based access
│   │   ├── errorHandler.js      # Error handling
│   │   ├── validateRequest.js   # Input validation
│   │   └── rateLimiter.js       # Rate limiting
│   │
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── staff.js             # Staff routes
│   │   ├── students.js          # Student routes
│   │   ├── attendance.js        # Attendance routes
│   │   ├── leaves.js            # Leave routes
│   │   └── institutions.js      # Institution routes
│   │
│   ├── services/
│   │   ├── faceRecognitionService.js # Face matching logic
│   │   ├── locationService.js   # GPS verification
│   │   ├── notificationService.js # Push notifications
│   │   ├── emailService.js      # Email notifications
│   │   └── reportService.js     # Report generation
│   │
│   ├── utils/
│   │   ├── logger.js            # Winston logger
│   │   ├── validators.js        # Input validators
│   │   ├── helpers.js           # Helper functions
│   │   └── cache.js             # Memory cache
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
  
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
staffSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Staff', staffSchema);
\`\`\`

#### 4.2 Student Collection

\`\`\`javascript
// models/Student.js
const mongoose = require('mongoose');

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
  
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
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

---

## 5. API Endpoints

### 5.1 Authentication Routes

\`\`\`javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validateRequest');

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
  authController.logout
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password',
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

// Protect all routes
router.use(protect);

/**
 * @route   GET /api/staff
 * @desc    Get all staff members
 * @access  Admin, Manager
 */
router.get('/',
  restrictTo('SuperAdmin', 'Admin', 'Manager'),
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
  staffController.createStaff
);

/**
 * @route   GET /api/staff/:id
 * @desc    Get staff by ID
 * @access  Admin, Manager, Self
 */
router.get('/:id',
  staffController.getStaffById
);

/**
 * @route   PUT /api/staff/:id
 * @desc    Update staff member
 * @access  Admin, Self
 */
router.put('/:id',
  upload.single('photo'),
  staffController.updateStaff
);

/**
 * @route   DELETE /api/staff/:id
 * @desc    Delete staff member
 * @access  Admin
 */
router.delete('/:id',
  restrictTo('SuperAdmin', 'Admin'),
  staffController.deleteStaff
);

/**
 * @route   POST /api/staff/:id/face-descriptor
 * @desc    Upload face descriptor for staff
 * @access  Admin, Self
 */
router.post('/:id/face-descriptor',
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

router.use(protect);

/**
 * @route   POST /api/attendance/mark
 * @desc    Mark attendance (face recognition + location)
 * @access  All authenticated users
 */
router.post('/mark',
  attendanceController.markAttendance
);

/**
 * @route   GET /api/attendance
 * @desc    Get attendance records (filtered)
 * @access  Admin, Manager, Self
 */
router.get('/',
  attendanceController.getAttendance
);

/**
 * @route   GET /api/attendance/summary
 * @desc    Get attendance summary/dashboard
 * @access  Admin, Manager
 */
router.get('/summary',
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
  attendanceController.getPersonAttendance
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
        message: 'Not authorized to access this route'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    let user;
    if (decoded.type === 'staff') {
      user = await Staff.findById(decoded.id).select('-password');
    } else {
      user = await Student.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }
    
    // Grant access
    req.user = user;
    req.userType = decoded.type;
    next();
    
  } catch (error) {
    return res.status(401).json({
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
    if (!roles.includes(req.user.role)) {
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
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

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
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user._id, userType);
    
    // Remove password from output
    user.password = undefined;
    
    // Log successful login
    logger.info(`User logged in: ${email} (${userType})`);
    
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
      message: 'Server error during login'
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
    
    // Verify old password
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    logger.info(`Password changed for user: ${user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};
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
    const MATCH_THRESHOLD = 0.6; // Lower = stricter
    
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
        photoUrl: template.photoUrl
      }));
      
      logger.info(`Using ${candidates.length} cached face templates`);
    } else {
      // Load from database
      const [staffMembers, students] = await Promise.all([
        Staff.find(filter).select('_id name faceDescriptor photoUrl department role'),
        Student.find(filter).select('_id name faceDescriptor photoUrl classLevel branch')
      ]);
      
      // Combine results
      candidates = [
        ...staffMembers.map(s => ({
          personId: s._id,
          personType: 'staff',
          faceDescriptor: s.faceDescriptor,
          name: s.name,
          photoUrl: s.photoUrl,
          department: s.department,
          role: s.role
        })),
        ...students.map(s => ({
          personId: s._id,
          personType: 'student',
          faceDescriptor: s.faceDescriptor,
          name: s.name,
          photoUrl: s.photoUrl,
          classLevel: s.classLevel,
          branch: s.branch
        }))
      ].filter(c => c.faceDescriptor && c.faceDescriptor.length > 0);
      
      // Cache the templates
      if (candidates.length > 0) {
        await FaceTemplate.insertMany(
          candidates.map(c => ({
            personId: c.personId,
            personType: c.personType,
            faceDescriptor: c.faceDescriptor,
            photoUrl: c.photoUrl
          })),
          { ordered: false }
        ).catch(() => {}); // Ignore duplicate errors
      }
      
      logger.info(`Loaded ${candidates.length} face templates from database`);
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
      
      logger.info(`Face matched: ${bestMatch.personId} with confidence ${confidence.toFixed(2)}`);
      
      return {
        success: true,
        personId: bestMatch.personId,
        personType: bestMatch.personType,
        confidence,
        distance: bestDistance
      };
    }
    
    logger.warn('No face match found');
    return {
      success: false,
      message: 'No matching face found'
    };
    
  } catch (error) {
    logger.error('Face matching error:', error);
    throw error;
  }
};

/**
 * Store face descriptor
 */
exports.storeFaceDescriptor = async (personId, personType, faceDescriptor, photoUrl) => {
  try {
    const Model = personType === 'staff' ? Staff : Student;
    
    await Model.findByIdAndUpdate(personId, {
      faceDescriptor,
      photoUrl
    });
    
    // Update cache
    await FaceTemplate.findOneAndUpdate(
      { personId },
      {
        personId,
        personType,
        faceDescriptor,
        photoUrl,
        lastUpdated: new Date()
      },
      { upsert: true }
    );
    
    logger.info(`Face descriptor stored for ${personType}: ${personId}`);
    
    return { success: true };
    
  } catch (error) {
    logger.error('Store face descriptor error:', error);
    throw error;
  }
};

/**
 * Clear face template cache
 */
exports.clearCache = async () => {
  await FaceTemplate.deleteMany({});
  logger.info('Face template cache cleared');
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
      path: '/ws'
    });
    
    this.wss.on('connection', (ws, req) => {
      logger.info('New WebSocket connection');
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          logger.error('WebSocket message error:', error);
        }
      });
      
      ws.on('close', () => {
        // Remove from clients map
        for (const [userId, client] of this.clients.entries()) {
          if (client === ws) {
            this.clients.delete(userId);
            break;
          }
        }
        logger.info('WebSocket connection closed');
      });
      
      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
      });
    });
    
    logger.info('WebSocket server initialized');
  }
  
  /**
   * Handle incoming messages
   */
  handleMessage(ws, data) {
    switch (data.type) {
      case 'register':
        this.clients.set(data.userId, ws);
        logger.info(`Client registered: ${data.userId}`);
        break;
        
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
        
      default:
        logger.warn(`Unknown message type: ${data.type}`);
    }
  }
  
  /**
   * Broadcast to all clients
   */
  broadcast(event, data) {
    const message = JSON.stringify({ event, data });
    
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
    logger.info(`Broadcasted event: ${event}`);
  }
  
  /**
   * Send to specific user
   */
  sendToUser(userId, event, data) {
    const client = this.clients.get(userId);
    
    if (client && client.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event, data });
      client.send(message);
      logger.info(`Sent event to user ${userId}: ${event}`);
    }
  }
  
  /**
   * Notify attendance marked
   */
  notifyAttendanceMarked(attendance) {
    this.broadcast('attendance:marked', {
      personId: attendance.personId,
      personType: attendance.personType,
      status: attendance.status,
      timestamp: attendance.timestamp
    });
  }
  
  /**
   * Notify leave request
   */
  notifyLeaveRequest(leaveRequest) {
    this.broadcast('leave:requested', {
      id: leaveRequest.id,
      personId: leaveRequest.personId,
      startDate: leaveRequest.startDate,
      endDate: leaveRequest.endDate
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

/**
 * Run daily at 11:59 PM to mark absent users
 */
function startAutoMarkAbsentJob() {
  // Run at 23:59 every day
  cron.schedule('59 23 * * *', async () => {
    try {
      logger.info('Starting auto-mark absent job');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Get all staff and students
      const [allStaff, allStudents] = await Promise.all([
        Staff.find({}, '_id'),
        Student.find({}, '_id')
      ]);
      
      const allPersonIds = [
        ...allStaff.map(s => s._id.toString()),
        ...allStudents.map(s => s._id.toString())
      ];
      
      // Get attendance marked today
      const attendanceToday = await Attendance.find({ date: today });
      const markedPersonIds = attendanceToday.map(a => a.personId.toString());
      
      // Find absent persons
      const absentPersonIds = allPersonIds.filter(
        id => !markedPersonIds.includes(id)
      );
      
      if (absentPersonIds.length === 0) {
        logger.info('No absent persons to mark');
        return;
      }
      
      // Create absent records
      const absentRecords = [];
      
      for (const personId of absentPersonIds) {
        // Determine if staff or student
        const isStaff = allStaff.find(s => s._id.toString() === personId);
        const personType = isStaff ? 'staff' : 'student';
        
        absentRecords.push({
          personId,
          personType,
          date: today,
          status: 'absent',
          timestamp: new Date()
        });
      }
      
      await Attendance.insertMany(absentRecords);
      
      logger.info(`Marked ${absentRecords.length} persons as absent`);
      
    } catch (error) {
      logger.error('Auto-mark absent job error:', error);
    }
  });
  
  logger.info('Auto-mark absent job scheduled');
}

module.exports = { startAutoMarkAbsentJob };
\`\`\`

### 9.2 Quarterly Report Job

\`\`\`javascript
// cron/quarterlyReport.js
const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * Run on first day of each quarter
 */
function startQuarterlyReportJob() {
  // Run at 6 AM on 1st Jan, Apr, Jul, Oct
  cron.schedule('0 6 1 1,4,7,10 *', async () => {
    try {
      logger.info('Starting quarterly report generation');
      
      // Calculate previous quarter dates
      const now = new Date();
      const quarterStart = new Date(now.getFullYear(), Math.floor((now.getMonth() - 3) / 3) * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
      
      const startDate = quarterStart.toISOString().split('T')[0];
      const endDate = quarterEnd.toISOString().split('T')[0];
      
      // Aggregate attendance data
      const stats = await Attendance.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate }
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
      ]);
      
      // Generate CSV
      const csvData = generateCSV(stats);
      
      // Send email to admins
      const admins = await Staff.find({ role: 'SuperAdmin' });
      
      for (const admin of admins) {
        await emailService.sendQuarterlyReport(
          admin.email,
          csvData,
          startDate,
          endDate
        );
      }
      
      logger.info(`Quarterly report sent to ${admins.length} admins`);
      
    } catch (error) {
      logger.error('Quarterly report job error:', error);
    }
  });
  
  logger.info('Quarterly report job scheduled');
}

function generateCSV(stats) {
  let csv = 'Person ID,Present,Absent,Late,Total,Attendance %\n';
  
  stats.forEach(stat => {
    const total = stat.present + stat.absent + stat.late;
    const percentage = ((stat.present / total) * 100).toFixed(2);
    
    csv += `${stat._id},${stat.present},${stat.absent},${stat.late},${total},${percentage}%\n`;
  });
  
  return csv;
}

module.exports = { startQuarterlyReportJob };
\`\`\`

---

## 10. Performance Optimization

### 10.1 Database Indexing

\`\`\`javascript
// Best practices for indexes

// Attendance - Most queried collection
db.attendance.createIndex({ personId: 1, date: 1 })
db.attendance.createIndex({ date: 1, status: 1 })
db.attendance.createIndex({ personType: 1, date: 1 })

// Staff - Search and filter
db.staff.createIndex({ institutionName: 1, department: 1 })
db.staff.createIndex({ email: 1 }, { unique: true })
db.staff.createIndex({ employeeCode: 1 }, { unique: true })

// Students
db.students.createIndex({ institutionName: 1, classLevel: 1 })
db.students.createIndex({ rollNumber: 1 }, { unique: true })
db.students.createIndex({ branchClass: 1 })

// Face templates - Cache lookup
db.facetemplates.createIndex({ personId: 1 }, { unique: true })
db.facetemplates.createIndex({ lastUpdated: 1 }, { expireAfterSeconds: 86400 })
\`\`\`

### 10.2 Connection Pooling

\`\`\`javascript
// config/database.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 100,      // Max 100 connections
      minPoolSize: 10,       // Keep 10 connections alive
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      family: 4,             // Use IPv4
      retryWrites: true,
      retryReads: true,
      w: 'majority'
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Monitor connection pool
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
\`\`\`

### 10.3 Caching Strategy

\`\`\`javascript
// utils/cache.js
const NodeCache = require('node-cache');
const logger = require('./logger');

// Initialize cache (5 minute TTL)
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

/**
 * Get from cache or execute function
 */
exports.getOrSet = async (key, fn, ttl = 300) => {
  try {
    // Check cache
    const cached = cache.get(key);
    if (cached !== undefined) {
      logger.debug(`Cache HIT: ${key}`);
      return cached;
    }
    
    // Execute function
    logger.debug(`Cache MISS: ${key}`);
    const result = await fn();
    
    // Store in cache
    cache.set(key, result, ttl);
    
    return result;
    
  } catch (error) {
    logger.error(`Cache error for key ${key}:`, error);
    // On error, execute function without caching
    return await fn();
  }
};

/**
 * Invalidate cache keys by pattern
 */
exports.invalidate = (pattern) => {
  const keys = cache.keys();
  const matchedKeys = keys.filter(key => key.includes(pattern));
  
  matchedKeys.forEach(key => cache.del(key));
  
  logger.info(`Invalidated ${matchedKeys.length} cache keys matching: ${pattern}`);
};

/**
 * Clear all cache
 */
exports.clear = () => {
  cache.flushAll();
  logger.info('All cache cleared');
};

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
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SendGrid/NodeMailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL (CORS)
FRONTEND_URL=https://your-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# WebSocket
WS_PORT=8080
\`\`\`

### 11.2 Production Setup

\`\`\`javascript
// server.js
require('dotenv').config();
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

// Initialize express
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }));
} else {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(rateLimiter);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/institutions', require('./routes/institutions'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Initialize WebSocket
websocketService.initialize(server);

// Start cron jobs
startAutoMarkAbsentJob();
startQuarterlyReportJob();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});

module.exports = app;
\`\`\`

---

## 12. Security Best Practices

### 12.1 Input Validation

\`\`\`javascript
// middleware/validateRequest.js
const { body, validationResult } = require('express-validator');

exports.validateRequest = (fields) => {
  const validators = {
    email: body('email').isEmail().normalizeEmail(),
    password: body('password').isLength({ min: 6 }),
    name: body('name').trim().notEmpty(),
    phone: body('phone').optional().isMobilePhone(),
    // Add more validators
  };
  
  return [
    ...fields.map(field => validators[field]),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      next();
    }
  ];
};
\`\`\`

### 12.2 Rate Limiting

\`\`\`javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

exports.rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Strict limiter for login
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later'
});
\`\`\`

### 12.3 Secure Headers

\`\`\`javascript
// Use helmet for security headers
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
\`\`\`

---

## Additional Resources

- **MongoDB Best Practices**: https://docs.mongodb.com/manual/administration/production-notes/
- **Express Security**: https://expressjs.com/en/advanced/best-practice-security.html
- **JWT Best Practices**: https://tools.ietf.org/html/rfc8725
- **Node.js Production**: https://nodejs.org/en/docs/guides/simple-profiling/

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: Development Team
