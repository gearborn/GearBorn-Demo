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
let lastViewBeforeTunerPage = "menu";

// TODO: tune the launch economy after live pacing data is available.
const GAS_MAX = 100;
const GAS_REGEN_MS = 3 * 60 * 1000;
const GAS_COST_DEFAULT = 8;
const GAS_COST_INDIANAPOLIS = 5;
const GAS_PURCHASE_AMOUNT = 100;
const GAS_PURCHASE_SPINS = 30;

// TODO: tune drag mastery and nitro timing after live race telemetry is available.
const DRAG_PERFECT_HEAT_STEP = 0.018;
const DRAG_PERFECT_HEAT_CAP = 0.09;
const DRAG_MASTERY_BONUS_MIN_STREAK = 3;
const DRAG_MASTERY_BONUS_SPROX_PER_SHIFT = 12;
const DRAG_NITRO_PERFECT_WINDOW_MS = 1400;
const DRAG_NITRO_PERFECT_BONUS = 0.12;
const DRAG_NITRO_DRAFT_BONUS = 0.08;
const DRAG_NITRO_TOP_GEAR_BONUS = 0.08;
const DRAG_SHAKE_LAUNCH = { intensity: 4, ms: 120 };
const DRAG_SHAKE_NITRO = { intensity: 5, ms: 160 };
const DRAG_HITSTOP_PHOTO_MS = 110;
const DRAG_PHOTO_FINISH_MARGIN_METERS = 7;
const DRAG_PHOTO_FINISH_REVEAL_DELAY_MS = 260;
const VIEW_TRANSITION_MS = 190;

// TODO: move dev cheat codes into injected config if these should not ship in plain text.
const devCheatCodes = {
  MOTHERLODE: { flag: "unlimitedSprox", stateKey: "unlimitedSprox", label: "Unlimited Sprox" },
  FREESPIN: { flag: "unlimitedSpins", stateKey: "cheatUnlimitedSpins", label: "Unlimited Spins" },
  LEADFOOT: { flag: "unlimitedGas", stateKey: "cheatUnlimitedGas", label: "Unlimited Gas" },
  OPENROAD: { flag: "unlockAllStory", stateKey: "cheatUnlockAllStory", label: "Unlock All Story Races" }
};

let pendingGasEntry = null;
let gasCountdownInterval = null;
let gasDisplayInterval = null;
let gasPaidGauntletKey = null;

function devCheatActive(name) {
  if (name === "unlimitedSprox") return Boolean(state.unlimitedSprox);
  if (name === "unlimitedSpins") return Boolean(state.cheatUnlimitedSpins);
  if (name === "unlimitedGas") return Boolean(state.cheatUnlimitedGas);
  if (name === "unlockAllStory") return Boolean(state.cheatUnlockAllStory);
  return false;
}

function allStoryUnlocked() {
  return devCheatActive("unlockAllStory");
}

function accrueGas() {
  const now = Date.now();
  let last = Number(state.gasUpdatedAt) || now;
  if (last > now) last = now;
  if (state.gas >= GAS_MAX) {
    state.gasUpdatedAt = now;
    return;
  }
  const elapsed = now - last;
  const gained = Math.floor(elapsed / GAS_REGEN_MS);
  if (gained <= 0) {
    state.gasUpdatedAt = last;
    return;
  }
  const room = GAS_MAX - state.gas;
  const applied = Math.min(gained, room);
  state.gas += applied;
  state.gasUpdatedAt = state.gas >= GAS_MAX ? now : last + applied * GAS_REGEN_MS;
}

function gasCostForRace(context = {}) {
  if (context.isTutorial || tutorialActive()) return 0;
  if (typeof context.gasCostOverride === "number") return Math.max(0, Math.floor(context.gasCostOverride));
  if (context.cityId === "indianapolis") return GAS_COST_INDIANAPOLIS;
  // TODO: add a per-level cost table when higher-city energy tuning is approved.
  return GAS_COST_DEFAULT;
}

function canParticipate(cost) {
  if (devCheatActive("unlimitedGas")) return true;
  accrueGas();
  return state.gas >= cost;
}

function spendGas(cost) {
  if (devCheatActive("unlimitedGas")) return true;
  accrueGas();
  const value = Math.max(0, Math.floor(Number(cost) || 0));
  if (state.gas < value) return false;
  const wasPaused = state.gas >= GAS_MAX;
  state.gas -= value;
  if (wasPaused && state.gas < GAS_MAX) state.gasUpdatedAt = Date.now();
  return true;
}

function requestRaceEntry(context, proceed) {
  const cost = gasCostForRace(context);
  if (canParticipate(cost)) {
    spendGas(cost);
    saveState();
    renderGasBar();
    proceed();
    return;
  }
  openGasEmptyModal(cost, context, proceed);
}

function haptic(pattern) {
  if (state?.settings?.haptics === false) return;
  const deviceNavigator = globalThis.navigator || window.navigator;
  const vibrate = deviceNavigator?.vibrate?.bind(deviceNavigator);
  if (!vibrate) return;
  try {
    vibrate(pattern);
  } catch (err) {
    console.warn("GearBorn haptic failed:", err);
  }
}

function screenShake(intensity = 4, ms = 120, target = el.dragTrack) {
  if (!target || !effectsAllowed()) return;
  target.style.setProperty("--shake-intensity", `${Math.max(1, intensity)}px`);
  target.classList.add("screen-shake");
  window.clearTimeout(target._gearbornShakeTimer);
  target._gearbornShakeTimer = window.setTimeout(() => {
    target.classList.remove("screen-shake");
    target.style.removeProperty("--shake-intensity");
  }, Math.max(40, ms));
}

function hitStop(ms = 90) {
  if (!effectsAllowed() || !race) return;
  race.hitStopUntil = Math.max(race.hitStopUntil || 0, performance.now() + Math.max(40, ms));
  el.dragTrack?.classList.add("hit-stop");
  window.setTimeout(() => el.dragTrack?.classList.remove("hit-stop"), Math.max(40, ms));
}

function flashHighVisCue(target = el.dragTrack) {
  if (!target || state?.settings?.highVisCues === false) return;
  target.classList.remove("high-vis-flash");
  void target.offsetWidth;
  target.classList.add("high-vis-flash");
  window.setTimeout(() => target.classList.remove("high-vis-flash"), 160);
}

function showRaceStartReveal(label = "GO") {
  if (!el.dragTrack || !effectsAllowed()) return;
  el.dragTrack.dataset.startReveal = label;
  el.dragTrack.classList.remove("race-start-reveal");
  void el.dragTrack.offsetWidth;
  el.dragTrack.classList.add("race-start-reveal");
  window.setTimeout(() => el.dragTrack?.classList.remove("race-start-reveal"), 360);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

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

function formatSpins(amount = state.spins) {
  return devCheatActive("unlimitedSpins") ? "∞ Spins" : `${Math.max(0, Math.floor(Number(amount) || 0))} Spins`;
}

function addSpins(amount) {
  const before = Math.max(0, Math.floor(Number(state.spins) || 0));
  state.spins = Math.max(0, Math.floor(before + (Number(amount) || 0)));
  return state.spins - before;
}

function spendSpins(cost) {
  if (devCheatActive("unlimitedSpins")) return true;
  const value = Math.max(0, Math.floor(Number(cost) || 0));
  if ((state.spins || 0) < value) return false;
  state.spins -= value;
  return true;
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
  recordTunerStat("totalSproxEarned", Math.max(0, Math.floor(amount || 0)));
  return Math.max(0, Math.floor(amount));
}

function recordTunerStat(key, increment = 1) {
  if (!key) return;
  state.tunerStats = state.tunerStats || {};
  state.tunerStats[key] = Math.max(0, Math.floor(Number(state.tunerStats[key]) || 0)) + increment;
  if (key === "totalSproxEarned") recordDailyGoalProgress("earnSprox", increment);
  const rotating = dailyRotatingGoalType();
  if ((key === "dragRacesWon" && rotating === "drag")
    || (key === "headToHeadWon" && rotating === "vs")
    || (key === "battlesWon" && rotating === "battle")) recordDailyGoalProgress("rotating");
}

function recordTunerCarUsed(carId) {
  if (!carId || !cars.some((car) => car.id === carId)) return;
  state.tunerStats = state.tunerStats || {};
  state.tunerStats.carsUsedAtLeastOnce = Array.isArray(state.tunerStats.carsUsedAtLeastOnce)
    ? state.tunerStats.carsUsedAtLeastOnce
    : [];
  if (!state.tunerStats.carsUsedAtLeastOnce.includes(carId)) {
    state.tunerStats.carsUsedAtLeastOnce.push(carId);
  }
}

function recordTunerPlaySession() {
  state.tunerStats = state.tunerStats || {};
  if (!state.tunerStats.firstPlayedAt) state.tunerStats.firstPlayedAt = Date.now();
  state.tunerStats.lastPlayedAt = Date.now();
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
  recordDailyGoalProgress("spendGarage");
  return true;
}

function isFusionLine(lineId) {
  return Boolean(fusionRecipes?.some((recipe) => recipe.id === lineId));
}

function classForLineId(lineId) {
  if (isFusionLine(lineId)) return "A";
  const car = cars.find((item) => item.id === lineId);
  const baseName = car?.evolutions?.[0]?.name || car?.forms?.[0]?.[1] || "";
  const entry = vindexEntries.find((item) => item.name === baseName);
  return getVindexClass(entry);
}

function crankVaultEligibleLines(candidateLines = null) {
  const exclusions = new Set(["art-van", "cake-train", "waste-management", "rainbowlt", "narwhal-luxury", "metal-snake", "training-car"]);
  const unlockable = candidateLines || [...new Set(defaultUnlockedLines.concat(pinkSlipUnlockOrder, gauntletUnlockOrder, convoyUnlockOrder, bossUnlockOrder))];
  return unlockable.reduce((groups, lineId) => {
    const classLetter = classForLineId(lineId);
    if (!exclusions.has(lineId) && !isFusionLine(lineId) && groups[classLetter] && cars.some((car) => car.id === lineId)) groups[classLetter].push(lineId);
    return groups;
  }, { E: [], D: [], C: [] });
}

function rollWeightedKey(weights = {}, validKeys = Object.keys(weights)) {
  const entries = Object.entries(weights).filter(([key, weight]) => validKeys.includes(key) && Number(weight) > 0);
  const total = entries.reduce((sum, [, weight]) => sum + Number(weight), 0);
  if (!total) return validKeys[0] || "";
  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= Number(weight);
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1]?.[0] || "";
}

function grantMedallion(lineId) {
  const car = cars.find((item) => item.id === lineId);
  if (!car) return null;
  state.medallionsOwned = Array.isArray(state.medallionsOwned) ? state.medallionsOwned : [];
  const firstTime = !state.unlockedLines?.includes(lineId) && !state.medallionsOwned.includes(lineId);
  state.medallionsOwned.push(lineId);
  return { lineId, firstTime, classLetter: classForLineId(lineId) };
}

function openCrankVault(vaultDef, cityCandidatesOrNull = null) {
  if (!vaultDef) return [];
  recordDailyGoalProgress("openVault");
  const pool = crankVaultEligibleLines(cityCandidatesOrNull);
  const assignedCandidates = Array.isArray(cityCandidatesOrNull)
    ? cityCandidatesOrNull.filter((lineId) => cars.some((car) => car.id === lineId))
    : [];
  const results = [];
  vaultDef.rewards.forEach((reward) => {
    if (reward.kind === "medallion") {
      for (let index = 0; index < (reward.count || 1); index += 1) {
        const availableClasses = Object.keys(pool).filter((classLetter) => pool[classLetter].length);
        const classLetter = assignedCandidates.length ? "" : rollWeightedKey(reward.weights, availableClasses);
        const candidates = assignedCandidates.length ? assignedCandidates : pool[classLetter] || [];
        const lineId = candidates[Math.floor(Math.random() * candidates.length)];
        const car = cars.find((item) => item.id === lineId);
        const granted = lineId ? grantMedallion(lineId) : null;
        if (granted && car) results.push({ kind: "medallion", ...granted, formName: car.evolutions[0].name, image: forgeMedallionSrc(lineId) });
      }
    } else if (reward.kind === "spins") {
      results.push({ kind: "spins", amount: addSpins(reward.amount) });
    } else if (reward.kind === "sprox") {
      results.push({ kind: "sprox", amount: addSprox(reward.amount) });
    }
  });
  saveState();
  renderSproxWallet();
  renderCrankVaultBadge();
  return results;
}

function currentVaultDayKey() {
  return new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function nextVaultResetTime() {
  const now = new Date();
  const reset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12));
  if (reset.getTime() <= now.getTime()) reset.setUTCDate(reset.getUTCDate() + 1);
  return reset;
}

function dailyVaultAvailable() {
  return state.dailyCrankVault?.lastClaimedDayKey !== currentVaultDayKey();
}

