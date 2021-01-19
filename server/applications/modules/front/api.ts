/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router = express.Router();

const gatekeeper: any = require("../../../platform/base/library/gatekeeper");

const path = require("path");

const event: any = require.main.exports.event;
const logger: any = require.main.exports.logger;

let opened = true;

event.on("site-open", () => {
	logger.info("site-open");
	opened = true;
});

event.on("site-close", () => {
	logger.info("site-close");
	opened = false;
});

// for Preflight request. (CORS)
router.options("*", [gatekeeper.default]);

router.get("*", (req: any, res: any) => {
	res.cookie("XSRF-TOKEN", "YQIhAPluUGJqF3PArH0HIL2TWqy+w0ADjOE/PEO2RC3+8HjnAiEAovqZSR7R+u6k1AbJjqwhX2VUwaeRN28zxjJzrgT6kmcCICaSx72geIX/Gu2u54JJwnEKgzloEyZW", {
		maxAge: 60000,
		httpOnly: false,
	});

	if (opened) {
		res.sendFile(path.join(__dirname, "../../../../public/index.html"));
	} else {
		res.sendFile(path.join(__dirname, "../../../../public/close.html"));
	}

});

// Necessary for Angular.
// pass all request to Angular app-routing.
// router.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "../../../public/index.html"));
// });

module.exports = router;
