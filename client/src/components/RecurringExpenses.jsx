// src/components/RecurringExpenses.jsx
import { useState, useEffect } from 'react';
import { getRecurring, createRecurring, deleteRecurring, updateRecurring } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/RecurringExpenses.css';

const RecurringExpenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', // description
    amount: '',
    category: 'bills',
    frequency: 'monthly',
    nextDate: new Date().toISOString().split('T')[0],
    isActive: true
  });

  useEffect(() => {
    const loadRecurring = async () => {
      try {
        const data = await getRecurring();
        setExpenses(data);
      } catch (err) {
        toast.error('Unable to load recurring expenses');
      }
    };

    loadRecurring();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.nextDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createRecurring({
        description: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        frequency: formData.frequency,
        nextDate: formData.nextDate,
        isActive: formData.isActive
      });

      toast.success('Recurring expense added!');
      setShowForm(false);
      setFormData({
        name: '',
        amount: '',
        category: 'bills',
        frequency: 'monthly',
        nextDate: new Date().toISOString().split('T')[0],
        isActive: true
      });
    } catch (error) {
      toast.error('Failed to add expense');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recurring expense?')) {
      try {
        await deleteRecurring(id);
        toast.success('Deleted successfully');
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  const togglePaid = async (expense) => {
    try {
      await updateRecurring(expense._id || expense.id, {
        isActive: !expense.isActive
      });
      toast.success(expense.isActive ? 'Marked as inactive' : 'Marked as active');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const totalMonthly = expenses.filter(e => e.frequency === 'monthly').reduce((sum, e) => sum + e.amount, 0);
  const activeCount = expenses.filter(e => e.isActive).length;

  return (
    <div className="recurring-page">
      <div className="recurring-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>

        <h2 className="page-title">Recurring Expenses</h2>

        <div className="recurring-summary">
          <div className="summary-card">
            <label>Monthly Total</label>
            <p className="amount">${totalMonthly.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <label>Active Plans</label>
            <p className="amount">{activeCount}/{expenses.length}</p>
          </div>
        </div>

        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Recurring Expense'}
        </button>

        {showForm && (
          <form className="recurring-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Netflix Subscription" />
              </div>
              <div className="form-group">
                <label>Amount *</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="15.99" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="bills">Bills & Utilities</option>
                  <option value="subscriptions">Subscriptions</option>
                  <option value="rent">Rent/Mortgage</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Next Due Date *</label>
              <input type="date" value={formData.nextDate} onChange={(e) => setFormData({...formData, nextDate: e.target.value})} />
            </div>

            <button type="submit" className="submit-btn">Add Expense</button>
          </form>
        )}

        <div className="expenses-list">
          {expenses.length === 0 ? (
            <p className="no-data">No recurring expenses yet. Add one to track your bills!</p>
          ) : (
            expenses.map(expense => {
              const dueDate = expense.nextDate ? new Date(expense.nextDate) : new Date();
              const today = new Date();
              const dayDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              const isDueSoon = dayDiff <= 3 && dayDiff >= 0;
              
              return (
                <div key={expense._id || expense.id} className={`expense-card ${expense.isActive ? '' : 'paid'} ${isDueSoon ? 'due-soon' : ''}`}>
                  <div className="expense-header">
                    <div className="expense-info">
                      <FaCalendar className="expense-icon" />
                      <div>
                        <h3>{expense.description}</h3>
                        <span className="expense-category">{expense.category}</span>
                      </div>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(expense._id || expense.id)}>
                      <FaTrash />
                    </button>
                  </div>

                  <div className="expense-details">
                    <div className="detail-item">
                      <label>Amount</label>
                      <p className="expense-amount">${expense.amount.toFixed(2)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Frequency</label>
                      <p>{expense.frequency}</p>
                    </div>
                    <div className="detail-item">
                      <label>Due Day</label>
                      <p>{dueDate.toLocaleDateString()} {isDueSoon && '(Due Soon!)'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <p className={expense.isActive ? 'status-unpaid' : 'status-paid'}>
                        {expense.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  <button 
                    className={`toggle-btn ${expense.isActive ? 'unpaid-btn' : 'paid-btn'}`}
                    onClick={() => togglePaid(expense)}
                  >
                    {expense.isActive ? <><FaTimes /> Mark Inactive</> : <><FaCheck /> Mark Active</>}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RecurringExpenses;
