/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
	selector: "[highlight]",
})

export class HighlightDirective {

	constructor(private el: ElementRef) { }

	@Input("highlight")
	public highlightColor: string;

	@HostListener("mouseenter")
	public onMouseEnter() {
		this.highlight(this.highlightColor || "#d0d0d0");
	}

	@HostListener("mouseleave")
	public onMouseLeave() {
		this.highlight(null);
	}

	private highlight(color: string) {
		this.el.nativeElement.style.backgroundColor = color;
	}
}
