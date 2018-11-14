const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url');

let server = http.createServer((req, res) => {
    let str = ''
    req.on('data', (data) => {
        str += data;
    });
    req.on('end',()=>{
        const obj = urlLib.parse(req.url,true);
        const url = obj.pathname;       //请求路径
        const GET = obj.query;          //GET请求参数
        const POST = querystring.parse(str);    //POST请求参数
    })
});

server.listen(8080);