
const section = document.querySelector('.section');
const stateSelect = document.querySelector('#state');

export function displayWeather(data) {
    // populate the currentWeather
    const div = document.createElement('div');
    const stateName = document.createElement('h2');
    const description=document.createElement('p');
    const temp=document.createElement('p');
    const high=document.createElement('p');
    const low=document.createElement('p');
    const humidity=document.createElement('p');
    const sunrise=document.createElement('p');
    const sunset=document.createElement('p');


    const image=document.createElement('img');
      
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    image.setAttribute('SRC', iconsrc);
    image.setAttribute('alt', data.weather[0].description );
    image.setAttribute('loading', 'lazy');



    stateName.innerHTML=data.name;
    description.innerHTML=`Description: ${data.weather[0].description}`;
    temp.innerHTML=`Temperature: ${data.main.temp}°C`;
    high.innerHTML=`High: ${data.main.temp_max}°C`;
    low.innerHTML=`Low: ${data.main.temp_min}°C`;
    humidity.innerHTML=`Humidity: ${data.main.humidity}%`;
    sunrise.innerHTML=`Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    sunset.innerHTML=`Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;


    div.appendChild(stateName);
    div.appendChild(image);
    div.appendChild(description);
    div.appendChild(temp);
    div.appendChild(high);
    div.appendChild(low);
    div.appendChild(humidity);
    div.appendChild(sunrise);
    div.appendChild(sunset);
  
    section.appendChild(div); 
}





    


