import React, { useState } from 'react';
import { User, Lock, Sparkles, LogIn, Globe, GraduationCap } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (token: string, primaryRole: string, roles: string[]) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, language, setLanguage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data.token, data.roles[0], data.roles);
      } else {
        const err = await response.json().catch(() => ({}));
        setError(err.error || (language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة.' : 'Incorrect username or password.'));
      }
    } catch (err) {
      setError(language === 'ar' 
        ? 'فشل الاتصال بالخادم الرئيسي. يرجى التأكد من تشغيل الباكيند.' 
        : 'Failed to connect to the main server. Please ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const inputStyle = `w-full bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--border-color)] rounded-lg pl-4 ${language === 'ar' ? 'pr-10' : 'pl-10 pr-4'} py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all duration-300`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 text-[var(--text-primary)] login-grid-background overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]"></div>
        
        {/* Top bar language selector */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl text-sm font-semibold hover:border-[var(--accent-primary)] transition-all cursor-pointer shadow-lg"
          >
            <Globe className="h-4.5 w-4.5 text-[var(--accent-primary)]" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>

        <div className="relative w-full max-w-md animate-float">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl blur-lg opacity-40"></div>
            
            <div className="relative bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                      <GraduationCap className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-[var(--accent-primary)] animate-pulse" />
                        {language === 'ar' ? 'مركز مشوار للتدريب' : 'Mishwar Training Center'}
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                      {language === 'ar' ? 'الرجاء تسجيل الدخول للمتابعة' : 'Please log in to continue'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label htmlFor="username" className="sr-only">
                          {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                        </label>
                        <User className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3.5 h-5 w-5 text-[var(--text-secondary)]`} />
                        <input
                          type="text"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={inputStyle}
                          placeholder={language === 'ar' ? 'اسم المستخدم' : 'Username'}
                          required
                          disabled={loading}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="sr-only">
                          {language === 'ar' ? 'كلمة المرور' : 'Password'}
                        </label>
                        <Lock className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3.5 h-5 w-5 text-[var(--text-secondary)]`} />
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={inputStyle}
                          placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
                          required
                          disabled={loading}
                        />
                    </div>
                    
                    {error && (
                      <div className="text-sm text-center text-red-400 border border-red-500/50 bg-red-500/10 rounded-md py-2 px-3">
                          {error}
                      </div>
                    )}

                    <div>
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full px-6 py-3 rounded-lg text-white font-semibold bg-animated-gradient hover:opacity-90 transition-opacity duration-300 text-lg flex justify-center items-center gap-2 cursor-pointer"
                        >
                          {loading ? (language === 'ar' ? 'جاري التحقق...' : 'Verifying...') : (
                            <>
                              <LogIn className="h-5 w-5" />
                              <span>{language === 'ar' ? 'الوصول' : 'Login'}</span>
                            </>
                          )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Login;
