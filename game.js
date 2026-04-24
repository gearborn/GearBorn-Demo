const distances = [
  { meters: 200, label: "200 m", xp: 80, difficulty: 0.9 },
  { meters: 500, label: "500 m", xp: 180, difficulty: 1.05 },
  { meters: 1000, label: "1000 m", xp: 420, difficulty: 1.22 }
];

const ranks = [
  {
    key: "E",
    name: "Bananachi",
    xpBonus: 1,
    power: 0.9,
    color: "#f4d35e",
    images: {
      display: "assets/cars/rival-bananachi-display.png",
      race: "assets/cars/rival-bananachi-race.png"
    }
  },
  {
    key: "D",
    name: "Beardo",
    xpBonus: 1.35,
    power: 1.08,
    color: "#8d6e63",
    images: {
      display: "assets/cars/rival-beardo-display.png",
      race: "assets/cars/rival-beardo-race.png"
    }
  },
  {
    key: "C",
    name: "Manstrocity",
    xpBonus: 1.75,
    power: 1.28,
    color: "#7bdff2",
    images: {
      display: "assets/cars/rival-manstrocity-display.png",
      race: "assets/cars/rival-manstrocity-race.png"
    }
  },
  {
    key: "B",
    name: "Sponsore",
    xpBonus: 2.25,
    power: 1.5,
    color: "#f29f5c",
    images: {
      display: "assets/cars/rival-sponsore-display.png",
      race: "assets/cars/rival-sponsore-race.png"
    }
  },
  {
    key: "A",
    name: "Crusadome",
    xpBonus: 3.0,
    power: 1.78,
    color: "#f25f5c",
    images: {
      display: "assets/cars/rival-crusadome-display.png",
      race: "assets/cars/rival-crusadome-race.png"
    }
  },
  {
    key: "S",
    name: "Hornula1",
    xpBonus: 4.1,
    power: 2.12,
    color: "#c084fc",
    images: {
      display: "assets/cars/rival-hornula1-display.png",
      race: "assets/cars/rival-hornula1-race.png"
    }
  }
];

