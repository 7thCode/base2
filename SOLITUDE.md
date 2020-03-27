# 独り言
## Angular2 + Node.js
### angular-cliでなんかつくる
そこのディレクトリで
 ```js
$ npm install express --save
$ npm install cookie-parser body-parser morgan --save
```
### srcディレクトリにapp.jsつくる。
 ```js
        var express = require('express');
        var path = require('path');
        var favicon = require('serve-favicon');
        var logger = require('morgan');
        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');

        var app = express();

        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(__dirname));

        app.get('/*', function (req, res) {
          res.sendFile(path.join(__dirname,'index.html'));
        });

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
          var err = new Error('Not Found');
          err.status = 404;
          next(err);
        });


        if (app.get('env') == "development")
        {
          app.listen(3000, function () {
            console.log('Example listening on port 3000!');
          });
        }
        else{
          app.listen(8080, function () {
            console.log('Example listening on port 8080!');
          });
        }

        module.exports = app;
```
### iOSのBase64 Tips
      NSData通るとなぜか"+"が" "になってるんです。
      逆変換するべし。。。？？？
      なんかあるんやろな。。
      こんなかんじ。

      let data1 = data0.replace( / /g , "+" );
#### "a || b"パターンの使用は控えよう。
    完全にJavaScriptに閉じたイディオムの上、あんま意味もないので、教育上よくない。。。
    平たく書けば

        let result = HOGE || PIYO;

    は

        let result = HOGE;
        if (!HOGE) {
            result = PIYO;
        }

    なんら条件分岐が減るわけでもなく、単純にタイピング量wが減るだけ。。
    "a"がfalsyなら"b"って...
    たくさーん連結すればなんかいいこともあるかな？
    最後のtrueまで評価なんだろうな。。知らんけど。
    なんかなあ。。。

    ソースのサイズは複雑さに非らず。
    キーボード打つのがそんな嫌いなら、この商売向いてないよ？
#### "!!"パターンの使用もあかん。
    これも完全に形無し言語に閉じたイディオムの上、あんま意味もないので、教育上よくない。。。
    ちゃんと"Boolean()"しよう。それだけ。
#### パターン・イディオムは無理やり使わない
    適応できない部分はあっさり諦めよう。
    パターンを変化させればもはやそれはパターンではない。
#### みんな大好きPromise, async/await
    Promiseとそのシンタックスシュガーのasync/await。
    Promiseはシステムリソースであるsemaphoreを使用してるはず。(SpinLockならばなにおかいわんや...)
    リソース効率から、必須な場合をのぞいて単純な制御構造であるコールバックを使用すべき。
# いつか使う
### WebDriver
##### インストール(Mac Homebrew)
```bash
$ brew install selenium-server-standalone
$ brew install chromedriver
```
### 起動(Mac Homebrew)
```bash
$ java -Dwebdriver.chrome.driver=/usr/local/bin/chromedriver -jar /usr/local/Cellar/selenium-server-standalone/3.6.0/libexec/selenium-server-standalone-3.6.0.jar
```

  GraphQL

        あんまり好きくない感じ。。。
        サーバ・クライアント間で型安全。


  ECMAScript パーサー

        http://esprima.org/

  ジェネレータ

        https://github.com/estools/escodegen

  Parser API

        https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API#Expressions


  chromeサービスワーカー

        止める

        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            // 登録されているworkerを全て削除する
            for(let registration of registrations) {
                registration.unregister();
            }
        });
        caches.keys().then(function(keys) {
            var promises = [];
            // キャッシュストレージを全て削除する
            keys.forEach(function(cacheName) {
                if (cacheName) {
                    promises.push(caches.delete(cacheName));
                }
            });
        });

  Google Map API Key

        https://developers.google.com/maps/web/

# Docker
##### コンテナインストール・起動
```bash
$ docker run -d -p 80:80 --name webserver nginx
```
##### コンテナ表示
```bash
$ docker container ls
```
##### コンテナ起動
```bash
$ docker container start webserver
```
##### コンテナ終了
```bash
$ docker container stop webserver
```
##### コンテナ削除
```bash
$ docker container rm webserver
```
##### イメージ削除
```bash
$ docker image rm nginx
```
##### ログイン
```bash
$ docker container exec -ti webserver bash
```
##### ファイル共有して起動
```bash
$ docker run -d -p 80:80 -v /host/path:/container/path --name webserver nginx
```
##### Ex
```bash
$ docker run -d -p 80:80 -v /Users/oda/Desktop/moon:/usr/share/nginx/html --name webserver nginx
$ docker container exec -ti webserver bash
.
.
.
$ docker container stop webserver
$ docker image rm nginx
```
# Angular + Capacitor + Express
## Express
```
まずexpress。(req express-generator)
```
```bash
$ express **PROJECT-T**
```
## Angular
```
別ディレクトリにAngularをインストール。(req anguler-cli)
```
```bash
$ ng new **PROJECT**
$ cd **PROJECT**
.
.
.
$ ng build
```
## Express + Angular
```
**PROJECT-T**の内容を**PROJECT**に移動
package.jsonは統合
```
```js
app.use(express.static(path.join(__dirname, 'dist')));
```
```bash
$ npm install
```
ここまでで動作させてみる。

