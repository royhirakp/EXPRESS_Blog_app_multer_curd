const express = require('express')
const bcrypt = require('bcrypt')
const jsw = require('jsonwebtoken')
const { body } = require('express-validator')
const router = express.Router();
const userModel = require('../models/UserModel')
const bodyParser = require('body-parser')
// const  = require('')
const malter = require('multer')
router.use(bodyParser.json())
// const app = express()
//REGISTER ROUTE 
router.post('/register', body('email').isEmail(), body('password').isLength({ min: 8 }), async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email)
        let userdata = await userModel.findOne({ email })
        if (userdata) {
            return res.status(409).json({
                status: "user alredy exist "
            })
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) return res.status(400).json({ status: " bicript failed" })
            userdata = await userModel.create({
                email: email,
                password: hash
            })
            res.json({
                status: "register susecess",
                userdata
            })
        })
    } catch (error) {
        res.json({
            status: "failsdd",
            messege: error.messege
        })
    }
})
//..............................................
//LOGIN ROUTE 
router.post('/login', body('email').isEmail(), body('password').isLength({ min: 8 }), async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email)
        let userdata = await userModel.findOne({ email })
        if (userdata) {
           let result = await bcrypt.compare(password, userdata.password);
           if(result){
            //token
            const token = jsw.sign({
                exp: Math.floor(Date.now()/1000)+ 60*60,
                data : userdata._id,
            },'hirak');
            res.json({
                status:"sucesess",
                messege: "user login sucessfull",
                token
            })
           }else{
            res.status(400).json({
                status:'password not matched',
            })
           }
        }else{
            res.status(400).json({
                status:'user not register/ register brfore login',
            })
        }       
    } catch (error) {
        res.json({
            status: "failed",
            messege: error.messege
        })
    }
})
//..............................................
module.exports = router;
