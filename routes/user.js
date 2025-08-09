const  {Router} = require('express');
const  { userModel , purchaseModel } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require("../config")
const { userMiddleware } = require("../middleware/user"); // adjust path



const userRouter = Router();



userRouter.post("/signup",async function (req,res){
    const  { email, password ,firstName , lastName} = req.body; // TODO : adding zod validation
     // TODO : hash the password so plaintext ow is not stored in the db

     // TODO : put inside a try catch block
     await userModel.create ({
        email: email,
        password: password,
        firstName : firstName,
        lastName : lastName
     })

    res.json({
        message:"signup succeded",
    })
})


userRouter.post("/signin",async function (req,res){
    const { email , password} = req.body;

    const user = await userModel.findOne({
        email:email,
        password: password
    });

    if (user){
       const token =  jwt.sign({
            id: user._id,
        },JWT_USER_PASSWORD); 
        
        res.json ({
            tokne:token 
        })

    } else {

        res.status(403).json({
            message : "Incorrect credentials"
        })
    }
    res.json({
        message:"signin endpoint"
    })
})



userRouter.get("/purchases", userMiddleware ,async function (req,res){
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
        
    });

    let purchasedCourseIds = [];

    for( let i =0; i<purchases.length; i++){
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: {$in: pirchasedCourseIds}
    })

    
    res.json({
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter: userRouter
}

