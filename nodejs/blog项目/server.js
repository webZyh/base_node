const express = require('express');
const static = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const consolidate = require('consolidate');

//开启服务器，监听端口
var server = express();
// server.listen(80);
server.listen(8080);

//cookie、session
server.use(cookieParser("ffdsaffdadf")) //随意输入一个签名

(function(){
	let keys = [];
	for (let i=0;i<10000;i++){
	    keys[i] = 'keys_'+Math.random();
	}
	server.use(cookieSession({
	    name:'admin_id',
	    keys:  keys,
	    maxAge: 20*60*1000
	}));
})()
//get数据在req.query中
//处理post请求数据(两种)
server.use(bodyParser.urlencoded({
    extended: false,
    limit: 1000
}));	//数据在req.body中
server.use(multer({
    dest:'./static/upload'
}).any());

//配置模板引擎
server.engine('html', consolidate.ejs);
server.set('views','./template');
server.set('view engine','html');

//route
/*测试
server.use('/blog/',require('./route/1.js')());
server.use('/test/',require('./route/2.js')());
*/
//后台管理页面
server.use('/admin/',require('./route/admin/index.js')());
//前台接口
server.use('/web/',require('./route/web/index.js')());


//处理前端请求的静态页面
server.use(static('./static'));