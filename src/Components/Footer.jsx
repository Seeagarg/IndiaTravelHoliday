import React from "react";
import classes from "./Footer.module.css";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import FooterImg from '../assets/Footer.png'

const Footer = () => {
  return (
    <>
      <div className={classes.contactWrapper} >
        <div className={classes.contactStrip}>
          <div className={classes.contactLeft}>
            <div className={classes.whatsappIcon}>
              <FaWhatsapp />
            </div>
            <div>
              <p>Don't wait any longer, Contact us!</p>
              <h2>+91 9876128779</h2>
            </div>
          </div>

          <div className={classes.contactRight}>
            <p>Be part of our Social Media Journey!</p>
            <div className={classes.contactSocials}>
              <FaInstagram />
              <FaYoutube />
              <FaFacebookF />
              {/* <FaXTwitter /> */}
              <FaLinkedinIn />
            </div>
          </div>
        </div>
      </div>
      <footer className={classes.footer}>
        {/* Wave Divider */}
        <div className={classes.wave}></div>

        <div className={classes.container}>
          <div className={classes.grid}>

            {/* Brand Section */}
            <div className={classes.brand}>
              <h2>India Travel Holiday</h2>
              <p>
                Explore breathtaking destinations, curated experiences, and
                unforgettable journeys across India.
              </p>
            </div>

            <div className={classes.linksWrapper}>

              <div className={classes.linksBox}>
                <h3>Quick Links</h3>
                <ul>
                  <li onClick={() => window.location.href = '/'}>Home</li>
                  <li onClick={() => window.location.href = '/trips'}>Destinations</li>
                  <li onClick={() => window.location.href = '/about'}>About Us</li>
                  <li onClick={() => window.location.href = '/contact'}>Contact Us</li>
                  <li onClick={() => window.location.href = '/admin'} style={{ color: '#ff8a00', fontWeight: 'bold' }}>Admin Dashboard</li>
                </ul>
              </div>

              <div className={classes.linksBox}>
                <h3>Support</h3>
                <ul>
                  <li>FAQs</li>
                  <li>Privacy Policy</li>
                  <li>Terms & Conditions</li>
                </ul>
              </div>

            </div>

            {/* Social */}
            <div>
              <h3>Follow Us</h3>
              <div className={classes.socials}>
                <FaFacebookF />
                <FaInstagram />
                <FaYoutube />
                <FaLinkedinIn />
              </div>
            </div>

          </div>
          <div className={classes.img_div} >
            <img src={FooterImg} alt='Footer' className={classes.img} />
          </div>

          <div className={classes.bottom}>
            © {new Date().getFullYear()} India Travel Holiday. All rights reserved.
          </div>
        </div>
      </footer>
    </>

  );
};

export default Footer;
