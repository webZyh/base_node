const express = require('express');
module.exports=function () {
    let router = express.Router();
    router.get('/1.html',(req,res)=>{
        //res.send('我是博客').end();
        res.render('./1.ejs',{a:1,b:5});
    })
    router.get('/2.html',(req,res)=>{
        res.send('我是博客2').end();
    })

    return router
}