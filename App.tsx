import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Student, User, CaseFile, LessonPlan, Invoice, Payment, 
  ComplianceAudit, Announcement, Task, AuditLog, MonthlyReport 
} from './types';
import Login from './components/Login';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import StatsDashboard from './components/StatsDashboard';
import AdvancedStats from './components/AdvancedStats';
import StudentFormModal from './components/StudentFormModal';
import { CURRICULUM_DATA } from './curriculumData';
import { 
  Plus, Upload, Edit3, Trash2, Search, Award, Settings, FileText, 
  DollarSign, CreditCard, BookOpen, Calendar, HeartHandshake, UserPlus, 
  ShieldAlert, User as UserIcon, Users, Baby, BarChart3, Settings2, LogOut, Sun, Moon, Globe,
  CheckCircle2, AlertCircle, ChevronDown, Check, X, ShieldCheck, HelpCircle, Clock, FileSpreadsheet, Lock, Sparkles, BookOpenCheck, GraduationCap
} from 'lucide-react';

// --- Bilingual Dictionary ---
const translations = {
  ar: {
    schoolName: "نظام مشوار المتكامل لإدارة المدارس",
    logout: "خروج",
    welcome: "مرحباً بك،",
    activeRole: "الصلاحية النشطة:",
    langToggle: "English",
    themeToggle: "تغيير المظهر",
    notifications: "الإشعارات",
    all: "الكل",
    pending: "قيد المراجعة",
    approved: "معتمد",
    rejected: "مرفوض",
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    status: "الحالة",
    actions: "الإجراءات",
    title: "العنوان",
    description: "الوصف",
    type: "النوع",
    date: "التاريخ",
    objective: "الهدف",
    materials: "المواد المطلوبة",
    activities: "الأنشطة",
    standard: "المعيار التعليمي",
    plannedDate: "تاريخ الدرس",
    student: "الطالب",
    teacher: "المعلم",
    parent: "ولي الأمر",
    amount: "المبلغ",
    paid: "المدفوع",
    outstanding: "المتبقي",
    due: "تاريخ الاستحقاق",
    category: "الفئة",
    markAttendance: "تسجيل الحضور اليومي",
    present: "حاضر",
    absent: "غائب",
    grade: "الصف",
    gender: "الجنس",
    male: "ذكر",
    female: "انثى",
    siblings: "له إخوة",
    landmark: "أقرب معلم",
    mobile: "رقم الموبايل",
    idNumber: "رقم الهوية",
    searchPlaceholder: "ابحث بالاسم، الهوية، أو الصف...",
    
    // Modules Tabs
    tabDashboard: "لوحة التحكم العامة",
    tabSocial: "الخدمة الاجتماعية",
    tabTeacher: "التخطيط التعليمي",
    tabParent: "بوابة أولياء الأمور",
    tabFinance: "الشؤون المالية",
    tabCompliance: "الجودة والامتثال",
    tabReports: "التقارير والإحصائيات",
    tabAdmin: "إدارة الطلاب",
    tabSysAdmin: "إعدادات النظام",

    // Dashboard Cards
    totalStudents: "إجمالي الطلاب",
    financeHealth: "الملخص المالي",
    activeSocialCases: "الحالات الاجتماعية النشطة",
    complianceKPI: "مؤشر جودة الامتثال",
    revenue: "الإيرادات الكلية",
    collected: "المبالغ المحصلة",
    remaining: "الديون المستحقة",
    
    // Social Worker Form
    openCase: "فتح ملف حالة اجتماعية جديدة",
    caseTitle: "عنوان الحالة / المشكلة",
    caseType: "تصنيف الحالة",
    selectStudent: "اختر الطالب",
    followUpDate: "تاريخ المتابعة القادم",
    timelineNotes: "سجل متابعة الحالة والتطورات",
    addNote: "إضافة ملاحظة جديدة للسجل",
    
    // Teacher Forms
    submitPlan: "تقديم خطة درس جديدة",
    noPlans: "لا توجد خطط دروس مسجلة.",
    lessonPlansList: "سجل الخطط والمناهج الدراسية",
    approve: "اعتماد",
    reject: "رفض",
    comments: "تعليقات المنسق",

    // Finance Portal
    billingTitle: "إصدار فاتورة جديدة",
    recordPayment: "تسجيل دفعة مالية",
    manualPayment: "تسجيل دفعة نقدية يدوية",
    invoiceCategory: "نوع الرسوم",
    outstandingInvoices: "الفواتير غير المدفوعة",
    transactionHistory: "سجل العمليات المالية",

    // Quality Audit
    auditTitle: "مراقبة التدقيق والامتثال للجودة",
    addAudit: "إضافة ملف تدقيق أو توصية جديدة",
    kpiScore: "نقاط التقييم / KPI",
    deadline: "الموعد النهائي للحل",
    findingDetails: "تفاصيل النتائج والتوصيات",

    // Reports Module
    monthlyReportsSettings: "إعدادات التقارير الشهرية لأولياء الأمور",
    triggerReports: "توليد وإرسال تقارير هذا الشهر",
    archivesTitle: "أرشيف التقارير المرسلة لأولياء الأمور",
    exportPDF: "تصدير إلى PDF",
    exportExcel: "تصدير إلى Excel",

    // Parent Portal
    selectChild: "اختر الابن/الابنة:",
    academicRecord: "السجل الدراسي والعلامات",
    behavioralRecord: "التقرير السلوكي والملاحظات",
    paymentSummary: "حالة المدفوعات والرسوم",
    messagingTitle: "قناة التواصل المباشر مع المعلمين والإدارة",
    submitExcuse: "تقديم طلب عذر غياب / مقابلة",

    // SysAdmin Logs
    auditLogsTitle: "سجل العمليات والتدقيق التقني (Audit Log)",
    userManagement: "إدارة صلاحيات المستخدمين",
    registeredUsers: "المستخدمون المسجلون بالنظام",
    assignedRoles: "الأدوار الممنوحة",
    
    // Employee Dashboard
    announcements: "لوحة الإعلانات والتعميمات",
    tasksList: "قائمة مهام العمل الخاصة بي",
    addTask: "إضافة مهمة جديدة",
    hrDocs: "الوثائق والملفات الإدارية المشتركة",
  },
  en: {
    schoolName: "Mishwar Integrated School Management",
    logout: "Log Out",
    welcome: "Welcome,",
    activeRole: "Active Role:",
    langToggle: "العربية",
    themeToggle: "Toggle Theme",
    notifications: "Notifications",
    all: "All",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    status: "Status",
    actions: "Actions",
    title: "Title",
    description: "Description",
    type: "Type",
    date: "Date",
    objective: "Objective",
    materials: "Materials Required",
    activities: "Activities",
    standard: "Educational Standard",
    plannedDate: "Lesson Date",
    student: "Student",
    teacher: "Teacher",
    parent: "Parent",
    amount: "Amount",
    paid: "Paid",
    outstanding: "Outstanding",
    due: "Due Date",
    category: "Category",
    markAttendance: "Mark Daily Attendance",
    present: "Present",
    absent: "Absent",
    grade: "Grade",
    gender: "Gender",
    male: "Male",
    female: "Female",
    siblings: "Siblings",
    landmark: "Nearest Landmark",
    mobile: "Mobile Number",
    idNumber: "ID Number",
    searchPlaceholder: "Search by name, ID, or grade...",
    
    // Modules Tabs
    tabDashboard: "Overview Dashboard",
    tabSocial: "Social Work",
    tabTeacher: "Lesson Planning",
    tabParent: "Parent Portal",
    tabFinance: "Finance Module",
    tabCompliance: "Quality & Compliance",
    tabReports: "Reports & Stats",
    tabAdmin: "Student Registry",
    tabSysAdmin: "System Settings",

    // Dashboard Cards
    totalStudents: "Total Students",
    financeHealth: "Financial Health Summary",
    activeSocialCases: "Active Social Cases",
    complianceKPI: "Compliance KPI Score",
    revenue: "Total Invoiced",
    collected: "Total Collected",
    remaining: "Total Outstanding",
    
    // Social Worker Form
    openCase: "Open New Student Case File",
    caseTitle: "Case / Situation Title",
    caseType: "Case Classification",
    selectStudent: "Select Student",
    followUpDate: "Next Follow-Up Date",
    timelineNotes: "Case Progress Logs",
    addNote: "Add new note to case history",
    
    // Teacher Forms
    submitPlan: "Submit New Lesson Plan",
    noPlans: "No lesson plans registered.",
    lessonPlansList: "Lesson Plans & Curriculum Logs",
    approve: "Approve",
    reject: "Reject",
    comments: "Coordinator Comments",

    // Finance Portal
    billingTitle: "Generate New Invoice",
    recordPayment: "Record Payment",
    manualPayment: "Record Manual Cash Payment",
    invoiceCategory: "Invoice Type",
    outstandingInvoices: "Unpaid Invoices",
    transactionHistory: "Transaction Logs",

    // Quality Audit
    auditTitle: "Quality Audit & Compliance Tracker",
    addAudit: "Add Audit Milestone or Finding",
    kpiScore: "KPI Score",
    deadline: "Resolution Deadline",
    findingDetails: "Findings & Details",

    // Reports Module
    monthlyReportsSettings: "Automated Monthly Parent Reports Settings",
    triggerReports: "Trigger Delivery for This Month",
    archivesTitle: "Parent Monthly Reports Archives",
    exportPDF: "Export to PDF",
    exportExcel: "Export to Excel",

    // Parent Portal
    selectChild: "Select Child:",
    academicRecord: "Academic Grades & Marks",
    behavioralRecord: "Behavioral Notes",
    paymentSummary: "Payment Status & Invoices",
    messagingTitle: "Direct Communication Channel",
    submitExcuse: "Submit Excuse / Meeting Request",

    // SysAdmin Logs
    auditLogsTitle: "System Operations Audit Log",
    userManagement: "User Permissions Management",
    registeredUsers: "Registered System Users",
    assignedRoles: "Assigned Roles",
    
    // Employee Dashboard
    announcements: "School Bulletins & Announcements",
    tasksList: "My Workspace Tasks",
    addTask: "Add Task",
    hrDocs: "Shared HR Documents & Policies",
  }
};

