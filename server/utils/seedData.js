require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Entrepreneur = require('../models/Entrepreneur');
const Product = require('../models/Product');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding KaushalSetu demo data...');

  // Clear existing
  await Promise.all([User.deleteMany(), Entrepreneur.deleteMany(), Product.deleteMany()]);
  console.log('✅ Cleared existing data');

  // Create users
  const hashedPw = await bcrypt.hash('password123', 12);

  const admin = await User.create({ name: 'Admin KaushalSetu', email: 'admin@kaushalsetu.com', password: hashedPw, role: 'admin', isVerified: true });

  const customers = await User.insertMany([
    { name: 'Anjali Sharma', email: 'anjali@demo.com', password: hashedPw, phone: '9876543210', role: 'customer' },
    { name: 'Ravi Gupta',   email: 'ravi@demo.com',   password: hashedPw, phone: '9876543211', role: 'customer' },
  ]);

  const eUsers = await User.insertMany([
    { name: 'Ramesh Kumar',   email: 'ramesh@demo.com',   password: hashedPw, phone: '9876500001', role: 'entrepreneur' },
    { name: 'Sunita Devi',    email: 'sunita@demo.com',   password: hashedPw, phone: '9876500002', role: 'entrepreneur' },
    { name: 'Mohan Lal',      email: 'mohan@demo.com',    password: hashedPw, phone: '9876500003', role: 'entrepreneur' },
    { name: 'Priya Pottery',  email: 'priya@demo.com',    password: hashedPw, phone: '9876500004', role: 'entrepreneur' },
    { name: 'Abdul Tailor',   email: 'abdul@demo.com',    password: hashedPw, phone: '9876500005', role: 'entrepreneur' },
  ]);

  // Create entrepreneur profiles
  const entrepreneurs = await Entrepreneur.insertMany([
    {
      user: eUsers[0]._id, businessName: "Ramesh's Cobbler Works", category: 'cobbler',
      description: 'Expert shoe repair and custom footwear crafting with 20+ years of experience. Specializing in leather work and orthopedic shoe modifications.',
      skills: ['Leather stitching', 'Sole replacement', 'Shoe polishing', 'Custom footwear'],
      experience: 20, isApproved: true, availability: true, rating: 4.7, totalReviews: 34,
      location: { city: 'Dehradun', state: 'Uttarakhand', pincode: '248001', address: 'Paltan Bazaar, near Clock Tower' },
      services: [
        { name: 'Sole Replacement', description: 'Full sole replacement for any shoe type', price: 150, unit: 'per pair' },
        { name: 'Leather Stitching', description: 'Repair torn leather seams', price: 80, unit: 'per repair' },
        { name: 'Shoe Polishing', description: 'Deep clean and polish', price: 50, unit: 'per pair' },
      ],
    },
    {
      user: eUsers[1]._id, businessName: 'Sunita Handloom Studio', category: 'artisan',
      description: 'Handwoven textiles and traditional Indian crafts. Each piece is uniquely crafted with love using age-old techniques passed down through generations.',
      skills: ['Handloom weaving', 'Block printing', 'Embroidery', 'Natural dyeing'],
      experience: 15, isApproved: true, availability: true, rating: 4.9, totalReviews: 56,
      location: { city: 'Rishikesh', state: 'Uttarakhand', pincode: '249201', address: 'Laxman Jhula Road' },
      services: [
        { name: 'Custom Handloom', description: 'Custom weave to your specifications', price: 500, unit: 'per meter' },
        { name: 'Block Print Fabric', description: 'Traditional block printing on cotton', price: 350, unit: 'per meter' },
      ],
    },
    {
      user: eUsers[2]._id, businessName: "Mohan Kumhar — Clay Arts", category: 'potter',
      description: 'Traditional pottery and terracotta art from the foothills of the Himalayas. Eco-friendly, sustainable, and beautifully handcrafted.',
      skills: ['Wheel throwing', 'Hand building', 'Glazing', 'Terracotta'],
      experience: 25, isApproved: true, availability: true, rating: 4.8, totalReviews: 42,
      location: { city: 'Haridwar', state: 'Uttarakhand', pincode: '249401', address: 'Kankhal Road' },
      services: [
        { name: 'Custom Pottery', description: 'Custom pots to your design', price: 200, unit: 'per piece' },
        { name: 'Pottery Classes', description: '2-hour hands-on class', price: 300, unit: 'per session' },
      ],
    },
    {
      user: eUsers[3]._id, businessName: 'Priya Ceramic Studio', category: 'potter',
      description: 'Contemporary ceramic art with a traditional touch. Specializing in home décor, kitchenware, and custom gift pieces.',
      skills: ['Ceramic painting', 'Glaze work', 'Slab building', 'Raku firing'],
      experience: 8, isApproved: true, availability: false, rating: 4.6, totalReviews: 28,
      location: { city: 'Mussoorie', state: 'Uttarakhand', pincode: '248179', address: 'Mall Road' },
    },
    {
      user: eUsers[4]._id, businessName: "Abdul's Fine Tailoring", category: 'tailor',
      description: 'Premium tailoring for men and women. Specializing in traditional Indian wear — kurtas, salwar suits, sherwanis — and western formal wear.',
      skills: ['Kurta stitching', 'Sherwani', 'Suits', 'Salwar Kameez', 'Embroidery work'],
      experience: 18, isApproved: true, availability: true, rating: 4.5, totalReviews: 61,
      location: { city: 'Dehradun', state: 'Uttarakhand', pincode: '248001', address: 'Rajpur Road, Clement Town' },
      services: [
        { name: 'Kurta Stitching', description: 'Custom kurta from your fabric', price: 250, unit: 'per piece' },
        { name: 'Sherwani', description: 'Full sherwani with embroidery', price: 1800, unit: 'per piece' },
        { name: 'Suit Tailoring', description: 'Western formal 3-piece suit', price: 2500, unit: 'per suit' },
        { name: 'Alterations', description: 'Fit adjustments for any garment', price: 100, unit: 'per garment' },
      ],
    },
  ]);

  // Create products
  await Product.insertMany([
    {
      entrepreneur: entrepreneurs[1]._id, name: 'Handwoven Cotton Dupatta', category: 'textiles',
      description: 'Beautiful handwoven cotton dupatta with traditional block print pattern. Natural vegetable dyes, soft on skin, and eco-friendly.',
      price: 450, stock: 12, unit: 'piece', rating: 4.8, totalReviews: 23, isAvailable: true,
      tags: ['handwoven', 'cotton', 'dupatta', 'traditional', 'block-print'],
      images: ['https://picsum.photos/seed/dupatta1/600/500', 'https://picsum.photos/seed/dupatta2/600/500'],
    },
    {
      entrepreneur: entrepreneurs[2]._id, name: 'Terracotta Water Pot (Matka)', category: 'pottery',
      description: 'Traditional handcrafted terracotta matka. Keeps water naturally cool and adds a rustic charm to your home. Each piece is unique.',
      price: 180, stock: 20, unit: 'piece', rating: 4.9, totalReviews: 31, isAvailable: true,
      tags: ['terracotta', 'matka', 'eco-friendly', 'handcrafted'],
      images: ['https://picsum.photos/seed/matka1/600/500'],
    },
    {
      entrepreneur: entrepreneurs[2]._id, name: 'Clay Diya Set (12 pcs)', category: 'pottery',
      description: 'Set of 12 handmade clay diyas, perfect for Diwali and daily puja. Made from pure natural clay, no chemicals.',
      price: 120, stock: 50, unit: 'set of 12', rating: 4.7, totalReviews: 18, isAvailable: true,
      tags: ['diya', 'clay', 'diwali', 'puja', 'set'],
      images: ['https://picsum.photos/seed/diya1/600/500'],
    },
    {
      entrepreneur: entrepreneurs[3]._id, name: 'Ceramic Coffee Mug', category: 'ceramics',
      description: 'Handpainted ceramic coffee mug with Himalayan landscape design. Microwave and dishwasher safe. A perfect gift.',
      price: 320, stock: 8, unit: 'piece', rating: 4.6, totalReviews: 14, isAvailable: true,
      tags: ['ceramic', 'mug', 'handpainted', 'gift'],
      images: ['https://picsum.photos/seed/mug1/600/500'],
    },
    {
      entrepreneur: entrepreneurs[1]._id, name: 'Block Print Table Runner', category: 'textiles',
      description: 'Traditional hand block printed table runner. Made from natural cotton with indigo dye. Length 180 cm, width 35 cm.',
      price: 380, stock: 15, unit: 'piece', rating: 4.7, totalReviews: 9, isAvailable: true,
      tags: ['block-print', 'table-runner', 'indigo', 'cotton'],
      images: ['https://picsum.photos/seed/runner1/600/500'],
    },
    {
      entrepreneur: entrepreneurs[0]._id, name: 'Hand-Stitched Leather Wallet', category: 'leather',
      description: 'Premium hand-stitched genuine leather bifold wallet. Durable, compact, and ages beautifully. Multiple card slots.',
      price: 650, stock: 5, unit: 'piece', rating: 4.8, totalReviews: 7, isAvailable: true,
      tags: ['leather', 'wallet', 'handmade', 'genuine-leather'],
      images: ['https://picsum.photos/seed/wallet1/600/500'],
    },
  ]);

  console.log('\n✅ Seed complete! Demo accounts:');
  console.log('  Admin    → admin@kaushalsetu.com   / password123');
  console.log('  Customer → anjali@demo.com         / password123');
  console.log('  Artisan  → ramesh@demo.com         / password123');
  console.log('\n⚠️  Note: Update MONGODB_URI in .env before running.\n');
  process.exit(0);
};

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
