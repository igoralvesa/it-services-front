import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-arrecifes.svg';

export function Layout({ children, tagline = 'Suporte, nuvem e segurança para empresas.' }) {
  const session = JSON.parse(localStorage.getItem('av2_session') || 'null');
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('av2_session');
    navigate('/');
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-branding">
            <img className="site-logo" src={logo} alt="Logotipo da Arrecifes Tecnologia" width="48" height="48" />
            <div>
              <span className="brand-name">Arrecifes Tecnologia LTDA</span>
              <p className="site-tagline">{tagline}</p>
            </div>
          </div>
          <nav className="site-nav" aria-label="Navegação principal">
            <NavLink to="/">Início</NavLink>
            {session ? (
              <>
                <NavLink to="/solicitacoes" id="nav-services">
                  Solicitação de serviços
                </NavLink>
                <NavLink to="/servicos/novo">Cadastrar serviço</NavLink>
                <button type="button" className="nav-button" onClick={logout}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/cadastro">Cadastro</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      {children}
      <footer className="site-footer site-footer--compact">
        <div className="site-footer__inner">
          <p className="text-muted">&copy; Arrecifes Tecnologia — portal de atendimento ao cliente.</p>
        </div>
      </footer>
    </>
  );
}
