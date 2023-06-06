const api = {
  key: "5ec5845a9b7c8e9451636b9e096d36ab",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => weather.json())
    .then(displayResults)
    .catch(showError);

  fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
    .then(forecast => forecast.json())
    .then(displayForecast)
    .catch(showError);
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.textContent = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.textContent = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

  let weatherIcon = document.querySelector('.current .weather i');
  weatherIcon.className = `wi ${getWeatherIcon(weather.weather[0].id)}`;

  let weatherDescription = document.querySelector('.current .weather');
  weatherDescription.textContent = weather.weather[0].description;

  let hilow = document.querySelector('.hi-low');
  hilow.textContent = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
}

function displayForecast(forecast) {
  let forecastDiv = document.querySelector('.forecast');
  forecastDiv.innerHTML = '';

  for (let i = 0; i < forecast.list.length; i += 8) {
    let forecastData = forecast.list[i];

    let forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');

    let forecastDate = document.createElement('div');
    forecastDate.classList.add('forecast-date');
    forecastDate.textContent = formatDate(forecastData.dt_txt);
    forecastItem.appendChild(forecastDate);

    let forecastIcon = document.createElement('i');
    forecastIcon.className = `wi ${getWeatherIcon(forecastData.weather[0].id)}`;
    forecastItem.appendChild(forecastIcon);

    let forecastTemp = document.createElement('div');
    forecastTemp.classList.add('forecast-temp');
    forecastTemp.innerHTML = `${Math.round(forecastData.main.temp)}<span>°C</span>`;
    forecastItem.appendChild(forecastTemp);

    forecastDiv.appendChild(forecastItem);
  }
}

function formatDate(dateString) {
  let date = new Date(dateString);
  let options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

function getWeatherIcon(conditionCode) {
  switch (true) {
    case conditionCode >= 200 && conditionCode <= 232:
      return 'wi-thunderstorm';
    case conditionCode >= 300 && conditionCode <= 321:
      return 'wi-showers';
    case conditionCode >= 500 && conditionCode <= 531:
      return 'wi-rain';
    case conditionCode >= 600 && conditionCode <= 622:
      return 'wi-snow';
    case conditionCode >= 701 && conditionCode <= 781:
      return 'wi-fog';
    case conditionCode === 800:
      return 'wi-day-sunny';
    case conditionCode >= 801 && conditionCode <= 804:
      return 'wi-cloudy';
    default:
      return 'wi-refresh';
  }
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
        "September",
    "October",
    "November",
    "December"
  ];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

function showError(error) {
  console.log(error);
  alert('An error occurred. Please try again.');
}

