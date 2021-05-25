
const searchButton = document.querySelector('button');
const weatherCard = document.querySelector('.weatherCard');
const load = document.querySelector('.load');
const locationInfo = document.querySelector('.locationInfo');
const locationWeather = document.querySelector('.locationWeather');
const btnDailyWeather = document.querySelector('.btnDailyWeather');
const showDailyWeather = document.querySelector('.showDailyWeather');

// Catching promise error 
const renderError = function (msg) {
    load.textContent = '';
    load.insertAdjacentText('beforeend', msg);

    load.style.opacity = 1;
};


//Generic function for fetch
const getJSON = function (url, errorMsg = 'Something went wrong. Try again!') {
    return fetch(url).then(response => {
        if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);

        return response.json();
    })
};


// User location weather info
const getUserLocation = position => {

    let { latitude, longitude } = position.coords;

    getJSON(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=61e736aaffed49ea8d3d1a6c73937fac`)

        .then(response => {

            console.log(response);

            let userCity = response.results[0].components.city;
            let userCountry = response.results[0].components.country;
            console.log(userCity);
            console.log(userCountry);

            let html = `${userCity} ${userCountry}`;
            locationInfo.textContent = html;

            let userLongitude = response.results[0].geometry.lng;
            let userLatitude = response.results[0].geometry.lat;
            console.log(userLongitude);
            console.log(userLatitude);

            const apiKey = '88d34708e220df29befe774523767d95eb1fc68dfa3927f9ae';

            return fetch(`https://api.troposphere.io/forecast/${latitude},${longitude}?token=${apiKey}`)

        })
        .then(response => response.json())
        .then(weatherData => {
            console.log(weatherData);

            let userLocationTemp = weatherData.data.current.temperature;
            console.log(userLocationTemp);
            let userLocationWeatherType = weatherData.data.current.type;
            console.log(userLocationWeatherType);

            locationWeather.textContent = `${userLocationTemp}°C ${userLocationWeatherType}`;
        })
        .catch(err => {
            renderError(`Something went wrong ${err.message}. Try again!`);
        });
};


navigator.geolocation.getCurrentPosition(getUserLocation);


// Input city weather info
const searchWeather = function () {

    let cityInput = document.querySelector('.cityInput');
    let cityValue = cityInput.value;

    load.style.display = 'block';

    const apiKey = '88d34708e220df29befe774523767d95eb1fc68dfa3927f9ae';

    if (cityValue === "") {

        load.textContent = '';
        load.textContent = "Please write a valid city name";
        weatherCard.style.opacity = 0;
        btnDailyWeather.style.opacity = 0;

    }
    else {

        getJSON(`https://api.troposphere.io/place/name/${cityValue}?token=${apiKey}`)
            .then(function (data) {

                let latitude = data.data[0].latitude;
                console.log(latitude);

                let longitude = data.data[0].longitude;
                console.log(longitude);

                return fetch(`https://api.troposphere.io/forecast/${latitude},${longitude}?token=${apiKey}`)

            })
            .then(response => response.json())
            .then(weatherData => {
                console.log(weatherData);

                let html = `<p><b>Location:</b>${weatherData.data.timezone}</p>
                    <p><b>Date and Time:</b> ${weatherData.data.current.time}</p>
                    <p><b>Weather type:</b> ${weatherData.data.current.type}</p>
                    <p><b>Current temperature:</b> ${weatherData.data.current.temperature} °C</p>
                     <p><b>Max temperature:</b> ${weatherData.data.current.temperatureMax}<p> 
                     <p><b>Min temperature:</b> ${weatherData.data.current.temperatureMin}<p>`;

                load.style.display = 'none';

                weatherCard.insertAdjacentHTML('beforeend', html);

                cityInput.value = '';

                weatherCard.style.opacity = 1;
                btnDailyWeather.style.opacity = 1;


                if (cityValue === "") {

                    load.textContent = "";
                    load.textContent = "Please write a valid city name";
                    weatherCard.style.opacity = 0;
                    btnDailyWeather.style.opacity = 0;
                }


                // daily wather button

                btnDailyWeather.addEventListener('click', function () {

                    const dataDaily = weatherData.data.daily;
                    const spreadDataDaily = Object.assign(...dataDaily);

                    console.log(spreadDataDaily);

                    spreadDataDaily.forEach(day => {

                        let html = `<div>
                        <p>Date: ${weatherData.data.daily[day].time}</p>
                        <p>Max temperature: ${weatherData.data.daily[day].temperatureMax}</p>
                         <p>Min temperature: ${weatherData.data.daily[day].temperatureMin}</p>
                         <p>Weather type: ${weatherData.data.daily[day].type}</p>
                         </div>`;
                    });

                    showDailyWeather.insertAdjacentHTML('beforeend', html);
                })



            })

            .catch(err => {
                renderError(`City not found. Try again!`);
            });

        weatherCard.textContent = '';
        weatherCard.style.opacity = 0;
        btnDailyWeather.style.opacity = 0;

    };
}

searchButton.addEventListener('click', searchWeather);


