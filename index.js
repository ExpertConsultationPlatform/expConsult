
const express = require('express');
const app = express();
const http = require("http");
const server = require("http").createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json()); // Add this line to parse JSON requests

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect('mongodb+srv://prajwalw02:gYqJ6KDQCfp9eT4a@cluster0.ochlqqs.mongodb.net/ExpertConsultDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const expertSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});
expertSchema.add({
  categories : String,
  price : Number,
  availability: String,
  contact : Number,
  languages:String,
});

// const roomSchema = new mongoose.Schema({
//   roomID: String,
//   users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//   experts: [{ type: Schema.Types.ObjectId, ref: 'Expert' }],
//   roomName: String,
//   roomType: String,
//   createdAt: Date
// });

const messageSchema = new mongoose.Schema({
  room: String,
  author: String,
  message: String,
  fileUrl: String,
  timestamp: Date,
  isUser: Boolean,
  date: Date,
});
const fileSchema = new mongoose.Schema({
  room: String, 
  author: String, 
  fileName: String, 
  // fileData: String,
  date: Date, 
  fileUrl: String,
});

const User = mongoose.model('User', userSchema);
const Expert = mongoose.model('Expert', expertSchema);
// const Room = mongoose.model('Room', roomSchema);
const Message = mongoose.model("Message", messageSchema);
const File = mongoose.model("File", fileSchema);

app.post('/user', async (req, res) => {
  const { username, email, password } = req.body;

  const user = new User({
    username,
    email,
    password
  });

  try {
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/expert', async (req, res) => {
  const { username, email, password, categories, price, availability, contact, languages} = req.body;

  const expert = new Expert({
    username,
    email,
    password, 
    categories, 
    price,
    availability,
    contact,
    languages, 
  });

  try {
    await expert.save();
    res.status(201).json({ message: 'Expert created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (user && user.password === password) {
        // Successful login
        return res.status(200).json({ message: 'Login successful' });
      }
  
      // Login failed
      return res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/expert/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const expert = await Expert.findOne({ email });
  
      if (expert && expert.password === password) {
        return res.status(200).json({ message: 'Login successful' });
      }
  
      return res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/getUserData', async (req, res) => {
    try {
      // Fetch expert data based on the email query parameter
      const email = req.query.email;
      const users = await User.find({ email });
  
      // Send the expert data as a JSON response
      res.json(users);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/experts', async (req, res) => {
    try {
      // Fetch all experts
      const experts = await Expert.find();
  
      // Send the expert data as a JSON response
      res.json(experts);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/getExpertData', async (req, res) => {
    try {
      // Fetch expert data based on the email query parameter
      const email = req.query.email;
      const experts = await Expert.find({ email });
  
      // Send the expert data as a JSON response
      res.json(experts);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put("/updateUserData/:email", async (req, res) => {
    const email = req.params.email; // Note the use of req.params to get the email from the URL
    const updatedUserData = req.body;

    console.log(updatedUserData)
  
    try {
      const updatedUser = await User.findOneAndUpdate({ email: email }, {
        $set: {
          username: updatedUserData.name, // Access username from the request body
          // Add more fields as needed
        }
      }, { new: true });
        
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      console.log("User data updated successfully");
      res.status(200).json({ message: "User data updated successfully", updatedUser });
    } catch (err) {
      console.error("Error updating user data:", err);
      res.status(500).json({ error: "Failed to update user data." });
    }
  });

  app.put("/updateExpertData/:email", async (req, res) => {
    const email = req.params.email; // Get the email from the URL parameter
    const updatedExpertData = req.body; // This is the data sent in the request body
  
    try {
      const updatedExpert = await Expert.findOneAndUpdate({ email: email }, {
        $set: {
          username: updatedExpertData.name, // Access username from the request body
          categories: updatedExpertData.categories, // Access category from the request body
          price: updatedExpertData.price, // Access price from the request body
          availability: updatedExpertData.availability,
          contact: updatedExpertData.contact, // Access contact from the request body
          languages: updatedExpertData.languages, // Access language from the request body
          // Add more fields as needed
        }
      }, { new: true });
  
      if (!updatedExpert) {
        return res.status(404).json({ error: "Expert not found" });
      }
  
      console.log("Expert data updated successfully");
      res.status(200).json({ message: "Expert data updated successfully", updatedExpert });
    } catch (err) {
      console.error("Error updating expert data:", err);
      res.status(500).json({ error: "Failed to update expert data." });
    }
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
      delete data._id;
  
      const newMessage = new Message(data);
      newMessage.save()
        .then(() => {
          console.log('Message saved successfully');
        })
        .catch((err) => {
          console.error('Error saving message:', err);
        });
    });
    socket.on("send_file", (data) => {
      const { room, author, fileName, fileData } = data;
  
      // Create a new File document and save it to the database
      const newFile = new File({
        room,
        author,
        fileName,
        // fileData,
        date: new Date(),
        fileUrl: `/uploads/${fileName}`
      });
  
      newFile.save()
        .then(() => {
          console.log('File saved successfully');
          // Emit the "receive_file" event to notify clients about the uploaded file
          io.to(room).emit("receive_file", {
            room,
            author,
            fileName,
            message: `${fileName}`,
            date: new Date(),
            fileUrl: `/uploads/${fileName}`
          });
        })
        .catch((err) => {
          console.error('Error saving file:', err);
        });
    });
    socket.on("user_connect_history", (userId, roomName) => {
      Promise.all([
        Message.find({ room: roomName }).exec(),
        File.find({ room: roomName }).exec(),
      ])
        .then(([messageHistory, fileHistory]) => {
          // Process message history and include align-self styles
          const formattedMessageHistory = messageHistory.map((message) => ({
            ...message.toObject(),
            isUser: message.author === userId,
            isFile: false, // Add isFile property for messages
          }));
    
          // Process file history and include align-self styles
          const formattedFileHistory = fileHistory.map((file) => ({
            ...file.toObject(),
            isUser: file.author === userId,
            isFile: true, // Add isFile property for files
          }));
    
          // Combine message and file history and send it to the client as an array
          socket.emit("chat_history", [...formattedMessageHistory, ...formattedFileHistory]);
        })
        .catch((err) => {
          console.error('Error fetching chat history:', err);
        });
    });
    
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
    socket.on("error", (error) => {
      console.error("Socket Error:", error);
    });
  });
  

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send('Server is running.');
});

// io.on('connection', (socket) => {
//   socket.emit('me', socket.id);

//   socket.on('disconnect', () => {
//     socket.broadcast.emit('callended');
//   });

//   socket.on("calluser", ({ userToCall, signalData, from, name }) => {
//     io.to(userToCall).emit("calluser", { signal: signalData, from, name });
//   });

//   socket.on("answercall", (data) => {
//     io.to(data.to).emit("callaccepted", data.signal);
//   });
// });

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));