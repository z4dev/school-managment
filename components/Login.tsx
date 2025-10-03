import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

// In a real application, these values would be loaded from a .env file
// by your build tool (like Vite or Create React App) and you would not
// need to define them here. This is for simulation purposes.
const MOCK_ENV = {
    REACT_APP_USERNAME: 'mazen',
    REACT_APP_PASSWORD: 'farra@mazen1918'
};


const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Securely check against environment variables
    if (username === MOCK_ENV.REACT_APP_USERNAME && password === MOCK_ENV.REACT_APP_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('بيانات الاعتماد غير صحيحة. حاول مرة أخرى.');
    }
  };
  
  const inputStyle = "w-full bg-black/30 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-2 focus:ring-[var(--accent-cyan)]/50 transition-all duration-300";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 text-[var(--text-primary)] login-grid-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]"></div>
        
        <div className="relative w-full max-w-md animate-float">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-magenta)] rounded-2xl blur-lg opacity-40"></div>
            
            <div className="relative bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
                <div className="flex flex-col items-center mb-8">
                     <div className="w-20 h-20 mb-4 flex items-center justify-center text-[var(--accent-cyan)] animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">
                        بروتوكول الوصول
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">مطلوب مصادقة آمنة</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="sr-only">اسم المستخدم</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={inputStyle}
                            placeholder="اسم المستخدم"
                            required
                        />
                    </div>
                    <div>
                         <label htmlFor="password"className="sr-only">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputStyle}
                            placeholder="كلمة المرور"
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="text-sm text-center text-red-400 border border-red-500/50 bg-red-500/10 rounded-md py-2 px-3">
                            {error}
                        </div>
                    )}

                    <div>
                        <button type="submit" className="w-full px-6 py-3 rounded-lg text-white font-semibold bg-animated-gradient hover:opacity-90 transition-opacity duration-300 text-lg">
                            الوصول
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Login;