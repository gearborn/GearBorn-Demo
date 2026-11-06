// ─── SPRITE METRICS: true-shape drawing for GearBorn car art ───────────────
// Measures each car image once (lazily, on first use) and caches the result
// by image src. Used by Last Gear and the 2D race (top-down sprites) and by the
// drag race (side-view grounding). Never draws a sprite stretched.
//
// Metrics (all in the image's natural pixel units):
//   bounds  – box around every visible pixel
//   body    – box around the car body, ignoring thin one-sided extras
//             (tails, banners, arms, smoke, antennae)
//   contactY – lowest row of solid pixels (where side-view tires touch down)
//
// If the canvas can't be read (e.g. the page is opened from file://), metrics
// are null and callers fall back to drawing the full image at its true aspect.
 
const GEARBORN_SPRITE_SAMPLE_WIDTH = 256;
const GEARBORN_SIDE_GROUND_LINE = 0.743; // shared ground line, as a fraction of side-view height
const gearbornSpriteMetricsCache = new Map(); // src -> metrics object, or null if unreadable
let gearbornSpriteScratch = null;
 
function gearbornLongestRun(flags, gap = 1) {
  let bestStart = 0;
  let bestEnd = -1;
  let start = -1;
  let last = -1;
  for (let i = 0; i < flags.length; i += 1) {
    if (!flags[i]) continue;
    if (start < 0 || i - last > gap + 1) start = i;
    last = i;
    if (last - start > bestEnd - bestStart) {
      bestStart = start;
      bestEnd = last;
    }
  }
  return [bestStart, bestEnd];
}
 
function gearbornMeasureSprite(img) {
  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;
  if (!naturalW || !naturalH) return null;
  const W = GEARBORN_SPRITE_SAMPLE_WIDTH;
  const H = Math.max(1, Math.round(naturalH * W / naturalW));
  if (!gearbornSpriteScratch) gearbornSpriteScratch = document.createElement("canvas");
  const canvas = gearbornSpriteScratch;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, 0, 0, W, H);
  let data;
  try {
    data = ctx.getImageData(0, 0, W, H).data;
  } catch (error) {
    return null; // tainted canvas (file:// or cross-origin): caller falls back
  }
  const colCount = new Uint32Array(W);
  const solidRowCount = new Uint32Array(H);
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const a = data[(y * W + x) * 4 + 3];
      if (a > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      if (a >= 160) colCount[x] += 1;
      if (a >= 200) solidRowCount[y] += 1;
    }
  }
  if (maxX < 0) return null;
  // Body columns: columns at least 25% as full as the fullest column.
  let maxCol = 0;
  for (let x = 0; x < W; x += 1) if (colCount[x] > maxCol) maxCol = colCount[x];
  const colFlags = Array.from(colCount, (count) => count >= maxCol * 0.25);
  const [c0, c1] = gearbornLongestRun(colFlags);
  // Body rows: within the body columns, rows at least 18% full.
  const bodyWidth = c1 - c0 + 1;
  const rowFlags = new Array(H);
  for (let y = 0; y < H; y += 1) {
    let count = 0;
    for (let x = c0; x <= c1; x += 1) if (data[(y * W + x) * 4 + 3] >= 160) count += 1;
    rowFlags[y] = count >= bodyWidth * 0.18;
  }
  const [r0, r1] = gearbornLongestRun(rowFlags);
  // Contact line: lowest row with real solid coverage (ignores 1–2 px specks).
  const contactThreshold = Math.max(2, W * 0.006);
  let contactRow = maxY;
  for (let y = H - 1; y >= 0; y -= 1) {
    if (solidRowCount[y] >= contactThreshold) { contactRow = y; break; }
  }
  const s = naturalW / W;
  const box = (x0, y0, x1, y1) => {
    const b = { x0: x0 * s, y0: y0 * s, x1: (x1 + 1) * s, y1: (y1 + 1) * s };
    b.w = b.x1 - b.x0;
    b.h = b.y1 - b.y0;
    b.cx = (b.x0 + b.x1) / 2;
    b.cy = (b.y0 + b.y1) / 2;
    return b;
  };
  return {
    naturalW,
    naturalH,
    bounds: box(minX, minY, maxX, maxY),
    body: box(c0, r0, c1, r1),
    contactY: (contactRow + 1) * s
  };
}
 
