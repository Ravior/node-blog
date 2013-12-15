/**
 *  对category表的操作
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var db=require('./db');

function category(category){
	this.category=category;
}

module.exports=category;

/**
 * 插入
 */
category.prototype.insert=function(callback){
	var category=this.category;
	db.query('insert into `nb_category`(`category`) values(?)',[category],function(err,rows){
		//console.log(rows);
		callback(err);
	});
}

/**
 * 修改
 */
category.prototype.update=function(cat_id,callback){
	var category=this.category;
	db.query('update `nb_category` set `category`=? where `cat_id`=?',[category,cat_id],function(err,rows){
		callback(err);
	});
}

/**
 * 根据cat_id 获取category 如果id为null则获取所有category
 */
category.findById=function(cat_id,callback){
	var cat_id=parseInt(cat_id);
	if(cat_id){
		var sql='select * from `nb_category` where `cat_id`='+cat_id;
	}else{
		var sql='select * from `nb_category`';
	}
	db.query(sql,function(err,rows){
		//console.log(sql);
		if(err)return callback(err);
		callback(err,rows);
	});
}

/**
 * 根据cat获取cat_id
 */
category.findCatIdByCat=function(cat,callback){
	db.query('select `cat_id` from  `nb_category` where `category`='+db.escape(cat),function(err,rows){
		callback(err,rows);
	});
}

/**
 * 根据id删除
 */
category.deleteByCatId=function(cat_id,callback){
	db.query('delete from `nb_category` where `cat_id`=?',[cat_id],function(err,rows){
		callback(err);
	});
};