function dailyPreviousDayKey() {
  return new Date(Date.now() - 12 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function touchDailyGoals() {
  state.dailyGoals = state.dailyGoals && typeof state.dailyGoals === "object" ? state.dailyGoals : structuredClone(defaultState.dailyGoals);
  const today = currentVaultDayKey();
  if (state.dailyGoals.dayKey !== today) {
    const yesterday = dailyPreviousDayKey();
    state.dailyGoals.loginStreak = state.dailyGoals.lastLoginDayKey === yesterday
      ? (state.dailyGoals.loginStreak || 0) + 1
      : 1;
    state.dailyGoals.lastLoginDayKey = today;
    state.dailyGoals.dayKey = today;
    state.dailyGoals.progress = { login: 1 };
    state.dailyGoals.claimed = {};
    state.dailyGoals.vaultClaimed = false;
    state.dailyGoals.carsRacedToday = [];
    if (state.dailyGoals.loginStreak > 0 && state.dailyGoals.loginStreak % 7 === 0) {
      addCrankVaultToInventory("common", "login-streak");
      showToast("7-Day Streak!", `${state.dailyGoals.loginStreak} days in a row. A Common CrankVault is in your inventory.`);
    }
    saveState();
  }
}

function dailyGoalDayHash() {
  return currentVaultDayKey().split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function dailyRotatingGoalType() {
  return dailyGoalRotation[dailyGoalDayHash() % dailyGoalRotation.length] || "drag";
}

function dailyRotatingGoalLabel() {
  const labels = { drag: "Win 3 Drag Races", vs: "Win 3 Vs Races", battle: "Win 3 Battles" };
  return labels[dailyRotatingGoalType()] || labels.drag;
}

function dailyGoalsCompletedCount() {
  touchDailyGoals();
  return dailyGoalDefs.filter((goal) => (Number(state.dailyGoals.progress?.[goal.id]) || 0) >= goal.target).length;
}

function dailyGoalsVaultReady() {
  touchDailyGoals();
  return dailyGoalsCompletedCount() >= dailyGoalsRequiredForVault && !state.dailyGoals.vaultClaimed;
}

function updateDailyGoalsBadge() {
  renderCrankVaultBadge();
}

function recordDailyGoalProgress(goalId, amount = 1) {
  touchDailyGoals();
  const def = dailyGoalDefs.find((goal) => goal.id === goalId);
  if (!def) return;
  const current = Math.max(0, Number(state.dailyGoals.progress[goalId]) || 0);
  if (current >= def.target) return;
  state.dailyGoals.progress[goalId] = Math.min(def.target, current + amount);
  if (state.dailyGoals.progress[goalId] >= def.target && !(typeof tutorialActive === "function" && tutorialActive())) {
    showToast("Daily Goal Complete", def.id === "rotating" ? dailyRotatingGoalLabel() : def.desc);
  }
  updateDailyGoalsBadge();
  saveState();
}

function claimDailyGoalReward(goalId) {
  touchDailyGoals();
  const def = dailyGoalDefs.find((goal) => goal.id === goalId);
  if (!def || state.dailyGoals.claimed[goalId]) return;
  if ((state.dailyGoals.progress[goalId] || 0) < def.target) return;
  state.dailyGoals.claimed[goalId] = true;
  if (def.reward.sprox) addSprox(def.reward.sprox);
  if (def.reward.spins) addSpins(def.reward.spins);
  showToast("Reward Claimed", def.reward.sprox ? `+${def.reward.sprox} Sprox` : `+${def.reward.spins} Spins`);
  saveState();
  renderDailyGoals();
  renderSproxWallet();
}

function claimDailyGoalsVault() {
  touchDailyGoals();
  if (!dailyGoalsVaultReady()) return;
  state.dailyGoals.vaultClaimed = true;
  addCrankVaultToInventory("common", "daily-goals");
  showToast("Daily Goals Complete!", "A Common CrankVault has been added to your inventory.");
  saveState();
  renderDailyGoals();
  renderCrankVaultBadge();
}

function addCrankVaultToInventory(type, source = "story", candidateLines = null) {
  state.crankVaultInventory = Array.isArray(state.crankVaultInventory) ? state.crankVaultInventory : [];
  state.crankVaultInventory.push({
    id: `vault-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    source,
    candidateLines: Array.isArray(candidateLines) ? candidateLines : null,
    receivedAt: Date.now()
  });
  saveState();
}

function addAssignedMedallionCrankVault(lineId, source) {
  if (!lineId) return false;
  addCrankVaultToInventory("cityMedallion", source, [lineId]);
  return true;
}

function addAssignedCityRewardVault(cityId, rewardKey, lineId, source) {
  const progress = cityProgressFor(cityId);
  if (!lineId || progress.vaultRewards[rewardKey]) return false;
  progress.vaultRewards[rewardKey] = true;
  return addAssignedMedallionCrankVault(lineId, source);
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
  if (allStoryUnlocked()) return Boolean(car);
  if (tutorialActive() && [tutorialCarId, tutorialOpponentCarId].includes(carId)) return true;
  return Boolean(car && state.unlockedLines?.includes(carId));
}

function isPlayerCollectionCar(car) {
  return Boolean(car && (!car.tutorialOnly || (car.id === "training-car" && isCarUnlocked(car.id))));
}

function orderedCarList(list) {
  return [...list].sort((a, b) => {
    const aStarterIndex = defaultUnlockedLines.indexOf(a.id);
    const bStarterIndex = defaultUnlockedLines.indexOf(b.id);
    if (aStarterIndex >= 0 || bStarterIndex >= 0) {
      return (aStarterIndex >= 0 ? aStarterIndex : 999) - (bStarterIndex >= 0 ? bStarterIndex : 999);
    }
    const numberForLine = (car) => {
      const firstFormName = car.evolutions?.[0]?.name || "";
      const entry = vindexEntries.find((item) => item.name === firstFormName);
      const number = entry ? Number(entry.number) : 9999;
      return Number.isFinite(number) ? number : 9999;
    };
    const aNumber = numberForLine(a);
    const bNumber = numberForLine(b);
    if (aNumber !== bNumber) return aNumber - bNumber;
    const aIndex = garageLineOrder.indexOf(a.id);
    const bIndex = garageLineOrder.indexOf(b.id);
    return (aIndex >= 0 ? aIndex : 9999) - (bIndex >= 0 ? bIndex : 9999);
  });
}

function allPlayableFinalFormsUnlocked() {
  const ids = cars.filter((car) => !car.tutorialOnly && !["rainbowlt", "narwhal-luxury"].includes(car.id)).map((car) => car.id);
  return ids.every((carId) => {
    const car = cars.find((item) => item.id === carId);
    const progress = state.garage?.[carId];
    if (!isCarUnlocked(carId) || !progress) return false;
    if (carId === "art-van") return (state.unlockedArtVanForms || []).some((index) => index > 0);
    return unlockedEvolutionIndex(carId) >= car.evolutions.length - 1;
  });
}

function allBond25LinesComplete() {
  const requiredIds = cars
    .filter((car) => !car.tutorialOnly && !["rainbowlt", "narwhal-luxury"].includes(car.id))
    .map((car) => car.id);
  return requiredIds.length > 0 && requiredIds.every((carId) => bondLevelForLine(carId) >= 25);
}

function hasMedallionForLine(carId) {
  return Boolean(
    state.medallionsOwned?.includes(carId) ||
    state.unlockedLines?.includes(carId)
  );
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

function unlockSecretMedallions() {
  state.medallionsOwned = Array.isArray(state.medallionsOwned) ? state.medallionsOwned : [];
  if (!hasMedallionForLine("narwhal-luxury") && allBond25LinesComplete()) {
    state.medallionsOwned.push("narwhal-luxury");
    showToast("Secret Medallion Unlocked", "Narwraith Medallion earned. Use it to unlock the Narwhal Luxury line.");
    return "narwhal-luxury";
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

function lineIsFullyEvolved(lineId) {
  const car = cars.find((item) => item.id === lineId);
  if (!car || !state.garage?.[lineId]) return false;
  return unlockedEvolutionIndex(lineId) >= car.evolutions.length - 1;
}

function medallionTier(lineId) {
  if (!isCarUnlocked(lineId)) return "none";
  if (!lineIsFullyEvolved(lineId)) return "bronze";
  if (bondLevelForLine(lineId) >= 25) return "gold";
  return "silver";
}

function medallionTierLabel(tier) {
  return { bronze: "Bronze", silver: "Silver", gold: "Gold" }[tier] || "";
}

function medallionRankFor(lineId) {
  return Math.max(0, Math.min(5, Math.floor(Number(state.medallionRanks?.[lineId]) || 0)));
}

function medallionsHeldFor(lineId) {
  return (state.medallionsOwned || []).filter((id) => id === lineId).length;
}

function removeMedallions(lineId, count = 1) {
  state.medallionsOwned = Array.isArray(state.medallionsOwned) ? state.medallionsOwned : [];
  let remaining = Math.max(0, Math.floor(Number(count) || 0));
  state.medallionsOwned = state.medallionsOwned.filter((id) => {
    if (id === lineId && remaining > 0) {
      remaining -= 1;
      return false;
    }
    return true;
  });
  return remaining === 0;
}

function duplicateMedallionsHeldFor(lineId) {
  // NOTE: the first medallion represents the line unlock and is not ladder fuel; only duplicates beyond it count.
  return Math.max(0, medallionsHeldFor(lineId) - 1);
}

function medallionRankCostList(lineId) {
  // TODO: add B/A/S/special rank costs if those classes should become rank-able later.
  return medallionRankCosts[classForLineId(lineId)] || null;
}

function spentForRank(lineId, rank = medallionRankFor(lineId)) {
  const costs = medallionRankCostList(lineId);
  if (!costs) return 0;
  return costs.slice(0, Math.max(0, Math.min(5, Math.floor(Number(rank) || 0)))).reduce((total, cost) => total + cost, 0);
}

function spendableMedallionsForRank(lineId) {
  return Math.max(0, duplicateMedallionsHeldFor(lineId) - spentForRank(lineId));
}

const fusionMedallionCost = 5; // fusion cost rule

function fusionRecipeParentLineIds(recipe) {
  return fusionParentLineIds(recipe);
}

function fusionRecipeFor(lineAId, lineBId) {
  const pair = [lineAId, lineBId].filter(Boolean).sort().join("|");
  return fusionRecipes.find((recipe) => fusionRecipeParentLineIds(recipe).slice().sort().join("|") === pair) || null;
}

function fusionParentsEligible(recipe) {
  const [parentAId, parentBId] = fusionRecipeParentLineIds(recipe);
  return medallionTier(parentAId) === "gold" && medallionTier(parentBId) === "gold";
}

function canForge(recipe) {
  if (!recipe) return false;
  const [parentAId, parentBId] = fusionRecipeParentLineIds(recipe);
  return fusionParentsEligible(recipe)
    && spendableMedallionsForRank(parentAId) >= fusionMedallionCost
    && spendableMedallionsForRank(parentBId) >= fusionMedallionCost
    && !isCarUnlocked(recipe.id);
}

function consumeMedallionsForFusion(lineId, count) {
  return removeMedallions(lineId, count);
}

function performFusion(recipe) {
  if (!recipe) return { error: "No fusion recipe found." };
  if (isCarUnlocked(recipe.id)) return { error: "Fusion already owned." };
  if (!fusionParentsEligible(recipe)) return { error: "Both parent lines must be Gold tier." };
  if (!canForge(recipe)) return { error: `Fusion requires ${fusionMedallionCost} spendable medallions from each parent line.` };
  const [parentAId, parentBId] = fusionRecipeParentLineIds(recipe);
  consumeMedallionsForFusion(parentAId, fusionMedallionCost);
  consumeMedallionsForFusion(parentBId, fusionMedallionCost);
  grantMedallion(recipe.id);
  unlockGearbornLine(recipe.id);
  saveState();
  return { fusionId: recipe.id, name: recipe.name };
}

function attemptFusion(parentAId, parentBId, options = {}) {
  const recipe = fusionRecipeFor(parentAId, parentBId);
  if (recipe) return performFusion(recipe);
  if (!options.gamble) return { error: "No fusion recipe found." };
  if (spendableMedallionsForRank(parentAId) < fusionMedallionCost || spendableMedallionsForRank(parentBId) < fusionMedallionCost) {
    return { error: `Fusion gamble requires ${fusionMedallionCost} spendable medallions from each parent line.` };
  }
  consumeMedallionsForFusion(parentAId, fusionMedallionCost);
  consumeMedallionsForFusion(parentBId, fusionMedallionCost);
  const consolationSpins = 5; // TODO tune fusion whiff consolation.
  addSpins(consolationSpins);
  saveState();
  return { whiffed: true, spins: consolationSpins };
}

function nextRankCost(lineId) {
  const costs = medallionRankCostList(lineId);
  const rank = medallionRankFor(lineId);
  if (!costs || rank >= costs.length || rank >= 5) return null;
  return costs[rank];
}

function canRankUp(lineId) {
  const cost = nextRankCost(lineId);
  return isCarUnlocked(lineId) && cost !== null && spendableMedallionsForRank(lineId) >= cost;
}

function rankUp(lineId) {
  if (!canRankUp(lineId)) return medallionRankFor(lineId);
  state.medallionRanks = state.medallionRanks || {};
  state.medallionRanks[lineId] = Math.min(5, medallionRankFor(lineId) + 1);
  saveState();
  return state.medallionRanks[lineId];
}

function medallionRankBoost(lineId, rank = medallionRankFor(lineId)) {
  const boosts = { speed: 0, acceleration: 0, handling: 0, torque: 0, body: 0, powertrain: 0 };
  const value = Math.max(0, Math.min(5, Math.floor(Number(rank) || 0)));
  if (!medallionRankCostList(lineId) || value <= 0) return boosts;
  const baseStats = baseGearbornStatsAtLevel(lineId, state.garage?.[lineId]?.level || 1);
  const stat = battleStrongestStat(baseStats);
  // TODO tune: early ladder pass gives +1 per rank to the line's strongest stat and +1 body/powertrain at high rank.
  boosts[stat] = value;
  if (value >= 3) boosts.body += 1;
  if (value >= 5) boosts.powertrain += 1;
  return boosts;
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

const devTestState = {
  screen: "home",
  characterId: "mylo",
  sceneCategory: "tutorial",
  sceneLines: [],
  sceneIndex: 0,
  sceneTitle: "",
  sceneCode: ""
};
let devTestSoundAudio = null;
let devTestHonkAudio = null;

function devTestScreens() {
  return {
    home: el.devTestHome,
    sounds: el.devTestSounds,
    animations: el.devTestAnimations,
    scenes: el.devTestScenes,
    player: el.devTestScenePlayer
  };
}

function showDevTestScreen(screen = "home") {
  devTestState.screen = screen;
  Object.entries(devTestScreens()).forEach(([key, node]) => {
    if (!node) return;
    const active = key === screen;
    node.hidden = !active;
    node.classList.toggle("active", active);
  });
  renderDevTest();
}

function stopDevTestSound() {
  if (devTestSoundAudio) {
    try {
      devTestSoundAudio.pause();
      devTestSoundAudio.currentTime = 0;
    } catch (error) {}
  }
  devTestSoundAudio = null;
}

function stopDevTestHonk() {
  if (devTestHonkAudio) {
    try {
      devTestHonkAudio.pause();
      devTestHonkAudio.currentTime = 0;
    } catch (error) {}
  }
  devTestHonkAudio = null;
  try {
    honkAudioContext?.suspend?.();
  } catch (error) {}
}

function devTestSoundOptions() {
  return Object.entries({ ...soundLibrary, ...musicLibrary }).map(([key, src]) => ({ key, src }));
}

function devTestHonkOptions() {
  return cars.flatMap((car) => car.evolutions.map((form, evolutionIndex) => ({
    carId: car.id,
    evolutionIndex,
    label: `${form.name} (${car.family})`,
    honkKey: honkKeyForCar(car.id, evolutionIndex),
    override: honkSoundOverrides[slugify(form?.name || "")]
  })));
}

function renderDevTest() {
  if (!viewIsActive("dev-test")) return;
  renderDevTestSounds();
  renderDevTestAnimations();
  renderDevTestSceneSelect();
  renderDevTestScenePlayer();
}

function renderDevTestSounds() {
  if (el.devTestSoundSelect && !el.devTestSoundSelect.options.length) {
    el.devTestSoundSelect.innerHTML = devTestSoundOptions().map(({ key }) => `<option value="${escapeHtml(key)}">${escapeHtml(key)}</option>`).join("");
  }
  if (el.devTestHonkSelect && !el.devTestHonkSelect.options.length) {
    el.devTestHonkSelect.innerHTML = devTestHonkOptions().map((option, index) => `<option value="${index}">${escapeHtml(option.label)}</option>`).join("");
  }
}

function playDevTestSound() {
  const key = el.devTestSoundSelect?.value;
  const option = devTestSoundOptions().find((item) => item.key === key);
  stopDevTestSound();
  if (!option) return;
  devTestSoundAudio = playSound(key, { src: option.src, volume: 1 });
}

function playDevTestHonk() {
  const option = devTestHonkOptions()[Number(el.devTestHonkSelect?.value) || 0];
  const emotion = el.devTestHonkEmotion?.value || "happy";
  stopDevTestHonk();
  if (!option) return;
  if (emotion === "angry" && option.override && typeof Audio !== "undefined") {
    try {
      devTestHonkAudio = new Audio(option.override);
      devTestHonkAudio.volume = audioMasterVolume(0.78);
      devTestHonkAudio.play().catch(() => {
        devTestHonkAudio = null;
        playHonkSound(`${option.honkKey}:${emotion}`);
      });
      flashHonkControls();
      return;
    } catch (error) {
      devTestHonkAudio = null;
    }
  }
  playHonkSound(`${option.honkKey}:${emotion}`);
}

function renderDevTestAnimations() {
  const options = devTestMedallionOptions();
  const html = options.map(({ lineId, label }) => `<option value="${escapeHtml(lineId)}">${escapeHtml(label)}</option>`).join("");
  if (el.devTestForgeMedallion && el.devTestForgeMedallion.dataset.rendered !== "true") {
    el.devTestForgeMedallion.innerHTML = html;
    el.devTestForgeMedallion.dataset.rendered = "true";
  }
  if (el.devTestSpindellMedallion && el.devTestSpindellMedallion.dataset.rendered !== "true") {
    el.devTestSpindellMedallion.innerHTML = html;
    el.devTestSpindellMedallion.dataset.rendered = "true";
  }
}

function devTestMedallionOptions() {
  return Object.keys(forgeMedallionMap)
    .filter((lineId) => cars.some((car) => car.id === lineId))
    .map((lineId) => {
      const car = cars.find((item) => item.id === lineId);
      return { lineId, label: `${car?.evolutions?.[0]?.name || lineId} Medallion` };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

function playDevTestUnlockAnimation(type) {
  const select = type === "spindell" ? el.devTestSpindellMedallion : el.devTestForgeMedallion;
  const lineId = select?.value || devTestMedallionOptions()[0]?.lineId;
  if (!lineId) return;
  runForgeAnimation(lineId, { preview: true, animationType: type === "spindell" ? "spindellKeySync" : "forgeUnlock" });
}

function renderDevTestSceneSelect() {
  if (!el.devTestCharacterRow || !el.devTestSceneNav || !el.devTestSceneList) return;
  el.devTestCharacterRow.innerHTML = tuners.map((tuner) => `
    <button class="dev-test-character ${devTestState.characterId === tuner.id ? "active" : ""}" type="button" data-dev-test-character="${tuner.id}">
      <img src="${tuner.headshot || tuner.image}" alt="" loading="lazy" decoding="async">
      <span>${escapeHtml(tuner.name)}</span>
    </button>
  `).join("");
  const categories = devTestSceneCategories();
  el.devTestSceneNav.innerHTML = categories.map((category) => `
    <button class="${devTestState.sceneCategory === category.id ? "active" : ""}" type="button" data-dev-test-scene-category="${category.id}">
      ${escapeHtml(category.label)}
    </button>
  `).join("");
  const category = categories.find((item) => item.id === devTestState.sceneCategory) || categories[0];
  el.devTestSceneList.innerHTML = category ? devTestSceneCategoryMarkup(category) : "";
}

function devTestSceneCategories() {
  const cityCategories = storyCities.map((city, index) => ({ id: `city:${city.id}`, label: city.final ? "Space" : city.city, city, index }));
  return [
    { id: "tutorial", label: "Tutorial" },
    ...cityCategories,
    { id: "bond", label: "Bond Memories" }
  ];
}

function devTestSceneCategoryMarkup(category) {
  if (category.id === "tutorial") return devTestTutorialSceneMarkup();
  if (category.id === "bond") return devTestBondSceneMarkup();
  return devTestCitySceneMarkup(category.city, category.index);
}

function devTestTutorialSceneMarkup() {
  return `
    <div class="section-heading compact-heading"><p>Tutorial</p><h2>Scene Codes</h2></div>
    <div class="dev-test-scene-grid">
      ${tutorialScenes.filter((scene) => !scene.characterOnly || scene.characterOnly === devTestState.characterId).map((scene) => `
        <button class="dev-test-scene-card" type="button" data-dev-test-scene="tutorial:${scene.id}">
          <span>${escapeHtml(scene.code || scene.id)}</span>
          <strong>${escapeHtml(scene.label || scene.id)}</strong>
        </button>
      `).join("")}
    </div>
  `;
}

function devTestCitySceneMarkup(city, cityIndex = 0) {
  const cityCode = devTestCityCode(city, cityIndex);
  const storyPlan = cityStoryRacePlans[city.id] || [];
  const storyScenes = storyPlan.flatMap((plan, index) => [
    { code: `${cityCode}-${String(index + 1).padStart(3, "0")}A`, key: plan.scenePre, label: `Story ${index + 1} Pre — ${cityStoryRaceLabel(plan, index)}` },
    { code: `${cityCode}-${String(index + 1).padStart(3, "0")}B`, key: plan.scenePost, label: `Story ${index + 1} Post — ${cityStoryRaceLabel(plan, index)}` }
  ]);
  const bossScenes = [
    { code: `${cityCode}-BOSS-A`, key: `${city.id.slice(0, 4)}-boss-pre`, label: "Boss Pre" },
    { code: `${cityCode}-BOSS-B`, key: `${city.id.slice(0, 4)}-boss-post`, label: "Boss Post" }
  ];
  if (city.id === "indianapolis") {
    bossScenes[0].key = "indy-boss-pre";
    bossScenes[1].key = "indy-boss-post";
  }
  const gauntlets = gauntletsForCity(city).map(([gauntletKey, config], index) => ({
    code: `${cityCode}-GAUNTLET-${index + 1}`,
    key: `gauntlet:${gauntletKey}`,
    label: `Medallion Gauntlet — ${config.displayName || gauntletKey}`
  }));
  const convoys = activeConvoysForCity(city.id).map((convoy, index) => ({
    code: `${cityCode}-CONVOY-${index + 1}`,
    key: `convoy:${convoy.id}`,
    label: `Convoy — ${convoy.name || convoy.id}`
  }));
  const pinkSlips = city.levels.filter((level) => level.type === "pink-slip").map((level, index) => ({
    code: `${cityCode}-PINK-${index + 1}`,
    key: `pink:${level.campaignIndex}`,
    label: level.title || "Pink Slip"
  }));
  return `
    ${devTestSceneGroupMarkup("Story", storyScenes)}
    ${devTestSceneGroupMarkup("Medallion Gauntlet", gauntlets)}
    ${devTestSceneGroupMarkup("Convoy", convoys)}
    ${devTestSceneGroupMarkup("Pink Slip", pinkSlips)}
    ${devTestSceneGroupMarkup("Boss", bossScenes)}
  `;
}

function devTestBondSceneMarkup() {
  return `
    <div class="section-heading compact-heading"><p>Bond Memories</p><h2>Select a Line</h2></div>
    <div class="dev-test-bond-list">
      ${cars.map((car) => `
        <div class="dev-test-bond-line">
          <strong>${escapeHtml(car.family)}</strong>
          <div>
            ${bondSceneThresholds.map((threshold) => `
              <button class="ghost" type="button" data-dev-test-scene="bond:${car.id}:${threshold}">Bond ${threshold}</button>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function devTestSceneGroupMarkup(title, scenes) {
  return `
    <section class="dev-test-scene-group">
      <div class="section-heading compact-heading"><p>${escapeHtml(title)}</p><h2>${escapeHtml(title)}</h2></div>
      <div class="dev-test-scene-grid">
        ${(scenes && scenes.length ? scenes : [{ code: "TBD", key: "", label: "No scenes defined yet." }]).map((scene) => `
          <button class="dev-test-scene-card" type="button" data-dev-test-scene="${escapeHtml(scene.key)}" ${scene.key ? "" : "disabled"}>
            <span>${escapeHtml(scene.code)}</span>
            <strong>${escapeHtml(scene.label)}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function devTestCityCode(city, index) {
  if (city?.id === "indianapolis") return "INDY";
  if (city?.final || city?.id === "space") return "SPACE";
  return String(city?.id || `CITY${index + 1}`).replace(/[^a-z0-9]+/gi, "-").split("-").map((part) => part.slice(0, 3).toUpperCase()).join("-");
}

function openDevTestScene(rawKey) {
  if (!rawKey) return;
  const [kind, id, extra] = String(rawKey).split(":");
  if (kind === "tutorial") {
    const scene = tutorialScenes.find((item) => item.id === id);
    const lines = tutorialDialogueForCharacter(devTestState.characterId)[id] || [];
    startDevTestScenePlayer(scene?.code || id, scene?.label || id, lines);
    return;
  }
  if (kind === "bond") {
    const car = cars.find((item) => item.id === id);
    const threshold = Number(extra);
    const scene = bondScenes[id]?.[threshold];
    const lines = scene?.lines?.length
      ? scene.lines
      : [{ speaker: "narration", text: `${car?.family || id} — Bond Level ${threshold}\nThis scene hasn't been written yet.` }];
    startDevTestScenePlayer(`${id}-bond-${threshold}`, scene?.title || `Bond ${threshold}`, lines);
    return;
  }
  if (kind === "gauntlet") {
    const config = gauntletConfigByKey(id);
    const lines = [{ speaker: "narration", text: `Medallion Gauntlet placeholder for ${config?.displayName || id}.` }];
    startDevTestScenePlayer(`GAUNTLET-${id}`, config?.displayName || id, lines);
    return;
  }
  if (kind === "convoy") {
    const script = convoyStoryScriptFor(id, "pre").concat(convoyStoryScriptFor(id, "post"));
    startDevTestScenePlayer(`CONVOY-${id}`, id, script.length ? script : [{ speaker: "narration", text: `Convoy placeholder for ${id}.` }]);
    return;
  }
  if (kind === "pink") {
    const level = campaignLevels[Number(id)];
    startDevTestScenePlayer(`PINK-${id}`, level?.title || "Pink Slip", [{ speaker: "narration", text: `${level?.title || "Pink Slip"} scene placeholder.` }]);
    return;
  }
  const lines = storyDialogueForCharacter(devTestState.characterId)[rawKey] || [{ speaker: "narration", text: `${rawKey} scene placeholder.` }];
  startDevTestScenePlayer(rawKey.toUpperCase(), rawKey, lines);
}

function startDevTestScenePlayer(code, title, lines) {
  devTestState.sceneCode = code || "Scene";
  devTestState.sceneTitle = title || "Scene Preview";
  devTestState.sceneLines = Array.isArray(lines) && lines.length ? lines : [{ speaker: "narration", text: "No lines available." }];
  devTestState.sceneIndex = 0;
  showDevTestScreen("player");
}

function renderDevTestScenePlayer() {
  if (!el.devTestSceneCode || devTestState.screen !== "player") return;
  const line = devTestState.sceneLines[devTestState.sceneIndex] || devTestState.sceneLines[0] || { speaker: "narration", text: "" };
  const profile = tutorialSpeakerProfile(line.speaker || "narration");
  el.devTestSceneCode.textContent = devTestState.sceneCode || "Scene";
  el.devTestSceneTitle.textContent = devTestState.sceneTitle || "Scene Preview";
  el.devTestSceneSpeaker.textContent = profile.name || line.speaker || "Narration";
  el.devTestSceneText.textContent = line.text || "";
  el.devTestScenePortrait.innerHTML = profile.image
    ? `<img src="${profile.image}" alt="" loading="lazy" decoding="async" onerror="this.hidden=true">`
    : `<span>◆</span>`;
  if (el.devTestScenePrev) el.devTestScenePrev.disabled = devTestState.sceneIndex <= 0;
  if (el.devTestSceneNext) el.devTestSceneNext.textContent = devTestState.sceneIndex >= devTestState.sceneLines.length - 1 ? "Restart" : "Next";
}

function stepDevTestScene(delta) {
  if (!devTestState.sceneLines.length) return;
  if (delta > 0 && devTestState.sceneIndex >= devTestState.sceneLines.length - 1) devTestState.sceneIndex = 0;
  else devTestState.sceneIndex = Math.max(0, Math.min(devTestState.sceneLines.length - 1, devTestState.sceneIndex + delta));
  renderDevTestScenePlayer();
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
    shiftWindow: 0.12 + torqueNorm * 0.08,
    idealShiftRpm: Math.max(0.68, Math.min(0.79, 0.735 + (stats.torque - stats.handling) * 0.0012))
  };
}

function displayedGearbornStats(carId) {
  return displayedGearbornStatsAtLevel(carId, state.garage[carId]?.level || 1);
}

function displayedGearbornStatsAtLevel(carId, level) {
  const baseStats = baseGearbornStatsAtLevel(carId, level);
  const boosts = bondBoostsForCar(carId, baseStats);
  const rankBoosts = medallionRankBoost(carId);
  const partBoosts = partBoostsForCar(carId);
  const formBoosts = formBoostsForCar(carId);
  return Object.fromEntries(Object.entries(baseStats).map(([key, value]) => [
    key,
    Math.min(100, value + (boosts[key] || 0) + (rankBoosts[key] || 0) + (partBoosts[key] || 0) + (formBoosts[key] || 0))
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
  recordTunerPlaySession();
  recordTunerCarUsed(carId);
  recordCarUsage(carId);
  recordDailyGoalProgress("finishRaces");
  touchDailyGoals();
  state.dailyGoals.carsRacedToday = Array.isArray(state.dailyGoals.carsRacedToday) ? state.dailyGoals.carsRacedToday : [];
  if (!state.dailyGoals.carsRacedToday.includes(carId)) {
    state.dailyGoals.carsRacedToday.push(carId);
    recordDailyGoalProgress("threeCars");
  }
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
      recordTunerStat("bondBoostsUnlocked");
      showToast("Bond Boost Unlocked!", `${form.name} gained ${formatBondBoosts(milestone.boosts)}!`);
    });
  }
  checkBondMilestones(carId);
  unlockSecretMedallions();
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
  setDialogueDensity(el.bondSceneModal.querySelector(".bond-scene-card"), el.bondSceneText.textContent);
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
  recordTunerPlaySession();
  if (won) recordDailyGoalProgress("winAny");
  if (won && isStoryRace) recordDailyGoalProgress("storyConvoy");
  if (isStoryRace) {
    recordTunerStat(won ? "storyRacesWon" : "storyRacesLost");
  }
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
  if (achievement.type === "narwhalBond") {
    const required = cars.filter((car) => !car.tutorialOnly && !["rainbowlt", "narwhal-luxury"].includes(car.id));
    const current = required.filter((car) => bondLevelForLine(car.id) >= 25).length;
    const total = required.length;
    const complete = hasMedallionForLine("narwhal-luxury") || (total > 0 && current >= total);
    return { current, total, percent: total ? Math.floor((current / total) * 100) : 0, complete, label: complete ? "Unlocked" : `${current}/${total} lines` };
  }
  if (achievement.type === "tutorialFullRun") {
    const complete = Boolean(state.tutorialFullRunCompleted || hasMedallion("training-car"));
    return { current: complete ? 1 : 0, total: 1, percent: complete ? 100 : 0, complete, label: complete ? "Unlocked" : "Secret" };
  }
  return { current: 0, total: 1, percent: 0, complete: false, label: "0%" };
}

function tunerStatTotalRaces() {
  const s = state.tunerStats || {};
  return (s.storyRacesWon || 0) + (s.storyRacesLost || 0)
    + (s.dragRacesWon || 0) + (s.dragRacesLost || 0)
    + (s.battlesWon || 0) + (s.battlesLost || 0)
    + (s.headToHeadWon || 0) + (s.headToHeadLost || 0)
    + (s.lastGearMatchesWon || 0) + (s.lastGearMatchesLost || 0);
}

function tunerStatTotalWins() {
  const s = state.tunerStats || {};
  return (s.storyRacesWon || 0) + (s.dragRacesWon || 0) + (s.battlesWon || 0)
    + (s.headToHeadWon || 0) + (s.lastGearMatchesWon || 0);
}

function tunerStatWinRate() {
  const total = tunerStatTotalRaces();
  return total ? Math.round((tunerStatTotalWins() / total) * 100) : 0;
}

function tunerStatFavoriteCar() {
  const uses = state.recentCarUses || [];
  if (!uses.length) return state.selectedCar || cars[0].id;
  const counts = {};
  uses.forEach(({ carId }) => { counts[carId] = (counts[carId] || 0) + 1; });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || uses[0].carId;
}

function tunerStatCollectionProgress() {
  const total = cars.filter((car) => !car.tutorialOnly).length;
  const unlocked = (state.unlockedLines || []).filter((carId) => cars.some((car) => car.id === carId && !car.tutorialOnly)).length;
  return { unlocked, total, percent: total ? Math.round((unlocked / total) * 100) : 0 };
}

function tunerStatVindexProgress() {
  return vindexCompletionStats();
}

function tunerStatBondMilestonesHit() {
  return Object.values(state.bond || {}).reduce((total, entry) => {
    return total + (Array.isArray(entry?.milestones) ? entry.milestones.length : 0);
  }, 0);
}

function tunerStatMaxLevelCars() {
  return Object.values(state.garage || {}).filter((entry) => entry && entry.level >= maxCarLevel).length;
}

function tunerStatTunerRankBadge() {
  const rank = state.tunerRank?.playerRank;
  return rank == null ? "UR" : `#${rank}`;
}

function tunerStatDaysActive() {
  const first = state.tunerStats?.firstPlayedAt;
  const last = state.tunerStats?.lastPlayedAt;
  if (!first || !last) return 0;
  return Math.max(1, Math.ceil((last - first) / (1000 * 60 * 60 * 24)));
}

function tunerStatCard(label, value, sub = "") {
  return `<div class="tuner-stat-card">
    <span class="tuner-stat-card-label">${escapeHtml(label)}</span>
    <strong class="tuner-stat-card-value">${escapeHtml(String(value))}</strong>
    ${sub ? `<span class="tuner-stat-card-sub">${escapeHtml(sub)}</span>` : ""}
  </div>`;
}

function collectTunerMilestones() {
  const milestones = [];
  const stats = state.tunerStats || {};
  const tuner = selectedTuner();
  if (state.tunerChosen) milestones.push({ label: "Became a Tuner as", value: tuner.name });
  if (state.tunerRank?.playerRank) milestones.push({ label: "Highest Tuner Rank reached", value: tunerStatTunerRankBadge() });
  if ((stats.bossesDefeated || 0) > 0) milestones.push({ label: "Bosses defeated", value: String(stats.bossesDefeated) });
  if ((stats.evolutionsPerformed || 0) > 0) milestones.push({ label: "Evolutions performed", value: String(stats.evolutionsPerformed) });
  if ((state.winStreak || 0) > 0) milestones.push({ label: "Current win streak", value: String(state.winStreak) });
  const collection = tunerStatCollectionProgress();
  if (collection.percent === 100) milestones.push({ label: "Collection", value: "Complete - every GearBorn unlocked" });
  return milestones;
}

function updateTunerHeadshot() {
  const button = document.getElementById("open-tuner-page");
  const image = document.getElementById("tuner-headshot-image");
  if (button) button.hidden = !state.tunerChosen;
  if (!image || !state.tunerChosen) return;
  const tuner = selectedTuner();
  image.src = tuner.headshot || tuner.image || "";
  image.alt = tuner.name || "";
}

function openTunerPage() {
  const currentView = document.querySelector(".view.active")?.id?.replace(/-view$/, "") || "menu";
  if (currentView !== "tuner-page") lastViewBeforeTunerPage = currentView;
  showView("tuner-page");
  renderTunerPage();
}

function closeTunerPage() {
  showView(lastViewBeforeTunerPage || "menu");
}

function renderTunerPage() {
  const tuner = selectedTuner();
  const portraitEl = document.getElementById("tuner-page-portrait");
  if (portraitEl) {
    portraitEl.src = tuner.image || tuner.headshot || "";
    portraitEl.alt = tuner.name || "";
  }
  const nameEl = document.getElementById("tuner-page-name");
  if (nameEl) nameEl.textContent = tuner.name || "-";
  const bioEl = document.getElementById("tuner-page-bio");
  if (bioEl) bioEl.textContent = tuner.bio || "";
  const rankBadgeEl = document.getElementById("tuner-page-rank-badge");
  if (rankBadgeEl) rankBadgeEl.textContent = tunerStatTunerRankBadge();

  const favCarId = tunerStatFavoriteCar();
  const favCar = cars.find((car) => car.id === favCarId) || cars[0];
  const favForm = currentEvolution(favCar.id);
  const favImg = document.getElementById("tuner-page-favorite-image");
  if (favImg && favForm) {
    favImg.src = imageFor(favForm, "display") || "";
    favImg.alt = favForm.name || "";
  }
  const favName = document.getElementById("tuner-page-favorite-name");
  if (favName) favName.textContent = favForm?.name || "-";
  const favLine = document.getElementById("tuner-page-favorite-line");
  if (favLine) favLine.textContent = favCar.family || "";
  const favUses = document.getElementById("tuner-page-favorite-uses");
  const useCount = (state.recentCarUses || []).filter((use) => use.carId === favCar.id).length;
  if (favUses) favUses.textContent = useCount > 0 ? `Used ${useCount} recent race${useCount === 1 ? "" : "s"}` : "First race coming up!";

  const statGrid = document.getElementById("tuner-page-stat-grid");
  if (statGrid) {
    const stats = state.tunerStats || {};
    const collection = tunerStatCollectionProgress();
    const vindex = tunerStatVindexProgress();
    statGrid.innerHTML = `
      ${tunerStatCard("Races Run", tunerStatTotalRaces())}
      ${tunerStatCard("Total Wins", tunerStatTotalWins())}
      ${tunerStatCard("Win Rate", `${tunerStatWinRate()}%`)}
      ${tunerStatCard("Bosses Defeated", stats.bossesDefeated || 0)}
      ${tunerStatCard("Evolutions Performed", stats.evolutionsPerformed || 0)}
      ${tunerStatCard("Bond Milestones", tunerStatBondMilestonesHit())}
      ${tunerStatCard("Cars Maxed", tunerStatMaxLevelCars())}
      ${tunerStatCard("Collection", `${collection.percent}%`, `${collection.unlocked}/${collection.total}`)}
      ${tunerStatCard("VINdex", `${vindex.percent}%`, `${vindex.encountered}/${vindex.total}`)}
      ${tunerStatCard("Sprox Earned", (stats.totalSproxEarned || 0).toLocaleString())}
      ${tunerStatCard("Convoy Stages Won", stats.convoyStagesWon || 0)}
      ${tunerStatCard("Days as Tuner", tunerStatDaysActive())}
    `;
  }

  const milestonesList = document.getElementById("tuner-page-milestones-list");
  if (milestonesList) {
    const milestones = collectTunerMilestones();
    milestonesList.innerHTML = milestones.length
      ? milestones.map((m) => `<li class="tuner-milestone">
          <span class="tuner-milestone-label">${escapeHtml(m.label)}</span>
          <span class="tuner-milestone-value">${escapeHtml(m.value)}</span>
        </li>`).join("")
      : `<li class="tuner-milestone tuner-milestone-empty">Run your first race to start unlocking milestones.</li>`;
  }
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
    addCrankVaultToInventory("common", "VINdex Scholar Achievement");
    message = "Common CrankVault added to your inventory.";
  } else if (achievement.id === "vindex75") {
    const parts = grantRandomLevelTwoParts(3);
    message = `Level 2 parts awarded: ${parts.join(", ")}`;
  } else if (achievement.id === "garbageMedallion") {
    awardMedallion("waste-management");
    state.garbageMedallionAwarded = true;
    message = "Garbage Medallion awarded.";
  } else if (achievement.id === "tutorialTutorqueMedallion") {
    awardMedallion("training-car");
    message = "Thank you for playing the Tutorial! Enjoy a Tutorque Medallion as a reward!";
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
    : orderedCarList(cars.filter((car) => isCarUnlocked(car.id) && isPlayerCollectionCar(car)));
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
    : orderedCarList(cars.filter((car) => isCarUnlocked(car.id) && isPlayerCollectionCar(car)));
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

function computeClosestUnlocks() {
  if (tutorialActive()) return [];
  const markers = [];
  let order = 0;
  const addMarker = (marker) => {
    if (!marker || !(marker.score > 0)) return;
    if (marker.skipIfUnlocked && marker.lineId && isCarUnlocked(marker.lineId)) return;
    markers.push({ ...marker, order: order++ });
  };
  const cityIndex = Math.max(0, Math.min(state.selectedStoryCity || 0, highestUnlockedStoryCityIndex()));
  const city = storyCities[cityIndex] || storyCities[0];

  (state.medallionsOwned || []).forEach((lineId) => {
    const car = cars.find((item) => item.id === lineId);
    if (!car || isCarUnlocked(lineId)) return;
    addMarker({
      score: 1,
      kind: "forge",
      subject: `line:${lineId}`,
      lineId,
      skipIfUnlocked: true,
      title: car.evolutions?.[0]?.name || car.family || "GearBorn",
      detail: `Medallion earned — waiting at ${unlockHubName()}`,
      image: forgeMedallionSrc(lineId),
      silhouette: false,
      action: "forge"
    });
  });

  cars.forEach((car) => {
    if (!car || !isCarUnlocked(car.id)) return;
    const progress = state.garage?.[car.id];
    if (!progress) return;
    const evolution = car.evolutions?.[unlockedEvolutionIndex(car.id)] || currentEvolution(car.id);
    const title = evolution?.name || car.evolutions?.[0]?.name || car.family || "GearBorn";
    const image = imageFor(evolution, "display");
    if (progress.pendingEvolution) {
      addMarker({
        score: 0.95,
        kind: "evolve-ready",
        subject: `line:${car.id}`,
        lineId: car.id,
        title,
        detail: "Ready to evolve!",
        image,
        silhouette: false,
        action: "garage"
      });
      return;
    }
    const level = Math.max(1, Math.floor(Number(progress.level) || 1));
    if (level < maxCarLevel && maxEligibleEvolutionForCar(car.id, level + 1) > unlockedEvolutionIndex(car.id)) {
      addMarker({
        score: 0.75,
        kind: "evolve-close",
        subject: `line:${car.id}`,
        lineId: car.id,
        title,
        detail: `1 level from evolving — ${xpForNextLevel(level)} Sprox`,
        image,
        silhouette: false,
        action: "garage"
      });
    }
  });

  if (city) {
    gauntletsForCity(city).forEach(([gauntletKey, config]) => {
      const progress = gauntletProgress(gauntletKey);
      if (!progress.revealed || progress.completed) return;
      const stage = Math.max(1, Math.min(3, Number(progress.currentStage) || 1));
      addMarker({
        score: 0.6 + ((stage - 1) / 3) * 0.3,
        kind: "gauntlet-progress",
        subject: `line:${config.gearBornLineId || config.medallionId || gauntletKey}`,
        lineId: config.gearBornLineId || config.medallionId,
        skipIfUnlocked: true,
        title: "???",
        detail: `Gauntlet stage ${stage} of 3`,
        image: "",
        silhouette: true,
        action: "story"
      });
    });

    if (!allStoryUnlocked()) {
      const rep = cityReputationPercent(city);
      const horizon = gauntletsForCity(city).find(([gauntletKey, config]) => {
        const progress = gauntletProgress(gauntletKey);
        return config.enabled && !progress.revealed && !progress.completed && rep > 0 && rep < config.unlockReputationPercent;
      });
      if (horizon) {
        const [gauntletKey, config] = horizon;
        addMarker({
          score: (rep / config.unlockReputationPercent) * 0.65,
          kind: "gauntlet-horizon",
          subject: `line:${config.gearBornLineId || config.medallionId || gauntletKey}`,
          lineId: config.gearBornLineId || config.medallionId,
          skipIfUnlocked: true,
          title: "???",
          detail: `${config.unlockReputationPercent - rep}% reputation to a Medallion Gauntlet`,
          image: "",
          silhouette: true,
          action: "story"
        });
      }
    }

    if (!cityBossUnlocked(city) && !cityBossCompleted(city)) {
      const done = cityCoreLevelsCompleted(city);
      const need = cityBossRequirement(city);
      if (done > 0 && done < need) {
        const bossLineId = bossUnlockOrder[storyCities.indexOf(city)];
        addMarker({
          score: (done / need) * 0.7,
          kind: "boss-close",
          subject: bossLineId ? `line:${bossLineId}` : `boss:${city.id}`,
          lineId: bossLineId,
          skipIfUnlocked: true,
          title: "???",
          detail: `${need - done} race${need - done === 1 ? "" : "s"} from the City Boss`,
          image: "",
          silhouette: true,
          action: "story"
        });
      }
    }

    activeConvoysForCity(city.id).forEach((convoy) => {
      if (!convoy || state.convoy?.completed?.[convoy.id]) return;
      addMarker({
        score: 0.55,
        kind: "convoy",
        subject: convoy.medallionId ? `line:${convoy.medallionId}` : `convoy:${convoy.id}`,
        lineId: convoy.medallionId,
        skipIfUnlocked: true,
        title: convoy.name || convoy.sponsor || "Convoy",
        detail: "Convoy medallion up for grabs",
        image: "",
        silhouette: true,
        action: "story"
      });
    });
  }

  const seen = new Set();
  return markers
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .filter((marker) => {
      const subject = marker.subject || `${marker.kind}:${marker.title}`;
      if (seen.has(subject)) return false;
      seen.add(subject);
      return true;
    })
    .slice(0, 3);
}

function unlockMarkerArtMarkup(marker) {
  if (marker.silhouette) return silhouetteMarkup();
  if (marker.kind === "forge" && marker.lineId && !marker.image) {
    return forgeMedallionMarkup(marker.lineId, marker.title, "unlock-marker-img");
  }
  if (!marker.image) return `<span class="unlock-marker-placeholder" aria-hidden="true">?</span>`;
  return `<img class="unlock-marker-img" src="${marker.image}" alt="${escapeHtml(marker.title)}" loading="lazy" decoding="async" onerror="this.hidden=true;">`;
}

function renderUnlockMarkers() {
  if (!el.menuUnlockMarkers) return;
  const markers = computeClosestUnlocks();
  if (!markers.length) {
    el.menuUnlockMarkers.hidden = true;
    el.menuUnlockMarkers.innerHTML = "";
    return;
  }
  el.menuUnlockMarkers.hidden = false;
  el.menuUnlockMarkers.innerHTML = markers.map((marker) => `
    <button class="unlock-marker" type="button" data-unlock-marker="${escapeHtml(marker.action)}">
      <span class="unlock-marker-art">${unlockMarkerArtMarkup(marker)}</span>
      <span class="unlock-marker-text">
        <span class="unlock-marker-kicker">Almost Yours</span>
        <strong>${escapeHtml(marker.title)}</strong>
        <small>${escapeHtml(marker.detail)}</small>
      </span>
    </button>
  `).join("");
}

function renderMenuGoal() {
  const nextRaceNode = document.querySelector("#menu-next-race");
  const nextLevelNode = document.querySelector("#menu-next-level");
  const nextRewardNode = document.querySelector("#menu-next-reward");
  const nextThumbNode = document.querySelector("#menu-next-race-thumb");
  updateStoryCardCta();
  if (!nextRaceNode || !nextRewardNode) return;
  const cityIndex = Math.max(0, Math.min(state.selectedStoryCity || 0, highestUnlockedStoryCityIndex()));
  const city = storyCities[cityIndex] || storyCities[0];
  const level = firstPlayableStoryLevelForCity(cityIndex) || campaignLevels[0];
  const cityName = city?.city || "Indianapolis";
  nextRaceNode.textContent = cityName;
  if (nextLevelNode) nextLevelNode.textContent = level?.title || "Next Level";
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
  updateTunerHeadshot();
  if (activeView === "menu-view") {
    renderMenuGoal();
    renderUnlockMarkers();
  }
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
  if (viewIsActive("crankvaults")) {
    renderCrankVaults();
    renderDailyGoals();
  }
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
  if (viewIsActive("tuner-page")) renderTunerPage();
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

function openCarPicker(targetOrOptions) {
  const options = typeof targetOrOptions === "object" && targetOrOptions
    ? targetOrOptions
    : { target: targetOrOptions };
  const target = options.target || "custom";
  carPickerState.target = target;
  carPickerState.customFilter = typeof options.filter === "function" ? options.filter : null;
  carPickerState.onConfirm = typeof options.onConfirm === "function" ? options.onConfirm : null;
  carPickerState.search = "";
  carPickerState.filters = { favorites: false, recent: false, ready: false, types: [] };
  carPickerState.sort = "level-desc";
  carPickerState.highlighted = options.selectedCarId || pickerTargetCarId(target) || filteredPickerCars()[0]?.id || "";
  const title = document.querySelector("#car-picker-title");
  if (title) title.textContent = options.title || (target === "lastgear" ? "Choose your Last Gear racer" : "Choose GearBorn");
  if (el.carPickerSearch) el.carPickerSearch.value = "";
  if (el.carPickerSort) el.carPickerSort.value = "level-desc";
  renderCarPicker();
  el.carPickerModal?.classList.add("active");
  el.carPickerModal?.setAttribute("aria-hidden", "false");
}

function closeCarPicker(confirm = false) {
  const target = carPickerState.target;
  const highlighted = carPickerState.highlighted;
  const customConfirm = carPickerState.onConfirm;
  if (confirm && highlighted) {
    if (customConfirm) customConfirm(highlighted);
    else setPickerTargetCarId(target, highlighted);
  }
  el.carPickerModal?.classList.remove("active");
  el.carPickerModal?.setAttribute("aria-hidden", "true");
  carPickerState.customFilter = null;
  carPickerState.onConfirm = null;
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
    if (carPickerState.customFilter && !carPickerState.customFilter(car.id)) return false;
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
  if (allStoryUnlocked()) return true;
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
  if (city && !city.final) {
    const progress = cityProgressFor(city.id);
    const storyRep = progress.storyRaces.filter(Boolean).length;
    const convoyRep = activeConvoysForCity(city.id).filter((convoy) => state.convoy?.completed?.[convoy.id]).length;
    return storyRep + convoyRep;
  }
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
  if (city && !city.final) {
    return cityStructureTemplate.storyRaceCount + activeConvoysForCity(city.id).length;
  }
  const levelRep = city.levels
    .filter((level) => !["boss", "pink-slip"].includes(level.type))
    .reduce((total, level) => total + storyLevelReputationValue(level), 0);
  const convoyRep = activeConvoysForCity(city.id).length * 2;
  return levelRep + convoyRep;
}

function cityBossRequirement(city) {
  const total = cityCoreLevelsTotal(city);
  return total > 0 ? total : 0;
}

function storyLevelReputationValue(level) {
  if (!level || ["boss", "pink-slip"].includes(level.type)) return 0;
  return 1;
}

function cityReputationPercent(city) {
  if (allStoryUnlocked()) return 100;
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

function gauntletAssignedCityId(gauntletKey) {
  const config = gauntletConfigByKey(gauntletKey);
  const progress = gauntletProgress(gauntletKey);
  return config?.assignedCityId || progress.assignedCityId || (state.selectedStoryCity != null ? storyCities[state.selectedStoryCity]?.id : storyCities[0]?.id);
}

function gauntletsForCity(city) {
  return city && !city.final
    ? Object.entries(medallionGauntlets).filter(([, config]) => config.assignedCityId === city.id)
    : [];
}

function maybeTriggerMedallionGauntlet(city) {
  if (allStoryUnlocked()) return;
  const next = gauntletsForCity(city).find(([gauntletKey, config]) => {
    const progress = gauntletProgress(gauntletKey);
    return config.enabled && !progress.popupShown && !progress.completed && cityReputationPercent(city) >= config.unlockReputationPercent;
  });
  if (!next) return;
  const [gauntletKey, config] = next;
  if (config.unlockReputationPercent <= 0) {
    saveGauntletProgress(gauntletKey, { revealed: true, popupShown: true, currentStage: 1 });
    saveState();
    return;
  }
  saveGauntletProgress(gauntletKey, { revealed: true, popupShown: true, currentStage: 1 });
  saveState();
  openGauntletPopup(gauntletKey);
}

function storyCityForCampaignIndex(index) {
  const runtimeCityId = campaignLevels[index]?.cityStructureEvent?.cityId;
  if (runtimeCityId) return storyCities.find((city) => city.id === runtimeCityId) || null;
  return storyCities.find((city) => city.levels.some((level) => level.campaignIndex === index)) || null;
}

function cityBossUnlocked(city) {
  if (city.final) return storyCityUnlocked(storyCities.indexOf(city));
  return cityCoreLevelsCompleted(city) >= cityBossRequirement(city);
}

function cityBossCompleted(city) {
  const bossLevel = city.levels.find((level) => level.type === "boss");
  return bossLevel ? storyLevelCompleted(bossLevel.campaignIndex) : false;
}

function cityStructureStoryComplete(city) {
  if (!city || city.final) return false;
  const storyComplete = cityProgressFor(city.id).storyRaces.every(Boolean);
  const convoysComplete = activeConvoysForCity(city.id).every((convoy) => state.convoy?.completed?.[convoy.id]);
  return storyComplete && convoysComplete;
}

function cityStructureBossUnlocked(city) {
  return allStoryUnlocked() || cityStructureStoryComplete(city);
}

function storyLevelVisible(city, level) {
  if (allStoryUnlocked()) return true;
  if (!["boss", "pink-slip"].includes(level.type)) return true;
  if (level.type === "boss") return city.final ? cityBossUnlocked(city) : cityStructureBossUnlocked(city);
  if (level.type === "pink-slip") return level.unlockedWithCity || cityBossCompleted(city);
  return false;
}

function storyLevelLocked(city, level) {
  if (allStoryUnlocked()) return false;
  if (!storyCityUnlocked(storyCities.indexOf(city))) return true;
  if (level.type === "boss") return city.final ? !cityBossUnlocked(city) : !cityStructureBossUnlocked(city);
  if (level.type === "pink-slip") return !(level.unlockedWithCity || cityBossCompleted(city));
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
  const storyProgress = !city.final ? cityProgressFor(city.id) : null;
  const bossUnlockedForMap = city.final ? cityBossUnlocked(city) : cityStructureBossUnlocked(city);
  const convoyProgress = !city.final ? activeConvoysForCity(city.id) : [];
  const bossProgressDone = storyProgress
    ? storyProgress.storyRaces.filter(Boolean).length + convoyProgress.filter((convoy) => state.convoy?.completed?.[convoy.id]).length
    : Math.min(completedCore, requiredCore);
  const bossProgressRequired = storyProgress ? cityStructureTemplate.storyRaceCount + convoyProgress.length : requiredCore;
  const bossProgressPercent = bossProgressRequired ? Math.min(100, Math.round((bossProgressDone / bossProgressRequired) * 100)) : 100;
  el.bossUnlockNote.innerHTML = cityUnlocked && !city.final && !bossUnlockedForMap
    ? `<div class="reputation-meter" style="--rep:${bossProgressPercent}%">
        <div class="rep-copy"><span>REPUTATION</span><strong>${bossProgressDone}/${bossProgressRequired}</strong></div>
        <div class="rep-track"><i></i></div>
        <div class="rep-boss">
          <img class="rep-boss-bg" src="${storyLevelVisuals.boss.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <img class="rep-boss-face" src="${boss.headshot || boss.portrait}" alt="${boss.name}" loading="lazy" decoding="async">
        </div>
      </div>`
    : "";
  el.storyMapStage.innerHTML = renderCityStructure(city);
  if (!tutorialActive()) {
    window.setTimeout(() => maybeTriggerMedallionGauntlet(city), 0);
  }
  if (el.storyCitySelect) el.storyCitySelect.hidden = false;
  if (el.changeStoryCar) el.changeStoryCar.hidden = false;
  renderStoryCityGrid();
  renderConvoyEntry();
  renderStoryLevelPreview();
}

function cityProgressFor(cityId) {
  state.cityProgress = state.cityProgress && typeof state.cityProgress === "object" ? state.cityProgress : {};
  if (!state.cityProgress[cityId] || typeof state.cityProgress[cityId] !== "object") {
    state.cityProgress[cityId] = { ladders: {}, storyRaces: new Array(cityStructureTemplate.storyRaceCount).fill(false), vaultRewards: {} };
  }
  const progress = state.cityProgress[cityId];
  progress.ladders = progress.ladders && typeof progress.ladders === "object" ? progress.ladders : {};
  cityStructureTemplate.ladders.forEach(({ id }) => {
    progress.ladders[id] = { bronze: false, silver: false, gold: false, ...(progress.ladders[id] || {}) };
  });
  progress.storyRaces = Array.isArray(progress.storyRaces) ? progress.storyRaces.slice(0, cityStructureTemplate.storyRaceCount).map(Boolean) : [];
  while (progress.storyRaces.length < cityStructureTemplate.storyRaceCount) progress.storyRaces.push(false);
  progress.vaultRewards = progress.vaultRewards && typeof progress.vaultRewards === "object" ? progress.vaultRewards : {};
  return progress;
}

function placeholderLadderTierUnlocked(progress, modeId, tier) {
  if (allStoryUnlocked()) return true;
  if (tier === "bronze") return true;
  if (tier === "silver") return Boolean(progress.ladders[modeId]?.bronze);
  return Boolean(progress.ladders[modeId]?.silver);
}

let pendingCityPlaceholderPreview = null;
const cityStructureRuntimeLevelKeys = {};

function selectedStoryCharacterId() {
  return selectedTuner()?.id || "mylo";
}

function cityStoryParticipantId(plan) {
  const raw = plan?.opponentId;
  if (!raw || raw === "rival") return raw || "";
  if (typeof raw === "string") return raw;
  return raw[selectedStoryCharacterId()] || raw.mylo || "";
}

function cityStoryParticipantProfile(participantId) {
  const profiles = {
    eli: { id: "eli-kaufman", name: "Eli Kaufman", headshot: "assets/characters/headshots/headshot-eli.png", signatureLineId: "tiger-cart" },
    crosby: { id: "crosby-nash", name: "Crosby Nash", headshot: "assets/characters/headshots/headshot-crosby.png", signatureLineId: "muscle-man" },
    lynx: { id: "lynx", name: "Lynx", headshot: "assets/characters/headshots/headshot-lynx.png", signatureLineId: "butcher-hog" }
  };
  if (participantId === "rival") return rivalTuner();
  return profiles[participantId] || null;
}

function cityStoryOpponentLineId(plan) {
  const participant = cityStoryParticipantProfile(cityStoryParticipantId(plan));
  return participant?.signatureLineId || "";
}

function cityStoryOpponentForm(plan, fallbackLineId = "training-car") {
  const lineId = cityStoryOpponentLineId(plan) || fallbackLineId;
  const car = cars.find((item) => item.id === lineId) || cars.find((item) => item.id === fallbackLineId) || cars[0];
  const form = car?.evolutions?.[0] || {};
  return { car, form };
}

function cityStructureRuntimeKey(parts) {
  return parts.filter((part) => part !== undefined && part !== null).join(":");
}

function cityStructureRuntimeIndex(key, levelFactory) {
  if (cityStructureRuntimeLevelKeys[key] !== undefined) return cityStructureRuntimeLevelKeys[key];
  const level = levelFactory();
  const index = campaignLevels.length;
  level.campaignIndex = index;
  campaignLevels.push(level);
  cityStructureRuntimeLevelKeys[key] = index;
  return index;
}

function cityStoryRuntimeLevel(city, storyIndex) {
  const plan = cityStoryRacePlanFor(city.id, storyIndex);
  const key = cityStructureRuntimeKey(["story", city.id, storyIndex, selectedStoryCharacterId()]);
  return cityStructureRuntimeIndex(key, () => {
    const title = `${city.city} Story ${storyIndex + 1}: ${cityStoryRaceLabel(plan, storyIndex)}`;
    const opponent = cityStoryOpponentForm(plan);
    const base = {
      title,
      track: city.track,
      bossIndex: city.bossIndex,
      xp: Math.round(115 + Math.max(0, city.bossIndex) * 55 + storyIndex * 18),
      cityStructureEvent: { type: "story", cityId: city.id, index: storyIndex, planType: plan?.type || "circuit", scenePre: plan?.scenePre || "", scenePost: plan?.scenePost || "" }
    };
    if (plan?.type === "drag") {
      return {
        ...base,
        type: "drag",
        drag: {
          rankKey: classForLineId(opponent.car.id) || "E",
          name: opponent.form.name || "Opponent",
          xp: base.xp,
          power: 0.66 + Math.max(0, city.bossIndex) * 0.08,
          distance: storyIndex === 0 ? 400 : 800,
          image: imageFor(opponent.form, "race"),
          displayImage: imageFor(opponent.form, "display"),
          trackId: city.id,
          opponents: [{ name: opponent.form.name || "Opponent", image: imageFor(opponent.form, "race"), power: 0.66 + Math.max(0, city.bossIndex) * 0.08, lineId: opponent.car.id }]
        }
      };
    }
    if (plan?.type === "trial") return { ...base, type: "trial", circuitMode: "time" };
    if (plan?.type === "rival") return { ...base, type: "rival", mechanic: "circuitDuel", circuitMode: "duel" };
    if (plan?.type === "battle") {
      return { ...base, type: "battle", opponentLineId: opponent.car.id, opponentName: opponent.form.name || "Opponent" };
    }
    return { ...base, type: "circuit", circuitMode: "race4" };
  });
}

function cityLadderRuntimeLevel(city, modeId, tier) {
  const key = cityStructureRuntimeKey(["ladder", city.id, modeId, tier]);
  return cityStructureRuntimeIndex(key, () => {
    const mode = cityStructureTemplate.ladders.find((item) => item.id === modeId);
    const tierIndex = Math.max(0, cityStructureTemplate.ladderTiers.indexOf(tier));
    const xp = Math.round(95 + Math.max(0, city.bossIndex) * 42 + tierIndex * 34);
    const base = {
      title: `${city.city} ${mode?.label || "Ladder"} · ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
      track: city.track,
      bossIndex: city.bossIndex,
      xp,
      cityStructureEvent: { type: "ladder", cityId: city.id, modeId, tier }
    };
    if (modeId === "drag") {
      const stage = campaignDragStages[Math.min(campaignDragStages.length - 1, Math.max(0, city.bossIndex))] || campaignDragStages[0];
      return { ...base, type: "drag", drag: { ...stage, xp, distance: tier === "bronze" ? 400 : 800, trackId: city.id } };
    }
    if (modeId === "trial") return { ...base, type: "trial", circuitMode: "time" };
    if (modeId === "battle") {
      // TODO: tune optional battle ladder opponents separately from city boss data.
      return { ...base, type: "battle" };
    }
    return { ...base, type: "circuit", circuitMode: tier === "bronze" ? "race4" : "race6" };
  });
}

function renderCityStructure(city) {
  if (city.final) return `<div class="city-required-nodes">${city.levels.map((level) => storyMapNodeMarkup(city, level)).join("")}</div>`;
  const progress = cityProgressFor(city.id);
  const storyNodes = cityStructureStoryNodeMarkup(city, progress);
  const bossNode = cityStructureBossNodeMarkup(city, progress);
  const gauntletNodes = gauntletMapNodeMarkup(city);
  const ladderNodes = cityStructureLadderNodeMarkup(city, progress);
  return `
    ${storyNodes}
    ${bossNode}
    ${gauntletNodes}
    ${ladderNodes}
  `;
}

function cityStructureBossNodeMarkup(city, progress) {
  const bossLevel = city.levels.find((level) => level.type === "boss");
  if (!bossLevel) return "";
  const storyComplete = cityStructureStoryComplete(city);
  const unlocked = allStoryUnlocked() || storyComplete;
  const complete = cityBossCompleted(city);
  const position = { x: 50, y: 12 };
  return `
    <button class="story-map-node city-boss-node ${unlocked ? "" : "locked"} ${complete ? "completed" : ""}" type="button" data-story-level="${bossLevel.campaignIndex}" style="left:${position.x}%; top:${position.y}%; --node-color:#52c7ff" ${unlocked ? "" : "disabled"}>
      <span class="story-node-icon layered type-boss">
        <img class="node-bg" src="${storyLevelVisuals.boss.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" onerror="this.remove()">
      </span>
      <span class="story-node-label">${unlocked ? "Boss" : "Locked"}</span>
    </button>
  `;
}

function openCityStoryRacePreview(cityId, index) {
  const city = storyCities.find((item) => item.id === cityId);
  if (!city) return;
  const progress = cityProgressFor(cityId);
  const unlocked = allStoryUnlocked() || index === 0 || progress.storyRaces[index - 1];
  if (!unlocked) return;
  pendingCityPlaceholderPreview = { type: "story", cityId, index };
  el.storyPreviewPanel.classList.add("active");
  el.storyPreviewPanel.setAttribute("aria-hidden", "false");
  closeCitySelect();
  renderCityPlaceholderPreview();
}

function openCityLadderPreview(cityId, modeId, tier) {
  const city = storyCities.find((item) => item.id === cityId);
  if (!city) return;
  const progress = cityProgressFor(cityId);
  const fallbackTier = nextCityLadderTier(progress, modeId);
  tier = tier || fallbackTier;
  if (!placeholderLadderTierUnlocked(progress, modeId, tier)) return;
  pendingCityPlaceholderPreview = { type: "ladder", cityId, modeId, tier };
  el.storyPreviewPanel.classList.add("active");
  el.storyPreviewPanel.setAttribute("aria-hidden", "false");
  closeCitySelect();
  renderCityPlaceholderPreview();
}

function openGauntletPreview(gauntletKey) {
  const assignedCityId = gauntletAssignedCityId(gauntletKey);
  const city = storyCities.find((item) => item.id === assignedCityId) || storyCities[state.selectedStoryCity] || storyCities[0];
  const config = gauntletConfigByKey(gauntletKey);
  if (!city || !config?.enabled) return;
  const progress = gauntletProgress(gauntletKey);
  if (progress.completed) return;
  pendingCityPlaceholderPreview = { type: "gauntlet", cityId: gauntletKey };
  el.storyPreviewPanel.classList.add("active");
  el.storyPreviewPanel.setAttribute("aria-hidden", "false");
  closeCitySelect();
  renderCityPlaceholderPreview();
}

function renderCityPlaceholderPreview() {
  if (!pendingCityPlaceholderPreview || !el.storyPreviewPanel?.classList.contains("active")) return;
  const pending = pendingCityPlaceholderPreview;
  const city = storyCities.find((item) => item.id === pending.cityId) || storyCities[state.selectedStoryCity] || storyCities[0];
  const isStory = pending.type === "story";
  const isGauntlet = pending.type === "gauntlet";
  const mode = cityStructureTemplate.ladders.find((item) => item.id === pending.modeId);
  const storyPlan = isStory ? cityStoryRacePlanFor(city.id, pending.index) : null;
  const storyLabel = isStory ? cityStoryRaceLabel(storyPlan, pending.index) : "";
  const storyVisual = isStory ? cityStoryRaceVisual(storyPlan) : null;
  const gauntletConfig = isGauntlet ? gauntletConfigByKey(pending.cityId) : null;
  const tier = pending.tier || "";
  const tierLabel = tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : "";
  const exhibitionCount = pending.modeId === "exhibition" ? (tier === "bronze" ? "4 cars" : "6 cars") : "";
  const title = isGauntlet ? (gauntletConfig?.displayName || "Medallion Gauntlet") : isStory ? storyLabel : `${mode?.label || "Ladder"} · ${tierLabel}`;
  const typeCopy = isGauntlet ? "Medallion Gauntlet" : isStory ? "Story Race" : "Medal Ladder";
  const meta = isGauntlet
    ? `${city.city} · 3-stage event`
    : isStory
    ? `${city.city} story sequence`
    : `${city.city}${exhibitionCount ? ` · ${exhibitionCount}` : ""}`;
  const color = isGauntlet ? "#f6c85f" : isStory ? storyVisual.color : cityLadderNodeColor(tier);
  const storyOpponent = isStory ? cityStoryOpponentForm(storyPlan) : null;
  const storyOpponentName = storyOpponent?.form?.name || (storyPlan?.type === "rival" ? rivalTuner().name : "");
  const storyOpponentImg = storyOpponent?.form ? imageFor(storyOpponent.form, "display") : "";
  const trackImage = city.track?.cityMap || city.track?.map || "";
  const gauntletCar = cars.find((car) => car.id === gauntletConfig?.gearBornLineId);
  const gauntletForm = gauntletCar?.evolutions?.[0];
  const previewDetails = isGauntlet
    ? `<div class="city-preview-detail-grid">
        <div><span>Line</span><strong>${escapeHtml(gauntletForm?.name || gauntletConfig?.displayName || "GearBorn")}</strong></div>
        <div><span>Stages</span><strong>3</strong></div>
        <div><span>Reward</span><strong>Medallion CrankVault</strong></div>
      </div>`
    : isStory
      ? `<div class="city-preview-detail-grid">
          <div><span>Type</span><strong>${escapeHtml(storyLabel)}</strong></div>
          <div><span>Opponent</span><strong>${escapeHtml(storyOpponentName || "Open Field")}</strong></div>
          <div><span>Progress</span><strong>Story ${pending.index + 1}/${cityStructureTemplate.storyRaceCount}</strong></div>
        </div>`
      : `<div class="city-preview-detail-grid">
          <div><span>Difficulty</span><strong>${tierLabel}</strong></div>
          <div><span>Mode</span><strong>${escapeHtml(mode?.label || "Ladder")}</strong></div>
          <div><span>Gold Bonus</span><strong>${cityProgressFor(city.id).vaultRewards[`ladder-${pending.modeId}`] ? "Claimed" : "Sprox CrankVault"}</strong></div>
        </div>`;
  // TODO: replace placeholder previews with final race copy/art once story content is defined.
  el.storyPreviewIcon.innerHTML = isStory
    ? `<span class="story-node-icon layered type-${storyPlan?.type || "story"}"><img class="node-bg" src="${storyVisual.icon}" alt="" aria-hidden="true"><span class="node-subject node-number">${pending.index + 1}</span></span>`
    : isGauntlet
      ? `<span class="story-node-icon layered type-gauntlet"><img class="node-bg" src="assets/items/icon-medallion-gauntlet.png" alt="" aria-hidden="true"><img class="node-subject gauntlet-medallion" src="${forgeMedallionSrc(gauntletConfig?.gearBornLineId)}" alt="" aria-hidden="true" onerror="this.remove()"></span>`
      : `<span class="story-node-icon layered type-${pending.modeId}"><img class="node-bg" src="${cityLadderNodeVisual(pending.modeId).icon}" alt="" aria-hidden="true"><span class="node-subject node-tier">${tierLabel.slice(0, 1)}</span></span>`;
  el.storyPreviewIcon.className = "story-level-icon story-preview-icon type-placeholder";
  el.storyPreviewIcon.style.background = "transparent";
  el.campaignType.textContent = typeCopy;
  el.campaignTitle.textContent = title;
  el.campaignMeta.textContent = meta;
  el.storyPreviewArt.innerHTML = `
    <div class="story-map-preview city-placeholder-preview city-race-preview" style="--node-color:${color}; ${trackImage ? `background-image:linear-gradient(135deg, rgba(8,12,20,.58), rgba(8,12,20,.78)), url('${trackImage}')` : ""}">
      <span>${isGauntlet ? "3 Stages" : isStory ? storyLabel : mode?.label || "Ladder"}</span>
      ${isGauntlet && gauntletConfig ? `<img class="city-preview-medallion" src="${forgeMedallionSrc(gauntletConfig.gearBornLineId)}" alt="" aria-hidden="true" onerror="this.remove()">` : ""}
      ${isStory && storyOpponentImg ? `<img class="city-preview-car" src="${storyOpponentImg}" alt="${escapeHtml(storyOpponentName)}" loading="lazy" decoding="async" onerror="this.remove()">` : ""}
    </div>
    ${previewDetails}
    ${!isStory && !isGauntlet ? cityLadderDifficultyMarkup(city, pending.modeId, pending.tier) : ""}
  `;
  if (el.storyPreviewLeaderboard) el.storyPreviewLeaderboard.innerHTML = "";
  if (el.campaignRewards) {
    el.campaignRewards.innerHTML = isGauntlet
      ? `<div class="reward-row"><span>Entry Cost</span><strong>${gasCostForRace({ kind: "gauntlet", cityId: gauntletAssignedCityId(pending.cityId) })} Gas</strong></div><div class="reward-row compact"><span>First Clear</span><strong>Medallion CrankVault</strong></div>`
      : `<p>${isStory ? "A real story race. Win to clear this story slot." : tier === "gold" ? "First Gold clear grants a Sprox CrankVault." : "Win to clear this ladder tier."}</p>`;
  }
  if (el.storyLoadout) el.storyLoadout.innerHTML = "";
  el.startCampaign.disabled = false;
  el.startCampaign.textContent = isGauntlet ? `Play Now — costs ${gasCostForRace({ kind: "gauntlet", cityId: gauntletAssignedCityId(pending.cityId) })} gas` : isStory ? "Start Story Race" : "Start Ladder Race";
}

function startCityPlaceholderPreview() {
  if (!pendingCityPlaceholderPreview) return false;
  const pending = pendingCityPlaceholderPreview;
  const city = storyCities.find((item) => item.id === pending.cityId) || storyCities[state.selectedStoryCity] || storyCities[0];
  closeStoryPreview();
  if (pending.type === "story") {
    const index = cityStoryRuntimeLevel(city, pending.index);
    state.selectedCampaign = index;
    saveState();
    const level = campaignLevels[index];
    const launch = () => startCampaignRace(index, level);
    if (level.cityStructureEvent?.scenePre) openStoryPlaceholderScene(level.cityStructureEvent.scenePre, launch);
    else launch();
  }
  if (pending.type === "ladder") {
    const index = cityLadderRuntimeLevel(city, pending.modeId, pending.tier);
    state.selectedCampaign = index;
    saveState();
    startCampaignRace(index, campaignLevels[index]);
  }
  if (pending.type === "gauntlet") startMedallionGauntlet(pending.cityId);
  return true;
}

function cityStructureStoryNodeMarkup(city, progress) {
  // TODO tune positions after final story race content is locked.
  const positions = [
    { x: 10, y: 40 },
    { x: 30, y: 40 },
    { x: 50, y: 40 },
    { x: 70, y: 40 },
    { x: 90, y: 40 }
  ];
  return progress.storyRaces.map((complete, index) => {
    const unlocked = allStoryUnlocked() || index === 0 || progress.storyRaces[index - 1];
    const position = positions[index] || { x: Math.min(86, 16 + index * 13), y: 26 };
    const plan = cityStoryRacePlanFor(city.id, index);
    const visual = cityStoryRaceVisual(plan);
    const label = cityStoryRaceLabel(plan, index);
    return `
      <button class="story-map-node city-story-node ${unlocked ? "" : "locked"} ${complete ? "completed" : ""}" type="button" data-city-story-race="${city.id}:${index}" style="left:${position.x}%; top:${position.y}%; --node-color:${visual.color}" ${unlocked ? "" : "disabled"}>
        <span class="story-node-icon layered type-${plan?.type || "story"}">
          <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" onerror="this.remove()">
          <span class="node-subject node-number">${index + 1}</span>
        </span>
        <span class="story-node-label">${label}</span>
      </button>
    `;
  }).join("");
}

function cityStoryRaceLabel(plan, index) {
  if (!plan) return `Story ${index + 1}`;
  if (plan.type === "drag") return "Drag";
  if (plan.type === "trial") return "Time Trial";
  if (plan.type === "circuit") return "4-Car Circuit";
  if (plan.type === "rival") return "Rival Race";
  if (plan.type === "battle") return "Battle";
  return `Story ${index + 1}`;
}

function cityStoryRaceVisual(plan) {
  if (!plan) return { ...storyLevelVisuals.circuit, color: "#52c7ff" };
  return storyLevelVisuals[plan.type] || storyLevelVisuals.circuit;
}

function cityStructureLadderNodeMarkup(city, progress) {
  // TODO tune positions after final optional-race layout art is locked.
  const positions = {
    drag: { x: 16, y: 76 },
    trial: { x: 38, y: 76 },
    exhibition: { x: 62, y: 76 },
    battle: { x: 84, y: 76 }
  };
  return cityStructureTemplate.ladders.map((mode) => {
      const tier = nextCityLadderTier(progress, mode.id);
      const unlocked = placeholderLadderTierUnlocked(progress, mode.id, tier);
      const complete = cityStructureTemplate.ladderTiers.every((item) => progress.ladders[mode.id]?.[item]);
      const position = positions[mode.id] || { x: 50, y: 76 };
      const count = mode.id === "exhibition" ? (tier === "bronze" ? "4 cars" : "6 cars") : "";
      const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
      const label = complete ? `${mode.label.replace(" Race", "")} Complete` : `${mode.label.replace(" Race", "")} ${tierLabel}${count ? ` · ${count}` : ""}`;
      const visual = cityLadderNodeVisual(mode.id);
      return `
        <button class="story-map-node city-ladder-node ${unlocked ? "" : "locked"} ${complete ? "completed" : ""}" type="button" data-city-ladder="${city.id}:${mode.id}:${tier}" style="left:${position.x}%; top:${position.y}%; --node-color:${cityLadderNodeColor(tier)}" ${unlocked ? "" : "disabled"}>
          <span class="story-node-icon layered type-${mode.id}">
            <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" onerror="this.remove()">
            <span class="node-subject node-tier">${tierLabel.slice(0, 1)}</span>
          </span>
          <span class="story-node-label">${label}</span>
        </button>
      `;
    }).join("");
}

function nextCityLadderTier(progress, modeId) {
  const ladder = progress.ladders[modeId] || {};
  if (!ladder.bronze) return "bronze";
  if (!ladder.silver) return "silver";
  return "gold";
}

function cityLadderDifficultyMarkup(city, modeId, selectedTier) {
  const progress = cityProgressFor(city.id);
  return `
    <div class="city-ladder-difficulty" aria-label="Ladder difficulty">
      ${cityStructureTemplate.ladderTiers.map((tier) => {
        const unlocked = placeholderLadderTierUnlocked(progress, modeId, tier);
        const complete = Boolean(progress.ladders[modeId]?.[tier]);
        const label = tier.charAt(0).toUpperCase() + tier.slice(1);
        return `<button class="ghost ${tier === selectedTier ? "active" : ""}" type="button" data-city-ladder-difficulty="${tier}" ${unlocked ? "" : "disabled"}>${label}${complete ? " ✓" : ""}</button>`;
      }).join("")}
    </div>
  `;
}

function cityLadderNodeVisual(modeId) {
  if (modeId === "trial") return storyLevelVisuals.trial;
  if (modeId === "battle") return storyLevelVisuals.battle;
  if (modeId === "exhibition") return storyLevelVisuals.circuit;
  return storyLevelVisuals.drag;
}

function cityLadderNodeColor(tier) {
  if (tier === "gold") return "#ffc857";
  if (tier === "silver") return "#cbd5e1";
  return "#c47a39";
}

function completePlaceholderLadder(cityId, modeId, tier) {
  const city = storyCities.find((item) => item.id === cityId);
  const progress = city ? cityProgressFor(cityId) : null;
  if (!city || !placeholderLadderTierUnlocked(progress, modeId, tier)) return;
  const index = cityLadderRuntimeLevel(city, modeId, tier);
  state.selectedCampaign = index;
  saveState();
  startCampaignRace(index, campaignLevels[index]);
}

function completePlaceholderStoryRace(cityId, index) {
  const city = storyCities.find((item) => item.id === cityId);
  const progress = city ? cityProgressFor(cityId) : null;
  if (!city || (!allStoryUnlocked() && index > 0 && !progress.storyRaces[index - 1])) return;
  const runtimeIndex = cityStoryRuntimeLevel(city, index);
  state.selectedCampaign = runtimeIndex;
  saveState();
  startCampaignRace(runtimeIndex, campaignLevels[runtimeIndex]);
}

function tutorialMapLevels() {
  const sceneId = currentTutorialScene()?.id;
  if (sceneId !== "map-final") return tutorialCityLevels;
  return tutorialCityLevels.concat([
    { type: "boss", title: "Training Boss Example", tutorialLevel: "boss-example", bossIndex: 0 },
    { type: "pink-slip", title: "Tutorque Pink Slip Example", tutorialLevel: "pink-slip-example", medallion: "assets/medallions/medallion-tutorque.png", drag: { name: "Tutorque" } }
  ]);
}

function cityEpisodeLabel(city) {
  const episodeIndex = storyCities.findIndex((item) => item.id === city?.id);
  const episodeNumber = episodeIndex >= 0 ? episodeIndex + 1 : 1;
  return `EPISODE ${episodeNumber} - ${(city?.city || "City").toUpperCase()}`;
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
    el.cityUnlockTitle.innerHTML = banner ? cityEpisodeLabel(city) : `<strong>Welcome to ${city.city}</strong>`;
    el.cityUnlockTitle.hidden = false;
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
  return gauntletsForCity(city).map(([gauntletKey, config], index) => {
    if (!allStoryUnlocked() && cityReputationPercent(city) < config.unlockReputationPercent) return "";
    const progress = gauntletProgress(gauntletKey);
    if (!progress.revealed && !allStoryUnlocked()) saveGauntletProgress(gauntletKey, { revealed: true });
    return gauntletNodeMarkup(gauntletKey, city, 22 + index * 28, 60);
  }).join("");
}

function gauntletNodeMarkup(gauntletKey, city, x, y) {
  const config = gauntletConfigByKey(gauntletKey);
  if (!config?.enabled) return "";
  const progress = gauntletProgress(gauntletKey);
  if (!progress.revealed && !allStoryUnlocked()) return "";
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
        <button class="primary-button" type="button" data-gauntlet-continue>Play Now</button>
        <button class="secondary-button" type="button" data-gauntlet-skip>Play Later</button>
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
  const assignedCityId = gauntletAssignedCityId(cityId);
  const gasCost = gasCostForRace({ kind: "gauntlet", cityId: assignedCityId });
  modal.dataset.cityId = cityId;
  modal.querySelector("h2").textContent = config?.popupTitle || `${config?.displayName || form?.name || "A GearBorn"} has been watching…`;
  modal.querySelector("p").textContent = `Medallion Gauntlet unlocked. Play Now costs ${gasCost} gas.`;
  const img = modal.querySelector(".gauntlet-medallion-preview");
  img.src = forgeMedallionSrc(config.gearBornLineId);
  img.alt = `${form?.name || config.displayName} Medallion`;
  modal.querySelector("[data-gauntlet-skip]").textContent = "Play Later";
  modal.querySelector("[data-gauntlet-continue]").textContent = `Play Now — costs ${gasCost} gas`;
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
  const progress = gauntletProgress(cityId);
  if (progress.completed) return;
  const assignedCityId = gauntletAssignedCityId(cityId);
  const launch = () => startMedallionGauntletStage(cityId);
  if ((progress.currentStage || 1) === 1 && gasPaidGauntletKey !== cityId) {
    requestRaceEntry({ kind: "gauntlet", cityId: assignedCityId }, () => {
      gasPaidGauntletKey = cityId;
      launch();
    });
    return;
  }
  launch();
}

function startMedallionGauntletStage(cityId) {
  const config = gauntletConfigByKey(cityId);
  const progress = gauntletProgress(cityId);
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
    if (pendingDragRace) pendingDragRace.gasPrepaid = true;
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
    gasPaidGauntletKey = null;
    state.activeGauntlet = null;
    saveState();
    return true;
  }
  const nextStage = Math.min(3, (active.stage || 1) + 1);
  if ((active.stage || 1) >= 3) {
    addAssignedMedallionCrankVault(config.gearBornLineId, `${gauntletAssignedCityId(cityId)} Medallion Gauntlet`);
    saveGauntletProgress(cityId, { revealed: true, popupShown: true, currentStage: 3, completed: true, rewardClaimed: true });
    gasPaidGauntletKey = null;
    state.activeGauntlet = null;
    showToast("Medallion Gauntlet Complete", `${config.displayName} Medallion CrankVault earned.`);
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
  const rows = tunerRankBaseList.filter((entry) => entry.id !== "roberto-yucca" && entry.name !== "Roberto Yucca").map((entry) => ({
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
  recordTunerStat("bossesDefeated");
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
    ? "assets/items/item-badge-spindell.png"
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
  state.convoy.inProgress = state.convoy.inProgress || { convoyId, currentStage: 0, stageProgress: {}, stageSelections: [null, null, null] };
  state.convoy.inProgress.convoyId = convoyId;
  if (!Array.isArray(state.convoy.inProgress.stageSelections)) {
    state.convoy.inProgress.stageSelections = [null, null, null];
  }
  while (state.convoy.inProgress.stageSelections.length < 3) state.convoy.inProgress.stageSelections.push(null);
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
  recordDailyGoalProgress("storyConvoy");
  state.convoy.inProgress = null;
  const reward = firstClear ? convoy.rewards?.firstWin || {} : convoy.rewards?.replayWin || {};
  if (reward.sprox) addSprox(reward.sprox);
  const earnedVault = firstClear && addAssignedMedallionCrankVault(convoy.medallionId, `${convoy.cityId} Convoy`);
  const postScene = convoyStoryScriptFor(convoyId, "post")[0]?.text;
  const medallionCopy = earnedVault ? " Medallion CrankVault earned." : "";
  showToast(firstClear ? "Convoy Complete" : "Convoy Replay Complete", postScene || `${convoy.name} complete.${medallionCopy}`);
  saveState();
  renderCampaign();
  return true;
}

function convoyStageOpponentEvolution(stage) {
  const car = cars.find((item) => item.id === stage?.opponentCarId);
  if (!car) return null;
  if (Number.isInteger(stage.opponentEvolutionIndex)) {
    return car.evolutions[Math.max(0, Math.min(car.evolutions.length - 1, stage.opponentEvolutionIndex))] || car.evolutions[0];
  }
  return currentEvolution(car.id);
}

function renderConvoy() {
  if (!el.convoyTitle || !el.convoyStageList) return;
  const convoyId = state.convoy?.inProgress?.convoyId || Object.keys(convoyDefinitions).find((id) => state.convoy?.available?.[id]) || "tyree";
  const convoy = convoyDefinitions[convoyId] || convoyDefinitions.tyree;
  el.convoyTitle.textContent = "Convoy";
  const sponsorNameEl = document.getElementById("convoy-sponsor-name");
  if (sponsorNameEl) sponsorNameEl.textContent = convoy.sponsor || "";
  const sponsorHeadshotEl = document.getElementById("convoy-sponsor-headshot");
  if (sponsorHeadshotEl) {
    sponsorHeadshotEl.src = convoy.headshot || "";
    sponsorHeadshotEl.alt = convoy.sponsor || "";
  }
  const progress = state.convoy?.inProgress?.stageProgress || {};
  const stageSelections = state.convoy?.inProgress?.stageSelections || [null, null, null];
  el.convoyStageList.innerHTML = convoy.stages.map((stage, index) => {
    const opponentCar = cars.find((car) => car.id === stage.opponentCarId);
    const opponentEvolution = opponentCar ? convoyStageOpponentEvolution(stage) : null;
    const opponentName = opponentEvolution?.name || stage.opponentName || "Opponent";
    const opponentImg = opponentEvolution ? imageFor(opponentEvolution, "display") : "";
    const opponentStats = stage.opponentCarId ? (displayedGearbornStats(stage.opponentCarId) || baseGearbornStatsAtLevel(stage.opponentCarId, 1) || {}) : {};
    const playerCarId = stageSelections[index];
    const playerCar = playerCarId ? cars.find((car) => car.id === playerCarId) : null;
    const playerEvolution = playerCar ? currentEvolution(playerCarId) : null;
    const playerName = playerEvolution?.name || "";
    const playerImg = playerEvolution ? imageFor(playerEvolution, "display") : "";
    const playerStats = playerCarId ? (displayedGearbornStats(playerCarId) || {}) : {};
    const prevStageStatus = index === 0 ? "won" : progress[index - 1];
    const isLocked = index > 0 && prevStageStatus !== "won";
    const stageStatus = progress[index] || "";
    const canStart = Boolean(playerCarId) && !isLocked;
    const startLabel = stageStatus === "lost" ? "Retry Stage" : "Start Stage";
    const modeIconHtml = convoyStageModeIconHtml(stage.type, convoy);
    return `
      <article class="convoy-stage-card-v2 ${stageStatus} ${isLocked ? "locked" : ""}">
        <header class="convoy-stage-card-header">
          <h2 class="convoy-stage-card-title">Stage ${index + 1}</h2>
          <div class="convoy-stage-mode">${modeIconHtml}</div>
        </header>
        <div class="convoy-stage-matchup">
          <div class="convoy-stage-side convoy-stage-side-opponent">
            <span class="convoy-stage-side-kicker">Opponent</span>
            <div class="convoy-stage-car-display">
              ${opponentImg ? `<img src="${opponentImg}" alt="${escapeHtml(opponentName)}">` : `<span class="convoy-stage-car-placeholder">?</span>`}
            </div>
            <strong class="convoy-stage-car-name">${escapeHtml(opponentName)}</strong>
            <div class="convoy-stage-stats">${renderConvoyStatBars(opponentStats)}</div>
          </div>
          <span class="convoy-stage-vs" aria-hidden="true">VS</span>
          <div class="convoy-stage-side convoy-stage-side-player">
            <span class="convoy-stage-side-kicker">Your Pick</span>
            <button class="convoy-stage-car-display convoy-stage-car-picker-button ${playerCarId ? "filled" : "empty"}" type="button" data-convoy-pick-stage="${index}" ${isLocked ? "disabled" : ""}>
              ${playerImg
                ? `<img src="${playerImg}" alt="${escapeHtml(playerName)}">`
                : `<div class="convoy-stage-car-picker-plus">
                    <span class="convoy-stage-car-picker-plus-icon">+</span>
                    <span class="convoy-stage-car-picker-plus-label">Choose Car</span>
                  </div>`}
            </button>
            <strong class="convoy-stage-car-name">${playerName ? escapeHtml(playerName) : "—"}</strong>
            <div class="convoy-stage-stats">${playerCarId ? renderConvoyStatBars(playerStats) : renderConvoyStatBars({})}</div>
          </div>
        </div>
        <button class="convoy-stage-start" type="button" data-convoy-stage="${index}" ${canStart ? "" : "disabled"}>
          ${isLocked ? "Locked" : startLabel}
        </button>
      </article>
    `;
  }).join("");
}

function renderConvoyLoadouts() {
  if (!el.convoyLoadoutSlots) return;
  const inProgressConvoyId = state.convoy?.inProgress?.convoyId || Object.keys(convoyDefinitions).find((id) => state.convoy?.available?.[id]) || null;
  const opponentSummary = inProgressConvoyId
    ? convoyDefinitions[inProgressConvoyId].stages.map((stage, index) => {
      const opp = convoyStageOpponentEvolution(stage);
      return `<span class="convoy-loadout-opp-pill">S${index + 1}: ${escapeHtml(opp?.name || stage.opponentName || "?")}</span>`;
    }).join("")
    : "";
  const helperEl = document.getElementById("convoy-loadouts-helper");
  if (helperEl) {
    helperEl.innerHTML = inProgressConvoyId
      ? `<strong>Next Convoy:</strong> ${escapeHtml(convoyDefinitions[inProgressConvoyId].sponsor || "")} · ${opponentSummary}`
      : "Build squads to deploy in future Convoys.";
  }
  el.convoyLoadoutSlots.innerHTML = state.convoy.loadouts.map((loadout, index) => {
    const carIds = Array.isArray(loadout?.carIds) ? loadout.carIds : [null, null, null];
    const name = loadout?.name || `Loadout ${index + 1}`;
    const isValid = validConvoyLoadout(loadout);
    const slotsHtml = [0, 1, 2].map((slot) => {
      const carId = carIds[slot];
      const evolution = carId ? currentEvolution(carId) : null;
      const carName = evolution?.name || "";
      const carImg = evolution ? imageFor(evolution, "display") : "";
      return `
        <button class="convoy-loadout-slot-pick ${carId ? "filled" : "empty"}" type="button" data-convoy-loadout-slot-pick="${index}:${slot}">
          ${carImg
            ? `<img src="${carImg}" alt="${escapeHtml(carName)}"><span class="convoy-loadout-slot-pick-name">${escapeHtml(carName)}</span>`
            : `<span class="convoy-loadout-slot-pick-plus">+</span><span class="convoy-loadout-slot-pick-label">Slot ${slot + 1}</span>`}
        </button>
      `;
    }).join("");
    return `
      <article class="convoy-loadout-slot-v2">
        <header class="convoy-loadout-slot-header">
          <input type="text" class="convoy-loadout-name-input" value="${escapeHtml(name)}" maxlength="32" data-convoy-loadout-name="${index}" placeholder="Loadout ${index + 1}">
        </header>
        <div class="convoy-loadout-slot-picks">${slotsHtml}</div>
        <div class="convoy-loadout-slot-actions">
          <button class="convoy-loadout-action-load" type="button" data-convoy-loadout-load="${index}" ${isValid ? "" : "disabled"}>Load</button>
        </div>
      </article>
    `;
  }).join("");
}

function convoyStageModeIconHtml(stageType, convoy) {
  if (stageType === "drag") {
    return `<img class="convoy-mode-icon" src="assets/items/icon-drag-race.png" alt="Drag Race" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'convoy-mode-icon-fallback',textContent:'DRAG'}))">`;
  }
  if (stageType === "battle") {
    return `<img class="convoy-mode-icon" src="assets/items/icon-battle.png" alt="Battle" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'convoy-mode-icon-fallback',textContent:'BATTLE'}))">`;
  }
  if (stageType === "h2h") {
    return `<span class="convoy-mode-icon-stack">
      <img class="convoy-mode-icon-base" src="${convoy.icon}" alt="Convoy" onerror="this.hidden=true">
      <img class="convoy-mode-icon-face" src="${convoy.headshot}" alt="${escapeHtml(convoy.sponsor || "")}" onerror="this.hidden=true">
    </span>`;
  }
  return `<span class="convoy-mode-icon-fallback">${escapeHtml(String(stageType).toUpperCase())}</span>`;
}

function renderConvoyStatBars(stats = {}) {
  const tracks = [
    { key: "speed", label: "SPD" },
    { key: "acceleration", label: "ACC" },
    { key: "handling", label: "HDL" },
    { key: "torque", label: "TRQ" },
    { key: "body", label: "BDY" },
    { key: "powertrain", label: "PWR" }
  ];
  return tracks.map((track) => {
    const value = Math.max(0, Math.min(100, Math.round(stats[track.key] || 0)));
    return `
      <div class="convoy-stat-bar-row">
        <span class="convoy-stat-bar-label">${track.label}</span>
        <div class="convoy-stat-bar-track">
          <div class="convoy-stat-bar-fill" style="width:${value}%"></div>
        </div>
        <span class="convoy-stat-bar-value">${value || "—"}</span>
      </div>
    `;
  }).join("");
}

function openConvoyStagePicker(stageIndex) {
  const inProgress = state.convoy?.inProgress;
  if (!inProgress) return;
  const usedElsewhere = (inProgress.stageSelections || [])
    .map((id, index) => index === stageIndex ? null : id)
    .filter(Boolean);
  openCarPicker({
    title: `Choose your GearBorn for Stage ${stageIndex + 1}`,
    selectedCarId: inProgress.stageSelections?.[stageIndex] || "",
    filter: (carId) => !usedElsewhere.includes(carId),
    onConfirm: (carId) => {
      const selections = Array.isArray(inProgress.stageSelections) ? inProgress.stageSelections.slice(0, 3) : [null, null, null];
      while (selections.length < 3) selections.push(null);
      selections[stageIndex] = carId;
      inProgress.stageSelections = selections;
      saveState();
      renderConvoy();
    }
  });
}

function loadConvoyLoadoutIntoStages(loadoutIndex) {
  const loadout = state.convoy?.loadouts?.[loadoutIndex];
  if (!validConvoyLoadout(loadout)) {
    showToast("Loadout", "This loadout is incomplete.");
    return;
  }
  const inProgress = state.convoy?.inProgress;
  if (!inProgress) return;
  inProgress.stageSelections = loadout.carIds.slice(0, 3);
  saveState();
  renderConvoy();
  showToast("Loadout Loaded", `${loadout.name || `Loadout ${loadoutIndex + 1}`} loaded into convoy slots.`);
}

function openConvoyLoadoutSlotPicker(loadoutIndex, slot) {
  const loadout = state.convoy.loadouts[loadoutIndex] || { name: `Loadout ${loadoutIndex + 1}`, carIds: [null, null, null] };
  const carIds = Array.isArray(loadout.carIds) ? loadout.carIds.slice(0, 3) : [null, null, null];
  while (carIds.length < 3) carIds.push(null);
  const usedElsewhere = carIds.filter((id, index) => index !== slot && id);
  openCarPicker({
    title: `Choose GearBorn for Slot ${slot + 1}`,
    selectedCarId: carIds[slot] || "",
    filter: (carId) => !usedElsewhere.includes(carId),
    onConfirm: (carId) => {
      carIds[slot] = carId;
      state.convoy.loadouts[loadoutIndex] = {
        name: loadout.name || `Loadout ${loadoutIndex + 1}`,
        carIds
      };
      saveState();
      renderConvoyLoadouts();
    }
  });
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
  if (panelOpen && pendingCityPlaceholderPreview) {
    renderCityPlaceholderPreview();
    return;
  }
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
  pendingCityPlaceholderPreview = null;
  state.selectedCampaign = campaignIndex;
  el.storyPreviewPanel.classList.add("active");
  el.storyPreviewPanel.setAttribute("aria-hidden", "false");
  closeCitySelect();
  saveState();
  renderCampaign();
}

function closeStoryPreview() {
  if (!el.storyPreviewPanel) return;
  pendingCityPlaceholderPreview = null;
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
    Inflewenze: "assets/cars/influencer-peacock-inflewenze-race.png",
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
    Inflewenze: "assets/cars/influencer-peacock-inflewenze-display.png",
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
  recordTunerStat(won ? "battlesWon" : "battlesLost");
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
        const finishBattleStory = () => {
          if (won && level?.cityStructureEvent?.type === "story") {
            finishRuntimeStoryWithPost(level, finishStoryRaceScreen);
            return;
          }
          if (won && level?.type === "rival") {
            openRivalDialogue(level, "post", finishStoryRaceScreen);
            return;
          }
          finishStoryRaceScreen();
        };
        if (rankChange) {
          showTunerRankRisePopup(rankChange, finishBattleStory);
          return;
        }
        finishBattleStory();
      } else {
        battleState = null;
        setFlowStep("battle", "match");
      }
    },
    onRaceAgain: () => {
      const restartOptions = battleState.restartOptions || { boss: battleState.boss, campaignLevelIndex: battleState.campaignLevelIndex };
      if (battleState.campaignLevelIndex !== null) {
        startCampaignRace(battleState.campaignLevelIndex, campaignLevels[battleState.campaignLevelIndex]);
        return;
      }
      if (battleState.mode === "gauntlet-battle") {
        beginBattle(battleState.mode, restartOptions);
        return;
      }
      requestRaceEntry({ kind: "battle" }, () => beginBattle(battleState.mode, restartOptions));
    }
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
  const playable = playableEntryMeta(entry);
  if (isFusionLine(playable?.car?.id)) return "A";
  return vindexClassByNumber[entry?.number] || "";
}

function getVindexType(entry) {
  const playable = playableEntryMeta(entry);
  if (playable) return gearbornStatProfiles[playable.car.id]?.type || "";
  return oneOffTypeMeta[entry?.name]?.type || "";
}

function getVindexTypes(entry) {
  const playable = playableEntryMeta(entry);
  if (playable && isFusionLine(playable.car.id)) {
    const profile = gearbornStatProfiles[playable.car.id] || {};
    return [profile.type, profile.type2].filter(Boolean);
  }
  const type = getVindexType(entry);
  return type ? [type] : [];
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
  const fusionEntries = vindexEntries.filter((entry) => isFusionLine(playableEntryMeta(entry)?.car?.id));
  const fusionsTotal = fusionEntries.length;
  const fusionsOwned = fusionEntries.filter((entry) => getStatus(entry) === "owned").length;
  return { total, owned, seen, locked: Math.max(0, total - seen), fusionsOwned, fusionsTotal };
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
  const typeLabels = getVindexTypes(entry);
  return `
    <div class="garage-class-type-badges" aria-label="Class and type">
      <span class="garage-class-badge">
        ${classLetter ? `<img src="${getClassStamp(classLetter)}" alt="Class ${classLetter}" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('strong'),{textContent:'${classLetter}'}))">` : `<strong>-</strong>`}
      </span>
      ${typeLabels.length ? typeLabels.map((typeLabel) => {
        const typeTile = getTypeTile(typeLabel);
        return `<span class="garage-type-badge">
          ${typeTile ? `<img src="${typeTile}" alt="${typeLabel} type" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('strong'),{textContent:'${typeLabel}'}))">` : `<strong>${escapeHtml(typeLabel)}</strong>`}
        </span>`;
      }).join("") : `<span class="garage-type-badge"><strong>Type TBD</strong></span>`}
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
      <p><span>Fusions</span><strong>${counts.fusionsOwned} / ${counts.fusionsTotal}</strong></p>
    `;
  }
  const entry = vindexEntries.find((item) => item.number === state.selectedVindex) || vindexEntries[0];
  const status = getStatus(entry);
  const discovered = status !== "locked";
  const classLetter = getVindexClass(entry);
  const typeLabels = getVindexTypes(entry);
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
    el.vindexTypeStamp.hidden = !discovered || !typeLabels.length;
    el.vindexTypeStamp.innerHTML = discovered ? typeLabels.map((typeLabel) => {
      const typeStamp = getTypeTile(typeLabel);
      return typeStamp ? `<img src="${typeStamp}" alt="${typeLabel} type" loading="lazy" decoding="async" onerror="this.hidden=true">` : "";
    }).join("") : "";
  }
  if (el.vindexPlate) el.vindexPlate.innerHTML = vindexPlateMarkup(entry, discovered);
  if (el.vindexMedallionTracks) {
    const playable = playableEntryMeta(entry);
    el.vindexMedallionTracks.innerHTML = discovered && playable ? medallionMasteryMarkup(playable.car.id, { compact: true }) : "";
  }
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

function profileSignatureLineMarkup(profile) {
  const lineId = profile?.signatureLineId;
  const line = lineId ? cars.find((car) => car.id === lineId) : null;
  if (!line) {
    return profile?.carImage ? `<img src="${profile.carImage}" alt="${escapeHtml(profile.car || profile.name)}" loading="lazy" decoding="async">` : "";
  }
  return `
    <div class="profile-evolution-line" aria-label="${escapeHtml(line.family)} evolution line">
      ${line.evolutions.map((form, index) => `
        ${index ? `<span class="profile-evolution-arrow" aria-hidden="true">→</span>` : ""}
        <span class="profile-evolution-form">
          <img src="${imageFor(form, "display")}" alt="${escapeHtml(form.name)}" loading="lazy" decoding="async">
        </span>
      `).join("")}
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
  el.profileCarArt.innerHTML = boss && profileCarImage
    ? `<img src="${profileCarImage}" alt="${profile.car}" loading="lazy" decoding="async">`
    : profileSignatureLineMarkup(profile);
  el.profileBio.textContent = profile.bio;
}

function achievementRewardArt(achievement) {
  if (achievementIsSecretHidden(achievement)) return `<div class="achievement-trophy secret">?</div>`;
  if (achievement.id === "garbageMedallion") return carMarkupForEvolution("waste-management", 0, "display");
  if (achievement.id === "narwraithMedallion") return carMarkupForEvolution("narwhal-luxury", 0, "display");
  if (achievement.id === "tutorialTutorqueMedallion") return carMarkupForEvolution("training-car", 0, "display");
  const artFormIndex = artVanUnlockByAchievement[achievement.id];
  if (Number.isInteger(artFormIndex)) {
    const form = cars.find((car) => car.id === "art-van")?.evolutions[artFormIndex];
    return form ? carMarkupForEvolution("art-van", artFormIndex, "display") : silhouetteMarkup();
  }
  if (achievement.id === "vindex50") return `<div class="achievement-trophy">◇</div>`;
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
        <span class="achievement-card-reward" aria-hidden="true">${achievementRewardArt(achievement)}</span>
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
          ${medallionMasteryMarkup(car.id)}
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
  const garageCars = orderedCarList(cars.filter((car) => isPlayerCollectionCar(car) && (isCarUnlocked(car.id) || ["rainbowlt", "narwhal-luxury"].includes(car.id))));
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

function medallionMasteryMarkup(lineId, { compact = false } = {}) {
  const costs = medallionRankCostList(lineId);
  const tier = medallionTier(lineId);
  const tierLabel = medallionTierLabel(tier);
  const rank = medallionRankFor(lineId);
  const cost = nextRankCost(lineId);
  const spendable = spendableMedallionsForRank(lineId);
  const progressText = cost === null ? "Rank complete" : `${Math.min(spendable, cost)} / ${cost} medallions toward Rank ${rank + 1}`;
  const rankUi = costs ? `
    <div class="medallion-rank-row">
      <span>Rank ${rank} / 5</span>
      <strong>${progressText}</strong>
      <button class="ghost medallion-rank-up" type="button" data-rank-up-line="${lineId}" ${canRankUp(lineId) ? "" : "disabled"}>Rank Up</button>
    </div>
  ` : "";
  if (!tierLabel && !rankUi) return "";
  return `
    <div class="medallion-mastery-panel ${compact ? "compact" : ""}" aria-label="Medallion mastery">
      <div class="medallion-mastery-title">Medallion Mastery</div>
      ${tierLabel ? `<span class="medallion-tier-badge ${tier}">${tierLabel}</span>` : ""}
      ${rankUi}
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
  const rankBoosts = medallionRankBoost(carId);
  const partBoosts = partBoostsForCar(carId);
  const formBoosts = formBoostsForCar(carId);
  const basePct = normalizedGearbornStat(Math.min(100, baseStats[statKey])) * 100;
  const bondPct = Math.min(Math.max(0, (bondBoosts[statKey] || 0) / 40 * 100), Math.max(0, 100 - basePct));
  const rankPct = Math.min(Math.max(0, (rankBoosts[statKey] || 0) / 40 * 100), Math.max(0, 100 - basePct - bondPct));
  const partPct = Math.min(Math.max(0, (partBoosts[statKey] || 0) / 40 * 100), Math.max(0, 100 - basePct - bondPct - rankPct));
  const formPct = Math.min(Math.max(0, (formBoosts[statKey] || 0) / 40 * 100), Math.max(0, 100 - basePct - bondPct - rankPct - partPct));
  return { basePct, bondPct, rankPct, partPct, formPct };
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
  const rankPct = segments ? Math.min(segments.rankPct || 0, Math.max(0, pct - basePct - bondPct)) : 0;
  const partPct = segments ? Math.min(segments.partPct, Math.max(0, pct - basePct - bondPct - rankPct)) : 0;
  const formPct = segments ? Math.min(segments.formPct || 0, Math.max(0, pct - basePct - bondPct - rankPct - partPct)) : 0;
  return `
    <div class="stat-base" style="width:${basePct}%"></div>
    ${bondPct > 0 ? `<i class="stat-bond" style="left:${basePct}%; width:${bondPct}%"></i>` : ""}
    ${rankPct > 0 ? `<i class="stat-rank" style="left:${basePct + bondPct}%; width:${rankPct}%"></i>` : ""}
    ${partPct > 0 ? `<i class="stat-parts" style="left:${basePct + bondPct + rankPct}%; width:${partPct}%"></i>` : ""}
    ${formPct > 0 ? `<i class="stat-form" style="left:${basePct + bondPct + rankPct + partPct}%; width:${formPct}%"></i>` : ""}
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
  if (el.screenEffects) el.screenEffects.checked = state.settings.screenEffects !== false;
  if (el.haptics) el.haptics.checked = state.settings.haptics !== false;
  if (el.highVisCues) el.highVisCues.checked = state.settings.highVisCues !== false;
  if (el.reducedMotion) el.reducedMotion.value = state.settings.reducedMotion === true ? "on" : state.settings.reducedMotion === false ? "off" : "system";
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
  el.dragLaunchLights?.classList.remove("staging");
  race = null;
  updateNitroHud();
  paintCars();
  updateGearshiftIndicator(false);
}

function startPendingDragRace() {
  const config = pendingDragRace || { campaignLevelIndex: null, dragStage: null };
  const launch = () => {
    el.dragMapStart.classList.remove("active");
    startDragRace(config.campaignLevelIndex, config.dragStage);
    pendingDragRace = null;
  };
  if (config.gasPrepaid) {
    launch();
    return;
  }
  requestRaceEntry({ kind: "drag", isTutorial: Boolean(config.dragStage?.tutorial) }, launch);
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
  el.dragLaunchLights?.classList.toggle("staging", ["red", "yellow", "green"].includes(phase));
  el.dragLaunchLights?.classList.toggle("high-vis-cues", state.settings.highVisCues !== false);
  if (el.launchPhaseLabel) {
    el.launchPhaseLabel.textContent = phase === "green" ? "GO" : phase === "yellow" ? "SET" : "STAGE";
  }
  el.dragLaunchLights?.querySelectorAll(".launch-tree-row").forEach((row) => {
    row.classList.toggle("active", row.dataset.launchStep === String(step));
  });
  el.dragLaunchLights?.querySelectorAll(".launch-light").forEach((light) => light.classList.remove("active"));
  el.dragCountdown.classList.remove("active");
  el.dragCountdown.textContent = "";
  if (phase === "green") {
    playAudioCue("raceStart");
    playSound("race-countdown-go");
    flashHighVisCue(el.dragLaunchLights);
    haptic([20, 20, 35]);
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
    race.perfectStreak = 0;
  } else {
    race.launchBonus = 1;
  }
  race.launchBonusUntil = now + 2000;
  race.launchPhase = "launched";
  race.launchGrade = message;
  el.dragLaunchLights?.classList.remove("staging");
  haptic(message === "Perfect Launch" ? [20, 18, 30] : 24);
  screenShake(DRAG_SHAKE_LAUNCH.intensity, DRAG_SHAKE_LAUNCH.ms);
  showRaceStartReveal(message === "Jumped Start" ? "JUMPED" : "GO");
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
  if (el.tachFill?.parentElement) {
    const ideal = race?.idealShiftRpm ?? 0.73;
    const window = race?.shiftWindow ?? 0.12;
    const perfectHalf = window * 0.38;
    const tach = el.tachFill.parentElement;
    tach.style.setProperty("--shift-good-left", `${Math.max(0, (ideal - window) * 100)}%`);
    tach.style.setProperty("--shift-good-width", `${Math.min(100, window * 2 * 100)}%`);
    tach.style.setProperty("--shift-good-right", `${Math.min(100, (ideal + window) * 100)}%`);
    tach.style.setProperty("--shift-perfect-left", `${Math.max(0, (ideal - perfectHalf) * 100)}%`);
    tach.style.setProperty("--shift-perfect-width", `${Math.min(100, perfectHalf * 2 * 100)}%`);
    tach.classList.toggle("high-vis-cues", state.settings.highVisCues !== false);
  }
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
    idealShiftRpm: car.idealShiftRpm,
    nitroCharge: 0,
    nitroActive: false,
    nitroTimer: 0,
    nitroMultiplier: dragNitroMultiplier,
    nitroUsed: false,
    nitroContext: [],
    overheatCount: 0,
    overheatLatched: false,
    shiftScore: [],
    perfectStreak: 0,
    longestPerfectStreak: 0,
    lastShiftLabel: "",
    lastShiftAt: 0,
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
  if (race.hitStopUntil && now < race.hitStopUntil) {
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
      race.playerSpeed += race.playerAcceleration * race.playerPower * race.topGearBoost * race.accelPenalty * perfectHeatMultiplier() * launchBoost * draftBoost * topGearPull * dt;
      race.rpm = 0.74;
    } else {
      const gearDrag = 1 - (race.gear - 1) * 0.08;
      const rpmPower = 0.52 + race.rpm * 0.72;
      if (race.rpm > 0.86) {
        race.accelPenalty = Math.max(0.42, race.accelPenalty - 0.34 * dt);
      }
      race.playerSpeed += race.playerAcceleration * race.playerPower * race.accelPenalty * perfectHeatMultiplier() * launchBoost * draftBoost * gearDrag * rpmPower * dt;
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

  const playerNitroScale = race.nitroActive ? (race.nitroMultiplier || dragNitroMultiplier) : 1;
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
      race.perfectStreak = 0;
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
  const ideal = race.idealShiftRpm ?? 0.73;
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
  race.lastShiftLabel = label;
  race.lastShiftAt = performance.now();
  if (label === "Perfect") {
    race.perfectStreak += 1;
    race.longestPerfectStreak = Math.max(race.longestPerfectStreak, race.perfectStreak);
    haptic([18, 16, 18]);
    flashHighVisCue(el.tachFill?.parentElement);
  } else {
    race.perfectStreak = 0;
    if (label === "Good") haptic(18);
  }
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

function perfectHeatMultiplier() {
  const streak = race?.perfectStreak || 0;
  return 1 + Math.min(DRAG_PERFECT_HEAT_CAP, streak * DRAG_PERFECT_HEAT_STEP);
}

function nitroContextForRace() {
  if (!race) return [];
  const contexts = [];
  if (race.lastShiftLabel === "Perfect" && performance.now() - race.lastShiftAt <= DRAG_NITRO_PERFECT_WINDOW_MS) contexts.push("Perfect");
  if (race.draftBonus > 1.01) contexts.push("Draft");
  if (race.gear >= 6 || race.topGearBoost > 1.01) contexts.push("Top Gear");
  return contexts;
}

function nitroMultiplierForRace() {
  const contexts = nitroContextForRace();
  let bonus = 0;
  if (contexts.includes("Perfect")) bonus += DRAG_NITRO_PERFECT_BONUS;
  if (contexts.includes("Draft")) bonus += DRAG_NITRO_DRAFT_BONUS;
  if (contexts.includes("Top Gear")) bonus += DRAG_NITRO_TOP_GEAR_BONUS;
  return { contexts, multiplier: dragNitroMultiplier * (1 + bonus) };
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
  race.nitroUsed = true;
  const nitro = nitroMultiplierForRace();
  race.nitroContext = nitro.contexts;
  race.nitroMultiplier = nitro.multiplier;
  race.playerSpeed = Math.min(race.playerSpeed * nitro.multiplier, race.playerMaxSpeed * nitro.multiplier);
  el.shiftReadout.textContent = nitro.contexts.length ? `Nitro · ${nitro.contexts.join(" + ")}` : "Nitro";
  haptic([35, 18, 35]);
  screenShake(DRAG_SHAKE_NITRO.intensity, DRAG_SHAKE_NITRO.ms);
  playSound("engine-nitro");
  updateNitroHud();
}

function renderSproxWallet() {
  if (el.sproxTotal) el.sproxTotal.textContent = formatSprox();
  if (el.spinTotal) el.spinTotal.textContent = formatSpins();
  renderGasBar();
  renderCrankVaultBadge();
}

let crankVaultResetInterval = null;

function renderGasBar() {
  accrueGas();
  if (!el.gasTotal) return;
  const cheat = devCheatActive("unlimitedGas");
  const gas = cheat ? GAS_MAX : Math.max(0, Math.floor(state.gas));
  el.gasTotal.textContent = cheat ? "∞" : `${gas}/${GAS_MAX}`;
  if (el.gasFill) el.gasFill.style.width = `${Math.min(100, (gas / GAS_MAX) * 100)}%`;
  if (el.gasTank) el.gasTank.classList.toggle("gas-overfilled", !cheat && state.gas > GAS_MAX);
  if (el.gasTank) el.gasTank.classList.toggle("gas-empty", !cheat && state.gas <= 0);
  if (el.gasNext) {
    const showCountdown = !cheat && state.gas < GAS_MAX;
    el.gasNext.hidden = !showCountdown;
    if (showCountdown) el.gasNext.textContent = `Next +1 in ${formatClock(msUntilNextGallon())}`;
  }
}

function startGasDisplayTimer() {
  if (gasDisplayInterval) return;
  renderGasBar();
  gasDisplayInterval = window.setInterval(renderGasBar, 1000);
}

function formatClock(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatClockLong(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function msUntilNextGallon() {
  accrueGas();
  if (state.gas >= GAS_MAX) return 0;
  const since = Date.now() - (Number(state.gasUpdatedAt) || Date.now());
  return Math.max(0, GAS_REGEN_MS - (since % GAS_REGEN_MS));
}

function msUntilFullTank() {
  accrueGas();
  if (state.gas >= GAS_MAX) return 0;
  const gallonsNeeded = GAS_MAX - state.gas;
  return msUntilNextGallon() + (gallonsNeeded - 1) * GAS_REGEN_MS;
}

function openGasEmptyModal(cost, context, proceed) {
  pendingGasEntry = { cost, context, proceed };
  if (el.gasEmptyCost) el.gasEmptyCost.textContent = String(cost);
  el.gasEmptyModal?.classList.add("active");
  el.gasEmptyModal?.setAttribute("aria-hidden", "false");
  if (!gasCountdownInterval) gasCountdownInterval = window.setInterval(updateGasEmptyCopy, 1000);
  updateGasEmptyCopy();
}

function updateGasEmptyCopy() {
  accrueGas();
  if (el.gasEmptyHave) el.gasEmptyHave.textContent = String(Math.max(0, Math.floor(state.gas)));
  if (el.gasNextGallon) el.gasNextGallon.textContent = formatClock(msUntilNextGallon());
  if (el.gasFullTank) el.gasFullTank.textContent = formatClockLong(msUntilFullTank());
  renderGasBar();
  if (pendingGasEntry && canParticipate(pendingGasEntry.cost)) {
    const entry = pendingGasEntry;
    closeGasEmptyModal();
    spendGas(entry.cost);
    saveState();
    renderGasBar();
    entry.proceed();
  }
}

function closeGasEmptyModal() {
  pendingGasEntry = null;
  if (gasCountdownInterval) {
    window.clearInterval(gasCountdownInterval);
    gasCountdownInterval = null;
  }
  el.gasEmptyModal?.classList.remove("active");
  el.gasEmptyModal?.setAttribute("aria-hidden", "true");
}

function purchaseGas() {
  if (!spendSpins(GAS_PURCHASE_SPINS)) {
    showToast("Not Enough Spins", `You need ${GAS_PURCHASE_SPINS} Spins to buy gas.`);
    return;
  }
  state.gas += GAS_PURCHASE_AMOUNT;
  if (state.gas >= GAS_MAX) state.gasUpdatedAt = Date.now();
  saveState();
  showToast("Gas Purchased", `+${GAS_PURCHASE_AMOUNT} gallons added.`);
  renderSproxWallet();
  updateGasEmptyCopy();
}

function renderCrankVaultBadge() {
  if (!el.crankVaultBadge) return;
  const count = (dailyVaultAvailable() ? 1 : 0) + (dailyGoalsVaultReady() ? 1 : 0);
  el.crankVaultBadge.hidden = count <= 0;
  el.crankVaultBadge.textContent = String(count);
}

function dailyGoalsResetCopy() {
  const remaining = Math.max(0, nextVaultResetTime().getTime() - Date.now());
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

function dailyGoalProgressBar(goal, progress) {
  const value = Math.max(0, Math.min(goal.target, Math.floor(Number(progress) || 0)));
  const pct = goal.target ? Math.min(100, (value / goal.target) * 100) : 0;
  return `
    <div class="daily-goal-progress" aria-label="${value} of ${goal.target}">
      <span style="width:${pct}%"></span>
    </div>
    <small>${value} / ${goal.target}</small>
  `;
}

function dailyGoalRewardCopy(goal) {
  if (goal.reward?.sprox) return `+${goal.reward.sprox} Sprox`;
  if (goal.reward?.spins) return `+${goal.reward.spins} Spins`;
  return "Reward";
}

function renderDailyGoals() {
  if (!el.dailyGoals) return;
  touchDailyGoals();
  const completed = dailyGoalsCompletedCount();
  const streak = Math.max(0, Math.floor(Number(state.dailyGoals.loginStreak) || 0));
  const goalRows = dailyGoalDefs.map((goal) => {
    const progress = Math.max(0, Number(state.dailyGoals.progress?.[goal.id]) || 0);
    const complete = progress >= goal.target;
    const claimed = Boolean(state.dailyGoals.claimed?.[goal.id]);
    const desc = goal.id === "rotating" ? dailyRotatingGoalLabel() : goal.desc;
    return `
      <article class="daily-goal-row ${complete ? "complete" : ""}">
        <div class="daily-goal-copy">
          <strong>${escapeHtml(goal.name)}</strong>
          <span>${escapeHtml(desc)}</span>
        </div>
        <div class="daily-goal-meter">
          ${dailyGoalProgressBar(goal, progress)}
        </div>
        <button class="ghost daily-goal-claim" type="button" data-daily-goal-claim="${goal.id}" ${complete && !claimed ? "" : "disabled"}>
          ${claimed ? "✓" : complete ? dailyGoalRewardCopy(goal) : "Claim"}
        </button>
      </article>
    `;
  }).join("");
  el.dailyGoals.innerHTML = `
    <div class="daily-goals-summary">
      <strong>${completed} / ${dailyGoalDefs.length} complete — ${dailyGoalsRequiredForVault} unlocks the vault</strong>
      <span>Reset in ${dailyGoalsResetCopy()}</span>
      <span>Login streak: ${streak} day${streak === 1 ? "" : "s"} · CrankVault every 7th day</span>
    </div>
    <div class="daily-goals-list">${goalRows}</div>
    <article class="daily-goal-vault">
      <img class="crankvault-img crankvault-img-sm" src="assets/crankvaults/blue-crankvault-closed.png" alt="Common CrankVault"
        onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'crankvault-img-fallback',textContent:'◈'}))">
      <div>
        <strong>Daily Goals Vault</strong>
        <span>Complete any ${dailyGoalsRequiredForVault} goals to claim a Common CrankVault.</span>
      </div>
      <button class="primary" type="button" data-daily-goals-vault-claim ${dailyGoalsVaultReady() ? "" : "disabled"}>
        ${state.dailyGoals.vaultClaimed ? "Claimed" : "Claim Vault"}
      </button>
    </article>
  `;
}

function crankVaultPoolCopy() {
  return "Medallions can be any E/D/C GearBorn in the unlockable pool (excludes specials, achievement, and tutorial lines).";
}

function crankVaultColor(def) {
  return def?.color || "blue";
}

function crankVaultArtSrc(def, open = false) {
  return `assets/crankvaults/${crankVaultColor(def)}-crankvault-${open ? "open" : "closed"}.png`;
}

function crankVaultArtMarkup(def, { open = false, size = "lg" } = {}) {
  return `<img class="crankvault-img crankvault-img-${size}" src="${crankVaultArtSrc(def, open)}" alt="${escapeHtml(def?.name || "CrankVault")}"
    onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'crankvault-img-fallback',textContent:'◈'}))">`;
}

