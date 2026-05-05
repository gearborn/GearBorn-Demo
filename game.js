const distances = [
  { meters: 400, label: "400 m", xp: 80, difficulty: 0.9 },
  { meters: 800, label: "800 m", xp: 180, difficulty: 1.05 },
  { meters: 1600, label: "1600 m", xp: 420, difficulty: 1.22 }
];
const dragNitroMultiplier = 1.25;
const dragNitroDuration = 1.7;

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
    family: "Bee-cycle",
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
    family: "Patriot Pickup",
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
    family: "Detective Pig",
    color: "#f4a7b9",
    trait: "Stable power",
    unlockable: true,
    evolutions: [
      { name: "Hogson", images: { display: "assets/cars/pig-hogson-display.png", race: "assets/cars/pig-hogson-race.png" } },
      { name: "Snoffle", images: { display: "assets/cars/pig-snoffle-display.png", race: "assets/cars/pig-snoffle-race.png" } },
      { name: "Swinecroft", images: { display: "assets/cars/pig-swinecroft-display.png", race: "assets/cars/pig-swinecroft-race.png" } }
    ]
  },
  {
    id: "rabbit",
    family: "K-Pop Bunny",
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
    family: "Yacht Rock Whale",
    color: "#52c7ff",
    trait: "High top speed",
    unlockable: true,
    evolutions: [
      { name: "Totorca", images: { display: "assets/cars/whale-totorca-display.png", race: "assets/cars/whale-totorca-race.png" } },
      { name: "Boates", images: { display: "assets/cars/whale-boates-display.png", race: "assets/cars/whale-boates-race.png" } },
      { name: "Shamacht", images: { display: "assets/cars/whale-shamacht-display.png", race: "assets/cars/whale-shamacht-race.png" } }
    ]
  },
  {
    id: "frog",
    family: "Exulted Frog",
    color: "#6ee7a8",
    trait: "Late race surge",
    unlockable: true,
    evolutions: [
      { name: "Rivvir", images: { display: "assets/cars/frog-rivvir-display.png", race: "assets/cars/frog-rivvir-race.png" } },
      { name: "Croakra", images: { display: "assets/cars/frog-croakra-display.png", race: "assets/cars/frog-croakra-race.png" } },
      { name: "Kermajesty", images: { display: "assets/cars/frog-kermajesty-display.png", race: "assets/cars/frog-kermajesty-race.png" } }
    ]
  },
  {
    id: "techno-dinosaur",
    family: "Techno Dinosaur",
    color: "#7bdff2",
    trait: "Power surges",
    unlockable: true,
    evolutions: [
      { name: "Shufflodon", images: { display: "assets/cars/techno-dinosaur-shufflodon-display.png", race: "assets/cars/techno-dinosaur-shufflodon-race.png", topdown: "assets/cars/techno-dinosaur-shufflodon-topdown.png" } },
      { name: "Dropatops", images: { display: "assets/cars/techno-dinosaur-dropatops-display.png", race: "assets/cars/techno-dinosaur-dropatops-race.png", topdown: "assets/cars/techno-dinosaur-dropatops-topdown.png" } },
      { name: "K-Wrex", images: { display: "assets/cars/techno-dinosaur-k-wrex-display.png", race: "assets/cars/techno-dinosaur-k-wrex-race.png", topdown: "assets/cars/techno-dinosaur-k-wrex-topdown.png" } }
    ]
  },
  {
    id: "sorority-elephant",
    family: "Sorority Elephant",
    color: "#c084fc",
    trait: "Prestige cruising",
    unlockable: true,
    evolutions: [
      { name: "Elepledge", images: { display: "assets/cars/sorority-elephant-elepledge-display.png", race: "assets/cars/sorority-elephant-elepledge-race.png", topdown: "assets/cars/sorority-elephant-elepledge-topdown.png" } },
      { name: "Sororitrunk", images: { display: "assets/cars/sorority-elephant-sororitrunk-display.png", race: "assets/cars/sorority-elephant-sororitrunk-race.png", topdown: "assets/cars/sorority-elephant-sororitrunk-topdown.png" } },
      { name: "Plaidonna", images: { display: "assets/cars/sorority-elephant-plaidonna-display.png", race: "assets/cars/sorority-elephant-plaidonna-race.png", topdown: "assets/cars/sorority-elephant-plaidonna-topdown.png" } }
    ]
  },
  {
    id: "florida-gator",
    family: "Florida Gator",
    color: "#6ee7a8",
    trait: "Chaos brawling",
    unlockable: true,
    evolutions: [
      { name: "Gladigator", images: { display: "assets/cars/florida-gator-gladigator-display.png", race: "assets/cars/florida-gator-gladigator-race.png", topdown: "assets/cars/florida-gator-gladigator-topdown.png" } },
      { name: "Swampagne", images: { display: "assets/cars/florida-gator-swampagne-display.png", race: "assets/cars/florida-gator-swampagne-race.png", topdown: "assets/cars/florida-gator-swampagne-topdown.png" } },
      { name: "Fourcroco", images: { display: "assets/cars/florida-gator-fourcroco-display.png", race: "assets/cars/florida-gator-fourcroco-race.png", topdown: "assets/cars/florida-gator-fourcroco-topdown.png" } }
    ]
  },
  {
    id: "grunge-fish",
    family: "Grunge Fish",
    color: "#8fb3ff",
    trait: "Dirty thrasher",
    unlockable: true,
    evolutions: [
      { name: "Moshfin", images: { display: "assets/cars/fish-moshfin-display.png", race: "assets/cars/fish-moshfin-race.png", topdown: "assets/cars/fish-moshfin-topdown.png" } },
      { name: "Barracobain", images: { display: "assets/cars/fish-barracobain-display.png", race: "assets/cars/fish-barracobain-race.png", topdown: "assets/cars/fish-barracobain-topdown.png" } },
      { name: "Vedderanha", images: { display: "assets/cars/fish-vedderanha-display.png", race: "assets/cars/fish-vedderanha-race.png", topdown: "assets/cars/fish-vedderanha-topdown.png" } }
    ]
  },
  {
    id: "karate-cow",
    family: "Karate Cow",
    color: "#f8f1df",
    trait: "Deceptive power",
    unlockable: true,
    evolutions: [
      { name: "Udderlee", images: { display: "assets/cars/cow-udderlee-display.png", race: "assets/cars/cow-udderlee-race.png", topdown: "assets/cars/cow-udderlee-topdown.png" } },
      { name: "Moosan", images: { display: "assets/cars/cow-moosan-display.png", race: "assets/cars/cow-moosan-race.png", topdown: "assets/cars/cow-moosan-topdown.png" } },
      { name: "Grandmooster", images: { display: "assets/cars/cow-grandmooster-display.png", race: "assets/cars/cow-grandmooster-race.png", topdown: "assets/cars/cow-grandmooster-topdown.png" } }
    ]
  },
  {
    id: "art-van",
    family: "Art Van",
    color: "#f6f1e8",
    trait: "Achievement form mastery",
    unlockable: true,
    evolutions: [
      { name: "Vanvass", style: "Blank Canvas", images: { display: "assets/cars/art-vanvass-display.png", race: "assets/cars/art-vanvass-race.png", topdown: "assets/cars/art-vanvass-topdown.png" } },
      { name: "Vandinsky", style: "Abstract", formBonus: { torque: 3, powertrain: 3 }, images: { display: "assets/cars/art-vandinsky-display.png", race: "assets/cars/art-vandinsky-race.png", topdown: "assets/cars/art-vandinsky-topdown.png" } },
      { name: "Vanbrandt", style: "Baroque", formBonus: { body: 3, powertrain: 3 }, images: { display: "assets/cars/art-vanbrandt-display.png", race: "assets/cars/art-vanbrandt-race.png", topdown: "assets/cars/art-vanbrandt-topdown.png" } },
      { name: "Vancasso", style: "Cubist", formBonus: { body: 3, handling: 3 }, images: { display: "assets/cars/art-vancasso-display.png", race: "assets/cars/art-vancasso-race.png", topdown: "assets/cars/art-vancasso-topdown.png" } },
      { name: "Vangas", style: "Impressionist", formBonus: { acceleration: 3, torque: 3 }, images: { display: "assets/cars/art-vangas-display.png", race: "assets/cars/art-vangas-race.png", topdown: "assets/cars/art-vangas-topdown.png" } },
      { name: "Vandy-Warhol", style: "Pop Art", formBonus: { speed: 3, acceleration: 3 }, images: { display: "assets/cars/art-vandy-warhaul-display.png", race: "assets/cars/art-vandy-warhaul-race.png", topdown: "assets/cars/art-vandy-warhaul-topdown.png" } },
      { name: "Vanksy", style: "Graffiti", formBonus: { handling: 3, acceleration: 3 }, images: { display: "assets/cars/art-vanksy-display.png", race: "assets/cars/art-vanksy-race.png", topdown: "assets/cars/art-vanksy-topdown.png" } },
      { name: "Vanst", style: "Surrealist", formBonus: { speed: 3, powertrain: 3 }, images: { display: "assets/cars/art-vanst-display.png", race: "assets/cars/art-vanst-race.png", topdown: "assets/cars/art-vanst-topdown.png" } }
    ]
  },
  {
    id: "cake-train",
    family: "Cake Train",
    color: "#f8c8dc",
    trait: "Sugar juggernaut",
    unlockable: true,
    evolutions: [
      { name: "Cuptrack", images: { display: "assets/cars/cake-cuptrack-display.png", race: "assets/cars/cake-cuptrack-race.png", topdown: "assets/cars/cake-cuptrack-topdown.png" } },
      { name: "Isittrain", images: { display: "assets/cars/cake-isittrain-display.png", race: "assets/cars/cake-isittrain-race.png", topdown: "assets/cars/cake-isittrain-topdown.png" } },
      { name: "Fonductor", images: { display: "assets/cars/cake-fonductor-display.png", race: "assets/cars/cake-fonductor-race.png", topdown: "assets/cars/cake-fonductor-topdown.png" } }
    ]
  },
  {
    id: "rainbowlt",
    family: "Secret",
    color: "#c084fc",
    trait: "Unlocked by mastering every starter line",
    unlockable: true,
    unlockInstruction: "Evolve all the cars to unlock",
    evolutions: [
      { name: "Rainbowlt", images: { display: "assets/cars/unlock-rainbowlt-display.png", race: "assets/cars/unlock-rainbowlt-race.png", topdown: "assets/story/unlock-rainbowlt-topdown.png" } },
      { name: "Hornula1", images: { display: "assets/cars/rival-hornula1-display.png", race: "assets/cars/rival-hornula1-race.png", topdown: "assets/story/unlock-hornula1-topdown.png" } }
    ]
  }
  ,
  {
    id: "metal-snake",
    family: "Metal Snake",
    color: "#d45b36",
    trait: "Heavy burner",
    tutorialOnly: true,
    evolutions: [
      { name: "Mamburn", images: { display: "assets/cars/snake-mamburn-display.png", race: "assets/cars/snake-mamburn-race.png", topdown: "assets/cars/snake-mamburn-topdown.png" } },
      { name: "Snaytan", images: { display: "assets/cars/snake-snaytan-display.png", race: "assets/cars/snake-mamburn-race.png", topdown: "assets/cars/snake-mamburn-topdown.png" } }
    ]
  },
  {
    id: "training-car",
    family: "Training Car",
    color: "#9aa7b7",
    trait: "Student driver",
    tutorialOnly: true,
    evolutions: [
      { name: "Tutorque", images: { display: "assets/cars/tutorque-display.png", race: "assets/cars/tutorque-race.png", topdown: "assets/cars/tutorque-topdown.png" } }
    ]
  }
];

const defaultUnlockedLines = ["bee", "pickup", "rabbit"];
const pinkSlipUnlockOrder = ["pig", "sorority-elephant", "grunge-fish", "florida-gator", "whale", "techno-dinosaur", "karate-cow", "frog"];
const coreGearbornLineIds = defaultUnlockedLines.concat(pinkSlipUnlockOrder);
const starterCarIds = coreGearbornLineIds;
const rivalStarterCarIds = defaultUnlockedLines;
const achievementUnlockOrder = ["art-van", "cake-train"];
const garageLineOrder = defaultUnlockedLines.concat(pinkSlipUnlockOrder, achievementUnlockOrder, ["rainbowlt", "metal-snake", "training-car"]);
const maxCarLevel = 10;
const tutorialCarId = "metal-snake";
const tutorialOpponentCarId = "training-car";
const tutorialTrack = { id: "training-school", city: "Spindell Training Academy", country: "Training", map: "assets/maps/training-bg.png", cityMap: "assets/maps/training-bg.png", cityIcon: "assets/maps/cityicon-training.png" };
const tutorialDistance = { meters: 400, label: "400 m", xp: 80, difficulty: 0.55 };
const tutorialRank = { key: "F", name: "Tutorque", xpBonus: 1, power: 0.28, color: "#9aa7b7", images: { display: "assets/cars/tutorque-display.png", race: "assets/cars/tutorque-race.png" } };
const tutorialMedals = [
  { key: "gold", label: "Gold", difficulty: "Hard", xp: 420, base: 16.0 },
  { key: "silver", label: "Silver", difficulty: "Medium", xp: 260, base: 19.0 },
  { key: "bronze", label: "Bronze", difficulty: "Easy", xp: 150, base: 23.0 }
];

// Tutorial scene IDs — each maps to a dialogue block and a view/flow
const tutorialScenes = [
  // ── Intro ───────────────────────────────────────────────────────────────────
  { id: "intro",           label: "Intro",           view: "menu" },
  // ── Car select (tutorial-exclusive, Mamburn only) ─────────────────────────
  { id: "mamburn",         label: "Mamburn",          view: "play",       flow: "car" },
  // ── City map (Spindell Training Academy) ──────────────────────────────────
  { id: "city-map",        label: "City Map",         view: "story" },
  // ── Drag race ─────────────────────────────────────────────────────────────
  { id: "drag-race-intro", label: "Drag Race Intro",  view: "story" },
  { id: "drag-race",       label: "Drag Race",        view: "play",       flow: "match" },
  { id: "dr-controls",     label: "DR Controls",      view: "play",       flow: "race" },
  { id: "sprox",           label: "Drag Race Win",    view: "play",       wait: true },
  // ── Time trial ────────────────────────────────────────────────────────────
  { id: "drag2tt",         label: "Drag→TT",          view: "story" },
  { id: "time-trial-intro",label: "Time Trial Intro", view: "story" },
  { id: "time-trial",      label: "Time Trial",       view: "time-trial", flow: "match" },
  { id: "tt-controls",     label: "TT Controls",      view: "time-trial", flow: "race" },
  { id: "tt-after",        label: "Time Trial Win",   view: "time-trial", wait: true },
  // ── Battle ────────────────────────────────────────────────────────────────
  { id: "tt2battle",       label: "TT→Battle",        view: "story" },
  { id: "battle-intro",    label: "Battle Intro",     view: "story" },
  { id: "battle",          label: "Battle",           view: "battle",     flow: "match" },
  { id: "pre-battle",      label: "Pre-Battle",       view: "battle",     flow: "race" },
  { id: "post-battle",     label: "Battle Win",       view: "battle",     wait: true },
  // ── Garage / Upgrade / Evolve ─────────────────────────────────────────────
  { id: "garage",          label: "Garage",           view: "garage" },
  { id: "upgrade",         label: "Upgrade",          view: "garage" },
  { id: "evolve",          label: "Evolve",           view: "garage",     wait: true },
  { id: "evolved-form",    label: "Evolved Form",     view: "garage" },
  // ── VINdex ────────────────────────────────────────────────────────────────
  { id: "vindex",          label: "VINdex",           view: "vindex" },
  // ── The Forge ─────────────────────────────────────────────────────────────
  { id: "achievements",    label: "Achievements",     view: "achievements" },
  { id: "the-forge",       label: "The Forge",        view: "garage" },
  // ── Post-forge unlock ─────────────────────────────────────────────────────
  { id: "unlocked",        label: "Unlocked",         view: "garage" },
  // ── End ───────────────────────────────────────────────────────────────────
  { id: "starters",        label: "Starters",         view: "garage" }
];

