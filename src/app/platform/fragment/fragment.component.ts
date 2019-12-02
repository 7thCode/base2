import {HttpClient} from "@angular/common/http";
import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material";

import {IErrorObject} from "../../../../types/universe";
import {UpdatableComponent} from "../base/components/updatable.component";
import {ConstService} from "../base/services/const.service";
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

	constructor(
		public session: SessionService,
		public http: HttpClient,
		public change: ChangeDetectorRef,
		protected matDialog: MatDialog,
		public constService: ConstService
	) {
		super(session, http, change, matDialog);
		this.service = new FragmentService(http, constService);
	}

	/**
	 * @returns none
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
