
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
// Glen                                                                                                        //
// Author: Nic Thibodeaux (FXH: fxhash.xyz/u/nicthib, HEN: hicetnunc.art/nicthib, Twitter: @nicthibs)          \\
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.       //
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/.                       \\
// Acknowledgements: Thanks to fxhash mods for telling me to post this                                         //
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\

ws = false;
ffmx1 = fxrand()<.1?0:10**rand_range(-1,2);
ffmx2 = fxrand()<.1?0:10**rand_range(0,2);
ffmy1 = fxrand()<.1?0:10**rand_range(-1,3);
ffmy2 = fxrand()<.1?0:10**rand_range(0,2);
mc = fxrand()<.1?0:10

C1 = rand_list([0,1,2,4,5,6,7,8])+rand_range(0,.49);
C2 = rand_list([0,1,2,4,5,6,7,8])+rand_range(0,.49);
hues = {0:'Red',1:'Orange',2:'Green',4:'Green',5:'Cyan',6:'Blue',7:'Blue',8:'Magenta'}

f = [];
f.push({id:"sin",f:function(x,y){return sin(x)}});
f.push({id:"cos",f:function(x,y){return cos(x)}});
f.push({id:"tan",f:function(x,y){return tan(x)}});
f.push({id:"chirp",f:function(x,y){return sin(1/x)}});
f.push({id:"sinc",f:function(x,y){return sin(x)/x}});
f.push({id:"cos-tan",f:function(x,y){return cos(tan(x))}});
f.push({id:"sin-tan",f:function(x,y){return sin(tan(x))}});
f.push({id:"tan-cos",f:function(x,y){return tan(cos(x))}});
f.push({id:"tan-sin",f:function(x,y){return tan(sin(x))}});
f.push({id:"tan-cos-sin",f:function(x,y){return tan(cos(sin(x)))-1}});
f.push({id:"tan-cos-cos",f:function(x,y){return tan(cos(cos(x)))-1}});
f.push({id:"square",f:function(x,y){return sin(2*sin(2*sin(2*sin(x))))}});
f.push({id:"sinx-cosy",f:function(x,y){return sin(x)-cos(y)}});
f.push({id:"tanx-siny",f:function(x,y){return tan(x)-sin(y)}});
f.push({id:"chirp-cos",f:function(x,y){return sin(1/x)+cos(y)}});
f.push({id:"sincy",f:function(x,y){return sin(x)/(x+y)}});
f.push({id:"cos-tany",f:function(x,y){return cos(tan(x)*y)}});
f.push({id:"cos-tanxy",f:function(x,y){return cos(tan(x+y))}});
f.push({id:"sin-tany",f:function(x,y){return sin(tan(x)*y)}});
f.push({id:"tan-cosy",f:function(x,y){return tan(cos(x)*y)}});
f.push({id:"tan-sincy",f:function(x,y){return tan(sin(x)/y)}});
f.push({id:"tan-cos-sin-y",f:function(x,y){return tan(cos(sin(x)))-y}});
f.push({id:"tan-cos-cos-y",f:function(x,y){return tan(cos(cos(x)))-y}});
f.push({id:"?",f:function(x,y){return sin(y*sin(y*sin(2*sin(x))))}});

fx = [];
fx.push(function(x){return sin(x*PI/q)});
fx.push(function(x){return cos(x*PI/q)**2});
fx.push(function(x){return x/q});

fy = []
fy.push(function(y){return sin(y*PI/q)});
fy.push(function(y){return cos(y*PI/q)**2});
fy.push(function(y){return y<q*2/3?1:0});
fy.push(function(y){return (abs(y)<q/2)?0:1});
fy.push(function(y){return y/q});

fx = rand_list(fx);
fy = rand_list(fy);

f1 = rand_list(f);
f2 = rand_list(f);
f3 = rand_list(f);
f4 = rand_list(f);

xoff = fxrand()<.25?0:1e6;
yoff = fxrand()<.25?0:1e6;

nseed = parseInt(fxrand()*123456789);

