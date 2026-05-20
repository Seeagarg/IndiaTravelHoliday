import styles from "./SummaryTab.module.css";

const SummaryTab = ({ tour }) => {
  if (!tour || !tour.itinerary) return null;

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <h2 className={styles.heading}>Trip Summary: {tour.title}</h2>

      {/* Stats Row */}
      <div className={styles.stats}>
        <span>🎯 {tour.itinerary.length} Days</span>
        <span>🏨 Hotel Included</span>
        <span>🚗 Transfers Included</span>
        <span>⭐ {tour.rating?.toFixed(1) || "4.5"} Rating</span>
      </div>

      {/* Summary Text */}
      {tour.summary && (
        <div className={styles.summaryText}>
          <p>{tour.summary}</p>
        </div>
      )}

      {tour.itinerary.map((day, index) => (
        <div key={index} className={styles.dayCard}>
          <div className={styles.dayHeader}>
            <h3>Day {day.day || day.dayNumber} – {day.title}</h3>
          </div>

          {day.activities && day.activities.map((act, i) => (
            <div key={i} className={styles.item}>
              • {act}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SummaryTab;
