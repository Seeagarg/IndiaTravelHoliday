import { useState, useEffect } from "react";
import styles from "./JourneyFrames.module.css";

const images = [
  {
    src: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    place: "Meghalaya"
  },
  {
    src: "https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&w=600&q=80",
    place: "Uttarakhand"
  },
  {
    src: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=600&q=80",
    place: "Rajasthan"
  },
  {
    src: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ef9?auto=format&fit=crop&w=600&q=80",
    place: "Sikkim"
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    place: "Himachal"
  }
];

const JourneyFrames = () => {
  const [active, setActive] = useState(2);

  const next = () => {
    setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Auto-slide to make it feel more dynamic
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, []);


  return (
    <section className={styles.wrapper}>
      <h2>Journey In Frames</h2>
      <p>Pictures Perfect Moments</p>

      <div className={styles.carousel}>

        <button onClick={prev} className={styles.arrow}>
          ‹
        </button>

       {images.map((img, index) => {

  let position = "hidden";

  if (index === active) position = "center";

  else if (index === active - 1 ||
           (active === 0 && index === images.length - 1))
    position = "left";

  else if (index === active + 1 ||
           (active === images.length - 1 && index === 0))
    position = "right";

  else if (index === active - 2 ||
           (active === 1 && index === images.length - 1) ||
           (active === 0 && index === images.length - 2))
    position = "leftFar";

  else if (index === active + 2 ||
           (active === images.length - 2 && index === 0) ||
           (active === images.length - 1 && index === 1))
    position = "rightFar";

  return (
    <div
      key={index}
      className={`${styles.card} ${styles[position]}`}
    >
      <img src={img.src} alt={img.place} />
      <span>{img.place}</span>
    </div>
  );
})}

        <button onClick={next} className={styles.arrow}>
          ›
        </button>

      </div>
    </section>
  );
};

export default JourneyFrames;
