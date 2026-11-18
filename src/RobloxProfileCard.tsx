import { Award, ExternalLink, Heart, UserCheck } from 'lucide-react';
import { RobloxIcon } from './RobloxIcon';

export function RobloxProfileCard() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-cyan-950/30 to-slate-900/90 border border-cyan-500/40 shadow-xl shadow-cyan-500/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <RobloxIcon className="w-40 h-40 text-cyan-400" />
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
        <div className="relative">
          <img
            src="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-9E334D6031267D2B60CEE98AC40B9A89-Png/420/420/AvatarHeadshot/Webp/noFilter"
            alt="Sankiyowo07 Headshot"
            className="w-20 h-20 rounded-2xl border-2 border-cyan-400/80 bg-slate-950 shadow-lg object-cover"
          />
          <div className="absolute -bottom-1 -right-1 p-1 bg-cyan-500 rounded-full text-slate-950">
            <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-xl font-extrabold text-white tracking-tight">Sankiyowo07</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              User ID: 8824812500
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Award className="w-3 h-3" /> Verified Roblox Developer
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Lead Developer & Luau Architect behind production experiences. Creator of <span className="text-cyan-300 font-semibold">kit naka gratis</span> (Universe 10764643598), <span className="text-cyan-300 font-semibold">Rintangan Naka</span> (10775972892), and <span className="text-cyan-300 font-semibold">Pesta Naka</span> (10777142594).
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <a
              href="https://www.roblox.com/users/8824812500/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm"
            >
              <RobloxIcon className="w-3.5 h-3.5" />
              <span>Roblox Profile</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
            <a
              href="https://saweria.co/Isanct"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>Saweria (Isanct)</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
