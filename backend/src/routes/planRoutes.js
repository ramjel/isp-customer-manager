const express = require('express');
const { getPlans, createPlan } = require('../controllers/planController');
const authMiddleware = require('../middleware/auth');
const { planValidation } = require('../middleware/validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getPlans);
router.post('/', planValidation, createPlan);

module.exports = router;
