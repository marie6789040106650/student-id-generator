import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import { StudentData, Translation } from '../types';

interface IdCardPreviewProps {
  data: StudentData;
  t: Translation;
}

// ----------------------------------------------------------------------
// Helper Component: Procedural University Shield Logo
// Generates a classic academic shield if no logo is uploaded
// ----------------------------------------------------------------------
const DefaultUniversityLogo = ({ name, color, className }: { name: string; color: string, className?: string }) => {
  // Extract up to 4 initials (e.g., "Massachusetts Inst Tech" -> "MIT", "Bydgoskie Kolegium Nauk Społecznych" -> "BKNS")
  const initials = (name || 'UNI')
    .split(/[\s-]+/)
    .map(w => w[0])
    .join('')
    .substring(0, 4)
    .toUpperCase();

  return (
    <svg viewBox="0 0 100 120" className={`drop-shadow-sm ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Shield Base Shape */}
      <path
        d="M50 115C50 115 5 95 5 35V10H95V35C95 95 50 115 50 115Z"
        fill="url(#shieldGrad)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      
      {/* Decorative Inner Line */}
      <path
        d="M50 108C50 108 12 90 12 38V17H88V38C88 90 50 108 50 108Z"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Top Banner Background */}
      <path d="M5 10H95V32H5V10Z" fill="black" fillOpacity="0.15" />

      {/* Initials in Top Banner */}
      <text
        x="50"
        y="26"
        fill="white"
        fontSize={initials.length > 3 ? "12" : "14"}
        fontFamily="serif"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing="1"
      >
        {initials}
      </text>

      {/* Book Icon (Symbol of Knowledge) */}
      <g transform="translate(0, 5)">
        <path
            d="M28 55C28 55 38 55 50 60C62 55 72 55 72 55V82C72 82 62 82 50 87C38 82 28 82 28 82V55Z"
            fill="white"
        />
        <path
            d="M28 55C28 55 38 55 50 60V87C38 82 28 82 28 82"
            fill="black"
            fillOpacity="0.1"
        />
        {/* Book Spine */}
        <line x1="50" y1="60" x2="50" y2="87" stroke={color} strokeWidth="1.5" />
      </g>
      
      {/* Subtle Laurel Wreaths Hints */}
      <path d="M25 90 Q15 75 25 55" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.3" strokeLinecap="round" />
      <path d="M75 90 Q85 75 75 55" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.3" strokeLinecap="round" />
    </svg>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

const IdCardPreview: React.FC<IdCardPreviewProps> = ({ data, t }) => {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const cleanFilename = (name: string, suffix: string) => {
    return `${name.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'student'}_${suffix}`;
  };

  const handleDownload = async (ref: React.RefObject<HTMLDivElement>, suffix: string) => {
    if (ref.current) {
      const canvas = await html2canvas(ref.current, {
        scale: 3, // Higher resolution for crisp print quality
        backgroundColor: null,
        useCORS: true, 
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${cleanFilename(data.studentName, suffix)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Basic check for PL/RU/EU format vs US
        // In this simple app, we can infer context from the 't.title' or pass language prop, 
        // but heuristic based on the current translation object is safer or just use a standard format.
        // Let's use DD.MM.YYYY for everyone except US, or just DD.MM.YYYY as it's very "ID Card" like.
        
        // Actually, detecting the language from the props would be best.
        // Since we don't pass the language code explicitly, we can guess or just stick to a European standard 
        // given the user's focus on Polish ID cards.
        
        // Let's assume DD.MM.YYYY for realism in this context.
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch (e) {
        return dateString;
    }
  };

  const isVertical = data.layout === 'vertical';

  // ISO 7810 ID-1 Standard Ratio approx 1.586
  // Scaling up for display: roughly 540x340 or 340x540
  const cardClasses = `relative bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 select-none group border border-gray-100 ${
    isVertical ? 'w-[360px] h-[570px]' : 'w-[570px] h-[360px]'
  }`;

  // Helper for the Gold Smart Chip
  const SmartChip = () => (
    <div className="w-11 h-9 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-md border border-yellow-600/30 relative overflow-hidden shadow-sm mx-1">
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-700/40"></div>
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-yellow-700/40"></div>
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-yellow-700/40 rounded-sm"></div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-12 perspective-1000 w-full">
      
      {/* Front Side */}
      <div className="flex flex-col items-center gap-6">
        <div ref={frontRef} className={cardClasses}>
          {/* Plastic Texture Overlay (Noise) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          
          {/* Holographic Reflection Simulation */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-20 pointer-events-none"></div>

          {/* Background Watermark (Big Shield) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
             <div className="w-[80%] h-[80%] opacity-[0.05] grayscale transform rotate-12 scale-110">
                {data.logoUrl ? (
                    <img src={data.logoUrl} className="w-full h-full object-contain" alt="" />
                ) : (
                    <DefaultUniversityLogo name={data.schoolName} color={data.themeColor} className="w-full h-full" />
                )}
             </div>
          </div>

          {/* Header Bar */}
          <div
            className="w-full relative z-10 flex items-center justify-between px-5 py-4 shadow-sm"
            style={{ backgroundColor: data.themeColor }}
          >
            <div className="flex items-center gap-3 w-full">
               {/* Logo Circle */}
               <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md shrink-0 p-0.5 overflow-hidden">
                  {data.logoUrl ? (
                    <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
                  ) : (
                    <div className="w-full h-full p-1">
                        <DefaultUniversityLogo name={data.schoolName} color={data.themeColor} />
                    </div>
                  )}
               </div>
               {/* School Name - Removed truncate, added line-clamp to allow 2 lines */}
               <h2 className="font-bold text-white text-base leading-tight uppercase tracking-wide drop-shadow-md line-clamp-2 flex-1">
                 {data.schoolName || t.schoolName}
               </h2>
            </div>
          </div>

          {/* Main Layout Area */}
          <div className={`flex-1 relative z-10 p-6 flex ${isVertical ? 'flex-col' : 'flex-row'} gap-6`}>
            
            {/* Photo Section */}
            <div className={`relative shrink-0 ${isVertical ? 'mx-auto' : ''}`}>
               {/* Photo Frame */}
               <div className={`bg-gray-200 rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-900/10 ${isVertical ? 'w-40 h-48' : 'w-32 h-40'}`}>
                  {data.photoUrl ? (
                    <img src={data.photoUrl} alt="Student" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-xs uppercase font-semibold">{t.photo}</span>
                    </div>
                  )}
               </div>
               
               {/* Chip Position */}
               {data.showChip && (
                 <div className={`absolute ${isVertical ? '-left-6 top-1/2 -translate-y-1/2' : '-bottom-4 -right-4'} z-20 opacity-90 scale-90`}>
                   {isVertical && <SmartChip />}
                 </div>
               )}
            </div>

            {/* Info Section */}
            <div className={`flex-1 flex flex-col ${isVertical ? 'items-center text-center mt-2' : 'justify-center items-start text-left space-y-1'}`}>
               
               {(!isVertical && data.showChip) && <div className="mb-2"><SmartChip /></div>}

               <div className="w-full">
                 <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-widest rounded mb-1">
                    {t.cardholder}
                 </span>
                 <h1 className="text-2xl font-bold text-gray-900 leading-none tracking-tight mb-1" style={{ color: data.themeColor }}>
                   {data.studentName || 'Student Name'}
                 </h1>
                 <p className="font-medium text-gray-600 text-sm leading-snug">
                   {data.major || 'Major / Department'}
                 </p>
               </div>

               <div className={`w-full mt-4 pt-4 border-t border-gray-100 grid ${isVertical ? 'grid-cols-2 gap-4' : 'grid-cols-2 gap-x-8 gap-y-2'}`}>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{t.studentId}</span>
                    <span className="font-mono text-base font-semibold text-gray-800">{data.studentId || '00000'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{t.expiryDate}</span>
                    <span className="font-mono text-base font-semibold text-red-600">{formatDate(data.expiryDate)}</span>
                  </div>
                  <div className={`flex flex-col ${isVertical ? 'col-span-2 mt-2' : ''}`}>
                       <span className="text-[9px] font-bold text-gray-400 uppercase mb-1">{t.issueDate}</span>
                       <span className="text-xs font-medium text-gray-600">{formatDate(data.issueDate)}</span>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Footer Stripe */}
          <div className="h-3 w-full mt-auto opacity-80" style={{ backgroundColor: data.themeColor }}></div>
        </div>

        <button
          onClick={() => handleDownload(frontRef, 'front')}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download size={16} />
          {t.downloadFront}
        </button>
      </div>

      {/* Back Side */}
      <div className="flex flex-col items-center gap-6">
        <div ref={backRef} className={cardClasses}>
           {/* Plastic Texture Overlay */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

           {/* Magnetic Strip - Standard Position is near top */}
           <div className="mt-4 h-12 w-full bg-[#1a1a1a] relative">
              {/* Magstripe reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
           </div>

           <div className="flex-1 p-6 flex flex-col relative z-10">
              {/* Signature Panel */}
              <div className="flex items-center gap-2 mb-6">
                 <div className="flex-1 h-10 bg-white border border-gray-200 relative overflow-hidden flex items-center px-4" 
                      style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6), repeating-linear-gradient(45deg, #f3f4f6 25%, #f9fafb 25%, #f9fafb 75%, #f3f4f6 75%, #f3f4f6)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
                     <span className="signature-font text-2xl text-black z-10 relative" style={{ fontFamily: '"Dancing Script", cursive' }}>
                       {data.studentName}
                     </span>
                 </div>
                 <span className="text-[9px] text-gray-400 uppercase font-bold w-16 text-right leading-tight">{t.authorizedSignature}</span>
              </div>

              {/* Text Info */}
              <div className="space-y-4 text-xs text-gray-500 leading-relaxed">
                 <p>
                   <strong>{t.address}:</strong> {data.address || 'Campus Address'}
                 </p>
                 <p>
                   {t.propertyOf} {data.schoolName}. {t.instructions}
                   <br/>
                   <span className="italic mt-1 block opacity-75">{t.notTransferable}</span>
                 </p>
                 {data.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-yellow-800">
                      <strong>{t.notes}:</strong> {data.notes}
                    </div>
                 )}
              </div>

              {/* Bottom Elements */}
              <div className="mt-auto flex justify-between items-end pt-4 border-t border-gray-100">
                  {/* ISO Text Removed */}
                  <div></div> 
                  {data.emergencyNumber && (
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-gray-400 uppercase mb-1">{t.emergencyContact}</span>
                        <span className="font-bold text-gray-700">{data.emergencyNumber}</span>
                    </div>
                  )}
              </div>
           </div>
        </div>

        <button
          onClick={() => handleDownload(backRef, 'back')}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-full hover:bg-gray-900 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download size={16} />
          {t.downloadBack}
        </button>
      </div>
    </div>
  );
};

export default IdCardPreview;