// ─── LAST GEAR: arena battle mode ───────────────────────────────────────────
// Moved out of game-race2d.js. Loads after game-race2d.js and game-beta3d.js,
// so every beta* helper and betaMakeImage are already defined.

const lastGearItemDefinitions = [
  { id: "shield", name: "Big Bubba", icon: "assets/items/item-big-bubba.png", weights: { low: 2, normal: 3, chaos: 4 } },
  { id: "teleport", name: "Teleport", icon: "assets/items/item-teleport.png", weights: { low: 2, normal: 2, chaos: 3 } },
  { id: "oil", name: "Oil Slick", icon: "assets/items/oil_slick.png", weights: { low: 3, normal: 3, chaos: 4 } },
  { id: "tire", name: "Spike Strip", icon: "assets/items/item-spike-strip.png", weights: { low: 2, normal: 3, chaos: 4 } },
  { id: "burst", name: "EMP Pulse", icon: "assets/items/item-emp-pulse.png", weights: { low: 1, normal: 3, chaos: 5 } },
  { id: "turbo", name: "Insano-Mode", icon: "assets/items/item-insano-mode.png", weights: { low: 2, normal: 3, chaos: 4 } },
  { id: "grapple", name: "Grappling Hook", icon: "assets/lastgear/lg-item-grapple.png", weights: { low: 1, normal: 2, chaos: 4 } },
  { id: "antiMagnet", name: "Anti-Magnet", icon: "assets/lastgear/lg-item-antimagnet.png", weights: { low: 1, normal: 2, chaos: 4 } },
  { id: "anchor", name: "Anchor", icon: "assets/lastgear/lg-item-anchor.png", weights: { low: 1, normal: 2, chaos: 3 } },
  { id: "reverse", name: "Reverse", icon: "assets/lastgear/lg-item-reverse.png", weights: { low: 0, normal: 1, chaos: 2 } },
  { id: "overhaul", name: "Overhaul", icon: "assets/lastgear/lg-item-overhaul.png", weights: { low: 0, normal: 1, chaos: 3 } }
];

const lastGearItemImages = {};
lastGearItemDefinitions.forEach((def) => {
  lastGearItemImages[def.id] = betaMakeImage(def.icon);
});

const lastGearImages = {
  platform: betaMakeImage("assets/lastgear/lg-platform.png"),
  arenaBg: betaMakeImage("assets/lastgear/lg-arena-bg.png"),
  itemBox: betaMakeImage("assets/lastgear/lg-item-box.png"),
  arenas: {
    circle: betaMakeImage("assets/lastgear/lg-arena-circle.png"),
    square: betaMakeImage("assets/lastgear/lg-arena-square.png"),
    donut: betaMakeImage("assets/lastgear/lg-arena-donut.png"),
    bridge: betaMakeImage("assets/lastgear/lg-arena-bridge.png")
  },
  impactSparks: betaMakeImage("assets/lastgear/lg-impact-sparks.png"),
  smokePuffs: betaMakeImage("assets/lastgear/lg-smoke-puffs.png"),
  speedLines: betaMakeImage("assets/lastgear/lg-speed-lines.png"),
  grappleTether: betaMakeImage("assets/lastgear/lg-grapple-tether.png"),
  grappleLatch: betaMakeImage("assets/lastgear/lg-grapple-latch.png"),
  empRing: betaMakeImage("assets/lastgear/lg-emp-ring.png"),
  antiMagnetField: betaMakeImage("assets/lastgear/lg-antimagnet-field.png"),
  anchorActive: betaMakeImage("assets/lastgear/lg-anchor-active.png"),
  reverseStatus: betaMakeImage("assets/lastgear/lg-reverse-status.png"),
  overhaulActive: betaMakeImage("assets/lastgear/lg-overhaul-active.png")
};

// ── Last Gear: isolated Beta Mode arena prototype ───────────────────────────
let lastGearState = null;
const lastGearKeys = {};
const LAST_GEAR_SPRITE_BODY_LENGTH = 58; // drawn car-body length in arena px (collision radius is 27)
const lastGearKeyMap = { W: "up", ArrowUp: "up", S: "down", ArrowDown: "down", A: "left", ArrowLeft: "left", D: "right", ArrowRight: "right", Shift: "charge" };
const lastGearArena = {
  width: 2400,
  height: 2400,
  cx: 1200,
  cy: 1200,
  radius: 900,
  viewWidth: 960,
  viewHeight: 620,
  zoom: 1,
  shape: "circle"
};
const lastGearCamera = {
  x: 1200,
  y: 1200,
  smoothing: 0.12
};
const lastGearSuddenDeath = {
  startMs: 180000,
  shrinkDurationMs: 90000,
  minRadius: 520
};
const lastGearAiArchetypes = ["Aggro", "Tank", "Coward", "Trickster", "Speedster", "Opportunist", "Defender"];
const lastGearFormats = {
  duel: { label: "Duel", blurb: "1v1", opponents: 1, teams: false, startEvent: "duelStart" },
  rally: { label: "Rally", blurb: "2v2", opponents: 3, teams: true, startEvent: "rallyStart" },
  chaos: { label: "Chaos", blurb: "8-car free-for-all", opponents: 7, teams: false, startEvent: "matchStart" }
};
let lastGearSetupConfig = {
  format: "chaos",
  lives: 3,
  opponents: 7,
  arena: "circle",
  suddenDeathSeconds: 180,
  items: "normal",
  aiDifficulty: "normal"
};
const lastGearItemCadence = {
  off: { boxes: 0, respawn: 999999, variance: 0 },
  low: { boxes: 3, respawn: 7000, variance: 3000 },
  normal: { boxes: 5, respawn: 4500, variance: 2500 },
  chaos: { boxes: 8, respawn: 2200, variance: 1200 }
};
const lastGearItemTuning = {
  bubbleDuration: 5000,
  bubbleImpulse: 1.35,
  bubbleKnockbackTaken: 0.22,
  teleportInvulnerable: 2000,
  oilDuration: 2000,
  oilTraction: 0.55,
  spikeDamage: 20,
  spikeRamJam: 3200,
  spikeHandling: 2400,
  grappleRange: 430,
  grappleLatchDuration: 2300,
  grappleDamage: 18,
  grappleForce: 560,
  empRange: 270,
  empDamage: 13,
  empForce: 330,
  antiMagnetDuration: 2800,
  antiMagnetRange: 300,
  antiMagnetForce: 520,
  anchorDuration: 4600,
  anchorSpeedMultiplier: 0.76,
  anchorKnockbackTaken: 0.25,
  reverseDuration: 2800,
  overhaulDuration: 5000,
  overhaulScale: 1.5,
  overhaulDamageTaken: 0.75,
  overhaulDamageDealt: 1.25
};
// Charge Ram tuning. Stat-shaped values interpolate between the two ends using
// lastGearStatT(stat): 60 or lower -> first value, 100 -> second value.
const lastGearRamTuning = {
  tapMs: 170,
  minDashCharge: 0.2,
  fillMs: [950, 600],
  perfectMs: [150, 270],
  overheatMs: [380, 800],
  recoverMs: [2800, 1700],
  dodgeImpulse: [360, 480],
  bodyHitFactor: [0.9, 1.15],
  dodgeRecoverMs: 1000,
  dodgeInvulnerableMs: 240,
  burnoutMs: 950,
  burnoutDamage: 6,
  chargeDrag: 0.9,
  chargeTurnBoost: 1.25,
  dashMsBase: 360,
  dashMsPerCharge: 240,
  dashSpeedBase: 0.95,
  dashSpeedPerCharge: 0.6,
  perfectSpeedBonus: 1.2,
  hitBase: 1.0,
  hitPerCharge: 0.15,
  perfectHitBonus: 0.3,
  dashTurnScale: 0.4,
  dashFriction: 0.997,
  dashSteerBlend: 0.25
};
const lastGearAiRamSkill = {
  chill: { perfect: 0.2, dodge: 0.08, greedy: 0.04 },
  normal: { perfect: 0.42, dodge: 0.22, greedy: 0.03 },
  aggro: { perfect: 0.65, dodge: 0.38, greedy: 0.02 }
};
const lastGearImpactTuning = {
  minor: 96,
  major: 150,
  legendary: 220,
  hitstopMin: 18,
  hitstopMax: 58,
  shakeDivisor: 10
};
const lastGearAnnouncerDurations = {
  default: 1900,
  major: 2700,
  quick: 1400
};
const lastGearAnnouncerPriorities = {
  matchStart: 3,
  bigHit: 2,
  tBone: 3,
  headOn: 3,
  firstGearOut: 4,
  gearOut: 3,
  lastLife: 4,
  finalTwo: 5,
  suddenDeath: 6,
  winner: 7,
  comeback: 4,
  edgeSave: 4,
  crowdChaos: 2,
  underdog: 3,
  koStreak: 5,
  perfectRam: 3,
  burnout: 2,
  swap: 2,
  duelStart: 3,
  rallyStart: 3
};
const lastGearAnnouncerLabels = {
  matchStart: "Match Start",
  bigHit: "Big Hit",
  tBone: "T-Bone",
  headOn: "Head-On",
  firstGearOut: "First Gear Out",
  gearOut: "Gear Out",
  lastLife: "Last Life",
  finalTwo: "Final Two",
  suddenDeath: "Sudden Death",
  winner: "Winner",
  comeback: "Comeback",
  edgeSave: "Edge Save",
  crowdChaos: "Crowd Chaos",
  underdog: "Underdog",
  koStreak: "KO Streak",
  perfectRam: "Perfect Ram",
  burnout: "Burnout",
  swap: "Tag Out",
  duelStart: "Duel",
  rallyStart: "Rally"
};
const lastGearAnnouncerLines = {
  matchStart: ["We got ourselves a HOT race tonight, BABY!", "Eight GearBorn enter. One leaves rolling!", "Welcome to LAST GEAR!"],
  bigHit: ["DIOS MIO! Did you SEE that hit?!", "Somebody felt THAT one!", "That was FAST. VIOLENT. BEAUTIFUL."],
  tBone: ["SIDE IMPACT!", "That was CLEAN. TOO clean!", "OOOOHHHH they got DESTROYED!"],
  headOn: ["Neither GearBorn backed down!", "FULL FRONTAL COLLISION!", "That was PURE chaos, baby!"],
  firstGearOut: ["And our first GearBorn is OUTTA HERE!", "One down - seven remain!", "Off the edge! OFF THE EDGE!"],
  gearOut: ["GEAR OUT!", "Off the platform and OUTTA HERE!", "The arena claims another victim!"],
  lastLife: ["No room for mistakes now!", "One life left, baby!", "This just got dangerous!"],
  finalTwo: ["This is what Last Gear is ALL about, baby.", "One mistake decides EVERYTHING!", "You can FEEL this arena holding its breath!"],
  suddenDeath: ["The arena is COLLAPSING!", "NOWHERE LEFT TO HIDE!", "This is absolute madness!"],
  winner: ["THAT'S YOUR CHAMPION!", "Only ONE GearBorn survives!", "WHAT. A. PERFORMANCE."],
  comeback: ["HOW are they still alive?!", "That GearBorn REFUSES to quit!", "One life left and still fighting!"],
  edgeSave: ["DIOS MIO! I thought they were GONE!", "They SAVED IT!", "That was impossible!"],
  crowdChaos: ["YOU HEAR THIS CROWD?!", "This arena is TURNING INTO CHAOS!", "NOBODY'S BACKING DOWN!"],
  underdog: ["You can't measure courage with stats, baby!", "Everybody counted them out!", "Smaller GearBorn. Bigger heart!"],
  koStreak: ["They are TAKING OVER this arena!", "Somebody stop this machine!", "That GearBorn came here with a mission!"],
  perfectRam: ["PERFECT RAM! Right on the money!", "TIMED. TO. PERFECTION.", "That release was SURGICAL, baby!"],
  burnout: ["Too much! They COOKED the engine!", "BURNOUT! Smoke everywhere!", "Somebody held it too long!"],
  swap: ["TAG OUT! Fresh wheels coming in!", "Swap on the pad! That's smart racing!", "New car, same attitude!"],
  duelStart: ["One on one. No excuses, BABY!", "Two GearBorn. One platform. Let's GO!", "It's a DUEL tonight!"],
  rallyStart: ["Two on two! Watch your partner's back!", "Team up and TEAR IT UP!", "RALLY time, baby! Partners ready?"],
  teamWinner: ["THAT'S A TEAM VICTORY!", "Partners to the END, baby!", "Two cars, ONE heartbeat!"]
};
const lastGearComboCalls = ["OOOOHHHH! DIOS MIO!", "Off the edge! OFF THE EDGE!", "They got clipped THEY GOT CLIPPED!"];

function lastGearClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lastGearLerp(a, b, t) {
  return a + (b - a) * lastGearClamp(t, 0, 1);
}

function lastGearLocalNow() {
  return performance.now() - (lastGearState?.startedAt || performance.now());
}

function lastGearCurrentSettings() {
  return lastGearState?.settings || lastGearSetupConfig;
}

function lastGearActiveRadius(now = lastGearLocalNow()) {
  if (!lastGearState?.suddenDeath) return lastGearArena.radius;
  const progress = (now - (lastGearState.suddenDeathStartedAt || now)) / lastGearSuddenDeath.shrinkDurationMs;
  return lastGearLerp(lastGearArena.radius, lastGearSuddenDeath.minRadius, progress);
}

function lastGearShapeScale(now = lastGearLocalNow()) {
  return lastGearActiveRadius(now) / lastGearArena.radius;
}

function lastGearShape() {
  return lastGearCurrentSettings().arena || lastGearArena.shape || "circle";
}

function lastGearShapeBoundary(x, y, now = lastGearLocalNow()) {
  const sdfBoundary = lastGearSdfBoundary(x, y, now);
  if (sdfBoundary) return sdfBoundary;
  const shape = lastGearShape();
  const radius = lastGearActiveRadius(now);
  const dx = x - lastGearArena.cx;
  const dy = y - lastGearArena.cy;
  const dist = Math.hypot(dx, dy) || 1;
  if (shape === "square") {
    const half = radius * 0.82;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    const edge = Math.max(ax, ay) / half;
    const nx = ax >= ay ? Math.sign(dx || 1) : 0;
    const ny = ay > ax ? Math.sign(dy || 1) : 0;
    return { safe: ax <= half && ay <= half, edge, nx, ny, radius };
  }
  if (shape === "donut") {
    const outer = radius * 0.985;
    const inner = radius * 0.18;
    const outerEdge = dist / outer;
    const innerEdge = inner / dist;
    const unsafeHole = dist < inner;
    return { safe: dist <= outer && !unsafeHole, edge: Math.max(outerEdge, innerEdge), nx: dx / dist * (unsafeHole ? -1 : 1), ny: dy / dist * (unsafeHole ? -1 : 1), radius: outer, inner };
  }
  if (shape === "bridge") {
    const halfLength = radius * 0.86;
    const halfWidth = radius * 0.24;
    const closestX = lastGearClamp(dx, -halfLength, halfLength);
    const closestDistX = dx - closestX;
    const capDist = Math.hypot(closestDistX, dy) || 1;
    const corridorDist = Math.abs(dy);
    const onStraight = Math.abs(dx) <= halfLength;
    const edge = onStraight ? corridorDist / halfWidth : capDist / halfWidth;
    const nx = onStraight ? 0 : closestDistX / capDist;
    const ny = onStraight ? Math.sign(dy || 1) : dy / capDist;
    return { safe: edge <= 1, edge, nx, ny, radius, halfLength, halfWidth };
  }
  return { safe: dist <= radius, edge: dist / radius, nx: dx / dist, ny: dy / dist, radius };
}

function lastGearEdgeIntensity(now = lastGearLocalNow()) {
  if (!lastGearState) return 0;
  let intensity = lastGearState.suddenDeath ? 0.28 : 0;
  lastGearLiveCars().forEach((car) => {
    const boundary = lastGearShapeBoundary(car.x, car.y, now);
    const edge = lastGearClamp((boundary.edge - 0.7) / 0.3, 0, 1);
    intensity = Math.max(intensity, edge * (car.player ? 1 : 0.55));
  });
  return lastGearClamp(intensity, 0, 1);
}

function lastGearPlaySound(key) {
  if (typeof playSound === "function") playSound(key);
}

function lastGearLiveCars() {
  return lastGearState?.cars.filter((car) => car.lives > 0 && !car.eliminated) || [];
}

function lastGearUpdateCamera() {
  const player = lastGearPlayer();
  if (!player) return;
  const focus = player.eliminated ? (lastGearLiveCars().find((car) => car.team && car.team === player.team) || player) : player;
  lastGearCamera.x += (focus.x - lastGearCamera.x) * lastGearCamera.smoothing;
  lastGearCamera.y += (focus.y - lastGearCamera.y) * lastGearCamera.smoothing;
}

function lastGearDistanceFromCenter(car) {
  return Math.hypot(car.x - lastGearArena.cx, car.y - lastGearArena.cy);
}

function lastGearSafePoint(index = Math.random() * 8) {
  const sdfSpawn = lastGearSdfSafePoint(index);
  if (sdfSpawn) return sdfSpawn;
  const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2;
  const shape = lastGearShape();
  const radius = lastGearActiveRadius() * 0.58;
  if (shape === "square") {
    const half = lastGearActiveRadius() * 0.5;
    const x = lastGearArena.cx + Math.cos(angle) * half;
    const y = lastGearArena.cy + Math.sin(angle) * half;
    return { x, y, angle: Math.atan2(lastGearArena.cy - y, lastGearArena.cx - x) };
  }
  if (shape === "bridge") {
    const lane = (index % 2 ? -1 : 1) * lastGearActiveRadius() * 0.11;
    const x = lastGearArena.cx + Math.cos(angle) * lastGearActiveRadius() * 0.52;
    const y = lastGearArena.cy + lane;
    return { x, y, angle: Math.atan2(lastGearArena.cy - y, lastGearArena.cx - x) };
  }
  if (shape === "donut") {
    const donutRadius = lastGearActiveRadius() * 0.62;
    const x = lastGearArena.cx + Math.cos(angle) * donutRadius;
    const y = lastGearArena.cy + Math.sin(angle) * donutRadius;
    return { x, y, angle: Math.atan2(lastGearArena.cy - y, lastGearArena.cx - x) };
  }
  const x = lastGearArena.cx + Math.cos(angle) * radius;
  const y = lastGearArena.cy + Math.sin(angle) * radius;
  return { x, y, angle: Math.atan2(lastGearArena.cy - y, lastGearArena.cx - x) };
}

function lastGearRatingsFor(carId, player = false) {
  const level = state.garage?.[carId]?.level || 1;
  const evolution = state.garage?.[carId]?.evolution || 0;
  return betaRatingsForCar(carId, level, evolution, player);
}

function lastGearPhysics(ratings) {
  return {
    maxSpeed: 230 + (ratings.speed || 70) * 2.15,
    acceleration: 210 + (ratings.acceleration || 70) * 3.5,
    brake: 390 + (ratings.torque || 70) * 1.6,
    turnRate: 2.25 + (ratings.handling || 70) / 34,
    mass: 0.84 + (ratings.body || 70) / 145,
    body: ratings.body || 70,
    ramFillMs: lastGearLerp(...lastGearRamTuning.fillMs, lastGearStatT(ratings.acceleration)),
    ramPerfectMs: lastGearLerp(...lastGearRamTuning.perfectMs, lastGearStatT(ratings.handling)),
    ramOverheatMs: lastGearLerp(...lastGearRamTuning.overheatMs, lastGearStatT(ratings.powertrain)),
    ramRecoverMs: lastGearLerp(...lastGearRamTuning.recoverMs, lastGearStatT(ratings.torque)),
    ramDodgeImpulse: lastGearLerp(...lastGearRamTuning.dodgeImpulse, lastGearStatT(ratings.handling)),
    ramBodyFactor: lastGearLerp(...lastGearRamTuning.bodyHitFactor, lastGearStatT(ratings.body))
  };
}

function lastGearSpecialFor(car) {
  return lastGearLineSpecials[car?.specialLineId] || lastGearTypeSpecials[lastGearTypeFor(car?.carId)] || lastGearTypeSpecials.Neutral;
}

function lastGearCarImagePath(carId) {
  const form = currentEvolution(carId);
  return imageFor(form, "topdown");
}

function lastGearBuildRoster() {
  const playerCarId = isSelectablePlayerCar(state.lastGearSelectedCar) ? state.lastGearSelectedCar : (state.selectedCar || cars[0].id);
  const playerForm = currentEvolution(playerCarId);
  const playerTopdown = lastGearCarImagePath(playerCarId) || imageFor(playerForm, "display");
  const excluded = new Set(["rainbowlt", "hornula1", playerCarId]);
  const opponentCount = lastGearClamp(Number(lastGearCurrentSettings().opponents || 7), 1, 7);
  const candidates = cars
    .filter((car) => !excluded.has(car.id))
    .map((car) => {
      const evolutionIndex = state.garage?.[car.id]?.evolution || 0;
      const form = car.evolutions?.[evolutionIndex] || car.evolutions?.[0];
      const topdown = imageFor(form, "topdown");
      return topdown ? { car, form, topdown } : null;
    })
    .filter(Boolean)
    .sort(() => Math.random() - 0.5)
    .slice(0, opponentCount);
  return [{ car: cars.find((car) => car.id === playerCarId) || cars[0], form: playerForm, topdown: playerTopdown, player: true }].concat(candidates);
}

function lastGearMakeCar(entry, index, total) {
  const point = lastGearSafePoint(index);
  const ratings = lastGearRatingsFor(entry.car.id, Boolean(entry.player));
  const physics = lastGearPhysics(ratings);
  return {
    id: entry.player ? "player" : `lg-ai-${index}`,
    carId: entry.car.id,
    name: entry.form.name,
    color: entry.car.color || (entry.player ? "#52c7ff" : "#ff805f"),
    image: betaMakeImage(entry.topdown, { measure: true }),
    displayImage: imageFor(entry.form, "display") || entry.topdown,
    ratings,
    physics,
    player: Boolean(entry.player),
    ai: !entry.player,
    archetype: entry.player ? "Player" : lastGearAiArchetypes[(index - 1 + lastGearAiArchetypes.length) % lastGearAiArchetypes.length],
    x: point.x,
    y: point.y,
    prevX: point.x,
    prevY: point.y,
    vx: Math.cos(point.angle) * 4,
    vy: Math.sin(point.angle) * 4,
    angle: point.angle,
    radius: 27,
    lives: 3,
    damage: 0,
    item: null,
    ram: lastGearMakeRamState(),
    specialCooldownUntil: 0,
    specialLineId: evolutionLineRootForCar(entry.car.id),
    invulnerableUntil: 1800,
    shieldHits: 0,
    bubbleUntil: 0,
    bubbleFlashUntil: 0,
    anchorUntil: 0,
    antiMagnetUntil: 0,
    overhaulUntil: 0,
    reverseUntil: 0,
    oilSlideUntil: 0,
    ramJammedUntil: 0,
    handlingWeakUntil: 0,
    grapple: null,
    boostUntil: 0,
    hitFlashUntil: 0,
    eliminated: false,
    respawnAt: 0,
    aiTargetId: null
  };
}

function openLastGearCarSelect() {
  state.lastGearSelectedCar = isSelectablePlayerCar(state.lastGearSelectedCar) ? state.lastGearSelectedCar : selectedCarIdForMode("beta");
  openCarPicker("lastgear");
}

function readLastGearSetupConfig() {
  const suddenSeconds = Number(el.lastGearSetupSudden?.value ?? 180);
  lastGearSetupConfig = {
    lives: Number(el.lastGearSetupLives?.value || 3),
    format: lastGearFormats[document.getElementById("last-gear-setup-format")?.value] ? document.getElementById("last-gear-setup-format").value : "chaos",
    opponents: (lastGearFormats[document.getElementById("last-gear-setup-format")?.value] || lastGearFormats.chaos).opponents,
    ...lastGearCityArenaSettings(el.lastGearSetupArena?.value),
    suddenDeathSeconds: Number.isFinite(suddenSeconds) && suddenSeconds > 0 ? suddenSeconds : 0,
    items: el.lastGearSetupItems?.value || "normal",
    aiDifficulty: el.lastGearSetupAi?.value || "normal"
  };
  lastGearArena.shape = lastGearSetupConfig.arena;
  return lastGearSetupConfig;
}

function toggleLastGearSetupPanel(show = true) {
  if (betaRaceContext?.source !== "prototype") return;
  if (!el.lastGearSetupPanel) {
    openLastGearCarSelect();
    return;
  }
  el.lastGearSetupPanel.hidden = !show;
}

