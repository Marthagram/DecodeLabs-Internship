import { selectState } from "./displayWeather.js";

const projectFilePath = './data/project.json';
const myKey = "d99d26ebf217dba0e5621d9674e8163b";
const stateSelect = document.querySelector('#state');

let allWeatherData = []; // 1. Make an empty array to store all 36 results

// Get coordinates from JSON
async function getCoordinates() {
  const response = await fetch(projectFilePath);
  if (!response.ok) throw new Error("Failed to fetch coordinates");
  const data = await response.json();
  return data.states;
}

// Fetch weather for ALL states, then set up dropdown ONCE
async function fetchAllCurrentWeather() {
  try {
    const states = await getCoordinates();
    
    // 2. Use Promise.all so all 36 fetches run at same time, faster
    const weatherPromises = states.map(async (state) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${state.lat}&lon=${state.lon}&appid=${myKey}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(await response.text());
      return await response.json(); // return the weather for this state
    });

    allWeatherData = await Promise.all(weatherPromises); // 3. Wait for all 36 to finish
    console.log('All weather loaded:', allWeatherData);
    allWeatherData.forEach((weather, index) => {
      weather.name = states[index].name;
    });

    // 4. Add the event listener ONCE, after data is ready
    stateSelect.addEventListener('change', () => {
      selectState(allWeatherData); // now this array actually exists
    });

  } catch (error) {
    console.log("Weather error:", error);
  }
}

fetchAllCurrentWeather(); // 5. Start everything





