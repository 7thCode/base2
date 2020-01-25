/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const schedule = require("node-schedule");

export class Scheduler {

	public ScheduledJobs: any;

	/**
	 *
	 */
	constructor() {
		this.ScheduledJobs = [];
	}

	/**
	 *
	 * @param item
	 * @constructor
	 */
	public Add(item: any) {
		const job = schedule.scheduleJob(item.timing, item.job);
		this.ScheduledJobs.push(job);
	}

}

module.exports = Scheduler;
