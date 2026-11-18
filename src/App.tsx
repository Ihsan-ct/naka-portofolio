import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Volume2,
  VolumeX,
  Cpu, 
  Layers, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Box, 
  Activity, 
  ChevronRight, 
  Flame, 
  Sparkles,
  ExternalLink,
  Shield,
  Database,
  Grid,
  Lock,
  GitBranch,
} from 'lucide-react';
import NetcodeSimulator from './NetcodeSimulator';
import LuauToolSuite from './LuauToolSuite';
import { soundFX } from './audio';
import { RobloxProfileCard } from './RobloxProfileCard';
import Track3DViewer from './Track3DViewer';

type ProjectFilterType = 'all' | 'roblox' | '3d' | 'web';

export default function App() {
  const [projectFilter, setProjectFilter] = useState<ProjectFilterType>('all');
  const [isMuted, setIsMuted] = useState(soundFX.isMuted());

  useEffect(() => {
    return soundFX.subscribe((m) => setIsMuted(m));
  }, []);

  const filterTabs: Array<{ id: ProjectFilterType; label: string }> = [
    { id: 'all', label: 'All Modules' },
    { id: 'roblox', label: 'Roblox Systems' },
    { id: '3d', label: '3D & World' },
    { id: 'web', label: 'Web & Tools' },
  ];

  const metrics = [
    { id: '01', label: 'MODULAR LUAU SCRIPTS', value: '98+ Files', detail: 'Rojo 7.7.1 DataModel Sync', status: 'SYNCD' },
    { id: '02', label: 'PHYSICS & RENDER BUDGET', value: '60 FPS', detail: 'Zero Frame Drop Mobile Target', status: 'LOCKED' },
    { id: '03', label: 'AUTOMATED CONTRACT SPECS', value: '30/31 Pass', detail: 'ArchitectureSpec & SmokeSpec', status: 'VERIFIED' },
    { id: '04', label: 'NETCODE DEFENSE', value: 'Zero Trust', detail: 'Server-Authoritative Anti-Exploit', status: 'ARMED' },
  ];

  const projects = [
    {
      title: 'kit naka gratis (Comprehensive Game Framework)',
      badge: 'Universe 10764643598 • Flagship Core',
      icon: Gamepad2, gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      tag: 'roblox',
      category: 'Roblox Engine / Core Architecture',
      description: 'Framework modular full-stack Luau (98+ script) untuk game skala produksi. Dilengkapi Rojo 7.7.1 pipeline, automated contract test suite (30/31 passing), ProfileStore, dan integrasi TopbarPlus v3.4.0.',
      features: ['98+ Modular Luau Scripts', '30/31 Passing Contract Tests', 'Rojo 7.7.1 DataModel Sync'],
      tech: ['Luau Strict', 'Rojo 7.7.1', 'ProfileStore', 'TopbarPlus v3.4.0']
    },
    {
      title: 'Rintangan Naka (Competitive Obby & Racing Engine)',
      badge: 'Universe 10775972892 • Competitive Engine',
      icon: Flame, gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
      tag: 'roblox',
      category: 'Roblox Gameplay & Physics',
      description: 'Sistem balap kompetitif terverifikasi server: checkpoint sequence tracking anti-skip, dynamic race HUD, server-authoritative timer ms, dan replay state recorder.',
      features: ['Server checkpoint validation', 'Sub-millisecond timer logic', 'Dynamic spectator & race UI'],
      tech: ['Luau Strict', 'CollectionService', 'RunService', 'TweenService']
    },
    {
      title: 'Pesta Naka (Social Party Arena & Realtime Sync)',
      badge: 'Universe 10777142594 • Backend Pipeline',
      icon: Activity, gradient: 'from-violet-500/20 via-indigo-500/10 to-transparent',
      tag: 'roblox',
      category: 'Backend & Distributed DataStore',
      description: 'Infrastruktur backend leaderboard summit obby dan speedrun global. Menggunakan OrderedDataStore dengan rate-limit debounce, retry exponential backoff, dan instant ranking sync.',
      features: ['OrderedDataStore ranking pipeline', 'Auto-recovery write debounce', 'Cross-server podium replication'],
      tech: ['DataStoreService', 'OrderedDataStore', 'pcall Resilience']
    },
    {
      title: 'NAKA Satchel Hotbar & Spatial 3D Ui Suite',
      icon: Layers, gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      tag: 'roblox',
      category: 'Client UX & Spatial Systems',
      description: 'Sistem hotbar kustom responsif mobile/desktop pengganti default inventory Roblox. Terintegrasi TopbarPlus v3.4.0, spatial 3D nameplates, dan UI culling off-screen berkinerja tinggi.',
      features: ['Dynamic slot pooling & keybinding', 'Mobile touch & gamepad support', 'Spatial distance UI culling'],
      tech: ['ContextActionService', 'UserInputService', 'TopbarPlus v3.4.0'],
      badge: 'Client UX'
    },
    {
      title: 'Saweria Monetization & Roblox License Gateway',
      icon: Zap, gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
      tag: 'web',
      category: 'API Integration & License Engine',
      description: 'Gateway integrasi donasi Saweria dan validasi lisensi modul Roblox secara real-time. Memvalidasi webhook server-to-server dan mendistribusikan in-game perk seketika tanpa restart server.',
      features: ['Server webhook transaction bridge', 'Encrypted license token validator', 'Zero-downtime perk injection'],
      tech: ['Node.js', 'Express', 'HttpService', 'Roblox Open Cloud'],
      badge: 'Payment Gateway'
    },
    {
      title: 'Workspace.PULAU 3D Master Suite (summit, bc, CPEnergy)',
      badge: 'Authentic 3D Models - Live Viewport',
      icon: Box, gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent', actionLink: '#viewport3d', actionLabel: 'Buka di 3D Viewport',
      tag: '3d',
      category: 'Blender 3D & Technical Level Design',
      description: 'Level track jalan raya modular (v4 & v5 clean) dan summit mountain obby. Didesain dengan snapped vertex alignment, zero-gap topology, optimized collision geometry, dan custom PBR material.',
      features: ['Grid-snapped modular track kit', 'Collision mesh optimization', 'Custom lighting & skybox presets'],
      tech: ['Blender 4.x', 'Modular Snapping', 'FBX Pipeline', 'Roblox Lighting']
    }
  ];

  const filteredProjects = projectFilter === 'all' 
    ? projects 
    : projects.filter(p => p.tag === projectFilter);


  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* Telemetry Streamer Ribbon */}
      <div className="w-full bg-[#070b14] border-b border-cyan-500/20 px-4 py-1.5 text-[10px] font-mono text-slate-400 flex items-center justify-between tracking-wide select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYS.STATUS: ONLINE
          </span>
          <span className="text-slate-700">/</span>
          <span className="text-cyan-300">ENGINE: ROBLOX / LUAU STRICT (--!strict)</span>
          <span className="text-slate-700 hidden sm:inline">/</span>
          <span className="text-slate-300 hidden sm:inline">ROJO PIPELINE: v7.7.1</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-slate-400">TARGET: 60 FPS LOCKED</span>
          <span className="text-slate-700">/</span>
          <span className="text-indigo-400 font-semibold">SECURITY: ZERO-TRUST SERVER AUTH</span>
        </div>
      </div>

      {/* Background Ambience & Technical Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-tech-grid opacity-70" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-tech-dots opacity-40" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.08),transparent_50%)]" />


      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12 space-y-20 md:space-y-28">

        {/* Top Navbar */}
        <header className="hud-panel flex items-center justify-between p-3.5 sm:p-4 rounded-2xl sticky top-4 z-50 shadow-2xl border border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center font-hud font-black text-slate-950 shadow-lg shadow-cyan-500/25 text-xl tracking-wider">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-hud font-bold tracking-wider text-white text-base">Naka.dev</span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Creator of Kit Naka• Luau Architect</p>
            </div>
          </div>


          <div className="flex items-center gap-3 md:gap-5 text-xs font-mono">
            <a href="#profile" className="text-slate-400 hover:text-cyan-300 transition-colors hidden lg:inline"><span className="text-cyan-500">01.</span> Profile</a>
            <a href="#viewport3d" className="text-slate-400 hover:text-cyan-300 transition-colors hidden sm:inline"><span className="text-cyan-500">02.</span> 3D Viewport</a>
            <a href="#simulator" className="text-slate-400 hover:text-cyan-300 transition-colors hidden md:inline"><span className="text-cyan-500">03.</span> Netcode</a>
            <a href="#tools" className="text-slate-400 hover:text-cyan-300 transition-colors hidden lg:inline"><span className="text-cyan-500">04.</span> Workbench</a>
            <a href="#architecture" className="text-slate-400 hover:text-cyan-300 transition-colors hidden md:inline"><span className="text-cyan-500">05.</span> Blueprint</a>
            <a href="#projects" className="text-slate-400 hover:text-cyan-300 transition-colors hidden sm:inline"><span className="text-cyan-500">06.</span> Projects</a>
            <a href="#stack" className="text-slate-400 hover:text-cyan-300 transition-colors hidden xl:inline"><span className="text-cyan-500">07.</span> Stack</a>

            <button
              onClick={() => soundFX.toggleMute()}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
              title={isMuted ? "Unmute Procedural Audio" : "Mute Procedural Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>


            <a 
              href="#contact" 
              className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-hud font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Let's Cook</span>
            </a>
          </div>
        </header>


        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 border-b border-cyan-950/60 overflow-hidden">
          <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Mission Briefing */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-inner">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold tracking-wider">[ SYSTEM ONLINE ]</span>
                  <span className="text-slate-500">//</span>
                  <span className="text-slate-300">LUAU ARCHITECT &amp; HIGH-SCALE NETCODE</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-hud tracking-tight text-white leading-[1.08]">
                    Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 glow-cyan-text">Ultra-Low Latency</span> Netcode &amp; Distributed Systems.
                  </h1>
                  <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                    Architecting competitive Roblox infrastructure since 2021. Specializing in 60Hz client-side prediction, strict Luau bit-packed buffers, zero-jitter rollback replication, and scalable spatial grid partitioning.
                  </p>
                </div>


                {/* Operator Credentials / Links */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#projects"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Inspect Modules</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <a
                    href="#three-d"
                    className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-cyan-300 font-hud font-bold text-xs uppercase tracking-wider border border-cyan-900/60 hover:border-cyan-500/60 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Box className="w-4 h-4 text-cyan-400" />
                    <span>3D Viewport</span>
                  </a>


                  <a
                    href="https://www.roblox.com/users/8824812500/profile"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-hud font-semibold text-xs tracking-wider border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Roblox Profile</span>
                  </a>


                  <a
                    href="https://saweria.co/Isanct"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-hud font-semibold text-xs tracking-wider border border-amber-500/30 hover:border-amber-500/50 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Saweria Tip</span>
                  </a>
                </div>

                {/* Telemetry Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {metrics.map((m) => (
                    <div
                      key={m.id}
                      className="hud-panel p-3.5 rounded-xl border border-cyan-950/70 hover:border-cyan-500/40 transition-colors group relative overflow-hidden"
                    >
                      <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider flex items-center justify-between">
                        <span>{m.id} // {m.status}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold font-hud text-white mt-1 group-hover:text-cyan-300 transition-colors">
                        {m.value}
                      </div>
                      <div className="text-xs font-semibold text-slate-300 mt-0.5">
                        {m.label}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {m.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Roblox Operator Dossier */}
              <div className="lg:col-span-5 flex justify-center">
                <RobloxProfileCard />
              </div>

            </div>
          </div>
        </section>


        {/* SECTION 01: 3D VIEWPORT */}
        <section id="three-d" className="py-20 border-b border-cyan-950/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>[ 01 // SPATIAL ARCHITECTURE ]</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-hud text-white mt-1">
                  Authenticated 3D Island Clusters
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl">
                  Real GLB models exported from actual Roblox Studio builds. Interactive WebGL viewport with live camera orbit, wireframe mode, and mesh diagnostics.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-950">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>3 MESH INSTANCES / PROCEDURAL SHADERS</span>
              </div>
            </div>

            <Track3DViewer />
          </div>
        </section>

        {/* SECTION 02: NETCODE SIMULATOR */}
        <section id="simulator" className="py-20 border-b border-cyan-950/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[ 02 // NETCODE PROTOCOL ]</span>
                </div>
                <h2 className="font-hud text-2xl sm:text-3xl font-black text-white mt-1">
                  Predictive Rollback vs Naive Replication
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl">
                  Interactive real-time packet simulator. Observe how client-side prediction and history buffer reconciliation eliminate perceived network jitter even at 250ms+ ping.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-950">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>60 HZ INTERPOLATION ENGINE</span>
              </div>
            </div>

            <NetcodeSimulator />
          </div>
        </section>


        {/* SECTION 03: LUAU WORKBENCH */}
        <section id="tools" className="py-20 border-b border-cyan-950/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[ 03 // SYSTEMS WORKBENCH ]</span>
                </div>
                <h2 className="font-hud text-2xl sm:text-3xl font-black text-white mt-1">
                  Strict Luau Buffer &amp; Memory Analyzer
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl">
                  Benchmark native Luau buffer allocations vs standard table serialization. Zero GC overhead, bit-packed vectors, and real-time bandwidth reduction calculations.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-950">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>TYPE-SAFE LUAU (--!strict)</span>
              </div>
            </div>

            <LuauToolSuite />
          </div>
        </section>

        {/* SECTION 04: ARCHITECTURE BLUEPRINTS */}
        <section id="architecture" className="py-20 border-b border-cyan-950/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>[ 04 // BLUEPRINTS ]</span>
              </div>
              <h2 className="font-hud text-2xl sm:text-3xl font-black text-white mt-1">
                Core Architectural Directives
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Fundamental paradigms implemented across enterprise-grade Roblox experiences to guarantee high concurrency and anti-exploit resilience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="hud-card-accent p-6 rounded-2xl border border-cyan-950/80 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/40">
                    [ DIRECTIVE 01: BIT-PACKED BUFFERS ]
                  </span>
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold font-hud text-white group-hover:text-cyan-300 transition-colors">
                  Luau Native Buffer Serialization
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Eliminates generic JSON and table overhead over RemoteEvents. Uses fixed-width 16-bit float quantization for coordinates, 8-bit rotators, and bitmask flags, cutting remote payload bandwidth by 82%.
                </p>
                <div className="mt-4 pt-4 border-t border-cyan-950/60 flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="text-cyan-400">&gt;</span> buffer.create(16)
                  <span className="text-cyan-400">&gt;</span> buffer.writeu8()
                  <span className="text-cyan-400">&gt;</span> buffer.writei16()
                </div>
              </div>

              <div className="hud-card-accent p-6 rounded-2xl border border-cyan-950/80 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/40">
                    [ DIRECTIVE 02: CLIENT PREDICTION ]
                  </span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>

                <h3 className="text-lg font-bold font-hud text-white group-hover:text-cyan-300 transition-colors">
                  Deterministic Rollback &amp; Reconciliation
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Clients simulate movement and actions instantaneously at local 60 FPS while tagging inputs with sequence numbers. On receiving authoritative server state snapshots, the client rewinds and fast-forwards missing frames without rubber-banding.
                </p>
                <div className="mt-4 pt-4 border-t border-cyan-950/60 flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="text-cyan-400">&gt;</span> 64-frame ring buffer
                  <span className="text-cyan-400">&gt;</span> Hermite spline interpolation
                </div>
              </div>

              <div className="hud-card-accent p-6 rounded-2xl border border-cyan-950/80 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/40">
                    [ DIRECTIVE 03: SPATIAL PARTITIONING ]
                  </span>
                  <Grid className="w-4 h-4 text-cyan-400" />
                </div>

                <h3 className="text-lg font-bold font-hud text-white group-hover:text-cyan-300 transition-colors">
                  Sparse Hash Grid &amp; Network Culling
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Dynamic world grid partitioning (128x128 stud cells) using spatial hashing. Entities only replicate state updates to clients residing within active frustum and interest radius, keeping network traffic minimal even in massive 100+ player places.
                </p>
                <div className="mt-4 pt-4 border-t border-cyan-950/60 flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="text-cyan-400">&gt;</span> O(1) cell lookup
                  <span className="text-cyan-400">&gt;</span> Interest radius filtering
                </div>
              </div>


              <div className="hud-card-accent p-6 rounded-2xl border border-cyan-950/80 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/40">
                    [ DIRECTIVE 04: STRICT LUAU &amp; GUARDS ]
                  </span>
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>

                <h3 className="text-lg font-bold font-hud text-white group-hover:text-cyan-300 transition-colors">
                  Server-Authoritative Anti-Tamper Protocol
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Never trust client inputs. Server enforces delta-time checks, physical raycast validation, cooldown timestamps, and buffer boundary assertion. Compile-time --!strict typing prevents runtime crashes.
                </p>
                <div className="mt-4 pt-4 border-t border-cyan-950/60 flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="text-cyan-400">&gt;</span> Typecheck guards
                  <span className="text-cyan-400">&gt;</span> Timestamp rate limiters
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: PRODUCTION PROJECTS */}
        <section id="projects" className="py-20 border-b border-cyan-950/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[ 05 // SYSTEM MODULES ]</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-hud text-white mt-1">
                  Engine Modules & Production Systems
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl">
                  Battle-tested Luau modules and physical architecture engineered for extreme reliability and high player concurrency.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundFX.playClick();
                      setProjectFilter(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-hud font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      projectFilter === tab.id
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                        : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-cyan-950 hover:border-cyan-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p, idx) => (
                <div
                  key={idx}
                  className="hud-card-accent p-6 rounded-2xl border border-cyan-950/80 relative flex flex-col justify-between group"
                >
                  <div className="tech-bracket top-2 left-2" />
                  <div className="tech-bracket bottom-2 right-2" />

                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-mono">
                      <span className="text-cyan-400/90 font-bold">{p.badge}</span>
                      <span className="text-slate-500 text-[10px] uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {p.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-hud text-white group-hover:text-cyan-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="mt-4 space-y-1.5">
                      {p.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                          <span className="text-cyan-400 font-bold">&gt;</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-cyan-950/60 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 06: ENGINE MATRIX */}
        <section id="stack" className="py-20 border-b border-cyan-950/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>[ 06 // ENGINE MATRIX ]</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-hud text-white mt-1">
                Technical Capabilities & Toolchain
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Integrated development workflow spanning low-level Luau algorithms, modern toolchains, and profiling instrumentation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="hud-panel p-5 rounded-xl border border-cyan-950/80">
                <div className="text-xs font-mono text-cyan-400 uppercase mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>Languages & Engine</span>
                </div>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-center justify-between"><span>Luau (--!strict)</span><span className="text-cyan-400">Mastery</span></li>
                  <li className="flex items-center justify-between"><span>TypeScript (roblox-ts)</span><span className="text-slate-400">Advanced</span></li>
                  <li className="flex items-center justify-between"><span>Roblox Studio API</span><span className="text-cyan-400">Mastery</span></li>
                  <li className="flex items-center justify-between"><span>Node.js / tooling</span><span className="text-slate-400">Proficient</span></li>
                  <li className="flex items-center justify-between"><span>GLSL / Shaders</span><span className="text-slate-400">Intermediate</span></li>
                </ul>
              </div>
              <div className="hud-panel p-5 rounded-xl border border-cyan-950/80">
                <div className="text-xs font-mono text-cyan-400 uppercase mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Networking & Physics</span>
                </div>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-center justify-between"><span>Client Prediction</span><span className="text-cyan-400">Production</span></li>
                  <li className="flex items-center justify-between"><span>Rollback Reconciliation</span><span className="text-cyan-400">Production</span></li>
                  <li className="flex items-center justify-between"><span>Bit-Packing Buffers</span><span className="text-cyan-400">Production</span></li>
                  <li className="flex items-center justify-between"><span>Spatial Hash Grids</span><span className="text-cyan-400">Production</span></li>
                  <li className="flex items-center justify-between"><span>Delta Compression</span><span className="text-slate-400">Production</span></li>
                </ul>
              </div>

              <div className="hud-panel p-5 rounded-xl border border-cyan-950/80">
                <div className="text-xs font-mono text-cyan-400 uppercase mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Tooling & Pipeline</span>
                </div>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-center justify-between"><span>Rojo 7.x</span><span className="text-cyan-400">Workflow</span></li>
                  <li className="flex items-center justify-between"><span>Wally / Pesde</span><span className="text-cyan-400">Workflow</span></li>
                  <li className="flex items-center justify-between"><span>Selene & StyLua</span><span className="text-cyan-400">CI/CD</span></li>
                  <li className="flex items-center justify-between"><span>Blender 4.x (glTF/GLB)</span><span className="text-slate-400">Pipeline</span></li>
                  <li className="flex items-center justify-between"><span>Git / GitHub Actions</span><span className="text-cyan-400">Standard</span></li>
                </ul>
              </div>

              <div className="hud-panel p-5 rounded-xl border border-cyan-950/80">
                <div className="text-xs font-mono text-cyan-400 uppercase mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Profiling & Security</span>
                </div>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-center justify-between"><span>MicroProfiler</span><span className="text-cyan-400">Diagnostic</span></li>
                  <li className="flex items-center justify-between"><span>Luau ScriptProfiler</span><span className="text-cyan-400">Diagnostic</span></li>
                  <li className="flex items-center justify-between"><span>Memory Breakdown</span><span className="text-cyan-400">Diagnostic</span></li>
                  <li className="flex items-center justify-between"><span>Server Anti-Tamper</span><span className="text-cyan-400">Hardened</span></li>
                  <li className="flex items-center justify-between"><span>Rate Limiting & Bounds</span><span className="text-cyan-400">Hardened</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 07: DIRECT TRANSMISSION TERMINAL */}
        <section id="contact" className="py-20 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hud-panel p-8 sm:p-12 rounded-3xl border border-cyan-900/60 relative overflow-hidden">
              <div className="tech-bracket top-3 left-3" />
              <div className="tech-bracket bottom-3 right-3" />

              <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[ TRANSMISSION LINK READY ]</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black font-hud text-white">
                  Initiate Comms with Naka.dev
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed">
                  Available for technical direction, high-scale netcode architecture, Luau buffer optimizations, and competitive Roblox game development.
                </p>

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <a
                    href="https://www.roblox.com/users/8824812500/profile"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Roblox: Sankiyowo07</span>
                  </a>
                  <a
                    href="https://saweria.co/Isanct"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-hud font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Saweria Support</span>
                  </a>

                  <a
                    href="https://github.com/Ihsan-ct"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-hud font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <GitBranch className="w-4 h-4 text-cyan-400" />
                    <span>GitHub: Ihsan-ct</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TACTICAL FOOTER */}
        <footer className="border-t border-cyan-950/80 bg-[#04060a] py-8 text-xs font-mono text-slate-500 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-hud font-bold text-sm tracking-wider">Naka.dev</span>
              <span>//</span>
              <span>LUAU SYSTEMS ARCHITECT</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span>LATENCY: 12ms</span>
              <span>MEMORY: 42MB</span>
              <span className="text-cyan-400">ROJO 7.7.1</span>
            </div>

            <div>
              &copy; {new Date().getFullYear()} Naka Matri Wijaya. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

