import styles from "./WhyTravelo.module.css";

const features = [
  {
    title: "No Third Party Mess",
    desc:
      "100 percent in-house operations for all trips! No third parties involved, hence no fishy claims!",
    icon: "👥",
  },
  {
    title: "Transparency & Security",
    desc:
      "Real time monitoring of all trips by ground team! All routes and weather conditions are accurately updated!",
    icon: "🔍",
  },
  {
    title: "Co-Travelers Filtering",
    desc:
      "Multi-step filtering to bring only like-minded people together! That’s our key to have fuss-free trips!",
    icon: "🧩",
  },
  {
    title: "One Stop Hassle Free Experience",
    desc:
      "Comfortable stays, trained drivers, hospitable staff and friendly trip leaders put together that one memorable trip for you!",
    icon: "✅",
  },
];

const WhyTravelo = () => {
  return (
    <section className={styles.wrapper}>
      {/* Heading */}
      <div className={styles.heading}>
        <p>EXPERIENCE EXCELLENCE</p>
        <h2>Why Choose India Travel Holiday?</h2>
        <span className={styles.underline}></span>
      </div>

      {/* Cards */}
      <div className={styles.cards}>
        {features.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.circleDecor}></div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>

            <div className={styles.iconWrap}>
              <span className={styles.icon}>{item.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyTravelo;
