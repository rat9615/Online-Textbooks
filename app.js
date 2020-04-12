const express = require('express')
const app = express()
const ejs = require('ejs')

//EJS
app.set('view engine','ejs')

//routes
app.use('/users', require('./routes/user'))
app.use('/', require('./routes/index'))



//Setting up dynamic PORT env variable
const port = process.env.PORT || 3000
app.listen(port,() => console.log(`Listening on port ${port}`))