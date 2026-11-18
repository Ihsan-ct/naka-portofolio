import { ExternalLink, Heart, UserCheck, ShieldCheck, Gamepad2 } from 'lucide-react';
import { RobloxIcon } from './RobloxIcon';

export function RobloxProfileCard() {
  return (
    <div className="hud-card-accent tech-bracket p-6 md:p-8 rounded-2xl relative overflow-hidden border border-cyan-500/30">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none select-none">
        <RobloxIcon className="w-48 h-48 text-cyan-400" />
      </div>
      <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
        {/* Avatar Frame with Radar Pulse */}
        <div className="relative shrink-0">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-400/80 bg-[#070b14] shadow-xl shadow-cyan-500/10">
            <img
              src="/roblox-avatar.png"
              alt="Sankiyowo07 Headshot"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-cyan-400 rounded-lg text-slate-950 shadow-md">
            <UserCheck className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* Dossier Content */}
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-hud text-2xl font-black text-white tracking-wide flex items-center gap-2">
              Sankiyowo07
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              UID: 8824812500
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Creator Dossier</span>
            </span>
          </div>


          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Lead Developer &amp; Luau Architect behind production experiences. Creator of <span className="text-cyan-300 font-semibold font-mono">kit naka gratis</span> (Universe 10764643598), <span className="text-cyan-300 font-semibold font-mono">Rintangan Naka</span> (10775972892), and <span className="text-cyan-300 font-semibold font-mono">Pesta Naka</span> (10777142594).
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <a
              href="https://www.roblox.com/users/8824812500/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-hud font-bold uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20"
            >
              <RobloxIcon className="w-4 h-4" />
              <span>Roblox Profile</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>

            <a
              href="https://saweria.co/Isanct"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-hud font-bold uppercase tracking-wider bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>Saweria (Isanct)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400 ml-auto">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Active Runtime: Rojo 7.7.1 DataModel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
