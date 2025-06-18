function formatDate(timestamp, timezone = null) {
  let localtime = new Date(timestamp);
  let offset = localtime.getTimezoneOffset();
  let date1 = new Date(localtime);
  date1.setSeconds(date1.getSeconds() + timezone);
  let date = new Date(date1.getTime() + offset * 60 * 1000);

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[date.getDay()];
  let dayNumber = date.getDate();

  let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

 let ampm = hours >= 12 ? "PM" : "AM";

hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

// Pad with leading zero if less than 10
hours = hours < 10 ? `0${hours}` : hours;


  let h2 = document.querySelector("h2");
  h2.innerHTML = `${day}, ${dayNumber} ${month} ${year} | ${hours}:${minutes} ${ampm}`;

  if (hours <= 6 && ampm === "PM" || hours < 6 && ampm === "AM") {
    document.querySelector("#city-input").classList.add("nightmode");
    document.querySelector("#search-button").classList.add("nightmode");
    document.querySelector("#location-button").classList.add("nightmode");
    document.querySelector("#location-icon").setAttribute("src", "icons/location-dark.svg");
    document.querySelector(".weather-forecast").classList.add("nightmode");
    document.querySelector(".weather-app").classList.add("nightmode");
  } else {
    document.querySelector("#city-input").classList.remove("nightmode");
    document.querySelector("#search-button").classList.remove("nightmode");
    document.querySelector("#location-button").classList.remove("nightmode");
    document.querySelector("#location-icon").setAttribute("src", "icons/location-light.svg");
    document.querySelector(".weather-forecast").classList.remove("nightmode");
    document.querySelector(".weather-app").classList.remove("nightmode");
  }
}

function getDailyForecast(coordinates) {
  let apiKey = "33e5f3c0e00cb89418bdf57f158279c6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response.data); // Log the API response to the console

  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city-name");
  let descriptionElement = document.querySelector("#weather-description");
  let feelsLikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity-level");
  let windElement = document.querySelector("#wind-speed");
  let iconElement = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  formatDate(response.data.dt * 1000, response.data.timezone);

  let iconCode = response.data.weather[0].icon;
  let iconPath = `icons/${iconCode}.svg`;
  console.log(`Setting icon to: ${iconPath}`); // Log the icon path

  iconElement.setAttribute("src", iconPath);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getDailyForecast(response.data.coord);
}


function formatDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      let src = "";
      switch (forecastDay.weather[0].icon) {
        case "01d":
          src = `icons/01d.svg`;
          break;
        case "01n":
          src = `icons/01n.svg`;
          break;
        case "02d":
          src = `icons/02d.svg`;
          break;
        case "02n":
          src = `icons/02n.svg`;
          break;
        case "03d":
          src = `icons/03d.svg`;
          break;
        case "03n":
          src = `icons/03d.svg`;
          break;
        case "04d":
          src = `icons/04d=.svg`;
          break;
        case "04n":
          src = `icons/04n.svg`;
          break;
        case "09d":
          src = `icons/09d.svg`;
          break;
        case "09n":
          src = `icons/09n.svg`;
          break;
        case "10d":
          src = `icons/10d.svg`;
          break;
        case "10n":
          src = `icons/10n.svg`;
          break;
        case "11d":
          src = `icons/11d.svg`;
          break;
        case "11n":
          src = `icons/11n.svg`;
          break;
        case "13d":
          src = `icons/13d.svg`;
          break;
        case "13n":
          src = `icons/13n.svg`;
          break;
        case "50d":
          src = `icons/50d.svg`;
          break;
        case "50n":
          src = `icons/50n.svg`;
          break;
        default:
          src = `icons/01d.svg`;
          break;
      }

      let maxTemp = Math.round(forecastDay.temp.max);
      let minTemp = Math.round(forecastDay.temp.min);
      forecastHTML =
        forecastHTML +
        `
            <div class="col weekdays">
              <h4>${formatDays(forecastDay.dt)}</h4>
              <img src="${src}" alt="${
          forecastDay.weather[0].description
        }" class="weekday-weather" />
              <p class="forecast-temp">
                <span class="forecast-temp-max">${maxTemp}°</span> -
                <span class="forecast-temp-min">${minTemp}°</span>
              </p>
              <p class="weather-type">${forecastDay.weather[0].description}</p>
            </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function search(city) {
  let apiKey = "33e5f3c0e00cb89418bdf57f158279c6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function getPosition(position) {
  let apiKey = "33e5f3c0e00cb89418bdf57f158279c6";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiuslink.classList.remove("active");
  fahrenheitlink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiuslink.classList.add("active");
  fahrenheitlink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector("#location-button");
currentLocation.addEventListener("click", getLocation);

let fahrenheitlink = document.querySelector("#fahrenheit-link");
fahrenheitlink.addEventListener("click", displayFahrenheitTemperature);

let celsiuslink = document.querySelector("#celsius-link");
celsiuslink.addEventListener("click", displayCelsiusTemperature);

search("chennai");
