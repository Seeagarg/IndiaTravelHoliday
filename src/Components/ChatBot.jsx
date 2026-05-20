import React, { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaExpandAlt, FaEllipsisH, FaPlane, FaHotel, FaMapMarkedAlt, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './ChatBot.module.css';
import useTypingPlaceholder from '../utills/useTypingPlaceholder';
import avatar from '../assets/avatar.png';
import chatbot from '../assets/chatbot.png';
import axios from 'axios';
import { guestAuth_api, chat_api } from '../Services/Api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! How can I assist you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem('chatToken') || '');
    const navigate = useNavigate();

    const placeholders = [
        "Type your message...",
        "Looking for flights?",
        "Need a hotel?",
        "Ask about Rajasthan...",
        "Adventure trips in Himachal?"
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
            if (token) return;
            try {
                const res = await axios.post(guestAuth_api);
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
            // Prepare headers if token exists
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const res = await axios.post(chat_api, { message: messageText }, { headers });
            
            let botResponse = "I'm sorry, I'm having trouble connecting right now.";
            
            // Assume the API returns the response in res.data.data or res.data.message
            if (res.data && res.data.data) {
                botResponse = res.data.data;
            } else if (res.data && res.data.message) {
                botResponse = res.data.message;
            } else if (typeof res.data === 'string') {
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

    const toggleFullPage = () => {
        navigate('/chat-ai');
        setIsOpen(false);
    };

    return (
        <div className={styles.chatbotWrapper}>
            {/* Launcher */}
            {!isOpen && (
                <div className={styles.launcher} onClick={() => setIsOpen(true)}>
                    <div className={styles.launcherIcon}>
                        <img src={chatbot} alt="bot" />
                    </div>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.header}>
                        <div className={styles.titleInfo}>
                            <div className={styles.headerDot}></div>
                            <FaCommentDots className={styles.botIcon} />
                            <h3>TravelBot</h3>
                        </div>
                        <div className={styles.headerActions}>
                            <FaExpandAlt className={styles.actionIcon} onClick={toggleFullPage} title="Open in Full Page" />
                            <FaEllipsisH className={styles.actionIcon} />
                            <FaTimes className={styles.actionIcon} onClick={() => setIsOpen(false)} />
                        </div>
                    </div>

                    <div className={styles.messagesArea} ref={containerRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`${styles.messageWrap} ${styles[msg.role]}`}>
                                {msg.role === 'bot' && (
                                    <div className={styles.botAvatar}>
                                        <img src={avatar} alt="avatar" />
                                    </div>
                                )}
                                <div className={styles.messageBubble}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {messages.length === 1 && !isTyping && (
                            <div className={styles.optionsGrid}>
                                <button className={styles.optionBtn} onClick={() => handleSend('Find Flights')}>
                                    <FaPlane className={styles.optionIcon} /> Find Flights
                                </button>
                                <button className={styles.optionBtn} onClick={() => handleSend('Book a Hotel')}>
                                    <FaHotel className={styles.optionIcon} /> Book a Hotel
                                </button>
                                <button className={styles.optionBtn} onClick={() => handleSend('Vacation Packages')}>
                                    <FaMapMarkedAlt className={styles.optionIcon} /> Vacation Packages
                                </button>
                                <button className={styles.optionBtn} onClick={() => handleSend('Ask a Question')}>
                                    <FaQuestionCircle className={styles.optionIcon} /> Ask a Question
                                </button>
                            </div>
                        )}

                        {isTyping && (
                            <div className={`${styles.messageWrap} ${styles.bot}`}>
                                <div className={styles.botAvatar}>
                                    <img src={chatbot} alt="avatar" />
                                </div>
                                <div className={styles.typingIndicator}>
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            placeholder={animatedPlaceholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className={styles.sendBtn} onClick={() => handleSend()}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