// Returns cached metrics, measuring now if the image is loaded. Returns
// undefined while the image is still loading, and null if it can't be read.
function gearbornSpriteMetrics(img) {
  if (!img) return null;
  const src = img.currentSrc || img.src;
  if (!src) return null;
  if (gearbornSpriteMetricsCache.has(src)) return gearbornSpriteMetricsCache.get(src);
  if (!img.complete || !img.naturalWidth) return undefined;
  const metrics = gearbornMeasureSprite(img);
  gearbornSpriteMetricsCache.set(src, metrics);
  return metrics;
}
 
// Draws a top-down sprite centered on the car body, at its true aspect, with
// the body scaled to bodyLength canvas pixels. The context must already be
// translated to the car's position and rotated so the car's front points up.
// Returns false if the image isn't ready (caller draws its placeholder).
function gearbornDrawTopdownSprite(ctx, img, bodyLength) {
  if (!img?.complete || !img.naturalWidth) return false;
  const m = gearbornSpriteMetrics(img);
  if (!m) {
    // Fallback: true aspect, full frame, typical body share of 66%.
    const scale = bodyLength / (img.naturalHeight * 0.66);
    ctx.drawImage(img, -img.naturalWidth * scale / 2, -img.naturalHeight * scale / 2, img.naturalWidth * scale, img.naturalHeight * scale);
    return true;
  }
  const measuredLength = Math.max(m.body.h, m.bounds.h * 0.75);
  let scale = bodyLength / measuredLength;
  scale = Math.min(scale, (bodyLength * 1.45) / m.bounds.h); // never let extras make a car huge
  ctx.drawImage(img, -m.body.cx * scale, -m.body.cy * scale, m.naturalW * scale, m.naturalH * scale);
  return true;
}
 
// Debug overlay: outlines the body box the drawing is centered on.
function gearbornDrawTopdownDebug(ctx, img, bodyLength) {
  const m = gearbornSpriteMetrics(img);
  if (!m) return;
  const measuredLength = Math.max(m.body.h, m.bounds.h * 0.75);
  const scale = Math.min(bodyLength / measuredLength, (bodyLength * 1.45) / m.bounds.h);
  ctx.save();
  ctx.strokeStyle = "rgba(80,220,255,0.9)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect((m.body.x0 - m.body.cx) * scale, (m.body.y0 - m.body.cy) * scale, m.body.w * scale, m.body.h * scale);
  ctx.restore();
}
 
// Vertical offset (CSS px) that puts a side-view's tires on the shared ground
// line, for an <img> drawn with object-fit: contain in a boxW × boxH box.
function gearbornSideViewGroundOffset(metrics, boxW, boxH) {
  if (!metrics || !boxW || !boxH) return 0;
  const scale = Math.min(boxW / metrics.naturalW, boxH / metrics.naturalH);
  const renderedH = metrics.naturalH * scale;
  const offset = (GEARBORN_SIDE_GROUND_LINE * metrics.naturalH - metrics.contactY) * scale;
  // Clamp: never move art more than 20% of its rendered height.
  return Math.max(-renderedH * 0.2, Math.min(renderedH * 0.2, offset));
}
 
// Grounds a side-view <img> in place. Safe to call before the image loads.
function gearbornGroundSideViewImage(img) {
  if (!img) return;
  const apply = () => {
    const m = gearbornSpriteMetrics(img);
    const dy = gearbornSideViewGroundOffset(m, img.clientWidth, img.clientHeight);
    img.style.translate = dy ? `0 ${dy.toFixed(1)}px` : "";
  };
  if (img.complete && img.naturalWidth) apply();
  else img.addEventListener("load", apply, { once: true });
}
 
// Inline style for side-view <img> tags built as HTML strings each frame.
// Uses cached metrics only; warms the cache for next time if missing.
const gearbornSideViewWarm = new Set();
function gearbornSideViewGroundStyle(src, boxW, boxH) {
  if (!src) return "";
  const resolved = new URL(src, document.baseURI).href;
  if (gearbornSpriteMetricsCache.has(resolved)) {
    const dy = gearbornSideViewGroundOffset(gearbornSpriteMetricsCache.get(resolved), boxW, boxH);
    return dy ? `translate:0 ${dy.toFixed(1)}px;` : "";
  }
  if (!gearbornSideViewWarm.has(resolved)) {
    gearbornSideViewWarm.add(resolved);
    const probe = new Image();
    probe.addEventListener("load", () => gearbornSpriteMetrics(probe), { once: true });
    probe.src = resolved;
  }
  return "";
}
 
