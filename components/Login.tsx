
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (role: string) => void;
}

const users = [
    { username: 'mazen', password: 'farra@mazen1918', role: 'admin' },
    { username: 'tariq', password: 'tariq@mishwar.edu', role: 'viewer' }
];


const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      onLoginSuccess(user.role);
    } else {
      setError('بيانات الاعتماد غير صحيحة. حاول مرة أخرى.');
    }
  };
  
  const inputStyle = "w-full bg-black/30 backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all duration-300";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 text-[var(--text-primary)] login-grid-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]"></div>
        
        <div className="relative w-full max-w-md animate-float">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl blur-lg opacity-40"></div>
            
            <div className="relative bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
                <div className="flex flex-col items-center mb-8">
                    <img src="https://i.ibb.co/5WQkFcDQ/logo-mazen-Farra-removebg-preview.png" alt="Meshwar Training Center Logo" className="w-24 h-24 mb-4 object-contain" />
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-200 to-slate-400 text-transparent bg-clip-text">
                        مركز مشوار للتدريب
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">الرجاء تسجيل الدخول للمتابعة</p>
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
