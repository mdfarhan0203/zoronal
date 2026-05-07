import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil > new Date()) {
    return;
  }

  this.loginAttempts += 1;

  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts >= 5 && !this.lockUntil) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }

  return this.save();
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  return this.save();
};

// Method to check if account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > new Date();
};

export default mongoose.model('User', userSchema);
