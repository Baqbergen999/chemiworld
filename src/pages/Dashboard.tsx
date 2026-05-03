import { motion } from 'framer-motion';
import { curriculum } from '../data/curriculum';
import { useGameStore } from '../store';
import { cn } from '../utils';
import { Lock, Unlock, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { unlockedWeeks, unlockNextWeek, midtermPassed, passMidterm } = useGameStore();
  const navigate = useNavigate();

  const handleSimulatePass = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22d3ee', '#f472b6']
    });
    passMidterm();
    if (unlockedWeeks === 8) {
       unlockNextWeek();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full">
      {/* Sidebar for Roadmap progress overview */}
      <aside className="w-full lg:w-[280px] flex flex-col gap-4 hidden lg:flex">
         <div className="sleek-panel p-4 rounded-xl flex flex-col h-full fade-in">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-neon-cyan)] mb-3">Жол картасы</h2>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
               {curriculum.map((module, index) => {
                  const isUnlocked = index < unlockedWeeks;
                  const isCurrent = index === unlockedWeeks - 1;
                  
                  return (
                     <div key={module.week} className={cn(
                        "p-2 rounded flex items-center gap-3 transition-colors",
                        isCurrent ? "bg-[var(--color-neon-cyan)]/10 border border-[var(--color-neon-cyan)]/30" :
                        isUnlocked ? "bg-slate-800/50 border border-white/5 opacity-80" : "bg-black/20 border-transparent opacity-40 grayscale"
                     )}>
                        <div className={cn(
                           "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold",
                           isCurrent ? "bg-[var(--color-neon-cyan)] text-black" :
                           isUnlocked ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-500"
                        )}>
                           {module.week.toString().padStart(2, '0')}
                        </div>
                        <span className={cn("text-xs", isCurrent ? "font-bold text-[var(--color-neon-cyan)]" : "font-medium")}>
                           {module.title}
                        </span>
                     </div>
                  )
               })}
            </div>
         </div>
         
         <div className="bg-gradient-to-b from-slate-900 to-black border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center gap-3 shadow-xl">
            <div className="text-[10px] uppercase font-bold text-slate-400">Үздіксіз күндер</div>
            <div className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">12 КҮН</div>
         </div>
      </aside>

      <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sleek-panel p-6 rounded-2xl">
          <div>
            <h2 className="title-sleek text-3xl mb-2 text-white">Периодтық жүйедегі элементтер химиясы</h2>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Оқу бағдарламасы: Ең жеңіл элементтен бастап f-блоктың құпияларына дейінгі 15 апталық саяхатқа шығыңыз. Модульдерді аяқтап, XP жинап, жаңа зертханалық құралдарды ашыңыз.
            </p>
          </div>
          
          <button 
            onClick={unlockNextWeek}
            disabled={unlockedWeeks >= 15 || (unlockedWeeks === 8 && !midtermPassed)}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-widest transition-all text-cyan-400 flex items-center gap-2 disabled:opacity-50"
          >
            <Zap size={14} />
            <span>Тест: Апта Аяқтау</span>
          </button>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-8 pl-8 space-y-8">
          {curriculum.map((module, index) => {
            const isUnlocked = index < unlockedWeeks;
            const isCurrent = index === unlockedWeeks - 1;
            
            return (
              <motion.div 
                key={module.week}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className={cn(
                  "absolute -left-[37px] w-3 h-3 rounded-full z-10 top-6",
                  isCurrent ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]" : 
                  isUnlocked ? "bg-pink-400 shadow-[0_0_10px_#f472b6]" : "bg-slate-700"
                )}>
                </div>

                <div className={cn(
                  "sleek-panel p-6 rounded-2xl transition-all duration-300 group",
                  isCurrent ? "border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)] bg-[#080914]/90" : 
                  isUnlocked ? "opacity-90 hover:border-white/20" : "opacity-40 grayscale"
                )}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-widest",
                        isCurrent ? "text-cyan-400" : "text-pink-400"
                      )}>
                        {module.week} Апта
                      </span>
                      <h3 className="text-xl font-display font-bold mt-1 text-white">{module.title}</h3>
                    </div>
                    {module.isMidterm && !midtermPassed && isUnlocked && (
                      <button 
                        onClick={handleSimulatePass}
                        className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:scale-105 transition-transform"
                      >
                        Емтихан тапсыру
                      </button>
                    )}
                    {module.isMidterm && midtermPassed && (
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest px-3 py-1 border border-green-400/30 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.2)] bg-green-400/10">ӨТТІ</span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-medium text-slate-300 mb-2">{module.topic}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{module.description}</p>
                  
                  {isUnlocked && !module.isMidterm && (
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => navigate(`/lecture/${module.week}`)}
                        className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-[10px] uppercase tracking-widest font-bold border border-white/10 text-white"
                      >
                        Оқуды бастау
                      </button>
                      <button 
                        onClick={() => navigate(`/sandbox`)}
                        className="px-5 py-2 rounded-full bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                      >
                        Эксперимент
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