function rand_list(L){
    return L[Math.floor(fxrand()*L.length)]
}

function rand_range(x,y){
    return fxrand()*(y-x)+x
}



window.$fxhashFeatures = {
  "Root hue 1":mc?hues[Math.round(C1)]:"White",
  "Root hue 2":mc?hues[Math.round(C2)]:"White",
  "f1": f1.id,
  "f2": f2.id,
  "f3": f3.id,
  "f4": f4.id,
  "x symmetric": xoff==0?"Yes":"No",
  "y symmetric": yoff==0?"Yes":"No",
}

function setup() {
  colorMode(HSB,10,10,10,255);
  c1 = color(C1,mc,10,20);
  c2 = color((C1+5)%10,mc,10,20);
  c3 = color(C2,mc,10,20);
  c4 = color((C2+5)%10,mc,10,20);
  noiseSeed(nseed);
  randomSeed(nseed);
  q = windowHeight;
  w = ws?windowWidth:2*q/3;
  h = q;
  createCanvas(w,h);
  background(0);
  stroke(255,30);
  noFill();
  iFrame = 0;
  LF = w*3/(2*q);
}

function draw() {
  push()
  translate(w/2,h/2)
  if (iFrame<=400|| keyIsDown(32)){
    for (i=0;i<10*LF;i++){
      try {
        new flowline(random()*w-w/2,random()*h-h/2,10,[-w/2,-h/2,w/2,h/2],c1,c2,f1,f2,f3,f4).addV(100).render();
        new flowline(random()*w-w/2,random()*h-w/2,10,[-w/2,-h/2,w/2,h/2],c3,c4,f1,f2,f3,f4).addV(100).render();
      }
      finally {continue}
    }
    iFrame++;
  }
  pop()
  
}

class flowline{
  constructor(x,y,mag,lb,c1,c2,f1,f2,f3,f4){
    this.x = x;
    this.y = y;
    this.vx = [];
    this.vy = [];
    this.c1 = c1;
    this.c2 = c2;
    this.f1 = f1;
    this.f2 = f2;
    this.f3 = f3;
    this.f4 = f4;
    this.mag = mag;
    this.lb = lb;
    return this
  }
  
  addV(n){
    for (let i=0;i<n;i++){
      let nx = map(noise(xoff+this.x/(ffmx1==0?this.y:ffmx1),yoff+this.y/(ffmx2==0?this.x:ffmx2)),0,1,-PI,PI)
      let ny = map(noise(xoff+this.x/(ffmy1==0?this.y:ffmy1),yoff+this.y/(ffmy2==0?this.x:ffmy2)),0,1,-PI,PI)
      let xw = fx(this.x);
      let yw = fy(this.y);
      this.x+=(this.mag*(this.f1.f(nx,ny)*xw+this.f2.f(nx,ny)*(1-xw)));
      this.y+=(this.mag*(this.f3.f(ny,nx)*yw+this.f4.f(ny,nx)*(1-yw)));
      this.vx.push(this.x);
      this.vy.push(this.y);
    }
    return this
  }
  
  render(){
    let grd = drawingContext.createLinearGradient(this.vx[0],this.vy[0],this.vx[this.vx.length-1],this.vy[this.vy.length-1]);
    grd.addColorStop(0, this.c1);
    grd.addColorStop(1, this.c2);
    drawingContext.strokeStyle = grd;
    strokeWeight(rand_range(0.2,1));
    beginShape();
    for (let i=1;i<this.vx.length;i++){
      let vy = this.vy[i+1]-this.vy[i];
      let vx = this.vx[i+1]-this.vx[i];
      if (this.inBounds(this.vx[i],this.vy[i])){
        vertex(this.vx[i],this.vy[i]);
      }
      else {
        endShape();
        beginShape();
      }
    }
    endShape();
  }
  inBounds(x,y){
    return x>this.lb[0]&&y>this.lb[1]&&x<this.lb[2]&&y<this.lb[3];
  } 
}
 
function keyPressed(){
  if (key=='f'){
    ws = !ws;
    setup();
  }
} 