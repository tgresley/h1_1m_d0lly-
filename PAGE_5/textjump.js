// ────────────────────────────────────────────────────────────────────────────
// Coherent Cut-Ups — wave baseline + 15% blue; hover/underline; click spawn
// Starts with START_SENTENCES, capped by MAX_SENTENCES; central link at ≥7 lines
// ────────────────────────────────────────────────────────────────────────────

let sourceText = `
  lip

air” mosquito’s and moths are zapped intermittently   ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎
				___ __ _		__		____	__	_  _

o me”  ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎

A young girl runs in cream dre  ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎

					He puts on his glasses, recounting his o  ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎

e smiles that retainer-y grin and brings her afce to his- fuck n k room. reading a cartoon with wet hair and braces - the uns

le buys her an icrecream soda with extra chocolate syrup. “L  ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎
eam moustach from her seductively glottony

ent” “humebrt the happy housewife”  ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎

		-	-   — - 	- - 			- -		- 	—— 	—	
your hunter”	ces - he had to purchase her favours - in order to finance h  ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎
 with coins___ __ _ 	__ _____ ___ _	________________ _
			__	_		__	  __ 	__			__	
mall ghost of somebody I just killed.⚀⚀⚀⚀⚀⚀⚀⚀⚀⚀⚀⚀⚀⚀⚀⚀
							—	—— — 	— 		——— 
							                        ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎She runs into the gas statio
ring sunglasses
		—— —- — 	— —	                 ——   Man cleans windscreen  ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎
                ice melted  ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎ ☺︎
	_	__ _____	___		___ 			__ 			__

AI TICKETS ON FIRE
	   — — —— —
 - he pinches her nose to snatch the iawbreaker out of her m
ng bunny ears and little dress, and bunny tail hands humber
g to the mailbox		__	_
 ____	__ 	_  __	Interspersed with unsettling dissona
 lola was lying - mona pretends
ther milk moustache - Humbert rages
	___ _ _
egs - focussing on Humberto crotch
	— — — 		— 	— — - - 		—	 ——— 	— —-
 cries and cries In their next hotel room - a child wit
e in completer dispair

	__ 	_
er mecns and screams down the stairs - its bucketing, she graps her bik
`;

// ─── data/state ─────────────────────────────────────────────────────────────
let fragments = [];
let sentences = [];
let currentSentences = [];
let sentenceParticles = [];
let highlightedWord = null;
let wordsList = [];

// start & cap
const START_SENTENCES = 3;   // ← begin with fewer
const MAX_SENTENCES   = 10;  // ← overall cap

// responsive text + wave
let TEXT_SIZE, LINE_SPACING, AMP, WAVELENGTH;

// ─── vocab ──────────────────────────────────────────────────────────────────
let subjects = [
  "the girl n/in cream","the n/ housewife","the man with glasses","the roadside diner",
  "the pink dress","the ice cream soda","the motel corridor","the retainer grin",
  "the lawbreaker jawbreaker","the milk moustache","the melted ice","the rabbit-eared costume",
  "the mailbox","the windshield wipers","the late-night lobby","the neon sign",
  "the gas station","the blue ticket stub"
];
let verbs = [
  "circles back to","recites","stares at","hides inside","presses against","waits under",
  "drifts beside","translates into","unthreads from","folds into","runs past","remembers",
  "pretends to forget","misnames","touches","rages at","blurs into","softens under"
];
let objects = [
  "a motel mirror","rain-slicked asphalt","an empty lobby chair","the hum of insects",
  "a late cartoon laughter","wet hair and braces","a sugar moustache","the custard light",
  "a cracked visor","the shadowed stairwell","a coin-filled pocket","the parking-lot neon",
  "the unsent letter","the ticket on fire","a glass door’s reflection","the hush before sirens",
  "the dissolving pink","the unread page"
];

// ─── p5 lifecycle ───────────────────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Inter');
  calcLayout();

  decomposeText();
  generateInitialSentences();   // uses START_SENTENCES
  updateWordsList();

  injectCentralLink();          // central link hidden until threshold
}

function draw() {
  background(255);
  displaySentences();           // render with per-char wave + 15% blue
  highlightWordUnderMouse();    // hover blue + underline
  maybeRevealCentralLink();     // show link when wrapped lines ≥ threshold
}

