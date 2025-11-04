// === CONFIG ===
const DEFAULTS = {
  font: "Georgia",
  textSize: 12,
  spacing: 30,
  numStreams: 8,
  speedMin: 1,
  speedMax: 3,
  bgImage: "../backgrioundfull/skyflower.jpg"
};

const RANGES = {
  SIZE_RANGE:  [10, 60, 1],
  SPACE_RANGE: [5, 50, 1]
};

let bgImg, cnv; // <— keep a reference to the canvas for saving
let texts = [
  "nts tocall her mother. She thinks she is in hospital",
  "ause your mother is dead”.",
  "                He peaks over at her, watches he",
  "  Get back in the boat with charlie",
  "ts, she places her head on his leg bargaining for her allowa nould be $",
  "seat, she rocks it back and forth with her freshly painted toen",
  "g dishes - he aboided his ",
  "el like we’re grown ups”, red lip and undo braids. long rend nails trying to open his drawer",
  "GRABBING",
  "   e and despair” - you have to be special to see the nymphet-n",
  "    e and pink floral dress with a magnificently wauufed hairdo",
  "he moves back",
  "A beautiful backyard - a piazza is beautifu",
];

let NUM_STREAMS = DEFAULTS.numStreams;
let speeds = [];
let ts = [];
let textChoices = [];
let textColors = [];
let availableFonts = ["Arial", "Georgia", "Courier", "Verdana"];

let textSizeSlider, textDensitySlider, fontSelect;
let photoBtn;
let navButtons = [];

const SCAN = {
  lineSpacing: 3,
  lineAlpha: 18,
  barHeight: 120,
  barAlpha: 28,
  speedPxPerSec: 180
};

function preload() {
  bgImg = loadImage(DEFAULTS.bgImage);
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight); // keep reference
  pixelDensity(1);

  const [sizeMin, sizeMax, sizeStep]   = RANGES.SIZE_RANGE;
  const [spaceMin, spaceMax, spaceStep] = RANGES.SPACE_RANGE;

  // --- Vertical sliders (rotated 90°) ---
  textSizeSlider = createSlider(sizeMin, sizeMax, DEFAULTS.textSize, sizeStep);
  textSizeSlider.style('width', '180px');
  textSizeSlider.style('transform-origin', 'left bottom');

  textDensitySlider = createSlider(spaceMin, spaceMax, DEFAULTS.spacing, spaceStep);
  textDensitySlider.style('width', '180px');
  textDensitySlider.style('transform', 'rotate(-90deg)');
  textDensitySlider.style('transform-origin', 'left bottom');

  // --- Font dropdown (keep default look) ---
  fontSelect = createSelect();
  for (let f of availableFonts) fontSelect.option(f);
  fontSelect.selected(DEFAULTS.font);

  // --- Photo button (no styling) ---
  photoBtn = createButton('[o]');
  photoBtn.mousePressed(() => {
    // Save using the canvas reference (more reliable)
    saveCanvas(cnv, '[o]', 'png');
  });

  // --- Three nav buttons (no styling) ---
  createNavButton('✟', '../cross/cross.html');
  createNavButton('⌂', '../index.html');
  createNavButton('ᶻ 𝗓 𐰁', '../bed/index.html');

  textFont(fontSelect.value());
  textSize(textSizeSlider.value());
  fontSelect.changed(() => textFont(fontSelect.value()));

  // --- streams ---
  ts = Array(NUM_STREAMS).fill(0);
  for (let i = 0; i < NUM_STREAMS; i++) {
    speeds.push(random(DEFAULTS.speedMin, DEFAULTS.speedMax));
    textChoices.push(random(texts));
    textColors.push(random() < 0.8 ? color("#99BBFF") : color("#6f9fe8ff"));
  }

  layoutUI();
}

function draw() {
  background("#E9F7FF");
  tint(140);
  image(bgImg, 0, 0, width, height);
  noTint();

  const curSize = textSizeSlider.value();
  const curSpacing = textDensitySlider.value();
  textSize(curSize);
  textFont(fontSelect.value());

  const bandH = height / NUM_STREAMS;

  for (let i = 0; i < NUM_STREAMS; i++) {
    let y = bandH * i + curSize;
    let xOffset = ts[i];
    ts[i] += speeds[i];

    const freq = height * 0.18;
    const shift = i * 0.2 + frameCount / 100;
    const amp = bandH * 0.4;

    fill(textColors[i]);
    const str = textChoices[i];

    for (let j = 0; j < str.length; j++) {
      const x = xOffset + j * curSpacing;
      const yOffset = sin(x / freq - shift) * amp;
      text(str[j], (x % width + width) % width, y + yOffset);
    }
  }

  drawScanTexture();
}

function drawScanTexture() {
  push();
  noStroke();
  fill(0, SCAN.lineAlpha);
  for (let y = 0; y < height; y += SCAN.lineSpacing) rect(0, y, width, 1);
  pop();

  const t = millis() * SCAN.speedPxPerSec / 1000;
  let yBar = (t % (height + SCAN.barHeight)) - SCAN.barHeight;

  push();
  noStroke();
  for (let i = 0; i < SCAN.barHeight; i++) {
    const alpha = map(i, 0, SCAN.barHeight, 0, SCAN.barAlpha);
    fill(255, alpha);
    rect(0, yBar + i, width, 1);
  }
  pop();
}

// --- Create nav button at random position (no extra styles) ---
function createNavButton(label, link) {
  const btn = createButton(label);
  btn.mousePressed(() => window.location.href = link);
  // Only position it — no styling
  const randX = random(50, windowWidth - 150);
  const randY = random(50, windowHeight - 100);
  btn.position(randX, randY);
  navButtons.push(btn);
}

function layoutUI() {
  // Vertical sliders along left & right
  textSizeSlider.position(60, height / 2 + 90);
  textDensitySlider.position(width - 40, height / 2 + 90);

  // Font dropdown (bottom-left)
  fontSelect.position(24, height - 50);

  // Photo button (bottom-right)
  photoBtn.position(width - 110, height - 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layoutUI();
  // Re-randomize nav buttons on resize
  navButtons.forEach(btn => btn.position(random(50, width - 150), random(50, height - 100)));
}
