import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Student } from '../types';

interface StatsDashboardProps {
  students: Student[];
  selectedDate: string;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: 'primary' | 'secondary' | 'danger';
    secondaryValue?: string;
}

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
  
    useEffect(() => {
        const startValue = displayValue;
        const endValue = value;
        const duration = 1000;
        let startTime: number | null = null;
    
        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const current = Math.floor(progress * (endValue - startValue) + startValue);
            
            if (ref.current) {
                ref.current.textContent = String(current);
            }
    
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (ref.current) ref.current.textContent = String(endValue);
            }
        };
    
        requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
  
    return <span ref={ref}>{displayValue}</span>;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, secondaryValue }) => {
    
    const colorMap = {
        primary: {
            softBg: 'bg-[var(--soft-bg-primary)]',
            text: 'text-[var(--text-accent-primary)]',
            border: 'group-hover:border-[var(--accent-primary)]',
            glow: 'group-hover:shadow-[var(--glow-primary)]',
        },
        secondary: {
            softBg: 'bg-[var(--soft-bg-secondary)]',
            text: 'text-[var(--text-accent-secondary)]',
            border: 'group-hover:border-[var(--accent-secondary)]',
            glow: 'group-hover:shadow-[var(--glow-secondary)]',
        },
        danger: {
            softBg: 'bg-[var(--soft-bg-danger)]',
            text: 'text-[var(--text-accent-danger)]',
            border: 'group-hover:border-[var(--accent-danger)]',
            glow: 'group-hover:shadow-[var(--glow-danger)]',
        }
    };

    const styles = colorMap[color];
    
    return (
        <div className={`relative overflow-hidden bg-[var(--bg-glass)] backdrop-blur-lg border border-[var(--border-color)] rounded-xl p-5 transform hover:-translate-y-1.5 transition-transform duration-300 group`}>
            <div className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-transparent via-current/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${styles.text}`}></div>
            <div className={`absolute inset-0 rounded-xl border-2 border-transparent ${styles.border} transition-all duration-300`}></div>
            <div className="flex items-center gap-5 relative z-10">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.softBg} ${styles.text} ${styles.glow} transition-shadow duration-300`}>
                    {icon}
                </div>
                <div className="flex-grow">
                     <div className="flex items-baseline gap-2">
                         <div className="text-4xl font-bold text-[var(--text-primary)]"><AnimatedNumber value={value} /></div>
                         {secondaryValue && <div className="text-sm font-semibold text-[var(--text-secondary)]">{secondaryValue}</div>}
                    </div>
                    <div className="text-sm font-medium text-[var(--text-secondary)]">{label}</div>
                </div>
            </div>
        </div>
    );
};

const StatsDashboard: React.FC<StatsDashboardProps> = ({ students, selectedDate }) => {
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const presentStudents = students.filter(s => s.attendance[selectedDate] === 'حاضر').length;
    const absentStudents = students.filter(s => s.attendance[selectedDate] === 'غائب').length;
    
    return {
      totalStudents,
      presentStudents,
      absentStudents,
    };
  }, [students, selectedDate]);

  const getPercentage = (part: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((part / total) * 100)}%`;
  }

  return (
    <div style={{ animationDelay: '200ms' }} className="animate-fade-in-down grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="إجمالي الطلاب"
        value={stats.totalStudents}
        color="primary"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
      />
      <StatCard
        label="الطلاب الحاضرون"
        value={stats.presentStudents}
        secondaryValue={getPercentage(stats.presentStudents, stats.totalStudents)}
        color="secondary"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <StatCard
        label="الطلاب الغائبون"
        value={stats.absentStudents}
        secondaryValue={getPercentage(stats.absentStudents, stats.totalStudents)}
        color="danger"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
    </div>
  );
};

export default StatsDashboard;