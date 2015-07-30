var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Users = require('../models/user');
var Posts = require('../models/posts');
var moment = require('moment');
var db = mongoose.connect("mongodb://localhost/microblog");
/* GET home page. */
router.get('/', function(req, res, next) {
    Posts.find({}, function(err, posts, next) {
        if (err) {
            req.flash('error', err);
        } else {
            Users.find({}, function(err, users) {
                if (err) {
                    req.flash('error', err);
                }
                res.render('index', {
                    title: 'MicroBlog',
                    posts: posts,
                    users: users
                });
            });
        }
    })
});
router.get('/reg', function(req, res, next) {
    res.render('reg', {
        title: 'Register'
    });
});
router.post('/reg', function(req, res, next) {
    var user = req.body.user;
    var _user;
    console.log(req);
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
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: "Login"
    });
});
router.post('/login', function(req, res, next) {})
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
router.get('/logout', function(req, res, next) {});
//user
router.get('/user/:name', function(req, res, next) {
	Users.findByName(req.params.name,function(err,user){
		res.render('user', {
	        title: "User",
	        user: user
	    });
	})
    
});
module.exports = router;