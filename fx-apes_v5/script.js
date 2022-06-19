// Initialize variables
console.log(fxhash);
let doResizeCanvas = false;
let traits;
const NONE = -1;

random = fxrand();
apeHash = 'onm4y4msz4gVeYpngGGjfYTQf4U3Aw5fYvfsKVAGAykWUZsXHyj';
function randomize() {
	resetSeed();
	traits = [
		{
			id: wpick([10,6,4,12,12,12,4,12,12,2,14]),
			allowHueShift: [10],
			label: "Background",
			prefix: "BKG",
			tag: ["8082's Blue","Skull Grey","Hashed Sun","Orange","Pink","New Punk Violet","Mei","Red","Green","Rainbow","Gradient"],
			img: null,
		}, {
			id: wpick([10,18,3,6,2,6,6,10,13,13,13]),
			allowHueShift: [],
			label: "Fur",
			prefix: "FUR",
			tag: ["Black","Brown","Concrete","Giraffe","RGB","Zombie","White","8082's Fur","Red","Pink","Tan"],
			img: null,
		}, {
			// 15% chance no clothes
			id: random()<.85?wpick([4,2,7,4,2,4,4,2,3,4,4,1,4,3,9,1,4,2,5,4,4,4,4]):NONE,
			allowHueShift: [3,6,19,10,16],
			label: "Clothes",
			prefix: "CLOTH",
			tag:["Conway's Coat","8082's Stunt Jacket","ASCII SMOLSKULL Jacket","Thrash Metal Denim","Bulletproof Vest","Logo Red Tee","Samurai","Space Conqueror","Metawanderer Shirt","Dazzle Hoodie Jacket","Jim Gym's Sweatshirt","King's Cloak","Lisa's Sweater","Golden Bomber","SMOLSKULL","Monkey Suit","XTZ Jersey","Vampire Cape","Isofrag Hoodie Jacket","Landstriped Tee","I <3 p5.js Tee","[waiting to be signed]","Logo White Tee"],
			img: null,
		}, {
			id: wpick([9,13,5,13,13,17,5,5,9,2,9]),
			allowHueShift: [],
			label: "Face",
			prefix: "FACE",
			tag: ["Wow","Friendly","Worried","Half Grin","Happy","Properly Bored","Grin","Sick","Angry","Cigar","Surprised"],
			img: null,
		}, {
			// 65% chance no eyewear
			id: random()<.35?wpick([4,3,5,1.5,3,4,3,6,3,1,4]):NONE,
			allowHueShift: [6,8,9],
			label: "Eyewear",
			prefix: "EYE",
			tag: ["3D Glasses","8082's Blindfold","Aviators","Cyber Eye","Holo Glasses","Glyph Shades","Necromancer","Gradient Glasses","Noise Glasses","Red Laser Eyes","Minting Spectacles"],
			img: null,
		}, {
			// 25% chance no hat
			id: random()<.75?wpick([10,13,1,4,5,5,5,2.5,13,15,1.5]):NONE,
			allowHueShift: [],
			label: "Hat",
			prefix: "HAT",
			tag: ["8082's Fez","Beanie","Captain RGB","Red FX Logo","Halo","Hot Dog Hat","Black FX Logo","Carat Crown","VR","Smolskull","God of Gardens"],
			img: null,
		}, {
			// 70% chance no earring
			id: random()<.3?wpick([3,5,8,1.5,1.5,8,5]):NONE,
			allowHueShift: [],
			label: "Earring",
			prefix: "EAR",
			tag: ["Carat pin","DOOMSKULL Gold","DOOMSKULL Silver","8082's Cross","Afton Pin","XTZ Gold Pin","Punevyr's Pin"],
			img: null,
		},
	];
	// reroll if 3d glasses + beanie
	if (traits[4].id==0 && traits[5].id==1){
		traits[5].id = wpick([10,0,1,4,5,5,5,2.5,13,15,1.5]);
	}
}

// Feature strings for metadata
window.$fxhashFeatures = {}

function preload(){
	data = loadJSON('hashes.json');
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
	data = data['data'].reverse()
	let size = getSize();
	createCanvas(size, size);

	// ape selector
	inp = createInput();
  inp.position(0, 0);
  inp.size(100);
  inp.style('color', color(0));
  button1 = createButton('REFRESH');
  button1.position(inp.x + inp.width, 0);
  button1.mousePressed(updateApe);
  button1.style('color', color(0));
  sel = createSelect('Trait');
  sel.position(0, inp.y+30);
  sel.size(100)
  sel.option('Background');
  sel.option('Fur');
  sel.option('Clothes');
  sel.option('Face');
  sel.option('Eyewear');
  sel.option('Hat');
  sel.option('Earring');
  sel.style('color', color(0));

  button2 = createFileInput(handleFile);
  button2.position(sel.x + sel.width, sel.y);
  button2.style('color', color(0));
}
//

