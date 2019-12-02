# Auth

```
ユーザ認証
```

## Login

|**description**|ユーザに該当するセッションを開始する.|
|--------------|-----------------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/auth/local/login"|
|**body**|{<br/>content: {<br/>		username: "MAIL_ADDRESS",<br/>		password: "PASSWORD"<br/>		}<br/>}|
|**result**|{code: ERROR_CODE, value: {is_2fa: true/false}}|

|**CODE**||
|------|--------------------|
|-1|CSRF.|
|1|already logged in.|
|2|account disabled.|
|3|username not found or password mismatch.|
|4|unknown error.|
|other|exception.|

## Login with Totp

|**description**|ユーザに該当するセッションを開始する。<br>開始する際、totpによる認証コードを要求する。|
|--------------|-----------------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/auth/local/login_totp"|
|**body**|{<br/>content: {<br/>		username:**MAIL_ADDRESS**,<br/>		password:**PASSWORD**,<br/>		code:**CODE**<br/>		}<br/>}|
|**result**|{code:**ERROR_CODE**, value: {}}|

|**CODE**||
|------|--------------------|
|-1|CSRF.|
|1|already logged in.|
|2|account disabled.|
|3|username not found or password mismatch.|
|4|unknown error.|
|5|code missmatch.|
|other|exception.|

## Regist

|**description**|ユーザ登録リンク付きのメールをユーザ名のメールアドレスに送信する。|
|--------------|-----------------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/auth/local/register"|
|**body**|{<br/>content: {<br/>		username:**MAIL_ADDRESS**,<br/>		password:**PASSWORD**,<br/>		metadata: {<br/>				nickname:**NICKNAME**<br/>				}<br/>		}<br/>}|
|**result**|{code: ERROR_CODE, value: RESULT}|

|**CODE**||
|-------|--------------------------|
|-1|CSRF.|
|1|username already regist.|
|other|exception.|


## Regist Immediate

|**description**|ユーザを直接登録する。|
|--------------|-----------------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/auth/immediate/register"|
|**body**|{<br/>content: {<br/>username:**MAIL_ADDRESS**,<br/> password:**PASSWORD**,<br/> metadata:{<br/>nickname:**NICKNAME**<br/>}<br/>}<br/>}|
|**result**|{code:**ERROR_CODE**, value:{}}|

|**CODE**||
|-------|--------------------------|
|-2|no auth.|
|-1|CSRF.|
|1|username already regist.|
|other|exception.|

## Password

|**description**|パスワード変更リンク付きのメールをユーザ名のメールアドレスに送信する。|
|----------------|-------------------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/auth/local/password"|
|**body**|{<br/>content: {<br/>username:**MAIL_ADDRESS**,<br/>password:**PASSWORD**<br/>}<br/>}|
|**result**|{code: ERROR_CODE, value: RESULT}|

|**CODE**||
|------|--------------------|
|-1|CSRF.|
|3|username not found.|
|other|exception.|

## Password Immediate

