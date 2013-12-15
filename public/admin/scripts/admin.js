(function() {
    // alert 关闭
    $('[data-dismiss="alert"]').click(function(e) {
        var $this = $(this),
            $parent = $this.hasClass('alert') ? $this : $this.parent();

        if (e) e.preventDefault();

        $parent.addClass('hide');
    });

    // 表单验证
   	$('#loginForm').on('submit',function(){
   		var username=$('#username').val().trim();
   		var password=$('#password').val().trim();
   		if(!username){
   			$('#error_mesg').text('用户名不能为空').fadeIn(500).delay(2000).fadeOut(700);
   			return false;
   		}else if(!password){
   			$('#error_mesg').text('密码不能为空').fadeIn(500).delay(2000).fadeOut(700);
   			return false;
   		}
   		return true;
   	}); 

    //add_post_form
    $('#add_post_form').on('submit',function(){
        var title=$('#title').val().trim();
        if(!title){
          alert('title必须填写');
          return false;
        }
        return true;    
    });

    //category_add_form
    $('#category_add_form').on('submit',function(){
        var category=$('#category').val().trim();
        if(!category){
          alert('category必须填写');
          return false;
        }
        return true;    
    });

})();
