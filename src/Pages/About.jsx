import React, { useEffect } from "react";
import classes from "./About.module.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={classes.aboutPage}>
            <Navbar />

            {/* HERO SECTION */}
            <section className={classes.hero}>
                <div className={classes.heroContent}>
                    <h1>We Create <br /> Unforgettable Stories</h1>
                    <p>More than just a travel agency. We are your primary partners in discovering the soul of India.</p>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className={classes.stats}>
                <div className={classes.statItem}>
                    <h2>10+</h2>
                    <p>Years of Expertise</p>
                </div>
                <div className={classes.statItem}>
                    <h2>3M+</h2>
                    <p>Happy Travelers</p>
                </div>
                <div className={classes.statItem}>
                    <h2>4.8★</h2>
                    <p>Average Rating</p>
                </div>
                <div className={classes.statItem}>
                    <h2>500+</h2>
                    <p>Destinations Covered</p>
                </div>
            </section>

            {/* STORY SECTION */}
            <section className={classes.storySection}>
                <div className={classes.storyContent}>
                    <h3>Our Journey</h3>
                    <h2>Crafting Dreams Since 2015</h2>
                    <p>
                        India Travel Holiday started with a simple belief: that travel should be more than just visiting a place—it should be about experiencing it. What began as a small group of enthusiastic travelers has grown into one of India's leading multi-day tour operators.
                    </p>
                    <p>
                        We don't just book hotels and transport; we own the entire experience. From on-ground operations to 24/7 support, we ensure that your journey is seamless, safe, and truly magical.
                    </p>
                </div>
                <div className={classes.storyImage}>
                    <img
                        src="https://images.unsplash.com/photo-1519922639192-e73293ca430e?q=80&w=2072&auto=format&fit=crop"
                        alt="Traveling in India"
                    />
                </div>
            </section>

            {/* VALUES SECTION */}
            <section className={classes.valuesSection}>
                <div className={classes.valueItem}>
                    <span>🌿</span>
                    <h5>Authenticity</h5>
                    <p>Real people, real places, raw experiences.</p>
                </div>
                <div className={classes.valueItem}>
                    <span>🤝</span>
                    <h5>Community</h5>
                    <p>Travel is better when shared with friends.</p>
                </div>
                <div className={classes.valueItem}>
                    <span>🌍</span>
                    <h5>Sustainability</h5>
                    <p>Respecting the land we explore.</p>
                </div>
            </section>

            {/* WHY US - FEATURES SECTION */}
            <section className={classes.features}>
                <div className={classes.featuresHeader}>
                    <h2>Why Travel with India Travel Holiday?</h2>
                    <p>We combine technology with human touch to deliver tours that fail nowhere in execution.</p>
                </div>
                <div className={classes.featuresGrid}>
                    <div className={classes.featureCard}>
                        <span className={classes.featureIcon}>🗺️</span>
                        <h4>Expert Curated</h4>
                        <p>Every itinerary is designed by travel experts who have personally explored every corner of the route.</p>
                    </div>
                    <div className={classes.featureCard}>
                        <span className={classes.featureIcon}>🛡️</span>
                        <h4>On-Ground Safety</h4>
                        <p>With our physical presence in 20+ states, help is always just a phone call away, 24/7.</p>
                    </div>
                    <div className={classes.featureCard}>
                        <span className={classes.featureIcon}>🤖</span>
                        <h4>AI-Powered Tech</h4>
                        <p>We use cutting-edge AI to personalize your trip while our human team manages the execution.</p>
                    </div>
                    <div className={classes.featureCard}>
                        <span className={classes.featureIcon}>🤝</span>
                        <h4>No Middlemen</h4>
                        <p>We operate our own tours. No hidden handoffs, no grey areas—just direct accountability.</p>
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className={classes.teamSection}>
                <div className={classes.teamHeader}>
                    <h2>Meet the Explorers</h2>
                </div>
                <div className={classes.teamGrid}>
                    <div className={classes.teamMember}>
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" alt="CEO" />
                        <h4>Arjun Sharma</h4>
                        <p>Founder & CEO</p>
                    </div>
                    <div className={classes.teamMember}>
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" alt="COO" />
                        <h4>Priya Verma</h4>
                        <p>Head of Operations</p>
                    </div>
                    <div className={classes.teamMember}>
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" alt="CTO" />
                        <h4>Rohan Das</h4>
                        <p>Technology Lead</p>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className={classes.cta}>
                <h2>Ready for your next adventure?</h2>
                <button className={classes.ctaBtn} onClick={() => window.location.href = '/'}>Explore Destinations</button>
            </section>

            <Footer />
        </div>
    );
};

export default About;
