/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const express: any = require("express");
export const router = express.Router();

const path = require("path");

router.get("*", (req, res) => {
	res.cookie("XSRF-TOKEN", "YQIhAPluUGJqF3PArH0HIL2TWqy+w0ADjOE/PEO2RC3+8HjnAiEAovqZSR7R+u6k1AbJjqwhX2VUwaeRN28zxjJzrgT6kmcCICaSx72geIX/Gu2u54JJwnEKgzloEyZW", {maxAge: 60000, httpOnly: false});
	res.sendFile(path.join(__dirname, "../../../../public/index.html"));
});

// Necessary for Angular.
// pass all request to Angular app-routing.
// router.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "../../../public/index.html"));
// });

module.exports = router;
