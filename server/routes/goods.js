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

	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	goodsModel.sort({'salePrice':sort});
	goodsModel.exec( function (err,doc) {
		if(err) {
			res.json({
				status: '1',
				msg:err.message
			});
		}else {
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

module.exports = router;