const express = require('express');
const multer = require('multer');
const pathLib = require('path');
const fs = require('fs');

const server = express();

const multerObj = multer({dest:'./www/upload'});
server.use(multerObj.any())

//path: 'www\\upload\\167961b37c99ef76995c30f031f94fb3'
//originalname: 'u=2984185296,2196422696&fm=26&gp=0.jpg'
/*
{ root: '',
  dir: '',
  base: 'u=2735633715,2749454924&fm=26&gp=0.jpg',
  ext: '.jpg',
  name: 'u=2735633715,2749454924&fm=26&gp=0' }
 */
server.post('/',(req,res,next)=>{
	//console.log(req.files);
	//console.log(pathLib.parse(req.files[0].originalname));
	let newName = req.files[0].path+pathLib.parse(req.files[0].originalname).ext;
	//console.log(newName);

	fs.rename(req.files[0].path,newName,(err)=>{
		if(err){
			res.send('上传失败')
		}else{
			res.send('成功')
		}
	})
})

server.listen(8080);