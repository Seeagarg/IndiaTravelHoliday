import styles from "./StayTab.module.css";

const StayTab = ({ tour }) => {
  if (!tour) return null;

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.icon}>🏨</span>
        <div>
          <p className={styles.subTitle}>Stay At</p>
          <h2 className={styles.title}>
            Stay At Premium Hotel in {tour.place}
            <span className={styles.stars}>★★★</span>
          </h2>
        </div>
      </div>

      {/* Check-in / Nights / Check-out */}
      <div className={styles.timeRow}>
        <div>
          <span className={styles.label}>Check In</span>
          <p className={styles.time}>2:00 PM</p>
        </div>

        <div className={styles.nights}>
          <span>{tour.duration.split(' ')[0]}</span>
        </div>

        <div>
          <span className={styles.label}>Check Out</span>
          <p className={styles.time}>11:00 AM</p>
        </div>
      </div>

      {/* Image Gallery */}
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          <img
            src={tour.images?.stay || `https://picsum.photos/600/400?hotel-${tour.place}`}
            alt={`${tour.place} Hotel`}
          />
          <span className={styles.rating}>★ {tour.rating?.toFixed(1) || "4.5"}/5</span>
        </div>

        <div className={styles.sideImages}>
          <img
            src={`https://picsum.photos/300/200?room-${tour.place}1`}
            alt="Hotel Room"
          />
          <img
            src={`https://picsum.photos/300/200?room-${tour.place}2`}
            alt="Hotel Lobby"
          />
          <img
            src={`https://picsum.photos/300/200?room-${tour.place}3`}
            alt="Hotel Restaurant"
          />
          <div className={styles.moreImages}>
            View all
          </div>
        </div>
      </div>

      {/* Room & Inclusions */}
      <div className={styles.roomCard}>
        <h4>Deluxe AC Room</h4>

        <div className={styles.inclusions}>
          <div>
            🍳 <strong>Breakfast</strong>
            <span className={styles.included}>Included</span>
          </div>
          <div>
            🍽️ <strong>Lunch</strong>
            <span className={styles.notIncluded}>See Exclusions</span>
          </div>
          <div>
            🍷 <strong>Dinner</strong>
            <span className={styles.notIncluded}>See Exclusions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayTab;
