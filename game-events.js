// ─── EVENT LISTENERS & BUILDER UTILITIES ────────────────────────────────────
document.querySelectorAll("[data-steer]").forEach((button) => {
  const direction = button.dataset.steer;
  const press = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    setSteer(direction, true);
  };
  const release = (event) => {
    event.preventDefault();
    if (button.hasPointerCapture?.(event.pointerId)) {
      button.releasePointerCapture(event.pointerId);
    }
    setSteer(direction, false);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.view === "beta") {
      betaRaceContext = { source: "prototype" };
      showView("beta");
      openBetaPrototypeIntro();
      return;
    }
    showView(button.dataset.view);
  });
});

document.querySelectorAll("[data-training-2d]").forEach((button) => {
  button.addEventListener("click", () => {
    const trainingMode = button.getAttribute("data-training-2d");
    betaRaceContext = { source: "training" };
    betaPreviewOpponents = [];
    showView("beta");
    if (trainingMode === "time") {
      el.betaMode?.classList.remove("vs-only", "prototype-only");
      el.betaMode?.classList.add("no-3d");
      openBetaPreview("time", false);
    } else {
      openBetaVsIntro();
    }
  });
});

document.querySelectorAll("[data-flow-next]").forEach((button) => {
  button.addEventListener("click", () => {
    const [mode, step] = button.dataset.flowNext.split(":");
    if (mode === "story" && step === "next") {
      state.storyCarChosen = true;
      saveState();
    }
    setFlowStep(mode, step);
  });
});

document.querySelectorAll("[data-mode-back]").forEach((button) => {
  button.addEventListener("click", () => backFromMode(button.dataset.modeBack));
});

document.addEventListener("click", (event) => {
  const carButton = event.target.closest("[data-car-target][data-car-id]");
  if (!carButton) return;
  setSelectedCarForMode(carButton.dataset.carTarget, carButton.dataset.carId);
});

document.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-car-select-evolution-step]");
  if (!stepButton) return;
  const [carId, direction] = stepButton.dataset.carSelectEvolutionStep.split(":");
  changeGarageEvolution(carId, direction);
});

document.addEventListener("pointerdown", (event) => {
  const wheelButton = event.target.closest("[data-honk-button]");
  if (wheelButton) {
    event.preventDefault();
    if (!honkCurrentRaceCar()) playGearbornHonk(selectedCarIdForMode("drag"));
    wheelButton.classList.add("playing");
    window.setTimeout(() => wheelButton.classList.remove("playing"), 180);
  }
});

document.addEventListener("click", (event) => {
  const wheelButton = event.target.closest("[data-honk-button]");
  if (wheelButton) {
    event.preventDefault();
    return;
  }
  const garageHonk = event.target.closest("[data-honk-car]");
  if (garageHonk) {
    event.preventDefault();
    playGearbornHonk(garageHonk.dataset.honkCar);
    garageHonk.classList.add("playing");
    window.setTimeout(() => garageHonk.classList.remove("playing"), 180);
    return;
  }
  const vindexHonk = event.target.closest("[data-honk-vindex]");
  if (vindexHonk) {
    event.preventDefault();
    playVindexEntryHonk(vindexHonk.dataset.honkVindex);
    vindexHonk.classList.add("playing");
    window.setTimeout(() => vindexHonk.classList.remove("playing"), 180);
  }
});

// Beta car select screen
el.betaCarSelectConfirm?.addEventListener("click", () => {
  betaReturningToPreview = false;
  openBetaPreview(betaPendingMode || "time", true);
});
el.betaCarSelectBack?.addEventListener("click", closeBetaCarSelect);

el.playerCar.addEventListener("change", (event) => {
  setSelectedCarForMode("drag", event.target.value);
});

el.storyCar.addEventListener("change", (event) => {
  setSelectedCarForMode("boss", event.target.value);
});

el.campaignCar?.addEventListener("change", (event) => {
  setSelectedCarForMode("story", event.target.value);
});

el.timeCar.addEventListener("change", (event) => {
  setSelectedCarForMode("time", event.target.value);
});

el.timeTrack.addEventListener("change", (event) => {
  state.selectedTimeTrack = event.target.value;
  saveState();
  render();
});

