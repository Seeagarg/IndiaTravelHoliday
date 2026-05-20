import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import axios from 'axios';
import {
  saveDestination_api,
  updateDestination_api,
  deleteDestination_api,
  uploadIcon_api,
  uploadBanner_api,
  base_url
} from '../../Services/Api';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utills/cookieManager';
import toast from 'react-hot-toast';

const ManageLocations = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    id: '', label: '', featured: true, icon: '', banner: ''
  });

  // Fetch destinations from API

  const [selectedIconFile, setSelectedIconFile] = useState(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Fetch logic ... (unchanged)

  const handleEdit = (loc) => {
    setEditingLoc(loc);
    setFormData(loc);
    setSelectedIconFile(null);
    setSelectedBannerFile(null);
    setIconPreview(loc.icon);
    setBannerPreview(loc.banner);
    setShowModal(true);
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 1MB)
    const MAX_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      toast.error('File size exceeds 1MB. Please select a smaller image.');
      e.target.value = null; // Clear input
      return;
    }

    if (type === 'icon') {
      setSelectedIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    } else if (type === 'banner') {
      setSelectedBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ id: '', label: '', featured: true, icon: '', banner: '' });
    setEditingLoc(null);
    setSelectedIconFile(null);
    setSelectedBannerFile(null);
    setIconPreview(null);
    setBannerPreview(null);
    setShowModal(false);
    setLoading(false);
  };

  const syncMetadata = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getCookie('adminToken');
      const payload = {
        internalId: formData.id,
        label: formData.label,
        iconUrl: formData.icon || "",
        bannerUrl: formData.banner || "",
        isFeatured: formData.featured
      };

      const endpoint = editingLoc ? updateDestination_api(editingLoc.realId || editingLoc.id) : saveDestination_api;
      const method = editingLoc ? 'put' : 'post';

      const res = await axios[method](endpoint, payload, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      toast.success('Details synced successfully');

      if (!editingLoc) {
        // Create new location in state
        const newId = payload.internalId || Date.now().toString();
        setLocations(prev => [...prev, {
          id: newId,
          realId: res.data?.data?.id || newId, // use backend returned id if available
          label: payload.label,
          featured: payload.isFeatured,
          icon: payload.iconUrl || '',
          banner: payload.bannerUrl || ''
        }]);
      } else {
        // Update existing location in state
        setLocations(prev => prev.map(l => (l.id === editingLoc.id ? {
          ...l,
          label: payload.label,
          featured: payload.isFeatured
        } : l)));
      }
      
      resetForm();
    } catch (err) {
      toast.error('Sync failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const uploadAsset = async (type) => {
    const file = type === 'icon' ? selectedIconFile : selectedBannerFile;
    const destId = editingLoc?.realId || editingLoc?.id;
    if (!file || !destId) return alert('Select a file and ensure destination is saved first');

    setLoading(true);
    try {
      const token = getCookie('adminToken');
      const data = new FormData();
      data.append('file', file);

      const endpoint = type === 'icon' ? uploadIcon_api(destId) : uploadBanner_api(destId);
      const res = await axios.post(endpoint, data, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      toast.success(`${type.toUpperCase()} uploaded successfully`);
      
      // The backend server returns the file URL in res.data.data
      const newUrl = res.data?.data;
      if (newUrl) {
        setLocations(prev => prev.map(l => l.id === destId ? { ...l, [type]: newUrl } : l));
        
        // Update currently edited location form values if editing this location
        if (editingLoc && (editingLoc.id === destId || editingLoc.realId === destId)) {
          setFormData(prev => ({
            ...prev,
            [type]: newUrl
          }));
          setEditingLoc(prev => ({
            ...prev,
            [type]: newUrl
          }));
        }
      }

      if (type === 'icon') setSelectedIconFile(null);
      else setSelectedBannerFile(null);
    } catch (err) {
      toast.error('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const [previewImage, setPreviewImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [quickUploadType, setQuickUploadType] = useState(null);
  const [uploadLoc, setUploadLoc] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [locToDelete, setLocToDelete] = useState(null);

  const handleQuickUpload = (loc, type) => {
    setEditingLoc(loc);
    setQuickUploadType(type);
    setUploadLoc(loc);
    setShowUploadModal(true);
  };

  const submitQuickUpload = async () => {
    const file = quickUploadType === 'icon' ? selectedIconFile : selectedBannerFile;
    if (!file) return toast.error('Please select a file first');
    await uploadAsset(quickUploadType);
    setShowUploadModal(false);
    setSelectedIconFile(null);
    setSelectedBannerFile(null);
    // Reload removed to prevent full page reload
  };

  const confirmDelete = (loc) => {
    setLocToDelete(loc);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!locToDelete) return;
    setLoading(true);
    try {
      const token = getCookie('adminToken');
      const id = locToDelete.realId || locToDelete.id;
      await axios.delete(deleteDestination_api(id), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLocations(locations.filter(l => l.id !== locToDelete.id));
      toast.success('Destination removed successfully');
      setShowDeleteModal(false);
      setLocToDelete(null);
    } catch (err) {
      toast.error('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };



    useEffect(() => {
    const fetchLocations = async () => {
      const token = getCookie('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await axios.get(saveDestination_api, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = response.data;
        if (result && result.status === 200 && result.data) {
          const mapped = result.data.map(loc => ({
            id: loc.internalId || String(loc.id),
            realId: loc.id,
            label: loc.name || loc.label || '',
            featured: loc.isFeatured || false,
            icon: loc.iconUrl || '',
            banner: loc.bannerUrl || ''
          }));
          setLocations(mapped);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchLocations();
  }, [navigate,editingLoc]);


  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Manage Locations</h1>
          <p>Full control over destination metadata and assets.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { resetForm(); setShowModal(true); }}>+ Add New Location</button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tab ID</th>
                <th>Display Label</th>
                <th>Icon</th>
                <th>Banner</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} style={{ opacity: 0.5 }}>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem' }}>Loading destination data...</td>
                  </tr>
                ))
              ) : locations.map(loc => (
                <tr key={loc.id}>
                  <td><code className={styles.code}>{loc.id}</code></td>
                  <td><span className={styles.label}>{loc.label}</span></td>
                  <td>
                    {loc.icon ? (
                      <img src={loc.icon} alt="" className={styles.tableIcon} onClick={() => setPreviewImage(loc.icon)} />
                    ) : (
                      <div className={styles.tableIconPlaceholder} onClick={() => handleQuickUpload(loc, 'icon')}>
                        <span>+</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {loc.banner ? (
                      <img src={loc.banner} alt="" className={styles.tableBanner} onClick={() => setPreviewImage(loc.banner)} />
                    ) : (
                      <div className={styles.tableBannerPlaceholder} onClick={() => handleQuickUpload(loc, 'banner')}>
                        <span>+</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {loc.featured ? (
                      <span className={styles.statusYes}>✅ Yes</span>
                    ) : (
                      <span className={styles.statusNo}>❌ No</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      <button className={styles.btnAction} onClick={() => handleEdit(loc)}>Edit</button>
                      <button className={`${styles.btnAction} ${styles.btnDanger}`} onClick={() => confirmDelete(loc)}>Remove</button>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
            <div className={styles.modalHeader} style={{ justifyContent: 'center', border: 'none' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#ef4444' }}>Confirm Delete?</h2>
            </div>
            <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>
              Are you sure you want to delete <strong>{locToDelete?.label}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className={styles.btnConfirmDelete} style={{ flex: 1 }} onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button className={styles.btnOutline} style={{ flex: 1 }} onClick={() => { setShowDeleteModal(false); setLocToDelete(null); }}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Upload Modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '400px', padding: '2rem' }}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem' }}>Upload {quickUploadType?.toUpperCase()}</h2>
              <button className={styles.closeBtn} onClick={() => setShowUploadModal(false)}>&times;</button>
            </div>
            
            <div className={styles.scrollableForm} style={{ padding: '1.5rem 2rem' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Select a file for <strong>{uploadLoc?.label}</strong>
              </p>
              <div className={styles.formGroup}>
                <input
                  type="file"
                  className={styles.input}
                  accept="image/*"
                  onChange={e => handleFileSelect(e, quickUploadType)}
                />
              </div>

              {(quickUploadType === 'icon' ? iconPreview : bannerPreview) && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <img
                    src={quickUploadType === 'icon' ? iconPreview : bannerPreview}
                    alt="preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                </div>
              )}
            </div>

            <div className={styles.modalFooter} style={{ gap: '1rem' }}>
              <button className={styles.btnPrimary} style={{ flex: 1 }} onClick={submitQuickUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Confirm Upload'}
              </button>
              <button className={styles.btnOutline} style={{ flex: 1 }} onClick={() => setShowUploadModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Image Preview Modal */}
      {previewImage && (
        <div className={styles.modalOverlay} onClick={() => setPreviewImage(null)} style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className={styles.previewContainer} onClick={e => e.stopPropagation()}>
            <img src={previewImage} className={styles.fullPreview} />
            <button className={styles.closeBtn} style={{ position: 'absolute', top: '20px', right: '20px' }} onClick={() => setPreviewImage(null)}>&times;</button>
          </div>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '500px', padding: '1.5rem' }}>
            <div className={styles.modalHeader} style={{ padding: '1rem 0', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem' }}>{editingLoc ? 'Edit Details' : 'New Destination'}</h2>
              <button className={styles.closeBtn} onClick={resetForm}>&times;</button>
            </div>

            <div className={styles.scrollableForm}>
              <div className={styles.splitForms} style={{ gridTemplateColumns: '1fr' }}>
                <div className={styles.formSection} style={{ padding: 0 }}>
                  <form id="locationForm" onSubmit={syncMetadata} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Destination ID</label>
                      <input
                        type="text"
                        className={styles.input}
                        required={!!editingLoc}
                        disabled={true}
                        style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)' }}
                        value={editingLoc ? formData.id : 'Auto-generated'}
                        onChange={e => setFormData({ ...formData, id: e.target.value.toLowerCase() })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Display Label</label>
                      <input
                        type="text"
                        className={styles.input}
                        required
                        value={formData.label}
                        onChange={e => setFormData({ ...formData, label: e.target.value })}
                        autoFocus
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Is Featured?</label>
                      <select
                        className={styles.input}
                        value={formData.featured}
                        onChange={e => setFormData({ ...formData, featured: e.target.value === 'true' })}
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ padding: '1.5rem 2rem' }}>
              <button type="submit" form="locationForm" className={styles.btnPrimary} style={{ width: '100%', padding: '0.8rem' }} disabled={loading}>
                {loading ? 'Processing...' : (editingLoc ? 'Save Changes' : 'Create Destination')}
              </button>
            </div>

            <div className={styles.modalFooter} style={{ display: 'none' }}>
              {/* Removed Exit Manager button as requested */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLocations;
