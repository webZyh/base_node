const crypto = require("crypto");
module.exports= {
    MD5_SUFFIX : 'jdalrjioqwjr998fdar90qwe80jfklask',
    md5: function (str) {
        let obj = crypto.createHash("md5");
        obj.update(str);
        return obj.digest('hex');
    }
}