const mongoose = require("mongoose");

const commentsSchema=new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
},
 { timestamps: true }
);

const postSchema=new mongoose.Schema({
  userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [commentsSchema],
 },
  { timestamps: true }
);

const Post=mongoose.model("Post",postSchema);
const Comment=mongoose.model("Comment",commentsSchema);

module.exports={Post,Comment};
