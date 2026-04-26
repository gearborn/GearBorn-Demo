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
const finalBoss = { id: "racer-alpha", name: "Racer Alpha", car: "Hornula1", track: { id: "space", city: "Space", country: "Final Track", map: "assets/maps/map-space.png" }, difficulty: 2.25, xp: 1800, carImage: "assets/story/unlock-hornula1-topdown.png", portrait: "assets/bosses/racer-alpha-helmet.png", unmaskedPortrait: "assets/bosses/racer-alpha.png" };
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
const campaignLevels = bosses.flatMap((boss, index) => {
  const drag = { type: "drag", title: `${campaignDragStages[index].rankKey} Class Drag: ${campaignDragStages[index].name}`, drag: campaignDragStages[index] };
  const trial = { type: "trial", title: `${boss.track.city} Time Trial`, track: boss.track, bossIndex: index };
  const battle = { type: "boss", title: `${boss.name} Boss Race`, bossIndex: index };
  return index % 2 === 0 ? [drag, trial, battle] : [trial, drag, battle];
}).concat([{ type: "boss", title: `${finalBoss.name} Final Boss`, bossIndex: bosses.length, final: true }]);
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
const tuners = [
  { id: "mylo", name: "Mylo Ziggs", gender: "male", image: "assets/characters/mylo-ziggs.png", bio: "A hopeful, self-made Tuner with big dreams and messy execution. Mylo did not grow up in the GearBorn world. He forced his way in. He is always a step behind, but what he lacks in polish, he makes up for in heart." },
  { id: "cha-cha", name: "Cha Cha Spindell", gender: "female", image: "assets/characters/cha-cha-spindell.png", bio: "The gold standard of a Tuner, and tired of being treated like a legacy. Daughter of legends Mack and Sloane Spindell, Cha Cha has spent her life at the top because she earned it." }
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
  "racer-alpha": "No name. No past. Just speed. Racer Alpha is a myth made real, hidden behind a mirrored helmet that reveals nothing. No one knows where he came from. If you beat him, you earn the right to find out."
};
const racerProfiles = tuners.concat(bossChallengeBosses.map((boss) => ({
  id: boss.id,
  name: boss.name,
  image: boss.unmaskedPortrait || boss.portrait,
  car: boss.car,
  city: boss.track.city,
  country: boss.track.country,
  bio: profileBios[boss.id] || "Profile bio placeholder. Add the final lore from the Web Game Lore Doc."
})));
const saveKey = "gearborn-demo-save-v1";
const tunerChoiceVersion = 1;
const instructorSceneLines = [
  { speaker: "instructor", text: "Welcome to the Tuner Academy. I’m here to prep you for your first race." },
  { speaker: "user", text: "I know what I’m doing. Can we get to the race?" },
  { speaker: "instructor", text: "Just one thing first. Your garage is stocked with 6 unique GearBorn." },
  { speaker: "instructor", text: "Racing earns XP, which goes toward leveling your car." },
  { speaker: "user", text: "I get it. Level up, go faster." },
  { speaker: "instructor", text: "That’s correct. But once you reach Level 5, something amazing happens..." },
  { speaker: "user", text: "How do I get to Level 5 if you won’t shut up and let me race?" },
  { speaker: "instructor", text: "Can you just...? GearBorn evolve, yada yada yada. You ruined it." },
  { speaker: "instructor", text: "Try to evolve all 6 to their final form for a special surprise." },
  { speaker: "user", text: "Is it a pony?" },
  { speaker: "instructor", text: "It’s not a pony." },
  { speaker: "instructor", text: "If a race is too hard, go to the Training Academy to earn more XP." },
  { speaker: "user", text: "Too hard isn’t a thing, but thanks, I guess." },
  { speaker: "instructor", text: "Fine, just... go race. I’m so sick of you hot-shot young Tuners who think you know everything..." }
];
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
      { speaker: "user", text: "Wait -hold on..." },
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
  selectedProfile: racerProfiles[0].id,
  racerAlphaUnmasked: false,
  racerAlphaProfileView: "masked",
  selectedTuner: null,
  tunerChosen: false,
  tunerChoiceVersion: 0,
  instructorIntroSeen: false,
  storyCarChosen: false,
  highestBossIndex: 0,
  selectedCampaign: 0,
  highestCampaignIndex: 0,
  timeTrials: {},
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
const modeFlow = {
  drag: "car",
  time: "car",
  boss: "car",
  story: "car"
};
let storyReplayOpen = false;

