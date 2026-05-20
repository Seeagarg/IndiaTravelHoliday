import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import detailData from '../Data/Detail.json';
import styles from './HomeReviews.module.css';

const HomeReviews = () => {
    const reviews = useMemo(() => {
        // Collect all reviews from all tours
        const allReviews = detailData.flatMap(tour => tour.reviews || []);
        // Filter out duplicates based on the review text
        const uniqueReviewsMap = new Map();
        allReviews.forEach(review => {
            if (!uniqueReviewsMap.has(review.text)) {
                uniqueReviewsMap.set(review.text, review);
            }
        });

        const uniqueReviews = Array.from(uniqueReviewsMap.values());

        // Sort randomly or just take the first few
        return uniqueReviews.slice(0, 12);
    }, []);

    return (
        <section className={styles.reviewsSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Our Community</span>
                    <h2>Traveler <span>Voices</span></h2>
                    <p>Real stories from adventurers who explored the world with us</p>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    centeredSlides={false}
                    loop={true}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    navigation={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1100: {
                            slidesPerView: 3,
                        },
                    }}
                    className={styles.reviewsSwiper}
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className={styles.reviewCard}>
                                <div className={styles.quoteIcon}>
                                    <FaQuoteLeft />
                                </div>
                                <div className={styles.rating}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={styles.starIcon} />
                                    ))}
                                </div>
                                <p className={styles.reviewText}>{review.text}</p>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatarWrapper}>
                                        <img
                                            src={review.images?.[0] || `https://picsum.photos/100/100?sig=${index + 50}`}
                                            alt={review.name}
                                            className={styles.avatar}
                                        />
                                    </div>
                                    <div className={styles.userDetails}>
                                        <h4>{review.name}</h4>
                                        <span>Verified Explorer</span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default HomeReviews;
