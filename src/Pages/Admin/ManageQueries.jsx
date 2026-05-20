import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import axios from 'axios';
import { userQueries_api } from '../../Services/Api';
import { getCookie } from '../../utills/cookieManager';
import toast from 'react-hot-toast';

const ManageQueries = () => {
  const getToday = () => new Date().toISOString().split('T')[0];
  const getFirstDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 2).toISOString().split('T')[0];
  };

  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ 
    from: getFirstDayOfMonth().substring(0, 8) + '01', 
    to: getToday() 
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchQueries = async (p = 0) => {
    setLoading(true);
    try {
      const token = getCookie('adminToken');
      const response = await axios.get(userQueries_api(dateRange.from, dateRange.to, p, 10), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setQueries(data);
        setTotalPages(Math.ceil((response.data.totalElements || data.length) / 10));
      } else if (data.content && Array.isArray(data.content)) {
        setQueries(data.content);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Failed to load user queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries(0);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(0);
    fetchQueries(0);
  };

  const handleNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchQueries(nextPage);
  };

  const handlePrev = () => {
    if (page > 0) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchQueries(prevPage);
    }
  };

  return (
    <div className={styles.analyticsPage}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>User Queries</h1>
          <p>Messages and inquiries submitted via the Contact form.</p>
        </div>
      </div>

      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.4rem', color: '#f8fafc' }}>Search Filter</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Filter through customer inquiries by selecting a date range.</p>
          </div>
          
          <form onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', gap: '1.5rem', width: '100%', maxWidth: '500px' }}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>FROM DATE</label>
                <input 
                  type="date" 
                  className={styles.input} 
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>TO DATE</label>
                <input 
                  type="date" 
                  className={styles.input} 
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </div>
            
            <div className={styles.filterActions} style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button type="submit" className={styles.btnPrimary} style={{ height: '48px', padding: '0 3rem' }}>Apply Filter</button>
              <button 
                type="button" 
                className={styles.btnOutline} 
                onClick={() => { 
                  setDateRange({ from: getFirstDayOfMonth().substring(0, 8) + '01', to: getToday() }); 
                  fetchQueries(0); 
                }}
                style={{ height: '48px' }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading queries...</p>
          ) : queries.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Query Message</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.submittedDate ? new Date(item.submittedDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                    <td><span className={styles.label}>{item.name || 'Anonymous'}</span></td>
                    <td>{item.email || 'N/A'}</td>
                    <td>{item.mobileNumber || 'N/A'}</td>
                    <td style={{ maxWidth: '300px', fontSize: '0.85rem' }}>{item.query || 'No message provided'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#94a3b8' }}>No user queries found.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
            <button disabled={page === 0} onClick={handlePrev} className={styles.btnOutline}>Previous</button>
            <span style={{ color: '#94a3b8' }}>Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={handleNext} className={styles.btnOutline}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQueries;
