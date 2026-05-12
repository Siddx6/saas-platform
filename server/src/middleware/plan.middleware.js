const Workspace = require('../models/Workspace.model');

const checkPlan = (requiredPlan) => {
  return async (req, res, next) => {
    try {
      const workspace = await Workspace.findById(req.user.workspaceId);
      if (!workspace || workspace.plan !== requiredPlan) {
        return res.status(403).json({ message: 'Upgrade to Pro to access this feature' });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = checkPlan;