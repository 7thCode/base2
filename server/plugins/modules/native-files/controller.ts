/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {INativeFileModel} from "../../../../types/plugins/server";

const Updatable: any = require("../../../platform/base/controllers/updatable_controller");

const NativeFile: any = require("../../../../models/plugins/native-files/native-file");

export class NativeFiles extends Updatable {

	protected Model: any;

	/**
	 * @param event
	 * @param config
	 * @param logger
	 */
	constructor(event: any, config: object, logger: object) {
		super(event, config, logger);
		this.Model = NativeFile as INativeFileModel;
	}

}

module.exports = NativeFiles;
