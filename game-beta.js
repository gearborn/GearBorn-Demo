// ─── BETA TRACK DATA & CIRCUIT MODE ───────────────────────────────────────
const betaTileSize = 256;
const betaLapsRequired = 2;
const betaTileImages = {};
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
  const tile = betaTileAt(x, y);
  const baseClass = betaTileClass(tile);
  if (baseClass !== "road") return baseClass;
  const tx = Math.floor(x / betaTileSize);
  const ty = Math.floor(y / betaTileSize);
  const localX = (x - tx * betaTileSize) / betaTileSize;
  const localY = (y - ty * betaTileSize) / betaTileSize;
  return betaRoadMaskContains(tile, localX, localY) ? "road" : "grass";
}

function betaNormalizeAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function betaStraightAssistAngle(racer) {
  const tile = betaTileAt(racer.x, racer.y);
  if (!tile || tile.type !== "road_straight") return null;
  const vertical = tile.rotation === 90 || tile.rotation === 270;
  const candidates = vertical ? [Math.PI / 2, -Math.PI / 2] : [0, Math.PI];
  return candidates.reduce((best, angle) => {
    const bestDelta = Math.abs(betaNormalizeAngle(best - racer.angle));
    const delta = Math.abs(betaNormalizeAngle(angle - racer.angle));
    return delta < bestDelta ? angle : best;
  }, candidates[0]);
}

function betaNearestRoadSpawn(racer) {
  const line = betaAiRacingLine?.length ? betaAiRacingLine : betaTrack.aiLine;
  let bestIndex = betaNearestAiLineIndex(racer, line);
  const point = line[bestIndex] || { x: (betaTrack.startTile.x + 0.5) * betaTileSize, y: (betaTrack.startTile.y + 0.5) * betaTileSize };
  const next = line[(bestIndex + 1) % line.length] || point;
  return {
    x: point.x,
    y: point.y,
    angle: Math.atan2(next.y - point.y, next.x - point.x),
    index: bestIndex
  };
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
  const surface = betaSurfaceAt(racer.x, racer.y);
  if (racer.ai) {
    const nearestIndex = betaNearestAiLineIndex(racer);
    if (betaAiRacingLine?.length && surface !== "wall") {
      const lineAhead = surface === "road" ? 2 : 3;
      racer.aiWaypoint = (nearestIndex + lineAhead) % betaAiRacingLine.length;
    }
    if (!racer.lastProgressAt) {
      racer.lastProgressAt = now;
      racer.lastRecoveryX = racer.x;
      racer.lastRecoveryY = racer.y;
    }
    if (now - racer.lastProgressAt >= 900) {
      const moved = Math.hypot(racer.x - (racer.lastRecoveryX ?? racer.x), racer.y - (racer.lastRecoveryY ?? racer.y));
      if (moved < 18 && Math.abs(racer.speed || 0) < 32) {
        racer.stuckSince = racer.stuckSince || now;
      } else {
        racer.stuckSince = null;
      }
      racer.lastRecoveryX = racer.x;
      racer.lastRecoveryY = racer.y;
      racer.lastProgressAt = now;
      if (racer.stuckSince && now - racer.stuckSince >= 3200) {
        betaRespawnRacer(racer, now);
        return;
      }
    }
  }
  if (surface === "road") {
    racer.offTrackSince = null;
    return;
  }
  racer.offTrackSince = racer.offTrackSince || now;
  const limit = racer.ai ? 4200 : 5000;
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
  el.betaCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
  el.betaCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const miniRect = el.betaMinimap.getBoundingClientRect();
  el.betaMinimap.width = Math.max(1, Math.floor(miniRect.width * ratio));
  el.betaMinimap.height = Math.max(1, Math.floor(miniRect.height * ratio));
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
  let cssHeight = cssWidth / aspect;
  if (cssHeight > availableHeight) {
    cssHeight = availableHeight;
    cssWidth = cssHeight * aspect;
  }
  el.betaCanvas.style.width = `${Math.round(cssWidth)}px`;
  el.betaCanvas.style.height = `${Math.round(cssHeight)}px`;
  betaResizeCanvas();
}

