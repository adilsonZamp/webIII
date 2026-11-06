const ClimaAtual = require('../models/ClimaAtual');

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CITY = 'Paranaguá';

const fetchJson = async (url) => {
    let response;

    try {
        response = await fetch(url);
    } catch (error) {
        const upstreamError = new Error('Não foi possível conectar à Open-Meteo.');
        upstreamError.statusCode = 502;
        throw upstreamError;
    }

    if (!response.ok) {
        const upstreamError = new Error(`Open-Meteo respondeu com status ${response.status}.`);
        upstreamError.statusCode = 502;
        throw upstreamError;
    }

    return response.json();
};

const buscarLocalizacao = async () => {
    const params = new URLSearchParams({
        name: CITY,
        count: '10',
        language: 'pt',
        format: 'json',
    });
    const result = await fetchJson(`${GEOCODING_URL}?${params}`);
    const location = result.results?.find(
        (item) => item.country_code === 'BR' && item.admin1 === 'Paraná'
    );

    if (!location) {
        const upstreamError = new Error(`A Open-Meteo não encontrou ${CITY}, Paraná.`);
        upstreamError.statusCode = 502;
        throw upstreamError;
    }

    return location;
};

const criarDataUTC = (localTime, utcOffsetSeconds) => {
    const localTimestamp = Date.parse(`${localTime}Z`);

    if (!Number.isFinite(localTimestamp) || !Number.isFinite(utcOffsetSeconds)) {
        throw new Error('A Open-Meteo retornou uma data de observação inválida.');
    }

    return new Date(localTimestamp - utcOffsetSeconds * 1000);
};

const buscarClima = async () => {
    const location = await buscarLocalizacao();
    const params = new URLSearchParams({
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
    const forecast = await fetchJson(`${FORECAST_URL}?${params}`);
    const current = forecast.current;

    if (!current || !forecast.daily || !forecast.timezone) {
        const upstreamError = new Error('A Open-Meteo retornou uma previsão incompleta.');
        upstreamError.statusCode = 502;
        throw upstreamError;
    }

    await ClimaAtual.upsert({
        cidade: location.name,
        estado: location.admin1,
        pais: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        temperatura: current.temperature_2m,
        umidade_relativa: current.relative_humidity_2m,
        sensacao_termica: current.apparent_temperature,
        precipitacao: current.precipitation,
        codigo_tempo: current.weather_code,
        velocidade_vento: current.wind_speed_10m,
        dia: Boolean(current.is_day),
        observado_em: criarDataUTC(current.time, forecast.utc_offset_seconds),
    });

    return { location, forecast };
};

module.exports = { buscarClima };
