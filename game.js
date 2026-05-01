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
    id: "rainbowlt",
    family: "Secret",
    color: "#c084fc",
    trait: "Unlocked by mastering every starter line",
    unlockable: true,
    unlockInstruction: "Evolve all 11 GearBorn lines to their final forms to unlock",
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
const garageLineOrder = defaultUnlockedLines.concat(pinkSlipUnlockOrder, ["rainbowlt", "metal-snake", "training-car"]);
const maxCarLevel = 10;
const tutorialCarId = "metal-snake";
const tutorialOpponentCarId = "training-car";
const tutorialTrack = { id: "training-school", city: "Training School", country: "Tuner Academy", map: "assets/maps/map-training-academy.png" };
const tutorialDistance = { meters: 400, label: "400 m", xp: 80, difficulty: 0.55 };
const tutorialRank = { key: "F", name: "Tutorque", xpBonus: 1, power: 0.28, color: "#9aa7b7", images: { display: "assets/cars/tutorque-display.png", race: "assets/cars/tutorque-race.png" } };
const tutorialMedals = [
  { key: "gold", label: "Gold", difficulty: "Hard", xp: 420, base: 16.0 },
  { key: "silver", label: "Silver", difficulty: "Medium", xp: 260, base: 19.0 },
  { key: "bronze", label: "Bronze", difficulty: "Easy", xp: 150, base: 23.0 }
];
const tutorialScenes = [
  { id: "intro", label: "Intro", view: "menu", copy: "Tutorial placeholder: Dr. Tyree welcomes you to GearBorn." },
  { id: "mode-select", label: "Mode Select", view: "solo", copy: "Tutorial placeholder: Training Academy holds practice races." },
  { id: "mamburn", label: "Drag Race - Mamburn", view: "play", flow: "car", copy: "Tutorial placeholder: Select Mamburn for your first training run." },
  { id: "drag-race", label: "Drag Race", view: "play", flow: "match", copy: "Tutorial placeholder: Race Tutorque in a 400 m drag race." },
  { id: "dr-controls", label: "DR Controls", view: "play", flow: "race", copy: "Tutorial placeholder: Use Shift to hit clean gear changes, then fire Nitro when your bar is charged." },
  { id: "sprox", label: "Sprox", view: "play", wait: true, copy: "Tutorial placeholder: Winning races earns Sprox." },
  { id: "time-trial", label: "Time Trial", view: "time-trial", flow: "match", copy: "Tutorial placeholder: Time Trials test clean driving." },
  { id: "tt-controls", label: "TT Controls", view: "time-trial", flow: "race", copy: "Tutorial placeholder: Steer toward boosts, avoid obstacles, and keep your run clean." },
  { id: "tt-after", label: "TT After", view: "time-trial", wait: true, copy: "Tutorial placeholder: Nice time trial run." },
  { id: "battle", label: "Battle", view: "battle", flow: "match", copy: "Tutorial placeholder: Battle Mode is a turn-based arena challenge." },
  { id: "pre-battle", label: "Pre Battle", view: "battle", flow: "race", copy: "Tutorial placeholder: Choose attacks, defend to reduce damage, and save SP for specials." },
  { id: "post-battle", label: "Post Battle", view: "battle", wait: true, copy: "Tutorial placeholder: Winning battles earns more Sprox." },
  { id: "garage", label: "Garage", view: "garage", copy: "Tutorial placeholder: The Garage is where upgrades happen." },
  { id: "upgrade", label: "Upgrade", view: "garage", copy: "Tutorial placeholder: Spend Sprox to level Mamburn from 9 to 10." },
  { id: "evolve", label: "Evolve", view: "garage", wait: true, copy: "Tutorial placeholder: Level 10 unlocks Snaytan." },
  { id: "vindex", label: "VINdex", view: "vindex", copy: "Tutorial placeholder: The VINdex tracks discovered GearBorn." },
  { id: "starters", label: "Starters", view: "garage", copy: "Tutorial placeholder: Your starter Garage is ready." }
];
const tutorialSceneSelectOptions = [
  { label: "Drag Race", scene: "mamburn" },
  { label: "Time Trial", scene: "time-trial" },
  { label: "Battle", scene: "battle" },
  { label: "Garage", scene: "garage" },
  { label: "VINdex", scene: "vindex" }
];
const gearbornKeyImage = "assets/items/item-gearbornkey.png";
const tutorialDialogue = {
  intro: [
    ["tyree", "Welcome to Spindell Training Academy! My name is Dr. Tyree. I’ll be the one evaluating you today to become a Tuner."],
    ["user", "Doctor? For cars?"],
    ["tyree", "I wasn’t able to pass the Tuner exam, so I devoted my life to studying everything there is about GearBorn. I’ve got a PhD in GearBorn Mechanics and History."],
    ["user", "Oh, so this is a “those who can’t do” situation."],
    ["tyree", "I wouldn’t talk such a big game just yet. You haven’t even started the test."],
    ["tyree", "Follow me."]
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
  0: { carId: "pig", rankKey: "D", xp: 180, power: 1.08, distance: 400 },
  1: { carId: "sorority-elephant", rankKey: "C", xp: 240, power: 1.2, distance: 800 },
  2: { carId: "grunge-fish", rankKey: "C", xp: 300, power: 1.32, distance: 800 },
  3: { carId: "florida-gator", rankKey: "B", xp: 360, power: 1.45, distance: 800 },
  4: { carId: "whale", rankKey: "B", xp: 420, power: 1.55, distance: 800 },
  5: { carId: "techno-dinosaur", rankKey: "A", xp: 540, power: 1.74, distance: 1600 },
  6: { carId: "karate-cow", rankKey: "S", xp: 680, power: 1.95, distance: 1600 },
  7: { carId: "frog", rankKey: "S", xp: 820, power: 2.08, distance: 1600 }
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
  const battle = { type: "boss", title: `${boss.name} Boss Race`, bossIndex: index };
  const arc = index % 2 === 0 ? [drag, trial, arena, battle] : [trial, drag, arena, battle];
  return pinkSlipRacePlan[index] ? arc.concat([{ type: "pink-slip", title: pinkSlipStageFor(pinkSlipRacePlan[index]).title, drag: pinkSlipStageFor(pinkSlipRacePlan[index]), pinkSlipCarId: pinkSlipRacePlan[index].carId }]) : arc;
}).concat([{ type: "boss", title: `${finalBoss.name} Final Boss`, bossIndex: bosses.length, final: true }]);
const storyNodeLayouts = [
  { key: "drag", x: 20, y: 66 },
  { key: "trial", x: 80, y: 66 },
  { key: "battle", x: 50, y: 56 },
  { key: "boss", x: 50, y: 28 },
  { key: "pink-slip", x: 50, y: 84 }
];
const storyLevelVisuals = {
  drag: { label: "Drag Race", icon: "assets/items/icon-drag-race.png", color: "#ffc857" },
  trial: { label: "Time Trial", icon: "assets/items/icon-time-trial.png", color: "#6ee7a8" },
  battle: { label: "Battle", icon: "assets/items/icon-battle.png", color: "#f25f5c" },
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
  const levelCount = 4 + (pinkSlipRacePlan[index] ? 1 : 0);
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
  ["198", "Elepledge", "Sorority Elephant Line", "assets/cars/sorority-elephant-elepledge-display.png"],
  ["199", "Sororitrunk", "Sorority Elephant Line", "assets/cars/sorority-elephant-sororitrunk-display.png"],
  ["200", "Plaidonna", "Sorority Elephant Line", "assets/cars/sorority-elephant-plaidonna-display.png"],
  ["212", "Tutorque", "Training Car Line", "assets/cars/tutorque-display.png"],
  ["231", "Rivvir", "Exulted Frog Line", "assets/cars/frog-rivvir-display.png"],
  ["232", "Croakra", "Exulted Frog Line", "assets/cars/frog-croakra-display.png"],
  ["233", "Kermajesty", "Exulted Frog Line", "assets/cars/frog-kermajesty-display.png"],
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
  tutorialStartingSprox: 0,
  storyCarChosen: false,
  highestBossIndex: 0,
  selectedCampaign: 0,
  highestCampaignIndex: 0,
  selectedStoryCity: 0,
  completedCampaignLevels: {},
  unlockedLines: [...defaultUnlockedLines],
  timeTrials: {},
  storyTimeTrials: {},
  garage: Object.fromEntries(cars.map((car) => [car.id, { level: 1, xp: 0, evolution: 0, pendingEvolution: null }]))
};

