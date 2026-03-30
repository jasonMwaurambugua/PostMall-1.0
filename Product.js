// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  store:       { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, maxlength: 1000 },
  price:       { type: Number, required: true },
  currency:    { type: String, default: 'KSh' },
  images:      [{ type: String }],
  category:    { type: String, required: true },
  tags:        [{ type: String }],
  inStock:     { type: Boolean, default: true },
  stockQty:    { type: Number, default: 0 },
  isFeatured:  { type: Boolean, default: false },
  views:       { type: Number, default: 0 },
  saves:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Location (inherited from store, but can override)
  locationLabel: { type: String },  // e.g. "Sawa Mall · Shop 104 · 2nd Fl"
}, { timestamps: true });

productSchema.index({ store: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