const cars = [
  {
    id: "bee",
    family: "Bee",
    color: "#f4d35e",
    trait: "Fast shifts",
    evolutions: [
      { name: "Baybee", images: { display: "assets/cars/bee-baybee-display.png", race: "assets/cars/bee-baybee-race.png" } },
      { name: "Syndrone", images: { display: "assets/cars/bee-syndrone-display.png", race: "assets/cars/bee-syndrone-race.png" } },
      { name: "Motonarch", images: { display: "assets/cars/bee-motonarch-display.png", race: "assets/cars/bee-motonarch-race.png" } }
    ]
  },
  {
    id: "pickup",
    family: "Pickup Truck",
    color: "#b7c1d1",
    trait: "Strong launches",
    evolutions: [
      { name: "Murrka", images: { display: "assets/cars/pickup-murrka-display.png", race: "assets/cars/pickup-murrka-race.png" } },
      { name: "Wallmort", images: { display: "assets/cars/pickup-wallmort-display.png", race: "assets/cars/pickup-wallmort-race.png" } },
      { name: "Tookerjaw", images: { display: "assets/cars/pickup-tookerjaw-display.png", race: "assets/cars/pickup-tookerjaw-race.png" } }
    ]
  },
  {
    id: "pig",
    family: "Pig",
    color: "#f4a7b9",
    trait: "Stable power",
    evolutions: [
      { name: "Hogson", images: { display: "assets/cars/pig-hogson-display.png", race: "assets/cars/pig-hogson-race.png" } },
      { name: "Snoffle", images: { display: "assets/cars/pig-snoffle-display.png", race: "assets/cars/pig-snoffle-race.png" } },
      { name: "Swinecroft", images: { display: "assets/cars/pig-swinecroft-display.png", race: "assets/cars/pig-swinecroft-race.png" } }
    ]
  },
  {
    id: "rabbit",
    family: "Rabbit",
    color: "#ffffff",
    trait: "Quick acceleration",
    evolutions: [
      { name: "Bunnae", images: { display: "assets/cars/rabbit-bunnae-display.png", race: "assets/cars/rabbit-bunnae-race.png" } },
      { name: "Lopstar", images: { display: "assets/cars/rabbit-lopstar-display.png", race: "assets/cars/rabbit-lopstar-race.png" } },
      { name: "Matunnie", images: { display: "assets/cars/rabbit-matunnie-display.png", race: "assets/cars/rabbit-matunnie-race.png" } }
    ]
  },
  {
    id: "whale",
    family: "Whale",
    color: "#52c7ff",
    trait: "High top speed",
    evolutions: [
      { name: "Totorca", images: { display: "assets/cars/whale-totorca-display.png", race: "assets/cars/whale-totorca-race.png" } },
      { name: "Boates", images: { display: "assets/cars/whale-boates-display.png", race: "assets/cars/whale-boates-race.png" } },
      { name: "Shamacht", images: { display: "assets/cars/whale-shamacht-display.png", race: "assets/cars/whale-shamacht-race.png" } }
    ]
  },
  {
    id: "frog",
    family: "Frog",
    color: "#6ee7a8",
    trait: "Late race surge",
    evolutions: [
      { name: "Rivvir", images: { display: "assets/cars/frog-rivvir-display.png", race: "assets/cars/frog-rivvir-race.png" } },
      { name: "Croakra", images: { display: "assets/cars/frog-croakra-display.png", race: "assets/cars/frog-croakra-race.png" } },
      { name: "Kermajesty", images: { display: "assets/cars/frog-kermajesty-display.png", race: "assets/cars/frog-kermajesty-race.png" } }
    ]
  },
  {
    id: "rainbowlt",
    family: "Secret",
    color: "#c084fc",
    trait: "Unlocked by mastering every starter line",
    unlockable: true,
    unlockInstruction: "Evolve all 6 cars to their final forms to unlock",
    evolutions: [
      { name: "Rainbowlt", images: { display: "assets/cars/unlock-rainbowlt-display.png", race: "assets/cars/unlock-rainbowlt-race.png" } },
      { name: "Hornula1", images: { display: "assets/cars/rival-hornula1-display.png", race: "assets/cars/rival-hornula1-race.png" } }
    ]
  }
];

const starterCarIds = cars.filter((car) => !car.unlockable).map((car) => car.id);
const saveKey = "gearborn-demo-save-v1";

const defaultState = {
  selectedCar: cars[0].id,
  selectedRank: "E",
  selectedDistance: 200,
  highestRankIndex: 0,
  settings: {
    difficulty: "normal",
    volume: 45,
    shiftKey: "Space"
  },
  garage: Object.fromEntries(cars.map((car) => [car.id, { level: 1, xp: 0, evolution: 0, pendingEvolution: null }]))
};

let state = loadState();
sanitizeState();
let race = null;
let lastFrame = 0;
let evolutionModal = null;