function crankVaultShortDetail(vault) {
  const medallions = vault.rewards.reduce((sum, reward) => sum + (reward.kind === "medallion" ? reward.count || 1 : 0), 0);
  const spins = vault.rewards.reduce((sum, reward) => sum + (reward.kind === "spins" ? reward.amount || 0 : 0), 0);
  return `${medallions} medallion${medallions === 1 ? "" : "s"}${spins ? ` + ${spins} Spins` : ""}`;
}

function renderCrankVaults() {
  if (!el.crankVaultDaily || !el.crankVaultStore || !el.crankVaultInventory) return;
  const free = dailyVaultAvailable();
  el.crankVaultDaily.dataset.dailyAvailable = String(free);
  el.crankVaultDaily.innerHTML = free
    ? `
      ${crankVaultArtMarkup(crankVaultDefs.common, { size: "sm" })}
      <div class="crankvault-daily-copy">
        <strong>Free daily Common CrankVault is ready</strong>
        <span id="crankvault-reset"></span>
      </div>
      <button class="primary" type="button" data-crankvault-claim-daily>Claim</button>
    `
    : `<span id="crankvault-reset"></span>`;
  el.crankVaultStore.innerHTML = [crankVaultDefs.common, crankVaultDefs.premium].map((vault) => {
    return `
      <article class="crankvault-card" data-vault-color="${crankVaultColor(vault)}">
        ${crankVaultArtMarkup(vault)}
        <h2>${vault.name}</h2>
        <p>${crankVaultShortDetail(vault)}</p>
        <button class="primary" type="button" data-crankvault-buy="${vault.id}">${formatSpins(vault.cost)}</button>
      </article>
    `;
  }).join("");
  if (el.crankVaultOddsNote) {
    // TODO: replace the lightweight odds notice with a dedicated reward-table modal if the economy needs deeper inspection.
    el.crankVaultOddsNote.innerHTML = `${crankVaultPoolCopy()} <button class="text-button" type="button" data-crankvault-odds>Odds</button>`;
  }
  if (el.crankVaultInventoryTitle) {
    const count = state.crankVaultInventory.length;
    el.crankVaultInventoryTitle.textContent = `Earned Vaults${count ? ` · ${count}` : ""}`;
  }
  el.crankVaultInventory.innerHTML = state.crankVaultInventory.length
    ? state.crankVaultInventory.map((vault) => {
      const def = crankVaultDefs[vault.type] || crankVaultDefs.common;
      return `
        <article class="crankvault-inventory-card" data-vault-color="${crankVaultColor(def)}">
          ${crankVaultArtMarkup(def, { size: "sm" })}
          <h3>${def.name}</h3>
          <small>${vault.source || "Story reward"}</small>
          <button class="primary" type="button" data-crankvault-open="${vault.id}">Open</button>
        </article>
      `;
    }).join("")
    : `<p class="empty-note">Earned CrankVaults will wait here until you open them.</p>`;
  updateCrankVaultResetCopy();
  if (!crankVaultResetInterval) crankVaultResetInterval = window.setInterval(updateCrankVaultResetCopy, 1000);
}

