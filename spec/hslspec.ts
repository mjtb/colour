/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import RGB from '../rgb';
import HSL from '../hsl';

describe('HSL', () => {

	it('should parse hsl strings', () => {
		let h: HSL = HSL.parseString('hsl(72,100%,50%)') || HSL.EMPTY;
		expect(h.h).toBeCloseTo(0.2);
		expect(h.s).toBeCloseTo(1);
		expect(h.l).toBeCloseTo(0.5);
		expect(h.H).toBe(72);
		expect(h.S).toBe(100);
		expect(h.L).toBe(50);
	});

	it('should parse hsl(deg) strings', () => {
		let h: HSL = HSL.parseString('hsl(72deg,100%,50%)') || HSL.EMPTY;
		expect(h.h).toBeCloseTo(0.2);
		expect(h.s).toBeCloseTo(1);
		expect(h.l).toBeCloseTo(0.5);
		expect(h.H).toBe(72);
		expect(h.S).toBe(100);
		expect(h.L).toBe(50);
	});

	it('should format hsl strings', () => {
		let h: HSL = new HSL(0.2, 1, 0.5);
		expect(h.toString()).toBe('hsl(72,100%,50%)');
	});

	it('should convert to rgb', () => {
		let h: HSL = new HSL(0.2, 1, 0.5);
		let r: RGB = h.toRGB();
		expect(r.toHexString()).toBe('#cf0')
	});

	it('should convert from rgb', () => {
		let r: RGB = RGB.parseString('#cf0') || RGB.EMPTY;
		let h: HSL = HSL.fromRGB(r);
		expect(h.toString()).toBe('hsl(72,100%,50%)');
		let g: RGB = h.toRGB();
		expect(r.equalTo(g)).toBe(true);
	});

});
