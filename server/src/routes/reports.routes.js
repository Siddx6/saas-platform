const router = require('express').Router();
const verifyJWT = require('../middleware/auth.middleware');
const { getReports, getReport, triggerReport } = require('../controllers/reports.controller');

router.use(verifyJWT);

router.get('/', getReports);
router.get('/:id', getReport);
router.post('/trigger-now', triggerReport); // temp test route

module.exports = router;