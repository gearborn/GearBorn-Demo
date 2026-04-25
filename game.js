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
      { name: "Rainbowlt", images: { display: "assets/cars/unlock-rainbowlt-display.png", race: "assets/cars/unlock-rainbowlt-race.png", topdown: "assets/story/unlock-rainbowlt-topdown.png" } },
      { name: "Hornula1", images: { display: "assets/cars/rival-hornula1-display.png", race: "assets/cars/rival-hornula1-race.png", topdown: "assets/story/unlock-hornula1-topdown.png" } }
    ]
  }
];

const starterCarIds = cars.filter((car) => !car.unlockable).map((car) => car.id);
const maxCarLevel = 10;
const storyTracks = [
  { id: "indianapolis", city: "Indianapolis", country: "USA", map: "assets/maps/map-indianapolis.png" },
  { id: "berlin", city: "Berlin", country: "Germany", map: "assets/maps/map-berlin.png" },
  { id: "dubai", city: "Dubai", country: "UAE", map: "assets/maps/map-dubai.png" },
  { id: "rio", city: "Rio de Janeiro", country: "Brazil", map: "assets/maps/map-rio-de-janeiro.png" },
  { id: "los-angeles", city: "Los Angeles", country: "USA", map: "assets/maps/map-los-angeles.png" },
  { id: "seoul", city: "Seoul", country: "South Korea", map: "assets/maps/map-seoul.png" },
  { id: "cape-town", city: "Cape Town", country: "South Africa", map: "assets/maps/map-cape-town.png" },
  { id: "bangalore", city: "Bangalore", country: "India", map: "assets/maps/map-bangalore.png" }
];
const trackItems = {
  tokens: [
    { name: "Nitrous", image: "assets/items/token-nitrous.png", boost: 30 },
    { name: "Gasoline", image: "assets/items/token-gasoline.png", boost: 18 }
  ],
  obstacles: [
    { name: "Cautiongate", image: "assets/items/obstacle-cautiongate.png", penalty: 30 },
    { name: "Car", image: "assets/items/obstacle-car.png", penalty: 24 }
  ]
};
const bosses = [
  { id: "rev-rend", name: "Rev-rend", car: "Crusadome", track: storyTracks[0], difficulty: 0.55, xp: 260, carImage: "assets/story/crusadome-topdown.png", portrait: "assets/bosses/rev-rend.png" },
  { id: "karen", name: "Karen", car: "Baronessex", track: storyTracks[1], difficulty: 1.02, xp: 340, carImage: "assets/story/baronessex-topdown.png", portrait: "assets/bosses/karen.png" },
  { id: "samir", name: "Samir", car: "Shamacht", track: storyTracks[2], difficulty: 1.14, xp: 430, carImage: "assets/cars/whale-shamacht-topdown.png", portrait: "assets/bosses/samir.png" },
  { id: "thais", name: "Thais", car: "Inflewenze", track: storyTracks[3], difficulty: 1.28, xp: 540, carImage: "assets/story/inflewenze-topdown.png", portrait: "assets/bosses/thais.png" },
  { id: "jimmy-chin", name: "Jimmy Chin", car: "Hurrdaboutis", track: storyTracks[4], difficulty: 1.42, xp: 670, carImage: "assets/story/hurrdaboutis-topdown.png", portrait: "assets/bosses/jimmy-chin.png" },
  { id: "rip-lee", name: "Rip Lee", car: "Matunnie", track: storyTracks[5], difficulty: 1.56, xp: 820, carImage: "assets/cars/rabbit-matunnie-topdown.png", portrait: "assets/bosses/rip-lee.png" },
  { id: "jabu", name: "Jabu", car: "Kuumbusta", track: storyTracks[6], difficulty: 1.72, xp: 990, carImage: "assets/story/kuumbusta-topdown.png", portrait: "assets/bosses/jabu.png" },
  { id: "pallavi", name: "Pallavi", car: "Kermajesty", track: storyTracks[7], difficulty: 1.9, xp: 1200, carImage: "assets/cars/frog-kermajesty-topdown.png", portrait: "assets/bosses/pallavi.png" }
];
const timeMedals = [
  { key: "gold", label: "Gold", difficulty: "Hard", xp: 420, base: 14.5 },
  { key: "silver", label: "Silver", difficulty: "Medium", xp: 260, base: 17.5 },
  { key: "bronze", label: "Bronze", difficulty: "Easy", xp: 150, base: 21.0 }
];
const vindexEntries = [
  ["010", "Bananachi", "Monkey Line", "assets/cars/rival-bananachi-display.png"],
  ["032", "Manstrocity", "Armadillo Dad Line", "assets/cars/rival-manstrocity-display.png"],
  ["037", "Beardo", "Mustache Line", "assets/cars/rival-beardo-display.png"],
  ["039", "Baybee", "Bee Line", "assets/cars/bee-baybee-display.png"],
  ["040", "Syndrone", "Bee Line", "assets/cars/bee-syndrone-display.png"],
  ["041", "Motonarch", "Bee Line", "assets/cars/bee-motonarch-display.png"],
  ["058", "Murrka", "Pickup Truck Line", "assets/cars/pickup-murrka-display.png"],
  ["059", "Wallmort", "Pickup Truck Line", "assets/cars/pickup-wallmort-display.png"],
  ["060", "Tookerjaw", "Pickup Truck Line", "assets/cars/pickup-tookerjaw-display.png"],
  ["066", "Hogson", "Pig Line", "assets/cars/pig-hogson-display.png"],
  ["067", "Snoffle", "Pig Line", "assets/cars/pig-snoffle-display.png"],
  ["068", "Swinecroft", "Pig Line", "assets/cars/pig-swinecroft-display.png"],
  ["082", "Phantaxi", "Ghost Taxi Line", "assets/story/phantaxi-display.png"],
  ["091", "Bunnae", "Rabbit Line", "assets/cars/rabbit-bunnae-display.png"],
  ["092", "Lopstar", "Rabbit Line", "assets/cars/rabbit-lopstar-display.png"],
  ["093", "Matunnie", "Rabbit Line", "assets/cars/rabbit-matunnie-display.png"],
  ["151", "Totorca", "Whale Line", "assets/cars/whale-totorca-display.png"],
  ["152", "Boates", "Whale Line", "assets/cars/whale-boates-display.png"],
  ["153", "Shamacht", "Whale Line", "assets/cars/whale-shamacht-display.png"],
  ["231", "Rivvir", "Frog Line", "assets/cars/frog-rivvir-display.png"],
  ["232", "Croakra", "Frog Line", "assets/cars/frog-croakra-display.png"],
  ["233", "Kermajesty", "Frog Line", "assets/cars/frog-kermajesty-display.png"],
  ["251", "Inflewenze", "Influencer Line", "assets/story/inflewenze-display.png"],
  ["287", "Sponsore", "Bumper Sticker Line", "assets/cars/rival-sponsore-display.png"],
  ["296", "Baronessex", "German Discipline Line", "assets/story/baronessex-display.png"],
  ["298", "Crusadome", "Crusader Line", "assets/cars/rival-crusadome-display.png"],
  ["301", "Kuumbusta", "Combustion Line", "assets/story/kuumbusta-display.png"],
  ["305", "Hurrdaboutis", "Roundabout Line", "assets/story/hurrdaboutis-display.png"],
  ["326", "Rainbowlt", "Unicorn Supercar Line", "assets/cars/unlock-rainbowlt-display.png"],
  ["327", "Hornula1", "Unicorn Supercar Line", "assets/cars/rival-hornula1-display.png"]
].map(([number, name, line, image]) => ({ number, name, line, image }));
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
  selectedBoss: bosses[0].id,
  selectedStoryCar: cars[0].id,
  selectedTimeCar: cars[0].id,
  selectedTimeTrack: storyTracks[0].id,
  selectedVindex: vindexEntries[0].number,
  highestBossIndex: 0,
  timeTrials: {},
  garage: Object.fromEntries(cars.map((car) => [car.id, { level: 1, xp: 0, evolution: 0, pendingEvolution: null }]))
};

