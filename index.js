const apiKey = "f97afc0f7cee7561804533c29560a621";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather_icon");
const card = document.querySelector(".card");

// 🔹 NEW: Function to start live local time
function startLocalTime(dt, timezone) {
  const timeElement = document.querySelector(".time");

  function updateTime() {
    // Current UTC time in milliseconds
    const nowUTC =
      new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    // Convert to city local time
    const localTime = new Date(nowUTC + timezone * 1000);
    // Format HH:MM AM/PM
    timeElement.innerHTML = localTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  updateTime(); // initial call
  clearInterval(window.localTimeInterval); // clear previous interval if exists
  window.localTimeInterval = setInterval(updateTime, 1000); // update every second
}

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
     document.querySelector(".forecast").innerHTML = "";
  } else {
    var data = await response.json();
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + `°C`;
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
    document.querySelector(".visibility").innerHTML =
      data.visibility / 1000 + " km";

    // 🔹 AQI placeholder (need separate API for real AQI)
    document.querySelector(".aqi").innerHTML = "Good";

    // 🔹 Dynamic Icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.querySelector(".condition").innerHTML = data.weather[0].main;
    // 🔹 Dynamic background gradient based on weather
    const weather = data.weather[0].main;

    if (weather == "Clear") {
    card.style.background = "linear-gradient(135deg, #f7971e, #ffd200)";
} else if (weather == "Clouds") {
    card.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
} else if (weather == "Rain") {
    card.style.background = "linear-gradient(135deg, #4e54c8, #8f94fb)";
} else if (weather == "Drizzle") {
    card.style.background = "linear-gradient(135deg, #89f7fe, #66a6ff)";
} else if (weather == "Thunderstorm") {
    card.style.background = "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
} else if (weather == "Snow") {
    card.style.background = "linear-gradient(135deg, #e0eafc, #cfdef3)";
} else if (weather == "Mist") {
    card.style.background = "linear-gradient(135deg, #cfd9df, #e2ebf0)";
} else if (weather == "Fog") {
    card.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
} else if (weather == "Haze") {
    card.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
} else {
    card.style.background = "linear-gradient(135deg, #00feba, #5b548a)"; // fallback
}

    startLocalTime(data.dt, data.timezone);

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}
// 🔹 Forecast function (retained, minor change: adjusted card width for horizontal scroll)
async function getForecast(city) {
  const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
  if (!response.ok) {
    console.error("Error fetching forecast");
    return;
  }
  const data = await response.json();
  console.log("Forecast data:", data);

  const forecastContainer = document.querySelector(".forecast");
  forecastContainer.innerHTML = "";

  data.list.slice(0, 5).forEach((item) => {
    const time = new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const temp = Math.round(item.main.temp) + "°C";
    const desc = item.weather[0].description;
    const iconCode = item.weather[0].icon;

    const div = document.createElement("div");
    div.classList.add("forecast-item");
    div.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png">
                         <p>${time}</p>
                         <p>${temp}</p>
                         <p>${desc}</p>`;
    forecastContainer.appendChild(div);
  });
}

// 🔹 Search button event
searchBtn.addEventListener("click", () => {
  const city = searchBox.value;
  checkWeather(city);
  getForecast(city);
});
