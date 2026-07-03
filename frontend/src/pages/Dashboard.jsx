import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TABS = [
  { key: 'total', label: 'Total Customers' },
  { key: 'active', label: 'Active Customers' },
  { key: 'inactive', label: 'Inactive Customers' },
];

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [activeTab, setActiveTab] = useState('total');
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [statsRes, customersRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/customers'),
        ]);
        setStats(statsRes.data.data);
        setRecentCustomers(customersRes.data.data.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const tabValue = stats[activeTab] ?? 0;

  if (loading) {
    return <div className="page-loading">Loading dashboard...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your customer base</p>
        </div>
        <Link to="/customers" className="btn btn-primary">
          Manage Customers
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        <div className={`stat-card total ${activeTab === 'total' ? 'highlight' : ''}`}>
          <span className="stat-label">Total</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className={`stat-card active ${activeTab === 'active' ? 'highlight' : ''}`}>
          <span className="stat-label">Active</span>
          <span className="stat-value">{stats.active}</span>
        </div>
        <div className={`stat-card inactive ${activeTab === 'inactive' ? 'highlight' : ''}`}>
          <span className="stat-label">Inactive</span>
          <span className="stat-value">{stats.inactive}</span>
        </div>
      </div>

      <div className="dashboard-highlight card">
        <h2>{TABS.find((t) => t.key === activeTab)?.label}</h2>
        <p className="highlight-value">{tabValue}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Customers</h2>
        </div>
        {recentCustomers.length === 0 ? (
          <p className="empty-state">No customers yet. Add your first customer.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Plan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.full_name}</td>
                    <td>{customer.contact_number}</td>
                    <td>{customer.internet_plan}</td>
                    <td>
                      <span className={`badge badge-${customer.status}`}>{customer.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
