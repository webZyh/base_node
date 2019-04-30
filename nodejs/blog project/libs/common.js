const crypto = require("crypto");
module.exports= {
    MD5_SUFFIX : 'jdalrjioqwjr998fdar90qwe80jfklask',	//加密后缀
    md5: function (str) {
        let obj = crypto.createHash("md5");	//指定散列算法为md5
        obj.update(str);
        return obj.digest('hex');
    }
}