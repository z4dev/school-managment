import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed bottom-5 right-5 bg-[var(--bg-glass)] backdrop-blur-lg text-white py-3 px-6 rounded-lg shadow-lg animate-fade-in-down flex items-center gap-3 z-50 border-t-2 ${isSuccess ? 'border-[var(--accent-primary)] shadow-[var(--glow-primary)]' : 'border-[var(--accent-danger)] shadow-[var(--glow-danger)]'}`}>
        {isSuccess ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-primary)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-danger)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        )}
      <span className="text-[var(--text-primary)]">{message}</span>
      <button onClick={onClose} className="text-[var(--text-secondary)]/50 hover:text-[var(--text-primary)] text-2xl leading-none -mr-2 ml-2 transition-colors">
        &times;
      </button>
    </div>
  );
};

export default Toast;