function startLastGearBeta() {
  if (!el.lastGearCanvas) return;
  const evoCarId = typeof lastGearEvoPendingCarId !== "undefined" ? lastGearEvoPendingCarId : null;
  if (evoCarId) lastGearEvoPendingCarId = null;
  const settings = evoCarId ? lastGearEvoSettings() : { ...readLastGearSetupConfig() };
  stopBetaDemo(false);
  if (typeof viewIsActive === "function" && !viewIsActive("last-gear")) showView("last-gear");
  if (el.lastGearBeta) el.lastGearBeta.hidden = false;
  const crewSelectScreen = document.getElementById("last-gear-crew-select");
  if (crewSelectScreen) crewSelectScreen.hidden = true;
  const evoPickScreen = document.getElementById("evo-rush-pick");
  if (evoPickScreen) evoPickScreen.hidden = true;
  const evoHud = document.getElementById("last-gear-evo-hud");
  if (evoHud) evoHud.hidden = !evoCarId;
  if (el.lastGearResults) el.lastGearResults.hidden = true;
  const roster = evoCarId ? lastGearBuildEvoRoster(evoCarId) : lastGearBuildRoster();
  const cars = roster.map((entry, index) => lastGearMakeCar(entry, index, roster.length));
  cars.forEach((car) => {
    if (!car.image) return;
    if (car.image.complete && car.image.naturalWidth) gearbornSpriteMetrics(car.image);
    else car.image.addEventListener("load", () => gearbornSpriteMetrics(car.image), { once: true });
  });
  const countdownUntil = performance.now() + 3000;
  lastGearState = {
    active: true,
    finished: false,
    countdownUntil,
    startedAt: countdownUntil,
    settings,
    cars,
    itemBoxes: lastGearInitialItemBoxes(),
    hazards: [],
    projectiles: [],
    effects: [],
    ringFlashes: [],
    shake: 0,
    hitPauseUntil: 0,
    suddenDeath: false,
    suddenDeathStartedAt: 0,
    firstEliminationCalled: false,
    finalTwoCalled: false,
    playerLastLifeCalled: false,
    announcer: null,
    announcerLastAt: {},
    announcerLastLine: {},
    crowdIntensity: 0,
    stats: {
      playerKOs: 0,
      playerRingOuts: 0,
      biggestHit: 0,
      damageDealt: 0,
      ramHits: 0,
      perfectRams: 0,
      swaps: 0,
      itemUses: {},
      startedAt: countdownUntil,
      finishTime: 0
    },
    debug: false,
    last: performance.now(),
    raf: null,
    statusRenderAt: 0,
    itemSpawnAt: 2500
  };
  if (evoCarId) lastGearEvoInit(cars);
  else lastGearAttachCrews(cars, lastGearClamp(Number(settings.lives || 3), 1, 5));
  lastGearApplyFormat(cars);
  lastGearState.itemBoxes = lastGearInitialItemBoxes();
  lastGearCamera.x = lastGearArena.cx;
  lastGearCamera.y = lastGearArena.cy;
  Object.keys(lastGearKeys).forEach((key) => delete lastGearKeys[key]);
  resizeLastGearBeta();
  updateLastGearTouchVisuals();
  updateLastGearHud(true);
  lastGearAnnounce(evoCarId ? "evoStart" : (lastGearFormat().startEvent || "matchStart"), { force: true, major: true });
  lastGearState.raf = requestAnimationFrame(updateLastGearBeta);
}

function stopLastGearBeta(showIntro = true) {
  if (lastGearState?.raf) cancelAnimationFrame(lastGearState.raf);
  lastGearState = null;
  Object.keys(lastGearKeys).forEach((key) => delete lastGearKeys[key]);
  if (typeof lastGearReleaseStick === "function") lastGearReleaseStick();
  updateLastGearTouchVisuals();
  lastGearRenderAnnouncer(0);
  if (el.lastGearBeta) el.lastGearBeta.hidden = true;
  if (showIntro) {
    showView("beta");
    if (typeof openBetaPrototypeIntro === "function") openBetaPrototypeIntro();
  }
}

function resizeLastGearBeta() {
  if (!el.lastGearCanvas) return;
  const ratio = window.devicePixelRatio || 1;
  const rect = el.lastGearCanvas.getBoundingClientRect();
  el.lastGearCanvas.width = Math.max(1, Math.round(rect.width * ratio));
  el.lastGearCanvas.height = Math.max(1, Math.round(rect.height * ratio));
  drawLastGearFrame();
}

function lastGearInitialItemBoxes() {
  const cadence = lastGearItemCadence[lastGearCurrentSettings().items] || lastGearItemCadence.normal;
  return Array.from({ length: cadence.boxes }, (_, index) => lastGearSpawnBox(index)).concat(lastGearPlacedPickupSlots().map(lastGearMakePlacedPickup));
}

function lastGearSpawnBox(index = 0) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const angle = (Math.PI * 2 * (index + Math.random() * 0.35 + attempt * 0.17)) / Math.max(5, (lastGearItemCadence[lastGearCurrentSettings().items] || lastGearItemCadence.normal).boxes || 5);
    const radius = lastGearActiveRadius() * (0.24 + Math.random() * 0.46);
    const x = lastGearArena.cx + Math.cos(angle) * radius;
    const y = lastGearArena.cy + Math.sin(angle) * radius;
    if (!lastGearShapeBoundary(x, y).safe) continue;
    return { id: `lg-box-${Date.now()}-${index}-${Math.random()}`, x, y, active: true, respawnAt: 0 };
  }
  const point = lastGearSafePoint(index);
  return { id: `lg-box-${Date.now()}-${index}-${Math.random()}`, x: point.x, y: point.y, active: true, respawnAt: 0 };
}

function lastGearPlayer() {
  return lastGearState?.cars.find((car) => car.player);
}

function lastGearInput(direction) {
  return Boolean(lastGearKeys[direction]);
}

function lastGearControlsFor(car) {
  const now = lastGearLocalNow();
  let controls;
  if (car.player) {
    controls = lastGearPlayerControls(car);
  } else {
    controls = lastGearAiControls(car);
  }
  if (car.reverseUntil > now) {
    controls = {
      up: controls.down,
      down: controls.up || Math.random() < 0.02,
      left: controls.right || Math.random() < 0.08,
      right: controls.left || Math.random() < 0.08,
      steer: Number.isFinite(controls.steer) ? -controls.steer : undefined,
      charge: false
    };
  }
  return controls;
}

function lastGearNearestOpponent(car) {
  let best = null;
  let bestDistance = Infinity;
  lastGearLiveCars().forEach((target) => {
    if (!lastGearAreFoes(car, target) || target.respawnAt) return;
    const distance = Math.hypot(target.x - car.x, target.y - car.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = target;
    }
  });
  return best;
}

function lastGearMostDamagedOpponent(car) {
  return lastGearLiveCars()
    .filter((target) => lastGearAreFoes(car, target) && !target.respawnAt)
    .sort((a, b) => b.damage - a.damage)[0] || null;
}

function lastGearNearestItemBox(car) {
  if (!lastGearState) return null;
  let best = null;
  let bestDistance = Infinity;
  lastGearState.itemBoxes.forEach((box) => {
    if (!box.active) return;
    const distance = Math.hypot(box.x - car.x, box.y - car.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = box;
    }
  });
  return best;
}

function lastGearChooseLine(lines = []) {
  return lines[Math.floor(Math.random() * lines.length)] || "";
}

function lastGearAnnounce(eventKey, options = {}) {
  if (!lastGearState) return;
  lastGearCrowdOnEvent(eventKey);
  const now = lastGearLocalNow();
  const priority = lastGearAnnouncerPriorities[eventKey] || 1;
  const currentPriority = lastGearState.announcer?.priority || 0;
  const lastAt = lastGearState.announcerLastAt[eventKey] || -Infinity;
  const randomDelay = 0.85 + Math.random() * 0.35;
  if (!options.force && now - lastAt < (options.cooldown || 2400) * randomDelay) return;
  if (!options.force && lastGearState.announcer?.until > now && priority < currentPriority) return;
  let pool = lastGearAnnouncerLines[eventKey] || [];
  const previousLine = lastGearState.announcerLastLine?.[eventKey];
  if (pool.length > 1) pool = pool.filter((line) => line !== previousLine);
  let line = options.line || lastGearChooseLine(pool);
  if (!options.line && priority >= 5 && Math.random() < 0.22) line = lastGearChooseLine(lastGearComboCalls);
  lastGearState.announcer = {
    eventKey,
    label: options.label || lastGearAnnouncerLabels[eventKey] || "Last Gear",
    line,
    priority,
    major: Boolean(options.major || priority >= 4),
    legendary: Boolean(options.legendary || priority >= 5),
    until: now + (options.duration || (priority >= 4 ? lastGearAnnouncerDurations.major : lastGearAnnouncerDurations.default)) + Math.random() * 260
  };
  lastGearState.announcerLastAt[eventKey] = now;
  lastGearState.announcerLastLine[eventKey] = line;
  lastGearState.crowdIntensity = lastGearClamp((lastGearState.crowdIntensity || 0) + priority * 0.08, 0, 1);
  if (priority >= 4) lastGearState.shake = Math.max(lastGearState.shake || 0, 5);
  lastGearRenderAnnouncer(now);
}

function lastGearRenderAnnouncer(now = lastGearLocalNow()) {
  if (!el.lastGearAnnouncer) return;
  const call = lastGearState?.announcer;
  const active = Boolean(call && call.until > now);
  el.lastGearAnnouncer.hidden = !active;
  el.lastGearAnnouncer.classList.toggle("major", Boolean(active && call.major));
  el.lastGearAnnouncer.classList.toggle("legendary", Boolean(active && call.legendary));
  if (!active) return;
  if (el.lastGearAnnouncerEvent) el.lastGearAnnouncerEvent.textContent = call.label;
  if (el.lastGearAnnouncerLine) el.lastGearAnnouncerLine.textContent = call.line;
}

function lastGearSpawnParticle(kind, x, y, angle, speed, ttl, size, tint = "#ffc857") {
  if (!lastGearState) return;
  lastGearState.effects.push({
    kind,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    angle,
    ttl,
    life: ttl,
    size,
    tint,
    spin: (Math.random() - 0.5) * 5
  });
}

function lastGearSpawnImpactFx(x, y, nx, ny, impact, type = "hit") {
  const angle = Math.atan2(ny, nx);
  const sparkCount = impact > lastGearImpactTuning.legendary ? 22 : impact > lastGearImpactTuning.major ? 14 : 7;
  for (let i = 0; i < sparkCount; i += 1) {
    lastGearSpawnParticle("spark", x, y, angle + (Math.random() - 0.5) * 1.6, 180 + Math.random() * 260, 260 + Math.random() * 220, 18 + Math.random() * 18, type === "tbone" ? "#52c7ff" : "#ffc857");
  }
  for (let i = 0; i < (impact > lastGearImpactTuning.major ? 9 : 5); i += 1) {
    lastGearSpawnParticle("smoke", x, y, angle + Math.PI + (Math.random() - 0.5) * 1.1, 40 + Math.random() * 110, 460 + Math.random() * 320, 34 + Math.random() * 26, "#d6d0c4");
  }
  if (impact > lastGearImpactTuning.major) {
    for (let i = 0; i < (impact > lastGearImpactTuning.legendary ? 6 : 3); i += 1) {
      lastGearSpawnParticle("streak", x - nx * 18, y - ny * 18, angle + Math.PI + (Math.random() - 0.5) * 0.24, 70 + Math.random() * 90, 280 + Math.random() * 180, 95 + Math.random() * 35, "#52c7ff");
    }
  }
}

function lastGearTriggerImpactFeedback(impact, x, y, nx, ny, type = "hit", options = {}) {
  if (!lastGearState) return;
  const userInvolved = Boolean(options.userInvolved || options.forceVisual);
  if (!userInvolved) return;
  lastGearSpawnImpactFx(x, y, nx, ny, impact, type);
  if (impact > lastGearImpactTuning.minor) {
    lastGearState.shake = Math.max(lastGearState.shake || 0, lastGearClamp(impact / lastGearImpactTuning.shakeDivisor, 5, 30));
    lastGearPlaySound(type === "headOn" ? "battle-stun" : "battle-hit");
  }
  if (type !== "ringout" && impact > lastGearImpactTuning.major) {
    lastGearState.hitPauseUntil = Math.max(lastGearState.hitPauseUntil || 0, lastGearLocalNow() + lastGearClamp(impact * 0.36, lastGearImpactTuning.hitstopMin, lastGearImpactTuning.hitstopMax));
    const word = type === "headOn" ? "HEAD-ON" : type === "tbone" ? "T-BONE" : impact > lastGearImpactTuning.legendary ? "OOOHHHH!" : "BIG HIT";
    lastGearState.effects.push({ kind: "impactWord", x, y: y - 82, vx: 0, vy: -28, ttl: 780, life: 780, text: word, size: impact > lastGearImpactTuning.legendary ? 44 : 32, tint: type === "tbone" ? "#52c7ff" : "#ffc857", angle: 0, spin: 0 });
  } else if (type === "ringout") {
    lastGearState.effects.push({ kind: "impactWord", x, y: y - 82, vx: 0, vy: -28, ttl: 720, life: 720, text: "CRASH!", size: 32, tint: "#ff805f", angle: 0, spin: 0 });
  }
  if (type === "headOn" && impact > 145) lastGearAnnounce("headOn", { major: true, cooldown: 3200 });
  else if (type === "tbone" && impact > 138) lastGearAnnounce("tBone", { major: true, cooldown: 3000 });
  else if (impact > 160) lastGearAnnounce("bigHit", { cooldown: 2200 });
  if (impact > lastGearImpactTuning.legendary && Math.random() < 0.5) lastGearAnnounce("crowdChaos", { cooldown: 3400 });
}

function lastGearAiControls(car) {
  const activeRadius = lastGearActiveRadius();
  const edgeDistance = lastGearDistanceFromCenter(car);
  const liveCount = lastGearLiveCars().length;
  const nearEdge = edgeDistance > activeRadius * (car.archetype === "Defender" ? 0.68 : 0.76);
  let target = lastGearNearestOpponent(car) || { x: lastGearArena.cx, y: lastGearArena.cy };
  if (nearEdge) {
    target = { x: lastGearArena.cx, y: lastGearArena.cy };
  } else if (car.archetype === "Tank" && edgeDistance > activeRadius * 0.35) {
    target = { x: lastGearArena.cx, y: lastGearArena.cy };
  } else if (car.archetype === "Coward" && liveCount > 4) {
    const threat = lastGearNearestOpponent(car);
    target = threat ? { x: car.x + (car.x - threat.x), y: car.y + (car.y - threat.y) } : { x: lastGearArena.cx, y: lastGearArena.cy };
  } else if (car.archetype === "Trickster" && !car.item) {
    target = lastGearNearestItemBox(car) || target;
  } else if (car.archetype === "Opportunist") {
    target = lastGearMostDamagedOpponent(car) || target;
  }
  const swapPad = nearEdge ? null : lastGearAiSwapTarget(car);
  if (swapPad) target = swapPad;
  const desired = Math.atan2(target.y - car.y, target.x - car.x);
  const delta = betaNormalizeAngle(desired - car.angle);
  const speed = Math.hypot(car.vx, car.vy);
  const aggression = (lastGearState?.suddenDeath ? 1.65 : 1) * (liveCount <= 2 ? 1.35 : 1);
  const difficultyAggression = lastGearCurrentSettings().aiDifficulty === "aggro" ? 1.45 : lastGearCurrentSettings().aiDifficulty === "chill" ? 0.72 : 1;
  const itemChance = car.archetype === "Trickster" ? 0.036 : 0.018;
  if (car.item) {
    const surrounded = lastGearLiveCars().some((target) => lastGearAreFoes(car, target) && Math.hypot(target.x - car.x, target.y - car.y) < 160);
    const targetNearEdge = target?.id && lastGearShapeBoundary(target.x, target.y).edge > 0.78;
    const shouldUse =
      (car.item.id === "teleport" && nearEdge) ||
      ((car.item.id === "shield" || car.item.id === "anchor") && (nearEdge || surrounded)) ||
      (car.item.id === "overhaul" && surrounded) ||
      (car.item.id === "antiMagnet" && surrounded) ||
      (car.item.id === "grapple" && targetNearEdge) ||
      (car.item.id === "reverse" && Math.random() < 0.006 * (lastGearCurrentSettings().items === "chaos" ? 2 : 1)) ||
      (!nearEdge && Math.random() < itemChance * aggression * difficultyAggression);
    if (shouldUse) lastGearUseItem(car);
  }
  if (lastGearAiShouldUseSpecial(car, target, nearEdge, aggression * difficultyAggression)) lastGearUseSpecial(car);
  const cautious = car.archetype === "Coward" && liveCount > 4 || car.archetype === "Defender";
  const ramControl = lastGearAiRamControl(car, swapPad ? null : target, delta, nearEdge, aggression * difficultyAggression);
  // Approach a swap pad at a speed that shrinks with distance, so the AI pulls in instead of orbiting.
  const padSpeed = swapPad ? Math.max(60, Math.hypot(swapPad.x - car.x, swapPad.y - car.y) * 1.1) : 0;
  return {
    up: swapPad
      ? speed < padSpeed && Math.abs(delta) < 1.4
      : (!nearEdge || speed < car.physics.maxSpeed * (cautious ? 0.48 : 0.68)) && !(car.archetype === "Tank" && speed > car.physics.maxSpeed * 0.58),
    down: swapPad ? speed > padSpeed * 1.2 : nearEdge && speed > car.physics.maxSpeed * 0.4,
    left: ramControl.dodgeSide < 0 || (!ramControl.dodgeSide && delta < -0.08),
    right: ramControl.dodgeSide > 0 || (!ramControl.dodgeSide && delta > 0.08),
    charge: ramControl.charge
  };
}

// -- Charge Ram ---------------------------------------------------------------
// Hold to charge (car slows and pivots to aim), release to dash.
// Release inside the gold window = PERFECT RAM. Hold too long = BURNOUT.
// Quick tap + steer = DODGE (sidestep with a brief invulnerability window).
function lastGearStatT(value) {
  return lastGearClamp(((value || 70) - 60) / 40, 0, 1);
}

function lastGearMakeRamState() {
  return { phase: "ready", held: false, heldMs: 0, charge: 0, perfect: false, timerMs: 0, recoverMs: 0, recoverTotalMs: 1, dashSpeed: 0, hitMultiplier: 1, dashStartedAt: 0, dodgeUntil: 0, lockUntilRelease: false };
}

function lastGearRamZone(car) {
  const ram = car?.ram;
  if (!ram) return "ready";
  if (ram.phase !== "charging") return ram.phase;
  const p = car.physics;
  if (ram.heldMs < p.ramFillMs) return "building";
  if (ram.heldMs <= p.ramFillMs + p.ramPerfectMs) return "perfect";
  return "overheat";
}

function lastGearStartRamRecovery(car, ms) {
  const ram = car.ram;
  ram.phase = "recovering";
  ram.recoverMs = Math.max(1, ms);
  ram.recoverTotalMs = ram.recoverMs;
  ram.heldMs = 0;
  ram.charge = 0;
  ram.perfect = false;
  ram.timerMs = 0;
  ram.hitMultiplier = 1;
}

function lastGearRamDodge(car, controls, now) {
  const T = lastGearRamTuning;
  const side = controls.left && !controls.right ? -1 : controls.right && !controls.left ? 1 : 0;
  const impulse = car.physics.ramDodgeImpulse;
  if (side) {
    const dodgeAngle = car.angle + side * Math.PI / 2;
    car.vx += Math.cos(dodgeAngle) * impulse;
    car.vy += Math.sin(dodgeAngle) * impulse;
  } else {
    car.vx -= Math.cos(car.angle) * impulse * 0.7;
    car.vy -= Math.sin(car.angle) * impulse * 0.7;
  }
  car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + T.dodgeInvulnerableMs);
  car.ram.dodgeUntil = now + T.dodgeInvulnerableMs;
  lastGearStartRamRecovery(car, T.dodgeRecoverMs);
  for (let i = 0; i < 5; i += 1) lastGearSpawnParticle("smoke", car.x, car.y, Math.random() * Math.PI * 2, 30 + Math.random() * 60, 260 + Math.random() * 160, 18 + Math.random() * 12, "#d6d0c4");
}

function lastGearReleaseRam(car, controls, now) {
  const ram = car.ram;
  const p = car.physics;
  const T = lastGearRamTuning;
  if (ram.heldMs < T.tapMs) {
    lastGearRamDodge(car, controls, now);
    return;
  }
  const overdrive = (car.overdriveUntil || 0) > now && lastGearRamZone(car) !== "overheat";
  const perfect = overdrive || lastGearRamZone(car) === "perfect";
  const charge = overdrive ? 1 : Math.max(T.minDashCharge, ram.charge);
  if (overdrive) car.overdriveUntil = 0;
  ram.phase = "dashing";
  ram.perfect = perfect;
  ram.charge = charge;
  ram.dashStartedAt = now;
  ram.timerMs = T.dashMsBase + T.dashMsPerCharge * charge;
  ram.dashSpeed = p.maxSpeed * (T.dashSpeedBase + T.dashSpeedPerCharge * charge) * (perfect ? T.perfectSpeedBonus : 1);
  ram.hitMultiplier = (T.hitBase + T.hitPerCharge * charge + (perfect ? T.perfectHitBonus : 0)) * p.ramBodyFactor;
  car.vx = Math.cos(car.angle) * ram.dashSpeed;
  car.vy = Math.sin(car.angle) * ram.dashSpeed;
  const tint = perfect ? "#ffc857" : car.player ? "#52c7ff" : "#ff805f";
  for (let i = 0; i < (perfect ? 7 : 4); i += 1) lastGearSpawnParticle("streak", car.x - Math.cos(car.angle) * 24, car.y - Math.sin(car.angle) * 24, car.angle + Math.PI + (Math.random() - 0.5) * 0.3, 120 + Math.random() * 80, 220 + Math.random() * 120, 60 + Math.random() * 30, tint);
  if (perfect && car.player) {
    lastGearState.shake = Math.max(lastGearState.shake || 0, 5);
    lastGearState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -32, ttl: 620, life: 620, text: "PERFECT!", size: 28, tint: "#ffc857", angle: 0, spin: 0 });
  }
}

function lastGearRamBurnout(car, now) {
  const ram = car.ram;
  ram.phase = "burnout";
  ram.lockUntilRelease = true;
  ram.timerMs = lastGearRamTuning.burnoutMs;
  ram.charge = 0;
  ram.perfect = false;
  car.damage = Math.min(999, car.damage + lastGearRamTuning.burnoutDamage);
  car.hitFlashUntil = now + 220;
  if (car.player) {
    lastGearState.shake = Math.max(lastGearState.shake || 0, 3);
    lastGearAnnounce("burnout", { cooldown: 6000 });
    lastGearState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -24, ttl: 700, life: 700, text: "BURNOUT", size: 26, tint: "#ff805f", angle: 0, spin: 0 });
  }
}

function lastGearUpdateRam(car, controls, dt, now) {
  if (!car.ram) car.ram = lastGearMakeRamState();
  const ram = car.ram;
  const p = car.physics;
  const ms = dt * 1000;
  const wantsCharge = Boolean(controls.charge);
  const released = !wantsCharge && ram.held;
  ram.held = wantsCharge;
  if (!wantsCharge) ram.lockUntilRelease = false;
  const jammed = car.ramJammedUntil > now;
  if (ram.phase === "recovering") {
    ram.recoverMs -= ms;
    if (ram.recoverMs <= 0) { ram.phase = "ready"; ram.recoverMs = 0; }
  } else if (ram.phase === "burnout") {
    ram.timerMs -= ms;
    if (Math.random() < 0.4) lastGearSpawnParticle("smoke", car.x, car.y, Math.random() * Math.PI * 2, 20 + Math.random() * 40, 420 + Math.random() * 260, 26 + Math.random() * 18, "#8d8a86");
    if (ram.timerMs <= 0) lastGearStartRamRecovery(car, p.ramRecoverMs);
  } else if (ram.phase === "dashing") {
    ram.timerMs -= ms;
    if (Math.random() < 0.5) lastGearSpawnParticle("streak", car.x - Math.cos(car.angle) * 26, car.y - Math.sin(car.angle) * 26, car.angle + Math.PI, 60, 160, 40 + ram.charge * 30, ram.perfect ? "#ffc857" : car.player ? "#52c7ff" : "#ff805f");
    if (ram.timerMs <= 0) lastGearStartRamRecovery(car, p.ramRecoverMs);
  }
  if (ram.phase === "ready") {
    if (wantsCharge && !ram.lockUntilRelease && !jammed) { ram.phase = "charging"; ram.heldMs = 0; ram.charge = 0; ram.perfect = false; }
  } else if (ram.phase === "charging") {
    if (jammed) {
      lastGearStartRamRecovery(car, p.ramRecoverMs * 0.5);
      ram.lockUntilRelease = ram.held;
    } else if (released) {
      lastGearReleaseRam(car, controls, now);
    } else {
      ram.heldMs += ms;
      ram.charge = Math.min(1, ram.heldMs / p.ramFillMs);
      if (lastGearRamZone(car) === "overheat" && Math.random() < 0.25) lastGearSpawnParticle("smoke", car.x, car.y, car.angle + Math.PI + (Math.random() - 0.5), 30 + Math.random() * 30, 300, 16 + Math.random() * 10, "#a5a09a");
      if (ram.heldMs > p.ramFillMs + p.ramPerfectMs + p.ramOverheatMs) lastGearRamBurnout(car, now);
    }
  }
}

function lastGearRamHitMultiplier(car) {
  return car?.ram?.phase === "dashing" ? car.ram.hitMultiplier : 1;
}

function lastGearFinishRamHit(car, now) {
  if (car?.ram?.phase !== "dashing") return;
  const perfect = car.ram.perfect;
  lastGearStartRamRecovery(car, car.physics.ramRecoverMs);
  if (car.player && lastGearState?.stats) {
    lastGearState.stats.ramHits = (lastGearState.stats.ramHits || 0) + 1;
    if (perfect) {
      lastGearState.stats.perfectRams = (lastGearState.stats.perfectRams || 0) + 1;
      lastGearAnnounce("perfectRam", { major: true, cooldown: 2500 });
    }
  }
}

