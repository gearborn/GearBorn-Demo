// ─── GAME LOGIC ─────────────────────────────────────────────────────────────

const soundLibrary = {
  // TODO audio assets: add these files when final SFX are approved.
  "ui-click": "assets/audio/ui-click.mp3",
  "ui-hover": "assets/audio/ui-hover.mp3",
  "ui-back": "assets/audio/ui-back.mp3",
  "engine-loop": "assets/audio/engine-loop.mp3",
  "engine-shift": "assets/audio/engine-shift.mp3",
  "engine-nitro": "assets/audio/engine-nitro.mp3",
  "engine-launch": "assets/audio/engine-launch.mp3",
  "race-countdown-beep": "assets/audio/countdown-beep.mp3",
  "race-countdown-go": "assets/audio/countdown-go.mp3",
  "battle-hit": "assets/audio/battle-hit.mp3",
  "battle-special": "assets/audio/battle-special.mp3",
  "battle-dodge": "assets/audio/battle-dodge.mp3",
  "battle-stun": "assets/audio/battle-stun.mp3",
  "win-jingle": "assets/audio/win-jingle.mp3",
  "lose-jingle": "assets/audio/lose-jingle.mp3",
  "bond-up": "assets/audio/bond-up.mp3",
  "evolve-cue": "assets/audio/evolve-cue.mp3",
  "rank-up": "assets/audio/rank-up.mp3"
};

const musicLibrary = {
  // TODO music assets: these paths fail silently until files exist.
  "menu-theme": "assets/audio/music-menu.mp3",
  "race-theme": "assets/audio/music-race.mp3",
  "battle-theme": "assets/audio/music-battle.mp3",
  "garage-theme": "assets/audio/music-garage.mp3",
  "boss-theme": "assets/audio/music-boss.mp3"
};

let currentMusic = null;
let currentMusicKey = null;
let currentMusicFade = null;

function audioMasterVolume(scale = 1) {
  return Math.max(0, Math.min(1, ((state?.settings?.volume ?? 45) / 100) * scale));
}

function playSound(key, options = {}) {
  const src = soundLibrary[key] || options.src;
  if (!src || typeof Audio === "undefined") return null;
  try {
    const audio = new Audio(src);
    audio.loop = Boolean(options.loop);
    audio.volume = audioMasterVolume(options.volume ?? 1);
    audio.onerror = () => {};
    audio.play().catch(() => {});
    return audio;
  } catch (error) {
    return null;
  }
}

function updateAudioVolumes() {
  if (currentMusic) currentMusic.volume = audioMasterVolume(0.48);
}

function playMusic(key, options = {}) {
  if (currentMusicFade) window.clearInterval(currentMusicFade);
  if (!key) {
    if (currentMusic) {
      try {
        currentMusic.pause();
        currentMusic.currentTime = 0;
      } catch (error) {}
    }
    currentMusic = null;
    currentMusicKey = null;
    return;
  }
  if (currentMusicKey === key && currentMusic && !currentMusic.paused) {
    updateAudioVolumes();
    return;
  }
  const src = musicLibrary[key];
  if (!src || typeof Audio === "undefined") return;
  const previous = currentMusic;
  let next;
  try {
    next = new Audio(src);
    next.loop = true;
    next.volume = 0;
    next.onerror = () => {
      if (currentMusic === next) {
        currentMusic = null;
        currentMusicKey = null;
      }
    };
    next.play().catch(() => {});
  } catch (error) {
    return;
  }
  currentMusic = next;
  currentMusicKey = key;
  const targetVolume = audioMasterVolume(options.volume ?? 0.48);
  const start = performance.now();
  currentMusicFade = window.setInterval(() => {
    const progress = Math.min(1, (performance.now() - start) / 200);
    if (next) next.volume = targetVolume * progress;
    if (previous) previous.volume = Math.max(0, previous.volume * (1 - progress));
    if (progress >= 1) {
      window.clearInterval(currentMusicFade);
      currentMusicFade = null;
      if (previous) {
        try {
          previous.pause();
          previous.currentTime = 0;
        } catch (error) {}
      }
      updateAudioVolumes();
    }
  }, 24);
}

function xpForNextLevel(level) {
  if (level >= maxCarLevel) return 0;
  return Math.floor(95 * Math.pow(level, 1.48));
}

function formatSprox(amount = state.sprox) {
  return state.unlimitedSprox ? "∞ Sprox" : `${Math.max(0, Math.floor(amount))} Sprox`;
}

function sproxAmountMarkup(amount = state.sprox) {
  return `<span class="sprox-inline"><span>${formatSprox(amount)}</span><span class="sprox-coin" aria-hidden="true"></span></span>`;
}

function sproxResultMarkup(amount = 0) {
  const value = Math.max(0, Math.floor(Number(amount) || 0));
  return `<span class="sprox-inline"><span class="count-up-number" data-count-target="${value}">0</span><span class="sprox-coin" aria-hidden="true"></span></span>`;
}

function addSprox(amount) {
  if (!state.unlimitedSprox) {
    state.sprox = Math.max(0, Math.floor((state.sprox || 0) + amount));
  }
  return Math.max(0, Math.floor(amount));
}

function rollStoryPartReward() {
  const roll = Math.random();
  const level = roll < 0.05 ? 2 : roll < 0.25 ? 1 : 0;
  if (!level) return null;
  const type = partTypes[Math.floor(Math.random() * partTypes.length)];
  const part = partVariants.find((item) => item.id === type.id && item.level === level);
  if (!part) return null;
  state.partsInventory[part.key] = (state.partsInventory[part.key] || 0) + 1;
  return part;
}

function partRewardResultMarkup(part) {
  if (!part) return "";
  return `
    <span class="part-reward-line">You earned Level ${part.level} ${part.name}</span>
    <span class="part-reward-visual">
      ${partImageMarkup(part, "part-reward-image")}
      <span class="part-stars">${partStars(part)}</span>
      <strong>+${part.bonus} ${part.label}</strong>
    </span>
  `;
}

function canAffordUpgrade(cost) {
  return state.unlimitedSprox || state.sprox >= cost;
}

function spendSprox(cost) {
  if (state.unlimitedSprox) return true;
  if (state.sprox < cost) return false;
  state.sprox -= cost;
  return true;
}

function evolutionIndexForLevel(level) {
  if (level >= 10) return 2;
  if (level >= 5) return 1;
  return 0;
}

function maxEligibleEvolutionForCar(carId, level) {
  const car = cars.find((item) => item.id === carId);
  if (carId === "art-van") return 0;
  if (carId === "rainbowlt") {
    return level >= 10 ? 1 : 0;
  }
  return Math.min(evolutionIndexForLevel(level), car.evolutions.length - 1);
}

function isCarUnlocked(carId) {
  const car = cars.find((item) => item.id === carId);
  if (tutorialActive() && [tutorialCarId, tutorialOpponentCarId].includes(carId)) return true;
  return Boolean(car && state.unlockedLines?.includes(carId));
}

function orderedCarList(list) {
  return [...list].sort((a, b) => {
    const aIndex = garageLineOrder.indexOf(a.id);
    const bIndex = garageLineOrder.indexOf(b.id);
    return (aIndex >= 0 ? aIndex : 999) - (bIndex >= 0 ? bIndex : 999);
  });
}

function allPlayableFinalFormsUnlocked() {
  const ids = cars.filter((car) => !car.tutorialOnly && car.id !== "rainbowlt").map((car) => car.id);
  return ids.every((carId) => {
    const car = cars.find((item) => item.id === carId);
    const progress = state.garage?.[carId];
    if (!isCarUnlocked(carId) || !progress) return false;
    if (carId === "art-van") return (state.unlockedArtVanForms || []).some((index) => index > 0);
    return unlockedEvolutionIndex(carId) >= car.evolutions.length - 1;
  });
}

function garageGodModeActive() {
  const rainbowlt = state.garage?.rainbowlt;
  return Boolean(
    state.unlockedCars?.rainbowlt &&
    rainbowlt?.level >= maxCarLevel &&
    rainbowlt?.evolution >= cars.find((car) => car.id === "rainbowlt").evolutions.length - 1
  );
}

function unlockSecretCars() {
  state.unlockedCars = state.unlockedCars || {};
  state.unlockedLines = state.unlockedLines || [...defaultUnlockedLines];
  if (!state.unlockedLines.includes("rainbowlt") && allPlayableFinalFormsUnlocked()) {
    state.unlockedLines.push("rainbowlt");
    state.unlockedCars.rainbowlt = true;
    state.garage.rainbowlt = state.garage.rainbowlt || { level: 1, xp: 0, evolution: 0, pendingEvolution: null };
    return "rainbowlt";
  }
  return null;
}

function currentEvolution(carId) {
  const car = cars.find((item) => item.id === carId);
  const progress = state.garage[carId];
  if (carId === "art-van" && !(state.unlockedArtVanForms || []).includes(progress.evolution)) {
    progress.evolution = (state.unlockedArtVanForms || [0])[0] || 0;
  }
  return car.evolutions[progress.evolution] || car.evolutions[0];
}

function unlockedEvolutionIndex(carId) {
  const car = cars.find((item) => item.id === carId);
  const progress = state.garage[carId];
  if (carId === "art-van") return Math.max(...(state.unlockedArtVanForms || [0]));
  return Math.min(progress.unlockedEvolution ?? progress.evolution ?? 0, car.evolutions.length - 1);
}

function evolutionByIndex(carId, evolutionIndex) {
  const car = cars.find((item) => item.id === carId);
  return car.evolutions[evolutionIndex] || car.evolutions[0];
}

let honkAudioContext = null;
let honkVisualTimer = null;
// Per-GearBorn honk overrides. Missing files fall back to the procedural honk.
// TODO: Fill in starters, Tutorque, bosses, and other forms once approved honks exist.
const honkSoundOverrides = {
  honky: "assets/audio/honks/honk-honky-angry.m4a",
  whiffleton: "assets/audio/honks/honk-whiffleton-angry.m4a",
  dookingham: "assets/audio/honks/honk-dookingham-angry.m4a",
  pootin: "assets/audio/honks/honk-pootin-angry.m4a"
};

function hashHonkSignature(value) {
  return [...String(value || "GearBorn")].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function honkSignatureFor(carId, evolutionIndex = state.garage?.[carId]?.evolution || 0) {
  const form = evolutionByIndex(carId, evolutionIndex) || currentEvolution(carId);
  const hash = hashHonkSignature(`${carId}:${form?.name || evolutionIndex}`);
  return {
    frequency: 240 + (hash % 180),
    secondFrequency: 330 + (hash % 260),
    duration: 0.18 + (hash % 5) * 0.012
  };
}

function flashHonkControls() {
  document.querySelectorAll(".touch-controls").forEach((group) => group.classList.add("honking"));
  window.clearTimeout(honkVisualTimer);
  honkVisualTimer = window.setTimeout(() => {
    document.querySelectorAll(".touch-controls").forEach((group) => group.classList.remove("honking"));
  }, 220);
}

function playHonkSound(signatureSource) {
  honkAudioContext = honkAudioContext || new (window.AudioContext || window.webkitAudioContext)();
  const ctx = honkAudioContext;
  if (ctx.state === "suspended") ctx.resume();
  const hash = hashHonkSignature(signatureSource);
  const signature = {
    frequency: 240 + (hash % 180),
    secondFrequency: 330 + (hash % 260),
    duration: 0.18 + (hash % 5) * 0.012
  };
  const start = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.16 * audioMasterVolume(1), start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + signature.duration);
  gain.connect(ctx.destination);
  [signature.frequency, signature.secondFrequency].forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    osc.type = index ? "triangle" : "square";
    osc.frequency.setValueAtTime(frequency, start);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.94, start + signature.duration);
    osc.connect(gain);
    osc.start(start);
    osc.stop(start + signature.duration + 0.03);
  });
  flashHonkControls();
}

function playHonkAudioFile(src) {
  if (!src) return false;
  try {
    const audio = new Audio(src);
    audio.volume = audioMasterVolume(0.78);
    audio.currentTime = 0;
    audio.onerror = () => {};
    audio.play().catch(() => playHonkSound(src));
    flashHonkControls();
    return true;
  } catch {
    return false;
  }
}

function playGearbornHonk(carId, evolutionIndex = state.garage?.[carId]?.evolution || 0) {
  if (!cars.some((car) => car.id === carId)) return;
  const form = evolutionByIndex(carId, evolutionIndex) || currentEvolution(carId);
  const override = honkSoundOverrides[slugify(form?.name || "")];
  if (override && playHonkAudioFile(override)) return;
  playHonkSound(`${carId}:${form?.name || evolutionIndex}`);
}

function honkCurrentRaceCar() {
  if (verticalRace?.active || verticalRace?.countdownStarted) {
    playGearbornHonk(verticalRace.carId);
    return true;
  }
  if (betaState && document.querySelector("#beta-view")?.classList.contains("active") && !el.betaRace?.hidden) {
    playGearbornHonk(betaCurrentCarId());
    return true;
  }
  if (document.querySelector("#beta-view")?.classList.contains("active") && !el.beta3dRace?.hidden) {
    playGearbornHonk(selectedCarIdForMode("beta"));
    return true;
  }
  return false;
}

function getHonkSubtitle(lineRoot, emotion, bondLevel) {
  return "[HONK SUBTITLE PLACEHOLDER]";
}

function honkKeyForCar(carId, evolutionIndex = state.garage?.[carId]?.evolution || 0) {
  const form = cars.some((car) => car.id === carId) ? evolutionByIndex(carId, evolutionIndex) || currentEvolution(carId) : null;
  return slugify(form?.name || carId || "gearborn");
}

function openHonkModalForKey(honkKey, bondLineRoot = selectedCarIdForMode("drag")) {
  if (!el.honkModal || !el.honkOptions) {
    playHonkEmotion(honkKey, "angry");
    return;
  }
  const bondLevel = bondLevelForLine(bondLineRoot);
  const emotions = [
    { id: "happy", label: "Happy" },
    { id: "angry", label: "Angry" }
  ];
  el.honkOptions.innerHTML = emotions.map((emotion) => `
    <button class="honk-emotion-button" type="button" data-honk-emotion="${emotion.id}" data-honk-line="${honkKey}" data-honk-bond-line="${bondLineRoot}">
      ${emotion.label}
    </button>
  `).join("");
  if (el.honkSubtitle) el.honkSubtitle.textContent = getHonkSubtitle(bondLineRoot, "happy", bondLevel);
  el.honkModal.classList.add("active");
  el.honkModal.setAttribute("aria-hidden", "false");
}

function openHonkModal(carId = selectedCarIdForMode("drag"), evolutionIndex = state.garage?.[carId]?.evolution || 0) {
  if (!cars.some((car) => car.id === carId)) {
    openHonkModalForKey(slugify(carId || "gearborn"), selectedCarIdForMode("drag"));
    return;
  }
  openHonkModalForKey(honkKeyForCar(carId, evolutionIndex), evolutionLineRootForCar(carId));
}

function closeHonkModal() {
  if (!el.honkModal) return;
  el.honkModal.classList.remove("active");
  el.honkModal.setAttribute("aria-hidden", "true");
}

function playHonkEmotion(honkKey, emotion, bondLineRoot = honkKey) {
  const bondLevel = bondLevelForLine(bondLineRoot);
  if (el.honkSubtitle) el.honkSubtitle.textContent = getHonkSubtitle(bondLineRoot, emotion, bondLevel);
  if (emotion === "angry" && honkSoundOverrides[honkKey] && playHonkAudioFile(honkSoundOverrides[honkKey])) {
    window.setTimeout(closeHonkModal, 240);
    return;
  }
  playHonkSound(`${honkKey}:${emotion}`);
  window.setTimeout(closeHonkModal, 240);
}

function carStats(carId) {
  const progress = state.garage[carId];
  const stats = displayedGearbornStats(carId);
  const avgRating = (stats.speed + stats.acceleration + stats.handling + stats.torque + stats.body + stats.powertrain) / 6;
  const torqueNorm = normalizedGearbornStat(stats.torque);
  return {
    ratings: stats,
    playstyle: gearbornStatProfiles[carId]?.playstyle || "",
    torqueNorm,
    power: 0.92 + (avgRating - 76) * 0.008 + (progress.level - 1) * 0.03,
    maxSpeed: 48 + stats.speed * 1.1 + progress.level * 3.1,
    acceleration: 12 + stats.acceleration * 0.2 + progress.level * 0.45,
    handling: 56 + (stats.handling - 76) * 0.45,
    boostEffectiveness: 0.88 + torqueNorm * 0.3,
    obstacleResistance: 1.12 - torqueNorm * 0.3,
    shiftWindow: 0.12 + torqueNorm * 0.08
  };
}

function displayedGearbornStats(carId) {
  return displayedGearbornStatsAtLevel(carId, state.garage[carId]?.level || 1);
}

function displayedGearbornStatsAtLevel(carId, level) {
  const baseStats = baseGearbornStatsAtLevel(carId, level);
  const boosts = bondBoostsForCar(carId, baseStats);
  const partBoosts = partBoostsForCar(carId);
  const formBoosts = formBoostsForCar(carId);
  return Object.fromEntries(Object.entries(baseStats).map(([key, value]) => [
    key,
    Math.min(100, value + (boosts[key] || 0) + (partBoosts[key] || 0) + (formBoosts[key] || 0))
  ]));
}

function baseGearbornStatsAtLevel(carId, level) {
  const profile = gearbornStatProfiles[carId] || gearbornStatProfiles.bee;
  if (carId === "rainbowlt" && level >= maxCarLevel && (state.garage?.rainbowlt?.evolution || 0) >= 1) {
    return {
      speed: 100,
      acceleration: 100,
      handling: 100,
      torque: 100,
      body: 100,
      powertrain: 100
    };
  }
  const evolutionGain = carId === "art-van" ? 0 : Math.max(0, state.garage?.[carId]?.evolution || 0) * 2;
  const levelGain = Math.max(0, Math.max(1, level) - 1);
  return {
    speed: Math.min(100, profile.speed + levelGain + evolutionGain),
    acceleration: Math.min(100, profile.acceleration + levelGain + evolutionGain),
    handling: Math.min(100, profile.handling + levelGain + evolutionGain),
    torque: Math.min(100, (profile.torque ?? 74) + levelGain + evolutionGain),
    body: Math.min(100, (profile.body ?? 72) + levelGain + evolutionGain),
    powertrain: Math.min(100, (profile.powertrain ?? 78) + levelGain + evolutionGain)
  };
}

const statLabels = {
  speed: "SPD",
  acceleration: "ACC",
  handling: "HDL",
  torque: "TRQ",
  body: "BDY",
  powertrain: "PWR"
};
const bondMilestones = [
  { count: 5, boosts: { acceleration: 2, handling: 2 } },
  { count: 10, boosts: { speed: 3, torque: 3 } }
];

function strongestBondStat(baseStats) {
  const order = ["speed", "acceleration", "handling", "torque", "powertrain"];
  return order.reduce((best, key) => (baseStats[key] > baseStats[best] ? key : best), order[0]);
}

function bondMilestoneBoost(count, baseStats) {
  if (count === 20) {
    return {
      [strongestBondStat(baseStats)]: 5,
      body: 3
    };
  }
  return bondMilestones.find((milestone) => milestone.count === count)?.boosts || {};
}

function bondBoostsForCar(carId, baseStats = baseGearbornStatsAtLevel(carId, state.garage[carId]?.level || 1)) {
  const bond = state.bond?.[carId];
  const boosts = { speed: 0, acceleration: 0, handling: 0, torque: 0, body: 0, powertrain: 0 };
  (bond?.milestones || []).forEach((count) => {
    const milestoneBoost = bondMilestoneBoost(Number(count), baseStats);
    Object.entries(milestoneBoost).forEach(([key, value]) => {
      boosts[key] = (boosts[key] || 0) + value;
    });
  });
  return boosts;
}

function partByKey(key) {
  return partVariants.find((part) => part.key === key) || null;
}

function partBoostsForCar(carId) {
  const boosts = { speed: 0, acceleration: 0, handling: 0, torque: 0, body: 0, powertrain: 0 };
  (state.equippedParts?.[carId] || []).forEach((key) => {
    const part = partByKey(key);
    if (part) boosts[part.attr] = (boosts[part.attr] || 0) + part.bonus;
  });
  return boosts;
}

function formBoostsForCar(carId) {
  const boosts = { speed: 0, acceleration: 0, handling: 0, torque: 0, body: 0, powertrain: 0 };
  if (carId !== "art-van") return boosts;
  const bonus = currentEvolution(carId)?.formBonus || {};
  Object.entries(bonus).forEach(([key, value]) => {
    boosts[key] = value;
  });
  return boosts;
}

function equippedPartUsage(key, ignoreCarId = "", ignoreSlot = -1) {
  return Object.entries(state.equippedParts || {}).reduce((total, [carId, slots]) => total + (slots || []).filter((slotKey, slotIndex) => {
    if (carId === ignoreCarId && slotIndex === ignoreSlot) return false;
    return slotKey === key;
  }).length, 0);
}

function availablePartCount(key, ignoreCarId = "", ignoreSlot = -1) {
  return Math.max(0, (state.partsInventory?.[key] || 0) - equippedPartUsage(key, ignoreCarId, ignoreSlot));
}

function partStars(part) {
  return part?.stars || "";
}

function formatBondBoosts(boosts) {
  return Object.entries(boosts)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `+${value} ${statLabels[key] || key.toUpperCase()}`)
    .join(", ");
}

function nextBondMilestone(carId) {
  const claimed = state.bond?.[carId]?.milestones || [];
  return [5, 10, 20].find((count) => !claimed.includes(count)) || null;
}

function recordRaceUsage(carId) {
  if (!carId || !cars.some((car) => car.id === carId)) return [];
  recordCarUsage(carId);
  state.bond = state.bond || {};
  const bond = state.bond[carId] || { races: 0, milestones: [] };
  bond.races = Math.max(0, Math.floor(Number(bond.races) || 0)) + 1;
  bond.milestones = Array.isArray(bond.milestones) ? bond.milestones.map(Number) : [];
  const baseStats = baseGearbornStatsAtLevel(carId, state.garage[carId]?.level || 1);
  const unlocked = [];
  [5, 10, 20].forEach((count) => {
    if (bond.races >= count && !bond.milestones.includes(count)) {
      bond.milestones.push(count);
      const boosts = bondMilestoneBoost(count, baseStats);
      unlocked.push({ count, boosts });
    }
  });
  state.bond[carId] = bond;
  if (unlocked.length) {
    playSound("bond-up");
    const form = currentEvolution(carId);
    unlocked.forEach((milestone) => {
      showToast("Bond Boost Unlocked!", `${form.name} gained ${formatBondBoosts(milestone.boosts)}!`);
    });
  }
  checkBondMilestones(carId);
  return unlocked;
}

function recordCarUsage(carId) {
  if (!carId || !cars.some((car) => car.id === carId)) return;
  state.recentCarUses = Array.isArray(state.recentCarUses) ? state.recentCarUses : [];
  state.recentCarUses = [{ carId, timestamp: Date.now() }]
    .concat(state.recentCarUses.filter((use) => use?.carId !== carId))
    .slice(0, 10);
}

function evolutionLineRootForCar(carId) {
  return cars.some((car) => car.id === carId) ? carId : carId;
}

function bondLevelForLine(lineRoot) {
  return Math.max(0, Math.floor(Number(state.bond?.[lineRoot]?.races) || 0));
}

function checkBondMilestones(carId) {
  const lineRoot = evolutionLineRootForCar(carId);
  const bondLevel = bondLevelForLine(lineRoot);
  for (const threshold of bondSceneThresholds) {
    const sceneId = `${lineRoot}-bond-${threshold}`;
    if (bondLevel >= threshold && !state.bondScenesViewed?.[sceneId]) {
      queueBondScene(lineRoot, threshold);
      return;
    }
  }
}

function queueBondScene(lineRoot, threshold) {
  const sceneId = `${lineRoot}-bond-${threshold}`;
  pendingBondSceneQueue = pendingBondSceneQueue || [];
  if (!pendingBondSceneQueue.some((scene) => scene.sceneId === sceneId)) {
    pendingBondSceneQueue.push({ lineRoot, threshold, sceneId });
  }
  window.setTimeout(playQueuedBondScene, 120);
}

function playQueuedBondScene() {
  if (!pendingBondSceneQueue?.length || activeBondScene) return;
  const openModal = document.querySelector(".modal-overlay.active, .modal-overlay:not([hidden])[aria-hidden='false']");
  if (openModal) return;
  activeBondScene = pendingBondSceneQueue.shift();
  renderBondScene();
}

function renderBondScene() {
  if (!activeBondScene || !el.bondSceneModal) return;
  const { lineRoot, threshold } = activeBondScene;
  const car = cars.find((item) => item.id === lineRoot) || cars[0];
  const progress = state.garage?.[lineRoot] || { evolution: 0 };
  const form = car.evolutions[Math.min(progress.evolution || 0, car.evolutions.length - 1)] || car.evolutions[0];
  const scene = bondScenes[lineRoot]?.[threshold];
  el.bondScenePortrait.innerHTML = carMarkupForEvolution(lineRoot, progress.evolution || 0, "display");
  el.bondSceneTitle.textContent = scene?.placeholder ? "[Bond Scene Placeholder]" : (scene?.title || "Bond Scene");
  el.bondSceneText.textContent = scene?.placeholder
    ? `${car.family} — Bond Level ${threshold}\nThis scene hasn't been written yet.`
    : (scene?.lines?.[0]?.text || `${form.name} shares a quiet moment.`);
  el.bondSceneModal.classList.add("active");
  el.bondSceneModal.setAttribute("aria-hidden", "false");
}

function closeBondScene() {
  if (!activeBondScene) return;
  state.bondScenesViewed = state.bondScenesViewed || {};
  state.bondScenesViewed[activeBondScene.sceneId] = true;
  activeBondScene = null;
  if (el.bondSceneModal) {
    el.bondSceneModal.classList.remove("active");
    el.bondSceneModal.setAttribute("aria-hidden", "true");
  }
  saveState();
  window.setTimeout(playQueuedBondScene, 80);
}

function recordStoryRaceOutcome(won, isStoryRace) {
  state.consecutiveLosses = won ? 0 : Math.max(0, Math.floor(Number(state.consecutiveLosses) || 0)) + 1;
  if (!won) maybeUnlockGarbageMedallion();
  if (!isStoryRace) {
    saveState();
    return;
  }
  state.winStreak = won ? Math.max(0, Math.floor(Number(state.winStreak) || 0)) + 1 : 0;
  if (!won) checkAchievements();
}

function unlockNextTrainingBossFromBoss(bossId) {
  const bossIndex = bossChallengeBosses.findIndex((boss) => boss.id === bossId);
  if (bossIndex < 0) return "";
  const targetIndex = Math.min(bossChallengeBosses.length - 1, bossIndex + 1);
  if (targetIndex > state.highestBossIndex) {
    state.highestBossIndex = targetIndex;
    return bossChallengeBosses[state.highestBossIndex]?.name || "";
  }
  return "";
}

function storyLevelsOfType(raceType) {
  return campaignLevels
    .map((level, index) => ({ level, index }))
    .filter(({ level }) => level.type === raceType);
}

function vindexCompletionStats() {
  const eligibleEntries = vindexEntries.filter((entry) => entry.name !== "Vanbrandt");
  const encountered = eligibleEntries.filter((entry) => isVindexDiscovered(entry)).length;
  return {
    encountered,
    total: eligibleEntries.length,
    percent: eligibleEntries.length ? Math.floor((encountered / eligibleEntries.length) * 100) : 0
  };
}

function achievementProgress(achievement) {
  if (achievement.type === "streak") {
    const current = Math.min(state.winStreak || 0, achievement.target);
    return { current, total: achievement.target, percent: Math.floor((current / achievement.target) * 100), complete: current >= achievement.target, label: `${current}/${achievement.target} wins` };
  }
  if (achievement.type === "storyType") {
    const levels = storyLevelsOfType(achievement.raceType);
    const current = levels.filter(({ index }) => storyLevelCompleted(index)).length;
    const total = levels.length;
    return { current, total, percent: total ? Math.floor((current / total) * 100) : 0, complete: total > 0 && current >= total, label: `${current}/${total} complete` };
  }
  if (achievement.type === "storyTypePercent") {
    const levels = storyLevelsOfType(achievement.raceType);
    const current = levels.filter(({ index }) => storyLevelCompleted(index)).length;
    const total = levels.length;
    const actualPercent = total ? Math.floor((current / total) * 100) : 0;
    return {
      current,
      total,
      percent: Math.min(100, Math.floor((actualPercent / achievement.percentTarget) * 100)),
      complete: total > 0 && actualPercent >= achievement.percentTarget,
      label: `${current}/${total} complete`
    };
  }
  if (achievement.type === "vindex") {
    const stats = vindexCompletionStats();
    const current = Math.min(stats.percent, achievement.percent);
    return {
      current: stats.encountered,
      total: stats.total,
      percent: Math.min(100, Math.floor((stats.percent / achievement.percent) * 100)),
      complete: stats.percent >= achievement.percent,
      label: `${stats.percent}% encountered`
    };
  }
  if (achievement.type === "garbageMedallion") {
    const complete = Boolean(state.garbageMedallionAwarded || hasMedallion("waste-management"));
    return { current: complete ? 1 : 0, total: 1, percent: complete ? 100 : 0, complete, label: complete ? "Unlocked" : "Secret" };
  }
  return { current: 0, total: 1, percent: 0, complete: false, label: "0%" };
}

function unlockCarLine(carId) {
  if (!cars.some((car) => car.id === carId)) return false;
  state.unlockedLines = state.unlockedLines || [...defaultUnlockedLines];
  const newlyUnlocked = !state.unlockedLines.includes(carId);
  if (newlyUnlocked) state.unlockedLines.push(carId);
  state.unlockedCars = state.unlockedCars || {};
  state.unlockedCars[carId] = true;
  state.garage[carId] = state.garage[carId] || { level: 1, xp: 0, evolution: 0, unlockedEvolution: 0, pendingEvolution: null };
  if (newlyUnlocked && featureEnabled("enableVINdexRevealNotifications")) {
    playAudioCue("newVindexEntry");
    showToast("VINDEX_ENTRY_UNLOCKED_PLACEHOLDER_TITLE", "VINDEX_ENTRY_UNLOCKED_PLACEHOLDER_BODY");
  }
  return newlyUnlocked;
}

function unlockArtVanForm(index) {
  const car = cars.find((item) => item.id === "art-van");
  if (!car || !car.evolutions[index]) return null;
  unlockCarLine("art-van");
  state.unlockedArtVanForms = Array.isArray(state.unlockedArtVanForms) ? state.unlockedArtVanForms : [];
  if (!state.unlockedArtVanForms.includes(0)) state.unlockedArtVanForms.push(0);
  const newlyUnlocked = !state.unlockedArtVanForms.includes(index);
  if (newlyUnlocked) state.unlockedArtVanForms.push(index);
  state.unlockedArtVanForms.sort((a, b) => a - b);
  const progress = state.garage["art-van"];
  if (!state.unlockedArtVanForms.includes(progress.evolution)) progress.evolution = index;
  progress.unlockedEvolution = Math.max(progress.unlockedEvolution || 0, index);
  if (newlyUnlocked && featureEnabled("enableVINdexRevealNotifications")) {
    playAudioCue("newVindexEntry");
    showToast("VINDEX_ENTRY_UNLOCKED_PLACEHOLDER_TITLE", "VINDEX_ENTRY_UNLOCKED_PLACEHOLDER_BODY");
  }
  return car.evolutions[index];
}

function grantRandomLevelTwoParts(count = 3) {
  const awarded = [];
  for (let index = 0; index < count; index += 1) {
    const type = partTypes[Math.floor(Math.random() * partTypes.length)];
    const part = partVariants.find((item) => item.id === type.id && item.level === 2);
    if (part) {
      state.partsInventory[part.key] = (state.partsInventory[part.key] || 0) + 1;
      awarded.push(part.name);
    }
  }
  return awarded;
}

function grantAchievementReward(achievement, silent = false) {
  const record = state.achievements?.[achievement.id];
  if (!record || record.granted) return;
  let message = achievement.reward;
  const artFormIndex = artVanUnlockByAchievement[achievement.id];
  if (Number.isInteger(artFormIndex)) {
    const form = unlockArtVanForm(artFormIndex);
    if (form) message = `${form.name} has answered your call.`;
  } else if (achievement.id === "vindex25") {
    addSprox(1000);
    message = "1000 Sprox awarded.";
  } else if (achievement.id === "vindex50") {
    unlockCarLine("cake-train");
    message = "Cuptrack has joined your Garage.";
  } else if (achievement.id === "vindex75") {
    const parts = grantRandomLevelTwoParts(3);
    message = `Level 2 parts awarded: ${parts.join(", ")}`;
  } else if (achievement.id === "garbageMedallion") {
    awardMedallion("waste-management");
    state.garbageMedallionAwarded = true;
    message = "Garbage Medallion awarded.";
  } else if (achievement.type === "storyTypePercent" && achievement.sprox) {
    addSprox(achievement.sprox);
    message = `${achievement.sprox} Sprox awarded.`;
  }
  record.granted = true;
  if (!silent) showToast(`Achievement Unlocked: ${achievement.name}`, message);
}

function checkAchievements(silent = false) {
  let changed = false;
  achievementDefs.forEach((achievement) => {
    const record = state.achievements[achievement.id] || { complete: false, granted: false };
    const progress = achievementProgress(achievement);
    if (progress.complete && !record.complete) {
      record.complete = true;
      changed = true;
    }
    state.achievements[achievement.id] = record;
    if (record.complete && !record.granted) {
      grantAchievementReward(achievement, silent);
      changed = true;
    }
  });
  return changed;
}

function achievementIsSecretHidden(achievement) {
  const record = state.achievements?.[achievement.id] || {};
  return Boolean(achievement.secret && !record.complete && !record.granted);
}

function normalizedGearbornStat(value) {
  return Math.max(0, Math.min(1, (value - 60) / 40));
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function selectablePlayerCars() {
  return tutorialActive()
    ? cars.filter((car) => car.id === tutorialCarId)
    : orderedCarList(cars.filter((car) => isCarUnlocked(car.id) && !car.tutorialOnly));
}

function firstSelectablePlayerCarId() {
  return selectablePlayerCars()[0]?.id || cars.find((car) => !car.tutorialOnly)?.id || cars[0]?.id;
}

function isSelectablePlayerCar(carId) {
  return selectablePlayerCars().some((car) => car.id === carId);
}

function difficultyMultiplier() {
  return { easy: 0.9, normal: 1, hard: 1.13 }[state.settings.difficulty] || 1;
}

function selectedCarIdForMode(mode) {
  const fallback = firstSelectablePlayerCarId();
  if (mode === "drag") return isSelectablePlayerCar(state.selectedCar) ? state.selectedCar : fallback;
  if (mode === "time") return isSelectablePlayerCar(state.selectedTimeCar) ? state.selectedTimeCar : fallback;
  if (mode === "beta") return isSelectablePlayerCar(state.selectedCar) ? state.selectedCar : fallback;
  if (mode === "battle") return isSelectablePlayerCar(state.selectedStoryCar) ? state.selectedStoryCar : fallback;
  return isSelectablePlayerCar(state.selectedStoryCar) ? state.selectedStoryCar : fallback;
}

function setSelectedCarForMode(mode, carId) {
  if (!isSelectablePlayerCar(carId)) return;
  state.selectedCar = carId;
  state.selectedTimeCar = carId;
  state.selectedStoryCar = carId;
  if (mode === "story") state.storyCarChosen = true;
  saveState();
  render();
}

function renderFlowScreens() {
  Object.entries(modeFlow).forEach(([mode, step]) => {
    document.querySelectorAll(`.flow-step[data-flow="${mode}"]`).forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.step === step);
    });
  });
  document.querySelector("#play-view")?.classList.toggle("race-step", modeFlow.drag === "race");
  document.querySelector("#time-trial-view")?.classList.toggle("race-step", modeFlow.time === "race");
  document.querySelector("#boss-view")?.classList.toggle("race-step", modeFlow.boss === "race");
  document.querySelector("#battle-view")?.classList.toggle("race-step", modeFlow.battle === "race");
  document.querySelector("#story-view")?.classList.toggle("story-race-step", modeFlow.story === "race");
  el.campaignList?.classList.toggle("story-hidden", !storyReplayOpen);
}

function setFlowStep(mode, step) {
  modeFlow[mode] = step;
  if (mode === "story" && step === "next" && !storyReplayOpen) {
    state.selectedCampaign = firstPlayableStoryLevelForCity(state.selectedStoryCity)?.campaignIndex ?? state.selectedCampaign;
    saveState();
  }
  render();
}

function backFromMode(mode) {
  const step = modeFlow[mode];
  if (mode === "story") {
    if (step === "race") {
      if (race) race.active = false;
      if (verticalRace) verticalRace.active = false;
      restoreEmbeddedCampaignRace();
      setFlowStep("story", "next");
      return;
    }
    if (storyReplayOpen) {
      storyReplayOpen = false;
      setFlowStep("story", "next");
      return;
    }
    if (step === "next") {
      showView("menu");
      return;
    }
    if (step === "car" && state.storyCarChosen) {
      setFlowStep("story", "next");
      return;
    }
    showView("menu");
    return;
  }
  if (step === "race") {
    if (mode === "drag" && race) race.active = false;
  if ((mode === "time" || mode === "boss") && verticalRace) verticalRace.active = false;
  if (mode === "battle") battleState = null;
    setFlowStep(mode, "match");
    return;
  }
  if (step === "match") {
    setFlowStep(mode, "car");
    return;
  }
  showView("solo");
}

function carTileMarkup(car, mode) {
  const progress = state.garage[car.id];
  const form = currentEvolution(car.id);
  return `
    <button class="icon-card compact ${selectedCarIdForMode(mode) === car.id ? "active" : ""}" type="button" data-car-target="${mode}" data-car-id="${car.id}">
      <div class="selection-preview-art">${carMarkupForEvolution(car.id, progress.evolution, "display")}</div>
      <strong>${form.name}</strong>
    </button>
  `;
}

function carSelectPreviewMarkup(carId) {
  const safeCarId = isSelectablePlayerCar(carId) ? carId : firstSelectablePlayerCarId();
  const car = cars.find((item) => item.id === safeCarId);
  if (!car) return "";
  const progress = state.garage[car.id];
  const form = currentEvolution(car.id);
  const stats = displayedGearbornStats(car.id);
  const playstyle = gearbornStatProfiles[car.id]?.playstyle || "";
  return `
    <div class="car-select-preview-art">
      ${carMarkupForEvolution(car.id, progress.evolution, "display")}
    </div>
    ${carSelectEvolutionControls(car)}
    <div class="car-select-preview-copy">
      <span>${car.family}</span>
      <h3>${form.name}</h3>
      <p>${playstyle}</p>
      <small>Level ${progress.level} · Form ${progress.evolution + 1} / ${unlockedEvolutionIndex(car.id) + 1}</small>
      ${garageStatsMarkup(stats, car.id)}
    </div>
  `;
}

function carSelectEvolutionControls(car) {
  if (!car || !state.garage[car.id]) return "";
  const progress = state.garage[car.id];
  if (car.id === "art-van") {
    const unlockedForms = (state.unlockedArtVanForms || [0]).filter((index) => car.evolutions[index]);
    const currentPosition = Math.max(0, unlockedForms.indexOf(progress.evolution));
    if (unlockedForms.length < 2) return "";
    return `
      <div class="evolution-switcher car-select-form-switcher" aria-label="${car.family} form selector">
        <button type="button" data-car-select-evolution-step="${car.id}:previous" ${currentPosition <= 0 ? "disabled" : ""}>←</button>
        <strong>${currentEvolution(car.id).name}</strong>
        <button type="button" data-car-select-evolution-step="${car.id}:next" ${currentPosition >= unlockedForms.length - 1 ? "disabled" : ""}>→</button>
      </div>
    `;
  }
  const unlocked = unlockedEvolutionIndex(car.id);
  if (unlocked < 1) return "";
  return `
    <div class="evolution-switcher car-select-form-switcher" aria-label="${car.family} form selector">
      <button type="button" data-car-select-evolution-step="${car.id}:previous" ${progress.evolution <= 0 ? "disabled" : ""}>←</button>
      <strong>${currentEvolution(car.id).name}</strong>
      <button type="button" data-car-select-evolution-step="${car.id}:next" ${progress.evolution >= unlocked ? "disabled" : ""}>→</button>
    </div>
  `;
}

function renderCarSelectPreview(mode, node) {
  if (!node) return;
  node.innerHTML = carSelectPreviewMarkup(selectedCarIdForMode(mode));
}

function renderCarTiles() {
  const available = tutorialActive() && currentTutorialScene().id === "mamburn"
    ? cars.filter((car) => car.id === tutorialCarId)
    : orderedCarList(cars.filter((car) => isCarUnlocked(car.id) && !car.tutorialOnly));
  if (el.dragCarGrid) el.dragCarGrid.innerHTML = available.map((car) => carTileMarkup(car, "drag")).join("");
  if (el.timeCarGrid) el.timeCarGrid.innerHTML = available.map((car) => carTileMarkup(car, "time")).join("");
  if (el.bossCarGrid) el.bossCarGrid.innerHTML = available.map((car) => carTileMarkup(car, "boss")).join("");
  if (el.battleCarGrid) el.battleCarGrid.innerHTML = available.map((car) => carTileMarkup(car, "battle")).join("");
  if (el.storyCarGrid) el.storyCarGrid.innerHTML = available.map((car) => carTileMarkup(car, "story")).join("");
  if (el.betaCarGrid) el.betaCarGrid.innerHTML = available.map((car) => carTileMarkup(car, "beta")).join("");
  renderCarSelectPreview("drag", el.dragCarSelectPreview);
  renderCarSelectPreview("time", el.timeCarSelectPreview);
  renderCarSelectPreview("boss", el.bossCarSelectPreview);
  renderCarSelectPreview("battle", el.battleCarSelectPreview);
  renderCarSelectPreview("story", el.storyCarSelectPreview);
  renderCarSelectPreview("beta", el.betaCarSelectPreview);
}

function activeViewId() {
  return document.querySelector(".view.active")?.id || "menu-view";
}

function viewIsActive(view) {
  return activeViewId() === `${view}-view`;
}

function embeddedViewIs(view) {
  return embeddedCampaignView?.view === view;
}

function renderMenuGoal() {
  const nextRaceNode = document.querySelector("#menu-next-race");
  const nextRewardNode = document.querySelector("#menu-next-reward");
  const nextThumbNode = document.querySelector("#menu-next-race-thumb");
  updateStoryCardCta();
  if (!nextRaceNode || !nextRewardNode) return;
  const cityIndex = Math.max(0, Math.min(state.selectedStoryCity || 0, highestUnlockedStoryCityIndex()));
  const city = storyCities[cityIndex] || storyCities[0];
  const level = firstPlayableStoryLevelForCity(cityIndex) || campaignLevels[0];
  const cityName = city?.city || "Indianapolis";
  nextRaceNode.textContent = `${cityName} - ${level?.title || "Next Level"}`;
  let reward = 50;
  if (level?.type === "drag" || level?.type === "pink-slip") reward = level.drag.xp;
  if (level?.type === "trial") reward = timeMedals[timeMedals.length - 1].xp;
  if (level?.type === "circuit" || level?.type === "rival") reward = story2dReward(level);
  if (level?.type === "battle") reward = battleRewardForBossIndex(level.bossIndex);
  if (level?.type === "boss") reward = (level.final ? finalBoss : bosses[level.bossIndex])?.xp || reward;
  nextRewardNode.textContent = `Reward +${reward} Sprox`;
  updateNextRaceThumbnail(nextThumbNode, city);
}

function updateStoryCardCta() {
  const ctaEl = document.querySelector(".hero-menu-card .menu-card-cta");
  if (!ctaEl) return;
  const hasProgress = Boolean(
    state.tutorialComplete ||
    state.highestCampaignIndex > 0 ||
    Object.keys(state.completedCampaignLevels || {}).length
  );
  ctaEl.textContent = hasProgress ? "Continue Your Journey" : "Begin Your Story";
}

function updateNextRaceThumbnail(thumbEl, city) {
  if (!thumbEl) return;
  const thumbMap = {
    indianapolis: "assets/menu/next-city-thumb-indianapolis.png",
    berlin: "assets/menu/next-city-thumb-berlin.png",
    dubai: "assets/menu/next-city-thumb-dubai.png",
    rio: "assets/menu/next-city-thumb-rio.png",
    "los-angeles": "assets/menu/next-city-thumb-los-angeles.png",
    seoul: "assets/menu/next-city-thumb-seoul.png",
    "cape-town": "assets/menu/next-city-thumb-cape-town.png",
    bangalore: "assets/menu/next-city-thumb-bangalore.png",
    bengaluru: "assets/menu/next-city-thumb-bangalore.png",
    space: "assets/menu/next-city-thumb-space.png"
  };
  const cityId = city?.id || storyCities[state.selectedStoryCity || 0]?.id || "indianapolis";
  thumbEl.hidden = false;
  thumbEl.src = thumbMap[cityId] || thumbMap.indianapolis;
  thumbEl.alt = city?.city || cityId;
}

function verifyMenuAssets() {
  const required = [
    "assets/menu/mainmenu-bg.png",
    "assets/menu/story-mode-card.png",
    "assets/menu/menu-particles.png",
    "assets/menu/icon-vindex.png",
    "assets/menu/icon-profiles.png",
    "assets/menu/icon-achievements.png",
    "assets/menu/icon-builder.png"
  ];
  required.forEach((path) => {
    const img = new Image();
    img.onerror = () => console.warn(`Missing menu asset: ${path}`);
    img.src = path;
  });
}

function render() {
  const activeView = activeViewId();
  const needsDrag = activeView === "play-view" || embeddedViewIs("play");
  const needsTime = activeView === "time-trial-view" || embeddedViewIs("time-trial");
  const needsBoss = activeView === "boss-view" || embeddedViewIs("boss");
  const needsBattle = activeView === "battle-view" || embeddedViewIs("battle");
  const needsStory = activeView === "story-view";
  const needsCarSelect = needsDrag || needsTime || needsBoss || needsBattle || needsStory || tutorialActive();
  renderSproxWallet();
  if (activeView === "menu-view") renderMenuGoal();
  renderTutorial();
  renderFlowScreens();
  if (needsCarSelect) {
    renderCarTiles();
    renderCarSelect();
    renderVerticalSelects();
  }
  if (needsStory) renderCampaign();
  if (needsBoss) renderBosses();
  if (needsBattle) renderBattles();
  if (needsTime) {
    renderTimeTargets();
    renderTimeTrackGrid();
  }
  if (viewIsActive("vindex")) renderVindex();
  if (viewIsActive("profiles")) renderProfiles();
  if (viewIsActive("achievements")) renderAchievements();
  if (viewIsActive("settings") || el.tunerModal?.classList.contains("active")) renderTuners();
  if (needsDrag) {
    renderDistanceOptions();
    renderOpponents();
    renderSelectionPreviews();
  }
  if (viewIsActive("garage")) renderGarage();
  if (viewIsActive("tuner-rank")) renderTunerRankScreen();
  if (viewIsActive("convoy")) renderConvoy();
  if (viewIsActive("convoy-loadouts")) renderConvoyLoadouts();
  if (viewIsActive("settings")) renderSettings();
  if (viewIsActive("builder")) renderBuilder();
  paintCars();
}

function renderCarSelect() {
  const selectableCars = selectablePlayerCars();
  el.playerCar.innerHTML = selectableCars.map((car) => {
    const progress = state.garage[car.id];
    const form = currentEvolution(car.id);
    return `<option value="${car.id}">${form.name} · ${car.family} · Lv ${progress.level}</option>`;
  }).join("");
  el.playerCar.value = state.selectedCar;
  ensureCarPickerButton(el.playerCar, "drag");
}

function renderVerticalSelects() {
  const selectableCars = selectablePlayerCars();
  const options = selectableCars.map((car) => {
    const progress = state.garage[car.id];
    const form = currentEvolution(car.id);
    return `<option value="${car.id}">${form.name} · Lv ${progress.level}</option>`;
  }).join("");
  el.storyCar.innerHTML = options;
  el.timeCar.innerHTML = options;
  el.storyCar.value = state.selectedStoryCar;
  ensureCarPickerButton(el.storyCar, "story");
  if (el.campaignCar) {
    el.campaignCar.innerHTML = options;
    el.campaignCar.value = state.selectedStoryCar;
    ensureCarPickerButton(el.campaignCar, "campaign");
  }
  el.timeCar.value = state.selectedTimeCar;
  ensureCarPickerButton(el.timeCar, "time");
  el.timeTrack.innerHTML = storyTracks.map((track) => `<option value="${track.id}">${track.city}, ${track.country}</option>`).join("");
  el.timeTrack.value = state.selectedTimeTrack;
}

function pickerTargetCarId(target) {
  if (target === "lastgear") return state.lastGearSelectedCar || state.selectedCar;
  if (target === "drag") return state.selectedCar;
  if (target === "time") return state.selectedTimeCar;
  return state.selectedStoryCar;
}

function setPickerTargetCarId(target, carId) {
  if (!isSelectablePlayerCar(carId)) return;
  if (target === "lastgear") state.lastGearSelectedCar = carId;
  else if (target === "drag") state.selectedCar = carId;
  else if (target === "time") state.selectedTimeCar = carId;
  else state.selectedStoryCar = carId;
  if (target === "story" || target === "campaign") state.storyCarChosen = true;
  const select = target === "drag" ? el.playerCar : target === "time" ? el.timeCar : target === "campaign" ? el.campaignCar : el.storyCar;
  if (select) select.value = carId;
  saveState();
  render();
}

function ensureCarPickerButton(select, target) {
  if (!select) return;
  select.classList.add("native-select-hidden");
  let button = select.nextElementSibling?.matches?.("[data-open-car-picker]") ? select.nextElementSibling : null;
  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "car-picker-open-button";
    button.dataset.openCarPicker = target;
    select.insertAdjacentElement("afterend", button);
  }
  const carId = pickerTargetCarId(target);
  const car = cars.find((item) => item.id === carId) || selectablePlayerCars()[0];
  if (!car) return;
  const progress = state.garage[car.id] || { level: 1, evolution: 0 };
  const form = currentEvolution(car.id);
  button.innerHTML = `
    <span class="car-picker-open-thumb">${carMarkupForEvolution(car.id, progress.evolution || 0, "display")}</span>
    <strong>${form.name}</strong>
    <small>Lv ${progress.level || 1}</small>
  `;
}

function openCarPicker(target) {
  carPickerState.target = target;
  carPickerState.highlighted = pickerTargetCarId(target);
  carPickerState.search = "";
  carPickerState.filters = { favorites: false, recent: false, ready: false, types: [] };
  carPickerState.sort = "level-desc";
  const title = document.querySelector("#car-picker-title");
  if (title) title.textContent = target === "lastgear" ? "Choose your Last Gear racer" : "Choose GearBorn";
  if (el.carPickerSearch) el.carPickerSearch.value = "";
  if (el.carPickerSort) el.carPickerSort.value = "level-desc";
  renderCarPicker();
  el.carPickerModal?.classList.add("active");
  el.carPickerModal?.setAttribute("aria-hidden", "false");
}

function closeCarPicker(confirm = false) {
  const target = carPickerState.target;
  if (confirm && carPickerState.highlighted) setPickerTargetCarId(target, carPickerState.highlighted);
  el.carPickerModal?.classList.remove("active");
  el.carPickerModal?.setAttribute("aria-hidden", "true");
  if (confirm && target === "lastgear" && typeof startLastGearBeta === "function") startLastGearBeta();
}

function carPickerTypes() {
  return [...new Set(selectablePlayerCars().map((car) => gearbornStatProfiles[car.id]?.type || "Neutral"))].sort();
}

function filteredPickerCars() {
  const recentIds = (state.recentCarUses || []).slice(0, 5).map((use) => use.carId);
  const query = carPickerState.search.trim().toLowerCase();
  let list = selectablePlayerCars().filter((car) => {
    const progress = state.garage[car.id] || {};
    const form = currentEvolution(car.id);
    const type = gearbornStatProfiles[car.id]?.type || "Neutral";
    if (query && !`${form.name} ${car.family}`.toLowerCase().includes(query)) return false;
    if (carPickerState.filters.favorites && !state.favoriteCarIds.includes(car.id)) return false;
    if (carPickerState.filters.recent && !recentIds.includes(car.id)) return false;
    if (carPickerState.filters.ready && !progress.pendingEvolution) return false;
    if (carPickerState.filters.types.length && !carPickerState.filters.types.includes(type)) return false;
    return true;
  });
  const recentlyUsedIndex = (carId) => recentIds.indexOf(carId) < 0 ? 999 : recentIds.indexOf(carId);
  list = list.sort((a, b) => {
    const pa = state.garage[a.id] || {};
    const pb = state.garage[b.id] || {};
    if (carPickerState.sort === "level-asc") return (pa.level || 1) - (pb.level || 1);
    if (carPickerState.sort === "name-asc") return currentEvolution(a.id).name.localeCompare(currentEvolution(b.id).name);
    if (carPickerState.sort === "recent") return recentlyUsedIndex(a.id) - recentlyUsedIndex(b.id);
    if (carPickerState.sort === "number") return (vindexEntries.find((entry) => entry.name === currentEvolution(a.id).name)?.number || "999").localeCompare(vindexEntries.find((entry) => entry.name === currentEvolution(b.id).name)?.number || "999");
    if (carPickerState.sort === "bond-desc") return bondLevelForLine(b.id) - bondLevelForLine(a.id);
    return (pb.level || 1) - (pa.level || 1);
  });
  return list;
}

function renderCarPicker() {
  if (!el.carPickerGrid) return;
  const typeChips = carPickerTypes().map((type) => `<button type="button" data-car-picker-type="${type}" class="${carPickerState.filters.types.includes(type) ? "active" : ""}">Type: ${type}</button>`).join("");
  el.carPickerFilters.innerHTML = `
    <button type="button" data-car-picker-filter="favorites" class="${carPickerState.filters.favorites ? "active" : ""}">Favorites</button>
    <button type="button" data-car-picker-filter="recent" class="${carPickerState.filters.recent ? "active" : ""}">Recently Used</button>
    <button type="button" data-car-picker-filter="ready" class="${carPickerState.filters.ready ? "active" : ""}">Ready to Evolve</button>
    ${typeChips}
  `;
  const selected = pickerTargetCarId(carPickerState.target);
  const carsForPicker = filteredPickerCars();
  el.carPickerGrid.innerHTML = carsForPicker.map((car) => {
    const progress = state.garage[car.id] || { level: 1, evolution: 0 };
    const form = currentEvolution(car.id);
    const type = gearbornStatProfiles[car.id]?.type || "Neutral";
    return `
      <button class="car-picker-card ${carPickerState.highlighted === car.id ? "highlighted" : ""} ${selected === car.id ? "selected" : ""}" type="button" data-car-picker-card="${car.id}">
        <span class="favorite-star ${state.favoriteCarIds.includes(car.id) ? "active" : ""}" data-car-picker-favorite="${car.id}">★</span>
        <div class="car-picker-card-art">${carMarkupForEvolution(car.id, progress.evolution || 0, "display")}</div>
        <strong>${form.name}</strong>
        <small>Lv ${progress.level || 1} · Bond ${bondLevelForLine(car.id)}</small>
        <em>${type}</em>
        ${progress.pendingEvolution ? `<b>Ready</b>` : ""}
      </button>
    `;
  }).join("") || `<p class="empty-note">No GearBorn match.</p>`;
  const highlighted = cars.find((car) => car.id === carPickerState.highlighted);
  el.carPickerSummary.textContent = highlighted ? `${currentEvolution(highlighted.id).name} · Level ${state.garage[highlighted.id]?.level || 1}` : "Select a GearBorn.";
}

function storyLevelCompleted(index) {
  return Boolean(state.completedCampaignLevels?.[index]);
}

function storyCityUnlocked(cityIndex) {
  if (cityIndex <= 0) return true;
  const previousCity = storyCities[cityIndex - 1];
  if (!previousCity) return false;
  const previousBoss = previousCity.levels.find((level) => level.type === "boss");
  return previousBoss ? storyLevelCompleted(previousBoss.campaignIndex) : false;
}

function highestUnlockedStoryCityIndex() {
  let highest = 0;
  storyCities.forEach((_, index) => {
    if (storyCityUnlocked(index)) highest = index;
  });
  return highest;
}

function cityCoreLevelsCompleted(city) {
  const levelRep = city.levels
    .filter((level) => !["boss", "pink-slip"].includes(level.type))
    .filter((level) => storyLevelCompleted(level.campaignIndex))
    .reduce((total, level) => total + storyLevelReputationValue(level), 0);
  const convoyRep = activeConvoysForCity(city.id)
    .filter((convoy) => state.convoy?.completed?.[convoy.id])
    .reduce((total) => total + 2, 0);
  return levelRep + convoyRep;
}

function cityCoreLevelsTotal(city) {
  const levelRep = city.levels
    .filter((level) => !["boss", "pink-slip"].includes(level.type))
    .reduce((total, level) => total + storyLevelReputationValue(level), 0);
  const convoyRep = activeConvoysForCity(city.id).length * 2;
  return levelRep + convoyRep;
}

function cityBossRequirement(city) {
  return Math.max(1, cityCoreLevelsTotal(city) - 1);
}

function storyLevelReputationValue(level) {
  if (!level || ["boss", "pink-slip"].includes(level.type)) return 0;
  return 1;
}

function cityReputationPercent(city) {
  const requiredCore = Math.min(cityBossRequirement(city), cityCoreLevelsTotal(city));
  return requiredCore ? Math.min(100, Math.round((cityCoreLevelsCompleted(city) / requiredCore) * 100)) : 100;
}

function gauntletProgress(cityId) {
  state.playerGauntletProgress = state.playerGauntletProgress || {};
  return state.playerGauntletProgress[cityId] || { revealed: false, popupShown: false, currentStage: 1, completed: false, rewardClaimed: false };
}

function saveGauntletProgress(cityId, patch = {}) {
  state.playerGauntletProgress = state.playerGauntletProgress || {};
  const current = gauntletProgress(cityId);
  state.playerGauntletProgress[cityId] = {
    ...current,
    ...patch,
    currentStage: Math.max(1, Math.min(3, Number(patch.currentStage ?? current.currentStage ?? 1)))
  };
  return state.playerGauntletProgress[cityId];
}

function gauntletConfigByKey(gauntletKey) {
  return medallionGauntlets[gauntletKey] || specialMedallionGauntlets[gauntletKey] || null;
}

function gauntletRewardAlreadyUnlocked(config) {
  return Boolean(config?.gearBornLineId && isCarUnlocked(config.gearBornLineId));
}

function gauntletAssignedCityId(gauntletKey) {
  if (gauntletKey === "rides-hair-special") return "indianapolis";
  const progress = gauntletProgress(gauntletKey);
  return progress.assignedCityId || (medallionGauntlets[gauntletKey] ? gauntletKey : state.selectedStoryCity != null ? storyCities[state.selectedStoryCity]?.id : storyCities[0]?.id);
}

function gauntletForCity(city) {
  return city && !city.final ? medallionGauntlets[city.id] : null;
}

function maybeTriggerMedallionGauntlet(city) {
  const config = gauntletForCity(city);
  if (!config?.enabled) return;
  if (gauntletRewardAlreadyUnlocked(config)) return;
  const progress = gauntletProgress(city.id);
  if (progress.popupShown || progress.completed) return;
  if (cityReputationPercent(city) < config.unlockReputationPercent) return;
  saveGauntletProgress(city.id, { revealed: true, popupShown: true, currentStage: 1 });
  saveState();
  openGauntletPopup(city.id);
}

function revealSpecialMedallionGauntlet(gauntletKey, cityId) {
  const config = specialMedallionGauntlets[gauntletKey];
  if (!config?.enabled || !cityId) return false;
  if (gauntletRewardAlreadyUnlocked(config)) return false;
  const progress = gauntletProgress(gauntletKey);
  if (progress.revealed || progress.completed || progress.rewardClaimed) return false;
  saveGauntletProgress(gauntletKey, { revealed: true, popupShown: true, assignedCityId: cityId, currentStage: 1 });
  saveState();
  openGauntletPopup(gauntletKey);
  return true;
}

function storyCityForCampaignIndex(index) {
  return storyCities.find((city) => city.levels.some((level) => level.campaignIndex === index)) || null;
}

function maybeTriggerRoyalFlushGauntlet(cityId) {
  return revealSpecialMedallionGauntlet("royal-flush-special", cityId || storyCities[state.selectedStoryCity]?.id);
}

function evolvedLineCountForRidesHairTrigger() {
  return cars.filter((car) => {
    if (car.tutorialOnly || ["rainbowlt", "metal-snake", "training-car", "rides-hair", "royal-flush"].includes(car.id)) return false;
    if (!isCarUnlocked(car.id)) return false;
    if (car.id === "art-van") return (state.unlockedArtVanForms || []).some((index) => index > 0);
    return unlockedEvolutionIndex(car.id) >= car.evolutions.length - 1;
  }).length;
}

function maybeTriggerRidesHairGauntlet() {
  if (evolvedLineCountForRidesHairTrigger() < 5) return false;
  const city = storyCities.find((item) => item.id === "indianapolis") || storyCities[0];
  return revealSpecialMedallionGauntlet("rides-hair-special", city.id);
}

function cityBossUnlocked(city) {
  if (city.final) return storyCityUnlocked(storyCities.indexOf(city));
  return cityCoreLevelsCompleted(city) >= cityBossRequirement(city);
}

function cityBossCompleted(city) {
  const bossLevel = city.levels.find((level) => level.type === "boss");
  return bossLevel ? storyLevelCompleted(bossLevel.campaignIndex) : false;
}

function storyLevelVisible(city, level) {
  if (!["boss", "pink-slip"].includes(level.type)) return true;
  if (level.type === "boss") return cityBossUnlocked(city);
  if (level.type === "pink-slip") return cityBossCompleted(city);
  return false;
}

function storyLevelLocked(city, level) {
  if (!storyCityUnlocked(storyCities.indexOf(city))) return true;
  if (level.type === "boss") return !cityBossUnlocked(city);
  if (level.type === "pink-slip") return !cityBossCompleted(city);
  return false;
}

function firstPlayableStoryLevelForCity(cityIndex) {
  const city = storyCities[cityIndex] || storyCities[0];
  return city.levels.find((level) => storyLevelVisible(city, level) && !storyLevelLocked(city, level) && !storyLevelCompleted(level.campaignIndex))
    || city.levels.find((level) => storyLevelVisible(city, level) && !storyLevelLocked(city, level))
    || city.levels[0];
}

function renderCampaign() {
  if (!el.storyCityMap) return;
  // During tutorial, use the special training city map
  if (tutorialActive()) {
    const city = tutorialCity;
    const tutorialLevels = tutorialMapLevels();
    el.storyCityIcon.innerHTML = city.icon ? `<img src="${city.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : "";
    el.storyCityTitle.textContent = city.city.toUpperCase();
    el.storyCityMap.style.backgroundImage = `linear-gradient(135deg, rgba(17, 24, 32, 0.42), rgba(26, 31, 39, 0.58)), url("${city.track.map}")`;
    el.storyCityMap.style.backgroundSize = "cover";
    el.storyCityMap.style.backgroundPosition = "center";
    el.bossUnlockNote.textContent = "";
    el.storyMapStage.innerHTML = tutorialLevels.map((level) => tutorialMapNodeMarkup(level)).join("");
    // Hide city-select and change-car controls during tutorial
    if (el.storyCitySelect) el.storyCitySelect.hidden = true;
    if (el.changeStoryCar) el.changeStoryCar.hidden = true;
    renderTutorialLevelPreview();
    return;
  }
  const city = storyCities[state.selectedStoryCity] || storyCities[0];
  const cityUnlocked = storyCityUnlocked(state.selectedStoryCity);
  renderTunerRankBadge();
  renderStoryFactionBadge();
  el.storyCityIcon.innerHTML = city.icon ? `<img src="${city.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : "";
  el.storyCityTitle.textContent = `${city.city}, ${city.country}`.toUpperCase();
  el.storyCityMap.style.backgroundImage = `linear-gradient(135deg, rgba(17, 24, 32, 0.42), rgba(26, 31, 39, 0.58)), url("${city.track.cityMap || city.track.map}")`;
  el.storyCityMap.style.backgroundSize = "cover";
  el.storyCityMap.style.backgroundPosition = "center";
  const completedCore = cityCoreLevelsCompleted(city);
  const totalCore = cityCoreLevelsTotal(city);
  const requiredCore = Math.min(cityBossRequirement(city), totalCore);
  const boss = bosses[city.bossIndex] || finalBoss;
  const repPercent = cityReputationPercent(city);
  el.bossUnlockNote.innerHTML = cityUnlocked && !city.final && !cityBossUnlocked(city)
    ? `<div class="reputation-meter" style="--rep:${repPercent}%">
        <div class="rep-copy"><span>Reputation</span><strong>${Math.min(completedCore, requiredCore)}/${totalCore}</strong></div>
        <div class="rep-track"><i></i></div>
        <div class="rep-boss">
          <img class="rep-boss-bg" src="${storyLevelVisuals.boss.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <img class="rep-boss-face" src="${boss.headshot || boss.portrait}" alt="${boss.name}" loading="lazy" decoding="async">
        </div>
      </div>`
    : "";
  el.storyMapStage.innerHTML = city.levels.map((level) => storyMapNodeMarkup(city, level)).join("") + gauntletMapNodeMarkup(city);
  if (!tutorialActive()) {
    window.setTimeout(() => maybeTriggerMedallionGauntlet(city), 0);
    window.setTimeout(() => maybeTriggerRidesHairGauntlet(), 0);
  }
  if (el.storyCitySelect) el.storyCitySelect.hidden = false;
  if (el.changeStoryCar) el.changeStoryCar.hidden = false;
  renderStoryCityGrid();
  renderConvoyEntry();
  renderStoryLevelPreview();
}

function tutorialMapLevels() {
  const sceneId = currentTutorialScene()?.id;
  if (sceneId !== "map-final") return tutorialCityLevels;
  return tutorialCityLevels.concat([
    { type: "boss", title: "Training Boss Example", tutorialLevel: "boss-example", bossIndex: 0 },
    { type: "pink-slip", title: "Tutorque Pink Slip Example", tutorialLevel: "pink-slip-example", medallion: "assets/medallions/medallion-tutorque.png", drag: { name: "Tutorque" } }
  ]);
}

function maybeShowCityWelcome() {
  if (tutorialActive() || !viewIsActive("story")) return;
  const city = storyCities[state.selectedStoryCity] || storyCities[0];
  if (!storyCityUnlocked(state.selectedStoryCity)) return;
  state.visitedStoryCities = state.visitedStoryCities || {};
  if (state.visitedStoryCities[city.id]) return;
  pendingCityWelcome = city.id;
  if (el.cityUnlockModal) {
    const banner = cityBannerImages[city.id];
    el.cityUnlockModal.classList.toggle("city-welcome-active", Boolean(banner));
    el.cityUnlockIcon.innerHTML = banner
      ? `<img class="city-welcome-banner" src="${banner}" alt="Welcome to ${city.city}" loading="eager" decoding="async" onerror="this.remove(); this.parentElement.innerHTML='${city.icon ? `<img src=&quot;${city.icon}&quot; alt=&quot;&quot; aria-hidden=&quot;true&quot;>` : ""}'">`
      : (city.icon ? `<img src="${city.icon}" alt="" aria-hidden="true">` : "");
    el.cityUnlockTitle.innerHTML = banner ? "" : `<strong>Welcome to ${city.city}</strong>`;
    el.cityUnlockTitle.hidden = Boolean(banner);
    el.cityUnlockModal.classList.add("active");
    el.cityUnlockModal.setAttribute("aria-hidden", "false");
    el.cityUnlockClose.focus();
  } else {
    showToast(`Welcome to ${city.city}`, "Continue to the city map.");
  }
  state.visitedStoryCities[city.id] = true;
  saveState();
}

function storyMapNodeMarkup(city, level) {
  const hidden = !storyLevelVisible(city, level);
  const locked = storyLevelLocked(city, level);
  const completed = storyLevelCompleted(level.campaignIndex);
  const visual = storyLevelVisuals[level.type] || storyLevelVisuals.boss;
  const layout = storyNodeLayoutFor(city, level);
  const nodeLabel = storyNodeLabel(level, completed, visual);
  const medal = getBestMedalForEvent(storyEventId(level.campaignIndex));
  return `
    <button class="story-map-node ${locked ? "locked" : ""} ${completed ? "completed" : ""} ${medalFrameClass(medal)}" type="button" data-story-level="${level.campaignIndex}" style="left:${layout.x}%; top:${layout.y}%; --node-color:${visual.color}" ${hidden ? "hidden" : ""} ${locked ? "disabled" : ""}>
      <span class="story-node-medal-wrap">${storyNodeIconMarkup(city, level, visual)}</span>
      <span class="story-node-label">${nodeLabel}</span>
    </button>
  `;
}

function gauntletMapNodeMarkup(city) {
  const nodes = [];
  const normal = gauntletNodeMarkup(city.id, city, 18, 36);
  if (normal) nodes.push(normal);
  Object.keys(specialMedallionGauntlets).forEach((gauntletKey, index) => {
    const progress = gauntletProgress(gauntletKey);
    if (progress.revealed && gauntletAssignedCityId(gauntletKey) === city.id) {
      const specialNode = gauntletNodeMarkup(gauntletKey, city, 82, 36 + index * 12);
      if (specialNode) nodes.push(specialNode);
    }
  });
  return nodes.join("");
}

function gauntletNodeMarkup(gauntletKey, city, x, y) {
  const config = gauntletConfigByKey(gauntletKey);
  if (!config?.enabled) return "";
  if (gauntletRewardAlreadyUnlocked(config)) return "";
  const progress = gauntletProgress(gauntletKey);
  if (!progress.revealed) return "";
  const car = cars.find((item) => item.id === config.gearBornLineId);
  const form = car?.evolutions[0];
  const label = progress.completed
    ? "Complete"
    : progress.currentStage > 1
      ? `Stage ${progress.currentStage}/3`
      : "Medallion Gauntlet";
  return `
    <button class="story-map-node gauntlet-node ${progress.completed ? "completed" : ""}" type="button" data-gauntlet-city="${gauntletKey}" style="left:${x}%; top:${y}%; --node-color:#f6c85f" ${progress.completed ? "disabled" : ""}>
      <span class="story-node-icon layered type-gauntlet">
        <img class="node-bg" src="assets/items/icon-medallion-gauntlet.png" alt="" aria-hidden="true" loading="lazy" decoding="async" onerror="this.remove()">
        <img class="node-subject gauntlet-medallion" src="${forgeMedallionSrc(config.gearBornLineId)}" alt="${form?.name || config.displayName}" loading="lazy" decoding="async">
      </span>
      <span class="story-node-label">${label}</span>
    </button>
  `;
}

function gauntletOpponentForStage(cityId, stageNumber) {
  const config = gauntletConfigByKey(cityId);
  const car = cars.find((item) => item.id === config?.gearBornLineId) || cars[0];
  const formIndex = Math.min(car.evolutions.length - 1, Math.max(0, stageNumber - 1));
  const form = car.evolutions[formIndex] || car.evolutions[0];
  const level = Math.max(1, state.garage[state.selectedStoryCar]?.level || 1);
  return { config, car, form, formIndex, level, stats: betaRatingsForCar(car.id, level, formIndex, false) };
}

function gauntletDriverForStage(cityId, stageNumber) {
  const opponent = gauntletOpponentForStage(cityId, stageNumber);
  return {
    id: `gauntlet-${cityId}`,
    name: opponent.form.name,
    image: forgeMedallionSrc(opponent.car.id),
    headshot: forgeMedallionSrc(opponent.car.id),
    car: opponent.form.name
  };
}

function gauntletModal() {
  let modal = document.querySelector("#gauntlet-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "gauntlet-modal";
  modal.className = "modal gauntlet-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-card gauntlet-card">
      <button class="modal-x" type="button" data-gauntlet-close>×</button>
      <img class="gauntlet-medallion-preview" alt="" loading="lazy" decoding="async">
      <h2></h2>
      <p></p>
      <div class="modal-actions">
        <button class="primary-button" type="button" data-gauntlet-continue>Continue</button>
        <button class="secondary-button" type="button" data-gauntlet-skip>Skip</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-gauntlet-close]") || event.target.closest("[data-gauntlet-skip]")) {
      closeGauntletPopup();
      render();
      return;
    }
    if (event.target.closest("[data-gauntlet-continue]")) {
      const cityId = modal.dataset.cityId;
      closeGauntletPopup();
      startMedallionGauntlet(cityId);
    }
  });
  return modal;
}

function openGauntletPopup(cityId) {
  const config = gauntletConfigByKey(cityId);
  const car = cars.find((item) => item.id === config?.gearBornLineId);
  const form = car?.evolutions[0];
  const modal = gauntletModal();
  modal.dataset.cityId = cityId;
  modal.querySelector("h2").textContent = config?.popupTitle || `${config?.displayName || form?.name || "A GearBorn"} has been watching…`;
  modal.querySelector("p").textContent = "Medallion Gauntlet unlocked.";
  const img = modal.querySelector(".gauntlet-medallion-preview");
  img.src = forgeMedallionSrc(config.gearBornLineId);
  img.alt = `${form?.name || config.displayName} Medallion`;
  modal.querySelector("[data-gauntlet-skip]").textContent = "Skip";
  modal.querySelector("[data-gauntlet-continue]").textContent = "Continue";
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeGauntletPopup() {
  const modal = document.querySelector("#gauntlet-modal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function startMedallionGauntlet(cityId) {
  const config = gauntletConfigByKey(cityId);
  if (!config?.enabled) return;
  if (gauntletRewardAlreadyUnlocked(config)) return;
  const progress = gauntletProgress(cityId);
  if (progress.completed) return;
  saveGauntletProgress(cityId, { revealed: true, popupShown: true });
  const stageNumber = progress.currentStage || 1;
  state.activeGauntlet = { cityId, stage: stageNumber, mode: config.stages[stageNumber - 1]?.mode || "drag" };
  saveState();
  const opponent = gauntletOpponentForStage(cityId, stageNumber);
  if (stageNumber === 1) {
    betaRaceContext = null;
    state.selectedCar = state.selectedStoryCar;
    mountCampaignRace("play");
    prepareDragRace(null, {
      rankKey: getVindexClass(vindexEntries.find((entry) => entry.name === opponent.form.name)) || "E",
      name: opponent.form.name,
      xp: 180,
      power: 0.58 + stageNumber * 0.08,
      image: imageFor(opponent.form, "race")
    });
    setFlowStep("drag", "race");
    startPendingDragRace();
    return;
  }
  if (stageNumber === 2) {
    betaRaceContext = null;
    mountCampaignRace("battle");
    beginBattle("gauntlet-battle", {
      boss: { id: `gauntlet-${cityId}`, name: opponent.form.name, car: opponent.form.name },
      carId: state.selectedStoryCar,
      opponentName: opponent.form.name,
      opponentCarId: opponent.car.id,
      opponentImage: imageFor(opponent.form, "race"),
      opponentStats: opponent.stats,
      reward: 0,
      gauntlet: { cityId, stage: stageNumber }
    });
    return;
  }
  startGauntlet2dRace(cityId);
}

function startGauntlet2dRace(cityId) {
  const assignedCityId = gauntletAssignedCityId(cityId);
  const city = storyCities.find((item) => item.id === assignedCityId) || storyCities[state.selectedStoryCity] || storyCities[0];
  const opponent = gauntletOpponentForStage(cityId, 3);
  betaRaceContext = { source: "gauntlet", cityId, stage: 3 };
  betaPendingMode = "duel";
  betaPreviewMode = "duel";
  betaSelectedTrackId = betaTrackIdForStoryTrack(city?.track || {});
  betaPreviewOpponents = [{
    driver: gauntletDriverForStage(cityId, 3),
    car: opponent.car,
    carId: opponent.car.id,
    form: opponent.form,
    evolution: opponent.formIndex,
    level: opponent.level,
    ratings: opponent.stats,
    skill: 0.96
  }];
  state.selectedBetaCar = state.selectedStoryCar;
  saveState();
  showView("beta");
  startBetaDemo("duel");
}

function completeGauntletStage(won) {
  const active = state.activeGauntlet;
  if (!active) return false;
  const cityId = active.cityId;
  const config = gauntletConfigByKey(cityId);
  if (!config) return false;
  if (!won) {
    state.activeGauntlet = null;
    saveState();
    return true;
  }
  const nextStage = Math.min(3, (active.stage || 1) + 1);
  if ((active.stage || 1) >= 3) {
    awardMedallion(config.gearBornLineId);
    saveGauntletProgress(cityId, { revealed: true, popupShown: true, currentStage: 3, completed: true, rewardClaimed: true });
    state.activeGauntlet = null;
    showToast("Medallion Gauntlet Complete", `${config.displayName} Medallion earned.`);
  } else {
    saveGauntletProgress(cityId, { revealed: true, popupShown: true, currentStage: nextStage });
    state.activeGauntlet = null;
    showGauntletContinueOptions(cityId, nextStage);
  }
  saveState();
  return true;
}

function showGauntletContinueOptions(cityId, nextStage) {
  const modal = gauntletModal();
  const config = gauntletConfigByKey(cityId);
  modal.dataset.cityId = cityId;
  modal.querySelector("h2").textContent = `Stage ${nextStage - 1}/3 complete`;
  modal.querySelector("p").textContent = `Continue to Stage ${nextStage} or return to the map.`;
  modal.querySelector(".gauntlet-medallion-preview").src = forgeMedallionSrc(config.gearBornLineId);
  modal.querySelector("[data-gauntlet-skip]").textContent = "Return to Map";
  modal.querySelector("[data-gauntlet-continue]").textContent = "Continue";
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function garbageMedallionModal() {
  let modal = document.querySelector("#garbage-medallion-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "garbage-medallion-modal";
  modal.className = "modal gauntlet-modal garbage-medallion-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-card gauntlet-card">
      <img class="gauntlet-medallion-preview" src="${forgeMedallionSrc("waste-management")}" alt="Garbage Medallion" loading="lazy" decoding="async">
      <h2>You drive like garbage. Here’s the Garbage Medallion!</h2>
      <div class="modal-actions">
        <button class="primary-button" type="button" data-garbage-medallion-close>Continue</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-garbage-medallion-close]")) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      render();
    }
  });
  return modal;
}

function openGarbageMedallionPopup() {
  const modal = garbageMedallionModal();
  modal.querySelector(".gauntlet-medallion-preview").src = forgeMedallionSrc("waste-management");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function maybeUnlockGarbageMedallion() {
  if (state.garbageMedallionAwarded || Math.max(0, Math.floor(Number(state.consecutiveLosses) || 0)) < 5) return false;
  awardMedallion("waste-management");
  state.garbageMedallionAwarded = true;
  state.consecutiveLosses = 0;
  state.achievements = state.achievements || {};
  state.achievements.garbageMedallion = { complete: true, granted: true };
  saveState();
  openGarbageMedallionPopup();
  return true;
}

function storyNodeLayoutFor(city, level) {
  if (level.type === "boss") return { x: 50, y: 15 };
  if (level.type === "pink-slip") return { x: 50, y: 90 };
  const prelims = city.levels.filter((item) => !["boss", "pink-slip"].includes(item.type) && storyLevelVisible(city, item));
  const index = Math.max(0, prelims.findIndex((item) => item.campaignIndex === level.campaignIndex));
  const count = Math.max(1, prelims.length);
  const rowSpec = count <= 4
    ? [{ count, y: 50 }]
    : count <= 6
      ? [{ count: Math.ceil(count / 2), y: 34 }, { count: Math.floor(count / 2), y: 52 }]
      : [{ count: Math.ceil(count / 3), y: 28 }, { count: Math.ceil((count - Math.ceil(count / 3)) / 2), y: 45 }, { count: count - Math.ceil(count / 3) - Math.ceil((count - Math.ceil(count / 3)) / 2), y: 61 }];
  let cursor = 0;
  for (const row of rowSpec) {
    if (index < cursor + row.count) {
      const rowIndex = index - cursor;
      const spacing = 78 / Math.max(1, row.count);
      const x = 11 + spacing / 2 + rowIndex * spacing;
      return { x: Math.max(12, Math.min(88, Math.round(x))), y: row.y };
    }
    cursor += row.count;
  }
  return { x: 50, y: 56 };
}

function storyNodeLabel(level, completed, visual) {
  if (completed) return "Complete";
  if (level.type === "circuit") return level.circuitMode === "race6" ? "6-Car Race" : "4-Car Race";
  if (level.type === "rival" && level.mechanic === "circuitDuel") return "Rival Race";
  return visual.label;
}

function rivalTuner() {
  const playerId = selectedTuner().id;
  return tuners.find((tuner) => tuner.id === (playerId === "cha-cha" ? "mylo" : "cha-cha")) || tuners[1] || tuners[0];
}

function formatRank(rank) {
  return rank ? `#${rank}` : "NR";
}

function formatRankOrdinal(rank) {
  if (!rank) return "NR";
  const suffix = rank % 100 >= 11 && rank % 100 <= 13
    ? "th"
    : ({ 1: "st", 2: "nd", 3: "rd" }[rank % 10] || "th");
  return `${rank}${suffix}`;
}

function completedBossIdsFromCampaign() {
  const completed = state.completedCampaignLevels || {};
  const ids = [];
  campaignLevels.forEach((level, index) => {
    if (!completed[index] || level.type !== "boss" || level.final) return;
    const boss = bosses[level.bossIndex];
    if (boss?.id && !ids.includes(boss.id)) ids.push(boss.id);
  });
  return ids;
}

function finalBossCompletedFromCampaign() {
  const completed = state.completedCampaignLevels || {};
  return campaignLevels.some((level, index) => Boolean(completed[index] && level.type === "boss" && level.final));
}

function effectiveTunerRankState() {
  const base = state.tunerRank || {};
  const defeatedBossIds = [...new Set([...(base.defeatedBossIds || []), ...completedBossIdsFromCampaign()])];
  let playerRank = base.playerRank || null;
  if (finalBossCompletedFromCampaign()) {
    playerRank = 1;
  } else {
    defeatedBossIds.forEach((bossId) => {
      const rank = tunerRankBaseList.find((row) => row.bossId === bossId)?.rank || null;
      if (rank) playerRank = playerRank ? Math.min(playerRank, rank) : rank;
    });
  }
  return {
    ...base,
    playerRank,
    defeatedBossIds,
    bossesFirstSeen: base.bossesFirstSeen || []
  };
}

function computeTunerRankList() {
  const rankState = effectiveTunerRankState();
  const rival = rivalTuner();
  const player = selectedTuner();
  const playerRank = rankState.playerRank || null;
  const rivalRank = playerRank ? playerRank + 1 : 9;
  if (state.tunerRank) state.tunerRank.rivalRank = playerRank ? rivalRank : null;
  const rows = tunerRankBaseList.map((entry) => ({
    ...entry,
    displayRank: entry.rank,
    name: entry.isRival ? rival.name : entry.name,
    headshot: entry.isRival ? (rival.headshot || rival.image) : entry.headshot
  })).filter((entry) => !entry.isRival || !playerRank);

  if (playerRank) {
    rows.forEach((row) => {
      if (row.displayRank >= playerRank) row.displayRank += 1;
    });
    rows.push({
      rank: playerRank,
      displayRank: playerRank,
      id: "player",
      name: player.name,
      headshot: player.headshot || player.image,
      isPlayer: true
    });
    rows.push({
      rank: rivalRank,
      displayRank: rivalRank,
      id: "rival",
      name: rival.name,
      headshot: rival.headshot || rival.image,
      isRival: true,
      rivalId: rival.id
    });
  }

  (rankState.defeatedBossIds || []).forEach((bossId) => {
    const bossRow = rows.find((row) => row.bossId === bossId);
    if (bossRow && playerRank && bossRow.displayRank <= playerRank) bossRow.displayRank = playerRank + 1;
  });
  (rankState.bossesFirstSeen || []).forEach((cityId) => {
    const cityIndex = storyCities.findIndex((city) => city.id === cityId);
    const previousBoss = cityIndex > 0 ? bosses[cityIndex - 1] : null;
    const bossRow = previousBoss ? rows.find((row) => row.bossId === previousBoss.id) : null;
    if (bossRow && playerRank) bossRow.displayRank = Math.max(bossRow.displayRank, playerRank + 2);
  });

  return rows
    .sort((a, b) => {
      const priority = (row) => row.isPlayer ? 0 : row.isRival ? 1 : 2;
      return a.displayRank - b.displayRank || priority(a) - priority(b) || (a.rank || 999) - (b.rank || 999);
    })
    .map((row, index) => ({ ...row, displayRank: index + 1 }));
}

function currentTunerRankForBoss(bossId) {
  return computeTunerRankList().find((row) => row.bossId === bossId)?.displayRank || null;
}

function advanceTunerRankForBossWin(bossId) {
  if (!bossId) return null;
  state.tunerRank = state.tunerRank || { playerRank: null, defeatedBossIds: [], bossesFirstSeen: [], rivalRank: null };
  if (state.tunerRank.defeatedBossIds.includes(bossId)) return null;
  const oldRank = state.tunerRank.playerRank || null;
  const bossRank = currentTunerRankForBoss(bossId) || 8;
  state.tunerRank.playerRank = oldRank ? Math.min(oldRank, bossRank) : bossRank;
  state.tunerRank.defeatedBossIds.push(bossId);
  state.tunerRank.rivalRank = state.tunerRank.playerRank + 1;
  return { oldRank, newRank: state.tunerRank.playerRank, bossId };
}

function advanceTunerRankForCityEntry(cityId) {
  if (!cityId || tutorialActive()) return;
  state.tunerRank = state.tunerRank || { playerRank: null, defeatedBossIds: [], bossesFirstSeen: [], rivalRank: null };
  if (state.tunerRank.bossesFirstSeen.includes(cityId)) return;
  const cityIndex = storyCities.findIndex((city) => city.id === cityId);
  const previousBoss = cityIndex > 0 ? bosses[cityIndex - 1] : null;
  if (previousBoss && state.tunerRank.defeatedBossIds.includes(previousBoss.id)) {
    state.tunerRank.bossesFirstSeen.push(cityId);
    state.tunerRank.rivalRank = state.tunerRank.playerRank ? state.tunerRank.playerRank + 1 : null;
  }
}

function renderTunerRankBadge() {
  const rank = effectiveTunerRankState().playerRank || null;
  if (el.tunerRankOpen) {
    el.tunerRankOpen.textContent = formatRankOrdinal(rank);
    el.tunerRankOpen.setAttribute("aria-label", `Open Tuner Rank, current rank ${formatRankOrdinal(rank)}`);
  } else if (el.tunerRankBadge) {
    el.tunerRankBadge.textContent = `Tuner Rank: ${formatRankOrdinal(rank)}`;
  }
}

function renderTunerRankScreen() {
  if (!el.tunerRankList) return;
  el.tunerRankList.innerHTML = computeTunerRankList().map((row) => `
    <article class="tuner-rank-row ${row.isPlayer ? "player" : ""} ${row.isRival ? "rival" : ""}">
      <strong class="tuner-rank-number">#${row.displayRank}</strong>
      <img src="${row.headshot || "assets/characters/headshots/headshot-mylo.png"}" alt="" loading="lazy" decoding="async">
      <span>${row.name}</span>
    </article>
  `).join("");
}

function openTunerRankScreen() {
  renderTunerRankScreen();
  showView("tuner-rank");
}

function showTunerRankRisePopup(rankChange, onReturn) {
  playSound("rank-up");
  let modal = document.querySelector("#tuner-rank-rise-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "tuner-rank-rise-modal";
    modal.className = "modal-overlay tuner-rank-rise-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="confirm-modal tuner-rank-rise-card" role="dialog" aria-modal="true">
        <p class="modal-kicker">Tuner Rank</p>
        <h2>You've risen in the rankings!</h2>
        <div class="tuner-rank-change"></div>
        <div class="modal-actions">
          <button class="primary" type="button" data-rank-view>View Leaderboard</button>
          <button class="ghost" type="button" data-rank-return>Return to City</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  const boss = bossChallengeBosses.find((item) => item.id === rankChange.bossId) || {};
  const player = selectedTuner();
  modal.querySelector(".tuner-rank-change").innerHTML = `
    <div class="rank-face-stack">
      <img src="${player.headshot || player.image}" alt="" loading="lazy" decoding="async">
      <span>${formatRank(rankChange.oldRank)} → ${formatRank(rankChange.newRank)}</span>
      <img class="dropping" src="${boss.headshot || boss.portrait || ""}" alt="" loading="lazy" decoding="async">
    </div>
  `;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  modal.querySelector("[data-rank-view]").onclick = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    openTunerRankScreen();
  };
  modal.querySelector("[data-rank-return]").onclick = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    if (typeof onReturn === "function") onReturn();
  };
}

function setConvoyAvailable(convoyId, available = true) {
  if (!convoyDefinitions[convoyId]) return;
  state.convoy = state.convoy || {};
  state.convoy.available = state.convoy.available || {};
  state.convoy.available[convoyId] = Boolean(available);
  state.convoy.loadoutsUnlocked = state.convoy.loadoutsUnlocked || Boolean(available);
  saveState();
  renderConvoyEntry();
}

function renderStoryFactionBadge() {
  if (!el.storyFactionBadge || !el.storyFactionBadgeImg) return;
  const faction = activeFactionId();
  el.storyFactionBadge.hidden = false;
  el.storyFactionBadge.dataset.faction = faction;
  el.storyFactionBadgeImg.src = faction === "spindell"
    ? "assets/items/icon-badge-spindell.png"
    : "assets/items/icon-badge-keyfree.png";
  el.storyFactionBadgeImg.alt = `${activeFactionLabel()} faction`;
}

function openFactionHubPlaceholder() {
  const message = activeFactionId() === "spindell" ? "Spindell Hub coming soon." : "KeyFree Hub coming soon.";
  const modal = document.createElement("div");
  modal.className = "modal-overlay active faction-hub-placeholder";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" type="button" aria-label="Close faction hub">×</button>
      <p class="modal-kicker">${activeFactionLabel()}</p>
      <h2>${activeFactionLabel()} Hub</h2>
      <p>${message}</p>
      <button class="primary" type="button">Continue</button>
    </div>
  `;
  const close = () => modal.remove();
  modal.querySelector(".modal-close")?.addEventListener("click", close);
  modal.querySelector(".primary")?.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  document.body.appendChild(modal);
}

function renderConvoyEntry() {
  if (!el.convoyEntryNode || !el.convoyButtons) return;
  const city = storyCities[state.selectedStoryCity] || storyCities[0];
  const cityConvoys = storyCityUnlocked(state.selectedStoryCity) ? activeConvoysForCity(city.id) : [];
  const legacyAvailable = Object.values(convoyDefinitions || {}).filter((convoy) => !convoy.cityId && state.convoy?.available?.[convoy.id]);
  const availableConvoys = cityConvoys.concat(legacyAvailable);
  el.convoyEntryNode.hidden = !availableConvoys.length;
  el.convoyButtons.innerHTML = availableConvoys.map((convoy) => {
    const completed = state.convoy?.completed?.[convoy.id];
    return `
      <button class="convoy-entry-button ${completed ? "completed" : ""}" type="button" data-convoy-open="${convoy.id}">
        <span class="convoy-medallion">
          <img class="convoy-medallion-base" src="${convoy.icon}" alt="" loading="lazy" decoding="async">
          <img class="convoy-medallion-face" src="${convoy.headshot}" alt="" loading="lazy" decoding="async">
        </span>
        <strong>${convoy.name}</strong>
        <small>Convoy · +2 Rep${completed ? " · Complete" : ""}</small>
      </button>
    `;
  }).join("");
}

function openConvoy(convoyId) {
  if (!convoyDefinitions[convoyId]) return;
  state.convoy.inProgress = state.convoy.inProgress || { convoyId, currentStage: 0, stageProgress: {} };
  state.convoy.inProgress.convoyId = convoyId;
  const preScene = convoyStoryScriptFor(convoyId, "pre")[0]?.text;
  if (preScene) showToast("Convoy Story Placeholder", preScene);
  renderConvoy();
  showView("convoy");
}

function validConvoyLoadout(loadout) {
  const carIds = Array.isArray(loadout?.carIds) ? loadout.carIds.filter(Boolean) : [];
  return carIds.length === 3 && new Set(carIds).size === 3 && carIds.every((carId) => isSelectablePlayerCar(carId));
}

function activeConvoyLoadout() {
  return (state.convoy?.loadouts || []).find(validConvoyLoadout) || null;
}

function completeConvoy(convoyId) {
  const convoy = convoyDefinitions[convoyId];
  if (!convoy) return false;
  const firstClear = !state.convoy?.completed?.[convoyId];
  state.convoy = state.convoy || {};
  state.convoy.completed = state.convoy.completed || {};
  state.convoy.completed[convoyId] = true;
  state.convoy.inProgress = null;
  const reward = firstClear ? convoy.rewards?.firstWin || {} : convoy.rewards?.replayWin || {};
  if (reward.sprox) addSprox(reward.sprox);
  state.convoyMedallions = state.convoyMedallions || [];
  const medallionIds = convoy.rewards?.firstWin?.medallionIds || [];
  const newlyEarnedMedallions = medallionIds.filter((medallionId) => !state.convoyMedallions.includes(medallionId));
  newlyEarnedMedallions.forEach((medallionId) => state.convoyMedallions.push(medallionId));
  const postScene = convoyStoryScriptFor(convoyId, "post")[0]?.text;
  const medallionCopy = newlyEarnedMedallions.length
    ? ` Medallion earned: ${newlyEarnedMedallions.join(", ")}.`
    : " Medallion already earned.";
  showToast(firstClear ? "Convoy Complete" : "Convoy Replay Complete", postScene || `${convoy.name} complete.${medallionCopy}`);
  saveState();
  renderCampaign();
  return true;
}

function renderConvoy() {
  if (!el.convoyTitle || !el.convoyStageList) return;
  const convoyId = state.convoy?.inProgress?.convoyId || Object.keys(convoyDefinitions).find((id) => state.convoy?.available?.[id]) || "tyree";
  const convoy = convoyDefinitions[convoyId] || convoyDefinitions.tyree;
  const loadout = activeConvoyLoadout();
  el.convoyTitle.textContent = convoy.name;
  el.convoySummary.textContent = `${convoy.sponsor} · 3 stages · no car reuse${loadout ? ` · ${loadout.name}` : " · Choose a valid loadout"}`;
  const progress = state.convoy?.inProgress?.stageProgress || {};
  el.convoyStageList.innerHTML = convoy.stages.map((stage, index) => `
    <article class="convoy-stage-card ${progress[index] || ""}">
      <span>Stage ${index + 1}</span>
      <strong>${stage.type === "h2h" ? "Head-to-Head" : stage.type.toUpperCase()}</strong>
      <p>${stage.opponentName}${loadout?.carIds?.[index] ? ` · Your slot: ${currentEvolution(loadout.carIds[index]).name}` : ""}</p>
      <button class="primary" type="button" data-convoy-stage="${index}" ${!loadout || index > 0 && progress[index - 1] !== "won" ? "disabled" : ""}>${progress[index] === "lost" ? "Retry Stage" : "Start Stage"}</button>
    </article>
  `).join("");
}

function renderConvoyLoadouts() {
  if (!el.convoyLoadoutSlots) return;
  const owned = selectablePlayerCars();
  el.convoyLoadoutSlots.innerHTML = state.convoy.loadouts.map((loadout, index) => `
    <article class="convoy-loadout-slot">
      <h3>${loadout?.name || `Empty Slot ${index + 1}`}</h3>
      <input type="text" value="${loadout?.name || `Loadout ${index + 1}`}" maxlength="32" data-convoy-loadout-name="${index}">
      <div class="convoy-loadout-selects">
        ${[0, 1, 2].map((slot) => `
          <select data-convoy-loadout-car="${index}:${slot}">
            ${owned.map((car) => `<option value="${car.id}" ${loadout?.carIds?.[slot] === car.id ? "selected" : ""}>${currentEvolution(car.id).name}</option>`).join("")}
          </select>
        `).join("")}
      </div>
      <button class="primary" type="button" data-save-convoy-loadout="${index}">Save</button>
    </article>
  `).join("");
}

function saveConvoyLoadout(index) {
  const nameInput = document.querySelector(`[data-convoy-loadout-name="${index}"]`);
  const carIds = [0, 1, 2].map((slot) => document.querySelector(`[data-convoy-loadout-car="${index}:${slot}"]`)?.value).filter(Boolean);
  if (carIds.length !== 3 || new Set(carIds).size !== 3) {
    showToast("Convoy Loadout", "Convoy loadouts require three different GearBorn.");
    return;
  }
  state.convoy.loadouts[index] = { name: nameInput?.value?.trim() || `Loadout ${index + 1}`, carIds };
  saveState();
  renderConvoyLoadouts();
}

function rivalCarIdForPlayer(playerCarId = state.selectedStoryCar) {
  const candidates = rivalStarterCarIds.filter((carId) => carId !== playerCarId);
  const seed = selectedTuner().id === "cha-cha" ? 1 : 0;
  return candidates[seed % candidates.length] || rivalStarterCarIds[0];
}

function rivalCarSetup(playerCarId = state.selectedStoryCar) {
  const rivalCarId = rivalCarIdForPlayer(playerCarId);
  const playerProgress = state.garage[playerCarId] || { level: 1, evolution: 0 };
  const rivalCar = cars.find((car) => car.id === rivalCarId) || cars[0];
  const evolution = Math.min(playerProgress.evolution || 0, rivalCar.evolutions.length - 1);
  const form = rivalCar.evolutions[evolution] || rivalCar.evolutions[0];
  const profile = gearbornStatProfiles[rivalCarId] || gearbornStatProfiles.bee;
  const levelGain = Math.max(0, (playerProgress.level || 1) - 1);
  const evolutionGain = evolution * 2;
  const stats = {
    speed: Math.min(100, profile.speed + levelGain + evolutionGain),
    acceleration: Math.min(100, profile.acceleration + levelGain + evolutionGain),
    handling: Math.min(100, profile.handling + levelGain + evolutionGain),
    torque: Math.min(100, (profile.torque ?? 74) + levelGain + evolutionGain),
    body: Math.min(100, (profile.body ?? 72) + levelGain + evolutionGain),
    powertrain: Math.min(100, (profile.powertrain ?? 78) + levelGain + evolutionGain)
  };
  return { carId: rivalCarId, car: rivalCar, form, evolution, level: playerProgress.level || 1, stats };
}

function storyNodeIconMarkup(city, level, visual) {
  if (level.type === "boss") {
    const boss = level.final ? finalBoss : bosses[level.bossIndex];
    return `
      <span class="story-node-icon layered type-boss">
        <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <img class="node-subject boss-headshot" src="${boss.headshot || boss.portrait}" alt="${boss.name}" loading="lazy" decoding="async">
      </span>
    `;
  }
  if (level.type === "pink-slip") {
    const form = level.drag;
    const medallion = forgeMedallionSrc(level.pinkSlipCarId);
    return `
      <span class="story-node-icon layered type-pink-slip">
        <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <img class="node-subject pink-medallion" src="${medallion || form.displayImage || form.image}" alt="${form.name}" loading="lazy" decoding="async">
      </span>
    `;
  }
  if (level.type === "rival") {
    const rival = rivalTuner();
    return `
      <span class="story-node-icon layered type-rival">
        <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" onerror="this.remove()">
        <img class="node-subject rival-headshot" src="${rival.headshot || rival.image}" alt="${rival.name}" loading="lazy" decoding="async">
      </span>
    `;
  }
  return `
    <span class="story-node-icon type-${level.type}">
      <img class="node-bg" src="${visual.icon}" alt="${visual.label}" loading="lazy" decoding="async">
    </span>
  `;
}

function renderStoryCityGrid() {
  el.storyCityGrid.innerHTML = storyCities.map((city, index) => {
    if (city.final && !storyCityUnlocked(index)) return "";
    const unlocked = storyCityUnlocked(index);
    return `
      <button class="story-city-tile ${index === state.selectedStoryCity ? "active" : ""} ${unlocked ? "" : "locked"}" type="button" data-story-city="${index}" ${unlocked ? "" : "disabled"}>
        <span class="city-icon">${city.icon ? `<img src="${city.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : ""}</span>
        <strong>${cityAbbreviations[city.id] || city.city}</strong>
      </button>
    `;
  }).join("");
}

function renderStoryLevelPreview() {
  const panelOpen = el.storyPreviewPanel.classList.contains("active");
  const level = campaignLevels[state.selectedCampaign];
  if (!panelOpen || !level) return;
  const locked = storyLevelLocked(storyCities[state.selectedStoryCity], level);
  const visual = storyLevelVisuals[level.type] || storyLevelVisuals.boss;
  el.storyPreviewIcon.innerHTML = storyNodeIconMarkup(storyCities[state.selectedStoryCity], level, visual);
  el.storyPreviewIcon.className = `story-level-icon story-preview-icon type-${level.type}`;
  el.storyPreviewIcon.style.background = "transparent";
  el.campaignType.textContent = locked ? "Locked" : campaignTypeLabel(level);
  el.campaignTitle.textContent = locked && level.final ? "?" : level.title;
  el.campaignMeta.textContent = campaignLevelMeta(level, locked);
  el.storyPreviewArt.innerHTML = storyPreviewArtMarkup(level, locked);
  renderStoryPreviewLeaderboard(level, locked);
  renderCampaignRewards(level, locked);
  renderStoryLoadout();
  el.startCampaign.disabled = locked;
  el.startCampaign.textContent = "Start Level";
}

function storyPreviewArtMarkup(level, locked) {
  if (locked) return `<div class="silhouette-card"><div class="silhouette-car">?</div></div>`;
  if (level.type === "drag") {
    const image = level.drag.displayImage || level.drag.image?.replace("-race.", "-display.");
    return displayMarkup(image, level.drag.name, "#ffc857");
  }
  if (level.type === "battle") {
    return `<div class="story-map-preview" style="background-image:url('assets/maps/map-battle-arena.png')"><span>Arena Battle</span></div>`;
  }
  if (is2dStoryLevel(level)) {
    return `<canvas class="story-beta-track-preview" data-story-beta-track="${betaTrackIdForStoryTrack(level.track || (level.final ? finalBoss.track : bosses[level.bossIndex]?.track))}" width="420" height="300" aria-label="Circuit race track preview"></canvas>`;
  }
  if (level.type === "rival") {
    const rival = rivalTuner();
    const rivalCar = rivalCarSetup();
    if (level.mechanic === "drag") return displayMarkup(imageFor(rivalCar.form, "display"), rivalCar.form.name, rivalCar.car.color);
    if (level.mechanic === "battle") return `<div class="story-map-preview" style="background-image:url('assets/maps/map-battle-arena.png')"><span>${rival.name}</span></div>`;
    return characterMarkup({ name: rival.name, image: rival.headshot || rival.image });
  }
  const boss = level.final ? finalBoss : bosses[level.bossIndex];
  return characterMarkup({ name: boss.name, image: boss.portrait });
}

function renderStoryPreviewLeaderboard(level, locked) {
  if (!el.storyPreviewLeaderboard) return;
  if (locked || !is2dStoryLevel(level)) {
    el.storyPreviewLeaderboard.innerHTML = "";
    drawStoryBetaPreviewCanvases();
    return;
  }
  const mode = story2dModeForLevel(level);
  const playerCar = cars.find((car) => car.id === state.selectedStoryCar) || cars[0];
  const playerForm = currentEvolution(playerCar.id);
  const opponents = story2dOpponentsForLevel(level, mode, state.selectedCampaign);
  const rows = opponents.map((opponent) => betaLeaderboardRow({
    driver: opponent.driver,
    form: opponent.form,
    car: opponent.car
  })).join("");
  el.storyPreviewLeaderboard.innerHTML = `
    <div class="story-preview-leaderboard-title">${mode === "time" ? "Time Trial Run" : "Race Leaderboard"}</div>
    ${rows}
    ${betaLeaderboardRow({ driver: selectedTuner(), form: playerForm, car: playerCar, player: true })}
  `;
  drawStoryBetaPreviewCanvases();
}

function drawStoryBetaPreviewCanvases() {
  document.querySelectorAll(".story-beta-track-preview").forEach((canvas) => {
    const track = betaTracks.find((item) => item.id === canvas.dataset.storyBetaTrack) || betaTracks[0];
    drawBetaTrackPreviewTo(canvas, track);
  });
}

function openStoryPreview(campaignIndex) {
  const city = storyCities[state.selectedStoryCity] || storyCities[0];
  const level = campaignLevels[campaignIndex];
  if (!level || !city.levels.some((item) => item.campaignIndex === campaignIndex)) return;
  if (!storyLevelVisible(city, level) || storyLevelLocked(city, level)) return;
  state.selectedCampaign = campaignIndex;
  el.storyPreviewPanel.classList.add("active");
  el.storyPreviewPanel.setAttribute("aria-hidden", "false");
  closeCitySelect();
  saveState();
  renderCampaign();
}

function closeStoryPreview() {
  if (!el.storyPreviewPanel) return;
  el.storyPreviewPanel.classList.remove("active");
  el.storyPreviewPanel.setAttribute("aria-hidden", "true");
}

function openCitySelect() {
  closeStoryPreview();
  el.storyCitySelectPanel.classList.add("active");
  el.storyCitySelectPanel.setAttribute("aria-hidden", "false");
  renderStoryCityGrid();
}

function closeCitySelect() {
  if (!el.storyCitySelectPanel) return;
  el.storyCitySelectPanel.classList.remove("active");
  el.storyCitySelectPanel.setAttribute("aria-hidden", "true");
}

function selectStoryCity(index) {
  if (!storyCityUnlocked(index)) return;
  state.selectedStoryCity = index;
  advanceTunerRankForCityEntry(storyCities[index]?.id);
  state.selectedCampaign = firstPlayableStoryLevelForCity(index)?.campaignIndex ?? state.selectedCampaign;
  closeCitySelect();
  closeStoryPreview();
  saveState();
  renderCampaign();
  window.setTimeout(maybeShowCityWelcome, 80);
}

function campaignLevelEarnedBadge(index, level, locked) {
  const result = !locked && level.type === "trial" ? state.storyTimeTrials?.[index] : null;
  if (!result?.medalKey) return "";
  return `<span class="campaign-earned medal-text ${result.medalKey}">${result.medalLabel} Earned</span>`;
}

function campaignTypeLabel(level) {
  if (level.type === "drag") return "Drag Race";
  if (level.type === "pink-slip") return "Pink Slip Race";
  if (level.type === "trial") return "Time Trial";
  if (level.type === "circuit") return level.circuitMode === "race6" ? "6-Car Race" : "4-Car Race";
  if (level.type === "battle") return "Battle";
  if (level.type === "rival") return "Rival Race";
  return "Boss Battle";
}

function battleRewardForBossIndex(index) {
  return Math.max(90, Math.round(130 + Math.max(0, index) * 75));
}

function renderCampaignRewards(level, locked) {
  if (locked) {
    el.campaignRewards.innerHTML = "";
    return;
  }
  if (level.type === "trial") {
    const trackIndex = storyTracks.findIndex((track) => track.id === level.track.id);
    const result = state.storyTimeTrials?.[state.selectedCampaign];
    const bestResult = result?.medalKey
      ? `<div class="reward-row compact story-best-time">
          <span class="medal-text ${result.medalKey}">${result.medalLabel} Earned</span>
          <strong>${result.bestTime.toFixed(2)} s</strong>
        </div>`
      : "";
    el.campaignRewards.innerHTML = storyReputationRewardMarkup(level) + timeMedals.map((medal) => `
      <div class="reward-row compact">
        <span class="medal-text ${medal.key}">${medal.label}</span>
        <strong>${timeTarget(medal, trackIndex).toFixed(2)} s · ${medal.xp} Sprox</strong>
      </div>
    `).join("") + bestResult + possiblePartRewardMarkup();
    return;
  }
  if (level.type === "circuit") {
    el.campaignRewards.innerHTML = `${storyReputationRewardMarkup(level)}<div class="reward-row"><span>Win Reward</span><strong>${level.xp} Sprox</strong></div>${possiblePartRewardMarkup()}`;
    return;
  }
  if (level.type === "drag" || level.type === "pink-slip") {
    const safeReplay = level.type === "pink-slip" && !isPinkSlipRiskActive(level)
      ? `<div class="reward-row compact"><span>Pink Slip</span><strong>Reward already unlocked. Replay is safe.</strong></div>`
      : "";
    const riskRow = isPinkSlipRiskActive(level)
      ? `<div class="reward-row compact pink-risk-row"><span>Risk</span><strong>Lose: Level 1 reset and equipped parts taken.</strong></div>`
      : "";
    el.campaignRewards.innerHTML = `${storyReputationRewardMarkup(level)}<div class="reward-row"><span>Win Reward</span><strong>${level.drag.xp} Sprox</strong></div>${riskRow}${safeReplay}${possiblePartRewardMarkup()}`;
    return;
  }
  if (level.type === "battle") {
    const reward = battleRewardForBossIndex(level.bossIndex);
    el.campaignRewards.innerHTML = `${storyReputationRewardMarkup(level)}<div class="reward-row"><span>Win Reward</span><strong>${reward} Sprox</strong></div>${possiblePartRewardMarkup()}`;
    return;
  }
  if (level.type === "rival") {
    el.campaignRewards.innerHTML = `${storyReputationRewardMarkup(level)}<div class="reward-row"><span>Win Reward</span><strong>${level.xp} Sprox</strong></div>${possiblePartRewardMarkup()}`;
    return;
  }
  const boss = level.final ? finalBoss : bosses[level.bossIndex];
  el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${boss.xp} Sprox</strong></div>${possiblePartRewardMarkup()}`;
}

function storyReputationRewardMarkup(level) {
  const rep = storyLevelReputationValue(level);
  if (!rep) return "";
  const label = level.type === "rival" ? "Rival Race" : "Normal Race";
  return `<div class="reward-row compact"><span>${label}</span><strong>+${rep} Rep</strong></div>`;
}

function possiblePartRewardMarkup() {
  return `
    <div class="reward-row possible-part-reward">
      <span>Possible Reward</span>
      <strong>
        <span class="part-silhouette one-star"><i>?</i><em>★</em></span>
        <span class="part-silhouette two-star"><i>?</i><em>★★</em></span>
      </strong>
    </div>
  `;
}

function renderStoryLoadout() {
  const tuner = tuners.find((item) => item.id === state.selectedTuner) || tuners[0];
  const car = cars.find((item) => item.id === state.selectedStoryCar) || cars[0];
  const progress = state.garage[car.id];
  const form = currentEvolution(car.id);
  el.storyLoadout.innerHTML = `
    <div class="loadout-card">
      ${characterMarkup(tuner)}
      <div>
        <span>Tuner</span>
        <strong>${tuner.name}</strong>
      </div>
    </div>
    <div class="loadout-card">
      <div class="selection-preview-art">${carMarkupForEvolution(car.id, progress.evolution, "display")}</div>
      <div>
        <span>Vehicle</span>
        <strong>${form.name}</strong>
        <small>Level ${progress.level}</small>
      </div>
    </div>
  `;
}

function campaignLevelMeta(level, locked) {
  if (locked) return level.final ? "Play through the story to unlock the final boss." : "Finish the previous level to unlock.";
  if (level.type === "drag") return `${level.drag.rankKey} Class · ${level === campaignLevels[0] ? "400 m" : "800 m"}`;
  if (level.type === "pink-slip") return `${level.drag.rankKey} Class · ${level.drag.distance} m · Unlock ${level.drag.name}`;
  if (level.type === "trial") return `${level.track.city}, ${level.track.country}`;
  if (level.type === "circuit") return `${level.track.city}, ${level.track.country} · ${level.circuitMode === "race6" ? "Top 3" : "Top 2"}`;
  if (level.type === "battle") {
    const boss = bosses[level.bossIndex];
    return `${boss.name} · ${boss.car} · Arena`;
  }
  if (level.type === "rival") {
    const rival = rivalTuner();
    const mechanic = { drag: "Drag Race", bossVertical: "City Sprint", circuitDuel: "Head-to-Head Race", battle: "Battle Mode" }[level.mechanic] || "Rival Race";
    return `${rival.name} · ${mechanic}`;
  }
  return "";
}

function renderBosses() {
  el.bossList.innerHTML = bossChallengeBosses.map((boss, index) => {
    const active = boss.id === state.selectedBoss;
    const locked = index > state.highestBossIndex;
    return `
      <button class="boss-button ${active ? "active" : ""} ${locked ? "locked" : ""}" type="button" data-boss="${boss.id}" ${locked ? "disabled" : ""}>
        <strong>${index + 1}. ${boss.name}</strong>
        <small>${locked ? "Locked" : `${boss.track.city}, ${boss.track.country} · ${boss.car} · ${boss.xp} Sprox`}</small>
      </button>
    `;
  }).join("");
  const boss = bossChallengeBosses.find((item) => item.id === state.selectedBoss) || bossChallengeBosses[0];
  el.storyLocation.textContent = `${boss.track.city}, ${boss.track.country}`;
  applyTrackMap(el.storyTrack, boss.track);
  if (el.bossPreview) {
    el.bossPreview.innerHTML = `
      <div class="selection-preview-art">${characterMarkup({ name: boss.name, image: boss.portrait })}</div>
      <div>
        <strong>${boss.name}</strong>
        <small>${boss.car} · ${boss.track.city}, ${boss.track.country}</small>
      </div>
    `;
  }
}

function battleCarImageForBoss(boss) {
  const byCar = {
    Crusadome: "assets/cars/pope-crusadome-race.png",
    Baronessex: "assets/cars/german-baronessex-race.png",
    Shamacht: "assets/cars/whale-shamacht-race.png",
    Inflewenze: "assets/cars/peacock-inflewenze-race.png",
    Hurrdaboutis: "assets/cars/talkshow-hurrdaboutis-race.png",
    Matunnie: "assets/cars/rabbit-matunnie-race.png",
    Kuumbusta: "assets/cars/bok-kuumbusta-race.png",
    Kermajesty: "assets/cars/frog-kermajesty-race.png",
    Hornula1: "assets/cars/unicorn-hornula1-race.png"
  };
  return byCar[boss.car] || boss.carImage || "assets/cars/tutorque-race.png";
}

function bossCarDisplayImage(boss) {
  const byCar = {
    Crusadome: "assets/cars/pope-crusadome-display.png",
    Baronessex: "assets/cars/german-baronessex-display.png",
    Shamacht: "assets/cars/whale-shamacht-display.png",
    Inflewenze: "assets/cars/peacock-inflewenze-display.png",
    Hurrdaboutis: "assets/cars/talkshow-hurrdaboutis-display.png",
    Matunnie: "assets/cars/rabbit-matunnie-display.png",
    Kuumbusta: "assets/cars/bok-kuumbusta-display.png",
    Kermajesty: "assets/cars/frog-kermajesty-display.png",
    Hornula1: "assets/cars/unicorn-hornula1-display.png"
  };
  return byCar[boss.car] || "";
}

function renderBattles() {
  if (!el.battleList) return;
  if (tutorialActive() && currentTutorialScene().id === "battle") {
    el.battleList.innerHTML = `
      <button class="boss-button active" type="button" data-battle-boss="tutorial-tutorque">
        <strong>Tutorque</strong>
        <small>Training Car · Tutorial</small>
      </button>
    `;
    el.battlePreview.innerHTML = `
      <div class="selection-preview-art">${carMarkupForEvolution(tutorialOpponentCarId, 0, "display")}</div>
      <div>
        <strong>Tutorque</strong>
        <small>Training Car</small>
      </div>
    `;
    return;
  }
  el.battleList.innerHTML = bossChallengeBosses.map((boss, index) => {
    const active = boss.id === state.selectedBattleBoss;
    const locked = index > state.highestBossIndex;
    return `
      <button class="boss-button ${active ? "active" : ""} ${locked ? "locked" : ""}" type="button" data-battle-boss="${boss.id}" ${locked ? "disabled" : ""}>
        <strong>${index + 1}. ${boss.name}</strong>
        <small>${locked ? "Locked" : `${boss.car} · ${boss.xp} Sprox`}</small>
      </button>
    `;
  }).join("");
  const boss = bossChallengeBosses.find((item) => item.id === state.selectedBattleBoss) || bossChallengeBosses[0];
  el.battlePreview.innerHTML = `
    <div class="selection-preview-art">${characterMarkup({ name: boss.name, image: boss.headshot || boss.portrait })}</div>
    <div>
      <strong>${boss.name}</strong>
      <small>${boss.car}</small>
    </div>
  `;
}

function bossBattleStats(boss) {
  const raw = bossStatProfiles[slugify(boss.car)] || bossStatProfiles.hornula1;
  const scale = 0.82 + (bossChallengeBosses.findIndex((item) => item.id === boss.id) * 0.035);
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Math.min(100, Math.round(value * scale))]));
}

function battleProfileForCarId(carId, fallbackName = "") {
  const profile = gearbornStatProfiles[carId] || gearbornStatProfiles[slugify(fallbackName)] || {};
  return { type: profile.type || "Neutral", profile };
}

function battleStrongestStat(stats = {}) {
  const order = ["speed", "acceleration", "handling", "torque", "body", "powertrain"];
  return order.reduce((best, key) => (Number(stats[key] || 0) > Number(stats[best] || 0) ? key : best), order[0]);
}

function battleMovesetFor(stats = {}, type = "Neutral") {
  const normalizedType = String(type || "Neutral").toLowerCase();
  let middle = ["defend", "rev"];
  if (["endurance", "transmission"].includes(normalizedType)) {
    middle = ["defend", "rev"];
  } else if (["agility", "grip"].includes(normalizedType)) {
    middle = ["dodge", "sneak"];
  } else if ((Number(stats.acceleration || 0) + Number(stats.handling || 0)) > (Number(stats.torque || 0) + Number(stats.body || 0))) {
    middle = ["dodge", "sneak"];
  }
  return ["attack", ...middle, "special"];
}

function battleUnitFromStats(name, image, stats, isPlayer = false, carId = "", type = "Neutral") {
  const hpMax = Math.round(165 + stats.body * 3.2);
  return {
    name,
    image,
    stats,
    hp: hpMax,
    hpMax,
    sp: 0,
    shield: 0,
    shieldTurns: 0,
    dodgeBuffTurns: 0,
    stunned: false,
    revState: null,
    isPlayer,
    carId,
    type,
    moveset: battleMovesetFor(stats, type)
  };
}

function beginBattle(mode = "battle", options = {}) {
  clearRaceResultPopups();
  const boss = options.boss || bossChallengeBosses.find((item) => item.id === state.selectedBattleBoss) || bossChallengeBosses[0];
  playMusic(mode === "boss" || options.campaignLevelIndex !== null ? "boss-theme" : "battle-theme");
  const carId = options.carId || state.selectedStoryCar;
  const playerForm = currentEvolution(carId);
  const playerProfile = battleProfileForCarId(carId, playerForm.name);
  const player = battleUnitFromStats(playerForm.name, imageFor(playerForm, "race"), displayedGearbornStats(carId), true, carId, playerProfile.type);
  const opponentStats = options.tutorial
    ? displayedGearbornStatsAtLevel(tutorialOpponentCarId, 1)
    : options.opponentStats || bossBattleStats(boss);
  const opponentImage = options.tutorial ? "assets/cars/tutorque-race.png" : options.opponentImage || battleCarImageForBoss(boss);
  const opponentName = options.tutorial ? "Tutorque" : options.opponentName || boss.car;
  const opponentCarId = options.opponentCarId || (options.tutorial ? tutorialOpponentCarId : "");
  const opponentProfile = battleProfileForCarId(opponentCarId, opponentName || boss.car);
  battleState = {
    mode,
    boss,
    carId,
    player,
    opponent: battleUnitFromStats(opponentName, opponentImage, opponentStats, false, opponentCarId, opponentProfile.type),
    waitingNext: false,
    finished: false,
    campaignLevelIndex: options.campaignLevelIndex ?? null,
    reward: options.reward ?? null,
    rival: options.rival || null,
    gauntlet: options.gauntlet || null,
    tutorialPaused: Boolean(options.tutorialPaused),
    restartOptions: options
  };
  setFlowStep("battle", "race");
  renderBattle();
}

function battleAttackDamage(attacker) {
  return 26 + attacker.stats.speed * 0.16 + attacker.stats.acceleration * 0.2;
}

function battleMoveChance(unit, move) {
  if (move === "dodge") {
    const acc = Number(unit.stats.acceleration || 0) + (unit.dodgeBuffTurns > 0 ? 20 : 0);
    return Math.max(0.1, Math.min(0.9, 0.5 + (acc - 80) * 0.01));
  }
  if (move === "sneak") {
    return Math.max(0.05, Math.min(0.8, 0.35 + (Number(unit.stats.handling || 0) - 80) * 0.01));
  }
  return 0;
}

function battleShieldAbsorb(unit, damage) {
  if (!unit.shield || unit.shield <= 0 || damage <= 0) return damage;
  const absorbed = Math.min(unit.shield, damage);
  unit.shield = Math.max(0, unit.shield - absorbed);
  return Math.max(0, damage - absorbed);
}

function battleSpecialDamage(attacker) {
  return Math.max(8, Math.round(battleAttackDamage(attacker) * 1.8));
}

function battleResolveAttack(attacker, defender, attackMove, defendMove, logLines) {
  if (["defend", "dodge"].includes(attackMove)) return 0;
  if (attackMove === "sneak") {
    const success = Math.random() < battleMoveChance(attacker, "sneak");
    if (!success) {
      logLines.push(`${attacker.name} used SNEAK. Failed sneak.`);
      return 0;
    }
    logLines.push(`${attacker.name} used SNEAK. Successful sneak.`);
  }
  if (attackMove === "rev") {
    const mod = 0.85 + (Number(attacker.stats.torque || 0) - 80) * 0.005;
    logLines.push(`${attacker.name} REV fired!`);
    return Math.max(8, Math.round(2.5 * battleAttackDamage(attacker) * mod));
  }
  if (attackMove === "special") {
    return battleSpecialDamage(attacker);
  }
  return Math.max(8, Math.round(battleAttackDamage(attacker)));
}

function battleApplyDefense(defender, attacker, incomingMove, defenderMove, rawDamage, logLines) {
  if (rawDamage <= 0) return 0;
  if (defenderMove === "dodge") {
    if (Math.random() < battleMoveChance(defender, "dodge")) {
      logLines.push(`Successful dodge — ${defender.name} took no damage.`);
      return 0;
    }
    logLines.push(`Failed dodge — ${defender.name} took full damage.`);
  }
  if (defenderMove === "sneak") {
    if (Math.random() < battleMoveChance(defender, "sneak")) {
      const counter = Math.round(battleAttackDamage(defender) * 0.4);
      attacker.hp = Math.max(0, attacker.hp - counter);
      logLines.push(`Successful sneak — ${defender.name} avoided damage and countered for ${counter}.`);
      return 0;
    }
    logLines.push(`Failed sneak — ${defender.name} took full damage.`);
  }
  if (defenderMove === "defend" && (incomingMove === "attack" || incomingMove === "sneak")) {
    const reduced = rawDamage * (0.34 - normalizedGearbornStat(defender.stats.body) * 0.14);
    attacker.stunned = true;
    defender.sp = Math.min(4, defender.sp + 1);
    logLines.push(`Successful defense — ${attacker.name} is stunned.`);
    return Math.max(3, Math.round(reduced));
  }
  return Math.max(0, Math.round(rawDamage));
}

function chooseOpponentBattleMove() {
  const opponent = battleState.opponent;
  const player = battleState.player;
  if (opponent.stunned) return "stunned";
  if (opponent.revState === "loading") return "rev";
  const moves = opponent.moveset || ["attack", "defend", "special"];
  if (opponent.sp >= 4 && Math.random() < 0.7) return "special";
  if (moves.includes("rev") && opponent.hp > opponent.hpMax * 0.45 && 2.5 * battleAttackDamage(opponent) >= player.hp * 0.75 && Math.random() < 0.55) return "rev";
  if (moves.includes("dodge") && (opponent.hp < opponent.hpMax * 0.35 || player.sp >= 4) && Math.random() < 0.58) return "dodge";
  if (moves.includes("sneak") && opponent.hp < opponent.hpMax * 0.8 && Math.random() < 0.28) return "sneak";
  if (moves.includes("defend") && opponent.hp < opponent.hpMax * 0.4 && Math.random() < 0.4) return "defend";
  return Math.random() < 0.72 ? "attack" : (moves.includes("sneak") ? "sneak" : moves.includes("rev") ? "rev" : "defend");
}

function battleMoveLabel(move) {
  return {
    attack: "ATTACK",
    defend: "DEFEND",
    dodge: "DODGE",
    sneak: "SNEAK",
    rev: "REV",
    special: "SPECIAL",
    stunned: "STUNNED"
  }[move] || move;
}

function battleMoveIcon(move) {
  return {
    attack: "assets/items/battle-attack.png",
    defend: "assets/items/battle-defend.png",
    dodge: "assets/items/battle-dodge.png",
    sneak: "assets/items/battle-sneak.png",
    rev: "assets/items/battle-rev.png",
    special: "assets/items/battle-special.png"
  }[move] || "";
}

function handleBattleMove(playerMove) {
  if (!battleState || battleState.finished || battleState.waitingNext) return;
  if (battleState.tutorialPaused) return;
  const player = battleState.player;
  const opponent = battleState.opponent;
  const playerWasStunned = player.stunned;
  const forcedRevFire = player.revState === "loading" && playerMove === "rev";
  if (!playerWasStunned && !forcedRevFire && !(player.moveset || []).includes(playerMove)) return;
  if (!playerWasStunned && playerMove === "special" && player.sp < 4) return;
  const playerAction = playerWasStunned ? "stunned" : player.revState === "loading" ? "rev" : playerMove;
  const opponentMove = chooseOpponentBattleMove();
  const opponentWasStunned = opponentMove === "stunned";
  const logLines = [];
  const playerRevWasLoading = player.revState === "loading";
  const opponentRevWasLoading = opponent.revState === "loading";

  player.stunned = false;
  opponent.stunned = false;

  if (playerAction === "rev" && player.revState !== "loading") {
    player.revState = "loading";
    logLines.push(`${player.name} is revving up...`);
  }
  if (opponentMove === "rev" && opponent.revState !== "loading") {
    opponent.revState = "loading";
    logLines.push(`${opponent.name} is revving up...`);
  }

  const playerFires = playerAction !== "stunned" && (playerAction !== "rev" || playerRevWasLoading);
  const opponentFires = opponentMove !== "stunned" && (opponentMove !== "rev" || opponentRevWasLoading);
  const playerAttackMove = playerAction;
  const opponentAttackMove = opponentMove;

  let opponentDamage = playerFires ? battleResolveAttack(player, opponent, playerAttackMove, opponentMove, logLines) : 0;
  let playerDamage = opponentFires ? battleResolveAttack(opponent, player, opponentAttackMove, playerAction, logLines) : 0;

  opponentDamage = battleApplyDefense(opponent, player, playerAttackMove, opponentMove, opponentDamage, logLines);
  playerDamage = battleApplyDefense(player, opponent, opponentAttackMove, playerAction, playerDamage, logLines);
  playerDamage = battleShieldAbsorb(player, playerDamage);
  opponentDamage = battleShieldAbsorb(opponent, opponentDamage);
  if (playerAction === "special") logLines.push(`You used SPECIAL, ${opponent.name} took ${opponentDamage} damage.`);
  if (opponentMove === "special") logLines.push(`${opponent.name} used SPECIAL, you took ${playerDamage} damage.`);
  if (playerAction === "special" || opponentMove === "special") playSound("battle-special");
  if (opponentDamage > 0 || playerDamage > 0) playSound("battle-hit");
  if (logLines.some((line) => line.includes("Successful dodge") || line.includes("Successful sneak"))) playSound("battle-dodge");
  if (logLines.some((line) => line.includes("is stunned"))) playSound("battle-stun");

  player.hp = Math.max(0, player.hp - playerDamage);
  opponent.hp = Math.max(0, opponent.hp - opponentDamage);
  if (playerAction === "special") player.sp = 0;
  if (opponentMove === "special") opponent.sp = 0;
  if (["attack", "sneak", "rev"].includes(playerAttackMove) && opponentDamage > 0) player.sp = Math.min(4, player.sp + 1);
  if (["attack", "sneak", "rev"].includes(opponentAttackMove) && playerDamage > 0) opponent.sp = Math.min(4, opponent.sp + 1);
  if (playerRevWasLoading && playerAction === "rev" && playerFires) player.revState = null;
  if (opponentRevWasLoading && opponentMove === "rev" && opponentFires) opponent.revState = null;
  [player, opponent].forEach((unit) => {
    if (unit.dodgeBuffTurns > 0) unit.dodgeBuffTurns -= 1;
    if (unit.shieldTurns > 0) unit.shieldTurns -= 1;
    if (unit.shieldTurns <= 0) unit.shield = 0;
  });
  if (player.hp <= 0 || opponent.hp <= 0) {
    battleState.waitingNext = false;
    el.battleArena.classList.remove("resolving");
    finishBattle();
    return;
  }
  battleState.waitingNext = true;
  el.battleArena.classList.add("resolving");
  const moveSucceeded = (unit, move, revWasLoading) => {
    if (move === "stunned") return false;
    if (move === "rev") return revWasLoading;
    if (move === "dodge") return logLines.some((line) => line.includes(`Successful dodge`) && line.includes(unit.name));
    if (move === "sneak") return logLines.some((line) => line.includes(`Successful sneak`) && line.includes(unit.name));
    return true;
  };
  const showPlayerMove = moveSucceeded(player, playerAction, playerRevWasLoading);
  const showOpponentMove = moveSucceeded(opponent, opponentMove, opponentRevWasLoading);
  el.battlePlayerMove.style.backgroundImage = showPlayerMove ? `url("${battleMoveIcon(playerAction)}")` : "";
  el.battleOpponentMove.style.backgroundImage = showOpponentMove ? `url("${battleMoveIcon(opponentMove)}")` : "";
  el.battlePlayerMove.classList.toggle("active", showPlayerMove);
  el.battleOpponentMove.classList.toggle("active", showOpponentMove);
  if (playerWasStunned) {
    el.battleLog.textContent = `${player.name} is stunned and can't attack.`;
  } else if (opponentWasStunned) {
    el.battleLog.textContent = `${opponent.name} is stunned and can't attack.`;
  } else {
    el.battleLog.textContent = logLines.length
      ? logLines.join(" ")
      : `${player.name} used ${battleMoveLabel(playerAction)}. ${opponent.name} used ${battleMoveLabel(opponentMove)}.`;
  }
  renderBattle();
}

function nextBattleTurn() {
  if (!battleState || battleState.finished) return;
  battleState.waitingNext = false;
  el.battleArena.classList.remove("resolving");
  el.battlePlayerMove.classList.remove("active");
  el.battleOpponentMove.classList.remove("active");
  el.battleLog.textContent = "Choose a move.";
  renderBattle();
  if (battleState.player?.revState === "loading") {
    el.battleLog.textContent = "REV firing...";
    setTimeout(() => handleBattleMove("rev"), 360);
  }
}

function finishBattle() {
  battleState.finished = true;
  const won = battleState.opponent.hp <= 0 && battleState.player.hp > 0;
  playSound(won ? "win-jingle" : "lose-jingle");
  const index = bossChallengeBosses.findIndex((boss) => boss.id === battleState.boss.id);
  const isGauntlet = Boolean(battleState.gauntlet);
  const earned = isGauntlet ? 0 : tutorialActive() && !won ? 0 : won ? (battleState.reward ?? battleRewardForBossIndex(index)) : Math.round(35 + Math.max(0, index) * 18);
  addSprox(earned);
  recordRaceUsage(battleState.carId);
  const partReward = won && !isGauntlet && battleState.campaignLevelIndex !== null ? rollStoryPartReward() : null;
  recordStoryRaceOutcome(won, battleState.campaignLevelIndex !== null);
  let unlockedBossName = "";
  if (won && battleState.mode === "battle") {
    unlockedBossName = unlockNextTrainingBossFromBoss(battleState.boss.id);
  }
  if (tutorialActive() && won) setTutorialScene("battle-win");
  const level = battleState.campaignLevelIndex !== null ? campaignLevels[battleState.campaignLevelIndex] : null;
  const rankChange = won && !tutorialActive() && !isGauntlet && level?.type === "boss"
    ? advanceTunerRankForBossWin(battleState.boss.id)
    : null;
  if (won && battleState.campaignLevelIndex !== null) completeCampaignLevel(battleState.campaignLevelIndex);
  saveState();
  if (tutorialActive() && won) renderTutorial();
  showRaceResult(el.battleArena, {
    won,
    title: tutorialActive() && !won ? "RACE LOST" : undefined,
    sprox: earned,
    lines: [unlockedBossName ? `Boss Unlocked: ${unlockedBossName}` : "", partReward ? partRewardResultMarkup(partReward) : ""].filter(Boolean),
    hideRaceAgain: tutorialActive() && !won,
    hideSprox: tutorialActive() && !won,
    disableActions: tutorialActive() && won,
    primaryLabel: isGauntlet ? "Next" : tutorialActive() && !won ? "Try Again" : tutorialActive() ? "Next" : battleState.campaignLevelIndex !== null ? "Next" : "Select Opponent",
    primaryTone: tutorialActive() && won ? "success" : "",
    raceAgainLabel: "Battle Again",
    onPrimary: () => {
      if (tutorialActive() && !won) {
        beginBattle("tutorial-battle", { tutorial: true, boss: bosses[0] });
        return;
      }
      if (tutorialActive()) {
        advanceTutorial();
        return;
      }
      if (isGauntlet) {
        completeGauntletStage(won);
        finishStoryRaceScreen();
        return;
      }
      if (battleState.campaignLevelIndex !== null) {
        if (rankChange) {
          showTunerRankRisePopup(rankChange, () => {
            if (won && level?.type === "rival") {
              openRivalDialogue(level, "post", finishStoryRaceScreen);
              return;
            }
            finishStoryRaceScreen();
          });
          return;
        }
        if (won && level?.type === "rival") {
          openRivalDialogue(level, "post", finishStoryRaceScreen);
          return;
        }
        finishStoryRaceScreen();
      } else {
        battleState = null;
        setFlowStep("battle", "match");
      }
    },
    onRaceAgain: () => beginBattle(battleState.mode, battleState.restartOptions || { boss: battleState.boss, campaignLevelIndex: battleState.campaignLevelIndex })
  });
}

function renderBattle() {
  if (!battleState || !el.battleArena) return;
  const { player, opponent } = battleState;
  el.battlePlayerName.textContent = player.name;
  el.battleOpponentName.textContent = opponent.name;
  el.battlePlayerHp.textContent = `${player.hp}/${player.hpMax}`;
  el.battleOpponentHp.textContent = `${opponent.hp}/${opponent.hpMax}`;
  el.battlePlayerHpFill.style.width = `${Math.max(0, player.hp / player.hpMax) * 100}%`;
  el.battleOpponentHpFill.style.width = `${Math.max(0, opponent.hp / opponent.hpMax) * 100}%`;
  el.battlePlayerSp.textContent = `${player.sp}/4${player.shield ? ` · Shield ${player.shield}` : ""}`;
  el.battleOpponentSp.textContent = `${opponent.sp}/4${opponent.shield ? ` · Shield ${opponent.shield}` : ""}`;
  el.battlePlayerSpFill.style.width = `${player.sp / 4 * 100}%`;
  el.battleOpponentSpFill.style.width = `${opponent.sp / 4 * 100}%`;
  el.battlePlayerCar.style.backgroundImage = `url("${player.image}")`;
  el.battleOpponentCar.style.backgroundImage = `url("${opponent.image}")`;
  el.battleNextTurn.hidden = !battleState.waitingNext || battleState.finished;
  const locked = Boolean(player.stunned || player.revState === "loading");
  const moves = player.moveset || ["attack", "defend", "special"];
  el.battleActions.innerHTML = moves.map((move) => {
    const disabled = battleState.tutorialPaused || battleState.waitingNext || battleState.finished || locked || (move === "special" && player.sp < 4);
    const label = locked && player.revState === "loading" ? "REV LOADING" : battleMoveLabel(move);
    return `
      <button class="battle-action ${move} ${locked ? "locked-turn" : ""}" data-battle-move="${move}" type="button" ${disabled ? "disabled" : ""} title="${battleMoveLabel(move)}">
        <img src="${battleMoveIcon(move)}" alt="" onerror="this.style.display='none'">
        ${label}
      </button>
    `;
  }).join("");
}

function renderTimeTargets() {
  if (tutorialActive() && currentTutorialScene().id === "head2head") {
    el.timeLocation.textContent = `${tutorialTrack.city}, ${tutorialTrack.country}`;
    applyTrackMap(el.timeTrialTrack, tutorialTrack);
    el.timeTargets.innerHTML = tutorialMedals.map((medal) => `
      <div><span><span class="medal-text ${medal.key}">${medal.label}</span> · ${medal.difficulty}</span><strong>${medal.base.toFixed(2)} s · ${medal.xp} Sprox</strong></div>
    `).join("");
    return;
  }
  const trackIndex = storyTracks.findIndex((track) => track.id === state.selectedTimeTrack);
  const best = state.timeTrials[state.selectedTimeTrack]?.bestTime;
  el.timeLocation.textContent = trackLabel(state.selectedTimeTrack);
  applyTrackMap(el.timeTrialTrack, storyTracks.find((track) => track.id === state.selectedTimeTrack));
  el.timeTargets.innerHTML = timeMedals.map((medal) => {
    const target = timeTarget(medal, trackIndex);
    return `<div><span><span class="medal-text ${medal.key}">${medal.label}</span> · ${medal.difficulty}</span><strong>${target.toFixed(2)} s · ${medal.xp} Sprox</strong></div>`;
  }).join("") + `<div><span>Phantaxi Time</span><strong>${best ? `${best.toFixed(2)} s` : "No Phantaxi Time"}</strong></div>`;
}

function renderTimeTrackGrid() {
  if (!el.timeTrackGrid) return;
  if (tutorialActive() && currentTutorialScene().id === "head2head") {
    el.timeTrackGrid.innerHTML = `
      <button class="map-button active" type="button" data-time-track="${tutorialTrack.id}">
        ${tutorialTrack.city}
      </button>
    `;
    if (el.timeTrackPreview) {
      el.timeTrackPreview.style.backgroundImage = `linear-gradient(90deg, transparent 0 8%, rgba(255, 255, 255, 0.16) 8% 8.5%, transparent 8.5% 91.5%, rgba(255, 255, 255, 0.16) 91.5% 92%, transparent 92%), url("${tutorialTrack.map}")`;
    }
    return;
  }
  el.timeTrackGrid.innerHTML = storyTracks.map((track) => `
    <button class="map-button ${track.id === state.selectedTimeTrack ? "active" : ""}" type="button" data-time-track="${track.id}">
      ${track.city}
    </button>
  `).join("");
  const track = storyTracks.find((item) => item.id === state.selectedTimeTrack);
  if (el.timeTrackPreview) {
    el.timeTrackPreview.style.backgroundImage = track?.map
      ? `linear-gradient(90deg, transparent 0 8%, rgba(255, 255, 255, 0.16) 8% 8.5%, transparent 8.5% 91.5%, rgba(255, 255, 255, 0.16) 91.5% 92%, transparent 92%), url("${track.map}")`
      : "";
  }
}

function getVindexClass(entry) {
  return vindexClassByNumber[entry?.number] || "";
}

function getVindexType(entry) {
  const playable = playableEntryMeta(entry);
  if (playable) return gearbornStatProfiles[playable.car.id]?.type || "";
  return oneOffTypeMeta[entry?.name]?.type || "";
}

function getClassStamp(classLetter) {
  return classLetter ? `assets/vindex/stamp-${String(classLetter).toLowerCase()}.png` : "";
}

function getTypeTile(typeLabel) {
  return typeLabel ? `assets/vindex/type-${slugify(typeLabel)}.png` : "";
}

const licensePlateOverrides = {
  tourquette: "assets/license/license-torquette.png"
};

function getLicensePlate(entry) {
  if (!entry) return "";
  const slug = slugify(entry.name);
  return licensePlateOverrides[slug] || `assets/license/license-${slug}.png`;
}

function getPlateCode(entry) {
  if (!entry) return "???-000";
  const prefix = String(entry.name || "GB").replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  return `${prefix}-${String(entry.number || "000").padStart(3, "0")}`;
}

function getStatus(entry) {
  if (!entry || !isVindexDiscovered(entry)) return "locked";
  return isVindexOwned(entry) ? "owned" : "seen";
}

function isVindexOwned(entry) {
  const playable = playableEntryMeta(entry);
  if (!playable) return false;
  if ([tutorialCarId, tutorialOpponentCarId].includes(playable.car.id)) return state.tutorialComplete || tutorialActive();
  if (playable.car.id === "art-van") return isCarUnlocked("art-van") && (state.unlockedArtVanForms || []).includes(playable.index);
  return isCarUnlocked(playable.car.id) && unlockedEvolutionIndex(playable.car.id) >= playable.index;
}

function vindexEntriesForFilter() {
  const filter = state.vindexFilter || "all";
  return vindexEntries.filter((entry) => {
    const status = getStatus(entry);
    if (filter === "owned") return status === "owned";
    if (filter === "seen") return status === "owned" || status === "seen";
    return true;
  });
}

function vindexProgressCounts() {
  const total = vindexEntries.length;
  const owned = vindexEntries.filter((entry) => getStatus(entry) === "owned").length;
  const seen = vindexEntries.filter((entry) => ["owned", "seen"].includes(getStatus(entry))).length;
  return { total, owned, seen, locked: Math.max(0, total - seen) };
}

function vindexPlateMarkup(entry, discovered) {
  if (!discovered) return "";
  const code = getPlateCode(entry);
  return `
    <div class="vindex-license-plate">
      <img src="${getLicensePlate(entry)}" alt="${entry.name} license plate" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
      <span hidden>${code}</span>
    </div>
  `;
}

function licensePlateMarkupForName(name, number = "000", className = "garage-license-plate") {
  const entry = { name, number };
  return `
    <div class="${className}">
      <img src="${getLicensePlate(entry)}" alt="${name} license plate" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
      <span hidden>${getPlateCode(entry)}</span>
    </div>
  `;
}

function gearbornClassTypeBadgesForForm(formName) {
  const entry = vindexEntries.find((item) => item.name === formName);
  if (!entry) return "";
  const classLetter = getVindexClass(entry);
  const typeLabel = getVindexType(entry);
  const typeTile = getTypeTile(typeLabel);
  return `
    <div class="garage-class-type-badges" aria-label="Class and type">
      <span class="garage-class-badge">
        ${classLetter ? `<img src="${getClassStamp(classLetter)}" alt="Class ${classLetter}" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('strong'),{textContent:'${classLetter}'}))">` : `<strong>-</strong>`}
      </span>
      <span class="garage-type-badge">
        ${typeTile ? `<img src="${typeTile}" alt="${typeLabel} type" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('strong'),{textContent:'${typeLabel}'}))">` : `<strong>Type TBD</strong>`}
      </span>
    </div>
  `;
}

function vindexListRowMarkup(entry) {
  const status = getStatus(entry);
  const discovered = status !== "locked";
  return `
    <button class="vindex-button ${entry.number === state.selectedVindex ? "active" : ""} status-${status}" type="button" data-vindex="${entry.number}">
      <span class="vindex-row-number">#${discovered ? entry.number : "???"}</span>
      <strong>${discovered ? entry.name : "???"}</strong>
    </button>
  `;
}

function renderVindex() {
  const entries = vindexEntriesForFilter();
  if (!entries.some((entry) => entry.number === state.selectedVindex)) {
    state.selectedVindex = entries[0]?.number || vindexEntries[0].number;
  }
  el.vindexList.innerHTML = entries.length ? entries.map(vindexListRowMarkup).join("") : `<p class="empty-note">No GearBorn match this filter.</p>`;
  el.vindexFilterButtons?.querySelectorAll("[data-vindex-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.vindexFilter === (state.vindexFilter || "all"));
  });
  const counts = vindexProgressCounts();
  if (el.vindexProgress) {
    el.vindexProgress.innerHTML = `
      <p><span>Owned</span><strong>${counts.owned} / ${counts.total}</strong></p>
      <p><span>Seen</span><strong>${counts.seen} / ${counts.total}</strong></p>
      <p><span>Locked</span><strong>${counts.locked} / ${counts.total}</strong></p>
    `;
  }
  const entry = vindexEntries.find((item) => item.number === state.selectedVindex) || vindexEntries[0];
  const status = getStatus(entry);
  const discovered = status !== "locked";
  const classLetter = getVindexClass(entry);
  const typeLabel = getVindexType(entry);
  el.vindexArt.innerHTML = `
    ${discovered ? displayMarkup(entry.image, entry.name, "#52c7ff") : silhouetteMarkup()}
    ${discovered ? honkButtonMarkup(`data-honk-vindex="${entry.number}"`) : ""}
  `;
  el.vindexNumber.textContent = discovered ? `#${entry.number}` : "#???";
  el.vindexName.textContent = discovered ? entry.name : "???";
  el.vindexLine.textContent = discovered ? entry.line : "Mystery GearBorn";
  if (el.vindexStatus) {
    el.vindexStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    el.vindexStatus.className = `status-${status}`;
  }
  if (el.vindexClassStamp) {
    const stamp = discovered ? getClassStamp(classLetter) : "";
    el.vindexClassStamp.hidden = !stamp;
    if (stamp) {
      el.vindexClassStamp.src = stamp;
      el.vindexClassStamp.alt = `Class ${classLetter}`;
    }
  }
  if (el.vindexTypeStamp) {
    const typeStamp = discovered ? getTypeTile(typeLabel) : "";
    el.vindexTypeStamp.hidden = !typeStamp;
    if (typeStamp) {
      el.vindexTypeStamp.src = typeStamp;
      el.vindexTypeStamp.alt = `${typeLabel} type`;
    }
  }
  if (el.vindexPlate) el.vindexPlate.innerHTML = vindexPlateMarkup(entry, discovered);
  renderVindexMemories(entry, discovered);
}

function renderVindexMemories(entry, discovered) {
  if (!el.vindexMemoriesButton || !el.vindexMemoriesPanel) return;
  const playable = playableEntryMeta(entry);
  el.vindexMemoriesButton.hidden = !discovered || !playable;
  el.vindexMemoriesButton.setAttribute("aria-expanded", "false");
  el.vindexMemoriesPanel.hidden = true;
  if (!playable) {
    el.vindexMemoriesPanel.innerHTML = "";
    return;
  }
  const lineRoot = playable.car.id;
  const bondLevel = bondLevelForLine(lineRoot);
  el.vindexMemoriesPanel.innerHTML = bondSceneThresholds.map((threshold) => {
    const sceneId = `${lineRoot}-bond-${threshold}`;
    const unlocked = Boolean(state.bondScenesViewed?.[sceneId]) || bondLevel >= threshold;
    return `
      <button class="vindex-memory-row ${unlocked ? "unlocked" : "locked"}" type="button" data-vindex-memory="${lineRoot}:${threshold}" ${unlocked ? "" : "disabled"}>
        <span>Bond ${threshold}</span>
        <strong>${unlocked ? (bondScenes[lineRoot]?.[threshold]?.title || "Memory") : `Bond ${threshold} required`}</strong>
      </button>
    `;
  }).join("");
}

function toggleVindexMemories() {
  if (!el.vindexMemoriesPanel) return;
  const isOpening = el.vindexMemoriesPanel.hidden;
  el.vindexMemoriesPanel.hidden = !isOpening;
  el.vindexMemoriesButton?.setAttribute("aria-expanded", String(isOpening));
}

function replayBondScene(lineRoot, threshold) {
  activeBondScene = { lineRoot, threshold: Number(threshold), sceneId: `${lineRoot}-bond-${threshold}` };
  renderBondScene();
}

function playableEntryMeta(entry) {
  for (const car of cars) {
    const index = car.evolutions.findIndex((evolution) => evolution.name === entry.name);
    if (index >= 0) return { car, index };
  }
  return null;
}

function playVindexEntryHonk(entryNumber) {
  const entry = vindexEntries.find((item) => item.number === entryNumber);
  if (!entry || !isVindexDiscovered(entry)) return;
  const playable = playableEntryMeta(entry);
  if (playable) {
    openHonkModal(playable.car.id, playable.index);
    return;
  }
  openHonkModalForKey(slugify(entry.name || `vindex-${entryNumber}`), selectedCarIdForMode("drag"));
}

const oneOffEvolutionMeta = {
  Bananachi: { line: "Monkey Line", position: 0, total: 3 },
  Manstrocity: { line: "Armadillo Dad Line", position: 2, total: 3 },
  Beardo: { line: "Rides Hair Line", position: 1, total: 3 },
  Phantaxi: { line: "Ghost Taxi Line", position: 1, total: 2 },
  Inflewenze: { line: "Influencer Line", position: 2, total: 3 },
  Sponsore: { line: "Bumper Sticker Line", position: 1, total: 2 },
  Baronessex: { line: "German Discipline Line", position: 1, total: 2 },
  Crusadome: { line: "Crusader Line", position: 1, total: 2 },
  Kuumbusta: { line: "Combustion Line", position: 2, total: 3 },
  Hurrdaboutis: { line: "Roundabout Line", position: 1, total: 2 },
  RitzCarloadin: { line: "Hotel Towtel Line", position: 2, total: 3 }
};

const oneOffTypeMeta = {
  RitzCarloadin: { type: "Endurance", playstyle: "Longhaul Lugger" }
};

function isVindexDiscovered(entry) {
  if (state.unlimitedSprox) return true;
  if (entry?.name === "RitzCarloadin") return true;
  const playable = playableEntryMeta(entry);
  if (playable) {
    if ([tutorialCarId, tutorialOpponentCarId].includes(playable.car.id)) {
      return state.tutorialComplete || tutorialActive();
    }
    if (playable.car.id === "art-van") {
      return isCarUnlocked("art-van") && (state.unlockedArtVanForms || []).includes(playable.index);
    }
    return isCarUnlocked(playable.car.id) && unlockedEvolutionIndex(playable.car.id) >= playable.index;
  }
  const rankIndex = ranks.findIndex((rank) => rank.name === entry.name);
  if (rankIndex >= 0) return state.highestRankIndex >= rankIndex;
  const bossIndex = bossChallengeBosses.findIndex((boss) => boss.car === entry.name);
  if (bossIndex >= 0) return state.highestBossIndex >= bossIndex;
  if (entry.name === "Phantaxi") return Object.keys(state.timeTrials || {}).length > 0;
  return false;
}

function silhouetteMarkup() {
  return `
    <div class="silhouette-card">
      <div class="silhouette-car">?</div>
    </div>
  `;
}

function evolutionLineMarkup(entry) {
  const playable = playableEntryMeta(entry);
  let items = [];
  if (playable) {
    if (playable.car.id === tutorialCarId) {
      items = [
        { name: "????", image: "", discovered: false },
        { name: "Mamburn", image: "assets/cars/snake-mamburn-display.png", discovered: state.tutorialComplete || tutorialActive() },
        { name: "Snaytan", image: "assets/cars/snake-snaytan-display.png", discovered: state.tutorialComplete || tutorialActive() }
      ];
    } else {
      items = playable.car.evolutions.map((evolution, index) => ({
        name: evolution.name,
        image: imageFor(evolution, "display"),
        discovered: playable.car.id === "art-van"
          ? isCarUnlocked("art-van") && (state.unlockedArtVanForms || []).includes(index)
          : playable.car.id === tutorialOpponentCarId
          ? (state.tutorialComplete || tutorialActive())
          : isCarUnlocked(playable.car.id) && unlockedEvolutionIndex(playable.car.id) >= index
      }));
    }
  } else {
    const meta = oneOffEvolutionMeta[entry.name];
    if (!meta) return "";
    items = Array.from({ length: meta.total }, (_, index) => ({
      name: index === meta.position ? entry.name : "????",
      image: index === meta.position ? entry.image : "",
      discovered: index === meta.position && isVindexDiscovered(entry)
    }));
  }
  return `
    <div class="vindex-evolution-line">
      ${items.map((item, index) => `
        ${index ? `<span class="evolution-arrow">→</span>` : ""}
        <div class="vindex-evolution-card">
          <div class="selection-preview-art">
            ${item.discovered ? displayMarkup(item.image, item.name, "#52c7ff") : silhouetteMarkup()}
          </div>
          <strong>${item.discovered ? item.name : "????"}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function characterMarkup(character) {
  const initials = character.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return `
    <div class="character-frame">
      <img src="${character.image}" alt="${character.name}" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('placeholder'); this.remove();">
      <span>${initials}</span>
    </div>
  `;
}

function renderProfiles() {
  el.profileList.innerHTML = racerProfiles.map((profile) => `
    <button class="vindex-button ${profile.id === state.selectedProfile ? "active" : ""}" type="button" data-profile="${profile.id}">
      <span>${profile.category || (profile.car ? "Boss" : "Tuner")}</span>
      <strong>${profile.name}</strong>
    </button>
  `).join("");
  const profile = racerProfiles.find((item) => item.id === state.selectedProfile) || racerProfiles[0];
  const displayProfile = profile.id === "racer-alpha" && state.racerAlphaProfileView !== "unmasked"
    ? { ...profile, image: finalBoss.headshot || finalBoss.portrait }
    : { ...profile, image: profile.headshot || profile.image };
  el.profileArt.innerHTML = characterMarkup(displayProfile) + racerAlphaProfileToggle(profile);
  el.profileName.textContent = profile.name;
  el.profileMeta.textContent = profile.category === "Other"
    ? (profile.title || (profile.car && profile.car !== "Other" ? `${profile.car} · ${profile.city}` : "Other"))
    : profile.car ? `${profile.car} · ${profile.city}, ${profile.country}` : "Story Tuner";
  const boss = bossChallengeBosses.find((item) => item.id === profile.id);
  const profileCarImage = boss ? bossCarDisplayImage(boss) : profile.carImage;
  el.profileCarArt.innerHTML = profileCarImage ? `<img src="${profileCarImage}" alt="${profile.car}" loading="lazy" decoding="async">` : "";
  el.profileBio.textContent = profile.bio;
}

function achievementRewardArt(achievement) {
  if (achievementIsSecretHidden(achievement)) return `<div class="achievement-trophy secret">?</div>`;
  if (achievement.id === "garbageMedallion") return carMarkupForEvolution("waste-management", 0, "display");
  const artFormIndex = artVanUnlockByAchievement[achievement.id];
  if (Number.isInteger(artFormIndex)) {
    const form = cars.find((car) => car.id === "art-van")?.evolutions[artFormIndex];
    return form ? carMarkupForEvolution("art-van", artFormIndex, "display") : silhouetteMarkup();
  }
  if (achievement.id === "vindex50") return carMarkupForEvolution("cake-train", 0, "display");
  if (achievement.id === "vindex75") return `<div class="achievement-reward-parts">${partTypes.slice(0, 3).map((part) => partImageMarkup({ ...part, level: 2, bonus: 3, stars: "★★" }, "achievement-part-image")).join("")}</div>`;
  if (achievement.id === "vindex25" || achievement.sprox || /sprox/i.test(achievement.reward || "")) return `<span class="achievement-sprox-preview sprox-coin" aria-label="Sprox reward"></span>`;
  return `<div class="achievement-trophy">★</div>`;
}

function renderAchievements() {
  if (!el.achievementList || !el.achievementDetail) return;
  if (checkAchievements(true)) saveState();
  const selected = achievementDefs.find((achievement) => achievement.id === state.selectedAchievement) || achievementDefs[0];
  el.achievementList.innerHTML = achievementDefs.map((achievement) => {
    const progress = achievementProgress(achievement);
    const record = state.achievements[achievement.id] || {};
    const hiddenSecret = achievementIsSecretHidden(achievement);
    return `
      <button class="achievement-card ${achievement.id === selected.id ? "active" : ""} ${record.complete ? "complete" : ""} ${hiddenSecret ? "secret" : ""}" type="button" data-achievement="${achievement.id}">
        <span class="achievement-card-copy">
          <strong>${hiddenSecret ? "Secret Achievement" : achievement.name}</strong>
          <small>${hiddenSecret ? "Unlock this achievement to reveal its condition." : achievement.requirement}</small>
          <em>${hiddenSecret ? "Mystery reward" : record.granted ? "Reward unlocked" : achievement.reward}</em>
        </span>
        <span class="achievement-progress">
          <strong>${hiddenSecret ? "???" : record.complete ? "Complete" : `${progress.percent}%`}</strong>
          <small>${hiddenSecret ? "Secret" : progress.label}</small>
        </span>
      </button>
    `;
  }).join("");
  const progress = achievementProgress(selected);
  const record = state.achievements[selected.id] || {};
  const hiddenSecret = achievementIsSecretHidden(selected);
  el.achievementDetail.innerHTML = `
    <div class="achievement-detail-art">${achievementRewardArt(selected)}</div>
    <p class="achievement-kicker">${hiddenSecret ? "Secret" : record.complete ? "Unlocked" : "In Progress"}</p>
    <h2>${hiddenSecret ? "Secret Achievement" : selected.name}</h2>
    <p>${hiddenSecret ? "Unlock this achievement to reveal its condition." : selected.requirement}</p>
    <div class="achievement-meter" aria-label="${hiddenSecret ? 0 : progress.percent}% complete">
      <i style="width:${hiddenSecret ? 0 : Math.min(100, progress.percent)}%"></i>
    </div>
    <div class="achievement-detail-grid">
      <span>Progress</span><strong>${hiddenSecret ? "Secret" : progress.label}</strong>
      <span>Reward</span><strong>${hiddenSecret ? "Mystery reward" : selected.reward}</strong>
      <span>Status</span><strong>${record.complete ? "Complete" : "Incomplete"}</strong>
    </div>
  `;
}

function racerAlphaProfileToggle(profile) {
  if (profile.id !== "racer-alpha" || !state.racerAlphaUnmasked) return "";
  return `
    <div class="profile-toggle" aria-label="Racer Alpha mask toggle">
      <button class="${state.racerAlphaProfileView === "masked" ? "active" : ""}" type="button" data-alpha-view="masked">Masked</button>
      <button class="${state.racerAlphaProfileView === "unmasked" ? "active" : ""}" type="button" data-alpha-view="unmasked">Unmasked</button>
    </div>
  `;
}

function renderTuners() {
  const markup = tuners.map((tuner) => `
    <button class="tuner-card ${state.selectedTuner === tuner.id ? "active" : ""}" type="button" data-tuner="${tuner.id}">
      ${characterMarkup({ ...tuner, image: tuner.headshot || tuner.image })}
      <strong>${tuner.name}</strong>
    </button>
  `).join("");
  el.tunerOptions.innerHTML = markup;
  el.settingsTunerOptions.innerHTML = markup;
}

function renderDistanceOptions() {
  if (tutorialActive() && currentTutorialScene().id === "drag-race") {
    el.distanceOptions.innerHTML = `
      <button type="button" class="active" data-distance="400">
        400 m
      </button>
    `;
    return;
  }
  el.distanceOptions.innerHTML = distances.map((distance) => `
    <button type="button" class="${state.selectedDistance === distance.meters ? "active" : ""}" data-distance="${distance.meters}">
      ${distance.label}
    </button>
  `).join("");
}

function renderOpponents() {
  el.dragOpponentCount?.querySelectorAll("[data-drag-opponents]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.dragOpponents) === (state.selectedDragOpponents || 1));
  });
  if (tutorialActive() && currentTutorialScene().id === "drag-race") {
    el.opponentList.innerHTML = `
      <button class="opponent-button active" type="button" data-rank="F">
        <strong>F Class</strong>
        <small>Tutorque</small>
      </button>
    `;
    return;
  }
  el.opponentList.innerHTML = ranks.map((rank, index) => {
    const locked = index > state.highestRankIndex;
    const active = state.selectedRank === rank.key;
    return `
      <button class="opponent-button ${active ? "active" : ""} ${locked ? "locked" : ""}" type="button" data-rank="${rank.key}" ${locked ? "disabled" : ""}>
        <strong>${rank.key} Class</strong>
        <small>${locked ? "Locked" : rank.name}</small>
      </button>
    `;
  }).join("");
}

function renderSelectionPreviews() {
  const car = cars.find((item) => item.id === state.selectedCar);
  const progress = state.garage[car.id];
  const form = currentEvolution(car.id);
  const rank = state.selectedRank === "F" ? tutorialRank : ranks.find((item) => item.key === state.selectedRank);
  const rankIndex = ranks.findIndex((item) => item.key === rank.key);

  el.playerPreviewArt.innerHTML = carMarkupForEvolution(car.id, progress.evolution, "display");
  el.playerPreviewName.textContent = form.name;
  el.playerPreviewMeta.textContent = `${car.family} · Level ${progress.level} · ${car.trait}`;

  el.opponentPreviewArt.innerHTML = rankMarkup(rank, "display");
  el.opponentPreviewName.textContent = `${rank.key} Class · ${rank.name}`;
  el.opponentPreviewMeta.textContent = `Difficulty tier ${rankIndex + 1} of ${ranks.length}`;
}

function garageDetailedCardMarkup(car, extraClass = "") {
    const progress = state.garage[car.id];
    const maxed = progress.level >= maxCarLevel;
    const stats = displayedGearbornStats(car.id);
    const playstyle = gearbornStatProfiles[car.id]?.playstyle || "";
    const upgradeCost = xpForNextLevel(progress.level);
    const form = currentEvolution(car.id);
    const idle = idleProfileForGearborn(car.id);
    return `
      <article class="garage-card ${extraClass} idle-profile-${idle.idleProfile}" style="--idle-intensity:${idle.animationIntensity}">
        <div class="garage-art">
          ${carMarkupForEvolution(car.id, progress.evolution, "display")}
          ${honkButtonMarkup(`data-honk-car="${car.id}"`)}
          ${garageArtPartSlots(car.id)}
        </div>
        <div class="garage-info">
          <div class="garage-identity-row">
            <div class="garage-identity-copy">
              <h2>${form.name}</h2>
              <h3>${car.family}</h3>
              <p class="playstyle-tag">${playstyle}</p>
            </div>
            ${gearbornClassTypeBadgesForForm(form.name)}
            ${licensePlateMarkupForName(form.name, vindexEntries.find((entry) => entry.name === form.name)?.number || "000")}
          </div>
          <div class="meta-row">
            <span>Level ${progress.level}</span>
            <span class="evolution">Form ${progress.evolution + 1} / ${unlockedEvolutionIndex(car.id) + 1}</span>
          </div>
          ${garageEvolutionControls(car)}
          ${artVanFormBonusMarkup(car.id)}
          ${garageStatsMarkup(stats, car.id)}
          ${garageBondMarkup(car.id)}
          <div class="meta-row">
            <span>${maxed ? "Max Level" : `Upgrade: ${upgradeCost} Sprox`}</span>
            <span>${progress.pendingEvolution ? "Ready to evolve" : "Race ready"}</span>
          </div>
          <button class="garage-upgrade" type="button" data-upgrade-car="${car.id}">${maxed ? "Parts / Stats" : "Upgrade"}</button>
          ${progress.pendingEvolution ? `<button class="garage-evolve" type="button" data-evolve-car="${car.id}">Evolve</button>` : ""}
          ${extraClass ? `<button class="ghost garage-collapse" type="button" data-collapse-garage-card="${car.id}">Collapse</button>` : ""}
        </div>
      </article>
    `;
}

function garageCompactCardMarkup(car) {
  if (!isCarUnlocked(car.id)) {
    return `
      <article class="garage-compact-card locked">
        <div class="garage-compact-art"><div class="mystery-mark">?</div></div>
        <strong>???</strong>
        <span>${car.unlockInstruction || "Locked"}</span>
      </article>
    `;
  }
  const progress = state.garage[car.id];
  const form = currentEvolution(car.id);
  return `
    <article class="garage-compact-card" data-expand-garage-card="${car.id}">
      <div class="garage-compact-art">${carMarkupForEvolution(car.id, progress.evolution || 0, "display")}</div>
      <strong>${form.name}</strong>
      <span>Lv ${progress.level || 1} · Bond ${bondLevelForLine(car.id)}</span>
      ${progress.pendingEvolution ? `<em>Ready to evolve</em>` : ""}
    </article>
  `;
}

function renderGarage() {
  if (tutorialActive() && ["garage", "upgrade", "evolve"].includes(currentTutorialScene().id)) {
    renderTutorialGarage();
    return;
  }
  // TODO garage extension hooks: trophy shelf, medallion display, city stickers,
  // boss memorabilia, NPC garage appearances, and Ashley/Dr. Tyree moments.
  const godModeActive = garageGodModeActive();
  el.garageStatus.hidden = !godModeActive;
  el.garageStatus.textContent = godModeActive
    ? "God Mode Active: all GearBorn lines are unlocked and maxed with unlimited Sprox"
    : "";
  document.querySelectorAll("[data-garage-view]").forEach((button) => button.classList.toggle("active", button.dataset.garageView === state.garageViewMode));
  if (el.garageLoadoutsOpen) el.garageLoadoutsOpen.hidden = false;
  renderUnlockHubCard();
  const garageCars = orderedCarList(cars.filter((car) => !car.tutorialOnly && (isCarUnlocked(car.id) || car.id === "rainbowlt")));
  el.garageGrid.classList.toggle("garage-grid-compact", state.garageViewMode === "compact");
  el.garageGrid.innerHTML = garageCars.map((car) => {
    if (state.garageViewMode !== "compact") return isCarUnlocked(car.id) ? garageDetailedCardMarkup(car) : lockedGarageCard(car);
    if (expandedGarageCardIds.has(car.id) && isCarUnlocked(car.id)) return garageDetailedCardMarkup(car, "garage-expanded-card");
    return garageCompactCardMarkup(car);
  }).join("");
}

function renderUnlockHubCard() {
  const spindell = activeUnlockHub() === "spindellLabs";
  const card = document.querySelector("#forge-card-btn");
  const bg = card?.querySelector(".forge-menu-card-bg");
  const vat = card?.querySelector(".forge-menu-card-vat");
  if (el.forgeCardTitle) el.forgeCardTitle.textContent = spindell ? "Spindell Labs" : "The Forge";
  if (el.forgeCardSubtitle) {
    el.forgeCardSubtitle.textContent = spindell
      ? "Calibrate keys. Sync medallions. Unlock GearBorn."
      : "Unlock GearBorn with your Medallions.";
  }
  if (bg) bg.src = spindell ? "assets/spindell/spindell-bg.png" : "assets/forge/forge_bg.png";
  if (vat) vat.src = spindell ? "assets/spindell/spindell-sync-port.png" : "assets/forge/forge_vat.png";
  card?.classList.toggle("spindell-labs-card", spindell);
}

function renderTutorialGarage() {
  el.garageStatus.hidden = false;
  el.garageStatus.textContent = "Tutorial Garage";
  const car = cars.find((item) => item.id === tutorialCarId);
  const progress = state.garage[tutorialCarId];
  const stats = displayedGearbornStats(tutorialCarId);
  const playstyle = gearbornStatProfiles[tutorialCarId]?.playstyle || "";
  const maxed = progress.level >= maxCarLevel;
  const form = currentEvolution(tutorialCarId);
  const idle = idleProfileForGearborn(tutorialCarId);
  el.garageGrid.innerHTML = `
    <article class="garage-card idle-profile-${idle.idleProfile}" style="--idle-intensity:${idle.animationIntensity}">
      <div class="garage-art">
        ${carMarkupForEvolution(tutorialCarId, progress.evolution, "display")}
        ${honkButtonMarkup(`data-honk-car="${tutorialCarId}"`)}
        ${garageArtPartSlots(tutorialCarId)}
      </div>
      <div class="garage-info">
        <div class="garage-identity-row">
          <div class="garage-identity-copy">
            <h2>${form.name}</h2>
            <h3>${car.family}</h3>
            <p class="playstyle-tag">${playstyle}</p>
          </div>
          ${gearbornClassTypeBadgesForForm(form.name)}
          ${licensePlateMarkupForName(form.name, vindexEntries.find((entry) => entry.name === form.name)?.number || "000")}
        </div>
        <div class="meta-row">
          <span>Level ${progress.level}</span>
          <span class="evolution">Training</span>
        </div>
        ${garageStatsMarkup(stats, tutorialCarId)}
        ${garageBondMarkup(tutorialCarId)}
        <div class="meta-row">
          <span>${maxed ? "Max Level" : "Upgrade: 5000 Sprox"}</span>
          <span>${progress.pendingEvolution ? "Ready to evolve" : "Race ready"}</span>
        </div>
        <button class="garage-upgrade" type="button" data-upgrade-car="${tutorialCarId}">${maxed ? "Parts / Stats" : "Upgrade"}</button>
        ${progress.pendingEvolution ? `<button class="garage-evolve" type="button" data-evolve-car="${tutorialCarId}">Evolve</button>` : ""}
      </div>
    </article>
  `;
}

function garageBondMarkup(carId) {
  const bond = state.bond?.[carId] || { races: 0, milestones: [] };
  const next = nextBondMilestone(carId);
  const unlocked = (bond.milestones || [])
    .map((count) => formatBondBoosts(bondMilestoneBoost(Number(count), baseGearbornStatsAtLevel(carId, state.garage[carId]?.level || 1))))
    .filter(Boolean);
  const nextBoost = next
    ? formatBondBoosts(bondMilestoneBoost(next, baseGearbornStatsAtLevel(carId, state.garage[carId]?.level || 1)))
    : "All Bond boosts unlocked";
  return `
    <div class="bond-panel" aria-label="Bond progress">
      <div class="bond-title">Bond</div>
      <div class="bond-row"><span>Races Together</span><strong>${bond.races || 0}</strong></div>
      <div class="bond-row"><span>Next Bond Boost</span><strong>${next ? `${next} races` : "Complete"}</strong></div>
      <div class="bond-unlocked">${next ? `Next: ${nextBoost}` : nextBoost}</div>
      ${unlocked.length ? `<div class="bond-unlocked">Unlocked: ${unlocked.join(" · ")}</div>` : ""}
    </div>
  `;
}

function artVanFormBonusMarkup(carId) {
  if (carId !== "art-van") return "";
  const bonus = currentEvolution(carId)?.formBonus;
  if (!bonus) return "";
  return `<p class="form-bonus">Form Bonus: ${formatBondBoosts(bonus)}</p>`;
}

function garageArtPartSlots(carId) {
  const slots = state.equippedParts?.[carId] || [null, null];
  return `
    <div class="garage-art-part-slots" aria-label="Equipped part slots">
      ${[0, 1].map((slotIndex) => {
        const part = partByKey(slots[slotIndex]);
        return `
          <div class="garage-art-part-slot ${part ? "filled" : "empty"}">
            ${part ? `${partImageMarkup(part, "garage-art-part-image")}<span>${partStars(part)}</span>` : `<span class="empty-plus">+</span>`}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function honkButtonMarkup(attributes = "") {
  return `
    <button class="honk-button" type="button" ${attributes} aria-label="Play honk">
      <img src="assets/icons/icon-horn.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
    </button>
  `;
}

const statBarConfig = [
  ["SPD", "speed"],
  ["ACC", "acceleration"],
  ["HDL", "handling"],
  ["TRQ", "torque"],
  ["BDY", "body"],
  ["PWR", "powertrain"]
];

function statBarSegments(carId, statKey, level = state.garage?.[carId]?.level || 1) {
  if (!carId || !state.garage?.[carId]) return null;
  const baseStats = baseGearbornStatsAtLevel(carId, level);
  const bondBoosts = bondBoostsForCar(carId, baseStats);
  const partBoosts = partBoostsForCar(carId);
  const formBoosts = formBoostsForCar(carId);
  const basePct = normalizedGearbornStat(Math.min(100, baseStats[statKey])) * 100;
  const bondPct = Math.min(Math.max(0, (bondBoosts[statKey] || 0) / 40 * 100), Math.max(0, 100 - basePct));
  const partPct = Math.min(Math.max(0, (partBoosts[statKey] || 0) / 40 * 100), Math.max(0, 100 - basePct - bondPct));
  const formPct = Math.min(Math.max(0, (formBoosts[statKey] || 0) / 40 * 100), Math.max(0, 100 - basePct - bondPct - partPct));
  return { basePct, bondPct, partPct, formPct };
}

function garageStatsMarkup(stats, carId = "") {
  return `
    <div class="garage-stat-grid" aria-label="GearBorn stats">
      ${statBarConfig.map(([label, key]) => garageStatBar(label, stats[key], statBarSegments(carId, key))).join("")}
    </div>
  `;
}

function garageStatBar(label, value, segments = null) {
  return `
    <div class="garage-stat">
      <span>${label}</span>
      <div class="garage-stat-bar">${statFillMarkup(value, segments)}</div>
    </div>
  `;
}

function statFillMarkup(value, segments = null) {
  const pct = normalizedGearbornStat(value) * 100;
  const basePct = segments ? Math.min(segments.basePct, pct) : pct;
  const bondPct = segments ? Math.min(segments.bondPct, Math.max(0, pct - basePct)) : 0;
  const partPct = segments ? Math.min(segments.partPct, Math.max(0, pct - basePct - bondPct)) : 0;
  const formPct = segments ? Math.min(segments.formPct || 0, Math.max(0, pct - basePct - bondPct - partPct)) : 0;
  return `
    <div class="stat-base" style="width:${basePct}%"></div>
    ${bondPct > 0 ? `<i class="stat-bond" style="left:${basePct}%; width:${bondPct}%"></i>` : ""}
    ${partPct > 0 ? `<i class="stat-parts" style="left:${basePct + bondPct}%; width:${partPct}%"></i>` : ""}
    ${formPct > 0 ? `<i class="stat-form" style="left:${basePct + bondPct + partPct}%; width:${formPct}%"></i>` : ""}
  `;
}

function upgradeStatsMarkup(carId) {
  const progress = state.garage[carId];
  const currentStats = displayedGearbornStatsAtLevel(carId, progress.level);
  const rawNextStats = displayedGearbornStatsAtLevel(carId, Math.min(maxCarLevel, progress.level + 1));
  const nextStats = Object.fromEntries(Object.entries(currentStats).map(([key, value]) => {
    const nextValue = rawNextStats[key];
    return [key, progress.level >= maxCarLevel || value >= 100 ? nextValue : Math.max(nextValue, Math.min(100, value + 1))];
  }));
  return `
    <div class="garage-stat-grid upgrade-stat-grid" aria-label="Upgrade preview stats">
      ${statBarConfig.map(([label, key]) => upgradeStatBar(label, currentStats[key], nextStats[key], statBarSegments(carId, key))).join("")}
    </div>
  `;
}

function upgradeStatBar(label, current, next, segments = null) {
  const currentPct = normalizedGearbornStat(current) * 100;
  const nextPct = normalizedGearbornStat(next) * 100;
  const gainPct = Math.max(0, nextPct - currentPct);
  return `
    <div class="garage-stat upgrade-stat">
      <span>${label}</span>
      <div class="garage-stat-bar upgrade-stat-bar">
        ${statFillMarkup(current, segments)}
        <i style="left:${currentPct}%; width:${gainPct}%"></i>
      </div>
    </div>
  `;
}

function openUpgradeModal(carId) {
  upgradeModalCarId = carId;
  renderUpgradeModal();
  if (!upgradeModalCarId) return;
  el.upgradeModal.classList.add("active");
  el.upgradeModal.setAttribute("aria-hidden", "false");
  el.confirmUpgrade.focus();
}

function renderUpgradeModal() {
  const carId = upgradeModalCarId;
  const car = cars.find((item) => item.id === carId);
  const progress = state.garage?.[carId];
  if (!car || !progress) return;
  const form = currentEvolution(carId);
  const maxed = progress.level >= maxCarLevel;
  const cost = tutorialActive() && carId === tutorialCarId ? 5000 : xpForNextLevel(progress.level);
  if (el.upgradeSproxTotal) el.upgradeSproxTotal.textContent = formatSprox();
  el.upgradeTitle.textContent = maxed ? "Max Level" : `Level ${progress.level} → ${progress.level + 1}`;
  el.upgradeCarName.textContent = form.name;
  el.upgradeCarMeta.textContent = `${car.family} · ${gearbornStatProfiles[car.id]?.playstyle || ""}`;
  el.upgradeArt.innerHTML = carMarkupForEvolution(carId, progress.evolution, "display");
  el.upgradeStats.innerHTML = upgradeStatsMarkup(carId);
  renderUpgradePartSlots(carId);
  el.upgradeCost.textContent = maxed ? "This GearBorn is already maxed." : `Price: ${cost} Sprox`;
  el.confirmUpgrade.disabled = maxed || !canAffordUpgrade(cost);
  el.confirmUpgrade.textContent = maxed ? "Max Level" : "Level Up";
}

function closeUpgradeModal() {
  upgradeModalCarId = null;
  closeEquipPartModal();
  el.upgradeModal.classList.remove("active");
  el.upgradeModal.setAttribute("aria-hidden", "true");
}

function upgradeCarLevel() {
  if (!upgradeModalCarId) return;
  const carId = upgradeModalCarId;
  const progress = state.garage[carId];
  if (!progress || progress.level >= maxCarLevel) return;
  const cost = tutorialActive() && carId === tutorialCarId ? 5000 : xpForNextLevel(progress.level);
  if (!spendSprox(cost)) {
    el.upgradeCost.textContent = `Need ${cost} Sprox. Current balance: ${formatSprox()}`;
    el.confirmUpgrade.disabled = true;
    return;
  }
  progress.level = Math.min(maxCarLevel, progress.level + 1);
  progress.xp = 0;
  const newEvolution = maxEligibleEvolutionForCar(carId, progress.level);
  if (newEvolution > unlockedEvolutionIndex(carId)) {
    progress.pendingEvolution = progress.pendingEvolution || unlockedEvolutionIndex(carId) + 1;
  }
  if (tutorialActive() && carId === tutorialCarId && progress.level >= maxCarLevel) {
    progress.pendingEvolution = 1;
  }
  unlockSecretCars();
  const shouldEvolve = Boolean(progress.pendingEvolution);
  if (shouldEvolve && tutorialActive() && carId === tutorialCarId) {
    state.tutorialAwaitingUpgrade = false;
    setTutorialScene("evolve");
    state.tutorialAwaitingEvolve = false;
  }
  saveState();
  render();
  renderUpgradeModal();
  if (shouldEvolve) {
    showPendingEvolution(carId);
    if (tutorialActive() && carId === tutorialCarId) renderTutorial();
  }
}

function partImageMarkup(part, className = "part-image") {
  if (!part) return `<div class="${className} part-placeholder">?</div>`;
  return `<img class="${className}" src="${part.image}" alt="${part.name}" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'${className} part-placeholder',textContent:'?' }))">`;
}

function partTileMarkup(part, options = {}) {
  const owned = state.partsInventory?.[part.key] || 0;
  const available = options.availableOnly ? availablePartCount(part.key, options.ignoreCarId, options.ignoreSlot) : owned;
  const dim = options.availableOnly ? available <= 0 : owned <= 0;
  return `
    <button class="part-tile ${dim ? "dim" : ""} ${options.selected === part.key ? "active" : ""}" type="button" data-part-key="${part.key}" ${options.availableOnly && available <= 0 ? "disabled" : ""}>
      <span class="part-qty">x${options.availableOnly ? available : owned}</span>
      ${partImageMarkup(part)}
      <strong>${part.name}</strong>
      <span class="part-stars">${partStars(part)}</span>
    </button>
  `;
}

function partDetailMarkup(part, availableText = "") {
  if (!part) return `<p class="empty-detail">Select a part to view its stats.</p>`;
  const owned = state.partsInventory?.[part.key] || 0;
  return `
    <div class="part-detail-art">${partImageMarkup(part)}</div>
    <h3>${part.name}</h3>
    <div class="part-stars large">${partStars(part)}</div>
    <p>${availableText || `Owned: x${owned}`}</p>
    <p>Boost: <strong>+${part.bonus} ${part.label}</strong></p>
  `;
}

function openInventoryModal() {
  selectedInventoryPartKey = selectedInventoryPartKey || partVariants[0].key;
  renderInventoryModal();
  el.inventoryModal.classList.add("active");
  el.inventoryModal.setAttribute("aria-hidden", "false");
}

function closeInventoryModal() {
  el.inventoryModal.classList.remove("active");
  el.inventoryModal.setAttribute("aria-hidden", "true");
}

function renderInventoryModal() {
  const selected = partByKey(selectedInventoryPartKey) || partVariants[0];
  el.partsGrid.innerHTML = partVariants.map((part) => partTileMarkup(part, { selected: selected.key })).join("");
  el.partDetail.innerHTML = partDetailMarkup(selected);
}

function renderUpgradePartSlots(carId) {
  if (!el.upgradePartSlots) return;
  const slots = state.equippedParts?.[carId] || [null, null];
  el.upgradePartSlots.innerHTML = slots.map((key, index) => {
    const part = partByKey(key);
    return `
      <button class="part-slot ${part ? "filled" : "empty"}" type="button" data-part-slot="${index}">
        ${part ? `${partImageMarkup(part, "slot-part-image")}<span>${partStars(part)}</span><strong>+${part.bonus} ${part.label}</strong>` : `<span class="plus">+</span><strong>Empty Part Slot</strong>`}
      </button>
    `;
  }).join("");
}

function openEquipPartModal(carId, slotIndex) {
  equipPartContext = { carId, slotIndex, selectedKey: null, replacing: !state.equippedParts?.[carId]?.[slotIndex] };
  renderEquipPartModal();
  el.equipPartModal.classList.add("active");
  el.equipPartModal.setAttribute("aria-hidden", "false");
}

function closeEquipPartModal() {
  equipPartContext = null;
  el.equipPartModal.classList.remove("active");
  el.equipPartModal.setAttribute("aria-hidden", "true");
}

function renderEquipPartModal() {
  if (!equipPartContext) return;
  const { carId, slotIndex, selectedKey } = equipPartContext;
  const equipped = partByKey(state.equippedParts?.[carId]?.[slotIndex]);
  const availableParts = partVariants.filter((part) => availablePartCount(part.key, carId, slotIndex) > 0);
  el.equipPartsGrid.innerHTML = availableParts.length
    ? availableParts.map((part) => partTileMarkup(part, { selected: selectedKey, availableOnly: true, ignoreCarId: carId, ignoreSlot: slotIndex })).join("")
    : `<p class="empty-detail">No available parts yet. Win Story Mode races to find parts.</p>`;
  const selected = partByKey(selectedKey) || equipped;
  const available = selected ? availablePartCount(selected.key, carId, slotIndex) : 0;
  el.equipPartDetail.innerHTML = partDetailMarkup(selected, selected ? `Available: x${available}` : "");
  el.confirmEquipPart.disabled = !selectedKey || availablePartCount(selectedKey, carId, slotIndex) <= 0;
  el.unequipPart.hidden = !equipped;
  el.replacePart.hidden = !equipped;
  el.confirmEquipPart.textContent = equipped ? "Replace" : "Equip";
}

function equipSelectedPart() {
  if (!equipPartContext?.selectedKey) return;
  const { carId, slotIndex, selectedKey } = equipPartContext;
  if (availablePartCount(selectedKey, carId, slotIndex) <= 0) return;
  state.equippedParts[carId] = state.equippedParts[carId] || [null, null];
  state.equippedParts[carId][slotIndex] = selectedKey;
  saveState();
  render();
  renderUpgradeModal();
  closeEquipPartModal();
}

function unequipSelectedPart() {
  if (!equipPartContext) return;
  state.equippedParts[equipPartContext.carId] = state.equippedParts[equipPartContext.carId] || [null, null];
  state.equippedParts[equipPartContext.carId][equipPartContext.slotIndex] = null;
  saveState();
  render();
  renderUpgradeModal();
  closeEquipPartModal();
}

function garageEvolutionControls(car) {
  const progress = state.garage[car.id];
  if (car.id === "art-van") {
    const unlockedForms = (state.unlockedArtVanForms || [0]).filter((index) => car.evolutions[index]);
    const currentPosition = Math.max(0, unlockedForms.indexOf(progress.evolution));
    if (unlockedForms.length < 2) return "";
    return `
      <div class="evolution-switcher" aria-label="${car.family} form selector">
        <button type="button" data-evolution-step="${car.id}:previous" ${currentPosition <= 0 ? "disabled" : ""}>←</button>
        <strong>${currentEvolution(car.id).name}</strong>
        <button type="button" data-evolution-step="${car.id}:next" ${currentPosition >= unlockedForms.length - 1 ? "disabled" : ""}>→</button>
      </div>
    `;
  }
  const unlocked = unlockedEvolutionIndex(car.id);
  if (unlocked < 1) return "";
  return `
    <div class="evolution-switcher" aria-label="${car.family} form selector">
      <button type="button" data-evolution-step="${car.id}:previous" ${progress.evolution <= 0 ? "disabled" : ""}>←</button>
      <strong>${currentEvolution(car.id).name}</strong>
      <button type="button" data-evolution-step="${car.id}:next" ${progress.evolution >= unlocked ? "disabled" : ""}>→</button>
    </div>
  `;
}

function changeGarageEvolution(carId, direction) {
  const car = cars.find((item) => item.id === carId);
  if (!car || !isCarUnlocked(carId)) return;
  const progress = state.garage[carId];
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const restoreScroll = () => requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
  if (carId === "art-van") {
    const unlockedForms = (state.unlockedArtVanForms || [0]).filter((index) => car.evolutions[index]);
    const currentPosition = Math.max(0, unlockedForms.indexOf(progress.evolution));
    const delta = direction === "next" ? 1 : -1;
    const nextPosition = Math.max(0, Math.min(unlockedForms.length - 1, currentPosition + delta));
    progress.evolution = unlockedForms[nextPosition] ?? 0;
    saveState();
    render();
    restoreScroll();
    return;
  }
  const delta = direction === "next" ? 1 : -1;
  progress.evolution = Math.max(0, Math.min(unlockedEvolutionIndex(carId), progress.evolution + delta));
  saveState();
  render();
  restoreScroll();
}

function lockedGarageCard(car) {
  return `
    <article class="garage-card locked-garage-card">
      <div class="garage-art mystery-art">
        <div class="mystery-mark">?</div>
      </div>
      <div class="garage-info">
        <h2>?</h2>
        <h3>Locked Gearborn</h3>
        <p class="unlock-copy">${car.unlockInstruction}</p>
      </div>
    </article>
  `;
}

function carMarkup(color) {
  const currentCar = cars.find((car) => car.color === color);
  const image = currentCar ? imageFor(currentEvolution(currentCar.id), "display") : "";
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${currentEvolution(currentCar.id).name}" loading="lazy" decoding="async" onerror="this.closest('.car')?.classList.remove('has-image')">` : "";
  const imageClass = image ? " has-image" : "";
  return `
    <div class="car${imageClass}" style="--car-color:${color}">
      ${imageTag}
      <span class="car-glow"></span>
      <span class="car-body"></span>
      <span class="wheel front"></span>
      <span class="wheel rear"></span>
    </div>
  `;
}

function renderSettings() {
  el.difficulty.value = state.settings.difficulty;
  el.volume.value = state.settings.volume;
  el.shiftKey.value = readableKey(state.settings.shiftKey);
  el.nitroKey.value = readableKey(state.settings.nitroKey);
  el.verticalUpKey.value = readableKey(state.settings.verticalKeys.up);
  el.verticalDownKey.value = readableKey(state.settings.verticalKeys.down);
  el.verticalLeftKey.value = readableKey(state.settings.verticalKeys.left);
  el.verticalRightKey.value = readableKey(state.settings.verticalKeys.right);
}

function paintCars() {
  const car = cars.find((item) => item.id === state.selectedCar);
  const rank = state.selectedRank === "F" ? tutorialRank : ranks.find((item) => item.key === state.selectedRank);
  const form = currentEvolution(car.id);
  el.playerRacer.style.setProperty("--car-color", car.color);
  el.rivalRacer.style.setProperty("--car-color", rank.color);
  setRacerImage(el.playerRacer, el.playerRacerImage, imageFor(form, "race"), form.name);
  setRacerImage(el.rivalRacer, el.rivalRacerImage, imageFor(rank, "race"), rank.name);
}

function setRacerImage(container, image, src, alt) {
  container.classList.remove("has-image");
  image.removeAttribute("src");
  image.alt = alt;
  image.onload = () => container.classList.add("has-image");
  image.onerror = () => container.classList.remove("has-image");
  if (src) image.src = src;
}

function startRace() {
  if (tutorialActive() && currentTutorialScene().id === "drag-race") {
    prepareDragRace(null, tutorialDragStage());
    setTutorialScene("drag-race-win");
    saveState();
    renderTutorial();
    return;
  }
  prepareDragRace();
}

function prepareDragRace(campaignLevelIndex = null, dragStage = null) {
  pendingDragRace = { campaignLevelIndex, dragStage };
  modeFlow.drag = "race";
  renderFlowScreens();
  el.dragMapStart.classList.add("active");
  el.dragCountdown.classList.remove("active");
  el.dragCountdown.textContent = "";
  el.raceMessage.className = "race-message";
  el.raceMessage.textContent = "Press Start Race when you're ready.";
  el.playerRacer.style.transform = "translateX(0)";
  el.rivalRacer.style.transform = "translateX(0)";
  el.playerRacer.classList.remove("nitro-active");
  el.rivalRacer.classList.remove("nitro-active");
  race = null;
  updateNitroHud();
  paintCars();
  updateGearshiftIndicator(false);
}

function startPendingDragRace() {
  const config = pendingDragRace || { campaignLevelIndex: null, dragStage: null };
  el.dragMapStart.classList.remove("active");
  startDragRace(config.campaignLevelIndex, config.dragStage);
  pendingDragRace = null;
}

function dragBackgroundFor(campaignLevelIndex, dragStage) {
  const level = campaignLevelIndex !== null && campaignLevelIndex !== undefined ? campaignLevels[campaignLevelIndex] : null;
  const rawId = dragStage?.trackId || level?.track?.id || storyCityForCampaignIndex(campaignLevelIndex)?.id || (dragStage?.tutorial ? "academy" : "academy");
  const normalized = rawId === "bangalore" ? "bengaluru" : rawId;
  const available = new Set(["academy", "indianapolis", "berlin", "dubai", "rio", "seoul", "cape-town", "bengaluru"]);
  return `assets/race/dragbg-${available.has(normalized) ? normalized : "academy"}.png`;
}

function dragOpponentSeed(rank, distance, dragStage, rankIndex) {
  if (dragStage?.opponents?.length) return dragStage.opponents;
  if (dragStage) return [{ name: dragStage.name, image: dragStage.image, power: dragStage.power }];
  const count = Math.max(1, Math.min(3, state.selectedDragOpponents || 1));
  const seeds = [{
    name: rank.name,
    image: imageFor(rank, "race"),
    power: rank.power,
    rankKey: rank.key
  }];
  const excludedNames = new Set(["hornula1", "rainbowlt"]);
  const pool = ranks.filter((item) => item.key !== rank.key && !excludedNames.has(slugify(item.name)));
  while (seeds.length < count && pool.length) {
    const [picked] = pool.splice(Math.floor(Math.random() * pool.length), 1);
    seeds.push({
      name: picked.name,
      image: imageFor(picked, "race"),
      power: picked.power * (1 + seeds.length * 0.05),
      rankKey: picked.key
    });
  }
  return seeds;
}

function makeDragOpponent(seed, index, rank, distance, dragStage, rankIndex) {
  const skillIndex = Math.max(0, rankIndex + index * 0.45);
  const classScale = dragStage?.tutorial ? 0.5 : 0.9 + skillIndex * 0.09;
  const power = Number(seed.power || rank.power || 1) * classScale * distance.difficulty * difficultyMultiplier();
  const lanePool = race?.visibleLanes || [1, 2, 3, 4];
  const defaultLanes = lanePool.length <= 2 ? [2] : lanePool.length === 3 ? [1, 2] : [1, 2, 4];
  return {
    id: `opponent-${index}`,
    name: seed.name || rank.name,
    image: seed.image || imageFor(rank, "race"),
    lane: defaultLanes[index] || lanePool.find((lane) => lane !== 3) || 2,
    lanePreference: defaultLanes[index] || 2,
    laneTransition: null,
    laneThink: 2.4 + Math.random() * 2.2,
    speed: 0,
    distance: 0,
    maxSpeed: 92 + power * 42,
    acceleration: 17 + power * 12,
    nitroCharge: 0,
    nitroActive: false,
    nitroTimer: 0,
    nitroSkill: Math.max(0, skillIndex) / Math.max(1, ranks.length - 1),
    nitroUsed: false,
    shiftTimer: Math.max(0.65, 1.3 - (Math.max(0, skillIndex) / Math.max(1, ranks.length - 1)) * 0.35),
    nitroDelay: 0,
    power
  };
}

function setLaunchPhase(phase, step = 1) {
  if (!race?.active || race.finished || race.launchPhase === "launched") return;
  race.launchPhase = phase;
  race.launchPhaseStartTime = performance.now();
  race.launchStep = step;
  el.dragLaunchLights?.querySelectorAll(".launch-tree-row").forEach((row) => {
    row.classList.toggle("active", row.dataset.launchStep === String(step));
  });
  el.dragLaunchLights?.querySelectorAll(".launch-light").forEach((light) => light.classList.remove("active"));
  el.dragCountdown.classList.remove("active");
  el.dragCountdown.textContent = "";
  if (phase === "green") {
    playAudioCue("raceStart");
    playSound("race-countdown-go");
  } else {
    playAudioCue("raceCountdown");
    playSound("race-countdown-beep");
  }
}

function launchDragPlayer() {
  if (!race?.active || race.finished || race.gear !== 0) return;
  const now = performance.now();
  let message = "Clean Launch";
  if (race.launchPhase === "green") {
    const reaction = now - race.launchPhaseStartTime;
    race.launchBonus = reaction <= 250 ? 1.15 : 1;
    message = reaction <= 250 ? "Perfect Launch" : "Clean Launch";
  } else if (race.launchPhase === "red" || race.launchPhase === "yellow") {
    race.launchBonus = 0.7;
    message = "Jumped Start";
  } else {
    race.launchBonus = 1;
  }
  race.launchBonusUntil = now + 2000;
  race.launchPhase = "launched";
  race.gear = 1;
  race.rpm = 0.2;
  el.shiftReadout.textContent = message;
  el.dragLaunchLights?.querySelectorAll(".launch-light, .launch-tree-row").forEach((light) => light.classList.remove("active"));
  el.dragCountdown.classList.remove("active");
  updateGearshiftIndicator(true);
  updateNitroHud();
  playSound("engine-launch");
  beep(message);
}

function updateGearshiftIndicator(animate = false) {
  if (!el.gearshiftIndicator) return;
  const gear = race?.gear || 0;
  el.gearshiftIndicator.src = `assets/race/gearshift-${gear > 0 ? Math.min(6, gear) : "p"}.png`;
  if (animate) {
    el.gearshiftIndicator.classList.remove("shifting");
    void el.gearshiftIndicator.offsetWidth;
    el.gearshiftIndicator.classList.add("shifting");
  }
}

function moveDragLane(delta) {
  if (!race?.active || race.finished || race.gear === 0 || race.laneTransition) return;
  const lanes = race.visibleLanes || [1, 2, 3, 4];
  const current = race.playerLane || 3;
  const next = current + delta;
  if (!lanes.includes(next)) return;
  const now = performance.now();
  race.laneTransition = { from: current, to: next, startTime: now };
  race.playerLane = next;
}

function updateLaneTransition(now) {
  if (!race?.laneTransition) return;
  if (now - race.laneTransition.startTime >= 400) race.laneTransition = null;
}

function renderedLaneValue(unit) {
  const transition = unit?.laneTransition;
  if (!transition) return unit?.lane || race?.playerLane || 3;
  const progress = Math.min(1, (performance.now() - transition.startTime) / 400);
  return transition.from + (transition.to - transition.from) * progress;
}

function dragLaneTop(lane) {
  return `${18 + (lane - 1) * 20}%`;
}

function dragDraftBonus(subject, others) {
  const lane = Math.round(subject.lane || 1);
  const distance = Number(subject.distance || 0);
  const speed = Number(subject.speed || 0);
  if (speed <= 0 && subject !== race) return 1;
  const ahead = others
    .filter((other) => Math.round(other.lane || 1) === lane)
    .map((other) => Number(other.distance || 0) - distance)
    .filter((gap) => gap > 0 && gap <= 60)
    .sort((a, b) => a - b)[0];
  if (!ahead) return 1;
  if (ahead >= 30) return 1.18;
  return 1 + 0.18 * (ahead / 30);
}

function updateOpponentLaneAI(dt) {
  const lanes = race.visibleLanes || [1, 2, 3, 4];
  (race.opponents || []).forEach((opponent) => {
    if (opponent.laneTransition) {
      if (performance.now() - opponent.laneTransition.startTime >= 400) opponent.laneTransition = null;
      return;
    }
    opponent.laneThink -= dt;
    if (opponent.laneThink > 0) return;
    opponent.laneThink = 3 + Math.random() * 2;
    if (Math.random() > 0.3) return;
    const candidates = lanes.filter((lane) => Math.abs(lane - opponent.lane) === 1);
    if (!candidates.length) return;
    const carsAhead = [{ lane: race.playerLane, distance: race.playerDistance }].concat((race.opponents || []).filter((item) => item !== opponent));
    const preferred = candidates.find((lane) => carsAhead.some((other) => Math.round(other.lane) === lane && other.distance > opponent.distance && other.distance - opponent.distance < 70));
    const targetLane = preferred || candidates[Math.floor(Math.random() * candidates.length)];
    opponent.laneTransition = { from: opponent.lane, to: targetLane, startTime: performance.now() };
    opponent.lane = targetLane;
  });
}

function syncPrimaryRivalFields() {
  const first = race?.opponents?.[0];
  if (!first) return;
  race.rivalSpeed = first.speed;
  race.rivalDistance = first.distance;
  race.rivalMaxSpeed = first.maxSpeed;
  race.rivalAcceleration = first.acceleration;
  race.rivalNitroCharge = first.nitroCharge;
  race.rivalNitroActive = first.nitroActive;
  race.rivalNitroTimer = first.nitroTimer;
  race.rivalNitroSkill = first.nitroSkill;
  race.rivalNitroUsed = first.nitroUsed;
  race.rivalShiftTimer = first.shiftTimer;
  race.rivalNitroDelay = first.nitroDelay;
}

function dragVisibleLanes(opponentCount) {
  if (opponentCount <= 1) return [2, 3];
  if (opponentCount === 2) return [1, 2, 3];
  return [1, 2, 3, 4];
}

function startDragRace(campaignLevelIndex = null, dragStage = null) {
  clearRaceResultPopups();
  el.dragMapStart.classList.remove("active");
  const levelForMusic = campaignLevelIndex !== null && campaignLevelIndex !== undefined ? campaignLevels[campaignLevelIndex] : null;
  playMusic(levelForMusic?.type === "boss" ? "boss-theme" : "race-theme");
  const car = carStats(state.selectedCar);
  const rank = dragStage
    ? { key: dragStage.rankKey, name: dragStage.name, xpBonus: dragStage.xp / 180, power: dragStage.power, color: "#f25f5c", images: { race: dragStage.image } }
    : ranks.find((item) => item.key === state.selectedRank);
  const distance = dragStage?.tutorial ? tutorialDistance : distances.find((item) => item.meters === (dragStage?.distance || state.selectedDistance));
  const rankIndex = ranks.findIndex((item) => item.key === rank.key);
  const seeds = dragOpponentSeed(rank, distance, dragStage, rankIndex).slice(0, 3);
  race = {
    active: true,
    finished: false,
    target: distance.meters,
    gear: 0,
    rpm: 0.18,
    playerSpeed: 0,
    rivalSpeed: 0,
    playerDistance: 0,
    rivalDistance: 0,
    playerPower: car.power,
    playerMaxSpeed: car.maxSpeed,
    playerAcceleration: car.acceleration,
    playerTorque: car.torqueNorm,
    accelPenalty: 1,
    topGearBoost: 1,
    shiftWindow: car.shiftWindow,
    nitroCharge: 0,
    nitroActive: false,
    nitroTimer: 0,
    overheatCount: 0,
    overheatLatched: false,
    shiftScore: [],
    rank,
    distance,
    dragStage,
    campaignLevelIndex,
    carId: state.selectedCar,
    gauntlet: state.activeGauntlet?.mode === "drag" ? { ...state.activeGauntlet } : null,
    launchPhase: "red",
    launchPhaseStartTime: performance.now(),
    launchStep: 1,
    launchBonus: 1,
    launchBonusUntil: 0,
    playerLane: 3,
    laneTransition: null,
    draftBonus: 1,
    visibleLanes: dragVisibleLanes(seeds.length),
    opponents: [],
    roadScroll: 0,
    bgScroll: 0,
    backgroundImage: dragBackgroundFor(campaignLevelIndex, dragStage)
  };
  race.opponents = seeds.map((seed, index) => makeDragOpponent(seed, index, rank, distance, dragStage, rankIndex));
  syncPrimaryRivalFields();
  if (dragStage) {
    el.rivalRacer.style.setProperty("--car-color", rank.color);
    setRacerImage(el.rivalRacer, el.rivalRacerImage, race.opponents[0]?.image || dragStage.image, race.opponents[0]?.name || dragStage.name);
  }
  lastFrame = performance.now();
  el.raceMessage.className = "race-message";
  el.raceMessage.textContent = `Launch on green, then press ${readableKey(state.settings.shiftKey)} when the shift meter hits the bright band.`;
  updateNitroHud();
  updateGearshiftIndicator(false);
  setLaunchPhase("red", 1);
  setTimeout(() => setLaunchPhase("red", 2), 1000);
  setTimeout(() => setLaunchPhase("yellow", 3), 2000);
  setTimeout(() => setLaunchPhase("green", 4), 3000);
  requestAnimationFrame(updateRace);
}

function updateRace(now) {
  if (!race?.active) return;
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;

  if (race.launchPhase === "red" || race.launchPhase === "yellow") {
    drawRace();
    requestAnimationFrame(updateRace);
    return;
  }

  updateLaneTransition(now);
  if (race.gear > 0) {
    const launchBoost = race.launchBonusUntil > now ? race.launchBonus : 1;
    const draftBoost = dragDraftBonus({ lane: race.playerLane, distance: race.playerDistance, speed: race.playerSpeed }, race.opponents || []);
    race.draftBonus = draftBoost;
    if (race.gear >= 6) {
      const speedRatio = Math.min(1, race.playerSpeed / race.playerMaxSpeed);
      const topGearPull = Math.max(0.16, 1 - speedRatio);
      race.playerSpeed += race.playerAcceleration * race.playerPower * race.topGearBoost * race.accelPenalty * launchBoost * draftBoost * topGearPull * dt;
      race.rpm = 0.74;
    } else {
      const gearDrag = 1 - (race.gear - 1) * 0.08;
      const rpmPower = 0.52 + race.rpm * 0.72;
      if (race.rpm > 0.86) {
        race.accelPenalty = Math.max(0.42, race.accelPenalty - 0.34 * dt);
      }
      race.playerSpeed += race.playerAcceleration * race.playerPower * race.accelPenalty * launchBoost * draftBoost * gearDrag * rpmPower * dt;
      race.rpm += (0.22 + race.playerSpeed / 260) * dt;
    }
  } else {
    race.playerSpeed = Math.max(0, race.playerSpeed * 0.985);
    race.rpm = 0.18;
    race.draftBonus = 1;
  }
  updateDragNitroTimers(dt);
  updateOpponentLaneAI(dt);
  (race.opponents || []).forEach((opponent) => {
    updateOpponentNitro(opponent, dt);
    const others = [{ lane: race.playerLane, distance: race.playerDistance, speed: race.playerSpeed }].concat((race.opponents || []).filter((item) => item !== opponent));
    const draftBoost = dragDraftBonus(opponent, others);
    opponent.speed += opponent.acceleration * (0.78 + Math.random() * 0.08) * draftBoost * dt;
    const nitroScale = opponent.nitroActive ? dragNitroMultiplier : 1;
    opponent.speed = Math.min(opponent.speed, opponent.maxSpeed * nitroScale);
    opponent.distance += mphToMetersPerSecond(opponent.speed) * dt;
  });

  const playerNitroScale = race.nitroActive ? dragNitroMultiplier : 1;
  const playerCap = (race.gear >= 6 ? race.playerMaxSpeed : race.gear > 0 ? race.playerMaxSpeed * (0.58 + race.gear * 0.15) : 0) * playerNitroScale;
  race.playerSpeed = Math.min(race.playerSpeed, playerCap);

  race.playerDistance += mphToMetersPerSecond(race.playerSpeed) * dt;
  syncPrimaryRivalFields();
  race.roadScroll = (race.roadScroll || 0) - race.playerSpeed * dt * 10;
  race.bgScroll = (race.bgScroll || 0) - race.playerSpeed * dt * 3;

  if (race.gear > 0 && race.gear < 6 && race.rpm >= 1) {
    if (!race.overheatLatched) {
      race.overheatCount += 1;
      race.overheatLatched = true;
      race.accelPenalty = Math.max(0.34, race.accelPenalty - 0.18);
      if (race.overheatCount >= 3) {
        failDragRace("Engine Overheated");
        return;
      }
    }
    race.playerSpeed *= 0.975;
    race.rpm = 1;
  }

  drawRace();

  const bestOpponentDistance = Math.max(0, ...(race.opponents || []).map((opponent) => opponent.distance));
  if (race.playerDistance >= race.target || bestOpponentDistance >= race.target) {
    finishRace(race.playerDistance >= bestOpponentDistance);
    return;
  }

  requestAnimationFrame(updateRace);
}

function shift() {
  if (!race?.active || race.finished) return;
  if (race.gear === 0) {
    launchDragPlayer();
    return;
  }
  if (race.gear >= 6) {
    el.shiftReadout.textContent = "Top";
    return;
  }
  const ideal = 0.73;
  const diff = Math.abs(race.rpm - ideal);
  const torque = race.playerTorque ?? 0.5;
  let label = "Early";
  let multiplier = 0.72 + torque * 0.16;

  if (diff <= race.shiftWindow) {
    label = diff < race.shiftWindow * 0.38 ? "Perfect" : "Good";
    multiplier = label === "Perfect" ? 1.06 + torque * 0.08 : 1 + torque * 0.05;
  } else if (race.rpm > ideal) {
    label = "Late";
    multiplier = 0.78 + torque * 0.16;
  }

  race.shiftScore.push(label);
  if (label === "Perfect" || label === "Good") {
    race.nitroCharge = Math.min(4, race.nitroCharge + 1);
  }
  race.accelPenalty = {
    Perfect: 1.04 + torque * 0.06,
    Good: 0.98 + torque * 0.04,
    Late: 0.58 + torque * 0.3,
    Early: 0.52 + torque * 0.3
  }[label] || 1;
  race.overheatLatched = false;
  race.playerSpeed *= multiplier;
  const nextGear = Math.min(6, race.gear + 1);
  if (nextGear === 6) {
    race.topGearBoost = topGearBoostForShift(label);
  }
  race.gear = nextGear;
  updateGearshiftIndicator(true);
  playSound("engine-shift");
  race.rpm = race.gear === 6 ? 0.74 : Math.max(0.22, 0.34 - race.gear * 0.015);
  el.shiftReadout.textContent = label;
  updateNitroHud();
  beep(label);
}

function updateDragNitroTimers(dt) {
  if (race.nitroTimer > 0) {
    race.nitroTimer = Math.max(0, race.nitroTimer - dt);
    race.nitroActive = race.nitroTimer > 0;
  }
}

function updateOpponentNitro(opponent, dt) {
  if (opponent.nitroTimer > 0) {
    opponent.nitroTimer = Math.max(0, opponent.nitroTimer - dt);
    opponent.nitroActive = opponent.nitroTimer > 0;
  }
  if (opponent.nitroDelay > 0) opponent.nitroDelay = Math.max(0, opponent.nitroDelay - dt);
  opponent.shiftTimer -= dt;
  if (opponent.shiftTimer <= 0 && opponent.nitroCharge < 4) {
    const cleanShiftChance = 0.42 + opponent.nitroSkill * 0.5;
    if (Math.random() < cleanShiftChance) {
      opponent.nitroCharge = Math.min(4, opponent.nitroCharge + 1);
    }
    opponent.shiftTimer = Math.max(0.62, 1.22 - opponent.nitroSkill * 0.42 + Math.random() * 0.22);
  }
  if (opponent.nitroUsed || opponent.nitroCharge < 4 || opponent.nitroActive || opponent.nitroDelay > 0) return;
  const progress = opponent.distance / race.target;
  const behind = opponent.distance < race.playerDistance;
  const panicUse = behind && progress > 0.36 + (1 - opponent.nitroSkill) * 0.25;
  const smartUse = progress > 0.58 - opponent.nitroSkill * 0.18;
  const badUse = Math.random() < (0.004 + opponent.nitroSkill * 0.002);
  if (panicUse || smartUse || badUse) {
    useOpponentNitro(opponent);
  }
}

function useNitro() {
  if (!race?.active || race.finished || race.gear === 0 || race.nitroCharge < 4 || race.nitroActive) return;
  race.nitroCharge = 0;
  race.nitroActive = true;
  race.nitroTimer = dragNitroDuration;
  race.playerSpeed = Math.min(race.playerSpeed * dragNitroMultiplier, race.playerMaxSpeed * dragNitroMultiplier);
  el.shiftReadout.textContent = "Nitro";
  playSound("engine-nitro");
  updateNitroHud();
}

function renderSproxWallet() {
  if (el.sproxTotal) el.sproxTotal.textContent = formatSprox();
}

function showToast(title, message) {
  const toast = document.createElement("div");
  toast.className = "game-toast";
  toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("active"));
  setTimeout(() => {
    toast.classList.remove("active");
    setTimeout(() => toast.remove(), 240);
  }, 3200);
}

function useOpponentNitro(opponent) {
  opponent.nitroCharge = 0;
  opponent.nitroActive = true;
  opponent.nitroUsed = true;
  opponent.nitroTimer = dragNitroDuration;
  opponent.nitroDelay = 2.2 + (1 - opponent.nitroSkill) * 1.2;
  opponent.speed = Math.min(opponent.speed * dragNitroMultiplier, opponent.maxSpeed * dragNitroMultiplier);
}

function updateNitroHud() {
  const charge = race?.nitroCharge || 0;
  const percent = Math.round((charge / 4) * 100);
  if (el.nitroFill) el.nitroFill.style.width = `${percent}%`;
  if (el.nitroReadout) el.nitroReadout.textContent = race?.nitroActive ? "BOOST" : `${percent}%`;
  if (el.nitroButton) {
    const ready = Boolean(race?.active && !race.finished && charge >= 4 && !race.nitroActive);
    el.nitroButton.disabled = !ready;
    el.nitroButton.classList.toggle("ready", ready);
  }
}

function topGearBoostForShift(label) {
  return {
    Perfect: 1.18,
    Good: 1.08,
    Late: 0.94,
    Early: 0.88
  }[label] || 1;
}

function finishRace(playerWon) {
  race.active = false;
  race.finished = true;
  playSound(playerWon ? "win-jingle" : "lose-jingle");
  race.nitroActive = false;
  race.rivalNitroActive = false;
  (race.opponents || []).forEach((opponent) => {
    opponent.nitroActive = false;
  });
  drawRace();
  const finishedRace = race;
  const isGauntlet = Boolean(finishedRace.gauntlet);
  const isStoryRace = finishedRace.campaignLevelIndex !== null && finishedRace.campaignLevelIndex !== undefined;
  const finishedLevel = isStoryRace ? campaignLevels[finishedRace.campaignLevelIndex] : null;
  const pinkSlipCarId = finishedLevel?.type === "pink-slip" ? finishedLevel.pinkSlipCarId : null;
  let partReward = null;
  let pinkSlipPenaltyLine = "";
  const riskyPinkSlipLoss = !playerWon && isPinkSlipRiskActive(finishedLevel);

  let earned = 0;
  if (playerWon && !isGauntlet) {
    earned = Math.floor(race.distance.xp * race.rank.xpBonus * difficultyMultiplier());
    addSprox(earned);
    if (tutorialActive()) state.tutorialDragSprox = earned;
    const rankIndex = ranks.findIndex((rank) => rank.key === race.rank.key);
    if (rankIndex === state.highestRankIndex && state.highestRankIndex < ranks.length - 1) {
      state.highestRankIndex += 1;
    }
    el.raceMessage.className = "race-message win";
    el.raceMessage.textContent = "";
  } else if (!isGauntlet) {
    earned = tutorialActive() ? 0 : Math.floor(race.distance.xp * 0.16);
    if (earned) addSprox(earned);
    el.raceMessage.className = "race-message loss";
    el.raceMessage.textContent = "";
  }

  recordRaceUsage(finishedRace.carId);
  recordStoryRaceOutcome(playerWon, isStoryRace);
  if (riskyPinkSlipLoss) {
    applyPinkSlipLossPenalty(finishedRace.carId);
    pinkSlipPenaltyLine = "You lost the Pink Slip race. Your GearBorn has been returned to Level 1 and its equipped parts were taken.";
  }
  if (!isGauntlet && isStoryRace && playerWon) partReward = rollStoryPartReward();
  const medalResult = !isGauntlet && isStoryRace
    ? saveStoryMedal(finishedRace.campaignLevelIndex, { won: playerWon })
    : { medal: "none", improved: false };
  evaluateMicroObjectives({ eventId: isStoryRace ? storyEventId(finishedRace.campaignLevelIndex) : "drag", won: playerWon });
  saveState();
  if (!isGauntlet && isStoryRace && playerWon) {
    completeCampaignLevel(finishedRace.campaignLevelIndex);
  }
  render();
  showRaceResult(el.dragTrack, {
    won: playerWon,
    title: tutorialActive() && !playerWon ? "RACE LOST" : undefined,
    sprox: earned,
    medal: playerWon ? medalResult.medal : "none",
    medalImproved: medalResult.improved,
    lines: [pinkSlipPenaltyLine, partReward ? partRewardResultMarkup(partReward) : ""].filter(Boolean),
    primaryLabel: isGauntlet ? "Next" : tutorialActive() ? (playerWon ? "Next" : "Try Again") : isStoryRace ? "Next" : "Select Opponent",
    primaryTone: tutorialActive() && playerWon ? "success" : "",
    raceAgainLabel: "Race Again",
    hideRaceAgain: tutorialActive() && !playerWon,
    hideSprox: tutorialActive() && !playerWon,
    disableActions: tutorialActive() && playerWon,
    onPrimary: () => {
      if (tutorialActive() && !playerWon) {
        prepareDragRace(null, tutorialDragStage());
        startPendingDragRace();
        setTutorialScene("drag-race-win");
        saveState();
        renderTutorial();
        return;
      }
      if (tutorialActive() && playerWon && currentTutorialScene().id === "drag-race-win") {
        advanceTutorial();
        return;
      }
      if (isGauntlet) {
        completeGauntletStage(playerWon);
        finishStoryRaceScreen();
        return;
      }
      if (isStoryRace) {
        const finishStory = () => {
          finishStoryRaceScreen();
        };
        if (playerWon && pinkSlipCarId && !isCarUnlocked(pinkSlipCarId)) {
          showPinkSlipUnlock(pinkSlipCarId, finishStory);
          return;
        }
        if (playerWon && finishedLevel?.type === "rival") {
          openRivalDialogue(finishedLevel, "post", finishStory);
          return;
        }
        finishStory();
      } else {
        setFlowStep("drag", "match");
      }
    },
    onRaceAgain: () => {
      if (isGauntlet) {
        startMedallionGauntlet(finishedRace.gauntlet.cityId);
      } else if (isStoryRace) {
        startCampaignRace(finishedRace.campaignLevelIndex, campaignLevels[finishedRace.campaignLevelIndex]);
      } else {
        prepareDragRace(null, null);
      }
    }
  });
}

function failDragRace(title) {
  if (!race?.active || race.finished) return;
  race.active = false;
  race.finished = true;
  race.nitroActive = false;
  race.rivalNitroActive = false;
  (race.opponents || []).forEach((opponent) => {
    opponent.nitroActive = false;
  });
  drawRace();
  const failedRace = race;
  const isGauntlet = Boolean(failedRace.gauntlet);
  const isStoryRace = failedRace.campaignLevelIndex !== null && failedRace.campaignLevelIndex !== undefined;
  const failedLevel = isStoryRace ? campaignLevels[failedRace.campaignLevelIndex] : null;
  let pinkSlipPenaltyLine = "";
  if (isPinkSlipRiskActive(failedLevel)) {
    applyPinkSlipLossPenalty(failedRace.carId);
    maybeTriggerRoyalFlushGauntlet(storyCityForCampaignIndex(failedRace.campaignLevelIndex)?.id);
    pinkSlipPenaltyLine = "You lost the Pink Slip race. Your GearBorn has been returned to Level 1 and its equipped parts were taken.";
  }
  recordStoryRaceOutcome(false, isStoryRace);
  const medalResult = !isGauntlet && isStoryRace
    ? saveStoryMedal(failedRace.campaignLevelIndex, { won: false })
    : { medal: "none", improved: false };
  saveState();
  el.raceMessage.className = "race-message loss";
  el.raceMessage.textContent = "";
  showRaceResult(el.dragTrack, {
    won: false,
    title: tutorialActive() ? "RACE LOST" : title,
    sprox: 0,
    medal: "none",
    medalImproved: medalResult.improved,
    primaryLabel: isGauntlet ? "Next" : tutorialActive() ? "Try Again" : isStoryRace ? "Next" : "Select Opponent",
    raceAgainLabel: "Race Again",
    lines: pinkSlipPenaltyLine ? [pinkSlipPenaltyLine] : [],
    hideRaceAgain: tutorialActive(),
    hideSprox: tutorialActive(),
    onPrimary: () => {
      if (tutorialActive()) {
        prepareDragRace(null, tutorialDragStage());
        startPendingDragRace();
        setTutorialScene("drag-race-win");
        saveState();
        renderTutorial();
        return;
      }
      if (isGauntlet) {
        completeGauntletStage(false);
        finishStoryRaceScreen();
      } else if (isStoryRace) {
        finishStoryRaceScreen();
      } else {
        setFlowStep("drag", "match");
      }
    },
    onRaceAgain: () => {
      if (isGauntlet) {
        startMedallionGauntlet(failedRace.gauntlet.cityId);
      } else if (isStoryRace) {
        startCampaignRace(failedRace.campaignLevelIndex, campaignLevels[failedRace.campaignLevelIndex]);
      } else {
        prepareDragRace(null, null);
      }
    }
  });
}

function showRaceResult(trackNode, result) {
  if (!trackNode) {
    result.onPrimary?.();
    return;
  }
  trackNode.querySelectorAll(".race-result-popup").forEach((node) => node.remove());
  const popup = document.createElement("div");
  popup.className = `race-result-popup ${result.won ? "win" : "loss"} ${result.disableActions ? "tutorial-passive" : ""}`;
  popup.innerHTML = `
    <div class="race-result-card">
      <h2>${result.title || (result.won ? "Victory" : "Defeat")}</h2>
      ${medalResultMarkup(result.medal, result.medalImproved)}
      ${result.hideSprox ? "" : `<p>Sprox Earned: <strong>${sproxResultMarkup(result.sprox ?? 0)}</strong></p>`}
      ${(result.lines || []).map((line) => `<p>${line}</p>`).join("")}
      <div class="race-result-actions">
        <button class="primary ${result.primaryTone === "success" ? "success-result" : ""}" type="button" data-result-action="primary" ${result.disableActions ? "disabled" : ""}>${result.primaryLabel || "Continue"}</button>
        ${result.hideRaceAgain ? "" : `<button class="ghost" type="button" data-result-action="again" ${result.disableActions ? "disabled" : ""}>${result.raceAgainLabel || "Race Again"}</button>`}
      </div>
    </div>
  `;
  popup.addEventListener("click", (event) => {
    const button = event.target.closest("[data-result-action]");
    if (!button || button.disabled) return;
    const action = button.dataset.resultAction;
    playAudioCue("uiConfirm");
    popup.remove();
    if (action === "again") {
      result.onRaceAgain?.();
      return;
    }
    result.onPrimary?.();
  });
  trackNode.appendChild(popup);
  animateCountUpNumbers(popup);
  if (normalizeMedal(result.medal) !== "none") playAudioCue("medalReveal");
}

function clearRaceResultPopups() {
  document.querySelectorAll(".race-result-popup").forEach((node) => node.remove());
  if (el.betaResults) el.betaResults.hidden = true;
  if (el.beta3dResults) el.beta3dResults.hidden = true;
  window.setTimeout(playQueuedBondScene, 80);
}

function animateCountUpNumbers(root) {
  if (reduceMotionEnabled()) {
    root.querySelectorAll(".count-up-number").forEach((node) => {
      node.textContent = formatSprox(Number(node.dataset.countTarget) || 0);
    });
    return;
  }
  root.querySelectorAll(".count-up-number").forEach((node) => {
    const target = Math.max(0, Math.floor(Number(node.dataset.countTarget) || 0));
    const start = performance.now();
    const duration = 520;
    const tick = (now) => {
      const pct = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - pct, 3);
      node.textContent = formatSprox(Math.round(target * eased));
      if (pct < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function finishStoryRaceScreen() {
  if (race) race.active = false;
  if (verticalRace) verticalRace.active = false;
  if (viewIsActive("beta")) showView("story");
  restoreEmbeddedCampaignRace();
  storyReplayOpen = false;
  closeStoryPreview();
  closeCitySelect();
  setFlowStep("story", "next");
  if (pendingCityUnlock) {
    const city = pendingCityUnlock;
    pendingCityUnlock = null;
    openCityUnlockModal(city);
  }
}

function showPendingEvolution(carId) {
  const progress = state.garage[carId];
  if (!progress.pendingEvolution) return;
  const currentForm = currentEvolution(carId);
  const nextForm = evolutionByIndex(carId, progress.pendingEvolution);
  evolutionModal = { mode: "ready", carId, evolution: progress.pendingEvolution };
  el.evolutionModal.classList.remove("evolution-unlocked");
  el.evolutionKicker.textContent = "Evolution Ready";
  el.evolutionTitle.textContent = `${currentForm.name} is ready to evolve`;
  el.evolutionCopy.textContent = "The next Gearborn form is charged and waiting.";
  el.evolveButton.hidden = false;
  // During tutorial evolve scene, disable evolve button until dialogue finishes
  el.evolveButton.disabled = tutorialActive() && !state.tutorialAwaitingEvolve;
  el.closeEvolution.textContent = "Later";
  // In tutorial, "Later" is hidden — you must evolve
  el.closeEvolution.hidden = tutorialActive();
  el.evolutionStage.innerHTML = carMarkupForEvolution(carId, progress.evolution, "display");
  el.evolutionModal.classList.add("active");
  el.evolutionModal.setAttribute("aria-hidden", "false");
  el.evolveButton.focus();
}

function revealEvolution(carId, evolutionIndex) {
  const progress = state.garage[carId];
  progress.unlockedEvolution = Math.max(progress.unlockedEvolution ?? progress.evolution ?? 0, evolutionIndex);
  progress.evolution = evolutionIndex;
  progress.pendingEvolution = null;
  const eligibleEvolution = maxEligibleEvolutionForCar(carId, progress.level);
  if (eligibleEvolution > unlockedEvolutionIndex(carId)) {
    progress.pendingEvolution = unlockedEvolutionIndex(carId) + 1;
  }
  const unlockedCarId = unlockSecretCars();
  maybeTriggerRidesHairGauntlet();
  const form = currentEvolution(carId);
  evolutionModal = { mode: "unlocked", carId, evolution: evolutionIndex };
  el.evolutionModal.classList.add("evolution-unlocked");
  el.evolutionKicker.textContent = "Evolution Unlocked";
  el.evolutionTitle.textContent = unlockedCarId === "rainbowlt"
    ? "You've unlocked Rainbowlt"
    : `You've unlocked ${form.name}`;
  el.evolutionCopy.textContent = unlockedCarId === "rainbowlt"
    ? "Rainbowlt has joined your garage at level 1."
    : "This form is now available in your garage and ready to race.";
  el.evolveButton.hidden = true;
  el.closeEvolution.textContent = "Continue";
  el.evolutionStage.innerHTML = unlockedCarId === "rainbowlt"
    ? carMarkupForEvolution("rainbowlt", 0, "display")
    : carMarkupForEvolution(carId, evolutionIndex, "display");
  saveState();
  render();
}

function preloadImage(src) {
  if (!src) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

async function playEvolutionAnimation(carId, evolutionIndex, onReveal) {
  if (!el.evolutionAnimation || evolutionAnimationActive) {
    onReveal?.();
    return;
  }
  const currentForm = currentEvolution(carId);
  const nextForm = evolutionByIndex(carId, evolutionIndex);
  const currentImage = imageFor(currentForm, "display");
  const nextImage = imageFor(nextForm, "display");
  let revealed = false;
  const revealOnce = () => {
    if (revealed) return;
    revealed = true;
    playAudioCue("evolutionReveal");
    playSound("evolve-cue");
    onReveal?.();
    if (featureEnabled("enableEvolutionPolish")) showToast("EVOLUTION_REVEAL_PLACEHOLDER_TITLE", "EVOLUTION_REVEAL_PLACEHOLDER_BODY");
  };
  evolutionAnimationActive = true;
  playAudioCue("evolutionBuild");
  playSound("evolve-cue");

  // Load images into the overlay
  el.evolutionAnimationCurrent.src = currentImage;
  el.evolutionAnimationCurrent.alt = currentForm?.name || "";
  el.evolutionAnimationNext.src = nextImage;
  el.evolutionAnimationNext.alt = nextForm?.name || "";
  await Promise.all([preloadImage(currentImage), preloadImage(nextImage)]);

  // Reset and start the CSS animation (glow, shake, flash, ring)
  el.evolutionAnimation.classList.remove("run");
  el.evolutionAnimation.setAttribute("aria-hidden", "false");
  el.evolutionAnimation.classList.add("active");
  void el.evolutionAnimation.offsetWidth; // force reflow to restart animation
  el.evolutionAnimation.classList.add("run");

  // Ensure starting state: current visible, next hidden
  el.evolutionAnimationCurrent.style.opacity = "1";
  el.evolutionAnimationNext.style.opacity = "0";

  // JS-driven flicker schedule (milliseconds from animation start)
  // Slow blinks start at 4s, build to rapid strobe, flash+lock at 8s
  const flickerSchedule = [
    // [time_ms, showNext_bool]  — each entry swaps which form is shown
    [4000, true],  [4350, false], [4700, true],  [5050, false], // slow (350ms each)
    [5200, true],  [5420, false], [5640, true],  [5860, false], // medium (220ms)
    [6000, true],  [6180, false], [6360, true],  [6540, false], // faster (180ms)
    [6680, true],  [6820, false], [6960, true],  [7100, false], // fast (140ms)
    [7220, true],  [7330, false], [7440, true],  [7550, false], // rapid (110ms)
    [7650, true],  [7740, false], [7830, true],  [7920, false], // strobe (90ms)
    [8000, true],  [8060, false], [8120, true],  [8180, false], [8240, true], // very fast
    // Flash fires at ~8030ms via CSS. Lock evolved form on after:
    [8300, true],  // lock: show evolved form permanently
  ];

  const startTime = performance.now();
  const timers = [];

  flickerSchedule.forEach(([delay, showNext]) => {
    timers.push(window.setTimeout(() => {
      el.evolutionAnimationCurrent.style.opacity = showNext ? "0" : "1";
      el.evolutionAnimationNext.style.opacity = showNext ? "1" : "0";
    }, delay));
  });

  // Wait for full 11s animation to complete
  await new Promise((resolve) => window.setTimeout(resolve, 11000));

  // Cleanup
  timers.forEach((t) => window.clearTimeout(t));

  // Ensure evolved form is shown at the end
  el.evolutionAnimationCurrent.style.opacity = "0";
  el.evolutionAnimationNext.style.opacity = "1";

  el.evolutionAnimation.classList.remove("active", "run");
  el.evolutionAnimation.setAttribute("aria-hidden", "true");
  evolutionAnimationActive = false;
  revealOnce();
}

function unlockGearbornLine(carId) {
  if (isCarUnlocked(carId)) return false;
  state.unlockedLines = state.unlockedLines || [...defaultUnlockedLines];
  state.unlockedLines.push(carId);
  state.unlockedCars = state.unlockedCars || {};
  state.unlockedCars[carId] = true;
  state.garage[carId] = {
    level: 1,
    xp: 0,
    evolution: 0,
    unlockedEvolution: 0,
    pendingEvolution: null
  };
  if (featureEnabled("enableVINdexRevealNotifications")) {
    playAudioCue("newVindexEntry");
    showToast("VINDEX_ENTRY_UNLOCKED_PLACEHOLDER_TITLE", "VINDEX_ENTRY_UNLOCKED_PLACEHOLDER_BODY");
  }
  saveState();
  render();
  return true;
}

function awardMedallion(carId) {
  state.medallionsOwned = state.medallionsOwned || [];
  if (!state.medallionsOwned.includes(carId)) state.medallionsOwned.push(carId);
  saveState();
}

function hasMedallion(carId) {
  return (state.medallionsOwned || []).includes(carId);
}

function showPinkSlipUnlock(carId, onContinue) {
  const car = cars.find((item) => item.id === carId);
  if (!car) { onContinue?.(); return; }
  awardMedallion(carId);
  pendingPinkSlipContinue = onContinue;
  showMedallionEarnedPopup(carId, onContinue);
}

// ─── MEDALLION EARNED POPUP ──────────────────────────────────────────────────
function showMedallionEarnedPopup(carId, onContinue) {
  const car = cars.find((c) => c.id === carId);
  if (!car) { onContinue?.(); return; }
  const form = car.evolutions[0];
  const popup = el.medallionEarnedPopup;
  if (!popup) { onContinue?.(); return; }
  popup.querySelector("#medallion-earned-name").innerHTML =
    `You have earned the <strong>${form.name}</strong> <span class="medallion-gold">Medallion</span>.`;
  const imgEl = popup.querySelector("#medallion-earned-img");
  imgEl.src = forgeMedallionSrc(carId);
  imgEl.alt = form.name + " Medallion";
  popup.classList.add("active");
  popup.removeAttribute("hidden");
  popup.setAttribute("aria-hidden", "false");
  const handleForge = () => {
    popup.classList.remove("active");
    popup.setAttribute("hidden", "");
    popup.setAttribute("aria-hidden", "true");
    onContinue?.();
    showView("garage");
    openForge();
  };
  const handleLater = () => {
    popup.classList.remove("active");
    popup.setAttribute("hidden", "");
    popup.setAttribute("aria-hidden", "true");
    onContinue?.();
  };
  popup.querySelector("#medallion-go-forge").addEventListener("click", handleForge, { once: true });
  popup.querySelector("#medallion-later").addEventListener("click", handleLater, { once: true });
}

// ─── THE FORGE ───────────────────────────────────────────────────────────────
const forgeMedallionMap = {
  "bee":                "assets/medallions/medallion-baybee.png",
  "pickup":             "assets/medallions/medallion-murrka.png",
  "pig":                "assets/medallions/medallion-hogson.png",
  "rabbit":             "assets/medallions/medallion-bunnae.png",
  "whale":              "assets/medallions/medallion-totorca.png",
  "frog":               "assets/medallions/medallion-rivvir.png",
  "techno-dinosaur":    "assets/medallions/medallion-shufflodon.png",
  "sorority-elephant":  "assets/medallions/medallion-elepledge.png",
  "florida-gator":      "assets/medallions/medallion-gladigator.png",
  "grunge-fish":        "assets/medallions/medallion-moshfin.png",
  "karate-cow":         "assets/medallions/medallion-udderlee.png",
  "art-van":            "assets/medallions/medallion-vanvass.png",
  "cake-train":         "assets/medallions/medallion-cuptrack.png",
  "muscle-man":         "assets/medallions/medallion-tourquette.png",
  "waste-management":   "assets/medallions/medallion-garbaggito.png",
  "chill-penguin":      "assets/medallions/medallion-freezy-e.png",
  "space-dolphin":      "assets/medallions/medallion-orbitide.png",
  "butcher-hog":        "assets/medallions/medallion-sauspin.png",
  "tiger-cart":         "assets/medallions/medallion-puttercat.png",
  "gb-growler":         "assets/medallions/medallion-cruzdog.png",
  "armadaddio":         "assets/medallions/medallion-manscape.png",
  "electro-beetle":     "assets/medallions/medallion-bertie.png",
  "flavor-coast":       "assets/medallions/medallion-carmieri.png",
  "future-bok":         "assets/medallions/medallion-sprynza.png",
  "wrestler-roo":       "assets/medallions/medallion-rumbleroo.png",
  "silly-goose":        "assets/medallions/medallion-honky.png",
  "construction-blok":  "assets/medallions/medallion-blokparty.png",
  "skater-koala":       "assets/medallions/medallion-koaster.png",
  "royal-flush":        "assets/medallions/medallion-whiffleton.png",
  "rides-hair":         "assets/medallions/medallion-staschel.png",
  "hornula1":           "assets/medallions/medallion-hornula1.png",
};

function forgeMedallionSrc(carId) {
  return forgeMedallionMap[carId] || "";
}

let forgeSelectedCarId = null;
let forgeAnimating = false;

function openForge() {
  showView("garage");
  forgeSelectedCarId = null;
  forgeAnimating = false;
  const spindell = activeUnlockHub() === "spindellLabs";
  if (el.forgePanel) {
    el.forgePanel.classList.toggle("spindell-labs-view", spindell);
    el.forgePanel.classList.toggle("forge-unlock-view", !spindell);
  }
  if (el.forgeKicker) el.forgeKicker.textContent = spindell ? "Spindell Labs" : "The Forge";
  if (el.forgeTitle) el.forgeTitle.textContent = spindell ? "Spindell Labs" : "Forge what's next.";
  if (el.forgeSubtitle) {
    el.forgeSubtitle.textContent = spindell
      ? "Unlock medallions through precision key calibration. Guide: Orion Vincent."
      : "Forge Unlock. The Forge answers. Guide: Auntie.";
  }
  const sceneBg = document.querySelector(".forge-bg-img");
  const fullBg = document.querySelector(".forge-fs-bg");
  if (sceneBg) sceneBg.src = spindell ? "assets/spindell/spindell-bg.png" : "assets/forge/forge_bg.png";
  if (fullBg) fullBg.src = spindell ? "assets/spindell/spindell-bg.png" : "assets/forge/forge_bg.png";
  if (el.forgeVatImg) {
    el.forgeVatImg.src = spindell ? "assets/spindell/spindell-sync-port.png" : "assets/forge/forge_vat.png";
    el.forgeVatImg.alt = spindell ? "Spindell sync port" : "The Forge vat";
  }
  if (el.forgeInventoryPanel) el.forgeInventoryPanel.setAttribute("hidden", "");
  if (el.forgeUnlockBtn) { el.forgeUnlockBtn.disabled = true; el.forgeUnlockBtn.textContent = spindell ? "Select a Key" : "Select a Medallion"; }
  if (el.forgeAnimationArea) {
    el.forgeAnimationArea.innerHTML = spindell
      ? `<img class="spindell-idle-sync-tube" src="assets/spindell/spindell-sync-tube.png" alt="" aria-hidden="true" onerror="this.hidden=true;">`
      : "";
    el.forgeAnimationArea.classList.remove("animating");
  }
  if (el.forgeSelectedMedallion) el.forgeSelectedMedallion.setAttribute("hidden", "");
  if (el.forgeSelectedName) el.forgeSelectedName.textContent = spindell ? "Select a key medallion to sync" : "Select a Medallion to unlock";
  // Show forge panel inside garage-view, hide garage content
  if (el.garageContent) el.garageContent.hidden = true;
  if (el.forgePanel) el.forgePanel.hidden = false;
  renderForgeInventory();
}

function closeForge() {
  // Hide forge panel, restore garage content
  if (el.forgePanel) el.forgePanel.hidden = true;
  if (el.garageContent) el.garageContent.hidden = false;
  // Stay on garage view
  render();
}

function renderForgeInventory() {
  if (!el.forgeMedallionGrid) return;
  // During tutorial forge scene, show only the 3 demo medallions awarded for this demo
  const tutorialForgeDemoIds = ["bee", "pickup", "rabbit"];
  const tutorialForge = tutorialActive() && state.tutorialAwaitingForge;
  const owned = tutorialForge
    ? tutorialForgeDemoIds
    : (state.medallionsOwned || []).filter((id) => !isCarUnlocked(id));
  el.forgeMedallionGrid.innerHTML = owned.length
    ? owned.map((carId) => {
        const car = cars.find((c) => c.id === carId);
        const form = car?.evolutions?.[0];
        const src = forgeMedallionSrc(carId);
        const active = forgeSelectedCarId === carId ? " active" : "";
        return `<button class="forge-medallion-tile${active}" data-forge-car="${carId}" type="button" aria-label="${form?.name || carId} Medallion">
          ${src ? `<img src="${src}" alt="${form?.name || carId}" onerror="this.style.opacity='.3'">` : ""}
          <span>${form?.name || carId}</span>
        </button>`;
      }).join("")
    : `<p class="forge-empty">No medallions yet. Win Pink Slip races to earn them.</p>`;
}

function selectForgeMedallion(carId) {
  forgeSelectedCarId = carId;
  renderForgeInventory();
  const car = cars.find((c) => c.id === carId);
  const form = car?.evolutions?.[0];
  if (el.forgeSelectedName) el.forgeSelectedName.textContent = form?.name || carId;
  if (el.forgeSelectedMedallion) {
    el.forgeSelectedMedallion.src = forgeMedallionSrc(carId);
    el.forgeSelectedMedallion.alt = (form?.name || carId) + " Medallion";
    el.forgeSelectedMedallion.removeAttribute("hidden");
  }
  el.forgeUnlockBtn.disabled = false;
  el.forgeUnlockBtn.textContent = activeUnlockHub() === "spindellLabs" ? `Sync ${form?.name || carId}` : `Unlock ${form?.name || carId}`;
}

async function runForgeAnimation(carId) {
  if (forgeAnimating) return;
  if (!forgeSelectedCarId || forgeSelectedCarId !== carId) return;
  if (!(state.medallionsOwned || []).includes(carId)) return;
  if (isCarUnlocked(carId)) return;
  const animationType = unlockAnimationType();
  forgeAnimating = true;
  if (el.forgeUnlockBtn) el.forgeUnlockBtn.disabled = true;

  const overlay = document.getElementById("forge-fullscreen");
  const area    = document.getElementById("forge-fs-anim-area");
  const fsVat   = document.getElementById("forge-fs-vat");
  if (!overlay || !area) {
    forgeAnimating = false;
    if (el.forgeUnlockBtn) el.forgeUnlockBtn.disabled = false;
    return;
  }

  let unlocked = false;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const speed = reduced ? 0.35 : 1;
  const step = (ms) => new Promise((r) => setTimeout(r, Math.max(80, Math.round(ms * speed))));
  const add = (node, className) => node?.classList.add(className);
  const remove = (node, className) => node?.classList.remove(className);
  const runSpindellKeySyncSequence = async () => {
    const fsBg = document.querySelector(".forge-fs-bg");
    if (fsBg) fsBg.src = "assets/spindell/spindell-bg.png";
    if (fsVat) {
      fsVat.src = "assets/spindell/spindell-sync-port.png";
      fsVat.alt = "Spindell sync port";
    }
    area.innerHTML = `
      <img class="spindell-sync-layer spindell-sync-medallion" src="${forgeMedallionSrc(carId)}" alt="Medallion" onerror="this.classList.add('asset-missing')">
      <img class="spindell-sync-layer spindell-sync-key" src="assets/items/gearborn-key.png" alt="GearBorn Key" onerror="this.classList.add('asset-missing')">
      <img class="spindell-sync-layer spindell-sync-tube-anim" src="assets/spindell/spindell-sync-tube.png" alt="" onerror="this.classList.add('asset-missing')">
      <img class="spindell-sync-layer spindell-sync-arm" src="assets/spindell/spindell-magnetic-arm.png" alt="" onerror="this.classList.add('asset-missing')">
      <div class="spindell-sync-layer spindell-sync-flash-layer"></div>
      <div class="spindell-sync-layer spindell-key-display">
        <img class="vinsync-complete-screen" src="assets/spindell/vinsync-complete-screen.png" alt="" onerror="this.classList.add('asset-missing')">
        <img class="vinsync-pixel-car" src="assets/spindell/pixel/pixel-car.png" alt="" onerror="this.hidden=true">
      </div>
    `;
    const getSync = (cls) => area.querySelector("." + cls);
    const medallionEl = getSync("spindell-sync-medallion");
    const keyEl = getSync("spindell-sync-key");
    const tubeEl = getSync("spindell-sync-tube-anim");
    const armEl = getSync("spindell-sync-arm");
    const flashEl = getSync("spindell-sync-flash-layer");
    const displayEl = getSync("spindell-key-display");
    await step(180);
    add(medallionEl, "spindell-sync-active");
    await step(520);
    add(medallionEl, "spindell-sync-port-power");
    await step(420);
    add(keyEl, "spindell-sync-key-active");
    await step(520);
    add(fsVat, "spindell-sync-port-power");
    await step(620);
    add(armEl, "spindell-sync-arm-descend");
    await step(620);
    add(armEl, "spindell-sync-arm-clamp");
    add(tubeEl, "spindell-sync-arm-clamp");
    await step(420);
    add(tubeEl, "spindell-sync-tube-lift");
    add(armEl, "spindell-sync-tube-lift");
    await step(860);
    add(flashEl, "spindell-sync-flash");
    await step(360);
    remove(tubeEl, "spindell-sync-tube-lift");
    remove(armEl, "spindell-sync-tube-lift");
    add(tubeEl, "spindell-sync-new-tube-descend");
    await step(760);
    add(displayEl, "spindell-sync-complete");
    await step(1500);
  };

  try {
    area.innerHTML = "";
    overlay.classList.add("active");
    overlay.classList.toggle("spindell-key-sync-animation", animationType === "spindellKeySync");
    overlay.classList.toggle("forge-unlock-animation", animationType === "forgeUnlock");
    overlay.setAttribute("aria-hidden", "false");
    playAudioCue("evolutionBuild");

    if (animationType === "spindellKeySync") {
      await runSpindellKeySyncSequence();
    } else {
      area.innerHTML = `
      <img class="forge-anim-layer forge-anim-medallion" src="${forgeMedallionSrc(carId)}" alt="Medallion" onerror="this.classList.add('asset-missing')">
      <img class="forge-anim-layer forge-anim-smoke"    src="assets/forge/forge_smoke.png" alt="" onerror="this.classList.add('asset-missing')">
      <img class="forge-anim-layer forge-anim-platform" src="assets/forge/forge_platform_stage.png" alt="" onerror="this.classList.add('asset-missing')">
      <div class="forge-anim-layer forge-anim-car-reveal">${carMarkupForEvolution(carId, 0, "display")}</div>
      <img class="forge-anim-layer forge-anim-cover"    src="assets/forge/forge_cover_stage.png" alt="" onerror="this.classList.add('asset-missing')">
      <img class="forge-anim-layer forge-anim-magnet"   src="assets/forge/forge_magnet_stage.png" alt="" onerror="this.classList.add('asset-missing')">
    `;

    const get = (cls) => area.querySelector("." + cls);
    const medallionEl = get("forge-anim-medallion");
    const platformEl  = get("forge-anim-platform");
    const coverEl     = get("forge-anim-cover");
    const magnetEl    = get("forge-anim-magnet");
    const carEl       = get("forge-anim-car-reveal");
    const smokeEl     = get("forge-anim-smoke");

    await step(180);
    add(medallionEl, "step-appear");
    await step(760);
    add(medallionEl, "step-drop");
    await step(820);
    add(medallionEl, "step-gone");

    add(fsVat, "forge-shake");
    add(smokeEl, "step-smoke");
    await step(1800);
    remove(fsVat, "forge-shake");

    add(platformEl, "step-rise");
    add(coverEl, "step-rise");
    await step(1180);

    add(magnetEl, "step-magnet-drop");
    await step(760);
    await step(260);

    add(coverEl, "step-lift");
    add(magnetEl, "step-magnet-lift");
    await step(820);
    add(coverEl, "step-gone");
    add(magnetEl, "step-gone");

    playAudioCue("evolutionReveal");
    add(carEl, "step-reveal");
    await step(2800);
    }

    if (!(state.medallionsOwned || []).includes(carId) || isCarUnlocked(carId)) return;
    unlockGearbornLine(carId);
    state.medallionsOwned = (state.medallionsOwned || []).filter((id) => id !== carId);
    unlocked = true;

    if (tutorialActive() && currentTutorialScene()?.id === "the-forge") {
      state.tutorialAwaitingForge = false;
      state.tutorialUnlockedCarId = carId;
    }
    saveState();
  } catch (error) {
    console.warn("Forge animation failed", error);
  } finally {
    remove(fsVat, "forge-shake");
    remove(fsVat, "spindell-sync-port-power");
    if (fsVat) fsVat.src = activeUnlockHub() === "spindellLabs" ? "assets/spindell/spindell-sync-port.png" : "assets/forge/forge_vat.png";
    overlay.classList.remove("active");
    overlay.classList.remove("spindell-key-sync-animation", "forge-unlock-animation");
    overlay.setAttribute("aria-hidden", "true");
    area.innerHTML = "";
    forgeAnimating = false;
    if (el.forgeUnlockBtn) el.forgeUnlockBtn.disabled = !forgeSelectedCarId || isCarUnlocked(forgeSelectedCarId);
  }

  if (unlocked) {
    render();
    showForgeUnlockedPopup(carId);
  } else {
    renderForgeInventory();
  }
}

function showForgeUnlockedPopup(carId) {
  const car = cars.find((c) => c.id === carId);
  const form = car?.evolutions?.[0];
  const popup = el.forgeUnlockedPopup;
  if (!popup) return;

  // Capture tutorial state now — before anything else changes it
  const isForTutorial = tutorialActive();

  // Set car image
  const imgEl = popup.querySelector("#forge-unlocked-img");
  imgEl.src = imageFor(form, "display");
  imgEl.alt = form?.name || carId;

  // Set unlock text
  popup.querySelector("#forge-unlocked-name").textContent =
    `${form?.name || carId} has been unlocked. ${activeUnlockHub() === "spindellLabs" ? "Key Sync complete." : "The Forge answers."}`;

  // Remove hidden attr FIRST so display:flex from .active can work
  popup.removeAttribute("hidden");
  popup.classList.add("active");
  popup.classList.toggle("tutorial-passive", isForTutorial);
  popup.setAttribute("aria-hidden", "false");

  // If tutorial: advance to unlocked scene AND disable the Continue button
  // so the player follows the tutorial dialogue instead
  const closeBtn = popup.querySelector("#forge-unlocked-close");
  closeBtn.disabled = isForTutorial;

  if (isForTutorial) {
    setTutorialScene("unlocked");
    setupTutorialScene();
    renderTutorial();
  }

  // Replace button to avoid stale listeners from previous calls
  const freshBtn = closeBtn.cloneNode(true);
  closeBtn.replaceWith(freshBtn);
  // Re-apply disabled state after clone (cloneNode copies it, but be explicit)
  freshBtn.disabled = isForTutorial;

  freshBtn.addEventListener("click", () => {
    if (freshBtn.disabled) return;
    popup.classList.remove("active");
    popup.classList.remove("tutorial-passive");
    popup.setAttribute("hidden", "");
    popup.setAttribute("aria-hidden", "true");
    forgeSelectedCarId = null;
    if (el.forgeUnlockBtn) {
      el.forgeUnlockBtn.disabled = true;
      el.forgeUnlockBtn.textContent = "Select a Medallion";
    }
    if (el.forgeSelectedMedallion) el.forgeSelectedMedallion.setAttribute("hidden", "");
    if (el.forgeSelectedName) el.forgeSelectedName.textContent = "Select a Medallion to unlock";
    if (!isForTutorial) {
      closeForge();
      renderForgeInventory();
    }
  }, { once: true });
}

function applyPinkSlipLossPenalty(carId) {
  const car = cars.find((item) => item.id === carId);
  const progress = state.garage?.[carId];
  if (!car || !progress) return;
  (state.equippedParts?.[carId] || []).forEach((key) => {
    if (!key) return;
    state.partsInventory[key] = Math.max(0, (state.partsInventory[key] || 0) - 1);
  });
  state.equippedParts[carId] = [null, null];
  progress.level = 1;
  progress.xp = 0;
  progress.evolution = 0;
  progress.unlockedEvolution = 0;
  progress.pendingEvolution = null;
}

function closeEvolutionModal() {
  const continueAfterPinkSlip = evolutionModal?.mode === "pink-slip" ? pendingPinkSlipContinue : null;
  const wasJustEvolved = evolutionModal?.mode === "unlocked" && !tutorialActive();
  const tutorialEvolved = tutorialActive() && currentTutorialScene()?.id === "evolved-form";
  pendingPinkSlipContinue = null;
  evolutionModal = null;
  el.evolutionModal.classList.remove("evolution-unlocked");
  el.evolutionModal.classList.remove("active");
  el.evolutionModal.setAttribute("aria-hidden", "true");
  if (continueAfterPinkSlip) {
    continueAfterPinkSlip();
  } else if (tutorialEvolved) {
    // Tutorial: advance to vindex scene after player closes evolved form modal
    advanceTutorial();
  } else if (wasJustEvolved) {
    showView("garage");
    render();
    el.raceMessage.className = "race-message win";
    el.raceMessage.textContent = "Evolution Complete!";
  }
}

function openResetModal() {
  el.resetModal.classList.add("active");
  el.resetModal.setAttribute("aria-hidden", "false");
  el.confirmReset.focus();
}

function closeResetModal() {
  el.resetModal.classList.remove("active");
  el.resetModal.setAttribute("aria-hidden", "true");
}

function resetRacingData() {
  localStorage.removeItem(saveKey);
  state = structuredClone(defaultState);
  sanitizeState();
  race = null;
  verticalRace = null;
  battleState = null;
  pendingCutsceneStart = null;
  activeCutsceneLines = null;
  activeCutsceneIndex = 0;
  activeCutsceneContext = null;
  pendingDragRace = null;
  pendingIntroView = null;
  pendingPinkSlipContinue = null;
  pendingPinkSlipRiskStart = null;
  pendingBossRaceStart = null;
  pendingCityUnlock = null;
  storyReplayOpen = false;
  modeFlow.drag = "car";
  modeFlow.time = "car";
  modeFlow.boss = "car";
  modeFlow.battle = "car";
  modeFlow.story = "car";
  saveState();
  closeResetModal();
  closeEvolutionModal();
  closeUpgradeModal();
  closeStoryPreview();
  closeCitySelect();
  closeBossIntro();
  restoreEmbeddedCampaignRace();
  el.cutsceneModal?.classList.remove("active", "single-speaker");
  el.cutsceneModal?.setAttribute("aria-hidden", "true");
  el.tutorialOverlay?.classList.remove("active");
  el.tutorialOverlay?.setAttribute("aria-hidden", "true");
  showView("menu");
  el.playerRacer.style.transform = "translateX(0)";
  el.rivalRacer.style.transform = "translateX(0)";
  el.raceMessage.className = "race-message";
  el.raceMessage.textContent = "Racing data reset. Fresh garage, fresh rivals.";
  render();
  openFirstTutorialModal();
}

function openGodModal() {
  el.godCode.value = "";
  el.godCodeError.textContent = "";
  el.godModal.classList.add("active");
  el.godModal.setAttribute("aria-hidden", "false");
  el.godCode.focus();
}

function closeGodModal() {
  el.godModal.classList.remove("active");
  el.godModal.setAttribute("aria-hidden", "true");
  el.godCode.value = "";
  el.godCodeError.textContent = "";
}

function openTutorialReplayModal() {
  el.tutorialSceneOptions.hidden = true;
  el.tutorialReplayModal.classList.add("active");
  el.tutorialReplayModal.setAttribute("aria-hidden", "false");
  el.tutorialReplayYes.focus();
}

function closeTutorialReplayModal() {
  el.tutorialReplayModal.classList.remove("active");
  el.tutorialReplayModal.setAttribute("aria-hidden", "true");
  el.tutorialSceneOptions.hidden = true;
}

function openFirstTutorialModal() {
  showView("menu");
  el.tutorialFirstModal.classList.add("active");
  el.tutorialFirstModal.setAttribute("aria-hidden", "false");
  el.tutorialFirstYes.focus();
}

function closeFirstTutorialModal() {
  el.tutorialFirstModal.classList.remove("active");
  el.tutorialFirstModal.setAttribute("aria-hidden", "true");
}

function openCityUnlockModal(city) {
  if (!city || !el.cityUnlockModal) return;
  el.cityUnlockModal.classList.remove("city-welcome-active");
  el.cityUnlockTitle.hidden = false;
  el.cityUnlockIcon.innerHTML = city.icon ? `<img src="${city.icon}" alt="" aria-hidden="true">` : "";
  el.cityUnlockTitle.innerHTML = `<strong>${city.city}</strong> has been unlocked in <strong>CITY SELECT</strong>`;
  el.cityUnlockModal.classList.add("active");
  el.cityUnlockModal.setAttribute("aria-hidden", "false");
  el.cityUnlockClose.focus();
}

function closeCityUnlockModal() {
  if (!el.cityUnlockModal) return;
  el.cityUnlockModal.classList.remove("active");
  el.cityUnlockModal.classList.remove("city-welcome-active");
  el.cityUnlockModal.setAttribute("aria-hidden", "true");
  el.cityUnlockTitle.hidden = false;
}

function renderTutorialSceneOptions() {
  el.tutorialSceneOptions.innerHTML = tutorialSceneSelectOptions.map((option) => `
    <button class="tutorial-replay-button" type="button" data-tutorial-scene="${option.scene}">${option.label}</button>
  `).join("");
  el.tutorialSceneOptions.hidden = false;
}

function activateGodMode() {
  const godModePassword = getGodModePassword();
  if (!godModePassword || el.godCode.value.trim() !== godModePassword) {
    el.godCodeError.textContent = "Incorrect code.";
    el.godCode.focus();
    return;
  }
  state.unlimitedSprox = true;
  state.unlockedLines = cars.map((car) => car.id);
  state.unlockedCars = Object.fromEntries(state.unlockedLines.map((carId) => [carId, true]));
  state.unlockedArtVanForms = cars.find((car) => car.id === "art-van")?.evolutions.map((_, index) => index) || [];
  achievementDefs.forEach((achievement) => {
    state.achievements[achievement.id] = { complete: true, granted: true };
  });
  cars.forEach((car) => {
    state.garage[car.id] = {
      level: maxCarLevel,
      xp: 0,
      evolution: car.evolutions.length - 1,
      unlockedEvolution: car.evolutions.length - 1,
      pendingEvolution: null
    };
  });
  state.garage.rainbowlt = {
    level: maxCarLevel,
    xp: 0,
    evolution: cars.find((car) => car.id === "rainbowlt").evolutions.length - 1,
    unlockedEvolution: cars.find((car) => car.id === "rainbowlt").evolutions.length - 1,
    pendingEvolution: null
  };
  state.highestRankIndex = ranks.length - 1;
  state.highestBossIndex = bossChallengeBosses.length - 1;
  state.highestCampaignIndex = campaignLevels.length - 1;
  state.completedCampaignLevels = Object.fromEntries(campaignLevels.map((_, index) => [index, true]));
  state.selectedStoryCity = storyCities.length - 1;
  state.selectedCampaign = Math.min(state.selectedCampaign || 0, state.highestCampaignIndex);
  state.selectedBoss = finalBoss.id;
  saveState();
  closeGodModal();
  closeEvolutionModal();
  closeUpgradeModal();
  render();
  showView("garage");
  el.raceMessage.className = "race-message win";
  el.raceMessage.textContent = "God Mode activated. All GearBorn lines are unlocked, maxed, evolved, and stocked with unlimited Sprox.";
}

function carNameKey(name = "") {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function displayScaleStyle(name, role = "display") {
  const key = carNameKey(name);
  const scale = displayImageScaleByName?.[key] || 1;
  return scale === 1 ? "" : ` style="--display-scale:${scale}"`;
}

function rankMarkup(rank, role = "display") {
  const image = imageFor(rank, role);
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${rank.name}" loading="lazy" decoding="async"${displayScaleStyle(rank.name, role)} onerror="this.closest('.car')?.classList.remove('has-image')">` : "";
  const imageClass = image ? " has-image" : "";
  return `
    <div class="car${imageClass}" style="--car-color:${rank.color}">
      ${imageTag}
      <span class="car-glow"></span>
      <span class="car-body"></span>
      <span class="wheel front"></span>
      <span class="wheel rear"></span>
    </div>
  `;
}

function displayMarkup(image, alt, color) {
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${alt}" loading="lazy" decoding="async"${displayScaleStyle(alt, "display")} onerror="this.closest('.car')?.classList.remove('has-image')">` : "";
  return `
    <div class="car ${image ? "has-image" : ""}" style="--car-color:${color}">
      ${imageTag}
      <span class="car-glow"></span>
      <span class="car-body"></span>
      <span class="wheel front"></span>
      <span class="wheel rear"></span>
    </div>
  `;
}

function carMarkupForEvolution(carId, evolutionIndex, role = "display") {
  const car = cars.find((item) => item.id === carId);
  const form = evolutionByIndex(carId, evolutionIndex);
  const image = imageFor(form, role);
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${form.name}" loading="lazy" decoding="async"${displayScaleStyle(form.name, role)} onerror="this.closest('.car')?.classList.remove('has-image')">` : "";
  const imageClass = image ? " has-image" : "";
  return `
    <div class="car${imageClass}" style="--car-color:${car.color}">
      ${imageTag}
      <span class="car-glow"></span>
      <span class="car-body"></span>
      <span class="wheel front"></span>
      <span class="wheel rear"></span>
    </div>
  `;
}

function drawRace() {
  const trackWidth = Math.max(420, el.dragTrack?.clientWidth || 720);
  const baseX = Math.round(trackWidth * 0.3);
  const metersToPx = Math.max(2.4, trackWidth / 120);
  const playerLaneValue = race.laneTransition
    ? race.laneTransition.from + (race.laneTransition.to - race.laneTransition.from) * Math.min(1, (performance.now() - race.laneTransition.startTime) / 400)
    : race.playerLane;
  const playerX = baseX;
  const playerY = dragLaneTop(playerLaneValue);
  const primaryOpponent = race.opponents?.[0];
  if (el.dragTrack) {
    el.dragTrack.style.setProperty("--drag-bg-image", `url("${race.backgroundImage || "assets/race/dragbg-academy.png"}")`);
    el.dragTrack.style.setProperty("--drag-bg-x", `${Math.round(race.bgScroll || 0)}px`);
    el.dragTrack.style.setProperty("--drag-road-x", `${Math.round(race.roadScroll || 0)}px`);
    el.dragTrack.classList.toggle("chromatic-vignette", Boolean(race.nitroActive));
    const finishLine = el.dragTrack.querySelector(".finish-line");
    if (finishLine) {
      const finishX = baseX + (race.target - race.playerDistance) * metersToPx;
      finishLine.style.left = `${Math.round(finishX)}px`;
    }
  }
  el.playerDragLane.style.top = playerY;
  el.playerRacer.style.transform = `translateX(${playerX}px)`;
  el.playerRacer.classList.toggle("drafting", race.draftBonus > 1.01);
  if (primaryOpponent) {
    const laneValue = renderedLaneValue(primaryOpponent);
    const x = baseX + (primaryOpponent.distance - race.playerDistance) * metersToPx;
    el.rivalDragLane.style.top = dragLaneTop(laneValue);
    el.rivalDragLane.querySelector(".lane-label").textContent = primaryOpponent.name;
    el.rivalRacer.style.transform = `translateX(${Math.max(-120, Math.min(trackWidth - 115, x))}px)`;
    if (el.rivalRacerImage.getAttribute("src") !== primaryOpponent.image) {
      setRacerImage(el.rivalRacer, el.rivalRacerImage, primaryOpponent.image, primaryOpponent.name);
    }
    el.rivalRacer.classList.toggle("nitro-active", Boolean(primaryOpponent.nitroActive));
    el.rivalDragLane.hidden = false;
  } else {
    el.rivalDragLane.hidden = true;
  }
  if (el.dragExtraOpponents) {
    el.dragExtraOpponents.innerHTML = (race.opponents || []).slice(1).map((opponent) => {
      const laneValue = renderedLaneValue(opponent);
      const x = baseX + (opponent.distance - race.playerDistance) * metersToPx;
      return `
        <div class="lane drag-lane generated-lane" style="top:${dragLaneTop(laneValue)}">
          <span class="lane-label">${opponent.name}</span>
          <div class="car rival-car has-image ${opponent.nitroActive ? "nitro-active" : ""}" style="--car-color:#f25f5c; transform:translateX(${Math.max(-120, Math.min(trackWidth - 115, x))}px)">
            <img class="car-image" src="${opponent.image}" alt="${opponent.name}" onerror="this.closest('.car')?.classList.remove('has-image')" onload="this.closest('.car')?.classList.add('has-image')">
            <span class="car-glow"></span>
            <span class="car-body"></span>
            <span class="wheel front"></span>
            <span class="wheel rear"></span>
          </div>
        </div>
      `;
    }).join("");
  }
  el.playerRacer.classList.toggle("nitro-active", Boolean(race.nitroActive));
  el.mph.textContent = `${Math.round(race.playerSpeed)} MPH`;
  el.gear.textContent = race.gear || "P";
  el.distance.textContent = `${Math.floor(Math.min(race.playerDistance, race.target))} m`;
  el.tachFill.style.width = `${Math.round(race.rpm * 100)}%`;
  updateGearshiftIndicator(false);

  if (race.gear === 0) {
    el.shiftButton.classList.remove("pulse");
    el.shiftReadout.textContent = race.launchPhase === "green" ? "Launch" : "Park";
    updateNitroHud();
    return;
  }
  if (race.gear >= 6) {
    el.shiftButton.classList.remove("pulse");
    el.shiftReadout.textContent = "Top";
    el.tachFill.style.width = "74%";
    updateNitroHud();
    return;
  }

  const nearShift = race.rpm > 0.62 && race.rpm < 0.86;
  el.shiftButton.classList.toggle("pulse", nearShift);
  if (nearShift && race.active) {
    el.shiftReadout.textContent = "Now";
  } else if (race.rpm >= 0.86 && race.active) {
    el.shiftReadout.textContent = "Late";
  } else if (race.active) {
    el.shiftReadout.textContent = "Build";
  }
  updateNitroHud();
}

function mphToMetersPerSecond(mph) {
  return mph * 0.44704;
}

function trackLabel(trackId) {
  const track = storyTracks.find((item) => item.id === trackId) || (trackId === tutorialTrack.id ? tutorialTrack : storyTracks[0]);
  return `${track.city}, ${track.country}`;
}

function applyTrackMap(trackNode, track) {
  trackNode.style.removeProperty("--track-map");
  trackNode.classList.remove("has-map");
  if (!track?.map) return;
  const image = new Image();
  image.onload = () => {
    trackNode.style.setProperty("--track-map", `url("${track.map}")`);
    trackNode.classList.add("has-map");
  };
  image.onerror = () => trackNode.classList.remove("has-map");
  image.src = track.map;
}

function timeTarget(medal, trackIndex) {
  return medal.base + trackIndex * 0.35;
}

function selectedBoss() {
  return bossChallengeBosses.find((boss) => boss.id === state.selectedBoss);
}

function loadCustomTracks() {
  try {
    const tracks = JSON.parse(localStorage.getItem(customTracksKey) || "[]");
    return Array.isArray(tracks) ? tracks : [];
  } catch {
    return [];
  }
}

function saveCustomTracks(tracks) {
  localStorage.setItem(customTracksKey, JSON.stringify(tracks));
}

function createBlankBuilderGrid() {
  return Array.from({ length: builderGridSize }, () => Array.from({ length: builderGridSize }, () => ({ type: "grass", rotation: 0 })));
}

function cloneBuilderGrid(grid) {
  return Array.from({ length: builderGridSize }, (_, y) => Array.from({ length: builderGridSize }, (_, x) => {
    const tile = grid?.[y]?.[x] || { type: "grass", rotation: 0 };
    const allowed = builderTileDefs.some((def) => def.id === tile.type) || tile.type === "road_straight";
    return { type: allowed ? tile.type : "grass", rotation: Number(tile.rotation) || 0 };
  }));
}

function builderTileDef(type) {
  if (type === "road_straight") return { id: "road_straight", label: "Road", asset: "assets/tracks/track-horizontal.png", accent: "transparent" };
  return builderTileDefs.find((tile) => tile.id === type) || builderTileDefs[0];
}

function builderRoadAssetForRotation(rotation = 0) {
  return Number(rotation) === 90 || Number(rotation) === 270
    ? "assets/tracks/track-vertical.png"
    : "assets/tracks/track-horizontal.png";
}

function builderEscape(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function tileIsRoadLike(type) {
  return type?.startsWith("road_") || type === "start_finish" || type === "checkpoint";
}

function builderTrackValid() {
  let hasStart = false;
  let roadTiles = 0;
  builderState.grid.forEach((row) => row.forEach((tile) => {
    if (tile.type === "start_finish") hasStart = true;
    if (tileIsRoadLike(tile.type)) roadTiles += 1;
  }));
  return hasStart && roadTiles >= 8;
}

function renderBuilderMenu() {
  if (!el.builderMenu) return;
  const tracks = loadCustomTracks();
  el.builderLoad.hidden = tracks.length === 0;
  el.builderMenuNote.textContent = tracks.length ? `${tracks.length} custom track${tracks.length === 1 ? "" : "s"} saved locally.` : "No custom tracks saved yet.";
}

function renderBuilderPalette() {
  if (!el.builderPalette) return;
  el.builderPalette.innerHTML = builderTileDefs.map((tile) => `
    <button class="tile-palette-button ${tile.id === builderState.selectedTile ? "active" : ""}" data-builder-tile="${tile.id}" type="button">
      <span class="tile-preview" style="background-image:url('${tile.asset}');--tile-accent:${tile.accent};"></span>
      <span>${tile.label}</span>
    </button>
  `).join("");
}

function renderBuilderGrid() {
  if (!el.builderGrid) return;
  el.builderGrid.innerHTML = builderState.grid.map((row, y) => row.map((tile, x) => {
    const def = builderTileDef(tile.type);
    const rotation = Number(tile.rotation) || 0;
    const isStraight = tile.type === "road_straight";
    const isMarker = def.marker;
    const baseAsset = isStraight || isMarker ? builderRoadAssetForRotation(rotation) : def.asset;
    const markerRotation = isMarker && (rotation === 0 || rotation === 180) ? 90 : 0;
    return `
      <button class="builder-cell" data-builder-x="${x}" data-builder-y="${y}" type="button"
        style="--tile-accent:${def.accent};"
        aria-label="${def.label} at ${x + 1}, ${y + 1}">
        <span class="builder-cell-tile" style="background-image:url('${baseAsset}');transform:rotate(${isStraight ? 0 : rotation}deg);"></span>
        ${isMarker ? `<span class="builder-cell-marker" style="background-image:url('${def.asset}');transform:rotate(${markerRotation}deg);"></span>` : ""}
      </button>
    `;
  }).join("")).join("");
}

function renderBuilder() {
  if (!el.builderMenu) return;
  const editorOpen = builderState.mode === "editor";
  const loadOpen = builderState.mode === "load";
  el.builderMenu.hidden = editorOpen || loadOpen;
  el.builderEditor.hidden = !editorOpen;
  el.builderLoadPanel.hidden = !loadOpen;
  renderBuilderMenu();
  if (editorOpen) {
    el.builderCurrentName.textContent = builderState.name || "Untitled Track";
    el.builderDirtyState.textContent = builderState.dirty ? "Unsaved changes" : "Saved";
    el.builderBuild?.classList.toggle("active", builderState.tool === "build");
    el.builderRotate?.classList.toggle("active", builderState.tool === "rotate");
    if (el.builderRotate) el.builderRotate.textContent = "Rotate";
    renderBuilderPalette();
    renderBuilderGrid();
  }
  if (loadOpen) renderBuilderTrackList();
}

function openBuilderMenu() {
  builderState.mode = "menu";
  renderBuilder();
}

function startNewBuilderTrack() {
  builderState.mode = "editor";
  builderState.id = null;
  builderState.name = "Untitled Track";
  builderState.grid = createBlankBuilderGrid();
  builderState.selectedTile = "grass";
  builderState.rotation = 0;
  builderState.tool = "build";
  builderState.dirty = false;
  renderBuilder();
}

function openBuilderLoadPanel() {
  builderState.mode = "load";
  renderBuilder();
}

function loadBuilderTrack(id) {
  const track = loadCustomTracks().find((item) => item.id === id);
  if (!track) return;
  builderState.mode = "editor";
  builderState.id = track.id;
  builderState.name = track.name || "Untitled Track";
  builderState.grid = cloneBuilderGrid(track.grid);
  builderState.selectedTile = "grass";
  builderState.rotation = 0;
  builderState.tool = "build";
  builderState.dirty = false;
  renderBuilder();
}

function markBuilderDirty() {
  builderState.dirty = true;
  if (el.builderDirtyState) el.builderDirtyState.textContent = "Unsaved changes";
}

function placeBuilderTile(x, y) {
  if (!builderState.grid[y]?.[x]) return;
  if (!builderState.tool) return;
  const current = builderState.grid[y][x];
  if (builderState.tool === "rotate") {
    current.rotation = ((Number(current.rotation) || 0) + 90) % 360;
  } else if (builderState.selectedTile === "start_finish" || builderState.selectedTile === "checkpoint") {
    if (current.type !== "road_straight" && current.type !== "start_finish" && current.type !== "checkpoint") {
      showToast("Straight Track Needed", "Place this marker on a horizontal or vertical road tile.");
      return;
    }
    builderState.grid[y][x] = { type: builderState.selectedTile, rotation: Number(current.rotation) || 0 };
  } else {
    const def = builderTileDef(builderState.selectedTile);
    builderState.grid[y][x] = {
      type: def.placeType || builderState.selectedTile,
      rotation: Number.isFinite(def.placeRotation) ? def.placeRotation : builderState.rotation
    };
  }
  markBuilderDirty();
  renderBuilderGrid();
}

function toggleBuilderTool(tool) {
  builderState.tool = builderState.tool === tool ? null : tool;
  renderBuilder();
}

function clearBuilderGrid() {
  builderState.grid = createBlankBuilderGrid();
  markBuilderDirty();
  renderBuilder();
}

function openBuilderModal({ title, copy, subcopy = "", input = false, inputValue = "", actions = [] }) {
  if (!el.builderModal) return;
  el.builderModalTitle.textContent = title;
  el.builderModalCopy.textContent = copy;
  el.builderModalSubcopy.textContent = subcopy;
  el.builderModalSubcopy.hidden = !subcopy;
  el.builderModalInput.hidden = !input;
  el.builderModalInput.value = inputValue;
  el.builderModalActions.innerHTML = actions.map((action) => `<button class="${action.className || "ghost"}" data-builder-modal-action="${action.action}" type="button">${action.label}</button>`).join("");
  el.builderModal.classList.add("active");
  el.builderModal.setAttribute("aria-hidden", "false");
  if (input) el.builderModalInput.focus();
}

function closeBuilderModal() {
  if (!el.builderModal) return;
  el.builderModal.classList.remove("active");
  el.builderModal.setAttribute("aria-hidden", "true");
  builderState.modalMode = null;
  builderState.pendingName = "";
}

function beginBuilderSave() {
  if (!builderTrackValid()) {
    openBuilderModal({
      title: "Track Not Ready",
      copy: "Track needs a start/finish line and enough road tiles before saving.",
      actions: [{ action: "close", label: "OK", className: "primary" }]
    });
    builderState.modalMode = "info";
    return;
  }
  builderState.modalMode = "name";
  openBuilderModal({
    title: "Save Track",
    copy: "Name your custom track.",
    input: true,
    inputValue: builderState.name === "Untitled Track" ? "" : builderState.name,
    actions: [
      { action: "save-name-next", label: "Next", className: "primary" },
      { action: "close", label: "Cancel", className: "ghost" }
    ]
  });
}

function confirmBuilderSaveName() {
  const name = el.builderModalInput.value.trim();
  if (!name) {
    el.builderModalCopy.textContent = "Please enter a track name.";
    return;
  }
  const duplicate = loadCustomTracks().some((track) => (
    track.id !== builderState.id && (track.name || "").trim().toLowerCase() === name.toLowerCase()
  ));
  if (duplicate) {
    el.builderModalCopy.textContent = "A saved track with that name already exists.";
    return;
  }
  builderState.pendingName = name;
  builderState.modalMode = "save-confirm";
  openBuilderModal({
    title: "Confirm Save",
    copy: `Save this track as '${name}'?`,
    actions: [
      { action: "save-confirm", label: "Yes", className: "success-button" },
      { action: "close", label: "No", className: "ghost" }
    ]
  });
}

function saveBuilderTrack() {
  const now = new Date().toISOString();
  const tracks = loadCustomTracks();
  const id = builderState.id || `track-${Date.now()}`;
  const record = {
    id,
    name: builderState.pendingName || builderState.name,
    grid: cloneBuilderGrid(builderState.grid),
    createdAt: tracks.find((track) => track.id === id)?.createdAt || now,
    updatedAt: now
  };
  const nextTracks = tracks.filter((track) => track.id !== id).concat(record);
  saveCustomTracks(nextTracks);
  builderState.id = id;
  builderState.name = record.name;
  builderState.dirty = false;
  closeBuilderModal();
  renderBuilder();
}

function renderBuilderTrackList() {
  if (!el.builderTrackList) return;
  const tracks = loadCustomTracks();
  if (!tracks.length) {
    el.builderTrackList.innerHTML = `<p class="empty-note">No custom tracks saved.</p>`;
    return;
  }
  el.builderTrackList.innerHTML = tracks
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
    .map((track) => `
      <button class="builder-track-item" data-builder-load-track="${track.id}" type="button">
        <span>
          <strong>${builderEscape(track.name)}</strong>
          <small>Updated ${new Date(track.updatedAt || track.createdAt || Date.now()).toLocaleDateString()}</small>
        </span>
        <span>Load</span>
      </button>
    `).join("");
}

function requestBuilderExit(targetView = "menu") {
  if (builderState.mode === "editor" && builderState.dirty) {
    pendingBuilderLeaveView = targetView;
    builderState.modalMode = "leave";
    openBuilderModal({
      title: "Leave Track Builder?",
      copy: "Are you sure you want to leave Track Builder?",
      subcopy: "Your creation will be deleted unless you saved it.",
      actions: [
        { action: "leave", label: "Leave", className: "danger-button" },
        { action: "close", label: "Stay", className: "success-button" }
      ]
    });
    return false;
  }
  return true;
}

function leaveBuilderConfirmed() {
  const target = pendingBuilderLeaveView || "menu";
  pendingBuilderLeaveView = null;
  builderState.dirty = false;
  closeBuilderModal();
  if (target === "builder-menu") {
    openBuilderMenu();
    return;
  }
  builderAllowLeave = true;
  showView(target);
  builderAllowLeave = false;
}

function openDeleteTracksPanel() {
  const tracks = loadCustomTracks();
  builderState.modalMode = "delete-list";
  openBuilderModal({
    title: "Delete Tracks",
    copy: tracks.length ? "Choose a custom track to delete." : "No custom tracks saved.",
    actions: tracks.length
      ? tracks.map((track) => ({ action: `delete-pick:${track.id}`, label: builderEscape(track.name), className: "ghost" })).concat([{ action: "close", label: "Cancel", className: "danger-button" }])
      : [{ action: "close", label: "OK", className: "primary" }]
  });
}

function askDeleteTrack(id) {
  const track = loadCustomTracks().find((item) => item.id === id);
  if (!track) return;
  builderState.modalMode = "delete-confirm";
  builderState.deleteTrackId = id;
  openBuilderModal({
    title: "Delete Track?",
    copy: `Are you sure you want to delete '${track.name}'?`,
    subcopy: "This cannot be undone.",
    actions: [
      { action: "delete-confirm", label: "Delete", className: "danger-button" },
      { action: "close", label: "Cancel", className: "ghost" }
    ]
  });
}

function deleteSelectedTrack() {
  const id = builderState.deleteTrackId;
  saveCustomTracks(loadCustomTracks().filter((track) => track.id !== id));
  if (builderState.id === id) {
    builderState.id = null;
    builderState.name = "Untitled Track";
    builderState.dirty = true;
  }
  closeBuilderModal();
  if (viewIsActive("builder")) renderBuilder();
}

function showView(view) {
  if (view !== "builder" && !builderAllowLeave && viewIsActive("builder") && !requestBuilderExit(view)) return;
  if (view !== "beta") stopBetaDemo(false);
  if (view !== "beta") stopBeta3d(false);
  if (view !== "beta" && typeof stopLastGearBeta === "function") stopLastGearBeta(false);
  if (view !== "story" || embeddedCampaignView) restoreEmbeddedCampaignRace();
  // Reset forge panel when navigating to garage, unless tutorial is opening The Forge
  if (view === "garage" && !(tutorialActive() && currentTutorialScene()?.id === "the-forge")) {
    if (el.forgePanel) el.forgePanel.hidden = true;
    if (el.garageContent) el.garageContent.hidden = false;
  }
  el.views.forEach((panel) => panel.classList.toggle("active", panel.id === `${view}-view`));
  if (view === "story" && embeddedCampaignView) embeddedCampaignView.node.classList.add("active");
  const activeNavView = view === "beta" && betaRaceContext?.source === "training"
    ? "solo"
    : (view === "beta" && ["story", "tutorial"].includes(betaRaceContext?.source) ? "story" : view);
  document.querySelectorAll(".nav-button").forEach((nav) => nav.classList.toggle("active", nav.dataset.view === activeNavView));
  document.body.classList.toggle("mode-active", view !== "menu");
  if (view === "menu" || view === "story") playMusic("menu-theme");
  else if (view === "garage") playMusic("garage-theme");
  else if (view === "play" || view === "time-trial" || view === "beta" || view === "hub-map-beta") playMusic("race-theme");
  else if (view === "battle" || view === "boss") playMusic("battle-theme");
  if (view === "story") {
    storyReplayOpen = false;
    modeFlow.story = state.storyCarChosen ? "next" : "car";
    state.selectedStoryCity = Math.max(0, Math.min(state.selectedStoryCity || 0, highestUnlockedStoryCityIndex()));
    advanceTunerRankForCityEntry(storyCities[state.selectedStoryCity]?.id);
    state.selectedCampaign = firstPlayableStoryLevelForCity(state.selectedStoryCity)?.campaignIndex ?? state.selectedCampaign;
    saveState();
    render();
    window.setTimeout(maybeShowCityWelcome, 80);
    ensureTunerAndIntro(view);
  }
  if (view === "solo") {
    ensureTunerAndIntro(view);
  }
  if (view === "play") {
    const scene = tutorialActive() ? currentTutorialScene() : null;
    setFlowStep("drag", scene?.view === "play" && scene.flow ? scene.flow : "car");
  }
  if (view === "time-trial") {
    const scene = tutorialActive() ? currentTutorialScene() : null;
    setFlowStep("time", scene?.view === "time-trial" && scene.flow ? scene.flow : "car");
  }
  if (view === "boss") setFlowStep("boss", "car");
  if (view === "battle") {
    const scene = tutorialActive() ? currentTutorialScene() : null;
    setFlowStep("battle", scene?.view === "battle" && scene.flow ? scene.flow : "car");
  }
  if (view === "beta" && !betaRaceContext) openBetaPrototypeIntro();
  if (view === "builder" && builderState.mode === "menu") renderBuilder();
  if (!["story", "play", "time-trial", "boss", "battle", "beta"].includes(view)) render();
}

function storyTunerReady() {
  return Boolean(state.tunerChosen && state.selectedTuner && state.tunerChoiceVersion >= tunerChoiceVersion);
}

function resolveTutorialSceneId(sceneId = "intro") {
  return tutorialSceneAliases[sceneId] || sceneId;
}

function tutorialSceneIndex(sceneId = "intro") {
  const resolved = resolveTutorialSceneId(sceneId);
  const index = tutorialScenes.findIndex((scene) => scene.id === resolved);
  return index >= 0 ? index : 0;
}

function currentTutorialScene() {
  return tutorialScenes[state.tutorialScene] || tutorialScenes[0];
}

function selectedPlayerCharacter() {
  return selectedTuner();
}

function rivalCharacter() {
  const player = selectedPlayerCharacter();
  return tuners.find((tuner) => tuner.id !== player.id) || tuners[1] || tuners[0];
}

function selectedTuner() {
  return tuners.find((item) => item.id === state.selectedTuner) || tuners[0];
}

function activeFactionId() {
  return selectedTuner().id === "cha-cha" ? "spindell" : "keyfree";
}

function activeFactionLabel() {
  return activeFactionId() === "spindell" ? "Spindell" : "KeyFree";
}

function activeFactionMentor() {
  return selectedTuner().id === "cha-cha"
    ? { id: "dr-tyree", name: "Dr. Tyree", headshot: "assets/characters/headshots/headshot-dr-tyree.png" }
    : { id: "ashley", name: "Ashley Racem", headshot: "assets/characters/headshots/headshot-ashley.png" };
}

function rivalMentor() {
  return selectedTuner().id === "cha-cha"
    ? { id: "ashley", name: "Ashley Racem", headshot: "assets/characters/headshots/headshot-ashley.png" }
    : { id: "dr-tyree", name: "Dr. Tyree", headshot: "assets/characters/headshots/headshot-dr-tyree.png" };
}

function activeUnlockHub() {
  return activeFactionId() === "spindell" ? "spindellLabs" : "forge";
}

function unlockAnimationType() {
  return activeUnlockHub() === "spindellLabs" ? "spindellKeySync" : "forgeUnlock";
}

function rivalRaceScriptFor(cityId, phase = "pre") {
  const tunerKey = selectedTuner().id === "cha-cha" ? "cha-cha" : "mylo";
  return rivalRaceScripts?.[tunerKey]?.[cityId]?.[phase] || [];
}

function convoyStoryScriptFor(convoyId, phase = "pre") {
  return convoyStoryScripts?.[convoyId]?.[phase] || [];
}

function activeConvoysForCity(cityId) {
  return Object.values(convoyDefinitions || {}).filter((convoy) => (
    convoy.cityId === cityId
    && (!convoy.playerTunerId || convoy.playerTunerId === selectedTuner().id)
  ));
}

function selectedTunerShortName() {
  return selectedTuner().name.split(" ")[0];
}

function tutorialActive() {
  return Boolean(state.tutorialActive);
}

function startTutorial(sceneId = "intro") {
  const resolvedSceneId = resolveTutorialSceneId(sceneId);
  const sceneIndex = tutorialSceneIndex(resolvedSceneId);
  if (!storyTunerReady()) {
    pendingIntroView = `tutorial:${resolvedSceneId}`;
    openTunerModal();
    return;
  }
  // Snapshot the real wallet BEFORE touching anything
  const realSprox = Math.max(0, Math.floor(state.sprox || 0));
  state.tutorialSnapshotUnlimitedSprox = Boolean(state.unlimitedSprox);
  state.unlimitedSprox = false;
  state.tutorialActive = true;
  state.tutorialComplete = false;
  state.tutorialScene = sceneIndex;
  state.tutorialLine = 0;
  state.tutorialAwaitingUpgrade = false;
  state.tutorialAwaitingEvolve = false;
  state.tutorialAwaitingForge = false;
  state.tutorialSplash = tutorialScenes[sceneIndex]?.splash || "";
  state.tutorialStartingSprox = realSprox;
  // Do NOT zero state.sprox — keep real wallet intact.
  // The tutorial uses state.sprox as a sandbox but we restore it on exit.
  // Only reset tutorial-specific tracking, not the actual wallet.
  if (resolvedSceneId === "intro") {
    // Temporarily set sprox to 0 for the tutorial sandbox (restored in finishTutorial)
    state.tutorialStartingSprox = realSprox;
    state.sprox = 0;
    state.tutorialDragSprox = 0;
    state.tutorialTimeMedal = "";
  }
  // Snapshot garage + medallion state so finishTutorial can fully restore it
  state.tutorialSnapshotGarage = JSON.parse(JSON.stringify(state.garage || {}));
  state.tutorialSnapshotUnlockedLines = [...(state.unlockedLines || [])];
  state.tutorialSnapshotMedallions = [...(state.medallionsOwned || [])];
  state.tutorialSnapshotComplete = Boolean(state.tutorialComplete);
  state.tutorialChoiceResponse = null;
  setupTutorialScene();
  saveState();
  render();
}

function finishTutorial() {
  // Restore everything that existed before the tutorial started
  if (!state.unlimitedSprox) {
    state.sprox = Math.max(0, Math.floor(state.tutorialStartingSprox || 0));
  }
  state.unlimitedSprox = Boolean(state.tutorialSnapshotUnlimitedSprox);
  // Restore garage, unlock list, and medallions from pre-tutorial snapshot
  if (state.tutorialSnapshotGarage) {
    state.garage = JSON.parse(JSON.stringify(state.tutorialSnapshotGarage));
  }
  if (state.tutorialSnapshotUnlockedLines) {
    state.unlockedLines = [...state.tutorialSnapshotUnlockedLines];
  }
  if (state.tutorialSnapshotMedallions) {
    state.medallionsOwned = [...state.tutorialSnapshotMedallions];
  }
  state.tutorialActive = false;
  state.tutorialComplete = true;
  state.tutorialScene = 0;
  state.tutorialLine = 0;
  state.tutorialAwaitingUpgrade = false;
  state.tutorialAwaitingEvolve = false;
  state.tutorialAwaitingForge = false;
  state.tutorialStartingSprox = 0;
  state.tutorialSnapshotGarage = null;
  state.tutorialSnapshotUnlockedLines = null;
  state.tutorialSnapshotMedallions = null;
  state.tutorialSnapshotComplete = null;
  state.tutorialSnapshotUnlimitedSprox = null;
  state.tutorialChoiceResponse = null;
  state.tutorialTimeMedal = "";
  state.selectedCar = defaultUnlockedLines.includes(state.selectedCar) ? state.selectedCar : defaultUnlockedLines[0];
  state.selectedStoryCar = defaultUnlockedLines.includes(state.selectedStoryCar) ? state.selectedStoryCar : state.selectedCar;
  state.selectedTimeCar = defaultUnlockedLines.includes(state.selectedTimeCar) ? state.selectedTimeCar : state.selectedCar;
  state.selectedRank = ranks[0].key;
  state.selectedTimeTrack = storyTracks[0].id;
  closeUpgradeModal();
  closeEvolutionModal();
  restoreEmbeddedCampaignRace();
  // Restore story mode UI controls that tutorial hid
  if (el.storyCitySelect) el.storyCitySelect.hidden = false;
  if (el.changeStoryCar) el.changeStoryCar.hidden = false;
  if (el.storyPreviewPanel) el.storyPreviewPanel.setAttribute("aria-hidden", "true");
  saveState();
  showView("menu");
  render();
}

function skipTutorial() {
  finishTutorial();
}

function openSkipTutorialConfirm() {
  if (!el.tutorialSkipModal) {
    skipTutorial();
    return;
  }
  el.tutorialSkipModal.classList.add("active");
  el.tutorialSkipModal.setAttribute("aria-hidden", "false");
  el.cancelTutorialSkip?.focus();
}

function closeSkipTutorialConfirm() {
  if (!el.tutorialSkipModal) return;
  el.tutorialSkipModal.classList.remove("active");
  el.tutorialSkipModal.setAttribute("aria-hidden", "true");
}

function setupTutorialScene() {
  const scene = currentTutorialScene();
  if (!scene) return;

  // Set up car state first
  if (scene.id === "upgrade") {
    ensureTutorialCarState({ level: 9, forceBase: true });
  } else if (scene.id === "evolved-form") {
    ensureTutorialCarState({ level: 10 });
  } else if (["intro", "rival-intro", "mamburn", "city-map", "drag-race-intro", "drag-race", "drag-race-win", "rival-stinger", "drag2h2h", "head2head-intro", "head2head", "head2head-win", "h2h-rival-stinger", "h2h2battle", "battle-intro", "battle", "battle-win", "map-final", "garage"].includes(scene.id)) {
    ensureTutorialCarState({ forceBase: true });
  } else {
    ensureTutorialCarState();
  }

  // Apply view
  if (scene.view) showView(scene.view);

  // Apply flow
  if (scene.flow) {
    if (scene.view === "play")        setFlowStep("drag", scene.flow);
    if (scene.view === "time-trial")  setFlowStep("time", scene.flow);
    if (scene.view === "battle")      setFlowStep("battle", scene.flow);
  }

  // Scene-specific setup
  switch (scene.id) {
    case "intro":
      showView("menu");
      break;

    case "rival-intro":
      showView(scene.view || "menu");
      break;

    case "mamburn":
      // Tutorial-exclusive car select: only Mamburn selectable
      state.selectedCar = tutorialCarId;
      setFlowStep("drag", "car");
      render();
      break;

    case "city-map":
    case "drag2h2h":
    case "h2h2battle":
    case "map-final":
      // Show tutorial story city map
      showTutorialCityMap();
      break;

    case "drag-race-intro":
      // Show level preview for the drag race
      showTutorialDragPreview();
      break;

    case "drag-race":
      state.selectedCar = tutorialCarId;
      setupTutorialDragMenu();
      setFlowStep("drag", "match");
      render();
      break;

    case "head2head-intro":
      showTutorialTimeTrialPreview();
      break;

    case "head2head":
      startTutorialHeadToHeadRace({ holdCountdown: true });
      break;

    case "battle-intro":
      showTutorialBattlePreview();
      break;

    case "battle":
      state.selectedStoryCar = tutorialCarId;
      state.selectedBattleBoss = bosses[0].id;
      showView("battle");
      if (!battleState || battleState.finished || battleState.mode !== "tutorial-battle") {
        beginBattle("tutorial-battle", { tutorial: true, boss: bosses[0], tutorialPaused: true });
      }
      break;

    case "garage":
    case "unlocked":
    case "end":
    case "tyree-final":
    case "empty-garage":
    case "medallion-discovery":
    case "ashley-intro":
      closeUpgradeModal();
      showView("garage");
      break;

    case "upgrade":
      showView("garage");
      openUpgradeModal(tutorialCarId);
      break;

    case "evolved-form":
      // Return to garage showing Snaytan
      showView("garage");
      if (el.evolutionModal) {
        evolutionModal = null;
        el.evolutionModal.classList.remove("evolution-unlocked", "active");
        el.evolutionModal.setAttribute("aria-hidden", "true");
      }
      break;

    case "evolution-cinematic":
      showView("garage");
      break;

    case "vindex":
      closeUpgradeModal();
      if (el.evolutionModal) {
        evolutionModal = null;
        el.evolutionModal.classList.remove("evolution-unlocked", "active");
        el.evolutionModal.setAttribute("aria-hidden", "true");
      }
      state.selectedVindex = "110";
      showView("vindex");
      break;

    case "achievements":
      showView("achievements");
      break;

    case "the-forge":
    case "medallion-unlock":
      closeUpgradeModal();
      // Award Baybee, Murrka, Bunnae medallions for the tutorial forge demo.
      // The renderForgeInventory bypass (tutorialAwaitingForge) shows these
      // regardless of unlock state, so they always appear in the inventory.
      ["bee", "pickup", "rabbit"].forEach((id) => awardMedallion(id));
      state.tutorialAwaitingForge = false;  // reset — dialogue plays first
      showView("garage");
      openForge();
      break;
  }
}

function ensureTutorialCarState(options = {}) {
  state.garage[tutorialCarId] = state.garage[tutorialCarId] || { level: 1, xp: 0, evolution: 0, unlockedEvolution: 0, pendingEvolution: null };
  state.garage[tutorialOpponentCarId] = state.garage[tutorialOpponentCarId] || { level: 1, xp: 0, evolution: 0, unlockedEvolution: 0, pendingEvolution: null };
  if (options.level) {
    state.garage[tutorialCarId].level = options.level;
    state.garage[tutorialCarId].evolution = options.level >= 10 ? 1 : 0;
    state.garage[tutorialCarId].unlockedEvolution = options.level >= 10 ? 1 : 0;
    state.garage[tutorialCarId].pendingEvolution = null;
  }
  if (options.forceBase) {
    state.garage[tutorialCarId].evolution = 0;
    state.garage[tutorialCarId].unlockedEvolution = Math.min(state.garage[tutorialCarId].unlockedEvolution || 0, 0);
    state.garage[tutorialCarId].pendingEvolution = null;
  }
  if (options.sprox && !state.unlimitedSprox) {
    state.sprox = Math.max(state.sprox || 0, options.sprox);
  }
  state.selectedCar = tutorialCarId;
  state.selectedStoryCar = tutorialCarId;
  state.selectedTimeCar = tutorialCarId;
}

function tutorialMapNodeMarkup(level) {
  const visual = storyLevelVisuals[level.type] || storyLevelVisuals.boss;
  const layout = level.type === "boss" ? { x: 50, y: 18 }
    : level.type === "pink-slip" ? { x: 50, y: 89 }
    : storyNodeLayouts.find((item) => item.key === level.type) || storyNodeLayouts[0];
  let iconMarkup = `
    <span class="story-node-icon">
      <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
    </span>
  `;
  if (level.type === "boss") {
    const boss = bosses[level.bossIndex || 0] || bosses[0];
    iconMarkup = `
      <span class="story-node-icon layered type-boss">
        <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <img class="node-subject boss-headshot" src="${boss.headshot || boss.portrait}" alt="${boss.name}" loading="lazy" decoding="async">
      </span>
    `;
  } else if (level.type === "pink-slip") {
    iconMarkup = `
      <span class="story-node-icon layered type-pink-slip">
        <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <img class="node-subject pink-medallion" src="${level.medallion || "assets/medallions/medallion-tutorque.png"}" alt="${level.drag?.name || "Tutorque"}" loading="lazy" decoding="async">
      </span>
    `;
  } else if (level.type === "rival") {
    const rival = rivalCharacter();
    iconMarkup = `
      <span class="story-node-icon layered type-rival">
        <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <img class="node-subject rival-headshot" src="${rival.headshot || rival.image}" alt="${rival.name}" loading="lazy" decoding="async">
      </span>
    `;
  }
  return `
    <button class="story-map-node" type="button" data-tutorial-level="${level.tutorialLevel}"
      style="left:${layout.x}%; top:${layout.y}%; --node-color:${visual.color}">
      ${iconMarkup}
      <span class="story-node-label">${visual.label}</span>
    </button>
  `;
}

function renderTutorialLevelPreview() {
  // During tutorial, only show preview if a specific scene wants it
  const scene = currentTutorialScene();
  const previewScene = ["drag-race-intro", "head2head-intro", "battle-intro"].includes(scene?.id);
  if (!previewScene || !el.storyPreviewPanel) {
    if (el.storyPreviewPanel) {
      el.storyPreviewPanel.classList.remove("active");
      el.storyPreviewPanel.setAttribute("aria-hidden", "true");
    }
    return;
  }
  // Show level preview panel for the relevant tutorial level
  const levelType = scene.id === "drag-race-intro" ? "drag"
    : scene.id === "head2head-intro" ? "head2head"
    : "battle";
  const level = tutorialCityLevels.find((l) => l.tutorialLevel === levelType);
  if (!level) return;
  const visual = storyLevelVisuals[level.type] || storyLevelVisuals.drag;
  el.storyPreviewPanel.setAttribute("aria-hidden", "false");
  el.storyPreviewPanel.classList.add("active");
  el.storyPreviewIcon.innerHTML = storyNodeIconMarkup(tutorialCity, level, visual);
  if (el.campaignType) el.campaignType.textContent = visual.label;
  if (el.campaignTitle) el.campaignTitle.textContent = level.title;
  if (el.campaignMeta) el.campaignMeta.textContent = "";
  if (el.storyPreviewArt) {
    if (levelType === "drag") {
      el.storyPreviewArt.innerHTML = displayMarkup(imageFor(cars.find((car) => car.id === tutorialOpponentCarId)?.evolutions?.[0], "display"), "Tutorque", "#9aa7b7");
    } else if (levelType === "head2head") {
      el.storyPreviewArt.innerHTML = displayMarkup(imageFor(cars.find((car) => car.id === tutorialOpponentCarId)?.evolutions?.[0], "display"), "Tutorque", "#9aa7b7");
    } else {
      el.storyPreviewArt.innerHTML = displayMarkup(imageFor(cars.find((car) => car.id === tutorialOpponentCarId)?.evolutions?.[0], "display"), "Tutorque", "#9aa7b7");
    }
  }
  if (el.campaignRewards) el.campaignRewards.innerHTML = "";
  if (el.storyLoadout) el.storyLoadout.innerHTML = `<p>Your GearBorn: <strong>Mamburn</strong></p>`;
  // Relabel the start button
  const startBtn = document.getElementById("start-campaign");
  if (startBtn) startBtn.textContent = "Start Level";
}

function showTutorialCityMap() {
  showView("story");
  setFlowStep("story", "next");
  // Close any open preview panel
  if (el.storyPreviewPanel) el.storyPreviewPanel.setAttribute("aria-hidden", "true");
  render();
}

function showTutorialDragPreview() {
  showView("story");
  setFlowStep("story", "next");
  render();
}

function showTutorialTimeTrialPreview() {
  showView("story");
  setFlowStep("story", "next");
  render();
}

function showTutorialBattlePreview() {
  showView("story");
  setFlowStep("story", "next");
  render();
}

function setupTutorialDragMenu() {
  state.selectedCar = tutorialCarId;
  state.selectedDistance = 400;
  state.selectedRank = "F";
  render();
}

function setupTutorialTimeMenu() {
  state.selectedTimeCar = tutorialCarId;
  state.selectedTimeTrack = tutorialTrack.id;
  render();
}

function tutorialLinesForScene(scene) {
  const dialogueId = tutorialDialogue[scene.id] ? scene.id : tutorialDialogueAliases[scene.id];
  return tutorialDialogue[dialogueId] || [["tyree", scene.copy || "TUTORIAL_PLACEHOLDER_LINE"]];
}

function normalizeTutorialLine(line) {
  if (line && typeof line === "object" && !Array.isArray(line)) {
    const content = typeof line.text === "function" ? line.text() : line.text;
    return { ...line, speaker: line.speaker || "tyree", text: tutorialText(content || "TUTORIAL_PLACEHOLDER_LINE") };
  }
  const speaker = Array.isArray(line) ? line[0] : "tyree";
  const content = Array.isArray(line) ? line[1] : line;
  return { speaker, text: tutorialText(typeof content === "function" ? content() : content) };
}

function tutorialText(value = "") {
  const player = selectedTuner();
  const rival = rivalCharacter();
  const playerName = selectedTunerShortName();
  const rivalName = rival?.name || "your rival";
  const userPronoun = player?.gender === "female" ? "she" : "he";
  const userPronounCap = userPronoun.charAt(0).toUpperCase() + userPronoun.slice(1);
  const rivalPronoun = rival?.gender === "female" ? "she" : "he";
  return String(value)
    .replace(/\(User’s name\)/g, playerName)
    .replace(/\(User's name\)/g, playerName)
    .replace(/\(Rival’s name\)/g, rivalName)
    .replace(/\(Rival's name\)/g, rivalName)
    .replace(/he\/she \(if rival is Mylo, he; if rival is Cha Cha, she\)/gi, rivalPronoun)
    .replace(/\(he\/she - if rival is Mylo, he; if rival is Cha Cha, she\)/gi, rivalPronoun)
    .replace(/\(he\/she - if Mylo, he; if Cha Cha, she\)/gi, userPronoun)
    .replace(/\(he\/she\)/gi, userPronoun)
    .replace(/\(He’s\/She’s\)/g, `${userPronounCap}’s`)
    .replace(/\(he’s\/she’s\)/g, `${userPronoun}’s`);
}

function currentTutorialLine() {
  const scene = currentTutorialScene();
  const lines = tutorialLinesForScene(scene);
  const index = Math.max(0, Math.min(state.tutorialLine || 0, lines.length - 1));
  return normalizeTutorialLine(lines[index]);
}

function chooseTutorialResponse(choiceIndex) {
  const line = currentTutorialLine();
  const choice = line.choices?.[choiceIndex];
  if (!choice) return;
  const responseLines = (choice.responseLines || []).map(normalizeTutorialLine);
  state.tutorialChoiceResponse = {
    lines: responseLines.length ? responseLines : [{
      speaker: choice.responseSpeaker || line.speaker || "tyree",
      text: tutorialText(choice.responseText || choice.responseKey || "TUTORIAL_PLACEHOLDER_CHOICE_RESPONSE")
    }],
    index: 0,
    nextScene: choice.nextScene || null
  };
  saveState();
  renderTutorial();
}

function tutorialSpeakerProfile(speaker) {
  if (speaker === "user") {
    const tuner = selectedTuner();
    return { ...tuner, image: tuner.headshot || tuner.image };
  }
  if (speaker === "key") return { name: "GearBorn Key", image: gearbornKeyImage };
  if (speaker === "tutorque") return { name: "Tutorque", image: "assets/cars/tutorque-display.png" };
  if (speaker === "mamburn") return { name: "Mamburn", image: "assets/cars/snake-mamburn-display.png" };
  if (speaker === "snaytan") return { name: "Snaytan", image: "assets/cars/snake-snaytan-display.png" };
  if (speaker === "ashley") return { name: "Ashley Racem", image: "assets/characters/headshots/headshot-ashley.png" };
  if (speaker === "rival") {
    const rival = rivalCharacter();
    return { ...rival, image: rival.headshot || rival.image };
  }
  if (speaker === "narration") return { name: "Tutorial", image: "" };
  return { name: "Dr. Tyree", image: "assets/characters/headshots/headshot-dr-tyree.png" };
}

function tutorialSpecialLineMarkup(text) {
  if (text !== "TUTORIAL_PLACEHOLDER_MEDALLIONS_ACQUIRED") return "";
  return `
    <div class="tutorial-medallion-acquired">
      <img class="tutorial-sparkle" src="assets/tutorial/sparkle.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
      <strong>GEARBORN MEDALLIONS ACQUIRED</strong>
      <div class="tutorial-medallion-row">
        ${["bee", "pickup", "rabbit"].map((id) => `<img src="${forgeMedallionSrc(id)}" alt="" loading="lazy" decoding="async">`).join("")}
      </div>
    </div>
  `;
}

function tutorialVisualStage() {
  if (!el.tutorialOverlay) return null;
  let stage = el.tutorialOverlay.querySelector(".tutorial-visual-stage");
  if (!stage) {
    stage = document.createElement("div");
    stage.className = "tutorial-visual-stage";
    el.tutorialOverlay.insertBefore(stage, el.tutorialCard || null);
  }
  return stage;
}

function tutorialFullBodyForSpeaker(speakerKey) {
  if (speakerKey === "user") return selectedTuner().image;
  if (speakerKey === "rival") return rivalCharacter().image;
  if (speakerKey === "ashley") return "assets/characters/character-ashley.png";
  if (speakerKey === "tyree") return "assets/characters/dr-tyree.png";
  return "";
}

function tutorialVnSpeakersForScene(scene, line) {
  const sceneSpeakers = {
    intro: ["user", "tyree"],
    "rival-intro": ["user", "rival", "tyree"],
    mamburn: ["user", "tyree"],
    "rival-stinger": ["user", "rival"],
    "h2h-rival-stinger": ["user", "rival"],
    garage: ["user", "tyree"],
    upgrade: ["user", "tyree"],
    evolve: ["user", "tyree"],
    "tyree-final": ["user", "rival", "tyree"],
    "empty-garage": ["user"],
    "ashley-intro": ["user", "ashley"],
    "the-forge": ["user", "ashley"],
    "medallion-unlock": ["user", "ashley"],
    unlocked: ["user", "ashley"]
  };
  const speakers = [...(sceneSpeakers[scene.id] || ["user"])];
  if (["user", "rival", "tyree", "ashley"].includes(line?.speaker) && !speakers.includes(line.speaker)) {
    speakers.push(line.speaker);
  }
  return speakers.filter((speaker) => tutorialFullBodyForSpeaker(speaker));
}

function updateTutorialVnActive(stage, activeSpeaker) {
  const characters = [...stage.querySelectorAll(".tutorial-vn-character")];
  let activeSlot = Math.max(0, characters.findIndex((node) => node.dataset.speaker === activeSpeaker));
  if (activeSlot < 0) activeSlot = 0;
  characters.forEach((node, index) => {
    node.classList.toggle("active", index === activeSlot);
  });
  stage.dataset.activeSlot = String(activeSlot);
  stage.dataset.vnCount = String(characters.length);
}

function renderTutorialVisualStage(scene, line) {
  const stage = tutorialVisualStage();
  if (!stage) return;
  stage.hidden = true;
  if (state.tutorialSplash) {
    const key = `splash:${state.tutorialSplash}`;
    stage.hidden = false;
    stage.className = "tutorial-visual-stage splash-stage";
    stage.dataset.visualKey = key;
    stage.dataset.activeSlot = "";
    stage.dataset.vnCount = "";
    if (stage.dataset.renderedKey !== key) {
      stage.innerHTML = `<img class="tutorial-splash-image" src="${state.tutorialSplash}" alt="" loading="eager" decoding="async">`;
      stage.dataset.renderedKey = key;
    }
    return;
  }
  if (scene.mode !== "vnScene") {
    stage.dataset.visualKey = "";
    stage.dataset.activeSlot = "";
    stage.dataset.vnCount = "";
    return;
  }
  const speakers = tutorialVnSpeakersForScene(scene, line);
  const key = `vn:${scene.id}:${speakers.join("|")}`;
  const art = speakers
    .map((speaker, index) => {
      const src = tutorialFullBodyForSpeaker(speaker);
      if (!src) return "";
      const active = line?.speaker === speaker ? " active" : "";
      return `<img class="tutorial-vn-character slot-${index}${active}" data-speaker="${speaker}" src="${src}" alt="" loading="eager" decoding="async" onerror="this.remove()">`;
    })
    .join("");
  if (!art) return;
  stage.hidden = false;
  stage.className = "tutorial-visual-stage vn-stage";
  stage.dataset.visualKey = key;
  if (stage.dataset.renderedKey !== key) {
    stage.innerHTML = art;
    stage.dataset.renderedKey = key;
  }
  updateTutorialVnActive(stage, line?.speaker || speakers[0]);
}

function setTutorialScene(sceneId) {
  state.tutorialScene = tutorialSceneIndex(sceneId);
  state.tutorialLine = 0;
  state.tutorialChoiceResponse = null;
  state.tutorialSplash = tutorialScenes[state.tutorialScene]?.splash || "";
  state.tutorialAwaitingUpgrade = false;
  state.tutorialAwaitingEvolve = false;
  state.tutorialAwaitingForge = false;
}

function tutorialEvolvePromptIndex() {
  return tutorialLinesForScene({ id: "evolve" }).findIndex((line) => {
    const normalized = normalizeTutorialLine(line);
    return normalized.text.includes("Click EVOLVE");
  });
}

function tutorialUpgradePromptIndex() {
  return tutorialLinesForScene({ id: "upgrade" }).findIndex((line) => {
    const normalized = normalizeTutorialLine(line);
    return normalized.text.includes("Click LEVEL UP");
  });
}

function advanceTutorial() {
  const scene = currentTutorialScene();
  const lines = tutorialLinesForScene(scene);

  if (state.tutorialSplash) {
    state.tutorialSplash = "";
    saveState();
    renderTutorial();
    return;
  }

  if (state.tutorialChoiceResponse) {
    const response = state.tutorialChoiceResponse;
    const responseLines = response.lines || [];
    if ((response.index || 0) < responseLines.length - 1) {
      response.index = (response.index || 0) + 1;
      saveState();
      renderTutorial();
      return;
    }
    const nextScene = response.nextScene;
    state.tutorialChoiceResponse = null;
    if (nextScene) {
      setTutorialScene(nextScene);
      setupTutorialScene();
    } else if (state.tutorialLine < lines.length - 1) {
      state.tutorialLine += 1;
    } else {
      state.tutorialLine = lines.length - 1;
    }
    saveState();
    render();
    return;
  }

  // ── Already waiting for user to act — ignore button presses ──────────────
  if (state.tutorialAwaitingForge) return;

  // ── Awaiting user actions (upgrade click, evolve click) ──────────────────
  if (scene.id === "evolve" && state.tutorialLine === tutorialEvolvePromptIndex()) {
    state.tutorialAwaitingEvolve = true;
    // Re-enable the evolve button now that dialogue is done
    if (el.evolveButton) el.evolveButton.disabled = false;
    saveState();
    renderTutorial();
    return;
  }

  if (scene.id === "upgrade" && state.tutorialLine === tutorialUpgradePromptIndex()) {
    state.tutorialAwaitingUpgrade = true;
    saveState();
    renderTutorial();
    return;
  }

  // ── Advance within current scene's dialogue ───────────────────────────────
  if (state.tutorialLine < lines.length - 1) {
    state.tutorialLine += 1;
    const currentUpgradeText = scene.id === "upgrade" ? normalizeTutorialLine(lines[state.tutorialLine]).text : "";
    if (scene.id === "upgrade" && /Ooo\./i.test(currentUpgradeText) && !state.unlimitedSprox) {
      state.sprox = Math.max(state.sprox || 0, 5000);
      openUpgradeModal(tutorialCarId);
    }
    saveState();
    renderTutorial();
    return;
  }

  // ── End of scene dialogue — transition to next ───────────────────────────
  state.tutorialLine = 0;

  switch (scene.id) {
    case "intro":
      setTutorialScene("rival-intro");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "rival-intro":
      setTutorialScene("mamburn");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "mamburn":
      // Move to training city map
      state.tutorialScene = tutorialScenes.findIndex((s) => s.id === "city-map");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "city-map":
      // Auto-click drag race → show drag-race-intro level preview
      state.tutorialScene = tutorialScenes.findIndex((s) => s.id === "drag-race-intro");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "drag-race-intro":
      // Start Level → go to drag race with match preview showing Tutorque
      setTutorialScene("drag-race");
      ensureTutorialCarState({ forceBase: true });
      showView("play");
      setupTutorialDragMenu();
      prepareDragRace(null, tutorialDragStage());
      saveState();
      renderTutorial();
      break;

    case "drag-race":
      // Continue → prepare and start the race.
      prepareDragRace(null, tutorialDragStage());
      startPendingDragRace();
      setTutorialScene("drag-race-win");
      saveState();
      renderTutorial();
      break;

    case "drag-race-win":
      setTutorialScene("rival-stinger");
      saveState();
      renderTutorial();
      break;

    case "rival-stinger":
      setTutorialScene("drag2h2h");
      showTutorialCityMap();
      saveState();
      renderTutorial();
      break;

    case "drag2h2h":
      // Auto-click time trial → show time-trial-intro level preview
      setTutorialScene("head2head-intro");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "head2head-intro":
      // Start Level → stage the 2D head-to-head race screen, held before countdown.
      setTutorialScene("head2head");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "head2head":
      // Continue → start the current 2D racer head-to-head tutorial.
      startTutorialHeadToHeadRace();
      setTutorialScene("head2head-win");
      saveState();
      renderTutorial();
      break;

    case "head2head-win":
      setTutorialScene("h2h-rival-stinger");
      saveState();
      renderTutorial();
      break;

    case "h2h-rival-stinger":
      setTutorialScene("h2h2battle");
      showTutorialCityMap();
      saveState();
      renderTutorial();
      break;

    case "h2h2battle":
      // Auto-click battle → show battle-intro level preview
      setTutorialScene("battle-intro");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "battle-intro":
      // Start Level → go to battle view
      state.selectedStoryCar = tutorialCarId;
      state.selectedBattleBoss = bosses[0].id;
      setTutorialScene("battle");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "battle":
      // Continue → set up and start battle.
      state.selectedStoryCar = tutorialCarId;
      state.selectedBattleBoss = bosses[0].id;
      if (!battleState || battleState.finished || battleState.mode !== "tutorial-battle") {
        beginBattle("tutorial-battle", { tutorial: true, boss: bosses[0] });
      } else {
        battleState.tutorialPaused = false;
        renderBattle();
      }
      setTutorialScene("battle-win");
      saveState();
      renderTutorial();
      break;

    case "battle-win":
      setTutorialScene("map-final");
      showTutorialCityMap();
      saveState();
      renderTutorial();
      break;

    case "map-final":
      // Battle win → go to garage
      setTutorialScene("garage");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "garage":
      // Continue → go to upgrade screen
      setTutorialScene("upgrade");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "upgrade":
      // Await user clicking Level Up button
      state.tutorialAwaitingUpgrade = true;
      saveState();
      renderTutorial();
      break;

    case "evolve":
      closeEvolutionModal();
      setTutorialScene("tyree-final");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "evolved-form":
      setTutorialScene("evolve");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "tyree-final":
      setTutorialScene("empty-garage");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "empty-garage":
      setTutorialScene("ashley-intro");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "ashley-intro":
      setTutorialScene("the-forge");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "the-forge":
      // Dialogue done — hide tutorial overlay so user can interact with The Forge
      state.tutorialAwaitingForge = true;
      saveState();
      renderTutorial();
      break;

    case "medallion-unlock":
      state.tutorialAwaitingForge = true;
      saveState();
      renderTutorial();
      break;

    case "unlocked":
      // Close the forge unlock popup then advance to starters
      if (el.forgeUnlockedPopup) {
        el.forgeUnlockedPopup.classList.remove("active");
        el.forgeUnlockedPopup.classList.remove("tutorial-passive");
        el.forgeUnlockedPopup.setAttribute("hidden", "");
        el.forgeUnlockedPopup.setAttribute("aria-hidden", "true");
      }
      setTutorialScene("vindex");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "vindex":
      setTutorialScene("achievements");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "achievements":
      setTutorialScene("end");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "end":
      finishTutorial();
      break;

    default:
      // Fallback: advance to next scene
      state.tutorialScene = Math.min(tutorialScenes.length - 1, state.tutorialScene + 1);
      setupTutorialScene();
      saveState();
      render();
      break;
  }
}

function rewindTutorial() {
  if (state.tutorialChoiceResponse) {
    state.tutorialChoiceResponse = null;
    saveState();
    renderTutorial();
    return;
  }
  state.tutorialAwaitingUpgrade = false;
  state.tutorialAwaitingEvolve = false;
  state.tutorialAwaitingForge = false;
  if (state.tutorialLine > 0) {
    state.tutorialLine -= 1;
    saveState();
    renderTutorial();
    return;
  }
  state.tutorialScene = Math.max(0, state.tutorialScene - 1);
  state.tutorialLine = Math.max(0, tutorialLinesForScene(currentTutorialScene()).length - 1);
  setupTutorialScene();
  saveState();
  render();
}

function tutorialDragStage() {
  return { rankKey: "F", name: "Tutorque", xp: 80, power: 0.28, distance: 400, image: "assets/cars/tutorque-race.png", tutorial: true };
}

function renderTutorial() {
  if (!el.tutorialOverlay) return;
  const active = tutorialActive();
  el.tutorialOverlay.classList.toggle("active", active);
  el.tutorialOverlay.setAttribute("aria-hidden", active ? "false" : "true");
  if (!active) {
    const stage = tutorialVisualStage();
    if (stage) stage.hidden = true;
    return;
  }
  const scene = currentTutorialScene();
  el.tutorialOverlay.dataset.mode = scene.mode || "dialogueOverlay";
  el.tutorialOverlay.classList.toggle("splashing", Boolean(state.tutorialSplash));
  const sceneBackground = scene.background && !scene.background.startsWith("TODO") ? scene.background : "";
  const backgroundKey = sceneBackground && ["vnScene", "comicSplash"].includes(scene.mode) ? sceneBackground : "";
  if (sceneBackground && ["vnScene", "comicSplash"].includes(scene.mode)) {
    if (el.tutorialOverlay.dataset.backgroundKey !== backgroundKey) {
      el.tutorialOverlay.style.backgroundImage = `linear-gradient(180deg, rgba(5, 8, 14, 0.34), rgba(5, 8, 14, 0.58)), url("${sceneBackground}")`;
      el.tutorialOverlay.dataset.backgroundKey = backgroundKey;
    }
  } else {
    if (el.tutorialOverlay.dataset.backgroundKey) {
      el.tutorialOverlay.style.backgroundImage = "";
      el.tutorialOverlay.dataset.backgroundKey = "";
    }
  }
  const countdownRunning = el.dragCountdown.classList.contains("active")
    || el.storyCountdown.classList.contains("active")
    || el.timeCountdown.classList.contains("active");
  if (scene.id === "upgrade" && state.tutorialAwaitingUpgrade) {
    el.tutorialOverlay.classList.remove("active");
    return;
  }
  if (scene.id === "evolve" && state.tutorialAwaitingEvolve) {
    // Hide tutorial overlay while evolution modal is being interacted with
    el.tutorialOverlay.classList.remove("active");
    return;
  }
  if (scene.id === "the-forge" && state.tutorialAwaitingForge) {
    // Hide tutorial overlay so user can freely interact with The Forge
    el.tutorialOverlay.classList.remove("active");
    return;
  }
  const waitingOnRace = scene.wait && (
    countdownRunning ||
    (race && !race.finished) ||
    (verticalRace && !verticalRace.finished) ||
    (betaState && !betaState.finished) ||
    (battleState && !battleState.finished)
  );
  el.tutorialOverlay.classList.toggle("active", !waitingOnRace);
  if (waitingOnRace) return;
  if (state.tutorialSplash) {
    el.tutorialOverlay.style.backgroundImage = "";
    el.tutorialOverlay.dataset.backgroundKey = "";
    renderTutorialVisualStage(scene, null);
    el.tutorialKicker.textContent = "";
    el.tutorialTitle.textContent = "";
    el.tutorialCopy.innerHTML = "";
    el.tutorialPortrait.innerHTML = "";
    if (el.tutorialChoices) {
      el.tutorialChoices.hidden = true;
      el.tutorialChoices.innerHTML = "";
    }
    el.tutorialBack.hidden = true;
    if (el.tutorialSkip) el.tutorialSkip.hidden = false;
    el.tutorialNext.textContent = "Continue";
    el.tutorialNext.hidden = false;
    if (el.tutorialNext.parentElement) el.tutorialNext.parentElement.hidden = false;
    el.tutorialNext.classList.add("finish");
    el.tutorialCard.dataset.scene = scene.id;
    el.tutorialCard.dataset.mode = "comicSplash";
    el.tutorialCard.dataset.speaker = "splash";
    return;
  }
  const lines = tutorialLinesForScene(scene);
  state.tutorialLine = Math.max(0, Math.min(state.tutorialLine || 0, lines.length - 1));
  const response = state.tutorialChoiceResponse;
  const line = response?.lines?.length
    ? response.lines[Math.min(response.index || 0, response.lines.length - 1)]
    : normalizeTutorialLine(lines[state.tutorialLine]);
  const speaker = tutorialSpeakerProfile(line.speaker);
  renderTutorialVisualStage(scene, line);
  const visualStage = tutorialVisualStage();
  const vnSlot = visualStage?.dataset.activeSlot || "";
  const vnCount = visualStage?.dataset.vnCount || "";
  const specialMarkup = tutorialSpecialLineMarkup(line.text);
  const isVnScene = scene.mode === "vnScene";
  el.tutorialKicker.textContent = "";
  el.tutorialTitle.textContent = specialMarkup ? "" : speaker.name;
  el.tutorialCopy.innerHTML = specialMarkup || (line.text === "TUTORIAL_CHOICE_PROMPT" ? "Choose a response." : line.text);
  el.tutorialPortrait.innerHTML = specialMarkup || isVnScene ? "" : characterMarkup(speaker);
  if (el.tutorialChoices) {
    const choices = response ? [] : line.choices || [];
    el.tutorialChoices.hidden = !choices.length;
    el.tutorialChoices.innerHTML = choices.map((choice, index) => `
      <button class="tutorial-choice-button" type="button" data-tutorial-choice="${index}">
        ${tutorialText(choice.labelKey || choice.label || `TUTORIAL_CHOICE_${index + 1}`)}
      </button>
    `).join("");
  }
  el.tutorialBack.hidden = Boolean(!response && line.choices?.length) || (state.tutorialScene === 0 && state.tutorialLine === 0);
  const tutorialLineIsLast = state.tutorialLine === lines.length - 1;
  el.tutorialNext.textContent = tutorialLineIsLast ? "Continue" : "Next";
  const hasChoices = Boolean(!response && line.choices?.length);
  el.tutorialNext.hidden = hasChoices;
  el.tutorialNext.style.display = hasChoices ? "none" : "";
  if (el.tutorialNext.parentElement) el.tutorialNext.parentElement.hidden = hasChoices;
  el.tutorialCard.classList.toggle("choices-active", hasChoices);
  if (el.tutorialSkip) el.tutorialSkip.hidden = false;
  el.tutorialNext.classList.toggle("finish", tutorialLineIsLast);
  el.tutorialCard.dataset.scene = scene.id;
  el.tutorialCard.dataset.mode = scene.mode || "dialogueOverlay";
  el.tutorialCard.dataset.speaker = line.speaker;
  el.tutorialCard.dataset.vnSlot = vnSlot;
  el.tutorialCard.dataset.vnCount = vnCount;
}

function ensureTunerAndIntro(view) {
  if (!["story", "solo"].includes(view)) return;
  if (!storyTunerReady()) {
    pendingIntroView = view;
    openTunerModal();
  }
}

function restoreEmbeddedCampaignRace() {
  embeddedRaceHomes.forEach((home) => {
    if (home.node.parentNode !== home.parent) {
      if (home.next && home.next.parentNode === home.parent) {
        home.parent.insertBefore(home.node, home.next);
      } else {
        home.parent.appendChild(home.node);
      }
    }
    home.node.classList.remove("active");
  });
  embeddedCampaignView = null;
  updateVerticalControlVisuals();
}

function mountCampaignRace(view) {
  restoreEmbeddedCampaignRace();
  showView("story");
  modeFlow.story = "race";
  storyReplayOpen = false;
  renderFlowScreens();
  const home = embeddedRaceHomes.find((item) => item.view === view);
  if (!home) return;
  el.campaignRaceMount.appendChild(home.node);
  home.node.classList.add("active");
  embeddedCampaignView = home;
}

function completeCampaignLevel(index) {
  state.completedCampaignLevels = state.completedCampaignLevels || {};
  const cityIndex = storyCities.findIndex((city) => city.levels.some((level) => level.campaignIndex === index));
  const completedLevel = cityIndex >= 0
    ? storyCities[cityIndex].levels.find((level) => level.campaignIndex === index)
    : null;
  const nextCityIndex = cityIndex + 1;
  const willUnlockNextCity = completedLevel?.type === "boss"
    && nextCityIndex < storyCities.length
    && !storyCityUnlocked(nextCityIndex);
  const wasCompleted = Boolean(state.completedCampaignLevels[index]);
  state.completedCampaignLevels[index] = true;
  while (state.highestCampaignIndex < campaignLevels.length - 1 && state.completedCampaignLevels[state.highestCampaignIndex]) {
    state.highestCampaignIndex += 1;
  }
  if (cityIndex >= 0) {
    state.selectedStoryCity = cityIndex;
    state.selectedStoryCity = Math.min(state.selectedStoryCity, highestUnlockedStoryCityIndex());
    state.selectedCampaign = firstPlayableStoryLevelForCity(state.selectedStoryCity)?.campaignIndex ?? index;
    if (willUnlockNextCity) {
      pendingCityUnlock = storyCities[nextCityIndex];
    }
  }
  if (completedLevel?.type === "boss") unlockNextTrainingBossFromBoss((completedLevel.final ? finalBoss : bosses[completedLevel.bossIndex])?.id);
  if (!wasCompleted && featureEnabled("enableReputationAnimations") && completedLevel && !["boss", "pink-slip"].includes(completedLevel.type)) {
    playAudioCue("reputationGain");
    playSound("bond-up");
    showToast("REPUTATION_GAIN_PLACEHOLDER_TITLE", "REPUTATION_GAIN_PLACEHOLDER_BODY");
  }
  if (!wasCompleted && completedLevel && !["boss", "pink-slip"].includes(completedLevel.type) && cityIndex >= 0) {
    maybeTriggerMedallionGauntlet(storyCities[cityIndex]);
  }
  maybeTriggerRidesHairGauntlet();
  checkAchievements();
  saveState();
}

function startCampaignLevel() {
  const index = state.selectedCampaign;
  if (!storyTunerReady()) {
    openTunerModal();
    return;
  }
  const level = campaignLevels[index];
  const city = storyCities[state.selectedStoryCity] || storyCities[0];
  if (!level || storyLevelLocked(city, level) || !storyLevelVisible(city, level)) return;
  const runLevel = () => {
    if (isPinkSlipRiskActive(level)) {
      openPinkSlipWarning(level, () => startCampaignRace(index, level));
      return;
    }
    if (level.type === "rival") {
      openRivalDialogue(level, "pre", () => startCampaignRace(index, level));
      return;
    }
    startCampaignRace(index, level);
  };
  if (shouldShowStoryCutscene(index, level)) {
    openStoryCutscene(level, runLevel);
    return;
  }
  runLevel();
}

function isPinkSlipRiskActive(level) {
  return level?.type === "pink-slip" && level.pinkSlipCarId && !isCarUnlocked(level.pinkSlipCarId);
}

function openPinkSlipWarning(level, onConfirm) {
  const rewardName = level?.drag?.name || cars.find((car) => car.id === level?.pinkSlipCarId)?.evolutions[0]?.name || "this GearBorn";
  pendingPinkSlipRiskStart = onConfirm;
  el.pinkSlipWarningCopy.textContent = `Pink Slip races risk your car and your parts. If you lose, your car will return to Level 1 and you will lose any equipped parts. Do you want to risk your car to unlock ${rewardName}?`;
  el.pinkSlipWarningModal.classList.add("active");
  el.pinkSlipWarningModal.setAttribute("aria-hidden", "false");
  el.cancelPinkSlipRisk.focus();
}

function closePinkSlipWarning() {
  pendingPinkSlipRiskStart = null;
  el.pinkSlipWarningModal.classList.remove("active");
  el.pinkSlipWarningModal.setAttribute("aria-hidden", "true");
}

function confirmPinkSlipRisk() {
  const start = pendingPinkSlipRiskStart;
  closePinkSlipWarning();
  start?.();
}

function startCampaignRace(index, level) {
  closeStoryPreview();
  closeCitySelect();
  if (level.type === "rival") {
    startRivalCampaignRace(index, level);
    return;
  }
  if (level.type === "pink-slip") {
    startStory2dRace(index, level);
    return;
  }
  if (level.type === "drag") {
    mountCampaignRace("play");
    state.selectedCar = state.selectedStoryCar;
    state.selectedDistance = index === 0 ? 400 : 800;
    saveState();
    render();
    prepareDragRace(index, level.drag);
    return;
  }
  if (level.type === "trial" || level.type === "circuit") {
    startStory2dRace(index, level);
    return;
  }
  if (level.type === "battle") {
    const boss = bosses[level.bossIndex];
    mountCampaignRace("battle");
    state.selectedBattleBoss = boss.id;
    saveState();
    render();
    beginBattle("campaign-battle", { boss, campaignLevelIndex: index });
    return;
  }
  startStory2dRace(index, level);
}

function shouldShowStoryCutscene(index, level) {
  return level.type === "boss";
}

function rivalDragStage(level) {
  const rivalCar = rivalCarSetup();
  return {
    rankKey: "R",
    name: rivalCar.form.name,
    xp: level.xp,
    power: level.power || 1.2,
    image: imageFor(rivalCar.form, "race"),
    displayImage: imageFor(rivalCar.form, "display"),
    rival: true
  };
}

function rivalBossData(level) {
  const rival = rivalTuner();
  const rivalCar = rivalCarSetup();
  const bossIndex = level.bossIndex ?? 0;
  return {
    id: `${level.id}-${rival.id}`,
    name: rival.name,
    car: rivalCar.form.name,
    track: level.track,
    difficulty: 0.92 + bossIndex * 0.12,
    xp: level.xp,
    carImage: imageFor(rivalCar.form, "topdown") || imageFor(rivalCar.form, "race"),
    portrait: rival.headshot || rival.image,
    headshot: rival.headshot || rival.image
  };
}

function startRivalCampaignRace(index, level) {
  const rivalCar = rivalCarSetup();
  if (level.mechanic === "drag") {
    mountCampaignRace("play");
    state.selectedCar = state.selectedStoryCar;
    state.selectedDistance = level.distance || 800;
    saveState();
    render();
    prepareDragRace(index, rivalDragStage(level));
    return;
  }
  if (level.mechanic === "battle") {
    const rival = rivalTuner();
    mountCampaignRace("battle");
    saveState();
    render();
    beginBattle("campaign-rival-battle", {
      boss: rivalBossData(level),
      campaignLevelIndex: index,
      opponentStats: rivalCar.stats,
      opponentImage: imageFor(rivalCar.form, "race"),
      opponentName: rivalCar.form.name,
      reward: level.xp,
      rival
    });
    return;
  }
  startStory2dRace(index, level);
}

function startStory2dRace(index, level) {
  betaRaceContext = { source: "story", campaignLevelIndex: index, level };
  betaPendingMode = story2dModeForLevel(level);
  betaPreviewMode = betaPendingMode;
  betaSelectedTrackId = betaTrackIdForStoryTrack(level.track || (level.final ? finalBoss.track : bosses[level.bossIndex]?.track));
  betaPreviewOpponents = story2dOpponentsForLevel(level, betaPendingMode, index);
  state.selectedBetaCar = state.selectedStoryCar;
  saveState();
  showView("beta");
  startBetaDemo(betaPendingMode);
}

function tutorialTutorqueOpponent() {
  const car = cars.find((item) => item.id === tutorialOpponentCarId) || cars[0];
  const form = car.evolutions[0];
  return {
    driver: rivalCharacter(),
    car,
    carId: car.id,
    form,
    evolution: 0,
    level: 1,
    ratings: betaRatingsForCar(car.id, 1, 0, false),
    skill: 1.02
  };
}

function prepareTutorialHeadToHeadRace() {
  betaRaceContext = { source: "tutorial", nextScene: "head2head-win" };
  betaPendingMode = "duel";
  betaPreviewMode = "duel";
  betaDuelDriverIndex = 0;
  betaSelectedTrackId = betaTrackIdForStoryTrack(tutorialTrack);
  betaTrack = betaTrackById(betaSelectedTrackId, "duel");
  betaSelectedTrackId = betaTrack.id;
  syncBetaTrackDerived();
  state.selectedCar = tutorialCarId;
  state.selectedStoryCar = tutorialCarId;
  betaPreviewOpponents = [tutorialTutorqueOpponent()];
  showView("beta");
  openBetaPreview("duel", true);
}

function startTutorialHeadToHeadRace(options = {}) {
  prepareTutorialHeadToHeadRace();
  startBetaDemo("duel", options);
}

function openRivalDialogue(level, phase, onContinue) {
  const rival = rivalTuner();
  const cityId = level?.track?.id || storyCities.find((city) => city.bossIndex === level?.bossIndex)?.id || "indianapolis";
  const scripted = rivalRaceScriptFor(cityId, phase);
  const fallback = phase === "post"
    ? "[Rival Race Placeholder: Post]"
    : "[Rival Race Placeholder: Pre]";
  const line = scripted[0]?.text || fallback;
  const modal = document.createElement("div");
  modal.className = "rival-dialog";
  modal.innerHTML = `
    <div class="rival-dialog-card">
      <button class="modal-close" type="button" aria-label="Close rival scene">×</button>
      <div class="selection-preview-art">${characterMarkup({ name: rival.name, image: rival.headshot || rival.image })}</div>
      <h2>${rival.name}</h2>
      <p>${line}</p>
      <button class="primary" type="button">Continue</button>
    </div>
  `;
  const close = () => {
    modal.remove();
    onContinue?.();
  };
  modal.querySelector(".modal-close").addEventListener("click", close);
  modal.querySelector(".primary").addEventListener("click", close);
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("active"));
}

function openStoryCutscene(level, startRaceCallback, phase = "pre") {
  pendingCutsceneStart = startRaceCallback;
  const boss = level.type === "boss" ? (level.final ? finalBoss : bosses[level.bossIndex]) : null;
  activeCutsceneContext = { type: level.type, boss, phase };
  activeCutsceneLines = storyCutsceneScripts[boss?.id]?.[phase] || null;
  activeCutsceneIndex = 0;
  if (!activeCutsceneLines?.length) {
    console.warn(`Missing cutscene script for ${boss?.id || level.type} ${phase}`);
    pendingCutsceneStart = null;
    activeCutsceneContext = null;
    if (startRaceCallback) startRaceCallback();
    return;
  }
  el.cutsceneTitle.textContent = "Story Scene";
  el.cutsceneModal.classList.add("single-speaker");
  renderCutsceneLine();
  el.cutsceneModal.dataset.sceneType = level.type;
  el.cutsceneModal.classList.add("active");
  el.cutsceneModal.setAttribute("aria-hidden", "false");
  el.continueCutscene.focus();
}

function renderCutsceneLine() {
  const line = activeCutsceneLines?.[activeCutsceneIndex];
  if (!line) return;
  const tuner = tuners.find((item) => item.id === state.selectedTuner) || tuners[0];
  const character = cutsceneCharacterForLine(line);
  el.cutsceneLeftArt.innerHTML = characterMarkup(character);
  el.cutsceneLeftDialogue.innerHTML = line.text ? `<strong>${character.name}</strong><span>${line.text}</span>` : "";
  el.cutsceneRightArt.innerHTML = "";
  el.cutsceneRightDialogue.textContent = "";
  el.backCutscene.hidden = activeCutsceneIndex === 0;
  el.continueCutscene.textContent = activeCutsceneIndex === activeCutsceneLines.length - 1 ? "Continue" : "Next";
  el.continueCutscene.classList.toggle("finish", activeCutsceneIndex === activeCutsceneLines.length - 1);
}

function cutsceneCharacterForLine(line) {
  const tuner = tuners.find((item) => item.id === state.selectedTuner) || tuners[0];
  if (line.speaker === "user") {
    return {
      ...tuner,
      image: tuner.headshot || tuner.image
    };
  }
  const boss = activeCutsceneContext?.boss || finalBoss;
  const unmaskedAlpha = boss.id === "racer-alpha" && (
    line.unmask ||
    activeCutsceneLines?.slice(0, activeCutsceneIndex + 1).some((entry) => entry.unmask)
  );
  return {
    name: boss.name,
    image: unmaskedAlpha ? (finalBoss.unmaskedHeadshot || finalBoss.unmaskedPortrait) : (boss.headshot || boss.portrait)
  };
}

function advanceCutscene() {
  if (activeCutsceneLines && activeCutsceneIndex < activeCutsceneLines.length - 1) {
    activeCutsceneIndex += 1;
    renderCutsceneLine();
    return;
  }
  closeStoryCutsceneAndStart();
}

function rewindCutscene() {
  if (!activeCutsceneLines || activeCutsceneIndex <= 0) return;
  activeCutsceneIndex -= 1;
  renderCutsceneLine();
}

function closeStoryCutsceneAndStart() {
  el.cutsceneModal.classList.remove("active");
  el.cutsceneModal.setAttribute("aria-hidden", "true");
  el.cutsceneModal.classList.remove("single-speaker");
  el.cutsceneModal.dataset.sceneType = "";
  activeCutsceneLines = null;
  activeCutsceneIndex = 0;
  activeCutsceneContext = null;
  el.cutsceneLeftArt.innerHTML = "";
  el.cutsceneRightArt.innerHTML = "";
  el.cutsceneLeftDialogue.textContent = "";
  el.cutsceneRightDialogue.textContent = "";
  el.backCutscene.hidden = true;
  el.continueCutscene.textContent = "Continue";
  el.continueCutscene.classList.remove("finish");
  const start = pendingCutsceneStart;
  pendingCutsceneStart = null;
  if (start) start();
}

function topDownImageForCar(carId) {
  return imageFor(currentEvolution(carId), "topdown") || imageFor(currentEvolution(carId), "race");
}

function setTopCar(node, image, alt, color) {
  node.style.setProperty("--car-color", color);
  node.innerHTML = "";
  node.classList.remove("has-image");
  if (!image) return;
  const img = document.createElement("img");
  img.alt = alt;
  img.onload = () => node.classList.add("has-image");
  img.onerror = () => node.classList.remove("has-image");
  img.src = image;
  node.appendChild(img);
}

function openBossIntro(startConfig = { mode: "boss", options: {} }) {
  const boss = startConfig.boss || startConfig.options?.boss || selectedBoss();
  const bossIndex = bossChallengeBosses.findIndex((item) => item.id === boss.id);
  if (!startConfig.ignoreLock && bossIndex > state.highestBossIndex) {
    el.storyMessage.className = "race-message loss";
    el.storyMessage.textContent = "Beat the previous boss to unlock this challenge.";
    return;
  }
  pendingBossRaceStart = { mode: startConfig.mode || "boss", options: startConfig.options || {} };
  el.bossModalKicker.textContent = `${boss.track.city}, ${boss.track.country}`;
  el.bossModalTitle.textContent = `${boss.name} challenges you`;
  el.bossModalCopy.textContent = `${boss.name} drives the ${boss.car}. Finish first to earn ${boss.xp} Sprox.`;
  el.bossPortrait.innerHTML = `<img src="${boss.headshot || boss.portrait}" alt="${boss.name}" loading="lazy" decoding="async" onerror="this.remove()">`;
  el.bossModal.classList.add("active");
  el.bossModal.setAttribute("aria-hidden", "false");
  el.continueBoss.focus();
}

function closeBossIntro() {
  el.bossModal.classList.remove("active");
  el.bossModal.setAttribute("aria-hidden", "true");
}

function showRacerAlphaUnmask() {
  el.unmaskPortrait.innerHTML = `<img src="${finalBoss.portrait}" alt="Racer Alpha helmet" loading="lazy" decoding="async" onerror="this.remove()">`;
  el.unmaskCopy.textContent = "Racer Alpha's helmet is ready to come off.";
  el.unmaskButton.hidden = false;
  el.continueUnmask.hidden = true;
  el.unmaskModal.classList.add("active");
  el.unmaskModal.setAttribute("aria-hidden", "false");
  el.unmaskButton.focus();
}

function unmaskRacerAlpha() {
  state.racerAlphaUnmasked = true;
  state.racerAlphaProfileView = "unmasked";
  saveState();
  el.unmaskPortrait.innerHTML = `<img src="${finalBoss.unmaskedPortrait}" alt="Racer Alpha" loading="lazy" decoding="async" onerror="this.remove()">`;
  el.unmaskCopy.textContent = "Racer Alpha has been unmasked.";
  el.unmaskButton.hidden = true;
  el.continueUnmask.hidden = false;
  el.continueUnmask.focus();
}

function closeRacerAlphaUnmask() {
  el.unmaskModal.classList.remove("active");
  el.unmaskModal.setAttribute("aria-hidden", "true");
  if (verticalRace?.carId) showPendingEvolution(verticalRace.carId);
}

function openTunerModal() {
  renderTuners();
  el.tunerModal.classList.add("active");
  el.tunerModal.setAttribute("aria-hidden", "false");
}

function closeTunerModal() {
  el.tunerModal.classList.remove("active");
  el.tunerModal.setAttribute("aria-hidden", "true");
}

function selectTuner(tunerId) {
  if (!tuners.some((tuner) => tuner.id === tunerId)) return;
  state.selectedTuner = tunerId;
  state.tunerChosen = true;
  state.tunerChoiceVersion = tunerChoiceVersion;
  saveState();
  closeTunerModal();
  render();
  if (pendingIntroView) {
    if (pendingIntroView.startsWith("tutorial:")) {
      const sceneId = pendingIntroView.split(":")[1] || "intro";
      pendingIntroView = null;
      startTutorial(sceneId);
      return;
    }
    pendingIntroView = null;
  }
}

function beginVerticalRace(mode, waitForStart = false, options = {}) {
  const isBossRace = mode === "boss" || mode === "campaign-boss" || mode === "campaign-rival";
  const isStandaloneTime = mode === "time";
  const isCampaignTime = mode === "campaign-time";
  const trackNode = isBossRace ? el.storyTrack : el.timeTrialTrack;
  const carId = isBossRace ? state.selectedStoryCar : state.selectedTimeCar;
  const stats = carStats(carId);
  const boss = isBossRace ? (options.boss || selectedBoss()) : null;
  const track = options.track || (boss ? boss.track : storyTracks.find((item) => item.id === state.selectedTimeTrack));
  const trackId = track.id;
  const trackIndex = storyTracks.findIndex((track) => track.id === trackId);
  const playerNode = isBossRace ? el.storyPlayer : el.timePlayer;
  const bossNode = isBossRace ? el.storyBoss : null;
  const ghostNode = isStandaloneTime ? el.timeGhost : null;
  el.timeGhost.classList.toggle("hidden", !isStandaloneTime);
  if (!isStandaloneTime) {
    el.timeGhost.innerHTML = "";
    el.timeGhost.classList.remove("has-image");
    el.timeGhost.style.removeProperty("left");
    el.timeGhost.style.removeProperty("top");
  }
  setTopCar(playerNode, topDownImageForCar(carId), currentEvolution(carId).name, cars.find((car) => car.id === carId).color);
  if (bossNode) setTopCar(bossNode, boss.carImage, boss.car, "#f25f5c");
  if (ghostNode) setTopCar(ghostNode, "assets/cars/taxi-phantaxi-topdown.png", "Phantaxi", "#c084fc");

  verticalRace = {
    mode,
    active: false,
    trackNode,
    carId,
    trackId,
    targetDistance: isBossRace ? 500 : 1000,
    startTime: performance.now(),
    last: performance.now(),
    player: { x: 42, y: 88, speed: 58, distance: 0, node: playerNode },
    boss: boss ? { x: 58, y: 88, speed: 38 + boss.difficulty * 11, distance: 0, node: bossNode, difficulty: boss.difficulty } : null,
    ghost: isStandaloneTime ? (state.timeTrials[trackId]?.ghost || null) : null,
    ghostNode,
    stats,
    bossData: boss,
    trackIndex,
    items: [],
    spawnTimer: 0,
    keys: {},
    itemScore: 0,
    record: [],
    campaignLevelIndex: options.campaignLevelIndex ?? null,
    countdownStarted: false,
    finished: false
  };
  updateVerticalControlVisuals();
  clearTrackItems(trackNode);
  updateVerticalPositions();
  applyTrackMap(trackNode, track);
  if (isBossRace) {
    el.storyMessage.className = "race-message";
    el.storyMessage.textContent = waitForStart ? "Press Start on the map when you're ready." : "Get ready.";
    el.storyMapStart.classList.toggle("active", waitForStart);
  } else {
    el.timeMessage.className = "race-message";
    el.timeMessage.textContent = waitForStart ? "Press Start on the map when you're ready." : "Get ready.";
    el.timeMapStart.classList.toggle("active", waitForStart);
  }
  if (!waitForStart) startVerticalCountdown();
}

function startVerticalCountdown() {
  if (!verticalRace || verticalRace.active || verticalRace.countdownStarted) return;
  verticalRace.countdownStarted = true;
  const raceStateRef = verticalRace;
  const isStory = raceStateRef.mode === "boss" || raceStateRef.mode === "campaign-boss" || raceStateRef.mode === "campaign-rival";
  el.storyMapStart.classList.remove("active");
  el.timeMapStart.classList.remove("active");
  if (isStory) {
    el.storyMessage.className = "race-message";
    el.storyMessage.textContent = "Get ready.";
  } else {
    el.timeMessage.className = "race-message";
    el.timeMessage.textContent = "Get ready.";
  }
  runCountdown(isStory ? el.storyCountdown : el.timeCountdown, () => {
    if (verticalRace !== raceStateRef) return;
    raceStateRef.active = true;
    raceStateRef.startTime = performance.now();
    raceStateRef.last = raceStateRef.startTime;
    requestAnimationFrame(updateVerticalRace);
  });
}

function runCountdown(node, done) {
  const steps = ["3", "2", "1", "GO"];
  let index = 0;
  node.classList.add("active");
  node.textContent = steps[index];
  playAudioCue("raceCountdown");
  const timer = setInterval(() => {
    index += 1;
    if (index >= steps.length) {
      clearInterval(timer);
      node.classList.remove("active");
      node.textContent = "";
      done();
      return;
    }
    node.textContent = steps[index];
    playAudioCue(index === steps.length - 1 ? "raceStart" : "raceCountdown");
  }, 700);
}

function updateVerticalRace(now) {
  if (!verticalRace?.active) return;
  const raceState = verticalRace;
  const dt = Math.min(0.05, (now - raceState.last) / 1000);
  raceState.last = now;
  const maxSpeed = raceState.stats.maxSpeed;
  const accel = raceState.stats.acceleration;
  const keys = raceState.keys;
  raceState.player.x += ((verticalKeyActive(keys, "right") ? 1 : 0) - (verticalKeyActive(keys, "left") ? 1 : 0)) * raceState.stats.handling * dt;
  const targetY = 90 - Math.min(42, (raceState.player.distance / raceState.targetDistance) * 42);
  raceState.player.y += (targetY - raceState.player.y) * 1.8 * dt;
  raceState.player.y += ((verticalKeyActive(keys, "down") ? 1 : 0) - (verticalKeyActive(keys, "up") ? 1 : 0)) * 22 * dt;
  raceState.player.x = Math.max(12, Math.min(88, raceState.player.x));
  raceState.player.y = Math.max(28, Math.min(94, raceState.player.y));
  raceState.player.speed = Math.min(maxSpeed, raceState.player.speed + accel * 0.22 * dt);
  raceState.player.distance += mphToMetersPerSecond(raceState.player.speed) * dt;

  if (raceState.boss) {
    steerBossTowardItems(dt);
    raceState.boss.speed = Math.min(maxSpeed * (0.54 + raceState.boss.difficulty * 0.15), raceState.boss.speed + (3.5 + raceState.boss.difficulty * 2.5) * dt);
    raceState.boss.distance += mphToMetersPerSecond(raceState.boss.speed) * dt;
    const bossTargetY = 90 - Math.min(42, (raceState.boss.distance / raceState.targetDistance) * 42);
    raceState.boss.y += (bossTargetY - raceState.boss.y) * 1.8 * dt;
    raceState.boss.y = Math.max(28, Math.min(94, raceState.boss.y));
  }

  raceState.spawnTimer -= dt;
  if (raceState.spawnTimer <= 0) {
    spawnTrackItem();
    raceState.spawnTimer = Math.max(0.45, 1.05 - raceState.trackIndex * 0.05);
  }
  updateTrackItems(dt);
  updateGhost(now);
  raceState.record.push({ t: now - raceState.startTime, x: raceState.player.x, y: raceState.player.y, d: raceState.player.distance });
  updateVerticalPositions();

  if (raceState.player.distance >= raceState.targetDistance || raceState.boss?.distance >= raceState.targetDistance) {
    finishVerticalRace(raceState.player.distance >= (raceState.boss?.distance || 0));
    return;
  }
  requestAnimationFrame(updateVerticalRace);
}

function spawnTrackItem() {
  const item = document.createElement("div");
  const token = Math.random() > 0.42;
  const config = token
    ? trackItems.tokens[Math.floor(Math.random() * trackItems.tokens.length)]
    : trackItems.obstacles[Math.floor(Math.random() * trackItems.obstacles.length)];
  item.className = `track-item ${token ? "token" : "obstacle"}`;
  item.textContent = token ? "+" : "!";
  addItemImage(item, config);
  const data = { node: item, x: 16 + Math.random() * 68, y: -8, type: token ? "token" : "obstacle", config };
  item.style.left = `${data.x}%`;
  item.style.top = `${data.y}%`;
  verticalRace.trackNode.appendChild(item);
  verticalRace.items.push(data);
}

function addItemImage(item, config) {
  const image = new Image();
  image.alt = config.name;
  image.onload = () => {
    item.textContent = "";
    item.classList.add("has-image");
    item.appendChild(image);
  };
  image.src = config.image;
}

function updateTrackItems(dt) {
  const speed = 24 + verticalRace.player.speed * 0.2;
  verticalRace.items.forEach((item) => {
    item.y += speed * dt;
    item.node.style.top = `${item.y}%`;
    const playerHit = Math.abs(item.x - verticalRace.player.x) < 8 && Math.abs(item.y - verticalRace.player.y) < 8;
    const bossHit = verticalRace.boss && Math.abs(item.x - verticalRace.boss.x) < 8 && Math.abs(item.y - verticalRace.boss.y) < 8;
    if (playerHit && !item.hit) applyVerticalItemHit("player", item);
    if (bossHit && !item.hit) applyVerticalItemHit("boss", item);
  });
  verticalRace.items = verticalRace.items.filter((item) => !item.hit && item.y < 112);
}

function steerBossTowardItems(dt) {
  const boss = verticalRace.boss;
  if (!boss) return;
  const target = verticalRace.items
    .filter((item) => item.y > 0 && item.y < boss.y + 12)
    .sort((a, b) => {
      const aScore = (a.type === "token" ? 0 : 22) + Math.abs(a.y - boss.y) + Math.abs(a.x - boss.x) * 0.7;
      const bScore = (b.type === "token" ? 0 : 22) + Math.abs(b.y - boss.y) + Math.abs(b.x - boss.x) * 0.7;
      return aScore - bScore;
    })[0];
  const desiredX = target
    ? target.x + (target.type === "obstacle" ? (target.x > boss.x ? -14 : 14) : 0)
    : 52 + Math.sin(performance.now() / 700) * 8;
  const steering = Math.max(-1, Math.min(1, desiredX - boss.x));
  boss.x = Math.max(16, Math.min(84, boss.x + steering * (18 + boss.difficulty * 12) * dt));
}

function applyVerticalItemHit(target, item) {
  const racer = target === "boss" ? verticalRace.boss : verticalRace.player;
  if (!racer) return;
  item.hit = true;
  if (item.type === "token") {
    if (target === "player") verticalRace.itemScore = Math.min(3, verticalRace.itemScore + 1);
    const boost = target === "player" ? item.config.boost * verticalRace.stats.boostEffectiveness : item.config.boost;
    racer.speed = Math.min(verticalRace.stats.maxSpeed, racer.speed + boost);
    racer.distance = Math.min(verticalRace.targetDistance, racer.distance + 24);
    racer.y = Math.max(28, racer.y - 9);
  } else {
    if (target === "player") verticalRace.itemScore -= 1;
    const penalty = target === "player" ? item.config.penalty * verticalRace.stats.obstacleResistance : item.config.penalty;
    racer.speed = Math.max(20, racer.speed - penalty);
    racer.distance = Math.max(0, racer.distance - 18);
    racer.y = Math.min(94, racer.y + 11);
  }
  item.node.remove();
  if (target === "player" && verticalRace.itemScore <= -3) {
    failVerticalRace("You Crashed");
  }
}

function updateGhost(now) {
  if (verticalRace.mode !== "time" || !verticalRace.ghostNode || !verticalRace.ghost?.length) return;
  const elapsed = now - verticalRace.startTime;
  const point = verticalRace.ghost.find((entry) => entry.t >= elapsed) || verticalRace.ghost[verticalRace.ghost.length - 1];
  verticalRace.ghostNode.style.left = `${point.x}%`;
  verticalRace.ghostNode.style.top = `${point.y}%`;
}

function updateVerticalPositions() {
  const raceState = verticalRace;
  if (!raceState) return;
  raceState.player.node.style.left = `${raceState.player.x}%`;
  raceState.player.node.style.top = `${raceState.player.y}%`;
  if (raceState.boss) {
    raceState.boss.node.style.left = `${raceState.boss.x}%`;
    raceState.boss.node.style.top = `${raceState.boss.y}%`;
  }
  const distance = Math.min(raceState.targetDistance, Math.floor(raceState.player.distance));
  if (raceState.mode === "boss" || raceState.mode === "campaign-boss" || raceState.mode === "campaign-rival") {
    el.storySpeed.textContent = `${Math.round(raceState.player.speed)} MPH`;
    el.storyDistance.textContent = `${distance} / 500 m`;
  } else {
    el.timeClock.textContent = `${((performance.now() - raceState.startTime) / 1000).toFixed(2)} s`;
    el.timeDistance.textContent = `${distance} / 1000 m`;
  }
}

function finishVerticalRace(playerWon) {
  const raceState = verticalRace;
  raceState.active = false;
  raceState.finished = true;
  raceState.countdownStarted = false;
  raceState.keys = {};
  updateVerticalControlVisuals();
  el.storyMapStart.classList.remove("active");
  el.timeMapStart.classList.remove("active");
  const elapsed = (performance.now() - raceState.startTime) / 1000;
  let resultSprox = 0;
  let resultWon = playerWon;
  const resultLines = [];
  const isStoryRace = raceState.campaignLevelIndex !== null;
  if (raceState.mode === "boss" || raceState.mode === "campaign-boss" || raceState.mode === "campaign-rival") {
    const sprox = playerWon ? raceState.bossData.xp : Math.floor(raceState.bossData.xp * 0.18);
    addSprox(sprox);
    resultSprox = sprox;
    let unlockedBossName = "";
    if (playerWon) {
      if (raceState.bossData.id === "racer-alpha") {
        state.racerAlphaUnmasked = true;
      }
      unlockedBossName = unlockNextTrainingBossFromBoss(raceState.bossData.id);
    }
    el.storyMessage.className = `race-message ${playerWon ? "win" : "loss"}`;
    const unlockText = unlockedBossName ? ` ${unlockedBossName} is now unlocked.` : "";
    if (unlockedBossName) resultLines.push(`Boss Unlocked: ${unlockedBossName}`);
    el.storyMessage.textContent = "";
    if (raceState.campaignLevelIndex !== null && playerWon) completeCampaignLevel(raceState.campaignLevelIndex);
  } else {
    const trackIndex = raceState.trackIndex;
    const medalSet = raceState.mode === "tutorial-time" ? tutorialMedals : timeMedals;
    const beaten = medalSet.find((medal) => elapsed <= (raceState.mode === "tutorial-time" ? medal.base : timeTarget(medal, trackIndex)));
    resultWon = raceState.mode === "tutorial-time" ? Boolean(beaten) : playerWon;
    const sprox = beaten ? beaten.xp : raceState.mode === "tutorial-time" ? 0 : 40;
    if (sprox) addSprox(sprox);
    resultSprox = sprox;
    if (raceState.mode === "tutorial-time" && beaten) {
      state.tutorialTimeMedal = `<strong class="medal-text ${beaten.key}">${beaten.label}</strong>`;
    }
    const best = state.timeTrials[raceState.trackId]?.bestTime;
    if (raceState.mode === "time" && (!best || elapsed < best)) {
      state.timeTrials[raceState.trackId] = { bestTime: elapsed, ghost: raceState.record.filter((_, index) => index % 4 === 0) };
    }
    if (raceState.mode === "campaign-time" && beaten && raceState.campaignLevelIndex !== null) {
      const storyBest = state.storyTimeTrials[raceState.campaignLevelIndex]?.bestTime;
      if (!storyBest || elapsed < storyBest) {
        state.storyTimeTrials[raceState.campaignLevelIndex] = {
          bestTime: elapsed,
          medalKey: beaten.key,
          medalLabel: beaten.label
        };
      }
    }
    resultLines.push(`Time: ${elapsed.toFixed(2)} seconds`);
    resultLines.push(beaten ? `<span class="medal-text ${beaten.key}">${beaten.label}</span> Medal Awarded` : "Finish Recorded");
    el.timeMessage.className = `race-message ${beaten ? "win" : ""}`;
    el.timeMessage.textContent = "";
    if (raceState.campaignLevelIndex !== null) completeCampaignLevel(raceState.campaignLevelIndex);
  }
  recordRaceUsage(raceState.carId);
  const partReward = isStoryRace && resultWon ? rollStoryPartReward() : null;
  if (partReward) resultLines.push(partRewardResultMarkup(partReward));
  recordStoryRaceOutcome(resultWon, isStoryRace);
  const medalResult = isStoryRace
    ? saveStoryMedal(raceState.campaignLevelIndex, { won: resultWon, medalKey: state.storyTimeTrials?.[raceState.campaignLevelIndex]?.medalKey })
    : { medal: "none", improved: false };
  evaluateMicroObjectives({ eventId: isStoryRace ? storyEventId(raceState.campaignLevelIndex) : raceState.mode, won: resultWon, elapsed });
  saveState();
  render();
  // Only apply tutorial overrides when tutorial is specifically running this time trial
  const tutorialInTime = tutorialActive() && raceState.mode === "tutorial-time";
  showRaceResult(raceState.trackNode, {
    won: resultWon,
    title: tutorialActive() && !resultWon ? "RACE LOST" : undefined,
    sprox: resultSprox,
    medal: resultWon ? medalResult.medal : "none",
    medalImproved: medalResult.improved,
    lines: tutorialActive() && !resultWon ? [] : resultLines,
    primaryLabel: tutorialInTime && resultWon ? "Next" : tutorialInTime && !resultWon ? "Try Again" : isStoryRace ? "Next" : raceState.mode === "time" ? "Select Map" : "Select Opponent",
    primaryTone: tutorialInTime && resultWon ? "success" : "",
    raceAgainLabel: "Race Again",
    hideRaceAgain: tutorialInTime && !resultWon,
    hideSprox: tutorialInTime && !resultWon,
    disableActions: tutorialInTime && resultWon,
    onPrimary: () => {
      if (tutorialInTime && !resultWon) {
        startTutorialHeadToHeadRace();
        setTutorialScene("head2head-win");
        saveState();
        renderTutorial();
        return;
      }
      if (tutorialInTime && resultWon && currentTutorialScene().id === "head2head-win") {
        advanceTutorial();
        return;
      }
      if (raceState.mode === "boss" || raceState.mode === "campaign-boss" || raceState.mode === "campaign-rival") {
        if (playerWon && raceState.mode === "boss" && raceState.bossData.id === "racer-alpha") {
          showRacerAlphaUnmask();
          return;
        }
      }
      if (isStoryRace) {
        const finishStory = () => {
          finishStoryRaceScreen();
        };
        const level = campaignLevels[raceState.campaignLevelIndex];
        if (playerWon && raceState.mode === "campaign-rival" && level?.type === "rival") {
          openRivalDialogue(level, "post", finishStory);
          return;
        }
        if (playerWon && raceState.mode === "campaign-boss" && shouldShowStoryCutscene(raceState.campaignLevelIndex, level)) {
          openStoryCutscene(level, finishStory, "post");
          return;
        }
        finishStory();
      } else if (raceState.mode === "boss") {
        setFlowStep("boss", "match");
      } else {
        setFlowStep("time", "match");
      }
    },
    onRaceAgain: () => {
      if (isStoryRace) {
        startCampaignRace(raceState.campaignLevelIndex, campaignLevels[raceState.campaignLevelIndex]);
        return;
      }
      if (raceState.mode === "boss") {
        beginVerticalRace("boss", true, { boss: raceState.bossData });
        return;
      }
      beginVerticalRace("time", true, { track: storyTracks.find((track) => track.id === raceState.trackId) });
    }
  });
}

function failVerticalRace(title) {
  const raceState = verticalRace;
  if (!raceState || raceState.finished) return;
  raceState.active = false;
  raceState.finished = true;
  raceState.countdownStarted = false;
  raceState.keys = {};
  updateVerticalControlVisuals();
  el.storyMapStart.classList.remove("active");
  el.timeMapStart.classList.remove("active");
  if (raceState.mode === "boss" || raceState.mode === "campaign-boss" || raceState.mode === "campaign-rival") {
    el.storyMessage.className = "race-message loss";
    el.storyMessage.textContent = "";
  } else {
    el.timeMessage.className = "race-message loss";
    el.timeMessage.textContent = "";
  }
  const isStoryRace = raceState.campaignLevelIndex !== null;
  recordStoryRaceOutcome(false, isStoryRace);
  saveState();
  const tutorialInTime = tutorialActive() && raceState.mode === "tutorial-time";
  showRaceResult(raceState.trackNode, {
    won: false,
    title: tutorialInTime ? "RACE LOST" : title,
    sprox: 0,
    primaryLabel: tutorialInTime ? "Try Again" : isStoryRace ? "Next" : raceState.mode === "time" ? "Select Map" : "Select Opponent",
    raceAgainLabel: "Race Again",
    hideRaceAgain: tutorialInTime,
    hideSprox: tutorialInTime,
    onPrimary: () => {
      if (tutorialInTime) {
        startTutorialHeadToHeadRace();
        setTutorialScene("head2head-win");
        saveState();
        renderTutorial();
        return;
      }
      if (isStoryRace) {
        finishStoryRaceScreen();
      } else if (raceState.mode === "boss") {
        setFlowStep("boss", "match");
      } else {
        setFlowStep("time", "match");
      }
    },
    onRaceAgain: () => {
      if (isStoryRace) {
        startCampaignRace(raceState.campaignLevelIndex, campaignLevels[raceState.campaignLevelIndex]);
        return;
      }
      if (raceState.mode === "boss") {
        beginVerticalRace("boss", true, { boss: raceState.bossData });
        return;
      }
      beginVerticalRace("time", true, { track: storyTracks.find((track) => track.id === raceState.trackId) });
    }
  });
}

function clearTrackItems(trackNode) {
  trackNode.querySelectorAll(".track-item").forEach((item) => item.remove());
}

function readableKey(key) {
  return key === " " || key === "Space" ? "Space" : key;
}

function normalizeKey(event) {
  return event.code === "Space" ? "Space" : event.key.length === 1 ? event.key.toUpperCase() : event.key;
}

const verticalArrowKeys = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight"
};

function verticalKeyActive(keys, direction) {
  return Boolean(keys[verticalArrowKeys[direction]] || keys[state.settings.verticalKeys[direction]]);
}

function isVerticalControlKey(key) {
  return Object.values(verticalArrowKeys).includes(key) || Object.values(state.settings.verticalKeys).includes(key);
}

function beep(label) {
  if (!state.settings.volume) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const volume = state.settings.volume / 100;
  osc.frequency.value = label === "Perfect" ? 660 : label === "Good" ? 520 : 260;
  gain.gain.value = 0.035 * volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.07);
}

function setSteer(direction, active) {
  if (!verticalRace?.keys) return;
  const key = {
    left: "ArrowLeft",
    down: "ArrowDown",
    up: "ArrowUp",
    right: "ArrowRight"
  }[direction] || "ArrowRight";
  verticalRace.keys[key] = active;
  updateVerticalControlVisuals();
}

function updateVerticalControlVisuals() {
  const keys = verticalRace?.keys || {};
  document.querySelectorAll(".touch-controls").forEach((group) => {
    const leftActive = verticalKeyActive(keys, "left");
    const rightActive = verticalKeyActive(keys, "right");
    group.classList.toggle("steering-left", leftActive && !rightActive);
    group.classList.toggle("steering-right", rightActive && !leftActive);
    group.querySelectorAll("[data-steer]").forEach((button) => {
      button.classList.toggle("pressed", verticalKeyActive(keys, button.dataset.steer));
    });
  });
}
