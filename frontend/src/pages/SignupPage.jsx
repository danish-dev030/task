import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function SignupPage() {
  const { register, handleSubmit, watch, formState } = useForm();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useToastStore();

  const onSubmit = async ({ name, email, password, role }) => {
    try {
      const payload = {
        name,
        email,
        password,
        role: role || 'consumer'
      };
      const { data } = await api.post('/auth/signup', payload);
      setAuth(data.user, data.token);
      navigate(data.user.role === 'creator' ? '/creator' : '/feed');
    } catch (err) {
      showToast(err?.response?.data?.error || 'Signup failed', 'error');
    }
  };

  return (
    <AuthCard title="Create account" subtitle="Start discovering photos">
      <form onSubmit={handleSubmit(onSubmit)} className="stack">
        <input placeholder="Name" {...register('name', { required: true })} />
        <input placeholder="Email" {...register('email', { required: true })} />
        <input type="password" placeholder="Password" {...register('password', { required: true, minLength: 6 })} />
        <select {...register('role')}>
          <option value="consumer">Viewer</option>
          <option value="creator">Creator</option>
        </select>
        <input
          type="password"
          placeholder="Confirm password"
          {...register('confirmPassword', {
            validate: (v) => v === watch('password') || 'Passwords do not match'
          })}
        />
        {formState.errors.confirmPassword ? <small className="error">{formState.errors.confirmPassword.message}</small> : null}
        <button className="btn" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthCard>
  );
}
