$(function(){
	//分页功能
	var paginationOptions = {
		currentPage:#{pagination.currentPage},
		totalPages:#{pagination.totalPages},
		numberOfPages:#{pagination.numberOfPages},
		bootstrapMajorVersion: 3,
		onPageClicked: function(e,originalEvent,type,page){
			$.ajax({
				url: '/',
				type: 'post',
				data: {
					currentPage: #{pagination.currentPage}
				},
				success: function (data) {
					console.log(data);
				}
			});
		}
	}
	$('#pagination').bootstrapPaginator(paginationOptions);
})