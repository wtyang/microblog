var express = require('express');
var moment = require('moment');
var session = require('express-session');
var cookie = require('cookie-parser');
var multiparty = require('connect-multiparty');
var mongoose = require('mongoose');
var router = express.Router();
var Users = require('../models/user');
var Posts = require('../models/posts');

/* 首页get */
router.get('/', function(req, res, next) {
    var logeduser = req.session.user;
    if(!logeduser){
        res.redirect("/login");
    }
    Posts.fetch(function(err, posts, next) {
        if (err) {
            req.flash('error', err);
        } else {
            console.log('1----------------------');
            Users.fetch(function(err, users) {
                if (err) {
                    req.flash('error', err);
                }else{
                    res.render('index', {
                        title: 'MicroBlog',
                        posts: posts,
                        users: users,
                        logeduser : logeduser
                    });
                }
            });
        }
    })
});

//注册get
router.get('/reg', function(req, res, next) {
    var logeduser = req.session.user;
    res.render('reg', {
        title: 'Register',
        logeduser : logeduser
    });
});
//注册post
router.post('/reg', function(req, res, next) {
    var logeduser = req.session.user;
    var user = req.body.user;
    var _user;
    Users.findByName(user.name,function(err,useritem){
        if(err){
            console.log(err);
        }else if(!useritem){
            _user = new Users(user);
            _user.save(function(err) {
                if (err) {
                    req.flash('error', err);
                } else {
                    req.session.user = _user;
                    console.log(req.session);
                    res.redirect('/');
                }
            });
        }else{
            res.redirect('back');
            console.log("已存在");
        }
    })
    
})
//登录get
router.get('/login', function(req, res, next) {
    var logeduser = req.session.user;
    res.render('login', {
        title: "Login",
        logeduser : logeduser
    });
});
//登录post
router.post('/login', function(req, res, next) {
    var tryuser = req.body.user
    Users.findByName(tryuser.name,function(err,user){
        if(err){
            req.flash('error',err);
        }else if(!user){
            console.log('no such user');
            res.redirect('back');
        }else if(tryuser.password !== user.password){
            console.log('User name or Password error');
            console.log('PWD status: '+(tryuser.password === user.password));
            console.log('PWD query: '+user.password);
            console.log('PWD input: '+tryuser.password);
            res.redirect('back');
        }else{
            req.session.user = user;
            console.log('login success!');
            res.redirect('/');
        }
    })
})

//发布post
router.post('/post', function(req, res, next) {
    var logeduser = req.session.user;
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
router.get('/logout', function(req, res, next) {
    var logeduser = req.session.user;
    req.session.user = null;
    res.redirect("/login");
});
//用户get
router.get('/user/:id', function(req, res, next) {
    var logeduser = req.session.user;
    if(!logeduser){
        res.redirect("/login");
    }
    console.log(req.params.id);
	Users.findById(req.params.id,function(err,user){
		res.render('user', {
	        title: "User",
	        user: user,
            logeduser : logeduser
	    });
	})
    
});
module.exports = router;