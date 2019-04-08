const express = require('express')
const static = require('express-static')
const bodyParser = require('body-parser')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const ejs = require('ejs')

const server = express();

//1、处理post 数据
server.use(bodyParser.urlencoded({'extended':false}));
server.use(multer('./www/upload/').any());

//2、处理cookie
server.use(cookieParser('fdsf'));
//3、处理session
let arr = [];
for(var i = 0;i<10000;i++){
	arr[i]='key_'+Math.random();
}
server.use(cookieSession({
	name:'zzz',
	keys: arr,
	maxAge: 20*3600*1000
}))


server.use('/',(req,res,next)=>{
	res.cookie('user','aaa',{path:'/',maxAge:3600*1000,signed:true})
	console.log(req.query, req.body, req.files, req.signedCookies, req.session)
	res.send('ok')
})

//4、访问静态文件
server.use(static('./view'));

server.listen(8080);