﻿/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a permissive (MIT) license. See the
 * LICENSE file at the repository root.
 */
import path = require('path');
import pug = require('pug');
import Colour from './colour';
import Palettes from './palettes';
import Palette from './palette';
import Component from './component';
import Match from './match';
import LAB from './lab';
import XYZ from './xyz';
import Linear from './linear';
import ColorTemperature from './cct';

export class DataSet {
	public columns: string[];
	private sample?: string[];
	private header?: string[];
	public content: any[][];
	public colours: Colour[];
	public contexts: (Colour|undefined)[];
	public inputs: string[];
	public get cols(): number {
		return this.columns.length;
	}
	public get rows(): number {
		return this.content.length;
	}
	constructor(columns: string) {
		let col: string[] = [];
		if(columns === '*') {
			col = [ 'r', 'p', 'x', '6', '3', 'l', 'r:e', '3:e', 'lin', 'hsl', 'hwb', 'yuv', 'ycc',
				'xyz', 'lch', 'xyy', 'cct' ];
			for(let i: number = 0; i < Palettes.count; ++i) {
				let p: Palette = Palettes.paletteAt(i);
				col.push(p.name);
				col.push(`${p.name}:d`);
				col.push(`${p.name}:i`);
				col.push(`${p.name}:e`);
			}
		} else {
			let pat: string = '(\\[(?:r\\:e|3\\:e|r(?:\\.[rgb])?|rgb(?:\\.[rgb])?|srgb(?:\\.[rgb])?|lin(?:\\.[rgb])?|hsl(?:\\.[hsl])?|hwb(?:\\.[hwb])?|yuv(?:\\.[yuv])?|ycc(?:\\.yc|\\.cbc|\\.crc)?|xyz(?:\\.[xyz])?|lch(?:\\.[lch])?|xyy(?:\\.[xy])?|cct';
			for(let i: number = 0; i < Palettes.count; ++i) {
				let pal: Palette = Palettes.paletteAt(i);
				pat += `|${pal.name}|${pal.name}\\:e|${pal.name}\\:d|${pal.name}\\:i`;
			}
			pat += ')\\]|r|p|x|6|3|l)';
			let re: RegExp = new RegExp(pat, 'gi');
			let m: any;
			while(m = re.exec(columns)) {
				if(!m) {
					break;
				}
				let c: string = m[1];
				if(col.indexOf(c) >= 0) {
					throw new Error(`Duplicate column: ${c}`);
				}
				if(c.startsWith('[') && c.endsWith(']')) {
					c = c.substr(1, c.length - 2);
				}
				col.push(c);
			}
		}
		this.columns = col;
		this.content = [];
		this.colours = [];
		this.contexts = [];
		this.inputs = [];
	}
	public static preformatted(headers: string[], content: string[][]): DataSet {
		let ds: DataSet = new DataSet('');
		let col: string[] = [];
		for(let h in headers) {
			col.push('');
		}
		ds.columns = col;
		ds.header = headers;
		ds.content = content;
		return ds;
	}
	public static isHtmlColourSpec(col: string): boolean {
		switch(col) {
			default:
				return false;
				case 'r':
				case 'p':
				case '6':
				case '3':
				case 'x':
				case 'hsl':
				case 'css':
					return true;
		}
	}
	public get samples(): string[] {
		if(!this.sample) {
			let h: string[] = [];
			for(let c of this.columns) {
				switch(c) {
					default:
						if(c.endsWith(':e')) {
							h.push('\u00B1' + '5.527');
						} else if(c.endsWith(':d')) {
							h.push('rgb(0,128,255)');
						} else if(c.endsWith(':i')) {
							h.push('0');
						} else {
							let pal: Palette = Palettes.paletteOf(c);
							let n: string|undefined = undefined;
							for(let i: number = 0; i < pal.length; ++i) {
								n = pal.nameAt(i);
								if(n) {
									break;
								}
							}
							h.push(n || `${pal.name}[0]`);
						}
						break;
					case 'r':
						h.push('rgb(0,128,255)');
						break;
					case 'p':
						h.push('rgb(0%,50%,100%)');
						break;
					case 'x':
						h.push('#0080FF');
						break;
					case 'l':
						h.push('lab(53.53 8.67 -72.58)');
						break;
					case '6':
						h.push('#0080FF');
						break;
					case '3':
						h.push('#08F');;
						break;
					case 'r:e':
						h.push('\u00B1' + '5.527');
						break;
					case '3:e':
						h.push('\u00B1' + '5.527');
						break;
					case 'lin':
						h.push('lin(0,0.50196,1)');
						break;
					case 'hsl':
						h.push('hsl(210,100%,50%)');
						break;
					case 'hwb':
						h.push('hwb(210,0%,0%)');
						break;
					case 'yuv':
						h.push('yuv(104,-37,42)');
						break;
					case 'ycc':
						h.push('ycc(1040,376,2094)');
						break;
					case 'xyz':
						h.push('xyz(0.25697,0.22525,0.97582)');
						break;
					case 'xyy':
						h.push('xyy(0.17624,0.15449,0.22525)')
					case 'lch':
						h.push('lch(53.39 73.36 277.01)');
						break;
					case 'cct':
						h.push('6702K');
						break;
				}
			}
			this.sample = h;
		}
		return this.sample;
	}
	public get headers(): string[] {
		if(!this.header) {
			let h: string[] = [];
			for(let c of this.columns) {
				switch(c) {
					default:
						if(c.endsWith(':e')) {
							let key: string = c.substr(0, c.length - 2);
							let pal: Palette = Palettes.paletteOf(key);
							h.push(`\u0394E*\u2080\u2080 (${pal.description})`);
						} else if(c.endsWith(':d')) {
							let key: string = c.substr(0, c.length - 2);
							let pal: Palette = Palettes.paletteOf(key);
							h.push(`${pal.description} (Definition)`);
						} else if(c.endsWith(':i')) {
							let key: string = c.substr(0, c.length - 2);
							let pal: Palette = Palettes.paletteOf(key);
							h.push(`${pal.description} (Index)`);
						} else {
							let pal: Palette = Palettes.paletteOf(c);
							h.push(`${pal.description}`);
						}
						break;
					case 'r':
					case 'rgb':
					case 'srgb':
						h.push('sRGB');
						break;
					case 'r.r':
					case 'rgb.r':
					case 'srgb.r':
						h.push('R_sRGB');
						break;
					case 'r.g':
					case 'rgb.g':
					case 'srgb.b':
						h.push('G_sRGB');
						break;
					case 'r.b':
					case 'rgb.b':
					case 'srgb.b':
						h.push('B_sRGB');
						break;
					case 'p':
						h.push('sRGB (%)');
						break;
					case 'x':
						h.push('sRGB (Hex)');
						break;
					case 'l':
					case 'lab':
						h.push('L*a*b*');
						break;
					case 'lab.l':
						h.push('L*');
						break;
					case 'lab.a':
						h.push('a*');
						break;
					case 'lab.b':
						h.push('b*');
						break;
					case '6':
						h.push('#rrggbb');
						break;
					case '3':
						h.push('#rgb');
						break;
					case 'r:e':
						h.push('\u0394E*\u2080\u2080 (RGB)');
						break;
					case '3:e':
						h.push('\u0394E*\u2080\u2080 (#rgb)');
						break;
					case 'lin':
						h.push('Linear RGB');
						break;
					case 'lin.r':
						h.push('R_lin');
						break;
					case 'lin.g':
						h.push('G_lin');
						break;
					case 'lin.b':
						h.push('B_lin');
						break;
					case 'hsl':
						h.push('HSL');
						break;
					case 'hsl.h':
						h.push('H_hsl');
						break;
					case 'hsl.s':
						h.push('S_hsl');
						break;
					case 'hsl.l':
						h.push('L_hsl');
						break;
					case 'hwb':
						h.push('HWB');
						break;
					case 'hwb.h':
						h.push('H_hwb');
						break;
					case 'hwb.w':
						h.push('W_hwb');
						break;
					case 'hwb.b':
						h.push('B_hwb');
						break;
					case 'yuv':
						h.push('YUV');
						break;
					case 'yuv.y':
						h.push('Y_yuv');
						break;
					case 'yuv.u':
						h.push('U_yuv');
						break;
					case 'yuv.v':
						h.push('V_yuv');
						break;
					case 'ycc':
						h.push('Yc\′CbcCrc');
						break;
					case 'ycc.yc':
						h.push('Y_Yc\′CbcCrc');
						break;
					case 'ycc.cbc':
						h.push('Cbc_Yc\′CbcCrc');
						break;
					case 'ycc.crc':
						h.push('Crc_Yc\′CbcCrc');
						break;
					case 'xyz':
						h.push('XYZ');
						break;
					case 'xyz.x':
						h.push('X_xyz');
						break;
					case 'xyz.y':
						h.push('Y_xyz');
						break;
					case 'xyz.z':
						h.push('Z_xyz');
						break;
					case 'lch':
						h.push('L*C*h\u00B0');
						break;
					case 'lch.l':
						h.push('L*');
						break;
					case 'lch.c':
						h.push('C*');
						break;
					case 'lch.h':
						h.push('h\u00B0');
						break;
					case 'xyy':
						h.push('xyY');
						break;
					case 'xyy.x':
						h.push('X_xyY');
						break;
					case 'xyy.y':
						h.push('Y_xyY');
						break;
					case 'cct':
						h.push('CCT');
						break;
					}
			}
			this.header = h;
		}
		return this.header;
	}
	public push(input: string, colour: Colour, context?: Colour) {
		let v: any[] = [];
		for(let c of this.columns) {
			switch(c) {
				default:
					let key: string = /.+\:[eid]/.test(c)
						? c.substr(0, c.length - 2)
						: c;
					if(context) {
						let pal: Palette = Palettes.paletteOf(key);
						let index: number = pal.find(colour);
						if(index >= 0) {
							if(c.endsWith(':e')) {
								v.push(context.lab.deltaE(pal.colourAt(index).lab));
							} else if(c.endsWith(':d')) {
								v.push(pal.definitionAt(index));
							} else if(c.endsWith(':i')) {
								v.push(index);
							} else {
								v.push(pal.nameAt(index));
							}
						} else {
							v.push(undefined);
						}
					} else {
						let pal: Palette = Palettes.paletteOf(key);
						let m: Match[] = pal.match(colour);
						if(m.length > 0) {
							if(c.endsWith(':e')) {
								v.push(colour.lab.deltaE(m[0].colour.lab));
							} else if(c.endsWith(':d')) {
								v.push(m[0].defn);
							} else if(c.endsWith(':i')) {
								v.push(m[0].index);
							} else {
								if(m[0].name) {
									v.push(m[0].name);
								} else {
									v.push(undefined);
								}
							}
						} else {
							v.push(undefined);
						}
					}
					break;
				case 'r':
				case 'rgb':
				case 'srgb':
					v.push(colour.rgb.toRgbString());
					break;
				case 'r.r':
				case 'rgb.r':
				case 'srgb.r':
					v.push(Component.formatNumber(colour.rgb.R));
					break;
				case 'r.g':
				case 'rgb.g':
				case 'srgb.b':
					v.push(Component.formatNumber(colour.rgb.G));
					break;
				case 'r.b':
				case 'rgb.b':
				case 'srgb.b':
					v.push(Component.formatNumber(colour.rgb.B));
					break;
				case 'p':
					v.push(colour.rgb.toRgbString(true));
					break;
				case 'x':
					v.push(colour.rgb.toHexString());
					break;
				case 'l':
				case 'lab':
					v.push(colour.lab.toString());
					break;
				case 'lab.l':
					v.push(Component.formatNumber(colour.lab.l, LAB.PRECISION));
					break;
				case 'lab.a':
					v.push(Component.formatNumber(colour.lab.a, LAB.PRECISION));
					break;
				case 'lab.b':
					v.push(Component.formatNumber(colour.lab.b, LAB.PRECISION));
					break;
				case '6':
					v.push(colour.rgb.toHexString(true));
					break;
				case '3':
					v.push(colour.rgb.clip3().toHexString(false));
					break;
				case 'r:e':
					if(context) {
						v.push(LAB.fromXYZ(XYZ.fromLinear(Linear.fromRGB(colour.rgb))).deltaE(context.lab));
					} else {
						v.push(LAB.fromXYZ(XYZ.fromLinear(Linear.fromRGB(colour.rgb))).deltaE(colour.lab));
					}
					break;
				case '3:e':
					if(context) {
						v.push(LAB.fromXYZ(XYZ.fromLinear(Linear.fromRGB(colour.rgb.clip3()))).deltaE(context.lab));
					} else {
						v.push(LAB.fromXYZ(XYZ.fromLinear(Linear.fromRGB(colour.rgb.clip3()))).deltaE(colour.lab));
					}
					break;
				case 'lin':
					v.push(colour.lin.toString());
					break;
				case 'lin.r':
					v.push(Component.formatNumber(colour.lin.r, Linear.PRECISION));
					break;
				case 'lin.g':
					v.push(Component.formatNumber(colour.lin.g, Linear.PRECISION));
					break;
				case 'lin.b':
					v.push(Component.formatNumber(colour.lin.b, Linear.PRECISION));
					break;
				case 'hsl':
					v.push(colour.hsl.toString());
					break;
				case 'hsl.h':
					v.push(Component.formatNumber(colour.hsl.H));
					break;
				case 'hsl.s':
					v.push(Component.formatNumber(colour.hsl.S));
					break;
				case 'hsl.l':
					v.push(Component.formatNumber(colour.hsl.L));
					break;
				case 'xyz':
					v.push(colour.xyz.toString());
					break;
				case 'xyz.x':
					v.push(Component.formatNumber(colour.xyz.x, XYZ.PRECISION));
					break;
				case 'xyz.y':
					v.push(Component.formatNumber(colour.xyz.y, XYZ.PRECISION));
					break;
				case 'xyz.z':
					v.push(Component.formatNumber(colour.xyz.z, XYZ.PRECISION));
					break;
				case 'hwb':
					v.push(colour.hwb.toString());
					break;
				case 'hwb.h':
					v.push(Component.formatNumber(colour.hwb.H));
					break;
				case 'hwb.h':
					v.push(Component.formatNumber(colour.hwb.H));
					break;
				case 'hwb.w':
					v.push(Component.formatNumber(colour.hwb.W));
					break;
				case 'hwb.b':
					v.push(Component.formatNumber(colour.hwb.B));
					break;
				case 'yuv':
					v.push(colour.yuv.toString());
					break;
				case 'yuv.y':
					v.push(Component.formatNumber(colour.yuv.Y));
					break;
				case 'yuv.u':
					v.push(Component.formatNumber(colour.yuv.U));
					break;
				case 'yuv.v':
					v.push(Component.formatNumber(colour.yuv.V));
					break;
				case 'ycc':
					v.push(colour.ycc.toString());
					break;
				case 'ycc.yc':
					v.push(Component.formatNumber(colour.ycc.Yc));
					break;
				case 'ycc.cbc':
					v.push(Component.formatNumber(colour.ycc.Cbc));
					break;
				case 'ycc.crc':
					v.push(Component.formatNumber(colour.ycc.Crc));
					break;
				case 'lch':
					v.push(colour.lch.toString());
					break;
				case 'lch.l':
					v.push(Component.formatNumber(colour.lch.l, LAB.PRECISION));
					break;
				case 'lch.c':
					v.push(Component.formatNumber(colour.lch.c, LAB.PRECISION));
					break;
				case 'lch.h':
					v.push(Component.formatNumber(colour.lch.h, LAB.PRECISION));
					break;
				case 'xyy':
					v.push(colour.xyy.toString());
					break;
				case 'xyy.x':
					v.push(Component.formatNumber(colour.xyy.x, XYZ.PRECISION));
					break;
				case 'xyy.y':
					v.push(Component.formatNumber(colour.xyy.y, XYZ.PRECISION));
					break;
				case 'cct':
					v.push(Component.formatNumber(new ColorTemperature(colour.xyz).k) + 'K');
					break;
				}
		}
		this.content.push(v);
		this.inputs.push(input);
		this.colours.push(colour);
		this.contexts.push(context);
	}
};

