const User=require("../models/userModel");
const bcrypt=require("bcrypt");

module.exports.register= async (req,res,next)=>{

    try{
    const {username,password,email}=req.body;

   const checkUsername= await User.findOne({username});
   if(checkUsername)
    return res.json({msg:"Username is already used", status:false});

   const checkEmail=await User.findOne({email});
   if(checkEmail)
    return res.json({msg:"Email is already used", status:false});

   const hashedPassword=await bcrypt.hash(password,10);
   const user=await User.create({
        username,
        email,
        password:hashedPassword
   });

   delete user.password;
   return res.json({status:true,user});
}catch(ex){
    next(ex);
}

};


module.exports.login= async (req,res,next)=>{

    try{
    const {password,username}=req.body;
    const user=await User.findOne({username});
    if(!user)
    return res.json({msg:"Incorrect Username or Password", status:false});
 
    const isPasswordValid=await bcrypt.compare(password,user.password);
    
    if(!isPasswordValid)
    return res.json({msg:"Incorrect Username or Password", status:false});

    delete user.password;
    return res.json({status:true,user});
 }catch(ex){
     next(ex);
 }
 };

 module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };
  