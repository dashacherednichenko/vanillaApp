let apiKey = "061af8862776400f0f98509421517421";
let url = `https://api.openweathermap.org/data/2.5/weather`;
let date_container = document.getElementById("current_date");
let now = new Date();
let search_form = document.getElementById('search_form');
let currentCityBtn = document.getElementById('currentCityBtn');
let city = document.getElementById('town');
let nav_cities = document.querySelectorAll('.navigation-city');
let humidity = document.getElementById('humidity');
let wind = document.getElementById('wind');
let search_city = document.getElementById('city_input');
let units_links = document.querySelectorAll(".units_link");
let temp = document.getElementById("temperature");
let temp_default = temp.innerHTML;
let firstCity = 'kyiv';
let coord = {};

function formatDay(date) {
    let now = new Date(date * 1000);
    let day = now.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
}

function unitToDefault(){
    units_links.forEach(el => el.classList.remove("active"));
    document.getElementById('celsius-link').classList.add("active");
}

function displayForecast(res) {
    let forecastData = res.data.daily;
    console.log('NEWres', forecastData);
    let forecast = document.querySelector('#forecast');
    let forecastHtml = `<div class="row">`;
    forecastData.forEach(function (day, i) {
        if (i < 6) {
            forecastHtml = forecastHtml + `
            <div class="col-sm-2">
                <div class="day">${formatDay(day.dt)}</div>
                <div class="emoji">
                    <span class="weather-emoji">
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Clear" class=""/>️
                    </span>
                </div>
                <div class="temperature">
                    <span class="temp-max">${Math.round(day.temp.max)}°</span>
                    <span class="temp-min">${Math.round(day.temp.min)}°</span>
                </div>
           </div>             
        `;
        }
    })
    forecastHtml = forecastHtml + `</div>`
    forecast.innerHTML = forecastHtml;
}

function getForecast(coord, unit) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=hourly,minutely&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(displayForecast);
}

function formatDate(timestamp) {
    let now = new Date(timestamp);
    let day = now.getDay();
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    return `${days[day]}, ${hours}:${minutes}`;
}

function clearSearchInput() {
    search_city.value = '';
}

function changeForecast(cityName, cityTemp, cityHumidity, cityWind, desc) {
    city.innerHTML = cityName;
    temp.innerHTML = cityTemp;
    humidity.innerHTML = cityHumidity;
    wind.innerHTML = cityWind;
    temp_default = cityTemp;
    document.getElementById('weatherDesc').innerHTML = desc;
    clearSearchInput();
}

function displayWeather(res) {
    unitToDefault();
    console.log('res', res, res.data.coord);
    date_container.innerHTML = formatDate(res.data.dt * 1000);
    let cityTemp = Math.round(res.data.main.temp);
    let cityName = res.data.name;
    let cityHumidity = res.data.main.humidity;
    let cityWind = Math.round(res.data.wind.speed);
    let desc = res.data.weather[0].description;
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", res.data.weather[0].description);
    changeForecast(cityName, cityTemp, cityHumidity, cityWind, desc);
    coord = res.data.coord;
    getForecast(coord, 'metric');
}

function changeCity(event, city) {
    event.preventDefault();
    let apiUrl = `${url}?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather)
}

function handlePosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiUrl = `${url}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather);
}

function findCity() {
    navigator.geolocation.getCurrentPosition(handlePosition);
}

function changeUnit(event) {
    let click_unit = event.target;
    units_links.forEach(el => el.classList.remove("active"));
    click_unit.classList.add("active");
    if (click_unit.id === 'fahrenheit-link') {
        temp.innerHTML = Math.round(temp_default * 9 / 5 + 32);
        getForecast(coord, 'imperial');
    } else {
        getForecast(coord, 'metric');
        temp.innerHTML = temp_default;
    }
}

axios.get(`${url}?q=${firstCity}&appid=${apiKey}&units=metric`).then(displayWeather);
search_form.addEventListener('submit', (ev) => changeCity(ev, search_city.value));
currentCityBtn.addEventListener('click', findCity);
units_links.forEach(el => el.addEventListener('click', changeUnit));
nav_cities.forEach(el => el.addEventListener('click', (ev) => changeCity(ev, el.firstChild.innerText)));