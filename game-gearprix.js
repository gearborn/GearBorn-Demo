// game-gearprix.js — LIVE 2D race engine (Gear Prix)
// Production code.
// Historical note: identifiers retain the legacy "beta" prefix; a mechanical
// rename is deferred.
// ─── BETA TRACK DATA & CIRCUIT MODE ───────────────────────────────────────
const BETA_AI_TUNING = {
  // Stuck watchdog
  stuckTimeoutMs: 1800,
  stuckRespawnPauseMs: 900,

  // Racecraft
  apexBiasMax: 34,
  overtakeOffsetMax: 42,
  blockOffsetMax: 30,
  offsetLerpRate: 2.2,
  overtakeProbeRange: 150,
  blockProbeRange: 170,
  aiDecisionMinMs: 700,
  aiDecisionMaxMs: 1100,
  aiOffsetDtMax: 0.05,
  aiOffsetInitialDt: 0.016,
  aggressionVariance: 0.12,

  // Slipstream (applies to player AND AI)
  slipstreamRange: 230,
  slipstreamMinRange: 30,
  slipstreamMinLeaderSpeed: 120,
  slipstreamSeekSpeedTolerance: 42,
  slipstreamSeekRangeMult: 1.4,
  slipstreamHalfAngle: 0.30,
  slipstreamChargeMs: 650,
  slipstreamMaxSpeedMult: 1.10,
  slipstreamAccelMult: 1.18,

  // Rubber band (bounded, asymmetric)
  rubberBandMaxBoost: 0,
  rubberBandMaxDrag: 0.06,
  rubberBandRange: 900,

  // Grass recovery
  aiGrassMaxSpeedMin: 0.72,
  aiGrassAccelMin: 0.62,
  aiOffTrackRespawnMs: 1800
};

const RACE_JUICE_TUNING = {
  shakeDecayPerSec: 26,
  collisionShakeDivisor: 14,
  collisionShakeMin: 2,
  collisionShakeMax: 14,
  hitstopMs: 70,
  hitstopImpactThreshold: 260,
  wallShake: 4,
  sparkCountSmall: 6,
  sparkCountBig: 12,
  sparkLifeMs: 420,
  slowmoMs: 750,
  slowmoScale: 0.35,
  confettiCount: 36,
  positionFlashMs: 900
};

function juiceEnabled() {
  return !(typeof reduceMotionEnabled === "function" && reduceMotionEnabled())
    && state?.settings?.screenEffects !== false;
}

function raceJuiceHaptic(pattern) {
  if (typeof haptic === "function") haptic(pattern);
}

function raceJuiceSpawnParticle(kind, x, y, options = {}) {
  if (!juiceEnabled() || !betaState?.particles) return;
  const angle = options.angle ?? Math.random() * Math.PI * 2;
  const speed = options.speed ?? 120;
  const ttl = options.ttl ?? RACE_JUICE_TUNING.sparkLifeMs;
  betaState.particles.push({
    kind,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    ttl,
    life: ttl,
    size: options.size ?? 4,
    color: options.color || "#ffc857"
  });
}

function raceJuiceSpawnSparks(x, y, count = RACE_JUICE_TUNING.sparkCountSmall) {
  if (!juiceEnabled()) return;
  for (let i = 0; i < count; i += 1) {
    raceJuiceSpawnParticle("spark", x, y, {
      angle: Math.random() * Math.PI * 2,
      speed: 120 + Math.random() * 260,
      ttl: RACE_JUICE_TUNING.sparkLifeMs * (0.72 + Math.random() * 0.52),
      size: 2 + Math.random() * 4,
      color: Math.random() > 0.38 ? "#ffc857" : "#ffffff"
    });
  }
}

function raceJuiceSpawnConfetti(x, y, count = RACE_JUICE_TUNING.confettiCount) {
  if (!juiceEnabled()) return;
  const colors = ["#ffc857", "#52c7ff", "#6ee7a8", "#ff5d5d", "#ffffff"];
  for (let i = 0; i < count; i += 1) {
    raceJuiceSpawnParticle("confetti", x, y, {
      angle: -Math.PI / 2 + (Math.random() - 0.5) * 2.4,
      speed: 90 + Math.random() * 280,
      ttl: 700 + Math.random() * 520,
      size: 3 + Math.random() * 5,
      color: colors[i % colors.length]
    });
  }
}

function raceJuiceUpdateParticles(dt) {
  if (!betaState?.particles?.length) return;
  betaState.particles.forEach((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += (particle.kind === "confetti" ? 130 : 360) * dt;
    particle.life -= dt * 1000;
  });
  betaState.particles = betaState.particles.filter((particle) => particle.life > 0);
}

function raceJuiceDrawParticles(ctx) {
  if (!betaState?.particles?.length) return;
  betaState.particles.forEach((particle) => {
    const alpha = Math.max(0, Math.min(1, particle.life / particle.ttl));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.translate(particle.x, particle.y);
    if (particle.kind === "confetti") {
      ctx.rotate((betaState.elapsed || 0) * 8 + particle.x * 0.01);
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size * 1.7, particle.size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function raceJuiceImpactFeedback(impact, x, y, options = {}) {
  if (juiceEnabled() && betaState) {
    const shake = betaClamp(impact / RACE_JUICE_TUNING.collisionShakeDivisor, RACE_JUICE_TUNING.collisionShakeMin, RACE_JUICE_TUNING.collisionShakeMax);
    betaState.shake = Math.max(betaState.shake || 0, shake);
    raceJuiceSpawnSparks(x, y, options.big ? RACE_JUICE_TUNING.sparkCountBig : RACE_JUICE_TUNING.sparkCountSmall);
    if (options.big) betaState.hitPauseUntil = Math.max(betaState.hitPauseUntil || 0, performance.now() + RACE_JUICE_TUNING.hitstopMs);
  }
  raceJuiceHaptic(options.big ? [20, 15, 30] : 18);
}

const betaTileSize = 256;
const betaLapsRequired = 2;
const betaTileImages = {};
let betaGrassPattern = null;
const betaTileAssets = {
  grass: "assets/tracks/grass.png",
  wall_straight: "assets/tracks/wall_straight.png",
  wall_corner: "assets/tracks/wall_corner.png",
  road_turn: "assets/tracks/track-turn.png",
  road_t_intersection: "assets/tracks/road_t_intersection.png",
  road_cross: "assets/tracks/road_cross.png",
  road_curve_wide: "assets/tracks/road_curve_wide.png",
  road_straight_h: "assets/tracks/track-horizontal.png",
  road_straight_v: "assets/tracks/track-vertical.png",
  start_finish: "assets/tracks/start-finish-line.png",
  checkpoint_neutral: "assets/tracks/checkpoint-neutral.png",
  checkpoint_active: "assets/tracks/checkpoint-active.png"
};
Object.entries(betaTileAssets).forEach(([key, src]) => {
  const img = new Image();
  img.src = src;
  betaTileImages[key] = img;
});

function betaEmptyTrackGrid(width = 16, height = 12) {
  return Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
    if (y === 0) return { type: "wall_straight", rotation: 180 };
    if (y === height - 1) return { type: "wall_straight", rotation: 0 };
    if (x === 0) return { type: "wall_straight", rotation: 90 };
    if (x === width - 1) return { type: "wall_straight", rotation: 270 };
    return { type: "grass", rotation: 0 };
  }));
}

function betaExpandCorners(corners) {
  const points = [];
  const addPoint = (x, y) => points.push({ x, y });
  corners.forEach((corner, index) => {
    const next = corners[(index + 1) % corners.length];
    const dx = Math.sign(next.x - corner.x);
    const dy = Math.sign(next.y - corner.y);
    const steps = Math.max(Math.abs(next.x - corner.x), Math.abs(next.y - corner.y));
    for (let step = 0; step < steps; step += 1) addPoint(corner.x + dx * step, corner.y + dy * step);
  });
  return points.filter((point, index) => index === 0 || point.x !== points[index - 1].x || point.y !== points[index - 1].y);
}

function betaDirection(a, b) {
  if (b.x > a.x) return "E";
  if (b.x < a.x) return "W";
  if (b.y > a.y) return "S";
  return "N";
}

function betaRoadTileFor(prev, current, next) {
  const dirs = [betaDirection(current, prev), betaDirection(current, next)].sort().join("");
  if (dirs === "EW") return { type: "road_straight", rotation: 0 };
  if (dirs === "NS") return { type: "road_straight", rotation: 90 };
  const turnRotations = { ES: 0, SW: 90, NW: 180, EN: 270 };
  return { type: "road_turn", rotation: turnRotations[dirs] ?? 0 };
}

function betaMakeTrack(id, name, corners, width = 20, height = 15) {
  const path = betaExpandCorners(corners);
  const grid = betaEmptyTrackGrid(width, height);
  path.forEach((point, index) => {
    const prev = path[(index - 1 + path.length) % path.length];
    const next = path[(index + 1) % path.length];
    grid[point.y][point.x] = betaRoadTileFor(prev, point, next);
  });
  const checkpointIndexes = [0.25, 0.5, 0.75].map((pct) => Math.floor(path.length * pct));
  const checkpoints = checkpointIndexes.map((index) => path[index]);
  const next = path[1] || path[0];
  return {
    id,
    name,
    width,
    height,
    grid,
    path,
    aiLine: path.map((point) => ({ x: (point.x + 0.5) * betaTileSize, y: (point.y + 0.5) * betaTileSize })),
    startTile: path[0],
    startAngle: Math.atan2(next.y - path[0].y, next.x - path[0].x),
    checkpoints
  };
}

const betaTracks = [
  betaMakeTrack("training", "Training", [{ x: 5, y: 13 }, { x: 17, y: 13 }, { x: 17, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 13 }]),
  betaMakeTrack("indy", "Indy", [{ x: 5, y: 12 }, { x: 17, y: 12 }, { x: 17, y: 8 }, { x: 18, y: 8 }, { x: 18, y: 2 }, { x: 8, y: 2 }, { x: 8, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 9 }, { x: 1, y: 9 }, { x: 1, y: 12 }]),
  betaMakeTrack("berlin", "Berlin", [{ x: 5, y: 13 }, { x: 17, y: 13 }, { x: 17, y: 9 }, { x: 9, y: 9 }, { x: 9, y: 6 }, { x: 17, y: 6 }, { x: 17, y: 3 }, { x: 5, y: 3 }, { x: 5, y: 6 }, { x: 3, y: 6 }, { x: 3, y: 10 }, { x: 1, y: 10 }, { x: 1, y: 13 }]),
  betaMakeTrack("dubai", "Dubai", [{ x: 5, y: 12 }, { x: 17, y: 12 }, { x: 17, y: 8 }, { x: 18, y: 8 }, { x: 18, y: 3 }, { x: 13, y: 3 }, { x: 13, y: 7 }, { x: 7, y: 7 }, { x: 7, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 12 }]),
  betaMakeTrack("rio", "Rio", [{ x: 5, y: 13 }, { x: 16, y: 13 }, { x: 16, y: 10 }, { x: 18, y: 10 }, { x: 18, y: 3 }, { x: 12, y: 3 }, { x: 12, y: 7 }, { x: 8, y: 7 }, { x: 8, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 10 }, { x: 1, y: 10 }, { x: 1, y: 13 }]),
  betaMakeTrack("la", "LA", [{ x: 5, y: 13 }, { x: 17, y: 13 }, { x: 17, y: 11 }, { x: 18, y: 11 }, { x: 18, y: 2 }, { x: 13, y: 2 }, { x: 13, y: 6 }, { x: 9, y: 6 }, { x: 9, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 9 }, { x: 6, y: 9 }, { x: 6, y: 11 }, { x: 1, y: 11 }, { x: 1, y: 13 }]),
  betaMakeTrack("seoul", "Seoul", [{ x: 5, y: 13 }, { x: 17, y: 13 }, { x: 17, y: 9 }, { x: 12, y: 9 }, { x: 12, y: 7 }, { x: 17, y: 7 }, { x: 17, y: 3 }, { x: 6, y: 3 }, { x: 6, y: 7 }, { x: 2, y: 7 }, { x: 2, y: 11 }, { x: 1, y: 11 }, { x: 1, y: 13 }]),
  betaMakeTrack("safrica", "S. Africa", [{ x: 5, y: 13 }, { x: 17, y: 13 }, { x: 17, y: 9 }, { x: 14, y: 9 }, { x: 14, y: 5 }, { x: 18, y: 5 }, { x: 18, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 5 }, { x: 9, y: 5 }, { x: 9, y: 9 }, { x: 1, y: 9 }, { x: 1, y: 13 }]),
  betaMakeTrack("india", "India", [{ x: 5, y: 13 }, { x: 16, y: 13 }, { x: 16, y: 11 }, { x: 18, y: 11 }, { x: 18, y: 8 }, { x: 16, y: 8 }, { x: 16, y: 6 }, { x: 15, y: 6 }, { x: 15, y: 2 }, { x: 7, y: 2 }, { x: 7, y: 6 }, { x: 3, y: 6 }, { x: 3, y: 9 }, { x: 1, y: 9 }, { x: 1, y: 13 }]),
  betaMakeTrack("space", "Space", [{ x: 5, y: 13 }, { x: 15, y: 13 }, { x: 15, y: 11 }, { x: 18, y: 11 }, { x: 18, y: 8 }, { x: 14, y: 8 }, { x: 14, y: 5 }, { x: 18, y: 5 }, { x: 18, y: 2 }, { x: 10, y: 2 }, { x: 10, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 7 }, { x: 6, y: 7 }, { x: 6, y: 10 }, { x: 1, y: 10 }, { x: 1, y: 13 }])
];
const betaDirectionDelta = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 }
};
const betaOppositeDirection = { N: "S", E: "W", S: "N", W: "E" };

function betaTileConnections(tile) {
  const type = tile?.type;
  const rotation = ((Number(tile?.rotation) || 0) + 360) % 360;
  if (type === "road_straight" || type === "start_finish" || type === "checkpoint") {
    return rotation === 90 || rotation === 270 ? ["N", "S"] : ["E", "W"];
  }
  if (type === "road_turn") {
    return ({ 0: ["E", "S"], 90: ["S", "W"], 180: ["N", "W"], 270: ["N", "E"] })[rotation] || ["E", "S"];
  }
  return [];
}

function betaBuilderTileToRaceTile(tile) {
  if (!tile || tile.type === "grass") return { type: "grass", rotation: 0 };
  if (tile.type?.startsWith("wall")) return { type: tile.type, rotation: Number(tile.rotation) || 0 };
  if (tile.type === "start_finish" || tile.type === "checkpoint") {
    return { type: "road_straight", rotation: Number(tile.rotation) || 0 };
  }
  if (tile.type === "road_straight" || tile.type === "road_turn") {
    return { type: tile.type, rotation: Number(tile.rotation) || 0 };
  }
  return { type: "grass", rotation: 0 };
}

function betaRoadTilesFromGrid(grid) {
  const tiles = [];
  grid.forEach((row, y) => row.forEach((tile, x) => {
    if (betaTileConnections(tile).length) tiles.push({ x, y });
  }));
  return tiles;
}

function betaWalkCustomPath(grid, start) {
  const roadTiles = betaRoadTilesFromGrid(grid);
  if (!start || !roadTiles.length) return roadTiles;
  const path = [start];
  let previous = null;
  let current = start;
  const maxSteps = roadTiles.length + 4;
  for (let step = 0; step < maxSteps; step += 1) {
    const currentTile = grid[current.y]?.[current.x];
    const candidates = betaTileConnections(currentTile).map((dir) => {
      const delta = betaDirectionDelta[dir];
      return { x: current.x + delta.x, y: current.y + delta.y, from: betaOppositeDirection[dir] };
    }).filter((candidate) => betaTileConnections(grid[candidate.y]?.[candidate.x]).includes(candidate.from));
    const next = candidates.find((candidate) => !previous || candidate.x !== previous.x || candidate.y !== previous.y) || candidates[0];
    if (!next) break;
    if (next.x === start.x && next.y === start.y && path.length >= 8) break;
    if (path.some((point) => point.x === next.x && point.y === next.y)) break;
    previous = current;
    current = { x: next.x, y: next.y };
    path.push(current);
  }
  return path.length >= 8 ? path : roadTiles;
}

function betaCustomTrackFromBuilder(track) {
  const sourceGrid = cloneBuilderGrid(track.grid);
  const markers = [];
  sourceGrid.forEach((row, y) => row.forEach((tile, x) => {
    if (tile.type === "start_finish" || tile.type === "checkpoint") markers.push({ x, y, type: tile.type, rotation: Number(tile.rotation) || 0 });
  }));
  const grid = sourceGrid.map((row) => row.map(betaBuilderTileToRaceTile));
  const width = grid[0]?.length || builderGridSize;
  const height = grid.length || builderGridSize;
  const startMarker = markers.find((marker) => marker.type === "start_finish");
  const firstRoad = betaRoadTilesFromGrid(grid)[0] || { x: 1, y: 1 };
  const startTile = startMarker ? { x: startMarker.x, y: startMarker.y } : firstRoad;
  const path = betaWalkCustomPath(grid, startTile);
  const checkpoints = markers.filter((marker) => marker.type === "checkpoint").map((marker) => ({ x: marker.x, y: marker.y }));
  const fallbackCheckpoints = [0.25, 0.5, 0.75].map((pct) => path[Math.floor(path.length * pct)]).filter(Boolean);
  const next = path[1] || startTile;
  return {
    id: `custom:${track.id}`,
    custom: true,
    name: track.name || "Custom Track",
    width,
    height,
    grid,
    path,
    aiLine: path.map((point) => ({ x: (point.x + 0.5) * betaTileSize, y: (point.y + 0.5) * betaTileSize })),
    startTile,
    startAngle: Math.atan2(next.y - startTile.y, next.x - startTile.x),
    checkpoints: checkpoints.length ? checkpoints : fallbackCheckpoints
  };
}

function betaCustomTracks() {
  return loadCustomTracks().map(betaCustomTrackFromBuilder).filter((track) => track.path.length >= 2);
}

function betaSavedTracksAvailableForMode(mode = betaPreviewMode || betaPendingMode) {
  return betaRaceContext?.source === "training" && ["race4", "race6", "duel"].includes(mode);
}

function betaSelectableTracks(mode = betaPreviewMode || betaPendingMode) {
  return betaSavedTracksAvailableForMode(mode) ? betaTracks.concat(betaCustomTracks()) : betaTracks;
}

function betaTrackById(trackId, mode = betaPreviewMode || betaPendingMode) {
  return betaSelectableTracks(mode).find((track) => track.id === trackId) || betaTracks.find((track) => track.id === trackId) || betaTracks[0];
}

// ─── BETA MODE (2D RACING) ──────────────────────────────────────────────────
let betaSelectedTrackId = betaTracks[0].id;
let betaTrack = betaTracks[0];
let betaPreviewOpponents = [];
let betaPreviewMode = "time";
let betaReturningToPreview = false;
let betaDuelDriverIndex = 0;
let betaRaceContext = null;
const story2dOpponentCache = new Map();

let betaState = null;
let betaCarImage = null;
const betaKeys = {};

function betaTileAt(x, y) {
  const tx = Math.floor(x / betaTileSize);
  const ty = Math.floor(y / betaTileSize);
  return betaTrack.grid[ty]?.[tx] || { type: "wall_straight" };
}

function betaTileClass(tile) {
  if (!tile) return "wall";
  if (tile.type.startsWith("wall")) return "wall";
  if (tile.type === "grass") return "grass";
  return "road";
}

function betaRoadMaskContains(tile, localX, localY) {
  if (!tile || betaTileClass(tile) !== "road") return false;
  const band = 0.28;
  if (tile.type === "road_straight") {
    return tile.rotation === 90 || tile.rotation === 270
      ? Math.abs(localX - 0.5) <= band
      : Math.abs(localY - 0.5) <= band;
  }
  if (tile.type !== "road_turn") return true;
  const rotations = {
    0: ["E", "S"],
    90: ["S", "W"],
    180: ["N", "W"],
    270: ["N", "E"]
  };
  const dirs = rotations[((tile.rotation || 0) + 360) % 360] || rotations[0];
  const horizontal = dirs.includes("E")
    ? localX >= 0.42 && Math.abs(localY - 0.5) <= 0.34
    : localX <= 0.58 && Math.abs(localY - 0.5) <= 0.34;
  const vertical = dirs.includes("S")
    ? localY >= 0.42 && Math.abs(localX - 0.5) <= 0.34
    : localY <= 0.58 && Math.abs(localX - 0.5) <= 0.34;
  const cornerCenters = { "E,S": [0.5, 0.5], "S,W": [0.5, 0.5], "N,W": [0.5, 0.5], "N,E": [0.5, 0.5] };
  const center = cornerCenters[dirs.join(",")] || [0.5, 0.5];
  const radius = Math.hypot(localX - center[0], localY - center[1]);
  return horizontal || vertical || radius <= 0.48;
}

