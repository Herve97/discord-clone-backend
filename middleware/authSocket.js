const jwt = require('jsonwebtoken');
const config = process.env;

const verifyTokenSocket = (socket, next)=>{
  // console.log("Mon handshake: ", socket.handshake.auth);
  const token = socket.handshake.auth?.token;
  // console.log("Mon token: ", token);

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    socket.user = decoded;
    // console.log("Mon socket user: ", socket.user);
  } catch (err) {
    const socketError = new Error('NOT_AUTHORIZED');
    return next(socketError);
  }

  next()

}

module.exports = verifyTokenSocket;