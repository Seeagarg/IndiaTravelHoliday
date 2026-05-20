import React, { useEffect, useState } from "react";
import classes from "./Contact.module.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { contact_api } from "../Services/Api";

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const [toast, setToast] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                name: formState.name,
                email: formState.email,
                mobileNumber: formState.phone,
                message: formState.message
            };
            
            const response = await axios.post(contact_api, dataToSend);
            
            if (response.status === 200 || response.status === 201) {
                setToast(true);
                setTimeout(() => setToast(false), 3000);
                setFormState({
                    name: "",
                    email: "",
                    phone: "",
                    message: ""
                });
            }
        } catch (error) {
            console.error("Error sending query:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className={classes.contactPage}>
            <Navbar />

            {/* HERO SECTION */}
            <section className={classes.hero}>
                <div className={classes.heroContent}>
                    <h1>Contact Our Travel Experts</h1>
                    <p>Ready for your next adventure? Send us a message today.</p>
                </div>
            </section>

            <div className={classes.container}>
                {/* INFO SIDE */}
                <div className={classes.infoSide}>
                    <div className={classes.card}>
                        <div className={classes.iconBox}><FaPhoneAlt /></div>
                        <div className={classes.cardContent}>
                            <h3>Call Us</h3>
                            <p><a href="tel:+918894450020">+91 88944 50020</a></p>
                        </div>
                    </div>

                    <div className={classes.card}>
                        <div className={classes.iconBox}><FaEnvelope /></div>
                        <div className={classes.cardContent}>
                            <h3>Email Us</h3>
                            <p><a href="mailto:Support@indiatravelholiday.com">Support@indiatravelholiday.com</a></p>
                        </div>
                    </div>

                    <div className={classes.card}>
                        <div className={classes.iconBox}><FaWhatsapp /></div>
                        <div className={classes.cardContent}>
                            <h3>WhatsApp</h3>
                            <p><a href="https://wa.me/918894450020" target="_blank" rel="noreferrer">Quick Support</a></p>
                        </div>
                    </div>
                </div>

                {/* FORM SIDE */}
                <div className={classes.formSide}>
                    <h2>Send a Message</h2>
                    <p>Please fill all details correctly.</p>

                    <form onSubmit={handleSubmit} autoComplete="on">
                        <div className={classes.formGroup}>
                            <label htmlFor="name-input">Full Name</label>
                            <input
                                id="name-input"
                                type="text"
                                name="name"
                                placeholder="Your full name here"
                                value={formState.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className={classes.formGroup} style={{ flex: 1 }}>
                                <label htmlFor="email-input">Email</label>
                                <input
                                    id="email-input"
                                    type="email"
                                    name="email"
                                    placeholder="example@domain.com"
                                    value={formState.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={classes.formGroup} style={{ flex: 1 }}>
                                <label htmlFor="phone-input">Mobile Number</label>
                                <input
                                    id="phone-input"
                                    type="tel"
                                    name="phone"
                                    placeholder="+91 00000 00000"
                                    value={formState.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={classes.formGroup}>
                            <label htmlFor="message-input">Your Query</label>
                            <textarea
                                id="message-input"
                                rows="5"
                                name="message"
                                placeholder="Let us know what you are looking for..."
                                value={formState.message}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className={classes.submitBtn} disabled={toast}>
                            {toast ? "Sent Successfully" : "Send Query"}
                        </button>
                    </form>
                </div>
            </div>

            {toast && (
                <div className={classes.toastNotification}>
                    <span>✔</span> query sent
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Contact;
