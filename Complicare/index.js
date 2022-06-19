//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
// Complicare                                                                                                  //
// Author: Nic Thibodeaux (FXH: fxhash.xyz/u/nicthib, HEN: hicetnunc.art/nicthib, Twitter: @nicthibs)          \\
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.       //
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/.                       \\
// Acknowledgements: Thanks to dcarcher for feedback and constructive criticism!                               //
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\

// Mint 0: ooBZQpUVZpP5Vq9x3ejAYGLRDMoqtutMYHZgGkpYjQkxZRLFM55

perms = [
[[0,0,1,1],[0,1,1,1],[1,0,1,1],[1,1,1,1],[0,2,1,1],[1,2,1,1]],
[[0,0,2,1],[0,1,1,1],[1,1,1,1],[0,2,1,1],[1,2,1,1]],
[[0,0,1,1],[1,0,1,1],[0,1,2,1],[0,2,1,1],[1,2,1,1]],
[[0,0,1,2],[1,0,1,1],[1,1,1,1],[0,2,1,1],[1,2,1,1]],
[[0,0,2,1],[0,1,2,1],[0,2,1,1],[1,2,1,1]],
[[0,0,1,2],[1,0,1,2],[0,2,1,1],[1,2,1,1]],
[[0,0,2,1],[0,1,1,1],[1,1,1,1],[0,2,2,1]],
[[0,0,1,2],[1,0,1,1],[0,2,1,1],[1,1,1,2]],
[[0,0,2,1],[0,1,1,2],[1,1,1,1],[1,2,1,1]],
[[0,0,1,2],[1,0,1,1],[1,1,1,1],[0,2,2,1]],
[[0,0,1,3],[1,0,1,2],[1,2,1,1]],
[[0,0,1,2],[1,0,1,2],[0,2,2,1]],
[[0,0,2,1],[0,1,2,1],[0,2,2,1]],
[[0,0,2,2],[0,2,1,1],[1,2,1,1]],
[[0,0,2,2],[0,2,2,1]],
[[0,0,1,3],[1,0,1,3]],
[[0,0,2,3]]
];

PS = [
[[34,49,29],[48,69,41],[55,79,47]],
[[62,65,80],[41,42,50]],
[[75,8,18],[50,6,12],[25,2,6]],
[[10,50,50],[65,2,40]],
[[10,10,50],[50,10,10],[75,75,10]],
[[0,0,0],[30,30,30]]
];

PN = ['Myrtle','Slate','Rosewood','Tyrian','Dark Mondrian','Black'];
function setup() {
    clear();
    q=min(windowWidth*1.5, windowHeight);
    b=.02*q; q=q*(1-b*2/q);
    createCanvas(q/1.5+b*2, q+b*2);
    pixelDensity(2);
    fcol=color(225,225,220);
    BGa=r()*TAU;
    strokeWeight(q/667);

    Pd=r(2)+4;
    wst=r([50,75,100]);
    t=-q*.005;
    Ln=floor(r(perms.length));
    flipr=r();
    Pn=floor(r()*PS.length);
    P=PS[Pn];
    cmode=round(r());
    nsr=1/3+2*r()/3;
    totc=0;

    com=perms[Ln];
    com=flipr<1/3?flip(com,1):flipr<2/3?flip(com,0):com;
    cv=[];
    for (let i=0;i<com.length;i++){
        cv[i]=createcv(com[i]);
        cv[i].i=i;
        msc(cv[i]);
    }

   window.$fxhashFeatures = {
        "Layout": Ln,
        "Palette": PN[Pn],
        "Palette Mode": cmode==0?"A":"B",
        "Curves": totc
    }

    background(fcol);
    PT(BGa);

    for (let i=0;i<cv.length;i++){
        db(cv[i]);
    }
}

function createcv(p){
    x=p[0]; y=p[1]; w=p[2]; h=p[3];
    a=w*h;
    wp=q*w/3-b*2;
    hp=q*h/3-b*2;
    pts=[];
    for (i=0;i<=w+1;i++){
        for (j=0;j<=h+1;j++){
            pts = append(pts,[map(i,0,w+1,0,q*w/3-b*2),map(j,0,h+1,0,q*h/3-b*2)]);
        }
    }
    return {
        x: q*x/3+b,
        y: q*y/3+b,
        w: wp,
        h: hp,
        midd: fxrl([1,1/3]),
        gr: r(2)+1,
        pts: pts,
        polys: [gnp(pts,[],[],1,wp*hp*nsr)],
        cmode: cmode,
        nc: a==1?(r()<.666?1:2):fxrl([1,2,3])
    } 
}

