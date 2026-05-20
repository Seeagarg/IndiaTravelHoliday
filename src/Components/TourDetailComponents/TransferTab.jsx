import styles from "./TransferTab.module.css";

const TransferTab = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Transfers & Transportation</h2>

      {/* Transfer Card */}
      <div className={styles.transferCard}>
        <div className={styles.transferItem}>
          🚖
          <div>
            <strong>Airport / Railway Station → Hotel</strong>
            <p>
              Pickup from Indira Gandhi International Airport or New Delhi
              Railway Station and transfer to your hotel.
            </p>
          </div>
        </div>

        <div className={styles.transferItem}>
          🚖
          <div>
            <strong>Hotel → Airport / Railway Station</strong>
            <p>
              Timely drop from hotel to airport or railway station at the end of
              the tour.
            </p>
          </div>
        </div>

        <div className={styles.transferItem}>
          🚗
          <div>
            <strong>Local Sightseeing Transfers</strong>
            <p>
              Comfortable AC vehicle for sightseeing in Old Delhi and New Delhi,
              including monuments and markets.
            </p>
          </div>
        </div>

        <div className={styles.transferItem}>
          🚶‍♂️
          <div>
            <strong>Chandni Chowk Rickshaw Ride</strong>
            <p>
              Enjoy a traditional rickshaw ride through the bustling lanes of
              Old Delhi.
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className={styles.note}>
        ℹ️ All transfers are provided in an AC vehicle on a shared basis unless
        mentioned otherwise. Private transfers can be arranged on request.
      </div>
    </div>
  );
};

export default TransferTab;
