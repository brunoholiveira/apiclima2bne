const markers = [];

// Inicializa o mapa
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20, lng: 0 },
        zoom: 2,
    });

    // Adiciona um listener de clique no mapa
    map.addListener("click", (event) => {
        addMarker(event.latLng);
        getWeather(event.latLng);
    });
}

// Adiciona um marcador ao mapa
function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
}

// Obtém dados do clima da OpenWeatherMap
async function getWeather(location) {
    const lat = location.lat();
    const lon = location.lng();
    const apiKey = '280d0f22003a0540a8d84d83e024e343';
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    
    if (response.ok) {
        const data = await response.json();
        alert(`Clima em ${data.name}: ${data.weather[0].description}, Temperatura: ${data.main.temp}°C`);
    } else {
        alert('Erro ao obter dados climáticos');
    }
}

// Chama a função para inicializar o mapa
initMap();

document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if(!cityName){
        return showAlert('Você precisa digitar uma cidade...');
    }

    const apiKey = '280d0f22003a0540a8d84d83e024e343';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`

    const result = await fetch(apiUrl);
    const json = await result.json();

    if (json.cod === 200){
        showInfo({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            description: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
        })
    }else{
        showAlert('Não foi possível localizar...')
    }
});

function showInfo(json){
    showAlert('');

    document.querySelector('#weather').classList.add('show');

    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;

    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace(".", ",")} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`)
    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)}km/h`;
}

function showAlert(msg){
    document.querySelector('#alert').innerHTML = msg;
}