/**!
 * Copyright (c) 2019 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * //opensource.org/licenses/mit-license.php
 */

// for "global".
declare namespace NodeJS {
	// tslint:disable-next-line:interface-name
	interface Global {
		__config: string;
		_models: string;
		_controllers: string;
		_modules: string;
		_library: string;
	}
}

global.__config = __dirname + "/config";
global._models = __dirname + "/models";
global._controllers = __dirname + "/server/platform/base/controllers";
global._modules = __dirname + "/server/platform/modules";
global._library = __dirname + "/server/platform/base/library";

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

const path: any = require("path");

const models: string = global._models;
const controllers: string = global._controllers;
const library: string = global._library;
const _config: string = global.__config;

const _ConfigModule: any = require(path.join(_config, "default"));
const Scheduler: any = require(path.join(library, "scheduler"));
const Unix: any = require(path.join(library, "commandar"));
const Cipher: any = require(path.join(library, "cipher"));
const IPV6: any = require(path.join(library, "ipv6"));

let saslprep: any = null;

try {
	saslprep = require("saslprep");
} catch (e) {
}

const normal = () => {

	morgan("combined");

	// morgan.format("original", "[:date] :method :url :status :response-time ms");

	mongoose.Promise = global.Promise;

	mongoose.set('useCreateIndex', true);
	mongoose.set("useFindAndModify", false);

	const config: any = _ConfigModule.systems;

	process.env.TZ = "Asia/Tokyo";

	if (config.timezone) {
		process.env.TZ = config.timezone;
	}

	const working = () => {
		const app: any = express();

		// helmet
		app.use(helmet());
		app.use(helmet.hidePoweredBy({setTo: "JSF/1.2"}));  // impersonation


		console.group("\u001b[35m" + "Take off sequence..." + "\u001b[0m");

		console.info("\u001b[32m" + "Hundred." + "\u001b[0m");

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
							const r: any = IPV6.ToIPV6(client._socket.remoteAddress);
							client.send(JSON.stringify(data));
						}
					}
				};

				client.on("open", (): void => {
					// 	console.log("open");
				});

				client.on("message", (data, flags): void => {
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
		log4js.configure(path.join(_config, "platform/logs.json"));
		const logger: any = log4js.getLogger("request");

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
		let connect_url: string = "mongodb://" + config.db.user + ":" + config.db.password + "@" + config.db.address + "/" + config.db.name;
		if (config.db.noauth) {
			connect_url = "mongodb://" + config.db.address + "/" + config.db.name;
		}

		mongoose.connection.once("open", () => {

			mongoose.connection.on("connected", () => {
				logger.info("connected");
			});

			mongoose.connection.on("closed", () => {
				// 	console.log("Mongoose default connection disconnected");
				// 	logger.info("Mongoose default connection disconnected");
				// 	process.exit(1);
			});

			mongoose.connection.on("disconnected", () => {
				console.error("\u001b[31m" + "Mongoose default connection disconnected" + "\u001b[0m");
				logger.info("Mongoose default connection disconnected");
				process.exit(1);
			});

			mongoose.connection.on("reconnected", () => {
				logger.info("reconnected");
			});

			mongoose.connection.on("error", (error) => {
				console.error("\u001b[31m" + "Mongoose default connection error" + "\u001b[0m");
				logger.error("Mongoose default connection error: " + error);
				process.exit(1);
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

			app.session = sessionMiddleware;
			app.use(sessionMiddleware);

			// passport
			app.use(passport.initialize());
			app.use(passport.session());
			// passport

			const load_module: any = (root: string, modules: any): void => {
				if (modules) {
					modules.forEach((module) => {
						const path: string = root + module.path;
						const name: string = module.name;
						app.use("/", require(path + name + "/api"));
					});
				}
			};

			console.info("\u001b[32m" + "V1" + "\u001b[0m");

			const default_modules: any = [
				{
					type: "required",
					path: "/platform/modules/",
					name: "auth",
					description: {},
				},
				{
					type: "required",
					path: "/platform/modules/",
					name: "accounts",
					description: {},
				},
				{
					type: "required",
					path: "/platform/modules/",
					name: "publickey",
					description: {},
				},
				{
					type: "required",
					path: "/platform/modules/",
					name: "session",
					description: {},
				},
				{
					type: "required",
					path: "/platform/modules/",
					name: "articles",
					description: {
						display: "Article",
					},
				},
				{
					type: "required",
					path: "/platform/modules/",
					name: "vaults",
					description: {
						display: "Vaults",
					},
				},
				{
					type: "required",
					path: "/platform/modules/",
					name: "pages",
					description: {
						display: "page",
					},
				},
				{
					type: "required",
					path: "/platform/modules/",
					name: "files",
					description: {
						display: "File",
					},
				},
			];

			load_module("./server", default_modules);
			load_module("./server", config.modules);
			load_module("./server", config.root_modules);

			console.info("\u001b[32m" + "VR" + "\u001b[0m");

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

			const server: any = Serve(config, app);

			// io.wait(config, event);

			// error handlers
			app.use((req, res, next): void => {
				//    res.redirect("/");
				const err: any = new Error("Not Found");
				err.status = 404;
				next(err);
			});

			if (app.get("env") === "development") {
				app.use((err, req, res, next): void => {
					res.status(err.status || 500);
					res.render("error", {
						message: err.message,
						status: err.status,
					});
				});
			}

			app.use((err, req, res, next): void => {
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
			.catch((error) => {
				console.error("\u001b[31m" + "Mongoose exeption " + error.message + "\u001b[0m");
				logger.fatal("catch Mongoose exeption. ", error.stack);
				process.exit(1);
			});

		process.on("SIGINT", (): void => { // for pm2 cluster.
			mongoose.connection.close(() => {
				logger.info("Stop by SIGINT.");
				process.exit(0);
			});
		});

		process.on("message", (msg): void => {  // for pm2 cluster on windows.
			if (msg === "shutdown") {
				logger.info("Stop by shutdown.");
				setTimeout(function () {
					process.exit(0);
				}, 1500);
			}
		});


	}

	const is_cluster: boolean = config.is_cluster;

	if (is_cluster) {
		if (cluster.isMaster) {

			console.group("\u001b[35m" + "Environment" + "\u001b[0m");
			console.info("TZ  : " + process.env.TZ);
			console.info("LC_CTYPE  : " + process.env.LC_CTYPE);
			console.info("PWD       : " + process.env.PWD);
			console.info("HOME      : " + process.env.HOME);
			console.info("ENV       : " + process.env.NODE_ENV);
			console.info("MODE      : " + config.status);
			console.info("DB ADDRESS: " + config.db.address);
			console.info("DB NAME   : " + config.db.name);
			console.groupEnd();

			for (let i: number = 0; i < cpu_count; i++) {
				cluster.fork();
			}
		} else {
			working();
		}
	} else {

		console.group("\u001b[35m" + "Environment" + "\u001b[0m");
		console.info("TZ  : " + process.env.TZ);
		console.info("LC_CTYPE  : " + process.env.LC_CTYPE);
		console.info("PWD       : " + process.env.PWD);
		console.info("HOME      : " + process.env.HOME);
		console.info("ENV       : " + process.env.NODE_ENV);
		console.info("MODE      : " + config.status);
		console.info("DB ADDRESS: " + config.db.address);
		console.info("DB NAME   : " + config.db.name);
		console.groupEnd();

		working();
	}

};

const Serve = (config: any, app: any): any => {

	function normalizePort(val) {
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

	function onError(error) {
		if (error.syscall !== "listen") {
			throw error;
		}

		const bind = typeof port === "string"
			? "Pipe " + port
			: "Port " + port;

		switch (error.code) {
			case "EACCES":
				console.error("\u001b[31m" + bind + " requires elevated privileges" + "\u001b[0m");
				process.exit(1);
				break;
			case "EADDRINUSE":
				console.error("\u001b[31m" + bind + " is already in use" + "\u001b[0m");
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	function onListening() {
		const addr: any = server.address();
		const bind: any = typeof addr === "string"
			? "pipe " + addr
			: "port " + addr.port;
		//   debug('Listening on ' + bind);

		process.send = process.send || function (message: string): boolean {
			return true;
		};  // for pm2 cluster.

		process.send("ready");
		console.info("\u001b[34m" + "Steady flight." + "\u001b[0m");
		console.groupEnd();
	}

	const port: any = normalizePort(process.env.PORT || config.port);
	app.set("port", port);

	let server: any = null;

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

	console.info("\u001b[32m" + "V2" + "\u001b[0m");

	return server;
};

normal();
