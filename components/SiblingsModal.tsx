import React, { useState, useEffect, useMemo } from 'react';
import { Student } from '../types';

interface SiblingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

const SiblingsModal: React.FC<SiblingsModalProps> = ({ isOpen, onClose, students }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      setSearchTerm(''); // Reset search on close
    }
  }, [isOpen]);

  const siblingGroups = useMemo(() => {
    const studentsWithSiblings = students.filter(s => s.hasSiblings.trim() === 'نعم' && s.mobile && s.mobile.trim() !== '');
    
    // FIX: Use generic on `reduce` to ensure `groupsByMobile` is correctly typed,
    // which in turn types `siblingGroups` as `Student[][]` and fixes the access to `.length`.
    const groupsByMobile = studentsWithSiblings.reduce((acc: Record<string, Student[]>, student) => {
      // Normalize mobile number by removing non-digit characters to group variations together
      const mobile = student.mobile.replace(/\D/g, '');
      if (!mobile) return acc;
      if (!acc[mobile]) {
        acc[mobile] = [];
      }
      acc[mobile].push(student);
      return acc;
    }, {});

    return Object.values(groupsByMobile)
      .filter(group => group.length > 1)
      .sort((a, b) => b.length - a.length); // Show larger families first
  }, [students]);
  
  const filteredSiblingGroups = useMemo(() => {
    if (!searchTerm.trim()) {
      return siblingGroups;
    }
    
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    return siblingGroups.filter(group => {
      const mobileMatch = group[0].mobile.toLowerCase().includes(lowercasedSearchTerm);
      const nameMatch = group.some(student => 
        student.fullName.toLowerCase().includes(lowercasedSearchTerm)
      );
      return mobileMatch || nameMatch;
    });
  }, [siblingGroups, searchTerm]);


  if (!isOpen && !isClosing) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  const inputStyle = "w-full bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all duration-300";


  return (
    <div className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300 backdrop-blur-md ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl shadow-2xl p-8 w-full max-w-3xl m-4 transform transition-all duration-300 flex flex-col ${isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{maxHeight: '85vh'}}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-info)] to-[var(--accent-primary)]">
                مجموعات الإخوة ({filteredSiblingGroups.length} عائلة)
            </h2>
             <button onClick={handleClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="mb-4 relative">
             <input
                type="search"
                placeholder="ابحث بالاسم أو رقم الاتصال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputStyle} pl-10`}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        
        <div className="overflow-y-auto pr-2 -mr-2 flex-grow">
          {filteredSiblingGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSiblingGroups.map((group, index) => (
                <div key={index} className="bg-[rgba(10,15,26,0.5)] border border-[var(--border-color)] rounded-lg p-4">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    عائلة برقم الاتصال: <span className="font-semibold text-[var(--text-primary)]">{group[0].mobile}</span>
                  </p>
                  <ul className="space-y-2">
                    {group.map(student => (
                      <li key={student.id} className="flex items-center gap-3 text-sm">
                         <span className={`w-2 h-2 rounded-full ${student.gender === 'ذكر' ? 'bg-[var(--accent-primary)]' : 'bg-[var(--accent-secondary)]'}`}></span>
                         <span className="text-[var(--text-primary)] font-medium">{student.fullName}</span>
                         <span className="text-xs text-[var(--text-secondary)]">({student.grade})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--accent-info)]/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                    {searchTerm ? 'لا توجد نتائج بحث مطابقة' : 'لم يتم العثور على مجموعات إخوة'}
                </p>
                <p className="text-[var(--text-secondary)] mt-1">
                    {searchTerm ? 'حاول استخدام كلمات بحث مختلفة.' : 'لا يوجد طلاب لديهم إخوة في القائمة الحالية.'}
                </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
            <button type="button" onClick={handleClose} className="px-6 py-2 rounded-lg text-[var(--text-primary)] bg-black/20 border border-[var(--border-color)] hover:border-[var(--text-secondary)] transition-colors duration-300">
              إغلاق
            </button>
        </div>
      </div>
    </div>
  );
};

export default SiblingsModal;