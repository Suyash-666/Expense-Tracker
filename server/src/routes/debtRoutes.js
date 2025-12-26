import express from 'express';
import {
  createDebt,
  getDebts,
  getDebtById,
  updateDebt,
  deleteDebt,
} from '../controllers/debtController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createDebt);
router.get('/', getDebts);
router.get('/:id', getDebtById);
router.put('/:id', updateDebt);
router.delete('/:id', deleteDebt);

export default router;
