
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
  
  const getHeadlineFontSize = () => {
    const len = headline.length;
    let basePx = 28;
    if (len < 25) basePx = 34;
    else if (len < 50) basePx = 28;
    else if (len < 80) basePx = 22;
    else basePx = 18;
    
    const scale = data.headlineScale || 1.0;
    return `${Math.round(basePx * scale)}px`;
  };

  const getBodyStyle = () => {
    const len = body.length;
    let basePx = 18;
    let lineHeight = '1.8';
    let maxImgHeight = '300px';

    if (len < 250) {
      basePx = 22;
      lineHeight = '2.0';
      maxImgHeight = '340px';
    } else if (len < 500) {
      basePx = 18;
      lineHeight = '1.8';
      maxImgHeight = '270px';
    } else if (len < 900) {
      basePx = 15;
      lineHeight = '1.7';
      maxImgHeight = '210px';
    } else {
      basePx = 13;
      lineHeight = '1.55';
      maxImgHeight = '170px';
    }

    const scale = data.bodyScale || 1.0;
    const finalPx = Math.max(10, Math.min(38, Math.round(basePx * scale)));

    return {
      fontSize: `${finalPx}px`,
      lineHeight,
      maxImgHeight
    };
  };

  const bodyStyle = getBodyStyle();
  const hasImage = !!data.image;
  const paperTitle = data.paperTitle || "मल्लविद्या विश्व वार्ता";
  const paperSubTitle = data.paperSubTitle || "महाराष्ट्र राज्य • क्रीडा व कुस्ती विशेष वार्ता";
  const titleFont = data.titleFont || 'rozha';
  
  const getTitleFontClass = () => {
    switch (titleFont) {
      case 'baloo': return 'font-masthead-baloo text-[40px]';
      case 'kadwa': return 'font-masthead-kadwa text-[38px]';
      case 'mukta': return 'font-masthead-mukta text-[38px]';
      case 'rozha':
      default: return 'font-masthead-rozha text-[42px]';
    }
  };

  const titleStyle = {
    color: data.titleColor || '#f59e0b',
    textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000',
  };

  const borderStyle = data.borderColorCustom ? { borderColor: data.borderColorCustom } : {};
  const headerStyle = data.headerBgCustom ? { backgroundColor: data.headerBgCustom } : {};
  const subTitleBadgeStyle = {
    color: data.subTitleColor || '#ffffff',
    backgroundColor: data.subTitleBgColor || undefined,
  };

  return (
    <div 
      ref={ref}
      id="newspaper-clipping"
      className={`relative mx-auto ${theme.bgColor} ${theme.textColor} p-8 border-[10px] ${theme.borderColor} flex flex-col overflow-hidden shadow-none`}
      style={{ 
        width: '600px', 
        height: '800px', 
        boxSizing: 'border-box',
        ...borderStyle
      }}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-50 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

      {/* Header Section */}
      <header className="flex-shrink-0 mb-4 z-10 relative">
        <div 
          className={`relative ${theme.headerBg} pt-5 pb-7 px-4 mb-2 flex flex-col items-center justify-center border-b-[6px] border-double border-black/30`}
          style={headerStyle}
        >
          <div className="flex flex-col items-center text-center w-full">
            {/* Calligraphy Header Title - Solid unbroken Devanagari string */}
            <h1 
              className={`calligraphy-title ${getTitleFontClass()} leading-none text-center w-full tracking-normal py-1`}
              style={titleStyle}
            >
              {paperTitle}
            </h1>
            <div 
              className={`py-1 px-6 ${theme.stripColor} rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-white/20 mt-3 shadow-sm`}
              style={subTitleBadgeStyle}
            >
              {paperSubTitle}
            </div>
          </div>
        </div>
        
        {/* Info Strip - Date & Day ONLY */}
        <div className="flex justify-center items-center py-2 px-4 border-y-2 border-black/80 text-[12px] font-extrabold uppercase bg-amber-50/50 text-slate-800 tracking-wider">
          <span className="text-red-700 font-black flex items-center gap-2">
            📅 {marathiDate}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col z-10 px-1 overflow-hidden relative">
        {/* Headline Container */}
        <div className="flex-shrink-0 text-center mb-5 px-2">
          <h2 
            className="headline-font border-y-2 border-black/80 w-full text-center uppercase py-2 px-1 font-extrabold"
            style={{ 
              fontSize: getHeadlineFontSize(),
              color: data.headlineColor || undefined
            }}
          >
            {headline || "येथे हेडलाईन लिहा"}
          </h2>
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow overflow-hidden">
          {hasImage && (
            <div 
              className={`relative border-2 ${theme.borderColor} p-1 shadow-md mx-auto flex-shrink-0 bg-white mb-4 w-[98%] overflow-hidden flex items-center justify-center`}
              style={{ maxHeight: bodyStyle.maxImgHeight, minHeight: '140px', ...borderStyle }}
            >
              <img 
                src={data.image!} 
                alt="News" 
                className="relative z-10 max-w-full object-contain" 
                style={{ maxHeight: bodyStyle.maxImgHeight }}
              />
              <div 
                className={`absolute bottom-0 left-0 right-0 z-20 ${theme.stripColor} py-1 text-[9px] font-black bg-opacity-90 text-center uppercase tracking-widest`}
                style={subTitleBadgeStyle}
              >
                 विशेष वार्तांकन छायाचित्र
              </div>
            </div>
          )}

          {/* Body Text */}
          <div 
            className="newspaper-font flex-grow overflow-hidden px-2"
            style={{ 
              fontSize: bodyStyle.fontSize,
              lineHeight: bodyStyle.lineHeight,
              textAlign: 'justify',
              color: data.bodyColor || undefined
            }}
          >
            {body ? (
              <div className="relative">
                <span className="drop-cap">{body.charAt(0)}</span>
                <span className="font-black text-red-600 border-r-2 border-red-600 pr-2 mr-2 uppercase text-[0.85em] italic">
                   विशेष प्रतिनिधी |
                </span>
                <span className="whitespace-normal">{body.substring(1)}</span>
              </div>
            ) : (
              <p className="text-gray-400 italic">येथे बातमी टाइप करा...</p>
            )}
          </div>
        </div>
      </main>

      {/* Reporter Footer */}
      <footer className={`flex-shrink-0 mt-4 pt-4 border-t-2 border-black flex justify-between items-center z-10 relative`}>
        <div className="flex items-center gap-4 bg-white/90 p-2.5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-14 h-14 rounded-full border-2 border-red-600 overflow-hidden bg-gray-50 flex-shrink-0 ring-2 ring-white shadow-sm">
            {data.reporterImage ? (
              <img src={data.reporterImage} alt="Reporter" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">फोटो</div>
            )}
          </div>
          <div className="text-left">
            <span className="text-[8px] font-black text-red-600 uppercase tracking-widest block mb-0.5">Press Identity Card</span>
            <span className="font-black text-[18px] leading-none text-slate-900 block">{data.reporterName || "नाव लिहा"}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">{data.designation || "प्रतिनिधी"}</span>
          </div>
        </div>
        
        <div className={`px-6 py-3 ${theme.stripColor} font-black text-[12px] uppercase rounded-xl border border-white/10 shadow-md`}>
          <span>{paperTitle}</span>
        </div>
      </footer>
    </div>
  );
});

NewspaperCanvas.displayName = 'NewspaperCanvas';

export default NewspaperCanvas;
