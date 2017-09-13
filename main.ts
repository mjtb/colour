/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import util = require('util');
import path = require('path');
import commander = require('commander');

import Component from './component';
import Colour from './colour';
import Palette from './palette';
import Palettes from './palettes';
import Match from './match';
import RGB from './rgb';
import Linear from './linear';
import XYZ from './xyz';
import LAB from './lab';
import * as ds from './dataset';

function convert(format: string, template: string|undefined, columns: string, colours: string[]): number {
	let data: ds.DataSet = new ds.DataSet(columns);
	for(let c of colours) {
		let colour: Colour|undefined = Palettes.parseString(c);
		if(!colour) {
			throw new Error(`Could not parse ${c} as a colour`);
		}
		data.push(c, colour);
	}
	let formatter: ds.IDataSetFormatter = ds.formatterOf(format, template);
	console.log(formatter.formatDataSet(data));
	return 0;
}

function columns(): number {
	let data: ds.DataSet = new ds.DataSet('*');
	let columns: string[] = data.columns;
	let headers: string[] = data.headers;
	let samples: string[] = data.samples;
	console.log();
	console.log('Column specifications and their meanings:')
	console.log();
	let format_width: number = 0;
	for(let c of columns) {
		format_width = Math.max(format_width, c.length);
	}
	let sample_width: number = 0;
	for(let c of samples) {
		sample_width = Math.max(sample_width, c.length);
	}
	for(let i: number = 0; i < columns.length && i < headers.length && i < samples.length; ++i) {
		let p: string = columns[i] + (columns[i].length < format_width ? ' '.repeat(format_width - columns[i].length) : '');
		let q: string = samples[i] + (samples[i].length < sample_width ? ' '.repeat(sample_width - samples[i].length) : '');
		console.log(`    ${p}  ${q}  ${headers[i]}`);
	}
	console.log();
	return 0;
}

function match(format: string, template: string|undefined, columns: string, palette: Palette, count: number, deltaE: number, colours: string[]): number {
	let data: ds.DataSet = new ds.DataSet(columns);
	for(let c of colours) {
		let colour: Colour|undefined = Palettes.parseString(c);
		if(!colour) {
			throw new Error(`Could not parse ${c} as a colour`);
		}
		let matches: Match[] = palette.match(colour, count, deltaE);
		if(!matches.length) {
			console.error(`No matches for ${c}`);
			continue;
		}
		for(let m of matches) {
			data.push(c, m.colour, colour);
		}
	}
	let formatter: ds.IDataSetFormatter = ds.formatterOf(format, template);
	console.log(formatter.formatDataSet(data));
	return 0;
}

export function main(argv?: string[]): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		commander
			.version('0.0.1')
			.option('-f, --format <format>', 'Set output format [text, csv, html, flat or json]')
			.option('-c, --columns <columns...>', 'Set output columns')
			.option('-n, --count <count>', 'Set number of matches')
			.option('-e, --delta <delta>', 'Set the maximum ΔE*₀₀ colour difference for matches')
			.option('-t, --template <template>', 'Use the given Pug template for HTML rendering')
			.option('-p, --palette <file>', 'Use definitions in the given palette file')
			.description('Tools for working with colours');
		commander
			.command('convert [colours...]')
			.description('Converts colours to various colour spaces')
			.action(function(...args: any[]): void {
				let options: any = args[args.length - 1].parent;
				if(options.palette) {
					Palettes.add(Palette.parseJsonFileSync(path.resolve(process.cwd(), options.palette)));
				}
				Palettes.loadUserPalettes().then(
					(palettes: Palette[]): void => {
						resolve(
							convert(
								options.format || 'text',
								options.template,
								options.columns || 'rpxl',
								args[0]
							)
						);
					}).catch((err: any): void => {
						reject(err);
					});
			});
		commander
			.command('match <palette> [colours...]')
			.description('Matches colours in the given palette')
			.action(function(...args: any[]): void {
				let options: any = args[args.length - 1].parent;
				if(options.palette) {
					Palettes.add(Palette.parseJsonFileSync(path.resolve(process.cwd(), options.palette)));
				}
				Palettes.loadUserPalettes().then(
					(palettes: Palette[]): void => {
						let pal: Palette = Palettes.paletteOf(args[0]);
						resolve(
							match(
								options.format || 'text',
								options.template,
								options.columns || `[${pal.name}][${pal.name}:d][${pal.name}:e]`,
								pal,
								options.count || pal.length,
								options.delta || +Infinity,
								args[1]
							)
						);
					}).catch((err: any): void => {
						reject(err);
					});
			});
		commander
			.command('columns')
			.description('Prints syntax help for --columns')
			.action(function(...args: any[]): void {
				let options: any = args[args.length - 1].parent;
				if(options.palette) {
					Palettes.add(Palette.parseJsonFileSync(path.resolve(process.cwd(), options.palette)));
				}
				Palettes.loadUserPalettes().then((palettes: Palette[]) => {
					resolve(columns());
				}).catch((err: any): void => {
					reject(err)
				});
			 });
		commander
			.parse(argv || process.argv);
	});
}
