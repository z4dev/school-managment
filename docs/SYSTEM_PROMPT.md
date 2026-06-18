# Agent Build Prompt: School Management System (SMS)

You are building a comprehensive, multi-role **School Management System** that serves an entire school — every educational stage, from early childhood through secondary — under one platform. The system must support distinct roles with tailored permissions and screens: students, parents/guardians, teaching staff, administration, finance, and quality & compliance. Use this document as your full specification. Where a decision isn't specified, choose a sensible, production-grade default and note the assumption.

## 1. Project Overview

Build a web-based School Management System (SMS) that centralizes academic, administrative, financial, and compliance operations for a school covering all stages (e.g., Kindergarten, Primary, Preparatory/Middle, and Secondary). The system should be modular, role-based, and bilingual-ready (Arabic and English), since the source institution operates in Arabic. Every role should see only the data and tools relevant to them.

## 2. User Roles & Access

Implement role-based access control (RBAC) with at least the following roles:

- **Student** — views their own academic record, schedule, grades, and announcements.
- **Parent / Guardian** — views their child's (or children's) academic and behavioral record, receives monthly summary reports, communicates with staff, and manages administrative requests.
- **Teaching Staff** — manages classes, attendance, grading, and lesson/curriculum plans.
- **Administration (non-teaching staff)** — handles enrollment, scheduling, communications, and day-to-day operations.
- **Social Worker / Student Affairs Officer** — opens and manages student case files and admission/service request files, tracks follow-ups.
- **Finance Officer** — manages tuition, invoicing, payments, and financial reporting.
- **Quality & Compliance Officer** — manages accreditation documentation, audits, policy compliance, and quality KPIs.
- **Principal / Director** — has the highest-level dashboard with cross-module visibility and reporting.
- **System Administrator** — manages users, roles, permissions, and system configuration.

A single staff member may hold more than one role (e.g., a teacher who is also a social worker), so the permission system should support multiple role assignments per user, not a single fixed role per account.

## 3. Core Modules

### 3.1 Principal / Director Dashboard
A high-level, visual dashboard summarizing the entire school's health at a glance:
- Enrollment numbers by stage/grade, attendance trends, and academic performance summaries.
- Financial summary (revenue, outstanding payments, expenses) pulled from the Finance module.
- Open social worker case files and their status.
- Quality & compliance status (open findings, upcoming audits, KPI scores).
- Staff headcount and key HR indicators.
- Drill-down capability from every summary card into the underlying module/report.

### 3.2 Social Worker / Student Affairs Module
- Ability to **open a request/case file** for a student (e.g., admission request, behavioral case, support request, family situation).
- Each file should support: status tracking (open/in-progress/closed), notes/log history, attachments, assigned staff member, and follow-up scheduling.
- Searchable/filterable list of all files by student, status, type, and date.
- Notifications to relevant staff (e.g., principal, teacher) when a file is opened, updated, or closed.

### 3.3 Parent Portal ("Screen for Parents")
A dedicated, simplified interface for parents/guardians showing:
- Their child's (or children's) profile, grades, attendance, and behavioral notes.
- Monthly automated summary report (see Section 3.6).
- Direct messaging/communication channel with teachers and administration.
- Ability to submit requests (e.g., absence excuse, document request, meeting request) which route into the Social Worker module where relevant.
- Fee/payment status and history (read access into the Finance module).
- Announcements and school calendar/events.

### 3.4 Staff Portal ("Screen for All Employees")
A unified interface for all staff (teachers, administration, finance, quality, social workers) including:
- Personalized dashboard based on role and permissions.
- Internal announcements, HR documents, and shared calendar.
- Task/to-do tracking relevant to their role.
- Access to the specific modules their role permits (e.g., teachers see lesson planning and grading; finance sees invoicing).

### 3.5 Reports Module
A centralized reporting engine usable across roles (with permission-based scope):
- Pre-built report templates: academic performance, attendance, financial summary, case file summary, compliance status.
- Filterable by stage/grade, class, date range, and individual student/staff.
- Export to PDF and Excel.
- Scheduled/recurring report generation (used by the monthly parent report feature below).

