import React, { useState, useEffect } from "react";
import styles from "./OfferBanner.module.css";

const destinations = [
  {
    name: "Ladakh",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhYZiJr4gCbjSGiblbyiyR1JX0PygTDEp0ig&s"
  },
  {
    name: "Spiti",
    image:
      "https://storage.googleapis.com/stateless-www-justwravel-com/2021/05/1550217293_shutterstock_1129297934.jpg.jpg"
  },
  {
    name: "Meghalaya",
    image:
      "https://media3.thrillophilia.com/filestore/nwamxdepttr4a1wa4fm2hesk5jml_Untitled%20design%20(1).jpg?w=753&h=450&dpr=2.0"
  },
  {
    name: "Bhutan",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSidc7P8uPyoYkgAj2fuCtU7WX-uDcYKQufuA&s"
  }
];

const OfferBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto flip cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === destinations.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container} >
    <section className={styles.banner}>
      <div className={styles.content}>

  <p className={styles.smallHeading}>
    Deals are <span>marching your way!</span>
  </p>

  <p className={styles.brand}>INDIA TRAVEL HOLIDAY'S</p>

  <h1 className={styles.mainTitle}>
    Early Bird
  </h1>

  <div className={styles.saleTag}>
    SALE
  </div>

  <div className={styles.discount}>
    Discounts upto ₹7500/- off
  </div>

</div>


      <div className={styles.cardContainer}>
        {destinations.map((dest, index) => {
          let position = "next";

          if (index === activeIndex) position = "active";
          if (
            index ===
            (activeIndex - 1 + destinations.length) %
              destinations.length
          )
            position = "prev";

          return (
            <div
              key={index}
              className={`${styles.card} ${styles[position]}`}
            >
              <img src={dest.image} alt={dest.name} />
              <span>{dest.name}</span>
            </div>
          );
        })}
      </div>
    </section>
    </div>
  );
};

export default OfferBanner;