const el = {
  views: document.querySelectorAll(".view"),
  navButtons: document.querySelectorAll("[data-view]"),
  playerCar: document.querySelector("#player-car"),
  playerPreviewArt: document.querySelector("#player-preview-art"),
  playerPreviewName: document.querySelector("#player-preview-name"),
  playerPreviewMeta: document.querySelector("#player-preview-meta"),
  distanceOptions: document.querySelector("#distance-options"),
  opponentList: document.querySelector("#opponent-list"),
  opponentPreviewArt: document.querySelector("#opponent-preview-art"),
  opponentPreviewName: document.querySelector("#opponent-preview-name"),
  opponentPreviewMeta: document.querySelector("#opponent-preview-meta"),
  startRace: document.querySelector("#start-race"),
  resetProgress: document.querySelector("#reset-progress"),
  resetModal: document.querySelector("#reset-modal"),
  confirmReset: document.querySelector("#confirm-reset"),
  cancelReset: document.querySelector("#cancel-reset"),
  mph: document.querySelector("#mph"),
  gear: document.querySelector("#gear"),
  distance: document.querySelector("#distance"),
  shiftReadout: document.querySelector("#shift-readout"),
  tachFill: document.querySelector("#tach-fill"),
  playerRacer: document.querySelector("#player-racer"),
  playerRacerImage: document.querySelector("#player-racer-image"),
  rivalRacer: document.querySelector("#rival-racer"),
  rivalRacerImage: document.querySelector("#rival-racer-image"),
  raceMessage: document.querySelector("#race-message"),
  shiftButton: document.querySelector("#shift-button"),
  garageGrid: document.querySelector("#garage-grid"),
  difficulty: document.querySelector("#difficulty"),
  volume: document.querySelector("#volume"),
  shiftKey: document.querySelector("#shift-key"),
  evolutionModal: document.querySelector("#evolution-modal"),
  evolutionStage: document.querySelector("#evolution-stage"),
  evolutionKicker: document.querySelector("#evolution-kicker"),
  evolutionTitle: document.querySelector("#evolution-title"),
  evolutionCopy: document.querySelector("#evolution-copy"),
  evolveButton: document.querySelector("#evolve-button"),
  closeEvolution: document.querySelector("#close-evolution")
};

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
    garage: { ...base.garage, ...saved.garage }
  };
}

function saveState() {
  localStorage.setItem(saveKey, JSON.stringify(state));
}

