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

function bindActionButton(node, handler) {
  if (!node) return;
  node.addEventListener("click", (event) => {
    if (node.disabled) return;
    handler(event);
  });
  node.addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (node.disabled) return;
    handler(event);
  }, { passive: false });
}

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

document.getElementById("open-tuner-page")?.addEventListener("click", () => {
  openTunerPage();
});

document.getElementById("tuner-page-back")?.addEventListener("click", () => {
  closeTunerPage();
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

document.addEventListener("click", (event) => {
  const pickerButton = event.target.closest("[data-open-car-picker]");
  if (pickerButton) {
    openCarPicker(pickerButton.dataset.openCarPicker);
    return;
  }
  const filterButton = event.target.closest("[data-car-picker-filter]");
  if (filterButton) {
    const key = filterButton.dataset.carPickerFilter;
    carPickerState.filters[key] = !carPickerState.filters[key];
    renderCarPicker();
    return;
  }
  const typeButton = event.target.closest("[data-car-picker-type]");
  if (typeButton) {
    const type = typeButton.dataset.carPickerType;
    carPickerState.filters.types = carPickerState.filters.types.includes(type)
      ? carPickerState.filters.types.filter((item) => item !== type)
      : carPickerState.filters.types.concat(type);
    renderCarPicker();
    return;
  }
  const favorite = event.target.closest("[data-car-picker-favorite]");
  if (favorite) {
    event.preventDefault();
    event.stopPropagation();
    const carId = favorite.dataset.carPickerFavorite;
    state.favoriteCarIds = state.favoriteCarIds.includes(carId)
      ? state.favoriteCarIds.filter((id) => id !== carId)
      : state.favoriteCarIds.concat(carId);
    saveState();
    renderCarPicker();
    return;
  }
  const card = event.target.closest("[data-car-picker-card]");
  if (card) {
    carPickerState.highlighted = card.dataset.carPickerCard;
    if (event.detail >= 2) closeCarPicker(true);
    else renderCarPicker();
  }
});

el.carPickerClose?.addEventListener("click", () => closeCarPicker(false));
el.carPickerConfirm?.addEventListener("click", () => closeCarPicker(true));
el.carPickerModal?.addEventListener("click", (event) => {
  if (event.target === el.carPickerModal) closeCarPicker(false);
});
el.carPickerSearch?.addEventListener("input", () => {
  carPickerState.search = el.carPickerSearch.value || "";
  renderCarPicker();
});
el.carPickerSort?.addEventListener("change", () => {
  carPickerState.sort = el.carPickerSort.value || "level-desc";
  renderCarPicker();
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
    openHonkModal(garageHonk.dataset.honkCar);
    garageHonk.classList.add("playing");
    window.setTimeout(() => garageHonk.classList.remove("playing"), 180);
    return;
  }
  const raceHonk = event.target.closest("[data-race-honk]");
  if (raceHonk) {
    event.preventDefault();
    playGearbornHonk(race?.carId || selectedCarIdForMode("drag"));
    return;
  }
  const battleHonk = event.target.closest("[data-battle-honk]");
  if (battleHonk) {
    event.preventDefault();
    playGearbornHonk(battleState?.carId || selectedCarIdForMode("battle"));
    return;
  }
  const honkEmotion = event.target.closest("[data-honk-emotion]");
  if (honkEmotion) {
    event.preventDefault();
    playHonkEmotion(honkEmotion.dataset.honkLine, honkEmotion.dataset.honkEmotion, honkEmotion.dataset.honkBondLine || honkEmotion.dataset.honkLine);
    return;
  }
  if (event.target === el.honkModal || event.target.closest("#honk-modal-close")) {
    event.preventDefault();
    closeHonkModal();
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

el.dragOpponentCount?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-drag-opponents]");
  if (!button) return;
  state.selectedDragOpponents = Math.max(1, Math.min(3, Number(button.dataset.dragOpponents) || 1));
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
bindActionButton(el.shiftButton, shift);
bindActionButton(el.nitroButton, useNitro);
bindActionButton(el.dragLaneUp, () => moveDragLane(-1));
bindActionButton(el.dragLaneDown, () => moveDragLane(1));
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
el.battleActions.addEventListener("touchstart", (event) => {
  const button = event.target.closest("[data-battle-move]");
  if (!button || button.disabled) return;
  event.preventDefault();
  handleBattleMove(button.dataset.battleMove);
}, { passive: false });
bindActionButton(el.battleNextTurn, nextBattleTurn);
bindActionButton(el.rotationTipDismiss, () => hideBetaRotationTip(true));
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
  const expandButton = event.target.closest("[data-expand-garage-card]");
  if (expandButton) {
    expandedGarageCardIds.add(expandButton.dataset.expandGarageCard);
    renderGarage();
    return;
  }
  const collapseButton = event.target.closest("[data-collapse-garage-card]");
  if (collapseButton) {
    expandedGarageCardIds.delete(collapseButton.dataset.collapseGarageCard);
    renderGarage();
    return;
  }
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

document.querySelector("#garage-view-toggle")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-garage-view]");
  if (!button) return;
  state.garageViewMode = button.dataset.garageView === "detailed" ? "detailed" : "compact";
  saveState();
  renderGarage();
});

