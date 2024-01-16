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
}