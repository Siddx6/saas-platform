const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/auth.middleware');
const { createOrder, verifyPayment, webhook } = require('../controllers/billing.controller');

router.post('/webhook', webhook);

router.use(verifyJWT);
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

module.exports = router;