const { ObjectId } = require('mongodb')
const mongoose = require('./mongoConnect')
const Schema = mongoose.Schema
const userSchema = Schema({
    username : {
        type: String,
        required: true
    }
})

const exerciseSchema = Schema({
    userId : {
        type: ObjectId,
        required : true
    },
    description : {
        type: String,
        required : true
    },
    duration : {
        type: Number,
        required : true
    },
    date : {
        type: Date,
        required : false
    }
})

var User = mongoose.model('User', userSchema)
var Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports.User = User
module.exports.Exercise = Exercise