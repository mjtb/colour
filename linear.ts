/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import RGB from './rgb';

/** An RGB triplet in linear RGB colour space (i.e., without sRGB companding) over the range [0.0, 1.0]
  *
  * Under normal circumstances, a D65 whitepoint is assumed as this is the whitepoint used in sRGB.
  */
export default class Linear {
	/** Decimal place value to which component values will be rounded when formatted as strings */
	public static readonly PRECISION: number = 1e-6;
	private static readonly Pattern: RegExp = /lin\(\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*\)/;
	/** Red component value in the floating-point range [0.0, 1.0] */
	public readonly r: number;
	/** Green component value in the floating-point range [0.0, 1.0] */
	public readonly g: number;
	/** Blue component value in the floating-point range [0.0, 1.0] */
	public readonly b: number;
	/** Constructs the object from its floating-point component values
	  * @param {number} red - red component value in the floating-point range [0.0, 1.0]
	  * @param {number} green - green component value in the floating-point range [0.0, 1.0]
	  * @param {number} bblue - blue component value in the floating-point range [0.0, 1.0]
	  */
	constructor(red: number, green: number, blue: number) {
		this.r = red;
		this.g = green;
		this.b = blue;
	}
	/** Parses a string in the lin(r,g,b) decimal format
	  * @param {string} s - a colour in decimal
	  * @return {Linear} parsed RGB value (or undefined if the string provided could not be parsed)
	  */
	public static parseString(s: string): Linear | undefined {
		let m = Linear.Pattern.exec(s);
		if(m) {
			return new Linear(Component.parseNumber(m[1]), Component.parseNumber(m[2]), Component.parseNumber(m[3]));
		} else {
			return undefined;
		}
	}
	/** Formats this colour in lin(r,g,b) decimal format
  	  * @param {number} precision - decimal place value to which components will be formatted
	  * @return {string} rgb colour string
	  */
	public toString(precision: number = Linear.PRECISION): string {
		let r: string = Component.formatNumber(this.r, precision);
		let g: string = Component.formatNumber(this.g, precision);
		let b: string = Component.formatNumber(this.b, precision);
		return `lin(${r},${g},${b})`;
	}
	/** Reverses the effect of sRGB companding on a component value
	  * @param {number} V - companded (sRGB) component value
	  * @return {number} component value in linear space
	  */
	public static toLinear(v: number): number {
		if(v <= 0.04045) {
			return v / 12.92;
		} else {
			return Math.pow((v + 0.055) / 1.055, 2.4);
		}
	}
	/** Applies sRGB companding to a component value
	  * @param {number} V - linear RGB component value
	  * @return {number} componet value in companded (sRGB) space
	  */
	public static fromLinear(V: number): number {
		if(V <= 0.0031308) {
			return 12.92 * V;
		} else {
			return 1.055 * Math.pow(V, 1 / 2.4) - 0.055;
		}
	}
	/** Converts this colour from linear to companded (sRGB) space
	  * @return {RGB} companded colour values
	  */
	public toRGB(): RGB {
		return new RGB(
			Math.max(0.0, Math.min(1.0, Linear.fromLinear(this.r))),
			Math.max(0.0, Math.min(1.0, Linear.fromLinear(this.g))),
			Math.max(0.0, Math.min(1.0, Linear.fromLinear(this.b)))
		);
	}
	/** Converts a companded (sRGB) colour to linear space
	  * @param {RGB} rgb - an sRGB colour
	  * @return {Linear} uncompanded colour in Linear RGB space
	  */
	public static fromRGB(rgb: RGB) : Linear {
		return new Linear(
			Linear.toLinear(rgb.r),
			Linear.toLinear(rgb.g),
			Linear.toLinear(rgb.b)
		);
	}
	/** Returns true if this colour is the same as another
	  * @param {Linear} b - another Linear RGB triplet
	  * @param {number} epsilon - maximum difference between components to still be considered
	  *                           “equal”
	  * @return {boolean} true if this colour and b are equal
	  */
	public equalTo(b: Linear, epsilon: number = Linear.PRECISION): boolean {
		return Component.equalTo(this.r, b.r, epsilon)
			&& Component.equalTo(this.g, b.g, epsilon)
			&& Component.equalTo(this.b, b.b, epsilon);
	}
	/** An “empty” Linear RGB instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: Linear = new Linear(NaN,NaN,NaN);
	/** Returns true if this Linear RGB instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.r) && Number.isNaN(this.g) && Number.isNaN(this.b);
	}
}
