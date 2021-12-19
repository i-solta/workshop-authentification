//Require router express
const router=require ("express").Router()
//Require bcrypt
const bcrypt=require("bcrypt")
//Require the json web token
const jwt=require('jsonwebtoken')
//Require  the user SChema 
const User=require("../models/User")

require('dotenv').config({path:'../config/.env'})
// Require the isAuth middleware
const isAuth =require("../middlewares/isAuth")
//Require validators
const {validator,registerRules,loginRules}=require("../middlewares/validator")

//@route Post api/auth/register
//@desc Register new user 
//@access Public
router.post('/register',registerRules(),validator,async(req,res)=>{

    const {name,lastName,email,password}=req.body;
    try{
        
        if(!name||!lastName||!email||!password){
            return (res.json({msg:'Please enter all fields'}))
        }
        //check for existing user
        let user=await  User.findOne({email});
    if (user){
        return res.json({msg:'user already exists'})
    }
    //Create new user 
    user =new User({name,lastName,email,password})
    //create Salt & hash
    const salt=10;
    const hashedPasword=await bcrypt.hash(password,salt)
    //Replace user password with hased password
    user.password = hashedPasword;

    //save the user 
    await user.save()
//sign user

const payload={
    id:user._id
}


const token = jwt.sign(payload, process.env.secretOrkey);

    res.send({msg:'user registered with success',user,token})
    }catch(error){
        res.send({msg:'Server Error'})
    }
})
//@route Post api/auth/login
//@desc login User
//@access Public
router.post('/login',loginRules(),validator,async(req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email||!password){
            return res.send({msg:"please enter fiels"})
        }
        //check for existing user
        let user=await User.findOne({email})
        if(!user){
            return res.send({msg:"bad Credentials!email"})
        }

        //check password
        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.send({msg:"bad Credentials!password"})
        }

        //sign user
        const payload={

            id:user._id
        }

        //generate token
        const token = jwt.sign(payload, process.env.secretOrkey);

        res.send({msg:"logged in with success",user,token})
    }
    catch(error){
        res.status(500).send({msg:'server error'})
    }
})
router.get("/user",isAuth,(req,res)=>{
    res.send({user:req.user})
})
module.exports=router;