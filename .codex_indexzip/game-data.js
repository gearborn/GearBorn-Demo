const distances = [
  { meters: 400, label: "400 m", xp: 80, difficulty: 0.9 },
  { meters: 800, label: "800 m", xp: 180, difficulty: 1.05 },
  { meters: 1600, label: "1600 m", xp: 420, difficulty: 1.22 }
];

// Data helpers needed while this file builds story/campaign config. Keep this
// tiny and dependency-free so split script loading does not depend on game-logic.
function imageFor(entry, role) {
  if (!entry) return "";
  if (entry.images?.[role]) return entry.images[role];
  if (role === "topdown" && entry.images?.race) {
    return entry.images.race.replace("-race.", "-topdown.");
  }
  return entry.image || "";
}

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
      { name: "Vandy-Warhaul", style: "Pop Art", formBonus: { speed: 3, acceleration: 3 }, images: { display: "assets/cars/art-vandy-warhaul-display.png", race: "assets/cars/art-vandy-warhaul-race.png", topdown: "assets/cars/art-vandy-warhaul-topdown.png" } },
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

// Sheet-driven playable lines added for medallion rewards and future roster expansion.
cars.splice(cars.findIndex((car) => car.id === "rainbowlt"), 0,
  {
    id: "muscle-man",
    family: "Muscle Man",
    color: "#f97316",
    trait: "Flex cruiser",
    unlockable: true,
    evolutions: [
      { name: "Tourquette", images: { display: "assets/cars/muscle-tourquette-display.png", race: "assets/cars/muscle-tourquette-race.png", topdown: "assets/cars/muscle-tourquette-topdown.png" } },
      { name: "Pistonox", images: { display: "assets/cars/muscle-pistonox-display.png", race: "assets/cars/muscle-pistonox-race.png", topdown: "assets/cars/muscle-pistonox-topdown.png" } },
      { name: "Cylindialis", images: { display: "assets/cars/muscle-cylindialis-display.png", race: "assets/cars/muscle-cylindialis-race.png", topdown: "assets/cars/muscle-cylindialis-topdown.png" } }
    ]
  },
  {
    id: "waste-management",
    family: "Waste Management",
    color: "#7c8f45",
    trait: "Trash collector",
    unlockable: true,
    evolutions: [
      { name: "Garbaggito", images: { display: "assets/cars/garbage-garbaggito-display.png", race: "assets/cars/garbage-garbaggito-race.png", topdown: "assets/cars/garbage-garbaggito-topdown.png" } },
      { name: "Garbanino", images: { display: "assets/cars/garbage-garbanino-display.png", race: "assets/cars/garbage-garbanino-race.png", topdown: "assets/cars/garbage-garbanino-topdown.png" } }
    ]
  },
  {
    id: "chill-penguin",
    family: "Chill Penguin",
    color: "#7dd3fc",
    trait: "Glacier slider",
    unlockable: true,
    evolutions: [
      { name: "Freezy-E", images: { display: "assets/cars/penguin-freezy-e-display.png", race: "assets/cars/penguin-freezy-e-race.png", topdown: "assets/cars/penguin-freezy-e-topdown.png" } },
      { name: "Brrap", images: { display: "assets/cars/penguin-brrap-display.png", race: "assets/cars/penguin-brrap-race.png", topdown: "assets/cars/penguin-brrap-topdown.png" } },
      { name: "Chillmatic", images: { display: "assets/cars/penguin-chillmatic-display.png", race: "assets/cars/penguin-chillmatic-race.png", topdown: "assets/cars/penguin-chillmatic-topdown.png" } }
    ]
  },
  {
    id: "space-dolphin",
    family: "Space Dolphin",
    color: "#67e8f9",
    trait: "Cosmic surfer",
    unlockable: true,
    evolutions: [
      { name: "Orbitide", images: { display: "assets/cars/dolphin-orbitide-display.png", race: "assets/cars/dolphin-orbitide-race.png", topdown: "assets/cars/dolphin-orbitide-topdown.png" } },
      { name: "Aquantius", images: { display: "assets/cars/dolphin-aquantius-display.png", race: "assets/cars/dolphin-aquantius-race.png", topdown: "assets/cars/dolphin-aquantius-topdown.png" } },
      { name: "Astromarino", images: { display: "assets/cars/dolphin-astromarino-display.png", race: "assets/cars/dolphin-astromarino-race.png", topdown: "assets/cars/dolphin-astromarino-topdown.png" } }
    ]
  },
  {
    id: "butcher-hog",
    family: "Butcher Hog",
    color: "#fb7185",
    trait: "Meatwheel menace",
    unlockable: true,
    evolutions: [
      { name: "Sauspin", images: { display: "assets/cars/butcher-sauspin-display.png", race: "assets/cars/butcher-sauspin-race.png", topdown: "assets/cars/butcher-sauspin-topdown.png" } },
      { name: "Marrauvage", images: { display: "assets/cars/butcher-marrauvage-display.png", race: "assets/cars/butcher-marrauvage-race.png", topdown: "assets/cars/butcher-marrauvage-topdown.png" } },
      { name: "OlChap", images: { display: "assets/cars/butcher-olchap-display.png", race: "assets/cars/butcher-olchap-race.png", topdown: "assets/cars/butcher-olchap-topdown.png" } }
    ]
  },
  {
    id: "tiger-cart",
    family: "Tiger Cart",
    color: "#facc15",
    trait: "Feral fairway",
    unlockable: true,
    evolutions: [
      { name: "Puttercat", images: { display: "assets/cars/golf-puttercat-display.png", race: "assets/cars/golf-puttercat-race.png", topdown: "assets/cars/golf-puttercat-topdown.png" } },
      { name: "Snarfly", images: { display: "assets/cars/golf-snarfly-display.png", race: "assets/cars/golf-snarfly-race.png", topdown: "assets/cars/golf-snarfly-topdown.png" } },
      { name: "Notar-O", images: { display: "assets/cars/golf-notar-o-display.png", race: "assets/cars/golf-notar-o-race.png", topdown: "assets/cars/golf-notar-o-topdown.png" } }
    ]
  },
  {
    id: "silly-goose",
    family: "Silly Goose",
    color: "#f8fafc",
    trait: "Chaos honker",
    unlockable: true,
    evolutions: [
      { name: "Honky", images: { display: "assets/cars/goose-honky-display.png", race: "assets/cars/goose-honky-race.png", topdown: "assets/cars/goose-honky-topdown.png" } },
      { name: "Goosetopher", images: { display: "assets/cars/goose-goosetopher-display.png", race: "assets/cars/goose-goosetopher-race.png", topdown: "assets/cars/goose-goosetopher-topdown.png" } },
      { name: "Eggdon", images: { display: "assets/cars/goose-eggdon-display.png", race: "assets/cars/goose-eggdon-race.png", topdown: "assets/cars/goose-eggdon-topdown.png" } }
    ]
  },
  {
    id: "construction-blok",
    family: "Construction Blok",
    color: "#fbbf24",
    trait: "Brick builder",
    unlockable: true,
    evolutions: [
      { name: "Blokparty", images: { display: "assets/cars/traffic-blokparty-display.png", race: "assets/cars/traffic-blokparty-race.png", topdown: "assets/cars/traffic-blokparty-topdown.png" } },
      { name: "Structable", images: { display: "assets/cars/traffic-structable-display.png", race: "assets/cars/traffic-structable-race.png", topdown: "assets/cars/traffic-structable-topdown.png" } },
      { name: "Doublestak", images: { display: "assets/cars/traffic-doublestak-display.png", race: "assets/cars/traffic-doublestak-race.png", topdown: "assets/cars/traffic-doublestak-topdown.png" } }
    ]
  },
  {
    id: "skater-koala",
    family: "Skater Koala",
    color: "#94a3b8",
    trait: "Rail carver",
    unlockable: true,
    evolutions: [
      { name: "Koaster", images: { display: "assets/cars/koala-koaster-display.png", race: "assets/cars/koala-koaster-race.png", topdown: "assets/cars/koala-koaster-topdown.png" } },
      { name: "Supey", images: { display: "assets/cars/koala-supey-display.png", race: "assets/cars/koala-supey-race.png", topdown: "assets/cars/koala-supey-topdown.png" } },
      { name: "Koalossus", images: { display: "assets/cars/koala-koalossus-display.png", race: "assets/cars/koala-koalossus-race.png", topdown: "assets/cars/koala-koalossus-topdown.png" } }
    ]
  },
  {
    id: "rides-hair",
    family: "Rides Hair",
    color: "#a16207",
    trait: "Handlebar hitcher",
    unlockable: true,
    evolutions: [
      { name: "Staschel", images: { display: "assets/cars/mustache-staschel-display.png", race: "assets/cars/mustache-staschel-race.png", topdown: "assets/cars/mustache-staschel-topdown.png" } },
      { name: "Beardo", images: { display: "assets/cars/rival-beardo-display.png", race: "assets/cars/rival-beardo-race.png", topdown: "assets/cars/mustache-beardo-topdown.png" } },
      { name: "Bair", images: { display: "assets/cars/mustache-bair-display.png", race: "assets/cars/mustache-bair-race.png", topdown: "assets/cars/mustache-bair-topdown.png" } }
    ]
  },
  {
    id: "royal-flush",
    family: "Royal Flush",
    color: "#7c3aed",
    trait: "Noxious blaster",
    unlockable: true,
    evolutions: [
      { name: "Whiffleton", images: { display: "assets/cars/poo-whiffleton-display.png", race: "assets/cars/poo-whiffleton-race.png", topdown: "assets/cars/poo-whiffleton-topdown.png" } },
      { name: "Dookingham", images: { display: "assets/cars/poo-dookingham-display.png", race: "assets/cars/poo-dookingham-race.png", topdown: "assets/cars/poo-dookingham-topdown.png" } },
      { name: "Pootin", images: { display: "assets/cars/poo-pootin-display.png", race: "assets/cars/poo-pootin-race.png", topdown: "assets/cars/poo-pootin-topdown.png" } }
    ]
  }
);

const defaultUnlockedLines = ["bee", "pickup", "rabbit"];
const pinkSlipUnlockOrder = ["pig", "sorority-elephant", "grunge-fish", "florida-gator", "whale", "techno-dinosaur", "karate-cow", "frog"];
const gauntletUnlockOrder = ["muscle-man", "chill-penguin", "space-dolphin", "butcher-hog", "tiger-cart", "silly-goose", "construction-blok", "skater-koala", "royal-flush", "rides-hair"];
const coreGearbornLineIds = defaultUnlockedLines.concat(pinkSlipUnlockOrder);
const starterCarIds = coreGearbornLineIds;
const rivalStarterCarIds = defaultUnlockedLines;
const achievementUnlockOrder = ["art-van", "cake-train"];
const garageLineOrder = defaultUnlockedLines.concat(pinkSlipUnlockOrder, achievementUnlockOrder, gauntletUnlockOrder, ["waste-management", "rainbowlt", "metal-snake", "training-car"]);
const maxCarLevel = 10;
const tutorialCarId = "metal-snake";
const tutorialOpponentCarId = "training-car";
const tutorialTrack = { id: "training-school", city: "Spindell Training Academy", country: "Training", map: "assets/menu/training_bg.png", cityMap: "assets/menu/training_bg.png", cityIcon: "assets/maps/cityicon-training.png" };
const tutorialDistance = { meters: 400, label: "400 m", xp: 80, difficulty: 0.55 };
const tutorialRank = { key: "F", name: "Tutorque", xpBonus: 1, power: 0.28, color: "#9aa7b7", images: { display: "assets/cars/tutorque-display.png", race: "assets/cars/tutorque-race.png" } };
const tutorialMedals = [
  { key: "gold", label: "Gold", difficulty: "Hard", xp: 420, base: 16.0 },
  { key: "silver", label: "Silver", difficulty: "Medium", xp: 260, base: 19.0 },
  { key: "bronze", label: "Bronze", difficulty: "Easy", xp: 150, base: 23.0 }
];

