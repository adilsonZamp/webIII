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
        <div className="header-profile">
            {usuario.foto ? (
                <img
                    className="header-avatar"
                    src={usuario.foto}
                    alt={usuario.nome}
                    referrerPolicy="no-referrer"
                />
            ) : (
                <span className="header-avatar">{usuario.nome?.charAt(0).toUpperCase()}</span>
            )}
            <div className="header-info">
                <span className="header-name">Olá, {usuario.nome}</span>
                {usuario.email && <span className="header-email">{usuario.email}</span>}
            </div>
        </div>
    );
}