// ─── responsive layout ──────────────────────────────────────────────────────
function calcLayout(){
  const d = min(windowWidth, windowHeight);
  TEXT_SIZE = constrain(round(d * 0.018), 12, 24);
  LINE_SPACING = round(TEXT_SIZE * 1.35);
  AMP = constrain(round(windowHeight * 0.01), 4, 16);
  WAVELENGTH = constrain(round(windowWidth * 0.95), 400, windowWidth);
  textSize(TEXT_SIZE);
  textLeading(LINE_SPACING);
}

// ─── text decomposition ─────────────────────────────────────────────────────
function decomposeText() {
  const paragraphs = sourceText.split('\n');

  paragraphs.forEach(para => {
    const extracted = para
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + '.');
    sentences = sentences.concat(extracted);
  });

  sentences.forEach(sentence => {
    const parts = sentence.split(/[,;:]|\sand\s|\sor\s|\sbut\s|\swhile\s|\swhich\s|\sthat\s|\sas\s/);
    fragments = fragments.concat(parts.filter(p => p.trim().length > 5));
  });
}

// ─── seeding ────────────────────────────────────────────────────────────────
function generateInitialSentences() {
  const n = Math.min(START_SENTENCES, MAX_SENTENCES);
  for (let i = 0; i < n; i++) createCoherentSentence();
}

