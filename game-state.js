// ─── STATE MANAGEMENT ───────────────────────────────────────────────────────
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

const gameFeatureConfig = {
  enableMedalSystem: true,
  enableMicroObjectives: false,
  enableGarageIdleAnimations: true,
  enableVINdexRevealNotifications: true,
  enableEvolutionPolish: true,
  enableReputationAnimations: true,
  reduceMotion: false
};

const microObjectiveDefinitions = [
  // TODO: Finalize objective design and approved player-facing copy before enabling.
  {
    id: "placeholder-clean-race",
    titleKey: "OBJECTIVE_PLACEHOLDER_CLEAN_RACE_TITLE",
    descriptionKey: "OBJECTIVE_PLACEHOLDER_CLEAN_RACE_DESCRIPTION",
    eventId: "*",
    objectiveType: "cleanRace",
    targetValue: 1,
    rewardType: "sprox",
    rewardValue: 0,
    enabled: false
  },
  {
    id: "placeholder-target-time",
    titleKey: "OBJECTIVE_PLACEHOLDER_TARGET_TIME_TITLE",
    descriptionKey: "OBJECTIVE_PLACEHOLDER_TARGET_TIME_DESCRIPTION",
    eventId: "*",
    objectiveType: "targetTime",
    targetValue: 0,
    rewardType: "none",
    rewardValue: 0,
    enabled: false
  }
];

const idleBehaviorProfiles = {
  playful: { bob: 1, bounce: 0.8, glowPulse: 0.7, tilt: 0.45 },
  calm: { bob: 0.45, bounce: 0.25, glowPulse: 0.35, tilt: 0.12 },
  aggressive: { bob: 0.35, bounce: 0.7, glowPulse: 0.9, tilt: 0.55 },
  luxury: { bob: 0.35, bounce: 0.2, glowPulse: 0.75, tilt: 0.08 },
  spooky: { bob: 0.65, bounce: 0.12, glowPulse: 1, tilt: 0.28 },
  heavy: { bob: 0.2, bounce: 0.15, glowPulse: 0.45, tilt: 0.08 },
  speedy: { bob: 0.55, bounce: 0.75, glowPulse: 0.85, tilt: 0.5 }
};

const gearbornIdleConfig = {};

const audioCueAssets = {
  // TODO: Wire approved audio files here when available. Missing cues intentionally fail silently.
  uiSelect: "",
  uiConfirm: "",
  raceCountdown: "",
  raceStart: "",
  medalReveal: "",
  newVindexEntry: "",
  evolutionBuild: "",
  evolutionReveal: "",
  gearbornIdle: "",
  reputationGain: ""
};

const medalPriority = { none: 0, bronze: 1, silver: 2, gold: 3 };

