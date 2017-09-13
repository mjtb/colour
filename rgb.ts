/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';

/** An RGB triplet in companded (sRGB) colour space over the range [0.0, 1.0] */
export default class RGB {
	/** Decimal place value to which component values will be rounded when formatted as strings */
	public static readonly PRECISION: number = 1e-2;
	private static readonly HEX6: RegExp = /\#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/;
	private static readonly HEX6A: RegExp = /\#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/;
	private static readonly DEC: RegExp = /rgb\(\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*\)/;
	private static readonly DECA: RegExp = /rgba\(\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*\)/;
	private static readonly HEX3: RegExp = /\#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])/;
	/** Red component value in the floating-point range [0.0, 1.0] */
	public readonly r: number;
	/** Green component value in the floating-point range [0.0, 1.0] */
	public readonly g: number;
	/** Blue component value in the floating-point range [0.0, 1.0] */
	public readonly b: number;
	/** Red component value in the integer range [0, 255] */
	public get R(): number {
		return Math.max(0, Math.min(255, Math.round(this.r * 255)));;
	}
	/** Green component value in the integer range [0, 255] */
	public get G(): number {
		return Math.max(0, Math.min(255, Math.round(this.g * 255)));;
	}
	/** Blue component value in the integer range [0, 255] */
	public get B(): number {
		return Math.max(0, Math.min(255, Math.round(this.b * 255)));;
	}
	/** Constructs the object from its floating-point component values
	  * @param {number} red - red component value in the floating-point range [0.0, 1.0]
	  * @param {number} green - green component value in the floating-point range [0.0, 1.0]
	  * @param {number} blue - blue component value in the floating-point range [0.0, 1.0]
	  */
	constructor(red: number, green: number, blue: number) {
		this.r = red;
		this.g = green;
		this.b = blue;
	}
	/** Parses a string in the six-digit #RRGGBB or eight-digit #RRGGBBAA hexadecimal format
	  * @param {string} s - a colour in hex
	  * @return {RGB} parsed RGB value (or undefined if the string provided could not be parsed)
	  * The alpha, when provided in an #RRGGBBAA string, is discarded.
	  */
	public static parseHexString6(s: string): RGB | undefined {
		let m = RGB.HEX6.exec(s);
		if(m) {
			return new RGB(
				Number.parseInt(m[1], 16) / 255.0,
				Number.parseInt(m[2], 16) / 255.0,
				Number.parseInt(m[3], 16) / 255.0
			);
		} else {
			return undefined;
		}
	}
	/** Parses a string in the three-digit #RGB hexadecimal format
	  * @param {string} s - a colour in hex
	  * @return {RGB} parsed RGB value (or undefined if the string provided could not be parsed)
	  */
	public static parseHexString3(s: string): RGB | undefined {
		let m = RGB.HEX3.exec(s);
		if(m) {
			let r: number = Number.parseInt(m[1], 16);
			let g: number = Number.parseInt(m[2], 16);
			let b: number = Number.parseInt(m[3], 16);
			return new RGB(((r << 4) | r) / 255.0, ((g << 4) | g) / 255.0, ((b << 4) | b) / 255.0);
		}
	}
	/** Parses a string in hexadecimal format
	  * @param {string} s - a colour in #RRGGBB, #RRGGBBAA or #RGB format
	  * @return {RGB} parsed RGB value (or undefined if the string provided could not be parsed)
	  * The alpha, when provided in an #RRGGBBAA string, is discarded.
	  */
	public static parseHexString(s: string): RGB | undefined {
		let rv: RGB | undefined;
		rv = RGB.parseHexString6(s);
		if(!rv) {
			rv = RGB.parseHexString3(s);
		}
		return rv;
	}
	/** Parses a string in the rgb(r,g,b), rgb(r%,g%,b%) decimal format (or analogous rgba() format)
	  * @param {string} s - a colour in decimal
	  * @return {RGB} parsed RGB value (or undefined if the string provided could not be parsed)
	  * The alpha, when provided in an rgba() string, is discarded.
	  */
	public static parseRgbString(s: string): RGB | undefined {
		let m = RGB.DEC.exec(s);
		if(!m) {
			m = RGB.DECA.exec(s);
		}
		if(m) {
			return new RGB(Component.parseNumber(m[1], 255, 0), Component.parseNumber(m[2], 255, 0), Component.parseNumber(m[3], 255, 0));
		} else {
			return undefined;
		}
	}
	/** Parses a string in either hexadecimal or decimal format
	  * @param {string} s - a colour
	  * @return {RGB} parsed RGB value (or undefined if the string provided could not be parsed)
	  * The alpha, if provided in an #RRGGBBAA or rgba() string, is discarded.
	  */
	public static parseString(s: string) : RGB | undefined {
		let rv: RGB | undefined;
		rv = RGB.parseHexString(s);
		if(!rv) {
			rv = RGB.parseRgbString(s);
		}
		return rv;
	}
	/** Formats this colour in #RRGGBB or #RGB hexadecimal format
	  * @param {boolean} alwaysHex6 - when true the string returned will always be in #RRGGBB format
	  *                               even if it could have been formatted in #RGB format without
	  *                               loss
	  * @return {string} hex colour string
	  */
	public toHexString(alwaysHex6: boolean = false): string {
		let r: number = this.R;
		let g: number = this.G;
		let b: number = this.B;
		if(
			(((r >> 4) & 0xF) == (r & 0xF))
			&& (((g >> 4) & 0xF) == (g & 0xF))
			&& (((b >> 4) & 0xF) == (b & 0xF))
			&& !alwaysHex6
		) {
			return `#${(r & 0xF).toString(16)}${(g & 0xF).toString(16)}${(b & 0xF).toString(16)}`;
		} else {
			let rs: string = r.toString(16);
			if(rs.length < 2) {
				rs = '0' + rs;
			}
			let gs: string = g.toString(16);
			if(gs.length < 2) {
				gs = '0' + gs;
			}
			let bs: string = b.toString(16);
			if(bs.length < 2) {
				bs = '0' + bs;
			}
			return `#${rs}${gs}${bs}`;
		}
	}
	/** Formats this colour in rgb() decimal format
	  * @param {boolean} alwaysHex6 - when true the string returned will give components as
	  *                               percentages; otherwise they will be given as floating-point
	  *                               numbers in the range [0.0, 255.0].
	  * @return {string} rgb colour string
	  */
	public toRgbString(percent: boolean = false, precision: number = RGB.PRECISION): string {
		if(percent) {
			let r: string = Component.formatNumber(this.r * 100.0, precision);
			let g: string = Component.formatNumber(this.g * 100.0, precision);
			let b: string = Component.formatNumber(this.b * 100.0, precision);
			return `rgb(${r}%,${g}%,${b}%)`;
		} else {
			let r: string = Component.formatNumber(this.r * 255.0);
			let g: string = Component.formatNumber(this.g * 255.0);
			let b: string = Component.formatNumber(this.b * 255.0);
			return `rgb(${r},${g},${b})`;
		}
	}
	/** Returns true if this colour's components are all in the [0.0, 1.0] range */
	public get isClipped(): boolean {
		return this.r >= 0.0
			&& this.r <= 1.0
			&& this.g >= 0.0
			&& this.g <= 1.0
			&& this.b >= 0.0
			&& this.b <= 1.0;
	}
	/** Returns true if this colour's components can be expressed in hex without loss */
	public get isHexable(): boolean {
		return this.isClipped
			&& (Math.trunc(this.r * 255.0) === (this.r * 255.0))
			&& (Math.trunc(this.g * 255.0) === (this.g * 255.0))
			&& (Math.trunc(this.b * 255.0) === (this.b * 255.0));
	}
	/** Returns true if this colour's components can be expressed in 3-digit #rgb hex format without
	    loss */
	public get isHexable3(): boolean {
		if(this.isHexable) {
			let r: number = this.R;
			let g: number = this.G;
			let b: number = this.B;
			return (((r >> 4) & 0xF) === (r & 0xF))
				&& (((g >> 4) & 0xF) === (g & 0xF))
				&& (((b >> 4) & 0xF) === (b & 0xF));
		} else {
			return false;
		}
	}
	/** Returns an RGB value that has this colour's components clipped to the floating-point range
	    [0.0, 1.0] */
	public clip(): RGB {
		if(this.isClipped) {
			return this;
		} else {
			return new RGB(
				Math.max(0.0, Math.min(1.0, this.r)),
				Math.max(0.0, Math.min(1.0, this.g)),
				Math.max(0.0, Math.min(1.0, this.b))
			);
		}
	}
	/** Clips this colour to one that is representable in #rrggbb format without loss
	  * @return {RGB} a colour clipped to #rrggbb format
	  */
	public clip6(): RGB {
		return new RGB(this.R / 255.0, this.G / 255.0, this.B / 255.0);
	}
	private static hex3(V: number): number {
		let a: number = (V & 0xFF) >> 4;
		let b: number = a | (a << 4);
		if(a > 0) {
			let c: number = a - 1;
			let d: number = c | (c << 4);
			if(Math.abs(V - b) > Math.abs(V - c)) {
				a = c;
				b = d;
			}
		}
		if(a < 0xF) {
			let c: number = a + 1;
			let d: number = c | (c << 4);
			if(Math.abs(V - b) > Math.abs(V - c)) {
				a = c;
				b = d;
			}
		}
		return a;
	}
	/** Clips this colour to one that is representable in #rgb format without loss
	  * @return {RGB} a colour clipped to #rgb format
	  */
	public clip3(): RGB {
		let r: number = RGB.hex3(this.R);
		let g: number = RGB.hex3(this.G);
		let b: number = RGB.hex3(this.B);
		return new RGB((r | (r << 4)) / 255.0, (g | (g << 4)) / 255.0, (b | (b << 4)) / 255.0);
	}
	/** Returns this colour as a hex string (if hexable without loss) or else as an rgb() string
	  * @param {number} precision - decimal place value to which components will be formatted
	  * @return {string} formatted string
      */
	public toString(precision: number = RGB.PRECISION): string {
		if(this.isHexable) {
			return this.toHexString();
		} else {
			return this.toRgbString(false, precision);
		}
	}
	/** Returns this colour as a 32-bit integer in ARGB order */
	public toARGB(alpha:number = 0xFF): number {
		let a:number = Math.max(0, Math.min(0xFF, Math.round(alpha)));
		return (this.R << 16) | (this.G << 8) | this.B | (a << 24);
	}
	/** Constructs an RGB value from a colour in 32-bit integer ARGB order */
	public static fromARGB(argb: number): RGB {
		return new RGB(((argb >> 16) & 0xFF) / 255.0, ((argb >> 8) & 0xFF) / 255.0, (argb & 0xFF) / 255.0);
	}
	/** Returns true if this colour is the same as another
	  * @param {RGB} b - another RGB triplet
	  * @param {number} epsilon - maximum difference between components to still be considered
	  *                           “equal”
	  * @return {boolean} true if this colour and b are equal
	  *
	  * If the epsilon parameter is omitted, colours are tested for equality using their natural
	  * component values i.e., 8-bit integer clipped to [0,256). If the epsilon parameter is
	  * specified, colours are tested for equality using their normalized component values
	  * i.e., unclipped floating-point over the range [0.0,1.0].
	  */
	public equalTo(b: RGB, epsilon?: number): boolean {
		if(epsilon === undefined) {
			return (this.R === b.R) && (this.G === b.G) && (this.B === b.B);
		} else {
			return Component.equalTo(this.r, b.r, epsilon)
				&& Component.equalTo(this.g, b.g, epsilon)
				&& Component.equalTo(this.b, b.b, epsilon);
		}
	}
	/** An “empty” RGB instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: RGB = new RGB(NaN,NaN,NaN);
	/** Returns true if this XYZ instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.r) && Number.isNaN(this.g) && Number.isNaN(this.b);
	}
}
