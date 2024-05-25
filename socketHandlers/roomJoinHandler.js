const serverStore = require("../serverStore");
const roomUpdates = require("./updates/rooms");

const roomJoinHandler = (socket, data) => {
  const {roomId} = data;

  const participantDetails = {
    userId: socket.user.id,
    socketId: socket.id
  };

  const roomDetails = serverStore.getActiveRoom(roomId);
  serverStore.joinActiveRoom(roomId, participantDetails);

  // send information to users in room that they should prepare for incoming connection
  roomDetails.participants.forEach((participant)=>{
    if (participant.socketId !== participantDetails.socketId) {
      socket.to(participant.socketId).emit("conn-prepare", {
        connUserSocketId: participantDetails.socketId,
      });
    }
    
  })
  roomUpdates.updateRooms()
};

module.exports = roomJoinHandler;
