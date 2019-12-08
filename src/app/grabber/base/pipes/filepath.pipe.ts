import {Pipe, PipeTransform} from "@angular/core";

import {DefaultUrlSerializer, PRIMARY_OUTLET, UrlSegmentGroup} from "@angular/router";

@Pipe({
	name: "filepath",
})
export class FilepathPipe implements PipeTransform {

	public transform(value: string, ...args: any[]): any {
		let result: string = "";
		const pathList: string[] = value.split("/");

		for (let index = pathList.length - 1 ; index >= args[0]; index--) {
			result = pathList[index] + "/" + result;
		}

		return result;
	}

}
