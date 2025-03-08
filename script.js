const weatherForm = document.querySelector('.weatherForm');
const cityName = document.querySelector('.cityName');
const card = document.querySelector('.card');
const apiKey = "1a4fa94c8e83e28d12952c4ca8d5f0b4";

weatherForm.addEventListener('submit', async event => {
event.preventDefault();
const city = cityName.value;
if(city){
    try{
        const weatherData = await getWeather(city);
        displayWeatherInfo(weatherData);
    }
    catch(error){
        console.error(error);
        displayError('エラーが発生しました。');
    }
} else {
    displayError('地名を入力してください。');
}
});

async function getWeather(city) {
  const apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang={ja}`;
  const response = await fetch(apiUrl);
  console.log(response);
  if(response.ok){
      return await response.json();
  }
  throw new Error('天気情報が取得できませんでした。');
}

function displayWeatherInfo(data){
    console.log(data);
   const {name:city, main:{temp, humidity},
    weather:[{description, id}]} = data;

    card.textContent = " ";
    card.style.display="flex";

    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const weatherDisplay = document.createElement('p');
    const weatherEmoji = document.createElement('p');
    
    cityDisplay.textContent = city;
    cityDisplay.classList.add('cityDisplay');

    tempDisplay.textContent = `${Math.round(temp - 273.15)}℃`;
    tempDisplay.classList.add('tempDisplay');

    humidityDisplay.textContent = `湿度: ${humidity}%`;
    humidityDisplay.classList.add('humidityDisplay');

    weatherDisplay.textContent = description;
    weatherDisplay.classList.add('weatherDisplay');

    weatherEmoji.textContent = displayWeatherEmoji(id);
    weatherEmoji.classList.add('weatherEmoji');

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(weatherDisplay);
    card.appendChild(weatherEmoji);
}

function displayWeatherEmoji(weatherID) {
    switch (true) {
        case (weatherID >= 200 && weatherID < 300):
            return '⛈️';
        case (weatherID >= 300 && weatherID < 600):
            return '🌧️';
        case (weatherID >= 500 && weatherID < 600):
            return '☔';
        case (weatherID >= 600 && weatherID < 700):
            return '❄️';
        case (weatherID >= 700 && weatherID < 800):
            return '🌫️';
        case (weatherID == 800):
            return '☀️';
        case (weatherID >= 801 && weatherID < 810):
            return '☁️';
        default:
            return '❓';
    }
}

function displayError(message){
  const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');

    card.textContent = " ";
    card.style.display="flex";
    card.appendChild(errorDisplay);
}