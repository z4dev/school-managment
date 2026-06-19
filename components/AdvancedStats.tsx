import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { ChevronDown, ClipboardList } from 'lucide-react';

interface AdvancedStatsProps {
    students: Student[];
    selectedDate: string;
    language: 'ar' | 'en';
}

const getPercentage = (part: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((part / total) * 100)}%`;
}

// Chart Components
const GradeDistributionChart: React.FC<{ students: Student[]; language: 'ar' | 'en' }> = ({ students, language }) => {
    const formatGradeLocal = (grade: string) => {
        const map: Record<string, string> = {
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

    const gradeData = useMemo(() => {
        const gradeOrder = ['الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
        const counts = students.reduce((acc: Record<string, number>, student) => {
            acc[student.grade] = (acc[student.grade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sorted = Object.entries(counts).sort(([a], [b]) => {
            const indexA = gradeOrder.indexOf(a);
            const indexB = gradeOrder.indexOf(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
        
        const max = Math.max(...(Object.values(counts) as number[]), 0);
        return { sorted, max };
    }, [students]);

    if (gradeData.sorted.length === 0) return null;

    return (
        <div className="bg-[rgba(10,15,26,0.5)] p-5 rounded-lg border border-[var(--border-color)]">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">
              {language === 'ar' ? 'توزيع الطلاب حسب الصف' : 'Student Distribution by Grade'}
            </h3>
            <div className="space-y-3">
                {gradeData.sorted.map(([grade, count], index) => {
                    const widthPercentage = gradeData.max > 0 ? (count / gradeData.max) * 100 : 0;
                    return (
                        <div key={grade} className="flex items-center gap-3 text-sm">
                            <span className="w-24 text-[var(--text-secondary)] text-xs truncate">{formatGradeLocal(grade)}</span>
                            <div className="flex-1 bg-black/30 rounded-full h-4">
                                <div
                                    className="h-4 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
                                    style={{
                                        ['--target-width' as any]: `${widthPercentage}%`,
                                        animation: `grow-width 1s ease-out forwards`,
                                        animationDelay: `${index * 50}ms`
                                    }}
                                ></div>
                            </div>
                            <span className="w-8 text-right font-semibold text-[var(--text-primary)]">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const GenderDonutChart: React.FC<{ students: Student[]; language: 'ar' | 'en' }> = ({ students, language }) => {
    const genderData = useMemo(() => {
        const males = students.filter(s => s.gender === 'ذكر').length;
        const females = students.filter(s => s.gender === 'انثى').length;
        const total = males + females;
        const malePercentage = total > 0 ? (males / total) * 100 : 0;
        return { males, females, total, malePercentage };
    }, [students]);

    if (genderData.total === 0) return null;

    const circumference = 2 * Math.PI * 45; // 2 * pi * radius
    const maleOffset = circumference - (genderData.malePercentage / 100) * circumference;

    return (
        <div className="bg-[rgba(10,15,26,0.5)] p-5 rounded-lg border border-[var(--border-color)] flex flex-col items-center">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">
              {language === 'ar' ? 'توزيع الطلاب حسب الجنس' : 'Student Distribution by Gender'}
            </h3>
            <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="45" stroke="var(--accent-secondary)" strokeWidth="10" fill="transparent" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="var(--accent-primary)"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={maleOffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[var(--text-primary)]">{getPercentage(genderData.males, genderData.total)}</span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {language === 'ar' ? 'ذكور' : 'Males'}
                    </span>
                </div>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-primary)]"></div>
                    <span>{language === 'ar' ? 'ذكور' : 'Males'}: {genderData.males}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-secondary)]"></div>
                    <span>{language === 'ar' ? 'إناث' : 'Females'}: {genderData.females}</span>
                </div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-[rgba(10,15,26,0.5)] p-5 rounded-lg border border-[var(--border-color)] flex flex-col justify-between">
        <div>
            <div className="w-10 h-10 flex items-center justify-center bg-black/20 rounded-lg text-[var(--text-secondary)] mb-3">
                {icon}
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)]">{value}</div>
        </div>
        <div className="text-sm text-[var(--text-secondary)] mt-1">{title}</div>
    </div>
);


const AdvancedStats: React.FC<AdvancedStatsProps> = ({ students, selectedDate, language }) => {
    const [isOpen, setIsOpen] = useState(false);

    const advancedMetrics = useMemo(() => {
        const total = students.length;
        const markedAttendance = students.filter(s => s.attendance[selectedDate]).length;
        return {
            attendanceMarkedPercent: getPercentage(markedAttendance, total),
        };
    }, [students, selectedDate]);

    return (
        <div className="mb-8 animate-fade-in-down" style={{ animationDelay: '250ms' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-[var(--bg-glass)] rounded-xl border border-[var(--border-color)] backdrop-blur-lg mb-2"
            >
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-300 dark:to-slate-400">
                    {language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics'}
                </h2>
                <ChevronDown
                    className={`h-6 w-6 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                        <div className="lg:col-span-2">
                             <GradeDistributionChart students={students} language={language} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                            <GenderDonutChart students={students} language={language} />
                            <MetricCard
                                title={language === 'ar' ? 'نسبة تسجيل حضور الفصول اليوم' : 'Daily Attendance Marked Rate'}
                                value={advancedMetrics.attendanceMarkedPercent}
                                icon={<ClipboardList className="h-5 w-5" />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedStats;