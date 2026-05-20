import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import IndiaTabs from '../Components/IndiaTabs';
import Places from '../Components/Places';
import styles from './Trips.module.css';

const Trips = () => {
  const [selectedTab, setSelectedTab] = useState('explore');

  return (
    <div className={styles.tripsPage}>
      <Navbar />
      
      <div className={styles.heroSection}>
        <div className={styles.overlay}>
          <div className="reveal reveal-up">
            <h1>All Trips & Destinations</h1>
            <p>Your one-stop destination for the most memorable journeys across the Indian subcontinent.</p>
          </div>
        </div>
      </div>

      <section className="section-white">
        <div className="container-wide reveal reveal-up">
          <div className={styles.sectionHeader}>
            <span>Destinations</span>
            <h2>Where do you want to go next?</h2>
          </div>
          <IndiaTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
      </section>

      <section className="section-gray">
        <div className="container-wide reveal reveal-up">
          <div className={styles.toursSection}>
            <Places selectedTab={selectedTab} limit={50} />
          </div>
        </div>
      </section>

      <section className="section-white">
        <div className="container-wide reveal reveal-scale">
          <div className={styles.categories}>
            <div className={styles.sectionHeader}>
              <span>Collections</span>
              <h2>Browse by Tour Category</h2>
            </div>
            <div className={styles.categoryGrid}>
              {['Honeymoon', 'Group', 'Adventure', 'Family', 'Corporate', 'Luxurious'].map((cat) => (
                <div key={cat} className={styles.catCard}>
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-wide reveal reveal-up delay-100">
          <div className={styles.trustBanner}>
            <div className={styles.trustItem}>
              <h3>Verified Stays</h3>
              <p>We handpick only the best hotels</p>
            </div>
            <div className={styles.trustItem}>
              <h3>Expert Guides</h3>
              <p>Local knowledge you can trust</p>
            </div>
            <div className={styles.trustItem}>
              <h3>Full Support</h3>
              <p>24/7 assistance on your path</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Trips;
