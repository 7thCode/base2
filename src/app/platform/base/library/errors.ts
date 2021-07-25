/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {IErrorObject} from "../../../../../types/platform/universe";
import {HttpErrorResponse} from "@angular/common/http";

/**
 *
 */
export class Errors {

	static generalError(code: number, message: string, tag: string): IErrorObject {
		return {code: code, message: message, tag: tag, origin: null};
	}

	static serverError(error: IErrorObject, tag: string): IErrorObject {
		const result: IErrorObject = error;
		switch (error.code) {
			case 1:
				result.message = "ログインしていません.";
				break;
			case 2:
				result.message = "権限がありません.";
				break;
			case 3:
				result.message = "パスワードが違うかユーザが見つかりません.";
				break;
			case 4:
				result.message = "アカウントが無効です.";
				break;
			case 5:
				result.message = "既にログインしています.";
				break;
			case 6:
				result.message = "コードが違います.";
				break;
			case 7:
				result.message = "ユーザは既に存在します.";
				break;
			case 8:
				result.message = "ローカルアカウントのみ可能です."
				break;
			default:
		}
		return result;
	}

	static responseError(tag: string): IErrorObject {
		return {code: -100, message: "response error.", tag: tag, origin: null};
	}

	static networkError(tag: string): IErrorObject {
		return {code: -1000, message: "network error.", tag: tag, origin: null};
	}

	static networkException(error: HttpErrorResponse, tag: string): IErrorObject {
		return {code: -10000, message: "network exception.", tag: tag, origin: error};
	}
}
