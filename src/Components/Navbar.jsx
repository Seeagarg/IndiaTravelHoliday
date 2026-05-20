import { useEffect, useRef, useState } from "react";
import classes from "./Navbar.module.css";
import logoImg from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useTypingPlaceholder from "../utills/useTypingPlaceholder";
import { FiSearch, FiPhone, FiMenu } from "react-icons/fi";

const placeholders = [
  "Where do you want to go?",
  "Search for Kashmir...",
  "Discover Udaipur...",
  "Find the perfect Kerala trip...",
  "Explore Royal Rajasthan...",
  "Best beaches in Goa?"
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const animatedPlaceholder = useTypingPlaceholder(placeholders, 100, 50, 2000);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Early Bird Offer", to: "/early-bird" },
    { label: "Upcoming Trips", to: "/trips" },
    // { label: "Corporate Tours", to: "/corporate" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchQuery("");
  };

  return (
    <>
      <nav
        className={`${classes.navbar} ${isScrolled ? classes.scrolled : ""} ${
          !isVisible ? classes.hidden : ""
        }`}
      >
        {/* LEFT LOGO */}
        <Link to="/" className={classes.logo} aria-label="India Travel Holiday home">
          <img src={logoImg} alt="India Travel Holiday logo" className={classes.logoImg} />
          <span className={classes.logoText}>India Travel Holiday</span>
        </Link>

        <form className={classes.searchBox} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={animatedPlaceholder}
            aria-label="Search destinations"
          />
          <FiSearch className={classes.searchIcon} />
        </form>

        {/* RIGHT SIDE */}
        <div className={classes.right}>
          <ul className={classes.navLinks}>
            {navItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={classes.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={classes.callBox}>
            <span aria-hidden="true">📞</span>
            <a href="tel:+919090403075">+91-9876128779</a>
          </div>

          <button
            type="button"
            className={classes.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={classes.hamburger} />
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className={classes.mobileMenuOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={classes.mobileMenuPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <ul className={classes.mobileNavLinks}>
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={classes.mobileNavLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={classes.mobileCallBox}>
              <span aria-hidden="true">📞</span>
              <a href="tel:+919090403075">+91-9876128779</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
