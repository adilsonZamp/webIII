import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
    const { usuario, sair } = useAuth();
    const navigate = useNavigate();

    const handleSair = () => {
        sair();
        navigate('/login');
    };

    if (!usuario) return null;

    return (
        <header>
            <span>Olá, {usuario.nome}</span>

            {/* O botão só aparece para admin */}
            {usuario.perfil === 'admin' && (
                <button onClick={() => navigate('/admin')}>Painel</button>
            )}

            <button onClick={handleSair}>Sair</button>
        </header>
    );
}