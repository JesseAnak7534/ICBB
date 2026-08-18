const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/env');
const Participant = require('../models/Participant');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // A participant token must never authorise a staff route.
    if (decoded.type === 'participant') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Protect participant routes. Deliberately separate from `protect` so that a
// staff token cannot be replayed as a participant and vice versa.
exports.protectParticipant = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Please sign in to continue'
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.type !== 'participant') {
      return res.status(401).json({
        success: false,
        message: 'Please sign in to continue'
      });
    }

    const participant = await Participant.findById(decoded.id);

    if (!participant || !participant.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or deactivated'
      });
    }

    req.participant = participant;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired. Please sign in again.'
    });
  }
};