// Scene-select options shown in Replay Tutorial modal
const tutorialSceneSelectOptions = [
  { label: "Drag Race",   scene: "drag-race-intro" },
  { label: "Time Trial",  scene: "time-trial-intro" },
  { label: "Battle",      scene: "battle-intro" },
  { label: "Garage",      scene: "garage" },
  { label: "VINdex",      scene: "vindex" },
  { label: "The Forge",   scene: "the-forge" }
];
const gearbornKeyImage = "assets/items/item-gearbornkey.png";
const partTypes = [
  { id: "rocketFuel", name: "Rocket Fuel", attr: "speed", label: "SPD", image: "assets/items/parts-rocket-fuel.png" },
  { id: "warpStarter", name: "Warp Starter", attr: "acceleration", label: "ACC", image: "assets/items/parts-warp-starter.png" },
  { id: "ghostDriftTires", name: "Ghost Drift Tires", attr: "handling", label: "HDL", image: "assets/items/parts-ghost-drift-tires.png" },
  { id: "earthquakeAxle", name: "Earthquake Axle", attr: "torque", label: "TRQ", image: "assets/items/parts-earthquake-axle.png" },
  { id: "bouncebackBumper", name: "Bounceback Bumper", attr: "body", label: "BDY", image: "assets/items/parts-bounceback-bumper.png" },
  { id: "omniCore", name: "Omni Core", attr: "powertrain", label: "PWR", image: "assets/items/parts-omni-core.png" }
];
const partLevels = {
  1: { bonus: 1, stars: "★" },
  2: { bonus: 3, stars: "★★" }
};
const partVariants = partTypes.flatMap((part) => [1, 2].map((level) => ({
  ...part,
  level,
  key: `${part.id}_lvl${level}`,
  bonus: partLevels[level].bonus,
  stars: partLevels[level].stars
})));
const artVanUnlockByAchievement = {
  streak5: 0,
  allBattles: 1,
  vindex100: 2,
  allRivals: 3,
  allBosses: 4,
  allPinkSlips: 5,
  allDrags: 6,
  allTrials: 7
};
const achievementDefs = [
  { id: "streak5", name: "Hot Streak", requirement: "Win 5 races in a row", reward: "Unlock Vanvass", type: "streak", target: 5 },
  { id: "allDrags", name: "Drag Dominator", requirement: "Win all Drag Races in Story Mode", reward: "Unlock Vanksy", type: "storyType", raceType: "drag" },
  { id: "allTrials", name: "Clock Breaker", requirement: "Win all Time Trials in Story Mode", reward: "Unlock Vanst", type: "storyType", raceType: "trial" },
  { id: "allBattles", name: "Arena Artist", requirement: "Win all Battles in Story Mode", reward: "Unlock Vandinsky", type: "storyType", raceType: "battle" },
  { id: "allRivals", name: "Friendly Fire", requirement: "Win all Rival Races in Story Mode", reward: "Unlock Vancasso", type: "storyType", raceType: "rival" },
  { id: "allBosses", name: "Boss Canvas", requirement: "Win all Boss Races in Story Mode", reward: "Unlock Vangas", type: "storyType", raceType: "boss" },
  { id: "allPinkSlips", name: "Pink Slip Collector", requirement: "Win all Pink Slip Races in Story Mode", reward: "Unlock Vandy-Warhol", type: "storyType", raceType: "pink-slip" },
  { id: "vindex25", name: "VINdex Scout", requirement: "Encounter 25% of the VINdex", reward: "1000 Sprox", type: "vindex", percent: 25 },
  { id: "vindex50", name: "VINdex Scholar", requirement: "Encounter 50% of the VINdex", reward: "Unlock Cuptrack", type: "vindex", percent: 50 },
  { id: "vindex75", name: "VINdex Archivist", requirement: "Encounter 75% of the VINdex", reward: "3 Level 2 parts", type: "vindex", percent: 75 },
  { id: "vindex100", name: "VINdex Master", requirement: "Encounter 100% of the VINdex", reward: "Unlock Vanbrandt", type: "vindex", percent: 100 }
];
const tutorialDialogue = {
  intro: [
    ["tyree", "Welcome to Spindell Training Academy! My name is Dr. Tyree. I’ll be the one evaluating you today to become a Tuner."],
    ["user", "Doctor? For cars?"],
    ["tyree", "I wasn’t able to pass the Tuner exam, so I devoted my life to studying everything there is about GearBorn. I’ve got a PhD in GearBorn Mechanics and History."],
    ["user", "Oh, so this is a “those who can’t do” situation."],
    ["tyree", "I wouldn’t talk such a big game just yet. You haven’t even started the test."],
    ["tyree", "Follow me."]
  ],
  "city-map": [
    ["tyree", "Welcome to Spindell Training Academy, your training ground. This is where you'll run through the three core race types: Drag Race, Time Trial, and Battle."],
    ["user", "Cool. Where do I start?"],
    ["tyree", "We'll go in order. First up — Drag Race. I'm clicking it for you."]
  ],
  "drag-race-intro": [
    ["tyree", "This is the level preview. You can see your car — Mamburn — and your opponent. Today that's the one and only Tutorque."],
    ["tutorque", "HONK! HONK!"],
    ["user", "*giggles* That?"],
    ["tyree", "You're confident now, but what about on the track? Let me click Start Level."]
  ],
  "drag2tt": [
    ["tyree", () => `Nice race! You earned ${formatSprox(state.tutorialDragSprox || tutorialDistance.xp)} Sprox for that win, but we're not done yet.`],
    ["user", "What's next?"],
    ["tyree", "Time Trial. Let me pull it up."]
  ],
  "time-trial-intro": [
    ["tyree", "This is the Time Trial level preview. You'll be on the academy track trying to beat the Bronze, Silver, or Gold times."],
    ["user", "I'll go for Gold."],
    ["tyree", "Sure you will. Your car's Mamburn — ready to roll. I'll click Start Level."]
  ],
  "tt2battle": [
    ["tyree", () => `Jeez… you got a ${state.tutorialTimeMedal || "medal"}?! That's pretty impressive.`],
    ["user", "I told you this is easy. Can I battle now?"],
    ["tyree", "Last race type — Battle. Coming right up."]
  ],
  "battle-intro": [
    ["tyree", "Battle Mode. Your opponent: Tutorque. Again."],
    ["user", "Agaiiiiiiiin? Come on!"],
    ["tyree", "Show me you can handle all three and you'll get your key. Starting the level now."]
  ],
  "evolved-form": [
    ["user", "WHOA. Mamburn evolved into... Snaytan?"],
    ["tyree", "Every GearBorn has evolved forms unlocked by leveling up. Snaytan is Mamburn's Level 10 form."],
    ["user", "That's actually sick."],
    ["tyree", "I know. Come on — there's more to show you."]
  ],
  achievements: [
    ["tyree", "This is the Achievements page. Complete challenges to earn special rewards — including rare GearBorn forms."],
    ["user", "Like what?"],
    ["tyree", "Discover 100% of the VINdex and you'll unlock Vanbrandt. Win all Bosses and you get Vangas. There are eight total."],
    ["user", "I'm going to get all of them."],
    ["tyree", "I don't doubt it. One more thing to show you."]
  ],
  "the-forge": [
    ["tyree", "This is THE FORGE. Pink Slip races earn you a Medallion instead of instantly unlocking a car."],
    ["user", "So I have to come here to actually get them?"],
    ["tyree", "Exactly. And I've just loaded three Medallions into your inventory — Baybee, Murrka, and Bunnae."],
    ["user", "My starter GearBorn?"],
    ["tyree", "The Forge is how you make them yours. Open your Medallion Inventory, pick one, and hit Unlock."]
  ],
  unlocked: [
    ["tyree", "And there you have it. Your new GearBorn is in the Garage."],
    ["user", "This is actually incredible."],
    ["tyree", "The rest of the roster? Pink Slip races, achievements, and The Forge are how you fill out your garage."],
    ["user", "I'm going to get all of them."],
    ["tyree", "Good luck. Now get out of my training academy."]
  ],
  "mode-select": [
    ["tyree", "There are four types of races you can choose from - Drag Races, Time Trials, Boss Races, and Battle Mode."],
    ["user", "Battle Mode?? Sick."],
    ["tyree", "Drag Races are about speed and acceleration - a head-to-head matchup where your goal is to get from start to finish as fast as possible in a test of your gear-shifting ability."],
    ["user", () => `If I do it while wearing ${selectedTuner()?.id === "mylo" ? "women’s" : "men’s"} clothing, would it be a Drag Drag Race?`],
    ["tyree", "Next are Time Trials, a solo race where the goal is to collect speed tokens and avoid obstacles to best the Bronze, Silver, or Gold times."],
    ["user", "Makes sense."],
    ["tyree", "Boss Challenges work kind of like Time Trials, but you’ll face off against one of the best racers in the world."],
    ["tyree", "Then, Battle Mode."],
    ["user", "They fight too?"],
    ["tyree", "Each GearBorn comes with a unique mix of moves as they battle in the Arena."],
    ["user", "These all sound easy."],
    ["tyree", "You haven’t even driven a car."],
    ["user", "And whose fault is that?"],
    ["tyree", "Fine, fine - let’s get to the races."],
    ["user", "Finally."]
  ],
  mamburn: [
    ["tyree", "All of the practice GearBorn are out right now, so just this once, I’m going to let you use my Mamburn."],
    ["user", "Siiiiiiiiiiiiiick. This is yours?!"],
    ["tyree", "Maybe you shouldn’t judge a book by it’s cover. Just promise not to do anything stupid. I need this back in perfect condition."],
    ["user", "Scout’s honor."],
    ["tyree", "You’re a scout?"],
    ["user", "Are we doing this or what?"],
    ["tyree", "Tuners can communicate with their GearBorn via the <strong>GearBorn Key</strong>, which is tuned to your personal cars. Here - I’ll let you borrow this."],
    ["key", "Dr. Tyree gives you his <strong>GearBorn Key</strong>."],
    ["user", "Thank you- *starts walking off*"],
    ["tyree", "Hey, wait! I’m not done."]
  ],
  "drag-race": [
    ["tyree", "This is the race options screen, where you’ll get to choose the length of the race and your opponent. For today, let’s just keep it to 400m and you’ll be going up against… TUTORQUE!"],
    ["tutorque", "HONK! HONK!"],
    ["user", "*giggles* That?"],
    ["tyree", "You’re confident now, but what about on the track?"],
    ["user", "At this rate, are we even getting to the track?"]
  ],
  "dr-controls": [
    ["tyree", "Are you happy?"],
    ["user", "Happier, I guess."],
    ["tyree", "Once the race starts, press Space when the bar reaches the shift point to shift gears up. After four Perfect shifts, you’ll earn a Nitrous boost that you can activate by pressing N."],
    ["user", "Hit the NOS!"],
    ["tyree", "You can change the controls at any time in Settings."],
    ["tyree", "Just make sure that you don’t miss the shift window - too many bad shifts and you’ll overheat the engine."],
    ["user", "*stares judgingly*"],
    ["tyree", "Okay, okay… I’m done. Race time."]
  ],
  sprox: [
    ["tyree", "Nice race! Maybe you ARE as good as you think. You’re just insufferable about it."],
    ["tyree", "One of the rewards for winning races is earning Sprox, which you can use to purchase upgrades and more for your GearBorn."],
    ["user", "More? What’s the more?"],
    ["tyree", "Stop trying to skip ahead. We’ll get there."],
    ["tyree", () => `You earned ${formatSprox(state.tutorialDragSprox || tutorialDistance.xp)} for winning the Drag Race, but that’s not enough to upgrade Mamburn yet.`],
    ["user", "How do I get more?"],
    ["tyree", "Let’s go to Time Trials."]
  ],
  "time-trial": [
    ["tyree", "Here, you’ll get to choose from a selection of city maps, each with new times to beat."],
    ["user", "Do you guys pay for the flights or how does that work?"],
    ["tyree", "Today, we’ll just stick with the academy track, but you’ll unlock the rest if you make it to become a Tuner."],
    ["user", "You say “if” like I didn’t just smoke that last race."],
    ["tyree", "I’m just going to keep ignoring your little quips."],
    ["user", "Fair."],
    ["tyree", "Once you’ve set a new personal best on a track, the ghostly Phantaxi will remember your route and run it with you the next time you race."],
    ["user", "Can I drive a Phantaxi?"],
    ["tyree", "I’m not sure. You’d have to find a way to sit in one without passing through it."],
    ["user", "Sick."]
  ],
  "tt-controls": [
    ["tyree", "Like I said, the goal here is to collect green speed tokens, such as gas cans and nitrous tanks, and avoid obstacles, such as caution gates and other cars."],
    ["user", "Can I crash into a couple just for fun?"],
    ["tyree", "If you scratch my Mamburn…"],
    ["tyree", "Use the WASD keys on your keyboard to control your car."],
    ["tyree", "Ready?"],
    ["user", "YES!"]
  ],
  "tt-after": [
    ["tyree", () => `Jeez… you got a ${state.tutorialTimeMedal || "medal"}?! That’s pretty impressive.`],
    ["user", "I told you this is easy. Can I battle now?"],
    ["tyree", "I just…"],
    ["user", "BATTLE!"],
    ["tyree", "One thi…"],
    ["user", "BATTLE!!!"],
    ["tyree", "*sarcastic* Yes, sir."]
  ],
  battle: [
    ["tyree", "This is the Battle Arena, where you’ll select from our lineup of powerful bosses."],
    ["user", "Let’s go with whoever’s the strongest."],
    ["tyree", "Chill. You’re still going up against Tutorque."],
    ["user", "Agaiiiiiiiin? Come on!"],
    ["tyree", "Show me you can do this and you’ll get your key."]
  ],
  "pre-battle": [
    ["tyree", "Battles work in turns."],
    ["tyree", "Each turn, you can attack, defend, or activate your Special if you have enough SP."],
    ["user", "How do you get SP?"],
    ["tyree", "I’m not telling."],
    ["user", "Really?"],
    ["tyree", "You’ve been nothing but rude this whole time."],
    ["user", "Is it like every time I get a successful attack or defend?"],
    ["tyree", "Oh… That was a lucky guess."],
    ["user", "Kind of just makes sense."],
    ["tyree", "If you successfully defend an attack, your opponent is stunned and can’t move the next turn, so you’re free to attack."],
    ["user", "Why wouldn’t I just defend all the time?"],
    ["tyree", "Defending an attack still takes damage, so be careful how you use it."],
    ["user", "I don’t know…"],
    ["tyree", "Also, the special can’t be defended. If you defend a special, you take all the damage while delivering none."],
    ["user", "You’ve thought about this before."],
    ["tyree", "They don’t just give you a doctorate because you like cars."],
    ["tyree", "Let’s test you out."]
  ],
  "post-battle": [
    ["tyree", "Wow! You’re much better at this than I thought you’d be."],
    ["user", "I know you’re just being backhanded to get back at me, but it’s still rude."],
    ["tyree", "You still don’t have quite enough to upgrade yet, but I’ll front the rest. Follow me to the garage."]
  ],
  garage: [
    ["tyree", "This is the garage, where all of your GearBorn will be stored and you can look up their attributes."],
    ["tyree", "Every GearBorn has a unique blend of six different attributes: SPEED, ACCELERATION, HANDLING, TORQUE, BODY, and POWERTRAIN."],
    ["tyree", "SPEED is what dictates your maximum speed."],
    ["tyree", "ACCELERATION is how fast you can increase speed to reach your max speed."],
    ["user", "I’m not 5. You can maybe skip this."],
    ["tyree", "Alright, genius, how does handling work?"],
    ["user", "Uh…."],
    ["tyree", "*rolls eyes* HANDLING controls how well your car can turn."],
    ["tyree", "TORQUE is about how well you can shift gears."],
    ["user", "Sick."],
    ["tyree", "You say that a lot."],
    ["user", "…Sick."],
    ["tyree", "BODY controls how much impact your car can take."],
    ["tyree", "Finally, POWERTRAIN controls your car’s special ability."],
    ["user", "My mommy tells me I’m special too."],
    ["tyree", "Let’s go to upgrading."]
  ],
  upgrade: [
    ["tyree", "When you upgrade the level of your car, you’ll earn a permanent boost to all the attributes for your GearBorn."],
    ["tyree", () => `As you can see, it costs 5,000 Sprox to upgrade from Level 9 to Level 10, but you only have ${formatSprox(state.sprox)}. I’ll give you the rest so that you can see what happens when you upgrade.`],
    ["tyree", "Sick."],
    ["user", "That’s my line."],
    ["tyree", "I was anticipating. Click LEVEL UP and see what happens."]
  ],
  evolve: [
    ["tyree", "What? It looks like Mamburn is evolving!"],
    ["user", "You knew that was going to happen."],
    ["tyree", "But it’s still pretty sick."],
    ["user", "Okay, fine. Sick."],
    ["tyree", "At certain levels, GearBorn evolve into more powerful, more exciting forms. Like Mamburn into the immortal Snaytan."],
    ["user", "Whoa…"],
    ["tyree", "Click EVOLVE. See what happens."],
    ["user", "Okay, this is pretty dang cool."],
    ["user", "Wait… Did you have me do all of this so that I could upgrade your car for you?"],
    ["tyree", "Those who can’t do... get someone to do it for them."],
    ["tyree", "So, yes, it’s a “those who can’t do” situation."],
    ["user", "You’re smarter than you look."],
    ["tyree", "It looks like my lessons here are done…"],
    ["tyree", "Actually, one more."]
  ],
  vindex: [
    ["tyree", "This is the VINdex."],
    ["user", "Like Vin Diesel?"],
    ["tyree", "Like Vehicle Identification Number."],
    ["user", "It can be both…"],
    ["tyree", "You’ll see here that the VINdex is locked until you discover more GearBorn."],
    ["user", "Yeah, but other people discovered them, right? So you could just unlock it…"],
    ["tyree", "Your generation always wants to skip the work and get right to the answers. Always take, take, take…"],
    ["tyree", "By the way, I need my GearBorn key back."],
    ["user", "So what I am I supposed to drive? I bought you a new car. The least you could do is give me a key."],
    ["tyree", "*sighs* You really like ruining surprises, don’t you?"]
  ],
  starters: [
    ["tyree", "Meet Baybee, Murrka, and Bunnae. They’ll be your first three GearBorn."],
    ["user", "Sick."],
    ["tyree", "Each one has different attributes, so play around with all of them to feel the difference."],
    ["user", "I know you’re going to judge me, but are these it? How do I get more?"],
    ["tyree", "For now, Pink Slip races are the only way to unlock more GearBorn. Advance through Story Mode to progress through the Pink Slip races and unlock the whole garage."],
    ["tyree", "There are also great rewards for the Tuner who can unlock and evolve all of the GearBorn to their final forms."],
    ["tyree", () => `${selectedTunerShortName()}. ${selectedTunerShortName()}!`],
    ["user", "Huh? I stopped listening after you said Pink Slip races, but sounds cool. Key me, big dawg."],
    ["tyree", "*shakes his head* Here. You earned this."],
    ["key", "Dr. Tyree gives you your <strong>GearBorn Key</strong>."],
    ["tyree", "Good luck and good racing!"]
  ]
};
const displayImageScaleByName = {
  swinecroft: 1.22,
  phantaxi: 1.28,
  shufflodon: 1.26,
  dropatops: 1.26,
  "k-wrex": 1.26,
  matunnie: 1.2,
  shamacht: 1.2,
  gladigator: 1.22,
  swampagne: 1.22,
  fourcroco: 1.22,
  elepledge: 1.24,
  sororitrunk: 1.24,
  plaidonna: 1.24,
  kermajesty: 1.2,
  inflewenze: 1.22,
  sponsore: 1.22,
  baronessex: 1.22,
  crusadome: 1.18,
  kuumbusta: 1.22,
  hurrdaboutis: 1.22,
  rainbowlt: 1.24,
  hornula1: 1.18,
  mamburn: 1.34,
  snaytan: 1.34,
  tutorque: 1.18,
  moshfin: 1.24,
  barracobain: 1.24,
  vedderanha: 1.24,
  udderlee: 1.24,
  moosan: 1.24,
  grandmooster: 1.24
};
const gearbornStatProfiles = {
  bee: { speed: 87, acceleration: 87, handling: 80, torque: 74, body: 62, powertrain: 84, playstyle: "Stinger Sprinter" },
  pickup: { speed: 70, acceleration: 72, handling: 64, torque: 87, body: 87, powertrain: 74, playstyle: "Load Hauler" },
  pig: { speed: 74, acceleration: 78, handling: 72, torque: 82, body: 84, powertrain: 87, playstyle: "Scrappy Bruiser" },
  rabbit: { speed: 82, acceleration: 87, handling: 87, torque: 74, body: 60, powertrain: 80, playstyle: "Hopshot Dasher" },
  whale: { speed: 66, acceleration: 68, handling: 58, torque: 72, body: 87, powertrain: 87, playstyle: "Tidal Fortress" },
  frog: { speed: 76, acceleration: 84, handling: 87, torque: 72, body: 64, powertrain: 82, playstyle: "Bogside Jumper" },
  "techno-dinosaur": { speed: 84, acceleration: 76, handling: 66, torque: 87, body: 87, powertrain: 84, playstyle: "Primal Charger" },
  "sorority-elephant": { speed: 68, acceleration: 70, handling: 60, torque: 87, body: 87, powertrain: 78, playstyle: "Stampede Engine" },
  "florida-gator": { speed: 80, acceleration: 82, handling: 76, torque: 80, body: 87, powertrain: 87, playstyle: "Swamp Striker" },
  "grunge-fish": { speed: 74, acceleration: 72, handling: 87, torque: 87, body: 64, powertrain: 82, playstyle: "Dirty Thrasher" },
  "karate-cow": { speed: 72, acceleration: 86, handling: 74, torque: 87, body: 87, powertrain: 84, playstyle: "Deceptive Powerhouse" },
  "art-van": { speed: 78, acceleration: 78, handling: 78, torque: 78, body: 78, powertrain: 78, playstyle: "Blank Canvas" },
  "cake-train": { speed: 68, acceleration: 72, handling: 60, torque: 87, body: 87, powertrain: 84, playstyle: "Sugar Juggernaut" },
  rainbowlt: { speed: 87, acceleration: 87, handling: 87, torque: 87, body: 87, powertrain: 87, playstyle: "Perfect Ascension" },
  "metal-snake": { speed: 100, acceleration: 98, handling: 78, torque: 100, body: 80, powertrain: 92, playstyle: "Heavy Burner" },
  "training-car": { speed: 60, acceleration: 60, handling: 60, torque: 60, body: 60, powertrain: 60, playstyle: "Student Driver" }
};
const bossStatProfiles = {
  crusadome: { speed: 76, acceleration: 74, handling: 70, torque: 82, body: 90, powertrain: 68 },
  baronessex: { speed: 74, acceleration: 72, handling: 68, torque: 84, body: 100, powertrain: 80 },
  shamacht: { speed: 92, acceleration: 86, handling: 78, torque: 90, body: 84, powertrain: 88 },
  inflewenze: { speed: 94, acceleration: 92, handling: 80, torque: 84, body: 72, powertrain: 100 },
  hurrdaboutis: { speed: 90, acceleration: 88, handling: 84, torque: 86, body: 80, powertrain: 94 },
  matunnie: { speed: 86, acceleration: 82, handling: 100, torque: 80, body: 74, powertrain: 92 },
  kuumbusta: { speed: 92, acceleration: 90, handling: 86, torque: 92, body: 78, powertrain: 94 },
  kermajesty: { speed: 88, acceleration: 94, handling: 90, torque: 86, body: 80, powertrain: 92 },
  hornula1: { speed: 100, acceleration: 100, handling: 100, torque: 100, body: 100, powertrain: 100 }
};
const storyTracks = [
  { id: "indianapolis", city: "Indianapolis", country: "USA", map: "assets/maps/map-indianapolis.png", cityMap: "assets/maps/citymap-indianapolis.png", cityIcon: "assets/maps/cityicon-indianapolis.png" },
  { id: "berlin", city: "Berlin", country: "Germany", map: "assets/maps/map-berlin.png", cityMap: "assets/maps/citymap-berlin.png", cityIcon: "assets/maps/cityicon-berlin.png" },
  { id: "dubai", city: "Dubai", country: "UAE", map: "assets/maps/map-dubai.png", cityMap: "assets/maps/citymap-dubai.png", cityIcon: "assets/maps/cityicon-dubai.png" },
  { id: "rio", city: "Rio de Janeiro", country: "Brazil", map: "assets/maps/map-rio-de-janeiro.png", cityMap: "assets/maps/citymap-rio-de-janeiro.png", cityIcon: "assets/maps/cityicon-rio-de-janeiro.png" },
  { id: "los-angeles", city: "Los Angeles", country: "USA", map: "assets/maps/map-los-angeles.png", cityMap: "assets/maps/citymap-los-angeles.png", cityIcon: "assets/maps/cityicon-los-angeles.png" },
  { id: "seoul", city: "Seoul", country: "South Korea", map: "assets/maps/map-seoul.png", cityMap: "assets/maps/citymap-seoul.png", cityIcon: "assets/maps/cityicon-seoul.png" },
  { id: "cape-town", city: "Cape Town", country: "South Africa", map: "assets/maps/map-cape-town.png", cityMap: "assets/maps/citymap-cape-town.png", cityIcon: "assets/maps/cityicon-cape-town.png" },
  { id: "bangalore", city: "Bengaluru", country: "India", map: "assets/maps/map-bangalore.png", cityMap: "assets/maps/citymap-bangalore.png", cityIcon: "assets/maps/cityicon-bangalore.png" }
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
  { id: "rev-rend", name: "Rev-rend", car: "Crusadome", track: storyTracks[0], difficulty: 0.55, xp: 260, carImage: "assets/story/crusadome-topdown.png", portrait: "assets/bosses/rev-rend.png", headshot: "assets/bosses/headshot-rev-rend.png" },
  { id: "karen", name: "Karen", car: "Baronessex", track: storyTracks[1], difficulty: 1.02, xp: 340, carImage: "assets/story/baronessex-topdown.png", portrait: "assets/bosses/karen.png", headshot: "assets/bosses/headshot-karen.png" },
  { id: "samir", name: "Samir", car: "Shamacht", track: storyTracks[2], difficulty: 1.14, xp: 430, carImage: "assets/cars/whale-shamacht-topdown.png", portrait: "assets/bosses/samir.png", headshot: "assets/bosses/headshot-samir.png" },
  { id: "thais", name: "Thais", car: "Inflewenze", track: storyTracks[3], difficulty: 1.28, xp: 540, carImage: "assets/story/inflewenze-topdown.png", portrait: "assets/bosses/thais.png", headshot: "assets/bosses/headshot-thais.png" },
  { id: "jimmy-chin", name: "Jimmy Chin", car: "Hurrdaboutis", track: storyTracks[4], difficulty: 1.42, xp: 670, carImage: "assets/story/hurrdaboutis-topdown.png", portrait: "assets/bosses/jimmy-chin.png", headshot: "assets/bosses/headshot-jimmy-chin.png" },
  { id: "rip-lee", name: "Rip Lee", car: "Matunnie", track: storyTracks[5], difficulty: 1.56, xp: 820, carImage: "assets/cars/rabbit-matunnie-topdown.png", portrait: "assets/bosses/rip-lee.png", headshot: "assets/bosses/headshot-rip-lee.png" },
  { id: "jabu", name: "Jabu", car: "Kuumbusta", track: storyTracks[6], difficulty: 1.72, xp: 990, carImage: "assets/story/kuumbusta-topdown.png", portrait: "assets/bosses/jabu.png", headshot: "assets/bosses/headshot-jabu.png" },
  { id: "pallavi", name: "Pallavi", car: "Kermajesty", track: storyTracks[7], difficulty: 1.9, xp: 1200, carImage: "assets/cars/frog-kermajesty-topdown.png", portrait: "assets/bosses/pallavi.png", headshot: "assets/bosses/headshot-pallavi.png" }
];
const finalBoss = { id: "racer-alpha", name: "Racer Alpha", car: "Hornula1", track: { id: "space", city: "Space", country: "Final Track", map: "assets/maps/map-space.png", cityMap: "assets/maps/citymap-space.png", cityIcon: "assets/maps/cityicon-space.png" }, difficulty: 2.25, xp: 1800, carImage: "assets/story/unlock-hornula1-topdown.png", portrait: "assets/bosses/racer-alpha-helmet.png", unmaskedPortrait: "assets/bosses/racer-alpha.png", headshot: "assets/bosses/headshot-racer-alpha.png" };
const bossChallengeBosses = bosses.concat(finalBoss);
const campaignDragStages = [
  { rankKey: "E", name: "Bananachi", xp: 100, power: 0.92, image: "assets/cars/rival-bananachi-race.png" },
  { rankKey: "D", name: "Beardo", xp: 150, power: 1.05, image: "assets/cars/rival-beardo-race.png" },
  { rankKey: "D", name: "Boates", xp: 190, power: 1.16, image: "assets/cars/whale-boates-race.png" },
  { rankKey: "C", name: "Manstrocity", xp: 250, power: 1.3, image: "assets/cars/rival-manstrocity-race.png" },
  { rankKey: "B", name: "Sponsore", xp: 330, power: 1.5, image: "assets/cars/rival-sponsore-race.png" },
  { rankKey: "B", name: "Tookerjaw", xp: 410, power: 1.66, image: "assets/cars/pickup-tookerjaw-race.png" },
  { rankKey: "A", name: "Crusadome", xp: 540, power: 1.85, image: "assets/cars/rival-crusadome-race.png" },
  { rankKey: "S", name: "Hornula1", xp: 720, power: 2.12, image: "assets/cars/rival-hornula1-race.png" }
];
const pinkSlipRacePlan = {
  0: { carId: "pig",                rankKey: "D", xp: 180, power: 0.88, distance: 400 },
  1: { carId: "sorority-elephant",  rankKey: "C", xp: 240, power: 0.90, distance: 800 },
  2: { carId: "grunge-fish",        rankKey: "C", xp: 300, power: 0.94, distance: 800 },
  3: { carId: "florida-gator",      rankKey: "B", xp: 360, power: 0.96, distance: 800 },
  4: { carId: "whale",              rankKey: "B", xp: 420, power: 0.98, distance: 800 },
  5: { carId: "techno-dinosaur",    rankKey: "A", xp: 540, power: 1.02, distance: 1600 },
  6: { carId: "karate-cow",         rankKey: "S", xp: 680, power: 1.06, distance: 1600 },
  7: { carId: "frog",               rankKey: "S", xp: 820, power: 1.08, distance: 1600 }
};
const rivalRacePlan = {
  1: { id: "berlin-rival", mechanic: "drag", xp: 300, power: 1.2, distance: 800 },
  4: { id: "los-angeles-rival", mechanic: "bossVertical", xp: 640, power: 1.56, distance: 500 },
  7: { id: "bangalore-rival", mechanic: "battle", xp: 1040, power: 1.92 }
};
function pinkSlipStageFor(plan) {
  const car = cars.find((item) => item.id === plan.carId);
  const form = car.evolutions[0];
  return {
    ...plan,
    type: "pink-slip",
    name: form.name,
    title: `Pink Slip Race: ${form.name}`,
    image: imageFor(form, "race"),
    displayImage: imageFor(form, "display")
  };
}
const campaignLevels = bosses.flatMap((boss, index) => {
  const drag = { type: "drag", title: `${campaignDragStages[index].rankKey} Class Drag: ${campaignDragStages[index].name}`, drag: campaignDragStages[index] };
  const trial = { type: "trial", title: `${boss.track.city} Time Trial`, track: boss.track, bossIndex: index };
  const arena = { type: "battle", title: `${boss.name} Arena Battle`, bossIndex: index };
  const rival = rivalRacePlan[index]
    ? { type: "rival", title: `${boss.track.city} Rival Race`, bossIndex: index, track: boss.track, ...rivalRacePlan[index] }
    : null;
  const battle = { type: "boss", title: `${boss.name} Boss Race`, bossIndex: index };
  const prelims = index % 2 === 0 ? [drag, trial, arena] : [trial, drag, arena];
  if (rival) prelims.push(rival);
  const arc = prelims.concat(battle);
  return pinkSlipRacePlan[index] ? arc.concat([{ type: "pink-slip", title: pinkSlipStageFor(pinkSlipRacePlan[index]).title, drag: pinkSlipStageFor(pinkSlipRacePlan[index]), pinkSlipCarId: pinkSlipRacePlan[index].carId }]) : arc;
}).concat([{ type: "boss", title: `${finalBoss.name} Final Boss`, bossIndex: bosses.length, final: true }]);
const storyNodeLayouts = [
  { key: "drag", x: 16, y: 70 },
  { key: "trial", x: 84, y: 70 },
  { key: "battle", x: 34, y: 56 },
  { key: "rival", x: 66, y: 56 },
  { key: "boss", x: 50, y: 20 },
  { key: "pink-slip", x: 50, y: 88 }
];
const storyLevelVisuals = {
  drag: { label: "Drag Race", icon: "assets/items/icon-drag-race.png", color: "#ffc857" },
  trial: { label: "Time Trial", icon: "assets/items/icon-time-trial.png", color: "#6ee7a8" },
  battle: { label: "Battle", icon: "assets/items/icon-battle.png", color: "#f25f5c" },
  rival: { label: "Rival Race", icon: "assets/items/icon-rival-race.png", color: "#c084fc" },
  boss: { label: "Boss Battle", icon: "assets/items/icon-boss.png", color: "#52c7ff" },
  "pink-slip": { label: "Pink Slip", icon: "assets/items/icon-pink-slip.png", color: "#f4a7d8" }
};
const cityAbbreviations = {
  indianapolis: "Indy",
  berlin: "Berlin",
  dubai: "Dubai",
  rio: "Rio",
  "los-angeles": "LA",
  seoul: "Seoul",
  "cape-town": "S. AFRICA",
  bangalore: "INDIA",
  space: "Space"
};
let storyCursor = 0;
const storyCities = bosses.map((boss, index) => {
  const levelCount = 4 + (rivalRacePlan[index] ? 1 : 0) + (pinkSlipRacePlan[index] ? 1 : 0);
  const levels = campaignLevels.slice(storyCursor, storyCursor + levelCount).map((level, offset) => ({ ...level, campaignIndex: storyCursor + offset }));
  storyCursor += levelCount;
  return { id: boss.track.id, city: boss.track.city, country: boss.track.country, track: boss.track, bossIndex: index, levels, icon: boss.track.cityIcon };
}).concat([{
  id: "space",
  city: finalBoss.track.city,
  country: finalBoss.track.country,
  track: finalBoss.track,
  bossIndex: bosses.length,
  final: true,
  levels: [{ ...campaignLevels[campaignLevels.length - 1], campaignIndex: campaignLevels.length - 1 }],
  icon: finalBoss.track.cityIcon
}]);
const timeMedals = [
  { key: "gold", label: "Gold", difficulty: "Hard", xp: 420, base: 14.5 },
  { key: "silver", label: "Silver", difficulty: "Medium", xp: 260, base: 17.5 },
  { key: "bronze", label: "Bronze", difficulty: "Easy", xp: 150, base: 21.0 }
];
const vindexEntries = [
  ["010", "Bananachi", "Monkey Line", "assets/cars/rival-bananachi-display.png"],
  ["032", "Manstrocity", "Armadillo Dad Line", "assets/cars/rival-manstrocity-display.png"],
  ["037", "Beardo", "Mustache Line", "assets/cars/rival-beardo-display.png"],
  ["039", "Baybee", "Bee-cycle Line", "assets/cars/bee-baybee-display.png"],
  ["040", "Syndrone", "Bee-cycle Line", "assets/cars/bee-syndrone-display.png"],
  ["041", "Motonarch", "Bee-cycle Line", "assets/cars/bee-motonarch-display.png"],
  ["058", "Murrka", "Patriot Pickup Line", "assets/cars/pickup-murrka-display.png"],
  ["059", "Wallmort", "Patriot Pickup Line", "assets/cars/pickup-wallmort-display.png"],
  ["060", "Tookerjaw", "Patriot Pickup Line", "assets/cars/pickup-tookerjaw-display.png"],
  ["063", "Udderlee", "Karate Cow Line", "assets/cars/cow-udderlee-display.png"],
  ["064", "Moosan", "Karate Cow Line", "assets/cars/cow-moosan-display.png"],
  ["065", "Grandmooster", "Karate Cow Line", "assets/cars/cow-grandmooster-display.png"],
  ["066", "Hogson", "Detective Pig Line", "assets/cars/pig-hogson-display.png"],
  ["067", "Snoffle", "Detective Pig Line", "assets/cars/pig-snoffle-display.png"],
  ["068", "Swinecroft", "Detective Pig Line", "assets/cars/pig-swinecroft-display.png"],
  ["082", "Phantaxi", "Ghost Taxi Line", "assets/story/phantaxi-display.png"],
  ["088", "Shufflodon", "Techno Dinosaur Line", "assets/cars/techno-dinosaur-shufflodon-display.png"],
  ["089", "Dropatops", "Techno Dinosaur Line", "assets/cars/techno-dinosaur-dropatops-display.png"],
  ["090", "K-Wrex", "Techno Dinosaur Line", "assets/cars/techno-dinosaur-k-wrex-display.png"],
  ["091", "Bunnae", "K-Pop Bunny Line", "assets/cars/rabbit-bunnae-display.png"],
  ["092", "Lopstar", "K-Pop Bunny Line", "assets/cars/rabbit-lopstar-display.png"],
  ["093", "Matunnie", "K-Pop Bunny Line", "assets/cars/rabbit-matunnie-display.png"],
  ["110", "Mamburn", "Metal Snake Line", "assets/cars/snake-mamburn-display.png"],
  ["111", "Snaytan", "Metal Snake Line", "assets/cars/snake-snaytan-display.png"],
  ["145", "Moshfin", "Grunge Fish Line", "assets/cars/fish-moshfin-display.png"],
  ["146", "Barracobain", "Grunge Fish Line", "assets/cars/fish-barracobain-display.png"],
  ["147", "Vedderanha", "Grunge Fish Line", "assets/cars/fish-vedderanha-display.png"],
  ["151", "Totorca", "Yacht Rock Whale Line", "assets/cars/whale-totorca-display.png"],
  ["152", "Boates", "Yacht Rock Whale Line", "assets/cars/whale-boates-display.png"],
  ["153", "Shamacht", "Yacht Rock Whale Line", "assets/cars/whale-shamacht-display.png"],
  ["154", "Gladigator", "Florida Gator Line", "assets/cars/florida-gator-gladigator-display.png"],
  ["155", "Swampagne", "Florida Gator Line", "assets/cars/florida-gator-swampagne-display.png"],
  ["156", "Fourcroco", "Florida Gator Line", "assets/cars/florida-gator-fourcroco-display.png"],
  ["157", "Vanvass", "Art Van Line", "assets/cars/art-vanvass-display.png"],
  ["158", "Vandinsky", "Art Van Line", "assets/cars/art-vandinsky-display.png"],
  ["159", "Vanbrandt", "Art Van Line", "assets/cars/art-vanbrandt-display.png"],
  ["160", "Vancasso", "Art Van Line", "assets/cars/art-vancasso-display.png"],
  ["161", "Vangas", "Art Van Line", "assets/cars/art-vangas-display.png"],
  ["162", "Vandy-Warhol", "Art Van Line", "assets/cars/art-vandy-warhaul-display.png"],
  ["163", "Vanksy", "Art Van Line", "assets/cars/art-vanksy-display.png"],
  ["164", "Vanst", "Art Van Line", "assets/cars/art-vanst-display.png"],
  ["198", "Elepledge", "Sorority Elephant Line", "assets/cars/sorority-elephant-elepledge-display.png"],
  ["199", "Sororitrunk", "Sorority Elephant Line", "assets/cars/sorority-elephant-sororitrunk-display.png"],
  ["200", "Plaidonna", "Sorority Elephant Line", "assets/cars/sorority-elephant-plaidonna-display.png"],
  ["212", "Tutorque", "Training Car Line", "assets/cars/tutorque-display.png"],
  ["231", "Rivvir", "Exulted Frog Line", "assets/cars/frog-rivvir-display.png"],
  ["232", "Croakra", "Exulted Frog Line", "assets/cars/frog-croakra-display.png"],
  ["233", "Kermajesty", "Exulted Frog Line", "assets/cars/frog-kermajesty-display.png"],
  ["243", "Cuptrack", "Cake Train Line", "assets/cars/cake-cuptrack-display.png"],
  ["244", "Isittrain", "Cake Train Line", "assets/cars/cake-isittrain-display.png"],
  ["245", "Fonductor", "Cake Train Line", "assets/cars/cake-fonductor-display.png"],
  ["251", "Inflewenze", "Influencer Line", "assets/story/inflewenze-display.png"],
  ["287", "Sponsore", "Bumper Sticker Line", "assets/cars/rival-sponsore-display.png"],
  ["296", "Baronessex", "German Discipline Line", "assets/story/baronessex-display.png"],
  ["298", "Crusadome", "Crusader Line", "assets/cars/rival-crusadome-display.png"],
  ["301", "Kuumbusta", "Combustion Line", "assets/story/kuumbusta-display.png"],
  ["305", "Hurrdaboutis", "Roundabout Line", "assets/story/hurrdaboutis-display.png"],
  ["326", "Rainbowlt", "Unicorn Supercar Line", "assets/cars/unlock-rainbowlt-display.png"],
  ["327", "Hornula1", "Unicorn Supercar Line", "assets/cars/rival-hornula1-display.png"]
].map(([number, name, line, image]) => ({ number, name, line, image }));
const tuners = [
  { id: "mylo", name: "Mylo Ziggs", gender: "male", image: "assets/characters/mylo-ziggs.png", headshot: "assets/characters/headshot-mylo.png", bio: "A hopeful, self-made Tuner with big dreams and messy execution. Mylo did not grow up in the GearBorn world. He forced his way in. He is always a step behind, but what he lacks in polish, he makes up for in heart." },
  { id: "cha-cha", name: "Cha Cha Spindell", gender: "female", image: "assets/characters/cha-cha-spindell.png", headshot: "assets/characters/headshot-cha-cha.png", bio: "The gold standard of a Tuner, and tired of being treated like a legacy. Daughter of legends Mack and Sloane Spindell, Cha Cha has spent her life at the top because she earned it." }
];
const profileBios = {
  "rev-rend": "A preacher of speed and salvation, with a collection to match. Rev-rend built his empire on one promise: give him your GearBorn, and he will lead you to greatness. Behind the gospel is a man who has lost sight of what he ever believed in.",
  karen: "Precision. Control. Perfection. Karen runs Berlin like a system, and she is its architect. Every move is calculated, every race executed with ruthless efficiency. She does not just follow rules. She weaponizes them.",
  samir: "Born into luxury. Raised without limits. Driving someone else's dream. Samir is surrounded by wealth but disconnected from reality. He jokes and plays the part, but underneath it all he is waiting for someone to beat him so he can choose his own path.",
  thais: "An influencer with millions watching, and no one seeing the full picture. Every post and every move is strategy. People underestimate her. That is the point. On the track, she is ruthless. Off the track, she is untouchable.",
  "jimmy-chin": "A legend of yesterday, still fighting to stay on screen. Jimmy built his name on charm, familiarity, and mass appeal. The world is changing, and Jimmy is not. He sticks to classic cars, classic lines, and classic tricks.",
  "rip-lee": "A superstar on the track. A stranger to herself. Rip Lee is a full performance of pink wigs, flashing lights, and K-pop perfection. Off the track, she is Jia, quiet and uncertain. Racing is where she finally feels real.",
  jabu: "A builder. A dreamer. A racer shaped by what he did not have. Jabu creates from scraps, turning discarded parts into something powerful and beautiful. He races to prove that vision matters more than resources.",
  pallavi: "Grace in life. Fire on the track. Pallavi lives between honoring tradition and chasing her own ambitions. Behind the wheel, she is focused, fearless, and unstoppable.",
  "racer-alpha": "No name. No past. Just speed. Racer Alpha is a myth made real, hidden behind a mirrored helmet that reveals nothing. No one knows where he came from. If you beat him, you earn the right to find out.",
  "dr-tyree": "A brilliant mind with a disappointing lap time. Dr. Tyree was once the Academy's top student - on paper. His understanding of GearBorn mechanics is unmatched, his theories cited across the world, and his doctorate... frequently mentioned. But on the track? Let's just say the data didn't translate. Now the Academy's lead instructor, Tyree treats GearBorn with absolute seriousness - borderline reverence. To him, this is about more than just rubber and road. He believes mastery comes from understanding - not instinct."
};
const racerProfiles = tuners.concat(bossChallengeBosses.map((boss) => ({
  id: boss.id,
  name: boss.name,
  image: boss.headshot || boss.unmaskedPortrait || boss.portrait,
  car: boss.car,
  city: boss.track.city,
  country: boss.track.country,
  bio: profileBios[boss.id] || "Profile bio placeholder. Add the final lore from the Web Game Lore Doc."
}))).concat([{
  id: "dr-tyree",
  name: "Dr. Tyree",
  image: "assets/characters/headshot-dr-tyree.png",
  category: "Other",
  car: "Other",
  city: "Tuner Academy",
  country: "Other",
  bio: profileBios["dr-tyree"]
}]);
const saveKey = "gearborn-demo-save-v1";
const tunerChoiceVersion = 1;
const storyCutsceneScripts = {
  "rev-rend": {
    pre: [
      { speaker: "boss", text: "Brothers, sisters, and horsepower believers." },
      { speaker: "boss", text: "Welcome to the Conclave Cup Revival!" },
      { speaker: "boss", text: "I see before me a soul in need of guidance and a vehicle in need of surrender." },
      { speaker: "user", text: "Let me guess. You want my car?" },
      { speaker: "boss", text: "Lay down your GearBorn at my altar, and I shall make it divine!" },
      { speaker: "user", text: "Yeah, hard pass." },
      { speaker: "boss", text: "Then we settle this on the track!" },
      { speaker: "boss", text: "If I win, your GearBorn joins my congregation!" },
      { speaker: "user", text: "And when I win?" },
      { speaker: "boss", text: "You may leave... enlightened." },
      { speaker: "user", text: "Cool. I’ll settle for winning." },
      { speaker: "boss", text: "The track is my pulpit. Prepare to be converted!" }
    ],
    post: [
      { speaker: "boss", text: "No... this cannot be! The track does not lie!" },
      { speaker: "boss", text: "You’re a blasphemous heretic!" },
      { speaker: "user", text: "Or I just beat you." },
      { speaker: "boss", text: "You defy the Conclave!" },
      { speaker: "user", text: "I think the Conclave’s just you taking people’s cars." },
      { speaker: "boss", text: "I offer salvation!" },
      { speaker: "user", text: "You offer a scam." },
      { speaker: "boss", text: "The road... has forsaken me." },
      { speaker: "user", text: "Or your whole act just fell apart." },
      { speaker: "user", text: "Keep the religion. I’ll keep my car." }
    ]
  },
  karen: {
    pre: [
      { speaker: "boss", text: "You’re late." },
      { speaker: "user", text: "Wow, no hello? Berlin hospitality’s really something." },
      { speaker: "boss", text: "Timing is the first rule. You’ve already failed it." },
      { speaker: "user", text: "Good thing we’re racing, not scheduling a meeting." },
      { speaker: "boss", text: "Racing is precision. Every move, every second - controlled." },
      { speaker: "user", text: "You sound fun." },
      { speaker: "boss", text: "Fun is inefficiency." },
      { speaker: "boss", text: "On my track, there is no chaos. Only execution." },
      { speaker: "user", text: "Cool. I’ll try not to ruin your spreadsheet." },
      { speaker: "boss", text: "You won’t." },
      { speaker: "boss", text: "If you win, it’s because I made a mistake." },
      { speaker: "user", text: "And if you lose?" },
      { speaker: "boss", text: "I don’t." },
      { speaker: "user", text: "Guess we’ll find out." }
    ],
    post: [
      { speaker: "boss", text: "...I miscalculated." },
      { speaker: "boss", text: "One mistake." },
      { speaker: "user", text: "It happens. But everything else was perfect." },
      { speaker: "boss", text: "Perfect isn’t enough if you still lose." },
      { speaker: "user", text: "You controlled that whole race." },
      { speaker: "user", text: "Most people just hope to win. You plan to win." },
      { speaker: "boss", text: "Planning failed." },
      { speaker: "user", text: "Barely." },
      { speaker: "user", text: "You’re the real deal. Discipline, execution... it shows." },
      { speaker: "boss", text: "Then I refine. I don’t repeat mistakes." },
      { speaker: "user", text: "Good. Wouldn’t want it to be easy next time." }
    ]
  },
  samir: {
    pre: [
      { speaker: "boss", text: "Welcome, my friend. Try not to scratch the paint. This one’s expensive." },
      { speaker: "user", text: "Yours? Or your dad’s?" },
      { speaker: "boss", text: "Ah. Straight to it. I like you." },
      { speaker: "user", text: "Let me guess - you win, I have to compliment your inheritance?" },
      { speaker: "boss", text: "Careful. This “inheritance” tends to leave people in the dust." },
      { speaker: "user", text: "Yeah, yeah. Big car, big allowance." },
      { speaker: "user", text: "Must be tough." },
      { speaker: "boss", text: "You think it’s easy, carrying expectations like this?" },
      { speaker: "user", text: "I think you’ve never had to earn anything." },
      { speaker: "boss", text: "Then prove it." },
      { speaker: "boss", text: "Beat me. Then maybe I’ll start believing you." },
      { speaker: "user", text: "Oh, I will." },
      { speaker: "user", text: "And when I do, try not to have your dad ground me." }
    ],
    post: [
      { speaker: "boss", text: "...Well. That settles it." },
      { speaker: "user", text: "Guess the family car isn’t unbeatable after all." },
      { speaker: "boss", text: "It was never really mine." },
      { speaker: "user", text: "Yeah, I figured." },
      { speaker: "boss", text: "There’s another one I prefer." },
      { speaker: "user", text: "Oh? What, something even flashier?" },
      { speaker: "boss", text: "No." },
      { speaker: "boss", text: "The Honky." },
      { speaker: "user", text: "The silly goose car?" },
      { speaker: "boss", text: "It’s not silly." },
      { speaker: "boss", text: "It’s... misunderstood." },
      { speaker: "user", text: "That’s one way to say it." },
      { speaker: "boss", text: "Everyone laughs at it." },
      { speaker: "boss", text: "But it’s like the ugly duckling... hiding a swan inside." },
      { speaker: "user", text: "Okay, I didn’t expect that from you." },
      { speaker: "boss", text: "Neither did I." }
    ]
  },
  thais: {
    pre: [
      { speaker: "boss", text: "Hmm. I don’t think this collab makes sense for me." },
      { speaker: "user", text: "Collab?" },
      { speaker: "boss", text: "Your numbers are too low." },
      { speaker: "user", text: "I’m here to race, not post." },
      { speaker: "boss", text: "Everything is content." },
      { speaker: "boss", text: "And you? Not very engaging." },
      { speaker: "user", text: "Wow. Okay." },
      { speaker: "user", text: "Didn’t realize I needed followers to beat you." },
      { speaker: "boss", text: "You don’t." },
      { speaker: "boss", text: "You need skill." },
      { speaker: "user", text: "...Right." },
      { speaker: "user", text: "That’s the part I brought." },
      { speaker: "boss", text: "Confident. I like that." },
      { speaker: "boss", text: "Let’s see if it performs." },
      { speaker: "user", text: "Oh, it will." },
      { speaker: "user", text: "Just make sure you capture my good side when I pass you." }
    ],
    post: [
      { speaker: "boss", text: "Wait. Before you go, can you sign this?" },
      { speaker: "user", text: "What is it?" },
      { speaker: "boss", text: "Release form. I’m posting the race." },
      { speaker: "user", text: "Sure." },
      { speaker: "user", text: "As long as you don’t edit it." },
      { speaker: "boss", text: "...That’s not how this works." },
      { speaker: "user", text: "Thought everything was content." },
      { speaker: "user", text: "Or is it only content when you control it?" },
      { speaker: "boss", text: "I curate my image." },
      { speaker: "user", text: "Yeah. That’s what I’m saying." },
      { speaker: "user", text: "You’ve been faking it." },
      { speaker: "boss", text: "It’s not fake. It’s strategy." },
      { speaker: "user", text: "Then post it." },
      { speaker: "user", text: "Exactly how it happened." },
      { speaker: "boss", text: "I’ll... consider it." },
      { speaker: "user", text: "Cool." },
      { speaker: "user", text: "I’ll consider signing." }
    ]
  },
  "jimmy-chin": {
    pre: [
      { speaker: "boss", text: "Have you seen this? Have you heard about this?" },
      { speaker: "user", text: "Seen what? What are you talking about?" },
      { speaker: "boss", text: "They said they were sending me a tuner. Tune her? I hardly know her." },
      { speaker: "user", text: "Wow. That was awful." },
      { speaker: "boss", text: "Hey, I’m still number one in my timeslot!" },
      { speaker: "boss", text: "10:40pm-10:50pm among 65-69 year old men." },
      { speaker: "user", text: "I guess that’s better than number one in your heart?" },
      { speaker: "boss", text: "Still counts! I bet you’re not getting that on Tic Tac?" },
      { speaker: "user", text: "The mints?" },
      { speaker: "boss", text: "You know what I mean!" },
      { speaker: "user", text: "I thought your show got cancelled." },
      { speaker: "boss", text: "Cancelled?! I’ll show you who’s cancelled!" }
    ],
    post: [
      { speaker: "boss", text: "Well... not bad, kid." },
      { speaker: "boss", text: "Tell you what. I’ll give you my time slot." },
      { speaker: "user", text: "Your what?" },
      { speaker: "boss", text: "In five years. Then you take over. Big handoff." },
      { speaker: "user", text: "Or you could just... retire now." },
      { speaker: "boss", text: "Retire?" },
      { speaker: "boss", text: "Huh. Would give me more time with the one I love most." },
      { speaker: "user", text: "Your wife?" },
      { speaker: "boss", text: "Heck no." },
      { speaker: "boss", text: "My cars!" }
    ]
  },
  "rip-lee": {
    pre: [
      { speaker: "boss", text: "You’re the challenger?" },
      { speaker: "user", text: "Yeah. Let’s get this over with." },
      { speaker: "boss", text: "“Let’s get this over with.”" },
      { speaker: "boss", text: "Why do you sound like a substitute teacher?" },
      { speaker: "user", text: "What? I don’t-" },
      { speaker: "boss", text: "It’s okay." },
      { speaker: "boss", text: "You’ve got... Unc energy." },
      { speaker: "user", text: "Unc-?" },
      { speaker: "user", text: "I’m not old." },
      { speaker: "boss", text: "Ummmmm... sure." },
      { speaker: "user", text: "Okay, whatever." },
      { speaker: "user", text: "Let’s see if this Unc still has it." },
      { speaker: "boss", text: "Don’t break a hip." }
    ],
    post: [
      { speaker: "user", text: "Told you. Unc still got it." },
      { speaker: "boss", text: "Mm." },
      { speaker: "user", text: "That’s it?" },
      { speaker: "user", text: "No comeback? No speech?" },
      { speaker: "boss", text: "It was a good race." },
      { speaker: "user", text: "I won." },
      { speaker: "boss", text: "You did." },
      { speaker: "user", text: "You’re not even a little mad?" },
      { speaker: "boss", text: "At...?" },
      { speaker: "user", text: "Losing?" },
      { speaker: "boss", text: "*stares at you unbothered*" },
      { speaker: "user", text: "Ugh, you’re so cool." },
      { speaker: "boss", text: "I know." }
    ]
  },
  jabu: {
    pre: [
      { speaker: "boss", text: "Hey! Welcome, my friend. You made it all this way." },
      { speaker: "user", text: "You’re very friendly for someone I’m about to race." },
      { speaker: "boss", text: "Why not? It’s a beautiful day." },
      { speaker: "boss", text: "First time in Africa? Not what you expected?" },
      { speaker: "user", text: "I don’t know. I just thought it’d be more... Africa-like?" },
      { speaker: "boss", text: "People think lions, elephants, leopards." },
      { speaker: "boss", text: "You know what’s the fastest thing on land?" },
      { speaker: "user", text: "Cheetah?" },
      { speaker: "boss", text: "Jabu." },
      { speaker: "user", text: "Now that’s what I’m here for. Let’s race!" }
    ],
    post: [
      { speaker: "user", text: "You weren’t kidding about the cheetah thing." },
      { speaker: "boss", text: "And you kept up." },
      { speaker: "boss", text: "Not bad, my friend." },
      { speaker: "user", text: "Careful, I’ll start thinking you like me." },
      { speaker: "boss", text: "I do!" },
      { speaker: "boss", text: "Makes it more fun when we race again." },
      { speaker: "user", text: "Oh, we’re definitely running that back." },
      { speaker: "boss", text: "Good." },
      { speaker: "boss", text: "Next time, I won’t be so nice." },
      { speaker: "user", text: "You say that like you weren’t trying." },
      { speaker: "boss", text: "I was." },
      { speaker: "boss", text: "That’s why I’m smiling." }
    ]
  },
  pallavi: {
    pre: [
      { speaker: "boss", text: "In my family, everything has a place. A path. You follow it with purpose." },
      { speaker: "user", text: "So this is like a Bend It Like Beckham situation?" },
      { speaker: "boss", text: "That’s a little racist." },
      { speaker: "user", text: "What? No, I didn’t mean..." },
      { speaker: "user", text: "I just meant, like, the soccer... tradition... family..." },
      { speaker: "boss", text: "Relax. I’m messing with you." },
      { speaker: "user", text: "Oh." },
      { speaker: "boss", text: "Mostly." },
      { speaker: "user", text: "Cool." },
      { speaker: "boss", text: "You’re already off balance. Good." },
      { speaker: "boss", text: "I’m in your head now." },
      { speaker: "user", text: "Yeah, no, that’s... not ideal." },
      { speaker: "boss", text: "Better for the race." }
    ],
    post: [
      { speaker: "boss", text: "Maybe I wasn’t as in your head as I thought." },
      { speaker: "user", text: "Yeah, I was gonna say - it felt pretty clear up there." },
      { speaker: "boss", text: "Don’t get used to it." },
      { speaker: "user", text: "So what now?" },
      { speaker: "user", text: "I just beat... what, the eight best racers in the world?" },
      { speaker: "boss", text: "In this world." },
      { speaker: "user", text: "...Okay, that sounds ominous." },
      { speaker: "boss", text: "Your next opponent isn’t from here." },
      { speaker: "user", text: "From where?" },
      { speaker: "boss", text: "No one knows." },
      { speaker: "boss", text: "They call him Racer Alpha." },
      { speaker: "user", text: "That’s not comforting." },
      { speaker: "boss", text: "It’s not supposed to be." }
    ]
  },
  "racer-alpha": {
    pre: [
      { speaker: "user", text: "Racer Alpha! I'm here to challenge you!" },
      { speaker: "boss", text: "*muffled talking*" },
      { speaker: "user", text: "What?" },
      { speaker: "boss", text: "*muffled talking*" },
      { speaker: "user", text: "I can't hear you with that stupid mask on." },
      { speaker: "boss", text: "Yes you can. Stop lying." },
      { speaker: "user", text: "Okay, I heard that. Take the mask off though. You're not Banksy." },
      { speaker: "boss", text: "You don't know that." },
      { speaker: "user", text: "Are you Banksy?" },
      { speaker: "boss", text: "You'll have to beat me if you want to find out what's under this mask." },
      { speaker: "user", text: "Is Nick Cannon going to unmask you?" },
      { speaker: "boss", text: "Let's see if your car's as fast as your mouth." }
    ],
    post: [
      { speaker: "user", text: "So... I win." },
      { speaker: "user", text: "Guess that means mask off." },
      { speaker: "boss", text: "Very well." },
      { speaker: "user", text: "Wait - hold on..." },
      { speaker: "boss", text: "", unmask: true },
      { speaker: "user", text: "Brad Pitt?" },
      { speaker: "boss", text: "No. I chose this form." },
      { speaker: "user", text: "You chose Brad Pitt?" },
      { speaker: "boss", text: "I read your mind and thought Brad Pitt from F1 would be cool for you." },
      { speaker: "user", text: "I mean... yeah, fair." },
      { speaker: "boss", text: "I am not human. I was sent here to evaluate your world’s greatest Tuners." },
      { speaker: "user", text: "Of course you were." },
      { speaker: "boss", text: "You have shown that you are worthy. Join us." },
      { speaker: "user", text: "Join... what?" },
      { speaker: "boss", text: "An intergalactic racing circuit." },
      { speaker: "user", text: "Nah. Pretty sure they haven’t figured out pizza in space yet." },
      { speaker: "user", text: "But give me a call when they do." }
    ]
  }
};

