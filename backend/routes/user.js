const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to fetch user details by user ID
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user by ID and populate the order history
    const user = await User.findById(userId).populate({
      path: 'orderHistory',
      options: { sort: { date: -1 } } // Sort order history by date in descending order
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
