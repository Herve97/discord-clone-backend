const User = require("../../models/user");
const Conversation = require("../../models/conversation")
const Message = require("../../models/message")
const serverStore = require("../../serverStore");

const updateChatHistory = async (conversationId, toSpecifiedSocketId=null)=>{
  const conversation = await Conversation.findById(conversationId).populate({
    path: 'messages',
    model: 'Message',
    populate: {
      path: "author",
      model: "User",
      select: "username _id"
    }
  });

  console.log("Ma conversation: ", conversation);

  if(conversation){
    const io = serverStore.getSocketServerInstance();

    if(toSpecifiedSocketId){
      // Initial update of chat history
      return io.to(toSpecifiedSocketId).emit('direct-chat-history', {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    }

    // check if users of this conversation are online
    // if yes emit to them update of messages
    
    conversation.participants.forEach(userId =>{
      const activeConnections = serverStore.getActiveConnections(userId.toString());

      activeConnections.forEach((socketId)=>{
        io.to(socketId).emit("direct-chat-history", {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      })

    })

  }

}

module.exports = {
  updateChatHistory,
};