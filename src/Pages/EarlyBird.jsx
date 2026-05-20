import React from 'react';
import styles from './EarlyBird.module.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { FaClock, FaPercent, FaPlaneDeparture, FaHotel, FaCalendarCheck, FaGift } from 'react-icons/fa';

const EarlyBird = () => {
    const deals = [
        {
            id: 1,
            title: "Summer in Kashmir",
            discount: "25% OFF",
            validUntil: "April 30, 2026",
            image: "https://images.unsplash.com/photo-1598305371124-8b010128c114?auto=format&fit=crop&w=800&q=80",
            price: "₹18,500",
            originalPrice: "₹24,000",
            tags: ["Family", "Nature"]
        },
        {
            id: 2,
            title: "Goa Beach Bash",
            discount: "30% OFF",
            validUntil: "May 15, 2026",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
            price: "₹12,999",
            originalPrice: "₹19,000",
            tags: ["Couple", "Party"]
        },
        {
            id: 3,
            title: "Majestic Himachal",
            discount: "20% OFF",
            validUntil: "May 05, 2026",
            image: "https://images.unsplash.com/photo-1597040674251-240954b9d00a?auto=format&fit=crop&w=800&q=80",
            price: "₹21,000",
            originalPrice: "₹26,500",
            tags: ["Adventure", "Snow"]
        },
        {
            id: 4,
            title: "Kerala Backwaters",
            discount: "15% OFF",
            validUntil: "June 10, 2026",
            image: "https://images.unsplash.com/photo-1593693411515-c202e934fe11?auto=format&fit=crop&w=800&q=80",
            price: "₹16,800",
            originalPrice: "₹20,000",
            tags: ["Relax", "Cultural"]
        }
    ];

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            
            <header className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>Limited Time Offer</span>
                    <h1>Early Bird <span>Special</span></h1>
                    <p>Book your dream vacation 6 months in advance and unlock exclusive discounts up to 40%.</p>
                    <div className={styles.timerContainer}>
                        <div className={styles.timerItem}>
                            <span>12</span>
                            <small>Days</small>
                        </div>
                        <div className={styles.timerItem}>
                            <span>08</span>
                            <small>Hrs</small>
                        </div>
                        <div className={styles.timerItem}>
                            <span>45</span>
                            <small>Min</small>
                        </div>
                    </div>
                </div>
            </header>

            <section className={styles.benefits}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Why Book <span>Early?</span></h2>
                        <p>Enjoy premium perks that regular bookings just don't get.</p>
                    </div>
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}><FaPercent /></div>
                            <h3>Best Prices</h3>
                            <p>Lock in today's rates before the peak season surge.</p>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}><FaPlaneDeparture /></div>
                            <h3>Preferred Slots</h3>
                            <p>Get the best flight timings and window seats guaranteed.</p>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}><FaHotel /></div>
                            <h3>Premium Stays</h3>
                            <p>Choice of the best rooms and suites in our partner hotels.</p>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.benefitIcon}><FaGift /></div>
                            <h3>Loyalty Bonus</h3>
                            <p>Earn 2x reward points on all early-bird bookings.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.dealsSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Live <span>Early-Bird</span> Deals</h2>
                        <p>Pick your destination and save big today.</p>
                    </div>
                    <div className={styles.dealsGrid}>
                        {deals.map(deal => (
                            <div key={deal.id} className={styles.dealCard}>
                                <div className={styles.imgWrapper}>
                                    <img src={deal.image} alt={deal.title} />
                                    <div className={styles.discountBadge}>{deal.discount}</div>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.tagList}>
                                        {deal.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                                    </div>
                                    <h3>{deal.title}</h3>
                                    <div className={styles.validity}>
                                        <FaClock /> Expires {deal.validUntil}
                                    </div>
                                    <div className={styles.priceRow}>
                                        <div className={styles.price}>
                                            <span className={styles.current}>{deal.price}</span>
                                            <span className={styles.old}>{deal.originalPrice}</span>
                                        </div>
                                        <button className={styles.bookBtn}>Book Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2>Don't Miss Out!</h2>
                    <p>Our early bird slots are filling up fast. Secure your spot now with just 10% advance payment.</p>
                    <button className={styles.mainCta}>Get Started Free</button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default EarlyBird;
