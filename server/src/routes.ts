import { Router, Request, Response } from 'express';
import { db } from './db.js';
import crypto from 'node:crypto';

const router = Router();

// --- Authentication Middleware ---
const getUserFromReq = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const username = authHeader.split(' ')[1];
  
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
  if (!user) return null;

  // Fetch roles
  const rolesRows = db.prepare('SELECT role FROM user_roles WHERE userId = ?').all(user.id) as { role: string }[];
  user.roles = rolesRows.map(r => r.role);
  return user;
};

const requireAuth = (req: Request, res: Response, next: any) => {
  const user = getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: 'غير مصرح. الرجاء تسجيل الدخول.' });
  }
  (req as any).user = user;
  next();
};

const logAudit = (userId: string | null, action: string, details: string) => {
  const insertLog = db.prepare(`
    INSERT INTO audit_logs (id, userId, action, details, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertLog.run(
    `log-${crypto.randomUUID()}`,
    userId,
    action,
    details,
    new Date().toISOString()
  );
};

// --- Auth Routes ---
router.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

  if (user && user.password === password) {
    const rolesRows = db.prepare('SELECT role FROM user_roles WHERE userId = ?').all(user.id) as { role: string }[];
    const roles = rolesRows.map(r => r.role);
    
    logAudit(user.id, 'تسجيل دخول', `سجل المستخدم ${user.fullName} الدخول بنجاح.`);

    return res.json({
      token: user.username, // Simply use username as Bearer token for demo/local purposes
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
      },
      roles
    });
  }

  res.status(400).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
});

router.get('/auth/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
    },
    roles: user.roles
  });
});

// --- Students Routes ---
router.get('/students', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  
  const pageStr = req.query.page as string;
  const limitStr = req.query.limit as string;
  const search = req.query.search ? (req.query.search as string).trim() : '';
  const grade = req.query.grade ? (req.query.grade as string).trim() : '';

  if (pageStr && !user.roles.includes('parent') && !user.roles.includes('student')) {
    const page = parseInt(pageStr, 10) || 1;
    const limit = parseInt(limitStr, 10) || 50;
    const offset = (page - 1) * limit;

    let baseQuery = 'FROM students WHERE 1=1';
    const params: any[] = [];

    if (search) {
      baseQuery += ' AND (fullName LIKE ? OR studentId = ?)';
      params.push(`%${search}%`, search);
    }

    if (grade && grade !== 'الكل') {
      baseQuery += ' AND grade = ?';
      params.push(grade);
    }

    // Get total count
    const totalCount = (db.prepare(`SELECT COUNT(*) as count ${baseQuery}`).get(...params) as { count: number }).count;

    // Get paginated students
    const query = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;
    const paginatedParams = [...params, limit, offset];
    const pageStudents = db.prepare(query).all(...paginatedParams) as any[];

    // Inject attendance mapping
    const stmt = db.prepare('SELECT date, status FROM attendance WHERE studentId = ?');
    const studentsWithAttendance = pageStudents.map((s: any) => {
      const records = stmt.all(s.id) as { date: string; status: string }[];
      const attendance: Record<string, string> = {};
      records.forEach(r => {
        attendance[r.date] = r.status;
      });
      s.attendance = attendance;
      return s;
    });

    return res.json({
      students: studentsWithAttendance,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    });
  }

  let students;
  if (user.roles.includes('parent')) {
    // Parent only sees their children
    students = db.prepare('SELECT * FROM students WHERE parentId = ?').all(user.id) as any[];
  } else if (user.roles.includes('student')) {
    // Student sees their own record
    students = db.prepare('SELECT * FROM students WHERE mobile = ? OR fullName LIKE ?').all(user.mobile, `%${user.fullName}%`) as any[];
  } else {
    // Staff roles see all
    students = db.prepare('SELECT * FROM students').all() as any[];
  }

  // Inject attendance mapping for all students
  const stmt = db.prepare('SELECT date, status FROM attendance WHERE studentId = ?');
  const studentsWithAttendance = students.map((s: any) => {
    const records = stmt.all(s.id) as { date: string; status: string }[];
    const attendance: Record<string, string> = {};
    records.forEach(r => {
      attendance[r.date] = r.status;
    });
    s.attendance = attendance;
    return s;
  });

  res.json(studentsWithAttendance);
});

router.post('/students', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'صلاحيات غير كافية.' });
  }

  const { fullName, studentId, gender, grade, mobile, hasSiblings, nearestLandmark, parentId } = req.body;
  const id = `std-${crypto.randomUUID()}`;

  try {
    const stmt = db.prepare(`
      INSERT INTO students (id, fullName, studentId, gender, grade, mobile, hasSiblings, nearestLandmark, parentId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, fullName, studentId, gender, grade, mobile, hasSiblings, nearestLandmark, parentId || null);

    logAudit(user.id, 'إضافة طالب', `تم إضافة الطالب ${fullName} بنجاح.`);
    res.status(201).json({ id, fullName, studentId, gender, grade, mobile, hasSiblings, nearestLandmark, parentId, attendance: {} });
  } catch (err: any) {
    res.status(400).json({ error: 'فشل إضافة الطالب. قد يكون رقم الهوية مكرراً.' });
  }
});

