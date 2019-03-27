const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const server = express();

//cookie
server.use(cookieParser('fdsfsfadfasfdas'));

var arr = [];
for(var i = 0;i<10000;i++){
    arr[i] = 'keys_'+Math.random();
}
server.use(cookieSession({
    name:'zyh',
    keys: arr,
    maxAge: 2*3600*1000
}));

server.use('/',(req,res)=>{
    //设置cookie
    //res.cookie('user','aaa',{path:'/',maxAge:3600*1000,signed:true})
    //读取cookie
    //console.log(req.cookies);
    //console.log(req.signedCookies);
    //删除cookie
    //res.clearCookie('user');

    //设置一个session并读取session
    /*if(req.session['count']==null){
        req.session['count'] = 1;
    }else{
        req.session['count']++;
    }
    console.log(req.session);*/

    //删除session
    delete req.session['zyh'];
    res.send('ok')
})
server.listen(8081);