# chatGPT-Anywhere

基于 [api2d-js](https://github.com/easychen/api2d-js) 和 [vue3-beautiful-chat](https://github.com/Sitronik/vue3-beautiful-chat) 制作的chatGPT网页聊天工具。可以用于快速部署一个专属自己的chatGPT聊天页面。

## 在线速览
访问[https://yilihjy.github.io/chatgpt-anywhere/](https://yilihjy.github.io/chatgpt-anywhere/) 立刻体验

## 已有特性
- 网页聊天应用，能够和chatGPT进行文字聊天；
- 支持切换openAI的官方接口和第三方接口，方便不同网络环境使用；
- 能够保存每次会话的记录为json文件，方便记录下有趣的对话内容；
- 支持上传保存的json文件，随时恢复上一次和chatGPT的对话。
- 快速利用Github Pages部署属于自己的专属聊天页面

## 利用Github Pages快速部署指南

Fork本项目代码到你自己的GitHub账号  
按钮在右上角  
![fork-button](/src/assets/images/fork.png)  
Fork完成后，点击你仓库Setting按钮  
![setting-button](/src/assets/images/setting.png)  
选择侧边的pages页签，按红框中的内容进行设置，点击save
![setting-button](/src/assets/images/pages.png)  
等待GitHub给你生成你的pages，你的专属页面就部署好了

## 本地开发
需要`node 18`  
使用`pnpm`作为包管理器

### 安装依赖
```bash
pnpm install --registry=https://registry.npmmirror.com
```

### 运行
```bash
pnpm dev
```

### 构建
```bash
pnpm build
```


## 配置说明

### 如何获取key

可以从OpenAI 的官网获取你的key
https://platform.openai.com/account/api-keys

使用OpenAI官方api的时候，请选择请求域名为`https://api.openai.com`

### 我在OpenAI不提供服务的地区，我该怎么办？

你可以选择一些非OpenAI官方提供的代理服务

比如[API2D](https://api2d.com/r/186772) （价格比OpenAI的高一些）  
这里建议使用邮箱进行注册，因为Github注册总是卡住。
注册后，可以参考下面的图片获取key  
![create-key](src/assets/images/create-key.jpg)    
使用API2D的服务时候，请选择请求域名为`https://openai.api2d.net`

#### 当然，你也可以在请求域名的输入框中输入任何想使用的域名

### 模型选择
推荐选择gpt-3.5-turbo，理由是便宜  
想了解更多的话，可以参考文档：https://platform.openai.com/docs/api-reference/chat/create

### 默认引导
这里设置的文本，会被自动添加到每个会话的开始
```json
{
    "role": "system",
    "content": "You are a helpful assistant."
}
```

## 开始聊天
完成配置后，点击页面右下角的按钮  
![start-chat](/src/assets/images/start-chat.png)  
开始和chatGPT愉快的聊天吧。

### 请遵守并尊重您所在地区的法律规定，维护社会公序良俗


## 开源协议
[MIT](/LICENSE)