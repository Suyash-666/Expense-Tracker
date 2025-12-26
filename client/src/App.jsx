// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { fetchCurrentUser, getExpenses, setAuthToken, clearAuthToken, logoutUser } from './services/api';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import UserInfo from './components/UserInfo';
import InvestmentTips from './components/InvestmentTips';
import Help from './components/Help';
import Feedback from './components/Feedback';
import Reports from './components/Reports';
import DebtTracker from './components/DebtTracker';
import RecurringExpenses from './components/RecurringExpenses';
import IncomeSources from './components/IncomeSources';
import Budget from './components/Budget';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseCharts from './components/ExpenseCharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from 'react-icons/fa';

// Wrapper component for standalone pages
const PageWrapper = ({ children, title }) => {
  const navigate = useNavigate();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
      padding: '2rem',
      fontFamily: "'Orbitron', sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '2px solid rgba(0, 240, 255, 0.3)',
              color: '#00f0ff',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 240, 255, 0.2)';
              e.target.style.borderColor = '#00f0ff';
              e.target.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 240, 255, 0.1)';
              e.target.style.borderColor = 'rgba(0, 240, 255, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          {title && (
            <h1 style={{
              color: '#00f0ff',
              fontSize: '2.5rem',
              margin: '1.5rem 0',
              textShadow: '0 0 20px rgba(0, 240, 255, 0.5)'
            }}>{title}</h1>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

// Charts Page Component
const ChartsPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        toast.error('Failed to load expenses');
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
        color: '#00f0ff',
        fontSize: '1.5rem',
        fontFamily: "'Orbitron', sans-serif"
      }}>
        Loading charts...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
      padding: '2rem',
      fontFamily: "'Orbitron', sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '2px solid rgba(0, 240, 255, 0.3)',
              color: '#00f0ff',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 240, 255, 0.2)';
              e.target.style.borderColor = '#00f0ff';
              e.target.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 240, 255, 0.1)';
              e.target.style.borderColor = 'rgba(0, 240, 255, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 style={{
            color: '#00f0ff',
            fontSize: '2.5rem',
            margin: '1.5rem 0',
            textShadow: '0 0 20px rgba(0, 240, 255, 0.5)'
          }}>📊 Expense Analytics & Charts</h1>
        </div>
        <div style={{
          background: 'rgba(0, 8, 20, 0.85)',
          borderRadius: '16px',
          padding: '2rem',
          border: '2px solid rgba(0, 240, 255, 0.3)',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)'
        }}>
          <ExpenseCharts expenses={expenses} />
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const stored = localStorage.getItem('token');
      if (!stored) {
        setLoading(false);
        return;
      }

      setAuthToken(stored);

      try {
        const current = await fetchCurrentUser();
        setUser(current);
      } catch (err) {
        clearAuthToken();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const handleAuthSuccess = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router basename="/finance-tracker">
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/add-expense" element={user ? <PageWrapper title="Add New Expense"><ExpenseForm /></PageWrapper> : <Navigate to="/auth" />} />
          <Route path="/expense-list" element={user ? <PageWrapper title="Expense List"><ExpenseList /></PageWrapper> : <Navigate to="/auth" />} />
          <Route path="/charts" element={user ? <ChartsPage /> : <Navigate to="/auth" />} />
          <Route path="/user-info" element={user ? <UserInfo /> : <Navigate to="/auth" />} />
          <Route path="/investment-tips" element={user ? <InvestmentTips /> : <Navigate to="/auth" />} />
          <Route path="/help" element={user ? <Help /> : <Navigate to="/auth" />} />
          <Route path="/feedback" element={user ? <Feedback /> : <Navigate to="/auth" />} />
          <Route path="/reports" element={user ? <Reports /> : <Navigate to="/auth" />} />
          <Route path="/debt-tracker" element={user ? <DebtTracker /> : <Navigate to="/auth" />} />
          <Route path="/recurring-expenses" element={user ? <RecurringExpenses /> : <Navigate to="/auth" />} />
          <Route path="/income-sources" element={user ? <IncomeSources /> : <Navigate to="/auth" />} />
          <Route path="/budget" element={user ? <Budget /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;