/**
 * Run with: npm run seed
 * Populates the database with the 6 required services and a default
 * admin account. Safe to re-run — it skips items that already exist.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const Service = require('../models/Service');
const User = require('../models/User');
const Worker = require('../models/Worker');

const defaultServices = [
  {
    name: 'General Oil & Filter Change',
    description: 'Complete engine oil and filter replacement using quality lubricants to keep your engine running smoothly.',
    price: 1500,
    duration: '30-45 mins',
    icon: '🛢️',
  },
  {
    name: 'Air Conditioning (AC) Repair & Gas Refill',
    description: 'Diagnosis and repair of AC issues, including gas refilling, for reliable cooling in any weather.',
    price: 2500,
    duration: '45-60 mins',
    icon: '❄️',
  },
  {
    name: 'Brake Inspection & Replacement',
    description: 'Thorough brake system check-up with pad/disc replacement to ensure safe, responsive stopping power.',
    price: 3000,
    duration: '1-1.5 hours',
    icon: '🛑',
  },
  {
    name: 'Engine Diagnostics & Tuning',
    description: 'Computerized engine diagnostics and fine-tuning to resolve performance issues and improve efficiency.',
    price: 3500,
    duration: '1-2 hours',
    icon: '⚙️',
  },
  {
    name: 'Wheel Alignment & Balancing',
    description: 'Precision wheel alignment and balancing for a smoother ride and even tire wear.',
    price: 2000,
    duration: '45 mins',
    icon: '🛞',
  },
  {
    name: 'Complete Car Detailing & Car Wash',
    description: 'Interior and exterior deep cleaning, polishing and detailing to make your vehicle look brand new.',
    price: 4000,
    duration: '2-3 hours',
    icon: '✨',
  },
];

const defaultWorkers = [
  { name: 'Imran Khalid', expertise: 'Oil Change Specialist', phone: '0300-1112233', experienceYears: 4 },
  { name: 'Bilal Ahmed', expertise: 'AC Technician', phone: '0300-2223344', experienceYears: 6 },
  { name: 'Hamza Tariq', expertise: 'Brake Specialist', phone: '0300-3334455', experienceYears: 5 },
  { name: 'Usman Farooq', expertise: 'Auto Electrician & Diagnostics', phone: '0300-4445566', experienceYears: 7 },
  { name: 'Saad Raza', expertise: 'Alignment & Balancing Technician', phone: '0300-5556677', experienceYears: 3 },
  { name: 'Ali Hassan', expertise: 'Detailing & Wash Specialist', phone: '0300-6667788', experienceYears: 2 },
];

const seed = async () => {
  await connectDB();

  // --- Services ---
  for (const service of defaultServices) {
    const exists = await Service.findOne({ name: service.name });
    if (!exists) {
      await Service.create(service);
      console.log(`Created service: ${service.name}`);
    } else {
      console.log(`Service already exists, skipped: ${service.name}`);
    }
  }

  // --- Workers ---
  for (const worker of defaultWorkers) {
    const exists = await Worker.findOne({ name: worker.name });
    if (!exists) {
      await Worker.create(worker);
      console.log(`Created worker: ${worker.name}`);
    } else {
      console.log(`Worker already exists, skipped: ${worker.name}`);
    }
  }

  // --- Admin account ---
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@autocare.com';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      phone: '0300-0000000',
      role: 'admin',
    });
    console.log(`Created admin account: ${adminEmail}`);
  } else {
    console.log(`Admin account already exists, skipped: ${adminEmail}`);
  }

  console.log('Seeding complete.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
