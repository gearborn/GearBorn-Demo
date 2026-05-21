// ─── STATE PERSISTENCE & STARTUP ────────────────────────────────────────────
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(saveKey));
    return saved ? mergeState(defaultState, saved) : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function mergeState(base, saved) {
  return {
    ...structuredClone(base),
    ...saved,
    settings: { ...base.settings, ...saved.settings },
    timeTrials: { ...base.timeTrials, ...saved.timeTrials },
    storyTimeTrials: { ...base.storyTimeTrials, ...saved.storyTimeTrials },
    betaTimeTrials: { ...base.betaTimeTrials, ...saved.betaTimeTrials },
    completedCampaignLevels: { ...base.completedCampaignLevels, ...saved.completedCampaignLevels },
    raceMedals: { ...base.raceMedals, ...saved.raceMedals },
    microObjectiveProgress: { ...base.microObjectiveProgress, ...saved.microObjectiveProgress },
    visitedStoryCities: { ...base.visitedStoryCities, ...saved.visitedStoryCities },
    bond: { ...base.bond, ...saved.bond },
    partsInventory: { ...base.partsInventory, ...saved.partsInventory },
    equippedParts: { ...base.equippedParts, ...saved.equippedParts },
    achievements: { ...base.achievements, ...saved.achievements },
    garage: { ...base.garage, ...saved.garage }
  };
}

function saveState() {
  localStorage.setItem(saveKey, JSON.stringify(state));
}

