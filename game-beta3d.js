// ─── BETA MODE (3D RACING) ──────────────────────────────────────────────────
const beta3dAssetList = {
  car: "assets/beta3d/car_baybee_pseudo3d.png",
  road: "assets/beta3d/road_main_strip.png",
  shoulder: "assets/beta3d/road_shoulder_strip.png",
  sky: "assets/beta3d/bg_sky_horizon.png",
  wall: "assets/beta3d/barrier_wall.png",
  tree: "assets/beta3d/tree_basic.png",
  cone: "assets/beta3d/obstacle_cone.png",
  barrel: "assets/beta3d/obstacle_barrel.png",
  oil: "assets/beta3d/oil_slick.png",
  boost: "assets/beta3d/boost_pad.png",
  trail: "assets/beta3d/effect_speed_trail.png"
};

const beta3dAssets = Object.fromEntries(Object.entries(beta3dAssetList).map(([key, src]) => {
  const img = new Image();
  img.src = src;
  return [key, img];
}));

const beta3dKeys = {};
const beta3dTrackLength = 14000;
const beta3dDrawDistance = 2300;
const beta3dSegmentLength = 12;
let beta3dState = null;
let beta3dOpponents = [];

const beta3dObjects = [
  { type: "tree", z: 420, side: -1.55 },
  { type: "wall", z: 620, side: 1.16 },
  { type: "boost", z: 880, lane: 0.08 },
  { type: "cone", z: 1240, lane: -0.34 },
  { type: "tree", z: 1520, side: 1.52 },
  { type: "oil", z: 1880, lane: 0.28 },
  { type: "barrel", z: 2460, lane: 0.42 },
  { type: "wall", z: 2840, side: -1.16 },
  { type: "boost", z: 3270, lane: -0.18 },
  { type: "cone", z: 3810, lane: 0.32 },
  { type: "tree", z: 4380, side: -1.55 },
  { type: "oil", z: 4820, lane: -0.26 },
  { type: "barrel", z: 5520, lane: -0.44 },
  { type: "boost", z: 6100, lane: 0.1 },
  { type: "tree", z: 6820, side: 1.52 },
  { type: "wall", z: 7340, side: -1.16 },
  { type: "cone", z: 7780, lane: 0.36 },
  { type: "boost", z: 8420, lane: -0.12 },
  { type: "oil", z: 9020, lane: 0.2 },
  { type: "tree", z: 9540, side: -1.56 },
  { type: "barrel", z: 10160, lane: -0.38 },
  { type: "wall", z: 10830, side: 1.16 },
  { type: "boost", z: 11580, lane: 0.18 },
  { type: "cone", z: 12280, lane: -0.3 },
  { type: "tree", z: 13000, side: 1.56 },
  { type: "oil", z: 13540, lane: 0.24 }
];

function beta3dDevEnabled() {
  const params = new URLSearchParams(window.location.search);
  return params.has("beta3d") || params.has("beta") || window.localStorage.getItem("gearborn_beta_dev") === "1";
}

function beta3dCurveAt(z) {
  const d = Math.max(0, Math.min(beta3dTrackLength, z));
  if (d < 900) return 0;
  if (d < 1650) return 0.42;
  if (d < 2350) return -0.34;
  if (d < 3200) return -0.58;
  if (d < 4100) return 0.5;
  if (d < 5000) return Math.sin((d - 4100) / 900 * Math.PI * 2) * 0.52;
  if (d < 5900) return -0.22;
  if (d < 7200) return 0.28;
  if (d < 8500) return -0.5;
  if (d < 9800) return Math.sin((d - 8500) / 1300 * Math.PI * 2) * 0.46;
  if (d < 11400) return 0.58;
  if (d < 12800) return -0.34;
  return 0.1;
}

function beta3dHillAt(z) {
  const d = Math.max(0, Math.min(beta3dTrackLength, z));
  if (d < 700) return 0;
  if (d < 1450) return Math.sin((d - 700) / 750 * Math.PI) * 0.45;
  if (d < 2350) return -Math.sin((d - 1450) / 900 * Math.PI) * 0.34;
  if (d < 3500) return Math.sin((d - 2350) / 1150 * Math.PI) * 0.62;
  if (d < 4700) return -Math.sin((d - 3500) / 1200 * Math.PI) * 0.48;
  if (d < 6100) return Math.sin((d - 4700) / 1400 * Math.PI) * 0.38;
  if (d < 7600) return -Math.sin((d - 6100) / 1500 * Math.PI) * 0.54;
  if (d < 9300) return Math.sin((d - 7600) / 1700 * Math.PI) * 0.7;
  if (d < 10800) return -Math.sin((d - 9300) / 1500 * Math.PI) * 0.42;
  if (d < 12400) return Math.sin((d - 10800) / 1600 * Math.PI) * 0.5;
  if (d < 13600) return -Math.sin((d - 12400) / 1200 * Math.PI) * 0.28;
  return 0;
}

function beta3dClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function beta3dLerp(a, b, t) {
  return a + (b - a) * beta3dClamp(t, 0, 1);
}

function beta3dLerpColor(a, b, t) {
  const hexA = a.replace("#", "");
  const hexB = b.replace("#", "");
  const ar = parseInt(hexA.slice(0, 2), 16);
  const ag = parseInt(hexA.slice(2, 4), 16);
  const ab = parseInt(hexA.slice(4, 6), 16);
  const br = parseInt(hexB.slice(0, 2), 16);
  const bg = parseInt(hexB.slice(2, 4), 16);
  const bb = parseInt(hexB.slice(4, 6), 16);
  const r = Math.round(beta3dLerp(ar, br, t)).toString(16).padStart(2, "0");
  const g = Math.round(beta3dLerp(ag, bg, t)).toString(16).padStart(2, "0");
  const blue = Math.round(beta3dLerp(ab, bb, t)).toString(16).padStart(2, "0");
  return `#${r}${g}${blue}`;
}

function beta3dGroundPalette() {
  const progress = beta3dClamp((beta3dState?.z || 0) / beta3dTrackLength, 0, 1);
  const zones = [
    { far: "#5f9548", near: "#315b2a" },
    { far: "#c29b57", near: "#80613c" },
    { far: "#42683d", near: "#1f422e" }
  ];
  if (progress < 0.5) {
    const t = progress / 0.5;
    return {
      far: beta3dLerpColor(zones[0].far, zones[1].far, t),
      near: beta3dLerpColor(zones[0].near, zones[1].near, t)
    };
  }
  const t = (progress - 0.5) / 0.5;
  return {
    far: beta3dLerpColor(zones[1].far, zones[2].far, t),
    near: beta3dLerpColor(zones[1].near, zones[2].near, t)
  };
}

function beta3dStats() {
  const baybee = cars.find((car) => car.id === "bee") || cars[0];
  const ratings = (typeof gearbornStatProfiles !== "undefined" ? gearbornStatProfiles.bee : null) || {
    speed: 74,
    acceleration: 86,
    handling: 82,
    torque: 84,
    body: 70,
    powertrain: 74
  };
  return { car: baybee, ratings };
}

