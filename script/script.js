const apiKey = "9ea4a94d651924c9d486cfcff7e2bfbb";

const timeZone = document.querySelector(".section-title-date");
const dateEl = document.getElementById("date");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "Jun",
  "Jul",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dataTemp = document.querySelector(".temp");
const dataIcon = document.querySelector(".icon");
const dataHighTemp = document.querySelector(".high-temp");
const dataLowTemp = document.querySelector(".low-temp");

const dataHumidity = document.querySelector(".humidity");
const dataUvi = document.querySelector(".uvi");

const windArrow = document.querySelector(".wind");
const dataWindSpeed = document.querySelector(".wind-speed");
const arrowPosition = document.querySelector(".wind-arrow");

const unitToggle = document.querySelector(".unit-toggle");
const metricRadio = document.getElementById("cel");
const imperialRadio = document.getElementById("kel");

const weatherForecastEl = document.querySelector(".days");
const daysBtn = document.querySelector(".day");

// Set Date
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();

// Get Data from API

function getWeatherData() {
  // Obtaining the User Position
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        displayWeather(data);
        daysForecast(data);
      });
  });
}

// Display Data

function displayWeather(data) {
  const { timezone } = data;
  const { humidity, uvi } = data.daily[0];
  const { icon } = data.daily[0].weather[0];

  timeZone.innerText = timezone;
  dataTemp.innerText = Math.round(data.daily[0].temp.day) + "°C";
  dataIcon.src = "https://openweathermap.org/img/wn/" + icon + ".png";
  dataHighTemp.innerText = "High: " + Math.round(data.daily[0].temp.max) + "°C";
  dataLowTemp.innerText = "Low: " + Math.round(data.daily[0].temp.min) + "°C";
  dataHumidity.innerText = "Humidity: " + humidity + "%";
  dataUvi.innerText = "UV: " + Math.round(uvi);
  windDirection(data);
  radioButton(data);
}

// Wind Direction

function windDirection(data) {
  const { wind_deg, wind_speed } = data.daily[0];

  // An Arrow Showing Direction of the Wind
  if (wind_deg <= 78.75) {
    windArrow.innerHTML = `
                <h2 class="section-title">Wind</h2>
                <p class="reading wind-speed">Wind speed: <i class="fas fa-long-arrow-alt-right"></i> ${wind_speed}m/s</p>
            `;
  } else if (wind_deg <= 168.75) {
    windArrow.innerHTML = `
                <h2 class="section-title">Wind</h2>
                <p class="reading wind-speed">Wind speed: <i class="fas fa-long-arrow-alt-down"></i> ${wind_speed}m/s</p>
            `;
  } else if (wind_deg <= 258.75) {
    windArrow.innerHTML = `
                <h2 class="section-title">Wind</h2>
                <p class="reading wind-speed">Wind speed: <i class="fas fa-long-arrow-alt-left"></i> ${wind_speed}m/s</p>
            `;
  } else {
    windArrow.innerHTML = `
                <h2 class="section-title">Wind</h2>
                <p class="reading wind-speed">Wind speed: <i class="fas fa-long-arrow-alt-up"></i> ${wind_speed}m/s</p>
            `;
  }
}

// Radio Button for Converting C to K

function radioButton(data) {
  unitToggle.addEventListener("click", () => {
    let metricUnits = !isMetric();

    // Checked Kelvin and Update data
    imperialRadio.checked = !metricUnits;
    updateUnits(data);

    if ((metricRadio.checked = metricUnits)) {
      displayWeather(data);
    }
  });
}

// Calculating Kelvin

function updateUnits(data) {
  const kelvin = 273.15;
  dataTemp.innerText = Math.round(data.daily[0].temp.day + kelvin) + "K";
  dataHighTemp.innerText =
    "High: " + Math.round(data.daily[0].temp.max + kelvin) + "K";
  dataLowTemp.innerText =
    "Low: " + Math.round(data.daily[0].temp.min + kelvin) + "K";
}

// Return checked Celsius

function isMetric() {
  return metricRadio.checked;
}

// Display Data by Days

function daysForecast(data) {
  let otherDayForcast = "";
  data.daily.forEach((day) => {
    // Import moment.js in HTML
    otherDayForcast += `
            <button class="btn day">
                <h3 class="day-title">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</h3>
                <img class="icon" src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }.png" id="img1">
                <p class="reading temp">${Math.round(day.temp.day) + "°C"}</p>
            </button>
            `;
    // if (daysBtn) {
    //   daysBtn.addEventListener("click", testFunc);
    // }
  });

  weatherForecastEl.innerHTML = otherDayForcast;
}

// function testFunc() {
//   console.log("test");
// }
