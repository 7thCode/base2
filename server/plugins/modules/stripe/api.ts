/**
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

// https://stripe.com/docs/api/idempotent_requests


const express: any = require("express");
export const router = express.Router();

const event : any = require.main.exports.event;
const logger: any = require.main.exports.logger;
const config: any = require.main.exports.config;

// const event: any = module.parent.exports.event;
// const logger: any = module.parent.exports.logger;
// const config: any = module.parent.exports.config;

const gatekeeper: any = require("../../../platform/base/library/gatekeeper");

const Stripes: any = require("./controller");
const stripe: any = new Stripes(event, config, logger);

router.post('/stripe/customer/create', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.createCustomer(request, response);
		});
	}])

router.delete('/stripe/customer/delete', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.deleteCustomer(request, response);
		});
	}])

router.get('/stripe/customer/retrieve', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.retrieveCustomer(request, response);
		});
	}])

router.put('/stripe/customer/update', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.updateCustomer(request, response);
		});
	}])

router.post('/stripe/source/create', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.createSource(request, response);
		});
	}])

router.get('/stripe/source/retrieve/:index', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.retrieveSource(request, response);
		});
	}])

router.put('/stripe/source/update/:index', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.updateSource(request, response);
		});
	}])

router.delete('/stripe/source/delete/:index', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.deleteSource(request, response);
		});
	}])

router.post('/stripe/charge', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.charge(request, response);
		});
	}])

/*
router.post('/stripe-create-card', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.get(request, response);
		});
	}])

router.post('/stripe-charge', [gatekeeper.default,
	(request: object, response: object): void => {
		gatekeeper.catch(response, () => {
			stripe.get(request, response);
		});
	}])
*/

module.exports = router;
