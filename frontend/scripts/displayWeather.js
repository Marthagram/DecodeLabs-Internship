const section = document.querySelector('section'); 

function displayWeather(data) {
  section.innerHTML = ''; 

  const div = document.createElement('div');
  const stateName = document.createElement('h2');
  const description = document.createElement('p');
  const temp = document.createElement('p');
  const high = document.createElement('p');
  const low = document.createElement('p');
  const humidity = document.createElement('p');
  const sunrise = document.createElement('p');
  const sunset = document.createElement('p');
  const image = document.createElement('img');
  const cacheStatus = document.createElement('p');

  image.setAttribute('src', data.icon_url);
  image.setAttribute('alt', data.description);
  image.setAttribute('loading', 'lazy');

  stateName.innerHTML = data.state_name;
  description.innerHTML = `Description: ${data.description}`;
  temp.innerHTML = `Temperature: ${data.temperature}°C`;
  high.innerHTML = `High: ${data.temp_max}°C`;
  low.innerHTML = `Low: ${data.temp_min}°C`;
  humidity.innerHTML = `Humidity: ${data.humidity}%`;
  sunrise.innerHTML = `Sunrise: ${new Date(data.sunrise * 1000).toLocaleTimeString()}`;
  sunset.innerHTML = `Sunset: ${new Date(data.sunset * 1000).toLocaleTimeString()}`;
  
  cacheStatus.innerHTML = `Source: ${data.source} | Updated: ${new Date(data.fetched_at).toLocaleTimeString()}`;
  cacheStatus.style.fontSize = '12px';
  cacheStatus.style.color = 'gray';

  div.append(stateName, image, description, temp, high, low, humidity, sunrise, sunset, cacheStatus);
  section.appendChild(div); 
}

// FIXED: Accept the state name as parameter
export function selectState(data, selectedStateName) {
  const select = data.find(item => item.state_name === selectedStateName);
  if (select) {
    displayWeather(select);
  } else {
    console.log('State not found:', selectedStateName);
  }
}