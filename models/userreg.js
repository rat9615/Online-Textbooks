const mongoose = require('mongoose')
const passmongoose = require('passport-local-mongoose')
mongoose.connect('mongodb://localhost:27017/onlinetextbookdbs',{useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true})

var db  = mongoose.connection
db.on('error',console.error.bind(console,'Connection Error'))
db.once('open',function(){
    console.log('Connected Successfully')
})

var userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 25
    },
    lastname : {
        type : String,
        required : true,
        minlength : 1,
        maxlength : 25
    },
    username : {
        type : String,
        required : true,
    },
    usn : {
        type : String,
        required : true,
        unique : true,
    },
    course :{
        type : String,
        required : true,
    },
})

userSchema.plugin(passmongoose)
var userreg = new mongoose.model('userreg', userSchema)

module.exports = userreg
