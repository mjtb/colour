/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import Linear from './linear';

/** A colour in ITU T.871 (JPEG) Y'CbCr (YUV) colour space */
export default class YUV {
	/** Default precision to which components will be formatted as strings */
	public static readonly PRECISION = 1e-2;
	private static readonly Pattern: RegExp = /yuv\(\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*,\s*((?:0|[1-9]\d{0,2})(?:\.\d+)?%?)\s*\)/;
	/** The Y' (luminance) component value over the range [0.0 black, 1.0 white] */
	public readonly y: number;
	/** The Cb (blue-difference) chroma component value over the range [-0.5, +0.5] */
	public readonly u: number;
	/** The Cr (red-difference) chroma component value over the range [-0.5, +0.5] */
	public readonly v: number;
	/** The Y' (luminance) componet value over the range [0 black, 255 white] */
	public get Y(): number {
		return Math.min(255, Math.max(0, Math.round(this.y * 255.0)));
	}
	/** The Cb (blue-difference) chroma component value over the range [0, 255] */
	public get U(): number {
		return Math.min(255, Math.max(0, Math.round((this.u + 0.5) * 255.0)));
	}
	/** The Cr (red-difference) chroma component value over the range [0, 255] */
	public get V(): number {
		return Math.min(255, Math.max(0, Math.round((this.v + 0.5) * 255.0)));
	}
	/** Initializes the object with component values
	  * @param {number} y - the Y' component value over the range [0.0, 1.0]
	  * @param {number} u - the Cb component value over the range [-0.5, +0.5]
	  * @param {number} v - the Cr component value over the range [-0.5, +0.5]
	  */
	constructor(y: number, u: number, v: number) {
		this.y = y;
		this.u = u;
		this.v = v;
	}
	/** Parses a string in yuv(y,u,v) format into an LCH colour
	  * @param {string} s - string to format
	  * @return {YUV} parsed colour
	  *
	  * The Javascript undefined value is returned if the string cannot be parsed.
	  */
	public static parseString(s: string): YUV|undefined {
		let m = YUV.Pattern.exec(s);
		if(m) {
			return new YUV(
				Component.parseNumber(m[1]) / 255.0,
				Component.parseNumber(m[2]) / 255.0 - 0.5,
				Component.parseNumber(m[3]) / 255.0 - 0.5
			);
		} else {
			return undefined;
		}
	}
	/** Formats this colour a string in the yuv(Y,U,V) format
	  * @return {string} a string in yuv(Y,U,V) format
	  */
	public toString(): string {
		let y: string = Component.formatNumber(this.Y);
		let u: string = Component.formatNumber(this.U);
		let v: string = Component.formatNumber(this.V);
		return `yuv(${y},${u},${v})`;
	}
	/** Compares this colour to another, returning true if all components are within a given
	  * difference
	  * @param {YUV} yuv - a colour to test for equality
	  * @param {number} epsilon - maximum difference allowed in component values
	  * @return {boolean} true if this colour and the lab colour are “equal” to within the given
	  *                   tolerance
	  */
	public equalTo(yuv: YUV, epsilon: number = YUV.PRECISION): boolean {
		return Component.equalTo(this.y, yuv.y, epsilon)
			&& Component.equalTo(this.u, yuv.u, epsilon)
			&& Component.equalTo(this.v, yuv.v, epsilon);
	}
	/** Converts a colour in Linear RGB space to YUV colour space
	  * @param {Linear} rgb - a colour in Linear (gamma corrected) RGB colour space
	  * @return {YUV} colour in YUV space
	  */
	public static fromLinear(rgb: Linear): YUV {
		let y: number =   0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
		let u: number = (-0.299 * rgb.r - 0.587 * rgb.g + 0.886 * rgb.b) / 1.772;
		let v: number = ( 0.701 * rgb.r - 0.587 * rgb.g - 0.114 * rgb.b) / 1.402;
		return new YUV(y, u, v);
	}
	/** Converts this colour from YUV colour space to Linear RGB colour space
	  * @return {Linear} this colour in Linear RGB colour space
	  */
	public toLinear(): Linear {
		let r: number = this.y + 1.402 * this.v;
		let g: number = this.y - (0.114 * 1.772 * this.u + 0.299 * 1.402 * this.v) / 0.587;
		let b: number = this.y + 1.772 * this.u;
		return new Linear(r, g, b);
	}
	/** An “empty” YUV instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: YUV = new YUV(NaN,NaN,NaN);
	/** Returns true if this YUV instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.y) && Number.isNaN(this.u) && Number.isNaN(this.v);
	}
};
