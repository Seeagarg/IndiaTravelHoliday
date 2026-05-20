import { useState } from "react";
import styles from "./GalleryModal.module.css";

const TABS = [
  { key: "all", label: "All Images" },
  { key: "destination", label: "Destination" },
  { key: "activity", label: "Activities" },
  { key: "stay", label: "Stay" },
];

const GalleryModal = ({ images, onClose }) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredImages =
    activeTab === "all"
      ? images
      : images.filter(img => img.category === activeTab);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={onClose} className={styles.backBtn}>← Back</button>

          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.active : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Images Grid */}
        <div className={styles.grid}>
          {filteredImages.map((img, index) => (
            <img key={index} src={img.src} alt="" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
