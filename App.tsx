
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
  const [previewScale, setPreviewScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const updateData = (updates: Partial<NewsData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Robust Scaling logic using ResizeObserver
  useEffect(() => {
    if (!previewContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const windowWidth = window.innerWidth;
        const padding = windowWidth < 768 ? 20 : 60;
        const availableWidth = width - padding;
        
        // Target canvas width is 600px
        const newScale = Math.min(availableWidth / 600, 1.2);
        // Ensure scale is never too small to see
        setPreviewScale(Math.max(newScale, 0.15));
      }
    });

    observer.observe(previewContainerRef.current);
    
    return () => observer.disconnect();
  }, []);

  const handleDownload = async () => {
    if (!canvasRef.current || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    try {
      // Small delay to ensure any pending styles are applied
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(canvasRef.current, {
        scale: 3, // 3x is a good balance for quality and speed
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('newspaper-clipping');
            if (el) el.style.transform = 'none';
        }
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `KustiVarta-${Date.now()}.png`;
      link.click();
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Capture Error:", error);
      alert("फोटो तयार करताना अडचण आली. कृपया इमेज साईज कमी करून पहा किंवा पुन्हा प्रयत्न करा.");
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
                <span className="text-[11px] font-black text-orange-800 uppercase tracking-widest">प्रोसेसिंग...</span>
              </div>
            ) : downloadSuccess ? (
              <div className="bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-in zoom-in duration-300">
                <CheckCircle2 size={18} />
                <span className="text-xs font-black uppercase">सेव्ह झाले</span>
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
                  className="flex items-center gap-3 bg-orange-600 text-white px-6 md:px-8 py-3 rounded-2xl text-[12px] font-black tracking-widest uppercase shadow-xl hover:bg-orange-700 hover:-translate-y-0.5 transition-all border-b-4 border-orange-800"
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
                   <p className="text-xs font-black text-slate-800 uppercase tracking-wider">टीप</p>
                   <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">बातमीच्या लांबीनुसार मजकूर आपोआप रॅपिंग (Wrapping) होतो. ३:४ गुणोत्तरात सर्वोत्तम रिझल्ट मिळेल.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-8 flex flex-col items-center w-full" ref={previewContainerRef}>
            <div className="w-full">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 no-print px-2">
                <div className="flex items-center gap-3">
                   <div className="bg-orange-100 p-2 rounded-xl">
                     <Eye size={16} className="text-orange-600" />
                   </div>
                   <span className="text-[13px] font-black text-slate-600 uppercase tracking-widest">लाईव्ह प्रिव्ह्यू</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                   <RefreshCcw size={12} className={isDownloading ? 'animate-spin text-orange-500' : ''} />
                   <span className="uppercase tracking-tighter">ऑटो-स्केलिंग {Math.round(previewScale * 100)}%</span>
                </div>
              </div>
              
              <div className="bg-slate-200/50 rounded-[2.5rem] border-2 border-dashed border-slate-300 p-4 md:p-8 flex items-start justify-center min-h-[600px] md:min-h-[850px] overflow-hidden relative shadow-inner group">
                {/* The scaling div */}
                <div 
                  className="transition-transform duration-300 ease-out origin-top shadow-2xl bg-white ring-1 ring-black/5"
                  style={{ 
                    transform: `scale(${previewScale})`,
                    width: '600px',
                    height: '800px',
                    display: 'block'
                  }}
                >
                  <NewspaperCanvas ref={canvasRef} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      {!isDownloading && !downloadSuccess && (
        <div className="fixed bottom-6 right-6 lg:hidden no-print z-[150]">
          <button
            onClick={handleDownload}
            className="bg-orange-600 text-white h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 border-2 border-white animate-pulse"
          >
            <Download size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