function lastGearAiRamControl(car, target, delta, nearEdge, aggression) {
  const ram = car.ram;
  const p = car.physics;
  const now = lastGearLocalNow();
  const skill = lastGearAiRamSkill[lastGearCurrentSettings().aiDifficulty] || lastGearAiRamSkill.normal;
  if (!ram) return { charge: false, dodgeSide: 0 };
  if (ram.phase === "charging" && car.aiPendingDodge) {
    const side = car.aiPendingDodge;
    car.aiPendingDodge = 0;
    return { charge: false, dodgeSide: side };
  }
  if (ram.phase === "charging") return { charge: ram.heldMs < (car.aiRamReleaseMs ?? p.ramFillMs * 0.7), dodgeSide: 0 };
  if (ram.phase !== "ready") return { charge: false, dodgeSide: 0 };
  const threat = lastGearLiveCars().find((other) => {
    if (other.id === car.id || other.respawnAt || other.ram?.phase !== "dashing") return false;
    const dx = car.x - other.x;
    const dy = car.y - other.y;
    const dist = Math.hypot(dx, dy) || 1;
    if (dist > 200) return false;
    return (Math.cos(other.angle) * dx + Math.sin(other.angle) * dy) / dist > 0.8;
  });
  if (threat) {
    const rollKey = `${threat.id}:${threat.ram.dashStartedAt}`;
    if (car.aiDodgeRolledFor !== rollKey) {
      car.aiDodgeRolledFor = rollKey;
      const dodgeChance = skill.dodge * (car.archetype === "Defender" || car.archetype === "Coward" ? 1.6 : 1);
      if (Math.random() < dodgeChance) {
        const cross = Math.cos(threat.angle) * (car.y - threat.y) - Math.sin(threat.angle) * (car.x - threat.x);
        const awayAngle = threat.angle + (cross > 0 ? Math.PI / 2 : -Math.PI / 2);
        car.aiPendingDodge = Math.cos(car.angle + Math.PI / 2 - awayAngle) >= 0 ? 1 : -1;
        return { charge: true, dodgeSide: 0 };
      }
    }
  }
  if (!nearEdge && target?.id) {
    const dist = Math.hypot(target.x - car.x, target.y - car.y);
    const bias = { Aggro: 1.5, Speedster: 1.3, Tank: 1.1, Opportunist: 1.1, Trickster: 0.9, Defender: 0.6, Coward: 0.5 }[car.archetype] || 1;
    if (dist > 150 && dist < 560 && Math.abs(delta) < 0.3 && Math.random() < 0.035 * bias * aggression) {
      const roll = Math.random();
      if (roll < skill.perfect) car.aiRamReleaseMs = p.ramFillMs + p.ramPerfectMs * 0.5;
      else if (roll < skill.perfect + skill.greedy) car.aiRamReleaseMs = Infinity;
      else car.aiRamReleaseMs = p.ramFillMs * (0.45 + Math.random() * 0.5);
      return { charge: true, dodgeSide: 0 };
    }
  }
  return { charge: false, dodgeSide: 0 };
}

function lastGearDrawRamAura(ctx, car) {
  const ram = car.ram;
  if (!ram || (ram.phase !== "charging" && ram.phase !== "dashing")) return;
  const zone = lastGearRamZone(car);
  const t = performance.now();
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  if (zone === "building") {
    ctx.globalAlpha = 0.25 + ram.charge * 0.5;
    ctx.strokeStyle = car.player ? "#52c7ff" : "#ff805f";
    ctx.lineWidth = 3 + ram.charge * 3;
    ctx.beginPath(); ctx.arc(car.x, car.y, 48 - ram.charge * 12, 0, Math.PI * 2); ctx.stroke();
  } else if (zone === "perfect") {
    ctx.globalAlpha = 0.75 + Math.sin(t / 40) * 0.25;
    ctx.strokeStyle = "#ffc857"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(car.x, car.y, 36, 0, Math.PI * 2); ctx.stroke();
  } else if (zone === "overheat") {
    ctx.globalAlpha = 0.45 + Math.random() * 0.4;
    ctx.strokeStyle = "#ff4a3d"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(car.x, car.y, 36 + Math.random() * 4, 0, Math.PI * 2); ctx.stroke();
  } else if (zone === "dashing" && ram.perfect) {
    ctx.globalAlpha = 0.55; ctx.strokeStyle = "#ffc857"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(car.x, car.y, 40, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

function lastGearUpdateCar(car, dt, now) {
  if (car.eliminated) return;
  if (car.respawnAt) {
    if (now >= car.respawnAt) {
      if (Number.isInteger(car.pendingCrewIndex) && car.pendingCrewIndex >= 0) {
        lastGearLoadCrewMember(car, car.pendingCrewIndex);
        car.pendingCrewIndex = null;
        car.nextUp = lastGearDefaultNextUp(car);
      }
      const point = lastGearSafePoint(Math.random() * 8);
      Object.assign(car, { x: point.x, y: point.y, vx: 0, vy: 0, angle: point.angle, respawnAt: 0, invulnerableUntil: now + 1800 });
    }
    return;
  }
  const controls = lastGearControlsFor(car);
  const speed = Math.hypot(car.vx, car.vy);
  const oilSliding = car.oilSlideUntil > now;
  const handlingWeak = car.handlingWeakUntil > now;
  const anchored = car.anchorUntil > now;
  const overhauled = car.overhaulUntil > now;
  const turnPenalty = oilSliding ? 0.38 : handlingWeak ? 0.68 : overhauled ? 0.84 : 1;
  lastGearUpdateRam(car, controls, dt, now);
  const ramPhase = car.ram.phase;
  const charging = ramPhase === "charging";
  const dashing = ramPhase === "dashing";
  const burntOut = ramPhase === "burnout";
  const dodging = car.ram.dodgeUntil > now;
  const turnScale = charging
    ? lastGearRamTuning.chargeTurnBoost * turnPenalty
    : Math.min(1, Math.max(0.35, speed / 190)) * turnPenalty * (dashing ? lastGearRamTuning.dashTurnScale : 1);
  const steerInput = Number.isFinite(controls.steer)
    ? lastGearClamp(controls.steer, -1, 1)
    : (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  if (steerInput) car.angle += car.physics.turnRate * turnScale * dt * steerInput;
  const throttle = Number.isFinite(controls.throttle) ? lastGearClamp(controls.throttle, 0, 1) : 1;
  const boostActive = car.boostUntil > now;
  const accelBoost = (boostActive ? 1.32 : 1) * (anchored ? 0.56 : overhauled ? 0.86 : 1);
  if (controls.up && !charging && !dashing && !burntOut) {
    car.vx += Math.cos(car.angle) * car.physics.acceleration * accelBoost * throttle * dt;
    car.vy += Math.sin(car.angle) * car.physics.acceleration * accelBoost * throttle * dt;
  }
  if (controls.down && !dashing) {
    car.vx -= Math.cos(car.angle) * car.physics.brake * dt;
    car.vy -= Math.sin(car.angle) * car.physics.brake * dt;
  }
  if (charging || burntOut) {
    const keep = Math.pow(lastGearRamTuning.chargeDrag, dt * 60);
    car.vx *= keep;
    car.vy *= keep;
  }
  if (dashing) {
    const blend = 1 - Math.pow(1 - lastGearRamTuning.dashSteerBlend, dt * 60);
    car.vx = lastGearLerp(car.vx, Math.cos(car.angle) * car.ram.dashSpeed, blend);
    car.vy = lastGearLerp(car.vy, Math.sin(car.angle) * car.ram.dashSpeed, blend);
  }
  const baseMaxSpeed = car.physics.maxSpeed * (boostActive ? 1.25 : 1) * (anchored ? lastGearItemTuning.anchorSpeedMultiplier : overhauled ? 0.92 : 1);
  const maxSpeed = dashing
    ? Math.max(baseMaxSpeed, car.ram.dashSpeed)
    : dodging
      ? Math.max(baseMaxSpeed, car.physics.ramDodgeImpulse * 1.1)
      : baseMaxSpeed;
  const newSpeed = Math.hypot(car.vx, car.vy);
  if (newSpeed > maxSpeed) {
    car.vx = (car.vx / newSpeed) * maxSpeed;
    car.vy = (car.vy / newSpeed) * maxSpeed;
  }
  const friction = dashing ? lastGearRamTuning.dashFriction : oilSliding ? 0.996 : controls.up || controls.down ? 0.992 : 0.982;
  car.vx *= Math.pow(friction, dt * 60);
  car.vy *= Math.pow(friction, dt * 60);
  car.prevX = car.x;
  car.prevY = car.y;
  car.x += car.vx * dt;
  car.y += car.vy * dt;
  const boundary = lastGearShapeBoundary(car.x, car.y, now);
  if (boundary.edge > 0.96 && boundary.edge < 1.08 && Math.random() < 0.18) {
    const nx = boundary.nx || ((car.x - lastGearArena.cx) / (lastGearDistanceFromCenter(car) || 1));
    const ny = boundary.ny || ((car.y - lastGearArena.cy) / (lastGearDistanceFromCenter(car) || 1));
    lastGearSpawnParticle("spark", car.x - nx * 12, car.y - ny * 12, Math.atan2(ny, nx) + Math.PI + (Math.random() - 0.5), 90 + Math.random() * 130, 240 + Math.random() * 170, 14 + Math.random() * 14, "#ff8c26");
    if (car.player) lastGearState.shake = Math.max(lastGearState.shake || 0, 2.5);
  }
  if (car.player && boundary.safe && boundary.edge > 0.92 && Math.hypot(car.vx, car.vy) > 160 && Math.random() < 0.016) {
    lastGearAnnounce("edgeSave", { major: true, cooldown: 5200 });
  }
  if (!boundary.safe && boundary.edge > 1.04) lastGearLoseLife(car, now);
}

function lastGearLoseLife(car, now) {
  if (car.respawnAt || car.eliminated) return;
  const distance = lastGearDistanceFromCenter(car) || 1;
  const nx = (car.x - lastGearArena.cx) / distance;
  const ny = (car.y - lastGearArena.cy) / distance;
  lastGearState.ringFlashes.push({ x: car.x, y: car.y, radius: lastGearActiveRadius(now), ttl: 720, life: 720 });
  lastGearCrowdPulse(car.x, car.y, car.player ? 1 : 0.75);
  if (car.player) lastGearTriggerImpactFeedback(185, car.x, car.y, nx, ny, "ringout", { forceVisual: true });
  if (car.player) lastGearState.stats.playerRingOuts += 1;
  if (lastGearIsEvoRush()) {
    lastGearEvoRingOut(car, now);
    return;
  }
  if (car.crew?.[car.crewIndex]) {
    car.crew[car.crewIndex].out = true;
    car.crew[car.crewIndex].damage = car.damage;
    car.lives = car.crew.filter((member) => !member.out).length;
  } else {
    car.lives -= 1;
  }
  car.damage = 0;
  car.item = null;
  car.shieldHits = 0;
  car.bubbleUntil = 0;
  car.anchorUntil = 0;
  car.antiMagnetUntil = 0;
  car.overhaulUntil = 0;
  car.reverseUntil = 0;
  car.oilSlideUntil = 0;
  car.ramJammedUntil = 0;
  car.ram = lastGearMakeRamState();
  car.ironWallUntil = 0;
  car.overdriveUntil = 0;
  car.handlingWeakUntil = 0;
  car.grapple = null;
  if (car.player && car.lives === 1 && !lastGearState.playerLastLifeCalled) {
    lastGearState.playerLastLifeCalled = true;
    lastGearAnnounce("lastLife", { major: true, force: true });
  }
  if (car.lives <= 0) {
    car.eliminated = true;
    car.vx = 0;
    car.vy = 0;
    if (car.lastHitBy === "player" && now - (car.lastHitAt || 0) < 4500) {
      lastGearState.stats.playerKOs += 1;
      lastGearAnnounce(lastGearState.stats.playerKOs >= 2 ? "koStreak" : "gearOut", { major: lastGearState.stats.playerKOs >= 2, cooldown: 1200 });
    }
    if (!lastGearState.firstEliminationCalled) {
      lastGearState.firstEliminationCalled = true;
      lastGearAnnounce("firstGearOut", { major: true, force: true });
    } else {
      lastGearAnnounce("gearOut", { cooldown: 1700 });
    }
    if (car.player && !lastGearTeammateAlive(car)) finishLastGearBeta(false);
    return;
  }
  if (car.crew) car.pendingCrewIndex = lastGearResolveNextUp(car);
  car.respawnAt = now + 1050;
}

function lastGearResolveCollisions(now) {
  const live = lastGearLiveCars().filter((car) => !car.respawnAt);
  for (let i = 0; i < live.length; i += 1) {
    for (let j = i + 1; j < live.length; j += 1) {
      const a = live[i];
      const b = live[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const minDist = a.radius + b.radius;
      if (dist >= minDist) continue;
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = minDist - dist;
      a.x -= nx * overlap * 0.5;
      a.y -= ny * overlap * 0.5;
      b.x += nx * overlap * 0.5;
      b.y += ny * overlap * 0.5;
      const relVx = a.vx - b.vx;
      const relVy = a.vy - b.vy;
      const closing = Math.max(0, relVx * nx + relVy * ny);
      const impact = closing + Math.hypot(relVx, relVy) * 0.18;
      if (impact < 42) continue;
      const aRam = lastGearRamHitMultiplier(a);
      const bRam = lastGearRamHitMultiplier(b);
      const aDashing = a.ram?.phase === "dashing";
      const bDashing = b.ram?.phase === "dashing";
      const aForward = Math.cos(a.angle) * nx + Math.sin(a.angle) * ny;
      const bForward = -(Math.cos(b.angle) * nx + Math.sin(b.angle) * ny);
      const headOn = aForward > 0.45 && bForward > 0.45;
      const aTbone = Math.abs(Math.cos(b.angle) * nx + Math.sin(b.angle) * ny) < 0.34 && aForward > 0.35;
      const bTbone = Math.abs(Math.cos(a.angle) * nx + Math.sin(a.angle) * ny) < 0.34 && bForward > 0.35;
      const impactX = (a.x + b.x) / 2;
      const impactY = (a.y + b.y) / 2;
      if (headOn) {
        lastGearApplyHit(a, b, impact * 0.66 * bRam, -nx, -ny, now);
        lastGearApplyHit(b, a, impact * 0.66 * aRam, nx, ny, now);
        lastGearTriggerImpactFeedback(impact * Math.max(aRam, bRam), impactX, impactY, nx, ny, "headOn", { userInvolved: a.player || b.player });
      } else if (aForward > bForward) {
        lastGearApplyHit(b, a, impact * (aTbone ? 1.35 : 0.82) * aRam, nx, ny, now);
        lastGearTriggerImpactFeedback(impact * (aTbone ? 1.35 : 0.82) * aRam, impactX, impactY, nx, ny, aTbone ? "tbone" : "hit", { userInvolved: a.player });
      } else {
        lastGearApplyHit(a, b, impact * (bTbone ? 1.35 : 0.82) * bRam, -nx, -ny, now);
        lastGearTriggerImpactFeedback(impact * (bTbone ? 1.35 : 0.82) * bRam, impactX, impactY, -nx, -ny, bTbone ? "tbone" : "hit", { userInvolved: b.player });
      }
      if (aDashing) lastGearFinishRamHit(a, now);
      if (bDashing) lastGearFinishRamHit(b, now);
      const impulse = impact * 0.18;
      const aMass = a.physics.mass * (a.anchorUntil > now ? 2.4 : 1) * (a.overhaulUntil > now ? 1.55 : 1);
      const bMass = b.physics.mass * (b.anchorUntil > now ? 2.4 : 1) * (b.overhaulUntil > now ? 1.55 : 1);
      const aPush = impulse * aRam * (a.bubbleUntil > now ? lastGearItemTuning.bubbleImpulse : 1);
      const bPush = impulse * bRam * (b.bubbleUntil > now ? lastGearItemTuning.bubbleImpulse : 1);
      a.vx -= nx * bPush / aMass;
      a.vy -= ny * bPush / aMass;
      b.vx += nx * aPush / bMass;
      b.vy += ny * aPush / bMass;
    }
  }
}

function lastGearApplyHit(receiver, attacker, impact, nx, ny, now) {
  if (receiver.invulnerableUntil > now) return;
  if (attacker && !lastGearAreFoes(receiver, attacker)) return;
  if (receiver.shieldHits > 0 || receiver.bubbleUntil > now) {
    if (receiver.shieldHits > 0) receiver.shieldHits -= 1;
    receiver.bubbleFlashUntil = now + 240;
    receiver.hitFlashUntil = now + 180;
    receiver.vx += nx * impact * 0.08 * lastGearItemTuning.bubbleKnockbackTaken;
    receiver.vy += ny * impact * 0.08 * lastGearItemTuning.bubbleKnockbackTaken;
    if (attacker) {
      attacker.vx -= nx * impact * 0.18;
      attacker.vy -= ny * impact * 0.18;
    }
    return;
  }
  const attackerBonus = attacker?.overhaulUntil > now ? lastGearItemTuning.overhaulDamageDealt : 1;
  const adjustedImpact = impact * attackerBonus * (attacker?.archetype === "Tank" ? 1.14 : attacker?.archetype === "Aggro" ? 1.06 : 1);
  const defensiveMultiplier = (receiver.ironWallUntil || 0) > now ? lastGearSpecialTuning.ironWallDamage : receiver.anchorUntil > now ? 0.62 : receiver.overhaulUntil > now ? lastGearItemTuning.overhaulDamageTaken : 1;
  const bodyReducer = lastGearClamp(1 - (receiver.physics.body - 70) / 180, 0.48, 1.35);
  const damage = Math.max(1, adjustedImpact / 18) * bodyReducer * defensiveMultiplier;
  receiver.damage = Math.min(999, receiver.damage + damage);
  receiver.lastHitBy = attacker?.id || null;
  receiver.lastHitAt = now;
  if (attacker?.player && lastGearState?.stats) {
    lastGearState.stats.damageDealt += damage;
    lastGearState.stats.biggestHit = Math.max(lastGearState.stats.biggestHit, adjustedImpact);
    lastGearSpawnDamagePopup(receiver.x, receiver.y, damage, adjustedImpact);
  }
  if (receiver.player && receiver.lives <= 1 && receiver.damage > 90) {
    lastGearAnnounce("comeback", { major: true, cooldown: 5200 });
  }
  if (receiver.player && receiver.damage > 150 && Math.random() < 0.08) {
    lastGearAnnounce("underdog", { cooldown: 7000 });
  }
  const knockReducer = (receiver.ironWallUntil || 0) > now ? lastGearSpecialTuning.ironWallKnock : receiver.anchorUntil > now ? lastGearItemTuning.anchorKnockbackTaken : receiver.overhaulUntil > now ? 0.7 : 1;
  const knock = ((adjustedImpact * 0.78 + receiver.damage * 2.1) / receiver.physics.mass) * knockReducer;
  receiver.vx += nx * knock;
  receiver.vy += ny * knock;
  if (attacker?.player && adjustedImpact > lastGearImpactTuning.major) {
    for (let i = 0; i < 3; i += 1) {
      lastGearSpawnParticle("streak", receiver.x - nx * 18, receiver.y - ny * 18, Math.atan2(ny, nx) + Math.PI + (Math.random() - 0.5) * 0.18, 90 + Math.random() * 90, 260 + Math.random() * 160, 86 + Math.random() * 34, "#52c7ff");
    }
  }
  receiver.hitFlashUntil = now + 220;
  if (attacker) attacker.hitFlashUntil = now + 120;
}

function lastGearSpawnDamagePopup(x, y, damage, impact) {
  if (!lastGearState) return;
  lastGearState.effects.push({
    kind: "text",
    x,
    y: y - 42,
    vx: (Math.random() - 0.5) * 35,
    vy: -46,
    ttl: 720,
    life: 720,
    text: `+${Math.round(damage)}%`,
    size: impact > lastGearImpactTuning.major ? 26 : 18,
    tint: impact > lastGearImpactTuning.major ? "#ffc857" : "#ffffff",
    angle: 0,
    spin: 0
  });
}

function lastGearUseItem(car = lastGearPlayer()) {
  if (!lastGearState?.active || lastGearState.finished || !car?.item || car.eliminated || car.respawnAt) return false;
  const now = performance.now() - (lastGearState.startedAt || performance.now());
  const item = car.item;
  if (item.id === "grapple" && car.grapple?.state === "latched") {
    const target = lastGearState.cars.find((entry) => entry.id === car.grapple.targetId && !entry.eliminated);
    if (target) {
      const dx = car.x - target.x;
      const dy = car.y - target.y;
      const mag = Math.hypot(dx, dy) || 1;
      if (target.bubbleUntil > now) {
        target.bubbleFlashUntil = now + 260;
      } else {
        lastGearApplyHit(target, car, lastGearItemTuning.grappleDamage * 18, dx / mag, dy / mag, now);
        target.vx += (dx / mag) * lastGearItemTuning.grappleForce;
        target.vy += (dy / mag) * lastGearItemTuning.grappleForce;
      }
      lastGearTriggerImpactFeedback(150, target.x, target.y, dx / mag, dy / mag, "hit", { userInvolved: car.player });
    }
    car.grapple = null;
    car.item = null;
    updateLastGearHud(true);
    return true;
  }
  car.item = null;
  if (car.player && lastGearState?.stats) {
    lastGearState.stats.itemUses[item.id] = (lastGearState.stats.itemUses[item.id] || 0) + 1;
  }
  if (item.id === "shield") {
    car.shieldHits = 1;
    car.bubbleUntil = now + lastGearItemTuning.bubbleDuration;
  } else if (item.id === "teleport") {
    const point = lastGearFindSafeTeleportPoint(car);
    Object.assign(car, { x: point.x, y: point.y, vx: 0, vy: 0, angle: point.angle, invulnerableUntil: now + lastGearItemTuning.teleportInvulnerable });
  } else if (item.id === "turbo") {
    car.boostUntil = now + 1200;
    car.vx += Math.cos(car.angle) * 170;
    car.vy += Math.sin(car.angle) * 170;
  } else if (item.id === "burst") {
    lastGearState.projectiles.push({ id: `lg-emp-${Date.now()}-${Math.random()}`, type: "empPulse", owner: car.id, x: car.x, y: car.y, radius: 0, maxRadius: lastGearItemTuning.empRange, expiresAt: now + 520 });
  } else if (item.id === "oil" || item.id === "tire") {
    lastGearState.hazards.push({
      id: `lg-hazard-${Date.now()}-${Math.random()}`,
      type: item.id,
      owner: car.id,
      x: car.x - Math.cos(car.angle) * 48,
      y: car.y - Math.sin(car.angle) * 48,
      radius: item.id === "oil" ? 42 : 34,
      expiresAt: now + 12000
    });
  } else if (item.id === "grapple") {
    const target = lastGearNearestValidGrappleTarget(car);
    if (target) {
      car.grapple = { state: "latched", targetId: target.id, expiresAt: now + lastGearItemTuning.grappleLatchDuration };
      car.item = item;
      lastGearState.effects.push({ kind: "grappleLatch", x: target.x, y: target.y, vx: 0, vy: 0, ttl: 420, life: 420, size: 64, tint: "#52c7ff", angle: 0, spin: 0 });
    } else {
      car.grapple = { state: "miss", x: car.x + Math.cos(car.angle) * 130, y: car.y + Math.sin(car.angle) * 130, expiresAt: now + 500 };
    }
  } else if (item.id === "antiMagnet") {
    car.antiMagnetUntil = now + lastGearItemTuning.antiMagnetDuration;
  } else if (item.id === "anchor") {
    car.anchorUntil = now + lastGearItemTuning.anchorDuration;
  } else if (item.id === "reverse") {
    lastGearLiveCars().forEach((target) => {
      if (lastGearAreFoes(car, target) && target.bubbleUntil <= now) target.reverseUntil = now + lastGearItemTuning.reverseDuration;
    });
  } else if (item.id === "overhaul") {
    car.overhaulUntil = now + lastGearItemTuning.overhaulDuration;
  }
  updateLastGearHud(true);
  return true;
}

function lastGearFindSafeTeleportPoint(car) {
  for (let attempt = 0; attempt < 36; attempt += 1) {
    const point = lastGearSafePoint(Math.random() * 8);
    if (!lastGearShapeBoundary(point.x, point.y).safe) continue;
    const overlapsCar = lastGearLiveCars().some((target) => target.id !== car.id && Math.hypot(target.x - point.x, target.y - point.y) < 110);
    const overlapsHazard = lastGearState.hazards.some((hazard) => Math.hypot(hazard.x - point.x, hazard.y - point.y) < hazard.radius + 80);
    if (!overlapsCar && !overlapsHazard) return point;
  }
  return lastGearSafePoint(Math.random() * 8);
}

function lastGearNearestValidGrappleTarget(car) {
  return lastGearLiveCars()
    .filter((target) => lastGearAreFoes(car, target) && !target.respawnAt)
    .map((target) => ({ target, distance: Math.hypot(target.x - car.x, target.y - car.y) }))
    .filter((entry) => entry.distance <= lastGearItemTuning.grappleRange)
    .sort((a, b) => a.distance - b.distance)[0]?.target || null;
}

function lastGearUseSpecial(car = lastGearPlayer()) {
  if (!lastGearState?.active || lastGearState.finished || !car || car.eliminated || car.respawnAt) return false;
  const now = lastGearLocalNow();
  if (now < (car.specialCooldownUntil || 0)) return false;
  const special = lastGearSpecialFor(car);
  const T = lastGearSpecialTuning;
  car.specialCooldownUntil = now + special.cooldown;
  const others = lastGearLiveCars().filter((target) => lastGearAreFoes(car, target) && !target.respawnAt);
  if (special.effect === "shunt") {
    const sideAngle = car.angle + Math.PI / 2;
    const sx = Math.cos(sideAngle);
    const sy = Math.sin(sideAngle);
    others.forEach((target) => {
      const dLeft = Math.hypot(target.x - (car.x + sx * T.shuntReach), target.y - (car.y + sy * T.shuntReach));
      const dRight = Math.hypot(target.x - (car.x - sx * T.shuntReach), target.y - (car.y - sy * T.shuntReach));
      if (dLeft < target.radius + 40) lastGearApplyHit(target, car, T.shuntImpact, sx, sy, now);
      else if (dRight < target.radius + 40) lastGearApplyHit(target, car, T.shuntImpact, -sx, -sy, now);
    });
    lastGearSpecialRing(car, 100, special.tint);
  } else if (special.effect === "frontslam") {
    const fx = car.x + Math.cos(car.angle) * T.slamReach;
    const fy = car.y + Math.sin(car.angle) * T.slamReach;
    others.forEach((target) => {
      if (Math.hypot(target.x - fx, target.y - fy) > target.radius + 50) return;
      lastGearApplyHit(target, car, T.slamImpact, Math.cos(car.angle), Math.sin(car.angle), now);
    });
    lastGearState.effects.push({ kind: "ring", x: fx, y: fy, vx: 0, vy: 0, angle: 0, spin: 0, ttl: 380, life: 380, size: 80, tint: special.tint });
    if (car.player) lastGearState.shake = Math.max(lastGearState.shake || 0, 4);
  } else if (special.effect === "dash") {
    car.vx += Math.cos(car.angle) * T.hopImpulse;
    car.vy += Math.sin(car.angle) * T.hopImpulse;
    car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + T.hopInvulnerableMs);
    for (let i = 0; i < 4; i += 1) lastGearSpawnParticle("streak", car.x, car.y, car.angle + Math.PI + (Math.random() - 0.5) * 0.4, 120, 260, 70, special.tint);
  } else if (special.effect === "ironWall") {
    car.ironWallUntil = now + T.ironWallMs;
    car.vx *= 0.5;
    car.vy *= 0.5;
    lastGearSpecialRing(car, 70, special.tint, 300);
  } else if (special.effect === "snare") {
    others.forEach((target) => {
      const dx = target.x - car.x;
      const dy = target.y - car.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > T.snareRadius) return;
      if (target.ram?.phase === "charging") lastGearStartRamRecovery(target, target.physics.ramRecoverMs * 0.5);
      target.ramJammedUntil = Math.max(target.ramJammedUntil || 0, now + T.snareJamMs);
      lastGearApplyHit(target, car, T.snareImpact, dx / distance, dy / distance, now);
    });
    lastGearSpecialRing(car, T.snareRadius, special.tint, 460);
  } else if (special.effect === "overdrive") {
    if (car.ram && ["recovering", "burnout"].includes(car.ram.phase)) car.ram = lastGearMakeRamState();
    car.overdriveUntil = now + T.overdriveMs;
    lastGearSpecialRing(car, 60, special.tint, 360);
  } else if (special.effect === "whip") {
    others.forEach((target) => {
      const dx = target.x - car.x;
      const dy = target.y - car.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > T.whipRadius) return;
      const tx = -dy / distance;
      const ty = dx / distance;
      const nx = tx * 0.85 + (dx / distance) * 0.35;
      const ny = ty * 0.85 + (dy / distance) * 0.35;
      const mag = Math.hypot(nx, ny) || 1;
      lastGearApplyHit(target, car, T.whipImpact, nx / mag, ny / mag, now);
    });
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      lastGearSpawnParticle("streak", car.x + Math.cos(angle) * 60, car.y + Math.sin(angle) * 60, angle + Math.PI / 2, 140, 280, 50, special.tint);
    }
  }
  if (car.player) {
    lastGearState.stats.specials = (lastGearState.stats.specials || 0) + 1;
    lastGearState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 76, vx: 0, vy: -26, ttl: 700, life: 700, text: special.name.toUpperCase(), size: 24, tint: special.tint, angle: 0, spin: 0 });
  }
  updateLastGearHud(true);
  return true;
}

