const Conversation = require("../models/conversation");
const ChatUpdates = require('./updates/chat');

const directChatHistoryHandler = async (socket, data) => {

  try {
    const { id } = socket.user;
    const { receiverUserId} = data;

    const conversation = await Conversation.findOne({
      participants: {$all: [id, receiverUserId]},
      type: "DIRECT"
    });

    if (conversation) {
      ChatUpdates.updateChatHistory(conversation._id.toString(), socket.id)
    }

  } catch (error) {
    console.error(error);

  }

};

module.exports = directChatHistoryHandler;
