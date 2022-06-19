//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
// 56 Modes                                                                                                    \\
// Author: Nic Thibodeaux (FXH: fxhash.xyz/u/nicthib, HEN: hicetnunc.art/nicthib, Twitter: @nicthibs)          \\
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.       \\
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/.                       \\
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\\
function fxrand_list(e) {
    return e[Math.floor(fxrand() * e.length)]
}
colors = [[[220, 55, 49], [246, 205, 51], [236, 235, 227], [23, 68, 108]], [[66, 46, 24], [225, 201, 177], [81, 136, 62]], [[255, 20, 20], [20, 255, 20], [20, 20, 255]], [[49, 49, 49], [68, 68, 68], [108, 108, 108], [220, 220, 220]], [[50, 20, 20], [100, 20, 20], [150, 20, 20], [255, 20, 20]], [[20, 50, 20], [20, 100, 20], [20, 150, 20], [20, 255, 20]], [[30, 30, 50], [30, 30, 100], [30, 30, 150], [30, 30, 255]]],
modes_56 = [3, 9, 13, 14, 31, 45, 63, 67, 74, 75, 107, 115, 157, 159, 173, 175, 187, 190, 195, 203, 207, 231, 234, 235, 238, 239, 243, 253, 271, 283, 303, 315, 317, 331, 355, 367, 379, 397, 411, 415, 419, 425, 427, 430, 445, 447, 459, 467, 479, 483, 487, 491, 493, 494, 506, 511],
coms = [],
liven = [];
for (let e = 0; e < 100; e++)
    coms[e] = generate_coms(),
    liven[e] = fxrand_list([1, 2]);
function getFeaturePalette() {
    return Ci
}
function getFeatureCellThickness() {
    return cell_thickness
}
function getFeatureMode1() {
    return coms[0]
}
function getFeatureMode2() {
    return coms[1]
}
function setup() {
    init()
}
function init() {
    for (C = [],
    i = 0; i < colors[Ci].length; i++)
        C[i] = color(colors[Ci][i]);
    sz = min([windowWidth, windowHeight]),
    cs = sz / 128,
    csx = cs,
    csy = cs,
    szx = sz,
    szy = sz,
    sx = round(sz / csx),
    sy = round(sz / csy),
    ctl = [2.5, 3, 4],
    c = cs / ctl[cell_thickness],
    pixelDensity(1),
    createCanvas(szx, szy),
    clear(),
    background(0),
    noStroke(),
    iFrame = 0,
    iCom = 0,
    n_array = int(("000000000" + (coms[iCom] >>> 0).toString(2)).slice(-9).split("")),
    cells = [...Array(sx)].map(e=>Array(sy).fill(0)),
    cellsBuffer = [...Array(sx)].map(e=>Array(sy).fill(0)),
    seed(sx / 2, sy / 2),
    frameRate(40)
}
function seed(e, s) {
    for (let l = -2; l < 2; l++)
        for (let c = -2; c < 2; c++)
            cells[l + e][c + s] = 1
}
function draw() {
    anychanged = !1,
    alldead = !0;
    for (let e = 1; e < sx - 1; e++)
        for (let s = 1; s < sy - 1; s++)
            cells[e][s] > 0 && !cellsBuffer[e][s] && (i1 = e * csx + c,
            j1 = s * csy + c,
            i2 = e * csx + c,
            j2 = csy * (s + 1) - c,
            i3 = csx * (e + 1) - c,
            j3 = csy * (s + 1) - c,
            i4 = csx * (e + 1) - c,
            j4 = s * csy + c,
            fi = [0, 0],
            abs(cells[e][s] - cells[e - 1][s]) < 1 && (i1 -= 1.02 * c,
            i2 -= 1.02 * c),
            abs(cells[e][s] - cells[e][s + 1]) < 1 && (j2 += .98 * c,
            j3 += .98 * c),
            abs(cells[e][s] - cells[e + 1][s]) < 1 && (i3 += .98 * c,
            i4 += .98 * c),
            abs(cells[e][s] - cells[e][s - 1]) < 1 && (j4 -= 1.02 * c,
            j1 -= 1.02 * c),
            fill(C[iFrame % C.length]),
            beginShape(),
            vertex(i1, j1),
            vertex(i2, j2),
            vertex(i3, j3),
            vertex(i4, j4),
            endShape(CLOSE)),
            (0 == cells[e][s] && cellsBuffer[e][s] > 0 && iFrame || 0 == cells[e][s] && !iFrame) && (fill(dead),
            rect(e * csx - c, s * csy - c, csx + 2 * c, csy + 2 * c)),
            cells[e][s] > 0 != cellsBuffer[e][s] > 0 && (anychanged = !0),
            cells[e][s] > 0 && (alldead = !1);
    pause || iteration()
}
function iteration() {
    for (let e = 0; e < sx; e++)
        for (let s = 0; s < sy; s++)
            cellsBuffer[e][s] = cells[e][s];
    for (let e = 1; e < sx - 1; e++)
        for (let s = 1; s < sy - 1; s++) {
            neighbors = 0;
            for (let l = -1; l <= 1; l++)
                for (let c = -1; c <= 1; c++) {
                    let r = (e < sx / 2 ? l : -l) + e
                      , i = (s < sy / 2 ? c : -c) + s;
                    r == e && i == s || cellsBuffer[r % sx][i % sy] > 0 && n_array[l + 1 + 3 * (c + 1)] > 0 && neighbors++
                }
            cellsBuffer[e][s] > 0 ? (neighbors < minneighbors || neighbors > maxneighbors) && (cells[e][s] = 0) : neighbors == liven[iCom] && 0 == cells[e][s] && (cells[e][s] = 1)
        }
    iFrame++,
    iFrame % 50 != 0 && anychanged || (iCom++,
    n_array = int(("000000000" + (coms[iCom] >>> 0).toString(2)).slice(-9).split(""))),
    alldead && init()
}
function generate_coms() {
    for (com = [0, 1, 2, 3, 4, 5, 6, 7, 8],
    nspl = Math.floor(5 * fxrand()),
    i = 0; i < nspl; i++)
        rpos = Math.floor(fxrand() * com.length - 1),
        com.splice(rpos, rpos + 1);
    for (comb = 0,
    i = 0; i < com.length; i++)
        comb += 2 ** com[i];
    return comb
}
function keyPressed() {
    "s" == key && (save("56_Modes.png")),
    " " == key && (pause = !pause)
}
cell_thickness = fxrand_list([0, 1, 2]),
coms[0] = fxrand_list(modes_56),
coms[1] = fxrand_list(modes_56),
Ci = Math.floor(fxrand() * colors.length),
window.$fxhashFeatures = {
    "Color Palette": getFeaturePalette(),
    "Cell Thickness": getFeatureCellThickness(),
    "First Mode": getFeatureMode1(),
    "Second Mode": getFeatureMode2()
},
maxneighbors = 4,
minneighbors = 1,
dead = 0,
pause = !1;
