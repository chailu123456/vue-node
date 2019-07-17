const jwt = require('jsonwebtoken');
class Jwt {
  constructor(data) {
    this.data = data
  }

  // 生成token
  generateToken() {
    let data = this.data
    let secretKey = "jwt" // 这是加密的密钥
    let token = jwt.sign(data, secretKey,{
      expiresIn: 60*60*8 // 8小时过期
    })
    return token
  }

  verifyToken() {
    let token = this.data
    // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInBhc3Nvd3JkIjoiMTIzIiwiaWF0IjoxNTYyNzUxNjAxLCJleHAiOjE1NjI3NTUyMDF9.dL_cK57ILu-8a8_KM025PnQ9DHp1PPChaF59RBxY2So"
    let secretKey = "jwt" // 这是加密的密钥
    let state = jwt.verify(token,secretKey,(err,decode)=>{
      if (err) {
        return err
      } else {
        return decode
      }
    })
    return state
  }

}
module.exports = Jwt;
