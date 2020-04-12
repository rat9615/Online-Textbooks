const express = require('express')
const router = express.Router()

//static
router.use(express.static('public'))

router.get('/login', function(req,res){
    res.render('login')
})

router.get('/forgot-password',function(req,res){
    res.render('forgot-password')
})

router.get('/register',function(req,res){
    res.render('register')
})


module.exports = router