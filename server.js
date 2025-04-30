const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// 用户数据（硬编码，实际项目中应使用数据库）
const users = {
    210809071142: '123456', // 用户名: 密码
};

// 中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 登录处理
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 验证用户名和密码
    if (users[username] && users[username] === password) {
        res.redirect("/welcome.html");
    } else {
        res.send('登录失败：用户名或密码错误！<a href="/">返回登录页面</a>');
    }
});

// 启动服务
app.listen(PORT, () => {
    console.log(`服务器已启动：http://localhost:${PORT}`);
});