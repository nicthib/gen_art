// Defining features
xpow = [0,10,50,100,150,-50,-100,-150];
ypow = [0,10,50,100,150,-50,-100,-150];
cspeed = [.25,1,2,4];
thk = [25,50,75];
sh = [0,1];
bkg = [0,300];
xfun = [0,1];
yfun = [0,1];

xpow = xpow[parseInt(fxrand()*xpow.length)];
ypow = ypow[parseInt(fxrand()*ypow.length)];
cspeed = cspeed[parseInt(fxrand()*cspeed.length)];
thk = thk[parseInt(fxrand()*thk.length)];
sh = sh[parseInt(fxrand()*sh.length)];
bkg = fxrand()<.1?1:0;
xfun = (fxrand()<.2)?1:0;
yfun = (fxrand()<.2)?0:1;

// Theme
function getFeaturexpow() {
  return xpow;
}

function getFeatureypow() {
  return ypow;
}

function getFeaturecspeed() {
  if (cspeed == .25) return "Slow"
  if (cspeed == 1) return "Medium"
  if (cspeed == 2) return "Fast"
  if (cspeed == 4) return "Very fast"  
}

function getFeaturethk() {
  if (thk == 25) return "Thin"
  if (thk == 50) return "Normal"
  if (thk == 75) return "Thick"  
}

function getFeaturesh() {
  if (sh==0) return "No"
  if (sh==1) return "Yes"
}

function getFeaturebkg() {
  if (bkg==0) return "Black"
  else return "White"
}

function getFeaturexfun() {
  if (xfun == 1) return "cosine"
    else return "sine"
}

function getFeatureyfun() {
  if (yfun == 1) return "cosine"
    else return "sine"
}

window.$fxhashFeatures = {
  "X Mag": getFeaturexpow(),
  "Y Mag": getFeatureypow(),
  "Color Speed": getFeaturecspeed(),
  "Thickness": getFeaturethk(),
  "Rotate": getFeaturesh(),
  "Background": getFeaturebkg(),
  "X function": getFeaturexfun(),
  "Y function": getFeatureyfun()
}

t=0;
function setup(){
  createCanvas(w=1000,w);
  noStroke();
  colorMode(HSB,a=300);
  rectMode(RADIUS)
}

function draw(){
  background(bkg*a);
  for(i=a;i>=1;i--){
    push();
    sinn = sin(TAU*(t-i/a));
    coss = cos(TAU*(t-i/a));
    translate(400+i+xpow*(xfun?sinn:coss),400+i+ypow*(yfun?sinn:coss));
    rotate(t*PI/5+i*TAU/sh);
    H = 299+cspeed*(i+10*t)
    fill(H%300,300,300);
    rect(0,0,thk);
    pop();
  }
  //noLoop();
  //t+=0.01;
}