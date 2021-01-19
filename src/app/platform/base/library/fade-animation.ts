/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {animate, query, style, transition, trigger} from "@angular/animations";

/**
 *
 */
export const fadeAnimation = trigger("fadeAnimation", [

	transition("* => *", [
		query(
			":enter",
			[style({opacity: 0})],
			{optional: true},
		),
		query(
			":leave",
			[style({opacity: 1}), animate("0.3s", style({opacity: 0}))],
			{optional: true},
		),
		query(
			":enter",
			[style({opacity: 0}), animate("0.3s", style({opacity: 1}))],
			{optional: true},
		),
	]),
]);