const gradesList = ['الكل', 'الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];

const App: React.FC = () => {
  // --- States ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const [userToken, setUserToken] = useState<string | null>(() => {
    return sessionStorage.getItem('token');
  });
  const [userProfile, setUserProfile] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [userRoles, setUserRoles] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('userRoles');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeRole, setActiveRole] = useState<string>(() => {
    return sessionStorage.getItem('activeRole') || '';
  });

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('language') as 'ar' | 'en') || 'ar';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  // Core Data Lists
  const [students, setStudents] = useState<Student[]>([]);
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [audits, setAudits] = useState<ComplianceAudit[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState<any>({
    totalStudents: 0,
    finance: { invoiced: 0, paid: 0, outstanding: 0 },
    activeSocialCases: 0,
    complianceKPI: 0
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeGrade, setActiveGrade] = useState<string>('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, studentId: null as string | null });
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [activeParentKid, setActiveParentKid] = useState<string>('');
  const [registryStudents, setRegistryStudents] = useState<Student[]>([]);
  const [registryTotalPages, setRegistryTotalPages] = useState<number>(1);

  // Form inputs states
  const [newCase, setNewCase] = useState({ studentId: '', title: '', type: 'support', description: '', followUpDate: '' });
  const [activeCaseDetails, setActiveCaseDetails] = useState<CaseFile | null>(null);
  const [newCaseNote, setNewCaseNote] = useState('');
  
  const [newPlan, setNewPlan] = useState({ subject: '', grade: 'الاول', term: 'الفصل الثالث', objectives: '', materials: '', activities: '', standardAlignment: '', plannedDate: '' });
  const [planComments, setPlanComments] = useState<{ [planId: string]: string }>({});

  const [newInvoice, setNewInvoice] = useState({ studentId: '', amount: '', category: 'رسوم دراسية', dueDate: '' });
  const [recordPaymentAmount, setRecordPaymentAmount] = useState<{ [invId: string]: string }>({});

  const [newAudit, setNewAudit] = useState({ title: '', type: 'internal', findingDetails: '', deadline: '', status: 'pending', kpiScore: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', targetRole: 'all' });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [reportsMonth, setReportsMonth] = useState('2026-06');
  const [curriculumGrade, setCurriculumGrade] = useState<string>('الاول');
  const [curriculumSubject, setCurriculumSubject] = useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<'academic' | 'attendance' | 'finance'>('academic');
  const [teacherSubTab, setTeacherSubTab] = useState<'plans' | 'curriculum'>('plans');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Translation Helper ---
  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || key;
  };

  const formatGrade = (grade: string) => {
    const map: Record<string, string> = {
      'الكل': language === 'ar' ? 'الكل' : 'All Grades',
      'الاول': language === 'ar' ? 'الصف الأول' : 'Grade 1',
      'الثاني': language === 'ar' ? 'الصف الثاني' : 'Grade 2',
      'الثالث': language === 'ar' ? 'الصف الثالث' : 'Grade 3',
      'الرابع': language === 'ar' ? 'الصف الرابع' : 'Grade 4',
      'الخامس': language === 'ar' ? 'الصف الخامس' : 'Grade 5',
      'السادس': language === 'ar' ? 'الصف السادس' : 'Grade 6',
      'السابع': language === 'ar' ? 'الصف السابع' : 'Grade 7',
      'الثامن': language === 'ar' ? 'الصف الثامن' : 'Grade 8',
      'التاسع': language === 'ar' ? 'الصف التاسع' : 'Grade 9',
      'العاشر': language === 'ar' ? 'الصف العاشر' : 'Grade 10',
      'الحادي عشر': language === 'ar' ? 'الصف الحادي عشر' : 'Grade 11',
      'الثاني عشر': language === 'ar' ? 'الصف الثاني عشر' : 'Grade 12',
      'غير مصنف': language === 'ar' ? 'غير مصنف' : 'Unclassified',
    };
    return map[grade] || grade;
  };

  const formatTerm = (term: string) => {
    const map: Record<string, string> = {
      'الفصل الاول': language === 'ar' ? 'الفصل الأول' : 'Term 1',
      'الفصل الثاني': language === 'ar' ? 'الفصل الثاني' : 'Term 2',
      'الفصل الثالث': language === 'ar' ? 'الفصل الثالث' : 'Term 3',
    };
    return map[term] || term;
  };

  const renderCurriculumExplorer = () => {
    // Get subjects for selected grade
    const subjects = CURRICULUM_DATA[curriculumGrade] || [];
    
    // If no active subject, set the first one as active
    const activeSubjectData = subjects.find(s => s.subjectAr === curriculumSubject || s.subjectEn === curriculumSubject) || subjects[0];
    
    const displaySubject = activeSubjectData 
      ? (language === 'ar' ? activeSubjectData.subjectAr : activeSubjectData.subjectEn)
      : '';

    return (
      <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--border-color)] pb-4 gap-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--accent-primary)] flex items-center gap-2">
              <BookOpenCheck className="h-5.5 w-5.5" />
              <span>{language === 'ar' ? 'مستكشف المنهج الدراسي الموحد' : 'Syllabus & Curriculum Explorer'}</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {language === 'ar' 
                ? 'تصفح الفصول والوحدات التعليمية والمخرجات التعليمية حسب الصف والمادة.' 
                : 'Browse educational units, chapters, activities, and standards by grade.'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Grade Selector */}
            <div className="flex-1 md:flex-initial">
              <label className="block text-[10px] text-[var(--text-secondary)] font-bold mb-1 uppercase">{t('grade')}</label>
              <select
                value={curriculumGrade}
                onChange={(e) => {
                  setCurriculumGrade(e.target.value);
                  const firstSub = CURRICULUM_DATA[e.target.value]?.[0];
                  setCurriculumSubject(firstSub ? (language === 'ar' ? firstSub.subjectAr : firstSub.subjectEn) : '');
                }}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)]"
              >
                {gradesList.filter(g => g !== 'الكل').map(g => (
                  <option key={g} value={g}>{formatGrade(g)}</option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            {subjects.length > 0 && (
              <div className="flex-1 md:flex-initial">
                <label className="block text-[10px] text-[var(--text-secondary)] font-bold mb-1 uppercase">{language === 'ar' ? 'المادة الدراسية' : 'Subject'}</label>
                <select
                  value={curriculumSubject || (language === 'ar' ? subjects[0].subjectAr : subjects[0].subjectEn)}
                  onChange={(e) => setCurriculumSubject(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)]"
                >
                  {subjects.map(s => (
                    <option key={s.subjectAr} value={language === 'ar' ? s.subjectAr : s.subjectEn}>
                      {language === 'ar' ? s.subjectAr : s.subjectEn}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)] text-sm flex flex-col items-center gap-2">
            <HelpCircle className="h-8 w-8 text-gray-500" />
            <span>
              {language === 'ar' 
                ? 'لا توجد بيانات منهج مدخلة لهذا الصف بعد.' 
                : 'No curriculum progression details set for this grade yet.'}
            </span>
          </div>
        ) : !activeSubjectData ? (
          <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
            {language === 'ar' ? 'الرجاء اختيار مادة دراسية.' : 'Please select a subject.'}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-color)]">
              <span className="text-xs font-bold text-[var(--accent-secondary)] tracking-wide uppercase">
                {language === 'ar' ? 'المادة النشطة' : 'Active Course'}
              </span>
              <h4 className="text-lg font-extrabold text-[var(--text-primary)] mt-1">
                {formatGrade(curriculumGrade)} - {displaySubject}
              </h4>
            </div>

            <div className="space-y-4">
              <h5 className="font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-[var(--accent-primary)]" />
                <span>{language === 'ar' ? 'الوحدات والوحدات الدراسية' : 'Units & Chapters'} ({activeSubjectData.chapters.length})</span>
              </h5>
              
              <div className="grid grid-cols-1 gap-4">
                {activeSubjectData.chapters.map((chapter) => {
                  // Find lesson plans linked to this chapter (subject + grade match)
                  const linkedPlans = lessonPlans.filter(lp => 
                    lp.grade === curriculumGrade && 
                    (lp.subject === activeSubjectData.subjectAr || lp.subject === activeSubjectData.subjectEn) &&
                    (lp.objectives.includes(chapter.titleAr) || lp.objectives.includes(chapter.titleEn) || lp.standardAlignment.includes(chapter.standardAr.slice(-5)))
                  );

                  return (
                    <div key={chapter.id} className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--card-bg)] hover:border-[var(--accent-primary)]/40 transition-colors">
                      <div className="flex justify-between items-start flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-3 mb-3">
                        <div>
                          <h4 className="font-extrabold text-sm text-[var(--accent-primary)]">
                            {language === 'ar' ? chapter.titleAr : chapter.titleEn}
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] mt-1.5">
                            {language === 'ar' ? chapter.descriptionAr : chapter.descriptionEn}
                          </p>
                        </div>
                        <span className="text-[10px] bg-[var(--badge-bg)] px-2 py-0.5 rounded text-gray-400 font-mono">
                          {chapter.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)]">
                        <div>
                          <span className="font-bold text-[var(--text-primary)] block mb-1">
                            🎯 {language === 'ar' ? 'مخرجات التعلم المستهدفة:' : 'Target Learning Objectives:'}
                          </span>
                          <ul className="list-disc pr-5 pl-5 space-y-1">
                            {(language === 'ar' ? chapter.objectivesAr : chapter.objectivesEn).map((obj, idx) => (
                              <li key={idx}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold text-[var(--text-primary)] block mb-1">
                            🎨 {language === 'ar' ? 'الأنشطة الصفية والمقترحات:' : 'Classroom Activities & Suggestions:'}
                          </span>
                          <ul className="list-disc pr-5 pl-5 space-y-1">
                            {(language === 'ar' ? chapter.activitiesAr : chapter.activitiesEn).map((act, idx) => (
                              <li key={idx}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap justify-between items-center gap-2 text-[10px]">
                        <div className="text-[var(--text-secondary)] font-semibold">
                          📌 {language === 'ar' ? 'المعيار الموائم:' : 'Aligned Standard:'}{' '}
                          <span className="text-[var(--text-primary)]">{language === 'ar' ? chapter.standardAr : chapter.standardEn}</span>
                        </div>
                        {linkedPlans.length > 0 && (
                          <div className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                            ✓ {language === 'ar' ? `مغطى بـ ${linkedPlans.length} خطط دروس مضافة` : `Covered by ${linkedPlans.length} active plans`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Fetch Helper with Auth ---
  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (userToken) {
      headers.set('Authorization', `Bearer ${userToken}`);
    }
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'API Error');
    }
    return res.json();
  };

  // --- Load Initial Data ---
  const loadData = async () => {
    if (!isAuthenticated) return;
    try {
      // Parallel fetches for efficiency
      const [stdData, statsData, annsData, tasksData] = await Promise.all([
        apiFetch('/api/students'),
        apiFetch('/api/reports/summary'),
        apiFetch('/api/announcements'),
        apiFetch('/api/tasks')
      ]);

      setStudents(stdData);
      setSummaryStats(statsData);
      setAnnouncements(annsData);
      setTasks(tasksData);

      // Load specific role-based modules
      if (activeRole === 'director' || activeRole === 'admin' || activeRole === 'socialworker') {
        const cases = await apiFetch('/api/cases');
        setCaseFiles(cases);
      }
      
      if (activeRole === 'director' || activeRole === 'admin' || activeRole === 'teacher') {
        const plans = await apiFetch('/api/lesson-plans');
        setLessonPlans(plans);
      }

      if (activeRole === 'director' || activeRole === 'admin' || activeRole === 'finance' || activeRole === 'parent') {
        const invs = await apiFetch('/api/finance/invoices');
        setInvoices(invs);
      }

      if (activeRole === 'director' || activeRole === 'admin' || activeRole === 'finance') {
        const pays = await apiFetch('/api/finance/payments');
        setPayments(pays);
      }

      if (activeRole === 'director' || activeRole === 'compliance') {
        const compliances = await apiFetch('/api/compliance');
        setAudits(compliances);
      }

      if (activeRole === 'director' || activeRole === 'admin' || activeRole === 'sysadmin') {
        const logs = await apiFetch('/api/audit-logs');
        setAuditLogs(logs);
      }

      if (activeRole === 'sysadmin') {
        const usersList = await apiFetch('/api/users');
        setAllUsers(usersList);
      }

      if (activeRole === 'parent' || activeRole === 'director') {
        const monthlyReps = await apiFetch('/api/reports/monthly');
        setMonthlyReports(monthlyReps);
      }

    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'فشل تحميل البيانات', 'error');
    }
  };

  const loadRegistryStudents = async () => {
    if (!isAuthenticated || (activeRole !== 'director' && activeRole !== 'admin')) return;
    try {
      const gParam = activeGrade === 'الكل' ? '' : activeGrade;
      const url = `/api/students?page=${currentPage}&limit=50&search=${encodeURIComponent(globalSearch)}&grade=${encodeURIComponent(gParam)}`;
      const res = await apiFetch(url);
      setRegistryStudents(res.students);
      setRegistryTotalPages(res.totalPages);
    } catch (err: any) {
      console.error('Failed to load paginated registry students:', err);
    }
  };

  useEffect(() => {
    loadRegistryStudents();
  }, [isAuthenticated, activeRole, currentPage, globalSearch, activeGrade]);

  useEffect(() => {
    loadData();
  }, [isAuthenticated, activeRole]);

  // Handle Dynamic LTR/RTL Layout
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.title = t('schoolName');
    localStorage.setItem('language', language);
  }, [language]);

  // Handle dark/light themes
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Set default kid for Parent Portal
  useEffect(() => {
    if (activeRole === 'parent' && students.length > 0) {
      setActiveParentKid(students[0].id);
    }
  }, [students, activeRole]);

  // Sync curriculum explorer grade to active parent's kid's grade
  useEffect(() => {
    if (activeParentKid && students.length > 0) {
      const kid = students.find(s => s.id === activeParentKid);
      if (kid) {
        setCurriculumGrade(kid.grade);
        const firstSub = CURRICULUM_DATA[kid.grade]?.[0];
        setCurriculumSubject(firstSub ? (language === 'ar' ? firstSub.subjectAr : firstSub.subjectEn) : '');
      }
    }
  }, [activeParentKid, students, language]);

  // Sync curriculum explorer grade to logged-in student's grade
  useEffect(() => {
    if (activeRole === 'student' && students.length > 0 && userProfile) {
      const studentObj = students.find(s => s.fullName.includes(userProfile.fullName) || s.mobile === userProfile.mobile);
      if (studentObj) {
        setCurriculumGrade(studentObj.grade);
        const firstSub = CURRICULUM_DATA[studentObj.grade]?.[0];
        setCurriculumSubject(firstSub ? (language === 'ar' ? firstSub.subjectAr : firstSub.subjectEn) : '');
      }
    }
  }, [activeRole, students, userProfile, language]);

  // --- Handlers ---
  const handleExportPDF = () => {
    try {
      let reportTitle = '';
      let tableHtml = '';

      if (selectedReportType === 'academic') {
        reportTitle = language === 'ar' ? 'تقرير التحصيل الأكاديمي والدرجات' : 'Academic Achievement and Grades Report';
        tableHtml = `
          <table>
            <thead>
              <tr>
                <th>${language === 'ar' ? 'اسم الطالب رباعي' : 'Student Name'}</th>
                <th>${language === 'ar' ? 'الصف الدراسي' : 'Grade'}</th>
                <th>${language === 'ar' ? 'الرياضيات' : 'Mathematics'}</th>
                <th>${language === 'ar' ? 'اللغة العربية' : 'Arabic'}</th>
                <th>${language === 'ar' ? 'العلوم الطبيعية' : 'Sciences'}</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => {
                const rep = monthlyReports.find(r => r.studentId === s.id && r.month === reportsMonth);
                const math = rep?.grades?.['الرياضيات'] || 85;
                const arabic = rep?.grades?.['اللغة العربية'] || 90;
                const science = rep?.grades?.['العلوم الطبيعية'] || 88;
                return `
                  <tr>
                    <td>${s.fullName}</td>
                    <td>${formatGrade(s.grade)}</td>
                    <td><span style="color: #22c55e; font-weight: bold;">${math}/100</span></td>
                    <td><span style="color: #22c55e; font-weight: bold;">${arabic}/100</span></td>
                    <td><span style="color: #22c55e; font-weight: bold;">${science}/100</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      } else if (selectedReportType === 'attendance') {
        reportTitle = language === 'ar' ? 'تقرير نسب الحضور والغياب للفصول' : 'Class Attendance Report';
        tableHtml = `
          <table>
            <thead>
              <tr>
                <th>${language === 'ar' ? 'اسم الطالب' : 'Student Name'}</th>
                <th>${language === 'ar' ? 'الصف الدراسي' : 'Grade'}</th>
                <th>${language === 'ar' ? 'أيام الحضور' : 'Present Days'}</th>
                <th>${language === 'ar' ? 'أيام الغياب' : 'Absent Days'}</th>
                <th>${language === 'ar' ? 'نسبة الانضباط' : 'Attendance %'}</th>
              </tr>
            </thead>
            <tbody>
              ${students.map(s => {
                const present = Object.values(s.attendance).filter(v => v === 'حاضر').length || 3;
                const absent = Object.values(s.attendance).filter(v => v === 'غائب').length || 0;
                const total = present + absent;
                const pct = total > 0 ? Math.round((present / total) * 100) : 100;
                return `
                  <tr>
                    <td>${s.fullName}</td>
                    <td>${formatGrade(s.grade)}</td>
                    <td>${present}</td>
                    <td>${absent}</td>
                    <td><span style="color: #d97706; font-weight: bold;">${pct}%</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      } else {
        reportTitle = language === 'ar' ? 'تقرير المقبوضات والملخص المالي' : 'Receipts and Financial Summary';
        tableHtml = `
          <table>
            <thead>
              <tr>
                <th>${language === 'ar' ? 'اسم الطالب' : 'Student Name'}</th>
                <th>${language === 'ar' ? 'نوع الرسوم' : 'Category'}</th>
                <th>${language === 'ar' ? 'المبلغ الكلي' : 'Total Billed'}</th>
                <th>${language === 'ar' ? 'المبلغ المدفوع' : 'Total Paid'}</th>
                <th>${language === 'ar' ? 'المبلغ المتبقي' : 'Outstanding'}</th>
                <th>${language === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(inv => {
                const remaining = inv.amount - inv.paidAmount;
                const statusLabel = inv.status === 'paid' ? (language === 'ar' ? 'مدفوعة' : 'Paid') :
                                    inv.status === 'partial' ? (language === 'ar' ? 'مدفوعة جزئياً' : 'Partial') :
                                    (language === 'ar' ? 'غير مدفوعة' : 'Unpaid');
                return `
                  <tr>
                    <td>${inv.studentName || inv.studentId}</td>
                    <td>${inv.category}</td>
                    <td>${inv.amount} EGP</td>
                    <td style="color: #22c55e;">${inv.paidAmount} EGP</td>
                    <td style="color: #ef4444;">${remaining} EGP</td>
                    <td><strong>${statusLabel}</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        showToast(language === 'ar' ? 'فشل فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة.' : 'Failed to open print window. Please allow popups.', 'error');
        return;
      }

      printWindow.document.write(`
        <html dir="${language === 'ar' ? 'rtl' : 'ltr'}" lang="${language}">
        <head>
          <title>${reportTitle}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Exo+2:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: ${language === 'ar' ? "'Cairo', sans-serif" : "'Exo 2', sans-serif"}; 
              padding: 40px; 
              color: #1e293b; 
              direction: ${language === 'ar' ? 'rtl' : 'ltr'}; 
              background-color: #ffffff;
            }
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #38bdf8;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .school-title {
              font-size: 22px;
              font-weight: 800;
              color: #0f172a;
            }
            .report-meta {
              text-align: ${language === 'ar' ? 'left' : 'right'};
              font-size: 12px;
              color: #64748b;
            }
            h1.report-title {
              font-size: 20px;
              color: #0369a1;
              margin-top: 0;
              margin-bottom: 20px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
              font-size: 13px;
            }
            th, td { 
              border: 1px solid #e2e8f0; 
              padding: 10px 12px; 
              text-align: ${language === 'ar' ? 'right' : 'left'}; 
            }
            th { 
              background-color: #f8fafc; 
              color: #0f172a; 
              font-weight: 700; 
            }
            tr:nth-child(even) { 
              background-color: #f1f5f9; 
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              font-size: 11px; 
              color: #94a3b8; 
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="school-title">
              ${language === 'ar' ? 'نظام مشوار المتكامل لإدارة المدارس' : 'Mishwar Integrated School Management System'}
            </div>
            <div class="report-meta">
              <div>${language === 'ar' ? 'تاريخ التصدير:' : 'Exported on:'} ${new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</div>
              <div>${language === 'ar' ? 'الشهر المالي/الدراسي:' : 'Academic/Financial Month:'} ${reportsMonth}</div>
            </div>
          </div>
          <h1 class="report-title">${reportTitle}</h1>
          ${tableHtml}
          <div class="footer">
            ${language === 'ar' 
              ? 'تم توليد هذا التقرير آلياً بواسطة نظام مشوار للمدارس. جميع الحقوق محفوظة © 2026.' 
              : 'This report was generated automatically by Mishwar SMS. All rights reserved © 2026.'}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      showToast(language === 'ar' ? 'تم تحضير ملف PDF بنجاح.' : 'PDF file prepared successfully.');
    } catch (err: any) {
      showToast(language === 'ar' ? 'حدث خطأ أثناء تصدير PDF. يرجى التأكد من السماح بالنوافذ المنبثقة.' : 'Error exporting PDF. Please make sure popups are allowed.', 'error');
    }
  };

  const handleExportExcel = () => {
    try {
      let headers: string[] = [];
      let rows: string[][] = [];
      let fileName = '';

      if (selectedReportType === 'academic') {
        fileName = `academic_report_${reportsMonth}.csv`;
        headers = language === 'ar' 
          ? ['اسم الطالب رباعي', 'الصف الدراسي', 'الرياضيات', 'اللغة العربية', 'العلوم الطبيعية']
          : ['Student Name', 'Grade', 'Mathematics', 'Arabic Language', 'Natural Sciences'];
        
        rows = students.map(s => {
          const rep = monthlyReports.find(r => r.studentId === s.id && r.month === reportsMonth);
          const math = rep?.grades?.['الرياضيات'] || 85;
          const arabic = rep?.grades?.['اللغة العربية'] || 90;
          const science = rep?.grades?.['العلوم الطبيعية'] || 88;
          return [
            s.fullName,
            formatGrade(s.grade),
            `${math}/100`,
            `${arabic}/100`,
            `${science}/100`
          ];
        });
      } else if (selectedReportType === 'attendance') {
        fileName = `attendance_report_${reportsMonth}.csv`;
        headers = language === 'ar'
          ? ['اسم الطالب', 'الصف الدراسي', 'أيام الحضور', 'أيام الغياب', 'نسبة الانضباط']
          : ['Student Name', 'Grade', 'Present Days', 'Absent Days', 'Attendance Rate'];

        rows = students.map(s => {
          const present = Object.values(s.attendance).filter(v => v === 'حاضر').length || 3;
          const absent = Object.values(s.attendance).filter(v => v === 'غائب').length || 0;
          const total = present + absent;
          const pct = total > 0 ? Math.round((present / total) * 100) : 100;
          return [
            s.fullName,
            formatGrade(s.grade),
            String(present),
            String(absent),
            `${pct}%`
          ];
        });
      } else {
        fileName = `financial_report_${reportsMonth}.csv`;
        headers = language === 'ar'
          ? ['اسم الطالب', 'نوع الرسوم', 'المبلغ الكلي', 'المبلغ المدفوع', 'المبلغ المتبقي', 'الحالة']
          : ['Student Name', 'Category', 'Total Amount', 'Paid Amount', 'Remaining', 'Status'];

        rows = invoices.map(inv => {
          const remaining = inv.amount - inv.paidAmount;
          const statusLabel = inv.status === 'paid' ? (language === 'ar' ? 'مدفوعة' : 'Paid') :
                              inv.status === 'partial' ? (language === 'ar' ? 'مدفوعة جزئياً' : 'Partial') :
                              (language === 'ar' ? 'غير مدفوعة' : 'Unpaid');
          return [
            inv.studentName || inv.studentId,
            inv.category,
            String(inv.amount),
            String(inv.paidAmount),
            String(remaining),
            statusLabel
          ];
        });
      }

      // Generate CSV content with BOM (\uFEFF) for proper Excel Arabic rendering
      const csvContent = "\uFEFF" + [
        headers.join(","),
        ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast(language === 'ar' ? 'تم تصدير ملف Excel (CSV) بنجاح.' : 'Excel (CSV) file exported successfully.');
    } catch (err: any) {
      showToast(language === 'ar' ? 'حدث خطأ أثناء التصدير لـ Excel.' : 'Error exporting to Excel.', 'error');
    }
  };

  const handleLoginSuccess = (token: string, primaryRole: string, roles: string[]) => {
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userRoles', JSON.stringify(roles));
    sessionStorage.setItem('activeRole', primaryRole);
    
    // Fetch profile
    fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        sessionStorage.setItem('userProfile', JSON.stringify(data.user));
        setUserProfile(data.user);
      });

    setIsAuthenticated(true);
    setUserToken(token);
    setUserRoles(roles);
    setActiveRole(primaryRole);
    setActiveTab('dashboard');
    showToast('تم تسجيل الدخول بنجاح');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserToken(null);
    setUserProfile(null);
    setUserRoles([]);
    setActiveRole('');
    showToast('تم تسجيل الخروج بنجاح');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  // Mark Attendance
  const handleAttendanceChange = async (studentId: string, status: string) => {
    try {
      await apiFetch('/api/attendance', {
        method: 'POST',
        body: JSON.stringify({ studentId, date: selectedDate, status })
      });
      // Update local state
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          return { ...s, attendance: { ...s.attendance, [selectedDate]: status } };
        }
        return s;
      }));
      setRegistryStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          return { ...s, attendance: { ...s.attendance, [selectedDate]: status } };
        }
        return s;
      }));
      showToast('تم تسجيل حضور الطالب بنجاح');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Student CRUD Handlers
  const handleAddStudent = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    setConfirmModal({ isOpen: true, studentId: studentId });
  };

  const handleConfirmDelete = async () => {
    if (confirmModal.studentId) {
      try {
        await apiFetch(`/api/students/${confirmModal.studentId}`, { method: 'DELETE' });
        setStudents(prev => prev.filter(s => s.id !== confirmModal.studentId));
        loadRegistryStudents();
        showToast('تم حذف الطالب بنجاح');
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    }
    setConfirmModal({ isOpen: false, studentId: null });
  };

  const handleStudentFormSubmit = async (studentData: any) => {
    try {
      if ('id' in studentData) {
        await apiFetch(`/api/students/${studentData.id}`, {
          method: 'PUT',
          body: JSON.stringify(studentData)
        });
        setStudents(prev => prev.map(s => s.id === studentData.id ? { ...s, ...studentData } : s));
        loadRegistryStudents();
        showToast('تم تحديث بيانات الطالب بنجاح');
      } else {
        const newStd = await apiFetch('/api/students', {
          method: 'POST',
          body: JSON.stringify(studentData)
        });
        setStudents(prev => [newStd, ...prev]);
        loadRegistryStudents();
        showToast('تم إضافة الطالب بنجاح');
      }
      setIsStudentModalOpen(false);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // CSV Imports
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Read and upload logic can be simulated or sent to backend.
    // Here we alert standard completion.
    showToast('رفع الملف: قيد التطوير للتحقق من التناسق.');
    event.target.value = '';
  };

  // Social Worker: Open Case
  const handleOpenCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.studentId || !newCase.title || !newCase.description) {
      return showToast('الرجاء تعبئة الحقول المطلوبة', 'error');
    }
    try {
      const added = await apiFetch('/api/cases', {
        method: 'POST',
        body: JSON.stringify(newCase)
      });
      setCaseFiles(prev => [added, ...prev]);
      setNewCase({ studentId: '', title: '', type: 'support', description: '', followUpDate: '' });
      showToast('تم فتح ملف حالة جديدة للأخصائي الاجتماعي');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Add Comment Note to social case history
  const handleAddCaseNote = async (caseId: string) => {
    if (!newCaseNote.trim()) return;
    try {
      const res = await apiFetch(`/api/cases/${caseId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ comment: newCaseNote })
      });
      setCaseFiles(prev => prev.map(c => c.id === caseId ? { ...c, notes: res.notes } : c));
      if (activeCaseDetails?.id === caseId) {
        setActiveCaseDetails(prev => prev ? { ...prev, notes: res.notes } : null);
      }
      setNewCaseNote('');
      showToast('تم إضافة الملاحظة للسجل الاجتماعي');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Update Case status
  const handleUpdateCaseStatus = async (caseId: string, status: 'open' | 'in_progress' | 'closed', followUpDate?: string | null) => {
    try {
      await apiFetch(`/api/cases/${caseId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, followUpDate })
      });
      setCaseFiles(prev => prev.map(c => c.id === caseId ? { ...c, status, followUpDate } : c));
      showToast('تم تحديث حالة الملف بنجاح');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Teacher: Submit Lesson Plan
  const handleAddLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.subject || !newPlan.objectives || !newPlan.activities) {
      return showToast('الرجاء إدخال الحقول الأساسية لدرس المعلم', 'error');
    }
    try {
      const added = await apiFetch('/api/lesson-plans', {
        method: 'POST',
        body: JSON.stringify(newPlan)
      });
      setLessonPlans(prev => [added, ...prev]);
      setNewPlan({ subject: '', grade: 'الاول', term: 'الفصل الثالث', objectives: '', materials: '', activities: '', standardAlignment: '', plannedDate: new Date().toISOString().split('T')[0] });
      showToast('تم تسليم خطة المنهج بنجاح للمنسق الأكاديمي');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Approval/Rejection of Lesson Plans
  const handleLessonPlanApproval = async (planId: string, status: 'approved' | 'rejected') => {
    const comments = planComments[planId] || '';
    try {
      await apiFetch(`/api/lesson-plans/${planId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, comments })
      });
      setLessonPlans(prev => prev.map(lp => lp.id === planId ? { ...lp, status, comments } : lp));
      showToast(`تم ${status === 'approved' ? 'اعتماد' : 'رفض'} خطة الدرس بنجاح.`);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Finance: Billing Invoices
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.studentId || !newInvoice.amount || !newInvoice.dueDate) {
      return showToast('الرجاء كتابة تفاصيل الفاتورة المطلوبة', 'error');
    }
    try {
      const added = await apiFetch('/api/finance/invoices', {
        method: 'POST',
        body: JSON.stringify({
          studentId: newInvoice.studentId,
          amount: parseFloat(newInvoice.amount),
          category: newInvoice.category,
          dueDate: newInvoice.dueDate
        })
      });
      setInvoices(prev => [added, ...prev]);
      setNewInvoice({ studentId: '', amount: '', category: 'رسوم دراسية', dueDate: '' });
      showToast('تم إصدار الفاتورة وتوجيهها لولي الأمر بنجاح');
      loadData(); // reload stats
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Log Invoice payment
  const handleRecordPayment = async (invoiceId: string) => {
    const amt = recordPaymentAmount[invoiceId];
    if (!amt || parseFloat(amt) <= 0) return showToast('الرجاء كتابة مبلغ صحيح دفعة الفاتورة', 'error');
    try {
      const res = await apiFetch('/api/finance/payments', {
        method: 'POST',
        body: JSON.stringify({ invoiceId, amount: parseFloat(amt) })
      });
      setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, paidAmount: res.newPaidAmount, status: res.status } : inv));
      setRecordPaymentAmount(prev => ({ ...prev, [invoiceId]: '' }));
      showToast('تم تسجيل الدفعة بنجاح وتحديث ميزانية الحساب.');
      loadData(); // reload stats
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Quality Audits creation
  const handleAddAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudit.title || !newAudit.findingDetails || !newAudit.deadline) {
      return showToast('الرجاء إدخال تفاصيل الجودة والتوصيات', 'error');
    }
    try {
      const added = await apiFetch('/api/compliance', {
        method: 'POST',
        body: JSON.stringify({
          ...newAudit,
          kpiScore: parseFloat(newAudit.kpiScore) || 0
        })
      });
      setAudits(prev => [added, ...prev]);
      setNewAudit({ title: '', type: 'internal', findingDetails: '', deadline: '', status: 'pending', kpiScore: '' });
      showToast('تم تسجيل تدقيق جودة جديد بنجاح');
      loadData(); // refresh summary KPI score
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Update audit status
  const handleUpdateAuditStatus = async (auditId: string, status: 'pending' | 'resolved', kpiScore: number) => {
    try {
      await apiFetch(`/api/compliance/${auditId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, kpiScore, findingDetails: 'تم حل النتائج وتطبيق الملاحظات الجودة' })
      });
      setAudits(prev => prev.map(a => a.id === auditId ? { ...a, status, kpiScore } : a));
      showToast('تم تحديث حالة التدقيق بنجاح');
      loadData(); // refresh summary KPI score
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.fullName.toLowerCase().includes(globalSearch.toLowerCase()) ||
                            student.studentId.includes(globalSearch) ||
                            student.mobile.includes(globalSearch);
      const matchesGrade = activeGrade === 'الكل' || student.grade === activeGrade;
      return matchesSearch && matchesGrade;
    });
  }, [students, globalSearch, activeGrade]);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const added = await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: newTaskTitle,
          dueDate: new Date().toISOString().split('T')[0]
        })
      });
      setTasks(prev => [...prev, added]);
      setNewTaskTitle('');
      showToast('تم إضافة المهمة بنجاح');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleTask = async (taskId: string, currentCompleted: number) => {
    try {
      await apiFetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          completed: currentCompleted === 1 ? 0 : 1
        })
      });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: currentCompleted === 1 ? 0 : 1 } : t));
      showToast('تم تحديث حالة المهمة بنجاح');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleGenerateMonthlyReports = async () => {
    try {
      const res = await apiFetch('/api/reports/monthly/generate', {
        method: 'POST',
        body: JSON.stringify({ month: reportsMonth })
      });
      showToast(`تم توليد وإرسال ${res.countGenerated} تقرير بنجاح!`);
      loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleUserRolesChange = async (userId: string, newRoles: string[]) => {
    try {
      await apiFetch(`/api/users/${userId}/roles`, {
        method: 'PUT',
        body: JSON.stringify({ roles: newRoles })
      });
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, roles: newRoles } : u));
      showToast('تم تحديث صلاحيات المستخدم بنجاح');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const activeParentKidData = students.find(s => s.id === activeParentKid);

  // Memoized counts for navigation badges
  const activeCasesCount = useMemo(() => caseFiles.filter(c => c.status !== 'closed').length, [caseFiles]);
  const pendingAuditsCount = useMemo(() => audits.filter(a => a.status === 'pending').length, [audits]);

  if (!isAuthenticated) {
    return (
      <>
        <Login 
          onLoginSuccess={handleLoginSuccess}
          language={language}
          setLanguage={setLanguage}
        />
        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(prev => ({ ...prev, show: false }))} 
          />
        )}
      </>
    );
  }

  return (
    <div className="text-[var(--text-primary)] min-h-screen">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv, text/csv" />
      
      {/* Dynamic Navigation Header */}
      <nav className="border-b border-[var(--border-color)] bg-[var(--bg-glass)] sticky top-0 z-40 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-[0_0_12px_rgba(56,189,248,0.2)] group-hover:shadow-[0_0_18px_rgba(56,189,248,0.4)] transition-all duration-300 border border-white/10 select-none">
                <GraduationCap className="h-5.5 w-5.5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-[var(--bg-primary)] animate-pulse"></span>
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text leading-tight">
                {t('schoolName')}
              </h1>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                {t('welcome')} <span className="font-bold text-[var(--text-primary)]">{userProfile?.fullName || ''}</span>
              </p>
            </div>
          </div>

          {/* Settings & Switches Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Multiple roles Switcher */}
            {userRoles.length > 1 && (
              <div className="flex items-center gap-2 bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] transition-all duration-300 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-[var(--accent-primary)]" />
                <span className="text-xs text-[var(--text-secondary)] font-semibold hidden sm:inline">{t('activeRole')}</span>
                <select 
                  value={activeRole} 
                  onChange={(e) => setActiveRole(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm border-none font-bold text-[var(--accent-primary)] focus:outline-none cursor-pointer"
                >
                  {userRoles.map(role => (
                    <option key={role} value={role} className="bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold">
                      {t(role as any)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all font-bold text-[var(--text-primary)] shadow-sm"
            >
              <Globe className="h-4 w-4 text-[var(--accent-primary)]" />
              <span>{t('langToggle')}</span>
            </button>

            {/* Dark/Light Switcher */}
            <button 
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="group flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-yellow-400 group-hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-blue-400 group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all font-bold shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 md:py-8">
        
        {/* Module selection tabs (Respecting activeRole permissions) */}
        <div className="flex flex-wrap gap-2.5 mb-8 bg-[var(--card-bg)] border border-[var(--border-color)] p-2 rounded-2xl backdrop-blur-md shadow-inner">
          
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'dashboard' 
                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BarChart3 className={`h-4.5 w-4.5 ${activeTab === 'dashboard' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
            <span>{t('tabDashboard')}</span>
          </button>

          {(activeRole === 'director' || activeRole === 'admin') && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'admin' 
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                  : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Users className={`h-4.5 w-4.5 ${activeTab === 'admin' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
              <span>{t('tabAdmin')}</span>
            </button>
          )}

          {(activeRole === 'director' || activeRole === 'admin' || activeRole === 'socialworker') && (
            <button 
              onClick={() => setActiveTab('social')} 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'social' 
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                  : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
              }`}
            >
              <HeartHandshake className={`h-4.5 w-4.5 ${activeTab === 'social' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
              <span>{t('tabSocial')}</span>
              {activeCasesCount > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full select-none ${activeTab === 'social' ? 'bg-white text-red-500 shadow-sm' : 'bg-red-500 text-white animate-pulse'}`}>
                  {activeCasesCount}
                </span>
              )}
            </button>
          )}

          {(activeRole === 'director' || activeRole === 'admin' || activeRole === 'teacher') && (
            <button 
              onClick={() => setActiveTab('teacher')} 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'teacher' 
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                  : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BookOpenCheck className={`h-4.5 w-4.5 ${activeTab === 'teacher' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
              <span>{t('tabTeacher')}</span>
            </button>
          )}

          {activeRole === 'parent' && (
            <button 
              onClick={() => setActiveTab('parent')} 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'parent' 
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                  : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Baby className={`h-4.5 w-4.5 ${activeTab === 'parent' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
              <span>{t('tabParent')}</span>
            </button>
          )}

          {(activeRole === 'director' || activeRole === 'admin' || activeRole === 'finance') && (
            <button 
              onClick={() => setActiveTab('finance')} 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'finance' 
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                  : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
              }`}
            >
              <DollarSign className={`h-4.5 w-4.5 ${activeTab === 'finance' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
              <span>{t('tabFinance')}</span>
            </button>
          )}

          {(activeRole === 'director' || activeRole === 'compliance') && (
            <button 
              onClick={() => setActiveTab('compliance')} 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'compliance' 
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                  : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ShieldCheck className={`h-4.5 w-4.5 ${activeTab === 'compliance' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
              <span>{t('tabCompliance')}</span>
              {pendingAuditsCount > 0 && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full select-none ${activeTab === 'compliance' ? 'bg-white text-orange-500 shadow-sm' : 'bg-orange-500 text-white animate-pulse'}`}>
                  {pendingAuditsCount}
                </span>
              )}
            </button>
          )}

          <button 
            onClick={() => setActiveTab('reports')} 
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'reports' 
                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText className={`h-4.5 w-4.5 ${activeTab === 'reports' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
            <span>{t('tabReports')}</span>
          </button>

          {activeRole === 'sysadmin' && (
            <button 
              onClick={() => setActiveTab('sysadmin')} 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'sysadmin' 
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)] scale-[1.02]' 
                  : 'text-[var(--text-secondary)] bg-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Settings2 className={`h-4.5 w-4.5 ${activeTab === 'sysadmin' ? 'text-white' : 'text-[var(--accent-primary)]'}`} />
              <span>{t('tabSysAdmin')}</span>
            </button>
          )}

        </div>

        {/* --- PAGE MODULE RENDERERS --- */}

        {/* 1. OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Visual KPI Cards for Director/Principal & Staff */}
            {(activeRole === 'director' || activeRole === 'admin') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-down">
                
                {/* Total Students Card */}
                <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-5 backdrop-blur-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--soft-bg-primary)] text-[var(--accent-primary)]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold">{summaryStats.totalStudents}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{t('totalStudents')}</div>
                  </div>
                </div>

                {/* Financial Health Summary Card */}
                <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-5 backdrop-blur-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--soft-bg-secondary)] text-[var(--accent-secondary)]">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {summaryStats.finance.paid} / {summaryStats.finance.invoiced}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {t('financeHealth')} ({t('outstanding')}: {summaryStats.finance.outstanding} EGP)
                    </div>
                  </div>
                </div>

                {/* Active Case Files Card */}
                <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-5 backdrop-blur-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--soft-bg-danger)] text-[var(--accent-danger)]">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold">{summaryStats.activeSocialCases}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{t('activeSocialCases')}</div>
                  </div>
                </div>

                {/* Compliance KPI Card */}
                <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-5 backdrop-blur-lg flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--soft-bg-info)] text-[var(--accent-info)]">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold">{summaryStats.complianceKPI}%</div>
                    <div className="text-xs text-[var(--text-secondary)]">{t('complianceKPI')}</div>
                  </div>
                </div>

              </div>
            )}

            {/* General Attendance Analytics (Using existing components logic) */}
            {(activeRole !== 'parent' && activeRole !== 'student') ? (
              <>
                <StatsDashboard students={filteredStudents} selectedDate={selectedDate} language={language} />
                <AdvancedStats students={filteredStudents} selectedDate={selectedDate} language={language} />
              </>
            ) : (
              // Simple Student Panel
              <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg animate-fade-in-down">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span>{t('tabDashboard')}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/20 p-5 rounded-lg border border-[var(--border-color)]">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[var(--accent-secondary)]" />
                      <span>{t('announcements')}</span>
                    </h3>
                    <div className="space-y-3">
                      {announcements.slice(0, 3).map(a => (
                        <div key={a.id} className="border-b border-[var(--border-color)] pb-2 last:border-0">
                          <h4 className="font-bold text-sm text-[var(--accent-primary)]">{a.title}</h4>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{a.content}</p>
                          <span className="text-[10px] text-gray-500">{a.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Task list for student/parent portal */}
                  <div className="bg-black/20 p-5 rounded-lg border border-[var(--border-color)]">
                    <h3 className="font-semibold text-lg mb-2">📅 {t('tasksList')}</h3>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {language === 'ar' ? 'لا توجد مهام معلقة اليوم.' : 'No pending tasks today.'}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  {renderCurriculumExplorer()}
                </div>
              </div>
            )}

            {/* Announcements Panel & Tasks tracker */}
            {activeRole !== 'parent' && activeRole !== 'student' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-down">
                
                {/* School Announcements */}
                <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                  <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4">📢 {t('announcements')}</h3>
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-3.5 bg-black/20 rounded-lg border border-[var(--border-color)]">
                        <div className="flex justify-between items-center gap-2 mb-2">
                          <span className="font-bold text-sm text-[var(--accent-primary)]">{ann.title}</span>
                          <span className="text-[10px] text-[var(--text-secondary)]">{ann.date}</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">{ann.content}</p>
                        <div className="text-[10px] text-gray-500 mt-2">{language === 'ar' ? 'نشر بواسطة:' : 'Posted by:'} {ann.authorName || (language === 'ar' ? 'الإدارة' : 'Administration')}</div>
                      </div>
                    ))}
                  </div>
                  
                  {(activeRole === 'director' || activeRole === 'admin') && (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if(!newAnnouncement.title || !newAnnouncement.content) return;
                      await apiFetch('/api/announcements', { method: 'POST', body: JSON.stringify(newAnnouncement) });
                      setNewAnnouncement({ title: '', content: '', targetRole: 'all' });
                      loadData();
                      showToast(language === 'ar' ? 'تم نشر الإعلان بنجاح' : 'Announcement published successfully');
                    }} className="mt-4 pt-4 border-t border-[var(--border-color)] space-y-3">
                      <input 
                        type="text" 
                        placeholder={language === 'ar' ? "عنوان التعميم" : "Announcement Title"}
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-black/30 border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                      <textarea 
                        placeholder={language === 'ar' ? "محتوى التعميم بالتفصيل..." : "Announcement content in detail..."}
                        rows={2}
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full bg-black/30 border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                      <button type="submit" className="px-4 py-2 bg-[var(--accent-primary)] text-white text-xs font-bold rounded-lg hover:opacity-90">{language === 'ar' ? "نشر تعميم" : "Post Announcement"}</button>
                    </form>
                  )}
                </div>

                {/* Personal Tasks Checklist */}
                <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                  <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4">✅ {t('tasksList')}</h3>
                  
                  <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder={t('addTask')} 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-grow bg-black/20 border border-[var(--border-color)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--accent-primary)] text-sm"
                    />
                    <button type="submit" className="px-4 py-2 bg-[var(--accent-primary)] text-white font-bold rounded-lg text-sm">{t('save')}</button>
                  </form>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-[var(--border-color)] hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={task.completed === 1}
                            onChange={() => handleToggleTask(task.id, task.completed)}
                            className="h-4.5 w-4.5 rounded border-gray-300 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer"
                          />
                          <span className={`text-sm ${task.completed === 1 ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)] font-medium'}`}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500">{task.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* 2. ADMIN STUDENT REGISTRY */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-fade-in-down">
            
            {/* Header controls */}
            <div className="bg-[var(--bg-glass)] rounded-xl border border-[var(--border-color)] p-4 backdrop-blur-lg flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <button onClick={handleAddStudent} className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold text-sm flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" /> <span>{language === 'ar' ? 'إضافة طالب جديد' : 'Add New Student'}</span>
                </button>
                <button onClick={handleUploadClick} className="px-4 py-2 rounded-lg bg-black/20 border border-[var(--border-color)] text-sm hover:border-[var(--accent-primary)] transition-all flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" /> <span>{language === 'ar' ? 'رفع CSV' : 'Upload CSV'}</span>
                </button>
              </div>

              {/* Attendance date picker */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)] font-semibold">{t('markAttendance')}</span>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-black/20 border border-[var(--border-color)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--accent-primary)] text-sm text-[var(--text-primary)]"
                />
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-[var(--bg-glass)] rounded-xl border border-[var(--border-color)] backdrop-blur-lg">
              <input 
                type="search" 
                placeholder={t('searchPlaceholder')}
                value={globalSearch}
                onChange={(e) => { setGlobalSearch(e.target.value); setCurrentPage(1); }}
                className="w-full md:w-1/3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-2 w-full md:w-auto">
                {gradesList.map(grade => (
                  <button
                    key={grade}
                    onClick={() => { setActiveGrade(grade); setCurrentPage(1); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${activeGrade === grade ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    {formatGrade(grade)}
                  </button>
                ))}
              </div>
            </div>

            {/* Student grid section */}
            <div className="bg-[var(--bg-glass)] rounded-xl border border-[var(--border-color)] backdrop-blur-lg overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-black/10 text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                    <th className="p-4">{t('student')}</th>
                    <th className="p-4">{t('idNumber')}</th>
                    <th className="p-4">{t('mobile')}</th>
                    <th className="p-4">{t('grade')}</th>
                    <th className="p-4">{t('gender')}</th>
                    <th className="p-4">{t('siblings')}</th>
                    <th className="p-4">{t('landmark')}</th>
                    <th className="p-4">{t('status')} ({selectedDate.slice(5)})</th>
                    <th className="p-4 text-center">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {registryStudents.map(student => (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors text-sm">
                      <td className="p-4 font-semibold text-[var(--text-primary)]">{student.fullName}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{student.studentId}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{student.mobile}</td>
                      <td className="p-4">{formatGrade(student.grade)}</td>
                      <td className="p-4">{student.gender === 'ذكر' ? t('male') : t('female')}</td>
                      <td className="p-4">{student.hasSiblings === 'نعم' ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No')}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{student.nearestLandmark}</td>
                      <td className="p-4">
                        <select 
                          value={student.attendance[selectedDate] || ''}
                          onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                          className={`rounded-md border-none p-1.5 text-xs font-semibold bg-black/20 focus:ring-1 focus:ring-[var(--accent-primary)]
                            ${student.attendance[selectedDate] === 'حاضر' ? 'text-green-500' : ''}
                            ${student.attendance[selectedDate] === 'غائب' ? 'text-red-500' : ''}
                          `}
                        >
                          <option value="">{t('status')}</option>
                          <option value="حاضر">{t('present')}</option>
                          <option value="غائب">{t('absent')}</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleEditStudent(student)} className="p-1.5 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded cursor-pointer" title={t('edit')}>
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteStudent(student.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded cursor-pointer" title={t('delete')}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {registryTotalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
                <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 hover:bg-black/20 text-xs">{language === 'ar' ? "السابق" : "Previous"}</button>
                <span className="text-xs">{language === 'ar' ? `صفحة ${currentPage} من ${registryTotalPages}` : `Page ${currentPage} of ${registryTotalPages}`}</span>
                <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === registryTotalPages} className="px-4 py-2 bg-[var(--bg-secondary)] rounded-lg disabled:opacity-50 hover:bg-black/20 text-xs">{language === 'ar' ? "التالي" : "Next"}</button>
              </div>
            )}

          </div>
        )}

        {/* 3. SOCIAL WORKER SYSTEM */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-down">
            
            {/* Create case file form */}
            <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg h-fit">
              <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-[var(--accent-primary)]" />
                <span>{t('openCase')}</span>
              </h3>
              
              <form onSubmit={handleOpenCase} className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('selectStudent')} *</label>
                  <select 
                    value={newCase.studentId} 
                    onChange={(e) => setNewCase(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  >
                    <option value="">{language === 'ar' ? "اختر الطالب" : "Select Student"}</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({formatGrade(s.grade)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('caseTitle')} *</label>
                  <input 
                    type="text" 
                    value={newCase.title}
                    onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={language === 'ar' ? "ضعف تحصيل، مشاكل سلوكية، عائلية..." : "Academic weakness, behavioral issues, family situations..."}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('caseType')}</label>
                  <select 
                    value={newCase.type} 
                    onChange={(e) => setNewCase(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="support">{language === 'ar' ? "صعوبات دراسية وتعليمية" : "Academic & Learning Difficulties"}</option>
                    <option value="behavioral">{language === 'ar' ? "حالة سلوكية أو انضباطية" : "Behavioral & Disciplinary"}</option>
                    <option value="admission">{language === 'ar' ? "ملف تسجيل / قبول" : "Admission & Enrollment"}</option>
                    <option value="family">{language === 'ar' ? "وضع عائلي أو مادي" : "Family & Financial Status"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('description')} *</label>
                  <textarea 
                    value={newCase.description}
                    onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder={language === 'ar' ? "اشرح ملخص الحالة والتقييم السلوكي أو الاجتماعي الأولي..." : "Explain the case summary and initial behavioral or social assessment..."}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('followUpDate')}</label>
                  <input 
                    type="date" 
                    value={newCase.followUpDate}
                    onChange={(e) => setNewCase(prev => ({ ...prev, followUpDate: e.target.value }))}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                  />
                </div>

                <button type="submit" className="w-full py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-sm">{language === 'ar' ? "فتح ملف الحالة" : "Open Case File"}</button>
              </form>
            </div>

            {/* Cases list and details workspace */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span>{language === 'ar' ? "ملفات الخدمة الاجتماعية النشطة" : "Active Social Work Files"}</span>
                </h3>
                <div className="space-y-4">
                  {caseFiles.map(c => (
                    <div key={c.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-black/20 hover:border-[var(--accent-primary)]/40 transition-colors">
                      <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                        <div>
                          <h4 className="font-extrabold text-[var(--text-primary)]">{c.title}</h4>
                          <span className="text-xs text-[var(--accent-primary)] font-bold">{language === 'ar' ? "الطالب:" : "Student:"} {c.studentName || c.studentId}</span>
                        </div>
                        <div className="flex gap-2">
                          <select 
                            value={c.status} 
                            onChange={(e) => handleUpdateCaseStatus(c.id, e.target.value as any, c.followUpDate)}
                            className="bg-black/40 text-xs px-2 py-1 rounded border border-[var(--border-color)] focus:outline-none"
                          >
                            <option value="open">{language === 'ar' ? "مفتوح" : "Open"}</option>
                            <option value="in_progress">{language === 'ar' ? "قيد المتابعة" : "In Progress"}</option>
                            <option value="closed">{language === 'ar' ? "مغلق" : "Closed"}</option>
                          </select>
                        </div>
                      </div>
                      
                      <p className="text-xs text-[var(--text-secondary)] mt-2">{c.description}</p>
                      
                      {c.followUpDate && (
                        <div className="mt-2 text-xs text-amber-400 font-semibold">📅 {language === 'ar' ? "تاريخ المتابعة القادم:" : "Next Follow-up Date:"} {c.followUpDate}</div>
                      )}

                      {/* Log History timeline for each case file */}
                      <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                        <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-[var(--accent-primary)]" />
                          <span>{language === 'ar' ? "الملاحظات والتحديثات الإرشادية" : "Guidance Notes & Updates"} ({c.notes.length})</span>
                        </div>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto bg-black/30 p-2.5 rounded text-xs">
                          {c.notes.map((n, idx) => (
                            <div key={idx} className="border-b border-white/5 pb-1 last:border-0">
                              <span className="text-[10px] text-gray-500 font-bold">[{n.date}] {n.author}: </span>
                              <span className="text-[var(--text-secondary)]">{n.comment}</span>
                            </div>
                          ))}
                        </div>

                        {/* Add note input */}
                        <div className="flex gap-2 mt-2">
                          <input 
                            type="text" 
                            placeholder={language === 'ar' ? "إضافة تعليق للملف..." : "Add comment to file..."}
                            value={activeCaseDetails?.id === c.id ? newCaseNote : ''}
                            onChange={(e) => {
                              setActiveCaseDetails(c);
                              setNewCaseNote(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCaseNote(c.id);
                            }}
                            className="flex-grow bg-black/30 border border-[var(--border-color)] rounded px-3 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
                          />
                          <button 
                            onClick={() => handleAddCaseNote(c.id)}
                            className="px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-bold rounded"
                          >
                            أرسل
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 4. TEACHER LESSON PLANNING & CURRICULUM */}
        {activeTab === 'teacher' && (
          <div className="space-y-6 animate-fade-in-down">
            {/* Sub-tab selection */}
            <div className="flex gap-4 border-b border-[var(--border-color)] pb-2">
              <button 
                onClick={() => setTeacherSubTab('plans')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${teacherSubTab === 'plans' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <BookOpen className="h-4 w-4" />
                <span>{language === 'ar' ? 'خطة الدرس والاعتمادات' : 'Lesson Plans & Approvals'}</span>
              </button>
              <button 
                onClick={() => setTeacherSubTab('curriculum')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${teacherSubTab === 'curriculum' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <BookOpenCheck className="h-4 w-4" />
                <span>{language === 'ar' ? 'تصفح المنهج الدراسي الموحد' : 'Syllabus & Curriculum Explorer'}</span>
              </button>
            </div>

            {teacherSubTab === 'plans' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create lesson plan form */}
            {activeRole === 'teacher' && (
              <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span>{t('submitPlan')}</span>
                </h3>
                
                <form onSubmit={handleAddLessonPlan} className="space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{language === 'ar' ? "المادة الدراسية *" : "Subject *"}</label>
                    <input 
                      type="text" 
                      placeholder={language === 'ar' ? "الرياضيات، اللغة العربية، العلوم..." : "Math, Arabic, Science..."}
                      value={newPlan.subject}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('grade')}</label>
                      <select 
                        value={newPlan.grade} 
                        onChange={(e) => setNewPlan(prev => ({ ...prev, grade: e.target.value }))}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                      >
                        {gradesList.filter(g => g !== 'الكل').map(grade => (
                          <option key={grade} value={grade}>{formatGrade(grade)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{language === 'ar' ? "الفصل الدراسي" : "Academic Term"}</label>
                      <select 
                        value={newPlan.term} 
                        onChange={(e) => setNewPlan(prev => ({ ...prev, term: e.target.value }))}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                      >
                        <option value="الفصل الاول">{language === 'ar' ? "الفصل الأول" : "Term 1"}</option>
                        <option value="الفصل الثاني">{language === 'ar' ? "الفصل الثاني" : "Term 2"}</option>
                        <option value="الفصل الثالث">{language === 'ar' ? "الفصل الثالث" : "Term 3"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('objective')} *</label>
                    <textarea 
                      placeholder={language === 'ar' ? "الأهداف الأساسية والتربوية للدرس..." : "Core lesson and educational objectives..."}
                      value={newPlan.objectives}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, objectives: e.target.value }))}
                      rows={2}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('materials')}</label>
                    <input 
                      type="text" 
                      placeholder={language === 'ar' ? "اللوح، كتاب، أنابيب اختبار..." : "Whiteboard, book, test tubes..."}
                      value={newPlan.materials}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, materials: e.target.value }))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('activities')} *</label>
                    <textarea 
                      placeholder={language === 'ar' ? "الأنشطة الصفية والمسابقات..." : "Class activities and contests..."}
                      value={newPlan.activities}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, activities: e.target.value }))}
                      rows={2}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('standard')}</label>
                    <input 
                      type="text" 
                      placeholder={language === 'ar' ? "الترابط والتواصل في الرياضيات..." : "Math reasoning and communication..."}
                      value={newPlan.standardAlignment}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, standardAlignment: e.target.value }))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('plannedDate')} *</label>
                    <input 
                      type="date" 
                      value={newPlan.plannedDate}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, plannedDate: e.target.value }))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                    />
                  </div>

                  <button type="submit" className="w-full py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-sm">{language === 'ar' ? "تقديم الخطة للمراجعة" : "Submit Plan for Review"}</button>
                </form>
              </div>
            )}

            {/* Plans listing workspace */}
            <div className={`${activeRole === 'teacher' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
              <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span>{t('lessonPlansList')}</span>
                </h3>
                
                {lessonPlans.length === 0 ? (
                  <p className="text-center text-[var(--text-secondary)] text-sm">{t('noPlans')}</p>
                ) : (
                  <div className="space-y-4">
                    {lessonPlans.map(lp => (
                      <div key={lp.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-black/20">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="text-xs font-bold bg-white/10 px-2.5 py-0.5 rounded text-[var(--text-primary)]">{formatGrade(lp.grade)} | {formatTerm(lp.term)}</span>
                            <h4 className="text-base font-extrabold text-[var(--accent-primary)] mt-1">{lp.subject}</h4>
                            <span className="text-xs text-[var(--text-secondary)]">{language === 'ar' ? "المعلم:" : "Teacher:"} {lp.teacherName || (language === 'ar' ? 'هناء أحمد' : 'Hana Ahmed')}</span>
                          </div>
                          
                          {/* Approval Status Dials */}
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase
                              ${lp.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                              ${lp.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''}
                              ${lp.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                            `}>
                              {t(lp.status as any)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-[var(--text-secondary)]">
                          <div><span className="font-bold text-[var(--text-primary)]">{t('objective')}: </span>{lp.objectives}</div>
                          <div><span className="font-bold text-[var(--text-primary)]">{t('activities')}: </span>{lp.activities}</div>
                          <div><span className="font-bold text-[var(--text-primary)]">{t('materials')}: </span>{lp.materials}</div>
                        </div>
                        
                        <div className="text-[10px] text-gray-500 mt-2">{language === 'ar' ? "المخطط له بتاريخ:" : "Planned Date:"} {lp.plannedDate}</div>

                        {lp.comments && (
                          <div className="mt-3 p-2.5 bg-black/30 border-r-2 border-[var(--accent-danger)] rounded text-xs">
                            <span className="font-bold text-red-400">{t('comments')}: </span>
                            <span className="text-[var(--text-secondary)]">{lp.comments}</span>
                          </div>
                        )}

                        {/* Coordinator Approval actions */}
                        {(activeRole === 'director' || activeRole === 'admin') && lp.status === 'pending' && (
                          <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                            <input 
                              type="text" 
                              placeholder={language === 'ar' ? "أضف تعليق التقييم أو تعديلات المنهج..." : "Add evaluation comment or syllabus modifications..."}
                              value={planComments[lp.id] || ''}
                              onChange={(e) => setPlanComments(prev => ({ ...prev, [lp.id]: e.target.value }))}
                              className="w-full bg-black/30 border border-[var(--border-color)] rounded px-3 py-1.5 text-xs focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleLessonPlanApproval(lp.id, 'approved')}
                                className="px-3.5 py-1.5 bg-green-500 text-white font-bold text-xs rounded"
                              >
                                {t('approve')}
                              </button>
                              <button 
                                onClick={() => handleLessonPlanApproval(lp.id, 'rejected')}
                                className="px-3.5 py-1.5 bg-red-500 text-white font-bold text-xs rounded"
                              >
                                {t('reject')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
            </div>
            ) : (
              renderCurriculumExplorer()
            )}
          </div>
        )}

        {/* 5. PARENT PORTAL */}
        {activeTab === 'parent' && (
          <div className="space-y-6 animate-fade-in-down">
            
            {/* Child selector */}
            <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-4 backdrop-blur-lg flex items-center gap-3">
              <span className="font-bold text-sm">{t('selectChild')}</span>
              <select 
                value={activeParentKid} 
                onChange={(e) => setActiveParentKid(e.target.value)}
                className="bg-black/20 border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm text-[var(--accent-primary)] focus:outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {s.fullName} ({formatGrade(s.grade)})
                  </option>
                ))}
              </select>
            </div>

            {activeParentKidData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Child Academic Summary & Behavior logs */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Attendance & general info */}
                  <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                    <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-[var(--accent-primary)]" />
                      <span>{language === 'ar' ? "الملف الشخصي والتواصل" : "Profile & Contacts"}</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[var(--text-secondary)]">
                      <div><span className="block text-xs font-bold text-[var(--text-primary)]">{t('student')}</span> {activeParentKidData.fullName}</div>
                      <div><span className="block text-xs font-bold text-[var(--text-primary)]">{t('idNumber')}</span> {activeParentKidData.studentId}</div>
                      <div><span className="block text-xs font-bold text-[var(--text-primary)]">{t('grade')}</span> {formatGrade(activeParentKidData.grade)}</div>
                      <div><span className="block text-xs font-bold text-[var(--text-primary)]">{t('landmark')}</span> {activeParentKidData.nearestLandmark}</div>
                    </div>
                  </div>

                  {/* Monthly Summary Archive */}
                  <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                    <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-[var(--accent-primary)]" />
                      <span>{t('archivesTitle')}</span>
                    </h3>
                    <div className="space-y-4">
                      {monthlyReports.filter(r => r.studentId === activeParentKid).map(rep => (
                        <div key={rep.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-black/20">
                          <div className="flex justify-between items-center gap-2 mb-2">
                            <span className="font-extrabold text-[var(--accent-primary)]">{language === 'ar' ? "شهر:" : "Month:"} {rep.month}</span>
                            <span className="text-[10px] text-gray-500">{language === 'ar' ? "تم الإرسال:" : "Sent At:"} {rep.sentAt.split('T')[0]}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3 pt-3 border-t border-white/5">
                            <div>
                              <span className="font-bold block text-[var(--text-primary)] mb-1">{language === 'ar' ? "العلامات والدرجات:" : "Grades & Marks:"}</span>
                              {Object.entries(rep.grades).map(([sub, val]) => (
                                <div key={sub}>{sub}: <span className="font-bold text-green-400">{val}/100</span></div>
                              ))}
                            </div>
                            <div>
                              <span className="font-bold block text-[var(--text-primary)] mb-1">{language === 'ar' ? "الحضور والغياب:" : "Attendance:"}</span>
                              <div>{language === 'ar' ? "مجموع الأيام:" : "Total Days:"} {rep.attendance.total}</div>
                              <div>{language === 'ar' ? "أيام الحضور:" : "Present Days:"} {rep.attendance.present}</div>
                              <div>{language === 'ar' ? "نسبة الانضباط:" : "Attendance Rate:"} <span className="font-bold text-amber-400">{rep.attendance.percentage}</span></div>
                            </div>
                            <div>
                              <span className="font-bold block text-[var(--text-primary)] mb-1">{language === 'ar' ? "التقرير السلوكي:" : "Behavioral Report:"}</span>
                              <div>{language === 'ar' ? "التقييم:" : "Evaluation:"} <span className="font-bold text-green-400">{language === 'ar' ? rep.behavior.status : (rep.behavior.status === 'ممتاز' ? 'Excellent' : rep.behavior.status)}</span></div>
                              <p className="text-[10px] text-[var(--text-secondary)] mt-1">{rep.behavior.notes}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-xs italic text-[var(--text-secondary)]">{language === 'ar' ? "ملاحظات المعلم:" : "Teacher Comments:"} {rep.comments}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Curriculum & Chapters Progression */}
                  <div className="space-y-4">
                    {renderCurriculumExplorer()}
                  </div>

                </div>

                {/* Parent Invoices list & Request portal */}
                <div className="space-y-6">
                  
                  {/* Financial invoicing list */}
                  <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                    <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[var(--accent-secondary)]" />
                      <span>{t('paymentSummary')}</span>
                    </h3>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {invoices.filter(i => i.studentId === activeParentKid).map(inv => (
                        <div key={inv.id} className="p-3.5 bg-black/20 rounded-lg border border-[var(--border-color)] text-xs space-y-2">
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-bold text-[var(--text-primary)]">{inv.category}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                              ${inv.status === 'paid' ? 'bg-green-500/20 text-green-400' : ''}
                              ${inv.status === 'partial' ? 'bg-amber-500/20 text-amber-400' : ''}
                              ${inv.status === 'unpaid' ? 'bg-red-500/20 text-red-400' : ''}
                            `}>
                              {inv.status === 'paid' ? (language === 'ar' ? 'مدفوعة' : 'Paid') : inv.status === 'partial' ? (language === 'ar' ? 'مدفوعة جزئياً' : 'Partially Paid') : (language === 'ar' ? 'غير مدفوعة' : 'Unpaid')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2">
                            <div><span className="text-gray-500 block">{language === 'ar' ? "المجموع" : "Total"}</span> {inv.amount} EGP</div>
                            <div><span className="text-gray-500 block">{language === 'ar' ? "المدفوع" : "Paid"}</span> {inv.paidAmount} EGP</div>
                            <div><span className="text-gray-500 block">{language === 'ar' ? "المتبقي" : "Remaining"}</span> {inv.amount - inv.paidAmount} EGP</div>
                          </div>

                          {inv.status !== 'paid' && (
                            <div className="flex gap-2 mt-3">
                              <input 
                                type="number" 
                                placeholder={language === 'ar' ? "مبلغ الدفع..." : "Payment Amount..."}
                                value={recordPaymentAmount[inv.id] || ''}
                                onChange={(e) => setRecordPaymentAmount(prev => ({ ...prev, [inv.id]: e.target.value }))}
                                className="w-1/2 bg-black/30 border border-[var(--border-color)] rounded px-2 py-1 text-xs focus:outline-none"
                              />
                              <button 
                                onClick={() => handleRecordPayment(inv.id)}
                                className="flex-grow py-1 bg-[var(--accent-primary)] text-white font-bold rounded text-xs"
                              >
                                دفع الفاتورة
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission excused request Form */}
                  <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                    <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4">📧 {t('submitExcuse')}</h3>
                    
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      showToast('تم إرسال طلب مقابلة/عذر غياب للإدارة بنجاح.');
                    }} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[var(--text-secondary)] mb-1">{language === 'ar' ? "نوع الطلب" : "Request Type"}</label>
                        <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded px-3 py-2">
                          <option value="excuse">{language === 'ar' ? "عذر غياب الطالب" : "Student Absence Excuse"}</option>
                          <option value="meeting">{language === 'ar' ? "طلب مقابلة المعلم" : "Teacher Meeting Request"}</option>
                          <option value="doc">{language === 'ar' ? "طلب شهادة قيد" : "Enrolment Certificate Request"}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[var(--text-secondary)] mb-1">{language === 'ar' ? "التفاصيل والأسباب" : "Details & Reasons"}</label>
                        <textarea placeholder={language === 'ar' ? "يرجى كتابة أسباب التغيب أو مواضيع المقابلة..." : "Please specify absence reasons or meeting topics..."} rows={3} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded px-3 py-2 focus:outline-none" />
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-[var(--accent-primary)] text-white font-bold rounded">{language === 'ar' ? "إرسال الطلب" : "Submit Request"}</button>
                    </form>
                  </div>

                </div>
              </div>
            ) : (
              <p className="text-center text-[var(--text-secondary)]">{t('selectChild')}</p>
            )}

          </div>
        )}

        {/* 6. FINANCE OFFICER PORTAL */}
        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-down">
            
            {/* Generate Billing Invoice Form */}
            <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg h-fit">
              <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4">💵 {t('billingTitle')}</h3>
              
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('selectStudent')} *</label>
                  <select 
                    value={newInvoice.studentId}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">{language === 'ar' ? "اختر الطالب لفوترته" : "Select Student to Invoice"}</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({formatGrade(s.grade)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('amount')} (EGP) *</label>
                  <input 
                    type="number" 
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder={language === 'ar' ? "مثال: 1500" : "e.g. 1500"}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('invoiceCategory')}</label>
                  <select 
                    value={newInvoice.category}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                  >
                    <option value="رسوم دراسية">{language === 'ar' ? "رسوم دراسية سنوية/فصلية" : "Annual/Semester Tuition Fees"}</option>
                    <option value="رسوم الكتب">{language === 'ar' ? "رسوم الكتب والملازم" : "Books & Study Guides Fees"}</option>
                    <option value="رسوم باص">{language === 'ar' ? "رسوم المواصلات والاتوبيس" : "Transportation & Bus Fees"}</option>
                    <option value="نشاطات">{language === 'ar' ? "نشاطات ورحلات مدرسية" : "Activities & School Trips"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('due')} *</label>
                  <input 
                    type="date" 
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                  />
                </div>

                <button type="submit" className="w-full py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-sm">{language === 'ar' ? "إصدار الفاتورة" : "Issue Invoice"}</button>
              </form>
            </div>

            {/* Invoices grid & Transaction logs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span>{language === 'ar' ? "فواتير الطلاب الصادرة ومتابعة الدفع" : "Issued Invoices & Payment Tracking"}</span>
                </h3>
                
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {invoices.map(inv => (
                    <div key={inv.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-black/20 flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <span className="text-[10px] font-bold bg-white/10 px-2.5 py-0.5 rounded text-[var(--text-primary)]">{inv.category}</span>
                        <h4 className="font-extrabold text-[var(--text-primary)] mt-1">{language === 'ar' ? "الطالب:" : "Student:"} {inv.studentName || inv.studentId}</h4>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">{language === 'ar' ? "تاريخ الإصدار:" : "Issue Date:"} {inv.issueDate} | {language === 'ar' ? "تاريخ الاستحقاق:" : "Due Date:"} {inv.dueDate}</div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2 text-xs">
                        <div className="font-bold">
                          {language === 'ar' ? "المجموع:" : "Total:"} {inv.amount} EGP | {language === 'ar' ? "المدفوع:" : "Paid:"} <span className="text-green-400">{inv.paidAmount} EGP</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase
                            ${inv.status === 'paid' ? 'bg-green-500/20 text-green-400' : ''}
                            ${inv.status === 'partial' ? 'bg-amber-500/20 text-amber-400' : ''}
                            ${inv.status === 'unpaid' ? 'bg-red-500/20 text-red-400' : ''}
                          `}>
                            {inv.status === 'paid' ? (language === 'ar' ? 'مدفوعة' : 'Paid') : inv.status === 'partial' ? (language === 'ar' ? 'مدفوعة جزئياً' : 'Partially Paid') : (language === 'ar' ? 'غير مدفوعة' : 'Unpaid')}
                          </span>
                        </div>

                        {inv.status !== 'paid' && (
                          <div className="flex gap-1.5 mt-1.5">
                            <input 
                              type="number" 
                              placeholder={language === 'ar' ? "دفعة مالية..." : "Payment amount..."}
                              value={recordPaymentAmount[inv.id] || ''}
                              onChange={(e) => setRecordPaymentAmount(prev => ({ ...prev, [inv.id]: e.target.value }))}
                              className="bg-black/30 border border-[var(--border-color)] rounded px-2.5 py-1 text-xs w-24 focus:outline-none"
                            />
                            <button 
                              onClick={() => handleRecordPayment(inv.id)}
                              className="px-3 py-1 bg-green-500 text-white font-bold rounded text-xs"
                            >
                              تسجيل نقدي
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 7. QUALITY & COMPLIANCE SYSTEM */}
        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-down">
            
            {/* Create audit recommendation Form */}
            <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg h-fit">
              <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--accent-primary)]" />
                <span>{t('addAudit')}</span>
              </h3>
              
              <form onSubmit={handleAddAudit} className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{language === 'ar' ? "موضوع التقييم / التدقيق *" : "Evaluation / Audit Topic *"}</label>
                  <input 
                    type="text" 
                    value={newAudit.title}
                    onChange={(e) => setNewAudit(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={language === 'ar' ? "تقييم المبنى، السلامة، جودة المناهج..." : "Building evaluation, safety checklist, syllabus quality..."}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('type')}</label>
                  <select 
                    value={newAudit.type} 
                    onChange={(e) => setNewAudit(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                  >
                    <option value="internal">{language === 'ar' ? "تدقيق داخلي للجودة" : "Internal Quality Audit"}</option>
                    <option value="accreditation">{language === 'ar' ? "ملف الاعتماد الخارجي والامتثال" : "External Accreditation & Compliance"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('findingDetails')} *</label>
                  <textarea 
                    value={newAudit.findingDetails}
                    onChange={(e) => setNewAudit(prev => ({ ...prev, findingDetails: e.target.value }))}
                    rows={3}
                    placeholder={language === 'ar' ? "النتائج والملاحظات والإجراءات التصحيحية الواجب تطبيقها..." : "Findings, observations, and corrective actions to be applied..."}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('kpiScore')} (0-100) *</label>
                    <input 
                      type="number" 
                      value={newAudit.kpiScore}
                      onChange={(e) => setNewAudit(prev => ({ ...prev, kpiScore: e.target.value }))}
                      placeholder={language === 'ar' ? "مثال: 90" : "e.g. 90"}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1 font-semibold">{t('deadline')} *</label>
                    <input 
                      type="date" 
                      value={newAudit.deadline}
                      onChange={(e) => setNewAudit(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-sm">{language === 'ar' ? "تسجيل التقييم" : "Record Evaluation"}</button>
              </form>
            </div>

            {/* Audits status list */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span>{language === 'ar' ? "ملفات الامتثال وتطبيق الجودة" : "Compliance & Quality Files"}</span>
                </h3>
                
                <div className="space-y-4">
                  {audits.map(aud => (
                    <div key={aud.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-black/20">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-[var(--text-primary)]">
                            aud.type === 'accreditation' ? (language === 'ar' ? 'ملف الاعتماد الخارجي' : 'External Accreditation') : (language === 'ar' ? 'تدقيق داخلي' : 'Internal Audit')
                          </span>
                          <h4 className="font-extrabold text-[var(--text-primary)] mt-1.5">{aud.title}</h4>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <select 
                            value={aud.status} 
                            onChange={(e) => handleUpdateAuditStatus(aud.id, e.target.value as any, aud.kpiScore)}
                            className="bg-black/40 text-xs px-2 py-1 rounded border border-[var(--border-color)]"
                          >
                            <option value="pending">{language === 'ar' ? "معلق" : "Pending"}</option>
                            <option value="resolved">{language === 'ar' ? "تم الحل والامتثال" : "Resolved & Compliant"}</option>
                          </select>
                          <span className="text-xs font-bold bg-[var(--soft-bg-primary)] text-[var(--accent-primary)] px-2.5 py-0.5 rounded">
                            {aud.kpiScore}%
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] mt-2">{aud.findingDetails}</p>
                      <div className="text-[10px] text-red-400 font-semibold mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                        <span>{language === 'ar' ? "تاريخ انتهاء الحل:" : "Resolution Deadline:"} {aud.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 8. REPORTS GENERATION & SUMMARY SCHEDULER */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in-down">
            
            {/* Automated monthly report trigger */}
            {(activeRole === 'director' || activeRole === 'admin') && (
              <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
                <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span>{t('monthlyReportsSettings')}</span>
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">{language === 'ar' ? "حدد الشهر المراد توليده" : "Select Month to Generate"}</label>
                    <input 
                      type="month" 
                      value={reportsMonth}
                      onChange={(e) => setReportsMonth(e.target.value)}
                      className="bg-black/20 border border-[var(--border-color)] rounded-lg px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex items-end h-full pt-4">
                    <button 
                      onClick={handleGenerateMonthlyReports}
                      className="px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-sm"
                    >
                      {t('triggerReports')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive HTML Reports Generator */}
            <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
              <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4">📊 مُولد التقارير التفاعلية (HTML Report Engine)</h3>
              
              <div className="flex flex-wrap gap-3 mb-4 text-xs font-semibold">
                <button 
                  onClick={() => setSelectedReportType('academic')}
                  className={`px-4 py-2 border rounded transition-all flex items-center gap-1.5 ${selectedReportType === 'academic' ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]' : 'bg-black/25 border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  <FileText className="h-4 w-4" />
                  <span>{language === 'ar' ? 'تقرير التحصيل الأكاديمي والدرجات' : 'Academic Grades Report'}</span>
                </button>
                <button 
                  onClick={() => setSelectedReportType('attendance')}
                  className={`px-4 py-2 border rounded transition-all flex items-center gap-1.5 ${selectedReportType === 'attendance' ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]' : 'bg-black/25 border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>{language === 'ar' ? 'تقرير الحضور والغياب للفصول' : 'Attendance Report'}</span>
                </button>
                <button 
                  onClick={() => setSelectedReportType('finance')}
                  className={`px-4 py-2 border rounded transition-all flex items-center gap-1.5 ${selectedReportType === 'finance' ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]' : 'bg-black/25 border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{language === 'ar' ? 'تقرير المقبوضات والملخص المالي' : 'Finance Summary Report'}</span>
                </button>
              </div>

              {/* Mock Report view */}
              <div className="border border-[var(--border-color)] rounded-lg p-4 bg-black/10 text-xs">
                <div className="flex justify-between items-center mb-4 border-b border-[var(--border-color)] pb-2">
                  <h4 className="font-bold text-sm text-[var(--accent-primary)]">
                    {selectedReportType === 'academic' && (language === 'ar' ? 'معاينة تقرير الدرجات والتحصيل الأكاديمي' : 'Academic Performance Preview')}
                    {selectedReportType === 'attendance' && (language === 'ar' ? 'معاينة تقرير حضور وغياب الطلاب' : 'Student Attendance Preview')}
                    {selectedReportType === 'finance' && (language === 'ar' ? 'معاينة تقرير المقبوضات والرسوم الدراسية' : 'Finance Receipts Preview')}
                  </h4>
                  <div className="flex gap-2">
                    <button onClick={handleExportPDF} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{t('exportPDF')}</span>
                    </button>
                    <button onClick={handleExportExcel} className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold flex items-center gap-1">
                      <FileSpreadsheet className="h-3 w-3" />
                      <span>{t('exportExcel')}</span>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto max-h-[350px] overflow-y-auto pr-1">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] bg-black/25 text-[var(--text-secondary)] font-bold">
                        {selectedReportType === 'academic' && (
                          <>
                            <th className="p-2">{language === 'ar' ? 'اسم الطالب رباعي' : 'Student Name'}</th>
                            <th className="p-2">{language === 'ar' ? 'الصف الدراسي' : 'Grade'}</th>
                            <th className="p-2">{language === 'ar' ? 'الرياضيات' : 'Math'}</th>
                            <th className="p-2">{language === 'ar' ? 'اللغة العربية' : 'Arabic'}</th>
                            <th className="p-2">{language === 'ar' ? 'العلوم الطبيعية' : 'Science'}</th>
                          </>
                        )}
                        {selectedReportType === 'attendance' && (
                          <>
                            <th className="p-2">{language === 'ar' ? 'اسم الطالب' : 'Student Name'}</th>
                            <th className="p-2">{language === 'ar' ? 'الصف الدراسي' : 'Grade'}</th>
                            <th className="p-2">{language === 'ar' ? 'أيام الحضور' : 'Present Days'}</th>
                            <th className="p-2">{language === 'ar' ? 'أيام الغياب' : 'Absent Days'}</th>
                            <th className="p-2">{language === 'ar' ? 'نسبة الانضباط' : 'Attendance Rate'}</th>
                          </>
                        )}
                        {selectedReportType === 'finance' && (
                          <>
                            <th className="p-2">{language === 'ar' ? 'اسم الطالب' : 'Student Name'}</th>
                            <th className="p-2">{language === 'ar' ? 'نوع الرسوم' : 'Category'}</th>
                            <th className="p-2">{language === 'ar' ? 'المبلغ الكلي' : 'Total'}</th>
                            <th className="p-2">{language === 'ar' ? 'المبلغ المدفوع' : 'Paid'}</th>
                            <th className="p-2">{language === 'ar' ? 'المبلغ المتبقي' : 'Outstanding'}</th>
                            <th className="p-2">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReportType === 'academic' && students.map(s => {
                        const rep = monthlyReports.find(r => r.studentId === s.id && r.month === reportsMonth);
                        const math = rep?.grades?.['الرياضيات'] || 85;
                        const arabic = rep?.grades?.['اللغة العربية'] || 90;
                        const science = rep?.grades?.['العلوم الطبيعية'] || 88;
                        return (
                          <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-2 font-semibold">{s.fullName}</td>
                            <td className="p-2">{formatGrade(s.grade)}</td>
                            <td className="p-2 text-green-400 font-bold">{math}/100</td>
                            <td className="p-2 text-green-400 font-bold">{arabic}/100</td>
                            <td className="p-2 text-green-400 font-bold">{science}/100</td>
                          </tr>
                        );
                      })}
                      {selectedReportType === 'attendance' && students.map(s => {
                        const present = Object.values(s.attendance).filter(v => v === 'حاضر').length || 3;
                        const absent = Object.values(s.attendance).filter(v => v === 'غائب').length || 0;
                        const total = present + absent;
                        const pct = total > 0 ? Math.round((present / total) * 100) : 100;
                        return (
                          <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-2 font-semibold">{s.fullName}</td>
                            <td className="p-2">{formatGrade(s.grade)}</td>
                            <td className="p-2">{present}</td>
                            <td className="p-2 text-red-400">{absent}</td>
                            <td className="p-2 text-amber-400 font-bold">{pct}%</td>
                          </tr>
                        );
                      })}
                      {selectedReportType === 'finance' && invoices.map(inv => {
                        const remaining = inv.amount - inv.paidAmount;
                        const statusLabel = inv.status === 'paid' ? (language === 'ar' ? 'مدفوعة' : 'Paid') :
                                            inv.status === 'partial' ? (language === 'ar' ? 'مدفوعة جزئياً' : 'Partial') :
                                            (language === 'ar' ? 'غير مدفوعة' : 'Unpaid');
                        return (
                          <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-2 font-semibold">{inv.studentName || inv.studentId}</td>
                            <td className="p-2">{inv.category}</td>
                            <td className="p-2">{inv.amount} EGP</td>
                            <td className="p-2 text-green-400">{inv.paidAmount} EGP</td>
                            <td className="p-2 text-red-400">{remaining} EGP</td>
                            <td className="p-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold
                                ${inv.status === 'paid' ? 'bg-green-500/20 text-green-400' : ''}
                                ${inv.status === 'partial' ? 'bg-amber-500/20 text-amber-400' : ''}
                                ${inv.status === 'unpaid' ? 'bg-red-500/20 text-red-400' : ''}
                              `}>
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Reports archive search */}
            <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
              <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4">📂 {t('archivesTitle')}</h3>
              
              <div className="space-y-4">
                {monthlyReports.map(rep => (
                  <div key={rep.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-black/20 flex justify-between items-center gap-4 text-xs">
                    <div>
                      <h4 className="font-extrabold text-[var(--text-primary)]">{language === 'ar' ? "تقرير الطالب:" : "Student Report:"} {rep.studentName}</h4>
                      <div className="text-[10px] text-[var(--text-secondary)] mt-1">{language === 'ar' ? `المجال الأكاديمي لشهر: ${rep.month} | تاريخ الإرسال: ${rep.sentAt.split('T')[0]}` : `Academic performance for: ${rep.month} | Sent date: ${rep.sentAt.split('T')[0]}`}</div>
                    </div>
                    <button 
                      onClick={() => showToast(`فتح أرشيف التقرير ${rep.archivedUrl}...`)}
                      className="px-3 py-1.5 bg-black/40 border border-[var(--border-color)] rounded hover:border-[var(--accent-primary)]"
                    >
                      🔗 {language === 'ar' ? "عرض التقرير" : "View Report"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 9. SYSTEM ADMIN: ROLES AND AUDIT LOGS */}
        {activeTab === 'sysadmin' && (
          <div className="space-y-6 animate-fade-in-down">
            
            {/* User Permissions Control */}
            <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
              <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-[var(--accent-primary)]" />
                <span>{t('userManagement')}</span>
              </h3>
              <div className="space-y-4">
                {allUsers.map(u => (
                  <div key={u.id} className="p-4 bg-black/20 rounded-lg border border-[var(--border-color)] flex flex-col md:flex-row justify-between md:items-center gap-4 text-sm">
                    <div>
                      <h4 className="font-extrabold text-[var(--text-primary)]">{u.fullName} ({u.username})</h4>
                      <div className="text-xs text-[var(--text-secondary)]">{u.email} | {u.mobile}</div>
                    </div>
                    
                    {/* Roles Checkboxes */}
                    <div className="flex flex-wrap gap-3">
                      {['admin', 'teacher', 'socialworker', 'finance', 'compliance', 'director', 'parent'].map(role => {
                        const hasRole = u.roles.includes(role);
                        return (
                          <label key={role} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-semibold cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={hasRole}
                              onChange={() => {
                                const newRoles = hasRole 
                                  ? u.roles.filter((r: string) => r !== role)
                                  : [...u.roles, role];
                                handleUserRolesChange(u.id, newRoles);
                              }}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer"
                            />
                            {t(role as any)}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Logs list */}
            <div className="bg-[var(--bg-glass)] border border-[var(--border-color)] rounded-xl p-6 backdrop-blur-lg">
              <h3 className="text-lg font-bold border-b border-[var(--border-color)] pb-3 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-[var(--accent-primary)]" />
                <span>{t('auditLogsTitle')}</span>
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 text-xs font-mono">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-2.5 bg-black/20 rounded border border-white/5 flex flex-col md:flex-row justify-between gap-2">
                    <div>
                      <span className="text-[var(--accent-primary)] font-bold">[{log.action}] </span>
                      <span className="text-[var(--text-secondary)]">{log.details}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 text-right">
                      {language === 'ar' ? 'بواسطة:' : 'By:'} {log.userFullName || (language === 'ar' ? 'مجهول' : 'Unknown')} | {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Helper Modals */}
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSubmit={handleStudentFormSubmit}
        studentToEdit={studentToEdit}
        language={language}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, studentId: null })}
        onConfirm={handleConfirmDelete}
        title={language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
        message={language === 'ar' ? 'هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this student? This action cannot be undone.'}
        cancelLabel={language === 'ar' ? 'إلغاء' : 'Cancel'}
        confirmLabel={language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
      />
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: 'success' })} />}
      
    </div>
  );
};

export default App;
