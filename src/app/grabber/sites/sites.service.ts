import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";
import {Callback} from "../../../../types/platform/universe";
import {ConstService} from "../../platform/base/services/const.service";
import {UpdatableService} from "../../platform/base/services/updatable.service";

@Injectable({
	providedIn: "root",
})

export class SitesService extends UpdatableService {

	public model: string = "sites";

	constructor(
		public http: HttpClient,
		public constService: ConstService,
	) {
		super(http, constService, "sites");
	}

}
