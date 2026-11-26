// ─── CRASHOUT: arena battle mode ───────────────────────────────────────────
// Moved out of game-gearprix.js. Loads after game-gearprix.js and game-beta3d.js,
// so every beta* helper and betaMakeImage are already defined.

const crashoutItemDefinitions = [
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

const crashoutItemImages = {};
crashoutItemDefinitions.forEach((def) => {
  crashoutItemImages[def.id] = betaMakeImage(def.icon);
});

const crashoutImages = {
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

// ── Crashout: isolated Beta Mode arena prototype ───────────────────────────
let crashoutState = null;
const crashoutKeys = {};
const CRASHOUT_SPRITE_BODY_LENGTH = 58; // BASE car-body length in arena px; drawn at x CRASHOUT_CAR_SCALE
// 4C: cars (and everything drawn around them) are 1.5x. Overlays are authored at
// base size and drawn inside crashoutScaleAboutCar(); collision radius scales too.
const CRASHOUT_CAR_SCALE = 1.5;
const crashoutKeyMap = { W: "up", ArrowUp: "up", S: "down", ArrowDown: "down", A: "left", ArrowLeft: "left", D: "right", ArrowRight: "right", Shift: "charge" };
const crashoutArena = {
  width: 3000,
  height: 3000,
  cx: 1500,
  cy: 1500,
  radius: 1150,
  viewWidth: 960,
  viewHeight: 620,
  zoom: 1,
  shape: "circle"
};
const crashoutCamera = {
  x: 1500,
  y: 1500,
  smoothing: 0.12
};
const crashoutSuddenDeath = {
  startMs: 180000,
  shrinkDurationMs: 90000,
  minRadius: 660
};
const crashoutAiArchetypes = ["Aggro", "Tank", "Coward", "Trickster", "Speedster", "Opportunist", "Defender"];
const crashoutFormats = {
  duel: { label: "Duel", blurb: "1v1", opponents: 1, teams: false, startEvent: "duelStart" },
  rally: { label: "Rally", blurb: "2v2", opponents: 3, teams: true, startEvent: "rallyStart" },
  chaos: { label: "Chaos", blurb: "8-car free-for-all", opponents: 7, teams: false, startEvent: "matchStart" }
};
let crashoutSetupConfig = {
  format: "chaos",
  lives: 3,
  opponents: 7,
  arena: "circle",
  suddenDeathSeconds: 180,
  items: "normal",
  aiDifficulty: "normal"
};
const crashoutItemCadence = {
  off: { boxes: 0, respawn: 999999, variance: 0 },
  low: { boxes: 3, respawn: 7000, variance: 3000 },
  normal: { boxes: 5, respawn: 4500, variance: 2500 },
  chaos: { boxes: 8, respawn: 2200, variance: 1200 }
};
const crashoutItemTuning = {
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
// crashoutStatT(stat): 60 or lower -> first value, 100 -> second value.
const crashoutRamTuning = {
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
  chargeMoveDrag: 0.994,
  chargeThrottle: 0.75,
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
const crashoutAiRamSkill = {
  chill: { perfect: 0.2, dodge: 0.08, greedy: 0.04 },
  normal: { perfect: 0.42, dodge: 0.22, greedy: 0.03 },
  aggro: { perfect: 0.65, dodge: 0.38, greedy: 0.02 }
};
const crashoutImpactTuning = {
  minor: 96,
  major: 150,
  legendary: 220,
  hitstopMin: 18,
  hitstopMax: 58,
  shakeDivisor: 10
};
// 4C: Roberto keeps it short so the screen stays clean.
const crashoutAnnouncerDurations = {
  default: 1100,
  major: 1600,
  quick: 900,
  gapMs: 900
};
const crashoutAnnouncerPriorities = {
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
const crashoutAnnouncerLabels = {
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
const crashoutAnnouncerLines = {
  matchStart: ["We got ourselves a HOT race tonight, BABY!", "Eight GearBorn enter. One leaves rolling!", "Welcome to TUNER CRASHOUT!"],
  bigHit: ["DIOS MIO! Did you SEE that hit?!", "Somebody felt THAT one!", "That was FAST. VIOLENT. BEAUTIFUL."],
  tBone: ["SIDE IMPACT!", "That was CLEAN. TOO clean!", "OOOOHHHH they got DESTROYED!"],
  headOn: ["Neither GearBorn backed down!", "FULL FRONTAL COLLISION!", "That was PURE chaos, baby!"],
  firstGearOut: ["And our first GearBorn is OUTTA HERE!", "One down - seven remain!", "Off the edge! OFF THE EDGE!"],
  gearOut: ["GEAR OUT!", "Off the platform and OUTTA HERE!", "The arena claims another victim!"],
  lastLife: ["No room for mistakes now!", "One life left, baby!", "This just got dangerous!"],
  finalTwo: ["This is what Tuner Crashout is ALL about, baby.", "One mistake decides EVERYTHING!", "You can FEEL this arena holding its breath!"],
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
const crashoutComboCalls = ["OOOOHHHH! DIOS MIO!", "Off the edge! OFF THE EDGE!", "They got clipped THEY GOT CLIPPED!"];

function crashoutClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function crashoutLerp(a, b, t) {
  return a + (b - a) * crashoutClamp(t, 0, 1);
}

function crashoutLocalNow() {
  const reference = crashoutState?.paused ? crashoutState.pausedAt : performance.now();
  return reference - (crashoutState?.startedAt || reference);
}

function crashoutCurrentSettings() {
  return crashoutState?.settings || crashoutSetupConfig;
}

function crashoutActiveRadius(now = crashoutLocalNow()) {
  if (!crashoutState?.suddenDeath) return crashoutArena.radius;
  const progress = (now - (crashoutState.suddenDeathStartedAt || now)) / crashoutSuddenDeath.shrinkDurationMs;
  return crashoutLerp(crashoutArena.radius, crashoutSuddenDeath.minRadius, progress);
}

function crashoutShapeScale(now = crashoutLocalNow()) {
  return crashoutActiveRadius(now) / crashoutArena.radius;
}

function crashoutShape() {
  return crashoutCurrentSettings().arena || crashoutArena.shape || "circle";
}

function crashoutShapeBoundary(x, y, now = crashoutLocalNow()) {
  const sdfBoundary = crashoutSdfBoundary(x, y, now);
  if (sdfBoundary) return sdfBoundary;
  const shape = crashoutShape();
  const radius = crashoutActiveRadius(now);
  const dx = x - crashoutArena.cx;
  const dy = y - crashoutArena.cy;
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
    const halfWidth = radius * 0.34;
    const closestX = crashoutClamp(dx, -halfLength, halfLength);
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

function crashoutEdgeIntensity(now = crashoutLocalNow()) {
  if (!crashoutState) return 0;
  let intensity = crashoutState.suddenDeath ? 0.28 : 0;
  crashoutLiveCars().forEach((car) => {
    const boundary = crashoutShapeBoundary(car.x, car.y, now);
    const edge = crashoutClamp((boundary.edge - 0.7) / 0.3, 0, 1);
    intensity = Math.max(intensity, edge * (car.player ? 1 : 0.55));
  });
  return crashoutClamp(intensity, 0, 1);
}

function crashoutPlaySound(key) {
  if (typeof playSound === "function") playSound(key);
}

function crashoutLiveCars() {
  return crashoutState?.cars.filter((car) => car.lives > 0 && !car.eliminated) || [];
}

function crashoutUpdateCamera() {
  const player = crashoutPlayer();
  if (!player) return;
  const focus = player.eliminated ? (crashoutLiveCars().find((car) => car.team && car.team === player.team) || player) : player;
  crashoutCamera.x += (focus.x - crashoutCamera.x) * crashoutCamera.smoothing;
  crashoutCamera.y += (focus.y - crashoutCamera.y) * crashoutCamera.smoothing;
}

function crashoutDistanceFromCenter(car) {
  return Math.hypot(car.x - crashoutArena.cx, car.y - crashoutArena.cy);
}

function crashoutSafePoint(index = Math.random() * 8) {
  const sdfSpawn = crashoutSdfSafePoint(index);
  if (sdfSpawn) return sdfSpawn;
  const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2;
  const shape = crashoutShape();
  const radius = crashoutActiveRadius() * 0.58;
  if (shape === "square") {
    const half = crashoutActiveRadius() * 0.5;
    const x = crashoutArena.cx + Math.cos(angle) * half;
    const y = crashoutArena.cy + Math.sin(angle) * half;
    return { x, y, angle: Math.atan2(crashoutArena.cy - y, crashoutArena.cx - x) };
  }
  if (shape === "bridge") {
    const lane = (index % 2 ? -1 : 1) * crashoutActiveRadius() * 0.16;
    const x = crashoutArena.cx + Math.cos(angle) * crashoutActiveRadius() * 0.52;
    const y = crashoutArena.cy + lane;
    return { x, y, angle: Math.atan2(crashoutArena.cy - y, crashoutArena.cx - x) };
  }
  if (shape === "donut") {
    const donutRadius = crashoutActiveRadius() * 0.62;
    const x = crashoutArena.cx + Math.cos(angle) * donutRadius;
    const y = crashoutArena.cy + Math.sin(angle) * donutRadius;
    return { x, y, angle: Math.atan2(crashoutArena.cy - y, crashoutArena.cx - x) };
  }
  const x = crashoutArena.cx + Math.cos(angle) * radius;
  const y = crashoutArena.cy + Math.sin(angle) * radius;
  return { x, y, angle: Math.atan2(crashoutArena.cy - y, crashoutArena.cx - x) };
}

function crashoutRatingsFor(carId, player = false) {
  const level = state.garage?.[carId]?.level || 1;
  const evolution = state.garage?.[carId]?.evolution || 0;
  return betaRatingsForCar(carId, level, evolution, player);
}

function crashoutPhysics(ratings) {
  return {
    maxSpeed: 230 + (ratings.speed || 70) * 2.15,
    acceleration: 210 + (ratings.acceleration || 70) * 3.5,
    brake: 390 + (ratings.torque || 70) * 1.6,
    turnRate: 2.25 + (ratings.handling || 70) / 34,
    mass: 0.84 + (ratings.body || 70) / 145,
    body: ratings.body || 70,
    ramFillMs: crashoutLerp(...crashoutRamTuning.fillMs, crashoutStatT(ratings.acceleration)),
    ramPerfectMs: crashoutLerp(...crashoutRamTuning.perfectMs, crashoutStatT(ratings.handling)),
    ramOverheatMs: crashoutLerp(...crashoutRamTuning.overheatMs, crashoutStatT(ratings.powertrain)),
    ramRecoverMs: crashoutLerp(...crashoutRamTuning.recoverMs, crashoutStatT(ratings.torque)),
    ramDodgeImpulse: crashoutLerp(...crashoutRamTuning.dodgeImpulse, crashoutStatT(ratings.handling)),
    ramBodyFactor: crashoutLerp(...crashoutRamTuning.bodyHitFactor, crashoutStatT(ratings.body))
  };
}

function crashoutSpecialFor(car) {
  return crashoutLineSpecials[car?.specialLineId] || crashoutTypeSpecials[crashoutTypeFor(car?.carId)] || crashoutTypeSpecials.Neutral;
}

function crashoutCarImagePath(carId) {
  const form = currentEvolution(carId);
  return imageFor(form, "topdown");
}

function crashoutBuildRoster() {
  const playerCarId = isSelectablePlayerCar(state.crashoutSelectedCar) ? state.crashoutSelectedCar : (state.selectedCar || cars[0].id);
  const playerForm = currentEvolution(playerCarId);
  const playerTopdown = crashoutCarImagePath(playerCarId) || imageFor(playerForm, "display");
  const excluded = new Set(["rainbowlt", "hornula1", playerCarId]);
  const opponentCount = crashoutClamp(Number(crashoutCurrentSettings().opponents || 7), 1, 7);
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

function crashoutMakeCar(entry, index, total) {
  const point = crashoutSafePoint(index);
  const ratings = crashoutRatingsFor(entry.car.id, Boolean(entry.player));
  const physics = crashoutPhysics(ratings);
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
    archetype: entry.player ? "Player" : crashoutAiArchetypes[(index - 1 + crashoutAiArchetypes.length) % crashoutAiArchetypes.length],
    x: point.x,
    y: point.y,
    prevX: point.x,
    prevY: point.y,
    vx: Math.cos(point.angle) * 4,
    vy: Math.sin(point.angle) * 4,
    angle: point.angle,
    radius: Math.round(27 * CRASHOUT_CAR_SCALE),
    lives: 3,
    damage: 0,
    item: null,
    ram: crashoutMakeRamState(),
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

function openCrashoutCarSelect() {
  state.crashoutSelectedCar = isSelectablePlayerCar(state.crashoutSelectedCar) ? state.crashoutSelectedCar : selectedCarIdForMode("beta");
  openCarPicker("crashout");
}

function readCrashoutSetupConfig() {
  const suddenSeconds = Number(el.crashoutSetupSudden?.value ?? 180);
  crashoutSetupConfig = {
    lives: Number(el.crashoutSetupLives?.value || 3),
    format: crashoutFormats[document.getElementById("crashout-setup-format")?.value] ? document.getElementById("crashout-setup-format").value : "chaos",
    opponents: (crashoutFormats[document.getElementById("crashout-setup-format")?.value] || crashoutFormats.chaos).opponents,
    ...crashoutCityArenaSettings(el.crashoutSetupArena?.value),
    suddenDeathSeconds: Number.isFinite(suddenSeconds) && suddenSeconds > 0 ? suddenSeconds : 0,
    items: el.crashoutSetupItems?.value || "normal",
    aiDifficulty: el.crashoutSetupAi?.value || "normal"
  };
  crashoutArena.shape = crashoutSetupConfig.arena;
  return crashoutSetupConfig;
}

function toggleCrashoutSetupPanel(show = true) {
  if (!el.crashoutSetupPanel) {
    openCrashoutCarSelect();
    return;
  }
  el.crashoutSetupPanel.hidden = !show;
}

async function startCrashoutBeta() {
  if (!el.crashoutCanvas) return;
  // A story result card left on the arena never carries into a new match.
  document.querySelectorAll(".crashout-stage > .race-result-popup").forEach((node) => node.remove());
  crashoutHidePauseOverlay();
  const evoCarId = typeof crashoutEvoPendingCarId !== "undefined" ? crashoutEvoPendingCarId : null;
  if (evoCarId) crashoutEvoPendingCarId = null;
  const battleSpec = typeof crashoutBattlePending !== "undefined" ? crashoutBattlePending : null;
  if (battleSpec) crashoutBattlePending = null;
  const settings = battleSpec ? crashoutBattleSettings(battleSpec) : evoCarId ? crashoutEvoSettings() : { ...readCrashoutSetupConfig() };
  stopBetaDemo(false);
  if (typeof viewIsActive === "function" && !viewIsActive("crashout-arena")) showView("crashout-arena");
  if (el.crashoutBeta) el.crashoutBeta.hidden = false;
  const crewSelectScreen = document.getElementById("crashout-crew-select");
  if (crewSelectScreen) crewSelectScreen.hidden = true;
  const evoPickScreen = document.getElementById("evo-rush-pick");
  if (evoPickScreen) evoPickScreen.hidden = true;
  const evoHud = document.getElementById("crashout-evo-hud");
  if (evoHud) evoHud.hidden = !evoCarId;
  if (el.crashoutResults) el.crashoutResults.hidden = true;
  if (el.crashoutBetaBack) el.crashoutBetaBack.hidden = false;
  const roster = battleSpec ? crashoutBuildBattleRoster(battleSpec) : evoCarId ? crashoutBuildEvoRoster(evoCarId) : crashoutBuildRoster();
  const cars = roster.map((entry, index) => crashoutMakeCar(entry, index, roster.length));
  await ensureAssets([
    ...cars.map((car) => car.image?.src || car.displayImage),
    ...assetUrlsInElement(document.querySelector("#crashout-arena-view"))
  ], { label: "Loading Tuner Crashout…" });
  cars.forEach((car) => {
    if (!car.image) return;
    if (car.image.complete && car.image.naturalWidth) gearbornSpriteMetrics(car.image);
    else car.image.addEventListener("load", () => gearbornSpriteMetrics(car.image), { once: true });
  });
  const countdownUntil = performance.now() + 3000;
  crashoutState = {
    active: true,
    finished: false,
    countdownUntil,
    startedAt: countdownUntil,
    settings,
    cars,
    itemBoxes: crashoutInitialItemBoxes(),
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
  if (evoCarId) crashoutEvoInit(cars);
  else if (battleSpec) crashoutBattleInit(cars, battleSpec);
  else crashoutAttachCrews(cars, crashoutClamp(Number(settings.lives || 3), 1, 5));
  crashoutApplyFormat(cars);
  crashoutState.itemBoxes = crashoutInitialItemBoxes();
  crashoutCamera.x = crashoutArena.cx;
  crashoutCamera.y = crashoutArena.cy;
  Object.keys(crashoutKeys).forEach((key) => delete crashoutKeys[key]);
  resizeCrashoutBeta();
  updateCrashoutTouchVisuals();
  updateCrashoutHud(true);
  if (battleSpec) crashoutAnnounce("battleStart", { force: true, major: true, line: crashoutBattleOpener() });
  else crashoutAnnounce(evoCarId ? "evoStart" : (crashoutFormat().startEvent || "matchStart"), { force: true, major: true });
  crashoutState.raf = requestAnimationFrame(updateCrashoutBeta);
}

function stopCrashoutBeta(showIntro = true) {
  if (crashoutState?.raf) cancelAnimationFrame(crashoutState.raf);
  const wasBattle = Boolean(crashoutState) && crashoutIsBattle();
  const wasEvo = Boolean(crashoutState) && crashoutIsEvoRush();
  crashoutState = null;
  crashoutHidePauseOverlay();
  Object.keys(crashoutKeys).forEach((key) => delete crashoutKeys[key]);
  if (typeof crashoutReleaseStick === "function") crashoutReleaseStick();
  updateCrashoutTouchVisuals();
  crashoutRenderAnnouncer(0);
  if (el.crashoutBeta) el.crashoutBeta.hidden = true;
  if (showIntro && wasBattle) crashoutBattleExit();
  else if (showIntro && wasEvo) evoRushExit();
  else if (showIntro) showView("crashout");
}

function resizeCrashoutBeta() {
  if (!el.crashoutCanvas) return;
  const ratio = window.devicePixelRatio || 1;
  const rect = el.crashoutCanvas.getBoundingClientRect();
  el.crashoutCanvas.width = Math.max(1, Math.round(rect.width * ratio));
  el.crashoutCanvas.height = Math.max(1, Math.round(rect.height * ratio));
  drawCrashoutFrame();
}

function crashoutInitialItemBoxes() {
  const cadence = crashoutItemCadence[crashoutCurrentSettings().items] || crashoutItemCadence.normal;
  return Array.from({ length: cadence.boxes }, (_, index) => crashoutSpawnBox(index)).concat(crashoutPlacedPickupSlots().map(crashoutMakePlacedPickup));
}

function crashoutSpawnBox(index = 0) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const angle = (Math.PI * 2 * (index + Math.random() * 0.35 + attempt * 0.17)) / Math.max(5, (crashoutItemCadence[crashoutCurrentSettings().items] || crashoutItemCadence.normal).boxes || 5);
    const radius = crashoutActiveRadius() * (0.24 + Math.random() * 0.46);
    const x = crashoutArena.cx + Math.cos(angle) * radius;
    const y = crashoutArena.cy + Math.sin(angle) * radius;
    if (!crashoutShapeBoundary(x, y).safe) continue;
    return { id: `lg-box-${Date.now()}-${index}-${Math.random()}`, x, y, active: true, respawnAt: 0 };
  }
  const point = crashoutSafePoint(index);
  return { id: `lg-box-${Date.now()}-${index}-${Math.random()}`, x: point.x, y: point.y, active: true, respawnAt: 0 };
}

function crashoutPlayer() {
  return crashoutState?.cars.find((car) => car.player);
}

function crashoutInput(direction) {
  return Boolean(crashoutKeys[direction]);
}

function crashoutControlsFor(car) {
  const now = crashoutLocalNow();
  let controls;
  if (car.player) {
    controls = crashoutPlayerControls(car);
  } else {
    controls = car.hang ? crashoutAiRecoveryControls(car, now) : crashoutAiControls(car);
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

function crashoutNearestOpponent(car) {
  let best = null;
  let bestDistance = Infinity;
  crashoutLiveCars().forEach((target) => {
    if (!crashoutAreFoes(car, target) || target.respawnAt) return;
    const distance = Math.hypot(target.x - car.x, target.y - car.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = target;
    }
  });
  return best;
}

function crashoutMostDamagedOpponent(car) {
  return crashoutLiveCars()
    .filter((target) => crashoutAreFoes(car, target) && !target.respawnAt)
    .sort((a, b) => b.damage - a.damage)[0] || null;
}

function crashoutNearestItemBox(car) {
  if (!crashoutState) return null;
  let best = null;
  let bestDistance = Infinity;
  crashoutState.itemBoxes.forEach((box) => {
    if (!box.active) return;
    const distance = Math.hypot(box.x - car.x, box.y - car.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = box;
    }
  });
  return best;
}

function crashoutChooseLine(lines = []) {
  return lines[Math.floor(Math.random() * lines.length)] || "";
}

function crashoutAnnounce(eventKey, options = {}) {
  if (!crashoutState) return;
  crashoutCrowdOnEvent(eventKey);
  const now = crashoutLocalNow();
  const priority = crashoutAnnouncerPriorities[eventKey] || 1;
  const currentPriority = crashoutState.announcer?.priority || 0;
  const lastAt = crashoutState.announcerLastAt[eventKey] || -Infinity;
  const randomDelay = 0.85 + Math.random() * 0.35;
  if (!options.force && now - lastAt < (options.cooldown || 2400) * randomDelay) return;
  if (!options.force && crashoutState.announcer?.until > now && priority < currentPriority) return;
  // 4C: minor calls wait a beat after the last one clears instead of chaining back to back.
  if (!options.force && priority < 4 && now < (crashoutState.announcer?.until || -Infinity) + crashoutAnnouncerDurations.gapMs) return;
  let pool = crashoutAnnouncerLines[eventKey] || [];
  const previousLine = crashoutState.announcerLastLine?.[eventKey];
  if (pool.length > 1) pool = pool.filter((line) => line !== previousLine);
  let line = options.line || crashoutChooseLine(pool);
  if (!options.line && priority >= 5 && Math.random() < 0.22) line = crashoutChooseLine(crashoutComboCalls);
  crashoutState.announcer = {
    eventKey,
    label: options.label || crashoutAnnouncerLabels[eventKey] || "Tuner Crashout",
    line,
    priority,
    major: Boolean(options.major || priority >= 4),
    legendary: Boolean(options.legendary || priority >= 5),
    until: now + (options.duration || (priority >= 4 ? crashoutAnnouncerDurations.major : crashoutAnnouncerDurations.default)) + Math.random() * 150
  };
  crashoutState.announcerLastAt[eventKey] = now;
  crashoutState.announcerLastLine[eventKey] = line;
  crashoutState.crowdIntensity = crashoutClamp((crashoutState.crowdIntensity || 0) + priority * 0.08, 0, 1);
  if (priority >= 4) crashoutState.shake = Math.max(crashoutState.shake || 0, 5);
  crashoutRenderAnnouncer(now);
}

function crashoutRenderAnnouncer(now = crashoutLocalNow()) {
  if (!el.crashoutAnnouncer) return;
  const call = crashoutState?.announcer;
  const active = Boolean(call && call.until > now);
  el.crashoutAnnouncer.hidden = !active;
  el.crashoutAnnouncer.classList.toggle("major", Boolean(active && call.major));
  el.crashoutAnnouncer.classList.toggle("legendary", Boolean(active && call.legendary));
  if (!active) return;
  if (el.crashoutAnnouncerEvent) el.crashoutAnnouncerEvent.textContent = call.label;
  if (el.crashoutAnnouncerLine) el.crashoutAnnouncerLine.textContent = call.line;
}

function crashoutSpawnParticle(kind, x, y, angle, speed, ttl, size, tint = "#ffc857") {
  if (!crashoutState) return;
  crashoutState.effects.push({
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

function crashoutSpawnImpactFx(x, y, nx, ny, impact, type = "hit") {
  const angle = Math.atan2(ny, nx);
  const sparkCount = impact > crashoutImpactTuning.legendary ? 22 : impact > crashoutImpactTuning.major ? 14 : 7;
  for (let i = 0; i < sparkCount; i += 1) {
    crashoutSpawnParticle("spark", x, y, angle + (Math.random() - 0.5) * 1.6, 180 + Math.random() * 260, 260 + Math.random() * 220, 18 + Math.random() * 18, type === "tbone" ? "#52c7ff" : "#ffc857");
  }
  for (let i = 0; i < (impact > crashoutImpactTuning.major ? 9 : 5); i += 1) {
    crashoutSpawnParticle("smoke", x, y, angle + Math.PI + (Math.random() - 0.5) * 1.1, 40 + Math.random() * 110, 460 + Math.random() * 320, 34 + Math.random() * 26, "#d6d0c4");
  }
  if (impact > crashoutImpactTuning.major) {
    for (let i = 0; i < (impact > crashoutImpactTuning.legendary ? 6 : 3); i += 1) {
      crashoutSpawnParticle("streak", x - nx * 18, y - ny * 18, angle + Math.PI + (Math.random() - 0.5) * 0.24, 70 + Math.random() * 90, 280 + Math.random() * 180, 95 + Math.random() * 35, "#52c7ff");
    }
  }
}

function crashoutTriggerImpactFeedback(impact, x, y, nx, ny, type = "hit", options = {}) {
  if (!crashoutState) return;
  const userInvolved = Boolean(options.userInvolved || options.forceVisual);
  if (!userInvolved) return;
  crashoutSpawnImpactFx(x, y, nx, ny, impact, type);
  if (impact > crashoutImpactTuning.minor) {
    crashoutState.shake = Math.max(crashoutState.shake || 0, crashoutClamp(impact / crashoutImpactTuning.shakeDivisor, 5, 30));
    crashoutPlaySound(type === "headOn" ? "battle-stun" : "battle-hit");
  }
  if (type !== "ringout" && impact > crashoutImpactTuning.major) {
    crashoutState.hitPauseUntil = Math.max(crashoutState.hitPauseUntil || 0, crashoutLocalNow() + crashoutClamp(impact * 0.36, crashoutImpactTuning.hitstopMin, crashoutImpactTuning.hitstopMax));
    const word = type === "headOn" ? "HEAD-ON" : type === "tbone" ? "T-BONE" : impact > crashoutImpactTuning.legendary ? "OOOHHHH!" : "BIG HIT";
    crashoutState.effects.push({ kind: "impactWord", x, y: y - 82, vx: 0, vy: -28, ttl: 780, life: 780, text: word, size: impact > crashoutImpactTuning.legendary ? 44 : 32, tint: type === "tbone" ? "#52c7ff" : "#ffc857", angle: 0, spin: 0 });
  } else if (type === "ringout") {
    crashoutState.effects.push({ kind: "impactWord", x, y: y - 82, vx: 0, vy: -28, ttl: 720, life: 720, text: "CRASH!", size: 32, tint: "#ff805f", angle: 0, spin: 0 });
  }
  if (type === "headOn" && impact > 145) crashoutAnnounce("headOn", { major: true, cooldown: 3200 });
  else if (type === "tbone" && impact > 138) crashoutAnnounce("tBone", { major: true, cooldown: 3000 });
  else if (impact > 160) crashoutAnnounce("bigHit", { cooldown: 2200 });
  if (impact > crashoutImpactTuning.legendary && Math.random() < 0.5) crashoutAnnounce("crowdChaos", { cooldown: 3400 });
}

function crashoutAiControls(car) {
  const activeRadius = crashoutActiveRadius();
  const edgeDistance = crashoutDistanceFromCenter(car);
  const liveCount = crashoutLiveCars().length;
  const nearEdge = edgeDistance > activeRadius * (car.archetype === "Defender" ? 0.68 : 0.76);
  let target = crashoutNearestOpponent(car) || { x: crashoutArena.cx, y: crashoutArena.cy };
  if (nearEdge) {
    target = { x: crashoutArena.cx, y: crashoutArena.cy };
  } else if (car.archetype === "Tank" && edgeDistance > activeRadius * 0.35) {
    target = { x: crashoutArena.cx, y: crashoutArena.cy };
  } else if (car.archetype === "Coward" && liveCount > 4) {
    const threat = crashoutNearestOpponent(car);
    target = threat ? { x: car.x + (car.x - threat.x), y: car.y + (car.y - threat.y) } : { x: crashoutArena.cx, y: crashoutArena.cy };
  } else if (car.archetype === "Trickster" && !car.item) {
    target = crashoutNearestItemBox(car) || target;
  } else if (car.archetype === "Opportunist") {
    target = crashoutMostDamagedOpponent(car) || target;
  }
  const swapPad = nearEdge ? null : crashoutAiSwapTarget(car);
  if (swapPad) target = swapPad;
  const desired = Math.atan2(target.y - car.y, target.x - car.x);
  const delta = betaNormalizeAngle(desired - car.angle);
  const speed = Math.hypot(car.vx, car.vy);
  const aggression = (crashoutState?.suddenDeath ? 1.65 : 1) * (liveCount <= 2 ? 1.35 : 1);
  const difficultyAggression = crashoutCurrentSettings().aiDifficulty === "aggro" ? 1.45 : crashoutCurrentSettings().aiDifficulty === "chill" ? 0.72 : 1;
  const itemChance = car.archetype === "Trickster" ? 0.036 : 0.018;
  if (car.item) {
    const surrounded = crashoutLiveCars().some((target) => crashoutAreFoes(car, target) && Math.hypot(target.x - car.x, target.y - car.y) < 160);
    const targetNearEdge = target?.id && crashoutShapeBoundary(target.x, target.y).edge > 0.78;
    const shouldUse =
      (car.item.id === "teleport" && nearEdge) ||
      ((car.item.id === "shield" || car.item.id === "anchor") && (nearEdge || surrounded)) ||
      (car.item.id === "overhaul" && surrounded) ||
      (car.item.id === "antiMagnet" && surrounded) ||
      (car.item.id === "grapple" && targetNearEdge) ||
      (car.item.id === "reverse" && Math.random() < 0.006 * (crashoutCurrentSettings().items === "chaos" ? 2 : 1)) ||
      (!nearEdge && Math.random() < itemChance * aggression * difficultyAggression);
    if (shouldUse) crashoutUseItem(car);
  }
  if (crashoutAiShouldUseSpecial(car, target, nearEdge, aggression * difficultyAggression)) crashoutUseSpecial(car);
  const cautious = car.archetype === "Coward" && liveCount > 4 || car.archetype === "Defender";
  const ramControl = crashoutAiRamControl(car, swapPad ? null : target, delta, nearEdge, aggression * difficultyAggression);
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
function crashoutStatT(value) {
  return crashoutClamp(((value || 70) - 60) / 40, 0, 1);
}

// 4C: active reload. While the ram recovers, tap it inside the early window for an
// instant full bar. Tap anywhere else and it jams: back to 0 and a longer reset.
// One try per recovery. Player-controlled cars only (AI never taps during recovery).
const crashoutReloadTuning = { from: 0.15, to: 0.35, missPenalty: 1.5 };

function crashoutMakeRamState() {
  return { phase: "ready", held: false, heldMs: 0, charge: 0, perfect: false, timerMs: 0, recoverMs: 0, recoverTotalMs: 1, dashSpeed: 0, hitMultiplier: 1, dashStartedAt: 0, dodgeUntil: 0, lockUntilRelease: false, reloadTried: false, reloadMissed: false };
}

function crashoutTryActiveReload(car) {
  const ram = car.ram;
  const R = crashoutReloadTuning;
  ram.reloadTried = true;
  const progress = 1 - ram.recoverMs / ram.recoverTotalMs;
  if (progress >= R.from && progress <= R.to) {
    ram.phase = "ready";
    ram.recoverMs = 0;
    ram.lockUntilRelease = true;
    crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70 * CRASHOUT_CAR_SCALE, vx: 0, vy: -30, ttl: 600, life: 600, text: "RELOADED!", size: 24, tint: "#9cf8ff", angle: 0, spin: 0 });
    return true;
  }
  const total = ram.recoverTotalMs * R.missPenalty;
  ram.recoverMs = total;
  ram.recoverTotalMs = total;
  ram.reloadMissed = true;
  crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70 * CRASHOUT_CAR_SCALE, vx: 0, vy: -24, ttl: 600, life: 600, text: "JAMMED", size: 22, tint: "#ff805f", angle: 0, spin: 0 });
  return false;
}

function crashoutRamZone(car) {
  const ram = car?.ram;
  if (!ram) return "ready";
  if (ram.phase !== "charging") return ram.phase;
  const p = car.physics;
  if (ram.heldMs < p.ramFillMs) return "building";
  if (ram.heldMs <= p.ramFillMs + p.ramPerfectMs) return "perfect";
  return "overheat";
}

function crashoutStartRamRecovery(car, ms) {
  const ram = car.ram;
  ram.phase = "recovering";
  ram.recoverMs = Math.max(1, ms);
  ram.recoverTotalMs = ram.recoverMs;
  ram.reloadTried = false;
  ram.reloadMissed = false;
  ram.heldMs = 0;
  ram.charge = 0;
  ram.perfect = false;
  ram.timerMs = 0;
  ram.hitMultiplier = 1;
}

function crashoutRamDodge(car, controls, now) {
  const T = crashoutRamTuning;
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
  crashoutStartRamRecovery(car, T.dodgeRecoverMs);
  for (let i = 0; i < 5; i += 1) crashoutSpawnParticle("smoke", car.x, car.y, Math.random() * Math.PI * 2, 30 + Math.random() * 60, 260 + Math.random() * 160, 18 + Math.random() * 12, "#d6d0c4");
}

function crashoutReleaseRam(car, controls, now) {
  const ram = car.ram;
  const p = car.physics;
  const T = crashoutRamTuning;
  if (ram.heldMs < T.tapMs) {
    crashoutRamDodge(car, controls, now);
    return;
  }
  const overdrive = (car.overdriveUntil || 0) > now && crashoutRamZone(car) !== "overheat";
  const perfect = overdrive || crashoutRamZone(car) === "perfect";
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
  for (let i = 0; i < (perfect ? 7 : 4); i += 1) crashoutSpawnParticle("streak", car.x - Math.cos(car.angle) * 24, car.y - Math.sin(car.angle) * 24, car.angle + Math.PI + (Math.random() - 0.5) * 0.3, 120 + Math.random() * 80, 220 + Math.random() * 120, 60 + Math.random() * 30, tint);
  if (perfect && car.player) {
    crashoutState.shake = Math.max(crashoutState.shake || 0, 5);
    crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -32, ttl: 620, life: 620, text: "PERFECT!", size: 28, tint: "#ffc857", angle: 0, spin: 0 });
  }
}

function crashoutRamBurnout(car, now) {
  const ram = car.ram;
  ram.phase = "burnout";
  ram.lockUntilRelease = true;
  ram.timerMs = crashoutRamTuning.burnoutMs;
  ram.charge = 0;
  ram.perfect = false;
  car.damage = Math.min(999, car.damage + crashoutRamTuning.burnoutDamage);
  car.hitFlashUntil = now + 220;
  if (car.player) {
    crashoutState.shake = Math.max(crashoutState.shake || 0, 3);
    crashoutAnnounce("burnout", { cooldown: 6000 });
    crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -24, ttl: 700, life: 700, text: "BURNOUT", size: 26, tint: "#ff805f", angle: 0, spin: 0 });
  }
}

function crashoutUpdateRam(car, controls, dt, now) {
  if (!car.ram) car.ram = crashoutMakeRamState();
  const ram = car.ram;
  const p = car.physics;
  const ms = dt * 1000;
  const wantsCharge = Boolean(controls.charge);
  const released = !wantsCharge && ram.held;
  const pressed = wantsCharge && !ram.held;
  ram.held = wantsCharge;
  if (!wantsCharge) ram.lockUntilRelease = false;
  const jammed = car.ramJammedUntil > now;
  if (ram.phase === "recovering" && pressed && !ram.reloadTried && !car.ai && crashoutTryActiveReload(car)) {
    // Reloaded: ready now; the held press is locked until release so it can't start a charge or a dodge.
  } else if (ram.phase === "recovering") {
    ram.recoverMs -= ms;
    if (ram.recoverMs <= 0) { ram.phase = "ready"; ram.recoverMs = 0; }
  } else if (ram.phase === "burnout") {
    ram.timerMs -= ms;
    if (Math.random() < 0.4) crashoutSpawnParticle("smoke", car.x, car.y, Math.random() * Math.PI * 2, 20 + Math.random() * 40, 420 + Math.random() * 260, 26 + Math.random() * 18, "#8d8a86");
    if (ram.timerMs <= 0) crashoutStartRamRecovery(car, p.ramRecoverMs);
  } else if (ram.phase === "dashing") {
    ram.timerMs -= ms;
    if (Math.random() < 0.5) crashoutSpawnParticle("streak", car.x - Math.cos(car.angle) * 26, car.y - Math.sin(car.angle) * 26, car.angle + Math.PI, 60, 160, 40 + ram.charge * 30, ram.perfect ? "#ffc857" : car.player ? "#52c7ff" : "#ff805f");
    if (ram.timerMs <= 0) crashoutStartRamRecovery(car, p.ramRecoverMs);
  }
  if (ram.phase === "ready") {
    if (wantsCharge && !ram.lockUntilRelease && !jammed) { ram.phase = "charging"; ram.heldMs = 0; ram.charge = 0; ram.perfect = false; }
  } else if (ram.phase === "charging") {
    if (jammed) {
      crashoutStartRamRecovery(car, p.ramRecoverMs * 0.5);
      ram.lockUntilRelease = ram.held;
    } else if (released) {
      crashoutReleaseRam(car, controls, now);
    } else {
      ram.heldMs += ms;
      ram.charge = Math.min(1, ram.heldMs / p.ramFillMs);
      if (crashoutRamZone(car) === "overheat" && Math.random() < 0.25) crashoutSpawnParticle("smoke", car.x, car.y, car.angle + Math.PI + (Math.random() - 0.5), 30 + Math.random() * 30, 300, 16 + Math.random() * 10, "#a5a09a");
      if (ram.heldMs > p.ramFillMs + p.ramPerfectMs + p.ramOverheatMs) crashoutRamBurnout(car, now);
    }
  }
}

function crashoutRamHitMultiplier(car) {
  return car?.ram?.phase === "dashing" ? car.ram.hitMultiplier : 1;
}

function crashoutFinishRamHit(car, now) {
  if (car?.ram?.phase !== "dashing") return;
  const perfect = car.ram.perfect;
  crashoutStartRamRecovery(car, car.physics.ramRecoverMs);
  if (car.player && crashoutState?.stats) {
    crashoutState.stats.ramHits = (crashoutState.stats.ramHits || 0) + 1;
    if (perfect) {
      crashoutState.stats.perfectRams = (crashoutState.stats.perfectRams || 0) + 1;
      crashoutAnnounce("perfectRam", { major: true, cooldown: 2500 });
    }
  }
}

function crashoutAiRamControl(car, target, delta, nearEdge, aggression) {
  const ram = car.ram;
  const p = car.physics;
  const now = crashoutLocalNow();
  const skill = crashoutAiRamSkill[crashoutCurrentSettings().aiDifficulty] || crashoutAiRamSkill.normal;
  if (!ram) return { charge: false, dodgeSide: 0 };
  if (ram.phase === "charging" && car.aiPendingDodge) {
    const side = car.aiPendingDodge;
    car.aiPendingDodge = 0;
    return { charge: false, dodgeSide: side };
  }
  if (ram.phase === "charging") return { charge: ram.heldMs < (car.aiRamReleaseMs ?? p.ramFillMs * 0.7), dodgeSide: 0 };
  if (ram.phase !== "ready") return { charge: false, dodgeSide: 0 };
  const threat = crashoutLiveCars().find((other) => {
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

function crashoutDrawRamAura(ctx, car) {
  const ram = car.ram;
  if (!ram || (ram.phase !== "charging" && ram.phase !== "dashing")) return;
  const zone = crashoutRamZone(car);
  const t = performance.now();
  ctx.save();
  if (zone === "building") {
    ctx.globalAlpha = 0.4 + ram.charge * 0.6;
    crashoutInkRing(ctx, car.x, car.y, 48 - ram.charge * 12, car.player ? "#52c7ff" : "#ff805f", 3 + ram.charge * 3);
  } else if (zone === "perfect") {
    ctx.globalAlpha = 0.75 + Math.sin(t / 40) * 0.25;
    crashoutInkRing(ctx, car.x, car.y, 36, "#ffc857", 7);
  } else if (zone === "overheat") {
    ctx.globalAlpha = 0.55 + Math.random() * 0.4;
    crashoutInkRing(ctx, car.x, car.y, 36 + Math.random() * 4, "#ff4a3d", 5);
  } else if (zone === "dashing" && ram.perfect) {
    ctx.globalAlpha = 0.75;
    crashoutInkRing(ctx, car.x, car.y, 40, "#ffc857", 4);
  }
  ctx.restore();
}

function crashoutUpdateCar(car, dt, now) {
  if (car.eliminated) return;
  if (car.respawnAt) {
    if (now >= car.respawnAt) {
      if (Number.isInteger(car.pendingCrewIndex) && car.pendingCrewIndex >= 0) {
        crashoutLoadCrewMember(car, car.pendingCrewIndex);
        car.pendingCrewIndex = null;
        car.nextUp = crashoutDefaultNextUp(car);
      }
      const point = crashoutSafePoint(Math.random() * 8);
      Object.assign(car, { x: point.x, y: point.y, vx: 0, vy: 0, angle: point.angle, respawnAt: 0, invulnerableUntil: now + 1800, hang: null, launchSpeed: 0 });
    }
    return;
  }
  const controls = crashoutControlsFor(car);
  crashoutRecoveryBurst(car, controls, now);
  const speed = Math.hypot(car.vx, car.vy);
  const oilSliding = car.oilSlideUntil > now;
  const handlingWeak = car.handlingWeakUntil > now;
  const anchored = car.anchorUntil > now;
  const overhauled = car.overhaulUntil > now;
  const turnPenalty = oilSliding ? 0.38 : handlingWeak ? 0.68 : overhauled ? 0.84 : 1;
  crashoutUpdateRam(car, controls, dt, now);
  const ramPhase = car.ram.phase;
  const charging = ramPhase === "charging";
  const dashing = ramPhase === "dashing";
  const burntOut = ramPhase === "burnout";
  const dodging = car.ram.dodgeUntil > now;
  const turnScale = charging
    ? crashoutRamTuning.chargeTurnBoost * turnPenalty
    : Math.min(1, Math.max(car.player ? CRASHOUT_PLAYER_STEER.lowSpeedFloor : 0.35, speed / (car.player ? CRASHOUT_PLAYER_STEER.fullTurnSpeed : 190))) * turnPenalty * (dashing ? crashoutRamTuning.dashTurnScale : 1);
  const steerInput = Number.isFinite(controls.steer)
    ? crashoutClamp(controls.steer, -1, 1)
    : (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  if (steerInput) car.angle += car.physics.turnRate * turnScale * (car.player ? CRASHOUT_PLAYER_STEER.boost : 1) * (car.hang ? crashoutKnockTuning.voidTurnBoost : 1) * dt * steerInput;
  const throttle = Number.isFinite(controls.throttle) ? crashoutClamp(controls.throttle, 0, 1) : 1;
  const boostActive = car.boostUntil > now;
  const accelBoost = (boostActive ? 1.32 : 1) * (anchored ? 0.56 : overhauled ? 0.86 : 1);
  if (controls.up && !dashing && !burntOut) {
    const drive = (charging ? crashoutRamTuning.chargeThrottle : 1) * (car.hang ? crashoutKnockTuning.voidThrottle : crashoutIsLaunched(car) ? crashoutKnockTuning.launchThrottle : 1);
    car.vx += Math.cos(car.angle) * car.physics.acceleration * accelBoost * throttle * drive * dt;
    car.vy += Math.sin(car.angle) * car.physics.acceleration * accelBoost * throttle * drive * dt;
  }
  if (controls.down && !dashing) {
    car.vx -= Math.cos(car.angle) * car.physics.brake * dt;
    car.vy -= Math.sin(car.angle) * car.physics.brake * dt;
  }
  if (charging || burntOut) {
    const keep = Math.pow(charging ? crashoutRamTuning.chargeMoveDrag : crashoutRamTuning.chargeDrag, dt * 60);
    car.vx *= keep;
    car.vy *= keep;
  }
  if (dashing) {
    const blend = 1 - Math.pow(1 - crashoutRamTuning.dashSteerBlend, dt * 60);
    car.vx = crashoutLerp(car.vx, Math.cos(car.angle) * car.ram.dashSpeed, blend);
    car.vy = crashoutLerp(car.vy, Math.sin(car.angle) * car.ram.dashSpeed, blend);
  }
  const baseMaxSpeed = car.physics.maxSpeed * (boostActive ? 1.25 : 1) * (anchored ? crashoutItemTuning.anchorSpeedMultiplier : overhauled ? 0.92 : 1);
  const maxSpeed = dashing
    ? Math.max(baseMaxSpeed, car.ram.dashSpeed)
    : dodging
      ? Math.max(baseMaxSpeed, car.physics.ramDodgeImpulse * 1.1)
      : baseMaxSpeed;
  const newSpeed = Math.hypot(car.vx, car.vy);
  const speedCap = Math.max(maxSpeed, car.launchSpeed || 0);
  if (newSpeed > speedCap) {
    car.vx = (car.vx / newSpeed) * speedCap;
    car.vy = (car.vy / newSpeed) * speedCap;
  }
  const launched = crashoutIsLaunched(car);
  const friction = car.hang
    ? crashoutKnockTuning.voidDrag
    : dashing ? crashoutRamTuning.dashFriction : launched ? crashoutKnockTuning.launchFriction : oilSliding ? 0.996 : controls.up || controls.down ? 0.992 : 0.982;
  car.vx *= Math.pow(friction, dt * 60);
  car.vy *= Math.pow(friction, dt * 60);
  if (car.launchSpeed) {
    car.launchSpeed *= Math.pow(crashoutKnockTuning.launchFriction, dt * 60);
    if (car.launchSpeed < car.physics.maxSpeed) car.launchSpeed = 0;
    if (launched && Math.random() < 0.45) crashoutSpawnParticle("smoke", car.x, car.y, Math.atan2(-car.vy, -car.vx) + (Math.random() - 0.5) * 0.5, 40 + Math.random() * 40, 320 + Math.random() * 200, 16 + Math.random() * 12, "#d6d0c4");
  }
  car.prevX = car.x;
  car.prevY = car.y;
  car.x += car.vx * dt;
  car.y += car.vy * dt;
  crashoutWallBounce(car, now);
  const boundary = crashoutShapeBoundary(car.x, car.y, now);
  if (boundary.edge > 0.96 && boundary.edge < 1.08 && Math.random() < 0.18) {
    const nx = boundary.nx || ((car.x - crashoutArena.cx) / (crashoutDistanceFromCenter(car) || 1));
    const ny = boundary.ny || ((car.y - crashoutArena.cy) / (crashoutDistanceFromCenter(car) || 1));
    crashoutSpawnParticle("spark", car.x - nx * 12, car.y - ny * 12, Math.atan2(ny, nx) + Math.PI + (Math.random() - 0.5), 90 + Math.random() * 130, 240 + Math.random() * 170, 14 + Math.random() * 14, "#ff8c26");
    if (car.player) crashoutState.shake = Math.max(crashoutState.shake || 0, 2.5);
  }
  if (car.player && boundary.safe && boundary.edge > 0.92 && Math.hypot(car.vx, car.vy) > 160 && Math.random() < 0.016) {
    crashoutAnnounce("edgeSave", { major: true, cooldown: 5200 });
  }
  crashoutEdgeCheck(car, boundary, now);
}

function crashoutLoseLife(car, now) {
  if (car.respawnAt || car.eliminated) return;
  const distance = crashoutDistanceFromCenter(car) || 1;
  const nx = (car.x - crashoutArena.cx) / distance;
  const ny = (car.y - crashoutArena.cy) / distance;
  crashoutState.ringFlashes.push({ x: car.x, y: car.y, radius: crashoutActiveRadius(now), ttl: 720, life: 720 });
  crashoutCrowdPulse(car.x, car.y, car.player ? 1 : 0.75);
  if (car.player) crashoutTriggerImpactFeedback(185, car.x, car.y, nx, ny, "ringout", { forceVisual: true });
  if (car.player) crashoutState.stats.playerRingOuts += 1;
  if (crashoutIsEvoRush()) {
    crashoutEvoRingOut(car, now);
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
  car.ram = crashoutMakeRamState();
  car.ironWallUntil = 0;
  car.overdriveUntil = 0;
  car.handlingWeakUntil = 0;
  car.grapple = null;
  if (car.player && car.lives === 1 && !crashoutState.playerLastLifeCalled) {
    crashoutState.playerLastLifeCalled = true;
    crashoutAnnounce("lastLife", { major: true, force: true });
  }
  if (car.lives <= 0) {
    car.eliminated = true;
    car.vx = 0;
    car.vy = 0;
    if (car.lastHitBy === "player" && now - (car.lastHitAt || 0) < 4500) {
      crashoutState.stats.playerKOs += 1;
      crashoutAnnounce(crashoutState.stats.playerKOs >= 2 ? "koStreak" : "gearOut", { major: crashoutState.stats.playerKOs >= 2, cooldown: 1200 });
    }
    if (!crashoutState.firstEliminationCalled) {
      crashoutState.firstEliminationCalled = true;
      crashoutAnnounce("firstGearOut", { major: true, force: true });
    } else {
      crashoutAnnounce("gearOut", { cooldown: 1700 });
    }
    if (car.player && !crashoutTeammateAlive(car)) finishCrashoutBeta(false);
    return;
  }
  if (car.crew) car.pendingCrewIndex = crashoutResolveNextUp(car);
  car.respawnAt = now + 1050;
}

function crashoutResolveCollisions(now) {
  const live = crashoutLiveCars().filter((car) => !car.respawnAt);
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
      const aRam = crashoutRamHitMultiplier(a);
      const bRam = crashoutRamHitMultiplier(b);
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
        crashoutApplyHit(a, b, impact * 0.66 * bRam, -nx, -ny, now);
        crashoutApplyHit(b, a, impact * 0.66 * aRam, nx, ny, now);
        crashoutTriggerImpactFeedback(impact * Math.max(aRam, bRam), impactX, impactY, nx, ny, "headOn", { userInvolved: a.player || b.player });
      } else if (aForward > bForward) {
        crashoutApplyHit(b, a, impact * (aTbone ? 1.35 : 0.82) * aRam, nx, ny, now);
        crashoutTriggerImpactFeedback(impact * (aTbone ? 1.35 : 0.82) * aRam, impactX, impactY, nx, ny, aTbone ? "tbone" : "hit", { userInvolved: a.player });
      } else {
        crashoutApplyHit(a, b, impact * (bTbone ? 1.35 : 0.82) * bRam, -nx, -ny, now);
        crashoutTriggerImpactFeedback(impact * (bTbone ? 1.35 : 0.82) * bRam, impactX, impactY, -nx, -ny, bTbone ? "tbone" : "hit", { userInvolved: b.player });
      }
      if (aDashing) crashoutFinishRamHit(a, now);
      if (bDashing) crashoutFinishRamHit(b, now);
      const impulse = impact * 0.18;
      const aMass = a.physics.mass * (a.anchorUntil > now ? 2.4 : 1) * (a.overhaulUntil > now ? 1.55 : 1);
      const bMass = b.physics.mass * (b.anchorUntil > now ? 2.4 : 1) * (b.overhaulUntil > now ? 1.55 : 1);
      const aPush = impulse * aRam * (a.bubbleUntil > now ? crashoutItemTuning.bubbleImpulse : 1);
      const bPush = impulse * bRam * (b.bubbleUntil > now ? crashoutItemTuning.bubbleImpulse : 1);
      a.vx -= nx * bPush / aMass;
      a.vy -= ny * bPush / aMass;
      b.vx += nx * aPush / bMass;
      b.vy += ny * aPush / bMass;
      crashoutMarkLaunch(a);
      crashoutMarkLaunch(b);
    }
  }
}

function crashoutApplyHit(receiver, attacker, impact, nx, ny, now) {
  if (receiver.invulnerableUntil > now) return;
  if (attacker && !crashoutAreFoes(receiver, attacker)) return;
  if (receiver.shieldHits > 0 || receiver.bubbleUntil > now) {
    if (receiver.shieldHits > 0) receiver.shieldHits -= 1;
    receiver.bubbleFlashUntil = now + 240;
    receiver.hitFlashUntil = now + 180;
    receiver.vx += nx * impact * 0.08 * crashoutItemTuning.bubbleKnockbackTaken;
    receiver.vy += ny * impact * 0.08 * crashoutItemTuning.bubbleKnockbackTaken;
    if (attacker) {
      attacker.vx -= nx * impact * 0.18;
      attacker.vy -= ny * impact * 0.18;
    }
    return;
  }
  const attackerBonus = attacker?.overhaulUntil > now ? crashoutItemTuning.overhaulDamageDealt : 1;
  const adjustedImpact = impact * attackerBonus * (attacker?.archetype === "Tank" ? 1.14 : attacker?.archetype === "Aggro" ? 1.06 : 1);
  const defensiveMultiplier = (receiver.ironWallUntil || 0) > now ? crashoutSpecialTuning.ironWallDamage : receiver.anchorUntil > now ? 0.62 : receiver.overhaulUntil > now ? crashoutItemTuning.overhaulDamageTaken : 1;
  const bodyReducer = crashoutClamp(1 - (receiver.physics.body - 70) / 180, 0.48, 1.35);
  const damage = Math.max(1, adjustedImpact / 18) * bodyReducer * defensiveMultiplier;
  receiver.damage = Math.min(999, receiver.damage + damage);
  receiver.lastHitBy = attacker?.id || null;
  receiver.lastHitAt = now;
  if (attacker?.player && crashoutState?.stats) {
    crashoutState.stats.damageDealt += damage;
    crashoutState.stats.biggestHit = Math.max(crashoutState.stats.biggestHit, adjustedImpact);
    crashoutSpawnDamagePopup(receiver.x, receiver.y, damage, adjustedImpact);
  }
  if (receiver.player && receiver.lives <= 1 && receiver.damage > 90) {
    crashoutAnnounce("comeback", { major: true, cooldown: 5200 });
  }
  if (receiver.player && receiver.damage > 150 && Math.random() < 0.08) {
    crashoutAnnounce("underdog", { cooldown: 7000 });
  }
  const knockReducer = (receiver.ironWallUntil || 0) > now ? crashoutSpecialTuning.ironWallKnock : receiver.anchorUntil > now ? crashoutItemTuning.anchorKnockbackTaken : receiver.overhaulUntil > now ? 0.7 : 1;
  const knock = crashoutKnockback(receiver, adjustedImpact, knockReducer);
  receiver.vx += nx * knock;
  receiver.vy += ny * knock;
  receiver.launchSpeed = Math.max(receiver.launchSpeed || 0, Math.hypot(receiver.vx, receiver.vy));
  if (attacker?.player && adjustedImpact > crashoutImpactTuning.major) {
    for (let i = 0; i < 3; i += 1) {
      crashoutSpawnParticle("streak", receiver.x - nx * 18, receiver.y - ny * 18, Math.atan2(ny, nx) + Math.PI + (Math.random() - 0.5) * 0.18, 90 + Math.random() * 90, 260 + Math.random() * 160, 86 + Math.random() * 34, "#52c7ff");
    }
  }
  receiver.hitFlashUntil = now + 220;
  if (attacker) attacker.hitFlashUntil = now + 120;
}

function crashoutSpawnDamagePopup(x, y, damage, impact) {
  if (!crashoutState) return;
  crashoutState.effects.push({
    kind: "text",
    x,
    y: y - 42,
    vx: (Math.random() - 0.5) * 35,
    vy: -46,
    ttl: 720,
    life: 720,
    text: `+${Math.round(damage)}%`,
    size: impact > crashoutImpactTuning.major ? 26 : 18,
    tint: impact > crashoutImpactTuning.major ? "#ffc857" : "#ffffff",
    angle: 0,
    spin: 0
  });
}

function crashoutUseItem(car = crashoutPlayer()) {
  if (!crashoutState?.active || crashoutState.finished || !car?.item || car.eliminated || car.respawnAt) return false;
  const now = performance.now() - (crashoutState.startedAt || performance.now());
  const item = car.item;
  if (item.id === "grapple" && car.grapple?.state === "latched") {
    const target = crashoutState.cars.find((entry) => entry.id === car.grapple.targetId && !entry.eliminated);
    if (target) {
      const dx = car.x - target.x;
      const dy = car.y - target.y;
      const mag = Math.hypot(dx, dy) || 1;
      if (target.bubbleUntil > now) {
        target.bubbleFlashUntil = now + 260;
      } else {
        crashoutApplyHit(target, car, crashoutItemTuning.grappleDamage * 18, dx / mag, dy / mag, now);
        target.vx += (dx / mag) * crashoutItemTuning.grappleForce;
        target.vy += (dy / mag) * crashoutItemTuning.grappleForce;
      }
      crashoutTriggerImpactFeedback(150, target.x, target.y, dx / mag, dy / mag, "hit", { userInvolved: car.player });
    }
    car.grapple = null;
    car.item = null;
    updateCrashoutHud(true);
    return true;
  }
  car.item = null;
  if (car.player && crashoutState?.stats) {
    crashoutState.stats.itemUses[item.id] = (crashoutState.stats.itemUses[item.id] || 0) + 1;
  }
  if (item.id === "shield") {
    car.shieldHits = 1;
    car.bubbleUntil = now + crashoutItemTuning.bubbleDuration;
  } else if (item.id === "teleport") {
    const point = crashoutFindSafeTeleportPoint(car);
    Object.assign(car, { x: point.x, y: point.y, vx: 0, vy: 0, angle: point.angle, invulnerableUntil: now + crashoutItemTuning.teleportInvulnerable });
  } else if (item.id === "turbo") {
    car.boostUntil = now + 1200;
    car.vx += Math.cos(car.angle) * 170;
    car.vy += Math.sin(car.angle) * 170;
  } else if (item.id === "burst") {
    crashoutState.projectiles.push({ id: `lg-emp-${Date.now()}-${Math.random()}`, type: "empPulse", owner: car.id, x: car.x, y: car.y, radius: 0, maxRadius: crashoutItemTuning.empRange, expiresAt: now + 520 });
  } else if (item.id === "oil" || item.id === "tire") {
    crashoutState.hazards.push({
      id: `lg-hazard-${Date.now()}-${Math.random()}`,
      type: item.id,
      owner: car.id,
      x: car.x - Math.cos(car.angle) * 48,
      y: car.y - Math.sin(car.angle) * 48,
      radius: item.id === "oil" ? 42 : 34,
      expiresAt: now + 12000
    });
  } else if (item.id === "grapple") {
    const target = crashoutNearestValidGrappleTarget(car);
    if (target) {
      car.grapple = { state: "latched", targetId: target.id, expiresAt: now + crashoutItemTuning.grappleLatchDuration };
      car.item = item;
      crashoutState.effects.push({ kind: "grappleLatch", x: target.x, y: target.y, vx: 0, vy: 0, ttl: 420, life: 420, size: 64, tint: "#52c7ff", angle: 0, spin: 0 });
    } else {
      car.grapple = { state: "miss", x: car.x + Math.cos(car.angle) * 130, y: car.y + Math.sin(car.angle) * 130, expiresAt: now + 500 };
    }
  } else if (item.id === "antiMagnet") {
    car.antiMagnetUntil = now + crashoutItemTuning.antiMagnetDuration;
  } else if (item.id === "anchor") {
    car.anchorUntil = now + crashoutItemTuning.anchorDuration;
  } else if (item.id === "reverse") {
    crashoutLiveCars().forEach((target) => {
      if (crashoutAreFoes(car, target) && target.bubbleUntil <= now) target.reverseUntil = now + crashoutItemTuning.reverseDuration;
    });
  } else if (item.id === "overhaul") {
    car.overhaulUntil = now + crashoutItemTuning.overhaulDuration;
  }
  updateCrashoutHud(true);
  return true;
}

function crashoutFindSafeTeleportPoint(car) {
  for (let attempt = 0; attempt < 36; attempt += 1) {
    const point = crashoutSafePoint(Math.random() * 8);
    if (!crashoutShapeBoundary(point.x, point.y).safe) continue;
    const overlapsCar = crashoutLiveCars().some((target) => target.id !== car.id && Math.hypot(target.x - point.x, target.y - point.y) < 110);
    const overlapsHazard = crashoutState.hazards.some((hazard) => Math.hypot(hazard.x - point.x, hazard.y - point.y) < hazard.radius + 80);
    if (!overlapsCar && !overlapsHazard) return point;
  }
  return crashoutSafePoint(Math.random() * 8);
}

function crashoutNearestValidGrappleTarget(car) {
  return crashoutLiveCars()
    .filter((target) => crashoutAreFoes(car, target) && !target.respawnAt)
    .map((target) => ({ target, distance: Math.hypot(target.x - car.x, target.y - car.y) }))
    .filter((entry) => entry.distance <= crashoutItemTuning.grappleRange)
    .sort((a, b) => a.distance - b.distance)[0]?.target || null;
}

function crashoutUseSpecial(car = crashoutPlayer()) {
  if (!crashoutState?.active || crashoutState.finished || !car || car.eliminated || car.respawnAt) return false;
  const now = crashoutLocalNow();
  if (now < (car.specialCooldownUntil || 0)) return false;
  const special = crashoutSpecialFor(car);
  const T = crashoutSpecialTuning;
  car.specialCooldownUntil = now + special.cooldown;
  const others = crashoutLiveCars().filter((target) => crashoutAreFoes(car, target) && !target.respawnAt);
  if (special.effect === "shunt") {
    const sideAngle = car.angle + Math.PI / 2;
    const sx = Math.cos(sideAngle);
    const sy = Math.sin(sideAngle);
    others.forEach((target) => {
      const dLeft = Math.hypot(target.x - (car.x + sx * T.shuntReach), target.y - (car.y + sy * T.shuntReach));
      const dRight = Math.hypot(target.x - (car.x - sx * T.shuntReach), target.y - (car.y - sy * T.shuntReach));
      if (dLeft < target.radius + 40) crashoutApplyHit(target, car, T.shuntImpact, sx, sy, now);
      else if (dRight < target.radius + 40) crashoutApplyHit(target, car, T.shuntImpact, -sx, -sy, now);
    });
    crashoutSpecialRing(car, 100, special.tint);
  } else if (special.effect === "frontslam") {
    const fx = car.x + Math.cos(car.angle) * T.slamReach;
    const fy = car.y + Math.sin(car.angle) * T.slamReach;
    others.forEach((target) => {
      if (Math.hypot(target.x - fx, target.y - fy) > target.radius + 50) return;
      crashoutApplyHit(target, car, T.slamImpact, Math.cos(car.angle), Math.sin(car.angle), now);
    });
    crashoutState.effects.push({ kind: "ring", x: fx, y: fy, vx: 0, vy: 0, angle: 0, spin: 0, ttl: 380, life: 380, size: 80, tint: special.tint });
    if (car.player) crashoutState.shake = Math.max(crashoutState.shake || 0, 4);
  } else if (special.effect === "dash") {
    car.vx += Math.cos(car.angle) * T.hopImpulse;
    car.vy += Math.sin(car.angle) * T.hopImpulse;
    car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + T.hopInvulnerableMs);
    for (let i = 0; i < 4; i += 1) crashoutSpawnParticle("streak", car.x, car.y, car.angle + Math.PI + (Math.random() - 0.5) * 0.4, 120, 260, 70, special.tint);
  } else if (special.effect === "ironWall") {
    car.ironWallUntil = now + T.ironWallMs;
    car.vx *= 0.5;
    car.vy *= 0.5;
    crashoutSpecialRing(car, 70, special.tint, 300);
  } else if (special.effect === "snare") {
    others.forEach((target) => {
      const dx = target.x - car.x;
      const dy = target.y - car.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > T.snareRadius) return;
      if (target.ram?.phase === "charging") crashoutStartRamRecovery(target, target.physics.ramRecoverMs * 0.5);
      target.ramJammedUntil = Math.max(target.ramJammedUntil || 0, now + T.snareJamMs);
      crashoutApplyHit(target, car, T.snareImpact, dx / distance, dy / distance, now);
    });
    crashoutSpecialRing(car, T.snareRadius, special.tint, 460);
  } else if (special.effect === "overdrive") {
    if (car.ram && ["recovering", "burnout"].includes(car.ram.phase)) car.ram = crashoutMakeRamState();
    car.overdriveUntil = now + T.overdriveMs;
    crashoutSpecialRing(car, 60, special.tint, 360);
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
      crashoutApplyHit(target, car, T.whipImpact, nx / mag, ny / mag, now);
    });
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      crashoutSpawnParticle("streak", car.x + Math.cos(angle) * 60, car.y + Math.sin(angle) * 60, angle + Math.PI / 2, 140, 280, 50, special.tint);
    }
  }
  if (car.player) {
    crashoutState.stats.specials = (crashoutState.stats.specials || 0) + 1;
    crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 76, vx: 0, vy: -26, ttl: 700, life: 700, text: special.name.toUpperCase(), size: 24, tint: special.tint, angle: 0, spin: 0 });
  }
  updateCrashoutHud(true);
  return true;
}

function crashoutRandomItem(tier = null) {
  const setting = crashoutCurrentSettings().items || "normal";
  if (setting === "off") return null;
  const pickTier = tier || crashoutRollTier(setting);
  const pool = crashoutItemDefinitions.filter((item) => crashoutItemTier(item.id) === pickTier);
  const weighted = [];
  pool.forEach((item) => {
    const weight = Math.max(1, item.weights?.[setting] ?? item.weights?.normal ?? 1);
    for (let i = 0; i < weight; i += 1) weighted.push(item);
  });
  return weighted[Math.floor(Math.random() * weighted.length)] || crashoutItemDefinitions[0];
}

function crashoutUpdateItems(dt, now) {
  crashoutState.itemBoxes.forEach((box) => {
    if (box.placed) Object.assign(box, crashoutPlacedPickupPoint(box.slot, now));
  });
  crashoutState.itemBoxes.forEach((box) => {
    if (!box.active && now >= box.respawnAt) box.active = true;
    if (!box.active) return;
    crashoutLiveCars().forEach((car) => {
      if (!box.active || car.respawnAt || car.item) return;
      if (Math.hypot(car.x - box.x, car.y - box.y) > car.radius + CRASHOUT_ITEM_BOX_SIZE * 0.42) return;
      car.item = box.placed ? box.item : crashoutRandomItem();
      if (!car.item) return;
      box.active = false;
      const setting = crashoutCurrentSettings().items;
      const cadence = crashoutItemCadence[setting] || crashoutItemCadence.normal;
      const speedup = crashoutState.suddenDeath ? 0.62 : 1;
      if (box.placed) {
        box.item = crashoutNextPlacedItem(box.tier, car.item.id);
        box.respawnAt = now + (crashoutPlacedPickupTuning.respawnMs[setting] || crashoutPlacedPickupTuning.respawnMs.normal) * speedup;
        if (car.player) crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -26, ttl: 650, life: 650, text: car.item.name.toUpperCase(), size: 22, tint: crashoutTierColors[box.tier], angle: 0, spin: 0 });
      } else {
        box.respawnAt = now + cadence.respawn * speedup + Math.random() * cadence.variance * speedup;
      }
    });
  });
  crashoutState.hazards = crashoutState.hazards.filter((hazard) => hazard.expiresAt > now);
  crashoutState.hazards.forEach((hazard) => {
    crashoutLiveCars().forEach((car) => {
      if (crashoutIsFriendlyId(car.id, hazard.owner) || car.respawnAt) return;
      if (Math.hypot(car.x - hazard.x, car.y - hazard.y) > hazard.radius + car.radius) return;
      if (car.bubbleUntil > now) {
        car.bubbleFlashUntil = now + 220;
      } else if (hazard.type === "oil") {
        car.oilSlideUntil = now + crashoutItemTuning.oilDuration;
        car.vx *= 0.94;
        car.vy *= 0.94;
      } else {
        car.damage = Math.min(999, car.damage + crashoutItemTuning.spikeDamage);
        car.ramJammedUntil = now + crashoutItemTuning.spikeRamJam;
        car.handlingWeakUntil = now + crashoutItemTuning.spikeHandling;
        crashoutApplyHit(car, null, 68, (car.x - hazard.x) / hazard.radius, (car.y - hazard.y) / hazard.radius, now);
      }
      hazard.expiresAt = 0;
    });
  });
  crashoutState.projectiles = crashoutState.projectiles.filter((projectile) => projectile.expiresAt > now);
  crashoutState.projectiles.forEach((projectile) => {
    if (projectile.type === "empPulse") {
      projectile.radius = crashoutLerp(projectile.radius || 0, projectile.maxRadius, 0.24);
      crashoutLiveCars().forEach((car) => {
        if (crashoutIsFriendlyId(car.id, projectile.owner) || car.respawnAt || car.bubbleUntil > now) return;
        const distance = Math.hypot(car.x - projectile.x, car.y - projectile.y);
        if (distance > projectile.radius || car.empHitAt === projectile.id) return;
        const dx = (car.x - projectile.x) / (distance || 1);
        const dy = (car.y - projectile.y) / (distance || 1);
        car.empHitAt = projectile.id;
        crashoutApplyHit(car, crashoutState.cars.find((entry) => entry.id === projectile.owner), crashoutItemTuning.empDamage * 18, dx, dy, now);
        car.vx += dx * crashoutItemTuning.empForce;
        car.vy += dy * crashoutItemTuning.empForce;
        if (car.ram?.phase === "charging") crashoutStartRamRecovery(car, car.physics.ramRecoverMs * 0.5);
      });
      return;
    }
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    crashoutLiveCars().forEach((car) => {
      if (crashoutIsFriendlyId(car.id, projectile.owner) || car.respawnAt) return;
      if (Math.hypot(car.x - projectile.x, car.y - projectile.y) > car.radius + 18) return;
      const mag = Math.hypot(projectile.vx, projectile.vy) || 1;
      crashoutApplyHit(car, null, 136, projectile.vx / mag, projectile.vy / mag, now);
      projectile.expiresAt = 0;
    });
  });
  crashoutLiveCars().forEach((car) => {
    if (car.grapple?.expiresAt && car.grapple.expiresAt <= now) car.grapple = null;
    if (car.antiMagnetUntil <= now) return;
    crashoutLiveCars().forEach((target) => {
      if (!crashoutAreFoes(car, target) || target.respawnAt || target.bubbleUntil > now) return;
      const dx = target.x - car.x;
      const dy = target.y - car.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > crashoutItemTuning.antiMagnetRange) return;
      const strength = (1 - distance / crashoutItemTuning.antiMagnetRange) * crashoutItemTuning.antiMagnetForce * dt;
      target.vx += (dx / distance) * strength;
      target.vy += (dy / distance) * strength;
    });
  });
}

