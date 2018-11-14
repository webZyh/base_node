const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');  //解析post数据
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const ejs = require('ejs');
const jade = require('jade');

let server = express();
server.listen(8080);

//1.解析cookie
server.use(cookieParser('fajakgjajgajjglkajga'));

//2.使用session
var arr = [];
for (var i = 0; i < 10000; i++) {
    arr.push('keys_' + Math.random())
}
server.use(cookieSession({name: 'zyh', keys: arr, maxAge: 20 * 3600 * 1000}))
//3.post数据
server.use(bodyParser.urlencoded({extended: false}));

//用户请求
server.use('/', function (req, res, next) {
    console.log(req.query, req.body, req.cookies, req.session)
});
//4.返回前端请求的静态页面
server.use(static('./www'));