const express = require('express');
const expressStatic = require('express-static');

let server = express();
server.listen(8080);

//使用对象存储数据，模拟数据库功能
let users = {
    'zyh':'123',
    'zhangsan':'123456'
};

//监听前端访问接口
server.get('/login',(req,res)=>{
    //处理从前端传递过来的数据
    console.log(req.query);
    let user = req.query['user'];
    let psd = req.query['psd'];

    //判断用户是否存在
    if(users[user] == null){
        res.send("{'ok':false,'msg':'用户不存在'}");
    }else{
        if (users[user] !== psd ){
            res.send("{'ok':false,'msg':'密码错误'}")
        }else{
            res.send("{'ok':true,'msg':'登录成功'}")
        }
    }
})

//监听前端访问静态页面,会在www目录下查找前端访问的静态页面
server.use(expressStatic('./www'));