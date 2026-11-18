import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
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
  Activity, 
  Compass, 
  Cpu, 
  RefreshCw,
  Grid,
  Zap,
  Tv
} from 'lucide-react';
import { soundFX } from './audio';

export type PresetType = 'summit' | 'street' | 'netcode';
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
  const [camDistance, setCamDistance] = useState<number>(36);

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

  const getMaterial = useCallback((
    color: number | string, 
    options: { 
      emissive?: number | string; 
      emissiveIntensity?: number; 
      metalness?: number; 
      roughness?: number;
      transparent?: boolean;
      opacity?: number;
    } = {}
  ): THREE.Material => {
    if (renderMode === 'wireframe') {
      return new THREE.MeshBasicMaterial({
        color: options.emissive || color,
        wireframe: true,
      });
    }

    if (renderMode === 'hitbox') {
      return new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: options.opacity ?? 0.35,
        wireframe: false,
      });
    }

    return new THREE.MeshStandardMaterial({
      color: color,
      emissive: options.emissive ?? 0x000000,
      emissiveIntensity: options.emissiveIntensity ?? 0.5,
      metalness: options.metalness ?? 0.2,
      roughness: options.roughness ?? 0.6,
      transparent: options.transparent ?? false,
      opacity: options.opacity ?? 1.0,
    });
  }, [renderMode]);

  const addHitboxEdges = useCallback((mesh: THREE.Mesh, group: THREE.Group, edgeColor = 0x22d3ee) => {
    if (renderMode === 'hitbox') {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(
        edges, 
        new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 })
      );
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      line.scale.copy(mesh.scale);
      group.add(line);
    }
  }, [renderMode]);

  const buildSummitScene = useCallback((group: THREE.Group) => {
    const baseTiers = [
      { rTop: 16, rBot: 20, h: 3, y: 1.5, color: 0x0f172a },
      { rTop: 12, rBot: 16, h: 4, y: 5.0, color: 0x1e293b },
      { rTop: 8,  rBot: 12, h: 5, y: 9.5, color: 0x334155 },
      { rTop: 4,  rBot: 8,  h: 4, y: 14.0, color: 0x475569 },
    ];
    baseTiers.forEach((tier) => {
      const geom = new THREE.CylinderGeometry(tier.rTop, tier.rBot, tier.h, 8);
      const mat = getMaterial(tier.color, { roughness: 0.85, metalness: 0.1 });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.y = tier.y;
      group.add(mesh);
      addHitboxEdges(mesh, group, 0x64748b);
    });

    const totalPads = 15;
    for (let i = 0; i < totalPads; i++) {
      const angle = i * 0.48;
      const radius = 18 - i * 0.85;
      const y = 1.0 + i * 1.05;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const padGeom = new THREE.BoxGeometry(2.4, 0.4, 2.4);
      const isCyan = i % 2 === 0;
      const padColor = isCyan ? 0x06b6d4 : 0xf59e0b;
      const padMat = getMaterial(0x1e293b, {
        emissive: padColor,
        emissiveIntensity: 0.8,
        metalness: 0.4,
        roughness: 0.3
      });
      const padMesh = new THREE.Mesh(padGeom, padMat);
      padMesh.position.set(x, y, z);
      padMesh.rotation.y = -angle;
      group.add(padMesh);
      addHitboxEdges(padMesh, group, padColor);
    }

    const bridgeY = 7.0;
    const pylonGeom = new THREE.CylinderGeometry(0.35, 0.35, 7, 8);
    const pylonMat = getMaterial(0x64748b, { metalness: 0.6, roughness: 0.4 });
    const p1 = new THREE.Mesh(pylonGeom, pylonMat);
    p1.position.set(-6, bridgeY + 1.5, 10);
    group.add(p1);
    const p2 = new THREE.Mesh(pylonGeom, pylonMat);
    p2.position.set(6, bridgeY + 1.5, 10);
    group.add(p2);

    const deckGeom = new THREE.BoxGeometry(12, 0.3, 2.2);
    const deckMat = getMaterial(0x0284c7, {
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.5
    });
    const deck = new THREE.Mesh(deckGeom, deckMat);
    deck.position.set(0, bridgeY, 10);
    group.add(deck);
    addHitboxEdges(deck, group, 0x38bdf8);

    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6, bridgeY + 4.8, 10.9),
      new THREE.Vector3(-2, bridgeY + 0.6, 10.9),
      new THREE.Vector3(2, bridgeY + 0.6, 10.9),
      new THREE.Vector3(6, bridgeY + 4.8, 10.9)
    ]);
    const cable1 = new THREE.Mesh(
      new THREE.TubeGeometry(curve1, 32, 0.08, 8, false),
      getMaterial(0x38bdf8, { emissive: 0x06b6d4, emissiveIntensity: 1.0 })
    );
    group.add(cable1);

    const ringGeom = new THREE.TorusGeometry(1.8, 0.16, 16, 32);
    const ringMat = getMaterial(0x10b981, { emissive: 0x10b981, emissiveIntensity: 1.2 });
    const cp1 = new THREE.Mesh(ringGeom, ringMat);
    cp1.position.set(0, bridgeY + 2, 10);
    cp1.rotation.y = Math.PI / 2;
    group.add(cp1);

    const crystalGeom = new THREE.OctahedronGeometry(2.0, 0);
    const crystalMat = getMaterial(0xec4899, {
      emissive: 0xf43f5e,
      emissiveIntensity: 1.5,
      metalness: 0.1,
      roughness: 0.2
    });
    const crystal = new THREE.Mesh(crystalGeom, crystalMat);
    crystal.position.set(0, 18.5, 0);
    crystal.name = 'apexCrystal';
    group.add(crystal);
    addHitboxEdges(crystal, group, 0xf43f5e);

    const haloGeom = new THREE.TorusGeometry(3.2, 0.1, 16, 48);
    const haloMat = getMaterial(0x06b6d4, { emissive: 0x06b6d4, emissiveIntensity: 1.8 });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    halo.position.set(0, 18.5, 0);
    halo.rotation.x = Math.PI / 2;
    halo.name = 'apexHalo';
    group.add(halo);
  }, [getMaterial, addHitboxEdges]);

  const buildStreetScene = useCallback((group: THREE.Group) => {
    const groundGeom = new THREE.CylinderGeometry(28, 28, 0.6, 36);
    const groundMat = getMaterial(0x090d16, { roughness: 0.95, metalness: 0.05 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.position.y = -0.3;
    group.add(ground);

    const trackPoints = [
      new THREE.Vector3(-16, 0.4, -10),
      new THREE.Vector3(-6, 0.4, -18),
      new THREE.Vector3(8, 0.4, -16),
      new THREE.Vector3(18, 0.4, -6),
      new THREE.Vector3(16, 2.5, 8),
      new THREE.Vector3(4, 3.2, 16),
      new THREE.Vector3(-8, 1.6, 12),
      new THREE.Vector3(-18, 0.4, 2),
    ];
    const trackSpline = new THREE.CatmullRomCurve3(trackPoints, true);
    
    const roadGeom = new THREE.TubeGeometry(trackSpline, 96, 2.2, 8, true);
    const roadMat = getMaterial(0x1e293b, {
      roughness: 0.8,
      metalness: 0.2,
      emissive: 0x0f172a,
      emissiveIntensity: 0.2
    });
    const roadMesh = new THREE.Mesh(roadGeom, roadMat);
    group.add(roadMesh);
    addHitboxEdges(roadMesh, group, 0x38bdf8);

    const centerGeom = new THREE.TubeGeometry(trackSpline, 96, 0.08, 6, true);
    const centerMat = getMaterial(0x38bdf8, { emissive: 0x06b6d4, emissiveIntensity: 2.0 });
    const centerMesh = new THREE.Mesh(centerGeom, centerMat);
    group.add(centerMesh);

    for (let i = 0; i < 24; i++) {
      const t = 0.45 + (i / 24) * 0.25;
      const pt = trackSpline.getPoint(t);
      const tangent = trackSpline.getTangent(t);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const kerbGeom = new THREE.BoxGeometry(0.7, 0.25, 0.6);
      const isRed = i % 2 === 0;
      const kerbColor = isRed ? 0xef4444 : 0xffffff;
      const kerbMat = getMaterial(kerbColor, {
        emissive: isRed ? 0xb91c1c : 0x94a3b8,
        emissiveIntensity: 0.6,
        roughness: 0.5
      });
      const kerb = new THREE.Mesh(kerbGeom, kerbMat);
      kerb.position.copy(pt).add(normal.clone().multiplyScalar(2.4));
      kerb.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      group.add(kerb);
      addHitboxEdges(kerb, group, kerbColor);
    }

    const gantryX = -16;
    const gantryZ = -10;
    const colGeom = new THREE.BoxGeometry(0.5, 6, 0.5);
    const colMat = getMaterial(0x475569, { metalness: 0.8, roughness: 0.2 });
    
    const colL = new THREE.Mesh(colGeom, colMat);
    colL.position.set(gantryX - 3.2, 3, gantryZ);
    group.add(colL);

    const colR = new THREE.Mesh(colGeom, colMat);
    colR.position.set(gantryX + 3.2, 3, gantryZ);
    group.add(colR);

    const beamGeom = new THREE.BoxGeometry(7, 0.8, 1.2);
    const beamMat = getMaterial(0x0f172a, {
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      metalness: 0.6
    });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.set(gantryX, 5.8, gantryZ);
    group.add(beam);
    addHitboxEdges(beam, group, 0x06b6d4);

    for (let l = 0; l < 5; l++) {
      const ledGeom = new THREE.SphereGeometry(0.22, 12, 12);
      const ledMat = getMaterial(0xef4444, { emissive: 0xff0000, emissiveIntensity: 2.2 });
      const led = new THREE.Mesh(ledGeom, ledMat);
      led.position.set(gantryX - 2.0 + l * 1.0, 5.8, gantryZ + 0.65);
      group.add(led);
    }
  }, [getMaterial, addHitboxEdges]);

  const buildNetcodeScene = useCallback((group: THREE.Group) => {
    const hexGeom = new THREE.CylinderGeometry(20, 20, 0.8, 6);
    const hexMat = getMaterial(0x030712, { roughness: 0.9, metalness: 0.2 });
    const hex = new THREE.Mesh(hexGeom, hexMat);
    hex.position.y = -0.4;
    group.add(hex);
    addHitboxEdges(hex, group, 0x3b82f6);

    const gridLines = new THREE.GridHelper(34, 17, 0x06b6d4, 0x1e293b);
    gridLines.position.y = 0.02;
    group.add(gridLines);

    const serverBoxGeom = new THREE.BoxGeometry(2.8, 5.2, 2.2);
    const serverBoxMat = getMaterial(0x1d4ed8, {
      emissive: 0x2563eb,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.65
    });
    const serverBox = new THREE.Mesh(serverBoxGeom, serverBoxMat);
    serverBox.position.set(-5, 2.6, 0);
    serverBox.name = 'serverHitbox';
    group.add(serverBox);
    addHitboxEdges(serverBox, group, 0x38bdf8);

    const coreGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMat = getMaterial(0x60a5fa, { emissive: 0x93c5fd, emissiveIntensity: 2.0 });
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.position.set(-5, 2.6, 0);
    group.add(core);

    const clientBoxGeom = new THREE.BoxGeometry(2.8, 5.2, 2.2);
    const clientBoxMat = getMaterial(0x06b6d4, {
      emissive: 0x22d3ee,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.4
    });
    const clientBox = new THREE.Mesh(clientBoxGeom, clientBoxMat);
    clientBox.position.set(5, 2.6, 2.5);
    clientBox.name = 'clientHitbox';
    group.add(clientBox);
    addHitboxEdges(clientBox, group, 0x06b6d4);

    const deltaPoints = [
      new THREE.Vector3(-5, 2.6, 0),
      new THREE.Vector3(0, 4.8, 1.25),
      new THREE.Vector3(5, 2.6, 2.5)
    ];
    const deltaCurve = new THREE.CatmullRomCurve3(deltaPoints);
    const deltaGeom = new THREE.TubeGeometry(deltaCurve, 24, 0.12, 8, false);
    const deltaMat = getMaterial(0xec4899, { emissive: 0xf43f5e, emissiveIntensity: 2.2 });
    const deltaMesh = new THREE.Mesh(deltaGeom, deltaMat);
    group.add(deltaMesh);

    for (let p = 0; p < 6; p++) {
      const angle = (p / 6) * Math.PI * 2;
      const px = Math.cos(angle) * 18;
      const pz = Math.sin(angle) * 18;

      const pylonGeom = new THREE.CylinderGeometry(0.4, 0.6, 8, 8);
      const pylonMat = getMaterial(0x1e293b, { metalness: 0.8, roughness: 0.3 });
      const pylon = new THREE.Mesh(pylonGeom, pylonMat);
      pylon.position.set(px, 4, pz);
      group.add(pylon);
      addHitboxEdges(pylon, group, 0x64748b);

      const laserGeom = new THREE.CylinderGeometry(0.08, 0.08, 12, 8);
      const laserMat = getMaterial(0x06b6d4, { emissive: 0x38bdf8, emissiveIntensity: 2.5 });
      const laser = new THREE.Mesh(laserGeom, laserMat);
      laser.position.set(px, 6, pz);
      group.add(laser);
    }
  }, [getMaterial, addHitboxEdges]);

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
    const trackGroup = trackGroupRef.current;
    if (!trackGroup) return;

    while (trackGroup.children.length > 0) {
      const obj = trackGroup.children[0];
      trackGroup.remove(obj);
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      }
    }

    if (preset === 'summit' ) {
      buildSummitScene(trackGroup);
      sphericalRef.current.target.set(0, 6, 0);
    } else if (preset === 'street') {
      buildStreetScene(trackGroup);
      sphericalRef.current.target.set(0, 2, 0);
    } else {
      buildNetcodeScene(trackGroup);
      sphericalRef.current.target.set(0, 3, 0);
    }

    updateStats(trackGroup);
  }, [preset, renderMode, buildSummitScene, buildStreetScene, buildNetcodeScene, updateStats]);

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
    sphericalRef.current.radius = 36;
    sphericalRef.current.theta = Math.PI / 4;
    sphericalRef.current.phi = Math.PI / 3;
    setCamDistance(36);
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
            <Compass className="w-3.5 h-3.5" />
            <span>Summit Obby</span>
          </button>

          <button
            onClick={() => { soundFX.playClick(); setPreset('street'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              preset === 'street'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Street Track v5</span>
          </button>

          <button
            onClick={() => { soundFX.playClick(); setPreset('netcode'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              preset === 'netcode'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Netcode Arena</span>
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
