/**
 * 
 * @authors Chai (846304126@qq.com)
 * @date    2019-07-10 16:17:02
 */
'use strict'

const express = require('express')
const router = express.Router()
let pool = require('../pool.js')
let JwtUtil = require('../jwt.js')
const jwt = require('jsonwebtoken') // 用来生成token
// 登陆
router.post('/login', function (req, res) {
  let cqh = req.body
  let sql = 'SELECT * from user WHERE username=? && password = ?'
  pool.query(sql,[cqh.uid, cqh.password],(err,result)=>{
    if (result.length > 0){
      delete result[0].password
      let cont = {id: cqh.uid, passowrd: cqh.password}
      let jwt = new JwtUtil(cont)
      let token = jwt.generateToken()
      result[0].token = token
      res.send({code:200, data:result, status:'success'})
    }
    else
      res.send({code: -999, data: null, msg: 'error'})
  })
});
// 注册
router.post('/register', function (req, res) {
  let cqh = req.body
  let userMsg = 'INSERT INTO user(Id,username,password,logourl) VALUES(NULL,?,?,?)';
  let getUser = [cqh.uid, cqh.password, 'http://k.zol-img.com.cn/sjbbs/7692/a7691515_s.jpg']
  pool.query(userMsg, getUser, (err,result)=>{
    if (result.affectedRows > 0) {
      delete result[0].password
      let cont = {id: cqh.uid, passowrd: cqh.password}
      let jwt = new JwtUtil(cont)
      let token = jwt.generateToken()
      result[0].token = token
      res.send({code:200, data:result, status:'success'})
    }
    else
      res.send({code: -999, data: null, msg: 'error'})
  })
});

module.exports = router