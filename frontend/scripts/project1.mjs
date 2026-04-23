import { selectState } from "./displayWeather.js";

const stateSelect = document.querySelector('#state');
let allWeatherData = [];
let hasLoaded = false; // GATEKEEPER - prevent double fetch

// Event listener runs ONCE when page loads
stateSelect.addEventListener('change', (e) => {
  if (allWeatherData.length > 0) {
    selectState(allWeatherData, e.target.value);
  }
});

async function getStateNames() {
  const response = await fetch('./data/project.json');
  if (!response.ok) throw new Error("Failed to fetch states");
  const data = await response.json();
  return data.states;
}

async function fetchAllCurrentWeather() {
  // GATEKEEPER: If already loaded, don't run again
  if (hasLoaded) {
    console.log('Already loaded. Skipping fetch.');
    return;
  }
  hasLoaded = true;

  try {
    const states = await getStateNames();
    console.log('Loading weather ONCE for 36 states...');

    const weatherPromises = states.map(async (state) => {
      const url = `http://localhost:3000/api/weather/${encodeURIComponent(state.name)}`;
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`Failed for ${state.name}`);
        return null; // Skip failed states
      }

      const result = await response.json();
      const weather = result.data;
      weather.state_name = state.name;
      weather.source = result.source;
      return weather;
    });

    const results = await Promise.all(weatherPromises);
    allWeatherData = results.filter(w => w!== null); // Remove failed ones
    console.log('DONE! Loaded:', allWeatherData.length, 'states. Ready!');

  } catch (error) {
    console.log("Weather error:", error);
    hasLoaded = false; // Allow retry if error
  }
}

// RUNS ONCE ON PAGE LOAD ONLY
fetchAllCurrentWeather();