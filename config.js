const mongoose = require('mongoose')
const connect = mongoose.connect("mongodb://127.0.0.1:27017/BlogsDB")

connect.then(function () {
    console.log("DB connected")
}).catch(function () {
    console.log("DB connection has failed")
})

const BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true,

    },
},{timestamps:true});

const collection = new mongoose.model("blogs", BlogSchema);

module.exports = collection
