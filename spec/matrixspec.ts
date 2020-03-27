/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Matrix3x3 from '../matrix3x3';
import Matrix3x1 from '../matrix3x1';

describe('Matrices', () => {

	it('multiply_3x3_3x3', () => {
		let a : Matrix3x3 = new Matrix3x3([
			[  0,  0,  9 ],
			[  5,  2, -2 ],
			[  2,  8, -5 ]
		]);
		let b : Matrix3x3 = new Matrix3x3([
			[  6,  3,  3 ],
			[  9,  7,  5 ],
			[  9,  7,  8 ]
		]);
		let c : Matrix3x3 = b.multiply(a);
		expect(c).toBeDefined(); if(!c) return;
		expect(c.r1c1).toBe(81);
		expect(c.r1c2).toBe(63);
		expect(c.r1c3).toBe(72);
		expect(c.r2c1).toBe(30);
		expect(c.r2c2).toBe(15);
		expect(c.r2c3).toBe(9);
		expect(c.r3c1).toBe(39);
		expect(c.r3c2).toBe(27);
		expect(c.r3c3).toBe(6);
	});

	it('multiply_3x3_3x1', () => {
		let a : Matrix3x3 = new Matrix3x3([
			[  3, -5,  5 ],
			[ -1,  7,  3 ],
			[ -3,  4, -5 ]
		]);
		let b : Matrix3x1 = new Matrix3x1([
			2, 7, -3
		]);
		let c : Matrix3x1 = b.multiply(a);
		expect(c).toBeDefined(); if(!c) return;
		expect(c.r1c1).toBe(-44);
		expect(c.r2c1).toBe(38);
		expect(c.r3c1).toBe(37);
	});

});
