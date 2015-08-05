var express = require('express');
var moment = require('moment');
var session = require('express-session');
var cookie = require('cookie-parser');
var multiparty = require('connect-multiparty');
var crypto = require('crypto');
var mongoose = require('mongoose');
var router = express.Router();
var Users = require('../models/user');
var Posts = require('../models/posts');


var limitItems = 5,//分页每页显示几条留言
    numberOfPages = 5; //分页显示几页
/* 首页get */
router.get('/', function(req, res, next) {
    var logeduser = req.session.user, //登录的用户对象
        currentPage = 1, //当前第几页
        totalPages ; //总页数
    if(!logeduser){
        res.redirect("/login");
    }else{
        //查询当前页码的留言列表
        Posts.fetchLimit(limitItems,currentPage,function(err, postslimit, next) {
            if (err) {
                console.log(err);
            } else {
                //查询所有留言列表
                Posts.fetch(function(err,posts){
                    if(err){
                        console.log(err);
                    }else{
                        //查询所有用户列表
                        Users.fetch(function(err, users) {
                            if (err) {
                                req.flash('error', err);
                            }else{
                                //渲染页面
                                var totalPages = Math.ceil(posts.length/limitItems); //总页面数
                                res.render('index', {
                                    title: 'MicroBlog',
                                    posts: postslimit, //当前页面显示的留言列表
                                    users: users, //所有用户列表
                                    logeduser : logeduser,// 登录的用户对象
                                    pagination: { //分页信息
                                        currentPage : currentPage,//当前第几页
                                        totalPages : totalPages, //总页数
                                        numberOfPages : totalPages > numberOfPages ? numberOfPages : totalPages //分页显示几页
                                    }
                                });
                            }
                        });
                    }
                })
            }
        })
    }
});

router.post('/',function(req,res,next){
    if(req.body.currentPage){
        //获取当前分页页码，返回当前分页留言列表
        var currentPage = req.body.currentPage;
        Posts.fetchLimit(limitItems,currentPage,function(err,limitposts){
            res.send(limitposts);
        })
    }
})

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
	Users.findById(req.params.id,function(err,user){
		res.render('user', {
	        title: "User",
	        user: user,
            logeduser : logeduser
	    });
	})
    
});
module.exports = router;