/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */

/** Utility static methods for working with component values. */
export default class Component {
	/** Parses a string into a component value
	  * @param {string} s - component to parse
	  * @param {number} max - maximum component value if unscaled
	  * @param {number} min - minimum component value if unscaled
	  * @return {number} component value over the range [0.0,1.0]
	  */
	public static parseNumber(s: string, max?: number, min?: number) : number {
		if(s.endsWith('%')) {
			return Number.parseFloat(s.substr(0, s.length - 1)) / 100.0;
		} else if(s.endsWith('°')) {
			return Number.parseFloat(s.substr(0, s.length - 1)) / 360.0;
		} else if(s.endsWith('deg')) {
			return Number.parseFloat(s.substr(0, s.length - 3)) / 360.0;
		} else if(s.endsWith('grad')) {
			return Number.parseFloat(s.substr(0, s.length - 4)) / 400.0;
		} else if(s.endsWith('rad')) {
			return Number.parseFloat(s.substr(0, s.length - 3)) / (2 * Math.PI);
		} else {
			let dx: boolean = (max !== undefined);
			let dn: boolean = (min !== undefined);
			let v: number = Number.parseFloat(s);
			if(dn || dx) {
				return ((v - (min || 0)) / ((max || 0) - (min || 0)));
			} else {
				return v;
			}
		}
	}
	/** Formats a string to a given decimal place
	  * @param {number} v - number to format
	  * @param {number} precision - decimal place to round to
	  * @return {string} formatted number
	  */
	public static formatNumber(v: number, precision: number = 1): string {
		if(precision < 1) {
			let digits: number = Math.trunc(-Math.log10(precision));
			let s: string = (Math.round(v / precision) * precision).toFixed(digits).toString();
			let d: number = s.indexOf('.');
			if(d >= 0) {
				while(s.endsWith('0')) {
					s = s.substr(0, s.length - 1);
				}
				if(s.endsWith('.')) {
					s = s.substr(0, s.length - 1);
				}
			}
			return s;
		} else {
			return Math.round(v).toString();
		}
	}
	/** Returns true if two numbers are equal within a certain threshold
	  * @param {number} a - a number
	  * @param {number} b - another number
	  * @param {number} epsilon - maximum difference between a and b to consider them “equal”
	  * @return {boolean} true if a and b are no more than epsilon apart
	  */
	public static equalTo(a: number, b: number, epsilon: number = 1e-6): boolean {
		if(a === b) {
			return true;
		} else if(a > b) {
			return (a - b) < epsilon;
		} else {
			return (b - a) < epsilon;
		}
	}
}
