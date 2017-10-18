const casper = require('casper').create({
    clientScript: ['jquery-1.8.3.min.js']
});
phantom.outputEncoding = "gbk";
    var page = casper.cli.get(0);
        var shopInfoObj;
        var url = 'http://pub.alimama.com/promo/item/channel/index.htm?spm=a219t.7900221%2F1.1998910419.d07bd19c4.15e6cd4afzMh0G&channel=nzjh&toPage=' + page + '&perPageSize=40';
        casper.start(url);//打开浏览器

        // casper.waitForSelector('.search-box-img.img-loaded', function() {
        //     this.echo('the web is runing,please wait...');
        //     this.capture('1.png');//查看网页状况，一搬5s差不多了
        //     this.echo('capture is done');
        // })

        casper.wait(15000,function(){
            this.echo('the web is runing,please wait...');
            this.capture(page + '.png');//查看网页状况，一搬5s差不多了
            this.echo('capture is done');
        })

        casper.then(function(){
            shopInfoObj = casper.evaluate(getInfo);
        })

        casper.then(function(){
            console.log(JSON.stringify(shopInfoObj));
            if(shopInfoObj.length>0){
                casper.thenOpen('http://localhost:3000/dataInit',{
                    method:'post',
                    data:{
                        info:JSON.stringify(shopInfoObj)
                    }
                })
            }
        })
        casper.then(function(){
             this.echo('post it');
             this.echo(shopInfoObj);
             casper.exit();
         })
        



        // casper.then(function(){
        //     this.click('input#submits');
        // })


        function getInfo(){
            var arr = [];
            $.each($('.block-search-box'),function(i,items){
                var obj = {};
                obj.taobaoUrl = $(items).find('.search-box-img').attr('href');
                obj.imgUrl = $(items).find('.search-box-img>img').attr('src');
                obj.shopName = $(items).find('.p-title>a').attr('title');
                obj.price = $(items).find('.fl').eq(0).find('span').eq(0).text();
                obj.monthBuy = $(items).find('.fr').eq(0).find('span').eq(0).text()+$(items).find('.fr').eq(0).find('span').eq(1).text();
                obj.shopBl = $(items).find('.fl.color-brand').find('span').eq(0).text()+$(items).find('.fl.color-brand').find('span').eq(1).text();
                obj.commission = $(items).find('.fr').eq(1).find('span').eq(0).text()+$(items).find('.fr').eq(1).find('span').eq(1).text();
                obj.shopTitle = $(items).find('.shop-title a').find('span').eq(0).text();
                arr.push(obj);
            })
            return arr;
        }

        casper.run();
    
