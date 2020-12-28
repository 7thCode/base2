/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {MatSpinner} from "@angular/material/progress-spinner";

/**
 *
 */
export class Spinner {

	public progress: boolean;

	private spinnerRef: OverlayRef;
	private overlay: Overlay;

	/**
	 *
	 * @param overlay
	 */
	constructor(overlay: Overlay) {
		this. progress = false;
		this.spinnerRef = this.cdkSpinnerCreate(overlay);
	}

	/**
	 *
	 */
	private cdkSpinnerCreate(overlay: Overlay): OverlayRef {
		this.overlay = overlay;
		return this.overlay.create({
			hasBackdrop: true,
			backdropClass: "dark-backdrop",
			positionStrategy: this.overlay.position()
				.global()
				.centerHorizontally()
				.centerVertically(),
		});
	}

	/**
	 *
	 */
	public get isProgress(): boolean {
		return this.progress;
	}

	/**
	 * 処理中
	 * スピナー
	 * @param value
	 * @constructor
	 */
	public Progress(value: boolean): void {
		if (value) {
			if (!this.progress) {
				setTimeout(() => this.spinnerRef.attach(new ComponentPortal(MatSpinner)));
				this.progress = true;
			}
		} else {
			if (this.progress) {
				setTimeout(() => this.spinnerRef.detach());
				this.progress = false;
			}
		}
	}
}
