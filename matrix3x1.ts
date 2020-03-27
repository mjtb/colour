/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

import Matrix3x3 from './matrix3x3';

/** A read-only 3x1 matrix */
export default class Matrix3x1 {
	/** Matrix cell value at row 1, column 1 */
	public readonly r1c1: number;
	/** Matrix cell value at row 2, column 1 */
	public readonly r2c1: number;
	/** Matrix cell value at row 3, column 1 */
	public readonly r3c1: number;
	/** Initializes the matrix with a 1-dimensional array of values
	  * @param {number[]} m - matrix of numbers
	  */
	constructor(m: number[]) {
		this.r1c1 = m[0];
		this.r2c1 = m[1];
		this.r3c1 = m[2];
	}
	/** The identity matrix i.e., has 1 along the diagnal and 0 everywhere else */
	public static readonly IDENTITY: Matrix3x1 = new Matrix3x1([0,1,0]);
	/** Returns the 3x1 matrix formed by mulitplying this matrix by a 3x3 matrix */
	public multiply(m : Matrix3x3) : Matrix3x1 {
		return new Matrix3x1([
			m.r1c1 * this.r1c1 + m.r1c2 * this.r2c1 + m.r1c3 * this.r3c1,
			m.r2c1 * this.r1c1 + m.r2c2 * this.r2c1 + m.r2c3 * this.r3c1,
			m.r3c1 * this.r1c1 + m.r3c2 * this.r2c1 + m.r3c3 * this.r3c1
		]);
	}
};