### 3.6 Automated Monthly Parent Reports
- On a monthly schedule, automatically generate a per-student summary report (grades, attendance, behavioral notes, teacher comments) and deliver it to the student's parent/guardian via in-app notification, email, and/or SMS.
- Reports should be generated from live data via the Reports module (Section 3.5) and archived so parents can view past months' reports in their portal.
- Provide an admin setting to configure the schedule (e.g., last day of each month) and the delivery channels.

### 3.7 Teacher Lesson/Curriculum Planning Module
- Teachers can create, edit, and submit lesson plans (academic/curriculum plans) per subject, class, and term.
- Support a structured template: objectives, materials, activities, assessment method, and curriculum standard alignment.
- Workflow for submission, review, and approval (e.g., by an academic coordinator or principal).
- A calendar view of planned lessons per class/subject across the term.
- Plans should be linkable to the gradebook/attendance so a teacher can see what was planned versus what was delivered.

### 3.8 Finance Module
- Tuition fee structure management per stage/grade.
- Invoicing, payment recording, and outstanding balance tracking per student/family.
- Payment reminders to parents (integrate with the Parent Portal and notification system).
- Financial reporting for the Principal Dashboard and Reports module.

### 3.9 Quality & Compliance Module
- Document repository for accreditation and compliance documentation.
- Tracking of audits, findings, corrective actions, and deadlines.
- KPI tracking and dashboards (e.g., teacher performance, complaint resolution time, accreditation readiness).
- Surfacing of key compliance metrics to the Principal Dashboard.

## 4. Cross-Cutting Requirements

- **Multi-stage support**: data model must support multiple educational stages (e.g., KG, Primary, Preparatory, Secondary) with stage-specific grading scales, subjects, and schedules.
- **Bilingual UI**: full Arabic and English language support, including RTL layout for Arabic.
- **Notifications**: a unified notification system supporting in-app, email, and SMS/push, used by the case file module, monthly reports, payment reminders, and announcements.
- **Audit trail**: log key actions (who opened/edited a case file, who approved a lesson plan, who recorded a payment) for accountability.
- **Permissions granularity**: every module should respect role-based and per-record permissions (e.g., a teacher only sees their own classes; a parent only sees their own children).
- **Data privacy**: student and family data is sensitive — enforce strict access controls and secure storage, especially for social worker case files.
- **Responsive design**: the parent portal and staff portal must work well on both desktop and mobile.

## 5. Suggested Technical Approach (adjust as needed)

- **Frontend**: a modern component-based framework (e.g., React or Next.js) with a clean, role-aware navigation shell, supporting RTL/LTR switching.
- **Backend**: a structured API framework (e.g., NestJS or similar) with RBAC middleware and a modular architecture matching the modules above.
- **Database**: a relational database (e.g., PostgreSQL) to model students, guardians, staff, classes, case files, invoices, lesson plans, and reports with proper foreign-key relationships.
- **Scheduled jobs**: a job scheduler/queue for the monthly automated parent reports and payment reminders.
- **File storage**: secure object storage for case file attachments, compliance documents, and report exports.

## 6. Deliverables Expected From the Agent

1. A data model/schema covering all entities referenced above (students, guardians, staff, roles, classes, case files, lesson plans, invoices, reports, notifications).
2. A working authentication and role-based authorization system supporting multiple roles per user.
3. Functional implementations of each module listed in Section 3, starting with the Principal Dashboard, Parent Portal, and Social Worker module as the highest-priority slice, followed by the remaining modules.
4. The automated monthly parent report pipeline (generation + multi-channel delivery + archive).
5. Bilingual (Arabic/English) UI with RTL support.
6. Basic seed data/demo accounts for each role so the system can be evaluated end-to-end.

If any requirement is ambiguous, prioritize building a working vertical slice (one student, one parent, one teacher, one admin, end-to-end) before expanding breadth across all modules.
