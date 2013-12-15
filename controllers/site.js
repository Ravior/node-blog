/**
 *  前台首页控制器
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var post=require('../models/post');
var category=require('../models/category');
var async=require('async');
var config=require('../config');

//首页  /  /pgae
exports.index=function(req,res,next){
	var page=req.params.page;
	if(page<1 || isNaN(page)){
		page=1;
	}
	page=parseInt(page);
	async.waterfall([getPostCount,getPost],function(err,obj_result){
		if(err) return res.send(404,'没有此页面');
		var title='首页';
		if(page>1){
			title+=' 第'+page+'页'; 
		}

		obj_result.title=title;
		obj_result.page=page;
		res.render('index',obj_result);
	});

	//获取所有记录数
	function getPostCount(callback){
		post.getCountByOps(null,function(err,count){
			if(err)return callback(err);
			callback(err,count);
		});
	}

	//获取page 获取post
	function getPost(count,callback){
		var allPage=Math.ceil(count/config.page);
		if(allPage==0)allPage=1;
		if(page>allPage){
			return callback('超过最大页数');
		}

		var start=(page-1)*config.page;

		post.findByOps('order by `post_id` desc limit '+start+','+config.page,function(err,posts){
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




