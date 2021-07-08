const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./model').User
const Exercise = require('./model').Exercise



app.post('/api/users', bodyParser.urlencoded({ extended : false}), (req, res) => {
    User.find({
        username : req.body.username
    }, (err, data) => {
        if(data.length != 0) return res.send("Username already taken")
        else{
            const u = new User({
                username : req.body.username
            })
            u.save((err, data) => {
                if(err) return res.send(err)
                res.json({
                    username: data.username,
                    _id : data._id
                })
            })
            
        }
    })
})

app.get('/api/users', (req, res) => {
    User.find({})
    .select('username _id')
    .exec((err, data) => {
        if(err) return res.send(err)
        res.json(data)
    })
})
function getFormattedDate(specifiedDate)
{
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    var date = new Date(specifiedDate)
    var day = days[date.getDay()]
    var month = months[date.getMonth()]
    var number = date.getUTCDate().toString()
    number = number.length==2 ? number : "0"+number
    var year = date.getFullYear()
    return `${day} ${month} ${number} ${year}`
}

app.post('/api/users/:_id/exercises', (req, res) => {
    var date = (req.body.date ? (req.body.date) : (new Date()))
    const e = new Exercise({
        userId : req.params._id,
        description : req.body.description,
        duration : req.body.duration,
        date : date
    })
    User.findById(req.params._id, (err, user) => {
        if(err) return res.send(err)
        e.save((err, exercise) => {
            if(err) return res.send(err)
            res.json({
                _id : exercise.userId,
                username : user.username,
                date : getFormattedDate(exercise.date),
                duration : exercise.duration,
                description : exercise.description 
            })
        })
    })
})


app.get('/api/users/:_id/logs', (req, res) => {
    let params = (new URL(req.get('host') + req.url)).searchParams;
    let from = params.get('from')
    let to  = params.get('to')
    let limit = params.get('limit')
    let userId = req.params._id
    User.findById(userId, (err, data) => {
        if(err) return res.send(err)
        let username = data.username
        let query = Exercise.find({
            userId : userId
        }).select('-userId -_id -__v')
        
        if(limit)
            query.limit(parseInt(limit))
        if(from && to)
        {
            query.find({
                date:{
                    $gte : from,
                    $lte : to
                }
            })
        }
        query.exec((err, data) => {
            if(err) return res.send(err)
            var newData = []
            for(var i = 0; i<data.length; ++i)
            {
                newData.push({
                    description : data[i].description,
                    duration : data[i].duration,
                    date : getFormattedDate(data[i].date)
                })
            }
            res.json({
                "_id" : userId,
                "username" : username,
                "count" : data.length,
                "log" : newData
            })
        })
    })
})


module.exports = app