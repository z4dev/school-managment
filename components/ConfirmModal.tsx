import React, { useState, useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  const handleConfirm = () => {
      onConfirm();
      handleClose();
  };


  return (
    <div className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300 backdrop-blur-md ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
       <div className={`bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 ${isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">{title}</h2>
        <p className="text-[var(--text-secondary)] mb-8">{message}</p>
        <div className="flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 rounded-lg text-[var(--text-primary)] bg-black/20 border border-[var(--border-color)] hover:border-[var(--text-secondary)] transition-colors duration-300"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 rounded-lg text-white bg-[var(--accent-magenta)] hover:brightness-125 transition-all duration-300 font-semibold shadow-lg shadow-[var(--accent-magenta)]/30"
          >
            تأكيد الحذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
