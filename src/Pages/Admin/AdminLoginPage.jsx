import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login_api } from '../../Services/Api';
import styles from './AdminLoginPage.module.css';
import { setCookie } from '../../utills/cookieManager';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(login_api, {
        username,
        password
      });

      if (response.data && response.data.data) {
        // user mentioned "data" is the token
        const token = response.data.data;
        // Save token in cookie for 1 day
        setCookie('adminToken', token, 1);
        localStorage.setItem('adminUser', username);
        navigate('/admin');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <span className={styles.logo}>India Travel Holiday</span>
          <h2>Admin Portals</h2>
          <p>Login to manage your tours and destinations</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.backLink}>
          <a href="/">← Back to Homepage</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
