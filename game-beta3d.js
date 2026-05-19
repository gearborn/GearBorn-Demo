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
const beta3dSegmentLength = 70;
let beta3dState = null;

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
  beta3dApplyObjectHits();
  drawBeta3dFrame();
  if (beta3dState.z >= beta3dTrackLength) {
    finishBeta3dRun();
    return;
  }
  beta3dState.raf = requestAnimationFrame(updateBeta3dFrame);
}

function beta3dProjection(zOffset, w, h) {
  const near = Math.max(0.001, zOffset / beta3dDrawDistance);
  const eased = Math.pow(near, 0.62);
  const horizon = h * 0.34;
  const y = horizon + (1 - eased) * (h - horizon + 80);
  const roadW = w * (0.1 + (1 - near) * 0.78);
  return { y, roadW, scale: 1 - near };
}

function beta3dCurveOffset(worldZ, w) {
  let offset = 0;
  for (let i = 0; i < 28; i += 1) offset += beta3dCurveAt(worldZ + i * beta3dSegmentLength) * (28 - i);
  return offset * w * 0.0018;
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
  if (sky?.complete && sky.naturalWidth) {
    ctx.drawImage(sky, 0, 0, w, h * 0.48);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, h * 0.52);
    gradient.addColorStop(0, "#2f68bb");
    gradient.addColorStop(1, "#ffc78a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h * 0.5);
  }
  ctx.fillStyle = "#315b2a";
  ctx.fillRect(0, h * 0.34, w, h);
}

function drawBeta3dRoad(ctx, w, h) {
  const roadPattern = beta3dAssets.road.complete && beta3dAssets.road.naturalWidth ? ctx.createPattern(beta3dAssets.road, "repeat") : null;
  const shoulderPattern = beta3dAssets.shoulder.complete && beta3dAssets.shoulder.naturalWidth ? ctx.createPattern(beta3dAssets.shoulder, "repeat") : null;
  for (let z = beta3dDrawDistance; z > 0; z -= beta3dSegmentLength) {
    const p1 = beta3dProjection(z, w, h);
    const p2 = beta3dProjection(Math.max(1, z - beta3dSegmentLength), w, h);
    const worldZ1 = beta3dState.z + z;
    const worldZ2 = beta3dState.z + z - beta3dSegmentLength;
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
  const visible = beta3dObjects
    .map((object, index) => ({ ...object, index, dz: object.z - beta3dState.z }))
    .filter((object) => object.dz > 0 && object.dz < beta3dDrawDistance)
    .sort((a, b) => b.dz - a.dz);
  visible.forEach((object) => {
    const p = beta3dProjection(object.dz, w, h);
    const worldZ = beta3dState.z + object.dz;
    const center = w / 2 + beta3dCurveOffset(worldZ, w) - beta3dState.x * p.roadW * 0.42;
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

// ─── FORGE EVENT LISTENERS ───────────────────────────────────────────────────
