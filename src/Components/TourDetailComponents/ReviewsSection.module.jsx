import React, { useState, useRef, useEffect } from "react";
import styles from "./ReviewsSection.module.css";
import { FaStar, FaCamera, FaTimes } from "react-icons/fa";
import axios from "axios";
import { saveReview_api, getTourReviews_api, base_url } from "../../Services/Api";
import { getCookie } from "../../utills/cookieManager";
import toast from "react-hot-toast";

const defaultReviews = [
  {
    name: "Ankit Verma",
    text: "Our Delhi trip was perfectly planned from start to end. The airport pickup was smooth, the hotel was comfortable, and the sightseeing covered all major attractions. The rickshaw ride in Chandni Chowk was the highlight of our tour!",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSic_QRPFKvaKRlvaf0dLv1ZF8UGA0N5nktNg&s",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/00/e1/59/akshardham-temple.jpg?w=700&h=-1&s=1"
    ]
  },
  {
    name: "Pooja Malhotra",
    text: "This was my first visit to Delhi and I absolutely loved it. The guide was very knowledgeable and friendly. Visiting India Gate in the evening and exploring Old Delhi markets made this trip unforgettable.",
    images: [
      "https://oceanjar-new.s3.ap-south-1.amazonaws.com/Delhi_tourism_bc6720831f.jpg",
      "https://www.topindianholidays.com/blog_images/chandni-chowk-by-night.webp"
    ]
  },
  {
    name: "Rohit Singh",
    text: "Great experience overall! The hotel location was very convenient and the AC cab made sightseeing comfortable even in busy areas. Highly recommended for families and first-time travelers.",
    images: [
      "https://www.clubmahindra.com/blog/media/section_images/delhitouri-ca7b25a36acac99.jpg",
      "https://delhitourism.gov.in/dt/images/About_Img.jpg"
    ]
  }
];

const AddReviewForm = ({ tourId, onClose, onRefresh }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const nameRef = useRef();
  const emailRef = useRef();
  const commentRef = useRef();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please provide a star rating");
    
    const reviewerName = nameRef.current.value;
    const reviewEmail = emailRef.current.value;
    const reviewComment = commentRef.current.value;

    if (!reviewerName || !reviewEmail || !reviewComment) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userName", reviewerName);
      formData.append("reviewText", reviewComment);
      formData.append("rating", rating);
      formData.append("tourId", tourId);
      if (image) formData.append("images", image);

      const response = await axios.post(saveReview_api(tourId), formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Review submitted successfully!");
        onRefresh && onRefresh();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.formCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.formHeader}>
          <h3>Share Your Experience</h3>
          <button onClick={onClose} className={styles.closeBtn}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.reviewFormBody}>
          <div className={styles.formGroup}>
            <label>How would you rate your trip?</label>
            <div className={styles.starRating}>
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      className={styles.radioInput}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className={styles.star}
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="reviewerName">Your Name</label>
              <input
                id="reviewerName"
                type="text"
                required
                ref={nameRef}
                placeholder="Enter your full name"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reviewEmail">Email Address</label>
              <input
                id="reviewEmail"
                type="email"
                required
                ref={emailRef}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reviewComment">Your Review</label>
            <textarea
              id="reviewComment"
              required
              rows="4"
              ref={commentRef}
              placeholder="Share details of your experience with us..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Upload a Photo (Optional)</label>
            <div className={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="review-image"
                hidden
              />
              <label htmlFor="review-image" className={styles.uploadLabel}>
                {preview ? (
                  <img src={preview} alt="Preview" className={styles.imagePreview} />
                ) : (
                  <>
                    <FaCamera />
                    <span>Click to upload</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ReviewsSection = ({ tour }) => {
  const [showForm, setShowForm] = useState(false);
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!tour?.id) return;
      setLoadingReviews(true);
      try {
        const res = await axios.get(getTourReviews_api(tour.id));
        if (res.data && res.data.status === 200 && Array.isArray(res.data.data)) {
          const mapped = res.data.data.map(r => ({
            name: r.userName || r.name || r.reviewerName || "Happy Traveler",
            text: r.reviewText || r.text || r.comment || "",
            images: (r.images || []).map(img => img.startsWith('http') ? img : `${base_url}${img}`)
          }));
          setDynamicReviews(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [tour?.id]);

  if (!tour) return null;

  // Priority: 1. Locally fetched reviews (dynamicReviews) 
  //           2. Reviews bundled with tour object (tour.reviews)
  //           3. Static default reviews if both above are empty
  const hasDynamic = dynamicReviews && dynamicReviews.length > 0;
  const hasTourReviews = tour.reviews && tour.reviews.length > 0;

  const displayReviews = hasDynamic 
    ? dynamicReviews 
    : (hasTourReviews ? tour.reviews : defaultReviews);

  return (
    <section className={styles.wrapper}>
      {/* Title */}
      <div className={styles.headingRow}>
        <span className={styles.line} />
        <h2>TOURISTS REVIEWS</h2>
        <span className={styles.line} />
      </div>

      {/* Reviews */}
      <div className={styles.reviews}>
        {loadingReviews ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#94a3b8' }}>Loading verified reviews...</p>
        ) : (
          displayReviews.map((review, index) => (
            <div key={index} className={styles.reviewCard}>
              {/* Images */}
              <div className={styles.imageStack}>
                {review.images && review.images.length > 0 ? (
                  <>
                    <img src={review.images[0]} className={styles.imageOne} alt="" />
                    {review.images[1] ? (
                      <img src={review.images[1]} className={styles.imageTwo} alt="" />
                    ) : (
                      <img src="https://picsum.photos/seed/travel2/300/400" className={styles.imageTwo} alt="" />
                    )}
                  </>
                ) : (
                  <>
                    <img src={`https://picsum.photos/seed/${index + 1}/300/400`} className={styles.imageOne} alt="" />
                    <img src={`https://picsum.photos/seed/${index + 10}/300/400`} className={styles.imageTwo} alt="" />
                  </>
                )}
              </div>

              {/* Text */}
              <p className={styles.text}>
                “{review.text || review.reviewText || review.comment}”
              </p>

              <p className={styles.name}>{review.name || review.userName || review.reviewerName}</p>
            </div>
          ))
        )}
      </div>

      <div className={styles.addReviewRow}>
        <button className={styles.addReviewBtn} onClick={() => setShowForm(true)}>
          Write a Review
        </button>
      </div>

      {showForm && (
        <AddReviewForm 
          tourId={tour.id} 
          onClose={() => setShowForm(false)} 
          onRefresh={() => {
            // Re-fetch reviews instead of full page reload
            const fetchReviews = async () => {
              if (!tour?.id) return;
              try {
                const res = await axios.get(getTourReviews_api(tour.id));
                if (res.data && res.data.status === 200 && Array.isArray(res.data.data)) {
                  const mapped = res.data.data.map(r => ({
                    name: r.userName || r.name || r.reviewerName || "Happy Traveler",
                    text: r.reviewText || r.text || r.comment || "",
                    images: (r.images || []).map(img => img.startsWith('http') ? img : `${base_url}${img}`)
                  }));
                  setDynamicReviews(mapped);
                }
              } catch (err) {}
            };
            fetchReviews();
            toast.success("List updated!");
          }} 
        />
      )}
    </section>
  );
};

export default ReviewsSection;




















