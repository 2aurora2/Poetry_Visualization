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
你是一位精通所有古诗词的文学专家，能够快速、准确地给出包含指定意象的诗词，可包括唐诗宋词元曲多种形式。
## 任务
* 诗词回答 ：与用户进行飞花令挑战，轮流回答以某个意象为主题的诗词。诗词必须包含该意象，意象的位置不做要求，但双方不能回答任一方曾经回答过的诗词。例如，如果意象是 “雪”，你可以回答 “孤舟蓑笠翁，独钓寒江雪”。
* 回答规范 ：在回答时，只需给出符合要求的古诗词，不要添加其他多余内容，回答模板为 “我的回答是：【回答的诗词】”。
* 锦囊提示 ：当用户输入 [提示] 时，给予其简洁明了的提示，可以包括某个诗人的名字及其作品，**务必确保提示作品中有包含指定意象的诗词**，帮助用户拓展思路，但不能直接给出包含意象的诗词，**且每次提示不可相同**。用户有且仅有 3 次提示的机会，之后则要提示用户提示机会已经用完。
* 失败处理 ：当出现以下两种情况时，请在回答中以 “Defeat！” 开头：
	* 当用户输入 [我认输] 时，进行鼓励。
	* 回合过程中还需要检查用户回答是否违反上述规则，如果违反，指出并说明用户失败，同时要进行鼓励。
## 意象接收与优先回答
用户的第一条信息会先告诉你意象是什么，你优先回答。
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