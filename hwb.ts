/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import RGB from './rgb';
import HSL from './hsl';

/** A colour in HWB (hue-whiteness-blackness) colour space */
export default class HWB {
	/** Decimal place value to which component values will be rounded when formatted as strings */
	public static readonly PRECISION:number = 1e-2;

	private static readonly Pattern: RegExp = /hwb\(\s*((?:(?:0|[1-9]\d{0,2})(?:\.\d+)?)(?:°|deg|rad|grad)?)\s*,\s*((?:(?:0|[1-9]\d{0,2})(?:\.\d+)?)%?)\s*,\s*((?:(?:0|[1-9]\d{0,2})(?:\.\d+)?)%?)\s*\)/;

	/** Hue angle over the range [0.0,1.0] where 0.0 corresponds to 0 rad and 1.0 corresponds to
	  * 2π rad */
	public readonly h: number;
	/** Whiteness over the range [0.0,1.0] */
	public readonly w: number;
	/** Blackness over the range [0.0,1.0] */
	public readonly b: number;
	/** Hue angle over the range [0.0°, 360.0°] */
	public get H(): number {
		return Math.min(360, Math.max(0, Math.round(this.h * 360.0)));
	}
	/** Whiteness over the range [0%, 100%] */
	public get W(): number {
		return Math.min(100, Math.max(0, this.w * 100.0));
	}
	/** Blackness over the range [0%, 100%] */
	public get B(): number {
		return Math.min(100, Math.max(0, this.b * 100.0));
	}
	/** Initialize the object with given component values
	  * @param {number} hue - hue angle over the range [0,0, 1.0] where 0.0 corresponds to 0 rad and
	  *                       1.0 corresponds to 2π rad
	  * @param {number} whiteness - whiteness value over the range [0.0,1.0]
	  * @param {number} blackness - blackness value over the range [0.0,1.0]
	  */
	constructor(hue: number, whiteness: number, blackness: number) {
		this.h = hue;
		this.w = whiteness;
		this.b = blackness;
	}
	/** Parses a string in hwb(h, w, b) format
	  * @param {string} s - string to parse
	  * @return {HWB} parsed colour
	  *
	  * The Javascript undefined value is returned if the string cannot be parsed.
	  */
	public static parseString(s: string): HWB|undefined {
		let m: any = HWB.Pattern.exec(s);
		if(!m) {
			return undefined;
		}
		return new HWB(
			Component.parseNumber(m[1],360),
			Component.parseNumber(m[2]),
			Component.parseNumber(m[3])
		);
	}
	/** Formats this colour as a string in hwb(h, w%, b%) format
	  * @param {number} precision - decimal place value to which components will be formatted
	  * @return {string} a string in hwb(h, w%, b%) format
	  */
	public toString(precision: number = HWB.PRECISION): string {
		let h: string = Component.formatNumber(this.h * 360.0, precision);
		let w: string = Component.formatNumber(this.w * 100.0, precision);
		let b: string = Component.formatNumber(this.b * 100.0, precision);
		return `hwb(${h},${w}%,${b}%)`;
	}
	/** Returns true if this colour’s components are equal to another colour’s components, within
	  * a given threshold
	  * @param {HWB} hwb - another colour
	  * @param {number} epsilon - maximum difference in component value for the colours to be
	  *                           considered equal
	  * @return {boolean} true if this colour and hwb are equal, within tolerance
	  */
	public equalTo(hwb: HWB, epsilon: number = HWB.PRECISION): boolean {
		return Component.equalTo(this.h, hwb.h, epsilon)
			&& Component.equalTo(this.w, hwb.w, epsilon)
			&& Component.equalTo(this.b, hwb.b, epsilon);
	}
	/** Converts a colour from sRGB to HWB colour space
	  * @param {RGB} rgb - a colour in sRGB colour space
	  * @return {HWB} the converted colour
	  */
	public static fromRGB(rgb: RGB): HWB {
		let M: number = Math.max(Math.max(rgb.r, rgb.g), rgb.b);
		let m: number = Math.min(Math.min(rgb.r, rgb.g), rgb.b);
		let C: number = M - m;
		let h: number;
		if(!C)	{
			h = 0;
		} else if(M === rgb.r) {
			h = (rgb.g - rgb.b) / C;
		} else if(M == rgb.g) {
			h = (rgb.b - rgb.r) / C + 2;
		} else {
			h = (rgb.r - rgb.g) / C + 4;
		}
		h %= 6;
		while(h < 0) {
			h += 6;
		}
		h /= 6;
		if(h === 1) {
			h = 0;
		}
		let V: number = M;
		let S: number = !C ? 0 : (C / V);
		let w: number = (1 - S) * V;
		let b: number = 1 - V;
		return new HWB(h,w,b);
	}
	/** Converts this colour from HWB to sRGB colour space
	  * @return {RGB} this colour in sRGB colour space
	  */
	public toRGB(): RGB {
		let W: number = this.w;
		let B: number = this.b;
		let t: number = W + B;
		if(t > 1) {
			W /= t;
			B /= t;
		}
		t = 1 - W - B;
		let hsl: HSL = new HSL(this.h, 1, 0.5);
		let rgb: RGB = hsl.toRGB();
		return new RGB(rgb.r * t + W, rgb.g * t + W, rgb.b * t + W);
	}
	/** An “empty” HWB instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: HWB = new HWB(NaN,NaN,NaN);
	/** Returns true if this HWB instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.h) && Number.isNaN(this.w) && Number.isNaN(this.b);
	}
};
