const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const child_process = require("child_process");


var urlencodedParser = bodyParser.urlencoded({ extended: false })//使用bodyParser来进行post参数的处理

var arr = [];

for(var i=0;i<10000;i++){
    arr.push('sig_'+Math.random());
}
var server = express();
server.listen(3000,function(){
    console.log('server is run in 3000');
})

server.use(express.static('./views'));//使用express-static来处理静态文件，中间件好像已经被集成？？
server.use(urlencodedParser);
server.use(cookieParser());//cookie-parser和cookie-session来进行cookie和sission的操作
server.use(cookieSession({keys:arr}))//这里本来是想用session来记录写入次数然后想到一个全局变量就搞定就暂时废弃，等修炼到金丹再来- -

var page = 1//由于女装模块的url是文件最下面的那种规律所以，从第一页开始首先定义一个全局page=1

server.use('/start',function(req,res){//接受请求来开始爬虫
    console.log('the pc is runing');
    if(page <= 100) {//由于我看到只有100页数据，然后就没有下一页了，so，定了100页
        child_process.exec(`casperjs main.js ${page}`);//child_process.exec(): 衍生一个 shell 并在 shell 上运行命令，当完成时会传入 stdout 和 stderr 到回调函数。  前面的是node官网的解释，按我的理解（手动滑稽）这里也就是生成一个子进程来在命令行执行 ｛casperjs main.js 参数｝这一条命令
        res.send(JSON.stringify('{"r":"200","msg":"操作成功"}'));//给前端返回。。
        res.end();

    }else {//当爬取完毕后。。。
        console.log('the end');
        res.send(JSON.stringify('{"r":"500","msg":"page too large"}'))
        res.end();
    }
})


server.use('/dataInit',function(req,res){//这个接口主要进行文件写入操作，main.js爬取的数据最终会通过表单post提交的方式提交到这个接口。每爬取一页就会写入一次
    console.log(req.body);//在这里我们就可以看见爬去来的数据
    var strobj = JSON.stringify(req.body);//fs写入文件需要字符串，所以这里做了处理
    // if(req.session['howmuch']==null){
    //     fs.writeFile('./jsonFile/'+page+'.json',strobj,function(err){
    //         if(err){
    //             console.log(err);
    //             return false;
    //         }else{
    //             console.log('写入成功');

    //         }
    //     })
    // }else{
    //     req.session['howmuch']++;
    //     fs.writeFile('./jsonFile/'+page+'.json',strobj,function(err){
    //         if(err){
    //             console.log(err);
    //             return false;
    //         }else{
    //             console.log('写入成功');
    //         }
    //     })
    // }

    fs.writeFile('./jsonFile/'+page+'.json',strobj,function(err){//写入文件，当爬取到page就把数据写入文件page.json
        if(err){
            console.log(err);
            return false;
        }else{
            console.log('写入成功');
            page ++;//当文件写入成功后就可以继续爬取下一页，所以page++
            res.redirect('/start');//这个是调用自己的静态路由接口，再次去新建一个子进程创建一个casper实例去继续爬取下一页数据
        }
    })
})



//http://pub.alimama.com/promo/item/channel/index.htm?spm=a219t.7900221/1.1998910419.d07bd19c4.15e6cd4afzMh0G&channel=nzjh


//http://pub.alimama.com/promo/item/channel/index.htm?spm=a219t.7900221%2F1.1998910419.d07bd19c4.15e6cd4afzMh0G&channel=nzjh&toPage=2&perPageSize=40