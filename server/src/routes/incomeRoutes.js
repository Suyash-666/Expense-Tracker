import express from 'express';
import {
  createIncome,
  getIncomes,
  getIncomeById,
  deleteIncome,
} from '../controllers/incomeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createIncome);
router.get('/', getIncomes);
router.get('/:id', getIncomeById);
router.delete('/:id', deleteIncome);

export default router;
