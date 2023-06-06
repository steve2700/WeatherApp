const api = {
  key: "5ec5845a9b7c8e9451636b9e096d36ab",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

// Get weather data based on the search query
function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

// Fetch weather data from the OpenWeatherMap API
function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    })
    .then(displayResults)
    .catch(() => {
      showError();
    });

  fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
    .then(forecast => {
      return forecast.json();
    })
    .then(displayForecast)
    .catch(() => {
      showError();
    });
}

// Display the current weather data
function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

  let weatherIcon = document.querySelector('.current .weather i');
  weatherIcon.className = `wi ${getWeatherIcon(weather.weather[0].id)}`;

  let weatherDescription = document.querySelector('.current .weather');
  weatherDescription.innerText = weather.weather[0].description;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
}

// Display the forecast for the upcoming days
function displayForecast(forecast) {
  let forecastDiv = document.querySelector('.forecast');
  forecastDiv.innerHTML = '';

  for (let i = 0; i < forecast.list.length; i += 8) {
    let forecastData = forecast.list[i];

    let forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');

    let forecastDate = document.createElement('div');
    forecastDate.classList.add('forecast-date');
    forecastDate.innerText = formatDate(forecastData.dt_txt);

    let forecastIcon = document.createElement('i');
    forecastIcon.className = `wi ${getWeatherIcon(forecastData.weather[0].id)}`;

    let forecastTemp = document.createElement('div');
    forecastTemp.classList.add('forecast-temp');
    forecastTemp.innerHTML = `${Math.round(forecastData.main.temp)}<span>°C</span>`;

    forecastItem.appendChild(forecastDate);
    forecastItem.appendChild(forecastIcon);
    forecastItem.appendChild(forecastTemp);

    forecastDiv.appendChild(forecastItem);
  }
}

// Get the appropriate weather icon based on weather condition code
function getWeatherIcon(conditionCode) {
  // Here, you can map condition codes to specific weather icons from the Weather Icons library
  // Example mapping:
  // Thunderstorm: 200-299
  // Drizzle: 300-399
  // Rain: 500-599
  // ...
  // Update this mapping according to your requirements
  // You can find the full list of condition codes at https://openweathermap.org/weather-conditions
  return 'wi-day-sunny'; // Default to sunny weather icon
}

// Format the date to a desired format (e.g., DD/MM/YYYY)
function formatDate(date) {
  let formattedDate = new Date(date);
  return formattedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Show error message when the API request fails
function showError() {
  let city = document.querySelector('.location .city');
  city.innerText = 'Error fetching data';

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = '';

  let weatherDescription = document.querySelector('.current .weather');
  weatherDescription.innerText = '';

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = '';
}

// Get the user's geolocation and display the weather for that location
function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)
        .then(weather => {
          return weather.json();
        })
        .then(displayResults)
        .catch(() => {
          showError();
        });

      fetch(`${api.base}forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)
        .then(forecast => {
          return forecast.json();
        })
        .then(displayForecast)
        .catch(() => {
          showError();
        });
    });
  } else {
    showError();
  }
}

// Initialize the application
function init() {
  getGeolocation();
}

init();
