// Initialize variables
let preview_hash = "ooAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
let preview_n = 0;
let RARITY_DENOMINATOR = 200;
let doResizeCanvas = false;
let n_traits = 10;
let tag_strings = ["Background","Frame","Ears","Head","Facialhair","Nose","Lefteye","Righteye","Mouth","Hair"];
let tag_norm = [
["White Cubism","Blue Cubism","Green Cubism","Grey Cubism","Orange Cubism","Red Cubism","Yellow Cubism","Purple Cubism","Turquoise Cubism","Gold Cubism","Sienna Cubism","Red Sphered Cubism","Blue Sphered Cubism","Blk White Triang Cubism"],
["Black","Blue","Red Gradient","Purple","White","Black Sunset","Black Haunt","Green Blue","Sunset","Purple Gradient"],
["Wire Large","Wire Small","Red Hornish","Blue Hornish","Green Hornish","Blue Tri Tip","Green Tri Tip","Red Tri Tip","Red Wacky","Green Wacky","Yellow Wacky","White Spheres","Grey Spheres","Blue Spheres","Red Spheres"],
["White Norm","Grey Norm","Red Norm","Green Norm","Blue Norm","Gradient Norm","Original Cubism","Red Red Cubism","Brown Yellow Cubism","Red Cubism","Tan Cubism","Dark Cubism","Grey Green Cubism"],
["White Triangular","Green Triangular","Blue Triangular","Black Haunt","Red Full","Ghostly Full","Icey Full","Black Cubed","Green Blue Cubed","Pink Cubed","Dark Red Cubed","Black Bubbles","Blue Bubbles","Green Bubbles","White Bubbles"],
["Rainbow","Sandpaper","Orange Squig","Yellow Squig","Green Bow","Orange Bow","Yellow Bow","Stroked Norm","Alien Stroked","Wild Triangles","Red Triangles","Shiny Triangles","Multi Triangles"],
["Rectangle","Rectangle Radial","Spheres","Purple Warped","Green Warped","Inner Triangle","Inner Gems","Pink Triangular","Dark Triangular","Tezos Beveled","Tezos Green Vintage","Tezos Norm"],
["Rectangle","Rectangle Radial Pink","Rectangle Radial","Black Squig","Green Squig","White Squig","GM","Red Zig","Yellow Zag","Purple Party","Inner Gems","Inner Triangle","Inner Gems Green","Triangle Flare","Tezos Sketch","Tezos Beveled"],
["Smile","Dark Smile","Blue Twisted","Green Twisted","Vamp Norm","Vamp Dead","Grey Spiked","Yellow Spiked","Clown","Alien Clown"],
["Black Norm","Purple Norm","Blue Norm","Green Norm","Greenart","Pink Art","Golden Art","Black Spiked","Blue Spiked","Red Spiked","Wild Spiked","Dark Curl","Green Curl","Red Curl","Blue Curl"]
];

let tag_special = [
["Original Cubism","Splatter Cubism"],
["Blue Bonkers","Green Alien"],
["Purple Tri Tip"],
["Wraith"],
[],
["Tezos Black","Tezos Red"],
["Tezos Sketch","GM"],
["Tezos Green Vintage"],
["Rainbow","None"],
["Fire Horns","None"]
];
//

// Randomize features
tag = [];
fns = [];
for (i=0;i<n_traits;i++){
  if (fxrand()<(tag_special[i].length/RARITY_DENOMINATOR)) {
    n = parseInt(fxrand()*tag_special[i].length);
    tag[i] = tag_special[i][n];
    id = 's' + (n+1);
  }
  else {
    n = parseInt(fxrand()*tag_norm[i].length);
    tag[i] = tag_norm[i][n];
    id = ("00" + (n+1 >>> 0).toString()).slice(-2)
  }
  fns[i] = "img/"+tag_strings[i]+'_'+id+".png"
}
//

// Feature strings for metadata
window.$fxhashFeatures = {
  "Background":   tag[0],
  "Frame":        tag[1],
  "Ears":         tag[2],
  "Head":         tag[3],
  "Facial Hair":  tag[4],
  "Nose":         tag[5],
  "Left Eye":     tag[6],
  "Right Eye":    tag[7],
  "Mouth":        tag[8],
  "Hair":         tag[9]
}
//

// Preload pngs we need
function preload() {
  img = [];
  //randomiz();
  for (i=0;i<n_traits;i++){
    img[i] = loadImage(fns[i]);
  }
}
//

// Setup, matching canvas size
function setup(){
  q = min(windowWidth,windowHeight);
  createCanvas(q,q);
}
//

// Draw image layer by layer
function draw(){
  for (i=0;i<n_traits;i++){
    image(img[i],0,0,q,q);    
  }
  if (fxhash != preview_hash){
    noLoop();
  }
}
//

// Window resize forces redraw
function windowResized(){
  q = min(windowWidth,windowHeight);
  resizeCanvas(q,q);
  loop();
}
//

function mouseClicked(){
  if (fxhash == preview_hash){
    randomiz();
    for (i=0;i<n_traits;i++){
      img[i] = loadImage(fns[i]);
    }
  }
}

function randomiz(){
  // Randomize features
  preview_n++;
  randomSeed((preview_n%3)*12345);
  tag = [];
  fns = [];
  for (i=0;i<n_traits;i++){
    if (random()<(tag_special[i].length/RARITY_DENOMINATOR)) {
      n = parseInt(random()*tag_special[i].length);
      tag[i] = tag_special[i][n];
      id = 's' + (n+1);
    }
    else {
      n = parseInt(random()*tag_norm[i].length);
      tag[i] = tag_norm[i][n];
      id = ("00" + (n+1 >>> 0).toString()).slice(-2)
    }
    fns[i] = "img/"+tag_strings[i]+'_'+id+".png"
  }
  //

  window.$fxhashFeatures = {
    "Background":   tag[0],
    "Frame":        tag[1],
    "Ears":         tag[2],
    "Head":         tag[3],
    "Facial Hair":  tag[4],
    "Nose":         tag[5],
    "Left Eye":     tag[6],
    "Right Eye":    tag[7],
    "Mouth":        tag[8],
    "Hair":         tag[9]
  }
}