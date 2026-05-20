import React, { useState, useRef } from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import Footer from '../Components/Footer'
import Places from '../Components/Places'
import IndiaTabs from '../Components/IndiaTabs'
import LogoMarquee from '../Components/LogoSlider'
import OfferBanner from '../Components/OfferBanner'
import JourneyFrames from '../Components/JourneyFrames'
import HomeReviews from '../Components/HomeReviews'
import CallbackSection from '../Components/CallbackSection'


const Home = () => {

  const [selectedTab, setSelectedTab] = useState('explore')


  const placesRef = useRef(null)

  // useEffect(() => {
  //   // Skip scrolling on first load
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false
  //     return
  //   }

  //   if (placesRef.current) {
  //     placesRef.current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     })
  //   }
  // }, [type])



  const handleTypeChange = () => {
    // scroll ONLY on click
    setTimeout(() => {
      placesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }




  return (
    <div>
      <Navbar />

      <HeroSection onTypeSelect={handleTypeChange} />

      <section className="section-white">
        <div className="container-wide reveal reveal-up component-card">
          <IndiaTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
      </section>

      <section ref={placesRef} className="section-gray">
        <div className="container-wide reveal reveal-up delay-200">
          <Places
            selectedTab={selectedTab}
            limit={3}
          />
        </div>
      </section>

      <section className="section-white">
        <div className="container-wide reveal reveal-up">
          <OfferBanner />
        </div>
      </section>

      <section className="section-dark">
        <div className="container-wide reveal reveal-scale delay-100">
          <JourneyFrames />
        </div>
      </section>

      <section className="section-gray">
        <div className="container-wide reveal reveal-up">
          <HomeReviews />
        </div>
      </section>

      <section className="section-white">
        <div className="container-wide reveal reveal-down">
          <LogoMarquee />
        </div>
      </section>

      <section className="section-dark">
        <div className="container-wide reveal reveal-up">
          <CallbackSection />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home
