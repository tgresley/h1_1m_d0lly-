// === CONFIG: set your load-in values here ===
const DEFAULTS = {
  font: "Georgia",          // starting font ("Arial", "Georgia", "Courier", "Verdana")
  textSize: 12,             // starting size (within SIZE_RANGE below)
  spacing: 30,              // starting letter spacing
  numStreams: 8,           // starting number of text bands
  speedMin: 1,              // min horizontal drift speed per stream
  speedMax: 3,              // max horizontal drift speed per stream
  bgImage: "../backgrioundfull/skyflower.jpg"
};

// UI ranges (so you can change how far sliders can travel)
const RANGES = {
  SIZE_RANGE:   [10, 60, 1],
  SPACE_RANGE:  [5, 50, 1]
};

// === DATA ===
let bgImg;
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

// === UI ===
let textSizeSlider, textDensitySlider, fontSelect;

// === SCANLINE OVERLAY ===
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
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // --- UI: build sliders with ranges ---
  const [sizeMin, sizeMax, sizeStep]   = RANGES.SIZE_RANGE;
  const [spaceMin, spaceMax, spaceStep] = RANGES.SPACE_RANGE;

  textSizeSlider = createSlider(sizeMin, sizeMax, DEFAULTS.textSize, sizeStep);
  textSizeSlider.position(20, 30).style('width', '50px');

  textDensitySlider = createSlider(spaceMin, spaceMax, DEFAULTS.spacing, spaceStep);
  textDensitySlider.position(20, 80).style('width', '150px');

  fontSelect = createSelect();
  fontSelect.position(300, 130);
  fontSelect.style("font-size", "16px");
  fontSelect.style("font-family", "Times,serif");
  for (let f of availableFonts) fontSelect.option(f);
  fontSelect.selected(DEFAULTS.font);

  // apply initial font immediately
  textFont(fontSelect.value());
  textSize(textSizeSlider.value());

  // --- streams setup with defaults ---
  ts = Array(NUM_STREAMS).fill(0);
  speeds = [];
  textChoices = [];
  textColors = [];

  for (let i = 0; i < NUM_STREAMS; i++) {
    speeds.push(random(DEFAULTS.speedMin, DEFAULTS.speedMax));
    textChoices.push(random(texts));
    // 80% light blue, 20% darker blue
    textColors.push(random() < 0.8 ? color("#99BBFF") : color("#6f9fe8ff"));
  }

  // react to font change live
  fontSelect.changed(() => {
    textFont(fontSelect.value());
  });
}

function draw() {
  background("#E9F7FF");
  tint(140);
  image(bgImg, 0, 0, width, height);
  noTint();

  // apply current UI selections
  const curSize = textSizeSlider.value();
  const curSpacing = textDensitySlider.value();
  textSize(curSize);
  textFont(fontSelect.value());

  const bandH = height / NUM_STREAMS;

  for (let i = 0; i < NUM_STREAMS; i++) {
    let y = bandH * i + curSize;
    let xOffset = ts[i];
    ts[i] += speeds[i];

    // gentle sine for each band
    const freq = height * 0.18;               // wavelength scale
    const shift = i * 0.2 + frameCount / 100; // phase shift per band
    const amp = bandH * 0.4;                  // vertical amplitude

    fill(textColors[i]);
    const str = textChoices[i];

    for (let j = 0; j < str.length; j++) {
      const x = xOffset + j * curSpacing;
      const yOffset = sin(x / freq - shift) * amp;
      text(str[j], x % width, y + yOffset);
    }
  }

  drawScanTexture();
}

function drawScanTexture(){
  // horizontal scanlines
  push();
  noStroke();
  fill(0, SCAN.lineAlpha);
  for (let y = 0; y < height; y += SCAN.lineSpacing) {
    rect(0, y, width, 1);
  }
  pop();

  // moving scan bar
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// optional: keep if you like exporting frames
function mouseClicked(){
  // save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".jpg");
}