export function formatterOf(format: string, template?: string): IDataSetFormatter {
	switch(format) {
		default:
			throw new Error(`Unrecognized output format: ${format}`);
		case 'text':
			return new DataSetTextFormatter();
		case 'csv':
			return new DataSetCsvFormatter();
		case 'json':
			return new DataSetJsonFormatter();
		case 'html':
			return new DataSetHtmlFormatter(template);
		case 'flat':
			return new DataSetFlatFormatter();
	}
}

function pad(s: string, len: number, padding: string = ' '): string {
	if(s.length < len) {
		return s + padding.repeat(len - s.length);
	} else {
		return s;
	}
}

export interface IDataSetFormatter {
	formatDataSet(data: DataSet): string;
}

export abstract class DataSetTableFormatter implements IDataSetFormatter {
	protected get undefinedText(): string {
		return '';
	}
	protected get nanText(): string {
		return 'NaN';
	}
	protected get positiveInfinityText(): string {
		return '+Infinity';
	}
	protected get negativeInfinityText(): string {
		return '-Infinity';
	}
	protected tabulate(data: DataSet): string[][] {
		let rows: number = data.rows;
		let cols: number = data.cols;
		let table: string[][] = [];
		table.push(data.headers);
		for(let r: number = 0; r < rows; ++r) {
			let srow: string[] = [];
			for(let c: number = 0; c < cols; ++c) {
				let a: any = data.content[r][c];
				if((a === undefined) || (a === null)) {
					srow.push(this.undefinedText);
				} else if(typeof(a) === 'string') {
					srow.push(a);
				} else if(typeof(a) === 'number') {
					if(Number.isNaN(a)) {
						srow.push(this.nanText);
					} else if(Number.isFinite(a)) {
						srow.push(Component.formatNumber(a, 1e-3));
					} else if(a < 0) {
						srow.push(this.negativeInfinityText)
					} else {
						srow.push(this.positiveInfinityText);
					}
				} else {
					srow.push(String(a));
				}
			}
			table.push(srow);
		}
		return table;
	}
	constructor() {}
	abstract formatDataSet(data: DataSet): string;
}

