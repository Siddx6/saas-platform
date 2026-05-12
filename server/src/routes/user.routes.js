const router = require('express').Router();
const verifyJWT = require('../middleware/auth.middleware');
const { updateNotifications } = require('../controllers/user.controller');

router.use(verifyJWT);
router.patch('/notifications', updateNotifications);

module.exports = router;