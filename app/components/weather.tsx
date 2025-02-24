"use client";

import React, { useState } from "react";
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";
import { FaCity, FaCloudSun, FaEye, FaCloud } from "react-icons/fa";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API;

interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: { speed: number };
  clouds: { all: number };
  visibility: number;
  weather: { description: string; main: string }[];
}

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found! Please enter a valid city name.");
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 w-full min-h-screen flex flex-col items-center relative text-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-lg py-4 px-8 flex items-center justify-center sm:justify-start fixed top-0 left-0 right-0 z-50 border-b border-gray-600">
        <FaCloudSun className="text-cyan-400 text-3xl mr-3" />
        <h1 className="text-2xl font-bold text-white">WeatherView</h1>
      </nav>

      {/* Main Content */}
      <div className="w-10/12 mx-auto mt-20">
        {/* Search Section */}
        <div className="search flex items-center justify-center py-5">
          <form
            onSubmit={fetchWeather}
            className="w-full flex items-center justify-center gap-3"
          >
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full sm:w-3/4 lg:w-1/2 px-4 py-2 text-center text-white bg-gray-700 border-2 border-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <button
              type="submit"
              className="rounded-full py-2 px-6 sm:px-10 lg:px-16 border-2 border-cyan-500 text-white bg-cyan-900 font-semibold transition hover:bg-cyan-800 hover:border-cyan-800"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading & Error Messages */}
        {loading && (
          <p className="text-center text-white text-lg">Fetching weather data...</p>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}

        {/* Weather Cards */}
        {weatherData && (
          <div className="weather-cards p-5 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full place-items-center">
              {[
                {
                  label: "Location",
                  value: `${weatherData.name}, ${weatherData.sys.country}`,
                  icon: <FaCity className="text-gray-300 text-7xl" />,
                },
                {
                  label: "Temperature",
                  value: `${weatherData.main.temp}°C (Feels like ${weatherData.main.feels_like}°C)`,
                  icon: <WiThermometer className="text-red-400 text-7xl" />,
                },
                {
                  label: "Humidity",
                  value: `${weatherData.main.humidity}%`,
                  icon: <WiHumidity className="text-blue-400 text-7xl" />,
                },
                {
                  label: "Wind Speed",
                  value: `${weatherData.wind.speed} km/h`,
                  icon: <WiStrongWind className="text-gray-300 text-7xl" />,
                },
                {
                  label: "Air Pressure",
                  value: `${weatherData.main.pressure} hPa`,
                  icon: <WiBarometer className="text-yellow-400 text-7xl" />,
                },
                {
                  label: "Clouds",
                  value: `${weatherData.clouds.all}% Cloud Cover`,
                  icon: <FaCloud className="text-gray-400 text-7xl" />,
                },
                {
                  label: "Visibility",
                  value: `${(weatherData.visibility / 1000).toFixed(1)} km`,
                  icon: <FaEye className="text-white text-7xl" />,
                },
                {
                  label: "Sunrise",
                  value: new Date(
                    weatherData.sys.sunrise * 1000
                  ).toLocaleTimeString(),
                  icon: <WiSunrise className="text-orange-500 text-7xl" />,
                },
                {
                  label: "Sunset",
                  value: new Date(
                    weatherData.sys.sunset * 1000
                  ).toLocaleTimeString(),
                  icon: <WiSunset className="text-pink-500 text-7xl" />,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 bg-opacity-80 p-5 rounded-lg shadow-xl w-full h-44 flex flex-row items-center gap-4 border border-gray-600 transition-transform transform hover:scale-105 hover:shadow-cyan-500"
                >
                  {item.icon}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300">{item.label}</h3>
                    <p className="text-xl font-bold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