function beta3dPhysicsFromStats(ratings) {
  return {
    maxSpeed: 960 + (ratings.speed || 74) * 8.2,
    acceleration: 580 + (ratings.acceleration || 86) * 8.6,
    brake: 980 + (ratings.torque || 84) * 4,
    steering: 1.08 + (ratings.handling || 82) / 92,
    torque: ratings.torque || 84,
    body: ratings.body || 70,
    pwrMultiplier: 1 + ((ratings.powertrain || 74) / 100) * 0.25
  };
}

function beta3dResetOpponents() {
  beta3dOpponents = [
    { id: "beta3d-rival-red", z: 560, x: -0.32, speed: 520, speedBias: 0.96, color: "#f25f5c" },
    { id: "beta3d-rival-blue", z: 940, x: 0.24, speed: 560, speedBias: 1.02, color: "#52c7ff" },
    { id: "beta3d-rival-green", z: 1360, x: 0.04, speed: 610, speedBias: 1.08, color: "#6ee7a8" }
  ];
}

function beta3dUpdateOpponents(dt) {
  if (!beta3dState) return;
  beta3dOpponents.forEach((opponent, index) => {
    const dz = opponent.z - beta3dState.z;
    let targetSpeed = beta3dState.speed * opponent.speedBias + 190 + index * 28;
    if (dz < -180) targetSpeed += 520;
    if (dz > 1500) targetSpeed *= 0.68;
    opponent.speed += (targetSpeed - opponent.speed) * Math.min(1, dt * 0.85);
    opponent.z += opponent.speed * dt;
    opponent.x += (0 - opponent.x) * dt * 0.32;
    opponent.x += Math.sin(beta3dState.elapsed * (0.9 + index * 0.17) + index * 2.4) * dt * 0.08;
    opponent.x = beta3dClamp(opponent.x, -0.78, 0.78);
    if (opponent.z < beta3dState.z - 520) {
      opponent.z = Math.min(beta3dTrackLength - 140, beta3dState.z + 1600 + index * 430);
      opponent.x = [-0.36, 0.28, 0.08][index] || 0;
      opponent.speed = beta3dState.speed * (0.9 + index * 0.06);
    }
    if (opponent.z > beta3dTrackLength) opponent.z = beta3dTrackLength - 80;
  });
}

function beta3dResizeCanvas() {
  if (!el.beta3dCanvas) return;
  const ratio = window.devicePixelRatio || 1;
  const rect = el.beta3dCanvas.getBoundingClientRect();
  el.beta3dCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
  el.beta3dCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
}

function beta3dInput(direction) {
  return Boolean(beta3dKeys[direction]);
}

function updateBeta3dControlVisuals() {
  document.querySelectorAll(".beta-3d-touch-controls").forEach((group) => {
    const leftActive = Boolean(beta3dKeys.left);
    const rightActive = Boolean(beta3dKeys.right);
    group.classList.toggle("steering-left", leftActive && !rightActive);
    group.classList.toggle("steering-right", rightActive && !leftActive);
    group.querySelectorAll("[data-beta3d-control]").forEach((button) => {
      button.classList.toggle("pressed", Boolean(beta3dKeys[button.dataset.beta3dControl]));
    });
  });
}

function setBeta3dControl(direction, active) {
  beta3dKeys[direction] = active;
  updateBeta3dControlVisuals();
}

function setBetaIntroCopy({ kicker, title, subtitle, copy }) {
  if (!el.betaIntro) return;
  const kickerEl = el.betaIntro.querySelector(".modal-kicker");
  const titleEl = el.betaIntro.querySelector("#beta-title");
  const subtitleEl = el.betaIntro.querySelector("h2");
  const copyEl = el.betaIntro.querySelector("p:not(.modal-kicker)");
  if (kickerEl) kickerEl.textContent = kicker;
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  if (copyEl) copyEl.textContent = copy;
}

function openBetaVsIntro() {
  if (!el.betaIntro || !el.betaRace) return;
  el.betaRace.hidden = true;
  if (el.beta3dRace) el.beta3dRace.hidden = true;
  el.betaMode?.classList.remove("prototype-only");
  el.betaMode?.classList.add("vs-only", "no-3d");
  setBetaIntroCopy({
    kicker: "Training Academy",
    title: "Vs. Race",
    subtitle: "Choose a race format.",
    copy: "Run full circuit races with the new racing engine."
  });
  showBetaScreen("beta-intro");
  setBetaLoading(false);
  stopBetaDemo(false);
  stopBeta3d(false);
}

function openBetaPrototypeIntro() {
  if (!el.betaIntro || !el.betaRace) return;
  betaRaceContext = { source: "prototype" };
  el.betaRace.hidden = true;
  if (el.beta3dRace) el.beta3dRace.hidden = true;
  el.betaMode?.classList.remove("vs-only", "no-3d");
  el.betaMode?.classList.add("prototype-only");
  setBetaIntroCopy({
    kicker: "Beta Mode",
    title: "Beta Mode",
    subtitle: "Pseudo-3D Racing Prototype",
    copy: "Experimental behind-the-car racing test. Progress and rewards are disabled."
  });
  showBetaScreen("beta-intro");
  setBetaLoading(false);
  stopBetaDemo(false);
  stopBeta3d(false);
}

function openBetaIntro() {
  if (betaRaceContext?.source === "prototype") openBetaPrototypeIntro();
  else openBetaVsIntro();
}

function startBeta3dRun() {
  if (!el.beta3dCanvas) return;
  stopBetaDemo(false);
  beta3dResizeCanvas();
  const { ratings } = beta3dStats();
  beta3dState = {
    active: true,
    finished: false,
    z: 0,
    x: 0,
    speed: 0,
    boostUntil: 0,
    slowdownUntil: 0,
    startTime: performance.now(),
    elapsed: 0,
    last: performance.now(),
    physics: beta3dPhysicsFromStats(ratings),
    passed: new Set(),
    raf: null
  };
  beta3dResetOpponents();
  Object.keys(beta3dKeys).forEach((key) => delete beta3dKeys[key]);
  updateBeta3dControlVisuals();
  el.betaIntro.hidden = true;
  el.betaRace.hidden = true;
  el.beta3dRace.hidden = false;
  el.beta3dResults.hidden = true;
  beta3dState.raf = requestAnimationFrame(updateBeta3dFrame);
}

function stopBeta3d(showIntro = true) {
  if (beta3dState?.raf) cancelAnimationFrame(beta3dState.raf);
  beta3dState = null;
  Object.keys(beta3dKeys).forEach((key) => delete beta3dKeys[key]);
  updateBeta3dControlVisuals();
  if (showIntro && el.betaIntro && el.beta3dRace) {
    el.betaIntro.hidden = false;
    el.beta3dRace.hidden = true;
  }
}

