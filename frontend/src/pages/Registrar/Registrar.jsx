import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import '../Login/AuthPages.css';

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
        <main className="auth-page">
            <section className="auth-panel auth-panel-register">
                <aside className="auth-showcase" aria-hidden="true">
                    <div className="auth-brand">
                        <span className="auth-brand-mark"><span /></span>
                        <span>WEB III</span>
                    </div>
                    <div className="auth-showcase-orbit auth-showcase-orbit-one" />
                    <div className="auth-showcase-orbit auth-showcase-orbit-two" />
                    <div className="auth-showcase-copy">
                        <span className="auth-showcase-kicker">NOVO POR AQUI?</span>
                        <h2>Seu espaço começa com uma conta.</h2>
                    </div>
                    <div className="auth-showcase-footer">SIMPLES · SEGURO · CONECTADO</div>
                </aside>

                <div className="auth-content">
                    <div className="auth-form-wrap">
                        <span className="auth-kicker">CRIE SEU ACESSO</span>
                        <h1>Criar conta</h1>
                        <p className="auth-description">Preencha seus dados para começar.</p>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <label className="auth-field">
                                <span>Nome</span>
                                <input
                                    type="text"
                                    placeholder="Seu nome"
                                    autoComplete="name"
                                    required
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </label>
                            <label className="auth-field">
                                <span>Email</span>
                                <input
                                    type="email"
                                    placeholder="voce@exemplo.com"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                            <label className="auth-field">
                                <span>Senha</span>
                                <input
                                    type="password"
                                    placeholder="Crie uma senha"
                                    autoComplete="new-password"
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </label>
                            {erro && <p className="auth-error" role="alert">{erro}</p>}
                            <button className="auth-submit" type="submit" disabled={carregando}>
                                {carregando ? 'Criando conta...' : 'Criar conta'}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Já tem uma conta? <a href="/login">Entrar</a>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Registrar;