// Tutorial-exclusive city with 3 levels shown on the training city map
const tutorialCityLevels = [
  { type: "drag",   title: "F Class Drag Race: Tutorque",          tutorialLevel: "drag",   campaignIndex: -1 },
  { type: "rival",  title: "Training Head-to-Head: Rival",          tutorialLevel: "head2head", mechanic: "circuitDuel", track: tutorialTrack, campaignIndex: -2 },
  { type: "battle", title: "Training Battle: Tutorque",             tutorialLevel: "battle", campaignIndex: -3 }
];
const tutorialCity = {
  id: tutorialTrack.id,
  city: tutorialTrack.city,
  country: tutorialTrack.country,
  track: tutorialTrack,
  tutorialOnly: true,
  levels: tutorialCityLevels,
  icon: tutorialTrack.cityIcon
};

// Tutorial scene registry. `code` is the approved T-### ordering; `id` remains
// slug-style for code stability. Dialogue/content below intentionally uses
// placeholders for new story beats until final writing and assets are approved.
const tutorialScenes = [
  { code: "T-001", id: "intro", label: "INTRO", view: "menu", mode: "vnScene", background: "assets/tutorial/tutorial-academy-exterior.png", splash: "assets/tutorial/tutorial-comic-intro.png" },
  { code: "T-002", id: "rival-intro", label: "RIVAL INTRO", view: "menu", mode: "vnScene", background: "assets/tutorial/tutorial-academy-hallway.png", supports: ["rivalCharacter", "tutorqueVisual"] },
  { code: "T-003", id: "mamburn", label: "MAMBURN", view: "play", flow: "car", mode: "vnScene", background: "assets/menu/garage_bg.png" },
  { code: "T-004", id: "city-map", label: "CITY MAP", view: "story", mode: "dialogueOverlay" },
  { code: "T-005", id: "drag-race-intro", label: "DRAG RACE INTRO", view: "story", mode: "dialogueOverlay", supports: ["rivalCharacter", "tutorqueVisual"] },
  { code: "T-006", id: "drag-race", label: "DRAG RACE", view: "play", flow: "match", mode: "gameplay" },
  { code: "T-007", id: "drag-race-win", label: "DRAG RACE WIN", view: "play", wait: true, mode: "dialogueOverlay" },
  { code: "T-008", id: "rival-stinger", label: "RIVAL STINGER", view: "play", mode: "vnScene", background: "assets/menu/garage_bg.png", supports: ["rivalCharacter"] },
  { code: "T-009", id: "drag2h2h", label: "DRAG2H2H", view: "story", mode: "dialogueOverlay" },
  { code: "T-010", id: "head2head-intro", label: "HEAD2HEAD INTRO", view: "story", mode: "dialogueOverlay", supports: ["rivalCharacter"] },
  { code: "T-011", id: "head2head", label: "HEAD2HEAD", view: "beta", flow: "race", mode: "gameplay" },
  { code: "T-012", id: "head2head-win", label: "HEAD2HEAD WIN", view: "beta", wait: true, mode: "dialogueOverlay" },
  { code: "T-013", id: "h2h-rival-stinger", label: "H2H RIVAL STINGER", view: "beta", mode: "vnScene", background: "assets/menu/garage_bg.png", supports: ["rivalCharacter", "tutorqueNoticesPlayer"] },
  { code: "T-014", id: "h2h2battle", label: "H2H2BATTLE", view: "story", mode: "dialogueOverlay" },
  { code: "T-015", id: "battle-intro", label: "BATTLE INTRO", view: "story", mode: "dialogueOverlay" },
  { code: "T-016", id: "battle", label: "BATTLE", view: "battle", flow: "match", mode: "gameplay" },
  { code: "T-017", id: "battle-win", label: "BATTLE WIN", view: "battle", wait: true, mode: "dialogueOverlay" },
  { code: "T-018", id: "map-final", label: "MAP FINAL", view: "story", mode: "dialogueOverlay" },
  { code: "T-019", id: "garage", label: "GARAGE", view: "garage", mode: "dialogueOverlay", background: "assets/menu/garage_bg.png" },
  { code: "T-020", id: "upgrade", label: "UPGRADE", view: "garage", mode: "menuTutorial" },
  { code: "T-021", id: "evolve", label: "EVOLVE", view: "garage", wait: true, mode: "menuTutorial" },
  { code: "T-022", id: "evolution-cinematic", label: "EVOLUTION CINEMATIC", view: "garage", mode: "comicSplash", splash: "assets/tutorial/tutorial-comic-evolution.png", redirectTo: "evolve" },
  { code: "T-023", id: "evolved-form", label: "EVOLVED FORM", view: "garage", mode: "dialogueOverlay", redirectTo: "evolve" },
  { code: "T-024", id: "tyree-final", label: "TYREE FINAL", view: "garage", mode: "vnScene", background: "assets/menu/garage_bg.png" },
  { code: "T-025", id: "empty-garage", label: "EMPTY GARAGE", view: "garage", mode: "vnScene", background: "assets/menu/garage_bg.png" },
  { code: "T-026", id: "medallion-discovery", label: "MEDALLION DISCOVERY", view: "garage", mode: "comicSplash", background: "assets/menu/garage_bg.png", redirectTo: "empty-garage" },
  { code: "T-027", id: "ashley-intro", label: "ASHLEY INTRO", view: "garage", mode: "vnScene", background: "assets/menu/garage_bg.png" },
  { code: "T-028", id: "the-forge", label: "THE FORGE", view: "garage", mode: "menuTutorial", background: "assets/forge/forge_bg.png", splash: "assets/tutorial/tutorial-comic-forge.png" },
  { code: "T-029", id: "medallion-unlock", label: "MEDALLION UNLOCK", view: "garage", mode: "menuTutorial" },
  { code: "T-030", id: "unlocked", label: "UNLOCKED", view: "garage", mode: "dialogueOverlay" },
  { code: "T-031", id: "vindex", label: "VINDEX", view: "vindex", mode: "menuTutorial" },
  { code: "T-032", id: "achievements", label: "ACHIEVEMENTS", view: "achievements", mode: "menuTutorial" },
  { code: "T-033", id: "end", label: "END / STORY MODE LAUNCH", view: "menu", mode: "dialogueOverlay" }
];

const tutorialSceneAliases = {
  "dr-controls": "drag-race",
  sprox: "drag-race-win",
  drag2tt: "drag2h2h",
  "time-trial-intro": "head2head-intro",
  "time-trial": "head2head",
  "tt-controls": "head2head",
  "tt-after": "head2head-win",
  tt2battle: "h2h2battle",
  "pre-battle": "battle",
  "post-battle": "battle-win",
  starters: "end",
  "evolution-cinematic": "evolve",
  "evolved-form": "evolve",
  "medallion-discovery": "empty-garage"
};

// Scene-select options shown in Replay Tutorial modal
const tutorialSceneSelectOptions = [
  { label: "Drag Race",   scene: "drag-race-intro" },
  { label: "Head-to-Head",  scene: "head2head-intro" },
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
  { id: "drag25", name: "Drag Prospect", requirement: "Win 25% of Drag Races in Story Mode", reward: "1000 Sprox", type: "storyTypePercent", raceType: "drag", percentTarget: 25, sprox: 1000 },
  { id: "drag50", name: "Drag Contender", requirement: "Win 50% of Drag Races in Story Mode", reward: "5000 Sprox", type: "storyTypePercent", raceType: "drag", percentTarget: 50, sprox: 5000 },
  { id: "allDrags", name: "Drag Dominator", requirement: "Win all Drag Races in Story Mode", reward: "Unlock Vanksy", type: "storyType", raceType: "drag" },
  { id: "trial25", name: "Timer Rookie", requirement: "Win 25% of Time Trials in Story Mode", reward: "1000 Sprox", type: "storyTypePercent", raceType: "trial", percentTarget: 25, sprox: 1000 },
  { id: "trial50", name: "Timer Contender", requirement: "Win 50% of Time Trials in Story Mode", reward: "5000 Sprox", type: "storyTypePercent", raceType: "trial", percentTarget: 50, sprox: 5000 },
  { id: "allTrials", name: "Clock Breaker", requirement: "Win all Time Trials in Story Mode", reward: "Unlock Vanst", type: "storyType", raceType: "trial" },
  { id: "battle25", name: "Arena Rookie", requirement: "Win 25% of Battles in Story Mode", reward: "1000 Sprox", type: "storyTypePercent", raceType: "battle", percentTarget: 25, sprox: 1000 },
  { id: "battle50", name: "Arena Contender", requirement: "Win 50% of Battles in Story Mode", reward: "5000 Sprox", type: "storyTypePercent", raceType: "battle", percentTarget: 50, sprox: 5000 },
  { id: "allBattles", name: "Arena Artist", requirement: "Win all Battles in Story Mode", reward: "Unlock Vandinsky", type: "storyType", raceType: "battle" },
  { id: "allRivals", name: "Friendly Fire", requirement: "Win all Rival Races in Story Mode", reward: "Unlock Vancasso", type: "storyType", raceType: "rival" },
  { id: "allBosses", name: "Boss Canvas", requirement: "Win all Boss Races in Story Mode", reward: "Unlock Vangas", type: "storyType", raceType: "boss" },
  { id: "pinkSlip25", name: "Pink Slip Rookie", requirement: "Win 25% of Pink Slip Races in Story Mode", reward: "1000 Sprox", type: "storyTypePercent", raceType: "pink-slip", percentTarget: 25, sprox: 1000 },
  { id: "pinkSlip50", name: "Pink Slip Contender", requirement: "Win 50% of Pink Slip Races in Story Mode", reward: "5000 Sprox", type: "storyTypePercent", raceType: "pink-slip", percentTarget: 50, sprox: 5000 },
  { id: "allPinkSlips", name: "Pink Slip Collector", requirement: "Win all Pink Slip Races in Story Mode", reward: "Unlock Vandy-Warhaul", type: "storyType", raceType: "pink-slip" },
  { id: "vindex25", name: "VINdex Scout", requirement: "Encounter 25% of the VINdex", reward: "1000 Sprox", type: "vindex", percent: 25 },
  { id: "vindex50", name: "VINdex Scholar", requirement: "Encounter 50% of the VINdex", reward: "Unlock Cuptrack", type: "vindex", percent: 50 },
  { id: "vindex75", name: "VINdex Archivist", requirement: "Encounter 75% of the VINdex", reward: "3 Level 2 parts", type: "vindex", percent: 75 },
  { id: "vindex100", name: "VINdex Master", requirement: "Encounter 100% of the VINdex", reward: "Unlock Vanbrandt", type: "vindex", percent: 100 },
  { id: "garbageMedallion", name: "Garbage Day", requirement: "Lose 5 races or battles in a row", reward: "Garbage Medallion", type: "garbageMedallion", secret: true }
];