router.put('/students/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'صلاحيات غير كافية.' });
  }

  const { id } = req.params;
  const { fullName, studentId, gender, grade, mobile, hasSiblings, nearestLandmark, parentId } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE students
      SET fullName = ?, studentId = ?, gender = ?, grade = ?, mobile = ?, hasSiblings = ?, nearestLandmark = ?, parentId = ?
      WHERE id = ?
    `);
    stmt.run(fullName, studentId, gender, grade, mobile, hasSiblings, nearestLandmark, parentId || null, id);

    logAudit(user.id, 'تعديل طالب', `تم تعديل بيانات الطالب ${fullName}.`);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: 'فشل تعديل بيانات الطالب.' });
  }
});

router.delete('/students/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'صلاحيات غير كافية.' });
  }

  const { id } = req.params;
  const student = db.prepare('SELECT fullName FROM students WHERE id = ?').get(id) as { fullName: string } | undefined;

  if (student) {
    db.prepare('DELETE FROM students WHERE id = ?').run(id);
    logAudit(user.id, 'حذف طالب', `تم حذف الطالب ${student.fullName} نهائياً.`);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'الطالب غير موجود.' });
  }
});

// --- Attendance Routes ---
router.post('/attendance', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('admin') && !user.roles.includes('director') && !user.roles.includes('teacher')) {
    return res.status(403).json({ error: 'صلاحيات غير كافية لتسجيل الحضور.' });
  }

  const { studentId, date, status } = req.body;

  const stmt = db.prepare(`
    INSERT INTO attendance (studentId, date, status)
    VALUES (?, ?, ?)
    ON CONFLICT(studentId, date) DO UPDATE SET status = excluded.status
  `);
  stmt.run(studentId, date, status);

  const student = db.prepare('SELECT fullName FROM students WHERE id = ?').get(studentId) as any;
  logAudit(user.id, 'تسجيل حضور/غياب', `تم تسجيل الطالب ${student?.fullName || ''} بـ ${status} في تاريخ ${date}.`);

  res.json({ success: true });
});

// --- Social Worker Cases Routes ---
router.get('/cases', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;

  let cases;
  if (user.roles.includes('parent')) {
    // Parent sees children's cases
    cases = db.prepare(`
      SELECT c.*, s.fullName as studentName
      FROM case_files c
      JOIN students s ON c.studentId = s.id
      WHERE s.parentId = ?
    `).all(user.id);
  } else {
    // Staff roles see all
    cases = db.prepare(`
      SELECT c.*, s.fullName as studentName
      FROM case_files c
      JOIN students s ON c.studentId = s.id
    `).all();
  }

  res.json(cases.map((c: any) => ({
    ...c,
    notes: JSON.parse(c.notesJson || '[]'),
    attachments: JSON.parse(c.attachmentsJson || '[]'),
  })));
});

router.post('/cases', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('socialworker') && !user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'غير مصرح لفتح حالة اجتماعية.' });
  }

  const { studentId, title, type, description, followUpDate } = req.body;
  const id = `cs-${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString().split('T')[0];
  const initialNotes = [{
    date: createdAt,
    author: user.fullName,
    comment: 'تم فتح الملف وحفظه بنجاح.'
  }];

  const stmt = db.prepare(`
    INSERT INTO case_files (id, studentId, title, type, description, status, assignedStaffId, followUpDate, createdAt, notesJson, attachmentsJson)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    studentId,
    title,
    type,
    description,
    'open',
    user.id,
    followUpDate || null,
    createdAt,
    JSON.stringify(initialNotes),
    JSON.stringify([])
  );

  const student = db.prepare('SELECT fullName FROM students WHERE id = ?').get(studentId) as any;
  logAudit(user.id, 'فتح ملف حالة اجتماعية', `تم فتح ملف جديد للطالب: ${student?.fullName || ''} تحت عنوان: ${title}.`);

  res.status(201).json({ id, studentId, title, type, description, status: 'open', followUpDate, createdAt, notes: initialNotes, attachments: [] });
});

router.put('/cases/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { status, followUpDate } = req.body;

  const caseFile = db.prepare('SELECT * FROM case_files WHERE id = ?').get(id) as any;
  if (!caseFile) return res.status(404).json({ error: 'الحالة غير موجودة.' });

  const stmt = db.prepare(`
    UPDATE case_files
    SET status = ?, followUpDate = ?
    WHERE id = ?
  `);
  stmt.run(status, followUpDate || null, id);

  logAudit(user.id, 'تحديث ملف حالة', `تعديل حالة الملف رقم ${id} إلى ${status}.`);
  res.json({ success: true });
});

router.post('/cases/:id/notes', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { comment } = req.body;

  const caseFile = db.prepare('SELECT * FROM case_files WHERE id = ?').get(id) as any;
  if (!caseFile) return res.status(404).json({ error: 'الحالة غير موجودة.' });

  const notes = JSON.parse(caseFile.notesJson || '[]');
  notes.push({
    date: new Date().toISOString().split('T')[0],
    author: user.fullName,
    comment
  });

  db.prepare('UPDATE case_files SET notesJson = ? WHERE id = ?').run(JSON.stringify(notes), id);
  res.json({ success: true, notes });
});

// --- Teacher Lesson Plan Routes ---
router.get('/lesson-plans', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  
  let plans;
  if (user.roles.includes('teacher')) {
    plans = db.prepare('SELECT lp.*, u.fullName as teacherName FROM lesson_plans lp JOIN users u ON lp.teacherId = u.id WHERE teacherId = ?').all(user.id);
  } else {
    plans = db.prepare('SELECT lp.*, u.fullName as teacherName FROM lesson_plans lp JOIN users u ON lp.teacherId = u.id').all();
  }

  res.json(plans);
});

router.post('/lesson-plans', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('teacher')) {
    return res.status(403).json({ error: 'المعلمون فقط يمكنهم رفع الخطط الدراسية.' });
  }

  const { subject, grade, term, objectives, materials, activities, standardAlignment, plannedDate } = req.body;
  const id = `lp-${crypto.randomUUID()}`;

  const stmt = db.prepare(`
    INSERT INTO lesson_plans (id, teacherId, subject, grade, term, objectives, materials, activities, standardAlignment, status, comments, plannedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, user.id, subject, grade, term, objectives, materials, activities, standardAlignment, 'pending', null, plannedDate);

  logAudit(user.id, 'تقديم خطة درس', `تم تسليم خطة الدرس في مادة ${subject} للصف ${grade}.`);
  res.status(201).json({ id, teacherId: user.id, subject, grade, term, objectives, materials, activities, standardAlignment, status: 'pending', comments: null, plannedDate });
});

