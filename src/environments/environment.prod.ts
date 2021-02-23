export const environment = {
	production: true,
	endPoint: "",
	webSocket: "wss://seventh-code.com/ws",
	headers: {
		"Accept": "application/json; charset=utf-8",
		"Content-Type": "application/json; charset=utf-8",
	},
	use_publickey: false,
	is_electron: false,

	meta: {
		top: {
			title: "TITLE",
			description: [
				{name: 'description', content: "DESC"},
				{name: 'keywords', content: "key,words"},
				{name: 'twitter:card', content: ""},
				{name: 'twitter:site', content: ""},
				{property: 'og:url', content: ""},
				{property: 'og:title', content: ""},
				{property: 'og:description', content: ""},
				{property: 'og:image', content: ""}
			]
		},
		description: {
			title: "DESC",
			description: [
				{name: 'twitter:card', content: ""},
				{name: 'twitter:site', content: ""},
				{property: 'og:url', content: ""},
				{property: 'og:title', content: ""},
				{property: 'og:description', content: ""},
				{property: 'og:image', content: ""}
			]
		}
	}
};