el.tunerRankOpen?.addEventListener("click", openTunerRankScreen);
el.tunerRankBack?.addEventListener("click", () => showView("story"));
el.storyFactionBadge?.addEventListener("click", openFactionHubPlaceholder);

el.convoyButtons?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-convoy-open]");
  if (button) openConvoy(button.dataset.convoyOpen);
});
el.convoyBack?.addEventListener("click", () => showView("story"));
el.convoyLoadoutsOpen?.addEventListener("click", () => {
  convoyLoadoutsReturnView = "convoy";
  renderConvoyLoadouts();
  showView("convoy-loadouts");
});
el.garageLoadoutsOpen?.addEventListener("click", () => {
  convoyLoadoutsReturnView = "garage";
  renderConvoyLoadouts();
  showView("convoy-loadouts");
});
el.convoyLoadoutsBack?.addEventListener("click", () => showView(convoyLoadoutsReturnView || "convoy"));
el.convoyLoadoutSlots?.addEventListener("click", (event) => {
  const slotPickButton = event.target.closest("[data-convoy-loadout-slot-pick]");
  if (slotPickButton) {
    const [loadoutIndex, slot] = slotPickButton.dataset.convoyLoadoutSlotPick.split(":").map(Number);
    openConvoyLoadoutSlotPicker(loadoutIndex, slot);
    return;
  }
  const loadButton = event.target.closest("[data-convoy-loadout-load]");
  if (loadButton && !loadButton.disabled) {
    loadConvoyLoadoutIntoStages(Number(loadButton.dataset.convoyLoadoutLoad));
    showView("convoy");
  }
});
el.convoyLoadoutSlots?.addEventListener("input", (event) => {
  const nameInput = event.target.closest("[data-convoy-loadout-name]");
  if (!nameInput) return;
  const index = Number(nameInput.dataset.convoyLoadoutName);
  const current = state.convoy.loadouts[index] || { name: "", carIds: [null, null, null] };
  current.name = nameInput.value.trim() || `Loadout ${index + 1}`;
  state.convoy.loadouts[index] = current;
  saveState();
});
el.convoyStageList?.addEventListener("click", (event) => {
  const pickButton = event.target.closest("[data-convoy-pick-stage]");
  if (pickButton && !pickButton.disabled) {
    openConvoyStagePicker(Number(pickButton.dataset.convoyPickStage));
    return;
  }
  const button = event.target.closest("[data-convoy-stage]");
  if (!button || button.disabled) return;
  const slot = Number(button.dataset.convoyStage);
  const inProgress = state.convoy?.inProgress;
  if (!inProgress) return;
  inProgress.stageProgress = inProgress.stageProgress || {};
  inProgress.stageSelections = Array.isArray(inProgress.stageSelections) ? inProgress.stageSelections : [null, null, null];
  if (slot > 0 && inProgress.stageProgress[slot - 1] !== "won") {
    showToast("Convoy", "Complete the previous stage first.");
    return;
  }
  const carId = inProgress.stageSelections?.[slot];
  if (!carId || !isSelectablePlayerCar(carId)) {
    showToast("Convoy", "Choose a GearBorn for this stage first.");
    return;
  }
  const convoyId = inProgress.convoyId;
  inProgress.stageProgress[slot] = "won";
  recordTunerStat("convoyStagesWon");
  if (slot >= 2) {
    completeConvoy(convoyId);
    showView("story");
    return;
  }
  inProgress.currentStage = slot + 1;
  saveState();
  showToast("Convoy Stage Placeholder", `Stage ${slot + 1} cleared with ${currentEvolution(carId).name}.`);
  renderConvoy();
});

el.vindexMemoriesButton?.addEventListener("click", toggleVindexMemories);
el.vindexMemoriesPanel?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vindex-memory]");
  if (!button) return;
  const [lineRoot, threshold] = button.dataset.vindexMemory.split(":");
  replayBondScene(lineRoot, Number(threshold));
});
el.bondSceneContinue?.addEventListener("click", closeBondScene);

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
    recordTunerStat("evolutionsPerformed");
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
  updateAudioVolumes();
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
  if (race?.active && !race.finished && (key === "W" || key === "ARROWUP")) {
    event.preventDefault();
    moveDragLane(-1);
    return;
  }
  if (race?.active && !race.finished && (key === "S" || key === "ARROWDOWN")) {
    event.preventDefault();
    moveDragLane(1);
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
