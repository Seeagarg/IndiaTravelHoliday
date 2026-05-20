import React, { useState, useRef, useEffect } from "react";
import styles from "./IndiaTabs.module.css";
import Explore from "../assets/placeIcons/explore.png";

/*
import DelhiImg from "../assets/placeIcons/delhi.png";
import kashmirImg from "../assets/placeIcons/kashmir.png";
import GoaImg from "../assets/placeIcons/goa.png";
import JaipurImg from "../assets/placeIcons/jaipur.png";
import UdaipurImg from "../assets/placeIcons/udaipur.png";
import HimachalImg from "../assets/placeIcons/Himachal.png";
import MumbaiImg from "../assets/placeIcons/mumbai.png";
import KeralaImg from "../assets/placeIcons/kerala.png";
import RishikeshImg from "../assets/placeIcons/rishikesh.png";
import VaranasiImg from "../assets/placeIcons/varanasi.png";
import Explore from "../assets/placeIcons/explore.png";

const indiaTabs = [
  { id: "explore", label: "Explore India", icon: Explore },
  { id: "delhi", label: "Delhi", icon: DelhiImg },
  { id: "jaipur", label: "Jaipur", icon: JaipurImg },
  { id: "udaipur", label: "Udaipur", icon: UdaipurImg },
  { id: "himachal", label: "Himachal", icon: HimachalImg },
  { id: "kashmir", label: "Kashmir", icon: kashmirImg },
  { id: "goa", label: "Goa", icon: GoaImg },
  { id: "mumbai", label: "Mumbai", icon: MumbaiImg },
  { id: "kerala", label: "Kerala", icon: KeralaImg },
  { id: "rishikesh", label: "Rishikesh", icon: RishikeshImg },
  { id: "varanasi", label: "Varanasi", icon: VaranasiImg }
];
*/

import { base_url, allDestinations_api } from "../Services/Api";
import axios from "axios";

const VISIBLE_COUNT = 7;
const CENTER_INDEX = Math.floor(VISIBLE_COUNT / 2);

const IndiaTabs = ({ selectedTab, setSelectedTab }) => {
  const [tabs, setTabs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const startX = useRef(0);
  const isDragging = useRef(false);

  // Fetch dynamic tabs from Backend API
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await axios.get(allDestinations_api);
        const result = response.data;
        if (result && result.data) {
          const apiTabs = result.data.map(dest => ({
            id: dest.id,
            label: dest.name,
            icon: dest.iconUrl 
              ? (dest.iconUrl.startsWith('http') ? dest.iconUrl : `${base_url}${dest.iconUrl}`)
              : Explore
          }));
          
          setTabs(apiTabs);
          
          // Select the first tab by default if none is selected or if "explore" was selected
          if (apiTabs.length > 0 && (!selectedTab || selectedTab === "explore")) {
            setSelectedTab(apiTabs[0].id);
          }
        }
      } catch (error) {
        console.error("Error loading destinations for tabs:", error);
      }
    };
    fetchTabs();
  }, []);

  // Sync screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Center the carousel when selectedTab changes (from external click/select)
  useEffect(() => {
    const index = tabs.findIndex(tab => tab.id === selectedTab);
    if (index !== -1) {
      // Only jump to index if we're not currently dragging or if it's the initial load
      // For mobile we don't necessarily center it this way as it's a native scroll
      setCurrentIndex(index);
    }
  }, [selectedTab, tabs]);

  const handleCarouselNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCarouselPrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  // Auto-scroll logic removed as requested

  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
    // The useEffect [selectedTab] will handle centering the carousel
  };

  const getVisibleTabs = () => {
    if (tabs.length === 0) return [];
    
    // If we have very few tabs, just show them all once centered
    if (tabs.length < VISIBLE_COUNT) {
      const half = Math.floor(tabs.length / 2);
      return tabs.map((tab, i) => ({
        ...tab,
        displayIndex: i - ((currentIndex % tabs.length + tabs.length) % tabs.length) 
      })).map(tab => {
        // Adjust displayIndex to be within a reasonable range centered around 0 for the active selection
        // This part is tricky because the user wants to "carousel" through them.
        // For simple non-repeating, let's just use the index relative to current.
        return tab;
      });
    }

    // Standard looping logic for larger datasets
    const visibleResult = [];
    for (let i = -CENTER_INDEX; i <= CENTER_INDEX; i++) {
      const index = (currentIndex + i + (tabs.length * 1000)) % tabs.length;
      visibleResult.push({ ...tabs[index], displayIndex: i });
    }
    return visibleResult;
  };

  const visibleTabs = getVisibleTabs();

  // swipe handlers
  const handleStart = (x) => {
    startX.current = x;
    isDragging.current = true;
  };

  const handleEnd = (x) => {
    if (!isDragging.current) return;
    const diff = x - startX.current;
    if (diff > 50) handleCarouselPrev();
    else if (diff < -50) handleCarouselNext();
    isDragging.current = false;
  };

  return (
    <div
      className={styles.wrapper}
    >
      {!isMobile && (
        <button className={styles.arrowLeft} onClick={handleCarouselPrev}>
          ‹
        </button>
      )}

      <div
        className={styles.carousel}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseUp={(e) => handleEnd(e.clientX)}
        onMouseLeave={(e) => handleEnd(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchEnd={(e) =>
          handleEnd(e.changedTouches[0].clientX)
        }
      >
        {(isMobile ? tabs : visibleTabs).map((tab, index) => {
          const isSelected = tab.id === selectedTab;
          const isCenter = !isMobile && tab.displayIndex === 0;

          return (
            <div
              key={`${tab.id}-${isMobile ? index : tab.displayIndex}`}
              onClick={() => handleTabClick(tab.id)}
              className={`${styles.tab} ${isCenter ? styles.center : ""} ${isSelected ? styles.selected : ""
                }`}
            >
              <img src={tab.icon} alt={tab.label} />
              <span>{tab.label}</span>
            </div>
          );
        })}
      </div>

      {!isMobile && (
        <button className={styles.arrowRight} onClick={handleCarouselNext}>
          ›
        </button>
      )}
    </div>
  );
};

export default IndiaTabs;
