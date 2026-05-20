import React from "react";
import classes from './HeroTour.module.css';

const HeroTour = () => {
  return (
    <section className={classes.heroContainer}>
      {/* Floating images - Left */}
      <div className={`${classes.imageCluster} ${classes.left}`}>
        {/* Taj Mahal */}
        <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=500" alt="Heritage" loading="lazy" />
        {/* Mountains */}
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500" alt="Mountains" loading="lazy" />
        {/* Boat/Kerala */}
        <img src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=500" alt="Backwaters" loading="lazy" />
        {/* Architecture */}
        <img src="https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=500" alt="Architecture" loading="lazy" />
        {/* Nature */}
        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=500" alt="Nature" loading="lazy" />
        {/* Culture */}
        <img src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=500" alt="Culture" />
      </div>

      {/* Main Content */}
      <div className={classes.heroContent}>
        <h1>
          Your Tour, <br />
          <span>Perfectly Personalised!</span>
        </h1>
        <p>Explore Expert-led, AI-powered multi-day tours.</p>
      </div>

      {/* Floating images - Right */}
      <div className={`${classes.imageCluster} ${classes.right}`}>
        {/* Goa/Beach */}
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=500" alt="Beach" loading="lazy" />
        {/* Spiritual/Varanasi */}
        <img src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=500" alt="Spiritual" loading="lazy" />
        {/* Adventure */}
        <img src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=500" alt="Adventure" loading="lazy" />
        {/* Luxury Palace */}
        <img src="https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&q=80&w=500" alt="Palace" loading="lazy" />
        {/* Sunset */}
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=500" alt="Sunset" loading="lazy" />
        {/* Cityscape */}
        <img src="https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&q=80&w=500" alt="City" loading="lazy" />
      </div>
    </section>
  );
};

export default HeroTour;