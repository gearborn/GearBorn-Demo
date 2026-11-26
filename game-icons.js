// GearBorn mode icons, drawn in code (no image files).
// Route 66 enamel-sign style: rounded enamel tile in the mode's color, ink-navy outline,
// warm-white pinstripe, cream glyph with a navy outline.
// Usage: modeIconSrc("drag") returns a data: URI usable anywhere an image src or CSS url() goes.
//        modeIconSvg("drag") returns the raw <svg> markup for inline use.
// Load this file BEFORE game-data.js.
(function () {
  const INK = "#14213D";
  const CREAM = "#FAF6EE";

  // id: [tile color, darker edge, glyph svg (drawn in a 128×128 box)]
  const G = (d) => `<g fill="${CREAM}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${d}</g>`;
  const ICONS = {
    // Drag: the starting tree, three lights on a post
    drag: ["#E8A317", "#B87A08", G(`
      <rect x="54" y="24" width="20" height="82" rx="6"/>
      <circle cx="64" cy="40" r="13" fill="#FFC857"/>
      <circle cx="64" cy="66" r="13" fill="#FFC857"/>
      <circle cx="64" cy="92" r="13" fill="#2FBF83"/>`)],
    // Time Trial: stopwatch
    trial: ["#1E9E6A", "#14744D", G(`
      <rect x="56" y="16" width="16" height="12" rx="3"/>
      <circle cx="64" cy="72" r="38"/>
      <path d="M64 72 L64 48" stroke-width="7" fill="none"/>
      <path d="M64 72 L82 80" stroke-width="7" fill="none"/>
      <circle cx="64" cy="72" r="5" fill="${INK}" stroke="none"/>
      <path d="M94 36 l8 -8" stroke-width="7" fill="none"/>`)],
    // Gear Prix (circuit): checkered flag
    circuit: ["#1F4FB4", "#163A85", G(`
      <path d="M30 108 L30 22" stroke-width="7" fill="none"/>
      <path d="M32 24 C52 16 70 32 98 24 L98 74 C70 82 52 66 32 74 Z"/>`) +
      `<g fill="${INK}"><path d="M32 24 C38 22 44 21 49 22 L49 40 C44 39 38 40 32 42 Z"/><path d="M66 28 C71 30 76 31 82 30 L82 48 C76 49 71 48 66 46 Z"/>
       <path d="M49 40 C55 41 60 43 66 46 L66 63 C60 60 55 58 49 57 Z"/><path d="M82 48 C88 47 93 46 98 44 L98 60 C93 62 88 64 82 65 Z"/>
       <path d="M32 58 C38 56 44 56 49 57 L49 72 C44 71 38 72 32 74 Z"/><path d="M66 63 C71 66 76 67 82 65 L82 80 C76 81 71 80 66 78 Z"/></g>`],
    // Head-to-head: two chevrons pointing at each other
    h2h: ["#0E9AA7", "#0A6F78", G(`
      <path d="M22 40 L54 64 L22 88 L22 74 L36 64 L22 54 Z"/>
      <path d="M106 40 L74 64 L106 88 L106 74 L92 64 L106 54 Z"/>`)],
    // Crashout: impact burst
    battle: ["#C8323A", "#93222A", G(`
      <path d="M64 14 L74 44 L104 30 L88 58 L116 70 L86 78 L98 108 L70 90 L56 116 L50 86 L20 96 L38 70 L12 54 L42 50 L32 22 L56 40 Z"/>`) +
      `<path d="M64 52 L64 72" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle cx="64" cy="84" r="4.5" fill="${INK}"/>`],
    // Rival race: lightning bolt
    rival: ["#7C4DDB", "#5A33A8", G(`<path d="M74 12 L34 70 L60 70 L50 116 L94 52 L66 52 Z"/>`)],
    // Boss: crown
    boss: [INK, "#0B1426", `<g fill="#FFC857" stroke="#FAF6EE" stroke-width="4.5" stroke-linejoin="round">
      <path d="M22 92 L18 40 L44 62 L64 28 L84 62 L110 40 L106 92 Z"/>
      <rect x="22" y="92" width="84" height="14" rx="4"/></g>
      <g fill="#C8323A" stroke="${INK}" stroke-width="3"><circle cx="64" cy="76" r="7"/><circle cx="40" cy="80" r="5"/><circle cx="88" cy="80" r="5"/></g>`],
    // Pink slip: the title slip, folded corner
    "pink-slip": ["#E86BA8", "#B84A80", G(`
      <path d="M26 24 L86 24 L104 42 L104 104 L26 104 Z"/>
      <path d="M86 24 L86 42 L104 42" fill="none"/>`) +
      `<g stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M40 56 L90 56"/><path d="M40 72 L90 72"/><path d="M40 88 L70 88"/></g>`],
    // Medallion Gauntlet: gear medallion
    gauntlet: ["#B8742E", "#87521D", `<g stroke="${INK}" stroke-width="5" stroke-linejoin="round">
      <path fill="#FFC857" d="${gearPath(64, 64, 46, 36, 10)}"/>
      <circle cx="64" cy="64" r="22" fill="${CREAM}"/></g>
      <path d="M52 66 L60 74 L78 54" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`],
    // Convoy: the open road
    convoy: ["#1E9E6A", "#14744D", G(`<path d="M50 18 L78 18 L110 112 L18 112 Z"/>`) +
      `<g stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M64 30 L64 42"/><path d="M64 56 L64 72"/><path d="M64 88 L64 108"/></g>`],
    "convoy-spindell": ["#1F4FB4", "#163A85", G(`<path d="M50 18 L78 18 L110 112 L18 112 Z"/>`) +
      `<g stroke="${INK}" stroke-width="6" stroke-linecap="round"><path d="M64 30 L64 42"/><path d="M64 56 L64 72"/><path d="M64 88 L64 108"/></g>`],
    // Last Gear arena: a gear with the last tooth glowing
    lastgear: ["#E2701F", "#A84F12", `<g stroke="${INK}" stroke-width="5" stroke-linejoin="round">
      <path fill="${CREAM}" d="${gearPath(64, 64, 46, 34, 8)}"/>
      <circle cx="64" cy="64" r="15" fill="#E2701F"/></g>
`]
  };
  // Aliases so every place in the game finds one
  const ALIAS = { "time": "trial", "gearprix": "circuit", "gear-prix": "circuit", "exhibition": "circuit", "race4": "circuit",
    "headToHead2D": "h2h", "crashout": "battle", "lastGear": "lastgear", "medallion-gauntlet": "gauntlet",
    "convoy-unlocked": "convoy", "unlocked": "convoy", "spindell": "convoy-spindell", "pinkSlip": "pink-slip" };

  function gearPath(cx, cy, rOut, rIn, teeth) {
    const pts = [];
    const step = (Math.PI * 2) / teeth;
    for (let i = 0; i < teeth; i += 1) {
      const a = i * step - Math.PI / 2;
      const w = step * 0.22;
      [[a - step / 2 + w, rIn], [a - w * 1.1, rOut], [a + w * 1.1, rOut], [a + step / 2 - w, rIn]].forEach(([ang, r]) => {
        pts.push(`${(cx + Math.cos(ang) * r).toFixed(1)} ${(cy + Math.sin(ang) * r).toFixed(1)}`);
      });
    }
    return `M${pts.join(" L")} Z`;
  }

  // opts.bare: just the colored tile, no glyph, for modes that show a picture on top
  // (gauntlet: the line's medallion; boss and rival: their headshot; pink slip: the car's display art).
  function modeIconSvg(id, opts = {}) {
    const key = ICONS[id] ? id : ALIAS[id];
    const icon = ICONS[key] || ICONS.circuit;
    const [fill, edge] = icon;
    const glyph = opts.bare ? "" : icon[2];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">` +
      `<rect x="4" y="6" width="120" height="120" rx="26" fill="${edge}"/>` +
      `<rect x="4" y="2" width="120" height="120" rx="26" fill="${fill}" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="13" y="11" width="102" height="102" rx="19" fill="none" stroke="${CREAM}" stroke-width="2.5" opacity="0.9"/>` +
      `<path d="M16 22 Q16 12 28 12 L100 12 Q112 12 112 22 L112 34 Q64 24 16 40 Z" fill="#FFFFFF" opacity="0.16"/>` +
      `<g transform="translate(14 12) scale(0.78)">${glyph}</g></svg>`;
  }

  const cache = {};
  function modeIconSrc(id, opts = {}) {
    const k = id + (opts.bare ? ":bare" : "");
    if (!cache[k]) cache[k] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(modeIconSvg(id, opts))}`;
    return cache[k];
  }
  // Modes whose icon is a picture on a bare tile
  const PICTURE_MODES = ["gauntlet", "boss", "rival", "pink-slip"];
  window.modeIconIsPicture = (id) => PICTURE_MODES.includes(ICONS[id] ? id : ALIAS[id]);

  window.modeIconSvg = modeIconSvg;
  window.modeIconSrc = modeIconSrc;
  window.modeIconIds = Object.keys(ICONS);
})();
