import { useState } from "react";
import styles from "./Itinerary.module.css";
import ItineraryTab from "./ItineraryTab";
import SummaryTab from "./SummaryTab";
import ActivitiesTab from "./ActivitiesTab";
import FacilitiesTab from "./FacilitiesTab";
import StayTab from "./StayTab";
import TransfersTab from "./TransferTab";

const tabs = [
  "Itinerary",
  "Summary",
  "Activities",
  "Facilities",
  "Stay",
  // "Transfers",
];

const ItineraryTabs = ({ tour }) => {
  const [activeTab, setActiveTab] = useState("Itinerary");

  return (
    <section className={styles.container}>
      {/* 🔥 TABS ARE HERE */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔥 TAB CONTENT IS HERE */}
      <div className={styles.tabContent}>
        {activeTab === "Itinerary" && <ItineraryTab itinerary={tour.itinerary} tourTitle={tour.title} tour={tour} />}
        {activeTab === "Summary" && <SummaryTab tour={tour} />}
        {activeTab === "Activities" && <ActivitiesTab tour={tour} />}
        {activeTab === "Facilities" && <FacilitiesTab tour={tour} />}
        {activeTab === "Stay" && <StayTab tour={tour} />}
        {activeTab === "Transfers" && <TransfersTab tour={tour} />}
      </div>
    </section>
  );
};

export default ItineraryTabs;
