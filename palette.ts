/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import fs = require('fs');
import Colour from './colour';
import Match from './match';

/** Provides the shape of a palette entry in an externally defined .pal.json file */
export interface IPaletteEntry {
	/** The palette entry colour definition, e.g., "rgb(123,45,67)" */
	defn: string;
	/** The entry name, if it has one */
	name?: string;
	/** Used to cache a constructed colour (not read from the file) */
	colour?: Colour;
};

/** Defines a palette, i.e., a set of pre-defined colour constants with optional names */
export default class Palette {
	/** The short name of the palette, e.g., "css" */
	public readonly name: string;
	/** The long name of the palette e.g., "W3C CSS Level 4 Color Module Named Colors List" */
	public readonly description: string;
	/** Stores the colour map of this palette i.e., the palette entries in ordinal position */
	private readonly colormap: IPaletteEntry[];
	/** Stores a lookup of colour names to the corresponding index in the colour map */
	private readonly indices: { [name: string]: number; };
	/** Constructs the palette with the arguments provided
	  * @param {string} name - the short name of the palette
	  * @param {string} description - the long name of the palette
	  * @param {IPaletteEntry[]} entries - the entries that will be added to the palette
	  */
	constructor(name: string, desc: string, entries: IPaletteEntry[]) {
		this.name = name.toLowerCase();
		this.description = desc;
		let map: IPaletteEntry[] = [];
		let index: { [name: string]: number; } = {};
		for(let e of entries) {
			let i = map.length;
			map.push({ defn: e.defn, name: e.name });
			if(e.name) {
				index[e.name.toLowerCase()] = i;
			}
		}
		this.colormap = map;
		this.indices = index;
	}
	/** Constructs a palette from a JSON encoding
	  * @param {any} json - an object
	  * @returns {Palette} palette constructed from json
	  * @throws {Error} a required field is missing
	  *
	  * The json object must conform to the following schema:
	  *   { name: string, desc: string, entries: { defn: string, name?: string }[] }
	  */
	public static parseJson(json: any): Palette {
		let name: string;
		if('name' in json) {
			name = String(json['name']);
		} else {
			throw new Error('Missing field: \"name\" on: root object');
		}
		let desc: string = name;
		if('desc' in json) {
			desc = String(json['desc']);
		}
		let e: IPaletteEntry[] = [];
		if('entries' in json) {
			let xa: any = json['entries'];
			if(!Array.isArray(xa)) {
				throw new Error('Field is not an array: \"entries\" on: root object');
			}
			let ax: any[] = xa;
			for(let ai: number = 0; ai < ax.length; ++ai) {
				let a: any = ax[ai];
				let defn: string;
				if('defn' in a) {
					defn = String(a['defn']);
				} else {
					throw new Error(`Missing field: \"defn\" on: item at index ${ai} in field \"entries\" of: root object`);
				}
				let n: string|undefined = undefined;
				if('name' in a) {
					n = String(a['name']);
				}
				e.push({ 'defn': defn, 'name': n });
			}
		}
		if(!e.length) {
			throw new Error('Palette contains no entries');
		}
		return new Palette(name, desc, e);
	}
	/** Reads a JSON-formatted file containing a palette asynchronously
	  * @param {string} file - path to the file to read
	  * @returns {Promise<Palette>} promise that will be resolved with the file is read and parsed
	  */
	public static parseJsonFile(file: string): Promise<Palette> {
		return new Promise<Palette>(function (resolve, reject) {
			try {
				fs.readFile(file, { encoding: 'utf8' }, function(err: any, text: string) {
					if(err) {
						reject(err);
					} else {
						let p: Palette;
						try {
							p = Palette.parseJson(JSON.parse(text));
						} catch(e) {
							reject(e);
							return;
						}
						resolve(p);
					}
				});
			} catch(err) {
				reject(err);
			}
		});
	}
	/** Reads a JSON-formatted file contianing a palette synchronously
	  * @param {string} file - path to the file to read
	  * @returns {Palette} the palette read
	  * @throws {Error} the file could not be read or could not be parsed as a palette
	  */
	public static parseJsonFileSync(file: string): Palette {
		return Palette.parseJson(JSON.parse(fs.readFileSync(file, { encoding: 'utf8' })));
	}
	/** Gets the number of entries in the color map */
	public get length(): number {
		return this.colormap.length;
	}
	/** Returns true if a colour with the given name exists in this palette
	  * @param {string} name - name of the colour to find
	  */
	public hasColour(name: string): boolean {
		let n: string = name.toLowerCase();
		return n in this.indices;
	}
	/** Extracts the cached colour from a palette entry  */
	private entryColour(e: IPaletteEntry, index: number): Colour {
		if(!e.colour) {
			e.colour = new Colour(e.defn, e.name, this.name);
			if(!e.colour) {
				let n = e.name || 'unnamed';
				throw new Error(`Cannot parse palette ${this.name} entry #${index+1} (${n}) definition ${e.defn} as a colour`);
			}
		}
		return e.colour;
	}
	/** Returns the index (position in the colour map) of the colour with the given name
	  * @param {string} name - name of the colour to find
	  * @return {number} index of the colour with the given name in the colour map, or -1 if not found
	  */
	public indexOf(name: string): number {
		let n: string = name.toLowerCase();
		if(this.hasColour(n)) {
			return this.indices[n];
		} else {
			return -1;
		}
	}
	/** Returns the colour of the palette entry with the given name
	  * @param {string} name - name of the colour to return
	  * @return {Colour} the colour associated with the name
	  * @throws {Error} this palette does not define a colour with the given name
	  */
	public colourOf(name: string): Colour {
		let n: string = name.toLowerCase();
		if(this.hasColour(n)) {
			let i: number = this.indices[n]
			return this.entryColour(this.colormap[i], i);
		} else {
			throw new Error(`Palette ${this.name} does not define a colour named ${n}`);
		}
	}
	/** Returns the definition of the palette entry with the given name
	  * @param {string} name - name of the colour to define
	  * @return {string} colour definition
	  * @throws {Error} this palette odes not define a colour with the given name
	  */
	public definitionOf(name: string): string {
		let n: string = name.toLowerCase();
		if(this.hasColour(n)) {
			return this.colormap[this.indices[n]].defn;
		} else {
			throw new Error(`Palette ${this.name} does not define a colour named ${n}`);
		}
	}
	/** Returns the colour of the palette entry at the given index
	  * @param {number} index = position in the colour map
	  * @return {Colour} colour at index
	  * @throws {Error} index is outside the valid range [0,this.length)
	  */
	public colourAt(index: number): Colour {
		if(index >= 0 && index < this.colormap.length) {
			return this.entryColour(this.colormap[index], index);
		} else {
			throw new Error(`Argument index = ${index} out of range [0,${this.length})`);
		}
	}
	/** Returns the name of the palette entry at the given index, if one was specified
	  * @param {number} index = position in the colour map
	  * @returns {string|undefined} name of the colour, if one was given; undefined if not
	  * @throws {Error} index is outside the valid range [0,this.length)
	  */
	public nameAt(index: number): string|undefined {
		if(index >=0 && index < this.colormap.length) {
			return this.colormap[index].name;
		} else {
			throw new Error(`Argument index = ${index} out of range [0,${this.length})`);
		}
	}
	/** Returns the definition of the palette enry at the given index
	  * @param {number} index - position in the colour map
	  * @returns {string} definition of the colour
	  * @throws {Error} index is outside the valid range [0,this.length)
	  */
	public definitionAt(index: number): string {
		if(index >=0 && index < this.colormap.length) {
			return this.colormap[index].defn;
		} else {
			throw new Error(`Argument index = ${index} out of range [0,${this.length})`);
		}
	}
	/** Searches the palette in index order for the given colour (or a close approximation thereof)
	  * @param {Colour} c - a colour
	  * @param {number} startAt - index in the palette at which to begin the search
	  * @param {number} deltaE - maximum ΔE*₀₀ colour difference allowed
	  * @return {number} an index >= 0 of the first matching colour found or -1 if no match found
	  */
	public find(c: Colour, startAt: number = 0, deltaE?: number): number {
		for(let i = startAt; i < this.colormap.length; ++i) {
			if(c.equalTo(this.entryColour(this.colormap[i], i), deltaE)) {
				return i;
			}
		}
		return -1;
	}
	/** Searches this colour palette for colours which are close to a given colour
	  * @param {Colour} c - the colour to match
	  * @param {number} count - the maximum number of matches to count
	  * @param {number} deltaE - the maximum ΔE*₀₀ perceptual colour difference to be considered
	  *                          a match
	  * @return {Match[]} array of matches sorted in ascending ΔE*₀₀ order
	  *
	  * The returned array may have zero elements if no matches are found.
	  */
	public match(c: Colour, count: number = 1, deltaE: number = +Infinity): Match[] {
		let matches: Match[] = [];
		for(let i: number = 0; i < this.colormap.length; ++i) {
			let e: IPaletteEntry = this.colormap[i];
			let ce: Colour = this.entryColour(e, i);
			let d: number = c.lab.deltaE(ce.lab);
			if(d < deltaE) {
				let m: Match = {
					index: i,
					colour: ce,
					name: e.name,
					defn: e.defn,
					deltaE: c.lab.deltaE(ce.lab)
				};
				matches.push(m);
			}
		}
		matches.sort(function (a: Match, b: Match): number { return a.deltaE - b.deltaE });
		if(matches.length > count) {
			matches.splice(count, matches.length - count);
		}
		return matches;
	}
}
