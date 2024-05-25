const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const socketServer = require('./socketServer')

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
const server = http.createServer(app);
socketServer.registerSocketServer(server);

const authRoutes = require('./routes/authRoutes')
const friendsInvitationsRoutes = require('./routes/friendsInvitationRoutes');

mongoose.set('strictQuery', true);


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


// Register the routes
app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendsInvitationsRoutes);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Mongodb connected");
    server.listen(PORT, () => {
      console.log(`I'm alive at http://localhost:${PORT}/`)
    })

  })
  .catch((err) => {
    console.log("Database connection failed: ");
    console.error(err);
    return Error("Mongodb cannot be connected...")
  });


