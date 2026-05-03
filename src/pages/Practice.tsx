import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Gem, Flame } from 'lucide-react';
import { cn } from '../utils';
import { useGameStore } from '../store';
import { practiceQuizzes } from '../data/quizzes';

// Duolingo-style path sequence
const pathNodes = [
  { id: 1, type: 'start', title: 'Оқу бастау' },
  { id: 2, type: 'lesson', title: 'Атом және Ион' },
  { id: 3, type: 'practice', title: 'Теңестіру' },
  { id: 4, type: 'chest', title: 'Сыйлық' },
  { id: 5, type: 'lesson', title: 'Қышқылдар' },
  { id: 6, type: 'lesson', title: 'Негіздер' },
  { id: 7, type: 'boss', title: 'Бақылау' },
  { id: 8, type: 'lesson', title: 'Тұздар' },
  { id: 9, type: 'practice', title: 'Тотығу' },
  { id: 10, type: 'chest', title: 'Сыйлық 2' },
  { id: 11, type: 'lesson', title: 'Сілтілік металдар' },
  { id: 12, type: 'lesson', title: 'Галогендер' },
  { id: 13, type: 'practice', title: 'Синтез' },
  { id: 14, type: 'chest', title: 'Сыйлық 3' },
  { id: 15, type: 'lesson', title: 'Металдар' },
  { id: 16, type: 'boss', title: 'Сынақ' },
  { id: 17, type: 'lesson', title: 'Бейметалдар 1' },
  { id: 18, type: 'practice', title: 'Есептер' },
  { id: 19, type: 'lesson', title: 'Бейметалдар 2' },
  { id: 20, type: 'boss', title: 'Емтихан' },
];

