const router = require("express").Router();
const User = require("../Schemas/user");
const {Post,Comment} = require("../Schemas/post");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//create a post:

router.post("/",async(req,res)=>{

  const newPost=new Post(req.body);

  try{
    const record=await newPost.save();
    res.status(200).json(record);
  }catch(err){
    res.status(500).json(err);
  }

});

//update a post:

router.put("/:id",async(req,res)=>{

  try{
    const post=await Post.findById(req.params.id);

    if(req.body.userId===post.userId){
      const postUpdate={
        postId: req.params.id,
        userId: post.userId
      }
      const token=jwt.sign(postUpdate,process.env.ACCESS_TOKEN_SECRET);
      // await post.updateOne({$set:req.body});
      res.status(200).json(token);
    }
    else{
      res.status(403).json("Cant update others posts");
    }

  }catch(err){
    res.status(500).json(err);
  }

});

router.put("/:id/update",verifyToken,async(req,res)=>{
  await jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET,async(err,authData)=>{
    if(err){
      res.status(403);
    }
    else{
      const post=await Post.findById(req.params.id);
      await post.updateOne({$set:req.body});
      // console.log(req.body);
      res.status(200).json("post updated");
    }
  });
})

//delete a post:

router.delete("/:id",async(req,res)=>{

  try{
    const post=await Post.findById(req.params.id);

    if(req.body.userId===post.userId){
      const postUpdate={
        postId: req.params.id,
        userId: post.userId
      }
      const token=jwt.sign(postUpdate,process.env.ACCESS_TOKEN_SECRET);
      // await post.deleteOne();
      res.status(200).json(token);
    }
    else{
      res.status(403).json("couldnt delete post");
    }

  }catch(err){
    res.status(500).json(err);
  }

});

router.delete("/:id/delete",verifyToken,async(req,res)=>{
  await jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET,async(err,authData)=>{
    if(err){
      res.status(403);
    }
    else{
      const post=await Post.findById(req.params.id);
      await post.deleteOne();
      // console.log(req.body);
      res.status(200).json("post deleted");
    }
  });
})

//get a post:

router.get("/:id",async(req,res)=>{

  try{
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  }catch(err){
    res.status(500).json(err);
  }

});

//like posts:

router.put("/:id/like",async(req,res)=>{

  try{
    const post=await Post.findById(req.params.id);

    if(!post.likes.includes(req.body.userId)){
      await post.updateOne({$push: {likes: req.body.userId}});
      res.status(200).json("Post liked");
    }
    else{
      await post.updateOne({$pull: {likes: req.body.userId}});
      res.status(200).json("Post disliked");
    }
  }catch(err){
    res.status(500).json(err);
  }

});

//comment on posts:

router.put("/:id/comment",async(req,res)=>{

  try{
    const post=await Post.findById(req.params.id);

    if(!post){
      res.status(403).json("post does not exist");
    }
    else{
      const newComment=new Comment({
        userId: req.body.userId,
        comment: req.body.comment
      });

      await post.updateOne({$push: {comments: newComment}});
      res.status(200).json("comment added");
    }
  }catch(err){
    res.status(500).json(err);
  }

});

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
