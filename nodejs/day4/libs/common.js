function toDou(n) {
    return n<10?'0'+n:''+n;
}
module.exports={
    timeParser:function (timer) {
        var oDate = new Date();
        oDate.setTime(timer*1000)       //setTime() 以毫秒设置Date对象

        return oDate.getFullYear()+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate())+' '+oDate.getHours()+':'+oDate.getMinutes()+':'+oDate.getSeconds();
    }
}