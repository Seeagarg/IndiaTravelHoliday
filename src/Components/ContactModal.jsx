import React, { useState, useEffect } from 'react';
import styles from './ContactModal.module.css';
import { FaTimes, FaUser, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';

const ContactModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check if user has already seen the modal in this session
        const hasSeenModal = sessionStorage.getItem('hasSeenContactModal');

        if (!hasSeenModal) {
            const timer = setTimeout(() => {
                setShowModal(true);
                // Give a tiny delay for the animation
                setTimeout(() => setIsVisible(true), 10);
                sessionStorage.setItem('hasSeenContactModal', 'true');
            }, 30000); // 30 seconds

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for animation to finish before removing from DOM
        setTimeout(() => setShowModal(false), 300);
    };

    if (!showModal) return null;

    return (
        <div className={`${styles.overlay} ${isVisible ? styles.show : ''}`}>
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={handleClose}>
                    <FaTimes />
                </button>

                <div className={styles.leftSide}>
                    <div className={styles.imageOverlay}></div>
                    <div className={styles.textContainer}>
                        <h2>Plan Your Journey With Experts</h2>
                        <p>Our travel specialists are here to create the perfect itinerary tailored just for you!</p>
                        <div className={styles.statBox}>
                            <span>500+</span>
                            <p>Happy Travelers</p>
                        </div>
                    </div>
                </div>

                <div className={styles.rightSide}>
                    <div className={styles.formHeader}>
                        <h3>Get a Free Consultation</h3>
                        <p>Fill out the form below and we'll get back to you shortly.</p>
                    </div>

                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.inputGroup}>
                            <FaUser className={styles.fieldIcon} />
                            <input type="text" placeholder="Full Name" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <FaEnvelope className={styles.fieldIcon} />
                            <input type="email" placeholder="Email Address" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <FaPhone className={styles.fieldIcon} />
                            <input type="tel" placeholder="Phone Number" required />
                        </div>
                        <div className={styles.inputGroup}>
                            <FaGlobe className={styles.fieldIcon} />
                            <select defaultValue="">
                                <option value="" disabled>Destination Interest</option>
                                <option value="himachal">Himachal Pradesh</option>
                                <option value="rajasthan">Rajasthan</option>
                                <option value="goa">Goa</option>
                                <option value="kerala">Kerala</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            REQUEST CALL BACK
                        </button>
                    </form>
                    <p className={styles.footerNote}>Safe & Secure. No Spam.</p>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