|**description**|ユーザのパスワードを直接変更する。|
|----------------|-----------------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/auth/immediate/password"|
|**body**|{<br/>content: {<br/>username:**MAIL_ADDRESS**,<br/>password:**PASSWORD**<br/>}<br/>}|
|**result**|{code: ERROR_CODE, value: RESULT|

|**CODE**||
|------|--------------------|
|-2|no auth.|
|-1|CSRF.|
|3|username not found.|
|other|exception.|

## Logout

|**description**|該当のセッションを終了する。|
|----------------|----------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/auth/logout"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: RESULT}|

|**CODE**||
|------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

# Session

```
セッション
```

## Get

|**description**|ユーザに該当するセッションを取得する。|
|----------------|-----------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/session/auth"|
|**body**|N/A|
|**result**|{code:**ERROR_CODE**, value:**SESSION_VALUE**}|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|other|exception.|

|**SESSION_VALUE**                                                                                                                                                                                                                                                    |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|NO LOGIN                                                                                                                                                                                                                                                             |
|{<br/>		provider: "",<br/>		username: "",<br/>		user_id: "",<br/>		content: {<br/>			mails: [],<br/>			nickname: "",<br/>			id: "",<br/>			description: ""<br/>		},<br/>		enabled: false,<br/>		role: ROLE,<br/>		data: {},<br/>}                                    |
|LOCAL LOGIN                                                                                                                                                                                                                                                          |
|{<br/>		provider: "local",<br/>		username: mailaddress,<br/>		user_id: user_id,<br/>		content: {<br/>				mails: [mail_address],<br/>				nickname: nickname,<br/>				id: "",<br/>				description: ""<br/>		},<br/>		enabled: true/false,<br/>		role: ROLE,<br/>		data: SAVED_DATA,<br/>}|
|FACEBOOK LOGIN                                                                                                                                                                                                                                                       |
|{<br/>		provider: "facebook",<br/>		username: facebook_mailaddress,<br/>		user_id: facebook_id,<br/>		content: {<br/>				mails: [mail_address],<br/>				nickname: facebookFamilyName " " facebookGivenName,<br/>				id: "",<br/>				description: ""<br/>		},<br/>		enabled: true/false,<br/>		role: ROLE,<br/>		data: {},<br/>}|

|**ROLE**                                                                                                                                                                                        |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|{<br/>		login: true/false,<br/>		system: true/false,<br/>		manager: true/false,<br/>		user: true/false,<br/>		member: true/false,<br/>		temp: true/false,<br/>		guest: true/false,<br/>		public: true/false,<br/>		categoly: 0/1,<br/>		raw: NUMBER,<br/>}|

## Put

|**description**|ユーザに該当するセッションに値を設定する。|
|----------------|-----------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|PUT|
|**endpoint**|"https://DOMAIN/session/auth"|
|**body**|{data:**SAVED_DATA**}|
|**result**|{code:**ERROR_CODE**, value:**SESSION_VALUE**}|

|**CODE**||
|---------|---------------|
|-2|no auth.|
|-1|CSRF.|
|1|not logged in.|
|other|exception.|

# Accounts

```
アカウント。
```

## Query

|**description**|アカウント一覧。|
|--------------|--------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証,マネージャ権限|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/accounts/auth/query/:query/:option"|
|**body**|N/A|
|**result**|{code:**ERROR_CODE**, value:**[ACCOUNT]**}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Count

|**description**|アカウント数。|
|----------------|--------------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証,マネージャ権限|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/accounts/auth/count/:query"|
|**body**|N/A|
|**result**|{code:**ERROR_CODE**, value:**COUNT**}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Get

|**description**|アカウント詳細。|
|----------------|-----------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証,自身|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/accounts/auth/:username"|
|**body**|N/A|
|**result**|{<br/>code:**ERROR_CODE**, <br/>value: {<br/>		username:**USERNAME**<br/>		user_id:**USER_ID**<br/>		auth:**NUMBER**<br/>		enabled: true/false<br/>		mails:**[MAILS]**<br/>		nickname:**NICKNAME**<br/>		id:**ID**,<br/>		description:**DESCRIPTION**<br/>		}<br/>}|

|**CODE**||
|---------|---------------|
|-2|no auth.|
|-1|CSRF.|
|1|not logged in.|
|2|unreadable.|
|other|exception.|

## Put

|**description**|アカウント更新。|
|----------------|-----------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証,自身|
|**protocol**|PUT|
|**endpoint**|"https://DOMAIN/accounts/auth/:username"|
|**body**|{<br/>content:{<br/>		mails:**[MAILS]**,<br/>		nickname:**NICKNAME**,<br/>		id:**ID**,<br/>		description:**DESCRIPTION**,<br/>		auth:**NUMBER**;<br/>		enabled: true/false<br/>		}<br/>}|
|**result**|{<br/>code:**ERROR_CODE**, <br/>value: {<br/>		username:**USERNAME**,<br/>		user_id:**USER_ID**,<br/>		mails:**[MAILS]**,<br/>		nickname:**NICKNAME**,<br/>		id:**ID**,<br/>		description:**DESCRIPTION**,<br/>		auth:**NUMBER**,<br/>		enabled:true/false,<br/>		}<br/>}|


|**CODE**||
|---------|---------------|
|-2|no auth.|
|-1|CSRF.|
|1|not logged in.|
|2|unreadable.|
|other|exception.|

|**ACCOUNT**|
|-----------------------------------------------------------|
|{<br/>		provider: "local"/"facebook",<br/>		auth:**NUMBER**,<br/>		user_id:**ID**,<br/>		username:**MAIL_ADDRESS**,<br/>		privatekey:**PRIVATE_KEY**,<br/>		publickey:**PUBLIC_KEY**,<br/>		enabled: true/false,<br/>		content: {}<br/>}|

## Delete

|**description**|アカウント削除。|
|----------------|-----------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証,自身|
|**protocol**|DELETE|
|**endpoint**|"https://DOMAIN/accounts/auth/:username"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|2|unreadable.|
|other|exception.|


## Get is 2fa

|**description**|二段階認証確認|
|----------------|-----------------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証,自身(マネージャ以上は全て)|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/accounts/auth/is2fa/:username"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {is_2fa:true/false}}|

|**CODE**||
|---------|---------------|
|-2|no auth.|
|-1|CSRF.|
|1|not logged in.|
|2|unreadable.|
|other|exception.|

## Set 2fa

|**description**|二段階認証設定|
|----------------|------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証,自身(マネージャ以上は全て)|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/accounts/auth/set2fa/:username"|
|**body**||
|**result**|{code: ERROR_CODE, value: {qrcode:QRCODE}}|

|**CODE**||
|---------|---------------|
|-2|no auth.|
|-1|CSRF.|
|1|not logged in.|
|2|unreadable.|
|other|exception.|

* QRCODEはデータスキーマURL.

## Reset 2fa

|**description**|二段階認証設定解除|
|----------------|--------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証,自身(マネージャ以上は全て)|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/accounts/auth/reset2fa/:username"|
|**body**||
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|---------------|
|-2|no auth.|
|-1|CSRF.|
|1|not logged in.|
|2|unreadable.|
|other|exception.|

# Publickey

```
公開鍵。
```

## Get Fixed Public Key

|**description**|固定公開鍵|
|----------------|--------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/publickey/fixed"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: PUBLIC_KEY}|

|**CODE**||
|---------|---------------|
|-2|no auth.|
|-1|CSRF.|
|1|not logged in.|
|other|exception.|

## Get Dynamic Public Key

|**description**|ユーザ単位の公開鍵|
|----------------|--------------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/publickey/dynamic"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: PUBLIC_KEY}|

|**CODE**||
|---------|---------------|
|-2|no auth.|
|-1|CSRF.|
|1|not logged in.|
|2|no auth.|
|other|exception.|

# Files

```
ファイルストレージ。
```

## Query Files

|**description**|ファイル一覧|
|----------------|-------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/files/auth/query/:query/:option"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: RESULT|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|other|exception.|

## Files Count

|**description**|ファイル数|
|----------------|-----------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/files/auth/count/:query"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: COUNT}|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|other|exception.|

## Get File

|**description**||
|---------------|-----------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/files/auth/[PATH]"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|1|no item.|
|2|no stream.|
|other|exception.|

## Post File

|**description**|ファイル作成|
|----------------|-----------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/files/auth/[PATH]"|
|**body**||
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|1|no name.|
|other|exception.|

## Delete File

|**description**|ファイル削除|
|----------------|-----------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|DELETE|
|**endpoint**|"https://DOMAIN/files/auth/[PATH]"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|1|not found.|
|other|exception.|

## Get File

|**description**|ファイルダウンロード|
|----------------|----------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/files/get/[PATH]"|
|**body**|N/A|
|**result**|FILE|

# Pages

```
ページリソース。
```

## Query Pages

|**description**|ページ検索|
|----------------|-------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/pages/auth/query/:query/:option"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: RESULT}|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|other|exception.|

## Pages Count

|**description**|ページ数|
|----------------|-----------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/pages/auth/count/:query"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: COUNT}|

|**CODE**||
|---------|-------------|
|-1|CSRF.|
|else|data broken.|

## Get Page

|**description**||
|---------------|--------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/pages/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|------|-----------|
|-1|CSRF.|
|1|not found.|
|other|exception.|

## Post Page

|**description**|ページ作成|
|----------------|------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/pages/auth"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Put Page

|**description**|ページ更新|
|----------------|--------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|PUT|
|**endpoint**|"https://DOMAIN/pages/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Delete Page

|**description**||
|---------------|--------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|DELETE|
|**endpoint**|"https://DOMAIN/pages/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Get Page

|**description**|ページ取得|
|----------------|------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|DELETE|
|**endpoint**|"https://DOMAIN/pages/get/*"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

# Articles

```
記事
```

## Query Articles

|**description**|アーティクル一覧|
|----------------|----------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/articles/auth/query/:query/:option"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|other|exception.|

## Count Articles

|**description**|アーティクル数|
|----------------|--------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/articles/auth/count/:query"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|other|exception.|

## Get Article

|**description**||
|---------------|-----------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/articles/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Post Article

|**description**|アーティクル作成|
|----------------|-------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/articles/auth"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Put Article

|**description**|アーティクル更新|
|----------------|-----------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|PUT|
|**endpoint**|"https://DOMAIN/articles/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Delete Article

|**description**|アーティクル削除|
|----------------|-----------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|DELETE|
|**endpoint**|"https://DOMAIN/articles/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

# Vaults

```
秘匿データコンテナ。
データは公開鍵暗号によって暗号化されて保管される。
```

## Query Vaults

|**description**|秘匿データ一覧|
|----------------|--------------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/vaults/auth/query/:query/:option"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|other|exception.|

## Count Vaults

|**description**|秘匿データ数|
|----------------|------------------------------------------|
|**conditions**|CORS設定により同一ドメイン|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/vaults/auth/count/:query"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-1|CSRF.|
|other|exception.|

## Get Vault

|**description**|秘匿データ取得|
|----------------|---------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|GET|
|**endpoint**|"https://DOMAIN/vaults/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Post Vault

|**description**|秘匿データ作成|
|----------------|------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|POST|
|**endpoint**|"https://DOMAIN/vaults/auth"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Put Vault

|**description**|秘匿データ更新|
|----------------|---------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|PUT|
|**endpoint**|"https://DOMAIN/vaults/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|

## Delete Vault

|**description**|秘匿データ削除|
|----------------|---------------------------------|
|**conditions**|CORS設定により同一ドメイン,ユーザ認証|
|**protocol**|DELETE|
|**endpoint**|"https://DOMAIN/vaults/auth/:id"|
|**body**|N/A|
|**result**|{code: ERROR_CODE, value: {}}|

|**CODE**||
|---------|-----------|
|-2|no auth.|
|-1|CSRF.|
|other|exception.|


# Interface

```ts
interface IErrorObject {
	code: number;
	message: string;
}
```
```ts
type Callback<T> = (error: IErrorObject | null, results: T | null) => void;
```
```ts
interface IEmit {
	source: any;
	value: any;
	changed: any;
}
```
```ts
interface IDecoded {
	status: string;
	plaintext: string;
	signeture: string;
}
```
```ts
interface IEncoded {
	status: string;
	cipher: string;
}
```
```ts
interface IPasswordToken {
	username: string;
	password: string;
	target: string;
	timestamp: any;
}
```
```ts
interface IUserToken {
	auth: number;
	username: string;
	password: string;
	content: {};
	target: string;
	timestamp: any;
}
```
```ts
enum AuthLevel {
	system = 1,
	manager = 100,
	user = 200,
	public = 100000,
}
```
```ts
interface IAccountPublic {
	username: string;
	user_id: string;
	auth: number;
	enabled: boolean;
}
```
```ts
interface IRights {
	resad: number;
	write: number;
}
```
```ts
interface IAuthIntf {
	system: boolean;
	manager: boolean;
	user: boolean;
	public: boolean;
	categoly: number;
	raw: AuthLevel;
	login: boolean;
}
```
```ts
interface ISession {
	provider: string;
	username: string;
	user_id: string;
	content: {
		mails: string[];
		nickname: string;
		id: string;
		description: string
	};
	enabled: boolean;
	role: {
		system: boolean;
		manager: boolean;
		user: boolean;
		public: boolean;
		categoly: number;
		raw: number;
		login: boolean;
	};
	entry: string;
	exit: string;
}
```
```ts
interface IContent {
	id: string;
	parent_id: string;
	enabled: boolean;
	category: string;
	status: number;
	type: string;
}
```
```ts
interface IArticleModelContent extends IContent {
	name: string;
	value: {};
	accessory: {};
}
```
```ts
interface IPageModelContent extends IContent {
	path: string;
	value: string;
	accessory: {};
}
```
```ts
interface IVaultModelContent extends IContent {
	value: string;
	accessory: {};
}

```
```ts
interface IMailSender {
	from: any;
	to: string;
	bcc: string;
	subject: string;
	html: string;
}
```
```ts
interface IMailModule {
	send(mailAddress: string, bccAddress: string, title: string, message: string, callback: (error: IErrorObject) => void): void;
}
```
```ts
interface IAccountModel {
	create: Date;
	modify: Date;
	provider: string;
	auth: number;
	user_id: string;
	username: string;
	password: string;
	privatekey: string;
	publickey: string;
	enabled: boolean;
	role: IAuthIntf;
	category: string;
	status: number;
	type: string;
	secret: string;
	content: any;
	entry: string;
	exit: string;
	data: any;

	public(): IAccountPublic;
	_save(): void;
	mail(): string;
	get_status(): number;
	set_status(status): void;
	Role(user: IAccountModel): IAuthIntf;
	default_find_by_id(user: IAccountModel, id: string): void;
	default_find_by_name(user: IAccountModel, name: string): void;
	default_find(user: IAccountModel, query: any, option: any): void;
	set_by_name(user: IAccountModel, name: string, setter: any): void;
	remove_by_name(user: IAccountModel, name: string): void;
	publish_find(query: any, option: any): void;
	publish_count(query: any): void;
	publish_find_by_id(id: any): void;
}
```
```ts
interface IUpdatableModel {
	public(): any;
	_create(user: IAccountModel, body: any, cb: Callback<any>): void;
	_save(): void;
	set_rights(user: IAccountModel, id: string, rights: IRights): void;
	update_by_id(user: IAccountModel, id: string, body: any): void;
	set_by_id(user: IAccountModel, id: string, setter: any): void;
	remove_by_id(user: IAccountModel, id: string): void;
	default_find_by_id(user: IAccountModel, id: string): void;
	default_find(user: IAccountModel, query: any, option: any): void;
	default_count(user: IAccountModel, query: any): void;
}
```
```ts
interface ISecureUpdatableModel {
	public(key: string): any;
	_create(user: IAccountModel, key: string, body: any, cb: Callback<any>): void;
	_save(): void;
	set_rights(user: IAccountModel, id: string, rights: IRights): void;
	update_by_id(user: IAccountModel, key: string, id: string, body: any): void;
	set_by_id(user: IAccountModel, id: string, setter: any): void;
	remove_by_id(user: IAccountModel, id: string): void;
	default_find_by_id(user: IAccountModel, id: string): void;
	default_find(user: IAccountModel, query: any, option: any): void;
	default_count(user: IAccountModel, query: any): void;
}
```
```ts
interface IPublishModel {
	_save(): void;
	public(): any;
	default_find(user: IAccountModel, query: any, option: any): void;
	default_count(user: IAccountModel, query: any): void;
	default_find_by_id(user: IAccountModel, id: string): void;
	update_by_id(user: IAccountModel, id: string, body: any): void;
	remove_by_id(user: IAccountModel, id: string): void;
}
```
```ts
interface IArticleModel extends IUpdatableModel {
	create: Date;
	modify: Date;
	user_id: string;
	enabled: boolean;
	content: IArticleModelContent;

	publish_find(query: any, option: any): void;
	publish_count(query: any): void;
	publish_find_by_id(id: string): void;
}
```
```ts
interface IPageModel extends IUpdatableModel {
	create: Date;
	modify: Date;
	user_id: string;
	content: IPageModelContent;

	get_page(user_id: string, path: string, object: any, cb: (error: IErrorObject, doc: any, mimetype: string) => void): void;
	publish_find(query: any, option: any): void;
	publish_count(query: any): void;
	publish_find_by_id(id: any): void;
}
```
```ts
interface IVaultModel {
	create: Date;
	modify: Date;
	user_id: string;
	content: IVaultModelContent;

	publish_find(query: any, option: any): void;
	publish_count(query: any): void;
	publish_find_by_id(id: string): void;
}
```
```ts
interface IFacebookUser {
	id: string;
	name: {
		familyName: string;
		givenName: string;
	};
	emails: Array<{ value: string }>;
	provider: string;
}
```