const el = {
  views: document.querySelectorAll(".view"),
  navButtons: document.querySelectorAll("[data-view]"),
  dragCarGrid: document.querySelector("#drag-car-grid"),
  timeCarGrid: document.querySelector("#time-car-grid"),
  bossCarGrid: document.querySelector("#boss-car-grid"),
  storyCarGrid: document.querySelector("#story-car-grid"),
  playerCar: document.querySelector("#player-car"),
  storyCar: document.querySelector("#story-car"),
  campaignCar: document.querySelector("#campaign-car"),
  timeCar: document.querySelector("#time-car"),
  timeTrack: document.querySelector("#time-track"),
  timeTrackGrid: document.querySelector("#time-track-grid"),
  timeTrackPreview: document.querySelector("#time-track-preview"),
  bossList: document.querySelector("#boss-list"),
  bossPreview: document.querySelector("#boss-preview"),
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
  garageStatus: document.querySelector("#garage-status"),
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
  unmaskModal: document.querySelector("#unmask-modal"),
  unmaskPortrait: document.querySelector("#unmask-portrait"),
  unmaskButton: document.querySelector("#unmask-button"),
  continueUnmask: document.querySelector("#continue-unmask"),
  unmaskCopy: document.querySelector("#unmask-copy")
};
const embeddedRaceHomes = ["play", "time-trial", "boss"].map((view) => {
  const node = document.querySelector(`#${view}-view`);
  return { view, node, parent: node.parentNode, next: node.nextSibling };
});
let embeddedCampaignView = null;
let pendingBossRaceStart = null;

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
  state.highestRankIndex = Math.min(state.highestRankIndex || 0, ranks.length - 1);
  if (ranks.findIndex((rank) => rank.key === state.selectedRank) > state.highestRankIndex) {
    state.selectedRank = ranks[state.highestRankIndex].key;
  }
  if (!bossChallengeBosses.some((boss) => boss.id === state.selectedBoss)) state.selectedBoss = bossChallengeBosses[0].id;
  state.highestBossIndex = Math.min(state.highestBossIndex || 0, bossChallengeBosses.length - 1);
  state.highestCampaignIndex = Math.min(state.highestCampaignIndex || 0, campaignLevels.length - 1);
  state.selectedCampaign = Math.min(state.selectedCampaign || 0, state.highestCampaignIndex);
  if (bossChallengeBosses.findIndex((boss) => boss.id === state.selectedBoss) > state.highestBossIndex) {
    state.selectedBoss = bossChallengeBosses[state.highestBossIndex].id;
  }
  if (!storyTracks.some((track) => track.id === state.selectedTimeTrack)) state.selectedTimeTrack = storyTracks[0].id;
  if (!vindexEntries.some((entry) => entry.number === state.selectedVindex)) state.selectedVindex = vindexEntries[0].number;
  if (!racerProfiles.some((profile) => profile.id === state.selectedProfile)) state.selectedProfile = racerProfiles[0].id;
  state.racerAlphaProfileView = state.racerAlphaProfileView === "unmasked" ? "unmasked" : "masked";
  if (!state.racerAlphaUnmasked) state.racerAlphaProfileView = "masked";
  if (state.selectedTuner && !tuners.some((tuner) => tuner.id === state.selectedTuner)) state.selectedTuner = null;
  state.tunerChoiceVersion = state.tunerChoiceVersion || 0;
  state.instructorIntroSeen = Boolean(state.instructorIntroSeen);
  state.storyCarChosen = Boolean(state.storyCarChosen);
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
  const evolutionBoost = 1 + unlockedEvolutionIndex(carId) * 0.18;
  const levelBoost = 1 + (progress.level - 1) * 0.075;
  return {
    power: levelBoost * evolutionBoost,
    maxSpeed: 112 + progress.level * 6.5 + unlockedEvolutionIndex(carId) * 20,
    acceleration: 23 + progress.level * 1.25 + unlockedEvolutionIndex(carId) * 4.5,
    shiftWindow: Math.max(0.09, 0.18 - unlockedEvolutionIndex(carId) * 0.008)
  };
}

