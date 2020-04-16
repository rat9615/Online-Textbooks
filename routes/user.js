const express = require('express')
const router = express.Router()
const userreg = require('../models/userreg')
const passport = require('passport')


//static
router.use(express.static('public'))

router.get('/login', function(req,res){
    res.render('login')
})

router.get('/forgot-password',function(req,res){
    res.render('forgot-password')
})

router.get('/register',function(req,res){
    res.render('register',{ user : 'null' })
})

router.post('/register',function(req,res){
    userreg.register(new userreg({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        username : req.body.email,
        usn : req.body.usn,
        course : req.body.course
    }), req.body.password, function(err,userreg){
        if (err){
            console.log(err)
            res.render('register',{ user:'error' })
        }
        else{
            console.log('no error')
            res.render('submit-success',{ username:req.body.firstname })
        }
    })
})

module.exports = router