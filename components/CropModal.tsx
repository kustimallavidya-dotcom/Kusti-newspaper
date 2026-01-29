
import React, { useState, useRef, useEffect } from 'react';
import { Check, X, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface Props {
  image: string;
  onCrop: (croppedImage: string) => void;
  onClose: () => void;
}

const CropModal: React.FC<Props> = ({ image, onCrop, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      imgRef.current = img;
      draw();
    };
  }, [image]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imgRef.current;
    const size = Math.min(canvas.width, canvas.height);
    
    ctx.save();
    // Create circular clip for preview
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 - 10, 0, Math.PI * 2);
    ctx.clip();

    // Calculate dimensions to cover
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * zoom;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2 + offset.x;
    const y = (canvas.height - h) / 2 + offset.y;

    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    // Draw circular border overlay
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 - 10, 0, Math.PI * 2);
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [zoom, offset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx || !imgRef.current) return;

    const img = imgRef.current;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * zoom;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2 + offset.x * (300 / 400); // adjust for preview scale
    const y = (canvas.height - h) / 2 + offset.y * (300 / 400);

    ctx.drawImage(img, x, y, w, h);
    onCrop(canvas.toDataURL('image/png'));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-orange-50">
          <h3 className="font-black text-orange-800 uppercase text-sm tracking-widest">फोटो क्रॉप करा</h3>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-8 flex flex-col items-center gap-6">
          <div 
            className="relative cursor-move rounded-full overflow-hidden border-4 border-orange-100 shadow-inner"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas ref={canvasRef} width={300} height={300} className="rounded-full shadow-lg" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
               <Move size={48} />
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center gap-4 px-2">
              <ZoomOut size={18} className="text-gray-400" />
              <input 
                type="range" 
                min="1" max="3" step="0.01" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-orange-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <ZoomIn size={18} className="text-gray-400" />
            </div>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">फोटो ड्रॅग करून गोल भागात सेट करा</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">रद्द करा</button>
          <button onClick={handleSave} className="flex-1 py-3 bg-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
            <Check size={18} /> जतन करा
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
