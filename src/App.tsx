import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Volume2,
  VolumeX,
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
  Workflow,
  Sparkles,
  Eye,
  X,
  Maximize2
} from 'lucide-react';
import NetcodeSimulator from './NetcodeSimulator';
import LuauToolSuite from './LuauToolSuite';
import { soundFX } from './audio';
import { Award } from 'lucide-react';
import { RobloxProfileCard } from './RobloxProfileCard';
import { masterIslandShots, type IslandShot } from './MasterIslandsData';
import Track3DViewer from './Track3DViewer';

function GithubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const summitShots: IslandShot[] = masterIslandShots;

export default function App() {
  const [islandFilter, setIslandFilter] = useState<'all' | 'summit' | 'bc' | 'CPEnergy'>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [activeTab, setActiveTab] = useState<'luau' | 'hitbox' | 'blender'>('luau');
  const [projectFilter, setProjectFilter] = useState<'all' | 'roblox' | '3d' | 'web'>('all');
  const [isMuted, setIsMuted] = useState(soundFX.isMuted());
  const [selectedShot, setSelectedShot] = useState<string | null>(null);
  const [shotTitle, setShotTitle] = useState<string>('');
  const [shotDesc, setShotDesc] = useState<string>('');

  useEffect(() => {
    return soundFX.subscribe((m) => setIsMuted(m));
  }, []);

  const copyToClipboard = (text: string, type: 'email' | 'discord') => {
    soundFX.playSuccess();
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
    { label: 'Modular Luau Scripts', value: '98+ Files', detail: 'Rojo 7.7.1 DataModel sync pipeline' },
    { label: 'Physics & Render Target', value: '60 FPS', detail: 'Zero frame drop on low-end mobile' },
    { label: 'Automated Test Specs', value: '30/31 Pass', detail: 'ArchitectureSpec & RuntimeSmokeSpec' },
    { label: 'Architecture Security', value: 'Zero Trust', detail: 'Server-authoritative anti-exploit' },
  ];

  const codeSnippets = {
    luau: `--!strict
-- =======================================================================
-- [SECURITY NOTICE: PRODUCTION DATASTORE KEYS & RATE CONTROLS REDACTED]
-- Author: Sankiyowo07 (Naka Matri Wijaya)
-- =======================================================================
local ServerStorage = game:GetService("ServerStorage")
local modules = ServerStorage:WaitForChild("NakaStudio"):WaitForChild("Modules")
local Config = require(modules:WaitForChild("CoreGameConfig"))
local Runner = require(modules:WaitForChild("OrderedLeaderboardRunner"))
local boardModel = workspace:WaitForChild("NakaStudio"):WaitForChild("Leaderboard"):WaitForChild("RaceWinners"):WaitForChild("Board")

local runner = Runner.new({
	board = boardModel,
	dataStoreName = Config.DataStore.RaceWinsLeaderboardName,
	logPrefix = "RaceWinsLeaderboard",
	ascending = false,
	startupDelay = 8,
	formatValue = function(value)
		return string.format("%d WIN", math.max(0, math.floor(tonumber(value) or 0)))
	end,
	filterEntry = function(entry)
		return (tonumber(entry.value) or 0) > 0
	end,
	settings = {
		MaxPlayers=20, UpdateInterval=60, EnableAnimations=true, AnimateTopN=10,
		BatchSize=10, BatchDelay=0.05, TweenCleanupInterval=120, FetchCount=80,
		DataStoreRetryCount=3, DataStoreRetryDelay=3,
		ExcludedUserIds={}, ExcludedUsernames={},
	},
})
game:BindToClose(function() runner:destroy() end)
runner:start()`,
    hitbox: `--!strict
-- =======================================================================
-- [SECURITY NOTICE: CONTRACT TEST RUNNER & BOUNDARY SPEC]
-- Author: Sankiyowo07 (Naka Matri Wijaya)
-- =======================================================================
local tests = {}
local function test(name, callback) table.insert(tests, {name=name, run=callback}) end
local function expect(condition, message) if not condition then error(message, 2) end end

test("DataStore modules are server-only", function()
	expect(game.ServerStorage.NakaStudio.Modules:FindFirstChild("ProfileStore") ~= nil, "ProfileStore missing server-side")
	expect(game.ServerStorage.NakaStudio.Modules:FindFirstChild("SafeDataStore") ~= nil, "SafeDataStore missing server-side")
	expect(game.ReplicatedStorage:FindFirstChild("ProfileStore", true) == nil, "ProfileStore leaked to client")
	expect(game.ReplicatedStorage:FindFirstChild("SafeDataStore", true) == nil, "SafeDataStore leaked to client")
end)

-- [NAKA 20261031] Tes lama "Kit admin uses System Health without duplicate moderation" ditulis ulang:
-- tab Health + InfoRow header DIHAPUS permanen (keputusan user, restyle AdminPanel — lihat Memory adminpanel_restyle).
-- Sisa kontrak lama (tanpa Adonis/duplikat moderasi) tetap dijaga di sini.
test("AdminPanel has no dead tabs", function()
	local admin = game.StarterGui.AdminPanel
	expect(admin.MainFrame.Selection:FindFirstChild("Health") == nil, "dead Health tab remains")
	expect(admin.MainFrame.Header:FindFirstChild("InfoRow") == nil, "dead InfoRow remains")
	expect(admin.MainFrame.Selection:FindFirstChild("Adonis") == nil, "Adonis tab remains")
	expect(admin.AdminModules:FindFirstChild("ModerationClient") == nil, "duplicate moderation client remains")
	expect(admin.AdminModules:FindFirstChild("HeaderInfoSync") == nil, "orphaned HeaderInfoSync remains")
	expect(game.ServerScriptService.Systems:FindFirstChild("AdminModerationServer") == nil, "duplicate moderation server remains")
end)

test("Moderation remotes are removed", function()
	local remotes=game.ReplicatedStorage.NakaStudio.Remotes.Admin
	for _, name in {"KickPlayer","BringPlayer","GotoPlayer","HealPlayer","SetTime","SetGravity"} do
		expect(remotes:FindFirstChild(name) == nil, name.." remote remains")
	end
end)

return tests`,
    blender: `--!strict
-- =======================================================================
-- [SECURITY NOTICE: PROPRIETARY KINEMATIC CHECKPOINT ENGINE SANITIZED]
-- Author: Sankiyowo07 (Naka Matri Wijaya)
-- =======================================================================
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local CheckpointManager = {}

local cpBalapFolder   = nil
local Config          = nil
local RaceState       = nil
local onChampionFinish = nil

local cachedCPParts    = {}
local cachedMaxCP       = 0
local cachedFinishPart  = nil
local cpConnections     = {}
local onLapComplete    = nil
local RaceEngineHasSlot = nil
local lastTouchData = {}

local function getNotifyRemote(): RemoteEvent?
	local rs = ReplicatedStorage:FindFirstChild("RaceRemotes")
	local notify = rs and rs:FindFirstChild("NotifyRaceNotif")
	if notify and notify:IsA("RemoteEvent") then
		return notify
	end
	return nil
end

function CheckpointManager.Init(config, raceState, folder, championCallback, lapCallback, hasChampionSlotFn)
	Config          = config
	RaceState       = raceState
	cpBalapFolder   = folder
	onChampionFinish = championCallback
	onLapComplete    = lapCallback
	RaceEngineHasSlot = hasChampionSlotFn

	-- Enforce CanTouch on all CP parts in folder at startup
	if cpBalapFolder then
		for _, child in ipairs(cpBalapFolder:GetChildren()) do
			if child:IsA("BasePart") then
				child.CanTouch = true
			elseif child:IsA("Model") then
				for _, sub in ipairs(child:GetDescendants()) do
					if sub:IsA("BasePart") then sub.CanTouch = true end
				end
			end
		end
	end
end

return CheckpointManager`
  };

  const projects = [
    {
      title: 'kit naka gratis (Comprehensive Game Framework)',
      badge: 'Universe 10764643598 • Flagship Core',
      image: '/shots/08_core_close.png',
      tag: 'roblox',
      category: 'Roblox Engine / Core Architecture',
      description: 'Framework modular full-stack Luau (98+ script) untuk game skala produksi. Dilengkapi Rojo 7.7.1 pipeline, automated contract test suite (30/31 passing), ProfileStore, dan integrasi TopbarPlus v3.4.0.',
      features: ['98+ Modular Luau Scripts', '30/31 Passing Contract Tests', 'Rojo 7.7.1 DataModel Sync'],
      tech: ['Luau Strict', 'Rojo 7.7.1', 'ProfileStore', 'TopbarPlus v3.4.0']
    },
    {
      title: 'Rintangan Naka (Competitive Obby & Racing Engine)',
      badge: 'Universe 10775972892 • Competitive Engine',
      image: '/shots/07_bridge_low.png',
      tag: 'roblox',
      category: 'Roblox Gameplay & Physics',
      description: 'Sistem balap kompetitif terverifikasi server: checkpoint sequence tracking anti-skip, dynamic race HUD, server-authoritative timer ms, dan replay state recorder.',
      features: ['Server checkpoint validation', 'Sub-millisecond timer logic', 'Dynamic spectator & race UI'],
      tech: ['Luau Strict', 'CollectionService', 'RunService', 'TweenService']
    },
    {
      title: 'Pesta Naka (Social Party Arena & Realtime Sync)',
      badge: 'Universe 10777142594 • Backend Pipeline',
      image: '/shots/01_front_iso.png',
      tag: 'roblox',
      category: 'Backend & Distributed DataStore',
      description: 'Infrastruktur backend leaderboard summit obby dan speedrun global. Menggunakan OrderedDataStore dengan rate-limit debounce, retry exponential backoff, dan instant ranking sync.',
      features: ['OrderedDataStore ranking pipeline', 'Auto-recovery write debounce', 'Cross-server podium replication'],
      tech: ['DataStoreService', 'OrderedDataStore', 'pcall Resilience']
    },
    {
      title: 'NAKA Satchel Hotbar & Spatial 3D Ui Suite',
      image: '/shots/02_back_iso.png',
      tag: 'roblox',
      category: 'Client UX & Spatial Systems',
      description: 'Sistem hotbar kustom responsif mobile/desktop pengganti default inventory Roblox. Terintegrasi TopbarPlus v3.4.0, spatial 3D nameplates, dan UI culling off-screen berkinerja tinggi.',
      features: ['Dynamic slot pooling & keybinding', 'Mobile touch & gamepad support', 'Spatial distance UI culling'],
      tech: ['ContextActionService', 'UserInputService', 'TopbarPlus v3.4.0'],
      badge: 'Client UX'
    },
    {
      title: 'Saweria Monetization & Roblox License Gateway',
      image: '/shots/04_right_iso.png',
      tag: 'web',
      category: 'API Integration & License Engine',
      description: 'Gateway integrasi donasi Saweria dan validasi lisensi modul Roblox secara real-time. Memvalidasi webhook server-to-server dan mendistribusikan in-game perk seketika tanpa restart server.',
      features: ['Server webhook transaction bridge', 'Encrypted license token validator', 'Zero-downtime perk injection'],
      tech: ['Node.js', 'Express', 'HttpService', 'Roblox Open Cloud'],
      badge: 'Payment Gateway'
    },
    {
      title: 'Workspace.PULAU 3D Master Suite (summit, bc, CPEnergy)',
      badge: 'Audited 3D Models • Level Art',
      image: '/shots/05_top.png',
      tag: '3d',
      category: 'Blender 3D & Technical Level Design',
      description: 'Level track jalan raya modular (v4 & v5 clean) dan summit mountain obby. Didesain dengan snapped vertex alignment, zero-gap topology, optimized collision geometry, dan custom PBR material.',
      features: ['Grid-snapped modular track kit', 'Collision mesh optimization', 'Custom lighting & skybox presets'],
      tech: ['Blender 4.x', 'Modular Snapping', 'FBX Pipeline', 'Roblox Lighting']
    }
  ];

  const filteredShots = islandFilter === 'all' ? masterIslandShots : masterIslandShots.filter(s => s.island === islandFilter);
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
              <p className="text-[11px] text-slate-400 font-mono">Creator of Kit Naka • Roblox Engine Architect</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs md:text-sm font-medium">
            <a href="#profile" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Profile</a>
            <a href="#viewport3d" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">3D Viewport</a>
            <a href="#simulator" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Netcode Lab</a>
            <a href="#tools" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Engine Tools</a>
            <a href="#architecture" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Arsitektur</a>
            <a href="#projects" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Project</a>
            <a href="#renders" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Renders</a>
            <a href="#stack" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:inline">Tech Stack</a>
            <button
              onClick={() => soundFX.toggleMute()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
              title={isMuted ? "Unmute Procedural Audio" : "Mute Procedural Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

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
            <span>High-Performance Luau Systems • Kit Naka Production Architecture • Procedural 3D</span>
          </div>

          <div className="space-y-5 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Meracik Arsitektur Game <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Rojo 7.7.1 & Kit Naka</span> Tanpa Kompromi.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl">
              Gw <span className="text-slate-100 font-semibold">Naka Matri Wijaya</span> (<code className="text-cyan-400 font-mono text-base">Ihsan-ct</code>). Lead Creator & Architect di balik <span className="text-white font-semibold">Kit Naka</span> - framework arsitektur modular Roblox skala produksi dengan 98+ file Luau, pipeline Rojo 7.7.1, automated contract testing (30/31 passing), dan netcode zero-trust anti-exploit.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#viewport3d"
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 3D Viewport</span>
            </a>

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
              href="https://github.com/Ihsan-ct"
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


        
        {/* Verified Roblox Creator Profile */}
        <section id="profile" className="space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <p className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Creator Verification & Live Universes</span>
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Roblox Developer Profile</h2>
          </div>
          <RobloxProfileCard />
        </section>

        {/* Interactive 3D WebGL Island Viewport */}
        <section id="viewport3d" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-4 gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                <span>Live 3D Viewport</span>
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Interactive Island Stage</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">Real-time Three.js WebGL viewport • Shaders, wireframe, & audio synthesis</p>
          </div>
          <Track3DViewer />
        </section>

        {/* Interactive Netcode Sandbox */}
        <section id="simulator" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-4 gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Live Engine Simulation</span>
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Authoritative Rollback Sandbox</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">Bandingkan visualisasi client vs snapshot server secara real-time</p>
          </div>

          <NetcodeSimulator />
        </section>

        {/* Functional Dev Workbench: Luau Buffer & Packet Studio */}
        <section id="tools" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-4 gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Interactive Dev Utilities</span>
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Luau Buffer & Bandwidth Workbench</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">Pack struct binary, generate typed module, kalkulasi tick replication budget</p>
          </div>

          <LuauToolSuite />
        </section>

        {/* Interactive Architecture & Code Blueprint */}
        <section id="architecture" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-4 gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Architecture In Action</span>
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Production Source Blueprint</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">Cuplikan arsitektur backend & test runner asli dari codebase Kit Naka</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2 mb-4"><ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" /><span>[SECURITY NOTICE: PROPRIETARY BUSINESS LOGIC & FORMULAS ARE MASKED - CONFIDENTIAL BLUEPRINTS]</span></div>
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
                  onClick={() => { soundFX.playClick(); setActiveTab('luau'); }}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    activeTab === 'luau' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  RaceLedger.luau
                </button>
                <button
                  onClick={() => { soundFX.playClick(); setActiveTab('hitbox'); }}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    activeTab === 'hitbox' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ArchitectureSpec.luau
                </button>
                <button
                  onClick={() => { soundFX.playClick(); setActiveTab('blender'); }}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    activeTab === 'blender' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SpatialRewind.luau
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
                onClick={() => { soundFX.playClick(); setProjectFilter('all'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  projectFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({projects.length})
              </button>
              <button
                onClick={() => { soundFX.playClick(); setProjectFilter('roblox'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  projectFilter === 'roblox' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Roblox Systems
              </button>
              <button
                onClick={() => { soundFX.playClick(); setProjectFilter('3d'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  projectFilter === '3d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                3D & Blender
              </button>
              <button
                onClick={() => { soundFX.playClick(); setProjectFilter('web'); }}
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
                  {p.image && (
                    <div 
                      onClick={() => {
                        soundFX.playClick();
                        setSelectedShot(p.image);
                        setShotTitle(p.title);
                        setShotDesc(p.description);
                      }}
                      className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-950 border border-slate-800/80 cursor-pointer group/img"
                    >
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover/img:opacity-50 transition-opacity" />
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-slate-900/90 border border-slate-700/60 text-[10px] font-mono text-cyan-300 flex items-center gap-1 opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <Eye className="w-3 h-3" />
                        <span>Inspect 3D Render</span>
                      </div>
                    </div>
                  )}

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

                {/* Summit Obby 12 Camera Angles Showcase */}
        <section id="renders" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800/80 pb-4 gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                <span>Blender 3D Camera Angles</span>
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Workspace.PULAU 3D Master Suite</h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">All 3 audited islands: summit, bc, CPEnergy rendered in Blender Cycles</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              <button onClick={() => { soundFX.playClick(); setIslandFilter('all'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${islandFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>All Islands (12)</button>
              <button onClick={() => { soundFX.playClick(); setIslandFilter('summit'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${islandFilter === 'summit' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>Summit Citadel (4)</button>
              <button onClick={() => { soundFX.playClick(); setIslandFilter('bc'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${islandFilter === 'bc' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>Basecamp Sci-Fi (4)</button>
              <button onClick={() => { soundFX.playClick(); setIslandFilter('CPEnergy'); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${islandFilter === 'CPEnergy' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>Checkpoint Energy (4)</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredShots.map((shot) => (
              <div
                key={shot.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedShot(shot.path);
                  setShotTitle(shot.title);
                  setShotDesc(shot.desc);
                }}
                className="group relative rounded-xl overflow-hidden bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-cyan-500/10"
              >
                <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                  <img 
                    src={shot.path} 
                    alt={shot.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2"><span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-slate-950/80 backdrop-blur-sm text-cyan-400 border border-cyan-500/30">{shot.island}</span></div>
                </div>
                <div className="p-3 bg-slate-900/90 border-t border-slate-800/80">
                  <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {shot.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {shot.polyStats}
                  </p>
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
                  <span>Three.js WebGL Engine</span></li>
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
            <p>© {new Date().getFullYear()} Naka Matri Wijaya (Ihsan-ct). Lead Creator of Kit Naka • Strict Luau Architect.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Luau • Blender 3D • React 19</span>
            </p>
          </div>
        </footer>

      </div>

      {/* Lightbox Modal */}
      {selectedShot && (
        <div 
          onClick={() => setSelectedShot(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  <span>{shotTitle}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{shotDesc}</p>
              </div>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setSelectedShot(null);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="w-full max-h-[70vh] bg-slate-950 flex items-center justify-center p-2 overflow-hidden">
              <img
                src={selectedShot}
                alt={shotTitle}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
              {summitShots.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedShot(s.path);
                    setShotTitle(s.title);
                    setShotDesc(s.desc);
                  }}
                  className={`relative w-16 h-10 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                    selectedShot === s.path 
                      ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105' 
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={s.path} alt={s.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
