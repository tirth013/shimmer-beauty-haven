import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import SummaryApi, { baseURL } from '../common/summaryApi';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Axios from '@/utils/Axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await Axios({
        method: SummaryApi.register.method,
        url: SummaryApi.register.url,
        data: {
          name: form.name,
          email: form.email,
          password: form.password,
        },
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
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
          Create Your Account
        </h2>
        {error && <p className="text-destructive text-center mb-4 text-sm">{error}</p>}
        {success && <p className="text-primary text-center mb-4 text-sm">{success}</p>}
        <div className="mb-5">
          <label className="block text-muted-foreground mb-1 font-medium" htmlFor="name">Name</label>
          <Input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            autoComplete="name"
            required
            className="bg-background border-input focus:ring-primary"
          />
        </div>
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
        <div className="mb-5 relative">
          <label className="block text-muted-foreground mb-1 font-medium" htmlFor="password">Password</label>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="new-password"
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
        <div className="mb-6 relative">
          <label className="block text-muted-foreground mb-1 font-medium" htmlFor="confirmPassword">Confirm Password</label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            className="bg-background border-input focus:ring-primary pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-primary"
            tabIndex={-1}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <Button
          type="submit"
          variant="luxury"
          className="w-full text-lg font-semibold shadow-luxury"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline font-medium">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
