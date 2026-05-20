const fs = require('fs');
const axios = require('axios');
const path = require('path');

const BASE_URL = 'http://164.52.215.8:9373';
const DATA_DIR = path.join(__dirname, 'src', 'Data');

async function fetchAndSaveData() {
  console.log('Fetching destinations...');
  
  // 1. Fetch destinations
  let destinations = [];
  try {
    const destRes = await axios.get(`${BASE_URL}/api/destinations`);
    if (destRes.data && destRes.data.data) {
      destinations = destRes.data.data;
      fs.writeFileSync(
        path.join(DATA_DIR, 'destinations.json'), 
        JSON.stringify(destRes.data, null, 2)
      );
      console.log(`Saved ${destinations.length} destinations.`);
    }
  } catch (err) {
    console.error('Error fetching destinations:', err.message);
    // If it fails, we try to load existing ones to continue
    try {
      const existing = require('./src/Data/destinations.json');
      destinations = existing.data;
    } catch (e) {
      console.log('No existing destinations.json found.');
    }
  }

  // 2. Load existing tours data to merge
  let allTours = {};
  const toursFilePath = path.join(DATA_DIR, 'tours_test.json');
  try {
    if (fs.existsSync(toursFilePath)) {
      const existing = JSON.parse(fs.readFileSync(toursFilePath, 'utf8'));
      // If the old format was just a single response (like destId 1)
      if (existing.status && existing.data && Array.isArray(existing.data.content)) {
        console.log('Migrating old tours_test.json format...');
        allTours['1'] = existing; // assume destId 1 for the old format
      } else {
        // Assume it's already in the { destId: response } format
        allTours = existing;
      }
    }
  } catch (err) {
    console.error('Error reading existing tours_test.json:', err.message);
  }

  // 3. Fetch tours for each destination
  for (const dest of destinations) {
    console.log(`Fetching tours for destination ${dest.name} (ID: ${dest.id})...`);
    try {
      const toursRes = await axios.get(`${BASE_URL}/api/destinations/${dest.id}/tours?page=0&size=12`);
      if (toursRes.data && toursRes.data.data && toursRes.data.data.content) {
        
        // Merge with existing data if needed. 
        // We will prefer the newly fetched data but keep the previous data structure.
        let newContent = toursRes.data.data.content;
        let mergedContent = [];
        
        if (allTours[dest.id] && allTours[dest.id].data && allTours[dest.id].data.content) {
            let oldContent = allTours[dest.id].data.content;
            
            // Map to merge by tourId
            let tourMap = new Map();
            oldContent.forEach(t => tourMap.set(t.tourId, t));
            newContent.forEach(t => tourMap.set(t.tourId, t)); // overwrite with new
            
            mergedContent = Array.from(tourMap.values());
        } else {
            mergedContent = newContent;
        }

        // Update the response object with merged content
        toursRes.data.data.content = mergedContent;
        toursRes.data.data.totalElements = mergedContent.length;
        toursRes.data.data.size = Math.max(toursRes.data.data.size, mergedContent.length);
        
        allTours[dest.id] = toursRes.data;
        console.log(`Saved ${mergedContent.length} tours for ${dest.name}.`);
      }
    } catch (err) {
      console.error(`Error fetching tours for destination ${dest.id}:`, err.message);
    }
  }

  // 4. Save merged tours back to tours_test.json
  fs.writeFileSync(toursFilePath, JSON.stringify(allTours, null, 2));
  console.log('Finished updating tours_test.json');

  // 5. Fetch full details and reviews for each tour
  console.log('Fetching tour details and reviews...');
  let tourDetailsMap = {};
  const tourDetailsPath = path.join(DATA_DIR, 'tour_details.json');
  try {
    if (fs.existsSync(tourDetailsPath)) {
      tourDetailsMap = JSON.parse(fs.readFileSync(tourDetailsPath, 'utf8'));
    }
  } catch (err) {}

  for (const destId of Object.keys(allTours)) {
    const tours = allTours[destId].data?.content || [];
    for (const tour of tours) {
      if (!tour.slug) continue;
      
      try {
        console.log(`Fetching details for tour slug: ${tour.slug}...`);
        const detailRes = await axios.get(`${BASE_URL}/api/tours/${tour.slug}`);
        if (detailRes.data && detailRes.data.data) {
          let tourData = detailRes.data.data;
          
          // Also fetch reviews
          const tourId = tourData.id || tourData._id || tourData.tourId || tour.tourId;
          if (tourId) {
            try {
              const reviewsRes = await axios.get(`${BASE_URL}/api/tours/${tourId}/reviews`);
              if (reviewsRes.data && reviewsRes.data.status === 200) {
                 const rawReviews = Array.isArray(reviewsRes.data.data) ? reviewsRes.data.data : (Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
                 tourData.fetchedReviews = rawReviews;
              }
            } catch (err) {
               console.log(`Could not fetch reviews for tour ${tourId}`);
            }
          }
          
          tourDetailsMap[tour.slug] = tourData;
        }
      } catch (err) {
        console.error(`Error fetching details for slug ${tour.slug}:`, err.message);
      }
    }
  }
  
  fs.writeFileSync(tourDetailsPath, JSON.stringify(tourDetailsMap, null, 2));
  console.log('Finished updating tour_details.json');
}

fetchAndSaveData();
