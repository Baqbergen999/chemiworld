import { create } from 'zustand';

interface GameState {
  xp: number;
  level: number;
  unlockedWeeks: number;
  addXp: (amount: number) => void;
  unlockNextWeek: () => void;
  midtermPassed: boolean;
  passMidterm: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  xp: 14500,
  level: 15,
  unlockedWeeks: 15, // Unlocked all 15 weeks for full access
  midtermPassed: true,
  
  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    const newLevel = Math.floor(newXp / 1000) + 1; // 1000 XP per level
    return { xp: newXp, level: newLevel };
  }),
  
  unlockNextWeek: () => set((state) => {
    if (state.unlockedWeeks === 8 && !state.midtermPassed) {
      return state;
    }
    return { unlockedWeeks: Math.min(15, state.unlockedWeeks + 1) };
  }),
  
  passMidterm: () => set({ midtermPassed: true })
}));
