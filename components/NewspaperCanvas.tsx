
import React, { forwardRef } from 'react';
import { NewsData } from '../types';
import { THEMES } from '../constants';
import { getMarathiDate } from '../utils/marathiDate';

interface Props {
  data: NewsData;
}

const NewspaperCanvas = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const theme = THEMES[data.theme] || THEMES['Classic'];
  const marathiDate = getMarathiDate();

  const headline = data.headline || "";
  const body = data.body || "";
  const headlineLen = headline.length;
  const hasImage = !!data.image;

  const getHeadlineStyle = () => {
    if (headlineLen < 30) return 'text-[44px] leading-[1.1] mb-2';
    if (headlineLen < 60) return 'text-[34px] leading-[1.1] mb-2';
    return 'text-[26px] leading-[1.1] mb-1.5';
  };

  return (
    <div 
      ref={ref}
      id="newspaper-clipping"
      className={`relative mx-auto ${theme.bgColor} ${theme.textColor} p-6 border-[12px] ${theme.borderColor} flex flex-col overflow-hidden shadow-none`}
      style={{ width: '600px', height: '800px', boxSizing: 'border-box' }}
    >
      {/* Header Section - Now Clean & Centered */}
      <header className="flex-shrink-0 mb-4 z-10">
        <div className={`relative ${theme.headerBg} pt-10 pb-12 px-6 mb-2 flex flex-col items-center justify-center border-b-4 border-black/10`}>
          
          <div className="flex flex-col items-center text-center w-full">
            <h1 className="attractive-title text-[62px] font-black leading-none mb-4 text-center w-full drop-shadow-xl">
              कुस्ती मल्लविद्या वार्ता
            </h1>
            <div className={`py-2 px-10 ${theme.stripColor} rounded-full text-[13px] font-black tracking-[0.3em] uppercase shadow-lg border border-white/20 inline-block`}>
              महाराष्ट्र राज्य • क्रीडा विभाग
            </div>
          </div>
        </div>
        
        {/* Info Strip */}
        <div className={`flex justify-between items-center py-2.5 px-6 border-y-2 ${theme.borderColor} text-[11px] font-black uppercase bg-gray-50/90 rounded-sm italic`}>
          <span>RNI: MAH/MAR/2०२५</span>
          <span>{marathiDate}</span>
          <span>संपादक: गणेश मानुगडे</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden z-10 pt-2 px-1">
        <div className="flex-shrink-0 text-center px-2 mb-6">
          <h2 className={`headline-font ${getHeadlineStyle()} font-black border-b-[6px] border-double ${theme.borderColor} pb-4 uppercase tracking-tight`}>
            {headline || "येथे हेडलाईन लिहा"}
          </h2>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden">
          {hasImage && (
            <div 
              className={`relative border-2 ${theme.borderColor} p-1 shadow-2xl mx-auto flex-shrink-0 bg-white transform rotate-1 mb-6 w-[96%] overflow-hidden`}
              style={{ height: '260px' }}
            >
              <img src={data.image!} alt="News Content" className="w-full h-full object-cover" />
              <div className={`absolute bottom-0 left-0 right-0 ${theme.stripColor} py-2 text-[9px] font-black opacity-95 text-center uppercase tracking-widest`}>
                 विशेष वार्ता छायाचित्र
              </div>
            </div>
          )}

          <div 
            className={`newspaper-font text-[21px] leading-[1.6] text-justify flex-grow overflow-hidden px-4`}
            style={{ hyphens: 'auto', wordBreak: 'break-word' }}
          >
            {body || "येथे मजकूर लिहा. मजकूर जेवढा जास्त असेल तेवढी मांडणी आपोआप बदलली जाईल. कुस्ती मल्लविद्या ही महाराष्ट्रातील कुस्ती क्षेत्रातील सर्वात मोठी आणि जुनी संस्था आहे. आम्ही कुस्तीच्या विकासासाठी कटिबद्ध आहोत. लाल मातीतील ही परंपरा जपण्यासाठी आम्ही नेहमीच अग्रेसर राहू."}
          </div>
        </div>
      </main>

      {/* Reporter Footer */}
      <footer className={`flex-shrink-0 mt-4 pt-5 border-t-2 border-dashed ${theme.borderColor} flex justify-between items-center z-10`}>
        <div className="flex items-center gap-4 bg-white/40 p-3 rounded-full border border-gray-100 shadow-sm pr-6">
          <div className="w-16 h-16 rounded-full border-2 border-red-600 shadow-lg overflow-hidden bg-white ring-4 ring-white flex-shrink-0">
            {data.reporterImage ? (
              <img src={data.reporterImage} alt="Reporter" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[8px] text-gray-300 font-bold uppercase">Photo</div>
            )}
          </div>
          <div className="text-left flex flex-col justify-center min-w-[100px]">
            <span className="text-[7px] font-black text-red-600 uppercase tracking-widest mb-1 italic">Exclusive Reporter</span>
            <span className="font-black text-2xl leading-none text-slate-900">{data.reporterName || "नाव लिहा"}</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase mt-1 tracking-wider">{data.designation || "प्रतिनिधी"}</span>
          </div>
        </div>
        
        <div className={`px-6 py-4 ${theme.stripColor} font-black text-[14px] uppercase tracking-widest rounded-3xl shadow-xl border-t-2 border-white/20 transform rotate-1 flex flex-col items-center min-w-[160px]`}>
          <span>कुस्ती मल्लविद्या</span>
          <span className="text-[9px] mt-1 opacity-80 font-bold">मराठी वृत्त विभाग</span>
        </div>
      </footer>
    </div>
  );
});

NewspaperCanvas.displayName = 'NewspaperCanvas';

export default NewspaperCanvas;
