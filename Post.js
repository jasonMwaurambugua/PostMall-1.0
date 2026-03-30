// models/Post.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:   { type: String, required: true, maxlength: 500 },
  likes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  store:       { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption:     { type: String, maxlength: 2200 },
  images:      [{ type: String }],   // array of image URLs
  tags:        [{ type: String }],
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments:    [commentSchema],
  shares:      { type: Number, default: 0 },
  views:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
  priceLabel:  { type: String },   // optional "From KSh 2,500"
}, { timestamps: true });

// Indexes for fast feed queries
postSchema.index({ store: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema);
