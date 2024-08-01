const User = require('../models/User'); 
const Link = require('../models/Link'); 
const mongoose = require('mongoose');




// Function to fetch shared locations for linked users
exports.fetchSharedLocation = async (req, res) => {
  const { userId } = req.query;

  try {
    // Convert the userId to ObjectId format
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find links where the user is either user_id or userId
    const links = await Link.find({
      $or: [{ user_id: userObjectId }, { userId: userObjectId }]
    });

    // Extract linked user IDs excluding the requesting userId
    const linkedUserIds = links
      .map(link => link.user_id.toString() === userId ? link.userId : link.user_id)
      .filter(id => id.toString() !== userObjectId.toString());

    // Fetch locations of linked users
    const locations = await User.find({
      _id: { $in: linkedUserIds }
    }, '_id name latitude longitude');

    res.json(locations);
  } catch (error) {
    console.error('Error fetching shared locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};