el.timeTrackGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-time-track]");
  if (!button) return;
  state.selectedTimeTrack = button.dataset.timeTrack;
  saveState();
  render();
});

el.distanceOptions.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-distance]");
  if (!button) return;
  state.selectedDistance = Number(button.dataset.distance);
  saveState();
  render();
});

el.opponentList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-rank]");
  if (!button || button.disabled) return;
  state.selectedRank = button.dataset.rank;
  saveState();
  render();
});

el.startRace.addEventListener("click", startRace);
el.dragMapStart.addEventListener("click", startPendingDragRace);
el.shiftButton.addEventListener("click", shift);
el.nitroButton.addEventListener("click", useNitro);
el.startCampaign.addEventListener("click", () => {
  if (tutorialActive()) {
    // Tutorial dialogue controls the flow — Start Level just calls advanceTutorial
    advanceTutorial();
    return;
  }
  startCampaignLevel();
});
el.changeStoryCar.addEventListener("click", () => { if (!tutorialActive()) setFlowStep("story", "car"); });
el.storyCitySelect.addEventListener("click", () => { if (!tutorialActive()) openCitySelect(); });
el.closeStoryPreview.addEventListener("click", closeStoryPreview);
el.closeCitySelect.addEventListener("click", closeCitySelect);
el.storyMapStage.addEventListener("click", (event) => {
  if (tutorialActive()) {
    const tutorialButton = event.target.closest("[data-tutorial-level]");
    if (!tutorialButton || tutorialButton.disabled) return;
  const sceneByLevel = {
    drag: "drag-race-intro",
    head2head: "head2head-intro",
    battle: "battle-intro"
  };
    const nextScene = sceneByLevel[tutorialButton.dataset.tutorialLevel];
    if (!nextScene) return;
    setTutorialScene(nextScene);
    setupTutorialScene();
    saveState();
    renderTutorial();
    return;
  }
  const gauntletButton = event.target.closest("[data-gauntlet-city]");
  if (gauntletButton && !gauntletButton.disabled) {
    startMedallionGauntlet(gauntletButton.dataset.gauntletCity);
    return;
  }
  const button = event.target.closest("[data-story-level]");
  if (!button || button.disabled) return;
  openStoryPreview(Number(button.dataset.storyLevel));
});
el.storyCityGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-story-city]");
  if (!button || button.disabled) return;
  selectStoryCity(Number(button.dataset.storyCity));
});
el.startStory.addEventListener("click", () => openBossIntro());
el.startBattle.addEventListener("click", () => {
  if (tutorialActive() && currentTutorialScene().id === "battle") {
    setTutorialScene("battle");
    setupTutorialScene();
    saveState();
    return;
  }
  beginBattle("battle");
});
el.battleList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-battle-boss]");
  if (!button || button.disabled) return;
  if (tutorialActive() && button.dataset.battleBoss === "tutorial-tutorque") return;
  state.selectedBattleBoss = button.dataset.battleBoss;
  saveState();
  render();
});
el.battleActions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-battle-move]");
  if (!button || button.disabled) return;
  handleBattleMove(button.dataset.battleMove);
});
el.battleNextTurn.addEventListener("click", nextBattleTurn);
el.continueBoss.addEventListener("click", () => {
  closeBossIntro();
  const startConfig = pendingBossRaceStart || { mode: "boss", options: {} };
  pendingBossRaceStart = null;
  modeFlow.boss = "race";
  renderFlowScreens();
  beginVerticalRace(startConfig.mode, true, startConfig.options || {});
});
el.closeBoss?.addEventListener("click", closeBossIntro);
el.unmaskButton.addEventListener("click", unmaskRacerAlpha);
el.continueUnmask.addEventListener("click", closeRacerAlphaUnmask);
el.backCutscene.addEventListener("click", rewindCutscene);
el.continueCutscene.addEventListener("click", advanceCutscene);
el.skipCutscene.addEventListener("click", closeStoryCutsceneAndStart);
el.closeCutscene?.addEventListener("click", closeStoryCutsceneAndStart);
el.startTimeTrial.addEventListener("click", () => {
  if (tutorialActive() && currentTutorialScene().id === "head2head") {
    startTutorialHeadToHeadRace();
    setTutorialScene("head2head-win");
    saveState();
    renderTutorial();
    return;
  }
  modeFlow.time = "race";
  renderFlowScreens();
  beginVerticalRace("time", true);
});
el.storyMapStart.addEventListener("click", startVerticalCountdown);
el.timeMapStart.addEventListener("click", startVerticalCountdown);