router.put('/lesson-plans/:id/status', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'غير مصرح باعتماد الخطط الدراسية.' });
  }

  const { id } = req.params;
  const { status, comments } = req.body;

  const stmt = db.prepare(`
    UPDATE lesson_plans
    SET status = ?, comments = ?
    WHERE id = ?
  `);
  stmt.run(status, comments || null, id);

  logAudit(user.id, 'اعتماد خطة درس', `تم تعديل حالة خطة الدرس رقم ${id} إلى ${status}.`);
  res.json({ success: true });
});

// --- Finance Routes ---
router.get('/finance/invoices', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  let invoices;

  if (user.roles.includes('parent')) {
    invoices = db.prepare(`
      SELECT i.*, s.fullName as studentName
      FROM invoices i
      JOIN students s ON i.studentId = s.id
      WHERE s.parentId = ?
    `).all(user.id);
  } else {
    invoices = db.prepare(`
      SELECT i.*, s.fullName as studentName
      FROM invoices i
      JOIN students s ON i.studentId = s.id
    `).all();
  }
  res.json(invoices);
});

router.post('/finance/invoices', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('finance') && !user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'صلاحيات مالية غير كافية.' });
  }

  const { studentId, amount, category, dueDate } = req.body;
  const id = `inv-${crypto.randomUUID()}`;
  const issueDate = new Date().toISOString().split('T')[0];

  const stmt = db.prepare(`
    INSERT INTO invoices (id, studentId, amount, paidAmount, status, category, issueDate, dueDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, studentId, amount, 0, 'unpaid', category, issueDate, dueDate);

  const student = db.prepare('SELECT fullName FROM students WHERE id = ?').get(studentId) as any;
  logAudit(user.id, 'إصدار فاتورة', `تم إصدار فاتورة بقيمة ${amount} لـ ${student?.fullName || ''}.`);

  res.status(201).json({ id, studentId, amount, paidAmount: 0, status: 'unpaid', category, issueDate, dueDate });
});

router.post('/finance/payments', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { invoiceId, amount } = req.body;

  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(invoiceId) as any;
  if (!invoice) return res.status(404).json({ error: 'الفاتورة غير موجودة.' });

  const newPaidAmount = invoice.paidAmount + parseFloat(amount);
  let status = 'unpaid';
  if (newPaidAmount >= invoice.amount) {
    status = 'paid';
  } else if (newPaidAmount > 0) {
    status = 'partial';
  }

  // Update invoice
  db.prepare('UPDATE invoices SET paidAmount = ?, status = ? WHERE id = ?').run(newPaidAmount, status, invoiceId);

  // Record payment
  const paymentId = `pay-${crypto.randomUUID()}`;
  db.prepare(`
    INSERT INTO payments (id, invoiceId, amount, paymentDate, recordedByUserId)
    VALUES (?, ?, ?, ?, ?)
  `).run(paymentId, invoiceId, parseFloat(amount), new Date().toISOString().split('T')[0], user.id);

  logAudit(user.id, 'تسجيل عملية دفع', `تم استلام ${amount} للفاتورة ${invoiceId}.`);
  res.json({ success: true, newPaidAmount, status });
});

router.get('/finance/payments', requireAuth, (req: Request, res: Response) => {
  const payments = db.prepare(`
    SELECT p.*, s.fullName as studentName, i.category
    FROM payments p
    JOIN invoices i ON p.invoiceId = i.id
    JOIN students s ON i.studentId = s.id
  `).all();
  res.json(payments);
});

// --- Compliance Audit Routes ---
router.get('/compliance', requireAuth, (req: Request, res: Response) => {
  const audits = db.prepare('SELECT * FROM compliance_audits').all();
  res.json(audits);
});

router.post('/compliance', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('compliance') && !user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'غير مصرح لتعديل بيانات الجودة.' });
  }

  const { title, type, findingDetails, deadline, status, kpiScore } = req.body;
  const id = `aud-${crypto.randomUUID()}`;

  const stmt = db.prepare(`
    INSERT INTO compliance_audits (id, title, type, findingDetails, deadline, status, kpiScore)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, title, type, findingDetails, deadline, status, kpiScore || 0);

  logAudit(user.id, 'إضافة تدقيق جودة', `تم إدراج تدقيق جودة جديد: ${title}.`);
  res.status(201).json({ id, title, type, findingDetails, deadline, status, kpiScore });
});

