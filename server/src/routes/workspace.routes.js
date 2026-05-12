const router = require('express').Router();
const verifyJWT = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');
const {
  getWorkspace,
  updateWorkspace,
  getMembers,
  inviteMember,
  acceptInvite,
  changeMemberRole,
  removeMember,
} = require('../controllers/workspace.controller');

router.use(verifyJWT);

router.get('/', getWorkspace);
router.patch('/', checkRole('owner', 'admin'), updateWorkspace);
router.get('/members', getMembers);
router.post('/invite', checkRole('owner', 'admin'), inviteMember);
router.post('/accept-invite/:token', acceptInvite);
router.patch('/members/:id/role', checkRole('owner'), changeMemberRole);
router.delete('/members/:id', checkRole('owner'), removeMember);

module.exports = router;