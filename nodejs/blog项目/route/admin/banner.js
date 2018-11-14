const express = require('express');
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
        let act = req.query.act;
        console.log(act);
        switch (act){
            case 'mod':
                db.query(`SELECT * FROM banner_table WHERE ID=${req.query.id}`,(err,data)=>{
                    if (err){
                        console.log(err);
                        res.status(500).send('database error').end();
                    }else if(data.length==0){
                        res.status(404).send('data not found').end();
                    }else {
                        //在查询一遍banners
                        db.query('SELECT * FROM banner_table', (err, banners) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send('database error').end()
                            } else {
                                res.render('admin/banners.ejs', {mod_data:data[0] ,banners});
                            }
                        })
                    }
                })
                break;
            case 'del':
                db.query(`DELETE FROM banner_table WHERE ID=${req.query.id}`,(err,data)=>{
                    if (err){
                        console.log(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.redirect('/admin/banner');
                    }
                });
                break;
            default:
                //查询数据库，渲染banners页面
                db.query('SELECT * FROM banner_table',(err,data)=>{
                    if (err){
                        console.log(err);
                        res.status(500).send('database error').end()
                    }else{
                        if (data.length==0){
                            res.status(400).send('not find data').end();
                        }else{
                            res.render('admin/banners.ejs',{banners:data});
                        }
                    }
                });
                break;
        }

    })
    router.post('/',(req,res)=>{
        //接收参数
        let title = req.body.title;
        let desc = req.body.desc;
        let href = req.body.href;

        if (req.body.mod_id){   //修改
            db.query(`UPDATE banner_table SET title=${title}, description=${desc}, href=${href} `,(err,data)=>{
                if (err){
                    console.log(err);
                    res.status(500).send('database error').end()
                }else{
                    res.redirect('/admin/banner');
                }
            })
        }else{      //添加
            db.query(`INSERT INTO banner_table (title,description,href) VALUE (${title},${desc},${href})`,(err,data)=>{
                if (err){
                    console.log(err);
                    res.status(500).send('database error').end()
                }else{
                    //提交成功后重定向到banners页面
                    res.redirect('/admin/banner');
                }
            })
        }

    })
    return router;
}