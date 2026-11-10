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
    title: "Vs. Race",
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
const hubMapPlayer = { spriteKey: "mylo", direction: 0, moving: false, animCol: 1 };
let hubMapShowLabels = false;
let hubMapMovementLocked = false;
const hubMapHeldKeys = {};
let hubMapMoveCooldown = 0;
let hubMapAssetsLoaded = false;
let hubMapBgImage = null;
let hubMapPropsImage = null;
let hubMapTilesetImage = null;
const hubMapSprites = {};
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

function hubMapLoadSprite(key, src, sheetCols, rows, usableCols = sheetCols) {
  const hubMapImage = hubMapCreateImage(src);
  const hubMapSprite = {
    img: hubMapImage,
    image: hubMapImage,
    src,
    frameW: 0,
    frameH: 0,
    cols: sheetCols,
    usableCols,
    rows,
    sheetCols
  };
  hubMapImage.addEventListener("load", () => {
    hubMapSprite.frameW = Math.floor(hubMapImage.naturalWidth / hubMapSprite.cols);
    hubMapSprite.frameH = Math.floor(hubMapImage.naturalHeight / hubMapSprite.rows);
    const hubMapCanvas = document.createElement("canvas");
    hubMapCanvas.width = hubMapImage.naturalWidth;
    hubMapCanvas.height = hubMapImage.naturalHeight;
    const hubMapCtx = hubMapCanvas.getContext("2d");
    hubMapCtx.drawImage(hubMapImage, 0, 0);
    const hubMapPixels = hubMapCtx.getImageData(0, 0, hubMapCanvas.width, hubMapCanvas.height);
    for (let hubMapIndex = 0; hubMapIndex < hubMapPixels.data.length; hubMapIndex += 4) {
      const hubMapR = hubMapPixels.data[hubMapIndex];
      const hubMapG = hubMapPixels.data[hubMapIndex + 1];
      const hubMapB = hubMapPixels.data[hubMapIndex + 2];
      if (hubMapR < 24 && hubMapG < 24 && hubMapB < 24) hubMapPixels.data[hubMapIndex + 3] = 0;
    }
    hubMapCtx.putImageData(hubMapPixels, 0, 0);
    hubMapSprite.canvas = hubMapCanvas;
  }, { once: true });
  hubMapSprites[key] = hubMapSprite;
}

function hubMapLoadAssets() {
  if (hubMapAssetsLoaded) return;
  hubMapAssetsLoaded = true;
  hubMapBgImage = hubMapCreateImage("assets/hub/forge/bg_forge_room.png");
  hubMapPropsImage = hubMapCreateImage("assets/hub/forge/objects_forge.png");
  hubMapTilesetImage = hubMapCreateImage("assets/hub/forge/bg_forge_tileset.png");
  hubMapLoadSprite("mylo", "assets/hub/sprites/player_mylo.png", 4, 4, 3);
  hubMapLoadSprite("ashley", "assets/hub/sprites/npc_ashley.png", 3, 4);
  hubMapLoadSprite("auntie", "assets/hub/sprites/npc_auntie.png", 3, 4);
  hubMapLoadSprite("eli", "assets/hub/sprites/npc_eli.png", 3, 4);
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
  const hubMapSheet = hubMapSprites[spriteKey];
  const hubMapImage = hubMapSheet?.img || hubMapSheet?.image;
  if (!hubMapSheet || !hubMapImage?.complete || !hubMapImage.naturalWidth) {
    const hubMapFallbackColors = {
      mylo: "#7c3aed",
      ashley: "#1d4ed8",
      auntie: "#b45309",
      eli: "#15803d"
    };
    ctx.fillStyle = hubMapFallbackColors[spriteKey] || "#ffc857";
    ctx.fillRect(tileX * hubMapState.tileSize, tileY * hubMapState.tileSize - 16, 32, 48);
    return;
  }
  const hubMapFrameW = hubMapSheet.frameW || Math.floor(hubMapImage.naturalWidth / hubMapSheet.cols);
  const hubMapFrameH = hubMapSheet.frameH || Math.floor(hubMapImage.naturalHeight / hubMapSheet.rows);
  const hubMapUsableCols = hubMapSheet.usableCols || hubMapSheet.cols;
  const hubMapCol = Math.max(0, Math.min(hubMapUsableCols - 1, col));
  const hubMapRow = Math.max(0, Math.min(hubMapSheet.rows - 1, direction));
  const hubMapSourceX = hubMapCol * hubMapFrameW;
  const hubMapSourceY = hubMapRow * hubMapFrameH;
  const hubMapDestH = hubMapState.tileSize * heightTiles;
  const hubMapDestW = hubMapDestH * (hubMapFrameW / hubMapFrameH);
  const hubMapDestX = tileX * hubMapState.tileSize + hubMapState.tileSize / 2 - hubMapDestW / 2;
  const hubMapDestY = tileY * hubMapState.tileSize + hubMapState.tileSize - hubMapDestH;
  const hubMapDrawSource = hubMapSheet.canvas || hubMapImage;
  ctx.drawImage(
    hubMapDrawSource,
    hubMapSourceX,
    hubMapSourceY,
    hubMapFrameW,
    hubMapFrameH,
    hubMapDestX,
    hubMapDestY,
    hubMapDestW,
    hubMapDestH
  );
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
    hubMapPlayer.animCol = (hubMapPlayer.animCol + 1) % 3;
  }
  if (!hubMapPlayer.moving) hubMapPlayer.animCol = 1;
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

