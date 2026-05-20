import React, { useState } from "react";
import styles from "./CallbackSection.module.css";
import heroImg from "../assets/contact.webp";
import { FiUser, FiMail, FiPhone, FiMessageCircle, FiSend } from "react-icons/fi";
import axios from "axios";
import { contact_api } from "../Services/Api";

const CallbackSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [toast, setToast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        name: form.name,
        email: form.email,
        mobileNumber: form.phone,
        message: form.message
      };

      const response = await axios.post(contact_api, dataToSend);

      if (response.status === 200 || response.status === 201) {
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        setForm({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      }
    } catch (error) {
      console.error("Error sending callback request:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.headerArea}>
        <h2>Reach Out to Us</h2>
        <p>Every unforgettable adventure begins with a conversation.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.Form_container}>
          <div className={styles.left}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2>
                  We Provide <br />
                  <span>Only the Best Tours</span>
                </h2>
                <p className={styles.subHeading}>Fill out the form and our travel experts will get in touch shortly.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <FiPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <FiMessageCircle className={`${styles.inputIcon} ${styles.textareaIcon}`} />
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={toast}>
                  <span>{toast ? "Sent Successfully" : "Send Message"}</span>
                  {!toast && <FiSend />}
                </button>
              </form>
            </div>
          </div>

          {toast && (
            <div className={styles.toast}>
              <div className={styles.toastIcon}>✔</div>
              <span>query sent</span>
            </div>
          )}

        {/* RIGHT IMAGE */}
        <div className={styles.right}>
          <img src={heroImg} alt="travel support" />
        </div>
</div>
      </div>
    </section>
  );
};

export default CallbackSection;
