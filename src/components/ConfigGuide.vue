<template>
    <div v-html="content"></div>
    <div v-html="startChat"></div>
</template>

<script setup lang="ts">
import { useMarkAndHljs } from '../hooks/useMarkAndHljs';
import startChatImg from '../assets/images/start-chat.png';
import createKey from '../assets/images/create-key.jpg';
const { markdonwText } = useMarkAndHljs();
// data:image/png;base64,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
const content = markdonwText(`
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
![create-key](${createKey})    
使用API2D的服务时候，请选择请求域名为\`https://openai.api2d.net\`

#### 当然，你也可以在请求域名的输入框中输入任何想使用的域名

### 模型选择
推荐选择gpt-3.5-turbo，理由是便宜  
想了解更多的话，可以参考文档：https://platform.openai.com/docs/api-reference/chat/create

### 默认引导
这里设置的文本，会被自动添加到每个会话的开始
\`\`\`json
{
    "role": "system",
    "content": "You are a helpful assistant."
}
\`\`\`
`);

const startChat = markdonwText(`
## 开始聊天
完成配置后，点击页面右下角的按钮  
![start-chat](${startChatImg})  
开始和chatGPT愉快的聊天吧。

## 请遵守并尊重您所在地区的法律规定，维护社会公序良俗
`);
</script>

