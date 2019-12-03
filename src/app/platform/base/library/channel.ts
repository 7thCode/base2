/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import { Subject } from "rxjs";

export class InteractionChannel {

	private subject = new Subject<any>();
	private event = this.subject.asObservable();

	public publish(data: any): void {
		this.subject.next(data);
	}

	public subscribe(callback: (data: any) => void): void {
		this.event.subscribe(callback);
	}
}
