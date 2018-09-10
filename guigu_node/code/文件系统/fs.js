var fs = require("fs");

fs.open("hello.txt","w",function(err,fd){
	console.log(arguments)
	if(!err){
		fs.write(fd,"hello world!",function(err){
			console.log(arguments)
			if(!err){
				fs.close(fd,function(err){
					if(!err){
						console.log("文件已关闭~~~")
					}
				})
			}
		})
	}
})