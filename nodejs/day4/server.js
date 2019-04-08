const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');  //解析post数据
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const ejs = require('ejs');
const multer = require('multer');
const mysql = require("mysql")

//自定义模块
const common = require('./libs/common');

//连接数据库     一次性连接
const db = mysql.createPool({host:'localhost',user:'root',password:'123456',database:'blog'});

let server = express();
server.listen(8080);

//1.解析cookie
server.use(cookieParser('fajakgjajgajjglkajga'));

//2.使用session
var arr = [];
for (var i = 0; i < 10000; i++) {
    arr.push('keys_' + Math.random())
}
server.use(cookieSession({name: 'zyh', keys: arr, maxAge: 20 * 3600 * 1000}));

//3.post数据
server.use(bodyParser.urlencoded({extended: false}));
server.use(multer({dest:'./www/upload'}).any())

//配置模板引擎
//输出什么东西
server.set('view engine','html');
//模板文件放哪里
server.set('views','./template');
//哪种模板引擎
server.engine('html',consolidate.ejs)

//用户请求
server.get('/', function (req, res,next) {
    //连接数据库
    //var db = mysql.createConnection({host:'demo',user:'root',password:'123456',database:'blog'}); //单次连接
    db.query("SELECT * FROM banner_table",(err,data)=>{
        if (err){
            console.log(err);
            res.status(500).send('database error').end();
        }else{
            //res.render('index.ejs',{banners:data})
            //banners的数据和article的数据需要一起发送出去，此处使用next()链式操作解决嵌套回调的问题
            res.banners = data;
            //console.log(res.banners);
            
            next()
        }
    });
});
//链式操作需要相同的路径'/'
server.get('/',function (req,res,next) {
    db.query("SELECT ID,title,summery FROM article_table",(err,data)=>{
        if (err){
            console.log(err);
            res.status(500).send('database error').end();
        }else{
            res.articles = data;
            //console.log(res.articles);
            next();
        }
    })
});
server.get('/',function(req,res){
    //后台渲染
    res.render('index.ejs',{banners:res.banners,articles:res.articles});
});
server.get('/context',(req,res)=>{
    if (req.query.id){
        db.query(`SELECT * FROM article_table WHERE ID=${req.query.id}`,(err, data)=>{
            if (err){
                res.status(500).send('数据有问题').end();
            }else{
                if(data.length == 0){
                    res.status(404).send('您请求的文章找不到').end();
                }else{
                    //有数据
                    //console.log(data);
                    var article_data = data[0];
                    //根据需求处理数据
                    article_data.sDate = common.timeParser(article_data.post_time);
                    //console.log(article_data.sDate);
                    article_data.content = article_data.content.replace(/^/gm,'<p>').replace(/$/gm,'</p>');
                    res.render('conText.ejs',{ article_data:article_data});
                }
            }
        })
    }else{
        res.status(404).send('您请求的文章找不到').end();
    }
})
//4.返回前端请求的静态页面
server.use(static('./www'));