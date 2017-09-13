/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import XYZ from './xyz';
import Component from './component';

/** Represents a colour in CIE L*a*b* colour space (assumes a D50 observer) */
export default class LAB {
	/** Default precision to which components will be formatted as strings */
	public static readonly PRECISION: number = 1e-2;
	/** A value for ΔE*₀₀ purported to be the threshold for “just noticeable difference” */
	public static readonly DELTAE: number = 2.3;
	private static readonly Pattern: RegExp = /lab\(\s*((?:-|\+)?(?:0|[1-9]\d{0,2})(?:\.\d+)?|\*)\s+((?:-|\+)?(?:0|[1-9]\d{0,2})(?:\.\d+)?|\*)\s+((?:-|\+)?(?:0|[1-9]\d{0,2})(\.\d+)?|\*)\s*\)/;
	/** The L* component value, which typically varies over the range [0.0 (black), 100.0 (white)] */
	public readonly l: number;
	/** The a* component value, which typically varies over the range [-80.0 green, 94.0 red] */
	public readonly a: number;
	/** The b* component value, which typically varies over the range [-113.0 blue, 94.0 yellow] */
	public readonly b: number;
	/** Initializes the object with component values
	  * @param {number} l - the L* component value
	  * @param {number} a - the a* component value
	  * @param {number} b - the b* component value
	  */
	constructor(l: number, a: number, b: number) {
		this.l = l;
		this.a = a;
		this.b = b;
	}
	private static readonly K: number = 24389.0 / 27.0;
	private static readonly E: number = 216.0 / 24389.0;
	private static labin(v: number): number {
		if(v > LAB.E) {
			return Math.pow(v, 1.0 / 3.0);
		} else {
			return (LAB.K * v + 16.0) / 116.0;
		}
	}
	/** Converts a tristimulus (XYZ) colour with a D65 observer to L*a*b* (D50 observer) space
	  * @param {XYZ} xyz - a tristimulus value
	  * @return {LAB} converted CIE L*a*b* colour
	  */
	public static fromXYZ(xyz: XYZ): LAB {
		let d50: XYZ = xyz.multiply(XYZ.D50);
		let x: number = LAB.labin(d50.x / 0.9642);
		let y: number = LAB.labin(d50.y);
		let z: number = LAB.labin(d50.z / 0.8249);
		let l: number = (116.0 * y) - 16.0;
		let a: number = 500.0 * (x - y);
		let b: number = 200.0 * (y - z);
		return new LAB(l, a, b);
	}
	private static labout(v: number): number {
		let v3: number = Math.pow(v, 3);
		if(v3 > LAB.E) {
			return v3;
		} else {
			return (116.0 * v - 16.0) / LAB.K;
		}
	}
	/** Converts this colour to a tristimulus (XYZ) value with a D65 observer
	  * @return {XYZ} colour in CIE XYZ colour space
	  */
	public toXYZ(): XYZ {
		let y: number = (this.l + 16.0) / 116.0;
		let x: number = this.a / 500.0 + y;
		let z: number = y - this.b / 200.0;
		let X: number = LAB.labout(x) * 0.9642;
	 	let Y: number = (this.l > (LAB.K * LAB.E)
			? Math.pow((this.l + 16.0) / 116.0, 3)
			: (this.l / LAB.K));
		let Z: number = LAB.labout(z) * 0.8249;
		let d50: XYZ = new XYZ(X, Y, Z);
		return d50.multiply(XYZ.D65);
	}
	/** Parses a string in lab(l a b) format into a LAB colour
	  * @param {string} s - string to format
	  * @return {LAB} parsed colour
	  *
	  * The Javascript undefined value is returned if the string cannot be parsed.
	  */
	public static parseString(s: string): LAB|undefined {
		let m = LAB.Pattern.exec(s);
		if(m) {
			return new LAB(
				Component.parseNumber(m[1]),
				Component.parseNumber(m[2]),
				Component.parseNumber(m[3])
			);
		} else {
			return undefined;
		}
	}
	/** Formats this colour a string in the lab(l a b) format
	  * @param {number} precision - decimal place value to which components will be formatted
	  * @return {string} a string in lab(l a b) format
	  */
	public toString(precision: number = LAB.PRECISION): string {
		let l: string = Component.formatNumber(this.l, precision);
		let a: string = Component.formatNumber(this.a, precision);
		let b: string = Component.formatNumber(this.b, precision);
		return `lab(${l} ${a} ${b})`;
	}
	/** Compares this colour to another, returning true if all components are within a given
	  * difference
	  * @param {LAB} lab - a colour to test for equality
	  * @param {number} epsilon - maximum difference allowed in component values
	  * @return {boolean} true if this colour and the lab colour are “equal” to within the given
	  *                   tolerance
	  */
	public equalTo(lab: LAB, epsilon: number = LAB.PRECISION): boolean {
		return Component.equalTo(this.l, lab.l, epsilon)
			&& Component.equalTo(this.a, lab.a, epsilon)
			&& Component.equalTo(this.b, lab.b, epsilon);
	}
	/** Returns the CIEDE2000 ΔE*₀₀ relative colour difference between this colour and another
	  * @param {LAB} c - another colour
	  * @return {number} the ΔE*₀₀ colour difference value
	  *
	  * The closer the ΔE*₀₀ value is to 0.0, the more similar the colours appear to a human
	  * observer. The “just noticeable difference” value is purposed to be around ΔE*₀₀ = 2.3.
	  *
	  * @see https://en.wikipedia.org/wiki/Color_difference#CIEDE2000
	  */
	public deltaE(c: LAB): number {
		let c1c: number = Math.sqrt(this.a * this.a + this.b * this.b);
		let c2c: number = Math.sqrt(c.a * c.a + c.b * c.b);
		let ΔLʹ: number = c.l - this.l;
		let L_: number = (this.l + c.l) / 2;
		let C_: number = (c1c + c2c) / 2;
		let f: number = 1 - Math.sqrt(Math.pow(C_, 7) / (Math.pow(C_, 7) + Math.pow(25, 7)));
		let a1ʹ: number = this.a + this.a / 2 * f;
		let a2ʹ: number = c.a + c.a / 2 * f;
		let C1ʹ: number = Math.sqrt(Math.pow(a1ʹ, 2) + Math.pow(this.b, 2));
		let C2ʹ: number = Math.sqrt(Math.pow(a2ʹ, 2) + Math.pow(c.b, 2));
		let ΔCʹ: number = C2ʹ - C1ʹ;
		let C_ʹ: number = (C1ʹ + C2ʹ) / 2;
		let h1ʹ: number= Math.atan2(this.b, a1ʹ) * 180 / Math.PI;
		while(h1ʹ < 0) {
			h1ʹ += 360;
		}
		while(h1ʹ >= 360) {
			h1ʹ -= 360;
		}
		let h2ʹ: number = Math.atan2(c.b, a2ʹ) * 180 / Math.PI;
		while(h2ʹ < 0) {
			h2ʹ += 360;
		}
		while(h2ʹ >= 360) {
			h2ʹ -= 360;
		}
		f = Math.abs(h1ʹ - h2ʹ);
		let Δhʹ: number;
		if(!C1ʹ || !C2ʹ) {
			Δhʹ = 0;
		} else if(f <= 180) {
			Δhʹ = h2ʹ - h1ʹ;
		} else if(h2ʹ <= h1ʹ) {
			Δhʹ = h2ʹ - h1ʹ + 360;
		} else {
			Δhʹ = h2ʹ - h1ʹ - 360;
		}
		let ΔHʹ: number = 2 * Math.sqrt(C1ʹ * C2ʹ) * Math.sin(Δhʹ * Math.PI / 180 / 2);
		let H_ʹ: number;
		if(!C1ʹ || !C2ʹ) {
			H_ʹ = h1ʹ + h2ʹ;
		} else if(f <= 180) {
			H_ʹ = (h1ʹ + h2ʹ) / 2;
		} else if(h1ʹ + h2ʹ < 360) {
			H_ʹ = (h1ʹ + h2ʹ + 360) / 2;
		} else {
			H_ʹ = (h1ʹ + h2ʹ - 360) / 2;
		}
		let T: number = 1 - 0.17 * Math.cos((H_ʹ - 30) / 180 * Math.PI) + 0.24 * Math.cos((2 * H_ʹ) / 180 * Math.PI) + 0.32 * Math.cos((3 * H_ʹ + 6) / 180 * Math.PI) - 0.20 * Math.cos((4 * H_ʹ -63) / 180 * Math.PI);
		let SL: number = 1 + ((0.015 * Math.pow(L_ - 50, 2)) / Math.sqrt(20 + Math.pow(L_ - 50, 2)));
		let SC: number = 1 + 0.045 * C_ʹ;
		let SH: number = 1 + 0.015 * C_ʹ * T;
		let RT: number = -2 * Math.sqrt(Math.pow(C_ʹ, 7) / (Math.pow(C_ʹ, 7) + Math.pow(25, 7))) * Math.sin(60 * Math.exp(-1 * Math.pow((H_ʹ - 275) / 25, 2)) / 180 * Math.PI);
		let ΔE00: number = Math.sqrt(Math.pow(ΔLʹ / SL, 2) + Math.pow(ΔCʹ / SC, 2) + Math.pow(ΔHʹ / SH, 2) + RT * (ΔCʹ / SC) * (ΔHʹ / SH));
		return ΔE00;
	}
	/** An “empty” LAB instance i.e., one which has components which are all NaNs **/
	public static readonly EMPTY: LAB = new LAB(NaN,NaN,NaN);
	/** Returns true if this XYZ instance is empty i.e., all components are NaN */
	public get empty(): boolean {
		return Number.isNaN(this.l) && Number.isNaN(this.a) && Number.isNaN(this.b);
	}
};
