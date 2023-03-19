# chatGPT-Anywhere

基于 [api2d-js](https://github.com/easychen/api2d-js) 和 [vue3-beautiful-chat](https://github.com/Sitronik/vue3-beautiful-chat) 制作的chatGPT聊天工具。可以用于快速部署一个专属自己的chatGPT聊天页面。

## 快速开始
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

使用OpenAI官方api的时候，请选择请求域名为\`https://api.openai.com\`

### 我在OpenAI不提供服务的地区，我该怎么办？

你可以选择一些非OpenAI官方提供的代理服务

比如[API2D](https://api2d.com/r/186772) （价格比OpenAI的高一些）  
这里建议使用邮箱进行注册，因为Github注册总是卡住。
注册后，可以参考下面的图片获取key  
![create-key](src/assets/images/create-key.jpg)    
使用API2D的服务时候，请选择请求域名为\`https://openai.api2d.net\`

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