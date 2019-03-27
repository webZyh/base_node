const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const urlLib = require('url')
let users = {};
const server = http.createServer(function(req,res){
	let str = '';
	req.on('data',function(data){
		str+=data;
	})
	req.on('end',function(){
		var obj= urlLib.parse(req.url,true);
		const url = obj.pathname;
		//GET
		const GET = obj.query;
		//POST
		const POST = querystring.parse(str);

		if(url == '/user'){	//读取接口
			switch(GET.act){
				case 'reg':
					if(users[GET.user]){
						res.write("{'ok':false,'msg':'用户名已注册'}")
					}else{
						users[GET.user] = GET.pass;
						res.write("{'ok':true,'msg':'注册成功'}")
					}
					break;
				case 'login':
					//1、检查用户名是否存在
					if(users[GET.user] == null){
						res.write('{"ok":false,"msg":"用户不存在"}')
					}else{
						if(users[GET.user]!=GET.pass){//2、检查密码是否错误
							res.write('{"ok":false,"msg":"密码错误"}')
						}else{
							res.write('{"ok":true,"msg":"登录成功"}')
						}
					}
					break;
				default:
					res.write('{"ok":false,"msg":"未知的act"}')
			}
			res.end();
		}else{		//读取文件
			var file_name = './www'+url;
			fs.readFile(file_name,function (err, data){
				if(err){
					res.write('404');
				}else{
					res.write(data);
				}
				res.end();
			})
		}
	})
})

server.listen(8080);