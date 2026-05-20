import { useState } from "react";
import styles from "./Gallery.module.css";
import GalleryModal from "./GalleryModal";

const galleryImages = [
  {
    src: "https://www.clubmahindra.com/blog/media/section_images/delhitouri-ca7b25a36acac99.jpg",
    category: "destination",
  },
  {
    src: "https://hblimg.mmtcdn.com/content/hubble/img/delhi/mmt/destination/m_destinations_Delhi_l_502_809.jpg",
    category: "destination",
  },
  {
    src: "https://www.tripsavvy.com/thmb/Q8-enki214IsS44Pen6lSB919Bg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-531732818-592d24ec3df78cbe7e956e68.jpg",
    category: "activity",
  },
  {
    src: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201203301842173153-3275c498929611ee8a710a58a9feac02.jpg?output-quality=75&downsize=328:180&output-format=jpg",
    category: "stay",
  },
  {
    src: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/08/81/e7/6b.jpg",
    category: "activity",
  },
];

const Gallery = ({ images }) => {
  const [open, setOpen] = useState(false);

  const gallery = images?.gallery || [];
  const destinationImg = images?.destination || gallery[1] || galleryImages[1].src;
  const stayImg = images?.stay || gallery[2] || galleryImages[3].src;
  const activityImg = images?.activity || gallery[3] || galleryImages[2].src;
  const allImg = gallery[4] || galleryImages[4].src;

  const displayImages = gallery.length > 0 
    ? gallery.map(img => ({ src: img, category: "destination" })) 
    : galleryImages;

  const coverImage = images?.cover || gallery[0] || galleryImages[0].src;

  return (
    <>
      <section className={styles.gallery}>
        {/* Left Big Image */}
        <div className={styles.mainImage} onClick={() => setOpen(true)}>
          <img
            src={coverImage}
            alt="Tour Cover"
            style={{ cursor: "pointer" }}
            onError={(e) => { e.target.src = "https://picsum.photos/800/600?nature"; }}
          />
        </div>

        {/* Right Grid */}
        <div className={styles.sideGrid}>
          <div className={styles.gridItem} onClick={() => setOpen(true)}>
            <img 
              src={destinationImg} 
              alt="Destination" 
              onError={(e) => { e.target.src = "https://picsum.photos/400/300?city"; }}
            />
            <span className={styles.label}>Destinations</span>
          </div>

          <div className={styles.gridItem} onClick={() => setOpen(true)}>
            <img 
              src={stayImg} 
              alt="Stays" 
              onError={(e) => { e.target.src = "https://picsum.photos/400/300?hotel"; }}
            />
            <span className={styles.label}>Stays</span>
          </div>

          <div className={styles.gridItem} onClick={() => setOpen(true)}>
            <img 
              src={activityImg} 
              alt="Activity" 
              onError={(e) => { e.target.src = "https://picsum.photos/400/300?adventure"; }}
            />
            <span className={styles.label}>Activity</span>
          </div>

          <div
            className={`${styles.gridItem} ${styles.viewAll}`}
            onClick={() => setOpen(true)}
          >
            <img 
              src={allImg} 
              alt="All Images" 
              onError={(e) => { e.target.src = "https://picsum.photos/400/300?travel"; }}
            />
            <button className={styles.viewButton}>View All</button>
          </div>
        </div>
      </section>

      {/* ===== EXISTING GALLERY MODAL ===== */}
      {open && (
        <GalleryModal
          images={displayImages}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Gallery;
