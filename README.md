# mjtb-colour

Converts colours between various colour spaces.

Copyright (C) 2017 Michael Trenholm-Boyle.

Redistributable under a permissive (MIT) open source license. See the
[LICENSE](LICENSE) file for details.


## About this package

The `mjtb-colours` package exports classes (written in TypeScript) that
convert colours between various colour spaces:

*	[sRGB](https://en.wikipedia.org/wiki/SRGB) _\(what we usually mean
	when we say “RGB” colour space\)_
*	[HSL](https://en.wikipedia.org/wiki/HSL_and_HSV)
	_\(Hue-Saturation-Lightness\)_
*	[HWB](https://en.wikipedia.org/wiki/HWB_color_model)
	_\(Hue-Whiteness-Blackness, an alternative to HSL included in the
	W3C CSS Level 4 Color Module\)_
*	[Linear RGB](https://en.wikipedia.org/wiki/CIE_1931_color_space#CIE_RGB_color_space)
	_\(a.k.a., CIE RGB i.e., without sRGB companding\)_
*	[CIE XYZ](https://en.wikipedia.org/wiki/CIE_1931_color_space#Definition_of_the_CIE_XYZ_color_space)
*	[CIE L\*a\*b\*](https://en.wikipedia.org/wiki/Lab_color_space#CIELAB)
*	[CIE L\*C\*h°](https://en.wikipedia.org/wiki/Lab_color_space#Cylindrical_representation:_CIELCh_or_CIEHLC)
	_\(cylindrical coordinates of CIE LAB\)_
*	[YUV](https://en.wikipedia.org/wiki/YCbCr#JPEG_conversion) _\(more
	precisely, the Y'CbCr colour space defined by the ITU T.871 JPEG
	specification\)_
*	[YCC](https://en.wikipedia.org/wiki/YCbCr#ITU-R_BT.2020_conversion)
	_\(more precisely, the Yc'CbcCrc linear colour space defined by the
	ITU-R BT.2020 specification\)_

Each colour space is represented by its own class e.g., `RGB`, `HSL`,
`Linear`, etc. The `Colour` class encapsulates a single colour expressed
in all provided colour spaces.

Palette-based colour spaces are also supported. One palette, defined by
the [W3C CSS Level 4 Color Module](https://www.w3.org/TR/css-color-4/#named-colors)
specification, is provided out-of-box.

This package also installs a command-line interface `colours` for
performing conversions between different colour spaces and matching
colours to colour palettes.


## Pre-requisites & dependencies

*	[Node.js 8.4](https://nodejs.org/en/)
*	[TypeScript 2.5](https://www.typescriptlang.org/)
*	[Gulp 1.4](https://gulpjs.com/)
*	[Pug 2.0](https://pugjs.org/)
*	[Jasmine 2.8](https://jasmine.github.io/)
*	[Instanbul 11.2](https://istanbul.js.org/)
*	[Commander](https://www.npmjs.com/package/commander)


## Build & test

Uses `gulp` as its build system, `jasmine` as it unit test runner and
`nyc` for code coverage.

```
npm build .
npm test
```


## Command-line interface

The `colour` tool exposes a command-line interface for converting
colours between colour spaces and matching colours in palettes.

```
colour --help

  Usage: colour [options] [command]

  Converts colours between various colour spaces


  Options:

    -V, --version               output the version number
    -f, --format <format>       Set output format [text, csv, html, flat or json]
    -c, --columns <columns...>  Set output columns
    -n, --count <count>         Set number of matches
    -e, --delta <delta>         Set the maximum ΔE*₀₀ colour difference for matches
    -t, --template <template>   Use the given Jade template for HTML rendering
    -p, --palette <file>        Use definitions in the given palette file
    -h, --help                  output usage information


  Commands:

    convert [colours...]          Converts colours to various colour spaces
    match <palette> [colours...]  Matches colours in the given palette
    columns                       Prints syntax help for --columns
```

The `colours columns` sub-command will show you the different colour
spaces available and give you examples of their string representations:

```
colour columns


Column specifications and their meanings:

    r      rgb(0,128,255)                sRGB
    p      rgb(0%,50%,100%)              sRGB (%)
    x      #0080FF                       sRGB (Hex)
    6      #0080FF                       #rrggbb
    3      #08F                          #rgb
    l      lab(53.53 8.67 -72.58)        L*a*b*
    r:e    ±5.527                        ΔE*₀₀ (RGB)
    3:e    ±5.527                        ΔE*₀₀ (#rgb)
    lin    lin(0,0.50196,1)              Linear RGB
    hsl    hsl(210,100%,50%)             HSL
    hwb    hwb(210,0%,0%)                HWB
    yuv    yuv(104,-37,42)               YUV
    ycc    ycc(1040,376,2094)            Yc′CbcCrc
    xyz    xyz(0.25697,0.22525,0.97582)  XYZ
    lch    lch(53.39 73.36 277.01)       L*C*h°
    css    aliceblue                     CSS
    css:d  rgb(0,128,255)                CSS (Definition)
    css:i  0                             CSS (Index)
    css:e  ±5.527                        ΔE*₀₀ (CSS)

```

The ΔE*₀₀ values are the colour difference values computed using the
(CIEDE2000)[https://en.wikipedia.org/wiki/Color_difference#CIEDE2000]
definitions and formulae.

### Converting colours

The `colour convert` command will convert colours to different
colour spaces according to the columns you specify in the `--columns`
parameter, which defaults to `rpxl`. The output is formatted
according to the `--format` parameter which defaults to `text` i.e.,
a text-based table format akin to GitHub-flavoured Markdown tables.

For example:

```
colour convert lightgoldenrodyellow

| sRGB             | sRGB (%)                  | sRGB (Hex) | L*a*b*                |
|:-----------------|:--------------------------|:-----------|:----------------------|
| rgb(250,250,210) | rgb(98.04%,98.04%,82.35%) | #fafad2    | lab(97.51 -4.8 19.27) |
```

The `csv` and `html` formats are similar to the standard
`text` format except as [Comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values)
and HTML, respectively.

The `flat` format transposes rows/columns into a multi-line layout.
For example:

```
colour convert -f flat -c * "lab(80 40 80)"

lab(80 40 80)
	sRGB            	 rgb(255,166,30)
	sRGB (%)        	 rgb(100%,65.21%,11.6%)
	sRGB (Hex)      	 #ffa61e
	#rrggbb         	 #ffa61e
	#rgb            	 #fa1
	L*a*b*          	 lab(80 40 80)
	ΔE*₀₀ (RGB)     	 6.615
	ΔE*₀₀ (#rgb)    	 7.852
	Linear RGB      	 lin(1.310868,0.382729,0.012685)
	HSL             	 hsl(36.385, 100%, 55.799%)
	HWB             	 hwb(36.385, 11.598%, 0%)
	YUV             	 yuv(157.6,40.38,253.51)
	Yc′CbcCrc       	 ycc(2374,954,4595)
	XYZ             	 xyz(0.679819,0.553411,0.083017)
	L*C*h°          	 lch(80 89.44 63.43)
	CSS             	 orange
	CSS (Definition)	 #ffa500
	CSS (Index)     	 105
	ΔE*₀₀ (CSS)     	 7.121
```

The `*` column specification is a shorthand for specifying all columns.

The `json` format emits colour information in a JSON array, where each
color output is an array element and each colour space is a named
property on the object. For example:

```
colour convert -f flat -c * "lab(80 40 80)"

[
    {
        "3": "#fa1",
        "6": "#ffa61e",
        "r": "rgb(255,166,30)",
        "p": "rgb(100%,65.21%,11.6%)",
        "x": "#ffa61e",
        "l": "lab(80 40 80)",
        "r:e": 6.615326504210232,
        "3:e": 7.852316212299042,
        "lin": "lin(1.310868,0.382729,0.012685)",
        "hsl": "hsl(36.385, 100%, 55.799%)",
        "hwb": "hwb(36.385, 11.598%, 0%)",
        "yuv": "yuv(157.6,40.38,253.51)",
        "ycc": "ycc(2374,954,4595)",
        "xyz": "xyz(0.679819,0.553411,0.083017)",
        "lch": "lch(80 89.44 63.43)",
        "css": "orange",
        "css:d": "#ffa500",
        "css:i": 105,
        "css:e": 7.121059020879613
    }
]
```

### Colour matching

The `colour match` command matches arbitrary colours to those in
a named palette. Matches are sorted by their ΔE*₀₀ colour difference.

For example, to find the 5 colours in the CSS standard that are closest
to `lab(80 40 80)`, printing the CSS colour name, its RGB value \(in
hex\) its L\*a\*

```
colour match -c "[css]x[r:e]l" -n 5 css "lab(80 40 80)"

| CSS         | sRGB (Hex) | ΔE*₀₀ (RGB) | L*a*b*                 |
|:------------|:-----------|:------------|:-----------------------|
| orange      | #ffa500    | 7.121       | lab(75.59 27.52 79.11) |
| darkorange  | #ff8c00    | 7.233       | lab(70.21 39.79 76.08) |
| sandybrown  | #f4a460    | 9.396       | lab(74.48 25.73 47.36) |
| goldenrod   | #daa520    | 15.366      | lab(71.32 12.21 68.67) |
| lightsalmon | #ffa07a    | 15.742      | lab(75.22 33.51 35.32) |
```


## API documentation

This section provides a brief overview of how to use the classes in
this package. Full JSDoc API documentation is available on the
mjtb-colours [wiki](https://mjtb.github.io/colours#wiki) on GitHub.

The examples given in this section are available in the `examples.js`
file in the source distribution. You can run them directly using
`npm run-script examples`.

### Working with colours, colour spaces, and components

Use the `Palettes.parseString` function to parse a colour specification
or named colour:

```javascript
const colour = require('mjtb-colour');

function ex1_Palettes_parseString() {
	console.log("== EXAMPLE #1: Palettes.parseString ==");
	let aliceblue = colour.Palettes.parseString('aliceblue');
	console.log(`Name: ${aliceblue.name}`); // aliceblue
	console.log(`Colour: ${aliceblue.toString()}`); // aliceblue
	console.log(`RGB: ${aliceblue.rgb.toString()}`); // #f0f8ff
	console.log(`RGB: ${aliceblue.rgb.toHexString()}`); // #f0f8ff
	console.log(`RGB: ${aliceblue.rgb.toRgbString()}`); // rgb(240,248,255)
	console.log(`HSL: ${aliceblue.hsl.toString()}`); // hsl(208,100%,97.06%)
	console.log();
}
```

Use the `Colour.parseString` function to skip palette lookups. You can
use colour space when specifying a colour to either `Colours.parseString`
or `Palettes.parseString`.

```javascript
const colour = require('mjtb-colours');

function ex2_Colour_parseString() {
	console.log("== EXAMPLE #2: Colour.parseString ==");
	let rgb1 = colour.Colour.parseString('rgb(255,0,255)');
	let rgb2 = colour.Colour.parseString('#ff00ff');
	let rgb3 = colour.Colour.parseString('#f0f');
	let rgb4 = colour.Colour.parseString('rgb(100%,0,100%)');
	let hsl = colour.Colour.parseString('hsl(300,100%,50%)');
	let hwb = colour.Colour.parseString('hwb(300,0%,0%)');
	console.log(rgb1.equalTo(rgb2)); // true
	console.log(rgb2.equalTo(rgb3)); // true
	console.log(rgb3.equalTo(rgb4)); // true
	console.log(rgb4.equalTo(hsl)); // true
	console.log(hsl.equalTo(hwb)); // true
	console.log();
}
```

You can use the `parseString` static method of individual colour spaces
to further restrict results. The return value will be an instance of
the colour space-specific class, not the `Colour` wrapper class.


```javascript
const colour = require('mjtb-colours');

function ex3_SpaceSpecific_parseString() {
	console.log("== EXAMPLE #3: Colour space-specific parseString ==");
	let c = colour.Colour.parseString('rgb(255,0,255)');
	console.log(c instanceof colour.Colour); // true
	let rgb = colour.RGB.parseString('rgb(255,0,255)');
	console.log(rgb instanceof colour.Colour); // false!!
	console.log(rgb instanceof colour.RGB); // true
	let hsl = colour.HSL.parseString('hsl(300,100%,50%)');
	console.log(hsl instanceof colour.Colour); // false!!
	console.log(hsl instanceof colour.RGB); // false!!
	console.log(hsl instanceof colour.HSL); // true
	console.log();
}
```

Note that you cannot directly compare across colour spaces without
conversion:

```javascript
const colour = require('mjtb-colours');

function ex4_SpaceSpecific_equalTo() {
	console.log("== EXAMPLE #4: Colour space-specific equalTo ==");
	let rgb = colour.RGB.parseString('rgb(255,0,255)');
	let hsl = colour.HSL.parseString('hsl(300,100%,50%)');
	console.log(rgb.equalTo(hsl)); // type error: false!!!
	let c1 = new colour.Colour(rgb);
	let c2 = new colour.Colour(hsl);
	console.log(c1.equalTo(c2)); // true
	console.log();
}
```

The colour space components are exposed as properties on the colour
space objects. Properties with lowercase names have field values
normalized to the range \[0.0, 1.0\] in _most_ cases, while equivalently
named properties with uppercase names have fields values normalized to
natural range e.g., \[0,255\] for RGB, \[0,360\) for HSL-Hue,
\[0.0,100.0\] for HSL-Saturation, etc. \(Colours in `LAB` and `LCH` are
use natural range components exclusively.\)

```javascript
const colour = require('mjtb-colours');

function ex5_Normalized_and_natural_properties() {
	console.log("== EXAMPLE #5: Normalized and natural properties ==");
	let rgb = colour.RGB.parseString('rgb(255,0,255)');
	console.log(rgb.r); // 1
	console.log(rgb.R); // 255
	let hsl = colour.HSL.parseString('hsl(72deg,50%,75%)');
	console.log(hsl.h); // 0.2
	console.log(hsl.H); // 72
	let lab = colour.LAB.parseString('lab(97.12 -1.77 -4.36)');
	console.log(lab.l); // 97.12
	console.log(lab.a); // -1.77
	console.log(lab.b); // -4.36
	console.log();
}
```

Create instances of colour space objects with their **normalized**
component values:

```javascript
const colour = require('mjtb-colours');

function ex6_SpaceSpecific_constructors() {
	console.log("== EXAMPLE #6: Colour space-specific constructors ==");
	let rgb = new colour.RGB(1,0,0.5);
	console.log(rgb.toRgbString()); // rgb(255,0,128)
	let hsl = new colour.HSL(0.2,0.5,0.75);
	console.log(hsl.toString()); // hsl(72,50%,75%)
	let lab = new colour.LAB(97.12,-1.77,-4.36);
	console.log(lab.toString()); // lab(97.12 -1.77 -4.36)
	console.log();
}
```

The `toString` formatting methods of most colour spaces is relatively
uncomplicated. But, the behaviour of the `RGB.toString` method and
the `Colour.toString` methods requires more explanation.

For RGB objects, the `toString` method prefers the 3-digit hexadecimal
form \(if the colour can be represented this way without loss of
precision\), otherwise it prefers the 6-digit hexadecimal form \(again,
if the colour can be represented this way without loss of precision\).
Otherwise, it prefers the decimal `rgb(r,g,b)` form. In practice, this
form is only used when an RGB value lies outside the gamut of sRGB.
The decimal `rgb(r,g,b)` form rounds component values to the nearest
integer. For higher precision, call the `RGB.toRgbString` method with
the `true` argument to force output using percentages, which are rounded
to 2 decimal digits of precision.

```javascript
const colour = require('mjtb-colours');

function ex7_RGB_toString_behaviour() {
	console.log("== EXAMPLE #7: RGB.toString behaviour ==");
	let h3 = colour.RGB.parseString('rgb(17,34,51)');
	console.log(h3.isClipped); // true
	console.log(h3.isHexable); // true
	console.log(h3.isHexable3); // true
	console.log(h3.toString()); // #123
	console.log(h3.toHexString()); // #123
	console.log(h3.toHexString(true /* force 6-digit */)); // #112233
	console.log(h3.toRgbString()); // rgb(17,34,51)
	console.log(h3.toRgbString(true /* force % */)); // rgb(6.67%,13.33%,20%);
	let h6 = colour.RGB.parseString('rgb(161,178,195)');
	console.log(h6.isClipped); // true
	console.log(h6.isHexable); // true
	console.log(h6.isHexable3); // false
	console.log(h6.toString()); // #a1b2c3
	console.log(h6.toHexString()); // #a1b2c3
	console.log(h6.toRgbString()); // rgb(161,178,195)
	console.log(h6.toRgbString(true /* force % */)); // rgb(63.14%,69.8%,76.47%)
	let r1 = colour.RGB.parseString('rgb(0.7,32,199)');
	console.log(r1.isClipped); // true
	console.log(r1.isHexable); // false
	console.log(r1.toString()); // rgb(1,32,199)
	console.log(r1.toRgbString(true /* force % */)); // rgb(0.27%,12.55%,78.04%)
	let r2 = colour.RGB.parseString('rgb(-73,257,100)');
	console.log(r2); // undefined
	r2 = new colour.RGB(-73/255.0, 257/255.0, 100/255.0);
	console.log(r2.isClipped); // false
	console.log(r2.isHexable); // false
	console.log(r2.toString()); // rgb(-73,257,100)
	console.log();
}
```

The `Colour.toString` method will return the name of the colour if
it was loaded from a palette, otherwise it will return the `toString`
of the colour space from whence it was constructed. For example:

```javascript
const colour = require('mjtb-colours');

function ex8_Colour_toString_behaviour() {
	console.log("== EXAMPLE #8: Colour.toString behaviour ==");
	let c1 = colour.Palettes.parseString('aliceblue');
	console.log(c1.toString()); // aliceblue
	let c2 = colour.Palettes.parseString('rgb(240,248,255)');
	console.log(c2.toString()); // #f0f8ff
	let c3 = colour.Palettes.parseString('hsl(72deg,35%,90%)');
	console.log(c3.toString()); // hsl(72,35%,90%)
	let c4 = new colour.Colour(new colour.YUV(0.5,-0.3,0.2));
	console.log(c4.toString()); // yuv(128,51,179)
	console.log();
}
```


### Working with palettes

A _palette_ is simply a named array of colours where each colour may
optionally be given a name. Palettes are represeted as a JSON object
using the following schema:

```javascript
{
	"$schema": "http://json-schema.org/schema#",
	"$id": "https://mjtb.github.io/colours#palette-json-schema",
	"title": "Palette",
	"description": "Schema for JSON-formatted palettes",
	"definitions": {
		"entry": {
			"type": "object",
			"properties": {
				"defn": {
					"type": "string",
					"description": "the colour e.g., rgb(255,0,204)"
				},
				"name": {
					"type": "string",
					"description": "optional name e.g., aliceblue"
				}
			},
			"required": [ "defn" ]
		},
		"palette": {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"description": "case-insensitive unique identifier e.g., css"
				},
				"desc": {
					"type": "string",
					"description": "descriptive name e.g., W3C CSS Level 3 Named Colors"
				},
				"entries": {
					"type": "array",
					"description": "list of colour entries in the palette"
					"items": {
						"type": "entry"
					}
				}
			},
			"required": [ "name", "desc", "entries" ]
		}
	}
}
```

For example, here is a basic colour palette:

```javascript
{
	"name": "basic",
	"desc": "Basic Colours",
	"entries": [
		{ "name": "black",  "defn": "#000" },
		{ "name": "white",  "defn": "#fff" },
		{ "name": "red",    "defn": "lab(50 75 65)" },
		{ "name": "green",  "defn": "lab(50 -50 50)" },
		{ "name": "yellow", "defn": "lab(95 -15 90)" },
		{ "name": "blue",   "defn": "lab(50 15 -75)" },
		{ "name": "brown",  "defn": "lab(35 35 35)" },
		{ "name": "orange", "defn": "lab(60 40 65)" },
		{ "name": "purple", "defn": "lab(30 50 -30)" },
		{ "name": "pink",   "defn": "lab(80 20 5)" },
		{ "name": "grey",   "defn": "#999" },
		{ "name": "teal",   "defn": "lab(60 -40 0)" },
	]
}
```

You can parse a JSON object into a Palette with the `Palette.parseJson`
method. You can load a palette from a file with the
`Palette.parseJsonFile` \(which returns a Promise that resolves when the
asynchronous load operation completes\) or the synchronous version of
this function, `Palette.parseJsonFileSync`. You can add a palette
constructed in this way to the global `Palettes` list by calling
`Palettes.add`.

The `colour` command-line interface will load user-defined palettes in
this JSON format that were saved to `$HOME/.mjt-colours/*.palette` and
your application can do the same by calling the
`Palettes.loadUserPalettes` method. \(This method operates
asynchronously  and returns a promise; there is no synchronous version
of this method.\)

To retreive a specific palette by name from the global list of palettes
call the `Palettes.hasPalette` method to first check for its presence
then call the `Palettes.paletteOf` method to retreive the palette. You
can call the shortcut method `Palettes.css` to fetch the standard WC3
CSS Level 4 Color Module named colours palette.

You can also iterate over the palettes by index as well. Call
`Palettes.count` to fetch the number of palettes, then iterate over the
indexes from 0 to `Palettes.count - 1` and call the `Palettes.paletteAt`
to retrieve the specific palette.

Once you have a reference to a palette, you can iterate over its entries
by passing indexes from 0 to `Palette.length - 1` to `Palette.colourAt`
or `Palette.nameAt` and `Palette.definitionAt` to fetch its parsed
colour, optional name, and original definition string \(i.e., the `defn`
property in the JSON used to construct the palette\).

You can access colours in a palette by name by first calling
`Palette.hasColour` to check that the name exists and then calling
`Palette.colourOf`, `Palette.indexOf` and `Palette.definitionOf` to
fetch its parsed colour, its index in the colourmap and its original
definition string.

To find an exact \(or approximate\) match to a colour in the palette,
you can use the `Palette.find` method. This method works analogously to
the Javascript built-in `Array.indexOf` method: it returns the index of
the first colour in the palette that is equal to \(more precisely,
_approximately_ equal to) a given colour. If a matching colour was not
found, -1 is returned. You can control how close an “approximately equal”
colour is by passing the maximum allowed ΔE*₀₀ as an optional argument.
\(If the ΔE*₀₀ argument is omitted, colours are considered equal if their
natural sRGB component values are equivalent.\)

Another way to match colours in a palette is to use the `Palette.match`
method. This method returns an array of `Match` objects. Each match
object returned gives the details of the palette entry — index,
parsed colour, name, etc. — and the ΔE*₀₀ colour difference between
the palette entry and the colour to match. The returned array is sorted
in ascending ΔE*₀₀ order i.e., in most-closely-matching-colour-first
order. A parameter to `Palette.match` controls the number of matches
returned; by default, only the most closely matching colour is returned
but you can increase this to e.g., the top 5 matches. You can also
limit the maximum allowed ΔE*₀₀ for matches; by default, there is no
limit on the maximum allowed ΔE*₀₀.

```javascript
const colour = require('mjtb-colours');

function ex9_Palette_matching() {
	console.log("== EXAMPLE #9: Palette matching ==");
	let pal = colour.Palette.parseJson({
		"name": "basic",
		"desc": "Basic Colours",
		"entries": [
			{ "name": "black",  "defn": "#000" },
			{ "name": "white",  "defn": "#fff" },
			{ "name": "red",    "defn": "lab(50 75 65)" },
			{ "name": "green",  "defn": "lab(50 -50 50)" },
			{ "name": "yellow", "defn": "lab(95 -15 90)" },
			{ "name": "blue",   "defn": "lab(50 15 -75)" },
			{ "name": "brown",  "defn": "lab(35 35 35)" },
			{ "name": "orange", "defn": "lab(60 40 65)" },
			{ "name": "purple", "defn": "lab(30 50 -30)" },
			{ "name": "pink",   "defn": "lab(80 20 5)" },
			{ "name": "grey",   "defn": "#999" },
			{ "name": "teal",   "defn": "lab(50 -40 -10)" },
		]
	});
	let index = pal.find(colour.Colour.parseString('#8A371B'));
	console.log(index); // 6
	console.log(pal.nameAt(index)); // brown
	console.log(pal.colourAt(index).toString()); // brown
	console.log(pal.colourAt(index).rgb.toString()); // rgb(138,55,27)
	let matches = pal.match(colour.Palettes.css.colourOf('tomato'), 3);
	console.log(matches.length); // 3
	console.log(matches[0].name); // red
	console.log(matches[0].deltaE.toFixed(2)); // 12.99
	console.log(matches[1].name); // orange
	console.log(matches[1].deltaE.toFixed(2)); // 14.97
	console.log(matches[2].name); // pink
	console.log(matches[2].deltaE.toFixed(2)); // 24.17
	console.log();
}
```

### Conversions between colour spaces

Normally, use use the `Colour` wrapper class to take care of conversions
between colour spaces. But, if performance matters, you can “manually”
convert colours between spaces using the various `toXXX` instance
methods and `fromYYY` static methods on the colour space classes.

Many conversions from one colour space to another require one or more
intermediate steps. The list below shows the convertibility of
colours spaces to RGB.

*	HSL ↔ RGB _via_ `HSL.fromRGB` and `HSL.toRGB`
*	HWB ↔ RGB _via_ `HWB.fromRGB` and `HWB.toRGB`
*	Linear ↔ RGB _via_ `Linear.fromRGB` and `Linear.toRGB`
*	XYZ ↔ Linear ↔ RGB _via_ `XYZ.fromLinear` and `XYZ.toLinear`
*	LAB ↔ XYZ ↔ Linear ↔ RGB _via_ `LAB.fromXYZ` and `LAB.toXYZ`
*	LCH ↔ LAB ↔ XYZ ↔ Linear ↔ RGB _via_ `LCH.fromLAB` and `LCH.toLAB`
*	YUV ↔ Linear ↔ RGB _via_ `YUV.fromLinear` and `YUV.toLinear`
*	YCC ↔ Linear ↔ RGB _via_ `YCC.fromLinear` and `YUV.toLinear`

The following example demonstrates round-trip conversions from LCH to
HSL colour space \(which are pretty much the maximum case\).

```javascript
const colour = require('mjtb-colours');

function ex10_Colour_space_convertibility() {
	console.log("== EXAMPLE #10: Colour space convertibility ==");
	let lch1 = colour.LCH.parseString('lch(60 40 180)');
	let lab1 = lch1.toLAB();
	let xyz1 = lab1.toXYZ();
	let lin1 = xyz1.toLinear();
	let rgb1 = lin1.toRGB();
	let hsl1 = colour.HSL.fromRGB(rgb1);
	console.log(hsl1.toString()); // hsl(171.63,79.31%,35.68%)
	let hsl2 = colour.HSL.parseString('hsl(171.63,79.31%,35.68%)');
	let rgb2 = hsl2.toRGB();
	let lin2 = colour.Linear.fromRGB(rgb2);
	let xyz2 = colour.XYZ.fromLinear(lin2);
	let lab2 = colour.LAB.fromXYZ(xyz2);
	let lch2 = colour.LCH.fromLAB(lab2);
	console.log(lch2.toString()); // lch(59.99 40 180)
	console.log(lch2.equalTo(lch1)); // true
	console.log(lab2.deltaE(lab1).toFixed(6)); // 0.006548
	console.log();
}
```

All of the examples given here in Javascript are also available in
TypeScript. See the `spec/examplespec.ts` file for details. Note that
in particular the various `parseString` methods return a
possibly-undefined value \(the Javascript `undefined` value is returned
when a `parseString` method fails to parse a string\).
