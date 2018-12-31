// let http = require('http');

var https = require('https');

var util = require('util');

https.get('https://coding.imooc.com/class/ajaxsearchwords?callback=searchKeys&_=1546243779142', function (res) {
	let data = '';
	res.on("data", function (chunk) {
		data += chunk;
	});
  console.log(data,7777)
	res.on("end", function () {
		let result = data;
		console.log("result:" + util.inspect(result));
	})
});