const User = require('../models/User'); // Assuming you have a User model
const mongoose = require('mongoose');




// Function to fetch all user locations
exports.fetchSharedLocation = async (req, res) => {
  try {
    // Fetch all users' locations (longitude and latitude)
    const locations = await User.find({}, 'name latitude longitude');

    res.json(locations);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





// const User = require('../models/User'); 
// const Link = require('../models/Link'); 
// const mongoose = require('mongoose');

// // Function to fetch all user locations
// exports.fetchSharedLocation = async (req, res) => {
//   const { userId } = req.body;
//   const userObjectId = new mongoose.Types.ObjectId(userId);

//   try {
//     console.log('Fetching links for user:', userId);

//     // Fetch all links where the user is either the userId or linkedUserId
//     const links = await Link.find({
//       $or: [
//         { user_id: userObjectId },
//         { userId: userObjectId },
//       ],
//     });

//     console.log('Links found:', links);

//     if (links.length === 0) {
//       console.log('No linked users found.');
//       return res.json([]);
//     }

//     // Extract all linked user IDs
//     const linkedUserIds = links.map(link => 
//       link.userId.equals(userObjectId) ? link.user_id : link.userId
//     );

//     console.log('Linked user IDs:', linkedUserIds);

//     // Fetch locations of all linked users
//     const locations = await User.find(
//       { _id: { $in: linkedUserIds } },
//       'name latitude longitude'
//     );

//     console.log('Locations found:', locations);
//     res.json(locations);
//   } catch (error) {
//     console.error('Error fetching user locations:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };





