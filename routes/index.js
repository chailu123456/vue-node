
module.exports = function(app,pool,path,fs,JwtUtil) {
	app.get('/test',(req, res)=>{
		// let testdata = 'SELECT * from websites'
		// let testdata = 'SELECT * from websites WHERE alexa>10' // 搜索alexa>10的
		// let testdata = "SELECT * from websites WHERE country like 'U%'" // 模糊查询 %代表多个字值  U%：模糊查询信息为U开头的  %U%表示包含U所有的内容 %U_:表示查询以U在倒数第二位的所有内容
		// let testdata = 'SELECT * from websites WHERE alexa>2 AND (country = "CN" OR country = "USA")' // 查询alexa>2的，并且国家为CN或USA的所有数据
		// let testdata = 'SELECT * FROM Websites ORDER BY alexa' // 搜索所有并按照alexa排序，默认升序
		// let testdata = 'SELECT * FROM Websites ORDER BY alexa DESC' // 搜索所有并按照alexa排序，DESC降序
		// let testdata = 'SELECT * FROM Websites ORDER BY country,alexa' //搜索所有按照country,alexa升序排序    order by a desc,b 这时a降序b升序    order by a, b desc 这时A升序，b降序
		// let testdata = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES (NULL,?,?,?,?)' // 插入数据
		// let testdata = 'INSERT INTO websites(Id,name,country) VALUES (NULL,?,?)'  // 插入数据
		// let testdata = 'UPDATE websites SET url=?,alexa=? WHERE id=?' // 更新数据
		   let testdata = 'DELETE FROM websites WHERE id=?' // 删除数据
			 let insertdata = [3]
		pool.query(testdata,insertdata,(err,result)=>{  // result 返回的spl数据
			// if (result) {
			// 	res.send({code:200,data:result,status:'success'})
			// }
			if (err) res.send({code:-200, data:null, status:'error'})
			console.log(result)
			if (result.affectedRows > 0)
				res.send({code:200, data:null, status:'success'})
		})
	})

	app.get('/order', (req,res)=>{
		let data = req.query
		let token = req.get("Authorization"); // 从Authorization中获取token
		// console.log(req.query)
		// console.log(token)
    let jwt = new JwtUtil(token)
    let returnData = jwt.verifyToken()
    console.log(returnData)
    if (returnData.name === "TokenExpiredError") {
    	res.send({code:403, data: '登录已过期,请重新登录'})
    } else {
    	let pageNum = data.num
			let orderData = `SELECT * FROM orderdata order by id desc limit ${data.page * pageNum - pageNum},${pageNum}`  //order by id desc(id倒叙查询) asc(正序)
			// let orderData = `SELECT * FROM orderdata`

			if (data.id || data.username || data.province || data.email) {
				orderData =`SELECT * FROM orderdata WHERE id=? || username=? || province=? || email=? ORDER BY id DESC`
			}
			pool.query(orderData,[data.id,data.username,data.province,data.email], (err,result)=>{
				res.send({code:200, data:result || null, status:'success'})
			})
    }
		
	})

	app.put('/order',(req,res)=>{
		let addData = req.body
		let sql = 'INSERT INTO orderdata (id,username,province,city,adress,email) VALUES(0,?,?,?,?,?)'
		pool.query(sql,[addData.username,addData.province,addData.city,addData.adress,addData.email],(err,result)=>{
			if (err) {
				res.send({code:-200,data:err,status:'err'})
			}
			if (result) {
				res.send({code:200,data:null,status:'success'})
			}

		})
	})

	app.post('/order',(req,res)=>{
		let editData = req.body
		let sql = 'UPDATE orderdata SET username = ?, province = ?, city = ?, adress = ?, email = ? WHERE id = ?';
		let updataData = [editData.username,editData.province,editData.city,editData.adress,editData.email,editData.id]
		pool.query(sql, updataData,(err,result)=>{
			if (result) {
				res.send({code:200,data:null,status:'success'})
			}
		})
	})

	// 单个删除
	app.delete('/order',(req,res)=>{
		let deleteData = req.body
		console.log(deleteData)
		let sql = 'DELETE FROM orderdata WHERE id = ?'
		pool.query(sql,[deleteData.id],(err,result)=>{
			if (result) {
				res.send({code:200,data:null,status:'success'})
			}
		})
	})

	//批量删除
	app.delete('/allorder',(req,res)=>{
		let deleteData = req.body
		let sql = `DELETE FROM orderdata WHERE id in (?)`
		pool.query(sql,[deleteData.arrayId],(err,result)=>{
			if (result) {
				res.send({code:200,data:null,status:'success'})
			}
		})
	})

	// 读取文件夹所有的图片
	app.get('/imgarr',(req,res)=>{
		var pathName = './img'
	  var dirs = [];
	  fs.readdir(pathName, function(err, files){
      (function iterator(i){
        if(i == files.length) {
          res.send({code:200,data:{dirs},status:'成功'})
          return;
        }
        fs.stat(path.join(pathName, files[i]), function(err, data){     
          if(data.isFile()){
            dirs.push(files[i]);
          }
          iterator(i+1);
         });   
      })(0);
	  });
	})
}