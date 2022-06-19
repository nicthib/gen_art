//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
// partition()                                                                                                 \\
// Author: Nic Thibodeaux (FXH: fxhash.xyz/u/nicthib, HEN: hicetnunc.art/nicthib, Twitter: @nicthibs)          \\
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.       \\
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/.                       \\
// Acknowledgements: Thanks to cosimopiu, DaHawaiian, dcarcher, patchitchat, pedrofe, and Seventeenblack.      \\
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
function fxrand_range(x,y){return fxrand()*(y-x)+x};
function fxrand_list(l){return l[floor(fxrand()*l.length)]};
svg=false;skip=false;fi=8;B=.02;zoom=1;
function preload(){
  p_mean=4;
  p_ran=fxrand_range(0,6);
  frag_chance=fxrand_list([0,.02,.04,.06,.08]);
  org=fxrand();
  sq_rat=10**fxrand_range(-.4,.4);
  sq_ran=fxrand()-.5;
  u_score=round((p_ran/6+frag_chance/.08+org+sq_ran+.5)*2);
  scol=color(200);fcol=color(0);rcol=(fxrand()<.08)?fxrand_list([.001,.01]):0;
  offset = new p5.Vector(0, 0);
  poffset = new p5.Vector(0, 0);
}
function setup(){
  pixelDensity(1);
  iFrame=0;
  w=windowWidth;h=windowHeight;
  createCanvas(w,h);
  go();window.$fxhashFeatures={"entropy":u_score,"partitions":t_p,"fill probability":rcol*100+"%"};
}
function go(){
  d=true;iter=0;a=[];
  b=[{r: [B,B,1-2*B,1-2*B], frag: false, d: d, iter:0}];
  a[0]=partition(b[0],(floor(4-fxrand())));
  b=concat(b,a[0]);
  iter=1;
  while (iter<8){
    let i=0;
    a[iter]=[]
    while (i<a[iter-1].length){
      n_part=fxrand()<frag_chance?1:floor(fxrand_range(p_mean-p_ran,p_mean+p_ran));
      a[iter]=concat(a[iter],partition(a[iter-1][i],n_part)); 
      i++;
    }
    b=concat(b,a[iter]);
    iter++;
  }
  t_p=b.length;
  t=millis();
}
function partition(sq,n){
  if (n<=1||sq.frag){sq2=sq;}
  else {
    sq2=[];spl=[];
    d=(fxrand()>sq_ran)?(sq.r[2]>(sq.r[3]*sq_rat)):fxrand()>.5?true:false;
    for (k=0;k<n;k++){
      r2=(k+fxrand()*org)/n;
      spl[k]=round(r2%1,2);
      if (fxrand()<frag_chance&&iter>0){spl[k]=spl[k]*(sq.r[0]);}
      if (fxrand()<frag_chance){spl[k]=spl[k]*(sq.r[1]);}
    }
    spl=sort(spl);spl[0]=0;spl[k]=1;
    for (k=0; k<spl.length-1; k++){
      let sz=spl[k+1]-spl[k];
      let p=spl[k];
      sq2[k]={r:[d?sq.r[0]+p*sq.r[2]:sq.r[0],d?sq.r[1]:sq.r[1]+p*sq.r[3],d?sz*sq.r[2]:sq.r[2],d?sq.r[3]:sz*sq.r[3]],
        frag:iter<4?fxrand()<frag_chance:0,iter:iter,d:d,filled:fxrand()<rcol}
    }
  }
  return sq2
}
function draw(){
  clear();background(0);
  offset.x=constrain(offset.x,-w*zoom/2,w*zoom/2)
  offset.y=constrain(offset.y,-h*zoom/2,h*zoom/2)
  translate(width/2,height/2);
  scale(zoom);
  translate(offset.x/zoom,offset.y/zoom);
  translate(-width/2,-height/2);
  k=0;
  for (x=0;x<fi;x++){
    for (y=0;y<a[x].length;y++){
      aa=a[x][y];sw=max(1-x/5,.2);
      push();translate(aa.r[0]*w,aa.r[1]*h)
      if (aa.filled){fill(scol);stroke(scol);rect(0,0,aa.r[2]*w,aa.r[3]*h)}
      else {stroke(scol);strokeWeight(sw);noFill();rect(0,0,aa.r[2]*w,aa.r[3]*h)}
      pop();k++;
      if (k>=max(iFrame,t_p*skip)){break}
    }
  }
  iFrame+=x;
}
function keyPressed(){
  if (key>0){fi=constrain(int(key)-1,0,9);skip=true;}
  if (key==' '){iFrame=1;skip=false;iter=1;};
  if (key=='s'){createCanvas(w,h,SVG);draw();save('partition.svg');noLoop();}
  if (key=='d'){createCanvas(w,h);draw();save('partition.png');}
}
function mousePressed() {
  mouse = new p5.Vector(mouseX, mouseY);
  poffset.set(offset);
}
function mouseDragged() {
  offset.x = mouseX - mouse.x + poffset.x;
  offset.y = mouseY - mouse.y + poffset.y;
}
function mouseWheel(){
  zoom = event.delta>0?zoom-.4:zoom+.4;
  zoom = constrain(zoom,1,12);
  if (zoom == 1){offset.x=0; offset.y=0;}
}