const defaultState = {
  selectedCar: cars[0].id,
  selectedRank: "E",
  selectedDistance: 400,
  highestRankIndex: 0,
  settings: {
    difficulty: "normal",
    volume: 45,
    shiftKey: "Space",
    nitroKey: "N",
    verticalKeys: {
      up: "W",
      down: "S",
      left: "A",
      right: "D"
    }
  },
  selectedBoss: bosses[0].id,
  selectedBattleBoss: bosses[0].id,
  selectedStoryCar: cars[0].id,
  selectedTimeCar: cars[0].id,
  selectedTimeTrack: storyTracks[0].id,
  selectedVindex: vindexEntries[0].number,
  selectedProfile: racerProfiles[0].id,
  racerAlphaUnmasked: false,
  racerAlphaProfileView: "masked",
  sprox: 0,
  unlimitedSprox: false,
  selectedTuner: null,
  tunerChosen: false,
  tunerChoiceVersion: 0,
  tutorialComplete: false,
  tutorialActive: false,
  tutorialScene: 0,
  tutorialLine: 0,
  tutorialDragSprox: 0,
  tutorialTimeMedal: "",
  tutorialAwaitingUpgrade: false,
  tutorialAwaitingEvolve: false,
  tutorialAwaitingForge: false,
  tutorialStartingSprox: 0,
  storyCarChosen: false,
  highestBossIndex: 0,
  selectedCampaign: 0,
  highestCampaignIndex: 0,
  selectedStoryCity: 0,
  completedCampaignLevels: {},
  betaTimeTrials: {},
  bond: {},
  partsInventory: Object.fromEntries(partVariants.map((part) => [part.key, 0])),
  equippedParts: {},
  achievements: {},
  winStreak: 0,
  selectedAchievement: achievementDefs[0].id,
  unlockedArtVanForms: [],
  unlockedLines: [...defaultUnlockedLines],
  medallionsOwned: [],
  timeTrials: {},
  storyTimeTrials: {},
  garage: Object.fromEntries(cars.map((car) => [car.id, { level: 1, xp: 0, evolution: 0, pendingEvolution: null }]))
};

let state = loadState();
sanitizeState();
let race = null;
let lastFrame = 0;
let evolutionModal = null;
let evolutionAnimationActive = false;
let verticalRace = null;
let pendingCutsceneStart = null;
let activeCutsceneLines = null;
let activeCutsceneIndex = 0;
let activeCutsceneContext = null;
let pendingDragRace = null;
let pendingIntroView = null;
let pendingPinkSlipContinue = null;
let upgradeModalCarId = null;
let selectedInventoryPartKey = partVariants[0]?.key || "";
let equipPartContext = null;
let pendingPinkSlipRiskStart = null;
const modeFlow = {
  drag: "car",
  time: "car",
  boss: "car",
  battle: "car",
  story: "car"
};
let battleState = null;
let storyReplayOpen = false;
const customTracksKey = "gearborn_custom_tracks";
const builderGridSize = 12;
let builderAllowLeave = false;
let pendingBuilderLeaveView = null;
const builderState = {
  mode: "menu",
  id: null,
  name: "Untitled Track",
  grid: [],
  selectedTile: "grass",
  rotation: 0,
  dirty: false,
  modalMode: null,
  pendingName: ""
};

const builderTileDefs = [
  { id: "grass", label: "Grass", asset: "assets/tracks/grass.png", accent: "transparent" },
  { id: "road_straight", label: "Road Straight", asset: "assets/tracks/road_straight_horizontal.png", accent: "transparent" },
  { id: "road_turn", label: "Road Turn", asset: "assets/tracks/road_turn.png", accent: "transparent" },
  { id: "road_t_intersection", label: "T Intersection", asset: "assets/tracks/road_t_intersection.png", accent: "transparent" },
  { id: "road_cross", label: "Road Cross", asset: "assets/tracks/road_cross.png", accent: "transparent" },
  { id: "road_curve_wide", label: "Wide Curve", asset: "assets/tracks/road_curve_wide.png", accent: "transparent" },
  { id: "wall_straight", label: "Wall Straight", asset: "assets/tracks/wall_straight.png", accent: "transparent" },
  { id: "wall_corner", label: "Wall Corner", asset: "assets/tracks/wall_corner.png", accent: "transparent" },
  { id: "start_finish", label: "Start / Finish", asset: "assets/tracks/road_straight_horizontal.png", accent: "repeating-linear-gradient(90deg,#fff 0 7px,#111 7px 14px)" },
  { id: "checkpoint", label: "Checkpoint", asset: "assets/tracks/road_straight_horizontal.png", accent: "rgba(82,199,255,.42)" }
];

const el = {
  views: document.querySelectorAll(".view"),
  navButtons: document.querySelectorAll("[data-view]"),
  sproxTotal: document.querySelector("#sprox-total"),
  dragCarGrid: document.querySelector("#drag-car-grid"),
  timeCarGrid: document.querySelector("#time-car-grid"),
  bossCarGrid: document.querySelector("#boss-car-grid"),
  battleCarGrid: document.querySelector("#battle-car-grid"),
  storyCarGrid: document.querySelector("#story-car-grid"),
  betaCarGrid: document.querySelector("#beta-car-grid"),
  dragCarSelectPreview: document.querySelector("#drag-car-select-preview"),
  timeCarSelectPreview: document.querySelector("#time-car-select-preview"),
  bossCarSelectPreview: document.querySelector("#boss-car-select-preview"),
  battleCarSelectPreview: document.querySelector("#battle-car-select-preview"),
  storyCarSelectPreview: document.querySelector("#story-car-select-preview"),
  betaCarSelectPreview: document.querySelector("#beta-car-select-preview"),
  betaCarSelectPanel: document.querySelector("#beta-car-select-panel"),
  betaCarSelectToggle: document.querySelector("#beta-car-select-toggle"),
  betaCarSelectOpen: document.querySelector("#beta-car-select-open"),
  betaCarSelectScreen: document.querySelector("#beta-car-select-screen"),
  betaCarSelectConfirm: document.querySelector("#beta-car-select-confirm"),
  betaCarSelectBack: document.querySelector("#beta-car-select-back"),
  betaMainScreen: document.querySelector("#beta-main-screen"),
  betaTrackSelectScreen: document.querySelector("#beta-track-select-screen"),
  betaTrackSelectTitle: document.querySelector("#beta-track-select-title"),
  playerCar: document.querySelector("#player-car"),
  storyCar: document.querySelector("#story-car"),
  campaignCar: document.querySelector("#campaign-car"),
  timeCar: document.querySelector("#time-car"),
  timeTrack: document.querySelector("#time-track"),
  timeTrackGrid: document.querySelector("#time-track-grid"),
  timeTrackPreview: document.querySelector("#time-track-preview"),
  bossList: document.querySelector("#boss-list"),
  bossPreview: document.querySelector("#boss-preview"),
  battleList: document.querySelector("#battle-list"),
  battlePreview: document.querySelector("#battle-preview"),
  startBattle: document.querySelector("#start-battle"),
  battleArena: document.querySelector("#battle-arena"),
  battlePlayerName: document.querySelector("#battle-player-name"),
  battleOpponentName: document.querySelector("#battle-opponent-name"),
  battlePlayerHpFill: document.querySelector("#battle-player-hp-fill"),
  battleOpponentHpFill: document.querySelector("#battle-opponent-hp-fill"),
  battlePlayerHp: document.querySelector("#battle-player-hp"),
  battleOpponentHp: document.querySelector("#battle-opponent-hp"),
  battlePlayerSpFill: document.querySelector("#battle-player-sp-fill"),
  battleOpponentSpFill: document.querySelector("#battle-opponent-sp-fill"),
  battlePlayerSp: document.querySelector("#battle-player-sp"),
  battleOpponentSp: document.querySelector("#battle-opponent-sp"),
  battlePlayerCar: document.querySelector("#battle-player-car"),
  battleOpponentCar: document.querySelector("#battle-opponent-car"),
  battlePlayerMove: document.querySelector("#battle-player-move"),
  battleOpponentMove: document.querySelector("#battle-opponent-move"),
  battleActions: document.querySelector("#battle-actions"),
  battleNextTurn: document.querySelector("#battle-next-turn"),
  battleLog: document.querySelector("#battle-log"),
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
  betaIntro: document.querySelector("#beta-intro"),
  betaRace: document.querySelector("#beta-race"),
  betaOptions: document.querySelector("#beta-options"),
  beta3dRace: document.querySelector("#beta-3d-race"),
  beta3dStart: document.querySelector("#beta-3d-start"),
  beta3dCanvas: document.querySelector("#beta-3d-canvas"),
  beta3dExit: document.querySelector("#beta-3d-exit"),
  beta3dFinishExit: document.querySelector("#beta-3d-finish-exit"),
  beta3dRestart: document.querySelector("#beta-3d-restart"),
  beta3dResults: document.querySelector("#beta-3d-results"),
  beta3dFinalTime: document.querySelector("#beta-3d-final-time"),
  beta3dTime: document.querySelector("#beta-3d-time"),
  beta3dSpeed: document.querySelector("#beta-3d-speed"),
  beta3dProgressFill: document.querySelector("#beta-3d-progress-fill"),
  beta3dMarker: document.querySelector("#beta-3d-marker"),
  betaTrackSelect: document.querySelector("#beta-track-select"),
  betaTrackList: document.querySelector("#beta-track-list"),
  betaTrackPreview: document.querySelector("#beta-track-preview"),
  betaTrackStart: document.querySelector("#beta-track-start"),
  betaTrackBack: document.querySelector("#beta-track-back"),
  betaLoading: document.querySelector("#beta-loading"),
  betaExit: document.querySelector("#beta-exit"),
  betaFinishExit: document.querySelector("#beta-finish-exit"),
  betaRestart: document.querySelector("#beta-restart"),
  betaDebug: document.querySelector("#beta-debug"),
  betaCanvas: document.querySelector("#beta-canvas"),
  betaMinimap: document.querySelector("#beta-minimap"),
  betaTime: document.querySelector("#beta-time"),
  betaLap: document.querySelector("#beta-lap"),
  betaCheckpoint: document.querySelector("#beta-checkpoint"),
  betaSpeed: document.querySelector("#beta-speed"),
  betaPosition: document.querySelector("#beta-position"),
  betaItemSlot: document.querySelector("#beta-item-slot"),
  betaItemIcon: document.querySelector("#beta-item-icon"),
  betaItemName: document.querySelector("#beta-item-name"),
  betaItemPrompt: document.querySelector("#beta-item-prompt"),
  betaCountdown: document.querySelector("#beta-countdown"),
  betaResults: document.querySelector("#beta-results"),
  betaFinalTime: document.querySelector("#beta-final-time"),
  builderMenu: document.querySelector("#builder-menu"),
  builderEditor: document.querySelector("#builder-editor"),
  builderLoadPanel: document.querySelector("#builder-load-panel"),
  builderNew: document.querySelector("#builder-new"),
  builderLoad: document.querySelector("#builder-load"),
  builderMenuNote: document.querySelector("#builder-menu-note"),
  builderPalette: document.querySelector("#builder-palette"),
  builderGrid: document.querySelector("#builder-grid"),
  builderCurrentName: document.querySelector("#builder-current-name"),
  builderDirtyState: document.querySelector("#builder-dirty-state"),
  builderRotate: document.querySelector("#builder-rotate"),
  builderClear: document.querySelector("#builder-clear"),
  builderSave: document.querySelector("#builder-save"),
  builderExit: document.querySelector("#builder-exit"),
  builderLoadBack: document.querySelector("#builder-load-back"),
  builderTrackList: document.querySelector("#builder-track-list"),
  deleteTracks: document.querySelector("#delete-tracks"),
  builderModal: document.querySelector("#builder-modal"),
  builderModalTitle: document.querySelector("#builder-modal-title"),
  builderModalCopy: document.querySelector("#builder-modal-copy"),
  builderModalSubcopy: document.querySelector("#builder-modal-subcopy"),
  builderModalInput: document.querySelector("#builder-modal-input"),
  builderModalActions: document.querySelector("#builder-modal-actions"),
  campaignList: document.querySelector("#campaign-list"),
  storyCityMap: document.querySelector("#story-city-map"),
  storyCityIcon: document.querySelector("#story-city-icon"),
  storyCityTitle: document.querySelector("#story-city-title"),
  storyCitySelect: document.querySelector("#story-city-select"),
  bossUnlockNote: document.querySelector("#boss-unlock-note"),
  storyMapStage: document.querySelector("#story-map-stage"),
  storyPreviewPanel: document.querySelector("#story-preview-panel"),
  closeStoryPreview: document.querySelector("#close-story-preview"),
  storyPreviewIcon: document.querySelector("#story-preview-icon"),
  storyPreviewArt: document.querySelector("#story-preview-art"),
  storyCitySelectPanel: document.querySelector("#story-city-select-panel"),
  closeCitySelect: document.querySelector("#close-city-select"),
  storyCityGrid: document.querySelector("#story-city-grid"),
  campaignType: document.querySelector("#campaign-type"),
  campaignTitle: document.querySelector("#campaign-title"),
  campaignMeta: document.querySelector("#campaign-meta"),
  campaignRewards: document.querySelector("#campaign-rewards"),
  storyLoadout: document.querySelector("#story-loadout"),
  startCampaign: document.querySelector("#start-campaign"),
  changeStoryCar: document.querySelector("#change-story-car"),
  replayCampaign: document.querySelector("#replay-campaign"),
  campaignRaceMount: document.querySelector("#campaign-race-mount"),
  vindexList: document.querySelector("#vindex-list"),
  vindexArt: document.querySelector("#vindex-art"),
  vindexNumber: document.querySelector("#vindex-number"),
  vindexName: document.querySelector("#vindex-name"),
  vindexLine: document.querySelector("#vindex-line"),
  profileList: document.querySelector("#profile-list"),
  profileArt: document.querySelector("#profile-art"),
  profileCarArt: document.querySelector("#profile-car-art"),
  profileName: document.querySelector("#profile-name"),
  profileMeta: document.querySelector("#profile-meta"),
  profileBio: document.querySelector("#profile-bio"),
  achievementList: document.querySelector("#achievement-list"),
  achievementDetail: document.querySelector("#achievement-detail"),
  playerPreviewArt: document.querySelector("#player-preview-art"),
  playerPreviewName: document.querySelector("#player-preview-name"),
  playerPreviewMeta: document.querySelector("#player-preview-meta"),
  distanceOptions: document.querySelector("#distance-options"),
  opponentList: document.querySelector("#opponent-list"),
  opponentPreviewArt: document.querySelector("#opponent-preview-art"),
  opponentPreviewName: document.querySelector("#opponent-preview-name"),
  opponentPreviewMeta: document.querySelector("#opponent-preview-meta"),
  startRace: document.querySelector("#start-race"),
  dragTrack: document.querySelector(".track"),
  dragMapStart: document.querySelector("#drag-map-start"),
  dragCountdown: document.querySelector("#drag-countdown"),
  godMode: document.querySelector("#god-mode"),
  godModal: document.querySelector("#god-modal"),
  godCode: document.querySelector("#god-code"),
  godCodeError: document.querySelector("#god-code-error"),
  confirmGod: document.querySelector("#confirm-god"),
  cancelGod: document.querySelector("#cancel-god"),
  upgradeModal: document.querySelector("#upgrade-modal"),
  closeUpgrade: document.querySelector("#close-upgrade"),
  confirmUpgrade: document.querySelector("#confirm-upgrade"),
  upgradeArt: document.querySelector("#upgrade-art"),
  upgradeSproxTotal: document.querySelector("#upgrade-sprox-total"),
  upgradeTitle: document.querySelector("#upgrade-title"),
  upgradeCarName: document.querySelector("#upgrade-car-name"),
  upgradeCarMeta: document.querySelector("#upgrade-car-meta"),
  upgradeStats: document.querySelector("#upgrade-stats"),
  upgradePartSlots: document.querySelector("#upgrade-part-slots"),
  upgradeCost: document.querySelector("#upgrade-cost"),
  openInventory: document.querySelector("#open-inventory"),
  inventoryModal: document.querySelector("#inventory-modal"),
  closeInventory: document.querySelector("#close-inventory"),
  partsGrid: document.querySelector("#parts-grid"),
  partDetail: document.querySelector("#part-detail"),
  equipPartModal: document.querySelector("#equip-part-modal"),
  closeEquipPart: document.querySelector("#close-equip-part"),
  equipPartsGrid: document.querySelector("#equip-parts-grid"),
  equipPartDetail: document.querySelector("#equip-part-detail"),
  confirmEquipPart: document.querySelector("#confirm-equip-part"),
  unequipPart: document.querySelector("#unequip-part"),
  replacePart: document.querySelector("#replace-part"),
  resetProgress: document.querySelector("#reset-progress"),
  replayTutorial: document.querySelector("#replay-tutorial"),
  tutorialReplayModal: document.querySelector("#tutorial-replay-modal"),
  tutorialReplayYes: document.querySelector("#tutorial-replay-yes"),
  tutorialSceneSelect: document.querySelector("#tutorial-scene-select"),
  tutorialReplayCancel: document.querySelector("#tutorial-replay-cancel"),
  tutorialSceneOptions: document.querySelector("#tutorial-scene-options"),
  tutorialFirstModal: document.querySelector("#tutorial-first-modal"),
  tutorialFirstYes: document.querySelector("#tutorial-first-yes"),
  tutorialFirstNo: document.querySelector("#tutorial-first-no"),
  cityUnlockModal: document.querySelector("#city-unlock-modal"),
  cityUnlockIcon: document.querySelector("#city-unlock-icon"),
  cityUnlockTitle: document.querySelector("#city-unlock-title"),
  cityUnlockClose: document.querySelector("#city-unlock-close"),
  pinkSlipWarningModal: document.querySelector("#pink-slip-warning-modal"),
  pinkSlipWarningCopy: document.querySelector("#pink-slip-warning-copy"),
  confirmPinkSlipRisk: document.querySelector("#confirm-pink-slip-risk"),
  cancelPinkSlipRisk: document.querySelector("#cancel-pink-slip-risk"),
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
  nitroFill: document.querySelector("#nitro-fill"),
  nitroReadout: document.querySelector("#nitro-readout"),
  nitroButton: document.querySelector("#nitro-button"),
  garageGrid: document.querySelector("#garage-grid"),
  garageStatus: document.querySelector("#garage-status"),
  difficulty: document.querySelector("#difficulty"),
  volume: document.querySelector("#volume"),
  shiftKey: document.querySelector("#shift-key"),
  nitroKey: document.querySelector("#nitro-key"),
  verticalUpKey: document.querySelector("#vertical-up-key"),
  verticalDownKey: document.querySelector("#vertical-down-key"),
  verticalLeftKey: document.querySelector("#vertical-left-key"),
  verticalRightKey: document.querySelector("#vertical-right-key"),
  evolutionModal: document.querySelector("#evolution-modal"),
  forgePanel: document.querySelector("#forge-panel"),
  garageContent: document.querySelector("#garage-content"),
  forgeVatImg: document.querySelector("#forge-vat-img"),
  forgeMedallionGrid: document.querySelector("#forge-medallion-grid"),
  forgeInventoryPanel: document.querySelector("#forge-inventory-panel"),
  forgeAnimationArea: document.querySelector("#forge-animation-area"),
  forgeSelectedName: document.querySelector("#forge-selected-name"),
  forgeSelectedMedallion: document.querySelector("#forge-selected-medallion"),
  forgeUnlockBtn: document.querySelector("#forge-unlock-btn"),
  forgeUnlockedPopup: document.querySelector("#forge-unlocked-popup"),
  medallionEarnedPopup: document.querySelector("#medallion-earned-popup"),
  evolutionStage: document.querySelector("#evolution-stage"),
  evolutionKicker: document.querySelector("#evolution-kicker"),
  evolutionTitle: document.querySelector("#evolution-title"),
  evolutionCopy: document.querySelector("#evolution-copy"),
  evolveButton: document.querySelector("#evolve-button"),
  closeEvolution: document.querySelector("#close-evolution"),
  evolutionAnimation: document.querySelector("#evolution-animation"),
  evolutionAnimationCurrent: document.querySelector("#evolution-animation-current"),
  evolutionAnimationNext: document.querySelector("#evolution-animation-next"),
  bossModal: document.querySelector("#boss-modal"),
  bossPortrait: document.querySelector("#boss-portrait"),
  bossModalTitle: document.querySelector("#boss-modal-title"),
  bossModalKicker: document.querySelector("#boss-modal-kicker"),
  bossModalCopy: document.querySelector("#boss-modal-copy"),
  continueBoss: document.querySelector("#continue-boss"),
  closeBoss: document.querySelector("#close-boss"),
  tunerModal: document.querySelector("#tuner-modal"),
  tunerOptions: document.querySelector("#tuner-options"),
  settingsTunerOptions: document.querySelector("#settings-tuner-options"),
  cutsceneModal: document.querySelector("#cutscene-modal"),
  cutsceneTitle: document.querySelector("#cutscene-title"),
  cutsceneLeftArt: document.querySelector("#cutscene-left-art"),
  cutsceneRightArt: document.querySelector("#cutscene-right-art"),
  cutsceneLeftDialogue: document.querySelector("#cutscene-left-dialogue"),
  cutsceneRightDialogue: document.querySelector("#cutscene-right-dialogue"),
  backCutscene: document.querySelector("#back-cutscene"),
  continueCutscene: document.querySelector("#continue-cutscene"),
  skipCutscene: document.querySelector("#skip-cutscene"),
  closeCutscene: document.querySelector("#close-cutscene"),
  tutorialOverlay: document.querySelector("#tutorial-overlay"),
  tutorialCard: document.querySelector("#tutorial-card"),
  tutorialPortrait: document.querySelector("#tutorial-portrait"),
  tutorialKicker: document.querySelector("#tutorial-kicker"),
  tutorialTitle: document.querySelector("#tutorial-title"),
  tutorialCopy: document.querySelector("#tutorial-copy"),
  tutorialBack: document.querySelector("#tutorial-back"),
  tutorialNext: document.querySelector("#tutorial-next"),
  tutorialSkip: document.querySelector("#tutorial-skip"),
  unmaskModal: document.querySelector("#unmask-modal"),
  unmaskPortrait: document.querySelector("#unmask-portrait"),
  unmaskButton: document.querySelector("#unmask-button"),
  continueUnmask: document.querySelector("#continue-unmask"),
  unmaskCopy: document.querySelector("#unmask-copy")
};
const embeddedRaceHomes = ["play", "time-trial", "boss", "battle"].map((view) => {
  const node = document.querySelector(`#${view}-view`);
  return { view, node, parent: node.parentNode, next: node.nextSibling };
});
let embeddedCampaignView = null;
let pendingBossRaceStart = null;
let pendingCityUnlock = null;

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
  state.tutorialAwaitingUpgrade = Boolean(state.tutorialAwaitingUpgrade);
  state.tutorialAwaitingEvolve = Boolean(state.tutorialAwaitingEvolve);
  state.tutorialAwaitingForge = Boolean(state.tutorialAwaitingForge);
  state.tutorialStartingSprox = Math.max(0, Math.floor(Number(state.tutorialStartingSprox) || 0));
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
    const form = currentEvolution(carId);
    unlocked.forEach((milestone) => {
      showToast("Bond Boost Unlocked!", `${form.name} gained ${formatBondBoosts(milestone.boosts)}!`);
    });
  }
  return unlocked;
}

