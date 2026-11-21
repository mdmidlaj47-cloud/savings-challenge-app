import React from 'react';
import { Trophy, Flame, Star, Award, CheckCircle2 } from 'lucide-react';

export default function CelebrationModal({ celebration, onClose }) {
  if (!celebration) return null;

  const { percent, title, subtitle } = celebration;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#14231b] to-[#0d1612] border-2 border-[#00E676] rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(0,230,118,0.35)] relative overflow-hidden">
        {/* Glowing badge icon */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#00E676]/20 border-2 border-[#00E676] flex items-center justify-center text-[#00E676] shadow-[0_0_25px_rgba(0,230,118,0.5)] animate-bounce">
          {percent === 100 ? (
            <Trophy className="w-10 h-10" />
          ) : percent >= 75 ? (
            <Flame className="w-10 h-10 text-orange-400" />
          ) : percent >= 50 ? (
            <Star className="w-10 h-10 text-yellow-400" />
          ) : (
            <Award className="w-10 h-10 text-emerald-400" />
          )}
        </div>

        <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-emerald-300 font-medium mb-5">
          {subtitle}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#00E676] text-black font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(0,230,118,0.5)] hover:bg-[#10B981] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Keep Saving!
        </button>
      </div>
    </div>
  );
}
