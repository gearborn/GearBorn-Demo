// ─── BETA MODE: SHARED INTRO SCREENS + DEV FLAG ─────────────────────────────
function beta3dDevEnabled() {
  const params = new URLSearchParams(window.location.search);
  return params.has("beta3d") || params.has("beta") || gearbornStorageGetItem("gearborn_beta_dev") === "1";
}

function setBetaIntroCopy({ kicker, title, subtitle, copy }) {
  if (!el.betaIntro) return;
  const kickerEl = el.betaIntro.querySelector(".modal-kicker");
  const titleEl = el.betaIntro.querySelector("#beta-title");
  const subtitleEl = el.betaIntro.querySelector("h2");
  const copyEl = el.betaIntro.querySelector("p:not(.modal-kicker)");
  if (kickerEl) kickerEl.textContent = kicker;
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  if (copyEl) copyEl.textContent = copy;
}

function openBetaVsIntro() {
  if (!el.betaIntro || !el.betaRace) return;
  el.betaRace.hidden = true;
  el.betaMode?.classList.remove("prototype-only");
  el.betaMode?.classList.add("vs-only");
  setBetaIntroCopy({
    kicker: "Training Academy",
    title: "Gear Prix",
    subtitle: "Choose a race format.",
    copy: "Run full circuit races with the new racing engine."
  });
  showBetaScreen("beta-intro");
  setBetaLoading(false);
  stopBetaDemo(false);
}

function openBetaPrototypeIntro() {
  if (!el.betaIntro || !el.betaRace) return;
  betaRaceContext = { source: "prototype" };
  el.betaRace.hidden = true;
  el.betaMode?.classList.remove("vs-only");
  el.betaMode?.classList.add("prototype-only");
  setBetaIntroCopy({
    kicker: "Beta Mode",
    title: "Beta Mode",
    subtitle: "Prototype Modes",
    copy: "Experimental modes from the GearBorn lab. Expect rough edges."
  });
  showBetaScreen("beta-intro");
  setBetaLoading(false);
  stopBetaDemo(false);
}

function openBetaIntro() {
  if (betaRaceContext?.source === "prototype") openBetaPrototypeIntro();
  else openBetaVsIntro();
}

// ─── HUB MAP BETA FOUNDATION (isolated, disposable prototype) ───────────────
const hubMapState = {
  tileSize: 32,
  width: 24,
  height: 16,
  tiles: [],
  playerX: 12,
  playerY: 8,
  playerDirection: 0,
  moveTween: null,
  animFrame: 0,
  dialogue: null
};

