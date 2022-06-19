// TO DO

// notscreen()
// make_cbodies()
// make_sky()
// make_tree()
// make_flora()
// make_cloud()
// make_ground()
// makeCamFrame()
// stage
// 

function rand(a=1,b=null){return b==null?(fxrand()*a):fxrand()*(b-a)+a;}
function randa(a){return a[fxrand()*a.length|0]}
function randintarr(n,max){arr=[];for(let i=0;i<n;i++){arr.push(round(rand(max)))};return arr}
const steps=fxhashTrunc.split('').map((x)=>b58dec(x));
const hsteps=fxhashTrunc.split('');
let doResizeCanvas=false;
const start_tmp=Date.now();
const stage_length=1000*3600;
const timeshift=12;
stage_off=100;
const petsz=32;
const st=setTimeout;
let snapshot=false;
function preload(){
  noiseSeed(round(rand(1e8)));
  dev_col=round(map(steps[30],0,57,0,10))*10;
  border={x:0, y:0, w:200, fX:0, cdata:notscreen()};
  stars=makestars();
  c_body={x:50, y:55, w:31, fX:0, cdata:make_cbodies()};
  bkg={x:50, y:50, w:100, fX:0, cdata:make_sky()};
  n_clouds=round(rand(3,8));
  clouds=[];
  for (let i=0;i<n_clouds;i++){
    clouds.push({
      x:rand(30,170),y:rand(40,70),
      w:20, h:20, fX:0,
      speed:rand()/20,cdata:make_cloud()
    })
  }
  
  pregrow=randa([['oooo'],['ohhhh'],['ooookhn']])[0];
  pet={
    x:map(noise(stage()),0,1,50,100), y:115, w:petsz, h:petsz, fX:0, sleeping: false, lmt:0, speed:4,
    grow_steps: concat(pregrow.split(''),hsteps), cdata:createGraphics(petsz*8,petsz),
    haslegs: false, name:tezname()
  };
  
  //tv={x: 50, y: 50,w: 100, fX: 7, cdata: bkg.cdata};
  
  cam={x:0, y:0, w:34, fX:0};
  cam.cdata = makeCamFrame();

  treeData = {n:round(rand(2,8)),tx:[], ty:[], type:[]};
  for (let i=0;i<treeData.n;i++){
    treeData.tx.push(round(rand(5,95)));
    treeData.ty.push(round(rand(mound(treeData.tx[i])+2,95)));
    treeData.type.push(randa([1,2]));
  }
  ground={x: 50, y: 50, w: 100,fX: 0,cdata: make_ground()};
  tree = makeTree();
  flora = make_flora();
  flora1={x:50, y:50, w:100, fX:0, cdata:flora.F1};
  flora2={x:50, y:50, w:100, fX:0, cdata:flora.F2};
}

function setup(){
  frameRate(30);
  q=min(windowHeight,windowWidth);
  createCanvas(q,q); noSmooth();
  OS=createGraphics(200,200);
  update();
  exist();
}

function power(){
  t_o=0;
  if (tv.fX==2){
    for (let i=0;i<5;i++){
      st(function(){tv.fX++;},t_o)
      t_o+=50;
    }
  }
  else if (tv.fX==7){
    for (i=0;i<5;i++){
      st(function(){tv.fX--;},t_o)
      t_o+=50;
    }
  }
}

function DS(s){OS.image(s.cdata,round(s.x),round(s.y),s.w,s.w,s.w*s.fX,0,s.w,s.w)}

function exist(){
  pet.sleeping=hour>=18;
  nextcycle=5000;
  if (stage()>=2&&!pet.sleeping){
    rand()<.95?breathe_in():walk(rand()>.5);
    nextcycle=1500;
  }
  if (pet.sleeping&&stage()>=2&&(Date.now()-pet.lmt)>3000){
    pet.lmt=Date.now();
    st(function(){pet.fX=4},0)
    st(function(){pet.fX=5},1000)
    st(function(){pet.fX=6},1200)
    st(function(){pet.fX=5},2200)
    st(function(){pet.fX=4},2400)
    nextcycle=5000;
  }
  pet.fX=stage()>=2?pet.fX:7;
  st(exist,nextcycle);
}

