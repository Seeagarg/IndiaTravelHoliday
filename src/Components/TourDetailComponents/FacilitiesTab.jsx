import React from 'react';
import styles from './FacilitiesTab.module.css';
import { 
  FaHotel, 
  FaWifi, 
  FaUtensils, 
  FaCamera, 
  FaCar, 
  FaCogs, 
  FaTrain, 
  FaPlane, 
  FaBus 
} from 'react-icons/fa';

const facilities = [
  { icon: <FaHotel />, label: 'Hotel' },
  { icon: <FaWifi />, label: 'Wifi' },
  { icon: <FaUtensils />, label: 'Meals' },
  { icon: <FaCamera />, label: 'Sightseeing' },
  { icon: <FaCar />, label: 'Cab Transfer' },
  { icon: <FaCogs />, label: 'Quick Service' },
  { icon: <FaTrain />, label: 'Railway' },
  { icon: <FaPlane />, label: 'Flight' },
  { icon: <FaBus />, label: 'Volvo' },
];

const FacilitiesTab = () => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {facilities.map((item, index) => (
          <div key={index} className={styles.facilityItem}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesTab;