const hubMapTILE_FLOOR = 0;
const hubMapTILE_WALL = 1;
const hubMapTILE_HANGAR = 2;
const hubMapTILE_STRIPE = 3;
const hubMapTILE_DOOR = 4;
const hubMapTILE_CONSOLE = 5;
const hubMapTileWalkable = { 0: true, 1: false, 2: true, 3: true, 4: true, 5: false };
let hubMapAnimClock = 0;
const hubMapAnimInterval = 125;
const hubMapPlayer = { spriteKey: "mylo", direction: 0, moving: false, animCol: 1, walkStep: 0 };
let hubMapShowLabels = false;
let hubMapMovementLocked = false;
const hubMapHeldKeys = {};
let hubMapMoveCooldown = 0;
let hubMapAssetsLoaded = false;
let hubMapBgImage = null;
let hubMapPropsImage = null;
let hubMapTilesetImage = null;
const hubMapSprites = {};
let hubMapSpriteScale = 0;
const hubMapWalkCycle = [0, 1, 2, 1];
const hubMapPortraits = {};
const hubMapPropFrames = {
  vat: { x: 0, y: 0, w: 260, h: 220 },
  car_lift: { x: 280, y: 0, w: 420, h: 180 },
  gear: { x: 0, y: 240, w: 160, h: 160 },
  lamp: { x: 180, y: 240, w: 140, h: 180 },
  toolbox: { x: 0, y: 440, w: 150, h: 130 },
  pipe_h: { x: 180, y: 440, w: 200, h: 90 },
  pipe_v: { x: 420, y: 440, w: 100, h: 160 }
};
const hubMapNpcs = [
  { id: "ashley", spriteKey: "ashley", portraitKey: "ashley", name: "Ashley", x: 4, y: 8, direction: 2 },
  { id: "auntie", spriteKey: "auntie", portraitKey: "auntie", name: "Auntie", x: 12, y: 8, direction: 0 },
  { id: "eli", spriteKey: "eli", portraitKey: "eli", name: "Eli", x: 19, y: 8, direction: 1 }
];
const hubMapNPCs = hubMapNpcs;
const hubMapInteractTiles = [
  { x: 10, y: 13, type: "car_bay", id: "bay_1", carId: "bee" },
  { x: 14, y: 13, type: "car_bay", id: "bay_2", carId: null },
  { x: 18, y: 13, type: "car_bay", id: "bay_3", carId: null },
  { x: 12, y: 2, type: "door", id: "exit" }
];
const hubMapDialogueDB = {
  ashley_default: [
    "You're late. Again.",
    "The bee is in bay one. Don't touch anything else until you talk to Auntie."
  ],
  auntie_default: [
    "Baby. You made it.",
    "We've got three bays ready. Walk up to any console and press E to pull up your garage.",
    "Don't let Ashley catch you messing with her tools."
  ],
  eli_default: [
    "Yo, you see the new setup? Auntie went all out.",
    "I'm working on something for the next race. Come find me when you're done in the garage."
  ]
};
const hubMapDialogue = { active: false, lines: [], page: 0, speakerName: "", portraitKey: "" };

function hubMapCreateImage(src) {
  const hubMapImage = new Image();
  hubMapImage.src = src;
  return hubMapImage;
}

const hubMapFrameFiles = {
  mylo: {
    folder: "assets/hub/sprites/", walk: true,
    down: ["mylo_down_0.png", "mylo_down_1.png", "mylo_down_2.png"],
    left: ["mylo_left_0.png", "mylo_left_1.png", "mylo_left_2.png"],
    up: ["mylo_up_0.png", "mylo_up_1.png", "mylo_up_2.png"]
  },
  ashley: { folder: "assets/hub/sprites/", walk: false, down: ["ashley_down.png"], left: ["ashley_left.png"], up: ["ashley_up.png"] },
  auntie: { folder: "assets/hub/sprites/", walk: false, down: ["auntie_down.png"], left: ["auntie_left.png"], up: ["auntie_up.png"] },
  eli: { folder: "assets/hub/sprites/", walk: false, down: ["eli_down.png"], left: ["eli_left.png"], up: ["eli_up.png"] }
};

function hubMapLoadFrames(key) {
  const definition = hubMapFrameFiles[key];
  if (!definition) return;
  const sprite = { walk: definition.walk, frames: { down: [], left: [], up: [] } };
  hubMapSprites[key] = sprite;
  ["down", "left", "up"].forEach((direction) => {
    sprite.frames[direction] = (definition[direction] || []).map((fileName, index) => {
      const frame = { ready: false, failed: false, canvas: null, w: 0, h: 0, offsetX: 0, srcW: 0, srcH: 0 };
      const src = `${definition.folder}${fileName}`;
      const image = hubMapCreateImage(src);
      image.addEventListener("load", () => {
        const scratch = document.createElement("canvas");
        scratch.width = image.naturalWidth;
        scratch.height = image.naturalHeight;
        const scratchCtx = scratch.getContext("2d");
        if (!scratchCtx) {
          frame.failed = true;
          console.warn("Hub Map sprite frame could not be prepared:", src);
          return;
        }
        scratchCtx.drawImage(image, 0, 0);
        const pixels = scratchCtx.getImageData(0, 0, scratch.width, scratch.height).data;
        let left = scratch.width;
        let top = scratch.height;
        let right = -1;
        let bottom = -1;
        for (let y = 0; y < scratch.height; y += 1) {
          for (let x = 0; x < scratch.width; x += 1) {
            if (pixels[(y * scratch.width + x) * 4 + 3] <= 16) continue;
            left = Math.min(left, x);
            top = Math.min(top, y);
            right = Math.max(right, x);
            bottom = Math.max(bottom, y);
          }
        }
        if (right < left || bottom < top) {
          frame.failed = true;
          console.warn("Hub Map sprite frame is empty:", src);
          return;
        }
        const crop = document.createElement("canvas");
        crop.width = right - left + 1;
        crop.height = bottom - top + 1;
        crop.getContext("2d")?.drawImage(scratch, left, top, crop.width, crop.height, 0, 0, crop.width, crop.height);
        frame.canvas = crop;
        frame.w = crop.width;
        frame.h = crop.height;
        frame.offsetX = left - image.naturalWidth / 2;
        frame.srcW = image.naturalWidth;
        frame.srcH = image.naturalHeight;
        frame.ready = true;
        if (key === "mylo" && direction === "down" && index === 1) {
          hubMapSpriteScale = (2.6 * hubMapState.tileSize) / frame.h;
        }
      }, { once: true });
      image.addEventListener("error", () => {
        frame.failed = true;
        console.warn("Hub Map sprite frame failed to load:", src);
      }, { once: true });
      return frame;
    });
  });
}

