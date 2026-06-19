import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id' | 'attendance'> | Student) => void;
  studentToEdit: Student | null;
  language: 'ar' | 'en';
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ isOpen, onClose, onSubmit, studentToEdit, language }) => {
  const initialState: Omit<Student, 'id' | 'attendance'> = {
    fullName: '',
    studentId: '',
    gender: 'ذكر',
    grade: '',
    mobile: '',
    hasSiblings: 'لا',
    nearestLandmark: '',
    parentId: null
  };

  const [student, setStudent] = useState<Omit<Student, 'id' | 'attendance'> | Student>(studentToEdit || initialState);
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
    { name: 'fullName', label: language === 'ar' ? 'اسم الطالب رباعي' : 'Student Full Name', type: 'text' },
    { name: 'studentId', label: language === 'ar' ? 'رقم هوية الطالب' : 'Student ID Number', type: 'text' },
    { name: 'mobile', label: language === 'ar' ? 'رقم الموبايل' : 'Mobile Number', type: 'text' },
    { name: 'nearestLandmark', label: language === 'ar' ? 'أقرب معلم' : 'Nearest Landmark', type: 'text' },
  ];
  
  const inputStyle = "w-full bg-[var(--input-bg)] backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all duration-300";

  return (
    <div className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300 backdrop-blur-md ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl shadow-2xl p-8 w-full max-w-2xl m-4 transform transition-all duration-300 ${isOpen && !isClosing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
          {studentToEdit 
            ? (language === 'ar' ? 'تعديل سجل الطالب' : 'Edit Student Record') 
            : (language === 'ar' ? 'إضافة طالب جديد' : 'Add New Student')}
        </h2>
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
                  value={(student as any)[field.name] || ''}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>
            ))}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'ar' ? 'الطالب في الصف' : 'Student Grade'}
              </label>
              <select id="grade" name="grade" value={student.grade} onChange={handleChange} className={inputStyle} required>
                <option value="">{language === 'ar' ? 'اختر الصف' : 'Select Grade'}</option>
                <option value="الاول">{language === 'ar' ? 'الاول' : 'Grade 1'}</option>
                <option value="الثاني">{language === 'ar' ? 'الثاني' : 'Grade 2'}</option>
                <option value="الثالث">{language === 'ar' ? 'الثالث' : 'Grade 3'}</option>
                <option value="الرابع">{language === 'ar' ? 'الرابع' : 'Grade 4'}</option>
                <option value="الخامس">{language === 'ar' ? 'الخامس' : 'Grade 5'}</option>
                <option value="السادس">{language === 'ar' ? 'السادس' : 'Grade 6'}</option>
                <option value="السابع">{language === 'ar' ? 'السابع' : 'Grade 7'}</option>
                <option value="الثامن">{language === 'ar' ? 'الثامن' : 'Grade 8'}</option>
                <option value="التاسع">{language === 'ar' ? 'التاسع' : 'Grade 9'}</option>
                <option value="العاشر">{language === 'ar' ? 'العاشر' : 'Grade 10'}</option>
                <option value="الحادي عشر">{language === 'ar' ? 'الحادي عشر' : 'Grade 11'}</option>
                <option value="الثاني عشر">{language === 'ar' ? 'الثاني عشر' : 'Grade 12'}</option>
              </select>
            </div>
             <div>
              <label htmlFor="gender" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'ar' ? 'جنس الطالب' : 'Student Gender'}
              </label>
              <select id="gender" name="gender" value={student.gender} onChange={handleChange} className={inputStyle}>
                <option value="ذكر">{language === 'ar' ? 'ذكر' : 'Male'}</option>
                <option value="انثى">{language === 'ar' ? 'انثى' : 'Female'}</option>
              </select>
            </div>
            <div>
              <label htmlFor="hasSiblings" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'ar' ? 'هل له اخوة في نفس المركز؟' : 'Does the student have siblings here?'}
              </label>
              <select id="hasSiblings" name="hasSiblings" value={student.hasSiblings} onChange={handleChange} className={inputStyle}>
                <option value="نعم">{language === 'ar' ? 'نعم' : 'Yes'}</option>
                <option value="لا">{language === 'ar' ? 'لا' : 'No'}</option>
              </select>
            </div>
            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'ar' ? 'معرف حساب ولي الأمر (Parent ID)' : 'Parent Account Link (ID)'}
              </label>
              <select 
                id="parentId" 
                name="parentId" 
                value={student.parentId || ''} 
                onChange={handleChange} 
                className={inputStyle}
              >
                <option value="">{language === 'ar' ? 'لا يوجد حساب مرتبط' : 'No linked parent account'}</option>
                <option value="usr-parent">مازن ياسين الفرا (parent)</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
            <button type="button" onClick={handleClose} className="px-6 py-2 rounded-lg text-[var(--text-primary)] bg-black/20 border border-[var(--border-color)] hover:border-[var(--text-secondary)] transition-colors duration-300">
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" className="px-6 py-2 rounded-lg text-white font-semibold bg-animated-gradient hover:opacity-90 transition-opacity duration-300">
              {studentToEdit 
                ? (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes') 
                : (language === 'ar' ? 'إضافة طالب' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;