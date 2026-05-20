import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import axios from 'axios';
import { getAllReviews_api, getPendingReviews_api, approveReview_api, rejectReview_api, updateReview_api, deleteReview_api } from '../../Services/Api';
import { getCookie } from '../../utills/cookieManager';
import toast from 'react-hot-toast';

const ManageReviews = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' or 'PENDING'

  const [formData, setFormData] = useState({
    userName: '', reviewText: '', rating: 5, status: 'APPROVED'
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = getCookie('adminToken');
      // We fetch all to handle potential 'null' statuses that might not be in the backend's strict /pending endpoint
      const response = await axios.get(getAllReviews_api, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rawData = response.data.data?.content || response.data.data || response.data;
      let data = Array.isArray(rawData) ? rawData : [];
      
      // Filter if in pending tab
      if (activeTab === 'PENDING') {
        data = data.filter(r => !r.status || r.status === 'PENDING');
      }

      const sortedData = [...data].sort((a, b) => {
        const statusOrder = { 'PENDING': 1, 'APPROVED': 2, 'REJECTED': 3 };
        const getStatusRank = (status) => statusOrder[status] || 1; 
        return getStatusRank(a.status) - getStatusRank(b.status);
      });

      setReviews(sortedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(`Failed to load ${activeTab.toLowerCase()} reviews`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      userName: review.userName || review.user_name || review.name || '',
      reviewText: review.reviewText || review.text || review.comment || '',
      rating: review.rating || 5,
      status: review.status || 'APPROVED'
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      const token = getCookie('adminToken');
      await axios.delete(deleteReview_api(reviewToDelete), {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete review");
    } finally {
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = getCookie('adminToken');
      await axios.put(approveReview_api(id), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review approved!");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = getCookie('adminToken');
      await axios.put(rejectReview_api(id), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review rejected!");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to reject review");
    }
  };

  const resetForm = () => {
    setFormData({ userName: '', reviewText: '', rating: 5, status: 'APPROVED' });
    setEditingReview(null);
    setShowModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getCookie('adminToken');
    
    try {
      if (editingReview) {
        await axios.put(updateReview_api(editingReview.id), formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success("Review updated!");
      } else {
        toast.error("Direct creation not supported via this API yet");
      }
      fetchReviews();
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Customer Reviews</h1>
          <p>Moderate and manage feedback from travelers.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { resetForm(); setShowModal(true); }}>+ Add Review</button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('ALL')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'ALL' ? '#f59e0b' : '#94a3b8',
            fontWeight: activeTab === 'ALL' ? '600' : '400',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderBottom: activeTab === 'ALL' ? '2px solid #f59e0b' : '2px solid transparent',
            transition: 'all 0.3s'
          }}
        >
          All Reviews
        </button>
        <button 
          onClick={() => setActiveTab('PENDING')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'PENDING' ? '#f59e0b' : '#94a3b8',
            fontWeight: activeTab === 'PENDING' ? '600' : '400',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderBottom: activeTab === 'PENDING' ? '2px solid #f59e0b' : '2px solid transparent',
            transition: 'all 0.3s'
          }}
        >
          Pending Moderation
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Tour Package</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading reviews...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No reviews found.</td></tr>
              ) : reviews.map(review => (
                <tr key={review.id}>
                  <td>{review.userName || review.user_name || review.name}</td>
                  <td>{review.tourName || review.tour}</td>
                  <td>⭐ {review.rating}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem',
                      background: review.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' : 
                                 review.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 
                                 'rgba(234, 179, 8, 0.2)',
                      color: review.status === 'APPROVED' ? '#22c55e' : 
                             review.status === 'REJECTED' ? '#ef4444' : 
                             '#eab308'
                    }}>
                      {review.status || 'PENDING'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`${styles.btnOutline} ${styles.btnPrimary}`} 
                      onClick={() => { setSelectedReview(review); setShowDetailsModal(true); }}
                      style={{ borderColor: '#f59e0b', color: '#f59e0b', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      View Full
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                      {(review.status === 'PENDING' || !review.status) ? (
                        <>
                          <button className={`${styles.btnOutline} ${styles.btnSuccess}`} onClick={() => handleApprove(review.id)}>Approve</button>
                          <button className={`${styles.btnOutline} ${styles.btnDanger}`} onClick={() => handleReject(review.id)}>Reject</button>
                        </>
                      ) : (
                        <>
                          <button className={styles.btnOutline} onClick={() => handleEdit(review)}>Edit</button>
                          <button className={`${styles.btnOutline} ${styles.btnDanger}`} onClick={() => handleDeleteClick(review.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteIconBox}>!</div>
            <h2>Are you sure?</h2>
            <p>You are about to permanently delete this review. This action cannot be undone.</p>
            <div className={styles.deleteActions}>
              <button className={styles.btnDanger} onClick={confirmDelete}>Delete Permanently</button>
              <button className={styles.btnOutline} onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Details Modal */}
      {showDetailsModal && selectedReview && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div className={styles.detailsModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Review Details</h2>
              <button className={styles.closeBtn} onClick={() => setShowDetailsModal(false)}>&times;</button>
            </div>
            
            <div className={styles.detailsContent}>
              <div className={styles.detailHeader}>
                <div>
                  <span className={styles.detailLabel}>Traveler</span>
                  <h3>{selectedReview.userName || selectedReview.name}</h3>
                </div>
                <div>
                  <span className={styles.detailLabel}>Rating</span>
                  <div className={styles.detailRating}>⭐ {selectedReview.rating} / 5</div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Feedback Message</span>
                <p className={styles.fullMessage}>{selectedReview.reviewText || selectedReview.text || selectedReview.comment}</p>
              </div>

              {selectedReview.images && (Array.isArray(selectedReview.images) ? selectedReview.images : [selectedReview.images]).filter(img => typeof img === 'string' && img.trim() !== '').length > 0 && (
                <div className={styles.detailSection}>
                  <span className={styles.detailLabel}>Travel Photos</span>
                  <div className={styles.detailsGallery}>
                    {(Array.isArray(selectedReview.images) ? selectedReview.images : [selectedReview.images])
                      .filter(img => typeof img === 'string' && img.trim() !== '')
                      .map((img, i) => (
                      <img 
                        key={i} 
                        src={img.startsWith('http') ? img : `http://164.52.215.8:9373${img}`} 
                        alt="Travel" 
                        onClick={() => window.open(img.startsWith('http') ? img : `http://164.52.215.8:9373${img}`, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setShowDetailsModal(false)}>Close Inspector</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingReview ? 'Edit Review' : 'Add New Review'}</h2>
              <button className={styles.closeBtn} onClick={resetForm}>&times;</button>
            </div>
            <div className={styles.scrollableForm}>
              <form id="reviewForm" onSubmit={handleSave} className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>User Name</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    required
                    value={formData.userName}
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                    placeholder="e.g. John Doe" 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Rating (1-5)</label>
                  <input 
                    type="number" 
                    min="1" max="5"
                    className={styles.input} 
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select 
                    className={styles.select}
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Review Text</label>
                  <textarea 
                    className={styles.textarea} 
                    required
                    value={formData.reviewText}
                    onChange={e => setFormData({...formData, reviewText: e.target.value})}
                    placeholder="What did the customer say?"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className={styles.modalFooter} style={{ gap: '1rem' }}>
              <button type="submit" form="reviewForm" className={styles.btnPrimary} style={{ flex: 1 }}>Save Review</button>
              <button type="button" className={styles.btnOutline} style={{ flex: 1 }} onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
