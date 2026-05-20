import React from "react";
import classes from "./PlaceDetail.module.css";
import Hero from "../Components/TourDetailComponents/Hero";
import FAQ from "../Components/TourDetailComponents/FAQ";
import ItineraryTabs from "../Components/TourDetailComponents/ItineraryTabs";
import Gallery from "../Components/TourDetailComponents/Gallery";
import ReviewsSection from "../Components/TourDetailComponents/ReviewsSection.module";
import PackageDetails from "../Components/TourDetailComponents/PackageDetails";
import TourNavbar from "../Components/TourDetailComponents/TourNavbar";
import WhyTravelo from "../Components/TourDetailComponents/WhyTravelo";
import Footer from "../Components/Footer";

const PlaceDetail = ({ tour }) => {
  if (!tour) return null;

  return (
    <div>
      <TourNavbar tour={tour} />

      <Gallery images={tour.images} />
      <Hero tour={tour} />
      <ItineraryTabs tour={tour} />
      <ReviewsSection tour={tour} />
      <WhyTravelo tour={tour} />
      <FAQ tour={tour} />
      <PackageDetails tour={tour} />
      <Footer />
    </div>
  );
};

export default PlaceDetail;
