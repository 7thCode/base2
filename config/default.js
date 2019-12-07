module.exports = {
	systems: {
		status: "debug",
		mode: 1,
		port: 3000,
		socket_port: 3001,
		domain: "localhost:3000",
		protocol: "http",
		cache1: "max-age=86400",
		cache: "no-cache",
		timeout: 100000,
		bodysize: "200mb",
		cors_enable: false,
		ua: "base2",
		use_publickey: false,
		dav: false,
		db: {
			address: "localhost",
			user: "base2master",
			password: "33550336",
			name: "base2",
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
		sessionname: "base2",
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
		modules: [],
		root_modules: [
			{
				type: "required",
				path: "/applications/modules/",
				name: "front",
				description: {
					display: "Front"
				}
			}
		],
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
				user: {user_id: "000000000000000000000000",role: {raw: 100000} },
				path: "/server/platform/assets/img",
				name: "blank.png",
				content: {
					"type": "image/png",
					"category": "l"
				}
			}
		],
		facebook1: {
			enable: "true",
			redirect: "/",
			key: {
				clientID: "1676184429271661",
				clientSecret: "f3a9ad16cf0d73cd38dfc3aa0843c2fe",
				callbackURL: "http://localhost:3000/auth/facebook/callback",
				profileFields: ['id', 'emails', 'name']
			},
		},
		facebook: {
			enable: "true",
			redirect: "/",
			key: {
				clientID: "1676184429271661",
				clientSecret: "f3a9ad16cf0d73cd38dfc3aa0843c2fe",
				callbackURL: "http://localhost:3000/auth/facebook/callback",
				profileFields: ['id', 'emails', 'name']
			},
		},
		apple1: {
			enable: "true",
			redirect: "/",
			key: {
				clientID: "APPLE_SERVICE_ID",
				callbackURL: "http://localhost:3000/auth/apple/callback",
				clientSecret: "",
				teamId: "APPLE_TEAM_ID",
				keyIdentifier: "",
				privateKeyPath: ""
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
		mailer: {
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
		mailer2: {
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
					path: "html.html",
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
					path: "pug.html",
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
					path: "ejs.html",
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
					path: "markdown.html",
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
					path: "javascript.js",
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
