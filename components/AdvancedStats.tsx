import React, { useState, useMemo } from 'react';
import { Student } from '../types';

interface AdvancedStatsProps {
    students: Student[];
    selectedDate: string;
}

const getPercentage = (part: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((part / total) * 100)}%`;
}

// Chart Components
const GradeDistributionChart: React.FC<{ students: Student[] }> = ({ students }) => {
    const gradeData = useMemo(() => {
        const gradeOrder = ['الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع'];
        const counts = students.reduce((acc, student) => {
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
        
        const max = Math.max(...Object.values(counts), 0);
        return { sorted, max };
    }, [students]);

    if (gradeData.sorted.length === 0) return null;

    return (
        <div className="bg-[rgba(10,15,26,0.5)] p-5 rounded-lg border border-[var(--border-color)]">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">توزيع الطلاب حسب الصف</h3>
            <div className="space-y-3">
                {gradeData.sorted.map(([grade, count], index) => {
                    const widthPercentage = gradeData.max > 0 ? (count / gradeData.max) * 100 : 0;
                    return (
                        <div key={grade} className="flex items-center gap-3 text-sm">
                            <span className="w-16 text-[var(--text-secondary)] text-xs">{grade}</span>
                            <div className="flex-1 bg-black/30 rounded-full h-4">
                                <div
                                    className="h-4 rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-magenta)]"
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

const GenderDonutChart: React.FC<{ students: Student[] }> = ({ students }) => {
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
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">توزيع الطلاب حسب الجنس</h3>
            <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="45" stroke="var(--accent-magenta)" strokeWidth="10" fill="transparent" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="var(--accent-cyan)"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={maleOffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{getPercentage(genderData.males, genderData.total)}</span>
                    <span className="text-sm text-[var(--text-secondary)]">ذكور</span>
                </div>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-cyan)]"></div>
                    <span>ذكور: {genderData.males}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-magenta)]"></div>
                    <span>إناث: {genderData.females}</span>
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
            <div className="text-3xl font-bold text-white">{value}</div>
        </div>
        <div className="text-sm text-[var(--text-secondary)] mt-1">{title}</div>
    </div>
);


const AdvancedStats: React.FC<AdvancedStatsProps> = ({ students, selectedDate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const advancedMetrics = useMemo(() => {
        const total = students.length;
        const markedAttendance = students.filter(s => s.attendance[selectedDate]).length;
        const siblings = students.filter(s => s.hasSiblings === 'نعم').length;
        return {
            attendanceMarkedPercent: getPercentage(markedAttendance, total),
            siblingsPercent: getPercentage(siblings, total),
        };
    }, [students, selectedDate]);

    return (
        <div className="mb-8 animate-fade-in-down" style={{ animationDelay: '250ms' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-[var(--bg-glass)] rounded-xl border border-[var(--border-color)] backdrop-blur-lg mb-2"
            >
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-400">
                    تحليلات متقدمة
                </h2>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                        <div className="lg:col-span-2">
                             <GradeDistributionChart students={students} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                            <GenderDonutChart students={students} />
                            <MetricCard
                                title="حالة الحضور المسجلة"
                                value={advancedMetrics.attendanceMarkedPercent}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h4a1 1 0 100-2H7zm0 4a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd" /></svg>}
                            />
                            <MetricCard
                                title="الطلاب الذين لديهم إخوة"
                                value={advancedMetrics.siblingsPercent}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedStats;
