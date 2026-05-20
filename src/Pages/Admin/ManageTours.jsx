import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import axios from 'axios';
import { saveTour_api, createTour_api, deleteTour_api, saveTourFullContent_api, uploadTourImagesBulk_api, uploadTourImage_api, saveDestination_api, base_url } from '../../Services/Api';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utills/cookieManager';
import toast from 'react-hot-toast';

const ManageTours = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [itineraryData, setItineraryData] = useState(null);
  const [activeTourId, setActiveTourId] = useState(null);
  const [itineraryEditList, setItineraryEditList] = useState([]);
  const [inclusionsEditList, setInclusionsEditList] = useState([]);
  const [exclusionsEditList, setExclusionsEditList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchingItinerary, setFetchingItinerary] = useState(false);
  
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
  const [uploadFolder, setUploadFolder] = useState('');
  const [coverIndex, setCoverIndex] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [coverUploadTourId, setCoverUploadTourId] = useState(null);
  const [coverUploadFolder, setCoverUploadFolder] = useState('');
  
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [activeDestId, setActiveDestId] = useState(null);

  const [formData, setFormData] = useState({
    tourId: '',
    destinationId: '',
    slug: '',
    title: '',
    subtitle: '',
    placeName: '',
    durationText: '',
    startingPrice: '',
    originalPrice: '',
    currency: 'INR',
    coverImage: '',
    overviewText: '',
    highlights: ''
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      const token = getCookie('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await axios.get(saveDestination_api, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.status === 200 && response.data.data) {
          setDestinations(response.data.data);
          if (response.data.data.length > 0 && !activeDestId) {
            setActiveDestId(response.data.data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };
    fetchDestinations();
  }, [navigate]);

  useEffect(() => {
    if (!activeDestId) return;

    const fetchTours = async () => {
      setFetching(true);
      try {
        const token = getCookie('adminToken');
        const response = await axios.get(`${base_url}/api/admin/content/tours/${activeDestId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = response.data || { status: 200, data: { content: [] } };
        // Use tours from the local JSON
        let toursDataArr = [];
        if (result.data && Array.isArray(result.data.content)) {
          toursDataArr = result.data.content;
        } else if (result.data && Array.isArray(result.data)) {
          toursDataArr = result.data;
        } else if (Array.isArray(result.content)) {
          toursDataArr = result.content;
        }
        setTours(toursDataArr);
      } catch (error) {
        console.error('Error fetching tours:', error);
        toast.error('Failed to load tours for this destination');
      } finally {
        setFetching(false);
      }
    };

    fetchTours();
  }, [activeDestId]);

  const handleEdit = (tour) => {
    const tId = tour.tourId || tour.id;
    setEditingTour(tour);
    setFormData({
      tourId: tId,
      destinationId: tour.destinationId || activeDestId || '',
      slug: tour.slug || '',
      title: tour.title || '',
      subtitle: tour.subtitle || '',
      placeName: tour.placeName || '',
      durationText: tour.durationText || tour.duration || '',
      startingPrice: tour.startingPrice || '',
      originalPrice: tour.originalPrice || '',
      currency: tour.currency || 'INR',
      coverImage: tour.coverImage || '',
      overviewText: tour.overviewText || '',
      highlights: Array.isArray(tour.highlights) ? tour.highlights.join(', ') : (tour.highlights || '')
    });
    setShowModal(true);
  };

  const handleSeeItinerary = async (tour) => {
    if (!tour.slug) {
      toast.error('Tour slug is missing');
      return;
    }

    setFetchingItinerary(true);
    setItineraryData(null);
    setActiveTourId(tour.tourId || tour.id);
    setShowItineraryModal(true);
    setIsEditingItinerary(false);

    try {
      const token = getCookie('adminToken');
      const response = await axios.get(`${base_url}/api/admin/content/tour-details/${tour.slug}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = response.data || { status: 404 };
      if (result.status === 200 && result.data) {
        const data = result.data;
        // Preserve the slug in the state so it's available for subsequent calls (like after save)
        setItineraryData({ ...data, slug: tour.slug });
        
        // Normalize itinerary for the editor
        const normalizedItinerary = (Array.isArray(data.itinerary) ? data.itinerary : []).map(item => ({
          dayNumber: item.dayNumber || item.day || 0,
          title: item.title || '',
          description: Array.isArray(item.activities) ? item.activities.join('\n') : (item.description || '')
        }));
        
        setItineraryEditList(normalizedItinerary);
        setInclusionsEditList(Array.isArray(data.inclusions) ? data.inclusions : []);
        setExclusionsEditList(Array.isArray(data.exclusions) ? data.exclusions : []);
      } else {
        toast.error('Could not load itinerary details');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast.error('Failed to fetch itinerary');
    } finally {
      setFetchingItinerary(false);
      setShowUploadForm(false);
      setSelectedGalleryFiles([]);
      setSelectedImagePreviews([]);
      setUploadFolder(tour.placeName || '');
    }
  };

  const handleGalleryUpload = async () => {
    if (selectedGalleryFiles.length === 0) {
      toast.error('Please select images first');
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('adminToken');
      const formData = new FormData();
      selectedGalleryFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', uploadFolder || 'general');
      formData.append('coverIndex', coverIndex.toString());

      if (!activeTourId) {
        toast.error('Tour ID is missing. Please close and reopen the gallery.');
        setLoading(false);
        return;
      }

      console.log('Uploading images to:', uploadTourImagesBulk_api(activeTourId));
      
      const response = await axios.post(uploadTourImagesBulk_api(activeTourId), formData, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.data.status === 200) {
        toast.success(response.data.message || 'Gallery updated successfully!');
        
        // Update local tour cover image if it was changed
        if (response.data.data?.coverImage) {
          setTours(prevTours => prevTours.map(t => 
            (t.tourId || t.id) === activeTourId 
              ? { ...t, coverImage: response.data.data.coverImage } 
              : t
          ));
        }
      }

      setShowUploadForm(false);
      setSelectedGalleryFiles([]);
      setSelectedImagePreviews([]);
      // Refresh
      handleSeeItinerary({ slug: itineraryData.slug, tourId: activeTourId });
    } catch (error) {
      console.error('Error uploading gallery:', error);
      toast.error('Failed to upload gallery: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedGalleryFiles(files);
    
    // Generate previews
    const previews = files.map(file => URL.createObjectURL(file));
    setSelectedImagePreviews(previews);
  };

  const handleOpenCoverModal = (tour) => {
    setCoverUploadTourId(tour.tourId || tour.id);
    setCoverUploadFolder(tour.placeName || '');
    setShowCoverModal(true);
  };

  const handleCoverUpload = async () => {
    if (!selectedCoverFile || !coverUploadTourId) return toast.error('Please select an image');

    setLoading(true);
    try {
      const data = new FormData();
      data.append('file', selectedCoverFile);
      data.append('folder', coverUploadFolder || 'tours');
      data.append('isCover', 'true');

      await axios.post(uploadTourImage_api(coverUploadTourId), data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getCookie('adminToken')}` 
        }
      });

      toast.success('Cover image updated successfully!');
      setShowCoverModal(false);
      setSelectedCoverFile(null);
      // Re-fetch tours for current destination to update UI
      setActiveDestId(null); 
      setTimeout(() => setActiveDestId(activeDestId), 10);
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await axios.delete(deleteTour_api(id), {
          headers: { Authorization: `Bearer ${getCookie('adminToken')}` }
        });
        toast.success('Tour deleted successfully!');
        setTours(tours.filter(t => (t.tourId || t.id) !== id));
      } catch (error) {
        console.error('Error deleting tour:', error);
        toast.error('Failed to delete tour');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tourId: '',
      destinationId: '',
      slug: '',
      title: '',
      subtitle: '',
      placeName: '',
      durationText: '',
      startingPrice: '',
      originalPrice: '',
      currency: 'INR',
      coverImage: '',
      overviewText: '',
      highlights: ''
    });
    setEditingTour(null);
    setItineraryData(null);
    setActiveTourId(null);
    setItineraryEditList([]);
    setInclusionsEditList([]);
    setExclusionsEditList([]);
    setIsEditingItinerary(false);
    setShowModal(false);
    setShowItineraryModal(false);
    setShowGalleryModal(false);
    setSelectedGalleryFiles([]);
    setSelectedImagePreviews([]);
  };

  const handleSaveItinerary = async () => {
    if (!activeTourId) return;

    setLoading(true);
    try {
      const savePayload = {
        summary: itineraryData.summary || "",
        itinerary: itineraryEditList.map(item => ({
          dayNumber: Number(item.dayNumber),
          title: item.title,
          activities: typeof item.description === 'string' 
            ? item.description.split('\n').map(a => a.trim()).filter(a => a !== '') 
            : []
        })),
        inclusions: inclusionsEditList,
        exclusions: exclusionsEditList
      };

      await axios.put(saveTourFullContent_api(activeTourId), savePayload, {
        headers: { Authorization: `Bearer ${getCookie('adminToken')}` }
      });

      toast.success('Tour itinerary and content updated successfully!');
      setIsEditingItinerary(false);
      handleSeeItinerary({ slug: itineraryData.slug, tourId: activeTourId });
    } catch (error) {
      console.error('Error saving itinerary details:', error);
      toast.error('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const addItineraryDay = () => {
    const nextDay = itineraryEditList.length + 1;
    setItineraryEditList([...itineraryEditList, { dayNumber: nextDay, title: '', description: '' }]);
  };

  const removeItineraryDay = (index) => {
    const newList = itineraryEditList.filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, dayNumber: i + 1 }));
    setItineraryEditList(newList);
  };

  const updateItineraryItem = (index, field, value) => {
    const newList = [...itineraryEditList];
    newList[index] = { ...newList[index], [field]: value };
    setItineraryEditList(newList);
  };

  const addItemToList = (setter, list) => setter([...list, '']);
  const removeItemFromList = (setter, list, index) => setter(list.filter((_, i) => i !== index));
  const updateListItem = (setter, list, index, value) => {
    const newList = [...list];
    newList[index] = value;
    setter(newList);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingTour && !formData.tourId) {
      toast.error('Tour ID is missing for the tour being edited');
      return;
    }

    setLoading(true);
    try {
      const token = getCookie('adminToken');
      if (!token) {
        toast.error('Session expired. Please login again.');
        navigate('/admin/login');
        return;
      }

      const payload = {
        destinationId: Number(formData.destinationId),
        slug: formData.slug,
        title: formData.title,
        subtitle: formData.subtitle,
        placeName: formData.placeName,
        durationText: formData.durationText,
        startingPrice: Number(formData.startingPrice),
        originalPrice: Number(formData.originalPrice),
        currency: formData.currency,
        coverImage: formData.coverImage,
        overviewText: formData.overviewText,
        highlights: typeof formData.highlights === 'string' 
          ? formData.highlights.split(',').map(h => h.trim()).filter(h => h !== '') 
          : []
      };

      let newTourObj = {
        ...payload,
        rating: editingTour ? editingTour.rating : 0
      };

      if (editingTour && formData.tourId) {
        await axios.put(saveTour_api(formData.tourId), payload, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        toast.success('Tour updated successfully via API!');
        newTourObj.id = formData.tourId;
        newTourObj.tourId = formData.tourId;
        setTours(tours.map(t => (t.tourId || t.id) == formData.tourId ? newTourObj : t));
      } else {
        const res = await axios.post(createTour_api, payload, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        toast.success('New tour created successfully via API!');
        const serverTourId = res.data?.data?.tourId;
        newTourObj.id = serverTourId || formData.tourId;
        newTourObj.tourId = serverTourId || formData.tourId;
        setTours([...tours, newTourObj]);
      }
      
      resetForm();
    } catch (err) {
      toast.error('Failed to save tour: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Manage Tours</h1>
          <p>Add, edit or remove tour packages according to API structure.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { 
          resetForm(); 
          setFormData(prev => ({ ...prev, destinationId: activeDestId || '' }));
          setShowModal(true); 
        }}>+ Add New Tour</button>
      </div>

      <div className={styles.tabsContainer}>
        {destinations.map(dest => (
          <button
            key={dest.id}
            className={`${styles.tab} ${activeDestId === dest.id ? styles.activeTab : ''}`}
            onClick={() => setActiveDestId(dest.id)}
          >
            {dest.label || dest.name}
          </button>
        ))}
      </div>

      <div className={styles.cardGrid}>
        {fetching ? (
          <div style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>⌛</div>
            Loading tour packages...
          </div>
        ) : tours.length === 0 ? (
          <div style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            No tours found for this destination.
          </div>
        ) : (
          tours.map(tour => {
            const tId = tour.tourId || tour.id;
            return (
              <div className={styles.tourCard} key={tId}>
                <div className={styles.cardId}>#{tId}</div>
                <div className={styles.cardHeader} onClick={() => !tour.coverImage && handleOpenCoverModal(tour)} style={{ cursor: !tour.coverImage ? 'pointer' : 'default' }}>
                  {tour.coverImage ? (
                    <img 
                      src={tour.coverImage} 
                      alt={tour.title} 
                      className={styles.cardImage}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'; }}
                    />
                  ) : (
                    <div className={styles.cardImage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', gap: '0.5rem' }}>
                      <span style={{ fontSize: '2rem', opacity: 0.3 }}>🖼️</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No Cover Image</span>
                      <button className={styles.btnAction} style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Add Cover</button>
                    </div>
                  )}
                  <div className={styles.cardBadge}>
                    <div className={styles.ratingBadge}>
                      <span>★</span>
                      <span>{tour.rating || '0.0'}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{tour.title}</div>
                  
                  <div className={styles.cardInfo}>
                    <div className={styles.cardInfoItem}>
                      <span className={styles.placeTag}>{tour.placeName || 'N/A'}</span>
                    </div>
                    <div className={styles.cardInfoItem}>
                      <span className={styles.durationText}>🕒 {tour.duration || 'Flexible'}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <div className={styles.currentPrice}>{tour.currency || 'INR'} {tour.startingPrice}</div>
                    {tour.originalPrice && (
                      <div className={styles.oldPrice}>{tour.currency || 'INR'} {tour.originalPrice}</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                    <button className={styles.itineraryBtn} style={{ flex: 1 }} onClick={() => handleSeeItinerary(tour)}>
                      Itinerary
                    </button>
                    <button className={styles.itineraryBtn} style={{ flex: 1, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.2)' }} onClick={() => { handleSeeItinerary(tour); setShowItineraryModal(false); setShowGalleryModal(true); }}>
                      Gallery
                    </button>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.tableActions} style={{ width: '100%', justifyContent: 'space-between' }}>
                    <button className={styles.btnAction} style={{ flex: 1 }} onClick={() => handleEdit(tour)}>Edit Details</button>
                    <button className={`${styles.btnAction} ${styles.btnDanger}`} onClick={() => handleDelete(tId)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column' }}>
            <div className={styles.modalHeader}>
              <h2>{editingTour ? 'Edit Tour' : 'Add New Tour'}</h2>
              <button className={styles.closeBtn} onClick={resetForm}>&times;</button>
            </div>
            
            <div className={styles.scrollableForm}>
              <form id="addTourForm" onSubmit={handleSave} className={styles.formGrid}>
                
                <div className={styles.formGroup}>
                  <label>Destination</label>
                  <select 
                    className={styles.input} 
                    required
                    value={formData.destinationId} 
                    onChange={e => setFormData({...formData, destinationId: e.target.value})}
                  >
                    <option value="">Select Destination</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name || d.label} (ID: {d.id})</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Slug</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    required
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    placeholder="e.g. goa-trip-updated" 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    required
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Goa Trip Updated" 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Subtitle</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="e.g. Even better experience" 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Place Name</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={formData.placeName} 
                    onChange={e => setFormData({...formData, placeName: e.target.value})}
                    placeholder="e.g. Goa" 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Duration Text</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={formData.durationText} 
                    onChange={e => setFormData({...formData, durationText: e.target.value})}
                    placeholder="e.g. 4 Days 3 Nights" 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Starting Price</label>
                  <input 
                    type="number" 
                    className={styles.input} 
                    required
                    value={formData.startingPrice} 
                    onChange={e => setFormData({...formData, startingPrice: e.target.value})}
                    placeholder="e.g. 6000" 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Original Price</label>
                  <input 
                    type="number" 
                    className={styles.input} 
                    required
                    value={formData.originalPrice} 
                    onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                    placeholder="e.g. 8000" 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Currency</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={formData.currency} 
                    onChange={e => setFormData({...formData, currency: e.target.value})}
                    placeholder="e.g. INR" 
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Cover Image URL</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={formData.coverImage} 
                    onChange={e => setFormData({...formData, coverImage: e.target.value})}
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Overview Text</label>
                  <textarea 
                    className={styles.textarea} 
                    value={formData.overviewText} 
                    onChange={e => setFormData({...formData, overviewText: e.target.value})}
                    placeholder="Updated description..."
                    style={{ minHeight: '100px' }}
                  ></textarea>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Highlights (Comma separated)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={formData.highlights} 
                    onChange={e => setFormData({...formData, highlights: e.target.value})}
                    placeholder="e.g. Beach, Party, Cruise" 
                  />
                </div>
              </form>
            </div>

            <div className={styles.modalFooter} style={{ gap: '1rem' }}>
              <button type="submit" form="addTourForm" className={styles.btnPrimary} style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Saving...' : (editingTour ? 'Update Tour' : 'Save New Tour')}
              </button>
              <button type="button" className={styles.btnOutline} style={{ flex: 1 }} onClick={resetForm} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showItineraryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '700px' }}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{isEditingItinerary ? 'Edit Itinerary' : 'Full Itinerary'}</h2>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{itineraryData?.title || 'Loading details...'}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {!isEditingItinerary && itineraryData && (
                  <button 
                    className={styles.btnAction} 
                    onClick={() => setIsEditingItinerary(true)}
                    style={{ background: 'rgba(255, 138, 0, 0.1)', color: '#ff8a00' }}
                  >
                    {itineraryEditList.length > 0 ? 'Edit' : 'Add Itinerary'}
                  </button>
                )}
                <button className={styles.closeBtn} onClick={resetForm}>&times;</button>
              </div>
            </div>
            
            <div className={styles.scrollableForm} style={{ padding: '2rem' }}>
              {fetchingItinerary ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⌛</div>
                  Fetching full itinerary...
                </div>
              ) : isEditingItinerary ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#ff8a00', display: 'block', marginBottom: '0.75rem' }}>
                      Tour Summary
                    </label>
                    <textarea 
                      className={styles.textarea} 
                      value={itineraryData.summary || ''} 
                      placeholder="Enter a brief summary of the tour experience..."
                      style={{ minHeight: '100px' }}
                      onChange={e => setItineraryData({ ...itineraryData, summary: e.target.value })} 
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🗓️ Itinerary Days
                    </h3>
                    {itineraryEditList.map((item, index) => (
                      <div key={index} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative' }}>
                        <button 
                          onClick={() => removeItineraryDay(index)}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                        >&times;</button>
                        
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ width: '60px' }}>
                            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>Day</label>
                            <input 
                              type="number" 
                              className={styles.input} 
                              value={item.dayNumber || item.day} 
                              onChange={e => updateItineraryItem(index, 'dayNumber', parseInt(e.target.value))} 
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>Day Title</label>
                            <input 
                              type="text" 
                              className={styles.input} 
                              value={item.title} 
                              placeholder="e.g. Arrival and Checkout"
                              onChange={e => updateItineraryItem(index, 'title', e.target.value)} 
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>Activities (One per line)</label>
                          <textarea 
                            className={styles.textarea} 
                            value={item.description} 
                            placeholder="List the activities for this day (Enter for new activity)..."
                            style={{ minHeight: '80px', fontSize: '0.85rem' }}
                            onChange={e => updateItineraryItem(index, 'description', e.target.value)} 
                          ></textarea>
                        </div>
                      </div>
                    ))}
                    <button className={styles.btnOutline} style={{ borderStyle: 'dashed' }} onClick={addItineraryDay}>+ Add Another Day</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#22c55e', marginBottom: '1.25rem' }}>✅ Inclusions</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {inclusionsEditList.map((item, index) => (
                          <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                              type="text" 
                              className={styles.input} 
                              value={item} 
                              placeholder="e.g. 3 Star Hotel Stay"
                              onChange={e => updateListItem(setInclusionsEditList, inclusionsEditList, index, e.target.value)} 
                            />
                            <button className={styles.btnDanger} style={{ padding: '0 0.5rem' }} onClick={() => removeItemFromList(setInclusionsEditList, inclusionsEditList, index)}>&times;</button>
                          </div>
                        ))}
                        <button className={styles.btnOutline} style={{ fontSize: '0.75rem', padding: '0.5rem' }} onClick={() => addItemToList(setInclusionsEditList, inclusionsEditList)}>+ Add Inclusion</button>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444', marginBottom: '1.25rem' }}>❌ Exclusions</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {exclusionsEditList.map((item, index) => (
                          <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                              type="text" 
                              className={styles.input} 
                              value={item} 
                              placeholder="e.g. Any Personal Expenses"
                              onChange={e => updateListItem(setExclusionsEditList, exclusionsEditList, index, e.target.value)} 
                            />
                            <button className={styles.btnDanger} style={{ padding: '0 0.5rem' }} onClick={() => removeItemFromList(setExclusionsEditList, exclusionsEditList, index)}>&times;</button>
                          </div>
                        ))}
                        <button className={styles.btnOutline} style={{ fontSize: '0.75rem', padding: '0.5rem' }} onClick={() => addItemToList(setExclusionsEditList, exclusionsEditList)}>+ Add Exclusion</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : itineraryData ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {itineraryData.summary && (
                      <div style={{ background: 'rgba(255, 138, 0, 0.05)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid #ff8a00' }}>
                        <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ff8a00', textTransform: 'uppercase' }}>Summary</div>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#cbd5e1' }}>{itineraryData.summary}</p>
                      </div>
                    )}

                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🗓️</span> Day-wise Itinerary
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {Array.isArray(itineraryData.itinerary) && itineraryData.itinerary.length > 0 ? (
                          itineraryData.itinerary.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '1.25rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #ff8a00, #ff4d00)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff', boxShadow: '0 4px 12px rgba(255, 77, 0, 0.3)' }}>
                                  {item.day || index + 1}
                                </div>
                                {index !== itineraryData.itinerary.length - 1 && (
                                  <div style={{ width: '2px', flex: 1, background: 'rgba(255, 255, 255, 0.1)', margin: '0.5rem 0' }}></div>
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem' }}>{item.title || `Day ${item.day || index + 1}`}</div>
                                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>{item.description || 'No description available.'}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No itinerary data found.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22c55e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          ✅ Inclusions
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {Array.isArray(itineraryData.inclusions) && itineraryData.inclusions.length > 0 ? (
                            itineraryData.inclusions.map((item, i) => (
                              <div key={i} style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', gap: '0.75rem' }}>
                                <span style={{ color: '#22c55e' }}>•</span> {item}
                              </div>
                            ))
                          ) : (
                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>None listed.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          ❌ Exclusions
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {Array.isArray(itineraryData.exclusions) && itineraryData.exclusions.length > 0 ? (
                            itineraryData.exclusions.map((item, i) => (
                              <div key={i} style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', gap: '0.75rem' }}>
                                <span style={{ color: '#ef4444' }}>•</span> {item}
                              </div>
                            ))
                          ) : (
                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>None listed.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#ef4444', padding: '2rem' }}>
                  Failed to load tour data. Please try again.
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              {isEditingItinerary ? (
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleSaveItinerary} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className={styles.btnOutline} style={{ flex: 1 }} onClick={() => setIsEditingItinerary(false)}>Cancel</button>
                </div>
              ) : (
                <button className={styles.btnOutline} onClick={resetForm}>Close</button>
              )}
            </div>
          </div>
        </div>
      )}
      {showGalleryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '900px' }}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Tour Gallery</h2>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{itineraryData?.title || 'Loading photos...'}</p>
              </div>
              <button className={styles.closeBtn} onClick={resetForm}>&times;</button>
            </div>
            
            <div className={styles.scrollableForm}>
              {fetchingItinerary ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🖼️</div>
                  Loading tour gallery...
                </div>
              ) : !showUploadForm ? (
                <>
                  {itineraryData && Array.isArray(itineraryData.images) && itineraryData.images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                      {itineraryData.images.map((img, i) => (
                        <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', height: '180px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <img 
                            src={img} 
                            alt={`Gallery ${i}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => window.open(img, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '20px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                      <p>No images found in this tour's gallery.</p>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label style={{ fontSize: '0.7rem' }}>Storage Folder Name</label>
                        <input 
                          type="text" 
                          className={styles.input} 
                          value={uploadFolder} 
                          onChange={e => setUploadFolder(e.target.value)}
                          placeholder="e.g. goa-trip"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label style={{ fontSize: '0.7rem' }}>Cover Image Index (0 to n-1)</label>
                        <input 
                          type="number" 
                          className={styles.input} 
                          value={coverIndex} 
                          onChange={e => setCoverIndex(parseInt(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label style={{ fontSize: '0.7rem' }}>Select Images (Bulk)</label>
                      <input 
                        type="file" 
                        multiple 
                        className={styles.input} 
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      
                      {selectedImagePreviews.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '12px' }}>
                          {selectedImagePreviews.map((url, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <img 
                                src={url} 
                                alt="preview" 
                                style={{ 
                                  width: '80px', 
                                  height: '80px', 
                                  objectFit: 'cover', 
                                  borderRadius: '8px',
                                  border: coverIndex === i ? '2px solid #ff8a00' : '2px solid transparent',
                                  cursor: 'pointer'
                                }} 
                                onClick={() => setCoverIndex(i)}
                              />
                              {coverIndex === i && (
                                <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff8a00', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>⭐</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                        Selected: <strong>{selectedGalleryFiles.length}</strong> images. {selectedGalleryFiles.length > 0 && 'Click an image to set as main cover.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter} style={{ gap: '1rem' }}>
              {!showUploadForm ? (
                <>
                  <button className={styles.btnPrimary} style={{ flex: 1 }} onClick={() => setShowUploadForm(true)}>+ Add More Photos</button>
                  <button className={styles.btnOutline} style={{ flex: 1 }} onClick={resetForm}>Close Gallery</button>
                </>
              ) : (
                <>
                  <button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleGalleryUpload} disabled={loading}>
                    {loading ? 'Uploading...' : 'Confirm Bulk Upload'}
                  </button>
                  <button className={styles.btnOutline} style={{ flex: 1 }} onClick={() => setShowUploadForm(false)}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {showCoverModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '400px', padding: '2rem' }}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem' }}>Upload Cover Image</h2>
              <button className={styles.closeBtn} onClick={() => setShowCoverModal(false)}>&times;</button>
            </div>
            <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
              <label>Folder Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={coverUploadFolder} 
                onChange={e => setCoverUploadFolder(e.target.value)}
                placeholder="e.g. goa"
              />
            </div>
            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
              <label>Select Image</label>
              <input 
                type="file" 
                className={styles.input} 
                accept="image/*"
                onChange={e => setSelectedCoverFile(e.target.files[0])}
              />
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button className={styles.btnPrimary} style={{ flex: 1 }} onClick={handleCoverUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Confirm Upload'}
              </button>
              <button className={styles.btnOutline} style={{ flex: 1 }} onClick={() => setShowCoverModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTours;
