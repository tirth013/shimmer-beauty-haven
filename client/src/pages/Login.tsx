import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Axios from '@/utils/Axios';
import SummaryApi from '../common/summaryApi';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();
  const { fetchUserCart } = useCart();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const response = await Axios({
        method: SummaryApi.login.method,
        url: SummaryApi.login.url,
        data: form,
      });
      
      if (response.data.data.accessToken) {
        localStorage.setItem('accesstoken', response.data.data.accessToken);
      }
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      localStorage.setItem('isLoggedIn', 'true');
      
      // Merge local cart BEFORE fetching the user's new cart
      const localCart = JSON.parse(localStorage.getItem('shimmer_cart') || '[]');
      if (localCart.length > 0) {
        await Axios.post(SummaryApi.mergeCart.url, { localCart });
        localStorage.removeItem('shimmer_cart'); // Clear local cart after merging
      }
      
      await checkAuthStatus(); // This will now also fetch the user's cart
      
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-luxury animate-fade-in py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-card shadow-elegant rounded-2xl p-8 w-full max-w-md border border-border animate-fade-in"
      >
        <h2 className="text-3xl font-playfair font-bold mb-6 text-center text-transparent bg-gradient-to-r from-primary to-primary-glow bg-clip-text drop-shadow-lg">
          Login to Shimmer
        </h2>
        {error && <p className="text-destructive text-center mb-4 text-sm">{error}</p>}
        <div className="mb-5">
          <label className="block text-muted-foreground mb-1 font-medium" htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="bg-background border-input focus:ring-primary"
          />
        </div>
        <div className="mb-6 relative">
          <label className="block text-muted-foreground mb-1 font-medium" htmlFor="password">Password</label>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="bg-background border-input focus:ring-primary pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-primary"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="mb-4 flex justify-between items-center text-sm">
          <a href="/forgot-password" className="text-primary hover:underline font-medium">Forgot password?</a>
        </div>
        <div className="mb-6 text-center text-sm text-muted-foreground">
          No account? <a href="/register" className="text-primary hover:underline font-medium">Register.</a>
        </div>
        <Button
          type="submit"
          variant="luxury"
          className="w-full text-lg font-semibold shadow-luxury"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default Login;