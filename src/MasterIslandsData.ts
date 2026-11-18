export interface IslandShot {
  id: string;
  island: 'summit' | 'bc' | 'CPEnergy';
  islandName: string;
  polyStats: string;
  path: string;
  title: string;
  desc: string;
}

export const masterIslandShots: IslandShot[] = [
  // Summit Citadel (Pulau 1 - 507 Descendants)
  {
    id: 'summit_core',
    island: 'summit',
    islandName: 'Pulau Citadel Bertingkat',
    polyStats: '507 Descendants • Apex Core • Neon Girders',
    path: '/shots/08_core_close.png',
    title: 'Summit: Apex Core & Neon Bridge',
    desc: 'Apex core section with emissive ring lights and high-contrast checkpoint gates.'
  },
  {
    id: 'summit_iso',
    island: 'summit',
    islandName: 'Pulau Citadel Bertingkat',
    polyStats: '507 Descendants • Modular Grid • Zero-Gap Colliders',
    path: '/shots/01_front_iso.png',
    title: 'Summit: Full Stage Isometric',
    desc: 'Full-stage isometric layout showcasing multi-tier obby altitude progression and jump platforms.'
  },
  {
    id: 'summit_ring',
    island: 'summit',
    islandName: 'Pulau Citadel Bertingkat',
    polyStats: '507 Descendants • Procedural Crystal • Synced Halo',
    path: '/shots/09_ring_accent.png',
    title: 'Summit: Emissive Apex Ring & Crystal',
    desc: 'Close-up macro shot of the procedural octahedron cyber crystal and rotating halo.'
  },
  {
    id: 'summit_hero',
    island: 'summit',
    islandName: 'Pulau Citadel Bertingkat',
    polyStats: '507 Descendants • Volumetric Preset • Cyberpunk Theme',
    path: '/shots/11_hero_dramatic.png',
    title: 'Summit: Hero Cyberpunk Angle',
    desc: 'High-octane neon night lighting preset with volumetric cyan and magenta contrast.'
  },
  // Basecamp Sci-Fi (Pulau 2 - 617 Descendants)
  {
    id: 'bc_iso',
    island: 'bc',
    islandName: 'Pulau Basecamp Sci-Fi',
    polyStats: '617 Descendants • Modular Launchpad • Hangar Nodes',
    path: '/shots/02_back_iso.png',
    title: 'Basecamp: Reverse Angle & Deployment Hangar',
    desc: 'Modular launchpad sector with high-density technical structures and spawn array nodes.'
  },
  {
    id: 'bc_ground',
    island: 'bc',
    islandName: 'Pulau Basecamp Sci-Fi',
    polyStats: '617 Descendants • Technical Outpost • Grid Alignment',
    path: '/shots/06_ground_entry.png',
    title: 'Basecamp: Outpost Entry & Teleport Pads',
    desc: 'Ground-level command center with directional runway beacons and player staging bays.'
  },
  {
    id: 'bc_descent',
    island: 'bc',
    islandName: 'Pulau Basecamp Sci-Fi',
    polyStats: '617 Descendants • Sector Perimeter • Railings',
    path: '/shots/10_descent_wide.png',
    title: 'Basecamp: Wide Sector Perimeter',
    desc: 'Wide focal view inspecting modular outpost connectors and snapped security barriers.'
  },
  {
    id: 'bc_runway',
    island: 'bc',
    islandName: 'Pulau Basecamp Sci-Fi',
    polyStats: '617 Descendants • Speedway Nodes • Low Cam',
    path: '/shots/12_cinematic_low.png',
    title: 'Basecamp: Cinematic Straightaway Runway',
    desc: 'Runway straightaway leading toward the launchpad platforms and sci-fi antennas.'
  },
  // Checkpoint Energy (Pulau 3 - 80+ Mesh Parts)
  {
    id: 'energy_gate',
    island: 'CPEnergy',
    islandName: 'Pulau Checkpoint Energy',
    polyStats: '80+ Mesh Parts • Kinetic Rotating Blades • Neon Gates',
    path: '/shots/07_bridge_low.png',
    title: 'CPEnergy: Kinetic Gate & Energy Rails',
    desc: 'Low-angle perspective highlighting rotating energy blades and high-contrast neon boundary.'
  },
  {
    id: 'energy_spire',
    island: 'CPEnergy',
    islandName: 'Pulau Checkpoint Energy',
    polyStats: '80+ Mesh Parts • Altitude Spire • Energy Conduits',
    path: '/shots/04_right_iso.png',
    title: 'CPEnergy: Elevation Climb & Spire',
    desc: 'East ascension track connecting kinetic obstacle nodes with neon energy conduits.'
  },
  {
    id: 'energy_platforms',
    island: 'CPEnergy',
    islandName: 'Pulau Checkpoint Energy',
    polyStats: '80+ Mesh Parts • Vertical Colliders • Zero-Gap Mesh',
    path: '/shots/03_left_iso.png',
    title: 'CPEnergy: Vertical Obstacle Cascade',
    desc: 'Zero-gap collider alignment along vertical jump pillars and timing-based hazards.'
  },
  {
    id: 'energy_top',
    island: 'CPEnergy',
    islandName: 'Pulau Checkpoint Energy',
    polyStats: '80+ Mesh Parts • Orthographic Snapping • Stage Bounds',
    path: '/shots/05_top.png',
    title: 'CPEnergy: Orthographic Collision Layout',
    desc: 'Top-down blueprint view verifying kinetic blade clearances and boundary volumes.'
  }
];