// ─── GEARBORN STUDIO BETA FOUNDATION ─────────────────────────────────────────

const studioState = {
  active: false,
  stream: null,
  rafId: 0,
  stage: "live",
  frame: null,
  stickers: [],
  selectedId: null,
  nextId: 1,
  cameraError: "",
  detectorMessage: "",
  detectionBox: null,
  liveTrack: false,
  dragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0
};
let studioDetector = null;
let studioDetectorState = "idle";
let studioLiveTrackTimer = 0;
let studioLiveTrackBusy = false;
const STUDIO_VEHICLE_LABELS = ["car", "truck", "bus", "motorcycle"];
const STUDIO_DETECT_INTERVAL_MS = 550;
const STUDIO_CANVAS_MAX = 1920;
const STUDIO_TOPDOWN_PROBE_CACHE = new Map();
const studioPointers = new Map();
let studioGestureStart = null;

function studioIsActive() {
  return document.querySelector("#gearborn-studio-beta-view")?.classList.contains("active");
}

async function studioLoadDetector(onProgress) {
  if (studioDetector) return studioDetector;
  if (studioDetectorState === "failed") return null;
  studioDetectorState = "loading";
  studioState.detectorMessage = "Loading auto-place assist...";
  studioRenderControls();
  try {
    const TF = await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3");
    const MODEL = "Xenova/yolos-tiny";
    let detector;
    try {
      detector = await TF.pipeline("object-detection", MODEL, {
        device: "webgpu",
        dtype: "q8",
        progress_callback: onProgress
      });
    } catch (gpuErr) {
      console.warn("Studio: WebGPU off, WASM fallback.", gpuErr);
      detector = await TF.pipeline("object-detection", MODEL, {
        dtype: "q8",
        progress_callback: onProgress
      });
    }
    studioDetector = detector;
    studioDetectorState = "ready";
    studioState.detectorMessage = "Auto-place ready.";
    studioRenderControls();
    return detector;
  } catch (err) {
    console.warn("Studio: detector load failed — manual only.", err);
    studioDetectorState = "failed";
    studioState.detectorMessage = "Auto-place unavailable. Manual tools still work.";
    studioRenderControls();
    return null;
  }
}

async function studioDetectVehicles(input) {
  const detector = studioDetector;
  if (!detector) return [];
  try {
    const output = await detector(input, { threshold: 0.5, percentage: true });
    return output
      .filter((item) => STUDIO_VEHICLE_LABELS.includes(item.label))
      .map((item) => ({
        ...item,
        area: (item.box.xmax - item.box.xmin) * (item.box.ymax - item.box.ymin)
      }))
      .sort((a, b) => (b.area * b.score) - (a.area * a.score));
  } catch (err) {
    console.warn("Studio: detect failed.", err);
    return [];
  }
}

function studioFormFor(carId, formIndex = 0) {
  const car = cars.find((item) => item.id === carId) || cars[0];
  const form = car?.evolutions?.[formIndex] || car?.evolutions?.[0];
  return { car, form };
}

function studioImageSrc(carId, formIndex = 0, role = "race") {
  const { form } = studioFormFor(carId, formIndex);
  if (!form) return "";
  return imageFor(form, role) || imageFor(form, "race") || imageFor(form, "display");
}

function studioProbeImage(src) {
  if (!src) return Promise.resolve(false);
  if (STUDIO_TOPDOWN_PROBE_CACHE.has(src)) return Promise.resolve(STUDIO_TOPDOWN_PROBE_CACHE.get(src));
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      STUDIO_TOPDOWN_PROBE_CACHE.set(src, true);
      resolve(true);
    };
    img.onerror = () => {
      STUDIO_TOPDOWN_PROBE_CACHE.set(src, false);
      resolve(false);
    };
    img.src = src;
  });
}

async function studioTopdownAvailable(carId, formIndex = 0) {
  const src = studioImageSrc(carId, formIndex, "topdown");
  return studioProbeImage(src);
}

function studioCarOptions() {
  return cars.map((car) => ({
    carId: car.id,
    formIndex: 0,
    family: car.family || car.id,
    name: car.family || car.id,
    src: imageFor(car.evolutions?.[0], "race") || imageFor(car.evolutions?.[0], "display")
  }));
}

function studioSelectedSticker() {
  return studioState.stickers.find((sticker) => sticker.id === studioState.selectedId) || null;
}

function studioMaxZ() {
  return studioState.stickers.reduce((max, sticker) => Math.max(max, Number(sticker.z) || 0), 0);
}

function studioCanvasPoint(event) {
  const canvas = el.gearbornStudioBetaCanvas;
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * canvas.width,
    y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * canvas.height
  };
}

