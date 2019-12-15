import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";
import {Callback} from "../../../types/universe";
import {ConstService} from "../platform/base/services/const.service";
import {QueryableService} from "../platform/base/services/queryable.service";

@Injectable({
	providedIn: "root",
})

export class GrabberService extends QueryableService {

	public model: string = "sites";

	constructor(
		public http: HttpClient,
		public constService: ConstService,
	) {
		super(http, constService, "sites");
	}

}
