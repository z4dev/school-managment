
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Student } from './types';
import { INITIAL_CSV_DATA } from './constants';
import StudentFormModal from './components/StudentFormModal';
import StatsDashboard from './components/StatsDashboard';
import AdvancedStats from './components/AdvancedStats';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import Login from './components/Login';

// FIX: Add a type for the toast state to prevent type inference issues.
interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const logoBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAEOARQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1VZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-black/20 border border-[var(--border-color)] text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
      aria-label="Toggle theme"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" className={`absolute h-5 w-5 transition-transform duration-300 ${theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--bg-secondary)] px-2 py-1 text-xs text-[var(--text-primary)] opacity-0 transition-opacity group-hover:opacity-100">
        {theme === 'dark' ? 'الوضع المضيء' : 'الوضع المظلم'}
      </span>
    </button>
  );
};

// --- Helper Functions ---
const VALID_GRADES = ['الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع'];
const UNCLASSIFIED_GRADE = 'غير مصنف';

const normalizeGrade = (grade: string): string => {
  const trimmedGrade = grade.trim();
  const typoMap: Record<string, string> = {
    'السابغ': 'السابع',
  };

  const correctedGrade = typoMap[trimmedGrade] || trimmedGrade;

  if (VALID_GRADES.includes(correctedGrade)) {
    return correctedGrade;
  }
  return UNCLASSIFIED_GRADE;
};

