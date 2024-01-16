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

        })
        .catch(function (error) {
            console.error('Error fetching weather data:', error);
        })
       
}