interface IDataSetHtmlFormatterContentItem {
	text: string;
	swatch?: boolean;
};

interface IDataSetHtmlFormatterLocals {
	headers: string[];
	content: IDataSetHtmlFormatterContentItem[][];
};

class DataSetHtmlFormatter extends DataSetTableFormatter {
	private templateFile: string;
	constructor(template?: string) {
		super();
		if(template) {
			this.templateFile = path.resolve(process.cwd(), template);
		} else {
			this.templateFile = path.resolve(__dirname, '..', 'template.pug');
		}
	}
	protected get undefinedText(): string {
		return '\u00A0'; // &nbsp;
	}
	protected get negativeInfinityText(): string {
		return '-∞';
	}
	protected get positiveInfinityText(): string {
		return '∞';
	}
	public formatDataSet(data: DataSet): string {
		let locals: IDataSetHtmlFormatterLocals = {
			headers: data.headers,
			content: []
		};
		let rows: number = data.rows;
		let cols: number = data.cols;
		let table: string[][] = this.tabulate(data);
		for(let ri: number = 0; ri < rows; ++ri) {
			let rrow: string[] = table[ri + 1];
			let crow: IDataSetHtmlFormatterContentItem[] = [];
			for(let ci: number = 0; ci < cols; ++ci) {
				let c: IDataSetHtmlFormatterContentItem = {
					text: rrow[ci],
					swatch: DataSet.isHtmlColourSpec(data.columns[ci])
				};
				crow.push(c);
			}
			locals.content.push(crow);
		}
		var fn: any = pug.compileFile(this.templateFile, { pretty: true });
		return fn(locals);
	}
}

