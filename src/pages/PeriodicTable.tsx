import { useState } from 'react';
import { elements, ElementData, getCategoryColor } from '../data/elements';
import { cn } from '../utils';
import ThreeAtom from '../components/ThreeAtom';
import { X, Sparkles, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  return (
    <div className="space-y-6 relative h-full flex flex-col px-2 md:px-0 overflow-x-auto">
      
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between sleek-panel p-4 md:p-6 rounded-2xl">
        <div>
          <h2 className="title-sleek text-xl md:text-3xl mb-2 text-white">
            Химиялық элементтердің периодтық жүйесі
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Атомдық құрылымы мен қасиеттерін көру үшін кез-келген элементті таңдаңыз.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 w-full overflow-x-auto overflow-y-auto custom-scrollbar pb-20">
        <div className="min-w-[720px] md:min-w-[1200px] grid grid-cols-[repeat(18,minmax(36px,1fr))] md:grid-cols-[repeat(18,minmax(0,1fr))] gap-1 md:gap-[6px] auto-rows-fr pb-8">
          {elements.map((el) => (
            <button
              key={el.number}
              onClick={() => setSelectedElement(el)}
              style={{ gridRow: el.gridRow, gridColumn: el.gridCol }}
              className={cn(
                "p-1 md:p-2 rounded border relative overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10 text-left flex flex-col items-center justify-center aspect-square",
                getCategoryColor(el.category),
                "bg-black/60 backdrop-blur-md shadow-md"
              )}
            >
              <div className="absolute top-1 left-1 text-[7px] md:text-[10px] font-bold opacity-70 leading-none">
                {el.number}
              </div>

              <div className="text-sm md:text-2xl font-black italic tracking-tighter leading-none">
                {el.symbol}
              </div>

              <div className="text-[5px] md:text-[8px] font-bold tracking-widest uppercase truncate w-full text-center mt-1 opacity-80">
                {el.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#080914] border border-cyan-500/30 w-full h-[95vh] md:h-auto md:max-h-[85vh] max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row relative"
            >
              
              {/* Close */}
              <button
                onClick={() => setSelectedElement(null)}
                className="absolute top-3 right-3 z-50 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center"
              >
                <X size={18} />
              </button>

              {/* 3D Area */}
              <div className="w-full md:w-1/2 h-[28vh] md:h-[600px] bg-black relative flex items-center justify-center overflow-hidden shrink-0">
                <ThreeAtom element={selectedElement} />

                <div className="absolute bottom-3 left-3 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 z-10">
                  <h3 className="text-[10px] md:text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    {selectedElement.name}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-slate-400 leading-tight mt-1 font-mono">
                    Атомдық №: {selectedElement.number}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="w-full md:w-1/2 p-4 md:p-10 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#080914] to-black">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-2 text-white">
                  {selectedElement.name}
                </h3>

                <div className="space-y-5">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedElement.description}
                  </p>

                  <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                    <h4 className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-2">
                      <Sparkles size={14} /> Ерекшелігі
                    </h4>
                    <p className="text-sm text-slate-300">{selectedElement.specialty}</p>
                  </div>

                  <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl">
                    <h4 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-2">
                      <ShieldAlert size={14} /> Қауіптілігі
                    </h4>
                    <p className="text-sm text-slate-300">{selectedElement.danger}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}