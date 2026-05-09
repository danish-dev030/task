import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ role = 'any', children }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'any' && user?.role !== role) {
    return <Navigate to={user?.role === 'creator' ? '/creator' : '/feed'} replace />;
  }
  return children;
}