function sanitizeState() {
  state.sprox = Number.isFinite(Number(state.sprox)) ? Math.max(0, Math.floor(Number(state.sprox))) : 0;
  state.unlimitedSprox = Boolean(state.unlimitedSprox);
  state.unlockedCars = state.unlockedCars || {};
  state.bond = state.bond && typeof state.bond === "object" ? state.bond : {};
  state.partsInventory = state.partsInventory && typeof state.partsInventory === "object" ? state.partsInventory : {};
  state.equippedParts = state.equippedParts && typeof state.equippedParts === "object" ? state.equippedParts : {};
  state.achievements = state.achievements && typeof state.achievements === "object" ? state.achievements : {};
  state.raceMedals = state.raceMedals && typeof state.raceMedals === "object" ? state.raceMedals : {};
  state.microObjectiveProgress = state.microObjectiveProgress && typeof state.microObjectiveProgress === "object" ? state.microObjectiveProgress : {};
  state.visitedStoryCities = state.visitedStoryCities && typeof state.visitedStoryCities === "object" ? state.visitedStoryCities : {};
  state.winStreak = Math.max(0, Math.floor(Number(state.winStreak) || 0));
  const artVanFormCount = cars.find((car) => car.id === "art-van")?.evolutions.length || 0;
  state.unlockedArtVanForms = Array.isArray(state.unlockedArtVanForms)
    ? state.unlockedArtVanForms.map(Number).filter((index, pos, list) => index >= 0 && index < artVanFormCount && list.indexOf(index) === pos)
    : [];
  achievementDefs.forEach((achievement) => {
    state.achievements[achievement.id] = {
      complete: Boolean(state.achievements[achievement.id]?.complete),
      granted: Boolean(state.achievements[achievement.id]?.granted)
    };
  });
  Object.keys(state.achievements).forEach((id) => {
    if (!achievementDefs.some((achievement) => achievement.id === id)) delete state.achievements[id];
  });
  if (!achievementDefs.some((achievement) => achievement.id === state.selectedAchievement)) state.selectedAchievement = achievementDefs[0].id;
  partVariants.forEach((part) => {
    state.partsInventory[part.key] = Math.max(0, Math.floor(Number(state.partsInventory[part.key]) || 0));
  });
  Object.keys(state.partsInventory).forEach((key) => {
    if (!partVariants.some((part) => part.key === key)) delete state.partsInventory[key];
  });
  state.unlockedLines = Array.isArray(state.unlockedLines) ? state.unlockedLines : [...defaultUnlockedLines];
  defaultUnlockedLines.forEach((carId) => {
    if (!state.unlockedLines.includes(carId)) state.unlockedLines.push(carId);
  });
  Object.entries(state.unlockedCars).forEach(([carId, unlocked]) => {
    if (unlocked && !state.unlockedLines.includes(carId)) state.unlockedLines.push(carId);
  });
  const legacyGodModeActive = Boolean(
    state.unlockedCars?.rainbowlt &&
    state.garage?.rainbowlt?.level >= maxCarLevel &&
    state.garage?.rainbowlt?.evolution >= (cars.find((car) => car.id === "rainbowlt")?.evolutions.length || 1) - 1
  );
  if (legacyGodModeActive) {
    state.unlimitedSprox = true;
  }
  if (state.unlimitedSprox) {
    state.unlockedLines = cars.map((car) => car.id);
    state.completedCampaignLevels = Object.fromEntries(campaignLevels.map((_, index) => [index, true]));
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
  }
  state.unlockedLines = state.unlockedLines.filter((carId, index, list) => cars.some((car) => car.id === carId) && list.indexOf(carId) === index);
  if (state.unlockedLines.includes("art-van") && !state.unlockedArtVanForms.length) state.unlockedArtVanForms.push(0);
  state.unlockedCars = Object.fromEntries(state.unlockedLines.map((carId) => [carId, true]));
  state.timeTrials = state.timeTrials || {};
  state.storyTimeTrials = state.storyTimeTrials || {};
  state.betaTimeTrials = state.betaTimeTrials && typeof state.betaTimeTrials === "object" ? state.betaTimeTrials : {};
  if (!["all", "owned", "seen"].includes(state.vindexFilter)) state.vindexFilter = "all";
  state.settings.verticalKeys = {
    ...defaultState.settings.verticalKeys,
    ...(state.settings.verticalKeys || {})
  };
  if (allPlayableFinalFormsUnlocked() && !state.unlockedLines.includes("rainbowlt")) {
    state.unlockedLines.push("rainbowlt");
    state.unlockedCars.rainbowlt = true;
  }
  if (!cars.some((car) => car.id === state.selectedCar)) {
    state.selectedCar = cars[0].id;
  }
  if (!isCarUnlocked(state.selectedCar)) {
    state.selectedCar = cars[0].id;
  }
  if (!ranks.some((rank) => rank.key === state.selectedRank)) {
    state.selectedRank = ranks[0].key;
  }
  state.highestRankIndex = Math.min(state.highestRankIndex || 0, ranks.length - 1);
  if (ranks.findIndex((rank) => rank.key === state.selectedRank) > state.highestRankIndex) {
    state.selectedRank = ranks[state.highestRankIndex].key;
  }
  if (!distances.some((distance) => distance.meters === state.selectedDistance)) {
    state.selectedDistance = distances[0].meters;
  }
  if (!bossChallengeBosses.some((boss) => boss.id === state.selectedBoss)) state.selectedBoss = bossChallengeBosses[0].id;
  if (!bossChallengeBosses.some((boss) => boss.id === state.selectedBattleBoss)) state.selectedBattleBoss = bossChallengeBosses[0].id;
  state.highestBossIndex = Math.min(state.highestBossIndex || 0, bossChallengeBosses.length - 1);
  state.highestCampaignIndex = Math.min(state.highestCampaignIndex || 0, campaignLevels.length - 1);
  state.selectedCampaign = Math.min(state.selectedCampaign || 0, state.highestCampaignIndex);
  state.completedCampaignLevels = state.completedCampaignLevels || {};
  Object.keys(state.raceMedals).forEach((eventId) => {
    const medal = getBestMedalForEvent(eventId);
    if (medal === "none") delete state.raceMedals[eventId];
    else state.raceMedals[eventId] = { medal, updatedAt: Number(state.raceMedals[eventId]?.updatedAt) || Date.now() };
  });
  state.selectedStoryCity = Math.max(0, Math.min(Number(state.selectedStoryCity) || 0, storyCities.length - 1));
  if (!storyCityUnlocked(state.selectedStoryCity)) {
    state.selectedStoryCity = Math.max(0, highestUnlockedStoryCityIndex());
  }
  if (bossChallengeBosses.findIndex((boss) => boss.id === state.selectedBoss) > state.highestBossIndex) {
    state.selectedBoss = bossChallengeBosses[state.highestBossIndex].id;
  }
  if (bossChallengeBosses.findIndex((boss) => boss.id === state.selectedBattleBoss) > state.highestBossIndex) {
    state.selectedBattleBoss = bossChallengeBosses[state.highestBossIndex].id;
  }
  if (!storyTracks.some((track) => track.id === state.selectedTimeTrack)) state.selectedTimeTrack = storyTracks[0].id;
  if (!vindexEntries.some((entry) => entry.number === state.selectedVindex)) state.selectedVindex = vindexEntries[0].number;
  if (!racerProfiles.some((profile) => profile.id === state.selectedProfile)) state.selectedProfile = racerProfiles[0].id;
  state.racerAlphaProfileView = state.racerAlphaProfileView === "unmasked" ? "unmasked" : "masked";
  if (!state.racerAlphaUnmasked) state.racerAlphaProfileView = "masked";
  if (state.selectedTuner && !tuners.some((tuner) => tuner.id === state.selectedTuner)) state.selectedTuner = null;
  state.tunerChoiceVersion = state.tunerChoiceVersion || 0;
  state.tutorialComplete = Boolean(state.tutorialComplete);
  state.tutorialActive = Boolean(state.tutorialActive);
  state.tutorialScene = Math.max(0, Math.min(Number(state.tutorialScene) || 0, tutorialScenes.length - 1));
  state.tutorialLine = Math.max(0, Number(state.tutorialLine) || 0);
  state.tutorialDragSprox = Math.max(0, Math.floor(Number(state.tutorialDragSprox) || 0));
  state.tutorialTimeMedal = typeof state.tutorialTimeMedal === "string" ? state.tutorialTimeMedal : "";
  state.tutorialChoiceResponse = state.tutorialChoiceResponse && typeof state.tutorialChoiceResponse === "object" ? state.tutorialChoiceResponse : null;
  state.tutorialSplash = typeof state.tutorialSplash === "string" ? state.tutorialSplash : "";
  state.tutorialAwaitingUpgrade = Boolean(state.tutorialAwaitingUpgrade);
  state.tutorialAwaitingEvolve = Boolean(state.tutorialAwaitingEvolve);
  state.tutorialAwaitingForge = Boolean(state.tutorialAwaitingForge);
  state.tutorialStartingSprox = Math.max(0, Math.floor(Number(state.tutorialStartingSprox) || 0));
  state.playerGauntletProgress = state.playerGauntletProgress && typeof state.playerGauntletProgress === "object" ? state.playerGauntletProgress : {};
  state.activeGauntlet = state.activeGauntlet && typeof state.activeGauntlet === "object" ? state.activeGauntlet : null;
  state.consecutiveLosses = Math.max(0, Math.floor(Number(state.consecutiveLosses) || 0));
  state.garbageMedallionAwarded = Boolean(state.garbageMedallionAwarded);
  // Tutorial cannot survive a page reload — always restore pre-tutorial state from snapshots
  // and force tutorialActive=false. The tutorial will restart from intro if replayed.
  if (state.tutorialActive) {
    if (!state.unlimitedSprox && state.tutorialStartingSprox >= 0) {
      state.sprox = state.tutorialStartingSprox;
    }
    if (state.tutorialSnapshotGarage) {
      state.garage = JSON.parse(JSON.stringify(state.tutorialSnapshotGarage));
    }
    if (state.tutorialSnapshotUnlockedLines) {
      state.unlockedLines = [...state.tutorialSnapshotUnlockedLines];
    }
    if (state.tutorialSnapshotMedallions) {
      state.medallionsOwned = [...state.tutorialSnapshotMedallions];
    }
    // Restore tutorialComplete from snapshot so a mid-tutorial reload doesn't
    // cause the first-time modal to reappear for players who already finished it
    if (typeof state.tutorialSnapshotComplete === "boolean") {
      state.tutorialComplete = state.tutorialSnapshotComplete;
    }
    if (typeof state.tutorialSnapshotUnlimitedSprox === "boolean") {
      state.unlimitedSprox = state.tutorialSnapshotUnlimitedSprox;
    }
    // Reset all tutorial state so the game loads normally
    state.tutorialActive = false;
    state.tutorialScene = 0;
    state.tutorialLine = 0;
    state.tutorialAwaitingUpgrade = false;
    state.tutorialAwaitingEvolve = false;
    state.tutorialAwaitingForge = false;
    state.tutorialSplash = "";
    state.tutorialStartingSprox = 0;
    state.tutorialSnapshotGarage = null;
    state.tutorialSnapshotUnlockedLines = null;
    state.tutorialSnapshotMedallions = null;
    state.tutorialSnapshotComplete = null;
    state.tutorialSnapshotUnlimitedSprox = null;
  }
  state.storyCarChosen = Boolean(state.storyCarChosen);
  if (!cars.some((car) => car.id === state.selectedStoryCar) || !isCarUnlocked(state.selectedStoryCar)) state.selectedStoryCar = cars[0].id;
  if (!cars.some((car) => car.id === state.selectedTimeCar) || !isCarUnlocked(state.selectedTimeCar)) state.selectedTimeCar = cars[0].id;
  cars.forEach((car) => {
    const bond = state.bond[car.id] || {};
    state.bond[car.id] = {
      races: Math.max(0, Math.floor(Number(bond.races) || 0)),
      milestones: Array.isArray(bond.milestones) ? bond.milestones.filter((value, index, list) => [5, 10, 20].includes(Number(value)) && list.indexOf(value) === index).map(Number) : []
    };
    state.equippedParts[car.id] = Array.isArray(state.equippedParts[car.id])
      ? state.equippedParts[car.id].slice(0, 2).map((key) => partVariants.some((part) => part.key === key) ? key : null)
      : [null, null];
    while (state.equippedParts[car.id].length < 2) state.equippedParts[car.id].push(null);
    state.garage[car.id] = state.garage[car.id] || { level: 1, xp: 0, evolution: 0, pendingEvolution: null };
    if (!state.unlimitedSprox && state.garage[car.id].xp > 0) {
      state.sprox += Math.max(0, Math.floor(state.garage[car.id].xp));
    }
    state.garage[car.id].xp = 0;
    state.garage[car.id].level = Math.min(maxCarLevel, state.garage[car.id].level || 1);
    state.garage[car.id].pendingEvolution = state.garage[car.id].pendingEvolution ?? null;
    state.garage[car.id].evolution = Math.min(state.garage[car.id].evolution || 0, car.evolutions.length - 1);
    state.garage[car.id].unlockedEvolution = Math.min(
      state.garage[car.id].unlockedEvolution ?? state.garage[car.id].evolution,
      car.evolutions.length - 1
    );
    state.garage[car.id].evolution = Math.min(state.garage[car.id].evolution, state.garage[car.id].unlockedEvolution);
    const eligibleEvolution = maxEligibleEvolutionForCar(car.id, state.garage[car.id].level);
    if (eligibleEvolution > state.garage[car.id].unlockedEvolution) {
      state.garage[car.id].pendingEvolution = state.garage[car.id].pendingEvolution || state.garage[car.id].unlockedEvolution + 1;
    }
  });
  Object.keys(state.garage).forEach((carId) => {
    if (!cars.some((car) => car.id === carId)) {
      delete state.garage[carId];
    }
  });
  Object.keys(state.bond).forEach((carId) => {
    if (!cars.some((car) => car.id === carId)) delete state.bond[carId];
  });
  Object.keys(state.equippedParts).forEach((carId) => {
    if (!cars.some((car) => car.id === carId)) delete state.equippedParts[carId];
  });
}

