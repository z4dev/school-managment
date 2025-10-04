import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id' | 'attendance'> | Student) => void;
  studentToEdit: Student | null;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ isOpen, onClose, onSubmit, studentToEdit }) => {
  const initialState: Omit<Student, 'id' | 'attendance'> = {
    timestamp: new Date().toLocaleString(),
    fullName: '',
    studentId: '',
    gender: 'ذكر',
    grade: '',
    mobile: '',
    hasSiblings: 'لا',
    nearestLandmark: '',
  };

  const [student, setStudent] = useState(studentToEdit || initialState);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      const { attendance, ...editableStudentData } = studentToEdit;
      setStudent(editableStudentData);
    } else {
      setStudent(initialState);
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen && !isClosing) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(student);
  };

  const fields = [
    { name: 'fullName', label: 'اسم الطالب رباعي', type: 'text' },
    { name: 'studentId', label: 'رقم هوية الطالب', type: 'text' },
    { name: 'grade', label: 'الطالب في الصف', type: 'text' },
    { name: 'mobile', label: 'رقم الموبايل', type: 'text' },
    { name: 'nearestLandmark', label: 'أقرب معلم', type: 'text' },
  ];
  
  const inputStyle = "w-full bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all duration-300";


  return (
    <div className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300 backdrop-blur-md ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl shadow-2xl p-8 w-full max-w-2xl m-4 transform transition-all duration-300 ${isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">{studentToEdit ? 'تعديل سجل الطالب' : 'إضافة طالب جديد'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={student[field.name as keyof typeof student]}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>
            ))}
             <div>
              <label htmlFor="gender" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">جنس الطالب</label>
              <select id="gender" name="gender" value={student.gender} onChange={handleChange} className={inputStyle}>
                <option value="ذكر">ذكر</option>
                <option value="انثى">انثى</option>
              </select>
            </div>
            <div>
              <label htmlFor="hasSiblings" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">هل له اخوة في نفس المركز؟</label>
              <select id="hasSiblings" name="hasSiblings" value={student.hasSiblings} onChange={handleChange} className={inputStyle}>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
            <button type="button" onClick={handleClose} className="px-6 py-2 rounded-lg text-[var(--text-primary)] bg-black/20 border border-[var(--border-color)] hover:border-[var(--text-secondary)] transition-colors duration-300">
              إلغاء
            </button>
            <button type="submit" className="px-6 py-2 rounded-lg text-white font-semibold bg-animated-gradient hover:opacity-90 transition-opacity duration-300">
              {studentToEdit ? 'حفظ التغييرات' : 'إضافة طالب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;