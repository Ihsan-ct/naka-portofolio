import { useState } from 'react';
import { 
  Gamepad2, 
  Cpu, 
  Layers, 
  Code2, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Box, 
  Activity, 
  ExternalLink, 
  Mail, 
  Copy, 
  Check, 
  ChevronRight, 
  Flame, 
  CheckCircle2,
  Workflow
} from 'lucide-react';

function GithubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function App() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [activeTab, setActiveTab] = useState<'luau' | 'hitbox' | 'blender'>('luau');
  const [projectFilter, setProjectFilter] = useState<'all' | 'roblox' | '3d' | 'web'>('all');

  const copyToClipboard = (text: string, type: 'email' | 'discord') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedDiscord(true);
      setTimeout(() => setCopiedDiscord(false), 2000);
    }
  };

  const metrics = [
    { label: 'Target Physics & Render', value: '60 FPS', detail: 'Zero frame drop on low-end mobile' },
    { label: 'Replication Latency', value: '< 20ms', detail: 'Buffer payload & packet compression' },
    { label: 'Codebase Type Safety', value: '100%', detail: '--!strict Luau architecture' },
    { label: 'Architecture Security', value: 'Zero Trust', detail: 'Server-authoritative anti-exploit' },
  ];

  const codeSnippets = {
    luau: `--!strict
-- [Vanguard Network Replication Engine]
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local NetworkEngine = {}
NetworkEngine.__index = NetworkEngine

type PacketSnapshot = {
    entityId: number,
    position: Vector3,
    velocity: Vector3,
    timestamp: number
}

function NetworkEngine.compressSnapshot(snapshot: PacketSnapshot): buffer
    local b = buffer.create(20)
    buffer.writeu32(b, 0, snapshot.entityId)
    buffer.writef32(b, 4, snapshot.position.X)
    buffer.writef32(b, 8, snapshot.position.Y)
    buffer.writef32(b, 12, snapshot.position.Z)
    buffer.writef32(b, 16, snapshot.timestamp)
    return b
end

return NetworkEngine`,
    hitbox: `--!strict
-- [Spatial Rollback & Spatial Query Hitbox]
local Workspace = game:GetService("Workspace")

local function castAuthoritativeHitbox(originCFrame: CFrame, size: Vector3, filter: {Instance}): {RaycastResult}
    local overlapParams = OverlapParams.new()
    overlapParams.FilterType = RaycastFilterType.Exclude
    overlapParams.FilterDescendantsInstances = filter
    overlapParams.MaxParts = 8
    
    local hitParts = Workspace:GetPartBoundsInBox(originCFrame, size, overlapParams)
    -- Server-side rollback confirmation logic here
    return hitParts
end`,
    blender: `# [Blender 3D Procedural Generator Pipeline]
import bpy
import bmesh

def generate_procedural_biomes(seed: int, density: float):
    # Automated Geometry Nodes modifier setup
    obj = bpy.context.active_object
    mod = obj.modifiers.new(name="ProceduralScatter", type='NODES')
    nodes = mod.node_group.nodes
    
    # Configure spatial seeds & instancing distribution
    print(f"[Pipeline] Biome seeded with {seed} at density {density}")`
  };

  const projects = [
    {
      title: 'Vanguard Multiplayer Combat Framework',
      tag: 'roblox',
      category: 'Roblox Engine / Netcode',
      description: 'Arsitektur gameplay real-time dengan lag compensation, predictive client hitboxes, dan server-authoritative validation bebas exploit.',
      features: ['Buffer network payload', '60 FPS rollback prediction', 'Component-based OOP'],
      tech: ['Luau Strict', 'Roblox Studio', 'Netcode', 'Spatial Query'],
      badge: 'Core Framework'
    },
    {
      title: 'Nexus Procedural Dungeon Generator',
      tag: 'roblox',
      category: 'Procedural Generation',
      description: 'Sistem pembuatan dungeon dinamis berbasis seed dan streaming chunk. Meminimalisir draw calls dan dynamic memory footprint.',
      features: ['Seed-based generation', 'Zero-hitch chunk loading', 'Dynamic pathfinding graph'],
      tech: ['Luau', 'StreamingEnabled', 'PathfindingService'],
      badge: 'Algorithm'
    },
    {
      title: 'Aether Stylized 3D Environment Kits',
      tag: '3d',
      category: 'Blender & Technical Art',
      description: 'Koleksi asset lingkungan modular dengan custom Geometry Nodes untuk scatter instancing otomatis dan shader material PBR ringan.',
      features: ['Geometry Nodes scattering', 'Optimized LOD & collision meshes', 'PBR Handcrafted textures'],
      tech: ['Blender 4.x', 'Geometry Nodes', 'FBX Pipeline'],
      badge: '3D Showcase'
    },
    {
      title: 'Apex Boss Encounter & AI State Machine',
      tag: 'roblox',
      category: 'Roblox Gameplay AI',
      description: 'Sistem multi-phase boss fight dengan spatial behavior trees, dynamic telegraphing arena, dan sinkronisasi animasi multiplayer.',
      features: ['Utility AI & Behavior Tree', 'Deterministic aggro routing', 'Hitbox telegraph sync'],
      tech: ['Luau Strict', 'OOP', 'Animation Controller'],
      badge: 'Gameplay AI'
    },
    {
      title: 'Studio Bridge & Live Telemetry MCP Tool',
      tag: 'web',
      category: 'Dev Tooling & Integration',
      description: 'Jalur komunikasi eksternal dua arah antara CLI toolchain dan Roblox Studio lewat WebSocket bridge untuk profiling real-time.',
      features: ['WebSocket live bridge', 'Memory heap tracker', 'Instant code hot-reload'],
      tech: ['TypeScript', 'Node.js', 'Roblox Open Cloud', 'WebSockets'],
      badge: 'Developer Tool'
    },
    {
      title: 'SkyPulse Telemetry & Data Dashboard',
      tag: 'web',
      category: 'Web Application',
      description: 'Dashboard analitik interaktif performa tinggi untuk visualisasi log metrik game-server dan telemetri data real-time.',
      features: ['Time-series charting', 'Zero lag data rendering', 'Dark mode cyber UI'],
      tech: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Recharts'],
      badge: 'Web App'
    }
  ];

  const filteredProjects = projectFilter === 'all' 
    ? projects 
    : projects.filter(p => p.tag === projectFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-24">

        {/* Top Navbar */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80 px-2 py-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20 text-lg">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">Naka.dev</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready to Ship
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Roblox Engine Architect & 3D Artist</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs md:text-sm font-medium">
            <a href="#architecture" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Arsitektur</a>
            <a href="#projects" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Project</a>
            <a href="#stack" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Tech Stack</a>
            <a 
              href="#contact" 
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all font-semibold shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Let's Cook</span>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="space-y-8 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-cyan-400 text-xs font-mono shadow-sm">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>High-Performance Luau Systems • Zero-Lag Netcode • Procedural 3D</span>
          </div>

          <div className="space-y-5 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Meracik Arsitektur Game <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Roblox & 3D Systems</span> yang Anti-Lag.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl">
              Gw <span className="text-slate-100 font-semibold">Naka Matri Wijaya</span>. Game Systems Engineer & Technical Artist. Spesialisasi dalam replikasi jaringan multiplayer, strict-type Luau, optimasi memori engine Roblox, serta pipeline prosedural Blender.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#projects"
              className="px-6 py-3.5 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all shadow-lg flex items-center gap-2 text-sm"
            >
              <span>Explore Projects</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            
            <button
              onClick={() => copyToClipboard('nakamatriwijaya@example.com', 'email')}
              className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-sm font-medium flex items-center gap-2 transition-all hover:border-slate-700"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4 text-cyan-400" />}
              <span>{copiedEmail ? 'Email Disalin!' : 'Copy Email'}</span>
            </button>

            <button
              onClick={() => copyToClipboard('naka#0001', 'discord')}
              className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 text-sm font-medium flex items-center gap-2 transition-all hover:border-slate-700"
            >
              {copiedDiscord ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{copiedDiscord ? 'Discord Disalin!' : 'Discord: naka'}</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <GithubIcon />
            </a>
          </div>

          {/* Performance Benchmark Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl md:text-3xl font-black text-cyan-400 tracking-tight font-mono">{m.value}</p>
                <p className="text-xs font-semibold text-slate-200 mt-1">{m.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{m.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Architecture & Code Blueprint */}
        <section id="architecture" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-4 gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Architecture In Action</span>
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Standar Kode Bersih & Tipe Aman</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">Bukan tutorial code - arsitektur production ready</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">system_preview.luau</span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTab('luau')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    activeTab === 'luau' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Netcode.luau
                </button>
                <button
                  onClick={() => setActiveTab('hitbox')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    activeTab === 'hitbox' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HitboxRollback.luau
                </button>
                <button
                  onClick={() => setActiveTab('blender')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    activeTab === 'blender' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  BlenderNodes.py
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="p-6 text-xs sm:text-sm font-mono overflow-x-auto text-cyan-200 leading-relaxed bg-slate-950/90">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>
        </section>

        {/* Featured Projects with Filters */}
        <section id="projects" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-4 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Showcase Portfolio</span>
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Project Pilihan</h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setProjectFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  projectFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({projects.length})
              </button>
              <button
                onClick={() => setProjectFilter('roblox')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  projectFilter === 'roblox' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Roblox Systems
              </button>
              <button
                onClick={() => setProjectFilter('3d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  projectFilter === '3d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                3D & Blender
              </button>
              <button
                onClick={() => setProjectFilter('web')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  projectFilter === 'web' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Web & Tools
              </button>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p, idx) => (
              <div 
                key={idx}
                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wide uppercase px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {p.badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/50">
                    {p.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why My Code Doesn't Lag (Architecture Principles) */}
        <section className="space-y-8">
          <div className="border-b border-slate-800/80 pb-4">
            <p className="text-xs uppercase tracking-wider font-mono font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Engineering Standards</span>
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Kenapa Game Bikinan Gw Gak Lag?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Buffer Compression</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Meninggalkan passing table JSON berat di RemoteEvents. Replikasi snapshot posisi dan combat dikompres ke format raw <code className="text-cyan-300 font-mono">buffer</code> sehingga hemat bandwidth hingga 80%.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Maid / Janitor Cleanup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anti memory leak. Setiap event listener, temporary Part, dan Tween dibungkus cleanup lifecycle otomatis. Garbage collection aman, FPS tetap flat 60 bahkan setelah berjam-jam gameplay.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Zero-Trust Authoritative</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Client cuma ngasih input intensi. Validasi cooldown, jarak hit, sanity check raycast, dan state character sepenuhnya dieksekusi di server. Exploit speed/hitbox auto mental.
              </p>
            </div>
          </div>
        </section>

        {/* Deep Tech Stack Matrix */}
        <section id="stack" className="space-y-8">
          <div className="border-b border-slate-800/80 pb-4">
            <p className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Skills & Stack</span>
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Teknologi yang Gw Pakai Sehari-hari</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Roblox & Luau */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/70 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Gamepad2 className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">Roblox & Luau Engine</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Strict Type Luau (--!strict)</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Network Replication & Netcode</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>ScriptProfiler & MicroProfiler</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Component-Based OOP</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>ProfileService & DataStore2</span>
                </li>
              </ul>
            </div>

            {/* 3D & Technical Art */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/70 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-indigo-400">
                <Box className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">3D & Procedural Art</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Blender 4.x Modeling</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Geometry Nodes Pipeline</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Procedural Scattering</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Low-Poly Topology & LODs</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>PBR Texture Baking</span>
                </li>
              </ul>
            </div>

            {/* Web & Modern UI */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/70 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-blue-400">
                <Code2 className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">Frontend & UI/UX</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>React 19 & TypeScript</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Tailwind CSS v4</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Recharts Data Visualization</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Vite Build Tooling</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Responsive Cyber Layouts</span>
                </li>
              </ul>
            </div>

            {/* Architecture & DevOps */}
            <div className="p-5 bg-slate-900/40 border border-slate-800/70 rounded-2xl space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <Workflow className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">Workflow & Integrations</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Git, GitHub & Branching</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Rojo Sync Workflows</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Roblox Open Cloud API</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>MCP Agent Tooling</span>
                </li>
                <li className="flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Client-Server Boundaries</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Contact CTA */}
        <footer id="contact" className="p-8 sm:p-12 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Collaboration & Commission
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Punya Proyek Game Impian atau Butuh Netcode Architect?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Mau bikin game Roblox kompetitif dengan combat mulus, butuh arsitektur backend Luau yang kokoh, atau mau diskusi teknis, pintu warkop selalu kebuka bray!
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 relative z-10 pt-2">
            <a
              href="mailto:nakamatriwijaya@example.com"
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Mail className="w-4 h-4" />
              <span>Email: nakamatriwijaya@example.com</span>
            </a>

            <button
              onClick={() => copyToClipboard('naka#0001', 'discord')}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold rounded-xl text-sm flex items-center gap-2 transition-all"
            >
              {copiedDiscord ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
              <span>{copiedDiscord ? 'Discord Tersalin!' : 'Copy Discord Tag'}</span>
            </button>
          </div>

          <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono relative z-10">
            <p>© {new Date().getFullYear()} Naka Matri Wijaya. Built with strict standards.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Luau • Blender 3D • React 19</span>
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
