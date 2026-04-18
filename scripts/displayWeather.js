
const section = document.querySelector('.section');
const stateSelect = document.querySelector('#state');

function displayWeather(data) {

  

       section.innerHTML = ''; // Wipe the section clean before adding new stuff
    
    // ... rest of your code creating div, h2, p tags


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

      


export function selectState(data) {
    const select = data.find((item) => {
        if (item.name === stateSelect.value) {
            return true;  // tell find "this is the one"
        }
        // no else needed - if it doesn't match, keep looking
    });
    
    if (select) {  // check if we actually found something
        displayWeather(select);
    }
    else {
        console.log("State not found in data:", stateSelect.value);
    }   
}







    


