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

  useEffect(() => {
    if (studentToEdit) {
      const { attendance, ...editableStudentData } = studentToEdit;
      setStudent(editableStudentData);
    } else {
      setStudent(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

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
  
  const inputStyle = "w-full bg-slate-400/10 backdrop-blur-sm border border-slate-300/20 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all duration-300";


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out backdrop-blur-sm">
      <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl m-4 transform transition-all duration-300 ease-in-out scale-100">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">{studentToEdit ? 'تعديل سجل الطالب' : 'إضافة طالب جديد'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-slate-400 mb-2">
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
              <label htmlFor="gender" className="block text-sm font-medium text-slate-400 mb-2">جنس الطالب</label>
              <select id="gender" name="gender" value={student.gender} onChange={handleChange} className={inputStyle}>
                <option value="ذكر">ذكر</option>
                <option value="انثى">انثى</option>
              </select>
            </div>
            <div>
              <label htmlFor="hasSiblings" className="block text-sm font-medium text-slate-400 mb-2">هل له اخوة في نفس المركز؟</label>
              <select id="hasSiblings" name="hasSiblings" value={student.hasSiblings} onChange={handleChange} className={inputStyle}>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors duration-300">
              إلغاء
            </button>
            <button type="submit" className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 font-semibold shadow-lg shadow-indigo-600/30">
              {studentToEdit ? 'حفظ التغييرات' : 'إضافة طالب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;