import styles from "./TravelTab.module.css";

const TravelTab = ({ tour }) => {
  if (!tour) return null;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Travel Information for {tour.place}</h2>

      {/* Arrival Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          🚆 ✈️ <span>Arrival at Destination</span>
        </div>

        <p className={styles.text}>
          Travel to {tour.place} is <strong>not included</strong> in this package unless specified.
        </p>

        <p className={styles.subText}>
          You can arrive as per your convenience. Our representative will pick you up from the airport or railway station.
        </p>
      </div>

      {/* Baggage Info */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          🧳 <span>Baggage Information</span>
        </div>

        <p className={styles.text}>
          Baggage allowance will be as per the airline or train operator’s policy.
        </p>
      </div>

      {/* Local Transport */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          🚗 <span>Local Transportation</span>
        </div>

        <p className={styles.text}>
          All local sightseeing transfers in {tour.place} are provided in a comfortable AC vehicle as per the itinerary.
        </p>
      </div>

      {/* Optional Note */}
      <div className={styles.note}>
        💡 <strong>Tip:</strong> We recommend reaching the destination before noon on the first day to make the most of your sightseeing.
      </div>
    </div>
  );
};

export default TravelTab;
