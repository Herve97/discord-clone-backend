const serverStore = require('../serverStore');
const friendsUpdate = require('./updates/friends');
const roomsUpdate = require('./updates/rooms')

const newConnectionHandler = async (socket, io)=>{
  const userDetails = socket.user;

  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.id,
  });

  // update pending friends invitations list
  friendsUpdate.updateFriendsPendingInvitations(userDetails.id);

  // update friends list
  friendsUpdate.updateFriends(userDetails.id);

  setTimeout(()=>{
    roomsUpdate.updateRooms(socket.id);
  }, [500])
}

module.exports = newConnectionHandler;