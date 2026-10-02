/**
 * Admin Password Reset Script
 * Run: node reset-admin.js
 * Directly resets the admin password in MongoDB.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin    = require('./models/Admin');

const NEW_PASSWORD = 'Admin@1234';  // Change this to whatever you want

async function resetAdmin() {
  console.log('\n🔑 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  let admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });

  if (!admin) {
    console.log('⚠️  Admin not found, creating one...');
    admin = await Admin.create({
      email:    process.env.ADMIN_EMAIL,
      password: NEW_PASSWORD,
      name:     'Admin',
    });
    console.log(`✅ Admin created: ${admin.email}`);
  } else {
    admin.password = NEW_PASSWORD;
    await admin.save();
    console.log(`✅ Password reset for: ${admin.email}`);
  }

  console.log(`\n📝 New credentials:`);
  console.log(`   Email:    ${process.env.ADMIN_EMAIL}`);
  console.log(`   Password: ${NEW_PASSWORD}`);
  console.log('\n⚠️  Change this password after logging in!\n');

  process.exit(0);
}

resetAdmin().catch(err => {
  console.error('💥 Failed:', err.message);
  process.exit(1);
});