function crashoutUpdateEffects(dt) {
  if (!crashoutState) return;
  crashoutState.effects = crashoutState.effects.filter((effect) => {
    effect.life -= dt * 1000;
    effect.x += effect.vx * dt;
    effect.y += effect.vy * dt;
    effect.vx *= Math.pow(0.9, dt * 60);
    effect.vy *= Math.pow(0.9, dt * 60);
    effect.angle += effect.spin * dt;
    return effect.life > 0;
  });
  crashoutState.ringFlashes = crashoutState.ringFlashes.filter((flash) => {
    flash.life -= dt * 1000;
    return flash.life > 0;
  });
  crashoutState.shake = Math.max(0, (crashoutState.shake || 0) - dt * 26);
}

function crashoutUpdateSuddenDeath(now) {
  const seconds = Number(crashoutCurrentSettings().suddenDeathSeconds || 0);
  const triggerAt = seconds > 0 ? seconds * 1000 : Infinity;
  if (!crashoutState || crashoutState.suddenDeath || now < triggerAt) return;
  crashoutState.suddenDeath = true;
  crashoutState.suddenDeathStartedAt = now;
  crashoutState.ringFlashes.push({ x: crashoutArena.cx, y: crashoutArena.cy, radius: crashoutArena.radius, ttl: 1200, life: 1200 });
  crashoutState.shake = Math.max(crashoutState.shake || 0, 12);
  crashoutAnnounce("suddenDeath", { major: true, force: true, duration: 2400 });
  crashoutPlaySound("battle-special");
}

