/**!
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * //opensource.org/licenses/mit-license.php
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

// const domain = require('express-domain-middleware');

const cookieParser: any = require("cookie-parser");
const bodyParser: any = require("body-parser");

const helmet: any = require("helmet");
const session: any = require("express-session");
const log4js: any = require("log4js");
const rotatestream: any = require("logrotate-stream");

const _ConfigModule: any = require("./config/default");
const Scheduler: any = require("./server/platform/base/library/scheduler");
const Unix: any = require("./server/platform/base/library/commandar");
const Cipher: any = require("./server/platform/base/library/cipher");
const IPV6: any = require("./server/platform/base/library/ipv6");

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

	mongoose.set('useCreateIndex', true);
	mongoose.set("useFindAndModify", false);

	const working: () => void = () => {
		const app: any = express();

		// domain
		// app.use(domain);

		// exception handlers
		app.use((error: any, req: any, res: any, next: any) => {
			logger.fatal(error);
		});

		// helmet
		app.use(helmet());
		app.use(helmet.hidePoweredBy({setTo: "JSF/1.2"}));  // impersonation

		logger.info("Hundred.");

		const EventEmitter: any = require("events").EventEmitter;
		const localEvent: any = new EventEmitter();

		localEvent.setMaxListeners(50);

		if (config.socket_port) {
			const socket_port: number = 1 * config.socket_port;
			const websocket: any = require("ws");
			const server: any = websocket.Server;
			const socket: any = new server({port: socket_port});

			socket.on("connection", (client: any): void => {

				const onData = (data: any): void => {
					// socket.clients.forEach((client: any): void => {
					if (client) {
						if (client.readyState === websocket.OPEN) {
							// 	const r: any = IPV6.ToIPV6(client._socket.remoteAddress);
							client.send(JSON.stringify(data));
						}
					}
				};

				client.on("open", (): void => {
					// 	console.log("open");
				});

				client.on("message", (data: any, flags: any): void => {
					// 		console.log(data);
				});

				client.on("close", (): void => {
					localEvent.removeListener("data", onData);
				});

				// server -> client
				localEvent.on("data", onData);
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

		// logs
		// log4js.configure("./config/platform/logs.json");
		// const logger: any = log4js.getLogger("request");

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
		const MongoStore: any = require("connect-mongo")(session);
		const options: any = {
			keepAlive: 1,
			connectTimeoutMS: 1000000,
			// 	reconnectTries: 30,
			// 	reconnectInterval: 2000,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			// 	useUnifiedTopology: true,
		};
		let connect_url: string = config.db.protocol + "://" + config.db.user + ":" + config.db.password + "@" + config.db.address + "/" + config.db.name;
		if (config.db.noauth) {
			connect_url = config.db.protocol + "://" + config.db.address + "/" + config.db.name;
		}

		mongoose.connection.once("open", () => {

			mongoose.connection.on("connected", () => {
				logger.info("connected");
			});

			mongoose.connection.on("closed", () => {
				// 	logger.info("Mongoose default connection disconnected");
				// 	process.exit(1);
			});

			mongoose.connection.on("disconnected", () => {
				logger.error("Mongoose default connection disconnected");
				log4js.shutdown((err: any) => {
					process.exit(1);
				})
			});

			mongoose.connection.on("reconnected", () => {
				logger.info("reconnected");
			});

			mongoose.connection.on("error", (error: IErrorObject) => {
				logger.error("Mongoose default connection error: " + error);
				log4js.shutdown((err: any) => {
					process.exit(1);
				})
			});

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

			// 		app.session = sessionMiddleware;
			app.use(sessionMiddleware);

			// passport
			app.use(passport.initialize());
			app.use(passport.session());
			// passport


			// const load_module: any = (root: string, modules: any): void => {
			// 	if (modules) {
			// 		modules.forEach((module: any) => {
			// 			const path: string = root + module.path;
			// 			const name: string = module.name;
			// 			app.use("/", require(path + name + "/api"));
			// 		});
			// 	}
			// };

			const load_module: any = (root: string, modules: any): void => {
				if (modules) {
					Object.keys(modules).forEach((key: string) => {
						const path: string = root + modules[key].path;
						app.use("/", require(path + key + "/api"));
					});
				}
			};

			logger.info("V1");

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

			load_module("./server", default_modules);
			load_module("./server", config.modules);

			logger.info("VR");

			// backup

			const scheduler: any = new Scheduler();

			const command: any = new Unix();

			if (config.db.backup) {
				scheduler.Add({
					timing: config.db.backup, name: "backup", job: () => {
						command.Backup(config.db);
					},
				});
			}

			const server: Server = Serve(config, app);

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
		});

		// database
		mongoose.connect(connect_url, options)
			.catch((error: any) => {
				logger.fatal("catch Mongoose exception. ", error.stack);
				log4js.shutdown((err: any) => {
					process.exit(1);
				})
			});

		process.on("SIGINT", (): void => { // for pm2 cluster.
			mongoose.connection.close(() => {
				logger.info("Stop by SIGINT.");
				log4js.shutdown((err: any) => {
					process.exit(0);
				})
			});
		});

		process.on("message", (msg): void => {  // for pm2 cluster on windows.
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
		logger.info("TZ  : " + process.env.TZ);
		logger.info("LC_CTYPE  : " + process.env.LC_CTYPE);
		logger.info("PWD       : " + process.env.PWD);
		logger.info("HOME      : " + process.env.HOME);
		logger.info("ENV       : " + process.env.NODE_ENV);
		logger.info("MODE      : " + config.status);
		logger.info("DB ADDRESS: " + config.db.address);
		logger.info("DB NAME   : " + config.db.name);
	}

	const is_cluster: boolean = config.is_cluster;

// 	cpu_count = 1;

	if (is_cluster) {
		if (cluster.isMaster) {
			message();
			for (let i: number = 0; i < cpu_count; i++) {
				cluster.fork();
			}
		} else {
			working();
		}
	} else {
		message();
		working();
	}

};

const Serve = (config: any, app: any): any => {

	function normalizePort(val: string): any {
		const port: number = parseInt(val, 10);

		if (isNaN(port)) {
			// named pipe
			return val;
		}

		if (port >= 0) {
			// port number
			return port;
		}

		return false;
	}

	function onError(error: any): void {
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

	function onListening(): void {
		/*
		const addr: string | AddressInfo = server.address();
		const bind: any = typeof addr === "string"
			? "pipe " + addr
			: "port " + addr.port;
*/
		process.send = process.send || function (message: string): boolean {
			return true;
		};  // for pm2 cluster.

		process.send("ready");
		logger.info("Steady flight.");
	}

	const port: any = normalizePort(process.env.PORT || config.port);
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
	server.listen(port, "::0");

	logger.info("V2");

	return server;
};

normal();