// ─── TUTORIAL DIALOGUE ──────────────────────────────────────────────────────
const tutorialDialogue = {
  "intro": [
    {
      "speaker": "tyree",
      "text": "Welcome to Spindell Training Academy."
    },
    {
      "speaker": "tyree",
      "text": "My name is Dr. Tyree."
    },
    {
      "speaker": "tyree",
      "text": "I’ll be conducting your Tuner evaluation today."
    },
    {
      "speaker": "user",
      "text": "Doctor?"
    },
    {
      "speaker": "user",
      "text": "For cars?"
    },
    {
      "speaker": "tyree",
      "text": "GearBorn Mechanics and History, actually."
    },
    {
      "speaker": "tyree",
      "text": "My doctorate is internationally recognized."
    },
    {
      "speaker": "user",
      "text": "So this is one of those “those who can’t do” situations."
    },
    {
      "speaker": "tyree",
      "text": "You haven’t even touched a steering wheel and you’re already trying to get under my skin."
    },
    {
      "speaker": "user",
      "text": "Is it working?"
    },
    {
      "speaker": "tyree",
      "text": "A little."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "I’ve waited my whole life for this.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Good."
            },
            {
              "speaker": "tyree",
              "text": "The Academy was built for people willing to dedicate themselves completely to the bond between Tuner and GearBorn."
            }
          ]
        },
        {
          "label": "No pressure or anything.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Pressure is part of the process."
            },
            {
              "speaker": "tyree",
              "text": "The track reveals who people really are."
            }
          ]
        },
        {
          "label": "If I fail, I’m blaming you.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "What did I do?"
            },
            {
              "speaker": "user",
              "text": "Got a doctorate instead of a license."
            },
            {
              "speaker": "tyree",
              "text": "Touche."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Follow me."
    },
    {
      "speaker": "user",
      "text": "Should I be nervous?"
    },
    {
      "speaker": "tyree",
      "text": "You should take this seriously."
    },
    {
      "speaker": "tyree",
      "text": "Let’s see what you’re capable of."
    }
  ],
  "rival-intro": [
    {
      "speaker": "rival",
      "text": "You’re late."
    },
    {
      "speaker": "user",
      "text": "Ugh, you?!"
    },
    {
      "speaker": "rival",
      "text": "This is becoming your brand."
    },
    {
      "speaker": "tyree",
      "text": "Good. You’re both here."
    },
    {
      "speaker": "user",
      "text": "Tell me we’re not up against each other."
    },
    {
      "speaker": "rival",
      "text": "Nervous?"
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "You nervous?",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "Such quick wit that you just repeat me."
            },
            {
              "speaker": "user",
              "text": "I was also thinking that."
            },
            {
              "speaker": "rival",
              "text": "Sure..."
            }
          ]
        },
        {
          "label": "You still doing that thing where you pretend not to like me?",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "I don’t have to pretend."
            },
            {
              "speaker": "user",
              "text": "Convincing…"
            }
          ]
        },
        {
          "label": "I’m definitely beating you.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "You said that last time too."
            },
            {
              "speaker": "user",
              "text": "And statistically, eventually I’ll be right."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Today’s evaluation determines whether you qualify for Academy recommendation."
    },
    {
      "speaker": "user",
      "text": "Does he/she (if rival is Mylo, he; if rival is Cha Cha, she) get a head start to be fair?"
    },
    {
      "speaker": "rival",
      "text": "Do you get extra time like you do on tests?"
    },
    {
      "speaker": "tyree",
      "text": "Focus."
    },
    {
      "speaker": "tyree",
      "text": "You two are exhausting. Let’s go."
    }
  ],
  "mamburn": [
    {
      "speaker": "tyree",
      "text": "Normally, first-year evaluations are done using Academy Tutorques."
    },
    {
      "speaker": "user",
      "text": "“Normally” sounds promising."
    },
    {
      "speaker": "tyree",
      "text": "Unfortunately for you, they’re all currently assigned to upperclass evaluations."
    },
    {
      "speaker": "tyree",
      "text": "So today..."
    },
    {
      "speaker": "tyree",
      "text": "You’ll be borrowing my GearBorn."
    },
    {
      "speaker": "user",
      "text": "Wait."
    },
    {
      "speaker": "user",
      "text": "THIS is yours?"
    },
    {
      "speaker": "tyree",
      "text": "Her name is Mamburn."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "Okay, that’s actually awesome.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Mamburn appreciates your refined taste."
            }
          ]
        },
        {
          "label": "You drive THIS? Theoretically or actually?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Most theories need testing."
            }
          ]
        },
        {
          "label": "Can I keep it if I win?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Absolutely not."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "GearBorn aren’t ordinary vehicles."
    },
    {
      "speaker": "tyree",
      "text": "A Tuner communicates with them through a GearBorn Key."
    },
    {
      "speaker": "user",
      "text": "So what happens if I press the wrong button?"
    },
    {
      "speaker": "tyree",
      "text": "This is where I tell you: if you crash my Mamburn, I’ll kill you."
    },
    {
      "speaker": "user",
      "text": "That’s the coolest thing you’ve said all day."
    },
    {
      "speaker": "tyree",
      "text": "This key is synchronized specifically to Mamburn."
    },
    {
      "speaker": "tyree",
      "text": "Treat her like your own."
    },
    {
      "speaker": "user",
      "text": "You really love this thing, huh?"
    },
    {
      "speaker": "tyree",
      "text": "More than most people deserve."
    },
    {
      "speaker": "tyree",
      "text": "You asked."
    },
    {
      "speaker": "key",
      "text": "Dr. Tyree lent you his GearBorn Key."
    },
    {
      "speaker": "user",
      "text": "Sick."
    }
  ],
  "city-map": [
    {
      "speaker": "tyree",
      "text": "Every Tuner starts somewhere."
    },
    {
      "speaker": "tyree",
      "text": "But the best eventually race everywhere."
    },
    {
      "speaker": "user",
      "text": "Wait..."
    },
    {
      "speaker": "user",
      "text": "Am I going to need a passport?"
    },
    {
      "speaker": "tyree",
      "text": "Yes. Do you have one?"
    },
    {
      "speaker": "user",
      "text": "Uh… Totally!"
    },
    {
      "speaker": "tyree",
      "text": "Different cities specialize in different race styles."
    },
    {
      "speaker": "tyree",
      "text": "Different GearBorn. Different styles."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "I’m starting in Dubai. You guys pay for the flights, right?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Make the circuit first and then we can talk logistics."
            }
          ]
        },
        {
          "label": "How many of these have you raced in?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "That information is classified."
            },
            {
              "speaker": "user",
              "text": "So... none."
            }
          ]
        },
        {
          "label": "Which one has the best food?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Not relevant."
            },
            {
              "speaker": "tyree",
              "text": "But Cape Town."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Drag Races test acceleration and shifting precision."
    },
    {
      "speaker": "tyree",
      "text": "Head-to-Head races test consistency against other Tuners."
    },
    {
      "speaker": "tyree",
      "text": "Battle Arenas test your GearBorn’s combat abilities."
    },
    {
      "speaker": "user",
      "text": "Still can’t believe they fight."
    },
    {
      "speaker": "tyree",
      "text": "Boss Challenges are reserved for elite Tuners."
    },
    {
      "speaker": "user",
      "text": "So basically… become the greatest Tuner in the world."
    },
    {
      "speaker": "tyree",
      "text": "Technically, yes."
    },
    {
      "speaker": "user",
      "text": "Sick."
    }
  ],
  "drag-race-intro": [
    {
      "speaker": "user",
      "text": "And today I’ll be humiliating…"
    },
    {
      "speaker": "user",
      "text": "Tutorque?"
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "user",
      "text": "That thing?"
    },
    {
      "speaker": "rival",
      "text": "Tutorque has probably logged more track hours than you have walking hours."
    },
    {
      "speaker": "user",
      "text": "That’s a weird way to say “this thing is hella old.”"
    },
    {
      "speaker": "tyree",
      "text": "Drag Races are straightforward."
    },
    {
      "speaker": "tyree",
      "text": "Two Tuners. One straight track. Fastest finish wins."
    },
    {
      "speaker": "user",
      "text": "Finally. Something easy."
    },
    {
      "speaker": "rival",
      "text": "You haven’t started yet."
    },
    {
      "speaker": "user",
      "text": "Still undefeated."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "I was born for this.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "We’ll circle back to that confidence thing later."
            }
          ]
        },
        {
          "label": "If I lose to a Tutorque, I’m leaving the country.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "That may honestly be your best option."
            }
          ]
        },
        {
          "label": "Can I race the rival instead?",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "Beat Tutorque first."
            },
            {
              "speaker": "tutorque",
              "text": "HONK."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "The race distance today will be 400 meters."
    },
    {
      "speaker": "tyree",
      "text": "Short enough to teach fundamentals."
    },
    {
      "speaker": "rival",
      "text": "And long enough for mistakes to matter."
    },
    {
      "speaker": "user",
      "text": "Why are you looking at me?"
    },
    {
      "speaker": "mamburn",
      "text": "VRROOOOOOOM!"
    },
    {
      "speaker": "user",
      "text": "See? She gets me."
    },
    {
      "speaker": "tyree",
      "text": "Enough."
    },
    {
      "speaker": "tyree",
      "text": "Let’s get you both on the track."
    }
  ],
  "drag-race": [
    {
      "speaker": "tyree",
      "text": "Once the race begins, watch the shift meter carefully."
    },
    {
      "speaker": "tyree",
      "text": "Press SPACE when the indicator reaches the shift zone to change gears."
    },
    {
      "speaker": "tyree",
      "text": "After 4 Perfect Shifts, you’ll be able to use your nitrous."
    },
    {
      "speaker": "user",
      "text": "Hit the NOS. Got it."
    },
    {
      "speaker": "tyree",
      "text": "Has (he/she - if Mylo, he; if Cha Cha, she) always been like this?"
    },
    {
      "speaker": "rival",
      "text": "Unfortunately."
    },
    {
      "speaker": "tyree",
      "text": "Miss too many shifts and your engine overheats."
    },
    {
      "speaker": "user",
      "text": "So don’t explode the car. Got it."
    },
    {
      "speaker": "tyree",
      "text": "No."
    },
    {
      "speaker": "tyree",
      "text": "But I will judge you."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "I’m about to smoke this mailbox.",
          "responseLines": [
            {
              "speaker": "tutorque",
              "text": "HONK."
            },
            {
              "speaker": "rival",
              "text": "Tutorque took that personally."
            }
          ]
        },
        {
          "label": "Tutorque’s looking nervous.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "Tutorque could kick your butt."
            },
            {
              "speaker": "user",
              "text": "With the training wheels?"
            }
          ]
        },
        {
          "label": "Wait, which pedal is brake again?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Suddenly, I regret everything."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Positions."
    },
    {
      "speaker": "tutorque",
      "text": "HONK!"
    },
    {
      "speaker": "mamburn",
      "text": "VROOOOM!"
    },
    {
      "speaker": "tyree",
      "text": "Ready?"
    },
    {
      "speaker": "tyree",
      "text": "Race start in…"
    }
  ],
  "drag-race-win": [
    {
      "speaker": "tyree",
      "text": "Nicely done, (User’s name)."
    },
    {
      "speaker": "tyree",
      "text": "Your shifting needs work. Your launch timing needs work. But you won."
    },
    {
      "speaker": "user",
      "text": "You say compliments like they physically hurt you."
    },
    {
      "speaker": "rival",
      "text": "Don’t let it go to your head."
    },
    {
      "speaker": "user",
      "text": "Why? It looks good up there."
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "user",
      "text": "Even Tutorque respects me now."
    },
    {
      "speaker": "rival",
      "text": "That is not what that meant."
    },
    {
      "speaker": "tyree",
      "text": "Winning races earns you Sprox."
    },
    {
      "speaker": "tyree",
      "text": "Sprox can be used for upgrades, modifications, and progression throughout the Academy circuit."
    },
    {
      "speaker": "tyree",
      "text": "Raw speed won’t carry you far."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "You worried I’m actually good at this?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "I’m worried you think one race proves anything."
            }
          ]
        },
        {
          "label": "I barely even tried.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "Trust me. We could tell."
            }
          ]
        },
        {
          "label": "So when do I become world famous?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Judging by your driving? Several years minimum."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Let’s move on."
    },
    {
      "speaker": "tyree",
      "text": "Real Tuners need more than straight-line speed."
    },
    {
      "speaker": "tyree",
      "text": "Back to the map."
    }
  ],
  "rival-stinger": [
    {
      "speaker": "rival",
      "text": "Don’t get comfortable."
    },
    {
      "speaker": "rival",
      "text": "You won one training race."
    },
    {
      "speaker": "user",
      "text": "Undefeated is undefeated."
    },
    {
      "speaker": "tutorque",
      "text": "honk. honk."
    },
    {
      "speaker": "user",
      "text": "Did it sound like it just honked in lower case?"
    },
    {
      "speaker": "rival",
      "text": "He’s saying you shouldn’t be so arrogant."
    },
    {
      "speaker": "user",
      "text": "You understand it?"
    },
    {
      "speaker": "rival",
      "text": "No. I’ve just met you before."
    },
    {
      "speaker": "tyree",
      "text": "Enough talking."
    },
    {
      "speaker": "tyree",
      "text": "Next evaluation. Move."
    }
  ],
  "drag2h2h": [
    {
      "speaker": "tyree",
      "text": "Winning races also increases your reputation."
    },
    {
      "speaker": "user",
      "text": "My reputation already feels incredible."
    },
    {
      "speaker": "rival",
      "text": "World’s most famous idiot."
    },
    {
      "speaker": "tyree",
      "text": "Reputation unlocks new races, cities, and Boss Challenges."
    },
    {
      "speaker": "tyree",
      "text": "Which brings us to your next challenge."
    },
    {
      "speaker": "user",
      "text": "Please say explosions."
    },
    {
      "speaker": "tyree",
      "text": "Head-to-Head racing."
    },
    {
      "speaker": "rival",
      "text": "(User’s name) is good with straight lines, but I think (he/she) struggles with turning."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "You sure you wanna lose in front of Tyree?",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "You are dangerously committed to this bit."
            }
          ]
        },
        {
          "label": "If I win, I’m taking your parking spot.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "I don’t even have a parking spot."
            }
          ]
        },
        {
          "label": "Friendly reminder that I’m still undefeated.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "Against a Tutorque."
            },
            {
              "speaker": "user",
              "text": "Oh, so it’s the car’s fault. Wow. See what she thinks of you, Tutey?"
            },
            {
              "speaker": "tutorque",
              "text": "HONK!"
            },
            {
              "speaker": "user",
              "text": "Yep, that’s exactly what I was saying."
            },
            {
              "speaker": "rival",
              "text": "Don’t act like you understand it now. That’s my bit."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Head-to-Head races test consistency, positioning, and adaptability under pressure."
    },
    {
      "speaker": "user",
      "text": "So this one’s personal."
    },
    {
      "speaker": "rival",
      "text": "It was always personal."
    },
    {
      "speaker": "tyree",
      "text": "Let’s begin."
    }
  ],
  "head2head-intro": [
    {
      "speaker": "tyree",
      "text": "Unlike Drag Races, Head-to-Head races take place on full tracks with turns, obstacles, and changing conditions."
    },
    {
      "speaker": "user",
      "text": "Finally."
    },
    {
      "speaker": "user",
      "text": "Actual driving."
    },
    {
      "speaker": "rival",
      "text": "Bold thing to say before your first corner."
    },
    {
      "speaker": "tyree",
      "text": "You’ll be racing directly against your rival today."
    },
    {
      "speaker": "user",
      "text": "Oh, I got that part."
    },
    {
      "speaker": "tyree",
      "text": "Stay focused."
    },
    {
      "speaker": "tyree",
      "text": "During the race, watch your speed entering corners."
    },
    {
      "speaker": "tyree",
      "text": "A clean line beats raw speed."
    },
    {
      "speaker": "tyree",
      "text": "Head-to-Head evaluation begins now."
    }
  ],
  "head2head": [
    {
      "speaker": "tyree",
      "text": "Use WASD to steer."
    },
    {
      "speaker": "tyree",
      "text": "Items activate with SPACE."
    },
    {
      "speaker": "user",
      "text": "Items? Like what?"
    },
    {
      "speaker": "tyree",
      "text": "Teleport."
    },
    {
      "speaker": "user",
      "text": "Teleport? Seriously?"
    },
    {
      "speaker": "rival",
      "text": "Okay, I’m with (him/her). Seriously?"
    },
    {
      "speaker": "tyree",
      "text": "Seriously."
    },
    {
      "speaker": "rival",
      "text": "Sick."
    },
    {
      "speaker": "user",
      "text": "Are we best friends now?"
    },
    {
      "speaker": "rival",
      "text": "Shut up."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "Good thing I don’t make mistakes.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "We literally watched you hit a cone ten seconds ago."
            }
          ]
        },
        {
          "label": "I’m mostly worried about embarrassing the rival.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "Your concern is touching."
            }
          ]
        },
        {
          "label": "So bumping’s legal?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Officially? No."
            },
            {
              "speaker": "user",
              "text": "Great. So it’s just a suggestion."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Positions."
    },
    {
      "speaker": "tyree",
      "text": "Race starts in…"
    }
  ],
  "head2head-win": [
    {
      "speaker": "tyree",
      "text": "Hm."
    },
    {
      "speaker": "user",
      "text": "Hm?? That’s all I get?"
    },
    {
      "speaker": "rival",
      "text": "You deserve more?"
    },
    {
      "speaker": "user",
      "text": "Scoreboard."
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "user",
      "text": "Thank you. I agree, Tutes."
    },
    {
      "speaker": "tyree",
      "text": "Your instincts are... unusual."
    },
    {
      "speaker": "user",
      "text": "Good unusual?"
    },
    {
      "speaker": "tyree",
      "text": "Undetermined."
    },
    {
      "speaker": "rival",
      "text": "That means bad."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "Admit it. You’re impressed.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "I’m evaluating you."
            },
            {
              "speaker": "user",
              "text": "That’s not a no."
            }
          ]
        },
        {
          "label": "So when do I get my championship trophy?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Survive the academy first."
            }
          ]
        },
        {
          "label": "(Rival’s name) almost had me for a second there.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "I had cleaner lines. You just got lucky."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "One final evaluation remains."
    },
    {
      "speaker": "user",
      "text": "Finally."
    },
    {
      "speaker": "user",
      "text": "Battle Mode?"
    },
    {
      "speaker": "tyree",
      "text": "Battle Mode."
    },
    {
      "speaker": "user",
      "text": "YES."
    },
    {
      "speaker": "rival",
      "text": "You are way too excited about this."
    }
  ],
  "h2h-rival-stinger": [
    {
      "speaker": "rival",
      "text": "Okay."
    },
    {
      "speaker": "rival",
      "text": "That was better than I expected."
    },
    {
      "speaker": "user",
      "text": "Wow."
    },
    {
      "speaker": "user",
      "text": "Was that almost a compliment?"
    },
    {
      "speaker": "rival",
      "text": "Don’t make it weird."
    },
    {
      "speaker": "user",
      "text": "Too late."
    },
    {
      "speaker": "tutorque",
      "text": "..."
    },
    {
      "speaker": "user",
      "text": "Seriously, what’s with the staring?"
    },
    {
      "speaker": "rival",
      "text": "Tutorque doesn’t usually watch first-years this closely."
    },
    {
      "speaker": "user",
      "text": "Maybe it recognizes greatness."
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "rival",
      "text": "Or chaos."
    },
    {
      "speaker": "user",
      "text": "That one sounded supportive."
    },
    {
      "speaker": "rival",
      "text": "It absolutely did not."
    },
    {
      "speaker": "tyree",
      "text": "Enough."
    },
    {
      "speaker": "tyree",
      "text": "The final evaluation is waiting."
    }
  ],
  "h2h2battle": [
    {
      "speaker": "tyree",
      "text": "Racing tests a Tuner’s driving ability."
    },
    {
      "speaker": "tyree",
      "text": "Battle Arenas test the bond between Tuner and GearBorn directly."
    },
    {
      "speaker": "user",
      "text": "So this is where things get dangerous."
    },
    {
      "speaker": "tyree",
      "text": "Potentially."
    },
    {
      "speaker": "user",
      "text": "Nice."
    },
    {
      "speaker": "rival",
      "text": "Why are you excited by that?"
    },
    {
      "speaker": "user",
      "text": "I don’t know."
    },
    {
      "speaker": "user",
      "text": "Feels important."
    },
    {
      "speaker": "tyree",
      "text": "Every GearBorn has unique abilities tied to Powertrain."
    },
    {
      "speaker": "tyree",
      "text": "Strong Tuners synchronize those abilities with instinct."
    },
    {
      "speaker": "user",
      "text": "You make it sound weirdly spiritual."
    },
    {
      "speaker": "tyree",
      "text": "For some Tuners, it is."
    },
    {
      "speaker": "user",
      "text": "This keeps getting cooler."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "I’m about to destroy Tutorque.",
          "responseLines": [
            {
              "speaker": "tutorque",
              "text": "HONK."
            },
            {
              "speaker": "rival",
              "text": "That sounded offended."
            }
          ]
        },
        {
          "label": "Are battles actually Academy-approved?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Officially, yes."
            },
            {
              "speaker": "user",
              "text": "Seems fishy, but I’m not asking more questions."
            }
          ]
        },
        {
          "label": "If I lose, I blame game balance.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "Excuses before the battle is bold."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "The Battle Arena is ahead."
    },
    {
      "speaker": "rival",
      "text": "Try not to embarrass yourself."
    },
    {
      "speaker": "user",
      "text": "When do I not embarrass myself?"
    }
  ],
  "battle-intro": [
    {
      "speaker": "user",
      "text": "Another one of these? Can we just skip to the battle?"
    },
    {
      "speaker": "tyree",
      "text": "I had a whole speech about…"
    },
    {
      "speaker": "user",
      "text": "The battle?"
    },
    {
      "speaker": "tyree",
      "text": "There’s important-"
    },
    {
      "speaker": "rival",
      "text": "Battle?"
    },
    {
      "speaker": "tyree",
      "text": "I liked it better when you couldn’t agree on anything."
    },
    {
      "speaker": "tyree",
      "text": "Let’s go."
    }
  ],
  "battle": [
    {
      "speaker": "user",
      "text": "So the cars actually fight."
    },
    {
      "speaker": "tyree",
      "text": "Correct."
    },
    {
      "speaker": "user",
      "text": "And everyone just accepted that?"
    },
    {
      "speaker": "rival",
      "text": "You accepted it instantly."
    },
    {
      "speaker": "user",
      "text": "Because it rules."
    },
    {
      "speaker": "tyree",
      "text": "Attack deals damage."
    },
    {
      "speaker": "tyree",
      "text": "Defend reduces damage and can stun attackers."
    },
    {
      "speaker": "user",
      "text": "So defending’s overpowered."
    },
    {
      "speaker": "tyree",
      "text": "Defending still takes damage."
    },
    {
      "speaker": "rival",
      "text": "You are absolutely the type to button mash."
    },
    {
      "speaker": "user",
      "text": "Strategy through aggression."
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "user",
      "text": "See? Tutorque gets it."
    },
    {
      "speaker": "rival",
      "text": "I genuinely don’t think it does."
    },
    {
      "speaker": "tyree",
      "text": "Specials cannot be defended."
    },
    {
      "speaker": "tyree",
      "text": "Try to attack or you’ll just take a full hit."
    },
    {
      "speaker": "user",
      "text": "Joke’s on you. It’s your car."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "I’m winning this first turn.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "Confidence before a strategy. Bold approach."
            }
          ]
        },
        {
          "label": "Tutorque looks nervous.",
          "responseLines": [
            {
              "speaker": "tutorque",
              "text": "HONK."
            },
            {
              "speaker": "tyree",
              "text": "You really need to show some respect."
            }
          ]
        },
        {
          "label": "Wait, can GearBorn trash talk each other?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Not verbally."
            },
            {
              "speaker": "user",
              "text": "So emotionally."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Battle begins now."
    }
  ],
  "battle-win": [
    {
      "speaker": "tyree",
      "text": "..."
    },
    {
      "speaker": "user",
      "text": "You’re doing the hmm thing again."
    },
    {
      "speaker": "tyree",
      "text": "I’m thinking."
    },
    {
      "speaker": "user",
      "text": "About how incredible I am?"
    },
    {
      "speaker": "rival",
      "text": "That seems unlikely."
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "tyree",
      "text": "Your synchronization with Mamburn improved dramatically during that battle."
    },
    {
      "speaker": "user",
      "text": "True. What does that mean?"
    },
    {
      "speaker": "tyree",
      "text": "GearBorn respond differently depending on the Tuner."
    },
    {
      "speaker": "tyree",
      "text": "Timing. Emotion. Instinct. Compatibility."
    },
    {
      "speaker": "user",
      "text": "So Mamburn likes me more than you."
    },
    {
      "speaker": "tyree",
      "text": "Let’s not get carried away."
    },
    {
      "speaker": "rival",
      "text": "Please get less carried away, actually."
    },
    {
      "speaker": "tyree",
      "text": "Still..."
    },
    {
      "speaker": "tyree",
      "text": "Your battle instincts are unusually strong for a first-year."
    },
    {
      "speaker": "user",
      "text": "You keep saying unusual like you’re deciding whether to call security."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "Admit it. I crushed that.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Your confidence continues to outpace your experience."
            }
          ]
        },
        {
          "label": "Wait until you see me with my own GearBorn.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Let’s survive the evaluation first."
            }
          ]
        },
        {
          "label": "Tutorque definitely likes me now.",
          "responseLines": [
            {
              "speaker": "tutorque",
              "text": "HONK."
            },
            {
              "speaker": "tyree",
              "text": "Yes, I totally agree."
            },
            {
              "speaker": "user",
              "text": "Wait, do you understand him?"
            }
          ]
        }
      ]
    },
    {
      "speaker": "user",
      "text": "Are we done yet?"
    },
    {
      "speaker": "user",
      "text": "I can keep winning all day, but the fans are waiting."
    },
    {
      "speaker": "tyree",
      "text": "Let’s head back to the map."
    },
    {
      "speaker": "user",
      "text": "Oh, you’ve got to be kidding me."
    }
  ],
  "map-final": [
    {
      "speaker": "tyree",
      "text": "As your reputation grows, more race types unlock."
    },
    {
      "speaker": "tyree",
      "text": "Including Boss Challenges."
    },
    {
      "speaker": "user",
      "text": "Wait… Do I get to race you now?"
    },
    {
      "speaker": "tyree",
      "text": "This is just an example."
    },
    {
      "speaker": "user",
      "text": "You’re kidding me."
    },
    {
      "speaker": "tyree",
      "text": "Medallion Gauntlets and Pink Slip races can unlock new GearBorn medallions."
    },
    {
      "speaker": "user",
      "text": "Cool."
    },
    {
      "speaker": "tyree",
      "text": "In Pink Slips, lose the race and you lose your car."
    },
    {
      "speaker": "user",
      "text": "Cool… cool, cool, cool."
    },
    {
      "speaker": "tyree",
      "text": "Most Tuners spend years earning a Boss Challenge."
    },
    {
      "speaker": "user",
      "text": "Give me two weeks."
    },
    {
      "speaker": "rival",
      "text": "You really don’t know when to stop talking."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "I’m beating all of them.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Ambition is easy."
            },
            {
              "speaker": "tyree",
              "text": "Consistency is difficult."
            }
          ]
        },
        {
          "label": "Which Boss is the strongest?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Depends who you ask."
            },
            {
              "speaker": "rival",
              "text": "And whether they survived the race."
            }
          ]
        },
        {
          "label": "Do any of them have normal hobbies?",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "What like pottery?"
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "Let’s head to the garage."
    },
    {
      "speaker": "user",
      "text": "Finally."
    },
    {
      "speaker": "user",
      "text": "I’ve been waiting for the cool customization stuff."
    }
  ],
  "garage": [
    {
      "speaker": "user",
      "text": "Okay."
    },
    {
      "speaker": "user",
      "text": "Now THIS is sick."
    },
    {
      "speaker": "tyree",
      "text": "This is the Garage."
    },
    {
      "speaker": "tyree",
      "text": "Every GearBorn you unlock, upgrade, and evolve will be stored here."
    },
    {
      "speaker": "user",
      "text": "So this becomes, like... my collection?"
    },
    {
      "speaker": "tyree",
      "text": "Your responsibility."
    },
    {
      "speaker": "user",
      "text": "Way less fun wording."
    },
    {
      "speaker": "rival",
      "text": "Same meaning, though."
    },
    {
      "speaker": "tyree",
      "text": "Every GearBorn has six core attributes:"
    },
    {
      "speaker": "tyree",
      "text": "SPEED, ACCELERATION, HANDLING, TORQUE, BODY, and POWERTRAIN."
    },
    {
      "speaker": "tyree",
      "text": "SPEED affects top speed."
    },
    {
      "speaker": "tyree",
      "text": "ACCELERATION affects how quickly a GearBorn gets there."
    },
    {
      "speaker": "tyree",
      "text": "HANDLING affects turning and stability."
    },
    {
      "speaker": "tyree",
      "text": "TORQUE improves shifting performance."
    },
    {
      "speaker": "user",
      "text": "Sick."
    },
    {
      "speaker": "tyree",
      "text": "BODY affects durability."
    },
    {
      "speaker": "user",
      "text": "Less sick."
    },
    {
      "speaker": "tyree",
      "text": "POWERTRAIN governs unique abilities."
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "user",
      "text": "Gesundheit."
    }
  ],
  "upgrade": [
    {
      "speaker": "tyree",
      "text": "Upgrading permanently improves a GearBorn’s performance."
    },
    {
      "speaker": "tyree",
      "text": "Higher levels improve every attribute."
    },
    {
      "speaker": "user",
      "text": "Jeez, these prices are insane."
    },
    {
      "speaker": "tyree",
      "text": "Mamburn’s already Level 9, so upgrades get expensive fast."
    },
    {
      "speaker": "user",
      "text": "I can’t afford that."
    },
    {
      "speaker": "tyree",
      "text": "It’s okay. I’ll cover the rest. It’s my car."
    },
    {
      "speaker": "user",
      "text": "Dang, I was hoping you’d forget that."
    },
    {
      "speaker": "user",
      "text": "Ooo. Big numbers."
    },
    {
      "speaker": "tyree",
      "text": "Click LEVEL UP."
    },
    {
      "speaker": "user",
      "text": "Was that supposed to happen?"
    },
    {
      "speaker": "rival",
      "text": "You already broke it."
    },
    {
      "speaker": "tyree",
      "text": "You’re gonna like this part."
    },
    {
      "speaker": "tyree",
      "text": "Click EVOLVE."
    }
  ],
  "evolve": [
    {
      "speaker": "user",
      "text": "Uh..."
    },
    {
      "speaker": "user",
      "text": "Was it supposed to do that?"
    },
    {
      "speaker": "tyree",
      "text": "Hmm…"
    },
    {
      "speaker": "user",
      "text": "Stop “hmm”-ing and explain!"
    },
    {
      "speaker": "snaytan",
      "text": "VROOOOOOM."
    },
    {
      "speaker": "tyree",
      "text": "You triggered Mamburn’s evolution."
    },
    {
      "speaker": "tyree",
      "text": "She’s now Snaytan."
    },
    {
      "speaker": "user",
      "text": "How did YOU end up with an even cooler car?"
    },
    {
      "speaker": "tyree",
      "text": "Those who can’t do…"
    },
    {
      "speaker": "tyree",
      "text": "Get someone to do it for them."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "You’re welcome, by the way.",
          "responseLines": [
            {
              "speaker": "rival",
              "text": "He paid for most of it!"
            }
          ]
        },
        {
          "label": "Can I call you Dr. Snakes?",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "No."
            }
          ]
        },
        {
          "label": "I’m kind of attached now.",
          "responseLines": [
            {
              "speaker": "tyree",
              "text": "Don’t start trying to convince me."
            }
          ]
        }
      ]
    },
    {
      "speaker": "tyree",
      "text": "There is... one final matter."
    },
    {
      "speaker": "user",
      "text": "Oh no."
    }
  ],
  "tyree-final": [
    {
      "speaker": "tyree",
      "text": "Your evaluation is complete."
    },
    {
      "speaker": "user",
      "text": "Cool."
    },
    {
      "speaker": "user",
      "text": "So where’s the “congratulations future Tuner” speech?"
    },
    {
      "speaker": "tyree",
      "text": "I’m sorry, but I can’t pass you."
    },
    {
      "speaker": "user",
      "text": "What?"
    },
    {
      "speaker": "rival",
      "text": "Wait, that’s not right…"
    },
    {
      "speaker": "user",
      "text": "I won all of the races."
    },
    {
      "speaker": "user",
      "text": "Mamburn literally evolved."
    },
    {
      "speaker": "tyree",
      "text": "This evaluation measures more than results."
    },
    {
      "speaker": "user",
      "text": "Then what was the point of any of this?"
    },
    {
      "speaker": "tyree",
      "text": "(Rival’s name) needed a competitive benchmark for Academy recommendation."
    },
    {
      "speaker": "user",
      "text": "..."
    },
    {
      "speaker": "user",
      "text": "So I was just practice?"
    },
    {
      "speaker": "rival",
      "text": "That’s not-"
    },
    {
      "speaker": "tyree",
      "text": "You demonstrated strong instincts."
    },
    {
      "speaker": "tyree",
      "text": "But instinct alone isn’t enough.But instincts alone are not enough to become a Tuner."
    },
    {
      "speaker": "user",
      "text": "You said bonding mattered."
    },
    {
      "speaker": "tyree",
      "text": "It does."
    },
    {
      "speaker": "user",
      "text": "Then what am I missing?"
    },
    {
      "speaker": "tyree",
      "text": "Control."
    },
    {
      "speaker": "tyree",
      "text": "You may apply again next year."
    },
    {
      "speaker": "user",
      "text": "Next year?!"
    },
    {
      "speaker": "user",
      "text": "Are you serious?!"
    },
    {
      "speaker": "rival",
      "text": "..."
    },
    {
      "speaker": "user",
      "text": "Say something."
    },
    {
      "speaker": "rival",
      "text": "I didn’t know this was how they were scoring it."
    },
    {
      "speaker": "user",
      "text": "Right."
    },
    {
      "speaker": "user",
      "text": "Apparently everybody knew except me."
    },
    {
      "speaker": "tyree",
      "text": "Please return the key."
    },
    {
      "speaker": "user",
      "text": "Oh… yeah…"
    },
    {
      "speaker": "key",
      "text": "Dr. Tyree takes back his GearBorn Key."
    },
    {
      "speaker": "tyree",
      "text": "Mamburn performed exceptionally today."
    },
    {
      "speaker": "user",
      "text": "Glad somebody passed."
    },
    {
      "speaker": "tyree",
      "text": "I’m so sorry (User’s name)."
    }
  ],
  "empty-garage": [
    {
      "speaker": "user",
      "text": "..."
    },
    {
      "speaker": "user",
      "text": "Cool."
    },
    {
      "speaker": "user",
      "text": "Apply again next year."
    },
    {
      "speaker": "user",
      "text": "Sick."
    },
    {
      "speaker": "user",
      "text": "..."
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "user",
      "text": "Oh."
    },
    {
      "speaker": "user",
      "text": "You came back to laugh at me too?"
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "user",
      "text": "What are you doing?"
    },
    {
      "speaker": "user",
      "text": "What are those?"
    },
    {
      "speaker": "tutorque",
      "text": "HONK."
    },
    {
      "speaker": "user",
      "text": "I really wish I understood those honks."
    },
    {
      "speaker": "narration",
      "text": "TUTORIAL_PLACEHOLDER_MEDALLIONS_ACQUIRED"
    },
    {
      "speaker": "user",
      "text": "What the heck are these?"
    }
  ],
  "ashley-intro": [
    {
      "speaker": "ashley",
      "text": "Quick, Astro. They’re gone."
    },
    {
      "speaker": "ashley",
      "text": "Who are you? This place is supposed to be empty."
    },
    {
      "speaker": "user",
      "text": "I’m leaving. Sorry."
    },
    {
      "speaker": "ashley",
      "text": "Wait, did you just take Tyree’s evaluation?"
    },
    {
      "speaker": "user",
      "text": "Took it. Failed it."
    },
    {
      "speaker": "ashley",
      "text": "Then how’d you get those medallions?"
    },
    {
      "speaker": "user",
      "text": "These? Tutorque just left them."
    },
    {
      "speaker": "ashley",
      "text": "Just left them? Like it gave them to you?"
    },
    {
      "speaker": "user",
      "text": "Yeah, it kind of just plopped them down."
    },
    {
      "speaker": "ashley",
      "text": "Who the heck are you, kid?"
    },
    {
      "speaker": "user",
      "text": "(User’s name)."
    },
    {
      "speaker": "ashley",
      "text": "(User’s name), I don’t think you understand what just happened."
    },
    {
      "speaker": "user",
      "text": "Who are you?"
    },
    {
      "speaker": "ashley",
      "text": "Ashley Racem. Basically, the Spindell Academy’s worst enemy."
    },
    {
      "speaker": "ashley",
      "text": "Tutorques don’t hand out medallions unless they recognize a bond."
    },
    {
      "speaker": "user",
      "text": "A bond?"
    },
    {
      "speaker": "ashley",
      "text": "Real synchronization."
    },
    {
      "speaker": "ashley",
      "text": "Not keys. Not rankings. Not Academy approval."
    },
    {
      "speaker": "ashley",
      "text": "Actual connection."
    },
    {
      "speaker": "user",
      "text": "So Tyree was wrong?"
    },
    {
      "speaker": "ashley",
      "text": "Tyree sees the world through rules."
    },
    {
      "speaker": "ashley",
      "text": "GearBorn don’t always care about rules."
    },
    {
      "speaker": "ashley",
      "text": "Come on."
    },
    {
      "speaker": "user",
      "text": "Where are we going?"
    },
    {
      "speaker": "ashley",
      "text": "Somewhere the Academy really wouldn’t want you seeing."
    },
    {
      "speaker": "user",
      "text": "That is the coolest possible answer you could’ve given."
    },
    {
      "speaker": "ashley",
      "text": "Yeah."
    },
    {
      "speaker": "ashley",
      "text": "I get that a lot."
    }
  ],
  "the-forge": [
    {
      "speaker": "user",
      "text": "Okay."
    },
    {
      "speaker": "user",
      "text": "THIS is insane."
    },
    {
      "speaker": "ashley",
      "text": "Welcome to the Forge."
    },
    {
      "speaker": "user",
      "text": "This place looks illegal."
    },
    {
      "speaker": "ashley",
      "text": "That’s because it mostly is."
    },
    {
      "speaker": "user",
      "text": "What even IS this?"
    },
    {
      "speaker": "ashley",
      "text": "Before the Academy turned medallions into rankings and gatekeeping..."
    },
    {
      "speaker": "ashley",
      "text": "The Forge was how Tuners bonded with GearBorn."
    },
    {
      "speaker": "user",
      "text": "And this still works?"
    },
    {
      "speaker": "ashley",
      "text": "Better than the Academy does."
    },
    {
      "speaker": "ashley",
      "text": "The medallions Tutorque gave you contain dormant GearBorn bonds."
    },
    {
      "speaker": "ashley",
      "text": "The Forge awakens them."
    },
    {
      "speaker": "user",
      "text": "So I’m basically hatching a car."
    },
    {
      "speaker": "ashley",
      "text": "That is the least magical way you could’ve phrased that."
    },
    {
      "speaker": "ashley",
      "text": "Pick one. Let’s see who answered you."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "What if I pick wrong?",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "Then they wouldn’t have answered you."
            }
          ]
        },
        {
          "label": "Can I unlock all of them?",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "Now you’re thinking like a Tuner."
            }
          ]
        },
        {
          "label": "This still feels extremely illegal.",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "Illegal’s mostly just a confidence thing."
            }
          ]
        }
      ]
    },
    {
      "speaker": "ashley",
      "text": "Go ahead."
    },
    {
      "speaker": "ashley",
      "text": "Place the medallion into the Forge."
    }
  ],
  "medallion-unlock": [
    {
      "speaker": "user",
      "text": "Okay."
    },
    {
      "speaker": "user",
      "text": "That was WAY cooler than the Academy."
    },
    {
      "speaker": "ashley",
      "text": "I wish Tyree was here to hear you say that."
    },
    {
      "speaker": "user",
      "text": "I absolutely want Tyree to hear me say that."
    },
    {
      "speaker": "ashley",
      "text": "Your first real GearBorn answered your call."
    }
  ],
  "unlocked": [
    {
      "speaker": "user",
      "text": "No way."
    },
    {
      "speaker": "user",
      "text": "That one’s mine?"
    },
    {
      "speaker": "ashley",
      "text": "Yours if you earn the bond."
    },
    {
      "speaker": "ashley",
      "text": "GearBorn choose who they trust."
    },
    {
      "speaker": "user",
      "text": "Okay, that’s still taking me a second to process."
    },
    {
      "speaker": "ashley",
      "text": "Get used to it."
    },
    {
      "speaker": "ashley",
      "text": "The world’s a lot bigger than the Academy made it seem."
    },
    {
      "speaker": "ashley",
      "text": "Hundreds of GearBorn."
    },
    {
      "speaker": "ashley",
      "text": "Different cities. Different Tuners. Different GearBorn."
    },
    {
      "speaker": "user",
      "text": "And all of them can evolve?"
    },
    {
      "speaker": "ashley",
      "text": "If the bond’s strong enough."
    },
    {
      "speaker": "ashley",
      "text": "Here."
    },
    {
      "speaker": "ashley",
      "text": "Download this."
    },
    {
      "speaker": "user",
      "text": "VINdex?"
    },
    {
      "speaker": "ashley",
      "text": "Tracks every GearBorn you encounter."
    },
    {
      "speaker": "ashley",
      "text": "Once you see a GearBorn, its basic info gets logged automatically."
    },
    {
      "speaker": "ashley",
      "text": "Unlocking one reveals evolution paths and deeper data."
    },
    {
      "speaker": "user",
      "text": "So basically a giant GearBorn encyclopedia."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "I’m absolutely collecting all of them.",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "Careful."
            },
            {
              "speaker": "ashley",
              "text": "That’s how the obsession starts."
            }
          ]
        },
        {
          "label": "This feels weirdly addictive already.",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "Welcome to the club."
            }
          ]
        },
        {
          "label": "Wait, there are HUNDREDS of these things?",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "You haven’t even scratched the surface."
            }
          ]
        }
      ]
    },
    {
      "speaker": "ashley",
      "text": "Open it up."
    },
    {
      "speaker": "ashley",
      "text": "I’ll show you how it works."
    }
  ],
  "vindex": [
    {
      "speaker": "user",
      "text": "Okay, this is actually super clean."
    },
    {
      "speaker": "ashley",
      "text": "The VINdex logs every GearBorn you encounter."
    },
    {
      "speaker": "ashley",
      "text": "Seen GearBorn get basic entries."
    },
    {
      "speaker": "ashley",
      "text": "Bonded GearBorn unlock full records."
    },
    {
      "speaker": "user",
      "text": "So the goal is basically to fill the whole thing out."
    },
    {
      "speaker": "ashley",
      "text": "For some Tuners, yeah."
    },
    {
      "speaker": "ashley",
      "text": "Others chase strength. Reputation. Money."
    },
    {
      "speaker": "ashley",
      "text": "Depends."
    },
    {
      "speaker": "user",
      "text": "TUTORIAL_CHOICE_PROMPT",
      "choices": [
        {
          "label": "Which one’s your favorite?",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "Depends on the day."
            },
            {
              "speaker": "ashley",
              "text": "And how much property damage I’m trying to avoid."
            }
          ]
        },
        {
          "label": "So there are legendary GearBorn too, right?",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "Oh, absolutely."
            },
            {
              "speaker": "ashley",
              "text": "Some people spend their entire lives chasing them."
            }
          ]
        },
        {
          "label": "I’m definitely finding the weirdest one possible.",
          "responseLines": [
            {
              "speaker": "ashley",
              "text": "I’m starting to get that about you."
            }
          ]
        }
      ]
    },
    {
      "speaker": "ashley",
      "text": "There’s one more thing you should know before I turn you loose."
    },
    {
      "speaker": "ashley",
      "text": "Open Achievements."
    }
  ],
  "achievements": [
    {
      "speaker": "user",
      "text": "Oh no."
    },
    {
      "speaker": "user",
      "text": "There are percentages."
    },
    {
      "speaker": "ashley",
      "text": "Tuners love percentages."
    },
    {
      "speaker": "ashley",
      "text": "Makes them feel in control."
    },
    {
      "speaker": "user",
      "text": "This is how people lose hundreds of hours of their lives, huh?"
    },
    {
      "speaker": "ashley",
      "text": "Thousands, usually."
    },
    {
      "speaker": "ashley",
      "text": "Achievements track major milestones:"
    },
    {
      "speaker": "ashley",
      "text": "Race wins, Boss victories, discoveries, evolutions."
    },
    {
      "speaker": "ashley",
      "text": "Some are easy. Some are brutal."
    },
    {
      "speaker": "user",
      "text": "I hate numbers."
    },
    {
      "speaker": "ashley",
      "text": "This is so simple."
    },
    {
      "speaker": "ashley",
      "text": "Achievements reward Sprox, medallions, and rare unlocks."
    },
    {
      "speaker": "ashley",
      "text": "Don’t ignore them."
    },
    {
      "speaker": "user",
      "text": "So the races reward me for becoming emotionally unhealthy."
    },
    {
      "speaker": "ashley",
      "text": "Now you’re understanding competitive racing culture."
    },
    {
      "speaker": "ashley",
      "text": "The Academy teaches people how to follow the road."
    },
    {
      "speaker": "ashley",
      "text": "But the best Tuners?"
    },
    {
      "speaker": "ashley",
      "text": "They find their own route."
    }
  ],
  "end": [
    {
      "speaker": "ashley",
      "text": "Out there, nobody cares whether the Academy passed you or not."
    },
    {
      "speaker": "ashley",
      "text": "Bosses care about reputation."
    },
    {
      "speaker": "ashley",
      "text": "Tuners care about results."
    },
    {
      "speaker": "ashley",
      "text": "GearBorn care about connection."
    },
    {
      "speaker": "user",
      "text": "So what now?"
    },
    {
      "speaker": "ashley",
      "text": "Now?"
    },
    {
      "speaker": "ashley",
      "text": "You build your reputation."
    },
    {
      "speaker": "ashley",
      "text": "Challenge city bosses."
    },
    {
      "speaker": "ashley",
      "text": "Unlock stronger GearBorn."
    },
    {
      "speaker": "ashley",
      "text": "Figure out what kind of Tuner you want to become."
    },
    {
      "speaker": "user",
      "text": "Sounds easy enough."
    },
    {
      "speaker": "ashley",
      "text": "It really, REALLY isn’t."
    },
    {
      "speaker": "user",
      "text": "Sick."
    },
    {
      "speaker": "ashley",
      "text": "Yeah. It kinda is."
    },
    {
      "speaker": "ashley",
      "text": "Welcome to the world of GearBorn."
    }
  ]
};

