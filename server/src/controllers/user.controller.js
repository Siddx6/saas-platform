const User = require('../models/User.model');

// PATCH /api/users/notifications
const updateNotifications = async (req, res, next) => {
  try {
    const { notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notifications },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { updateNotifications };