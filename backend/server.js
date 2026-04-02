const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Timetable = require('./models/Timetable');
const path = require('path');

// Route files
const authRoutes = require('./routes/authRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Check and seed Timetable data from frontend mock data
const seedDatabase = async () => {
  try {
    const count = await Timetable.countDocuments();
    if (count === 0) {
      console.log('Seeding timetable data into MongoDB...');
      
      // Dynamic import to load the frontend ES module
      const frontendDataPath = path.resolve(__dirname, '../frontend/src/data/mockData.js');
      const mockData = await import(`file://${frontendDataPath}`);
      const timetablesArray = mockData.timetables;

      for (const t of timetablesArray) {
        if (t.schedule && Array.isArray(t.schedule)) {
          for (const s of t.schedule) {
            await Timetable.create({
              programme: t.programme,
              semester: t.semester,
              day: s.day,
              period: s.period,
              course: s.course,
              resource: s.resource,
              type: s.type
            });
          }
        }
      }
      console.log('Database seeded successfully.');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

// Connect to MongoDB and seed
connectDB().then(() => {
  seedDatabase();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
