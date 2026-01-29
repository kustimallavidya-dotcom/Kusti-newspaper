
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Newspaper, Download, Printer, Loader2, CheckCircle2, Info, RefreshCcw, Eye } from 'lucide-react';
import NewspaperCanvas from './components/NewspaperCanvas';
import InputForm from './components/InputForm';
import { ThemeType, NewsData } from './types';
import { DEFAULT_LOGO } from './constants';

const App: React.FC = () => {
  const [data, setData] = useState<NewsData>({
    headline: '',
    body: '',
    reporterName: '',
    designation: '',
    image: null,
    logo: DEFAULT_LOGO,
    reporterImage: null,
    theme: ThemeType.CLASSIC,
  });
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.8); // Default fallback scale
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const updateData = (updates: Partial<NewsData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Improved Scaling Logic to ensure Preview is always visible
  useEffect(() => {
    const updateScale = () => {
      if (!previewContainerRef.current) return;
      
      const containerWidth = previewContainerRef.current.offsetWidth;
      const windowWidth = window.innerWidth;

      // Ensure we have a valid width to calculate from
      const baseWidth = containerWidth > 0 ? containerWidth : windowWidth;
      
      // Calculate responsive padding
      const padding = windowWidth < 768 ? 32 : 80;
      const availableWidth = baseWidth - padding;
      
      // Calculate scale to fit 600px width into available space
      const newScale = Math.max(0.2, Math.min(availableWidth / 600, 1));
      setPreviewScale(newScale);
    };

    // Initial calculation with a slight delay to ensure browser layout is stable
    const timer = setTimeout(updateScale, 200);
    
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
    };
  }, []);

  const handleDownload = async () => {
    if (!canvasRef.current || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const canvas = await html2canvas(canvasRef.current, {
        scale: 4, // 4x scale is sufficient for high quality while keeping file size reasonable
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `KustiVarta-HD-${Date.now()}.png`;
      link.click();
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error("Capture Error:", error);
      alert("फोटो तयार करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 pb-12 selection:bg-orange-200 overflow-x-hidden font-sans">
      {/* Top Navbar */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-200 no-print py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-600 p-2.5 rounded-2xl shadow-xl shadow-orange-100 ring-2 ring-orange-50">
              <Newspaper className="text-white" size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-2xl tracking-tighter leading-none text-slate-900">कुस्ती मल्लविद्या</h1>
              <p className="text-[10px] font-bold tracking-[0.4em] text-orange-600 uppercase mt-0.5">Digital Varta Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {isDownloading ? (
              <div className="bg-orange-50 px-5 py-3 rounded-2xl flex items-center gap-3 border border-orange-100 animate-pulse">
                <Loader2 size={18} className="animate-spin text-orange-600" />
                <span className="text-[11px] font-black text-orange-800 uppercase tracking-widest">प्रक्रिया सुरू आहे...</span>
              </div>
            ) : downloadSuccess ? (
              <div className="bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-green-100 animate-in zoom-in duration-300">
                <CheckCircle2 size={18} />
                <span className="text-xs font-black uppercase">पूर्ण झाले</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 p-3 rounded-2xl border border-slate-200 transition-all text-slate-600 shadow-sm active:scale-95"
                  title="प्रिंट"
                >
                  <Printer size={20} />
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-3 bg-orange-600 text-white px-6 md:px-8 py-3 rounded-2xl text-[12px] font-black tracking-widest uppercase shadow-xl shadow-orange-200 hover:bg-orange-700 hover:-translate-y-0.5 active:translate-y-0 transition-all border-b-4 border-orange-800"
                >
                  <Download size={18} /> HD डाऊनलोड
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Form Side */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit no-print">
            <InputForm 
              data={data} 
              onChange={updateData} 
              isDownloading={isDownloading}
            />
            
            <div className="mt-8 p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2.5 rounded-xl">
                  <Info size={22} className="text-blue-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-black text-slate-800 uppercase tracking-wider">सूचना</p>
                   <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">बातमीच्या लांबीनुसार मांडणी आणि फॉन्ट आपोआप बदलला जातो जेणेकरून ३:४ आकारात सर्व मजकूर व्यवस्थित दिसेल.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-8 flex flex-col items-center" ref={previewContainerRef}>
            <div className="w-full">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 no-print px-2">
                <div className="flex items-center gap-3">
                   <div className="bg-orange-100 p-2 rounded-xl">
                     <Eye size={16} className="text-orange-600" />
                   </div>
                   <span className="text-[13px] font-black text-slate-600 uppercase tracking-widest">लाईव्ह प्रिव्ह्यू</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className={`h-2.5 w-2.5 rounded-full ${isDownloading ? 'bg-orange-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'}`}></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">३:४ गुणोत्तर</span>
                </div>
              </div>
              
              <div className="bg-slate-200/40 rounded-[2.5rem] border border-slate-200 p-6 md:p-12 flex flex-col items-center justify-start min-h-[500px] md:min-h-[850px] overflow-hidden relative shadow-inner group transition-all duration-300">
                {/* The scaling div - ensures visibility */}
                <div 
                  className="transition-all duration-500 ease-out origin-top shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)] bg-white"
                  style={{ 
                    transform: `scale(${previewScale})`,
                    width: '600px',
                    height: '800px'
                  }}
                >
                  <NewspaperCanvas ref={canvasRef} data={data} />
                </div>
                
                {/* Visual Status Indicator */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center no-print pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="bg-slate-900/80 backdrop-blur-md px-5 py-2 rounded-full text-[11px] font-black text-white uppercase border border-slate-700 shadow-xl flex items-center gap-2">
                    <RefreshCcw size={12} /> ऑटो-स्केलिंग सक्रिय
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile Users */}
      {!isDownloading && !downloadSuccess && (
        <div className="fixed bottom-8 right-8 lg:hidden no-print z-[150]">
          <button
            onClick={handleDownload}
            className="bg-orange-600 text-white h-16 w-16 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 border-4 border-white animate-bounce ring-4 ring-orange-100"
          >
            <Download size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
