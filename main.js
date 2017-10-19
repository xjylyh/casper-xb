const casper = require('casper').create({
    clientScript: ['jquery-1.8.3.min.js']
});//创建一个casper实例，并且使用jquery来在和网页连接时使用
phantom.outputEncoding = "gbk";//防止乱码？
        var page = casper.cli.get(0);//casper.cli.get(x)取到命令行第x位的参数，casper.cli.has(x)检测命令行是否有第x位参数或者是否有参数为x
        var shopInfoObj;//这个全局变量是为了之后存储爬到的数据
        var url = 'http://pub.alimama.com/promo/item/channel/index.htm?spm=a219t.7900221%2F1.1998910419.d07bd19c4.15e6cd4afzMh0G&channel=nzjh&toPage=' + page + '&perPageSize=40';//url
        casper.start(url);//打开浏览器

        // casper.waitForSelector('.search-box-img.img-loaded', function() {
        //     this.echo('the web is runing,please wait...');
        //     this.capture('1.png');//查看网页状况，一搬5s差不多了
        //     this.echo('capture is done');
        // })

        casper.wait(15000,function(){//等待15秒。。为了网页加载玩，waitForSelector不知为何用了网页就不能加载了- -
            this.echo('the web is runing,please wait...');
            this.capture(page + '.png');//等待完成了截个图看看网页加载状况
            this.echo('capture is done');
        })

        casper.then(function(){//然后
            shopInfoObj = casper.evaluate(getInfo);//按我的理解（手动滑稽），casper.evaluate()这个方法就好比你进到网页控制台然后执行你自己的方法来进行网页操作
        })

        casper.then(function(){//然后
            if(shopInfoObj.length>0){//我们这时候应该差不多爬取到数据了。。长度大于0的话就打开我们的提交接口
                casper.thenOpen('http://localhost:3000/dataInit',{//然后使用post来把我们爬到的数据提交
                    method:'post',
                    data:{
                        info:JSON.stringify(shopInfoObj)//提交做字符串处理
                    }
                })
            }
        })
        casper.then(function(){//然后
             this.echo('post it');
             casper.exit();//提交完成后我们关掉浏览器。。
         })
        



        // casper.then(function(){
        //     this.click('input#submits');
        // })


        function getInfo(){//dom操作
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

        casper.run();//要有run才可以执行哦
    
