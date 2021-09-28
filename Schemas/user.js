const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require: true,
    min: 5
  },
  profilePicture:{
      type: String,
      default: "",
  }
},
  {timestamps:true}
);

module.exports = mongoose.model("User",userSchema);
