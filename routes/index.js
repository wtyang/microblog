var express = require('express');
var moment = require('moment');
var session = require('express-session');
var cookie = require('cookie-parser');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var router = express.Router();
var Users = require('../models/user');
var Posts = require('../models/posts');


var limitItems = 5,//分页每页显示几条留言
    numberOfPages = 5; //分页显示几页
/* 首页 */
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
})
.post('/',function(req,res,next){
    if(req.body.currentPage){
        //获取当前分页页码，返回当前分页留言列表
        var currentPage = req.body.currentPage;
        Posts.fetchLimit(limitItems,currentPage,function(err,limitposts){
            if(err){
                throw err;
            }else{
                Posts.fetch(function(err, posts) {
                    if(err){
                        throw err;
                    }else{
                        var totalPages = Math.ceil(posts.length/limitItems);
                        res.send({
                            postlist : limitposts,
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
.delete('/',function(req,res,next){
    var id = req.body.postId;
    Posts.remove({_id : id},function(err,removed){
        if(err){
            throw err;
        }else{
            res.send({success:1});
        }
    })
})
//注册
router.get('/reg', function(req, res, next) {
    var logeduser = req.session.user;
    res.render('reg', {
        title: 'Register',
        logeduser : logeduser
    });
})
.post('/reg',function(req, res, next) {
    var logeduser = req.session.user;
    var _user;
    var form = new multiparty.Form({uploadDir: './public/uploads/'});
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log('parse error: ' + err);
        } else {
            var filesTmp = JSON.stringify(files);
            Users.findByName(fields['name'],function(err,useritem){
                if(err){
                    console.log(err);
                }else if(!useritem){
                    var inputFile = files['face'][0];
                    var uploadedPath = inputFile.path;
                    var dstPath = './public/uploads/' + inputFile.originalFilename;
                    console.log(dstPath);
                    //重命名为真实文件名
                    fs.rename(uploadedPath, dstPath, function(err) {
                        var user;
                        if (err) {
                            console.log('rename error: ' + err);
                            user = {
                                name : fields['name'],
                                password : fields['password'],
                            }
                        } else {
                            user = {
                                name : fields['name'],
                                password : fields['password'],
                                face : '/uploads/' + inputFile.originalFilename
                            }
                            
                        }
                        _user = new Users(user);
                        _user.save(function(err) {
                            if (err) {
                                req.flash('error', err);
                            } else {
                                Users.findByName(user.name,function(err,logeduser){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        req.session.user = logeduser;
                                        res.redirect('/');
                                    }
                                })
                            }
                        });
                    });
                    
                }else{
                    console.log("已存在");
                    fs.unlink(files['face'][0].path, function (err) {
                        if (err) {
                            throw err;
                        }else{
                            console.log('successfully deleted : ' + filesTmp.path);
                            res.redirect('back');
                        }
                    });
                }
            })
        }
    });
    
    
})
//登录
router.get('/login', function(req, res, next) {
    var logeduser = req.session.user;
    res.render('login', {
        title: "Login",
        logeduser : logeduser
    });
})
.post('/login', function(req, res, next) {
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
            console.log(user);
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