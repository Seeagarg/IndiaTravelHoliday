import { useEffect } from 'react'
import Routing from './Routing/Routing'
import './App.css'

function App() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // observer.unobserve(entry.target); // optional: stop observing once revealed
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const revealElements = document.querySelectorAll('.reveal');
    
    // We need to re-scan for reveal elements because they might be loaded dynamically
    const observerInterval = setInterval(() => {
      const currentReveals = document.querySelectorAll('.reveal:not(.active)');
      currentReveals.forEach((el) => observer.observe(el));
    }, 1000);

    return () => {
      observer.disconnect();
      clearInterval(observerInterval);
    };
  }, []);

  return <Routing />
}

export default App
