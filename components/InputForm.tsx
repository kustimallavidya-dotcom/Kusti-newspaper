
import React, { useState } from 'react';
import { Newspaper, Image as ImageIcon, User, Camera, Trash2, Scissors, Settings, Type, Sliders, Sparkles, Feather, Palette, RotateCcw } from 'lucide-react';
import { ThemeType, NewsData } from '../types';
import CropModal from './CropModal';

interface Props {
  data: NewsData;
  onChange: (updates: Partial<NewsData>) => void;
  isDownloading: boolean;
  onDownload?: () => void;
}

const InputForm: React.FC<Props> = ({ data, onChange, isDownloading, onDownload }) => {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'reporterImage') => {
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

  const autoFitTextScaling = () => {
    const headlineLen = (data.headline || '').length;
    const bodyLen = (data.body || '').length;

    let hScale = 1.0;
    if (headlineLen > 70) hScale = 0.85;
    else if (headlineLen > 40) hScale = 0.95;
    else if (headlineLen < 20) hScale = 1.15;

    let bScale = 1.0;
    if (bodyLen > 800) bScale = 0.8;
    else if (bodyLen > 500) bScale = 0.9;
    else if (bodyLen < 200) bScale = 1.2;

    onChange({ headlineScale: hScale, bodyScale: bScale });
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-2xl space-y-8 border border-gray-100 no-print overflow-y-auto max-h-[85vh] scrollbar-hide">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-100">
          <Newspaper className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-800 leading-none tracking-tight">एडिटर पॅनेल</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">मल्लविद्या विश्व वार्ता इंजिन</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Paper Title Input with Calligraphy Indicator */}
        <div className="space-y-3 bg-gradient-to-r from-orange-50 to-amber-50/60 p-4 rounded-2xl border border-orange-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-orange-900 flex items-center gap-2">
              <Feather size={15} className="text-orange-600" /> पेपरचे नाव (कॅलिग्राफी सुलेखन)
            </label>
            <span className="text-[9px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              Calligraphy
            </span>
          </div>
          <input
            type="text"
            value={data.paperTitle || 'मल्लविद्या विश्व वार्ता'}
            onChange={(e) => onChange({ paperTitle: e.target.value })}
            className="w-full p-3 bg-white border border-orange-200 rounded-xl text-sm font-black text-orange-950 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all shadow-sm"
            placeholder="पेपरचे नाव लिहा..."
          />

          {/* Subtitle / Header Tagline Input */}
          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-bold text-orange-900 flex items-center gap-1.5">
              उपशीर्षक / टॅगलाईन (Sub-Title)
            </label>
            <input
              type="text"
              value={data.paperSubTitle || 'महाराष्ट्र राज्य • क्रीडा व कुस्ती विशेष वार्ता'}
              onChange={(e) => onChange({ paperSubTitle: e.target.value })}
              className="w-full p-2.5 bg-white border border-orange-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all shadow-sm"
              placeholder="उपशीर्षक लिहा..."
            />
          </div>

          {/* Calligraphy Font Style Selectors */}
          <div className="pt-2 border-t border-orange-100">
            <p className="text-[10px] font-extrabold text-orange-800 uppercase tracking-wider mb-2">फॉन्ट स्टाईल निवडा:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'rozha', name: 'क्लासिक वृत्तपत्र', sample: 'Rozha One' },
                { id: 'baloo', name: 'शाही सुलेखन', sample: 'Baloo 2' },
                { id: 'kadwa', name: 'पारंपरिक बोध', sample: 'Kadwa' },
                { id: 'mukta', name: 'मॉडर्न बोल्ड', sample: 'Mukta' },
              ].map((fontOption) => {
                const isSelected = (data.titleFont || 'rozha') === fontOption.id;
                return (
                  <button
                    key={fontOption.id}
                    type="button"
                    onClick={() => onChange({ titleFont: fontOption.id as any })}
                    className={`p-2 rounded-xl text-left border text-[11px] font-black transition-all ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-700 shadow-md ring-2 ring-orange-200'
                        : 'bg-white text-slate-700 border-orange-200 hover:bg-orange-100/50'
                    }`}
                  >
                    <div className="truncate">{fontOption.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full Color Customization Section */}
        <div className="space-y-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Palette size={16} className="text-orange-600" /> रंग सानुकूलन (Interface Colors)
            </label>
            <button
              onClick={() => onChange({
                titleColor: undefined,
                subTitleColor: undefined,
                subTitleBgColor: undefined,
                headlineColor: undefined,
                bodyColor: undefined,
                headerBgCustom: undefined,
                borderColorCustom: undefined
              })}
              className="text-[10px] font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200"
              title="डिफॉल्ट रंग रिसेट करा"
            >
              <RotateCcw size={11} /> रिसेट
            </button>
          </div>

          {/* Quick Preset Color Schemes */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">पॉप्युलर कलर कॉम्बिनेशन:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({
                  titleColor: '#f59e0b',
                  subTitleColor: '#ffffff',
                  subTitleBgColor: '#c2410c',
                  headlineColor: '#1e293b',
                  bodyColor: '#0f172a',
                  headerBgCustom: '#000000',
                  borderColorCustom: '#c2410c'
                })}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-orange-400 text-left flex items-center gap-2 shadow-2xs"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-700 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700 truncate">केशरी सुवर्ण (Classic)</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({
                  titleColor: '#dc2626',
                  subTitleColor: '#ffffff',
                  subTitleBgColor: '#991b1b',
                  headlineColor: '#7f1d1d',
                  bodyColor: '#111827',
                  headerBgCustom: '#fef2f2',
                  borderColorCustom: '#991b1b'
                })}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-red-400 text-left flex items-center gap-2 shadow-2xs"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-red-900 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700 truncate">राजेशाही लाल (Royal Red)</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({
                  titleColor: '#0284c7',
                  subTitleColor: '#ffffff',
                  subTitleBgColor: '#0369a1',
                  headlineColor: '#0c4a6e',
                  bodyColor: '#0f172a',
                  headerBgCustom: '#f0f9ff',
                  borderColorCustom: '#0369a1'
                })}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-left flex items-center gap-2 shadow-2xs"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-800 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700 truncate">नेव्ही ब्ल्यू (Navy Blue)</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({
                  titleColor: '#059669',
                  subTitleColor: '#ffffff',
                  subTitleBgColor: '#047857',
                  headlineColor: '#064e3b',
                  bodyColor: '#111827',
                  headerBgCustom: '#ecfdf5',
                  borderColorCustom: '#047857'
                })}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-left flex items-center gap-2 shadow-2xs"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-800 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700 truncate">क्रीडा हिरवा (Emerald)</span>
              </button>
            </div>
          </div>

          {/* Individual Color Pickers Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            {/* Title Color */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-600 block">टायटल रंग</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.titleColor || '#f59e0b'}
                  onChange={(e) => onChange({ titleColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.titleColor || '#f59e0b'}</span>
              </div>
            </div>

            {/* Subtitle / Tag Text Color */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-600 block">सब-टायटल रंग</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.subTitleColor || '#ffffff'}
                  onChange={(e) => onChange({ subTitleColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.subTitleColor || '#ffffff'}</span>
              </div>
            </div>

            {/* Subtitle Badge BG Color */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-600 block">टॅग बॅकग्राउंड रंग</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.subTitleBgColor || '#ea580c'}
                  onChange={(e) => onChange({ subTitleBgColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.subTitleBgColor || '#ea580c'}</span>
              </div>
            </div>

            {/* Headline Color */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-600 block">मथळा रंग (Headline)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.headlineColor || '#000000'}
                  onChange={(e) => onChange({ headlineColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.headlineColor || '#000000'}</span>
              </div>
            </div>

            {/* Body Text Color */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-600 block">बातमी अक्षर रंग (Body)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.bodyColor || '#000000'}
                  onChange={(e) => onChange({ bodyColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.bodyColor || '#000000'}</span>
              </div>
            </div>

            {/* Header Banner Color */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-600 block">हेडर बॅकग्राउंड रंग</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.headerBgCustom || '#000000'}
                  onChange={(e) => onChange({ headerBgCustom: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.headerBgCustom || '#000000'}</span>
              </div>
            </div>

            {/* Border Color */}
            <div className="space-y-1 col-span-2">
              <span className="text-[10px] font-bold text-slate-600 block">वर्तमानपत्र फ्रेम / बॉर्डर रंग</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.borderColorCustom || '#000000'}
                  onChange={(e) => onChange({ borderColorCustom: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                />
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.borderColorCustom || '#000000'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Settings size={14} className="text-orange-500" /> पेपर कलर थीम
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {Object.values(ThemeType).map((theme) => (
              <button
                key={theme}
                onClick={() => onChange({ theme })}
                className={`py-3 px-1 text-[10px] font-black rounded-2xl border-2 transition-all uppercase ${
                  data.theme === theme 
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm scale-[1.02]' 
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
            <label className="text-xs font-bold text-gray-600 px-1 flex items-center gap-2">
              <Type size={14} className="text-orange-500" /> बातमीचा मथळा (Headline)
            </label>
            <input
              type="text"
              value={data.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:bg-white outline-none transition-all shadow-sm"
              placeholder="येथे हेडलाईन टाइप करा..."
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-2">
                <ImageIcon size={14} className="text-orange-500" /> मुख्य फोटो (News Photo)
              </label>
              {data.image && (
                <button onClick={() => removeImage('image')} className="text-red-500 p-1 hover:bg-red-50 rounded-lg">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-[1.5rem] cursor-pointer hover:bg-orange-50/30 overflow-hidden relative transition-all group shadow-sm bg-gray-50/20">
              {data.image ? (
                <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <div className="p-3 bg-white rounded-2xl mb-2 group-hover:bg-orange-100 transition-colors shadow-sm">
                    <ImageIcon size={28} className="group-hover:text-orange-600" />
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
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-4 focus:ring-orange-500/10 focus:bg-white outline-none min-h-[160px] transition-all leading-relaxed shadow-sm font-medium"
              placeholder="संपूर्ण बातमी येथे लिहा..."
            />
          </div>
        </div>

        {/* Text Scaling Controls */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
              <Sliders size={14} className="text-orange-600" /> Text फॉन्ट स्केलिंग (अक्षर आकार)
            </label>
            <button
              onClick={autoFitTextScaling}
              className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-[10px] font-black hover:bg-orange-200 transition-colors shadow-xs"
              title="मजकूराच्या लांबीनुसार आपोआप स्केलिंग करा"
            >
              <Sparkles size={12} /> Auto Fit
            </button>
          </div>

          {/* Headline Scale */}
          <div className="space-y-1 bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
            <div className="flex justify-between text-[11px] font-bold text-gray-600">
              <span>मथळा आकार (Headline Size)</span>
              <span className="text-orange-600 font-black">{Math.round((data.headlineScale || 1.0) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={data.headlineScale || 1.0}
              onChange={(e) => onChange({ headlineScale: parseFloat(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>

          {/* Body Scale */}
          <div className="space-y-1 bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
            <div className="flex justify-between text-[11px] font-bold text-gray-600">
              <span>बातमी अक्षर आकार (Body Size)</span>
              <span className="text-orange-600 font-black">{Math.round((data.bodyScale || 1.0) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={data.bodyScale || 1.0}
              onChange={(e) => onChange({ bodyScale: parseFloat(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Reporter Section */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <User size={14} className="text-orange-600" /> बातमीदार माहिती
          </label>
          
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-[2rem] border border-gray-200 flex gap-4 items-center shadow-sm">
            <div className="relative">
               <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-orange-300 rounded-full cursor-pointer hover:border-orange-500 overflow-hidden relative bg-white shadow-inner transition-all ring-2 ring-white">
                {data.reporterImage ? (
                  <img src={data.reporterImage} alt="Reporter" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-orange-400 text-center p-1">
                    <Camera size={18} />
                    <span className="text-[7px] font-black mt-0.5 uppercase">UPLOAD</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'reporterImage')} />
              </label>
              {data.reporterImage && (
                <button 
                  onClick={() => setShowCropper(true)}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-white text-orange-600 rounded-full shadow-lg border border-orange-100 hover:scale-110 transition-transform z-10"
                >
                  <Scissors size={10} />
                </button>
              )}
            </div>
            
            <div className="flex-grow space-y-2">
              <input
                type="text"
                value={data.reporterName}
                onChange={(e) => onChange({ reporterName: e.target.value })}
                className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none font-bold shadow-sm"
                placeholder="नाव (उदा. गणेश मानुगडे)"
              />
              <input
                type="text"
                value={data.designation}
                onChange={(e) => onChange({ designation: e.target.value })}
                className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm font-semibold"
                placeholder="पद / जिल्हा (उदा. कोल्हापूर)"
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

