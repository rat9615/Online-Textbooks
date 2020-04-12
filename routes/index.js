const express = require('express')
const path = require('path')
const router = express.Router()

//static
router.use(express.static('public'))

//index
router.post('/', function(req,res){
    res.render('index')
})

module.exports = router