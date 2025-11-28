import React, { useState } from 'react';
import { GraduationCap, Globe } from 'lucide-react';
import { StudentData, Language, translations } from './types';
import ControlPanel from './components/ControlPanel';
import IdCardPreview from './components/IdCardPreview';

const App: React.FC = () => {
  // Helper to calculate realistic academic dates for the initial state
  const getInitialAcademicDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // In Poland/Europe, academic year usually starts Oct 1st.
    // Base academic year start for "now"
    const currentAcademicStartYear = now.getMonth() < 9 ? currentYear - 1 : currentYear;

    // Randomize: Student could be in 1st, 2nd, or 3rd year.
    // 0 = Freshman (started this academic year)
    // 1 = Sophomore (started last year)
    // 2 = Junior (started 2 years ago)
    const yearsStudy = Math.floor(Math.random() * 3); 
    
    const issueYear = currentAcademicStartYear - yearsStudy;
    
    // Standard bachelor degree is 3-4 years. Card validity usually covers the whole period + buffer.
    const programDuration = 3 + Math.floor(Math.random() * 2); // 3 or 4 years
    const expiryYear = issueYear + programDuration;

    return {
      issue: `${issueYear}-10-01`, 
      // Expiry is typically end of September or October of the graduating year
      expiry: `${expiryYear}-10-31` 
    };
  };

  // We use state for initial dates so they don't change on every render, but only on page load.
  const [initialDates] = useState(getInitialAcademicDates());

  const [language, setLanguage] = useState<Language>('en-US');
  const [studentData, setStudentData] = useState<StudentData>({
    layout: 'vertical',
    schoolName: 'Bydgoskie Kolegium Nauk Społecznych', // Authentic Polish name
    studentName: 'Anna Kowalska',
    studentId: 'BKNS-240105',
    major: 'Stosunki Międzynarodowe', // International Relations in Polish
    issueDate: initialDates.issue,
    expiryDate: initialDates.expiry,
    themeColor: '#1e3a8a', // Deep Navy Blue
    photoUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=333&h=450',
    logoUrl: null,
    address: 'ul. Unii Lubelskiej 4C, 85-059 Bydgoszcz, POLSKA',
    notes: 'Student Studiów Stacjonarnych',
    showChip: true,
    emergencyNumber: '112 / Ochrona', // Default Polish emergency
  });

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-600" size={32} />
            <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="text-gray-400" size={18} />
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['en-US', 'zh-CN', 'ru-RU', 'pl-PL'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    language === lang
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {lang === 'zh-CN' ? '中文' : lang === 'ru-RU' ? 'Рус' : lang === 'pl-PL' ? 'Pol' : 'Eng'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left: Controls */}
          <div className="w-full lg:w-1/3 min-w-[320px]">
            <ControlPanel 
              data={studentData} 
              setData={setStudentData} 
              t={t} 
            />
          </div>

          {/* Right: Preview */}
          <div className="w-full lg:w-2/3 flex justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 lg:min-h-[800px]">
             <IdCardPreview data={studentData} t={t} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;