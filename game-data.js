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
      display: "assets/cars/monkey-bananachi-display.png",
      race: "assets/cars/monkey-bananachi-race.png"
    }
  },
  {
    key: "D",
    name: "Beardo",
    xpBonus: 1.35,
    power: 1.08,
    color: "#8d6e63",
    images: {
      display: "assets/cars/mustache-beardo-display.png",
      race: "assets/cars/mustache-beardo-race.png"
    }
  },
  {
    key: "C",
    name: "Manstrocity",
    xpBonus: 1.75,
    power: 1.28,
    color: "#7bdff2",
    images: {
      display: "assets/cars/armadillo-manstrocity-display.png",
      race: "assets/cars/armadillo-manstrocity-race.png"
    }
  },
  {
    key: "B",
    name: "Sponsore",
    xpBonus: 2.25,
    power: 1.5,
    color: "#f29f5c",
    images: {
      display: "assets/cars/sticker-sponsore-display.png",
      race: "assets/cars/sticker-sponsore-race.png"
    }
  },
  {
    key: "A",
    name: "Crusadome",
    xpBonus: 3.0,
    power: 1.78,
    color: "#f25f5c",
    images: {
      display: "assets/cars/pope-crusadome-display.png",
      race: "assets/cars/pope-crusadome-race.png"
    }
  },
  {
    key: "S",
    name: "Hornula1",
    xpBonus: 4.1,
    power: 2.12,
    color: "#c084fc",
    images: {
      display: "assets/cars/unicorn-hornula1-display.png",
      race: "assets/cars/unicorn-hornula1-race.png"
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
    family: "Unicorn Supercar",
    color: "#c084fc",
    trait: "Unlocked by mastering every starter line",
    unlockable: true,
    unlockInstruction: "Evolve all the cars to unlock",
    evolutions: [
      { name: "Rainbowlt", images: { display: "assets/cars/unicorn-rainbowlt-display.png", race: "assets/cars/unicorn-rainbowlt-race.png", topdown: "assets/cars/unicorn-rainbowlt-topdown.png" } },
      { name: "Hornula1", images: { display: "assets/cars/unicorn-hornula1-display.png", race: "assets/cars/unicorn-hornula1-race.png", topdown: "assets/cars/unicorn-hornula1-topdown.png" } }
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
      { name: "Snaytan", images: { display: "assets/cars/snake-snaytan-display.png", race: "assets/cars/snake-snaytan-race.png", topdown: "assets/cars/snake-snaytan-topdown.png" } }
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
    id: "gb-growler",
    family: "GB Growler",
    color: "#b55a3c",
    trait: "Guard dog juggernaut",
    unlockable: true,
    evolutions: [
      { name: "Cruzdog", images: { display: "assets/cars/pt-cruzdog-race.png", race: "assets/cars/pt-cruzdog-race.png", topdown: "assets/cars/pt-cruzdog-topdown.png" } },
      { name: "Bullwark", images: { display: "assets/cars/pt-bullwark-display.png", race: "assets/cars/pt-bullwark-race.png", topdown: "assets/cars/pt-bullwark-topdown.png" } },
      { name: "Forterra", images: { display: "assets/cars/pt-forterra-display.png", race: "assets/cars/pt-forterra-display.png", topdown: "assets/cars/pt-forterra-topdown.png" } }
    ]
  },
  {
    id: "armadaddio",
    family: "Armadaddio",
    color: "#7bdff2",
    trait: "Shellshock rambler",
    unlockable: true,
    evolutions: [
      { name: "Manscape", images: { display: "assets/cars/armadillo-manscape-display.png", race: "assets/cars/armadillo-manscape-race.png", topdown: "assets/cars/armadillo-manscape-topdown.png" } },
      { name: "Mansplore", images: { display: "assets/cars/armadillo-mansplore-display.png", race: "assets/cars/armadillo-mansplore-race.png", topdown: "assets/cars/armadillo-mansplore-topdown.png" } },
      { name: "Manstrocity", images: { display: "assets/cars/armadillo-manstrocity-display.png", race: "assets/cars/armadillo-manstrocity-race.png", topdown: "assets/cars/armadillo-manstrocity-race.png" } }
    ]
  },
  {
    id: "electro-beetle",
    family: "Electro-Beetle",
    color: "#52c7ff",
    trait: "Static skitter",
    unlockable: true,
    evolutions: [
      { name: "Bertie", images: { display: "assets/cars/beetle-bertie-display.png", race: "assets/cars/beetle-bertie-race.png", topdown: "assets/cars/beetle-bertie-topdown.png" } },
      { name: "Voltscarab", images: { display: "assets/cars/beetle-voltscarab-display.png", race: "assets/cars/beetle-voltscarab-race.png", topdown: "assets/cars/beetle-voltscarab-topdown.png" } },
      { name: "Beetronox", images: { display: "assets/cars/beetle-beetronox-display.png", race: "assets/cars/beetle-beetronox-race.png", topdown: "assets/cars/beetle-beetronox-topdown.png" } }
    ]
  },
  {
    id: "flavor-coast",
    family: "Flavor Coast",
    color: "#ff8c26",
    trait: "Flavortown rocket",
    unlockable: true,
    evolutions: [
      { name: "Carmieri", images: { display: "assets/cars/flavor-carmieri-display.png", race: "assets/cars/flavor-carmieri-race.png", topdown: "assets/cars/flavor-carmieri-topdown.png" } },
      { name: "TripleDiesel", images: { display: "assets/cars/flavor-triplediesel-display.png", race: "assets/cars/flavor-triplediesel-race.png", topdown: "assets/cars/flavor-triplediesel-topdown.png" } },
      { name: "Flavortow", images: { display: "assets/cars/flavor-flavortow-display.png", race: "assets/cars/flavor-flavortow-race.png", topdown: "assets/cars/flavor-flavortow-topdown.png" } }
    ]
  },
  {
    id: "future-bok",
    family: "Future Bok",
    color: "#6ee7a8",
    trait: "Leaprunner",
    unlockable: true,
    evolutions: [
      { name: "Sprynza", images: { display: "assets/cars/bok-sprynza-display.png", race: "assets/cars/bok-sprynza-race.png", topdown: "assets/cars/bok-sprynza-topdown.png" } },
      { name: "Bokwylde", images: { display: "assets/cars/bok-bokwylde-display.png", race: "assets/cars/bok-bokwylde-race.png", topdown: "assets/cars/bok-bokwydle-topdown.png" } },
      { name: "Kuumbusta", images: { display: "assets/cars/bok-kuumbusta-display.png", race: "assets/cars/bok-kuumbusta-race.png", topdown: "assets/cars/bok-kuumbusta-topdown.png" } }
    ]
  },
  {
    id: "wrestler-roo",
    family: "Wrestler Roo",
    color: "#c084fc",
    trait: "Ringbreaker hopper",
    unlockable: true,
    evolutions: [
      { name: "Rumbleroo", images: { display: "assets/cars/roo-rumbleroo-display.png", race: "assets/cars/roo-rumbleroo-race.png", topdown: "assets/cars/roo-rumbleroo-topdown.png" } },
      { name: "StrayGunn", images: { display: "assets/cars/roo-straygunn-display.png", race: "assets/cars/roo-straygunn-race.png", topdown: "assets/cars/roo-straygunn-topdown.png" } },
      { name: "Kangold", images: { display: "assets/cars/roo-kangold-display.png", race: "assets/cars/roo-kangold-race.png", topdown: "assets/cars/roo-kangold-topdown.png" } }
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
      { name: "Beardo", images: { display: "assets/cars/mustache-beardo-display.png", race: "assets/cars/mustache-beardo-race.png", topdown: "assets/cars/mustache-beardo-topdown.png" } },
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

cars.splice(cars.findIndex((car) => car.id === "rainbowlt"), 0,
  {
    id: "narwhal-luxury",
    family: "Narwhal Luxury",
    color: "#8fb3ff",
    trait: "Unlocked by reaching Bond 25 with every non-secret GearBorn line",
    unlockable: true,
    unlockInstruction: "Reach Bond 25 with all lines to unlock",
    evolutions: [
      { name: "Narwraith", images: { display: "assets/cars/narwhal-narwraith-display.png", race: "assets/cars/narwhal-narwraith-race.png", topdown: "assets/cars/narwhal-narwraith-topdown.png" } },
      { name: "Rollantis", images: { display: "assets/cars/narwhal-rollantis-display.png", race: "assets/cars/narwhal-rollantis-race.png", topdown: "assets/cars/narwhal-rollantis-topdown.png" } }
    ]
  }
);

// Sheet-driven story reward lines. Placeholder image paths intentionally follow
// one predictable convention so final art can be dropped in without code edits.
const storyRewardLineDefs = [
  { id: "monkey", family: "Monkey", color: "#65a30d", trait: "Vine vault", type: "Agility", playstyle: "Vine Vault", stats: [80, 84, 86, 70, 64, 76], forms: [["010", "Bananachi", "E"], ["011", "Primalor", "D"], ["012", "Rambokong", "C"]] },
  { id: "minivan", family: "Minivan", color: "#94a3b8", trait: "Family cruiser", type: "Transmission", playstyle: "Family Cruiser", stats: [68, 72, 70, 87, 82, 72], forms: [["022", "Poola", "E"], ["023", "Iliadd", "D"], ["024", "Momageddon", "C"]] },
  { id: "sun-lion", family: "Sun Lion", color: "#f59e0b", trait: "Solar rampage", type: "Power", playstyle: "Solar Rampage", stats: [84, 82, 74, 78, 76, 87], forms: [["025", "Sparkit", "E"], ["026", "Solman", "D"], ["027", "Maneiac", "C"]] },
  { id: "all-terrain-spyder", family: "All-Terrain Spyder", color: "#84cc16", trait: "Trail weaver", type: "Grip", playstyle: "Trail Weaver", stats: [76, 74, 87, 78, 70, 76], forms: [["033", "Spydar", "E"], ["034", "Tarantread", "D"], ["035", "Arachciti", "C"]] },
  { id: "emo-turtle", family: "Emo Turtle", color: "#64748b", trait: "Melancholy fortress", type: "Endurance", playstyle: "Melancholy Fortress", stats: [66, 68, 64, 76, 87, 80], forms: [["103", "Shellow", "E"], ["104", "Emostudo", "D"], ["105", "Terraprinze", "C"]] },
  { id: "bucking-bronco", family: "Bucking Bronco", color: "#a16207", trait: "Stampede rebel", type: "Power", playstyle: "Stampede Rebel", stats: [82, 84, 68, 80, 78, 87], forms: [["106", "Whinnibago", "E"], ["107", "Bronclode", "D"], ["108", "Thunspur", "C"]] },
  { id: "snake", family: "Snake", color: "#65a30d", trait: "Venom circuit", type: "Tech", playstyle: "Venom Circuit", stats: [86, 84, 80, 82, 66, 87], forms: [["109", "Venomoil", "C"], ["110", "Mamburn", "B"], ["111", "Snaytan", "A"]] },
  { id: "galaxy-jelly", family: "Galaxy Jelly", color: "#a78bfa", trait: "Cosmic bloom", type: "Neutral", playstyle: "Cosmic Bloom", stats: [87, 87, 87, 87, 84, 87], forms: [["112", "Bloomula", "B"], ["113", "Lumedusa", "A"], ["114", "Anjelladon", "S"]] },
  { id: "funvee", family: "Funvee", color: "#f97316", trait: "Party tank", type: "Endurance", playstyle: "Party Tank", stats: [72, 74, 68, 80, 86, 78], forms: [["124", "Funvee", "E"], ["125", "Braggadon", "D"], ["126", "Hummungus", "C"]] },
  { id: "high-roller-cheetah", family: "High Roller Cheetah", color: "#eab308", trait: "Jackpot blitz", type: "Power", playstyle: "Jackpot Blitz", stats: [87, 84, 78, 76, 62, 84], forms: [["128", "Jackpaw", "E"], ["129", "Acelot", "D"], ["130", "Purrfecta", "C"]] },
  { id: "combat-badger", family: "Combat Badger", color: "#78716c", trait: "Bunker brawler", type: "Power", playstyle: "Bunker Brawler", stats: [76, 80, 68, 82, 87, 87], forms: [["165", "Bootclaw", "E"], ["166", "Combadge", "D"], ["167", "Ermewatt", "C"]] },
  { id: "jazz-panther", family: "Jazz Panther", color: "#7c3aed", trait: "Rhythm pouncer", type: "Grip", playstyle: "Rhythm Pouncer", stats: [80, 78, 86, 74, 68, 82], forms: [["171", "Panthroove", "E"], ["172", "Velvetone", "D"], ["173", "Velourious", "C"]] },
  { id: "sports-car", family: "Sports Car", color: "#ef4444", trait: "Apex velocity", type: "Agility", playstyle: "Apex Velocity", stats: [86, 82, 80, 76, 62, 74], forms: [["177", "Ballparker", "E"], ["178", "Hoopra", "D"], ["179", "Grithouse", "C"]] },
  { id: "magician", family: "Magician", color: "#8b5cf6", trait: "Illusion gambit", type: "Transmission", playstyle: "Illusion Gambit", stats: [74, 76, 80, 87, 64, 84], forms: [["180", "Hoptical", "E"], ["181", "Flockus-Pocus", "D"], ["182", "Ziegfroyd", "C"]] },
  { id: "running-bulls", family: "Running Bulls", color: "#dc2626", trait: "Charging riot", type: "Power", playstyle: "Charging Riot", stats: [84, 82, 72, 84, 82, 87], forms: [["186", "Motoro", "D"], ["187", "Chargeté", "C"], ["188", "Knoxvillagrande", "B"]] },
  { id: "island-luau", family: "Island Luau", color: "#06b6d4", trait: "Tidal groover", type: "Transmission", playstyle: "Tidal Groover", stats: [78, 80, 82, 87, 72, 84], forms: [["189", "Isluau", "D"], ["190", "Tikahuna", "C"], ["191", "Alohkaiju", "B"]] },
  { id: "birds-of-metal", family: "Birds of Metal", color: "#334155", trait: "Skywire flock", type: "Tech", playstyle: "Skywire Flock", stats: [78, 80, 82, 72, 64, 87], forms: [["206", "Hawklycrüze", "E"], ["207", "Congiovi", "D"], ["208", "Bachelohde", "C"]] },
  { id: "drift-pirate", family: "Drift Pirate", color: "#0f766e", trait: "Rogue slider", type: "Grip", playstyle: "Rogue Slider", stats: [82, 76, 87, 80, 64, 78], forms: [["219", "Driftplank", "E"], ["220", "Jolly Rider", "D"], ["221", "Nitralleon", "C"]] },
  { id: "anime", family: "Anime", color: "#ec4899", trait: "Neon daydream", type: "Agility", playstyle: "Neon Daydream", stats: [84, 87, 86, 74, 64, 82], forms: [["234", "Irasshaimase", "D"], ["235", "Itadakimasu", "C"], ["236", "Konbanwa", "B"]] },
  { id: "influencer-peacock", family: "Influencer Peacock", color: "#14b8a6", trait: "Viral showstopper", type: "Transmission", playstyle: "Viral Showstopper", stats: [86, 84, 82, 87, 66, 86], forms: [["249", "Hatchelorette", "C"], ["250", "Peaclout", "B"], ["251", "Inflewenze", "A"]] },
  { id: "long-haul-camel", family: "Long-Haul Camel", color: "#d97706", trait: "Desert carrier", type: "Endurance", playstyle: "Desert Carrier", stats: [68, 70, 64, 84, 87, 74], forms: [["255", "Decalf", "E"], ["256", "Hoofinit", "D"], ["257", "Humpyear", "C"]] },
  { id: "eager-beaver", family: "Eager Beaver", color: "#92400e", trait: "Dam builder", type: "Transmission", playstyle: "Dam Builder", stats: [72, 74, 76, 87, 84, 72], forms: [["258", "Dambitious", "E"], ["259", "Magnabeave", "D"], ["260", "Overabeaver", "C"]] },
  { id: "octopus-gymnast", family: "Octopus Gymnast", color: "#c026d3", trait: "Tentacle twister", type: "Grip", playstyle: "Tentacle Twister", stats: [76, 80, 87, 78, 66, 82], forms: [["270", "Chalktopus", "E"], ["271", "Crimbum", "D"], ["272", "FreeOcto", "C"]] },
  { id: "knight-sloth", family: "Knight Sloth", color: "#475569", trait: "Iron sentinel", type: "Endurance", playstyle: "Iron Sentinel", stats: [70, 68, 72, 82, 87, 84], forms: [["279", "Slowbadon", "D"], ["280", "Knightcrawler", "C"], ["281", "Slumblord", "B"]] }
];
const storyRewardAssetSlug = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
// parent names are final-form names; resolve them against the cars array so line ids stay data-driven.
const fusionRecipes = [
  { id: "clingkong",        name: "ClingKong",        parents: ["Rambokong", "FreeOcto"] },
  { id: "beetyonce",        name: "Beetyonce",        parents: ["Motonarch", "Beetronox"] },
  { id: "simbayote",        name: "Simbayote",        parents: ["Motonarch", "Maneiac"] },
  { id: "yassibun",         name: "Yassibun",         parents: ["Matunnie", "Bair"] },
  { id: "sunday-pickup",    name: "Sunday Pickup",    parents: ["Grithouse", "Manstrocity"] },
  { id: "catsanova",        name: "Catsanova",        parents: ["Purrfecta", "Velourious"] },
  { id: "bacconeer",        name: "Bacconeer",        parents: ["Swinecroft", "Nitralleon"] },
  { id: "sleight-of-skull", name: "Sleight of Skull", parents: ["Ziegfroyd", "Nitralleon"] },
  { id: "eaterbarker",      name: "EaterBarker",      parents: ["Arachciti", "Forterra"] },
  { id: "manestage",        name: "Manestage",        parents: ["Maneiac", "Bachelohde"] },
  { id: "baladgent",        name: "Baladgent",        parents: ["Ermewatt", "Overabeaver"] },
  { id: "frontiermaxin",    name: "Frontiermaxin",    parents: ["Tookerjaw", "Thunspur"] },
  { id: "wineohonk",        name: "WineO'Honk",       parents: ["Eggdon", "Momageddon"] },
  { id: "porkerhouse",      name: "Porkerhouse",      parents: ["Swinecroft", "Grandmooster"] },
  { id: "momentous",        name: "MoMentous",        parents: ["Hummungus", "Momageddon"] }
];

function fusionImagePath(fusionId, role) {
  return `assets/cars/fusion-${fusionId}-${role}.png`;
}

function finalFormNameForLine(car) {
  const finalEvolution = car?.evolutions?.[car.evolutions.length - 1]?.name;
  const finalForm = car?.forms?.[car.forms.length - 1]?.[1];
  return finalEvolution || finalForm || "";
}

function lineIdForFinalFormName(name) {
  const matches = cars.filter((car) => finalFormNameForLine(car) === name);
  // TODO verify final-form name if a future recipe resolves to zero or multiple lines.
  return matches.length === 1 ? matches[0].id : "";
}

function fusionParentLineIds(recipe) {
  if (!recipe) return [];
  if (!recipe.parentLineIds) recipe.parentLineIds = recipe.parents.map(lineIdForFinalFormName);
  return recipe.parentLineIds;
}

function inlineStatsForLine(car) {
  if (!Array.isArray(car?.stats)) return null;
  const [speed, acceleration, handling, torque, body, powertrain] = car.stats;
  return { speed, acceleration, handling, torque, body, powertrain, type: car.type, playstyle: car.playstyle };
}

function statsForFusionParent(lineId) {
  return gearbornStatProfiles[lineId] || inlineStatsForLine(cars.find((car) => car.id === lineId)) || {};
}

function computeFusionStats(parentLineAId, parentLineBId) {
  const parentA = statsForFusionParent(parentLineAId);
  const parentB = statsForFusionParent(parentLineBId);
  return ["speed", "acceleration", "handling", "torque", "body", "powertrain"].reduce((stats, key) => {
    stats[key] = Math.min(95, Math.max(Number(parentA[key]) || 0, Number(parentB[key]) || 0) + 5); // fusion stat rule
    return stats;
  }, {});
}

storyRewardLineDefs.forEach((line) => {
  if (cars.some((car) => car.id === line.id)) return;
  cars.splice(cars.findIndex((car) => car.id === "rainbowlt"), 0, {
    id: line.id,
    family: line.family,
    color: line.color,
    trait: line.trait,
    unlockable: true,
    evolutions: line.forms.map(([, name]) => {
      const slug = storyRewardAssetSlug(name);
      return { name, images: { display: `assets/cars/${line.id}-${slug}-display.png`, race: `assets/cars/${line.id}-${slug}-race.png`, topdown: `assets/cars/${line.id}-${slug}-topdown.png` } };
    })
  });
});
fusionRecipes.forEach((recipe) => {
  fusionParentLineIds(recipe);
  if (cars.some((car) => car.id === recipe.id)) return;
  cars.push({
    id: recipe.id,
    family: `${recipe.name} Line`, // TODO final fusion family naming.
    color: "#ffc857", // TODO final fusion color palette.
    trait: "Fusion", // TODO final fusion trait copy.
    unlockable: true,
    fusion: true,
    evolutions: [
      {
        name: recipe.name,
        images: {
          display: fusionImagePath(recipe.id, "display"),
          race: fusionImagePath(recipe.id, "race"),
          topdown: fusionImagePath(recipe.id, "topdown")
        }
      }
    ]
  });
});

const defaultUnlockedLines = ["bee", "pickup", "rabbit"];
const pinkSlipUnlockOrder = ["cake-train", "construction-blok", "tiger-cart", "influencer-peacock", "flavor-coast", "snake", "future-bok", "frog", "galaxy-jelly"];
const gauntletUnlockOrder = ["gb-growler", "silly-goose", "pig", "electro-beetle", "funvee", "eager-beaver", "armadaddio", "high-roller-cheetah", "long-haul-camel", "monkey", "minivan", "birds-of-metal", "rides-hair", "sports-car", "magician", "karate-cow", "drift-pirate", "combat-badger", "bucking-bronco", "all-terrain-spyder", "emo-turtle", "jazz-panther", "octopus-gymnast", "sun-lion"];
const convoyUnlockOrder = ["florida-gator", "grunge-fish", "royal-flush", "space-dolphin", "butcher-hog", "techno-dinosaur", "chill-penguin", "running-bulls"];
const bossUnlockOrder = ["muscle-man", "sorority-elephant", "whale", "island-luau", "skater-koala", "anime", "knight-sloth", "wrestler-roo"];
const coreGearbornLineIds = defaultUnlockedLines.concat(pinkSlipUnlockOrder);
const starterCarIds = coreGearbornLineIds;
const rivalStarterCarIds = defaultUnlockedLines;
const achievementUnlockOrder = ["art-van"];
const garageLineOrder = defaultUnlockedLines.concat(pinkSlipUnlockOrder, achievementUnlockOrder, gauntletUnlockOrder, convoyUnlockOrder, bossUnlockOrder, ["waste-management", "rainbowlt", "narwhal-luxury", "metal-snake", "training-car"]);
const crankVaultDefs = {
  common: {
    id: "common",
    name: "Common CrankVault",
    color: "blue",
    cost: 50,
    detail: "90% chance of E-Class, 9% chance of D-Class, 1% chance of C-Class, and 5 Spins.",
    rewards: [
      { kind: "medallion", weights: { E: 90, D: 9, C: 1 }, count: 1 },
      { kind: "spins", amount: 5 }
    ]
  },
  premium: {
    id: "premium",
    name: "Premium CrankVault",
    color: "purple",
    cost: 200,
    detail: "One 60/40 D–C medallion (60% D-Class, 40% C-Class), two 85/15 E–D medallions (85% E-Class, 15% D-Class), and 20 Spins.",
    rewards: [
      { kind: "medallion", weights: { D: 60, C: 40 }, count: 1 },
      { kind: "medallion", weights: { E: 85, D: 15 }, count: 2 },
      { kind: "spins", amount: 20 }
    ]
  },
  // TODO: tune earned ladder-vault economy once optional races have final balance.
  sproxCommon: {
    id: "sproxCommon",
    name: "Sprox CrankVault",
    color: "gold",
    cost: 0,
    rewards: [
      { kind: "sprox", amount: 125 },
      { kind: "spins", amount: 2 }
    ]
  },
  cityMedallion: {
    id: "cityMedallion",
    name: "Medallion CrankVault",
    color: "green",
    cost: 0,
    rewards: [
      { kind: "medallion", weights: { E: 70, D: 25, C: 5 }, count: 1 }
    ]
  }
};
const dailyGoalRotation = ["drag", "vs", "battle"];
const dailyGoalDefs = [
  { id: "login",        name: "Start Your Engine", desc: "Log in today",                        target: 1,   reward: { sprox: 100 } },
  { id: "winAny",       name: "Take the W",        desc: "Win 3 races",                          target: 3,   reward: { sprox: 150 } },
  { id: "rotating",     name: "Specialist",        desc: "",                                     target: 3,   reward: { sprox: 200 } },
  { id: "openVault",    name: "Crank It Open",     desc: "Open a CrankVault",                    target: 1,   reward: { sprox: 100 } },
  { id: "storyConvoy",  name: "On the Road",       desc: "Win a Story or Convoy race",           target: 1,   reward: { sprox: 150 } },
  { id: "finishRaces",  name: "Seat Time",         desc: "Finish 5 races",                       target: 5,   reward: { sprox: 150 } },
  { id: "earnSprox",    name: "Payday",            desc: "Earn 500 Sprox",                       target: 500, reward: { spins: 2 } },
  { id: "spendGarage",  name: "Shop Talk",         desc: "Spend Sprox in the Garage",            target: 1,   reward: { sprox: 100 } },
  { id: "threeCars",    name: "Rotation Player",   desc: "Race with 3 different GearBorn",       target: 3,   reward: { sprox: 150 } }
];
const dailyGoalsRequiredForVault = dailyGoalDefs.length - 1;
const medallionRankCosts = {
  E: [1, 3, 3, 3, 5],
  D: [1, 2, 2, 2, 3],
  C: [1, 1, 1, 1, 1]
};
const cityStructureTemplate = {
  ladders: [
    { id: "drag", label: "Drag Race" },
    { id: "trial", label: "Time Trial" },
    { id: "exhibition", label: "Exhibition Race" },
    { id: "battle", label: "Battle" }
  ],
  ladderTiers: ["bronze", "silver", "gold"],
  storyRaceCount: 5
};
// Per-city story-race definitions. Each entry is one of the 5 linear story races.
// type: drag | trial | circuit | rival | battle
// opponentId: participant id for story races that have a named opponent (null otherwise)
// scenePre / scenePost: placeholder keys for the VN dialogue that plays before/after the race.
// TODO: add the remaining city story plans as their story content is locked.
const cityStoryRacePlans = {
  indianapolis: [
    { slot: 0, type: "drag", opponentId: { mylo: "eli", "cha-cha": "crosby" }, scenePre: "indy-s1-pre", scenePost: "indy-s1-post" },
    { slot: 1, type: "trial", opponentId: null, scenePre: "indy-s2-pre", scenePost: "indy-s2-post" },
    { slot: 2, type: "circuit", opponentId: { mylo: "eli", "cha-cha": "crosby" }, scenePre: "indy-s3-pre", scenePost: "indy-s3-post" },
    { slot: 3, type: "rival", opponentId: "rival", scenePre: "indy-s4-pre", scenePost: "indy-s4-post" },
    { slot: 4, type: "battle", opponentId: "lynx", scenePre: "indy-s5-pre", scenePost: "indy-s5-post" }
  ]
};

function cityStoryRacePlanFor(cityId, slotIndex) {
  const plan = cityStoryRacePlans[cityId];
  return plan ? plan[slotIndex] || null : null;
}
const cityDifficultyCurve = [
  { opponentLevel: 1,  opponentEvolution: 0, skillMin: 0.96, skillMax: 1.01, aggression: 0.25 },
  { opponentLevel: 2,  opponentEvolution: 0, skillMin: 0.98, skillMax: 1.03, aggression: 0.32 },
  { opponentLevel: 3,  opponentEvolution: 1, skillMin: 1.00, skillMax: 1.05, aggression: 0.40 },
  { opponentLevel: 4,  opponentEvolution: 1, skillMin: 1.01, skillMax: 1.06, aggression: 0.48 },
  { opponentLevel: 5,  opponentEvolution: 1, skillMin: 1.02, skillMax: 1.08, aggression: 0.55 },
  { opponentLevel: 6,  opponentEvolution: 2, skillMin: 1.03, skillMax: 1.09, aggression: 0.62 },
  { opponentLevel: 7,  opponentEvolution: 2, skillMin: 1.04, skillMax: 1.10, aggression: 0.70 },
  { opponentLevel: 8,  opponentEvolution: 2, skillMin: 1.05, skillMax: 1.12, aggression: 0.78 },
  { opponentLevel: 9,  opponentEvolution: 2, skillMin: 1.06, skillMax: 1.14, aggression: 0.85 }
];
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
{ code: "T-025-cc", id: "spindell-labs", label: "SPINDELL LABS", view: "garage", mode: "vnScene", background: "assets/spindell/spindell-bg.png", characterOnly: "cha-cha" },
{ code: "T-026-cc", id: "medallion-sync", label: "MEDALLION SYNC", view: "garage", mode: "menuTutorial", background: "assets/spindell/spindell-bg.png", characterOnly: "cha-cha" },
{ code: "T-027-cc", id: "unlocked-cc", label: "UNLOCKED (CHA CHA)", view: "garage", mode: "vnScene", background: "assets/spindell/spindell-bg.png", characterOnly: "cha-cha" },
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
const gearbornKeyImage = "assets/items/gearborn-key.png";
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
  { id: "vindex50", name: "VINdex Scholar", requirement: "Encounter 50% of the VINdex", reward: "Common CrankVault", type: "vindex", percent: 50 },
  { id: "vindex75", name: "VINdex Archivist", requirement: "Encounter 75% of the VINdex", reward: "3 Level 2 parts", type: "vindex", percent: 75 },
  { id: "vindex100", name: "VINdex Master", requirement: "Encounter 100% of the VINdex", reward: "Unlock Vanbrandt", type: "vindex", percent: 100 },
  { id: "garbageMedallion", name: "Garbage Day", requirement: "Lose 5 races or battles in a row", reward: "Garbage Medallion", type: "garbageMedallion", secret: true },
  { id: "narwraithMedallion", name: "Deep Bond", requirement: "Reach Bond 25 with every non-secret GearBorn line", reward: "Narwraith Medallion", type: "narwhalBond", secret: true },
  { id: "tutorialTutorqueMedallion", name: "Academy Graduate", requirement: "Complete the tutorial from the beginning", reward: "Tutorque Medallion", type: "tutorialFullRun", secret: true }
];

// ─── TUTORIAL DIALOGUE ──────────────────────────────────────────────────────
const tutorialLine = (speaker, text) => ({ speaker, text });
const tutorialChoice = (choices) => ({ speaker: "user", text: "TUTORIAL_CHOICE_PROMPT", choices });
const tutorialChoiceOption = (label, responseLines) => ({ label, responseLines: responseLines.map(([speaker, text]) => ({ speaker, text })) });
const storyLine = tutorialLine;

const tutorialDialogueByCharacter = {
  "mylo": {
    "intro": [
      tutorialLine("tyree", "Name?"), tutorialLine("user", "Mylo. Mylo Ziggs."), tutorialLine("tyree", "I don't see you on my list."), tutorialLine("user", "You must have printed out the old list. I was added late."), tutorialLine("tyree", "By who?"), tutorialLine("user", "It was like a Jen… Jem… Jam… Jenjemjam…"), tutorialLine("tyree", "That's not a person."), tutorialLine("tyree", "Luckily, we can take one more. Ziggs…"), tutorialLine("tyree", "I'll be conducting your evaluation today."), tutorialLine("tyree", "My name is Dr. Tyree."), tutorialLine("user", "Doctor? For cars?"), tutorialLine("tyree", "GearBorn Mechanics and History, actually. My doctorate is internationally recognized."), tutorialLine("user", "So this is one of those 'those who can't do' situations."), tutorialLine("tyree", "You sure you want to make fun of the guy who just let you in?"), tutorialLine("user", "Can I still do this?"), tutorialLine("tyree", "Fine."),
      tutorialChoice([
        tutorialChoiceOption("I've waited my whole life for this.", [["tyree", "The Academy was built for people willing to dedicate themselves completely."], ["tyree", "We'll see if you mean that."]]),
        tutorialChoiceOption("You might as well just pass me right now.", [["tyree", "Are you sure you can drive?"], ["user", "Like 90% at least."]]),
        tutorialChoiceOption("If I fail, I'm blaming you.", [["tyree", "What did I do?"], ["user", "Got a doctorate instead of a racing license."], ["tyree", "Touché."]])
      ]),
      tutorialLine("tyree", "Follow me."), tutorialLine("user", "Should I be nervous?"), tutorialLine("tyree", "You should take this seriously."), tutorialLine("tyree", "Let's see what you're capable of.")
    ],
    "rival-intro": [
      tutorialLine("rival", "You're late."), tutorialLine("user", "I was finding parking."), tutorialLine("rival", "There's no parking. You took the bus."), tutorialLine("user", "I was finding the bus stop."), tutorialLine("rival", "This is becoming a pattern."), tutorialLine("tyree", "Good. You're both here."), tutorialLine("user", "Tell me we're not up against each other."), tutorialLine("rival", "Nervous?"),
      tutorialChoice([
        tutorialChoiceOption("You nervous?", [["rival", "Such quick wit that you just repeat me."], ["user", "I was also thinking that."], ["rival", "Sure..."]]),
        tutorialChoiceOption("You still doing that thing where you pretend not to like me?", [["rival", "I don't have to pretend."], ["user", "Convincing."]]),
        tutorialChoiceOption("I'm definitely beating you.", [["rival", "You said that last time too."], ["user", "And statistically, eventually I'll be right."]])
      ]),
      tutorialLine("tyree", "Today's evaluation determines whether you qualify for Academy recommendation."), tutorialLine("user", "Does she get a head start? For fairness?"), tutorialLine("rival", "Do you get extra time? Like you do on tests?"), tutorialLine("tyree", "Focus. You two are exhausting. Let's go.")
    ],
    "mamburn": [
      tutorialLine("tyree", "Normally, first-year evaluations are done using Academy Tutorques."), tutorialLine("user", "Normally sounds promising."), tutorialLine("tyree", "They're all assigned to upperclass evaluations. So today, Mylo, you'll be borrowing my GearBorn."), tutorialLine("tyree", "Her name is Mamburn."), tutorialLine("user", "WAIT."), tutorialLine("user", "THIS is yours?"), tutorialLine("tyree", "Her name is Mamburn."), tutorialLine("user", "She's incredible."), tutorialLine("rival", "..."), tutorialLine("rival", "She really is."), tutorialLine("user", "Don't agree with me like we feel the same about this. I'm having a moment."), tutorialLine("rival", "We don't feel the same about this."),
      tutorialChoice([
        tutorialChoiceOption("Okay. That's actually awesome.", [["tyree", "Mamburn appreciates your refined taste."]]),
        tutorialChoiceOption("You drive THIS? Theoretically or actually?", [["tyree", "Most theories need testing."]]),
        tutorialChoiceOption("Can I keep it if I win?", [["tyree", "Absolutely not."]])
      ]),
      tutorialLine("tyree", "GearBorn aren't ordinary vehicles."), tutorialLine("tyree", "A Tuner communicates with them through a GearBorn Key."), tutorialLine("user", "So what happens if I press the wrong button?"), tutorialLine("tyree", "This is where I tell you: if you crash Mamburn, I'll kill you."), tutorialLine("user", "That's the coolest thing you've said all day."), tutorialLine("tyree", "This key is synchronized specifically to Mamburn."), tutorialLine("tyree", "Treat her like your own."), tutorialLine("user", "You really love this thing, huh?"), tutorialLine("tyree", "More than most people deserve."), tutorialLine("user", "Nerd."), tutorialLine("tyree", "You asked."), tutorialLine("key", "Dr. Tyree lent you his GearBorn Key."), tutorialLine("user", "Sick."), tutorialLine("rival", "..."), tutorialLine("rival", "What do I drive?"), tutorialLine("tyree", "The Tutorque."), tutorialLine("tutorque", "HONK."), tutorialLine("rival", "..."), tutorialLine("rival", "Fine."), tutorialLine("user", "Did she just say fine to Tutorque?"), tutorialLine("rival", "I was acknowledging it."), tutorialLine("user", "You acknowledged the training car."), tutorialLine("rival", "Drop it.")
    ],
    "city-map": [
      tutorialLine("tyree", "Every Tuner starts somewhere. But the best eventually race everywhere."), tutorialLine("user", "Wait... am I going to need a passport?"), tutorialLine("tyree", "Yes. Do you have one?"), tutorialLine("user", "Uh... Totally."), tutorialLine("tyree", "Different cities specialize in different race styles. Different GearBorn. Different Tuners."),
      tutorialChoice([
        tutorialChoiceOption("I'm starting in Dubai. You guys cover flights, right?", [["tyree", "Make the circuit first. Then we can discuss logistics."]]),
        tutorialChoiceOption("How many of these have you actually raced in?", [["tyree", "That information is classified."], ["user", "So... none."]]),
        tutorialChoiceOption("Which city has the best food?", [["tyree", "Not relevant."], ["tyree", "But Cape Town."]])
      ]),
      tutorialLine("tyree", "Drag Races test acceleration and shifting precision."), tutorialLine("tyree", "Head-to-Head races test consistency against other Tuners."), tutorialLine("tyree", "Battle Arenas test your GearBorn's combat abilities."), tutorialLine("user", "Still can't believe they fight."), tutorialLine("tyree", "Boss Challenges are reserved for elite Tuners."), tutorialLine("user", "So basically... become the greatest Tuner in the world."), tutorialLine("tyree", "Technically, yes."), tutorialLine("user", "Sick.")
    ],
    "drag-race-intro": [
      tutorialLine("user", "And today I'll be humiliating…"), tutorialLine("user", "Tutorque?"), tutorialLine("tutorque", "HONK."), tutorialLine("user", "That thing?"), tutorialLine("rival", "Tutorque has probably logged more track hours than you have walking hours."), tutorialLine("user", "That's a weird way to say this thing is hella old."), tutorialLine("tyree", "Drag Races are straightforward. Two Tuners. One straight track. Fastest finish wins."), tutorialLine("user", "Finally. Something easy."), tutorialLine("rival", "You haven't started yet."), tutorialLine("user", "Still undefeated."),
      tutorialChoice([
        tutorialChoiceOption("I'm about to smoke this mailbox.", [["tutorque", "HONK."], ["rival", "Tutorque took that personally."]]),
        tutorialChoiceOption("Tutorque's looking nervous.", [["rival", "Tutorque could kick your butt."], ["user", "With the training wheels?"]]),
        tutorialChoiceOption("Wait, which pedal is brake again?", [["tyree", "Suddenly, I regret everything."]])
      ]),
      tutorialLine("tyree", "Positions."), tutorialLine("tutorque", "HONK!"), tutorialLine("mamburn", "VROOOOM!"), tutorialLine("tyree", "Ready?"), tutorialLine("tyree", "Race start in…")
    ],
    "drag-race-win": [
      tutorialLine("tyree", "Nicely done, Mylo."), tutorialLine("tyree", "Your shifting needs work. Your launch timing needs work. But you won."), tutorialLine("user", "You say compliments like they physically hurt you."), tutorialLine("rival", "Don't let it go to your head."), tutorialLine("user", "Why? It looks good up there."), tutorialLine("tutorque", "HONK."), tutorialLine("user", "Even Tutorque respects me now."), tutorialLine("rival", "That is not what that meant."), tutorialLine("tyree", "Winning races earns you Sprox. Sprox is used for upgrades, modifications, and progression."), tutorialLine("tyree", "Raw speed won't carry you far."),
      tutorialChoice([
        tutorialChoiceOption("You worried I'm actually good at this?", [["tyree", "I'm worried you think one race proves anything."]]),
        tutorialChoiceOption("I barely even tried.", [["rival", "Trust me. We could tell."]]),
        tutorialChoiceOption("So when do I become world famous?", [["tyree", "Several years minimum. Judging by the driving."]])
      ]),
      tutorialLine("tyree", "Real Tuners need more than straight-line speed. Back to the map.")
    ],
    "rival-stinger": [tutorialLine("rival", "Don't get comfortable."), tutorialLine("user", "You get Mamburn and you're still salty?"), tutorialLine("rival", "I'm not salty. I'm focused."), tutorialLine("tutorque", "honk. honk."), tutorialLine("user", "Did it just honk in lowercase?"), tutorialLine("rival", "It's saying you shouldn't be overconfident."), tutorialLine("user", "You actually understand it?"), tutorialLine("rival", "No. I've just met you before."), tutorialLine("tyree", "Enough talking. Next evaluation. Move.")],
    "drag2h2h": [
      tutorialLine("tyree", "If you want one of the city bosses to take you seriously, you'll need to win races to build your reputation."), tutorialLine("user", "Can I build reputation by thirst trapping on social media?"), tutorialLine("tyree", "No. And at this rate, you'll never be ranked."), tutorialLine("user", "Ranked?"), tutorialLine("tyree", "Tuner Rankings. Right now, you're both unranked, but taking down city bosses will help you shoot up to the top."), tutorialLine("user", "So basically... beat these bosses and I'm the greatest Tuner in the world."), tutorialLine("tyree", "Technically, yes."), tutorialLine("user", "Sick."), tutorialLine("tyree", "Which brings us to Head-to-Head racing."), tutorialLine("rival", "Mylo is good with straight lines. I think he struggles with turning."),
      tutorialChoice([
        tutorialChoiceOption("You sure you want to lose in front of Tyree?", [["rival", "You are dangerously committed to this bit."]]),
        tutorialChoiceOption("If I win, I'm taking your parking spot.", [["rival", "I don't have a parking spot."], ["user", "I'll take the idea of your parking spot."]]),
        tutorialChoiceOption("Friendly reminder that I'm still undefeated.", [["rival", "Against a Tutorque."], ["user", "Oh, so it's the car's fault. Wow. See what she thinks of you, Tutey?"], ["tutorque", "HONK!"], ["user", "That's exactly what I was saying."], ["rival", "Don't act like you understand it now. That's my bit."]])
      ]),
      tutorialLine("tyree", "Head-to-Head races test consistency, positioning, and adaptability under pressure."), tutorialLine("user", "So this one's personal."), tutorialLine("rival", "It was always personal."), tutorialLine("tyree", "Let's begin.")
    ],
    "head2head-intro": [tutorialLine("tyree", "Head-to-Head races take place on full tracks with turns, obstacles, and changing conditions."), tutorialLine("user", "Finally. Actual driving."), tutorialLine("rival", "Bold thing to say before your first corner."), tutorialLine("tyree", "Stay focused. A clean line beats raw speed."), tutorialLine("tyree", "Head-to-Head evaluation begins now.")],
    "head2head-win": [
      tutorialLine("tyree", "Hm."), tutorialLine("user", "Hm?? That's all I get?"), tutorialLine("rival", "You deserve more?"), tutorialLine("user", "Scoreboard."), tutorialLine("tutorque", "HONK."), tutorialLine("user", "Thank you. I agree, Tutes."), tutorialLine("tyree", "Your instincts are... unusual."), tutorialLine("user", "Good unusual?"), tutorialLine("tyree", "Undetermined."), tutorialLine("rival", "That means bad."),
      tutorialChoice([
        tutorialChoiceOption("Admit it. You're impressed.", [["tyree", "I'm evaluating you."], ["user", "That's not a no."]]),
        tutorialChoiceOption("So when do I get my championship trophy?", [["tyree", "Survive the evaluation first."]]),
        tutorialChoiceOption("Cha Cha almost had me for a second there.", [["rival", "I had cleaner lines. You got lucky."]])
      ]),
      tutorialLine("tyree", "One final evaluation remains."), tutorialLine("user", "Battle Mode?"), tutorialLine("tyree", "Battle Mode."), tutorialLine("user", "YES."), tutorialLine("rival", "You are way too excited about this.")
    ],
    "h2h-rival-stinger": [tutorialLine("rival", "Okay."), tutorialLine("rival", "That was better than I expected."), tutorialLine("user", "Wow. Was that almost a compliment?"), tutorialLine("rival", "Don't make it weird."), tutorialLine("user", "Too late."), tutorialLine("tutorque", "..."), tutorialLine("user", "Seriously, what's with the staring?"), tutorialLine("rival", "Tutorque doesn't usually watch first-years this closely."), tutorialLine("user", "Maybe it recognizes greatness."), tutorialLine("tutorque", "HONK."), tutorialLine("rival", "Or chaos."), tutorialLine("user", "That one sounded supportive."), tutorialLine("rival", "It absolutely did not."), tutorialLine("tyree", "The final evaluation is waiting.")],
    "h2h2battle": [
      tutorialLine("tyree", "Battle Arenas test the bond between Tuner and GearBorn directly."), tutorialLine("user", "So this is where things get dangerous."), tutorialLine("tyree", "Potentially."), tutorialLine("user", "Nice."), tutorialLine("rival", "Why are you excited by that?"), tutorialLine("user", "I don't know. Feels important."), tutorialLine("tyree", "Every GearBorn has unique abilities tied to Powertrain."), tutorialLine("tyree", "Strong Tuners synchronize those abilities with instinct."), tutorialLine("user", "You make it sound weirdly spiritual."), tutorialLine("tyree", "For some Tuners, it is."), tutorialLine("user", "This keeps getting cooler."),
      tutorialChoice([
        tutorialChoiceOption("I'm about to destroy Tutorque.", [["tutorque", "HONK."], ["rival", "That sounded offended."]]),
        tutorialChoiceOption("Is this actually Academy-approved?", [["tyree", "Officially, yes."], ["user", "Seems wild, but I'm not asking more questions."]]),
        tutorialChoiceOption("If I lose, I blame game balance.", [["rival", "Excuses before the battle is bold."]])
      ]),
      tutorialLine("tyree", "The Battle Arena is ahead."), tutorialLine("rival", "Try not to embarrass yourself."), tutorialLine("user", "When do I ever embarrass myself?")
    ],
    "battle-intro": [tutorialLine("tyree", "I had a whole speech prepared..."), tutorialLine("user", "The battle?"), tutorialLine("tyree", "There's important…"), tutorialLine("rival", "Battle?"), tutorialLine("tyree", "I liked it better when you couldn't agree on anything."), tutorialLine("tyree", "Let's go.")],
    "battle": [
      tutorialLine("user", "So the cars actually fight each other."), tutorialLine("tyree", "Correct."), tutorialLine("user", "And everyone just accepted that?"), tutorialLine("rival", "You accepted it instantly."), tutorialLine("user", "Because it rules."), tutorialLine("tyree", "You'll have different moves based on your car."), tutorialLine("user", "Which move does the most crushinating?"), tutorialLine("rival", "That's not a word."), tutorialLine("user", "She's so about to get crushinated."), tutorialLine("tyree", "Successful moves will help you earn a SPECIAL, which can't be defended."), tutorialLine("rival", "You are absolutely the type to button mash."), tutorialLine("user", "Strategy through aggression."), tutorialLine("tutorque", "HONK."), tutorialLine("user", "See? Tutorque gets it."), tutorialLine("rival", "I genuinely don't think it does."), tutorialLine("tyree", "We'll see if Mylo's strategy lives up to his confidence."), tutorialLine("user", "Joke's on you. It's your car."),
      tutorialChoice([
        tutorialChoiceOption("I'm winning this first turn.", [["rival", "You stopped paying attention after the word battle."], ["user", "Battle?"], ["rival", "Idiot."]]),
        tutorialChoiceOption("Mamburn looks nervous.", [["tutorque", "HONK."], ["tyree", "She's not nervous."]]),
        tutorialChoiceOption("Wait, can GearBorn trash talk each other?", [["tyree", "Not verbally."], ["user", "So emotionally."]])
      ]), tutorialLine("tyree", "Battle begins now.")
    ],
    "post-battle": [
      tutorialLine("tyree", "..."), tutorialLine("user", "You're doing the hmm thing again."), tutorialLine("tyree", "I'm thinking."), tutorialLine("user", "About how incredible I am?"), tutorialLine("rival", "That seems unlikely."), tutorialLine("tutorque", "HONK."), tutorialLine("tyree", "Your synchronization with Mamburn improved dramatically during that battle."), tutorialLine("user", "What does that mean?"), tutorialLine("tyree", "GearBorn respond differently depending on the Tuner. Timing. Emotion. Instinct."), tutorialLine("user", "So Mamburn likes me more than she lets on."), tutorialLine("mamburn", "VROOOOM. (He's alright.)"), tutorialLine("user", "Wait, I swear I understood that one."), tutorialLine("rival", "I think she was being polite."), tutorialLine("tyree", "Still... your battle instincts are unusually strong for a first-year."), tutorialLine("user", "You keep saying unusual like you're deciding whether to call security."),
      tutorialChoice([
        tutorialChoiceOption("Admit it. I crushed that.", [["tyree", "Your confidence continues to outpace your experience."]]),
        tutorialChoiceOption("Wait until you see me with my own GearBorn.", [["tyree", "Let's survive the evaluation first."]]),
        tutorialChoiceOption("Mamburn definitely likes me now.", [["tutorque", "HONK."], ["tyree", "Yes, I totally agree."], ["user", "Wait, do you understand him?"]])
      ]), tutorialLine("user", "Are we done? I can keep winning all day, but the fans are waiting."), tutorialLine("tyree", "Back to the map.")
    ],
    "map-final": [
      tutorialLine("tyree", "As your reputation grows, more race types unlock. Including Boss Challenges."), tutorialLine("user", "Wait. Do I get to race you?"), tutorialLine("tyree", "This is just an example."), tutorialLine("user", "You're kidding me."), tutorialLine("tyree", "Medallion Gauntlets and Pink Slip races unlock new GearBorn medallions."), tutorialLine("user", "Cool."), tutorialLine("tyree", "In Pink Slips, lose the race and you lose your car."), tutorialLine("user", "Cool. Cool cool cool."), tutorialLine("tyree", "Most Tuners spend years earning a Boss Challenge."), tutorialLine("user", "Give me two weeks."), tutorialLine("rival", "You really don't know when to stop talking."),
      tutorialChoice([
        tutorialChoiceOption("I'm beating all of them.", [["tyree", "Ambition is easy. Consistency is difficult."]]),
        tutorialChoiceOption("Which Boss is the strongest?", [["tyree", "Depends who you ask."], ["rival", "And whether they survived the race."]]),
        tutorialChoiceOption("Do any of them have normal hobbies?", [["rival", "Like pottery?"]])
      ]), tutorialLine("tyree", "Let's head to the garage."), tutorialLine("user", "Finally. The cool customization stuff.")
    ],
    "garage": [tutorialLine("user", "Okay. NOW this is sick."), tutorialLine("tyree", "This is the Garage. Every GearBorn you unlock, upgrade, and evolve lives here."), tutorialLine("user", "So this becomes my collection?"), tutorialLine("tyree", "Your responsibility."), tutorialLine("user", "Way less fun wording."), tutorialLine("rival", "Same meaning, though."), tutorialLine("tyree", "Every GearBorn has six core attributes:"), tutorialLine("tyree", "SPEED. ACCELERATION. HANDLING. TORQUE. BODY. POWERTRAIN."), tutorialLine("tyree", "SPEED affects top speed. ACCELERATION is how quickly a GearBorn gets there."), tutorialLine("tyree", "HANDLING is turning and stability. TORQUE improves shifting performance."), tutorialLine("user", "Sick."), tutorialLine("tyree", "BODY affects durability."), tutorialLine("user", "Less sick."), tutorialLine("tyree", "POWERTRAIN governs unique abilities."), tutorialLine("tutorque", "HONK."), tutorialLine("user", "Gesundheit.")],
    "upgrade": [tutorialLine("tyree", "Upgrading permanently improves a GearBorn's performance."), tutorialLine("user", "Jeez, these prices are insane."), tutorialLine("tyree", "Mamburn's already Level 9. Upgrades get expensive fast."), tutorialLine("user", "I can't afford that."), tutorialLine("tyree", "It's my vehicle. I'll cover the rest."), tutorialLine("user", "Dang. Was hoping you'd forget that it was yours."), tutorialLine("user", "Ooh. Big numbers."), tutorialLine("tyree", "Click LEVEL UP.")],
    "evolve": [tutorialLine("user", "Was that supposed to happen?"), tutorialLine("rival", "You already broke it."), tutorialLine("tyree", "You're gonna like this part. Click EVOLVE."), tutorialLine("user", "Uh..."), tutorialLine("user", "Was it supposed to do that?"), tutorialLine("tyree", "Hmm."), tutorialLine("user", "Stop hmm-ing and explain!"), tutorialLine("snaytan", "VROOOOOOM."), tutorialLine("tyree", "You triggered Mamburn's evolution."), tutorialLine("tyree", "She's now Snaytan."), tutorialLine("user", "How did YOU end up with an even cooler car?"), tutorialLine("tyree", "Those who can't do..."), tutorialLine("tyree", "Get someone to do it for them."), tutorialChoice([tutorialChoiceOption("You're welcome, by the way.", [["rival", "He paid for most of it!"]]), tutorialChoiceOption("Can I call you Dr. Snakes?", [["tyree", "No."]]), tutorialChoiceOption("I'm kind of attached now.", [["tyree", "Don't start trying to convince me."]])]), tutorialLine("user", "Oh no.")],
    "tyree-final": [tutorialLine("tyree", "Your evaluation is complete."), tutorialLine("user", "Cool. So where's the congratulations speech?"), tutorialLine("tyree", "I'm sorry. But I can't pass you."), tutorialLine("user", "What?"), tutorialLine("rival", "Wait… that's not right..."), tutorialLine("user", "I won all of the races. Mamburn literally evolved."), tutorialLine("tyree", "This evaluation measures more than results."), tutorialLine("user", "Then what was the point of any of this?"), tutorialLine("tyree", "Cha Cha needed a competitive benchmark for Academy recommendation."), tutorialLine("user", "..."), tutorialLine("user", "So I was just practice?"), tutorialLine("rival", "That's not…"), tutorialLine("tyree", "You demonstrated strong instincts. But instinct alone isn't enough."), tutorialLine("user", "You said bonding mattered."), tutorialLine("tyree", "It does. But the Academy requires more than a bond with an evaluation vehicle."), tutorialLine("user", "What am I missing?"), tutorialLine("tyree", "Control."), tutorialLine("tyree", "You may apply again next year."), tutorialLine("user", "Next year?! Are you serious?!"), tutorialLine("rival", "..."), tutorialLine("user", "Say something."), tutorialLine("rival", "I didn't know this was how they were scoring it."), tutorialLine("user", "Right. Apparently everybody knew except me."), tutorialLine("tyree", "Please return the key."), tutorialLine("user", "Oh. Yeah."), tutorialLine("key", "Dr. Tyree takes back his GearBorn Key."), tutorialLine("tyree", "Mamburn performed exceptionally today."), tutorialLine("user", "Glad somebody passed."), tutorialLine("tyree", "I am sorry, Mylo.")],
    "empty-garage": [tutorialLine("user", "..."), tutorialLine("user", "Cool."), tutorialLine("user", "Apply again next year."), tutorialLine("user", "Sick."), tutorialLine("user", "..."), tutorialLine("tutorque", "HONK."), tutorialLine("user", "Oh."), tutorialLine("user", "You came back to laugh at me too?"), tutorialLine("tutorque", "HONK."), tutorialLine("user", "What are you doing?"), tutorialLine("user", "What are those?"), tutorialLine("tutorque", "HONK."), tutorialLine("user", "I really wish I understood those honks."), tutorialLine("narration", "MEDALLIONS_ACQUIRED"), tutorialLine("user", "What the heck are these?")],
    "ashley-intro": [tutorialLine("ashley", "Quick, Astro. They're gone."), tutorialLine("ashley", "Who are you? This place is supposed to be empty."), tutorialLine("user", "I'm leaving. Sorry."), tutorialLine("ashley", "Wait… did you just take Tyree's evaluation?"), tutorialLine("user", "Took it. Failed it."), tutorialLine("ashley", "Then how'd you get those medallions?"), tutorialLine("user", "These? Tutorque left them."), tutorialLine("ashley", "Just left them. Like it gave them to you."), tutorialLine("user", "Yeah. It kind of just plopped them down."), tutorialLine("ashley", "A Tutorque gave you medallions."), tutorialLine("user", "Is that weird?"), tutorialLine("ashley", "Tutorques don't hand out medallions unless they recognize a bond."), tutorialLine("user", "A bond?"), tutorialLine("ashley", "Real synchronization. Not keys. Not rankings. Not Academy approval."), tutorialLine("ashley", "Actual connection."), tutorialLine("user", "Who are you?"), tutorialLine("ashley", "Ashley Racem. Basically the Spindell Academy's worst enemy."), tutorialLine("user", "So Tyree was wrong?"), tutorialLine("ashley", "Tyree sees the world through rules. GearBorn don't always care about rules."), tutorialLine("ashley", "Come on."), tutorialLine("user", "Where are we going?"), tutorialLine("ashley", "Somewhere the Academy really wouldn't want you seeing."), tutorialLine("user", "That is the coolest possible answer you could've given."), tutorialLine("ashley", "Yeah. I get that a lot.")],
    "the-forge": [tutorialLine("user", "Okay."), tutorialLine("user", "THIS is insane."), tutorialLine("ashley", "Welcome to the Forge."), tutorialLine("user", "This place looks illegal."), tutorialLine("ashley", "That's because it mostly is."), tutorialLine("user", "What even IS this?"), tutorialLine("ashley", "Before the Academy turned medallions into rankings and gatekeeping..."), tutorialLine("ashley", "The Forge was how Tuners bonded with GearBorn."), tutorialLine("user", "And this still works?"), tutorialLine("ashley", "Better than the Academy does."), tutorialLine("auntie", "ASHLEY. Is that a new one?! He's cute!"), tutorialLine("user", "What?"), tutorialLine("ashley", "Ignore her."), tutorialLine("auntie", "Look at this one! Fresh from the Academy, yeah? They really sent you out there with nothing?"), tutorialLine("user", "I... hi."), tutorialLine("auntie", "Don't be shy. Turn around. Let me see if you look like a racer."), tutorialLine("user", "I'm not going to…"), tutorialLine("ashley", "AUNTIE."), tutorialLine("auntie", "I'm just looking! You bring a new kid into my Forge and I'm not allowed to look?"), tutorialLine("user", "Is she always —"), tutorialLine("ashley", "Yes."), tutorialLine("auntie", "I'm The Aunt, but my friends call me Auntie."), tutorialLine("ashley", "Auntie! No! This is Mylo Ziggs."), tutorialLine("auntie", "Mylo Ziggs. Hm. You got the energy of someone who's almost right but not quite there yet."), tutorialLine("user", "Thanks?"), tutorialLine("auntie", "That was a compliment. You'll know when it's not."), tutorialLine("ashley", "Auntie is…"), tutorialLine("auntie", "The most important person here, yes, go on."), tutorialLine("ashley", "The medallions Tutorque gave you contain dormant GearBorn bonds."), tutorialLine("ashley", "The Forge awakens them."), tutorialLine("user", "So I'm basically hatching a car."), tutorialLine("ashley", "That is the least magical way you could've phrased that."), tutorialLine("auntie", "I kind of love it actually."), tutorialChoice([tutorialChoiceOption("What if I pick wrong?", [["ashley", "Then they wouldn't have answered you."], ["auntie", "The GearBorn already made the choice, baby. You're just confirming it."]]), tutorialChoiceOption("Can I unlock all of them?", [["ashley", "Now you're thinking like a Tuner."], ["auntie", "I like this one."]]), tutorialChoiceOption("This still feels extremely illegal.", [["ashley", "Illegal's mostly just a confidence thing."], ["auntie", "Everything fun is a little illegal, sweetheart."]])]), tutorialLine("ashley", "Go ahead. Place the medallion into the Forge."), tutorialLine("auntie", "And try not to look so scared. The GearBorn can sense it."), tutorialLine("user", "I'm not scared."), tutorialLine("auntie", "Uh huh.")],
    "medallion-unlock": [tutorialLine("user", "Okay."), tutorialLine("user", "That was WAY cooler than the Academy."), tutorialLine("ashley", "I wish Tyree was here to hear you say that."), tutorialLine("user", "I absolutely want Tyree to hear me say that."), tutorialLine("auntie", "He'd make a face. I've seen that face. It's a great face."), tutorialLine("ashley", "Your first real GearBorn answered your call."), tutorialLine("auntie", "First of many, Mylo Ziggs. First of many.")],
    "unlocked": [tutorialLine("user", "No way."), tutorialLine("user", "That one's mine?"), tutorialLine("ashley", "Yours if you earn the bond. GearBorn choose who they trust."), tutorialLine("auntie", "They already chose. The bond part is you proving you deserve it."), tutorialLine("user", "Okay, that's still taking me a second to process."), tutorialLine("auntie", "Take your time. But not too much time. There's a whole world out there."), tutorialLine("ashley", "The world's a lot bigger than the Academy made it seem."), tutorialLine("ashley", "Hundreds of GearBorn. Different cities. Different Tuners. Different GearBorn."), tutorialLine("user", "And all of them can evolve?"), tutorialLine("ashley", "If the bond's strong enough."), tutorialLine("ashley", "Here. Download this."), tutorialLine("user", "VINdex?"), tutorialLine("ashley", "Tracks every GearBorn you encounter."), tutorialLine("ashley", "Once you see a GearBorn, its basic info gets logged automatically."), tutorialLine("ashley", "Unlocking one reveals evolution paths and deeper data."), tutorialLine("user", "So basically a giant GearBorn encyclopedia."), tutorialLine("auntie", "With a lot of entries that'll make you want to quit your normal life."), tutorialLine("user", "I don't have a normal life."), tutorialLine("auntie", "Even better."), tutorialChoice([tutorialChoiceOption("I'm absolutely collecting all of them.", [["ashley", "Careful. That's how the obsession starts."], ["auntie", "Don't be careful. The obsession is the point."]]), tutorialChoiceOption("This feels weirdly addictive already.", [["ashley", "Welcome to the club."], ["auntie", "There's no leaving the club, by the way."]]), tutorialChoiceOption("Wait, there are HUNDREDS of these things?", [["ashley", "You haven't even scratched the surface."], ["auntie", "Hundreds and counting. New ones turn up when you least expect it."]])]), tutorialLine("ashley", "Open it up. I'll show you how it works.")],
    "vindex": [tutorialLine("user", "Okay, this is actually super clean."), tutorialLine("ashley", "The VINdex logs every GearBorn you encounter."), tutorialLine("ashley", "Seen GearBorn get basic entries. Bonded GearBorn unlock full records."), tutorialLine("user", "So the goal is basically to fill the whole thing out."), tutorialLine("ashley", "For some Tuners, yeah. Others chase strength. Reputation. Money."), tutorialLine("auntie", "The really good ones do all of it and act like it's nothing."), tutorialChoice([tutorialChoiceOption("Which one's your favorite?", [["ashley", "Depends on the day. And how much property damage I'm trying to avoid."], ["auntie", "Mine changes every time I fall asleep and dream about them."], ["user", "That's adorable and concerning."]]), tutorialChoiceOption("So there are legendary GearBorn too, right?", [["ashley", "Oh, absolutely. Some people spend their whole lives chasing them."], ["auntie", "Don't tell him that yet. Let him find out the hard way."]]), tutorialChoiceOption("I'm definitely finding the weirdest one possible.", [["ashley", "I'm starting to get that about you."], ["auntie", "Smart boy."]])]), tutorialLine("ashley", "There's one more thing you should know before I turn you loose."), tutorialLine("ashley", "Open Achievements.")],
    "achievements": [tutorialLine("user", "Oh no. There are percentages."), tutorialLine("ashley", "Tuners love percentages."), tutorialLine("auntie", "I hate percentages. The road doesn't care about percentages."), tutorialLine("ashley", "Auntie hates everything that isn't instinct-based."), tutorialLine("auntie", "That's not true. I love a good spreadsheet if the numbers are real."), tutorialLine("user", "This is how people lose hundreds of hours of their lives, huh?"), tutorialLine("ashley", "Thousands, usually."), tutorialLine("ashley", "Achievements track major milestones: race wins, Boss victories, discoveries, evolutions."), tutorialLine("ashley", "They reward Sprox, medallions, and rare unlocks. Don't ignore them."), tutorialLine("user", "So the races reward me for becoming emotionally unhealthy."), tutorialLine("ashley", "Now you're understanding competitive racing culture."), tutorialLine("auntie", "You're already one of us. You just don't know it yet."), tutorialLine("ashley", "The Academy teaches people how to follow the road."), tutorialLine("ashley", "But the best Tuners find their own route."), tutorialLine("auntie", "And then they get the Academy mad about it. That's the fun part.")],
    "end": [tutorialLine("ashley", "Out there, nobody cares whether the Academy passed you or not."), tutorialLine("ashley", "Bosses care about reputation. Tuners care about results. GearBorn care about connection."), tutorialLine("user", "So what now?"), tutorialLine("ashley", "Now you build your reputation."), tutorialLine("ashley", "Challenge city bosses. Unlock stronger GearBorn."), tutorialLine("ashley", "Figure out what kind of Tuner you want to become."), tutorialLine("user", "Sounds easy enough."), tutorialLine("ashley", "It really, REALLY isn't."), tutorialLine("user", "So where do I start?"), tutorialLine("ashley", "Indianapolis. There's someone you should meet."), tutorialLine("user", "Let's go."), tutorialLine("narration", "END OF PROLOGUE")]
  },
  "cha-cha": {
    "intro": [tutorialLine("user", "Hi, sorry I'm late."), tutorialLine("tyree", "Not a problem at all."), tutorialLine("tyree", "We can start whenever you're ready."), tutorialLine("user", "You don't have to do that."), tutorialLine("tyree", "Do what?"), tutorialLine("user", "Treat me like my name's on the building."), tutorialLine("tyree", "I'm Dr. Tyree. I'll be conducting your evaluation today."), tutorialLine("user", "Shane, I've known you since I was six."), tutorialLine("tyree", "I thought you wanted the normal treatment."), tutorialLine("user", "Sorry, you're right."), tutorialLine("tyree", "You can still call me Shane."), tutorialLine("user", "Dr. Tyree."), tutorialChoice([tutorialChoiceOption("I've been looking forward to this.", [["tyree", "We've been looking forward to this all year."], ["user", "Dr. Tyree…"]]), tutorialChoiceOption("Let's just get it over with.", [["tyree", "I'm sorry, do you want me to skip to the last part of the test?"], ["user", "Forget it."]]), tutorialChoiceOption("Please just evaluate me like anyone else. If I fail, it's better luck next year.", [["tyree", "For which one of us?"], ["user", "Ugh. Let's just do this already."]])]), tutorialLine("tyree", "Follow me.")],
    "rival-intro": [tutorialLine("rival", "Her?"), tutorialLine("user", "Him?"), tutorialLine("rival", "Dr. Tyree?"), tutorialLine("tyree", "What do I have to do with this?"), tutorialLine("user", "He was doing a stupid bit as usual. Why is he here?"), tutorialLine("tyree", "He's been here every day for the last week begging me to evaluate him, so I finally said yes."), tutorialLine("rival", "Persistence. Like a great Tuner."), tutorialLine("user", "Great gooner?"), tutorialLine("rival", "What?"), tutorialLine("tyree", "I'm not sure I understood that. What did you say, Miss Spindell?"), tutorialLine("user", "Move on."), tutorialLine("user", "Please just tell me we're not racing each other."), tutorialLine("rival", "Nervous?"), tutorialChoice([tutorialChoiceOption("I'm concerned for your feelings, actually.", [["rival", "You don't even have feelings."], ["user", "I'm actually a very caring person."], ["rival", "You're really not."], ["user", "I care about GearBorn, less about people."]]), tutorialChoiceOption("I used to beat you every time when we were kids.", [["rival", "We were eight."], ["user", "So what about when we were 10, 12, 15…"], ["rival", "You remember too much."]]), tutorialChoiceOption("Just trying to remember that nickname my dad used to call you.", [["rival", "Don't…"], ["user", "Sidecar."], ["rival", "Don't call me that!"]])]), tutorialLine("tyree", "If you two are done, we can get to evaluations."), tutorialLine("user", "Both of us?"), tutorialLine("tyree", "Both of you."), tutorialLine("rival", "Does she get extra credit for the last name?"), tutorialLine("user", "Do you get extra time? Like you do on tests?"), tutorialLine("tyree", "Can we just move on? Before someone says something they can't take back?")],
    "mamburn": [tutorialLine("tyree", "Normally, first-year evaluations use Academy Tutorques, but I've only got one today."), tutorialLine("tyree", "Cha Cha, you'll be borrowing my GearBorn."), tutorialLine("tyree", "Meet Mamburn."), tutorialLine("user", "Oh."), tutorialLine("user", "She's…"), tutorialLine("user", "Hi."), tutorialLine("mamburn", "VROOOOM."), tutorialLine("user", "Hi."), tutorialLine("rival", "Did you just say hi twice?"), tutorialLine("user", "I was being polite."), tutorialLine("rival", "What do I drive?"), tutorialLine("tyree", "Meet Tutorque."), tutorialLine("tutorque", "HONK."), tutorialLine("rival", "…No."), tutorialLine("tyree", "Yes."), tutorialLine("user", "YES!"), tutorialLine("rival", "That thing?"), tutorialLine("user", "Don't be rude, Mylo. You should be able to beat me in anything."), tutorialChoice([tutorialChoiceOption("I know you're not a driver. How do you have a Mamburn?", [["tyree", "What did you think I drove?"], ["user", "A motorized filing cabinet?"], ["tyree", "There IS quite a bit of documentation in the glove box."], ["user", "Don't ruin this."]]), tutorialChoiceOption("Do you drive her or do you just own her?", [["tyree", "Both."], ["user", "When was the last time you drove her?"], ["tyree", "Last week."], ["user", "Where?"], ["tyree", "Stop interrogating me. This is my car!"]]), tutorialChoiceOption("Mylo, it even has little training wheels for you.", [["rival", "Oh, come on."], ["user", "Maybe they can put bumpers on the track too like in bowling."], ["tyree", "We don't do that."], ["rival", "Phew."]])]), tutorialLine("tyree", "Scientists at Spindell Labs have perfected communication with GearBorn via the GearBorn Key."), tutorialLine("user", "This isn't my first rodeo."), tutorialLine("tyree", "Then this should come naturally. Here."), tutorialLine("key", "Dr. Tyree lent you his GearBorn Key."), tutorialLine("user", "I'm not my parents."), tutorialLine("tyree", "That doesn't make me confident as I'm lending you my car…"), tutorialLine("user", "I just mean that it's not natural."), tutorialLine("rival", "We can tell by your racing."), tutorialLine("user", "Don't listen to him."), tutorialLine("user", "I might be a good driver, but it has nothing to do with my parents."), tutorialLine("tyree", "I'm sorry. Just please treat Mamburn with care."), tutorialLine("rival", "Care is that thing where…"), tutorialLine("user", "Mamburn, I promise.")],
    "city-map": [tutorialLine("tyree", "As you know well, Tuners travel the world competing in races. Part of the benefit is getting to explore the globe."), tutorialLine("user", "I've been to most of these cities, but never through my eyes, you know?"), tutorialLine("tyree", "I didn't think about that."), tutorialLine("rival", "These cars don't swim, do they?"), tutorialChoice([tutorialChoiceOption("Which cities do top-ranked Tuners go to first?", [["tyree", "The ones who belong there earn the choice."], ["user", "That's not an answer."], ["tyree", "Isn't it?"], ["user", "Shane, you're not the Riddler."]]), tutorialChoiceOption("My mom always said Bengaluru's the hardest circuit.", [["tyree", "She's right."], ["user", "Unfortunately, she usually is. And she'll let you know it."]]), tutorialChoiceOption("I'm excited to go to Seoul.", [["tyree", "Oh yes, Seoul was added to the circuit last year."], ["rival", "Do I get to meet Rip Lee?"], ["user", "Tell me you're not into K-Pop."], ["rival", "Are you not?"], ["user", "Of course, but I was also a teenage girl."]])]), tutorialLine("tyree", "Drag Races test acceleration and shifting. Head-to-Head tests consistency. Battle Arenas test the GearBorn bond directly."), tutorialLine("rival", "The cars actually fight?"), tutorialLine("user", "I've been waiting for someone to react to that like it's news."), tutorialLine("tyree", "Boss Challenges are reserved for elite Tuners."), tutorialLine("user", "How do you define elite?"), tutorialLine("tyree", "The track defines it."), tutorialLine("user", "Good.")],
    "drag-race-intro": [tutorialLine("tyree", "Drag Races. Two Tuners. One straight track. Fastest finish wins."), tutorialLine("user", "I've watched hundreds of these."), tutorialLine("rival", "Watching and doing…"), tutorialLine("tyree", "I'm sure you have. Mack Spindell is practically the face of drag."), tutorialLine("rival", "You're thinking of RuPaul."), tutorialChoice([tutorialChoiceOption("This is what I've trained for.", [["rival", "What's with that face?"], ["user", "I'm visualizing."], ["rival", "You look like you're trying to force out a fart."]]), tutorialChoiceOption("Tutorque looks confident. I respect that.", [["rival", "There's still time for us to trade."], ["user", "Not happening."]]), tutorialChoiceOption("Is there a warm-up lap or do we just go?", [["tyree", "We just go."], ["user", "Okay. Cool. Just checking for Mylo."]])]), tutorialLine("tyree", "Let's get you into the cars.")],
    "drag-race-win": [tutorialLine("tyree", "Excellent, Cha Cha."), tutorialLine("user", "Thank you. I'll hit third gear quicker next time."), tutorialLine("tyree", "You did great for a first time."), tutorialLine("user", "I don't want great for…, I'm great. Period."), tutorialLine("rival", "She won and she's upset about winning."), tutorialLine("tutorque", "HONK."), tutorialLine("user", "It's called having standards."), tutorialChoice([tutorialChoiceOption("The goal isn't to win. It's to be undeniable.", [["rival", "Did your mom say that?"], ["user", "No."], ["rival", "You said it like she says things."], ["user", "Can we not?"]]), tutorialChoiceOption("I want the sector data. I know I can improve.", [["tyree", "Later."], ["user", "I just want the numbers. I just need…"], ["tyree", "Later."], ["user", "Fine. But I'm going to think about this until then."]]), tutorialChoiceOption("Good enough isn't good enough.", [["tyree", "That's a Mack Spindell quote."], ["user", "You grow up in that house and it becomes…"], ["rival", "Second nature?"], ["user", "Generational trauma."]])]), tutorialLine("tyree", "Winning earns Sprox. Used for upgrades and progression."), tutorialLine("tyree", "Raw speed won't carry you far."), tutorialLine("user", "I'm more than just speed."), tutorialLine("tyree", "Let's move on.")],
    "rival-stinger": [tutorialLine("rival", "Nice race."), tutorialLine("user", "A compliment? That's not like you."), tutorialLine("rival", "You're intense."), tutorialLine("user", "I've been told."), tutorialLine("rival", "Can we just start over? I don't even know what I did wrong."), tutorialLine("user", "What a question."), tutorialLine("tutorque", "honk."), tutorialLine("rival", "See? Tutorque agrees. What's so bad about me?"), tutorialLine("user", "Tutorque doesn't know you like I do."), tutorialLine("rival", "You haven't known me in years."), tutorialLine("user", "You haven't changed."), tutorialLine("tyree", "Move. We don't have time for this.")],
    "drag2h2h": [tutorialLine("tyree", "If you want the city bosses to take you seriously, you'll need to build your reputation through racing."), tutorialLine("user", "How is reputation measured?"), tutorialLine("tyree", "Wins. Consistency. And eventually… rank."), tutorialLine("rival", "Rank?"), tutorialLine("tyree", "Tuner Rankings. Right now you're both unranked. Beating city bosses changes that."), tutorialLine("user", "Where does Indianapolis put us?"), tutorialLine("tyree", "Beat Rev-rend and find out."), tutorialLine("tyree", "Head-to-Head racing. Next."), tutorialLine("user", "Drag, Head-to-Head, Battle. Standard evaluation sequence."), tutorialLine("rival", "You studied the sequence?"), tutorialLine("user", "I study everything. It's compulsive."), tutorialChoice([tutorialChoiceOption("Great racers don't like variables.", [["rival", "Ok."], ["user", "You did the face."], ["rival", "I have one face."], ["user", "Well, fix it."]]), tutorialChoiceOption("Preparation isn't a personality flaw.", [["rival", "Doesn't it take the joy out of it?"], ["user", "The preparation IS the joy."], ["user", "I'm aware of how that sounds."]]), tutorialChoiceOption("Don't you study?", [["rival", "I mean... I watch races. That's like… half the work."], ["user", "And how's that other half working?"], ["rival", "I'm here, aren't I?"], ["user", "We're both here. That's the whole problem."]])]), tutorialLine("tyree", "Head-to-Head tests consistency, positioning, and adaptability."), tutorialLine("user", "I've been told I'm at my best in Head-to-Head."), tutorialLine("rival", "Who told you that?"), tutorialLine("user", "People who've watched me race."), tutorialLine("rival", "They can watch your test runs?"), tutorialLine("user", "I stream…?"), tutorialLine("rival", "Got it, so people who watch you play video games told you that.")],
    "head2head-intro": [tutorialLine("tyree", "A clean line beats raw speed."), tutorialLine("user", "This is the part I've been waiting for."), tutorialLine("rival", "Finally you sound like a person who's excited about something."), tutorialLine("user", "I've been excited the whole time."), tutorialLine("rival", "You seemed like you were doing an audit."), tutorialLine("user", "Both can be true."), tutorialLine("tyree", "Head-to-Head evaluation begins now.")],
    "head2head-win": [tutorialLine("tyree", "Very clean."), tutorialLine("user", "Can we run that back? I clipped the grass."), tutorialLine("rival", "Ever the perfectionist."), tutorialLine("user", "It felt slow."), tutorialLine("rival", "Now I feel worse. Can I blame the car?"), tutorialLine("tutorque", "HONK."), tutorialLine("tyree", "You did great, Tutorque. Cha Cha was just better this time."), tutorialLine("user", "I was hoping just to crush Mylo's spirit, not Tutorque."), tutorialLine("tyree", "Tutorque performed great."), tutorialLine("rival", "Fine, fine. It was me."), tutorialChoice([tutorialChoiceOption("Can I see the sector times now?", [["tyree", "Later."], ["user", "I've been waiting patiently."], ["tyree", "I know."], ["user", "I just wanted recognition for that."]]), tutorialChoiceOption("Do you have any tips for me on my line?", [["tyree", "Tighten your entry into turn four."], ["user", "That's what I would have said."], ["rival", "Then why did you ask?"], ["user", "Trying to be more humble. Not a fan of it."]]), tutorialChoiceOption("That one actually felt good.", [["rival", "Was that an emotion?"], ["user", "A small one. Don't get too excited."]])]), tutorialLine("tyree", "One evaluation left."), tutorialLine("user", "Battle Arena."), tutorialLine("rival", "She already knew."), tutorialLine("user", "How many times do I have to mention I read the manual?")],
    "h2h-rival-stinger": [tutorialLine("rival", "You're good."), tutorialLine("user", "Yes."), tutorialLine("rival", "Can you let me finish?"), tutorialLine("user", "Sorry. You're right. Go ahead."), tutorialLine("rival", "You're good. But you'd be better if you weren't always trying so hard to be perfect."), tutorialLine("user", "I appreciate the advice of someone who just lost two races to me."), tutorialLine("rival", "You know I'm right."), tutorialLine("user", "You think I'm trying to prove something?"), tutorialLine("rival", "Yeah."), tutorialLine("user", "That's because I am."), tutorialLine("rival", "To who?"), tutorialLine("mamburn", "VRROOOOOOM!!"), tutorialLine("user", "That's none of your business."), tutorialLine("rival", "Yeah. I figured."), tutorialLine("tyree", "Final evaluation.")],
    "h2h2battle": [tutorialLine("tyree", "Battle Arenas test the bond between Tuner and GearBorn directly."), tutorialLine("user", "How do you test a bond?"), tutorialLine("tyree", "You'll know when you're in it."), tutorialLine("user", "That is a deeply unsatisfying answer."), tutorialLine("tyree", "It's the accurate one."), tutorialLine("tyree", "Strong Tuners synchronize their GearBorn's abilities with instinct."), tutorialLine("user", "With instinct. Not training."), tutorialLine("tyree", "Both. But instinct leads."), tutorialLine("user", "You're starting to sound like Mylo."), tutorialLine("rival", "I'm actually pretty smart sometimes."), tutorialLine("tyree", "This one he might be right on."), tutorialChoice([tutorialChoiceOption("What kind of strategy is instincts?", [["rival", "A winning one."], ["user", "Says the guy who's never won and the other who doesn't drive."]]), tutorialChoiceOption("I'm not sure you know what you're talking about.", [["tyree", "The race will teach you more than I can."], ["user", "This is why you have a phD and not a license."], ["tyree", "What? I have a license. I just don't use it much."]]), tutorialChoiceOption("Why do I feel like this whole evaluation has been about something other than racing?", [["tyree", "It has been."], ["user", "That wasn't…"], ["tyree", "…in the manual. I know."], ["user", "Well, was it meant to be?"], ["tyree", "No."]])]), tutorialLine("rival", "Try not to out-think your own car."), tutorialLine("user", "What does that mean?"), tutorialLine("rival", "Sometimes you just gotta…"), tutorialLine("user", "If you say drive I'm going to…"), tutorialLine("rival", "I was going to say feel the wheel, but drive is actually way better."), tutorialLine("user", "I can't wait to crush you.")],
    "battle-intro": [tutorialLine("tyree", "The Battle Arena…"), tutorialLine("user", "Let's get moving here."), tutorialLine("tyree", "I was going to…"), tutorialLine("rival", "Battle."), tutorialLine("tyree", "Would you let me…"), tutorialLine("user", "Battle."), tutorialLine("tyree", "I genuinely liked it better when you two weren't agreeing on things.")],
    "battle": [tutorialLine("tyree", "You'll have different moves based on your car. Successful moves earn you a SPECIAL."), tutorialLine("user", "How many moves exactly?"), tutorialLine("tyree", "You'll feel it."), tutorialLine("user", "I would like a number."), tutorialLine("tyree", "No."), tutorialLine("user", "A range?"), tutorialLine("tyree", "No."), tutorialLine("user", "A general ballpark…"), tutorialLine("tyree", "SPECIALs can't be defended. Attack or take the full hit."), tutorialLine("user", "You're doing this on purpose."), tutorialLine("rival", "He definitely is."), tutorialChoice([tutorialChoiceOption("Fine. I'll figure this out myself.", [["tyree", "That's kind of the point."], ["user", "You could just give me the answer."], ["rival", "Mommy, it's too hard!"], ["user", "I'm trying not to fail my way through life. I've seen how that's gone for you."]]), tutorialChoiceOption("Everything has a pattern. I'll find it.", [["rival", "You're going to be analyzing the pattern while it's hitting you."], ["user", "That's called multi-tasking."]]), tutorialChoiceOption("Okay. I'm trusting Mamburn on this one.", [["tyree", "She's quite smart."], ["user", "I just can't understand how she's yours."]])]), tutorialLine("tyree", "Battle begins now.")],
    "post-battle": [tutorialLine("user", "..."), tutorialLine("rival", "You're quiet."), tutorialLine("user", "I'm thinking."), tutorialLine("rival", "Usually you're thinking out loud."), tutorialLine("user", "Not about this."), tutorialLine("tyree", "Your synchronization with Mamburn changed during that battle."), tutorialLine("user", "I felt it."), tutorialLine("tyree", "What did it feel like?"), tutorialLine("user", "Like…"), tutorialLine("mamburn", "VROOOOM. (She's ready.)"), tutorialLine("user", "Did you understand that too?"), tutorialLine("tyree", "Yes. That's the bond."), tutorialChoice([tutorialChoiceOption("I thought this was all just something dumb my mom made up.", [["tyree", "She's one of the people who's discovered the most about bonds."], ["user", "I didn't know that…"], ["tyree", "She's more than just a top racer."], ["user", "And a strict mom…"]]), tutorialChoiceOption("You can't prepare for that.", [["tyree", "No. You can only make room for it."], ["user", "My whole training was preparation."], ["tyree", "It got you to the door."], ["user", "And the door was..."], ["tyree", "That battle."]]), tutorialChoiceOption("I want that. With my own GearBorn. I want that specifically.", [["tyree", "You'll get there in time."], ["user", "I need a week, two tops."]])]), tutorialLine("rival", "That was actually incredible."), tutorialLine("user", "Don't."), tutorialLine("rival", "I'm not. I mean it."), tutorialLine("user", "Thank you."), tutorialLine("user", "That was weird to say."), tutorialLine("rival", "You're fine."), tutorialLine("tyree", "Back to the map.")],
    "map-final": [tutorialLine("tyree", "As reputation grows, more race types unlock. Including Boss Challenges."), tutorialLine("user", "Who's the example here?"), tutorialLine("tyree", "This is just an example."), tutorialLine("user", "That's you."), tutorialLine("tyree", "It's just for this."), tutorialLine("rival", "She wants to race you."), tutorialLine("user", "I'm going to race you."), tutorialLine("tyree", "I know."), tutorialLine("tyree", "Medallion Gauntlets and Pink Slip races unlock new GearBorn medallions."), tutorialLine("user", "Both of them?"), tutorialLine("tyree", "The twist on Pink Slips is you risk your car."), tutorialLine("user", "Not a problem."), tutorialLine("rival", "Can I skip those ones?"), tutorialLine("tyree", "If you don't want all the cars."), tutorialChoice([tutorialChoiceOption("I want all of them.", [["rival", "I do too!"], ["user", "Yeah, but I actually have a shot."]]), tutorialChoiceOption("I don't think I'll lose one anyway.", [["rival", "Me neither."], ["user", "We believe you."], ["rival", "You're a fair system."], ["user", "Thank you?"]]), tutorialChoiceOption("Mylo should probably avoid those ones.", [["rival", "Yikes."], ["tyree", "She's not wrong."], ["user", "I know. I usually check before I say things."], ["user", "Usually."]])]), tutorialLine("tyree", "Let's head to the garage.")],
    "garage": [tutorialLine("user", "This is the part I was excited about."), tutorialLine("tyree", "The Garage. Every GearBorn you unlock, upgrade, and evolve lives here."), tutorialLine("user", "My garage."), tutorialLine("tyree", "Your responsibility."), tutorialLine("user", "Right. Yes. That's fine."), tutorialLine("rival", "She froze."), tutorialLine("user", "I processed briefly."), tutorialLine("tyree", "Six core attributes: SPEED, ACCELERATION, HANDLING, TORQUE, BODY, POWERTRAIN."), tutorialLine("user", "SPEED is top speed, ACCELERATION is how fast you get there, HANDLING is cornering, TORQUE is shifting, BODY is durability, POWERTRAIN governs abilities."), tutorialLine("tyree", "Correct."), tutorialLine("rival", "She memorized the stat sheet."), tutorialLine("user", "Obviously."), tutorialLine("user", "Also POWERTRAIN is the most interesting one and I want to know everything about it."), tutorialLine("tyree", "Later."), tutorialLine("user", "I'm going to keep asking."), tutorialLine("tyree", "I assumed.")],
    "upgrade": [tutorialLine("tyree", "Upgrading permanently improves performance."), tutorialLine("user", "Mamburn's already Level 9."), tutorialLine("tyree", "Upgrades get expensive at higher levels. I'll cover it."), tutorialLine("user", "You don't have to."), tutorialLine("tyree", "It's my car."), tutorialLine("user", "Right. Sorry."), tutorialLine("rival", "Does she always apologize when someone's generous?"), tutorialLine("user", "I don't know how to receive things I didn't earn."), tutorialLine("rival", "...Huh?"), tutorialLine("user", "Was that confusing for you?"), tutorialLine("rival", "A little bit. Don't worry about it."), tutorialLine("tyree", "Click LEVEL UP.")],
    "evolve": [tutorialLine("user", "Is that—"), tutorialLine("tyree", "Click EVOLVE."), tutorialLine("user", "Dr. Tyree—"), tutorialLine("tyree", "Click EVOLVE, Cha Cha."), tutorialLine("user", "Oh."), tutorialLine("user", "Oh, she's…"), tutorialLine("snaytan", "VROOOOOOM."), tutorialLine("user", "Hi."), tutorialLine("rival", "You said hi again."), tutorialLine("user", "It felt appropriate again."), tutorialLine("tyree", "You triggered her evolution. She's Snaytan now."), tutorialLine("user", "I did that."), tutorialLine("tyree", "You did."), tutorialLine("user", "I didn't…"), tutorialLine("user", "How did I do that? What exactly did I do? I…"), tutorialLine("rival", "She's out of words."), tutorialLine("user", "I have a lot of words. I'm choosing not to use them."), tutorialChoice([tutorialChoiceOption("What made it happen? I need to know every variable.", [["tyree", "It's a combination of bond and upgrade level."], ["user", "It did that because of me."]]), tutorialChoiceOption("That was real. That was a real thing that I did.", [["tyree", "Yes."], ["user", "And nobody…"], ["tyree", "And nobody gave it to you."], ["user", "I'm going to be normal about this in a second. Give me a moment."]]), tutorialChoiceOption("She's so much cooler now.", [["tyree", "You absolutely should feel responsible."], ["user", "Right?"], ["user", "That came out weird but it's genuinely the most exciting thing that's happened to me."], ["rival", "Ever?"]])]), tutorialLine("tyree", "One final matter."), tutorialLine("user", "I know."), tutorialLine("tyree", "Do you?"), tutorialLine("user", "I think so. Yes.")],
    "tyree-final": [tutorialLine("tyree", "Your evaluation is complete."), tutorialLine("user", "And?"), tutorialLine("tyree", "You passed. Easily."), tutorialLine("user", "I know."), tutorialLine("rival", "Don't act like you weren't just worried."), tutorialLine("tyree", "Academy recommendation, pending board review."), tutorialLine("user", "Which board."), tutorialLine("tyree", "You know which board."), tutorialLine("rival", "Wait… they still have to sign off?"), tutorialLine("tyree", "It's procedure. For everyone."), tutorialLine("rival", "HAHAHA!!!"), tutorialLine("user", "You…"), tutorialLine("tyree", "What happened on that track today had nothing to do with your name."), tutorialChoice([tutorialChoiceOption("Then why doesn't it feel like mine yet?", [["tyree", "You don't need someone else to approve you to feel good about yourself."], ["user", "Thanks for the pep talk."], ["tyree", "I know it's not easy."]]), tutorialChoiceOption("You know what they're going to say.", [["tyree", "I can't control that."], ["user", "Neither can I."], ["tyree", "You'll learn how."]]), tutorialChoiceOption("It's fine.", [["rival", "It's not."], ["user", "No. But it is."]])]), tutorialLine("rival", "For what it's worth… you beat me fair and square."), tutorialLine("user", "That does mean something."), tutorialLine("rival", "Don't make it weird."), tutorialLine("user", "Too late."), tutorialLine("tyree", "Please return the key."), tutorialLine("user", "Thank you."), tutorialLine("user", "For Mamburn. For… I don't know how to say what I actually mean here."), tutorialLine("tyree", "You don't have to."), tutorialLine("key", "Dr. Tyree takes back his GearBorn Key."), tutorialLine("tyree", "Now for you, Mr. Ziggs…"), tutorialLine("user", "I know he didn't beat me, but Mylo was pretty great out there."), tutorialLine("rival", "You don't have to say it back."), tutorialLine("user", "He deserves this as much as I do."), tutorialLine("tyree", "I'm sorry. It just doesn't work that way."), tutorialLine("rival", "Sick."), tutorialLine("user", "Wait… I had a level 9 Mamburn and he held his own."), tutorialLine("tyree", "Mylo, it's been a pleasure watching you race, but I'm sorry."), tutorialLine("rival", "I… I understand…"), tutorialLine("tyree", "Cha Cha, we have somewhere to be."), tutorialLine("user", "I'm sorry."), tutorialLine("rival", "I know."), tutorialLine("user", "I'll see you around, ok?"), tutorialLine("rival", "Yeah… I'll see you around."), tutorialLine("rival", "Damn…")],
    "empty-garage": [tutorialLine("rival", "Damn…")],
    "spindell-labs": [tutorialLine("user", "I've been here before."), tutorialLine("tyree", "I know."), tutorialLine("user", "This is different though."), tutorialLine("orion", "That shouldn't have been possible."), tutorialLine("user", "Hello?"), tutorialLine("orion", "You shouldn't be able to just evolve a Mamburn at Academy Evals."), tutorialLine("user", "Oh, that…"), tutorialLine("orion", "It's insane. Just insane, Spindell. You're a mad woman. I love it."), tutorialLine("user", "You already know me?"), tutorialLine("orion", "I know. I know all. I know way more than you think."), tutorialLine("user", "That's not comforting."), tutorialLine("orion", "Sorry, I'm not exactly great with people. I'm more of a GearBorn guy if you know what I mean."), tutorialLine("user", "Is that creepy or impressive?"), tutorialLine("orion", "Both. Probably."), tutorialChoice([tutorialChoiceOption("Why are you looking at me like that?", [["orion", "Sorry, I do that. It's a problem."], ["orion", "You just fascinate me."], ["user", "Yeah, I'm leaning creepy."], ["orion", "I'm working on it."]]), tutorialChoiceOption("I don't entirely know how it happened.", [["orion", "You've got IT."], ["user", "What's IT?"], ["orion", "I've been studying for years and still haven't figured it out?"], ["user", "That seems promising."]]), tutorialChoiceOption("Tyree, this guy's maybe more into GearBorn than you.", [["orion", "We often argue about that."], ["tyree", "I have a doctorate."], ["orion", "From a third-rate school in a backwoods dump!"], ["user", "I'm sorry I said something."]])]), tutorialLine("tyree", "Orion runs our medallion synchronization systems."), tutorialLine("user", "Sync?"), tutorialLine("key", "Orion gives Cha Cha a GearBorn Key."), tutorialLine("user", "I get to keep this one?"), tutorialLine("tyree", "Try not to lose it."), tutorialLine("orion", "The GearBorn sync to your personal key."), tutorialLine("user", "Yeah, but how do I get one to sync?"), tutorialLine("tyree", "That's a longer conversation."), tutorialLine("orion", "That is the fun part.")],
    "medallion-sync": [tutorialLine("orion", "Here. You earned these."), tutorialLine("narration", "MEDALLIONS_ACQUIRED"), tutorialLine("user", "Which one do I choose?"), tutorialLine("orion", "Start with whichever you want…")],
    "unlocked-cc": [tutorialLine("user", "It's mine?"), tutorialLine("orion", "All yours."), tutorialLine("user", "That's… all I've been waiting for…"), tutorialLine("user", "All the GearBorn out there… they can all be unlocked through sync?"), tutorialLine("orion", "Bring the medallions here and we'll sync them up for you."), tutorialLine("user", "Amazing."), tutorialLine("orion", "It really is. Now let's take a look at my baby."), tutorialLine("user", "You have a cool car too?"), tutorialLine("orion", "Not quite.")],
    "vindex": [tutorialLine("orion", "Welcome to the VINdex."), tutorialLine("user", "My dad used to write his car list next to my height on the door frame. It's come a long way since then."), tutorialLine("orion", "I've worked hard on it."), tutorialLine("user", "You?"), tutorialLine("tyree", "Orion developed the VINdex himself. Completely proprietary."), tutorialLine("orion", "There's a hacked version out there, but this is the standard."), tutorialLine("orion", "You'll find all of your GearBorn here."), tutorialChoice([tutorialChoiceOption("I'm going to fill every entry. We can compare logs.", [["orion", "Talk nerdy to me."], ["user", "Don't make it weird."]]), tutorialChoiceOption("What's the rarest type you've found?", [["orion", "I've been instructed not to answer that, but there's one that's like a unicorn…"], ["tyree", "Orion!"], ["orion", "Sorry. Can't say more."]]), tutorialChoiceOption("You built something genuinely beautiful. I don't think you know that.", [["orion", "Nobody has ever said that."], ["user", "I like numbers."], ["orion", "I like you…"], ["orion", "In a totally professional way!"], ["tyree", "Good save."]])]), tutorialLine("orion", "One more thing. Open Achievements.")],
    "achievements": [tutorialLine("user", "Performance milestones with reward thresholds."), tutorialLine("orion", "Most people say oh no, percentages."), tutorialLine("user", "I love percentages. Percentages are the only honest thing."), tutorialLine("orion", "My kind of people."), tutorialLine("orion", "Achievements track race wins, Boss victories, discoveries, evolutions."), tutorialLine("orion", "They reward Sprox, medallions, and rare unlocks. The completionist path isn't optimal for speed but it maximizes bond depth."), tutorialLine("user", "So the right answer is completionism."), tutorialLine("orion", "The data suggests it."), tutorialLine("user", "The data and I are going to get along great.")],
    "end": [tutorialLine("orion", "Out there, the name matters to some people."), tutorialLine("orion", "GearBorn won't care."), tutorialLine("orion", "The bond you build will be yours. Not your parents'."), tutorialLine("user", "You know just what I want to hear."), tutorialLine("orion", "The data supports it."), tutorialLine("user", "Keep going…"), tutorialLine("tyree", "You're going to enjoy this."), tutorialLine("user", "What now?"), tutorialLine("tyree", "Indianapolis. There's someone who's waiting for you."), tutorialLine("narration", "END OF PROLOGUE")]
  }
};

function tutorialDialogueForCharacter(characterId) {
  return tutorialDialogueByCharacter[characterId] || tutorialDialogueByCharacter["mylo"];
}

const tutorialDialogue = new Proxy({}, {
  get(_, sceneId) {
    const charId = (typeof selectedTuner === "function" && selectedTuner()?.id) || "mylo";
    return tutorialDialogueForCharacter(charId)[sceneId];
  }
});

const tutorialDialogueAliases = {
  "battle-win": "post-battle",
  "evolution-cinematic": "evolve",
  "evolved-form": "evolve",
  "medallion-discovery": "empty-garage",
  "spindell-labs": "spindell-labs",
  "medallion-sync": "medallion-sync",
  "unlocked-cc": "unlocked-cc"
};

// Story scene dialogue. Mirrors tutorialDialogueByCharacter structure.
// TODO: replace these placeholders once the Indianapolis story scripts are locked.
const storyDialogueByCharacter = {
  "mylo": {
    "indy-arrival": [storyLine("ashley", "PLACEHOLDER: Indianapolis arrival — Ashley briefs on Rev-rend.")],
    "indy-s1-pre": [storyLine("eli", "PLACEHOLDER: Pre-Drag — meet Eli, stock Puttercat, 'Freaky'.")],
    "indy-s1-post": [storyLine("eli", "PLACEHOLDER: Post-Drag — Eli on the system.")],
    "indy-s2-pre": [storyLine("ashley", "PLACEHOLDER: Pre-Time Trial — open qualifier framing.")],
    "indy-s2-post": [storyLine("roberto", "PLACEHOLDER: Post-Time Trial — Roberto Yucca notices the time.")],
    "indy-s3-pre": [storyLine("eli", "PLACEHOLDER: Pre-4-Car — Eli in the field.")],
    "indy-s3-post": [storyLine("ashley", "PLACEHOLDER: Post-4-Car — great Tuner, bad car.")],
    "indy-s4-pre": [storyLine("rival", "PLACEHOLDER: Pre-Rival — Cha Cha at the H2H line.")],
    "indy-s4-post": [storyLine("rival", "PLACEHOLDER: Post-Rival — same hook, different bait.")],
    "indy-s5-pre": [storyLine("lynx", "PLACEHOLDER: Pre-Battle — Lynx, intimidation, will you flinch.")],
    "indy-s5-post": [storyLine("lynx", "PLACEHOLDER: Post-Battle — respect; boss unlocks.")],
    "indy-boss-pre": [storyLine("revrend", "PLACEHOLDER: Boss intro — Rev-rend's pitch.")],
    "indy-boss-post": [storyLine("revrend", "PLACEHOLDER: Boss win — the offer stays open.")],
    "indy-exit": [storyLine("ashley", "PLACEHOLDER: Leaving Indianapolis — Karen's post, Berlin cliffhanger.")]
  },
  "cha-cha": {
    "indy-arrival": [storyLine("orion", "PLACEHOLDER: Indianapolis arrival — Orion briefs on Rev-rend / the name.")],
    "indy-s1-pre": [storyLine("crosby", "PLACEHOLDER: Pre-Drag — meet Crosby, stock Tourquette, cheerful.")],
    "indy-s1-post": [storyLine("crosby", "PLACEHOLDER: Post-Drag — Crosby loses cheerfully.")],
    "indy-s2-pre": [storyLine("orion", "PLACEHOLDER: Pre-Time Trial — just you and the clock.")],
    "indy-s2-post": [storyLine("crosby", "PLACEHOLDER: Post-Time Trial — genuine, non-backhanded compliment about HER.")],
    "indy-s3-pre": [storyLine("crosby", "PLACEHOLDER: Pre-4-Car — Crosby in the field, name vs racer.")],
    "indy-s3-post": [storyLine("orion", "PLACEHOLDER: Post-4-Car — beat them without the name.")],
    "indy-s4-pre": [storyLine("rival", "PLACEHOLDER: Pre-Rival — Mylo at the H2H line.")],
    "indy-s4-post": [storyLine("rival", "PLACEHOLDER: Post-Rival — unsettled he kept up.")],
    "indy-s5-pre": [storyLine("lynx", "PLACEHOLDER: Pre-Battle — Lynx doesn't care about the name.")],
    "indy-s5-post": [storyLine("lynx", "PLACEHOLDER: Post-Battle — the cracked part wins; boss unlocks.")],
    "indy-boss-pre": [storyLine("revrend", "PLACEHOLDER: Boss intro — Rev-rend wants the Spindell banner.")],
    "indy-boss-post": [storyLine("revrend", "PLACEHOLDER: Boss win — still deciding what a Spindell is.")],
    "indy-exit": [storyLine("orion", "PLACEHOLDER: Leaving Indianapolis — Karen's post, Berlin cliffhanger.")]
  }
};

function storyDialogueForCharacter(characterId) {
  return storyDialogueByCharacter[characterId] || storyDialogueByCharacter["mylo"];
}

const storyDialogue = new Proxy({}, {
  get(_target, sceneId) {
    const charId = (typeof selectedTuner === "function" && selectedTuner()?.id) || "mylo";
    return storyDialogueForCharacter(charId)[sceneId];
  }
});

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
  narwraith: 1.22,
  rollantis: 1.22,
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
  "gb-growler": {
    "speed": 72,
    "acceleration": 70,
    "handling": 66,
    "torque": 82,
    "body": 86,
    "powertrain": 78,
    "playstyle": "Guard Dog Juggernaut",
    "type": "Endurance"
  },
  "armadaddio": {
    "speed": 68,
    "acceleration": 70,
    "handling": 64,
    "torque": 80,
    "body": 87,
    "powertrain": 74,
    "playstyle": "Shellshock Rambler",
    "type": "Endurance"
  },
  "electro-beetle": {
    "speed": 76,
    "acceleration": 82,
    "handling": 84,
    "torque": 72,
    "body": 62,
    "powertrain": 87,
    "playstyle": "Static Skitter",
    "type": "Tech"
  },
  "flavor-coast": {
    "speed": 87,
    "acceleration": 84,
    "handling": 74,
    "torque": 80,
    "body": 68,
    "powertrain": 86,
    "playstyle": "Flavortown Rocket",
    "type": "Power"
  },
  "future-bok": {
    "speed": 86,
    "acceleration": 87,
    "handling": 85,
    "torque": 76,
    "body": 64,
    "powertrain": 82,
    "playstyle": "Solar Leaprunner",
    "type": "Agility"
  },
  "wrestler-roo": {
    "speed": 78,
    "acceleration": 84,
    "handling": 76,
    "torque": 82,
    "body": 80,
    "powertrain": 87,
    "playstyle": "Ringbreaker Hopper",
    "type": "Power"
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
  "narwhal-luxury": {
    "speed": 87,
    "acceleration": 87,
    "handling": 87,
    "torque": 87,
    "body": 87,
    "powertrain": 87,
    "playstyle": "Perfect Ascention",
    "type": "Neutral"
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
storyRewardLineDefs.forEach((line) => {
  const [speed, acceleration, handling, torque, body, powertrain] = line.stats;
  gearbornStatProfiles[line.id] = { speed, acceleration, handling, torque, body, powertrain, playstyle: line.playstyle, type: line.type };
});
fusionRecipes.forEach((recipe) => {
  const [parentAId, parentBId] = fusionParentLineIds(recipe);
  const parentA = statsForFusionParent(parentAId);
  const parentB = statsForFusionParent(parentBId);
  gearbornStatProfiles[recipe.id] = {
    ...computeFusionStats(parentAId, parentBId),
    playstyle: "Fusion", // TODO playstyle
    type: parentA.type || "Neutral",
    type2: parentB.type || parentA.type || "Neutral"
  };
});

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
  { id: "rev-rend", name: "Rev-rend", car: "Crusadome", track: storyTracks[0], difficulty: 0.55, xp: 260, carImage: "assets/cars/pope-crusadome-topdown.png", portrait: "assets/characters/rev-rend.png", headshot: "assets/characters/headshots/headshot-rev-rend.png" },
  { id: "karen", name: "Karen", car: "Baronessex", track: storyTracks[1], difficulty: 1.02, xp: 340, carImage: "assets/cars/german-baronessex-topdown.png", portrait: "assets/characters/karen.png", headshot: "assets/characters/headshots/headshot-karen.png" },
  { id: "samir", name: "Samir", car: "Shamacht", track: storyTracks[2], difficulty: 1.14, xp: 430, carImage: "assets/cars/whale-shamacht-topdown.png", portrait: "assets/characters/samir.png", headshot: "assets/characters/headshots/headshot-samir.png" },
  { id: "thais", name: "Thais", car: "Inflewenze", track: storyTracks[3], difficulty: 1.28, xp: 540, carImage: "assets/cars/influencer-peacock-inflewenze-topdown.png", portrait: "assets/characters/thais.png", headshot: "assets/characters/headshots/headshot-thais.png" },
  { id: "jimmy-chin", name: "Jimmy Chin", car: "Hurrdaboutis", track: storyTracks[4], difficulty: 1.42, xp: 670, carImage: "assets/cars/talkshow-hurrdaboutis-topdown.png", portrait: "assets/characters/jimmy-chin.png", headshot: "assets/characters/headshots/headshot-jimmy-chin.png" },
  { id: "rip-lee", name: "Rip Lee", car: "Matunnie", track: storyTracks[5], difficulty: 1.56, xp: 820, carImage: "assets/cars/rabbit-matunnie-topdown.png", portrait: "assets/characters/rip-lee.png", headshot: "assets/characters/headshots/headshot-rip-lee.png" },
  { id: "jabu", name: "Jabu", car: "Kuumbusta", track: storyTracks[6], difficulty: 1.72, xp: 990, carImage: "assets/cars/bok-kuumbusta-topdown.png", portrait: "assets/characters/jabu.png", headshot: "assets/characters/headshots/headshot-jabu.png" },
  { id: "pallavi", name: "Pallavi", car: "Kermajesty", track: storyTracks[7], difficulty: 1.9, xp: 1200, carImage: "assets/cars/frog-kermajesty-topdown.png", portrait: "assets/characters/pallavi.png", headshot: "assets/characters/headshots/headshot-pallavi.png" }
];
const finalBoss = { id: "racer-alpha", name: "Racer Alpha", car: "Hornula1", track: { id: "space", city: "Space", country: "Final Track", map: "assets/maps/map-space.png", cityMap: "assets/maps/citymap-space.png", cityIcon: "assets/maps/cityicon-space.png" }, difficulty: 2.25, xp: 1800, carImage: "assets/cars/unicorn-hornula1-topdown.png", portrait: "assets/characters/racer-alpha-helmet.png", unmaskedPortrait: "assets/characters/racer-alpha.png", headshot: "assets/characters/headshots/headshot-racer-alpha.png" };
const bossChallengeBosses = bosses.concat(finalBoss);
const campaignDragStages = [
  { rankKey: "E", name: "Bananachi", xp: 100, power: 0.92, image: "assets/cars/monkey-bananachi-race.png", opponents: [{ name: "Bananachi", image: "assets/cars/monkey-bananachi-race.png", power: 0.92 }] },
  { rankKey: "D", name: "Beardo", xp: 150, power: 1.05, image: "assets/cars/mustache-beardo-race.png", opponents: [{ name: "Beardo", image: "assets/cars/mustache-beardo-race.png", power: 1.05 }] },
  { rankKey: "D", name: "Boates", xp: 190, power: 1.16, image: "assets/cars/whale-boates-race.png", opponents: [{ name: "Boates", image: "assets/cars/whale-boates-race.png", power: 1.16 }, { name: "Swampagne", image: "assets/cars/florida-gator-swampagne-race.png", power: 1.13 }] },
  { rankKey: "C", name: "Manstrocity", xp: 250, power: 1.3, image: "assets/cars/armadillo-manstrocity-race.png", opponents: [{ name: "Manstrocity", image: "assets/cars/armadillo-manstrocity-race.png", power: 1.3 }, { name: "Orbitide", image: "assets/cars/dolphin-orbitide-race.png", power: 1.24 }] },
  { rankKey: "B", name: "Sponsore", xp: 330, power: 1.5, image: "assets/cars/sticker-sponsore-race.png", opponents: [{ name: "Sponsore", image: "assets/cars/sticker-sponsore-race.png", power: 1.5 }, { name: "Bair", image: "assets/cars/mustache-bair-race.png", power: 1.46 }, { name: "Brrap", image: "assets/cars/penguin-brrap-race.png", power: 1.43 }] },
  { rankKey: "B", name: "Tookerjaw", xp: 410, power: 1.66, image: "assets/cars/pickup-tookerjaw-race.png", opponents: [{ name: "Lopstar", image: "assets/cars/rabbit-lopstar-race.png", power: 1.58 }, { name: "Tookerjaw", image: "assets/cars/pickup-tookerjaw-race.png", power: 1.66 }] },
  { rankKey: "A", name: "Crusadome", xp: 540, power: 1.85, image: "assets/cars/pope-crusadome-race.png", opponents: [{ name: "Crusadome", image: "assets/cars/pope-crusadome-race.png", power: 1.85 }, { name: "Barracobain", image: "assets/cars/fish-barracobain-race.png", power: 1.78 }, { name: "OlChap", image: "assets/cars/butcher-olchap-race.png", power: 1.75 }] },
  { rankKey: "S", name: "Hornula1", xp: 720, power: 2.12, image: "assets/cars/unicorn-hornula1-race.png", opponents: [{ name: "Hornula1", image: "assets/cars/unicorn-hornula1-race.png", power: 2.12 }] }
];
const storyMedallionAssignments = {
  indianapolis: { gauntlets: ["gb-growler", "silly-goose", "pig"], convoy: "florida-gator", boss: "muscle-man", pinkSlip: "cake-train" },
  berlin: { gauntlets: ["electro-beetle", "funvee", "eager-beaver"], convoy: "grunge-fish", boss: "sorority-elephant", pinkSlip: "construction-blok" },
  dubai: { gauntlets: ["armadaddio", "high-roller-cheetah", "long-haul-camel"], convoy: "royal-flush", boss: "whale", pinkSlip: "tiger-cart" },
  rio: { gauntlets: ["monkey", "minivan", "birds-of-metal"], convoy: "space-dolphin", boss: "island-luau", pinkSlip: "influencer-peacock" },
  "los-angeles": { gauntlets: ["rides-hair", "sports-car", "magician"], convoy: "butcher-hog", boss: "skater-koala", pinkSlip: "flavor-coast" },
  seoul: { gauntlets: ["karate-cow", "drift-pirate", "combat-badger"], convoy: "techno-dinosaur", boss: "anime", pinkSlip: "snake" },
  "cape-town": { gauntlets: ["bucking-bronco", "all-terrain-spyder", "emo-turtle"], convoy: "chill-penguin", boss: "knight-sloth", pinkSlip: "future-bok" },
  bangalore: { gauntlets: ["jazz-panther", "octopus-gymnast", "sun-lion"], convoy: "running-bulls", boss: "wrestler-roo", pinkSlip: "frog" },
  space: { gauntlets: [], convoy: null, boss: null, pinkSlip: "galaxy-jelly" }
};
const pinkSlipRacePlan = {
  0: { carId: "cake-train",          rankKey: "C", xp: 180, power: 0.88, distance: 400 },
  1: { carId: "construction-blok",   rankKey: "C", xp: 240, power: 0.90, distance: 800 },
  2: { carId: "tiger-cart",          rankKey: "C", xp: 300, power: 0.94, distance: 800 },
  3: { carId: "influencer-peacock",  rankKey: "C", xp: 360, power: 0.96, distance: 800 },
  4: { carId: "flavor-coast",        rankKey: "C", xp: 420, power: 0.98, distance: 800 },
  5: { carId: "snake",               rankKey: "C", xp: 540, power: 1.02, distance: 1600 },
  6: { carId: "future-bok",          rankKey: "C", xp: 680, power: 1.06, distance: 1600 },
  7: { carId: "frog",                rankKey: "C", xp: 820, power: 1.08, distance: 1600 }
};
const spacePinkSlipPlan = { carId: "galaxy-jelly", rankKey: "B", xp: 980, power: 1.12, distance: 1600 };
const rivalRacePlan = {
  0: { id: "indianapolis-rival", mechanic: "circuitDuel", xp: 240, power: 1.08, distance: 500 },
  2: { id: "dubai-rival", mechanic: "circuitDuel", xp: 430, power: 1.32, distance: 500 },
  4: { id: "los-angeles-rival", mechanic: "circuitDuel", xp: 640, power: 1.56, distance: 500 },
  6: { id: "cape-town-rival", mechanic: "circuitDuel", xp: 900, power: 1.8, distance: 500 }
};
function pinkSlipStageFor(plan) {
  const car = cars.find((item) => item.id === plan.carId);
  const form = car.evolutions[0];
  const specialOpponents = {
    "karate-cow": ["Udderlee", "Moosan", "Grandmooster"].map((name, index) => {
      const evo = car.evolutions[index] || form;
      return { name, image: imageFor(evo, "race"), power: plan.power + index * 0.08 };
    }),
    frog: ["Rivvir", "Croakra", "Kermajesty"].map((name, index) => {
      const evo = car.evolutions[index] || form;
      return { name, image: imageFor(evo, "race"), power: plan.power + index * 0.08 };
    })
  };
  return {
    ...plan,
    type: "pink-slip",
    name: form.name,
    title: `Pink Slip Race: ${form.name}`,
    image: imageFor(form, "race"),
    displayImage: imageFor(form, "display"),
    opponents: specialOpponents[plan.carId] || [{ name: form.name, image: imageFor(form, "race"), power: plan.power }]
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
}).concat([
  { type: "pink-slip", title: pinkSlipStageFor(spacePinkSlipPlan).title, drag: pinkSlipStageFor(spacePinkSlipPlan), pinkSlipCarId: spacePinkSlipPlan.carId, track: finalBoss.track, circuitMode: "duel", unlockedWithCity: true },
  { type: "boss", title: `${finalBoss.name} Final Boss`, bossIndex: bosses.length, final: true, track: finalBoss.track, circuitMode: "duel" }
]);
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
  levels: campaignLevels.slice(-2).map((level, offset) => ({ ...level, campaignIndex: campaignLevels.length - 2 + offset })),
  icon: finalBoss.track.cityIcon
}]);
const gauntletUnlockReputationPercents = [0, 50, 100];

function cityDifficultyForCampaignIndex(campaignIndex) {
  if (!Number.isFinite(campaignIndex) || campaignIndex < 0) return null;
  const runtimeCityId = campaignLevels[campaignIndex]?.cityStructureEvent?.cityId;
  const cityIndex = runtimeCityId
    ? storyCities.findIndex((city) => city.id === runtimeCityId)
    : storyCities.findIndex((city) => (city.levels || []).some((level) => level.campaignIndex === campaignIndex));
  return cityDifficultyCurve[Math.max(0, cityIndex)] || cityDifficultyCurve[cityDifficultyCurve.length - 1];
}

function medallionGauntletConfigForLine(gearBornLineId, options = {}) {
  return {
    enabled: true,
    unlockReputationPercent: options.unlockReputationPercent ?? 0,
    assignedCityId: options.assignedCityId || "",
    slotIndex: options.slotIndex ?? 0,
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

const medallionGauntlets = Object.fromEntries(Object.entries(storyMedallionAssignments).flatMap(([cityId, assignment]) =>
  (assignment.gauntlets || []).map((gearBornLineId, slotIndex) => {
    const gauntletKey = `${cityId}-gauntlet-${slotIndex + 1}`;
    return [gauntletKey, medallionGauntletConfigForLine(gearBornLineId, {
      assignedCityId: cityId,
      slotIndex,
      unlockReputationPercent: gauntletUnlockReputationPercents[slotIndex]
    })];
  })
));
const specialMedallionGauntlets = {};
const timeMedals = [
  { key: "gold", label: "Gold", difficulty: "Hard", xp: 420, base: 55 },
  { key: "silver", label: "Silver", difficulty: "Medium", xp: 260, base: 65 },
  { key: "bronze", label: "Bronze", difficulty: "Easy", xp: 150, base: 80 }
];
const vindexEntries = [
  ["010", "Bananachi", "Monkey Line", "assets/cars/monkey-bananachi-display.png"],
  ["032", "Manstrocity", "Armadaddio Line", "assets/cars/armadillo-manstrocity-display.png"],
  ["037", "Beardo", "Rides Hair Line", "assets/cars/mustache-beardo-display.png"],
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
  ["082", "Phantaxi", "Ghost Taxi Line", "assets/cars/taxi-phantaxi-display.png"],
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
  ["251", "Inflewenze", "Influencer Line", "assets/cars/influencer-peacock-inflewenze-display.png"],
  ["287", "Sponsore", "Bumper Sticker Line", "assets/cars/sticker-sponsore-display.png"],
  ["296", "Baronessex", "German Discipline Line", "assets/cars/german-baronessex-display.png"],
  ["298", "Crusadome", "Crusader Line", "assets/cars/pope-crusadome-display.png"],
  ["301", "Kuumbusta", "Future Bok Line", "assets/cars/bok-kuumbusta-display.png"],
  ["305", "Hurrdaboutis", "Roundabout Line", "assets/cars/talkshow-hurrdaboutis-display.png"],
  ["324", "Narwraith", "Narwhal Luxury Line", "assets/cars/narwhal-narwraith-display.png"],
  ["325", "Rollantis", "Narwhal Luxury Line", "assets/cars/narwhal-rollantis-display.png"],
  ["326", "Rainbowlt", "Unicorn Supercar Line", "assets/cars/unicorn-rainbowlt-display.png"],
  ["327", "Hornula1", "Unicorn Supercar Line", "assets/cars/unicorn-hornula1-display.png"]
].map(([number, name, line, image]) => ({ number, name, line, image }));

const additionalVindexEntries = [
  [
    "004",
    "Cruzdog",
    "GB Growler Line",
    "assets/cars/pt-cruzdog-race.png"
  ],
  [
    "005",
    "Bullwark",
    "GB Growler Line",
    "assets/cars/pt-bullwark-display.png"
  ],
  [
    "006",
    "Forterra",
    "GB Growler Line",
    "assets/cars/pt-forterra-display.png"
  ],
  [
    "019",
    "Bertie",
    "Electro-Beetle Line",
    "assets/cars/beetle-bertie-display.png"
  ],
  [
    "020",
    "Voltscarab",
    "Electro-Beetle Line",
    "assets/cars/beetle-voltscarab-display.png"
  ],
  [
    "021",
    "Beetronox",
    "Electro-Beetle Line",
    "assets/cars/beetle-beetronox-display.png"
  ],
  [
    "030",
    "Manscape",
    "Armadaddio Line",
    "assets/cars/armadillo-manscape-display.png"
  ],
  [
    "031",
    "Mansplore",
    "Armadaddio Line",
    "assets/cars/armadillo-mansplore-display.png"
  ],
  [
    "195",
    "Rumbleroo",
    "Wrestler Roo Line",
    "assets/cars/roo-rumbleroo-display.png"
  ],
  [
    "196",
    "StrayGunn",
    "Wrestler Roo Line",
    "assets/cars/roo-straygunn-display.png"
  ],
  [
    "197",
    "Kangold",
    "Wrestler Roo Line",
    "assets/cars/roo-kangold-display.png"
  ],
  [
    "240",
    "Carmieri",
    "Flavor Coast Line",
    "assets/cars/flavor-carmieri-display.png"
  ],
  [
    "241",
    "TripleDiesel",
    "Flavor Coast Line",
    "assets/cars/flavor-triplediesel-display.png"
  ],
  [
    "242",
    "Flavortow",
    "Flavor Coast Line",
    "assets/cars/flavor-flavortow-display.png"
  ],
  [
    "299",
    "Sprynza",
    "Future Bok Line",
    "assets/cars/bok-sprynza-display.png"
  ],
  [
    "300",
    "Bokwylde",
    "Future Bok Line",
    "assets/cars/bok-bokwylde-display.png"
  ],
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
storyRewardLineDefs.forEach((line) => {
  line.forms.forEach(([number, name]) => {
    if (vindexEntries.some((entry) => entry.number === number && entry.name === name)) return;
    vindexEntries.push({ number, name, line: `${line.family} Line`, image: `assets/cars/${line.id}-${storyRewardAssetSlug(name)}-display.png` });
  });
});
fusionRecipes.forEach((recipe, index) => {
  const number = `X${String(index + 1).padStart(3, "0")}`;
  if (vindexEntries.some((entry) => entry.number === number && entry.name === recipe.name)) return;
  vindexEntries.push({ number, name: recipe.name, line: `${recipe.name} Line`, image: fusionImagePath(recipe.id, "display") }); // TODO verify filename if fusion asset convention changes.
});
vindexEntries.sort((a, b) => {
  const aFusion = String(a.number).startsWith("X");
  const bFusion = String(b.number).startsWith("X");
  if (aFusion || bFusion) return aFusion === bFusion ? String(a.number).localeCompare(String(b.number)) : (aFusion ? 1 : -1);
  return Number(a.number) - Number(b.number) || a.name.localeCompare(b.name);
});
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
  "324": "S",
  "325": "S",
  "326": "S",
  "327": "S"
};
Object.assign(vindexClassByNumber, {
  "004": "E",
  "005": "D",
  "006": "C",
  "019": "E",
  "020": "D",
  "021": "C",
  "030": "E",
  "031": "D",
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
  "195": "D",
  "196": "C",
  "197": "B",
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
  "240": "C",
  "241": "B",
  "242": "A",
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
  "299": "C",
  "300": "B",
  "301": "A",
  "305": "A",
  "326": "S",
  "327": "S"
});
Object.assign(vindexClassByNumber, {
  "310": "A"
});
storyRewardLineDefs.forEach((line) => {
  line.forms.forEach(([number, , classLetter]) => {
    vindexClassByNumber[number] = classLetter;
  });
});

const tuners = [
  { id: "mylo", name: "Mylo Ziggs", gender: "male", image: "assets/characters/mylo-ziggs.png", headshot: "assets/characters/headshots/headshot-mylo.png", bio: "A hopeful, self-made Tuner with big dreams and messy execution. Mylo did not grow up in the GearBorn world. He forced his way in. He is always a step behind, but what he lacks in polish, he makes up for in heart." },
  { id: "cha-cha", name: "Cha Cha Spindell", gender: "female", image: "assets/characters/cha-cha-spindell.png", headshot: "assets/characters/headshots/headshot-cha-cha.png", bio: "The gold standard of a Tuner, and tired of being treated like a legacy. Daughter of legends Mack and Sloane Spindell, Cha Cha has spent her life at the top because she earned it." }
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
  "orion-vincent": "Orion Vincent is the kind of genius who makes everyone else in the room feel slightly underqualified just by existing. A prodigy mechanic and systems architect raised within Spindell Labs, Orion designed the VINdex while most Tuners his age were still failing Academy evaluations. To him, GearBorn are more than machines: they're endlessly fascinating puzzles waiting to be understood, optimized, cataloged, and perfected. If a GearBorn evolves unexpectedly, Orion wants the telemetry. If a Tuner forms a strange bond, he wants the data. His obsession with understanding GearBorn borders on reverence, even if he'd never admit it out loud.\n\nBut Orion's spotless Academy future cracked the day Ashley Racem stole and jailbroke the VINdex, spreading its data across the underground KeyFree scene. He still treats it like a personal betrayal. To Orion, Ashley didn't just steal technology, she undermined the structure protecting GearBorn from chaos. Now one of Spindell Labs' brightest young minds, Orion helps Tuners unlock medallions through precision key synchronization and advanced calibration systems. He believes there's a right way to connect with GearBorn. Unfortunately for him, the road keeps producing evidence that instinct might matter just as much as science.",
  auntie: "Nobody seems entirely sure where Auntie came from, how old she is, or why so many legendary Tuners owe her favors. Deep within the hidden corners of The Forge, Auntie has become something between a mechanic, a spiritual guide, and a public nuisance. Loud, shameless, and constantly making Mylo uncomfortable in ways that somehow stay weirdly lovable, Auntie treats every conversation like an opportunity to stir trouble. One minute she's explaining ancient GearBorn bonding rituals with frightening sincerity, the next she's loudly asking if Mylo's single yet.\n\nBehind the chaos, though, is one of the deepest living experts on GearBorn connection anywhere in the world. While the Academy studies GearBorn through systems and control, Auntie understands them through instinct, emotion, and lived experience. She believes GearBorn choose people long before people realize it themselves. To Auntie, the Academy's obsession with medallions and rankings misses the point entirely. The road is about trust between a Tuner and their GearBorn. And whether Mylo likes it or not, Auntie sees something in him worth protecting... even if she enjoys embarrassing him every step of the way.",
  "mack-spindell": "Mack Spindell built his legend the loud way. A former heavyweight off-road champion with a personality too big for any garage to contain, Mack became one of the most beloved Tuners of his era through sheer force of charisma. Fans adored him. GearBorn seemed drawn to him naturally. Sponsors turned him into a national icon. Even now, years removed from his prime, Mack still fills every room with booming laughter, stories from the circuit, and the feeling that racing is supposed to be fun. Which is exactly what makes life so difficult for Cha Cha. Standing beside someone that larger-than-life can make anyone feel invisible.\n\nTo the public, Mack is the perfect racing father: supportive, legendary, impossible not to love. But beneath the warmth is someone who struggles to recognize how overwhelming his shadow has become. He sees Cha Cha as capable, strong, and destined for greatness, yet rarely notices how desperately she wants to be seen as her own person rather than Mack Spindell's daughter. Unlike Sloane's precision and pressure, Mack's burden comes from admiration. He loves loudly, assumes everyone else feels the same, and doesn't realize that sometimes encouragement can weigh just as heavily as expectation.",
  "sloane-spindell": "Where Mack races with instinct and spectacle, Sloane Spindell built her reputation through absolute control. One of the most feared street circuit Tuners of her generation, Sloane became legendary not for dramatic victories, but for how inevitable they felt. Calm under pressure and impossibly difficult to read, she approached racing like a grandmaster solving problems three turns before anyone else realized they existed. To many Tuners, Sloane represents the ideal Academy driver: disciplined, analytical, and ruthlessly efficient. To Cha Cha, she represents something far more complicated: a reflection she can never quite escape.\n\nUnlike Mack's overwhelming warmth, Sloane's pressure comes through expectation. She sees Cha Cha's talent clearly and pushes her accordingly, often without realizing how suffocating that perfection can feel. In many ways, mother and daughter are painfully alike: competitive, guarded, stubborn, and terrified of vulnerability. Sloane believes she's preparing Cha Cha for the realities of elite racing, where hesitation gets punished and weakness gets exploited. But beneath her icy composure is someone who genuinely wants her daughter to succeed, even if she no longer remembers how to separate love from pressure.",
  "lynx-incarso": "Nobody really knows where Lynx Incarso came from. What they do know is that if she's behind you on the starting grid, you should probably update your insurance. Loud, fearless, and completely unpredictable, Lynx races with the kind of reckless aggression that makes other Tuners question their own survival instincts. Some racers insist the chaos is calculated, that she's using intimidation to force mistakes. The terrifying part? It probably isn't. Lynx genuinely seems to enjoy the danger. To her, racing isn't about perfect lines or clean technique. It's about pressure, panic, and seeing who breaks first.",
  "portia-crosh": "The voice behind hit GearBorn podcast Good Tunes, Portia Crosh built her reputation covering the world's top Tuners before deciding she was tired of talking about greatness from the sidelines. Smart, sharp, and relentlessly ambitious, Portia approaches racing like she approaches journalism - by learning exactly where the pressure points are and pushing them. Critics say she's too polished for the track. Portia keeps beating them anyway. Somehow she always knows the story before everyone else, including the parts people wish she didn't.",
  "marlyn-adelaide": "Off the track, Marlyn Adelaide is a walking disaster. He spills drinks, trips over air, complains constantly, and somehow gets lost in places he's already been. Behind the wheel? Different person entirely. Marlyn drives with razor-sharp precision and impossible reflexes, treating every race like a moving puzzle only he can solve. He's picky, dramatic, and exhausting to be around for long periods of time - but even his rivals admit the guy's a genius once the engines start.",
  "crosby-nash": "Crosby Nash looks terrifying right up until he opens his mouth. Gentle, encouraging, and relentlessly positive, Crosby treats every racer like they're already friends - whether they want him to or not. Most people enter races against him expecting intimidation tactics. Instead they get compliments, life advice, and heartfelt encouragement at red lights. Underneath the teddy bear energy is an incredibly capable driver who earned his reputation the hard way. Crosby doesn't race to crush people. He races because he genuinely wants to see how far everyone can go.",
  "eli-kaufman": "Most Tuners grew up dreaming about the spotlight. Eli Kaufman grew up carrying someone else's clubs through it. A longtime caddy for the city's elite racers, Eli learned the Tuner world one overheard conversation at a time - studying egos, rivalries, and strategy while staying invisible. After years of saving every tip he earned, Eli finally bought his way onto the track himself. Calm, patient, and impossible to rattle, he races the same way he worked: quietly, precisely, and always three steps ahead of the people underestimating him. He's also your best friend."
};
const otherNpcProfileSeeds = [
  { id: "eli-kaufman", name: "Eli Kaufman", city: "The Starting Grid" },
  { id: "portia-crosh", name: "Portia Crosh", city: "Good Tunes Studio" },
  { id: "lynx-incarso", name: "Lynx Incarso", city: "Unknown" },
  { id: "marlyn-adelaide", name: "Marlyn Adelaide", city: "Everywhere, Somehow Lost" },
  { id: "crosby-nash", name: "Crosby Nash", city: "The Open Road" }
];
const npcSignatureLineIds = {
  "dr-tyree": "metal-snake",
  ashley: "space-dolphin",
  "mack-spindell": "armadaddio",
  "sloane-spindell": "chill-penguin",
  "eli-kaufman": "tiger-cart",
  "portia-crosh": "sorority-elephant",
  "crosby-nash": "muscle-man",
  "lynx-incarso": "butcher-hog",
  "marlyn-adelaide": "silly-goose"
};
const npcSignatureLineIdForProfile = (profileId) => npcSignatureLineIds[profileId] || "";
const npcProfiles = otherNpcProfileSeeds.map((profile) => ({
  ...profile,
  image: `assets/characters/headshots/headshot-${profile.id.split("-")[0]}.png`,
  headshot: `assets/characters/headshots/headshot-${profile.id.split("-")[0]}.png`,
  character: `assets/characters/character-${profile.id.split("-")[0]}.png`,
  category: "Other",
  signatureLineId: npcSignatureLineIdForProfile(profile.id),
  car: cars.find((car) => car.id === npcSignatureLineIdForProfile(profile.id))?.family || "Other",
  country: "Other",
  bio: profileBios[profile.id] || "Profile bio coming soon."
}));
const otherNpcProfiles = npcProfiles;
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
  image: "assets/characters/headshots/headshot-dr-tyree.png",
  category: "Other",
  car: "Mamburn",
  signatureLineId: "metal-snake",
  carImage: "assets/cars/snake-mamburn-display.png",
  city: "Tuner Academy",
  country: "Other",
  bio: profileBios["dr-tyree"]
}, {
  id: "ashley",
  name: "Ashley Racem",
  image: "assets/characters/headshots/headshot-ashley.png",
  headshot: "assets/characters/headshots/headshot-ashley.png",
  character: "assets/characters/character-ashley.png",
  category: "Other",
  car: "Astromarino",
  signatureLineId: "space-dolphin",
  carImage: "assets/cars/dolphin-astromarino-display.png",
  city: "Outside the Official Circuit",
  country: "Other",
  bio: profileBios.ashley
}, {
  id: "roberto-yucca",
  name: "Roberto Yucca",
  title: "The Voice of Velocity",
  image: "assets/characters/headshots/headshot-roberto-yucca.png",
  headshot: "assets/characters/headshots/headshot-roberto-yucca.png",
  character: "assets/characters/roberto-yucca.png",
  category: "Other",
  car: "Other",
  city: "Last Gear Broadcast Booth",
  country: "Other",
  bio: "Roberto Yucca never became a professional Tuner, but you'd never know it from the way he calls a race. A former local radio host turned international commentator, Roberto built his reputation on pure personality: booming play-by-plays, impossible energy, and dramatic calls that can make even a qualifying lap sound legendary. Equal parts sports announcer, entertainer, and hype machine, he treats every race like the biggest moment in GearBorn history.\n\nWhile the elite racing world obsesses over rankings, sponsors, and medallions, Roberto cares about the people behind the wheel. He's become known for championing overlooked Tuners, underdog stories, and racers the system never expected to succeed. Beneath the nonstop charisma is someone who genuinely loves the culture surrounding GearBorn - not just the winners. To Roberto, racing is supposed to bring people together. The louder the engines get, the louder he gets too."
}, {
  id: "orion-vincent",
  name: "Orion Vincent",
  title: "Spindell Labs Mechanic",
  image: "assets/characters/headshots/headshot-orion-vincent.png",
  headshot: "assets/characters/headshots/headshot-orion-vincent.png",
  character: "assets/characters/orion-vincent.png",
  category: "Other",
  car: "Other",
  city: "Spindell Labs",
  country: "Other",
  faction: "spindell",
  bio: profileBios["orion-vincent"]
}, {
  id: "auntie",
  name: "Auntie",
  title: "Forge Matriarch",
  image: "assets/characters/headshots/headshot-auntie.png",
  headshot: "assets/characters/headshots/headshot-auntie.png",
  character: "assets/characters/auntie.png",
  category: "Other",
  car: "Other",
  city: "The Forge",
  country: "Other",
  faction: "keyfree",
  bio: profileBios.auntie
}, {
  id: "mack-spindell",
  name: "Mack Spindell",
  title: "Legendary Tuner",
  image: "assets/characters/headshots/headshot-mack-spindell.png",
  headshot: "assets/characters/headshots/headshot-mack-spindell.png",
  character: "assets/characters/mack-spindell.png",
  category: "Other",
  car: "Manstrocity",
  signatureLineId: "armadaddio",
  carImage: "assets/cars/armadillo-manstrocity-display.png",
  city: "Spindell Legacy Circuit",
  country: "Other",
  faction: "spindell",
  bio: profileBios["mack-spindell"]
}, {
  id: "sloane-spindell",
  name: "Sloane Spindell",
  title: "Legendary Tuner",
  image: "assets/characters/headshots/headshot-sloane-spindell.png",
  headshot: "assets/characters/headshots/headshot-sloane-spindell.png",
  character: "assets/characters/sloane-spindell.png",
  category: "Other",
  car: "Chillmatic",
  signatureLineId: "chill-penguin",
  carImage: "assets/cars/penguin-chillmatic-display.png",
  city: "Spindell Legacy Circuit",
  country: "Other",
  faction: "spindell",
  bio: profileBios["sloane-spindell"]
}], otherNpcProfiles);