function breathe_in(){
  if ((Date.now()-pet.lmt)>1500){
    pet.lmt=Date.now();pet.fX=1;
    st(function(){pet.lmt=Date.now();pet.fX=0;},750)
  }
}

function walk(d){
  pet.lmt=Date.now();
  pet.rs=pet.x+pet.w-pet.speed;
  pet.ls=pet.x+pet.speed;
  if (!d&&pet.rs<bkg.x+bkg.w){pet.fX=3;pet.x+=pet.speed}
  else if(d&&pet.ls>bkg.x){pet.fX=2;pet.x-=pet.speed}
  else {breathe_in()}
  st(function(){pet.fX=0},300)
}

function drawscene(){
  hour=getTime()-6;
  hour=hour<0?hour+24:hour;
  if (hour<15){
    c_body.fX=0;dX=hour/15;
    c_body.y=dX<.5?55:55-40*cos(dX*PI);
  }
  else{
    c_body.fX=1;dX=(hour-15)/9;
    c_body.y=dX>.5?55:55+40*cos(dX*PI);
  }
  c_body.x=round(map(dX,0,1,bkg.x-c_body.w,bkg.x+bkg.w));

  OS.clear();
  bkg.cdata=make_sky();
  DS(bkg);
  DS(c_body);
  for (let i=0;i<clouds.length;i++){
    clouds[i].x=clouds[i].x<(bkg.x+bkg.w)?clouds[i].x+clouds[i].speed:(bkg.x-clouds[i].w);
    DS(clouds[i]);
  }
  DS(ground);
  DS(flora1);
  
  DS(pet);
  OS.image(tree,-5,20,128,128,0,0,128,128);
  DS(flora2);
  
  DS(border);
  //DS(tv);

  if (snapshot){
    mX=round(200*mouseX/q)+4;
    mY=round(200*mouseY/q);
    cam.x=mX-5; cam.y=mY-5;
    DS(cam);
  }
}

function draw(){
  if(doResizeCanvas){
    q=min(windowHeight,windowWidth);
    resizeCanvas(q,q);
    doResizeCanvas=false;
  }
  clear();
  drawscene();
  image(OS,0,0,q,q,0,0);  
}

function windowResized(){doResizeCanvas=true}

function mouseClicked(){
  if (snapshot){
    snapshot=false;
    drawscene();
    let G = OS.get(cam.x, cam.y, cam.w, cam.w);
    let G2 = createGraphics(320,320);
    G2.noSmooth();
    G2.image(G,0,0,320,320);
    G2.save(pet.name)
  }
  mX=round(200*mouseX/q)+4;
  mY=round(200*mouseY/q);
  xoff=mX-(pet.x+pet.w/2);
  yoff=mY-(pet.y+pet.h);
  if (sqrt(xoff**2+yoff**2)<10&&stage()>=1){
    walk(xoff>0);
  }
  // Left button: screenshot
  if (Math.pow(Math.pow(Math.abs(mX-75),2)+Math.pow(Math.abs(mY-165),2),0.5) < 7){
    snapshot=true;
  }
  // Middle button: power
  if (Math.pow(Math.pow(Math.abs(mX-500),2)+Math.pow(Math.abs(mY-867),2),0.5) < 30){
    power();
  }
  // Right button: stats
  if (Math.pow(Math.pow(Math.abs(mX-640),2)+Math.pow(Math.abs(mY-820),2),0.5) < 30){
    statpanel();
  }
  for (let i=0;i<clouds.length;i++){
    cxoff=abs(mX-(clouds[i].x+clouds[i].w/2));
    cyoff=abs(mY-(clouds[i].y+clouds[i].h));
    if (cxoff<clouds[i].w/4&&cyoff<clouds[i].h/6){
      wind(clouds[i])
      break
    }
  }
}