function stopCrankVaultResetTimer() {
  if (!crankVaultResetInterval) return;
  window.clearInterval(crankVaultResetInterval);
  crankVaultResetInterval = null;
}

function updateCrankVaultResetCopy() {
  renderCrankVaultBadge();
  if (viewIsActive("crankvaults") && el.crankVaultDaily?.dataset.dailyAvailable !== String(dailyVaultAvailable())) {
    renderCrankVaults();
    return;
  }
  const resetEl = document.querySelector("#crankvault-reset");
  if (!resetEl) return;
  const remaining = Math.max(0, nextVaultResetTime().getTime() - Date.now());
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  resetEl.textContent = `Next free Common CrankVault in ${hours}h ${minutes}m ${seconds}s`;
  if (viewIsActive("crankvaults")) renderDailyGoals();
}

function crankVaultRewardMarkup(result) {
  if (result.kind === "medallion") {
    return `
      <article class="crankvault-reward">
        ${forgeMedallionMarkup(result.lineId, result.formName, "crankvault-medallion")}
        <div><strong>${result.formName} Medallion</strong><span>${result.firstTime ? `Take it to ${unlockHubName()} to unlock` : "Duplicate medallion"}</span></div>
        <img class="crankvault-class-stamp" src="${getClassStamp(result.classLetter)}" alt="Class ${result.classLetter}" onerror="this.replaceWith(Object.assign(document.createElement('strong'),{textContent:'${result.classLetter}'}))">
      </article>
    `;
  }
  return `<article class="crankvault-reward"><span class="crankvault-img-fallback">◈</span><div><strong>+${result.amount} ${result.kind === "sprox" ? "Sprox" : "Spins"}</strong><span>Added to your wallet</span></div></article>`;
}

