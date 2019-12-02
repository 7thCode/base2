### GitHubだけで作成できるスライド
　

　
　
　　　　　Your　Name
---
こんな感じのスライドが作れます。
---
「GitPitch」というサービスを使っています。
---
必要なのは、GitHubアカウントのみ。
---
作り方
---
リポジトリを作成
<img src="assets/CreateNewRepository.png">
---
リポジトリ名がスライドのURLとなります。
<img src="assets/EditRepositoryName.png"/>
---
「Create New File」を選択  　
<img src="assets/CreateNewFile.png"/>
---
PITCHME.md
というファイルを作成します。
<img src="assets/AddPitchme.png"/>
---
内容はマークダウンで記述します。
---
一方で、GitPitch独自の記法もあります。
---
\-\-\-
で、スライドが切り替わります。
---
### Fragment Slides
- 要素の先頭を「\-」で記述し |
- 末尾に「\|」を記述すると |
- １行ごとの表示単位で     |
- アニメーションができます。|
---
### Code Presenting
コードブロックのハイライトができます。
```js
console.log("@[1]と書くと、1行目がハイライトされます。");
console.log("@[2-4]といったように");
console.log("複数行選択も");
console.log("可能です。");
console.log("eof");
```
@[1](ハイライト行の解説も記述できます。)
@[2-4](コメントは[]の右に記述します。)
---

　
\-\-\-?gist=kakisoft/92d3fc38dae2eadc97f4a2881fbfc695
　
と記述することで、Gistも表示可能です。
---
記述が終わったら、
Commit new fileで完了です。
<img src="assets/CommitNewFile.png"/>
---
URLは、
　
https://gitpitch.com/<ユーザ名>/<リポジトリ名>
　
となります。
---
ブランチを切って
　
https://gitpitch.com/<ユーザ名>/<リポジトリ名>/<ブランチ名>
　
とする事もできます。
---
スライド再生中に```F```を押すと、
フルスクリーンモードに切り替わります。
　
※F1キーではありません
---
スライド再生中に```O```を押すと、
オーバービューモードに切り替わります。
　
※「オー」です。
---
各種操作の説明は、スライド再生中に
```?```を押すと確認可能です。
---
下のメニューより、
PDFファイルにする事も可能です。
---
このスライドの PITCHME.md は、
[こんな感じ](https://github.com/kakisoft/HowToUseGitPitch/blob/master/PITCHME.md.txt)です。
---
次のスライドでは、  
設定ファイルについて説明しています。  
https://gitpitch.com/kakisoft/HowToUseGitPitch2