let state = loadState();
sanitizeState();
let race = null;
let lastFrame = 0;
let evolutionModal = null;
let verticalRace = null;
let pendingCutsceneStart = null;
let activeCutsceneLines = null;
let activeCutsceneIndex = 0;
let activeCutsceneContext = null;
let pendingDragRace = null;
let pendingIntroView = null;
let pendingPinkSlipContinue = null;
let upgradeModalCarId = null;
const modeFlow = {
  drag: "car",
  time: "car",
  boss: "car",
  battle: "car",
  story: "car"
};
let battleState = null;
let storyReplayOpen = false;

const el = {
  views: document.querySelectorAll(".view"),
  navButtons: document.querySelectorAll("[data-view]"),
  sproxTotal: document.querySelector("#sprox-total"),
  dragCarGrid: document.querySelector("#drag-car-grid"),
  timeCarGrid: document.querySelector("#time-car-grid"),
  bossCarGrid: document.querySelector("#boss-car-grid"),
  battleCarGrid: document.querySelector("#battle-car-grid"),
  storyCarGrid: document.querySelector("#story-car-grid"),
  dragCarSelectPreview: document.querySelector("#drag-car-select-preview"),
  timeCarSelectPreview: document.querySelector("#time-car-select-preview"),
  bossCarSelectPreview: document.querySelector("#boss-car-select-preview"),
  battleCarSelectPreview: document.querySelector("#battle-car-select-preview"),
  storyCarSelectPreview: document.querySelector("#story-car-select-preview"),
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
  upgradeCost: document.querySelector("#upgrade-cost"),
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
  continueBoss: document.querySelector("#continue-boss"),
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
    completedCampaignLevels: { ...base.completedCampaignLevels, ...saved.completedCampaignLevels },
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
  state.unlockedCars = Object.fromEntries(state.unlockedLines.map((carId) => [carId, true]));
  state.timeTrials = state.timeTrials || {};
  state.storyTimeTrials = state.storyTimeTrials || {};
  state.settings.verticalKeys = {
    ...defaultState.settings.verticalKeys,
    ...(state.settings.verticalKeys || {})
  };
  if (allStarterFinalFormsUnlocked() && !state.unlockedLines.includes("rainbowlt")) {
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
  for (let index = 0; index < state.highestCampaignIndex; index += 1) {
    state.completedCampaignLevels[index] = state.completedCampaignLevels[index] ?? true;
  }
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
  state.tutorialStartingSprox = Math.max(0, Math.floor(Number(state.tutorialStartingSprox) || 0));
  state.storyCarChosen = Boolean(state.storyCarChosen);
  if (!cars.some((car) => car.id === state.selectedStoryCar) || !isCarUnlocked(state.selectedStoryCar)) state.selectedStoryCar = cars[0].id;
  if (!cars.some((car) => car.id === state.selectedTimeCar) || !isCarUnlocked(state.selectedTimeCar)) state.selectedTimeCar = cars[0].id;
  cars.forEach((car) => {
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

function allStarterFinalFormsUnlocked() {
  return starterCarIds.every((carId) => {
    const car = cars.find((item) => item.id === carId);
    const progress = state.garage?.[carId];
    return progress && unlockedEvolutionIndex(carId) >= car.evolutions.length - 1;
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
  if (!state.unlockedLines.includes("rainbowlt") && allStarterFinalFormsUnlocked()) {
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
  return car.evolutions[progress.evolution] || car.evolutions[0];
}

function unlockedEvolutionIndex(carId) {
  const car = cars.find((item) => item.id === carId);
  const progress = state.garage[carId];
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
  const evolutionGain = Math.max(0, state.garage?.[carId]?.evolution || 0) * 2;
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
    <div class="car-select-preview-copy">
      <span>${car.family}</span>
      <h3>${form.name}</h3>
      <p>${playstyle}</p>
      <small>Level ${progress.level} · Form ${progress.evolution + 1} / ${unlockedEvolutionIndex(car.id) + 1}</small>
      ${garageStatsMarkup(stats)}
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
  renderCarSelectPreview("drag", el.dragCarSelectPreview);
  renderCarSelectPreview("time", el.timeCarSelectPreview);
  renderCarSelectPreview("boss", el.bossCarSelectPreview);
  renderCarSelectPreview("battle", el.battleCarSelectPreview);
  renderCarSelectPreview("story", el.storyCarSelectPreview);
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
  if (viewIsActive("settings") || el.tunerModal?.classList.contains("active")) renderTuners();
  if (needsDrag) {
    renderDistanceOptions();
    renderOpponents();
    renderSelectionPreviews();
  }
  if (viewIsActive("garage")) renderGarage();
  if (viewIsActive("settings")) renderSettings();
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
  return city.levels.filter((level) => level.type === "drag" || level.type === "trial" || level.type === "battle").filter((level) => storyLevelCompleted(level.campaignIndex)).length;
}

function cityBossUnlocked(city) {
  if (city.final) return storyCityUnlocked(storyCities.indexOf(city));
  return cityCoreLevelsCompleted(city) >= 2;
}

function cityBossCompleted(city) {
  const bossLevel = city.levels.find((level) => level.type === "boss");
  return bossLevel ? storyLevelCompleted(bossLevel.campaignIndex) : false;
}

function storyLevelVisible(city, level) {
  if (level.type === "drag" || level.type === "trial" || level.type === "battle") return true;
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
  const remaining = Math.max(0, 2 - cityCoreLevelsCompleted(city));
  el.bossUnlockNote.textContent = cityUnlocked && !city.final && !cityBossUnlocked(city) ? `Beat ${remaining}/3 Levels to Unlock Boss Race` : "";
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
  el.storyPreviewIcon.innerHTML = `<img src="${visual.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">`;
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
    `).join("") + bestResult;
    return;
  }
  if (level.type === "drag" || level.type === "pink-slip") {
    el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${level.drag.xp} Sprox</strong></div>`;
    return;
  }
  if (level.type === "battle") {
    const reward = battleRewardForBossIndex(level.bossIndex);
    el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${reward} Sprox</strong></div>`;
    return;
  }
  const boss = level.final ? finalBoss : bosses[level.bossIndex];
  el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${boss.xp} Sprox</strong></div>`;
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
    : bossBattleStats(boss);
  const opponentImage = options.tutorial ? "assets/cars/tutorque-race.png" : battleCarImageForBoss(boss);
  const opponentName = options.tutorial ? "Tutorque" : boss.car;
  battleState = {
    mode,
    boss,
    player,
    opponent: battleUnitFromStats(opponentName, opponentImage, opponentStats),
    waitingNext: false,
    finished: false,
    campaignLevelIndex: options.campaignLevelIndex ?? null
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
  const earned = tutorialActive() && !won ? 0 : won ? battleRewardForBossIndex(index) : Math.round(35 + Math.max(0, index) * 18);
  addSprox(earned);
  if (tutorialActive() && won) setTutorialScene("post-battle");
  if (won && battleState.campaignLevelIndex !== null) completeCampaignLevel(battleState.campaignLevelIndex);
  saveState();
  if (tutorialActive() && won) renderTutorial();
  showRaceResult(el.battleArena, {
    won,
    title: tutorialActive() && !won ? "RACE LOST" : undefined,
    sprox: earned,
    lines: [],
    hideRaceAgain: tutorialActive() && !won,
    hideSprox: tutorialActive() && !won,
    disableActions: tutorialActive() && won,
    primaryLabel: tutorialActive() && !won ? "Try Again" : tutorialActive() ? "Next" : battleState.campaignLevelIndex !== null ? "Next" : "Select Opponent",
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
        finishStoryRaceScreen();
      } else {
        battleState = null;
        setFlowStep("battle", "match");
      }
    },
    onRaceAgain: () => beginBattle(battleState.mode, { boss: battleState.boss, campaignLevelIndex: battleState.campaignLevelIndex })
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
        discovered: playable.car.id === tutorialOpponentCarId
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
          ${garageStatsMarkup(stats)}
          <div class="meta-row">
            <span>${maxed ? "Max Level" : `Upgrade: ${upgradeCost} Sprox`}</span>
            <span>${progress.pendingEvolution ? "Ready to evolve" : "Race ready"}</span>
          </div>
          ${!maxed ? `<button class="garage-upgrade" type="button" data-upgrade-car="${car.id}">Upgrade</button>` : ""}
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
      </div>
      <div class="garage-info">
        <h2>${currentEvolution(tutorialCarId).name}</h2>
        <h3>${car.family}</h3>
        <p class="playstyle-tag">${playstyle}</p>
        <div class="meta-row">
          <span>Level ${progress.level}</span>
          <span class="evolution">Training</span>
        </div>
        ${garageStatsMarkup(stats)}
        <div class="meta-row">
          <span>${maxed ? "Max Level" : "Upgrade: 5000 Sprox"}</span>
          <span>${progress.pendingEvolution ? "Ready to evolve" : "Race ready"}</span>
        </div>
        ${!maxed ? `<button class="garage-upgrade" type="button" data-upgrade-car="${tutorialCarId}">Upgrade</button>` : ""}
        ${progress.pendingEvolution ? `<button class="garage-evolve" type="button" data-evolve-car="${tutorialCarId}">Evolve</button>` : ""}
      </div>
    </article>
  `;
}

function garageStatsMarkup(stats) {
  return `
    <div class="garage-stat-grid" aria-label="GearBorn stats">
      ${garageStatBar("SPD", stats.speed)}
      ${garageStatBar("ACC", stats.acceleration)}
      ${garageStatBar("HDL", stats.handling)}
      ${garageStatBar("TRQ", stats.torque)}
      ${garageStatBar("BDY", stats.body)}
      ${garageStatBar("PWR", stats.powertrain)}
    </div>
  `;
}

function garageStatBar(label, value) {
  const pct = normalizedGearbornStat(value) * 100;
  return `
    <div class="garage-stat">
      <span>${label}</span>
      <div class="garage-stat-bar"><div style="width:${pct}%"></div></div>
    </div>
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
      ${upgradeStatBar("SPD", currentStats.speed, nextStats.speed)}
      ${upgradeStatBar("ACC", currentStats.acceleration, nextStats.acceleration)}
      ${upgradeStatBar("HDL", currentStats.handling, nextStats.handling)}
      ${upgradeStatBar("TRQ", currentStats.torque, nextStats.torque)}
      ${upgradeStatBar("BDY", currentStats.body, nextStats.body)}
      ${upgradeStatBar("PWR", currentStats.powertrain, nextStats.powertrain)}
    </div>
  `;
}

function upgradeStatBar(label, current, next) {
  const currentPct = normalizedGearbornStat(current) * 100;
  const nextPct = normalizedGearbornStat(next) * 100;
  const gainPct = Math.max(0, nextPct - currentPct);
  return `
    <div class="garage-stat upgrade-stat">
      <span>${label}</span>
      <div class="garage-stat-bar upgrade-stat-bar">
        <div class="upgrade-current" style="width:${currentPct}%"></div>
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
  el.upgradeCost.textContent = maxed ? "This GearBorn is already maxed." : `Price: ${cost} Sprox`;
  el.confirmUpgrade.disabled = maxed || !canAffordUpgrade(cost);
  el.confirmUpgrade.textContent = maxed ? "Max Level" : "Level Up";
}

function closeUpgradeModal() {
  upgradeModalCarId = null;
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

function garageEvolutionControls(car) {
  const progress = state.garage[car.id];
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
    rivalShiftTimer: Math.max(0.65, 1.3 - rivalNitroSkill * 0.35),
    rivalNitroDelay: 0,
    shiftScore: [],
    rank,
    distance,
    dragStage,
    campaignLevelIndex
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
  if (race.rivalNitroCharge < 4 || race.rivalNitroActive || race.rivalNitroDelay > 0) return;
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

function useRivalNitro() {
  race.rivalNitroCharge = 0;
  race.rivalNitroActive = true;
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

  saveState();
  if (isStoryRace && playerWon) {
    completeCampaignLevel(finishedRace.campaignLevelIndex);
  }
  render();
  showRaceResult(el.dragTrack, {
    won: playerWon,
    title: tutorialActive() && !playerWon ? "RACE LOST" : undefined,
    sprox: earned,
    primaryLabel: tutorialActive() && !playerWon ? "Try Again" : isStoryRace ? "Next" : "Select Opponent",
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
  el.raceMessage.className = "race-message loss";
  el.raceMessage.textContent = "";
  showRaceResult(el.dragTrack, {
    won: false,
    title: tutorialActive() ? "RACE LOST" : title,
    sprox: 0,
    primaryLabel: tutorialActive() ? "Try Again" : isStoryRace ? "Next" : "Select Opponent",
    raceAgainLabel: "Race Again",
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
        <button class="primary" type="button" data-result-action="primary" ${result.disableActions ? "disabled" : ""}>${result.primaryLabel || "Continue"}</button>
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

function showPinkSlipUnlock(carId, onContinue) {
  const car = cars.find((item) => item.id === carId);
  if (!car) {
    onContinue?.();
    return;
  }
  unlockGearbornLine(carId);
  const form = car.evolutions[0];
  pendingPinkSlipContinue = onContinue;
  evolutionModal = { mode: "pink-slip", carId, evolution: 0 };
  el.evolutionModal.classList.add("evolution-unlocked");
  el.evolutionKicker.textContent = "Pink Slip Won";
  el.evolutionTitle.textContent = `${form.name} is Unlocked`;
  el.evolutionCopy.textContent = "and is parked in your Garage";
  el.evolveButton.hidden = true;
  el.closeEvolution.textContent = "Continue";
  el.evolutionStage.innerHTML = carMarkupForEvolution(carId, 0, "display");
  el.evolutionModal.classList.add("active");
  el.evolutionModal.setAttribute("aria-hidden", "false");
  el.closeEvolution.focus();
}

function closeEvolutionModal() {
  const continueAfterPinkSlip = evolutionModal?.mode === "pink-slip" ? pendingPinkSlipContinue : null;
  pendingPinkSlipContinue = null;
  evolutionModal = null;
  el.evolutionModal.classList.remove("evolution-unlocked");
  el.evolutionModal.classList.remove("active");
  el.evolutionModal.setAttribute("aria-hidden", "true");
  continueAfterPinkSlip?.();
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
  closeUpgradeModal();
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

function showView(view) {
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
  if (!["story", "play", "time-trial", "boss", "battle"].includes(view)) render();
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
  if (scene.id === "upgrade") {
    ensureTutorialCarState({ level: 9 });
  } else {
    ensureTutorialCarState();
  }
  if (scene.view) showView(scene.view);
  if (scene.flow) {
    if (scene.view === "play") setFlowStep("drag", scene.flow);
    if (scene.view === "time-trial") setFlowStep("time", scene.flow);
    if (scene.view === "battle") setFlowStep("battle", scene.flow);
  }
  if (scene.id === "drag-race") setupTutorialDragMenu();
  if (scene.id === "time-trial") setupTutorialTimeMenu();
  if (scene.id === "battle") {
    state.selectedStoryCar = tutorialCarId;
    state.selectedBattleBoss = bosses[0].id;
    battleState = null;
  }
  if (scene.id === "pre-battle" && (!battleState || battleState.finished || battleState.mode !== "tutorial-battle")) {
    beginBattle("tutorial-battle", { tutorial: true, boss: bosses[0] });
  }
  if (scene.id === "garage") showView("garage");
  if (scene.id === "upgrade") openUpgradeModal(tutorialCarId);
  if (scene.id === "vindex") {
    closeUpgradeModal();
    if (el.evolutionModal) {
      evolutionModal = null;
      el.evolutionModal.classList.remove("evolution-unlocked");
      el.evolutionModal.classList.remove("active");
      el.evolutionModal.setAttribute("aria-hidden", "true");
    }
    state.selectedVindex = "110";
    showView("vindex");
  }
  if (scene.id === "starters") {
    showView("garage");
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
  if (speaker === "user") return selectedTuner();
  if (speaker === "key") return { name: "GearBorn Key", image: gearbornKeyImage };
  if (speaker === "tutorque") return { name: "Tutorque", image: "assets/cars/tutorque-display.png" };
  return { name: "Dr. Tyree", image: "assets/characters/instructor.png" };
}

function setTutorialScene(sceneId) {
  state.tutorialScene = Math.max(0, tutorialScenes.findIndex((scene) => scene.id === sceneId));
  state.tutorialLine = 0;
  state.tutorialAwaitingUpgrade = false;
  state.tutorialAwaitingEvolve = false;
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
  if (scene.id === "evolve" && state.tutorialLine === tutorialEvolvePromptIndex()) {
    state.tutorialAwaitingEvolve = true;
    saveState();
    renderTutorial();
    return;
  }
  if (state.tutorialLine < lines.length - 1) {
    state.tutorialLine += 1;
    if (scene.id === "upgrade" && state.tutorialLine >= 2 && !state.unlimitedSprox) {
      state.sprox = Math.max(state.sprox || 0, 5000);
      openUpgradeModal(tutorialCarId);
    }
    saveState();
    renderTutorial();
    return;
  }
  state.tutorialLine = 0;
  if (scene.id === "starters") {
    finishTutorial();
    return;
  }
  if (scene.id === "upgrade") {
    state.tutorialAwaitingUpgrade = true;
    saveState();
    renderTutorial();
    return;
  }
  if (scene.id === "mamburn") {
    state.selectedCar = tutorialCarId;
    setFlowStep("drag", "match");
  }
  if (scene.id === "drag-race") {
    prepareDragRace(null, tutorialDragStage());
    setTutorialScene("dr-controls");
    saveState();
    renderTutorial();
    return;
  }
  if (scene.id === "dr-controls") {
    startPendingDragRace();
    setTutorialScene("sprox");
    saveState();
    renderTutorial();
    return;
  }
  if (scene.id === "time-trial") {
    modeFlow.time = "race";
    renderFlowScreens();
    beginVerticalRace("tutorial-time", true, { track: tutorialTrack });
    setTutorialScene("tt-controls");
    saveState();
    renderTutorial();
    return;
  }
  if (scene.id === "tt-controls") {
    modeFlow.time = "race";
    renderFlowScreens();
    if (!verticalRace || verticalRace.finished || verticalRace.mode !== "tutorial-time") {
      beginVerticalRace("tutorial-time", true, { track: tutorialTrack });
    }
    startVerticalCountdown();
    setTutorialScene("tt-after");
    saveState();
    renderTutorial();
    return;
  }
  if (scene.id === "battle") {
    state.selectedStoryCar = tutorialCarId;
    state.selectedBattleBoss = bosses[0].id;
    setTutorialScene("pre-battle");
    setupTutorialScene();
    saveState();
    render();
    return;
  }
  if (scene.id === "pre-battle") {
    if (!battleState || battleState.finished || battleState.mode !== "tutorial-battle") {
      beginBattle("tutorial-battle", { tutorial: true, boss: bosses[0] });
    }
    setTutorialScene("post-battle");
    saveState();
    renderTutorial();
    return;
  }
  if (scene.id === "upgrade") {
    openUpgradeModal(tutorialCarId);
  }
  state.tutorialScene = Math.min(tutorialScenes.length - 1, state.tutorialScene + 1);
  setupTutorialScene();
  saveState();
  render();
}

function rewindTutorial() {
  state.tutorialAwaitingUpgrade = false;
  state.tutorialAwaitingEvolve = false;
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
  if (scene.id === "evolve" && state.tutorialAwaitingEvolve) {
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
  el.tutorialNext.textContent = scene.id === "starters" && state.tutorialLine === lines.length - 1 ? "Continue" : "Next";
  el.tutorialCard.dataset.scene = scene.id;
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
  const runLevel = () => startCampaignRace(index, level);
  if (shouldShowStoryCutscene(index, level)) {
    openStoryCutscene(level, runLevel);
    return;
  }
  runLevel();
}

function startCampaignRace(index, level) {
  closeStoryPreview();
  closeCitySelect();
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
  if (line.speaker === "user") return tuner;
  const boss = activeCutsceneContext?.boss || finalBoss;
  const unmaskedAlpha = boss.id === "racer-alpha" && (
    line.unmask ||
    activeCutsceneLines?.slice(0, activeCutsceneIndex + 1).some((entry) => entry.unmask)
  );
  return {
    name: boss.name,
    image: unmaskedAlpha ? finalBoss.unmaskedPortrait : boss.portrait
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
  el.bossPortrait.innerHTML = `<img src="${boss.portrait}" alt="${boss.name}" loading="lazy" decoding="async" onerror="this.remove()">`;
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
  const isBossRace = mode === "boss" || mode === "campaign-boss";
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
  const isStory = raceStateRef.mode === "boss" || raceStateRef.mode === "campaign-boss";
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
  if (raceState.mode === "boss" || raceState.mode === "campaign-boss") {
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
  el.storyMapStart.classList.remove("active");
  el.timeMapStart.classList.remove("active");
  const elapsed = (performance.now() - raceState.startTime) / 1000;
  let resultSprox = 0;
  let resultWon = playerWon;
  const resultLines = [];
  if (raceState.mode === "boss" || raceState.mode === "campaign-boss") {
    const sprox = playerWon ? raceState.bossData.xp : Math.floor(raceState.bossData.xp * 0.18);
    addSprox(sprox);
    resultSprox = sprox;
    let unlockedBossName = "";
    if (playerWon) {
      if (raceState.bossData.id === "racer-alpha") {
        state.racerAlphaUnmasked = true;
      }
      const bossIndex = bossChallengeBosses.findIndex((boss) => boss.id === raceState.bossData.id);
      if (bossIndex === state.highestBossIndex && state.highestBossIndex < bossChallengeBosses.length - 1) {
        state.highestBossIndex += 1;
        unlockedBossName = bossChallengeBosses[state.highestBossIndex]?.name || "";
      }
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
  saveState();
  render();
  const isStoryRace = raceState.campaignLevelIndex !== null;
  showRaceResult(raceState.trackNode, {
    won: resultWon,
    title: tutorialActive() && !resultWon ? "RACE LOST" : undefined,
    sprox: resultSprox,
    lines: tutorialActive() && !resultWon ? [] : resultLines,
    primaryLabel: tutorialActive() && !resultWon ? "Try Again" : isStoryRace ? "Next" : raceState.mode === "time" ? "Select Map" : "Select Opponent",
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
      if (raceState.mode === "boss" || raceState.mode === "campaign-boss") {
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
  el.storyMapStart.classList.remove("active");
  el.timeMapStart.classList.remove("active");
  if (raceState.mode === "boss" || raceState.mode === "campaign-boss") {
    el.storyMessage.className = "race-message loss";
    el.storyMessage.textContent = "";
  } else {
    el.timeMessage.className = "race-message loss";
    el.timeMessage.textContent = "";
  }
  const isStoryRace = raceState.campaignLevelIndex !== null;
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
    up: "ArrowUp",
    right: "ArrowRight"
  }[direction] || "ArrowRight";
  verticalRace.keys[key] = active;
}

document.querySelectorAll("[data-steer]").forEach((button) => {
  const direction = button.dataset.steer;
  const press = (event) => {
    event.preventDefault();
    button.classList.add("pressed");
    setSteer(direction, true);
  };
  const release = (event) => {
    event.preventDefault();
    button.classList.remove("pressed");
    setSteer(direction, false);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
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
el.unmaskButton.addEventListener("click", unmaskRacerAlpha);
el.continueUnmask.addEventListener("click", closeRacerAlphaUnmask);
el.backCutscene.addEventListener("click", rewindCutscene);
el.continueCutscene.addEventListener("click", advanceCutscene);
el.skipCutscene.addEventListener("click", closeStoryCutsceneAndStart);
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
  }
});

el.evolveButton.addEventListener("click", () => {
  if (!evolutionModal) return;
  const tutorialEvolving = tutorialActive() && currentTutorialScene().id === "evolve" && evolutionModal.carId === tutorialCarId;
  el.evolveButton.hidden = true;
  revealEvolution(evolutionModal.carId, evolutionModal.evolution);
  if (tutorialEvolving) {
    state.tutorialAwaitingEvolve = false;
    state.tutorialLine = 7;
    saveState();
    renderTutorial();
  }
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
  if (event.key === "Escape" && el.upgradeModal.classList.contains("active")) {
    closeUpgradeModal();
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

const loadingExperience = startLoadingExperience();
render();
if (!state.tutorialComplete && !state.tutorialActive) {
  openFirstTutorialModal();
} else if (state.tutorialActive) {
  setupTutorialScene();
}

const finishInitialLoad = () => loadingExperience.complete();
if (document.readyState === "complete") {
  window.setTimeout(finishInitialLoad, 450);
} else {
  window.addEventListener("load", () => window.setTimeout(finishInitialLoad, 450), { once: true });
}
