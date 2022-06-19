doResizeCanvas = false
maxneighbors = 4;
minneighbors = 1;
cellSize = 6;
dead = 0;

// Defining features
R = fxrand() < 0.2;
G = fxrand() < 0.2;
B = fxrand() < 0.2;
rainbow = (fxrand() < 0.02);
connect_equal = fxrand() < 0.333;
pixon = (fxrand() < 0.333 && !connect_equal);
n_coms = 4;
com1 = [414,380,409,399,165,239,470,236,510,467,235,432,372,359,428,505,489,405,497,395,509,511,423,254,471,426,301,372,371,431,382,496,455,430,405]
coms = [];
coms[0] = com1[parseInt(fxrand()*com1.length)];
coms[1] = com1[parseInt(fxrand()*com1.length)];
coms[2] = com1[parseInt(fxrand()*com1.length)];
coms[3] = com1[parseInt(fxrand()*com1.length)];

// Theme
function getFeatureC() {
  if (rainbow) return 'Rainbow'
  if (!R&&G&&B) return 'Red'
  if (R&&!G&&B) return 'Green'
  if (R&&G&&!B) return 'Blue'
  if (!R&&!G&&B) return 'Yellow'
  if (!R&&G&&!B) return 'Magenta'
  if (R&&!G&&!B) return 'Cyan'
  if (!R&&!G&&!B) return 'White'
  if (R&&G&&B) return 'Black'
}

function getFeaturePixelMode() {
  if (connect_equal) return "Blended"
  if (!connect_equal && pixon) return "Seperated"
  else return "Joined"
}

function getFeatureStep1() {
  return coms[0];
}

function getFeatureStep2() {
  return coms[1];
}

function getFeatureStep3() {
  return coms[2];
}

function getFeatureStep4() {
  return coms[3];
}

window.$fxhashFeatures = {
  "Color": getFeatureC(),
  "Pixel Mode": getFeaturePixelMode(),
  "Step 1": getFeatureStep1(),
  "Step 2": getFeatureStep2(),
  "Step 3": getFeatureStep3(),
  "Step 4": getFeatureStep4(),
}

function setup() {
  noLoop();
  init();
}

function init() {
  icom = 0;
  szx = int(windowWidth);
  szy = int(windowHeight);
  szx = szx-szx%(cellSize*2);
  szy = szy-szy%(cellSize*2);
  sx = szx / cellSize;
  sy = szy / cellSize;
  createCanvas(szx,szy);
  //background(0);
  frameRate(30);
  if (R&&G&&B) {
    isblack = true;
  }
  else {
    isblack = false;
  }
  alive = 255;
  iFrame = 0;
  n_array = int(("000000000" + (coms[icom] >>> 0).toString(2)).slice(-9).split(""));
  colorrate = cellSize;
  midptx = sx/2;
  midpty = sy/2;
  pause = false;
  cells = [...Array(sx)].map((x) => Array(sy).fill(0));
  cellsBuffer = [...Array(sx)].map((x) => Array(sy).fill(0));
  liven = 2
  for (let x = -3; x < 3; x++) {
    for (let y = -3; y < 3; y++) {
      cells[midptx + x][midpty + y] = 1;
    }
  }
  c = connect_equal?cellSize/8:0;
  if (pixon) {
    stroke(isblack?255:0)
  }
  else {
    noStroke()
  }
  loop();
}

function draw() {
  if(doResizeCanvas) {
    resizeCanvas(szx,szy)
    init()
    doResizeCanvas = false
    return
  }
  anychanged = false
  alldead = true

  for (let x = 0; x < sx; x++) {
    for (let y = 0; y < sy; y++) {
      if (cells[x][y] > 0 && !cellsBuffer[x][y]) {
        fillc = color(alive*(1-R),alive*(1-G),alive*(1-B))
        if (connect_equal) {
          fillc = color(255*(1-R),255*(1-G),255*(1-B))
        }
        if (rainbow) {
          fillc = color(255*(iFrame%3==0),255*(iFrame%3==1),255*(iFrame%3==2))
        }
        if (isblack){
          fillc = color(0);
        }

        // square vertices
        i1 = x*cellSize+c
        j1 = y*cellSize+c
        i2 = x*cellSize+c
        j2 = y*cellSize+cellSize-c
        i3 = x*cellSize+cellSize-c
        j3 = y*cellSize+cellSize-c
        i4 = x*cellSize+cellSize-c
        j4 = y*cellSize+c
        bordn = 1
        if (connect_equal){
          if (x > 0 && (abs(cells[x][y] - cells[x-1][y]) < bordn)){
            i1-=c
            i2-=c
          }

          if (y < sy){
            if (abs(cells[x][y] - cells[x][y+1]) < bordn) {
              j2+=c
              j3+=c
            }
          }

          if (x < sx-1){
            if (abs(cells[x][y] - cells[x+1][y]) < bordn) {
              i3+=c
              i4+=c
            }
          }

          if (y > 0 && (abs(cells[x][y] - cells[x][y-1]) < bordn)){
            j4-=c
            j1-=c
          }
        }
        
        fill(fillc)
        beginShape()
        vertex(i1,j1)
        vertex(i2,j2)
        vertex(i3,j3)
        vertex(i4,j4)
        endShape(CLOSE);   
      } 
        if ((cells[x][y] == 0 && cellsBuffer[x][y] > 0 && iFrame) ||
        (cells[x][y] == 0 && !iFrame)
      ) {
        fill(isblack?255:0);
        rect(x * cellSize - c, y * cellSize - c, cellSize + c*2, cellSize + c*2);
      }
      if (cells[x][y] > 0 != cellsBuffer[x][y] > 0) {
        anychanged = true
      }
      if (cells[x][y] > 0){
        alldead = false
      }
    }
  }
  iteration();
}

function iteration() {
  if (alive <= 0) {
    alive = 0;
  }
  alive -= colorrate;
  
  for (let x = 0; x < szx / cellSize; x++) {
    for (let y = 0; y < szy / cellSize; y++) {
      cellsBuffer[x][y] = cells[x][y];
    }
  }

  for (let x = 0; x < szx / cellSize; x++) {
    for (let y = 0; y < szy / cellSize; y++) {
      neighbors = 0;
      for (let xx = -1; xx <= 1; xx++) {
        for (let yy = -1; yy <= 1; yy++) {
          let xxxx = xx;
          let yyyy = yy;
          if (x < midptx) {
            xxxx = -xx;
          }
          if (y < midpty) {
            yyyy = -yy;
          }
          let xxx = xxxx + x;
          let yyy = yyyy + y;
          if (
            xxx >= 0 &&
            xxx < szx / cellSize &&
            yyy >= 0 &&
            yyy < szy / cellSize
          ) {
            if (!(xxx == x && yyy == y)) {
              if (
                cellsBuffer[xxx][yyy] > 0 &&
                n_array[xx + 1 + (yy + 1) * 3] > 0
              ) {
                neighbors++;
              }
            }
          }
        }
      }
      if (cellsBuffer[x][y] > 0) {
        if (neighbors < minneighbors || neighbors > maxneighbors) {
          cells[x][y] = 0;
        }
      } else {
        if (neighbors == liven) {
          cells[x][y] = alive;
        }
      }
    }
  }
  
  // if (alldead){
  //   init()
  // }
  if (!anychanged && icom < n_coms){
    n_array = int(("000000000" + (coms[icom] >>> 0).toString(2)).slice(-9).split(""));
    alive = 255
    iFrame = 0
    icom++;
  }
  iFrame++;
}

function windowResized() {
  doResizeCanvas = true
}

function mouseClicked(){
  init();
}