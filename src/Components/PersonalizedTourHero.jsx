import styles from "./PersonalizedTourHero.module.css";

const PersonalisedTourHero = () => {
  return (
    <section className={styles.hero}>
      {/* Left visuals */}
      <div className={styles.left}>
        <span className={styles.label}>Mountain Pass</span>
        <img src="/images/taj.jpg" className={styles.imgLg} />
        <img src="/images/jaipur.jpg" className={styles.imgSm} />
        <span className={styles.label}>Indian Culture</span>
        <img src="/images/houseboat.jpg" className={styles.imgMd} />
      </div>

      {/* Center text */}
      <div className={styles.center}>
        <h1>
          Your Tour,<br />
          <span>Perfectly Personalised!</span>
        </h1>
        <p>Explore Expert-led, AI-powered multi-day tours.</p>
      </div>

      {/* Right visuals */}
      <div className={styles.right}>
        <span className={styles.label}>Goa Beach</span>
        <img src="/images/van.jpg" className={styles.imgMd} />
        <img src="/images/bus.jpg" className={styles.imgLg} />
      </div>
    </section>
  );
};

export default PersonalisedTourHero;