##### /app.js編集
routingあるなら。
(パスは適宜)
```
// pass all request to Angular app-routing.
router.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../index.html"));
});
```
Express + Angularならここで終了。
```
```bash
$ node bin/www
```
```
ブラウザから
http://localhost:3000
```
## + Electron
###### Electron
```
まず、デスクトップアプリシェルのElectronで動作させる。
パッケージング後、プロジェクト中のファイルパスを意識するモジュールなどは動かない(ex config等)
事前に修正必要。
```
```bash
$ npm install --save-dev electron@latest
$ npm install --save-dev electron-builder@latest
```
###### /main.js作成
```js
const {app, BrowserWindow} = require('electron')
const url = require("url");
const path = require("path");

let mainWindow

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	})

	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, `/dist/index.html`),
			protocol: "file:",
			slashes: true
		})
	);
	// Open the DevTools.
	mainWindow.webContents.openDevTools()

	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	if (mainWindow === null) createWindow()
})

```
##### /package.json編集
```json5
{
  "name": "**PROJECT**",
  "version": "0.0.0",
  "main": "main.js",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "electron": "ng build --base-href ./ && electron .",
    "package": "electron-builder --mac --x64"
  },
  "build": {
    "appId": "com.seventhcode.**PROJECT**",
    "mac": {
      "target": "dmg"
    },
    "win": {
      "target": "nsis"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    },
    "directories": {
      "output": "dmg"
    }
  },
```
##### /tsconfig.json編集
```json5
  "compilerOptions": {
    "target": "es5",
    }
```
##### /angular.json編集
```json5
 "architect": {
        "build": {
          "options": {
            "outputPath": "dist",
            }
          },
```
##### 実行
```
実行してみる。
PCアプリならここで終了。
```
```bash
$ npm install
$ npm run electron
```
##### ビルド
```bash
$ npm run package
```
## + Capacitor
##### Capacitor追加
```
iOS,Android,PC,Webに対応するためにCapacitorインストール.
```
```bash
$ npm install --save @capacitor/core @capacitor/cli
$ npx cap init --web-dir dist
```
##### capacitor - Electron
```bash
$ npx cap add electron
$ npx cap open electron
```
##### capacitor - iOS
```bash
$ npx cap add ios
$ npx cap open ios
```
##### capacitor - Web
```bash
$ npx cap copy web
$ npx cap serve
```
##### capacitor - Android
```bash
$ npx cap add android
$ npx cap open android
```
##### Electronビルド
```bash
$ npm run package
```
##### デバッガー
```bash
$ npm install --save-dev devtron
$ electron .
```
デバッガの[Console]から
```
require('devtron').install()
```
## Vue
##### vuejsのプロジェクト作成
```bash
$ vue create **PROJECT-T**
```
##### /public/index.html編集
```html
<base href=".">
```
```
を追加する。
```
##### vuejsをbuildする
```bash
yarn build
```
##### capacitor - iOS
```bash
$ npx cap add ios
$ npx cap open ios
```
## Angular Material
##### Angular Material
```bash
$ npm install --save @angular/material @angular/cdk @angular/animations
$ npm install --save angular/material2-builds angular/cdk-builds angular/animations-builds
```
##### /src/app/app.module.ts編集
```js
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [BrowserAnimationsModule],
  ...
})
export class HogeAppModule { }
```
##### /styles.css編集
```css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
```
##### /hammerインストール
```bash
$ npm install --save hammerjs
```
##### /src/main.ts編集
```js
import 'hammerjs';
```
##### /src/index.html編集
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```
## Flex Layout
##### Flex Layout
```bash
$ npm install @angular/flex-layout --save
```
##### /src/app/app.module.ts編集
```js
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [ FlexLayoutModule ],
});
```
## Angular Elements
普通の静的なサイトにAngularで作ったコンポーネントを貼り付ける。
```bash
$ ng new hogefuga
$ cd hogefuga
$ ng add @angular/elements
```

