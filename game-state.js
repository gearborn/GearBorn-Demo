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
  calm: { bob: 0.36, bounce: 0.18, glowPulse: 0.28, tilt: 0.08 },
  aggressive: { bob: 0.35, bounce: 0.7, glowPulse: 0.9, tilt: 0.55 },
  luxury: { bob: 0.28, bounce: 0.14, glowPulse: 0.55, tilt: 0.06 },
  spooky: { bob: 0.65, bounce: 0.12, glowPulse: 1, tilt: 0.28 },
  heavy: { bob: 0.14, bounce: 0.08, glowPulse: 0.34, tilt: 0.04 },
  speedy: { bob: 0.55, bounce: 0.75, glowPulse: 0.85, tilt: 0.5 }
};

// TODO: Add per-GearBorn idle tuning and approved honk sound keys here as assets arrive.
const gearbornIdleConfig = {};

// Phase 3 optional audio manifest. Leave values empty until files are approved;
// playAudioCue intentionally fails silently when a file is missing.
// Expected paths:
// uiSelect: assets/audio/ui-select.mp3
// uiConfirm: assets/audio/ui-confirm.mp3
// raceCountdown: assets/audio/race-countdown.mp3
// raceStart: assets/audio/race-start.mp3
// medalReveal: assets/audio/medal-reveal.mp3
// newVindexEntry: assets/audio/new-vindex-entry.mp3
// evolutionBuild: assets/audio/evolution-build.mp3
// evolutionReveal: assets/audio/evolution-reveal.mp3
// gearbornIdle: assets/audio/gearborn-idle.mp3
// reputationGain: assets/audio/reputation-gain.mp3
// Future asset TODOs: unique GearBorn honks, medal frame PNGs, garage trophy shelf,
// medallion display, city stickers, boss memorabilia, VINdex state art, evolution FX overlays.
const audioCueAssets = {
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