function sanitizeState() {
  state.unlockedCars = state.unlockedCars || {};
  if (allStarterFinalFormsUnlocked()) {
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
  cars.forEach((car) => {
    state.garage[car.id] = state.garage[car.id] || { level: 1, xp: 0, evolution: 0, pendingEvolution: null };
    state.garage[car.id].pendingEvolution = state.garage[car.id].pendingEvolution ?? null;
    state.garage[car.id].evolution = Math.min(state.garage[car.id].evolution || 0, car.evolutions.length - 1);
    const eligibleEvolution = maxEligibleEvolutionForCar(car.id, state.garage[car.id].level);
    if (eligibleEvolution > state.garage[car.id].evolution) {
      state.garage[car.id].pendingEvolution = state.garage[car.id].pendingEvolution || state.garage[car.id].evolution + 1;
    }
  });
  Object.keys(state.garage).forEach((carId) => {
    if (!cars.some((car) => car.id === carId)) {
      delete state.garage[carId];
    }
  });
}

function xpForNextLevel(level) {
  return Math.floor(95 * Math.pow(level, 1.48));
}

function evolutionIndexForLevel(level) {
  if (level >= 10) return 2;
  if (level >= 5) return 1;
  return 0;
}

function maxEligibleEvolutionForCar(carId, level) {
  const car = cars.find((item) => item.id === carId);
  if (carId === "rainbowlt") {
    return level >= 10 ? 1 : 0;
  }
  return Math.min(evolutionIndexForLevel(level), car.evolutions.length - 1);
}

function isCarUnlocked(carId) {
  const car = cars.find((item) => item.id === carId);
  return !car?.unlockable || state.unlockedCars?.[carId];
}

function allStarterFinalFormsUnlocked() {
  return starterCarIds.every((carId) => {
    const car = cars.find((item) => item.id === carId);
    const progress = state.garage?.[carId];
    return progress && progress.evolution >= car.evolutions.length - 1;
  });
}

function unlockSecretCars() {
  state.unlockedCars = state.unlockedCars || {};
  if (!state.unlockedCars.rainbowlt && allStarterFinalFormsUnlocked()) {
    state.unlockedCars.rainbowlt = true;
    state.garage.rainbowlt = state.garage.rainbowlt || { level: 1, xp: 0, evolution: 0, pendingEvolution: null };
    return "rainbowlt";
  }
  return null;
}

function currentEvolution(carId) {
  const car = cars.find((item) => item.id === carId);
  const progress = state.garage[carId];
  return car.evolutions[progress.evolution] || car.evolutions[0];
}

function evolutionByIndex(carId, evolutionIndex) {
  const car = cars.find((item) => item.id === carId);
  return car.evolutions[evolutionIndex] || car.evolutions[0];
}

function carStats(carId) {
  const progress = state.garage[carId];
  const evolutionBoost = 1 + progress.evolution * 0.18;
  const levelBoost = 1 + (progress.level - 1) * 0.075;
  return {
    power: levelBoost * evolutionBoost,
    maxSpeed: 112 + progress.level * 6.5 + progress.evolution * 20,
    acceleration: 23 + progress.level * 1.25 + progress.evolution * 4.5,
    shiftWindow: Math.max(0.09, 0.18 - progress.evolution * 0.008)
  };
}

function difficultyMultiplier() {
  return { easy: 0.9, normal: 1, hard: 1.13 }[state.settings.difficulty] || 1;
}

function render() {
  renderCarSelect();
  renderDistanceOptions();
  renderOpponents();
  renderSelectionPreviews();
  renderGarage();
  renderSettings();
  paintCars();
}

function renderCarSelect() {
  el.playerCar.innerHTML = cars.filter((car) => isCarUnlocked(car.id)).map((car) => {
    const progress = state.garage[car.id];
    const form = currentEvolution(car.id);
    return `<option value="${car.id}">${form.name} · ${car.family} · Lv ${progress.level}</option>`;
  }).join("");
  el.playerCar.value = state.selectedCar;
}

function renderDistanceOptions() {
  el.distanceOptions.innerHTML = distances.map((distance) => `
    <button type="button" class="${state.selectedDistance === distance.meters ? "active" : ""}" data-distance="${distance.meters}">
      ${distance.label}
    </button>
  `).join("");
}

function renderOpponents() {
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
  const rank = ranks.find((item) => item.key === state.selectedRank);
  const rankIndex = ranks.findIndex((item) => item.key === rank.key);

  el.playerPreviewArt.innerHTML = carMarkupForEvolution(car.id, progress.evolution, "display");
  el.playerPreviewName.textContent = form.name;
  el.playerPreviewMeta.textContent = `${car.family} · Level ${progress.level} · ${car.trait}`;

  el.opponentPreviewArt.innerHTML = rankMarkup(rank, "display");
  el.opponentPreviewName.textContent = `${rank.key} Class · ${rank.name}`;
  el.opponentPreviewMeta.textContent = `Difficulty tier ${rankIndex + 1} of ${ranks.length}`;
}

function renderGarage() {
  el.garageGrid.innerHTML = cars.map((car) => {
    if (!isCarUnlocked(car.id)) {
      return lockedGarageCard(car);
    }
    const progress = state.garage[car.id];
    const next = xpForNextLevel(progress.level);
    const pct = Math.min(100, (progress.xp / next) * 100);
    return `
      <article class="garage-card">
        <div class="garage-art">
          ${carMarkupForEvolution(car.id, progress.evolution, "display")}
        </div>
        <div class="garage-info">
          <h2>${currentEvolution(car.id).name}</h2>
          <h3>${car.family}</h3>
          <div class="meta-row">
            <span>Level ${progress.level}</span>
            <span class="evolution">Evolution ${progress.evolution + 1}</span>
          </div>
          <div class="xp-bar"><div class="xp-fill" style="width:${pct}%"></div></div>
          <div class="meta-row">
            <span>${progress.xp} / ${next} XP</span>
            <span>${progress.pendingEvolution ? "Ready to evolve" : car.trait}</span>
          </div>
          ${progress.pendingEvolution ? `<button class="garage-evolve" type="button" data-evolve-car="${car.id}">Evolve</button>` : ""}
        </div>
      </article>
    `;
  }).join("");
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
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${currentEvolution(currentCar.id).name}" onerror="this.closest('.car').classList.remove('has-image')">` : "";
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
}

function paintCars() {
  const car = cars.find((item) => item.id === state.selectedCar);
  const rank = ranks.find((item) => item.key === state.selectedRank);
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
  const car = carStats(state.selectedCar);
  const rank = ranks.find((item) => item.key === state.selectedRank);
  const distance = distances.find((item) => item.meters === state.selectedDistance);
  const rankIndex = ranks.findIndex((item) => item.key === rank.key);
  const classScale = 0.9 + rankIndex * 0.09;
  const rivalPower = rank.power * classScale * distance.difficulty * difficultyMultiplier();
  race = {
    active: true,
    finished: false,
    target: distance.meters,
    gear: 1,
    rpm: 0.18,
    playerSpeed: 0,
    rivalSpeed: 0,
    playerDistance: 0,
    rivalDistance: 0,
    playerPower: car.power,
    playerMaxSpeed: car.maxSpeed,
    playerAcceleration: car.acceleration,
    topGearBoost: 1,
    shiftWindow: car.shiftWindow,
    rivalMaxSpeed: 92 + rivalPower * 42,
    rivalAcceleration: 17 + rivalPower * 12,
    shiftScore: [],
    rank,
    distance
  };
  lastFrame = performance.now();
  el.raceMessage.className = "race-message";
  el.raceMessage.textContent = `Race started. Press ${readableKey(state.settings.shiftKey)} when the shift meter hits the bright band.`;
  requestAnimationFrame(updateRace);
}

function updateRace(now) {
  if (!race?.active) return;
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;

  if (race.gear >= 6) {
    const speedRatio = Math.min(1, race.playerSpeed / race.playerMaxSpeed);
    const topGearPull = Math.max(0.16, 1 - speedRatio);
    race.playerSpeed += race.playerAcceleration * race.playerPower * race.topGearBoost * topGearPull * dt;
    race.rpm = 0.74;
  } else {
    const gearDrag = 1 - (race.gear - 1) * 0.08;
    const rpmPower = 0.52 + race.rpm * 0.72;
    race.playerSpeed += race.playerAcceleration * race.playerPower * gearDrag * rpmPower * dt;
    race.rpm += (0.22 + race.playerSpeed / 260) * dt;
  }
  race.rivalSpeed += race.rivalAcceleration * (0.78 + Math.random() * 0.08) * dt;

  const playerCap = race.gear >= 6 ? race.playerMaxSpeed : race.playerMaxSpeed * (0.58 + race.gear * 0.15);
  const rivalCap = race.rivalMaxSpeed;
  race.playerSpeed = Math.min(race.playerSpeed, playerCap);
  race.rivalSpeed = Math.min(race.rivalSpeed, rivalCap);

  race.playerDistance += mphToMetersPerSecond(race.playerSpeed) * dt;
  race.rivalDistance += mphToMetersPerSecond(race.rivalSpeed) * dt;

  if (race.gear < 6 && race.rpm >= 1) {
    race.playerSpeed *= 0.985;
    race.rpm = 1;
  }

  drawRace();

  if (race.playerDistance >= race.target || race.rivalDistance >= race.target) {
    finishRace(race.playerDistance >= race.rivalDistance);
    return;
  }

  requestAnimationFrame(updateRace);
}

function shift() {
  if (!race?.active || race.finished) return;
  if (race.gear >= 6) {
    el.shiftReadout.textContent = "Top";
    return;
  }
  const ideal = 0.73;
  const diff = Math.abs(race.rpm - ideal);
  let label = "Early";
  let multiplier = 0.82;

  if (diff <= race.shiftWindow) {
    label = diff < race.shiftWindow * 0.38 ? "Perfect" : "Good";
    multiplier = label === "Perfect" ? 1.1 : 1.02;
  } else if (race.rpm > ideal) {
    label = "Late";
    multiplier = 0.88;
  }

  race.shiftScore.push(label);
  race.playerSpeed *= multiplier;
  const nextGear = Math.min(6, race.gear + 1);
  if (nextGear === 6) {
    race.topGearBoost = topGearBoostForShift(label);
  }
  race.gear = nextGear;
  race.rpm = race.gear === 6 ? 0.74 : Math.max(0.22, 0.34 - race.gear * 0.015);
  el.shiftReadout.textContent = label;
  beep(label);
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
  drawRace();

  if (playerWon) {
    const earned = Math.floor(race.distance.xp * race.rank.xpBonus * difficultyMultiplier());
    const xpResult = addXp(state.selectedCar, earned);
    const rankIndex = ranks.findIndex((rank) => rank.key === race.rank.key);
    if (rankIndex === state.highestRankIndex && state.highestRankIndex < ranks.length - 1) {
      state.highestRankIndex += 1;
    }
    el.raceMessage.className = "race-message win";
    el.raceMessage.textContent = raceResultMessage(
      `Victory. ${currentEvolution(state.selectedCar).name} earned ${earned} XP.`,
      xpResult
    );
  } else {
    const consolation = Math.floor(race.distance.xp * 0.16);
    const xpResult = addXp(state.selectedCar, consolation);
    el.raceMessage.className = "race-message loss";
    el.raceMessage.textContent = raceResultMessage(
      `Defeat. You still earned ${consolation} tuning XP. Try a shorter race or lower class.`,
      xpResult
    );
  }

  saveState();
  render();
  showPendingEvolution(state.selectedCar);
}

function addXp(carId, amount) {
  const progress = state.garage[carId];
  const startingLevel = progress.level;
  progress.xp += amount;
  while (progress.xp >= xpForNextLevel(progress.level)) {
    progress.xp -= xpForNextLevel(progress.level);
    progress.level += 1;
    const newEvolution = maxEligibleEvolutionForCar(carId, progress.level);
    if (newEvolution > progress.evolution) {
      progress.pendingEvolution = progress.pendingEvolution || progress.evolution + 1;
    }
  }
  return {
    leveledUp: progress.level > startingLevel,
    level: progress.level,
    name: currentEvolution(carId).name
  };
}

function raceResultMessage(baseMessage, xpResult) {
  if (!xpResult.leveledUp) return baseMessage;
  return `${baseMessage} ${xpResult.name} has increased to Level ${xpResult.level}.`;
}

function showPendingEvolution(carId) {
  const progress = state.garage[carId];
  if (!progress.pendingEvolution) return;
  const currentForm = currentEvolution(carId);
  const nextForm = evolutionByIndex(carId, progress.pendingEvolution);
  evolutionModal = { mode: "ready", carId, evolution: progress.pendingEvolution };
  el.evolutionKicker.textContent = "Evolution Ready";
  el.evolutionTitle.textContent = `${currentForm.name} is ready to evolve`;
  el.evolutionCopy.textContent = "The next Gearborn form is charged and waiting.";
  el.evolveButton.hidden = false;
  el.closeEvolution.textContent = "Later";
  el.evolutionStage.innerHTML = carMarkupForEvolution(carId, progress.evolution, "display");
  el.evolutionModal.classList.add("active");
  el.evolutionModal.setAttribute("aria-hidden", "false");
  el.evolveButton.focus();
}

function revealEvolution(carId, evolutionIndex) {
  const progress = state.garage[carId];
  progress.evolution = evolutionIndex;
  progress.pendingEvolution = null;
  const eligibleEvolution = maxEligibleEvolutionForCar(carId, progress.level);
  if (eligibleEvolution > progress.evolution) {
    progress.pendingEvolution = progress.evolution + 1;
  }
  const unlockedCarId = unlockSecretCars();
  const form = currentEvolution(carId);
  evolutionModal = { mode: "unlocked", carId, evolution: evolutionIndex };
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

function closeEvolutionModal() {
  evolutionModal = null;
  el.evolutionModal.classList.remove("active");
  el.evolutionModal.setAttribute("aria-hidden", "true");
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
  state = structuredClone(defaultState);
  saveState();
  race = null;
  closeResetModal();
  closeEvolutionModal();
  el.playerRacer.style.transform = "translateX(0)";
  el.rivalRacer.style.transform = "translateX(0)";
  el.raceMessage.className = "race-message";
  el.raceMessage.textContent = "Racing data reset. Fresh garage, fresh rivals.";
  render();
}

function imageFor(entry, role) {
  if (!entry) return "";
  if (entry.images?.[role]) return entry.images[role];
  return entry.image || "";
}

function rankMarkup(rank, role = "display") {
  const image = imageFor(rank, role);
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${rank.name}" onerror="this.closest('.car').classList.remove('has-image')">` : "";
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

function carMarkupForEvolution(carId, evolutionIndex, role = "display") {
  const car = cars.find((item) => item.id === carId);
  const form = evolutionByIndex(carId, evolutionIndex);
  const image = imageFor(form, role);
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${form.name}" onerror="this.closest('.car').classList.remove('has-image')">` : "";
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
  const maxTravel = Math.max(80, document.querySelector(".track").clientWidth - 170);
  const playerProgress = Math.min(1, race.playerDistance / race.target);
  const rivalProgress = Math.min(1, race.rivalDistance / race.target);
  el.playerRacer.style.transform = `translateX(${-playerProgress * maxTravel}px)`;
  el.rivalRacer.style.transform = `translateX(${-rivalProgress * maxTravel}px)`;
  el.mph.textContent = `${Math.round(race.playerSpeed)} MPH`;
  el.gear.textContent = race.gear;
  el.distance.textContent = `${Math.floor(Math.min(race.playerDistance, race.target))} m`;
  el.tachFill.style.width = `${Math.round(race.rpm * 100)}%`;

  if (race.gear >= 6) {
    el.shiftButton.classList.remove("pulse");
    el.shiftReadout.textContent = "Top";
    el.tachFill.style.width = "74%";
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
}

function mphToMetersPerSecond(mph) {
  return mph * 0.44704;
}

function readableKey(key) {
  return key === " " || key === "Space" ? "Space" : key;
}

function normalizeKey(event) {
  return event.code === "Space" ? "Space" : event.key.length === 1 ? event.key.toUpperCase() : event.key;
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

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    el.views.forEach((panel) => panel.classList.toggle("active", panel.id === `${view}-view`));
    document.querySelectorAll(".nav-button").forEach((nav) => nav.classList.toggle("active", nav.dataset.view === view));
  });
});

el.playerCar.addEventListener("change", (event) => {
  state.selectedCar = event.target.value;
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
el.shiftButton.addEventListener("click", shift);

el.garageGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-evolve-car]");
  if (!button) return;
  showPendingEvolution(button.dataset.evolveCar);
});

el.evolveButton.addEventListener("click", () => {
  if (!evolutionModal) return;
  revealEvolution(evolutionModal.carId, evolutionModal.evolution);
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

el.resetModal.addEventListener("click", (event) => {
  if (event.target === el.resetModal) {
    closeResetModal();
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && el.resetModal.classList.contains("active")) {
    closeResetModal();
    return;
  }
  if (event.key === "Escape" && el.evolutionModal.classList.contains("active")) {
    closeEvolutionModal();
    return;
  }
  const key = normalizeKey(event);
  if (document.activeElement === el.shiftKey) return;
  if (key === state.settings.shiftKey) {
    event.preventDefault();
    shift();
  }
});

render();