el.bossList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-boss]");
  if (!button) return;
  state.selectedBoss = button.dataset.boss;
  saveState();
  render();
});

el.campaignList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-campaign]");
  if (!button || button.disabled) return;
  openStoryPreview(Number(button.dataset.campaign));
});

el.vindexList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vindex]");
  if (!button) return;
  state.selectedVindex = button.dataset.vindex;
  saveState();
  renderVindex();
});

el.vindexFilterButtons?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vindex-filter]");
  if (!button) return;
  state.vindexFilter = button.dataset.vindexFilter;
  saveState();
  renderVindex();
});

el.profileList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-profile]");
  if (!button) return;
  state.selectedProfile = button.dataset.profile;
  saveState();
  renderProfiles();
});

el.profileArt.addEventListener("click", (event) => {
  const alphaButton = event.target.closest("[data-alpha-view]");
  if (!alphaButton) return;
  state.racerAlphaProfileView = alphaButton.dataset.alphaView;
  saveState();
  renderProfiles();
});

el.achievementList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-achievement]");
  if (!button) return;
  state.selectedAchievement = button.dataset.achievement;
  saveState();
  renderAchievements();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tuner]");
  if (!button) return;
  selectTuner(button.dataset.tuner);
});

el.garageGrid.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-evolution-step]");
  if (stepButton) {
    const [carId, direction] = stepButton.dataset.evolutionStep.split(":");
    changeGarageEvolution(carId, direction);
    return;
  }
  const upgradeButton = event.target.closest("[data-upgrade-car]");
  if (upgradeButton) {
    openUpgradeModal(upgradeButton.dataset.upgradeCar);
    return;
  }
  const button = event.target.closest("[data-evolve-car]");
  if (!button) return;
  showPendingEvolution(button.dataset.evolveCar);
});

el.confirmUpgrade.addEventListener("click", upgradeCarLevel);
el.closeUpgrade.addEventListener("click", closeUpgradeModal);
el.upgradeModal.addEventListener("click", (event) => {
  if (event.target === el.upgradeModal) {
    closeUpgradeModal();
    return;
  }
  const slotButton = event.target.closest("[data-part-slot]");
  if (slotButton && upgradeModalCarId) openEquipPartModal(upgradeModalCarId, Number(slotButton.dataset.partSlot));
});
el.openInventory?.addEventListener("click", openInventoryModal);
el.closeInventory?.addEventListener("click", closeInventoryModal);
el.inventoryModal?.addEventListener("click", (event) => {
  if (event.target === el.inventoryModal) closeInventoryModal();
  const tile = event.target.closest("[data-part-key]");
  if (!tile || !el.inventoryModal.contains(tile)) return;
  selectedInventoryPartKey = tile.dataset.partKey;
  renderInventoryModal();
});
el.closeEquipPart?.addEventListener("click", closeEquipPartModal);
el.equipPartModal?.addEventListener("click", (event) => {
  if (event.target === el.equipPartModal) closeEquipPartModal();
  const tile = event.target.closest("[data-part-key]");
  if (!tile || !el.equipPartModal.contains(tile)) return;
  equipPartContext.selectedKey = tile.dataset.partKey;
  renderEquipPartModal();
});
el.confirmEquipPart?.addEventListener("click", equipSelectedPart);
el.unequipPart?.addEventListener("click", unequipSelectedPart);
el.replacePart?.addEventListener("click", () => {
  if (!equipPartContext) return;
  equipPartContext.selectedKey = null;
  renderEquipPartModal();
});

