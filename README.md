# lgoo

To install dependencies:

```bash
bun install
npm install prettier eslint-config-prettier eslint-plugin-prettier --save-dev
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.22. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# offs

### 添加 offs 全局组件

//pages.json中配置

```json
"easycom" : {
"autoscan": true,
"custom": {
"^me-(.*)-(.*)":
"@offs/uni/components/$2/$1.vue"
}
}
```

//pages.json中配置

```json
"easycom" : {
"autoscan": true,
"custom": {
"^me-(.*)-(.*)":
"@offs/uni/components/$2/$1.vue"
}
}
vite.config.js中配置
```ts
resolve: {
alias: {
'@offs/uni': path.resolve(__dirname, 'node_modules/@offs/uni/src') // 指定库的路径
},
},
```

