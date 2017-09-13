/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import path = require('path');
import fs = require('fs');
import Colour from './colour';
import Palette from './palette';

/** Collection of registered palettes */
export default class Palettes {
	private static readonly palettes: Palette[] = [new Palette(
		'css',
		'CSS',
		[
			{
				name: 'aliceblue',
				defn: '#f0f8ff'
			},
			{
				name: 'antiquewhite',
				defn: '#faebd7'
			},
			{
				name: 'aqua',
				defn: '#00ffff'
			},
			{
				name: 'aquamarine',
				defn: '#7fffd4'
			},
			{
				name: 'azure',
				defn: '#f0ffff'
			},
			{
				name: 'beige',
				defn: '#f5f5dc'
			},
			{
				name: 'bisque',
				defn: '#ffe4c4'
			},
			{
				name: 'black',
				defn: '#000000'
			}, {
				name: 'blanchedalmond',
				defn: '#ffebcd'
			},
			{
				name: 'blue',
				defn: '#0000ff'
			}, {
				name: 'blueviolet',
				defn: '#8a2be2'
			}, {
				name: 'brown',
				defn: '#a52a2a'
			}, {
				name: 'burlywood',
				defn: '#deb887'
			}, {
				name: 'cadetblue',
				defn: '#5f9ea0'
			}, {
				name: 'chartreuse',
				defn: '#7fff00'
			}, {
				name: 'chocolate',
				defn: '#d2691e'
			}, {
				name: 'coral',
				defn: '#ff7f50'
			}, {
				name: 'cornflowerblue',
				defn: '#6495ed'
			}, {
				name: 'cornsilk',
				defn: '#fff8dc'
			}, {
				name: 'crimson',
				defn: '#dc143c'
			},
			{
				name: 'cyan',
				defn: '#00ffff'
			}, {
				name: 'darkblue',
				defn: '#00008b'
			}, {
				name: 'darkcyan',
				defn: '#008b8b'
			}, {
				name: 'darkgoldenrod',
				defn: '#b8860b'
			}, {
				name: 'darkgray',
				defn: '#a9a9a9'
			}, {
				name: 'darkgreen',
				defn: '#006400'
			}, {
				name: 'darkgrey',
				defn: '#a9a9a9'
			}, {
				name: 'darkkhaki',
				defn: '#bdb76b'
			}, {
				name: 'darkmagenta',
				defn: '#8b008b'
			}, {
				name: 'darkolivegreen',
				defn: '#556b2f'
			}, {
				name: 'darkorange',
				defn: '#ff8c00'
			}, {
				name: 'darkorchid',
				defn: '#9932cc'
			}, {
				name: 'darkred',
				defn: '#8b0000'
			}, {
				name: 'darksalmon',
				defn: '#e9967a'
			}, {
				name: 'darkseagreen',
				defn: '#8fbc8f'
			}, {
				name: 'darkslateblue',
				defn: '#483d8b'
			}, {
				name: 'darkslategray',
				defn: '#2f4f4f'
			}, {
				name: 'darkslategrey',
				defn: '#2f4f4f'
			}, {
				name: 'darkturquoise',
				defn: '#00ced1'
			}, {
				name: 'darkviolet',
				defn: '#9400d3'
			}, {
				name: 'deeppink',
				defn: '#ff1493'
			}, {
				name: 'deepskyblue',
				defn: '#00bfff'
			}, {
				name: 'dimgray',
				defn: '#696969'
			}, {
				name: 'dimgrey',
				defn: '#696969'
			}, {
				name: 'dodgerblue',
				defn: '#1e90ff'
			}, {
				name: 'firebrick',
				defn: '#b22222'
			}, {
				name: 'floralwhite',
				defn: '#fffaf0'
			}, {
				name: 'forestgreen',
				defn: '#228b22'
			}, {
				name: 'fuchsia',
				defn: '#ff00ff'
			}, {
				name: 'gainsboro',
				defn: '#dcdcdc'
			}, {
				name: 'ghostwhite',
				defn: '#f8f8ff'
			}, {
				name: 'gold',
				defn: '#ffd700'
			}, {
				name: 'goldenrod',
				defn: '#daa520'
			}, {
				name: 'gray',
				defn: '#808080'
			}, {
				name: 'green',
				defn: '#008000'
			}, {
				name: 'greenyellow',
				defn: '#adff2f'
			}, {
				name: 'grey',
				defn: '#808080'
			}, {
				name: 'honeydew',
				defn: '#f0fff0'
			}, {
				name: 'hotpink',
				defn: '#ff69b4'
			}, {
				name: 'indianred',
				defn: '#cd5c5c'
			}, {
				name: 'indigo',
				defn: '#4b0082'
			}, {
				name: 'ivory',
				defn: '#fffff0'
			}, {
				name: 'khaki',
				defn: '#f0e68c'
			}, {
				name: 'lavender',
				defn: '#e6e6fa'
			}, {
				name: 'lavenderblush',
				defn: '#fff0f5'
			}, {
				name: 'lawngreen',
				defn: '#7cfc00'
			}, {
				name: 'lemonchiffon',
				defn: '#fffacd'
			}, {
				name: 'lightblue',
				defn: '#add8e6'
			}, {
				name: 'lightcoral',
				defn: '#f08080'
			}, {
				name: 'lightcyan',
				defn: '#e0ffff'
			}, {
				name: 'lightgoldenrodyellow',
				defn: '#fafad2'
			}, {
				name: 'lightgray',
				defn: '#d3d3d3'
			}, {
				name: 'lightgreen',
				defn: '#90ee90'
			}, {
				name: 'lightgrey',
				defn: '#d3d3d3'
			}, {
				name: 'lightpink',
				defn: '#ffb6c1'
			}, {
				name: 'lightsalmon',
				defn: '#ffa07a'
			}, {
				name: 'lightseagreen',
				defn: '#20b2aa'
			}, {
				name: 'lightskyblue',
				defn: '#87cefa'
			}, {
				name: 'lightslategray',
				defn: '#778899'
			}, {
				name: 'lightslategrey',
				defn: '#778899'
			}, {
				name: 'lightsteelblue',
				defn: '#b0c4de'
			}, {
				name: 'lightyellow',
				defn: '#ffffe0'
			}, {
				name: 'lime',
				defn: '#00ff00'
			}, {
				name: 'limegreen',
				defn: '#32cd32'
			}, {
				name: 'linen',
				defn: '#faf0e6'
			}, {
				name: 'magenta',
				defn: '#ff00ff'
			}, {
				name: 'maroon',
				defn: '#800000'
			}, {
				name: 'mediumaquamarine',
				defn: '#66cdaa'
			}, {
				name: 'mediumblue',
				defn: '#0000cd'
			}, {
				name: 'mediumorchid',
				defn: '#ba55d3'
			}, {
				name: 'mediumpurple',
				defn: '#9370db'
			}, {
				name: 'mediumseagreen',
				defn: '#3cb371'
			}, {
				name: 'mediumslateblue',
				defn: '#7b68ee'
			}, {
				name: 'mediumspringgreen',
				defn: '#00fa9a'
			}, {
				name: 'mediumturquoise',
				defn: '#48d1cc'
			}, {
				name: 'mediumvioletred',
				defn: '#c71585'
			}, {
				name: 'midnightblue',
				defn: '#191970'
			}, {
				name: 'mintcream',
				defn: '#f5fffa'
			}, {
				name: 'mistyrose',
				defn: '#ffe4e1'
			}, {
				name: 'moccasin',
				defn: '#ffe4b5'
			}, {
				name: 'navajowhite',
				defn: '#ffdead'
			}, {
				name: 'navy',
				defn: '#000080'
			}, {
				name: 'oldlace',
				defn: '#fdf5e6'
			}, {
				name: 'olive',
				defn: '#808000'
			}, {
				name: 'olivedrab',
				defn: '#6b8e23'
			}, {
				name: 'orange',
				defn: '#ffa500'
			}, {
				name: 'orangered',
				defn: '#ff4500'
			}, {
				name: 'orchid',
				defn: '#da70d6'
			}, {
				name: 'palegoldenrod',
				defn: '#eee8aa'
			}, {
				name: 'palegreen',
				defn: '#98fb98'
			}, {
				name: 'paleturquoise',
				defn: '#afeeee'
			}, {
				name: 'palevioletred',
				defn: '#db7093'
			}, {
				name: 'papayawhip',
				defn: '#ffefd5'
			}, {
				name: 'peachpuff',
				defn: '#ffdab9'
			}, {
				name: 'peru',
				defn: '#cd853f'
			}, {
				name: 'pink',
				defn: '#ffc0cb'
			}, {
				name: 'plum',
				defn: '#dda0dd'
			}, {
				name: 'powderblue',
				defn: '#b0e0e6'
			},
			{
				name: 'purple',
				defn: '#800080'
			},
			{
				name: 'rebeccapurple',
				defn: '#663399'
			},
			{
				name: 'red',
				defn: '#ff0000'
			}, {
				name: 'rosybrown',
				defn: '#bc8f8f'
			}, {
				name: 'royalblue',
				defn: '#4169e1'
			}, {
				name: 'saddlebrown',
				defn: '#8b4513'
			}, {
				name: 'salmon',
				defn: '#fa8072'
			}, {
				name: 'sandybrown',
				defn: '#f4a460'
			}, {
				name: 'seagreen',
				defn: '#2e8b57'
			}, {
				name: 'seashell',
				defn: '#fff5ee'
			}, {
				name: 'sienna',
				defn: '#a0522d'
			}, {
				name: 'silver',
				defn: '#c0c0c0'
			}, {
				name: 'skyblue',
				defn: '#87ceeb'
			}, {
				name: 'slateblue',
				defn: '#6a5acd'
			}, {
				name: 'slategray',
				defn: '#708090'
			}, {
				name: 'slategrey',
				defn: '#708090'
			}, {
				name: 'snow',
				defn: '#fffafa'
			}, {
				name: 'springgreen',
				defn: '#00ff7f'
			}, {
				name: 'steelblue',
				defn: '#4682b4'
			}, {
				name: 'tan',
				defn: '#d2b48c'
			}, {
				name: 'teal',
				defn: '#008080'
			}, {
				name: 'thistle',
				defn: '#d8bfd8'
			}, {
				name: 'tomato',
				defn: '#ff6347'
			}, {
				name: 'turquoise',
				defn: '#40e0d0'
			}, {
				name: 'violet',
				defn: '#ee82ee'
			}, {
				name: 'wheat',
				defn: '#f5deb3'
			},
			{
				name: 'white',
				defn: '#ffffff'
			}, {
				name: 'whitesmoke',
				defn: '#f5f5f5'
			},
			{
				name: 'yellow',
				defn: '#ffff00'
			}, {
				name: 'yellowgreen',
				defn: '#9acd32'
			}
		]
	)];
	private static readonly indices: { [name: string]: number } = { css: 0 };
	/** Parses a string as a colour or the name of a colour in a palette
	  * @param {string} colour - string to parse
	  * @return {Colour} the colour specified
	  *
	  * Palettes are searched in the order in which the were added, starting with the stanard
	  * CSS palette. The Javascript undefined value is returned if the string could not be parsed.
	  */
	public static parseString(colour: string): Colour|undefined {
		let c: Colour|undefined = Colour.parseString(colour);
		if(c) {
			return c;
		}
		for(let p of Palettes.palettes) {
			if(p.hasColour(colour)) {
				return p.colourOf(colour);
			}
		}
		return undefined;
	}
	/** Gets a reference to the standard CSS colour palette */
	public static get css(): Palette {
		return Palettes.palettes[0];
	}
	/** Adds a palette to the registry
	  * @param {Palette} pal - the palette to add
	  * @returns {number} index in the list at which pal was added
	  * @throws {Error} there is already a palette with the given name in the list
	  */
	public static add(pal: Palette): number {
		if(pal.name in Palettes.indices) {
			throw new Error(`There is already a palette named ${pal.name} in the list`);
		}
		let index = Palettes.palettes.length;
		Palettes.palettes.push(pal);
		Palettes.indices[pal.name] = index;
		return index;
	}
	/** Gets the number of palettes in the registry */
	public static get count(): number {
		return Palettes.palettes.length;
	}
	/** Gets the palette at the given index in the list
	  * @param {number} index - zero-based index in the list
	  * @return {Palette} palette at index
	  * @throws {Error} index is less than zero or greater than or equal to the count of palettes
	  */
	public static paletteAt(index: number): Palette {
		if(index >= 0 && index < Palettes.palettes.length) {
			return Palettes.palettes[index];
		} else {
			throw new Error(`Argument index = ${index} outside valid range [0,${Palettes.count})`);
		}
	}
	/** Returns true if there is a palette in the list with the given name
	  * @param {string} name - name of palette
	  * @returns {boolean} true if there is a palette with the name
	  */
	public static hasPalette(name: string): boolean {
		return name in Palettes.indices;
	}
	/** Gets the palette with the given name
	  * @param {string} name - name of the palete to return
	  * @returns {Palette} the palette with the given name
	  * @throws {Error} There is no palette with the given name in the list
	  */
	public static paletteOf(name: string): Palette {
		if(Palettes.hasPalette(name)) {
			return Palettes.palettes[this.indices[name]];
		} else {
			throw new Error(`No palette named ${name}`);
		}
	}
	/** Gets the zero-based index of the palette in the list with the given name
	  * @param {string} name - name of the palette to find
	  * @returns {number} integer index [0, Palettes.count) in the list, or -1 if not found
	  */
	public static indexOf(name: string): number {
		if(Palettes.hasPalette(name)) {
			return Palettes.indices[name];
		} else {
			return -1;
		}
	}
	/** Returns the location of the user’s palette directory, $HOME/.mjtb-colours
	  * @return {string} $HOME/.mjtb-colours
	  */
	public static get userPaletteDir(): string {
		if(process.platform === 'win32') {
			return path.resolve(process.env['USERPROFILE'], '.mjtb-colours');
		} else {
			return path.resolve(process.env['HOME'], '.mjtb-colours');
		}
	}
	private static collectPaletteFiles(dirs: string[], paletteFiles: string[], resolve: any, reject: any) {
		if(dirs.length) {
			let d: string|undefined = dirs.shift();
			if(d) {
				fs.readdir(d, { encoding: 'utf8' }, function(err: any, files: string[]) {
					if(err && err.code !== 'ENOENT') {
						reject(err);
					} else {
						if(!err && files && files.length) {
							files = files.filter((f) => f.toLowerCase().endsWith('.palette'));
							files.sort();
							for(let f of files) {
								paletteFiles.push(path.resolve(d, f));
							}
						}
						Palettes.collectPaletteFiles(dirs, paletteFiles, resolve, reject);
					}
				});
			} else {
				Palettes.collectPaletteFiles(dirs, paletteFiles, resolve, reject);
			}
		} else {
			Palettes.parsePaletteFiles(paletteFiles, [], resolve, reject);
		}
	}
	private static parsePaletteFiles(paletteFiles: string[], palettes: Palettes[], resolve: any, reject: any) {
		if(paletteFiles.length) {
			let f: string|undefined = paletteFiles.shift();
			if(f) {
				Palette.parseJsonFile(f).then((pal: Palette): void => {
					palettes.push(pal);
					Palettes.add(pal);
					Palettes.parsePaletteFiles(paletteFiles, palettes, resolve, reject);
				}).catch((err: any): void => {
					reject(err);
				});
			} else {
				Palettes.parsePaletteFiles(paletteFiles, palettes, resolve, reject);
			}
		} else {
			resolve(palettes);
		}
	}
	/** Loads all of the *.palette files from the given directories asynchronously
	  * @param {string} dirs - list of directories in which files will be loaded
	  * @returns {Promise<void>} a promise that is resolved when all of the
	  */
	public static loadUserPalettes(dirs?: string[]): Promise<Palette[]> {
		return new Promise<Palette[]>(function(resolve: any, reject: any) {
			if(!dirs) {
				dirs = [];
			}
			if(!dirs.length) {
				dirs.push(Palettes.userPaletteDir);
			}
			Palettes.collectPaletteFiles(dirs, [], resolve, reject);
		});
	}
};
