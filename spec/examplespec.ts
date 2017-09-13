/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import * as colour from '../index';

describe('Examples', () => {

	it('ex1_Palettes_parseString', () => {
		let aliceblue: colour.Colour|undefined = colour.Palettes.parseString('aliceblue');
		expect(aliceblue).toBeDefined(); if(!aliceblue) return;
		expect(aliceblue.name).toBe('aliceblue');
		expect(aliceblue.toString()).toBe('aliceblue');
		expect(aliceblue.rgb.toString()).toBe('#f0f8ff');
		expect(aliceblue.rgb.toHexString()).toBe('#f0f8ff');
		expect(aliceblue.rgb.toRgbString()).toBe('rgb(240,248,255)');
		expect(aliceblue.hsl.toString()).toBe('hsl(208,100%,97.06%)');
	});

	it('ex2_Colour_parseString', () => {
		let rgb1: colour.Colour|undefined = colour.Colour.parseString('rgb(255,0,255)');
		expect(rgb1).toBeDefined(); if(!rgb1) return;
		let rgb2: colour.Colour|undefined = colour.Colour.parseString('#ff00ff');
		expect(rgb2).toBeDefined(); if(!rgb2) return;
		let rgb3: colour.Colour|undefined = colour.Colour.parseString('#f0f');
		expect(rgb3).toBeDefined(); if(!rgb3) return;
		let rgb4: colour.Colour|undefined = colour.Colour.parseString('rgb(100%,0,100%)');
		expect(rgb4).toBeDefined(); if(!rgb4) return;
		let hsl: colour.Colour|undefined = colour.Colour.parseString('hsl(300,100%,50%)');
		expect(hsl).toBeDefined(); if(!hsl) return;
		let hwb: colour.Colour|undefined = colour.Colour.parseString('hwb(300,0%,0%)');
		expect(hwb).toBeDefined(); if(!hwb) return;
		expect(rgb1.equalTo(rgb2)).toBe(true);
		expect(rgb2.equalTo(rgb3)).toBe(true);
		expect(rgb3.equalTo(rgb4)).toBe(true);
		expect(rgb4.equalTo(hsl)).toBe(true);
		expect(hsl.equalTo(hwb)).toBe(true);
	});

	it('ex3_SpaceSpecific_parseString', () => {
		let c: colour.Colour|undefined = colour.Colour.parseString('rgb(255,0,255)');
		expect(c).toBeDefined(); if(!c) return;
		expect(c instanceof colour.Colour).toBe(true);
		let rgb: colour.RGB|undefined = colour.RGB.parseString('rgb(255,0,255)');
		expect(rgb).toBeDefined(); if(!rgb) return;
		expect(rgb instanceof colour.Colour).toBe(false);
		expect(rgb instanceof colour.RGB).toBe(true);
		let hsl: colour.HSL|undefined = colour.HSL.parseString('hsl(300,100%,50%)');
		expect(hsl).toBeDefined(); if(!hsl) return;
		expect(hsl instanceof colour.Colour).toBe(false);
		expect(hsl instanceof colour.RGB).toBe(false);
		expect(hsl instanceof colour.HSL).toBe(true);
	});

	it('ex4_SpaceSpecific_equalTo', () => {
		let rgb: colour.RGB|undefined = colour.RGB.parseString('rgb(255,0,255)');
		expect(rgb).toBeDefined(); if(!rgb) return;
		let hsl: colour.HSL|undefined = colour.HSL.parseString('hsl(300,100%,50%)');
		expect(hsl).toBeDefined(); if(!hsl) return;
		// type error: expect(rgb.equalTo(hsl));
		let c1: colour.Colour = new colour.Colour(rgb);
		let c2: colour.Colour = new colour.Colour(hsl);
		expect(c1.equalTo(c2)).toBe(true);
	});

	it('ex5_Normalized_and_natural_properties', () => {
		let rgb: colour.RGB|undefined = colour.RGB.parseString('rgb(255,0,255)');
		expect(rgb).toBeDefined(); if(!rgb) return;
		expect(rgb.r).toBe(1);
		expect(rgb.R).toBe(255);
		let hsl: colour.HSL|undefined = colour.HSL.parseString('hsl(72deg,50%,75%)');
		expect(hsl).toBeDefined(); if(!hsl) return;
		expect(hsl.h).toBeCloseTo(0.2, 2);
		expect(hsl.H).toBe(72);
		let lab: colour.LAB|undefined = colour.LAB.parseString('lab(97.12 -1.77 -4.36)');
		expect(lab).toBeDefined(); if(!lab) return;
		expect(lab.l).toBeCloseTo(97.12, 2);
		expect(lab.a).toBeCloseTo(-1.77, 2);
		expect(lab.b).toBeCloseTo(-4.36, 2);
	});

	it('ex6_SpaceSpecific_constructors', () => {
		let rgb: colour.RGB = new colour.RGB(1,0,0.5);
		expect(rgb.toRgbString()).toBe('rgb(255,0,128)');
		let hsl: colour.HSL = new colour.HSL(0.2,0.5,0.75);
		expect(hsl.toString()).toBe('hsl(72,50%,75%)');
		let lab: colour.LAB = new colour.LAB(97.12,-1.77,-4.36);
		expect(lab.toString()).toBe('lab(97.12 -1.77 -4.36)');
	});

	it('ex7_RGB_toString_behaviour', () => {
		let h3: colour.RGB|undefined = colour.RGB.parseString('rgb(17,34,51)');
		expect(h3).toBeDefined(); if(!h3) return;
		expect(h3.isClipped).toBe(true);
		expect(h3.isHexable).toBe(true);
		expect(h3.isHexable3).toBe(true);
		expect(h3.toString()).toBe('#123');
		expect(h3.toHexString()).toBe('#123');
		expect(h3.toHexString(true /* force 6-digit */)).toBe('#112233');
		expect(h3.toRgbString()).toBe('rgb(17,34,51)');
		expect(h3.toRgbString(true /* force % */)).toBe('rgb(6.67%,13.33%,20%)');
		let h6: colour.RGB|undefined = colour.RGB.parseString('rgb(161,178,195)');
		expect(h6).toBeDefined(); if(!h6) return;
		expect(h6.isClipped).toBe(true);
		expect(h6.isHexable).toBe(true);
		expect(h6.isHexable3).toBe(false);
		expect(h6.toString()).toBe('#a1b2c3');
		expect(h6.toHexString()).toBe('#a1b2c3');
		expect(h6.toRgbString()).toBe('rgb(161,178,195)');
		expect(h6.toRgbString(true /* force % */)).toBe('rgb(63.14%,69.8%,76.47%)');
		let r1: colour.RGB|undefined = colour.RGB.parseString('rgb(0.7,32,199)');
		expect(r1).toBeDefined(); if(!r1) return;
		expect(r1.isClipped).toBe(true);
		expect(r1.isHexable).toBe(false);
		expect(r1.toString()).toBe('rgb(1,32,199)');
		expect(r1.toRgbString(true /* force % */)).toBe('rgb(0.27%,12.55%,78.04%)');
		let r2: colour.RGB|undefined = colour.RGB.parseString('rgb(-73,257,100)');
		expect(r2).toBeUndefined();
		r2 = new colour.RGB(-73/255.0, 257/255.0, 100/255.0);
		expect(r2.isClipped).toBe(false);
		expect(r2.isHexable).toBe(false);
		expect(r2.toString()).toBe('rgb(-73,257,100)');
	});

	it('ex8_Colour_toString_behaviour', () => {
		let c1: colour.Colour|undefined = colour.Palettes.parseString('aliceblue');
		expect(c1).toBeDefined(); if(!c1) return;
		expect(c1.toString()).toBe('aliceblue');
		let c2: colour.Colour|undefined = colour.Palettes.parseString('rgb(240,248,255)');
		expect(c2).toBeDefined(); if(!c2) return;
		expect(c2.toString()).toBe('#f0f8ff');
		let c3: colour.Colour|undefined = colour.Palettes.parseString('hsl(72deg,35%,90%)');
		expect(c3).toBeDefined(); if(!c3) return;
		expect(c3.toString()).toBe('hsl(72,35%,90%)');
		let c4: colour.Colour|undefined = new colour.Colour(new colour.YUV(0.5,-0.3,0.2));
		expect(c4).toBeDefined(); if(!c4) return;
		expect(c4.toString()).toBe('yuv(128,51,179)');
	});

	it('ex9_Palette_matching', () => {
		let pal: colour.Palette = colour.Palette.parseJson({
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
		let c: colour.Colour|undefined = colour.Colour.parseString('#8A371B');
		expect(c).toBeDefined(); if(!c) return;
		let index: number = pal.find(c);
		expect(index).toBe(6);
		expect(pal.nameAt(index)).toBe('brown');
		expect(pal.colourAt(index).toString()).toBe('brown');
		expect(pal.colourAt(index).rgb.toString()).toBe('rgb(138,55,27)');
		let matches: colour.Match[] = pal.match(colour.Palettes.css.colourOf('tomato'), 3);
		expect(matches.length).toBe(3);
		expect(matches[0].name).toBe('red');
		expect(matches[0].deltaE).toBeCloseTo(12.99, 2);
		expect(matches[1].name).toBe('orange');
		expect(matches[1].deltaE).toBeCloseTo(14.97, 2);
		expect(matches[2].name).toBe('pink');
		expect(matches[2].deltaE).toBeCloseTo(24.17, 2);
	});

	it('ex10_Colour_space_convertibility', () => {
		let lch1: colour.LCH|undefined = colour.LCH.parseString('lch(60 40 180)');
		expect(lch1).toBeDefined(); if(!lch1) return;
		let lab1: colour.LAB = lch1.toLAB();
		let xyz1: colour.XYZ = lab1.toXYZ();
		let lin1: colour.Linear = xyz1.toLinear();
		let rgb1: colour.RGB = lin1.toRGB();
		let hsl1: colour.HSL = colour.HSL.fromRGB(rgb1);
		expect(hsl1.toString()).toBe('hsl(171.63,79.31%,35.68%)');
		let hsl2: colour.HSL|undefined = colour.HSL.parseString('hsl(171.63,79.31%,35.68%)');
		expect(hsl2).toBeDefined(); if(!hsl2) return;
		let rgb2: colour.RGB = hsl2.toRGB();
		let lin2: colour.Linear = colour.Linear.fromRGB(rgb2);
		let xyz2: colour.XYZ = colour.XYZ.fromLinear(lin2);
		let lab2: colour.LAB = colour.LAB.fromXYZ(xyz2);
		let lch2: colour.LCH = colour.LCH.fromLAB(lab2);
		expect(lch2.toString()).toBe('lch(59.99 40 180)');
		expect(lch2.equalTo(lch1)).toBe(true);
		expect(lab2.deltaE(lab1)).toBeCloseTo(0.006548, 6);
	});

});
