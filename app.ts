/**
 * Copyright © 2019 2020 2021 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

import {Server} from "http";
import {IErrorObject} from "./types/platform/universe";

const cluster: any = require('cluster');
const cpu_count: number = require('os').cpus().length;

const express: any = require("express");

const fs: any = require("graceful-fs");
const morgan: any = require("morgan");
const mongoose: any = require("mongoose");
const passport: any = require("passport");

const cookieParser: any = require("cookie-parser");
const bodyParser: any = require("body-parser");

const helmet: any = require("helmet");
const session: any = require("express-session");
const log4js: any = require("log4js");
const rotatestream: any = require("logrotate-stream");

const _ConfigModule: any = require("config");

const Scheduler: any = require("./server/platform/base/library/scheduler");
const Unix: any = require("./server/platform/base/library/commandar");
// const Cipher: any = require("./server/platform/base/library/cipher");
// const IPV6: any = require("./server/platform/base/library/ipv6");

let logger: any;

let saslprep: any = null;

try {
	saslprep = require("saslprep");
} catch (e) {
}

const normal: () => void = () => {

	const config: any = _ConfigModule.systems;

	process.env.TZ = "Asia/Tokyo"; // default
	if (config.timezone) {
		process.env.TZ = config.timezone;
	}

	log4js.configure(config.logs.config);
	logger = log4js.getLogger();

	logger.level = "info"; // default
	if (config.logs.level) {
		logger.level = config.logs.level;
	}

	morgan("combined");

	// morgan.format("original", "[:date] :method :url :status :response-time ms");

	mongoose.Promise = global.Promise;

// 	mongoose.set('useCreateIndex', true);
// 	mongoose.set("useFindAndModify", false);

	const EventEmitter: any = require("events").EventEmitter;
	const localEvent: any = new EventEmitter();

	localEvent.setMaxListeners(50);

	const working: any = (callback: (server: any) => void) => {
		const app: any = express();

		// domain
		// app.use(domain);

		// exception handlers
		app.use((error: any, req: any, res: any, next: any) => {
			logger.fatal(error);
		});

		// helmet
		// app.use(helmet());

		// app.use(helmet.contentSecurityPolicy());

		app.use(helmet.dnsPrefetchControl());
		app.use(helmet.expectCt());
		app.use(helmet.frameguard());
		app.use(helmet.hidePoweredBy({setTo: "JSF/1.2"}));  // impersonation
		app.use(helmet.hsts());
		app.use(helmet.ieNoOpen());
		app.use(helmet.noSniff());
		app.use(helmet.permittedCrossDomainPolicies());
		app.use(helmet.referrerPolicy());
		app.use(helmet.xssFilter());

		logger.info("Hundred.");

		let socket: any = null;

		if (config.has_socket) {

			const onResponse = (client: any, data: any): any => {
				return data;
			}

			const onResponseOthers = (client: any, data: any): any => {
				return data;
			}

			const onBroadcast = (client: any, data: any): any => {
				return data;
			}

			const broadcast = (data: any): void =>  {
				localEvent.emit('broadcast', data);
			}

			const websocket = require('ws');
			socket = new websocket.Server({ noServer: true });

			socket.on("connection", (connected_client: any): void => {

				connected_client.on("open", (): void => {
					// 			console.log("open");
				});

				connected_client.on("message", (data: any, flags: any): void => {
					const packet = JSON.parse(data);
					socket.clients.forEach((each_client: any): void => {
						if (each_client.readyState === websocket.OPEN) {
							let response = null;
							if (connected_client === each_client) {
								response = onResponse(each_client, packet);
							} else {
								response = onResponseOthers(each_client, packet);
							}
							if (response) {
								each_client.send(JSON.stringify(response));
							}
						}
					});
				});

				connected_client.on("close", (): void => {
					// 				localEvent.removeListener("data", onData);
				});

				// server -> client
				localEvent.on('broadcast', (data: any): void => {
					socket.clients.forEach((each_client: any): void => {
						if (each_client.readyState === websocket.OPEN) {
							const response = onBroadcast(each_client, data);
							if (response) {
								each_client.send(JSON.stringify(response));
							}
						}
					});
				});

				// server -> client
				// 		localEvent.on("data", onData);
			});
		}

		// view engine setup
		app.set("views", "./views");
		app.set("view engine", "pug");
		app.set("trust proxy", true);

		// result settings
		app.use(bodyParser.json({limit: config.bodysize}));
		app.use(bodyParser.urlencoded({limit: config.bodysize, extended: true}));
		app.use(cookieParser());

		module.exports.event = localEvent;
		module.exports.config = _ConfigModule;
		module.exports.logger = logger;

		if (config.status !== "production") {
			app.use(morgan("original", {immediate: true}));
		} else {
			app.use(morgan("combined", {
				stream: rotatestream({
					file: __dirname + "/logs/access.log",
					size: "100k",
					keep: 3,
				}),
			}));
		}

		app.use(express.static("./public"));

		// database

		let port = "27017";

		if (config.db.port) {
			port = config.db.port;
		}

		let connect_url: string = config.db.protocol + "://" + config.db.user + ":" + config.db.password + "@" + config.db.address + ":" + port + "/" + config.db.name;
		if (config.db.noauth) {
			connect_url = config.db.protocol + "://" + config.db.address + ":" + port + "/" + config.db.name;
		}

		const options: any = {
			keepAlive: 1,
			maxPoolSize: 10,
			connectTimeoutMS: 1000000,
			socketTimeoutMS: 560000,
			serverSelectionTimeoutMS: 50000,
			// 	reconnectTries: 30,
			// 	reconnectInterval: 2000,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// 	useUnifiedTopology: true,
		};

		mongoose.connection.on("connected", () => {
			logger.info("connected");
		});

		mongoose.connection.once("error", (error: IErrorObject) => {
			logger.error("Mongoose default connection error: " + error);
			log4js.shutdown((err: any) => {
				process.exit(1);
			})
		});

		mongoose.connection.once("closed", () => {
			logger.info("Mongoose default connection closed");
		});

		mongoose.connection.once("disconnected", () => {
			logger.info("Mongoose default connection disconnected");
			log4js.shutdown((err: any) => {
				process.exit(1);
			})
		});

		mongoose.connection.once("reconnected", () => {
			logger.info("reconnected");
		});

		mongoose.connection.once("open", () => {

			module.exports.connection = mongoose.connections;

			const MONGOSTORE_CLASS = require('connect-mongo');						// 暗号化されたクッキーとデータベースに保存されたセッションを関連づける

			app.use(session({												// sessionとMongoDBの接続
				name: config.sessionname,	                                           			// セッション名
				secret: config.sessionsecret,													// セッション暗号化キー
				resave: false,														//
				rolling: true,		                                       			//
				saveUninitialized: true,											//
				cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},						// クッキー側設定
				store: MONGOSTORE_CLASS.create({									// MongoDB側接続オブジェクト
					mongoUrl: connect_url,
// 			mongooseConnection: MONGOOSE_MODULE.connection,					// Mongoose接続
					ttl: 365 * 24 * 60 * 60,
// 			clear_interval: 60 * 60,
				}),
			}));

			/*
			const MongoStore: any = require("connect-mongo")(session);
			const sessionMiddleware: any = session({
				name: config.sessionname,
				secret: config.sessionsecret,
				resave: false,
				rolling: true,
				saveUninitialized: true,
				cookie: {
					maxAge: 365 * 24 * 60 * 60 * 1000,
				},
				store: new MongoStore({
					mongooseConnection: mongoose.connection,
					ttl: 365 * 24 * 60 * 60,
					clear_interval: 60 * 60,
				}),
			});

			app.use(sessionMiddleware);
*/
			// passport
			app.use(passport.initialize());
			app.use(passport.session());
			// passport

			const load_module: any = (root: string, modules: any): void => {
				if (modules) {
					Object.keys(modules).forEach((key: string) => {
						const path: string = root + modules[key].path;
						app.use("/", require(path + key + "/api"));
					});
				}
			};

			logger.info("V1");

			/*
			const default_modules: any = {
				auth: {
					type: "required",
					path: "/platform/modules/",
					description: {},
				},
				accounts: {
					type: "required",
					path: "/platform/modules/",
					description: {},
				},
				publickey: {
					type: "required",
					path: "/platform/modules/",
					description: {},
				},
				session: {
					type: "required",
					path: "/platform/modules/",
					description: {},
				},
				articles: {
					type: "required",
					path: "/platform/modules/",
					description: {
						display: "Article",
					},
				},
				pages: {
					type: "required",
					path: "/platform/modules/",
					description: {
						display: "page",
					},
				},
				files: {
					type: "required",
					path: "/platform/modules/",
					description: {
						display: "File",
					},
				},
			};
*/

	// 		load_module("./server", default_modules);
			load_module("./server", config.modules);

			logger.info("VR");

			const server: Server = Serve(config, socket, app);

			// io.wait(config, event);

			// error handlers
			app.use((req: any, res: any, next: (e: any) => {}): void => {
				//    res.redirect("/");
				const err: any = new Error("Not Found");
				err.status = 404;
				next(err);
			});

			if (app.get("env") === "development") {
				app.use((err: any, req: any, res: any, next: (e: any) => {}): void => {
					res.status(err.status || 500);
					res.render("error", {
						message: err.message,
						status: err.status,
					});
				});
			}

			app.use((err: any, req: any, res: any, next: (e: any) => {}): void => {
				if (req.xhr) {
					res.status(500).send(err);
				} else {
					res.status(err.status || 500);
					res.render("error", {
						message: err.message,
						error: {},
					});
				}
			});

			callback(server);
		});

		// database
		mongoose.connect(connect_url, options)
			.catch((error: any) => {
				logger.fatal("catch Mongoose exception. ", error.stack);
				log4js.shutdown((err: any) => {
					process.exit(1);
				})
			});

		process.on('uncaughtException', (error) => {
			console.error(error);
		});

		// Housekeeping GC
		// kill -s SIGUSR1 id...
		// pm2 start app.js -n aig --node-args="--expose-gc"
		process.on("SIGUSR1", (): void => {
			const pre_gc = Math.floor(process.memoryUsage().heapUsed / 1000 / 1000);
			global.gc();
			logger.info("pre gc	:	" + pre_gc + "M" + "	post gc	:	" + Math.floor(process.memoryUsage().heapUsed / 1000 / 1000) + "M" + "	descending	:	" + (pre_gc - Math.floor(process.memoryUsage().heapUsed / 1000 / 1000)) + "M");
		});

		// Backup
		// kill -s SIGUSR2 id...
		process.on("SIGUSR2", (): void => {

			const unix: any = new Unix();
			unix.Backup(config.db);

			localEvent.emit("site-close");
			localEvent.emit("begin-maintenance");
			localEvent.emit("maintenance");
			localEvent.emit("end-maintenance");
			localEvent.emit("site-open");

		});

		// for pm2 cluster.
		process.on("SIGINT", (): void => {
			mongoose.connection.close(() => {
				mongoose.disconnect();
				logger.info("Stop by SIGINT.");
				log4js.shutdown((err: any) => {
					process.exit(0);
				})
			});
		});

		// for pm2 cluster on MS windows.
		process.on("message", (msg): void => {
			if (msg === "shutdown") {
				logger.info("Stop by shutdown.");
				setTimeout(() => {
					log4js.shutdown((err: any) => {
						process.exit(0);
					})
				}, 1500);
			}
		});
	}

	const message = (): void => {
		logger.info("PID		: " + process.pid);
		logger.info("TZ			: " + process.env.TZ);
		logger.info("LC_CTYPE	: " + process.env.LC_CTYPE);
		logger.info("PWD		: " + process.env.PWD);
		logger.info("HOME		: " + process.env.HOME);
		logger.info("ENV		: " + process.env.NODE_ENV);
		logger.info("MODE		: " + config.status);
		logger.info("DB ADDRESS	: " + config.db.address);
		logger.info("DB NAME	: " + config.db.name);
	}

	const is_cluster: boolean = config.is_cluster;

	const scheduler: any = new Scheduler();

	const servers: Server[] = [];

	// cron
	const cron = (cluster_id: number): void => {
		if (cluster_id === 1) {  // only one.

			const unix: any = new Unix();
			if (config.db.backup) {
				scheduler.Add({
					timing: config.db.backup, name: "backup", job: () => {
						unix.Backup(config.db);
					},
				});
			}

			if (config.cron) {
				if (config.cron.close) {
					scheduler.Add({
						timing: config.cron.close, name: "site-close", job: () => { // config.cron.close
							localEvent.emit("site-close");
							localEvent.emit("begin-maintenance");
							localEvent.emit("maintenance");
							localEvent.emit("end-maintenance");
							localEvent.emit("site-open");
						},
					});
				}

				if (config.cron.open) {
					scheduler.Add({
						timing: config.cron.open, name: "site-open", job: () => { // config.cron.open
							// 				localEvent.emit("site-open");
						},
					});
				}
			}

		}
	}

	if (is_cluster) {
		if (cluster.isMaster) {
			message();
			for (let thread: number = 0; thread < cpu_count; thread++) {
				cluster.fork();
			}
		} else {
			message();
			working((server: Server) => {
				servers.push(server);
			});
			cron(cluster.worker.id);
		}
	} else {
		message();
		working((server: Server) => {
			servers.push(server);
		});
		cron(1);
	}