function createCoherentSentence() {
  if (currentSentences.length >= MAX_SENTENCES) return;

  let sentence = "";
  if (random() < 0.5 && sentences.length) {
    sentence = random(sentences);
  } else {
    const s = random(subjects);
    const v = random(verbs);
    const o = random(objects);
    sentence = `${capitalizeFirstLetter(s)} ${v} ${o}.`;
  }

  currentSentences.push(sentence);
  const pos = findNonOverlappingPosition();
  const styled = styleSentence(sentence);

  sentenceParticles.push({
    pos: createVector(pos.x, pos.y),
    sentence,
    size: TEXT_SIZE,
    color: color(0, 0, 0, 220),
    width: min(440, width * 0.8),
    height: 120,
    padding: 22,
    words: sentence.split(/\s+/).map(w => w.replace(/[.,;:!?'"()]/g, '')),
    styled
  });

  updateWordsList();
}

// ─── per-char style (15% blue + sine baseline) ──────────────────────────────
function styleSentence(sentence){
  const chars = [];
  let xCursor = 0;

  textSize(TEXT_SIZE);
  for (let i = 0; i < sentence.length; i++){
    const ch = sentence[i];
    const w = textWidth(ch);
    const waveOffset = sin((xCursor / WAVELENGTH) * TWO_PI) * AMP;
    const c = (random() < 0.15) ? color(30, 80, 200) : color(0);
    chars.push({ ch, w, waveOffset, color: c });
    xCursor += w;
  }
  return chars;
}

// ─── words list / hover set ─────────────────────────────────────────────────
function updateWordsList() {
  wordsList = [];
  for (const p of sentenceParticles) {
    const clean = p.sentence
      .split(/\s+/)
      .map(w => w.replace(/[.,;:!?'"()]/g, '').toLowerCase());
    const filtered = clean.filter(w =>
      w.length > 3 && !["and","the","with","from","that","this","been","have","would","could","were"].includes(w)
    );
    wordsList = wordsList.concat(filtered);
  }
  wordsList = [...new Set(wordsList)];
}

// Hover detection: blue + underline on hovered word
function highlightWordUnderMouse() {
  highlightedWord = null;
  cursor(ARROW);

  for (let pIndex = 0; pIndex < sentenceParticles.length; pIndex++) {
    const p = sentenceParticles[pIndex];
    const words = p.sentence.split(/\s+/);
    const size = p.size;
    const lineH = size * 1.5;

    let x = p.pos.x - p.width / 2;
    let y = p.pos.y;
    let accum = 0;

    textSize(size);

    for (let wIndex = 0; wIndex < words.length; wIndex++) {
      const token = words[wIndex] + " ";
      const wWidth = textWidth(token);

      if (accum + wWidth > p.width) {
        x = p.pos.x - p.width / 2;
        y += lineH;
        accum = 0;
      }

      const left = x + accum;
      const right = left + wWidth;
      const top = y - size;
      const bottom = y + size * 0.3;

      if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
        highlightedWord = {
          pIndex,
          wIndex,
          word: words[wIndex].replace(/[.,;:!?'"()]/g, '').toLowerCase()
        };
        cursor(HAND);
        return;
      }

      accum += wWidth;
    }
  }
}

// ─── layout helpers ─────────────────────────────────────────────────────────
function findNonOverlappingPosition() {
  let attempts = 0;
  const maxAttempts = 120;
  let pos = { x: 0, y: 0 };
  let ok = false;

  const newW = min(440, width * 0.8);
  const newH = 120;
  const pad = 22;

  while (!ok && attempts < maxAttempts) {
    pos.x = random(width * 0.12, width * 0.88);
    pos.y = random(height * 0.15, height * 0.82);
    ok = true;

    for (const p of sentenceParticles) {
      if (rectsOverlap(
        pos.x - newW/2 - pad, pos.y - pad, newW + pad*2, newH + pad*2,
        p.pos.x - p.width/2 - p.padding, p.pos.y - p.padding, p.width + p.padding*2, p.height + p.padding*2
      )) { ok = false; break; }
    }
    attempts++;
  }

  if (!ok) {
    pos.x = random(width * 0.12, width * 0.88);
    pos.y = random(height * 0.15, height * 0.82);
  }
  return pos;
}

function rectsOverlap(x1,y1,w1,h1, x2,y2,w2,h2){
  return (x1 < x2 + w2) && (x1 + w1 > x2) && (y1 < y2 + h2) && (y1 + h1 > y2);
}

// ─── rendering (per-char wave + hover underline) ────────────────────────────
function displaySentences() {
  textAlign(LEFT);
  textSize(TEXT_SIZE);

  for (let pIndex = 0; pIndex < sentenceParticles.length; pIndex++) {
    const p = sentenceParticles[pIndex];
    const words = p.sentence.split(/\s+/);
    const size = TEXT_SIZE;
    const lineH = LINE_SPACING;

    let x = p.pos.x - p.width / 2;
    let y = p.pos.y;

    let accum = 0;
    let charCursor = 0;

    for (let wIndex = 0; wIndex < words.length; wIndex++) {
      const word = words[wIndex];
      const token = word + " ";
      const tokenWidth = textWidth(token);

      if (accum + tokenWidth > p.width) {
        x = p.pos.x - p.width / 2;
        y += lineH;
        accum = 0;
      }

      const isHover =
        highlightedWord &&
        highlightedWord.pIndex === pIndex &&
        highlightedWord.wIndex === wIndex;

      let innerX = x + accum;
      for (let i = 0; i < token.length; i++) {
        const styled = p.styled[charCursor] || { ch: token[i], w: textWidth(token[i]), waveOffset: 0, color: color(0) };

        if (isHover) fill(0, 102, 204);
        else fill(styled.color);

        text(styled.ch, innerX, y + styled.waveOffset);

        innerX += styled.w;
        charCursor++;
      }

      if (isHover) {
        const underlineY = y + size * 0.18;
        stroke(0, 102, 204);
        strokeWeight(max(1, size * 0.06));
        line(x + accum, underlineY, x + accum + tokenWidth - textWidth(" "), underlineY);
        noStroke();
      }

      accum += tokenWidth;
    }
  }
}

// ─── click interactions (same UX) ───────────────────────────────────────────
function mousePressed() {
  if (highlightedWord) {
    createSentenceWithWord(highlightedWord.word);
  } else if (currentSentences.length < MAX_SENTENCES) {
    createCoherentSentence();
  }
}

function createSentenceWithWord(target) {
  if (currentSentences.length >= MAX_SENTENCES) {
    const idx = floor(random(currentSentences.length));
    currentSentences.splice(idx, 1);
    sentenceParticles.splice(idx, 1);
  }

  const word = target.toLowerCase();
  const cat = determineWordCategory(word);

  let s = random(subjects), v = random(verbs), o = random(objects);
  if (cat === "subject") s = includeWordInSubject(s, word);
  else if (cat === "verb") v = includeWordInVerb(v, word);
  else if (cat === "object") o = includeWordInObject(o, word);

  const sentence = `${capitalizeFirstLetter(s)} ${v} ${o}.`;
  currentSentences.push(sentence);

  const pos = findNonOverlappingPositionNear(mouseX, mouseY);
  const styled = styleSentence(sentence);

  sentenceParticles.push({
    pos: createVector(pos.x, pos.y),
    sentence,
    size: TEXT_SIZE,
    color: color(0, 0, 0, 220),
    width: min(440, width * 0.8),
    height: 120,
    padding: 22,
    words: sentence.split(/\s+/).map(w => w.replace(/[.,;:!?'"()]/g, '')),
    styled
  });

  updateWordsList();
}

// helpers for word category & positioning near the cursor
function determineWordCategory(w) {
  const subjTerms = ["girl","housewife","man","dress","ticket","motel","milk","bunny","mail","visor","sunglasses","neon","station","lobby"];
  const verbTerms = ["runs","put","pinch","snatch","stare","rage","remember","pretend","clean","melt","drift","blur","wait","touch","forget"];
  const objTerms  = ["mirror","stair","rain","asphalt","cartoon","hair","braces","moustache","pocket","letter","ticket","door","reflection","page"];
  if (subjTerms.some(t => w.includes(t))) return "subject";
  if (verbTerms.some(t => w.includes(t))) return "verb";
  if (objTerms.some(t => w.includes(t)))  return "object";
  return random(["subject","verb","object"]);
}
function includeWordInSubject(s, w){ return (random()<0.5)? `${w}` : `${s} ${w}`; }
function includeWordInVerb(v, w){ return (random()<0.5)? `${w}` : `${v} ${w}`; }
function includeWordInObject(o, w){ return (random()<0.5)? `${w}` : `${o} ${w}`; }

function findNonOverlappingPositionNear(tx, ty){
  let attempts = 0, maxAttempts = 100;
  let pos = { x: constrain(tx, 80, width-80), y: constrain(ty, 60, height-80) };
  const newW = min(440, width*0.8), newH = 120, pad = 22;

  while (attempts++ < maxAttempts) {
    let ok = true;
    for (const p of sentenceParticles) {
      if (rectsOverlap(
        pos.x - newW/2 - pad, pos.y - pad, newW + pad*2, newH + pad*2,
        p.pos.x - p.width/2 - p.padding, p.pos.y - p.padding, p.width + p.padding*2, p.height + p.padding*2
      )) { ok = false; break; }
    }
    if (ok) break;
    pos.x = constrain(pos.x + random(-60, 60), newW/2, width - newW/2);
    pos.y = constrain(pos.y + random(-40, 40), 50, height - 100);
  }
  return pos;
}

// ─── resize ─────────────────────────────────────────────────────────────────
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcLayout();

  for (const p of sentenceParticles) {
    p.size = TEXT_SIZE;
    p.pos.x = constrain(p.pos.x, p.width/2, width - p.width/2);
    p.pos.y = constrain(p.pos.y, 40, height - 60);
    p.styled = styleSentence(p.sentence);
  }
}

// ─── utils ──────────────────────────────────────────────────────────────────
function capitalizeFirstLetter(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// ────────────────────────────────────────────────────────────────────────────
// Central link: appears once total wrapped lines across all blocks ≥ 7
// ────────────────────────────────────────────────────────────────────────────
const CENTRAL_LINK_ID = 'nextLink';
const LINE_THRESHOLD  = 7;

function injectCentralLink(){
  const css = `
    #${CENTRAL_LINK_ID}{
      position:fixed; left:50%; top:50%; transform:translate(-50%,-50%) scale(.98);
      font-family:'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      font-size:clamp(16px, 2.4vw, 28px);
      color:blue; text-decoration:underline;
      opacity:0; pointer-events:none; transition:opacity .35s ease, transform .35s ease;
      z-index: 9999;
    }
    #${CENTRAL_LINK_ID}.show{ opacity:1; pointer-events:auto; transform:translate(-50%,-50%) scale(1.02); }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const linkEl = document.createElement('a');
  linkEl.id = CENTRAL_LINK_ID;
  linkEl.href = './smiley.html';   // ← your target
  linkEl.textContent = 'ʕ •ᴥ•ʔ';     // ← label
  document.body.appendChild(linkEl);
}

function maybeRevealCentralLink(){
  const el = document.getElementById(CENTRAL_LINK_ID);
  if (!el) return;
  const lines = countRenderedLines();
  if (lines >= LINE_THRESHOLD) el.classList.add('show');
}

function countRenderedLines(){
  if (!sentenceParticles || !sentenceParticles.length) return 0;
  textSize(TEXT_SIZE);

  let total = 0;
  for (const p of sentenceParticles){
    const boxW = p.width || 440;
    const words = p.sentence.split(/\s+/).map(w => w + ' ');
    let cur = 0, lines = 1;
    for (const token of words){
      const w = textWidth(token);
      if (cur + w > boxW){ lines++; cur = w; }
      else { cur += w; }
    }
    total += lines;
  }
  return total;
}
