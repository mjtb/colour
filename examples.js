/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
const colour = require('./lib/index.js');

function ex1_Palettes_parseString() {
	console.log("== EXAMPLE #1: Palettes.parseString ==");
	let aliceblue = colour.Palettes.parseString('aliceblue');
	console.log(`Name: ${aliceblue.name}`); // aliceblue
	console.log(`Colour: ${aliceblue.toString()}`); // aliceblue
	console.log(`RGB: ${aliceblue.rgb.toString()}`); // #f0f8ff
	console.log(`RGB: ${aliceblue.rgb.toHexString()}`); // #f0f8ff
	console.log(`RGB: ${aliceblue.rgb.toRgbString()}`); // rgb(240,248,255)
	console.log(`HSL: ${aliceblue.hsl.toString()}`); // hsl(208,100%,97.06%)
	console.log();
}

function ex2_Colour_parseString() {
	console.log("== EXAMPLE #2: Colour.parseString ==");
	let rgb1 = colour.Colour.parseString('rgb(255,0,255)');
	let rgb2 = colour.Colour.parseString('#ff00ff');
	let rgb3 = colour.Colour.parseString('#f0f');
	let rgb4 = colour.Colour.parseString('rgb(100%,0,100%)');
	let hsl = colour.Colour.parseString('hsl(300,100%,50%)');
	let hwb = colour.Colour.parseString('hwb(300,0%,0%)');
	console.log(rgb1.equalTo(rgb2)); // true
	console.log(rgb2.equalTo(rgb3)); // true
	console.log(rgb3.equalTo(rgb4)); // true
	console.log(rgb4.equalTo(hsl)); // true
	console.log(hsl.equalTo(hwb)); // true
	console.log();
}

function ex3_SpaceSpecific_parseString() {
	console.log("== EXAMPLE #3: Colour space-specific parseString ==");
	let c = colour.Colour.parseString('rgb(255,0,255)');
	console.log(c instanceof colour.Colour); // true
	let rgb = colour.RGB.parseString('rgb(255,0,255)');
	console.log(rgb instanceof colour.Colour); // false!!
	console.log(rgb instanceof colour.RGB); // true
	let hsl = colour.HSL.parseString('hsl(300,100%,50%)');
	console.log(hsl instanceof colour.Colour); // false!!
	console.log(hsl instanceof colour.RGB); // false!!
	console.log(hsl instanceof colour.HSL); // true
	console.log();
}

function ex4_SpaceSpecific_equalTo() {
	console.log("== EXAMPLE #4: Colour space-specific equalTo ==");
	let rgb = colour.RGB.parseString('rgb(255,0,255)');
	let hsl = colour.HSL.parseString('hsl(300,100%,50%)');
	console.log(rgb.equalTo(hsl)); // type error: false!!!
	let c1 = new colour.Colour(rgb);
	let c2 = new colour.Colour(hsl);
	console.log(c1.equalTo(c2)); // true
	console.log();
}

function ex5_Normalized_and_natural_properties() {
	console.log("== EXAMPLE #5: Normalized and natural properties ==");
	let rgb = colour.RGB.parseString('rgb(255,0,255)');
	console.log(rgb.r); // 1
	console.log(rgb.R); // 255
	let hsl = colour.HSL.parseString('hsl(72deg,50%,75%)');
	console.log(hsl.h); // 0.2
	console.log(hsl.H); // 72
	let lab = colour.LAB.parseString('lab(97.12 -1.77 -4.36)');
	console.log(lab.l); // 97.12
	console.log(lab.a); // -1.77
	console.log(lab.b); // -4.36
	console.log();
}

function ex6_SpaceSpecific_constructors() {
	console.log("== EXAMPLE #6: Colour space-specific constructors ==");
	let rgb = new colour.RGB(1,0,0.5);
	console.log(rgb.toRgbString()); // rgb(255,0,128)
	let hsl = new colour.HSL(0.2,0.5,0.75);
	console.log(hsl.toString()); // hsl(72,50%,75%)
	let lab = new colour.LAB(97.12,-1.77,-4.36);
	console.log(lab.toString()); // lab(97.12 -1.77 -4.36)
	console.log();
}

function ex7_RGB_toString_behaviour() {
	console.log("== EXAMPLE #7: RGB.toString behaviour ==");
	let h3 = colour.RGB.parseString('rgb(17,34,51)');
	console.log(h3.isClipped); // true
	console.log(h3.isHexable); // true
	console.log(h3.isHexable3); // true
	console.log(h3.toString()); // #123
	console.log(h3.toHexString()); // #123
	console.log(h3.toHexString(true /* force 6-digit */)); // #112233
	console.log(h3.toRgbString()); // rgb(17,34,51)
	console.log(h3.toRgbString(true /* force % */)); // rgb(6.67%,13.33%,20%);
	let h6 = colour.RGB.parseString('rgb(161,178,195)');
	console.log(h6.isClipped); // true
	console.log(h6.isHexable); // true
	console.log(h6.isHexable3); // false
	console.log(h6.toString()); // #a1b2c3
	console.log(h6.toHexString()); // #a1b2c3
	console.log(h6.toRgbString()); // rgb(161,178,195)
	console.log(h6.toRgbString(true /* force % */)); // rgb(63.14%,69.8%,76.47%)
	let r1 = colour.RGB.parseString('rgb(0.7,32,199)');
	console.log(r1.isClipped); // true
	console.log(r1.isHexable); // false
	console.log(r1.toString()); // rgb(1,32,199)
	console.log(r1.toRgbString(true /* force % */)); // rgb(0.27%,12.55%,78.04%)
	let r2 = colour.RGB.parseString('rgb(-73,257,100)');
	console.log(r2); // undefined
	r2 = new colour.RGB(-73/255.0, 257/255.0, 100/255.0);
	console.log(r2.isClipped); // false
	console.log(r2.isHexable); // false
	console.log(r2.toString()); // rgb(-73,257,100)
	console.log();
}