// 	localEvent.emit('testtest');
};

const Serve = (config: any, primary_socket: any, app: any): any => {

	const Connection = true;

	const onError = (error: any): void => {
		if (error.syscall === "listen") {
			const bind: string = typeof port === "string"
				? "Pipe " + port
				: "Port " + port;
			switch (error.code) {
				case "EACCES":
					logger.error(bind + " requires elevated privileges");
					log4js.shutdown((err: any) => {
						process.exit(1);
					})
					break;
				case "EADDRINUSE":
					logger.error(bind + " is already in use");
					log4js.shutdown((err: any) => {
						process.exit(1);
					})
					break;
				default:
					throw error;
			}
		} else {
			throw error;
		}
	}

	const onListening = (): void => {
		process.send = process.send || function (message: string): boolean {
			return true;
		};  // for pm2 cluster.

		process.send("ready");
		logger.info("Steady flight.");

		if (cluster.worker.id === 1) {
			console.info("for Houssekeeping GC");
			console.info(" > kill -s SIGUSR1 " + process.pid);
			console.info("for Backup & Compaction");
			console.info(" > kill -s SIGUSR2 " + process.pid);
		}
	}

	const onUpgrade = (request: any, secondary_socket: any, head: any): void => {
		if (primary_socket) {
			const origin = request.headers.origin;
			if (Connection) {
				primary_socket.handleUpgrade(request, secondary_socket, head, (ws: any) => {
					primary_socket.emit('connection', ws, request);
				});
			} else {
				secondary_socket.destroy();
			}
		}
	}

	const port: any = config.port;
	app.set("port", port);

	let server: Server = null;

	if (config.ssl) {
		const ssl: { key: string, cert: string } = config.ssl;
		const http: any = require("spdy");
		server = http.createServer({
			key: fs.readFileSync(ssl.key),
			cert: fs.readFileSync(ssl.cert),
		}, app);
	} else {
		const http: any = require("http");
		server = http.createServer(app);
	}

	server.on("error", onError);
	server.on("listening", onListening);
	server.on('upgrade', onUpgrade);

	server.listen(port, "::0");

	logger.info("V2");

	return server;
};

normal();
