/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import XYZ from './xyz';

/** Defines a colour in CIE XYZ (tristimulus) colour space
  *
  * Under normal circumstances, a D65 whitepoint is assumed as this is the whitepoint used in sRGB.
  */
export default class XYY {
	/** Decimal place position to which component values are rounded */
	public static readonly PRECISION: number = 1e-6;
	private static readonly Pattern: RegExp = /xyy\(\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*\)/;
	/** X component value */
	public readonly x: number;
	/** Y component value */
	public readonly y: number;
	/** Z component value */
	public readonly Y: number;
	/** Initializes the object with its component values
	  * @param {number} x - x component value
	  * @param {number} y - y component value
	  * @param {number} Y - Y component value
	  */
	constructor(x: number, y: number, Y: number) {
		this.x = x;
		this.y = y;
		this.Y = Y;
	}
	/** Parses a string in xyy(x,y,y) format into an XYZ colour
	  * @param {string} s - colour string to parse
	  * @param {XYY} parsed colour or undefined if s cannot be parsed
	  */
	public static parseString(s: string): XYY|undefined {
		let m = XYY.Pattern.exec(s);
		if(m) {
			return new XYY(Component.parseNumber(m[1]), Component.parseNumber(m[2]), Component.parseNumber(m[3]));
		} else {
			return undefined;
		}
	}
	/** Formats this colour as a string in xyy(x,y,Y) format
	  * @param {number} precision - decimal place value to which components will be formatted
	  * @return {string} formatted colour string
	  */
	public toString(precision: number = XYY.PRECISION): string {
		let x: string = Component.formatNumber(this.x, precision);
		let y: string = Component.formatNumber(this.y, precision);
		let z: string = Component.formatNumber(this.Y, precision);
		return `xyy(${x},${y},${z})`;
	}
	/** Converts a colour from XYZ space to XYY space
	  * @param {XYZ} xyz - a colour in linear XYZ space
	  * @return {XYY}} the given xyz colour in XYY space
	  */
	 public static fromXYZ(xyz: XYZ): XYY {
		return new XYY(xyz.x / (xyz.x + xyz.y + xyz.z), xyz.y / (xyz.x + xyz.y + xyz.z), xyz.y);
	}
	/** Converts this colour to XYZ space
	  * @return {XYZ} this colour in Linear RGB space
	  */
	public toXYZ(): XYZ {
		if(Component.equalTo(this.y, 0.0, XYY.PRECISION)) {
			return XYZ.EMPTY;
		} else {
			return new XYZ(this.x * this.Y / this.y, this.Y, (1 - this.x - this.y) * this.Y / this.y);
		}
	}
	/** Returns true if this colour is equal to another
	  * @param {XYZ} c - another colour
	  * @param {number} epsilon - maximum difference in component values for a colour to be
	  *                           considered “equal”
	  * @return {boolean} true if this colour is equal to c
	  */
	public equalTo(c: XYY, epsilon: number = XYY.PRECISION): boolean {
		return Component.equalTo(this.x, c.x, epsilon)
			&& Component.equalTo(this.y, c.y, epsilon)
			&& Component.equalTo(this.Y, c.Y, epsilon);
	}
	/** An “empty” XYZ instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: XYY = new XYY(NaN,NaN,NaN);
	/** Returns true if this XYZ instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.x) && Number.isNaN(this.y) && Number.isNaN(this.Y);
	}
}