function finishBeta3dRun() {
  if (!beta3dState || beta3dState.finished) return;
  beta3dState.finished = true;
  beta3dState.active = false;
  if (beta3dState.raf) cancelAnimationFrame(beta3dState.raf);
  const elapsed = beta3dState.elapsed;
  const previous = Number(window.localStorage.getItem("beta3d_bestTime") || 0);
  if (!previous || elapsed < previous) window.localStorage.setItem("beta3d_bestTime", String(elapsed));
  el.beta3dFinalTime.textContent = `Final time: ${elapsed.toFixed(2)} s${!previous || elapsed < previous ? " · New Best!" : ` · Best: ${previous.toFixed(2)} s`}`;
  el.beta3dResults.hidden = false;
  drawBeta3dFrame();
}

function beta3dApplyObjectHits() {
  const state3d = beta3dState;
  if (!state3d) return;
  const now = state3d.elapsed * 1000;
  beta3dObjects.forEach((object, index) => {
    if (state3d.passed.has(index)) return;
    const dz = object.z - state3d.z;
    if (dz < -80) {
      state3d.passed.add(index);
      return;
    }
    if (Math.abs(dz) > 42) return;
    const lane = object.lane ?? object.side ?? 0;
    const width = object.type === "wall" ? 0.18 : object.type === "boost" ? 0.32 : 0.2;
    if (Math.abs(state3d.x - lane) > width) return;
    state3d.passed.add(index);
    if (object.type === "boost") {
      state3d.boostUntil = now + 900 * state3d.physics.pwrMultiplier;
      state3d.speed = Math.min(state3d.physics.maxSpeed * 1.22, state3d.speed + 270 * state3d.physics.pwrMultiplier);
    } else if (object.type === "wall") {
      state3d.speed *= 0.48 + Math.min(0.25, state3d.physics.body / 380);
      state3d.x *= 0.82;
    } else if (["cone", "barrel", "oil"].includes(object.type)) {
      const penalty = object.type === "oil" ? 0.58 : object.type === "barrel" ? 0.5 : 0.68;
      state3d.speed *= penalty + Math.min(0.22, state3d.physics.body / 420);
      state3d.slowdownUntil = now + (object.type === "oil" ? 950 : 600);
    }
  });
}

function updateBeta3dFrame(now) {
  if (!beta3dState || beta3dState.finished) return;
  const dt = Math.min(0.035, (now - beta3dState.last) / 1000);
  beta3dState.last = now;
  beta3dState.elapsed = (now - beta3dState.startTime) / 1000;
  const physics = beta3dState.physics;
  const ms = beta3dState.elapsed * 1000;
  const offRoad = Math.abs(beta3dState.x) > 0.9;
  const boosted = beta3dState.boostUntil > ms;
  const slowed = beta3dState.slowdownUntil > ms;
  let maxSpeed = physics.maxSpeed * (offRoad ? 0.58 + physics.torque / 420 : 1);
  let accel = physics.acceleration * (offRoad ? 0.64 + physics.torque / 480 : 1);
  if (boosted) {
    maxSpeed *= 1.22 + (physics.pwrMultiplier - 1) * 0.5;
    accel *= 1.25;
  }
  if (slowed) {
    maxSpeed *= 0.72;
    accel *= 0.82;
  }
  if (beta3dInput("up")) beta3dState.speed += accel * dt;
  if (beta3dInput("down")) beta3dState.speed -= physics.brake * dt;
  if (!beta3dInput("up") && !beta3dInput("down")) beta3dState.speed *= Math.max(0, 1 - 0.62 * dt);
  beta3dState.speed = Math.max(0, Math.min(maxSpeed, beta3dState.speed));
  const speedRatio = beta3dState.speed / Math.max(1, physics.maxSpeed);
  const steer = (beta3dInput("left") ? -1 : 0) + (beta3dInput("right") ? 1 : 0);
  beta3dState.x += steer * physics.steering * dt * (0.42 + speedRatio);
  beta3dState.x -= beta3dCurveAt(beta3dState.z + 320) * speedRatio * dt * 0.54;
  if (Math.abs(beta3dState.x) > 1.18) {
    beta3dState.x = Math.sign(beta3dState.x) * 1.18;
    beta3dState.speed *= 0.58 + Math.min(0.22, physics.body / 440);
  }
  beta3dState.z = Math.min(beta3dTrackLength, beta3dState.z + beta3dState.speed * dt);
  beta3dUpdateOpponents(dt);
  beta3dApplyObjectHits();
  drawBeta3dFrame();
  if (beta3dState.z >= beta3dTrackLength) {
    finishBeta3dRun();
    return;
  }
  beta3dState.raf = requestAnimationFrame(updateBeta3dFrame);
}

function beta3dProjection(zOffset, w, h, hillOffset = 0) {
  const near = Math.max(0.001, zOffset / beta3dDrawDistance);
  const eased = Math.pow(near, 0.62);
  const horizon = h * 0.34;
  const y = horizon + (1 - eased) * (h - horizon + 80) - hillOffset * (0.35 + (1 - near) * 0.85);
  const roadW = w * (0.1 + (1 - near) * 0.78);
  return { y, roadW, scale: 1 - near };
}

function beta3dCurveOffset(worldZ, w) {
  let offset = 0;
  for (let i = 0; i < 28; i += 1) offset += beta3dCurveAt(worldZ + i * beta3dSegmentLength) * (28 - i);
  return offset * w * 0.0018;
}

function beta3dHillOffset(worldZ, h) {
  let offset = 0;
  for (let i = 0; i < 28; i += 1) offset += beta3dHillAt(worldZ + i * beta3dSegmentLength) * (28 - i);
  return offset * h * 0.0009;
}

function beta3dDrawImage(ctx, img, x, y, width, height, fallback) {
  if (img?.complete && img.naturalWidth) {
    ctx.drawImage(img, x - width / 2, y - height, width, height);
  } else {
    fallback?.();
  }
}

function drawBeta3dBackground(ctx, w, h) {
  const sky = beta3dAssets.sky;
  const horizon = h * 0.34;
  const skyHeight = h * 0.52;
  const curvePan = beta3dCurveOffset((beta3dState?.z || 0) + 900, w) + (beta3dState?.x || 0) * w * 0.08;
  const hillPan = beta3dHillOffset((beta3dState?.z || 0) + 900, h);
  if (sky?.complete && sky.naturalWidth) {
    const skyW = Math.max(w, sky.naturalWidth * (skyHeight / sky.naturalHeight));
    const xStart = ((-curvePan * 0.22) % skyW) - skyW;
    const y = -18 - hillPan * 0.22;
    for (let x = xStart; x < w + skyW; x += skyW) {
      ctx.drawImage(sky, x, y, skyW, skyHeight + 36);
    }
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, skyHeight);
    gradient.addColorStop(0, "#2f68bb");
    gradient.addColorStop(1, "#ffc78a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, skyHeight);
  }
  const ground = beta3dGroundPalette();
  ctx.fillStyle = ground.far;
  ctx.fillRect(0, horizon, w, h * 0.24);
  const nearGradient = ctx.createLinearGradient(0, horizon + h * 0.16, 0, h);
  nearGradient.addColorStop(0, ground.far);
  nearGradient.addColorStop(1, ground.near);
  ctx.fillStyle = nearGradient;
  ctx.fillRect(0, horizon + h * 0.18, w, h);
}

