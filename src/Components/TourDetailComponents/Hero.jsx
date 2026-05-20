import { FiUser, FiMail, FiPhone, FiCalendar, FiUsers, FiArrowRight } from "react-icons/fi";
import styles from "./Hero.module.css";

const Hero = ({ tour }) => {
  if (!tour) return null;

  return (
    <section className={styles.hero}>
      {/* LEFT — TOUR DETAILS (stays mostly same) */}
      <div className={styles.left}>
        <h1 className={styles.title}>{tour.title}</h1>
        <p className={styles.subtitle}>{tour.subtitle}</p>

        <div className={styles.meta}>
          <span>🕒 {tour.duration}</span>
          <span>📍 {tour.place}</span>
          <span className={styles.rating}>⭐ {tour.rating.toFixed(1)} ({tour.total_reviews} Reviews)</span>
        </div>

        <div className={styles.highlights}>
          {tour.highlights.slice(0, 4).map((highlight, index) => (
            <span key={index}>✔ {highlight.substring(0, 50)}...</span>
          ))}
        </div>

        <div className={styles.details}>
          <p>
            {tour.summary || tour.subtitle || `This ${tour.place} tour is perfect for first-time visitors who want to experience the rich culture and beauty.`}
          </p>
          <ul className={styles.list}>
            {tour.inclusions.slice(0, 4).map((item, index) => (
              <li key={index}>🏨 {item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.priceBox}>
          <div className={styles.priceInfo}>
            <p className={styles.oldPrice}>₹{Math.round(tour.starting_price * 1.5)}</p>
            <p className={styles.newPrice}>₹{tour.starting_price}</p>
          </div>
          <span className={styles.per}>per adult</span>
        </div>
      </div>

      {/* RIGHT — ENHANCED FORM */}
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h3>Don't Just Dream, Travel!</h3>
          <p>Plan Your {tour.place} Trip Today</p>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <FiUser className={styles.inputIcon} />
            <input type="text" placeholder="Full Name" />
          </div>

          <div className={styles.inputGroup}>
            <FiMail className={styles.inputIcon} />
            <input type="email" placeholder="Email Address" />
          </div>

          <div className={styles.inputGroup}>
            <FiPhone className={styles.inputIcon} />
            <input type="tel" placeholder="Phone Number" />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <FiCalendar className={styles.inputIcon} />
              <input type="date" />
            </div>
            <div className={styles.inputGroup}>
              <FiUsers className={styles.inputIcon} />
              <input type="number" placeholder="Travellers" min="1" />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <span>Request Callback</span>
            <FiArrowRight />
          </button>
        </form>

        <div className={styles.formFooter}>
          <p className={styles.note}>
            <span className={styles.dot}>•</span> No payment required now
            <span className={styles.dot}>•</span> Free consultation
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
