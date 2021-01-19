/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {IQueryOption} from "../platform/universe";
import {IUpdatableModel} from "../platform/server";

import {INativeFileModelContent} from "./universe";

export interface INativeFileModel extends IUpdatableModel {
	create: Date;
	modify: Date;
	user_id: string;
	enabled: boolean;
	content: INativeFileModelContent;

	publish_find(query: object, option: IQueryOption): void;

	publish_count(query: object): void;

	publish_find_by_id(id: string): void;
}