const tutorialDialogueAliases = {
  "battle-win": "post-battle",
  "evolution-cinematic": "evolve",
  "evolved-form": "evolve",
  "medallion-discovery": "empty-garage"
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

// ─── GEARBORN STAT PROFILES ─────────────────────────────────────────────────
const gearbornStatProfiles = {
  "bee": {
    "speed": 87,
    "acceleration": 87,
    "handling": 80,
    "torque": 74,
    "body": 62,
    "powertrain": 84,
    "playstyle": "Stinger Sprinter",
    "type": "Agility"
  },
  "muscle-man": {
    "speed": 86,
    "acceleration": 76,
    "handling": 64,
    "torque": 82,
    "body": 80,
    "powertrain": 78,
    "playstyle": "Flex Cruiser",
    "type": "Power"
  },
  "pickup": {
    "speed": 70,
    "acceleration": 72,
    "handling": 64,
    "torque": 87,
    "body": 87,
    "powertrain": 74,
    "playstyle": "Load Hauler",
    "type": "Endurance"
  },
  "karate-cow": {
    "speed": 72,
    "acceleration": 86,
    "handling": 74,
    "torque": 87,
    "body": 87,
    "powertrain": 84,
    "playstyle": "Deceptive Powerhouse",
    "type": "Endurance"
  },
  "pig": {
    "speed": 74,
    "acceleration": 78,
    "handling": 72,
    "torque": 82,
    "body": 84,
    "powertrain": 87,
    "playstyle": "Scrappy Bruiser",
    "type": "Tech"
  },
  "waste-management": {
    "speed": 64,
    "acceleration": 66,
    "handling": 60,
    "torque": 80,
    "body": 83,
    "powertrain": 76,
    "playstyle": "Trash Collector",
    "type": "Endurance"
  },
  "techno-dinosaur": {
    "speed": 84,
    "acceleration": 76,
    "handling": 66,
    "torque": 87,
    "body": 87,
    "powertrain": 84,
    "playstyle": "Primal Charger",
    "type": "Transmission"
  },
  "rabbit": {
    "speed": 82,
    "acceleration": 87,
    "handling": 87,
    "torque": 74,
    "body": 60,
    "powertrain": 80,
    "playstyle": "Hopshot Dasher",
    "type": "Agility"
  },
  "chill-penguin": {
    "speed": 72,
    "acceleration": 80,
    "handling": 86,
    "torque": 74,
    "body": 70,
    "powertrain": 82,
    "playstyle": "Glacier Slider",
    "type": "Grip"
  },
  "grunge-fish": {
    "speed": 74,
    "acceleration": 72,
    "handling": 87,
    "torque": 87,
    "body": 64,
    "powertrain": 82,
    "playstyle": "Dirty Thrasher",
    "type": "Grip"
  },
  "space-dolphin": {
    "speed": 82,
    "acceleration": 86,
    "handling": 80,
    "torque": 72,
    "body": 62,
    "powertrain": 78,
    "playstyle": "Cosmic Surfer",
    "type": "Agility"
  },
  "whale": {
    "speed": 66,
    "acceleration": 68,
    "handling": 58,
    "torque": 72,
    "body": 87,
    "powertrain": 87,
    "playstyle": "Tidal Fortress",
    "type": "Endurance"
  },
  "florida-gator": {
    "speed": 80,
    "acceleration": 82,
    "handling": 76,
    "torque": 80,
    "body": 87,
    "powertrain": 87,
    "playstyle": "Swamp Striker",
    "type": "Tech"
  },
  "art-van": {
    "speed": 78,
    "acceleration": 78,
    "handling": 78,
    "torque": 78,
    "body": 78,
    "powertrain": 78,
    "playstyle": "Blank Canvas",
    "type": "Neutral"
  },
  "sorority-elephant": {
    "speed": 68,
    "acceleration": 70,
    "handling": 60,
    "torque": 87,
    "body": 87,
    "powertrain": 78,
    "playstyle": "Stampede Engine",
    "type": "Endurance"
  },
  "butcher-hog": {
    "speed": 74,
    "acceleration": 78,
    "handling": 66,
    "torque": 80,
    "body": 84,
    "powertrain": 86,
    "playstyle": "Meatwheel Menace",
    "type": "Tech"
  },
  "frog": {
    "speed": 76,
    "acceleration": 84,
    "handling": 87,
    "torque": 72,
    "body": 64,
    "powertrain": 82,
    "playstyle": "Bogside Jumper",
    "type": "Grip"
  },
  "cake-train": {
    "speed": 68,
    "acceleration": 72,
    "handling": 60,
    "torque": 87,
    "body": 87,
    "powertrain": 84,
    "playstyle": "Sugar Juggernaut",
    "type": "Endurance"
  },
  "tiger-cart": {
    "speed": 83,
    "acceleration": 86,
    "handling": 87,
    "torque": 72,
    "body": 66,
    "powertrain": 78,
    "playstyle": "Feral Fairway",
    "type": "Grip"
  },
  "silly-goose": {
    "speed": 72,
    "acceleration": 78,
    "handling": 70,
    "torque": 66,
    "body": 62,
    "powertrain": 84,
    "playstyle": "Chaos Honker",
    "type": "Tech"
  },
  "construction-blok": {
    "speed": 64,
    "acceleration": 68,
    "handling": 60,
    "torque": 84,
    "body": 87,
    "powertrain": 79,
    "playstyle": "Brick Builder",
    "type": "Endurance"
  },
  "skater-koala": {
    "speed": 76,
    "acceleration": 82,
    "handling": 86,
    "torque": 70,
    "body": 64,
    "powertrain": 80,
    "playstyle": "Rail Carver",
    "type": "Grip"
  },
  "rides-hair": {
    "speed": 80,
    "acceleration": 82,
    "handling": 72,
    "torque": 86,
    "body": 66,
    "powertrain": 78,
    "playstyle": "Handlebar Hitcher",
    "type": "Transmission"
  },
  "royal-flush": {
    "speed": 76,
    "acceleration": 85,
    "handling": 68,
    "torque": 80,
    "body": 82,
    "powertrain": 87,
    "playstyle": "Noxious Blaster",
    "type": "Tech"
  },
  "rainbowlt": {
    "speed": 87,
    "acceleration": 87,
    "handling": 87,
    "torque": 87,
    "body": 87,
    "powertrain": 87,
    "playstyle": "Perfect Ascension",
    "type": "Neutral"
  }
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
  4: { id: "los-angeles-rival", mechanic: "circuitDuel", xp: 640, power: 1.56, distance: 500 },
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
  const trial = { type: "trial", title: `${boss.track.city} Time Trial`, track: boss.track, bossIndex: index, circuitMode: "time" };
  const circuit4 = { type: "circuit", title: `${boss.track.city} 4-Car Circuit`, track: boss.track, bossIndex: index, circuitMode: "race4", xp: Math.round(150 + index * 80) };
  const circuit6 = { type: "circuit", title: `${boss.track.city} 6-Car Circuit`, track: boss.track, bossIndex: index, circuitMode: "race6", xp: Math.round(190 + index * 92) };
  const arena = { type: "battle", title: `${boss.name} Arena Battle`, bossIndex: index };
  const rival = rivalRacePlan[index]
    ? { type: "rival", title: `${boss.track.city} Rival Race`, bossIndex: index, track: boss.track, ...rivalRacePlan[index] }
    : null;
  const battle = { type: "boss", title: `${boss.name} Boss Race`, bossIndex: index, track: boss.track, circuitMode: "duel" };
  const prelims = index % 2 === 0 ? [drag, trial, circuit4, arena] : [trial, drag, circuit4, arena];
  if ([4, 5, 6, 7].includes(index)) prelims.splice(3, 0, circuit6);
  if (rival) prelims.push(rival);
  const arc = prelims.concat(battle);
  return pinkSlipRacePlan[index] ? arc.concat([{ type: "pink-slip", title: pinkSlipStageFor(pinkSlipRacePlan[index]).title, drag: pinkSlipStageFor(pinkSlipRacePlan[index]), pinkSlipCarId: pinkSlipRacePlan[index].carId, track: boss.track, circuitMode: "duel" }]) : arc;
}).concat([{ type: "boss", title: `${finalBoss.name} Final Boss`, bossIndex: bosses.length, final: true, track: finalBoss.track, circuitMode: "duel" }]);
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
  circuit: { label: "Circuit Race", icon: "assets/items/icon-boss-training.png", color: "#52c7ff" },
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
const cityBannerImages = {
  indianapolis: "assets/banners/banner-indianapolis.png",
  berlin: "assets/banners/banner-berlin.png",
  dubai: "assets/banners/banner-dubai.png",
  rio: "assets/banners/banner-rio-de-janeiro.png",
  "los-angeles": "assets/banners/banner-los-angeles.png",
  seoul: "assets/banners/banner-seoul.png",
  "cape-town": "assets/banners/banner-cape-town.png",
  bangalore: "assets/banners/banner-bengaluru.png",
  space: "assets/banners/banner-space.png"
};
let storyCursor = 0;
const storyCities = bosses.map((boss, index) => {
  const levelCount = 5 + ([4, 5, 6, 7].includes(index) ? 1 : 0) + (rivalRacePlan[index] ? 1 : 0) + (pinkSlipRacePlan[index] ? 1 : 0);
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
const gauntletCityLineMap = {
  indianapolis: "silly-goose",
  berlin: "butcher-hog",
  dubai: "construction-blok",
  rio: "skater-koala",
  "los-angeles": "muscle-man",
  seoul: "chill-penguin",
  "cape-town": "space-dolphin",
  bangalore: "tiger-cart"
};

function medallionGauntletConfigForLine(gearBornLineId) {
  return {
    enabled: true,
    unlockReputationPercent: 50,
    gearBornLineId,
    medallionId: gearBornLineId,
    displayName: cars.find((car) => car.id === gearBornLineId)?.evolutions[0]?.name || "A GearBorn",
    stages: [
      { stage: 1, mode: "drag", opponentForm: 1 },
      { stage: 2, mode: "battle", opponentForm: 2 },
      { stage: 3, mode: "headToHead2D", opponentForm: 3 }
    ]
  };
}

const medallionGauntlets = Object.fromEntries(Object.entries(gauntletCityLineMap).map(([cityId, gearBornLineId]) => [
  cityId,
  medallionGauntletConfigForLine(gearBornLineId)
]));
const specialMedallionGauntlets = {
  "royal-flush-special": {
    ...medallionGauntletConfigForLine("royal-flush"),
    special: true,
    trigger: "firstPinkSlipLoss",
    popupTitle: "You might be in the dumps, but dumps aren't always so bad..."
  },
  "rides-hair-special": {
    ...medallionGauntletConfigForLine("rides-hair"),
    special: true,
    trigger: "sixEvolvedLines",
    popupTitle: "You're growing as a Tuner... Is that a mustache?"
  }
};
const timeMedals = [
  { key: "gold", label: "Gold", difficulty: "Hard", xp: 420, base: 55 },
  { key: "silver", label: "Silver", difficulty: "Medium", xp: 260, base: 65 },
  { key: "bronze", label: "Bronze", difficulty: "Easy", xp: 150, base: 80 }
];
const vindexEntries = [
  ["010", "Bananachi", "Monkey Line", "assets/cars/rival-bananachi-display.png"],
  ["032", "Manstrocity", "Armadillo Dad Line", "assets/cars/rival-manstrocity-display.png"],
  ["037", "Beardo", "Rides Hair Line", "assets/cars/rival-beardo-display.png"],
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
  ["150", "Astromarino", "Space Dolphin Line", "assets/cars/dolphin-astromarino-display.png"],
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
  ["162", "Vandy-Warhaul", "Art Van Line", "assets/cars/art-vandy-warhaul-display.png"],
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

const additionalVindexEntries = [
  [
    "036",
    "Staschel",
    "Rides Hair Line",
    "assets/cars/mustache-staschel-display.png"
  ],
  [
    "038",
    "Bair",
    "Rides Hair Line",
    "assets/cars/mustache-bair-display.png"
  ],
  [
    "042",
    "Tourquette",
    "Muscle Man Line",
    "assets/cars/muscle-tourquette-display.png"
  ],
  [
    "043",
    "Pistonox",
    "Muscle Man Line",
    "assets/cars/muscle-pistonox-display.png"
  ],
  [
    "044",
    "Cylindialis",
    "Muscle Man Line",
    "assets/cars/muscle-cylindialis-display.png"
  ],
  [
    "079",
    "Garbaggito",
    "Waste Management Line",
    "assets/cars/garbage-garbaggito-display.png"
  ],
  [
    "080",
    "Garbanino",
    "Waste Management Line",
    "assets/cars/garbage-garbanino-display.png"
  ],
  [
    "097",
    "Freezy-E",
    "Chill Penguin Line",
    "assets/cars/penguin-freezy-e-display.png"
  ],
  [
    "098",
    "Brrap",
    "Chill Penguin Line",
    "assets/cars/penguin-brrap-display.png"
  ],
  [
    "099",
    "Chillmatic",
    "Chill Penguin Line",
    "assets/cars/penguin-chillmatic-display.png"
  ],
  [
    "148",
    "Orbitide",
    "Space Dolphin Line",
    "assets/cars/dolphin-orbitide-display.png"
  ],
  [
    "149",
    "Aquantius",
    "Space Dolphin Line",
    "assets/cars/dolphin-aquantius-display.png"
  ],
  [
    "150",
    "Astromarino",
    "Space Dolphin Line",
    "assets/cars/dolphin-astromarino-display.png"
  ],
  [
    "222",
    "Sauspin",
    "Butcher Hog Line",
    "assets/cars/butcher-sauspin-display.png"
  ],
  [
    "223",
    "Marrauvage",
    "Butcher Hog Line",
    "assets/cars/butcher-marrauvage-display.png"
  ],
  [
    "224",
    "OlChap",
    "Butcher Hog Line",
    "assets/cars/butcher-olchap-display.png"
  ],
  [
    "246",
    "Puttercat",
    "Tiger Cart Line",
    "assets/cars/golf-puttercat-display.png"
  ],
  [
    "247",
    "Snarfly",
    "Tiger Cart Line",
    "assets/cars/golf-snarfly-display.png"
  ],
  [
    "248",
    "Notar-O",
    "Tiger Cart Line",
    "assets/cars/golf-notar-o-display.png"
  ],
  [
    "252",
    "Honky",
    "Silly Goose Line",
    "assets/cars/goose-honky-display.png"
  ],
  [
    "253",
    "Goosetopher",
    "Silly Goose Line",
    "assets/cars/goose-goosetopher-display.png"
  ],
  [
    "254",
    "Eggdon",
    "Silly Goose Line",
    "assets/cars/goose-eggdon-display.png"
  ],
  [
    "267",
    "Blokparty",
    "Construction Blok Line",
    "assets/cars/traffic-blokparty-display.png"
  ],
  [
    "268",
    "Structable",
    "Construction Blok Line",
    "assets/cars/traffic-structable-display.png"
  ],
  [
    "269",
    "Doublestak",
    "Construction Blok Line",
    "assets/cars/traffic-doublestak-display.png"
  ],
  [
    "276",
    "Koaster",
    "Skater Koala Line",
    "assets/cars/koala-koaster-display.png"
  ],
  [
    "277",
    "Supey",
    "Skater Koala Line",
    "assets/cars/koala-supey-display.png"
  ],
  [
    "278",
    "Koalossus",
    "Skater Koala Line",
    "assets/cars/koala-koalossus-display.png"
  ],
  [
    "237",
    "Whiffleton",
    "Royal Flush Line",
    "assets/cars/poo-whiffleton-display.png"
  ],
  [
    "238",
    "Dookingham",
    "Royal Flush Line",
    "assets/cars/poo-dookingham-display.png"
  ],
  [
    "239",
    "Pootin",
    "Royal Flush Line",
    "assets/cars/poo-pootin-display.png"
  ],
  [
    "310",
    "RitzCarloadin",
    "Hotel Towtel Line",
    "assets/cars/hotel-ritzcarloadin-display.png"
  ]
].map(([number, name, line, image]) => ({ number, name, line, image }));
additionalVindexEntries.forEach((entry) => {
  if (!vindexEntries.some((item) => item.number === entry.number && item.name === entry.name)) vindexEntries.push(entry);
});
vindexEntries.sort((a, b) => Number(a.number) - Number(b.number) || a.name.localeCompare(b.name));
const vindexClassByNumber = {
  "010": "E",
  "032": "C",
  "036": "E",
  "037": "D",
  "038": "C",
  "039": "E",
  "040": "D",
  "041": "C",
  "058": "E",
  "059": "D",
  "060": "C",
  "063": "E",
  "064": "D",
  "065": "C",
  "066": "E",
  "067": "D",
  "068": "C",
  "088": "D",
  "089": "C",
  "090": "B",
  "091": "D",
  "092": "C",
  "093": "B",
  "110": "B",
  "111": "A",
  "145": "D",
  "146": "C",
  "147": "B",
  "150": "B",
  "151": "D",
  "152": "C",
  "153": "B",
  "154": "D",
  "155": "C",
  "156": "B",
  "157": "D",
  "158": "B",
  "159": "B",
  "160": "B",
  "161": "B",
  "162": "B",
  "163": "B",
  "164": "B",
  "198": "D",
  "199": "C",
  "200": "B",
  "212": "F",
  "231": "C",
  "232": "B",
  "233": "A",
  "243": "C",
  "244": "B",
  "245": "A",
  "251": "B",
  "287": "B",
  "296": "A",
  "298": "A",
  "301": "A",
  "305": "A",
  "326": "S",
  "327": "S"
};
Object.assign(vindexClassByNumber, {
  "010": "E",
  "032": "C",
  "037": "D",
  "039": "E",
  "040": "D",
  "041": "C",
  "042": "D",
  "043": "C",
  "044": "B",
  "058": "E",
  "059": "D",
  "060": "C",
  "063": "E",
  "064": "D",
  "065": "C",
  "066": "E",
  "067": "D",
  "068": "C",
  "079": "E",
  "080": "D",
  "088": "D",
  "089": "C",
  "090": "B",
  "091": "E",
  "092": "D",
  "093": "C",
  "097": "D",
  "098": "C",
  "099": "B",
  "110": "B",
  "111": "A",
  "145": "D",
  "146": "C",
  "147": "B",
  "148": "D",
  "149": "C",
  "150": "B",
  "151": "D",
  "152": "C",
  "153": "B",
  "154": "D",
  "155": "C",
  "156": "B",
  "157": "D",
  "158": "B",
  "159": "B",
  "160": "B",
  "161": "B",
  "162": "B",
  "163": "B",
  "164": "B",
  "198": "D",
  "199": "C",
  "200": "B",
  "212": "F",
  "222": "D",
  "223": "C",
  "224": "B",
  "237": "D",
  "238": "C",
  "239": "B",
  "231": "C",
  "232": "B",
  "233": "A",
  "243": "C",
  "244": "B",
  "245": "A",
  "246": "C",
  "247": "B",
  "248": "A",
  "251": "B",
  "252": "E",
  "253": "D",
  "254": "C",
  "267": "C",
  "268": "B",
  "269": "A",
  "276": "D",
  "277": "C",
  "278": "B",
  "287": "B",
  "296": "A",
  "298": "A",
  "301": "A",
  "305": "A",
  "326": "S",
  "327": "S"
});
Object.assign(vindexClassByNumber, {
  "310": "A"
});

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
  "dr-tyree": "A brilliant mind with a disappointing lap time. Dr. Tyree was once the Academy's top student - on paper. His understanding of GearBorn mechanics is unmatched, his theories cited across the world, and his doctorate... frequently mentioned. But on the track? Let's just say the data didn't translate. Now the Academy's lead instructor, Tyree treats GearBorn with absolute seriousness - borderline reverence. To him, this is about more than just rubber and road. He believes mastery comes from understanding - not instinct.",
  ashley: "Ashley Racem was never supposed to make it past the gates. No racing family. No sponsors. No polished Academy pedigree. Just raw instinct and a habit of connecting with GearBorn in ways nobody could quite explain.\n\nOnce considered a rising talent, Ashley's future at the Academy ended after she stole a prototype GearBorn key and wrecked the original Tutorque during an unauthorized run. Ask Ashley, and she'll tell you the system failed her long before the crash ever happened.\n\nNow she races outside the official circuit, helping overlooked Tuners find paths the Academy never would've offered them. To Ashley, compatibility matters more than credentials — and the road doesn't care where you came from.",
  "lynx-incarso": "Nobody really knows where Lynx Incarso came from. What they do know is that if she's behind you on the starting grid, you should probably update your insurance. Loud, fearless, and completely unpredictable, Lynx races with the kind of reckless aggression that makes other Tuners question their own survival instincts. Some racers insist the chaos is calculated, that she's using intimidation to force mistakes. The terrifying part? It probably isn't. Lynx genuinely seems to enjoy the danger. To her, racing isn't about perfect lines or clean technique. It's about pressure, panic, and seeing who breaks first.",
  "portia-crosh": "The voice behind hit GearBorn podcast Good Tunes, Portia Crosh built her reputation covering the world's top Tuners before deciding she was tired of talking about greatness from the sidelines. Smart, sharp, and relentlessly ambitious, Portia approaches racing like she approaches journalism - by learning exactly where the pressure points are and pushing them. Critics say she's too polished for the track. Portia keeps beating them anyway. Somehow she always knows the story before everyone else, including the parts people wish she didn't.",
  "marlyn-adelaide": "Off the track, Marlyn Adelaide is a walking disaster. He spills drinks, trips over air, complains constantly, and somehow gets lost in places he's already been. Behind the wheel? Different person entirely. Marlyn drives with razor-sharp precision and impossible reflexes, treating every race like a moving puzzle only he can solve. He's picky, dramatic, and exhausting to be around for long periods of time - but even his rivals admit the guy's a genius once the engines start.",
  "crosby-nash": "Crosby Nash looks terrifying right up until he opens his mouth. Gentle, encouraging, and relentlessly positive, Crosby treats every racer like they're already friends - whether they want him to or not. Most people enter races against him expecting intimidation tactics. Instead they get compliments, life advice, and heartfelt encouragement at red lights. Underneath the teddy bear energy is an incredibly capable driver who earned his reputation the hard way. Crosby doesn't race to crush people. He races because he genuinely wants to see how far everyone can go.",
  "eli-kaufman": "Most Tuners grew up dreaming about the spotlight. Eli Kaufman grew up carrying someone else's clubs through it. A longtime caddy for the city's elite racers, Eli learned the Tuner world one overheard conversation at a time - studying egos, rivalries, and strategy while staying invisible. After years of saving every tip he earned, Eli finally bought his way onto the track himself. Calm, patient, and impossible to rattle, he races the same way he worked: quietly, precisely, and always three steps ahead of the people underestimating him. He's also your best friend."
};
const otherNpcProfiles = [
  { id: "eli-kaufman", name: "Eli Kaufman", city: "The Starting Grid" },
  { id: "portia-crosh", name: "Portia Crosh", city: "Good Tunes Studio" },
  { id: "lynx-incarso", name: "Lynx Incarso", city: "Unknown" },
  { id: "marlyn-adelaide", name: "Marlyn Adelaide", city: "Everywhere, Somehow Lost" },
  { id: "crosby-nash", name: "Crosby Nash", city: "The Open Road" }
].map((profile) => ({
  ...profile,
  image: `assets/characters/headshot-${profile.id.split("-")[0]}.png`,
  headshot: `assets/characters/headshot-${profile.id.split("-")[0]}.png`,
  character: `assets/characters/character-${profile.id.split("-")[0]}.png`,
  category: "Other",
  car: "Other",
  country: "Other",
  bio: profileBios[profile.id] || "Profile bio coming soon."
}));
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
  car: "Mamburn",
  carImage: "assets/cars/snake-mamburn-display.png",
  city: "Tuner Academy",
  country: "Other",
  bio: profileBios["dr-tyree"]
}, {
  id: "ashley",
  name: "Ashley Racem",
  image: "assets/characters/headshot-ashley.png",
  headshot: "assets/characters/headshot-ashley.png",
  character: "assets/characters/character-ashley.png",
  category: "Other",
  car: "Astromarino",
  carImage: "assets/cars/dolphin-astromarino-display.png",
  city: "Outside the Official Circuit",
  country: "Other",
  bio: profileBios.ashley
}], otherNpcProfiles);
