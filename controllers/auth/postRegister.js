const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postRegister = async (req, res) => {
  try {
    const { username, password, mail } = req.body;

    // check if user exists
    const userExists = await User.exists({mail: mail.toLowerCase()});

    if (userExists) {
      return res.status(409).send("E-mail already in use")
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user document and save it in database

    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword
    });

    // create JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        mail: user.mail,
      },
      process.env.TOKEN_KEY, {
        expiresIn: '24h'
      }
    );

    res.status(200).send({
      message: "User saved successfully",
      userDetails:{
        id: user._id,
        username: user.username,
        mail: user.mail,
        token: token
      }
    })


  } catch (err) {
    return res.status(500).send("Error occured. Please try again")
  }
}

module.exports = postRegister