export default function Practice() {
  const { activePathNode, completePathNode } = useGameStore();
  const [showModal, setShowModal] = useState<{show: boolean, nodeId: number | null}>({show: false, nodeId: null});
  const [quizState, setQuizState] = useState<{ active: boolean; currentQ: number; score: number; selectedNode: number | null }>({ active: false, currentQ: 0, score: 0, selectedNode: null });

  const startQuiz = (nodeId: number) => {
    setShowModal({show: false, nodeId: null});
    setQuizState({ active: true, currentQ: 0, score: 0, selectedNode: nodeId });
  };

  const handleAnswer = (selectedIndex: number) => {
    const quizData = practiceQuizzes[quizState.selectedNode as keyof typeof practiceQuizzes] || practiceQuizzes[1];
    const isCorrect = quizData.questions[quizState.currentQ].answer === selectedIndex;
    
    setQuizState(prev => ({ ...prev, score: isCorrect ? prev.score + 1 : prev.score, currentQ: prev.currentQ + 1 }));
  };

  const closeQuiz = () => {
    const quizData = practiceQuizzes[quizState.selectedNode as keyof typeof practiceQuizzes] || practiceQuizzes[1];
    if (quizState.selectedNode && quizState.score === quizData.questions.length) {
      completePathNode(quizState.selectedNode);
    }
    setQuizState({ active: false, currentQ: 0, score: 0, selectedNode: null });
  };

  if (quizState.active && quizState.selectedNode) {
    const quizData = practiceQuizzes[quizState.selectedNode as keyof typeof practiceQuizzes] || practiceQuizzes[1];
    const isDone = quizState.currentQ >= quizData.questions.length;

    return (
      <div className="flex flex-col h-full items-center justify-center p-6 w-full max-w-2xl mx-auto">
        {!isDone ? (
          <div className="w-full bg-[#080914]/80 p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="title-sleek text-2xl text-cyan-400 mb-6">{quizData.title}: Сұрақ {quizState.currentQ + 1} / {quizData.questions.length}</h2>
            <p className="text-xl text-white font-medium mb-8 leading-relaxed">{quizData.questions[quizState.currentQ].q}</p>
            <div className="flex flex-col gap-3">
              {quizData.questions[quizState.currentQ].options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(idx)} className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-cyan-400 hover:bg-cyan-900/20 transition-all font-medium text-slate-300 hover:text-white">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full bg-[#080914]/80 p-8 rounded-3xl border border-pink-500/50 shadow-[0_0_40px_rgba(236,72,153,0.2)] text-center">
            <h2 className={cn("title-sleek text-4xl mb-4", quizState.score === quizData.questions.length ? "text-green-400" : "text-pink-400")}>
              {quizState.score === quizData.questions.length ? "Жарайсыз! Келесі сабақ ашылды!" : "Бәрін дұрыс табу керек. Қайта көріңіз!"}
            </h2>
            <p className="text-2xl text-slate-300 mb-8">Сіздің ұпайыңыз: <span className="text-cyan-400 font-bold">{quizState.score}</span> / {quizData.questions.length}</p>
            <button onClick={closeQuiz} className="px-8 py-4 rounded-xl bg-cyan-500 text-black font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors">Жалғастыру</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center relative overflow-y-auto custom-scrollbar pb-32 w-full">
      {/* Top HUD styled like Duolingo */}
      <div className="sticky top-0 w-full max-w-2xl bg-[#080914]/80 backdrop-blur-xl border border-white/10 p-4 rounded-b-3xl z-50 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-2 text-pink-500 font-bold text-lg">
          <Heart fill="currentColor" /> 5
        </div>
        <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
          <Flame fill="currentColor" /> 12
        </div>
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
          <Gem fill="currentColor" /> 1450
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6 relative max-w-md w-full">
        {pathNodes.map((node, index) => {
          // Calculate an SVG-like wavy path offset
          const offset = Math.sin(index * 0.8) * 80;
          const isCompleted = node.id < activePathNode;
          const isCurrent = node.id === activePathNode;
          
          return (
            <div key={node.id} className="relative w-full flex justify-center py-4">
              {/* Connector line behind */}
              {index < pathNodes.length - 1 && (
                <div 
                   className="absolute top-1/2 w-4 bg-slate-800 -z-10"
                   style={{
                     height: '140%',
                     left: '50%',
                     transform: `translateX(-50%)`,
                     // This is a simplified straight line. A real SVG path is better, but CSS handles it nicely.
                   }}
                />
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (node.id <= activePathNode) {
                    setShowModal({show: true, nodeId: node.id});
                  }
                }}
                className={cn(
                  "relative w-20 h-20 rounded-full border-b-8 flex items-center justify-center text-2xl font-black shadow-lg transition-transform",
                  isCompleted 
                    ? "bg-cyan-500 border-cyan-700 text-white shadow-cyan-500/50" 
                    : isCurrent 
                      ? "bg-pink-500 border-pink-700 text-white shadow-pink-500/50 animate-bounce" 
                      : "bg-slate-700 border-slate-900 text-slate-500 cursor-not-allowed"
                )}
                style={{ transform: `translateX(${offset}px)` }}
              >
                {node.type === 'chest' ? '🎁' : node.type === 'boss' ? '🏰' : '⭐'}
                
                {/* Floating Title Tooltip */}
                <div className="absolute -top-10 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] uppercase font-bold tracking-widest whitespace-nowrap border border-white/20 text-white">
                  {node.title}
                </div>
              </motion.button>
            </div>
          )
        })}
      </div>

      {showModal.show && showModal.nodeId && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-end justify-center sm:items-center">
           <div className="bg-[#080914] border-t-4 sm:border-4 border-cyan-500 w-full sm:w-96 rounded-t-3xl sm:rounded-3xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.3)]">
              {pathNodes.find(n => n.id === showModal.nodeId)?.type === 'chest' ? (
                <>
                  <h2 className="text-2xl font-black text-white mb-2">Құпия Сыйлық!</h2>
                  <p className="text-slate-400 mb-8 font-medium">Сіз сыйлық сандығын таптыңыз! Оны ашып, сыйлығыңызды алыңыз.</p>
                  
                  <button 
                    onClick={() => {
                      completePathNode(showModal.nodeId!);
                      setShowModal({show: false, nodeId: null});
                    }}
                    className="w-full py-4 rounded-xl bg-orange-500 text-black font-black uppercase tracking-widest text-lg border-b-4 border-orange-700 active:translate-y-1 active:border-b-0"
                  >
                    Ашу
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-white mb-2">Сабақты бастау!</h2>
                  <p className="text-slate-400 mb-8 font-medium">Сіз білім деңгейіңізді көтеріп, жаңа дағдыларды меңгеруге дайынсыз ба?</p>
                  
                  <button 
                    onClick={() => startQuiz(showModal.nodeId!)}
                    className="w-full py-4 rounded-xl bg-cyan-500 text-black font-black uppercase tracking-widest text-lg border-b-4 border-cyan-700 active:translate-y-1 active:border-b-0"
                  >
                    Бастау
                  </button>
                </>
              )}
              
              <button 
                onClick={() => setShowModal({show: false, nodeId: null})}
                className="w-full py-4 mt-4 rounded-xl bg-transparent text-slate-500 font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Кейін
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
