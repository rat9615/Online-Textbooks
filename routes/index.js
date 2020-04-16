const express = require('express')
const router = express.Router()
const passport = require('passport')
const userreg = require('../models/userreg')

//static
router.use(express.static('public'))

//index
router.post('/', passport.authenticate('local',{ failureRedirect :'/users/login'}), function(req,res){
    userreg.find({}, function(err,data){

        res.render('index',{ logindata : data })
    })
    
})


module.exports = router