const router = require('express').Router();
const verifyJWT = require('../middleware/auth.middleware');
const { uploadData, getSummary, getRevenueChart, getTopProducts } = require('../controllers/data.controller');

router.use(verifyJWT);

router.post('/upload', uploadData);
router.get('/summary', getSummary);
router.get('/revenue-chart', getRevenueChart);
router.get('/top-products', getTopProducts);

module.exports = router;