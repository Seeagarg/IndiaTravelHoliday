import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import classes from './LogoSlider.module.css'

const logos = [
  // The Global Standard for Aviation
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZXtVg2bl3C3gFEFRaUTCDLjYNHug-BfZqQ&s",
  
  // UK Travel Association (Very high trust)
  "https://pimwp.s3-accelerate.amazonaws.com/2021/07/times-now.jpg",
  
  // Global Review Authority
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVOV1KPGcbB6lAZOur0GutmnYw9cbuKp8pog&s",
  
  // Trustpilot (Essential for "Recognised By" sections)
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKIYDGeW6mYjpuYpeAimmv_lW3ipVmIzPlA&s",
  
  // American Society of Travel Advisors
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ9Dg_bNGyf_wsU_RJCBdH53FTw7SDvXJe9A&s",
  
  // Forbes Travel Guide
  "https://www.unwto-tourismacademy.ie.edu/wp-content/uploads/2024/07/Booking_Com_Logotype_Aug2020_Blue-2-1-1.png",
  
  // National Geographic (Commonly used for eco-travel/tours)
  "https://s202.q4cdn.com/757635260/files/images/new-logos/2023/Expedia-Horizontal-Logo-Product-Full-Colour-Dark-Blue-RGB.png"
];

const LogoMarquee = () => {
  return (
    <div className={classes.container} >
    <div className={classes.logoMarqueeWrapper}>
      <Swiper
        modules={[Autoplay]}
        loop
        slidesPerView="auto"
        spaceBetween={80}
        speed={8000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        dir="rtl"
      >
        {[...logos, ...logos].map((logo, index) => (
          <SwiperSlide key={index} className={classes.logoSlide}>
            <img src={logo} alt="brand logo" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </div>
  );
};

export default LogoMarquee;
