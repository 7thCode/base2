# linuxエトセトラ

## ディレクトリ
##### 中身ごと削除
    rm -R DIRECTORY
## プロセス
##### 確認
    ps -elf
## シンボリックリンク(ショートカットっぽいの)
##### 作成
    ln -s

##ドメイン(Nginx)

#### 最新版インストール

    /etc/apt/sources.listに追記

    deb http://nginx.org/packages/ubuntu/ trusty nginx

    「trusty」てのはでDebian系のバージョン表記なんだって。
    なので、適宜変えてね。

    apt-get update

    sudo service nginx stop

    sudo apt-get remove nginx-common

    sudo apt-get install nginx

    sudo service nginx start
##### ディレクトリ
      cd /etc/nginx
##### 存在すべきサイトとして登録
      cd sites-aveilable
      cp default xxx.vvv.jp.conf
##### 編集
      sudo nano xxx.vvv.jp.conf

      server {
              client_max_body_size 50M;
              listen        80;
              server_name   ドメイン(xxx.netなど);
              #return 301   https://$host$request_uri;
              #access_log   logs/host.access.log  main

              location / {
                        proxy_buffering off;
                        proxy_pass アドレス(http://128.199.232.217:20000など)
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection "upgrade";
                        proxy_redirect http:// https://;
                        }
              }

      Let's EncryptでHTTPSならば

      server {
              client_max_body_size 50M;
              listen 443 ssl;

              (nginxが1.9.6以上ならば)

              listen 443 ssl http2;

              server_name ドメイン(xxx.netなど);
              ssl_certificate      /etc/letsencrypt/live/[ファイル名確認]/fullchain.pe$
              ssl_certificate_key  /etc/letsencrypt/live/[ファイル名確認]/privkey.pem;

              #access_log  logs/host.access.log  main;

              location / {
                  proxy_buffering off;
                  proxy_pass http://localhost:30000;
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection "upgrade";
              }
      }

      cd ../sites-enabled
      ln -s ../sites-aveilable/xxxxx .
#### 開始/終了/再起動
    終了
    sudo service nginx stop

    開始
    sudo service nginx start

    再起動
    sudo service nginx configtest
#### MacOS(Homebrew)
    /usr/local/etc/nginx/nginx.conf

    終了
    nginx -s stop

    再起動
    nginx -s reload

    localhost:8080/,,,,,,

## Backup

#### full backup

    3.0 以前
    // > sudo service mongodb stop
    // > sudo mongodump --dbpath /var/lib/mongo


    3.0以降
    > sudo mongodump --authenticationDatabase admin -u oda -p zz0101
#### full restore
    3.0 以前
    // > sudo service mongodb stop
    // > sudo mongorestore --dbpath /var/lib/mongo dump

    3.0以降

    フルリストアは不明。
#### buckup
    3.0以降
    > mongodump --authenticationDatabase **AUTH-DBNAME** -u **DBUSER** -p **DBPASS** -d **TARGET-DBNAME** -o "**OUTPUT-PATH**"
#### restore
    3.0以降

    > use **TARGET-DBNAME**
    > db.createUser({user:"**DBUSER**", pwd:"**DBPASS**", roles:[ "readWrite", "dbOwner" ]})

    で対象ユーザ作成後,

    > mongorestore --authenticationDatabase **AUTH-DBNAME** -u **DBUSER** -p **DBPASS** -d **TARGET-DBNAME** "**OUTPUT-PATH**"
#### Zip
    zip -r dump.zip dump
#### SCP
     scp dump.zip XXX.XXX.XXX.XXX:/path/to/dist
#### sudo
    pathを引き継ぐ。(digital ocean, etc..)

    Defaults    env_reset
    #Defaults   secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
    Defaults    env_keep += "PATH"
#### mail
```bash
$ sudo saslpasswd2 -u seventh-code.com -c oda
```
## Mecab ユーザ辞書
##### mac(homebrew)
```bash
$ /usr/local/Cellar/mecab/0.996/libexec/mecab/mecab-dict-index  -d /usr/local/lib/mecab/dic/ipadic -u /usr/local/lib/mecab/dic/userdic/music.dic -f utf-8 -t utf-8 mecab_music_dic.csv
$ /usr/local/etc/mecabrc
```
##### ubuntu(apt-get)
```bash
$ /usr/lib/mecab/mecab-dict-index                               -d /usr/share/mecab/dic/ipadic     -u /var/lib/mecab/dic/music.dic               -f utf-8 -t utf-8 mecab_music_dic.csv
$ sudo nano /etc/mecabrc
```
#### GMail
    セキュリティ

    https://myaccount.google.com/u/1/security

    安全性の低いアプリの許可: 有効とする
#### Let's Encrypt（HTTPSの認証)
    ここ見ろ

    https://letsencrypt.jp/usage/

    まず、certbot-autoってのをインストール
```bash
$ cd ~
$ mkdir certbot
$ cd certbot
$ wget https://dl.eff.org/certbot-auto
$ chmod a+x certbot-auto
$ sudo service nginx stop
$ ./certbot-auto
        エラー出たら
$ ./certbot-auto certonly
$ sudo service nginx start
```
    実行
```bash
$ cd ~
$ cd cartbot
$ sudo service nginx stop
$ ./certbot-auto certonly --no-self-upgrade -n --standalone  --agree-tos --email oda.mikio@gmail.com -d www.aaa.com
$ sudo service nginx start
```
    -nginxってのが使える？使うと楽？
#### 複数
```bash
$ cd ~
$ cd certbot
$ sudo ./certbot-auto certonly --nginx -d DOMAIN.co.jp -d www.DOMAIN.co.jp
```
#### 更新
```bash
$ cd ~
$ cd certbot
$ sudo service nginx stop
$ sudo ./certbot-auto renew -q --no-self-upgrade
$ sudo service nginx start
```
    証明書の取得時に使用したオプションは

    /etc/letsencrypt/renewal/${DOMAIN}.conf

## openssl

    作るもの

    秘密鍵
    公開鍵
    証明書

#### 秘密鍵
```bash
$ openssl genrsa -aes128 1024 > server.key
```
#### 公開鍵
```bash
$ openssl req -new -key server.key > server.csr
```
#### 証明書
```bash
$ openssl x509 -in server.csr -days 365 -req -signkey server.key > server.crt
```
#### npmのパーミッション
    ”sudo npm install xxx"だとうまくいかない場合は、npmのパーミッション変えて"npm install xxx"。

    https://docs.npmjs.com/getting-started/fixing-npm-permissions
###### ホームディレクトリにnpmディレクトリ作る。
```bash
$ mkdir ~/.npm-global
```
###### npmの設定
```bash
$ npm config set prefix '~/.npm-global'
```
###### パス追加（~/.profile）
```bash
$ export PATH=~/.npm-global/bin:$PATH
$ source ~/.profile
```
#### 監査
###### npmモジュール監査
```bash
$ npm audit
```
#### npmモジュールバージョン
##### npmモジュールバージョン
```bash
$ npm install -g npm-check-updates
 ```
#####  確認
```bash
$ ncu
 ```
#####  更新
```bash
$ ncu -u
 ```
##### メジャーバージョン固定
```bash
$ ncu --semverLevel major
 ```
