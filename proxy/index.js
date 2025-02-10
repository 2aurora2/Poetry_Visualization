require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
var cookieParser = require('cookie-parser');

const app = express();

const ACCESS_POINT = process.env.VITE_LLM_ACCESS_POINT;
const API_KEY = process.env.VITE_LLM_API_KEY;
const URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

const PROMPT = `
## 角色
你是一位精通所有古诗词的文学专家，能够快速、准确地给出包含指定意象的诗词，涵盖唐诗、宋词、元曲等多种形式。
## 任务
### 诗词回答
* 与用户进行飞花令挑战，轮流回答以某个意象为主题的诗词。诗词必须包含该意象，意象位置不限，但不能重复之前已回答过的诗词。
* 回答模板为：“我的回答是：【回答的诗词】”，仅需提供符合要求的古诗词，不要添加其他内容。
### 锦囊提示
* 当用户输入 [提示] 时，提供简洁明了的提示，包括某个诗人的名字及其作品，**务必确保提示作品中有包含指定意象字的诗词**，最好是常见的有名的诗词作品，帮助用户拓展思路，但不能直接给出包含意象的诗词。
* 每次提示不可相同，用户仅有 3 次提示机会，之后如果用户再索要提示则告知其提示机会已用完。
### 用户挑战失败处理
* 当用户输入 [我认输] 或者回答违反规则（如重复诗词等）时，告知用户失败并提示用户可以重新抽取意象进行挑战。
### 用户挑战成功处理
* 当你无法继续回答符合要求的诗词时，恭喜用户挑战成功。
### 意象接收与首次回复
* 用户的第一条信息会告知意象，需重复确认并记住该意象，然后告知用户本轮挑战开始，使用模板：“欢迎来到飞花令挑战，本轮挑战意象为<xxx>，请您优先回答。”，之后等待用户首先开始回答。
## 注意事项
* 必须严格遵守上述规则，不得违反，不要添加无关内容，也不要回答用户无关上述游戏的问题。若用户提及与本游戏无关的内容，直接回答 “我无法理解您说的话，让我们继续挑战吧！”。
* **务必不能编造诗词或意象**。
* 一旦用户失败，则不能继续游戏，无论用户输入什么内容，只需告知其失败，并提示其可以点击重新挑战按钮进入新的一轮游戏。
`

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());  // 配置跨域

app.get('/', (req, res) => {
    res.send('Poetry Visualization LLM Server!');
});

app.post('/chat', (req, res) => {
    // 验证请求体是否存在 messages 字段
    if (!req.body || !req.body.messages) {
        return res.status(400).send({
            code: 400,
            message: "请求体中缺少 'messages' 字段",
            data: null
        });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages)) {
        return res.status(400).send({
            code: 400,
            message: "messages字段内容必须为数组",
            data: null
        });
    }

    const processedMessages = [...messages];
    processedMessages.unshift({
        "role": "system",
        "content": PROMPT
    });

    axios.post(URL, {
        model: ACCESS_POINT,
        messages: processedMessages,
        stream: true,
        temperature: 0.8,
    }, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`
        },
    })
        .then(response => {
            let data = response.data.split('\n').filter(line => line.trim() !== '' && line !== 'data: [DONE]');
            const outputs = data.map(line => {
                try {
                    const parsed = JSON.parse(line.replace('data: ', ''));
                    return parsed.choices[0].delta.content || '';
                } catch (e) {
                    console.error('解析错误:', e);
                    return '';
                }
            });
            const output = outputs.join('');

            const updatedMessages = [...messages, { "role": "assistant", "content": output }];

            res.send({
                code: 200,
                message: "success",
                data: updatedMessages
            });
        })
        .catch(error => {
            console.error('API请求失败:', error);
            res.status(500).send({
                code: 500,
                message: "服务器内部错误",
                data: [...messages, { "role": "assistant", "content:": "请求失败，请重试" }]
            });
        });
});

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});