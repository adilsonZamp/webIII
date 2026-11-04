import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLogin } from '@react-oauth/google'
import './AuthPages.css';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const {entrar, carregando, erro, entrarComGoogle} = useAuth();
    const navigate = useNavigate();

    const handleGoogle = async (resposta) => {
        // resposta.credential é o id_token assinado pelo Google
        const deuCerto = await entrarComGoogle(resposta.credential);
        if (deuCerto) navigate('/usuarios');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const deuCerto = await entrar(email, senha);

        if (deuCerto) {
            console.log("AAAAAAA OLHA DEU CERTO");
            
            navigate('/usuarios');
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-panel">
                <aside className="auth-showcase" aria-hidden="true">
                    <div className="auth-brand">
                        <span className="auth-brand-mark"><span /></span>
                        <span>WEB III</span>
                    </div>
                    <div className="auth-showcase-orbit auth-showcase-orbit-one" />
                    <div className="auth-showcase-orbit auth-showcase-orbit-two" />
                    <div className="auth-showcase-copy">
                        <span className="auth-showcase-kicker">ÁREA DO SISTEMA</span>
                        <h2>Organização e acesso em um só lugar.</h2>
                    </div>
                    <div className="auth-showcase-footer">GESTÃO · USUÁRIOS · INFORMAÇÃO</div>
                </aside>

                <div className="auth-content">
                    <div className="auth-form-wrap">
                        <span className="auth-kicker">BEM-VINDO DE VOLTA</span>
                        <h1>Entrar</h1>
                        <p className="auth-description">Acesse sua conta para continuar.</p>

                        <form className="auth-form" onSubmit={handleSubmit}>
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
                                    placeholder="Sua senha"
                                    autoComplete="current-password"
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </label>
                            {erro && <p className="auth-error" role="alert">{erro}</p>}
                            <button className="auth-submit" type="submit" disabled={carregando}>
                                {carregando ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>

                        <div className="auth-divider"><span>ou continue com</span></div>
                        <div className="auth-google">
                            <GoogleLogin
                                onSuccess={handleGoogle}
                                onError={() => console.log('Login com Google falhou')}
                            />
                        </div>

                        <p className="auth-switch">
                            Ainda não tem uma conta? <a href="/registrar">Criar conta</a>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;