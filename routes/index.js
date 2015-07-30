var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/user');
var db = mongoose.connect("mongodb://localhost/microblog");

/* GET home page. */
router.get('/', function(req, res, next) {
	users : User.find({},function(err,users){

	    res.render('index', {
	        title: 'MicroBlog',
			posts : [{
				user : {
					id : "000",
					name : "讲笑话",
					face : "http://tp4.sinaimg.cn/2154946027/50/5716171843/0"
				},
				content : "今天朋友和我一起去4S店看车，我看中了一款，销售员说这款车很好，我问有多好，销售员说：如果这车开出去五百米没有妹子跳上来，那你就该想想自己的长相了...",
				date: Date.now
			},
			{
				user : {
					id : "000",
					name : "讲笑话",
					face : "http://tp4.sinaimg.cn/2154946027/50/5716171843/0"
				},
				content : "今天朋友和我一起去4S店看车，我看中了一款，销售员说这款车很好，我问有多好，销售员说：如果这车开出去五百米没有妹子跳上来，那你就该想想自己的长相了...",
				date: Date.now
			}],
			users : users
	    });
	})
});
router.get('/reg', function(req, res, next) {
    res.render('reg', {
        title: 'Register'
    });
});
router.post('/reg', function(req, res, next) {
	var user = req.body.user;
	console.log(user);
	var _user;
	_user = new User({
		//id : user.id,
		name : user.name,
		face : user.face
	});
	console.log(_user.name);
	_user.save(function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect('/');
		}
	});
})
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: "Login"
    });
});
router.post('/login', function(req, res, next) {

})
router.post('/post', function(req,res,next){
	console.log(req.session);
});
router.get('/logout', function(req,res,next){

});

//user
router.get('/user/:id', function(req, res, next) {
	res.render('user',{
		title: "User",
		user:{
			id : req.params.id,
			name : "讲笑话",
			face : "http://tp4.sinaimg.cn/2154946027/50/5716171843/0"
		}
	});
});

module.exports = router;