/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

/**
 *
 *
 * @since 0.01
 */
export abstract class BaseDialogComponent {

	public progress: boolean;

	public Progress(value: boolean): void {
		this.progress = value;
	}

}