function updateApe(){
	apeHash = data[str(inp.value()-1)].generationHash;
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

function handleFile(file){
	img = loadImage(file.data, '');
	traits.forEach(trait => {
		if (trait.label == sel.value()) {
			trait.img = img;
		};
	});
}

function resetSeed() {
	hashes = apeHash.slice(2).match(regex).map(h => b58dec(h))
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
			if (trait.prefix == 'HAT' && trait.id == 9) {
				if (random() > 0) drawSmolskullHat(layer, size);
			}
			if (trait.prefix == 'CLOTH' && (trait.id == 14)) {
				drawSmolskullShirt(layer, size);
			}
			if (trait.allowHueShift.includes(trait.id + 1)) {
				let layerContext = layer.canvas.getContext('2d');
				if (random() > 0.1 || trait.prefix != 'CLOTH') {
					hueShift(layerContext, (range(0, 20) | 0) * 18);
				} else {
					desaturate(layerContext);
				}
			}
			
			if (trait.prefix == 'BKG' && trait.id == 10) {
				drawGradient(layer, size);
			} else {
				image(layer, 0, 0, size, size);
			}
			layer.remove();
		}
	});
	let c = get(0, 0);
	document.body.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`;
}

function drawGradient(layer, size) {
	let t = size/1501;
	
	var s = 12;
	let graphics = createGraphics(s,s);
	
	let gradientColors = ["#a2e5f4", "#50c781","#555555","#ea8627","#e06eb8","#926cb6", "#9b2e2e"];
	let gradient = graphics.drawingContext.createLinearGradient(0, 0, 0, s);
	
	let colors = [];
	colors.push(pick(gradientColors, true));
	colors.push("#151110");
	colors.push(pick(gradientColors, true));
	
	if (random() > 0.8) {
		gradient.addColorStop(0, colors[2]);
		gradient.addColorStop(0.5, colors[1]);
		gradient.addColorStop(1,  colors[0]);
	} else if (random() > 1/2) {
		gradient.addColorStop(0, colors[2]);
		gradient.addColorStop(1,  colors[1]);
	} else {
		gradient.addColorStop(0, colors[1]);
		gradient.addColorStop(1,  colors[2]);
	}
	graphics.drawingContext.fillStyle = gradient;
	graphics.drawingContext.fillRect(0, 0, s, s);
	
	drawingContext.imageSmoothingEnabled = false;
	image(graphics, 0, 0, size, size);
	drawingContext.imageSmoothingEnabled = true;
	graphics.remove();
	
}

// special smolskull hat - adds stuff on top of hat/2.png
function drawSmolskullHat(layer, size) {
	let t = size/1501;
	
	// clear circle
	layer.noStroke();
	layer.fill('#101011');
	layer.circle(802*t, 302*t, 130*t);
	
	let smolskullSize = 17*7*t;
	let smolskull = getSmollskull(smolskullSize);
	layer.push();
	layer.imageMode(CENTER);
	layer.rotate(-0.2);
	layer.shearX(0.05);
	layer.image(smolskull,705*t, 455*t);
	layer.pop();
	smolskull.remove();
}

// special smolskull shirt - adds stuff on top of clothes/5.png
function drawSmolskullShirt(layer, size) {
	let t = size/1501;
	let smolskullSize = 55*7*t;
	let smolskull = getSmollskull(smolskullSize, '#FFF');
	layer.push();
	layer.shearY(-0.04);
	layer.rotate(-0.03);
	layer.blendMode(OVERLAY);
	layer.imageMode(CENTER);
	layer.image(smolskull,725*t, 1325*t);
	layer.pop();
	smolskull.remove();
}

/*
SMOLSKULL - Generative art by Mark Knol 
https://twitter.com/mknol
https://objkt.com/profile/markknol
*/
const RED = "#cd202c";
const BLUE = "#347fcf";
function getSmollskull(size, skin = '#c3b6ba') {
	const s = 11;
	let graphics = createGraphics(s,s);
	graphics.drawingContext.imageSmoothingEnabled = false;
	graphics.noStroke();
	let faceProps = {
		eyeHeight: pick([0,1,2,3]),
		mouthType: pick([0,1]),
		mouthSize: pick([0,1,2,3]),
	}
	graphics.fill(skin);
	graphics.rect(0,0,s,s);
	let eyeY = pick([1,2,3]);
	if (faceProps.mouthSize == 2) eyeY = 1;
	// eyes
	if (random() > 0.01) {
		graphics.drawingContext.clearRect(2, eyeY, 3, faceProps.eyeHeight + 2);
		graphics.drawingContext.clearRect(6, eyeY, 3, faceProps.eyeHeight + 2);
	} else {
		graphics.fill(RED);
		graphics.rect(2, eyeY, 3, faceProps.eyeHeight + 2);
		graphics.fill(BLUE);
		graphics.rect(6, eyeY, 3, faceProps.eyeHeight + 2);
	}
	// mouth
	mouthY = (eyeY+1) + faceProps.eyeHeight + pick([2,3]);
	if (faceProps.mouthSize == 2) mouthY = (eyeY+1) + faceProps.eyeHeight + 2;
	if (faceProps.mouthType == 0) {	
		if (random() > 0.5) {
			graphics.drawingContext.clearRect(3, mouthY, 5, (faceProps.mouthSize+1)*2);
		} else {
			graphics.drawingContext.clearRect(4, mouthY, 3, (faceProps.mouthSize+1)*2);
		}
	} else {
		graphics.drawingContext.clearRect(3, mouthY, 1, (faceProps.mouthSize+1)*2);
		graphics.drawingContext.clearRect(5, mouthY, 1, (faceProps.mouthSize+1)*2);
		graphics.drawingContext.clearRect(7, mouthY, 1, (faceProps.mouthSize+1)*2);
	}
	// rounded corner part 1
	graphics.drawingContext.clearRect(0, 0, 1, 1);
	graphics.drawingContext.clearRect(s-1, 0, 1, 1);
	// cheeks
	let h = pick([1,2,3,4]);
	let w = pick([1,2]);
	graphics.drawingContext.clearRect(0, s-h, w, h);
	graphics.drawingContext.clearRect(s-w, s-h, w, h);
	
	const scale = (size/17);
	const finalSkull = createGraphics(size, size);
	finalSkull.drawingContext.imageSmoothingEnabled = false; // pixelart
	finalSkull.image(graphics, 3*scale, 3*scale, size - 6*scale, size - 6*scale); // upscale
	finalSkull.drawingContext.imageSmoothingEnabled = true;
	finalSkull.noStroke();
	finalSkull.fill(skin);
	// rounded corner part 2
	finalSkull.circle(4*scale, 4*scale, scale*2);
	finalSkull.circle(13*scale, 4*scale, scale*2);
	
	graphics.remove();
	return finalSkull;
}

// Window resize forces redraw
//
function getSize() { return min(windowWidth, windowHeight); }
function windowResized(){
	let size = getSize();
	resizeCanvas(size, size);
	loop();
}

/**
 * Shift hue of canvas. 
 */
function hueShift(context, shift = 100) {
	let data = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
	let pixels = data.data;
	for(let i = 0, len = pixels.length; i < len; i += 4) {
		let hsl = rgb2hsl([pixels[i + 0], pixels[i + 1], pixels[i + 2]]);
		let newPixel = hsl2rgb([(hsl[0] + shift + 360) % 360, hsl[1], hsl[2]]);
		pixels[i + 0] = newPixel[0];
		pixels[i + 1] = newPixel[1];
		pixels[i + 2] = newPixel[2];
	}
	context.putImageData(data, 0, 0);
}

/**
 * desaturate canvas + make bit darker
 */
function desaturate(context) {
	let data = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
	let pixels = data.data;
	for(let i = 0, len = pixels.length; i < len; i += 4) {
		let brightess = getBrightness(pixels[i + 0], pixels[i + 1], pixels[i + 2]);
		pixels[i + 0] = brightess;
		pixels[i + 1] = brightess;
		pixels[i + 2] = brightess;
	}
	context.putImageData(data, 0, 0);
}

function getBrightness(r,g,b) {
	return (0.2126 * (r) + 0.7152 * (g) + 0.0722 * (b)) / 3
}

/*
	Color converters, based on https://stackoverflow.com/a/54024653/508029
*/
function hsl2rgb(clr, h = clr[0], s = clr[1], l = clr[2]) {
	let a = s * Math.min(l, 1 - l);
	let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function rgb2hsl(clr, r = clr[0] / 255, g = clr[1] / 255, b = clr[2] / 255) {
	let a = Math.max(r, g, b),
		n = a - Math.min(r, g, b),
		f = 1 - Math.abs(a + a - n - 1);
	let h = n && (a == r ? (g - b) / n : a == g ? 2 + (b - r) / n : 4 + (r - g) / n);
	return [60 * (h < 0 ? h + 6 : h), f ? n / f : 0, (a + a - n) / 2];
}

function pick(arr, remove = false) {
	let value = arr[random() * arr.length | 0];
	if (remove) {
		let idx = arr.indexOf(value);
		if (idx >= 0) arr.splice(idx, 1);
	}
	return value;
}

function range(a, b) {
	return a + (b-a) * random();
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
