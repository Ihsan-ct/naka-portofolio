import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  Box, 
  Layers, 
  RotateCw, 
  Sun, 
  Moon, 
  Sunset, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Cpu, 
  RefreshCw,
  Grid,
  Zap,
  Tv,
  Loader2,
  Sparkles,
  Mountain,
  Radio
} from 'lucide-react';
import { soundFX } from './audio';

export type PresetType = 'summit' | 'bc' | 'CPEnergy';
export type RenderMode = 'shaded' | 'wireframe' | 'hitbox';
export type LightingMood = 'cyberpunk' | 'sunset' | 'studio';

export default function Track3DViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [preset, setPreset] = useState<PresetType>('summit');
  const [renderMode, setRenderMode] = useState<RenderMode>('shaded');
  const [lighting, setLighting] = useState<LightingMood>('cyberpunk');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [crtEffect, setCrtEffect] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [fps, setFps] = useState<number>(60);
  const [polyCount, setPolyCount] = useState<number>(0);
  const [vertexCount, setVertexCount] = useState<number>(0);
  const [camDistance, setCamDistance] = useState<number>(46);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const gltfLoaderRef = useRef<GLTFLoader | null>(null);
  const modelCacheRef = useRef<Map<string, THREE.Group>>(new Map());
  const originalMaterialsRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const trackGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const sphericalRef = useRef({
    radius: 36,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
    target: new THREE.Vector3(0, 4, 0)
  });

  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  const updateStats = useCallback((group: THREE.Group) => {
    let triangles = 0;
    let vertices = 0;
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const geom = mesh.geometry;
        if (geom) {
          if (geom.index) {
            triangles += geom.index.count / 3;
          } else if (geom.attributes.position) {
            triangles += geom.attributes.position.count / 3;
          }
          if (geom.attributes.position) {
            vertices += geom.attributes.position.count;
          }
        }
      }
    });
    setPolyCount(Math.round(triangles));
    setVertexCount(Math.round(vertices));
  }, []);

  const ISLAND_PRESETS: Record<PresetType, { name: string; sub: string; file: string; source: string; tag: string; initialRadius: number; targetY: number }> = {
    summit: { name: 'Citadel Bertingkat', sub: 'Pulau Summit Citadel', file: '/models/summit.glb', source: 'Workspace.PULAU.summit', tag: '508 Desc / 113 Meshes', initialRadius: 46, targetY: 6 },
    bc: { name: 'Basecamp Sci-Fi', sub: 'Pulau Basecamp Modular', file: '/models/bc.glb', source: 'Workspace.PULAU.bc', tag: '618 Desc / 137 Meshes', initialRadius: 48, targetY: 5 },
    CPEnergy: { name: 'Checkpoint Energy', sub: 'Checkpoint Gate Modular', file: '/models/CPEnergy.glb', source: 'Workspace.PULAU.CPEnergy', tag: '1025 Desc / 81 Meshes', initialRadius: 36, targetY: 4 }
  };

  const applyRenderMode = useCallback((group: THREE.Group, mode: RenderMode) => {
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const orig = originalMaterialsRef.current.get(mesh.uuid);
        if (mode === 'shaded') {
          if (orig) mesh.material = orig;
        } else if (mode === 'wireframe') {
          mesh.material = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
        } else if (mode === 'hitbox') {
          mesh.material = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, wireframe: false });
        }
      }
    });
  }, []);

  const loadIslandModel = useCallback((targetPreset: PresetType) => {
    const trackGroup = trackGroupRef.current;
    if (!trackGroup) return;
    const meta = ISLAND_PRESETS[targetPreset];
    sphericalRef.current.radius = meta.initialRadius;
    sphericalRef.current.target.set(0, meta.targetY, 0);
    setCamDistance(Math.round(meta.initialRadius));
    while (trackGroup.children.length > 0) trackGroup.remove(trackGroup.children[0]);
    const cached = modelCacheRef.current.get(targetPreset);
    if (cached) {
      trackGroup.add(cached);
      applyRenderMode(trackGroup, renderMode);
      updateStats(trackGroup);
      setIsLoading(false);
      return;
    }
    if (!gltfLoaderRef.current) gltfLoaderRef.current = new GLTFLoader();
    setIsLoading(true);
    setLoadProgress(15);
    gltfLoaderRef.current.load(meta.file, (gltf) => {
      const root = gltf.scene;
      root.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (!originalMaterialsRef.current.has(mesh.uuid)) originalMaterialsRef.current.set(mesh.uuid, mesh.material);
        }
      });
      const box = new THREE.Box3().setFromObject(root);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 28 / (maxDim || 1);
      root.position.x = -center.x * scale;
      root.position.y = -box.min.y * scale;
      root.position.z = -center.z * scale;
      root.scale.setScalar(scale);
      const containerGroup = new THREE.Group();
      containerGroup.add(root);
      modelCacheRef.current.set(targetPreset, containerGroup);
      trackGroup.add(containerGroup);
      applyRenderMode(trackGroup, renderMode);
      updateStats(trackGroup);
      setLoadProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, (xhr) => {
      if (xhr.total > 0) setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
      else setLoadProgress((p) => Math.min(95, p + 15));
    }, (err) => {
      console.error("GLTF error:", err);
      setIsLoading(false);
    });
  }, [renderMode, applyRenderMode, updateStats]);

  const updateLighting = useCallback((scene: THREE.Scene, lightsGroup: THREE.Group) => {
    while (lightsGroup.children.length > 0) {
      const child = lightsGroup.children[0];
      lightsGroup.remove(child);
    }

    if (lighting === 'cyberpunk') {
      scene.background = new THREE.Color(0x030712);
      const ambient = new THREE.AmbientLight(0x0f172a, 1.5);
      lightsGroup.add(ambient);

      const keyLight = new THREE.DirectionalLight(0x06b6d4, 3.2);
      keyLight.position.set(24, 32, 20);
      lightsGroup.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xec4899, 3.8);
      rimLight.position.set(-25, 18, -22);
      lightsGroup.add(rimLight);

      const pointLight1 = new THREE.PointLight(0x3b82f6, 4.0, 50);
      pointLight1.position.set(0, 15, 0);
      lightsGroup.add(pointLight1);
    } else if (lighting === 'sunset') {
      scene.background = new THREE.Color(0x180b22);
      const ambient = new THREE.AmbientLight(0x3b0764, 1.8);
      lightsGroup.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xf97316, 3.8);
      keyLight.position.set(30, 16, 12);
      lightsGroup.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xa855f7, 2.5);
      rimLight.position.set(-22, 22, -18);
      lightsGroup.add(rimLight);
    } else {
      scene.background = new THREE.Color(0x0b1120);
      const ambient = new THREE.AmbientLight(0x475569, 2.4);
      lightsGroup.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
      keyLight.position.set(20, 36, 20);
      lightsGroup.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.8);
      fillLight.position.set(-20, 20, -20);
      lightsGroup.add(fillLight);
    }
  }, [lighting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.012);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const trackGroup = new THREE.Group();
    scene.add(trackGroup);
    trackGroupRef.current = trackGroup;

    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    const grid = new THREE.GridHelper(50, 25, 0x06b6d4, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      frameCount++;
      if (now - lastFpsUpdate >= 300) {
        const delta = (now - lastFpsUpdate) / 1000;
        setFps(Math.round(frameCount / delta));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      if (autoRotate && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.0035;
      }

      if (trackGroupRef.current) {
        const crystal = trackGroupRef.current.getObjectByName('apexCrystal');
        if (crystal) {
          crystal.rotation.y += 0.015;
          crystal.rotation.x += 0.008;
        }
        const halo = trackGroupRef.current.getObjectByName('apexHalo');
        if (halo) {
          halo.rotation.z -= 0.012;
        }
      }

      const { radius, theta, phi, target } = sphericalRef.current;
      camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = target.y + radius * Math.cos(phi);
      camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(target);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  useEffect(() => {
    loadIslandModel(preset);
  }, [preset, loadIslandModel]);

  useEffect(() => {
    if (trackGroupRef.current) {
      applyRenderMode(trackGroupRef.current, renderMode);
    }
  }, [renderMode, applyRenderMode]);

  useEffect(() => {
    const scene = sceneRef.current;
    const lightsGroup = lightsGroupRef.current;
    if (scene && lightsGroup) {
      updateLighting(scene, lightsGroup);
    }
  }, [lighting, updateLighting]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevPointerRef.current.x;
    const deltaY = e.clientY - prevPointerRef.current.y;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };

    sphericalRef.current.theta -= deltaX * 0.007;
    sphericalRef.current.phi = Math.max(
      0.08, 
      Math.min(Math.PI / 2.05, sphericalRef.current.phi + deltaY * 0.007)
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    canvasRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(
      14, 
      Math.min(75, sphericalRef.current.radius + e.deltaY * 0.035)
    );
    setCamDistance(Math.round(sphericalRef.current.radius));
  };

  const resetCamera = () => {
    soundFX.playClick();
    const meta = ISLAND_PRESETS[preset];
    sphericalRef.current.radius = meta.initialRadius;
    sphericalRef.current.theta = Math.PI / 4;
    sphericalRef.current.phi = Math.PI / 3;
    sphericalRef.current.target.set(0, meta.targetY, 0);
    setCamDistance(Math.round(meta.initialRadius));
  };

  const toggleFullscreen = () => {
    soundFX.playClick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-950 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'h-[520px] md:h-[600px]'
      }`}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
      />

      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-3 transition-opacity">
          <div className="relative">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <Sparkles className="w-4 h-4 text-pink-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-1 font-mono text-center px-4">
            <span className="text-sm font-bold text-white tracking-wide">Loading Authentic Blender GLB</span>
            <span className="text-xs text-cyan-400">{ISLAND_PRESETS[preset].name} ({ISLAND_PRESETS[preset].file})</span>
            <div className="w-56 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-200" style={{ width: String.fromCharCode(96)+loadProgress+String.fromCharCode(37)+String.fromCharCode(96) }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">{loadProgress}% - PBR Shaders & Geometry</span>
          </div>
        </div>
      )}

      <div className="absolute top-18 sm:top-20 left-4 pointer-events-none z-20 flex flex-col gap-1 max-w-xs sm:max-w-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-cyan-300">{ISLAND_PRESETS[preset].name}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{ISLAND_PRESETS[preset].source}</span>
        </div>
      </div>

      {crtEffect && (
        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-75" />
      )}

      {/* Top HUD Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-30">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80 shadow-lg pointer-events-auto">
          <button
            onClick={() => { soundFX.playClick(); setPreset('summit'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              preset === 'summit'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Summit Citadel</span>
          </button>

          <button
            onClick={() => { soundFX.playClick(); setPreset('bc'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              preset === 'bc'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Basecamp Sci-Fi</span>
          </button>

          <button
            onClick={() => { soundFX.playClick(); setPreset('CPEnergy'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              preset === 'CPEnergy'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Checkpoint Energy</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80">
            <button
              onClick={() => { soundFX.playClick(); setRenderMode('shaded'); }}
              className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                renderMode === 'shaded' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="PBR Shaded Mode"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => { soundFX.playClick(); setRenderMode('wireframe'); }}
              className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                renderMode === 'wireframe' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Matrix Wireframe Mode"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => { soundFX.playClick(); setRenderMode('hitbox'); }}
              className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                renderMode === 'hitbox' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Hitbox & Colliders Mode"
            >
              <Box className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800/80">
            <button
              onClick={() => { soundFX.playClick(); setLighting('cyberpunk'); }}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                lighting === 'cyberpunk' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Cyberpunk Night Lighting"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => { soundFX.playClick(); setLighting('sunset'); }}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                lighting === 'sunset' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Sunset Horizon Lighting"
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => { soundFX.playClick(); setLighting('studio'); }}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                lighting === 'studio' ? 'bg-slate-200 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Studio Daylight Lighting"
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden lg:flex flex-col gap-1 text-[10px] font-mono text-slate-500 pointer-events-none">
        <span>[DRAG TO ORBIT]</span>
        <span>[SCROLL TO ZOOM]</span>
      </div>

      {/* Bottom Telemetry HUD Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-30">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 shadow-lg font-mono text-xs text-slate-300 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">{fps} FPS</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{polyCount.toLocaleString()} Polys</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{vertexCount.toLocaleString()} Verts</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span>R: {camDistance}u</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => { soundFX.playClick(); setAutoRotate(!autoRotate); }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium flex items-center gap-1.5 backdrop-blur-md transition-all ${
              autoRotate 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20' 
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>Auto Rotate</span>
          </button>

          <button
            onClick={() => { soundFX.playClick(); setCrtEffect(!crtEffect); }}
            className={`p-2 rounded-xl border text-xs backdrop-blur-md transition-all ${
              crtEffect 
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle CRT Scanline Shader"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetCamera}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 backdrop-blur-md transition-all"
            title="Reset Camera Orientation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 backdrop-blur-md transition-all"
            title="Toggle Viewport Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
