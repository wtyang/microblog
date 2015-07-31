var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var router = express.Router();
var Users = require('../models/user');
var Posts = require('../models/posts');

/* 首页get */
router.get('/', function(req, res, next) {
    Posts.fetch(function(err, posts, next) {
        if (err) {
            req.flash('error', err);
        } else {
            console.log('1----------------------');
            Users.fetch(function(err, users) {
                if (err) {
                    req.flash('error', err);
                }else{
                    console.log('2----------------------');
                    Users.find({name : posts.author},function(err,user,next){
                        if (err) {
                            req.flash('error', err);
                        }else{
                            console.log('3----------------------');
                            posts.author = user;
                            res.render('index', {
                                title: 'MicroBlog',
                                posts: posts,
                                users: users
                            });
                        }
                    })
                }
            });
        }
    })
});

//注册get
router.get('/reg', function(req, res, next) {
    res.render('reg', {
        title: 'Register'
    });
});
//注册post
router.post('/reg', function(req, res, next) {
    var user = req.body.user;
    var _user;
    _user = new Users({
        name: user.name,
        face: user.face
    });
    _user.save(function(err) {
        if (err) {
            req.flash('error', err);
        } else {
            res.redirect('/');
        }
    });
})
//登录get
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: "Login"
    });
});
//登录post
router.post('/login', function(req, res, next) {})

//发布post
router.post('/post', function(req, res, next) {
    var post = req.body.post;
    var _post;
    _post = new Posts({
        author: post.author,
        content: post.content
    });
    _post.save(function(err) {
        if (err) {
            req.flash('error', err);
        } else {
            res.redirect("/");
        }
    })
});
//退出get
router.get('/logout', function(req, res, next) {});
//用户get
router.get('/user/:name', function(req, res, next) {
	Users.findByName(req.params.name,function(err,user){
		res.render('user', {
	        title: "User",
	        user: user
	    });
	})
    
});
module.exports = router;