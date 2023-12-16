// Importar Axios correctamente
import axios from 'axios';

// 1
// Form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');

// 2
// Results divs
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

// 6
// Call the API
async function displayCarbonUsage(apiKey, region) {
    try {
        const response = await axios.get('https://api.co2signal.com/v1/latest', {
            params: {
                countryCode: region,
            },
            headers: {
                'auth-token': apiKey,
            },
        });

        const CO2 = Math.floor(response.data.data.carbonIntensity);

        // Calculate color here if needed

        loading.style.display = 'none';
        form.style.display = 'none';
        myregion.textContent = region;
        usage.textContent = Math.round(response.data.data.carbonIntensity) +
            ' grams (grams C02 emitted per kilowatt hour)';
        fossilfuel.textContent = response.data.data.fossilFuelPercentage.toFixed(2) +
            '% (percentage of fossil fuels used to generate electricity)';
        results.style.display = 'block';
    } catch (error) {
        console.log(error);
        loading.style.display = 'none';
        results.style.display = 'none';
        errors.textContent = 'Sorry, we have no data for the region you have requested.';
    }
}

// 5
// Set up user's API key and region
function setUpUser(apiKey, regionName) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';

    // Make initial call
    displayCarbonUsage(apiKey, regionName);
}

// 4
// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    setUpUser(apiKey.value, region.value);
}

// 3
// Initial checks
function init() {
    // Si hay algo en localStorage, recójalo
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');

    // Establecer el icono en verde genérico
    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: { color: 'green' },
    });

    if (storedApiKey === null || storedRegion === null) {
        // Si no tenemos las claves, mostrar el formulario
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        // Si hemos guardado claves / regiones en localStorage, mostrar los resultados cuando se cargan
        displayCarbonUsage(storedApiKey, storedRegion);
        results.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
}

// 2
// Set listeners and start app
form.addEventListener('submit', handleSubmit);
clearBtn.addEventListener('click', reset);
init();

function reset() {
    form.style.display = 'block';
    results.style.display = 'none';
    loading.style.display = 'none';
    clearBtn.style.display = 'none';
    errors.textContent = '';
}