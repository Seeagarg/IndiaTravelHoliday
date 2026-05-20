import styles from "./TourNavbar.module.css";
import useTypingPlaceholder from "../../utills/useTypingPlaceholder";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const placeholders = [
  "Search destinations, tours, activities...",
  "Looking for Rajasthan?",
  "Try searching 'Kerala Backwaters'",
  "Activities in Rishikesh...",
  "Best hotels in Mumbai?"
];

const TourNavbar = () => {
  const animatedPlaceholder = useTypingPlaceholder(placeholders);

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>✈️</span>
        <span className={styles.logoText}>India Travel Holiday</span>
      </Link>

      {/* Center: Search */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder={animatedPlaceholder}
        />
        <FiSearch className={styles.searchIcon} />
      </div>

      {/* Right: Actions */}
      <div className={styles.actions}>
        <button className={styles.offerBadge}>
          🇮🇳 INR
        </button>
      </div>
    </header>
  );
};

export default TourNavbar;
