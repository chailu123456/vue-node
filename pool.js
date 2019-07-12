const mysql = require('mysql') 

let test = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'smallsql' // 数据库名字
})

module.exports = test 