el.evolveButton.addEventListener("click", async () => {
  if (!evolutionModal || evolutionAnimationActive) return;
  const tutorialEvolving = tutorialActive() && currentTutorialScene().id === "evolve" && evolutionModal.carId === tutorialCarId;
  const carId = evolutionModal.carId;
  const evolutionIndex = evolutionModal.evolution;
  el.evolveButton.hidden = true;
  el.closeEvolution.hidden = true;
  el.evolutionModal.classList.remove("active");
  el.evolutionModal.setAttribute("aria-hidden", "true");
  await playEvolutionAnimation(carId, evolutionIndex, () => {
    revealEvolution(carId, evolutionIndex);
    state.garage[carId].evolution = evolutionIndex;
    state.garage[carId].unlockedEvolution = Math.max(state.garage[carId].unlockedEvolution ?? 0, evolutionIndex);
    saveState();
    // Show the evolution result modal with the new form
    el.evolutionModal.classList.add("active");
    el.evolutionModal.setAttribute("aria-hidden", "false");
    if (tutorialEvolving) {
      state.tutorialAwaitingEvolve = false;
      // Combined T-021/T-022/T-023: after the animation/splash, continue the
      // evolve dialogue while the evolved form is visible.
      setTutorialScene("evolve");
      state.tutorialLine = Math.max(0, tutorialEvolvePromptIndex() + 1);
      state.tutorialSplash = "assets/tutorial/tutorial-comic-evolution.png";
      saveState();
      renderTutorial();
    }
    el.closeEvolution.hidden = false;
    el.closeEvolution.focus();
  });
});

el.closeEvolution.addEventListener("click", closeEvolutionModal);

el.evolutionModal.addEventListener("click", (event) => {
  if (event.target === el.evolutionModal) {
    closeEvolutionModal();
  }
});

el.resetProgress.addEventListener("click", openResetModal);
el.confirmReset.addEventListener("click", resetRacingData);
el.cancelReset.addEventListener("click", closeResetModal);
el.godMode.addEventListener("click", openGodModal);
el.confirmGod.addEventListener("click", activateGodMode);
el.cancelGod.addEventListener("click", closeGodModal);
el.replayTutorial.addEventListener("click", openTutorialReplayModal);
el.deleteTracks?.addEventListener("click", openDeleteTracksPanel);
el.builderNew?.addEventListener("click", startNewBuilderTrack);
el.builderLoad?.addEventListener("click", openBuilderLoadPanel);
el.builderLoadBack?.addEventListener("click", openBuilderMenu);
el.builderExit?.addEventListener("click", () => {
  if (requestBuilderExit("builder-menu")) openBuilderMenu();
});
el.builderBuild?.addEventListener("click", () => toggleBuilderTool("build"));
el.builderRotate?.addEventListener("click", () => toggleBuilderTool("rotate"));
el.builderClear?.addEventListener("click", clearBuilderGrid);
el.builderSave?.addEventListener("click", beginBuilderSave);
el.builderPalette?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-builder-tile]");
  if (!button) return;
  builderState.selectedTile = button.dataset.builderTile;
  builderState.tool = "build";
  renderBuilderPalette();
  renderBuilder();
});
el.builderGrid?.addEventListener("click", (event) => {
  const cell = event.target.closest("[data-builder-x][data-builder-y]");
  if (!cell) return;
  placeBuilderTile(Number(cell.dataset.builderX), Number(cell.dataset.builderY));
});
el.builderTrackList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-builder-load-track]");
  if (!button) return;
  loadBuilderTrack(button.dataset.builderLoadTrack);
});
el.builderModal?.addEventListener("click", (event) => {
  if (event.target === el.builderModal) {
    closeBuilderModal();
    return;
  }
  const button = event.target.closest("[data-builder-modal-action]");
  if (!button) return;
  const action = button.dataset.builderModalAction;
  if (action === "close") closeBuilderModal();
  else if (action === "save-name-next") confirmBuilderSaveName();
  else if (action === "save-confirm") saveBuilderTrack();
  else if (action === "leave") leaveBuilderConfirmed();
  else if (action.startsWith("delete-pick:")) askDeleteTrack(action.split(":")[1]);
  else if (action === "delete-confirm") deleteSelectedTrack();
});
el.builderModalInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && builderState.modalMode === "name") confirmBuilderSaveName();
});
el.tutorialReplayYes.addEventListener("click", () => {
  closeTutorialReplayModal();
  startTutorial("intro");
});
el.tutorialSceneSelect.addEventListener("click", renderTutorialSceneOptions);
el.tutorialReplayCancel.addEventListener("click", closeTutorialReplayModal);
el.tutorialSceneOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tutorial-scene]");
  if (!button) return;
  closeTutorialReplayModal();
  startTutorial(button.dataset.tutorialScene);
});
el.tutorialFirstYes.addEventListener("click", () => {
  closeFirstTutorialModal();
  startTutorial("intro");
});
el.tutorialFirstNo.addEventListener("click", () => {
  closeFirstTutorialModal();
  finishTutorial();
});
el.cityUnlockClose.addEventListener("click", closeCityUnlockModal);
el.confirmPinkSlipRisk?.addEventListener("click", confirmPinkSlipRisk);
el.cancelPinkSlipRisk?.addEventListener("click", closePinkSlipWarning);
el.tutorialBack.addEventListener("click", rewindTutorial);
el.tutorialNext.addEventListener("click", advanceTutorial);
el.tutorialSkip.addEventListener("click", openSkipTutorialConfirm);
el.tutorialChoices?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tutorial-choice]");
  if (!button) return;
  chooseTutorialResponse(Number(button.dataset.tutorialChoice));
});
el.cancelTutorialSkip?.addEventListener("click", closeSkipTutorialConfirm);
el.confirmTutorialSkip?.addEventListener("click", () => {
  closeSkipTutorialConfirm();
  skipTutorial();
});
el.godCode.addEventListener("input", () => {
  el.godCodeError.textContent = "";
});
el.godCode.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    activateGodMode();
  }
});