let state = loadState();
sanitizeState();

// ─── FORGE EVENT LISTENERS ───────────────────────────────────────────────────
document.querySelector("#forge-back-btn")?.addEventListener("click", closeForge);

document.querySelector("#forge-inventory-btn")?.addEventListener("click", () => {
  const panel = el.forgeInventoryPanel;
  if (!panel) return;
  const isOpen = !panel.hasAttribute("hidden");
  if (isOpen) panel.setAttribute("hidden", "");
  else panel.removeAttribute("hidden");
  renderForgeInventory();
});

document.querySelector("#forge-medallion-grid")?.addEventListener("click", (e) => {
  const tile = e.target.closest("[data-forge-car]");
  if (tile) selectForgeMedallion(tile.dataset.forgeCar);
});

document.querySelector("#forge-unlock-btn")?.addEventListener("click", () => {
  if (tutorialActive() && currentTutorialScene()?.id === "the-forge") {
    setTutorialScene("medallion-unlock");
    state.tutorialAwaitingForge = true;
    saveState();
  }
  if (forgeSelectedCarId && !forgeAnimating) {
    playAudioCue("uiConfirm");
    runForgeAnimation(forgeSelectedCarId);
  }
});

document.querySelector("#forge-card-btn")?.addEventListener("click", () => {
  openForge();
});

