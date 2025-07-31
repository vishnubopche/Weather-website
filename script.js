const API_KEY = "36c9c29a08c24e1197a52529253107";
const weatherListDiv = document.getElementById("weatherList");
const searchResultDiv = document.getElementById("searchResult");

// Popular cities
const cities = ["London","Kolkata", "New York", "Paris", "Tokyo", "Mumbai", "Sydney", "Cape Town", "Dubai", "Delhi,india"];

function createWeatherCard(data, showForecast = false, title = null) {
  const { name, country } = data.location;
  const { temp_c, condition, humidity, wind_kph } = data.current;

  let html = `
    <div class="weather-card">
      ${title ? `<h3>${title}</h3>` : `<h3>${name}, ${country}</h3>`}
      <p><img src="https:${condition.icon}" alt="${condition.text}" /> <strong>${condition.text}</strong></p>
      <p>🌡️ Temperature: ${temp_c}°C</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌬️ Wind: ${wind_kph} kph</p>
  `;

  if (showForecast && data.forecast) {
    html += `<h4>Next 3 Days Forecast</h4>`;
    data.forecast.forecastday.forEach(day => {
      html += `
        <div>
          <strong>${day.date}</strong>: 
          ${day.day.avgtemp_c}°C, 
          <img src="https:${day.day.condition.icon}" alt="" />
          ${day.day.condition.text}
        </div>
      `;
    });
  }

  html += `</div>`;
  return html;
}

function getWeatherForCity(city, targetDiv, showForecast = false, title = null) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const cardHTML = createWeatherCard(data, showForecast, title);
      targetDiv.innerHTML += cardHTML;
    })
    .catch(error => {
      const errorMsg = `<p style="color:red;">${error.message}</p>`;
      targetDiv.innerHTML += errorMsg;
    });
}

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  searchResultDiv.innerHTML = "";
  getWeatherForCity(city, searchResultDiv, true);
}

// 🌍 Detect user location and fetch weather
function getWeatherByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locationQuery = `${lat},${lon}`;
        getWeatherForCity(locationQuery, searchResultDiv, true, "📍 Your Location");
      },
      (error) => {
        console.warn("Geolocation denied or failed:", error.message);
      }
    );
  } else {
    console.warn("Geolocation not supported by this browser.");
  }
}

// 🔄 On load
window.onload = () => {
  searchResultDiv.innerHTML = "";
  getWeatherByGeolocation(); // show current location weather
  weatherListDiv.innerHTML = "";
  cities.forEach(city => getWeatherForCity(city, weatherListDiv));
};

// 🌙 Dark Mode Toggle
const themeToggleBtn = document.getElementById("toggleTheme");

function setTheme(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  localStorage.setItem("theme", mode);
}

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});

// Load saved theme on startup
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
});


