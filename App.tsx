import React, { useState, useEffect, useMemo } from 'react';
import { Student, StudentKey } from './types';
import { INITIAL_CSV_DATA } from './constants';
import StudentFormModal from './components/StudentFormModal';

// --- Helper Functions ---
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
          student.grade = value;
          break;
        case 'رقم الموبايل':
          student.mobile = value;
          break;
        case 'هل له اخوة في نفس المركز؟':
          student.hasSiblings = value.replace(/н/g, 'ن');
          break;
        case 'ماهو أقرب معلم؟':
          // This logic might still be fragile if commas appear elsewhere
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
  const studentsPerPage = 50;

  // --- Effects ---
  useEffect(() => {
    try {
      localStorage.setItem('students', JSON.stringify(students));
    } catch (error) {
      console.error("Failed to save students to localStorage", error);
    }
  }, [students]);

  // --- Memoized Calculations ---
  const grades = useMemo(() => {
    const gradeOrder = ['الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع'];
    const uniqueGrades = Array.from(new Set(students.map(s => s.grade)));
    
    uniqueGrades.sort((a, b) => {
      const indexA = gradeOrder.indexOf(a);
      const indexB = gradeOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return ['الكل', ...uniqueGrades];
  }, [students]);
  
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
  const handleAddStudent = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
    }
  };

  const handleModalSubmit = (studentData: Omit<Student, 'id' | 'attendance'> | Student) => {
    if ('id' in studentData) {
      setStudents(prev => prev.map(s => s.id === (studentData as Student).id ? { ...s, ...studentData } : s));
    } else {
      const newStudent: Student = {
        ...studentData,
        id: crypto.randomUUID(),
        attendance: {},
      };
      setStudents(prev => [newStudent, ...prev]);
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
  
  const inputStyle = "bg-slate-400/10 backdrop-blur-sm border border-slate-300/20 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all duration-300";


  // --- Render ---
  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            سجل الطلاب
          </h1>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              <span>إضافة طالب</span>
            </button>
            <button
              onClick={downloadCSV}
              className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 font-semibold shadow-lg shadow-green-600/30 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              <span>تحميل CSV</span>
            </button>
          </div>
        </header>

        <div className="mb-6 p-4 bg-slate-900 rounded-xl border border-slate-800">
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <input
                    type="search"
                    placeholder="ابحث عن طالب..."
                    value={globalSearch}
                    onChange={(e) => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
                    className={`w-full md:w-1/3 ${inputStyle}`}
                />
                 <div className="flex items-center gap-3">
                    <label htmlFor="date-picker" className="font-semibold text-slate-300">تاريخ الحضور:</label>
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
        
        <div className="mb-6 flex flex-wrap gap-x-2 border-b border-slate-800">
          {grades.map(grade => (
            <button
              key={grade}
              onClick={() => { setActiveGrade(grade); setCurrentPage(1); }}
              className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 border-b-2 ${activeGrade === grade ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              {grade}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[1200px]">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 font-semibold text-xs text-slate-400 uppercase tracking-wider w-[250px]">اسم الطالب</th>
                  <th className="p-4 font-semibold text-xs text-slate-400 uppercase tracking-wider w-[150px]">رقم الهوية</th>
                  <th className="p-4 font-semibold text-xs text-slate-400 uppercase tracking-wider w-[120px]">الصف</th>
                  <th className="p-4 font-semibold text-xs text-slate-400 uppercase tracking-wider w-[120px]">الجنس</th>
                  <th className="p-4 font-semibold text-xs text-slate-400 uppercase tracking-wider w-[120px]">له اخوة</th>
                  <th className="p-4 font-semibold text-xs text-slate-400 uppercase tracking-wider w-[150px]">الحالة ({selectedDate.slice(5)})</th>
                  <th className="p-4 font-semibold text-xs text-slate-400 uppercase tracking-wider w-[150px]">اجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-slate-200">{student.fullName}</td>
                      <td className="p-4 whitespace-nowrap text-slate-400">{student.studentId}</td>
                      <td className="p-4 whitespace-nowrap text-slate-300">{student.grade}</td>
                      <td className="p-4 whitespace-nowrap text-slate-300">{student.gender}</td>
                      <td className="p-4 whitespace-nowrap text-slate-300">{student.hasSiblings}</td>
                      <td className="p-4">
                        <select
                          value={student.attendance[selectedDate] || ''}
                          onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                          className={`w-full rounded-lg border-none p-2 text-sm font-semibold transition-colors ${
                              student.attendance[selectedDate] === 'حاضر' ? 'bg-green-500/20 text-green-300' :
                              student.attendance[selectedDate] === 'غائب' ? 'bg-red-500/20 text-red-300' :
                              'bg-slate-700/80 text-slate-300'
                          }`}
                        >
                            <option value="" disabled>اختر الحالة</option>
                            <option value="حاضر">حاضر</option>
                            <option value="غائب">غائب</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-4 justify-start">
                          <button onClick={() => handleEditStudent(student)} className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1.5">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                             <span>تعديل</span>
                          </button>
                          <button onClick={() => handleDeleteStudent(student.id)} className="text-red-500 hover:text-red-400 transition flex items-center gap-1.5">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                             <span>حذف</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-slate-500">
                      لا يوجد طلاب لعرضهم. الرجاء تغيير فلاتر البحث أو إضافة طالب جديد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-3 text-slate-400">
                <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors">
                    السابق
                </button>
                <span className="font-semibold text-slate-300">صفحة {currentPage} من {totalPages}</span>
                <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors">
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
      </div>
    </div>
  );
};

export default App;