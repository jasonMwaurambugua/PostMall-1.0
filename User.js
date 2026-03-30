// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 80 },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:       { type: String, trim: true },
  password:    { type: String, required: true, minlength: 6, select: false },
  avatar:      { type: String, default: '' },
  bio:         { type: String, maxlength: 200, default: '' },
  location:    { type: String, default: 'Nairobi, Kenya' },
  role:        { type: String, enum: ['user', 'merchant', 'admin'], default: 'user' },
  isVerified:  { type: Boolean, default: false },
  savedPosts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  following:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
  memberSince: { type: Date, default: Date.now },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
