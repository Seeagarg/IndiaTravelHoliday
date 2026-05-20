import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaCar, FaHotel, FaUtensils } from "react-icons/fa";
import classes from "./TourCard.module.css";

const TourCard = ({
  image,
  title,
  location,
  price,
  originalPrice,
  duration,
  slug,
  gallery = []
}) => {
  const navigate = useNavigate();
  const allImages = [image, ...gallery].filter(Boolean);

  const handleNavigate = (e) => {
    // Prevent navigation if clicking swiper buttons or pagination dots
    if (
      e.target.closest('.swiper-button-next') ||
      e.target.closest('.swiper-button-prev') ||
      e.target.closest('.swiper-pagination-bullet')
    ) {
      return;
    }
    navigate(`/tour/${slug}`);
  };

  return (
    <div className={classes.tourCard} onClick={handleNavigate}>
      {/* IMAGE CONTAINER (The "Floating" Part) */}
      <div className={classes.tourImg}>
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation={true}
          className={classes.cardSwiper}
        >
          {allImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`${title} ${idx}`} loading="lazy" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* CONTENT CONTAINER (The White Box) */}
      <div className={classes.tourContent}>
        {/* DURATION */}
        {duration && <p className={classes.duration}>{duration}</p>}

        <h3 className={classes.title}>{title}</h3>
        
        <div className={classes.iconRow}>
          <div className={classes.iconItem} title="Flight Included">
            <FaPlane />
          </div>
          <div className={classes.iconItem} title="Transport Included">
            <FaCar />
          </div>
          <div className={classes.iconItem} title="Premium Stay">
            <FaHotel />
          </div>
          <div className={classes.iconItem} title="Meals Included">
            <FaUtensils />
          </div>
        </div>

        <div className={classes.divider}></div>

        {/* PRICE SECTION */}
        <div className={classes.priceRow}>
          {originalPrice && price && originalPrice > price && (
            <div className={classes.saveBadge}>
              <span className={classes.checkIcon}>✔</span>
              Save {(originalPrice - price).toLocaleString()}
            </div>
          )}
          <div className={classes.priceFlex}>
            <span className={classes.finalPrice}>₹ {price?.toLocaleString()}</span>
            {originalPrice && price && originalPrice > price && (
              <span className={classes.originalPrice}>₹ {originalPrice?.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
