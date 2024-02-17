const express = require('express');
const mongoose = require('mongoose');
const app = express()
const jsw = require('jsonwebtoken');
const cors = require('cors');
require('dotenv/config');
// MODELS 
// const UserModel = require ('./src/models/UserModel')
// const Blog = require ('./src/models/Blog')
//Routes
const UserRoute = require('./src/Routes/UserRoute')
const BlogRoute = require('./src/Routes/BlogRoute');
const { json } = require('body-parser');

//connection to database 
// mongodb+srv://admin:admin@cluster0.3vq7b6q.mongodb.net/api_web_tech_assignment
// console.log(process.env.MONGO_URL)
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
// mongoose.connect('mongodb+srv://admin:admin@cluster0.3vq7b6q.mongodb.net/test2_2_2023')
  .then(() => console.log('database Connected!'))
  .catch((e) => console.log('Error!!! to connect the database' + e.message))
// MIDDLEWARE






app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const tokenVarification = (req,res,next)=>{
  if(req.headers.authorization){
    const token = req.headers.authorization;
    jsw.verify(token,'hirak',(err,decode)=>{
      if(err){
        return res.status(403).json({
          status:'filed/ login againn'
        })
      }
      req.userID = decode.data;
      next();
    })
  }else{
    res.json({
      status: 'failed',
      messege: "token missing "
    })
  }
}


app.use("/user",UserRoute);
app.use('/blog',tokenVarification,BlogRoute)
// app.use("/blog",med,BlogRoute);
//BAD REQUEST
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'Failed',
    message: '404! not found'
  })
})

app.listen(4000, () => console.log('server start at port 4000....'))
