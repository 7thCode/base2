/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive} from "@angular/core";

/**
 *
 *
 * @since 0.01
 */

@Directive()
export abstract class BaseDialogComponent {

	public progress: boolean = false;

	public Progress(value: boolean): void {
		this.progress = value;
	}

}