class DataSetTextFormatter extends DataSetTableFormatter {
	protected get undefinedText(): string {
		return 'N/A';
	}
	protected get negativeInfinityText(): string {
		return '-∞';
	}
	protected get positiveInfinityText(): string {
		return '∞';
	}
	constructor() {
		super();
	}
	public formatDataSet(data: DataSet): string {
		let rv: string = '';
		let table: string[][] = this.tabulate(data);
		let rows: number = table.length;
		let cols: number = table[0].length;
		let width: number[] = [];
		for(let c: number = 0; c < cols; ++c) {
			width.push(0);
		}
		for(let r: number = 0; r < rows; ++r) {
			let v: string[] = table[r];
			for(let c: number = 0; c < cols; ++c) {
				width[c] = Math.max(width[c], v[c].length);
			}
		}
		for(let r: number = 0; r < rows; ++r) {
			let s: string = '|';
			let v: string[] = table[r];
			for(let c: number = 0; c < cols; ++c) {
				let t: string = v[c];
				s += ' ' + pad(t, width[c]);
				s += ' |';
			}
			rv += s;
			rv += '\r\n';
			if(r === 0) {
				s = '|';
				for(let c: number = 0; c < cols; ++c) {
					s += ':';
					s += '-'.repeat(width[c]);
					s += '-|';
				}
				rv += s;
				rv += '\r\n';
			}
		}
		return rv;
	}
};


