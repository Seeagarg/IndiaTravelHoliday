import { useState } from "react";
import styles from "./Itinerary.module.css";

const itineraryDays = [
  {
    day: "DAY 1",
    title: "Arrival in Delhi | Evening at Leisure",
    images: [
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41",
      "https://images.unsplash.com/photo-1548013146-72479768bada",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5"
    ],
    description:
      "Arrive in Delhi, the vibrant capital city of India, where history and modern life blend seamlessly. Upon arrival at the airport or railway station, meet our representative and transfer comfortably to your hotel. After check-in, take some time to relax and freshen up after your journey.\n\nIn the evening, step out to explore nearby attractions at your own pace. You may visit Connaught Place, known for its colonial architecture, shopping arcades, and lively cafés. Explore local markets filled with handicrafts, textiles, and souvenirs, or indulge in authentic North Indian cuisine at a traditional restaurant. If you prefer a relaxed start, unwind at your hotel and prepare for the exciting days ahead.\n\nOvernight stay in Delhi."
  },
  {
    day: "DAY 2",
    title: "Old & New Delhi Sightseeing",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/6c/0d/f4.jpg",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"
    ],
    description:
      "After breakfast, embark on a full-day guided tour exploring the contrasts of Old and New Delhi.\n\nBegin with Old Delhi, where you will visit the historic Red Fort (photo stop), a symbol of Mughal grandeur. Continue to Jama Masjid, one of the largest mosques in India. Experience a thrilling rickshaw ride through the bustling lanes of Chandni Chowk, where spice markets, sweet shops, and vibrant street life create an unforgettable atmosphere.\n\nLater, explore New Delhi with a drive past Rashtrapati Bhavan and Parliament House. Stop at India Gate, a war memorial honoring Indian soldiers. Visit Qutub Minar, a UNESCO World Heritage Site showcasing Indo-Islamic architecture, and conclude your day at the serene Lotus Temple, famous for its unique lotus-shaped structure.\n\nReturn to your hotel for an overnight stay."
  },
  {
    day: "DAY 3",
    title: "Culture & Local Experiences",
    images: [
      "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
      "https://s7ap1.scene7.com/is/image/incredibleindia/exploring-cultural-merriments-new-delhi-blog-ent-exp-cit-pop?qlt=82&ts=1742170523018",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308"
    ],
    description:
      "After breakfast, visit the magnificent Akshardham Temple, renowned for its intricate carvings, spiritual ambiance, and cultural exhibitions that_attach storytelling of India’s heritage.\n\nLater, head to Dilli Haat, an open-air market showcasing handicrafts, handlooms, and regional cuisines from across India. Interact with local artisans and explore vibrant stalls filled with colorful textiles and traditional artwork.\n\nIn the evening, discover Delhi’s café culture, modern shopping malls, or enjoy famous street food like chaat and parathas. This day allows you to experience the city beyond monuments — through its flavors, culture, and people.\n\nOvernight stay in Delhi."
  },
  {
    day: "DAY 4",
    title: "Departure from Delhi",
    // images: [
    //   "https://images.unsplash.com/photo-1477587458883-47145ed94245",
    //   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    //   "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    // ],
    description:
      "After breakfast, check out from your hotel. Depending on your departure time, you may enjoy some last-minute shopping or relax at the hotel.\n\nOur representative will transfer you to the airport or railway station for your onward journey. As you depart, carry with you beautiful memories of Delhi's rich history, vibrant markets, diverse cuisine, and cultural charm.\n\nTour ends with unforgettable experiences."
  }
];


const ItineraryTab = ({ itinerary, tourTitle, tour }) => {
  const [openDay, setOpenDay] = useState(0);

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📍</div>
        <h3>Itinerary Coming Soon</h3>
        <p>We are currently finalizing the route details for this tour. Please check back later or contact us for a customized plan!</p>
        <button className={styles.contactBtn}>Contact Our Travel Experts</button>
      </div>
    );
  }

  return (
    <>
      {/* Image Section */}
      <div className={styles.imageWrapper}>
        <img
          src={`https://picsum.photos/800/400?${tourTitle}`}
          alt={tourTitle}
        />

        <button className={styles.navLeft}>‹</button>
        <button className={styles.navRight}>›</button>

        <div className={styles.imageOverlay}>
          <h3>{itinerary.length} Days in</h3>
          <h2>{tourTitle}</h2>
        </div>
      </div>

      {/* Day-wise Accordion */}
      <div className={styles.itinerary}>
        {itinerary.map((item, index) => (
          <div key={index} className={styles.dayCard}>
            <div
              className={styles.dayHeader}
              onClick={() =>
                setOpenDay(openDay === index ? null : index)
              }
            >
              <span className={styles.dayBadge}>DAY {item.day || item.dayNumber}</span>
              <span className={styles.dayTitle}>{item.title}</span>
              <span className={styles.arrow}>
                {openDay === index ? "⌄" : "›"}
              </span>
            </div>

            {openDay === index && (
              <div className={styles.dayContent}>
                <div className={styles.imageGallery}>
                  {(item.images || tour.images?.gallery?.slice(index * 2, (index * 2) + 4) || [1, 2, 3, 4]).map((img, i) => (
                    <img 
                      key={i} 
                      src={typeof img === 'string' ? img : `https://picsum.photos/200/150?sig=${index}${i}`} 
                      alt={`${item.title}-${i}`} 
                    />
                  ))}
                </div>

                <div className={styles.description}>
                  {(item.activities || []).map((activity, i) => (
                    <p key={i}>• {activity}</p>
                  ))}
                  {(!item.activities || item.activities.length === 0) && (
                    <p>Enjoy local sightseeing and activities as planned for the day.</p>
                  )}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </>
  );
};

export default ItineraryTab;
