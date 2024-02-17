const express = require('express')
// const bcrypt = require('bcrypt')
const jsw = require('jsonwebtoken')
const { body } = require('express-validator');
const multer = require('multer');
const router = express.Router();
const fs = require('fs')
const BlogModel = require('../models/Blog')
const bodyParser = require('body-parser')
router.use(bodyParser.json())

// FileStore IMAGE
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'public/image')
    },
    filename:(req,file,cb)=>{
      cb(null, file.originalname)
    }
  })
const uplode = multer({storage: storage})

router.post('/',uplode.single('image') ,async (req,res)=>{
    console.log(req.body,'req.body')
    console.log(req.file,'req.file')
    console.log(req.files,'req.files')
    console.log(req.file.filename,'req.file.filename')
    try {
        const createBlog = await BlogModel.create({
            title: req.body.title,
            image: {
                data: fs.readFileSync('public/image/' + req.file.filename),
                contentType: 'image/png'
              },
            describtion: req.body.describtion,
            user: req.userID
        })
        res.json({
            createBlog:  createBlog,
            status:"sucsess"
           
        })
    } catch (error) {
        res.json({
            status:"error",
           messege: error.messege
        })
    }
})

router.get('/', async (req,res)=>{
    try {
        // console.log(req.userID)
        let blog = await BlogModel.find({user:req.userID});
    res.json({
        status:'susecss',
        blog
    })
        
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            messege: error.messege
        })
        
    }

})

module.exports = router;