function updateCrashoutBeta(now) {
  if (!crashoutState || crashoutState.finished || crashoutState.paused) return;
  if (!crashoutState.startedAt) crashoutState.startedAt = now;
  if (crashoutState.countdownUntil && now < crashoutState.countdownUntil) {
    crashoutUpdateCamera();
    drawCrashoutFrame();
    drawCrashoutCountdown(now);
    crashoutRenderAnnouncer(now - crashoutState.startedAt);
    updateCrashoutHud();
    crashoutState.raf = requestAnimationFrame(updateCrashoutBeta);
    return;
  }
  if (crashoutState.countdownUntil && now >= crashoutState.countdownUntil) {
    crashoutState.countdownUntil = null;
    crashoutState.goUntil = now + 550;
  }
  const localNow = now - crashoutState.startedAt;
  const dt = Math.min(0.035, (now - crashoutState.last) / 1000);
  crashoutState.last = now;
  crashoutUpdateEffects(dt);
  crashoutUpdateSuddenDeath(localNow);
  crashoutRenderAnnouncer(localNow);
  if (crashoutState.hitPauseUntil && localNow < crashoutState.hitPauseUntil) {
    crashoutUpdateCamera();
    drawCrashoutFrame();
    updateCrashoutHud();
    crashoutState.raf = requestAnimationFrame(updateCrashoutBeta);
    return;
  }
  crashoutState.hitPauseUntil = 0;
  crashoutState.cars.forEach((car) => crashoutUpdateCar(car, dt, localNow));
  crashoutResolveCollisions(localNow);
  crashoutUpdateItems(dt, localNow);
  crashoutUpdateSwapPads(dt, localNow);
  crashoutCrowdUpdate(dt, localNow);
  crashoutUpdateCamera();
  const survivors = crashoutLiveCars();
  if (survivors.length === 2 && !crashoutState.finalTwoCalled) {
    crashoutState.finalTwoCalled = true;
    crashoutAnnounce("finalTwo", { major: true, force: true });
  }
  const outcome = crashoutMatchOutcome();
  if (outcome.done && !crashoutState.finished) finishCrashoutBeta(outcome.playerWon);
  if (crashoutIsEvoRush() && !crashoutState.finished) crashoutEvoTick(localNow);
  drawCrashoutFrame();
  if (crashoutState.goUntil && now < crashoutState.goUntil) drawCrashoutCountdown(now);
  updateCrashoutHud();
  crashoutState.raf = requestAnimationFrame(updateCrashoutBeta);
}

function finishCrashoutBeta(playerWon) {
  if (!crashoutState || crashoutState.finished) return;
  crashoutState.finished = true;
  recordTunerStat(playerWon ? "crashoutMatchesWon" : "crashoutMatchesLost");
  recordTunerPlaySession();
  crashoutState.stats.finishTime = performance.now();
  if (crashoutState.raf) cancelAnimationFrame(crashoutState.raf);
  const finalCall = crashoutChooseLine(crashoutFormat().teams ? crashoutAnnouncerLines.teamWinner : crashoutAnnouncerLines.winner);
  crashoutAnnounce("winner", { major: true, force: true, line: finalCall, duration: 5200, legendary: true });
  crashoutPlaySound(playerWon ? "win-jingle" : "lose-jingle");
  setTimeout(() => {
    if (crashoutState?.finished) crashoutRenderAnnouncer(Infinity);
  }, 5300);
  const formatId = crashoutFormatId();
  const resultTitle = formatId === "rally" ? (playerWon ? "Your Team Wins!" : "Your Team Lost") : formatId === "duel" ? (playerWon ? "Duel Won!" : "Duel Lost") : (playerWon ? "Crashout Winner!" : "Eliminated");
  if (el.crashoutResultTitle) el.crashoutResultTitle.textContent = resultTitle;
  if (el.crashoutResultCopy) el.crashoutResultCopy.innerHTML = crashoutResultsMarkup(finalCall);
  if (el.crashoutResults) el.crashoutResults.hidden = false;
  crashoutEvoSyncResultButtons(crashoutIsEvoRush());
  if (crashoutIsEvoRush()) crashoutEvoFinish(playerWon);
  if (crashoutIsBattle()) crashoutBattleFinish(playerWon);
}

