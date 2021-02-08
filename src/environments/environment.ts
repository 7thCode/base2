// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: any = {
	production: false,
	endPoint: "",
	webSocket: "ws://127.0.0.1:3001",
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