let state = loadState();
sanitizeState();
let race = null;
let lastFrame = 0;
let evolutionModal = null;
let verticalRace = null;

const el = {
  views: document.querySelectorAll(".view"),
  navButtons: document.querySelectorAll("[data-view]"),
  playerCar: document.querySelector("#player-car"),
  storyCar: document.querySelector("#story-car"),
  timeCar: document.querySelector("#time-car"),
  timeTrack: document.querySelector("#time-track"),
  bossList: document.querySelector("#boss-list"),
  startStory: document.querySelector("#start-story"),
  startTimeTrial: document.querySelector("#start-time-trial"),
  storyTrack: document.querySelector("#story-track"),
  timeTrialTrack: document.querySelector("#time-trial-track"),
  storyPlayer: document.querySelector("#story-player"),
  storyBoss: document.querySelector("#story-boss"),
  timePlayer: document.querySelector("#time-player"),
  timeGhost: document.querySelector("#time-ghost"),
  storyLocation: document.querySelector("#story-location"),
  storySpeed: document.querySelector("#story-speed"),
  storyDistance: document.querySelector("#story-distance"),
  storyCountdown: document.querySelector("#story-countdown"),
  storyMapStart: document.querySelector("#story-map-start"),
  storyMessage: document.querySelector("#story-message"),
  timeLocation: document.querySelector("#time-location"),
  timeClock: document.querySelector("#time-clock"),
  timeDistance: document.querySelector("#time-distance"),
  timeCountdown: document.querySelector("#time-countdown"),
  timeMapStart: document.querySelector("#time-map-start"),
  timeMessage: document.querySelector("#time-message"),
  timeTargets: document.querySelector("#time-targets"),
  vindexList: document.querySelector("#vindex-list"),
  vindexArt: document.querySelector("#vindex-art"),
  vindexNumber: document.querySelector("#vindex-number"),
  vindexName: document.querySelector("#vindex-name"),
  vindexLine: document.querySelector("#vindex-line"),
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
  closeEvolution: document.querySelector("#close-evolution"),
  bossModal: document.querySelector("#boss-modal"),
  bossPortrait: document.querySelector("#boss-portrait"),
  bossModalTitle: document.querySelector("#boss-modal-title"),
  bossModalKicker: document.querySelector("#boss-modal-kicker"),
  bossModalCopy: document.querySelector("#boss-modal-copy"),
  continueBoss: document.querySelector("#continue-boss")
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
    timeTrials: { ...base.timeTrials, ...saved.timeTrials },
    garage: { ...base.garage, ...saved.garage }
  };
}

