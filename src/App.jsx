import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Coding Progress State
  const [codingData, setCodingData] = useState([]);
  const [codingForm, setCodingForm] = useState({ date: '', cfRating: '', cfSolved: '', lcSolved: '' });
  
  // Company State
  const [companies, setCompanies] = useState([]);
  const [companyForm, setCompanyForm] = useState({ name: '', role: '', status: 'Applied', date: '' });
  const [filter, setFilter] = useState('All');

  // Load data on mount
  useEffect(() => {
    const savedCoding = JSON.parse(localStorage.getItem('codingProgress') || '[]');
    const savedCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
    setCodingData(savedCoding);
    setCompanies(savedCompanies);
  }, []);

  // Add Coding Progress
  const addCodingProgress = (e) => {
    e.preventDefault();
    const newEntry = {
      ...codingForm,
      cfRating: parseInt(codingForm.cfRating) || 0,
      cfSolved: parseInt(codingForm.cfSolved) || 0,
      lcSolved: parseInt(codingForm.lcSolved) || 0
    };
    const updated = [...codingData, newEntry];
    setCodingData(updated);
    localStorage.setItem('codingProgress', JSON.stringify(updated));
    setCodingForm({ date: '', cfRating: '', cfSolved: '', lcSolved: '' });
  };

  // Add Company
  const addCompany = (e) => {
    e.preventDefault();
    const updated = [...companies, companyForm];
    setCompanies(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
    setCompanyForm({ name: '', role: '', status: 'Applied', date: '' });
  };

  // Delete functions
  const deleteCoding = (index) => {
    const updated = codingData.filter((_, idx) => idx !== index);
    setCodingData(updated);
    localStorage.setItem('codingProgress', JSON.stringify(updated));
  };

  const deleteCompany = (index) => {
    const updated = companies.filter((_, idx) => idx !== index);
    setCompanies(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
  };

  // Stats
  const totalProblems = codingData.reduce((sum, entry) => sum + entry.cfSolved + entry.lcSolved, 0);
  const latestCFRating = codingData.length > 0 ? codingData[codingData.length - 1].cfRating : 0;
  const appliedCount = companies.length;
  const interviewCount = companies.filter(c => c.status === 'Interview' || c.status === 'OA').length;

  // Chart Data
  const chartData = {
    labels: codingData.map((_, idx) => `Week ${idx + 1}`),
    datasets: [{
      label: 'Total Problems',
      data: codingData.map(entry => entry.cfSolved + entry.lcSolved),
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4
    }]
  };

  const filteredCompanies = filter === 'All' ? companies : companies.filter(c => c.status === filter);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1>🎯 Placement Tracker</h1>
          <div className="nav-tabs">
            <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
            <button className={`nav-btn ${activeTab === 'coding' ? 'active' : ''}`} onClick={() => setActiveTab('coding')}>Coding</button>
            <button className={`nav-btn ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>Companies</button>
          </div>
        </div>
      </nav>

      <div className="container">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Problems</h3>
                <p>{totalProblems}</p>
              </div>
              <div className="stat-card">
                <h3>CF Rating</h3>
                <p>{latestCFRating}</p>
              </div>
              <div className="stat-card">
                <h3>Companies Applied</h3>
                <p>{appliedCount}</p>
              </div>
              <div className="stat-card">
                <h3>In Interview</h3>
                <p>{interviewCount}</p>
              </div>
            </div>

            {codingData.length > 0 && (
              <div className="chart-container">
                <Line data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Progress Over Time' }}}} />
              </div>
            )}
          </div>
        )}

        {/* CODING TAB */}
        {activeTab === 'coding' && (
          <div>
            <div className="card">
              <h2>Add Coding Progress</h2>
              <form onSubmit={addCodingProgress}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={codingForm.date} onChange={(e) => setCodingForm({...codingForm, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>CF Rating</label>
                  <input type="number" placeholder="993" value={codingForm.cfRating} onChange={(e) => setCodingForm({...codingForm, cfRating: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>CF Problems</label>
                  <input type="number" placeholder="120" value={codingForm.cfSolved} onChange={(e) => setCodingForm({...codingForm, cfSolved: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>LC Problems</label>
                  <input type="number" placeholder="50" value={codingForm.lcSolved} onChange={(e) => setCodingForm({...codingForm, lcSolved: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary">Add Progress</button>
              </form>
            </div>

            <div className="card">
              <h2>Progress History</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>CF Rating</th>
                    <th>CF Solved</th>
                    <th>LC Solved</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {codingData.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{entry.date}</td>
                      <td>{entry.cfRating}</td>
                      <td>{entry.cfSolved}</td>
                      <td>{entry.lcSolved}</td>
                      <td>{entry.cfSolved + entry.lcSolved}</td>
                      <td><button className="btn btn-danger" onClick={() => deleteCoding(idx)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPANIES TAB */}
        {activeTab === 'companies' && (
          <div>
            <div className="card">
              <h2>Add Company</h2>
              <form onSubmit={addCompany}>
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" placeholder="Google" value={companyForm.name} onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" placeholder="SDE Intern" value={companyForm.role} onChange={(e) => setCompanyForm({...companyForm, role: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={companyForm.status} onChange={(e) => setCompanyForm({...companyForm, status: e.target.value})}>
                    <option>Applied</option>
                    <option>OA</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={companyForm.date} onChange={(e) => setCompanyForm({...companyForm, date: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary">Add Company</button>
              </form>
            </div>

            <div className="card">
              <h2>Applications ({filteredCompanies.length})</h2>
              <div className="form-group">
                <label>Filter</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option>All</option>
                  <option>Applied</option>
                  <option>OA</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company, idx) => (
                    <tr key={idx}>
                      <td>{company.name}</td>
                      <td>{company.role}</td>
                      <td><span className={`status-badge status-${company.status.toLowerCase()}`}>{company.status}</span></td>
                      <td>{company.date}</td>
                      <td><button className="btn btn-danger" onClick={() => deleteCompany(idx)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;