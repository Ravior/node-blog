/**
 *  数据库链接信息
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var mysql=require('mysql');
var config=require('../config');
var connection=mysql.createConnection(config.db);
module.exports=connection;
