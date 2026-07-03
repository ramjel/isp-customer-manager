const express = require('express');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  archiveCustomer,
  restoreCustomer,
} = require('../controllers/customerController');
const authMiddleware = require('../middleware/auth');
const { customerValidation } = require('../middleware/validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', customerValidation, createCustomer);
router.put('/:id', customerValidation, updateCustomer);
router.patch('/:id/restore', restoreCustomer);
router.delete('/:id', archiveCustomer);

module.exports = router;
