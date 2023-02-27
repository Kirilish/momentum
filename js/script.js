/* Time and Date */

function time() {
  setInterval(function () {
    let now = new Date();
    let clock = document.querySelector(".time");
    clock.innerHTML = now.toLocaleTimeString();
  }, 1000);
}

time();

function date() {
  const lang = navigator.language;
  let date = new Date();
  let dayNumber = date.getDate();
  let dayName = date.toLocaleString(lang, { weekday: "long" });
  let monthName = date.toLocaleString(lang, { month: "long" });

  document.querySelector(".date").innerHTML =
    dayName.charAt(0).toUpperCase() +
    dayName.slice(1) +
    ", " +
    monthName.charAt(0).toUpperCase() +
    monthName.slice(1) +
    " " +
    dayNumber;
}
date();

/* Greeting */

function greeting() {
  let Data = new Date();
  let hour = Data.getHours();
  if (hour >= 6 && hour <= 11) {
    document.querySelector(".greeting").innerHTML = "Доброе утро";
  } else if (hour >= 12 && hour <= 18) {
    document.querySelector(".greeting").innerHTML = "Добрый день";
  } else if (hour >= 19 && hour <= 23) {
    document.querySelector(".greeting").innerHTML = "Добрый вечер";
  } else {
    document.querySelector(".greeting").innerHTML = "Спокойной ночи";
  }
}
greeting();

const name = document.querySelector(".name");

function setLocalStorageName() {
  localStorage.setItem("name", name.value);
}
name.addEventListener("change", setLocalStorageName);

function getLocalStorageName() {
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }
}

function PlaceholderName() {
  name.placeholder = "[Введите имя]";
}
getLocalStorageName();
PlaceholderName();

/* Slider */

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  const arr = ["night", "morning", "afternoon", "evening"];
  return arr[Math.floor(hours / 6)];
}

const body = document.querySelector("body");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");

let randomNum = "" + getRandomNum(1, 20);

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg() {
  let bgNum = ("" + randomNum).padStart(2, "0");
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/Kirilish/momentium-img/assets/images/${getTimeOfDay()}/${bgNum}.jpg`;

  img.addEventListener("load", () => {
    body.style.backgroundImage = `url(${img.src})`;
  });
}
setBg();

function getSlideNext() {
  randomNum++;
  if (randomNum > 20) {
    randomNum = 1;
  }
  setBg();
}

function getSlidePrev() {
  randomNum--;
  if (randomNum < 1) {
    randomNum = 20;
  }
  setBg();
}

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

/* Quote */

const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuoter = document.querySelector(".change-quote");

async function getQuote() {
  const res = await fetch("./quote.json");

  const quotes = await res.json();

  const index = getRandomNum(0, quotes.length - 1);
  quote.textContent = quotes[index][`quote`];
  author.textContent = quotes[index][`autor`];
}

getQuote();

changeQuoter.addEventListener("click", getQuote);

/* Weather */
const apiKey = "465dbba8f85b0e33c44fcc44669d31f3";
const defaultCity = "Minsk";

let city = localStorage.getItem("city") || defaultCity;

document.querySelector(".city").value = city;

async function updateWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    console.log(data);
    document.querySelector(
      ".weather-icon"
    ).classList = `weather-icon owf owf-${data.weather[0].id}`;
    document.querySelector(".temperature").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(".weather-description").textContent =
      data.weather[0].description;
    document.querySelector(".wind").textContent = `Wind: ${Math.round(
      data.wind.speed
    )} m/s`;
    document.querySelector(".humidity").textContent = `Humidity: ${Math.round(
      data.main.humidity
    )}%`;
    localStorage.setItem("city", city);
  } catch (error) {
    console.error(error);
    document.querySelector(".weather-error").textContent = "";
  }
}
updateWeather(city);

document.querySelector(".city").addEventListener("input", (event) => {
  const newCity = event.target.value.trim();
  if (newCity) {
    updateWeather(newCity);
  } else {
    document.querySelector(".weather-error").textContent =
      "Please enter a city";
  }
});

/* todo */

const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");

let todos = [];

if (localStorage.getItem("todos")) {
  todos = JSON.parse(localStorage.getItem("todos"));
  renderTodos();
}

addBtn.addEventListener("click", function () {
  const todo = input.value;
  if (todo !== "") {
    todos.push(todo);
    input.value = "";
    renderTodos();
    saveTodos();
  }
});

function renderTodos() {
  list.innerHTML = "";
  for (let i = 0; i < todos.length; i++) {
    const li = document.createElement("li");
    li.classList.add("list");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("list-checkbox");
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        li.classList.add("checked");
      } else {
        li.classList.remove("checked");
      }
      saveTodos();
    });

    const label = document.createElement("label");
    label.innerText = todos[i];
    label.classList.add("list-label");
    label.style.wordBreak = "break-all"; // add this line to apply word-break

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Удалить";
    deleteBtn.addEventListener("click", function () {
      todos.splice(i, 1);
      renderTodos();
      saveTodos();
    });
    deleteBtn.classList.add("list-btn");

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  }
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
