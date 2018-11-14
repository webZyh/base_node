var express = require('express')
var bodyParser = require('body-parser');
var multer = require('multer');
const pathLib = require('path');
const fs = require('fs');

var server = express();

server.use(bodyParser.urlencoded({extended:false}));
var obj = multer({dest:'./upload'});
server.use(obj.any())

server.use('/',(req,res)=>{
    //  pathLib.parse(req.files[0].originalname).ext    => .jpg后缀
    let suffix = pathLib.parse(req.files[0].originalname).ext;
    //console.log(req.files);
    //console.log(suffix);
    let newName = req.files[0].path + suffix;
    //console.log(newName);
    fs.rename(req.files[0].path, newName,(err)=>{
        if (err){
            console.log(err);
            res.send('上传失败！')
        }else{
            res.send('成功')
        }
    })
});
server.listen(8080);