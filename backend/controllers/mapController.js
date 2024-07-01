const Location = require('../models/Location'); // Assuming you have a Location model
const User = require('../models/User'); // Assuming you have a User model
const mongoose = require('mongoose');

// Function to save or update user location
exports.saveOrUpdateLocation = async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  try {
    // Validate if userId exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save or update user location
    let location = await Location.findOne({ userId });
    if (!location) {
      location = new Location({ userId, latitude, longitude });
    } else {
      location.latitude = latitude;
      location.longitude = longitude;
    }
    await location.save();

    res.status(200).json({ message: 'Location saved or updated successfully' });
  } catch (error) {
    console.error('Error saving or updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to fetch nearby user locations
exports.fetchNearbyLocations = async (req, res) => {
  const { userId } = req.query;

  try {
    // Validate if userId exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch locations of nearby users (excluding current user)
    const locations = await Location.find({
      userId: { $ne: userId },
    });

    res.json(locations);
  } catch (error) {
    console.error('Error fetching nearby locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
