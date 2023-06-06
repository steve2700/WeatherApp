const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);

const apiKey = '5ec5845a9b7c8e9451636b9e096d36ab'; 

function setQuery(evt) {
  if (evt.keyCode === 13) {
    getResults(searchBox.value);
  }
}

function getResults(query) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`)
    .then(weather => {
      return weather.json();
    }).then(displayResults)
    .catch(err => {
      console.log(err);
      alert('Error retrieving weather data. Please try again later.');
    });
}

function displayResults(weather) {
  const city = document.querySelector('.city');
  city.textContent = `${weather.name}, ${weather.sys.country}`;

  const now = new Date();
  const date = document.querySelector('.date');
  date.textContent = dateBuilder(now);

  const temp = document.querySelector('.temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  const weatherIcon = document.querySelector('.wi');
  weatherIcon.className = `wi wi-owm-${weather.weather[0].id}`;

  const weatherDescription = document.querySelector('.weather');
  weatherDescription.textContent = weather.weather[0].main;

  const hiLow = document.querySelector('.hi-low');
  hiLow.textContent = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  getUVIndex(weather.coord.lat, weather.coord.lon);
  getPollenCount(weather.coord.lat, weather.coord.lon);
  getAirQualityIndex(weather.coord.lat, weather.coord.lon);
  getTravelWeather(weather.name);
  getForecast(weather.coord.lat, weather.coord.lon);
}

function dateBuilder(d) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

function getUVIndex(latitude, longitude) {
  const apiKey = 'openuv-7rumrlikq72ku-io';
  const url = `https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`;

  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': apiKey
    }
  })
  .then(response => response.json())
  .then(data => {
    // Handle the UV index data here
    console.log('UV Index Data:', data);
  })
  .catch(error => {
    // Handle any errors
    console.error('Error:', error);
  });
}

function getPollenCount(lat, lon) {
  // Implement your code to get the pollen count for the given latitude and longitude
  // You can use an API or any other method to get the pollen count data
}

function getAirQualityIndex(lat, lon) {
  // Implement your code to get the air quality index for the given latitude and longitude
  // You can use an API or any other method to get the air quality index data
}

function getTravelWeather(city) {
  // Implement your code to get the travel weather for the given city
  // You can use an API or any other method to get the travel weather data
}

function getForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`)
    .then(forecast => {
      return forecast.json();
    }).then(displayForecast)
    .catch(err => {
      console.log(err);
      alert('Error retrieving forecast data. Please try again later.');
    });
}

function displayForecast(forecast) {
  const forecastContainer = document.querySelector('.forecast');
  forecastContainer.innerHTML = '';

  for (let i = 1; i < 6; i++) {
    const day = forecast.daily[i];
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('day');

    const dayName = document.createElement('div');
    dayName.classList.add('day-name');
    dayName.textContent = getDayName(day.dt);

    const dayTemp = document.createElement('div');
    dayTemp.classList.add('day-temp');
    dayTemp.innerHTML = `${Math.round(day.temp.min)}°c / ${Math.round(day.temp.max)}°c`;

    forecastElement.appendChild(dayName);
    forecastElement.appendChild(dayTemp);
    forecastContainer.appendChild(forecastElement);
  }
}

function getDayName(timestamp) {
  const date = new Date(timestamp * 1000);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}
