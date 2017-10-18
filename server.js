const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const child_process = require("child_process");


var urlencodedParser = bodyParser.urlencoded({ extended: false })
var arr = [];

for(var i=0;i<10000;i++){
    arr.push('sig_'+Math.random());
}
var server = express();
server.listen(3000,function(){
    console.log('server is run in 3000');
})

server.use(express.static('./views'));
server.use(urlencodedParser);
server.use(cookieParser());
server.use(cookieSession({keys:arr}))

var page = 1

server.use('/start',function(req,res){
    console.log('the pc is runing');
    if(page <= 100) {
        child_process.exec(`casperjs main.js ${page}`);
        res.send(JSON.stringify('{"r":"200","msg":"操作成功"}'))
        res.end();

    }else {
        console.log('the end');
        res.send(JSON.stringify('{"r":"500","msg":"page too large"}'))
        res.end();
    }
})


server.use('/dataInit',function(req,res){
    console.log(req.body);
    var strobj = JSON.stringify(req.body);
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

    fs.writeFile('./jsonFile/'+page+'.json',strobj,function(err){
        if(err){
            console.log(err);
            return false;
        }else{
            console.log('写入成功');
            page ++;
            res.redirect('/start');
        }
    })
})



//http://pub.alimama.com/promo/item/channel/index.htm?spm=a219t.7900221/1.1998910419.d07bd19c4.15e6cd4afzMh0G&channel=nzjh


//http://pub.alimama.com/promo/item/channel/index.htm?spm=a219t.7900221%2F1.1998910419.d07bd19c4.15e6cd4afzMh0G&channel=nzjh&toPage=2&perPageSize=40