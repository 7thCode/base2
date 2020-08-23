module.exports = {
	systems: {
		status: "production",
		mode: 1,

		is_cluster: true,

		timezone: "Asia/Tokyo",

		loglevel: "trace", 		// trace, debug, info, warn, error,fatal

		port: 3000,
		domain: "localhost:3000",
		protocol: "http",

		socket_port: 3001,
		socket_domain: "localhost:3001",
		socket_protocol: "ws",

		cache1: "max-age=86400",
		cache: "no-cache",
		timeout: 100000,
		bodysize: "200mb",

		ua: "base1",
		use_publickey: false,
		dav: false,
		db: {
			protocol: "mongodb",
			address: "localhost",
			user: "base1master",
			password: "33550336",
			name: "base1",
			backup: {
				hour: 0,
				minute: 0
			}
		},
		regist: {
			user: true,
			member: true,
			expire: 60
		},
		sessionname: "base1",
		extendheader_enable: true,
		extendheader: [
			["Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"],
			["Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin"],
			["Access-Control-Allow-Credentials", true],
		],
		sessionsecret: "Daisy, Daisy.",
		tokensecret: "Yes We therefore I think we",
		key2: "Man is a thinking reed",
		vaultkey: "Man is a thinking reed",
		privatekey: "-----BEGIN RSA PRIVATE KEY-----\n" +
			"MIIBOwIBAAJBAIwIo4JtN7FtO1I48PTCqRB7p3mFMcj5NLZylle6Bi7VHW+P2Lqf" +
			"PqgiUl2JLycsCDtj6m2DgeV2cK/vAugSRDMCAwEAAQJAWOVTB4VWCaiSNAw5yueY" +
			"dAJLuvU3OaIaOIhdsKtDKY7nZrT3RSCVJuA5SM7RTOkESFaFL3gk7jU/ge+8LQDK" +
			"gQIhANDlWlMgHPUnxhEVGbfuXJcpNLmMhb5DgxQBbaVFrThDAiEAq5wsn9pOiVnV" +
			"IOkVff3+3RbX8/lZl8hIyIQs9Gi+vVECIQDGJDZH0JcHBqH9xAjwCPz0OJaVRS/6" +
			"56imSjCJaozCZwIhAKqF+4m0QcoV68RSGDskAvbqVhhms/Iw4LHvNUSAONihAiAr" +
			"T6te671ws0hbph0gCipq1ZXARXPyRE6ecD4Amgr1Kw==\n" +
			"-----END RSA PRIVATE KEY-----",
		publickey: "-----BEGIN RSA PUBLIC KEY-----\n" +
			"MEgCQQCMCKOCbTexbTtSOPD0wqkQe6d5hTHI+TS2cpZXugYu1R1vj9i6nz6oIlJd" +
			"iS8nLAg7Y+ptg4HldnCv7wLoEkQzAgMBAAE=\n" +
			"-----END RSA PUBLIC KEY-----",
		modules: {
			stripe: {
				type: "optional",
				path: "/plugins/modules/",
				key: "sk_test_YsexgC22DK728hiSHQxJILSC00TymbkYxj",
				description: {
					display: "Stripe"
				}
			},
			front: {
				type: "required",
				path: "/applications/modules/",
				description: {
					display: "Front"
				}
			}
		},
		default: {
			user_id: "000000000000000000000000",
		},
		initusers: [
			{
				auth: 1,
				user_id: "000000000000000000000000",
				username: "oda.mikio+system@gmail.com",
				password: "mitana",
				content: {
					mails: [],
					nickname: "system",
					id: "",
					description: "無制限権限。"
				}
			},
			{
				auth: 100,
				user_id: "000000000000000000000001",
				username: "oda.mikio+manager@gmail.com",
				password: "mitana",
				content: {
					mails: [],
					nickname: "manager",
					id: "",
					description: "ユーザの追加変更削除が可能。"
				}
			},
			{
				auth: 200,
				user_id: "000000000000000000000002",
				username: "oda.mikio+user@gmail.com",
				password: "mitana",
				content: {
					mails: [],
					nickname: "user",
					id: "",
					description: "ユーザ"
				}
			},
			{
				auth: 100000,
				user_id: "000000000000000000000003",
				username: "oda.mikio+public@gmail.com",
				password: "mitana",
				content: {
					mails: [],
					nickname: "public",
					id: "",
					description: "public権限"
				}
			}],
		initfiles: [
			{
				type: 0,
				user: {user_id: "000000000000000000000000", role: {raw: 100000}},
				path: "/server/platform/assets/img",
				name: "blank.png",
				content: {
					"type": "image/png",
					"category": "l"
				}
			}
		],

		//      passport
		//      clientID: "1676184429271661"
		//      clientSecret: "f3a9ad16cf0d73cd38dfc3aa0843c2fe"
		//
		//      base1 OK
		// 		clientID: "1091756834285901",
		// 		clientSecret: "f26703b087f2c5c3e8c8c4e7fa335793",
		//
		//		aig-tokyo NG
		// 		clientID: "2711714689085104",
		//		clientSecret: "39914ea6a1a8fcf8561f472d937c20b2",
		//
		//		aig1 NG
		//      clientID: "2881565078637042",
		//      clientSecret: "d9803a8acf05e4dd11dc487e006167c2",
		//
		facebook1: {
			enable: "true",
			redirect: "/",
			key: {
				clientID: "1676184429271661",
				clientSecret: "f3a9ad16cf0d73cd38dfc3aa0843c2fe",
				callbackURL: "http://localhost:3000/auth/facebook/callback",
				profileFields: ['id', 'email', 'name']
			},
		},
		facebook: { // base1
			enable: "true",
			redirect: "/",
			key: {
				clientID: "314094379736984",
				clientSecret: "17e3a37b4e7296c97f43c70acbac00f3",
				callbackURL: "http://localhost:3000/auth/facebook/callback",
				profileFields: ['id', 'email', 'name']
			},
		},
		apple: {
			enable: "true",
			redirect: "/",
			KeyFile: "authkey.p8",
			key: {
				clientID: "com.aigtokyo.service",
				callbackURL: "http://localhost:3000/auth/apple/callback",
				teamId: "G3L3422HGJ",
				keyIdentifier: "L822486XZP",
				privateKeyPath: "",
			},
		},
		twitter1: {
			enable: "false",
			redirect: "/",
			key: {
				"consumerKey": "3rebUktAh65RuqWkCxlBUAOOq",
				"consumerSecret": "SCTtHHlvGEWUBM6rQiqT8JqxuezGT7kudF3D30XbF09JkIHOir",
				"callbackURL": "https://seventh-code.com/auth/twitter/callback"
			}
		},
		instagram1: {
			enable: "false",
			redirect: "/",
			key: {
				"clientID": "986729ad287241d08ff7616e8d3adc73",
				"clientSecret": "69e57e2fad5541599725be4c9e95b2b9",
				"callbackURL": "https://seventh-code.com/auth/instagram/callback"
			}
		},
		line1: {
			enable: "true",
			redirect: "/",
			key: {
				"channelID": "1504885300",
				"channelSecret": "2ac60f3d920006fa5e985f5f133ec96d",
				"callbackURL": "https://seventh-code.com/auth/line/callback"
			}
		},
		googleplus1: {
			enable: "false",
			redirect: "/",
			key: {
				"clientId": "1029972682852-3eemd2k01fsvjcabsdkhotsd3ptg8ljh.apps.googleusercontent.com",
				"apiKey": "K202stOY6pHTW2Poe_q2SyS9",
				"callbackURL": "https://seventh-code.com/auth/googleplus/callback"
			}
		},
		mailer1: {
			type: "mail",
			account: "postmaster@seventh-code.com",
			setting: {
				host: "smtp20.gmoserver.jp",
				port: "587",
				auth: {
					user: "info@seventh-code.com",
					pass: "P#aZX44O"
				}
			}
		},
		mailer: {
			type: "mailgun",
			account: "postmaster@seventh-code.com",
			setting: {
				"api_key": "key-65d5868f3829dfed0f285c3eb776a518",
				"domain": "seventh-code.com"
			}
		},

		message: {
			"cancel": "Cancel",
			"invalid_mail_format": "invalid mail format",
			"login": "Login",
			"logindialogtitle": "Login",
			"logout": "Logout",
			"long": "too long",
			"mail_field": "Mail Address",
			"mail": "Mail",
			"memberconfirmdialogtitle": "Member Register Mail Sent",
			"memberconfirmtext": "Add Member",
			"memberdialogtitle": "Member Regist",
			"nickname_field": "Nickname",
			"nickname": "Nickname",
			"ok": "OK",
			"password_field": "Password",
			"password_missmatch": "password missmatch",
			"password": "Password",

			"passwordconfirmdialogtitle": "Update Password Mail Sent.",
			"passwordconfirmtext": "Update Password Mail Sent.",
			passwordmail: {
				header: {
					title: "base1...",
					text: "password",
				},
				content: {
					title: "Password change",
					text: "Click on the Password change button within 30 minutes to complete the Password change.",
				},
				button: {
					title: "change password",
				},
				footer: {
					text: "Copyright © 2017 . All rights reserved.",
				},
			},
			"passworddialogtitle": "Password Change",

			"registconfirmdialogtitle": "User Register Mail Sent.",
			"registconfirmtext": "User Register Mail Sent.",
			registmail: {
				header: {
					title: "base1...",
					text: "regist...",
				},
				content: {
					title: "User Regist",
					text: "Click on the User Regist button within 30 minutes to complete the Regist.",
				},
				button: {
					title: "Regist",
				},
				footer: {
					text: "Copyright © 2019 seventh-code. All rights reserved.",
				},
			},
			"registdialogtitle": "User Regist",
			"reserveconfirmdialogtitle": "Reserve Mail Sent.",
			"reserveconfirmtext": "Reserve Mail Sent.",
			"reservedialogtitle": "Reserve",
			"regist": "Regist",
			"retypepassword": "Retype Password",
			"required": "Required",
			"short": "too short",
			"usernamenotfound": "password missmatch or user not found.",
			"usernamealreadyregist": "username already exist."
		}
	},
	users: {
		initresources: [],
		initusers: [],
		initpages: [
			{
				user_id: "000000000000000000000000",
				content: {
					category: "HTML",
					status: 0,
					type: "text/html",
					path: "path/to/html.html",
					value: "<!DOCTYPE html>\n" +
						"<html lang=\"en\">\n" +
						"<head>\n" +
						"    <meta charset=\"UTF-8\">\n" +
						"    <title>Title</title>\n" +
						"</head>\n" +
						"<body>\n" +
						"   Hello form HTML!\n" +
						"</body>\n" +
						"</html>",
					accessory: {},
				}
			},
			{
				user_id: "000000000000000000000000",
				content: {
					category: "pug",
					status: 0,
					type: "text/html",
					path: "path/to/pug.html",
					value: "div\n" +
						"  div Hello from pug!\n",
					accessory: {},
				}
			},
			{
				user_id: "000000000000000000000000",
				content: {
					category: "EJS",
					status: 0,
					type: "text/html",
					path: "path/to/ejs.html",
					value: "<div><div>Hello from ejs!</div></div>",
					accessory: {},
				}
			},
			{
				user_id: "000000000000000000000000",
				content: {
					category: "Markdown",
					status: 0,
					type: "text/html",
					path: "path/to/markdown.html",
					value: "#### Hello from Markdown!",
					accessory: {},
				}
			},
			{
				user_id: "000000000000000000000000",
				content: {
					category: "JavaScript",
					status: 0,
					type: "text/javascript",
					path: "path/to/javascript.js",
					value: "function foo(items, nada) {\n" +
						"    for (var i=0; i<items.length; i++) {\n" +
						"        alert(items[i] + \"juhu\\n\");\n" +
						"    }\t// Real Tab.\n" +
						"}",
					accessory: {},
				}
			}
		],
		initarticles: []
	}
};