function hubMapLoadAssets() {
  if (hubMapAssetsLoaded) return;
  hubMapAssetsLoaded = true;
  hubMapBgImage = hubMapCreateImage("assets/hub/forge/bg_forge_room.png");
  hubMapPropsImage = hubMapCreateImage("assets/hub/forge/objects_forge.png");
  hubMapTilesetImage = hubMapCreateImage("assets/hub/forge/bg_forge_tileset.png");
  hubMapLoadFrames("mylo");
  hubMapLoadFrames("ashley");
  hubMapLoadFrames("auntie");
  hubMapLoadFrames("eli");
  hubMapPortraits.ashley = hubMapCreateImage("assets/hub/ui/portrait_ashley.png");
  hubMapPortraits.auntie = hubMapCreateImage("assets/hub/ui/portrait_auntie.png");
  hubMapPortraits.eli = hubMapCreateImage("assets/hub/ui/portrait_eli.png");
  hubMapPortraits.mylo = hubMapCreateImage("assets/hub/ui/portrait_mylo.png");
}

function hubMapInitTiles() {
  hubMapState.tiles = Array.from({ length: hubMapState.height }, () =>
    Array.from({ length: hubMapState.width }, () => hubMapTILE_FLOOR)
  );
  for (let y = 0; y < hubMapState.height; y += 1) {
    for (let x = 0; x < hubMapState.width; x += 1) {
      if (y === 0 || y === 15 || x === 0 || x === 23) hubMapState.tiles[y][x] = hubMapTILE_WALL;
      if (y === 1 && x > 0 && x < 23) hubMapState.tiles[y][x] = hubMapTILE_WALL;
      if ((x === 0 || x === 1 || x === 22 || x === 23) && y >= 0 && y < hubMapState.height) hubMapState.tiles[y][x] = hubMapTILE_WALL;
      if (y >= 9 && y <= 14 && x >= 2 && x <= 21) hubMapState.tiles[y][x] = hubMapTILE_HANGAR;
      if ((x === 8 || x === 13 || x === 18) && y >= 9 && y <= 14) hubMapState.tiles[y][x] = hubMapTILE_STRIPE;
      if (y === 9 && (x === 10 || x === 14 || x === 18)) hubMapState.tiles[y][x] = hubMapTILE_CONSOLE;
      if ((y === 6 || y === 7) && ((x >= 3 && x <= 7) || (x >= 16 && x <= 20))) hubMapState.tiles[y][x] = hubMapTILE_WALL;
    }
  }
  hubMapState.tiles[1][12] = hubMapTILE_DOOR;
}

function hubMapIsActive() {
  return document.querySelector("#hub-map-beta-view")?.classList.contains("active");
}

function hubMapTileCenterX(tileX) {
  return tileX * hubMapState.tileSize + hubMapState.tileSize / 2;
}

function hubMapTileCenterY(tileY) {
  return tileY * hubMapState.tileSize + hubMapState.tileSize / 2;
}

