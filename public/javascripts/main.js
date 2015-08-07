$(function(){
	microblog = {
		reloadPageWithData : function(page){
			/*
			* @function pagination click updata posts list
			* @param {number} current page
			*/
			$.ajax({
				url: '/',
				type: 'post',
				data: {
					currentPage: page
				},
				success: function (data) {
					var list = '';
					var posts = data.postlist;
					var paginOptions = data.pagination;
					for(item in data.postlist){
						list+='<div class="panel post-item"><div class="panel-body">';
						if($("#logedUser").data('id') == posts[item].author._id){
							list+='<div class="close">x</div>';
						}
						list+='<div class="row"><div class="col-xs-2 text-center">';
						list+='<a href="/user/'+posts[item].author._id+'"  target="_blank">';
						list+='<img src="'+posts[item].author.face+'"></a>';
						list+='</div><div class="col-xs-10"><div class="post-content"><p>';
						list+=posts[item].author.name+'</p><p>';
						list+=posts[item].content+'</p><p class="text-right"><small> 发布于: ';
						list+=moment(posts[item].date).format("llll");
						list+='</small></p></div></div></div></div></div>';
					}
					//更新post 列表
					$("#posts-list").html(list);
					//更新pagination
					$('#pagination').bootstrapPaginator(paginOptions);
				}
			});
		}
	}
	return microblog;

})