
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Newspaper, Download, Printer, Loader2, CheckCircle2, Info, RefreshCcw, Eye, Share2, Sparkles } from 'lucide-react';
import NewspaperCanvas from './components/NewspaperCanvas';
import InputForm from './components/InputForm';
import { ThemeType, NewsData, SocialPreset } from './types';
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
    paperTitle: 'मल्लविद्या विश्व वार्ता',
    paperSubTitle: 'महाराष्ट्र राज्य • क्रीडा व कुस्ती विशेष वार्ता',
    headlineScale: 1.0,
    bodyScale: 1.0,
  });
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadTag, setDownloadTag] = useState<string>('HD');
  const [previewScale, setPreviewScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const updateData = (updates: Partial<NewsData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const windowWidth = window.innerWidth;
        const padding = windowWidth < 768 ? 20 : 60;
        const availableWidth = width - padding;
        const newScale = Math.min(availableWidth / 600, 1.2);
        setPreviewScale(Math.max(newScale, 0.2));
      }
    });
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDownload = async (preset: SocialPreset = 'standard') => {
    if (!canvasRef.current || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    const presetNames: Record<SocialPreset, string> = {
      standard: 'HD Paper',
      insta_post: 'Instagram Post',
      insta_story: 'Instagram Story',
      whatsapp: 'WhatsApp Status',
      facebook: 'Facebook Post'
    };
    setDownloadTag(presetNames[preset] || 'HD');

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(canvasRef.current, {
        scale: 3.0, // High clarity 3x output for crystal clear text
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 30000,
        onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('newspaper-clipping');
            if (el) {
              el.style.transform = 'none';
              el.style.boxShadow = 'none';
              el.style.width = '600px';
              el.style.height = '800px';
              
              const allText = el.querySelectorAll('h1, h2, span, p, div');
              allText.forEach((node) => {
                const htmlNode = node as HTMLElement;
                htmlNode.style.letterSpacing = 'normal';
                htmlNode.style.wordSpacing = 'normal';
                htmlNode.style.textRendering = 'optimizeSpeed';
                if (htmlNode.tagName === 'H2') htmlNode.style.lineHeight = '1.35';
                if (htmlNode.tagName === 'SPAN' && !htmlNode.classList.contains('drop-cap')) {
                   htmlNode.style.lineHeight = '1.8';
                }
              });
            }
        }
      });
      
      let finalCanvas = canvas;

      // Platform specific HD frames
      if (preset === 'insta_post') {
        const squareCanvas = document.createElement('canvas');
        squareCanvas.width = 1080;
        squareCanvas.height = 1080;
        const ctx = squareCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(0, 0, 1080, 1080);
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(185, 85, 710, 910);
          ctx.drawImage(canvas, 190, 90, 700, 900);
          finalCanvas = squareCanvas;
        }
      } else if (preset === 'insta_story' || preset === 'whatsapp') {
        const storyCanvas = document.createElement('canvas');
        storyCanvas.width = 1080;
        storyCanvas.height = 1920;
        const ctx = storyCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, 1080, 1920);
          const imgWidth = 980;
          const imgHeight = (canvas.height / canvas.width) * imgWidth;
          const offsetY = (1920 - imgHeight) / 2;
          ctx.drawImage(canvas, 50, offsetY, imgWidth, imgHeight);
          finalCanvas = storyCanvas;
        }
      }

      const image = finalCanvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `Mallavidya-Vishwa-Varta-${preset}-${Date.now()}.png`;
      link.click();
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Capture Error:", error);
      alert("फोटो सेव्ह करताना अडचण आली. पुन्हा प्रयत्न करा.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 pb-12 selection:bg-orange-200 overflow-x-hidden font-sans">
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-200 no-print py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-600 p-2.5 rounded-2xl shadow-xl shadow-orange-100 ring-2 ring-orange-50">
              <Newspaper className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tight leading-none text-slate-900 calligraphy-subtitle">
                मल्लविद्या विश्व वार्ता
              </h1>
              <p className="text-[10px] font-bold tracking-[0.3em] text-orange-600 uppercase mt-1">
                HD Calligraphy Newspaper Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {isDownloading ? (
              <div className="bg-orange-50 px-5 py-3 rounded-2xl flex items-center gap-3 border border-orange-100 animate-pulse">
                <Loader2 size={18} className="animate-spin text-orange-600" />
                <span className="text-[11px] font-black text-orange-800 uppercase tracking-widest">
                  {downloadTag} फोटो तयार होत आहे...
                </span>
              </div>
            ) : downloadSuccess ? (
              <div className="bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-in zoom-in duration-300">
                <CheckCircle2 size={18} />
                <span className="text-xs font-black uppercase">HD फोटो सेव्ह झाला!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 p-3 rounded-2xl border border-slate-200 transition-all text-slate-600 shadow-sm active:scale-95"
                  title="प्रिंट करा"
                >
                  <Printer size={20} />
                </button>

                <button 
                  onClick={() => handleDownload('standard')}
                  className="flex items-center gap-2 bg-orange-600 text-white px-5 md:px-7 py-3 rounded-2xl text-[12px] font-black tracking-widest uppercase shadow-xl hover:bg-orange-700 hover:-translate-y-0.5 transition-all border-b-4 border-orange-800"
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
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit no-print">
            <InputForm 
              data={data} 
              onChange={updateData} 
              isDownloading={isDownloading} 
              onDownload={() => handleDownload('standard')}
            />
            
            <div className="mt-6 p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-xl"><Sparkles size={18} className="text-orange-600" /></div>
                <div className="space-y-1">
                   <p className="text-xs font-black text-slate-800 uppercase tracking-wider">वैशिष्ट्ये</p>
                   <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                     १. "मल्लविद्या विश्व वार्ता" टायटल कॅलिग्राफी फॉन्टमध्ये.<br/>
                     २. बातमीच्या लांबीनुसार Text फॉन्ट स्केलिंग सोय.<br/>
                     ३. इन्स्टाग्राम, व्हॉट्सॲप व फेसबुकसाठी विशेष HD इमेज.<br/>
                     ४. फक्त दिनांक व वार प्रदर्शित केले जातील.
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col items-center w-full" ref={previewContainerRef}>
            <div className="w-full space-y-4">
              
              {/* Social Media HD Download Toolbar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-orange-600" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    सोशल मीडिया HD इमेज डाऊनलोड करा:
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleDownload('insta_post')}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3.5 py-2 rounded-xl text-[11px] font-black shadow-md hover:opacity-90 active:scale-95 transition-all"
                  >
                    📸 इन्स्टाग्राम (1:1)
                  </button>
                  <button
                    onClick={() => handleDownload('whatsapp')}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-[11px] font-black shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    💬 व्हॉट्सॲप स्टेटस (9:16)
                  </button>
                  <button
                    onClick={() => handleDownload('facebook')}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-[11px] font-black shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    📘 फेसबुक पोस्ट
                  </button>
                  <button
                    onClick={() => handleDownload('standard')}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 bg-orange-600 text-white px-3.5 py-2 rounded-xl text-[11px] font-black shadow-md hover:bg-orange-700 active:scale-95 transition-all"
                  >
                    📰 HD पेपर
                  </button>
                </div>
              </div>

              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print px-2">
                <div className="flex items-center gap-3">
                   <div className="bg-orange-100 p-2 rounded-xl"><Eye size={16} className="text-orange-600" /></div>
                   <span className="text-[13px] font-black text-slate-600 uppercase tracking-widest">लाईव्ह प्रिव्ह्यू</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                   <RefreshCcw size={12} className={isDownloading ? 'animate-spin text-orange-500' : ''} />
                   <span className="uppercase tracking-tighter">स्केलिंग {Math.round(previewScale * 100)}%</span>
                </div>
              </div>
              
              {/* Paper Canvas Container */}
              <div className="bg-slate-200/50 rounded-[2.5rem] border-2 border-dashed border-slate-300 p-4 md:p-8 flex items-start justify-center min-h-[600px] overflow-hidden relative shadow-inner">
                <div 
                  className="transition-transform duration-300 ease-out origin-top shadow-2xl bg-white"
                  style={{ transform: `scale(${previewScale})`, width: '600px', height: '800px' }}
                >
                  <NewspaperCanvas ref={canvasRef} data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {!isDownloading && !downloadSuccess && (
        <div className="fixed bottom-6 right-6 lg:hidden no-print z-[150] flex flex-col items-end gap-2">
          <button 
            onClick={() => handleDownload('whatsapp')} 
            className="bg-emerald-600 text-white h-12 w-12 rounded-full shadow-xl flex items-center justify-center border-2 border-white text-xs font-bold"
            title="WhatsApp Status HD"
          >
            💬
          </button>
          <button 
            onClick={() => handleDownload('standard')} 
            className="bg-orange-600 text-white h-14 w-14 rounded-full shadow-2xl flex items-center justify-center border-2 border-white animate-pulse"
            title="HD Download"
          >
            <Download size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

