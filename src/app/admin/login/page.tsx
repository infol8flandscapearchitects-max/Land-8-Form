'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/actions/auth';
import { Lock, Mail, Eye, EyeOff, Building2 } from 'lucide-react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');

  // Fetch logo from database
  useEffect(() => {
    const fetchLogoData = async () => {
      try {
        const response = await fetch('/api/logo');
        const data = await response.json();
        if (data?.logo_url) {
          setLogoUrl(data.logo_url);
        }
        if (data?.company_name) {
          setCompanyName(data.company_name);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogoData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        toast.success('Login successful!');
        router.push('/admin/dashboard');
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Toaster position="top-right" />

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Company Logo"
                  width={150}
                  height={75}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <Building2 size={60} />
              )}
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to access your admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="admin@company.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-admin-primary login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>{companyName || 'Architecture'} Admin Panel</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          padding: 24px;
        }
        
        .login-container {
          width: 100%;
          max-width: 420px;
        }
        
        .login-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .login-logo {
          width: 160px;
          height: 80px;
          margin: 0 auto 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }
        
        .login-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 8px;
        }
        
        .login-subtitle {
          color: #94a3b8;
          font-size: 0.9375rem;
        }
        
        .login-form {
          margin-bottom: 24px;
        }
        
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-icon {
          position: absolute;
          left: 16px;
          color: #64748b;
          pointer-events: none;
        }
        
        .input-with-icon .form-input {
          padding-left: 48px;
          padding-right: 48px;
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease;
        }
        
        .password-toggle:hover {
          color: #94a3b8;
        }
        
        .login-btn {
          width: 100%;
          padding: 14px 24px;
          font-size: 1rem;
          margin-top: 8px;
        }
        
        .login-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid rgba(71, 85, 105, 0.5);
        }
        
        .login-footer p {
          color: #64748b;
          font-size: 0.8125rem;
        }
      `}</style>
    </div>
  );
}