function betaSurfaceAt(x, y) {
  const circuit = gpCircuit();
  if (!circuit) return "road";
  const surface = gpSurfaceForLateral(circuit, gpLocate(circuit, x, y).lateral);
  return surface === "curb" ? "road" : surface;
}

function betaNormalizeAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function betaStraightAssistAngle(racer) {
  return null;
}

function betaNearestRoadSpawn(racer) {
  return gpRespawnPoint(racer);
}

function betaNearestAiLineIndex(racer, line = betaAiRacingLine) {
  if (!racer || !line?.length) return 0;
  let bestIndex = 0;
  let bestDistance = Infinity;
  line.forEach((point, index) => {
    const distance = Math.hypot(point.x - racer.x, point.y - racer.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function betaRespawnRacer(racer, now = betaNowMs()) {
  const spawn = betaNearestRoadSpawn(racer);
  racer.x = spawn.x;
  racer.y = spawn.y;
  racer.prevX = spawn.x;
  racer.prevY = spawn.y;
  racer.angle = spawn.angle;
  racer.speed = 0;
  racer.spinUntil = 0;
  racer.slowUntil = 0;
  racer.offTrackSince = null;
  racer.stuckSince = null;
  racer.lastRecoveryX = spawn.x;
  racer.lastRecoveryY = spawn.y;
  racer.lastProgressScore = betaProgressScore(racer);
  racer.lastProgressAt = now;
  racer.lastWaypointDistance = Infinity;
  if (racer.ai && betaAiRacingLine?.length) {
    racer.aiWaypoint = (spawn.index + 1) % betaAiRacingLine.length;
  }
  racer.respawnUntil = now + 2000;
}

function betaUpdateOffTrackRecovery(racer, now = betaNowMs()) {
  if (!racer || racer.finished || racer.ghost) return;
  if (racer.respawnUntil && racer.respawnUntil > now) return;
  const surface = racer.gp?.surface || "road";
  if (surface === "road" || surface === "curb") {
    racer.offTrackSince = null;
    return;
  }
  racer.offTrackSince = racer.offTrackSince || now;
  const limit = racer.ai ? BETA_AI_TUNING.aiOffTrackRespawnMs * 2 : 5000;
  if (now - racer.offTrackSince >= limit) betaRespawnRacer(racer, now);
}

function betaCurrentCarId() {
  if (betaRaceContext?.source === "tutorial") return tutorialCarId;
  if (["story", "gauntlet"].includes(betaRaceContext?.source)) return isSelectablePlayerCar(state.selectedStoryCar) ? state.selectedStoryCar : firstSelectablePlayerCarId();
  return selectedCarIdForMode("beta");
}

function betaResizeCanvas() {
  if (!el.betaCanvas) return;
  const ratio = window.devicePixelRatio || 1;
  const rect = el.betaCanvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (el.betaCanvas.width !== width) el.betaCanvas.width = width;
  if (el.betaCanvas.height !== height) el.betaCanvas.height = height;
  if (!el.betaMinimap) return;
  const miniRect = el.betaMinimap.getBoundingClientRect();
  const miniWidth = Math.max(1, Math.round(miniRect.width * ratio));
  const miniHeight = Math.max(1, Math.round(miniRect.height * ratio));
  if (el.betaMinimap.width !== miniWidth) el.betaMinimap.width = miniWidth;
  if (el.betaMinimap.height !== miniHeight) el.betaMinimap.height = miniHeight;
}

function betaIsMobilePortrait() {
  return window.innerWidth < 600 && window.innerHeight > window.innerWidth;
}

function resizeBetaCanvas() {
  if (!el.betaCanvas || !el.betaRace || el.betaRace.hidden) return;
  const stage = el.betaCanvas.closest(".beta-stage");
  const widthSource = stage?.clientWidth || el.betaRace.clientWidth || window.innerWidth;
  const portrait = betaIsMobilePortrait();
  const reservedHeight = portrait ? 232 : 142;
  const availableWidth = Math.max(320, Math.min(widthSource, window.innerWidth - 16));
  const availableHeight = Math.max(300, window.innerHeight - reservedHeight - 16);
  const aspect = 960 / 620;
  let cssWidth = availableWidth;
  // 5C: always use the full stage width; on short screens the view gets wider, not narrower.
  let cssHeight = Math.min(cssWidth / aspect, availableHeight);
  if (document.body.classList.contains("gb-racing") && typeof gbPhoneLayout === "function" && gbPhoneLayout()) {
    // 3J: on a phone the live race fills the screen; the chase cam works at any shape.
    // In portrait the controls sit under the canvas; in landscape they float over it.
    // The race is scrolled so the view's top (with its Back button) is at the top of the screen.
    const controls = el.betaRace.querySelector(".beta-touch-controls");
    const controlsHeight = window.innerHeight > window.innerWidth ? controls?.getBoundingClientRect().height || 0 : 0;
    const view = el.betaCanvas.closest(".view");
    const above = el.betaCanvas.getBoundingClientRect().top - (view?.getBoundingClientRect().top || 0);
    cssWidth = Math.min(widthSource, window.innerWidth - 8);
    cssHeight = Math.max(220, window.innerHeight - above - controlsHeight - 26);
  }
  el.betaCanvas.style.width = `${Math.round(cssWidth)}px`;
  el.betaCanvas.style.height = `${Math.round(cssHeight)}px`;
  betaResizeCanvas();
}

function showBetaRotationTip() {
  if (!el.rotationTip || state.dismissedRotationTips || !betaIsMobilePortrait()) return;
  el.rotationTip.hidden = false;
  if (typeof reduceMotionEnabled === "function" && reduceMotionEnabled()) {
    el.rotationTip?.classList.add("active");
  } else {
    requestAnimationFrame(() => el.rotationTip?.classList.add("active"));
  }
}

function hideBetaRotationTip(persist = false) {
  if (persist) {
    state.dismissedRotationTips = true;
    saveState();
  }
  el.rotationTip?.classList.remove("active");
  if (el.rotationTip) {
    window.setTimeout(() => {
      if (!el.rotationTip?.classList.contains("active")) el.rotationTip.hidden = true;
    }, 180);
  }
}

function updateRotationTipForActiveRace() {
  resizeBetaCanvas();
  if (betaState && el.betaRace && !el.betaRace.hidden) {
    if (betaIsMobilePortrait()) showBetaRotationTip();
    else hideBetaRotationTip(false);
  }
}

function stopBetaDemo(showIntro = true) {
  gpHidePause();
  betaLoadToken += 1;
  if (betaState?.raf) cancelAnimationFrame(betaState.raf);
  betaState = null;
  Object.keys(betaKeys).forEach((key) => delete betaKeys[key]);
  setBetaLoading(false);
  hideBetaRotationTip(false);
  if (el.betaCountdown) {
    el.betaCountdown.classList.remove("active");
    el.betaCountdown.textContent = "";
  }
  if (showIntro && el.betaIntro && el.betaRace) {
    el.betaIntro.hidden = false;
    el.betaRace.hidden = true;
  }
}

function betaInput(direction) {
  return Boolean(betaKeys[direction]);
}

function updateBetaCheckpoints() {
  const tx = Math.floor(betaState.x / betaTileSize);
  const ty = Math.floor(betaState.y / betaTileSize);
  const next = betaTrack.checkpoints[betaState.checkpoint];
  if (next && tx === next.x && ty === next.y) {
    betaState.checkpoint += 1;
  }
  const onStart = tx === betaTrack.startTile.x && ty === betaTrack.startTile.y;
  if (onStart && !betaState.wasOnStart && betaState.checkpoint >= betaTrack.checkpoints.length) {
    if (betaState.lap >= betaLapsRequired) {
      finishBetaDemo();
    } else {
      betaState.lap += 1;
      betaState.checkpoint = 0;
    }
  }
  betaState.wasOnStart = onStart;
}

function betaTileImage(tile) {
  if (tile.type === "road_straight") return betaTileImages[tile.rotation === 90 || tile.rotation === 270 ? "road_straight_v" : "road_straight_h"];
  return betaTileImages[tile.type];
}

function drawBetaTile(ctx, tile, x, y) {
  const img = betaTileImage(tile);
  if (img?.complete && img.naturalWidth) {
    ctx.save();
    ctx.translate(x + betaTileSize / 2, y + betaTileSize / 2);
    const drawRotation = tile.type === "road_straight" ? 0 : (tile.rotation || 0);
    ctx.rotate(drawRotation * Math.PI / 180);
    ctx.drawImage(img, -betaTileSize / 2, -betaTileSize / 2, betaTileSize, betaTileSize);
    ctx.restore();
    return;
  }
  const tileClass = betaTileClass(tile);
  ctx.fillStyle = tileClass === "road" ? "#4d535d" : tileClass === "wall" ? "#20242b" : "#245d38";
  ctx.fillRect(x, y, betaTileSize, betaTileSize);
  if (tileClass === "road") {
    ctx.strokeStyle = "rgba(255,255,255,.18)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    if (tile.type === "road_straight" && (tile.rotation === 90 || tile.rotation === 270)) {
      ctx.moveTo(x + betaTileSize / 2, y);
      ctx.lineTo(x + betaTileSize / 2, y + betaTileSize);
    } else {
      ctx.moveTo(x, y + betaTileSize / 2);
      ctx.lineTo(x + betaTileSize, y + betaTileSize / 2);
    }
    ctx.stroke();
  }
}

function drawBetaMarkersSimple(ctx) {
  const ts = betaTileSize;
  const sx = betaTrack.startTile.x * ts;
  const sy = betaTrack.startTile.y * ts;
  const startTile = betaTrack.grid[betaTrack.startTile.y]?.[betaTrack.startTile.x];
  const startIsHoriz = betaTileIsHorizontal(startTile);
  const sfImg = betaTrackImages.startFinish;
  if (sfImg?.complete && sfImg.naturalWidth) {
    ctx.save();
    ctx.translate(sx + ts / 2, sy + ts / 2);
    if (startIsHoriz) ctx.rotate(Math.PI / 2);
    ctx.drawImage(sfImg, -ts / 2, -ts * 0.275, ts, ts * 0.55);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,.9)";
    for (let i = 0; i < 8; i += 1) ctx.fillRect(sx + i * 32, sy + 92, 16, 72);
  }
  betaTrack.checkpoints.forEach((cp, index) => {
    const passed = index < (betaState?.checkpoint || 0);
    const img = passed ? betaTrackImages.checkpointActive : betaTrackImages.checkpointNeutral;
    const cpTile = betaTrack.grid[cp.y]?.[cp.x];
    const cpIsHoriz = betaTileIsHorizontal(cpTile);
    const cx = cp.x * ts;
    const cy = cp.y * ts;
    if (img?.complete && img.naturalWidth) {
      ctx.save();
      ctx.translate(cx + ts / 2, cy + ts / 2);
      if (cpIsHoriz) ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -ts / 2, -ts * 0.275, ts, ts * 0.55);
      ctx.restore();
    } else {
      ctx.strokeStyle = passed ? "rgba(255,200,87,.86)" : "rgba(82,199,255,.56)";
      ctx.lineWidth = 6;
      ctx.strokeRect(cx + 36, cy + 36, ts - 72, ts - 72);
    }
  });
}

el.betaStart?.addEventListener("click", startBetaDemo);
el.betaRestart?.addEventListener("click", () => startBetaDemo());
el.betaExit?.addEventListener("click", () => openBetaIntro());
el.betaFinishExit?.addEventListener("click", () => openBetaIntro());
el.betaDebug?.addEventListener("click", () => {
  if (!betaState) return;
  betaState.debug = !betaState.debug;
  el.betaDebug.textContent = `Debug: ${betaState.debug ? "On" : "Off"}`;
  drawBetaFrame();
});
window.addEventListener("resize", () => {
  if (betaState) drawBetaFrame();
});
document.addEventListener("keydown", (event) => {
  if (!document.querySelector("#beta-view")?.classList.contains("active")) return;
  const key = normalizeKey(event);
  const map = { W: "up", ArrowUp: "up", S: "down", ArrowDown: "down", A: "left", ArrowLeft: "left", D: "right", ArrowRight: "right" };
  if ((key === "P" || key === "Escape") && (betaState?.paused || gpCanPause())) {
    event.preventDefault();
    event.stopImmediatePropagation();
    gpTogglePause();
    return;
  }
  if (betaState?.paused) return;
  if (key === "T") {
    event.preventDefault();
    if (betaState) {
      betaState.debug = !betaState.debug;
      el.betaDebug.textContent = `Debug: ${betaState.debug ? "On" : "Off"}`;
      drawBetaFrame();
    }
    return;
  }
  if (map[key]) {
    event.preventDefault();
    betaKeys[map[key]] = true;
    updateBetaControlVisuals();
  }
});
document.addEventListener("keyup", (event) => {
  const key = normalizeKey(event);
  const map = { W: "up", ArrowUp: "up", S: "down", ArrowDown: "down", A: "left", ArrowLeft: "left", D: "right", ArrowRight: "right" };
  if (map[key]) {
    betaKeys[map[key]] = false;
    updateBetaControlVisuals();
  }
});

const betaModeConfigs = {
  time: { id: "time", label: "Solo Time Trial", opponents: 0, goalRank: 1, goalLabel: "Set your best time", itemsEnabled: false, boostPadsEnabled: true, obstaclesEnabled: false },
  race4: { id: "race4", label: "4-Car Circuit Race", opponents: 3, goalRank: 2, goalLabel: "Top 2 required", itemsEnabled: true, boostPadsEnabled: true, obstaclesEnabled: true },
  race6: { id: "race6", label: "6-Car Circuit Race", opponents: 5, goalRank: 3, goalLabel: "Top 3 required", itemsEnabled: true, boostPadsEnabled: true, obstaclesEnabled: true },
  duel: { id: "duel", label: "Head-to-Head Race", opponents: 1, goalRank: 1, goalLabel: "Win required", itemsEnabled: true, boostPadsEnabled: true, obstaclesEnabled: true }
};

let betaPendingMode = "time";
let betaLoadToken = 0;
let betaWaypointPath = betaTrack.checkpoints.concat([betaTrack.startTile]).map((tile) => ({
  x: (tile.x + 0.5) * betaTileSize,
  y: (tile.y + 0.5) * betaTileSize
}));

function syncBetaTrackDerived() {
  betaWaypointPath = betaTrack.checkpoints.concat([betaTrack.startTile]).map((tile) => ({
    x: (tile.x + 0.5) * betaTileSize,
    y: (tile.y + 0.5) * betaTileSize
  }));
  betaAiRacingLine = betaTrack.aiLine;
  gpCircuit(betaTrack);
}

function betaRatingsForCar(carId, level = state.garage?.[carId]?.level || 1, evolution = state.garage?.[carId]?.evolution || 0, includePlayerBonuses = false) {
  if (includePlayerBonuses) return displayedGearbornStats(carId);
  const profile = gearbornStatProfiles[carId] || gearbornStatProfiles.bee;
  const levelGain = level - 1;
  const evolutionGain = Math.max(0, evolution) * 2;
  return Object.fromEntries(["speed", "acceleration", "handling", "torque", "body", "powertrain"].map((key) => [
    key,
    Math.min(100, Math.max(1, (profile[key] ?? 74) + levelGain + evolutionGain))
  ]));
}

function betaPhysicsFromRatings(ratings, skill = 1) {
  return {
    maxSpeed:     (240 + (ratings.speed || 70) * 2.8  + (ratings.powertrain || 70) * 0.35) * skill,
    acceleration: (200 + (ratings.acceleration || 70) * 4.0) * skill,
    brake:        460 + (ratings.torque || 70) * 1.8,
    turnRate:     (1.9 + (ratings.handling || 70) / 36) * skill,
    torque:       ratings.torque || 70,
    body:         ratings.body  || 70,
    powertrain:   ratings.powertrain || 70,
    pwrMultiplier: 1 + ((ratings.powertrain || 70) / 100) * 0.25
  };
}

function getEligibleBetaOpponentLines(playerCarId) {
  const excluded = new Set(["art-van", "rainbowlt", "metal-snake", "training-car", playerCarId]);
  const list = cars.filter((car) => !car.tutorialOnly && !excluded.has(car.id));
  return list.length ? list : cars.filter((car) => defaultUnlockedLines.includes(car.id) && car.id !== playerCarId);
}

function betaDifficultySkill(difficulty, fallbackSkill) {
  if (!difficulty) return fallbackSkill;
  const min = Number(difficulty.skillMin) || fallbackSkill;
  const max = Number(difficulty.skillMax) || min;
  return min + Math.random() * Math.max(0, max - min);
}

function betaDifficultyAggression(difficulty) {
  if (!difficulty) return 0.4;
  const base = Number.isFinite(Number(difficulty?.aggression)) ? Number(difficulty.aggression) : 0.4;
  return Math.max(0, Math.min(1, base + (Math.random() * 2 - 1) * BETA_AI_TUNING.aggressionVariance));
}

function betaDifficultyEvolution(car, playerCarId, difficulty) {
  if (!difficulty) return betaMatchedEvolutionIndexForLine(playerCarId, car.id);
  return Math.max(0, Math.min(car.evolutions.length - 1, Math.floor(Number(difficulty.opponentEvolution) || 0)));
}

function betaDifficultyLevel(playerCarId, difficulty, mirrorFloor = false) {
  if (difficulty) return Math.max(1, Math.floor(Number(difficulty.opponentLevel) || 1));
  const playerProgress = state.garage[playerCarId] || { level: 1 };
  const mirrored = (playerProgress.level || 1) - 3;
  return mirrorFloor ? Math.max(1, mirrored) : mirrored;
}

function getRandomOpponentCars(count, playerCarId, difficulty = null) {
  const playerProgress = state.garage[playerCarId] || { level: 1, evolution: 0 };
  const pool = getEligibleBetaOpponentLines(playerCarId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, index) => {
    const car = shuffled[index % shuffled.length];
    const evolution = difficulty ? betaDifficultyEvolution(car, playerCarId, difficulty) : Math.min(playerProgress.evolution || 0, car.evolutions.length - 1);
    const form = car.evolutions[evolution] || car.evolutions[0];
    const level = difficulty ? betaDifficultyLevel(playerCarId, difficulty) : (playerProgress.level || 1) - 3;
    const ratings = betaRatingsForCar(car.id, level, evolution, false);
    return {
      car,
      carId: car.id,
      form,
      evolution,
      level,
      ratings,
      skill: betaDifficultySkill(difficulty, gpTrainingSkill()),
      aggression: betaDifficultyAggression(difficulty)
    };
  });
}

function betaMatchedEvolutionIndexForLine(playerCarId, opponentLineId) {
  const playerLine = cars.find((car) => car.id === playerCarId);
  const opponentLine = cars.find((car) => car.id === opponentLineId);
  if (!playerLine || !opponentLine) return 0;
  const playerProgress = state.garage[playerCarId] || { evolution: 0 };
  const playerMax = Math.max(0, playerLine.evolutions.length - 1);
  const opponentMax = Math.max(0, opponentLine.evolutions.length - 1);
  if (!playerMax || !opponentMax) return 0;
  return Math.max(0, Math.min(opponentMax, Math.round(((playerProgress.evolution || 0) / playerMax) * opponentMax)));
}

function betaOpponentSetupForLine(lineId, playerCarId, skill = 1.06, difficulty = null) {
  const car = cars.find((item) => item.id === lineId);
  if (!car) return null;
  const evolution = betaDifficultyEvolution(car, playerCarId, difficulty);
  const form = car.evolutions[evolution] || car.evolutions[0];
  const level = betaDifficultyLevel(playerCarId, difficulty, true);
  return {
    car,
    carId: car.id,
    form,
    evolution,
    level,
    ratings: betaRatingsForCar(car.id, level, evolution, false),
    skill: betaDifficultySkill(difficulty, skill),
    aggression: betaDifficultyAggression(difficulty)
  };
}

function betaOpponentSetupForDriver(driver, playerCarId, fallback, skill = 1.06, difficulty = null) {
  const lineId = driver?.signatureLineId || (typeof npcSignatureLineIds === "object" ? npcSignatureLineIds[driver?.id] : "");
  return betaOpponentSetupForLine(lineId, playerCarId, skill, difficulty) || fallback;
}

