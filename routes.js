/**
 *  路由信息
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var site=require('./controllers/site');
var post=require('./controllers/post');
var category=require('./controllers/category');

var admin_user=require('./controllers/admin/user');
var admin_index=require('./controllers/admin/index');
var admin_post=require('./controllers/admin/post');
var admin_category=require('./controllers/admin/category');
var admin_tool=require('./controllers/admin/tool');
module.exports=function(app){
	//前台
	app.get('/',site.index);
	app.get('/page/:page',site.index);

	app.get('/post/:post_id',post.post);
	app.get('/category/:category',category.category);
	app.get('/category/:category/:page',category.category);


	//后台管理
	app.get('/admin',admin_user.login);	
	app.post('/admin',admin_user.checkLogin);
	//退出
	app.get('/admin/logout',admin_user.logout);

	app.get('/admin/index',userRequired,admin_index.index);
	//显示文章并分页
	app.get('/admin/post',userRequired,admin_post.list);
	app.get('/admin/post/page/:page',userRequired,admin_post.list);
	//文章添加
	app.get('/admin/post/add',userRequired,admin_post.add);
	app.post('/admin/post/add',userRequired,admin_post.checkAdd);

	//文章修改
	app.get('/admin/post/:post/edit',userRequired,admin_post.edit);
	app.post('/admin/post/:post/edit',userRequired,admin_post.checkEdit);
	//文章添加
	app.get('/admin/post/:post/delete',userRequired,admin_post.delete);

	app.get('/admin/category',userRequired,admin_category.list);
	//分类添加
	app.get('/admin/category/add',userRequired,admin_category.add);
	app.post('/admin/category/add',userRequired,admin_category.checkAdd);
	//分类修改
	app.get('/admin/category/:category/edit',userRequired,admin_category.edit);
	app.post('/admin/category/:category/edit',userRequired,admin_category.checkEdit);
	//分类删除
	app.get('/admin/category/:category/delete',userRequired,admin_category.delete);

	//处理上传
	app.post('/admin/editor/upload',admin_tool.upload);
}

/**
 * 登录验证
 */
function userRequired(req, res, next) {
	if (!req.session || !req.session.user) {
		return res.redirect('/admin');
	}
   	next();
};