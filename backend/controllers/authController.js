const User = require('../models/User');

const hardcodedUsers = [
  { username: "ss_cr", role: "cr", programme: "MSc SOFTWARE SYSTEMS" },
  { username: "cs_cr", role: "cr", programme: "MSc CYBER SECURITY" },
  { username: "tcs_cr", role: "cr", programme: "MSc THEORETICAL COMPUTER SCIENCE" },
  { username: "ds_cr", role: "cr", programme: "MSc DATA SCIENCE" },
  { username: "admin", role: "admin" }
];

const login = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const user = hardcodedUsers.find(u => u.username === username);
  if (user) {
    // Optionally create/update user in DB
    try {
      await User.findOneAndUpdate(
        { username },
        user,
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("Error upserting user:", err);
    }
    return res.json({ user, success: true });
  }

  return res.status(401).json({ message: 'Invalid role/user.' });
};

module.exports = { login };
