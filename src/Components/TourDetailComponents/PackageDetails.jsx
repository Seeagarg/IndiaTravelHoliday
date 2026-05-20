import styles from "./PackageDetails.module.css";

const PackageDetails = ({ tour }) => {
  if (!tour) return null;

  return (
    <section className={styles.wrapper}>
      {/* End of Trip Heading */}
      <div className={styles.endTrip}>
        <span className={styles.line}></span>
        <h2>End Of Trip</h2>
        <span className={styles.line}></span>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <h3 className={styles.title}>What’s inside the package?</h3>

        <div className={styles.columns}>
          {/* Inclusions */}
          <div className={styles.column}>
            <h4 className={styles.inclusionTitle}>Inclusions</h4>
            <ul className={styles.list}>
              {tour.inclusions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* Exclusions */}
          <div className={styles.column}>
            <h4 className={styles.exclusionTitle}>Exclusions</h4>
            <ul className={`${styles.list} ${styles.exclusionList}`}>
              {tour.exclusions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageDetails;
