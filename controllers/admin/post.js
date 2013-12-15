/**
 *  文章管理
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var post=require('../../models/post');
var category=require('../../models/category');
var config=require('../../config');
var async=require('async');
/**
 * 显示文章列表 
 */
exports.list=function(req,res){

	var page=req.params.page;
	if(page<1 || isNaN(page)){
		page=1;
	}
	page=parseInt(page);
	async.waterfall([getPostCount,getPost],function(err,obj_result){
		console.log(err);
		if(err) return res.send(404,'没有此页面');
		var title='首页';
		if(page>1){
			title+=' 第'+page+'页'; 
		}

		obj_result.title=title;
		obj_result.page=page;
		res.render('admin/post_list',obj_result);
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
		var allPage=Math.ceil(count/12);
		if(allPage==0)allPage=1;
		if(page>allPage){
			return callback('超过最大页数');
		}

		var start=(page-1)*12;

		post.findByOps('order by `post_id` desc limit '+start+','+12,function(err,posts){
			if(err)return callback(err);
			//根据post_id中的cat_id获取category
			async.mapSeries(posts,getCatByPost,function(err,result){
				if(err)return callback(err);
				var posts=result;
				var obj={allPage:allPage,posts:posts,count:count};
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

/**
 * 添加新文章
 */
exports.add=function(req,res){
	//查找出所有的category
	category.findById(null,function(err,rows){
		if(err){
			//console.log(err);
			return res.send(500,'内部错误');
		}
		res.render('admin/add',{category:rows});
	});
}

/**
 * 检查添加新文章
 */
exports.checkAdd=function(req,res){
	var cat_id=req.body.category;
	var title=req.body.title;
	var content=req.body.content;
	var date=new Date().valueOf();
	var p=new post(title,content,date,cat_id);
	p.insert(function(err){
		if(err)return res.send('添加失败');
		res.redirect('/admin/post');
	});
}

/**
 * 修改文章
 */
exports.edit=function(req,res){
	var post_id=req.params.post;
	post_id=parseInt(post_id);
	async.series([getPost,getAllCat], function(err,result){
		if(err)return res.send('出错');
		var post=result[0][0];
		res.render('admin/edit', {post:post,category:result[1]});
	});
	
	//根据post_id获取post
	function getPost(callback){
		post.findById(post_id,callback);
	}

	//查找出所有的category
	function getAllCat(callback){
		category.findById(null,function(err,rows){
			callback(err,rows);
		});
	}


}

/**
 * 修改文章
 */
exports.checkEdit=function(req,res){
	var cat_id=req.body.category;
	var title=req.body.title;
	var content=req.body.content;
	var post_id=req.body.post_id;
	var date=new Date().valueOf();
	var p=new post(title,content,date,cat_id);
	p.update(post_id,function(err){
		if(err)return res.send('修改失败');
		res.redirect('/admin/post');
	});
}



/**
 * 删除文章
 */
exports.delete=function(req,res){
	var post_id=req.params.post;
	var referer=req.get('Referrer');
	// console.log(referer);
	if(!post_id || isNaN(post_id)){
		res.send(404,'页面不存在');
	}

	//删除文章
	post.deleteById(post_id,function(err){
		if(err)res.send(500,'删除失败');
		res.redirect(referer);
	});

}

