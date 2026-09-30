import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Authorization = `Bearer (token fixo se necessário para testes)`;
    return config;
});

export default api