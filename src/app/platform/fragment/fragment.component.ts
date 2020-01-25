/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {IErrorObject} from "../../../../types/platform/universe";

import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material";

import {UpdatableComponent} from "../base/components/updatable.component";

import {SessionService} from "../base/services/session.service";
import {FragmentService} from "./fragment.service";

@Component({
	selector: "fragment",
	template: "<div [innerHTML]=\"innerText\"></div>",
	styleUrls: ["./fragment.component.css"],
})

/**
 *
 *
 * @since 0.01
 */
export class FragmentComponent extends UpdatableComponent implements OnInit {

	@Input() public fileName: string;
	@Input() public user_id: string;

	public style: any;
	public imagePath: any;
	public innerText: string;
	public service: any;

	/**
	 *
	 * @param session
	 * @param fragmentService
	 * @param change
	 * @param matDialog
	 */
	constructor(
		public session: SessionService,
		public fragmentService: FragmentService,
		public change: ChangeDetectorRef,
		protected matDialog: MatDialog,
	) {
		super(session, change, matDialog);
		this.service = fragmentService;
	}

	/**
	 *
	 */
	public ngOnInit() {
		this.getSession((error: IErrorObject, session: {user_id}): void => {
			this.service.get("", this.user_id || session.user_id, this.fileName, (error: IErrorObject, result: any) => {
				if (!error) {
					this.innerText = result;
					this.Complete("", this.fileName);
				} else {
					this.Complete("error", error);
				}
			});
		});
	}

}
