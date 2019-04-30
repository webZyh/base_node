const express = require("express");
const mysql = require('mysql');
const pathLib = require('path');    //node内置模块
const fs = require('fs');


const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'learn'
})
module.exports = function(){
    let router = express.Router();
    //添加、修改
    router.post('/',(req,res)=>{
        //接收参数
        let title = req.body.title;
        let description = req.body.desc;
        let mod_id = req.body.mod_id;

        //判断是否上传（添加或修改时）了头像，上传了就有newFileName，否则就没有
        if(req.files){
            console.log(req.files);
            var suffix = pathLib.parse(req.files[0].originalname).ext;  //拿到.jpg后缀

            //path:包括路径的文件名
            var oldPath = req.files[0].path;   //没有后缀文件路径名
            var newPath = oldPath + suffix;   //拼接好的文件路径

            //filename:文件名
            var newFileName = req.files[0].filename+suffix; //需要写入数据库的文件名
            //显示时候的路径问题？
            //绝对路径和相对路径的区别？
        }else{
            var newFileName = null      //如果没有传，设置为null
        }

        console.log(newFileName);

        if(newFileName){    //上传了头像（包括添加和修改）
            fs.rename(oldPath,newPath,(err)=> {
                if (err) {
                    console.log(err);
                    res.status(500).send('file operation error ').end();
                } else {
                    if(mod_id){     //修改
                        //修改了头像
                        //先删除要修改的老的头像
                        db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${mod_id}`,(err,data)=> {
                            if (err) {
                                console.log(err);
                                res.status(500).send('database error').end();
                            } else {
                                if (data.length == 0) {
                                    res.status(400).send('not found data').end();
                                } else {
                                    fs.unlink('static/upload/' + data[0].src , (err) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).send('file operation error ').end();
                                        } else {
                                            //删除成功后,再修改
                                            db.query(`UPDATE custom_evaluation_table SET title='${title}', description='${description}', src='${newFileName}' WHERE ID=${mod_id}`,(err)=>{
                                                if (err){
                                                    console.log(err);
                                                    res.status(500).send('database error').end();
                                                }else{
                                                    res.redirect('/admin/custom');
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }else{      //添加
                        db.query(`INSERT INTO custom_evaluation_table (title,description,src) VALUE ("${title}","${description}","${newFileName}")`,(err, data)=>{
                            if(err){
                                console.log(err);
                                res.status(500).send('database error').end();
                            }else{
                                res.redirect('/admin/custom');
                            }
                        })
                    }
                }
            })
        }else{  //没有修改头像
            if(mod_id){     //修改
                //直接修改标题和描述
                db.query(`UPDATE custom_evaluation_table SET title=${title}, description=${description} WHERE ID=${mod_id}`,(err)=>{
                    if (err){
                        console.log(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.redirect('/admin/custom');
                    }
                })
            }
        }
    });
    //查询、删除、修改
    router.get('/',(req,res)=>{
        let act = req.query.act;
        switch (act){
            case 'mod':
                //查询选出需要修改的一条数据
                db.query(`SELECT * FROM custom_evaluation_table WHERE ID='${req.query.id}'`,(err, data)=>{
                    if (err) {
                        console.log(err);
                        res.status(500).send('database error').end();
                    } else {
                        if (data.length == 0) {
                            res.status(400).send('not found data').end();
                        } else {
                            //再查询一遍customs，用于table渲染
                            db.query(`SELECT * FROM custom_evaluation_table`,(err, customs)=>{
                                if (err){
                                    console.log(err);
                                    res.status(500).send('database error').end();
                                }else{
                                    res.render('admin/custom.ejs',{mod_data: data[0] , customs});
                                }
                            })
                        }
                    }
                });
                break;
            case 'del':
                //删除
                //先选出要删除的一条数据，删除unload文件夹里的图片，成功后，再删除这条数据
                db.query(`SELECT * FROM custom_evaluation_table WHERE ID='${req.query.id}'`,(err,data)=> {
                    if (err) {
                        console.log(err);
                        res.status(500).send('database error').end();
                    } else {
                        if (data.length == 0) {
                            res.status(400).send('not found data').end();
                        } else {
                            //fs.unlink删除文件，，此处是以server.js的相对路径
                            fs.unlink('static/upload/' + data[0].src , (err) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('file operation error ').end();
                                } else {
                                    db.query(`DELETE FROM custom_evaluation_table WHERE ID='${req.query.id}'`, (err, data) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).send('database error').end();
                                        } else {
                                            res.redirect('/admin/custom')
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
                break;
            default:
                //查询
                db.query('SELECT * FROM custom_evaluation_table',(err,data)=>{
                    if (err){
                        console.log(err);
                        res.status(500).send('database error').end();
                    }else{
                        if(data.length == 0){
                            res.status(400).send('not found data').end();
                        }else{
                            res.render('admin/custom.ejs',{customs: data});

                            // res.render('admin/custom.ejs',{data});
                        }
                    }
                })
                break;
        }


    });

    return router;
}