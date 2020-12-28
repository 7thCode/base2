/**
 * Copyright © 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */
import {IContent} from "../platform/universe";

export interface INativeFileModelContent {
	id: any;
	path: string;
	category:string;
}

export interface ICustomerContent {
	description: string;
	email: string;
	name: string;
	phone: string;
	address:ICustomerAddress;
	shipping: ICustomerShipping;
	metadata:any;
}

export interface ICustomerAddress {
	country: string;
	postal_code: string;
	state: string;
	city: string;
	line1: string;
	line2: string;
}

export interface ICustomerShipping {
	name: string;
	phone: string;
	address:ICustomerShippingAddress;
}

export interface ICustomerShippingAddress {
	country: string;
	postal_code: string;
	state: string;
	city: string;
	line1: string;
	line2: string;
}