const tunerRankBossOrder = bosses.slice(0, 7);
const tunerRankBaseList = [{
  rank: 1,
  name: "Pallavi",
  headshot: "assets/characters/headshots/headshot-pallavi.png",
  isBoss: true,
  bossId: "pallavi"
}].concat(tunerRankBossOrder.slice().reverse().map((boss, index) => ({
  rank: index + 2,
  name: boss.name,
  headshot: boss.headshot || boss.unmaskedPortrait || boss.portrait,
  isBoss: true,
  bossId: boss.id,
  cityId: storyCities.find((city) => city.bossIndex === bosses.findIndex((item) => item.id === boss.id))?.id || ""
})), [{
  rank: 9,
  name: "Your Rival",
  headshot: "assets/characters/headshots/headshot-cha-cha.png",
  isRival: true,
  rivalId: "dynamic"
}]).concat(racerProfiles
  .filter((profile) => profile.id && !tuners.some((tuner) => tuner.id === profile.id) && !bossChallengeBosses.some((boss) => boss.id === profile.id))
  .filter((profile, index, list) => list.findIndex((item) => item.id === profile.id) === index)
  .map((profile, index) => ({
    rank: index + 10,
    name: profile.name,
    headshot: profile.headshot || profile.image,
    profileId: profile.id
  })));