function showBetaRotationTip() {
  if (!el.rotationTip || state.dismissedRotationTips || !betaIsMobilePortrait()) return;
  el.rotationTip.hidden = false;
  requestAnimationFrame(() => el.rotationTip?.classList.add("active"));
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

function openBetaIntro() {
  if (!el.betaIntro || !el.betaRace) return;
  el.betaRace.hidden = true;
  stopBetaDemo(false);
  showBetaScreen("beta-intro");
}

function startBetaDemo() {
  if (!el.betaCanvas) return;
  betaResizeCanvas();
  const carId = betaCurrentCarId();
  const stats = carStats(carId);
  const startX = (betaTrack.startTile.x + 0.5) * betaTileSize;
  const startY = (betaTrack.startTile.y + 0.5) * betaTileSize;
  betaCarImage = new Image();
  betaCarImage.src = topDownImageForCar(carId) || imageFor(currentEvolution(carId), "display");
  betaState = {
    carId,
    stats,
    x: startX,
    y: startY,
    prevX: startX,
    prevY: startY,
    angle: betaTrack.startAngle,
    speed: 0,
    active: false,
    finished: false,
    debug: false,
    lap: 1,
    checkpoint: 0,
    wasOnStart: true,
    startTime: 0,
    elapsed: 0,
    last: performance.now(),
    raf: null
  };
  showBetaScreen(null); // hide all beta screens
  el.betaRace.hidden = false;
  el.betaResults.hidden = true;
  el.betaDebug.textContent = "Debug: Off";
  drawBetaFrame();
  runCountdown(el.betaCountdown, () => {
    if (!betaState || betaState.finished) return;
    betaState.active = true;
    betaState.startTime = performance.now();
    betaState.last = betaState.startTime;
    betaState.raf = requestAnimationFrame(updateBetaRace);
  });
}

function stopBetaDemo(showIntro = true) {
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

function updateBetaRace(now) {
  if (!betaState || betaState.finished) return;
  const dt = Math.min(0.035, (now - betaState.last) / 1000);
  betaState.last = now;
  const s = betaState.stats;
  const currentClass = betaTileClass(betaTileAt(betaState.x, betaState.y));
  const grassFactor = currentClass === "grass" ? Math.min(0.48, 0.28 + (s.torque || 70) / 520) : 1;
  const maxSpeed = (320 + (s.speed || 70) * 3.5 + (s.powertrain || 70) * 0.45) * grassFactor;
  const accel = (280 + (s.acceleration || 70) * 5) * (currentClass === "grass" ? 0.32 + (s.torque || 70) / 480 : 1);
  const brake = 520 + (s.torque || 70) * 2;
  const turnRate = (1.9 + (s.handling || 70) / 36) * Math.min(1, Math.max(0.25, Math.abs(betaState.speed) / 190));
  if (betaInput("up")) betaState.speed += accel * dt;
  if (betaInput("down")) betaState.speed -= brake * dt;
  if (!betaInput("up") && !betaInput("down")) betaState.speed *= Math.max(0, 1 - (1.35 - (s.torque || 70) / 180) * dt);
  betaState.speed = Math.max(-maxSpeed * 0.34, Math.min(maxSpeed, betaState.speed));
  if (betaInput("left")) betaState.angle -= turnRate * dt * (betaState.speed >= 0 ? 1 : -1);
  if (betaInput("right")) betaState.angle += turnRate * dt * (betaState.speed >= 0 ? 1 : -1);
  betaState.prevX = betaState.x;
  betaState.prevY = betaState.y;
  betaState.x += Math.cos(betaState.angle) * betaState.speed * dt;
  betaState.y += Math.sin(betaState.angle) * betaState.speed * dt;
  const nextClass = betaTileClass(betaTileAt(betaState.x, betaState.y));
  if (nextClass === "wall") {
    betaState.x = betaState.prevX;
    betaState.y = betaState.prevY;
    betaState.speed *= -(0.08 + Math.max(0, 100 - (s.body || 70)) * 0.002);
  }
  updateBetaCheckpoints();
  betaState.elapsed = betaState.active ? (now - betaState.startTime) / 1000 : 0;
  drawBetaFrame();
  betaState.raf = requestAnimationFrame(updateBetaRace);
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

function finishBetaDemo() {
  if (!betaState) return;
  betaState.finished = true;
  betaState.active = false;
  if (betaState.raf) cancelAnimationFrame(betaState.raf);
  el.betaFinalTime.textContent = `Final time: ${betaState.elapsed.toFixed(2)} s`;
  el.betaResults.hidden = false;
  drawBetaFrame();
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

function drawBetaFrame() {
  if (!betaState || !el.betaCanvas) return;
  betaResizeCanvas();
  const ctx = el.betaCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaCanvas.width / ratio;
  const h = el.betaCanvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const worldW = betaTrack.width * betaTileSize;
  const worldH = betaTrack.height * betaTileSize;
  const camX = Math.max(0, Math.min(worldW - w, betaState.x - w / 2));
  const camY = Math.max(0, Math.min(worldH - h, betaState.y - h / 2));
  const startCol = Math.max(0, Math.floor(camX / betaTileSize) - 1);
  const endCol = Math.min(betaTrack.width - 1, Math.ceil((camX + w) / betaTileSize) + 1);
  const startRow = Math.max(0, Math.floor(camY / betaTileSize) - 1);
  const endRow = Math.min(betaTrack.height - 1, Math.ceil((camY + h) / betaTileSize) + 1);
  ctx.save();
  ctx.translate(-camX, -camY);
  for (let y = startRow; y <= endRow; y += 1) {
    for (let x = startCol; x <= endCol; x += 1) {
      drawBetaTile(ctx, betaTrack.grid[y][x], x * betaTileSize, y * betaTileSize);
    }
  }
  drawBetaMarkersSimple(ctx);
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

function drawBetaCar(ctx) {
  ctx.save();
  ctx.translate(betaState.x, betaState.y);
  ctx.rotate(betaState.angle + Math.PI / 2);
  if (betaCarImage?.complete && betaCarImage.naturalWidth) {
    ctx.drawImage(betaCarImage, -34, -48, 68, 96);
  } else {
    ctx.fillStyle = cars.find((car) => car.id === betaState.carId)?.color || "#ffc857";
    ctx.fillRect(-18, -34, 36, 68);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-12, -16, 24, 18);
  }
  ctx.restore();
}

function drawBetaDebug(ctx) {
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = 2;
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.72)";
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    ctx.strokeRect(x * betaTileSize, y * betaTileSize, betaTileSize, betaTileSize);
    ctx.fillText(betaTileClass(tile), x * betaTileSize + 12, y * betaTileSize + 26);
  }));
  ctx.strokeStyle = "#ff5f5f";
  ctx.beginPath();
  ctx.arc(betaState.x, betaState.y, 32, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBetaMiniMap() {
  if (!el.betaMinimap || !betaState) return;
  const ctx = el.betaMinimap.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaMinimap.width / ratio;
  const h = el.betaMinimap.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / betaTrack.width, h / betaTrack.height);
  const offsetX = (w - betaTrack.width * scale) / 2;
  const offsetY = (h - betaTrack.height * scale) / 2;
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    const cls = betaTileClass(tile);
    if (cls === "grass") return;
    ctx.fillStyle = cls === "wall" ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.88)";
    ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
  }));
  ctx.fillStyle = "#ffc857";
  ctx.beginPath();
  ctx.arc(offsetX + betaState.x / betaTileSize * scale, offsetY + betaState.y / betaTileSize * scale, 4, 0, Math.PI * 2);
  ctx.fill();
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

function getRandomOpponentCars(count, playerCarId) {
  const playerProgress = state.garage[playerCarId] || { level: 1, evolution: 0 };
  const pool = getEligibleBetaOpponentLines(playerCarId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, index) => {
    const car = shuffled[index % shuffled.length];
    const evolution = Math.min(playerProgress.evolution || 0, car.evolutions.length - 1);
    const form = car.evolutions[evolution] || car.evolutions[0];
    const level = (playerProgress.level || 1) - 3;
    const ratings = betaRatingsForCar(car.id, level, evolution, false);
    return {
      car,
      carId: car.id,
      form,
      evolution,
      level,
      ratings,
      skill: 1.04 + Math.random() * 0.07
    };
  });
}