function studioEnsureCanvasSize(width, height) {
  const canvas = el.gearbornStudioBetaCanvas;
  if (!canvas) return;
  let nextWidth = Math.max(1, Math.floor(width || 1280));
  let nextHeight = Math.max(1, Math.floor(height || 720));
  const longEdge = Math.max(nextWidth, nextHeight);
  if (longEdge > STUDIO_CANVAS_MAX) {
    const ratio = STUDIO_CANVAS_MAX / longEdge;
    nextWidth = Math.max(1, Math.floor(nextWidth * ratio));
    nextHeight = Math.max(1, Math.floor(nextHeight * ratio));
  }
  const oldWidth = canvas.width || nextWidth;
  const oldHeight = canvas.height || nextHeight;
  const resized = canvas.width !== nextWidth || canvas.height !== nextHeight;
  if (canvas.width !== nextWidth) canvas.width = nextWidth;
  if (canvas.height !== nextHeight) canvas.height = nextHeight;
  if (resized && oldWidth && oldHeight && studioState.stickers.length) {
    const scaleX = nextWidth / oldWidth;
    const scaleY = nextHeight / oldHeight;
    const scaleAvg = (scaleX + scaleY) / 2;
    studioState.stickers.forEach((sticker) => {
      sticker.x *= scaleX;
      sticker.y *= scaleY;
      sticker.scale *= scaleAvg;
    });
  }
}

function studioStickerBounds(sticker) {
  const img = sticker?.img;
  const width = (img?.naturalWidth || 1) * (sticker?.scale || 1);
  const height = (img?.naturalHeight || 1) * (sticker?.scale || 1);
  return { width, height };
}

function studioDrawSticker(ctx, sticker, selected = false) {
  const img = sticker.img;
  if (!img || !img.complete || !img.naturalWidth) return;
  const { width, height } = studioStickerBounds(sticker);
  ctx.save();
  if (sticker.shadow !== false) {
    ctx.translate(sticker.x, sticker.y);
    ctx.rotate(sticker.rotation || 0);
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(0, height * 0.34, width * 0.45, Math.max(8, height * 0.09), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
  }
  ctx.translate(sticker.x, sticker.y);
  ctx.rotate(sticker.rotation || 0);
  ctx.scale(sticker.flip ? -1 : 1, 1);
  ctx.globalAlpha = Math.max(0.1, Math.min(1, Number(sticker.opacity) || 1));
  ctx.drawImage(img, -width / 2, -height / 2, width, height);
  ctx.globalAlpha = 1;
  if (selected) {
    ctx.strokeStyle = "rgba(255, 200, 87, 0.92)";
    ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.025);
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(-width / 2, -height / 2, width, height);
  }
  ctx.restore();
}

function studioDraw(background = null) {
  const canvas = el.gearbornStudioBetaCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (background === "video") {
    const video = el.gearbornStudioBetaVideo;
    const width = video?.videoWidth || canvas.width || 1280;
    const height = video?.videoHeight || canvas.height || 720;
    studioEnsureCanvasSize(width, height);
    if (video?.videoWidth) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    else {
      ctx.fillStyle = "#101826";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (studioState.frame) {
    studioEnsureCanvasSize(studioState.frame.naturalWidth || studioState.frame.width, studioState.frame.naturalHeight || studioState.frame.height);
    ctx.drawImage(studioState.frame, 0, 0, canvas.width, canvas.height);
  } else {
    studioEnsureCanvasSize(canvas.width || 1280, canvas.height || 720);
    ctx.fillStyle = "#101826";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (studioState.detectionBox) {
    const box = studioState.detectionBox.box || studioState.detectionBox;
    ctx.save();
    ctx.strokeStyle = "rgba(82, 199, 255, 0.72)";
    ctx.lineWidth = Math.max(3, Math.min(canvas.width, canvas.height) * 0.004);
    ctx.setLineDash([16, 10]);
    ctx.strokeRect(
      box.xmin * canvas.width,
      box.ymin * canvas.height,
      (box.xmax - box.xmin) * canvas.width,
      (box.ymax - box.ymin) * canvas.height
    );
    ctx.restore();
  }
  studioState.stickers
    .slice()
    .sort((a, b) => (a.z || 0) - (b.z || 0))
    .forEach((sticker) => studioDrawSticker(ctx, sticker, sticker.id === studioState.selectedId));
}

function studioLoop() {
  if (!studioState.active || !studioIsActive()) return;
  if (studioState.stage === "live") studioDraw("video");
  studioState.rafId = requestAnimationFrame(studioLoop);
}

function studioHitTest(point) {
  const ordered = studioState.stickers.slice().sort((a, b) => (b.z || 0) - (a.z || 0));
  return ordered.find((sticker) => {
    const { width, height } = studioStickerBounds(sticker);
    const dx = point.x - sticker.x;
    const dy = point.y - sticker.y;
    const angle = -(sticker.rotation || 0);
    const localX = (dx * Math.cos(angle) - dy * Math.sin(angle)) * (sticker.flip ? -1 : 1);
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
    return Math.abs(localX) <= width / 2 && Math.abs(localY) <= height / 2;
  }) || null;
}

function studioLoadStickerImage(sticker, role = sticker.role || "race") {
  const requestedRole = role === "topdown" ? "topdown" : (role === "display" ? "display" : "race");
  const src = studioImageSrc(sticker.carId, sticker.formIndex, requestedRole);
  const fallbackSrc = requestedRole === "race" ? src : studioImageSrc(sticker.carId, sticker.formIndex, "race");
  const img = new Image();
  img.onload = () => {
    sticker.img = img;
    sticker.role = requestedRole;
    studioRenderControls();
    studioDraw(studioState.stage === "live" ? "video" : null);
  };
  img.onerror = () => {
    if (requestedRole !== "race" && fallbackSrc && fallbackSrc !== src) {
      studioLoadStickerImage(sticker, "race");
      return;
    }
    studioRenderControls();
  };
  img.src = src || fallbackSrc;
}

async function studioSetStickerRole(sticker, role) {
  if (!sticker) return;
  if (role === "topdown" && !(await studioTopdownAvailable(sticker.carId, sticker.formIndex))) {
    if (typeof showToast === "function") showToast("Studio", "Topdown art is not available for that form yet.");
    role = "race";
  }
  studioLoadStickerImage(sticker, role);
}

function studioCreateSticker(carId, formIndex = 0) {
  const car = cars.find((item) => item.id === carId) || cars[0];
  const form = car?.evolutions?.[formIndex] || car?.evolutions?.[0];
  const img = new Image();
  const canvas = el.gearbornStudioBetaCanvas;
  const sticker = {
    id: studioState.nextId++,
    carId: car?.id || carId,
    formIndex,
    img,
    role: "race",
    x: (canvas?.width || 1280) / 2,
    y: (canvas?.height || 720) / 2,
    scale: 1,
    rotation: 0,
    flip: false,
    shadow: true,
    opacity: 1,
    z: studioMaxZ() + 1
  };
  img.onload = () => {
    const targetWidth = (el.gearbornStudioBetaCanvas?.width || 1280) * 0.34;
    sticker.scale = Math.max(0.05, Math.min(3, targetWidth / Math.max(1, img.naturalWidth)));
    studioDraw(studioState.stage === "live" ? "video" : null);
    studioRenderControls();
  };
  img.onerror = () => studioRenderControls();
  img.src = form ? imageFor(form, "race") || imageFor(form, "display") : "";
  if (studioState.stage === "live") studioState.stickers = [sticker];
  else studioState.stickers.push(sticker);
  studioState.selectedId = sticker.id;
  studioClosePicker();
  studioRenderControls();
  studioRenderLayers();
  studioDraw(studioState.stage === "live" ? "video" : null);
}

function studioDuplicateSelected() {
  const selected = studioSelectedSticker();
  if (!selected) return;
  const clone = {
    ...selected,
    id: studioState.nextId++,
    x: selected.x + 32,
    y: selected.y + 32,
    z: studioMaxZ() + 1
  };
  studioState.stickers.push(clone);
  studioState.selectedId = clone.id;
  studioRenderControls();
  studioRenderLayers();
  studioDraw();
}

function studioDeleteSelected() {
  const selected = studioSelectedSticker();
  if (!selected) return;
  studioState.stickers = studioState.stickers.filter((sticker) => sticker.id !== selected.id);
  studioState.selectedId = studioState.stickers[studioState.stickers.length - 1]?.id || null;
  studioRenderControls();
  studioRenderLayers();
  studioDraw();
}

function studioAdjustZ(direction) {
  const selected = studioSelectedSticker();
  if (!selected) return;
  selected.z += direction > 0 ? 1.5 : -1.5;
  studioState.stickers
    .slice()
    .sort((a, b) => (a.z || 0) - (b.z || 0))
    .forEach((sticker, index) => {
      sticker.z = index + 1;
    });
  if (direction > 0) selected.z = studioMaxZ() + 1;
  else selected.z = 0;
  studioRenderControls();
  studioRenderLayers();
  studioDraw();
}

function studioFrameFromCanvas(canvas) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = canvas.toDataURL("image/png");
  });
}

