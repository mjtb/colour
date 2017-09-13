/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

/** A read-only 3x3 matrix */
export default class Matrix3x3 {
	/** Matrix cell value at row 1, column 1 */
	public readonly r1c1: number;
	/** Matrix cell value at row 1, column 2 */
	public readonly r1c2: number;
	/** Matrix cell value at row 1, column 3 */
	public readonly r1c3: number;
	/** Matrix cell value at row 2, column 1 */
	public readonly r2c1: number;
	/** Matrix cell value at row 2, column 2 */
	public readonly r2c2: number;
	/** Matrix cell value at row 2, column 3 */
	public readonly r2c3: number;
	/** Matrix cell value at row 3, column 1 */
	public readonly r3c1: number;
	/** Matrix cell value at row 3, column 2 */
	public readonly r3c2: number;
	/** Matrix cell value at row 3, column 3 */
	public readonly r3c3: number;
	/** Initializes the matrix with a 2-dimensional array of values
	  * @param {number[][]} m - matrix of numbers
	  */
	constructor(m: number[][]) {
		this.r1c1 = m[0][0];
		this.r1c2 = m[0][1];
		this.r1c3 = m[0][2];
		this.r2c1 = m[1][0];
		this.r2c2 = m[1][1];
		this.r2c3 = m[1][2];
		this.r3c1 = m[2][0];
		this.r3c2 = m[2][1];
		this.r3c3 = m[2][2];
	}
	/** The identity matrix i.e., has 1 along the diagnal and 0 everywhere else */
	public static readonly IDENTITY: Matrix3x3 = new Matrix3x3([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
};