function wind(c){
  let ws=round(rand(2,6));
  st(function(){c.x+=ws},0);
  st(function(){c.x+=ws},100);
  st(function(){c.x+=ws},300);
  st(function(){c.x+=ws},600);
  st(function(){c.x+=ws},1000);
}

function ddraw(idx){
  let wgt=0;
  for (let x=0;x<pet.sz;x++){
    for (let y=0;y<pet.sz;y++){
      let xx=x+idx*pet.sz;
      if (c[x][y]==1){col=color(0,0,0)}
      else if (c[x][y]==0){wgt++;col=idx==7?color(240,234,214):lerpColor(pet.c1,pet.c2,(pet.sz-y)/pet.h)}
      else if (c[x][y]==2){col=color(173,255,255)}
      else {col=color(255,255,255,0)}
      pet.cdata.set(xx,y,col);
    }
  }
  if (idx==0){
    pet.wgt=wgt;
  }
}

function grow(m){
  for (let x=1;x<pet.sz-1;x++){
    for (let y=1;y<pet.sz-1;y++){
      n=0;
      for (let i=-1;i<=1;i++){
        for (let j=-1;j<=1;j++){
          if (b[x+i][y+j]==1){
            n++;
          }
        }
      }
      pet.Th=min(b[16].reduce((v1,v2)=>v1+v2),b[17].reduce((v1,v2)=>v1+v2));
      arm=round(abs(pet.sz-pet.Th/2));
      top=abs(pet.sz-y)<=pet.Th/2;
      bot=abs(pet.sz-y)>=pet.Th/2;
      n_x=(b[x-1][y]!=0||b[x+1][y]!=0);
      n_y=(b[x][y+1]==1);
      if(m=='o'&&n>0){a[x][y]=1}; // n0+
      if(m=='a'&&n==3&&top&&!n_x&&n_y){a[x][y]=1}; // n3+
      if(m=='b'&&n>=4&&bot){a[x][y]=1}; // n5+
      if(m=='c'&&n==2&&bot){a[x][y]=1}; // n2+
      if(m=='d'&&n==3&&bot&&!n_x&&n_y){a[x][y]=1}; // n3+
      if(m=='e'&&n==4&&bot){a[x][y]=1}; // n4+
      if(m=='f'&&n>=4&&bot){a[x][y]=1}; // n5+
      if(m=='g'&&n_y&&n_x){a[x][y]=1}; // h+
      if(m=='h'&&n_y){a[x][y]=1;a[x][y-1]=1}; // h++
      if(m=='i'){a[x][y]=b[x][y+1];a[13][30]=1;a[14][30]=1;a[17][30]=1;a[18][30]=1}; // feet1
      //if(m=='j'&&n_x&&(y==arm||y==arm+1)){a[x][y]=1}; // arm+
      if(m=='k'&&n_x&&(y==arm||y==arm+1)){a[x][y]=1}; // arm+
      //if(m=='l'){a[x][y]=b[x][y+1];a[12][30]=1;a[13][30]=1;a[18][30]=1;a[19][30]=1}; // feet2
      if(m=='m'&&n_y&&(x==15||x==16)){a[x][y]=1}; // h+M
      if(m=='n'&&n_y&&(x==14||x==15||x==16||x==17)){a[x][y]=1}; // h+MM
      if(m=='p'&&n_y&&(x==12||x==13||x==18||x==19)){a[x][y]=1;a[x][y-1]=1}; // horns
    }
  }
  C=35;
  if(m=='i'){pet.foff--;pet.haslegs=true};
  if(m=='r'){pet.mood+=2};
  if(m=='s'){pet.mood-=2};
  if(m=='t'){pet.c1.levels[0]-=C;pet.c1.levels[1]-=C;};
  if(m=='u'){pet.c1.levels[1]-=C;pet.c1.levels[2]-=C;};
  if(m=='v'){pet.c1.levels[0]-=C;pet.c1.levels[2]-=C;};
  if(m=='w'){pet.c2.levels[0]-=C;pet.c2.levels[1]-=C;};
  if(m=='x'){pet.c2.levels[1]-=C;pet.c2.levels[2]-=C;};
  if(m=='y'){pet.c2.levels[0]-=C;pet.c2.levels[2]-=C;};  
  if(m=='z'){pet.c1.levels[3]-=12;pet.c2.levels[3]-=12};
  pet.mood=constrain(pet.mood,3,8);
  for (let x=0;x<pet.sz;x++){
    arrayCopy(a[x],b[x]);
  }
}

