import { displayWeather } from "./displayWeather.js";

const projectFilePath = './data/project.json';

const myKey = "d99d26ebf217dba0e5621d9674e8163b";



// ✅ Get coordinates from JSON
async function getCoordinates() {
  try {
    const response = await fetch(projectFilePath);

    if (!response.ok) {
      throw new Error("Failed to fetch coordinates");
    }

    const data = await response.json();
    return data.states;

  } catch (error) {
    console.log(error);
  }
}


// // ✅ Fetch forecast for ALL states
// async function fetchForecast() {
//   try {
//     const states = await getCoordinates(); // ✅ correct usage
 
//     for (const datum of states) {
//       const forecastUrl =
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${datum.lat}&lon=${datum.lon}&appid=${myKey}`;

//       const response2 = await fetch(forecastUrl);

//       if (!response2.ok) {
//         throw new Error(await response2.text());
//       }

//       const forecastData = await response2.json();
//       console.log(forecastData);
//     }

//   } catch (error) {
//     console.log(error);
//   }
// }


async function fetchAllCurrentWeather() {
  try {
    const states = await getCoordinates();

    for (const state of states) {
      const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${state.lat}&lon=${state.lon}&appid=${myKey}&units=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const weatherData = await response.json();

      console.log(weatherData);

        displayWeather(weatherData);
    }

  } catch (error) {
    console.log("Weather error:", error);
  }
}





// ✅ Run everything
fetchAllCurrentWeather();