function studioBackgroundCanvas(maxWidth = 640) {
  const sourceCanvas = document.createElement("canvas");
  const sourceCtx = sourceCanvas.getContext("2d");
  const video = el.gearbornStudioBetaVideo;
  const frame = studioState.frame;
  const nativeWidth = studioState.stage === "live" ? (video?.videoWidth || 0) : (frame?.naturalWidth || frame?.width || 0);
  const nativeHeight = studioState.stage === "live" ? (video?.videoHeight || 0) : (frame?.naturalHeight || frame?.height || 0);
  if (!sourceCtx || !nativeWidth || !nativeHeight) return null;
  const ratio = Math.min(1, maxWidth / nativeWidth);
  sourceCanvas.width = Math.max(1, Math.floor(nativeWidth * ratio));
  sourceCanvas.height = Math.max(1, Math.floor(nativeHeight * ratio));
  const source = studioState.stage === "live" ? video : frame;
  sourceCtx.drawImage(source, 0, 0, sourceCanvas.width, sourceCanvas.height);
  return sourceCanvas;
}

function studioApplyVehicleBox(result) {
  const selected = studioSelectedSticker();
  if (!selected || !result?.box) return false;
  const canvas = el.gearbornStudioBetaCanvas;
  const img = selected.img;
  if (!canvas || !img?.naturalWidth) return false;
  const box = result.box;
  const boxWidth = Math.max(1, (box.xmax - box.xmin) * canvas.width);
  const boxHeight = Math.max(1, (box.ymax - box.ymin) * canvas.height);
  selected.x = ((box.xmin + box.xmax) / 2) * canvas.width;
  selected.y = ((box.ymin + box.ymax) / 2) * canvas.height;
  selected.scale = Math.max(0.05, Math.min(4, boxWidth / Math.max(1, img.naturalWidth)));
  if ((img.naturalHeight * selected.scale) > boxHeight * 1.8) {
    selected.scale = Math.max(0.05, Math.min(selected.scale, (boxHeight * 1.45) / Math.max(1, img.naturalHeight)));
  }
  studioState.detectionBox = result;
  studioRenderControls();
  studioDraw(studioState.stage === "live" ? "video" : null);
  return true;
}