function hubMapDrawProp(ctx, propName, x, y, scale = 1) {
  const hubMapFrame = hubMapPropFrames[propName];
  if (!hubMapFrame || !hubMapPropsImage?.complete || !hubMapPropsImage.naturalWidth) return;
  const hubMapDrawW = hubMapFrame.w * scale;
  const hubMapDrawH = hubMapFrame.h * scale;
  ctx.drawImage(
    hubMapPropsImage,
    hubMapFrame.x,
    hubMapFrame.y,
    hubMapFrame.w,
    hubMapFrame.h,
    x - hubMapDrawW / 2,
    y - hubMapDrawH / 2,
    hubMapDrawW,
    hubMapDrawH
  );
}

function hubMapDrawSprite(ctx, spriteKey, tileX, tileY, direction = 0, col = 1, heightTiles = 2.6) {
  const sprite = hubMapSprites[spriteKey];
  const directionKey = direction === 0 ? "down" : direction === 3 ? "up" : "left";
  const frames = sprite?.frames?.[directionKey] || [];
  const frameIndex = sprite?.walk ? Math.max(0, Math.min(2, col)) : 0;
  const standingDown = sprite?.frames?.down?.[sprite?.walk ? 1 : 0];
  const frame = [
    frames[frameIndex],
    sprite?.walk ? frames[1] : null,
    ...frames,
    standingDown,
    ...(sprite?.frames?.down || [])
  ].find((candidate) => candidate?.ready && candidate.canvas);
  if (frame) {
    const scale = hubMapSpriteScale || (2.6 * hubMapState.tileSize) / 1150;
    const drawW = frame.w * scale;
    const drawH = frame.h * scale;
    const centerX = tileX * hubMapState.tileSize + hubMapState.tileSize / 2;
    const drawY = tileY * hubMapState.tileSize + hubMapState.tileSize - drawH;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (direction === 2) {
      ctx.translate(centerX, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(frame.canvas, frame.offsetX * scale, drawY, drawW, drawH);
    } else {
      ctx.drawImage(frame.canvas, centerX + frame.offsetX * scale, drawY, drawW, drawH);
    }
    ctx.restore();
    return;
  }
  const hubMapFallbackColors = {
    mylo: "#7c3aed",
    ashley: "#1d4ed8",
    auntie: "#b45309",
    eli: "#15803d"
  };
  ctx.fillStyle = hubMapFallbackColors[spriteKey] || "#ffc857";
  ctx.fillRect(tileX * hubMapState.tileSize, tileY * hubMapState.tileSize - 16, 32, 48);
}

function hubMapWrapText(text, maxChars) {
  const hubMapWords = String(text || "").split(/\s+/);
  const hubMapLines = [];
  let hubMapLine = "";
  hubMapWords.forEach((hubMapWord) => {
    const hubMapTest = hubMapLine ? `${hubMapLine} ${hubMapWord}` : hubMapWord;
    if (hubMapTest.length > maxChars && hubMapLine) {
      hubMapLines.push(hubMapLine);
      hubMapLine = hubMapWord;
    } else {
      hubMapLine = hubMapTest;
    }
  });
  if (hubMapLine) hubMapLines.push(hubMapLine);
  return hubMapLines;
}

function hubMapOpenDialogue(hubMapSpeakerName, hubMapDialogueId, hubMapPortraitKey) {
  hubMapDialogue.active = true;
  hubMapDialogue.speakerName = hubMapSpeakerName;
  hubMapDialogue.portraitKey = hubMapPortraitKey || "";
  hubMapDialogue.lines = hubMapDialogueDB[hubMapDialogueId] || ["..."];
  hubMapDialogue.page = 0;
  hubMapMovementLocked = true;
}

function hubMapAdvanceDialogue() {
  if (!hubMapDialogue.active) return;
  hubMapDialogue.page += 1;
  if (hubMapDialogue.page >= hubMapDialogue.lines.length) hubMapCloseDialogue();
}

function hubMapCloseDialogue() {
  hubMapDialogue.active = false;
  hubMapMovementLocked = false;
}

function hubMapDrawDialogue(ctx, canvasW, canvasH) {
  if (!hubMapDialogue.active) return;
  const hubMapBoxH = 110;
  const hubMapBoxY = canvasH - hubMapBoxH;
  const hubMapPortrait = hubMapPortraits[hubMapDialogue.portraitKey];
  const hubMapHasPortrait = Boolean(hubMapPortrait?.complete && hubMapPortrait.naturalWidth);
  ctx.save();
  ctx.fillStyle = "rgba(15, 10, 5, 0.92)";
  ctx.strokeStyle = "#c87820";
  ctx.lineWidth = 2;
  ctx.fillRect(0, hubMapBoxY, canvasW, hubMapBoxH);
  ctx.strokeRect(1, hubMapBoxY + 1, canvasW - 2, hubMapBoxH - 2);
  if (hubMapHasPortrait) {
    ctx.drawImage(hubMapPortrait, 12, hubMapBoxY + 15, 80, 80);
  }
  const hubMapTextX = 100;
  ctx.fillStyle = "#f0a500";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(hubMapDialogue.speakerName || "", hubMapTextX, hubMapBoxY + 22);
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px sans-serif";
  hubMapWrapText(hubMapDialogue.lines[hubMapDialogue.page] || "", 52).slice(0, 4).forEach((hubMapLine, hubMapIndex) => {
    ctx.fillText(hubMapLine, hubMapTextX, hubMapBoxY + 42 + hubMapIndex * 15);
  });
  ctx.globalAlpha = 0.65 + Math.sin(performance.now() / 300) * 0.35;
  ctx.fillStyle = "#c87820";
  ctx.font = "16px sans-serif";
  ctx.fillText("▶", canvasW - 24, canvasH - 16);
  ctx.restore();
}

function hubMapGetNPCAt(hubMapX, hubMapY) {
  return hubMapNPCs.find((hubMapNpc) => hubMapNpc.x === hubMapX && hubMapNpc.y === hubMapY) || null;
}

function hubMapGetInteractableAt(hubMapX, hubMapY) {
  const hubMapTileTarget = hubMapInteractTiles.find((hubMapTile) => hubMapTile.x === hubMapX && hubMapTile.y === hubMapY);
  if (hubMapTileTarget) return hubMapTileTarget;
  return hubMapGetNPCAt(hubMapX, hubMapY);
}

function hubMapFacingTile() {
  if (hubMapPlayer.direction === 0) return { x: hubMapState.playerX, y: hubMapState.playerY + 1 };
  if (hubMapPlayer.direction === 1) return { x: hubMapState.playerX - 1, y: hubMapState.playerY };
  if (hubMapPlayer.direction === 2) return { x: hubMapState.playerX + 1, y: hubMapState.playerY };
  return { x: hubMapState.playerX, y: hubMapState.playerY - 1 };
}

function hubMapTryInteract() {
  const hubMapFacing = hubMapFacingTile();
  const hubMapFacingTarget = hubMapGetInteractableAt(hubMapFacing.x, hubMapFacing.y);
  if (hubMapFacingTarget) {
    hubMapOnInteract(hubMapFacingTarget);
    return;
  }
  const hubMapCurrentTarget = hubMapGetInteractableAt(hubMapState.playerX, hubMapState.playerY);
  if (hubMapCurrentTarget) hubMapOnInteract(hubMapCurrentTarget);
}

function hubMapOnInteract(hubMapTarget) {
  if (hubMapTarget.type === "car_bay") {
    document.dispatchEvent(new CustomEvent("hubmap:carbay", { detail: { carId: hubMapTarget.carId } }));
    console.log("hubmap:carbay", { carId: hubMapTarget.carId });
    return;
  }
  if (hubMapTarget.type === "door") {
    document.dispatchEvent(new CustomEvent("hubmap:door", { detail: { id: hubMapTarget.id } }));
    hubMapClose();
    return;
  }
  if (hubMapTarget.id) hubMapOpenDialogue(hubMapTarget.name, `${hubMapTarget.id}_default`, hubMapTarget.portraitKey);
}

function hubMapDraw() {
  if (!el.hubMapBetaCanvas || !hubMapIsActive()) return;
  const canvas = el.hubMapBetaCanvas;
  const ctx = canvas.getContext("2d");
  const { tileSize, width, height } = hubMapState;
  const now = performance.now();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (hubMapBgImage?.complete && hubMapBgImage.naturalWidth) {
    ctx.drawImage(hubMapBgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#1a2540";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (hubMapState.tiles[y]?.[x] === 1) {
        ctx.fillStyle = "rgba(12, 16, 24, 0.32)";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
  hubMapInteractTiles.forEach((hubMapTile) => {
    const hubMapNear = Math.abs(hubMapTile.x - hubMapState.playerX) <= 2 && Math.abs(hubMapTile.y - hubMapState.playerY) <= 2;
    if (!hubMapNear) return;
    ctx.strokeStyle = `rgba(200, 120, 32, ${0.4 + Math.sin(now / 400) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(hubMapTile.x * tileSize + 2, hubMapTile.y * tileSize + 2, tileSize - 4, tileSize - 4);
  });
  hubMapDrawProp(ctx, "vat", hubMapTileCenterX(12), hubMapTileCenterY(4), 0.5);

  let drawX = hubMapState.playerX;
  let drawY = hubMapState.playerY;
  if (hubMapState.moveTween) {
    const progress = (typeof reduceMotionEnabled === "function" && reduceMotionEnabled())
      ? 1
      : Math.min(1, (performance.now() - hubMapState.moveTween.startTime) / 200);
    const eased = (typeof reduceMotionEnabled === "function" && reduceMotionEnabled()) ? 1 : 1 - Math.pow(1 - progress, 3);
    drawX = hubMapState.moveTween.fromX + (hubMapState.moveTween.toX - hubMapState.moveTween.fromX) * eased;
    drawY = hubMapState.moveTween.fromY + (hubMapState.moveTween.toY - hubMapState.moveTween.fromY) * eased;
    if (progress >= 1) {
      hubMapState.moveTween = null;
      hubMapPlayer.moving = false;
    }
  }
  if (!hubMapState.moveTween && !hubMapMovementLocked && now >= hubMapMoveCooldown) {
    if (hubMapHeldKeys.up) hubMapTryMove(0, -1);
    else if (hubMapHeldKeys.down) hubMapTryMove(0, 1);
    else if (hubMapHeldKeys.left) hubMapTryMove(-1, 0);
    else if (hubMapHeldKeys.right) hubMapTryMove(1, 0);
    if (hubMapHeldKeys.up || hubMapHeldKeys.down || hubMapHeldKeys.left || hubMapHeldKeys.right) hubMapMoveCooldown = now + 80;
  }
  hubMapNPCs.forEach((hubMapNpc) => {
    hubMapDrawSprite(ctx, hubMapNpc.spriteKey, hubMapNpc.x, hubMapNpc.y, hubMapNpc.direction, 1);
    if (hubMapShowLabels) {
      const hubMapLabelX = hubMapNpc.x * tileSize + tileSize / 2;
      const hubMapLabelY = hubMapNpc.y * tileSize - 4;
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillText(hubMapNpc.name, hubMapLabelX + 1, hubMapLabelY + 1);
      ctx.fillStyle = "rgba(255, 220, 120, 0.9)";
      ctx.fillText(hubMapNpc.name, hubMapLabelX, hubMapLabelY);
      ctx.textAlign = "start";
    }
  });
  if (hubMapPlayer.moving && now - hubMapAnimClock > hubMapAnimInterval) {
    hubMapAnimClock = now;
    hubMapPlayer.walkStep = (hubMapPlayer.walkStep + 1) % hubMapWalkCycle.length;
    hubMapPlayer.animCol = hubMapWalkCycle[hubMapPlayer.walkStep];
  }
  if (!hubMapPlayer.moving) {
    hubMapPlayer.animCol = 1;
    hubMapPlayer.walkStep = 0;
  }
  hubMapDrawSprite(ctx, "mylo", drawX, drawY, hubMapPlayer.direction, hubMapPlayer.animCol);
  hubMapDrawDialogue(ctx, canvas.width, canvas.height);
  if (el.hubMapBetaCoords) el.hubMapBetaCoords.textContent = `${hubMapState.playerX}, ${hubMapState.playerY}`;
  hubMapState.animFrame = requestAnimationFrame(hubMapDraw);
}

function hubMapOpen() {
  hubMapInitTiles();
  hubMapLoadAssets();
  hubMapState.playerX = 12;
  hubMapState.playerY = 6;
  hubMapState.playerDirection = 0;
  hubMapPlayer.direction = 0;
  hubMapPlayer.moving = false;
  hubMapPlayer.animCol = 1;
  hubMapPlayer.walkStep = 0;
  Object.keys(hubMapHeldKeys).forEach((hubMapKey) => {
    hubMapHeldKeys[hubMapKey] = false;
  });
  hubMapMoveCooldown = 0;
  hubMapMovementLocked = false;
  hubMapCloseDialogue();
  hubMapState.moveTween = null;
  hubMapState.dialogue = null;
  if (hubMapState.animFrame) cancelAnimationFrame(hubMapState.animFrame);
  showView("hub-map-beta");
  hubMapDraw();
}

function hubMapClose() {
  if (hubMapState.animFrame) cancelAnimationFrame(hubMapState.animFrame);
  hubMapState.animFrame = 0;
  betaRaceContext = { source: "prototype" };
  showView("beta");
  openBetaPrototypeIntro();
}

function hubMapTryMove(dx, dy) {
  if (hubMapMovementLocked || !hubMapIsActive() || hubMapState.moveTween) return;
  if (dy > 0) hubMapPlayer.direction = 0;
  else if (dx < 0) hubMapPlayer.direction = 1;
  else if (dx > 0) hubMapPlayer.direction = 2;
  else if (dy < 0) hubMapPlayer.direction = 3;
  hubMapState.playerDirection = hubMapPlayer.direction;
  const nextX = hubMapState.playerX + dx;
  const nextY = hubMapState.playerY + dy;
  if (nextX < 0 || nextY < 0 || nextX >= hubMapState.width || nextY >= hubMapState.height) return;
  const hubMapTileType = hubMapState.tiles[nextY]?.[nextX];
  if (!hubMapTileWalkable[hubMapTileType]) return;
  hubMapPlayer.moving = true;
  hubMapState.moveTween = {
    fromX: hubMapState.playerX,
    fromY: hubMapState.playerY,
    toX: nextX,
    toY: nextY,
    startTime: performance.now()
  };
  hubMapState.playerX = nextX;
  hubMapState.playerY = nextY;
  // TODO: optional auto-repeat / hold-to-walk.
}

el.hubMapBetaStart?.addEventListener("click", hubMapOpen);
el.hubMapBetaBack?.addEventListener("click", hubMapClose);

document.addEventListener("keydown", (event) => {
  if (!hubMapIsActive()) return;
  const key = normalizeKey(event);
  if (key === "E" || key === "Enter") {
    if (event.repeat) return;
    event.preventDefault();
    if (hubMapMovementLocked && hubMapDialogue.active) hubMapAdvanceDialogue();
    else if (!hubMapMovementLocked) hubMapTryInteract();
    return;
  }
  const moves = {
    W: "up",
    ArrowUp: "up",
    S: "down",
    ArrowDown: "down",
    A: "left",
    ArrowLeft: "left",
    D: "right",
    ArrowRight: "right"
  };
  if (!moves[key]) return;
  event.preventDefault();
  hubMapHeldKeys[moves[key]] = true;
});

document.addEventListener("keyup", (event) => {
  if (!hubMapIsActive()) return;
  const key = normalizeKey(event);
  const moves = {
    W: "up",
    ArrowUp: "up",
    S: "down",
    ArrowDown: "down",
    A: "left",
    ArrowLeft: "left",
    D: "right",
    ArrowRight: "right"
  };
  if (!moves[key]) return;
  event.preventDefault();
  hubMapHeldKeys[moves[key]] = false;
});

// TODO: NPCs, sprites, map transitions, interactions, and dialogue hooks.
