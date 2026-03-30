// models/Store.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
}, { timestamps: true });

const storeSchema = new mongoose.Schema({
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, maxlength: 1000 },
  category:    { type: String, enum: ['Fashion', 'Food & Restaurant', 'Automotive', 'Electronics', 'Accessories', 'General', 'Beauty', 'Sports'], required: true },
  logo:        { type: String, default: '' },
  coverImage:  { type: String, default: '' },
  gallery:     [{ type: String }],

  location: {
    building:    { type: String },
    floor:       { type: String },
    shopNumber:  { type: String },
    street:      { type: String },
    city:        { type: String, default: 'Nairobi' },
    coordinates: {
      lat:  { type: Number },
      lng:  { type: Number },
    },
  },

  contact: {
    phone:    { type: String },
    email:    { type: String },
    whatsapp: { type: String },
    website:  { type: String },
  },

  hours: {
    monday:    { open: String, close: String },
    tuesday:   { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday:  { open: String, close: String },
    friday:    { open: String, close: String },
    saturday:  { open: String, close: String },
    sunday:    { open: String, close: String },
  },

  tags:       [{ type: String }],
  isOpen:     { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true },
  followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reviews:    [reviewSchema],

  // Computed
  rating:      { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  postCount:   { type: Number, default: 0 },
}, { timestamps: true });

// Recompute rating on save
storeSchema.methods.computeRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; return; }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating = parseFloat((total / this.reviews.length).toFixed(1));
  this.reviewCount = this.reviews.length;
};

// Virtual: follower count
storeSchema.virtual('followerCount').get(function () {
  return this.followers.length;
});

module.exports = mongoose.model('Store', storeSchema);