function recordStoryRaceOutcome(won, isStoryRace) {
  if (!isStoryRace) return;
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
  return newlyUnlocked;
}

function unlockArtVanForm(index) {
  const car = cars.find((item) => item.id === "art-van");
  if (!car || !car.evolutions[index]) return null;
  unlockCarLine("art-van");
  state.unlockedArtVanForms = Array.isArray(state.unlockedArtVanForms) ? state.unlockedArtVanForms : [];
  if (!state.unlockedArtVanForms.includes(0)) state.unlockedArtVanForms.push(0);
  if (!state.unlockedArtVanForms.includes(index)) state.unlockedArtVanForms.push(index);
  state.unlockedArtVanForms.sort((a, b) => a - b);
  const progress = state.garage["art-van"];
  if (!state.unlockedArtVanForms.includes(progress.evolution)) progress.evolution = index;
  progress.unlockedEvolution = Math.max(progress.unlockedEvolution || 0, index);
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

function difficultyMultiplier() {
  return { easy: 0.9, normal: 1, hard: 1.13 }[state.settings.difficulty] || 1;
}

function selectedCarIdForMode(mode) {
  if (mode === "drag") return state.selectedCar;
  if (mode === "time") return state.selectedTimeCar;
  if (mode === "beta") return state.selectedCar;
  if (mode === "battle") return state.selectedStoryCar;
  return state.selectedStoryCar;
}

function setSelectedCarForMode(mode, carId) {
  if (!isCarUnlocked(carId)) return;
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
  const car = cars.find((item) => item.id === carId) || cars.find((item) => isCarUnlocked(item.id));
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
  if (!nextRaceNode || !nextRewardNode) return;
  const cityIndex = Math.max(0, Math.min(state.selectedStoryCity || 0, highestUnlockedStoryCityIndex()));
  const city = storyCities[cityIndex] || storyCities[0];
  const level = firstPlayableStoryLevelForCity(cityIndex) || campaignLevels[0];
  const cityName = city?.city || "Indianapolis";
  nextRaceNode.textContent = `${cityName} - ${level?.title || "Next Level"}`;
  let reward = 50;
  if (level?.type === "drag" || level?.type === "pink-slip") reward = level.drag.xp;
  if (level?.type === "trial") reward = timeMedals[timeMedals.length - 1].xp;
  if (level?.type === "battle") reward = battleRewardForBossIndex(level.bossIndex);
  if (level?.type === "boss") reward = (level.final ? finalBoss : bosses[level.bossIndex])?.xp || reward;
  nextRewardNode.textContent = `Reward +${reward} Sprox`;
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
  if (el.campaignCar) {
    el.campaignCar.innerHTML = options;
    el.campaignCar.value = state.selectedStoryCar;
  }
  el.timeCar.value = state.selectedTimeCar;
  el.timeTrack.innerHTML = storyTracks.map((track) => `<option value="${track.id}">${track.city}, ${track.country}</option>`).join("");
  el.timeTrack.value = state.selectedTimeTrack;
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
  return city.levels.filter((level) => ["drag", "trial", "battle", "rival"].includes(level.type)).filter((level) => storyLevelCompleted(level.campaignIndex)).length;
}

function cityCoreLevelsTotal(city) {
  return city.levels.filter((level) => ["drag", "trial", "battle", "rival"].includes(level.type)).length;
}

function cityBossRequirement(city) {
  return city.levels.some((level) => level.type === "rival") ? 3 : 2;
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
  if (level.type === "drag" || level.type === "trial" || level.type === "battle" || level.type === "rival") return true;
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
  const city = storyCities[state.selectedStoryCity] || storyCities[0];
  const cityUnlocked = storyCityUnlocked(state.selectedStoryCity);
  el.storyCityIcon.innerHTML = city.icon ? `<img src="${city.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : "";
  el.storyCityTitle.textContent = `${city.city}, ${city.country}`.toUpperCase();
  el.storyCityMap.style.backgroundImage = `linear-gradient(135deg, rgba(17, 24, 32, 0.42), rgba(26, 31, 39, 0.58)), url("${city.track.cityMap || city.track.map}")`;
  el.storyCityMap.style.backgroundSize = "cover";
  el.storyCityMap.style.backgroundPosition = "center";
  const completedCore = cityCoreLevelsCompleted(city);
  const totalCore = cityCoreLevelsTotal(city);
  const requiredCore = Math.min(cityBossRequirement(city), totalCore);
  const remainingCore = Math.max(0, requiredCore - completedCore);
  el.bossUnlockNote.textContent = cityUnlocked && !city.final && !cityBossUnlocked(city)
    ? `Beat ${remainingCore}/${totalCore} Levels to Unlock Boss Race`
    : "";
  el.storyMapStage.innerHTML = city.levels.map((level) => storyMapNodeMarkup(city, level)).join("");
  renderStoryCityGrid();
  renderStoryLevelPreview();
}

function storyMapNodeMarkup(city, level) {
  const hidden = !storyLevelVisible(city, level);
  const locked = storyLevelLocked(city, level);
  const completed = storyLevelCompleted(level.campaignIndex);
  const visual = storyLevelVisuals[level.type] || storyLevelVisuals.boss;
  const layout = storyNodeLayouts.find((item) => item.key === level.type) || storyNodeLayouts[0];
  return `
    <button class="story-map-node ${locked ? "locked" : ""} ${completed ? "completed" : ""}" type="button" data-story-level="${level.campaignIndex}" style="left:${layout.x}%; top:${layout.y}%; --node-color:${visual.color}" ${hidden ? "hidden" : ""} ${locked ? "disabled" : ""}>
      ${storyNodeIconMarkup(city, level, visual)}
      <span class="story-node-label">${completed ? "Complete" : visual.label}</span>
    </button>
  `;
}

function rivalTuner() {
  const playerId = selectedTuner().id;
  return tuners.find((tuner) => tuner.id === (playerId === "cha-cha" ? "mylo" : "cha-cha")) || tuners[1] || tuners[0];
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
    return `
      <span class="story-node-icon layered type-pink-slip">
        <img class="node-bg" src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <img class="node-subject pink-car" src="${form.displayImage || form.image}" alt="${form.name}" loading="lazy" decoding="async">
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
  renderCampaignRewards(level, locked);
  renderStoryLoadout();
  el.startCampaign.disabled = locked;
  el.startCampaign.textContent = "Start Level";
}

function storyPreviewArtMarkup(level, locked) {
  if (locked) return `<div class="silhouette-card"><div class="silhouette-car">?</div></div>`;
  if (level.type === "drag" || level.type === "pink-slip") {
    const image = level.drag.displayImage || level.drag.image?.replace("-race.", "-display.");
    return displayMarkup(image, level.drag.name, level.type === "pink-slip" ? "#f4a7d8" : "#ffc857");
  }
  if (level.type === "battle") {
    return `<div class="story-map-preview" style="background-image:url('assets/maps/map-battle-arena.png')"><span>Arena Battle</span></div>`;
  }
  if (level.type === "trial") {
    return `<div class="story-map-preview" style="background-image:url('${level.track.map}')"><span>${level.track.city}</span></div>`;
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
  state.selectedCampaign = firstPlayableStoryLevelForCity(index)?.campaignIndex ?? state.selectedCampaign;
  closeCitySelect();
  closeStoryPreview();
  saveState();
  renderCampaign();
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
    el.campaignRewards.innerHTML = timeMedals.map((medal) => `
      <div class="reward-row compact">
        <span class="medal-text ${medal.key}">${medal.label}</span>
        <strong>${timeTarget(medal, trackIndex).toFixed(2)} s · ${medal.xp} Sprox</strong>
      </div>
    `).join("") + bestResult + possiblePartRewardMarkup();
    return;
  }
  if (level.type === "drag" || level.type === "pink-slip") {
    const safeReplay = level.type === "pink-slip" && !isPinkSlipRiskActive(level)
      ? `<div class="reward-row compact"><span>Pink Slip</span><strong>Reward already unlocked. Replay is safe.</strong></div>`
      : "";
    const riskRow = isPinkSlipRiskActive(level)
      ? `<div class="reward-row compact pink-risk-row"><span>Risk</span><strong>Lose: Level 1 reset and equipped parts taken.</strong></div>`
      : "";
    el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${level.drag.xp} Sprox</strong></div>${riskRow}${safeReplay}${possiblePartRewardMarkup()}`;
    return;
  }
  if (level.type === "battle") {
    const reward = battleRewardForBossIndex(level.bossIndex);
    el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${reward} Sprox</strong></div>${possiblePartRewardMarkup()}`;
    return;
  }
  if (level.type === "rival") {
    el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${level.xp} Sprox</strong></div>${possiblePartRewardMarkup()}`;
    return;
  }
  const boss = level.final ? finalBoss : bosses[level.bossIndex];
  el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${boss.xp} Sprox</strong></div>${possiblePartRewardMarkup()}`;
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
  if (level.type === "battle") {
    const boss = bosses[level.bossIndex];
    return `${boss.name} · ${boss.car} · Arena`;
  }
  if (level.type === "rival") {
    const rival = rivalTuner();
    const mechanic = { drag: "Drag Race", bossVertical: "City Sprint", battle: "Battle Mode" }[level.mechanic] || "Rival Race";
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
    Crusadome: "assets/bosses/boss-crusadome-race.png",
    Baronessex: "assets/bosses/boss-baronessex-race.png",
    Shamacht: "assets/cars/whale-shamacht-race.png",
    Inflewenze: "assets/bosses/boss-inflewenze-race.png",
    Hurrdaboutis: "assets/bosses/boss-hurrdaboutis-race.png",
    Matunnie: "assets/cars/rabbit-matunnie-race.png",
    Kuumbusta: "assets/bosses/boss-kuumbusta-race.png",
    Kermajesty: "assets/cars/frog-kermajesty-race.png",
    Hornula1: "assets/cars/rival-hornula1-race.png"
  };
  return byCar[boss.car] || boss.carImage || "assets/cars/tutorque-race.png";
}

function bossCarDisplayImage(boss) {
  const byCar = {
    Crusadome: "assets/cars/rival-crusadome-display.png",
    Baronessex: "assets/story/baronessex-display.png",
    Shamacht: "assets/cars/whale-shamacht-display.png",
    Inflewenze: "assets/story/inflewenze-display.png",
    Hurrdaboutis: "assets/story/hurrdaboutis-display.png",
    Matunnie: "assets/cars/rabbit-matunnie-display.png",
    Kuumbusta: "assets/story/kuumbusta-display.png",
    Kermajesty: "assets/cars/frog-kermajesty-display.png",
    Hornula1: "assets/cars/rival-hornula1-display.png"
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

function battleUnitFromStats(name, image, stats, isPlayer = false) {
  const hpMax = Math.round(165 + stats.body * 3.2);
  return { name, image, stats, hp: hpMax, hpMax, sp: 0, stunned: false, isPlayer };
}

function beginBattle(mode = "battle", options = {}) {
  const boss = options.boss || bossChallengeBosses.find((item) => item.id === state.selectedBattleBoss) || bossChallengeBosses[0];
  const carId = options.carId || state.selectedStoryCar;
  const playerForm = currentEvolution(carId);
  const player = battleUnitFromStats(playerForm.name, imageFor(playerForm, "race"), displayedGearbornStats(carId), true);
  const opponentStats = options.tutorial
    ? displayedGearbornStatsAtLevel(tutorialOpponentCarId, 1)
    : options.opponentStats || bossBattleStats(boss);
  const opponentImage = options.tutorial ? "assets/cars/tutorque-race.png" : options.opponentImage || battleCarImageForBoss(boss);
  const opponentName = options.tutorial ? "Tutorque" : options.opponentName || boss.car;
  battleState = {
    mode,
    boss,
    carId,
    player,
    opponent: battleUnitFromStats(opponentName, opponentImage, opponentStats),
    waitingNext: false,
    finished: false,
    campaignLevelIndex: options.campaignLevelIndex ?? null,
    reward: options.reward ?? null,
    rival: options.rival || null,
    restartOptions: options
  };
  setFlowStep("battle", "race");
  renderBattle();
}

function battleDamage(attacker, defender, move, defenderMove) {
  if (move === "defend") return 0;
  const base = move === "special" ? 42 : 26;
  const attack = base + attacker.stats.speed * 0.16 + attacker.stats.acceleration * 0.2;
  const crit = 1.12 + normalizedGearbornStat(attacker.stats.powertrain) * 0.28;
  let damage = move === "special" ? attack * crit : attack;
  if (defenderMove === "defend" && move !== "special") {
    damage *= 0.34 - normalizedGearbornStat(defender.stats.body) * 0.14;
  }
  return Math.max(8, Math.round(damage));
}

function chooseOpponentBattleMove() {
  if (battleState.opponent.stunned) return "stunned";
  if (battleState.opponent.sp >= 4) return Math.random() < 0.7 ? "special" : "attack";
  if (battleState.opponent.hp < battleState.opponent.hpMax * 0.35 && Math.random() < 0.35) return "defend";
  return Math.random() < 0.72 ? "attack" : "defend";
}

function battleMoveLabel(move) {
  return {
    attack: "attack",
    defend: "defend",
    special: "special",
    stunned: "stunned"
  }[move] || move;
}

function battleMoveIcon(move) {
  return {
    attack: "assets/items/battle-attack.png",
    defend: "assets/items/battle-defend.png",
    special: "assets/items/battle-special.png"
  }[move] || "";
}

function handleBattleMove(playerMove) {
  if (!battleState || battleState.finished || battleState.waitingNext) return;
  const player = battleState.player;
  const opponent = battleState.opponent;
  const playerWasStunned = player.stunned;
  if (!playerWasStunned && playerMove === "special" && player.sp < 4) return;
  const playerAction = playerWasStunned ? "stunned" : playerMove;
  const opponentMove = playerWasStunned ? "attack" : chooseOpponentBattleMove();
  const opponentWasStunned = opponentMove === "stunned";
  const opponentCanAct = opponentMove !== "stunned";
  const playerDamage = opponentCanAct ? battleDamage(opponent, player, opponentMove, playerAction) : 0;
  const opponentDamage = playerWasStunned ? 0 : battleDamage(player, opponent, playerAction, opponentMove);
  player.hp = Math.max(0, player.hp - playerDamage);
  opponent.hp = Math.max(0, opponent.hp - opponentDamage);
  if (playerAction === "special") player.sp = 0;
  if (opponentMove === "special") opponent.sp = 0;
  if (playerAction === "attack" && opponentDamage > 0) player.sp = Math.min(4, player.sp + 1);
  if (opponentMove === "attack" && playerDamage > 0) opponent.sp = Math.min(4, opponent.sp + 1);
  let stunnedName = "";
  if (playerAction === "defend" && opponentMove === "attack") {
    player.sp = Math.min(4, player.sp + 1);
    opponent.stunned = true;
    stunnedName = opponent.name;
  } else {
    opponent.stunned = false;
  }
  if (opponentMove === "defend" && playerAction === "attack") {
    opponent.sp = Math.min(4, opponent.sp + 1);
    player.stunned = true;
    stunnedName = player.name;
  } else {
    player.stunned = false;
  }
  battleState.waitingNext = true;
  el.battleArena.classList.add("resolving");
  el.battlePlayerMove.style.backgroundImage = playerAction === "stunned" ? "" : `url("${battleMoveIcon(playerAction)}")`;
  el.battleOpponentMove.style.backgroundImage = opponentMove === "stunned" ? "" : `url("${battleMoveIcon(opponentMove)}")`;
  el.battlePlayerMove.classList.toggle("active", playerAction !== "stunned");
  el.battleOpponentMove.classList.toggle("active", opponentMove !== "stunned");
  if (playerWasStunned) {
    el.battleLog.textContent = `${player.name} is stunned and can't attack.`;
  } else if (opponentWasStunned) {
    el.battleLog.textContent = `${opponent.name} is stunned and can't attack.`;
  } else if (stunnedName) {
    el.battleLog.textContent = `${stunnedName} is stunned.`;
  } else {
    el.battleLog.textContent = `${player.name} used ${battleMoveLabel(playerAction)}. ${opponent.name} used ${battleMoveLabel(opponentMove)}.`;
  }
  renderBattle();
  if (player.hp <= 0 || opponent.hp <= 0) finishBattle();
}

function nextBattleTurn() {
  if (!battleState || battleState.finished) return;
  battleState.waitingNext = false;
  el.battleArena.classList.remove("resolving");
  el.battlePlayerMove.classList.remove("active");
  el.battleOpponentMove.classList.remove("active");
  el.battleLog.textContent = "Choose a move.";
  renderBattle();
}

function finishBattle() {
  battleState.finished = true;
  const won = battleState.opponent.hp <= 0 && battleState.player.hp > 0;
  const index = bossChallengeBosses.findIndex((boss) => boss.id === battleState.boss.id);
  const earned = tutorialActive() && !won ? 0 : won ? (battleState.reward ?? battleRewardForBossIndex(index)) : Math.round(35 + Math.max(0, index) * 18);
  addSprox(earned);
  recordRaceUsage(battleState.carId);
  const partReward = won && battleState.campaignLevelIndex !== null ? rollStoryPartReward() : null;
  recordStoryRaceOutcome(won, battleState.campaignLevelIndex !== null);
  let unlockedBossName = "";
  if (won && battleState.mode === "battle") {
    unlockedBossName = unlockNextTrainingBossFromBoss(battleState.boss.id);
  }
  if (tutorialActive() && won) setTutorialScene("post-battle");
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
    primaryLabel: tutorialActive() && !won ? "Try Again" : tutorialActive() ? "Next" : battleState.campaignLevelIndex !== null ? "Next" : "Select Opponent",
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
      if (battleState.campaignLevelIndex !== null) {
        const level = campaignLevels[battleState.campaignLevelIndex];
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
  el.battlePlayerSp.textContent = `${player.sp}/4`;
  el.battleOpponentSp.textContent = `${opponent.sp}/4`;
  el.battlePlayerSpFill.style.width = `${player.sp / 4 * 100}%`;
  el.battleOpponentSpFill.style.width = `${opponent.sp / 4 * 100}%`;
  el.battlePlayerCar.style.backgroundImage = `url("${player.image}")`;
  el.battleOpponentCar.style.backgroundImage = `url("${opponent.image}")`;
  el.battleNextTurn.hidden = !battleState.waitingNext || battleState.finished;
  el.battleActions.querySelectorAll("[data-battle-move]").forEach((button) => {
    const move = button.dataset.battleMove;
    button.disabled = battleState.waitingNext || battleState.finished || (!player.stunned && move === "special" && player.sp < 4);
  });
}

function renderTimeTargets() {
  if (tutorialActive() && currentTutorialScene().id === "time-trial") {
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
  if (tutorialActive() && currentTutorialScene().id === "time-trial") {
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

function renderVindex() {
  el.vindexList.innerHTML = vindexEntries.map((entry) => `
    <button class="vindex-button ${entry.number === state.selectedVindex ? "active" : ""}" type="button" data-vindex="${entry.number}">
      <span>#${entry.number}</span>
      <strong>${isVindexDiscovered(entry) ? entry.name : "????"}</strong>
    </button>
  `).join("");
  const entry = vindexEntries.find((item) => item.number === state.selectedVindex);
  const discovered = isVindexDiscovered(entry);
  el.vindexArt.innerHTML = discovered ? displayMarkup(entry.image, entry.name, "#52c7ff") : silhouetteMarkup();
  el.vindexNumber.textContent = `#${entry.number}`;
  el.vindexName.textContent = discovered ? entry.name : "????";
  el.vindexLine.textContent = entry.line;
  document.querySelectorAll(".vindex-evolution-line").forEach((node) => node.remove());
  el.vindexLine.insertAdjacentHTML("afterend", evolutionLineMarkup(entry));
}

function playableEntryMeta(entry) {
  for (const car of cars) {
    const index = car.evolutions.findIndex((evolution) => evolution.name === entry.name);
    if (index >= 0) return { car, index };
  }
  return null;
}

const oneOffEvolutionMeta = {
  Bananachi: { line: "Monkey Line", position: 0, total: 3 },
  Manstrocity: { line: "Armadillo Dad Line", position: 2, total: 3 },
  Beardo: { line: "Mustache Line", position: 1, total: 3 },
  Phantaxi: { line: "Ghost Taxi Line", position: 1, total: 2 },
  Inflewenze: { line: "Influencer Line", position: 2, total: 3 },
  Sponsore: { line: "Bumper Sticker Line", position: 1, total: 2 },
  Baronessex: { line: "German Discipline Line", position: 1, total: 2 },
  Crusadome: { line: "Crusader Line", position: 1, total: 2 },
  Kuumbusta: { line: "Combustion Line", position: 2, total: 3 },
  Hurrdaboutis: { line: "Roundabout Line", position: 1, total: 2 }
};

function isVindexDiscovered(entry) {
  if (state.unlimitedSprox) return true;
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
  el.profileMeta.textContent = profile.category === "Other" ? "Other" : profile.car ? `${profile.car} · ${profile.city}, ${profile.country}` : "Story Tuner";
  const boss = bossChallengeBosses.find((item) => item.id === profile.id);
  el.profileCarArt.innerHTML = boss ? `<img src="${bossCarDisplayImage(boss)}" alt="${boss.car}" loading="lazy" decoding="async">` : "";
  el.profileBio.textContent = profile.bio;
}

function achievementRewardArt(achievement) {
  const artFormIndex = artVanUnlockByAchievement[achievement.id];
  if (Number.isInteger(artFormIndex)) {
    const form = cars.find((car) => car.id === "art-van")?.evolutions[artFormIndex];
    return form ? carMarkupForEvolution("art-van", artFormIndex, "display") : silhouetteMarkup();
  }
  if (achievement.id === "vindex50") return carMarkupForEvolution("cake-train", 0, "display");
  if (achievement.id === "vindex75") return `<div class="achievement-reward-parts">${partTypes.slice(0, 3).map((part) => partImageMarkup({ ...part, level: 2, bonus: 3, stars: "★★" }, "achievement-part-image")).join("")}</div>`;
  if (achievement.id === "vindex25") return `<span class="achievement-sprox-preview sprox-coin" aria-label="Sprox reward"></span>`;
  return `<div class="achievement-trophy">★</div>`;
}

function renderAchievements() {
  if (!el.achievementList || !el.achievementDetail) return;
  if (checkAchievements(true)) saveState();
  const selected = achievementDefs.find((achievement) => achievement.id === state.selectedAchievement) || achievementDefs[0];
  el.achievementList.innerHTML = achievementDefs.map((achievement) => {
    const progress = achievementProgress(achievement);
    const record = state.achievements[achievement.id] || {};
    return `
      <button class="achievement-card ${achievement.id === selected.id ? "active" : ""} ${record.complete ? "complete" : ""}" type="button" data-achievement="${achievement.id}">
        <span class="achievement-card-copy">
          <strong>${achievement.name}</strong>
          <small>${achievement.requirement}</small>
          <em>${record.granted ? "Reward unlocked" : achievement.reward}</em>
        </span>
        <span class="achievement-progress">
          <strong>${record.complete ? "Complete" : `${progress.percent}%`}</strong>
          <small>${progress.label}</small>
        </span>
      </button>
    `;
  }).join("");
  const progress = achievementProgress(selected);
  const record = state.achievements[selected.id] || {};
  el.achievementDetail.innerHTML = `
    <div class="achievement-detail-art">${achievementRewardArt(selected)}</div>
    <p class="achievement-kicker">${record.complete ? "Unlocked" : "In Progress"}</p>
    <h2>${selected.name}</h2>
    <p>${selected.requirement}</p>
    <div class="achievement-meter" aria-label="${progress.percent}% complete">
      <i style="width:${Math.min(100, progress.percent)}%"></i>
    </div>
    <div class="achievement-detail-grid">
      <span>Progress</span><strong>${progress.label}</strong>
      <span>Reward</span><strong>${selected.reward}</strong>
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

function renderGarage() {
  if (tutorialActive() && ["garage", "upgrade", "evolve"].includes(currentTutorialScene().id)) {
    renderTutorialGarage();
    return;
  }
  const godModeActive = garageGodModeActive();
  el.garageStatus.hidden = !godModeActive;
  el.garageStatus.textContent = godModeActive
    ? "God Mode Active: all GearBorn lines are unlocked and maxed with unlimited Sprox"
    : "";
  const garageCars = orderedCarList(cars.filter((car) => !car.tutorialOnly && (isCarUnlocked(car.id) || car.id === "rainbowlt")));
  el.garageGrid.innerHTML = garageCars.map((car) => {
    if (!isCarUnlocked(car.id)) {
      return lockedGarageCard(car);
    }
    const progress = state.garage[car.id];
    const maxed = progress.level >= maxCarLevel;
    const stats = displayedGearbornStats(car.id);
    const playstyle = gearbornStatProfiles[car.id]?.playstyle || "";
    const upgradeCost = xpForNextLevel(progress.level);
    return `
      <article class="garage-card">
        <div class="garage-art">
          ${carMarkupForEvolution(car.id, progress.evolution, "display")}
          ${garageArtPartSlots(car.id)}
        </div>
        <div class="garage-info">
          <h2>${currentEvolution(car.id).name}</h2>
          <h3>${car.family}</h3>
          <p class="playstyle-tag">${playstyle}</p>
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
        </div>
      </article>
    `;
  }).join("");
}

function renderTutorialGarage() {
  el.garageStatus.hidden = false;
  el.garageStatus.textContent = "Tutorial Garage";
  const car = cars.find((item) => item.id === tutorialCarId);
  const progress = state.garage[tutorialCarId];
  const stats = displayedGearbornStats(tutorialCarId);
  const playstyle = gearbornStatProfiles[tutorialCarId]?.playstyle || "";
  const maxed = progress.level >= maxCarLevel;
  el.garageGrid.innerHTML = `
    <article class="garage-card">
      <div class="garage-art">
        ${carMarkupForEvolution(tutorialCarId, progress.evolution, "display")}
        ${garageArtPartSlots(tutorialCarId)}
      </div>
      <div class="garage-info">
        <h2>${currentEvolution(tutorialCarId).name}</h2>
        <h3>${car.family}</h3>
        <p class="playstyle-tag">${playstyle}</p>
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
    state.tutorialAwaitingEvolve = false;
    setTutorialScene("evolve");
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
  if (carId === "art-van") {
    const unlockedForms = (state.unlockedArtVanForms || [0]).filter((index) => car.evolutions[index]);
    const currentPosition = Math.max(0, unlockedForms.indexOf(progress.evolution));
    const delta = direction === "next" ? 1 : -1;
    const nextPosition = Math.max(0, Math.min(unlockedForms.length - 1, currentPosition + delta));
    progress.evolution = unlockedForms[nextPosition] ?? 0;
    saveState();
    render();
    return;
  }
  const delta = direction === "next" ? 1 : -1;
  progress.evolution = Math.max(0, Math.min(unlockedEvolutionIndex(carId), progress.evolution + delta));
  saveState();
  render();
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
    setTutorialScene("dr-controls");
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
}

function startPendingDragRace() {
  const config = pendingDragRace || { campaignLevelIndex: null, dragStage: null };
  el.dragMapStart.classList.remove("active");
  runCountdown(el.dragCountdown, () => {
    startDragRace(config.campaignLevelIndex, config.dragStage);
    pendingDragRace = null;
  });
}

function startDragRace(campaignLevelIndex = null, dragStage = null) {
  el.dragMapStart.classList.remove("active");
  const car = carStats(state.selectedCar);
  const rank = dragStage
    ? { key: dragStage.rankKey, name: dragStage.name, xpBonus: dragStage.xp / 180, power: dragStage.power, color: "#f25f5c", images: { race: dragStage.image } }
    : ranks.find((item) => item.key === state.selectedRank);
  const distance = dragStage?.tutorial ? tutorialDistance : distances.find((item) => item.meters === state.selectedDistance);
  const rankIndex = ranks.findIndex((item) => item.key === rank.key);
  const classScale = dragStage?.tutorial ? 0.5 : 0.9 + rankIndex * 0.09;
  const rivalPower = rank.power * classScale * distance.difficulty * difficultyMultiplier();
  const rivalNitroSkill = Math.max(0, rankIndex) / Math.max(1, ranks.length - 1);
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
    playerTorque: car.torqueNorm,
    accelPenalty: 1,
    topGearBoost: 1,
    shiftWindow: car.shiftWindow,
    rivalMaxSpeed: 92 + rivalPower * 42,
    rivalAcceleration: 17 + rivalPower * 12,
    nitroCharge: 0,
    nitroActive: false,
    nitroTimer: 0,
    overheatCount: 0,
    overheatLatched: false,
    rivalNitroCharge: 0,
    rivalNitroActive: false,
    rivalNitroTimer: 0,
    rivalNitroSkill,
    rivalNitroUsed: false,
    rivalShiftTimer: Math.max(0.65, 1.3 - rivalNitroSkill * 0.35),
    rivalNitroDelay: 0,
    shiftScore: [],
    rank,
    distance,
    dragStage,
    campaignLevelIndex,
    carId: state.selectedCar
  };
  if (dragStage) {
    el.rivalRacer.style.setProperty("--car-color", rank.color);
    setRacerImage(el.rivalRacer, el.rivalRacerImage, dragStage.image, dragStage.name);
  }
  lastFrame = performance.now();
  el.raceMessage.className = "race-message";
  el.raceMessage.textContent = `Race started. Press ${readableKey(state.settings.shiftKey)} when the shift meter hits the bright band.`;
  updateNitroHud();
  requestAnimationFrame(updateRace);
}

function updateRace(now) {
  if (!race?.active) return;
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;

  if (race.gear >= 6) {
    const speedRatio = Math.min(1, race.playerSpeed / race.playerMaxSpeed);
    const topGearPull = Math.max(0.16, 1 - speedRatio);
    race.playerSpeed += race.playerAcceleration * race.playerPower * race.topGearBoost * race.accelPenalty * topGearPull * dt;
    race.rpm = 0.74;
  } else {
    const gearDrag = 1 - (race.gear - 1) * 0.08;
    const rpmPower = 0.52 + race.rpm * 0.72;
    if (race.rpm > 0.86) {
      race.accelPenalty = Math.max(0.42, race.accelPenalty - 0.34 * dt);
    }
    race.playerSpeed += race.playerAcceleration * race.playerPower * race.accelPenalty * gearDrag * rpmPower * dt;
    race.rpm += (0.22 + race.playerSpeed / 260) * dt;
  }
  updateDragNitroTimers(dt);
  updateRivalNitro(dt);
  race.rivalSpeed += race.rivalAcceleration * (0.78 + Math.random() * 0.08) * dt;

  const playerNitroScale = race.nitroActive ? dragNitroMultiplier : 1;
  const rivalNitroScale = race.rivalNitroActive ? dragNitroMultiplier : 1;
  const playerCap = (race.gear >= 6 ? race.playerMaxSpeed : race.playerMaxSpeed * (0.58 + race.gear * 0.15)) * playerNitroScale;
  const rivalCap = race.rivalMaxSpeed * rivalNitroScale;
  race.playerSpeed = Math.min(race.playerSpeed, playerCap);
  race.rivalSpeed = Math.min(race.rivalSpeed, rivalCap);

  race.playerDistance += mphToMetersPerSecond(race.playerSpeed) * dt;
  race.rivalDistance += mphToMetersPerSecond(race.rivalSpeed) * dt;

  if (race.gear < 6 && race.rpm >= 1) {
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
  if (race.rivalNitroTimer > 0) {
    race.rivalNitroTimer = Math.max(0, race.rivalNitroTimer - dt);
    race.rivalNitroActive = race.rivalNitroTimer > 0;
  }
  if (race.rivalNitroDelay > 0) {
    race.rivalNitroDelay = Math.max(0, race.rivalNitroDelay - dt);
  }
}

function updateRivalNitro(dt) {
  race.rivalShiftTimer -= dt;
  if (race.rivalShiftTimer <= 0 && race.rivalNitroCharge < 4) {
    const cleanShiftChance = 0.42 + race.rivalNitroSkill * 0.5;
    if (Math.random() < cleanShiftChance) {
      race.rivalNitroCharge = Math.min(4, race.rivalNitroCharge + 1);
    }
    race.rivalShiftTimer = Math.max(0.62, 1.22 - race.rivalNitroSkill * 0.42 + Math.random() * 0.22);
  }
  if (race.rivalNitroUsed || race.rivalNitroCharge < 4 || race.rivalNitroActive || race.rivalNitroDelay > 0) return;
  const progress = race.rivalDistance / race.target;
  const behind = race.rivalDistance < race.playerDistance;
  const panicUse = behind && progress > 0.36 + (1 - race.rivalNitroSkill) * 0.25;
  const smartUse = progress > 0.58 - race.rivalNitroSkill * 0.18;
  const badUse = Math.random() < (0.004 + race.rivalNitroSkill * 0.002);
  if (panicUse || smartUse || badUse) {
    useRivalNitro();
  }
}

function useNitro() {
  if (!race?.active || race.finished || race.nitroCharge < 4 || race.nitroActive) return;
  race.nitroCharge = 0;
  race.nitroActive = true;
  race.nitroTimer = dragNitroDuration;
  race.playerSpeed = Math.min(race.playerSpeed * dragNitroMultiplier, race.playerMaxSpeed * dragNitroMultiplier);
  el.shiftReadout.textContent = "Nitro";
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

function useRivalNitro() {
  race.rivalNitroCharge = 0;
  race.rivalNitroActive = true;
  race.rivalNitroUsed = true;
  race.rivalNitroTimer = dragNitroDuration;
  race.rivalNitroDelay = 2.2 + (1 - race.rivalNitroSkill) * 1.2;
  race.rivalSpeed = Math.min(race.rivalSpeed * dragNitroMultiplier, race.rivalMaxSpeed * dragNitroMultiplier);
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
  race.nitroActive = false;
  race.rivalNitroActive = false;
  drawRace();
  const finishedRace = race;
  const isStoryRace = finishedRace.campaignLevelIndex !== null && finishedRace.campaignLevelIndex !== undefined;
  const finishedLevel = isStoryRace ? campaignLevels[finishedRace.campaignLevelIndex] : null;
  const pinkSlipCarId = finishedLevel?.type === "pink-slip" ? finishedLevel.pinkSlipCarId : null;
  let partReward = null;
  let pinkSlipPenaltyLine = "";
  const riskyPinkSlipLoss = !playerWon && isPinkSlipRiskActive(finishedLevel);

  let earned = 0;
  if (playerWon) {
    earned = Math.floor(race.distance.xp * race.rank.xpBonus * difficultyMultiplier());
    addSprox(earned);
    if (tutorialActive()) state.tutorialDragSprox = earned;
    const rankIndex = ranks.findIndex((rank) => rank.key === race.rank.key);
    if (rankIndex === state.highestRankIndex && state.highestRankIndex < ranks.length - 1) {
      state.highestRankIndex += 1;
    }
    el.raceMessage.className = "race-message win";
    el.raceMessage.textContent = "";
  } else {
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
  if (isStoryRace && playerWon) partReward = rollStoryPartReward();
  saveState();
  if (isStoryRace && playerWon) {
    completeCampaignLevel(finishedRace.campaignLevelIndex);
  }
  render();
  showRaceResult(el.dragTrack, {
    won: playerWon,
    title: tutorialActive() && !playerWon ? "RACE LOST" : undefined,
    sprox: earned,
    lines: [pinkSlipPenaltyLine, partReward ? partRewardResultMarkup(partReward) : ""].filter(Boolean),
    primaryLabel: tutorialActive() ? (playerWon ? "Next" : "Try Again") : isStoryRace ? "Next" : "Select Opponent",
    primaryTone: tutorialActive() && playerWon ? "success" : "",
    raceAgainLabel: "Race Again",
    hideRaceAgain: tutorialActive() && !playerWon,
    hideSprox: tutorialActive() && !playerWon,
    disableActions: tutorialActive() && playerWon,
    onPrimary: () => {
      if (tutorialActive() && !playerWon) {
        prepareDragRace(null, tutorialDragStage());
        startPendingDragRace();
        setTutorialScene("sprox");
        saveState();
        renderTutorial();
        return;
      }
      if (tutorialActive() && playerWon && currentTutorialScene().id === "sprox") {
        advanceTutorial();
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
      if (isStoryRace) {
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
  drawRace();
  const failedRace = race;
  const isStoryRace = failedRace.campaignLevelIndex !== null && failedRace.campaignLevelIndex !== undefined;
  const failedLevel = isStoryRace ? campaignLevels[failedRace.campaignLevelIndex] : null;
  let pinkSlipPenaltyLine = "";
  if (isPinkSlipRiskActive(failedLevel)) {
    applyPinkSlipLossPenalty(failedRace.carId);
    pinkSlipPenaltyLine = "You lost the Pink Slip race. Your GearBorn has been returned to Level 1 and its equipped parts were taken.";
  }
  recordStoryRaceOutcome(false, isStoryRace);
  saveState();
  el.raceMessage.className = "race-message loss";
  el.raceMessage.textContent = "";
  showRaceResult(el.dragTrack, {
    won: false,
    title: tutorialActive() ? "RACE LOST" : title,
    sprox: 0,
    primaryLabel: tutorialActive() ? "Try Again" : isStoryRace ? "Next" : "Select Opponent",
    raceAgainLabel: "Race Again",
    lines: pinkSlipPenaltyLine ? [pinkSlipPenaltyLine] : [],
    hideRaceAgain: tutorialActive(),
    hideSprox: tutorialActive(),
    onPrimary: () => {
      if (tutorialActive()) {
        prepareDragRace(null, tutorialDragStage());
        startPendingDragRace();
        setTutorialScene("sprox");
        saveState();
        renderTutorial();
        return;
      }
      if (isStoryRace) {
        finishStoryRaceScreen();
      } else {
        setFlowStep("drag", "match");
      }
    },
    onRaceAgain: () => {
      if (isStoryRace) {
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
  popup.className = `race-result-popup ${result.won ? "win" : "loss"}`;
  popup.innerHTML = `
    <div class="race-result-card">
      <h2>${result.title || (result.won ? "Victory" : "Defeat")}</h2>
      ${result.hideSprox ? "" : `<p>Sprox Earned: <strong>${sproxAmountMarkup(result.sprox ?? 0)}</strong></p>`}
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
    popup.remove();
    if (action === "again") {
      result.onRaceAgain?.();
      return;
    }
    result.onPrimary?.();
  });
  trackNode.appendChild(popup);
}

function finishStoryRaceScreen() {
  if (race) race.active = false;
  if (verticalRace) verticalRace.active = false;
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
  el.closeEvolution.textContent = "Later";
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
    onReveal?.();
  };
  evolutionAnimationActive = true;

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

  // Trigger onReveal callback at 8030ms (matches CSS flash timing)
  const revealTimer = window.setTimeout(revealOnce, 8030);

  // Wait for full 11s animation to complete
  await new Promise((resolve) => window.setTimeout(resolve, 11000));

  // Cleanup
  timers.forEach((t) => window.clearTimeout(t));
  window.clearTimeout(revealTimer);
  revealOnce();

  // Ensure evolved form is shown at the end
  el.evolutionAnimationCurrent.style.opacity = "0";
  el.evolutionAnimationNext.style.opacity = "1";

  el.evolutionAnimation.classList.remove("active", "run");
  el.evolutionAnimation.setAttribute("aria-hidden", "true");
  evolutionAnimationActive = false;
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
  popup.setAttribute("aria-hidden", "false");
  const handleForge = () => {
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
    onContinue?.();
    showView("garage");
    openForge();
  };
  const handleLater = () => {
    popup.classList.remove("active");
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
  "hornula1":           "assets/medallions/medallion-hornula1.png",
};

function forgeMedallionSrc(carId) {
  return forgeMedallionMap[carId] || "";
}

let forgeSelectedCarId = null;
let forgeAnimating = false;

function openForge() {
  forgeSelectedCarId = null;
  forgeAnimating = false;
  if (el.forgeInventoryPanel) el.forgeInventoryPanel.setAttribute("hidden", "");
  if (el.forgeUnlockBtn) { el.forgeUnlockBtn.disabled = true; el.forgeUnlockBtn.textContent = "Select a Medallion"; }
  if (el.forgeAnimationArea) { el.forgeAnimationArea.innerHTML = ""; el.forgeAnimationArea.classList.remove("animating"); }
  if (el.forgeSelectedMedallion) el.forgeSelectedMedallion.setAttribute("hidden", "");
  if (el.forgeSelectedName) el.forgeSelectedName.textContent = "Select a Medallion to unlock";
  // Show forge panel inside garage-view, hide garage content
  if (el.garageContent) el.garageContent.hidden = true;
  if (el.forgePanel) el.forgePanel.hidden = false;
  showView("garage");
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
  const owned = (state.medallionsOwned || []).filter((id) => !isCarUnlocked(id));
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
  el.forgeUnlockBtn.textContent = `Unlock ${form?.name || carId}`;
}

async function runForgeAnimation(carId) {
  if (forgeAnimating) return;
  forgeAnimating = true;
  el.forgeUnlockBtn.disabled = true;

  const overlay = document.getElementById("forge-fullscreen");
  const area    = document.getElementById("forge-fs-anim-area");
  const fsVat   = document.getElementById("forge-fs-vat");
  if (!overlay || !area) { forgeAnimating = false; return; }

  area.innerHTML = "";
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");

  area.innerHTML = `
    <img class="forge-anim-layer forge-anim-medallion" src="${forgeMedallionSrc(carId)}" alt="Medallion">
    <img class="forge-anim-layer forge-anim-glow"     src="assets/forge/forge_glow.png" alt="">
    <img class="forge-anim-layer forge-anim-smoke"    src="assets/forge/forge_smoke.png" alt="">
    <img class="forge-anim-layer forge-anim-platform" src="assets/forge/forge_platform.png" alt="">
    <div class="forge-anim-layer forge-anim-car-reveal">${carMarkupForEvolution(carId, 0, "display")}</div>
    <img class="forge-anim-layer forge-anim-cover"    src="assets/forge/forge_cover.png" alt="">
    <img class="forge-anim-layer forge-anim-magnet"   src="assets/forge/forge_magnet.png" alt="">
  `;

  const step = (ms) => new Promise((r) => setTimeout(r, ms));
  const get  = (cls) => area.querySelector("." + cls);

  const medallionEl = get("forge-anim-medallion");
  const platformEl  = get("forge-anim-platform");
  const coverEl     = get("forge-anim-cover");
  const magnetEl    = get("forge-anim-magnet");
  const carEl       = get("forge-anim-car-reveal");
  const glowEl      = get("forge-anim-glow");
  const smokeEl     = get("forge-anim-smoke");

  // ── Step 1: Medallion appears above the vat ──────────────────────────────
  await step(120);
  medallionEl.classList.add("step-appear");
  await step(750);

  // ── Step 2: Medallion drops into the vat ─────────────────────────────────
  medallionEl.classList.add("step-drop");
  await step(800);
  medallionEl.classList.add("step-gone");

  // ── Step 3: Vat shakes, smoke erupts (2.6s) ──────────────────────────────
  if (fsVat) fsVat.classList.add("forge-shake");
  smokeEl.classList.add("step-smoke");
  await step(2600);
  if (fsVat) fsVat.classList.remove("forge-shake");

  // ── Step 4: Platform + cover rise together from the lava ─────────────────
  // Platform and cover transition use the same duration so they move in lock-step
  platformEl.classList.add("step-rise");
  coverEl.classList.add("step-rise");
  await step(1100);  // let the 1.0s rise transition finish

  // ── Step 5: Magnet descends from top until it meets the cover ────────────
  magnetEl.classList.add("step-magnet-drop");
  await step(700);

  // ── Step 6: Magnet lifts — cover moves in perfect sync upward ────────────
  // Both use the same transition duration (0.7s) so they exit together
  coverEl.classList.add("step-lift");
  magnetEl.classList.add("step-magnet-lift");
  await step(750);
  coverEl.classList.add("step-gone");
  magnetEl.classList.add("step-gone");

  // ── Step 7: GearBorn revealed with glow halo ─────────────────────────────
  carEl.classList.add("step-reveal");
  glowEl.classList.add("step-glow");
  await step(2400);

  // ── Unlock and close overlay ──────────────────────────────────────────────
  unlockGearbornLine(carId);
  state.medallionsOwned = (state.medallionsOwned || []).filter((id) => id !== carId);
  saveState();
  render();

  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  area.innerHTML = "";
  forgeAnimating = false;
  showForgeUnlockedPopup(carId);
}

function showForgeUnlockedPopup(carId) {
  const car = cars.find((c) => c.id === carId);
  const form = car?.evolutions?.[0];
  const popup = el.forgeUnlockedPopup;
  if (!popup) return;
  popup.querySelector("#forge-unlocked-name").innerHTML =
    `<strong>${form?.name || carId}</strong> is now available in the <span class="forge-orange">GARAGE</span>.`;
  const imgEl = popup.querySelector("#forge-unlocked-img");
  imgEl.src = imageFor(form, "display");
  imgEl.alt = form?.name || carId;
  popup.classList.add("active");
  popup.setAttribute("aria-hidden", "false");
  popup.querySelector("#forge-unlocked-close").addEventListener("click", () => {
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
    closeForge();
    renderForgeInventory();
    forgeSelectedCarId = null;
    el.forgeUnlockBtn.disabled = true;
    el.forgeUnlockBtn.textContent = "Select a Medallion";
    if (el.forgeSelectedMedallion) el.forgeSelectedMedallion.setAttribute("hidden", "");
    if (el.forgeSelectedName) el.forgeSelectedName.textContent = "Select a Medallion to unlock";
    // If the tutorial is at the-forge scene, advance to unlocked
    if (tutorialActive() && currentTutorialScene()?.id === "the-forge") {
      state.tutorialAwaitingForge = false;
      setTutorialScene("unlocked");
      setupTutorialScene();
      saveState();
      renderTutorial();
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
  pendingPinkSlipContinue = null;
  evolutionModal = null;
  el.evolutionModal.classList.remove("evolution-unlocked");
  el.evolutionModal.classList.remove("active");
  el.evolutionModal.setAttribute("aria-hidden", "true");
  if (continueAfterPinkSlip) {
    continueAfterPinkSlip();
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
  el.cityUnlockIcon.innerHTML = city.icon ? `<img src="${city.icon}" alt="" aria-hidden="true">` : "";
  el.cityUnlockTitle.innerHTML = `<strong>${city.city}</strong> has been unlocked in <strong>CITY SELECT</strong>`;
  el.cityUnlockModal.classList.add("active");
  el.cityUnlockModal.setAttribute("aria-hidden", "false");
  el.cityUnlockClose.focus();
}

function closeCityUnlockModal() {
  if (!el.cityUnlockModal) return;
  el.cityUnlockModal.classList.remove("active");
  el.cityUnlockModal.setAttribute("aria-hidden", "true");
}

function renderTutorialSceneOptions() {
  el.tutorialSceneOptions.innerHTML = tutorialSceneSelectOptions.map((option) => `
    <button class="tutorial-replay-button" type="button" data-tutorial-scene="${option.scene}">${option.label}</button>
  `).join("");
  el.tutorialSceneOptions.hidden = false;
}

function activateGodMode() {
  if (el.godCode.value.trim() !== "Corey") {
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

function imageFor(entry, role) {
  if (!entry) return "";
  if (entry.images?.[role]) return entry.images[role];
  if (role === "topdown" && entry.images?.race) {
    return entry.images.race.replace("-race.", "-topdown.");
  }
  return entry.image || "";
}

function carNameKey(name = "") {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function displayScaleStyle(name, role = "display") {
  if (role !== "display") return "";
  const scale = displayImageScaleByName[carNameKey(name)] || 1;
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
  const maxTravel = Math.max(80, document.querySelector(".track").clientWidth - 170);
  const playerProgress = Math.min(1, race.playerDistance / race.target);
  const rivalProgress = Math.min(1, race.rivalDistance / race.target);
  el.playerRacer.style.transform = `translateX(${-playerProgress * maxTravel}px)`;
  el.rivalRacer.style.transform = `translateX(${-rivalProgress * maxTravel}px)`;
  el.playerRacer.classList.toggle("nitro-active", Boolean(race.nitroActive));
  el.rivalRacer.classList.toggle("nitro-active", Boolean(race.rivalNitroActive));
  el.mph.textContent = `${Math.round(race.playerSpeed)} MPH`;
  el.gear.textContent = race.gear;
  el.distance.textContent = `${Math.floor(Math.min(race.playerDistance, race.target))} m`;
  el.tachFill.style.width = `${Math.round(race.rpm * 100)}%`;

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
    return { type: tile.type || "grass", rotation: Number(tile.rotation) || 0 };
  }));
}

function builderTileDef(type) {
  return builderTileDefs.find((tile) => tile.id === type) || builderTileDefs[0];
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
    return `
      <button class="builder-cell" data-builder-x="${x}" data-builder-y="${y}" type="button"
        style="--tile-accent:${def.accent};"
        aria-label="${def.label} at ${x + 1}, ${y + 1}">
        <span class="builder-cell-tile" style="background-image:url('${def.asset}');transform:rotate(${rotation}deg);"></span>
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
    el.builderRotate.textContent = `Rotate ${builderState.rotation}°`;
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
  builderState.dirty = false;
  renderBuilder();
}

function markBuilderDirty() {
  builderState.dirty = true;
  if (el.builderDirtyState) el.builderDirtyState.textContent = "Unsaved changes";
}

function placeBuilderTile(x, y) {
  if (!builderState.grid[y]?.[x]) return;
  builderState.grid[y][x] = { type: builderState.selectedTile, rotation: builderState.rotation };
  markBuilderDirty();
  renderBuilderGrid();
}

function rotateBuilderTile() {
  builderState.rotation = (builderState.rotation + 90) % 360;
  renderBuilderPalette();
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
  if (view !== "story" || embeddedCampaignView) restoreEmbeddedCampaignRace();
  el.views.forEach((panel) => panel.classList.toggle("active", panel.id === `${view}-view`));
  if (view === "story" && embeddedCampaignView) embeddedCampaignView.node.classList.add("active");
  document.querySelectorAll(".nav-button").forEach((nav) => nav.classList.toggle("active", nav.dataset.view === view));
  document.body.classList.toggle("mode-active", view !== "menu");
  if (view === "story") {
    storyReplayOpen = false;
    modeFlow.story = state.storyCarChosen ? "next" : "car";
    state.selectedStoryCity = Math.max(0, Math.min(state.selectedStoryCity || 0, highestUnlockedStoryCityIndex()));
    state.selectedCampaign = firstPlayableStoryLevelForCity(state.selectedStoryCity)?.campaignIndex ?? state.selectedCampaign;
    saveState();
    render();
    ensureTunerAndIntro(view);
  }
  if (view === "solo") {
    ensureTunerAndIntro(view);
  }
  if (view === "play") setFlowStep("drag", "car");
  if (view === "time-trial") setFlowStep("time", "car");
  if (view === "boss") setFlowStep("boss", "car");
  if (view === "battle") setFlowStep("battle", "car");
  if (view === "beta") openBetaIntro();
  if (view === "builder" && builderState.mode === "menu") renderBuilder();
  if (!["story", "play", "time-trial", "boss", "battle", "beta"].includes(view)) render();
}

function storyTunerReady() {
  return Boolean(state.tunerChosen && state.selectedTuner && state.tunerChoiceVersion >= tunerChoiceVersion);
}

function currentTutorialScene() {
  return tutorialScenes[state.tutorialScene] || tutorialScenes[0];
}

function selectedTuner() {
  return tuners.find((item) => item.id === state.selectedTuner) || tuners[0];
}

function selectedTunerShortName() {
  return selectedTuner().name.split(" ")[0];
}

function tutorialActive() {
  return Boolean(state.tutorialActive);
}

function startTutorial(sceneId = "intro") {
  const sceneIndex = Math.max(0, tutorialScenes.findIndex((scene) => scene.id === sceneId));
  if (!storyTunerReady()) {
    pendingIntroView = `tutorial:${sceneId}`;
    openTunerModal();
    return;
  }
  state.tutorialActive = true;
  state.tutorialComplete = false;
  state.tutorialScene = sceneIndex;
  state.tutorialLine = 0;
  state.tutorialAwaitingUpgrade = false;
  state.tutorialAwaitingEvolve = false;
  state.tutorialAwaitingForge = false;
  state.tutorialStartingSprox = state.unlimitedSprox ? 0 : Math.max(0, Math.floor(state.sprox || 0));
  if (sceneId === "intro") {
    state.sprox = 0;
    state.tutorialDragSprox = 0;
    state.tutorialTimeMedal = "";
  }
  setupTutorialScene();
  saveState();
  render();
}

function finishTutorial() {
  if (!state.unlimitedSprox) state.sprox = Math.max(0, Math.floor(state.tutorialStartingSprox || 0));
  state.tutorialActive = false;
  state.tutorialComplete = true;
  state.tutorialScene = 0;
  state.tutorialLine = 0;
  state.tutorialAwaitingUpgrade = false;
  state.tutorialAwaitingEvolve = false;
  state.tutorialAwaitingForge = false;
  state.tutorialStartingSprox = 0;
  state.tutorialTimeMedal = "";
  state.selectedCar = defaultUnlockedLines.includes(state.selectedCar) ? state.selectedCar : defaultUnlockedLines[0];
  state.selectedStoryCar = defaultUnlockedLines.includes(state.selectedStoryCar) ? state.selectedStoryCar : state.selectedCar;
  state.selectedTimeCar = defaultUnlockedLines.includes(state.selectedTimeCar) ? state.selectedTimeCar : state.selectedCar;
  state.selectedRank = ranks[0].key;
  state.selectedTimeTrack = storyTracks[0].id;
  closeUpgradeModal();
  closeEvolutionModal();
  restoreEmbeddedCampaignRace();
  saveState();
  showView("menu");
  render();
}

function skipTutorial() {
  finishTutorial();
}

function setupTutorialScene() {
  const scene = currentTutorialScene();
  if (!scene) return;

  // Set up car state first
  if (scene.id === "upgrade") {
    ensureTutorialCarState({ level: 9 });
  } else if (scene.id === "evolved-form") {
    ensureTutorialCarState({ level: 10 });
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

    case "mamburn":
      // Tutorial-exclusive car select: only Mamburn selectable
      state.selectedCar = tutorialCarId;
      setFlowStep("drag", "car");
      render();
      break;

    case "city-map":
    case "drag2tt":
    case "tt2battle":
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

    case "time-trial-intro":
      showTutorialTimeTrialPreview();
      break;

    case "time-trial":
      state.selectedTimeCar = tutorialCarId;
      state.selectedTimeTrack = tutorialTrack.id;
      setFlowStep("time", "match");
      render();
      break;

    case "battle-intro":
      showTutorialBattlePreview();
      break;

    case "battle":
      state.selectedStoryCar = tutorialCarId;
      state.selectedBattleBoss = bosses[0].id;
      battleState = null;
      setFlowStep("battle", "match");
      render();
      break;

    case "pre-battle":
      if (!battleState || battleState.finished || battleState.mode !== "tutorial-battle") {
        beginBattle("tutorial-battle", { tutorial: true, boss: bosses[0] });
      }
      break;

    case "garage":
    case "unlocked":
    case "starters":
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
      // Award the three starter medallions and open The Forge
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
  if (options.sprox && !state.unlimitedSprox) {
    state.sprox = Math.max(state.sprox || 0, options.sprox);
  }
  state.selectedCar = tutorialCarId;
  state.selectedStoryCar = tutorialCarId;
  state.selectedTimeCar = tutorialCarId;
}

function showTutorialCityMap() {
  // Show the tutorial story city using the training track/icon
  showView("story");
  // Render a minimal city map overlay pointing at Spindell Training Academy
  render();
}

function showTutorialDragPreview() {
  // Show drag race level preview (story view with the drag level highlighted)
  showView("story");
  setFlowStep("story", "match");
  render();
}

function showTutorialTimeTrialPreview() {
  showView("time-trial");
  setFlowStep("time", "match");
  state.selectedTimeCar = tutorialCarId;
  state.selectedTimeTrack = tutorialTrack.id;
  render();
}

function showTutorialBattlePreview() {
  showView("battle");
  setFlowStep("battle", "match");
  state.selectedStoryCar = tutorialCarId;
  state.selectedBattleBoss = bosses[0].id;
  battleState = null;
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
  return tutorialDialogue[scene.id] || [["tyree", scene.copy || "Tutorial placeholder."]];
}

function normalizeTutorialLine(line) {
  const speaker = Array.isArray(line) ? line[0] : "tyree";
  const content = Array.isArray(line) ? line[1] : line;
  return { speaker, text: typeof content === "function" ? content() : content };
}

function tutorialSpeakerProfile(speaker) {
  if (speaker === "user") {
    const tuner = selectedTuner();
    return { ...tuner, image: tuner.headshot || tuner.image };
  }
  if (speaker === "key") return { name: "GearBorn Key", image: gearbornKeyImage };
  if (speaker === "tutorque") return { name: "Tutorque", image: "assets/cars/tutorque-display.png" };
  return { name: "Dr. Tyree", image: "assets/characters/headshot-dr-tyree.png" };
}

function setTutorialScene(sceneId) {
  state.tutorialScene = Math.max(0, tutorialScenes.findIndex((scene) => scene.id === sceneId));
  state.tutorialLine = 0;
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

function advanceTutorial() {
  const scene = currentTutorialScene();
  const lines = tutorialLinesForScene(scene);

  // ── Already waiting for user to act — ignore button presses ──────────────
  if (state.tutorialAwaitingForge) return;

  // ── Awaiting user actions (upgrade click, evolve click) ──────────────────
  if (scene.id === "evolve" && state.tutorialLine === tutorialEvolvePromptIndex()) {
    state.tutorialAwaitingEvolve = true;
    saveState();
    renderTutorial();
    return;
  }

  // ── Advance within current scene's dialogue ───────────────────────────────
  if (state.tutorialLine < lines.length - 1) {
    state.tutorialLine += 1;
    // Tyree fronts Sprox on line 2 of upgrade scene
    if (scene.id === "upgrade" && state.tutorialLine >= 2 && !state.unlimitedSprox) {
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
      // Move to tutorial car select (Mamburn only)
      state.tutorialScene = tutorialScenes.findIndex((s) => s.id === "mamburn");
      ensureTutorialCarState();
      setFlowStep("drag", "car");
      saveState();
      render();
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
      // Auto-click start → move to drag race
      state.tutorialScene = tutorialScenes.findIndex((s) => s.id === "drag-race");
      prepareDragRace(null, tutorialDragStage());
      setTutorialScene("drag-race");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "drag-race":
      // Continue → prepare the race (show controls scene)
      prepareDragRace(null, tutorialDragStage());
      setTutorialScene("dr-controls");
      saveState();
      renderTutorial();
      break;

    case "dr-controls":
      // Continue → start the actual countdown
      startPendingDragRace();
      setTutorialScene("sprox");
      saveState();
      renderTutorial();
      break;

    case "sprox":
      // Drag race win → transition scene back to city map
      setTutorialScene("drag2tt");
      showTutorialCityMap();
      saveState();
      renderTutorial();
      break;

    case "drag2tt":
      // Auto-click time trial → show time-trial-intro level preview
      setTutorialScene("time-trial-intro");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "time-trial-intro":
      // Auto-click start → move to time trial
      setTutorialScene("time-trial");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "time-trial":
      // Continue → start the time trial
      modeFlow.time = "race";
      renderFlowScreens();
      beginVerticalRace("tutorial-time", true, { track: tutorialTrack });
      setTutorialScene("tt-controls");
      saveState();
      renderTutorial();
      break;

    case "tt-controls":
      // Continue → start the countdown
      modeFlow.time = "race";
      renderFlowScreens();
      if (!verticalRace || verticalRace.finished || verticalRace.mode !== "tutorial-time") {
        beginVerticalRace("tutorial-time", true, { track: tutorialTrack });
      }
      startVerticalCountdown();
      setTutorialScene("tt-after");
      saveState();
      renderTutorial();
      break;

    case "tt-after":
      // Time trial win → back to city map
      setTutorialScene("tt2battle");
      showTutorialCityMap();
      saveState();
      renderTutorial();
      break;

    case "tt2battle":
      // Auto-click battle → show battle-intro level preview
      setTutorialScene("battle-intro");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "battle-intro":
      // Auto-click start → move to battle
      state.selectedStoryCar = tutorialCarId;
      state.selectedBattleBoss = bosses[0].id;
      setTutorialScene("battle");
      setupTutorialScene();
      saveState();
      renderTutorial();
      break;

    case "battle":
      // Continue → set up and start battle
      state.selectedStoryCar = tutorialCarId;
      state.selectedBattleBoss = bosses[0].id;
      setTutorialScene("pre-battle");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "pre-battle":
      // Continue → actually start battle
      if (!battleState || battleState.finished || battleState.mode !== "tutorial-battle") {
        beginBattle("tutorial-battle", { tutorial: true, boss: bosses[0] });
      }
      setTutorialScene("post-battle");
      saveState();
      renderTutorial();
      break;

    case "post-battle":
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
      // Await user clicking Evolve button (handled above via tutorialEvolvePromptIndex)
      state.tutorialAwaitingEvolve = true;
      saveState();
      renderTutorial();
      break;

    case "evolved-form":
      // After evolution → go to VINdex
      setTutorialScene("vindex");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "vindex":
      // VINdex done → go to Achievements
      setTutorialScene("achievements");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "achievements":
      // Achievements done → go to The Forge
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

    case "unlocked":
      // Post-unlock → go to starters/end
      setTutorialScene("starters");
      setupTutorialScene();
      saveState();
      render();
      break;

    case "starters":
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
  if (!active) return;
  const scene = currentTutorialScene();
  const countdownRunning = el.dragCountdown.classList.contains("active")
    || el.storyCountdown.classList.contains("active")
    || el.timeCountdown.classList.contains("active");
  if (scene.id === "upgrade" && state.tutorialAwaitingUpgrade) {
    el.tutorialOverlay.classList.remove("active");
    return;
  }
  if ((scene.id === "evolve" && state.tutorialAwaitingEvolve) || scene.id === "evolved-form") {
    // Hide tutorial overlay while evolution modal is prominent
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
    (battleState && !battleState.finished)
  );
  el.tutorialOverlay.classList.toggle("active", !waitingOnRace);
  if (waitingOnRace) return;
  const lines = tutorialLinesForScene(scene);
  state.tutorialLine = Math.max(0, Math.min(state.tutorialLine || 0, lines.length - 1));
  const line = normalizeTutorialLine(lines[state.tutorialLine]);
  const speaker = tutorialSpeakerProfile(line.speaker);
  el.tutorialKicker.textContent = "";
  el.tutorialTitle.textContent = speaker.name;
  el.tutorialCopy.innerHTML = line.text;
  el.tutorialPortrait.innerHTML = characterMarkup(speaker);
  el.tutorialBack.hidden = state.tutorialScene === 0 && state.tutorialLine === 0;
  const tutorialLineIsLast = state.tutorialLine === lines.length - 1;
  el.tutorialNext.textContent = tutorialLineIsLast ? "Continue" : "Next";
  el.tutorialNext.classList.toggle("finish", tutorialLineIsLast);
  el.tutorialCard.dataset.scene = scene.id;
  el.tutorialCard.dataset.speaker = line.speaker;
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
  if (level.type === "drag" || level.type === "pink-slip") {
    mountCampaignRace("play");
    state.selectedCar = state.selectedStoryCar;
    state.selectedDistance = level.type === "pink-slip" ? level.drag.distance : index === 0 ? 400 : 800;
    saveState();
    render();
    prepareDragRace(index, level.drag);
    return;
  }
  if (level.type === "trial") {
    mountCampaignRace("time-trial");
    state.selectedTimeCar = state.selectedStoryCar;
    state.selectedTimeTrack = level.track.id;
    saveState();
    render();
    modeFlow.time = "race";
    renderFlowScreens();
    beginVerticalRace("campaign-time", true, { campaignLevelIndex: index, track: level.track });
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
  const boss = level.final ? finalBoss : bosses[level.bossIndex];
  mountCampaignRace("boss");
  state.selectedBoss = boss.id;
  saveState();
  render();
  modeFlow.boss = "race";
  renderFlowScreens();
  beginVerticalRace("campaign-boss", true, { campaignLevelIndex: index, boss });
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
  const boss = rivalBossData(level);
  mountCampaignRace("boss");
  saveState();
  render();
  modeFlow.boss = "race";
  renderFlowScreens();
  beginVerticalRace("campaign-rival", true, { campaignLevelIndex: index, boss });
}

function openRivalDialogue(level, phase, onContinue) {
  const rival = rivalTuner();
  const pre = rival.id === "cha-cha"
    ? "Cha Cha pulls up beside you. ‘Let’s see if you can keep up.’"
    : "Mylo grins from the starting line. ‘Guess we’re doing this.’";
  const post = rival.id === "cha-cha"
    ? "Cha Cha folds her arms, trying not to look impressed. ‘Don’t get used to it.’"
    : "Mylo laughs, breathless. ‘Okay… that was actually awesome.’";
  const modal = document.createElement("div");
  modal.className = "rival-dialog";
  modal.innerHTML = `
    <div class="rival-dialog-card">
      <button class="modal-close" type="button" aria-label="Close rival scene">×</button>
      <div class="selection-preview-art">${characterMarkup({ name: rival.name, image: rival.headshot || rival.image })}</div>
      <h2>${rival.name}</h2>
      <p>${phase === "post" ? post : pre}</p>
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
  if (ghostNode) setTopCar(ghostNode, "assets/story/phantaxi-topdown.png", "Phantaxi", "#c084fc");

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
  saveState();
  render();
  showRaceResult(raceState.trackNode, {
    won: resultWon,
    title: tutorialActive() && !resultWon ? "RACE LOST" : undefined,
    sprox: resultSprox,
    lines: tutorialActive() && !resultWon ? [] : resultLines,
    primaryLabel: tutorialActive() ? (resultWon ? "Next" : "Try Again") : isStoryRace ? "Next" : raceState.mode === "time" ? "Select Map" : "Select Opponent",
    primaryTone: tutorialActive() && resultWon ? "success" : "",
    raceAgainLabel: "Race Again",
    hideRaceAgain: tutorialActive() && !resultWon,
    hideSprox: tutorialActive() && !resultWon,
    disableActions: tutorialActive() && resultWon,
    onPrimary: () => {
      if (tutorialActive() && !resultWon) {
        beginVerticalRace("tutorial-time", true, { track: tutorialTrack });
        startVerticalCountdown();
        setTutorialScene("tt-after");
        saveState();
        renderTutorial();
        return;
      }
      if (tutorialActive() && resultWon && currentTutorialScene().id === "tt-after") {
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
  showRaceResult(raceState.trackNode, {
    won: false,
    title: tutorialActive() ? "RACE LOST" : title,
    sprox: 0,
    primaryLabel: tutorialActive() ? "Try Again" : isStoryRace ? "Next" : raceState.mode === "time" ? "Select Map" : "Select Opponent",
    raceAgainLabel: "Race Again",
    hideRaceAgain: tutorialActive(),
    hideSprox: tutorialActive(),
    onPrimary: () => {
      if (tutorialActive()) {
        beginVerticalRace("tutorial-time", true, { track: tutorialTrack });
        startVerticalCountdown();
        setTutorialScene("tt-after");
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
    showView(button.dataset.view);
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

// Beta car select screen
el.betaCarSelectConfirm?.addEventListener("click", () => {
  // Confirmed car → proceed to track select
  openBetaTrackSelect(betaPendingMode || "time");
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
el.startCampaign.addEventListener("click", startCampaignLevel);
el.changeStoryCar.addEventListener("click", () => setFlowStep("story", "car"));
el.storyCitySelect.addEventListener("click", openCitySelect);
el.closeStoryPreview.addEventListener("click", closeStoryPreview);
el.closeCitySelect.addEventListener("click", closeCitySelect);
el.storyMapStage.addEventListener("click", (event) => {
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
    setTutorialScene("pre-battle");
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
  modeFlow.time = "race";
  renderFlowScreens();
  if (tutorialActive() && currentTutorialScene().id === "time-trial") {
    beginVerticalRace("tutorial-time", true, { track: tutorialTrack });
    setTutorialScene("tt-controls");
    saveState();
    renderTutorial();
    return;
  }
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
      // Advance to evolved-form scene so player sees Snaytan before we continue
      setTutorialScene("evolved-form");
      state.tutorialLine = 0;
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
el.builderRotate?.addEventListener("click", rotateBuilderTile);
el.builderClear?.addEventListener("click", clearBuilderGrid);
el.builderSave?.addEventListener("click", beginBuilderSave);
el.builderPalette?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-builder-tile]");
  if (!button) return;
  builderState.selectedTile = button.dataset.builderTile;
  renderBuilderPalette();
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
  state.tutorialActive = false;
  state.tutorialComplete = true;
  saveState();
  render();
});
el.cityUnlockClose.addEventListener("click", closeCityUnlockModal);
el.confirmPinkSlipRisk?.addEventListener("click", confirmPinkSlipRisk);
el.cancelPinkSlipRisk?.addEventListener("click", closePinkSlipWarning);
el.tutorialBack.addEventListener("click", rewindTutorial);
el.tutorialNext.addEventListener("click", advanceTutorial);
el.tutorialSkip.addEventListener("click", skipTutorial);
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

el.tutorialFirstModal.addEventListener("click", (event) => {
  if (event.target === el.tutorialFirstModal) {
    closeFirstTutorialModal();
    state.tutorialActive = false;
    state.tutorialComplete = true;
    saveState();
    render();
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
    state.tutorialActive = false;
    state.tutorialComplete = true;
    saveState();
    render();
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
let betaSelectedTrackId = betaTracks[0].id;
let betaTrack = betaTracks[0];

let betaState = null;
let betaCarImage = null;
const betaKeys = {};

function betaTileAt(x, y) {
  const tx = Math.floor(x / betaTileSize);
  const ty = Math.floor(y / betaTileSize);
  return betaTrack.grid[ty]?.[tx] || { type: "wall_straight" };
}

function betaTileClass(tile) {
  if (!tile) return "wall";
  if (tile.type.startsWith("wall")) return "wall";
  if (tile.type === "grass") return "grass";
  return "road";
}

function betaRoadMaskContains(tile, localX, localY) {
  if (!tile || betaTileClass(tile) !== "road") return false;
  const band = 0.28;
  if (tile.type === "road_straight") {
    return tile.rotation === 90 || tile.rotation === 270
      ? Math.abs(localX - 0.5) <= band
      : Math.abs(localY - 0.5) <= band;
  }
  if (tile.type !== "road_turn") return true;
  const rotations = {
    0: ["E", "S"],
    90: ["S", "W"],
    180: ["N", "W"],
    270: ["N", "E"]
  };
  const dirs = rotations[((tile.rotation || 0) + 360) % 360] || rotations[0];
  const horizontal = dirs.includes("E")
    ? localX >= 0.42 && Math.abs(localY - 0.5) <= 0.34
    : localX <= 0.58 && Math.abs(localY - 0.5) <= 0.34;
  const vertical = dirs.includes("S")
    ? localY >= 0.42 && Math.abs(localX - 0.5) <= 0.34
    : localY <= 0.58 && Math.abs(localX - 0.5) <= 0.34;
  const cornerCenters = { "E,S": [0.5, 0.5], "S,W": [0.5, 0.5], "N,W": [0.5, 0.5], "N,E": [0.5, 0.5] };
  const center = cornerCenters[dirs.join(",")] || [0.5, 0.5];
  const radius = Math.hypot(localX - center[0], localY - center[1]);
  return horizontal || vertical || radius <= 0.48;
}

function betaSurfaceAt(x, y) {
  const tile = betaTileAt(x, y);
  const baseClass = betaTileClass(tile);
  if (baseClass !== "road") return baseClass;
  const tx = Math.floor(x / betaTileSize);
  const ty = Math.floor(y / betaTileSize);
  const localX = (x - tx * betaTileSize) / betaTileSize;
  const localY = (y - ty * betaTileSize) / betaTileSize;
  return betaRoadMaskContains(tile, localX, localY) ? "road" : "grass";
}

function betaCurrentCarId() {
  return isCarUnlocked(state.selectedCar) ? state.selectedCar : state.selectedStoryCar || cars[0].id;
}

function betaResizeCanvas() {
  if (!el.betaCanvas) return;
  const ratio = window.devicePixelRatio || 1;
  const rect = el.betaCanvas.getBoundingClientRect();
  el.betaCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
  el.betaCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const miniRect = el.betaMinimap.getBoundingClientRect();
  el.betaMinimap.width = Math.max(1, Math.floor(miniRect.width * ratio));
  el.betaMinimap.height = Math.max(1, Math.floor(miniRect.height * ratio));
}

function openBetaIntro() {
  if (!el.betaIntro || !el.betaRace) return;
  el.betaIntro.hidden = false;
  el.betaRace.hidden = true;
  stopBetaDemo(false);
}

function startBetaDemo() {
  if (!el.betaCanvas) return;
  betaResizeCanvas();
  const carId = betaCurrentCarId();
  const stats = carStats(carId);
  const startX = (betaTrack.startTile.x + 0.5) * betaTileSize;
  const startY = (betaTrack.startTile.y + 0.5) * betaTileSize;
  betaCarImage = new Image();
  betaCarImage.src = topDownImageForCar(carId) || imageFor(currentEvolution(carId), "display");
  betaState = {
    carId,
    stats,
    x: startX,
    y: startY,
    prevX: startX,
    prevY: startY,
    angle: betaTrack.startAngle,
    speed: 0,
    active: false,
    finished: false,
    debug: false,
    lap: 1,
    checkpoint: 0,
    wasOnStart: true,
    startTime: 0,
    elapsed: 0,
    last: performance.now(),
    raf: null
  };
  showBetaScreen(null); // hide all beta screens
  el.betaRace.hidden = false;
  el.betaResults.hidden = true;
  el.betaDebug.textContent = "Debug: Off";
  drawBetaFrame();
  runCountdown(el.betaCountdown, () => {
    if (!betaState || betaState.finished) return;
    betaState.active = true;
    betaState.startTime = performance.now();
    betaState.last = betaState.startTime;
    betaState.raf = requestAnimationFrame(updateBetaRace);
  });
}

function stopBetaDemo(showIntro = true) {
  betaLoadToken += 1;
  if (betaState?.raf) cancelAnimationFrame(betaState.raf);
  betaState = null;
  Object.keys(betaKeys).forEach((key) => delete betaKeys[key]);
  setBetaLoading(false);
  if (el.betaCountdown) {
    el.betaCountdown.classList.remove("active");
    el.betaCountdown.textContent = "";
  }
  if (showIntro && el.betaIntro && el.betaRace) {
    el.betaIntro.hidden = false;
    el.betaRace.hidden = true;
  }
}

function betaInput(direction) {
  return Boolean(betaKeys[direction]);
}

function updateBetaRace(now) {
  if (!betaState || betaState.finished) return;
  const dt = Math.min(0.035, (now - betaState.last) / 1000);
  betaState.last = now;
  const s = betaState.stats;
  const currentClass = betaTileClass(betaTileAt(betaState.x, betaState.y));
  const grassFactor = currentClass === "grass" ? Math.min(0.48, 0.28 + (s.torque || 70) / 520) : 1;
  const maxSpeed = (320 + (s.speed || 70) * 3.5 + (s.powertrain || 70) * 0.45) * grassFactor;
  const accel = (280 + (s.acceleration || 70) * 5) * (currentClass === "grass" ? 0.32 + (s.torque || 70) / 480 : 1);
  const brake = 520 + (s.torque || 70) * 2;
  const turnRate = (1.9 + (s.handling || 70) / 36) * Math.min(1, Math.max(0.25, Math.abs(betaState.speed) / 190));
  if (betaInput("up")) betaState.speed += accel * dt;
  if (betaInput("down")) betaState.speed -= brake * dt;
  if (!betaInput("up") && !betaInput("down")) betaState.speed *= Math.max(0, 1 - (1.35 - (s.torque || 70) / 180) * dt);
  betaState.speed = Math.max(-maxSpeed * 0.34, Math.min(maxSpeed, betaState.speed));
  if (betaInput("left")) betaState.angle -= turnRate * dt * (betaState.speed >= 0 ? 1 : -1);
  if (betaInput("right")) betaState.angle += turnRate * dt * (betaState.speed >= 0 ? 1 : -1);
  betaState.prevX = betaState.x;
  betaState.prevY = betaState.y;
  betaState.x += Math.cos(betaState.angle) * betaState.speed * dt;
  betaState.y += Math.sin(betaState.angle) * betaState.speed * dt;
  const nextClass = betaTileClass(betaTileAt(betaState.x, betaState.y));
  if (nextClass === "wall") {
    betaState.x = betaState.prevX;
    betaState.y = betaState.prevY;
    betaState.speed *= -(0.08 + Math.max(0, 100 - (s.body || 70)) * 0.002);
  }
  updateBetaCheckpoints();
  betaState.elapsed = betaState.active ? (now - betaState.startTime) / 1000 : 0;
  drawBetaFrame();
  betaState.raf = requestAnimationFrame(updateBetaRace);
}

function updateBetaCheckpoints() {
  const tx = Math.floor(betaState.x / betaTileSize);
  const ty = Math.floor(betaState.y / betaTileSize);
  const next = betaTrack.checkpoints[betaState.checkpoint];
  if (next && tx === next.x && ty === next.y) {
    betaState.checkpoint += 1;
  }
  const onStart = tx === betaTrack.startTile.x && ty === betaTrack.startTile.y;
  if (onStart && !betaState.wasOnStart && betaState.checkpoint >= betaTrack.checkpoints.length) {
    if (betaState.lap >= betaLapsRequired) {
      finishBetaDemo();
    } else {
      betaState.lap += 1;
      betaState.checkpoint = 0;
    }
  }
  betaState.wasOnStart = onStart;
}

function finishBetaDemo() {
  if (!betaState) return;
  betaState.finished = true;
  betaState.active = false;
  if (betaState.raf) cancelAnimationFrame(betaState.raf);
  el.betaFinalTime.textContent = `Final time: ${betaState.elapsed.toFixed(2)} s`;
  el.betaResults.hidden = false;
  drawBetaFrame();
}

function betaTileImage(tile) {
  if (tile.type === "road_straight") return betaTileImages[tile.rotation === 90 || tile.rotation === 270 ? "road_straight_v" : "road_straight_h"];
  return betaTileImages[tile.type];
}

function drawBetaTile(ctx, tile, x, y) {
  const img = betaTileImage(tile);
  if (img?.complete && img.naturalWidth) {
    ctx.save();
    ctx.translate(x + betaTileSize / 2, y + betaTileSize / 2);
    const drawRotation = tile.type === "road_straight" ? 0 : (tile.rotation || 0);
    ctx.rotate(drawRotation * Math.PI / 180);
    ctx.drawImage(img, -betaTileSize / 2, -betaTileSize / 2, betaTileSize, betaTileSize);
    ctx.restore();
    return;
  }
  const tileClass = betaTileClass(tile);
  ctx.fillStyle = tileClass === "road" ? "#4d535d" : tileClass === "wall" ? "#20242b" : "#245d38";
  ctx.fillRect(x, y, betaTileSize, betaTileSize);
  if (tileClass === "road") {
    ctx.strokeStyle = "rgba(255,255,255,.18)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    if (tile.type === "road_straight" && (tile.rotation === 90 || tile.rotation === 270)) {
      ctx.moveTo(x + betaTileSize / 2, y);
      ctx.lineTo(x + betaTileSize / 2, y + betaTileSize);
    } else {
      ctx.moveTo(x, y + betaTileSize / 2);
      ctx.lineTo(x + betaTileSize, y + betaTileSize / 2);
    }
    ctx.stroke();
  }
}

function drawBetaFrame() {
  if (!betaState || !el.betaCanvas) return;
  betaResizeCanvas();
  const ctx = el.betaCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaCanvas.width / ratio;
  const h = el.betaCanvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const worldW = betaTrack.width * betaTileSize;
  const worldH = betaTrack.height * betaTileSize;
  const camX = Math.max(0, Math.min(worldW - w, betaState.x - w / 2));
  const camY = Math.max(0, Math.min(worldH - h, betaState.y - h / 2));
  const startCol = Math.max(0, Math.floor(camX / betaTileSize) - 1);
  const endCol = Math.min(betaTrack.width - 1, Math.ceil((camX + w) / betaTileSize) + 1);
  const startRow = Math.max(0, Math.floor(camY / betaTileSize) - 1);
  const endRow = Math.min(betaTrack.height - 1, Math.ceil((camY + h) / betaTileSize) + 1);
  ctx.save();
  ctx.translate(-camX, -camY);
  for (let y = startRow; y <= endRow; y += 1) {
    for (let x = startCol; x <= endCol; x += 1) {
      drawBetaTile(ctx, betaTrack.grid[y][x], x * betaTileSize, y * betaTileSize);
    }
  }
  drawBetaMarkersSimple(ctx);
}

function drawBetaMarkersSimple(ctx) {
  const ts = betaTileSize;
  const sx = betaTrack.startTile.x * ts;
  const sy = betaTrack.startTile.y * ts;
  const startTile = betaTrack.grid[betaTrack.startTile.y]?.[betaTrack.startTile.x];
  const startIsHoriz = betaTileIsHorizontal(startTile);
  const sfImg = betaTrackImages.startFinish;
  if (sfImg?.complete && sfImg.naturalWidth) {
    ctx.save();
    ctx.translate(sx + ts / 2, sy + ts / 2);
    if (startIsHoriz) ctx.rotate(Math.PI / 2);
    ctx.drawImage(sfImg, -ts / 2, -ts * 0.275, ts, ts * 0.55);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,.9)";
    for (let i = 0; i < 8; i += 1) ctx.fillRect(sx + i * 32, sy + 92, 16, 72);
  }
  betaTrack.checkpoints.forEach((cp, index) => {
    const passed = index < (betaState?.checkpoint || 0);
    const img = passed ? betaTrackImages.checkpointActive : betaTrackImages.checkpointNeutral;
    const cpTile = betaTrack.grid[cp.y]?.[cp.x];
    const cpIsHoriz = betaTileIsHorizontal(cpTile);
    const cx = cp.x * ts;
    const cy = cp.y * ts;
    if (img?.complete && img.naturalWidth) {
      ctx.save();
      ctx.translate(cx + ts / 2, cy + ts / 2);
      if (cpIsHoriz) ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -ts / 2, -ts * 0.275, ts, ts * 0.55);
      ctx.restore();
    } else {
      ctx.strokeStyle = passed ? "rgba(255,200,87,.86)" : "rgba(82,199,255,.56)";
      ctx.lineWidth = 6;
      ctx.strokeRect(cx + 36, cy + 36, ts - 72, ts - 72);
    }
  });
}

function drawBetaCar(ctx) {
  ctx.save();
  ctx.translate(betaState.x, betaState.y);
  ctx.rotate(betaState.angle + Math.PI / 2);
  if (betaCarImage?.complete && betaCarImage.naturalWidth) {
    ctx.drawImage(betaCarImage, -34, -48, 68, 96);
  } else {
    ctx.fillStyle = cars.find((car) => car.id === betaState.carId)?.color || "#ffc857";
    ctx.fillRect(-18, -34, 36, 68);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-12, -16, 24, 18);
  }
  ctx.restore();
}

function drawBetaDebug(ctx) {
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = 2;
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.72)";
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    ctx.strokeRect(x * betaTileSize, y * betaTileSize, betaTileSize, betaTileSize);
    ctx.fillText(betaTileClass(tile), x * betaTileSize + 12, y * betaTileSize + 26);
  }));
  ctx.strokeStyle = "#ff5f5f";
  ctx.beginPath();
  ctx.arc(betaState.x, betaState.y, 32, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBetaMiniMap() {
  if (!el.betaMinimap || !betaState) return;
  const ctx = el.betaMinimap.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaMinimap.width / ratio;
  const h = el.betaMinimap.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / betaTrack.width, h / betaTrack.height);
  const offsetX = (w - betaTrack.width * scale) / 2;
  const offsetY = (h - betaTrack.height * scale) / 2;
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    const cls = betaTileClass(tile);
    if (cls === "grass") return;
    ctx.fillStyle = cls === "wall" ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.88)";
    ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
  }));
  ctx.fillStyle = "#ffc857";
  ctx.beginPath();
  ctx.arc(offsetX + betaState.x / betaTileSize * scale, offsetY + betaState.y / betaTileSize * scale, 4, 0, Math.PI * 2);
  ctx.fill();
}

el.betaStart?.addEventListener("click", startBetaDemo);
el.betaRestart?.addEventListener("click", () => startBetaDemo());
el.betaExit?.addEventListener("click", () => openBetaIntro());
el.betaFinishExit?.addEventListener("click", () => openBetaIntro());
el.betaDebug?.addEventListener("click", () => {
  if (!betaState) return;
  betaState.debug = !betaState.debug;
  el.betaDebug.textContent = `Debug: ${betaState.debug ? "On" : "Off"}`;
  drawBetaFrame();
});
window.addEventListener("resize", () => {
  if (betaState) drawBetaFrame();
});
document.addEventListener("keydown", (event) => {
  if (!document.querySelector("#beta-view")?.classList.contains("active")) return;
  const key = normalizeKey(event);
  const map = { W: "up", ArrowUp: "up", S: "down", ArrowDown: "down", A: "left", ArrowLeft: "left", D: "right", ArrowRight: "right" };
  if (key === "T") {
    event.preventDefault();
    if (betaState) {
      betaState.debug = !betaState.debug;
      el.betaDebug.textContent = `Debug: ${betaState.debug ? "On" : "Off"}`;
      drawBetaFrame();
    }
    return;
  }
  if (map[key]) {
    event.preventDefault();
    betaKeys[map[key]] = true;
    updateBetaControlVisuals();
  }
});
document.addEventListener("keyup", (event) => {
  const key = normalizeKey(event);
  const map = { W: "up", ArrowUp: "up", S: "down", ArrowDown: "down", A: "left", ArrowLeft: "left", D: "right", ArrowRight: "right" };
  if (map[key]) {
    betaKeys[map[key]] = false;
    updateBetaControlVisuals();
  }
});

const betaModeConfigs = {
  time: { id: "time", label: "Solo Time Trial", opponents: 0, goalRank: 1, goalLabel: "Set your best time", itemsEnabled: false, boostPadsEnabled: true, obstaclesEnabled: false },
  race4: { id: "race4", label: "4-Car Circuit Race", opponents: 3, goalRank: 2, goalLabel: "Top 2 required", itemsEnabled: true, boostPadsEnabled: true, obstaclesEnabled: true },
  race6: { id: "race6", label: "6-Car Circuit Race", opponents: 5, goalRank: 3, goalLabel: "Top 3 required", itemsEnabled: true, boostPadsEnabled: true, obstaclesEnabled: true },
  duel: { id: "duel", label: "Head-to-Head Race", opponents: 1, goalRank: 1, goalLabel: "Win required", itemsEnabled: true, boostPadsEnabled: true, obstaclesEnabled: true }
};

let betaPendingMode = "time";
let betaLoadToken = 0;
let betaWaypointPath = betaTrack.checkpoints.concat([betaTrack.startTile]).map((tile) => ({
  x: (tile.x + 0.5) * betaTileSize,
  y: (tile.y + 0.5) * betaTileSize
}));

function syncBetaTrackDerived() {
  betaWaypointPath = betaTrack.checkpoints.concat([betaTrack.startTile]).map((tile) => ({
    x: (tile.x + 0.5) * betaTileSize,
    y: (tile.y + 0.5) * betaTileSize
  }));
  betaAiRacingLine = betaTrack.aiLine;
}

function betaRatingsForCar(carId, level = state.garage?.[carId]?.level || 1, evolution = state.garage?.[carId]?.evolution || 0, includePlayerBonuses = false) {
  if (includePlayerBonuses) return displayedGearbornStats(carId);
  const profile = gearbornStatProfiles[carId] || gearbornStatProfiles.bee;
  const levelGain = Math.max(0, level - 1);
  const evolutionGain = Math.max(0, evolution) * 2;
  return Object.fromEntries(["speed", "acceleration", "handling", "torque", "body", "powertrain"].map((key) => [
    key,
    Math.min(100, (profile[key] ?? 74) + levelGain + evolutionGain)
  ]));
}

function betaPhysicsFromRatings(ratings, skill = 1) {
  return {
    maxSpeed:     (240 + (ratings.speed || 70) * 2.8  + (ratings.powertrain || 70) * 0.35) * skill,
    acceleration: (200 + (ratings.acceleration || 70) * 4.0) * skill,
    brake:        460 + (ratings.torque || 70) * 1.8,
    turnRate:     (1.9 + (ratings.handling || 70) / 36) * skill,
    torque:       ratings.torque || 70,
    body:         ratings.body  || 70,
    powertrain:   ratings.powertrain || 70,
    pwrMultiplier: 1 + ((ratings.powertrain || 70) / 100) * 0.25
  };
}

function getEligibleBetaOpponentLines(playerCarId) {
  const excluded = new Set(["art-van", "rainbowlt", "metal-snake", "training-car", playerCarId]);
  const list = cars.filter((car) => !car.tutorialOnly && !excluded.has(car.id));
  return list.length ? list : cars.filter((car) => defaultUnlockedLines.includes(car.id) && car.id !== playerCarId);
}

function getRandomOpponentCars(count, playerCarId) {
  const playerProgress = state.garage[playerCarId] || { level: 1, evolution: 0 };
  const pool = getEligibleBetaOpponentLines(playerCarId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }, (_, index) => {
    const car = shuffled[index % shuffled.length];
    const evolution = Math.min(playerProgress.evolution || 0, car.evolutions.length - 1);
    const form = car.evolutions[evolution] || car.evolutions[0];
    const level = Math.max(1, Math.min(maxCarLevel, (playerProgress.level || 1) + (index % 3) - 1));
    const ratings = betaRatingsForCar(car.id, level, evolution, false);
    return {
      car,
      carId: car.id,
      form,
      evolution,
      level,
      ratings,
      skill: 0.92 + Math.random() * 0.14
    };
  });
}

function betaOrdinal(value) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  const suffix = mod10 === 1 && mod100 !== 11 ? "st" : mod10 === 2 && mod100 !== 12 ? "nd" : mod10 === 3 && mod100 !== 13 ? "rd" : "th";
  return `${value}${suffix}`;
}

function betaMakeImage(src) {
  const img = new Image();
  img.src = src || "";
  return img;
}

function betaImageReady(img) {
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    window.setTimeout(done, 1400);
  });
}

async function preloadBetaRaceAssets() {
  const images = [
    ...Object.values(betaTileImages),
    ...Object.values(betaTrackImages || {}),
    ...(betaState?.racers || []).map((racer) => racer.image)
  ].filter(Boolean);
  await Promise.race([
    Promise.all(images.map(betaImageReady)),
    new Promise((resolve) => window.setTimeout(resolve, 2600))
  ]);
}

function setBetaLoading(active) {
  if (!el.betaLoading) return;
  if (active && !el.betaLoading.querySelector(".fuel-tank")) {
    el.betaLoading.innerHTML = `
      <div class="loading-card beta-loading-card">
        <div class="loading-logo">
          <img src="assets/logo/gearborn-engines-evolved-logo.png" alt="GearBorn" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
          <div class="loading-logo-text"><strong>GearBorn</strong><span>Engines Evolved</span></div>
        </div>
        <h1>Fueling Engines…</h1>
        <div class="fuel-tank" aria-label="Loading progress">
          <div class="fuel-fill beta-fuel-fill" id="beta-fuel-fill" style="width:12%"></div>
          <span class="fuel-cap" aria-hidden="true"></span>
        </div>
        <p class="loading-tip">Warming up the track…</p>
      </div>
    `;
    // Animate fill
    let pct = 12;
    const fill = el.betaLoading.querySelector(".beta-fuel-fill");
    const fillTimer = setInterval(() => {
      if (!el.betaLoading || el.betaLoading.hidden) { clearInterval(fillTimer); return; }
      pct = Math.min(92, pct + 4 + Math.random() * 10);
      if (fill) fill.style.width = pct + "%";
    }, 180);
    el.betaLoading._fillTimer = fillTimer;
  }
  if (!active && el.betaLoading._fillTimer) {
    clearInterval(el.betaLoading._fillTimer);
    el.betaLoading._fillTimer = null;
    const fill = el.betaLoading.querySelector(".beta-fuel-fill");
    if (fill) fill.style.width = "100%";
  }
  el.betaLoading.hidden = !active;
  el.betaLoading.classList.toggle("active", active);
}

function selectBetaTrack(trackId) {
  betaSelectedTrackId = betaTracks.some((track) => track.id === trackId) ? trackId : betaTracks[0].id;
  betaTrack = betaTracks.find((track) => track.id === betaSelectedTrackId) || betaTracks[0];
  syncBetaTrackDerived();
  renderBetaTrackSelect();
}

function drawBetaTrackPreview(track = betaTrack) {
  if (!el.betaTrackPreview) return;
  const ctx = el.betaTrackPreview.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const rect = el.betaTrackPreview.getBoundingClientRect();
  el.betaTrackPreview.width = Math.max(1, Math.floor(rect.width * ratio));
  el.betaTrackPreview.height = Math.max(1, Math.floor(rect.height * ratio));
  const w = el.betaTrackPreview.width / ratio;
  const h = el.betaTrackPreview.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / track.width, h / track.height) * 0.92;
  const tile = scale;
  const offsetX = (w - track.width * tile) / 2;
  const offsetY = (h - track.height * tile) / 2;
  ctx.fillStyle = "#14341d";
  ctx.fillRect(0, 0, w, h);
  track.grid.forEach((row, y) => row.forEach((cell, x) => {
    const cls = betaTileClass(cell);
    if (cls === "grass") {
      ctx.fillStyle = "#245d38";
    } else if (cls === "wall") {
      ctx.fillStyle = "rgba(255,255,255,.2)";
    } else {
      ctx.fillStyle = "#24282f";
    }
    ctx.fillRect(offsetX + x * tile, offsetY + y * tile, Math.ceil(tile), Math.ceil(tile));
  }));
  ctx.fillStyle = "#ffc857";
  ctx.fillRect(offsetX + track.startTile.x * tile, offsetY + track.startTile.y * tile, tile, tile);
}

// City icon mapping for each track
const betaTrackCityIcons = {
  training: "assets/maps/cityicon-training.png",
  indy:     "assets/maps/cityicon-indianapolis.png",
  berlin:   "assets/maps/cityicon-berlin.png",
  dubai:    "assets/maps/cityicon-dubai.png",
  rio:      "assets/maps/cityicon-rio.png",
  la:       "assets/maps/cityicon-los-angeles.png",
  seoul:    "assets/maps/cityicon-seoul.png",
  safrica:  "assets/maps/cityicon-cape-town.png",
  india:    "assets/maps/cityicon-bangalore.png",
  space:    "assets/maps/cityicon-space.png",
};

function renderBetaTrackSelect() {
  if (!el.betaTrackList) return;
  el.betaTrackList.innerHTML = betaTracks.map((track) => {
    const icon = betaTrackCityIcons[track.id] || "";
    const isActive = track.id === betaSelectedTrackId;
    return `
      <button class="beta-city-tile ${isActive ? "active" : ""}" data-beta-track="${track.id}" type="button" aria-label="${track.name}">
        ${icon ? `<img src="${icon}" alt="${track.name}" loading="lazy" onerror="this.style.display='none'">` : ""}
        <span>${track.name}</span>
      </button>
    `;
  }).join("");
  drawBetaTrackPreview(betaTrack);
}

// ── Beta screen navigation: show exactly one beta screen at a time ────────────
function showBetaScreen(screenId) {
  ["beta-intro", "beta-car-select-screen", "beta-track-select-screen"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = !screenId || id !== screenId;
  });
}

function openBetaTrackSelect(mode = "time") {
  betaPendingMode = mode;
  const modeLabels = { time: "Solo Time Trial", race4: "4-Car Race", race6: "6-Car Race", duel: "Head-to-Head" };
  if (el.betaTrackSelectTitle) el.betaTrackSelectTitle.textContent = `${modeLabels[mode] || "Race"} — Choose a Track`;
  showBetaScreen("beta-track-select-screen");
  renderBetaTrackSelect();
}

function closeBetaTrackSelect() {
  // Back from track select → return to car select
  showBetaScreen("beta-car-select-screen");
}

function openBetaCarSelect(mode) {
  if (mode) betaPendingMode = mode;
  showBetaScreen("beta-car-select-screen");
  renderCarTiles();
  renderCarSelectPreview("beta", el.betaCarSelectPreview);
}

function closeBetaCarSelect() {
  // Back from car select → return to main menu
  showBetaScreen("beta-intro");
}

function betaMakeRacer({ id, name, carId, form, ratings, color, x, y, angle = 0, ai = false, skill = 1, ghost = false }) {
  return {
    id,
    name,
    carId,
    form,
    ratings,
    physics: betaPhysicsFromRatings(ratings, skill),
    color,
    x,
    y,
    prevX: x,
    prevY: y,
    angle,
    speed: 0,
    lap: 1,
    checkpoint: 0,
    wasOnStart: true,
    finished: false,
    finishTime: null,
    ai,
    skill,
    ghost,
    image: betaMakeImage(form?.images?.topdown || form?.images?.display),
    record: [],
    lastRecord: 0
  };
}

function betaStartPosition(index, totalRacers = 1) {
  // All cars start near the start/finish tile
  const startTile = betaTrack.startTile;
  const baseX = (startTile.x + 0.5) * betaTileSize;
  const baseY = (startTile.y + 0.5) * betaTileSize;
  const angle = betaTrack.startAngle;
  // Perpendicular (lateral) direction
  const latX = -Math.sin(angle);
  const latY = Math.cos(angle);
  // Behind direction (opposite of travel)
  const backX = -Math.cos(angle);
  const backY = -Math.sin(angle);
  const lateralSpacing = 60;
  const rowSpacing = 90;
  // Grid layout: 2 columns, rows stacked behind line
  // index 0 = player, in the LAST row (furthest back)
  // AI cars fill front rows first
  const numRows = Math.ceil(totalRacers / 2);
  // Map: player (index=0) goes to last row
  // AI: index 1..N go to rows front-to-back (row 0 = closest to line)
  let col, row;
  if (index === 0) {
    // Player: last row
    row = numRows - 1;
    col = 1; // right side
  } else {
    // AI cars: sorted front (row 0) to back (row numRows-2)
    const aiIndex = index - 1; // 0-based AI index
    row = Math.floor(aiIndex / 2);
    col = aiIndex % 2;
  }
  // col 0 = left (-lateralSpacing/2), col 1 = right (+lateralSpacing/2)
  const lateralOffset = (col - 0.5) * lateralSpacing;
  // row 0 = just behind line, increasing rows go further back
  const backOffset = (row + 1) * rowSpacing;
  return {
    x: baseX + latX * lateralOffset + backX * backOffset,
    y: baseY + latY * lateralOffset + backY * backOffset
  };
}

function startBetaDemo(mode = betaState?.config?.id || "time") {
  if (!el.betaCanvas) return;
  const config = betaModeConfigs[mode] || betaModeConfigs.time;
  betaResizeCanvas();
  const carId = betaCurrentCarId();
  const car = cars.find((item) => item.id === carId) || cars[0];
  const form = currentEvolution(carId);
  const totalRacers = 1 + config.opponents;
  const playerPos = betaStartPosition(0, totalRacers);
  const player = betaMakeRacer({
    id: "player",
    name: form.name,
    carId,
    form,
    ratings: betaRatingsForCar(carId, state.garage?.[carId]?.level || 1, state.garage?.[carId]?.evolution || 0, true),
    color: car.color,
    x: playerPos.x,
    y: playerPos.y,
    angle: betaTrack.startAngle
  });
  const opponents = getRandomOpponentCars(config.opponents, carId).map((opponent, index) => {
    const pos = betaStartPosition(index + 1, totalRacers);
    return betaMakeRacer({
      id: `ai-${index}`,
      name: opponent.form.name,
      carId: opponent.carId,
      form: opponent.form,
      ratings: opponent.ratings,
      color: opponent.car.color,
      x: pos.x,
      y: pos.y,
      angle: betaTrack.startAngle,
      ai: true,
      skill: opponent.skill
    });
  });
  const savedGhost = config.id === "time" ? state.betaTimeTrials?.testTrack?.ghost || null : null;
  betaState = {
    config,
    player,
    racers: [player].concat(opponents),
    ghost: savedGhost,
    ghostPoint: null,
    active: false,
    finished: false,
    debug: false,
    startTime: 0,
    elapsed: 0,
    last: performance.now(),
    raf: null
  };
  showBetaScreen(null); // hide all beta screens
  el.betaRace.hidden = false;
  el.betaResults.hidden = true;
  el.betaDebug.textContent = "Debug: Off";
  drawBetaFrame();
  runCountdown(el.betaCountdown, () => {
    if (!betaState || betaState.finished) return;
    betaState.active = true;
    betaState.startTime = performance.now();
    betaState.last = betaState.startTime;
    betaState.raf = requestAnimationFrame(updateBetaRace);
  });
}

function betaDriveRacer(racer, dt, controls = {}) {
  const currentClass = betaTileClass(betaTileAt(racer.x, racer.y));
  const grassFactor = currentClass === "grass" ? Math.min(0.82, 0.56 + racer.physics.torque / 420) : 1;
  const maxSpeed = racer.physics.maxSpeed * grassFactor;
  const accel = racer.physics.acceleration * (currentClass === "grass" ? 0.58 + racer.physics.torque / 360 : 1);
  if (controls.up) racer.speed += accel * dt;
  if (controls.down) racer.speed -= racer.physics.brake * dt;
  if (!controls.up && !controls.down) racer.speed *= Math.max(0, 1 - (1.35 - racer.physics.torque / 180) * dt);
  racer.speed = Math.max(-maxSpeed * 0.34, Math.min(maxSpeed, racer.speed));
  const turnRate = racer.physics.turnRate * Math.min(1, Math.max(0.25, Math.abs(racer.speed) / 190));
  if (controls.left) racer.angle -= turnRate * dt * (racer.speed >= 0 ? 1 : -1);
  if (controls.right) racer.angle += turnRate * dt * (racer.speed >= 0 ? 1 : -1);
  racer.prevX = racer.x;
  racer.prevY = racer.y;
  racer.x += Math.cos(racer.angle) * racer.speed * dt;
  racer.y += Math.sin(racer.angle) * racer.speed * dt;
  if (betaTileClass(betaTileAt(racer.x, racer.y)) === "wall") {
    racer.x = racer.prevX;
    racer.y = racer.prevY;
    racer.speed *= -(0.08 + Math.max(0, 100 - racer.physics.body) * 0.002);
  }
}

function betaAiControls(racer) {
  const target = betaWaypointPath[racer.checkpoint] || betaWaypointPath[0];
  const desired = Math.atan2(target.y - racer.y, target.x - racer.x);
  const delta = Math.atan2(Math.sin(desired - racer.angle), Math.cos(desired - racer.angle));
  return {
    up: Math.abs(delta) < 0.9 || racer.speed < 140,
    down: Math.abs(delta) > 1.12 && racer.speed > 130,
    left: delta < -0.08,
    right: delta > 0.08
  };
}

function betaProgressRacer(racer) {
  const tx = Math.floor(racer.x / betaTileSize);
  const ty = Math.floor(racer.y / betaTileSize);
  const next = betaTrack.checkpoints[racer.checkpoint];
  if (next && tx === next.x && ty === next.y) racer.checkpoint += 1;
  const onStart = tx === betaTrack.startTile.x && ty === betaTrack.startTile.y;
  if (onStart && !racer.wasOnStart && racer.checkpoint >= betaTrack.checkpoints.length) {
    if (racer.lap >= betaLapsRequired) {
      racer.finished = true;
      racer.finishTime = betaState.elapsed;
      if (racer.id === "player") finishBetaDemo();
    } else {
      racer.lap += 1;
      racer.checkpoint = 0;
    }
  }
  racer.wasOnStart = onStart;
  // Advance AI waypoint when close enough to current target
  if (racer.ai && typeof racer.aiWaypoint === "number" && betaAiRacingLine?.length) {
    const wp = betaAiRacingLine[racer.aiWaypoint];
    if (wp && Math.hypot(wp.x - racer.x, wp.y - racer.y) < 68) {
      racer.aiWaypoint = (racer.aiWaypoint + 1) % betaAiRacingLine.length;
    }
  }
}

function betaProgressScore(racer) {
  if (racer.finished) return 100000 + (999 - (racer.finishTime || 999));
  const next = betaWaypointPath[racer.checkpoint] || betaWaypointPath[0];
  const distance = Math.hypot(next.x - racer.x, next.y - racer.y);
  return (racer.lap - 1) * 10 + racer.checkpoint + Math.max(0, 1 - distance / betaTileSize);
}

function betaPlacements() {
  return [...(betaState?.racers || [])].sort((a, b) => betaProgressScore(b) - betaProgressScore(a));
}

function betaResolveCarCollisions() {
  const racers = betaState.racers.filter((racer) => !racer.finished);
  for (let i = 0; i < racers.length; i += 1) {
    for (let j = i + 1; j < racers.length; j += 1) {
      const a = racers[i];
      const b = racers[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist >= 58) continue;
      const push = (58 - dist) / 2;
      const nx = dx / dist;
      const ny = dy / dist;
      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;
      a.speed *= 0.86 + a.physics.body / 700;
      b.speed *= 0.86 + b.physics.body / 700;
    }
  }
}

function updateBetaRace(now) {
  if (!betaState || betaState.finished) return;
  const dt = Math.min(0.035, (now - betaState.last) / 1000);
  betaState.last = now;
  betaState.elapsed = betaState.active ? (now - betaState.startTime) / 1000 : 0;
  betaDriveRacer(betaState.player, dt, {
    up: betaInput("up"),
    down: betaInput("down"),
    left: betaInput("left"),
    right: betaInput("right")
  });
  betaState.racers.filter((racer) => racer.ai && !racer.finished).forEach((racer) => betaDriveRacer(racer, dt, betaAiControls(racer)));
  betaResolveCarCollisions();
  betaState.racers.filter((racer) => !racer.finished).forEach(betaProgressRacer);
  betaRecordGhostSample(now);
  betaState.ghostPoint = betaGhostPointAt(betaState.elapsed);
  drawBetaFrame();
  betaState.raf = requestAnimationFrame(updateBetaRace);
}

function betaRecordGhostSample(now) {
  if (betaState.config.id !== "time" || !betaState.active || betaState.player.finished) return;
  if (now - betaState.player.lastRecord < 100) return;
  betaState.player.lastRecord = now;
  betaState.player.record.push({
    t: Math.round(betaState.elapsed * 1000),
    x: Math.round(betaState.player.x),
    y: Math.round(betaState.player.y),
    angle: Number(betaState.player.angle.toFixed(3))
  });
}

function betaGhostPointAt(elapsed) {
  const ghost = betaState?.ghost;
  if (!ghost?.length) return null;
  const t = elapsed * 1000;
  let nextIndex = ghost.findIndex((point) => point.t >= t);
  if (nextIndex < 0) return ghost[ghost.length - 1];
  if (nextIndex === 0) return ghost[0];
  const a = ghost[nextIndex - 1];
  const b = ghost[nextIndex];
  const mix = (t - a.t) / Math.max(1, b.t - a.t);
  return {
    x: a.x + (b.x - a.x) * mix,
    y: a.y + (b.y - a.y) * mix,
    angle: a.angle + (b.angle - a.angle) * mix
  };
}

function finishBetaDemo() {
  if (!betaState || betaState.finished) return;
  betaState.finished = true;
  betaState.active = false;
  if (betaState.raf) cancelAnimationFrame(betaState.raf);
  const placements = betaPlacements();
  const placement = placements.findIndex((racer) => racer.id === "player") + 1;
  const elapsed = betaState.elapsed;
  let resultLine = `Final time: ${elapsed.toFixed(2)} s`;
  if (betaState.config.id === "time") {
    const previous = state.betaTimeTrials?.[betaTrack.id]?.bestTime;
    const isBest = !previous || elapsed < previous;
    if (isBest) {
      state.betaTimeTrials = state.betaTimeTrials || {};
      state.betaTimeTrials[betaTrack.id] = {
        bestTime: elapsed,
        ghost: betaState.player.record.slice(0, 900)
      };
      saveState();
    }
    resultLine = `Final time: ${elapsed.toFixed(2)} s · Best: ${(isBest ? elapsed : previous).toFixed(2)} s${isBest ? " · New Best!" : ""}`;
  } else {
    const success = placement <= betaState.config.goalRank;
    resultLine = `${betaOrdinal(placement)} / ${betaState.racers.length} · ${betaState.config.goalLabel} · ${success ? "Success" : "Failed"}`;
  }
  el.betaFinalTime.textContent = resultLine;
  el.betaResults.hidden = false;
  drawBetaFrame();
}

function betaTileIsHorizontal(tile) {
  if (!tile) return true;
  if (tile.type === "road_straight") return tile.rotation !== 90 && tile.rotation !== 270;
  return true; // default horizontal
}

function drawBetaMarkers(ctx) {
  const ts = betaTileSize;
  // --- Start / Finish line ---
  const sx = betaTrack.startTile.x * ts;
  const sy = betaTrack.startTile.y * ts;
  const startTile = betaTrack.grid[betaTrack.startTile.y]?.[betaTrack.startTile.x];
  const startIsHoriz = betaTileIsHorizontal(startTile);
  const sfImg = betaTrackImages.startFinish;
  if (sfImg?.complete && sfImg.naturalWidth) {
    ctx.save();
    ctx.translate(sx + ts / 2, sy + ts / 2);
    // Image is a horizontal strip; to cross a horizontal road it must rotate 90°;
    // to cross a vertical road it stays at 0° (already perpendicular)
    if (startIsHoriz) ctx.rotate(Math.PI / 2);
    ctx.drawImage(sfImg, -ts / 2, -ts * 0.275, ts, ts * 0.55);
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,.9)";
    for (let i = 0; i < 8; i += 1) ctx.fillRect(sx + i * 32, sy + 92, 16, 72);
  }

  // --- Checkpoint lines ---
  betaTrack.checkpoints.forEach((cp, index) => {
    const playerPassed = betaState?.player ? index < betaState.player.checkpoint : false;
    const img = playerPassed ? betaTrackImages.checkpointActive : betaTrackImages.checkpointNeutral;
    const cpTile = betaTrack.grid[cp.y]?.[cp.x];
    const cpIsHoriz = betaTileIsHorizontal(cpTile);
    const cx = cp.x * ts;
    const cy = cp.y * ts;
    if (img?.complete && img.naturalWidth) {
      ctx.save();
      ctx.translate(cx + ts / 2, cy + ts / 2);
      // Same logic: horizontal road → rotate 90° so line crosses it perpendicularly
      if (cpIsHoriz) ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, -ts / 2, -ts * 0.275, ts, ts * 0.55);
      ctx.restore();
    } else {
      ctx.strokeStyle = playerPassed ? "rgba(255,200,87,.86)" : "rgba(82,199,255,.56)";
      ctx.lineWidth = 6;
      ctx.strokeRect(cx + 36, cy + 36, ts - 72, ts - 72);
    }
  });
}

function drawBetaFrame() {
  if (!betaState || !el.betaCanvas) return;
  betaResizeCanvas();
  const ctx = el.betaCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaCanvas.width / ratio;
  const h = el.betaCanvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const worldW = betaTrack.width * betaTileSize;
  const worldH = betaTrack.height * betaTileSize;
  const camX = Math.max(0, Math.min(worldW - w, betaState.player.x - w / 2));
  const camY = Math.max(0, Math.min(worldH - h, betaState.player.y - h / 2));
  const startCol = Math.max(0, Math.floor(camX / betaTileSize) - 1);
  const endCol = Math.min(betaTrack.width - 1, Math.ceil((camX + w) / betaTileSize) + 1);
  const startRow = Math.max(0, Math.floor(camY / betaTileSize) - 1);
  const endRow = Math.min(betaTrack.height - 1, Math.ceil((camY + h) / betaTileSize) + 1);
  ctx.save();
  ctx.translate(-camX, -camY);
  for (let y = startRow; y <= endRow; y += 1) {
    for (let x = startCol; x <= endCol; x += 1) drawBetaTile(ctx, betaTrack.grid[y][x], x * betaTileSize, y * betaTileSize);
  }
  drawBetaMarkers(ctx);
  if (betaState.ghostPoint) drawBetaGhost(ctx);
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => drawBetaCar(ctx, racer));
  drawBetaCar(ctx, betaState.player);
  if (betaState.debug) drawBetaDebug(ctx);
  ctx.restore();
  drawBetaMiniMap();
  const placement = betaPlacements().findIndex((racer) => racer.id === "player") + 1;
  el.betaTime.textContent = betaState.elapsed.toFixed(2);
  el.betaLap.textContent = `${Math.min(betaState.player.lap, betaLapsRequired)} / ${betaLapsRequired}`;
  el.betaCheckpoint.textContent = `${Math.min(betaState.player.checkpoint, betaTrack.checkpoints.length)} / ${betaTrack.checkpoints.length}`;
  el.betaSpeed.textContent = `${Math.round(Math.abs(betaState.player.speed) / 5.2)} MPH`;
  el.betaPosition.textContent = `${betaOrdinal(placement)} / ${betaState.racers.length}`;
}

function drawBetaCar(ctx, racer = betaState.player) {
  ctx.save();
  ctx.translate(racer.x, racer.y);
  ctx.rotate(racer.angle + Math.PI / 2);
  if (racer.image?.complete && racer.image.naturalWidth) {
    ctx.drawImage(racer.image, -34, -48, 68, 96);
  } else {
    ctx.fillStyle = racer.color || "#ffc857";
    ctx.fillRect(-18, -34, 36, 68);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-12, -16, 24, 18);
  }
  ctx.restore();
}

function drawBetaGhost(ctx) {
  ctx.save();
  ctx.globalAlpha = 0.42;
  ctx.translate(betaState.ghostPoint.x, betaState.ghostPoint.y);
  ctx.rotate(betaState.ghostPoint.angle + Math.PI / 2);
  ctx.fillStyle = "#68e8ff";
  ctx.shadowColor = "#68e8ff";
  ctx.shadowBlur = 18;
  ctx.fillRect(-18, -34, 36, 68);
  ctx.restore();
}

function drawBetaDebug(ctx) {
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = 2;
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.72)";
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    ctx.strokeRect(x * betaTileSize, y * betaTileSize, betaTileSize, betaTileSize);
    ctx.fillText(betaTileClass(tile), x * betaTileSize + 12, y * betaTileSize + 26);
  }));
  betaState.racers.forEach((racer) => {
    ctx.strokeStyle = racer.id === "player" ? "#52c7ff" : "#ff8f5a";
    ctx.beginPath();
    ctx.arc(racer.x, racer.y, 32, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawBetaMiniMap() {
  if (!el.betaMinimap || !betaState) return;
  const ctx = el.betaMinimap.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaMinimap.width / ratio;
  const h = el.betaMinimap.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / betaTrack.width, h / betaTrack.height);
  const offsetX = (w - betaTrack.width * scale) / 2;
  const offsetY = (h - betaTrack.height * scale) / 2;
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    const cls = betaTileClass(tile);
    if (cls === "grass") return;
    ctx.fillStyle = cls === "wall" ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.88)";
    ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
  }));
  const dot = (x, y, color, radius = 4) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(offsetX + x / betaTileSize * scale, offsetY + y / betaTileSize * scale, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => dot(racer.x, racer.y, "#ff805f", 3.2));
  if (betaState.ghostPoint) dot(betaState.ghostPoint.x, betaState.ghostPoint.y, "rgba(104,232,255,.62)", 3.5);
  dot(betaState.player.x, betaState.player.y, "#52c7ff", 4.4);
}

el.betaOptions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-beta-mode]");
  if (!button) return;
  openBetaCarSelect(button.dataset.betaMode);
});

el.betaTrackList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-beta-track]");
  if (!button) return;
  selectBetaTrack(button.dataset.betaTrack);
});

el.betaTrackStart?.addEventListener("click", () => {
  startBetaDemo(betaPendingMode);
});

el.betaTrackBack?.addEventListener("click", () => {
  closeBetaTrackSelect();
});

// Item definitions — icon is image path; fallback color used if image missing
const betaItemDefinitions = [
  { id: "turbo",    name: "Insano-Mode", icon: "assets/items/item-insano-mode.png",  color: "#ff6b1a" },
  { id: "shield",   name: "Big Bubba",   icon: "assets/items/item-big-bubba.png",    color: "#52c7ff" },
  { id: "oil",      name: "Oil Slick",   icon: "assets/items/oil_slick.png",         color: "#252b35" },
  { id: "tire",     name: "Spike Strip", icon: "assets/items/item-spike-strip.png",  color: "#ff3f3f" },
  { id: "burst",    name: "EMP Pulse",   icon: "assets/items/item-emp-pulse.png",    color: "#c084fc" },
  { id: "teleport", name: "Teleport",    icon: "assets/items/item-teleport.png",     color: "#6ee7a8" }
];

// Multi-race only items (not available in duel / time trial)
const betaMultiRaceOnlyItems = new Set(["teleport"]);

const betaItemImages = {};
betaItemDefinitions.forEach((def) => {
  betaItemImages[def.id] = betaMakeImage(def.icon);
});

const betaTrackImages = {
  itemBox:           betaMakeImage("assets/tracks/item_box.png"),
  boostPad:          betaMakeImage("assets/tracks/boost_pad.png"),
  oilSlick:          betaMakeImage("assets/items/oil_slick.png"),
  spikeStrip:        betaMakeImage("assets/items/spike-strip.png"),
  empWave:           betaMakeImage("assets/items/emp-pulse-wave.png"),
  insanoFlames:      betaMakeImage("assets/items/insano-flames.png"),
  bubbaBubble:       betaMakeImage("assets/items/big-bubba-bubble.png"),
  teleportPortal:    betaMakeImage("assets/items/teleport-portal.png"),
  barrel:            betaMakeImage("assets/beta3d/obstacle_barrel.png"),
  cone:              betaMakeImage("assets/beta3d/obstacle_cone.png"),
  startFinish:       betaMakeImage("assets/tracks/start-finish-line.png"),
  checkpointNeutral: betaMakeImage("assets/tracks/checkpoint-neutral.png"),
  checkpointActive:  betaMakeImage("assets/tracks/checkpoint-active.png")
};

let betaAiRacingLine = betaTrack.aiLine;

function betaWorldPoint(point) {
  return { x: point.x * betaTileSize, y: point.y * betaTileSize };
}

function createBetaObjects(config) {
  const points = betaTrack.path || [];
  const trackPoint = (fraction, offset = 0) => {
    const point = points[Math.max(0, Math.min(points.length - 1, Math.floor(points.length * fraction) + offset))] || betaTrack.startTile;
    return { x: point.x + 0.5, y: point.y + 0.5 };
  };
  const itemSpawns = [trackPoint(0.14), trackPoint(0.38), trackPoint(0.62), trackPoint(0.84)];
  const boostSpawns = [trackPoint(0.22), trackPoint(0.52), trackPoint(0.76)].map((point, index) => {
    const line = betaTrack.aiLine[Math.floor((betaTrack.aiLine.length - 1) * [0.22, 0.52, 0.76][index])] || betaTrack.aiLine[0];
    const next = betaTrack.aiLine[Math.min(betaTrack.aiLine.length - 1, Math.floor((betaTrack.aiLine.length - 1) * [0.22, 0.52, 0.76][index]) + 1)] || line;
    return { ...point, angle: Math.atan2(next.y - line.y, next.x - line.x) + Math.PI / 2 };
  });
  const obstacleSpawns = [trackPoint(0.3), trackPoint(0.7)].map((point, index) => ({ ...point, kind: index % 2 ? "barrel" : "cone" }));
  return {
    itemBoxes: config.itemsEnabled ? itemSpawns.map((point, index) => ({ id: `box-${index}`, ...betaWorldPoint(point), active: true, respawnAt: 0 })) : [],
    boostPads: config.boostPadsEnabled ? boostSpawns.map((point, index) => ({ id: `pad-${index}`, ...betaWorldPoint(point), angle: point.angle || 0 })) : [],
    obstacles: config.obstaclesEnabled ? obstacleSpawns.map((point, index) => ({ id: `hazard-${index}`, ...betaWorldPoint(point), kind: point.kind, lastHit: {} })) : [],
    traps: [],
    projectiles: []
  };
}

function betaRandomItemForRacer(racer) {
  // Build pool: exclude multi-race-only items in duel/time mode
  const modeId = betaState?.config?.id || "time";
  const isMultiRace = modeId === "race4" || modeId === "race6";
  const pool = betaItemDefinitions.filter((def) => isMultiRace || !betaMultiRaceOnlyItems.has(def.id));
  return pool[Math.floor(Math.random() * pool.length)];
}

function betaNowMs() {
  return (betaState?.elapsed || 0) * 1000;
}

function betaDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function betaBehindPoint(racer, distance = 64) {
  return {
    x: racer.x - Math.cos(racer.angle) * distance,
    y: racer.y - Math.sin(racer.angle) * distance
  };
}

function betaFrontPoint(racer, distance = 58) {
  return {
    x: racer.x + Math.cos(racer.angle) * distance,
    y: racer.y + Math.sin(racer.angle) * distance
  };
}

function betaNotify(message, duration = 1500) {
  if (!betaState) return;
  betaState.notification = message;
  betaState.notificationUntil = betaNowMs() + duration;
}

function betaApplyHit(racer, effect = "slow", strength = 1, source = "hazard") {
  if (!racer || racer.finished || racer.ghost) return;
  const now = betaNowMs();
  // Big Bubba blocks ALL penalties (grass slowdown included)
  if (racer.shieldUntil > now) {
    // EMP dissipates on shield hit; shield consumed
    if (source === "projectile") {
      racer.shieldUntil = 0;
      if (racer.id === "player") betaNotify("Big Bubba blocked the EMP!");
    }
    // All other hits blocked silently; shield stays intact
    return;
  }
  const bodyReducer = Math.max(0.48, 1 - (racer.physics.body || 70) / 260);
  const handlingReducer = Math.max(0.42, 1 - (racer.ratings.handling || 70) / 260);
  if (effect === "spin") {
    racer.spinUntil = Math.max(racer.spinUntil || 0, now + (1050 + strength * 550) * handlingReducer);
    racer.speed *= Math.max(0.35, 0.68 - strength * 0.08 * bodyReducer);
  } else if (effect === "burst") {
    racer.slowUntil = Math.max(racer.slowUntil || 0, now + (1000 + strength * 450) * bodyReducer);
    racer.speed *= Math.max(0.42, 0.74 - strength * 0.09 * bodyReducer);
  } else {
    racer.slowUntil = Math.max(racer.slowUntil || 0, now + (850 + strength * 430) * bodyReducer);
    racer.speed *= Math.max(0.46, 0.78 - strength * 0.08 * bodyReducer);
  }
  racer.hitFlashUntil = now + 280;
}

function betaUseItem(racer) {
  if (!betaState?.active || betaState.finished || !racer?.item || racer.finished) return false;
  const now = betaNowMs();
  if (racer.spinUntil > now) {
    if (racer.id === "player") betaNotify("You're spinning!");
    return false;
  }
  const item = racer.item;
  const pwr = racer.physics.pwrMultiplier || 1.16;
  racer.item = null;
  racer.itemCooldownUntil = now + 800;

  // ── Insano-Mode (turbo) ──────────────────────────────────────
  if (item.id === "turbo") {
    racer.boostUntil = Math.max(racer.boostUntil || 0, now + 1350 * pwr);
    racer.speed = Math.min(racer.physics.maxSpeed * (1.16 + pwr * 0.12), racer.speed + 130 * pwr);

  // ── Big Bubba (shield) ───────────────────────────────────────
  } else if (item.id === "shield") {
    racer.shieldUntil = Math.max(racer.shieldUntil || 0, now + 5000);

  // ── Oil Slick ────────────────────────────────────────────────
  } else if (item.id === "oil") {
    const point = betaBehindPoint(racer, 62);
    betaState.objects.traps.push({
      id: `trap-${Date.now()}-${Math.random()}`,
      type: "oil",
      source: "item",           // player/AI dropped → single-trigger
      owner: racer.id,
      x: point.x,
      y: point.y,
      armedAt: now + 360,
      expiresAt: now + 18000,
      radius: 36
    });

  // ── Spike Strip (tire) ───────────────────────────────────────
  } else if (item.id === "tire") {
    const point = betaBehindPoint(racer, 62);
    betaState.objects.traps.push({
      id: `trap-${Date.now()}-${Math.random()}`,
      type: "tire",
      source: "item",           // always single-trigger
      owner: racer.id,
      x: point.x,
      y: point.y,
      armedAt: now + 360,
      expiresAt: now + 18000,
      radius: 32
    });

  // ── EMP Pulse (burst) ────────────────────────────────────────
  } else if (item.id === "burst") {
    const point = betaFrontPoint(racer, 62);
    const speed = 760 * pwr;
    betaState.objects.projectiles.push({
      id: `emp-${Date.now()}-${Math.random()}`,
      owner: racer.id,
      x: point.x,
      y: point.y,
      vx: Math.cos(racer.angle) * speed,
      vy: Math.sin(racer.angle) * speed,
      angle: racer.angle,
      power: pwr,
      expiresAt: now + 1200
    });

  // ── Teleport ─────────────────────────────────────────────────
  } else if (item.id === "teleport") {
    betaExecuteTeleport(racer, now);
  }

  if (racer.id === "player") updateBetaItemHud();
  return true;
}

// ── Teleport logic ────────────────────────────────────────────────────────────
function betaExecuteTeleport(racer, now) {
  const placements = betaPlacements();
  const racerIdx = placements.findIndex((r) => r.id === racer.id);
  const total = placements.length;
  const PRE_DELAY = 1000;   // 1 s portal before teleport
  const POST_DELAY = 1000;  // 1 s portal after teleport

  if (racerIdx > 0) {
    // Not in 1st → jump one position forward
    const targetRacer = placements[racerIdx - 1];
    racer.teleportPortal = { startMs: now, phase: "pre", attachedTo: racer.id };
    window.setTimeout(() => {
      if (!betaState) return;
      // Place slightly behind the target
      const behind = betaBehindPoint(targetRacer, 80);
      racer.x = behind.x;
      racer.y = behind.y;
      racer.angle = targetRacer.angle;
      racer.speed = Math.min(racer.speed, targetRacer.speed);
      racer.teleportPortal = { startMs: betaNowMs(), phase: "post", attachedTo: racer.id };
      window.setTimeout(() => { if (racer.teleportPortal?.phase === "post") racer.teleportPortal = null; }, POST_DELAY);
    }, PRE_DELAY);
  } else {
    // In 1st → penalise 2nd place: send them to last (or 4th)
    const victim = placements[1];
    if (!victim) return;
    const destIdx = Math.min(total - 1, 3);     // 4th or last
    const destRacer = placements[destIdx] || placements[total - 1];
    victim.teleportPortal = { startMs: now, phase: "pre", attachedTo: victim.id };
    window.setTimeout(() => {
      if (!betaState) return;
      const behind = betaBehindPoint(destRacer, 90);
      victim.x = behind.x;
      victim.y = behind.y;
      victim.angle = destRacer.angle;
      victim.speed = Math.min(victim.speed, destRacer.speed * 0.7);
      victim.teleportPortal = { startMs: betaNowMs(), phase: "post", attachedTo: victim.id };
      window.setTimeout(() => { if (victim.teleportPortal?.phase === "post") victim.teleportPortal = null; }, POST_DELAY);
    }, PRE_DELAY);
    // Give player racer a brief boost reward for using it while leading
    racer.boostUntil = Math.max(racer.boostUntil || 0, now + 600);
  }
}

function betaFindTargetAhead(racer, maxDistance = 420) {
  let best = null;
  let bestScore = Infinity;
  betaState.racers.forEach((target) => {
    if (target.id === racer.id || target.finished) return;
    const dx = target.x - racer.x;
    const dy = target.y - racer.y;
    const forward = Math.cos(racer.angle) * dx + Math.sin(racer.angle) * dy;
    const lateral = Math.abs(-Math.sin(racer.angle) * dx + Math.cos(racer.angle) * dy);
    if (forward <= 0 || forward > maxDistance || lateral > 78) return;
    if (forward < bestScore) {
      bestScore = forward;
      best = target;
    }
  });
  return best;
}

function betaHasChaser(racer, maxDistance = 260) {
  return betaState.racers.some((target) => {
    if (target.id === racer.id || target.finished) return false;
    const dx = target.x - racer.x;
    const dy = target.y - racer.y;
    const behind = -(Math.cos(racer.angle) * dx + Math.sin(racer.angle) * dy);
    const lateral = Math.abs(-Math.sin(racer.angle) * dx + Math.cos(racer.angle) * dy);
    return behind > 0 && behind < maxDistance && lateral < 92;
  });
}

function betaAiUseItems() {
  if (!betaState?.config.itemsEnabled) return;
  const now = betaNowMs();
  betaState.racers.filter((racer) => racer.ai && racer.item && !racer.finished).forEach((racer) => {
    if (racer.itemCooldownUntil > now) return;
    const item = racer.item.id;
    const placement = betaPlacements().findIndex((entry) => entry.id === racer.id) + 1;
    const total = betaState.racers.length;
    // Insano-Mode: use when not 1st or going slow
    if (item === "turbo" && (placement > 1 || Math.abs(racer.speed) < racer.physics.maxSpeed * 0.55)) betaUseItem(racer);
    // Big Bubba: use when threat nearby
    else if (item === "shield" && (betaFindTargetAhead(racer, 180) || betaHasChaser(racer, 180) || Math.random() < 0.012)) betaUseItem(racer);
    // Oil / Spike Strip: drop when someone is chasing
    else if ((item === "oil" || item === "tire") && betaHasChaser(racer, 300)) betaUseItem(racer);
    // EMP: fire when someone is ahead and close
    else if (item === "burst" && betaFindTargetAhead(racer, 450)) betaUseItem(racer);
    // Teleport: use when behind and mid-race
    else if (item === "teleport" && placement > 1 && Math.random() < 0.04) betaUseItem(racer);
  });
}

function betaCollectItemBoxes(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.itemBoxes.forEach((box) => {
    if (!box.active && now >= box.respawnAt) box.active = true;
    if (!box.active) return;
    betaState.racers.forEach((racer) => {
      if (!box.active) return;
      if (racer.finished || racer.item || betaDistance(racer, box) > 48) return;
      racer.item = betaRandomItemForRacer(racer);
      box.active = false;
      box.respawnAt = now + 5000 + Math.random() * 3000;
      if (racer.id === "player") betaNotify(`${racer.item.name} Ready!`);
    });
  });
}

function betaApplyBoostPads(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.boostPads.forEach((pad) => {
    betaState.racers.forEach((racer) => {
      if (racer.finished || racer.lastPadAt > now - 900 || betaDistance(racer, pad) > 54) return;
      const pwr = racer.physics.pwrMultiplier || 1.16;
      racer.boostUntil = Math.max(racer.boostUntil || 0, now + 820 * pwr);
      racer.speed = Math.min(racer.physics.maxSpeed * (1.08 + pwr * 0.1), racer.speed + 92 * pwr);
      racer.lastPadAt = now;
    });
  });
}

function betaApplyObstacles(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.obstacles.forEach((obstacle) => {
    betaState.racers.forEach((racer) => {
      if (racer.finished || obstacle.lastHit[racer.id] > now - 1000 || betaDistance(racer, obstacle) > 39) return;
      obstacle.lastHit[racer.id] = now;
      betaApplyHit(racer, "slow", obstacle.kind === "barrel" ? 1.15 : 0.85, "obstacle");
    });
  });
}

function betaUpdateTraps(now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.traps = objects.traps.filter((trap) => trap.expiresAt > now && !trap.expired);
  objects.traps.forEach((trap) => {
    if (trap.armedAt > now) return;
    betaState.racers.forEach((racer) => {
      if (trap.expired || racer.id === trap.owner || racer.finished) return;
      if (betaDistance(racer, trap) > trap.radius + 26) return;
      betaApplyHit(racer, trap.type === "oil" ? "spin" : "slow", trap.type === "oil" ? 1.1 : 1.2, "trap");
      // Item-dropped traps (source:"item") disappear after one trigger.
      // Spike strip always disappears. Map oil slicks (no source) persist.
      if (trap.source === "item" || trap.type === "tire") {
        trap.expired = true;
      }
    });
  });
  objects.traps = objects.traps.filter((trap) => !trap.expired);
}

function betaUpdateProjectiles(dt, now) {
  const objects = betaState?.objects;
  if (!objects) return;
  objects.projectiles.forEach((projectile) => {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    // Dissipate on wall
    if (betaSurfaceAt(projectile.x, projectile.y) === "wall") projectile.expired = true;
    betaState.racers.forEach((racer) => {
      if (projectile.expired || racer.id === projectile.owner || racer.finished) return;
      if (betaDistance(racer, projectile) > 38) return;
      // Blocked by Big Bubba — shield consumed, projectile dissipates
      if (racer.shieldUntil > betaNowMs()) {
        racer.shieldUntil = 0;
        if (racer.id === "player") betaNotify("Big Bubba blocked the EMP!");
        projectile.expired = true;
        return;
      }
      betaApplyHit(racer, "burst", projectile.power || 1, "projectile");
      projectile.expired = true;
    });
  });
  objects.projectiles = objects.projectiles.filter((p) => !p.expired && p.expiresAt > now);
}

function updateBetaItemHud() {
  if (!el.betaItemSlot) return;
  const item = betaState?.player?.item;
  el.betaItemSlot.classList.toggle("is-empty", !item);
  el.betaItemName.textContent = item?.name || "Empty";
  el.betaItemPrompt.textContent = item ? "Space / E" : "Find a box";
  const iconEl = el.betaItemIcon;
  if (item) {
    const img = betaItemImages[item.id];
    if (img?.complete && img.naturalWidth) {
      iconEl.innerHTML = "";
      const clone = img.cloneNode();
      clone.style.cssText = "width:28px;height:28px;object-fit:contain;display:block;";
      iconEl.appendChild(clone);
    } else {
      // While loading or missing, show a short text label
      iconEl.textContent = item.name.slice(0, 2).toUpperCase();
    }
  } else {
    iconEl.textContent = "?";
  }
}

function updateBetaControlVisuals() {
  document.querySelectorAll(".beta-touch-controls").forEach((group) => {
    const leftActive = Boolean(betaKeys.left);
    const rightActive = Boolean(betaKeys.right);
    group.classList.toggle("steering-left", leftActive && !rightActive);
    group.classList.toggle("steering-right", rightActive && !leftActive);
    group.querySelectorAll("[data-beta-control]").forEach((button) => {
      button.classList.toggle("pressed", Boolean(betaKeys[button.dataset.betaControl]));
    });
  });
}

function setBetaControl(direction, active) {
  betaKeys[direction] = active;
  updateBetaControlVisuals();
}

function flashBetaItemButton() {
  document.querySelectorAll("[data-beta-item-button]").forEach((button) => {
    button.classList.add("pressed");
    window.setTimeout(() => button.classList.remove("pressed"), 160);
  });
}

function betaDrawImageOrFallback(ctx, img, x, y, width, height, fallback) {
  if (img?.complete && img.naturalWidth) {
    ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
    return;
  }
  fallback?.();
}

function betaDrawTrackObjects(ctx) {
  const objects = betaState?.objects;
  if (!objects) return;

  // ── Boost pads ────────────────────────────────────────────────
  objects.boostPads.forEach((pad) => {
    ctx.save();
    ctx.translate(pad.x, pad.y);
    ctx.rotate(pad.angle || 0);
    betaDrawImageOrFallback(ctx, betaTrackImages.boostPad, 0, 0, 58, 92, () => {
      ctx.fillStyle = "rgba(82,199,255,.78)";
      ctx.beginPath();
      ctx.moveTo(0, -42); ctx.lineTo(-26, 18); ctx.lineTo(0, 6); ctx.lineTo(26, 18);
      ctx.closePath(); ctx.fill();
    });
    ctx.restore();
  });

  // ── Obstacles (barrels / cones) ───────────────────────────────
  objects.obstacles.forEach((obstacle) => {
    const img = obstacle.kind === "barrel" ? betaTrackImages.barrel : betaTrackImages.cone;
    betaDrawImageOrFallback(ctx, img, obstacle.x, obstacle.y, 46, 46, () => {
      ctx.fillStyle = obstacle.kind === "barrel" ? "#ff805f" : "#ffc857";
      ctx.beginPath(); ctx.arc(obstacle.x, obstacle.y, 20, 0, Math.PI * 2); ctx.fill();
    });
  });

  // ── Item boxes ────────────────────────────────────────────────
  objects.itemBoxes.filter((box) => box.active).forEach((box) => {
    ctx.save();
    ctx.shadowColor = "#ffc857"; ctx.shadowBlur = 16;
    betaDrawImageOrFallback(ctx, betaTrackImages.itemBox, box.x, box.y, 48, 48, () => {
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(box.x - 22, box.y - 22, 44, 44);
      ctx.fillStyle = "#101820"; ctx.font = "900 28px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("?", box.x, box.y + 1);
    });
    ctx.restore();
  });

  // ── Traps: Oil Slick & Spike Strip ───────────────────────────
  objects.traps.forEach((trap) => {
    ctx.save();
    ctx.globalAlpha = 0.9;
    if (trap.type === "oil") {
      // Oil slick — elliptical pool
      betaDrawImageOrFallback(ctx, betaTrackImages.oilSlick, trap.x, trap.y, 80, 50, () => {
        ctx.fillStyle = "rgba(16,20,28,.92)";
        ctx.beginPath(); ctx.ellipse(trap.x, trap.y, 38, 22, -0.2, 0, Math.PI * 2); ctx.fill();
      });
    } else {
      // Spike strip — horizontal strip image
      betaDrawImageOrFallback(ctx, betaTrackImages.spikeStrip, trap.x, trap.y, 86, 28, () => {
        ctx.fillStyle = "#ff3f3f";
        ctx.beginPath();
        for (let i = 0; i < 8; i += 1) {
          const a = (Math.PI * 2 * i) / 8;
          const r = i % 2 ? 13 : 30;
          ctx[i === 0 ? "moveTo" : "lineTo"](trap.x + Math.cos(a) * r, trap.y + Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill();
      });
    }
    ctx.restore();
  });

  // ── EMP Pulse projectiles ─────────────────────────────────────
  objects.projectiles.forEach((proj) => {
    ctx.save();
    ctx.translate(proj.x, proj.y);
    // +PI flips 180° so the wave faces the direction of travel
    ctx.rotate(proj.angle + Math.PI);
    const empImg = betaTrackImages.empWave;
    if (empImg?.complete && empImg.naturalWidth) {
      ctx.drawImage(empImg, -36, -20, 72, 40);
    } else {
      ctx.fillStyle = "#c084fc"; ctx.shadowColor = "#c084fc"; ctx.shadowBlur = 18;
      ctx.fillRect(-22, -8, 44, 16);
    }
    ctx.restore();
  });
}

function betaDrawStatusEffects(ctx, racer) {
  const now = betaNowMs();

  // ── Teleport portal (pre and post) ───────────────────────────
  if (racer.teleportPortal) {
    const portal = racer.teleportPortal;
    const age = now - portal.startMs;
    const alpha = Math.min(1, age / 200) * (portal.phase === "post" ? Math.max(0, 1 - age / 1000) : 1);
    if (alpha > 0) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.92;
      const pImg = betaTrackImages.teleportPortal;
      const size = 110 + Math.sin(age / 180) * 10;
      if (pImg?.complete && pImg.naturalWidth) {
        ctx.drawImage(pImg, racer.x - size / 2, racer.y - size / 2, size, size);
      } else {
        ctx.strokeStyle = "#6ee7a8"; ctx.lineWidth = 5; ctx.shadowColor = "#6ee7a8"; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(racer.x, racer.y, size / 2, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ── Insano-Mode flames (boost active) ────────────────────────
  if (racer.boostUntil > now) {
    ctx.save();
    const flameImg = betaTrackImages.insanoFlames;
    // Position flames behind the car
    const bx = racer.x - Math.cos(racer.angle) * 50;
    const by = racer.y - Math.sin(racer.angle) * 50;
    ctx.translate(bx, by);
    // car is drawn at angle + PI/2 (top-down sprite); flames need to face backward
    // an extra +PI/2 rotates the flame image so it shoots out the back correctly
    ctx.rotate(racer.angle + Math.PI);
    if (flameImg?.complete && flameImg.naturalWidth) {
      ctx.globalAlpha = 0.88;
      ctx.drawImage(flameImg, -32, -20, 64, 56);
    } else {
      // Fallback: two streaks
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = "rgba(255,120,30,.8)";
      ctx.fillRect(-44, -15, 72, 7);
      ctx.fillRect(-34, 8, 62, 7);
    }
    ctx.restore();
  }

  // ── Big Bubba bubble (shield active) ─────────────────────────
  if (racer.shieldUntil > now) {
    ctx.save();
    const bubbleImg = betaTrackImages.bubbaBubble;
    const pulse = 1 + Math.sin(now / 220) * 0.04;
    const size = 108 * pulse;
    if (bubbleImg?.complete && bubbleImg.naturalWidth) {
      ctx.globalAlpha = 0.82;
      ctx.drawImage(bubbleImg, racer.x - size / 2, racer.y - size / 2, size, size);
    } else {
      ctx.strokeStyle = "rgba(82,199,255,.92)";
      ctx.shadowColor = "#52c7ff"; ctx.shadowBlur = 15;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(racer.x, racer.y, 52 * pulse, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  // ── Hit flash ─────────────────────────────────────────────────
  if (racer.hitFlashUntil > now) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,128,95,.9)"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(racer.x, racer.y, 46, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

function betaMakeRacer({ id, name, carId, form, ratings, color, x, y, angle = 0, ai = false, skill = 1, ghost = false }) {
  return {
    id,
    name,
    carId,
    form,
    ratings,
    physics: betaPhysicsFromRatings(ratings, skill),
    color,
    x,
    y,
    prevX: x,
    prevY: y,
    angle,
    speed: 0,
    lap: 1,
    checkpoint: 0,
    wasOnStart: true,
    finished: false,
    finishTime: null,
    ai,
    skill,
    ghost,
    item: null,
    boostUntil: 0,
    shieldUntil: 0,
    spinUntil: 0,
    slowUntil: 0,
    hitFlashUntil: 0,
    lastPadAt: 0,
    itemCooldownUntil: 0,
    teleportPortal: null,
    aiWaypoint: 0,
    image: betaMakeImage(imageFor(form, "topdown")),
    record: [],
    lastRecord: 0
  };
}

function betaAiControls(racer) {
  const target = betaAiRacingLine[racer.aiWaypoint || 0] || betaAiRacingLine[0];
  if (Math.hypot(target.x - racer.x, target.y - racer.y) < 74) {
    racer.aiWaypoint = ((racer.aiWaypoint || 0) + 1) % betaAiRacingLine.length;
  }
  const nextTarget = betaAiRacingLine[racer.aiWaypoint || 0] || betaAiRacingLine[0];
  const desired = Math.atan2(nextTarget.y - racer.y, nextTarget.x - racer.x);
  const delta = Math.atan2(Math.sin(desired - racer.angle), Math.cos(desired - racer.angle));
  const aheadX = racer.x + Math.cos(racer.angle) * 72;
  const aheadY = racer.y + Math.sin(racer.angle) * 72;
  const onRoad = betaSurfaceAt(racer.x, racer.y) === "road";
  const aheadWall = betaSurfaceAt(aheadX, aheadY) === "wall";
  // Always keep driving — only brake when heading straight into a wall
  // On grass, keep going and steer back to track (handled in betaDriveRacer)
  return {
    up: !aheadWall,
    down: aheadWall && racer.speed > 60,
    left: delta < -0.07,
    right: delta > 0.07
  };
}

async function startBetaDemo(mode = betaState?.config?.id || "time") {
  if (!el.betaCanvas) return;
  const loadToken = ++betaLoadToken;
  betaTrack = betaTracks.find((track) => track.id === betaSelectedTrackId) || betaTracks[0];
  syncBetaTrackDerived();
  const config = betaModeConfigs[mode] || betaModeConfigs.time;
  betaResizeCanvas();
  const carId = betaCurrentCarId();
  const car = cars.find((item) => item.id === carId) || cars[0];
  const form = currentEvolution(carId);
  const totalRacers = 1 + config.opponents;
  const playerPos = betaStartPosition(0, totalRacers);
  const player = betaMakeRacer({
    id: "player",
    name: form.name,
    carId,
    form,
    ratings: betaRatingsForCar(carId, state.garage?.[carId]?.level || 1, state.garage?.[carId]?.evolution || 0, true),
    color: car.color,
    x: playerPos.x,
    y: playerPos.y,
    angle: betaTrack.startAngle
  });
  const opponents = getRandomOpponentCars(config.opponents, carId).map((opponent, index) => {
    const pos = betaStartPosition(index + 1, totalRacers);
    return betaMakeRacer({
      id: `ai-${index}`,
      name: opponent.form.name,
      carId: opponent.carId,
      form: opponent.form,
      ratings: opponent.ratings,
      color: opponent.car.color,
      x: pos.x,
      y: pos.y,
      angle: betaTrack.startAngle,
      ai: true,
      skill: opponent.skill
    });
  });
  const savedGhost = config.id === "time" ? state.betaTimeTrials?.[betaTrack.id]?.ghost || null : null;
  betaState = {
    config,
    player,
    racers: [player].concat(opponents),
    ghost: savedGhost,
    ghostPoint: null,
    objects: createBetaObjects(config),
    notification: "",
    notificationUntil: 0,
    active: false,
    finished: false,
    debug: false,
    startTime: 0,
    elapsed: 0,
    last: performance.now(),
    raf: null
  };
  Object.keys(betaKeys).forEach((key) => delete betaKeys[key]);
  updateBetaControlVisuals();
  showBetaScreen(null); // hide all beta screens
  el.betaRace.hidden = false;
  el.betaResults.hidden = true;
  if (el.betaCountdown) {
    el.betaCountdown.classList.remove("active");
    el.betaCountdown.textContent = "";
  }
  setBetaLoading(true);
  el.betaDebug.textContent = "Debug: Off";
  updateBetaItemHud();
  drawBetaFrame();
  try {
    await preloadBetaRaceAssets();
  } finally {
    if (loadToken === betaLoadToken) setBetaLoading(false);
  }
  if (!betaState || betaState.config.id !== config.id || loadToken !== betaLoadToken) return;
  drawBetaFrame();
  runCountdown(el.betaCountdown, () => {
    if (!betaState || betaState.finished) return;
    betaState.active = true;
    betaState.startTime = performance.now();
    betaState.last = betaState.startTime;
    betaState.raf = requestAnimationFrame(updateBetaRace);
  });
}

function betaDriveRacer(racer, dt, controls = {}) {
  const now = betaNowMs();
  if (racer.spinUntil > now) {
    racer.angle += dt * 5.2;
    racer.speed *= Math.max(0, 1 - dt * 1.8);
    controls = {};
  }
  const currentClass = betaSurfaceAt(racer.x, racer.y);
  const boosted = racer.boostUntil > now;
  const slowed = racer.slowUntil > now;
  const shielded = racer.shieldUntil > now;   // Big Bubba blocks grass penalty
  const effectiveClass = shielded ? "road" : currentClass;
  const grassFactor = effectiveClass === "grass" ? Math.min(0.48, 0.28 + racer.physics.torque / 520) : 1;
  let maxSpeed = racer.physics.maxSpeed * grassFactor;
  let accel = racer.physics.acceleration * (effectiveClass === "grass" ? 0.32 + racer.physics.torque / 480 : 1);
  if (boosted) {
    maxSpeed *= 1.22 + (racer.physics.powertrain || 70) / 620;
    accel *= 1.25;
  }
  if (slowed) {
    maxSpeed *= 0.58 + Math.min(0.18, (racer.physics.torque || 70) / 520);
    accel *= 0.74 + Math.min(0.16, (racer.ratings.acceleration || 70) / 600);
  }
  if (controls.up) racer.speed += accel * dt;
  if (controls.down) racer.speed -= racer.physics.brake * dt;
  if (!controls.up && !controls.down) racer.speed *= Math.max(0, 1 - (1.35 - racer.physics.torque / 180) * dt);
  racer.speed = Math.max(-maxSpeed * 0.34, Math.min(maxSpeed, racer.speed));
  const turnRate = racer.physics.turnRate * Math.min(1, Math.max(0.25, Math.abs(racer.speed) / 190));
  if (controls.left) racer.angle -= turnRate * dt * (racer.speed >= 0 ? 1 : -1);
  if (controls.right) racer.angle += turnRate * dt * (racer.speed >= 0 ? 1 : -1);
  racer.prevX = racer.x;
  racer.prevY = racer.y;
  racer.x += Math.cos(racer.angle) * racer.speed * dt;
  racer.y += Math.sin(racer.angle) * racer.speed * dt;
  const nextClass = betaSurfaceAt(racer.x, racer.y);
  if (nextClass === "wall") {
    // Wall collision: reverse both player and AI
    racer.x = racer.prevX;
    racer.y = racer.prevY;
    racer.speed *= -(0.08 + Math.max(0, 100 - racer.physics.body) * 0.002);
    if (racer.ai) {
      // Immediately re-aim toward next waypoint to escape the wall
      const target = betaAiRacingLine[racer.aiWaypoint || 0] || betaAiRacingLine[0];
      racer.angle = Math.atan2(target.y - racer.y, target.x - racer.x);
    }
  } else if (racer.ai && nextClass === "grass") {
    // AI on grass: don't revert position — allow them to drive through it
    // but steer hard back toward the racing line so they recover quickly
    const target = betaAiRacingLine[racer.aiWaypoint || 0] || betaAiRacingLine[0];
    racer.angle = Math.atan2(target.y - racer.y, target.x - racer.x);
    // Slight speed reduction on grass is already handled by the grassFactor above
  }
}

function updateBetaRace(now) {
  if (!betaState || betaState.finished) return;
  const dt = Math.min(0.035, (now - betaState.last) / 1000);
  betaState.last = now;
  betaState.elapsed = betaState.active ? (now - betaState.startTime) / 1000 : 0;
  betaDriveRacer(betaState.player, dt, {
    up: betaInput("up"),
    down: betaInput("down"),
    left: betaInput("left"),
    right: betaInput("right")
  });
  betaAiUseItems();
  betaState.racers.filter((racer) => racer.ai && !racer.finished).forEach((racer) => betaDriveRacer(racer, dt, betaAiControls(racer)));
  betaResolveCarCollisions();
  const itemNow = betaNowMs();
  betaCollectItemBoxes(itemNow);
  betaApplyBoostPads(itemNow);
  betaApplyObstacles(itemNow);
  betaUpdateTraps(itemNow);
  betaUpdateProjectiles(dt, itemNow);
  betaState.racers.filter((racer) => !racer.finished).forEach(betaProgressRacer);
  betaRecordGhostSample(now);
  betaState.ghostPoint = betaGhostPointAt(betaState.elapsed);
  drawBetaFrame();
  betaState.raf = requestAnimationFrame(updateBetaRace);
}

function drawBetaFrame() {
  if (!betaState || !el.betaCanvas) return;
  betaResizeCanvas();
  const ctx = el.betaCanvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaCanvas.width / ratio;
  const h = el.betaCanvas.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const worldW = betaTrack.width * betaTileSize;
  const worldH = betaTrack.height * betaTileSize;
  const camX = Math.max(0, Math.min(worldW - w, betaState.player.x - w / 2));
  const camY = Math.max(0, Math.min(worldH - h, betaState.player.y - h / 2));
  const startCol = Math.max(0, Math.floor(camX / betaTileSize) - 1);
  const endCol = Math.min(betaTrack.width - 1, Math.ceil((camX + w) / betaTileSize) + 1);
  const startRow = Math.max(0, Math.floor(camY / betaTileSize) - 1);
  const endRow = Math.min(betaTrack.height - 1, Math.ceil((camY + h) / betaTileSize) + 1);
  ctx.save();
  ctx.translate(-camX, -camY);
  for (let y = startRow; y <= endRow; y += 1) {
    for (let x = startCol; x <= endCol; x += 1) drawBetaTile(ctx, betaTrack.grid[y][x], x * betaTileSize, y * betaTileSize);
  }
  drawBetaMarkers(ctx);
  betaDrawTrackObjects(ctx);
  if (betaState.ghostPoint) drawBetaGhost(ctx);
  // Draw status effects (flames, bubble) UNDER the car so car sits on top
  betaState.racers.forEach((racer) => betaDrawStatusEffects(ctx, racer));
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => drawBetaCar(ctx, racer));
  drawBetaCar(ctx, betaState.player);
  if (betaState.debug) drawBetaDebug(ctx);
  ctx.restore();
  if (betaState.notification && betaState.notificationUntil > betaNowMs()) {
    ctx.save();
    ctx.fillStyle = "rgba(16,20,28,.82)";
    ctx.strokeStyle = "rgba(255,200,87,.55)";
    ctx.lineWidth = 1.5;
    if (ctx.roundRect) ctx.roundRect(w / 2 - 150, 18, 300, 42, 12);
    else ctx.rect(w / 2 - 150, 18, 300, 42);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffc857";
    ctx.font = "900 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(betaState.notification, w / 2, 39);
    ctx.restore();
  }
  drawBetaMiniMap();
  updateBetaItemHud();
  const placement = betaPlacements().findIndex((racer) => racer.id === "player") + 1;
  el.betaTime.textContent = betaState.elapsed.toFixed(2);
  el.betaLap.textContent = `${Math.min(betaState.player.lap, betaLapsRequired)} / ${betaLapsRequired}`;
  el.betaCheckpoint.textContent = `${Math.min(betaState.player.checkpoint, betaTrack.checkpoints.length)} / ${betaTrack.checkpoints.length}`;
  el.betaSpeed.textContent = `${Math.round(Math.abs(betaState.player.speed) / 5.2)} MPH`;
  el.betaPosition.textContent = `${betaOrdinal(placement)} / ${betaState.racers.length}`;
}

function drawBetaCar(ctx, racer = betaState.player) {
  ctx.save();
  ctx.translate(racer.x, racer.y);
  ctx.rotate(racer.angle + Math.PI / 2);
  if (racer.spinUntil > betaNowMs()) ctx.rotate(Math.sin(betaState.elapsed * 16) * 0.12);
  if (racer.image?.complete && racer.image.naturalWidth) {
    ctx.drawImage(racer.image, -34, -48, 68, 96);
  } else {
    ctx.fillStyle = racer.color || "#ffc857";
    ctx.fillRect(-18, -34, 36, 68);
    ctx.fillStyle = "#101820";
    ctx.fillRect(-12, -16, 24, 18);
  }
  ctx.restore();
}

function drawBetaMiniMap() {
  if (!el.betaMinimap || !betaState) return;
  const ctx = el.betaMinimap.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const w = el.betaMinimap.width / ratio;
  const h = el.betaMinimap.height / ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / betaTrack.width, h / betaTrack.height);
  const offsetX = (w - betaTrack.width * scale) / 2;
  const offsetY = (h - betaTrack.height * scale) / 2;
  betaTrack.grid.forEach((row, y) => row.forEach((tile, x) => {
    const cls = betaTileClass(tile);
    if (cls === "grass") return;
    ctx.fillStyle = cls === "wall" ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.88)";
    ctx.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
  }));
  if (betaState.config.boostPadsEnabled) {
    ctx.fillStyle = "rgba(82,199,255,.62)";
    betaState.objects.boostPads.forEach((pad) => ctx.fillRect(offsetX + pad.x / betaTileSize * scale - 1, offsetY + pad.y / betaTileSize * scale - 1, 3, 3));
  }
  const dot = (x, y, color, radius = 4) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(offsetX + x / betaTileSize * scale, offsetY + y / betaTileSize * scale, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  betaState.racers.filter((racer) => racer.ai).forEach((racer) => dot(racer.x, racer.y, "#ff805f", 3.2));
  if (betaState.ghostPoint) dot(betaState.ghostPoint.x, betaState.ghostPoint.y, "rgba(104,232,255,.62)", 3.5);
  dot(betaState.player.x, betaState.player.y, "#52c7ff", 4.4);
}

document.addEventListener("keydown", (event) => {
  if (!document.querySelector("#beta-view")?.classList.contains("active")) return;
  const key = normalizeKey(event);
  if ((key === "Space" || key === "E") && betaState?.active && !betaState.finished) {
    event.preventDefault();
    flashBetaItemButton();
    betaUseItem(betaState.player);
  }
});

document.querySelectorAll("[data-beta-control]").forEach((button) => {
  const direction = button.dataset.betaControl;
  const press = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    setBetaControl(direction, true);
  };
  const release = (event) => {
    event.preventDefault();
    if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
    setBetaControl(direction, false);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", (event) => {
    if (button.hasPointerCapture?.(event.pointerId)) return;
    setBetaControl(direction, false);
  });
});

document.querySelectorAll("[data-beta-item-button]").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    flashBetaItemButton();
    betaUseItem(betaState?.player);
  });
});

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

function openBetaIntro() {
  if (!el.betaIntro || !el.betaRace) return;
  el.betaRace.hidden = true;
  if (el.beta3dRace) el.beta3dRace.hidden = true;
  showBetaScreen("beta-intro");
  setBetaLoading(false);
  stopBetaDemo(false);
  stopBeta3d(false);
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
  if (forgeSelectedCarId && !forgeAnimating) runForgeAnimation(forgeSelectedCarId);
});

document.querySelector("#forge-card-btn")?.addEventListener("click", () => {
  openForge();
});

if (beta3dDevEnabled()) document.body.classList.add("beta-dev-enabled");

const loadingExperience = startLoadingExperience();
checkAchievements(true);
saveState();
render();
if (beta3dDevEnabled()) showView("beta");
if (!beta3dDevEnabled() && !state.tutorialComplete && !state.tutorialActive) {
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
