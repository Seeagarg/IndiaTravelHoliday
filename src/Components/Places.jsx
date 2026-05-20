import React, { useMemo, useState, useEffect } from "react";
import PlaceGrid from "./PlacesGrid";
import styles from "./Places.module.css";
import HeroTour from "./HeroTour";
import axios from "axios";
import { allDestinations_api, Destinations_api, base_url } from "../Services/Api";

const Places = ({ selectedTab = "explore", limit = 12 }) => {
  const [apiData, setApiData] = useState([]);

  const [destinations, setDestinations] = useState([]);

  // Fetch all destinations once to have the ID mapping from Backend API
  useEffect(() => {
    const fetchDestList = async () => {
      try {
        const response = await axios.get(allDestinations_api);
        const result = response.data;
        if (result && result.data) {
          setDestinations(result.data);
        }
      } catch (error) {
        console.error("Error loading destination list:", error);
      }
    };
    fetchDestList();
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        let destId = null;
        
        if (selectedTab !== "explore") {
          destId = Number(selectedTab);
        } else if (destinations.length > 0) {
          destId = destinations[0].id;
        }

        if (!destId) return;

        // Fetching data from Backend API instead of local JSON
        const response = await axios.get(Destinations_api(destId));
        const result = response.data;
        if (result && result.data && result.data.content) {
          // Map API data to match the expected format of PlaceGrid / TourCard
          const mappedTours = result.data.content.map((tour) => ({
            slug: tour.slug || `tour-${tour.tourId}`,
            place: tour.placeName || tour.destinationName || "",
            title: tour.title,
            subtitle: tour.shortDescription || tour.description || "",
            duration: tour.duration || "",
            starting_price: tour.startingPrice || 0,
            original_price: tour.originalPrice || 0,
            currency: "INR",
            rating: tour.rating || 4.5,
            total_reviews: tour.reviewsCount || 0,
            images: {
              cover: tour.coverImage 
                ? (tour.coverImage.startsWith('http') ? tour.coverImage : `${base_url}${tour.coverImage}`)
                : (tour.tourImages?.[0] 
                    ? (tour.tourImages[0].startsWith('http') ? tour.tourImages[0] : `${base_url}${tour.tourImages[0]}`)
                    : "https://picsum.photos/1200/600"),
              gallery: (tour.tourImages || []).map(img => 
                img.startsWith('http') ? img : `${base_url}${img}`
              )
            }
          }));
          setApiData(mappedTours);
        } else {
          setApiData([]);
        }
      } catch (error) {
        console.error("Error fetching tours for destination:", error);
        setApiData([]);
      }
    };

    if (destinations.length > 0 || selectedTab === "explore") {
      fetchTours();
    }
  }, [selectedTab, destinations]);

  const filteredPlaces = useMemo(() => {
    // ONLY show data coming from API as requested (disabled local JSON for now)
    const combinedData = [...apiData];
    // If it's the default "Explore" state, show everything loaded
    if (selectedTab === "explore") {
      return combinedData;
    }

    // Otherwise filter by place name or title (optional, as API already filters by dest)
    // We'll keep it simple and return the data from API
    return combinedData;
  }, [selectedTab, apiData]);

  const visiblePlaces = useMemo(() => {
    return [...filteredPlaces]
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
      .slice(0, limit);
  }, [filteredPlaces, limit]);

  // If limit is small (e.g. 3), we treat it as a "preview" mode with a banner
  const showBanner = limit <= 6;
  const firstHalf = showBanner ? visiblePlaces.slice(0, 3) : visiblePlaces;

  return (
    <section className={styles.placesSection}>
      {!showBanner && (
        <div className={styles.tripsHeader}>
          <h1>All Upcoming Trips & Destinations</h1>
          <p>Discover the best of India with our handpicked tour packages</p>
        </div>
      )}

      {showBanner && (
        <div className={styles.header}>
          <h2>
            Explore <span>{
              selectedTab === "explore" 
                ? "India" 
                : (destinations.find(d => String(d.id) === String(selectedTab))?.name || "Destinations")
            }</span>
          </h2>
          <p>Handpicked destinations to explore nearby attractions in one trip</p>
        </div>
      )}

      <div className={styles.gridContainer}>
        {/* First Row of 3 */}
        {firstHalf.length > 0 && <PlaceGrid places={firstHalf} />}

        {/* Injected Personalised Component (Banner) - Only in preview mode */}
        {showBanner && firstHalf.length > 0 && (
          <div className={styles.injectedContent}>
            <HeroTour />
          </div>
        )}

        {visiblePlaces.length === 0 && (
          <div className={styles.noResults}>
            <p>No tours found for "{
              selectedTab === "explore" 
                ? "India" 
                : (destinations.find(d => String(d.id) === String(selectedTab))?.name || "Destination")
            }". Try another destination!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Places;
