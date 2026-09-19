const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingAdmin = await User.findOne({ email: 'kparshant525@gmail.com' });
    if (existingAdmin) {
      console.log('Super Admin already exists!');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12', salt);

    await User.insertMany([{
      name: 'Super Admin',
      email: 'kparshant525@gmail.com',
      password: hashedPassword,
      businessName: 'Platform Owner',
      role: 'super_admin',
      status: 'APPROVED'
    }]);

    console.log('Super Admin Created Successfully!');
    console.log('Email: kparshant525@gmail.com | Password: 12');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();