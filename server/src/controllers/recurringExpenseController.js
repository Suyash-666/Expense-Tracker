import RecurringExpense from '../models/RecurringExpense.js';

export const createRecurringExpense = async (req, res) => {
  try {
    const { description, amount, category, frequency, nextDate } = req.body;

    if (!description || !amount || !category || !frequency || !nextDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const recurring = new RecurringExpense({
      userId: req.userId,
      description,
      amount,
      category,
      frequency,
      nextDate,
    });

    await recurring.save();
    res.status(201).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecurringExpenses = async (req, res) => {
  try {
    const recurring = await RecurringExpense.find({ userId: req.userId });
    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecurringExpenseById = async (req, res) => {
  try {
    const recurring = await RecurringExpense.findById(req.params.id);

    if (!recurring || recurring.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Recurring expense not found' });
    }

    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRecurringExpense = async (req, res) => {
  try {
    const recurring = await RecurringExpense.findById(req.params.id);

    if (!recurring || recurring.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Recurring expense not found' });
    }

    const { description, amount, category, frequency, nextDate, isActive } = req.body;

    if (description) recurring.description = description;
    if (amount) recurring.amount = amount;
    if (category) recurring.category = category;
    if (frequency) recurring.frequency = frequency;
    if (nextDate) recurring.nextDate = nextDate;
    if (isActive !== undefined) recurring.isActive = isActive;

    await recurring.save();
    res.status(200).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecurringExpense = async (req, res) => {
  try {
    const recurring = await RecurringExpense.findById(req.params.id);

    if (!recurring || recurring.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Recurring expense not found' });
    }

    await RecurringExpense.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Recurring expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
