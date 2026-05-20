import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import classes from "./HeroSection.module.css";
import types from "../Data/types.json";
import udaipurImg from '../assets/Hero/udaipur.jpg'
import mountainsImg from '../assets/Hero/mountains.png'
import indiaImg from '../assets/Hero/india.png'
import useTypingPlaceholder from "../utills/useTypingPlaceholder";
import useTypewriter from "../utills/useTypewriter";
import { FiSearch } from "react-icons/fi";

const searchQueries = [
  "Where do you want to go?",
  "Plan a trip to Kashmir...",
  "Best Udaipur tours?",
  "Honeymoon in Kerala?",
  "Corporate trips in Himachal...",
  "Adventure in Leh Ladakh?"
];

const TypingHeading = ({ text }) => {
  const { displayText, isDone } = useTypewriter(text, 70, 400);
  return (
    <h1>
      {displayText}
      {!isDone && <span className={classes.cursor}>|</span>}
    </h1>
  );
};

const HeroSection = ({ type, onTypeSelect }) => {
  const slides = [
    {
      img: mountainsImg,
      text: "Himalayan Escape",
      tagline: "Where the Mountains Touch the Sky",
      desc: "Experience snow-capped peaks, peaceful monasteries, and breathtaking sunrise views in the heart of the Himalayas."
    },
    {
      img: udaipurImg,
      text: "Royal Rajasthan",
      tagline: "Live the Palace Life",
      desc: "From golden deserts to majestic forts, immerse yourself in royal heritage, vibrant culture, and timeless architecture."
    },
    {
      img: indiaImg,
      text: "Kerala Backwaters",
      tagline: "Serenity in Every Ripple",
      desc: "Drift through lush green canals, palm-lined shores, and tranquil houseboats in God’s Own Country."
    }
  ];

  const tourTypes = [
    { id: 'group', icon: '👥', label: 'Group Tour' },
    // { id: 'corporate', icon: '🏢', label: 'Corporate Tour' },
    { id: 'couple', icon: '💑', label: 'Couple Trip' },
    { id: 'honeymoon', icon: '💍', label: 'Honeymoon' }
  ];


  const animatedPlaceholder = useTypingPlaceholder(searchQueries);

  return (
    <section className={classes.hero}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        loop
        speed={1200}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className={classes.heroSwiper}
      >
        {slides.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className={classes.slide}>
              <img src={item.img} alt={item.text} />
              <div className={classes.overlay}>
                <div className={classes.contentWrapper}>
                  <div className={classes.leftContent}>
                    <TypingHeading text={item.text} />
                    <p>{item.desc}</p>

                    {/* SEARCH BAR */}
                    <div className={classes.searchBar}>
                      <div className={classes.inputGroup}>
                        <FiSearch className={classes.icon} />
                        <input type="text" placeholder={animatedPlaceholder} />
                      </div>
                      <button className={classes.searchBtn}>Plan My Trip</button>
                    </div>
                  </div>

                  {/* Right Side Floating Cards */}
                  <div className={classes.rightCards}>
                    <div className={classes.card}>
                      <img src={udaipurImg} alt="Udaipur" />
                      <span>Udaipur</span>
                    </div>
                    <div className={classes.card}>
                      <img src={mountainsImg} alt="Mountains" />
                      <span>Mountains</span>
                    </div>
                  </div>
                </div>

                {/* TOUR TYPES TABS - MOVED TO BOTTOM CENTER */}
                <div className={classes.tourTabs}>
                  {tourTypes.map((t) => (
                    <div
                      key={t.id}
                      className={classes.tourTab}
                      onClick={() => onTypeSelect(t.label)}
                    >
                      <span className={classes.tabIcon}>{t.icon}</span>
                      <span className={classes.tabLabel}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;