class DataSetCsvFormatter extends DataSetTableFormatter {
	constructor() {
		super();
	}
	private static escape(s: string): string {
		let n: number = s.length;
		let b: boolean = false;
		for(let i: number = 0; i < n && !b; ++i) {
			let c: number = s.charCodeAt(i);
			if(c < 0x20) {
				b = true;
			} else if(c == 0x22) {
				b = true;
			} else if(c == 0x2c) {
				b = true;
			}
		}
		if(!b) {
			return s;
		}
		let t: string = '"';
		for(let i: number = 0; i < n; ++i) {
			let c: string = s.charAt(i);
			if(c === '"') {
				t += '"';
			}
			t += c;
		}
		t += '"';
		return t;
	}
	protected get undefinedText(): string {
		return '#NA';
	}
	protected get nanText(): string {
		return '#NAN';
	}
	protected get negativeInfinityText(): string {
		return '-#INF';
	}
	protected get positiveInfinityText(): string {
		return '#INF'
	}
	public formatDataSet(data: DataSet): string {
		let rv: string = '';
		let table: string[][] = this.tabulate(data);
		let rows: number = table.length;
		let cols: number = table[0].length;
		let s: string = '';
		for(let r: number = 0; r < rows; ++r) {
			let v: string[] = table[r];
			for(let c: number = 0; c < cols; ++c) {
				if(c > 0) {
					s += ',';
				}
				s += DataSetCsvFormatter.escape(v[c]);
			}
			s += '\r\n';
		}
		return s;
	}
};

