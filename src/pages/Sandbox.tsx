import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store';
import { Flame, RotateCcw, Snowflake, RefreshCw } from 'lucide-react';
import { cn } from '../utils';

type Reagent = 'HCl' | 'H2SO4' | 'HNO3' | 'NaOH' | 'NH3' | 'KMnO4' | 'K2Cr2O7' | 'CuSO4' | 'AgNO3' | 'NaCl' | 'BaCl2' | 'KI' | 'Zn' | 'Fe' | 'Ethanol' | 'H2O2' | 'Na2CO3' | 'Pb(NO3)2' | 'H2O' | 'Na' | 'K';

interface BeakerState {
  contents: Reagent[];
  color: string;
  volume: number; // Max 100
  isHeating: boolean;
  temperature: number; // C
  precipitateColor: string | null;
  isBubbling: boolean;
}

export default function Sandbox() {
  const { addXp } = useGameStore();
  const [beaker, setBeaker] = useState<BeakerState>({
    contents: [],
    color: '#333333', // Empty
    volume: 0,
    isHeating: false,
    temperature: 25,
    precipitateColor: null,
    isBubbling: false
  });
  
  const [log, setLog] = useState<string[]>(['Зертхана іске қосылды. Кешенді реактивтерді таңдаңыз.']);
  const [isExploded, setIsExploded] = useState(false);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 20));

  const mixReaction = (newContents: Reagent[], temp: number, actionName: 'add' | 'heat' | 'stir' | 'cool' = 'add', addedReagent: Reagent | null = null) => {
    let newColor = '#ffffff11'; // Base waterish
    let pptColor = null;
    let bubbling = false;
    let explosion = false;
    let reactionOccurred = false;

    const has = (r: Reagent) => newContents.includes(r);
    
    // Check if the current reaction should trigger (during add, it must involve the addedReagent)
    const involves = (r1: Reagent, r2: Reagent) => 
      has(r1) && has(r2) && (actionName !== 'add' || addedReagent === r1 || addedReagent === r2);

    const involves3 = (r1: Reagent, r2: Reagent, r3: Reagent) => 
      has(r1) && has(r2) && has(r3) && (actionName !== 'add' || addedReagent === r1 || addedReagent === r2 || addedReagent === r3);

    // Neutralization Reactions
    if (involves('NaOH', 'HNO3')) {
       if (actionName === 'add') {
         addLog("Бейтараптану: Натрий гидроксиді (NaOH) мен азот қышқылының (HNO₃) реакциясы. Нәтижесінде натрий нитраты (NaNO₃ тұзы) және су түзіледі.");
         reactionOccurred = true; addXp(15);
       } else if (actionName === 'stir') {
         addLog("Араластыру бейтараптануды толық аяқтады."); reactionOccurred = true;
       }
    }
    else if (involves('NaOH', 'HCl')) {
       if (actionName === 'add') {
         addLog("Бейтараптану: Натрий гидроксиді (NaOH) тұз қышқылымен (HCl) әрекеттесіп, ас тұзы (NaCl) және су түзеді.");
         reactionOccurred = true; addXp(15);
       }
    }
    else if (involves('NaOH', 'H2SO4')) {
       if (actionName === 'add') {
         addLog("Бейтараптану: Натрий гидроксиді мен күкірт қышқылынан натрий сульфаты (Na₂SO₄ тұзы) және су түзіледі. Жылу бөлінеді.");
         reactionOccurred = true; addXp(15);
       }
    }

    // Exploding conditions
    else if ((involves('Na', 'H2O') || involves('Na', 'HCl') || involves('Na', 'H2SO4') || involves('Na', 'HNO3') || involves('K', 'H2O') || involves('K', 'HCl') || involves('K', 'H2SO4') || involves('K', 'HNO3'))) {
       if (actionName === 'add') {
         addLog("ЖЕТІСТІК! Сілтілік металл сұйықтықпен шабытты әрекеттесіп, сутегі газын бөледі. Бұл күшті экзотермиялық реакция жарылысқа әкеледі. Өте ыстық/жарылғыш зат!");
         reactionOccurred = true; addXp(50);
       }
       explosion = true;
       newColor = '#f97316';
    }
    else if (involves3('KMnO4', 'Ethanol', 'H2SO4') && temp > 40) {
       if (actionName === 'heat') {
         addLog("СӘТТІ ҚЫЗДЫРЫЛДЫ! ҚАУІП: Күшті тотықтырғыш органикамен әрекеттесті! Жарқыл мен жарылыс. Өте ыстық/жарылғыш зат!");
         reactionOccurred = true; addXp(50);
       }
       explosion = true;
       newColor = '#f472b6';
    }
    else if (involves('KMnO4', 'Ethanol') && temp > 40) {
       if (actionName === 'heat') {
         addLog("СӘТТІ ҚЫЗДЫРЫЛДЫ! ҚАУІП: Күшті тотықтырғыш органикамен әрекеттесті! Жарқыл мен жарылыс. Өте ыстық/жарылғыш зат!");
         reactionOccurred = true; addXp(50);
       }
       explosion = true;
       newColor = '#f472b6';
    }
    else if (involves('HNO3', 'Ethanol')) {
       if (actionName === 'add') {
         addLog("ҚАУІП: Азот қышқылы этанолмен тотығу реакциясына түсіп, өздігінен жарылысқа әкеледі! Өте ыстық/жарылғыш зат!");
         reactionOccurred = true; addXp(50);
       }
       explosion = true;
       newColor = '#f97316';
    }

    // Heavy bubbling (Gas evolution)
    else if (involves('Zn', 'HCl') || involves('Zn', 'H2SO4') || involves('Fe', 'HCl') || involves('Fe', 'H2SO4')) {
       if (actionName === 'add') {
          addLog("Реакция: Металл қышқылмен әрекеттесіп, тұз және сутегі (H₂) газын бөледі. Өте қауіпті жанғыш газ!");
          bubbling = true; reactionOccurred = true; addXp(25);
       } else if (actionName === 'stir') {
          addLog("Сәтті араластырылды! Газ бөлінуі жылдамдады. Өте қауіпті газ бөлінді!");
          bubbling = true; reactionOccurred = true;
       } else if (actionName === 'heat') {
          addLog("Сәтті қыздырылды! Реакция жылдамдығы күрт артты. Сутегі тез бөлінді!");
          bubbling = true; reactionOccurred = true;
       }
    }
    else if (involves('Na2CO3', 'HCl') || involves('Na2CO3', 'HNO3') || involves('Na2CO3', 'H2SO4')) {
       if (actionName === 'add') {
          addLog("Реакция: Карбонат қышқылмен әрекеттесіп, тұз, су және көмірқышқыл газын (CO₂) бөледі. Улы сұйықтық/газ қаупі.");
          bubbling = true; reactionOccurred = true; addXp(25);
       } else if (actionName === 'stir') {
          addLog("Сәтті араластырылды! CO2 бөлінуі артты.");
          bubbling = true; reactionOccurred = true;
       } else if (actionName === 'heat') {
          addLog("Сәтті қыздырылды! Газ өте тез бөлініп жатыр.");
          bubbling = true; reactionOccurred = true;
       }
    }
    else if (involves('H2O2', 'KI')) {
       if (actionName === 'add') {
          addLog("Реакция: Калий йодиді сутегі пероксидінің ыдырауын катализдейді (Піл тіс пастасы). Оттегі (O₂) бөлінді. Өте қауіпті газ!");
          bubbling = true; newColor = '#b45309'; reactionOccurred = true; addXp(50);
       } else if (actionName === 'stir') {
          addLog("Сәтті араластырылды! Көпіршіктену молайды. Оттегі көп бөлінді.");
          bubbling = true; newColor = '#b45309'; reactionOccurred = true;
       } else if (actionName === 'heat') {
          addLog("Сәтті қыздырылды! Ыдырау тез жүрді.");
          bubbling = true; newColor = '#b45309'; reactionOccurred = true;
       }
    }
    
    // Precipitations
    else if (involves('AgNO3', 'NaCl') || involves('AgNO3', 'HCl') || involves('AgNO3', 'BaCl2')) {
       if (actionName === 'add') {
         addLog("Реакция: Күміс катионы хлорид анионымен кездесіп, күміс хлоридінің (AgCl) тұнбасын түзеді.");
         pptColor = '#ffffff'; reactionOccurred = true; addXp(30);
       } else if (actionName === 'stir') {
         addLog("Сәтті араластырылды! Ақ тұнба біркелкі таралды.");
         pptColor = '#ffffff'; reactionOccurred = true;
       } else if (actionName === 'heat') {
         addLog("Сәтті қыздырылды! Тұнба коагуляцияланды.");
         pptColor = '#ffffff'; reactionOccurred = true;
       }
    }
    else if (involves('BaCl2', 'H2SO4') || involves('BaCl2', 'CuSO4')) {
       if (actionName === 'add') {
         addLog("Реакция: Барий катионы сульфат анионымен әрекеттесіп, барий сульфатының (BaSO₄) суда ерімейтін ақ тұнбасын береді.");
         pptColor = '#e2e8f0'; reactionOccurred = true; addXp(30);
       } else if (actionName === 'stir') {
         addLog("Сәтті араластырылды! Сульфат тұнбасы шайқалды.");
         pptColor = '#e2e8f0'; reactionOccurred = true;
       }
    }
    else if (involves('CuSO4', 'NaOH')) {
       if (actionName === 'add') {
         addLog("Реакция: Мыс (II) сульфаты сілтімен әрекеттесіп, мыс (II) гидроксидінің (Cu(OH)₂) қоймалжың көк тұнбасын түзеді.");
         pptColor = '#3b82f6'; reactionOccurred = true; addXp(30);
       } else if (actionName === 'stir') {
         addLog("Сәтті араластырылды! Көк тұнба бөлшектері қалыптасты.");
         pptColor = '#3b82f6'; reactionOccurred = true;
       } else if (actionName === 'heat') {
         addLog("Сәтті қыздырылды! Көк Cu(OH)2 ыдырап, мыс (II) оксидіне (CuO) қара тұнбасына айналды.");
         pptColor = '#1f2937'; reactionOccurred = true;
       }
    }
    else if (involves('Pb(NO3)2', 'KI')) {
       if (actionName === 'add') {
         addLog("Реакция: Қорғасын нитраты калий йодидімен әрекеттесіп, қорғасын йодидінің (PbI₂) сары тұнбасын түзеді.");
         pptColor = '#eab308'; reactionOccurred = true; addXp(100);
       } else if (actionName === 'stir') {
         addLog("Сәтті араластырылды! Сары тұнба біркелкі таралды. Улы металь қосылысы!");
         pptColor = '#eab308'; reactionOccurred = true;
       } else if (actionName === 'cool') {
         addLog("СӘТТІ СУЫТЫЛДЫ! PbI2 ерігіштігі төмендеп, жарқыраған 'Алтын жаңбыр' кристаллдары көбейді.");
         pptColor = '#eab308'; reactionOccurred = true;
       } else if (actionName === 'heat') {
         addLog("Сәтті қыздырылды! PbI2 қайтадан еріп жатыр.");
         pptColor = null; reactionOccurred = true;
       }
    }

    // Complex formations and color changes
    else if (involves('CuSO4', 'NH3')) {
       if (actionName === 'add') {
         addLog("Реакция: Мыс аммиакпен әрекеттесіп, [Cu(NH3)4]2+ кешенді қосылысын түзеді. Қою көк тұнбасыз ерітінді.");
         newColor = '#1d4ed8'; pptColor = null; reactionOccurred = true; addXp(50);
       } else if (actionName === 'stir') {
         addLog("Сәтті араластырылды! Кешенді қосылыс біркелкі таралды.");
         newColor = '#1d4ed8'; pptColor = null; reactionOccurred = true;
       }
    }
    else if (involves('KMnO4', 'H2SO4')) {
       if (temp > 40 && actionName === 'heat') {
         addLog("Сәтті қыздырылды! Марганец (VII) қышқылдық ортада тотықсызданып Mn2+ (түссіз) түзеді.");
         newColor = '#ffffff22'; reactionOccurred = true; addXp(40);
       } else if (actionName === 'add' || actionName === 'stir') {
         addLog("Қышқылдық ортадағы калий перманганаты. Реакция үшін қыздыру керек шығар.");
         newColor = '#c026d3'; reactionOccurred = true;
       }
    }
    else if (involves('K2Cr2O7', 'NaOH')) {
       if (actionName === 'add') {
         addLog("Реакция: Сілтілік ортада бихромат (сат-сары) хроматқа (сары) айналады.");
         newColor = '#eab308'; reactionOccurred = true; addXp(50);
       } else if (actionName === 'stir') {
         addLog("Сәтті араластырылды! Толық сары болды.");
         newColor = '#eab308'; reactionOccurred = true;
       }
    }
    else if (involves3('K2Cr2O7', 'H2SO4', 'Ethanol')) {
       if (temp > 40 && actionName === 'heat') {
         addLog("Сәтті қыздырылды! Этанол тотығып, хром (VI) хром (III)-ке (жасыл) айналады!");
         newColor = '#22c55e'; reactionOccurred = true; addXp(75);
       } else if (actionName === 'add' || actionName === 'stir') {
         addLog("Тотығу-тотықсыздану реакциясын бастау үшін қыздырыңыз.");
         reactionOccurred = true;
       }
    }

    if (actionName !== 'add' && !reactionOccurred) {
      if (actionName === 'heat') addLog("Қыздырылды, бірақ көрінетіндей реакция байқалмады.");
      else if (actionName === 'stir') addLog("Араластырылды, бірақ жаңа реакция жүрмеді.");
      else if (actionName === 'cool') addLog("Суытылды, бірақ кристаллизация немесе реакция белгілері жоқ.");
    }
    
    // Base colors if no complex override
    if (newColor === '#ffffff11' && !explosion) {
       if (has('KMnO4')) newColor = '#f472b6'; // Purple
       else if (has('K2Cr2O7')) newColor = '#f97316'; // Orange
       else if (has('CuSO4')) newColor = '#60a5fa'; // Light blue
       else if (has('KI')) newColor = '#fef3c7'; // slight yellow
       else if (has('Ethanol')) newColor = '#fdf4ff22'; // slightly cloudy
       else if (has('Zn') || has('Fe')) newColor = '#94a3b8'; // greyish
    }

    return { color: newColor, pptColor, isExploded: explosion, isBubbling: bubbling };
  };

  const addReagent = (r: Reagent) => {
    if (isExploded) return;
    if (beaker.volume >= 100) {
      addLog("Колба толы!");
      return;
    }
    
    const nextContents = [...beaker.contents, r];
    const reaction = mixReaction(nextContents, beaker.temperature, 'add', r);
    
    setBeaker(prev => ({
      ...prev,
      contents: nextContents,
      volume: prev.volume + 20,
      color: reaction.color,
      precipitateColor: reaction.pptColor,
      isBubbling: prev.isBubbling || reaction.isBubbling
    }));
    
    if (reaction.isExploded) {
      setIsExploded(true);
      addLog("ЖАРЫЛЫС! Қауіпсіздік жүйесі іске қосылды.");
    } else {
      addLog(`Колбаға қосылды: ${r}`);
    }
  };

  const toggleHeat = () => {
    if (isExploded || beaker.volume === 0) return;
    const nextHeating = !beaker.isHeating;
    const nextTemp = nextHeating ? 90 : 25; 
    
    const reaction = mixReaction(beaker.contents, nextTemp, 'heat');
    
    setBeaker(prev => ({
      ...prev,
      isHeating: nextHeating,
      temperature: nextTemp,
      color: reaction.color,
      isBubbling: prev.isBubbling || reaction.isBubbling,
      precipitateColor: reaction.pptColor || prev.precipitateColor
    }));
    
    if (reaction.isExploded) {
      setIsExploded(true);
      addLog("Қатты қыздыру салдарынан ЖАРЫЛЫС!");
    } else {
      addLog(nextHeating ? "Спиртшам ҚОСЫЛДЫ." : "Спиртшам ӨШІРІЛДІ.");
    }
  };

  const toggleCool = () => {
    if (isExploded || beaker.volume === 0) return;
    const nextTemp = beaker.temperature === 5 ? 25 : 5; 
    
    const reaction = mixReaction(beaker.contents, nextTemp, 'cool');
    
    setBeaker(prev => ({
      ...prev,
      isHeating: false,
      temperature: nextTemp,
      color: reaction.color,
      isBubbling: prev.isBubbling || reaction.isBubbling,
      precipitateColor: reaction.pptColor || prev.precipitateColor
    }));
    
    addLog(nextTemp === 5 ? "Мұзды монша ҚОСЫЛДЫ." : "Мұзды монша ӨШІРІЛДІ.");
  };

  const stirBeaker = () => {
    if (isExploded || beaker.volume === 0) return;
    
    const reaction = mixReaction(beaker.contents, beaker.temperature, 'stir');
    
    setBeaker(prev => ({
      ...prev,
      color: reaction.color,
      isBubbling: prev.isBubbling || reaction.isBubbling,
      precipitateColor: reaction.pptColor || prev.precipitateColor
    }));
    
    if (reaction.isExploded) {
      setIsExploded(true);
      addLog("Күшті араластырудан ЖАРЫЛЫС!");
    } else {
      addLog("Сиқырлы таяқшамен араластырылды.");
    }
  };

  const reset = () => {
    setBeaker({ contents: [], color: '#333333', volume: 0, isHeating: false, temperature: 25, precipitateColor: null, isBubbling: false });
    setIsExploded(false);
    addLog("Колба тазартылды. Жаңа экспериментке дайын.");
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full h-full overflow-y-auto custom-scrollbar pr-1 md:pr-2 pb-24">
      <div className="flex flex-col md:flex-row justify-between md:items-end sleek-panel p-4 md:p-6 rounded-2xl gap-4">
        <div>
          <h2 className="title-sleek text-2xl md:text-3xl mb-2 text-white">Кешенді Алхимия Зертханасы</h2>
          <p className="text-xs md:text-sm text-slate-400">Реактивтерді араластырып, қышқыл-негіз, тұнба түзу және тотығу-тотықсыздану эксперименттерін жасаңыз.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <div className="flex-1 flex flex-col gap-6">
           {/* Visualizer */}
           <div className="sleek-panel p-6 rounded-3xl relative overflow-hidden h-[450px] lg:h-[500px] shadow-2xl flex items-center justify-center">
             
             {/* Grid background */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
             
             <div className="absolute top-4 left-6 right-6 z-20 flex justify-between items-center">
                <span className="text-[10px] text-green-400 font-mono italic">{isExploded ? "СЫНИ ҚАТЕЛІК" : "Эксперимент жүріп жатыр"}</span>
             </div>

             {/* Beaker Graphic */}
             <div className="w-48 h-64 md:w-56 md:h-72 border-b-4 border-l-4 border-r-4 border-white/20 rounded-b-3xl relative overflow-hidden z-10 bg-slate-900/40 backdrop-blur-sm mt-8">
                <motion.div 
                  className="absolute bottom-0 w-full"
                  animate={{ 
                    height: `${beaker.volume}%`,
                    backgroundColor: beaker.color
                  }}
                  transition={{ type: 'spring', bounce: 0, duration: 1 }}
                  style={{
                     boxShadow: beaker.volume > 0 ? `0 -10px 40px ${beaker.color}aa` : 'none'
                  }}
                >
                   <div className="absolute top-0 w-full h-2 bg-white/20 rounded-full" />
                   
                   {/* Precipitate layer */}
                   <AnimatePresence>
                     {beaker.precipitateColor && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: '20%' }}
                          className="absolute bottom-0 w-full opacity-80"
                          style={{ backgroundColor: beaker.precipitateColor }}
                        />
                     )}
                   </AnimatePresence>

                   <AnimatePresence>
                     {(beaker.isHeating || beaker.isBubbling) && beaker.volume > 0 && Array.from({length: beaker.isBubbling ? 30 : 15}).map((_, i) => (
                       <motion.div
                         key={i}
                         initial={{ y: '100%', x: Math.random() * 100 + '%', opacity: 1 }}
                         animate={{ y: '-20%', opacity: 0 }}
                         transition={{ duration: (Math.random() + 0.5) * (beaker.isBubbling ? 0.5 : 1), repeat: Infinity, ease: 'linear' }}
                         className="absolute w-2 h-2 rounded-full border border-white/50 bg-white/20"
                       />
                     ))}
                   </AnimatePresence>
                </motion.div>
             </div>

             {/* Explosion overlay */}
             <AnimatePresence>
                {isExploded && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.5 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="absolute inset-0 z-30 flex items-center justify-center bg-red-900/40 backdrop-blur-md"
                   >
                      <div className="text-4xl md:text-6xl text-red-400 font-black tracking-widest border-4 border-red-500 rounded-full w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.8)] bg-black/80 text-center leading-none">
                        BOOM
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             {/* Stats Overlay */}
             <div className="absolute top-16 right-4 md:right-6 text-right z-20 bg-[#080914]/80 p-3 md:p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Температура</div>
                <div className={cn("text-lg md:text-xl font-mono mb-2", beaker.temperature > 80 ? 'text-pink-500' : 'text-cyan-400')}>{beaker.temperature}°C</div>
                <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Көлем</div>
                <div className="text-lg md:text-xl font-mono text-white mb-2">{beaker.volume} mL</div>
                {beaker.precipitateColor && (
                  <>
                     <div className="text-[9px] md:text-[10px] text-pink-400 uppercase font-bold tracking-tighter mt-2">Тұнба</div>
                     <div className="text-[10px] md:text-xs font-mono text-white">Анықталды</div>
                  </>
                )}
             </div>
           </div>

           {/* Action Log Panel */}
           <div className="sleek-panel p-4 md:p-5 rounded-3xl h-[220px] md:h-[260px] flex flex-col shadow-xl border border-white/5 bg-slate-900/40 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase text-cyan-400 mb-3 tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                 Тіркеу Журналы
              </h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2">
                 {log.map((entry, idx) => (
                    <motion.div 
                      key={`${entry}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "text-[10px] md:text-xs font-mono px-3 py-2 bg-black/40 border-l-2 rounded-r transition-colors",
                        idx === 0 
                          ? "border-green-400 text-green-300 shadow-[0_0_15px_rgba(74,222,128,0.15)] bg-green-900/10" 
                          : "border-cyan-800/50 text-slate-400"
                      )}
                    >
                       <span className="opacity-50 mr-2">{log.length - idx}.</span>
                       {entry}
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Sidebar - Reagents */}
        <div className="w-full lg:w-[360px] flex flex-col gap-4 md:gap-6">
           <div className="bg-slate-900/40 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col flex-1 shadow-xl">
             <h3 className="text-xs font-bold uppercase text-cyan-400 mb-3 md:mb-4 tracking-widest flex justify-between items-center">
               <span>Реактивтер</span>
               <span className="text-[9px] text-slate-500 bg-black/40 px-2 py-1 rounded">21</span>
             </h3>
             
             <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-6 max-h-[350px] md:max-h-[400px] lg:max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                {[
                  { id: 'HCl', name: 'Тұз қышқылы', cl: 'text-white' },
                  { id: 'H2SO4', name: 'Күкірт қышқылы', cl: 'text-orange-400' },
                  { id: 'HNO3', name: 'Азот қышқылы', cl: 'text-yellow-400' },
                  { id: 'NaOH', name: 'Натрий гидроксиді', cl: 'text-white' },
                  { id: 'NH3', name: 'Аммиак', cl: 'text-blue-300' },
                  { id: 'KMnO4', name: 'Перманганат', cl: 'text-pink-400' },
                  { id: 'K2Cr2O7', name: 'Калий бихроматы', cl: 'text-orange-500' },
                  { id: 'CuSO4', name: 'Мыс сульфаты', cl: 'text-cyan-400' },
                  { id: 'AgNO3', name: 'Күміс нитраты', cl: 'text-slate-300' },
                  { id: 'NaCl', name: 'Натрий хлориді', cl: 'text-white' },
                  { id: 'BaCl2', name: 'Барий хлориді', cl: 'text-slate-300' },
                  { id: 'KI', name: 'Калий йодиді', cl: 'text-amber-200' },
                  { id: 'Na2CO3', name: 'Натрий карбонаты', cl: 'text-white' },
                  { id: 'Pb(NO3)2', name: 'Қорғасын нитраты', cl: 'text-slate-200' },
                  { id: 'Zn', name: 'Мырыш (түйір)', cl: 'text-slate-400' },
                  { id: 'Fe', name: 'Темір (ұнтақ)', cl: 'text-orange-800' },
                   { id: 'Na', name: 'Натрий (металл)', cl: 'text-zinc-300' },
                   { id: 'K', name: 'Калий (металл)', cl: 'text-indigo-200' },
                  { id: 'Ethanol', name: 'Этанол (Орг)', cl: 'text-amber-200' },
                  { id: 'H2O2', name: 'Сутегі пероксиді', cl: 'text-cyan-200' },
                  { id: 'H2O', name: 'Су (Дистилл.)', cl: 'text-cyan-200' }
                ].map(r => (
                  <button key={r.id} onClick={() => addReagent(r.id as Reagent)} className="p-2.5 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 text-left transition-colors group">
                     <div className={cn("font-bold transition-colors text-sm", r.cl)}>{r.id}</div>
                     <div className="text-[9px] text-slate-500 uppercase tracking-tighter mt-1 truncate">{r.name}</div>
                  </button>
                ))}
             </div>

             <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-tighter">Аппараттар</h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-auto">
               <button onClick={toggleHeat} className={cn(
                 "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors text-[9px] font-bold uppercase tracking-widest",
                 beaker.isHeating ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-white/10 bg-black/40 hover:bg-white/5 text-white"
               )}>
                  <Flame size={16} />
                  <span>{beaker.isHeating ? "Өшіру" : "Қыздыру"}</span>
               </button>
               <button onClick={toggleCool} className={cn(
                 "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors text-[9px] font-bold uppercase tracking-widest",
                 beaker.temperature === 5 ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "border-white/10 bg-black/40 hover:bg-white/5 text-white"
               )}>
                  <Snowflake size={16} />
                  <span>{beaker.temperature === 5 ? "Жылыту" : "Суыту"}</span>
               </button>
               <button onClick={stirBeaker} className="p-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 transition-colors text-white flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-widest">
                  <RefreshCw size={16} />
                  <span>Араластыру</span>
               </button>
               <button onClick={reset} className="p-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 transition-colors text-white flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-widest" title="Тартысу / Тазарту">
                  <RotateCcw size={16} />
                  <span>Тазарту</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
