import { Navigate, Route, Routes } from 'react-router-dom';
import { ChangePasswordPage } from './pages/ChangePasswordPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { ServiceCreatePage } from './pages/ServiceCreatePage.jsx';
import { ServiceRequestsPage } from './pages/ServiceRequestsPage.jsx';

function ProtectedRoute({ children }) {
  const session = JSON.parse(localStorage.getItem('av2_session') || 'null');
  return session ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/troca-senha" element={<ChangePasswordPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route
        path="/solicitacoes"
        element={
          <ProtectedRoute>
            <ServiceRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/servicos/novo"
        element={
          <ProtectedRoute>
            <ServiceCreatePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
