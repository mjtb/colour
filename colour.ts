/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import RGB from './rgb';
import Linear from './linear';
import HSL from './hsl';
import XYZ from './xyz';
import LAB from './lab';
import HWB from './hwb';
import LCH from './lch';
import YUV from './yuv';
import YCC from './ycc';
import Palette from './palette';
import Palettes from './palettes';

/** Provides access to a colour in different colour spaces e.g., RGB, HSL, YUV, CIE LAB, etc. */
export default class Colour {
	/** Optional CSS name of the colour */
	public readonly name?: string;
	/** RGB (red-green-blue) components of this colour */
	public readonly rgb: RGB;
	/** RGB (red-green-blue) components of this colour */
	public readonly lin: Linear;
	/** HSL (hue-saturation-lightness) components of this colour */
	public readonly hsl: HSL;
	/** CIE XYZ (tristimulus) components of this colour */
	public readonly xyz: XYZ;
	/** CIE L*a*b* components of this colour */
	public readonly lab: LAB;
	/** HWB (hue-whiteness-blackness) components of this colour */
	public readonly hwb: HWB;
	/** CIE L*C*h* components of this colour */
	public readonly lch: LCH;
	/** ITU T.871 (JPEG) YUV components of this colour */
	public readonly yuv: YUV;
	/** ITU-R BT.2020 (UDHTV) constant luminance Yc'CbcCrc components of this colour */
	public readonly ycc: YCC;
	/** Name of the colour space or palette used to initialize this colour */
	public readonly space: string;
	/** The object that was used ot initialize the colour */
	public readonly defn: RGB|Linear|HSL|XYZ|LAB|HWB|LCH|YUV|YCC;
	/** Constructs the object given a colour space value and an optional name
	  * @param {any} c - colour space value in RGB (or other) format
	  * @param {string}
	 */
	constructor(c: any, name?: string, space?: string) {
		this.name = name;
		if(space) {
			this.space = space;
		}
		if(typeof(c) === 'string') {
			c = Colour.parse(c);
		}
		this.defn = c;
		if(c instanceof RGB) {
			this.rgb = c;
			this.lin = Linear.fromRGB(this.rgb);
			this.hsl = HSL.fromRGB(this.rgb);
			this.xyz = XYZ.fromLinear(this.lin);
			this.lab = LAB.fromXYZ(this.xyz);
			this.hwb = HWB.fromRGB(this.rgb);
			this.lch = LCH.fromLAB(this.lab);
			this.yuv = YUV.fromLinear(this.lin);
			this.ycc = YCC.fromLinear(this.lin);
			if(!space) {
				this.space = 'RGB';
			}
		} else if(c instanceof Linear) {
			this.lin = c;
			this.rgb = this.lin.toRGB();
			this.hsl = HSL.fromRGB(this.rgb);
			this.xyz = XYZ.fromLinear(this.lin);
			this.lab = LAB.fromXYZ(this.xyz);
			this.hwb = HWB.fromRGB(this.rgb);
			this.lch = LCH.fromLAB(this.lab);
			this.yuv = YUV.fromLinear(this.lin);
			this.ycc = YCC.fromLinear(this.lin);
			if(!space) {
				this.space = 'Linear';
			}
		} else if(c instanceof HSL) {
			this.hsl = c;
			this.rgb = this.hsl.toRGB();
			this.lin = Linear.fromRGB(this.rgb);
			this.xyz = XYZ.fromLinear(this.lin);
			this.lab = LAB.fromXYZ(this.xyz);
			this.hwb = HWB.fromRGB(this.rgb);
			this.lch = LCH.fromLAB(this.lab);
			this.yuv = YUV.fromLinear(this.lin);
			this.ycc = YCC.fromLinear(this.lin);
			if(!space) {
				this.space = 'HSL';
			}
		} else if(c instanceof XYZ) {
			this.xyz = c;
			this.lab = LAB.fromXYZ(this.xyz);
			this.lin = this.xyz.toLinear();
			this.rgb = this.lin.toRGB();
			this.hsl = HSL.fromRGB(this.rgb);
			this.hwb = HWB.fromRGB(this.rgb);
			this.lch = LCH.fromLAB(this.lab);
			this.yuv = YUV.fromLinear(this.lin);
			this.ycc = YCC.fromLinear(this.lin);
			if(!space) {
				this.space = 'XYZ';
			}
		} else if(c instanceof LAB) {
			this.lab = c;
			this.xyz = this.lab.toXYZ();
			this.lin = this.xyz.toLinear();
			this.rgb = this.lin.toRGB();
			this.hsl = HSL.fromRGB(this.rgb);
			this.hwb = HWB.fromRGB(this.rgb);
			this.lch = LCH.fromLAB(this.lab);
			this.yuv = YUV.fromLinear(this.lin);
			this.ycc = YCC.fromLinear(this.lin);
			if(!space) {
				this.space = 'LAB';
			}
		} else if(c instanceof HWB) {
			this.hwb = c;
			this.rgb = this.hwb.toRGB();
			this.hsl = HSL.fromRGB(this.rgb);
			this.lin = Linear.fromRGB(this.rgb);
			this.xyz = XYZ.fromLinear(this.lin);
			this.lab = LAB.fromXYZ(this.xyz);
			this.lch = LCH.fromLAB(this.lab);
			this.yuv = YUV.fromLinear(this.lin);
			this.ycc = YCC.fromLinear(this.lin);
			if(!space) {
				this.space = 'HWB';
			}
		} else if(c instanceof LCH) {
			this.lch = c;
			this.lab = this.lch.toLAB();
			this.xyz = this.lab.toXYZ();
			this.lin = this.xyz.toLinear();
			this.rgb = this.lin.toRGB();
			this.hsl = HSL.fromRGB(this.rgb);
			this.hwb = HWB.fromRGB(this.rgb);
			this.yuv = YUV.fromLinear(this.lin);
			this.ycc = YCC.fromLinear(this.lin);
			if(!space) {
				this.space = 'LCH';
			}
		} else if(c instanceof YUV) {
			this.yuv = c;
			this.lin = this.yuv.toLinear();
			this.rgb = this.lin.toRGB();
			this.hsl = HSL.fromRGB(this.rgb);
			this.xyz = XYZ.fromLinear(this.lin);
			this.lab = LAB.fromXYZ(this.xyz);
			this.hwb = HWB.fromRGB(this.rgb);
			this.lch = LCH.fromLAB(this.lab);
			this.ycc = YCC.fromLinear(this.lin);
			if(!space) {
				this.space = 'YUV';
			}
		} else if(c instanceof YCC) {
			this.ycc = c;
			this.lin = this.ycc.toLinear();
			this.rgb = this.lin.toRGB();
			this.hsl = HSL.fromRGB(this.rgb);
			this.xyz = XYZ.fromLinear(this.lin);
			this.lab = LAB.fromXYZ(this.xyz);
			this.hwb = HWB.fromRGB(this.rgb);
			this.lch = LCH.fromLAB(this.lab);
			this.yuv = YUV.fromLinear(this.lin);
			if(!space) {
				this.space = 'YCC';
			}
		} else {
			throw new Error(`Invalid colour space value: ${c}`);
		}
	}
	/** Returns a string representation of this colour
	  *
	  * If this colour has a name, the name is returned. Otherwise, the defining colour is returned.
	  */
	public toString(): string {
		if(this.name) {
			return this.name;
		} else {
			return this.defn.toString();
		}
	}
	/** Returns true if this colour is the same as another
	  * @param {Colour} c - another colour
	  * @param {number} deltaE - maximum ΔE*₀₀ difference between colours to be considered equal
	  * @return {boolean} true if this colour and c are “equal”
	  *
	  * If deltaE is omitted, colours are considered the same if they have the same sRGB component
	  * values.
	  */
	public equalTo(c: Colour, deltaE?: number): boolean {
		if(deltaE === undefined) {
			return this.rgb.equalTo(c.rgb);
		} else {
			return this.lab.deltaE(c.lab) < deltaE;
		}
	}
	private static parse(colour: string): any {
		let c: any = RGB.parseString(colour);
		if(c) {
			return c;
		}
		c = Linear.parseString(colour);
		if(c) {
			return c;
		}
		c = HSL.parseString(colour);
		if(c) {
			return c;
		}
		c = XYZ.parseString(colour);
		if(c) {
			return c;
		}
		c = LAB.parseString(colour);
		if(c) {
			return c;
		}
		c = HWB.parseString(colour);
		if(c) {
			return c;
		}
		c = LCH.parseString(colour);
		if(c) {
			return c;
		}
		c = YUV.parseString(colour);
		if(c) {
			return c;
		}
		c = YCC.parseString(colour);
		if(c) {
			return c;
		}
		return undefined;
	}
	/** Parses a string into a colour
	  * @param {string} colour - a colour specified according to the CSS Color Module Level 4
	  * @param {string} name - name of the colour (optional)
	  * @param {string}
	  * @return {Colour} parsed colour (or undefined if the string could not be parsed)
	  * Loaded palettes will not be searched if the name parameter is specified.
	  */
	public static parseString(colour: string): Colour | undefined {
		let c: any = Colour.parse(colour);
		if(c) {
			return new Colour(c);
		}
		return undefined;
	}

}
