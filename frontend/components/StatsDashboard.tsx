import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import SiblingsModal from './SiblingsModal';
import { Users, CheckCircle2, XCircle, Baby } from 'lucide-react';

interface StatsDashboardProps {
  students: Student[];
  selectedDate: string;
  language: 'ar' | 'en';
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: 'primary' | 'secondary' | 'danger' | 'info';
    secondaryValue?: string;
    onClick?: () => void;
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

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, secondaryValue, onClick }) => {
    
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
        },
        info: {
            softBg: 'bg-[var(--soft-bg-info)]',
            text: 'text-[var(--text-accent-info)]',
            border: 'group-hover:border-[var(--accent-info)]',
            glow: 'group-hover:shadow-[var(--glow-info)]',
        }
    };

    const styles = colorMap[color];
    
    return (
        <div onClick={onClick} className={`relative overflow-hidden bg-[var(--bg-glass)] backdrop-blur-lg border border-[var(--border-color)] rounded-xl p-5 transform hover:-translate-y-1.5 transition-transform duration-300 group ${onClick ? 'cursor-pointer' : ''}`}>
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

const StatsDashboard: React.FC<StatsDashboardProps> = ({ students, selectedDate, language }) => {
  const [isSiblingsModalOpen, setIsSiblingsModalOpen] = useState(false);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const presentStudents = students.filter(s => s.attendance[selectedDate] === 'حاضر').length;
    const absentStudents = students.filter(s => s.attendance[selectedDate] === 'غائب').length;
    const studentsWithSiblings = students.filter(s => s.hasSiblings.trim() === 'نعم').length;

    return {
      totalStudents,
      presentStudents,
      absentStudents,
      studentsWithSiblings,
    };
  }, [students, selectedDate]);

  const getPercentage = (part: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((part / total) * 100)}%`;
  }

  return (
    <>
      <div style={{ animationDelay: '200ms' }} className="animate-fade-in-down grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label={language === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}
          value={stats.totalStudents}
          color="primary"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          label={language === 'ar' ? 'الطلاب الحاضرون' : 'Present Students'}
          value={stats.presentStudents}
          secondaryValue={getPercentage(stats.presentStudents, stats.totalStudents)}
          color="secondary"
          icon={<CheckCircle2 className="h-6 w-6" />}
        />
        <StatCard
          label={language === 'ar' ? 'الطلاب الغائبون' : 'Absent Students'}
          value={stats.absentStudents}
          secondaryValue={getPercentage(stats.absentStudents, stats.totalStudents)}
          color="danger"
          icon={<XCircle className="h-6 w-6" />}
        />
        <StatCard
          label={language === 'ar' ? 'طلاب لديهم إخوة' : 'Students with Siblings'}
          value={stats.studentsWithSiblings}
          color="info"
          onClick={() => setIsSiblingsModalOpen(true)}
          icon={<Baby className="h-6 w-6" />}
        />
      </div>
      <SiblingsModal 
        isOpen={isSiblingsModalOpen}
        onClose={() => setIsSiblingsModalOpen(false)}
        students={students}
        language={language}
      />
    </>
  );
};

export default StatsDashboard;