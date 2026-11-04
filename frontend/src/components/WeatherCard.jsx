import { createElement, useEffect, useState } from 'react';
import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSnow,
    Droplets,
    MapPin,
    RefreshCw,
    Sun,
    Thermometer,
    Wind,
} from 'lucide-react';
import { getWeather } from '../services/weatherService';
import './WeatherCard.css';

const getWeatherDescription = (code) => {
    if (code === 0) return 'Céu limpo';
    if (code === 1) return 'Predominantemente limpo';
    if (code === 2) return 'Parcialmente nublado';
    if (code === 3) return 'Nublado';
    if (code === 45 || code === 48) return 'Neblina';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Garoa';
    if ([61, 63, 65, 66, 67].includes(code)) return 'Chuva';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Neve';
    if ([80, 81, 82].includes(code)) return 'Pancadas de chuva';
    if ([95, 96, 99].includes(code)) return 'Trovoadas';
    return 'Condições variáveis';
};

const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) return Sun;
    if (code === 2 || code === 3) return Cloud;
    if (code === 45 || code === 48) return CloudFog;
    if ([51, 53, 55, 56, 57].includes(code)) return CloudDrizzle;
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return CloudRain;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return CloudSnow;
    if ([95, 96, 99].includes(code)) return CloudLightning;
    return Cloud;
};

const formatTemperature = (temperature) => `${Math.round(temperature)}°`;

const formatForecastDay = (date, index) => {
    if (index === 0) return 'Hoje';

    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
        .format(new Date(`${date}T12:00:00`))
        .replace('.', '');
};

function WeatherCard() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadCount, setReloadCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        const loadWeather = async () => {
            setLoading(true);
            setError('');

            try {
                const result = await getWeather(controller.signal);
                setWeather(result);
            } catch (requestError) {
                if (!controller.signal.aborted) {
                    setError(requestError.message || 'Não foi possível carregar a previsão do tempo.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadWeather();
        return () => controller.abort();
    }, [reloadCount]);

    if (loading) {
        return (
            <section className="weather-card" aria-live="polite">
                <p className="weather-status">Carregando previsão do tempo...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="weather-card weather-error" aria-live="polite">
                <p>{error}</p>
                <button
                    className="weather-retry"
                    type="button"
                    onClick={() => setReloadCount((count) => count + 1)}
                >
                    <RefreshCw size={16} aria-hidden="true" />
                    Tentar novamente
                </button>
            </section>
        );
    }

    const { location, forecast } = weather;
    const current = forecast.current;
    const currentTime = current.time.slice(11, 16);

    return (
        <section className="weather-card" aria-label={`Previsão do tempo para ${location.name}`}>
            <header className="weather-header">
                <div>
                    <p className="weather-eyebrow">Previsão do tempo</p>
                    <h2 className="weather-location">
                        <MapPin size={18} aria-hidden="true" />
                        {location.name}, {location.admin1}
                    </h2>
                </div>
                <span className="weather-updated">Atualizado às {currentTime}</span>
            </header>

            <div className="weather-current">
                <div className="weather-condition">
                    {createElement(getWeatherIcon(current.weather_code), {
                        size: 48,
                        strokeWidth: 1.6,
                        'aria-hidden': true,
                    })}
                    <div>
                        <strong>{formatTemperature(current.temperature_2m)}</strong>
                        <span>{getWeatherDescription(current.weather_code)}</span>
                    </div>
                </div>

                <div className="weather-details">
                    <div className="weather-detail">
                        <Thermometer size={18} aria-hidden="true" />
                        <span>Sensação</span>
                        <strong>{formatTemperature(current.apparent_temperature)}</strong>
                    </div>
                    <div className="weather-detail">
                        <Droplets size={18} aria-hidden="true" />
                        <span>Umidade</span>
                        <strong>{current.relative_humidity_2m}%</strong>
                    </div>
                    <div className="weather-detail">
                        <Wind size={18} aria-hidden="true" />
                        <span>Vento</span>
                        <strong>{Math.round(current.wind_speed_10m)} km/h</strong>
                    </div>
                    <div className="weather-detail">
                        <CloudRain size={18} aria-hidden="true" />
                        <span>Chuva</span>
                        <strong>{current.precipitation} mm</strong>
                    </div>
                </div>
            </div>

            <div className="weather-forecast" aria-label="Previsão para os próximos dias">
                {forecast.daily.time.map((date, index) => {
                    const code = forecast.daily.weather_code[index];

                    return (
                        <div className="weather-day" key={date}>
                            <span>{formatForecastDay(date, index)}</span>
                            {createElement(getWeatherIcon(code), {
                                size: 22,
                                strokeWidth: 1.7,
                                'aria-hidden': true,
                            })}
                            <strong>{formatTemperature(forecast.daily.temperature_2m_max[index])}</strong>
                            <span className="weather-min">
                                {formatTemperature(forecast.daily.temperature_2m_min[index])}
                            </span>
                            <span className="weather-day-description">{getWeatherDescription(code)}</span>
                        </div>
                    );
                })}
            </div>

            <footer className="weather-attribution">
                Dados meteorológicos por{' '}
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
            </footer>
        </section>
    );
}

export default WeatherCard;
