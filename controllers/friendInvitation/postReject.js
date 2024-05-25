const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postReject = async (req, res) => {

  try {
    const {id} = req.body;
    const userId = req.user.id;

    // Remove that invitation from friend invitations collection
    const invitationsExists = await FriendInvitation.exists({_id: id});

    if (invitationsExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update pending invitations
    friendsUpdates.updateFriendsPendingInvitations(userId);

    return res.status(200).send('Invitation successfully rejected');

  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong please try again.");
  }
};

module.exports = postReject;
