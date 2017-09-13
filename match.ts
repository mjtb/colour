/* mjtb-colour - Converts colours between various colour spaces.
 * Copyright (C) 2017 Michael Trenholm-Boyle. Licensed under a
 * permissive (MIT) license. See the LICENSE file at the repository
 * root for full license text.
 */
import Colour from './colour';

/** Provides the shape of a match to a colour palette entry */
export default interface Match {
	/** Index in the colour palette */
	index: number;
	/** Colour of the palette entry */
	colour: Colour;
	/** The ΔE*₀₀ perceputual colour difference between the target and this match */
	deltaE: number;
	/** The definition of the entry in the palette */
	defn: string;
	/** The name of the palette entry, if one was given */
	name?: string;
};