el.resetModal.addEventListener("click", (event) => {
  if (event.target === el.resetModal) {
    closeResetModal();
  }
});

el.godModal.addEventListener("click", (event) => {
  if (event.target === el.godModal) {
    closeGodModal();
  }
});

el.tutorialReplayModal.addEventListener("click", (event) => {
  if (event.target === el.tutorialReplayModal) {
    closeTutorialReplayModal();
  }
});

el.tutorialSkipModal?.addEventListener("click", (event) => {
  if (event.target === el.tutorialSkipModal) {
    closeSkipTutorialConfirm();
  }
});

el.tutorialFirstModal.addEventListener("click", (event) => {
  if (event.target === el.tutorialFirstModal) {
    closeFirstTutorialModal();
    finishTutorial();
  }
});

el.cityUnlockModal.addEventListener("click", (event) => {
  if (event.target === el.cityUnlockModal) {
    closeCityUnlockModal();
  }
});

el.pinkSlipWarningModal?.addEventListener("click", (event) => {
  if (event.target === el.pinkSlipWarningModal) {
    closePinkSlipWarning();
  }
});

el.difficulty.addEventListener("change", (event) => {
  state.settings.difficulty = event.target.value;
  saveState();
});

el.volume.addEventListener("input", (event) => {
  state.settings.volume = Number(event.target.value);
  saveState();
});

el.shiftKey.addEventListener("keydown", (event) => {
  event.preventDefault();
  state.settings.shiftKey = normalizeKey(event);
  el.shiftKey.value = readableKey(state.settings.shiftKey);
  saveState();
});

el.nitroKey.addEventListener("keydown", (event) => {
  event.preventDefault();
  state.settings.nitroKey = normalizeKey(event);
  el.nitroKey.value = readableKey(state.settings.nitroKey);
  saveState();
});

function bindVerticalKeyInput(input, direction) {
  input.addEventListener("keydown", (event) => {
    event.preventDefault();
    state.settings.verticalKeys[direction] = normalizeKey(event);
    input.value = readableKey(state.settings.verticalKeys[direction]);
    saveState();
  });
}

function isKeySettingFocused() {
  return [
    el.shiftKey,
    el.nitroKey,
    el.verticalUpKey,
    el.verticalDownKey,
    el.verticalLeftKey,
    el.verticalRightKey
  ].includes(document.activeElement);
}

bindVerticalKeyInput(el.verticalUpKey, "up");
bindVerticalKeyInput(el.verticalDownKey, "down");
bindVerticalKeyInput(el.verticalLeftKey, "left");
bindVerticalKeyInput(el.verticalRightKey, "right");

