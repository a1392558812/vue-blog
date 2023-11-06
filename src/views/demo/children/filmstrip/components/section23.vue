<template>
    <section>
        <h2>部署流程</h2>
        <div data-markdown>{{ htmlStr }}</div>
        <ol>
            <li class="github-action">指定了当代码推送到 main 分支时触发部署动作。</li>
            <li class="github-action">在 build-and-deploy 作业中，使用 actions/checkout 动作来检出代码库。接着，使用 actions/setup-node 动作来设置 Node.js 环境，并通过 npm install 安装项目的依赖。</li>
            <li class="github-action">该配置文件还使用了内建变量 $secrets.GITHUB_TOKEN' 来获取 GitHub 的访问令牌，该令牌用于执行部署操作。你不需要手动设置这个令牌，GitHub Actions 会自动创建并使用它。</li>
            <li class="github-action">使用 npm run build 来构建 Vue 项目，并生成静态文件输出到 ./dist 目录。</li>
            <li class="github-action">使用了 peaceiris/actions-gh-pages 动作来将构建生成的文件推送到 GitHub Pages 上。它会自动将 ./dist 目录中的内容发布到 GitHub Pages。</li>
            <li class="github-action">将上述配置文件保存为 .github/workflows/deploy.yml，并将其推送到你的仓库中。GitHub Actions 将在每次推送到 main 分支时自动运行部署流程，你可以在 Actions 选项卡中查看部署的过程和状态。</li>
        </ol>
    </section>
</template>
<script setup>
const htmlStr = '```html []\n' +
`
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 更改为你的默认分支

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 14  # 更改为你的 Node.js 版本

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: $${'{{ secrets.GITHUB_TOKEN }}'}
          publish_dir: ./dist  # 更改为你的构建输出目录
` + '\n```'

</script>

<style scoped lang="scss">
    .github-action {
      font-size: 12px;
    }
</style>
