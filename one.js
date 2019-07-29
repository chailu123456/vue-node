var express = require('express');
var app = express();

let pool = require('./pool.js')

const jwt = require('jsonwebtoken') // 用来生成token


const path = require('path')
const fs = require('fs')
const bodyParse = require("body-parser")

let upload = require('./upload')
let JwtUtil = require('./jwt.js')

//允许跨域
// app.use(cors());

app.use(express.static(__dirname +'/img'))

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "authorization,content-type,contentType");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("Content-Type", "application/json;charset=utf-8");
	let token = req.get("Authorization"); // 从Authorization中获取token
  let jwt = new JwtUtil(token)
  let returnData = jwt.verifyToken()

  if (returnData.name === "TokenExpiredError") {
  	res.send({code:403, data: '登录已过期,请重新登录'})
  	return
  }
	next();
});
let userset = require('./routes/user.js')


app.use(bodyParse.json({limit: '50mb'}));
app.use(bodyParse.urlencoded({limit: '50mb', extended: true}));

let routes = require('./routes')(app,pool,path,fs,JwtUtil)

app.get('/aaa',(req,res)=>{
	console.log(req.query)
	let cont = {name:'chailu',password:123456}
	let secretKey = "jwt" // 这是加密的密钥
	let token = jwt.sign(cont, secretKey,{
		expiresIn: 60*60*1 // 1小时过期
	})
	res.send({code:200,dada:[token],status:'success'})
})

app.get('/bbb',(req,res)=>{
	let token = req.get("Authorization"); // 从Authorization中获取token
	// let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInBhc3Nvd3JkIjoiMTIzIiwiaWF0IjoxNTYyNzUxNjAxLCJleHAiOjE1NjI3NTUyMDF9.dL_cK57ILu-8a8_KM025PnQ9DHp1PPChaF59RBxY2So"
	let secretKey = "jwt" // 这是加密的密钥
	jwt.verify(token,secretKey,(err,decode)=>{
		if (err) {
			res.send({data:err})
		} else {
			res.send({data:decode})
		}
	})
})

app.use('/user', userset) // 登陆注册接口
app.use('/upload', upload) // 上传图片接口
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});