router.put('/compliance/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('compliance') && !user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'صلاحيات غير كافية.' });
  }

  const { id } = req.params;
  const { status, kpiScore, findingDetails } = req.body;

  db.prepare(`
    UPDATE compliance_audits
    SET status = ?, kpiScore = ?, findingDetails = ?
    WHERE id = ?
  `).run(status, kpiScore, findingDetails, id);

  res.json({ success: true });
});

// --- Announcements & Tasks ---
router.get('/announcements', requireAuth, (req: Request, res: Response) => {
  const anns = db.prepare(`
    SELECT a.*, u.fullName as authorName
    FROM announcements a
    LEFT JOIN users u ON a.authorId = u.id
  `).all();
  res.json(anns);
});

router.post('/announcements', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'غير مصرح لإدراج إعلانات عامة.' });
  }

  const { title, content, targetRole } = req.body;
  const id = `ann-${crypto.randomUUID()}`;

  db.prepare(`
    INSERT INTO announcements (id, title, content, targetRole, date, authorId)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, title, content, targetRole, new Date().toISOString().split('T')[0], user.id);

  res.status(201).json({ id, title, content, targetRole, date: new Date().toISOString().split('T')[0] });
});

router.get('/tasks', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const tasks = db.prepare('SELECT * FROM tasks WHERE userId = ?').all(user.id);
  res.json(tasks);
});

router.post('/tasks', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { title, dueDate } = req.body;
  const id = `tsk-${crypto.randomUUID()}`;

  db.prepare(`
    INSERT INTO tasks (id, title, userId, completed, dueDate)
    VALUES (?, ?, ?, 0, ?)
  `).run(id, title, user.id, dueDate);

  res.status(201).json({ id, title, userId: user.id, completed: 0, dueDate });
});

router.put('/tasks/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { completed } = req.body;

  db.prepare('UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?').run(completed ? 1 : 0, id, user.id);
  res.json({ success: true });
});

// --- Audit Logs ---
router.get('/audit-logs', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('admin') && !user.roles.includes('director') && !user.roles.includes('sysadmin')) {
    return res.status(403).json({ error: 'سجل العمليات متاح فقط لمديري النظام والمدير العام.' });
  }

  const logs = db.prepare(`
    SELECT l.*, u.fullName as userFullName
    FROM audit_logs l
    LEFT JOIN users u ON l.userId = u.id
    ORDER BY timestamp DESC
    LIMIT 200
  `).all();
  res.json(logs);
});

// --- Reports and Analytics ---
router.get('/reports/summary', requireAuth, (req: Request, res: Response) => {
  // Principal dashboard stats aggregation
  const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get() as any;
  const totalInvoiced = db.prepare('SELECT SUM(amount) as sum FROM invoices').get() as any;
  const totalPaid = db.prepare('SELECT SUM(paidAmount) as sum FROM invoices').get() as any;
  const activeCases = db.prepare("SELECT COUNT(*) as count FROM case_files WHERE status != 'closed'").get() as any;
  const avgKpi = db.prepare('SELECT AVG(kpiScore) as avg FROM compliance_audits').get() as any;

  res.json({
    totalStudents: totalStudents.count,
    finance: {
      invoiced: totalInvoiced.sum || 0,
      paid: totalPaid.sum || 0,
      outstanding: (totalInvoiced.sum || 0) - (totalPaid.sum || 0)
    },
    activeSocialCases: activeCases.count,
    complianceKPI: avgKpi.avg ? parseFloat(avgKpi.avg.toFixed(1)) : 0
  });
});

// --- Parent Monthly Reports Archive ---
router.get('/reports/monthly', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  let reports;

  if (user.roles.includes('parent')) {
    reports = db.prepare(`
      SELECT m.*, s.fullName as studentName
      FROM monthly_reports m
      JOIN students s ON m.studentId = s.id
      WHERE m.parentId = ?
      ORDER BY m.month DESC
    `).all(user.id);
  } else {
    reports = db.prepare(`
      SELECT m.*, s.fullName as studentName
      FROM monthly_reports m
      JOIN students s ON m.studentId = s.id
      ORDER BY m.month DESC
    `).all();
  }

  res.json(reports.map((r: any) => ({
    ...r,
    grades: JSON.parse(r.gradesJson || '{}'),
    attendance: JSON.parse(r.attendanceJson || '{}'),
    behavior: JSON.parse(r.behaviorJson || '{}'),
  })));
});

router.post('/reports/monthly/generate', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('admin') && !user.roles.includes('director')) {
    return res.status(403).json({ error: 'صلاحيات غير كافية لتوليد التقارير الدورية.' });
  }

  const { month } = req.body; // e.g. "2026-06"
  const students = db.prepare('SELECT * FROM students WHERE parentId IS NOT NULL').all() as any[];

  const insertReport = db.prepare(`
    INSERT INTO monthly_reports (id, studentId, parentId, month, gradesJson, attendanceJson, behaviorJson, comments, deliveryChannel, archivedUrl, sentAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  for (const s of students) {
    // Generate dummy grades for this month
    const grades = {
      'الرياضيات': 85 + Math.floor(Math.random() * 15),
      'اللغة العربية': 90 + Math.floor(Math.random() * 10),
      'العلوم الطبيعية': 88 + Math.floor(Math.random() * 12)
    };

    // Pull attendance for this month from DB
    const attendanceRecords = db.prepare(`
      SELECT status FROM attendance
      WHERE studentId = ? AND date LIKE ?
    `).all(s.id, `${month}%`) as { status: string }[];

    const totalDays = attendanceRecords.length || 3;
    const presentDays = attendanceRecords.filter(r => r.status === 'حاضر').length || 3;
    const attendanceSummary = {
      total: totalDays,
      present: presentDays,
      percentage: totalDays > 0 ? `${Math.round((presentDays / totalDays) * 100)}%` : '100%'
    };

    const behaviorSummary = {
      status: 'ممتاز',
      notes: 'الطالب ملتزم بالتعليمات ويبدي تعاوناً ملحوظاً مع الزملاء.'
    };

    const comments = 'مستواه التعليمي رائع جداً، نشكر تعاونكم واهتمامكم.';

    insertReport.run(
      `rep-${crypto.randomUUID()}`,
      s.id,
      s.parentId,
      month,
      JSON.stringify(grades),
      JSON.stringify(attendanceSummary),
      JSON.stringify(behaviorSummary),
      comments,
      'in-app',
      `/archives/reports_${month}_${s.studentId}.pdf`,
      new Date().toISOString()
    );
    count++;
  }

  logAudit(user.id, 'توليد تقارير شهرية', `تم توليد وإرسال عدد ${count} تقرير شهري لأولياء الأمور لشهر ${month}.`);
  res.json({ success: true, countGenerated: count });
});