function showCrankVaultReveal(def, results) {
  if (!el.crankVaultRevealModal) return;
  el.crankVaultRevealTitle.textContent = def.name;
  if (el.crankVaultRevealHero) el.crankVaultRevealHero.innerHTML = crankVaultArtMarkup(def);
  el.crankVaultRevealResults.innerHTML = "";
  el.crankVaultRevealModal.classList.add("active");
  el.crankVaultRevealModal.setAttribute("aria-hidden", "false");
  const delay = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 280;
  window.setTimeout(() => {
    if (!el.crankVaultRevealModal.classList.contains("active")) return;
    if (el.crankVaultRevealHero) {
      el.crankVaultRevealHero.innerHTML = crankVaultArtMarkup(def, { open: true });
      el.crankVaultRevealHero.classList.remove("pop");
      requestAnimationFrame(() => el.crankVaultRevealHero.classList.add("pop"));
    }
    el.crankVaultRevealResults.innerHTML = results.map(crankVaultRewardMarkup).join("");
  }, delay);
}

function revealCrankVault(def, candidateLines = null) {
  showCrankVaultReveal(def, openCrankVault(def, candidateLines));
}

function purchaseCrankVault(type) {
  const vault = crankVaultDefs[type];
  if (!vault) return;
  if (!spendSpins(vault.cost)) {
    showToast("Not Enough Spins", `You need ${formatSpins(vault.cost)} to open this CrankVault.`);
    return;
  }
  revealCrankVault(vault);
  renderCrankVaults();
  render();
}

