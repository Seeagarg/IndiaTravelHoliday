import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import styles from './ChatPage.module.css';
import useTypingPlaceholder from '../utills/useTypingPlaceholder';
import chatbot from '../assets/chatbot.png';
import avatar from '../assets/avatar.png'
import top_chat from '../assets/top_chat.png'
import { FaCommentDots, FaPaperPlane, FaArrowLeft, FaPlane, FaHotel, FaMapMarkedAlt, FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
import { guestAuth_api, chat_api } from '../Services/Api';
import { getCookie } from '../utills/cookieManager';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Welcome to TravelBot Full Page! How can I assist you in planning your dream vacation today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem('chatToken') || '');
    const navigate = useNavigate();

    const placeholders = [
        "Tell me where you want to go...",
        "I want to visit Kerala",
        "Show me Taj Mahal tours",
        "Honeymoon packages in Udaipur",
        "Budget trips in Himachal Pradesh"
    ];

    const animatedPlaceholder = useTypingPlaceholder(placeholders);
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const fetchToken = async () => {
            // Priority 1: Check for admin token in cookies
            const adminToken = getCookie('adminToken');
            if (adminToken) {
                setToken(adminToken);
                return;
            }

            // Priority 2: Check for existing session token
            if (token) return;

            // Priority 3: Fetch new guest token
            try {
                const res = await axios.post(guestAuth_api, {});
                if (res.data && res.data.data && res.data.data.token) {
                    const newToken = res.data.data.token;
                    setToken(newToken);
                    sessionStorage.setItem('chatToken', newToken);
                }
            } catch (err) {
                console.error("Failed to fetch guest token", err);
            }
        };
        fetchToken();
    }, [token]);

    const handleSend = async (text) => {
        const messageText = text || inputValue;
        if (!messageText.trim()) return;

        const newMessages = [...messages, { role: 'user', text: messageText }];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            // Force re-check token before sending to handle session updates
            const currentToken = getCookie('adminToken') || token;
            const headers = currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
            
            const res = await axios.post(chat_api, { message: messageText }, { headers });
            
            let botResponse = "I'm sorry, I'm having trouble connecting right now.";
            
            if (res.data && res.data.data) {
                botResponse = res.data.data;
            } else if (res.data && res.data.message) {
                botResponse = res.data.message;
            } else if (res.data && typeof res.data === 'string') {
                botResponse = res.data;
            }

            setMessages([...newMessages, { role: 'bot', text: botResponse }]);
        } catch (err) {
            console.error("Chat API error", err);
            setMessages([...newMessages, { role: 'bot', text: "Error: Could not reach the server." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* <Navbar /> */}

            <main className={styles.mainContent}>
                <div className={styles.chatContainer}>
                    <div className={styles.chatHeader}>
                        <button className={styles.backBtn} onClick={() => navigate(-1)}>
                            <FaArrowLeft /> <span>Exit Chat</span>
                        </button>
                        <div className={styles.botInfo}>
                            {/* <FaCommentDots className={styles.botIcon} /> */}
                            <img src={top_chat} alt="" />
                            <div>
                                <h2>TravelBot AI</h2>
                                <span>Always online and ready to help</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.messagesContainer} ref={containerRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`${styles.messageWrap} ${styles[msg.role]}`}>
                                {msg.role === 'bot' && (
                                    <div className={styles.botAvatar}>
                                        <img src={avatar} alt="avatar" />
                                    </div>
                                )}
                                <div className={styles.messageContent}>
                                    <div className={styles.bubble}>
                                        {msg.text}
                                    </div>
                                    <span className={styles.timestamp}>Just now</span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className={`${styles.messageWrap} ${styles.bot}`}>
                                <div className={styles.botAvatar}>
                                    <img src={chatbot} alt="avatar" />
                                </div>
                                <div className={styles.typing}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.quickOptions}>
                        <button onClick={() => handleSend('Tell me about flights')}>Flights</button>
                        <button onClick={() => handleSend('Show me hotels')}>Hotels</button>
                        <button onClick={() => handleSend('Holiday packages')}>Packages</button>
                        <button onClick={() => handleSend('Support')}>Support</button>
                    </div>

                    <div className={styles.inputSection}>
                        <input
                            type="text"
                            placeholder={animatedPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className={styles.sendBigBtn} onClick={() => handleSend()}>
                            <span>Send Message</span> <FaPaperPlane />
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ChatPage;