const convoyFactionIcons = {
  keyfree: "assets/items/icon-convoy-keyfree.png",
  spindell: "assets/items/icon-convoy-spindell.png"
};
const convoyParticipantProfiles = {
  tyree: { sponsor: "Dr. Tyree", headshot: "assets/characters/headshots/headshot-dr-tyree.png" },
  ashley: { sponsor: "Ashley Racem", headshot: "assets/characters/headshots/headshot-ashley.png" },
  mack: { sponsor: "Mack Spindell", headshot: "assets/characters/headshots/headshot-mack-spindell.png" },
  sloane: { sponsor: "Sloane Spindell", headshot: "assets/characters/headshots/headshot-sloane-spindell.png" },
  eli: { sponsor: "Eli Kaufman", headshot: "assets/characters/headshots/headshot-eli.png" },
  crosby: { sponsor: "Crosby Nash", headshot: "assets/characters/headshots/headshot-crosby.png" },
  portia: { sponsor: "Portia Crosh", headshot: "assets/characters/headshots/headshot-portia.png" }
};
const convoyParticipantStages = {
  tyree: [
    { type: "drag", opponentCarId: "sorority-elephant", opponentName: "Tyree's Sororitrunk" },
    { type: "battle", opponentCarId: "training-car", opponentName: "Tyree's Tutorque" },
    { type: "h2h", opponentCarId: "metal-snake", opponentName: "Tyree's Snaytan" }
  ],
  ashley: [
    { type: "drag", opponentCarId: "skater-koala", opponentName: "Ashley's Koaster" },
    { type: "battle", opponentCarId: "tiger-cart", opponentName: "Ashley's Notar-O" },
    { type: "h2h", opponentCarId: "space-dolphin", opponentName: "Ashley's Astromarino" }
  ],
  mack: [
    { type: "drag", opponentCarId: "pickup", opponentName: "Mack's Murrka" },
    { type: "battle", opponentCarId: "construction-blok", opponentName: "Mack's Structable" },
    { type: "h2h", opponentCarId: "armadaddio", opponentEvolutionIndex: 2, opponentName: "Mack's Manstrocity" }
  ],
  sloane: [
    { type: "drag", opponentCarId: "bee", opponentName: "Sloane's Baybee" },
    { type: "battle", opponentCarId: "space-dolphin", opponentName: "Sloane's Orbitide" },
    { type: "h2h", opponentCarId: "chill-penguin", opponentEvolutionIndex: 2, opponentName: "Sloane's Chillmatic" }
  ],
  eli: [
    { type: "drag", opponentCarId: "butcher-hog", opponentName: "Eli's Chopcicle" },
    { type: "battle", opponentCarId: "skater-koala", opponentName: "Eli's Koaster" },
    { type: "h2h", opponentCarId: "tiger-cart", opponentEvolutionIndex: 0, opponentName: "Eli's Puttercat" }
  ],
  crosby: [
    { type: "drag", opponentCarId: "chill-penguin", opponentName: "Crosby's Brrap" },
    { type: "battle", opponentCarId: "karate-cow", opponentName: "Crosby's Udderlee" },
    { type: "h2h", opponentCarId: "muscle-man", opponentEvolutionIndex: 0, opponentName: "Crosby's Tourquette" }
  ],
  portia: [
    { type: "drag", opponentCarId: "sorority-elephant", opponentEvolutionIndex: 0, opponentName: "Portia's Elepledge" },
    { type: "battle", opponentCarId: "sorority-elephant", opponentEvolutionIndex: 1, opponentName: "Portia's Sororitrunk" },
    { type: "h2h", opponentCarId: "sorority-elephant", opponentEvolutionIndex: 2, opponentName: "Portia's Plaidonna" }
  ]
};
const convoyBranchPlan = [
  { id: "mylo-indianapolis-eli", factionId: "keyfree", playerTunerId: "mylo", cityId: "indianapolis", participantId: "eli", medallionId: storyMedallionAssignments.indianapolis.convoy },
  { id: "mylo-berlin-ashley", factionId: "keyfree", playerTunerId: "mylo", cityId: "berlin", participantId: "ashley", medallionId: storyMedallionAssignments.berlin.convoy },
  { id: "mylo-dubai-eli", factionId: "keyfree", playerTunerId: "mylo", cityId: "dubai", participantId: "eli", medallionId: storyMedallionAssignments.dubai.convoy },
  { id: "mylo-rio-tyree", factionId: "keyfree", playerTunerId: "mylo", cityId: "rio", participantId: "tyree", medallionId: storyMedallionAssignments.rio.convoy },
  { id: "mylo-los-angeles-portia", factionId: "keyfree", playerTunerId: "mylo", cityId: "los-angeles", participantId: "portia", medallionId: storyMedallionAssignments["los-angeles"].convoy },
  { id: "mylo-seoul-ashley", factionId: "keyfree", playerTunerId: "mylo", cityId: "seoul", participantId: "ashley", medallionId: storyMedallionAssignments.seoul.convoy },
  { id: "mylo-cape-town-mack", factionId: "keyfree", playerTunerId: "mylo", cityId: "cape-town", participantId: "mack", medallionId: storyMedallionAssignments["cape-town"].convoy },
  { id: "mylo-bengaluru-tyree", factionId: "keyfree", playerTunerId: "mylo", cityId: "bangalore", participantId: "tyree", medallionId: storyMedallionAssignments.bangalore.convoy },
  { id: "chacha-indianapolis-crosby", factionId: "spindell", playerTunerId: "cha-cha", cityId: "indianapolis", participantId: "crosby", medallionId: storyMedallionAssignments.indianapolis.convoy },
  { id: "chacha-berlin-tyree", factionId: "spindell", playerTunerId: "cha-cha", cityId: "berlin", participantId: "tyree", medallionId: storyMedallionAssignments.berlin.convoy },
  { id: "chacha-dubai-sloane", factionId: "spindell", playerTunerId: "cha-cha", cityId: "dubai", participantId: "sloane", medallionId: storyMedallionAssignments.dubai.convoy },
  { id: "chacha-rio-ashley", factionId: "spindell", playerTunerId: "cha-cha", cityId: "rio", participantId: "ashley", medallionId: storyMedallionAssignments.rio.convoy },
  { id: "chacha-los-angeles-portia", factionId: "spindell", playerTunerId: "cha-cha", cityId: "los-angeles", participantId: "portia", medallionId: storyMedallionAssignments["los-angeles"].convoy },
  { id: "chacha-seoul-tyree", factionId: "spindell", playerTunerId: "cha-cha", cityId: "seoul", participantId: "tyree", medallionId: storyMedallionAssignments.seoul.convoy },
  { id: "chacha-cape-town-crosby", factionId: "spindell", playerTunerId: "cha-cha", cityId: "cape-town", participantId: "crosby", medallionId: storyMedallionAssignments["cape-town"].convoy },
  { id: "chacha-bengaluru-ashley", factionId: "spindell", playerTunerId: "cha-cha", cityId: "bangalore", participantId: "ashley", medallionId: storyMedallionAssignments.bangalore.convoy }
];
const legacyConvoyDefinitions = {
  tyree: {
    id: "tyree",
    name: "Tyree's Convoy",
    sponsor: "Dr. Tyree",
    headshot: "assets/characters/headshots/headshot-dr-tyree.png",
    icon: "assets/items/icon-medallion-gauntlet.png",
    stages: convoyParticipantStages.tyree,
    rewards: {
      firstWin: { sprox: 5000, parts: ["legendary-engine"], medallions: 1 },
      replayWin: { sprox: 1500 }
    }
  },
  ashley: {
    id: "ashley",
    name: "Ashley's Convoy",
    sponsor: "Ashley Racem",
    headshot: "assets/characters/headshots/headshot-ashley.png",
    icon: "assets/items/icon-medallion-gauntlet.png",
    stages: convoyParticipantStages.ashley,
    rewards: {
      firstWin: { sprox: 5000, parts: ["legendary-handling"], medallions: 1 },
      replayWin: { sprox: 1500 }
    }
  }
};
const convoyDefinitions = convoyBranchPlan.reduce((definitions, plan) => {
  const participant = convoyParticipantProfiles[plan.participantId] || convoyParticipantProfiles.tyree;
  definitions[plan.id] = {
    id: plan.id,
    name: `${participant.sponsor}'s Convoy`,
    sponsor: participant.sponsor,
    cityId: plan.cityId,
    factionId: plan.factionId,
    playerTunerId: plan.playerTunerId,
    participantId: plan.participantId,
    headshot: participant.headshot,
    icon: convoyFactionIcons[plan.factionId],
    medallionId: plan.medallionId,
    stages: convoyParticipantStages[plan.participantId] || convoyParticipantStages.tyree,
    rewards: {
      firstWin: { sprox: 3000, parts: ["placeholder-convoy-part"], medallions: 1 },
      replayWin: { sprox: 1000 }
    }
  };
  return definitions;
}, { ...legacyConvoyDefinitions });

