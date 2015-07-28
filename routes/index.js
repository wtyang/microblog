var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
router.get('/reg', function(req, res, next) {
    res.render('reg', {
        title: 'Register'
    });
});
router.post('/reg', function(req, res, next) {})
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: "Login"
    });
});
router.post('/login', function(req, res, next) {})
router.get('/post', function(req, res, next){
	res.render('post', {
		title: 'Post'
	});
});
router.post('/post', function(req,res,next){

});
router.get('/logout', function(req,res,next){

});
module.exports = router;