function reduceMotionEnabled() {
  return Boolean(gameFeatureConfig.reduceMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}

function featureEnabled(key) {
  if (key === "reduceMotion") return reduceMotionEnabled();
  return Boolean(gameFeatureConfig[key]);
}

function playAudioCue(key) {
  const src = audioCueAssets[key];
  if (!src) return;
  try {
    const audio = new Audio(src);
    audio.volume = Math.min(1, Math.max(0, (state?.settings?.volume ?? 45) / 100));
    audio.play().catch(() => {});
  } catch {}
}

function evaluateMicroObjectives(context = {}) {
  if (!featureEnabled("enableMicroObjectives")) return [];
  return microObjectiveDefinitions
    .filter((objective) => objective.enabled && (objective.eventId === "*" || objective.eventId === context.eventId))
    .map((objective) => ({ ...objective, complete: false }));
}

function idleProfileForGearborn(gearbornId) {
  const config = gearbornIdleConfig[gearbornId] || {};
  const profileKey = config.idleProfile || "playful";
  return {
    gearbornId,
    idleProfile: profileKey,
    honkSoundKey: config.honkSoundKey || `honk:${gearbornId}`,
    animationIntensity: Number.isFinite(Number(config.animationIntensity)) ? Number(config.animationIntensity) : 1,
    profile: idleBehaviorProfiles[profileKey] || idleBehaviorProfiles.playful
  };
}

function normalizeMedal(medal) {
  return medalPriority[medal] ? medal : "none";
}

function compareMedals(existingMedal, newMedal) {
  const existing = normalizeMedal(existingMedal);
  const next = normalizeMedal(newMedal);
  return medalPriority[next] > medalPriority[existing] ? next : existing;
}

function storyEventId(index) {
  return `story:${index}`;
}

function calculateMedalForRace(result = {}, raceConfig = {}) {
  if (!featureEnabled("enableMedalSystem")) return "none";
  const type = raceConfig.type || "";
  const placement = Number(result.placement);
  const won = Boolean(result.won);
  if (type === "race6") {
    if (placement === 1) return "gold";
    if (placement === 2) return "silver";
    if (placement === 3) return "bronze";
    return "none";
  }
  if (type === "race4") {
    if (placement === 1) return "gold";
    if (placement === 2) return "silver";
    return "none";
  }
  if (result.medalKey) return normalizeMedal(result.medalKey);
  if (type === "time" || type === "timeTrial") return "none";
  if (raceConfig.oneWin || ["drag", "battle", "pink-slip", "boss", "rival", "duel"].includes(type)) return won ? "gold" : "none";
  return won ? "gold" : "none";
}

function getBestMedalForEvent(eventId) {
  const record = state.raceMedals?.[eventId];
  return normalizeMedal(typeof record === "string" ? record : record?.medal);
}

function saveBestMedalForEvent(eventId, medal) {
  if (!featureEnabled("enableMedalSystem") || !eventId) return { medal: "none", improved: false };
  const newMedal = normalizeMedal(medal);
  if (newMedal === "none") return { medal: getBestMedalForEvent(eventId), improved: false };
  state.raceMedals = state.raceMedals || {};
  const previous = getBestMedalForEvent(eventId);
  const best = compareMedals(previous, newMedal);
  const improved = medalPriority[best] > medalPriority[previous];
  if (improved) {
    state.raceMedals[eventId] = { medal: best, updatedAt: Date.now() };
  }
  return { medal: best, improved };
}

function medalLabel(medal) {
  return ({ gold: "Gold", silver: "Silver", bronze: "Bronze" }[normalizeMedal(medal)] || "");
}

function medalFrameClass(medal) {
  const normalized = normalizeMedal(medal);
  return normalized === "none" ? "" : `medal-frame medal-frame-${normalized}`;
}

function medalResultMarkup(medal, improved = false) {
  const normalized = normalizeMedal(medal);
  if (normalized === "none") return "";
  return `<p class="race-result-medal medal-${normalized} ${improved ? "new-best" : ""}"><span>${medalLabel(normalized)}</span>${improved ? "<em>New Best</em>" : ""}</p>`;
}

function storyMedalConfig(level) {
  if (!level) return { type: "drag", oneWin: true };
  if (level.type === "circuit") return { type: level.circuitMode === "race6" ? "race6" : "race4" };
  if (level.type === "trial") return { type: "timeTrial" };
  if (level.type === "boss") return { type: "boss", oneWin: true };
  if (level.type === "pink-slip") return { type: "pink-slip", oneWin: true };
  if (level.type === "rival") return { type: level.mechanic === "circuitDuel" ? "duel" : "rival", oneWin: true };
  if (level.type === "battle") return { type: "battle", oneWin: true };
  return { type: level.type || "drag", oneWin: true };
}

function saveStoryMedal(levelIndex, result = {}) {
  const level = campaignLevels[levelIndex];
  const medal = calculateMedalForRace(result, storyMedalConfig(level));
  return saveBestMedalForEvent(storyEventId(levelIndex), medal);
}

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
  vindexFilter: "all",
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
  tutorialSnapshotGarage: null,
  tutorialSnapshotUnlockedLines: null,
  tutorialSnapshotMedallions: null,
  tutorialSnapshotComplete: null,
  tutorialChoiceResponse: null,
  tutorialSplash: "",
  storyCarChosen: false,
  highestBossIndex: 0,
  selectedCampaign: 0,
  highestCampaignIndex: 0,
  selectedStoryCity: 0,
  visitedStoryCities: {},
  playerGauntletProgress: {},
  activeGauntlet: null,
  consecutiveLosses: 0,
  garbageMedallionAwarded: false,
  completedCampaignLevels: {},
  raceMedals: {},
  microObjectiveProgress: {},
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
  tool: "build",
  dirty: false,
  modalMode: null,
  pendingName: ""
};

