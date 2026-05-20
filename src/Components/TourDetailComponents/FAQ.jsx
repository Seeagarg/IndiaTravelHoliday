import { useState } from "react";
import styles from "./FAQ.module.css";

const globalAgencyFaqs = [
  {
    question: "How can I book a tour with India Travel Holiday?",
    answer: "You can book directly through our website by choosing your preferred package, or you can get in touch with our travel experts via the 'Contact Us' page or WhatsApp for a more personalized booking experience."
  },
  {
    question: "Can I customize the existing tour itineraries?",
    answer: "Absolutely! We specialize in tailor-made experiences. You can modify the duration, add specific destinations, or upgrade your accommodations. Just let our team know your preferences."
  },
  {
    question: "What documents should I carry during my trip?",
    answer: "Travelers are required to carry a valid government-issued Photo ID (Aadhar Card, Voter ID, or Passport). For certain restricted areas, additional permits may be needed, which we will help you arrange."
  },
  {
    question: "What are the available payment methods?",
    answer: "We accept all major payment methods including UPI, Credit/Debit Cards (Visa, MasterCard, Amex), and Bank Transfers. We also offer flexible installment options for early bookings."
  },
  {
    question: "What is India Travel Holiday's cancellation and refund policy?",
    answer: "Cancellations made 30 days prior to the trip are usually eligible for a full refund (minus minimal service charges). Rules vary based on the specific hotel and transport policies included in your package."
  },
  {
    question: "Is 24/7 support available during the tour?",
    answer: "Yes, we provide 24/7 on-trip assistance. Once your booking is confirmed, you'll be assigned a dedicated trip manager whom you can contact via phone or WhatsApp for any emergencies or help."
  },
  {
    question: "Are meals and entry fees included in the packages?",
    answer: "Standard packages usually include breakfast and dinner. Entry fees to monuments are typically excluded unless specifically mentioned, allowing you the flexibility to choose what you want to see."
  },
  {
    question: "What happens in case of bad weather or sudden closures?",
    answer: "Your safety is our priority. In case of unforeseen weather conditions or landslides, our ground team will provide alternative sightseeing options or adjust the itinerary to ensure a smooth experience."
  }
];

const FAQ = ({ tour }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayFaqs = (tour && tour.faqs && tour.faqs.length > 0) ? tour.faqs : globalAgencyFaqs;

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.heading}>Frequently Asked Questions</h2>
      <p className={styles.subHeading}>Your right to know!</p>

      <div className={styles.faqList}>
        {displayFaqs.map((faq, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ""
              }`}
            onClick={() => toggleFAQ(index)}
          >
            <div className={styles.questionRow}>
              <span className={styles.question}>
                Q. {faq.question}
              </span>
              <span className={styles.icon}>
                ▾
              </span>
            </div>

            {activeIndex === index && (
              <div className={styles.answer}>
                <strong>A:</strong> {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
