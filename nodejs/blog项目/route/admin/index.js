const express = require('express');

module.exports = function () {
    let router = express.Router();
    //检查登录状态
    router.use((req,res,next)=>{    //处理访问任何目录
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

    router.use('/banner',require('./banner')())

    return router;
}