const builderTileDefs = [
  { id: "grass", label: "Grass", asset: "assets/tracks/grass.png", accent: "transparent" },
  { id: "road_horizontal", label: "Horizontal Road", asset: "assets/tracks/track-horizontal.png", accent: "transparent", placeType: "road_straight", placeRotation: 0 },
  { id: "road_vertical", label: "Vertical Road", asset: "assets/tracks/track-vertical.png", accent: "transparent", placeType: "road_straight", placeRotation: 90 },
  { id: "road_turn", label: "Road Turn", asset: "assets/tracks/track-turn.png", accent: "transparent" },
  { id: "wall_straight", label: "Wall Straight", asset: "assets/tracks/wall_straight.png", accent: "transparent" },
  { id: "wall_corner", label: "Wall Corner", asset: "assets/tracks/wall_corner.png", accent: "transparent" },
  { id: "start_finish", label: "Start / Finish", asset: "assets/tracks/start-finish-line.png", accent: "transparent", marker: true },
  { id: "checkpoint", label: "Checkpoint", asset: "assets/tracks/checkpoint-neutral.png", accent: "transparent", marker: true }
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
  betaPreviewScreen: document.querySelector("#beta-preview-screen"),
  betaPreviewBack: document.querySelector("#beta-preview-back"),
  betaPreviewTitle: document.querySelector("#beta-preview-title"),
  betaLeaderboard: document.querySelector("#beta-leaderboard"),
  betaPreviewMap: document.querySelector("#beta-preview-map"),
  betaPreviewCity: document.querySelector("#beta-preview-city"),
  betaCityMenu: document.querySelector("#beta-city-menu"),
  betaPreviewCar: document.querySelector("#beta-preview-car"),
  betaPreviewStart: document.querySelector("#beta-preview-start"),
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
  betaMode: document.querySelector("#beta-mode"),
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
  builderBuild: document.querySelector("#builder-build"),
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
  storyCitySelect: document.querySelector("#story-city-select"),
  changeStoryCar: document.querySelector("#change-story-car"),
  storyCityIcon: document.querySelector("#story-city-icon"),
  storyCityTitle: document.querySelector("#story-city-title"),
  storyCitySelect: document.querySelector("#story-city-select"),
  bossUnlockNote: document.querySelector("#boss-unlock-note"),
  storyMapStage: document.querySelector("#story-map-stage"),
  storyPreviewPanel: document.querySelector("#story-preview-panel"),
  closeStoryPreview: document.querySelector("#close-story-preview"),
  storyPreviewIcon: document.querySelector("#story-preview-icon"),
  storyPreviewArt: document.querySelector("#story-preview-art"),
  storyPreviewLeaderboard: document.querySelector("#story-preview-leaderboard"),
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
  vindexStatus: document.querySelector("#vindex-status"),
  vindexClassStamp: document.querySelector("#vindex-class-stamp"),
  vindexTypeStamp: document.querySelector("#vindex-type-stamp"),
  vindexPlate: document.querySelector("#vindex-plate"),
  vindexFilterButtons: document.querySelector("#vindex-filter-buttons"),
  vindexProgress: document.querySelector("#vindex-progress"),
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
  tutorialChoices: document.querySelector("#tutorial-choices"),
  tutorialBack: document.querySelector("#tutorial-back"),
  tutorialNext: document.querySelector("#tutorial-next"),
  tutorialSkip: document.querySelector("#tutorial-skip"),
  tutorialSkipModal: document.querySelector("#tutorial-skip-modal"),
  cancelTutorialSkip: document.querySelector("#cancel-tutorial-skip"),
  confirmTutorialSkip: document.querySelector("#confirm-tutorial-skip"),
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
let pendingCityWelcome = null;

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
