import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {retry} from "rxjs/operators";
import {Callback} from "../../../../types/platform/universe";
import {ConstService} from "../../platform/base/services/const.service";
import {QueryableService} from "../../platform/base/services/queryable.service";

@Injectable({
	providedIn: "root",
})

export class SrcsService extends QueryableService {

	public model: string = "srcs";

	constructor(
		public http: HttpClient,
		public constService: ConstService,
	) {
		super(http, constService, "srcs");
	}

	public crawl(site_id: string, callback: Callback<object>): void {
		this.http.get(this.endPoint + "/" + this.model + "/crawl/" + encodeURIComponent(site_id), this.httpOptions).pipe(retry(3)).subscribe((result: any): void => {
			if (result) {
				if (result.code === 0) {
					callback(null, this.decorator(result.value));
				} else {
					callback(result, null);
				}
			} else {
				callback(this.networkError, null);
			}
		}, (error: HttpErrorResponse): void => {
			callback({code: -1, message: error.message}, null);
		});
	}

}
