const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CITY = 'Paranaguá';

const requestJson = async (url, signal) => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`A API do tempo respondeu com erro (${response.status}).`);
    }

    return response.json();
};

export const getWeather = async (signal) => {
    const geocodingParams = new URLSearchParams({
        name: CITY,
        count: '1',
        language: 'pt',
        format: 'json',
    });
    const locations = await requestJson(`${GEOCODING_URL}?${geocodingParams}`, signal);
    const location = locations.results?.[0];

    if (!location) {
        throw new Error(`Não foi possível localizar ${CITY}.`);
    }

    const forecastParams = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'precipitation',
            'weather_code',
            'wind_speed_10m',
            'is_day',
        ].join(','),
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        forecast_days: '5',
        temperature_unit: 'celsius',
        wind_speed_unit: 'kmh',
        precipitation_unit: 'mm',
        timezone: 'auto',
    });
    const forecast = await requestJson(`${FORECAST_URL}?${forecastParams}`, signal);

    if (!forecast.current || !forecast.daily) {
        throw new Error('A previsão recebida está incompleta. Tente novamente mais tarde.');
    }

    return { location, forecast };
};