function betaBossCarSetup(boss) {
  const bossIndex = Math.max(0, bossChallengeBosses.findIndex((item) => item.id === boss.id));
  const playerCarId = betaCurrentCarId();
  const playerProgress = state.garage[playerCarId] || { level: 1, evolution: 0 };
  const level = Math.max(1, (playerProgress.level || 1) - 3);
  const knownLine = cars.find((car) => car.evolutions.some((form) => form.name === boss.car));
  if (knownLine) {
    const evolution = Math.max(0, knownLine.evolutions.findIndex((form) => form.name === boss.car));
    const form = knownLine.evolutions[evolution] || knownLine.evolutions[0];
    return {
      car: knownLine,
      carId: knownLine.id,
      form,
      evolution,
      level,
      ratings: betaRatingsForCar(knownLine.id, level, evolution, false),
      skill: 1
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
    skill: 1
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

function pinkSlipOpponentSetup(level) {
  const car = cars.find((item) => item.id === level.pinkSlipCarId) || cars[0];
  const form = car.evolutions[0];
  const playerProgress = state.garage[state.selectedStoryCar] || { level: 1 };
  const levelValue = Math.max(1, (playerProgress.level || 1) - 3);
  return {
    driver: { id: `pink-${car.id}`, name: form.name, headshot: forgeMedallionSrc(car.id), image: forgeMedallionSrc(car.id) },
    car,
    carId: car.id,
    form,
    evolution: 0,
    level: levelValue,
    ratings: betaRatingsForCar(car.id, levelValue, 0, false),
    skill: 1.03
  };
}

function rivalOpponentSetup(level) {
  const rival = rivalTuner();
  const setup = rivalCarSetup(state.selectedStoryCar);
  return {
    driver: rival,
    car: setup.car,
    carId: setup.carId,
    form: setup.form,
    evolution: setup.evolution,
    level: setup.level,
    ratings: setup.stats || setup.ratings,
    skill: 1.04
  };
}

function story2dOpponentsForLevel(level, mode = story2dModeForLevel(level), campaignIndex = null) {
  const cacheKey = campaignIndex === null ? "" : `${campaignIndex}:${mode}:${state.selectedStoryCar}:${selectedTuner().id}`;
  if (cacheKey && story2dOpponentCache.has(cacheKey)) return story2dOpponentCache.get(cacheKey);
  let opponents = [];
  if (!betaModeConfigs[mode]?.opponents) return [];
  if (level.type === "boss") opponents = [{ ...betaBossCarSetup(level.final ? finalBoss : bosses[level.bossIndex]), driver: level.final ? finalBoss : bosses[level.bossIndex] }];
  else if (level.type === "pink-slip") opponents = [pinkSlipOpponentSetup(level)];
  else if (level.type === "rival") opponents = [rivalOpponentSetup(level)];
  else {
    const drivers = betaNpcDriversForMode(mode);
    opponents = getRandomOpponentCars(betaModeConfigs[mode].opponents, state.selectedStoryCar).map((opponent, index) => ({
      ...opponent,
      driver: drivers[index] || otherNpcProfiles[index % otherNpcProfiles.length]
    }));
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

function betaMakeImage(src) {
  const img = new Image();
  img.src = src || "";
  return img;
}

function betaImageReady(img) {
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    window.setTimeout(done, 1400);
  });
}

async function preloadBetaRaceAssets() {
  const images = [
    ...Object.values(betaTileImages),
    ...Object.values(betaTrackImages || {}),
    ...(betaState?.racers || []).map((racer) => racer.image)
  ].filter(Boolean);
  await Promise.race([
    Promise.all(images.map(betaImageReady)),
    new Promise((resolve) => window.setTimeout(resolve, 2600))
  ]);
}

function setBetaLoading(active) {
  if (!el.betaLoading) return;
  if (active && !el.betaLoading.querySelector(".fuel-tank")) {
    el.betaLoading.innerHTML = `
      <div class="loading-card beta-loading-card">
        <div class="loading-logo">
          <img src="assets/logo/gearborn-logo.png" alt="GearBorn" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
          <div class="loading-logo-text"><strong>GearBorn</strong><span>Engines Evolved</span></div>
        </div>
        <h1>Fueling Engines…</h1>
        <div class="fuel-tank" aria-label="Loading progress">
          <div class="fuel-fill beta-fuel-fill" id="beta-fuel-fill" style="width:12%"></div>
          <span class="fuel-cap" aria-hidden="true"></span>
        </div>
        <p class="loading-tip">Warming up the track…</p>
      </div>
    `;
    // Animate fill
    let pct = 12;
    const fill = el.betaLoading.querySelector(".beta-fuel-fill");
    const fillTimer = setInterval(() => {
      if (!el.betaLoading || el.betaLoading.hidden) { clearInterval(fillTimer); return; }
      pct = Math.min(92, pct + 4 + Math.random() * 10);
      if (fill) fill.style.width = pct + "%";
    }, 180);
    el.betaLoading._fillTimer = fillTimer;
  }
  if (!active && el.betaLoading._fillTimer) {
    clearInterval(el.betaLoading._fillTimer);
    el.betaLoading._fillTimer = null;
    const fill = el.betaLoading.querySelector(".beta-fuel-fill");
    if (fill) fill.style.width = "100%";
  }
  el.betaLoading.hidden = !active;
  el.betaLoading.classList.toggle("active", active);
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
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const w = canvas.width / ratio;
  const h = canvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / track.width, h / track.height) * 0.92;
  const tile = scale;
  const offsetX = (w - track.width * tile) / 2;
  const offsetY = (h - track.height * tile) / 2;
  ctx.fillStyle = "#14341d";
  ctx.fillRect(0, 0, w, h);
  track.grid.forEach((row, y) => row.forEach((cell, x) => {
    const cls = betaTileClass(cell);
    if (cls === "grass") {
      ctx.fillStyle = "#245d38";
    } else if (cls === "wall") {
      ctx.fillStyle = "rgba(255,255,255,.2)";
    } else {
      ctx.fillStyle = "#24282f";
    }
    ctx.fillRect(offsetX + x * tile, offsetY + y * tile, Math.ceil(tile), Math.ceil(tile));
  }));
  ctx.fillStyle = "#ffc857";
  ctx.fillRect(offsetX + track.startTile.x * tile, offsetY + track.startTile.y * tile, tile, tile);
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

function renderBetaTrackSelect() {
  if (!el.betaTrackList) return;
  const tracks = betaSelectableTracks(betaPendingMode);
  el.betaTrackList.innerHTML = tracks.map((track) => {
    const icon = betaTrackCityIcons[track.id] || "";
    const isActive = track.id === betaSelectedTrackId;
    return `
      <button class="beta-city-tile ${isActive ? "active" : ""}" data-beta-track="${track.id}" type="button" aria-label="${track.name}">
        ${icon ? `<img src="${icon}" alt="${track.name}" loading="lazy" onerror="this.style.display='none'">` : ""}
        <span>${track.name}</span>
      </button>
    `;
  }).join("");
  drawBetaTrackPreview(betaTrackById(betaSelectedTrackId, betaPendingMode));
}

function betaDriverPortraitMarkup(driver) {
  const name = driver?.name || "Racer";
  const image = driver?.headshot || driver?.image || "";
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return `
    <span class="beta-racer-head ${image ? "" : "placeholder"}">
      ${image ? `<img src="${image}" alt="${name}" loading="lazy" decoding="async" onerror="this.remove(); this.parentElement.classList.add('placeholder');">` : ""}
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
      skill: 0.98
    }];
  }
  const drivers = betaNpcDriversForMode(mode);
  return getRandomOpponentCars(config.opponents, betaCurrentCarId()).map((opponent, index) => ({
    ...opponent,
    driver: drivers[index] || otherNpcProfiles[index % otherNpcProfiles.length]
  }));
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
    const best = state.betaTimeTrials?.[betaTrack.id]?.bestTime;
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
  if (el.betaTrackSelectTitle) el.betaTrackSelectTitle.textContent = `${modeLabels[mode] || "Race"} — Choose a Track`;
  showBetaScreen("beta-track-select-screen");
  renderBetaTrackSelect();
}

function closeBetaTrackSelect() {
  // Back from track select → return to car select
  showBetaScreen("beta-car-select-screen");
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

function betaMakeRacer({ id, name, carId, form, ratings, color, x, y, angle = 0, ai = false, skill = 1, ghost = false }) {
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
    ghost,
    image: betaMakeImage(form?.images?.topdown || form?.images?.display),
    record: [],
    lastRecord: 0
  };
}

function betaStartPosition(index, totalRacers = 1) {
  // All cars start near the start/finish tile
  const startTile = betaTrack.startTile;
  const baseX = (startTile.x + 0.5) * betaTileSize;
  const baseY = (startTile.y + 0.5) * betaTileSize;
  const angle = betaTrack.startAngle;
  // Perpendicular (lateral) direction
  const latX = -Math.sin(angle);
  const latY = Math.cos(angle);
  // Behind direction (opposite of travel)
  const backX = -Math.cos(angle);
  const backY = -Math.sin(angle);
  const lateralSpacing = 60;
  const rowSpacing = 90;
  // Grid layout: 2 columns, rows stacked behind line
  // index 0 = player, in the LAST row (furthest back)
  // AI cars fill front rows first
  const numRows = Math.ceil(totalRacers / 2);
  // Map: player (index=0) goes to last row
  // AI: index 1..N go to rows front-to-back (row 0 = closest to line)
  let col, row;
  if (index === 0) {
    // Player: last row
    row = numRows - 1;
    col = 1; // right side
  } else {
    // AI cars: sorted front (row 0) to back (row numRows-2)
    const aiIndex = index - 1; // 0-based AI index
    row = Math.floor(aiIndex / 2);
    col = aiIndex % 2;
  }
  // col 0 = left (-lateralSpacing/2), col 1 = right (+lateralSpacing/2)
  const lateralOffset = (col - 0.5) * lateralSpacing;
  // row 0 = just behind line, increasing rows go further back
  const backOffset = (row + 1) * rowSpacing;
  return {
    x: baseX + latX * lateralOffset + backX * backOffset,
    y: baseY + latY * lateralOffset + backY * backOffset
  };
}

function startBetaDemo(mode = betaState?.config?.id || "time") {
  if (!el.betaCanvas) return;
  const config = betaModeConfigs[mode] || betaModeConfigs.time;
  betaResizeCanvas();
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
  const savedGhost = config.id === "time" ? state.betaTimeTrials?.testTrack?.ghost || null : null;
  betaState = {
    config,
    context: betaRaceContext,
    player,
    racers: [player].concat(opponents),
    ghost: savedGhost,
    ghostPoint: null,
    active: false,
    finished: false,
    debug: false,
    startTime: 0,
    elapsed: 0,
    last: performance.now(),
    raf: null
  };
  showBetaScreen(null); // hide all beta screens
  el.betaRace.hidden = false;
  el.betaResults.hidden = true;
  el.betaDebug.textContent = "Debug: Off";
  drawBetaFrame();
  runCountdown(el.betaCountdown, () => {
    if (!betaState || betaState.finished) return;
    betaState.active = true;
    betaState.startTime = performance.now();
    betaState.last = betaState.startTime;
    betaState.raf = requestAnimationFrame(updateBetaRace);
  });
}

function betaDriveRacer(racer, dt, controls = {}) {
  const currentClass = betaTileClass(betaTileAt(racer.x, racer.y));
  const grassFactor = currentClass === "grass" ? Math.min(0.82, 0.56 + racer.physics.torque / 420) : 1;
  const maxSpeed = racer.physics.maxSpeed * grassFactor;
  const accel = racer.physics.acceleration * (currentClass === "grass" ? 0.58 + racer.physics.torque / 360 : 1);
  if (controls.up) racer.speed += accel * dt;
  if (controls.down) racer.speed -= racer.physics.brake * dt;
  if (!controls.up && !controls.down) racer.speed *= Math.max(0, 1 - (1.35 - racer.physics.torque / 180) * dt);
  racer.speed = Math.max(-maxSpeed * 0.34, Math.min(maxSpeed, racer.speed));
  const turnRate = racer.physics.turnRate * Math.min(1, Math.max(0.25, Math.abs(racer.speed) / 190));
  if (controls.left) racer.angle -= turnRate * dt * (racer.speed >= 0 ? 1 : -1);
  if (controls.right) racer.angle += turnRate * dt * (racer.speed >= 0 ? 1 : -1);
  const assistAngle = controls.up ? betaStraightAssistAngle(racer) : null;
  if (assistAngle !== null && Math.abs(racer.speed) > 45) {
    const correction = betaNormalizeAngle(assistAngle - racer.angle);
    const playerSteering = controls.left || controls.right;
    const assistStrength = (playerSteering ? 0.92 : 1.8) + (racer.physics.torque || 70) / 120;
    racer.angle += correction * Math.min(1, assistStrength * dt);
  }
  racer.prevX = racer.x;
  racer.prevY = racer.y;
  racer.x += Math.cos(racer.angle) * racer.speed * dt;
  racer.y += Math.sin(racer.angle) * racer.speed * dt;
  if (betaTileClass(betaTileAt(racer.x, racer.y)) === "wall") {
    racer.x = racer.prevX;
    racer.y = racer.prevY;
    racer.speed *= -(0.08 + Math.max(0, 100 - racer.physics.body) * 0.002);
  }
}

function betaAiControls(racer) {
  const target = betaWaypointPath[racer.checkpoint] || betaWaypointPath[0];
  const desired = Math.atan2(target.y - racer.y, target.x - racer.x);
  const delta = Math.atan2(Math.sin(desired - racer.angle), Math.cos(desired - racer.angle));
  return {
    up: Math.abs(delta) < 0.9 || racer.speed < 140,
    down: Math.abs(delta) > 1.12 && racer.speed > 130,
    left: delta < -0.08,
    right: delta > 0.08
  };
}

function betaStartLineCrossed(racer) {
  if (!betaTrack?.startTile) return false;
  const cx = (betaTrack.startTile.x + 0.5) * betaTileSize;
  const cy = (betaTrack.startTile.y + 0.5) * betaTileSize;
  const travelIsHorizontal = Math.abs(Math.cos(betaTrack.startAngle || 0)) >= Math.abs(Math.sin(betaTrack.startAngle || 0));
  const across = travelIsHorizontal ? Math.abs(racer.x - cx) : Math.abs(racer.y - cy);
  const along = travelIsHorizontal ? Math.abs(racer.y - cy) : Math.abs(racer.x - cx);
  return across <= 18 && along <= betaTileSize * 0.35;
}

function betaProgressRacer(racer) {
  const tx = Math.floor(racer.x / betaTileSize);
  const ty = Math.floor(racer.y / betaTileSize);
  const next = betaTrack.checkpoints[racer.checkpoint];
  if (next && tx === next.x && ty === next.y) racer.checkpoint += 1;
  const onStart = betaStartLineCrossed(racer);
  if (onStart && !racer.wasOnStart && racer.checkpoint >= betaTrack.checkpoints.length) {
    if (racer.lap >= betaLapsRequired) {
      racer.finished = true;
      racer.finishTime = betaState.elapsed;
      if (racer.id === "player") finishBetaDemo();
    } else {
      racer.lap += 1;
      racer.checkpoint = 0;
    }
  }
  racer.wasOnStart = onStart;
  // Advance AI waypoint when close enough to current target
  if (racer.ai && typeof racer.aiWaypoint === "number" && betaAiRacingLine?.length) {
    const wp = betaAiRacingLine[racer.aiWaypoint];
    if (wp && Math.hypot(wp.x - racer.x, wp.y - racer.y) < 68) {
      racer.aiWaypoint = (racer.aiWaypoint + 1) % betaAiRacingLine.length;
    }
  }
}

function betaTimeMedalForElapsed(elapsed) {
  const match = timeMedals.find((medal) => elapsed <= medal.base);
  return match?.key || "none";
}

function betaProgressScore(racer) {
  if (racer.finished) return 100000 + (999 - (racer.finishTime || 999));
  const next = betaWaypointPath[racer.checkpoint] || betaWaypointPath[0];
  const distance = Math.hypot(next.x - racer.x, next.y - racer.y);
  return (racer.lap - 1) * 10 + racer.checkpoint + Math.max(0, 1 - distance / betaTileSize);
}

function betaPlacements() {
  return [...(betaState?.racers || [])].sort((a, b) => betaProgressScore(b) - betaProgressScore(a));
}

function betaCollisionCorners(racer) {
  const halfLength = 37;
  const halfWidth = 22;
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
      if (closingSpeed < -22) {
        a.speed *= 0.9 + Math.min(0.08, a.physics.body / 1200);
        b.speed *= 0.9 + Math.min(0.08, b.physics.body / 1200);
      }
    }
  }
}

function updateBetaRace(now) {
  if (!betaState || betaState.finished) return;
  const dt = Math.min(0.035, (now - betaState.last) / 1000);
  betaState.last = now;
  betaState.elapsed = betaState.active ? (now - betaState.startTime) / 1000 : 0;
  betaDriveRacer(betaState.player, dt, {
    up: betaInput("up"),
    down: betaInput("down"),
    left: betaInput("left"),
    right: betaInput("right")
  });
  betaState.racers.filter((racer) => racer.ai && !racer.finished).forEach((racer) => betaDriveRacer(racer, dt, betaAiControls(racer)));
  betaResolveCarCollisions();
  betaState.racers.filter((racer) => !racer.finished).forEach(betaProgressRacer);
  betaRecordGhostSample(now);
  betaState.ghostPoint = betaGhostPointAt(betaState.elapsed);
  drawBetaFrame();
  betaState.raf = requestAnimationFrame(updateBetaRace);
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
    const previous = state.betaTimeTrials?.[betaTrack.id]?.bestTime;
    const isBest = !previous || elapsed < previous;
    if (isBest) {
      state.betaTimeTrials = state.betaTimeTrials || {};
      state.betaTimeTrials[betaTrack.id] = {
        bestTime: elapsed,
        ghost: betaState.player.record.slice(0, 900)
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
  recordStoryRaceOutcome(won, true);
  let penaltyLine = "";
  if (riskyPinkSlipLoss) {
    applyPinkSlipLossPenalty(carId);
    maybeTriggerRoyalFlushGauntlet(storyCityForCampaignIndex(context.campaignLevelIndex)?.id);
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
      if (won && level.type === "pink-slip" && level.pinkSlipCarId && !isCarUnlocked(level.pinkSlipCarId)) {
        showPinkSlipUnlock(level.pinkSlipCarId, finishStory);
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
  const ts = betaTileSize;
  // --- Start / Finish line ---
  const sx = betaTrack.startTile.x * ts;
  const sy = betaTrack.startTile.y * ts;
  const startTile = betaTrack.grid[betaTrack.startTile.y]?.[betaTrack.startTile.x];
  const startIsHoriz = betaTileIsHorizontal(startTile);
  const sfImg = betaTrackImages.startFinish;
  if (sfImg?.complete && sfImg.naturalWidth) {
    ctx.save();
    ctx.translate(sx + ts / 2, sy + ts / 2);
    // Image is a horizontal strip; to cross a horizontal road it must rotate 90°;
    // to cross a vertical road it stays at 0° (already perpendicular)
    if (startIsHoriz) ctx.rotate(Math.PI / 2);
    ctx.drawImage(sfImg, -ts / 2, -ts * 0.275, ts, ts * 0.55);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,.9)";
    for (let i = 0; i < 8; i += 1) ctx.fillRect(sx + i * 32, sy + 92, 16, 72);
  }

  // --- Checkpoint lines ---
  betaTrack.checkpoints.forEach((cp, index) => {
    const playerPassed = betaState?.player ? index < betaState.player.checkpoint : false;
    const img = playerPassed ? betaTrackImages.checkpointActive : betaTrackImages.checkpointNeutral;
    const cpTile = betaTrack.grid[cp.y]?.[cp.x];
    const cpIsHoriz = betaTileIsHorizontal(cpTile);
    const cx = cp.x * ts;
    const cy = cp.y * ts;
    if (img?.complete && img.naturalWidth) {
      ctx.save();
      ctx.translate(cx + ts / 2, cy + ts / 2);
      // Same logic: horizontal road → rotate 90° so line crosses it perpendicularly
      if (cpIsHoriz) ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -ts / 2, -ts * 0.275, ts, ts * 0.55);
      ctx.restore();
    } else {
      ctx.strokeStyle = playerPassed ? "rgba(255,200,87,.86)" : "rgba(82,199,255,.56)";
      ctx.lineWidth = 6;
      ctx.strokeRect(cx + 36, cy + 36, ts - 72, ts - 72);
    }
  });
}

function drawBetaFrame() {
  if (!betaState || !el.betaCanvas) return;
  betaResizeCanvas();
  const ctx = el.betaCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaCanvas.width / ratio;
  const h = el.betaCanvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const worldW = betaTrack.width * betaTileSize;
  const worldH = betaTrack.height * betaTileSize;
  const camX = Math.max(0, Math.min(worldW - w, betaState.player.x - w / 2));
  const camY = Math.max(0, Math.min(worldH - h, betaState.player.y - h / 2));
  const startCol = Math.max(0, Math.floor(camX / betaTileSize) - 1);
  const endCol = Math.min(betaTrack.width - 1, Math.ceil((camX + w) / betaTileSize) + 1);
  const startRow = Math.max(0, Math.floor(camY / betaTileSize) - 1);
  const endRow = Math.min(betaTrack.height - 1, Math.ceil((camY + h) / betaTileSize) + 1);
  ctx.save();
  ctx.translate(-camX, -camY);
  for (let y = startRow; y <= endRow; y += 1) {
    for (let x = startCol; x <= endCol; x += 1) drawBetaTile(ctx, betaTrack.grid[y][x], x * betaTileSize, y * betaTileSize);
  }
  drawBetaMarkers(ctx);
  if (betaState.ghostPoint) drawBetaGhost(ctx);
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => drawBetaCar(ctx, racer));
  drawBetaCar(ctx, betaState.player);
  if (betaState.debug) drawBetaDebug(ctx);
  ctx.restore();
  drawBetaMiniMap();
  const placement = betaPlacements().findIndex((racer) => racer.id === "player") + 1;
  el.betaTime.textContent = betaState.elapsed.toFixed(2);
  el.betaLap.textContent = `${Math.min(betaState.player.lap, betaLapsRequired)} / ${betaLapsRequired}`;
  el.betaCheckpoint.textContent = `${Math.min(betaState.player.checkpoint, betaTrack.checkpoints.length)} / ${betaTrack.checkpoints.length}`;
  el.betaSpeed.textContent = `${Math.round(Math.abs(betaState.player.speed) / 5.2)} MPH`;
  const betaHudPosPanel = document.getElementById("beta-hud-pos-panel");
  if (betaHudPosPanel) betaHudPosPanel.hidden = betaState.config.id === "time";
  el.betaPosition.textContent = betaState.config.id === "time" ? "" : betaOrdinal(placement);
}

function drawBetaCar(ctx, racer = betaState.player) {
  ctx.save();
  ctx.translate(racer.x, racer.y);
  ctx.rotate(racer.angle + Math.PI / 2);
  if (racer.image?.complete && racer.image.naturalWidth) {
    ctx.drawImage(racer.image, -34, -48, 68, 96);
  } else {
    ctx.fillStyle = racer.color || "#ffc857";
    ctx.fillRect(-18, -34, 36, 68);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-12, -16, 24, 18);
  }
  ctx.restore();
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
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = 2;
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.72)";
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    ctx.strokeRect(x * betaTileSize, y * betaTileSize, betaTileSize, betaTileSize);
    ctx.fillText(betaTileClass(tile), x * betaTileSize + 12, y * betaTileSize + 26);
  }));
  betaState.racers.forEach((racer) => {
    ctx.strokeStyle = racer.id === "player" ? "#52c7ff" : "#ff8f5a";
    ctx.beginPath();
    ctx.arc(racer.x, racer.y, 32, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawBetaMiniMap() {
  if (!el.betaMinimap || !betaState) return;
  const ctx = el.betaMinimap.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaMinimap.width / ratio;
  const h = el.betaMinimap.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / betaTrack.width, h / betaTrack.height);
  const offsetX = (w - betaTrack.width * scale) / 2;
  const offsetY = (h - betaTrack.height * scale) / 2;
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    const cls = betaTileClass(tile);
    if (cls === "grass") return;
    ctx.fillStyle = cls === "wall" ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.88)";
    ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
  }));
  const dot = (x, y, color, radius = 4) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(offsetX + x / betaTileSize * scale, offsetY + y / betaTileSize * scale, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => dot(racer.x, racer.y, "#ff805f", 3.2));
  if (betaState.ghostPoint) dot(betaState.ghostPoint.x, betaState.ghostPoint.y, "rgba(104,232,255,.62)", 3.5);
  dot(betaState.player.x, betaState.player.y, "#52c7ff", 4.4);
}

el.betaOptions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-beta-mode]");
  if (!button) return;
  openBetaPreview(button.dataset.betaMode);
});

el.betaTrackList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-beta-track]");
  if (!button) return;
  selectBetaTrack(button.dataset.betaTrack);
});

el.betaTrackStart?.addEventListener("click", () => {
  startBetaDemo(betaPendingMode);
});

el.betaTrackBack?.addEventListener("click", () => {
  closeBetaTrackSelect();
});

el.betaPreviewBack?.addEventListener("click", () => {
  showBetaScreen("beta-intro");
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
  const points = betaTrack.path || [];
  const trackPoint = (fraction, offset = 0) => {
    const point = points[Math.max(0, Math.min(points.length - 1, Math.floor(points.length * fraction) + offset))] || betaTrack.startTile;
    return { x: point.x + 0.5, y: point.y + 0.5 };
  };
  const itemSpawns = [trackPoint(0.14), trackPoint(0.38), trackPoint(0.62), trackPoint(0.84)];
  const boostSpawns = [trackPoint(0.22), trackPoint(0.52), trackPoint(0.76)].map((point, index) => {
    const line = betaTrack.aiLine[Math.floor((betaTrack.aiLine.length - 1) * [0.22, 0.52, 0.76][index])] || betaTrack.aiLine[0];
    const next = betaTrack.aiLine[Math.min(betaTrack.aiLine.length - 1, Math.floor((betaTrack.aiLine.length - 1) * [0.22, 0.52, 0.76][index]) + 1)] || line;
    return { ...point, angle: Math.atan2(next.y - line.y, next.x - line.x) + Math.PI / 2 };
  });
  const obstacleSpawns = [trackPoint(0.3), trackPoint(0.7)].map((point, index) => ({ ...point, kind: index % 2 ? "barrel" : "cone" }));
  return {
    itemBoxes: config.itemsEnabled ? itemSpawns.map((point, index) => ({ id: `box-${index}`, ...betaWorldPoint(point), active: true, respawnAt: 0 })) : [],
    boostPads: config.boostPadsEnabled ? boostSpawns.map((point, index) => ({ id: `pad-${index}`, ...betaWorldPoint(point), angle: point.angle || 0 })) : [],
    obstacles: config.obstaclesEnabled ? obstacleSpawns.map((point, index) => ({ id: `hazard-${index}`, ...betaWorldPoint(point), kind: point.kind, lastHit: {} })) : [],
    traps: [],
    projectiles: []
  };
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
function betaExecuteTeleport(racer, now) {
  const placements = betaPlacements();
  const racerIdx = placements.findIndex((r) => r.id === racer.id);
  const total = placements.length;
  const PRE_DELAY = 1000;   // 1 s portal before teleport
  const POST_DELAY = 1000;  // 1 s portal after teleport

  if (racerIdx > 0) {
    // Not in 1st → jump one position forward
    const targetRacer = placements[racerIdx - 1];
    racer.teleportPortal = { startMs: now, phase: "pre", attachedTo: racer.id };
    window.setTimeout(() => {
      if (!betaState) return;
      // Place slightly behind the target
      const behind = betaBehindPoint(targetRacer, 80);
      racer.x = behind.x;
      racer.y = behind.y;
      racer.angle = targetRacer.angle;
      racer.speed = Math.min(racer.speed, targetRacer.speed);
      racer.teleportPortal = { startMs: betaNowMs(), phase: "post", attachedTo: racer.id };
      window.setTimeout(() => { if (racer.teleportPortal?.phase === "post") racer.teleportPortal = null; }, POST_DELAY);
    }, PRE_DELAY);
  } else {
    // In 1st → penalise 2nd place: send them to last (or 4th)
    const victim = placements[1];
    if (!victim) return;
    const destIdx = Math.min(total - 1, 3);     // 4th or last
    const destRacer = placements[destIdx] || placements[total - 1];
    victim.teleportPortal = { startMs: now, phase: "pre", attachedTo: victim.id };
    window.setTimeout(() => {
      if (!betaState) return;
      const behind = betaBehindPoint(destRacer, 90);
      victim.x = behind.x;
      victim.y = behind.y;
      victim.angle = destRacer.angle;
      victim.speed = Math.min(victim.speed, destRacer.speed * 0.7);
      victim.teleportPortal = { startMs: betaNowMs(), phase: "post", attachedTo: victim.id };
      window.setTimeout(() => { if (victim.teleportPortal?.phase === "post") victim.teleportPortal = null; }, POST_DELAY);
    }, PRE_DELAY);
    // Give player racer a brief boost reward for using it while leading
    racer.boostUntil = Math.max(racer.boostUntil || 0, now + 600);
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
      if (racer.finished || racer.item || betaDistance(racer, box) > 48) return;
      racer.item = betaRandomItemForRacer(racer);
      box.active = false;
      box.respawnAt = now + 5000 + Math.random() * 3000;
      if (racer.id === "player") betaNotify(`${racer.item.name} Ready!`);
    });
  });
}

function betaApplyBoostPads(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.boostPads.forEach((pad) => {
    betaState.racers.forEach((racer) => {
      if (racer.finished || racer.lastPadAt > now - 900 || betaDistance(racer, pad) > 54) return;
      const pwr = racer.physics.pwrMultiplier || 1.16;
      racer.boostUntil = Math.max(racer.boostUntil || 0, now + 820 * pwr);
      racer.speed = Math.min(racer.physics.maxSpeed * (1.08 + pwr * 0.1), racer.speed + 92 * pwr);
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

function betaMakeRacer({ id, name, carId, form, ratings, color, x, y, angle = 0, ai = false, skill = 1, ghost = false }) {
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
    offTrackSince: null,
    stuckSince: null,
    lastRecoveryX: x,
    lastRecoveryY: y,
    lastProgressScore: 0,
    lastProgressAt: 0,
    lastWaypointDistance: Infinity,
    respawnUntil: 0,
    image: betaMakeImage(imageFor(form, "topdown")),
    record: [],
    lastRecord: 0
  };
}

function betaAiControls(racer) {
  const line = betaAiRacingLine?.length ? betaAiRacingLine : betaTrack.aiLine;
  if (!line?.length) return { up: true, down: false, left: false, right: false };
  const nearestIndex = betaNearestAiLineIndex(racer, line);
  const currentWaypoint = Number.isFinite(racer.aiWaypoint) ? racer.aiWaypoint : nearestIndex;
  const currentTarget = line[currentWaypoint] || line[nearestIndex];
  const currentForward = currentTarget
    ? Math.cos(racer.angle) * (currentTarget.x - racer.x) + Math.sin(racer.angle) * (currentTarget.y - racer.y)
    : 0;
  const currentDistance = currentTarget ? Math.hypot(currentTarget.x - racer.x, currentTarget.y - racer.y) : 0;
  if (currentForward < -24 || currentDistance > betaTileSize * 1.35) {
    racer.aiWaypoint = (nearestIndex + 2) % line.length;
  }
  while (Math.hypot((line[racer.aiWaypoint || 0]?.x || racer.x) - racer.x, (line[racer.aiWaypoint || 0]?.y || racer.y) - racer.y) < 92) {
    racer.aiWaypoint = ((racer.aiWaypoint || 0) + 1) % line.length;
    if (racer.aiWaypoint === currentWaypoint) break;
  }
  const lookAhead = Math.max(1, Math.min(4, 1 + Math.floor(Math.abs(racer.speed || 0) / 120)));
  const nextTarget = line[((racer.aiWaypoint || 0) + lookAhead) % line.length] || line[0];
  const desired = Math.atan2(nextTarget.y - racer.y, nextTarget.x - racer.x);
  const delta = Math.atan2(Math.sin(desired - racer.angle), Math.cos(desired - racer.angle));
  const aheadX = racer.x + Math.cos(racer.angle) * 86;
  const aheadY = racer.y + Math.sin(racer.angle) * 86;
  const aheadWall = betaSurfaceAt(aheadX, aheadY) === "wall";
  const sharpTurn = Math.abs(delta) > 1.0;
  return {
    up: !aheadWall || Math.abs(racer.speed || 0) < 55,
    down: (aheadWall && racer.speed > 55) || (sharpTurn && racer.speed > racer.physics.maxSpeed * 0.58),
    left: delta < -0.065,
    right: delta > 0.065
  };
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
  const savedGhost = config.id === "time" ? state.betaTimeTrials?.[betaTrack.id]?.ghost || null : null;
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

function betaDriveRacer(racer, dt, controls = {}) {
  const now = betaNowMs();
  if (racer.respawnUntil && racer.respawnUntil > now) {
    racer.speed = 0;
    return;
  }
  if (racer.spinUntil > now) {
    racer.angle += dt * 5.2;
    racer.speed *= Math.max(0, 1 - dt * 1.8);
    controls = {};
  }
  const currentClass = betaSurfaceAt(racer.x, racer.y);
  const boosted = racer.boostUntil > now;
  const slowed = racer.slowUntil > now;
  const shielded = racer.shieldUntil > now;   // Big Bubba blocks grass penalty
  const effectiveClass = shielded ? "road" : currentClass;
  const grassFactor = effectiveClass === "grass" ? Math.min(0.48, 0.28 + racer.physics.torque / 520) : 1;
  let maxSpeed = racer.physics.maxSpeed * grassFactor;
  let accel = racer.physics.acceleration * (effectiveClass === "grass" ? 0.32 + racer.physics.torque / 480 : 1);
  if (boosted) {
    maxSpeed *= 1.22 + (racer.physics.powertrain || 70) / 620;
    accel *= 1.25;
  }
  if (slowed) {
    maxSpeed *= 0.58 + Math.min(0.18, (racer.physics.torque || 70) / 520);
    accel *= 0.74 + Math.min(0.16, (racer.ratings.acceleration || 70) / 600);
  }
  if (controls.up) racer.speed += accel * dt;
  if (controls.down) racer.speed -= racer.physics.brake * dt;
  if (!controls.up && !controls.down) racer.speed *= Math.max(0, 1 - (1.35 - racer.physics.torque / 180) * dt);
  racer.speed = Math.max(-maxSpeed * 0.34, Math.min(maxSpeed, racer.speed));
  const turnRate = racer.physics.turnRate * Math.min(1, Math.max(0.25, Math.abs(racer.speed) / 190));
  if (controls.left) racer.angle -= turnRate * dt * (racer.speed >= 0 ? 1 : -1);
  if (controls.right) racer.angle += turnRate * dt * (racer.speed >= 0 ? 1 : -1);
  const assistAngle = controls.up ? betaStraightAssistAngle(racer) : null;
  if (assistAngle !== null && Math.abs(racer.speed) > 24) {
    const correction = betaNormalizeAngle(assistAngle - racer.angle);
    const playerSteering = controls.left || controls.right;
    const assistStrength = playerSteering ? 1.55 : 3.2;
    racer.angle += correction * Math.min(1, assistStrength * dt);
  }
  racer.prevX = racer.x;
  racer.prevY = racer.y;
  racer.x += Math.cos(racer.angle) * racer.speed * dt;
  racer.y += Math.sin(racer.angle) * racer.speed * dt;
  const nextClass = betaSurfaceAt(racer.x, racer.y);
  if (nextClass === "wall") {
    // Wall collision: reverse both player and AI
    racer.x = racer.prevX;
    racer.y = racer.prevY;
    racer.speed *= -(0.08 + Math.max(0, 100 - racer.physics.body) * 0.002);
    if (racer.ai) {
      // Immediately re-aim toward next waypoint to escape the wall
      const target = betaAiRacingLine[racer.aiWaypoint || 0] || betaAiRacingLine[0];
      racer.angle = Math.atan2(target.y - racer.y, target.x - racer.x);
    }
  } else if (racer.ai && nextClass === "grass") {
    racer.speed *= 0.94;
    const line = betaAiRacingLine?.length ? betaAiRacingLine : betaTrack.aiLine;
    const nearest = betaNearestAiLineIndex(racer, line);
    const target = line[(nearest + 2) % line.length] || line[nearest] || { x: racer.prevX, y: racer.prevY };
    const desired = Math.atan2(target.y - racer.y, target.x - racer.x);
    racer.angle += betaNormalizeAngle(desired - racer.angle) * Math.min(1, 4.2 * dt);
    racer.aiWaypoint = (nearest + 2) % line.length;
  }
}

function updateBetaRace(now) {
  if (!betaState || betaState.finished) return;
  const dt = Math.min(0.035, (now - betaState.last) / 1000);
  betaState.last = now;
  betaState.elapsed = betaState.active ? (now - betaState.startTime) / 1000 : 0;
  betaDriveRacer(betaState.player, dt, {
    up: betaInput("up"),
    down: betaInput("down"),
    left: betaInput("left"),
    right: betaInput("right")
  });
  betaAiUseItems();
  betaState.racers.filter((racer) => racer.ai && !racer.finished).forEach((racer) => betaDriveRacer(racer, dt, betaAiControls(racer)));
  betaResolveCarCollisions();
  const itemNow = betaNowMs();
  betaCollectItemBoxes(itemNow);
  betaApplyBoostPads(itemNow);
  betaApplyObstacles(itemNow);
  betaUpdateTraps(itemNow);
  betaUpdateProjectiles(dt, itemNow);
  betaState.racers.filter((racer) => !racer.finished).forEach((racer) => betaUpdateOffTrackRecovery(racer, itemNow));
  betaState.racers.filter((racer) => !racer.finished).forEach(betaProgressRacer);
  betaRecordGhostSample(now);
  betaState.ghostPoint = betaGhostPointAt(betaState.elapsed);
  drawBetaFrame();
  betaState.raf = requestAnimationFrame(updateBetaRace);
}

function drawBetaFrame() {
  if (!betaState || !el.betaCanvas) return;
  betaResizeCanvas();
  const ctx = el.betaCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaCanvas.width / ratio;
  const h = el.betaCanvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const worldW = betaTrack.width * betaTileSize;
  const worldH = betaTrack.height * betaTileSize;
  const camX = Math.max(0, Math.min(worldW - w, betaState.player.x - w / 2));
  const camY = Math.max(0, Math.min(worldH - h, betaState.player.y - h / 2));
  const startCol = Math.max(0, Math.floor(camX / betaTileSize) - 1);
  const endCol = Math.min(betaTrack.width - 1, Math.ceil((camX + w) / betaTileSize) + 1);
  const startRow = Math.max(0, Math.floor(camY / betaTileSize) - 1);
  const endRow = Math.min(betaTrack.height - 1, Math.ceil((camY + h) / betaTileSize) + 1);
  ctx.save();
  ctx.translate(-camX, -camY);
  for (let y = startRow; y <= endRow; y += 1) {
    for (let x = startCol; x <= endCol; x += 1) drawBetaTile(ctx, betaTrack.grid[y][x], x * betaTileSize, y * betaTileSize);
  }
  drawBetaMarkers(ctx);
  betaDrawTrackObjects(ctx);
  if (betaState.ghostPoint) drawBetaGhost(ctx);
  // Draw status effects (flames, bubble) UNDER the car so car sits on top
  betaState.racers.forEach((racer) => betaDrawStatusEffects(ctx, racer));
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => drawBetaCar(ctx, racer));
  drawBetaCar(ctx, betaState.player);
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
  const betaHudPosPanel = document.getElementById("beta-hud-pos-panel");
  if (betaHudPosPanel) betaHudPosPanel.hidden = betaState.config.id === "time";
  el.betaPosition.textContent = betaState.config.id === "time" ? "" : betaOrdinal(placement);
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

function drawBetaCar(ctx, racer = betaState.player) {
  ctx.save();
  ctx.translate(racer.x, racer.y);
  ctx.rotate(racer.angle + Math.PI / 2);
  if (racer.spinUntil > betaNowMs()) ctx.rotate(Math.sin(betaState.elapsed * 16) * 0.12);
  if (racer.image?.complete && racer.image.naturalWidth) {
    ctx.drawImage(racer.image, -34, -48, 68, 96);
  } else {
    ctx.fillStyle = racer.color || "#ffc857";
    ctx.fillRect(-18, -34, 36, 68);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-12, -16, 24, 18);
  }
  ctx.restore();
}

function drawBetaMiniMap() {
  if (!el.betaMinimap || !betaState) return;
  const ctx = el.betaMinimap.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaMinimap.width / ratio;
  const h = el.betaMinimap.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / betaTrack.width, h / betaTrack.height);
  const offsetX = (w - betaTrack.width * scale) / 2;
  const offsetY = (h - betaTrack.height * scale) / 2;
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    const cls = betaTileClass(tile);
    if (cls === "grass") return;
    ctx.fillStyle = cls === "wall" ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.88)";
    ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
  }));
  if (betaState.config.boostPadsEnabled) {
    ctx.fillStyle = "rgba(82,199,255,.62)";
    betaState.objects.boostPads.forEach((pad) => ctx.fillRect(offsetX + pad.x / betaTileSize * scale - 1, offsetY + pad.y / betaTileSize * scale - 1, 3, 3));
  }
  const dot = (x, y, color, radius = 4) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(offsetX + x / betaTileSize * scale, offsetY + y / betaTileSize * scale, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => dot(racer.x, racer.y, "#ff805f", 3.2));
  if (betaState.ghostPoint) dot(betaState.ghostPoint.x, betaState.ghostPoint.y, "rgba(104,232,255,.62)", 3.5);
  dot(betaState.player.x, betaState.player.y, "#52c7ff", 4.4);
}

document.addEventListener("keydown", (event) => {
  if (!document.querySelector("#beta-view")?.classList.contains("active")) return;
  const key = normalizeKey(event);
  if ((key === "Space" || key === "E") && betaState?.active && !betaState.finished) {
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
    flashBetaItemButton();
    betaUseItem(betaState?.player);
  });
});

window.addEventListener("resize", updateRotationTipForActiveRace);
screen.orientation?.addEventListener?.("change", updateRotationTipForActiveRace);
