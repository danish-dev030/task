import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToastStore();

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      setAuth(data.user, data.token);
      navigate(data.user.role === 'creator' ? '/creator' : '/feed');
    } catch (err) {
      showToast(err?.response?.data?.error || 'Login failed', 'error');
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to continue">
      <form onSubmit={handleSubmit(onSubmit)} className="stack">
        <input placeholder="Email" {...register('email', { required: true })} />
        <input type="password" placeholder="Password" {...register('password', { required: true, minLength: 6 })} />
        <button className="btn" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Signing in...' : 'Log In'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthCard>
  );
}
