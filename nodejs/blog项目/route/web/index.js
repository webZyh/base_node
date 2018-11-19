const express = require('express');
const mysql = require('mysql');

//连接数据库
const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'learn'
});

module.exports = function () {
    let router = express.Router();

    router.get('/get_banners',(req,res)=>{
        db.query(`SELECT * FROM banner_table`,(err,data)=>{
            if (err){
                console.log(err);
                res.status(500).send('database error').end();
            }else{
                res.send(data).end();
            }
        })
    });

    router.get('/get_customs',(req,res)=>{
        db.query(`SELECT * FROM custom_evaluation_table`,(err,data)=>{
            if (err){
                console.log(err);
                res.status(500).send('database error').end();
            }else{
                res.send(data).end();
            }
        })
    });

    return router;
}