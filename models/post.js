/**
 *  对post表的操作
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var db=require('./db');
function post(title,content,update_date,cat_id){
	this.title=title,
	this.content=content;
	this.update_date=update_date;
	this.cat_id=cat_id;
}

module.exports=post;

/**
 * 插入 
 */
post.prototype.insert=function(callback){
	var add_date=new Date().valueOf();
	var data=[this.title,this.content,add_date,this.update_date,this.cat_id];
	db.query('insert into `nb_post`(`title`,`content`,`add_date`,`update_date`,`cat_id`) value(?,?,?,?,?)',data,function(err,rows){
		callback(err);
	});
}

/**
 * 更新
 */
post.prototype.update=function(post_id,callback){
	var data=[this.title,this.content,this.update_date,this.cat_id,post_id];
	db.query('update `nb_post` set `title`=?,`content`=?,`update_date`=?,`cat_id`=? where post_id=?',data,function(err,rows){
		callback(err);
	});
}
/**
 * 根据 sql 
 */
post.findByOps=function(ops,callback){
	var sql;
	if(ops===null){
		sql='select * from `nb_post`';
	}else{
		sql='select * from `nb_post` '+ops;
	}
	db.query(sql,function(err,rows){
		if(err) return callback(err);
		callback(err,rows);
	});
}

/**
 * 根据post_id 查找
 */
post.findById=function(post_id,callback){
	var post_id=parseInt(post_id);
	db.query('select * from `nb_post` where `post_id`='+post_id,function(err,rows){
		if(err)return callback(err);
		callback(err,rows);
	});
}

/**
 * 根据query查找出记录数 如果query为null则查找所有记录数
 * 
 */
post.getCountByOps=function(ops,callback){
	var sql;
	if(ops===null){
		sql='select count(*) as count from `nb_post`';
	}else{
		sql='select count(*) as count from `nb_post`'+ops;
	}

	db.query(sql,function(err,rows){
		if(err)return callback(err);
		var count=rows[0].count;
		callback(err,count);
	});
}

/**
 * 根据id删除文章
 */
post.deleteById=function(post_id,callback){
	db.query('delete from `nb_post` where `post_id`='+post_id,function(err,rows){
		callback(err);
	});
}

/**
 * 根据cat_id 删除
 */
post.deleteByCatId=function(cat_id,callback){
	db.query('delete from `nb_post` where `cat_id`=?',[cat_id],function(err,rows){
		callback(err);
	});
}