function lastGearRandomItem(tier = null) {
  const setting = lastGearCurrentSettings().items || "normal";
  if (setting === "off") return null;
  const pickTier = tier || lastGearRollTier(setting);
  const pool = lastGearItemDefinitions.filter((item) => lastGearItemTier(item.id) === pickTier);
  const weighted = [];
  pool.forEach((item) => {
    const weight = Math.max(1, item.weights?.[setting] ?? item.weights?.normal ?? 1);
    for (let i = 0; i < weight; i += 1) weighted.push(item);
  });
  return weighted[Math.floor(Math.random() * weighted.length)] || lastGearItemDefinitions[0];
}

function lastGearUpdateItems(dt, now) {
  lastGearState.itemBoxes.forEach((box) => {
    if (box.placed) Object.assign(box, lastGearPlacedPickupPoint(box.slot, now));
  });
  lastGearState.itemBoxes.forEach((box) => {
    if (!box.active && now >= box.respawnAt) box.active = true;
    if (!box.active) return;
    lastGearLiveCars().forEach((car) => {
      if (!box.active || car.respawnAt || car.item) return;
      if (Math.hypot(car.x - box.x, car.y - box.y) > 42) return;
      car.item = box.placed ? box.item : lastGearRandomItem();
      if (!car.item) return;
      box.active = false;
      const setting = lastGearCurrentSettings().items;
      const cadence = lastGearItemCadence[setting] || lastGearItemCadence.normal;
      const speedup = lastGearState.suddenDeath ? 0.62 : 1;
      if (box.placed) {
        box.item = lastGearNextPlacedItem(box.tier, car.item.id);
        box.respawnAt = now + (lastGearPlacedPickupTuning.respawnMs[setting] || lastGearPlacedPickupTuning.respawnMs.normal) * speedup;
        if (car.player) lastGearState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -26, ttl: 650, life: 650, text: car.item.name.toUpperCase(), size: 22, tint: lastGearTierColors[box.tier], angle: 0, spin: 0 });
      } else {
        box.respawnAt = now + cadence.respawn * speedup + Math.random() * cadence.variance * speedup;
      }
    });
  });
  lastGearState.hazards = lastGearState.hazards.filter((hazard) => hazard.expiresAt > now);
  lastGearState.hazards.forEach((hazard) => {
    lastGearLiveCars().forEach((car) => {
      if (lastGearIsFriendlyId(car.id, hazard.owner) || car.respawnAt) return;
      if (Math.hypot(car.x - hazard.x, car.y - hazard.y) > hazard.radius + car.radius) return;
      if (car.bubbleUntil > now) {
        car.bubbleFlashUntil = now + 220;
      } else if (hazard.type === "oil") {
        car.oilSlideUntil = now + lastGearItemTuning.oilDuration;
        car.vx *= 0.94;
        car.vy *= 0.94;
      } else {
        car.damage = Math.min(999, car.damage + lastGearItemTuning.spikeDamage);
        car.ramJammedUntil = now + lastGearItemTuning.spikeRamJam;
        car.handlingWeakUntil = now + lastGearItemTuning.spikeHandling;
        lastGearApplyHit(car, null, 68, (car.x - hazard.x) / hazard.radius, (car.y - hazard.y) / hazard.radius, now);
      }
      hazard.expiresAt = 0;
    });
  });
  lastGearState.projectiles = lastGearState.projectiles.filter((projectile) => projectile.expiresAt > now);
  lastGearState.projectiles.forEach((projectile) => {
    if (projectile.type === "empPulse") {
      projectile.radius = lastGearLerp(projectile.radius || 0, projectile.maxRadius, 0.24);
      lastGearLiveCars().forEach((car) => {
        if (lastGearIsFriendlyId(car.id, projectile.owner) || car.respawnAt || car.bubbleUntil > now) return;
        const distance = Math.hypot(car.x - projectile.x, car.y - projectile.y);
        if (distance > projectile.radius || car.empHitAt === projectile.id) return;
        const dx = (car.x - projectile.x) / (distance || 1);
        const dy = (car.y - projectile.y) / (distance || 1);
        car.empHitAt = projectile.id;
        lastGearApplyHit(car, lastGearState.cars.find((entry) => entry.id === projectile.owner), lastGearItemTuning.empDamage * 18, dx, dy, now);
        car.vx += dx * lastGearItemTuning.empForce;
        car.vy += dy * lastGearItemTuning.empForce;
        if (car.ram?.phase === "charging") lastGearStartRamRecovery(car, car.physics.ramRecoverMs * 0.5);
      });
      return;
    }
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    lastGearLiveCars().forEach((car) => {
      if (lastGearIsFriendlyId(car.id, projectile.owner) || car.respawnAt) return;
      if (Math.hypot(car.x - projectile.x, car.y - projectile.y) > car.radius + 18) return;
      const mag = Math.hypot(projectile.vx, projectile.vy) || 1;
      lastGearApplyHit(car, null, 136, projectile.vx / mag, projectile.vy / mag, now);
      projectile.expiresAt = 0;
    });
  });
  lastGearLiveCars().forEach((car) => {
    if (car.grapple?.expiresAt && car.grapple.expiresAt <= now) car.grapple = null;
    if (car.antiMagnetUntil <= now) return;
    lastGearLiveCars().forEach((target) => {
      if (!lastGearAreFoes(car, target) || target.respawnAt || target.bubbleUntil > now) return;
      const dx = target.x - car.x;
      const dy = target.y - car.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > lastGearItemTuning.antiMagnetRange) return;
      const strength = (1 - distance / lastGearItemTuning.antiMagnetRange) * lastGearItemTuning.antiMagnetForce * dt;
      target.vx += (dx / distance) * strength;
      target.vy += (dy / distance) * strength;
    });
  });
}

function lastGearUpdateEffects(dt) {
  if (!lastGearState) return;
  lastGearState.effects = lastGearState.effects.filter((effect) => {
    effect.life -= dt * 1000;
    effect.x += effect.vx * dt;
    effect.y += effect.vy * dt;
    effect.vx *= Math.pow(0.9, dt * 60);
    effect.vy *= Math.pow(0.9, dt * 60);
    effect.angle += effect.spin * dt;
    return effect.life > 0;
  });
  lastGearState.ringFlashes = lastGearState.ringFlashes.filter((flash) => {
    flash.life -= dt * 1000;
    return flash.life > 0;
  });
  lastGearState.shake = Math.max(0, (lastGearState.shake || 0) - dt * 26);
}

function lastGearUpdateSuddenDeath(now) {
  const seconds = Number(lastGearCurrentSettings().suddenDeathSeconds || 0);
  const triggerAt = seconds > 0 ? seconds * 1000 : Infinity;
  if (!lastGearState || lastGearState.suddenDeath || now < triggerAt) return;
  lastGearState.suddenDeath = true;
  lastGearState.suddenDeathStartedAt = now;
  lastGearState.ringFlashes.push({ x: lastGearArena.cx, y: lastGearArena.cy, radius: lastGearArena.radius, ttl: 1200, life: 1200 });
  lastGearState.shake = Math.max(lastGearState.shake || 0, 12);
  lastGearAnnounce("suddenDeath", { major: true, force: true, duration: 4300 });
  lastGearPlaySound("battle-special");
}

function updateLastGearBeta(now) {
  if (!lastGearState || lastGearState.finished) return;
  if (!lastGearState.startedAt) lastGearState.startedAt = now;
  if (lastGearState.countdownUntil && now < lastGearState.countdownUntil) {
    lastGearUpdateCamera();
    drawLastGearFrame();
    drawLastGearCountdown(now);
    lastGearRenderAnnouncer(now - lastGearState.startedAt);
    updateLastGearHud();
    lastGearState.raf = requestAnimationFrame(updateLastGearBeta);
    return;
  }
  if (lastGearState.countdownUntil && now >= lastGearState.countdownUntil) {
    lastGearState.countdownUntil = null;
    lastGearState.goUntil = now + 550;
  }
  const localNow = now - lastGearState.startedAt;
  const dt = Math.min(0.035, (now - lastGearState.last) / 1000);
  lastGearState.last = now;
  lastGearUpdateEffects(dt);
  lastGearUpdateSuddenDeath(localNow);
  lastGearRenderAnnouncer(localNow);
  if (lastGearState.hitPauseUntil && localNow < lastGearState.hitPauseUntil) {
    lastGearUpdateCamera();
    drawLastGearFrame();
    updateLastGearHud();
    lastGearState.raf = requestAnimationFrame(updateLastGearBeta);
    return;
  }
  lastGearState.hitPauseUntil = 0;
  lastGearState.cars.forEach((car) => lastGearUpdateCar(car, dt, localNow));
  lastGearResolveCollisions(localNow);
  lastGearUpdateItems(dt, localNow);
  lastGearUpdateSwapPads(dt, localNow);
  lastGearCrowdUpdate(dt, localNow);
  lastGearUpdateCamera();
  const survivors = lastGearLiveCars();
  if (survivors.length === 2 && !lastGearState.finalTwoCalled) {
    lastGearState.finalTwoCalled = true;
    lastGearAnnounce("finalTwo", { major: true, force: true });
  }
  const outcome = lastGearMatchOutcome();
  if (outcome.done && !lastGearState.finished) finishLastGearBeta(outcome.playerWon);
  if (lastGearIsEvoRush() && !lastGearState.finished) lastGearEvoTick(localNow);
  drawLastGearFrame();
  if (lastGearState.goUntil && now < lastGearState.goUntil) drawLastGearCountdown(now);
  updateLastGearHud();
  lastGearState.raf = requestAnimationFrame(updateLastGearBeta);
}

function finishLastGearBeta(playerWon) {
  if (!lastGearState || lastGearState.finished) return;
  lastGearState.finished = true;
  recordTunerStat(playerWon ? "lastGearMatchesWon" : "lastGearMatchesLost");
  recordTunerPlaySession();
  lastGearState.stats.finishTime = performance.now();
  if (lastGearState.raf) cancelAnimationFrame(lastGearState.raf);
  const finalCall = lastGearChooseLine(lastGearFormat().teams ? lastGearAnnouncerLines.teamWinner : lastGearAnnouncerLines.winner);
  lastGearAnnounce("winner", { major: true, force: true, line: finalCall, duration: 5200, legendary: true });
  lastGearPlaySound(playerWon ? "win-jingle" : "lose-jingle");
  setTimeout(() => {
    if (lastGearState?.finished) lastGearRenderAnnouncer(Infinity);
  }, 5300);
  const formatId = lastGearFormatId();
  const resultTitle = formatId === "rally" ? (playerWon ? "Your Team Wins!" : "Your Team Lost") : formatId === "duel" ? (playerWon ? "Duel Won!" : "Duel Lost") : (playerWon ? "Last Gear Winner!" : "Eliminated");
  if (el.lastGearResultTitle) el.lastGearResultTitle.textContent = resultTitle;
  if (el.lastGearResultCopy) el.lastGearResultCopy.innerHTML = lastGearResultsMarkup(finalCall);
  if (el.lastGearResults) el.lastGearResults.hidden = false;
  lastGearEvoSyncResultButtons(lastGearIsEvoRush());
  if (lastGearIsEvoRush()) lastGearEvoFinish(playerWon);
}

