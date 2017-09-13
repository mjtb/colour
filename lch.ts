/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import LAB from './lab';

/** Represents a colour in CIE L*C*h* colour space, which is the polar coordinate version of
  * CIE L*a*b* colour space  */
export default class LCH {
	/** Default precision to which components will be formatted as strings */
	public static readonly PRECISION: number = 1e-2;
	private static readonly Pattern: RegExp = /lch\(\s*((?:-|\+)?(?:0|[1-9]\d{0,2})(?:\.\d+)?|\*)\s+((?:-|\+)?(?:0|[1-9]\d{0,2})(?:\.\d+)?|\*)\s+((?:-|\+)?(?:0|[1-9]\d{0,2})(\.\d+)?|\*)\s*\)/;
	/** The L* (lightness) component value, which typically varies over the range
	  * [0.0 (black), 100.0 (white)] */
	public readonly l: number;
	/** The C* (chromacity) component value, which typically varies over the range
	    [0.0 achromatic/grey, 132.0 strongly chromatic] */
	public readonly c: number;
	/** The h* (hue angle) component value, which typically varies of the range [0.0, 360.0] where
	  * 0.0 is red, 90.0 is yelow, 180.0 is green, and 270.0 is blue */
	public readonly h: number;
	/** Initializes the object with component values
	  * @param {number} l - the L* component value over the range [0.0, 100.0]
	  * @param {number} c - the C* component value, typically over the range [0.0, 132.0]
	  * @param {number} h - the h* component value over the range [0.0, 360.0]
	  */
	constructor(l: number, c: number, h: number) {
		this.l = l;
		this.c = c;
		this.h = h;
	}
	/** Parses a string in lch(l c h) format into an LCH colour
	  * @param {string} s - string to format
	  * @return {LCH} parsed colour
	  *
	  * The Javascript undefined value is returned if the string cannot be parsed.
	  */
	public static parseString(s: string): LCH|undefined {
		let m = LCH.Pattern.exec(s);
		if(m) {
			return new LCH(
				Component.parseNumber(m[1]),
				Component.parseNumber(m[2]),
				Component.parseNumber(m[3])
			);
		} else {
			return undefined;
		}
	}
	/** Formats this colour a string in the lch(l c h) format
	  * @param {number} precision - decimal place value to which components will be formatted
	  * @return {string} a string in lch(l c h) format
	  */
	public toString(precision: number = LCH.PRECISION): string {
		let l: string = Component.formatNumber(this.l, precision);
		let c: string = Component.formatNumber(this.c, precision);
		let h: string = Component.formatNumber(this.h, precision);
		return `lch(${l} ${c} ${h})`;
	}
	/** Compares this colour to another, returning true if all components are within a given
	  * difference
	  * @param {LAB} lab - a colour to test for equality
	  * @param {number} epsilon - maximum difference allowed in component values
	  * @return {boolean} true if this colour and the lab colour are “equal” to within the given
	  *                   tolerance
	  */
	public equalTo(lch: LCH, epsilon: number = LCH.PRECISION): boolean {
		return Component.equalTo(this.l, lch.l, epsilon)
			&& Component.equalTo(this.c, lch.c, epsilon)
			&& Component.equalTo(this.h, lch.h, epsilon);
	}
	/** Converts a colour from LAB colour space to LCH
	  * @param {LAB} lab - a colour in LAB colour space
	  * @return {LCH} the lab colour in polar LCH coordinates
	  */
	public static fromLAB(lab: LAB): LCH {
		let l: number = lab.l;
		let c: number = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
		let h: number = 180.0 / Math.PI * Math.atan2(lab.b, lab.a);
		while(h < 0) {
			h += 360;
		}
		while(h >= 360)	{
			h -= 360;
		}
		return new LCH(l, c, h);
	}
	/** Converts this colour from LCH polar coordinates to LAB colour space
	  * @return {LAB} this colour in LAB coordinates
	  */
	public toLAB(): LAB {
		let rad: number = Math.PI / 180.0 * this.h;
		return new LAB(this.l, this.c * Math.cos(rad), this.c * Math.sin(rad));
	}
	/** An “empty” LCH instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: LCH = new LCH(NaN,NaN,NaN);
	/** Returns true if this LCH instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.l) && Number.isNaN(this.c) && Number.isNaN(this.h);
	}
};
