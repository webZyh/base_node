const express = require('express');
const common = require('../../libs/common');
const mysql = require('mysql');

//连接数据库
let db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'learn'
});
module.exports=function () {
    let router = express.Router();
    router.get('/',(req,res)=>{
        res.render('admin/login.ejs',{});
    })
    router.post('/',(req,res)=>{
        let username = req.body.username;
        let password = common.md5(req.body.password+common.MD5_SUFFIX);
        //console.log(password);

        db.query(`SELECT * FROM admin_table WHERE username='${username}'`,(err,data)=>{
            if (err){
                console.log(err);
                res.status(500).send('database error').end();
            }else{
                if (data.length == 0){
                    res.status(400).send('no this admin').end();
                }else{
                    if (data[0].password==password){
                        //成功
                        req.session['admin_id'] =  data[0].ID;
                        res.redirect('/admin');
                    }else{
                        res.status(400).send('the password is incorrect').end();
                    }
                }
            }
        })
    })

    return router;
}