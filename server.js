//require express
const express=require("express")
//require connectDB
const connectDB=require("./config/connectDB")
//Require the Router
const authRouter=require('./routes/auth')
//init express
const app=express()
//Middleware==>Parse the data to json
app.use(express.json())
//connectDB
connectDB()
//use Routes 
app.use('/api/auth',authRouter)
//create port 
const port=5000

//listen the server
app.listen(port,(error)=>
error
?console.log(error)
:console.log(`server is running on port ${port}`))