function claimDailyCrankVault() {
  if (!dailyVaultAvailable()) return;
  state.dailyCrankVault.lastClaimedDayKey = currentVaultDayKey();
  showToast("Common CrankVault Received", "Your daily free Common CrankVault is ready.");
  revealCrankVault(crankVaultDefs.common);
  renderCrankVaults();
  render();
}

function openInventoryCrankVault(id) {
  const vaultIndex = state.crankVaultInventory.findIndex((vault) => vault.id === id);
  if (vaultIndex < 0) return;
  const [vault] = state.crankVaultInventory.splice(vaultIndex, 1);
  const def = crankVaultDefs[vault.type] || crankVaultDefs.common;
  revealCrankVault(def, vault.candidateLines);
  saveState();
  renderCrankVaults();
  render();
}

function closeCrankVaultReveal() {
  el.crankVaultRevealModal?.classList.remove("active");
  el.crankVaultRevealModal?.setAttribute("aria-hidden", "true");
  render();
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
    const bonusWindow = ready && nitroContextForRace().length > 0;
    el.nitroButton.disabled = !ready;
    el.nitroButton.classList.toggle("ready", ready);
    el.nitroButton.classList.toggle("bonus-window", bonusWindow);
  }
  if (el.perfectStreak) {
    const streak = race?.perfectStreak || 0;
    el.perfectStreak.hidden = streak < 1;
    el.perfectStreak.textContent = streak ? `Perfect x${streak} · +${Math.round((perfectHeatMultiplier() - 1) * 100)}% heat` : "";
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
  el.dragLaunchLights?.classList.remove("staging");
  playSound(playerWon ? "win-jingle" : "lose-jingle");
  haptic(playerWon ? [25, 25, 45] : [60]);
  race.nitroActive = false;
  race.rivalNitroActive = false;
  (race.opponents || []).forEach((opponent) => {
    opponent.nitroActive = false;
  });
  drawRace();
  const finishedRace = race;
  const bestOpponentDistance = Math.max(0, ...(finishedRace.opponents || []).map((opponent) => opponent.distance));
  const finishMargin = Math.abs(finishedRace.playerDistance - bestOpponentDistance);
  const photoFinish = bestOpponentDistance > 0 && finishMargin <= DRAG_PHOTO_FINISH_MARGIN_METERS;
  finishedRace.photoFinish = photoFinish ? { won: playerWon, margin: finishMargin } : null;
  if (photoFinish && effectsAllowed()) {
    // TODO: add a dedicated photo-finish stinger sound once the audio asset exists.
    el.dragTrack?.classList.add("photo-finish-moment");
    screenShake(8, 220);
    hitStop(DRAG_HITSTOP_PHOTO_MS);
    window.setTimeout(() => el.dragTrack?.classList.remove("photo-finish-moment"), DRAG_PHOTO_FINISH_REVEAL_DELAY_MS + 180);
  }
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
  const masteryBonus = playerWon && !isGauntlet && finishedRace.longestPerfectStreak >= DRAG_MASTERY_BONUS_MIN_STREAK
    ? finishedRace.longestPerfectStreak * DRAG_MASTERY_BONUS_SPROX_PER_SHIFT
    : 0;
  if (masteryBonus) {
    addSprox(masteryBonus);
    earned += masteryBonus;
  }

  recordRaceUsage(finishedRace.carId);
  recordTunerStat(playerWon ? "dragRacesWon" : "dragRacesLost");
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
  if (tutorialActive() && playerWon) {
    setTutorialScene("drag-race-win");
    saveState();
  }
  render();
  if (tutorialActive() && playerWon) renderTutorial();
  const resultPayload = {
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
    dragSummary: dragRaceSummary(finishedRace, masteryBonus),
    photoFinish: effectsAllowed() ? finishedRace.photoFinish : null,
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
        if (playerWon && finishedLevel?.cityStructureEvent?.type === "story") {
          finishRuntimeStoryWithPost(finishedLevel, finishStory);
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
  };
  const revealResult = () => showRaceResult(el.dragTrack, resultPayload);
  if (photoFinish && effectsAllowed()) window.setTimeout(revealResult, DRAG_PHOTO_FINISH_REVEAL_DELAY_MS);
  else revealResult();
}

function failDragRace(title) {
  if (!race?.active || race.finished) return;
  race.active = false;
  race.finished = true;
  el.dragLaunchLights?.classList.remove("staging");
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
    pinkSlipPenaltyLine = "You lost the Pink Slip race. Your GearBorn has been returned to Level 1 and its equipped parts were taken.";
  }
  recordRaceUsage(failedRace.carId);
  recordStoryRaceOutcome(false, isStoryRace);
  recordTunerStat("dragRacesLost");
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
    dragSummary: dragRaceSummary(failedRace),
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

function dragRaceSummary(finishedRace, masteryBonus = 0) {
  const counts = { Perfect: 0, Good: 0, Late: 0, Early: 0 };
  (finishedRace?.shiftScore || []).forEach((label) => {
    if (Object.prototype.hasOwnProperty.call(counts, label)) counts[label] += 1;
  });
  return {
    launchGrade: finishedRace?.launchGrade || "Not launched",
    counts,
    longestPerfectStreak: finishedRace?.longestPerfectStreak || 0,
    nitroUsed: Boolean(finishedRace?.nitroUsed),
    masteryBonus
  };
}

function dragRaceSummaryMarkup(summary) {
  if (!summary) return "";
  return `
    <div class="drag-result-breakdown">
      <strong>Drag Breakdown</strong>
      <span>Launch: ${escapeHtml(summary.launchGrade)}</span>
      <span>Shifts: ${summary.counts.Perfect} Perfect · ${summary.counts.Good} Good · ${summary.counts.Late} Late · ${summary.counts.Early} Early</span>
      <span>Longest Perfect streak: ${summary.longestPerfectStreak}</span>
      <span>Nitro: ${summary.nitroUsed ? "Used" : "Not used"}${summary.masteryBonus ? ` · Mastery bonus +${formatSprox(summary.masteryBonus)}` : ""}</span>
    </div>
  `;
}

function showRaceResult(trackNode, result) {
  if (!trackNode) {
    result.onPrimary?.();
    return;
  }
  trackNode.querySelectorAll(".race-result-popup").forEach((node) => node.remove());
  const popup = document.createElement("div");
  popup.className = `race-result-popup ${result.won ? "win" : "loss"} ${result.disableActions ? "tutorial-passive" : ""} ${effectsAllowed() ? "result-build" : ""}`;
  popup.innerHTML = `
    <div class="race-result-card">
      ${result.photoFinish ? `<p class="photo-finish-stinger">${result.won ? "WIN" : "LOSE"} · PHOTO FINISH</p>` : ""}
      <h2>${result.title || (result.won ? "Victory" : "Defeat")}</h2>
      ${medalResultMarkup(result.medal, result.medalImproved)}
      ${result.hideSprox ? "" : `<p class="reward-pop">Sprox Earned: <strong>${sproxResultMarkup(result.sprox ?? 0)}</strong></p>`}
      ${dragRaceSummaryMarkup(result.dragSummary)}
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
  if (effectsAllowed()) {
    requestAnimationFrame(() => popup.classList.add("result-build-ready"));
  }
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
  if (reduceMotionEnabled() || state.settings.screenEffects === false) {
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
  "monkey":             "assets/medallions/medallion-bananachi.png",
  "all-terrain-spyder": "assets/medallions/medallion-spydar.png",
  "sun-lion":           "assets/medallions/medallion-sparkit.png",
  "emo-turtle":         "assets/medallions/medallion-shellow.png",
  "snake":              "assets/medallions/medallion-venomoil.png",
  "galaxy-jelly":       "assets/medallions/medallion-bloomula.png",
  "high-roller-cheetah":"assets/medallions/medallion-jackpaw.png",
  "combat-badger":      "assets/medallions/medallion-bootclaw.png",
  "jazz-panther":       "assets/medallions/medallion-panthroove.png",
  "sports-car":         "assets/medallions/medallion-ballparker.png",
  "magician":           "assets/medallions/medallion-hoptical.png",
  "drift-pirate":       "assets/medallions/medallion-driftplank.png",
  "island-luau":        "assets/medallions/medallion-isluau.png",
  "long-haul-camel":    "assets/medallions/medallion-decalf.png",
  "octopus-gymnast":    "assets/medallions/medallion-chalktopus.png",
  "art-van":            "assets/medallions/medallion-vanvass.png",
  "cake-train":         "assets/medallions/medallion-cuptrack.png",
  "muscle-man":         "assets/medallions/medallion-tourquette.png",
  "waste-management":   "assets/medallions/medallion-garbaggito.png",
  "chill-penguin":      "assets/medallions/medallion-freezy-e.png",
  "space-dolphin":      "assets/medallions/medallion-orbitide.png",
  "butcher-hog":        "assets/medallions/medallion-sauspin.png",
  "tiger-cart":         "assets/medallions/medallion-puttercat.png",
  "gb-growler":         "assets/medallions/medallion-cruzdog.png",
  "armadaddio":         "assets/medallions/medallion-mansplore.png",
  "electro-beetle":     "assets/medallions/medallion-bertie.png",
  "flavor-coast":       "assets/medallions/medallion-carmieri.png",
  "future-bok":         "assets/medallions/medallion-sprynza.png",
  "wrestler-roo":       "assets/medallions/medallion-rumbleroo.png",
  "narwhal-luxury":     "assets/medallions/medallion-narwraith.png",
  "silly-goose":        "assets/medallions/medallion-honky.png",
  "construction-blok":  "assets/medallions/medallion-blokparty.png",
  "skater-koala":       "assets/medallions/medallion-koaster.png",
  "royal-flush":        "assets/medallions/medallion-whiffleton.png",
  "rides-hair":         "assets/medallions/medallion-staschel.png",
  "funvee":             "assets/medallions/medallion-funvee.png",
  "eager-beaver":       "assets/medallions/medallion-dambitious.png",
  "minivan":            "assets/medallions/medallion-poola.png",
  "birds-of-metal":     "assets/medallions/medallion-hawklycruze.png",
  "running-bulls":      "assets/medallions/medallion-motoro.png",
  "anime":              "assets/medallions/medallion-irasshaimase.png",
  "influencer-peacock": "assets/medallions/medallion-hatchelorette.png",
  "bucking-bronco":     "assets/medallions/medallion-whinnibago.png",
  "rainbowlt":          "assets/medallions/medallion-rainbowlt.png",
  "training-car":       "assets/medallions/medallion-tutorque.png",
};

function forgeMedallionSrc(carId) {
  return forgeMedallionMap[carId] || "";
}

function forgeMedallionMarkup(carId, label, className = "") {
  const src = forgeMedallionSrc(carId);
  const classLetter = classForLineId(carId);
  if (src) return `<img class="${className}" src="${src}" alt="${escapeHtml(label || carId)} Medallion" onerror="this.hidden=true">`;
  // TODO: add forge-medallion art for all unlockable lines.
  return `<span class="forge-medallion-fallback ${className}" aria-label="${escapeHtml(label || carId)} Medallion">
    <img src="${getClassStamp(classLetter)}" alt="Class ${classLetter}" onerror="this.replaceWith(Object.assign(document.createElement('strong'),{textContent:'${classLetter || '?'}'}))">
  </span>`;
}

let forgeSelectedCarId = null;
let forgeAnimating = false;
let forgeMode = "unlock";
let forgeFusionA = null;
let forgeFusionB = null;
let forgeFusionMessage = "";

function fusionParentLineIdSet() {
  return new Set(fusionRecipes.flatMap((recipe) => fusionRecipeParentLineIds(recipe)));
}

function firstCityClearedForFusion() {
  const firstCity = storyCities[0];
  const firstBoss = firstCity?.levels?.find((level) => level.type === "boss");
  return Boolean(firstBoss && storyLevelCompleted(firstBoss.campaignIndex));
}

function fusionUnlocked() {
  if (tutorialActive()) return false;
  const parentIds = fusionParentLineIdSet();
  // TODO confirm gate: default unlock is first city cleared plus any valid fusion parent reaching Gold tier.
  return firstCityClearedForFusion() && cars.some((car) => parentIds.has(car.id) && medallionTier(car.id) === "gold");
}

function maybeShowFusionIntro() {
  if (!fusionUnlocked() || state.fusionIntroSeen) return;
  state.fusionIntroSeen = true;
  saveState();
  showToast("Fusion Unlocked", `${unlockHubName()} can now fuse Gold-tier GearBorn.`);
}

function setForgeMode(nextMode) {
  forgeMode = nextMode === "fusion" && fusionUnlocked() ? "fusion" : "unlock";
  if (forgeMode !== "fusion") {
    forgeFusionA = null;
    forgeFusionB = null;
    forgeFusionMessage = "";
  }
  openForge();
}

function fusionParentName(lineId) {
  const car = cars.find((item) => item.id === lineId);
  return car?.evolutions?.[0]?.name || car?.forms?.[0]?.[1] || lineId;
}

function fusionParentTileMarkup(lineId) {
  const selected = [forgeFusionA, forgeFusionB].includes(lineId);
  const count = spendableMedallionsForRank(lineId);
  const name = fusionParentName(lineId);
  return `
    <button class="forge-medallion-tile forge-fusion-parent-tile${selected ? " active" : ""}" data-forge-fusion-parent="${lineId}" type="button" aria-label="${escapeHtml(name)} fusion parent">
      ${forgeMedallionMarkup(lineId, name)}
      <span>${escapeHtml(name)}</span>
      <small>Gold · ${count} spendable</small>
    </button>
  `;
}

function fusionSlotMarkup(slot, lineId) {
  const name = lineId ? fusionParentName(lineId) : `Parent ${slot}`;
  return `
    <button class="forge-fusion-slot ${lineId ? "filled" : "empty"}" type="button" data-forge-fusion-slot="${slot}" ${lineId ? "" : "disabled"}>
      ${lineId ? forgeMedallionMarkup(lineId, name, "forge-fusion-slot-medallion") : `<span class="forge-fusion-slot-empty">+</span>`}
      <strong>${escapeHtml(name)}</strong>
      <small>${lineId ? `${spendableMedallionsForRank(lineId)} spendable` : "Select a Gold parent"}</small>
    </button>
  `;
}

function fusionRecipeStatusMarkup(recipe) {
  if (!recipe) return "";
  const [parentAId, parentBId] = fusionRecipeParentLineIds(recipe);
  const issues = [];
  if (isCarUnlocked(recipe.id)) issues.push("Fusion already owned.");
  if (!fusionParentsEligible(recipe)) issues.push("Both parent lines must be Gold tier.");
  if (spendableMedallionsForRank(parentAId) < fusionMedallionCost || spendableMedallionsForRank(parentBId) < fusionMedallionCost) {
    issues.push(`Requires ${fusionMedallionCost} spendable medallions from each parent.`);
  }
  return issues.length ? `<p class="forge-fusion-error">${issues.join(" ")}</p>` : `<p class="forge-fusion-ready">Ready to fuse.</p>`;
}

function renderForgeFusionPicker() {
  if (!el.forgeMedallionGrid) return;
  const parentIds = [...fusionParentLineIdSet()]
    .filter((lineId) => medallionTier(lineId) === "gold")
    .sort((a, b) => fusionParentName(a).localeCompare(fusionParentName(b)));
  const bothSelected = forgeFusionA && forgeFusionB && forgeFusionA !== forgeFusionB;
  const recipe = bothSelected ? fusionRecipeFor(forgeFusionA, forgeFusionB) : null;
  const fusionCar = recipe ? cars.find((car) => car.id === recipe.id) : null;
  const fusionForm = fusionCar?.evolutions?.[0];
  const canFuse = recipe && canForge(recipe);
  // NOTE: Fusion consumes actual duplicate medallions, which also lowers the parent line's remaining rank-up fuel.
  const preview = bothSelected
    ? (recipe ? `
        <div class="forge-fusion-preview">
          <div class="forge-fusion-preview-art">${carMarkupForEvolution(recipe.id, 0, "display")}</div>
          <div>
            <span>Known Fusion</span>
            <strong>${escapeHtml(recipe.name)}</strong>
            <small>${fusionForm?.name ? escapeHtml(fusionForm.name) : "Fusion line"}</small>
            <em>Cost: ${fusionMedallionCost} ${escapeHtml(fusionParentName(forgeFusionA))} + ${fusionMedallionCost} ${escapeHtml(fusionParentName(forgeFusionB))}</em>
          </div>
        </div>
        ${fusionRecipeStatusMarkup(recipe)}
      ` : `
        <div class="forge-fusion-preview no-recipe">
          <div class="forge-fusion-question">?</div>
          <div>
            <span>No known fusion</span>
            <strong>Experiment?</strong>
            <small>Risk ${fusionMedallionCost} medallions from each parent for a consolation reward.</small>
          </div>
        </div>
      `)
    : `<p class="forge-fusion-help">Pick two Gold-tier parent lines to see whether the Forge knows a fusion.</p>`;
  el.forgeMedallionGrid.innerHTML = `
    <div class="forge-fusion-picker">
      <div class="forge-fusion-slots">
        ${fusionSlotMarkup("A", forgeFusionA)}
        ${fusionSlotMarkup("B", forgeFusionB)}
      </div>
      ${preview}
      ${forgeFusionMessage ? `<p class="forge-fusion-message">${escapeHtml(forgeFusionMessage)}</p>` : ""}
      <div class="forge-fusion-parent-list">
        ${parentIds.length ? parentIds.map(fusionParentTileMarkup).join("") : `<p class="forge-empty">Fusion requires Gold-tier parent lines. Clear the first city, then raise a valid parent line to Gold.</p>`}
      </div>
    </div>
  `;
  if (el.forgeSelectedMedallion) el.forgeSelectedMedallion.setAttribute("hidden", "");
  if (el.forgeSelectedName) el.forgeSelectedName.textContent = recipe ? `${recipe.name} Fusion` : "Select two Gold-tier parents";
  if (el.forgeUnlockBtn) {
    el.forgeUnlockBtn.disabled = !(bothSelected && (canFuse || !recipe));
    el.forgeUnlockBtn.textContent = recipe
      ? (canFuse ? `Forge ${recipe.name}` : "Fusion Locked")
      : (bothSelected ? "Gamble Experiment" : "Select Two Parents");
  }
}

function selectForgeFusionParent(lineId) {
  if (forgeMode !== "fusion" || medallionTier(lineId) !== "gold") return;
  forgeFusionMessage = "";
  if (forgeFusionA === lineId) {
    forgeFusionA = null;
  } else if (forgeFusionB === lineId) {
    forgeFusionB = null;
  } else if (!forgeFusionA) {
    forgeFusionA = lineId;
  } else if (!forgeFusionB) {
    forgeFusionB = lineId;
  } else {
    forgeFusionA = lineId;
    forgeFusionB = null;
  }
  renderForgeInventory();
}

function clearForgeFusionSlot(slot) {
  if (slot === "A") forgeFusionA = null;
  if (slot === "B") forgeFusionB = null;
  forgeFusionMessage = "";
  renderForgeInventory();
}

function openFusionGambleConfirm() {
  if (!forgeFusionA || !forgeFusionB) return;
  if (el.fusionGambleCopy) {
    el.fusionGambleCopy.textContent = `These two have no known fusion. Risk ${fusionMedallionCost} ${fusionParentName(forgeFusionA)} medallions and ${fusionMedallionCost} ${fusionParentName(forgeFusionB)} medallions to experiment? You'll get something in return, but not a fusion.`;
  }
  el.fusionGambleModal?.classList.add("active");
  el.fusionGambleModal?.setAttribute("aria-hidden", "false");
  el.cancelFusionGamble?.focus();
}

