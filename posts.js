// routes/posts.js
const express = require('express');
const Post    = require('../models/Post');
const Store   = require('../models/Store');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts — paginated feed
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const filter = { isActive: true };
    if (req.query.category) filter['store.category'] = req.query.category;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('store', 'name category logo location isOpen rating')
        .populate('author', 'name avatar')
        .populate('comments.user', 'name avatar'),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/posts/:id — single post
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('store', 'name category logo location contact isOpen rating')
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');

    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/posts — create post (merchant only)
router.post('/', protect, async (req, res) => {
  try {
    const { storeId, caption, images, tags, priceLabel } = req.body;
    const store = await Store.findOne({ _id: storeId, owner: req.user._id });
    if (!store)
      return res.status(403).json({ success: false, message: 'Store not found or not owned by you.' });

    const post = await Post.create({ store: storeId, author: req.user._id, caption, images, tags, priceLabel });
    await Store.findByIdAndUpdate(storeId, { $inc: { postCount: 1 } });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/posts/:id/like — toggle like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post   = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const userId = req.user._id.toString();
    const liked  = post.likes.map(String).includes(userId);

    if (liked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ success: true, liked: !liked, likeCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/posts/:id/comment — add comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Comment text is required.' });

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user: req.user._id, text: text.trim() } } },
      { new: true }
    ).populate('comments.user', 'name avatar');

    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/posts/:id/share — increment share count
router.post('/:id/share', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { shares: 1 } }, { new: true });
    res.json({ success: true, shares: post.shares });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found or not yours.' });
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
