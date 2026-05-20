import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import PlaceGrid from '../Components/PlacesGrid'
import placesData from '../Data/data.json'
import classes from './SearchPage.module.css'
import { FiSearch } from "react-icons/fi";
import useTypingPlaceholder from "../utills/useTypingPlaceholder";

const placeholders = [
  "Search for more destinations...",
  "Looking for something else?",
  "Try 'Himachal Pradesh'",
  "Discover Kerala tours...",
  "Search adventure trips..."
];

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const navigate = useNavigate()
  const [localQuery, setLocalQuery] = useState('')
  const animatedPlaceholder = useTypingPlaceholder(placeholders);

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    const filtered = placesData.filter(place =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.state?.toLowerCase().includes(query.toLowerCase()) ||
      place.type?.toLowerCase().includes(query.toLowerCase()) ||
      place.desc?.toLowerCase().includes(query.toLowerCase())
    )

    setResults(filtered)
    setLoading(false)
  }, [query])

  if (loading) return <h2 className={classes.loading}>Searching...</h2>

  // Pick hero image (from first result or fallback)
  const heroImage = results[0]?.img1 || results[0]?.img || ''

  return (
    <>
      <Navbar />

      {/* 🔹 HERO SECTION */}
      {heroImage && (
        <div className={classes.hero}>
          <img src={heroImage} alt={query} />
          <div className={classes.heroOverlay}>
            <h1>Search Results</h1>
            <p>
              {results.length} places found for <span>"{query}"</span>
            </p>
            
            {/* Search Bar on Search Page */}
            <form 
              className={classes.mainSearchBox} 
              onSubmit={(e) => {
                e.preventDefault();
                if(localQuery.trim()) navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
              }}
            >
              <input 
                type="text" 
                placeholder={animatedPlaceholder} 
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
              <FiSearch className={classes.mainSearchIcon} />
            </form>
          </div>
        </div>
      )}

      {/* 🔹 RESULTS */}
      <div className={classes.resultsWrapper}>
        {results.length > 0 ? (
          <PlaceGrid places={results} />
        ) : (
          <div className={classes.emptyState}>
  <div className={classes.emptyCard}>
    <span className={classes.emptyIcon}>🧭</span>
    <h2>No places found</h2>
    <p>
      We couldn’t find any destinations for{" "}
      <span>"{query}"</span>
    </p>
    <p className={classes.emptyHint}>
      Try searching for beaches, hill stations, or cities
    </p>
  </div>
</div>
        )}
      </div>
    </>
  )
}

export default Search
