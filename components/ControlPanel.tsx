import React, { useState } from 'react';
import { Upload, Wand2, X, Palette, Layout, Cpu } from 'lucide-react';
import { StudentData, Translation } from '../types';
import { generateStudentProfile, generateStudentPortrait } from '../services/geminiService';

interface ControlPanelProps {
  data: StudentData;
  setData: React.Dispatch<React.SetStateAction<StudentData>>;
  t: Translation;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ data, setData, t }) => {
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'logoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoFill = async () => {
    setIsGeneratingProfile(true);
    try {
      const profile = await generateStudentProfile();
      setData((prev) => ({
        ...prev,
        ...profile,
        // Keep existing image if any, or maybe don't override it unless empty
      }));
    } catch (e) {
      // Error handled in service
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const handleGeneratePhoto = async () => {
    setIsGeneratingPhoto(true);
    try {
      // Pass studentName to help AI/Fallback determine gender
      const photoUrl = await generateStudentPortrait({
        major: data.major,
        schoolName: data.schoolName,
        studentName: data.studentName
      });
      setData((prev) => ({ ...prev, photoUrl }));
    } catch (e) {
      // Error handled in service
    } finally {
      setIsGeneratingPhoto(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
      
      {/* Layout Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setData(d => ({ ...d, layout: 'vertical' }))}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
            data.layout === 'vertical' 
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-600' 
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          <Layout className="rotate-90" size={18} />
          {t.vertical}
        </button>
        <button
          onClick={() => setData(d => ({ ...d, layout: 'horizontal' }))}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
            data.layout === 'horizontal' 
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-600' 
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          <Layout size={18} />
          {t.horizontal}
        </button>
      </div>

      {/* Auto Fill Button */}
      <button
        onClick={handleAutoFill}
        disabled={isGeneratingProfile}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-70 transition-all font-medium shadow-md"
      >
        <Wand2 size={18} className={isGeneratingProfile ? 'animate-spin' : ''} />
        {isGeneratingProfile ? t.generating : t.autoFill}
      </button>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.schoolName}</label>
          <input
            type="text"
            name="schoolName"
            value={data.schoolName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.studentName}</label>
            <input
              type="text"
              name="studentName"
              value={data.studentName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.studentId}</label>
            <input
              type="text"
              name="studentId"
              value={data.studentId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.major}</label>
          <input
            type="text"
            name="major"
            value={data.major}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.issueDate}</label>
            <input
              type="date"
              name="issueDate"
              value={data.issueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.expiryDate}</label>
            <input
              type="date"
              name="expiryDate"
              value={data.expiryDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Chip Toggle & Color */}
      <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
             <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={data.showChip}
                  onChange={(e) => setData(d => ({...d, showChip: e.target.checked}))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
             </div>
             <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Cpu size={16} className="text-gray-500"/>
                {t.showChip}
             </div>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{t.themeColor}</span>
            <input
              type="color"
              name="themeColor"
              value={data.themeColor}
              onChange={handleInputChange}
              className="h-8 w-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer shadow-sm"
              title={t.themeColor}
            />
          </div>
      </div>

      <hr className="border-gray-100" />

      {/* Photo Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.photo}</label>
        <div className="flex gap-2 items-center">
            <div className="relative flex-1">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'photoUrl')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                    <Upload size={16} />
                    <span className="truncate">{data.photoUrl ? 'Custom Photo' : t.selectFile}</span>
                </div>
            </div>
            
            <button
                onClick={handleGeneratePhoto}
                disabled={isGeneratingPhoto}
                className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                title={t.generate}
            >
                {isGeneratingPhoto ? <Wand2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            </button>

             {data.photoUrl && (
                <button
                onClick={() => setData(d => ({ ...d, photoUrl: null }))}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title={t.clear}
                >
                <X size={16} />
                </button>
            )}
        </div>
      </div>

       {/* Logo Upload Section */}
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.logo}</label>
        <div className="flex gap-2 items-center">
            <div className="relative flex-1">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'logoUrl')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                    <Upload size={16} />
                    <span className="truncate">{data.logoUrl ? 'Custom Logo' : t.selectFile}</span>
                </div>
            </div>
             {data.logoUrl && (
                <button
                onClick={() => setData(d => ({ ...d, logoUrl: null }))}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title={t.clear}
                >
                <X size={16} />
                </button>
            )}
        </div>
      </div>

      {/* Back Side Info */}
      <hr className="border-gray-100" />
      
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">{t.address}</label>
         <textarea
            name="address"
            value={data.address}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
         />
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.emergencyNumberLabel}</label>
             <input
              type="text"
              name="emergencyNumber"
              value={data.emergencyNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
         </div>
         <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">{t.notes}</label>
             <input
                type="text"
                name="notes"
                value={data.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
             />
         </div>
      </div>

    </div>
  );
};

export default ControlPanel;