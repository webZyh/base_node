//http
//fs
//querystring
//url

const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url')

//定义接口
//	登录/user?act='login'&user=''&psd=''
//	注册/user?act='reg'&user=''&psd=''
let users = {};	//用来存放登录注册的数据,格式：{'zyh':'123','zhangsan':'234'}
let server = http.createServer((req,res)=>{
	//req.url => /index.html
	let str = '';
	req.on('data',(data)=>{
		str += data;
	});
	req.on('end',()=>{
        const obj = urlLib.parse(req.url,true);
        const url = obj.pathname;
        const GET = obj.query;
		const POST = querystring.parse(str);

		//区分接口还是文件
		if (url == '/user'){
			switch (GET.act){
				case 'reg':
					//检查用户名是否已经存在
					if (users[GET.user]){
						res.write('{"ok":false,"msg":"此用户已经存在"}')
					}else{
						//插入users
						users[GET.user] = GET.psd;
						res.write('{"ok":true,"msg":"注册成功"}')
					}
					break;
				case 'login':
					//检查用户名是否已经存在
					if (users[GET.user]==null){
                        res.write('{"ok":false,"msg":"用户不存在"}')
					}else{
						if(users[GET.user]!==GET.psd){
							res.write('{"ok":false,"msg":"用户名或密码不正确"}')
						}else{
                            res.write('{"ok":true,"msg":"登录成功"}')
						}
					}
					break;
				default:
					res.write('{"ok":false,"msg":"未知的act"}')
			}
			res.end();
		}else{
            //文件处理
            let file_name = './www'+ url;
            fs.readFile(file_name,(err,data)=>{
                if (err){
                    res.write('404')
                }else{
                    res.write(data)
                }
                res.end();
            })
		}

	})

})

server.listen(8080);
