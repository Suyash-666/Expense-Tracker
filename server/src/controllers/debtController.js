import Debt from '../models/Debt.js';

export const createDebt = async (req, res) => {
  try {
    const { creditorName, totalAmount, interestRate, dueDate } = req.body;

    if (!creditorName || !totalAmount || !dueDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const debt = new Debt({
      userId: req.userId,
      creditorName,
      totalAmount,
      interestRate,
      dueDate,
    });

    await debt.save();
    res.status(201).json(debt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDebts = async (req, res) => {
  try {
    const debts = await Debt.find({ userId: req.userId });
    res.status(200).json(debts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDebtById = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt || debt.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    res.status(200).json(debt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt || debt.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    const { creditorName, totalAmount, amountPaid, interestRate, dueDate, status } = req.body;

    if (creditorName) debt.creditorName = creditorName;
    if (totalAmount) debt.totalAmount = totalAmount;
    if (amountPaid !== undefined) debt.amountPaid = amountPaid;
    if (interestRate) debt.interestRate = interestRate;
    if (dueDate) debt.dueDate = dueDate;
    if (status) debt.status = status;

    await debt.save();
    res.status(200).json(debt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt || debt.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    await Debt.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Debt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
