import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { lectures } from '../data/lectures';
import { curriculum } from '../data/curriculum';
import { ChevronRight, ArrowLeft, Lightbulb, PlayCircle } from 'lucide-react';
import { cn } from '../utils';

const videoLinks: Record<number, string[]> = {
  1: ["https://hx.nobook.com/console/templates/resource/2919_6d6d55edf461f7a00a8d989f32954392"],
  2: ["https://hx.nobook.com/console/templates/resource/400_53fd74a6a1d676d800fc9e969665561e"],
  3: ["https://hx.nobook.com/console/templates/resource/346_9c60050ed03324f9b0e43359d540e0cd"],
  4: ["https://hx.nobook.com/console/templates/resource/369_cfe6cf3532d495497864eda15203350d"],
  5: [
    "https://hx.nobook.com/console/templates/resource/405_67af80896b5a072c5a70a442de87e410", 
    "https://hx.nobook.com/console/templates/resource/2998_51847e2d-245f-4f0b-87b5-69f75983484e", 
    "https://hx.nobook.com/console/templates/resource/2632_16065dedfcd602a575985ea418c38083"
  ],
  6: ["https://hx.nobook.com/console/templates/resource/460_21aad64f4fe6aff318e62276e627546a"],
  7: [
    "https://hx.nobook.com/console/templates/resource/2982_3a7859da-fe86-4be3-95cd-2b70f395f71d",
    "https://hx.nobook.com/console/templates/resource/474_a23a286082cd4bfd3bb3ee3668eacbab"
  ],
  8: ["https://hx.nobook.com/console/templates/resource/345_fea282c2371e9cb3ac8a5e8584303ca8",
    "https://hx.nobook.com/console/templates/resource/3074_e86a743e-99d0-4927-bad6-354b39ba449d"
  ],
  9: ["https://hx.nobook.com/console/templates/resource/3075_54e45645-6a33-4cbb-b30e-6a05a0b70f93",
    "https://www.olabs.edu.in/?sub=73&brch=3&sim=120&cnt=4"
  ],
  10: ["https://hx.nobook.com/console/templates/resource/393_62ce5692ddc91a31924528a38e1efb22",
    "https://hx.nobook.com/console/templates/resource/502_33fe65025a8d09bf3626b73a1b9abda2"
  ],
  11: ["https://hx.nobook.com/console/templates/resource/3264_b5d925f5-bd5c-4862-9904-7be33d98f350"],
  12: ["https://www.youtube.com/watch?v=Ksz1ofGgr2o"],
  13: ["https://www.youtube.com/watch?v=yb7-XvdCDrs"],
  14: ["https://www.youtube.com/watch?v=9-4uEDAZXDI"],
  15: ["https://hx.nobook.com/console/templates/resource/421_2d606c667b6e8f2ff0d0ed8e2e94d31c"],
};

export default function Lecture() {
  const { week } = useParams();
  const navigate = useNavigate();
  const weekNum = parseInt(week || "1");
  
  // Find data
  const moduleData = curriculum.find(m => m.week === weekNum);
  const lectureData = lectures.find(l => l.week === weekNum) || {
    title: moduleData?.title,
    content: `# ${moduleData?.topic}\n\nБұл тақырыпта ${moduleData?.description} Осы бөлімде толық және нақты ғылыми мағлұматтар беріледі. Химиялық қасиеттері мен физикалық сипаттарын тереңірек қарастырамыз.`,
    exercises: Array.from({length: 6}).map((_, i) => ({
      q: `Осы ${moduleData?.title} тақырыбына байланысты тест сұрағы #${i+1}?`,
      a: `Жауабы #${i+1}: Бұл химиялық реакциялар мен физикалық заңдылықтарға сүйене отырып шешіледі.`
    }))
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full overflow-y-auto custom-scrollbar pb-24">
      <button 
        onClick={() => navigate('/')}
        className="self-start flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft size={16} /> <span>Артқа қайту</span>
      </button>

      <div className="sleek-panel p-8 rounded-3xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full"></div>
         <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs">Апта {weekNum}</span>
         <h1 className="title-sleek text-4xl mt-2 mb-6 text-white">{lectureData.title}</h1>
         
         <div className="prose prose-invert prose-cyan max-w-none prose-headings:title-sleek prose-headings:tracking-wider">
            <p className="text-slate-300 leading-relaxed mb-6 text-lg">
               {lectureData.content}
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              {videoLinks[weekNum]?.map((link, idx) => (
                <a 
                  key={idx}
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  <PlayCircle size={20} />
                  {videoLinks[weekNum].length > 1 ? `Виртуалды зертхана ${idx + 1}` : 'Виртуалды зертхана'}
                </a>
              ))}
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="title-sleek text-2xl text-white flex items-center gap-2">
          <Lightbulb className="text-pink-400" />
          Тақырыптық Есептер мен Сұрақтар
        </h2>
        {lectureData.exercises.map((ex, index) => (
          <ExerciseCard key={index} question={ex.q} answer={ex.a} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({ question, answer, index }: { question: string, answer: string, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sleek-panel rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
      <div className="p-5 flex justify-between items-center cursor-pointer bg-black/40" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
            {index}
          </div>
          <span className="text-slate-200 font-medium">{question}</span>
        </div>
        <button className={cn("transition-transform duration-300", isOpen ? "rotate-90 text-cyan-400" : "text-slate-500")}>
          <ChevronRight />
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-white/5 bg-gradient-to-br from-black to-slate-900/50 text-slate-300 border-l-4 border-l-pink-500">
              <div className="text-[10px] uppercase font-bold text-pink-400 tracking-widest mb-2">Шешімі / Жауабы</div>
              <p className="leading-relaxed font-mono text-sm">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