class DataSetFlatFormatter extends DataSetTableFormatter {
	constructor() {
		super();
	}
	public formatDataSet(data: DataSet): string {
		let rv: string = '';
		let table: string[][] = this.tabulate(data);
		let rows: number = table.length;
		let cols: number = table[0].length;
		let headers: string[] = data.headers;
		let width: number = 0;
		for(let h of headers) {
			width = Math.max(width, h.length);
		}
		let s: string = '';
		for(let r: number = 1; r < rows; ++r) {
			let v: string[] = table[r];
			s += data.inputs[r-1];
			s += '\r\n';
			for(let c: number = 0; c < cols; ++c) {
				s += `\t${pad(headers[c], width)}\t ${v[c]}\r\n`;
			}
			s += '\r\n';
		}
		return s;
	}
}

class DataSetJsonFormatter implements IDataSetFormatter {
	private pretty: boolean;
	constructor(pretty: boolean = true) {
		this.pretty = pretty;
	}
	public formatDataSet(data: DataSet): string {
		let json: any[] = [];
		for(let r: number = 0; r < data.rows; ++r) {
			let v: any[] = data.content[r];
			let o: any = {};
			for(let c: number = 0; c < data.cols; ++c) {
				o[data.columns[c]] = v[c];
			}
			json.push(o);
		}
		return JSON.stringify(json, null, this.pretty ? 4 : undefined);
	}
}
