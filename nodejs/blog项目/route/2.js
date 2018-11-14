const express = require('express');
module.exports = function () {
    let router = express.Router();
    router.get('/1.html',(req,res)=>{
        res.send('我是测试1').end();
    })
    router.get('/2.html',(req,res)=>{
        res.send('我是测试2').end();
    })
    return router;
}