/**
 * 
 * @authors Alones (7242586@qq.com)
 * @date    2019-03-18 16:17:02
 */
'use strict'

const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
router.post('/logo',(req,res) => {
  let base = req.body.base,
      imgName = 'small' + new Date().getTime()
  base = base.replace(/^data:image\/\w+;base64,/, '')
  let buff = new Buffer(base, 'base64')
  res.writeHead(200,{'Access-Control-Allow-Origin':'*'})
  fs.writeFile( `img/${imgName}.png`, buff, (err) => {
    if (err)
      console.log(err)
  })
  res.write(JSON.stringify({code: 200, data: {url: `${imgName}.png`}, msg: '上传成功'}))
  res.end()
})

module.exports = router
