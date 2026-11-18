import { Sparkles, Terminal, Shield } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-6 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>
      <div className="relative z-10 max-w-lg w-full text-center space-y-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-2xl mx-auto shadow-lg shadow-cyan-500/25">
          N
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Rebuild - Clean Slate</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Naka.dev</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Workspace di-clear total. Siap mulai ulang dari nol pakai konten dan arsitektur asli dari Roblox Studio lu.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-left text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>STATUS: WAITING_STUDIO_INPUT</span>
          </div>
          <p className="text-slate-500">// 1. Buka place di Roblox Studio</p>
          <p className="text-slate-500">// 2. MCP roblox_studio hooked and stand by</p>
          <p className="text-emerald-400 flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            <span>Semua komponen lama tersimpan aman di Git</span>
          </p>
        </div>
      </div>
    </div>
  );
}
