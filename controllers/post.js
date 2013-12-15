/**
 *  前台文章控制器 
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var post=require('../models/post');
var category=require('../models/category');
var async=require('async');
var config=require('../config');

//文章内容页
exports.post=function(req,res,next){
	var post_id=req.params.post_id;
	// console.log(post_id);
	if(isNaN(post_id) || !post_id){
		res.send(404,'没有此页面');
	}

	async.series([getPrePost,getNextPost,getPostContent,],function(err,result){
		// console.log(err);
		if(err) return res.send(404,'没有此页面');
		var prePost=result[0];
		var nextPost=result[1];
		var post=result[2];
		res.render('content',{post:post,prePost:prePost,nextPost:nextPost,title:post.title});
	});

	// 获取上一篇文章
	function getPrePost(callback){
		post.findByOps('where `post_id`<'+post_id+' order by post_id desc limit 1 ',function(err,rows){
			if(err)return callback(err);
			var prePost;
			if(rows.length===0){
				prePost={};
			}else{
				prePost=rows[0];
			}
			callback(err,prePost);
		})
	}

	// 获取下一篇文章
	function getNextPost(callback){
		post.findByOps('where `post_id`>'+post_id+' order by post_id desc limit 1 ',function(err,rows){
			if(err)return callback(err);
			var nextPost;
			if(rows.length===0){
				nextPost={};
			}else{
				nextPost=rows[0];
			}
			callback(err,nextPost);
		})
	}

	//获取文章内容
	function getPostContent(callback){
		post.findById(post_id,function(err,rows){
			if(err) return callback(err);
			if(rows.length===0){
				return callback('没有此post');
			}
			var post=rows[0];
			//根据cat_id 获取category
			category.findById(post.cat_id,function(err,rows){
				if(err)return callback(err);
				var category=rows[0].category;
				post.category=category;
				callback(null,post);
			})
			
		});	
	}
}