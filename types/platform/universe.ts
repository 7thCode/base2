/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

export interface ErrorObject {
	code: number;
	message: string;
}

export type IErrorObject = ErrorObject | null;

export type Callback<T> = (error: IErrorObject, results: T | null) => void;

export type StatusCallback<T> = (error: { status: number, message: string } | null, result: T | null) => void;

export interface IEmit {
	source: any;
	value: any;
	changed: any;
}

export interface IDecoded {
	status: string;
	plaintext: string;
	signeture: string;
}

export interface IEncoded {
	status: string;
	cipher: string;
}

export interface IPasswordToken {
	username: string;
	password: string;
	target: string;
	timestamp: any;
}

export interface IUserToken {
	auth: number;
	username: string;
	password: string;
	content: {};
	target: string;
	timestamp: any;
}

export enum AuthLevel {
	system = 1,
	manager = 100,
	user = 200,
	public = 100000,
}

export interface IAccountPublic {
	username: string;
	user_id: string;
	auth: number;
	enabled: boolean;
}

export interface IRights {
	read: number;
	write: number;
}

export interface IRole {
	categoly: number;
	raw: number;
	login: boolean;
}

export interface ISession {
	provider: string;
	username: string;
	user_id: string;
	content: {
		mails: string[];
		nickname: string;
		id: string;
		description: string
	};
	enabled: boolean;
	role: {
		categoly: number;
		raw: number;
		login: boolean;
	};
	entry: string;
	exit: string;
}

export interface IContent {
	id: string;
	parent_id: string;
	enabled: boolean;
	category: string;
	status: number;
	type: string;
}

export interface IArticleModelContent extends IContent {
	name: string;
	value: {};
	accessory: {};
}

export interface IPageModelContent extends IContent {
	path: string;
	value: string;
	accessory: {};
}

export interface IVaultModelContent extends IContent {
	value: {};
	accessory: {};
}

export interface IQueryOption {
	sort: object;
	limit: number;
	skip: number;
}