function msc(c){
    pts = c.pts;
    npts = pts.length;
    c.totn=0;
    for (let i=1;i<c.nc;i++){
      c.polys = append(c.polys,gnp(c.pts,c.polys[i-1][0],c.polys[i-1][1],.6,c.w*c.h*nsr));
    }
    totc+=c.polys.length;
}

function gnp(pts,lpt1,lpt2,sch,a){
    pa=0;
    while (pa<1||pa>a){
        R=r();
        poly=[R<sch?fxrl(pts):lpt1,R<sch?fxrl(pts):lpt2,fxrl(pts),fxrl(pts)];
        poly=r()<.5?poly:cp(poly);
        pa=cPA(poly);
        j++;
    }
    return poly
}

function db(c){
    push();
    translate(c.x+b,c.y+b);
    fill(fcol);noStroke();
    rect(t,t,c.w-t*2,c.h-t*2);
    for (let i=0;i<c.nc;i++){
        scol=c.cmode==0?P[c.i%P.length]:P[(i+c.i)%P.length];
        hs(c.polys[i],c.gr*50,c.midd);
    }
    scol=[0,0,0];
    Pline(t,t,c.w-t,t);
    Pline(t,t,t,c.h-t);
    Pline(c.w-t,t,c.w-t,c.h-t);
    Pline(t,c.h-t,c.w-t,c.h-t);
    pop();
}

function hs(p,n,midd){
    p1=p[0];p2=p[1];p3=p[2];p4=p[3];
    D=max([d(p1,p3),d(p2,p4)]);
    for (let i=0;i<=n;i++){
        x1=map(i/n,0,1,p1[0],p4[0])
        x2=map(i/n,0,1,p2[0],p3[0])
        y1=map(i/n,0,1,p1[1],p4[1])
        y2=map(i/n,0,1,p2[1],p3[1])
        Pline(x1,y1,x2,y2,(i%2==0?1:midd));
    }
}

function Pline(x1,y1,x2,y2,D=1){
    ld=d([x1,y1],[x2,y2]);
    n=ld*Pd*D;
    for(let i=0;i<=n;i++){
        R=r();
        stroke(scol[0],scol[1],scol[2],r()*128);
        point(map(R,0,1,x1,x2),map(R,0,1,y1,y2))
    }
}

function cp(p){
    if (intersect(p[0],p[1],p[2],p[3])){p0=p[0];p[0]=p[2];p[2]=p0;}
    if (intersect(p[0],p[3],p[1],p[2])){p0=p[0];p[0]=p[1];p[1]=p0;}
    return p
}

function d(p1,p2){
    return sqrt((p1[0]-p2[0])**2+(p1[1]-p2[1])**2)
}

function r(r=1){
    return fxrand()*r;
}

function PT(hr){
    lL=q/250;
    for (i=0;i<(q*100);i++){
        px=(q+3*b)*r()/1.5; py=(q+2*b)*r();
        n=noise(px/q,py/q)*10;
        stroke(0,n);
        line(px,py,px+lL*sin(hr)*(i%2==0&&hr>PI?1:-1),py+lL*cos(hr));
    }
}

function flip(c,d){
    for (let i=0;i<c.length;i++){
        if (d==0){
            c[i][d]=c[i][d+2]==1?1-c[i][d]:c[i][d];
        }
        else if (d==1){
            c[i][d]=c[i][d+2]==1?2-c[i][d]:c[i][d+2]==2?c[i][d]=1-c[i][d]:c[i][d];
        }
    }
    return c
}

function cPA(v) {
    var t=0;
    for (var i=0,l=v.length;i<l;i++) {
        var aX=v[i][0];
        var aY=v[i==v.length-1?0:i+1][1];
        var sX=v[i==v.length-1?0:i+1][0];
        var sY=v[i][1];
        t+=(aX*aY/2);
        t-=(sX*sY/2);
    }
    return abs(t);
}

function intersect(A,B,C,D){
    return (ccw(A,C,D)!=ccw(B,C,D))&&(ccw(A,B,C)!=ccw(A,B,D))
}

function ccw(A,B,C){
    return (C[1]-A[1])*(B[0]-A[0])>(B[1]-A[1])*(C[0]-A[0])
}

function r_l(l,n){
    o=[];
    for (let i=0;i<n;i++){
        o[i]=r(l);
    }
    return o
}

function fxrl(l){
    return l[floor(r(l.length))]
}