/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Injectable} from "@angular/core";

@Injectable({
	providedIn: "root",
})

/**
 *
 */
export class BrowserService {

	/**
	 *
	 */
	public UserAgent: string = "";

	/**
	 *
	 */
	constructor() {
	}

	/**
	 *
	 * @param UserAgent
	 * @returns none
	 */
	public setUserAgent(UserAgent: string): void {
		this.UserAgent = UserAgent.toLowerCase();
	}

	/**
	 *
	 * @return boolean
	 */
	public IsIE(): boolean {
		return (this.UserAgent.indexOf("msie") >= 0 || this.UserAgent.indexOf("trident") >= 0 || this.UserAgent.indexOf("edge/") >= 0);
	}

	/**
	 *
	 * @return boolean
	 */
	public IsEdge(): boolean {
		return this.UserAgent.indexOf("edge/") >= 0;
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsChrome(): boolean {
		let result: boolean = false;
		if (!this.IsIE()) {
			result = this.UserAgent.indexOf("chrome/") >= 0;
		}
		return result;
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsSafari(): boolean {
		let result: boolean = false;
		if (!this.IsIE()) {
			if (!this.IsChrome()) {
				result = this.UserAgent.indexOf("safari/") >= 0;
			}
		}
		return result;
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsiPhone(): boolean {
		return this.UserAgent.indexOf("iphone") >= 0;
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsiPod(): boolean {
		return this.UserAgent.indexOf("ipod") >= 0;
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsiPad(): boolean {
		return this.UserAgent.indexOf("ipad") >= 0;
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsiOS(): boolean {
		return (this.IsiPhone() || this.IsiPod() || this.IsiPad());
	}

	/**
	 *
	 *  @return boolean
	 *
	 */
	public IsAndroid(): boolean {
		return this.UserAgent.indexOf("android") >= 0;
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsPhone(): boolean {
		return (this.IsiOS() || this.IsAndroid());
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsTablet(): boolean {
		return (this.IsiPad() || (this.IsAndroid() && this.UserAgent.indexOf("mobile") < 0));
	}

	/**
	 *
	 *  @return boolean
	 */
	public IsMobile(): boolean {
		return (this.IsPhone() || this.IsTablet());
	}

	/**
	 *
	 *  @return number
	 */
	public Version(): number {
		let result: number = 0;
		if (this.IsIE()) {
			const verArray: string[] = /(msie|rv:?)\s?([0-9]{1,})([\.0-9]{1,})/.exec(this.UserAgent);
			if (verArray) {
				result = parseInt(verArray[2], 10);
			}
		} else if (this.IsiOS()) {
			const verArray: string[] = /(os)\s([0-9]{1,})([\_0-9]{1,})/.exec(this.UserAgent);
			if (verArray) {
				result = parseInt(verArray[2], 10);
			}
		} else if (this.IsAndroid()) {
			const verArray: string[] = /(android)\s([0-9]{1,})([\.0-9]{1,})/.exec(this.UserAgent);
			if (verArray) {
				result = parseInt(verArray[2], 10);
			}
		}
		return result;
	}
}


