export const SOLARIS_AVATAR_GENERATIVE_PALETTE_COUNT = 10;

export interface SolarisAvatarMeshSpot {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
  tone: 'a' | 'b' | 'c';
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = Math.trunc(state);
    state = Math.trunc(state + 0x6d2b79f5);
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pushSpot(
  spots: SolarisAvatarMeshSpot[],
  random: () => number,
  tone: 'a' | 'b' | 'c',
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): void {
  spots.push({
    cx,
    cy,
    rx,
    ry,
    rotate: Math.floor(random() * 180),
    tone,
  });
}

function buildOrbitLayout(
  random: () => number,
  spots: SolarisAvatarMeshSpot[],
): void {
  const tones: Array<'a' | 'b' | 'c'> = ['a', 'b', 'c'];
  const baseAngle = random() * Math.PI * 2;
  for (let i = 0; i < tones.length; i++) {
    const angle = baseAngle + (i / tones.length) * Math.PI * 2;
    const distance = 16 + random() * 18;
    pushSpot(
      spots,
      random,
      tones[i],
      50 + Math.cos(angle) * distance,
      50 + Math.sin(angle) * distance,
      24 + random() * 14,
      20 + random() * 14,
    );
  }
}

function buildRibbonLayout(
  random: () => number,
  spots: SolarisAvatarMeshSpot[],
): void {
  const tones: Array<'a' | 'b' | 'c'> = ['a', 'b', 'c', 'a'];
  const diagonal = random() * Math.PI * 2;
  const normal = diagonal + Math.PI / 2;
  for (let i = 0; i < tones.length; i++) {
    const along = -22 + (i / (tones.length - 1)) * 44 + (random() - 0.5) * 8;
    const across = (random() - 0.5) * 22;
    pushSpot(
      spots,
      random,
      tones[i],
      50 + Math.cos(diagonal) * along + Math.cos(normal) * across,
      50 + Math.sin(diagonal) * along + Math.sin(normal) * across,
      30 + random() * 14,
      15 + random() * 9,
    );
  }
}

function buildClusterLayout(
  random: () => number,
  spots: SolarisAvatarMeshSpot[],
): void {
  const tones: Array<'a' | 'b' | 'c'> = ['a', 'b', 'c'];
  const clusterAngle = random() * Math.PI * 2;
  for (let i = 0; i < 2; i++) {
    const angle = clusterAngle + (random() - 0.5) * 1.2;
    const distance = 4 + random() * 7;
    pushSpot(
      spots,
      random,
      tones[i],
      50 + Math.cos(angle) * distance,
      50 + Math.sin(angle) * distance,
      28 + random() * 12,
      24 + random() * 10,
    );
  }
  const satelliteAngle = clusterAngle + Math.PI + (random() - 0.5) * 0.8;
  const satelliteDistance = 26 + random() * 10;
  pushSpot(
    spots,
    random,
    tones[2],
    50 + Math.cos(satelliteAngle) * satelliteDistance,
    50 + Math.sin(satelliteAngle) * satelliteDistance,
    18 + random() * 9,
    15 + random() * 8,
  );
}

export function buildAvatarMeshSpots(seed: number): SolarisAvatarMeshSpot[] {
  const random = mulberry32(seed);
  const layout = Math.floor(random() * 3);
  const spots: SolarisAvatarMeshSpot[] = [];
  if (layout === 1) {
    buildRibbonLayout(random, spots);
  } else if (layout === 2) {
    buildClusterLayout(random, spots);
  } else {
    buildOrbitLayout(random, spots);
  }
  return spots;
}

export function buildAvatarSealPath(
  lobes = 7,
  radius = 36,
  depth = 0.07,
): string {
  const steps = 168;
  let path = '';
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = radius * (1 + depth * Math.cos(lobes * angle));
    const x = 50 + Math.cos(angle) * r;
    const y = 50 + Math.sin(angle) * r;
    path += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${path}Z`;
}
