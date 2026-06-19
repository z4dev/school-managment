export interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  mobile?: string;
}

export interface Student {
  id: string;
  fullName: string;
  studentId: string;
  gender: string;
  grade: string;
  mobile: string;
  hasSiblings: string;
  nearestLandmark: string;
  parentId?: string | null;
  attendance: { [date: string]: string }; // Maps 'YYYY-MM-DD' to status ('حاضر' | 'غائب')
}

export interface CaseNote {
  date: string;
  author: string;
  comment: string;
}

export interface CaseFile {
  id: string;
  studentId: string;
  studentName?: string;
  title: string;
  type: string; // 'support' | 'behavioral' | 'admission' | 'family'
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  assignedStaffId?: string | null;
  followUpDate?: string | null;
  createdAt: string;
  notes: CaseNote[];
  attachments: string[];
}

export interface LessonPlan {
  id: string;
  teacherId: string;
  teacherName?: string;
  subject: string;
  grade: string;
  term: string;
  objectives: string;
  materials: string;
  activities: string;
  standardAlignment: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string | null;
  plannedDate: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName?: string;
  amount: number;
  paidAmount: number;
  status: 'unpaid' | 'partial' | 'paid';
  category: string;
  issueDate: string;
  dueDate: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  studentName?: string;
  amount: number;
  paymentDate: string;
  category?: string;
  recordedByUserId?: string | null;
}

export interface ComplianceAudit {
  id: string;
  title: string;
  type: 'internal' | 'accreditation';
  findingDetails: string;
  deadline: string;
  status: 'pending' | 'resolved';
  kpiScore: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: string;
  date: string;
  authorName?: string;
}

export interface Task {
  id: string;
  title: string;
  userId: string;
  completed: number; // 0 or 1
  dueDate: string;
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  userFullName?: string | null;
  action: string;
  details: string;
  timestamp: string;
}

export interface MonthlyReport {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  month: string;
  grades: { [subject: string]: number };
  attendance: {
    total: number;
    present: number;
    percentage: string;
  };
  behavior: {
    status: string;
    notes: string;
  };
  comments: string;
  deliveryChannel: string;
  archivedUrl?: string;
  sentAt: string;
}
