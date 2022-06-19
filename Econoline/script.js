// Initialize variables
console.log(fxhash);
let doResizeCanvas = false;
let traits;
const NONE = -1;
random = fxrand();
function randomize() {
	resetSeed();
	traits = [
		{
			id: NONE,//wpick([1]),
			label: "Background",
			prefix: "BKG",
			tag: ["1","2","3","4","5","6"],
			img: null,
		},{
			id: wpick([1,1,1,1,1,1]),
			label: "Big Cargo",
			prefix: "BCARGO",
			tag: ["1","2","3","4","5","6"],
			img: null,
		}, {
			id: wpick([1,1,1,1,1,1,1,1]),
			label: "Small Cargo",
			prefix: "SCARGO",
			tag: ["1","2","3","4","5","6","7","8"],
			img: null,
		},{
			id: wpick([1]),
			label: "Body",
			prefix: "BODY",
			tag: ["1"],
			img: null,
		},{
			id: wpick([1,1,1,1,1,1,1,1,1]),
			label: "Detail",
			prefix: "DETAIL",
			tag: ["1","2","3","4","5","6","7","8","9"],
			img: null,
		},{
			id: wpick([1,1,1,1,1,1,1]),
			label: "Passenger",
			prefix: "PASS",
			tag: ["1","2","3","4","5","6","7"],
			img: null,
		},{
			id: wpick([1,1,1,1,1,1]),
			label: "Tires",
			prefix: "TIRES",
			tag: ["1","2","3","4","5","6"],
			img: null,
		},
	];
}

// Feature strings for metadata
window.$fxhashFeatures = {}

// Preload pngs we need
function preload() {
	randomize();
	traits.forEach(trait => {
		let traitValue = trait.id != NONE ? trait.tag[trait.id] : "None";
		window.$fxhashFeatures[trait.label] = traitValue;
	});
	traits.forEach(trait => {
		if (trait.id !== NONE) {
			trait.img = loadImage(`assets/${trait.prefix}_${trait.id+1}.png`);
		};
	});
	console.log(JSON.stringify(window.$fxhashFeatures));
}

// Setup, matching canvas size
function setup() {
	let size = getSize();
	createCanvas(size, size);
}
//

function resetSeed() {
	random = fxrand = sfc32(...hashes);
}

// Draw image layer by layer
function draw() {
	resetSeed();
	clear();
	let size = getSize();
	traits.forEach(trait => {
		if (trait.id !== NONE) {
			let layer = createGraphics(size,size);
			layer.image(trait.img, 0, 0, size, size);
			image(layer, 0, 0, size, size);
			layer.remove();
		}
	});
	let c = get(0, 0);
	document.body.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`;
	noLoop();
}

function getSize() { return min(windowWidth, windowHeight); }
function windowResized(){
	let size = getSize();
	resizeCanvas(size, size);
	loop();
}


function wpick(w) {
  let w_sum = 0;
  for (i = 0; i < w.length; i++) {
    w_sum += w[i];
  }
  for (i = 0; i < w.length; i++) {
    w[i] = w[i] / w_sum;
  }
  csum = [];
  tsum = 0;
  for (i = 0; i < w.length; i++) {
    tsum += w[i];csum[i] = tsum;
  }
  droll = random();
  for (i = 0; i < csum.length; i++) {
    if (droll <= csum[i]) {
      return i
    }
  }
}