function betaBossCarSetup(boss, difficulty = null) {
  const bossIndex = Math.max(0, bossChallengeBosses.findIndex((item) => item.id === boss.id));
  const playerCarId = betaCurrentCarId();
  const level = betaDifficultyLevel(playerCarId, difficulty, true);
  const knownLine = cars.find((car) => car.evolutions.some((form) => form.name === boss.car));
  if (knownLine) {
    const evolution = difficulty
      ? betaDifficultyEvolution(knownLine, playerCarId, difficulty)
      : Math.max(0, knownLine.evolutions.findIndex((form) => form.name === boss.car));
    const form = knownLine.evolutions[evolution] || knownLine.evolutions[0];
    return {
      car: knownLine,
      carId: knownLine.id,
      form,
      evolution,
      level,
      ratings: betaRatingsForCar(knownLine.id, level, evolution, false),
      skill: betaDifficultySkill(difficulty, 1),
      aggression: betaDifficultyAggression(difficulty)
    };
  }
  const ratingBase = Math.min(98, 72 + bossIndex * 3);
  const ratings = {
    speed: ratingBase + 2,
    acceleration: ratingBase,
    handling: ratingBase,
    torque: ratingBase + 1,
    body: ratingBase,
    powertrain: ratingBase + 2
  };
  return {
    car: { id: `boss-${boss.id}`, color: "#c084fc", family: boss.car },
    carId: `boss-${boss.id}`,
    form: {
      name: boss.car,
      images: {
        display: bossCarDisplayImage(boss),
        race: battleCarImageForBoss(boss),
        topdown: boss.carImage
      }
    },
    evolution: 0,
    level,
    ratings,
    skill: betaDifficultySkill(difficulty, 1),
    aggression: betaDifficultyAggression(difficulty)
  };
}

function betaTrackIdForStoryTrack(track = {}) {
  const map = {
    indianapolis: "indy",
    berlin: "berlin",
    dubai: "dubai",
    rio: "rio",
    "los-angeles": "la",
    seoul: "seoul",
    "cape-town": "safrica",
    bangalore: "india",
    space: "space",
    "training-school": "training"
  };
  return map[track.id] || track.id || "training";
}

function is2dStoryLevel(level) {
  return level?.type === "trial"
    || level?.type === "circuit"
    || level?.type === "boss"
    || level?.type === "pink-slip"
    || (level?.type === "rival" && level.mechanic === "circuitDuel");
}

function story2dModeForLevel(level) {
  if (level?.type === "trial") return "time";
  if (level?.type === "circuit") return level.circuitMode || "race4";
  return "duel";
}

function pinkSlipOpponentSetup(level, difficulty = null) {
  const car = cars.find((item) => item.id === level.pinkSlipCarId) || cars[0];
  const evolution = betaDifficultyEvolution(car, state.selectedStoryCar, difficulty);
  const form = car.evolutions[evolution] || car.evolutions[0];
  const levelValue = betaDifficultyLevel(state.selectedStoryCar, difficulty, true);
  return {
    driver: { id: `pink-${car.id}`, name: form.name, headshot: forgeMedallionSrc(car.id), image: forgeMedallionSrc(car.id) },
    car,
    carId: car.id,
    form,
    evolution,
    level: levelValue,
    ratings: betaRatingsForCar(car.id, levelValue, evolution, false),
    skill: betaDifficultySkill(difficulty, 1.03),
    aggression: betaDifficultyAggression(difficulty)
  };
}

function rivalOpponentSetup(level, difficulty = null) {
  const rival = rivalTuner();
  const lineId = rival?.signatureLineId || (typeof npcSignatureLineIds === "object" ? npcSignatureLineIds[rival?.id] : "");
  const setup = difficulty && lineId ? betaOpponentSetupForLine(lineId, state.selectedStoryCar, 1.04, difficulty) : null;
  const fallback = rivalCarSetup(state.selectedStoryCar);
  return {
    driver: rival,
    car: (setup || fallback).car,
    carId: (setup || fallback).carId,
    form: (setup || fallback).form,
    evolution: (setup || fallback).evolution,
    level: (setup || fallback).level,
    ratings: (setup || fallback).stats || (setup || fallback).ratings,
    skill: setup?.skill || betaDifficultySkill(difficulty, 1.04),
    aggression: setup?.aggression ?? betaDifficultyAggression(difficulty)
  };
}

function story2dOpponentsForLevel(level, mode = story2dModeForLevel(level), campaignIndex = null) {
  const selectedProgress = state.garage[state.selectedStoryCar] || {};
  const cacheKey = campaignIndex === null ? "" : `${campaignIndex}:${mode}:${state.selectedStoryCar}:${selectedProgress.evolution || 0}:${selectedTuner().id}`;
  if (cacheKey && story2dOpponentCache.has(cacheKey)) return story2dOpponentCache.get(cacheKey);
  let opponents = [];
  if (!betaModeConfigs[mode]?.opponents) return [];
  const difficulty = cityDifficultyForCampaignIndex(campaignIndex ?? level.campaignIndex ?? -1);
  const bossDifficulty = difficulty ? { ...difficulty, opponentLevel: (Number(difficulty.opponentLevel) || 1) + 1 } : null;
  if (level.type === "boss") opponents = [{ ...betaBossCarSetup(level.final ? finalBoss : bosses[level.bossIndex], bossDifficulty), driver: level.final ? finalBoss : bosses[level.bossIndex] }];
  else if (level.type === "pink-slip") opponents = [pinkSlipOpponentSetup(level, difficulty)];
  else if (level.type === "rival") opponents = [rivalOpponentSetup(level, difficulty)];
  else if (level.cityStructureEvent?.type === "story") {
    const plan = typeof cityStoryRacePlanFor === "function" ? cityStoryRacePlanFor(level.cityStructureEvent.cityId, level.cityStructureEvent.index) : null;
    const participantId = typeof cityStoryParticipantId === "function" ? cityStoryParticipantId(plan) : "";
    const driver = typeof cityStoryParticipantProfile === "function" ? cityStoryParticipantProfile(participantId) : null;
    const lineId = typeof cityStoryOpponentLineId === "function" ? cityStoryOpponentLineId(plan) : "";
    const named = lineId ? betaOpponentSetupForLine(lineId, state.selectedStoryCar, 1.03, difficulty) : null;
    const randomOpponents = getRandomOpponentCars(Math.max(0, betaModeConfigs[mode].opponents - (named ? 1 : 0)), state.selectedStoryCar, difficulty);
    opponents = (named ? [{ ...named, driver: driver || { id: participantId, name: named.form.name } }] : []).concat(randomOpponents.map((opponent, index) => {
      const fallbackDriver = betaNpcDriversForMode(mode)[index] || otherNpcProfiles[index % otherNpcProfiles.length];
      return {
        ...betaOpponentSetupForDriver(fallbackDriver, state.selectedStoryCar, opponent, 1.04 + Math.random() * 0.07, difficulty),
        driver: fallbackDriver
      };
    }));
  }
  else {
    const drivers = betaNpcDriversForMode(mode);
    const randomOpponents = getRandomOpponentCars(betaModeConfigs[mode].opponents, state.selectedStoryCar, difficulty);
    opponents = randomOpponents.map((opponent, index) => {
      const driver = drivers[index] || otherNpcProfiles[index % otherNpcProfiles.length];
      return {
        ...betaOpponentSetupForDriver(driver, state.selectedStoryCar, opponent, 1.04 + Math.random() * 0.07, difficulty),
        driver
      };
    });
  }
  if (cacheKey) story2dOpponentCache.set(cacheKey, opponents);
  return opponents;
}

function betaOrdinal(value) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  const suffix = mod10 === 1 && mod100 !== 11 ? "st" : mod10 === 2 && mod100 !== 12 ? "nd" : mod10 === 3 && mod100 !== 13 ? "rd" : "th";
  return `${value}${suffix}`;
}

function betaMakeImage(src, options = {}) {
  const img = new Image();
  if (options.measure) img.addEventListener("load", () => gearbornSpriteMetrics(img), { once: true });
  img.src = src || "";
  return img;
}

function betaImageReady(img) {
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    window.setTimeout(done, (typeof reduceMotionEnabled === "function" && reduceMotionEnabled()) ? 80 : 1400);
  });
}

async function preloadBetaRaceAssets() {
  const images = [
    ...Object.values(betaTileImages),
    ...Object.values(betaTrackImages || {}),
    ...Object.values(betaItemImages || {}),
    ...(betaState?.racers || []).map((racer) => racer.image)
  ].filter(Boolean);
  await ensureAssets(images.map((image) => typeof image === "string" ? image : image.src), { label: "Loading the race…" });
}

function setBetaLoading(active) {
  if (!el.betaLoading) return;
  // Shared ensureAssets() owns transition progress so warm-cache races do not flash a loader.
  el.betaLoading.hidden = true;
  el.betaLoading.classList.remove("active");
}

function selectBetaTrack(trackId) {
  const nextTrack = betaTrackById(trackId);
  betaSelectedTrackId = nextTrack.id;
  betaTrack = nextTrack;
  syncBetaTrackDerived();
  renderBetaTrackSelect();
}

function drawBetaTrackPreview(track = betaTrack) {
  drawBetaTrackPreviewTo(el.betaTrackPreview, track);
}

