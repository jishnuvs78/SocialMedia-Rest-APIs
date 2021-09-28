const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../Schemas/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

router.post("/signup",async(req,res)=>{

  try{
    const salt=await bcrypt.genSalt(10);
    const hashedPass=await bcrypt.hash(req.body.password,salt);

    const newUser=new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const record=await newUser.save();
    res.status(200).json(record);
  }
  catch(err){
    res.status(500).json(err);
  }

});

router.post("/login",async(req,res)=>{

  try{
    const user=await User.findOne({email:req.body.email});
    if(!user){
      res.status(404).json("user not found");
    }
    else{
      const validPass=await bcrypt.compare(req.body.password,user.password);

      if(!validPass){
        res.status(404).json("Incorrect password");
      }else{
        const userLog={
          id: user._id,
          name: user.username,
          email: user.email,
          profilePicture: user.profilePicture
        }

        const token=jwt.sign(userLog,process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json(token);
      }
    }
  }catch(err){
    res.status(500).json();
  }

});

router.post("/login/user",verifyToken,(req,res)=>{
  jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET,(err,authData)=>{
    if(err){
      res.status(403);
    }
    else{
      res.json(authData);
    }
  });

})

function verifyToken(req,res,next){
  const bearerHeader=req.headers["authorization"];
  if(typeof bearerHeader !== "undefined"){
    const bearerToken=bearerHeader.split(" ")[1];
    req.token=bearerToken;
    next();
  }
  else{
    res.status(403);
  }
}

module.exports = router;
