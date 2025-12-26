import express from 'express';
import {
  createRecurringExpense,
  getRecurringExpenses,
  getRecurringExpenseById,
  updateRecurringExpense,
  deleteRecurringExpense,
} from '../controllers/recurringExpenseController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createRecurringExpense);
router.get('/', getRecurringExpenses);
router.get('/:id', getRecurringExpenseById);
router.put('/:id', updateRecurringExpense);
router.delete('/:id', deleteRecurringExpense);

export default router;
