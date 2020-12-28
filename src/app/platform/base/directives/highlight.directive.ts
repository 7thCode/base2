/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
	selector: "[highlight]",
})

/**
 *
 * マウス検知ハイライト
 *
 * @since 0.01
 */
export class HighlightDirective {

	/**
	 *
	 */
	@Input("highlight")
	public highlightColor: string = "";
	/**
	 *
	 * @param el
	 */
	constructor(private el: ElementRef) { }

	/**
	 *
	 * @param color
	 */
	private highlight(color: string) {
		this.el.nativeElement.style.backgroundColor = color;
	}

	/**
	 *
	 */
	@HostListener("mouseenter")
	public onMouseEnter() {
		this.highlight(this.highlightColor || "#d0d0d0");
	}

	/**
	 *
	 */
	@HostListener("mouseleave")
	public onMouseLeave() {
		this.highlight("");
	}
}
