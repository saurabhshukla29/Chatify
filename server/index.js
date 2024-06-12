const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const userRoute=require("./routes/userRoute");
const messageRoutes = require("./routes/messages");
const socket = require("socket.io");

const app=express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/ping", (_req, res) => {
    return res.json({ msg: "Ping Successful" });
  });

app.use("/api/auth",userRoute);
app.use("/api/messages", messageRoutes);

mongoose.connect(process.env.MONGO_URL,{
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(()=>{
    console.log("DB Connected");
}).catch((err)=>{
    console.log(err.message);
});

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`)
});

const io = socket(server, {
cors: {
    origin: "http://localhost:3000",
    credentials: true,
},
});
  
global.onlineUsers = new Map();
io.on("connection", (socket) => {
global.chatSocket = socket;
socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
});
  
socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
    socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
});
});