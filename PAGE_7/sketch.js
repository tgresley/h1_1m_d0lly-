// ——— Y2K full-window + legible ———

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

// params that we’ll recompute responsively
let NUM_STREAMS;
let textSizeValue;
let textDensityValue;
let waveAmp;

let speeds = [];
let ts = [];
let textChoices = [];
let textColors = [];

// Y2K bits
let fontUsed = "Verdana";
const PALETTE = ["#3f5d60ff","#C0FF00","#9b6f98ff","#9D7BFF","#00FFAA","#FFB3E6","#7DF9FF"];
const BG_TOP = "#02030D";
const BG_BOT = "#2A3ABB";
let twinkles = [];

function preload() {
  bgImg = loadImage("bgimg.jpg"); // optional
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initResponsive();
  initStreams();
  initTwinkles();
  textFont(fontUsed);
  noStroke();
}

function initResponsive() {
  const d = min(width, height);

  // readable on laptop->projector: clamp to sane range
  textSizeValue = round(constrain(d * 0.02, 14, 28));            // ~2% of min dimension
  textDensityValue = round(textSizeValue * 2.2);                  // tracking
  NUM_STREAMS = constrain(floor(height / (textSizeValue * 2.0)), 6, 18);

  // wave amplitude stays within each lane to avoid illegible overlaps
  waveAmp = (height / NUM_STREAMS) * 0.38;
}

function initStreams() {
  speeds = [];
  ts = Array(NUM_STREAMS).fill(0);
  textChoices = [];
  textColors = [];
  for (let i = 0; i < NUM_STREAMS; i++) {
    speeds.push(random(1.2, 2.2)); // not too fast for legibility
    textChoices.push(random(texts));
    textColors.push(color(random(PALETTE)));
  }
}

function initTwinkles() {
  twinkles = [];
  const N = round((width * height) / 35000); // density scales with area
  for (let i = 0; i < N; i++) {
    twinkles.push({
      x: random(width),
      y: random(height),
      r: random(0.6, 1.6),
      p: random(TWO_PI),
      s: random(0.6, 1.4)
    });
  }
}

function draw() {
  drawVerticalGradient(color(BG_TOP), color(BG_BOT));

  // subtle gloss
  push();
  translate(0, sin(frameCount * 0.01) * height * 0.06);
  drawGlossBand();
  pop();

  // faint texture
  push();
  tint(255, 24);
  image(bgImg, 0, 0, width, height);
  pop();

  drawTwinkles();

  // streaming neon text with tempered glow
  textSize(textSizeValue);
  for (let i = 0; i < NUM_STREAMS; i++) {
    let laneH = height / NUM_STREAMS;
    let baseY = laneH * i + laneH * 0.55; // centers in lane
    let xOffset = ts[i];
    ts[i] += speeds[i];

    let freq = height * 0.10;
    let shift = i * 0.22 + frameCount / 100;
    let selectedText = textChoices[i];

    let baseCol = textColors[i];
    let c = color(red(baseCol), green(baseCol), blue(baseCol), 235);

    blendMode(ADD);
    for (let j = 0; j < selectedText.length; j++) {
      let x = xOffset + j * textDensityValue;
      let yOffset = sin(x / freq - shift) * waveAmp;
      y2kGlowText(selectedText[j], x % width, baseY + yOffset, c);
    }
    blendMode(BLEND);
  }

  drawScanlines();
}

// ——— visuals ———
function drawVerticalGradient(c1, c2) {
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(c1, c2, t);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawGlossBand() {
  noStroke();
  for (let y = 0; y < height * 0.48; y++) {
    let t = y / (height * 0.48);
    let a = pow(1 - t, 2) * 50; // slightly softer than before
    fill(255, 255, 255, a);
    rect(0, y, width, 1);
  }
}

function y2kGlowText(ch, x, y, baseCol) {
  // fewer/lighter layers for crisp edges
  const layers = 4;
  for (let i = layers; i >= 1; i--) {
    let a = map(i, 1, layers, 10, 40);
    let off = i * 0.6;
    fill(red(baseCol), green(baseCol), blue(baseCol), a);
    text(ch, x - off, y);
    text(ch, x + off, y);
    text(ch, x, y - off);
    text(ch, x, y + off);
  }
  // inner bright (not pure white to avoid bloom blowout)
  fill(245);
  text(ch, x, y);
}

function drawScanlines() {
  // slightly wider step keeps text clearer on hi-DPI
  stroke(255, 14);
  for (let y = 0; y < height; y += 3) {
    line(0, y, width, y);
  }
  noStroke();
}

function drawTwinkles() {
  push();
  for (let s of twinkles) {
    let a = 80 + 60 * sin(frameCount * 0.02 * s.s + s.p);
    fill(255, 255, 255, a);
    noStroke();
    circle(s.x, s.y, s.r * 2);

    // tiny cross
    stroke(255, a * 0.6);
    line(s.x - s.r*1.6, s.y, s.x + s.r*1.6, s.y);
    line(s.x, s.y - s.r*1.6, s.x, s.y + s.r*1.6);
  }
  pop();
}

// ——— responsive ———
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initResponsive();
  initStreams();   // re-seed lanes so spacing matches new layout
  initTwinkles();  // reposition stars for new size
}

