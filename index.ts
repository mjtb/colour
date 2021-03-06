/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Component from './component';
import RGB from './rgb';
import Linear from './linear';
import HSL from './hsl';
import XYZ from './xyz';
import LAB from './lab';
import HWB from './hwb';
import LCH from './lch';
import YUV from './yuv';
import YCC from './ycc';
import XYY from './xyy';
import Colour from './colour';
import Palette from './palette';
import Match from './match';
import Palettes from './palettes';
import Matrix3x3 from './matrix3x3';
import Matrix3x1 from './matrix3x1';
import ColorTemperature from './cct';

export default Colour;

export {
	Component,
	RGB,
	Linear,
	HSL,
	XYZ,
	LAB,
	HWB,
	LCH,
	YUV,
	YCC,
	XYY,
	Colour,
	Match,
	Palette,
	Palettes,
	Matrix3x3,
	Matrix3x1,
	ColorTemperature
};