function lastGearResultsMarkup(finalCall) {
  const player = lastGearPlayer();
  const winner = lastGearLiveCars()[0] || lastGearState.cars.find((car) => !car.eliminated) || player;
  const liveCars = lastGearLiveCars();
  const stillFighting = Boolean(player?.eliminated && liveCars.length > 1);
  const eliminatedBeforePlayer = lastGearState.cars.filter((car) => car.eliminated && !car.player).length;
  const totalCars = lastGearState.cars.length;
  const placement = player?.eliminated ? Math.max(2, totalCars - eliminatedBeforePlayer) : 1;
  const stats = lastGearState.stats;
  const survivalMs = (stats.finishTime || performance.now()) - stats.startedAt;
  const itemEntry = Object.entries(stats.itemUses || {}).sort((a, b) => b[1] - a[1])[0];
  const favoriteItemDef = itemEntry
    ? (lastGearItemDefinitions.find((item) => item.id === itemEntry[0]) || betaItemDefinitions.find((item) => item.id === itemEntry[0]))
    : null;
  const favoriteItem = itemEntry ? (favoriteItemDef?.name || itemEntry[0]) : "None";
  return `
    <div class="last-gear-result-card">
      <p class="last-gear-result-call">${finalCall}</p>
      <div class="last-gear-result-stats">
        <p><span>${lastGearFormat().teams ? "Format" : "Placement"}</span><strong>${lastGearFormat().teams ? "Rally 2v2" : `#${placement}`}</strong></p>
        ${stillFighting
          ? `<p><span>Still Fighting</span><strong>${liveCars.length}</strong></p>`
          : lastGearFormat().teams
            ? `<p><span>Winning Team</span><strong>${winner?.team === player?.team ? "Yours" : "Opponents"}</strong></p>`
            : `<p><span>Winner</span><strong>${winner?.name || "Unknown"}</strong></p>`}
        <p><span>Player KOs</span><strong>${stats.playerKOs}</strong></p>
        <p><span>Ring-Outs Taken</span><strong>${stats.playerRingOuts}</strong></p>
        <p><span>Biggest Hit</span><strong>${Math.round(stats.biggestHit)}</strong></p>
        <p><span>Perfect Rams</span><strong>${stats.perfectRams || 0} / ${stats.ramHits || 0}</strong></p>
        <p><span>Crew Swaps</span><strong>${stats.swaps || 0}</strong></p>
        <p><span>Specials Used</span><strong>${stats.specials || 0}</strong></p>
        <p><span>Survival Time</span><strong>${Math.round(survivalMs / 1000)}s</strong></p>
        <p><span>Damage Dealt</span><strong>${Math.round(stats.damageDealt)}%</strong></p>
        <p><span>Favorite Item</span><strong>${favoriteItem}</strong></p>
      </div>
    </div>
  `;
}

function drawLastGearFrame() {
  if (!lastGearState || !el.lastGearCanvas) return;
  const ctx = el.lastGearCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const canvasW = el.lastGearCanvas.width;
  const canvasH = el.lastGearCanvas.height;
  const viewW = canvasW / ratio;
  const viewH = canvasH / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, viewW, viewH);
  drawLastGearStadiumBg(ctx, viewW, viewH);
  ctx.save();
  ctx.translate(viewW / 2, viewH / 2);
  const shake = lastGearState.shake || 0;
  if (shake > 0.1) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  ctx.scale(lastGearArena.zoom, lastGearArena.zoom);
  ctx.translate(-lastGearCamera.x, -lastGearCamera.y);
  drawLastGearCrowd(ctx);
  drawLastGearArena(ctx);
  drawLastGearObjects(ctx);
  lastGearState.cars.forEach((car) => drawLastGearCar(ctx, car));
  ctx.restore();
  drawLastGearVignette(ctx, viewW, viewH);
}

function drawLastGearCountdown(now) {
  if (!el.lastGearCanvas || (!lastGearState?.countdownUntil && !lastGearState?.goUntil)) return;
  const ctx = el.lastGearCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.lastGearCanvas.width / ratio;
  const h = el.lastGearCanvas.height / ratio;
  const remaining = Math.max(0, (lastGearState.countdownUntil || 0) - now);
  const seconds = Math.ceil(remaining / 1000);
  const text = lastGearState.goUntil && now < lastGearState.goUntil ? "GO!" : seconds > 0 ? String(seconds) : "GO!";
  ctx.save();
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, w, h);
  ctx.font = "bold 140px 'Bowlby One', sans-serif";
  ctx.fillStyle = "#ffc857";
  ctx.strokeStyle = "rgba(0,0,0,0.8)";
  ctx.lineWidth = 8;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(text, w / 2, h / 2);
  ctx.fillText(text, w / 2, h / 2);
  ctx.restore();
}

function drawLastGearStadiumBg(ctx, width, height) {
  if (lastGearImages.arenaBg?.complete && lastGearImages.arenaBg.naturalWidth > 0) {
    ctx.drawImage(lastGearImages.arenaBg, 0, 0, width, height);
    return;
  }
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height));
  gradient.addColorStop(0, "#0c1018");
  gradient.addColorStop(1, "#03050a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawLastGearVignette(ctx, width, height) {
  const intensity = lastGearEdgeIntensity() * 0.35 + (lastGearState?.suddenDeath ? 0.12 : 0);
  if (intensity <= 0.01) return;
  ctx.save();
  ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
  const gradient = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.22, width / 2, height / 2, Math.max(width, height) * 0.72);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.72, `rgba(255, 128, 38, ${intensity * 0.18})`);
  gradient.addColorStop(1, `rgba(8, 12, 20, ${intensity})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawLastGearArena(ctx) {
  const { cx, cy } = lastGearArena;
  const now = lastGearLocalNow();
  const radius = lastGearActiveRadius(now);
  const shape = lastGearShape();
  const theme = lastGearArenaTheme();
  if (theme.art && !lastGearArenaArtImages[theme.id]) lastGearArenaArtImages[theme.id] = betaMakeImage(theme.art);
  const cityArt = theme.art ? lastGearArenaArtImages[theme.id] : null;
  const shapeArt = shape === "circle" && lastGearImages.platform?.complete && lastGearImages.platform.naturalWidth > 0
    ? lastGearImages.platform
    : lastGearImages.arenas?.[shape];
  const platformImg = cityArt?.complete && cityArt.naturalWidth > 0 ? cityArt : shapeArt;
  if (platformImg?.complete && platformImg.naturalWidth > 0) {
    const size = lastGearArena.radius * 2.2;
    ctx.drawImage(platformImg, cx - size / 2, cy - size / 2, size, size);
  } else {
    drawLastGearProceduralArena(ctx, shape, radius);
  }
  lastGearDrawArenaDecal(ctx, theme, shape, radius);
}

function drawLastGearProceduralArena(ctx, shape, radius) {
  // City art can replace this per city via lastGearArenaCities[city].art.
  const theme = lastGearArenaTheme();
  const paths = lastGearShapePaths(shape, radius);
  const fillRule = shape === "donut" ? "evenodd" : "nonzero";
  ctx.save();
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 26;
  ctx.strokeStyle = theme.rim;
  ctx.lineWidth = 14;
  paths.forEach((path) => ctx.stroke(path));
  ctx.shadowBlur = 0;
  ctx.fillStyle = theme.floor;
  paths.forEach((path) => ctx.fill(path, fillRule));
  ctx.restore();
  ctx.save();
  const clip = new Path2D();
  paths.forEach((path) => clip.addPath(path));
  ctx.clip(clip, fillRule);
  lastGearDrawArenaPattern(ctx, theme, shape, radius);
  ctx.restore();
}

function drawLastGearObjects(ctx) {
  const now = performance.now() - (lastGearState.startedAt || performance.now());
  lastGearState.ringFlashes.forEach((flash) => {
    const progress = 1 - flash.life / flash.ttl;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = Math.max(0, 1 - progress) * 0.68;
    ctx.lineWidth = 8 + progress * 18;
    ctx.strokeStyle = "rgba(255, 200, 87, 0.9)";
    ctx.beginPath();
    ctx.arc(lastGearArena.cx, lastGearArena.cy, flash.radius + progress * 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
  lastGearDrawSwapPads(ctx);
  lastGearDrawPlacedPickups(ctx);
  lastGearState.itemBoxes.filter((box) => box.active && !box.placed).forEach((box) => {
    const itemBoxImage = lastGearImages.itemBox?.complete && lastGearImages.itemBox.naturalWidth ? lastGearImages.itemBox : betaTrackImages.itemBox;
    betaDrawImageOrFallback(ctx, itemBoxImage, box.x, box.y, 42, 42, () => {
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(box.x - 18, box.y - 18, 36, 36);
    });
  });
  lastGearState.hazards.forEach((hazard) => {
    const image = hazard.type === "oil" ? betaTrackImages.oilSlick : betaTrackImages.spikeStrip;
    betaDrawImageOrFallback(ctx, image, hazard.x, hazard.y, hazard.type === "oil" ? 78 : 84, hazard.type === "oil" ? 48 : 28, () => {
      ctx.fillStyle = hazard.type === "oil" ? "rgba(6,8,12,0.92)" : "#ff3f3f";
      ctx.beginPath();
      ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  lastGearState.projectiles.forEach((projectile) => {
    if (projectile.type === "empPulse") {
      ctx.save();
      ctx.globalAlpha = Math.max(0.15, 1 - (projectile.radius || 0) / (projectile.maxRadius || 1));
      const img = lastGearImages.empRing;
      if (img?.complete && img.naturalWidth) {
        ctx.drawImage(img, projectile.x - projectile.radius, projectile.y - projectile.radius, projectile.radius * 2, projectile.radius * 2);
      } else {
        ctx.strokeStyle = "rgba(192, 132, 252, 0.72)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius || 1, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }
    const angle = Math.atan2(projectile.vy, projectile.vx);
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(angle + Math.PI);
    betaDrawImageOrFallback(ctx, betaTrackImages.empWave, 0, 0, 62, 34, () => {
      ctx.fillStyle = "#c084fc";
      ctx.fillRect(-22, -8, 44, 16);
    });
    ctx.restore();
  });
  lastGearState.effects.forEach((effect) => {
    const alpha = Math.max(0, effect.life / effect.ttl);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.angle);
    if (effect.kind === "spark") {
      const img = lastGearImages.impactSparks;
      if (img?.complete && img.naturalWidth) {
        ctx.drawImage(img, -effect.size / 2, -effect.size / 2, effect.size, effect.size);
      } else {
        ctx.strokeStyle = effect.tint;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-effect.size * 0.5, 0);
        ctx.lineTo(effect.size * 0.5, 0);
        ctx.stroke();
      }
    } else if (effect.kind === "smoke") {
      const img = lastGearImages.smokePuffs;
      if (img?.complete && img.naturalWidth) {
        ctx.drawImage(img, -effect.size / 2, -effect.size / 2, effect.size, effect.size);
      } else {
        ctx.fillStyle = "rgba(214, 208, 196, 0.48)";
        ctx.beginPath();
        ctx.arc(0, 0, effect.size * 0.38, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (effect.kind === "streak") {
      const img = lastGearImages.speedLines;
      if (img?.complete && img.naturalWidth) {
        ctx.drawImage(img, -effect.size * 0.55, -effect.size * 0.18, effect.size, effect.size * 0.36);
      } else {
        ctx.strokeStyle = "rgba(82, 199, 255, 0.72)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-effect.size * 0.55, 0);
        ctx.lineTo(effect.size * 0.55, 0);
        ctx.stroke();
      }
    } else if (effect.kind === "ring") {
      const progress = 1 - effect.life / effect.ttl;
      ctx.strokeStyle = effect.tint;
      ctx.lineWidth = 6 * (1 - progress) + 1;
      ctx.beginPath();
      ctx.arc(0, 0, effect.size * (0.35 + progress * 0.65), 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.kind === "text" || effect.kind === "impactWord") {
      ctx.font = `900 ${effect.size}px ${effect.kind === "impactWord" ? "'Bowlby One', sans-serif" : "'Space Grotesk', sans-serif"}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(3, effect.size * 0.14);
      ctx.strokeStyle = "rgba(0,0,0,0.78)";
      ctx.fillStyle = effect.tint;
      ctx.strokeText(effect.text, 0, 0);
      ctx.fillText(effect.text, 0, 0);
    }
    ctx.restore();
  });
  lastGearState.cars.filter((car) => car.shieldHits > 0 || car.bubbleUntil > now || car.boostUntil > now || car.hitFlashUntil > now || car.anchorUntil > now || car.antiMagnetUntil > now || car.overhaulUntil > now || car.reverseUntil > now || car.grapple).forEach((car) => {
    if (car.grapple?.state === "latched") {
      const target = lastGearState.cars.find((entry) => entry.id === car.grapple.targetId);
      if (target) {
        ctx.strokeStyle = "rgba(82,199,255,0.82)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(car.x, car.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        betaDrawImageOrFallback(ctx, lastGearImages.grappleLatch, target.x, target.y, 52, 52, () => {});
      }
    }
    if (car.shieldHits > 0 || car.bubbleUntil > now) {
      const pulse = 1 + Math.sin(now / 130) * 0.05;
      const img = betaTrackImages.bubbaBubble;
      if (img?.complete && img.naturalWidth) {
        ctx.globalAlpha = car.bubbleFlashUntil > now ? 0.95 : 0.72;
        ctx.drawImage(img, car.x - 49 * pulse, car.y - 49 * pulse, 98 * pulse, 98 * pulse);
        ctx.globalAlpha = 1;
      } else {
        ctx.strokeStyle = car.bubbleFlashUntil > now ? "rgba(255,255,255,0.95)" : "rgba(82,199,255,0.9)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(car.x, car.y, 43 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (car.anchorUntil > now) {
      betaDrawImageOrFallback(ctx, lastGearImages.anchorActive, car.x, car.y, 86, 86, () => {
        ctx.strokeStyle = "rgba(255,200,87,0.75)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(car.x, car.y, 48, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    if (car.antiMagnetUntil > now) {
      betaDrawImageOrFallback(ctx, lastGearImages.antiMagnetField, car.x, car.y, 220, 220, () => {
        ctx.strokeStyle = "rgba(82,199,255,0.46)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(car.x, car.y, lastGearItemTuning.antiMagnetRange * 0.62, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    if (car.overhaulUntil > now) {
      betaDrawImageOrFallback(ctx, lastGearImages.overhaulActive, car.x, car.y, 112, 112, () => {
        ctx.strokeStyle = "rgba(255,128,95,0.76)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(car.x, car.y, 58, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    if (car.reverseUntil > now) {
      betaDrawImageOrFallback(ctx, lastGearImages.reverseStatus, car.x, car.y - 54, 48, 48, () => {
        ctx.fillStyle = "#c084fc";
        ctx.font = "800 18px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("REV", car.x, car.y - 54);
      });
    }
    if (car.hitFlashUntil > now) {
      ctx.strokeStyle = "rgba(255,128,95,0.9)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(car.x, car.y, 38, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function drawLastGearCar(ctx, car) {
  if (car.eliminated || car.respawnAt) return;
  const now = lastGearLocalNow();
  const finalTwo = lastGearLiveCars().length <= 2;
  if (finalTwo) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.35 + Math.sin(performance.now() / 130) * 0.12;
    ctx.strokeStyle = car.player ? "rgba(82,199,255,0.85)" : "rgba(255,200,87,0.82)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(car.x, car.y, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  lastGearDrawTeamMarker(ctx, car);
  lastGearDrawRamAura(ctx, car);
  lastGearDrawSpecialAura(ctx, car);
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle + Math.PI / 2);
  if (car.overhaulUntil > now) ctx.scale(lastGearItemTuning.overhaulScale, lastGearItemTuning.overhaulScale);
  ctx.globalAlpha = car.invulnerableUntil > now
    ? 0.55 + Math.sin(performance.now() / 80) * 0.2
    : 1;
  if (gearbornDrawTopdownSprite(ctx, car.image, LAST_GEAR_SPRITE_BODY_LENGTH)) {
    if (lastGearState?.debug) gearbornDrawTopdownDebug(ctx, car.image, LAST_GEAR_SPRITE_BODY_LENGTH);
  } else {
    ctx.fillStyle = car.color;
    ctx.fillRect(-22, -32, 44, 64);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-13, -23, 26, 18);
  }
  ctx.restore();
  if (lastGearState?.debug && car.ai) {
    ctx.save();
    ctx.fillStyle = "rgba(8,12,20,0.74)";
    ctx.fillRect(car.x - 34, car.y - 62, 68, 16);
    ctx.fillStyle = "#ffc857";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(car.archetype || "AI", car.x, car.y - 54);
    ctx.restore();
  }
}

function updateLastGearHud(force = false) {
  if (!lastGearState) return;
  const player = lastGearPlayer();
  if (el.lastGearSpeed && player) el.lastGearSpeed.textContent = `${Math.round(Math.hypot(player.vx, player.vy) / 5.2)} MPH`;
  if (player) lastGearRenderRamMeter(player);
  if (el.lastGearItemName && player) {
    const statuses = [];
    const now = Math.max(0, lastGearLocalNow());
    if (player.bubbleUntil > now) statuses.push("Bubble");
    if (player.anchorUntil > now) statuses.push("Anchor");
    if (player.overhaulUntil > now) statuses.push("Overhaul");
    if (player.antiMagnetUntil > now) statuses.push("Anti-Magnet");
    if (player.ramJammedUntil > now) statuses.push("Ram jammed");
    const itemName = player.grapple?.state === "latched" ? "Grapple: YANK" : player.item?.name || "Empty";
    el.lastGearItemName.textContent = statuses.length ? `${itemName} · ${statuses.join(" · ")}` : itemName;
  }
  if (el.lastGearItemIcon && player) {
    const icon = player.item ? (lastGearItemImages[player.item.id] || betaItemImages[player.item.id]) : null;
    el.lastGearItemIcon.innerHTML = "";
    if (icon?.complete && icon.naturalWidth) {
      const clone = icon.cloneNode();
      clone.style.cssText = "width:28px;height:28px;object-fit:contain;display:block;";
      el.lastGearItemIcon.appendChild(clone);
    } else {
      el.lastGearItemIcon.textContent = player.item ? player.item.name.slice(0, 2).toUpperCase() : "?";
    }
  }
  const specialButtons = document.querySelectorAll("[data-last-gear-special]");
  if (specialButtons.length) {
    const localNow = performance.now() - (lastGearState.startedAt || performance.now());
    const remaining = Math.max(0, (player?.specialCooldownUntil || 0) - localNow);
    const ready = !player || remaining <= 0;
    const specialName = player ? lastGearSpecialFor(player).name.toUpperCase() : "SPECIAL";
    const label = remaining > 0 ? `${specialName} ${(remaining / 1000).toFixed(1)}s` : specialName;
    specialButtons.forEach((specialButton) => {
      specialButton.classList.toggle("special-ready", ready);
      specialButton.classList.toggle("special-cooling", !ready);
      if (specialButton.textContent !== label) specialButton.textContent = label;
    });
  }
  document.querySelectorAll(".last-gear-action-item").forEach((itemButton) => {
    const label = player?.item ? player.item.name : "Item";
    if (itemButton.textContent !== label) itemButton.textContent = label;
    itemButton.classList.toggle("has-item", Boolean(player?.item));
    itemButton.dataset.tier = player?.item ? lastGearItemTier(player.item.id) : "";
  });
  if (el.lastGearItemSlot) el.lastGearItemSlot.dataset.tier = player?.item ? lastGearItemTier(player.item.id) : "";
  const now = performance.now();
  if (!force && now - (lastGearState.statusRenderAt || 0) < 160) return;
  lastGearState.statusRenderAt = now;
  lastGearRenderCrewBar(force);
  if (el.lastGearStatusGrid) {
    const statusSignature = lastGearState.cars.map((car) => `${car.id}:${car.lives}:${car.eliminated ? 1 : 0}:${car.crewIndex ?? 0}:${car.name}`).join("|");
    if (force || statusSignature !== lastGearState.statusSignature) {
      lastGearState.statusSignature = statusSignature;
      el.lastGearStatusGrid.innerHTML = lastGearState.cars.map((car) => `
        <div class="last-gear-status-card ${car.player ? "player" : ""} ${car.team ? `team-${car.team}` : ""} ${car.eliminated ? "eliminated" : ""}" data-last-gear-status="${car.id}">
          ${lastGearCrewIconsMarkup(car)}
          <strong>${car.name}</strong>
          <span data-last-gear-damage>${Math.round(car.damage)}%</span>
        </div>
      `).join("");
    } else {
      lastGearState.cars.forEach((car) => {
        const damage = el.lastGearStatusGrid.querySelector(`[data-last-gear-status="${car.id}"] [data-last-gear-damage]`);
        if (damage) damage.textContent = `${Math.round(car.damage)}%`;
      });
    }
  }
}

function lastGearRenderRamMeter(player) {
  const meter = document.getElementById("last-gear-ram-meter");
  const label = document.getElementById("last-gear-ram-label");
  const fill = el.lastGearNitroFill;
  if (!meter || !fill || !player?.ram) return;
  const ram = player.ram;
  const p = player.physics;
  const now = lastGearLocalNow();
  const jammed = player.ramJammedUntil > now;
  const zone = lastGearRamZone(player);
  let width = 100;
  let text = "Charge Ram";
  if (jammed && ram.phase !== "dashing") {
    width = 0;
    text = "Ram jammed";
  } else if (zone === "building") {
    width = ram.charge * 78;
    text = "Charging";
  } else if (zone === "perfect") {
    width = 78 + ((ram.heldMs - p.ramFillMs) / p.ramPerfectMs) * 8;
    text = "Release!";
  } else if (zone === "overheat") {
    width = 86 + ((ram.heldMs - p.ramFillMs - p.ramPerfectMs) / p.ramOverheatMs) * 14;
    text = "Overheating";
  } else if (zone === "dashing") {
    width = 100;
    text = ram.perfect ? "Perfect ram" : "Ramming";
  } else if (zone === "burnout") {
    width = 0;
    text = "Burnout";
  } else if (zone === "recovering") {
    width = (1 - ram.recoverMs / ram.recoverTotalMs) * 100;
    text = "Recovering";
  }
  fill.style.width = `${lastGearClamp(width, 0, 100)}%`;
  const meterState = jammed && ram.phase !== "dashing" ? "jammed" : zone;
  if (meter.dataset.ramState !== meterState) meter.dataset.ramState = meterState;
  if (label && label.textContent !== text) label.textContent = text;
}

function updateLastGearTouchVisuals() {
  document.querySelectorAll(".last-gear-touch-controls").forEach((group) => {
    const leftActive = Boolean(lastGearKeys.left);
    const rightActive = Boolean(lastGearKeys.right);
    group.classList.toggle("steering-left", leftActive && !rightActive);
    group.classList.toggle("steering-right", rightActive && !leftActive);
    group.querySelectorAll("[data-last-gear-control]").forEach((button) => {
      button.classList.toggle("pressed", Boolean(lastGearKeys[button.dataset.lastGearControl]));
    });
    group.querySelectorAll("[data-last-gear-ram]").forEach((button) => {
      button.classList.toggle("pressed", Boolean(lastGearKeys.charge));
    });
  });
}

el.lastGearBetaStart?.addEventListener("click", () => toggleLastGearSetupPanel(true));
el.lastGearSetupStart?.addEventListener("click", () => {
  readLastGearSetupConfig();
  openLastGearCrewSelect();
});
el.lastGearBetaBack?.addEventListener("click", () => stopLastGearBeta(true));
el.lastGearFinishExit?.addEventListener("click", () => stopLastGearBeta(true));
el.lastGearRestart?.addEventListener("click", () => (lastGearIsEvoRush() ? openEvoRushPick(true) : startLastGearBeta()));

document.addEventListener("keydown", (event) => {
  if (!lastGearState || lastGearState.finished) return;
  if (typeof viewIsActive === "function" && !viewIsActive("last-gear")) return;
  if (typeof isTextEntryFocused === "function" && isTextEntryFocused()) return;
  const key = normalizeKey(event);
    if (key === "T") {
      event.preventDefault();
      lastGearState.debug = !lastGearState.debug;
      return;
    }
    if (key === "Q") {
      event.preventDefault();
      lastGearUseSpecial(lastGearPlayer());
      return;
    }
    if (lastGearKeyMap[key]) {
      event.preventDefault();
      lastGearKeys[lastGearKeyMap[key]] = true;
      updateLastGearTouchVisuals();
      return;
    }
    if (key === "Space" || key === "E") {
      event.preventDefault();
      lastGearUseItem(lastGearPlayer());
      return;
    }
});

document.addEventListener("keyup", (event) => {
  const key = normalizeKey(event);
  if (lastGearKeyMap[key]) {
    lastGearKeys[lastGearKeyMap[key]] = false;
    updateLastGearTouchVisuals();
  }
});

document.querySelectorAll("[data-last-gear-control]").forEach((button) => {
  const direction = button.dataset.lastGearControl;
  const press = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    lastGearKeys[direction] = true;
    updateLastGearTouchVisuals();
  };
  const release = (event) => {
    event.preventDefault();
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    lastGearKeys[direction] = false;
    updateLastGearTouchVisuals();
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", (event) => {
    if (button.hasPointerCapture?.(event.pointerId)) return;
    lastGearKeys[direction] = false;
    updateLastGearTouchVisuals();
  });
});

document.querySelectorAll("[data-last-gear-ram]").forEach((button) => {
  const press = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    lastGearKeys.charge = true;
    updateLastGearTouchVisuals();
  };
  const release = (event) => {
    event.preventDefault();
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    lastGearKeys.charge = false;
    updateLastGearTouchVisuals();
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", (event) => {
    if (button.hasPointerCapture?.(event.pointerId)) return;
    lastGearKeys.charge = false;
    updateLastGearTouchVisuals();
  });
});

window.addEventListener("blur", () => {
  Object.keys(lastGearKeys).forEach((key) => { lastGearKeys[key] = false; });
  if (typeof lastGearReleaseStick === "function") lastGearReleaseStick();
  updateLastGearTouchVisuals();
});

document.querySelectorAll("[data-last-gear-special]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    lastGearUseSpecial(lastGearPlayer());
  });
});

document.querySelectorAll("[data-last-gear-item-button]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    lastGearUseItem(lastGearPlayer());
  });
});

window.addEventListener("resize", resizeLastGearBeta);
screen.orientation?.addEventListener?.("change", resizeLastGearBeta);

// -- Last Gear controls: drive stick, gamepad, layout setting ----------------
// Drive stick = point-to-drive: push toward where you want to go. The car turns
// toward that direction and throttles by how far you push. Point behind you and
// it brakes, then swings around. Keyboard WASD stays tank-style (Classic).
const LAST_GEAR_CONTROLS_STORAGE_KEY = "gearbornLastGearControls";
const lastGearStickTuning = {
  radiusPx: 56,
  deadZone: 0.22,
  fullThrottleAt: 0.8,
  fullSteerAngle: 0.35,
  throttleAngle: 1.9,
  brakeAngle: 2.3,
  brakeSpeed: 140,
  turnaroundThrottle: 0.55,
  dodgeSteer: 0.35,
  gamepadDeadZone: 0.2
};
const lastGearStick = { active: false, x: 0, y: 0, pointerId: null, originX: 0, originY: 0 };
const lastGearGamepad = { connected: false, x: 0, y: 0, charge: false, prev: [] };
const lastGearSetupControlsSelect = document.getElementById("last-gear-setup-controls");

function lastGearControlsLayout() {
  try {
    return localStorage.getItem(LAST_GEAR_CONTROLS_STORAGE_KEY) === "classic" ? "classic" : "stick";
  } catch (error) {
    return "stick";
  }
}

function lastGearSetControlsLayout(layout) {
  const next = layout === "classic" ? "classic" : "stick";
  try {
    localStorage.setItem(LAST_GEAR_CONTROLS_STORAGE_KEY, next);
  } catch (error) {
    // Storage blocked (private mode): the choice lasts for this page only.
  }
  lastGearApplyControlsLayout(next);
}

function lastGearApplyControlsLayout(layout = lastGearControlsLayout()) {
  document.querySelectorAll(".last-gear-touch-controls").forEach((group) => {
    group.dataset.layout = layout;
  });
  if (el.lastGearBeta) el.lastGearBeta.dataset.controlsLayout = layout;
  document.querySelectorAll("[data-last-gear-layout-toggle]").forEach((button) => {
    button.textContent = layout === "classic" ? "Switch to stick" : "Switch to classic";
  });
  if (lastGearSetupControlsSelect && lastGearSetupControlsSelect.value !== layout) lastGearSetupControlsSelect.value = layout;
  lastGearReleaseStick();
  ["up", "down", "left", "right", "charge"].forEach((key) => { lastGearKeys[key] = false; });
  updateLastGearTouchVisuals();
  if (lastGearState && typeof resizeLastGearBeta === "function") resizeLastGearBeta();
}

function lastGearStickControls(car, x, y) {
  const T = lastGearStickTuning;
  const mag = Math.min(1, Math.hypot(x, y));
  if (mag < T.deadZone) return null;
  const delta = betaNormalizeAngle(Math.atan2(y, x) - car.angle);
  const steer = lastGearClamp(delta / T.fullSteerAngle, -1, 1);
  const speed = Math.hypot(car.vx, car.vy);
  const behind = Math.abs(delta) > T.brakeAngle;
  const push = lastGearClamp((mag - T.deadZone) / (T.fullThrottleAt - T.deadZone), 0, 1);
  return {
    up: behind ? speed < T.brakeSpeed : Math.abs(delta) < T.throttleAngle,
    down: behind && speed >= T.brakeSpeed,
    left: steer < -T.dodgeSteer,
    right: steer > T.dodgeSteer,
    steer,
    throttle: behind ? push * T.turnaroundThrottle : push
  };
}

function lastGearPollGamepad() {
  const pads = typeof navigator !== "undefined" && navigator.getGamepads ? navigator.getGamepads() : [];
  const pad = Array.from(pads || []).find((entry) => entry && entry.connected);
  if (!pad) {
    lastGearGamepad.connected = false;
    lastGearGamepad.x = 0;
    lastGearGamepad.y = 0;
    lastGearGamepad.charge = false;
    lastGearGamepad.prev = [];
    return;
  }
  const pressed = (index) => Boolean(pad.buttons[index]?.pressed);
  const wasPressed = (index) => Boolean(lastGearGamepad.prev[index]);
  let x = pad.axes[0] || 0;
  let y = pad.axes[1] || 0;
  if (Math.hypot(x, y) < lastGearStickTuning.gamepadDeadZone) {
    x = (pressed(15) ? 1 : 0) - (pressed(14) ? 1 : 0);
    y = (pressed(13) ? 1 : 0) - (pressed(12) ? 1 : 0);
  }
  lastGearGamepad.connected = true;
  lastGearGamepad.x = x;
  lastGearGamepad.y = y;
  lastGearGamepad.charge = pressed(0) || pressed(7);
  const player = lastGearPlayer();
  if (player && !lastGearState?.finished) {
    if ((pressed(1) && !wasPressed(1)) || (pressed(4) && !wasPressed(4))) lastGearUseSpecial(player);
    if ((pressed(2) && !wasPressed(2)) || (pressed(5) && !wasPressed(5))) lastGearUseItem(player);
    if (pressed(3) && !wasPressed(3)) lastGearCycleNextUp();
  }
  lastGearGamepad.prev = pad.buttons.map((button) => Boolean(button?.pressed));
}

function lastGearPlayerControls(car) {
  lastGearPollGamepad();
  const charge = lastGearInput("charge") || lastGearGamepad.charge;
  const keyboardDriving = lastGearInput("up") || lastGearInput("down") || lastGearInput("left") || lastGearInput("right");
  if (!keyboardDriving) {
    const source = lastGearStick.active
      ? lastGearStick
      : lastGearGamepad.connected && Math.hypot(lastGearGamepad.x, lastGearGamepad.y) >= lastGearStickTuning.gamepadDeadZone
        ? lastGearGamepad
        : null;
    const stickControls = source ? lastGearStickControls(car, source.x, source.y) : null;
    if (stickControls) return { ...stickControls, charge };
    if (source) return { up: false, down: false, left: false, right: false, charge };
  }
  return {
    up: lastGearInput("up"),
    down: lastGearInput("down"),
    left: lastGearInput("left"),
    right: lastGearInput("right"),
    charge
  };
}

function lastGearRenderStick() {
  const R = lastGearStickTuning.radiusPx;
  document.querySelectorAll("[data-last-gear-drive-pad]").forEach((pad) => {
    const knob = pad.querySelector(".last-gear-drive-knob");
    pad.classList.toggle("active", lastGearStick.active);
    if (knob) knob.style.transform = `translate(calc(-50% + ${(lastGearStick.x * R).toFixed(1)}px), calc(-50% + ${(lastGearStick.y * R).toFixed(1)}px))`;
  });
}

function lastGearReleaseStick() {
  lastGearStick.active = false;
  lastGearStick.pointerId = null;
  lastGearStick.x = 0;
  lastGearStick.y = 0;
  lastGearRenderStick();
}

document.querySelectorAll("[data-last-gear-drive-pad]").forEach((pad) => {
  const R = lastGearStickTuning.radiusPx;
  const move = (event) => {
    let dx = event.clientX - lastGearStick.originX;
    let dy = event.clientY - lastGearStick.originY;
    const dist = Math.hypot(dx, dy);
    if (dist > R) {
      // Floating stick: the origin trails the finger so reversing direction is instant.
      lastGearStick.originX += (dx / dist) * (dist - R);
      lastGearStick.originY += (dy / dist) * (dist - R);
      dx = (dx / dist) * R;
      dy = (dy / dist) * R;
    }
    lastGearStick.x = dx / R;
    lastGearStick.y = dy / R;
    lastGearRenderStick();
  };
  pad.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    pad.setPointerCapture?.(event.pointerId);
    lastGearStick.active = true;
    lastGearStick.pointerId = event.pointerId;
    lastGearStick.originX = event.clientX;
    lastGearStick.originY = event.clientY;
    lastGearStick.x = 0;
    lastGearStick.y = 0;
    lastGearRenderStick();
  });
  pad.addEventListener("pointermove", (event) => {
    if (!lastGearStick.active || event.pointerId !== lastGearStick.pointerId) return;
    event.preventDefault();
    move(event);
  });
  const end = (event) => {
    if (event.pointerId !== lastGearStick.pointerId) return;
    if (pad.hasPointerCapture?.(event.pointerId)) pad.releasePointerCapture(event.pointerId);
    lastGearReleaseStick();
  };
  pad.addEventListener("pointerup", end);
  pad.addEventListener("pointercancel", end);
});

document.querySelectorAll("[data-last-gear-layout-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    lastGearSetControlsLayout(lastGearControlsLayout() === "classic" ? "stick" : "classic");
  });
});

lastGearSetupControlsSelect?.addEventListener("change", () => lastGearSetControlsLayout(lastGearSetupControlsSelect.value));
lastGearApplyControlsLayout();

// -- Crews and swap pads -----------------------------------------------------
const lastGearCrewTuning = { padRadius: 52, padHoldMs: 650, padMaxSpeed: 150, swapCooldownMs: 6000, swapInvulnerableMs: 900, padDistance: { circle: 0.34, square: 0.34, donut: 0.45, bridge: 0.34 }, aiSwapDamage: 85, aiSwapMargin: 45 };
const lastGearCrewExcludedIds = ["rainbowlt", "hornula1"];

function lastGearCrewSize() { return lastGearClamp(Number(lastGearCurrentSettings().lives || 3), 1, 5); }
function lastGearCarClass(carId) { return (typeof classForLineId === "function" && classForLineId(carId)) || "E"; }
function lastGearRatingTotal(ratings) { return ["speed", "acceleration", "handling", "torque", "body", "powertrain"].reduce((sum, key) => sum + (ratings?.[key] || 70), 0); }

function lastGearCrewCandidate(carId, options = {}) {
  const car = cars.find((item) => item.id === carId);
  if (!car?.evolutions?.length) return null;
  let form;
  let ratings;
  if (options.loaner) {
    const evolution = lastGearClamp(options.evolution || 0, 0, car.evolutions.length - 1);
    form = car.evolutions[evolution];
    ratings = betaRatingsForCar(carId, options.level || 1, evolution, false);
  } else if (options.player) {
    form = currentEvolution(carId);
    ratings = lastGearRatingsFor(carId, true);
  } else {
    form = car.evolutions[state.garage?.[carId]?.evolution || 0] || car.evolutions[0];
    ratings = lastGearRatingsFor(carId, false);
  }
  const topdown = imageFor(form, "topdown");
  if (!topdown) return null;
  return { carId, name: form.name, color: car.color || (options.player ? "#52c7ff" : "#ff805f"), topdown, image: null, displayImage: imageFor(form, "display") || topdown, ratings, physics: lastGearPhysics(ratings), specialLineId: evolutionLineRootForCar(carId), carClass: lastGearCarClass(carId), damage: 0, out: false, loaner: Boolean(options.loaner) };
}

function lastGearCrewSimilarity(lead) {
  const leadTotal = lastGearRatingTotal(lead.ratings);
  return (member) => (member.carClass === lead.carClass ? 0 : 1000) + Math.abs(lastGearRatingTotal(member.ratings) - leadTotal);
}

function lastGearBuildPlayerCrew(leadId, size) {
  const picks = lastGearSavedCrew(size);
  if (picks[0] !== leadId) {
    const existing = picks.indexOf(leadId);
    if (existing > 0) picks[existing] = picks[0];
    picks[0] = leadId;
  }
  return lastGearCrewFillPlan(picks, size).filter(Boolean);
}

function lastGearBuildAiCrew(leadId, size, used) {
  const lead = lastGearCrewCandidate(leadId);
  if (!lead) return [];
  const crew = [lead];
  if (size <= 1) return crew;
  const pool = cars.filter((car) => car.id !== leadId && !lastGearCrewExcludedIds.includes(car.id) && !car.tutorialOnly).map((car) => lastGearCrewCandidate(car.id)).filter(Boolean).sort(() => Math.random() - 0.5);
  const sameClass = pool.filter((member) => member.carClass === lead.carClass);
  const ordered = [...sameClass.filter((member) => !used.has(member.carId)), ...pool.filter((member) => member.carClass !== lead.carClass && !used.has(member.carId)), ...pool.filter((member) => used.has(member.carId))];
  ordered.slice(0, size - 1).forEach((member) => { used.add(member.carId); crew.push(member); });
  return crew;
}

function lastGearAttachCrews(racers, size) {
  const used = new Set(racers.map((racer) => racer.carId));
  racers.forEach((racer) => {
    const crew = racer.player ? lastGearBuildPlayerCrew(racer.carId, size) : lastGearBuildAiCrew(racer.carId, size, used);
    if (!crew.length) { racer.crew = null; racer.lives = size; return; }
    crew[0].image = racer.image;
    crew.slice(1).forEach((member) => { member.image = betaMakeImage(member.topdown, { measure: true }); });
    racer.crew = crew;
    racer.crewIndex = 0;
    racer.pendingCrewIndex = null;
    racer.lives = crew.length;
    racer.swapCooldownUntil = 0;
    racer.swapProgress = 0;
    racer.nextUp = lastGearDefaultNextUp(racer);
  });
}

function lastGearBenchIndexes(racer) { return racer?.crew ? racer.crew.map((member, index) => index).filter((index) => index !== racer.crewIndex && !racer.crew[index].out) : []; }
function lastGearDefaultNextUp(racer) { const bench = lastGearBenchIndexes(racer); return bench.length ? bench.sort((a, b) => racer.crew[a].damage - racer.crew[b].damage)[0] : -1; }
function lastGearResolveNextUp(racer) { const bench = lastGearBenchIndexes(racer); if (bench.includes(racer.nextUp)) return racer.nextUp; racer.nextUp = lastGearDefaultNextUp(racer); return racer.nextUp; }
function lastGearSetNextUp(index) { const player = lastGearPlayer(); if (!player?.crew || !lastGearBenchIndexes(player).includes(index)) return; player.nextUp = index; updateLastGearHud(true); }
function lastGearCycleNextUp() { const player = lastGearPlayer(); const bench = lastGearBenchIndexes(player); if (!bench.length) return; const at = bench.indexOf(player.nextUp); lastGearSetNextUp(bench[(at + 1) % bench.length]); }

function lastGearLoadCrewMember(racer, index) {
  const member = racer.crew?.[index];
  if (!member) return;
  Object.assign(racer, { carId: member.carId, name: member.name, color: member.color, image: member.image, displayImage: member.displayImage, ratings: member.ratings, physics: member.physics, specialLineId: member.specialLineId, damage: member.damage, crewIndex: index, ram: lastGearMakeRamState() });
}

function lastGearSwapPads(now = lastGearLocalNow()) { const distance = lastGearActiveRadius(now) * (lastGearCrewTuning.padDistance[lastGearShape()] || 0.34); return [{ id: "west", x: lastGearArena.cx - distance, y: lastGearArena.cy }, { id: "east", x: lastGearArena.cx + distance, y: lastGearArena.cy }]; }
function lastGearNearestSwapPad(car) { return lastGearSwapPads().sort((a, b) => Math.hypot(a.x - car.x, a.y - car.y) - Math.hypot(b.x - car.x, b.y - car.y))[0]; }

function lastGearSwapCrew(car, index, now) {
  const T = lastGearCrewTuning;
  car.crew[car.crewIndex].damage = car.damage;
  lastGearLoadCrewMember(car, index);
  car.nextUp = lastGearDefaultNextUp(car);
  car.swapProgress = 0;
  car.swapCooldownUntil = now + T.swapCooldownMs;
  car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + T.swapInvulnerableMs);
  car.vx *= 0.3; car.vy *= 0.3;
  for (let i = 0; i < 10; i += 1) lastGearSpawnParticle("spark", car.x, car.y, (Math.PI * 2 * i) / 10, 140 + Math.random() * 80, 320, 6 + Math.random() * 4, "#3ee6c1");
  if (car.player) { lastGearState.stats.swaps = (lastGearState.stats.swaps || 0) + 1; lastGearState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -28, ttl: 650, life: 650, text: "SWAP!", size: 26, tint: "#3ee6c1", angle: 0, spin: 0 }); lastGearAnnounce("swap", { cooldown: 5000 }); }
}

function lastGearUpdateSwapPads(dt, now) {
  if (lastGearCrewSize() <= 1) return;
  const T = lastGearCrewTuning;
  const pads = lastGearSwapPads(now);
  lastGearLiveCars().forEach((car) => {
    if (car.respawnAt || !car.crew) return;
    const onPad = pads.find((pad) => Math.hypot(pad.x - car.x, pad.y - car.y) < T.padRadius);
    const next = lastGearResolveNextUp(car);
    const ready = (car.swapCooldownUntil || 0) <= now && next >= 0 && car.ram?.phase !== "dashing";
    if (onPad && ready && Math.hypot(car.vx, car.vy) < T.padMaxSpeed) { car.swapProgress = (car.swapProgress || 0) + dt * 1000; car.swapPadId = onPad.id; if (car.swapProgress >= T.padHoldMs) lastGearSwapCrew(car, next, now); }
    else { car.swapProgress = 0; car.swapPadId = null; }
  });
}

function lastGearAiSwapTarget(car) { const T = lastGearCrewTuning; if (lastGearCrewSize() <= 1 || !car.crew || (car.swapCooldownUntil || 0) > lastGearLocalNow() || car.damage < T.aiSwapDamage) return null; const next = lastGearResolveNextUp(car); return next < 0 || car.crew[next].damage > car.damage - T.aiSwapMargin ? null : lastGearNearestSwapPad(car); }

function lastGearDrawSwapPads(ctx) {
  if (!lastGearState || lastGearCrewSize() <= 1) return;
  const T = lastGearCrewTuning, player = lastGearPlayer(), now = lastGearLocalNow(), ready = player && !player.eliminated && (player.swapCooldownUntil || 0) <= now && lastGearBenchIndexes(player).length > 0, spin = performance.now() / 900;
  lastGearSwapPads(now).forEach((pad) => { ctx.save(); ctx.translate(pad.x, pad.y); ctx.globalAlpha = ready ? 1 : 0.45; ctx.fillStyle = "rgba(10, 40, 38, 0.82)"; ctx.beginPath(); ctx.arc(0, 0, T.padRadius, 0, Math.PI * 2); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = "#3ee6c1"; ctx.setLineDash([14, 10]); ctx.rotate(spin); ctx.beginPath(); ctx.arc(0, 0, T.padRadius - 4, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.rotate(-spin); if (player?.swapPadId === pad.id && player.swapProgress > 0) { ctx.lineWidth = 8; ctx.strokeStyle = "#e9fffa"; ctx.beginPath(); ctx.arc(0, 0, T.padRadius + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, player.swapProgress / T.padHoldMs)); ctx.stroke(); } ctx.fillStyle = "#3ee6c1"; ctx.font = "900 15px 'Space Grotesk', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("SWAP", 0, 0); ctx.restore(); });
}

function lastGearCrewIconsMarkup(car) { if (!car.crew) return `<div class="last-gear-lives">${Array.from({ length: Math.max(0, car.lives) }, () => `<img src="${car.displayImage}" alt="" loading="lazy" decoding="async" onerror="this.style.visibility='hidden';">`).join("")}</div>`; return `<div class="last-gear-lives last-gear-crew-icons">${car.crew.map((member, index) => `<img class="${["last-gear-crew-icon", index === car.crewIndex ? "active" : "", member.out ? "out" : ""].join(" ")}" src="${member.displayImage}" alt="" loading="lazy" decoding="async" onerror="this.style.visibility='hidden';">`).join("")}</div>`; }

function lastGearRenderCrewBar(force = false) {
  const bar = document.getElementById("last-gear-crew-bar"), player = lastGearPlayer();
  if (!bar) return;
  if (!player?.crew || player.crew.length <= 1) { if (!bar.hidden) bar.hidden = true; return; }
  bar.hidden = false;
  const now = lastGearLocalNow(), signature = `${player.crewIndex}:${player.nextUp}:${player.crew.map((member) => member.out ? 1 : 0).join("")}`;
  if (force || bar.dataset.signature !== signature) { bar.dataset.signature = signature; bar.innerHTML = player.crew.map((member, index) => { const driving = index === player.crewIndex && !member.out, next = index === player.nextUp && !member.out, tag = member.out ? "Out" : driving ? "Driving" : next ? "Next up" : `Bench ${index + 1}`, classes = ["last-gear-crew-slot", driving ? "driving" : "", next ? "next" : "", member.out ? "out" : "", member.loaner ? "loaner" : ""].join(" "), pickable = !member.out && !driving; return `<button class="${classes}" type="button" data-last-gear-crew-pick="${index}" ${pickable ? "" : "disabled"} aria-label="${member.name}: ${tag}"><img src="${member.displayImage}" alt="" loading="lazy" decoding="async" onerror="this.style.visibility='hidden';"><span class="last-gear-crew-name">${member.name}${member.loaner ? " <em>Loaner</em>" : ""}</span><span class="last-gear-crew-tag">${tag}</span><strong data-last-gear-crew-damage="${index}">${Math.round(driving ? player.damage : member.damage)}%</strong></button>`; }).join(""); } else player.crew.forEach((member, index) => { const damage = bar.querySelector(`[data-last-gear-crew-damage="${index}"]`); if (damage) damage.textContent = `${Math.round(index === player.crewIndex ? player.damage : member.damage)}%`; });
  bar.classList.toggle("swap-cooling", Math.max(0, (player.swapCooldownUntil || 0) - now) > 0);
}

document.getElementById("last-gear-crew-bar")?.addEventListener("click", (event) => { const button = event.target.closest("[data-last-gear-crew-pick]"); if (!button || button.disabled) return; lastGearSetNextUp(Number(button.dataset.lastGearCrewPick)); });
document.addEventListener("keydown", (event) => { if (!lastGearState || lastGearState.finished || (typeof viewIsActive === "function" && !viewIsActive("last-gear")) || (typeof isTextEntryFocused === "function" && isTextEntryFocused())) return; const digit = Number(event.key); if (Number.isInteger(digit) && digit >= 1 && digit <= 5) { event.preventDefault(); lastGearSetNextUp(digit - 1); } });

// -- Crew select screen ------------------------------------------------------
function lastGearSavedCrew(size = lastGearCrewSize()) {
  const raw = Array.isArray(state.lastGearCrew) ? state.lastGearCrew : [], seen = new Set(), picks = [];
  for (let slot = 0; slot < size; slot += 1) { const carId = raw[slot], valid = Boolean(carId) && isSelectablePlayerCar(carId) && !seen.has(carId); picks.push(valid ? carId : null); if (valid) seen.add(carId); }
  if (!picks[0]) { const firstPicked = picks.findIndex(Boolean); if (firstPicked > 0) { picks[0] = picks[firstPicked]; picks[firstPicked] = null; } else { const fallback = isSelectablePlayerCar(state.lastGearSelectedCar) ? state.lastGearSelectedCar : selectedCarIdForMode("beta"); if (fallback && isSelectablePlayerCar(fallback)) picks[0] = fallback; } }
  return picks;
}
function lastGearStoreCrew(picks) { const stored = Array.isArray(state.lastGearCrew) ? state.lastGearCrew.slice(0, 5) : []; picks.forEach((carId, slot) => { stored[slot] = carId || null; }); while (stored.length < 5) stored.push(null); state.lastGearCrew = stored.slice(0, 5); if (picks[0]) state.lastGearSelectedCar = picks[0]; if (typeof saveState === "function") saveState(); }
function lastGearCrewFillPlan(picks, size) {
  const lead = picks[0] ? lastGearCrewCandidate(picks[0], { player: true }) : null, plan = Array.from({ length: size }, (_, slot) => slot === 0 ? lead : picks[slot] ? lastGearCrewCandidate(picks[slot], { player: true }) : null);
  if (!lead) return plan;
  const similarity = lastGearCrewSimilarity(lead), taken = new Set(picks.filter(Boolean));
  const owned = selectablePlayerCars().filter((car) => !taken.has(car.id) && !lastGearCrewExcludedIds.includes(car.id)).map((car) => lastGearCrewCandidate(car.id, { player: true })).filter(Boolean).sort((a, b) => similarity(a) - similarity(b));
  let loaners = null;
  for (let slot = 1; slot < size; slot += 1) if (!plan[slot]) { let member = owned.find((candidate) => !taken.has(candidate.carId)); if (!member) { if (!loaners) { const progress = state.garage?.[lead.carId] || {}; loaners = cars.filter((car) => !lastGearCrewExcludedIds.includes(car.id) && !car.tutorialOnly && !(typeof isFusionLine === "function" && isFusionLine(car.id))).map((car) => lastGearCrewCandidate(car.id, { loaner: true, level: progress.level || 1, evolution: progress.evolution || 0 })).filter(Boolean).sort((a, b) => similarity(a) - similarity(b)); } member = loaners.find((candidate) => !taken.has(candidate.carId)); } if (member) { member.autoFilled = true; plan[slot] = member; taken.add(member.carId); } }
  return plan;
}
function lastGearSetCrewSlot(slot, carId) { const picks = lastGearSavedCrew(); picks[slot] = carId || null; lastGearStoreCrew(picks); renderLastGearCrewSelect(); }
function lastGearAutoFillCrew() { const size = lastGearCrewSize(), picks = lastGearSavedCrew(size), plan = lastGearCrewFillPlan(picks, size); plan.forEach((member, slot) => { if (!picks[slot] && member && !member.loaner) picks[slot] = member.carId; }); lastGearStoreCrew(picks); renderLastGearCrewSelect(); }
function openLastGearCrewSlotPicker(slot) { const picks = lastGearSavedCrew(), others = picks.filter((carId, index) => carId && index !== slot); openCarPicker({ target: "lastgear-crew", title: slot === 0 ? "Choose who starts" : `Choose crew car ${slot + 1}`, selectedCarId: picks[slot] || "", filter: (carId) => !others.includes(carId), onConfirm: (carId) => lastGearSetCrewSlot(slot, carId) }); }
function openLastGearCrewSelect() { if (typeof viewIsActive === "function" && !viewIsActive("last-gear")) showView("last-gear"); if (el.lastGearBeta) el.lastGearBeta.hidden = true; const screen = document.getElementById("last-gear-crew-select"); if (screen) screen.hidden = false; renderLastGearCrewSelect(); window.scrollTo?.({ top: 0 }); }
function closeLastGearCrewSelect() { const screen = document.getElementById("last-gear-crew-select"); if (screen) screen.hidden = true; showView("beta"); if (typeof openBetaPrototypeIntro === "function") openBetaPrototypeIntro(); toggleLastGearSetupPanel(true); }
function renderLastGearCrewSelect() {
  const slotsEl = document.getElementById("last-gear-crew-select-slots"); if (!slotsEl) return;
  const size = lastGearCrewSize(), picks = lastGearSavedCrew(size), plan = lastGearCrewFillPlan(picks, size), settings = lastGearCurrentSettings();
  document.querySelectorAll("[data-last-gear-crew-size]").forEach((button) => button.classList.toggle("active", Number(button.dataset.lastGearCrewSize) === size));
  const summary = document.getElementById("last-gear-crew-select-summary"); if (summary) summary.textContent = `${size === 1 ? "Solo car" : `Crew of ${size}`} · ${el.lastGearSetupArena?.selectedOptions?.[0]?.textContent || settings.arena} · ${lastGearFormatLabel()} · ${settings.aiDifficulty} AI`;
  slotsEl.dataset.size = String(size);
  slotsEl.innerHTML = plan.map((member, slot) => { const pickedId = picks[slot], kicker = slot === 0 ? "Starts" : `Bench ${slot + 1}`, type = member ? (gearbornStatProfiles[member.carId]?.type || "Neutral") : "", level = pickedId ? (state.garage?.[pickedId]?.level || 1) : null, meta = member ? `${member.carClass}-Class · ${type}${level ? ` · Lv ${level}` : ""}` : "", stats = pickedId ? (displayedGearbornStats(pickedId) || member?.ratings || {}) : (member?.ratings || {}), autoNote = !pickedId && member ? `<span class="last-gear-crew-select-auto">Auto: ${escapeHtml(member.name)}${member.loaner ? " <em>Loaner</em>" : ""}</span>` : ""; return `<article class="convoy-stage-side convoy-stage-side-player last-gear-crew-select-card ${pickedId ? "picked" : "auto"}"><span class="convoy-stage-side-kicker">${kicker}</span><button class="convoy-stage-car-display convoy-stage-car-picker-button ${pickedId ? "filled" : "empty"}" type="button" data-last-gear-crew-slot="${slot}">${pickedId ? `<img src="${imageFor(currentEvolution(pickedId), "display")}" alt="${escapeHtml(member?.name || "")}">` : `<div class="convoy-stage-car-picker-plus"><span class="convoy-stage-car-picker-plus-icon">+</span><span class="convoy-stage-car-picker-plus-label">Choose Car</span></div>`}</button><strong class="convoy-stage-car-name">${pickedId && member ? escapeHtml(member.name) : "—"}</strong>${autoNote}${meta && pickedId ? `<span class="last-gear-crew-select-meta">${meta}</span>` : ""}<div class="convoy-stage-stats ${pickedId ? "" : "last-gear-crew-select-ghost-stats"}">${renderConvoyStatBars(stats)}</div>${pickedId && slot > 0 ? `<button class="ghost last-gear-crew-select-clear" type="button" data-last-gear-crew-clear="${slot}">Remove</button>` : ""}</article>`; }).join("");
  const autoFill = document.getElementById("last-gear-crew-autofill"); if (autoFill) autoFill.disabled = picks.filter((carId, slot) => slot > 0 && !carId).length === 0;
  const start = document.getElementById("last-gear-crew-start"); if (start) start.disabled = !picks[0];
}
document.getElementById("last-gear-crew-select")?.addEventListener("click", (event) => { const slotButton = event.target.closest("[data-last-gear-crew-slot]"); if (slotButton) { openLastGearCrewSlotPicker(Number(slotButton.dataset.lastGearCrewSlot)); return; } const clearButton = event.target.closest("[data-last-gear-crew-clear]"); if (clearButton) { lastGearSetCrewSlot(Number(clearButton.dataset.lastGearCrewClear), null); return; } const sizeButton = event.target.closest("[data-last-gear-crew-size]"); if (sizeButton) { if (el.lastGearSetupLives) el.lastGearSetupLives.value = sizeButton.dataset.lastGearCrewSize; readLastGearSetupConfig(); renderLastGearCrewSelect(); } });
document.getElementById("last-gear-crew-back")?.addEventListener("click", closeLastGearCrewSelect);
document.getElementById("last-gear-crew-autofill")?.addEventListener("click", lastGearAutoFillCrew);
document.getElementById("last-gear-crew-start")?.addEventListener("click", () => { const picks = lastGearSavedCrew(); if (!picks[0]) return; lastGearStoreCrew(picks); startLastGearBeta(); });
document.getElementById("last-gear-edit-crew")?.addEventListener("click", () => { stopLastGearBeta(false); openLastGearCrewSelect(); });

// -- Type specials -----------------------------------------------------------------
// One special per GearBorn Type. lastGearLineSpecials is the hook for car-specific
// specials later: { [evolutionLineRoot]: { name, cooldown, effect, tint } }.
const lastGearTypeSpecials = {
  Agility: { name: "Blink Hop", cooldown: 4000, effect: "dash", tint: "#6ee7a8", description: "Forward hop with a moment of invulnerability." },
  Power: { name: "Shockwave Slam", cooldown: 6000, effect: "frontslam", tint: "#ff805f", description: "Heavy hit to anything right in front of you." },
  Endurance: { name: "Iron Wall", cooldown: 8000, effect: "ironWall", tint: "#b7c1d1", description: "Brace for 2.2 s: half damage, barely any knockback." },
  Tech: { name: "EMP Snare", cooldown: 6500, effect: "snare", tint: "#c084fc", description: "Close-range pulse that jams nearby Rams and cancels charges." },
  Transmission: { name: "Overdrive", cooldown: 8000, effect: "overdrive", tint: "#ffc857", description: "Ram ready now, and your next Ram is a guaranteed full Perfect." },
  Grip: { name: "Tail Whip", cooldown: 5500, effect: "whip", tint: "#52c7ff", description: "Spin the tail and sweep everyone around you sideways." },
  Neutral: { name: "Side Shunt", cooldown: 4500, effect: "shunt", tint: "#f4f7fb", description: "Shove cars off both flanks." }
};
const lastGearLineSpecials = {};
const lastGearSpecialTuning = {
  hopImpulse: 300,
  hopInvulnerableMs: 550,
  slamReach: 100,
  slamImpact: 260,
  ironWallMs: 2200,
  ironWallDamage: 0.5,
  ironWallKnock: 0.3,
  snareRadius: 160,
  snareImpact: 70,
  snareJamMs: 2200,
  overdriveMs: 3000,
  whipRadius: 120,
  whipImpact: 170,
  shuntReach: 90,
  shuntImpact: 180
};
const lastGearTypeCache = new Map();

function lastGearTypeFor(carId) {
  if (!carId) return "Neutral";
  if (lastGearTypeCache.has(carId)) return lastGearTypeCache.get(carId);
  let type = gearbornStatProfiles?.[carId]?.type || "";
  if (!type) {
    const car = cars.find((item) => item.id === carId);
    const entry = car && vindexEntries.find((item) => item.name === car.evolutions?.[0]?.name);
    const types = entry && typeof getVindexTypes === "function" ? getVindexTypes(entry) : [];
    type = types?.[0] || "Neutral";
  }
  if (!lastGearTypeSpecials[type]) type = "Neutral";
  lastGearTypeCache.set(carId, type);
  return type;
}

function lastGearSpecialRing(car, radius, tint, ttl = 420) {
  lastGearState.effects.push({ kind: "ring", x: car.x, y: car.y, vx: 0, vy: 0, angle: 0, spin: 0, ttl, life: ttl, size: radius, tint });
}

function lastGearAiShouldUseSpecial(car, target, nearEdge, aggression) {
  if (lastGearLocalNow() < (car.specialCooldownUntil || 0)) return false;
  const special = lastGearSpecialFor(car);
  const distance = target?.id ? Math.hypot(target.x - car.x, target.y - car.y) : Infinity;
  const near = (radius) => lastGearLiveCars().some((other) => lastGearAreFoes(car, other) && !other.respawnAt && Math.hypot(other.x - car.x, other.y - car.y) < radius);
  const roll = (chance) => Math.random() < chance * aggression;
  if (special.effect === "ironWall") {
    const threatened = lastGearLiveCars().some((other) => lastGearAreFoes(car, other) && ["dashing", "charging"].includes(other.ram?.phase) && Math.hypot(other.x - car.x, other.y - car.y) < 260);
    return (threatened || (nearEdge && car.damage > 60)) && roll(0.08);
  }
  if (special.effect === "overdrive") return car.ram?.phase === "recovering" && distance < 500 && roll(0.02);
  if (special.effect === "snare") return near(lastGearSpecialTuning.snareRadius - 10) && roll(0.03);
  if (special.effect === "whip") return near(lastGearSpecialTuning.whipRadius) && roll(0.03);
  if (special.effect === "dash") return !nearEdge && distance < 260 && roll(0.012);
  return !nearEdge && distance < 190 && roll(0.011);
}

function lastGearDrawSpecialAura(ctx, car) {
  const now = lastGearLocalNow();
  if ((car.ironWallUntil || 0) > now) {
    ctx.save();
    ctx.strokeStyle = "rgba(183, 193, 209, 0.9)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i <= 6; i += 1) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const x = car.x + Math.cos(angle) * 42;
      const y = car.y + Math.sin(angle) * 42;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
  if ((car.overdriveUntil || 0) > now) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.55 + Math.sin(performance.now() / 60) * 0.25;
    ctx.strokeStyle = "#ffc857";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(car.x, car.y, 46, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

// -- Item tiers and placed pickups ----------------------------------------------------
const lastGearItemTiers = {
  common: ["oil", "tire", "turbo", "shield"],
  rare: ["burst", "teleport", "grapple", "anchor"],
  chaos: ["antiMagnet", "reverse", "overhaul"]
};
const lastGearTierOdds = {
  low: { common: 0.8, rare: 0.18, chaos: 0.02 },
  normal: { common: 0.62, rare: 0.3, chaos: 0.08 },
  chaos: { common: 0.4, rare: 0.36, chaos: 0.24 }
};
const lastGearTierColors = { common: "#8fd3ff", rare: "#c084fc", chaos: "#ff5c8a" };
const lastGearPlacedPickupTuning = {
  respawnMs: { low: 16000, normal: 12000, chaos: 7000 },
  radius: 40
};

function lastGearItemTier(itemId) {
  return Object.keys(lastGearItemTiers).find((tier) => lastGearItemTiers[tier].includes(itemId)) || "common";
}

function lastGearRollTier(setting) {
  const odds = lastGearTierOdds[setting] || lastGearTierOdds.normal;
  let roll = Math.random();
  for (const tier of ["common", "rare", "chaos"]) {
    roll -= odds[tier];
    if (roll < 0) return tier;
  }
  return "common";
}

// TODO: tune placed-pickup positions against future arena layouts.
function lastGearPlacedPickupSlots() {
  const setting = lastGearCurrentSettings().items || "normal";
  if (setting === "off") return [];
  return setting === "low" ? [{ id: "rare", tier: "rare" }] : [{ id: "rare", tier: "rare" }, { id: "chaos", tier: "chaos" }];
}

function lastGearPlacedPickupPoint(slotId, now = lastGearLocalNow()) {
  const sdfPickup = lastGearSdfPickupPoint(slotId, now);
  if (sdfPickup) return sdfPickup;
  const r = lastGearActiveRadius(now);
  const cx = lastGearArena.cx;
  const cy = lastGearArena.cy;
  const shape = lastGearShape();
  const rare = slotId === "rare";
  if (shape === "bridge") return rare ? { x: cx - r * 0.66, y: cy } : { x: cx + r * 0.74, y: cy };
  if (shape === "square") return rare ? { x: cx, y: cy - r * 0.5 } : { x: cx, y: cy + r * 0.68 };
  if (shape === "donut") return rare ? { x: cx, y: cy - r * 0.5 } : { x: cx, y: cy + r * 0.8 };
  return rare ? { x: cx, y: cy - r * 0.5 } : { x: cx, y: cy + r * 0.74 };
}

function lastGearNextPlacedItem(tier, previousId = null) {
  let item = lastGearRandomItem(tier);
  for (let attempt = 0; attempt < 4 && item && item.id === previousId; attempt += 1) item = lastGearRandomItem(tier);
  return item;
}

function lastGearMakePlacedPickup(slot) {
  const point = lastGearPlacedPickupPoint(slot.id);
  return { id: `lg-placed-${slot.id}`, placed: true, slot: slot.id, tier: slot.tier, item: lastGearRandomItem(slot.tier), x: point.x, y: point.y, active: true, respawnAt: 0 };
}

function lastGearDrawPlacedPickups(ctx) {
  if (!lastGearState) return;
  const now = lastGearLocalNow();
  const pulse = 1 + Math.sin(performance.now() / 220) * 0.06;
  lastGearState.itemBoxes.filter((box) => box.placed).forEach((box) => {
    const tint = lastGearTierColors[box.tier] || "#ffffff";
    ctx.save();
    ctx.translate(box.x, box.y);
    if (box.active) {
      ctx.fillStyle = "rgba(8, 12, 20, 0.72)";
      ctx.beginPath();
      ctx.arc(0, 0, lastGearPlacedPickupTuning.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = tint;
      ctx.shadowColor = tint;
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.shadowBlur = 0;
      const icon = box.item ? lastGearItemImages[box.item.id] : null;
      if (icon?.complete && icon.naturalWidth) ctx.drawImage(icon, -22, -22, 44, 44);
      else if (box.item) {
        ctx.fillStyle = tint;
        ctx.font = "900 14px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(box.item.name.slice(0, 3).toUpperCase(), 0, 0);
      }
    } else {
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 3;
      ctx.strokeStyle = tint;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, lastGearPlacedPickupTuning.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = tint;
      ctx.font = "900 15px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.max(1, Math.ceil((box.respawnAt - now) / 1000))}`, 0, 0);
    }
    ctx.globalAlpha = box.active ? 0.95 : 0.45;
    ctx.fillStyle = tint;
    ctx.font = "900 11px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(box.tier.toUpperCase(), 0, lastGearPlacedPickupTuning.radius + 14);
    ctx.restore();
  });
}

// -- Formats: Duel, Rally (2v2), Chaos ------------------------------------------------
const lastGearTeamColors = { blue: "#52c7ff", red: "#ff5c5c" };
// Spawn slots are lastGearSafePoint indexes: 0 = top, 2 = right, 4 = bottom, 6 = left.
const lastGearFormatSpawns = {
  duel: [6, 2],
  rally: [7, 5, 1, 3],
  chaos: [0, 1, 2, 3, 4, 5, 6, 7]
};

function lastGearFormatId() {
  const id = lastGearCurrentSettings().format;
  return lastGearFormats[id] ? id : "chaos";
}

function lastGearFormat() {
  return lastGearFormats[lastGearFormatId()];
}

function lastGearFormatLabel() {
  const format = lastGearFormat();
  return `${format.label} (${format.blurb})`;
}

function lastGearAreFoes(a, b) {
  if (!a || !b || a.id === b.id) return false;
  return !(a.team && b.team && a.team === b.team);
}

function lastGearIsFriendlyId(carId, otherId) {
  if (carId === otherId) return true;
  const car = lastGearState?.cars.find((entry) => entry.id === carId);
  const other = lastGearState?.cars.find((entry) => entry.id === otherId);
  return Boolean(car?.team && other?.team && car.team === other.team);
}

function lastGearApplyFormat(racers) {
  const formatId = lastGearFormatId();
  const spawns = lastGearFormatSpawns[formatId] || lastGearFormatSpawns.chaos;
  racers.forEach((racer, index) => {
    racer.team = lastGearFormats[formatId].teams ? (index < 2 ? "blue" : "red") : null;
    const point = lastGearSafePoint(spawns[index % spawns.length]);
    Object.assign(racer, { x: point.x, y: point.y, prevX: point.x, prevY: point.y, angle: point.angle, vx: Math.cos(point.angle) * 4, vy: Math.sin(point.angle) * 4 });
  });
}

function lastGearTeammateAlive(car) {
  if (!car?.team) return false;
  return lastGearLiveCars().some((other) => other.id !== car.id && other.team === car.team && !other.eliminated);
}

// TODO: extend this outcome model if future formats add more than two teams.
function lastGearMatchOutcome() {
  const survivors = lastGearLiveCars();
  const player = lastGearPlayer();
  const sides = new Set(survivors.map((car) => car.team || car.id));
  const done = sides.size <= 1;
  const playerWon = survivors.some((car) => car.player || (player?.team && car.team === player.team));
  return { done, playerWon, survivors };
}

function lastGearDrawTeamMarker(ctx, car) {
  if (!car.team || car.eliminated || car.respawnAt) return;
  const tint = lastGearTeamColors[car.team] || "#ffffff";
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(car.x, car.y, 38, 38, 0, 0, Math.PI * 2);
  ctx.stroke();
  const player = lastGearPlayer();
  if (!car.player && player && car.team === player.team) {
    ctx.fillStyle = tint;
    ctx.font = "900 12px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ALLY", car.x, car.y - 52);
  }
  ctx.restore();
}

// -- Evo Rush: 60-second quick mode where KOs evolve your car ------------------------
const lastGearEvoTuning = {
  durationMs: 60000, evolveAt: [2, 5], koWindowMs: 4500, respawnMs: 900,
  evolveInvulnerableMs: 1200, evolveHitPauseMs: 160, final10Ms: 10000,
  suddenDeathSeconds: 40, picks: 3, arenas: ["indianapolis", "berlin", "dubai", "rio", "los-angeles", "seoul", "bangalore", "space"]
};
let lastGearEvoPickIds = [];
let lastGearEvoPendingCarId = null;

Object.assign(lastGearAnnouncerPriorities, { evoStart: 3, evolve: 5, evoFinal: 4, evoEnd: 7 });
Object.assign(lastGearAnnouncerLabels, { evoStart: "Evo Rush", evolve: "Evolution", evoFinal: "Final 10", evoEnd: "Time!" });
Object.assign(lastGearAnnouncerLines, {
  evoStart: ["SIXTY SECONDS! Knock 'em out, power UP!", "EVO RUSH! Every KO makes you STRONGER!", "Clock's running, baby! EVOLVE OR GET LEFT BEHIND!"],
  evolve: ["IT'S EVOLVING!", "A WHOLE NEW MACHINE!", "LOOK AT THAT TRANSFORMATION!"],
  evoFinal: ["TEN SECONDS! Make it COUNT!", "FINAL TEN! Who wants it MORE?", "Ten seconds left, baby!"],
  evoEnd: ["TIME! What a RUSH!", "That's the BUZZER, baby!", "SIXTY SECONDS OF MAYHEM!"]
});

function lastGearIsEvoRush() {
  return lastGearCurrentSettings().mode === "evoRush";
}

function lastGearEvoPool() {
  return cars.filter((car) => !car.tutorialOnly
    && !lastGearCrewExcludedIds.includes(car.id)
    && !(typeof isFusionLine === "function" && isFusionLine(car.id))
    && (car.evolutions || []).length >= 3
    && car.evolutions.slice(0, 3).every((form) => imageFor(form, "topdown") && imageFor(form, "display")));
}

function lastGearEvoRollPicks() {
  const pool = lastGearEvoPool().sort(() => Math.random() - 0.5);
  const owned = pool.filter((car) => isSelectablePlayerCar(car.id));
  const unowned = pool.filter((car) => !isSelectablePlayerCar(car.id));
  const picks = [];
  if (owned.length) picks.push(owned[0]);
  if (unowned.length) picks.push(unowned[0]);
  pool.forEach((car) => {
    if (picks.length < lastGearEvoTuning.picks && !picks.includes(car)) picks.push(car);
  });
  lastGearEvoPickIds = picks.slice(0, lastGearEvoTuning.picks).sort(() => Math.random() - 0.5).map((car) => car.id);
  return lastGearEvoPickIds;
}

function lastGearEvoSettings() {
  const arenas = lastGearEvoTuning.arenas;
  return {
    mode: "evoRush", format: "chaos", lives: 1, opponents: 7,
    ...lastGearCityArenaSettings(arenas[Math.floor(Math.random() * arenas.length)]),
    suddenDeathSeconds: lastGearEvoTuning.suddenDeathSeconds,
    items: "normal", aiDifficulty: el.lastGearSetupAi?.value || "normal"
  };
}

function lastGearBuildEvoRoster(carId) {
  const pool = lastGearEvoPool();
  const playerLine = cars.find((car) => car.id === carId) || pool[0];
  const others = pool.filter((car) => car.id !== playerLine.id).sort(() => Math.random() - 0.5).slice(0, 7);
  return [playerLine, ...others].map((car, index) => ({ car, form: car.evolutions[0], topdown: imageFor(car.evolutions[0], "topdown"), player: index === 0 }));
}

function lastGearEvoSetForm(car, formIndex) {
  const line = cars.find((item) => item.id === car.carId);
  if (!line) return false;
  const index = Math.max(0, Math.min(Math.min(2, line.evolutions.length - 1), formIndex));
  const form = line.evolutions[index];
  car.evoForm = index;
  car.name = form.name;
  car.image = car.evoImages?.[index] || betaMakeImage(imageFor(form, "topdown"), { measure: true });
  car.displayImage = imageFor(form, "display") || car.displayImage;
  car.ratings = betaRatingsForCar(car.carId, 1, index, false);
  car.physics = lastGearPhysics(car.ratings);
  return true;
}

function lastGearEvoInit(racers) {
  racers.forEach((car) => {
    const line = cars.find((item) => item.id === car.carId);
    car.crew = null;
    car.lives = 1;
    car.evoKOs = 0;
    car.evoRingOuts = 0;
    car.evoImages = (line?.evolutions || []).slice(0, 3).map((form, index) => index === 0 ? car.image : betaMakeImage(imageFor(form, "topdown"), { measure: true }));
    lastGearEvoSetForm(car, 0);
  });
  lastGearState.evo = { final10Called: false };
  lastGearState.stats.evolutions = 0;
  lastGearEvoRenderHud(0);
}

function lastGearEvoRingOut(car, now) {
  const attacker = car.lastHitBy && now - (car.lastHitAt || 0) < lastGearEvoTuning.koWindowMs
    ? lastGearState.cars.find((entry) => entry.id === car.lastHitBy) : null;
  Object.assign(car, {
    damage: 0, item: null, shieldHits: 0, bubbleUntil: 0, anchorUntil: 0, antiMagnetUntil: 0, overhaulUntil: 0,
    reverseUntil: 0, oilSlideUntil: 0, ramJammedUntil: 0, ironWallUntil: 0, overdriveUntil: 0, handlingWeakUntil: 0,
    grapple: null, lastHitBy: null, lastHitAt: 0
  });
  car.ram = lastGearMakeRamState();
  car.evoRingOuts = (car.evoRingOuts || 0) + 1;
  car.respawnAt = now + lastGearEvoTuning.respawnMs;
  if (attacker && attacker.id !== car.id) lastGearEvoCreditKO(attacker, now);
}

function lastGearEvoCreditKO(attacker, now) {
  attacker.evoKOs = (attacker.evoKOs || 0) + 1;
  if (attacker.player) {
    lastGearState.stats.playerKOs += 1;
    lastGearState.effects.push({ kind: "impactWord", x: attacker.x, y: attacker.y - 70, vx: 0, vy: -30, ttl: 650, life: 650, text: "+1 KO", size: 26, tint: "#ffc857", angle: 0, spin: 0 });
    lastGearAnnounce(lastGearState.stats.playerKOs >= 3 ? "koStreak" : "gearOut", { cooldown: 1200 });
  }
  const targetForm = lastGearEvoTuning.evolveAt.filter((needed) => attacker.evoKOs >= needed).length;
  if (targetForm > (attacker.evoForm || 0)) lastGearEvoEvolve(attacker, targetForm, now);
}

function lastGearEvoEvolve(car, formIndex, now) {
  const before = car.name;
  const previousForm = car.evoForm || 0;
  lastGearEvoSetForm(car, formIndex);
  if (car.evoForm === previousForm) return;
  car.damage = 0;
  car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + lastGearEvoTuning.evolveInvulnerableMs);
  car.ram = lastGearMakeRamState();
  lastGearState.effects.push({ kind: "ring", x: car.x, y: car.y, vx: 0, vy: 0, angle: 0, spin: 0, ttl: 700, life: 700, size: 170, tint: "#ffc857" });
  for (let i = 0; i < 16; i += 1) lastGearSpawnParticle("spark", car.x, car.y, (Math.PI * 2 * i) / 16, 200 + Math.random() * 120, 420, 10 + Math.random() * 8, i % 2 ? "#ffc857" : "#ffffff");
  lastGearState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 84, vx: 0, vy: -22, ttl: 1100, life: 1100, text: `${car.name.toUpperCase()}!`, size: 32, tint: "#ffc857", angle: 0, spin: 0 });
  if (car.player) {
    lastGearState.stats.evolutions = (lastGearState.stats.evolutions || 0) + 1;
    lastGearState.hitPauseUntil = now + lastGearEvoTuning.evolveHitPauseMs;
    lastGearState.shake = Math.max(lastGearState.shake || 0, 10);
    lastGearAnnounce("evolve", { force: true, major: true, line: `${before.toUpperCase()} EVOLVED INTO ${car.name.toUpperCase()}!`, duration: 2600 });
  } else {
    lastGearAnnounce("evolve", { cooldown: 3500, line: `${before} just became ${car.name}!` });
  }
}

function lastGearEvoTick(now) {
  const left = lastGearEvoTuning.durationMs - now;
  lastGearEvoRenderHud(now);
  if (!lastGearState.evo.final10Called && left <= lastGearEvoTuning.final10Ms) {
    lastGearState.evo.final10Called = true;
    lastGearAnnounce("evoFinal", { force: true, major: true });
  }
  if (left <= 0 && !lastGearState.finished) {
    const player = lastGearPlayer();
    const best = Math.max(...lastGearState.cars.map((car) => car.evoKOs || 0));
    finishLastGearBeta((player?.evoKOs || 0) >= best && best > 0);
  }
}

function lastGearEvoRenderHud(now) {
  const hud = document.getElementById("last-gear-evo-hud");
  const player = lastGearPlayer();
  if (!hud || !player) return;
  const left = Math.max(0, Math.ceil((lastGearEvoTuning.durationMs - Math.max(0, now)) / 1000));
  const kos = player.evoKOs || 0;
  const form = player.evoForm || 0;
  const next = lastGearEvoTuning.evolveAt[form];
  const signature = `${left}|${kos}|${form}`;
  if (hud.dataset.signature === signature) return;
  hud.dataset.signature = signature;
  hud.classList.toggle("final", left <= 10);
  hud.innerHTML = `<strong>${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</strong><span>KOs ${kos}</span><span class="last-gear-evo-pips" aria-label="Form ${form + 1} of 3">${[0, 1, 2].map((index) => `<i class="${index <= form ? "on" : ""}"></i>`).join("")}</span><em>${next ? `Evolve at ${next}` : "Final form!"}</em>`;
}

function lastGearEvoSyncResultButtons(isEvo) {
  if (el.lastGearRestart) el.lastGearRestart.textContent = isEvo ? "Play Again" : "Restart";
  const editCrew = document.getElementById("last-gear-edit-crew");
  if (editCrew) editCrew.hidden = isEvo;
  const share = document.getElementById("last-gear-evo-share");
  if (share) share.hidden = !isEvo;
}

function lastGearEvoFinish(playerWon) {
  const player = lastGearPlayer();
  if (!player) return;
  const board = [...lastGearState.cars].sort((a, b) => (b.evoKOs || 0) - (a.evoKOs || 0) || (a.evoRingOuts || 0) - (b.evoRingOuts || 0));
  const rank = board.indexOf(player) + 1;
  const previousBest = Number(state.evoRushBest?.kos) || 0;
  const isBest = (player.evoKOs || 0) > previousBest;
  if (isBest) {
    state.evoRushBest = { kos: player.evoKOs, carId: player.carId, form: player.evoForm || 0 };
    if (typeof saveState === "function") saveState();
  }
  const owned = isSelectablePlayerCar(player.carId);
  const family = cars.find((car) => car.id === player.carId)?.family || player.name;
  const finalCall = lastGearChooseLine(lastGearAnnouncerLines.evoEnd);
  lastGearAnnounce("evoEnd", { force: true, major: true, line: finalCall, duration: 5200, legendary: true });
  if (el.lastGearResultTitle) el.lastGearResultTitle.textContent = playerWon ? "Evo Rush Champion!" : `#${rank} in Evo Rush`;
  if (el.lastGearResultCopy) el.lastGearResultCopy.innerHTML = `<div class="last-gear-result-card evo-rush-result"><div class="evo-rush-result-hero"><img src="${player.displayImage}" alt="${escapeHtml(player.name)}"><div><strong>${escapeHtml(player.name)}</strong><span>Form ${(player.evoForm || 0) + 1} of 3 · ${player.evoKOs || 0} KOs</span>${isBest ? `<b class="evo-rush-best-badge">New personal best!</b>` : `<small>Best: ${previousBest} KOs</small>`}${owned ? "" : `<small class="evo-rush-not-owned">${escapeHtml(family)} isn't in your garage yet.</small>`}</div></div><ol class="evo-rush-board">${board.slice(0, 3).map((car) => `<li class="${car.player ? "player" : ""}"><img src="${car.displayImage}" alt=""><span>${escapeHtml(car.name)}</span><strong>${car.evoKOs || 0} KOs</strong></li>`).join("")}</ol><div class="last-gear-result-stats evo-rush-result-stats"><p><span>Ring-Outs Taken</span><strong>${player.evoRingOuts || 0}</strong></p><p><span>Perfect Rams</span><strong>${lastGearState.stats.perfectRams || 0}</strong></p><p><span>Biggest Hit</span><strong>${Math.round(lastGearState.stats.biggestHit)}</strong></p></div></div>`;
}

async function lastGearEvoShare() {
  const player = lastGearPlayer();
  if (!player) return;
  const kos = player.evoKOs || 0;
  const pageUrl = /^https?:/.test(location.protocol) ? `${location.origin}${location.pathname}` : "";
  const text = `I got ${kos} KO${kos === 1 ? "" : "s"} and evolved into ${player.name} in GearBorn Evo Rush!${pageUrl ? ` ${pageUrl}` : ""}`;
  let blob = null;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#101a2b"); bg.addColorStop(1, "#05070c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center"; ctx.fillStyle = "#ffc857"; ctx.font = "64px 'Bowlby One', sans-serif"; ctx.fillText("EVO RUSH", 540, 140);
    const art = new Image(); art.src = player.displayImage; await art.decode();
    const scale = Math.min(900 / art.naturalWidth, 620 / art.naturalHeight), w = art.naturalWidth * scale, h = art.naturalHeight * scale;
    ctx.drawImage(art, 540 - w / 2, 230 + (620 - h) / 2, w, h);
    ctx.fillStyle = "#ffffff"; ctx.font = "72px 'Bowlby One', sans-serif"; ctx.fillText(player.name.toUpperCase(), 540, 970);
    ctx.fillStyle = "#52c7ff"; ctx.font = "700 44px 'Space Grotesk', sans-serif"; ctx.fillText(`${kos} KOs  ·  FORM ${(player.evoForm || 0) + 1} OF 3  ·  60 SECONDS`, 540, 1050);
    ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.font = "600 36px 'Space Grotesk', sans-serif"; ctx.fillText("GearBorn: Engines Evolved", 540, 1250);
    blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  } catch (error) { blob = null; }
  try {
    const file = blob ? new File([blob], "gearborn-evo-rush.png", { type: "image/png" }) : null;
    if (file && navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
    if (!blob && navigator.share) { await navigator.share({ text }); return; }
  } catch (error) { if (error?.name === "AbortError") return; }
  if (blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = "gearborn-evo-rush.png"; link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
    return;
  }
  try { await navigator.clipboard?.writeText(text); } catch (error) { /* Nothing else to try. */ }
}

function openEvoRushPick(reroll = true) {
  if (lastGearState) stopLastGearBeta(false);
  if (typeof viewIsActive === "function" && !viewIsActive("last-gear")) showView("last-gear");
  if (el.lastGearBeta) el.lastGearBeta.hidden = true;
  const crewScreen = document.getElementById("last-gear-crew-select");
  if (crewScreen) crewScreen.hidden = true;
  const screen = document.getElementById("evo-rush-pick");
  if (screen) screen.hidden = false;
  if (reroll || !lastGearEvoPickIds.length) lastGearEvoRollPicks();
  renderEvoRushPick();
  window.scrollTo?.({ top: 0 });
}

function closeEvoRushPick() {
  const screen = document.getElementById("evo-rush-pick");
  if (screen) screen.hidden = true;
  showView("beta");
  if (typeof openBetaPrototypeIntro === "function") openBetaPrototypeIntro();
}

function renderEvoRushPick() {
  const grid = document.getElementById("evo-rush-picks");
  if (!grid) return;
  const best = document.getElementById("evo-rush-best");
  if (best) {
    const record = state.evoRushBest;
    const bestCar = record?.carId ? cars.find((car) => car.id === record.carId) : null;
    best.textContent = record?.kos ? `Personal best: ${record.kos} KOs${bestCar ? ` with ${bestCar.evolutions[record.form || 0]?.name || bestCar.family}` : ""}` : "No personal best yet. Set one.";
  }
  grid.innerHTML = lastGearEvoPickIds.map((carId) => {
    const line = cars.find((car) => car.id === carId);
    if (!line) return "";
    const owned = isSelectablePlayerCar(carId), special = lastGearSpecialFor({ carId }), type = lastGearTypeFor(carId), forms = line.evolutions.slice(0, 3);
    return `<article class="convoy-stage-side convoy-stage-side-player last-gear-crew-select-card evo-rush-card"><span class="convoy-stage-side-kicker">${owned ? "In your garage" : "New to you"}</span><button class="convoy-stage-car-display convoy-stage-car-picker-button filled" type="button" data-evo-rush-pick="${carId}" aria-label="Start Evo Rush with ${escapeHtml(forms[0].name)}"><img src="${imageFor(forms[0], "display")}" alt="${escapeHtml(forms[0].name)}"></button><strong class="convoy-stage-car-name">${escapeHtml(forms[0].name)}</strong><span class="last-gear-crew-select-meta">${type} · ${escapeHtml(special.name)}</span><div class="evo-rush-strip" aria-label="Evolution line">${forms.map((form, index) => `<span class="${index === 0 ? "known" : "hidden-form"}"><img src="${imageFor(form, "display")}" alt=""><em>${index === 0 ? "Start" : `${lastGearEvoTuning.evolveAt[index - 1]} KOs`}</em></span>`).join("")}</div><button class="story-primary evo-rush-go" type="button" data-evo-rush-pick="${carId}">Race</button></article>`;
  }).join("");
}

function startEvoRush(carId) {
  if (!cars.some((car) => car.id === carId)) return;
  lastGearEvoPendingCarId = carId;
  startLastGearBeta();
}

document.getElementById("evo-rush-picks")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-evo-rush-pick]");
  if (button) startEvoRush(button.dataset.evoRushPick);
});
document.getElementById("evo-rush-back")?.addEventListener("click", closeEvoRushPick);
document.getElementById("evo-rush-reroll")?.addEventListener("click", () => { lastGearEvoRollPicks(); renderEvoRushPick(); });
document.getElementById("evo-rush-start")?.addEventListener("click", () => openEvoRushPick(true));
document.getElementById("last-gear-evo-share")?.addEventListener("click", lastGearEvoShare);

// -- Animated crowd: tiered stands ringing the arena --------------------------------
// Procedural, top-down fans in world space just outside the platform. They bob with
// the crowd's excitement, erupt around ring-outs, fire camera flashes, hold up signs,
// and run a stadium wave when things are calm. Only on-screen fans are drawn.
const lastGearCrowdTuning = {
  innerRadius: 1.2,
  rows: 8,
  rowGap: 46,
  seatGap: 36,
  aisleEvery: Math.PI / 6,
  baseExcitement: 0.15,
  decayPerSecond: 0.18,
  flashesPerSecond: 34,
  pulseMs: 1800,
  waveEveryMs: 24000,
  waveSpeed: 1.6,
  boardText: ["LAST GEAR", "GEARBORN", "ENGINES EVOLVED", "SPINDELL LABS"]
};
const lastGearCrowdEventBumps = {
  gearOut: 0.5, koStreak: 0.6, perfectRam: 0.35, evolve: 0.6, finalTwo: 0.5, suddenDeath: 0.4,
  evoFinal: 0.5, winner: 1, evoEnd: 1, swap: 0.15, burnout: 0.2, lastLife: 0.3, matchStart: 0.5,
  duelStart: 0.5, rallyStart: 0.5, evoStart: 0.6
};
const lastGearCrowdPalettes = {
  mixed: ["#3f86b3", "#b8944a", "#b5654d", "#36937f", "#aeb6c2", "#7d64a8", "#a94d6a", "#2b6588", "#5b6475"],
  blue: ["#3f86b3", "#2b6588", "#6fa9cf", "#1d4d6e", "#aeb6c2"],
  red: ["#b54a4a", "#8f3434", "#cf7373", "#b5654d", "#aeb6c2"]
};
const lastGearCrowdSkins = ["#d9b08f", "#c08f6b", "#9c6a48", "#7a4f35", "#523525", "#e0c0a3"];

function lastGearCrowdReducedMotion() {
  if (typeof reduceMotionEnabled === "function") return reduceMotionEnabled();
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
}

function lastGearCrowdBuild() {
  const T = lastGearCrowdTuning;
  const { cx, cy } = lastGearArena;
  const inner = lastGearArena.radius * T.innerRadius;
  const rally = typeof lastGearFormat === "function" && lastGearFormat().teams;
  const fans = [];
  for (let row = 0; row < T.rows; row += 1) {
    const radius = inner + row * T.rowGap;
    const count = Math.floor((Math.PI * 2 * radius) / T.seatGap);
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + (row % 2 ? Math.PI / count : 0);
      const aisleOffset = ((angle % T.aisleEvery) + T.aisleEvery) % T.aisleEvery;
      if (aisleOffset < (T.seatGap * 0.9) / radius || Math.random() < 0.06) continue;
      const x = cx + Math.cos(angle) * radius;
      const palette = rally ? (x < cx ? lastGearCrowdPalettes.blue : lastGearCrowdPalettes.red) : lastGearCrowdPalettes.mixed;
      fans.push({
        x,
        y: cy + Math.sin(angle) * radius,
        angle,
        row,
        phase: Math.random() * Math.PI * 2,
        speed: 5 + Math.random() * 4,
        shirt: palette[Math.floor(Math.random() * palette.length)],
        skin: lastGearCrowdSkins[Math.floor(Math.random() * lastGearCrowdSkins.length)],
        sign: Math.random() < 0.05 ? (Math.random() < 0.5 ? "#ffc857" : "#f4f7fb") : null,
        hype: 0.6 + Math.random() * 0.6
      });
    }
  }
  return { fans, inner, excitement: 0.4, pulses: [], flashes: [], waveAt: -Infinity, nextWaveAt: 6000 + Math.random() * 6000 };
}

function lastGearCrowd() {
  if (!lastGearState) return null;
  if (!lastGearState.crowd) lastGearState.crowd = lastGearCrowdBuild();
  return lastGearState.crowd;
}

function lastGearCrowdOnEvent(eventKey) {
  const crowd = lastGearCrowd();
  const bump = lastGearCrowdEventBumps[eventKey];
  if (!crowd || !bump) return;
  crowd.excitement = Math.min(1, crowd.excitement + bump);
}

function lastGearCrowdPulse(x, y, strength = 1) {
  const crowd = lastGearCrowd();
  if (!crowd) return;
  const angle = Math.atan2(y - lastGearArena.cy, x - lastGearArena.cx);
  crowd.pulses.push({ angle, t0: lastGearLocalNow(), strength });
  crowd.excitement = Math.min(1, crowd.excitement + 0.25 * strength);
  for (let i = 0; i < Math.round(26 * strength); i += 1) {
    const flashAngle = angle + (Math.random() - 0.5) * 0.9;
    const radius = crowd.inner + Math.random() * lastGearCrowdTuning.rows * lastGearCrowdTuning.rowGap;
    crowd.flashes.push({ x: lastGearArena.cx + Math.cos(flashAngle) * radius, y: lastGearArena.cy + Math.sin(flashAngle) * radius, ttl: 140 + Math.random() * 120, delay: Math.random() * 500 });
  }
}

function lastGearCrowdUpdate(dt, now) {
  const crowd = lastGearCrowd();
  if (!crowd) return;
  const T = lastGearCrowdTuning;
  let floor = T.baseExcitement;
  if (lastGearState.suddenDeath) floor = 0.35;
  if (lastGearState.evo?.final10Called) floor = 0.55;
  if (lastGearState.finished) floor = 0.9;
  crowd.excitement = Math.max(floor, crowd.excitement - T.decayPerSecond * dt);
  crowd.pulses = crowd.pulses.filter((pulse) => now - pulse.t0 < T.pulseMs);
  if (now >= crowd.nextWaveAt && crowd.excitement < 0.45 && !lastGearState.finished) {
    crowd.waveAt = now;
    crowd.nextWaveAt = now + T.waveEveryMs + Math.random() * 8000;
  }
  if (lastGearCrowdReducedMotion()) {
    crowd.flashes.length = 0;
    return;
  }
  crowd.flashes.forEach((flash) => {
    if (flash.delay > 0) flash.delay -= dt * 1000;
    else flash.ttl -= dt * 1000;
  });
  crowd.flashes = crowd.flashes.filter((flash) => flash.ttl > 0);
  const spawn = T.flashesPerSecond * crowd.excitement * crowd.excitement * dt;
  for (let i = 0; i < Math.floor(spawn) + (Math.random() < spawn % 1 ? 1 : 0); i += 1) {
    const fan = crowd.fans[Math.floor(Math.random() * crowd.fans.length)];
    if (fan) crowd.flashes.push({ x: fan.x, y: fan.y, ttl: 120 + Math.random() * 100, delay: 0 });
  }
}

function lastGearAngleGap(a, b) {
  return Math.abs(((a - b) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
}

function drawLastGearCrowd(ctx) {
  const crowd = lastGearCrowd();
  if (!crowd) return;
  const T = lastGearCrowdTuning;
  const { cx, cy } = lastGearArena;
  const now = lastGearLocalNow();
  const t = performance.now() / 1000;
  const still = lastGearCrowdReducedMotion();
  const ratio = window.devicePixelRatio || 1;
  const zoom = lastGearArena.zoom || 1;
  const halfW = ((el.lastGearCanvas?.width || 960) / ratio / 2) / zoom + 60;
  const halfH = ((el.lastGearCanvas?.height || 620) / ratio / 2) / zoom + 60;
  const camX = lastGearCamera.x;
  const camY = lastGearCamera.y;
  const outer = crowd.inner + T.rows * T.rowGap;
  const nearest = Math.hypot(Math.max(0, Math.abs(camX - cx) - halfW), Math.max(0, Math.abs(camY - cy) - halfH));
  const farthest = Math.hypot(Math.abs(camX - cx) + halfW, Math.abs(camY - cy) + halfH);
  if (farthest < crowd.inner - 60 || nearest > outer + 60) return;

  ctx.save();
  for (let row = 0; row < T.rows; row += 1) {
    ctx.strokeStyle = row % 2 ? "#121a27" : "#0e1520";
    ctx.lineWidth = T.rowGap;
    ctx.beginPath();
    ctx.arc(cx, cy, crowd.inner + row * T.rowGap, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = T.seatGap * 0.8;
  for (let angle = 0; angle < Math.PI * 2; angle += T.aisleEvery) {
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * (crowd.inner - T.rowGap / 2), cy + Math.sin(angle) * (crowd.inner - T.rowGap / 2));
    ctx.lineTo(cx + Math.cos(angle) * (outer - T.rowGap / 2), cy + Math.sin(angle) * (outer - T.rowGap / 2));
    ctx.stroke();
  }
  const railR = crowd.inner - T.rowGap / 2 - 14;
  ctx.strokeStyle = "#070a10";
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.arc(cx, cy, railR, 0, Math.PI * 2);
  ctx.stroke();
  const heat = crowd.excitement;
  ctx.strokeStyle = heat > 0.6 ? `rgba(255, 200, 87, ${0.55 + heat * 0.4})` : `rgba(82, 199, 255, ${0.45 + heat * 0.4})`;
  ctx.lineWidth = 4;
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 10 + heat * 16;
  ctx.beginPath();
  ctx.arc(cx, cy, railR - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  const boardText = lastGearArenaTheme().boards || T.boardText;
  ctx.font = "900 15px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 20; i += 1) {
    const angle = (Math.PI * 2 * i) / 20 + Math.PI / 20;
    const bx = cx + Math.cos(angle) * (railR + 2);
    const by = cy + Math.sin(angle) * (railR + 2);
    if (Math.abs(bx - camX) > halfW + 120 || Math.abs(by - camY) > halfH + 120) continue;
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillStyle = "#0b111c";
    ctx.fillRect(-90, -11, 180, 22);
    ctx.fillStyle = i % 2 ? "#ffc857" : "#52c7ff";
    ctx.fillText(boardText[i % boardText.length], 0, 1);
    ctx.restore();
  }

  const waveAngle = Number.isFinite(crowd.waveAt) ? -Math.PI / 2 + ((now - crowd.waveAt) / 1000) * T.waveSpeed : null;
  const waveLive = waveAngle !== null && waveAngle < Math.PI * 1.5 + 0.4;
  const amp = 0.12 + crowd.excitement * 0.88;
  crowd.fans.forEach((fan) => {
    if (Math.abs(fan.x - camX) > halfW || Math.abs(fan.y - camY) > halfH) return;
    let lift = still ? 0 : Math.max(0, Math.sin(t * fan.speed + fan.phase)) * amp * fan.hype;
    crowd.pulses.forEach((pulse) => {
      const gap = lastGearAngleGap(fan.angle, pulse.angle);
      if (gap > 0.9) return;
      const fade = 1 - (now - pulse.t0) / T.pulseMs;
      lift += pulse.strength * Math.exp(-(gap * gap) / 0.18) * fade * (still ? 0.6 : 0.6 + 0.4 * Math.abs(Math.sin(t * 9 + fan.phase)));
    });
    if (waveLive) {
      const gap = lastGearAngleGap(fan.angle, waveAngle);
      if (gap < 0.5) lift += 0.9 * Math.exp(-(gap * gap) / 0.04);
    }
    lift = Math.min(1.4, lift);
    const scale = 0.8 + lift * 0.2;
    const toX = -Math.cos(fan.angle);
    const toY = -Math.sin(fan.angle);
    const px = -toY;
    const py = toX;
    const hx = fan.x + toX * (2 + lift * 3);
    const hy = fan.y + toY * (2 + lift * 3);
    ctx.fillStyle = fan.shirt;
    ctx.beginPath();
    ctx.ellipse(fan.x, fan.y, 11 * scale, 7 * scale, fan.angle + Math.PI / 2, 0, Math.PI * 2);
    ctx.fill();
    if (lift > 0.45) {
      ctx.fillStyle = fan.skin;
      ctx.beginPath();
      ctx.arc(hx + px * 10 * scale + toX * 6, hy + py * 10 * scale + toY * 6, 3 * scale, 0, Math.PI * 2);
      ctx.arc(hx - px * 10 * scale + toX * 6, hy - py * 10 * scale + toY * 6, 3 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = fan.skin;
    ctx.beginPath();
    ctx.arc(hx, hy, 5.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    if (fan.sign && crowd.excitement + lift > 0.55) {
      ctx.save();
      ctx.translate(hx + toX * 10, hy + toY * 10);
      ctx.rotate(fan.angle + Math.PI / 2);
      ctx.fillStyle = fan.sign;
      ctx.fillRect(-11, -6, 22, 12);
      ctx.restore();
    }
  });
  for (let row = 1; row < T.rows; row += 1) {
    ctx.strokeStyle = `rgba(4, 7, 12, ${Math.min(0.6, row * 0.075)})`;
    ctx.lineWidth = T.rowGap;
    ctx.beginPath();
    ctx.arc(cx, cy, crowd.inner + row * T.rowGap, 0, Math.PI * 2);
    ctx.stroke();
  }
  crowd.flashes.forEach((flash) => {
    if (flash.delay > 0 || Math.abs(flash.x - camX) > halfW || Math.abs(flash.y - camY) > halfH) return;
    const alpha = Math.min(1, flash.ttl / 120);
    const glow = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, 22);
    glow.addColorStop(0, `rgba(255,255,255,${alpha})`);
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(flash.x - 22, flash.y - 22, 44, 44);
  });
  ctx.restore();
}

// -- City arenas: one shape and look per story city ----------------------------------
// New shapes (oval, hex, twin, cross, diamond) use a signed-distance model in units
// of the active radius R: negative inside, 0 on the edge. The original four shapes
// (circle, square, donut, bridge) keep their existing code paths.
// art: drop a platform image path here (e.g. "assets/lastgear/lg-arena-berlin.png")
// and it replaces the procedural floor for that city. Null = procedural.
const lastGearArenaCities = {
  indianapolis: { name: "Indianapolis", label: "Indianapolis Speedway", shape: "oval", floor: "#1b2230", rim: "#ffc857", glow: "rgba(255, 200, 87, 0.5)", pattern: "checker", boards: ["INDIANAPOLIS", "LAST GEAR", "GEARBORN", "BRICKYARD"], art: null },
  berlin: { name: "Berlin", label: "Berlin Werk Hex", shape: "hex", floor: "#191c23", rim: "#e5e7eb", glow: "rgba(143, 211, 255, 0.45)", pattern: "grid", boards: ["BERLIN", "LAST GEAR", "GEARBORN", "PRECISION"], art: null },
  dubai: { name: "Dubai", label: "Dubai Tower Ring", shape: "donut", floor: "#272116", rim: "#ffd27a", glow: "rgba(255, 210, 122, 0.5)", pattern: "rings", boards: ["DUBAI", "LAST GEAR", "GEARBORN", "GOLD RUSH"], art: null },
  rio: { name: "Rio de Janeiro", label: "Rio Carnival Bowl", shape: "circle", floor: "#12272a", rim: "#3ee6c1", glow: "rgba(62, 230, 193, 0.45)", pattern: "waves", boards: ["RIO", "CARNAVAL", "LAST GEAR", "GEARBORN"], art: null },
  "los-angeles": { name: "Los Angeles", label: "Los Angeles Block", shape: "square", floor: "#1e192a", rim: "#ff5c8a", glow: "rgba(255, 92, 138, 0.45)", pattern: "grid", boards: ["LOS ANGELES", "LAST GEAR", "GEARBORN", "HOLLYWOOD"], art: null },
  seoul: { name: "Seoul", label: "Seoul Twin Rings", shape: "twin", floor: "#17172a", rim: "#c084fc", glow: "rgba(192, 132, 252, 0.5)", pattern: "rings", boards: ["SEOUL", "LAST GEAR", "GEARBORN", "NEON NIGHTS"], art: null },
  "cape-town": { name: "Cape Town", label: "Cape Town Narrow Cape", shape: "bridge", floor: "#182521", rim: "#8fd3ff", glow: "rgba(143, 211, 255, 0.45)", pattern: "stripes", boards: ["CAPE TOWN", "LAST GEAR", "GEARBORN", "TABLE TOP"], art: null },
  bangalore: { name: "Bengaluru", label: "Bengaluru Crossroads", shape: "cross", floor: "#1b2819", rim: "#6ee7a8", glow: "rgba(110, 231, 168, 0.45)", pattern: "grid", boards: ["BENGALURU", "LAST GEAR", "GEARBORN", "GARDEN CITY"], art: null },
  space: { name: "Space", label: "Space Diamond", shape: "diamond", floor: "#0c0f22", rim: "#b9a8ff", glow: "rgba(185, 168, 255, 0.55)", pattern: "stars", boards: ["SPACE", "LAST GEAR", "GEARBORN", "ZERO G"], art: null }
};
const lastGearArenaDefaultTheme = { name: "", label: "Arena", shape: "circle", floor: "rgba(23, 32, 46, 0.96)", rim: "rgba(255, 200, 87, 0.68)", glow: "rgba(82, 199, 255, 0.48)", pattern: "rings", boards: null, art: null };
const lastGearSdfShapes = {
  oval: { halfLength: 0.32, radius: 0.68, pickups: { rare: [0, -0.34], chaos: [0.84, 0.12] } },
  hex: { apothem: 0.84, pickups: { rare: [0, -0.5], chaos: [0, 0.7] } },
  twin: { offset: 0.42, radius: 0.58, pickups: { rare: [0, 0], chaos: [-0.86, 0] } },
  cross: { long: 0.9, wide: 0.34, pickups: { rare: [0, -0.5], chaos: [0, 0.74] } },
  diamond: { reach: 0.92, pickups: { rare: [0, -0.5], chaos: [0, 0.74] } }
};
const lastGearArenaArtImages = {};
const lastGearArenaIconImages = {};

function lastGearCityArenaSettings(value) {
  const city = lastGearArenaCities[value];
  if (city) return { city: value, arena: city.shape };
  return { city: null, arena: value || "circle" };
}

function lastGearArenaTheme() {
  const cityId = lastGearCurrentSettings().city;
  return lastGearArenaCities[cityId] ? { id: cityId, ...lastGearArenaCities[cityId] } : lastGearArenaDefaultTheme;
}

// Signed distance in R units for the new shapes; null for the original four.
function lastGearShapeSdf(shape, ux, uy) {
  const def = lastGearSdfShapes[shape];
  if (!def) return null;
  if (shape === "oval") {
    const qx = Math.max(Math.abs(ux) - def.halfLength, 0);
    return Math.hypot(qx, uy) - def.radius;
  }
  if (shape === "hex") {
    let worst = -Infinity;
    for (let i = 0; i < 3; i += 1) {
      const angle = (Math.PI / 3) * i;
      worst = Math.max(worst, Math.abs(ux * Math.cos(angle) + uy * Math.sin(angle)) - def.apothem);
    }
    return worst;
  }
  if (shape === "twin") return Math.min(Math.hypot(ux - def.offset, uy), Math.hypot(ux + def.offset, uy)) - def.radius;
  if (shape === "cross") {
    const box = (hx, hy) => {
      const qx = Math.abs(ux) - hx;
      const qy = Math.abs(uy) - hy;
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
    };
    return Math.min(box(def.long, def.wide), box(def.wide, def.long));
  }
  if (shape === "diamond") return (Math.abs(ux) + Math.abs(uy) - def.reach) / Math.SQRT2;
  return null;
}

function lastGearSdfBoundary(x, y, now) {
  const shape = lastGearShape();
  if (!lastGearSdfShapes[shape]) return null;
  const radius = lastGearActiveRadius(now);
  const ux = (x - lastGearArena.cx) / radius;
  const uy = (y - lastGearArena.cy) / radius;
  const d = lastGearShapeSdf(shape, ux, uy);
  const h = 0.01;
  let nx = lastGearShapeSdf(shape, ux + h, uy) - lastGearShapeSdf(shape, ux - h, uy);
  let ny = lastGearShapeSdf(shape, ux, uy + h) - lastGearShapeSdf(shape, ux, uy - h);
  const length = Math.hypot(nx, ny) || 1;
  nx /= length;
  ny /= length;
  return { safe: d <= 0, edge: Math.max(0, 1 + d / 0.5), nx, ny, radius, sdf: d };
}

function lastGearSdfSafePoint(index) {
  const shape = lastGearShape();
  if (!lastGearSdfShapes[shape]) return null;
  const radius = lastGearActiveRadius();
  const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2;
  let reach = 0.62;
  while (reach > 0.12 && lastGearShapeSdf(shape, Math.cos(angle) * reach, Math.sin(angle) * reach) > -0.12) reach -= 0.03;
  const x = lastGearArena.cx + Math.cos(angle) * radius * reach;
  const y = lastGearArena.cy + Math.sin(angle) * radius * reach;
  return { x, y, angle: Math.atan2(lastGearArena.cy - y, lastGearArena.cx - x) };
}

function lastGearSdfPickupPoint(slotId, now) {
  const def = lastGearSdfShapes[lastGearShape()];
  if (!def) return null;
  const radius = lastGearActiveRadius(now);
  const [ux, uy] = def.pickups[slotId] || def.pickups.rare;
  return { x: lastGearArena.cx + ux * radius, y: lastGearArena.cy + uy * radius };
}

// The platform as a list of Path2D pieces (unions are drawn piece by piece).
function lastGearShapePaths(shape, radius) {
  const { cx, cy } = lastGearArena;
  const path = () => new Path2D();
  if (shape === "square") {
    const half = radius * 0.82;
    const p = path();
    p.roundRect(cx - half, cy - half, half * 2, half * 2, 34);
    return [p];
  }
  if (shape === "donut") {
    const p = path();
    p.arc(cx, cy, radius, 0, Math.PI * 2);
    p.moveTo(cx + radius * 0.18, cy);
    p.arc(cx, cy, radius * 0.18, 0, Math.PI * 2, true);
    return [p];
  }
  if (shape === "bridge") {
    const halfLength = radius * 0.86;
    const halfWidth = radius * 0.24;
    const p = path();
    p.roundRect(cx - halfLength, cy - halfWidth, halfLength * 2, halfWidth * 2, halfWidth);
    return [p];
  }
  if (shape === "oval") {
    const def = lastGearSdfShapes.oval;
    const width = (def.halfLength + def.radius) * radius;
    const height = def.radius * radius;
    const p = path();
    p.roundRect(cx - width, cy - height, width * 2, height * 2, height);
    return [p];
  }
  if (shape === "hex") {
    const vertex = (lastGearSdfShapes.hex.apothem / Math.cos(Math.PI / 6)) * radius;
    const p = path();
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      if (i === 0) p.moveTo(cx + Math.cos(angle) * vertex, cy + Math.sin(angle) * vertex);
      else p.lineTo(cx + Math.cos(angle) * vertex, cy + Math.sin(angle) * vertex);
    }
    p.closePath();
    return [p];
  }
  if (shape === "twin") {
    const def = lastGearSdfShapes.twin;
    return [-1, 1].map((side) => {
      const p = path();
      p.arc(cx + side * def.offset * radius, cy, def.radius * radius, 0, Math.PI * 2);
      return p;
    });
  }
  if (shape === "cross") {
    const def = lastGearSdfShapes.cross;
    const horizontal = path();
    horizontal.roundRect(cx - def.long * radius, cy - def.wide * radius, def.long * radius * 2, def.wide * radius * 2, 40);
    const vertical = path();
    vertical.roundRect(cx - def.wide * radius, cy - def.long * radius, def.wide * radius * 2, def.long * radius * 2, 40);
    return [horizontal, vertical];
  }
  if (shape === "diamond") {
    const reach = lastGearSdfShapes.diamond.reach * radius;
    const p = path();
    p.moveTo(cx, cy - reach);
    p.lineTo(cx + reach, cy);
    p.lineTo(cx, cy + reach);
    p.lineTo(cx - reach, cy);
    p.closePath();
    return [p];
  }
  const p = path();
  p.arc(cx, cy, radius, 0, Math.PI * 2);
  return [p];
}

function lastGearDrawArenaPattern(ctx, theme, shape, radius) {
  const { cx, cy } = lastGearArena;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 3;
  if (theme.pattern === "grid") {
    for (let offset = -radius; offset <= radius; offset += 120) {
      ctx.beginPath();
      ctx.moveTo(cx + offset, cy - radius);
      ctx.lineTo(cx + offset, cy + radius);
      ctx.moveTo(cx - radius, cy + offset);
      ctx.lineTo(cx + radius, cy + offset);
      ctx.stroke();
    }
  } else if (theme.pattern === "stripes") {
    for (let offset = -radius * 2; offset <= radius * 2; offset += 110) {
      ctx.beginPath();
      ctx.moveTo(cx + offset - radius, cy - radius);
      ctx.lineTo(cx + offset + radius, cy + radius);
      ctx.stroke();
    }
  } else if (theme.pattern === "waves") {
    for (let row = -radius; row <= radius; row += 90) {
      ctx.beginPath();
      for (let x = -radius; x <= radius; x += 20) {
        const y = cy + row + Math.sin(x / 70) * 18;
        if (x === -radius) ctx.moveTo(cx + x, y);
        else ctx.lineTo(cx + x, y);
      }
      ctx.stroke();
    }
  } else if (theme.pattern === "checker") {
    const size = 40;
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    for (let y = -radius; y < radius; y += size) {
      for (let col = 0; col < 2; col += 1) {
        if ((Math.round(y / size) + col) % 2) ctx.fillRect(cx - size + col * size, cy + y, size, size);
      }
    }
    for (let ring = 120; ring < radius; ring += 120) {
      ctx.beginPath();
      ctx.arc(cx, cy, ring, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (theme.pattern === "stars") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    for (let i = 0; i < 140; i += 1) {
      const angle = (i * 2.399963) % (Math.PI * 2);
      const distance = Math.sqrt(((i * 7919) % 1000) / 1000) * radius;
      const size = i % 5 ? 2 : 3;
      ctx.fillRect(cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance, size, size);
    }
  } else {
    for (let ring = 90; ring < radius; ring += 90) {
      if (shape === "donut" && ring < radius * 0.38) continue;
      ctx.beginPath();
      ctx.arc(cx, cy, ring, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function lastGearDrawArenaDecal(ctx, theme, shape, radius) {
  if (!theme.id) return;
  const city = storyCities?.find?.((entry) => entry.id === theme.id);
  const iconSrc = city?.cityIcon || city?.icon;
  if (!iconSrc) return;
  if (!lastGearArenaIconImages[theme.id]) lastGearArenaIconImages[theme.id] = betaMakeImage(iconSrc);
  const icon = lastGearArenaIconImages[theme.id];
  if (!icon.complete || !icon.naturalWidth) return;
  const size = radius * (shape === "donut" || shape === "bridge" ? 0.26 : 0.42);
  const x = lastGearArena.cx;
  const y = lastGearArena.cy + (shape === "donut" ? -radius * 0.58 : 0);
  const scale = Math.min(size / icon.naturalWidth, size / icon.naturalHeight);
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.drawImage(icon, x - (icon.naturalWidth * scale) / 2, y - (icon.naturalHeight * scale) / 2, icon.naturalWidth * scale, icon.naturalHeight * scale);
  ctx.restore();
}