function shrink(){
  if (pet.Th > 2){
    for (let x=1;x<(pet.sz-1);x++){
      for (let y=1;y<(pet.sz-1);y++){
        let n=0;
        for (let i=-1;i<=1;i++){
          for (let j=-1;j<=-1;j++){
            b[x+i][y+j]==0?n++:0
          }
        }
        n>1?a[x][y]=0:0;
      }
    }
    for (let x=0;x<pet.sz;x++){arrayCopy(a[x],b[x])}
    pet.Th=min(a[16].reduce((v1,v2)=>v1+v2),a[17].reduce((v1,v2)=>v1+v2));
    makeOutline()
  }
}

function deleg(){
  if (pet.haslegs){
    for (let x=1;x<(pet.sz-1);x++){
      for (let y=1;y<(pet.sz-1);y++){
        a[x][y]=b[x][y-1];
      }
      arrayCopy(a[x],b[x])
    }
    pet.Th=min(a[16].reduce((v1,v2)=>v1+v2),a[17].reduce((v1,v2)=>v1+v2));
  }
}

function make(){
  a=[...Array(pet.sz)].map((x)=>Array(pet.sz).fill(0));
  b=[...Array(pet.sz)].map((x)=>Array(pet.sz).fill(0));
  a[pet.sz/2-1][pet.sz-3]=1;
  a[pet.sz/2][pet.sz-3]=1;
  b[pet.sz/2-1][pet.sz-3]=1;
  b[pet.sz/2][pet.sz-3]=1;
  pet.c1=color(255,255,255);
  pet.c2=color(255,255,255);
  pet.foff=0; pet.mood=4;
  for (let i=0;i<stage()+pregrow.length-2;i++){grow(pet.grow_steps[i].toLowerCase());}
  makeOutline();
}

function makeEGG(){
  a=[...Array(pet.sz)].map((x) => Array(pet.sz).fill(0));
  for (let i=1;i<pet.sz-1;i++){
    for (let j=1;j<pet.sz-1;j++){
      let x=(pet.sz/2-j+6)*3.5/pet.sz;
      let y=(pet.sz/2-i)*3/pet.sz;
      if ((x**2+(1.6*y*(1.4**x))**2)<.9){a[i][j]=1}
    }
  }
  o=0;
  if (stage()>1){
    for (let i=1;i<pet.sz-1;i++){
      a[i][23+o]=0;
      o=((i%6<=2)?o+1:o-1)
    }
  }
  makeOutline();
}

function makeOutline(){
  c=[...Array(pet.sz)].map((x)=>Array(pet.sz).fill(0));
  for (let x=0;x<pet.sz;x++){
    for (let y=0;y<pet.sz;y++){n=0;
      for (let i=-1;i<=1;i++){
        for (let j=-1;j<=1;j++){
          if ((i+x)>=0&&(i+x)<pet.sz&&(j+y)>=0&&(j+y)<pet.sz){
            if (a[x+i][y]==1||a[x][y+j]==1){
              n++;
            }
          }
        }
      }
      if (a[x][y]==0){c[x][y]=n>0?1:NaN;}
    }
  }
}