const parseCSV = (csvData: string): Student[] => {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const studentDataLines = lines.slice(1);

  const parseLine = (line: string) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  return studentDataLines.map((line) => {
    const values = parseLine(line);
    const student: Partial<Student> & { id: string; attendance: {} } = {
      id: crypto.randomUUID(),
      attendance: {},
    };

    headers.forEach((header, index) => {
      const value = values[index] || '';
      switch (header) {
        case 'طابع زمني':
          student.timestamp = value;
          break;
        case 'اسم الطالب رباعي':
          student.fullName = value;
          break;
        case 'رقم الهوية الطالب':
          student.studentId = value;
          break;
        case 'جنس الطالب':
          student.gender = value;
          break;
        case 'الطالب في الصف':
          student.grade = normalizeGrade(value);
          break;
        case 'رقم الموبايل':
          student.mobile = value;
          break;
        case 'هل له اخوة في نفس المركز؟':
          student.hasSiblings = value.replace(/н/g, 'ن');
          break;
        case 'ماهو أقرب معلم؟':
          student.nearestLandmark = values.slice(index).join(', ').replace(/"/g, '');
          break;
      }
    });
    return student as Student;
  }).filter(s => s.fullName);
};


const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const [userRole, setUserRole] = useState<string | null>(() => sessionStorage.getItem('userRole'));

  // --- State Management ---
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const savedStudents = localStorage.getItem('students');
      if (savedStudents) {
        return JSON.parse(savedStudents);
      }
    } catch (error) {
      console.error("Failed to parse students from localStorage", error);
    }
    return parseCSV(INITIAL_CSV_DATA);
  });

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [globalSearch, setGlobalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [activeGrade, setActiveGrade] = useState<string>('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, studentId: null as string | null });
  const studentsPerPage = 50;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    try {
      localStorage.setItem('students', JSON.stringify(students));
    } catch (error) {
      console.error("Failed to save students to localStorage", error);
    }
  }, [students]);

  // --- Auth Handlers ---
  const handleLoginSuccess = (role: string) => {
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  };
  
  // --- Memoized Calculations ---
  const grades = useMemo(() => {
    return ['الكل', ...VALID_GRADES, UNCLASSIFIED_GRADE];
  }, []);
  
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (activeGrade !== 'الكل' && student.grade !== activeGrade) {
        return false;
      }

      if (globalSearch && !Object.values(student).some(val => String(val).toLowerCase().includes(globalSearch.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [students, globalSearch, activeGrade]);
  
  const paginatedStudents = useMemo(() => {
     const startIndex = (currentPage - 1) * studentsPerPage;
     return filteredStudents.slice(startIndex, startIndex + studentsPerPage);
  }, [filteredStudents, currentPage, studentsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // --- Handlers ---
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleAddStudent = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    setConfirmModal({ isOpen: true, studentId: studentId });
  };
  
  const handleConfirmDelete = () => {
    if (confirmModal.studentId) {
        setStudents(prev => prev.filter(s => s.id !== confirmModal.studentId));
        showToast('تم حذف الطالب بنجاح');
    }
    setConfirmModal({ isOpen: false, studentId: null });
  };

  const handleModalSubmit = (studentData: Omit<Student, 'id' | 'attendance'> | Student) => {
     const normalizedStudentData = {
      ...studentData,
      grade: normalizeGrade(studentData.grade)
    };

    if ('id' in normalizedStudentData) {
      setStudents(prev => prev.map(s => s.id === (normalizedStudentData as Student).id ? { ...s, ...normalizedStudentData } : s));
      showToast('تم تحديث بيانات الطالب بنجاح');
    } else {
      const newStudent: Student = {
        ...(normalizedStudentData as Omit<Student, 'id' | 'attendance'>),
        id: crypto.randomUUID(),
        attendance: {},
      };
      setStudents(prev => [newStudent, ...prev]);
      showToast('تمت إضافة الطالب بنجاح');
    }
    setIsModalOpen(false);
  };
  
  const handleAttendanceChange = (studentId: string, status: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const newAttendance = { ...s.attendance, [selectedDate]: status };
        return { ...s, attendance: newAttendance };
      }
      return s;
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showToast('الرجاء اختيار ملف CSV صالح', 'error');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            if (!text) throw new Error("File is empty or could not be read.");
            
            const newStudents = parseCSV(text);
            if (newStudents.length === 0) {
                 showToast('ملف CSV فارغ أو غير منسق بشكل صحيح', 'error');
                 return;
            }
            setStudents(newStudents);
            showToast('تم استيراد بيانات الطلاب بنجاح!');
            setCurrentPage(1); // Reset to first page
        } catch (error) {
            console.error("Error parsing CSV:", error);
            showToast('حدث خطأ أثناء معالجة الملف', 'error');
        }
    };

    reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        showToast('حدث خطأ أثناء قراءة الملف', 'error');
    };

    reader.readAsText(file, 'UTF-8');
    event.target.value = ''; // Allow re-uploading the same file
  };


  const downloadCSV = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const filename = `${day}_${month}_students_registrations.csv`;
    
    const headers = [
      "طابع زمني", "اسم الطالب رباعي", "رقم الهوية الطالب", "جنس الطالب", 
      "الطالب في الصف", "رقم الموبايل", "هل له اخوة في نفس المركز؟", 
      "ماهو أقرب معلم؟", `حالة الحضور (${selectedDate})`
    ];

    const rows = filteredStudents.map(s => [
      s.timestamp, s.fullName, s.studentId, s.gender, s.grade, 
      s.mobile, s.hasSiblings, s.nearestLandmark, s.attendance[selectedDate] || ''
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const inputStyle = "w-full bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all duration-300";

  const getAttendanceIndicatorColor = (status: string | undefined): string => {
    switch (status) {
        case 'حاضر':
            return 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)]';
        case 'غائب':
            return 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]';
        default:
            return 'bg-gray-500/50';
    }
  };

  const getAttendanceIndicatorTitle = (status: string | undefined): string => {
      switch (status) {
          case 'حاضر':
              return 'حاضر';
          case 'غائب':
              return 'غائب';
          default:
              return 'لم يتم تسجيل الحضور';
      }
  };

  const maleStudents = paginatedStudents.filter(s => s.gender === 'ذكر');
  const femaleStudents = paginatedStudents.filter(s => s.gender === 'انثى');

  const renderStudentRow = (student: Student) => (
    <div key={student.id} className="border-b border-[var(--border-color)] p-4 md:grid md:grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_1.5fr_1.5fr] md:gap-4 md:p-4 md:items-center hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 last:border-b-0 group">
        {/* Full Name */}
        <div className="flex justify-between items-center md:block">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase md:hidden">اسم الطالب</span>
             <div className="flex items-center gap-3">
                <span
                    className={`h-2.5 w-2.5 rounded-full flex-shrink-0 transition-all duration-300 ${getAttendanceIndicatorColor(student.attendance[selectedDate])}`}
                    title={getAttendanceIndicatorTitle(student.attendance[selectedDate])}
                ></span>
                <span className="text-[var(--text-primary)] text-base font-semibold md:font-normal">{student.fullName}</span>
            </div>
        </div>
        {/* Student ID */}
        <div className="flex justify-between items-center pt-3 md:pt-0">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase md:hidden">رقم الهوية</span>
            <span className="text-[var(--text-secondary)]">{student.studentId}</span>
        </div>
        {/* Mobile Number */}
        <div className="flex justify-between items-center pt-3 md:pt-0">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase md:hidden">رقم الموبايل</span>
            <span className="text-[var(--text-secondary)]">{student.mobile}</span>
        </div>
        {/* Grade */}
        <div className="flex justify-between items-center pt-3 md:pt-0">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase md:hidden">الصف</span>
            <span className="text-[var(--text-primary)]">{student.grade}</span>
        </div>
        {/* Gender */}
        <div className="flex justify-between items-center pt-3 md:pt-0">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase md:hidden">الجنس</span>
            <span className="text-[var(--text-primary)]">{student.gender}</span>
        </div>
        {/* hasSiblings */}
        <div className="flex justify-between items-center pt-3 md:pt-0">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase md:hidden">له اخوة</span>
            <span className="text-[var(--text-primary)]">{student.hasSiblings}</span>
        </div>
        {/* Attendance */}
        <div className="flex justify-between items-center pt-3 md:pt-0">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase md:hidden">الحالة ({selectedDate.slice(5)})</span>
            <select
                value={student.attendance[selectedDate] || ''}
                onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                disabled={userRole !== 'admin'}
                className={`w-full md:w-auto rounded-lg border-none p-2 text-sm font-semibold transition-colors bg-black/30 dark:bg-black/10 text-[var(--text-secondary)]
                    ${ student.attendance[selectedDate] === 'حاضر' ? '!text-green-400 dark:!text-green-500' : '' }
                    ${ student.attendance[selectedDate] === 'غائب' ? '!text-red-400 dark:!text-red-500' : '' }
                    disabled:opacity-70 disabled:cursor-not-allowed
                `}
            >
                <option value="" disabled>اختر الحالة</option>
                <option value="حاضر">حاضر</option>
                <option value="غائب">غائب</option>
            </select>
        </div>
        {/* Actions */}
        <div className="pt-4 mt-4 border-t border-[var(--border-color)] md:border-0 md:pt-0 md:mt-0">
            <div className="flex gap-2 justify-start md:justify-center">
                {userRole === 'admin' ? (
                    <>
                        <button onClick={() => handleEditStudent(student)} className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-black/20 border border-[var(--border-color)] text-[var(--accent-primary)] transition-all duration-300 hover:border-[var(--accent-primary)] hover:shadow-[var(--glow-primary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--bg-secondary)] px-2 py-1 text-xs text-[var(--text-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                                تعديل
                            </span>
                        </button>
                        <button onClick={() => handleDeleteStudent(student.id)} className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-black/20 border border-[var(--border-color)] text-[var(--accent-danger)] transition-all duration-300 hover:border-[var(--accent-danger)] hover:shadow-[var(--glow-danger)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--bg-secondary)] px-2 py-1 text-xs text-[var(--text-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                                حذف
                            </span>
                        </button>
                    </>
                ) : (
                    <span className="text-xs text-[var(--text-secondary)] italic">للعرض فقط</span>
                )}
            </div>
        </div>
    </div>
  );

  // --- Render ---
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="text-[var(--text-primary)] min-h-screen">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv, text/csv"
      />
      <div className="container mx-auto p-4 md:p-8">
        <header style={{ animationDelay: '100ms' }} className="animate-fade-in-down flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <img src="https://i.ibb.co/5WQkFcDQ/logo-mazen-Farra-removebg-preview.png" alt="Meshwar Training Center Logo" className="h-16 w-16 rounded-md object-cover" />
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text">
                مركز مشوار للتدريب <br className="block sm:hidden"/> سجل الطلاب
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {userRole === 'admin' && (
              <button
                onClick={handleAddStudent}
                className="px-5 py-2.5 rounded-lg text-white font-semibold bg-animated-gradient hover:opacity-90 transition-opacity duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
                <span>إضافة طالب</span>
              </button>
            )}
            {(userRole === 'admin' || userRole === 'viewer') && (
              <button
                onClick={handleUploadClick}
                className="px-5 py-2.5 rounded-lg text-[var(--text-primary)] bg-black/20 backdrop-blur-sm border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors duration-300 font-semibold flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                <span>رفع CSV</span>
              </button>
            )}
            <button
              onClick={downloadCSV}
              className="px-5 py-2.5 rounded-lg text-[var(--text-primary)] bg-black/20 backdrop-blur-sm border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors duration-300 font-semibold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a1 1 0 01-1-1V3a1 1 0 112 0v8a1 1 0 01-1 1z" /><path d="M3 10a1 1 0 011-1h2a1 1 0 110 2H4a1 1 0 01-1-1zM10 3a1 1 0 011 1v.01a1 1 0 11-2 0V4a1 1 0 011-1zM16 9a1 1 0 100 2h-2a1 1 0 100-2h2zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
              <span>تحميل CSV</span>
            </button>
             <ThemeSwitcher />
             <button
              onClick={handleLogout}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-black/20 border border-[var(--border-color)] text-[var(--accent-danger)] transition-all duration-300 hover:border-[var(--accent-danger)] hover:shadow-[var(--glow-danger)]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                 <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--bg-secondary)] px-2 py-1 text-xs text-[var(--text-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                    خروج
                </span>
            </button>
          </div>
        </header>

        <StatsDashboard students={filteredStudents} selectedDate={selectedDate} />
        <AdvancedStats students={filteredStudents} selectedDate={selectedDate} />

        <div style={{ animationDelay: '300ms' }} className="animate-fade-in-down mb-6 p-4 bg-[var(--bg-glass)] rounded-xl border border-[var(--border-color)] backdrop-blur-lg">
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <input
                    type="search"
                    placeholder="ابحث بالاسم, الهوية, الصف..."
                    value={globalSearch}
                    onChange={(e) => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
                    className={`w-full md:w-1/3 ${inputStyle}`}
                />
                 <div className="flex items-center gap-3">
                    <label htmlFor="date-picker" className="font-semibold text-[var(--text-secondary)]">تاريخ الحضور:</label>
                    <input 
                        id="date-picker"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={inputStyle}
                    />
                </div>
            </div>
        </div>
        
        <div style={{ animationDelay: '400ms' }} className="animate-fade-in-down mb-6 flex flex-wrap gap-x-2 border-b border-[var(--border-color)]">
          {grades.map(grade => (
            <button
              key={grade}
              onClick={() => { setActiveGrade(grade); setCurrentPage(1); }}
              className={`relative px-4 py-3 text-sm font-semibold transition-colors duration-300 ${activeGrade === grade ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {grade}
              {activeGrade === grade && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent-primary)]"></div>}
            </button>
          ))}
        </div>

        <div style={{ animationDelay: '500ms' }} className="animate-fade-in-down bg-[var(--bg-glass)] rounded-xl border border-[var(--border-color)] backdrop-blur-lg">
             {paginatedStudents.length > 0 ? (
                <>
                    {/* Male Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[var(--soft-bg-primary)] to-transparent border-b border-[var(--border-color)]">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-accent-primary)]">شعبة الذكور</h2>
                        </div>
                        {maleStudents.length > 0 ? (
                            <>
                                <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_1.5fr_1.5fr] gap-4 p-4 font-semibold text-xs text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)]">
                                    <span>اسم الطالب</span>
                                    <span>رقم الهوية</span>
                                    <span>رقم الموبايل</span>
                                    <span>الصف</span>
                                    <span>الجنس</span>
                                    <span>له اخوة</span>
                                    <span>الحالة ({selectedDate.slice(5)})</span>
                                    <span className="text-center">اجراءات</span>
                                </div>
                                <div className="flex flex-col">{maleStudents.map(renderStudentRow)}</div>
                            </>
                        ) : (
                            <p className="text-center p-8 text-[var(--text-secondary)]">لا يوجد طلاب ذكور في هذا التصنيف.</p>
                        )}
                    </div>

                    {/* Female Section */}
                    <div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[var(--soft-bg-secondary)] to-transparent border-b border-[var(--border-color)]">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-secondary)]/20 text-[var(--text-accent-secondary)] flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-accent-secondary)]">شعبة الإناث</h2>
                        </div>
                         {femaleStudents.length > 0 ? (
                            <>
                                <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_1.5fr_1.5fr] gap-4 p-4 font-semibold text-xs text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)]">
                                    <span>اسم الطالب</span>
                                    <span>رقم الهوية</span>
                                    <span>رقم الموبايل</span>
                                    <span>الصف</span>
                                    <span>الجنس</span>
                                    <span>له اخوة</span>
                                    <span>الحالة ({selectedDate.slice(5)})</span>
                                    <span className="text-center">اجراءات</span>
                                </div>
                                <div className="flex flex-col">{femaleStudents.map(renderStudentRow)}</div>
                            </>
                        ) : (
                            <p className="text-center p-8 text-[var(--text-secondary)]">لا توجد طالبات في هذا التصنيف.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className="text-center p-12 text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--accent-primary)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                        <p className="font-semibold text-lg text-[var(--text-primary)]">لا يوجد طلاب لعرضهم</p>
                        <p className="text-sm">الرجاء تغيير فلاتر البحث أو إضافة طالب جديد.</p>
                    </div>
                </div>
            )}
        </div>

        {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-3 text-[var(--text-secondary)]">
                <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    السابق
                </button>
                <span className="font-semibold text-[var(--text-primary)]">صفحة {currentPage} من {totalPages}</span>
                <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    التالي
                </button>
            </div>
        )}

        <StudentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          studentToEdit={studentToEdit}
        />

        <ConfirmModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ isOpen: false, studentId: null })}
            onConfirm={handleConfirmDelete}
            title="تأكيد الحذف"
            message="هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء."
        />
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'success' })} />}

      </div>
    </div>
  );
};

export default App;
