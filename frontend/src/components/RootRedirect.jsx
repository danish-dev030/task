import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RootRedirect() {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === 'creator' ? '/creator' : '/feed'} replace />;
}