function saveState() {
  localStorage.setItem(saveKey, JSON.stringify(state));
}

function sanitizeState() {
  state.unlockedCars = state.unlockedCars || {};
  state.timeTrials = state.timeTrials || {};
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
  if (!bosses.some((boss) => boss.id === state.selectedBoss)) state.selectedBoss = bosses[0].id;
  state.highestBossIndex = Math.min(state.highestBossIndex || 0, bosses.length - 1);
  if (bosses.findIndex((boss) => boss.id === state.selectedBoss) > state.highestBossIndex) {
    state.selectedBoss = bosses[state.highestBossIndex].id;
  }
  if (!storyTracks.some((track) => track.id === state.selectedTimeTrack)) state.selectedTimeTrack = storyTracks[0].id;
  if (!vindexEntries.some((entry) => entry.number === state.selectedVindex)) state.selectedVindex = vindexEntries[0].number;
  if (!cars.some((car) => car.id === state.selectedStoryCar) || !isCarUnlocked(state.selectedStoryCar)) state.selectedStoryCar = cars[0].id;
  if (!cars.some((car) => car.id === state.selectedTimeCar) || !isCarUnlocked(state.selectedTimeCar)) state.selectedTimeCar = cars[0].id;
  cars.forEach((car) => {
    state.garage[car.id] = state.garage[car.id] || { level: 1, xp: 0, evolution: 0, pendingEvolution: null };
    state.garage[car.id].level = Math.min(maxCarLevel, state.garage[car.id].level || 1);
    if (state.garage[car.id].level >= maxCarLevel) {
      state.garage[car.id].xp = 0;
    }
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
  if (level >= maxCarLevel) return 0;
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
  renderVerticalSelects();
  renderBosses();
  renderTimeTargets();
  renderVindex();
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

function renderVerticalSelects() {
  const options = cars.filter((car) => isCarUnlocked(car.id)).map((car) => {
    const progress = state.garage[car.id];
    const form = currentEvolution(car.id);
    return `<option value="${car.id}">${form.name} · Lv ${progress.level}</option>`;
  }).join("");
  el.storyCar.innerHTML = options;
  el.timeCar.innerHTML = options;
  el.storyCar.value = state.selectedStoryCar;
  el.timeCar.value = state.selectedTimeCar;
  el.timeTrack.innerHTML = storyTracks.map((track) => `<option value="${track.id}">${track.city}, ${track.country}</option>`).join("");
  el.timeTrack.value = state.selectedTimeTrack;
}

function renderBosses() {
  el.bossList.innerHTML = bosses.map((boss, index) => {
    const active = boss.id === state.selectedBoss;
    const locked = index > state.highestBossIndex;
    return `
      <button class="boss-button ${active ? "active" : ""} ${locked ? "locked" : ""}" type="button" data-boss="${boss.id}" ${locked ? "disabled" : ""}>
        <strong>${index + 1}. ${boss.name}</strong>
        <small>${locked ? "Locked" : `${boss.track.city}, ${boss.track.country} · ${boss.car} · ${boss.xp} XP`}</small>
      </button>
    `;
  }).join("");
  const boss = bosses.find((item) => item.id === state.selectedBoss);
  el.storyLocation.textContent = `${boss.track.city}, ${boss.track.country}`;
  applyTrackMap(el.storyTrack, boss.track);
}

function renderTimeTargets() {
  const trackIndex = storyTracks.findIndex((track) => track.id === state.selectedTimeTrack);
  const best = state.timeTrials[state.selectedTimeTrack]?.bestTime;
  el.timeLocation.textContent = trackLabel(state.selectedTimeTrack);
  applyTrackMap(el.timeTrialTrack, storyTracks.find((track) => track.id === state.selectedTimeTrack));
  el.timeTargets.innerHTML = timeMedals.map((medal) => {
    const target = timeTarget(medal, trackIndex);
    return `<div><span>${medal.label} · ${medal.difficulty}</span><strong>${target.toFixed(2)} s · ${medal.xp} XP</strong></div>`;
  }).join("") + `<div><span>Best</span><strong>${best ? `${best.toFixed(2)} s` : "No run yet"}</strong></div>`;
}

function renderVindex() {
  el.vindexList.innerHTML = vindexEntries.map((entry) => `
    <button class="vindex-button ${entry.number === state.selectedVindex ? "active" : ""}" type="button" data-vindex="${entry.number}">
      <span>#${entry.number}</span>
      <strong>${entry.name}</strong>
    </button>
  `).join("");
  const entry = vindexEntries.find((item) => item.number === state.selectedVindex);
  el.vindexArt.innerHTML = displayMarkup(entry.image, entry.name, "#52c7ff");
  el.vindexNumber.textContent = `#${entry.number}`;
  el.vindexName.textContent = entry.name;
  el.vindexLine.textContent = entry.line;
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
    const maxed = progress.level >= maxCarLevel;
    const pct = maxed ? 100 : Math.min(100, (progress.xp / next) * 100);
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
            <span>${maxed ? "Max Level" : `${progress.xp} / ${next} XP`}</span>
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
  if (progress.level >= maxCarLevel) {
    progress.level = maxCarLevel;
    progress.xp = 0;
    return {
      leveledUp: false,
      level: progress.level,
      name: currentEvolution(carId).name
    };
  }
  progress.xp += amount;
  while (progress.level < maxCarLevel && progress.xp >= xpForNextLevel(progress.level)) {
    progress.xp -= xpForNextLevel(progress.level);
    progress.level += 1;
    const newEvolution = maxEligibleEvolutionForCar(carId, progress.level);
    if (newEvolution > progress.evolution) {
      progress.pendingEvolution = progress.pendingEvolution || progress.evolution + 1;
    }
  }
  if (progress.level >= maxCarLevel) {
    progress.level = maxCarLevel;
    progress.xp = 0;
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
  if (role === "topdown" && entry.images?.race) {
    return entry.images.race.replace("-race.", "-topdown.");
  }
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

function displayMarkup(image, alt, color) {
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${alt}" onerror="this.closest('.car').classList.remove('has-image')">` : "";
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

function trackLabel(trackId) {
  const track = storyTracks.find((item) => item.id === trackId);
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
  return bosses.find((boss) => boss.id === state.selectedBoss);
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

function openBossIntro() {
  const boss = selectedBoss();
  const bossIndex = bosses.findIndex((item) => item.id === boss.id);
  if (bossIndex > state.highestBossIndex) {
    el.storyMessage.className = "race-message loss";
    el.storyMessage.textContent = "Beat the previous boss to unlock this challenge.";
    return;
  }
  el.bossModalKicker.textContent = `${boss.track.city}, ${boss.track.country}`;
  el.bossModalTitle.textContent = `${boss.name} challenges you`;
  el.bossModalCopy.textContent = `${boss.name} drives the ${boss.car}. Finish first to earn ${boss.xp} XP.`;
  el.bossPortrait.innerHTML = `<img src="${boss.portrait}" alt="${boss.name}" onerror="this.remove()">`;
  el.bossModal.classList.add("active");
  el.bossModal.setAttribute("aria-hidden", "false");
  el.continueBoss.focus();
}

function closeBossIntro() {
  el.bossModal.classList.remove("active");
  el.bossModal.setAttribute("aria-hidden", "true");
}

function beginVerticalRace(mode, waitForStart = false) {
  const isStory = mode === "story";
  const trackNode = isStory ? el.storyTrack : el.timeTrialTrack;
  const carId = isStory ? state.selectedStoryCar : state.selectedTimeCar;
  const stats = carStats(carId);
  const boss = isStory ? selectedBoss() : null;
  const trackId = isStory ? boss.track.id : state.selectedTimeTrack;
  const trackIndex = storyTracks.findIndex((track) => track.id === trackId);
  const playerNode = isStory ? el.storyPlayer : el.timePlayer;
  const bossNode = isStory ? el.storyBoss : null;
  const ghostNode = isStory ? null : el.timeGhost;
  setTopCar(playerNode, topDownImageForCar(carId), currentEvolution(carId).name, cars.find((car) => car.id === carId).color);
  if (bossNode) setTopCar(bossNode, boss.carImage, boss.car, "#f25f5c");
  if (ghostNode) setTopCar(ghostNode, "assets/story/phantaxi-topdown.png", "Phantaxi", "#c084fc");

  verticalRace = {
    mode,
    active: false,
    trackNode,
    carId,
    trackId,
    targetDistance: isStory ? 500 : 1000,
    startTime: performance.now(),
    last: performance.now(),
    player: { x: 42, y: 88, speed: 58, distance: 0, node: playerNode },
    boss: boss ? { x: 58, y: 88, speed: 38 + boss.difficulty * 11, distance: 0, node: bossNode, difficulty: boss.difficulty } : null,
    ghost: state.timeTrials[trackId]?.ghost || null,
    ghostNode,
    stats,
    bossData: boss,
    trackIndex,
    items: [],
    spawnTimer: 0,
    keys: {},
    record: [],
    countdownStarted: false,
    finished: false
  };
  clearTrackItems(trackNode);
  updateVerticalPositions();
  if (isStory) {
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
  const isStory = raceStateRef.mode === "story";
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
  raceState.player.x += ((keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0)) * 58 * dt;
  const targetY = 90 - Math.min(42, (raceState.player.distance / raceState.targetDistance) * 42);
  raceState.player.y += (targetY - raceState.player.y) * 1.8 * dt;
  raceState.player.y += ((keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0)) * 22 * dt;
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
    racer.speed = Math.min(verticalRace.stats.maxSpeed, racer.speed + item.config.boost);
    racer.distance = Math.min(verticalRace.targetDistance, racer.distance + 24);
    racer.y = Math.max(28, racer.y - 9);
  } else {
    racer.speed = Math.max(20, racer.speed - item.config.penalty);
    racer.distance = Math.max(0, racer.distance - 18);
    racer.y = Math.min(94, racer.y + 11);
  }
  item.node.remove();
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
  if (raceState.mode === "story") {
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
  raceState.countdownStarted = false;
  el.storyMapStart.classList.remove("active");
  el.timeMapStart.classList.remove("active");
  const elapsed = (performance.now() - raceState.startTime) / 1000;
  if (raceState.mode === "story") {
    const xp = playerWon ? raceState.bossData.xp : Math.floor(raceState.bossData.xp * 0.18);
    const xpResult = addXp(raceState.carId, xp);
    if (playerWon) {
      const bossIndex = bosses.findIndex((boss) => boss.id === raceState.bossData.id);
      if (bossIndex === state.highestBossIndex && state.highestBossIndex < bosses.length - 1) {
        state.highestBossIndex += 1;
      }
    }
    el.storyMessage.className = `race-message ${playerWon ? "win" : "loss"}`;
    const nextBoss = playerWon && state.highestBossIndex < bosses.length
      ? bosses[state.highestBossIndex]
      : null;
    const unlockText = nextBoss && nextBoss.id !== raceState.bossData.id ? ` ${nextBoss.name} is now unlocked.` : "";
    el.storyMessage.textContent = raceResultMessage(`${playerWon ? "Victory" : "Defeat"}. ${currentEvolution(raceState.carId).name} earned ${xp} XP.${unlockText}`, xpResult);
  } else {
    const trackIndex = raceState.trackIndex;
    const beaten = timeMedals.find((medal) => elapsed <= timeTarget(medal, trackIndex));
    const xp = beaten ? beaten.xp : 40;
    const xpResult = addXp(raceState.carId, xp);
    const best = state.timeTrials[raceState.trackId]?.bestTime;
    if (!best || elapsed < best) {
      state.timeTrials[raceState.trackId] = { bestTime: elapsed, ghost: raceState.record.filter((_, index) => index % 4 === 0) };
    }
    el.timeMessage.className = `race-message ${beaten ? "win" : ""}`;
    el.timeMessage.textContent = raceResultMessage(`${elapsed.toFixed(2)} seconds. ${beaten ? `${beaten.label} beaten` : "Finish recorded"}. ${currentEvolution(raceState.carId).name} earned ${xp} XP.`, xpResult);
  }
  saveState();
  render();
  showPendingEvolution(raceState.carId);
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

el.storyCar.addEventListener("change", (event) => {
  state.selectedStoryCar = event.target.value;
  saveState();
  render();
});

el.timeCar.addEventListener("change", (event) => {
  state.selectedTimeCar = event.target.value;
  saveState();
  render();
});

el.timeTrack.addEventListener("change", (event) => {
  state.selectedTimeTrack = event.target.value;
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
el.startStory.addEventListener("click", openBossIntro);
el.continueBoss.addEventListener("click", () => {
  closeBossIntro();
  beginVerticalRace("story", true);
});
el.startTimeTrial.addEventListener("click", () => beginVerticalRace("time", true));
el.storyMapStart.addEventListener("click", startVerticalCountdown);
el.timeMapStart.addEventListener("click", startVerticalCountdown);

el.bossList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-boss]");
  if (!button) return;
  state.selectedBoss = button.dataset.boss;
  saveState();
  render();
});

el.vindexList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-vindex]");
  if (!button) return;
  state.selectedVindex = button.dataset.vindex;
  saveState();
  renderVindex();
});

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
  if (verticalRace?.active && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS"].includes(event.code)) {
    event.preventDefault();
    verticalRace.keys[event.code] = true;
  }
  if (event.key === "Escape" && el.resetModal.classList.contains("active")) {
    closeResetModal();
    return;
  }
  if (event.key === "Escape" && el.bossModal.classList.contains("active")) {
    closeBossIntro();
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

document.addEventListener("keyup", (event) => {
  if (verticalRace?.keys) {
    verticalRace.keys[event.code] = false;
  }
});

render();
