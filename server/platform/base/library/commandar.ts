/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const childProcess: any = require("child_process");

const execSync: any = childProcess.execSync;

export class Unix {

	private backupdir: string;

	constructor() {
		this.backupdir = process.cwd() + "/backup";
	}

	public Backup(config: any): string {
		const backup = "mongodump --authenticationDatabase " + config.name + " -u " + config.user + " -p " + config.password + " -d " + config.name + " -o " + "\"" + this.backupdir + "\"";
		//     console.log(backup);
		return "" + execSync(backup);
	}

	public Restore(config: any): string {
		const restore = "mongorestore --authenticationDatabase " + config.name + " -u " + config.user + " -p " + config.password + " -d " + config.name + " " + "\"" + this.backupdir + "/" + config.name + "\"";
		//     console.log(restore);
		return "" + execSync(restore);
	}

}

module.exports = Unix;
