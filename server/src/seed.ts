import { db } from './db.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_GRADES = ['الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
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

// Simple CSV Parser
const parseCSV = (csvData: string) => {
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
    const student: any = {};
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
        case 'رقم الموبايل ':
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
    return student;
  }).filter(s => s.fullName && s.studentId);
};

export function seedDb() {
  // Check if seeded
  const checkUser = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (checkUser.count > 0) {
    console.log('Database already seeded.');
    return;
  }

  console.log('Seeding database...');

  // 1. Seed default users
  const defaultUsers = [
    { id: 'usr-mazen', username: 'mazen', password: 'farra@mazen1918', fullName: 'م. مازن الفرا', email: 'mazen@mishwar.edu', mobile: '01006914858', roles: ['admin', 'director', 'sysadmin'] },
    { id: 'usr-tariq', username: 'tariq', password: 'tariq@mishwar.edu', fullName: 'أ. طارق الشريف', email: 'tariq@mishwar.edu', mobile: '01023456789', roles: ['socialworker', 'teacher', 'parent'] },
    { id: 'usr-dir', username: 'director', password: 'director123', fullName: 'أ. د. مازن الفرا', email: 'director@mishwar.edu', mobile: '01012345678', roles: ['director', 'admin'] },
    { id: 'usr-sw', username: 'socialworker', password: 'socialworker123', fullName: 'أ. طارق الشريف', email: 'social.worker@mishwar.edu', mobile: '01023456789', roles: ['socialworker'] },
    { id: 'usr-teach', username: 'teacher', password: 'teacher123', fullName: 'أ. هناء أحمد', email: 'hana.teacher@mishwar.edu', mobile: '01034567890', roles: ['teacher'] },
    { id: 'usr-parent', username: 'parent', password: 'parent123', fullName: 'مازن ياسين الفرا', email: 'parent.mazen@gmail.com', mobile: '0102686729', roles: ['parent'] },
    { id: 'usr-student', username: 'student', password: 'student123', fullName: 'رغد مازن ياسين الفرا', email: 'raghad.mazen@student.edu', mobile: '0102686729', roles: ['student'] },
    { id: 'usr-admin', username: 'admin', password: 'admin123', fullName: 'مسؤول النظام', email: 'admin@mishwar.edu', mobile: '01045678901', roles: ['admin'] },
    { id: 'usr-finance', username: 'finance', password: 'finance123', fullName: 'أ. يوسف فهمي', email: 'finance@mishwar.edu', mobile: '01056789012', roles: ['finance'] },
    { id: 'usr-compliance', username: 'compliance', password: 'compliance123', fullName: 'د. ليلى نضال', email: 'compliance@mishwar.edu', mobile: '01067890123', roles: ['compliance'] },
    { id: 'usr-sysadmin', username: 'sysadmin', password: 'sysadmin123', fullName: 'مدير التقنية', email: 'tech@mishwar.edu', mobile: '01078901234', roles: ['sysadmin'] },
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, password, fullName, email, mobile)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertRole = db.prepare(`
    INSERT INTO user_roles (userId, role)
    VALUES (?, ?)
  `);

  for (const user of defaultUsers) {
    insertUser.run(user.id, user.username, user.password, user.fullName, user.email, user.mobile);
    for (const role of user.roles) {
      insertRole.run(user.id, role);
    }
  }

  // 2. Load and Parse CSV seed data
  try {
    const rootConstantsPath = path.resolve(__dirname, '../../constants.ts');
    const fileContent = fs.readFileSync(rootConstantsPath, 'utf-8');
    const csvMatch = fileContent.match(/export const INITIAL_CSV_DATA = `([\s\S]*?)`;/);
    const csvData = csvMatch ? csvMatch[1] : '';
    
    if (csvData) {
      const parsedStudents = parseCSV(csvData);
      console.log(`Parsed ${parsedStudents.length} students from CSV.`);

      // Add secondary stage (Grades 10-12) students manually for testing and validation
      const secondaryStudents = [
        // Grade 10 (العاشر)
        { fullName: 'حازم مازن الفرا', studentId: '499100001', gender: 'ذكر', grade: 'العاشر', mobile: '01006914859', hasSiblings: 'نعم', nearestLandmark: 'زهراء مدينة نصر' },
        { fullName: 'خالد عمر الخطيب', studentId: '499100002', gender: 'ذكر', grade: 'العاشر', mobile: '01011122233', hasSiblings: 'لا', nearestLandmark: 'التجمع الخامس' },
        { fullName: 'لينا حسن عبد الرحمن', studentId: '499100003', gender: 'انثى', grade: 'العاشر', mobile: '01011122234', hasSiblings: 'نعم', nearestLandmark: 'مصر الجديدة' },
        { fullName: 'عمر محمد الفرا', studentId: '499100004', gender: 'ذكر', grade: 'العاشر', mobile: '01011122235', hasSiblings: 'نعم', nearestLandmark: 'زهراء مدينة نصر' },
        { fullName: 'سارة يوسف كريم', studentId: '499100005', gender: 'انثى', grade: 'العاشر', mobile: '01011122236', hasSiblings: 'نعم', nearestLandmark: 'المعادي' },
        { fullName: 'كريم هاني الجيار', studentId: '499100006', gender: 'ذكر', grade: 'العاشر', mobile: '01011122237', hasSiblings: 'لا', nearestLandmark: 'الشيخ زايد' },

        // Grade 11 (الحادي عشر)
        { fullName: 'يارا طارق الشريف', studentId: '499110001', gender: 'انثى', grade: 'الحادي عشر', mobile: '01023456790', hasSiblings: 'نعم', nearestLandmark: 'المعادي' },
        { fullName: 'منى مصطفى الشافعي', studentId: '499110002', gender: 'انثى', grade: 'الحادي عشر', mobile: '01022233344', hasSiblings: 'لا', nearestLandmark: 'الدقي' },
        { fullName: 'طارق أحمد السقا', studentId: '499110003', gender: 'ذكر', grade: 'الحادي عشر', mobile: '01022233345', hasSiblings: 'نعم', nearestLandmark: 'المهندسين' },
        { fullName: 'نور الدين سليم', studentId: '499110004', gender: 'ذكر', grade: 'الحادي عشر', mobile: '01022233346', hasSiblings: 'لا', nearestLandmark: 'شبرا' },
        { fullName: 'رانيا محمود درويش', studentId: '499110005', gender: 'انثى', grade: 'الحادي عشر', mobile: '01022233347', hasSiblings: 'نعم', nearestLandmark: 'غمرة' },
        { fullName: 'يسر طارق الشريف', studentId: '499110006', gender: 'انثى', grade: 'الحادي عشر', mobile: '01022233348', hasSiblings: 'نعم', nearestLandmark: 'المعادي' },

        // Grade 12 (الثاني عشر)
        { fullName: 'أحمد ماجد يونس', studentId: '499120001', gender: 'ذكر', grade: 'الثاني عشر', mobile: '01098115282', hasSiblings: 'لا', nearestLandmark: 'مصر الجديدة' },
        { fullName: 'يوسف أحمد منصور', studentId: '499120002', gender: 'ذكر', grade: 'الثاني عشر', mobile: '01033344455', hasSiblings: 'نعم', nearestLandmark: 'الهرم' },
        { fullName: 'هدى علي الجيار', studentId: '499120003', gender: 'انثى', grade: 'الثاني عشر', mobile: '01033344456', hasSiblings: 'لا', nearestLandmark: 'فيصل' },
        { fullName: 'زينب محمد يونس', studentId: '499120004', gender: 'انثى', grade: 'الثاني عشر', mobile: '01033344457', hasSiblings: 'نعم', nearestLandmark: 'مصر الجديدة' },
        { fullName: 'مصطفى محمود الباز', studentId: '499120005', gender: 'ذكر', grade: 'الثاني عشر', mobile: '01033344458', hasSiblings: 'لا', nearestLandmark: 'حلوان' },
        { fullName: 'حبيبة شريف عامر', studentId: '499120006', gender: 'انثى', grade: 'الثاني عشر', mobile: '01033344459', hasSiblings: 'نعم', nearestLandmark: 'العباسية' }
      ];
      parsedStudents.push(...secondaryStudents);

      const insertStudent = db.prepare(`
        INSERT INTO students (id, fullName, studentId, gender, grade, mobile, hasSiblings, nearestLandmark, parentId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let count = 0;
      const seenStudentIds = new Set<string>();
      for (const s of parsedStudents) {
        if (seenStudentIds.has(s.studentId)) {
          console.warn(`Skipping duplicate student ID in seed data: ${s.studentId} (${s.fullName})`);
          continue;
        }
        seenStudentIds.add(s.studentId);

        const id = `std-${count++}`;
        
        // Let's link "رغد مازن ياسين الفرا" and the secondary students specifically to the 'parent' user
        let parentId = null;
        if (s.fullName.includes('رغد مازن') || s.studentId === '431678622' || s.studentId.startsWith('499')) {
          parentId = 'usr-parent';
        }
        
        insertStudent.run(
          id,
          s.fullName,
          s.studentId,
          s.gender,
          s.grade,
          s.mobile || '01000000000',
          s.hasSiblings || 'لا',
          s.nearestLandmark || 'غير محدد',
          parentId
        );

        // Let's seed invoices and attendance for some students
        // Create standard invoices
        const insertInvoice = db.prepare(`
          INSERT INTO invoices (id, studentId, amount, paidAmount, status, category, issueDate, dueDate)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // We assign tuition fee based on grade stage
        // KG/Primary is 1000, Middle is 1500, Secondary is 2000
        const isMiddle = ['السابع', 'الثامن', 'التاسع'].includes(s.grade);
        const isSecondary = ['العاشر', 'الحادي عشر', 'الثاني عشر'].includes(s.grade);
        const fee = isSecondary ? 2000 : isMiddle ? 1500 : 1000;
        
        // Randomize status and paidAmount
        let status = 'unpaid';
        let paidAmount = 0;
        if (count % 3 === 0) {
          status = 'paid';
          paidAmount = fee;
        } else if (count % 5 === 0) {
          status = 'partial';
          paidAmount = fee / 2;
        }

        const invoiceId = `inv-${id}`;
        insertInvoice.run(
          invoiceId,
          id,
          fee,
          paidAmount,
          status,
          'رسوم دراسية',
          '2026-06-01',
          '2026-06-30'
        );

        // Seed a payment if paid/partial
        if (paidAmount > 0) {
          const insertPayment = db.prepare(`
            INSERT INTO payments (id, invoiceId, amount, paymentDate, recordedByUserId)
            VALUES (?, ?, ?, ?, ?)
          `);
          insertPayment.run(`pay-${id}`, invoiceId, paidAmount, '2026-06-05', 'usr-finance');
        }

        // Seed attendance for a couple of dates
        const insertAttendance = db.prepare(`
          INSERT INTO attendance (studentId, date, status)
          VALUES (?, ?, ?)
        `);
        // Let's make some present and some absent
        const dates = ['2026-06-16', '2026-06-17', '2026-06-18'];
        dates.forEach((date, dIdx) => {
          const attStatus = (count + dIdx) % 10 === 0 ? 'غائب' : 'حاضر';
          insertAttendance.run(id, date, attStatus);
        });

        // Seed monthly report for this student for June 2026 if they have parentId
        if (parentId) {
          const insertMonthlyReport = db.prepare(`
            INSERT INTO monthly_reports (id, studentId, parentId, month, gradesJson, attendanceJson, behaviorJson, comments, deliveryChannel, archivedUrl, sentAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          const grades = {
            'الرياضيات': 85 + (count % 15),
            'اللغة العربية': 90 + (count % 10),
            'العلوم الطبيعية': 88 + (count % 12)
          };
          const attendanceSummary = {
            total: 3,
            present: 3,
            percentage: '100%'
          };
          const behaviorSummary = {
            status: 'ممتاز',
            notes: 'الطالب ملتزم بالتعليمات ويبدي تعاوناً ملحوظاً مع الزملاء.'
          };
          insertMonthlyReport.run(
            `rep-${id}`,
            id,
            parentId,
            '2026-06',
            JSON.stringify(grades),
            JSON.stringify(attendanceSummary),
            JSON.stringify(behaviorSummary),
            'مستواه التعليمي رائع جداً، نشكر تعاونكم واهتمامكم.',
            'in-app',
            `/archives/reports_2026-06_${s.studentId}.pdf`,
            '2026-06-18T12:00:00Z'
          );
        }
      }
    }
  } catch (err) {
    console.error('Error seeding student records from CSV:', err);
  }

  // 3. Seed Social Worker cases
  const sampleCases = [
    { id: 'cs-1', studentId: 'std-1', title: 'متابعة ضعف التحصيل الدراسي', type: 'support', description: 'يعاني الطالب من تراجع ملحوظ في علامات اختبارات الرياضيات واللغة العربية منذ بداية الفصل الثاني.', status: 'in_progress', assignedStaffId: 'usr-sw', followUpDate: '2026-06-25', createdAt: '2026-06-10', notes: [{ date: '2026-06-10', author: 'أ. طارق الشريف', comment: 'تم عقد اجتماع أولي مع الطالب ومناقشة الصعوبات الدراسية التي يواجهها.' }, { date: '2026-06-15', author: 'أ. طارق الشريف', comment: 'تواصلت مع مدرس الرياضيات لتقديم الدعم الإضافي.' }] },
    { id: 'cs-2', studentId: 'std-3', title: 'تغيب متكرر دون عذر مقنع', type: 'behavioral', description: 'تغيب الطالب لمدة 5 أيام متفرقة خلال الأسبوعين الماضيين بدون إشعار مسبق أو عذر مقبول.', status: 'open', assignedStaffId: 'usr-sw', followUpDate: '2026-06-20', createdAt: '2026-06-14', notes: [{ date: '2026-06-14', author: 'أ. طارق الشريف', comment: 'تم رصد الغياب وتوجيه تنبيه أولي للنظام.' }] }
  ];
  const insertCase = db.prepare(`
    INSERT INTO case_files (id, studentId, title, type, description, status, assignedStaffId, followUpDate, createdAt, notesJson, attachmentsJson)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of sampleCases) {
    insertCase.run(
      c.id,
      c.studentId,
      c.title,
      c.type,
      c.description,
      c.status,
      c.assignedStaffId,
      c.followUpDate,
      c.createdAt,
      JSON.stringify(c.notes),
      JSON.stringify([])
    );
  }

  // 4. Seed Lesson Plans
  const sampleLessonPlans = [
    { id: 'lp-1', teacherId: 'usr-teach', subject: 'الرياضيات', grade: 'الرابع', term: 'الفصل الثالث', objectives: 'أن يتعرف الطالب على الكسور العشرية وطريقة قراءتها وكتابتها.', materials: 'اللوح التفاعلي، بطاقات تعليمية ملونة، كتاب الرياضيات المدرسي.', activities: '1. عرض نموذج تفاعلي مقسم لعشرة أجزاء. 2. عمل مسابقة ثنائية بين الطلاب لكتابة الكسر المكافئ.', standardAlignment: 'معيار الأعداد والعمليات - بند الكسور 4.1', status: 'approved', comments: 'خطة متميزة ومستوفية لجميع الشروط والأنشطة.', plannedDate: '2026-06-15' },
    { id: 'lp-2', teacherId: 'usr-teach', subject: 'العلوم الطبيعية', grade: 'الرابع', term: 'الفصل الثالث', objectives: 'أن يعدد الطالب حالات المادة الثلاث ويوضح خصائص كل حالة بالرسم.', materials: 'أنابيب اختبار، ماء، مكعبات ثلج، بالونات مضغوطة بالهواء.', activities: 'تطبيق عملي لملاحظة انصهار الجليد وتبخر الماء وتمدد البالون.', standardAlignment: 'معيار المادة والطاقة - الصف الرابع 2.3', status: 'pending', comments: null, plannedDate: '2026-06-21' }
  ];
  const insertLessonPlan = db.prepare(`
    INSERT INTO lesson_plans (id, teacherId, subject, grade, term, objectives, materials, activities, standardAlignment, status, comments, plannedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const lp of sampleLessonPlans) {
    insertLessonPlan.run(
      lp.id,
      lp.teacherId,
      lp.subject,
      lp.grade,
      lp.term,
      lp.objectives,
      lp.materials,
      lp.activities,
      lp.standardAlignment,
      lp.status,
      lp.comments,
      lp.plannedDate
    );
  }

  // 5. Seed Compliance Audits
  const audits = [
    { id: 'aud-1', title: 'مراجعة ملفات الجودة للمرحلة الابتدائية', type: 'internal', findingDetails: 'تم رصد نقص في خطط الأنشطة اللاصفية لبعض الفصول.', deadline: '2026-07-01', status: 'pending', kpiScore: 82.5 },
    { id: 'aud-2', title: 'تدقيق السلامة والصحة المهنية بالمركز', type: 'accreditation', findingDetails: 'تحديث طفايات الحريق في الطوابق العليا معتمد بالكامل.', deadline: '2026-06-10', status: 'resolved', kpiScore: 95.0 }
  ];
  const insertAudit = db.prepare(`
    INSERT INTO compliance_audits (id, title, type, findingDetails, deadline, status, kpiScore)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const aud of audits) {
    insertAudit.run(aud.id, aud.title, aud.type, aud.findingDetails, aud.deadline, aud.status, aud.kpiScore);
  }

  // 6. Seed Announcements
  const announcements = [
    { id: 'ann-1', title: 'بدء التسجيل للفصل الدراسي القادم', content: 'نلفت عناية السادة أولياء الأمور الكرام إلى فتح باب التسجيل والقبول للعام الدراسي القادم اعتباراً من الأسبوع المقبل.', targetRole: 'parent', date: '2026-06-15', authorId: 'usr-admin' },
    { id: 'ann-2', title: 'اجتماع الهيئة التدريسية الطارئ', content: 'الرجاء من جميع المعلمين الكرام حضور الاجتماع يوم الخميس القادم لمناقشة تحديثات خطط المناهج التعليمية الجارية.', targetRole: 'teacher', date: '2026-06-17', authorId: 'usr-dir' },
    { id: 'ann-3', title: 'حفل تكريم الطلاب الأوائل بالمركز', content: 'يسر إدارة المركز دعوتكم لحضور الحفل السنوي لتكريم الطلاب المتفوقين في جميع المراحل الدراسية وذلك بمسرح المركز الكبير.', targetRole: 'all', date: '2026-06-18', authorId: 'usr-admin' }
  ];
  const insertAnn = db.prepare(`
    INSERT INTO announcements (id, title, content, targetRole, date, authorId)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const ann of announcements) {
    insertAnn.run(ann.id, ann.title, ann.content, ann.targetRole, ann.date, ann.authorId);
  }

  // 7. Seed Tasks
  const tasks = [
    { id: 'tsk-1', title: 'مراجعة الميزانية الشهرية وإرسالها للمدير', userId: 'usr-finance', completed: 0, dueDate: '2026-06-20' },
    { id: 'tsk-2', title: 'صياغة تقرير الجودة والاعتماد الفصلي', userId: 'usr-compliance', completed: 1, dueDate: '2026-06-15' },
    { id: 'tsk-3', title: 'متابعة الحالة السلوكية لملف الطالب سيف أبو دقة', userId: 'usr-sw', completed: 0, dueDate: '2026-06-22' }
  ];
  const insertTask = db.prepare(`
    INSERT INTO tasks (id, title, userId, completed, dueDate)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const t of tasks) {
    insertTask.run(t.id, t.title, t.userId, t.completed, t.dueDate);
  }

  // 8. Seed Audit Logs
  const insertAuditLog = db.prepare(`
    INSERT INTO audit_logs (id, userId, action, details, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertAuditLog.run('log-1', 'usr-sysadmin', 'تهيئة النظام', 'تم تهيئة النظام بالكامل واستيراد بيانات الطلاب من ملف CSV الأصلي بنجاح.', '2026-06-18T12:00:00Z');
  insertAuditLog.run('log-2', 'usr-teach', 'تقديم خطة درس', 'قامت المعلمة هناء بتقديم خطة درس لمادة الرياضيات الصف الرابع.', '2026-06-15T09:30:00Z');

  console.log('Database seeding completed successfully.');
}
