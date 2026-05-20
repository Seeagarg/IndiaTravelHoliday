import React from 'react';
import styles from './MinimalBackground.module.css';

const MinimalBackground = () => {
    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.silhouettes}>
                {/* Eiffel Tower */}
                <svg className={styles.landmark} viewBox="0 0 100 200" style={{ left: '5%', bottom: '0', width: 'clamp(100px, 15vw, 150px)', height: 'clamp(200px, 30vw, 300px)' }}>
                    <path d="M48,10 L52,10 L52,20 L48,20 Z M49,20 L51,20 L55,100 L45,100 Z M46,100 L54,100 L60,180 L40,180 Z M35,180 L65,180 L70,200 L30,200 Z" fill="currentColor" />
                    <rect x="42" y="80" width="16" height="2" fill="currentColor" opacity="0.3" />
                    <rect x="45" y="40" width="10" height="2" fill="currentColor" opacity="0.3" />
                </svg>

                {/* Leaning Tower of Pisa */}
                <svg className={styles.landmark} viewBox="0 0 100 200" style={{ left: '22%', bottom: '0', width: 'clamp(80px, 10vw, 100px)', height: 'clamp(160px, 20vw, 200px)' }}>
                    <g transform="rotate(5 50 100)">
                        <path d="M35,40 L65,40 L65,180 L35,180 Z" fill="currentColor" />
                        <rect x="32" y="180" width="36" height="5" fill="currentColor" />
                        {[60, 85, 110, 135, 160].map(y => (
                            <rect key={y} x="35" y={y} width="30" height="4" fill="#ffffff" opacity="0.2" />
                        ))}
                    </g>
                </svg>

                {/* Taj Mahal */}
                <svg className={styles.landmark} viewBox="0 0 200 150" style={{ left: '40%', bottom: '0', width: 'clamp(150px, 20vw, 220px)', height: 'clamp(112px, 15vw, 165px)' }}>
                    <path d="M60,120 L140,120 L140,80 Q140,35 100,35 Q60,35 60,80 Z" fill="currentColor" />
                    <rect x="55" y="80" width="90" height="40" fill="currentColor" />
                    <rect x="50" y="70" width="15" height="50" fill="currentColor" />
                    <rect x="135" y="70" width="15" height="50" fill="currentColor" />
                    <rect x="30" y="50" width="6" height="70" fill="currentColor" />
                    <rect x="164" y="50" width="6" height="70" fill="currentColor" />
                    <circle cx="100" cy="30" r="3" fill="currentColor" />
                </svg>

                {/* Arc de Triomphe */}
                <svg className={styles.landmark} viewBox="0 0 120 100" style={{ left: '68%', bottom: '0', width: 'clamp(100px, 12vw, 130px)', height: 'clamp(83px, 10vw, 108px)' }}>
                    <path d="M20,20 L100,20 L100,100 L80,100 L80,55 Q80,45 60,45 Q40,45 40,55 L40,100 L20,100 Z" fill="currentColor" />
                    <rect x="20" y="25" width="80" height="4" fill="#ffffff" opacity="0.2" />
                    <rect x="20" y="35" width="80" height="2" fill="#ffffff" opacity="0.1" />
                </svg>

                {/* Additional Landmark - Big Ben or similar */}
                <svg className={styles.landmark} viewBox="0 0 80 200" style={{ left: '85%', bottom: '0', width: 'clamp(60px, 8vw, 80px)', height: 'clamp(150px, 20vw, 200px)' }}>
                    <rect x="30" y="40" width="20" height="160" fill="currentColor" />
                    <rect x="25" y="30" width="30" height="30" fill="currentColor" />
                    <path d="M25,30 L40,5 L55,30 Z" fill="currentColor" />
                    <circle cx="40" cy="45" r="5" fill="#ffffff" opacity="0.3" />
                </svg>

                {/* Clouds */}
                <svg className={styles.cloud} viewBox="0 0 100 50" style={{ left: '15%', top: '20%', width: '100px' }}>
                    <circle cx="30" cy="30" r="15" fill="currentColor" />
                    <circle cx="50" cy="25" r="20" fill="currentColor" />
                    <circle cx="70" cy="30" r="15" fill="currentColor" />
                </svg>
                <svg className={styles.cloud} viewBox="0 0 100 50" style={{ left: '55%', top: '15%', width: '120px' }}>
                    <circle cx="30" cy="30" r="15" fill="currentColor" />
                    <circle cx="50" cy="25" r="20" fill="currentColor" />
                    <circle cx="70" cy="30" r="15" fill="currentColor" />
                </svg>
                <svg className={styles.cloud} viewBox="0 0 100 50" style={{ left: '80%', top: '35%', width: '80px' }}>
                    <circle cx="30" cy="30" r="15" fill="currentColor" />
                    <circle cx="50" cy="25" r="20" fill="currentColor" />
                    <circle cx="70" cy="30" r="15" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
};

export default MinimalBackground;