async function studioAutoPlaceSelected({ silent = false } = {}) {
  if (!studioSelectedSticker()) {
    if (!silent && typeof showToast === "function") showToast("Studio", "Pick a GearBorn first.");
    return false;
  }
  const detector = await studioLoadDetector((progress) => {
    if (progress?.status) {
      studioState.detectorMessage = `Auto-place: ${progress.status}`;
      studioRenderControls();
    }
  });
  if (!detector) return false;
  const canvas = studioBackgroundCanvas(640);
  if (!canvas) {
    if (!silent && typeof showToast === "function") showToast("Studio", "No frame available yet.");
    return false;
  }
  const results = await studioDetectVehicles(canvas);
  if (!results.length) {
    studioState.detectionBox = null;
    studioDraw(studioState.stage === "live" ? "video" : null);
    if (!silent && typeof showToast === "function") showToast("Studio", "No vehicle spotted — place it yourself.");
    return false;
  }
  studioApplyVehicleBox(results[0]);
  return true;
}

function studioScheduleLiveTrack() {
  window.clearTimeout(studioLiveTrackTimer);
  if (!studioState.active || !studioState.liveTrack || studioState.stage !== "live") return;
  studioLiveTrackTimer = window.setTimeout(async () => {
    if (!studioState.active || !studioState.liveTrack || studioState.stage !== "live") return;
    if (!studioLiveTrackBusy) {
      studioLiveTrackBusy = true;
      await studioAutoPlaceSelected({ silent: true });
      studioLiveTrackBusy = false;
    }
    studioScheduleLiveTrack();
  }, STUDIO_DETECT_INTERVAL_MS);
}

async function studioCaptureFrame() {
  const canvas = el.gearbornStudioBetaCanvas;
  const video = el.gearbornStudioBetaVideo;
  if (!canvas || !video?.videoWidth) return;
  const captureCanvas = document.createElement("canvas");
  captureCanvas.width = video.videoWidth;
  captureCanvas.height = video.videoHeight;
  captureCanvas.getContext("2d")?.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
  studioState.frame = await studioFrameFromCanvas(captureCanvas);
  studioState.stage = "edit";
  studioState.liveTrack = false;
  studioState.detectionBox = null;
  window.clearTimeout(studioLiveTrackTimer);
  stopGearbornStudioCamera();
  studioRenderControls();
  studioRenderLayers();
  studioDraw();
}

function studioLoadFrameFile(file) {
  if (!file) return;
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    studioState.frame = image;
    studioState.stage = "edit";
    studioState.liveTrack = false;
    studioState.detectionBox = null;
    window.clearTimeout(studioLiveTrackTimer);
    stopGearbornStudioCamera();
    studioRenderControls();
    studioRenderLayers();
    studioDraw();
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    studioState.cameraError = "That photo could not be loaded.";
    studioRenderControls();
  };
  image.src = objectUrl;
}

function studioNewCapture() {
  studioState.stage = "live";
  studioState.frame = null;
  studioState.stickers = [];
  studioState.selectedId = null;
  studioState.detectionBox = null;
  studioState.liveTrack = false;
  studioPointers.clear();
  studioGestureStart = null;
  studioRenderControls();
  studioRenderLayers();
  studioStartCamera();
  studioLoop();
}

function studioOpenPicker() {
  studioRenderPicker();
  el.gearbornStudioBetaPickerModal?.removeAttribute("hidden");
}

function studioClosePicker() {
  el.gearbornStudioBetaPickerModal?.setAttribute("hidden", "");
  if (el.gearbornStudioBetaPicker) el.gearbornStudioBetaPicker.innerHTML = "";
}