if (beta3dDevEnabled()) document.body.classList.add("beta-dev-enabled");

document.addEventListener("click", (event) => {
  if (event.target.closest("button, [role='button'], .menu-card, .story-map-node, .vindex-button, .garage-card")) {
    playAudioCue("uiSelect");
  }
});

const loadingExperience = startLoadingExperience();
checkAchievements(true);
saveState();
render();
if (beta3dDevEnabled()) showView("beta");
// Only show first-time modal if truly a new player: no tutorial complete flag,
// no story progress, no sprox earned, and no unlocked cars beyond the defaults.
const hasAnyProgress = state.tutorialComplete
  || state.sprox > 0
  || state.highestCampaignIndex > 0
  || Object.keys(state.completedCampaignLevels || {}).length > 0
  || (state.unlockedLines || []).some((id) => !defaultUnlockedLines.includes(id));
if (!beta3dDevEnabled() && !hasAnyProgress && !state.tutorialActive) {
  openFirstTutorialModal();
} else if (!beta3dDevEnabled() && state.tutorialActive) {
  setupTutorialScene();
}

const finishInitialLoad = () => loadingExperience.complete();
if (document.readyState === "complete") {
  window.setTimeout(finishInitialLoad, 450);
} else {
  window.addEventListener("load", () => window.setTimeout(finishInitialLoad, 450), { once: true });
}
