import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import BackgroundDay from "./assets/images/background-day.png";
import BackgroundNight from "./assets/images/background-night.png";
import feels_like from "./assets/icons/feels-like.svg";
import humidity from "./assets/icons/humidity.svg";
import wind from "./assets/icons/wind.svg";

// Preload all weather icons
const iconMap = import.meta.glob("./assets/icons/*.svg", {
  eager: true,
  import: "default",
});

const getIconUrl = (iconCode) => {
  return iconMap[`./assets/icons/${iconCode}.svg`] || feels_like;
};

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("celsius");
  const [cityInput, setCityInput] = useState("chennai");
  const [displayedCity, setDisplayedCity] = useState("chennai");
  const [timezoneOffset, setTimezoneOffset] = useState(null);
  const celsiusTemp = useRef(null);
  const apiKey = "33e5f3c0e00cb89418bdf57f158279c6";

  const search = async (query) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`
      );
      const data = response.data;
      celsiusTemp.current = data.main.temp;
      setWeatherData(data);
      setDisplayedCity(query);
      setTimezoneOffset(data.timezone);
      getDailyForecast(data.coord);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const getDailyForecast = async (coords) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(apiUrl);
    setForecast(response.data.daily.slice(0, 5));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      search(cityInput);
    }
  };


  const formatDate = (timestamp, timezone) => {
    const local = new Date(timestamp * 1000);
    const offset = local.getTimezoneOffset();
    const adjusted = new Date(local.getTime() + timezone * 1000 + offset * 60000);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const day = days[adjusted.getDay()];
    const month = months[adjusted.getMonth()];
    const date = adjusted.getDate();
    const year = adjusted.getFullYear();
    let hours = adjusted.getHours();
    const minutes = adjusted.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const hourStr = hours < 10 ? `0${hours}` : hours;
    return `${day}, ${date} ${month} ${year} | ${hourStr}:${minutes} ${ampm}`;
  };

 

  const displayTemp = () => {
    if (!celsiusTemp.current) return "--";
    if (unit === "celsius") return Math.round(celsiusTemp.current);
    return Math.round((celsiusTemp.current * 9) / 5 + 32);
  };

  useEffect(() => {
    search(cityInput);
  }, []);

  const isNight = () => {
    if (!weatherData || timezoneOffset === null) return false;
    const local = new Date(weatherData.dt * 1000);
    const offset = local.getTimezoneOffset();
    const date = new Date(local.getTime() + timezoneOffset * 1000 + offset * 60000);
    const hours = date.getHours();
    return hours <= 6 || hours >= 18;
  };

  const bgImage = isNight() ? BackgroundNight : BackgroundDay;

  return (
    <div className="container mx-auto p-4 font-[Poppins]">
      <div
        className="weather-app max-w-[976px] mx-auto rounded-3xl p-8 md:p-14 mt-6 bg-center bg-no-repeat bg-cover dark:bg-blue-900"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Header */}
        <div className="row header flex flex-wrap pb-12 md:pb-20">
          <div className="col-lg-6 col-12 w-full md:w-1/2 mb-4 md:mb-0">
            <h1 className="text-white text-4xl font-medium leading-[44px] mb-2.5">
              {displayedCity}
            </h1>
            <h2 className="text-white text-sm opacity-80">
              {weatherData ? formatDate(weatherData.dt, timezoneOffset) : "Loading..."}
            </h2>
          </div>
          <div className="col-lg-6 col-12 w-full md:w-5/12 flex items-center mb-4 md:mb-0">
            <form className="flex flex-wrap gap-3 w-full" onSubmit={handleSubmit}>
              <input
                type="search"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Type a city or location"
                className="flex-grow bg-white/95 text-sm rounded-xl h-11 px-4 border-none placeholder:text-gray-500"
              />
              <input
                type="submit"
                value="Search"
                className="ml-[-40px] bg-blue-900 text-white text-sm font-medium rounded-xl h-11 px-6 border-none hover:bg-blue-800"
              />
            </form>
          </div>
        </div>

        {/* Weather Body */}
        {weatherData && (
          <div className="row body flex flex-wrap items-center">
            <div className="col-md-5 col-12 w-full md:w-7/12 flex items-center">
              <p className="text-white lg:text-9xl text-7xl font-light leading-[100px] m-0 pr-3">
                {displayTemp()}
              </p>
              <ul className="m-0 mt-6 -ml-3">
                <li className="text-white text-xl flex gap-2 font-light list-none p-0">
                  <button
                    onClick={() => setUnit("celsius")}
                    className={`text-white/80 hover:text-white font-medium cursor-pointer  mr-1 ${unit === "celsius" ? "text-white" : ""}`}
                  >
                    °C
                  </button>
                  |
                  <button
                    onClick={() => setUnit("fahrenheit")}
                    className={`text-white/80 hover:text-white font-medium cursor-pointer ml-1 ${unit === "fahrenheit" ? "text-white" : ""}`}
                  >
                    °F
                  </button>
                </li>
                <li className="text-white text-xl font-semibold list-none capitalize">
                  {weatherData.weather[0].description}
                </li>
              </ul>
            </div>
            <div className="col-md-5 col-12 w-full md:w-3/12 -mt-10 md:-mt-16 md:ml-[-12px]">
              <img
                src={getIconUrl(weatherData.weather[0].icon)}
                alt={weatherData.weather[0].description}
                className="w-48 img-fluid mx-auto"
              />
            </div>
            <div className="col-md-2 col-12 w-full md:w-2/12 flex justify-center ps-4">
              <ul className="text-white text-sm list-none p-0 mt-5 -ml-6 leading-7">
                <li className="flex items-center mb-2">
                  <img src={feels_like} alt="feels like" className="icon w-5 h-5 mr-2" />
                  Feels like: <span className="ml-1">{Math.round(weatherData.main.feels_like)}</span>°
                </li>
                <li className="flex items-center mb-2">
                  <img src={humidity} alt="humidity" className="icon w-5 h-5 mr-2" />
                  Humidity: <span className="ml-1">{weatherData.main.humidity}</span>%
                </li>
                <li className="flex items-center">
                  <img src={wind} alt="wind" className="icon w-5 h-5 mr-2" />
                  Wind: <span className="ml-1">{Math.round(weatherData.wind.speed)}</span> km/h
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default WeatherApp;
