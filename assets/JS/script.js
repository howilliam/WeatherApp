// Constants
const apiKey = '65aae4287820be3bb9c85c8178870d94';
var city;

// Function to fetch weather data
function getWeatherData(cityName) {
    city = cityName
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

               // checks that the api request is successful
               if (data.cod === '200') {
                // Process the data and update the weather dashboard
                updateWeatherDashboard(data);

                // Update the search history
                updateSearchHistory(city);
            }
        })
        .catch(function (error) {
            console.error('Error fetching weather data:', error);
        })
       
}

// Function to update the weather dashboard with the fetched data
function updateWeatherDashboard(data) {
    // Extract the relevant information from the API response
    const cityName = data.city.name;
    const currentWeather = data.list[0]; // Assuming the first entry represents current weather
    var formattedDate = dayjs(currentWeather.dt_txt).format('DD/MM/YYYY');

    // Update the DOM elements with the retrieved data
    const todaySection = document.getElementById('today');
    todaySection.innerHTML = '';

    // Create a card for the current weather
    const card = document.createElement('div');
    card.className = 'card mb-3';

    card.innerHTML = `
    <div class="card-body">
      <h2 class="card-title">${cityName} (${formattedDate})</h2>
      <p class="card-text">Temperature: ${(currentWeather.main.temp - 273.15).toFixed(1)} °C</p>
      <p class="card-text">Humidity: ${currentWeather.main.humidity} %</p>
      <p class="card-text">Wind Speed: ${currentWeather.wind.speed} m/s</p>
    </div>
  `;

    todaySection.appendChild(card);

    // Update the 5-day forecast
    const forecastSection = document.getElementById('forecast');
    forecastSection.innerHTML = ''; // Clear existing content

    const heading = document.createElement('h2');
    heading.className = 'text-black mb-3';
    heading.textContent = '5 Day Forecast:';
    forecastSection.appendChild(heading);

    // Create a parent container for forecast cards
    const forecastContainer = document.createElement('div');
    forecastContainer.className = 'd-flex flex-wrap'; // Use flex-wrap to ensure cards wrap to the next line


    for (let i = 0; i < 5; i++) {
        const forecast = data.list[i + (7 * (i + 1))]; // Theres an entry every 3 hours and an array that is 40 long
        var formattedDate = dayjs(forecast.dt_txt).format('DD/MM/YYYY');


        // Create a card for each day's forecast
        const card = document.createElement('div');
        card.className = 'card col text-white bg-dark mr-2 mb-3';

        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${formattedDate}</h5>
            <p class="card-text">Temperature: ${(forecast.main.temp - 273.15).toFixed(1)} °C</p>
            <p class="card-text">Humidity: ${forecast.main.humidity} %</p>
            <p class="card-text">Wind Speed: ${forecast.wind.speed} m/s</p>
          </div>
        `;

        forecastContainer.appendChild(card);
    }
    // Append the forecast container to the forecast section
    forecastSection.appendChild(forecastContainer);
}

// Function to update the search history
function updateSearchHistory(city) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    console.log(city)
    console.log(searchHistory)

    // Convert the city name to lowercase
    const lowercaseCity = city.toLowerCase();
    const lowercaseHistory = searchHistory.map(city => city.toLowerCase());
    // Check if the city is already in the search history
    if (!lowercaseHistory.includes(lowercaseCity)) {
        // Add the city to the search history
        searchHistory.push(city);

        // Update localStorage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Update the displayed history
        renderSearchHistory();
    }
}

// Function to render the search history on the page
function renderSearchHistory() {
    const historyList = document.getElementById('history');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Clear existing content
    historyList.innerHTML = '';

    // Render each city in the search history
    searchHistory.forEach((lowercaseCity) => {
        const originalCity = capitalizeFirstLetter(lowercaseCity);
        const listItem = document.createElement('button');
        listItem.className = 'list-group-item';
        listItem.textContent = originalCity;
        listItem.addEventListener('click', function () {
            getWeatherData(lowercaseCity);
        });

        historyList.appendChild(listItem);
    });
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event listener for the form submission
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('search-input').value;
    getWeatherData(city);
});

// Load search history on page load
renderSearchHistory();