function drawBeta3dRoad(ctx, w, h) {
  const roadPattern = beta3dAssets.road.complete && beta3dAssets.road.naturalWidth ? ctx.createPattern(beta3dAssets.road, "repeat") : null;
  const shoulderPattern = beta3dAssets.shoulder.complete && beta3dAssets.shoulder.naturalWidth ? ctx.createPattern(beta3dAssets.shoulder, "repeat") : null;
  for (let z = beta3dDrawDistance; z > 0; z -= beta3dSegmentLength) {
    const worldZ1 = beta3dState.z + z;
    const worldZ2 = beta3dState.z + z - beta3dSegmentLength;
    const p1 = beta3dProjection(z, w, h, beta3dHillOffset(worldZ1, h));
    const p2 = beta3dProjection(Math.max(1, z - beta3dSegmentLength), w, h, beta3dHillOffset(worldZ2, h));
    const c1 = w / 2 + beta3dCurveOffset(worldZ1, w) - beta3dState.x * p1.roadW * 0.42;
    const c2 = w / 2 + beta3dCurveOffset(worldZ2, w) - beta3dState.x * p2.roadW * 0.42;
    const road1 = p1.roadW * 0.48;
    const road2 = p2.roadW * 0.48;
    const shoulder1 = p1.roadW * 0.77;
    const shoulder2 = p2.roadW * 0.77;
    ctx.beginPath();
    ctx.moveTo(c1 - shoulder1, p1.y);
    ctx.lineTo(c1 + shoulder1, p1.y);
    ctx.lineTo(c2 + shoulder2, p2.y);
    ctx.lineTo(c2 - shoulder2, p2.y);
    ctx.closePath();
    ctx.fillStyle = shoulderPattern || "#8b6f3f";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(c1 - road1, p1.y);
    ctx.lineTo(c1 + road1, p1.y);
    ctx.lineTo(c2 + road2, p2.y);
    ctx.lineTo(c2 - road2, p2.y);
    ctx.closePath();
    ctx.fillStyle = roadPattern || "#33383f";
    ctx.fill();
    if (Math.floor(worldZ2 / 280) % 2 === 0) {
      ctx.strokeStyle = "rgba(255,255,255,.55)";
      ctx.lineWidth = Math.max(1, p2.roadW * 0.012);
      ctx.beginPath();
      ctx.moveTo(c1, p1.y);
      ctx.lineTo(c2, p2.y);
      ctx.stroke();
    }
  }
}

function drawBeta3dObjects(ctx, w, h) {
  const visibleObjects = beta3dObjects
    .map((object, index) => ({ ...object, index, dz: object.z - beta3dState.z, beta3dKind: "object" }))
    .filter((object) => object.dz > 0 && object.dz < beta3dDrawDistance);
  const visibleOpponents = beta3dOpponents
    .map((opponent, index) => ({ ...opponent, index, dz: opponent.z - beta3dState.z, beta3dKind: "opponent" }))
    .filter((opponent) => opponent.dz > 0 && opponent.dz < beta3dDrawDistance);
  const visible = visibleObjects
    .concat(visibleOpponents)
    .sort((a, b) => b.dz - a.dz);
  visible.forEach((object) => {
    const worldZ = beta3dState.z + object.dz;
    const p = beta3dProjection(object.dz, w, h, beta3dHillOffset(worldZ, h));
    const center = w / 2 + beta3dCurveOffset(worldZ, w) - beta3dState.x * p.roadW * 0.42;
    if (object.beta3dKind === "opponent") {
      beta3dDrawOpponent(ctx, object, center, p);
      return;
    }
    const lateral = object.lane ?? object.side ?? 0;
    const x = center + lateral * p.roadW * 0.5;
    const scale = Math.max(0.08, p.scale);
    const img = beta3dAssets[object.type] || beta3dAssets.cone;
    const size = {
      tree: [170, 260],
      wall: [190, 92],
      boost: [150, 70],
      cone: [86, 112],
      barrel: [104, 126],
      oil: [132, 48]
    }[object.type] || [90, 90];
    beta3dDrawImage(ctx, img, x, p.y + 16 * scale, size[0] * scale, size[1] * scale, () => {
      ctx.fillStyle = object.type === "boost" ? "#52c7ff" : object.type === "tree" ? "#2a8f4d" : "#ff805f";
      ctx.fillRect(x - size[0] * scale / 2, p.y - size[1] * scale, size[0] * scale, size[1] * scale);
    });
  });
}

function beta3dDrawOpponent(ctx, opponent, center, projection) {
  const scale = Math.max(0.08, projection.scale);
  const x = center + opponent.x * projection.roadW * 0.45;
  const y = projection.y + 18 * scale;
  const carW = 210 * scale;
  const carH = carW * 0.72;
  ctx.save();
  ctx.globalAlpha = beta3dClamp(0.38 + scale * 0.72, 0.38, 0.95);
  if (beta3dAssets.car.complete && beta3dAssets.car.naturalWidth) {
    ctx.drawImage(beta3dAssets.car, x - carW / 2, y - carH, carW, carH);
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = opponent.color;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(x - carW / 2, y - carH, carW, carH);
  } else {
    ctx.fillStyle = opponent.color;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - carW / 2, y - carH, carW, carH, 14 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(x - carW / 2, y - carH, carW, carH);
    }
  }
  ctx.restore();
}

