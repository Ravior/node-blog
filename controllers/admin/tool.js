/**
  处理 编辑器上传
  返回json
 成功时
{
        "error" : 0,
        "url" : "http://www.example.com/path/to/file.ext"
}
//失败时
{
        "error" : 1,
        "message" : "错误信息"
}
 */
exports.upload=function(req,res){
	//req.files.字段名 (这里都是 imgFile)
	// console.log(req.files.imgFile.path);
	res.json({'error':0,"url":'/'+req.files.imgFile.path});
}