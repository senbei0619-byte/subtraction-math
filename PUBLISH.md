# GitHub Pages で公開する手順 🚀

以下は簡単な手順です。

## 1. リモートリポジトリを作る
- GitHub にログインして新しいリポジトリを作成（例: `hiku-zan`）。

## 2. ローカルを準備してプッシュ
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

## 3. GitHub Pages を有効化
1. GitHub のリポジトリページへ移動
2. **Settings > Pages** を開く
3. **Branch** を `main`（または `gh-pages`）に設定、`/(root)` を選択
4. 保存すると数分で公開されます（URL が表示されます）

※ CLI を使う場合（gh コマンド）:
```bash
gh repo create <repo> --public --source=. --push
# その後 GitHub の Settings で Pages を設定するか、gh API を使って設定
```

## 追加のヒント
- カスタムドメインを使う場合は `CNAME` ファイルを追加してください。
- 変更を加えたら `main` ブランチに push するだけで自動反映されます（Page の設定による）。
