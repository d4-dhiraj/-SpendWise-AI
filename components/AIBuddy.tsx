
import React, { useEffect, useState } from 'react';
import { Transaction, Category } from '../types';
import { getAIBuddyFeedback } from '../services/geminiService';

interface AIBuddyProps {
  transactions: Transaction[];
}

const AIBuddy: React.FC<AIBuddyProps> = ({ transactions }) => {
  const [feedback, setFeedback] = useState<string>("Analyzing your financial state... try not to flinch.");
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const calculateStats = async () => {
      setLoading(true);
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const sortedDates = Array.from(new Set(transactions.map(t => new Date(t.date).toDateString())))
        .map((d: string) => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime());

      let currentStreak = 0;
      if (transactions.length > 0) {
        const lastTxDate = new Date(transactions[0].date);
        lastTxDate.setHours(0,0,0,0);
        const diffDays = Math.floor((today.getTime() - lastTxDate.getTime()) / (1000 * 60 * 60 * 24));
        currentStreak = diffDays;
      }
      setStreak(currentStreak);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const thisWeekTxs = transactions.filter(t => new Date(t.date) > oneWeekAgo);
      const funTotal = thisWeekTxs
        .filter(t => t.category === Category.FUN)
        .reduce((sum, t) => sum + t.amount, 0);
      const totalSpent = thisWeekTxs.reduce((sum, t) => sum + t.amount, 0);

      try {
        const aiMessage = await getAIBuddyFeedback({ funTotal, totalSpent, streak: currentStreak });
        setFeedback(aiMessage);
      } catch (e) {
        setFeedback("My wisdom is currently buffered by your choices.");
      } finally {
        setLoading(false);
      }
    };

    if (transactions.length >= 0) {
      calculateStats();
    }
  }, [transactions]);

  return (
    <div className="w-full lg:w-80 h-full bg-white dark:bg-slate-900/50 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 transition-all">
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl border-2 transition-all duration-500 shadow-2xl ${
          streak >= 3 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
            : 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
        }`}>
          <i className={`fas ${streak >= 3 ? 'fa-face-grin-stars' : 'fa-face-rolling-eyes'}`}></i>
          {loading && (
            <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Balthazar</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">AI Conscience</p>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 relative shadow-sm">
        <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-100 dark:bg-slate-800 border-l border-t border-slate-200 dark:border-slate-700/50 rotate-45"></div>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
          "{feedback}"
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Financial Stats</h4>
        
        <div className="bg-white dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/30 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${streak > 0 ? 'bg-orange-500/20 text-orange-600 dark:text-orange-500' : 'bg-slate-200 dark:bg-slate-700/20 text-slate-400 dark:text-slate-600'}`}>
              <i className="fas fa-fire"></i>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Saving Streak</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{streak} Days</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-xl border text-center transition-all shadow-sm ${streak >= 5 ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-500 grayscale-0' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 grayscale'}`}>
            <i className="fas fa-shield-halved text-2xl mb-2"></i>
            <p className="text-[10px] font-black leading-tight uppercase tracking-tighter">No-Spend King</p>
          </div>
          <div className={`p-3 rounded-xl border text-center transition-all shadow-sm ${transactions.length > 20 ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 grayscale-0' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 grayscale'}`}>
            <i className="fas fa-award text-2xl mb-2"></i>
            <p className="text-[10px] font-black leading-tight uppercase tracking-tighter">Budget Master</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800/50">
        <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-tight font-medium uppercase tracking-widest">
          Balthazar is judging your <br/> next move.
        </div>
      </div>
    </div>
  );
};

export default AIBuddy;