function drawBeta3dCar(ctx, w, h) {
  const speedRatio = beta3dState.speed / Math.max(1, beta3dState.physics.maxSpeed);
  const carW = Math.min(310, w * 0.34) * (1 + speedRatio * 0.035);
  const carH = carW * 0.72;
  const carX = w / 2 + beta3dState.x * w * 0.16;
  const carY = h - 26;
  const boosting = beta3dState.boostUntil > beta3dState.elapsed * 1000 || speedRatio > 0.82;
  if (boosting) {
    beta3dDrawImage(ctx, beta3dAssets.trail, carX, carY + 12, carW * 1.22, carH * 0.94, () => {
      ctx.fillStyle = "rgba(82,199,255,.3)";
      ctx.beginPath();
      ctx.ellipse(carX, carY - carH * 0.18, carW * 0.46, carH * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.save();
  ctx.translate(carX, carY);
  ctx.rotate(((beta3dInput("right") ? 1 : 0) - (beta3dInput("left") ? 1 : 0)) * 0.045);
  if (beta3dAssets.car.complete && beta3dAssets.car.naturalWidth) {
    ctx.drawImage(beta3dAssets.car, -carW / 2, -carH, carW, carH);
  } else {
    ctx.fillStyle = "#ffc857";
    ctx.roundRect?.(-carW / 2, -carH, carW, carH, 22);
    ctx.fill();
  }
  ctx.restore();
}

function drawBeta3dFrame() {
  if (!beta3dState || !el.beta3dCanvas) return;
  beta3dResizeCanvas();
  const ctx = el.beta3dCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.beta3dCanvas.width / ratio;
  const h = el.beta3dCanvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  drawBeta3dBackground(ctx, w, h);
  drawBeta3dRoad(ctx, w, h);
  drawBeta3dObjects(ctx, w, h);
  drawBeta3dCar(ctx, w, h);
  const progress = Math.max(0, Math.min(1, beta3dState.z / beta3dTrackLength));
  el.beta3dTime.textContent = beta3dState.elapsed.toFixed(2);
  el.beta3dSpeed.textContent = `${Math.round(beta3dState.speed / 16)} MPH`;
  el.beta3dProgressFill.style.width = `${progress * 100}%`;
  el.beta3dMarker.style.left = `${Math.min(98, Math.max(2, progress * 100))}%`;
}

el.beta3dStart?.addEventListener("click", startBeta3dRun);
el.beta3dRestart?.addEventListener("click", startBeta3dRun);
el.beta3dExit?.addEventListener("click", () => openBetaIntro());
el.beta3dFinishExit?.addEventListener("click", () => openBetaIntro());

document.querySelectorAll("[data-beta3d-control]").forEach((button) => {
  const direction = button.dataset.beta3dControl;
  const press = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    setBeta3dControl(direction, true);
  };
  const release = (event) => {
    event.preventDefault();
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    setBeta3dControl(direction, false);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", (event) => {
    if (button.hasPointerCapture?.(event.pointerId)) return;
    setBeta3dControl(direction, false);
  });
});

document.addEventListener("keydown", (event) => {
  if (!document.querySelector("#beta-view")?.classList.contains("active")) return;
  const key = normalizeKey(event);
  const map = { W: "up", ArrowUp: "up", S: "down", ArrowDown: "down", A: "left", ArrowLeft: "left", D: "right", ArrowRight: "right" };
  if (map[key] && !el.beta3dRace?.hidden) {
    event.preventDefault();
    beta3dKeys[map[key]] = true;
    updateBeta3dControlVisuals();
  }
});

document.addEventListener("keyup", (event) => {
  const key = normalizeKey(event);
  const map = { W: "up", ArrowUp: "up", S: "down", ArrowDown: "down", A: "left", ArrowLeft: "left", D: "right", ArrowRight: "right" };
  if (map[key]) {
    beta3dKeys[map[key]] = false;
    updateBeta3dControlVisuals();
  }
});

// ─── HUB MAP BETA FOUNDATION (isolated, disposable prototype) ───────────────
const hubMapState = {
  tileSize: 32,
  width: 24,
  height: 16,
  tiles: [],
  playerX: 12,
  playerY: 8,
  playerDirection: 0,
  moveTween: null,
  animFrame: 0,
  dialogue: null
};

const hubMapTILE_FLOOR = 0;
const hubMapTILE_WALL = 1;
const hubMapTILE_HANGAR = 2;
const hubMapTILE_STRIPE = 3;
const hubMapTILE_DOOR = 4;
const hubMapTILE_CONSOLE = 5;
const hubMapTileWalkable = { 0: true, 1: false, 2: true, 3: true, 4: true, 5: false };
let hubMapAnimClock = 0;
const hubMapAnimInterval = 125;
const hubMapPlayer = { spriteKey: "mylo", direction: 0, moving: false, animCol: 1 };
let hubMapShowLabels = false;
let hubMapMovementLocked = false;
const hubMapHeldKeys = {};
let hubMapMoveCooldown = 0;
let hubMapAssetsLoaded = false;
let hubMapBgImage = null;
let hubMapPropsImage = null;
let hubMapTilesetImage = null;
const hubMapSprites = {};
const hubMapPortraits = {};
const hubMapPropFrames = {
  vat: { x: 0, y: 0, w: 260, h: 220 },
  car_lift: { x: 280, y: 0, w: 420, h: 180 },
  gear: { x: 0, y: 240, w: 160, h: 160 },
  lamp: { x: 180, y: 240, w: 140, h: 180 },
  toolbox: { x: 0, y: 440, w: 150, h: 130 },
  pipe_h: { x: 180, y: 440, w: 200, h: 90 },
  pipe_v: { x: 420, y: 440, w: 100, h: 160 }
};
const hubMapNpcs = [
  { id: "ashley", spriteKey: "ashley", portraitKey: "ashley", name: "Ashley", x: 4, y: 8, direction: 2 },
  { id: "auntie", spriteKey: "auntie", portraitKey: "auntie", name: "Auntie", x: 12, y: 8, direction: 0 },
  { id: "eli", spriteKey: "eli", portraitKey: "eli", name: "Eli", x: 19, y: 8, direction: 1 }
];
const hubMapNPCs = hubMapNpcs;
const hubMapInteractTiles = [
  { x: 10, y: 13, type: "car_bay", id: "bay_1", carId: "bee" },
  { x: 14, y: 13, type: "car_bay", id: "bay_2", carId: null },
  { x: 18, y: 13, type: "car_bay", id: "bay_3", carId: null },
  { x: 12, y: 2, type: "door", id: "exit" }
];
const hubMapDialogueDB = {
  ashley_default: [
    "You're late. Again.",
    "The bee is in bay one. Don't touch anything else until you talk to Auntie."
  ],
  auntie_default: [
    "Baby. You made it.",
    "We've got three bays ready. Walk up to any console and press E to pull up your garage.",
    "Don't let Ashley catch you messing with her tools."
  ],
  eli_default: [
    "Yo, you see the new setup? Auntie went all out.",
    "I'm working on something for the next race. Come find me when you're done in the garage."
  ]
};
const hubMapDialogue = { active: false, lines: [], page: 0, speakerName: "", portraitKey: "" };

function hubMapCreateImage(src) {
  const hubMapImage = new Image();
  hubMapImage.src = src;
  return hubMapImage;
}

function hubMapLoadSprite(key, src, sheetCols, rows, usableCols = sheetCols) {
  const hubMapImage = hubMapCreateImage(src);
  const hubMapSprite = {
    img: hubMapImage,
    image: hubMapImage,
    src,
    frameW: 0,
    frameH: 0,
    cols: sheetCols,
    usableCols,
    rows,
    sheetCols
  };
  hubMapImage.addEventListener("load", () => {
    hubMapSprite.frameW = Math.floor(hubMapImage.naturalWidth / hubMapSprite.cols);
    hubMapSprite.frameH = Math.floor(hubMapImage.naturalHeight / hubMapSprite.rows);
    const hubMapCanvas = document.createElement("canvas");
    hubMapCanvas.width = hubMapImage.naturalWidth;
    hubMapCanvas.height = hubMapImage.naturalHeight;
    const hubMapCtx = hubMapCanvas.getContext("2d");
    hubMapCtx.drawImage(hubMapImage, 0, 0);
    const hubMapPixels = hubMapCtx.getImageData(0, 0, hubMapCanvas.width, hubMapCanvas.height);
    for (let hubMapIndex = 0; hubMapIndex < hubMapPixels.data.length; hubMapIndex += 4) {
      const hubMapR = hubMapPixels.data[hubMapIndex];
      const hubMapG = hubMapPixels.data[hubMapIndex + 1];
      const hubMapB = hubMapPixels.data[hubMapIndex + 2];
      if (hubMapR < 24 && hubMapG < 24 && hubMapB < 24) hubMapPixels.data[hubMapIndex + 3] = 0;
    }
    hubMapCtx.putImageData(hubMapPixels, 0, 0);
    hubMapSprite.canvas = hubMapCanvas;
  }, { once: true });
  hubMapSprites[key] = hubMapSprite;
}

function hubMapLoadAssets() {
  if (hubMapAssetsLoaded) return;
  hubMapAssetsLoaded = true;
  hubMapBgImage = hubMapCreateImage("assets/hub/forge/bg_forge_room.png");
  hubMapPropsImage = hubMapCreateImage("assets/hub/forge/objects_forge.png");
  hubMapTilesetImage = hubMapCreateImage("assets/hub/forge/bg_forge_tileset.png");
  hubMapLoadSprite("mylo", "assets/hub/sprites/player_mylo.png", 4, 4, 3);
  hubMapLoadSprite("ashley", "assets/hub/sprites/npc_ashley.png", 3, 4);
  hubMapLoadSprite("auntie", "assets/hub/sprites/npc_auntie.png", 3, 4);
  hubMapLoadSprite("eli", "assets/hub/sprites/npc_eli.png", 3, 4);
  hubMapPortraits.ashley = hubMapCreateImage("assets/hub/ui/portrait_ashley.png");
  hubMapPortraits.auntie = hubMapCreateImage("assets/hub/ui/portrait_auntie.png");
  hubMapPortraits.eli = hubMapCreateImage("assets/hub/ui/portrait_eli.png");
  hubMapPortraits.mylo = hubMapCreateImage("assets/hub/ui/portrait_mylo.png");
}

function hubMapInitTiles() {
  hubMapState.tiles = Array.from({ length: hubMapState.height }, () =>
    Array.from({ length: hubMapState.width }, () => hubMapTILE_FLOOR)
  );
  for (let y = 0; y < hubMapState.height; y += 1) {
    for (let x = 0; x < hubMapState.width; x += 1) {
      if (y === 0 || y === 15 || x === 0 || x === 23) hubMapState.tiles[y][x] = hubMapTILE_WALL;
      if (y === 1 && x > 0 && x < 23) hubMapState.tiles[y][x] = hubMapTILE_WALL;
      if ((x === 0 || x === 1 || x === 22 || x === 23) && y >= 0 && y < hubMapState.height) hubMapState.tiles[y][x] = hubMapTILE_WALL;
      if (y >= 9 && y <= 14 && x >= 2 && x <= 21) hubMapState.tiles[y][x] = hubMapTILE_HANGAR;
      if ((x === 8 || x === 13 || x === 18) && y >= 9 && y <= 14) hubMapState.tiles[y][x] = hubMapTILE_STRIPE;
      if (y === 9 && (x === 10 || x === 14 || x === 18)) hubMapState.tiles[y][x] = hubMapTILE_CONSOLE;
      if ((y === 6 || y === 7) && ((x >= 3 && x <= 7) || (x >= 16 && x <= 20))) hubMapState.tiles[y][x] = hubMapTILE_WALL;
    }
  }
  hubMapState.tiles[1][12] = hubMapTILE_DOOR;
}

function hubMapIsActive() {
  return document.querySelector("#hub-map-beta-view")?.classList.contains("active");
}

function hubMapTileCenterX(tileX) {
  return tileX * hubMapState.tileSize + hubMapState.tileSize / 2;
}

function hubMapTileCenterY(tileY) {
  return tileY * hubMapState.tileSize + hubMapState.tileSize / 2;
}

function hubMapDrawProp(ctx, propName, x, y, scale = 1) {
  const hubMapFrame = hubMapPropFrames[propName];
  if (!hubMapFrame || !hubMapPropsImage?.complete || !hubMapPropsImage.naturalWidth) return;
  const hubMapDrawW = hubMapFrame.w * scale;
  const hubMapDrawH = hubMapFrame.h * scale;
  ctx.drawImage(
    hubMapPropsImage,
    hubMapFrame.x,
    hubMapFrame.y,
    hubMapFrame.w,
    hubMapFrame.h,
    x - hubMapDrawW / 2,
    y - hubMapDrawH / 2,
    hubMapDrawW,
    hubMapDrawH
  );
}

function hubMapDrawSprite(ctx, spriteKey, tileX, tileY, direction = 0, col = 1, heightTiles = 2.6) {
  const hubMapSheet = hubMapSprites[spriteKey];
  const hubMapImage = hubMapSheet?.img || hubMapSheet?.image;
  if (!hubMapSheet || !hubMapImage?.complete || !hubMapImage.naturalWidth) {
    const hubMapFallbackColors = {
      mylo: "#7c3aed",
      ashley: "#1d4ed8",
      auntie: "#b45309",
      eli: "#15803d"
    };
    ctx.fillStyle = hubMapFallbackColors[spriteKey] || "#ffc857";
    ctx.fillRect(tileX * hubMapState.tileSize, tileY * hubMapState.tileSize - 16, 32, 48);
    return;
  }
  const hubMapFrameW = hubMapSheet.frameW || Math.floor(hubMapImage.naturalWidth / hubMapSheet.cols);
  const hubMapFrameH = hubMapSheet.frameH || Math.floor(hubMapImage.naturalHeight / hubMapSheet.rows);
  const hubMapUsableCols = hubMapSheet.usableCols || hubMapSheet.cols;
  const hubMapCol = Math.max(0, Math.min(hubMapUsableCols - 1, col));
  const hubMapRow = Math.max(0, Math.min(hubMapSheet.rows - 1, direction));
  const hubMapSourceX = hubMapCol * hubMapFrameW;
  const hubMapSourceY = hubMapRow * hubMapFrameH;
  const hubMapDestH = hubMapState.tileSize * heightTiles;
  const hubMapDestW = hubMapDestH * (hubMapFrameW / hubMapFrameH);
  const hubMapDestX = tileX * hubMapState.tileSize + hubMapState.tileSize / 2 - hubMapDestW / 2;
  const hubMapDestY = tileY * hubMapState.tileSize + hubMapState.tileSize - hubMapDestH;
  const hubMapDrawSource = hubMapSheet.canvas || hubMapImage;
  ctx.drawImage(
    hubMapDrawSource,
    hubMapSourceX,
    hubMapSourceY,
    hubMapFrameW,
    hubMapFrameH,
    hubMapDestX,
    hubMapDestY,
    hubMapDestW,
    hubMapDestH
  );
}

function hubMapWrapText(text, maxChars) {
  const hubMapWords = String(text || "").split(/\s+/);
  const hubMapLines = [];
  let hubMapLine = "";
  hubMapWords.forEach((hubMapWord) => {
    const hubMapTest = hubMapLine ? `${hubMapLine} ${hubMapWord}` : hubMapWord;
    if (hubMapTest.length > maxChars && hubMapLine) {
      hubMapLines.push(hubMapLine);
      hubMapLine = hubMapWord;
    } else {
      hubMapLine = hubMapTest;
    }
  });
  if (hubMapLine) hubMapLines.push(hubMapLine);
  return hubMapLines;
}

function hubMapOpenDialogue(hubMapSpeakerName, hubMapDialogueId, hubMapPortraitKey) {
  hubMapDialogue.active = true;
  hubMapDialogue.speakerName = hubMapSpeakerName;
  hubMapDialogue.portraitKey = hubMapPortraitKey || "";
  hubMapDialogue.lines = hubMapDialogueDB[hubMapDialogueId] || ["..."];
  hubMapDialogue.page = 0;
  hubMapMovementLocked = true;
}

function hubMapAdvanceDialogue() {
  if (!hubMapDialogue.active) return;
  hubMapDialogue.page += 1;
  if (hubMapDialogue.page >= hubMapDialogue.lines.length) hubMapCloseDialogue();
}

function hubMapCloseDialogue() {
  hubMapDialogue.active = false;
  hubMapMovementLocked = false;
}

function hubMapDrawDialogue(ctx, canvasW, canvasH) {
  if (!hubMapDialogue.active) return;
  const hubMapBoxH = 110;
  const hubMapBoxY = canvasH - hubMapBoxH;
  const hubMapPortrait = hubMapPortraits[hubMapDialogue.portraitKey];
  const hubMapHasPortrait = Boolean(hubMapPortrait?.complete && hubMapPortrait.naturalWidth);
  ctx.save();
  ctx.fillStyle = "rgba(15, 10, 5, 0.92)";
  ctx.strokeStyle = "#c87820";
  ctx.lineWidth = 2;
  ctx.fillRect(0, hubMapBoxY, canvasW, hubMapBoxH);
  ctx.strokeRect(1, hubMapBoxY + 1, canvasW - 2, hubMapBoxH - 2);
  if (hubMapHasPortrait) {
    ctx.drawImage(hubMapPortrait, 12, hubMapBoxY + 15, 80, 80);
  }
  const hubMapTextX = 100;
  ctx.fillStyle = "#f0a500";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(hubMapDialogue.speakerName || "", hubMapTextX, hubMapBoxY + 22);
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px sans-serif";
  hubMapWrapText(hubMapDialogue.lines[hubMapDialogue.page] || "", 52).slice(0, 4).forEach((hubMapLine, hubMapIndex) => {
    ctx.fillText(hubMapLine, hubMapTextX, hubMapBoxY + 42 + hubMapIndex * 15);
  });
  ctx.globalAlpha = 0.65 + Math.sin(performance.now() / 300) * 0.35;
  ctx.fillStyle = "#c87820";
  ctx.font = "16px sans-serif";
  ctx.fillText("▶", canvasW - 24, canvasH - 16);
  ctx.restore();
}

function hubMapGetNPCAt(hubMapX, hubMapY) {
  return hubMapNPCs.find((hubMapNpc) => hubMapNpc.x === hubMapX && hubMapNpc.y === hubMapY) || null;
}

function hubMapGetInteractableAt(hubMapX, hubMapY) {
  const hubMapTileTarget = hubMapInteractTiles.find((hubMapTile) => hubMapTile.x === hubMapX && hubMapTile.y === hubMapY);
  if (hubMapTileTarget) return hubMapTileTarget;
  return hubMapGetNPCAt(hubMapX, hubMapY);
}

function hubMapFacingTile() {
  if (hubMapPlayer.direction === 0) return { x: hubMapState.playerX, y: hubMapState.playerY + 1 };
  if (hubMapPlayer.direction === 1) return { x: hubMapState.playerX - 1, y: hubMapState.playerY };
  if (hubMapPlayer.direction === 2) return { x: hubMapState.playerX + 1, y: hubMapState.playerY };
  return { x: hubMapState.playerX, y: hubMapState.playerY - 1 };
}

function hubMapTryInteract() {
  const hubMapFacing = hubMapFacingTile();
  const hubMapFacingTarget = hubMapGetInteractableAt(hubMapFacing.x, hubMapFacing.y);
  if (hubMapFacingTarget) {
    hubMapOnInteract(hubMapFacingTarget);
    return;
  }
  const hubMapCurrentTarget = hubMapGetInteractableAt(hubMapState.playerX, hubMapState.playerY);
  if (hubMapCurrentTarget) hubMapOnInteract(hubMapCurrentTarget);
}

function hubMapOnInteract(hubMapTarget) {
  if (hubMapTarget.type === "car_bay") {
    document.dispatchEvent(new CustomEvent("hubmap:carbay", { detail: { carId: hubMapTarget.carId } }));
    console.log("hubmap:carbay", { carId: hubMapTarget.carId });
    return;
  }
  if (hubMapTarget.type === "door") {
    document.dispatchEvent(new CustomEvent("hubmap:door", { detail: { id: hubMapTarget.id } }));
    hubMapClose();
    return;
  }
  if (hubMapTarget.id) hubMapOpenDialogue(hubMapTarget.name, `${hubMapTarget.id}_default`, hubMapTarget.portraitKey);
}

function hubMapDraw() {
  if (!el.hubMapBetaCanvas || !hubMapIsActive()) return;
  const canvas = el.hubMapBetaCanvas;
  const ctx = canvas.getContext("2d");
  const { tileSize, width, height } = hubMapState;
  const now = performance.now();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (hubMapBgImage?.complete && hubMapBgImage.naturalWidth) {
    ctx.drawImage(hubMapBgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#1a2540";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (hubMapState.tiles[y]?.[x] === 1) {
        ctx.fillStyle = "rgba(12, 16, 24, 0.32)";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
  hubMapInteractTiles.forEach((hubMapTile) => {
    const hubMapNear = Math.abs(hubMapTile.x - hubMapState.playerX) <= 2 && Math.abs(hubMapTile.y - hubMapState.playerY) <= 2;
    if (!hubMapNear) return;
    ctx.strokeStyle = `rgba(200, 120, 32, ${0.4 + Math.sin(now / 400) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(hubMapTile.x * tileSize + 2, hubMapTile.y * tileSize + 2, tileSize - 4, tileSize - 4);
  });
  hubMapDrawProp(ctx, "vat", hubMapTileCenterX(12), hubMapTileCenterY(4), 0.5);

  let drawX = hubMapState.playerX;
  let drawY = hubMapState.playerY;
  if (hubMapState.moveTween) {
    const progress = Math.min(1, (performance.now() - hubMapState.moveTween.startTime) / 200);
    const eased = 1 - Math.pow(1 - progress, 3);
    drawX = hubMapState.moveTween.fromX + (hubMapState.moveTween.toX - hubMapState.moveTween.fromX) * eased;
    drawY = hubMapState.moveTween.fromY + (hubMapState.moveTween.toY - hubMapState.moveTween.fromY) * eased;
    if (progress >= 1) {
      hubMapState.moveTween = null;
      hubMapPlayer.moving = false;
    }
  }
  if (!hubMapState.moveTween && !hubMapMovementLocked && now >= hubMapMoveCooldown) {
    if (hubMapHeldKeys.up) hubMapTryMove(0, -1);
    else if (hubMapHeldKeys.down) hubMapTryMove(0, 1);
    else if (hubMapHeldKeys.left) hubMapTryMove(-1, 0);
    else if (hubMapHeldKeys.right) hubMapTryMove(1, 0);
    if (hubMapHeldKeys.up || hubMapHeldKeys.down || hubMapHeldKeys.left || hubMapHeldKeys.right) hubMapMoveCooldown = now + 80;
  }
  hubMapNPCs.forEach((hubMapNpc) => {
    hubMapDrawSprite(ctx, hubMapNpc.spriteKey, hubMapNpc.x, hubMapNpc.y, hubMapNpc.direction, 1);
    if (hubMapShowLabels) {
      const hubMapLabelX = hubMapNpc.x * tileSize + tileSize / 2;
      const hubMapLabelY = hubMapNpc.y * tileSize - 4;
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillText(hubMapNpc.name, hubMapLabelX + 1, hubMapLabelY + 1);
      ctx.fillStyle = "rgba(255, 220, 120, 0.9)";
      ctx.fillText(hubMapNpc.name, hubMapLabelX, hubMapLabelY);
      ctx.textAlign = "start";
    }
  });
  if (hubMapPlayer.moving && now - hubMapAnimClock > hubMapAnimInterval) {
    hubMapAnimClock = now;
    hubMapPlayer.animCol = (hubMapPlayer.animCol + 1) % 3;
  }
  if (!hubMapPlayer.moving) hubMapPlayer.animCol = 1;
  hubMapDrawSprite(ctx, "mylo", drawX, drawY, hubMapPlayer.direction, hubMapPlayer.animCol);
  hubMapDrawDialogue(ctx, canvas.width, canvas.height);
  if (el.hubMapBetaCoords) el.hubMapBetaCoords.textContent = `${hubMapState.playerX}, ${hubMapState.playerY}`;
  hubMapState.animFrame = requestAnimationFrame(hubMapDraw);
}

function hubMapOpen() {
  hubMapInitTiles();
  hubMapLoadAssets();
  hubMapState.playerX = 12;
  hubMapState.playerY = 6;
  hubMapState.playerDirection = 0;
  hubMapPlayer.direction = 0;
  hubMapPlayer.moving = false;
  hubMapPlayer.animCol = 1;
  Object.keys(hubMapHeldKeys).forEach((hubMapKey) => {
    hubMapHeldKeys[hubMapKey] = false;
  });
  hubMapMoveCooldown = 0;
  hubMapMovementLocked = false;
  hubMapCloseDialogue();
  hubMapState.moveTween = null;
  hubMapState.dialogue = null;
  if (hubMapState.animFrame) cancelAnimationFrame(hubMapState.animFrame);
  showView("hub-map-beta");
  hubMapDraw();
}

function hubMapClose() {
  if (hubMapState.animFrame) cancelAnimationFrame(hubMapState.animFrame);
  hubMapState.animFrame = 0;
  betaRaceContext = { source: "prototype" };
  showView("beta");
  openBetaPrototypeIntro();
}

function hubMapTryMove(dx, dy) {
  if (hubMapMovementLocked || !hubMapIsActive() || hubMapState.moveTween) return;
  if (dy > 0) hubMapPlayer.direction = 0;
  else if (dx < 0) hubMapPlayer.direction = 1;
  else if (dx > 0) hubMapPlayer.direction = 2;
  else if (dy < 0) hubMapPlayer.direction = 3;
  hubMapState.playerDirection = hubMapPlayer.direction;
  const nextX = hubMapState.playerX + dx;
  const nextY = hubMapState.playerY + dy;
  if (nextX < 0 || nextY < 0 || nextX >= hubMapState.width || nextY >= hubMapState.height) return;
  const hubMapTileType = hubMapState.tiles[nextY]?.[nextX];
  if (!hubMapTileWalkable[hubMapTileType]) return;
  hubMapPlayer.moving = true;
  hubMapState.moveTween = {
    fromX: hubMapState.playerX,
    fromY: hubMapState.playerY,
    toX: nextX,
    toY: nextY,
    startTime: performance.now()
  };
  hubMapState.playerX = nextX;
  hubMapState.playerY = nextY;
  // TODO: optional auto-repeat / hold-to-walk.
}

el.hubMapBetaStart?.addEventListener("click", hubMapOpen);
el.hubMapBetaBack?.addEventListener("click", hubMapClose);

document.addEventListener("keydown", (event) => {
  if (!hubMapIsActive()) return;
  const key = normalizeKey(event);
  if (key === "E" || key === "Enter") {
    if (event.repeat) return;
    event.preventDefault();
    if (hubMapMovementLocked && hubMapDialogue.active) hubMapAdvanceDialogue();
    else if (!hubMapMovementLocked) hubMapTryInteract();
    return;
  }
  const moves = {
    W: "up",
    ArrowUp: "up",
    S: "down",
    ArrowDown: "down",
    A: "left",
    ArrowLeft: "left",
    D: "right",
    ArrowRight: "right"
  };
  if (!moves[key]) return;
  event.preventDefault();
  hubMapHeldKeys[moves[key]] = true;
});

document.addEventListener("keyup", (event) => {
  if (!hubMapIsActive()) return;
  const key = normalizeKey(event);
  const moves = {
    W: "up",
    ArrowUp: "up",
    S: "down",
    ArrowDown: "down",
    A: "left",
    ArrowLeft: "left",
    D: "right",
    ArrowRight: "right"
  };
  if (!moves[key]) return;
  event.preventDefault();
  hubMapHeldKeys[moves[key]] = false;
});

// TODO: NPCs, sprites, map transitions, interactions, and dialogue hooks.

// ─── FORGE EVENT LISTENERS ───────────────────────────────────────────────────
