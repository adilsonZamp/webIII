import api from './api'

export const login = async (email, senha) => {
    const response = await api.post('/login', { email, senha });
    return response.data;
}

export const loginGoogle = async (credentials) => {
    const response = await api.post('/auth/google', { credentials });
    return response.data;
}

export const registrar = async (email, senha, nome) => {
    const response = await api.post('/usuarios/criar', { email, senha, nome });
    return response.data;
}

//vulnerável a leitura na máquina, usar cookies httpOnly
export const salvarSessao = (token, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

export const limparSessao = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
}