function ex8_Colour_toString_behaviour() {
	console.log("== EXAMPLE #8: Colour.toString behaviour ==");
	let c1 = colour.Palettes.parseString('aliceblue');
	console.log(c1.toString()); // aliceblue
	let c2 = colour.Palettes.parseString('rgb(240,248,255)');
	console.log(c2.toString()); // #f0f8ff
	let c3 = colour.Palettes.parseString('hsl(72deg,35%,90%)');
	console.log(c3.toString()); // hsl(72,35%,90%)
	let c4 = new colour.Colour(new colour.YUV(0.5,-0.3,0.2));
	console.log(c4.toString()); // yuv(128,51,179)
	console.log();
}

function ex9_Palette_matching() {
	console.log("== EXAMPLE #9: Palette matching ==");
	let pal = colour.Palette.parseJson({
		"name": "basic",
		"desc": "Basic Colours",
		"entries": [
			{ "name": "black",  "defn": "#000" },
			{ "name": "white",  "defn": "#fff" },
			{ "name": "red",    "defn": "lab(50 75 65)" },
			{ "name": "green",  "defn": "lab(50 -50 50)" },
			{ "name": "yellow", "defn": "lab(95 -15 90)" },
			{ "name": "blue",   "defn": "lab(50 15 -75)" },
			{ "name": "brown",  "defn": "lab(35 35 35)" },
			{ "name": "orange", "defn": "lab(60 40 65)" },
			{ "name": "purple", "defn": "lab(30 50 -30)" },
			{ "name": "pink",   "defn": "lab(80 20 5)" },
			{ "name": "grey",   "defn": "#999" },
			{ "name": "teal",   "defn": "lab(60 -40 0)" },
		]
	});
	let index = pal.find(colour.Colour.parseString('#8A371B'));
	console.log(index); // 6
	console.log(pal.nameAt(index)); // brown
	console.log(pal.colourAt(index).toString()); // brown
	console.log(pal.colourAt(index).rgb.toString()); // rgb(138,55,27)
	let matches = pal.match(colour.Palettes.css.colourOf('tomato'), 3);
	console.log(matches.length); // 3
	console.log(matches[0].name); // red
	console.log(matches[0].deltaE.toFixed(2)); // 12.99
	console.log(matches[1].name); // orange
	console.log(matches[1].deltaE.toFixed(2)); // 14.97
	console.log(matches[2].name); // pink
	console.log(matches[2].deltaE.toFixed(2)); // 24.17
	console.log();
}

function ex10_Colour_space_convertibility() {
	console.log("== EXAMPLE #10: Colour space convertibility ==");
	let lch1 = colour.LCH.parseString('lch(60 40 180)');
	let lab1 = lch1.toLAB();
	let xyz1 = lab1.toXYZ();
	let lin1 = xyz1.toLinear();
	let rgb1 = lin1.toRGB();
	let hsl1 = colour.HSL.fromRGB(rgb1);
	console.log(hsl1.toString()); // hsl(171.63,79.31%,35.68%)
	let hsl2 = colour.HSL.parseString('hsl(171.63,79.31%,35.68%)');
	let rgb2 = hsl2.toRGB();
	let lin2 = colour.Linear.fromRGB(rgb2);
	let xyz2 = colour.XYZ.fromLinear(lin2);
	let lab2 = colour.LAB.fromXYZ(xyz2);
	let lch2 = colour.LCH.fromLAB(lab2);
	console.log(lch2.toString()); // lch(59.99 40 180)
	console.log(lch2.equalTo(lch1)); // true
	console.log(lab2.deltaE(lab1).toFixed(6)); // 0.006548
	console.log();
}

const examples = [
	ex1_Palettes_parseString,
	ex2_Colour_parseString,
	ex3_SpaceSpecific_parseString,
	ex4_SpaceSpecific_equalTo,
	ex5_Normalized_and_natural_properties,
	ex6_SpaceSpecific_constructors,
	ex7_RGB_toString_behaviour,
	ex8_Colour_toString_behaviour,
	ex9_Palette_matching,
	ex10_Colour_space_convertibility
];

function should_run_example(ex, args) {
	return !args || !args.length || (args.indexOf(ex) >= 0);
}

function run_examples(args) {
	for(let i = 0; i < examples.length; ++i) {
		if(should_run_example(i + 1, args)) {
			console.log();
			examples[i]();
		}
	}
}

run_examples(process.argv
	.map((cv,i,a) => Number.parseInt(cv))
	.filter(Number.isSafeInteger)
);
