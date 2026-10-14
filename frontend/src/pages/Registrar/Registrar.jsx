import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Registrar() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');

    const {registrar, carregando, erro} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const deuCerto = await registrar(email, senha, nome);

        if (deuCerto) {
            navigate('/usuarios');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Criar conta</h1>

                <input type="nome" placeholder="Nome" required value={nome} onChange={(e) => {setNome(e.target.value)}}/>
                <input type="email" placeholder="Email" required value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                <input type="password" placeholder="Senha" required value={senha} onChange={(e) => {setSenha(e.target.value)}}/>
                {erro && <p style={{color: 'red'}}>{erro}</p>}
                <button type="submit" disabled={carregando}>
                    {carregando ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <a href="/login">Login</a>
        </div>

    );
}

export default Registrar;