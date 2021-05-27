/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const path: any = require("path");

const childProcess: any = require("child_process");

const execSync: any = childProcess.execSync;

export class Unix {

	/**
	 *
	 */
	private readonly backupdir: string;

	/**
	 *
	 */
	constructor() {
		const project_root = path.join(__dirname, "../../../..");
		this.backupdir = project_root + "/backup";
	}

	/**
	 * DB Full Buckup
	 * @param config
	 * @returns status
	 */
	public Backup(config: any): string {

		let backupdir = this.backupdir;
		if (config.backup.dir) {
			backupdir = config.backup.dir;
		}

		const backup = "mongodump --authenticationDatabase " + config.name + " -u " + config.user + " -p " + config.password + " -d " + config.name + " -o " + "\"" + backupdir + "\"";
		return "" + execSync(backup);
	}

	/**
	 * DB Full Restore
	 * @param config
	 * @returns status
	 */
	public Restore(config: any): string {
		const restore = "mongorestore --authenticationDatabase " + config.name + " -u " + config.user + " -p " + config.password + " -d " + config.name + " " + "\"" + this.backupdir + "/" + config.name + "\"";
		return "" + execSync(restore);
	}

}

module.exports = Unix;
