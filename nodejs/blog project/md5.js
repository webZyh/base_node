const common = require('./libs/common');

var str = '111';	//需要加密的字符串
var str = common.md5(str+'jdalrjioqwjr998fdar90qwe80jfklask');
console.log(str);