// --- System Admin: Users Management ---
router.get('/users', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('sysadmin') && !user.roles.includes('admin')) {
    return res.status(403).json({ error: 'صلاحيات مدير النظام مطلوبة.' });
  }

  const users = db.prepare('SELECT id, username, fullName, email, mobile FROM users').all() as any[];
  const usersWithRoles = users.map((u: any) => {
    const rolesRows = db.prepare('SELECT role FROM user_roles WHERE userId = ?').all(u.id) as { role: string }[];
    u.roles = rolesRows.map(r => r.role);
    return u;
  });

  res.json(usersWithRoles);
});

router.put('/users/:id/roles', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user.roles.includes('sysadmin')) {
    return res.status(403).json({ error: 'مدير التقنية فقط يمكنه تعديل الصلاحيات الإدارية.' });
  }

  const { id } = req.params;
  const { roles } = req.body; // Array of role strings

  // Clear existing roles
  db.prepare('DELETE FROM user_roles WHERE userId = ?').run(id);

  // Insert new roles
  const insertRole = db.prepare('INSERT INTO user_roles (userId, role) VALUES (?, ?)');
  for (const role of roles) {
    insertRole.run(id, role);
  }

  const targetedUser = db.prepare('SELECT fullName FROM users WHERE id = ?').get(id) as any;
  logAudit(user.id, 'تعديل الصلاحيات', `تم تعديل صلاحيات المستخدم ${targetedUser?.fullName || ''} إلى [${roles.join(', ')}].`);

  res.json({ success: true });
});

export default router;
