require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://user_001:jai12345@cluster0.s3mlv.mongodb.net/myDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

module.exports = mongoose