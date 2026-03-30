// seed/seed.js — PostMall database seeder
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User    = require('../models/User');
const Store   = require('../models/Store');
const Post    = require('../models/Post');
const Product = require('../models/Product');

// ── Unsplash image constants ─────────────────────────────────────────────────
const IMG = {
  // Fashion
  fashion: [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
  ],
  // Cars
  cars: [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
  ],
  // Food
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
  ],
  // Tech
  tech: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  ],
  // Avatars
  avatars: [
    'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&q=80',
    'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=150&q=80',
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Store.deleteMany(), Post.deleteMany(), Product.deleteMany()]);
  console.log('🗑️  Cleared existing data');

  // ── Create Users ─────────────────────────────────────────────────────────
  const users = await User.create([
    { name: 'Jason Mbugua',   email: 'jason@postmall.co.ke',   phone: '+254712345678', password: 'password123', avatar: IMG.avatars[0], bio: 'Fashion enthusiast 🛍️', location: 'Nairobi, Kenya', role: 'merchant' },
    { name: 'Amina Hassan',   email: 'amina@postmall.co.ke',   phone: '+254722345678', password: 'password123', avatar: IMG.avatars[1], bio: 'Foodie & lifestyle', location: 'Nairobi, Kenya', role: 'merchant' },
    { name: 'Kevin Ochieng',  email: 'kevin@postmall.co.ke',   phone: '+254733345678', password: 'password123', avatar: IMG.avatars[2], bio: 'Car dealer 🚗', location: 'Nairobi, Kenya', role: 'merchant' },
    { name: 'Grace Wanjiru',  email: 'grace@postmall.co.ke',   phone: '+254744345678', password: 'password123', avatar: IMG.avatars[3], bio: 'Tech entrepreneur', location: 'Nairobi, Kenya', role: 'merchant' },
    { name: 'Test Customer',  email: 'customer@postmall.co.ke',phone: '+254755345678', password: 'password123', avatar: IMG.avatars[4], bio: 'PostMall shopper', location: 'Nairobi, Kenya' },
  ]);
  console.log(`👤 Created ${users.length} users`);

  // ── Create Stores ─────────────────────────────────────────────────────────
  const stores = await Store.create([
    {
      owner: users[0]._id, name: 'Baraka Stores', category: 'Fashion',
      description: 'Leading fashion retailer offering the latest styles for urban Nairobi. Streetwear to formal — we have it all.',
      logo: IMG.avatars[0], coverImage: IMG.fashion[0],
      gallery: IMG.fashion.slice(0, 4),
      location: { building: 'Sawa Mall', floor: '2nd Floor', shopNumber: 'Shop 104', street: 'Tom Mboya Street', city: 'Nairobi' },
      contact: { phone: '0700011112', whatsapp: '+254700011112', email: 'baraka@postmall.co.ke' },
      tags: ['fashion', 'men', 'women', 'streetwear'],
      isOpen: true, rating: 4.8, reviewCount: 124,
    },
    {
      owner: users[1]._id, name: 'Joan Foods', category: 'Food & Restaurant',
      description: 'Home-cooked meals, fresh juices and snacks. The taste of home in the heart of Nairobi.',
      logo: IMG.avatars[1], coverImage: IMG.food[0],
      gallery: IMG.food,
      location: { building: 'City Mall', floor: '3rd Floor', shopNumber: 'Stall 07', street: 'Moi Avenue', city: 'Nairobi' },
      contact: { phone: '0722345678', whatsapp: '+254722345678' },
      tags: ['food', 'restaurant', 'lunch', 'healthy'],
      isOpen: true, rating: 4.6, reviewCount: 89,
    },
    {
      owner: users[2]._id, name: 'Urban Drives', category: 'Automotive',
      description: 'Premium pre-owned cars, flexible financing and full inspection guaranteed. Test drive your dream car today.',
      logo: IMG.avatars[2], coverImage: IMG.cars[0],
      gallery: IMG.cars,
      location: { building: 'Central Plaza', floor: 'Ground Floor', shopNumber: 'Bay 02', street: 'Kenyatta Avenue', city: 'Nairobi' },
      contact: { phone: '0733345678', whatsapp: '+254733345678', email: 'urbandrives@postmall.co.ke' },
      tags: ['cars', 'automotive', 'dealership', 'SUV'],
      isOpen: true, rating: 4.9, reviewCount: 212,
    },
    {
      owner: users[3]._id, name: 'Rahym Computer Systems', category: 'Electronics',
      description: 'Laptops, desktops, accessories and repairs. Best prices with 6-month warranty on all units.',
      logo: IMG.avatars[3], coverImage: IMG.tech[0],
      gallery: IMG.tech,
      location: { building: 'Metropolis Building', floor: '2nd Floor', shopNumber: 'Shop 208', street: 'Tom Mboya Street', city: 'Nairobi' },
      contact: { phone: '0744345678', whatsapp: '+254744345678' },
      tags: ['laptops', 'computers', 'tech', 'repairs'],
      isOpen: false, rating: 4.3, reviewCount: 56,
    },
    {
      owner: users[1]._id, name: 'Elegant Boutique', category: 'Fashion',
      description: 'Premium ladies fashion, accessories and shoes. Bringing elegance to every wardrobe.',
      logo: IMG.avatars[1], coverImage: IMG.fashion[1],
      gallery: IMG.fashion.slice(1),
      location: { building: 'City Mall', floor: '3rd Floor', shopNumber: 'Shop 15', street: 'Moi Avenue', city: 'Nairobi' },
      contact: { phone: '0722999888' },
      tags: ['ladies', 'fashion', 'boutique', 'accessories'],
      isOpen: true, rating: 4.7, reviewCount: 97,
    },
  ]);
  console.log(`🏪 Created ${stores.length} stores`);

  // ── Create Posts ──────────────────────────────────────────────────────────
  await Post.create([
    { store: stores[0]._id, author: users[0]._id, caption: 'Fresh arrivals this week! 🔥 Streetwear, formal and casual — we have everything for the modern Nairobian. Visit us at Sawa Mall Shop 104. DM for enquiries!', images: IMG.fashion.slice(0, 3), tags: ['fashion', 'newarrivals', 'streetwear'], likes: [], shares: 7, views: 342 },
    { store: stores[1]._id, author: users[1]._id, caption: '🍽️ Lunch special today! Full meal + juice for only KSh 350. Fresh, hot and homemade. Find us at City Mall 3rd Floor, Stall 07. Open 8am–8pm daily!', images: IMG.food.slice(0, 2), tags: ['food', 'lunch', 'affordable'], likes: [], shares: 19, views: 521 },
    { store: stores[2]._id, author: users[2]._id, caption: '🚘 Just arrived — 2021 BMW X5, low mileage, full service history. Flexible financing available. Come test drive at Central Plaza, Ground Floor. Urban Drives — we find your dream car!', images: IMG.cars.slice(0, 3), tags: ['cars', 'BMW', 'dealership'], likes: [], shares: 28, views: 891 },
    { store: stores[3]._id, author: users[3]._id, caption: '💻 Back-to-school deals on laptops! From KSh 35,000 with 6-month warranty. We also do repairs same day. Metropolis Building 2nd Floor Shop 208.', images: IMG.tech.slice(0, 2), tags: ['laptops', 'tech', 'backtoschool'], likes: [], shares: 3, views: 178 },
    { store: stores[4]._id, author: users[1]._id, caption: '✨ New collection just dropped! Premium ladies wear starting from KSh 2,500. Sizes XS–4XL. City Mall 3rd Floor, Shop 15. Come slay with us! 💃', images: IMG.fashion.slice(1, 3), tags: ['ladies', 'fashion', 'boutique'], likes: [], shares: 12, views: 445 },
  ]);
  console.log(`📝 Created posts`);

  // ── Create Products ───────────────────────────────────────────────────────
  await Product.create([
    { store: stores[0]._id, name: 'Streetwear Hoodie', price: 2500, category: 'Fashion', images: [IMG.fashion[0]], locationLabel: 'Sawa Mall · Shop 104 · 2nd Fl', tags: ['hoodie', 'streetwear'] },
    { store: stores[0]._id, name: 'Slim Fit Chinos',   price: 3200, category: 'Fashion', images: [IMG.fashion[2]], locationLabel: 'Sawa Mall · Shop 104 · 2nd Fl', tags: ['chinos', 'formal'] },
    { store: stores[1]._id, name: 'Full Meal Combo',   price: 350,  category: 'Food & Restaurant', images: [IMG.food[0]], locationLabel: 'City Mall · Stall 07 · 3rd Fl', tags: ['lunch', 'meal'] },
    { store: stores[2]._id, name: '2021 BMW X5',       price: 6500000, category: 'Automotive', images: [IMG.cars[0]], locationLabel: 'Central Plaza · Bay 02 · Ground Fl', tags: ['BMW', 'SUV'] },
    { store: stores[2]._id, name: '2019 Toyota Prado', price: 4800000, category: 'Automotive', images: [IMG.cars[1]], locationLabel: 'Central Plaza · Bay 02 · Ground Fl', tags: ['Toyota', 'SUV'] },
    { store: stores[3]._id, name: 'HP Laptop 15"',     price: 38000, category: 'Electronics', images: [IMG.tech[0]], locationLabel: 'Metropolis Bldg · Shop 208 · 2nd Fl', tags: ['laptop', 'HP'] },
    { store: stores[3]._id, name: 'Gaming Desktop PC', price: 65000, category: 'Electronics', images: [IMG.tech[1]], locationLabel: 'Metropolis Bldg · Shop 208 · 2nd Fl', tags: ['desktop', 'gaming'] },
    { store: stores[4]._id, name: 'Maxi Dress',        price: 4500, category: 'Fashion', images: [IMG.fashion[1]], locationLabel: 'City Mall · Shop 15 · 3rd Fl', tags: ['dress', 'ladies'] },
    { store: stores[4]._id, name: 'Designer Handbag',  price: 7800, category: 'Fashion', images: [IMG.fashion[3]], locationLabel: 'City Mall · Shop 15 · 3rd Fl', tags: ['handbag', 'accessories'] },
  ]);
  console.log(`📦 Created products`);

  console.log('\n✅ Seed complete!');
  console.log('📧 Login: customer@postmall.co.ke | password123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
