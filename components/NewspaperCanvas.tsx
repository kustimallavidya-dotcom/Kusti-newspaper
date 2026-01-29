
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
  const bodyLen = body.length;
  const hasImage = !!data.image;

  /**
   * ADVANCED LAYOUT CALCULATOR
   * Total height: 800px
   * Goal: Dynamically adjust Headline, Image, and Body Font to fit within 800px.
   */

  // 1. Headline Scaling
  const getHeadlineStyle = () => {
    if (headlineLen < 30) return 'text-[42px] leading-[1.1] mb-2';
    if (headlineLen < 60) return 'text-[32px] leading-[1.1] mb-2';
    if (headlineLen < 100) return 'text-[24px] leading-[1.1] mb-1.5';
    return 'text-[19px] leading-[1.1] mb-1';
  };

  // 2. Content Parameters
  let imgHeight = '0px';
  let bodyFontSize = 'text-[20px]';
  let bodyCols = 'columns-1';
  let lineHeight = 'leading-[1.6]';

  // Granular rules to prevent overlap and handle long text
  if (hasImage) {
    if (bodyLen > 2200) {
      imgHeight = '100px';
      bodyFontSize = 'text-[9px]';
      bodyCols = 'columns-3';
      lineHeight = 'leading-[1.2]';
    } else if (bodyLen > 1500) {
      imgHeight = '120px';
      bodyFontSize = 'text-[11px]';
      bodyCols = 'columns-2';
      lineHeight = 'leading-[1.3]';
    } else if (bodyLen > 900) {
      imgHeight = '160px';
      bodyFontSize = 'text-[13px]';
      bodyCols = 'columns-2';
      lineHeight = 'leading-[1.4]';
    } else if (bodyLen > 500) {
      imgHeight = '200px';
      bodyFontSize = 'text-[16px]';
      bodyCols = 'columns-1';
      lineHeight = 'leading-[1.5]';
    } else {
      imgHeight = '300px';
      bodyFontSize = 'text-[20px]';
      bodyCols = 'columns-1';
      lineHeight = 'leading-[1.6]';
    }
  } else {
    // No image - more space for text
    if (bodyLen > 2500) {
      bodyFontSize = 'text-[10px]';
      bodyCols = 'columns-3';
      lineHeight = 'leading-[1.2]';
    } else if (bodyLen > 1800) {
      bodyFontSize = 'text-[12px]';
      bodyCols = 'columns-2';
      lineHeight = 'leading-[1.3]';
    } else if (bodyLen > 1000) {
      bodyFontSize = 'text-[15px]';
      bodyCols = 'columns-2';
      lineHeight = 'leading-[1.4]';
    } else if (bodyLen > 500) {
      bodyFontSize = 'text-[19px]';
      bodyCols = 'columns-1';
      lineHeight = 'leading-[1.5]';
    } else {
      bodyFontSize = 'text-[24px]';
      bodyCols = 'columns-1';
      lineHeight = 'leading-[1.6]';
    }
  }

  return (
    <div 
      ref={ref}
      id="newspaper-clipping"
      className={`relative mx-auto ${theme.bgColor} ${theme.textColor} p-6 border-[12px] ${theme.borderColor} flex flex-col overflow-hidden shadow-none`}
      style={{ width: '600px', height: '800px', boxSizing: 'border-box' }}
    >
      {/* Header Section (~140px) */}
      <header className="flex-shrink-0 mb-3 text-center z-10">
        <div className={`${theme.headerBg} py-3 px-4 mb-2 flex items-center justify-between gap-4 border-b-4 border-double border-black/10 rounded-xl shadow-md`}>
          <div className="flex-shrink-0">
             <div className="w-16 h-16 bg-white rounded-full p-0.5 border-2 border-yellow-500 shadow-sm flex items-center justify-center overflow-hidden">
                {data.logo ? (
                  <img src={data.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[10px] font-black text-gray-300">कुस्ती</div>
                )}
             </div>
          </div>
          
          <div className="flex flex-col items-center flex-grow">
            <h1 className="attractive-title text-[40px] font-black leading-none mb-1">
              कुस्ती मल्लविद्या वार्ता
            </h1>
            <div className={`py-0.5 px-3 ${theme.stripColor} rounded-full text-[8px] font-black tracking-widest uppercase shadow-sm`}>
              महाराष्ट्राचा अस्सल देशी आवाज!
            </div>
          </div>
        </div>
        
        <div className={`flex justify-between items-center py-1.5 px-4 border-y-2 ${theme.borderColor} text-[9px] font-black uppercase bg-gray-50/70 rounded-sm`}>
          <span>RNI: MAH/2०२५</span>
          <span>{marathiDate}</span>
          <span>संपादक: गणेश मानुगडे</span>
        </div>
      </header>

      {/* Main Content Area (Flexible) */}
      <main className="flex-grow flex flex-col overflow-hidden z-10">
        <div className="flex-shrink-0 text-center px-1 mb-2">
          <h2 className={`headline-font ${getHeadlineStyle()} font-black border-b-2 ${theme.borderColor} pb-2 uppercase tracking-tight`}>
            {headline || "येथे हेडलाईन लिहा"}
          </h2>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden px-1">
          {hasImage && (
            <div 
              className={`relative border-2 ${theme.borderColor} p-0.5 shadow-md mx-auto flex-shrink-0 bg-white transform rotate-1 mb-4 w-[90%] overflow-hidden transition-all duration-300`}
              style={{ height: imgHeight }}
            >
              <img 
                src={data.image!} 
                alt="News" 
                className="w-full h-full object-cover"
              />
              <div className={`absolute bottom-0 left-0 right-0 ${theme.stripColor} py-1 text-[7px] font-black opacity-90 text-center uppercase tracking-tighter`}>
                 विशेष बातमी छायाचित्र
              </div>
            </div>
          )}

          {/* This wrapper ensures the text takes all remaining space without pushing other elements */}
          <div 
            className={`newspaper-font ${bodyFontSize} ${bodyCols} gap-5 ${lineHeight} text-justify flex-grow overflow-hidden px-2 transition-all duration-300`}
            style={{ 
              hyphens: 'auto',
              wordBreak: 'break-word',
              columnFill: 'auto'
            }}
          >
            {body || "येथे मजकूर लिहा. मजकूर जेवढा जास्त असेल तेवढी मांडणी (कॉलम आणि फॉन्ट) आपोआप बदलली जाईल."}
          </div>
        </div>
      </main>

      {/* Footer Section (~120px) */}
      <footer className={`flex-shrink-0 mt-3 pt-3 border-t-2 border-double ${theme.borderColor} flex justify-between items-end z-10`}>
        <div className="flex items-center gap-3 bg-white/50 p-2 rounded-2xl border border-gray-200/50 backdrop-blur-md shadow-sm">
          <div className="w-14 h-14 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white ring-2 ring-orange-50">
            {data.reporterImage ? (
              <img src={data.reporterImage} alt="Reporter" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[6px] text-gray-300 font-bold uppercase">PHOTO</div>
            )}
          </div>
          <div className="text-left flex flex-col justify-center">
            <span className="text-[6px] uppercase bg-black text-white px-1.5 py-0.5 rounded-sm w-fit mb-1 font-black tracking-widest">बातमीदार</span>
            <span className="font-black text-xl leading-none tracking-tight">{data.reporterName || "नाव लिहा"}</span>
            <span className="text-[10px] font-bold opacity-60 uppercase mt-1">{data.designation || "प्रतिनिधी"}</span>
          </div>
        </div>
        
        <div className={`px-4 py-3 ${theme.stripColor} font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl border-t-2 border-white/20 transform rotate-1 flex flex-col items-center leading-none`}>
          <span>कुस्ती मल्लविद्या</span>
          <span className="text-[7px] mt-1 opacity-70">वार्ता</span>
        </div>
      </footer>
      
      {/* Background Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.012] z-0 overflow-hidden select-none flex flex-wrap gap-16 items-center justify-center -rotate-12">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="text-[38px] font-black uppercase tracking-[0.4em]">KUSTI VARTA</span>
        ))}
      </div>
    </div>
  );
});

NewspaperCanvas.displayName = 'NewspaperCanvas';

export default NewspaperCanvas;
