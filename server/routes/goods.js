var express = require ('express');
var router = express.Router();
var mongoose = require ('mongoose');
var Goods = require('../models/goods');

// To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
mongoose.connect('mongodb://127.0.0.1:27017/dumall',{ useNewUrlParser: true }); 

mongoose.connection.on("connected", function () {
	console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
	console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
	console.log("MongoDB connected disconnected.")
});

//查询商品列表数据
router.get("/", function (req, res, next) {
	let page = parseInt(req.param("page"));
	let pageSize = parseInt(req.param("pageSize"));
	let priceLevel = req.param("priceLevel");
	let sort = req.param("sort");
  let skip = (page - 1)*pageSize;
  let priceGt = '', priceLte = '';
	let params = {};
  if (priceLevel !== 'all') {
  	switch (priceLevel) {
  		case '0' : priceGt = '0'; priceLte = 100;break;
  		case '1' : priceGt = '100'; priceLte = 500;break;
  		case '2' : priceGt = '500'; priceLte = 1000;break;
  		case '3' : priceGt = '1000'; priceLte = 5000;break;
  	}
  	params = {
  		salePrice: {
  			$gt: priceGt,
  			$lte: priceLte
  		}
  	}
  }

  // skip表示跳过几条数据 ，limit表示一页多少条数据
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	// 声明对哪个字段进行排序 ，这里如salePrice金额 sort 1 为升序,-1 为降序
	goodsModel.sort({'salePrice':sort});
	// 第一个是参数，目前没有入参
  // 返回的是两个参数，第一个是报错err,第二个是文档
  // 因为这里不是普通的查询，经过到这里已经执行了很多步骤了 下面通过exec来执行我们的方法
  // exec这里不需要传入参数了，因为前面已经find 拿到结果了
	goodsModel.exec( function (err,doc) {
		if(err) {
			res.json({
				status: '1',
				msg:err.message
			});
		}else {
			// 如果没有报错就把结果输出
			res.json({
				status: '0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			})
		}
	} )
});

//加入到购物车
router.post("/addCart", function (req,res,next) {
  var userId = '100000077',productId = req.body.productId;
  var User = require('../models/user'); // 获取用户模型
   // 查询第一条:拿到用户信息
  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
        res.json({
            status:"1",
            msg:err.message
        })
    }else{
        console.log("userDoc:"+userDoc);
        if(userDoc){
          var goodsItem = '';
          // 遍历购物车列表查询有没有此产品
          userDoc.cartList.forEach(function (item) {
              if(item.productId == productId){ // 如果购物车列表已经有了该商品，只将此商品数量加1
                goodsItem = item;
                item.productNum ++;
              }
          });
          if(goodsItem){ // 如果此商品购物车里面已经有了，那么就更新一下productNum
            userDoc.save(function (err2,doc2) {
              if(err2){
                res.json({
                  status:"1",
                  msg:err2.message
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }else{
            Goods.findOne({productId:productId}, function (err1,doc) {
              if(err1){
                res.json({
                  status:"1",
                  msg:err1.message
                })
              }else{
                if(doc){
                  doc.productNum = 1;
                  doc.checked = 1;
                  userDoc.cartList.push(doc);
                  userDoc.save(function (err2,doc2) { // 将数据添加

                    if(err2){
                      res.json({
                        status:"1",
                        msg:err2.message
                      })
                    }else{
                      res.json({
                        status:'0',
                        msg:'',
                        result:'suc'
                      })
                    }
                  })
                }
              }
            });
          }
        }
    }
  })
});
module.exports = router;