function closeFusionGambleConfirm() {
  el.fusionGambleModal?.classList.remove("active");
  el.fusionGambleModal?.setAttribute("aria-hidden", "true");
}

async function runFusionReveal(recipe, parentAId, parentBId) {
  const overlay = document.getElementById("forge-fullscreen");
  const area = document.getElementById("forge-fs-anim-area");
  const fsVat = document.getElementById("forge-fs-vat");
  if (!overlay || !area || !effectsAllowed()) {
    showForgeUnlockedPopup(recipe.id);
    return;
  }
  const step = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(70, Math.round(ms))));
  try {
    const fsBg = document.querySelector(".forge-fs-bg");
    if (fsBg) fsBg.src = activeUnlockHub() === "spindellLabs" ? "assets/spindell/spindell-bg.png" : "assets/forge/forge_bg.png";
    if (fsVat) {
      fsVat.src = activeUnlockHub() === "spindellLabs" ? "assets/spindell/spindell-sync-port.png" : "assets/forge/forge_vat.png";
      fsVat.alt = activeUnlockHub() === "spindellLabs" ? "Spindell sync port" : "The Forge vat";
    }
    area.innerHTML = `
      <div class="forge-fusion-reveal-label">FUSION</div>
      <div class="forge-fusion-reveal-parent parent-a">${forgeMedallionMarkup(parentAId, fusionParentName(parentAId))}</div>
      <div class="forge-fusion-reveal-parent parent-b">${forgeMedallionMarkup(parentBId, fusionParentName(parentBId))}</div>
      <div class="forge-fusion-reveal-flash"></div>
      <div class="forge-anim-layer forge-anim-car-reveal forge-fusion-car-reveal">${carMarkupForEvolution(recipe.id, 0, "display")}</div>
    `; // TODO polish fusion reveal with bespoke parent convergence animation.
    overlay.classList.add("active", "forge-fusion-animation");
    overlay.setAttribute("aria-hidden", "false");
    playAudioCue("evolutionBuild");
    await step(200);
    area.querySelectorAll(".forge-fusion-reveal-parent").forEach((node) => node.classList.add("converge"));
    await step(850);
    fsVat?.classList.add("forge-shake");
    area.querySelector(".forge-fusion-reveal-flash")?.classList.add("active");
    await step(650);
    fsVat?.classList.remove("forge-shake");
    playAudioCue("evolutionReveal");
    area.querySelector(".forge-fusion-car-reveal")?.classList.add("step-reveal");
    await step(1400);
  } finally {
    fsVat?.classList.remove("forge-shake");
    overlay.classList.remove("active", "forge-fusion-animation");
    overlay.setAttribute("aria-hidden", "true");
    area.innerHTML = "";
    showForgeUnlockedPopup(recipe.id);
  }
}

async function forgeSelectedFusion() {
  if (forgeMode !== "fusion" || forgeAnimating || !forgeFusionA || !forgeFusionB) return;
  const recipe = fusionRecipeFor(forgeFusionA, forgeFusionB);
  if (!recipe) {
    openFusionGambleConfirm();
    return;
  }
  forgeAnimating = true;
  if (el.forgeUnlockBtn) el.forgeUnlockBtn.disabled = true;
  const parentAId = forgeFusionA;
  const parentBId = forgeFusionB;
  const result = performFusion(recipe);
  if (result.error) {
    forgeFusionMessage = result.error;
    forgeAnimating = false;
    renderForgeInventory();
    return;
  }
  forgeFusionA = null;
  forgeFusionB = null;
  forgeFusionMessage = "";
  render();
  renderForgeInventory();
  await runFusionReveal(recipe, parentAId, parentBId);
  forgeAnimating = false;
}

function confirmFusionGamble() {
  closeFusionGambleConfirm();
  if (!forgeFusionA || !forgeFusionB) return;
  const result = attemptFusion(forgeFusionA, forgeFusionB, { gamble: true });
  if (result.fusionId) {
    const recipe = fusionRecipes.find((item) => item.id === result.fusionId);
    if (recipe) runFusionReveal(recipe, forgeFusionA, forgeFusionB);
    forgeFusionA = null;
    forgeFusionB = null;
  } else if (result.whiffed) {
    forgeFusionMessage = `No fusion formed. You received ${result.spins || 0} Spins as consolation.`;
    showToast("Fusion Experiment", forgeFusionMessage);
    forgeFusionA = null;
    forgeFusionB = null;
  } else {
    forgeFusionMessage = result.error || "Fusion experiment failed.";
  }
  render();
  renderForgeInventory();
}

function openForge() {
  showView("garage");
  forgeSelectedCarId = null;
  forgeAnimating = false;
  if (!fusionUnlocked()) forgeMode = "unlock";
  maybeShowFusionIntro();
  const spindell = activeUnlockHub() === "spindellLabs";
  if (el.forgePanel) {
    el.forgePanel.classList.toggle("spindell-labs-view", spindell && forgeMode === "unlock");
    el.forgePanel.classList.toggle("forge-unlock-view", !spindell && forgeMode === "unlock");
    el.forgePanel.classList.toggle("forge-fusion-view", forgeMode === "fusion");
  }
  if (el.forgeModeToggle) {
    el.forgeModeToggle.hidden = !fusionUnlocked();
    el.forgeModeToggle.querySelectorAll("[data-forge-mode]").forEach((button) => button.classList.toggle("active", button.dataset.forgeMode === forgeMode));
  }
  if (el.forgeKicker) el.forgeKicker.textContent = forgeMode === "fusion" ? unlockHubName() : (spindell ? "Spindell Labs" : "The Forge");
  if (el.forgeTitle) el.forgeTitle.textContent = forgeMode === "fusion" ? "Fuse two Golds." : (spindell ? "Spindell Labs" : "Forge what's next.");
  if (el.forgeSubtitle) {
    el.forgeSubtitle.textContent = forgeMode === "fusion"
      ? "Combine two Gold-tier lines of different types into something new."
      : spindell
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
  if (el.forgeUnlockBtn) { el.forgeUnlockBtn.disabled = true; el.forgeUnlockBtn.textContent = forgeMode === "fusion" ? "Select Two Parents" : (spindell ? "Select a Key" : "Select a Medallion"); }
  if (el.forgeAnimationArea) {
    el.forgeAnimationArea.innerHTML = spindell
      ? `<img class="spindell-idle-sync-tube" src="assets/spindell/spindell-sync-tube.png" alt="" aria-hidden="true" onerror="this.hidden=true;">`
      : "";
    el.forgeAnimationArea.classList.remove("animating");
  }
  if (el.forgeSelectedMedallion) el.forgeSelectedMedallion.setAttribute("hidden", "");
  if (el.forgeSelectedName) el.forgeSelectedName.textContent = forgeMode === "fusion" ? "Select two Gold-tier parents" : (spindell ? "Select a key medallion to sync" : "Select a Medallion to unlock");
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
  if (el.forgeModeToggle) {
    el.forgeModeToggle.hidden = !fusionUnlocked();
    el.forgeModeToggle.querySelectorAll("[data-forge-mode]").forEach((button) => button.classList.toggle("active", button.dataset.forgeMode === forgeMode));
  }
  if (el.forgePanel) {
    const spindell = activeUnlockHub() === "spindellLabs";
    el.forgePanel.classList.toggle("spindell-labs-view", spindell && forgeMode === "unlock");
    el.forgePanel.classList.toggle("forge-unlock-view", !spindell && forgeMode === "unlock");
    el.forgePanel.classList.toggle("forge-fusion-view", forgeMode === "fusion");
  }
  if (forgeMode === "fusion") {
    renderForgeFusionPicker();
    return;
  }
  // During tutorial forge scene, show only the 3 demo medallions awarded for this demo
  const tutorialForgeDemoIds = ["bee", "pickup", "rabbit"];
  const tutorialForge = tutorialActive() && state.tutorialAwaitingForge;
  const medallionCounts = tutorialForge
    ? Object.fromEntries(tutorialForgeDemoIds.map((id) => [id, 1]))
    : (state.medallionsOwned || []).reduce((counts, id) => {
        if (cars.some((car) => car.id === id)) counts[id] = (counts[id] || 0) + 1;
        return counts;
      }, {});
  const owned = Object.keys(medallionCounts);
  el.forgeMedallionGrid.innerHTML = owned.length
    ? owned.map((carId) => {
        const car = cars.find((c) => c.id === carId);
        const form = car?.evolutions?.[0];
        const active = forgeSelectedCarId === carId ? " active" : "";
        const unlocked = isCarUnlocked(carId) && !tutorialForge;
        const count = medallionCounts[carId] || 0;
        const spendable = spendableMedallionsForRank(carId);
        return `<button class="forge-medallion-tile${active}${unlocked ? " owned-line" : ""}" ${unlocked ? "" : `data-forge-car="${carId}"`} type="button" ${unlocked ? "disabled" : ""} aria-label="${form?.name || carId} Medallion">
          ${forgeMedallionMarkup(carId, form?.name || carId)}
          <b class="forge-medallion-count">×${count}</b>
          <span>${form?.name || carId}</span>
          ${unlocked ? `<small>${spendable} spendable</small>` : `<small>Ready to unlock</small>`}
        </button>`;
      }).join("")
    : `<p class="forge-empty">No medallions yet. Win races or open CrankVaults to earn them.</p>`;
}

function selectForgeMedallion(carId) {
  if (forgeMode !== "unlock") return;
  forgeSelectedCarId = carId;
  renderForgeInventory();
  const car = cars.find((c) => c.id === carId);
  const form = car?.evolutions?.[0];
  if (el.forgeSelectedName) el.forgeSelectedName.textContent = form?.name || carId;
  if (el.forgeSelectedMedallion) {
    const src = forgeMedallionSrc(carId);
    el.forgeSelectedMedallion.src = src;
    el.forgeSelectedMedallion.alt = (form?.name || carId) + " Medallion";
    el.forgeSelectedMedallion.toggleAttribute("hidden", !src);
  }
  el.forgeUnlockBtn.disabled = false;
  el.forgeUnlockBtn.textContent = activeUnlockHub() === "spindellLabs" ? `Sync ${form?.name || carId}` : `Unlock ${form?.name || carId}`;
}

async function runForgeAnimation(carId, options = {}) {
  if (forgeAnimating) return;
  const preview = Boolean(options.preview);
  if (!preview && (!forgeSelectedCarId || forgeSelectedCarId !== carId)) return;
  if (!preview && !(state.medallionsOwned || []).includes(carId)) return;
  if (!preview && isCarUnlocked(carId)) return;
  const animationType = options.animationType || unlockAnimationType();
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

    const lineRoot = (typeof evolutionLineRootForCar === "function" ? evolutionLineRootForCar(carId) : null) || carId;
    const firstForm = evolutionByIndex(carId, 0);
    const firstFormSlug = (firstForm?.name || lineRoot).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const pixelCarSrc = `assets/spindell/pixel/pixel-${firstFormSlug}.png`;
    const pixelLineFallback = `assets/spindell/pixel/pixel-${lineRoot}.png`;
    const pixelCarFallback = "assets/spindell/pixel/pixel-car.png";
    const carDisplaySrc = imageFor(firstForm, "display") || "";

    area.innerHTML = `
      <img class="spindell-sync-layer spindell-sync-idle-tube" src="assets/spindell/spindell-sync-tube.png" alt="" onerror="this.classList.add('asset-missing')">
      <img class="spindell-sync-layer spindell-sync-medallion" src="${forgeMedallionSrc(carId)}" alt="Medallion" onerror="this.classList.add('asset-missing')">
      <img class="spindell-sync-layer spindell-sync-arm" src="assets/spindell/spindell-magnetic-arm.png" alt="" onerror="this.classList.add('asset-missing')">
      <img class="spindell-sync-layer spindell-sync-tube-anim" src="assets/spindell/spindell-sync-tube.png" alt="" onerror="this.classList.add('asset-missing')">
      <div class="spindell-sync-layer spindell-sync-tube-car-wrap" aria-hidden="true">
        <img class="spindell-sync-car" src="${carDisplaySrc}" alt="" onerror="this.classList.add('asset-missing')">
      </div>
      <img class="spindell-sync-layer spindell-sync-key" src="assets/items/gearborn-key.png" alt="GearBorn Key" onerror="this.classList.add('asset-missing')">
      <div class="spindell-sync-layer spindell-sync-flash-layer"></div>
      <div class="spindell-sync-layer spindell-key-display">
        <img class="vinsync-complete-screen" src="assets/spindell/vinsync-complete-screen.png" alt="" onerror="this.classList.add('asset-missing')">
        <img class="vinsync-pixel-car" src="${pixelCarSrc}" onerror="if(this.dataset.fallback==='line'){this.dataset.fallback='generic';this.src='${pixelCarFallback}'}else if(this.dataset.fallback==='generic'){this.hidden=true}else{this.dataset.fallback='line';this.src='${pixelLineFallback}'}" alt="">
      </div>
    `;
    const getSync = (cls) => area.querySelector("." + cls);
    const idleTubeEl = getSync("spindell-sync-idle-tube");
    const medallionEl = getSync("spindell-sync-medallion");
    const armEl = getSync("spindell-sync-arm");
    const tubeEl = getSync("spindell-sync-tube-anim");
    const carWrapEl = getSync("spindell-sync-tube-car-wrap");
    const keyEl = getSync("spindell-sync-key");
    const flashEl = getSync("spindell-sync-flash-layer");
    const displayEl = getSync("spindell-key-display");

    await step(420);

    add(medallionEl, "spindell-sync-active");
    await step(620);

    add(medallionEl, "spindell-sync-into-slot");
    add(fsVat, "spindell-sync-port-power");
    await step(620);

    await step(280);

    add(armEl, "spindell-sync-arm-descend");
    await step(700);

    add(armEl, "spindell-sync-arm-clamp");
    add(idleTubeEl, "spindell-sync-arm-clamp");
    await step(280);

    add(idleTubeEl, "spindell-sync-tube-lift");
    add(armEl, "spindell-sync-tube-lift");
    await step(820);

    await step(280);

    add(tubeEl, "spindell-sync-new-tube-above");
    add(carWrapEl, "spindell-sync-new-tube-above");
    void tubeEl.offsetWidth;
    remove(armEl, "spindell-sync-tube-lift");
    remove(armEl, "spindell-sync-arm-descend");
    add(armEl, "spindell-sync-arm-redescend");
    add(tubeEl, "spindell-sync-new-tube-descend");
    add(carWrapEl, "spindell-sync-new-tube-descend");
    await step(820);

    add(flashEl, "spindell-sync-flash");
    remove(armEl, "spindell-sync-arm-redescend");
    add(armEl, "spindell-sync-arm-retract");
    await step(620);

    add(keyEl, "spindell-sync-key-active");
    await step(720);

    add(displayEl, "spindell-sync-complete");
    await step(1600);
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
      const fsBg = document.querySelector(".forge-fs-bg");
      if (fsBg) fsBg.src = "assets/forge/forge_bg.png";
      if (fsVat) {
        fsVat.src = "assets/forge/forge_vat.png";
        fsVat.alt = "The Forge vat";
      }
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

    if (preview) return;
    if (!(state.medallionsOwned || []).includes(carId) || isCarUnlocked(carId)) return;
    unlockGearbornLine(carId);
    removeMedallions(carId, 1);
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
    if (fsVat) fsVat.src = animationType === "spindellKeySync" ? "assets/spindell/spindell-sync-port.png" : "assets/forge/forge_vat.png";
    overlay.classList.remove("active");
    overlay.classList.remove("spindell-key-sync-animation", "forge-unlock-animation");
    overlay.setAttribute("aria-hidden", "true");
    area.innerHTML = "";
    forgeAnimating = false;
    if (el.forgeUnlockBtn) el.forgeUnlockBtn.disabled = !forgeSelectedCarId || isCarUnlocked(forgeSelectedCarId);
  }

  if (preview) return;
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
    setTutorialScene(selectedTuner()?.id === "cha-cha" ? "unlocked-cc" : "unlocked");
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
      el.forgeUnlockBtn.textContent = forgeMode === "fusion" ? "Select Two Parents" : "Select a Medallion";
    }
    if (el.forgeSelectedMedallion) el.forgeSelectedMedallion.setAttribute("hidden", "");
    if (el.forgeSelectedName) el.forgeSelectedName.textContent = forgeMode === "fusion" ? "Select two Gold-tier parents" : "Select a Medallion to unlock";
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

