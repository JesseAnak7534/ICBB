/**
 * Creates the first admin user.
 *
 * Credentials come from the environment — never hardcode them here, this file
 * is committed to a public repository.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='<long unique password>' npm run seed
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Reuse the real User model so the password goes through its pre-save bcrypt
// hook and the schema stays in one place.
const User = require('../models/User');

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, MONGODB_URI } = process.env;

async function seedAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.');
    process.exit(1);
  }

  if (ADMIN_PASSWORD.length < 12) {
    console.error('ADMIN_PASSWORD must be at least 12 characters.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/icbb_db');
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existingAdmin) {
      // Re-running the seed should let you rotate a compromised password.
      existingAdmin.password = ADMIN_PASSWORD;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log(`Password reset for existing admin: ${existingAdmin.email}`);
    } else {
      const admin = await User.create({
        name: ADMIN_NAME || 'ICBB Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log(`Admin user created: ${admin.email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
