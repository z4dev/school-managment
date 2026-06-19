import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.resolve(__dirname, '../../school.db');
export const db = new DatabaseSync(dbPath);

export function initDb() {
  // Enable foreign keys
  db.exec('PRAGMA foreign_keys = ON;');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT NOT NULL,
      email TEXT,
      mobile TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      userId TEXT NOT NULL,
      role TEXT NOT NULL,
      PRIMARY KEY (userId, role),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      studentId TEXT UNIQUE NOT NULL,
      gender TEXT NOT NULL,
      grade TEXT NOT NULL,
      mobile TEXT NOT NULL,
      hasSiblings TEXT NOT NULL,
      nearestLandmark TEXT NOT NULL,
      parentId TEXT,
      FOREIGN KEY (parentId) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      PRIMARY KEY (studentId, date),
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS case_files (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      assignedStaffId TEXT,
      followUpDate TEXT,
      createdAt TEXT NOT NULL,
      notesJson TEXT, -- JSON array of history logs/notes
      attachmentsJson TEXT, -- JSON array of files
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (assignedStaffId) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS lesson_plans (
      id TEXT PRIMARY KEY,
      teacherId TEXT NOT NULL,
      subject TEXT NOT NULL,
      grade TEXT NOT NULL,
      term TEXT NOT NULL,
      objectives TEXT NOT NULL,
      materials TEXT NOT NULL,
      activities TEXT NOT NULL,
      standardAlignment TEXT NOT NULL,
      status TEXT NOT NULL,
      comments TEXT,
      plannedDate TEXT NOT NULL,
      FOREIGN KEY (teacherId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      amount REAL NOT NULL,
      paidAmount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      category TEXT NOT NULL,
      issueDate TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      amount REAL NOT NULL,
      paymentDate TEXT NOT NULL,
      recordedByUserId TEXT,
      FOREIGN KEY (invoiceId) REFERENCES invoices(id) ON DELETE CASCADE,
      FOREIGN KEY (recordedByUserId) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS compliance_audits (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      findingDetails TEXT NOT NULL,
      deadline TEXT NOT NULL,
      status TEXT NOT NULL,
      kpiScore REAL NOT NULL DEFAULT 0
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      targetRole TEXT NOT NULL, -- "all", "teacher", "parent", etc.
      date TEXT NOT NULL,
      authorId TEXT,
      FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      userId TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0, -- 0 for false, 1 for true
      dueDate TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      userId TEXT,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS monthly_reports (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      parentId TEXT NOT NULL,
      month TEXT NOT NULL, -- e.g. "2026-06"
      gradesJson TEXT,
      attendanceJson TEXT,
      behaviorJson TEXT,
      comments TEXT,
      deliveryChannel TEXT NOT NULL, -- "in-app", "email", "sms"
      archivedUrl TEXT,
      sentAt TEXT NOT NULL,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (parentId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('Database initialized successfully.');
}
