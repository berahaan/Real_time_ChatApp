const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { chat, User, Messages } = require("./UserModel.jsx");
const app = express();
const PORT = 5000;
const socket = require("socket.io");
mongoose
  .connect("mongodb://localhost:27017/chat-application")
  .then(() => {
    console.log("Mongodb is connected ");
  })
  .catch((error) => {
    console.log("error:", error);
  });

app.use(
  cors({
    origin: "http://localhost:5173", // Correct client origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.post("/register", async (req, resp, next) => {
  const { username, password, email } = req.body;
  if (!username) {
    return resp
      .status(400)
      .json({ message: "Username is required", status: false });
  }

  try {
    const userCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });
    if (userCheck) {
      return resp.json({
        message: "Username already exists",
        status: false,
        already: true,
      });
    }

    if (emailCheck) {
      return resp.json({ message: "Email already exists", status: false });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashPassword,
      email,
    });

    // Remove the password field from the response
    user.password = undefined;

    return resp.status(201).json({ status: true, user });
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, resp, next) => {
  const { username, password } = req.body;
  try {
    const Userfind = await User.findOne({ username });
    if (!Userfind) {
      return resp.json({
        message: "user not found with this username",
        status: false,
      });
    }
    const comparePassword = await bcrypt.compare(password, Userfind.password);
    if (!comparePassword) {
      return resp.json({
        message: "Incorrect password or username",
        status: false,
      });
    }
    delete Userfind.password;
    return resp.json({ status: true, Userfind });
  } catch (error) {
    next(error);
  }
});
app.post("/setAvatar/:id", async (req, resp) => {
  const id = req.params.id; // Correctly extract the id parameter
  const avatarImage = req.body.image;
  console.log("reached here ");
  try {
    const userData = await User.findByIdAndUpdate(
      id,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true } // Return the updated document
    );
    if (userData) {
      return resp.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } else {
      return resp.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return resp.status(500).json({ error: "Server error" });
  }
});
app.get("/alluser/:id", async (req, resp, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return resp.json(users);
  } catch (error) {
    next(error);
  }
});
///////////////////////////////////////////////////////////////////
app.post("/addmessage", async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "Message Added successfully" });
    }
    return res.json({ msg: "Message is not added to DB" });
  } catch (error) {
    next(error);
  }
});

app.post("/getMessage", async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectMessage = messages.map((msg) => ({
      fromself: msg.sender.toString() === from,
      message: msg.message.text,
    }));

    res.json(projectMessage);
  } catch (error) {
    next(error);
  }
});

///////////////////////////////////////////////////////////////////
const server = app.listen(PORT, () => {
  console.log(`The server is listening to port ::${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173", // Correct client origin
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    }
  });
});
