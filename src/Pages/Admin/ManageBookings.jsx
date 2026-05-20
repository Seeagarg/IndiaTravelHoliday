import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import axios from 'axios';
import { analytics_api } from '../../Services/Api';
import { getCookie } from '../../utills/cookieManager';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const getToday = () => new Date().toISOString().split('T')[0];
  const getFirstDayOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 2).toISOString().split('T')[0]; // Using 2 to handle timezone shifts often occurring with .toISOString()
  };

  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ 
    from: getFirstDayOfMonth().substring(0, 8) + '01', 
    to: getToday() 
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = getCookie('adminToken');
      const response = await axios.get(analytics_api(dateRange.from, dateRange.to), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data || response.data;
      setAnalyticsData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAnalytics();
  };

  return (
    <div className={styles.analyticsPage}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Platform Growth Analytics</h1>
          <p>Comprehensive tracking of system bookings, user inquiries, and growth metrics.</p>
        </div>
      </div>

      {/* Modern Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className={styles.card} style={{ margin: 0, padding: '1.5rem', borderLeft: '4px solid #ff8a00' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metric Snapshots</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem', color: '#f8fafc' }}>{analyticsData.length} Records</h2>
        </div>
        <div className={styles.card} style={{ margin: 0, padding: '1.5rem', borderLeft: '4px solid #22c55e' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Period</span>
          <h2 style={{ fontSize: '1.1rem', marginTop: '0.5rem', color: '#f8fafc' }}>({dateRange.from}) - ({dateRange.to})</h2>
        </div>
        <div className={styles.card} style={{ margin: 0, padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Status</span>
          <h2 style={{ fontSize: '1.4rem', marginTop: '0.5rem', color: '#22c55e' }}>● Active</h2>
        </div>
      </div>

      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.4rem', color: '#f8fafc' }}>Custom Range Analysis</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Compare performance across different time frames.</p>
          </div>
          
          <form onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', width: '100%', maxWidth: '500px' }}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>FROM</label>
                <input type="date" className={styles.input} value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>TO</label>
                <input type="date" className={styles.input} value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} />
              </div>
            </div>
            
            <div className={styles.filterActions} style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button type="submit" className={styles.btnPrimary} style={{ height: '48px', padding: '0 3rem' }}>Analyze Data</button>
              <button type="button" className={styles.btnOutline} onClick={() => { setDateRange({ from: getFirstDayOfMonth().substring(0, 8) + '01', to: getToday() }); fetchAnalytics(); }} style={{ height: '48px' }}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <p style={{ color: '#94a3b8' }}>Aggregating system metrics...</p>
            </div>
          ) : analyticsData.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Observation Date</th>
                  <th>New Bookings</th>
                  <th>Inquiries</th>
                  <th>Growth Factor</th>
                  <th style={{ textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((item, idx) => (
                  <tr key={idx}>
                    <td><span style={{ color: '#f1f5f9', fontWeight: '500' }}>{item.date || item.createdAt || 'N/A'}</span></td>
                    <td>{item.bookingsCount || item.bookings || 0}</td>
                    <td>{item.queriesCount || item.queries || 0}</td>
                    <td>
                      <span style={{ color: '#22c55e', fontVariantNumeric: 'tabular-nums' }}>
                        +{item.growth || '0.0%'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ 
                        padding: '0.3rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📉</div>
              <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem', fontSize: '1.5rem' }}>No Metric matches</h3>
              <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>We couldn't find any growth records for this specific period. Try adjusting your filter to a wider date range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
