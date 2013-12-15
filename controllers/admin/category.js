/**
 *  文章分类管理
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var category=require('../../models/category');
var post=require('../../models/post');

exports.list=function(req,res){
	//查找出所有的category
	category.findById(null,function(err,rows){
		if(err){
			console.log(err);
			return res.send(500,'内部错误');
		}
		res.render('admin/cat_list',{category:rows});
	});

	
}

/**
 * 添加category
 */
exports.add=function(req,res){
	
	res.render('admin/cat_add');
}

/**
 *  检查添加
 */
exports.checkAdd=function(req,res){
	var content=req.body.category.trim();
	if(!content){
		res.send('分类不能为空');
		return ;
	}
	//判断分类是否已经存在
	category.findCatIdByCat(content,function(err,rows){
		if(rows.length!==0){
			return res.send('该分类已经存在');
		}
		var cat=new category(content);
		cat.insert(function(err){
			if(err)return res.send('插入失败');
			res.redirect('/admin/category');
		});
	});
}

/**
 * 修改category
 */
exports.edit=function(req,res){
	var cat_id=req.params.category;
	category.findById(cat_id,function(err,rows){
		if(err)return res.send('出错');
		res.render('admin/cat_edit', {category:rows[0]});
	});
}

/**
 * 检查修改
 */
exports.checkEdit=function(req,res){
	var cat_id=req.body.cat_id;
	var content=req.body.category;
	var cat=new category(content);
	cat.update(cat_id,function(err,rows){
		if(err)return res.send('更新失败');
		res.redirect('/admin/category');
	});

	res.render('admin/edit');
}

/**
 * 删除  删除所有文章!!
 */
exports.delete=function(req,res){
	var cat_id=req.params.category;
	category.deleteByCatId(cat_id,function(err){
		if(err)return res.send('删除分类失败');
		//删除文章
		post.deleteByCatId(cat_id,function(err){
			if(err)return res.send('删除文章失败');
			res.redirect('/admin/category');
		});
	});
}

