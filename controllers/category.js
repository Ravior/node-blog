/**
 *  前台分类控制器
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var post=require('../models/post');
var category=require('../models/category');
var async=require('async');
var config=require('../config');

//根据category获取 文章
exports.category=function(req,res,next){
	var page=req.params.page;
	var cat=req.params.category;
	if(page<1 || isNaN(page)){
		page=1;
	}
	page=parseInt(page);
	async.waterfall([getCatIdByCat,getPostCountByCatId,getPosts],function(err,obj_result){
		if(err) return res.send(404,'没有此页面');
		var title=cat;
		if(page>1){
			title+=' 第'+page+'页'; 
		}

		obj_result.title=title;
		obj_result.cat=cat;
		obj_result.page=page;
		obj_result.category=cat;
		res.render('category',obj_result);
	});

	//根据cat获取cat_id
	function getCatIdByCat(callback){
		category.findCatIdByCat(cat,function(err,rows){
			if(err || rows.length===0)return callback('error');
			callback(err,rows[0].cat_id);
		});
	}

	//根据cat获取所有记录数
	function getPostCountByCatId(cat_id,callback){
		post.getCountByOps('where `cat_id`='+cat_id,function(err,count){
			if(err)return callback(err);
			callback(err,count,cat_id);
		});
	}

	//获取page 获取post
	function getPosts(count,cat_id,callback){
		// console.log(cat_id);
		// console.log(count);
		var allPage=Math.ceil(count/config.page);
		if(page>allPage){
			return callback('超过最大页数');
		}

		var start=(page-1)*config.page;

		post.findByOps('where cat_id='+cat_id+' order by `post_id` desc limit '+start+','+config.page,function(err,posts){
			if(err)return callback(err);
			//根据post_id中的cat_id获取category
			async.mapSeries(posts,getCatByPost,function(err,result){
				if(err)return callback(err);
				var posts=result;
				var obj={allPage:allPage,posts:posts};
				callback(err,obj);
			});
			
		});
	}

	// 为每篇post加上 category  async.mapSeries 使用
	function getCatByPost(post,callback){
		category.findById(post.cat_id,function(err,cat){
			if(err)return callback(err);
			post.category=cat[0].category;
			callback(err,post);
		});
	}
}