import Income from '../models/Income.js';

export const createIncome = async (req, res) => {
  try {
    const { source, amount, date, description } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const income = new Income({
      userId: req.userId,
      source,
      amount,
      date,
      description,
    });

    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.userId }).sort({
      date: -1,
    });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income || income.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income || income.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Income not found' });
    }

    await Income.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
