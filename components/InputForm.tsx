
import React, { useState } from 'react';
import { Newspaper, Image as ImageIcon, User, Camera, Trash2, Scissors, Type } from 'lucide-react';
import { ThemeType, NewsData } from '../types';
import CropModal from './CropModal';

interface Props {
  data: NewsData;
  onChange: (updates: Partial<NewsData>) => void;
  isDownloading: boolean;
}

const InputForm: React.FC<Props> = ({ data, onChange, isDownloading }) => {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'logo' | 'reporterImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'reporterImage') {
          setTempImage(result);
          setShowCropper(true);
        } else {
          onChange({ [field]: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field: 'image' | 'reporterImage') => {
    onChange({ [field]: null });
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-2xl space-y-8 border border-gray-100 no-print overflow-y-auto max-h-[85vh] scrollbar-hide">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-100">
          <Newspaper className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-800 leading-none">एडिटर पॅनेल</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Professional Clipping v3.5</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Style Selection */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Type size={14} /> थीम निवडा
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(ThemeType).map((theme) => (
              <button
                key={theme}
                onClick={() => onChange({ theme })}
                className={`py-3 px-1 text-[10px] font-black rounded-2xl border-2 transition-all uppercase ${
                  data.theme === theme 
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' 
                    : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-200'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Content Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 px-1">बातमीचा मथळा (Headline)</label>
            <input
              type="text"
              value={data.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:bg-white outline-none transition-all"
              placeholder="येथे हेडलाईन टाइप करा..."
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-600">मुख्य फोटो (News Photo)</label>
              {data.image && (
                <button onClick={() => removeImage('image')} className="text-red-500 p-1 hover:bg-red-50 rounded-lg">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-[1.5rem] cursor-pointer hover:bg-orange-50/30 overflow-hidden relative transition-all group">
              {data.image ? (
                <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <div className="p-3 bg-gray-100 rounded-2xl mb-2 group-hover:bg-orange-100 transition-colors">
                    <ImageIcon size={24} className="group-hover:text-orange-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">फोटो अपलोड करा</span>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 px-1">बातमी तपशील (Body Text)</label>
            <textarea
              value={data.body}
              onChange={(e) => onChange({ body: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-4 focus:ring-orange-500/10 focus:bg-white outline-none min-h-[160px] transition-all leading-relaxed"
              placeholder="संपूर्ण बातमी येथे लिहा. मजकूर जेवढा जास्त असेल, फॉन्ट आपोआप लहान होईल..."
            />
          </div>
        </div>

        {/* Reporter Section */}
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <User size={14} className="text-orange-600" /> बातमीदार माहिती
          </label>
          
          <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-200 flex gap-4 items-center">
            <div className="relative">
               <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-orange-300 rounded-full cursor-pointer hover:border-orange-500 overflow-hidden relative bg-white shadow-inner transition-all ring-4 ring-white">
                {data.reporterImage ? (
                  <img src={data.reporterImage} alt="Reporter" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-orange-400 text-center p-1">
                    <Camera size={20} />
                    <span className="text-[7px] font-black mt-1 uppercase">UPLOAD</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'reporterImage')} />
              </label>
              {data.reporterImage && (
                <button 
                  onClick={() => setShowCropper(true)}
                  className="absolute -bottom-1 -right-1 p-2 bg-white text-orange-600 rounded-full shadow-lg border border-orange-100 hover:scale-110 transition-transform"
                >
                  <Scissors size={12} />
                </button>
              )}
            </div>
            
            <div className="flex-grow space-y-3">
              <input
                type="text"
                value={data.reporterName}
                onChange={(e) => onChange({ reporterName: e.target.value })}
                className="w-full p-3 text-xs bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none font-bold shadow-sm"
                placeholder="नाव"
              />
              <input
                type="text"
                value={data.designation}
                onChange={(e) => onChange({ designation: e.target.value })}
                className="w-full p-3 text-xs bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm"
                placeholder="पद / जिल्हा"
              />
            </div>
          </div>
        </div>
      </div>

      {showCropper && tempImage && (
        <CropModal 
          image={tempImage} 
          onCrop={(cropped) => {
            onChange({ reporterImage: cropped });
            setShowCropper(false);
          }}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default InputForm;
