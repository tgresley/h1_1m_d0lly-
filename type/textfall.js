// ===== Full-window falling poem (ONE-TIME) =====

let poem = `

 oppy. As he undresses her to go to sleep
					   I sealed my fate gratefully.	.
our of hellflames”________ ___ _ ___ ____ 	___	_ __

m____________________________ _____ __	_ __ 	__
er toenails pink - she is to be in a pla nother man who suavely makes conversation with her - “he o

nrough foggy green hills
	—	- -	—				-			—	——	—	-
s, eating them of
   —  —— — —		————  ————	————————— ——— —

modates him - top hat and all, dog jumps at windows, he ste m and walks to do
							      ——— — —    ——————
hone rings - she missed last two rehearsals - she was in the 
_._______  __._ __._________ .___ _ _..__ _______ __ 	___ __


`;

let letters = [];
let fallenLetters = [];
let state = "wave";      // "wave" → "fall" → "done"
let finished = false;
let fallDelay = 1000;
let lastStateChange = 0;
let bottomY;

// responsive layout params
let MARGIN, TEXT_SIZE, LINE_SPACING, AMP, WAVELENGTH;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Inter");
  calcLayout();
  bottomY = height - 20;
  generateLetters();
  lastStateChange = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcLayout();
  bottomY = height - 20;

  // only reflow if not finished yet
  if (!finished) {
    fallenLetters = [];
    letters = [];
    state = "wave";
    lastStateChange = millis();
    generateLetters();
  }
}

function calcLayout() {
  const d = min(windowWidth, windowHeight);

  TEXT_SIZE = constrain(round(d * 0.018), 12, 24);
  LINE_SPACING = round(TEXT_SIZE * 1.35);
  MARGIN = round(max(20, d * 0.03));

// Softer wave
AMP        = constrain(round(windowHeight * 0.01), 4, 16);   // was 0.02, 8–32
WAVELENGTH = constrain(round(windowWidth  * 0.95), 400, windowWidth); // was 0.35


  textSize(TEXT_SIZE);
  textLeading(LINE_SPACING);
}

function draw() {
    clear();

  // draw fallen pile
  for (let fl of fallenLetters) {
    fill(fl.color);
    text(fl.char, fl.x, fl.y);
  }

  if (state === "wave") {
    for (let l of letters) {
      fill(l.color);
      text(l.char, l.x, l.y);
    }
    if (millis() - lastStateChange > fallDelay) {
      state = "fall";
      for (let i = 0; i < letters.length; i++) {
        letters[i].startFall = millis() + i * 10;
      }
    }
  } else if (state === "fall") {
    let allFallen = true;

    for (let l of letters) {
      if (!l.fallen) {
        if (millis() > l.startFall) {
          l.y += l.speed;

          // stack collision
          const stackHeight = getStackHeightAtX(l.x);
          const targetY = bottomY - stackHeight;
          if (l.y >= targetY) {
            l.y = targetY;
            l.fallen = true;
            fallenLetters.push({ ...l });
          }
        }
        if (!l.fallen) allFallen = false;
      }
      fill(l.color);
      text(l.char, l.x, l.y);
    }

    if (allFallen) {
      state = "done";
      finished = true;
    }
  } else if (state === "done") {
    // static — no updates  if (!finished) {
    finished = true;
    const link = document.getElementById("nextLink");
    link.classList.add("show");
  
  }



}

function getStackHeightAtX(x) {
  const tolerance = 1;
  let count = 0;
  for (let fl of fallenLetters) {
    if (abs(fl.x - x) < tolerance) {
      count += TEXT_SIZE;
    }
  }
  return count;
}

function generateLetters() {
  letters = [];
  const sentences = poem.trim().split("\n").filter((s) => s.length > 0);

  let y = MARGIN * 1.5;
  let sentenceIndex = 0;

  while (y < height - (MARGIN * 2 + TEXT_SIZE * 4)) {
    const sentence = sentences[sentenceIndex % sentences.length];
    let xPos = MARGIN;

    for (let i = 0; i < sentence.length; i++) {
      const ch = sentence[i];
      const w = textWidth(ch);

      if (xPos + w > width - MARGIN) {
        y += LINE_SPACING;
        xPos = MARGIN;
      }

      const waveY = y + sin((xPos / WAVELENGTH) * TWO_PI) * AMP;
      const c = random() < 0.15 ? color(30, 80, 200) : color(0);

      letters.push({
        char: ch,
        x: xPos,
        y: waveY,
        speed: random(1, 3),
        startFall: null,
        color: c,
        fallen: false,
      });

      xPos += w;
    }

    y += LINE_SPACING;
    sentenceIndex++;
  }
}
