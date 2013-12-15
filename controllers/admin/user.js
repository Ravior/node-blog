/**
 *  登入验证
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 * 
 */
var config=require('../../config');


exports.login=function(req,res){
	//console.log(req.session);
	res.render('admin/login');
}


exports.checkLogin=function(req,res){
	var username=req.body.username.trim();
	var password=req.body.password.trim();
	if(username==config.username && password==config.password){
		req.session.user={username:username,login_time:(new Date()).valueOf()};
		res.redirect('/admin/index');
	}else{
		res.redirect('/admin');
	}
}
// 退出
exports.logout=function(req,res){
	req.session=null;
	res.redirect('/admin');
}