function crashoutResultsMarkup(finalCall) {
  const player = crashoutPlayer();
  const winner = crashoutLiveCars()[0] || crashoutState.cars.find((car) => !car.eliminated) || player;
  const liveCars = crashoutLiveCars();
  const stillFighting = Boolean(player?.eliminated && liveCars.length > 1);
  const eliminatedBeforePlayer = crashoutState.cars.filter((car) => car.eliminated && !car.player).length;
  const totalCars = crashoutState.cars.length;
  const placement = player?.eliminated ? Math.max(2, totalCars - eliminatedBeforePlayer) : 1;
  const stats = crashoutState.stats;
  const survivalMs = (stats.finishTime || performance.now()) - stats.startedAt;
  const itemEntry = Object.entries(stats.itemUses || {}).sort((a, b) => b[1] - a[1])[0];
  const favoriteItemDef = itemEntry
    ? (crashoutItemDefinitions.find((item) => item.id === itemEntry[0]) || betaItemDefinitions.find((item) => item.id === itemEntry[0]))
    : null;
  const favoriteItem = itemEntry ? (favoriteItemDef?.name || itemEntry[0]) : "None";
  return `
    <div class="crashout-result-card">
      <p class="crashout-result-call">${finalCall}</p>
      <div class="crashout-result-stats">
        <p><span>${crashoutFormat().teams ? "Format" : "Placement"}</span><strong>${crashoutFormat().teams ? "Rally 2v2" : `#${placement}`}</strong></p>
        ${stillFighting
          ? `<p><span>Still Fighting</span><strong>${liveCars.length}</strong></p>`
          : crashoutFormat().teams
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

function drawCrashoutFrame() {
  if (!crashoutState || !el.crashoutCanvas) return;
  const ctx = el.crashoutCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const canvasW = el.crashoutCanvas.width;
  const canvasH = el.crashoutCanvas.height;
  const viewW = canvasW / ratio;
  const viewH = canvasH / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, viewW, viewH);
  drawCrashoutStadiumBg(ctx, viewW, viewH);
  ctx.save();
  ctx.translate(viewW / 2, viewH / 2);
  const shake = crashoutState.shake || 0;
  if (shake > 0.1) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  crashoutArena.zoom = crashoutViewZoom(viewW, viewH);
  ctx.scale(crashoutArena.zoom, crashoutArena.zoom);
  ctx.translate(-crashoutCamera.x, -crashoutCamera.y);
  drawCrashoutCrowd(ctx);
  crashoutDimCrowd(ctx);
  drawCrashoutArena(ctx);
  drawCrashoutObjects(ctx);
  crashoutState.cars.forEach((car) => drawCrashoutCar(ctx, car));
  ctx.restore();
  drawCrashoutVignette(ctx, viewW, viewH);
}

function drawCrashoutCountdown(now) {
  if (!el.crashoutCanvas || (!crashoutState?.countdownUntil && !crashoutState?.goUntil)) return;
  const ctx = el.crashoutCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.crashoutCanvas.width / ratio;
  const h = el.crashoutCanvas.height / ratio;
  const remaining = Math.max(0, (crashoutState.countdownUntil || 0) - now);
  const seconds = Math.ceil(remaining / 1000);
  const text = crashoutState.goUntil && now < crashoutState.goUntil ? "GO!" : seconds > 0 ? String(seconds) : "GO!";
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

function drawCrashoutStadiumBg(ctx, width, height) {
  if (crashoutImages.arenaBg?.complete && crashoutImages.arenaBg.naturalWidth > 0) {
    ctx.drawImage(crashoutImages.arenaBg, 0, 0, width, height);
    ctx.fillStyle = `rgba(3, 5, 10, ${crashoutReadability.bgDim})`;
    ctx.fillRect(0, 0, width, height);
    return;
  }
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height));
  gradient.addColorStop(0, "#0c1018");
  gradient.addColorStop(1, "#03050a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawCrashoutVignette(ctx, width, height) {
  const intensity = crashoutEdgeIntensity() * 0.35 + (crashoutState?.suddenDeath ? 0.12 : 0);
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

function drawCrashoutArena(ctx) {
  const { cx, cy } = crashoutArena;
  const now = crashoutLocalNow();
  const radius = crashoutActiveRadius(now);
  const shape = crashoutShape();
  const theme = crashoutArenaTheme();
  if (theme.art && !crashoutArenaArtImages[theme.id]) crashoutArenaArtImages[theme.id] = betaMakeImage(theme.art);
  const cityArt = theme.art ? crashoutArenaArtImages[theme.id] : null;
  const shapeArt = !crashoutReadability.useShapeArt
    ? null
    : shape === "circle" && crashoutImages.platform?.complete && crashoutImages.platform.naturalWidth > 0
      ? crashoutImages.platform
      : crashoutImages.arenas?.[shape];
  const platformImg = cityArt?.complete && cityArt.naturalWidth > 0 ? cityArt : shapeArt;
  if (platformImg?.complete && platformImg.naturalWidth > 0) {
    const size = crashoutArena.radius * 2.2;
    ctx.drawImage(platformImg, cx - size / 2, cy - size / 2, size, size);
  } else {
    drawCrashoutProceduralArena(ctx, shape, radius);
  }
  crashoutDrawArenaDecal(ctx, theme, shape, radius);
  crashoutDrawWalls(ctx, theme, radius);
  crashoutRecordSkids();
  crashoutDrawSkids(ctx, shape, radius);
}

function drawCrashoutProceduralArena(ctx, shape, radius) {
  const theme = crashoutArenaTheme();
  const T = crashoutLookTuning;
  const { cx, cy } = crashoutArena;
  const paths = crashoutShapePaths(shape, radius);
  const fillRule = shape === "donut" ? "evenodd" : "nonzero";
  ctx.save();
  ctx.translate(T.platformShadow[0], T.platformShadow[1]);
  ctx.fillStyle = `rgba(0, 0, 0, ${T.platformShadow[2]})`;
  paths.forEach((path) => ctx.fill(path, fillRule));
  ctx.restore();
  ctx.save();
  const clip = new Path2D();
  paths.forEach((path) => clip.addPath(path));
  ctx.clip(clip, fillRule);
  ctx.fillStyle = crashoutMixColor(theme.rim, T.floorBase, T.floorTint);
  ctx.fillRect(cx - radius * 1.4, cy - radius * 1.4, radius * 2.8, radius * 2.8);
  const grain = crashoutConcretePattern(ctx);
  if (grain) {
    ctx.fillStyle = grain;
    ctx.fillRect(cx - radius * 1.4, cy - radius * 1.4, radius * 2.8, radius * 2.8);
  }
  ctx.strokeStyle = "rgba(40, 46, 56, 0.16)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let offset = -radius * 1.3; offset <= radius * 1.3; offset += T.slabSize) {
    ctx.moveTo(cx + offset, cy - radius * 1.3); ctx.lineTo(cx + offset, cy + radius * 1.3);
    ctx.moveTo(cx - radius * 1.3, cy + offset); ctx.lineTo(cx + radius * 1.3, cy + offset);
  }
  ctx.stroke();
  ctx.lineWidth = T.edgeBand;
  ctx.strokeStyle = crashoutColorAlpha(theme.rim, 0.38);
  crashoutStrokeOuterEdges(ctx, paths);
  ctx.setLineDash([50, 50]);
  ctx.strokeStyle = "rgba(20, 22, 28, 0.28)";
  crashoutStrokeOuterEdges(ctx, paths);
  ctx.setLineDash([]);
  ctx.lineWidth = 10;
  ctx.strokeStyle = crashoutColorAlpha(theme.rim, 0.55);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
  ctx.stroke();
  if (theme.name) {
    ctx.font = `900 ${Math.round(radius * 0.16)}px 'Bowlby One', Impact, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = crashoutColorAlpha(theme.rim, 0.32);
    ctx.fillText(theme.name.toUpperCase(), cx, cy + radius * 0.52);
  }
  ctx.restore();
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineWidth = T.rimWidth;
  ctx.strokeStyle = T.outlineColor;
  crashoutStrokeOuterEdges(ctx, paths);
  ctx.lineWidth = T.rimStripe;
  ctx.strokeStyle = theme.rim;
  crashoutStrokeOuterEdges(ctx, paths);
  ctx.restore();
}

function crashoutStrokeOuterEdges(ctx, paths) {
  paths.forEach((path, i) => {
    ctx.save();
    if (paths.length > 1) {
      const outside = new Path2D();
      outside.rect(-100000, -100000, 200000, 200000);
      paths.forEach((other, j) => { if (j !== i) outside.addPath(other); });
      ctx.clip(outside, "evenodd");
    }
    ctx.stroke(path);
    ctx.restore();
  });
}

function crashoutParseHex(hex) {
  const n = parseInt(String(hex || "#888888").replace("#", "").slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function crashoutMixColor(hex, toward, t) {
  const a = crashoutParseHex(hex);
  const b = crashoutParseHex(toward);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
}

function crashoutColorAlpha(hex, alpha) {
  return `rgba(${crashoutParseHex(hex).join(",")},${alpha})`;
}

// 4E: fine concrete grain, a 256px tile built once and reused as a pattern.
let crashoutConcreteTile = null;
function crashoutConcretePattern(ctx) {
  if (!crashoutConcreteTile) {
    crashoutConcreteTile = document.createElement("canvas");
    crashoutConcreteTile.width = crashoutConcreteTile.height = 256;
    const tctx = crashoutConcreteTile.getContext("2d");
    if (!tctx) return null;
    const data = tctx.createImageData(256, 256);
    let seed = 7;
    for (let i = 0; i < data.data.length; i += 4) {
      seed = (seed * 16807) % 2147483647;
      const v = seed % 255 < 128 ? 0 : 255;
      data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
      data.data[i + 3] = seed % 23 < 3 ? 28 : seed % 7 < 2 ? 10 : 0;
    }
    tctx.putImageData(data, 0, 0);
  }
  return ctx.createPattern(crashoutConcreteTile, "repeat");
}

// ─── 5D: sizes, steering, and partial edge walls ───────────────────────────
const CRASHOUT_ITEM_BOX_SIZE = 64;
const CRASHOUT_PLAYER_STEER = { boost: 1.3, lowSpeedFloor: 0.5, fullTurnSpeed: 150 };
// A few stretches of the outer edge get a wall: cars bounce off instead of falling.
// Most of the edge stays open. Walls drop when Sudden Death starts shrinking the ring.
const crashoutWallTuning = { spans: 3, spanDeg: 30, samples: 360, bounce: 0.55, thickness: 30, sparkSpeed: 140 };
let crashoutWallCache = null;

function crashoutWallLayout() {
  const shape = crashoutShape();
  if (crashoutWallCache?.shape === shape && crashoutWallCache.radius === crashoutArena.radius) return crashoutWallCache;
  const T = crashoutWallTuning;
  const { cx, cy, radius } = crashoutArena;
  const edge = [];
  for (let i = 0; i < T.samples; i += 1) {
    const angle = (i / T.samples) * Math.PI * 2;
    let r = radius * 1.8;
    // March in from outside until the first point that is on the platform.
    while (r > 0 && !crashoutShapeBoundary(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 0).safe) r -= 6;
    edge.push(r / radius);
  }
  let seed = 0;
  for (const ch of shape) seed = (seed * 31 + ch.charCodeAt(0)) % 997;
  const offset = (seed / 997) * Math.PI * 2;
  const half = (T.spanDeg * Math.PI / 180) / 2;
  const spans = Array.from({ length: T.spans }, (_, i) => offset + (i / T.spans) * Math.PI * 2)
    .map((mid) => ({ from: mid - half, to: mid + half }));
  crashoutWallCache = { shape, radius, edge, spans };
  return crashoutWallCache;
}

function crashoutAngleInSpan(angle, span) {
  const full = Math.PI * 2;
  const a = ((angle - span.from) % full + full) % full;
  return a <= span.to - span.from;
}

function crashoutWallsActive() {
  return Boolean(crashoutState && !crashoutState.suddenDeath && !crashoutIsEvoRush());
}

function crashoutWallBounce(car, now) {
  if (!crashoutWallsActive() || car.respawnAt || car.eliminated) return;
  const layout = crashoutWallLayout();
  const dx = car.x - crashoutArena.cx;
  const dy = car.y - crashoutArena.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);
  if (!layout.spans.some((span) => crashoutAngleInSpan(angle, span))) return;
  const T = crashoutWallTuning;
  const index = Math.round((((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * T.samples) % T.samples;
  const edgePx = layout.edge[index] * crashoutArena.radius;
  if (edgePx <= 0) return;
  const limit = edgePx - car.radius * 0.6;
  if (dist <= limit || dist > edgePx + 90) return;
  const nx = dx / dist;
  const ny = dy / dist;
  car.x = crashoutArena.cx + nx * limit;
  car.y = crashoutArena.cy + ny * limit;
  const vn = car.vx * nx + car.vy * ny;
  if (vn > 0) {
    car.vx -= (1 + T.bounce) * vn * nx;
    car.vy -= (1 + T.bounce) * vn * ny;
  }
  car.launchSpeed = 0;
  car.hang = null;
  if (vn > T.sparkSpeed) {
    for (let i = 0; i < 4; i += 1) crashoutSpawnParticle("spark", car.x + nx * car.radius, car.y + ny * car.radius, Math.atan2(-ny, -nx) + (Math.random() - 0.5) * 1.2, 120 + Math.random() * 140, 260 + Math.random() * 160, 14 + Math.random() * 12, "#ffd27a");
    if (car.player) crashoutState.shake = Math.max(crashoutState.shake || 0, 4);
  }
}

function crashoutDrawWalls(ctx, theme, radius) {
  if (!crashoutWallsActive()) return;
  const layout = crashoutWallLayout();
  const T = crashoutWallTuning;
  const { cx, cy } = crashoutArena;
  const scale = radius / crashoutArena.radius;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  layout.spans.forEach((span) => {
    const steps = 24;
    const path = new Path2D();
    for (let k = 0; k <= steps; k += 1) {
      const angle = span.from + (span.to - span.from) * (k / steps);
      const index = Math.round((((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * T.samples) % T.samples;
      const r = layout.edge[index] * crashoutArena.radius * scale - T.thickness / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (k === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    }
    // Steel barrier with yellow/black hazard stripes so it never reads as open edge.
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = T.thickness + 10;
    ctx.stroke(path);
    ctx.strokeStyle = "#2b2f36";
    ctx.lineWidth = T.thickness;
    ctx.stroke(path);
    ctx.lineCap = "butt";
    ctx.setLineDash([26, 26]);
    ctx.strokeStyle = "#ffc21a";
    ctx.lineWidth = T.thickness - 10;
    ctx.stroke(path);
    ctx.setLineDash([]);
    ctx.lineCap = "round";
  });
  ctx.restore();
}

function crashoutRecordSkids() {
  if (!crashoutState || crashoutState.paused || crashoutState.finished) return;
  const T = crashoutLookTuning.skids;
  const now = crashoutDrawNow();
  if (!crashoutState.skids) crashoutState.skids = new Map();
  crashoutState.cars.forEach((car) => {
    if (car.eliminated || car.respawnAt) return;
    const slip = Math.abs(-(car.vx || 0) * Math.sin(car.angle) + (car.vy || 0) * Math.cos(car.angle));
    if (slip < T.slipFrom) return;
    const trail = crashoutState.skids.get(car.id) || [];
    crashoutState.skids.set(car.id, trail);
    const point = { x: car.x - Math.cos(car.angle) * 30, y: car.y - Math.sin(car.angle) * 30, t: now, k: crashoutClamp((slip - T.slipFrom) / T.slipRange, 0, 1) };
    const last = trail[trail.length - 1];
    if (!last || Math.hypot(last.x - point.x, last.y - point.y) >= 6) trail.push(point);
    while (trail.length && (trail.length > T.maxPoints || now - trail[0].t > T.fadeMs)) trail.shift();
  });
}

function crashoutDrawSkids(ctx, shape, radius) {
  if (!crashoutState?.skids) return;
  const T = crashoutLookTuning.skids;
  const now = crashoutDrawNow();
  ctx.save();
  const clip = new Path2D();
  crashoutShapePaths(shape, radius).forEach((path) => clip.addPath(path));
  ctx.clip(clip, shape === "donut" ? "evenodd" : "nonzero");
  ctx.lineCap = "round";
  ctx.lineWidth = T.width;
  crashoutState.skids.forEach((trail) => {
    for (let i = 1; i < trail.length; i += 1) {
      const p = trail[i - 1]; const q = trail[i];
      const alpha = Math.min(p.k, q.k) * (1 - (now - q.t) / T.fadeMs) * T.alpha;
      if (alpha <= 0.02) continue;
      ctx.strokeStyle = `rgba(28, 28, 34, ${alpha.toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    }
  });
  ctx.restore();
}

function drawCrashoutObjects(ctx) {
  // 4C: clamp to 0 so "xxxUntil: 0" statuses don't read as active while the countdown clock is negative.
  const now = crashoutDrawNow();
  crashoutState.ringFlashes.forEach((flash) => {
    const progress = 1 - flash.life / flash.ttl;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - progress) * 0.68;
    crashoutInkRing(ctx, crashoutArena.cx, crashoutArena.cy, flash.radius + progress * 34, "#ffc857", 8 + progress * 18);
    ctx.restore();
  });
  crashoutDrawSwapPads(ctx);
  crashoutDrawPlacedPickups(ctx);
  crashoutState.itemBoxes.filter((box) => box.active && !box.placed).forEach((box) => {
    const itemBoxImage = crashoutImages.itemBox?.complete && crashoutImages.itemBox.naturalWidth ? crashoutImages.itemBox : betaTrackImages.itemBox;
    betaDrawImageOrFallback(ctx, itemBoxImage, box.x, box.y, CRASHOUT_ITEM_BOX_SIZE, CRASHOUT_ITEM_BOX_SIZE, () => {
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(box.x - CRASHOUT_ITEM_BOX_SIZE * 0.43, box.y - CRASHOUT_ITEM_BOX_SIZE * 0.43, CRASHOUT_ITEM_BOX_SIZE * 0.86, CRASHOUT_ITEM_BOX_SIZE * 0.86);
    });
  });
  crashoutState.hazards.forEach((hazard) => {
    const image = hazard.type === "oil" ? betaTrackImages.oilSlick : betaTrackImages.spikeStrip;
    betaDrawImageOrFallback(ctx, image, hazard.x, hazard.y, hazard.type === "oil" ? 78 : 84, hazard.type === "oil" ? 48 : 28, () => {
      ctx.fillStyle = hazard.type === "oil" ? "rgba(6,8,12,0.92)" : "#ff3f3f";
      ctx.beginPath();
      ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  crashoutState.projectiles.forEach((projectile) => {
    if (projectile.type === "empPulse") {
      ctx.save();
      ctx.globalAlpha = Math.max(0.15, 1 - (projectile.radius || 0) / (projectile.maxRadius || 1));
      const img = crashoutImages.empRing;
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
  crashoutState.effects.forEach((effect) => {
    const alpha = Math.max(0, effect.life / effect.ttl);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(effect.x, effect.y);
    ctx.rotate(effect.angle);
    if (effect.kind === "spark") {
      const img = crashoutImages.impactSparks;
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
      const img = crashoutImages.smokePuffs;
      if (img?.complete && img.naturalWidth) {
        ctx.drawImage(img, -effect.size / 2, -effect.size / 2, effect.size, effect.size);
      } else {
        ctx.fillStyle = "rgba(214, 208, 196, 0.48)";
        ctx.beginPath();
        ctx.arc(0, 0, effect.size * 0.38, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (effect.kind === "streak") {
      const img = crashoutImages.speedLines;
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
  crashoutState.cars.filter((car) => car.shieldHits > 0 || car.bubbleUntil > now || car.boostUntil > now || car.hitFlashUntil > now || car.anchorUntil > now || car.antiMagnetUntil > now || car.overhaulUntil > now || car.reverseUntil > now || car.grapple).forEach((car) => {
    ctx.save();
    crashoutScaleAboutCar(ctx, car);
    if (car.grapple?.state === "latched") {
      const target = crashoutState.cars.find((entry) => entry.id === car.grapple.targetId);
      if (target) {
        ctx.strokeStyle = "rgba(82,199,255,0.82)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(car.x, car.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        betaDrawImageOrFallback(ctx, crashoutImages.grappleLatch, target.x, target.y, 52, 52, () => {});
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
      betaDrawImageOrFallback(ctx, crashoutImages.anchorActive, car.x, car.y, 86, 86, () => {
        ctx.strokeStyle = "rgba(255,200,87,0.75)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(car.x, car.y, 48, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    if (car.antiMagnetUntil > now) {
      betaDrawImageOrFallback(ctx, crashoutImages.antiMagnetField, car.x, car.y, 220, 220, () => {
        ctx.strokeStyle = "rgba(82,199,255,0.46)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(car.x, car.y, crashoutItemTuning.antiMagnetRange * 0.62, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    if (car.overhaulUntil > now) {
      betaDrawImageOrFallback(ctx, crashoutImages.overhaulActive, car.x, car.y, 112, 112, () => {
        ctx.strokeStyle = "rgba(255,128,95,0.76)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(car.x, car.y, 58, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    if (car.reverseUntil > now) {
      betaDrawImageOrFallback(ctx, crashoutImages.reverseStatus, car.x, car.y - 54, 48, 48, () => {
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
    ctx.restore();
  });
}

function drawCrashoutCar(ctx, car) {
  if (car.eliminated || car.respawnAt) return;
  const now = crashoutDrawNow();
  const finalTwo = crashoutLiveCars().length <= 2;
  ctx.save();
  crashoutScaleAboutCar(ctx, car);
  if (finalTwo) {
    ctx.save();
    ctx.globalAlpha = 0.55 + Math.sin(performance.now() / 130) * 0.2;
    crashoutInkRing(ctx, car.x, car.y, 54, car.player ? "#52c7ff" : "#ffc857", 4);
    ctx.restore();
  }
  crashoutDrawCarHalo(ctx, car, now);
  crashoutDrawHang(ctx, car, now);
  crashoutDrawTeamMarker(ctx, car);
  crashoutDrawRamAura(ctx, car);
  crashoutDrawSpecialAura(ctx, car);
  crashoutDrawHeadingArrow(ctx, car);
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle + Math.PI / 2);
  if (car.overhaulUntil > now) ctx.scale(crashoutItemTuning.overhaulScale, crashoutItemTuning.overhaulScale);
  if (car.hang) {
    const sink = 1 - 0.16 * crashoutClamp((now - car.hang.since) / crashoutHangMs(), 0, 1);
    ctx.scale(sink, sink);
    ctx.rotate(Math.sin(performance.now() / 55) * 0.07);
  }
  ctx.globalAlpha = car.invulnerableUntil > now ? (Math.floor(performance.now() / 90) % 2 ? 1 : 0.28) : 1;
  if (crashoutDrawOutlinedSprite(ctx, car.image, CRASHOUT_SPRITE_BODY_LENGTH)) {
    if (crashoutState?.debug) gearbornDrawTopdownDebug(ctx, car.image, CRASHOUT_SPRITE_BODY_LENGTH);
  } else {
    ctx.fillStyle = "#0b0d12";
    ctx.fillRect(-25, -35, 50, 70);
    ctx.fillStyle = car.color;
    ctx.fillRect(-22, -32, 44, 64);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-13, -23, 26, 18);
  }
  ctx.restore();
  ctx.restore();
  if (crashoutState?.debug && car.ai) {
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

function crashoutDrawHeadingArrow(ctx, car) {
  const ram = car.ram;
  const zone = crashoutRamZone(car);
  let color = crashoutCarHaloColor(car);
  let stretch = 0;
  if (zone === "building") stretch = ram.charge * 10;
  else if (zone === "perfect" || zone === "dashing") { stretch = 12; color = "#ffc857"; }
  else if (zone === "overheat") { stretch = 12; color = "#ff4a3d"; }
  const size = car.player ? 9 : 7;
  const base = crashoutReadability.haloRadius + 5;
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);
  ctx.globalAlpha = car.player ? 1 : 0.85;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(base, -size);
  ctx.lineTo(base + size + 4 + stretch, 0);
  ctx.lineTo(base, size);
  ctx.lineTo(base + 3, 0);
  ctx.closePath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#0b0d12";
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function updateCrashoutHud(force = false) {
  if (!crashoutState) return;
  crashoutSyncSwapButton();
  const player = crashoutPlayer();
  if (el.crashoutSpeed && player) el.crashoutSpeed.textContent = `${Math.round(Math.hypot(player.vx, player.vy) / 5.2)} MPH`;
  if (player) crashoutRenderRamMeter(player);
  if (el.crashoutItemName && player) {
    const statuses = [];
    const now = Math.max(0, crashoutLocalNow());
    if (player.bubbleUntil > now) statuses.push("Bubble");
    if (player.anchorUntil > now) statuses.push("Anchor");
    if (player.overhaulUntil > now) statuses.push("Overhaul");
    if (player.antiMagnetUntil > now) statuses.push("Anti-Magnet");
    if (player.ramJammedUntil > now) statuses.push("Ram jammed");
    const itemName = player.grapple?.state === "latched" ? "Grapple: YANK" : player.item?.name || "Empty";
    el.crashoutItemName.textContent = statuses.length ? `${itemName} · ${statuses.join(" · ")}` : itemName;
  }
  if (el.crashoutItemIcon && player) {
    const icon = player.item ? (crashoutItemImages[player.item.id] || betaItemImages[player.item.id]) : null;
    el.crashoutItemIcon.innerHTML = "";
    if (icon?.complete && icon.naturalWidth) {
      const clone = icon.cloneNode();
      clone.style.cssText = "width:28px;height:28px;object-fit:contain;display:block;";
      el.crashoutItemIcon.appendChild(clone);
    } else {
      el.crashoutItemIcon.textContent = player.item ? player.item.name.slice(0, 2).toUpperCase() : "?";
    }
  }
  const specialButtons = document.querySelectorAll("[data-crashout-special]");
  if (specialButtons.length) {
    const localNow = performance.now() - (crashoutState.startedAt || performance.now());
    const remaining = Math.max(0, (player?.specialCooldownUntil || 0) - localNow);
    const ready = !player || remaining <= 0;
    const specialName = player ? crashoutSpecialFor(player).name.toUpperCase() : "SPECIAL";
    const label = remaining > 0 ? `${specialName} ${(remaining / 1000).toFixed(1)}s` : specialName;
    specialButtons.forEach((specialButton) => {
      specialButton.classList.toggle("special-ready", ready);
      specialButton.classList.toggle("special-cooling", !ready);
      if (specialButton.textContent !== label) specialButton.textContent = label;
    });
  }
  document.querySelectorAll(".crashout-action-item").forEach((itemButton) => {
    const label = player?.item ? player.item.name : "Item";
    if (itemButton.textContent !== label) itemButton.textContent = label;
    itemButton.classList.toggle("has-item", Boolean(player?.item));
    itemButton.dataset.tier = player?.item ? crashoutItemTier(player.item.id) : "";
  });
  if (el.crashoutItemSlot) el.crashoutItemSlot.dataset.tier = player?.item ? crashoutItemTier(player.item.id) : "";
  const now = performance.now();
  if (!force && now - (crashoutState.statusRenderAt || 0) < 160) return;
  crashoutState.statusRenderAt = now;
  crashoutRenderCrewBar(force);
  if (el.crashoutStatusGrid) {
    const statusSignature = crashoutState.cars.map((car) => `${car.id}:${car.lives}:${car.eliminated ? 1 : 0}:${car.crewIndex ?? 0}:${car.name}`).join("|");
    if (force || statusSignature !== crashoutState.statusSignature) {
      crashoutState.statusSignature = statusSignature;
      el.crashoutStatusGrid.innerHTML = crashoutState.cars.map((car) => `
        <div class="crashout-status-card ${car.player ? "player" : ""} ${car.team ? `team-${car.team}` : ""} ${car.eliminated ? "eliminated" : ""}" data-crashout-status="${car.id}">
          ${crashoutCrewIconsMarkup(car)}
          <strong>${car.name}</strong>
          <span data-crashout-damage>${Math.round(car.damage)}%</span>
        </div>
      `).join("");
    } else {
      crashoutState.cars.forEach((car) => {
        const damage = el.crashoutStatusGrid.querySelector(`[data-crashout-status="${car.id}"] [data-crashout-damage]`);
        if (damage) damage.textContent = `${Math.round(car.damage)}%`;
      });
    }
  }
}

function crashoutRenderRamMeter(player) {
  const meter = document.getElementById("crashout-ram-meter");
  const label = document.getElementById("crashout-ram-label");
  const fill = el.crashoutNitroFill;
  if (!meter || !fill || !player?.ram) return;
  const ram = player.ram;
  const p = player.physics;
  const now = crashoutLocalNow();
  const jammed = player.ramJammedUntil > now;
  const zone = crashoutRamZone(player);
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
    text = ram.reloadMissed ? "Reload jammed" : ram.reloadTried ? "Recovering" : "Tap in the white!";
  }
  fill.style.width = `${crashoutClamp(width, 0, 100)}%`;
  if (!meter.dataset.reloadWindow) {
    meter.style.setProperty("--ram-reload-from", `${crashoutReloadTuning.from * 100}%`);
    meter.style.setProperty("--ram-reload-width", `${(crashoutReloadTuning.to - crashoutReloadTuning.from) * 100}%`);
    meter.dataset.reloadWindow = "1";
  }
  const meterState = jammed && ram.phase !== "dashing"
    ? "jammed"
    : zone === "recovering" ? (ram.reloadMissed ? "reload-jammed" : ram.reloadTried ? "recovering-done" : "recovering") : zone;
  if (meter.dataset.ramState !== meterState) meter.dataset.ramState = meterState;
  if (label && label.textContent !== text) label.textContent = text;
}

function updateCrashoutTouchVisuals() {
  document.querySelectorAll(".crashout-touch-controls").forEach((group) => {
    const leftActive = Boolean(crashoutKeys.left);
    const rightActive = Boolean(crashoutKeys.right);
    group.classList.toggle("steering-left", leftActive && !rightActive);
    group.classList.toggle("steering-right", rightActive && !leftActive);
    group.querySelectorAll("[data-crashout-control]").forEach((button) => {
      button.classList.toggle("pressed", Boolean(crashoutKeys[button.dataset.crashoutControl]));
    });
    group.querySelectorAll("[data-crashout-ram]").forEach((button) => {
      button.classList.toggle("pressed", Boolean(crashoutKeys.charge));
    });
  });
}

el.crashoutSetupStart?.addEventListener("click", () => {
  readCrashoutSetupConfig();
  openCrashoutCrewSelect();
});
el.crashoutBetaBack?.addEventListener("click", () => stopCrashoutBeta(true));
el.crashoutFinishExit?.addEventListener("click", () => stopCrashoutBeta(true));
el.crashoutRestart?.addEventListener("click", () => (crashoutIsEvoRush() ? evoRushRunItBack() : startCrashoutBeta()));

document.addEventListener("keydown", (event) => {
  if (!crashoutState || crashoutState.finished) return;
  if (typeof viewIsActive === "function" && !viewIsActive("crashout-arena")) return;
  if (typeof isTextEntryFocused === "function" && isTextEntryFocused()) return;
  const key = normalizeKey(event);
    if (key === "P" || key === "Escape") {
      event.preventDefault();
      crashoutTogglePause();
      return;
    }
    if (crashoutState.paused) return;
    if (key === "R") {
      event.preventDefault();
      crashoutTrySwap(crashoutPlayer());
      return;
    }
    if (key === "T") {
      event.preventDefault();
      crashoutState.debug = !crashoutState.debug;
      return;
    }
    if (key === "Q") {
      event.preventDefault();
      crashoutUseSpecial(crashoutPlayer());
      return;
    }
    if (crashoutKeyMap[key]) {
      event.preventDefault();
      crashoutKeys[crashoutKeyMap[key]] = true;
      updateCrashoutTouchVisuals();
      return;
    }
    if (key === "Space" || key === "E") {
      event.preventDefault();
      crashoutUseItem(crashoutPlayer());
      return;
    }
});

document.addEventListener("keyup", (event) => {
  const key = normalizeKey(event);
  if (crashoutKeyMap[key]) {
    crashoutKeys[crashoutKeyMap[key]] = false;
    updateCrashoutTouchVisuals();
  }
});

document.querySelectorAll("[data-crashout-control]").forEach((button) => {
  const direction = button.dataset.crashoutControl;
  const press = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    crashoutKeys[direction] = true;
    updateCrashoutTouchVisuals();
  };
  const release = (event) => {
    event.preventDefault();
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    crashoutKeys[direction] = false;
    updateCrashoutTouchVisuals();
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", (event) => {
    if (button.hasPointerCapture?.(event.pointerId)) return;
    crashoutKeys[direction] = false;
    updateCrashoutTouchVisuals();
  });
});

document.querySelectorAll("[data-crashout-ram]").forEach((button) => {
  const press = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    crashoutKeys.charge = true;
    updateCrashoutTouchVisuals();
  };
  const release = (event) => {
    event.preventDefault();
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    crashoutKeys.charge = false;
    updateCrashoutTouchVisuals();
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", (event) => {
    if (button.hasPointerCapture?.(event.pointerId)) return;
    crashoutKeys.charge = false;
    updateCrashoutTouchVisuals();
  });
});

window.addEventListener("blur", () => {
  Object.keys(crashoutKeys).forEach((key) => { crashoutKeys[key] = false; });
  if (typeof crashoutReleaseStick === "function") crashoutReleaseStick();
  updateCrashoutTouchVisuals();
});

document.querySelectorAll("[data-crashout-special]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    crashoutUseSpecial(crashoutPlayer());
  });
});

document.querySelectorAll("[data-crashout-item-button]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    crashoutUseItem(crashoutPlayer());
  });
});

window.addEventListener("resize", resizeCrashoutBeta);
screen.orientation?.addEventListener?.("change", resizeCrashoutBeta);

// -- Crashout controls: drive stick, gamepad, layout setting ----------------
// Drive stick = point-to-drive: push toward where you want to go. The car turns
// toward that direction and throttles by how far you push. Point behind you and
// it brakes, then swings around. Keyboard WASD stays tank-style (Classic).
const CRASHOUT_CONTROLS_STORAGE_KEY = "gearbornLastGearControls";
const crashoutStickTuning = {
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
const crashoutStick = { active: false, x: 0, y: 0, pointerId: null, originX: 0, originY: 0 };
const crashoutGamepad = { connected: false, x: 0, y: 0, charge: false, prev: [] };
const crashoutSetupControlsSelect = document.getElementById("crashout-setup-controls");

function crashoutControlsLayout() {
  try {
    return localStorage.getItem(CRASHOUT_CONTROLS_STORAGE_KEY) === "classic" ? "classic" : "stick";
  } catch (error) {
    return "stick";
  }
}

function crashoutSetControlsLayout(layout) {
  const next = layout === "classic" ? "classic" : "stick";
  try {
    localStorage.setItem(CRASHOUT_CONTROLS_STORAGE_KEY, next);
  } catch (error) {
    // Storage blocked (private mode): the choice lasts for this page only.
  }
  crashoutApplyControlsLayout(next);
}

function crashoutApplyControlsLayout(layout = crashoutControlsLayout()) {
  document.querySelectorAll(".crashout-touch-controls").forEach((group) => {
    group.dataset.layout = layout;
  });
  if (el.crashoutBeta) el.crashoutBeta.dataset.controlsLayout = layout;
  document.querySelectorAll("[data-crashout-layout-toggle]").forEach((button) => {
    button.textContent = layout === "classic" ? "Switch to stick" : "Switch to classic";
  });
  if (crashoutSetupControlsSelect && crashoutSetupControlsSelect.value !== layout) crashoutSetupControlsSelect.value = layout;
  crashoutReleaseStick();
  ["up", "down", "left", "right", "charge"].forEach((key) => { crashoutKeys[key] = false; });
  updateCrashoutTouchVisuals();
  if (crashoutState && typeof resizeCrashoutBeta === "function") resizeCrashoutBeta();
}

function crashoutStickControls(car, x, y) {
  const T = crashoutStickTuning;
  const mag = Math.min(1, Math.hypot(x, y));
  if (mag < T.deadZone) return null;
  const delta = betaNormalizeAngle(Math.atan2(y, x) - car.angle);
  const steer = crashoutClamp(delta / T.fullSteerAngle, -1, 1);
  const speed = Math.hypot(car.vx, car.vy);
  const behind = Math.abs(delta) > T.brakeAngle;
  const push = crashoutClamp((mag - T.deadZone) / (T.fullThrottleAt - T.deadZone), 0, 1);
  return {
    up: behind ? speed < T.brakeSpeed : Math.abs(delta) < T.throttleAngle,
    down: behind && speed >= T.brakeSpeed,
    left: steer < -T.dodgeSteer,
    right: steer > T.dodgeSteer,
    steer,
    throttle: behind ? push * T.turnaroundThrottle : push
  };
}

function crashoutPollGamepad() {
  const pads = typeof navigator !== "undefined" && navigator.getGamepads ? navigator.getGamepads() : [];
  const pad = Array.from(pads || []).find((entry) => entry && entry.connected);
  if (!pad) {
    crashoutGamepad.connected = false;
    crashoutGamepad.x = 0;
    crashoutGamepad.y = 0;
    crashoutGamepad.charge = false;
    crashoutGamepad.prev = [];
    return;
  }
  const pressed = (index) => Boolean(pad.buttons[index]?.pressed);
  const wasPressed = (index) => Boolean(crashoutGamepad.prev[index]);
  let x = pad.axes[0] || 0;
  let y = pad.axes[1] || 0;
  if (Math.hypot(x, y) < crashoutStickTuning.gamepadDeadZone) {
    x = (pressed(15) ? 1 : 0) - (pressed(14) ? 1 : 0);
    y = (pressed(13) ? 1 : 0) - (pressed(12) ? 1 : 0);
  }
  crashoutGamepad.connected = true;
  crashoutGamepad.x = x;
  crashoutGamepad.y = y;
  crashoutGamepad.charge = pressed(0) || pressed(7);
  const player = crashoutPlayer();
  if (player && !crashoutState?.finished) {
    if (pressed(9) && !wasPressed(9)) {
      crashoutGamepad.prev = pad.buttons.map((button) => Boolean(button?.pressed));
      crashoutGamepad.pauseHeld = true;
      crashoutPause();
      return;
    }
    if ((pressed(1) && !wasPressed(1)) || (pressed(4) && !wasPressed(4))) crashoutUseSpecial(player);
    if ((pressed(2) && !wasPressed(2)) || (pressed(5) && !wasPressed(5))) crashoutUseItem(player);
    if (pressed(3) && !wasPressed(3) && !crashoutTrySwap(player)) crashoutCycleNextUp();
  }
  crashoutGamepad.prev = pad.buttons.map((button) => Boolean(button?.pressed));
}

function crashoutPlayerControls(car) {
  crashoutPollGamepad();
  const charge = crashoutInput("charge") || crashoutGamepad.charge;
  const keyboardDriving = crashoutInput("up") || crashoutInput("down") || crashoutInput("left") || crashoutInput("right");
  if (!keyboardDriving) {
    const source = crashoutStick.active
      ? crashoutStick
      : crashoutGamepad.connected && Math.hypot(crashoutGamepad.x, crashoutGamepad.y) >= crashoutStickTuning.gamepadDeadZone
        ? crashoutGamepad
        : null;
    const stickControls = source ? crashoutStickControls(car, source.x, source.y) : null;
    if (stickControls) return { ...stickControls, charge };
    if (source) return { up: false, down: false, left: false, right: false, charge };
  }
  return {
    up: crashoutInput("up"),
    down: crashoutInput("down"),
    left: crashoutInput("left"),
    right: crashoutInput("right"),
    charge
  };
}

function crashoutRenderStick() {
  const R = crashoutStickTuning.radiusPx;
  document.querySelectorAll("[data-crashout-drive-pad]").forEach((pad) => {
    const knob = pad.querySelector(".crashout-drive-knob");
    pad.classList.toggle("active", crashoutStick.active);
    if (knob) knob.style.transform = `translate(calc(-50% + ${(crashoutStick.x * R).toFixed(1)}px), calc(-50% + ${(crashoutStick.y * R).toFixed(1)}px))`;
  });
}

function crashoutReleaseStick() {
  crashoutStick.active = false;
  crashoutStick.pointerId = null;
  crashoutStick.x = 0;
  crashoutStick.y = 0;
  crashoutRenderStick();
}

document.querySelectorAll("[data-crashout-drive-pad]").forEach((pad) => {
  const R = crashoutStickTuning.radiusPx;
  const move = (event) => {
    let dx = event.clientX - crashoutStick.originX;
    let dy = event.clientY - crashoutStick.originY;
    const dist = Math.hypot(dx, dy);
    if (dist > R) {
      // Floating stick: the origin trails the finger so reversing direction is instant.
      crashoutStick.originX += (dx / dist) * (dist - R);
      crashoutStick.originY += (dy / dist) * (dist - R);
      dx = (dx / dist) * R;
      dy = (dy / dist) * R;
    }
    crashoutStick.x = dx / R;
    crashoutStick.y = dy / R;
    crashoutRenderStick();
  };
  pad.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    pad.setPointerCapture?.(event.pointerId);
    crashoutStick.active = true;
    crashoutStick.pointerId = event.pointerId;
    crashoutStick.originX = event.clientX;
    crashoutStick.originY = event.clientY;
    crashoutStick.x = 0;
    crashoutStick.y = 0;
    crashoutRenderStick();
  });
  pad.addEventListener("pointermove", (event) => {
    if (!crashoutStick.active || event.pointerId !== crashoutStick.pointerId) return;
    event.preventDefault();
    move(event);
  });
  const end = (event) => {
    if (event.pointerId !== crashoutStick.pointerId) return;
    if (pad.hasPointerCapture?.(event.pointerId)) pad.releasePointerCapture(event.pointerId);
    crashoutReleaseStick();
  };
  pad.addEventListener("pointerup", end);
  pad.addEventListener("pointercancel", end);
});

document.querySelectorAll("[data-crashout-layout-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    crashoutSetControlsLayout(crashoutControlsLayout() === "classic" ? "stick" : "classic");
  });
});

crashoutSetupControlsSelect?.addEventListener("change", () => crashoutSetControlsLayout(crashoutSetupControlsSelect.value));
crashoutApplyControlsLayout();

// -- Crews and swap pads -----------------------------------------------------
const crashoutCrewTuning = { padRadius: 52, triggerRadius: 70, swapCooldownMs: 6000, swapInvulnerableMs: 900, padDistance: { circle: 0.34, square: 0.34, donut: 0.45, bridge: 0.34 }, aiSwapDamage: 85, aiSwapMargin: 45 };
const crashoutCrewExcludedIds = ["rainbowlt", "hornula1"];

function crashoutCrewSize() { return crashoutClamp(Number(crashoutCurrentSettings().lives || 3), 1, 5); }
function crashoutCarClass(carId) { return (typeof classForLineId === "function" && classForLineId(carId)) || "E"; }
function crashoutRatingTotal(ratings) { return ["speed", "acceleration", "handling", "torque", "body", "powertrain"].reduce((sum, key) => sum + (ratings?.[key] || 70), 0); }

function crashoutCrewCandidate(carId, options = {}) {
  const car = cars.find((item) => item.id === carId);
  if (!car?.evolutions?.length) return null;
  let form;
  let ratings;
  if (options.loaner) {
    const evolution = crashoutClamp(options.evolution || 0, 0, car.evolutions.length - 1);
    form = car.evolutions[evolution];
    ratings = betaRatingsForCar(carId, options.level || 1, evolution, false);
  } else if (options.player) {
    form = currentEvolution(carId);
    ratings = crashoutRatingsFor(carId, true);
  } else {
    form = car.evolutions[state.garage?.[carId]?.evolution || 0] || car.evolutions[0];
    ratings = crashoutRatingsFor(carId, false);
  }
  const topdown = imageFor(form, "topdown");
  if (!topdown) return null;
  return { carId, name: form.name, color: car.color || (options.player ? "#52c7ff" : "#ff805f"), topdown, image: null, displayImage: imageFor(form, "display") || topdown, ratings, physics: crashoutPhysics(ratings), specialLineId: evolutionLineRootForCar(carId), carClass: crashoutCarClass(carId), damage: 0, out: false, loaner: Boolean(options.loaner) };
}

function crashoutCrewSimilarity(lead) {
  const leadTotal = crashoutRatingTotal(lead.ratings);
  return (member) => (member.carClass === lead.carClass ? 0 : 1000) + Math.abs(crashoutRatingTotal(member.ratings) - leadTotal);
}

function crashoutBuildPlayerCrew(leadId, size) {
  const picks = crashoutSavedCrew(size);
  if (picks[0] !== leadId) {
    const existing = picks.indexOf(leadId);
    if (existing > 0) picks[existing] = picks[0];
    picks[0] = leadId;
  }
  return crashoutCrewFillPlan(picks, size).filter(Boolean);
}

function crashoutBuildAiCrew(leadId, size, used) {
  const lead = crashoutCrewCandidate(leadId);
  if (!lead) return [];
  const crew = [lead];
  if (size <= 1) return crew;
  const pool = cars.filter((car) => car.id !== leadId && !crashoutCrewExcludedIds.includes(car.id) && !car.tutorialOnly).map((car) => crashoutCrewCandidate(car.id)).filter(Boolean).sort(() => Math.random() - 0.5);
  const sameClass = pool.filter((member) => member.carClass === lead.carClass);
  const ordered = [...sameClass.filter((member) => !used.has(member.carId)), ...pool.filter((member) => member.carClass !== lead.carClass && !used.has(member.carId)), ...pool.filter((member) => used.has(member.carId))];
  ordered.slice(0, size - 1).forEach((member) => { used.add(member.carId); crew.push(member); });
  return crew;
}

function crashoutAttachCrews(racers, size) {
  const used = new Set(racers.map((racer) => racer.carId));
  racers.forEach((racer) => {
    const crew = racer.player ? crashoutBuildPlayerCrew(racer.carId, size) : crashoutBuildAiCrew(racer.carId, size, used);
    if (!crew.length) { racer.crew = null; racer.lives = size; return; }
    crew[0].image = racer.image;
    crew.slice(1).forEach((member) => { member.image = betaMakeImage(member.topdown, { measure: true }); });
    racer.crew = crew;
    racer.crewIndex = 0;
    racer.pendingCrewIndex = null;
    racer.lives = crew.length;
    racer.swapCooldownUntil = 0;
    racer.swapProgress = 0;
    racer.nextUp = crashoutDefaultNextUp(racer);
  });
}

function crashoutBenchIndexes(racer) { return racer?.crew ? racer.crew.map((member, index) => index).filter((index) => index !== racer.crewIndex && !racer.crew[index].out) : []; }
function crashoutDefaultNextUp(racer) { const bench = crashoutBenchIndexes(racer); return bench.length ? bench.sort((a, b) => racer.crew[a].damage - racer.crew[b].damage)[0] : -1; }
function crashoutResolveNextUp(racer) { const bench = crashoutBenchIndexes(racer); if (bench.includes(racer.nextUp)) return racer.nextUp; racer.nextUp = crashoutDefaultNextUp(racer); return racer.nextUp; }
function crashoutSetNextUp(index) { const player = crashoutPlayer(); if (!player?.crew || !crashoutBenchIndexes(player).includes(index)) return; player.nextUp = index; updateCrashoutHud(true); }
function crashoutCycleNextUp() { const player = crashoutPlayer(); const bench = crashoutBenchIndexes(player); if (!bench.length) return; const at = bench.indexOf(player.nextUp); crashoutSetNextUp(bench[(at + 1) % bench.length]); }

function crashoutLoadCrewMember(racer, index) {
  const member = racer.crew?.[index];
  if (!member) return;
  Object.assign(racer, { carId: member.carId, name: member.name, color: member.color, image: member.image, displayImage: member.displayImage, ratings: member.ratings, physics: member.physics, specialLineId: member.specialLineId, damage: member.damage, crewIndex: index, ram: crashoutMakeRamState() });
}

function crashoutSwapPads(now = crashoutLocalNow()) { const distance = crashoutActiveRadius(now) * (crashoutCrewTuning.padDistance[crashoutShape()] || 0.34); return [{ id: "west", x: crashoutArena.cx - distance, y: crashoutArena.cy }, { id: "east", x: crashoutArena.cx + distance, y: crashoutArena.cy }]; }
function crashoutNearestSwapPad(car) { return crashoutSwapPads().sort((a, b) => Math.hypot(a.x - car.x, a.y - car.y) - Math.hypot(b.x - car.x, b.y - car.y))[0]; }

function crashoutSwapCrew(car, index, now) {
  const T = crashoutCrewTuning;
  car.crew[car.crewIndex].damage = car.damage;
  crashoutLoadCrewMember(car, index);
  car.nextUp = crashoutDefaultNextUp(car);
  car.swapProgress = 0;
  car.swapCooldownUntil = now + T.swapCooldownMs;
  car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + T.swapInvulnerableMs);
  for (let i = 0; i < 10; i += 1) crashoutSpawnParticle("spark", car.x, car.y, (Math.PI * 2 * i) / 10, 140 + Math.random() * 80, 320, 6 + Math.random() * 4, "#3ee6c1");
  if (car.player) { crashoutState.stats.swaps = (crashoutState.stats.swaps || 0) + 1; crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -28, ttl: 650, life: 650, text: "SWAP!", size: 26, tint: "#3ee6c1", angle: 0, spin: 0 }); crashoutAnnounce("swap", { cooldown: 5000 }); }
}

function crashoutUpdateSwapPads(dt, now) {
  if (crashoutCrewSize() <= 1) return;
  const T = crashoutCrewTuning;
  const pads = crashoutSwapPads(now);
  crashoutLiveCars().forEach((car) => {
    if (car.respawnAt || !car.crew) return;
    const onPad = pads.find((pad) => Math.hypot(pad.x - car.x, pad.y - car.y) < T.triggerRadius);
    const next = crashoutResolveNextUp(car);
    const ready = (car.swapCooldownUntil || 0) <= now && next >= 0 && car.ram?.phase !== "dashing";
    car.swapPadId = onPad && ready ? onPad.id : null;
    // Hot swap: the player presses SWAP while on a pad; AI swaps as it reaches its target.
    if (car.swapPadId && !car.player && crashoutAiSwapTarget(car)) crashoutTrySwap(car);
  });
}

function crashoutAiSwapTarget(car) { const T = crashoutCrewTuning; if (crashoutCrewSize() <= 1 || !car.crew || (car.swapCooldownUntil || 0) > crashoutLocalNow() || car.damage < T.aiSwapDamage) return null; const next = crashoutResolveNextUp(car); return next < 0 || car.crew[next].damage > car.damage - T.aiSwapMargin ? null : crashoutNearestSwapPad(car); }

function crashoutDrawSwapPads(ctx) {
  if (!crashoutState || crashoutCrewSize() <= 1) return;
  const T = crashoutCrewTuning, player = crashoutPlayer(), now = crashoutLocalNow();
  const benchReady = player && !player.eliminated && crashoutBenchIndexes(player).length > 0;
  const cooldownLeft = player ? crashoutClamp(((player.swapCooldownUntil || 0) - now) / T.swapCooldownMs, 0, 1) : 0;
  const ready = benchReady && cooldownLeft <= 0;
  crashoutSwapPads(now).forEach((pad) => crashoutDrawSwapPad(ctx, pad, ready, player?.swapPadId === pad.id, benchReady ? cooldownLeft : 0));
}

function crashoutCrewIconsMarkup(car) { if (!car.crew) return `<div class="crashout-lives">${Array.from({ length: Math.max(0, car.lives) }, () => `<img src="${car.displayImage}" alt="" loading="lazy" decoding="async" onerror="this.style.visibility='hidden';">`).join("")}</div>`; return `<div class="crashout-lives crashout-crew-icons">${car.crew.map((member, index) => `<img class="${["crashout-crew-icon", index === car.crewIndex ? "active" : "", member.out ? "out" : ""].join(" ")}" src="${member.displayImage}" alt="" loading="lazy" decoding="async" onerror="this.style.visibility='hidden';">`).join("")}</div>`; }

function crashoutRenderCrewBar(force = false) {
  const bar = document.getElementById("crashout-crew-bar"), player = crashoutPlayer();
  if (!bar) return;
  if (!player?.crew || player.crew.length <= 1) { if (!bar.hidden) bar.hidden = true; return; }
  bar.hidden = false;
  const now = crashoutLocalNow(), signature = `${player.crewIndex}:${player.nextUp}:${player.crew.map((member) => member.out ? 1 : 0).join("")}`;
  if (force || bar.dataset.signature !== signature) { bar.dataset.signature = signature; bar.innerHTML = player.crew.map((member, index) => { const driving = index === player.crewIndex && !member.out, next = index === player.nextUp && !member.out, tag = member.out ? "Out" : driving ? "Driving" : next ? "Next up" : `Bench ${index + 1}`, classes = ["crashout-crew-slot", driving ? "driving" : "", next ? "next" : "", member.out ? "out" : "", member.loaner ? "loaner" : ""].join(" "), pickable = !member.out && !driving; return `<button class="${classes}" type="button" data-crashout-crew-pick="${index}" ${pickable ? "" : "disabled"} aria-label="${member.name}: ${tag}"><img src="${member.displayImage}" alt="" loading="lazy" decoding="async" onerror="this.style.visibility='hidden';"><span class="crashout-crew-name">${member.name}${member.loaner ? " <em>Loaner</em>" : ""}</span><span class="crashout-crew-tag">${tag}</span><strong data-crashout-crew-damage="${index}">${Math.round(driving ? player.damage : member.damage)}%</strong></button>`; }).join(""); } else player.crew.forEach((member, index) => { const damage = bar.querySelector(`[data-crashout-crew-damage="${index}"]`); if (damage) damage.textContent = `${Math.round(index === player.crewIndex ? player.damage : member.damage)}%`; });
  bar.classList.toggle("swap-cooling", Math.max(0, (player.swapCooldownUntil || 0) - now) > 0);
}

document.getElementById("crashout-crew-bar")?.addEventListener("click", (event) => { const button = event.target.closest("[data-crashout-crew-pick]"); if (!button || button.disabled) return; crashoutSetNextUp(Number(button.dataset.crashoutCrewPick)); });
document.addEventListener("keydown", (event) => { if (!crashoutState || crashoutState.finished || (typeof viewIsActive === "function" && !viewIsActive("crashout-arena")) || (typeof isTextEntryFocused === "function" && isTextEntryFocused())) return; const digit = Number(event.key); if (Number.isInteger(digit) && digit >= 1 && digit <= 5) { event.preventDefault(); crashoutSetNextUp(digit - 1); } });

// -- Crew select screen ------------------------------------------------------
function crashoutSavedCrew(size = crashoutCrewSize()) {
  const raw = Array.isArray(state.crashoutCrew) ? state.crashoutCrew : [], seen = new Set(), picks = [];
  for (let slot = 0; slot < size; slot += 1) { const carId = raw[slot], valid = Boolean(carId) && isSelectablePlayerCar(carId) && !seen.has(carId); picks.push(valid ? carId : null); if (valid) seen.add(carId); }
  if (!picks[0]) { const firstPicked = picks.findIndex(Boolean); if (firstPicked > 0) { picks[0] = picks[firstPicked]; picks[firstPicked] = null; } else { const fallback = isSelectablePlayerCar(state.crashoutSelectedCar) ? state.crashoutSelectedCar : selectedCarIdForMode("beta"); if (fallback && isSelectablePlayerCar(fallback)) picks[0] = fallback; } }
  return picks;
}
function crashoutStoreCrew(picks) { const stored = Array.isArray(state.crashoutCrew) ? state.crashoutCrew.slice(0, 5) : []; picks.forEach((carId, slot) => { stored[slot] = carId || null; }); while (stored.length < 5) stored.push(null); state.crashoutCrew = stored.slice(0, 5); if (picks[0]) state.crashoutSelectedCar = picks[0]; if (typeof saveState === "function") saveState(); }
function crashoutCrewFillPlan(picks, size) {
  const lead = picks[0] ? crashoutCrewCandidate(picks[0], { player: true }) : null, plan = Array.from({ length: size }, (_, slot) => slot === 0 ? lead : picks[slot] ? crashoutCrewCandidate(picks[slot], { player: true }) : null);
  if (!lead) return plan;
  const similarity = crashoutCrewSimilarity(lead), taken = new Set(picks.filter(Boolean));
  const showcase = typeof showcaseOnlyIds === "function" ? showcaseOnlyIds() : [];
  const owned = selectablePlayerCars().filter((car) => !taken.has(car.id) && !crashoutCrewExcludedIds.includes(car.id) && (!showcase.length || showcase.includes(car.id))).map((car) => crashoutCrewCandidate(car.id, { player: true })).filter(Boolean).sort((a, b) => similarity(a) - similarity(b));
  let loaners = null;
  for (let slot = 1; slot < size; slot += 1) if (!plan[slot]) { let member = owned.find((candidate) => !taken.has(candidate.carId)); if (!member) { if (!loaners) { const progress = state.garage?.[lead.carId] || {}; loaners = cars.filter((car) => !crashoutCrewExcludedIds.includes(car.id) && !car.tutorialOnly && !(typeof isFusionLine === "function" && isFusionLine(car.id))).map((car) => crashoutCrewCandidate(car.id, { loaner: true, level: progress.level || 1, evolution: progress.evolution || 0 })).filter(Boolean).sort((a, b) => similarity(a) - similarity(b)); } member = loaners.find((candidate) => !taken.has(candidate.carId)); } if (member) { member.autoFilled = true; plan[slot] = member; taken.add(member.carId); } }
  return plan;
}
function crashoutSetCrewSlot(slot, carId) { const picks = crashoutSavedCrew(); picks[slot] = carId || null; crashoutStoreCrew(picks); renderCrashoutCrewSelect(); }
function crashoutAutoFillCrew() { const size = crashoutCrewSize(), picks = crashoutSavedCrew(size), plan = crashoutCrewFillPlan(picks, size); plan.forEach((member, slot) => { if (!picks[slot] && member && !member.loaner) picks[slot] = member.carId; }); crashoutStoreCrew(picks); renderCrashoutCrewSelect(); }
function openCrashoutCrewSlotPicker(slot) { const picks = crashoutSavedCrew(), others = picks.filter((carId, index) => carId && index !== slot); openCarPicker({ target: "crashout-crew", title: slot === 0 ? "Choose who starts" : `Choose crew car ${slot + 1}`, selectedCarId: picks[slot] || "", filter: (carId) => !others.includes(carId), onConfirm: (carId) => crashoutSetCrewSlot(slot, carId) }); }
function openCrashoutCrewSelect() { if (typeof viewIsActive === "function" && !viewIsActive("crashout-arena")) showView("crashout-arena"); if (el.crashoutBeta) el.crashoutBeta.hidden = true; const screen = document.getElementById("crashout-crew-select"); if (screen) screen.hidden = false; renderCrashoutCrewSelect(); window.scrollTo?.({ top: 0 }); }
function closeCrashoutCrewSelect() { const screen = document.getElementById("crashout-crew-select"); if (screen) screen.hidden = true; showView("crashout"); toggleCrashoutSetupPanel(true); }
function renderCrashoutCrewSelect() {
  const slotsEl = document.getElementById("crashout-crew-select-slots"); if (!slotsEl) return;
  const size = crashoutCrewSize(), picks = crashoutSavedCrew(size), plan = crashoutCrewFillPlan(picks, size), settings = crashoutCurrentSettings();
  document.querySelectorAll("[data-crashout-crew-size]").forEach((button) => button.classList.toggle("active", Number(button.dataset.crashoutCrewSize) === size));
  const summary = document.getElementById("crashout-crew-select-summary"); if (summary) summary.textContent = `${size === 1 ? "Solo car" : `Crew of ${size}`} · ${el.crashoutSetupArena?.selectedOptions?.[0]?.textContent || settings.arena} · ${crashoutFormatLabel()} · ${settings.aiDifficulty} AI`;
  slotsEl.dataset.size = String(size);
  slotsEl.innerHTML = plan.map((member, slot) => { const pickedId = picks[slot], kicker = slot === 0 ? "Starts" : `Bench ${slot + 1}`, type = member ? (gearbornStatProfiles[member.carId]?.type || "Neutral") : "", level = pickedId ? (state.garage?.[pickedId]?.level || 1) : null, meta = member ? `${member.carClass}-Class · ${type}${level ? ` · Lv ${level}` : ""}` : "", stats = pickedId ? (displayedGearbornStats(pickedId) || member?.ratings || {}) : (member?.ratings || {}), autoNote = !pickedId && member ? `<span class="crashout-crew-select-auto">Auto: ${escapeHtml(member.name)}${member.loaner ? " <em>Loaner</em>" : ""}</span>` : ""; return `<article class="convoy-stage-side convoy-stage-side-player crashout-crew-select-card ${pickedId ? "picked" : "auto"}"><span class="convoy-stage-side-kicker">${kicker}</span><button class="convoy-stage-car-display convoy-stage-car-picker-button ${pickedId ? "filled" : "empty"}" type="button" data-crashout-crew-slot="${slot}">${pickedId ? `<img src="${imageFor(currentEvolution(pickedId), "display")}" alt="${escapeHtml(member?.name || "")}">` : `<div class="convoy-stage-car-picker-plus"><span class="convoy-stage-car-picker-plus-icon">+</span><span class="convoy-stage-car-picker-plus-label">Choose Car</span></div>`}</button><strong class="convoy-stage-car-name">${pickedId && member ? escapeHtml(member.name) : "—"}</strong>${autoNote}${meta && pickedId ? `<span class="crashout-crew-select-meta">${meta}</span>` : ""}<div class="convoy-stage-stats ${pickedId ? "" : "crashout-crew-select-ghost-stats"}">${renderConvoyStatBars(stats)}</div>${pickedId && slot > 0 ? `<button class="ghost crashout-crew-select-clear" type="button" data-crashout-crew-clear="${slot}">Remove</button>` : ""}</article>`; }).join("");
  const autoFill = document.getElementById("crashout-crew-autofill"); if (autoFill) autoFill.disabled = picks.filter((carId, slot) => slot > 0 && !carId).length === 0;
  const start = document.getElementById("crashout-crew-start"); if (start) start.disabled = !picks[0];
}
document.getElementById("crashout-crew-select")?.addEventListener("click", (event) => { const slotButton = event.target.closest("[data-crashout-crew-slot]"); if (slotButton) { openCrashoutCrewSlotPicker(Number(slotButton.dataset.crashoutCrewSlot)); return; } const clearButton = event.target.closest("[data-crashout-crew-clear]"); if (clearButton) { crashoutSetCrewSlot(Number(clearButton.dataset.crashoutCrewClear), null); return; } const sizeButton = event.target.closest("[data-crashout-crew-size]"); if (sizeButton) { if (el.crashoutSetupLives) el.crashoutSetupLives.value = sizeButton.dataset.crashoutCrewSize; readCrashoutSetupConfig(); renderCrashoutCrewSelect(); } });
document.getElementById("crashout-crew-back")?.addEventListener("click", closeCrashoutCrewSelect);
document.getElementById("crashout-crew-autofill")?.addEventListener("click", crashoutAutoFillCrew);
document.getElementById("crashout-crew-start")?.addEventListener("click", () => { const picks = crashoutSavedCrew(); if (!picks[0]) return; crashoutStoreCrew(picks); startCrashoutBeta(); });
document.getElementById("crashout-edit-crew")?.addEventListener("click", () => {
  if (crashoutState && crashoutIsEvoRush()) {
    openEvoRushPick(true);
    return;
  }
  stopCrashoutBeta(false);
  openCrashoutCrewSelect();
});

// -- Type specials -----------------------------------------------------------------
// One special per GearBorn Type. crashoutLineSpecials is the hook for car-specific
// specials later: { [evolutionLineRoot]: { name, cooldown, effect, tint } }.
const crashoutTypeSpecials = {
  Agility: { name: "Blink Hop", cooldown: 4000, effect: "dash", tint: "#6ee7a8", description: "Forward hop with a moment of invulnerability." },
  Power: { name: "Shockwave Slam", cooldown: 6000, effect: "frontslam", tint: "#ff805f", description: "Heavy hit to anything right in front of you." },
  Endurance: { name: "Iron Wall", cooldown: 8000, effect: "ironWall", tint: "#b7c1d1", description: "Brace for 2.2 s: half damage, barely any knockback." },
  Tech: { name: "EMP Snare", cooldown: 6500, effect: "snare", tint: "#c084fc", description: "Close-range pulse that jams nearby Rams and cancels charges." },
  Transmission: { name: "Overdrive", cooldown: 8000, effect: "overdrive", tint: "#ffc857", description: "Ram ready now, and your next Ram is a guaranteed full Perfect." },
  Grip: { name: "Tail Whip", cooldown: 5500, effect: "whip", tint: "#52c7ff", description: "Spin the tail and sweep everyone around you sideways." },
  Neutral: { name: "Side Shunt", cooldown: 4500, effect: "shunt", tint: "#f4f7fb", description: "Shove cars off both flanks." }
};
const crashoutLineSpecials = {};
const crashoutSpecialTuning = {
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
const crashoutTypeCache = new Map();

function crashoutTypeFor(carId) {
  if (!carId) return "Neutral";
  if (crashoutTypeCache.has(carId)) return crashoutTypeCache.get(carId);
  let type = gearbornStatProfiles?.[carId]?.type || "";
  if (!type) {
    const car = cars.find((item) => item.id === carId);
    const entry = car && vindexEntries.find((item) => item.name === car.evolutions?.[0]?.name);
    const types = entry && typeof getVindexTypes === "function" ? getVindexTypes(entry) : [];
    type = types?.[0] || "Neutral";
  }
  if (!crashoutTypeSpecials[type]) type = "Neutral";
  crashoutTypeCache.set(carId, type);
  return type;
}

function crashoutSpecialRing(car, radius, tint, ttl = 420) {
  crashoutState.effects.push({ kind: "ring", x: car.x, y: car.y, vx: 0, vy: 0, angle: 0, spin: 0, ttl, life: ttl, size: radius, tint });
}

function crashoutAiShouldUseSpecial(car, target, nearEdge, aggression) {
  if (crashoutLocalNow() < (car.specialCooldownUntil || 0)) return false;
  const special = crashoutSpecialFor(car);
  const distance = target?.id ? Math.hypot(target.x - car.x, target.y - car.y) : Infinity;
  const near = (radius) => crashoutLiveCars().some((other) => crashoutAreFoes(car, other) && !other.respawnAt && Math.hypot(other.x - car.x, other.y - car.y) < radius);
  const roll = (chance) => Math.random() < chance * aggression;
  if (special.effect === "ironWall") {
    const threatened = crashoutLiveCars().some((other) => crashoutAreFoes(car, other) && ["dashing", "charging"].includes(other.ram?.phase) && Math.hypot(other.x - car.x, other.y - car.y) < 260);
    return (threatened || (nearEdge && car.damage > 60)) && roll(0.08);
  }
  if (special.effect === "overdrive") return car.ram?.phase === "recovering" && distance < 500 && roll(0.02);
  if (special.effect === "snare") return near(crashoutSpecialTuning.snareRadius - 10) && roll(0.03);
  if (special.effect === "whip") return near(crashoutSpecialTuning.whipRadius) && roll(0.03);
  if (special.effect === "dash") return !nearEdge && distance < 260 && roll(0.012);
  return !nearEdge && distance < 190 && roll(0.011);
}

function crashoutDrawSpecialAura(ctx, car) {
  const now = crashoutDrawNow();
  if ((car.ironWallUntil || 0) > now) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= 6; i += 1) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const x = car.x + Math.cos(angle) * 42;
      const y = car.y + Math.sin(angle) * 42;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(11, 13, 18, 0.85)";
    ctx.stroke();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(183, 193, 209, 0.95)";
    ctx.stroke();
    ctx.restore();
  }
  if ((car.overdriveUntil || 0) > now) {
    ctx.save();
    ctx.globalAlpha = 0.55 + Math.sin(performance.now() / 60) * 0.25;
    ctx.setLineDash([8, 6]);
    crashoutInkRing(ctx, car.x, car.y, 46, "#ffc857", 3);
    ctx.restore();
  }
}

// -- Item tiers and placed pickups ----------------------------------------------------
const crashoutItemTiers = {
  common: ["oil", "tire", "turbo", "shield"],
  rare: ["burst", "teleport", "grapple", "anchor"],
  chaos: ["antiMagnet", "reverse", "overhaul"]
};
const crashoutTierOdds = {
  low: { common: 0.8, rare: 0.18, chaos: 0.02 },
  normal: { common: 0.62, rare: 0.3, chaos: 0.08 },
  chaos: { common: 0.4, rare: 0.36, chaos: 0.24 }
};
const crashoutTierColors = { common: "#8fd3ff", rare: "#c084fc", chaos: "#ff5c8a" };
const crashoutPlacedPickupTuning = {
  respawnMs: { low: 16000, normal: 12000, chaos: 7000 },
  radius: 56
};

function crashoutItemTier(itemId) {
  return Object.keys(crashoutItemTiers).find((tier) => crashoutItemTiers[tier].includes(itemId)) || "common";
}

function crashoutRollTier(setting) {
  const odds = crashoutTierOdds[setting] || crashoutTierOdds.normal;
  let roll = Math.random();
  for (const tier of ["common", "rare", "chaos"]) {
    roll -= odds[tier];
    if (roll < 0) return tier;
  }
  return "common";
}

// TODO: tune placed-pickup positions against future arena layouts.
function crashoutPlacedPickupSlots() {
  const setting = crashoutCurrentSettings().items || "normal";
  if (setting === "off") return [];
  return setting === "low" ? [{ id: "rare", tier: "rare" }] : [{ id: "rare", tier: "rare" }, { id: "chaos", tier: "chaos" }];
}

function crashoutPlacedPickupPoint(slotId, now = crashoutLocalNow()) {
  const sdfPickup = crashoutSdfPickupPoint(slotId, now);
  if (sdfPickup) return sdfPickup;
  const r = crashoutActiveRadius(now);
  const cx = crashoutArena.cx;
  const cy = crashoutArena.cy;
  const shape = crashoutShape();
  const rare = slotId === "rare";
  if (shape === "bridge") return rare ? { x: cx - r * 0.66, y: cy } : { x: cx + r * 0.74, y: cy };
  if (shape === "square") return rare ? { x: cx, y: cy - r * 0.5 } : { x: cx, y: cy + r * 0.68 };
  if (shape === "donut") return rare ? { x: cx, y: cy - r * 0.5 } : { x: cx, y: cy + r * 0.8 };
  return rare ? { x: cx, y: cy - r * 0.5 } : { x: cx, y: cy + r * 0.74 };
}

function crashoutNextPlacedItem(tier, previousId = null) {
  let item = crashoutRandomItem(tier);
  for (let attempt = 0; attempt < 4 && item && item.id === previousId; attempt += 1) item = crashoutRandomItem(tier);
  return item;
}

function crashoutMakePlacedPickup(slot) {
  const point = crashoutPlacedPickupPoint(slot.id);
  return { id: `lg-placed-${slot.id}`, placed: true, slot: slot.id, tier: slot.tier, item: crashoutRandomItem(slot.tier), x: point.x, y: point.y, active: true, respawnAt: 0 };
}

function crashoutDrawPlacedPickups(ctx) {
  if (!crashoutState) return;
  const now = crashoutLocalNow();
  const pulse = 1 + Math.sin(performance.now() / 220) * 0.06;
  crashoutState.itemBoxes.filter((box) => box.placed).forEach((box) => {
    const tint = crashoutTierColors[box.tier] || "#ffffff";
    ctx.save();
    ctx.translate(box.x, box.y);
    if (box.active) {
      ctx.fillStyle = "rgba(8, 12, 20, 0.72)";
      ctx.beginPath();
      ctx.arc(0, 0, crashoutPlacedPickupTuning.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = tint;
      ctx.shadowColor = tint;
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.shadowBlur = 0;
      const icon = box.item ? crashoutItemImages[box.item.id] : null;
      if (icon?.complete && icon.naturalWidth) ctx.drawImage(icon, -31, -31, 62, 62);
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
      ctx.arc(0, 0, crashoutPlacedPickupTuning.radius, 0, Math.PI * 2);
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
    ctx.fillText(box.tier.toUpperCase(), 0, crashoutPlacedPickupTuning.radius + 14);
    ctx.restore();
  });
}

// -- Formats: Duel, Rally (2v2), Chaos ------------------------------------------------
const crashoutTeamColors = { blue: "#52c7ff", red: "#ff5c5c" };
// Spawn slots are crashoutSafePoint indexes: 0 = top, 2 = right, 4 = bottom, 6 = left.
const crashoutFormatSpawns = {
  duel: [6, 2],
  rally: [7, 5, 1, 3],
  chaos: [0, 1, 2, 3, 4, 5, 6, 7]
};

function crashoutFormatId() {
  const id = crashoutCurrentSettings().format;
  return crashoutFormats[id] ? id : "chaos";
}

function crashoutFormat() {
  return crashoutFormats[crashoutFormatId()];
}

function crashoutFormatLabel() {
  const format = crashoutFormat();
  return `${format.label} (${format.blurb})`;
}

function crashoutAreFoes(a, b) {
  if (!a || !b || a.id === b.id) return false;
  return !(a.team && b.team && a.team === b.team);
}

function crashoutIsFriendlyId(carId, otherId) {
  if (carId === otherId) return true;
  const car = crashoutState?.cars.find((entry) => entry.id === carId);
  const other = crashoutState?.cars.find((entry) => entry.id === otherId);
  return Boolean(car?.team && other?.team && car.team === other.team);
}

function crashoutApplyFormat(racers) {
  const formatId = crashoutFormatId();
  const spawns = crashoutFormatSpawns[formatId] || crashoutFormatSpawns.chaos;
  racers.forEach((racer, index) => {
    racer.team = crashoutFormats[formatId].teams ? (index < 2 ? "blue" : "red") : null;
    const point = crashoutSafePoint(spawns[index % spawns.length]);
    Object.assign(racer, { x: point.x, y: point.y, prevX: point.x, prevY: point.y, angle: point.angle, vx: Math.cos(point.angle) * 4, vy: Math.sin(point.angle) * 4 });
  });
}

function crashoutTeammateAlive(car) {
  if (!car?.team) return false;
  return crashoutLiveCars().some((other) => other.id !== car.id && other.team === car.team && !other.eliminated);
}

// TODO: extend this outcome model if future formats add more than two teams.
function crashoutMatchOutcome() {
  const survivors = crashoutLiveCars();
  const player = crashoutPlayer();
  const sides = new Set(survivors.map((car) => car.team || car.id));
  const done = sides.size <= 1;
  const playerWon = survivors.some((car) => car.player || (player?.team && car.team === player.team));
  return { done, playerWon, survivors };
}

function crashoutDrawTeamMarker(ctx, car) {
  if (!car.team || car.eliminated || car.respawnAt) return;
  const tint = crashoutTeamColors[car.team] || "#ffffff";
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = tint;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(car.x, car.y, 38, 38, 0, 0, Math.PI * 2);
  ctx.stroke();
  const player = crashoutPlayer();
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
const crashoutEvoTuning = {
  durationMs: 60000, evolveAt: [2, 5], koWindowMs: 4500, respawnMs: 900,
  evolveInvulnerableMs: 1200, evolveHitPauseMs: 160, final10Ms: 10000,
  suddenDeathSeconds: 40, picks: 3, arenas: ["indianapolis", "berlin", "dubai", "rio", "los-angeles", "seoul", "bangalore", "space"]
};
let crashoutEvoPickIds = [];
let crashoutEvoPendingCarId = null;

Object.assign(crashoutAnnouncerPriorities, { evoStart: 3, evolve: 5, evoFinal: 4, evoEnd: 7 });
Object.assign(crashoutAnnouncerLabels, { evoStart: "Evo Rush", evolve: "Evolution", evoFinal: "Final 10", evoEnd: "Time!" });
Object.assign(crashoutAnnouncerLines, {
  evoStart: ["SIXTY SECONDS! Knock 'em out, power UP!", "EVO RUSH! Every KO makes you STRONGER!", "Clock's running, baby! EVOLVE OR GET LEFT BEHIND!"],
  evolve: ["IT'S EVOLVING!", "A WHOLE NEW MACHINE!", "LOOK AT THAT TRANSFORMATION!"],
  evoFinal: ["TEN SECONDS! Make it COUNT!", "FINAL TEN! Who wants it MORE?", "Ten seconds left, baby!"],
  evoEnd: ["TIME! What a RUSH!", "That's the BUZZER, baby!", "SIXTY SECONDS OF MAYHEM!"]
});

function crashoutIsEvoRush() {
  return crashoutCurrentSettings().mode === "evoRush";
}

function crashoutEvoPool() {
  return cars.filter((car) => !car.tutorialOnly
    && !crashoutCrewExcludedIds.includes(car.id)
    && !(typeof isFusionLine === "function" && isFusionLine(car.id))
    && (car.evolutions || []).length >= 3
    && car.evolutions.slice(0, 3).every((form) => imageFor(form, "topdown") && imageFor(form, "display")));
}

function crashoutEvoRollPicks() {
  const pool = crashoutEvoPool().sort(() => Math.random() - 0.5);
  const owned = pool.filter((car) => isSelectablePlayerCar(car.id));
  const unowned = pool.filter((car) => !isSelectablePlayerCar(car.id));
  const picks = [];
  if (owned.length) picks.push(owned[0]);
  if (unowned.length) picks.push(unowned[0]);
  pool.forEach((car) => {
    if (picks.length < crashoutEvoTuning.picks && !picks.includes(car)) picks.push(car);
  });
  crashoutEvoPickIds = picks.slice(0, crashoutEvoTuning.picks).sort(() => Math.random() - 0.5).map((car) => car.id);
  return crashoutEvoPickIds;
}

function crashoutEvoSettings() {
  const arenas = crashoutEvoTuning.arenas;
  return {
    mode: "evoRush", format: "chaos", lives: 1, opponents: 7,
    ...crashoutCityArenaSettings(arenas[Math.floor(Math.random() * arenas.length)]),
    suddenDeathSeconds: crashoutEvoTuning.suddenDeathSeconds,
    items: "normal", aiDifficulty: el.crashoutSetupAi?.value || "normal"
  };
}

function crashoutBuildEvoRoster(carId) {
  const pool = crashoutEvoPool();
  const playerLine = cars.find((car) => car.id === carId) || pool[0];
  const others = pool.filter((car) => car.id !== playerLine.id).sort(() => Math.random() - 0.5).slice(0, 7);
  return [playerLine, ...others].map((car, index) => ({ car, form: car.evolutions[0], topdown: imageFor(car.evolutions[0], "topdown"), player: index === 0 }));
}

function crashoutEvoSetForm(car, formIndex) {
  const line = cars.find((item) => item.id === car.carId);
  if (!line) return false;
  const index = Math.max(0, Math.min(Math.min(2, line.evolutions.length - 1), formIndex));
  const form = line.evolutions[index];
  car.evoForm = index;
  car.name = form.name;
  car.image = car.evoImages?.[index] || betaMakeImage(imageFor(form, "topdown"), { measure: true });
  car.displayImage = imageFor(form, "display") || car.displayImage;
  car.ratings = betaRatingsForCar(car.carId, 1, index, false);
  car.physics = crashoutPhysics(car.ratings);
  return true;
}

function crashoutEvoInit(racers) {
  racers.forEach((car) => {
    const line = cars.find((item) => item.id === car.carId);
    car.crew = null;
    car.lives = 1;
    car.evoKOs = 0;
    car.evoRingOuts = 0;
    car.evoImages = (line?.evolutions || []).slice(0, 3).map((form, index) => index === 0 ? car.image : betaMakeImage(imageFor(form, "topdown"), { measure: true }));
    crashoutEvoSetForm(car, 0);
  });
  crashoutState.evo = { final10Called: false };
  crashoutState.stats.evolutions = 0;
  crashoutEvoRenderHud(0);
}

function crashoutEvoRingOut(car, now) {
  const attacker = car.lastHitBy && now - (car.lastHitAt || 0) < crashoutEvoTuning.koWindowMs
    ? crashoutState.cars.find((entry) => entry.id === car.lastHitBy) : null;
  Object.assign(car, {
    damage: 0, item: null, shieldHits: 0, bubbleUntil: 0, anchorUntil: 0, antiMagnetUntil: 0, overhaulUntil: 0,
    reverseUntil: 0, oilSlideUntil: 0, ramJammedUntil: 0, ironWallUntil: 0, overdriveUntil: 0, handlingWeakUntil: 0,
    grapple: null, lastHitBy: null, lastHitAt: 0
  });
  car.ram = crashoutMakeRamState();
  car.evoRingOuts = (car.evoRingOuts || 0) + 1;
  car.respawnAt = now + crashoutEvoTuning.respawnMs;
  if (attacker && attacker.id !== car.id) crashoutEvoCreditKO(attacker, now);
}

function crashoutEvoCreditKO(attacker, now) {
  attacker.evoKOs = (attacker.evoKOs || 0) + 1;
  if (attacker.player) {
    crashoutState.stats.playerKOs += 1;
    crashoutState.effects.push({ kind: "impactWord", x: attacker.x, y: attacker.y - 70, vx: 0, vy: -30, ttl: 650, life: 650, text: "+1 KO", size: 26, tint: "#ffc857", angle: 0, spin: 0 });
    crashoutAnnounce(crashoutState.stats.playerKOs >= 3 ? "koStreak" : "gearOut", { cooldown: 1200 });
  }
  const targetForm = crashoutEvoTuning.evolveAt.filter((needed) => attacker.evoKOs >= needed).length;
  if (targetForm > (attacker.evoForm || 0)) crashoutEvoEvolve(attacker, targetForm, now);
}

function crashoutEvoEvolve(car, formIndex, now) {
  const before = car.name;
  const previousForm = car.evoForm || 0;
  crashoutEvoSetForm(car, formIndex);
  if (car.evoForm === previousForm) return;
  car.damage = 0;
  car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + crashoutEvoTuning.evolveInvulnerableMs);
  car.ram = crashoutMakeRamState();
  crashoutState.effects.push({ kind: "ring", x: car.x, y: car.y, vx: 0, vy: 0, angle: 0, spin: 0, ttl: 700, life: 700, size: 170, tint: "#ffc857" });
  for (let i = 0; i < 16; i += 1) crashoutSpawnParticle("spark", car.x, car.y, (Math.PI * 2 * i) / 16, 200 + Math.random() * 120, 420, 10 + Math.random() * 8, i % 2 ? "#ffc857" : "#ffffff");
  crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 84, vx: 0, vy: -22, ttl: 1100, life: 1100, text: `${car.name.toUpperCase()}!`, size: 32, tint: "#ffc857", angle: 0, spin: 0 });
  if (car.player) {
    crashoutState.stats.evolutions = (crashoutState.stats.evolutions || 0) + 1;
    crashoutState.hitPauseUntil = now + crashoutEvoTuning.evolveHitPauseMs;
    crashoutState.shake = Math.max(crashoutState.shake || 0, 10);
    crashoutAnnounce("evolve", { force: true, major: true, line: `${before.toUpperCase()} EVOLVED INTO ${car.name.toUpperCase()}!`, duration: 1800 });
  } else {
    crashoutAnnounce("evolve", { cooldown: 3500, line: `${before} just became ${car.name}!` });
  }
}

function crashoutEvoTick(now) {
  const left = crashoutEvoTuning.durationMs - now;
  crashoutEvoRenderHud(now);
  if (!crashoutState.evo.final10Called && left <= crashoutEvoTuning.final10Ms) {
    crashoutState.evo.final10Called = true;
    crashoutAnnounce("evoFinal", { force: true, major: true });
  }
  if (left <= 0 && !crashoutState.finished) {
    const player = crashoutPlayer();
    const best = Math.max(...crashoutState.cars.map((car) => car.evoKOs || 0));
    finishCrashoutBeta((player?.evoKOs || 0) >= best && best > 0);
  }
}

function crashoutEvoRenderHud(now) {
  const hud = document.getElementById("crashout-evo-hud");
  const player = crashoutPlayer();
  if (!hud || !player) return;
  const left = Math.max(0, Math.ceil((crashoutEvoTuning.durationMs - Math.max(0, now)) / 1000));
  const kos = player.evoKOs || 0;
  const form = player.evoForm || 0;
  const next = crashoutEvoTuning.evolveAt[form];
  const signature = `${left}|${kos}|${form}`;
  if (hud.dataset.signature === signature) return;
  hud.dataset.signature = signature;
  hud.classList.toggle("final", left <= 10);
  hud.innerHTML = `<strong>${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</strong><span>KOs ${kos}</span><span class="crashout-evo-pips" aria-label="Form ${form + 1} of 3">${[0, 1, 2].map((index) => `<i class="${index <= form ? "on" : ""}"></i>`).join("")}</span><em>${next ? `Evolve at ${next}` : "Final form!"}</em>`;
}

function crashoutEvoSyncResultButtons(isEvo) {
  if (el.crashoutRestart) el.crashoutRestart.textContent = isEvo ? "Play Again" : "Restart";
  const editCrew = document.getElementById("crashout-edit-crew");
  if (editCrew) {
    editCrew.hidden = false;
    editCrew.textContent = isEvo ? "New Car" : "Edit Crew";
  }
  const share = document.getElementById("crashout-evo-share");
  if (share) share.hidden = !isEvo;
}

function crashoutEvoFinish(playerWon) {
  const player = crashoutPlayer();
  if (!player) return;
  const board = [...crashoutState.cars].sort((a, b) => (b.evoKOs || 0) - (a.evoKOs || 0) || (a.evoRingOuts || 0) - (b.evoRingOuts || 0));
  const rank = board.indexOf(player) + 1;
  const previousBest = Number(state.evoRushBest?.kos) || 0;
  const isBest = (player.evoKOs || 0) > previousBest;
  if (isBest) {
    state.evoRushBest = { kos: player.evoKOs, carId: player.carId, form: player.evoForm || 0 };
    if (typeof saveState === "function") saveState();
  }
  const daily = evoRushRecordDaily(player);
  const owned = isSelectablePlayerCar(player.carId);
  const family = cars.find((car) => car.id === player.carId)?.family || player.name;
  const finalCall = crashoutChooseLine(crashoutAnnouncerLines.evoEnd);
  crashoutAnnounce("evoEnd", { force: true, major: true, line: finalCall, duration: 5200, legendary: true });
  if (el.crashoutResultTitle) el.crashoutResultTitle.textContent = playerWon ? "Evo Rush Champion!" : `#${rank} in Evo Rush`;
  if (el.crashoutResultCopy) el.crashoutResultCopy.innerHTML = `<div class="crashout-result-card evo-rush-result"><div class="evo-rush-result-hero"><img src="${player.displayImage}" alt="${escapeHtml(player.name)}"><div><strong>${escapeHtml(player.name)}</strong><span>Form ${(player.evoForm || 0) + 1} of 3 · ${player.evoKOs || 0} KOs</span>${isBest ? `<b class="evo-rush-best-badge">New personal best!</b>` : `<small>Best: ${previousBest} KOs</small>`}${owned ? "" : `<small class="evo-rush-not-owned">${escapeHtml(family)} isn't in your garage yet.</small>`}</div></div>${evoRushResultFormsMarkup(player, daily)}<ol class="evo-rush-board">${board.slice(0, 3).map((car) => `<li class="${car.player ? "player" : ""}"><img src="${car.displayImage}" alt=""><span>${escapeHtml(car.name)}</span><strong>${car.evoKOs || 0} KOs</strong></li>`).join("")}</ol><div class="crashout-result-stats evo-rush-result-stats"><p><span>Ring-Outs Taken</span><strong>${player.evoRingOuts || 0}</strong></p><p><span>Perfect Rams</span><strong>${crashoutState.stats.perfectRams || 0}</strong></p><p><span>Biggest Hit</span><strong>${Math.round(crashoutState.stats.biggestHit)}</strong></p></div></div>`;
}

async function crashoutEvoShare() {
  const player = crashoutPlayer();
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
  if (crashoutState) stopCrashoutBeta(false);
  if (typeof viewIsActive === "function" && !viewIsActive("crashout-arena")) showView("crashout-arena");
  if (el.crashoutBeta) el.crashoutBeta.hidden = true;
  const crewScreen = document.getElementById("crashout-crew-select");
  if (crewScreen) crewScreen.hidden = true;
  const screen = document.getElementById("evo-rush-pick");
  if (screen) screen.hidden = false;
  if (reroll || !crashoutEvoPickIds.length) crashoutEvoRollPicks();
  renderEvoRushPick();
  window.scrollTo?.({ top: 0 });
}

function closeEvoRushPick() {
  evoRushExit();
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
  grid.innerHTML = crashoutEvoPickIds.map((carId) => {
    const line = cars.find((car) => car.id === carId);
    if (!line) return "";
    const owned = isSelectablePlayerCar(carId), special = crashoutSpecialFor({ carId }), type = crashoutTypeFor(carId), forms = line.evolutions.slice(0, 3);
    return `<article class="convoy-stage-side convoy-stage-side-player crashout-crew-select-card evo-rush-card"><span class="convoy-stage-side-kicker">${owned ? "In your garage" : "New to you"}</span><button class="convoy-stage-car-display convoy-stage-car-picker-button filled" type="button" data-evo-rush-pick="${carId}" aria-label="Start Evo Rush with ${escapeHtml(forms[0].name)}"><img src="${imageFor(forms[0], "display")}" alt="${escapeHtml(forms[0].name)}"></button><strong class="convoy-stage-car-name">${escapeHtml(forms[0].name)}</strong><span class="crashout-crew-select-meta">${type} · ${escapeHtml(special.name)}</span><div class="evo-rush-strip" aria-label="Evolution line">${forms.map((form, index) => `<span class="${index === 0 ? "known" : "hidden-form"}"><img src="${imageFor(form, "display")}" alt=""><em>${index === 0 ? "Start" : `${crashoutEvoTuning.evolveAt[index - 1]} KOs`}</em></span>`).join("")}</div><button class="story-primary evo-rush-go" type="button" data-evo-rush-pick="${carId}">Race</button></article>`;
  }).join("");
}

function startEvoRush(carId) {
  if (!cars.some((car) => car.id === carId)) return;
  crashoutEvoPendingCarId = carId;
  startCrashoutBeta();
}

document.getElementById("evo-rush-picks")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-evo-rush-pick]");
  if (button) startEvoRush(button.dataset.evoRushPick);
});
document.getElementById("evo-rush-back")?.addEventListener("click", closeEvoRushPick);
document.getElementById("evo-rush-reroll")?.addEventListener("click", () => { crashoutEvoRollPicks(); renderEvoRushPick(); });
document.getElementById("crashout-evo-share")?.addEventListener("click", crashoutEvoShare);

// -- Animated crowd: tiered stands ringing the arena --------------------------------
// Procedural, top-down fans in world space just outside the platform. They bob with
// the crowd's excitement, erupt around ring-outs, fire camera flashes, hold up signs,
// and run a stadium wave when things are calm. Only on-screen fans are drawn.
const crashoutCrowdTuning = {
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
  boardText: ["TUNER CRASHOUT", "GEARBORN", "ENGINES EVOLVED", "SPINDELL LABS"]
};

// ─── Evo Rush on the main menu: daily quick play (3D) ────────────────────────
// One featured GearBorn per day. Play Now launches it immediately, while another
// car remains available through the existing Evo Rush picker.
let evoRushReturnView = "menu";

function evoRushDayKey() {
  return typeof currentVaultDayKey === "function" ? currentVaultDayKey() : new Date().toISOString().slice(0, 10);
}

function evoRushDailyCarId() {
  const pool = crashoutEvoPool().map((car) => car.id).sort();
  if (!pool.length) return "";
  let hash = 2166136261;
  for (const char of `evo-rush:${evoRushDayKey()}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return pool[hash % pool.length];
}

function evoRushDaily() {
  const day = evoRushDayKey();
  const carId = evoRushDailyCarId();
  const saved = state.evoRushDaily;
  if (!saved || saved.day !== day || saved.carId !== carId) {
    state.evoRushDaily = { day, carId, kos: 0, form: -1, plays: 0 };
    saveState();
    return state.evoRushDaily;
  }
  return saved;
}

function evoRushRecordDaily(player) {
  if (!player) return null;
  const today = evoRushDaily();
  const next = { ...today, plays: (today.plays || 0) + 1, kos: Math.max(today.kos || 0, player.evoKOs || 0) };
  if (player.carId === today.carId) next.form = Math.max(today.form ?? -1, player.evoForm || 0);
  state.evoRushDaily = next;
  saveState();
  return next;
}

function evoRushFormsMarkup(carId, reached, options = {}) {
  const line = cars.find((car) => car.id === carId);
  if (!line) return "";
  return line.evolutions.slice(0, 3).map((form, index) => {
    const got = index <= reached;
    const need = index ? crashoutEvoTuning.evolveAt[index - 1] : 0;
    const caption = got ? escapeHtml(form.name) : `${need} KOs`;
    return `<figure class="evo-form ${got ? "got" : "missed"}">
      <span class="evo-form-art"><img src="${imageFor(form, "display")}" alt="${got ? escapeHtml(form.name) : "Unknown evolution"}" loading="lazy" decoding="async">${got ? "" : '<b aria-hidden="true">?</b>'}</span>
      ${options.captions === false ? "" : `<figcaption>${caption}</figcaption>`}
    </figure>`;
  }).join('<i class="evo-form-arrow" aria-hidden="true">›</i>');
}

function renderEvoRushMenuTile() {
  const tile = document.getElementById("menu-evo-rush");
  if (!tile) return;
  const today = evoRushDaily();
  const line = cars.find((car) => car.id === today.carId);
  tile.hidden = !line;
  if (!line) return;
  const forms = document.getElementById("menu-evo-today");
  const signature = `${today.day}|${today.carId}|${today.form}|${today.kos}|${state.evoRushBest?.kos || 0}`;
  if (tile.dataset.signature === signature) return;
  tile.dataset.signature = signature;
  if (forms) forms.innerHTML = evoRushFormsMarkup(today.carId, Math.max(0, today.form ?? 0), { captions: true });
  const name = document.getElementById("menu-evo-car");
  if (name) name.textContent = `Today's GearBorn: ${line.evolutions[0].name}`;
  const best = document.getElementById("menu-evo-best");
  if (best) {
    const allTime = Number(state.evoRushBest?.kos) || 0;
    best.textContent = today.plays
      ? `Today: ${today.kos} KO${today.kos === 1 ? "" : "s"} · Best ever: ${allTime}`
      : allTime ? `Best ever: ${allTime} KOs. Beat it today.` : "No runs yet. Sixty seconds is all it takes.";
  }
}

function startEvoRushFrom(returnView, carId) {
  evoRushReturnView = returnView || "menu";
  if (!carId) {
    openEvoRushPick(true);
    return;
  }
  if (typeof viewIsActive === "function" && !viewIsActive("crashout-arena")) showView("crashout-arena");
  const crewScreen = document.getElementById("crashout-crew-select");
  if (crewScreen) crewScreen.hidden = true;
  startEvoRush(carId);
  window.scrollTo?.({ top: 0 });
}

function evoRushExit() {
  const screen = document.getElementById("evo-rush-pick");
  if (screen) screen.hidden = true;
  const target = evoRushReturnView || "menu";
  showView(target);
  if (target === "beta" && typeof openBetaPrototypeIntro === "function") openBetaPrototypeIntro();
}

function evoRushRunItBack() {
  const carId = crashoutPlayer()?.carId;
  if (!carId) {
    openEvoRushPick(true);
    return;
  }
  startEvoRush(carId);
}

function evoRushResultFormsMarkup(player, daily) {
  const reached = player.evoForm || 0;
  const kos = player.evoKOs || 0;
  const nextNeed = crashoutEvoTuning.evolveAt[reached];
  const nudge = nextNeed
    ? `${nextNeed - kos} more KO${nextNeed - kos === 1 ? "" : "s"} and you'd have met ${reached === 0 ? "its next form" : "its final form"}. Run it back!`
    : "Full evolution line unlocked. Now beat your KO count.";
  const dailyLine = daily && player.carId === daily.carId
    ? `<small class="evo-rush-daily-line">Today's GearBorn · best today ${daily.kos} KO${daily.kos === 1 ? "" : "s"}</small>`
    : "";
  return `<div class="evo-rush-forms-result"><span class="evo-rush-forms-kicker">Evolutions this run</span><div class="evo-forms">${evoRushFormsMarkup(player.carId, reached)}</div><p class="evo-rush-nudge">${nudge}</p>${dailyLine}</div>`;
}

document.getElementById("menu-evo-play")?.addEventListener("click", () => startEvoRushFrom("menu", evoRushDaily().carId));
document.getElementById("menu-evo-pick")?.addEventListener("click", () => startEvoRushFrom("menu", ""));
const crashoutCrowdEventBumps = {
  gearOut: 0.5, koStreak: 0.6, perfectRam: 0.35, evolve: 0.6, finalTwo: 0.5, suddenDeath: 0.4,
  evoFinal: 0.5, winner: 1, evoEnd: 1, swap: 0.15, burnout: 0.2, lastLife: 0.3, matchStart: 0.5,
  duelStart: 0.5, rallyStart: 0.5, evoStart: 0.6
};
const crashoutCrowdPalettes = {
  mixed: ["#3f86b3", "#b8944a", "#b5654d", "#36937f", "#aeb6c2", "#7d64a8", "#a94d6a", "#2b6588", "#5b6475"],
  blue: ["#3f86b3", "#2b6588", "#6fa9cf", "#1d4d6e", "#aeb6c2"],
  red: ["#b54a4a", "#8f3434", "#cf7373", "#b5654d", "#aeb6c2"]
};
const crashoutCrowdSkins = ["#d9b08f", "#c08f6b", "#9c6a48", "#7a4f35", "#523525", "#e0c0a3"];

function crashoutCrowdReducedMotion() {
  if (typeof reduceMotionEnabled === "function") return reduceMotionEnabled();
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
}

function crashoutCrowdBuild() {
  const T = crashoutCrowdTuning;
  const { cx, cy } = crashoutArena;
  const inner = crashoutArena.radius * T.innerRadius;
  const rally = typeof crashoutFormat === "function" && crashoutFormat().teams;
  const fans = [];
  for (let row = 0; row < T.rows; row += 1) {
    const radius = inner + row * T.rowGap;
    const count = Math.floor((Math.PI * 2 * radius) / T.seatGap);
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + (row % 2 ? Math.PI / count : 0);
      const aisleOffset = ((angle % T.aisleEvery) + T.aisleEvery) % T.aisleEvery;
      if (aisleOffset < (T.seatGap * 0.9) / radius || Math.random() < 0.06) continue;
      const x = cx + Math.cos(angle) * radius;
      const palette = rally ? (x < cx ? crashoutCrowdPalettes.blue : crashoutCrowdPalettes.red) : crashoutCrowdPalettes.mixed;
      fans.push({
        x,
        y: cy + Math.sin(angle) * radius,
        angle,
        row,
        phase: Math.random() * Math.PI * 2,
        speed: 5 + Math.random() * 4,
        shirt: palette[Math.floor(Math.random() * palette.length)],
        skin: crashoutCrowdSkins[Math.floor(Math.random() * crashoutCrowdSkins.length)],
        sign: Math.random() < 0.05 ? (Math.random() < 0.5 ? "#ffc857" : "#f4f7fb") : null,
        hype: 0.6 + Math.random() * 0.6
      });
    }
  }
  return { fans, inner, excitement: 0.4, pulses: [], flashes: [], waveAt: -Infinity, nextWaveAt: 6000 + Math.random() * 6000 };
}

function crashoutCrowd() {
  if (!crashoutState) return null;
  if (!crashoutState.crowd) crashoutState.crowd = crashoutCrowdBuild();
  return crashoutState.crowd;
}

function crashoutCrowdOnEvent(eventKey) {
  const crowd = crashoutCrowd();
  const bump = crashoutCrowdEventBumps[eventKey];
  if (!crowd || !bump) return;
  crowd.excitement = Math.min(1, crowd.excitement + bump);
}

function crashoutCrowdPulse(x, y, strength = 1) {
  const crowd = crashoutCrowd();
  if (!crowd) return;
  const angle = Math.atan2(y - crashoutArena.cy, x - crashoutArena.cx);
  crowd.pulses.push({ angle, t0: crashoutLocalNow(), strength });
  crowd.excitement = Math.min(1, crowd.excitement + 0.25 * strength);
  for (let i = 0; i < Math.round(26 * strength); i += 1) {
    const flashAngle = angle + (Math.random() - 0.5) * 0.9;
    const radius = crowd.inner + Math.random() * crashoutCrowdTuning.rows * crashoutCrowdTuning.rowGap;
    crowd.flashes.push({ x: crashoutArena.cx + Math.cos(flashAngle) * radius, y: crashoutArena.cy + Math.sin(flashAngle) * radius, ttl: 140 + Math.random() * 120, delay: Math.random() * 500 });
  }
}

function crashoutCrowdUpdate(dt, now) {
  const crowd = crashoutCrowd();
  if (!crowd) return;
  const T = crashoutCrowdTuning;
  let floor = T.baseExcitement;
  if (crashoutState.suddenDeath) floor = 0.35;
  if (crashoutState.evo?.final10Called) floor = 0.55;
  if (crashoutState.finished) floor = 0.9;
  crowd.excitement = Math.max(floor, crowd.excitement - T.decayPerSecond * dt);
  crowd.pulses = crowd.pulses.filter((pulse) => now - pulse.t0 < T.pulseMs);
  if (now >= crowd.nextWaveAt && crowd.excitement < 0.45 && !crashoutState.finished) {
    crowd.waveAt = now;
    crowd.nextWaveAt = now + T.waveEveryMs + Math.random() * 8000;
  }
  if (crashoutCrowdReducedMotion()) {
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

function crashoutAngleGap(a, b) {
  return Math.abs(((a - b) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
}

function drawCrashoutCrowd(ctx) {
  const crowd = crashoutCrowd();
  if (!crowd) return;
  const T = crashoutCrowdTuning;
  const { cx, cy } = crashoutArena;
  const now = crashoutLocalNow();
  const t = performance.now() / 1000;
  const still = crashoutCrowdReducedMotion();
  const ratio = window.devicePixelRatio || 1;
  const zoom = crashoutArena.zoom || 1;
  const halfW = ((el.crashoutCanvas?.width || 960) / ratio / 2) / zoom + 60;
  const halfH = ((el.crashoutCanvas?.height || 620) / ratio / 2) / zoom + 60;
  const camX = crashoutCamera.x;
  const camY = crashoutCamera.y;
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
  const boardText = crashoutArenaTheme().boards || T.boardText;
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
      const gap = crashoutAngleGap(fan.angle, pulse.angle);
      if (gap > 0.9) return;
      const fade = 1 - (now - pulse.t0) / T.pulseMs;
      lift += pulse.strength * Math.exp(-(gap * gap) / 0.18) * fade * (still ? 0.6 : 0.6 + 0.4 * Math.abs(Math.sin(t * 9 + fan.phase)));
    });
    if (waveLive) {
      const gap = crashoutAngleGap(fan.angle, waveAngle);
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
const crashoutArenaCities = {
  indianapolis: { name: "Indianapolis", label: "Indianapolis Speedway", shape: "oval", floor: "#1b2230", rim: "#ffc857", glow: "rgba(255, 200, 87, 0.5)", pattern: "checker", boards: ["INDIANAPOLIS", "TUNER CRASHOUT", "GEARBORN", "BRICKYARD"], art: null },
  berlin: { name: "Berlin", label: "Berlin Werk Hex", shape: "hex", floor: "#191c23", rim: "#e5e7eb", glow: "rgba(143, 211, 255, 0.45)", pattern: "grid", boards: ["BERLIN", "TUNER CRASHOUT", "GEARBORN", "PRECISION"], art: null },
  dubai: { name: "Dubai", label: "Dubai Tower Ring", shape: "donut", floor: "#272116", rim: "#ffd27a", glow: "rgba(255, 210, 122, 0.5)", pattern: "rings", boards: ["DUBAI", "TUNER CRASHOUT", "GEARBORN", "GOLD RUSH"], art: null },
  rio: { name: "Rio de Janeiro", label: "Rio Carnival Bowl", shape: "circle", floor: "#12272a", rim: "#3ee6c1", glow: "rgba(62, 230, 193, 0.45)", pattern: "waves", boards: ["RIO", "CARNAVAL", "TUNER CRASHOUT", "GEARBORN"], art: null },
  "los-angeles": { name: "Los Angeles", label: "Los Angeles Block", shape: "square", floor: "#1e192a", rim: "#ff5c8a", glow: "rgba(255, 92, 138, 0.45)", pattern: "grid", boards: ["LOS ANGELES", "TUNER CRASHOUT", "GEARBORN", "HOLLYWOOD"], art: null },
  seoul: { name: "Seoul", label: "Seoul Twin Rings", shape: "twin", floor: "#17172a", rim: "#c084fc", glow: "rgba(192, 132, 252, 0.5)", pattern: "rings", boards: ["SEOUL", "TUNER CRASHOUT", "GEARBORN", "NEON NIGHTS"], art: null },
  "cape-town": { name: "Cape Town", label: "Cape Town Narrow Cape", shape: "bridge", floor: "#182521", rim: "#8fd3ff", glow: "rgba(143, 211, 255, 0.45)", pattern: "stripes", boards: ["CAPE TOWN", "TUNER CRASHOUT", "GEARBORN", "TABLE TOP"], art: null },
  bangalore: { name: "Bangalore", label: "Bangalore Crossroads", shape: "cross", floor: "#1b2819", rim: "#6ee7a8", glow: "rgba(110, 231, 168, 0.45)", pattern: "grid", boards: ["BANGALORE", "TUNER CRASHOUT", "GEARBORN", "GARDEN CITY"], art: null },
  space: { name: "Space", label: "Space Diamond", shape: "diamond", floor: "#0c0f22", rim: "#b9a8ff", glow: "rgba(185, 168, 255, 0.55)", pattern: "stars", boards: ["SPACE", "TUNER CRASHOUT", "GEARBORN", "ZERO G"], art: null }
};
const crashoutArenaDefaultTheme = { name: "", label: "Arena", shape: "circle", floor: "rgba(23, 32, 46, 0.96)", rim: "rgba(255, 200, 87, 0.68)", glow: "rgba(82, 199, 255, 0.48)", pattern: "rings", boards: null, art: null };
const crashoutSdfShapes = {
  oval: { halfLength: 0.32, radius: 0.68, pickups: { rare: [0, -0.34], chaos: [0.84, 0.12] } },
  hex: { apothem: 0.84, pickups: { rare: [0, -0.5], chaos: [0, 0.7] } },
  twin: { offset: 0.42, radius: 0.58, pickups: { rare: [0, 0], chaos: [-0.86, 0] } },
  cross: { long: 0.9, wide: 0.34, pickups: { rare: [0, -0.5], chaos: [0, 0.74] } },
  diamond: { reach: 0.92, pickups: { rare: [0, -0.5], chaos: [0, 0.74] } }
};
const crashoutArenaArtImages = {};
const crashoutArenaIconImages = {};

function crashoutCityArenaSettings(value) {
  const city = crashoutArenaCities[value];
  if (city) return { city: value, arena: city.shape };
  return { city: null, arena: value || "circle" };
}

function crashoutArenaTheme() {
  const cityId = crashoutCurrentSettings().city;
  return crashoutArenaCities[cityId] ? { id: cityId, ...crashoutArenaCities[cityId] } : crashoutArenaDefaultTheme;
}

// Signed distance in R units for the new shapes; null for the original four.
function crashoutShapeSdf(shape, ux, uy) {
  const def = crashoutSdfShapes[shape];
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

function crashoutSdfBoundary(x, y, now) {
  const shape = crashoutShape();
  if (!crashoutSdfShapes[shape]) return null;
  const radius = crashoutActiveRadius(now);
  const ux = (x - crashoutArena.cx) / radius;
  const uy = (y - crashoutArena.cy) / radius;
  const d = crashoutShapeSdf(shape, ux, uy);
  const h = 0.01;
  let nx = crashoutShapeSdf(shape, ux + h, uy) - crashoutShapeSdf(shape, ux - h, uy);
  let ny = crashoutShapeSdf(shape, ux, uy + h) - crashoutShapeSdf(shape, ux, uy - h);
  const length = Math.hypot(nx, ny) || 1;
  nx /= length;
  ny /= length;
  return { safe: d <= 0, edge: Math.max(0, 1 + d / 0.5), nx, ny, radius, sdf: d };
}

function crashoutSdfSafePoint(index) {
  const shape = crashoutShape();
  if (!crashoutSdfShapes[shape]) return null;
  const radius = crashoutActiveRadius();
  const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2;
  let reach = 0.62;
  while (reach > 0.12 && crashoutShapeSdf(shape, Math.cos(angle) * reach, Math.sin(angle) * reach) > -0.12) reach -= 0.03;
  const x = crashoutArena.cx + Math.cos(angle) * radius * reach;
  const y = crashoutArena.cy + Math.sin(angle) * radius * reach;
  return { x, y, angle: Math.atan2(crashoutArena.cy - y, crashoutArena.cx - x) };
}

function crashoutSdfPickupPoint(slotId, now) {
  const def = crashoutSdfShapes[crashoutShape()];
  if (!def) return null;
  const radius = crashoutActiveRadius(now);
  const [ux, uy] = def.pickups[slotId] || def.pickups.rare;
  return { x: crashoutArena.cx + ux * radius, y: crashoutArena.cy + uy * radius };
}

// The platform as a list of Path2D pieces (unions are drawn piece by piece).
function crashoutShapePaths(shape, radius) {
  const { cx, cy } = crashoutArena;
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
    const halfWidth = radius * 0.34;
    const p = path();
    p.roundRect(cx - halfLength, cy - halfWidth, halfLength * 2, halfWidth * 2, halfWidth);
    return [p];
  }
  if (shape === "oval") {
    const def = crashoutSdfShapes.oval;
    const width = (def.halfLength + def.radius) * radius;
    const height = def.radius * radius;
    const p = path();
    p.roundRect(cx - width, cy - height, width * 2, height * 2, height);
    return [p];
  }
  if (shape === "hex") {
    const vertex = (crashoutSdfShapes.hex.apothem / Math.cos(Math.PI / 6)) * radius;
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
    const def = crashoutSdfShapes.twin;
    return [-1, 1].map((side) => {
      const p = path();
      p.arc(cx + side * def.offset * radius, cy, def.radius * radius, 0, Math.PI * 2);
      return p;
    });
  }
  if (shape === "cross") {
    const def = crashoutSdfShapes.cross;
    const horizontal = path();
    horizontal.roundRect(cx - def.long * radius, cy - def.wide * radius, def.long * radius * 2, def.wide * radius * 2, 40);
    const vertical = path();
    vertical.roundRect(cx - def.wide * radius, cy - def.long * radius, def.wide * radius * 2, def.long * radius * 2, 40);
    return [horizontal, vertical];
  }
  if (shape === "diamond") {
    const reach = crashoutSdfShapes.diamond.reach * radius;
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

function crashoutDrawArenaPattern(ctx, theme, shape, radius) {
  const { cx, cy } = crashoutArena;
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

function crashoutDrawArenaDecal(ctx, theme, shape, radius) {
  if (!theme.id) return;
  const city = storyCities?.find?.((entry) => entry.id === theme.id);
  const iconSrc = city?.cityIcon || city?.icon;
  if (!iconSrc) return;
  if (!crashoutArenaIconImages[theme.id]) crashoutArenaIconImages[theme.id] = betaMakeImage(iconSrc);
  const icon = crashoutArenaIconImages[theme.id];
  if (!icon.complete || !icon.naturalWidth) return;
  const size = radius * (shape === "donut" || shape === "bridge" ? 0.26 : 0.42);
  const x = crashoutArena.cx;
  const y = crashoutArena.cy + (shape === "donut" ? -radius * 0.58 : 0);
  const scale = Math.min(size / icon.naturalWidth, size / icon.naturalHeight);
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.drawImage(icon, x - (icon.naturalWidth * scale) / 2, y - (icon.naturalHeight * scale) / 2, icon.naturalWidth * scale, icon.naturalHeight * scale);
  ctx.restore();
}

// -- Battle on Crashout ---------------------------------------------------------------
// Every Battle now plays as a Crashout Duel. beginBattle still builds battleState;
// when the Duel ends, finishBattle retains ownership of rewards and story progression.
const crashoutBattleTuning = {
  lives: 3,
  suddenDeathSeconds: 120,
  items: "normal",
  difficulty: [
    { below: 0.8, ai: "chill" },
    { below: 1.5, ai: "normal" },
    { below: Infinity, ai: "aggro" }
  ]
};
let crashoutBattlePending = null;
let crashoutBattleReturnView = null;

function crashoutIsBattle() {
  return crashoutCurrentSettings().mode === "battle";
}

function crashoutBattleCityId(battle) {
  const cityId = battle?.gauntlet?.cityId || battle?.boss?.track?.id || storyCities?.[state.selectedStoryCity]?.id;
  return crashoutArenaCities?.[cityId] ? cityId : "rio";
}

function crashoutBattleAiDifficulty(battle) {
  if (battle?.restartOptions?.tutorial) return "chill";
  const difficulty = Number(battle?.boss?.difficulty) || 1;
  return crashoutBattleTuning.difficulty.find((step) => difficulty < step.below)?.ai || "normal";
}

function crashoutBattleSettings(battle) {
  return {
    mode: "battle",
    format: "duel",
    lives: 1,
    opponents: 1,
    ...crashoutCityArenaSettings(crashoutBattleCityId(battle)),
    suddenDeathSeconds: crashoutBattleTuning.suddenDeathSeconds,
    items: crashoutBattleTuning.items,
    aiDifficulty: crashoutBattleAiDifficulty(battle)
  };
}

function crashoutBattleOpponentEntry(battle) {
  const unit = battle.opponent;
  let line = unit.carId ? cars.find((car) => car.id === unit.carId) : null;
  if (!line) line = cars.find((car) => (car.evolutions || []).some((form) => form.name === unit.name));
  let form = line?.evolutions?.find((item) => item.name === unit.name) || line?.evolutions?.[0];
  const evoIndex = battle.restartOptions?.opponentEvolutionIndex;
  if (line?.evolutions?.length && Number.isInteger(evoIndex)) form = line.evolutions[Math.max(0, Math.min(line.evolutions.length - 1, evoIndex))];
  let topdown = form ? imageFor(form, "topdown") : "";
  if (!line || !topdown) {
    const fallbackTopdown = battle.boss?.carImage || String(unit.image || "").replace(/-race(\.\w+)$/, "-topdown$1");
    const standInId = `battle-${slugify(unit.name || "opponent")}`;
    form = { name: unit.name || "Opponent", images: {} };
    line = { id: standInId, color: "#ff805f", evolutions: [form] };
    topdown = fallbackTopdown;
    if (typeof crashoutTypeCache !== "undefined") crashoutTypeCache.set(standInId, unit.type || "Neutral");
  }
  return { car: line, form, topdown };
}

function crashoutBuildBattleRoster(battle) {
  const playerLine = cars.find((car) => car.id === battle.carId) || cars[0];
  const playerForm = currentEvolution(playerLine.id);
  const playerTopdown = crashoutCarImagePath(playerLine.id) || imageFor(playerForm, "topdown");
  return [{ car: playerLine, form: playerForm, topdown: playerTopdown, player: true }, crashoutBattleOpponentEntry(battle)];
}

function crashoutBattleInit(racers, battle) {
  const [player, opponent] = racers;
  [[player, battle.player], [opponent, battle.opponent]].forEach(([racer, unit]) => {
    if (!racer || !unit) return;
    racer.crew = null;
    racer.lives = crashoutBattleTuning.lives;
    racer.ratings = { ...unit.stats };
    racer.physics = crashoutPhysics(racer.ratings);
    if (String(racer.carId).startsWith("battle-") && unit.image) racer.displayImage = unit.image;
  });
  if (opponent) {
    opponent.name = battle.opponent.name || opponent.name;
    opponent.archetype = "Aggro";
  }
}

function startCrashoutBattle(battle) {
  if (!battle || typeof startCrashoutBeta !== "function" || !el.crashoutCanvas) return false;
  crashoutBattlePending = battle;
  const fromView = activeViewId().replace(/-view$/, "");
  if (fromView !== "crashout-arena" || !crashoutBattleReturnView) crashoutBattleReturnView = fromView === "crashout-arena" ? "crashout" : fromView;
  battle.resultHost = el.crashoutCanvas.parentElement;
  startCrashoutBeta();
  if (battle.restartOptions?.tutorial && el.crashoutBetaBack) el.crashoutBetaBack.hidden = true;
  return true;
}

function crashoutBattleFinish(playerWon) {
  if (!battleState) return;
  if (el.crashoutResults) el.crashoutResults.hidden = true;
  if (el.crashoutBetaBack) el.crashoutBetaBack.hidden = true;
  if (playerWon) battleState.opponent.hp = 0;
  else battleState.player.hp = 0;
  finishBattle();
}

function crashoutBattleExit() {
  const returnView = crashoutBattleReturnView || "crashout";
  crashoutBattleReturnView = null;
  battleState = null;
  if (returnView === "story") {
    showView("story");
    finishStoryRaceScreen();
    return;
  }
  showView(returnView);
}

function crashoutBattleOpener() {
  const opponent = crashoutState?.cars?.find((car) => !car.player)?.name || "Your rival";
  const lines = crashoutAnnouncerLines.battleStart;
  return lines[Math.floor(Math.random() * lines.length)].replace("{opponent}", opponent);
}

Object.assign(crashoutAnnouncerPriorities, { battleStart: 3 });
Object.assign(crashoutAnnouncerLabels, { battleStart: "Crashout" });
Object.assign(crashoutAnnouncerLines, {
  battleStart: ["{opponent} is waiting. LET'S CRASH OUT!", "One on one with {opponent}! Three lives, NO MERCY!", "{opponent} wants your SPOT! Show 'em the WALL!"]
});
Object.assign(crashoutCrowdEventBumps, { battleStart: 0.6 });

// ─── Crashout feel: knockback, recovery and pause (3E) ───────────────────────
// Higher damage means longer launches. Leaving the platform starts a recoverable
// hang instead of an immediate ring-out, unless a car crosses the blast line.
const crashoutKnockTuning = {
  impactScale: 0.42,
  impactSoftCap: 1200,
  base: 40,
  growthPerPct: 0.022,
  launchFriction: 0.986,
  launchThrottle: 0.4,
  hangMs: 760,
  evoHangMs: 480,
  evoAiMissBonus: 0.2,
  blastPx: 240,
  voidThrottle: 0.45,
  voidTurnBoost: 1.7,
  voidDrag: 0.982,
  burstSpeed: 1.25,
  burstInward: 0.7,
  burstInvulnerableMs: 300,
  saveMinMs: 140
};
const crashoutAiRecoveryMs = { chill: 520, normal: 260, aggro: 140 };
const crashoutAiRecoveryMiss = { chill: 0.4, normal: 0.24, aggro: 0.1 };

function crashoutHangMs() {
  return crashoutIsEvoRush() ? crashoutKnockTuning.evoHangMs : crashoutKnockTuning.hangMs;
}

function crashoutKnockback(receiver, impact, reducer = 1) {
  const T = crashoutKnockTuning;
  const growth = 1 + Math.max(0, receiver.damage || 0) * T.growthPerPct;
  const soft = impact / (1 + impact / T.impactSoftCap);
  return ((soft * T.impactScale + T.base) * growth / receiver.physics.mass) * reducer;
}

function crashoutMarkLaunch(car) {
  if (!car || !(car.launchSpeed > 0)) return;
  car.launchSpeed = Math.max(car.launchSpeed, Math.hypot(car.vx, car.vy));
}

function crashoutIsLaunched(car) {
  return (car.launchSpeed || 0) > car.physics.maxSpeed * 1.02;
}

function crashoutOutsidePx(boundary) {
  if (Number.isFinite(boundary.sdf)) return boundary.sdf * boundary.radius;
  if (boundary.safe) return -1;
  return (boundary.edge - 1) * (boundary.halfWidth || boundary.radius || crashoutArena.radius);
}

function crashoutEdgeCheck(car, boundary, now) {
  const T = crashoutKnockTuning;
  const outside = crashoutOutsidePx(boundary);
  if (outside <= 0) {
    if (car.hang) {
      const hungFor = now - car.hang.since;
      car.hang = null;
      if (hungFor >= T.saveMinMs) crashoutRecoverySaved(car, now);
    }
    return;
  }
  if (!car.hang) {
    car.hang = { since: now, until: now + crashoutHangMs(), used: false, nx: boundary.nx || 0, ny: boundary.ny || 0 };
    if (car.player) crashoutState.shake = Math.max(crashoutState.shake || 0, 3);
  } else {
    car.hang.nx = boundary.nx || car.hang.nx;
    car.hang.ny = boundary.ny || car.hang.ny;
  }
  if (outside > T.blastPx || now >= car.hang.until) {
    car.hang = null;
    car.launchSpeed = 0;
    crashoutLoseLife(car, now);
  }
}

function crashoutRecoverySaved(car, now) {
  car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + 200);
  for (let i = 0; i < 6; i += 1) crashoutSpawnParticle("spark", car.x, car.y, Math.random() * Math.PI * 2, 80 + Math.random() * 120, 260 + Math.random() * 160, 12 + Math.random() * 10, "#6ee7a8");
  if (car.player) {
    if (crashoutState.stats) crashoutState.stats.edgeSaves = (crashoutState.stats.edgeSaves || 0) + 1;
    crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 70, vx: 0, vy: -30, ttl: 720, life: 720, text: "SAVED!", size: 28, tint: "#6ee7a8", angle: 0, spin: 0 });
    crashoutAnnounce("edgeSave", { major: true, cooldown: 4000 });
  }
}

function crashoutRecoveryBurst(car, controls, now) {
  const pressed = Boolean(controls.charge);
  const rising = pressed && !car.recoveryHeld;
  car.recoveryHeld = pressed;
  if (!car.hang || car.hang.used || !rising) return false;
  const T = crashoutKnockTuning;
  car.hang.used = true;
  const inX = -(car.hang.nx || 0);
  const inY = -(car.hang.ny || 0);
  let dx = inX * T.burstInward + Math.cos(car.angle) * (1 - T.burstInward);
  let dy = inY * T.burstInward + Math.sin(car.angle) * (1 - T.burstInward);
  const length = Math.hypot(dx, dy) || 1;
  dx /= length;
  dy /= length;
  const speed = car.physics.maxSpeed * T.burstSpeed;
  car.angle = Math.atan2(dy, dx);
  car.vx = dx * speed;
  car.vy = dy * speed;
  car.launchSpeed = speed;
  car.invulnerableUntil = Math.max(car.invulnerableUntil || 0, now + T.burstInvulnerableMs);
  if (!car.ram) car.ram = crashoutMakeRamState();
  crashoutStartRamRecovery(car, car.physics.ramRecoverMs);
  car.ram.held = true;
  car.ram.lockUntilRelease = true;
  const tint = car.player ? "#52c7ff" : "#ff805f";
  for (let i = 0; i < 8; i += 1) crashoutSpawnParticle("streak", car.x - dx * 22, car.y - dy * 22, Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 0.4, 140 + Math.random() * 90, 240 + Math.random() * 140, 60 + Math.random() * 30, tint);
  if (car.player) {
    crashoutState.shake = Math.max(crashoutState.shake || 0, 4);
    crashoutState.effects.push({ kind: "impactWord", x: car.x, y: car.y - 64, vx: 0, vy: -26, ttl: 560, life: 560, text: "RECOVER!", size: 24, tint: "#52c7ff", angle: 0, spin: 0 });
  }
  return true;
}

function crashoutAiRecoveryControls(car, now) {
  const level = crashoutCurrentSettings().ai || "normal";
  const target = Math.atan2(-(car.hang.ny || 0), -(car.hang.nx || 0));
  const diff = Math.atan2(Math.sin(target - car.angle), Math.cos(target - car.angle));
  if (car.hang.aiMiss === undefined) car.hang.aiMiss = Math.random() < (crashoutAiRecoveryMiss[level] ?? 0.24) + (crashoutIsEvoRush() ? crashoutKnockTuning.evoAiMissBonus : 0);
  const ready = now - car.hang.since >= (crashoutAiRecoveryMs[level] ?? 260);
  return { up: true, left: diff < -0.08, right: diff > 0.08, charge: ready && !car.hang.used && !car.hang.aiMiss };
}

function crashoutDrawHang(ctx, car, now) {
  if (!car.hang) return;
  const left = crashoutClamp((car.hang.until - now) / crashoutHangMs(), 0, 1);
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 92, 92, 0.25)";
  ctx.beginPath();
  ctx.arc(car.x, car.y, 46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = left > 0.35 ? "#ffc857" : "#ff5c5c";
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(car.x, car.y, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left);
  ctx.stroke();
  if (car.player && !car.hang.used) {
    ctx.shadowBlur = 0;
    ctx.font = "800 15px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(6, 10, 18, 0.85)";
    ctx.strokeText("RAM TO RECOVER", car.x, car.y + 66);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("RAM TO RECOVER", car.x, car.y + 66);
  }
  ctx.restore();
}

// ─── Pause ───────────────────────────────────────────────────────────────────
function crashoutCanPause() {
  return Boolean(crashoutState && !crashoutState.finished && !crashoutState.paused && typeof viewIsActive === "function" && viewIsActive("crashout-arena") && !el.crashoutBeta?.hidden);
}

function crashoutPause() {
  if (!crashoutCanPause()) return;
  crashoutState.paused = true;
  crashoutState.pausedAt = performance.now();
  if (crashoutState.raf) cancelAnimationFrame(crashoutState.raf);
  crashoutState.raf = null;
  Object.keys(crashoutKeys).forEach((key) => delete crashoutKeys[key]);
  if (typeof crashoutReleaseStick === "function") crashoutReleaseStick();
  updateCrashoutTouchVisuals();
  el.crashoutBeta?.classList.add("is-paused");
  const overlay = document.getElementById("crashout-pause-overlay");
  if (overlay) {
    const restart = document.getElementById("crashout-pause-restart");
    if (restart) restart.hidden = crashoutIsBattle();
    const quit = document.getElementById("crashout-pause-quit");
    if (quit) quit.hidden = Boolean(el.crashoutBetaBack?.hidden);
    overlay.hidden = false;
    document.getElementById("crashout-resume")?.focus({ preventScroll: true });
  }
  const button = document.getElementById("crashout-pause");
  if (button) button.setAttribute("aria-pressed", "true");
  crashoutPausePollGamepad();
}

function crashoutResume() {
  if (!crashoutState?.paused) return;
  const delta = performance.now() - (crashoutState.pausedAt || performance.now());
  crashoutState.paused = false;
  crashoutState.pausedAt = 0;
  if (crashoutState.startedAt) crashoutState.startedAt += delta;
  if (crashoutState.countdownUntil) crashoutState.countdownUntil += delta;
  if (crashoutState.goUntil) crashoutState.goUntil += delta;
  crashoutState.last = performance.now();
  crashoutHidePauseOverlay();
  if (!crashoutState.finished) crashoutState.raf = requestAnimationFrame(updateCrashoutBeta);
}

function crashoutTogglePause() {
  if (crashoutState?.paused) crashoutResume();
  else crashoutPause();
}

function crashoutHidePauseOverlay() {
  el.crashoutBeta?.classList.remove("is-paused");
  const overlay = document.getElementById("crashout-pause-overlay");
  if (overlay) overlay.hidden = true;
  const button = document.getElementById("crashout-pause");
  if (button) button.setAttribute("aria-pressed", "false");
}

function crashoutPausePollGamepad() {
  if (!crashoutState?.paused) return;
  const pad = [...(navigator.getGamepads?.() || [])].find(Boolean);
  const start = Boolean(pad?.buttons?.[9]?.pressed);
  if (start && !crashoutGamepad.pauseHeld) {
    crashoutGamepad.pauseHeld = true;
    crashoutResume();
    return;
  }
  crashoutGamepad.pauseHeld = start;
  requestAnimationFrame(crashoutPausePollGamepad);
}

document.getElementById("crashout-pause")?.addEventListener("click", () => crashoutTogglePause());
document.getElementById("crashout-resume")?.addEventListener("click", () => crashoutResume());
document.getElementById("crashout-pause-restart")?.addEventListener("click", () => {
  crashoutHidePauseOverlay();
  if (crashoutState) crashoutState.paused = false;
  if (crashoutIsEvoRush()) evoRushRunItBack();
  else startCrashoutBeta();
});
document.getElementById("crashout-pause-quit")?.addEventListener("click", () => {
  crashoutHidePauseOverlay();
  if (crashoutState) crashoutState.paused = false;
  stopCrashoutBeta(true);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) crashoutPause();
});

// ─── Crashout arenas & readability (3F) ──────────────────────────────────────
// Cars read clearly on every floor: a contact shadow, a colored ground halo
// (you = blue, teammates = green, rivals = orange), a light rim around the
// sprite, and a "YOU" marker. The camera zooms in on wide screens so cars are
// bigger, the crowd and background art sit back, and the old generic shape
// PNGs give way to the per-city platforms.
const crashoutReadability = {
  viewWorldWidth: 990,
  viewWorldHeight: 510,
  maxZoom: 1.3,
  crowdDim: 0.45,
  bgDim: 0.5,
  haloRadius: 36,
  rim: "rgba(0, 0, 0, 0.45)",
  rimBlur: 10,
  useShapeArt: false,
  colors: { you: "#52c7ff", team: "#6ee7a8", rival: "#ff805f" }
};

// 4C: tabletop look - light painted-concrete floor, thick black outlines.
const crashoutLookTuning = {
  outlineColor: "#0b0d12",
  outlineWidth: 2.7,
  dropShadow: "rgba(0, 0, 0, 0.45)",
  dropShadowBlur: 10,
  discAlpha: 0.42,
  floorTint: 0.9,
  floorBase: "#eef0f2",
  slabSize: 240,
  edgeBand: 120,
  rimWidth: 30,
  rimStripe: 10,
  platformShadow: [16, 26, 0.5],
  skids: { slipFrom: 150, slipRange: 220, fadeMs: 5000, maxPoints: 300, alpha: 0.26, width: 8 }
};

function crashoutDrawNow() {
  return Math.max(0, crashoutLocalNow());
}

function crashoutScaleAboutCar(ctx, car) {
  ctx.translate(car.x, car.y);
  ctx.scale(CRASHOUT_CAR_SCALE, CRASHOUT_CAR_SCALE);
  ctx.translate(-car.x, -car.y);
}

function crashoutInkRing(ctx, x, y, radius, color, width) {
  ctx.lineWidth = width + 4;
  ctx.strokeStyle = "rgba(11, 13, 18, 0.85)";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

const crashoutOutlineCache = new Map();
function crashoutDrawOutlinedSprite(ctx, img, bodyLength) {
  if (!img?.complete || !img.naturalWidth) return false;
  const T = crashoutLookTuning;
  const key = `${img.src}|${bodyLength}`;
  let outline = crashoutOutlineCache.get(key);
  if (!outline) {
    const res = 3;
    const size = Math.ceil(bodyLength * 2.4);
    const sil = document.createElement("canvas");
    sil.width = sil.height = size * res;
    const sctx = sil.getContext("2d");
    sctx.setTransform(res, 0, 0, res, (size * res) / 2, (size * res) / 2);
    gearbornDrawTopdownSprite(sctx, img, bodyLength);
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.globalCompositeOperation = "source-in";
    sctx.fillStyle = T.outlineColor;
    sctx.fillRect(0, 0, sil.width, sil.height);
    outline = document.createElement("canvas");
    outline.width = outline.height = sil.width;
    const octx = outline.getContext("2d");
    const w = T.outlineWidth * res;
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * Math.PI * 2;
      octx.drawImage(sil, Math.cos(a) * w, Math.sin(a) * w);
    }
    outline.drawSize = size;
    crashoutOutlineCache.set(key, outline);
  }
  const s = outline.drawSize;
  ctx.save();
  ctx.shadowColor = T.dropShadow;
  ctx.shadowBlur = T.dropShadowBlur;
  ctx.drawImage(outline, -s / 2, -s / 2, s, s);
  ctx.restore();
  return gearbornDrawTopdownSprite(ctx, img, bodyLength);
}

function crashoutViewZoom(viewW, viewH) {
  const R = crashoutReadability;
  return crashoutClamp(Math.min(viewW / R.viewWorldWidth, viewH / R.viewWorldHeight), 1, R.maxZoom);
}

function crashoutDimCrowd(ctx) {
  const crowd = typeof crashoutCrowd === "function" ? crashoutCrowd() : null;
  if (!crowd) return;
  const T = crashoutCrowdTuning;
  const { cx, cy } = crashoutArena;
  const inner = crowd.inner - T.rowGap;
  const outer = crowd.inner + T.rows * T.rowGap + 40;
  ctx.save();
  ctx.fillStyle = `rgba(4, 6, 12, ${crashoutReadability.crowdDim})`;
  ctx.beginPath();
  ctx.arc(cx, cy, outer, 0, Math.PI * 2);
  ctx.arc(cx, cy, Math.max(0, inner), 0, Math.PI * 2, true);
  ctx.fill("evenodd");
  ctx.restore();
}

function crashoutCarHaloColor(car) {
  const R = crashoutReadability.colors;
  if (car.player) return R.you;
  const player = crashoutPlayer();
  return player && !crashoutAreFoes(player, car) ? R.team : R.rival;
}

function crashoutDrawCarHalo(ctx, car) {
  const R = crashoutReadability;
  const color = crashoutCarHaloColor(car);
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.globalAlpha = car.hang ? 0.15 : crashoutLookTuning.discAlpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, R.haloRadius * 0.92, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.rotate(car.angle + Math.PI / 2);
  ctx.globalAlpha = car.hang ? 0.2 : 0.55;
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.ellipse(3, 6, CRASHOUT_SPRITE_BODY_LENGTH * 0.34, CRASHOUT_SPRITE_BODY_LENGTH * 0.56, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = car.player ? 0.95 : 0.7;
  crashoutInkRing(ctx, 0, 0, R.haloRadius, color, car.player ? 3.5 : 2.5);
  if (car.player) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(6, 10, 18, 0.9)";
    ctx.lineWidth = 4;
    ctx.font = "900 11px 'Bowlby One', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText("YOU", 0, R.haloRadius + 13);
    ctx.fillText("YOU", 0, R.haloRadius + 13);
  }
  ctx.restore();
}

// ─── Swap pads: drive on, press SWAP ─────────────────────────────────────────
function crashoutTrySwap(car = crashoutPlayer()) {
  if (!car || !car.swapPadId || car.respawnAt || car.eliminated) return false;
  const next = crashoutResolveNextUp(car);
  if (next < 0) return false;
  crashoutSwapCrew(car, next, crashoutLocalNow());
  car.swapPadId = null;
  return true;
}

function crashoutSyncSwapButton() {
  const button = document.getElementById("crashout-swap-button");
  if (!button) return;
  const show = Boolean(crashoutPlayer()?.swapPadId) && !crashoutState?.finished;
  if (button.hidden === show) button.hidden = !show;
}

function crashoutDrawSwapPad(ctx, pad, ready, onIt, cooldownLeft) {
  const T = crashoutCrewTuning;
  const spin = performance.now() / 900;
  ctx.save();
  ctx.translate(pad.x, pad.y);
  ctx.globalAlpha = ready ? 0.95 : 0.4;
  ctx.fillStyle = "rgba(10, 40, 38, 0.78)";
  ctx.beginPath();
  ctx.arc(0, 0, T.padRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#3ee6c1";
  ctx.setLineDash([10, 8]);
  ctx.rotate(spin);
  ctx.beginPath();
  ctx.arc(0, 0, T.padRadius - 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.rotate(-spin);
  if (!ready && cooldownLeft > 0) {
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#e9fffa";
    ctx.beginPath();
    ctx.arc(0, 0, T.padRadius + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cooldownLeft));
    ctx.stroke();
  }
  ctx.globalAlpha = ready ? 1 : 0.5;
  ctx.fillStyle = "#3ee6c1";
  ctx.font = "900 18px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⇄", 0, 1);
  if (onIt) {
    const pulse = 0.6 + Math.sin(performance.now() / 120) * 0.4;
    ctx.globalAlpha = 1;
    ctx.lineWidth = 5;
    ctx.strokeStyle = `rgba(233, 255, 250, ${pulse})`;
    ctx.beginPath();
    ctx.arc(0, 0, T.padRadius + 8, 0, Math.PI * 2);
    ctx.stroke();
    const touch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
    const label = crashoutGamepad.connected ? "SWAP · Y" : touch ? "TAP SWAP" : "SWAP · R";
    ctx.font = "900 15px 'Space Grotesk', sans-serif";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(6, 10, 18, 0.9)";
    ctx.strokeText(label, 0, T.padRadius + 26);
    ctx.fillStyle = "#e9fffa";
    ctx.fillText(label, 0, T.padRadius + 26);
  }
  ctx.restore();
}

// ─── Ring picker with previews ───────────────────────────────────────────────
const crashoutRingBlurbs = {
  indianapolis: "Long and lean. Build speed down the straights, then cash it in at the ends.",
  berlin: "Six flat edges. The corners are where cars go to die.",
  dubai: "A ring with a hole in the middle. Danger on both sides.",
  rio: "The classic bowl. Nowhere to hide.",
  "los-angeles": "Four edges, four corners. Pin them and push.",
  seoul: "Two rings joined at the hip. Fight across the gap.",
  "cape-town": "One long bridge. Every hit is a sideways threat.",
  bangalore: "Four arms, one center. Hold the middle.",
  space: "Four sharp points. Long way to fall."
};
const crashoutShapeLabels = { oval: "Oval", hex: "Hex", donut: "Donut", circle: "Circle", square: "Square", twin: "Twin Rings", bridge: "Bridge", cross: "Cross", diamond: "Diamond" };

function crashoutDrawRingPreview(canvas, cityId) {
  const city = crashoutArenaCities[cityId];
  if (!canvas || !city) return;
  const theme = { id: cityId, ...city };
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 220;
  const height = canvas.clientHeight || 140;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const bg = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) * 0.7);
  bg.addColorStop(0, "#111827");
  bg.addColorStop(1, "#05070c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  const R = crashoutArena.radius;
  const scale = Math.min(width, height) / (R * 2.25);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(scale, scale);
  ctx.translate(-crashoutArena.cx, -crashoutArena.cy);
  const paths = crashoutShapePaths(city.shape, R);
  const fillRule = city.shape === "donut" ? "evenodd" : "nonzero";
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 14;
  ctx.strokeStyle = theme.rim;
  ctx.lineWidth = 34;
  paths.forEach((path) => ctx.stroke(path));
  ctx.shadowBlur = 0;
  ctx.fillStyle = theme.floor;
  paths.forEach((path) => ctx.fill(path, fillRule));
  ctx.save();
  const clip = new Path2D();
  paths.forEach((path) => clip.addPath(path));
  ctx.clip(clip, fillRule);
  ctx.lineWidth = 3 / scale;
  crashoutDrawArenaPattern(ctx, theme, city.shape, R);
  ctx.restore();
  ctx.fillStyle = "#52c7ff";
  ctx.beginPath();
  ctx.arc(crashoutArena.cx, crashoutArena.cy, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function renderCrashoutRingPicker() {
  const grid = document.getElementById("crashout-ring-grid");
  const select = el.crashoutSetupArena || document.getElementById("crashout-setup-arena");
  if (!grid || !select) return;
  const saved = state.crashoutRing;
  if (saved && crashoutArenaCities[saved] && select.value !== saved) select.value = saved;
  const ids = [...select.options].map((option) => option.value).filter((id) => crashoutArenaCities[id]);
  const current = select.value;
  if (grid.dataset.rendered !== ids.join(",")) {
    grid.dataset.rendered = ids.join(",");
    grid.innerHTML = ids.map((id) => {
      const city = crashoutArenaCities[id];
      return `<button class="crashout-ring-card" type="button" data-crashout-ring="${id}" aria-pressed="false">
        <canvas class="crashout-ring-preview" aria-hidden="true"></canvas>
        <span class="crashout-ring-text">
          <strong>${escapeHtml(city.label)}</strong>
          <em>${crashoutShapeLabels[city.shape] || city.shape}</em>
          <small>${escapeHtml(crashoutRingBlurbs[id] || "")}</small>
        </span>
      </button>`;
    }).join("");
    requestAnimationFrame(() => grid.querySelectorAll("[data-crashout-ring]").forEach((card) => crashoutDrawRingPreview(card.querySelector("canvas"), card.dataset.crashoutRing)));
  }
  grid.querySelectorAll("[data-crashout-ring]").forEach((card) => {
    const selected = card.dataset.crashoutRing === current;
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
}

function selectCrashoutRing(cityId) {
  const select = el.crashoutSetupArena || document.getElementById("crashout-setup-arena");
  if (!select || !crashoutArenaCities[cityId]) return;
  select.value = cityId;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  state.crashoutRing = cityId;
  saveState();
  renderCrashoutRingPicker();
}

document.getElementById("crashout-ring-grid")?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-crashout-ring]");
  if (card) selectCrashoutRing(card.dataset.crashoutRing);
});
document.getElementById("crashout-swap-button")?.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  crashoutTrySwap(crashoutPlayer());
});
