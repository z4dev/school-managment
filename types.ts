export interface Student {
  id: string;
  timestamp: string;
  fullName: string;
  studentId: string;
  gender: string;
  grade: string;
  mobile: string;
  hasSiblings: string;
  nearestLandmark: string;
  attendance: { [date: string]: string }; // Maps 'YYYY-MM-DD' to status
}

export type StudentKey = keyof Omit<Student, 'id' | 'attendance'>;