function makeFace(x,sleep=false,walk=false){
  mpos=pet.sz-ceil(map(pet.mood,0,10,1,pet.Th-3));
  // eyes
  LEx = pet.sz/2-2+x;
  REx = pet.sz/2+1+x;
  Ey = pet.foff+(sleep?pet.sz-2:mpos-1);
  // for (let i=0;i<(walk?0:3);i++){
  //   if (c[LEx-1][Ey]!=0||c[LEx][Ey-1]!=0||c[LEx-1][Ey-1]!=0){
  //     Ey++;
  //   }
  // }
  c[LEx][Ey]=1;
  c[REx][Ey]=1;
  // mouth
  if (!sleep){ 
    c[LEx+1][Ey+2]=1;
    c[REx-1][Ey+2]=1;
  }
}

function addBubble(w,idx){
  for (let i=0;i<w+1;i++){
    for (let j=0;j<w+1;j++){
      D=sqrt((i-w/2)**2+(j-w/2)**2);
      if (round(D)==round(w/2)){c[i+17][j+20]=1}
      else if (round(D)<w/2){c[i+17][j+20]=2}
    }
  }
}

function gen_pet(){
  colorMode(RGB);
  pet.sz=pet.w;
  a=[...Array((pet.sz))].map((x)=>Array(pet.sz).fill(0));
  b=[...Array(pet.sz)].map((x)=>Array(pet.sz).fill(0));
  c=[...Array(pet.sz)].map((x)=>Array(pet.sz).fill(0));
  a[pet.sz/2-1][pet.sz/2]=1;a[pet.sz/2][pet.sz/2]=1;
  b[pet.sz/2-1][pet.sz/2]=1;b[pet.sz/2][pet.sz/2]=1;
  pet.cdata.loadPixels();

  // idle 1
  make(); makeFace(0); ddraw(0);
  
  // idle 2
  make(); shrink(); makeFace(0); ddraw(1);
  
  // move R
  make(); deleg(); shrink(); grow(6); makeOutline(); makeFace(-1,false,true); ddraw(2);
  
  // move L
  make(); deleg(); shrink(); grow(6); makeOutline(); makeFace(1,false,true); ddraw(3);
  
  // sleep 1
  make(); deleg(); shrink(); shrink(); makeOutline(); makeFace(0,true); addBubble(4,4); ddraw(4);
  
  // sleep 2
  make(); deleg(); shrink(); shrink(); shrink(); makeOutline(); makeFace(0,true); addBubble(5,5); ddraw(5);
  
  // sleep 3
  make(); deleg(); shrink(); shrink(); shrink(); shrink(); makeOutline(); makeFace(0,true); addBubble(6,6); ddraw(6);

  // egg
  makeEGG(); ddraw(7); pet.cdata.updatePixels();

  // speed
  pet.speed = constrain(round(map(pet.wgt,100,250,5,1)),2,5);
}

function update(){
  bkg.cdata=make_sky();
  tree = makeTree();
  flora = make_flora();
  flora1.cdata=flora.F1;
  flora2.cdata=flora.F2;
  gen_pet();
  st(function(){update()},1e4);
}

function keyPressed(){
  if (key=='ArrowUp'){
    cam.w=constrain(cam.w+5,35,101);
    cam.cdata = makeCamFrame();
  }
  if (key=='ArrowDown'){
    cam.w=constrain(cam.w-5,35,101);
    cam.cdata = makeCamFrame();
  }
}

function tezname(){
  prefix=['tez','hic','ciph','mint','hash','zan','yaz','gen','rand','smol','fung','tok','jav','ite','flok','gan','blok','nunc','got','bot','cryp','flip','burn','flor','non','pok','pix'];
  suffix=['chi','shi','ee','y','oo','oi'];
  return randa(prefix)+randa(['a','i','o','u'])+randa(prefix)+randa(suffix)
}
