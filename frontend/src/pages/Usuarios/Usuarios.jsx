import { useState, useEffect } from 'react';
import { getUsuarios, createUsuario } from '../../services/usuarioService';
import WeatherCard from '../../components/WeatherCard';
import './Usuarios.css';

function Usuarios() {
    const [modalAberto, setModalAberto] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({ nome: '', email: '', senha: '' });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSalvar = async (e) => {
        e.preventDefault();

        try {
            console.log("DADOS: " + JSON.stringify(form, null, 2));

            await createUsuario(form);
            setForm({ nome: '', email: '', senha: '' });
            
            alteraModal(false);
            await fetchUsuarios();
        } catch (err) {
            console.log(err);
        }
    };

    const fetchUsuarios = async () => {
        try {            
            const data = await getUsuarios();
            setUsers(data.data || []);
        } catch (err) {
            setError(err.response?.data?.err || err.message || 'Erro ao buscar usuários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const alteraModal = (estado) => {
        setModalAberto(estado);
    }

    return (
        <main className="users-page">
            <section className="users-heading">
                <div>
                    <span className="users-eyebrow">GERENCIAMENTO</span>
                    <h1>Lista de Usuários e Tempo</h1>
                    <p>Consulte e gerencie os usuários cadastrados.</p>
                </div>
                <button className="users-primary-button" onClick={() => alteraModal(true)} type="button">
                    Novo usuário
                </button>
            </section>

            <WeatherCard />

            {modalAberto && (
                <div
                    className="users-modal-overlay"
                    onClick={() => setModalAberto(false)}
                >
                    <div
                        className="users-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="users-modal-close"
                            onClick={() => setModalAberto(false)}
                            aria-label="Fechar"
                        >
                            ×
                        </button>

                        <span className="users-eyebrow">NOVO CADASTRO</span>
                        <h2 className="users-modal-title">Cadastrar usuário</h2>

                        <form
                            className="users-modal-form"
                            onSubmit={handleSalvar}
                        >
                            <label className="users-modal-label">
                                Nome:
                                <input
                                    className="users-modal-input"
                                    type="text"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    autoFocus
                                    required
                                />
                            </label>

                            <label className="users-modal-label">
                                Email:
                                <input
                                    className="users-modal-input"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="users-modal-label">
                                Senha:
                                <input
                                    className="users-modal-input"
                                    type="password"
                                    name="senha"
                                    value={form.senha}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <div className="users-modal-actions">
                                <button
                                    type="submit"
                                    className="users-primary-button"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading && <div className="users-message">Carregando usuários...</div>}

            {error && <div className="users-message users-message-error">Ops! {error}</div>}

            {!loading && !error && users.length === 0 && (
                <div className="users-message">Nenhum usuário encontrado no momento.</div>
            )}

            {!loading && !error && users.length > 0 && (
                <ul className="users-list">
                    {users.map(user => (
                        <li key={user.id} className="users-card">
                            <div className="users-card-avatar" aria-hidden="true">
                                {user.nome?.trim()?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="users-card-info">
                                <span className="users-card-name">{user.nome}</span>
                                <span className="users-card-email">{user.email}</span>
                            </div>
                            <div className="users-id-badge">ID #{user.id}</div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}

export default Usuarios;