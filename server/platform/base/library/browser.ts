/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

/**
 * browser判定
 */
export class Browser {

	public UserAgent: string;

	constructor(UserAgent: string) {
		this.UserAgent = UserAgent.toLowerCase();
	}

	/**
	 *
	 * @returns IEなら真
	 */
	public IsIE(): boolean {
		return (this.UserAgent.indexOf("msie") >= 0 || this.UserAgent.indexOf("trident") >= 0 || this.UserAgent.indexOf("edge/") >= 0);
	}

	/**
	 *
	 * @returns Edgeなら真
	 */
	public IsEdge(): boolean {
		return this.UserAgent.indexOf("edge/") >= 0;
	}

	/**
	 *
	 * @returns Chromeなら真
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
	 * @returns FireFoxなら真
	 */
	public IsFirefox(): boolean {
		let result: boolean = false;
		if (!this.IsIE()) {
			result = this.UserAgent.indexOf("firefox/") >= 0;
		}
		return result;
	}

	/**
	 *
	 * @returns Safariなら真
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
	 * @returns iPhoneなら真
	 */
	public IsiPhone(): boolean {
		return this.UserAgent.indexOf("iphone") >= 0;
	}

	/**
	 *
	 * @returns iPodなら真
	 */
	public IsiPod(): boolean {
		return this.UserAgent.indexOf("ipod") >= 0;
	}

	/**
	 *
	 * @returns iPadなら真
	 */
	public IsiPad(): boolean {
		return this.UserAgent.indexOf("ipad") >= 0;
	}

	/**
	 *
	 * @returns iOSなら真
	 */
	public IsiOS(): boolean {
		return (this.IsiPhone() || this.IsiPod() || this.IsiPad());
	}

	/**
	 *
	 * @returns Androidなら真
	 */
	public IsAndroid(): boolean {
		return this.UserAgent.indexOf("android") >= 0;
	}

	/**
	 *
	 * @returns PCなら真
	 */
	public IsPC(): boolean {
		return (this.IsIE() || this.IsEdge() || this.IsChrome() || this.IsSafari() || this.IsFirefox());
	}

	/**
	 *
	 * @returns Phoneなら真
	 */
	public IsPhone(): boolean {
		return (this.IsiOS() || this.IsAndroid());
	}

	/**
	 *
	 * @returns Tabletなら真
	 */
	public IsTablet(): boolean {
		return (this.IsiPad() || (this.IsAndroid() && this.UserAgent.indexOf("mobile") < 0));
	}

	public IsMobile(): boolean {
		return (this.IsPhone() || this.IsTablet());
	}

	/**
	 *
	 * @returns バージョン
	 */
	public Version(): number {
		let result: number = 0;
		if (this.IsIE()) {
			const verArray = /(msie|rv:?)\s?([0-9]{1,})([\.0-9]{1,})/.exec(this.UserAgent);
			if (verArray) {
				result = parseInt(verArray[2], 10);
			}
		} else if (this.IsiOS()) {
			const verArray = /(os)\s([0-9]{1,})([\_0-9]{1,})/.exec(this.UserAgent);
			if (verArray) {
				result = parseInt(verArray[2], 10);
			}
		} else if (this.IsAndroid()) {
			const verArray = /(android)\s([0-9]{1,})([\.0-9]{1,})/.exec(this.UserAgent);
			if (verArray) {
				result = parseInt(verArray[2], 10);
			}
		}
		return result;
	}
}

module.exports = Browser;
