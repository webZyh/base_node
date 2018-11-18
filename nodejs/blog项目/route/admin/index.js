const express = require('express');
const urlLib = require('url');

module.exports = function () {
    let router = express.Router();
    //检查登录状态
    router.use((req,res,next)=>{    //处理访问任何目录
        //阻止 favicon.ico 的请求
        /*const obj = urlLib.parse(req.url, true);
        const pathname = obj.pathname;*/

        if (!req.session['admin_id'] && req.url!='/login'){ //没有登录
            res.redirect('/admin/login')
        }else{
            next();
        }
    });
    router.use('/login',require('./login')());

    router.get('/',(req,res)=>{
        res.render('admin/index.ejs',{})
    });
    //banner路由
    router.use('/banner',require('./banner')());
    //用户评价路由
    router.use('/custom',require('./custom')());

    return router;
}