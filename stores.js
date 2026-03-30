// routes/stores.js
const express = require('express');
const Store   = require('../models/Store');
const Post    = require('../models/Post');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/stores — list all stores (with filters)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page     = parseInt(req.query.page)  || 1;
    const limit    = parseInt(req.query.limit) || 20;
    const skip     = (page - 1) * limit;
    const filter   = { isActive: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.isOpen !== undefined) filter.isOpen = req.query.isOpen === 'true';
    if (req.query.search) {
      filter.$or = [
        { name:        new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') },
        { tags:        new RegExp(req.query.search, 'i') },
      ];
    }

    const [stores, total] = await Promise.all([
      Store.find(filter)
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name avatar'),
      Store.countDocuments(filter),
    ]);

    res.json({ success: true, data: stores, pagination: { page, limit, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/stores/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'name avatar');
    if (!store) return res.status(404).json({ success: false, message: 'Store not found.' });

    const posts = await Post.find({ store: store._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .select('images caption likes comments views createdAt');

    res.json({ success: true, data: { ...store.toObject(), posts } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/stores — create store
router.post('/', protect, async (req, res) => {
  try {
    const store = await Store.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, data: store });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/stores/:id
router.patch('/:id', protect, async (req, res) => {
  try {
    const store = await Store.findOne({ _id: req.params.id, owner: req.user._id });
    if (!store) return res.status(403).json({ success: false, message: 'Not authorised.' });

    const allowed = ['name', 'description', 'logo', 'coverImage', 'gallery', 'contact', 'hours', 'tags', 'isOpen'];
    allowed.forEach(k => { if (req.body[k] !== undefined) store[k] = req.body[k]; });
    await store.save();
    res.json({ success: true, data: store });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/stores/:id/follow — toggle follow
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const store    = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found.' });

    const userId   = req.user._id.toString();
    const followed = store.followers.map(String).includes(userId);

    if (followed) store.followers.pull(req.user._id);
    else          store.followers.push(req.user._id);
    await store.save();

    res.json({ success: true, followed: !followed, followerCount: store.followers.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/stores/:id/review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found.' });

    const existing = store.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
    } else {
      store.reviews.push({ user: req.user._id, rating, comment });
    }
    store.computeRating();
    await store.save();
    res.json({ success: true, rating: store.rating, reviewCount: store.reviewCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
