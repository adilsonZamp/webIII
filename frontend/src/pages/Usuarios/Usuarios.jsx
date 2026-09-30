import { useState, useEffect } from 'react';
import { getUsuarios, createUsuario } from '../../services/usuarioService';
import { formToJSON } from 'axios';

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
        <div className="page-container">
            <section style={styles.innerBanner}>
                <h1>Lista de Usuários</h1>
                <button style={styles.botaoNovoUsuario} onClick={() => alteraModal(true)} type="button">Novo Usuário</button>
            </section>

            {modalAberto && (
                <div
                    style={styles.modalOverlay}
                    onClick={() => setModalAberto(false)}
                >
                    <div
                        style={styles.modalContainer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            style={styles.modalClose}
                            onClick={() => setModalAberto(false)}
                        >
                            ×
                        </button>

                        <h2 style={styles.modalTitle}>Cadastrar Usuario</h2>

                        <form
                            style={styles.modalForm}
                            onSubmit={handleSalvar}
                        >
                            <label style={styles.modalLabel}>
                                Nome:
                                <input
                                    style={styles.modalInput}
                                    type="text"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </label>

                            <label style={styles.modalLabel}>
                                Email:
                                <input
                                    style={styles.modalInput}
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </label>

                            <label style={styles.modalLabel}>
                                Senha:
                                <input
                                    style={styles.modalInput}
                                    type="password"
                                    name="senha"
                                    value={form.senha}
                                    onChange={handleChange}
                                />
                            </label>

                            <div style={styles.modalActions}>
                                <button
                                    type="submit"
                                    style={styles.modalSaveButton}
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading && <div style={styles.message}>Carregando usuários...</div>}

            {error && <div style={styles.message}>Ops! {error}</div>}

            {!loading && !error && users.length === 0 && (
                <div style={styles.message}>Nenhum usuário encontrado no momento.</div>
            )}

            {!loading && !error && users.length > 0 && (
                <ul style={styles.userList}>
                    {users.map(user => (
                        <li key={user.id} style={styles.userCard}>
                            <div style={styles.userInfo}>
                                <span style={styles.userName}>{user.nome}</span>
                                <span style={styles.userEmail}>{user.email}</span>
                            </div>
                            <div style={styles.statusBadge}>ID #{user.id}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}



const styles = {
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modalContainer: {
        position: 'relative',
        width: '90%',
        maxWidth: '500px',
        padding: '30px',
        backgroundColor: 'var(--card-bg)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    },

    modalTitle: {
        marginTop: 0,
    },

    modalForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },

    modalLabel: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },

    modalInput: {
        padding: '10px',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        backgroundColor: 'var(--card-bg)',
        color: 'var(--text-primary)',
    },

    modalClose: {
        position: 'absolute',
        top: '10px',
        right: '15px',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-primary)',
        fontSize: '28px',
        cursor: 'pointer',
    },

    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '10px',
    },

    modalSaveButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2563eb',
        color: 'white',
        cursor: 'pointer',
    },

    usersList: {
        listStyleType: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
    },
    userCard: {
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '4px',
    },
    userEmail: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
    },
    statusBadge: {
        background: 'var(--badge-bg)',
        color: 'var(--primary-color)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    message: {
        textAlign: 'center',
        color: 'var(--text-secondary)',
        margin: '2rem 0',
        fontSize: '1.2rem',
    },
    innerBanner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    botaoNovoUsuario: {
        backgroundColor: '#2563eb',
        color: '#ffffff',

        border: 'none',
        borderRadius: '6px',
        padding: '10px 18px',

        fontSize: '0.95rem',
        fontWeight: '600',

        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
    },
};

export default Usuarios;