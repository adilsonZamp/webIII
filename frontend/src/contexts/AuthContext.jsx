import { createContext, useContext, useState } from "react";
import * as authService from '../services/authService';
import { getUsuario } from "../services/usuarioService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem('usuario');
        //provavel erro ao recuperar dados do localstorage
        if (salvo) {
            console.log("LocalStorage DATA: "+salvo.valueOf() != "undefined" ? salvo : "null");
            if (salvo.valueOf() == "undefined") {
                console.log("LocalStorage DATa undefined: "+salvo ? salvo : "null");        
            }
                
            return salvo.valueOf() != "undefined" ? JSON.parse(salvo) : null;
        }
    })

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    
    const entrar = async (email, senha) => {
        setCarregando(true);
        setErro('');

        try {
            const dados = await authService.login(email, senha);
            console.log("res:"+dados.data.token, "user:"+toString(dados.data.usuario));
            //object promisse error
            authService.salvarSessao(dados.data.token, dados.data.usuario);

            await setUsuario(dados.usuario);
            console.log("getUser(): "+getUsuario(), "localstorage:"+ localStorage.getItem('usuario'));
            
            return true;
        } catch (error) {
            setErro('Email ou senha inválidos');
            return false;
        } finally {
            setCarregando(false);
        }
    }

    const entrarComGoogle = async (credentials) => {
        setCarregando(true);
        setErro('');

        try {
            const dados = await authService.loginGoogle(credentials);

            authService.salvarSessao(dados.token, dados.usuario);

            setUsuario(dados.usuario);
            
            return true;
        } catch (error) {
            setErro('Não foi possível entrar com o Google');
            return false;
        } finally {
            setCarregando(false);
        }
    }

    const registrar = async (email, senha, nome) => {
        setCarregando(true);
        setErro('');

        try {
            const dados = await authService.registrar(email, senha, nome);
            authService.salvarSessao(dados.token, dados.usuario);
            setUsuario(dados.usuario);
            return true;
        } catch (error) {
            setErro('Erro ao criar usuário', error);
            return false;
        } finally {
            setCarregando(false);
        }
    }
    
    const sair = () => {
        authService.limparSessao();
        setUsuario(null);    
    }

    return (
        <AuthContext.Provider
            value={{ usuario, entrar, sair, carregando, erro, registrar, entrarComGoogle}}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);