## 個々のDBの認証(auth-dbはtarget-db自体)
```bash
$ mongo
> use base2
> db.createUser({user:"basemaster", pwd:"33550336", roles:[ "readWrite", "dbOwner" ]})
```

## 1.sudoでパスが通らない場合

    /etc/sudoers

    Defaults    env_reset

    を

    Defaults    env_keep += "PATH"

    コメントアウト
    #Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin

## 2.Build-essential
### まずは基本的な物をインストール
```bash
$ sudo apt-get update
$ sudo apt-get install build-essential
$ sudo apt-get install python
```

## 3.タイムゾーン
```bash
$ timedatectl set-timezone Asia/Tokyo
```

## USER追加
```bash
$ adduser USER
```
### USERをGROUPに追加
```bash
$ gpasswd -a USER GROUP
```
### GROUPを追加
```bash
$ groupadd GROUP
```
### GROUPを確認
```bash
$ groups USER
```
### sudoer
```bash
$ adduser USER
$ gpasswd -a USER sudo
```
## 依存する物...
    node.js - プラットフォーム
    mongodb - メインストレージ
## Node.jsインストール
### Ubuntu/Mac
    まず、nodebrewをインストール
```bash
$ curl -L git.io/nodebrew | perl - setup
$ export PATH=$HOME/.nodebrew/current/bin:$PATH
```
    nodeをインストール
```bash
$ nodebrew install-binary v6.X.0
$ nodebrew use v6.X.0
```

## mongodbインストール
### Ubuntu
    > sudo apt install mongodb
    > sudo apt install mongo-tools
### Mac(Homebrew)
    > brew install mongodb-community
    > brew install mongo-tools
### Windows

    see http://qiita.com/moto_pipedo/items/c3bb40370ba2792143ad

### 設定

#### 外部からの操作禁止

    > cd /etc
    > sudo nano mongod.conf

    で

    bindIp: 127.0.0.1

    を

    bindIp: 0.0.0.0

    > sudo service mongod restart


#### セキュリティON

    > cd /etc
    > sudo nano mongod.conf

    追記

    auth = true

     > sudo service mongod restart

#### 起動スクリプト

    /etc/init.d/mongodb

#### 起動コマンド
```bash
$ sudo service mongodb stop
$ sudo service mongodb start
$ sudo service mongodb restart
```
#### 初期化

##### DB全体の認証
```bash
    $ mongo
```
```js
    > use admin
    > db.createUser({user: "user",pwd: "pass",roles:[{role: "userAdminAnyDatabase",db: "admin"}]})
```
##### 個々のDBの認証(auth-dbはtarget-db自体)
```js
    > use base2
    > db.createUser({user:"user", pwd:"pass", roles:[ "readWrite", "dbOwner" ]})
```
##### Index
```js
    > db.fs.files.createIndex({ "filename" : 1, "uploadDate" : 1 })
```
#### ログ
##### Ubuntu

    /var/log/mongodb
    rm mongo.log.2016*

##### Mac

    /usr/local/var/log/mongodb
    rm mongo.log.2016*

#### Tips
##### クエリーロギング

スタート
```js
    > db.setProfilingLevel(1,20)
```
ストップ
```js
    > db.setProfilingLevel(0)
```

##### mongodbたまに実行
```bash
    $ mongo
```
```js
    > use admin
    > db.runCommand( { logRotate : 1 } )
```

##### localでmongoをcsvで落とす方法（例）
```bash
    $ mongoexport --host=127.0.0.1  --db test2 --collection businesscards --out businesscard.csv  --type=csv --fields=Template,UpdateDate
```
##### メモリー使用量
    /proc/**PID**/statusのVmRSS

## pm2インストール
see http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/
```bash
    $ sudo npm install pm2 -g
    $ sudo pm2 startup ubuntu
```    
### Use
```bash
    $ sudo pm2 start start.json --env production
    $ sudo pm2 save
```
### Test
```bash
    $ sudo reboot
      .
      .
      .
    $ sudo pm2 list
```    
### メモリー（GC)
```bash
    $ sudo pm2 start app.js --node-args="--optimize_for_size --max_old_space_size=920 --gc_interval=100"
```    
### Cluster
```json
    cluster.json(例)

        {
          "apps" : [
          {
            "name"        : "app",
            "script"      : "app.js",
            "instances"  : 2,
            "exec_mode"  : "cluster_mode",
            "args"        : [],
            "node_args"   : "--optimize_for_size --max_old_space_size=720 --gc_interval=100",
            "env": {
              "NODE_ENV": "development"
            },
            "env_production" : {
              "NODE_ENV": "production"
            }
          }
          ]
        }
```
```bash
    > sudo pm2 start cluster.json --env production
```
### Angular + Express

    ng new [PROJECT]

    express [SERVER]

    “package.json”以外を[PROJECT]ディレクトリにコピー

    [SERVER]ディレクトリの”package.json”の[dependencies]の内容を[PROJECT]ディレクトリの”package.json”の[dependencies]に追加

    [SERVER]ディレクトリの”package.json”の[scripts]の[start]を[PROJECT]ディレクトリの”package.json”の[scripts]の[start]に上書き

    中身を詰めて確認

    npm install
    npm start

    localhost:3000を確認、expressが起動していたらOK

    “Angular.json”ファイルの[projects->[PROJECT]->architect->build->options->outputPath]を”public”に書き換えビルド

    ng build

