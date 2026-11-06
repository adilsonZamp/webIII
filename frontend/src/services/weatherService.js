const API_URL = 'http://localhost:3000/clima';

export const getWeather = async (signal) => {
    const response = await fetch(API_URL, { signal });

    if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.err || `O servidor respondeu com erro (${response.status}).`);
    }

    return response.json();
};
