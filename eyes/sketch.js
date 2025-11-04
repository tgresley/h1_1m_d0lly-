// ===============================
// GLOBALS
// ===============================
let media = [];
let story = [];
let i = 0;

// tile images (only for bg items that need them)
let tiles = {};

// each entry matches media[i]/story[i]
// type: 'color' | 'tile'
let backgrounds = [
  { type: 'color', value: '#ffffffff' },
  { type: 'color', value: '#ffffffff' },
  { type: 'color', value: '#ffffffff' },   // can use RGB array too
  { type: 'color', value: '#fff' }
];

// ===============================
// PRELOAD
// ===============================
function preload() {
  // main images
  media = [
    loadImage('./eyes/bigeyes.gif'),
    loadImage('./eyes/bigeyesblur.gif'),
    loadImage('./eyes/bigeyesgif_2.gif'),
    loadImage('./eyes/bigeyesgif_3.gif'),
    loadImage('./eyes/eye.jpg')
  ];

  // load only tile images referenced in backgrounds
  backgrounds.forEach(bg => {
    if (bg.type === 'tile' && bg.src && bg.key) {
      tiles[bg.key] = loadImage(bg.src);
    }
  });
}

// ===============================
// SETUP
// ===============================
function setup() {
  createCanvas(windowWidth, windowHeight);
  story = [
    'when I can’t see you',
    'I can see you',
    'visible. ROR',
    'head on his leg ”',
    'ribbons in her hair'
  ];
  textAlign(CENTER);
  textFont('Georgia'); textSize(16);
  imageMode(CENTER);
}

// ===============================
// DRAW
// ===============================
function draw() {
  // ---- background per slide ----
  const bg = backgrounds[i % backgrounds.length];

  if (bg?.type === 'color') {
    // accept hex string or [r,g,b,(a)]
    if (Array.isArray(bg.value)) background(...bg.value);
    else background(bg.value || '#ffffff');
  } else if (bg?.type === 'tile' && tiles[bg.key]) {
    drawTiled(tiles[bg.key]);
  } else {
    background(255);
  }

  // ---- main image + text ----
  fill(0);
  const imgW = min(windowWidth * 0.8, media[i].width);
  const imgH = min(windowHeight * 0.8, media[i].height);
  image(media[i], width/2, height/2, imgW, imgH);

  noStroke();
  rectMode(CENTER);
  // subtle label backer for legibility (optional)
  fill(255, 210);
  const tw = textWidth(story[i]) + 16;
  rect(width/2, height - 44, tw, 26, 8);

  fill(0);
  text(story[i], width/2, height - 40);
}

// tile helper
function drawTiled(tileImg){
  for (let x = 0; x < width; x += tileImg.width) {
    for (let y = 0; y < height; y += tileImg.height) {
      image(tileImg, x, y);
    }
  }
}

// ===============================
// INTERACTION
// ===============================
function mousePressed() {
  i = (i + 1) % media.length;
}

// ===============================
// RESIZE
// ===============================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
