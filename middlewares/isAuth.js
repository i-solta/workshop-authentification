//require Json  web token
const jwt=require('jsonwebtoken')
//Require the useer Schema
const User=require('../models/User')

const isAuth=async(req,res,next)=>{
    try{
        const token=req.headers['x-auth-token']

        //check for token
        if(!token)
        return res.send({msg:'Not token,authorization denied'})

        //verify token, decrryptage token 
        const decoded =await jwt.verify(token,process.env.secretOrkey)
        
        //add user from payload
        const user = await User.findById(decoded.id)

        //check for user
        if(!user){
            return res.send({msg:"authorization denied"})
        }

      //create user 
      req.user=user  

      next()


    }
    catch(error){
           return res.send({msg:"token is not valid"})
    }
}
module.exports=isAuth;