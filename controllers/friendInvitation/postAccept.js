const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");


const postAccept = async (req, res) =>{
  
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);

    if(!invitation){
      return res.status(401).send("Error occured. Please try again!")
    }

    const {senderId, receiverId} = invitation;

    // add friend to both user
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId]

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    // delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    // update the list of friends if the users are online


    // update the list of pending invitations
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());

    return res.status(200).send("Invitation successfully added");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong please try again.");
  }

}

module.exports = postAccept;