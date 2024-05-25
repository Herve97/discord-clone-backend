const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require('../../socketHandlers/updates/friends');

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;

  const { id, mail } = req.user;

  // console.log("Req user: ", req.user);

  // check if friend that we would like to invite is not user
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res
      .status(409)
      .send("Sorry. You cannot become friend with yourself.");
  }

  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase()
  });

  if (!targetUser) {
    return res.status(404).send(`Friend of ${targetMailAddress.toLowerCase()} has not been found. Please check mail address.`)
  }

  // check if the invitation has been already sent
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: id,
    receiverId: targetUser._id
  });

  if (invitationAlreadyReceived) {
    return res.status(409).send("Invitation has been already sent.")
  }

  // check if the user which we would like to invite is already our friend
  const userAlreadyFriends = targetUser.friends.find(friendId=> friendId.toString() === id.toString());

  if (userAlreadyFriends) {
    return res.status(409).send("Friend already added. Please check friends list")
  }

  // create new Invitation in database
  const newInvitation = await FriendInvitation.create({
    senderId: id,
    receiverId: targetUser._id,
  });

  // if invitation has been successfully created we would like to update friends invitations if other users is online
  

  // send pending invitations update to specific user
  friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

  return res.status(201).send("Invitation has been sent!");
};

module.exports = postInvite;
