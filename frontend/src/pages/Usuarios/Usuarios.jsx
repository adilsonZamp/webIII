import { useState, useEffect } from 'react';
import { getUsuarios, createUsuario } from '../../services/usuarioService';
import { formToJSON } from 'axios';

function Usuarios() {
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
            console.log("DADOS: "+JSON.stringify(form, null, 2));
            
            await createUsuario(form);
            setForm({ nome: '', email: '', senha: '' });
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

    const abreModal = (e) => {
        e.preventDefault();

        //abrir modal
    }

    return (
        <div className="page-container">
            <section style={styles.innerBanner}>
                <h1>Lista de Usuários</h1>
                <button style={styles.botaoNovoUsuario} onClick={abreModal} type="button">Novo Usuário</button>
            </section>

            <div className="modal-overlay">
                <h2>Cadastrar Usuario</h2>

                <form onSubmit={handleSalvar}>
                    <label>
                    Nome:
                    <input
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        autoFocus
                    />
                    </label>

                    <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    </label>

                    <label>
                    Senha:
                    <input
                        type="password"
                        name="senha"
                        value={form.senha}
                        onChange={handleChange}
                    />
                    </label>

                    <div className="modal-actions">
                    <button type="submit">Salvar</button>
                    </div>
                </form>
            </div>

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