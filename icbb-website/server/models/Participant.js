const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * A person taking a course.
 *
 * Kept separate from the User model, which is for ICBB staff and admins.
 * Mixing the two would mean a participant account sits in the same collection
 * as accounts that can be granted the admin role — a privilege-escalation risk
 * that is easy to avoid by keeping them apart.
 */
const participantSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  phone: { type: String, trim: true },
  institution: { type: String, trim: true },
  role: {
    type: String,
    enum: ['student', 'researcher', 'professional', 'faculty', 'other'],
    default: 'student'
  },

  enrolments: [{
    courseId: { type: String, required: true },
    enrolledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'completed', 'withdrawn'],
      default: 'active'
    },
    completedAt: Date
  }],

  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

participantSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

participantSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

participantSchema.methods.isEnrolledIn = function isEnrolledIn(courseId) {
  return this.enrolments.some(
    (enrolment) => enrolment.courseId === courseId && enrolment.status !== 'withdrawn'
  );
};

/** Shape sent to the client — never includes the password hash. */
participantSchema.methods.toProfile = function toProfile() {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    phone: this.phone,
    institution: this.institution,
    role: this.role,
    enrolments: this.enrolments,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Participant', participantSchema);