const convoyDialogue = {
  tyree: {
    intro: "[CONVOY_INTRO_PLACEHOLDER_tyree]",
    win: "[CONVOY_WIN_PLACEHOLDER_tyree]",
    loseTyree: "[CONVOY_LOSE_TYREE_PLACEHOLDER]",
    loseAshley: "[CONVOY_LOSE_ASHLEY_PLACEHOLDER]"
  },
  ashley: {
    intro: "[CONVOY_INTRO_PLACEHOLDER_ashley]",
    win: "[CONVOY_WIN_PLACEHOLDER_ashley]",
    loseTyree: "[CONVOY_LOSE_TYREE_PLACEHOLDER]",
    loseAshley: "[CONVOY_LOSE_ASHLEY_PLACEHOLDER]"
  }
};

const rivalRaceScriptCities = ["indianapolis", "dubai", "los-angeles", "cape-town"];
const rivalRaceScripts = {
  mylo: Object.fromEntries(rivalRaceScriptCities.map((cityId) => [cityId, {
    pre: [{ speaker: "rival", text: `[Rival Race Placeholder: Mylo POV - ${cityId} - Pre]` }],
    post: [{ speaker: "rival", text: `[Rival Race Placeholder: Mylo POV - ${cityId} - Post]` }]
  }])),
  "cha-cha": Object.fromEntries(rivalRaceScriptCities.map((cityId) => [cityId, {
    pre: [{ speaker: "rival", text: `[Rival Race Placeholder: Cha Cha POV - ${cityId} - Pre]` }],
    post: [{ speaker: "rival", text: `[Rival Race Placeholder: Cha Cha POV - ${cityId} - Post]` }]
  }]))
};

const convoyStoryScripts = Object.fromEntries(convoyBranchPlan.map((plan) => {
  const label = plan.playerTunerId === "mylo" ? "Mylo" : "Cha Cha";
  const participant = convoyParticipantProfiles[plan.participantId]?.sponsor || plan.participantId;
  return [plan.id, {
    pre: [{ speaker: "mentor", text: `[Convoy Placeholder: ${label} / ${plan.cityId} / ${participant} / Pre]` }],
    post: [{ speaker: "mentor", text: `[Convoy Placeholder: ${label} / ${plan.cityId} / ${participant} / Post]` }]
  }];
}));

const bondSceneThresholds = [5, 10, 25, 50];
const bondScenes = Object.fromEntries(cars.map((car) => [car.id, Object.fromEntries(bondSceneThresholds.map((threshold) => [threshold, {
  id: `${car.id}-bond-${threshold}`,
  placeholder: true,
  lines: []
}]))]));
