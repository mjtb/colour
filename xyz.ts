/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import Linear from './linear';
import Matrix3x3 from './matrix3x3';

/** Defines a colour in CIE XYZ (tristimulus) colour space
  *
  * Under normal circumstances, a D65 whitepoint is assumed as this is the whitepoint used in sRGB.
  */
export default class XYZ {
	/** Decimal place position to which component values are rounded */
	public static readonly PRECISION: number = 1e-6;
	private static readonly Pattern: RegExp = /xyz\(\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*\)/;
	private static readonly FromLinear: Matrix3x3 = new Matrix3x3([
		[ 0.4124564, 0.3575761, 0.1804375 ],
		[ 0.2126729, 0.7151522, 0.0721750 ],
		[ 0.0193339, 0.1191920, 0.9503041 ]
	]);
	private static readonly ToLinear: Matrix3x3 = new Matrix3x3([
		[  3.2404542, -1.5371385, -0.4985314 ],
		[ -0.9692660,  1.8760108,  0.0415560 ],
		[  0.0556434, -0.2040259,  1.0572252 ]
	]);
	/** A matrix which can be used to convert from a D65 to a D50 whitepoint */
	public static readonly D50: Matrix3x3 = new Matrix3x3([
		[  1.0478112, 0.0228866, -0.0501270 ],
		[  0.0295424, 0.9904844, -0.0170491 ],
		[ -0.0092345, 0.0150436,  0.7521316 ]
	]);
	/** A matrix which can be used to convert from D50 to D65 whitepoint */
	public static readonly D65: Matrix3x3 = new Matrix3x3([
		[  0.9555766, -0.0230393, 0.0631636 ],
		[ -0.0282895,  1.0099416, 0.0210077 ],
		[  0.0122982, -0.0204830, 1.3299098 ]
	]);
	/** X component value */
	public readonly x: number;
	/** Y component value */
	public readonly y: number;
	/** Z component value */
	public readonly z: number;
	/** Initializes the object with its component values
	  * @param {number} x - x component value
	  * @param {number} y - y component value
	  * @param {number} z - z component value
	  */
	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	/** Parses a string in xzy(x,y,z) format into an XYZ colour
	  * @param {string} s - colour string to parse
	  * @param {XYZ} parsed colour or undefined if s cannot be parsed
	  */
	public static parseString(s: string): XYZ|undefined {
		let m = XYZ.Pattern.exec(s);
		if(m) {
			return new XYZ(Component.parseNumber(m[1]), Component.parseNumber(m[2]), Component.parseNumber(m[3]));
		} else {
			return undefined;
		}
	}
	/** Formats this colour as a string in xyz(x,y,z) format
	  * @param {number} precision - decimal place value to which components will be formatted
	  * @return {string} formatted colour string
	  */
	public toString(precision: number = XYZ.PRECISION): string {
		let x: string = Component.formatNumber(this.x, precision);
		let y: string = Component.formatNumber(this.y, precision);
		let z: string = Component.formatNumber(this.z, precision);
		return `xyz(${x},${y},${z})`;
	}
	/** Mulitplies this colour by a matrix and returns the result
	  * @param {Matrix3x3} m - a 3x3 matrix used as the multiplicand
	  * @return {XYZ} the result of m * this
	  *
	  * Use this function along with the D50 and D65 constants to convert colours from different
	  * whitepoints.
	  */
	public multiply(m: Matrix3x3): XYZ {
		return new XYZ(
			m.r1c1 * this.x + m.r1c2 * this.y + m.r1c3 * this.z,
			m.r2c1 * this.x + m.r2c2 * this.y + m.r2c3 * this.z,
			m.r3c1 * this.x + m.r3c2 * this.y + m.r3c3 * this.z
		);
	}
	/** Converts a colour from Linear RGB space to XYZ space
	  * @param {Linear} rgb - a colour in linear RGB space
	  * @return {XYZ} the given rgb colour in XYZ space
	  */
	public static fromLinear(rgb: Linear): XYZ {
		return new XYZ(rgb.r, rgb.g, rgb.b).multiply(XYZ.FromLinear);
	}
	/** Converts this colour to Linear RGB space
	  * @return {Linear} this colour in Linear RGB space
	  */
	public toLinear(): Linear {
		let lin: XYZ = this.multiply(XYZ.ToLinear);
		return new Linear(lin.x, lin.y, lin.z);
	}
	/** Returns true if this colour is equal to another
	  * @param {XYZ} c - another colour
	  * @param {number} epsilon - maximum difference in component values for a colour to be
	  *                           considered “equal”
	  * @return {boolean} true if this colour is equal to c
	  */
	public equalTo(c: XYZ, epsilon: number = XYZ.PRECISION): boolean {
		return Component.equalTo(this.x, c.x, epsilon)
			&& Component.equalTo(this.y, c.y, epsilon)
			&& Component.equalTo(this.z, c.z, epsilon);
	}
	/** An “empty” XYZ instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: XYZ = new XYZ(NaN,NaN,NaN);
	/** Returns true if this XYZ instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.x) && Number.isNaN(this.y) && Number.isNaN(this.z);
	}
}
