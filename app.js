
/**
 * Module dependencies.
 * @author silenceper@gmail.com
 * @website http://silenceper.com
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var category=require('./models/category');
var config=require('./config');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser({uploadDir:'./public/uploads'}));
app.use(express.session({secret:'wN2pBxNnr4Tuuju'}));

app.use(function(req,res,next){
	res.locals.blog_name=config.blog_name;

	// 获取sidebar对象 [ 获取所有的category ]  '/admin/xxx' 表示后台  不获取
	var preg=/^\/admin/;
	if(!preg.test(req.url)){
		category.findById(null,function(err,rows){
			if(err)return res.send(500,'获取category错误');
			var sidebar={category:rows};
			res.locals.sidebar=sidebar;

		});	
	}
	next();	
});

app.use(app.router);
app.use('/public',express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
