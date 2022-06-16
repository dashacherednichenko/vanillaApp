let apiKey = "061af8862776400f0f98509421517421";
let url = `https://api.openweathermap.org/data/2.5/weather`;
let date_container = document.getElementById("current_date");
let now = new Date();
let search_form = document.getElementById('search_form');
let currentCityBtn = document.getElementById('currentCityBtn');
let city = document.getElementById('town');
let humidity = document.getElementById('humidity');
let wind = document.getElementById('wind');
let search_city = document.getElementById('city_input');
let units_links = document.querySelectorAll(".units_link");
let temp = document.getElementById("temperature");
let temp_default = temp.innerHTML;

function formatDate(now) {
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
    if (hours < 10) {
        hours = "0".concat(hours);
    }
    let minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = "0".concat(minutes);
    }
    let dateFormat = `${days[day]}, ${hours}:${minutes}`;
    return dateFormat;
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
    console.log(res.data);
    let cityTemp = Math.round(res.data.main.temp);
    let cityName = res.data.name;
    let cityHumidity = res.data.main.humidity;
    let cityWind = Math.round(res.data.wind.speed);
    let desc = res.data.weather[0].main;
    console.log(cityTemp);
    changeForecast(cityName, cityTemp, cityHumidity, cityWind, desc);
}

function changeCity(event) {
    event.preventDefault();
    let apiUrl = `${url}?q=${search_city.value}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather)
};

function handlePosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
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
    } else {
        temp.innerHTML = temp_default;
    }
}

date_container.innerHTML = formatDate(now);
search_form.addEventListener('submit', changeCity);
currentCityBtn.addEventListener('click', findCity);
units_links.forEach(el => el.addEventListener('click', changeUnit));