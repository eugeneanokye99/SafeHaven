const Notification = require('../models/Notification');


// Fetch notifications for a specific user
exports.fetchNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    const notifications = await Notification.find({ userId });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