document.addEventListener("keydown", (event) => {
  const key = normalizeKey(event);
  if (verticalRace?.active && isVerticalControlKey(key)) {
    event.preventDefault();
    verticalRace.keys[key] = true;
    updateVerticalControlVisuals();
  }
  if (key === "H" && honkCurrentRaceCar()) {
    event.preventDefault();
    return;
  }
  if (event.key === "Escape" && el.resetModal.classList.contains("active")) {
    closeResetModal();
    return;
  }
  if (event.key === "Escape" && el.godModal.classList.contains("active")) {
    closeGodModal();
    return;
  }
  if (event.key === "Escape" && el.tutorialReplayModal.classList.contains("active")) {
    closeTutorialReplayModal();
    return;
  }
  if (event.key === "Escape" && el.storyPreviewPanel.classList.contains("active")) {
    closeStoryPreview();
    return;
  }
  if (event.key === "Escape" && el.storyCitySelectPanel.classList.contains("active")) {
    closeCitySelect();
    return;
  }
  if (event.key === "Escape" && el.tutorialFirstModal.classList.contains("active")) {
    closeFirstTutorialModal();
    finishTutorial();
    return;
  }
  if (event.key === "Escape" && el.cityUnlockModal.classList.contains("active")) {
    closeCityUnlockModal();
    return;
  }
  if (event.key === "Escape" && el.pinkSlipWarningModal?.classList.contains("active")) {
    closePinkSlipWarning();
    return;
  }
  if (event.key === "Escape" && el.upgradeModal.classList.contains("active")) {
    closeUpgradeModal();
    return;
  }
  if (event.key === "Escape" && el.equipPartModal?.classList.contains("active")) {
    closeEquipPartModal();
    return;
  }
  if (event.key === "Escape" && el.inventoryModal?.classList.contains("active")) {
    closeInventoryModal();
    return;
  }
  if (event.key === "Escape" && el.bossModal.classList.contains("active")) {
    closeBossIntro();
    return;
  }
  if (event.key === "Escape" && el.unmaskModal.classList.contains("active")) {
    closeRacerAlphaUnmask();
    return;
  }
  if (event.key === "Escape" && el.evolutionModal.classList.contains("active")) {
    closeEvolutionModal();
    return;
  }
  if (isKeySettingFocused()) return;
  if (key === state.settings.shiftKey) {
    event.preventDefault();
    shift();
    return;
  }
  if (key === state.settings.nitroKey) {
    event.preventDefault();
    useNitro();
  }
});

document.addEventListener("keyup", (event) => {
  if (verticalRace?.keys) {
    verticalRace.keys[normalizeKey(event)] = false;
    updateVerticalControlVisuals();
  }
});

function startLoadingExperience() {
  const screen = document.querySelector("#loading-screen");
  const fill = document.querySelector("#fuel-fill");
  const tip = document.querySelector("#loading-tip");
  if (!screen || !fill) {
    document.body.classList.remove("app-loading");
    return { complete() {} };
  }
  const tips = [
    "Say 'Unlock' to call your nearest GearBorn.",
    "Not all GearBorn answer right away.",
    "Medallions can evolve a GearBorn - but connection matters more.",
    "Sprox power upgrades in the Garage.",
    "Every GearBorn has its own driving personality."
  ];
  let progress = 10;
  let tipIndex = 0;
  let done = false;
  const setProgress = (value) => {
    progress = Math.max(progress, Math.min(100, value));
    fill.style.width = `${progress}%`;
  };
  const progressTimer = window.setInterval(() => {
    if (done) return;
    const ceiling = document.readyState === "complete" ? 95 : 88;
    setProgress(Math.min(ceiling, progress + 2 + Math.random() * 7));
  }, 180);
  const tipTimer = window.setInterval(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    if (tip) tip.textContent = tips[tipIndex];
  }, 1500);
  const complete = () => {
    if (done) return;
    done = true;
    window.clearInterval(progressTimer);
    window.clearInterval(tipTimer);
    setProgress(100);
    window.setTimeout(() => {
      document.body.classList.remove("app-loading");
      screen.classList.add("done");
    }, 260);
    window.setTimeout(() => screen.remove(), 980);
  };
  window.setTimeout(complete, 3600);
  return { complete };
}

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
