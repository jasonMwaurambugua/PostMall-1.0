// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/products
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;
    const filter = { inStock: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.store)    filter.store     = req.query.store;
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    if (req.query.maxPrice) filter.price = { $lte: Number(req.query.maxPrice) };
    if (req.query.minPrice) filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };

    const sort = {};
    if (req.query.sort === 'price_asc')  sort.price     =  1;
    if (req.query.sort === 'price_desc') sort.price     = -1;
    if (req.query.sort === 'popular')    sort.views     = -1;
    if (!req.query.sort)                 sort.createdAt = -1;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('store', 'name logo location isOpen'),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, data: products, pagination: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate('store', 'name logo location contact isOpen rating');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products
router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
