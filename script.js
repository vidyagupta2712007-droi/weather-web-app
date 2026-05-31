const weatherCard = document.getElementById("weather-card");
const apiKey = "0defb3694113ab99f82fabcdd089e37a"; // Replace with your OpenWeatherMap API key

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// Fetch weather using geolocation on page load
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(fetchWeatherByLocation, showError);
} else {
  weatherCard.innerHTML =
    "<p>Geolocation is not supported by this browser.</p>";
}

// Fetch weather for user's location
function fetchWeatherByLocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeather(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  );
}

// Fetch weather for searched city
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );
  }
});

// Fetch weather data from API
function fetchWeather(url) {
  weatherCard.innerHTML = '<p id="loading">Loading weather data...</p>';
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        displayWeather(data);
      } else {
        weatherCard.innerHTML = `<p>${data.message}</p>`;
      }
    })
    .catch((err) => {
      weatherCard.innerHTML = `<p>Error fetching weather data: ${err}</p>`;
    });
}

// Display weather data with icons
function displayWeather(data) {
  const { name, main, weather, wind } = data;

  // Map weather conditions to FontAwesome icons
  let icon;
  switch (weather[0].main.toLowerCase()) {
    case "clouds":
      icon = '<i class="fas fa-cloud weather-icon"></i>';
      break;
    case "rain":
      icon = '<i class="fas fa-cloud-showers-heavy weather-icon"></i>';
      break;
    case "clear":
      icon = '<i class="fas fa-sun weather-icon"></i>';
      break;
    case "snow":
      icon = '<i class="fas fa-snowflake weather-icon"></i>';
      break;
    case "thunderstorm":
      icon = '<i class="fas fa-bolt weather-icon"></i>';
      break;
    default:
      icon = '<i class="fas fa-smog weather-icon"></i>';
      break;
  }

  weatherCard.innerHTML = `
        <h2>Weather in ${name}</h2>
        ${icon}
        <p class="weather-info">Condition: ${weather[0].main}</p>
        <p class="weather-info">Temperature: ${main.temp} °C</p>
        <p class="weather-info">Humidity: ${main.humidity}%</p>
        <p class="weather-info">Wind Speed: ${wind.speed} m/s</p>
    `;
}

// Show geolocation error
function showError(error) {
  weatherCard.innerHTML = `<p>Geolocation error: ${error.message}</p>`;
}