function difficultyMultiplier() {
  return { easy: 0.9, normal: 1, hard: 1.13 }[state.settings.difficulty] || 1;
}

function selectedCarIdForMode(mode) {
  if (mode === "drag") return state.selectedCar;
  if (mode === "time") return state.selectedTimeCar;
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
  document.querySelector("#story-view")?.classList.toggle("story-race-step", modeFlow.story === "race");
  el.campaignList.classList.toggle("story-hidden", !storyReplayOpen);
}

function setFlowStep(mode, step) {
  modeFlow[mode] = step;
  if (mode === "story" && step === "next" && !storyReplayOpen) {
    state.selectedCampaign = Math.min(state.highestCampaignIndex, campaignLevels.length - 1);
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
    <button class="icon-card ${selectedCarIdForMode(mode) === car.id ? "active" : ""}" type="button" data-car-target="${mode}" data-car-id="${car.id}">
      <div class="selection-preview-art">${carMarkupForEvolution(car.id, progress.evolution, "display")}</div>
      <strong>${form.name}</strong>
      <small>${car.family} · Lv ${progress.level}</small>
    </button>
  `;
}

function renderCarTiles() {
  const available = cars.filter((car) => isCarUnlocked(car.id));
  const starterOnly = available.filter((car) => !car.unlockable);
  if (el.dragCarGrid) el.dragCarGrid.innerHTML = starterOnly.map((car) => carTileMarkup(car, "drag")).join("");
  if (el.timeCarGrid) el.timeCarGrid.innerHTML = starterOnly.map((car) => carTileMarkup(car, "time")).join("");
  if (el.bossCarGrid) el.bossCarGrid.innerHTML = starterOnly.map((car) => carTileMarkup(car, "boss")).join("");
  if (el.storyCarGrid) el.storyCarGrid.innerHTML = starterOnly.map((car) => carTileMarkup(car, "story")).join("");
}

function render() {
  renderFlowScreens();
  renderCarTiles();
  renderCarSelect();
  renderVerticalSelects();
  renderCampaign();
  renderBosses();
  renderTimeTargets();
  renderTimeTrackGrid();
  renderVindex();
  renderProfiles();
  renderTuners();
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
  el.campaignCar.innerHTML = options;
  el.timeCar.innerHTML = options;
  el.storyCar.value = state.selectedStoryCar;
  el.campaignCar.value = state.selectedStoryCar;
  el.timeCar.value = state.selectedTimeCar;
  el.timeTrack.innerHTML = storyTracks.map((track) => `<option value="${track.id}">${track.city}, ${track.country}</option>`).join("");
  el.timeTrack.value = state.selectedTimeTrack;
}

function renderCampaign() {
  el.campaignList.innerHTML = campaignLevels.map((level, index) => {
    const locked = index > state.highestCampaignIndex;
    const active = index === state.selectedCampaign;
    const type = level.type === "drag" ? "Drag Race" : level.type === "trial" ? "Time Trial" : "Boss Battle";
    return `
      <button class="campaign-button ${active ? "active" : ""} ${locked ? "locked" : ""}" type="button" data-campaign="${index}" ${locked ? "disabled" : ""}>
        <strong>${index + 1}. ${locked && level.final ? "?" : level.title}</strong>
        <small>${locked ? "Locked" : type}</small>
      </button>
    `;
  }).join("");
  const level = campaignLevels[state.selectedCampaign];
  const locked = state.selectedCampaign > state.highestCampaignIndex;
  el.campaignType.textContent = locked ? "Locked" : level.type === "drag" ? "Drag Race" : level.type === "trial" ? "Time Trial" : "Boss Battle";
  el.campaignTitle.textContent = locked && level.final ? "?" : level.title;
  el.campaignMeta.textContent = campaignLevelMeta(level, locked);
  renderCampaignRewards(level, locked);
  renderStoryLoadout();
  el.startCampaign.disabled = locked;
  el.startCampaign.textContent = storyReplayOpen ? "Start Level" : "Continue Story";
}

function renderCampaignRewards(level, locked) {
  if (locked) {
    el.campaignRewards.innerHTML = "";
    return;
  }
  if (level.type === "trial") {
    const trackIndex = storyTracks.findIndex((track) => track.id === level.track.id);
    el.campaignRewards.innerHTML = timeMedals.map((medal) => `
      <div class="reward-row compact">
        <span class="medal-text ${medal.key}">${medal.label}</span>
        <strong>${timeTarget(medal, trackIndex).toFixed(2)} s · ${medal.xp} XP</strong>
      </div>
    `).join("");
    return;
  }
  if (level.type === "drag") {
    el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${level.drag.xp} XP</strong></div>`;
    return;
  }
  const boss = level.final ? finalBoss : bosses[level.bossIndex];
  el.campaignRewards.innerHTML = `<div class="reward-row"><span>Win Reward</span><strong>${boss.xp} XP</strong></div>`;
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
  if (level.type === "drag") return `${level.drag.rankKey} Class · ${level === campaignLevels[0] ? "200 m" : "500 m"}`;
  if (level.type === "trial") return `${level.track.city}, ${level.track.country} · No Phantaxi`;
  const boss = level.final ? finalBoss : bosses[level.bossIndex];
  return `${boss.name} · ${boss.car} · ${boss.xp} XP`;
}

