// src/components/DebtTracker.jsx
import { useState, useEffect } from 'react';
import { getDebts, createDebt, deleteDebt, updateDebt } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaTrash, FaDollarSign } from 'react-icons/fa';
import '../styles/DebtTracker.css';

const DebtTracker = () => {
  const navigate = useNavigate();
  const [debts, setDebts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'credit-card',
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    monthlyPayment: '',
    dueDate: ''
  });

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const data = await getDebts();
        setDebts(data);
      } catch (err) {
        toast.error('Unable to load debts');
      }
    };

    loadDebts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.totalAmount || !formData.remainingAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const totalAmount = parseFloat(formData.totalAmount);
      const remainingAmount = parseFloat(formData.remainingAmount);
      await createDebt({
        creditorName: formData.name,
        totalAmount,
        amountPaid: Math.max(0, totalAmount - remainingAmount),
        interestRate: parseFloat(formData.interestRate) || 0,
        dueDate: formData.dueDate || new Date().toISOString(),
        status: 'active'
      });

      toast.success('Debt added successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        type: 'credit-card',
        totalAmount: '',
        remainingAmount: '',
        interestRate: '',
        monthlyPayment: '',
        dueDate: ''
      });
    } catch (error) {
      toast.error('Failed to add debt');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      try {
        await deleteDebt(id);
        toast.success('Debt deleted successfully');
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  const handlePayment = async (debt) => {
    const payment = prompt('Enter payment amount:');
    if (!payment || isNaN(payment)) return;
    const paymentAmount = parseFloat(payment);
    const remaining = (debt.totalAmount || 0) - (debt.amountPaid || 0);
    const newRemaining = remaining - paymentAmount;
    if (newRemaining < 0) return toast.error('Payment amount exceeds remaining debt');

    try {
      await updateDebt(debt._id || debt.id, {
        amountPaid: (debt.amountPaid || 0) + paymentAmount,
        status: newRemaining === 0 ? 'paid-off' : 'active'
      });
      toast.success('Payment recorded!');
    } catch {
      toast.error('Failed to record payment');
    }
  };

  const totalDebt = debts.reduce((sum, debt) => sum + Math.max((debt.totalAmount || 0) - (debt.amountPaid || 0), 0), 0);
  const totalMonthly = debts.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);

  return (
    <div className="debt-tracker-page">
      <div className="debt-container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>

        <h2 className="page-title">Debt Tracker</h2>

        <div className="debt-summary">
          <div className="summary-card">
            <label>Total Debt</label>
            <p className="amount">${totalDebt.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <label>Monthly Payments</label>
            <p className="amount">${totalMonthly.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <label>Active Debts</label>
            <p className="amount">{debts.length}</p>
          </div>
        </div>

        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Debt'}
        </button>

        {showForm && (
          <form className="debt-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Debt Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Chase Credit Card" />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="credit-card">Credit Card</option>
                  <option value="loan">Loan</option>
                  <option value="mortgage">Mortgage</option>
                  <option value="student-loan">Student Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Amount *</label>
                <input type="number" step="0.01" value={formData.totalAmount} onChange={(e) => setFormData({...formData, totalAmount: e.target.value})} placeholder="5000" />
              </div>
              <div className="form-group">
                <label>Remaining Amount *</label>
                <input type="number" step="0.01" value={formData.remainingAmount} onChange={(e) => setFormData({...formData, remainingAmount: e.target.value})} placeholder="3500" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" step="0.01" value={formData.interestRate} onChange={(e) => setFormData({...formData, interestRate: e.target.value})} placeholder="18.5" />
              </div>
              <div className="form-group">
                <label>Monthly Payment</label>
                <input type="number" step="0.01" value={formData.monthlyPayment} onChange={(e) => setFormData({...formData, monthlyPayment: e.target.value})} placeholder="150" />
              </div>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
            </div>

            <button type="submit" className="submit-btn">Add Debt</button>
          </form>
        )}

        <div className="debts-list">
          {debts.length === 0 ? (
            <p className="no-data">No debts tracked yet. Add one to get started!</p>
          ) : (
            debts.map(debt => {
              const remaining = Math.max((debt.totalAmount || 0) - (debt.amountPaid || 0), 0);
              const progress = debt.totalAmount ? ((debt.totalAmount - remaining) / debt.totalAmount) * 100 : 0;
              return (
                <div key={debt._id || debt.id} className="debt-card">
                  <div className="debt-header">
                    <div className="debt-info">
                      <FaCreditCard className="debt-icon" />
                      <div>
                        <h3>{debt.creditorName || debt.name}</h3>
                        <span className="debt-type">{(debt.type || 'active').replace('-', ' ')}</span>
                      </div>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(debt._id || debt.id)}>
                      <FaTrash />
                    </button>
                  </div>

                  <div className="debt-details">
                    <div className="detail-item">
                      <label>Remaining</label>
                      <p className="remaining">${remaining.toFixed(2)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Total</label>
                      <p>${(debt.totalAmount || 0).toFixed(2)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Interest</label>
                      <p>{debt.interestRate}%</p>
                    </div>
                    <div className="detail-item">
                      <label>Monthly</label>
                      <p>${(debt.monthlyPayment || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${progress}%`}}></div>
                    </div>
                    <span className="progress-text">{progress.toFixed(1)}% paid off</span>
                  </div>

                  <button className="payment-btn" onClick={() => handlePayment(debt)}>
                    <FaDollarSign /> Record Payment
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

export default DebtTracker;
