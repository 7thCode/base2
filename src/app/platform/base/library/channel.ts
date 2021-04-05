/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Subject} from "rxjs";

/**
 *
 */
export class InteractionChannel {

	private subject = new Subject<any>();
	private event = this.subject.asObservable();

	/**
	 *
	 * @param data
	 */
	public publish(data: any): void {
		this.subject.next(data);
	}

	/**
	 *
	 * @param callback
	 */
	public subscribe(callback: (data: any) => void): void {
		this.event.subscribe(callback);
	}
}
