/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import RGB from '../rgb';

describe('RGB', () => {

	it('should parse #rgb strings', () => {
		let c: RGB = RGB.parseString('#123') || RGB.EMPTY;
		expect(c.r).toBeCloseTo(0x11/255.0);
		expect(c.g).toBeCloseTo(0x22/255.0);
		expect(c.b).toBeCloseTo(0x33/255.0);
		expect(c.R).toBe(0x11);
		expect(c.G).toBe(0x22);
		expect(c.B).toBe(0x33);
	});

	it('should format #rgb strings', () => {
		let c: RGB = RGB.parseString('#123') || RGB.EMPTY;
		let s: string = c.toString();
		expect(s).toBe('#123');
		s = c.toHexString(false);
		expect(s).toBe('#123');
		s = c.toHexString(true);
		expect(s).toBe('#112233');
		s = c.toRgbString(false);
		expect(s).toBe('rgb(17,34,51)');
		s = c.toRgbString(true);
		expect(s).toBe('rgb(6.67%,13.33%,20%)');
	});

	it('should parse #rrggbb strings', () => {
		let c: RGB = RGB.parseString('#1ab2c3') || RGB.EMPTY;
		expect(c.r).toBeCloseTo(0x1a/255.0);
		expect(c.g).toBeCloseTo(0xb2/255.0);
		expect(c.b).toBeCloseTo(0xc3/255.0);
		expect(c.R).toBe(0x1a);
		expect(c.G).toBe(0xb2);
		expect(c.B).toBe(0xc3);
	});

	it('should format #rrggbb strings', () => {
		let c: RGB = RGB.parseString('#1ab23c') || RGB.EMPTY;
		let s: string = c.toString();
		expect(s).toBe('#1ab23c');
		s = c.toHexString(false);
		expect(s).toBe('#1ab23c');
		s = c.toHexString(true);
		expect(s).toBe('#1ab23c');
		s = c.toRgbString(false);
		expect(s).toBe('rgb(26,178,60)');
		s = c.toRgbString(true);
		expect(s).toBe('rgb(10.2%,69.8%,23.53%)');
	});

	it('should parse rgb strings', () => {
		let c: RGB = RGB.parseString('rgb(26,178,60)') || RGB.EMPTY;
		expect(c.r).toBeCloseTo(26/255.0);
		expect(c.g).toBeCloseTo(178/255.0);
		expect(c.b).toBeCloseTo(60/255.0);
		expect(c.R).toBe(26);
		expect(c.G).toBe(178);
		expect(c.B).toBe(60);
	});

	it('should format rgb strings', () => {
		let c: RGB = RGB.parseString('rgb(26,178,60)') || RGB.EMPTY;
		expect(c.toString()).toBe('#1ab23c');
		expect(c.toHexString(false)).toBe('#1ab23c');
		expect(c.toHexString(true)).toBe('#1ab23c');
		expect(c.toRgbString(false)).toBe('rgb(26,178,60)');
		expect(c.toRgbString(true)).toBe('rgb(10.2%,69.8%,23.53%)');
	});

	it('should parse rgb(%) strings', () => {
		let c: RGB = RGB.parseString('rgb(10.2%,69.8%,23.53%)') || RGB.EMPTY;
		expect(c.r).toBeCloseTo(26/255.0);
		expect(c.g).toBeCloseTo(178/255.0);
		expect(c.b).toBeCloseTo(60/255.0);
		expect(c.R).toBe(26);
		expect(c.G).toBe(178);
		expect(c.B).toBe(60);
	});

	it('should format rgb strings', () => {
		let c: RGB = RGB.parseString('rgb(10.2%,69.8%,23.53%)') || RGB.EMPTY;
		expect(c.toString()).toBe('rgb(26,178,60)');
		expect(c.toHexString(false)).toBe('#1ab23c');
		expect(c.toHexString(true)).toBe('#1ab23c');
		expect(c.toRgbString(false)).toBe('rgb(26,178,60)');
		expect(c.toRgbString(true)).toBe('rgb(10.2%,69.8%,23.53%)');
	});

	it('should clip', () => {
		let c: RGB = new RGB(0,-0.1,1.1);
		expect(c.isClipped).toBe(false);
		let d: RGB = c.clip();
		expect(d.r).toBe(0);
		expect(d.g).toBe(0);
		expect(d.b).toBe(1);
		expect(d.toString()).toBe('#00f');
	});

	it('should clip3', () => {
		let c: RGB = new RGB(1.0373, 0.9878, -0.0373);
		let d: RGB = c.clip3();
		expect(d.toString()).toBe('#ff0');
	});

	it('should clip6', () => {
		let c: RGB = new RGB(1.0373, 0.9878, -0.0373);
		let e: RGB = c.clip6();
		expect(e.toString()).toBe('#fffc00');
	});

	it('should handle ARGB numbers', () => {
		let c: RGB = RGB.fromARGB(0x5ab67d);
		expect(c.toARGB(0x7f)).toBe(0x7f5ab67d);
	});


});