function drawBetaTrackPreviewTo(canvas, track = betaTrack) {
  if (!canvas || !track) return;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const w = canvas.width / ratio;
  const h = canvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const circuit = gpCircuit(track);
  ctx.fillStyle = circuit.theme.grass;
  ctx.fillRect(0, 0, w, h);
  const b = circuit.bounds;
  const pad = 14;
  const scale = Math.min((w - pad * 2) / (b.maxX - b.minX || 1), (h - pad * 2) / (b.maxY - b.minY || 1));
  ctx.save();
  ctx.translate((w - (b.maxX - b.minX) * scale) / 2 - b.minX * scale, (h - (b.maxY - b.minY) * scale) / 2 - b.minY * scale);
  ctx.scale(scale, scale);
  ctx.lineJoin = "round";
  ctx.strokeStyle = circuit.theme.runoff;
  ctx.lineWidth = 2 * (circuit.hw + GP_TUNING.curb + GP_TUNING.runoff);
  ctx.stroke(circuit.path);
  ctx.strokeStyle = "#e23b3b";
  ctx.lineWidth = 2 * (circuit.hw + GP_TUNING.curb);
  ctx.stroke(circuit.path);
  ctx.strokeStyle = "#30343b";
  ctx.lineWidth = 2 * circuit.hw;
  ctx.stroke(circuit.path);
  const s0 = gpPointAt(circuit, 0, 0);
  ctx.fillStyle = "#ffc857";
  ctx.beginPath();
  ctx.arc(s0.x, s0.y, circuit.hw * 1.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// City icon mapping for each track
const betaTrackCityIcons = {
  training: "assets/maps/cityicon-training.png",
  indy:     "assets/maps/cityicon-indianapolis.png",
  berlin:   "assets/maps/cityicon-berlin.png",
  dubai:    "assets/maps/cityicon-dubai.png",
  rio:      "assets/maps/cityicon-rio.png",
  la:       "assets/maps/cityicon-los-angeles.png",
  seoul:    "assets/maps/cityicon-seoul.png",
  safrica:  "assets/maps/cityicon-cape-town.png",
  india:    "assets/maps/cityicon-bangalore.png",
  space:    "assets/maps/cityicon-space.png",
};

// 5C: Training map select: every circuit drawn as its full road map, like the Crashout ring picker.
function renderBetaTrackSelect() {
  if (!el.betaTrackList) return;
  const tracks = betaSelectableTracks(betaPendingMode);
  el.betaTrackList.innerHTML = tracks.map((track) => {
    const icon = betaTrackCityIcons[track.id] || "";
    const isActive = track.id === betaSelectedTrackId;
    return `
      <button class="beta-city-tile beta-map-tile ${isActive ? "active" : ""}" data-beta-track="${track.id}" type="button" aria-label="${track.name}">
        <canvas class="beta-map-tile-canvas" data-beta-map-canvas="${track.id}" aria-hidden="true"></canvas>
        <span class="beta-map-tile-name">${icon ? `<img src="${icon}" alt="" loading="lazy" onerror="this.remove()">` : ""}<span>${track.name}</span></span>
      </button>
    `;
  }).join("");
  requestAnimationFrame(() => {
    el.betaTrackList.querySelectorAll("[data-beta-map-canvas]").forEach((canvas) => {
      drawBetaTrackPreviewTo(canvas, betaTrackById(canvas.dataset.betaMapCanvas, betaPendingMode));
    });
  });
}

function betaDriverPortraitMarkup(driver) {
  const name = driver?.name || "Racer";
  const image = driver?.headshot || driver?.image || "";
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return `
    <span class="beta-racer-head ${image ? "" : "placeholder"}">
      ${image ? `<img src="${image}" alt="${name}" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('placeholder'); this.remove();">` : ""}
      <em>${initials}</em>
    </span>
  `;
}

function betaNpcDriversForMode(mode) {
  if (mode === "duel") return [betaDuelDrivers()[betaDuelDriverIndex % betaDuelDrivers().length] || rivalTuner()];
  const eli = otherNpcProfiles.find((profile) => profile.id === "eli-kaufman") || otherNpcProfiles[0];
  if (mode === "race6") return otherNpcProfiles.slice(0, 5);
  const others = otherNpcProfiles.filter((profile) => profile.id !== "eli-kaufman").sort(() => Math.random() - 0.5);
  return [eli].concat(others.slice(0, 2));
}

function betaDuelDrivers() {
  return [rivalTuner()].concat(bossChallengeBosses);
}

// 5C: Training Academy Gear Prix / Time Trial opponents (was 1.04-1.11 field, 0.98 duel).
const GP_TRAINING_SKILL = { min: 0.93, max: 0.98, duel: 0.94 };
function gpTrainingSkill() {
  return GP_TRAINING_SKILL.min + Math.random() * (GP_TRAINING_SKILL.max - GP_TRAINING_SKILL.min);
}

function betaOpponentSetForMode(mode) {
  const config = betaModeConfigs[mode] || betaModeConfigs.time;
  if (!config.opponents) return [];
  if (mode === "duel") {
    const driver = betaDuelDrivers()[betaDuelDriverIndex % betaDuelDrivers().length] || rivalTuner();
    const setup = driver.id === rivalTuner().id
      ? rivalCarSetup(betaCurrentCarId())
      : betaBossCarSetup(driver);
    return [{
      driver,
      car: setup.car,
      carId: setup.carId,
      form: setup.form,
      evolution: setup.evolution,
      level: setup.level,
      ratings: setup.stats || setup.ratings,
      skill: GP_TRAINING_SKILL.duel
    }];
  }
  const drivers = betaNpcDriversForMode(mode);
  const randomOpponents = getRandomOpponentCars(config.opponents, betaCurrentCarId());
  return randomOpponents.map((opponent, index) => {
    const driver = drivers[index] || otherNpcProfiles[index % otherNpcProfiles.length];
    return {
      ...betaOpponentSetupForDriver(driver, betaCurrentCarId(), opponent, gpTrainingSkill()),
      driver
    };
  });
}

function openBetaPreview(mode = betaPendingMode || "time", preserveOpponents = false) {
  betaPendingMode = mode;
  betaPreviewMode = mode;
  betaTrack = betaTrackById(betaSelectedTrackId, mode);
  betaSelectedTrackId = betaTrack.id;
  syncBetaTrackDerived();
  if (!preserveOpponents || betaPreviewOpponents.length !== (betaModeConfigs[mode]?.opponents || 0)) {
    betaPreviewOpponents = betaOpponentSetForMode(mode);
  }
  showBetaScreen("beta-preview-screen");
  renderBetaPreview();
}

function betaLeaderboardRow({ driver, form, car, player = false, opponentIndex = null }) {
  const carImage = imageFor(form, "display");
  return `
    <div class="beta-leaderboard-row ${player ? "player selectable" : ""} ${opponentIndex !== null ? "selectable" : ""}" ${opponentIndex !== null ? `data-beta-preview-opponent="${opponentIndex}"` : ""} ${player ? "data-beta-preview-car-row" : ""}>
      ${betaDriverPortraitMarkup(driver)}
      <div class="beta-leaderboard-car">${displayMarkup(carImage, form?.name || "GearBorn", car?.color || "#ffc857")}</div>
      <div class="beta-leaderboard-copy">
        <strong>${driver?.name || "Racer"}</strong>
        <span>${form?.name || "GearBorn"}</span>
      </div>
    </div>
  `;
}

function renderBetaPreview() {
  const config = betaModeConfigs[betaPreviewMode] || betaModeConfigs.time;
  if (el.betaPreviewTitle) el.betaPreviewTitle.textContent = config.label || "Race Preview";
  const trackIcon = betaTrackCityIcons[betaTrack.id] || "";
  if (el.betaPreviewCity) {
    el.betaPreviewCity.innerHTML = `${trackIcon ? `<img src="${trackIcon}" alt="" loading="lazy" decoding="async">` : ""}<span>${betaTrack.name}</span>`;
  }
  if (el.betaCityMenu) {
    const customTracks = betaSavedTracksAvailableForMode(config.id) ? betaCustomTracks() : [];
    el.betaCityMenu.innerHTML = `
      <div class="beta-city-menu-section">
        <span>City Tracks</span>
        ${betaTracks.map((track) => {
      const icon = betaTrackCityIcons[track.id] || "";
      return `<button class="${track.id === betaTrack.id ? "active" : ""}" data-beta-preview-track="${track.id}" type="button">${icon ? `<img src="${icon}" alt="">` : ""}<span>${track.name}</span></button>`;
    }).join("")}
      </div>
      ${customTracks.length ? `
        <label class="beta-custom-track-picker">
          <span>Saved Tracks</span>
          <select data-beta-custom-track-select>
            <option value="">Choose saved track</option>
            ${customTracks.map((track) => `<option value="${track.id}" ${track.id === betaTrack.id ? "selected" : ""}>${track.name}</option>`).join("")}
          </select>
        </label>
      ` : ""}
    `;
  }
  drawBetaTrackPreviewTo(el.betaPreviewMap, betaTrack);
  const playerCar = cars.find((car) => car.id === betaCurrentCarId()) || cars[0];
  const playerForm = currentEvolution(playerCar.id);
  if (config.id === "time") {
    const best = state.betaTimeTrials?.[betaTrack.id]?.gp ? state.betaTimeTrials[betaTrack.id].bestTime : null;
    el.betaLeaderboard.innerHTML = `
      <div class="beta-time-preview">
        ${betaLeaderboardRow({ driver: selectedTuner(), form: playerForm, car: playerCar, player: true })}
        ${timeMedals.map((medal) => `<div class="reward-row compact"><span class="medal-text ${medal.key}">${medal.label}</span><strong>${medal.base.toFixed(2)} s</strong></div>`).join("")}
        <div class="reward-row compact"><span>Phantaxi</span><strong>${best ? `${best.toFixed(2)} s` : "No ghost yet"}</strong></div>
      </div>
    `;
    return;
  }
  el.betaLeaderboard.innerHTML = betaPreviewOpponents.map((opponent) => betaLeaderboardRow({
    driver: opponent.driver,
    form: opponent.form,
    car: opponent.car,
    opponentIndex: config.id === "duel" ? 0 : null
  })).join("") + betaLeaderboardRow({ driver: selectedTuner(), form: playerForm, car: playerCar, player: true });
}

// ── Beta screen navigation: show exactly one beta screen at a time ────────────
function showBetaScreen(screenId) {
  ["beta-intro", "beta-car-select-screen", "beta-preview-screen", "beta-track-select-screen"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = !screenId || id !== screenId;
  });
}

function openBetaTrackSelect(mode = "time") {
  betaPendingMode = mode;
  const modeLabels = { time: "Solo Time Trial", race4: "4-Car Race", race6: "6-Car Race", duel: "Head-to-Head" };
  if (el.betaTrackSelectTitle) el.betaTrackSelectTitle.textContent = `${modeLabels[mode] || "Race"} · Choose a Map`;
  showBetaScreen("beta-track-select-screen");
  renderBetaTrackSelect();
}

function closeBetaTrackSelect() {
  // 5C: Back from the map select → Time Trial returns to the Training Academy, races to the format choice.
  if (betaPendingMode === "time") {
    showView("solo");
    return;
  }
  openBetaIntro();
}

function openBetaCarSelect(mode) {
  if (mode) betaPendingMode = mode;
  showBetaScreen("beta-car-select-screen");
  renderCarTiles();
  renderCarSelectPreview("beta", el.betaCarSelectPreview);
}

function closeBetaCarSelect() {
  if (betaReturningToPreview) {
    betaReturningToPreview = false;
    openBetaPreview(betaPendingMode, true);
    return;
  }
  showBetaScreen("beta-intro");
}

function betaStartPosition(index, totalRacers = 1) {
  return gpStartPosition(index, totalRacers);
}

function betaStartLineCrossed(racer) {
  return false;
}

function betaProgressRacer(racer) {
  gpProgressRacer(racer);
}

function betaTimeMedalForElapsed(elapsed) {
  // Medal times are set for an Indy-length lap; longer circuits get proportionally more time.
  const circuit = typeof gpCircuit === "function" ? gpCircuit() : null;
  const scale = circuit ? Math.max(0.8, circuit.length / 17400) : 1;
  const match = timeMedals.find((medal) => elapsed <= medal.base * scale);
  return match?.key || "none";
}

function betaProgressScore(racer) {
  return gpProgressScore(racer);
}

function betaPlacements() {
  return [...(betaState?.racers || [])].sort((a, b) => betaProgressScore(b) - betaProgressScore(a));
}

function betaCollisionCorners(racer) {
  const halfLength = GP_TUNING.car.halfLength;
  const halfWidth = GP_TUNING.car.halfWidth;
  const forward = { x: Math.cos(racer.angle), y: Math.sin(racer.angle) };
  const right = { x: -Math.sin(racer.angle), y: Math.cos(racer.angle) };
  return [
    { x: racer.x + forward.x * halfLength + right.x * halfWidth, y: racer.y + forward.y * halfLength + right.y * halfWidth },
    { x: racer.x + forward.x * halfLength - right.x * halfWidth, y: racer.y + forward.y * halfLength - right.y * halfWidth },
    { x: racer.x - forward.x * halfLength - right.x * halfWidth, y: racer.y - forward.y * halfLength - right.y * halfWidth },
    { x: racer.x - forward.x * halfLength + right.x * halfWidth, y: racer.y - forward.y * halfLength + right.y * halfWidth }
  ];
}

function betaProjectCorners(corners, axis) {
  let min = Infinity;
  let max = -Infinity;
  corners.forEach((point) => {
    const value = point.x * axis.x + point.y * axis.y;
    min = Math.min(min, value);
    max = Math.max(max, value);
  });
  return { min, max };
}

function betaCarContact(a, b) {
  if (!a || !b) return null;
  const broad = Math.hypot(b.x - a.x, b.y - a.y);
  if (broad > 88) return null;
  const cornersA = betaCollisionCorners(a);
  const cornersB = betaCollisionCorners(b);
  const axes = [
    { x: Math.cos(a.angle), y: Math.sin(a.angle) },
    { x: -Math.sin(a.angle), y: Math.cos(a.angle) },
    { x: Math.cos(b.angle), y: Math.sin(b.angle) },
    { x: -Math.sin(b.angle), y: Math.cos(b.angle) }
  ];
  let bestOverlap = Infinity;
  let bestAxis = axes[0];
  for (const axis of axes) {
    const projectedA = betaProjectCorners(cornersA, axis);
    const projectedB = betaProjectCorners(cornersB, axis);
    const overlap = Math.min(projectedA.max, projectedB.max) - Math.max(projectedA.min, projectedB.min);
    if (overlap <= 0) return null;
    if (overlap < bestOverlap) {
      bestOverlap = overlap;
      bestAxis = axis;
    }
  }
  const towardB = (b.x - a.x) * bestAxis.x + (b.y - a.y) * bestAxis.y;
  const normal = towardB >= 0 ? bestAxis : { x: -bestAxis.x, y: -bestAxis.y };
  return { normal, depth: bestOverlap };
}

function betaResolveCarCollisions() {
  const now = betaNowMs();
  const racers = betaState.racers.filter((racer) => !racer.finished);
  for (let i = 0; i < racers.length; i += 1) {
    for (let j = i + 1; j < racers.length; j += 1) {
      const a = racers[i];
      const b = racers[j];
      if ((a.respawnUntil && a.respawnUntil > now) || (b.respawnUntil && b.respawnUntil > now)) continue;
      const contact = betaCarContact(a, b);
      if (!contact) continue;
      const push = Math.min(16, contact.depth / 2 + 1.5);
      const nx = contact.normal.x;
      const ny = contact.normal.y;
      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;
      const va = { x: Math.cos(a.angle) * a.speed, y: Math.sin(a.angle) * a.speed };
      const vb = { x: Math.cos(b.angle) * b.speed, y: Math.sin(b.angle) * b.speed };
      const closingSpeed = (vb.x - va.x) * nx + (vb.y - va.y) * ny;
      if ((a.id === "player" || b.id === "player") && betaState?.racers) {
        const impact = Math.hypot(vb.x - va.x, vb.y - va.y);
        raceJuiceImpactFeedback(impact, (a.x + b.x) / 2, (a.y + b.y) / 2, {
          big: impact >= RACE_JUICE_TUNING.hitstopImpactThreshold
        });
      }
      if (closingSpeed < -22) {
        a.speed *= 0.9 + Math.min(0.08, a.physics.body / 1200);
        b.speed *= 0.9 + Math.min(0.08, b.physics.body / 1200);
      }
    }
  }
}

function betaRecordGhostSample(now) {
  if (betaState.config.id !== "time" || !betaState.active || betaState.player.finished) return;
  if (now - betaState.player.lastRecord < 100) return;
  betaState.player.lastRecord = now;
  betaState.player.record.push({
    t: Math.round(betaState.elapsed * 1000),
    x: Math.round(betaState.player.x),
    y: Math.round(betaState.player.y),
    angle: Number(betaState.player.angle.toFixed(3))
  });
}

function betaGhostPointAt(elapsed) {
  const ghost = betaState?.ghost;
  if (!ghost?.length) return null;
  const t = elapsed * 1000;
  let nextIndex = ghost.findIndex((point) => point.t >= t);
  if (nextIndex < 0) return ghost[ghost.length - 1];
  if (nextIndex === 0) return ghost[0];
  const a = ghost[nextIndex - 1];
  const b = ghost[nextIndex];
  const mix = (t - a.t) / Math.max(1, b.t - a.t);
  return {
    x: a.x + (b.x - a.x) * mix,
    y: a.y + (b.y - a.y) * mix,
    angle: a.angle + (b.angle - a.angle) * mix
  };
}

function finishBetaDemo() {
  if (!betaState || betaState.finished) return;
  gpHidePause();
  betaState.finished = true;
  betaState.active = false;
  if (betaState.raf) cancelAnimationFrame(betaState.raf);
  const placements = betaPlacements();
  const placement = placements.findIndex((racer) => racer.id === "player") + 1;
  const elapsed = betaState.elapsed;
  let resultLine = `Final time: ${elapsed.toFixed(2)} s`;
  const context = betaState.context || null;
  const timeMedal = betaState.config.id === "time" ? betaTimeMedalForElapsed(elapsed) : "none";
  let success = betaState.config.id === "time" ? normalizeMedal(timeMedal) !== "none" : placement <= betaState.config.goalRank;
  if (betaState.config.id === "time") {
    const saved = state.betaTimeTrials?.[betaTrack.id];
    const previous = saved?.gp ? saved.bestTime : null;
    const isBest = !previous || elapsed < previous;
    if (isBest) {
      state.betaTimeTrials = state.betaTimeTrials || {};
      state.betaTimeTrials[betaTrack.id] = {
        bestTime: elapsed,
        ghost: betaState.player.record.slice(0, 900),
        gp: true
      };
      saveState();
    }
    resultLine = `Final time: ${elapsed.toFixed(2)} s · ${success ? `${medalLabel(timeMedal)} Medal` : "No Medal"} · Best: ${(isBest ? elapsed : previous).toFixed(2)} s${isBest ? " · New Best!" : ""}`;
  } else {
    resultLine = betaState.config.id === "duel"
      ? `${betaOrdinal(placement)} · ${success ? "Success" : "Failed"}`
      : `${betaOrdinal(placement)} · ${betaState.config.goalLabel} · ${success ? "Success" : "Failed"}`;
  }
  if (context?.source === "story") {
    el.betaResults.hidden = true;
    finishStory2dRace(context, success, placement, elapsed, resultLine);
  } else if (context?.source === "tutorial") {
    el.betaResults.hidden = true;
    finishTutorialHeadToHeadRace(context, success, placement, elapsed, resultLine);
  } else if (context?.source === "gauntlet") {
    el.betaResults.hidden = true;
    finishGauntlet2dRace(context, success, placement, elapsed, resultLine);
  } else {
    const betaMedal = calculateMedalForRace({ won: success, placement, medalKey: timeMedal }, { type: betaState.config.id });
    const betaMedalResult = saveBestMedalForEvent(`beta:${context?.source || "prototype"}:${betaState.config.id}:${betaTrack.id}`, betaMedal);
    if (normalizeMedal(betaMedal) !== "none") {
      resultLine += ` · ${medalLabel(betaMedalResult.medal)}${betaMedalResult.improved ? " · NEW BEST" : ""}`;
      if (betaMedalResult.improved) playAudioCue("medalReveal");
    }
    evaluateMicroObjectives({ eventId: `beta:${betaState.config.id}:${betaTrack.id}`, won: success, placement, elapsed });
    saveState();
    el.betaFinalTime.textContent = resultLine;
    el.betaResults.hidden = false;
  }
  drawBetaFrame();
}

function finishGauntlet2dRace(context, won, placement, elapsed, resultLine) {
  const carId = betaState.player.carId;
  recordRaceUsage(carId);
  recordStoryRaceOutcome(won, false);
  saveState();
  showRaceResult(el.betaRace, {
    won,
    sprox: 0,
    hideSprox: true,
    lines: [resultLine],
    primaryLabel: "Next",
    raceAgainLabel: "Try Again",
    onRaceAgain: () => startGauntlet2dRace(context.cityId),
    onPrimary: () => {
      completeGauntletStage(won);
      betaRaceContext = null;
      finishStoryRaceScreen();
    }
  });
}

function story2dReward(level) {
  if (level.type === "trial") return timeMedals[timeMedals.length - 1].xp;
  if (level.type === "circuit") return level.xp || 120;
  if (level.type === "rival") return level.xp || 160;
  if (level.type === "pink-slip") return level.drag?.xp || 180;
  if (level.type === "boss") return (level.final ? finalBoss : bosses[level.bossIndex])?.xp || 260;
  return 80;
}

function finishStory2dRace(context, won, placement, elapsed, resultLine) {
  const level = context.level;
  const carId = betaState.player.carId;
  const riskyPinkSlipLoss = !won && isPinkSlipRiskActive(level);
  let earned = won ? story2dReward(level) : Math.floor(story2dReward(level) * 0.16);
  if (earned) addSprox(earned);
  recordRaceUsage(carId);
  if (level.type === "rival") recordTunerStat(won ? "headToHeadWon" : "headToHeadLost");
  else if (level.type === "trial") recordTunerStat("timeTrialsCompleted");
  recordStoryRaceOutcome(won, true);
  let penaltyLine = "";
  if (riskyPinkSlipLoss) {
    applyPinkSlipLossPenalty(carId);
    penaltyLine = "You lost the Pink Slip race. Your GearBorn has been returned to Level 1 and its equipped parts were taken.";
  }
  const partReward = won ? rollStoryPartReward() : null;
  if (won) completeCampaignLevel(context.campaignLevelIndex);
  const medalResult = saveStoryMedal(context.campaignLevelIndex, { won, placement });
  evaluateMicroObjectives({ eventId: storyEventId(context.campaignLevelIndex), won, placement, elapsed });
  saveState();
  showRaceResult(el.betaRace, {
    won,
    sprox: earned,
    medal: medalResult.medal,
    medalImproved: medalResult.improved,
    lines: [resultLine, penaltyLine, partReward ? partRewardResultMarkup(partReward) : ""].filter(Boolean),
    primaryLabel: "Next",
    raceAgainLabel: "Race Again",
    onRaceAgain: () => startStory2dRace(context.campaignLevelIndex, level),
    onPrimary: () => {
      const finishStory = () => {
        betaRaceContext = null;
        finishStoryRaceScreen();
      };
      if (won && level.cityStructureEvent?.type === "story") {
        finishRuntimeStoryWithPost(level, finishStory);
        return;
      }
      if (won && level.type === "rival") {
        openRivalDialogue(level, "post", finishStory);
        return;
      }
      finishStory();
    }
  });
}

function finishTutorialHeadToHeadRace(context, won, placement, elapsed, resultLine) {
  state.tutorialTimeMedal = won ? "Gold" : "";
  if (won) {
    setTutorialScene(context.nextScene || "head2head-win");
  }
  saveState();
  showRaceResult(el.betaRace, {
    won,
    title: won ? "VICTORY" : "RACE LOST",
    sprox: 0,
    hideSprox: true,
    lines: [resultLine],
    primaryLabel: won ? "NEXT" : "Try Again",
    primaryTone: won ? "success" : "",
    raceAgainLabel: "Try Again",
    hideRaceAgain: true,
    disableActions: won,
    onPrimary: () => {
      if (!won) startTutorialHeadToHeadRace();
    }
  });
  renderTutorial();
}

function betaTileIsHorizontal(tile) {
  if (!tile) return true;
  if (tile.type === "road_straight") return tile.rotation !== 90 && tile.rotation !== 270;
  return true; // default horizontal
}

function drawBetaMarkers(ctx) {
  // The start/finish band is drawn with the circuit (gpDrawCircuit).
}

function drawBetaGhost(ctx) {
  ctx.save();
  ctx.globalAlpha = 0.42;
  ctx.translate(betaState.ghostPoint.x, betaState.ghostPoint.y);
  ctx.rotate(betaState.ghostPoint.angle + Math.PI / 2);
  ctx.fillStyle = "#68e8ff";
  ctx.shadowColor = "#68e8ff";
  ctx.shadowBlur = 18;
  ctx.fillRect(-18, -34, 36, 68);
  ctx.restore();
}

function drawBetaDebug(ctx) {
  const circuit = gpCircuit();
  if (!circuit) return;
  ctx.save();
  ctx.strokeStyle = "rgba(82,199,255,.8)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  circuit.line.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.stroke();
  betaState.racers.filter((racer) => racer.ai && racer.gp).forEach((racer) => {
    const look = GP_TUNING.ai.lookBase + Math.max(0, racer.speed) * GP_TUNING.ai.lookPerSpeed;
    const p = gpPointAt(circuit, racer.gp.dist + look, racer.gp.intent);
    ctx.fillStyle = "#ffc857";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

el.betaOptions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-beta-mode]");
  if (!button) return;
  if (betaRaceContext?.source === "training") openBetaTrackSelect(button.dataset.betaMode);
  else openBetaPreview(button.dataset.betaMode);
});

el.betaTrackList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-beta-track]");
  if (!button) return;
  betaSelectedTrackId = betaTrackById(button.dataset.betaTrack, betaPendingMode).id;
  openBetaPreview(betaPendingMode);
});

el.betaTrackStart?.addEventListener("click", () => {
  startBetaDemo(betaPendingMode);
});

el.betaTrackBack?.addEventListener("click", () => {
  closeBetaTrackSelect();
});

el.betaPreviewBack?.addEventListener("click", () => {
  if (betaRaceContext?.source === "training") openBetaTrackSelect(betaPreviewMode || betaPendingMode);
  else showBetaScreen("beta-intro");
});

el.betaPreviewStart?.addEventListener("click", () => {
  startBetaDemo(betaPreviewMode || betaPendingMode);
});

el.betaPreviewCar?.addEventListener("click", () => {
  betaReturningToPreview = true;
  openBetaCarSelect(betaPreviewMode || betaPendingMode);
});

el.betaPreviewCity?.addEventListener("click", () => {
  if (el.betaCityMenu) el.betaCityMenu.hidden = !el.betaCityMenu.hidden;
});

el.betaCityMenu?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-beta-preview-track]");
  if (!button) return;
  selectBetaTrack(button.dataset.betaPreviewTrack);
  el.betaCityMenu.hidden = true;
  renderBetaPreview();
});

el.betaCityMenu?.addEventListener("change", (event) => {
  const select = event.target.closest("[data-beta-custom-track-select]");
  if (!select || !select.value) return;
  selectBetaTrack(select.value);
  el.betaCityMenu.hidden = true;
  renderBetaPreview();
});

el.betaLeaderboard?.addEventListener("click", (event) => {
  const carRow = event.target.closest("[data-beta-preview-car-row]");
  if (carRow) {
    betaReturningToPreview = true;
    openBetaCarSelect(betaPreviewMode || betaPendingMode || "time");
    return;
  }
  const row = event.target.closest("[data-beta-preview-opponent]");
  if (!row || betaPreviewMode !== "duel") return;
  betaDuelDriverIndex = (betaDuelDriverIndex + 1) % betaDuelDrivers().length;
  betaPreviewOpponents = betaOpponentSetForMode("duel");
  renderBetaPreview();
});

// Item definitions — icon is image path; fallback color used if image missing
const betaItemDefinitions = [
  { id: "turbo",    name: "Insano-Mode", icon: "assets/items/item-insano-mode.png",  color: "#ff6b1a" },
  { id: "shield",   name: "Big Bubba",   icon: "assets/items/item-big-bubba.png",    color: "#52c7ff" },
  { id: "oil",      name: "Oil Slick",   icon: "assets/items/oil_slick.png",         color: "#252b35" },
  { id: "tire",     name: "Spike Strip", icon: "assets/items/item-spike-strip.png",  color: "#ff3f3f" },
  { id: "burst",    name: "EMP Pulse",   icon: "assets/items/item-emp-pulse.png",    color: "#c084fc" },
  { id: "teleport", name: "Teleport",    icon: "assets/items/item-teleport.png",     color: "#6ee7a8" }
];

// Multi-race only items (not available in duel / time trial)
const betaMultiRaceOnlyItems = new Set(["teleport"]);

const betaItemImages = {};
betaItemDefinitions.forEach((def) => {
  betaItemImages[def.id] = betaMakeImage(def.icon);
});

const betaTrackImages = {
  itemBox:           betaMakeImage("assets/tracks/item_box.png"),
  boostPad:          betaMakeImage("assets/tracks/boost_pad.png"),
  oilSlick:          betaMakeImage("assets/items/oil_slick.png"),
  spikeStrip:        betaMakeImage("assets/items/spike-strip.png"),
  empWave:           betaMakeImage("assets/items/emp-pulse-wave.png"),
  insanoFlames:      betaMakeImage("assets/items/insano-flames.png"),
  bubbaBubble:       betaMakeImage("assets/items/big-bubba-bubble.png"),
  teleportPortal:    betaMakeImage("assets/items/teleport-portal.png"),
  barrel:            betaMakeImage("assets/beta3d/obstacle_barrel.png"),
  cone:              betaMakeImage("assets/beta3d/obstacle_cone.png"),
  startFinish:       betaMakeImage("assets/tracks/start-finish-line.png"),
  checkpointNeutral: betaMakeImage("assets/tracks/checkpoint-neutral.png"),
  checkpointActive:  betaMakeImage("assets/tracks/checkpoint-active.png")
};

let betaAiRacingLine = betaTrack.aiLine;

function betaWorldPoint(point) {
  return { x: point.x * betaTileSize, y: point.y * betaTileSize };
}

function createBetaObjects(config) {
  return gpCreateObjects(config);
}

function betaRandomItemForRacer(racer) {
  // Build pool: exclude multi-race-only items in duel/time mode
  const modeId = betaState?.config?.id || "time";
  const isMultiRace = modeId === "race4" || modeId === "race6";
  const pool = betaItemDefinitions.filter((def) => isMultiRace || !betaMultiRaceOnlyItems.has(def.id));
  return pool[Math.floor(Math.random() * pool.length)];
}

function betaNowMs() {
  return (betaState?.elapsed || 0) * 1000;
}

function betaDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function betaBehindPoint(racer, distance = 64) {
  return {
    x: racer.x - Math.cos(racer.angle) * distance,
    y: racer.y - Math.sin(racer.angle) * distance
  };
}

function betaFrontPoint(racer, distance = 58) {
  return {
    x: racer.x + Math.cos(racer.angle) * distance,
    y: racer.y + Math.sin(racer.angle) * distance
  };
}

function betaNotify(message, duration = 1500) {
  if (!betaState) return;
  betaState.notification = message;
  betaState.notificationUntil = betaNowMs() + duration;
}

function betaPlayerHazardJuice(racer) {
  if (!betaState || racer?.id !== "player") return;
  if (juiceEnabled()) {
    betaState.shake = Math.max(betaState.shake || 0, 8);
    raceJuiceSpawnSparks(racer.x, racer.y, 8);
  }
  raceJuiceHaptic([25, 20, 25]);
}

const GP_EMP_ENGINE_CUT_MS = 2000;

function betaApplyHit(racer, effect = "slow", strength = 1, source = "hazard") {
  if (!racer || racer.finished || racer.ghost) return;
  const now = betaNowMs();
  // Big Bubba blocks ALL penalties (grass slowdown included)
  if (racer.shieldUntil > now) {
    // EMP dissipates on shield hit; shield consumed
    if (source === "projectile") {
      racer.shieldUntil = 0;
      if (racer.id === "player") betaNotify("Big Bubba blocked the EMP!");
    }
    // All other hits blocked silently; shield stays intact
    return;
  }
  const bodyReducer = Math.max(0.48, 1 - (racer.physics.body || 70) / 260);
  const handlingReducer = Math.max(0.42, 1 - (racer.ratings.handling || 70) / 260);
  if (effect === "spin") {
    racer.spinUntil = Math.max(racer.spinUntil || 0, now + (1050 + strength * 550) * handlingReducer);
    racer.speed *= Math.max(0.35, 0.68 - strength * 0.08 * bodyReducer);
  } else if (effect === "burst") {
    racer.slowUntil = Math.max(racer.slowUntil || 0, now + (1000 + strength * 450) * bodyReducer);
    if (source === "projectile") {
      racer.engineCutUntil = Math.max(racer.engineCutUntil || 0, now + GP_EMP_ENGINE_CUT_MS + strength * 300 * bodyReducer);
      if (racer.id === "player") betaNotify("EMP! Engine cut", GP_EMP_ENGINE_CUT_MS);
    }
    racer.speed *= Math.max(0.42, 0.74 - strength * 0.09 * bodyReducer);
  } else {
    racer.slowUntil = Math.max(racer.slowUntil || 0, now + (850 + strength * 430) * bodyReducer);
    racer.speed *= Math.max(0.46, 0.78 - strength * 0.08 * bodyReducer);
  }
  racer.hitFlashUntil = now + 280;
}

function betaUseItem(racer) {
  if (!betaState?.active || betaState.finished || !racer?.item || racer.finished) return false;
  const now = betaNowMs();
  if (racer.spinUntil > now) {
    if (racer.id === "player") betaNotify("You're spinning!");
    return false;
  }
  const item = racer.item;
  const pwr = racer.physics.pwrMultiplier || 1.16;
  racer.item = null;
  racer.itemCooldownUntil = now + 800;

  // ── Insano-Mode (turbo) ──────────────────────────────────────
  if (item.id === "turbo") {
    racer.boostUntil = Math.max(racer.boostUntil || 0, now + 1350 * pwr);
    racer.speed = Math.min(racer.physics.maxSpeed * (1.16 + pwr * 0.12), racer.speed + 130 * pwr);

  // ── Big Bubba (shield) ───────────────────────────────────────
  } else if (item.id === "shield") {
    racer.shieldUntil = Math.max(racer.shieldUntil || 0, now + 5000);

  // ── Oil Slick ────────────────────────────────────────────────
  } else if (item.id === "oil") {
    const point = betaBehindPoint(racer, 62);
    betaState.objects.traps.push({
      id: `trap-${Date.now()}-${Math.random()}`,
      type: "oil",
      source: "item",           // player/AI dropped → single-trigger
      owner: racer.id,
      x: point.x,
      y: point.y,
      armedAt: now + 360,
      expiresAt: now + 18000,
      radius: 36
    });

  // ── Spike Strip (tire) ───────────────────────────────────────
  } else if (item.id === "tire") {
    const point = betaBehindPoint(racer, 62);
    betaState.objects.traps.push({
      id: `trap-${Date.now()}-${Math.random()}`,
      type: "tire",
      source: "item",           // always single-trigger
      owner: racer.id,
      x: point.x,
      y: point.y,
      armedAt: now + 360,
      expiresAt: now + 18000,
      radius: 32
    });

  // ── EMP Pulse (burst) ────────────────────────────────────────
  } else if (item.id === "burst") {
    const point = betaFrontPoint(racer, 62);
    const speed = 760 * pwr;
    betaState.objects.projectiles.push({
      id: `emp-${Date.now()}-${Math.random()}`,
      owner: racer.id,
      x: point.x,
      y: point.y,
      vx: Math.cos(racer.angle) * speed,
      vy: Math.sin(racer.angle) * speed,
      angle: racer.angle,
      power: pwr,
      expiresAt: now + 1200
    });

  // ── Teleport ─────────────────────────────────────────────────
  } else if (item.id === "teleport") {
    betaExecuteTeleport(racer, now);
  }

  if (racer.id === "player") updateBetaItemHud();
  return true;
}

// ── Teleport logic ────────────────────────────────────────────────────────────
// 4B rules: trailing racers warp to the leader while the leader sends second back.
// Circuit state is updated with position so laps and placements remain correct.
function betaExecuteTeleport(racer, now) {
  const circuit = gpCircuit();
  const finishDist = betaLapsRequired * circuit.length;
  const placements = betaPlacements();
  const racerIdx = placements.findIndex((r) => r.id === racer.id);
  const others = placements.filter((r) => r.id !== racer.id);
  const nearFinish = finishDist - GP_TUNING.teleport.beforeFinish;
  const g = gpRacer(racer);
  if (others.length && others.every((r) => r.finished)) {
    gpScheduleWarp(racer, () => Math.max(g.dist, nearFinish), 0, now);
    return;
  }
  if (racerIdx > 0) {
    const leader = placements.slice(0, racerIdx).find((r) => !r.finished);
    if (!leader) {
      gpScheduleWarp(racer, () => Math.max(g.dist, nearFinish), 0, now);
      return;
    }
    const leaderGp = gpRacer(leader);
    const side = (leaderGp.lateral || 0) > 0 ? -1 : 1;
    gpScheduleWarp(racer, () => Math.max(g.dist, leaderGp.dist - GP_TUNING.teleport.behindLeader), side * circuit.hw * 0.45, now, () => leader.speed);
    return;
  }
  const victim = placements[1];
  if (!victim || victim.finished) return;
  const last = placements.filter((r) => !r.finished && r.id !== racer.id).slice(-1)[0] || victim;
  const victimGp = gpRacer(victim);
  const backDist = () => (last === victim
    ? victimGp.dist - GP_TUNING.teleport.duelSendBack
    : Math.min(victimGp.dist, gpRacer(last).dist - GP_TUNING.teleport.behindLast));
  gpScheduleWarp(victim, backDist, 0, now, () => Math.min(victim.speed, last.speed * 0.7));
  racer.boostUntil = Math.max(racer.boostUntil || 0, now + 600);
}

function gpScheduleWarp(target, distFn, lateral, now, speedFn = null) {
  if (!betaState) return;
  target.teleportPortal = { startMs: now, phase: "pre", attachedTo: target.id };
  (betaState.pendingWarps = betaState.pendingWarps || []).push({ target, distFn, lateral, speedFn, at: now + GP_TUNING.teleport.portalMs });
}

function gpRunPendingWarps(now) {
  const warps = betaState?.pendingWarps;
  if (!warps?.length) return;
  const circuit = gpCircuit();
  for (let index = warps.length - 1; index >= 0; index -= 1) {
    const warp = warps[index];
    const target = warp.target;
    if (warp.at && now >= warp.at) {
      warps.splice(index, 1);
      if (target.finished) { target.teleportPortal = null; continue; }
      const distance = warp.distFn();
      const point = gpPointAt(circuit, distance, warp.lateral);
      const g = gpRacer(target);
      target.x = point.x;
      target.y = point.y;
      target.angle = point.angle;
      g.dist = distance;
      g.index = point.index;
      g.lateral = warp.lateral;
      g.moveAngle = point.angle;
      if (warp.speedFn) target.speed = Math.max(0, warp.speedFn());
      target.teleportPortal = { startMs: now, phase: "post", attachedTo: target.id };
      warps.push({ target, clearAt: now + GP_TUNING.teleport.portalMs });
    } else if (warp.clearAt && now >= warp.clearAt) {
      warps.splice(index, 1);
      if (target.teleportPortal?.phase === "post") target.teleportPortal = null;
    }
  }
}

function betaFindTargetAhead(racer, maxDistance = 420) {
  let best = null;
  let bestScore = Infinity;
  betaState.racers.forEach((target) => {
    if (target.id === racer.id || target.finished) return;
    const dx = target.x - racer.x;
    const dy = target.y - racer.y;
    const forward = Math.cos(racer.angle) * dx + Math.sin(racer.angle) * dy;
    const lateral = Math.abs(-Math.sin(racer.angle) * dx + Math.cos(racer.angle) * dy);
    if (forward <= 0 || forward > maxDistance || lateral > 78) return;
    if (forward < bestScore) {
      bestScore = forward;
      best = target;
    }
  });
  return best;
}

function betaHasChaser(racer, maxDistance = 260) {
  return betaState.racers.some((target) => {
    if (target.id === racer.id || target.finished) return false;
    const dx = target.x - racer.x;
    const dy = target.y - racer.y;
    const behind = -(Math.cos(racer.angle) * dx + Math.sin(racer.angle) * dy);
    const lateral = Math.abs(-Math.sin(racer.angle) * dx + Math.cos(racer.angle) * dy);
    return behind > 0 && behind < maxDistance && lateral < 92;
  });
}

function betaAiUseItems() {
  if (!betaState?.config.itemsEnabled) return;
  const now = betaNowMs();
  betaState.racers.filter((racer) => racer.ai && racer.item && !racer.finished).forEach((racer) => {
    if (racer.itemCooldownUntil > now) return;
    const item = racer.item.id;
    const placement = betaPlacements().findIndex((entry) => entry.id === racer.id) + 1;
    const total = betaState.racers.length;
    // Insano-Mode: use when not 1st or going slow
    if (item === "turbo" && (placement > 1 || Math.abs(racer.speed) < racer.physics.maxSpeed * 0.55)) betaUseItem(racer);
    // Big Bubba: use when threat nearby
    else if (item === "shield" && (betaFindTargetAhead(racer, 180) || betaHasChaser(racer, 180) || Math.random() < 0.012)) betaUseItem(racer);
    // Oil / Spike Strip: drop when someone is chasing
    else if ((item === "oil" || item === "tire") && betaHasChaser(racer, 300)) betaUseItem(racer);
    // EMP: fire when someone is ahead and close
    else if (item === "burst" && betaFindTargetAhead(racer, 450)) betaUseItem(racer);
    // Teleport: use when behind and mid-race
    else if (item === "teleport" && placement > 1 && Math.random() < 0.04) betaUseItem(racer);
  });
}

function betaCollectItemBoxes(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.itemBoxes.forEach((box) => {
    if (!box.active && now >= box.respawnAt) box.active = true;
    if (!box.active) return;
    betaState.racers.forEach((racer) => {
      if (!box.active) return;
      if (racer.finished || racer.item || betaDistance(racer, box) > GP_TUNING.car.pickup) return;
      racer.item = betaRandomItemForRacer(racer);
      box.active = false;
      const [respawnMin, respawnMax] = GP_TUNING.items.respawnMs;
      box.respawnAt = now + respawnMin + Math.random() * (respawnMax - respawnMin);
      if (racer.id === "player") betaNotify(`${racer.item.name} Ready!`);
    });
  });
}

function betaApplyBoostPads(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.boostPads.forEach((pad) => {
    betaState.racers.forEach((racer) => {
      if (racer.finished || racer.lastPadAt > now - 900 || betaDistance(racer, pad) > GP_TUNING.car.pad) return;
      const pwr = racer.physics.pwrMultiplier || 1.16;
      racer.boostUntil = Math.max(racer.boostUntil || 0, now + 820 * pwr);
      racer.speed = Math.min(racer.physics.maxSpeed * (1.08 + pwr * 0.1), racer.speed + 92 * pwr);
      if (racer.id === "player") raceJuiceHaptic(10);
      racer.lastPadAt = now;
    });
  });
}

function betaApplyObstacles(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.obstacles.forEach((obstacle) => {
    betaState.racers.forEach((racer) => {
      if (racer.finished || obstacle.lastHit[racer.id] > now - 1000 || betaDistance(racer, obstacle) > 39) return;
      obstacle.lastHit[racer.id] = now;
      betaApplyHit(racer, "slow", obstacle.kind === "barrel" ? 1.15 : 0.85, "obstacle");
    });
  });
}

function betaUpdateTraps(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.traps = objects.traps.filter((trap) => trap.expiresAt > now && !trap.expired);
  objects.traps.forEach((trap) => {
    if (trap.armedAt > now) return;
    betaState.racers.forEach((racer) => {
      if (trap.expired || racer.id === trap.owner || racer.finished) return;
      if (betaDistance(racer, trap) > trap.radius + 26) return;
      betaApplyHit(racer, trap.type === "oil" ? "spin" : "slow", trap.type === "oil" ? 1.1 : 1.2, "trap");
      betaPlayerHazardJuice(racer);
      // Item-dropped traps (source:"item") disappear after one trigger.
      // Spike strip always disappears. Map oil slicks (no source) persist.
      if (trap.source === "item" || trap.type === "tire") {
        trap.expired = true;
      }
    });
  });
  objects.traps = objects.traps.filter((trap) => !trap.expired);
}

function betaUpdateProjectiles(dt, now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.projectiles.forEach((projectile) => {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    // Dissipate on wall
    if (betaSurfaceAt(projectile.x, projectile.y) === "wall") projectile.expired = true;
    betaState.racers.forEach((racer) => {
      if (projectile.expired || racer.id === projectile.owner || racer.finished) return;
      if (betaDistance(racer, projectile) > 38) return;
      // Blocked by Big Bubba — shield consumed, projectile dissipates
      if (racer.shieldUntil > betaNowMs()) {
        racer.shieldUntil = 0;
        if (racer.id === "player") betaNotify("Big Bubba blocked the EMP!");
        projectile.expired = true;
        return;
      }
      betaApplyHit(racer, "burst", projectile.power || 1, "projectile");
      betaPlayerHazardJuice(racer);
      projectile.expired = true;
    });
  });
  objects.projectiles = objects.projectiles.filter((p) => !p.expired && p.expiresAt > now);
}

function updateBetaItemHud() {
  if (!el.betaItemSlot) return;
  const item = betaState?.player?.item;
  el.betaItemSlot.classList.toggle("is-empty", !item);
  el.betaItemName.textContent = item?.name || "Empty";
  el.betaItemPrompt.textContent = item ? "Space / E" : "Find a box";
  const iconEl = el.betaItemIcon;
  if (item) {
    const img = betaItemImages[item.id];
    if (img?.complete && img.naturalWidth) {
      iconEl.innerHTML = "";
      const clone = img.cloneNode();
      clone.style.cssText = "width:28px;height:28px;object-fit:contain;display:block;";
      iconEl.appendChild(clone);
    } else {
      // While loading or missing, show a short text label
      iconEl.textContent = item.name.slice(0, 2).toUpperCase();
    }
  } else {
    iconEl.textContent = "?";
  }
}

function updateBetaControlVisuals() {
  document.querySelectorAll(".beta-touch-controls").forEach((group) => {
    const leftActive = Boolean(betaKeys.left);
    const rightActive = Boolean(betaKeys.right);
    group.classList.toggle("steering-left", leftActive && !rightActive);
    group.classList.toggle("steering-right", rightActive && !leftActive);
    group.querySelectorAll("[data-beta-control]").forEach((button) => {
      button.classList.toggle("pressed", Boolean(betaKeys[button.dataset.betaControl]));
    });
  });
}

function setBetaControl(direction, active) {
  betaKeys[direction] = active;
  updateBetaControlVisuals();
}

function flashBetaItemButton() {
  document.querySelectorAll("[data-beta-item-button]").forEach((button) => {
    button.classList.add("pressed");
    window.setTimeout(() => button.classList.remove("pressed"), 160);
  });
}

function betaDrawImageOrFallback(ctx, img, x, y, width, height, fallback) {
  if (img?.complete && img.naturalWidth) {
    ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
    return;
  }
  fallback?.();
}

function betaDrawTrackObjects(ctx) {
  const objects = betaState?.objects;
  if (!objects) return;

  // ── Boost pads ────────────────────────────────────────────────
  objects.boostPads.forEach((pad) => {
    ctx.save();
    ctx.translate(pad.x, pad.y);
    ctx.rotate(pad.angle || 0);
    betaDrawImageOrFallback(ctx, betaTrackImages.boostPad, 0, 0, 58, 92, () => {
      ctx.fillStyle = "rgba(82,199,255,.78)";
      ctx.beginPath();
      ctx.moveTo(0, -42); ctx.lineTo(-26, 18); ctx.lineTo(0, 6); ctx.lineTo(26, 18);
      ctx.closePath(); ctx.fill();
    });
    ctx.restore();
  });

  // ── Obstacles (barrels / cones) ───────────────────────────────
  objects.obstacles.forEach((obstacle) => {
    const img = obstacle.kind === "barrel" ? betaTrackImages.barrel : betaTrackImages.cone;
    betaDrawImageOrFallback(ctx, img, obstacle.x, obstacle.y, 46, 46, () => {
      ctx.fillStyle = obstacle.kind === "barrel" ? "#ff805f" : "#ffc857";
      ctx.beginPath(); ctx.arc(obstacle.x, obstacle.y, 20, 0, Math.PI * 2); ctx.fill();
    });
  });

  // ── Item boxes ────────────────────────────────────────────────
  objects.itemBoxes.filter((box) => box.active).forEach((box) => {
    ctx.save();
    ctx.shadowColor = "#ffc857"; ctx.shadowBlur = 16;
    betaDrawImageOrFallback(ctx, betaTrackImages.itemBox, box.x, box.y, 48, 48, () => {
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(box.x - 22, box.y - 22, 44, 44);
      ctx.fillStyle = "#101820"; ctx.font = "900 28px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("?", box.x, box.y + 1);
    });
    ctx.restore();
  });

  // ── Traps: Oil Slick & Spike Strip ───────────────────────────
  objects.traps.forEach((trap) => {
    ctx.save();
    ctx.globalAlpha = 0.9;
    if (trap.type === "oil") {
      // Oil slick — elliptical pool
      betaDrawImageOrFallback(ctx, betaTrackImages.oilSlick, trap.x, trap.y, 80, 50, () => {
        ctx.fillStyle = "rgba(16,20,28,.92)";
        ctx.beginPath(); ctx.ellipse(trap.x, trap.y, 38, 22, -0.2, 0, Math.PI * 2); ctx.fill();
      });
    } else {
      // Spike strip — horizontal strip image
      betaDrawImageOrFallback(ctx, betaTrackImages.spikeStrip, trap.x, trap.y, 86, 28, () => {
        ctx.fillStyle = "#ff3f3f";
        ctx.beginPath();
        for (let i = 0; i < 8; i += 1) {
          const a = (Math.PI * 2 * i) / 8;
          const r = i % 2 ? 13 : 30;
          ctx[i === 0 ? "moveTo" : "lineTo"](trap.x + Math.cos(a) * r, trap.y + Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill();
      });
    }
    ctx.restore();
  });

  // ── EMP Pulse projectiles ─────────────────────────────────────
  objects.projectiles.forEach((proj) => {
    ctx.save();
    ctx.translate(proj.x, proj.y);
    // +PI flips 180° so the wave faces the direction of travel
    ctx.rotate(proj.angle + Math.PI);
    const empImg = betaTrackImages.empWave;
    if (empImg?.complete && empImg.naturalWidth) {
      ctx.drawImage(empImg, -36, -20, 72, 40);
    } else {
      ctx.fillStyle = "#c084fc"; ctx.shadowColor = "#c084fc"; ctx.shadowBlur = 18;
      ctx.fillRect(-22, -8, 44, 16);
    }
    ctx.restore();
  });
}

function betaDrawStatusEffects(ctx, racer) {
  const now = betaNowMs();

  // ── Teleport portal (pre and post) ───────────────────────────
  if (racer.teleportPortal) {
    const portal = racer.teleportPortal;
    const age = now - portal.startMs;
    const alpha = Math.min(1, age / 200) * (portal.phase === "post" ? Math.max(0, 1 - age / 1000) : 1);
    if (alpha > 0) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.92;
      const pImg = betaTrackImages.teleportPortal;
      const size = 110 + Math.sin(age / 180) * 10;
      if (pImg?.complete && pImg.naturalWidth) {
        ctx.drawImage(pImg, racer.x - size / 2, racer.y - size / 2, size, size);
      } else {
        ctx.strokeStyle = "#6ee7a8"; ctx.lineWidth = 5; ctx.shadowColor = "#6ee7a8"; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(racer.x, racer.y, size / 2, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ── Insano-Mode flames (boost active) ────────────────────────
  if (racer.boostUntil > now) {
    ctx.save();
    const flameImg = betaTrackImages.insanoFlames;
    // Position flames behind the car
    const bx = racer.x - Math.cos(racer.angle) * 58;
    const by = racer.y - Math.sin(racer.angle) * 58;
    ctx.translate(bx, by);
    // car is drawn at angle + PI/2 (top-down sprite); flames need to face backward
    // an extra +PI/2 rotates the flame image so it shoots out the back correctly
    ctx.rotate(racer.angle + Math.PI);
    if (flameImg?.complete && flameImg.naturalWidth) {
      ctx.globalAlpha = 0.88;
      ctx.drawImage(flameImg, -40, -40, 80, 80);
    } else {
      // Fallback: two streaks
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = "rgba(255,120,30,.8)";
      ctx.fillRect(-44, -15, 72, 7);
      ctx.fillRect(-34, 8, 62, 7);
    }
    ctx.restore();
  }

  // ── Big Bubba bubble (shield active) ─────────────────────────
  if (racer.shieldUntil > now) {
    ctx.save();
    const bubbleImg = betaTrackImages.bubbaBubble;
    const pulse = 1 + Math.sin(now / 220) * 0.04;
    const size = 108 * pulse;
    if (bubbleImg?.complete && bubbleImg.naturalWidth) {
      ctx.globalAlpha = 0.82;
      ctx.drawImage(bubbleImg, racer.x - size / 2, racer.y - size / 2, size, size);
    } else {
      ctx.strokeStyle = "rgba(82,199,255,.92)";
      ctx.shadowColor = "#52c7ff"; ctx.shadowBlur = 15;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(racer.x, racer.y, 52 * pulse, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  // ── Hit flash ─────────────────────────────────────────────────
  if (racer.hitFlashUntil > now) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,128,95,.9)"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(racer.x, racer.y, 46, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

function betaMakeRacer({ id, name, carId, form, ratings, color, x, y, angle = 0, ai = false, skill = 1, aggression = 0.4, ghost = false }) {
  return {
    id,
    name,
    carId,
    form,
    ratings,
    physics: betaPhysicsFromRatings(ratings, skill),
    color,
    x,
    y,
    prevX: x,
    prevY: y,
    angle,
    speed: 0,
    lap: 1,
    checkpoint: 0,
    wasOnStart: true,
    finished: false,
    finishTime: null,
    ai,
    skill,
    aggression,
    ghost,
    item: null,
    boostUntil: 0,
    shieldUntil: 0,
    spinUntil: 0,
    slowUntil: 0,
    hitFlashUntil: 0,
    lastPadAt: 0,
    itemCooldownUntil: 0,
    teleportPortal: null,
    aiWaypoint: 0,
    lastProgressWaypoint: -1,
    offTrackSince: null,
    stuckSince: null,
    lastRecoveryX: x,
    lastRecoveryY: y,
    lastProgressScore: 0,
    lastProgressAt: 0,
    lastWaypointDistance: Infinity,
    lateralOffset: 0,
    aiIntentOffset: 0,
    nextAiDecisionAt: 0,
    lastAiControlAt: 0,
    slipstreamSince: 0,
    slipstreamActive: false,
    respawnUntil: 0,
    image: betaMakeImage(imageFor(form, "topdown"), { measure: true }),
    record: [],
    lastRecord: 0
  };
}

function betaClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function betaRaceOrderAhead(a, b) {
  if (!a || !b) return false;
  return gpProgressScore(a) > gpProgressScore(b);
}

function betaLineDirection(line, index) {
  const current = line[index % line.length] || line[0];
  const next = line[(index + 1) % line.length] || current;
  return Math.atan2(next.y - current.y, next.x - current.x);
}

function betaOffsetPoint(point, angle, offset) {
  return {
    x: point.x - Math.sin(angle) * offset,
    y: point.y + Math.cos(angle) * offset
  };
}

function betaRoadSafeOffset(point, angle, offset) {
  const target = betaOffsetPoint(point, angle, offset);
  return betaSurfaceAt(target.x, target.y) === "road";
}

function betaUpdateSlipstream(racer, now) {
  if (!betaState?.racers?.length || racer.finished) return;
  let inStream = false;
  for (const leader of betaState.racers) {
    if (leader === racer || leader.finished) continue;
    const dx = racer.x - leader.x;
    const dy = racer.y - leader.y;
    const dist = Math.hypot(dx, dy);
    if (dist > BETA_AI_TUNING.slipstreamRange || dist < BETA_AI_TUNING.slipstreamMinRange) continue;
    if (Math.abs(leader.speed) < BETA_AI_TUNING.slipstreamMinLeaderSpeed) continue;
    const wakeAngle = leader.angle + Math.PI;
    const angleToRacer = Math.atan2(dy, dx);
    if (Math.abs(betaNormalizeAngle(angleToRacer - wakeAngle)) <= BETA_AI_TUNING.slipstreamHalfAngle) {
      inStream = true;
      break;
    }
  }
  if (inStream) {
    if (!racer.slipstreamSince) racer.slipstreamSince = now;
    racer.slipstreamActive = now - racer.slipstreamSince >= BETA_AI_TUNING.slipstreamChargeMs;
  } else {
    racer.slipstreamSince = 0;
    racer.slipstreamActive = false;
  }
}

function betaWatchdogCheck(racer, now) {
  if (!racer.ai || racer.finished) return;
  const g = gpRacer(racer);
  if (g.dist === null) return;
  if (!g.progressAt || g.dist > g.progressDist + 40) {
    g.progressAt = now;
    g.progressDist = g.dist;
    return;
  }
  if (now - g.progressAt < BETA_AI_TUNING.stuckTimeoutMs) return;
  betaRespawnRacer(racer, now);
  racer.respawnUntil = now + BETA_AI_TUNING.stuckRespawnPauseMs;
  g.progressAt = now;
  g.progressDist = g.dist;
}

async function startBetaDemo(mode = betaState?.config?.id || "time", options = {}) {
  if (!el.betaCanvas) return;
  clearRaceResultPopups();
  const loadToken = ++betaLoadToken;
  betaTrack = betaTrackById(betaSelectedTrackId, mode);
  betaSelectedTrackId = betaTrack.id;
  syncBetaTrackDerived();
  const config = betaModeConfigs[mode] || betaModeConfigs.time;
  resizeBetaCanvas();
  showBetaRotationTip();
  const carId = betaCurrentCarId();
  const car = cars.find((item) => item.id === carId) || cars[0];
  const form = currentEvolution(carId);
  const totalRacers = 1 + config.opponents;
  const playerPos = betaStartPosition(0, totalRacers);
  const player = betaMakeRacer({
    id: "player",
    name: form.name,
    carId,
    form,
    ratings: betaRatingsForCar(carId, state.garage?.[carId]?.level || 1, state.garage?.[carId]?.evolution || 0, true),
    color: car.color,
    x: playerPos.x,
    y: playerPos.y,
    angle: betaTrack.startAngle
  });
  const opponentSource = betaPreviewOpponents.length === config.opponents
    ? betaPreviewOpponents
    : getRandomOpponentCars(config.opponents, carId);
  const opponents = opponentSource.map((opponent, index) => {
    const pos = betaStartPosition(index + 1, totalRacers);
    return betaMakeRacer({
      id: `ai-${index}`,
      name: opponent.form.name,
      carId: opponent.carId,
      form: opponent.form,
      ratings: opponent.ratings,
      color: opponent.car.color,
      x: pos.x,
      y: pos.y,
      angle: betaTrack.startAngle,
      ai: true,
      skill: opponent.skill
    });
  });
  const savedTrial = state.betaTimeTrials?.[betaTrack.id];
  const savedGhost = config.id === "time" && savedTrial?.gp ? savedTrial.ghost || null : null;
  betaState = {
    config,
    player,
    racers: [player].concat(opponents),
    ghost: savedGhost,
    ghostPoint: null,
    objects: createBetaObjects(config),
    notification: "",
    notificationUntil: 0,
    active: false,
    finished: false,
    debug: false,
    shake: 0,
    hitPauseUntil: 0,
    slowmoUntil: 0,
    particles: [],
    lastPlacement: 0,
    slipstreamWasActive: false,
    lastWallFxAt: 0,
    positionFlashTimer: null,
    startTime: 0,
    elapsed: 0,
    last: performance.now(),
    raf: null
  };
  betaState.context = betaRaceContext;
  Object.keys(betaKeys).forEach((key) => delete betaKeys[key]);
  updateBetaControlVisuals();
  showBetaScreen(null); // hide all beta screens
  el.betaRace.hidden = false;
  resizeBetaCanvas();
  showBetaRotationTip();
  el.betaResults.hidden = true;
  if (el.betaCountdown) {
    el.betaCountdown.classList.remove("active");
    el.betaCountdown.textContent = "";
  }
  setBetaLoading(true);
  el.betaDebug.textContent = "Debug: Off";
  updateBetaItemHud();
  drawBetaFrame();
  try {
    await preloadBetaRaceAssets();
  } finally {
    if (loadToken === betaLoadToken) setBetaLoading(false);
  }
  if (!betaState || betaState.config.id !== config.id || loadToken !== betaLoadToken) return;
  drawBetaFrame();
  if (options.holdCountdown) {
    if (el.betaCountdown) {
      el.betaCountdown.classList.remove("active");
      el.betaCountdown.textContent = "";
    }
    return;
  }
  runCountdown(el.betaCountdown, () => {
    if (!betaState || betaState.finished) return;
    betaState.active = true;
    betaState.startTime = performance.now();
    betaState.last = betaState.startTime;
    betaState.raf = requestAnimationFrame(updateBetaRace);
  });
}

function betaAiControls(racer) {
  return gpAiControls(racer);
}

function betaDriveRacer(racer, dt, controls = {}) {
  gpDriveRacer(racer, dt, controls);
}

function updateBetaRace(now) {
  try {
    if (!betaState || betaState.finished || betaState.paused) return;
    if (juiceEnabled() && betaState.hitPauseUntil && now < betaState.hitPauseUntil) {
      betaState.last = now;
      drawBetaFrame();
      betaState.raf = requestAnimationFrame(updateBetaRace);
      return;
    }
    let dt = Math.min(0.035, (now - betaState.last) / 1000);
    if (juiceEnabled() && betaState.slowmoUntil && performance.now() < betaState.slowmoUntil) {
      dt *= RACE_JUICE_TUNING.slowmoScale;
    }
    betaState.last = now;
    betaState.elapsed = betaState.active ? (now - betaState.startTime) / 1000 : 0;
    const frameNow = betaNowMs();
    betaState.racers.forEach((racer) => betaUpdateSlipstream(racer, frameNow));
    if (betaState.player.slipstreamActive && !betaState.slipstreamWasActive) raceJuiceHaptic(12);
    betaState.slipstreamWasActive = Boolean(betaState.player.slipstreamActive);
    betaDriveRacer(betaState.player, dt, {
      up: betaInput("up"),
      down: betaInput("down"),
      left: betaInput("left"),
      right: betaInput("right")
    });
    betaAiUseItems();
    betaState.racers.filter((racer) => racer.ai && !racer.finished).forEach((racer) => {
      const controls = betaAiControls(racer);
      betaWatchdogCheck(racer, frameNow);
      betaDriveRacer(racer, dt, controls);
    });
    betaResolveCarCollisions();
    const itemNow = betaNowMs();
    betaCollectItemBoxes(itemNow);
    betaApplyBoostPads(itemNow);
    betaApplyObstacles(itemNow);
    betaUpdateTraps(itemNow);
    betaUpdateProjectiles(dt, itemNow);
    gpRunPendingWarps(itemNow);
    betaState.racers.filter((racer) => !racer.finished).forEach((racer) => betaUpdateOffTrackRecovery(racer, itemNow));
    betaState.racers.filter((racer) => !racer.finished).forEach(betaProgressRacer);
    betaRecordGhostSample(now);
    betaState.ghostPoint = betaGhostPointAt(betaState.elapsed);
    raceJuiceUpdateParticles(dt);
    drawBetaFrame();
    betaState.raf = requestAnimationFrame(updateBetaRace);
  } catch (error) {
    console.error("GearBorn race loop crashed:", error);
    try {
      if (betaState?.raf) cancelAnimationFrame(betaState.raf);
      if (betaState) betaState.finished = true;
      showToast("Race interrupted", "Something went wrong mid-race. Use Back to exit safely.");
    } catch {}
  }
}

function drawBetaFrame() {
  if (!betaState || !el.betaCanvas) return;
  betaResizeCanvas();
  const ctx = el.betaCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaCanvas.width / ratio;
  const h = el.betaCanvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.setLineDash([]);
  if ("filter" in ctx) ctx.filter = "none";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  if (juiceEnabled() && betaState.shake > 0) {
    const shake = betaState.shake;
    ctx.translate((Math.random() * 2 - 1) * shake, (Math.random() * 2 - 1) * shake);
    betaState.shake = Math.max(0, betaState.shake - RACE_JUICE_TUNING.shakeDecayPerSec / 60);
  }
  gpDrawFrameWorld(ctx, w, h);
  drawBetaMarkers(ctx);
  betaDrawTrackObjects(ctx);
  if (betaState.ghostPoint) drawBetaGhost(ctx);
  // Draw status effects (flames, bubble) UNDER the car so car sits on top
  betaState.racers.forEach((racer) => betaDrawStatusEffects(ctx, racer));
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => drawBetaCar(ctx, racer));
  drawBetaCar(ctx, betaState.player);
  raceJuiceDrawParticles(ctx);
  if (betaState.debug) drawBetaDebug(ctx);
  ctx.restore();
  if (betaState.notification && betaState.notificationUntil > betaNowMs()) {
    const noticeY = 74;
    ctx.save();
    ctx.fillStyle = "rgba(16,20,28,.82)";
    ctx.strokeStyle = "rgba(255,200,87,.55)";
    ctx.lineWidth = 1.5;
    if (ctx.roundRect) ctx.roundRect(w / 2 - 150, noticeY, 300, 42, 12);
    else ctx.rect(w / 2 - 150, noticeY, 300, 42);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffc857";
    ctx.font = "900 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(betaState.notification, w / 2, noticeY + 21);
    ctx.restore();
  }
  betaDrawOffTrackWarning(ctx, w, h);
  drawBetaMiniMap();
  updateBetaItemHud();
  const placement = betaPlacements().findIndex((racer) => racer.id === "player") + 1;
  el.betaTime.textContent = betaState.elapsed.toFixed(2);
  el.betaLap.textContent = `${Math.min(betaState.player.lap, betaLapsRequired)} / ${betaLapsRequired}`;
  el.betaCheckpoint.textContent = `${Math.min(betaState.player.checkpoint, betaTrack.checkpoints.length)} / ${betaTrack.checkpoints.length}`;
  el.betaSpeed.textContent = `${Math.round(Math.abs(betaState.player.speed) / 5.2)} MPH`;
  gpRenderGearHud();
  const betaHudPosPanel = document.getElementById("beta-hud-pos-panel");
  if (betaHudPosPanel) betaHudPosPanel.hidden = betaState.config.id === "time";
  el.betaPosition.textContent = betaState.config.id === "time" ? "" : betaOrdinal(placement);
  if (betaState.config.id !== "time") {
    if (betaState.lastPlacement && placement !== betaState.lastPlacement) {
      const gained = placement < betaState.lastPlacement;
      if (gained) raceJuiceHaptic(14);
      if (juiceEnabled()) {
        const panel = el.betaPosition?.parentElement || betaHudPosPanel;
        if (panel) {
          panel.classList.remove("position-up", "position-down");
          void panel.offsetWidth;
          panel.classList.add(gained ? "position-up" : "position-down");
          window.clearTimeout(betaState.positionFlashTimer);
          betaState.positionFlashTimer = window.setTimeout(() => panel.classList.remove("position-up", "position-down"), RACE_JUICE_TUNING.positionFlashMs);
        }
      }
    }
    betaState.lastPlacement = placement;
  }
}

function betaDrawOffTrackWarning(ctx, w, h) {
  const player = betaState?.player;
  if (!player || player.finished) return;
  const now = betaNowMs();
  if (player.respawnUntil && player.respawnUntil > now) {
    const pauseLeft = Math.ceil((player.respawnUntil - now) / 1000);
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "1000 24px 'Arial Black', Impact, sans-serif";
    ctx.fillStyle = "#ffc857";
    ctx.shadowColor = "rgba(0,0,0,.75)";
    ctx.shadowBlur = 14;
    ctx.fillText("RETURNING TO TRACK", w / 2, h * 0.36);
    ctx.font = "1000 46px 'Arial Black', Impact, sans-serif";
    ctx.fillText(String(Math.max(0, pauseLeft)), w / 2, h * 0.36 + 48);
    ctx.restore();
    return;
  }
  if (!player.offTrackSince) return;
  const elapsed = now - player.offTrackSince;
  if (elapsed < 2000) return;
  const left = Math.max(0, Math.ceil((5000 - elapsed) / 1000));
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "1000 26px 'Arial Black', Impact, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,.82)";
  ctx.shadowBlur = 16;
  ctx.fillText("RETURN TO THE TRACK", w / 2, h * 0.36);
  ctx.font = "1000 58px 'Arial Black', Impact, sans-serif";
  ctx.fillStyle = left <= 1 ? "#ff5d5d" : "#ffc857";
  ctx.fillText(String(left), w / 2, h * 0.36 + 56);
  ctx.restore();
}

const BETA_SPRITE_BODY_LENGTH = 95; // drawn car-body length in 2D race px (4B: 1.5x, was 63; keep in step with GP_TUNING.car)

function drawBetaCar(ctx, racer = betaState.player) {
  ctx.save();
  ctx.translate(racer.x, racer.y);
  ctx.rotate(racer.angle + Math.PI / 2);
  if (racer.spinUntil > betaNowMs()) ctx.rotate(Math.sin(betaState.elapsed * 16) * 0.12);
  if (racer.slipstreamActive) {
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = racer.color || "#52c7ff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    [-27, 0, 27].forEach((xOffset, index) => {
      const wobble = Math.sin((betaState?.elapsed || 0) * 18 + index) * 3;
      ctx.beginPath();
      ctx.moveTo(xOffset + wobble, 62);
      ctx.lineTo(xOffset - wobble * 0.5, 108 + index * 9);
      ctx.stroke();
    });
    ctx.restore();
  }
  if (gearbornDrawTopdownSprite(ctx, racer.image, BETA_SPRITE_BODY_LENGTH)) {
    // drawn at true shape, centered on the car body
  } else {
    ctx.fillStyle = racer.color || "#ffc857";
    ctx.fillRect(-27, -51, 54, 102);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-18, -24, 36, 27);
  }
  ctx.restore();
}

function drawBetaMiniMap() {
  if (!el.betaMinimap || !betaState) return;
  const circuit = gpCircuit();
  const ctx = el.betaMinimap.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaMinimap.width / ratio;
  const h = el.betaMinimap.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const map = gpDrawMiniMap(ctx, w, h, circuit);
  const dot = (x, y, color, radius = 4) => {
    const p = map(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  if (betaState.config.boostPadsEnabled) betaState.objects.boostPads.forEach((pad) => dot(pad.x, pad.y, "rgba(82,199,255,.62)", 2));
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => dot(racer.x, racer.y, "#ff805f", 3.2));
  if (betaState.ghostPoint) dot(betaState.ghostPoint.x, betaState.ghostPoint.y, "rgba(104,232,255,.62)", 3.5);
  dot(betaState.player.x, betaState.player.y, "#52c7ff", 4.4);
}

document.addEventListener("keydown", (event) => {
  if (!document.querySelector("#beta-view")?.classList.contains("active")) return;
  const key = normalizeKey(event);
  if ((key === "Space" || key === "E") && betaState?.active && !betaState.finished && !betaState.paused) {
    event.preventDefault();
    flashBetaItemButton();
    betaUseItem(betaState.player);
  }
});

document.querySelectorAll("[data-beta-control]").forEach((button) => {
  const direction = button.dataset.betaControl;
  const press = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    setBetaControl(direction, true);
  };
  const release = (event) => {
    event.preventDefault();
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    setBetaControl(direction, false);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", (event) => {
    if (button.hasPointerCapture?.(event.pointerId)) return;
    setBetaControl(direction, false);
  });
});

document.querySelectorAll("[data-beta-item-button]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (betaState?.paused) return;
    flashBetaItemButton();
    betaUseItem(betaState?.player);
  });
});

window.addEventListener("resize", updateRotationTipForActiveRace);
screen.orientation?.addEventListener?.("change", updateRotationTipForActiveRace);

// ─── Gear Prix circuit engine (3I) ──────────────────────────────────────────
// Tracks are no longer drawn from tiles. Each track's own layout (its corner
// path) is scaled up, every corner is rounded with a real arc, and the result is
// a smooth centerline with a wide road, red/white curbs, a runoff strip and a
// soft barrier, all drawn in code. On top of that:
//  • a chase camera: the world turns so your car always faces up the screen;
//  • grip-limited steering (fast corners need braking) and automatic gears that
//    upshift with a short torque cut, so each car's pull feels different;
//  • AI that drives a computed racing line (outside-in-outside) with a braking
//    profile, overtakes on the side with room, and varies by skill.
// The existing tile tracks (built-in and builder) stay the source of truth: ids,
// names, story mapping and the track picker are untouched; each gets a circuit
// built from its path the first time it's raced (cached).
const GP_TUNING = {
  tile: 340,             // world px per old tile
  halfWidth: 150,        // 4B: road is 300 px wide so the 1.5x cars still have room to race
  customHalfWidth: 130,  // builder tracks can have roads one tile apart
  curb: 16,
  runoff: 140,
  cornerRadius: 230,
  sample: 14,
  speedScale: 1.3,
  gears: { tops: [0.3, 0.47, 0.64, 0.82, 1], pull: [1.5, 1.22, 1.0, 0.84, 0.72], upAt: 0.985, downAt: 0.8, shiftMs: [260, 140] },
  grip: { road: 9, curb: 7.5, grass: 3.4 },
  latG: [760, 1040],     // lateral grip (px/s²) from handling 40 → 100
  surface: { curbSpeed: 0.97, grassSpeed: 0.55, grassAccel: 0.55 },
  wall: { keepSpeed: 0.55, align: 0.55 },
  assist: 0.9,           // gentle pull toward the track direction when not steering
  camera: { anchorY: 0.7, angleLerp: 7, portraitZoom: 0.74 },
  ai: { lookBase: 120, lookPerSpeed: 0.38, steerGain: 2.4, latG: [0.86, 1.0], brake: [520, 760], noise: [26, 6], overtakeRange: 170, overtakeOffset: 0.5, lineIterations: 220, pace: 0.9, cornerScale: 0.82 },
  items: { rows: [0.08, 0.24, 0.4, 0.56, 0.72, 0.88], lanes: [-0.55, 0, 0.55], respawnMs: [2500, 4000] },
  teleport: { portalMs: 1000, beforeFinish: 260, behindLeader: 60, behindLast: 160, duelSendBack: 700 },
  car: { halfLength: 52, halfWidth: 31, pickup: 62, pad: 68, gridGap: 150 }
};

const gpThemes = {
  training: { grass: "#2f6b34", runoff: "#8d9a6e", barrier: "#1b1f26" },
  indy: { grass: "#2e6a35", runoff: "#a39377", barrier: "#1b1f26" },
  berlin: { grass: "#355f3b", runoff: "#a0917a", barrier: "#15181d" },
  dubai: { grass: "#c7a86a", runoff: "#e1c58c", barrier: "#3a2c1a" },
  rio: { grass: "#2f7a43", runoff: "#c9b78d", barrier: "#1b1f26" },
  la: { grass: "#3d4a35", runoff: "#9c8a6c", barrier: "#15181d" },
  seoul: { grass: "#2d5a4a", runoff: "#a39a7d", barrier: "#141822" },
  safrica: { grass: "#6f7f3c", runoff: "#b59a6a", barrier: "#2a2418" },
  india: { grass: "#4f7a33", runoff: "#c2a273", barrier: "#2a2418" },
  space: { grass: "#141a33", runoff: "#3a3f66", barrier: "#0a0d1c" },
  custom: { grass: "#2f6b34", runoff: "#a8997a", barrier: "#1b1f26" }
};

function gpLerpAngle(a, b, t) {
  return a + betaNormalizeAngle(b - a) * t;
}

// ─── Building a circuit from a tile track ───────────────────────────────────
function gpCornersFromPath(path) {
  const corners = [];
  const n = path.length;
  for (let i = 0; i < n; i += 1) {
    const a = path[(i - 1 + n) % n];
    const b = path[i];
    const c = path[(i + 1) % n];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (cross !== 0) corners.push(b);
  }
  return corners.length >= 3 ? corners : path;
}

function gpFilletPolyline(points, radius, step) {
  const n = points.length;
  const arcs = [];
  for (let i = 0; i < n; i += 1) {
    const a = points[(i - 1 + n) % n];
    const v = points[i];
    const c = points[(i + 1) % n];
    const l1 = Math.hypot(v.x - a.x, v.y - a.y) || 1;
    const l2 = Math.hypot(c.x - v.x, c.y - v.y) || 1;
    const d1 = { x: (v.x - a.x) / l1, y: (v.y - a.y) / l1 };
    const d2 = { x: (c.x - v.x) / l2, y: (c.y - v.y) / l2 };
    const theta = Math.acos(betaClamp(d1.x * d2.x + d1.y * d2.y, -1, 1));
    if (theta < 1e-3) { arcs.push([{ x: v.x, y: v.y }]); continue; }
    const t = Math.min(radius * Math.tan(theta / 2), 0.49 * Math.min(l1, l2));
    const r = t / Math.tan(theta / 2);
    const start = { x: v.x - d1.x * t, y: v.y - d1.y * t };
    const sign = d1.x * d2.y - d1.y * d2.x > 0 ? 1 : -1;
    const normal = sign > 0 ? { x: -d1.y, y: d1.x } : { x: d1.y, y: -d1.x };
    const center = { x: start.x + normal.x * r, y: start.y + normal.y * r };
    const a0 = Math.atan2(start.y - center.y, start.x - center.x);
    const steps = Math.max(2, Math.ceil((r * theta) / step));
    const arc = [];
    for (let k = 0; k <= steps; k += 1) {
      const ang = a0 + sign * theta * (k / steps);
      arc.push({ x: center.x + Math.cos(ang) * r, y: center.y + Math.sin(ang) * r });
    }
    arcs.push(arc);
  }
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const arc = arcs[i];
    const next = arcs[(i + 1) % n][0];
    arc.forEach((p) => out.push(p));
    const end = arc[arc.length - 1];
    const length = Math.hypot(next.x - end.x, next.y - end.y);
    const steps = Math.max(1, Math.round(length / step));
    for (let k = 1; k < steps; k += 1) out.push({ x: end.x + ((next.x - end.x) * k) / steps, y: end.y + ((next.y - end.y) * k) / steps });
  }
  return out.filter((p, i) => i === 0 || Math.hypot(p.x - out[i - 1].x, p.y - out[i - 1].y) > 2);
}

function gpCircuit(track = betaTrack) {
  if (!track) return null;
  if (track._gp) return track._gp;
  const T = GP_TUNING;
  const S = T.tile;
  const corners = gpCornersFromPath(track.path || []).map((p) => ({ x: (p.x + 0.5) * S, y: (p.y + 0.5) * S }));
  let pts = gpFilletPolyline(corners, T.cornerRadius, T.sample);
  // Start at the old start tile, running the same way.
  const start = { x: ((track.startTile?.x ?? 0) + 0.5) * S, y: ((track.startTile?.y ?? 0) + 0.5) * S };
  let startIndex = 0;
  let best = Infinity;
  pts.forEach((p, i) => {
    const d = Math.hypot(p.x - start.x, p.y - start.y);
    if (d < best) { best = d; startIndex = i; }
  });
  pts = pts.slice(startIndex).concat(pts.slice(0, startIndex));
  const n = pts.length;
  const cum = new Float64Array(n + 1);
  const ang = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    cum[i + 1] = cum[i] + Math.hypot(b.x - a.x, b.y - a.y);
    ang[i] = Math.atan2(b.y - a.y, b.x - a.x);
  }
  const curv = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const d = betaNormalizeAngle(ang[(i + 2) % n] - ang[(i - 2 + n) % n]);
    const ds = cum[i + 2 <= n ? i + 2 : n] - cum[Math.max(0, i - 2)] || 4 * T.sample;
    curv[i] = d / ds;
  }
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const hw = track.custom ? T.customHalfWidth : T.halfWidth;
  const circuit = {
    id: track.id,
    name: track.name,
    pts,
    n,
    cum,
    length: cum[n],
    ang,
    curv,
    hw,
    theme: gpThemes[track.id] || gpThemes.custom,
    bounds: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
  };
  circuit.path = new Path2D();
  pts.forEach((p, i) => (i ? circuit.path.lineTo(p.x, p.y) : circuit.path.moveTo(p.x, p.y)));
  circuit.path.closePath();
  // Curbs only where the road bends (plus a little run-in and run-out).
  circuit.curbPath = new Path2D();
  const bend = (i) => Math.abs(curv[(i + n) % n]) > 1 / 700;
  let open = false;
  for (let i = 0; i <= n; i += 1) {
    let near = false;
    for (let k = -6; k <= 6 && !near; k += 1) near = bend(i + k);
    const p = pts[i % n];
    if (near && !open) { circuit.curbPath.moveTo(p.x, p.y); open = true; }
    else if (near) circuit.curbPath.lineTo(p.x, p.y);
    else open = false;
  }
  gpBuildRacingLine(circuit);
  track._gp = circuit;
  return circuit;
}

function gpNormalAt(circuit, i) {
  const a = circuit.ang[i];
  return { x: -Math.sin(a), y: Math.cos(a) };
}

function gpPointAt(circuit, s, lateral = 0) {
  const L = circuit.length;
  const ss = ((s % L) + L) % L;
  let lo = 0;
  let hi = circuit.n - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (circuit.cum[mid] <= ss) lo = mid; else hi = mid - 1;
  }
  const i = lo;
  const p = circuit.pts[i];
  const t = ss - circuit.cum[i];
  const a = circuit.ang[i];
  const nrm = gpNormalAt(circuit, i);
  return { x: p.x + Math.cos(a) * t + nrm.x * lateral, y: p.y + Math.sin(a) * t + nrm.y * lateral, angle: a, index: i };
}

// Nearest centerline sample to (x, y). `hint` keeps the search local (fast and
// never jumps across a hairpin); a far miss falls back to a full search.
function gpLocate(circuit, x, y, hint = null) {
  const n = circuit.n;
  const scan = (from, to) => {
    let bi = from;
    let bd = Infinity;
    for (let k = from; k <= to; k += 1) {
      const i = ((k % n) + n) % n;
      const p = circuit.pts[i];
      const d = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y);
      if (d < bd) { bd = d; bi = i; }
    }
    return [bi, bd];
  };
  let [index, d2] = Number.isInteger(hint) ? scan(hint - 40, hint + 40) : scan(0, n - 1);
  if (Number.isInteger(hint) && d2 > (circuit.hw * 3) ** 2) [index, d2] = scan(0, n - 1);
  const p = circuit.pts[index];
  const a = circuit.ang[index];
  const along = (x - p.x) * Math.cos(a) + (y - p.y) * Math.sin(a);
  const lateral = -(x - p.x) * Math.sin(a) + (y - p.y) * Math.cos(a);
  return { index, s: circuit.cum[index] + along, lateral, dist: Math.abs(lateral) };
}

function gpSurfaceForLateral(circuit, lateral) {
  const T = GP_TUNING;
  const d = Math.abs(lateral);
  if (d <= circuit.hw) return "road";
  if (d <= circuit.hw + T.curb) return "curb";
  if (d <= circuit.hw + T.curb + T.runoff) return "grass";
  return "wall";
}

// ─── Racing line + speed profile ────────────────────────────────────────────
function gpBuildRacingLine(circuit) {
  const T = GP_TUNING;
  const n = circuit.n;
  const limit = circuit.hw * 0.78;
  const off = new Float64Array(n);
  const pos = (i) => {
    const p = circuit.pts[i];
    const nrm = gpNormalAt(circuit, i);
    return { x: p.x + nrm.x * off[i], y: p.y + nrm.y * off[i] };
  };
  // Elastic band: pull each point toward its neighbours' midpoint (straightens
  // the line through corners), projected onto the road's cross-section.
  [8, 5, 3].forEach((k) => {
    for (let it = 0; it < T.ai.lineIterations / 3; it += 1) {
      for (let i = 0; i < n; i += 1) {
        const a = pos((i - k + n) % n);
        const b = pos((i + k) % n);
        const p = circuit.pts[i];
        const nrm = gpNormalAt(circuit, i);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const target = (mid.x - p.x) * nrm.x + (mid.y - p.y) * nrm.y;
        off[i] = betaClamp(off[i] + (target - off[i]) * 0.5, -limit, limit);
      }
    }
  });
  circuit.lineOffset = off;
  circuit.line = Array.from({ length: n }, (_, i) => pos(i));
  // Line curvature from the circumscribed circle of i-6, i, i+6.
  const lineCurv = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const a = circuit.line[(i - 6 + n) % n];
    const b = circuit.line[i];
    const c = circuit.line[(i + 6) % n];
    const ab = Math.hypot(b.x - a.x, b.y - a.y);
    const bc = Math.hypot(c.x - b.x, c.y - b.y);
    const ca = Math.hypot(a.x - c.x, a.y - c.y);
    const cross = Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
    lineCurv[i] = ab * bc * ca > 1e-6 ? (2 * cross) / (ab * bc * ca) : 0;
  }
  circuit.lineCurv = lineCurv;
}

// Fastest speed this racer should carry at sample i, looking ahead for corners.
function gpTargetSpeed(circuit, i, latG, brake, cap) {
  let best = cap;
  let dist = 0;
  const reach = (cap * cap) / (2 * brake) + 40;
  for (let k = 0; k < 200 && dist < reach; k += 1) {
    const j = (i + k) % circuit.n;
    const kappa = circuit.lineCurv[j];
    if (kappa > 1e-5) {
      const corner = Math.sqrt(latG / kappa);
      best = Math.min(best, Math.sqrt(corner * corner + 2 * brake * dist));
    }
    dist += circuit.cum[j + 1] - circuit.cum[j];
  }
  return best;
}

// ─── Per-racer state ────────────────────────────────────────────────────────
function gpRacer(racer) {
  if (!racer.gp) {
    racer.gp = { gear: 1, shiftUntil: 0, moveAngle: racer.angle, index: null, dist: null, lateral: 0, surface: "road", rpm: 0, intent: 0, intentUntil: 0, noise: 0, noiseAt: 0, progressAt: 0, progressDist: 0 };
  }
  return racer.gp;
}

function gpUpdateLocation(racer, circuit = gpCircuit()) {
  const g = gpRacer(racer);
  const loc = gpLocate(circuit, racer.x, racer.y, g.index);
  const L = circuit.length;
  if (g.dist === null) {
    g.dist = loc.s > L / 2 ? loc.s - L : loc.s;
  } else {
    const prev = ((g.dist % L) + L) % L;
    let delta = loc.s - prev;
    if (delta > L / 2) delta -= L;
    if (delta < -L / 2) delta += L;
    if (Math.abs(delta) < 600) g.dist += delta;
  }
  g.index = loc.index;
  g.lateral = loc.lateral;
  g.surface = gpSurfaceForLateral(circuit, loc.lateral);
  return loc;
}

function gpLatG(racer) {
  const [lo, hi] = GP_TUNING.latG;
  return lo + (hi - lo) * betaClamp(((racer.ratings?.handling || 70) - 40) / 60, 0, 1);
}

function gpGearTops(racer, maxSpeed) {
  return GP_TUNING.gears.tops.map((t) => t * maxSpeed);
}

// ─── Driving (replaces the old tank model) ──────────────────────────────────
function gpDriveRacer(racer, dt, controls = {}) {
  const T = GP_TUNING;
  const circuit = gpCircuit();
  const g = gpRacer(racer);
  const now = betaNowMs();
  if (racer.respawnUntil && racer.respawnUntil > now) {
    racer.speed = 0;
    g.moveAngle = racer.angle;
    return;
  }
  if (racer.spinUntil > now) {
    racer.angle += dt * 5.2;
    racer.speed *= Math.max(0, 1 - dt * 1.8);
    controls = {};
  }
  if (racer.engineCutUntil > now) {
    // 5C: EMP engine cut: no throttle, the car coasts down, steering still works.
    racer.speed *= Math.max(0, 1 - dt * 0.45);
    controls = { ...controls, up: false };
  }
  gpUpdateLocation(racer, circuit);
  const boosted = racer.boostUntil > now;
  const slowed = racer.slowUntil > now;
  const shielded = racer.shieldUntil > now;
  const surface = shielded && g.surface === "grass" ? "road" : g.surface;
  const p = racer.physics;
  let maxSpeed = p.maxSpeed * T.speedScale * (racer.ai ? T.ai.pace : 1);
  let accel = p.acceleration * T.speedScale * (racer.ai ? T.ai.pace : 1);
  if (surface === "curb") maxSpeed *= T.surface.curbSpeed;
  if (surface === "grass") {
    maxSpeed *= T.surface.grassSpeed + (racer.ai ? 0.12 : 0) + (p.torque - 70) / 900;
    accel *= T.surface.grassAccel;
  }
  if (boosted) {
    maxSpeed *= 1.22 + (p.powertrain || 70) / 620;
    accel *= 1.25;
  }
  if (slowed) {
    maxSpeed *= 0.58 + Math.min(0.18, (p.torque || 70) / 520);
    accel *= 0.74 + Math.min(0.16, (racer.ratings.acceleration || 70) / 600);
  }
  if (racer.slipstreamActive) {
    maxSpeed *= BETA_AI_TUNING.slipstreamMaxSpeedMult;
    accel *= BETA_AI_TUNING.slipstreamAccelMult;
  }
  if (racer.ai && betaState?.player) {
    const lead = gpRacer(betaState.player).dist - g.dist;
    const t = Math.min(1, Math.abs(lead) / BETA_AI_TUNING.rubberBandRange);
    const band = lead > 0 ? 1 + BETA_AI_TUNING.rubberBandMaxBoost * t : 1 - BETA_AI_TUNING.rubberBandMaxDrag * t;
    maxSpeed *= band;
    accel *= band;
  }

  // Automatic gearbox: each gear has a top speed; the pull fades toward it,
  // upshifts cut torque for a beat, downshifts happen as you slow.
  const tops = gpGearTops(racer, p.maxSpeed * T.speedScale);
  const G = T.gears;
  const v = racer.speed;
  const gear = Math.max(1, Math.min(tops.length, g.gear));
  const low = gear > 1 ? tops[gear - 2] : 0;
  g.rpm = betaClamp((v - low * 0.7) / (tops[gear - 1] - low * 0.7), 0, 1);
  const shifting = g.shiftUntil > now;
  if (!shifting && controls.up && gear < tops.length && v >= tops[gear - 1] * G.upAt) {
    g.gear = gear + 1;
    const shiftMs = G.shiftMs[0] + (G.shiftMs[1] - G.shiftMs[0]) * betaClamp(((p.powertrain || 70) - 40) / 60, 0, 1);
    g.shiftUntil = now + shiftMs;
    g.lastShiftAt = now;
  } else if (gear > 1 && v < tops[gear - 2] * G.downAt) {
    g.gear = gear - 1;
  }
  const pull = G.pull[Math.min(G.pull.length, g.gear) - 1] * (0.7 + 0.45 * Math.sin(Math.PI * Math.min(1, 0.25 + g.rpm * 0.75)));
  const gearCap = Math.min(maxSpeed, tops[Math.min(tops.length, g.gear) - 1] * (boosted ? 1.25 : 1));
  if (controls.up && !shifting) racer.speed += accel * pull * dt * (racer.speed < gearCap ? 1 : 0);
  if (controls.down) racer.speed -= p.brake * dt * (racer.speed > 0 ? 1 : 0.5);
  if (!controls.up && !controls.down) racer.speed *= Math.max(0, 1 - (0.55 - p.torque / 400) * dt);
  if (shifting) racer.speed *= Math.max(0, 1 - 0.18 * dt);
  racer.speed = Math.max(-maxSpeed * 0.3, Math.min(maxSpeed, racer.speed));

  // Steering: input turns the car, limited by grip at speed.
  const steer = Number.isFinite(controls.steer) ? betaClamp(controls.steer, -1, 1) : (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  const speedAbs = Math.abs(racer.speed);
  const lowSpeed = Math.min(1, Math.max(0.25, speedAbs / 160));
  const gripTurn = speedAbs > 30 ? gpLatG(racer) * (surface === "grass" ? 0.6 : 1) / speedAbs : Infinity;
  const turn = Math.min(p.turnRate * lowSpeed, gripTurn);
  racer.angle += steer * turn * dt * (racer.speed >= 0 ? 1 : -1);
  if (!steer && surface !== "grass" && speedAbs > 60 && controls.up) {
    const tangent = circuit.ang[g.index];
    const delta = betaNormalizeAngle(tangent - racer.angle);
    if (Math.abs(delta) < 0.5) racer.angle += delta * Math.min(1, T.assist * dt);
  }
  // The car slides a little: its motion catches up to where it points.
  const gripRate = T.grip[surface === "wall" ? "grass" : surface] || T.grip.road;
  g.moveAngle = gpLerpAngle(g.moveAngle ?? racer.angle, racer.angle, Math.min(1, gripRate * dt));
  if (racer.speed < 0) g.moveAngle = racer.angle;

  racer.prevX = racer.x;
  racer.prevY = racer.y;
  racer.x += Math.cos(g.moveAngle) * racer.speed * dt;
  racer.y += Math.sin(g.moveAngle) * racer.speed * dt;

  // Soft barrier at the outer edge of the runoff: slide along it, lose speed.
  const loc = gpLocate(circuit, racer.x, racer.y, g.index);
  const limit = circuit.hw + T.curb + T.runoff;
  if (Math.abs(loc.lateral) > limit) {
    const nrm = gpNormalAt(circuit, loc.index);
    const push = Math.abs(loc.lateral) - limit;
    const side = Math.sign(loc.lateral);
    racer.x -= nrm.x * push * side;
    racer.y -= nrm.y * push * side;
    const hitSpeed = Math.abs(racer.speed);
    racer.speed *= T.wall.keepSpeed;
    const tangent = circuit.ang[loc.index] + (racer.speed < 0 ? Math.PI : 0);
    racer.angle = gpLerpAngle(racer.angle, tangent, T.wall.align);
    g.moveAngle = racer.angle;
    if (racer.id === "player" && hitSpeed > 120 && betaState && (!betaState.lastWallFxAt || now - betaState.lastWallFxAt > 250)) {
      if (juiceEnabled()) {
        betaState.shake = Math.max(betaState.shake || 0, RACE_JUICE_TUNING.wallShake);
        raceJuiceSpawnSparks(racer.x, racer.y, 4);
      }
      raceJuiceHaptic(15);
      betaState.lastWallFxAt = now;
    }
  }
}

// ─── AI ──────────────────────────────────────────────────────────────────────
function gpAiSkill(racer) {
  return betaClamp(((racer.skill || 1) - 0.85) / 0.35, 0, 1);
}

function gpAiControls(racer) {
  const T = GP_TUNING.ai;
  const circuit = gpCircuit();
  const g = gpRacer(racer);
  if (g.index === null) gpUpdateLocation(racer, circuit);
  const now = betaNowMs();
  const skill = gpAiSkill(racer);
  const speed = Math.max(0, racer.speed);
  // Racecraft: pull out to pass a car just ahead, on the side with room.
  if (now > g.intentUntil) g.intent = 0;
  const ahead = (betaState?.racers || []).find((other) => other !== racer && !other.finished && other.gp && other.gp.dist > g.dist && other.gp.dist - g.dist < T.overtakeRange && Math.abs(other.gp.lateral - g.lateral) < circuit.hw * 0.55);
  if (ahead && !g.intent) {
    const room = circuit.lineOffset[g.index] > 0 ? -1 : 1;
    g.intent = room * T.overtakeOffset * circuit.hw;
    g.intentUntil = now + 1400 + Math.random() * 900;
  }
  if (now > g.noiseAt) {
    g.noise = (Math.random() * 2 - 1) * (T.noise[0] + (T.noise[1] - T.noise[0]) * skill);
    g.noiseAt = now + 900 + Math.random() * 900;
  }
  // Steer at a point down the racing line (plus intent and a little imprecision).
  const look = T.lookBase + speed * T.lookPerSpeed;
  const target = gpPointAt(circuit, g.dist + look, circuit.lineOffset[gpPointAt(circuit, g.dist + look).index] + g.intent + g.noise);
  const desired = Math.atan2(target.y - racer.y, target.x - racer.x);
  const error = betaNormalizeAngle(desired - racer.angle);
  const steer = betaClamp(error * T.steerGain, -1, 1);
  // Throttle/brake from the speed profile.
  const latG = gpLatG(racer) * (T.latG[0] + (T.latG[1] - T.latG[0]) * skill) * (racer.ai ? T.cornerScale : 1);
  const brake = T.brake[0] + (T.brake[1] - T.brake[0]) * skill;
  const cap = racer.physics.maxSpeed * GP_TUNING.speedScale;
  const targetSpeed = gpTargetSpeed(circuit, g.index, latG, brake, cap);
  const tooFast = speed > targetSpeed * 1.03;
  return { up: !tooFast, down: tooFast && speed > targetSpeed * 1.08, steer, left: steer < -0.15, right: steer > 0.15 };
}

// ─── Progress, grid, respawn ────────────────────────────────────────────────
function gpProgressRacer(racer) {
  const circuit = gpCircuit();
  const g = gpRacer(racer);
  if (g.index === null) gpUpdateLocation(racer, circuit);
  const L = circuit.length;
  const lapDist = g.dist;
  racer.lap = Math.max(1, Math.floor(lapDist / L) + 1);
  const into = ((lapDist % L) + L) % L;
  racer.checkpoint = lapDist < 0 ? 0 : Math.min(3, Math.floor((into / L) * 4));
  if (!racer.finished && lapDist >= betaLapsRequired * L) {
    racer.lap = betaLapsRequired;
    racer.checkpoint = 3;
    racer.finished = true;
    racer.finishTime = betaState.elapsed;
    if (racer.id === "player") {
      if (juiceEnabled()) {
        betaState.slowmoUntil = performance.now() + RACE_JUICE_TUNING.slowmoMs;
        raceJuiceSpawnConfetti(racer.x, racer.y, RACE_JUICE_TUNING.confettiCount);
      }
      raceJuiceHaptic([40, 30, 60]);
      finishBetaDemo();
    }
  }
}

function gpProgressScore(racer) {
  if (racer.finished) return 1e9 + (999 - (racer.finishTime || 999));
  return racer.gp?.dist ?? -1e6;
}

function gpStartPosition(index, totalRacers = 1) {
  const circuit = gpCircuit();
  const rows = Math.ceil(totalRacers / 2);
  let row;
  let col;
  if (index === 0) {
    row = rows - 1;
    col = 1;
  } else {
    row = Math.floor((index - 1) / 2);
    col = (index - 1) % 2;
  }
  const p = gpPointAt(circuit, -(row + 1) * GP_TUNING.car.gridGap, (col - 0.5) * circuit.hw * 0.7);
  return { x: p.x, y: p.y, angle: p.angle };
}

function gpRespawnPoint(racer) {
  const circuit = gpCircuit();
  const g = gpRacer(racer);
  const loc = gpLocate(circuit, racer.x, racer.y, g.index);
  const p = gpPointAt(circuit, loc.s, 0);
  g.index = p.index;
  g.moveAngle = p.angle;
  g.gear = 1;
  return { x: p.x, y: p.y, angle: p.angle, index: p.index };
}

// ─── Track objects (item boxes, boost pads, obstacles) along the circuit ──
function gpStraightNear(circuit, fraction) {
  const n = circuit.n;
  let bestI = Math.floor(n * fraction);
  let bestK = Infinity;
  for (let k = -Math.floor(n * 0.06); k <= Math.floor(n * 0.06); k += 1) {
    const i = (Math.floor(n * fraction) + k + n) % n;
    let sum = 0;
    for (let j = -6; j <= 6; j += 1) sum += Math.abs(circuit.curv[(i + j + n) % n]);
    if (sum < bestK) { bestK = sum; bestI = i; }
  }
  return circuit.cum[bestI];
}

function gpCreateObjects(config) {
  const circuit = gpCircuit();
  const L = circuit.length;
  const hw = circuit.hw;
  const at = (s, lateral) => gpPointAt(circuit, s, lateral);
  const itemBoxes = [];
  GP_TUNING.items.rows.forEach((f, row) => {
    const s = gpStraightNear(circuit, f);
    GP_TUNING.items.lanes.forEach((lat, k) => itemBoxes.push({ id: `box-${row}-${k}`, ...at(s, lat * hw), active: true, respawnAt: 0 }));
  });
  const boostPads = [0.22, 0.52, 0.76].map((f, i) => {
    const s = gpStraightNear(circuit, f);
    const p = at(s, (i % 2 ? -0.35 : 0.35) * hw);
    return { id: `pad-${i}`, x: p.x, y: p.y, angle: p.angle + Math.PI / 2 };
  });
  const obstacles = [0.3, 0.7].map((f, i) => {
    const p = at(L * f, (i % 2 ? 0.4 : -0.4) * hw);
    return { id: `hazard-${i}`, x: p.x, y: p.y, kind: i % 2 ? "barrel" : "cone", lastHit: {} };
  });
  return {
    itemBoxes: config.itemsEnabled ? itemBoxes.map(({ angle, index, ...box }) => box) : [],
    boostPads: config.boostPadsEnabled ? boostPads : [],
    obstacles: config.obstaclesEnabled ? obstacles : [],
    traps: [],
    projectiles: []
  };
}

// ─── Drawing ────────────────────────────────────────────────────────────────
let gpGrassPatterns = {};
function gpGrassPattern(ctx, color) {
  if (gpGrassPatterns[color]) return gpGrassPatterns[color];
  const tile = document.createElement("canvas");
  tile.width = tile.height = 128;
  const t = tile.getContext("2d");
  t.fillStyle = color;
  t.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 220; i += 1) {
    t.fillStyle = `rgba(${Math.random() < 0.5 ? "0,0,0" : "255,255,255"},${0.03 + Math.random() * 0.05})`;
    t.fillRect(Math.random() * 128, Math.random() * 128, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
  gpGrassPatterns[color] = ctx.createPattern(tile, "repeat");
  return gpGrassPatterns[color];
}

function gpCamera(w, h) {
  const T = GP_TUNING.camera;
  const player = betaState.player;
  const g = gpRacer(player);
  const target = (g.moveAngle ?? player.angle) * 0.35 + player.angle * 0.65;
  if (!Number.isFinite(betaState.camAngle)) betaState.camAngle = player.angle;
  const now = performance.now();
  const dt = Math.min(0.05, (now - (betaState.camAt || now)) / 1000);
  betaState.camAt = now;
  betaState.camAngle = gpLerpAngle(betaState.camAngle, target, Math.min(1, T.angleLerp * dt));
  const portrait = h > w * 1.1;
  return { x: player.x, y: player.y, angle: betaState.camAngle, zoom: portrait ? T.portraitZoom : 1, anchorY: T.anchorY };
}

function gpDrawCircuit(ctx, circuit) {
  const T = GP_TUNING;
  const theme = circuit.theme;
  const hw = circuit.hw;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = theme.barrier;
  ctx.lineWidth = 2 * (hw + T.curb + T.runoff) + 18;
  ctx.stroke(circuit.path);
  ctx.setLineDash([22, 22]);
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2 * (hw + T.curb + T.runoff) + 10;
  ctx.stroke(circuit.path);
  ctx.setLineDash([]);
  ctx.strokeStyle = theme.runoff;
  ctx.lineWidth = 2 * (hw + T.curb + T.runoff);
  ctx.stroke(circuit.path);
  ctx.lineCap = "butt";
  ctx.strokeStyle = "#f4f4f4";
  ctx.lineWidth = 2 * (hw + T.curb);
  ctx.stroke(circuit.curbPath);
  ctx.setLineDash([30, 30]);
  ctx.strokeStyle = "#e23b3b";
  ctx.stroke(circuit.curbPath);
  ctx.setLineDash([]);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#eef0f2";
  ctx.lineWidth = 2 * hw;
  ctx.stroke(circuit.path);
  ctx.strokeStyle = "#30343b";
  ctx.lineWidth = 2 * hw - 8;
  ctx.stroke(circuit.path);
  ctx.setLineDash([46, 54]);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 4;
  ctx.stroke(circuit.path);
  ctx.setLineDash([]);
  // Start / finish: a checkered band across the road.
  const s0 = gpPointAt(circuit, 0, 0);
  ctx.translate(s0.x, s0.y);
  ctx.rotate(s0.angle);
  const cell = 14;
  for (let row = 0; row < 2; row += 1) {
    for (let k = -Math.ceil(hw / cell); k < Math.ceil(hw / cell); k += 1) {
      ctx.fillStyle = (row + k) % 2 ? "#111" : "#f5f5f5";
      ctx.fillRect(row * cell - cell, k * cell, cell, cell);
    }
  }
  ctx.restore();
}

function gpDrawFrameWorld(ctx, w, h) {
  const circuit = gpCircuit();
  const cam = gpCamera(w, h);
  ctx.translate(w / 2, h * cam.anchorY);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.rotate(-cam.angle - Math.PI / 2);
  ctx.translate(-cam.x, -cam.y);
  const R = Math.hypot(w, h) / cam.zoom + 200;
  ctx.fillStyle = gpGrassPattern(ctx, circuit.theme.grass);
  ctx.fillRect(cam.x - R, cam.y - R, R * 2, R * 2);
  gpDrawCircuit(ctx, circuit);
}

function gpDrawMiniMap(ctx, w, h, circuit) {
  const b = circuit.bounds;
  const pad = 8;
  const scale = Math.min((w - pad * 2) / (b.maxX - b.minX || 1), (h - pad * 2) / (b.maxY - b.minY || 1));
  const ox = (w - (b.maxX - b.minX) * scale) / 2 - b.minX * scale;
  const oy = (h - (b.maxY - b.minY) * scale) / 2 - b.minY * scale;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(255,255,255,0.88)";
  ctx.lineWidth = Math.max(circuit.hw * 2, 4 / scale);
  ctx.stroke(circuit.path);
  ctx.restore();
  return (x, y) => ({ x: ox + x * scale, y: oy + y * scale });
}

// ─── Pause (4B) ─────────────────────────────────────────────────────────────
function gpCanPause() {
  return Boolean(betaState && betaState.active && !betaState.finished && !betaState.paused && !el.betaRace?.hidden);
}

function gpPause() {
  if (!gpCanPause()) return;
  betaState.paused = true;
  betaState.pausedAt = performance.now();
  if (betaState.raf) cancelAnimationFrame(betaState.raf);
  Object.keys(betaKeys).forEach((key) => { betaKeys[key] = false; });
  if (typeof updateBetaControlVisuals === "function") updateBetaControlVisuals();
  document.getElementById("beta-pause-overlay")?.removeAttribute("hidden");
  document.getElementById("beta-pause")?.setAttribute("aria-pressed", "true");
  el.betaRace?.classList.add("is-paused");
  document.getElementById("beta-resume")?.focus();
}

function gpResume() {
  if (!betaState?.paused) return;
  const now = performance.now();
  const held = now - (betaState.pausedAt || now);
  betaState.startTime += held;
  if (betaState.slowmoUntil) betaState.slowmoUntil += held;
  if (betaState.hitPauseUntil) betaState.hitPauseUntil += held;
  betaState.last = now;
  betaState.paused = false;
  gpHidePause();
  betaState.raf = requestAnimationFrame(updateBetaRace);
}

function gpTogglePause() {
  if (betaState?.paused) gpResume();
  else gpPause();
}

function gpHidePause() {
  document.getElementById("beta-pause-overlay")?.setAttribute("hidden", "");
  document.getElementById("beta-pause")?.setAttribute("aria-pressed", "false");
  el.betaRace?.classList.remove("is-paused");
}

document.getElementById("beta-pause")?.addEventListener("click", gpTogglePause);
document.getElementById("beta-resume")?.addEventListener("click", gpResume);
document.getElementById("beta-pause-quit")?.addEventListener("click", () => {
  gpHidePause();
  el.betaExit?.click();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && gpCanPause()) gpPause();
});

// ─── Speed + gear dial (automatic) ──────────────────────────────────────────
function gpRenderGearHud() {
  const g = betaState?.player?.gp;
  const hud = document.querySelector("#beta-race .beta-stage") || document.getElementById("beta-canvas")?.parentElement;
  if (!g || !hud) return;
  let panel = document.getElementById("gp-speed-panel");
  if (panel && !panel.classList.contains("gp-dial")) {
    panel.remove();
    panel = null;
  }
  if (!panel) {
    panel = document.createElement("div");
    panel.className = "gp-speed-panel gp-dial drag-dial";
    panel.id = "gp-speed-panel";
    panel.innerHTML = gpDialMarkup();
    hud.appendChild(panel);
  }
  panel.hidden = !betaState.active || Boolean(betaState.finished);
  const reverse = (betaState.player.speed || 0) < -5;
  const rpm = betaClamp(g.rpm || 0, 0, 1);
  const needle = panel.querySelector(".drag-dial-needle");
  if (needle) needle.setAttribute("transform", `rotate(${(dragDialAngle(rpm) + 90).toFixed(2)} ${DRAG_DIAL.cx} ${DRAG_DIAL.cy})`);
  const gearText = panel.querySelector(".drag-dial-gear");
  if (gearText) gearText.textContent = reverse ? "R" : String(g.gear || 1);
  const speedText = panel.querySelector(".drag-dial-speed");
  if (speedText) speedText.textContent = String(Math.round(Math.abs(betaState.player.speed) / 5.2));
  const shifting = g.shiftUntil > betaNowMs();
  panel.classList.toggle("shifting", shifting);
  panel.classList.toggle("in-window", shifting);
  panel.classList.toggle("over", rpm > 0.95);
}

function gpDialMarkup() {
  const ticks = Array.from({ length: 11 }, (_, index) => {
    const t = index / 10;
    const [x1, y1] = dragDialPoint(t, DRAG_DIAL.r - 14);
    const [x2, y2] = dragDialPoint(t, DRAG_DIAL.r - (index % 5 ? 19 : 23));
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }).join("");
  return `<svg viewBox="0 0 200 200" aria-hidden="true">
    <circle class="drag-dial-face" cx="${DRAG_DIAL.cx}" cy="${DRAG_DIAL.cy}" r="${DRAG_DIAL.r + 14}"/>
    <path class="drag-dial-track" d="${dragDialArc(0, 1)}"/>
    <path class="drag-dial-zone ok" d="${dragDialArc(0.8, 0.95)}"/>
    <path class="drag-dial-zone over" d="${dragDialArc(0.95, 1)}"/>
    <g class="drag-dial-ticks">${ticks}</g>
    <g class="drag-dial-needle"><line x1="${DRAG_DIAL.cx}" y1="${DRAG_DIAL.cy - 30}" x2="${DRAG_DIAL.cx}" y2="${DRAG_DIAL.cy - DRAG_DIAL.r + 4}"/></g>
    <circle class="drag-dial-ready" cx="${DRAG_DIAL.cx + 44}" cy="${DRAG_DIAL.cy + 16}" r="7"/>
    <text class="drag-dial-ready-label" x="${DRAG_DIAL.cx + 44}" y="${DRAG_DIAL.cy + 34}">SHIFT</text>
    <text class="drag-dial-gear" x="${DRAG_DIAL.cx}" y="${DRAG_DIAL.cy + 14}">1</text>
    <text class="drag-dial-gear-label" x="${DRAG_DIAL.cx}" y="${DRAG_DIAL.cy - 26}">GEAR</text>
    <text class="drag-dial-speed" x="${DRAG_DIAL.cx}" y="${DRAG_DIAL.cy + 42}">0</text>
    <text class="drag-dial-unit" x="${DRAG_DIAL.cx}" y="${DRAG_DIAL.cy + 56}">MPH</text>
    <text class="drag-dial-ready-label gp-dial-auto" x="${DRAG_DIAL.cx - 44}" y="${DRAG_DIAL.cy + 34}">AUTO</text>
  </svg>`;
}
