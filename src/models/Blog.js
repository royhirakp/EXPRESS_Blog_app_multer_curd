const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 const BlogSchma = new Schema({
    title: String,
    image: {
      data: Buffer,
      contentType: String
    },
    date: {type: Date, default: Date.now()},
    describtion: String,
    user: {type: ObjectId, ref: "User"}
 })
const BlogModel = mongoose.model('Blog',BlogSchma)
module.exports = BlogModel