function studioRenderPicker() {
  if (!el.gearbornStudioBetaPicker) return;
  el.gearbornStudioBetaPicker.innerHTML = `
    <div class="studio-beta-picker">
      ${studioCarOptions().map((option) => `
        <button class="studio-beta-thumb ${studioSelectedSticker()?.carId === option.carId && studioSelectedSticker()?.formIndex === option.formIndex ? "active" : ""}" type="button" data-studio-car="${escapeHtml(option.carId)}" data-studio-form="${option.formIndex}">
          <img src="${option.src}" alt="${escapeHtml(option.name)}" loading="lazy" decoding="async">
          <span>${escapeHtml(option.name)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function studioRenderLayers() {
  const host = el.gearbornStudioBetaLayers;
  if (!host) return;
  if (studioState.stage !== "edit" || !studioState.stickers.length) {
    host.innerHTML = "";
    return;
  }
  host.innerHTML = `
    <div class="studio-beta-layers">
      ${studioState.stickers
        .slice()
        .sort((a, b) => (b.z || 0) - (a.z || 0))
        .map((sticker) => {
          const { car, form } = studioFormFor(sticker.carId, sticker.formIndex);
          return `<button type="button" class="studio-beta-layer ${sticker.id === studioState.selectedId ? "active" : ""}" data-studio-layer="${sticker.id}">${escapeHtml(form?.name || car?.family || sticker.carId)}</button>`;
        }).join("")}
    </div>
  `;
}

function studioUpdateStageChrome() {
  const showCapture = studioState.stage === "live" && Boolean(studioState.stream);
  el.gearbornStudioBetaCaptureFab?.toggleAttribute("hidden", !showCapture);
}

function studioRenderControls() {
  if (!el.gearbornStudioBetaControls) return;
  const selected = studioSelectedSticker();
  if (selected) {
    const topdownSrc = studioImageSrc(selected.carId, selected.formIndex, "topdown");
    if (topdownSrc && !STUDIO_TOPDOWN_PROBE_CACHE.has(topdownSrc)) {
      STUDIO_TOPDOWN_PROBE_CACHE.set(topdownSrc, null);
      studioProbeImage(topdownSrc).then(() => {
        if (studioIsActive() && studioSelectedSticker()?.id === selected.id) studioRenderControls();
      });
    }
  }
  const topdownSrc = selected ? studioImageSrc(selected.carId, selected.formIndex, "topdown") : "";
  const topdownAvailable = topdownSrc && STUDIO_TOPDOWN_PROBE_CACHE.get(topdownSrc) === true;
  const formOptions = selected ? (studioFormFor(selected.carId, selected.formIndex).car?.evolutions || []) : [];
  const selectedControls = selected ? `
    <label class="studio-beta-control">Form
      <select data-studio-transform="formIndex">
        ${formOptions.map((form, index) => `<option value="${index}" ${selected.formIndex === index ? "selected" : ""}>${escapeHtml(form.name || `Form ${index + 1}`)}</option>`).join("")}
      </select>
    </label>
    <label class="studio-beta-control">Angle
      <select data-studio-transform="role">
        <option value="race" ${selected.role === "race" ? "selected" : ""}>Side</option>
        <option value="display" ${selected.role === "display" ? "selected" : ""}>Front 3/4</option>
        <option value="topdown" ${selected.role === "topdown" ? "selected" : ""} ${topdownAvailable ? "" : "disabled"}>Topdown</option>
      </select>
    </label>
    <label class="studio-beta-control">Size
      <input type="range" min="5" max="300" step="1" value="${Math.round((selected.scale || 1) * 100)}" data-studio-transform="scale">
    </label>
    <label class="studio-beta-control">Rotate
      <input type="range" min="-180" max="180" step="1" value="${Math.round(((selected.rotation || 0) * 180) / Math.PI)}" data-studio-transform="rotation">
    </label>
    <label class="studio-beta-control">Opacity
      <input type="range" min="10" max="100" step="1" value="${Math.round((selected.opacity ?? 1) * 100)}" data-studio-transform="opacity">
    </label>
    <label class="studio-beta-check">
      <input type="checkbox" data-studio-transform="shadow" ${selected.shadow !== false ? "checked" : ""}>
      Shadow
    </label>
    <button class="ghost" type="button" data-studio-action="flip">${selected.flip ? "Unflip" : "Flip"}</button>
  ` : `<span class="studio-beta-help">Pick a GearBorn to place a sticker.</span>`;
  const editControls = studioState.stage === "edit" ? `
    <button class="ghost" type="button" data-studio-action="duplicate" ${selected ? "" : "disabled"}>Duplicate</button>
    <button class="ghost" type="button" data-studio-action="forward" ${selected ? "" : "disabled"}>Bring Forward</button>
    <button class="ghost" type="button" data-studio-action="backward" ${selected ? "" : "disabled"}>Send Back</button>
    <button class="danger-button" type="button" data-studio-action="delete" ${selected ? "" : "disabled"}>Delete</button>
    <button class="primary" type="button" data-studio-action="download">Download PNG</button>
    <button class="ghost" type="button" data-studio-action="share">Share</button>
    <button class="ghost" type="button" data-studio-action="new">Retake / New</button>
  ` : `
    <button class="ghost" type="button" data-studio-action="auto-place" ${selected && studioDetectorState !== "failed" ? "" : "disabled"}>Auto-place</button>
    <label class="studio-beta-check">
      <input type="checkbox" data-studio-transform="liveTrack" ${studioState.liveTrack ? "checked" : ""} ${selected && studioDetectorState !== "failed" ? "" : "disabled"}>
      Live Track
    </label>
    <label class="ghost studio-beta-file">Use Photo
      <input type="file" accept="image/*" capture="environment" data-studio-file>
    </label>
  `;
  el.gearbornStudioBetaControls.innerHTML = `
    <div class="studio-beta-controls">
      <strong>${studioState.stage === "live" ? "Live filter view" : "Edit composite"}</strong>
      ${studioState.cameraError ? `<p>${escapeHtml(studioState.cameraError)}</p>` : ""}
      ${studioState.detectorMessage ? `<p>${escapeHtml(studioState.detectorMessage)}${studioState.liveTrack ? " Live tracking uses extra battery." : ""}</p>` : ""}
      ${selectedControls}
      ${editControls}
    </div>
  `;
  studioUpdateStageChrome();
  studioRenderLayers();
}

function studioRenderExportCanvas() {
  const previewCanvas = el.gearbornStudioBetaCanvas;
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = previewCanvas?.width || 1280;
  exportCanvas.height = previewCanvas?.height || 720;
  const ctx = exportCanvas.getContext("2d");
  if (!ctx) return exportCanvas;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const frame = studioState.frame;
  if (frame) ctx.drawImage(frame, 0, 0, exportCanvas.width, exportCanvas.height);
  studioState.stickers
    .slice()
    .sort((a, b) => (a.z || 0) - (b.z || 0))
    .forEach((sticker) => studioDrawSticker(ctx, sticker, false));
  return exportCanvas;
}

function studioExportBlob() {
  return new Promise((resolve) => {
    studioRenderExportCanvas().toBlob((blob) => resolve(blob), "image/png");
  });
}

async function studioDownload() {
  const blob = await studioExportBlob();
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gearborn-studio.png";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

async function studioShare() {
  const blob = await studioExportBlob();
  if (!blob) return studioDownload();
  if (typeof File === "undefined") return studioDownload();
  const file = new File([blob], "gearborn-studio.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] }) && navigator.share) {
    try {
      await navigator.share({ files: [file], title: "GearBorn Studio" });
      return;
    } catch (err) {
      console.warn("GearBorn Studio share failed:", err);
    }
  }
  studioDownload();
}

function stopGearbornStudioCamera() {
  if (studioState.stream) {
    studioState.stream.getTracks().forEach((track) => track.stop());
    studioState.stream = null;
  }
  if (el.gearbornStudioBetaVideo) {
    el.gearbornStudioBetaVideo.pause();
    el.gearbornStudioBetaVideo.srcObject = null;
  }
}

async function studioStartCamera() {
  studioState.cameraError = "";
  stopGearbornStudioCamera();
  studioEnsureCanvasSize(1280, 720);
  if (!navigator.mediaDevices?.getUserMedia || !el.gearbornStudioBetaVideo) {
    studioState.cameraError = "Camera unavailable. Load a photo to keep editing.";
    studioRenderControls();
    studioUpdateStageChrome();
    studioDraw();
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    if (!studioState.active) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    studioState.stream = stream;
    el.gearbornStudioBetaVideo.srcObject = stream;
    await el.gearbornStudioBetaVideo.play().catch(() => {});
    studioRenderControls();
    studioUpdateStageChrome();
  } catch (err) {
    console.warn("GearBorn Studio camera unavailable:", err);
    studioState.cameraError = "Camera permission denied or unavailable. Load a photo instead.";
    studioRenderControls();
    studioUpdateStageChrome();
    studioDraw();
  }
}

function studioOpen() {
  studioState.active = true;
  studioState.stage = "live";
  studioState.frame = null;
  studioState.stickers = [];
  studioState.selectedId = null;
  studioState.nextId = 1;
  studioState.cameraError = "";
  studioState.detectorMessage = "";
  studioState.detectionBox = null;
  studioState.liveTrack = false;
  studioPointers.clear();
  studioGestureStart = null;
  showView("gearborn-studio-beta");
  studioEnsureCanvasSize(1280, 720);
  studioRenderControls();
  studioRenderLayers();
  studioStartCamera();
  studioLoop();
}

function studioClose() {
  stopGearbornStudioBeta();
  betaRaceContext = { source: "prototype" };
  showView("beta");
  openBetaPrototypeIntro();
}

function stopGearbornStudioBeta() {
  studioState.active = false;
  if (studioState.rafId) cancelAnimationFrame(studioState.rafId);
  studioState.rafId = 0;
  studioState.dragging = false;
  studioState.liveTrack = false;
  studioState.detectionBox = null;
  studioPointers.clear();
  studioGestureStart = null;
  window.clearTimeout(studioLiveTrackTimer);
  studioClosePicker();
  stopGearbornStudioCamera();
  studioUpdateStageChrome();
}

function studioPointerList() {
  return Array.from(studioPointers.values());
}

function studioGestureDistance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function studioGestureAngle(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

function studioGestureMidpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function studioBaselineGesture() {
  const selected = studioSelectedSticker();
  const points = studioPointerList();
  if (!selected || !points.length) {
    studioGestureStart = null;
    return;
  }
  if (points.length >= 2) {
    const [a, b] = points;
    studioGestureStart = {
      mode: "multi",
      stickerX: selected.x,
      stickerY: selected.y,
      stickerScale: selected.scale || 1,
      stickerRotation: selected.rotation || 0,
      distance: Math.max(1, studioGestureDistance(a, b)),
      angle: studioGestureAngle(a, b),
      midpoint: studioGestureMidpoint(a, b)
    };
  } else {
    const [point] = points;
    studioGestureStart = {
      mode: "single",
      stickerX: selected.x,
      stickerY: selected.y,
      pointerX: point.x,
      pointerY: point.y
    };
  }
}

function studioApplyGesture() {
  const selected = studioSelectedSticker();
  const points = studioPointerList();
  if (!selected || !studioGestureStart || !points.length) return;
  if (points.length >= 2 && studioGestureStart.mode === "multi") {
    const [a, b] = points;
    const midpoint = studioGestureMidpoint(a, b);
    selected.x = studioGestureStart.stickerX + (midpoint.x - studioGestureStart.midpoint.x);
    selected.y = studioGestureStart.stickerY + (midpoint.y - studioGestureStart.midpoint.y);
    selected.scale = Math.max(0.05, Math.min(4, studioGestureStart.stickerScale * (studioGestureDistance(a, b) / studioGestureStart.distance)));
    selected.rotation = studioGestureStart.stickerRotation + (studioGestureAngle(a, b) - studioGestureStart.angle);
  } else if (points.length === 1 && studioGestureStart.mode === "single") {
    const [point] = points;
    selected.x = studioGestureStart.stickerX + (point.x - studioGestureStart.pointerX);
    selected.y = studioGestureStart.stickerY + (point.y - studioGestureStart.pointerY);
  } else {
    studioBaselineGesture();
  }
  studioDraw(studioState.stage === "live" ? "video" : null);
}

el.gearbornStudioBetaStart?.addEventListener("click", studioOpen);
el.gearbornStudioBetaBack?.addEventListener("click", studioClose);
el.gearbornStudioBetaAdd?.addEventListener("click", studioOpenPicker);
el.gearbornStudioBetaPickerClose?.addEventListener("click", studioClosePicker);
el.gearbornStudioBetaPickerModal?.addEventListener("click", (event) => {
  if (event.target === el.gearbornStudioBetaPickerModal) studioClosePicker();
});
el.gearbornStudioBetaCaptureFab?.addEventListener("click", () => studioCaptureFrame());
el.gearbornStudioBetaPicker?.addEventListener("click", (event) => {
  if (!studioIsActive()) return;
  const button = event.target.closest("[data-studio-car]");
  if (!button) return;
  studioCreateSticker(button.dataset.studioCar, Number(button.dataset.studioForm) || 0);
  studioClosePicker();
  studioRenderLayers();
});
el.gearbornStudioBetaLayers?.addEventListener("click", (event) => {
  const id = event.target.closest("[data-studio-layer]")?.dataset.studioLayer;
  if (!id) return;
  studioState.selectedId = Number(id);
  studioRenderControls();
  studioRenderLayers();
  studioDraw(studioState.stage === "live" ? "video" : null);
});
el.gearbornStudioBetaControls?.addEventListener("click", (event) => {
  if (!studioIsActive()) return;
  const action = event.target.closest("[data-studio-action]")?.dataset.studioAction;
  if (action === "capture") studioCaptureFrame();
  else if (action === "flip" && studioSelectedSticker()) {
    studioSelectedSticker().flip = !studioSelectedSticker().flip;
    studioRenderControls();
    studioDraw(studioState.stage === "live" ? "video" : null);
  } else if (action === "duplicate") studioDuplicateSelected();
  else if (action === "delete") studioDeleteSelected();
  else if (action === "forward") studioAdjustZ(1);
  else if (action === "backward") studioAdjustZ(-1);
  else if (action === "download") studioDownload();
  else if (action === "share") studioShare();
  else if (action === "new") studioNewCapture();
  else if (action === "auto-place") studioAutoPlaceSelected();
});
el.gearbornStudioBetaControls?.addEventListener("input", (event) => {
  if (!studioIsActive()) return;
  const selected = studioSelectedSticker();
  const transform = event.target.dataset.studioTransform;
  if (!selected || !transform) return;
  if (transform === "scale") selected.scale = Math.max(0.05, Number(event.target.value) / 100);
  if (transform === "rotation") selected.rotation = (Number(event.target.value) * Math.PI) / 180;
  if (transform === "opacity") selected.opacity = Math.max(0.1, Math.min(1, Number(event.target.value) / 100));
  studioDraw(studioState.stage === "live" ? "video" : null);
});
el.gearbornStudioBetaControls?.addEventListener("change", (event) => {
  if (!studioIsActive()) return;
  const selected = studioSelectedSticker();
  const transform = event.target.dataset.studioTransform;
  if (event.target.matches("[data-studio-file]")) {
    studioLoadFrameFile(event.target.files?.[0]);
    return;
  }
  if (transform === "role" && selected) {
    studioSetStickerRole(selected, event.target.value);
    return;
  }
  if (transform === "formIndex" && selected) {
    selected.formIndex = Math.max(0, Number(event.target.value) || 0);
    selected.role = selected.role || "race";
    studioLoadStickerImage(selected, selected.role);
    studioRenderControls();
    studioRenderLayers();
    studioDraw(studioState.stage === "live" ? "video" : null);
    return;
  }
  if (transform === "shadow" && selected) {
    selected.shadow = Boolean(event.target.checked);
    studioDraw(studioState.stage === "live" ? "video" : null);
    return;
  }
  if (transform === "liveTrack") {
    studioState.liveTrack = Boolean(event.target.checked);
    if (studioState.liveTrack) {
      studioAutoPlaceSelected({ silent: true }).then(() => studioScheduleLiveTrack());
    } else {
      window.clearTimeout(studioLiveTrackTimer);
      studioState.detectionBox = null;
      studioDraw("video");
    }
    studioRenderControls();
  }
});
el.gearbornStudioBetaCanvas?.addEventListener("pointerdown", (event) => {
  if (!studioIsActive()) return;
  const point = studioCanvasPoint(event);
  studioPointers.set(event.pointerId, point);
  if (studioPointers.size === 1) {
    const hit = studioHitTest(point);
    if (!hit) {
      studioPointers.delete(event.pointerId);
      return;
    }
    studioState.selectedId = hit.id;
  }
  studioState.dragging = true;
  studioBaselineGesture();
  el.gearbornStudioBetaCanvas.setPointerCapture?.(event.pointerId);
  studioRenderControls();
  studioRenderLayers();
  studioDraw(studioState.stage === "live" ? "video" : null);
});
el.gearbornStudioBetaCanvas?.addEventListener("pointermove", (event) => {
  if (!studioIsActive() || !studioState.dragging || !studioPointers.has(event.pointerId)) return;
  studioPointers.set(event.pointerId, studioCanvasPoint(event));
  studioApplyGesture();
});
["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
  el.gearbornStudioBetaCanvas?.addEventListener(eventName, (event) => {
    studioPointers.delete(event.pointerId);
    studioState.dragging = studioPointers.size > 0;
    studioBaselineGesture();
    studioRenderControls();
  });
});
window.addEventListener("pagehide", () => stopGearbornStudioBeta());
