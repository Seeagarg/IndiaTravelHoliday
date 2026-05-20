import React from "react";
import classes from "./PlaceGrid.module.css";
import TourCard from "./TourCard";

const PlaceGrid = ({ places }) => {
  return (
    <div className={classes.placeGrid}>
      {places.map((trip) => (
        <TourCard
          key={trip.slug}
          slug={trip.slug}
          image={trip.images.cover}
          title={trip.title}
          location={trip.place}
          description={trip.subtitle}
          rating={trip.rating.toFixed(1)}
          price={trip.starting_price}
          originalPrice={trip.original_price}
          duration={trip.duration}
          gallery={trip.images.gallery}
        />
      ))}
    </div>
  );
};

export default PlaceGrid;