function renderBosses() {
  el.bossList.innerHTML = bossChallengeBosses.map((boss, index) => {
    const active = boss.id === state.selectedBoss;
    const locked = index > state.highestBossIndex;
    return `
      <button class="boss-button ${active ? "active" : ""} ${locked ? "locked" : ""}" type="button" data-boss="${boss.id}" ${locked ? "disabled" : ""}>
        <strong>${index + 1}. ${boss.name}</strong>
        <small>${locked ? "Locked" : `${boss.track.city}, ${boss.track.country} · ${boss.car} · ${boss.xp} XP`}</small>
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

function renderTimeTargets() {
  const trackIndex = storyTracks.findIndex((track) => track.id === state.selectedTimeTrack);
  const best = state.timeTrials[state.selectedTimeTrack]?.bestTime;
  el.timeLocation.textContent = trackLabel(state.selectedTimeTrack);
  applyTrackMap(el.timeTrialTrack, storyTracks.find((track) => track.id === state.selectedTimeTrack));
  el.timeTargets.innerHTML = timeMedals.map((medal) => {
    const target = timeTarget(medal, trackIndex);
    return `<div><span><span class="medal-text ${medal.key}">${medal.label}</span> · ${medal.difficulty}</span><strong>${target.toFixed(2)} s · ${medal.xp} XP</strong></div>`;
  }).join("") + `<div><span>Phantaxi Time</span><strong>${best ? `${best.toFixed(2)} s` : "No Phantaxi Time"}</strong></div>`;
}

function renderTimeTrackGrid() {
  if (!el.timeTrackGrid) return;
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
  const playable = playableEntryMeta(entry);
  if (playable) {
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
    items = playable.car.evolutions.map((evolution, index) => ({
      name: evolution.name,
      image: imageFor(evolution, "display"),
      discovered: isCarUnlocked(playable.car.id) && unlockedEvolutionIndex(playable.car.id) >= index
    }));
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
      <img src="${character.image}" alt="${character.name}" onerror="this.parentElement.classList.add('placeholder'); this.remove();">
      <span>${initials}</span>
    </div>
  `;
}

function renderProfiles() {
  el.profileList.innerHTML = racerProfiles.map((profile) => `
    <button class="vindex-button ${profile.id === state.selectedProfile ? "active" : ""}" type="button" data-profile="${profile.id}">
      <span>${profile.car ? "Boss" : "Tuner"}</span>
      <strong>${profile.name}</strong>
    </button>
  `).join("");
  const profile = racerProfiles.find((item) => item.id === state.selectedProfile) || racerProfiles[0];
  const displayProfile = profile.id === "racer-alpha" && state.racerAlphaProfileView !== "unmasked"
    ? { ...profile, image: finalBoss.portrait }
    : profile;
  el.profileArt.innerHTML = characterMarkup(displayProfile) + racerAlphaProfileToggle(profile);
  el.profileName.textContent = profile.name;
  el.profileMeta.textContent = profile.car ? `${profile.car} · ${profile.city}, ${profile.country}` : "Story Tuner";
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
      ${characterMarkup(tuner)}
      <strong>${tuner.name}</strong>
    </button>
  `).join("");
  el.tunerOptions.innerHTML = markup;
  el.settingsTunerOptions.innerHTML = markup;
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
  const godModeActive = garageGodModeActive();
  el.garageStatus.hidden = !godModeActive;
  el.garageStatus.textContent = godModeActive
    ? "God Mode Active: Rainbowlt is Level 10 and evolved into Hornula1"
    : "";
  el.garageGrid.innerHTML = cars.map((car) => {
    if (!isCarUnlocked(car.id)) {
      return lockedGarageCard(car);
    }
    const progress = state.garage[car.id];
    const next = xpForNextLevel(progress.level);
    const maxed = progress.level >= maxCarLevel;
    const pct = maxed ? 100 : Math.min(100, (progress.xp / next) * 100);
    const stats = carStats(car.id);
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
            <span class="evolution">Form ${progress.evolution + 1} / ${unlockedEvolutionIndex(car.id) + 1}</span>
          </div>
          ${garageEvolutionControls(car)}
          <div class="meta-row">
            <span>Max Speed</span>
            <span>${Math.round(stats.maxSpeed)} MPH</span>
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
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${currentEvolution(currentCar.id).name}" onerror="this.closest('.car')?.classList.remove('has-image')">` : "";
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
  race = null;
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
  const finishedRace = race;
  const isStoryRace = finishedRace.campaignLevelIndex !== null && finishedRace.campaignLevelIndex !== undefined;

  let earned = 0;
  let xpResult = null;
  if (playerWon) {
    earned = Math.floor(race.distance.xp * race.rank.xpBonus * difficultyMultiplier());
    xpResult = addXp(state.selectedCar, earned);
    const rankIndex = ranks.findIndex((rank) => rank.key === race.rank.key);
    if (rankIndex === state.highestRankIndex && state.highestRankIndex < ranks.length - 1) {
      state.highestRankIndex += 1;
    }
    el.raceMessage.className = "race-message win";
    el.raceMessage.textContent = "";
  } else {
    earned = Math.floor(race.distance.xp * 0.16);
    xpResult = addXp(state.selectedCar, earned);
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
    xp: earned,
    xpResult,
    primaryLabel: isStoryRace ? "Next" : "Select Opponent",
    raceAgainLabel: "Race Again",
    onPrimary: () => {
      if (isStoryRace) {
        finishStoryRaceScreen();
      } else {
        setFlowStep("drag", "match");
      }
      showPendingEvolution(state.selectedCar);
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
    if (newEvolution > unlockedEvolutionIndex(carId)) {
      progress.pendingEvolution = progress.pendingEvolution || unlockedEvolutionIndex(carId) + 1;
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
      <h2>${result.won ? "Victory" : "Defeat"}</h2>
      <p>XP Earned: <strong>${result.xp}</strong></p>
      ${(result.lines || []).map((line) => `<p>${line}</p>`).join("")}
      ${result.xpResult?.leveledUp ? `<p>${result.xpResult.name} has leveled up to Lvl. ${result.xpResult.level}</p>` : ""}
      <div class="race-result-actions">
        <button class="primary" type="button" data-result-action="primary">${result.primaryLabel || "Continue"}</button>
        <button class="ghost" type="button" data-result-action="again">${result.raceAgainLabel || "Race Again"}</button>
      </div>
    </div>
  `;
  popup.addEventListener("click", (event) => {
    const button = event.target.closest("[data-result-action]");
    if (!button) return;
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
  setFlowStep("story", "next");
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

function closeEvolutionModal() {
  evolutionModal = null;
  el.evolutionModal.classList.remove("evolution-unlocked");
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

function activateGodMode() {
  if (el.godCode.value.trim() !== "Corey") {
    el.godCodeError.textContent = "Incorrect code.";
    el.godCode.focus();
    return;
  }
  state.unlockedCars = { ...state.unlockedCars, rainbowlt: true };
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
  state.selectedCampaign = Math.min(state.selectedCampaign || 0, state.highestCampaignIndex);
  state.selectedBoss = finalBoss.id;
  saveState();
  closeGodModal();
  closeEvolutionModal();
  render();
  showView("garage");
  el.raceMessage.className = "race-message win";
  el.raceMessage.textContent = "God Mode activated. Rainbowlt is now Level 10 and evolved into Hornula1.";
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
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${rank.name}" onerror="this.closest('.car')?.classList.remove('has-image')">` : "";
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
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${alt}" onerror="this.closest('.car')?.classList.remove('has-image')">` : "";
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
  const imageTag = image ? `<img class="car-image" src="${image}" alt="${form.name}" onerror="this.closest('.car')?.classList.remove('has-image')">` : "";
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
    state.selectedCampaign = Math.min(state.highestCampaignIndex, campaignLevels.length - 1);
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
}

function storyTunerReady() {
  return Boolean(state.tunerChosen && state.selectedTuner && state.tunerChoiceVersion >= tunerChoiceVersion);
}

function ensureTunerAndIntro(view) {
  if (!["story", "solo"].includes(view)) return;
  if (!storyTunerReady()) {
    pendingIntroView = view;
    openTunerModal();
    return;
  }
  openInstructorIntroIfNeeded();
}

function openInstructorIntroIfNeeded() {
  if (state.instructorIntroSeen || !storyTunerReady()) return;
  openStoryCutscene({ type: "intro", title: "Training Academy Intro" }, null);
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
  if (index === state.highestCampaignIndex && state.highestCampaignIndex < campaignLevels.length - 1) {
    state.highestCampaignIndex += 1;
  }
  state.selectedCampaign = Math.min(index + 1, campaignLevels.length - 1);
  saveState();
}

function startCampaignLevel() {
  const index = state.selectedCampaign;
  if (index > state.highestCampaignIndex) return;
  if (!storyTunerReady()) {
    openTunerModal();
    return;
  }
  const level = campaignLevels[index];
  const runLevel = () => startCampaignRace(index, level);
  if (!state.instructorIntroSeen) {
    openInstructorIntroIfNeeded();
    return;
  }
  if (shouldShowStoryCutscene(index, level)) {
    openStoryCutscene(level, runLevel);
    return;
  }
  runLevel();
}

function startCampaignRace(index, level) {
  if (level.type === "drag") {
    mountCampaignRace("play");
    state.selectedCar = state.selectedStoryCar;
    state.selectedDistance = index === 0 ? 200 : 500;
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
  const tuner = tuners.find((item) => item.id === state.selectedTuner) || tuners[0];
  const isIntro = level.type === "intro";
  const boss = level.type === "boss" ? (level.final ? finalBoss : bosses[level.bossIndex]) : null;
  activeCutsceneContext = { type: isIntro ? "intro" : level.type, boss, phase };
  activeCutsceneLines = isIntro ? instructorSceneLines : storyCutsceneScripts[boss?.id]?.[phase] || null;
  activeCutsceneIndex = 0;
  el.cutsceneTitle.textContent = "Story Scene";
  el.cutsceneModal.classList.toggle("single-speaker", Boolean(activeCutsceneLines));
  if (activeCutsceneLines) {
    renderCutsceneLine();
  } else {
    const other = boss || { name: "Instructor", image: "assets/characters/instructor.png" };
    el.cutsceneLeftArt.innerHTML = characterMarkup(tuner);
    el.cutsceneRightArt.innerHTML = characterMarkup(other);
    el.cutsceneLeftDialogue.textContent = "Placeholder dialogue for your chosen tuner will appear here.";
    el.cutsceneRightDialogue.textContent = "Placeholder boss dialogue will appear here.";
  }
  el.cutsceneModal.dataset.sceneType = isIntro ? "intro" : level.type;
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
  if (line.speaker === "instructor") return { name: "Instructor", image: "assets/characters/instructor.png" };
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
  const sceneType = el.cutsceneModal.dataset.sceneType;
  el.cutsceneModal.classList.remove("active");
  el.cutsceneModal.setAttribute("aria-hidden", "true");
  el.cutsceneModal.classList.remove("single-speaker");
  el.cutsceneModal.dataset.sceneType = "";
  activeCutsceneLines = null;
  activeCutsceneIndex = 0;
  activeCutsceneContext = null;
  el.backCutscene.hidden = true;
  el.continueCutscene.textContent = "Continue";
  el.continueCutscene.classList.remove("finish");
  if (sceneType === "intro") {
    state.instructorIntroSeen = true;
    saveState();
  }
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

function showRacerAlphaUnmask() {
  el.unmaskPortrait.innerHTML = `<img src="${finalBoss.portrait}" alt="Racer Alpha helmet" onerror="this.remove()">`;
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
  el.unmaskPortrait.innerHTML = `<img src="${finalBoss.unmaskedPortrait}" alt="Racer Alpha" onerror="this.remove()">`;
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
    pendingIntroView = null;
    openInstructorIntroIfNeeded();
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
  raceState.countdownStarted = false;
  el.storyMapStart.classList.remove("active");
  el.timeMapStart.classList.remove("active");
  const elapsed = (performance.now() - raceState.startTime) / 1000;
  let resultXp = 0;
  let resultXpState = null;
  const resultLines = [];
  if (raceState.mode === "boss" || raceState.mode === "campaign-boss") {
    const xp = playerWon ? raceState.bossData.xp : Math.floor(raceState.bossData.xp * 0.18);
    const xpResult = addXp(raceState.carId, xp);
    resultXp = xp;
    resultXpState = xpResult;
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
    const beaten = timeMedals.find((medal) => elapsed <= timeTarget(medal, trackIndex));
    const xp = beaten ? beaten.xp : 40;
    const xpResult = addXp(raceState.carId, xp);
    resultXp = xp;
    resultXpState = xpResult;
    const best = state.timeTrials[raceState.trackId]?.bestTime;
    if (raceState.mode === "time" && (!best || elapsed < best)) {
      state.timeTrials[raceState.trackId] = { bestTime: elapsed, ghost: raceState.record.filter((_, index) => index % 4 === 0) };
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
    won: playerWon,
    xp: resultXp,
    xpResult: resultXpState,
    lines: resultLines,
    primaryLabel: isStoryRace ? "Next" : raceState.mode === "time" ? "Select Map" : "Select Opponent",
    raceAgainLabel: "Race Again",
    onPrimary: () => {
      if (raceState.mode === "boss" || raceState.mode === "campaign-boss") {
        if (playerWon && raceState.mode === "boss" && raceState.bossData.id === "racer-alpha") {
          showRacerAlphaUnmask();
          return;
        }
      }
      if (isStoryRace) {
        const finishStory = () => {
          finishStoryRaceScreen();
          showPendingEvolution(raceState.carId);
        };
        const level = campaignLevels[raceState.campaignLevelIndex];
        if (playerWon && raceState.mode === "campaign-boss" && shouldShowStoryCutscene(raceState.campaignLevelIndex, level)) {
          openStoryCutscene(level, finishStory, "post");
          return;
        }
        finishStory();
      } else if (raceState.mode === "boss") {
        setFlowStep("boss", "match");
        showPendingEvolution(raceState.carId);
      } else {
        setFlowStep("time", "match");
        showPendingEvolution(raceState.carId);
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
  const key = direction === "left" ? "ArrowLeft" : "ArrowRight";
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

el.campaignCar.addEventListener("change", (event) => {
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
el.startCampaign.addEventListener("click", startCampaignLevel);
el.changeStoryCar.addEventListener("click", () => setFlowStep("story", "car"));
el.replayCampaign.addEventListener("click", () => {
  storyReplayOpen = true;
  setFlowStep("story", "next");
});
el.startStory.addEventListener("click", () => openBossIntro());
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

el.campaignList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-campaign]");
  if (!button || button.disabled) return;
  state.selectedCampaign = Number(button.dataset.campaign);
  saveState();
  renderCampaign();
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
  const button = event.target.closest("[data-evolve-car]");
  if (!button) return;
  showPendingEvolution(button.dataset.evolveCar);
});

el.evolveButton.addEventListener("click", () => {
  if (!evolutionModal) return;
  el.evolveButton.hidden = true;
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
el.godMode.addEventListener("click", openGodModal);
el.confirmGod.addEventListener("click", activateGodMode);
el.cancelGod.addEventListener("click", closeGodModal);
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
  if (event.key === "Escape" && el.godModal.classList.contains("active")) {
    closeGodModal();
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
