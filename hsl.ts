/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import RGB from './rgb';

/** A colour in HSL (hue-saturation-lightness) colour space. */
export default class HSL {
	/** Decimal place value to which component values will be rounded when formatted as strings */
	public static readonly PRECISION:number = 1e-2;

	private static readonly Pattern: RegExp = /hsl\(\s*((?:(?:0|[1-9]\d{0,2})(?:\.\d+)?)(?:°|deg|rad)?)\s*,\s*((?:(?:0|[1-9]\d{0,2})(?:\.\d+)?)%?)\s*,\s*((?:(?:0|[1-9]\d{0,2})(?:\.\d+)?)%?)\s*\)/;

	/** Hue angle over the range [0.0,1.0] where 0.0 corresponds to 0 rad and 1.0 corresponds to
	  * 2π rad */
	public readonly h: number;
	/** Saturation over the range [0.0,1.0] */
	public readonly s: number;
	/** Lightness over the range [0.0,1.0] */
	public readonly l: number;

	/** Hue angle over the range [0°, 360°] */
	public get H(): number {
		return Math.min(360, Math.max(0, Math.round(this.h * 360.0)));
	}
	/** Saturation over the range [0%, 100%] */
	public get S(): number {
		return Math.min(100, Math.max(0, this.s * 100.0));
	}
	/** Lightness over the rnage [0%, 100%] */
	public get L(): number {
		return Math.min(100, Math.max(0, this.l * 100.0));
	}

	/** Initializes the object with the given hue, saturation and luminosity
	  * @param {number} hue - hue angle over the range [0.0,1.0] where 0.0 corresponds to 0 rad and
	  *                       1.0 corresponds to 2π rad
	  * @param {number} saturation - saturation over the range [0.0,1.0]
	  * @param {number} lightness - lightness over the rnage [0.0,1.0]
	  */
	public constructor(hue: number, saturation: number, lightness: number) {
		this.h = hue;
		this.s = saturation;
		this.l = lightness;
	}

	/** Parses a string in hsl(number|angle, percentage, percentage) format
	  * @param {string} s - hsl string to parse
	  * @return {HSL} parsed colour
	  *
	  * The Javascript undefined value is returned if s cannot be parsed.
	  */
	public static parseString(s: string): HSL|undefined {
		let m: any = HSL.Pattern.exec(s);
		if(!m) {
			return undefined;
		}
		return new HSL(
			Component.parseNumber(m[1], 360),
			Component.parseNumber(m[2]),
			Component.parseNumber(m[3]));
	}

	/** Converts a colour from sRGB colour space to HSL colour space
	  * @param {RGB} rgb - colour to convert
	  * @return {HSL} converted colour
	  */
	public static fromRGB(rgb: RGB): HSL {
		let M: number = Math.max(Math.max(rgb.r, rgb.g), rgb.b);
        let m: number = Math.min(Math.min(rgb.r, rgb.g), rgb.b);
		let C: number = M - m;
		let h: number;
        if(C == 0) {
            h = 0;
        } else if(M == rgb.r) {
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
		if(h == 1) {
			h = 0;
		}
        let l: number = 0.5 * (M + m);
		let s: number;
        if(l == 0 || l == 1) {
            s = 0;
        } else {
            s = C / (1 - Math.abs(2 * l - 1));
        }
		return new HSL(h, s, l);
	}

	/** Formats this colour in hsl(number|angle, percentage, percentage) form.
	  * @param {number} precision - decimal place to which components will be formatted
	  * @return {string} string in hsl() format
	  */
	public toString(precision: number = HSL.PRECISION): string {
		let h: string = Component.formatNumber(this.h * 360.0, precision);
		let s: string = Component.formatNumber(this.s * 100.0, precision);
		let l: string = Component.formatNumber(this.l * 100.0, precision);
		return `hsl(${h},${s}%,${l}%)`;
	}

	private static rho(m1: number, m2: number, h: number): number {
        if(h < 0) {
            h += 1;
        }
        if(h > 1) {
            h -= 1;
        }
        if(h*6 < 1) {
            return m1 + (m2 - m1) * h * 6;
        } else if(h*2 < 1) {
            return m2;
        } else if(h*3 < 2) {
            return m1 + (m2 - m1) * (2.0 / 3.0 - h) * 6;
        } else {
            return m1;
        }
    }

	/** Converts this colour from HSL to RGB colour space.
	  * @return {RGB} an RGB colour
	  */
	public toRGB(): RGB {
		let m2: number = this.l <= 0.5
			? this.l * (this.s + 1)
			: (this.l + this.s - this.l * this.s);
        let m1: number = this.l * 2 - m2;
		return new RGB(
			HSL.rho(m1, m2, this.h + 1.0 / 3.0),
			HSL.rho(m1, m2, this.h),
			HSL.rho(m1, m2, this.h - 1.0 / 3.0)
		);
	}

	/** Returns true if this colour is the same as another
	  * @param {HSL} b - another HSL triplet
	  * @param {number} epsilon - maximum difference between components to still be considered
	  *                           “equal”
	  * @return {boolean} true if this colour and b are equal
	  */
	public equalTo(b: HSL, epsilon: number = HSL.PRECISION): boolean {
		return Component.equalTo(this.h, b.h, epsilon)
			&& Component.equalTo(this.s, b.s, epsilon)
			&& Component.equalTo(this.l, b.l, epsilon);
	}
	/** An “empty” HSL instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: HSL = new HSL(NaN,NaN,NaN);
	/** Returns true if this HSL instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.h) && Number.isNaN(this.s) && Number.isNaN(this.l);
	}
}