##### /src/app/app.component.ts編集
この辺がキモ。
```js
import { Component, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HogeFugaComponent } from './hogefuga/hogefuga.component';

@Component({
  selector: 'app-hogefuga',
  template: ``,
})
export class AppComponent  {
  constructor(
    private injector: Injector,
  ) {
    const AppHogeFugaElement = createCustomElement(
      HogeFugaComponent,
      { injector: this.injector }
    );
    customElements.define('app-hogefuga', AppHogeFugaElement);
  }
}
```
##### /src/app/app.module.ts編集
bootstrapにAppComponent, entryComponentsに新しく作るコンポーネント。
```js
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HogeFugaComponent } from './hogefuga/hogefuga.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent],
  entryComponents: [HogeFugaComponent]
})
export class AppModule { }
```
##### /src/app/hogefuga/hogefuga.component.ts編集
普通。
```js
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hogefuga',
  template: `
    <div>
      <h1>Hello {{ name }}!!</h1>
      <input [(ngModel)]="value">
      <button (click)="handleClick()">Click!</button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      border: 1px solid black;
    }

    div {
      padding: 16px;
      text-align: center;
      font-family: Lato;
    }
  `]
})
export class HogeFugaComponent  {
  value: string;

  @Input() name: string;
  @Output() clickButton: EventEmitter = new EventEmitter();

  handleClick() {
    this.clickButton.emit(this.value);
    this.value = '';
  }
}
```
##### Build
```bash
$ npm run build
```
##### Deploy
/dist/hogefuga/runtime-es2015.js
/dist/polyfills-es2015.js
/dist/scripts.js
/dist/main-es2015.js

を対象のサイトにコピー。
こんな感じで使う。
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>AngularElementsSample</title>

    <style>
      .angular-elemtents-sample input {
        border: 2px solid #333;
        font-size: 16px;
        padding: 2px;
      }
      .angular-elemtents-sample button {
        background-color: #616161;
        color: #fff;
        padding: 4px 8px;
        font-size: 16px;
        border: none;
        cursor: pointer;
      }
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>

    <app-hogefuga name="Angular Elements!" class="angular-elemtents-sample">loading</app-hogefuga>

    <script src="runtime-es2015.js"></script>
    <script src="polyfills-es2015.js"></script>
    <script src="scripts.js"></script>
    <script src="main-es2015.js"></script>
    <script>
      const appHogeFuga = document.querySelector('app-hogefuga');
      appHogeFuga.addEventListener('clickButton', (e) => {
        console.log(e.detail);
        appHogeFuga.setAttribute('name', e.detail);
      });
    </script>
  </body>
</html>
```

# 心がけよう
```
    シンプルに。
    迷う時はシンプルな方に。
    ソフトウェアの最大の敵は複雑性。ソフトウェア工学は複雑性と戦うための武器。野獣を閉じ込めろ。制御された複雑性。
    複雑性とは関連する物とその関連性の数。よって複雑性は増殖する。
    まずは名前が大事。
    名前は「世界観」と「構造」による推測を大事に。
    各種のモジュールやら変数やらの名前が決まったら、半分くらいはできたようなもん。
    ソースのサイズは複雑さに非らず。長くてもシンプルに。
    長い処理はダメだけど、短い処理が絡まってるのもダメ。メリハリ、バランス。(例えるなら一つの章に会話一回なんて小説、ただのアバンギャルド...)
    変数名は可能な限りフルスペル。スペルの省略には個性が入り混じってしまう。コピペ多用すべし。
    コピペも満足にできないようなのは"エディタ"じゃない。それはなんか苦行強いる宗教の類。。。
    「俺のソースは短いよ！かっこいいだろ！」は、ホビイスト坊や。
    「複雑なアルゴリズム」を「単純なコード」に還元する。
    「複雑なアルゴリズム」を「それ以上に複雑なコード」にしてはならない。
    「アルゴリズム＋データ構造＝プログラム」だが1+99や99+1は複雑性のピークが高い。50+50を心がける。
    ソースが表現の全て。可能な限りソースで処理を表現すべし。
    可能な限り処理自体にヒントを埋め込め。それを冗長とは言わない。
    コメントよりヒント。ソースで表現できない部分のみ文章で補う。
    言語固有の変な書き方はやめよう。まずは言語間の移植性(移植しないにせよ)、次に言語設計者の意図、次にシンプルさ。
    移植性が高いものほど論理的に強い。
    コピペ最強。なんせキーボード打つより間違わない。可能な部分は可能な限り。コピペは義務。
    フルスペルの長い名前をコピペすべし。名前を短縮しない。
    起動時、初期化時に可能な限りの処理を“試用”すべし。立ち上がりさえすれば論理的に正しい可能性が大きい。
    何かが少しでもおかしい場合は大騒ぎするように。異常を隠すのは無意識でも罪。
    「遅い、早い、大きい、小さい」は相対評価。「効率がいい、悪い」がより本質的。
    最適なアルゴリズムを採用すれば、シンプルになる。複雑だと感じたら基本から考え直そう。
    ソフトウェアの「技術力」とは複雑性をいかに克服できるかの度合い。複雑さの「達成」度合いではない。
    自分のソースに縛られない。歪みがあれば最初からやり直せ。
    人間、焦ると力押しに走る。それが終わりの始まり。
    他に何か理由があるでもなく、１度しか使わないような”関数”は展開しよう。関数にすることで複雑性を上げるだけ。

    伽藍がなければバザールもできない。
    バザールの商人よりも、良い建築家を目指せ。
```
