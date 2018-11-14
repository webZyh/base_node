const jade = require('jade');
const fs = require('fs');

let str = jade.renderFile('./views/1.jade',{pretty:true})

fs.writeFile('./build/1.html',str,(err)=>{
    if(err){
        console.log(('编译出错'));
    }else{
        console.log('成功')
    }
})