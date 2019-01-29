var express = require('express');
var router = express.Router();

var User = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send('test');
});

router.post("/login", function(req,res,next) {
	let param = {
		userName: req.body.userName,
		userPwd:req.body.userPwd
	}
	User.findOne(param, function (err,doc) { // 根据用户名密码查找数据库
		if(err) {
			res.json({
				status: "1",
				msg: err.message
			});
		} else {
			if(doc) {
				res.cookie("userId", doc.userId, {
					path:'/',
					maxAge:1000*60*60
				});
				// req.session.user = doc;
				res.json({
					status: '0',
					msg: '',
					result:{
						userName: doc.userName
					}
				})
			}
		}
	})
})

// 登出接口
router.post("/logout", function(req,res,next) {
	res.cookie("userId","",{
		path:"/",
		maxAge:-1
	})
	res.json({
		status: "0",
		msg:'',
		result:''
	})

});
module.exports = router;
