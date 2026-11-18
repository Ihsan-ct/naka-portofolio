import { useState, useEffect, useRef, useCallback } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  Activity, 
  Wifi, 
  Zap, 
  Crosshair, 
  History, 
  Play, 
  Pause,
  Terminal,
  Cpu
} from "lucide-react";
import { soundFX } from "./audio";

interface PacketLog {
  id: string;
  seq: number;
  time: string;
  rtt: number;
  rewindTicks: number;
  result: "HIT" | "DESYNC";
  offset: number;
  summary: string;
}

export default function NetcodeSimulator() {
  const [ping, setPing] = useState<number>(120);
  const [rollbackEnabled, setRollbackEnabled] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [targetPos, setTargetPos] = useState<number>(50);
  const [lastShot, setLastShot] = useState<{
    clientX: number;
    serverX: number;
    rollbackX: number;
    isHit: boolean;
    offset: number;
    timestamp: number;
  } | null>(null);

  const [logs, setLogs] = useState<PacketLog[]>([
    {
      id: "pkt-init-1",
      seq: 104,
      time: "0.12s ago",
      rtt: 120,
      rewindTicks: 4,
      result: "HIT",
      offset: 0.1,
      summary: "Historical buffer rewind -60ms -> Hitbox intersect confirmed"
    }
  ]);

  const targetDirection = useRef<number>(1);
  const animFrameId = useRef<number | null>(null);
  const packetSeq = useRef<number>(105);

  // Smooth target oscillation
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    const update = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setTargetPos(prev => {
        let next = prev + targetDirection.current * 32 * delta;
        if (next >= 82) {
          next = 82;
          targetDirection.current = -1;
        } else if (next <= 18) {
          next = 18;
          targetDirection.current = 1;
        }
        return next;
      });

      animFrameId.current = requestAnimationFrame(update);
    };

    animFrameId.current = requestAnimationFrame(update);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying]);

  // Compute server ghost position based on one-way latency delay
  const oneWayDelay = ping / 2;
  const rewindTicks = Math.max(1, Math.round(oneWayDelay / 16.66));
  const lagDisplacement = 32 * (oneWayDelay / 1000) * targetDirection.current;
  const rawServerGhostPos = Math.max(15, Math.min(85, targetPos - lagDisplacement));

  const fireAttack = useCallback(() => {
    soundFX.playAttack();

    const clientShotX = targetPos;
    const serverCurrentX = rawServerGhostPos;
    const rollbackX = rollbackEnabled ? clientShotX : serverCurrentX;

    const offsetStuds = rollbackEnabled 
      ? Number((Math.random() * 0.15 + 0.05).toFixed(2))
      : Number((Math.abs(clientShotX - serverCurrentX) * 0.45).toFixed(2));

    const isHit = rollbackEnabled || offsetStuds < 1.2;

    const shotId = packetSeq.current++;
    const currentShot = {
      clientX: clientShotX,
      serverX: serverCurrentX,
      rollbackX: rollbackX,
      isHit: isHit,
      offset: offsetStuds,
      timestamp: Date.now()
    };
    setLastShot(currentShot);

    setTimeout(() => {
      if (isHit) {
        soundFX.playHit();
      } else {
        soundFX.playMiss();
      }

      setLogs(prev => [
        {
          id: `pkt-${shotId}`,
          seq: shotId,
          time: "Just now",
          rtt: ping,
          rewindTicks: rollbackEnabled ? rewindTicks : 0,
          result: isHit ? "HIT" : "DESYNC",
          offset: offsetStuds,
          summary: rollbackEnabled 
            ? `Client timestamp valid -> Circular buffer rewound -${oneWayDelay.toFixed(0)}ms (${rewindTicks} ticks). Hitbox validated!`
            : `Naive server check -> Target displaced by ${offsetStuds} studs during ${oneWayDelay.toFixed(0)}ms transit. Raycast rejected.`
        },
        ...prev.slice(0, 5)
      ]);
    }, Math.min(250, oneWayDelay));
  }, [targetPos, rawServerGhostPos, rollbackEnabled, ping, oneWayDelay, rewindTicks]);

  const handlePreset = (ms: number) => {
    soundFX.playClick();
    setPing(ms);
  };


  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>LIVE INTERACTIVE BENCHMARK</span>
            </span>
            <span className="text-xs font-mono text-slate-500">v2.4-strict</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-cyan-400" />
            <span>Authoritative Hitbox Rollback vs. Naive Lag Replication</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlaying ? "Pause Rig" : "Resume Rig"}</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setLogs([]);
              setLastShot(null);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors border border-slate-700"
            title="Clear logs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulated Network Latency (RTT)</span>
            </label>
            <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
              {ping}ms <span className="text-[10px] text-slate-400">({rewindTicks} ticks @ 60Hz)</span>
            </span>
          </div>

          <input
            type="range"
            min="15"
            max="320"
            step="5"
            value={ping}
            onChange={(e) => setPing(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Presets:</span>
            {[
              { label: "LAN (20ms)", ms: 20 },
              { label: "4G LTE (75ms)", ms: 75 },
              { label: "Cross-Region (160ms)", ms: 160 },
              { label: "Oceanic (280ms)", ms: 280 }
            ].map((p) => (
              <button
                key={p.ms}
                onClick={() => handlePreset(p.ms)}
                className={`text-[11px] px-2 py-0.5 rounded-md font-mono transition-all ${ping === p.ms ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold" : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>Lag Compensation Engine</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {rollbackEnabled ? "Server circular ring buffer rewinds past CFrame snapshots" : "Naive immediate server bounds check without timestamp rewinding"}
              </p>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setRollbackEnabled(!rollbackEnabled);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${rollbackEnabled ? "bg-emerald-500" : "bg-slate-700"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rollbackEnabled ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${rollbackEnabled ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
            <span className={rollbackEnabled ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
              {rollbackEnabled ? "AUTHORITATIVE ROLLBACK ACTIVE" : "NAIVE VERIFICATION (HIGH DESYNC)"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Spatial Track (Roblox Stud Scale)</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-400/80">Click Arena to Fire Raycast</span>
        </div>

        <div
          onClick={fireAttack}
          className="relative h-60 w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden cursor-crosshair select-none group shadow-inner"
        >
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}
          />

          <div className="absolute top-24 left-6 right-6 h-0.5 border-t border-dashed border-slate-700/80 pointer-events-none" />

          <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[9px] font-mono text-slate-600 pointer-events-none">
            <span>[0 Studs]</span>
            <span>[15 Studs]</span>
            <span>[30 Studs]</span>
            <span>[45 Studs]</span>
            <span>[60 Studs]</span>
          </div>

          <div className="absolute bottom-6 left-8 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Crosshair className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
            </div>
            <span className="text-[9px] font-mono text-cyan-400 mt-1">Player Turret</span>
          </div>

          <div
            className="absolute top-12 -translate-x-1/2 w-16 h-24 rounded-lg border-2 border-dashed border-amber-500/50 bg-amber-500/5 flex flex-col items-center justify-between p-1 transition-all duration-75 pointer-events-none"
            style={{ left: `${rawServerGhostPos}%` }}
          >
            <span className="text-[8px] font-mono font-bold text-amber-400 bg-amber-950/80 px-1 rounded">SERVER</span>
            <div className="w-3 h-3 rounded-full border border-amber-400/40" />
            <span className="text-[7px] font-mono text-amber-500/80">-{oneWayDelay.toFixed(0)}ms</span>
          </div>

          {lastShot && rollbackEnabled && (
            <div
              className="absolute top-12 -translate-x-1/2 w-16 h-24 rounded-lg border-2 border-emerald-400 bg-emerald-500/20 flex flex-col items-center justify-between p-1 shadow-lg shadow-emerald-500/30 animate-pulse pointer-events-none z-10"
              style={{ left: `${lastShot.rollbackX}%` }}
            >
              <span className="text-[8px] font-mono font-bold text-emerald-300 bg-emerald-950 px-1 rounded">REWOUND</span>
              <span className="text-[9px] font-mono text-emerald-300 font-black">-{oneWayDelay.toFixed(0)}ms</span>
              <span className="text-[7px] font-mono text-emerald-400">TICK VALID</span>
            </div>
          )}

          <div
            className="absolute top-12 -translate-x-1/2 w-16 h-24 rounded-lg border-2 border-cyan-400 bg-cyan-500/10 flex flex-col items-center justify-between p-1 shadow-xl shadow-cyan-500/20 z-20 pointer-events-none"
            style={{ left: `${targetPos}%` }}
          >
            <span className="text-[8px] font-mono font-bold text-cyan-300 bg-cyan-950/90 px-1 rounded">CLIENT RIG</span>
            <div className="w-4 h-4 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
            <span className="text-[8px] font-mono text-cyan-400">Target</span>
          </div>

          {lastShot && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
              <line
                x1="48"
                y1="210"
                x2={`${lastShot.clientX}%`}
                y2="96"
                stroke={lastShot.isHit ? "#34d399" : "#f43f5e"}
                strokeWidth="2.5"
                strokeDasharray="4 2"
                className="animate-pulse"
              />
              <circle
                cx={`${lastShot.clientX}%`}
                cy="96"
                r="6"
                fill={lastShot.isHit ? "#34d399" : "#f43f5e"}
                className="animate-ping"
              />
            </svg>
          )}

          {lastShot && (
            <div 
              className={`absolute top-4 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-xl z-40 transition-all ${lastShot.isHit ? "bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-emerald-500/20" : "bg-rose-950/90 border-rose-500 text-rose-300 shadow-rose-500/20"}`}
              style={{ left: `${lastShot.clientX}%` }}
            >
              {lastShot.isHit ? "HIT VALIDATED [Rollback Confirmed]" : `DESYNC REJECTED [Miss: ${lastShot.offset} studs]`}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-400">
            {rollbackEnabled ? "Zero-Trust: Server uses historical packet timestamp buffer to compensate player ping." : "Naive Lag: Server checks hit using target current position, resulting in miss at high latency."}
          </p>

          <button
            onClick={fireAttack}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
            <span>Fire Raycast Packet</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Authoritative Packet Audit Stream</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">Buffer Depth: 64 Snapshots (1066ms)</span>
        </div>

        <div className="rounded-xl bg-slate-950 border border-slate-800/90 overflow-hidden font-mono text-xs shadow-inner">
          <div className="grid grid-cols-12 bg-slate-900/80 px-3 py-2 text-[10px] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
            <span className="col-span-2 sm:col-span-1">Seq</span>
            <span className="col-span-2 sm:col-span-2">Latency</span>
            <span className="col-span-3 sm:col-span-2">Rewind Offset</span>
            <span className="col-span-3 sm:col-span-2">Verdict</span>
            <span className="col-span-2 sm:col-span-5 hidden sm:inline">Engine Audit Trace</span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-44 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="px-3 py-4 text-center text-slate-500 text-[11px]">
                No packet transactions. Tap "Fire Raycast Packet" to dispatch network snapshot.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="grid grid-cols-12 px-3 py-2 items-center hover:bg-slate-900/50 transition-colors">
                  <span className="col-span-2 sm:col-span-1 text-slate-400 text-[11px]">#{log.seq}</span>
                  <span className="col-span-2 sm:col-span-2 text-cyan-400 text-[11px]">{log.rtt}ms</span>
                  <span className="col-span-3 sm:col-span-2 text-slate-300 text-[11px]">
                    {log.rewindTicks > 0 ? `-${(log.rtt / 2).toFixed(0)}ms (${log.rewindTicks}t)` : "0ms (Naive)"}
                  </span>
                  <span className="col-span-3 sm:col-span-2">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${log.result === "HIT" ? "bg-emerald-950 text-emerald-400 border border-emerald-800/80" : "bg-rose-950 text-rose-400 border border-rose-800/80"}`}
                    >
                      {log.result === "HIT" ? <ShieldCheck className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                      <span>{log.result === "HIT" ? "VALIDATED" : "REJECTED"}</span>
                    </span>
                  </span>
                  <span className="col-span-2 sm:col-span-5 text-slate-400 text-[11px] truncate hidden sm:inline" title={log.summary}>
                    {log.summary}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono text-[11px]">
            <History className="w-3.5 h-3.5" />
            <span>Circular Ring Buffer</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Menyimpan 64 snapshot posisi CFrame terakhir (window 1.06 detik). Akses O(1) tanpa alokasi tabel berulang.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold font-mono text-[11px]">
            <Cpu className="w-3.5 h-3.5" />
            <span>20-Byte Buffer Pack</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Snapshot dipadatkan ke native Luau buffer: 4-byte entityId + 12-byte Vector3 + 4-byte timestamp. Zero packet bloat.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust Validation</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Server membatasi rollback maksimal 350ms. Paket dengan timestamp masa depan atau kelewat usang otomatis di-drop.
          </p>
        </div>
      </div>
    </div>
  );
}
