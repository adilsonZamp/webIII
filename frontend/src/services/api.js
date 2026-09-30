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

api.interceptors.response.use(
    (response) => response,          // sucesso: repassa direto

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api