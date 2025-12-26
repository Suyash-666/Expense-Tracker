import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

export const createBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const budget = new Budget({
      userId: req.userId,
      category,
      limit,
      month,
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    
    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Expense.find({
          userId: req.userId,
          category: budget.category,
        });
        const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        return { ...budget.toObject(), spent };
      })
    );

    res.status(200).json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const { category, limit, month } = req.body;

    if (category) budget.category = category;
    if (limit) budget.limit = limit;
    if (month) budget.month = month;

    await budget.save();
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
