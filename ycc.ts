/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import Linear from './linear';

/** YcCbcCrc (constant luminance) colour space based on ITU-R BT.2020 */
export default class YCC {
	public static readonly PRECISION: number = 1e-4;
	private static readonly Pattern: RegExp = /ycc\(\s*((?:0|[1-9]\d{0,3})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,3})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,3})(?:\.\d+)?%?)\s*\)/;
	/** The Yc' (constant luminance) luma component over the range [0.0,1.0] */
	public readonly yc: number;
	/** The Cbc (constant luminance blue-difference) chroma component over the range [-0.5,+0.5] */
	public readonly cbc: number;
	/** The Crc (constant luminance red-difference) chroma component over the range [-0.5,+0.5] */
	public readonly crc: number;
	/** The 12-bit quantization of the Yc' (constant luminance) luma component over the range
	  * [256,3760] */
	public get Yc(): number {
		return Math.trunc((219.0 * this.yc + 16.0) * 16.0);
	}
	/** The 12-bit quantization of the Crc (constant luminance blue-difference) chroma component
	  * over the range [256,3840] */
	public get Cbc(): number {
		return Math.trunc((224.0 * this.cbc + 128.0) * 16.0);
	}
	/** The 12-bit quantization of the Crc (constant luminance red-difference) chroma component over
	  * the range [256,3840] */
	public get Crc(): number {
		return Math.trunc((224.0 * this.crc + 128.0) * 16.0);
	}
	/** Initializes the object with component values
	  * @param {number} y - the Yc' (constant luminance) luma component over the range [0.0,1.0]
	  * @param {number} cb - the Cbc' (constant luminance blue-difference) chroma component over the
	  *                      range [-0.5,+0.5]
	  * @param {number} cr - the Crc (constant luminance red-difference) chroma component over the
	  *                      range [-0.5,+0.5]
	  */
	constructor(y: number, cb: number, cr: number) {
		this.yc = y;
		this.cbc = cb;
		this.crc = cr;
	}
	/** Parses a string in ycc(Yc,Cbc,Crc) format
	  * @param {string} s - a string in ycc(Y,Cbc,Crc)
	  * @return {YCC} parsed colour
	  *
	  * The Javascript undefined value is returned if the string could not be parsed.
	  * The string format uses the 12-bit quantizations.
	  */
	public static parseString(s: string): YCC|undefined {
		let m = YCC.Pattern.exec(s);
		if(m) {
			return new YCC(
				(Component.parseNumber(m[1]) / 16.0 - 16.0) / 219.0,
				(Component.parseNumber(m[2]) / 16.0 - 128.0) / 224.0,
				(Component.parseNumber(m[3]) / 16.0 - 128.0) / 224.0
			);
		} else {
			return undefined;
		}
	}
	/** Formats this colour a string in ycc(Yc,Cbc,Crc) format
	  * @return {string} string representation of this colour
	  *
	  * The string representation uses the 12-bit quantizations.
	  */
	public toString(): string {
		let y: number = this.Yc;
		let b: number = this.Cbc;
		let r: number = this.Crc;
		return `ycc(${y},${b},${r})`;
	}
	/** Compares this colour's component values to those of another testing to see if they are
	  * approximately equal
	  * @param {YCC} ycc - another colour
	  * @param {number} epsilon - maximum difference between component values for colours to be
	  *                           considered equal
	  * @return {boolean} true if the colours are the same, within the threshold
	  */
	public equalTo(ycc: YCC, epsilon: number = YCC.PRECISION): boolean {
		return Component.equalTo(this.yc, ycc.yc, epsilon)
			&& Component.equalTo(this.cbc, ycc.cbc, epsilon)
			&& Component.equalTo(this.crc, ycc.crc, epsilon);
	}
	/** Converts a colour from linear RGB to YCC colour space
	  * @param {Linear} rgb - colour in Linear RGB colour space
	  * @return {YCC} colour in YCC colour space
	  */
	public static fromLinear(rgb: Linear): YCC {
		let y: number = 0.2627 * rgb.r + 0.6780 * rgb.g + 0.0593 * rgb.b;
		let db: number = rgb.b - y;
		let b: number = db / ((db <= 0) ? 1.9404 : 1.582);
		let dr: number = rgb.r - y;
		let r: number = dr / ((dr <= 0) ? 1.7182 : 0.9938)
		return new YCC(y, b, r);
	}
	/** Converts this colour to Linear RGB colour space
	  * @return {Linear} linear RGB colour space
	  */
	public toLinear(): Linear {
		return new Linear(
			this.yc + 0.7373 * this.crc,
			this.yc - 0.0822765634218289 * this.cbc - 0.2856765634218289 * this.crc,
			this.yc + 0.9407 * this.cbc
		);
	}
	/** An “empty” YCC instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: YCC = new YCC(NaN,NaN,NaN);
	/** Returns true if this YCC instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.yc) && Number.isNaN(this.cbc) && Number.isNaN(this.crc);
	}
}
