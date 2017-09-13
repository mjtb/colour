/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
 import Component from '../component';

describe('Component', () => {

	it('should parse numbers', () => {
		expect(Component.parseNumber('3')).toBe(3);
		expect(Component.parseNumber('3.5')).toBeCloseTo(3.5);
	});

	it('should parse numbers in a range', () => {
		expect(Component.parseNumber('128', 256)).toBeCloseTo(0.5);
		expect(Component.parseNumber('30', 35, 25)).toBeCloseTo(0.5);
	});

	it('should parse percents', () => {
		expect(Component.parseNumber('50%')).toBeCloseTo(0.5);
		expect(Component.parseNumber('150%')).toBeCloseTo(1.5);
	});

	it('should parse angles', () => {
		expect(Component.parseNumber('72', 360)).toBe(0.2);
		expect(Component.parseNumber('72°')).toBe(0.2);
		expect(Component.parseNumber('72deg')).toBe(0.2);
		expect(Component.parseNumber('0.5rad')).toBeCloseTo(1.0 / (4 * Math.PI));
		expect(Component.parseNumber('100grad')).toBeCloseTo(0.25);
	});
});