function encodeSaveCode() {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  } catch (error) {
    console.warn("GearBorn export failed:", error);
    return "";
  }
}

function decodeSaveCode(code) {
  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(String(code).trim()))));
    if (!parsed || typeof parsed !== "object" || !parsed.selectedCar) return null;
    return parsed;
  } catch {
    return null;
  }
}

function openExportSaveModal() {
  const code = encodeSaveCode();
  if (!code) {
    showToast("Export failed", "Could not generate a save code.");
    return;
  }
  el.saveTransferTitle.textContent = "Export Save";
  el.saveTransferCopy.textContent = "Copy this code somewhere safe. Paste it on any device to restore your garage.";
  el.saveTransferText.value = code;
  el.saveTransferText.readOnly = true;
  el.saveTransferCopyBtn.hidden = false;
  el.saveTransferImportBtn.hidden = true;
  el.saveTransferModal.hidden = false;
  el.saveTransferModal.classList.add("active");
  el.saveTransferModal.setAttribute("aria-hidden", "false");
}

function openImportSaveModal() {
  el.saveTransferTitle.textContent = "Import Save";
  el.saveTransferCopy.textContent = "Paste a save code below. This will replace your current progress.";
  el.saveTransferText.value = "";
  el.saveTransferText.readOnly = false;
  el.saveTransferCopyBtn.hidden = true;
  el.saveTransferImportBtn.hidden = false;
  el.saveTransferModal.hidden = false;
  el.saveTransferModal.classList.add("active");
  el.saveTransferModal.setAttribute("aria-hidden", "false");
  el.saveTransferText.focus();
}

function copySaveCode() {
  const code = el.saveTransferText.value;
  if (!code) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => showToast("Copied", "Save code copied to clipboard."))
      .catch(() => {
        el.saveTransferText.select();
        showToast("Copy manually", "Select the text and copy it.");
      });
  } else {
    el.saveTransferText.select();
    showToast("Copy manually", "Select the text and copy it.");
  }
}

function importSaveCode() {
  const parsed = decodeSaveCode(el.saveTransferText.value);
  if (!parsed) {
    showToast("Invalid code", "That save code could not be read.");
    return;
  }
  const migrated = migrateSave(parsed);
  state = mergeState(defaultState, migrated);
  sanitizeState();
  saveState();
  window.location.reload();
}

function closeSaveTransferModal() {
  el.saveTransferModal.hidden = true;
  el.saveTransferModal.classList.remove("active");
  el.saveTransferModal.setAttribute("aria-hidden", "true");
}

function resetRacingData() {
  gearbornStorageRemoveItem(saveKey);
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
  gasPaidGauntletKey = null;
  closeGasEmptyModal();
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
  el.godCodeError.classList.remove("success");
  renderDevCheatStatus();
  el.godModal.classList.add("active");
  el.godModal.setAttribute("aria-hidden", "false");
  el.godCode.focus();
}

function closeGodModal() {
  el.godModal.classList.remove("active");
  el.godModal.setAttribute("aria-hidden", "true");
  el.godCode.value = "";
  el.godCodeError.textContent = "";
  el.godCodeError.classList.remove("success");
}

function renderDevCheatStatus() {
  if (!el.godCheatStatus) return;
  el.godCheatStatus.innerHTML = Object.values(devCheatCodes).map((cheat) => `
    <span class="${state[cheat.stateKey] ? "active" : ""}">
      <strong>${escapeHtml(cheat.label)}</strong>
      <em>${state[cheat.stateKey] ? "Enabled" : "Off"}</em>
    </span>
  `).join("");
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
  const entered = el.godCode.value.trim();
  const godModePassword = getGodModePassword();
  if (godModePassword && entered === godModePassword) {
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
    return;
  }
  const cheat = devCheatCodes[entered.toUpperCase()];
  if (cheat) {
    state[cheat.stateKey] = !state[cheat.stateKey];
    saveState();
    render();
    renderSproxWallet();
    const enabled = state[cheat.stateKey];
    el.godCode.value = "";
    el.godCodeError.textContent = `${cheat.label}: ${enabled ? "Enabled" : "Disabled"}.`;
    el.godCodeError.classList.add("success");
    renderDevCheatStatus();
    showToast(cheat.label, enabled ? "Enabled" : "Disabled");
    el.godCode.focus();
    return;
  }
  el.godCodeError.classList.remove("success");
  el.godCodeError.textContent = "Incorrect code.";
  el.godCode.focus();
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
    el.dragTrack.classList.toggle("nitro-speed-lines", Boolean(race.nitroActive && effectsAllowed()));
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
    const tracks = JSON.parse(gearbornStorageGetItem(customTracksKey) || "[]");
    return Array.isArray(tracks) ? tracks : [];
  } catch {
    return [];
  }
}

function saveCustomTracks(tracks) {
  try {
    gearbornStorageSetItem(customTracksKey, JSON.stringify(tracks));
  } catch (err) {
    console.warn("GearBorn custom tracks save failed:", err);
  }
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
  if (view !== "crankvaults") stopCrankVaultResetTimer();
  if (view !== "dev-test") {
    stopDevTestSound();
    stopDevTestHonk();
  }
  closeGasEmptyModal();
  // Reset forge panel when navigating to garage, unless tutorial is opening The Forge
  if (view === "garage" && !(tutorialActive() && currentTutorialScene()?.id === "the-forge")) {
    if (el.forgePanel) el.forgePanel.hidden = true;
    if (el.garageContent) el.garageContent.hidden = false;
  }
  let activePanel = null;
  el.views.forEach((panel) => {
    const active = panel.id === `${view}-view`;
    panel.classList.toggle("active", active);
    panel.classList.remove("view-transition-enter");
    if (active) activePanel = panel;
  });
  if (activePanel && effectsAllowed()) {
    activePanel.classList.add("view-transition-enter");
    window.setTimeout(() => activePanel.classList.remove("view-transition-enter"), VIEW_TRANSITION_MS);
  }
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
  if (view === "tuner-page") renderTunerPage();
  if (view === "dev-test") {
    showDevTestScreen(devTestState.screen || "home");
    stopDevTestSound();
    stopDevTestHonk();
  }
  if (!["story", "play", "time-trial", "boss", "battle", "beta"].includes(view)) render();
}

function storyTunerReady() {
  return Boolean(state.tunerChosen && state.selectedTuner && state.tunerChoiceVersion >= tunerChoiceVersion);
}

function resolveTutorialSceneId(sceneId = "intro") {
  return tutorialSceneAliases[sceneId] || sceneId;
}

function tutorialSceneAllowed(scene) {
  return !scene?.characterOnly || scene.characterOnly === selectedTuner()?.id;
}

function nextTutorialSceneIndex(fromIndex) {
  for (let index = fromIndex + 1; index < tutorialScenes.length; index += 1) {
    if (tutorialSceneAllowed(tutorialScenes[index])) return index;
  }
  return tutorialScenes.length - 1;
}

function tutorialSceneIndex(sceneId = "intro") {
  const resolved = resolveTutorialSceneId(sceneId);
  const index = tutorialScenes.findIndex((scene) => scene.id === resolved);
  return index >= 0 ? index : 0;
}

function currentTutorialScene() {
  const scene = tutorialScenes[state.tutorialScene] || tutorialScenes[0];
  if (tutorialSceneAllowed(scene)) return scene;
  return tutorialScenes[nextTutorialSceneIndex((state.tutorialScene || 0) - 1)] || tutorialScenes[0];
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

function unlockHubName() {
  return activeUnlockHub() === "spindellLabs" ? "Spindell Labs" : "The Forge";
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

function startTutorial(sceneId = "intro", options = {}) {
  const resolvedSceneId = resolveTutorialSceneId(sceneId);
  const sceneIndex = tutorialSceneIndex(resolvedSceneId);
  if (!storyTunerReady()) {
    pendingIntroView = `tutorial:${resolvedSceneId}:${options.fullRunEligible ? "full" : "scene"}`;
    openTunerModal();
    return;
  }
  // Snapshot the real wallet BEFORE touching anything
  const realSprox = Math.max(0, Math.floor(state.sprox || 0));
  state.tutorialSnapshotUnlimitedSprox = Boolean(state.unlimitedSprox);
  state.unlimitedSprox = false;
  state.tutorialActive = true;
  state.tutorialComplete = false;
  state.tutorialFullRunEligible = Boolean(options.fullRunEligible && resolvedSceneId === "intro");
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

function finishTutorial(options = {}) {
  const completedFullRun = Boolean(options.completedFullRun && state.tutorialFullRunEligible);
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
  state.tutorialFullRunEligible = false;
  if (completedFullRun) state.tutorialFullRunCompleted = true;
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
  if (completedFullRun) checkAchievements();
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
    case "unlocked-cc":
    case "end":
    case "tyree-final":
    case "empty-garage":
    case "spindell-labs":
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
    case "medallion-sync":
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

function dialogueDensityForText(text = "") {
  const plain = String(text).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length > 300) return "dialogue-density-tiny";
  if (plain.length > 190) return "dialogue-density-compact";
  return "";
}

function setDialogueDensity(node, text = "") {
  if (!node) return;
  node.classList.remove("dialogue-density-compact", "dialogue-density-tiny");
  const density = dialogueDensityForText(text);
  if (density) node.classList.add(density);
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
  if (speaker === "auntie") return { name: "Auntie", image: "assets/characters/headshots/headshot-auntie.png" };
  if (speaker === "orion") return { name: "Orion Vincent", image: "assets/characters/headshots/headshot-orion-vincent.png" };
  if (speaker === "eli") return { name: "Eli", image: "assets/characters/headshots/headshot-eli.png" };
  if (speaker === "crosby") return { name: "Crosby Nash", image: "assets/characters/headshots/headshot-crosby.png" };
  if (speaker === "lynx") return { name: "Lynx Incarso", image: "assets/characters/headshots/headshot-lynx.png" };
  if (speaker === "revrend") return { name: "Rev-rend", image: bosses[0]?.headshot || bosses[0]?.portrait || "" };
  if (speaker === "roberto") return { name: "Roberto Yucca", image: "assets/characters/headshots/headshot-roberto-yucca.png" };
  if (speaker === "mentor") {
    const mentor = activeFactionMentor();
    return { ...mentor, image: mentor.headshot || mentor.image || "" };
  }
  if (speaker === "rival") {
    const rival = rivalCharacter();
    return { ...rival, image: rival.headshot || rival.image };
  }
  if (speaker === "narration") return { name: "Tutorial", image: "" };
  return { name: "Dr. Tyree", image: "assets/characters/headshots/headshot-dr-tyree.png" };
}

function tutorialSpecialLineMarkup(text) {
  if (text !== "TUTORIAL_PLACEHOLDER_MEDALLIONS_ACQUIRED" && text !== "MEDALLIONS_ACQUIRED") return "";
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
  if (speakerKey === "auntie") return "assets/characters/auntie.png";
  if (speakerKey === "orion") return "assets/characters/orion-vincent.png";
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
    "the-forge": ["user", "ashley", "auntie"],
    "medallion-unlock": ["user", "ashley", "auntie"],
    unlocked: ["user", "ashley", "auntie"],
    "spindell-labs": ["user", "orion", "tyree"],
    "medallion-sync": ["user", "orion"],
    "unlocked-cc": ["user", "orion"]
  };
  const speakers = [...(sceneSpeakers[scene.id] || ["user"])];
  if (["user", "rival", "tyree", "ashley", "auntie", "orion"].includes(line?.speaker) && !speakers.includes(line.speaker)) {
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
      setTutorialScene(selectedTuner()?.id === "cha-cha" ? "spindell-labs" : "ashley-intro");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "spindell-labs":
      setTutorialScene("medallion-sync");
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

    case "medallion-sync":
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

    case "unlocked-cc":
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
      finishTutorial({ completedFullRun: true });
      break;

    default:
      // Fallback: advance to next scene
      state.tutorialScene = nextTutorialSceneIndex(state.tutorialScene || 0);
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
  if (["the-forge", "medallion-sync", "medallion-unlock"].includes(scene.id) && state.tutorialAwaitingForge) {
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
    setDialogueDensity(el.tutorialCard, "");
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
  setDialogueDensity(el.tutorialCard, line.text);
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
  const runtimeLevel = campaignLevels[index];
  if (runtimeLevel?.cityStructureEvent) {
    const event = runtimeLevel.cityStructureEvent;
    const progress = cityProgressFor(event.cityId);
    const wasCompleted = Boolean(state.completedCampaignLevels[index]);
    state.completedCampaignLevels[index] = true;
    const cityIndex = storyCities.findIndex((city) => city.id === event.cityId);
    if (event.type === "story") {
      progress.storyRaces[event.index] = true;
    }
    if (event.type === "ladder") {
      if (placeholderLadderTierUnlocked(progress, event.modeId, event.tier)) {
        progress.ladders[event.modeId][event.tier] = true;
        if (!wasCompleted && event.tier === "gold" && !progress.vaultRewards[`ladder-${event.modeId}`]) {
          progress.vaultRewards[`ladder-${event.modeId}`] = true;
          addCrankVaultToInventory("sproxCommon", `${event.cityId} ${event.modeId} gold`);
        }
      }
    }
    if (cityIndex >= 0) {
      state.selectedStoryCity = cityIndex;
      state.selectedCampaign = firstPlayableStoryLevelForCity(cityIndex)?.campaignIndex ?? index;
    }
    if (!wasCompleted) maybeTriggerMedallionGauntlet(storyCities[cityIndex]);
    checkAchievements();
    saveState();
    return;
  }
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
  if (!wasCompleted && cityIndex >= 0 && completedLevel?.type === "boss") {
    const city = storyCities[cityIndex];
    const lineId = storyMedallionAssignments[city.id]?.boss;
    if (addAssignedCityRewardVault(city.id, "boss", lineId, `${city.id} Boss Race`)) {
      showToast("Boss Medallion CrankVault Earned", "Your first-time Boss win added a CrankVault to your inventory.");
    }
  }
  if (!wasCompleted && cityIndex >= 0 && completedLevel?.type === "pink-slip") {
    const city = storyCities[cityIndex];
    const lineId = storyMedallionAssignments[city.id]?.pinkSlip;
    if (addAssignedCityRewardVault(city.id, "pink-slip", lineId, `${city.id} Pink Slip`)) {
      showToast("Pink Slip Medallion CrankVault Earned", "Your first-time Pink Slip win added a CrankVault to your inventory.");
    }
  }
  if (!wasCompleted && featureEnabled("enableReputationAnimations") && completedLevel && !["boss", "pink-slip"].includes(completedLevel.type)) {
    playAudioCue("reputationGain");
    playSound("bond-up");
    showToast("REPUTATION_GAIN_PLACEHOLDER_TITLE", "REPUTATION_GAIN_PLACEHOLDER_BODY");
  }
  if (!wasCompleted && completedLevel && !["boss", "pink-slip"].includes(completedLevel.type) && cityIndex >= 0) {
    maybeTriggerMedallionGauntlet(storyCities[cityIndex]);
  }
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
  el.pinkSlipWarningCopy.textContent = `Pink Slip races risk your car and your parts. If you lose, your car will return to Level 1 and you will lose any equipped parts. Do you want to risk your car to earn the ${rewardName} Medallion CrankVault?`;
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

function startCampaignRace(index, level, gasPrepaid = false) {
  if (!gasPrepaid) {
    const city = storyCityForCampaignIndex(index) || storyCities[state.selectedStoryCity] || storyCities[0];
    requestRaceEntry({ kind: level?.type || "story", cityId: city.id, gasCostOverride: level?.gasCostOverride }, () => startCampaignRace(index, level, true));
    return;
  }
  closeStoryPreview();
  closeCitySelect();
  if (level.type === "rival") {
    startRivalCampaignRace(index, level);
    return;
  }
  if (level.type === "pink-slip") {
    startStory2dRace(index, level, true);
    return;
  }
  if (level.type === "drag") {
    mountCampaignRace("play");
    state.selectedCar = state.selectedStoryCar;
    state.selectedDistance = index === 0 ? 400 : 800;
    saveState();
    render();
    prepareDragRace(index, level.drag);
    if (pendingDragRace) pendingDragRace.gasPrepaid = true;
    return;
  }
  if (level.type === "trial" || level.type === "circuit") {
    startStory2dRace(index, level, true);
    return;
  }
  if (level.type === "battle") {
    if (level.cityStructureEvent?.type === "story" && level.opponentLineId) {
      const opponentCar = cars.find((car) => car.id === level.opponentLineId);
      const opponentForm = opponentCar?.evolutions?.[0];
      mountCampaignRace("battle");
      state.selectedBattleBoss = bosses[level.bossIndex]?.id || bosses[0]?.id;
      saveState();
      render();
      beginBattle("campaign-battle", {
        boss: { ...(bosses[level.bossIndex] || bosses[0]), car: level.opponentName || opponentForm?.name || "Opponent" },
        campaignLevelIndex: index,
        opponentStats: displayedGearbornStatsAtLevel(level.opponentLineId, Math.max(1, cityDifficultyForCampaignIndex(index)?.opponentLevel || 1)),
        opponentImage: opponentForm ? imageFor(opponentForm, "race") : "",
        opponentName: level.opponentName || opponentForm?.name || "Opponent",
        opponentCarId: level.opponentLineId,
        reward: level.xp
      });
      return;
    }
    const boss = bosses[level.bossIndex];
    mountCampaignRace("battle");
    state.selectedBattleBoss = boss.id;
    saveState();
    render();
    beginBattle("campaign-battle", { boss, campaignLevelIndex: index });
    return;
  }
  startStory2dRace(index, level, true);
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
    if (pendingDragRace) pendingDragRace.gasPrepaid = true;
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
  startStory2dRace(index, level, true);
}

function startStory2dRace(index, level, gasPrepaid = false) {
  if (!gasPrepaid) {
    const city = storyCityForCampaignIndex(index) || storyCities[state.selectedStoryCity] || storyCities[0];
    requestRaceEntry({ kind: level?.type || "story", cityId: city.id, gasCostOverride: level?.gasCostOverride }, () => startStory2dRace(index, level, true));
    return;
  }
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

function openStoryPlaceholderScene(sceneKey, onContinue) {
  const lines = storyDialogue[sceneKey] || [];
  if (!sceneKey || !lines.length) {
    onContinue?.();
    return;
  }
  let lineIndex = 0;
  const modal = document.createElement("div");
  modal.className = "rival-dialog story-placeholder-dialog";
  const renderLine = () => {
    const line = lines[lineIndex] || lines[0];
    const profile = tutorialSpeakerProfile(line.speaker);
    modal.innerHTML = `
      <div class="rival-dialog-card">
        <button class="modal-close" type="button" aria-label="Close story scene">×</button>
        <div class="selection-preview-art">${characterMarkup({ name: profile.name, image: profile.image })}</div>
        <h2>${escapeHtml(profile.name || "Story Scene")}</h2>
        <p>${escapeHtml(line.text || "...")}</p>
        <button class="primary" type="button">${lineIndex >= lines.length - 1 ? "Continue" : "Next"}</button>
      </div>
    `;
    modal.querySelector(".modal-close").addEventListener("click", close);
    modal.querySelector(".primary").addEventListener("click", advance);
  };
  const close = () => {
    modal.remove();
    onContinue?.();
  };
  const advance = () => {
    if (lineIndex < lines.length - 1) {
      lineIndex += 1;
      renderLine();
      return;
    }
    close();
  };
  renderLine();
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("active"));
}

function finishRuntimeStoryWithPost(level, onContinue) {
  const sceneKey = level?.cityStructureEvent?.scenePost;
  if (sceneKey) openStoryPlaceholderScene(sceneKey, onContinue);
  else onContinue?.();
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
  setDialogueDensity(el.cutsceneModal, line.text);
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
      const [, sceneId = "intro", mode = "scene"] = pendingIntroView.split(":");
      pendingIntroView = null;
      startTutorial(sceneId, { fullRunEligible: mode === "full" });
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

function retryStandaloneVerticalRace(raceState) {
  if (raceState.mode === "boss") {
    requestRaceEntry({ kind: "boss", cityId: raceState.bossData?.track?.id }, () => beginVerticalRace("boss", true, { boss: raceState.bossData }));
    return;
  }
  requestRaceEntry({ kind: "time" }, () => beginVerticalRace("time", true, { track: storyTracks.find((track) => track.id === raceState.trackId) }));
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
    if (raceState.mode === "campaign-rival") {
      recordTunerStat(resultWon ? "headToHeadWon" : "headToHeadLost");
    }
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
    recordTunerStat("timeTrialsCompleted");
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
      retryStandaloneVerticalRace(raceState);
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
  recordRaceUsage(raceState.carId);
  if (raceState.mode === "campaign-rival") recordTunerStat("headToHeadLost");
  else if (raceState.mode === "time" || raceState.mode === "campaign-time" || raceState.mode === "tutorial-time") recordTunerStat("timeTrialsCompleted");
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
      retryStandaloneVerticalRace(raceState);
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
